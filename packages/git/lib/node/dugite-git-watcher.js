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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DugiteGitWatcherServer = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const core_1 = require("@theia/core");
const git_repository_manager_1 = require("./git-repository-manager");
let DugiteGitWatcherServer = class DugiteGitWatcherServer {
    constructor(manager) {
        this.manager = manager;
        this.watcherSequence = 1;
        this.watchers = new Map();
        this.subscriptions = new Map();
    }
    dispose() {
        for (const watcher of this.watchers.values()) {
            watcher.dispose();
        }
        this.watchers.clear();
        this.subscriptions.clear();
    }
    async watchGitChanges(repository) {
        const reference = await this.manager.getWatcher(repository);
        const watcher = reference.object;
        const repositoryUri = repository.localUri;
        let subscriptions = this.subscriptions.get(repositoryUri);
        if (subscriptions === undefined) {
            const unsubscribe = watcher.onGitStatusChanged(e => {
                if (this.client) {
                    this.client.onGitChanged(e);
                }
            });
            subscriptions = new core_1.DisposableCollection();
            subscriptions.onDispose(() => {
                unsubscribe.dispose();
                this.subscriptions.delete(repositoryUri);
            });
            this.subscriptions.set(repositoryUri, subscriptions);
        }
        watcher.watch();
        subscriptions.push(reference);
        const watcherId = this.watcherSequence++;
        this.watchers.set(watcherId, reference);
        return watcherId;
    }
    async unwatchGitChanges(watcher) {
        const disposable = this.watchers.get(watcher);
        if (disposable) {
            disposable.dispose();
            this.watchers.delete(watcher);
        }
        else {
            throw new Error(`No Git watchers were registered with ID: ${watcher}.`);
        }
    }
    setClient(client) {
        this.client = client;
    }
};
DugiteGitWatcherServer = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(git_repository_manager_1.GitRepositoryManager)),
    __metadata("design:paramtypes", [git_repository_manager_1.GitRepositoryManager])
], DugiteGitWatcherServer);
exports.DugiteGitWatcherServer = DugiteGitWatcherServer;
//# sourceMappingURL=dugite-git-watcher.js.map