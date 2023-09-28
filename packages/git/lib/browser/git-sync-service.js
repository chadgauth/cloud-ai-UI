"use strict";
// *****************************************************************************
// Copyright (C) 2018 TypeFox and others.
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
exports.GitSyncService = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const core_1 = require("@theia/core");
const browser_1 = require("@theia/core/lib/browser");
const git_repository_tracker_1 = require("./git-repository-tracker");
const common_1 = require("../common");
const git_error_handler_1 = require("./git-error-handler");
let GitSyncService = class GitSyncService {
    constructor() {
        this.onDidChangeEmitter = new core_1.Emitter();
        this.onDidChange = this.onDidChangeEmitter.event;
        this.syncing = false;
    }
    fireDidChange() {
        this.onDidChangeEmitter.fire(undefined);
    }
    isSyncing() {
        return this.syncing;
    }
    setSyncing(syncing) {
        this.syncing = syncing;
        this.fireDidChange();
    }
    canSync() {
        if (this.isSyncing()) {
            return false;
        }
        const status = this.repositoryTracker.selectedRepositoryStatus;
        return !!status && !!status.branch && !!status.upstreamBranch;
    }
    async sync() {
        const repository = this.repositoryTracker.selectedRepository;
        if (!this.canSync() || !repository) {
            return;
        }
        this.setSyncing(true);
        try {
            await this.git.fetch(repository);
            let status = await this.git.status(repository);
            this.setSyncing(false);
            const method = await this.getSyncMethod(status);
            if (method === undefined) {
                return;
            }
            this.setSyncing(true);
            if (method === 'pull-push' || method === 'rebase-push') {
                await this.git.pull(repository, {
                    rebase: method === 'rebase-push'
                });
                status = await this.git.status(repository);
            }
            if (this.shouldPush(status)) {
                await this.git.push(repository, {
                    force: method === 'force-push'
                });
            }
        }
        catch (error) {
            this.gitErrorHandler.handleError(error);
        }
        finally {
            this.setSyncing(false);
        }
    }
    async getSyncMethod(status) {
        var _a;
        if (!status.upstreamBranch || !status.branch) {
            return undefined;
        }
        const { branch, upstreamBranch } = status;
        if (!this.shouldPull(status) && !this.shouldPush(status)) {
            this.messageService.info(`${branch} is already in sync with ${upstreamBranch}`);
            return undefined;
        }
        const methods = [{
                label: `Pull and push commits from and to '${upstreamBranch}'`,
                warning: `This action will pull and push commits from and to '${upstreamBranch}'.`,
                detail: 'pull-push'
            }, {
                label: `Fetch, rebase and push commits from and to '${upstreamBranch}'`,
                warning: `This action will fetch, rebase and push commits from and to '${upstreamBranch}'.`,
                detail: 'rebase-push'
            }, {
                label: `Force push commits to '${upstreamBranch}'`,
                warning: `This action will override commits in '${upstreamBranch}'.`,
                detail: 'force-push'
            }];
        const selectedCWD = await ((_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.showQuickPick(methods, { placeholder: 'Select current working directory for new terminal' }));
        if (selectedCWD && await this.confirm('Synchronize Changes', methods.find(({ detail }) => detail === selectedCWD.detail).warning)) {
            return selectedCWD.detail;
        }
        else {
            return (undefined);
        }
    }
    canPublish() {
        if (this.isSyncing()) {
            return false;
        }
        const status = this.repositoryTracker.selectedRepositoryStatus;
        return !!status && !!status.branch && !status.upstreamBranch;
    }
    async publish() {
        const repository = this.repositoryTracker.selectedRepository;
        const status = this.repositoryTracker.selectedRepositoryStatus;
        const localBranch = status && status.branch;
        if (!this.canPublish() || !repository || !localBranch) {
            return;
        }
        const remote = await this.getRemote(repository, localBranch);
        if (remote &&
            await this.confirm('Publish changes', `This action will push commits to '${remote}/${localBranch}' and track it as an upstream branch.`)) {
            try {
                await this.git.push(repository, {
                    remote, localBranch, setUpstream: true
                });
            }
            catch (error) {
                this.gitErrorHandler.handleError(error);
            }
        }
    }
    async getRemote(repository, branch) {
        var _a;
        const remotes = await this.git.remote(repository);
        if (remotes.length === 0) {
            this.messageService.warn('Your repository has no remotes configured to publish to.');
        }
        const selectedRemote = await ((_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.showQuickPick(remotes.map(remote => ({ label: remote })), { placeholder: `Pick a remote to publish the branch ${branch} to:` }));
        return selectedRemote === null || selectedRemote === void 0 ? void 0 : selectedRemote.label;
    }
    shouldPush(status) {
        return status.aheadBehind ? status.aheadBehind.ahead > 0 : true;
    }
    shouldPull(status) {
        return status.aheadBehind ? status.aheadBehind.behind > 0 : true;
    }
    async confirm(title, msg) {
        return !!await new browser_1.ConfirmDialog({ title, msg, }).open();
    }
};
__decorate([
    (0, inversify_1.inject)(common_1.Git),
    __metadata("design:type", Object)
], GitSyncService.prototype, "git", void 0);
__decorate([
    (0, inversify_1.inject)(git_repository_tracker_1.GitRepositoryTracker),
    __metadata("design:type", git_repository_tracker_1.GitRepositoryTracker)
], GitSyncService.prototype, "repositoryTracker", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.MessageService),
    __metadata("design:type", core_1.MessageService)
], GitSyncService.prototype, "messageService", void 0);
__decorate([
    (0, inversify_1.inject)(git_error_handler_1.GitErrorHandler),
    __metadata("design:type", git_error_handler_1.GitErrorHandler)
], GitSyncService.prototype, "gitErrorHandler", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.QuickInputService),
    (0, inversify_1.optional)(),
    __metadata("design:type", Object)
], GitSyncService.prototype, "quickInputService", void 0);
GitSyncService = __decorate([
    (0, inversify_1.injectable)()
], GitSyncService);
exports.GitSyncService = GitSyncService;
//# sourceMappingURL=git-sync-service.js.map