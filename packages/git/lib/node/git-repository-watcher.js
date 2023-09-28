"use strict";
// *****************************************************************************
// Copyright (C) 2017 TypeFox and others.
//
// This program and the accompanying materials are made available under the
// terms of the Eclipse Public License v. 2.0 which is available at
// http://www.eclipse.org/legal/epl-2.0.
//
// This Source Code may also be made available under the following Secondary
// Licenses when the conditions for such availability set forth in the Eclipse
// Public License v. 2.0 are satisfied: GNU General Public License, version 2
// with the GNU Classpath Exception which is available at
// https://www.gnu.org/software/classpath/license.html.
//
// SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0
// *****************************************************************************
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitRepositoryWatcher = exports.GitRepositoryWatcherOptions = exports.GitRepositoryWatcherFactory = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const core_1 = require("@theia/core");
const common_1 = require("../common");
const promise_util_1 = require("@theia/core/lib/common/promise-util");
exports.GitRepositoryWatcherFactory = Symbol('GitRepositoryWatcherFactory');
let GitRepositoryWatcherOptions = class GitRepositoryWatcherOptions {
};
GitRepositoryWatcherOptions = __decorate([
    (0, inversify_1.injectable)()
], GitRepositoryWatcherOptions);
exports.GitRepositoryWatcherOptions = GitRepositoryWatcherOptions;
let GitRepositoryWatcher = class GitRepositoryWatcher {
    constructor() {
        this.onGitStatusChangedEmitter = new core_1.Emitter();
        this.onGitStatusChanged = this.onGitStatusChangedEmitter.event;
        this.syncWorkPromises = [];
        this.disposed = false;
        this.watching = false;
        this.idle = true;
        this.skipNextIdle = false;
    }
    init() {
        this.spinTheLoop();
    }
    watch() {
        if (this.watching) {
            console.debug('Repository watcher is already active.');
            return;
        }
        this.watching = true;
        this.sync();
    }
    sync() {
        if (this.idle) {
            if (this.interruptIdle) {
                this.interruptIdle();
            }
        }
        else {
            this.skipNextIdle = true;
        }
        const result = new promise_util_1.Deferred();
        this.syncWorkPromises.push(result);
        return result.promise;
    }
    dispose() {
        if (!this.disposed) {
            this.disposed = true;
            if (this.idle) {
                if (this.interruptIdle) {
                    this.interruptIdle();
                }
            }
        }
    }
    async spinTheLoop() {
        while (!this.disposed) {
            // idle
            if (this.skipNextIdle) {
                this.skipNextIdle = false;
            }
            else {
                const idleTimeout = this.watching ? 5000 : /* super long */ 1000 * 60 * 60 * 24;
                await new Promise(resolve => {
                    const id = setTimeout(resolve, idleTimeout);
                    this.interruptIdle = () => { clearTimeout(id); resolve(); };
                }).then(() => {
                    this.interruptIdle = undefined;
                });
            }
            // work
            await this.syncStatus();
            this.syncWorkPromises.splice(0, this.syncWorkPromises.length).forEach(d => d.resolve());
        }
    }
    async syncStatus() {
        try {
            const source = this.options.repository;
            const oldStatus = this.status;
            const newStatus = await this.git.status(source);
            if (!common_1.WorkingDirectoryStatus.equals(newStatus, oldStatus)) {
                this.status = newStatus;
                this.onGitStatusChangedEmitter.fire({ source, status: newStatus, oldStatus });
            }
        }
        catch (error) {
            if (!common_1.GitUtils.isRepositoryDoesNotExistError(error)) {
                const { localUri } = this.options.repository;
                this.logger.error('Error occurred while synchronizing the status of the repository.', localUri, error);
            }
        }
    }
};
__decorate([
    (0, inversify_1.inject)(common_1.Git),
    __metadata("design:type", Object)
], GitRepositoryWatcher.prototype, "git", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.ILogger),
    __metadata("design:type", Object)
], GitRepositoryWatcher.prototype, "logger", void 0);
__decorate([
    (0, inversify_1.inject)(GitRepositoryWatcherOptions),
    __metadata("design:type", GitRepositoryWatcherOptions)
], GitRepositoryWatcher.prototype, "options", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GitRepositoryWatcher.prototype, "init", null);
GitRepositoryWatcher = __decorate([
    (0, inversify_1.injectable)()
], GitRepositoryWatcher);
exports.GitRepositoryWatcher = GitRepositoryWatcher;
//# sourceMappingURL=git-repository-watcher.js.map