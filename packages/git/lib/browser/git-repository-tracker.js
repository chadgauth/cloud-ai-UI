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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitRepositoryTracker = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const common_1 = require("../common");
const core_1 = require("@theia/core");
const git_repository_provider_1 = require("./git-repository-provider");
const git_watcher_1 = require("../common/git-watcher");
const uri_1 = require("@theia/core/lib/common/uri");
const debounce = require("@theia/core/shared/lodash.debounce");
/**
 * The repository tracker watches the selected repository for status changes. It provides a convenient way to listen on status updates.
 */
let GitRepositoryTracker = class GitRepositoryTracker {
    constructor(git, repositoryProvider, gitWatcher) {
        this.git = git;
        this.repositoryProvider = repositoryProvider;
        this.gitWatcher = gitWatcher;
        this.toDispose = new core_1.DisposableCollection();
        this.onGitEventEmitter = new core_1.Emitter();
        this.updateStatus = debounce(async () => {
            this.toDispose.dispose();
            const tokenSource = new core_1.CancellationTokenSource();
            this.toDispose.push(core_1.Disposable.create(() => tokenSource.cancel()));
            const token = tokenSource.token;
            const source = this.selectedRepository;
            if (source) {
                const status = await this.git.status(source);
                this.setStatus({ source, status }, token);
                this.toDispose.push(this.gitWatcher.onGitEvent(event => {
                    if (event.source.localUri === source.localUri) {
                        this.setStatus(event, token);
                    }
                }));
                this.toDispose.push(await this.gitWatcher.watchGitChanges(source));
            }
            else {
                this.setStatus(undefined, token);
            }
        }, 50);
    }
    init() {
        this.doInit();
    }
    async doInit() {
        this.updateStatus();
        this.repositoryProvider.onDidChangeRepository(() => this.updateStatus());
    }
    setStatus(event, token) {
        const status = event && event.status;
        const scmProvider = this.repositoryProvider.selectedScmProvider;
        if (scmProvider) {
            scmProvider.setStatus(status);
        }
        this.workingDirectoryStatus = status;
        this.onGitEventEmitter.fire(event);
    }
    /**
     * Returns the selected repository, or `undefined` if no repositories are available.
     */
    get selectedRepository() {
        return this.repositoryProvider.selectedRepository;
    }
    /**
     * Returns all known repositories.
     */
    get allRepositories() {
        return this.repositoryProvider.allRepositories;
    }
    /**
     * Returns the last known status of the selected repository, or `undefined` if no repositories are available.
     */
    get selectedRepositoryStatus() {
        return this.workingDirectoryStatus;
    }
    /**
     * Emits when the selected repository has changed.
     */
    get onDidChangeRepository() {
        return this.repositoryProvider.onDidChangeRepository;
    }
    /**
     * Emits when status has changed in the selected repository.
     */
    get onGitEvent() {
        return this.onGitEventEmitter.event;
    }
    getPath(uri) {
        const { repositoryUri } = this;
        const relativePath = repositoryUri && common_1.Repository.relativePath(repositoryUri, uri);
        return relativePath && relativePath.toString();
    }
    getUri(path) {
        const { repositoryUri } = this;
        return repositoryUri && repositoryUri.resolve(path);
    }
    get repositoryUri() {
        const repository = this.selectedRepository;
        return repository && new uri_1.default(repository.localUri);
    }
};
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GitRepositoryTracker.prototype, "init", null);
GitRepositoryTracker = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(common_1.Git)),
    __param(1, (0, inversify_1.inject)(git_repository_provider_1.GitRepositoryProvider)),
    __param(2, (0, inversify_1.inject)(git_watcher_1.GitWatcher)),
    __metadata("design:paramtypes", [Object, git_repository_provider_1.GitRepositoryProvider,
        git_watcher_1.GitWatcher])
], GitRepositoryTracker);
exports.GitRepositoryTracker = GitRepositoryTracker;
//# sourceMappingURL=git-repository-tracker.js.map