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
exports.GitRepositoryManager = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const core_1 = require("@theia/core");
const git_repository_watcher_1 = require("./git-repository-watcher");
let GitRepositoryManager = class GitRepositoryManager {
    constructor() {
        this.watchers = new core_1.ReferenceCollection(repository => this.watcherFactory({ repository }));
    }
    run(repository, op) {
        const result = op();
        result.then(() => this.sync(repository).catch(e => console.log(e)));
        return result;
    }
    getWatcher(repository) {
        return this.watchers.acquire(repository);
    }
    async sync(repository) {
        const reference = await this.getWatcher(repository);
        const watcher = reference.object;
        // dispose the reference once the next sync cycle is actually completed
        watcher.sync().then(() => reference.dispose());
    }
};
__decorate([
    (0, inversify_1.inject)(git_repository_watcher_1.GitRepositoryWatcherFactory),
    __metadata("design:type", Function)
], GitRepositoryManager.prototype, "watcherFactory", void 0);
GitRepositoryManager = __decorate([
    (0, inversify_1.injectable)()
], GitRepositoryManager);
exports.GitRepositoryManager = GitRepositoryManager;
//# sourceMappingURL=git-repository-manager.js.map