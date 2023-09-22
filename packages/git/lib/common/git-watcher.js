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
exports.GitWatcher = exports.GitWatcherPath = exports.ReconnectingGitWatcherServer = exports.GitWatcherServerProxy = exports.GitWatcherServer = exports.GitStatusChangeEvent = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const core_1 = require("@theia/core");
const common_1 = require("@theia/core/lib/common");
var GitStatusChangeEvent;
(function (GitStatusChangeEvent) {
    /**
     * `true` if the argument is a `GitStatusEvent`, otherwise `false`.
     * @param event the argument to check whether it is a Git status change event or not.
     */
    function is(event) {
        return (0, core_1.isObject)(event) && ('source' in event) && ('status' in event);
    }
    GitStatusChangeEvent.is = is;
})(GitStatusChangeEvent = exports.GitStatusChangeEvent || (exports.GitStatusChangeEvent = {}));
/**
 * The symbol of the Git watcher backend for DI.
 */
exports.GitWatcherServer = Symbol('GitWatcherServer');
exports.GitWatcherServerProxy = Symbol('GitWatcherServerProxy');
let ReconnectingGitWatcherServer = class ReconnectingGitWatcherServer {
    constructor(proxy) {
        this.proxy = proxy;
        this.watcherSequence = 1;
        this.watchParams = new Map();
        this.localToRemoteWatcher = new Map();
        this.proxy.onDidOpenConnection(() => this.reconnect());
    }
    async watchGitChanges(repository) {
        const watcher = this.watcherSequence++;
        this.watchParams.set(watcher, repository);
        return this.doWatchGitChanges([watcher, repository]);
    }
    async unwatchGitChanges(watcher) {
        this.watchParams.delete(watcher);
        const remote = this.localToRemoteWatcher.get(watcher);
        if (remote) {
            this.localToRemoteWatcher.delete(remote);
            return this.proxy.unwatchGitChanges(remote);
        }
        else {
            throw new Error(`No Git watchers were registered with ID: ${watcher}.`);
        }
    }
    dispose() {
        this.proxy.dispose();
    }
    setClient(client) {
        this.proxy.setClient(client);
    }
    reconnect() {
        [...this.watchParams.entries()].forEach(entry => this.doWatchGitChanges(entry));
    }
    async doWatchGitChanges(entry) {
        const [watcher, repository] = entry;
        const remote = await this.proxy.watchGitChanges(repository);
        this.localToRemoteWatcher.set(watcher, remote);
        return watcher;
    }
};
ReconnectingGitWatcherServer = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(exports.GitWatcherServerProxy)),
    __metadata("design:paramtypes", [Object])
], ReconnectingGitWatcherServer);
exports.ReconnectingGitWatcherServer = ReconnectingGitWatcherServer;
/**
 * Unique WS endpoint path to the Git watcher service.
 */
exports.GitWatcherPath = '/services/git-watcher';
let GitWatcher = class GitWatcher {
    constructor(server) {
        this.server = server;
        this.toDispose = new common_1.DisposableCollection();
        this.onGitEventEmitter = new common_1.Emitter();
        this.toDispose.push(this.onGitEventEmitter);
        this.server.setClient({ onGitChanged: e => this.onGitChanged(e) });
    }
    dispose() {
        this.toDispose.dispose();
    }
    get onGitEvent() {
        return this.onGitEventEmitter.event;
    }
    async onGitChanged(event) {
        this.onGitEventEmitter.fire(event);
    }
    async watchGitChanges(repository) {
        const watcher = await this.server.watchGitChanges(repository);
        const toDispose = new common_1.DisposableCollection();
        toDispose.push(common_1.Disposable.create(() => this.server.unwatchGitChanges(watcher)));
        return toDispose;
    }
};
GitWatcher = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(exports.GitWatcherServer)),
    __metadata("design:paramtypes", [Object])
], GitWatcher);
exports.GitWatcher = GitWatcher;
//# sourceMappingURL=git-watcher.js.map