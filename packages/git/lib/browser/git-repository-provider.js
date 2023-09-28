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
exports.GitScmRepository = exports.GitRepositoryProvider = void 0;
const debounce = require("@theia/core/shared/lodash.debounce");
const inversify_1 = require("@theia/core/shared/inversify");
const workspace_service_1 = require("@theia/workspace/lib/browser/workspace-service");
const event_1 = require("@theia/core/lib/common/event");
const storage_service_1 = require("@theia/core/lib/browser/storage-service");
const common_1 = require("../common");
const git_commit_message_validator_1 = require("./git-commit-message-validator");
const git_scm_provider_1 = require("./git-scm-provider");
const scm_service_1 = require("@theia/scm/lib/browser/scm-service");
const file_service_1 = require("@theia/filesystem/lib/browser/file-service");
let GitRepositoryProvider = class GitRepositoryProvider {
    constructor() {
        this.onDidChangeRepositoryEmitter = new event_1.Emitter();
        this.selectedRepoStorageKey = 'theia-git-selected-repository';
        this.allRepoStorageKey = 'theia-git-all-repositories';
        this.lazyRefresh = debounce(() => this.refresh(), 1000);
    }
    init() {
        this.doInit();
    }
    async doInit() {
        const [selectedRepository, allRepositories] = await Promise.all([
            this.storageService.getData(this.selectedRepoStorageKey),
            this.storageService.getData(this.allRepoStorageKey)
        ]);
        this.scmService.onDidChangeSelectedRepository(scmRepository => this.fireDidChangeRepository(this.toGitRepository(scmRepository)));
        if (allRepositories) {
            this.updateRepositories(allRepositories);
        }
        else {
            await this.refresh({ maxCount: 1 });
        }
        this.selectedRepository = selectedRepository;
        await this.refresh();
        this.fileService.onDidFilesChange(_ => this.lazyRefresh());
    }
    /**
     * Returns with the previously selected repository, or if no repository has been selected yet,
     * it picks the first available repository from the backend and sets it as the selected one and returns with that.
     * If no repositories are available, returns `undefined`.
     */
    get selectedRepository() {
        return this.toGitRepository(this.scmService.selectedRepository);
    }
    /**
     * Sets the selected repository, but do nothing if the given repository is not a Git repository
     * registered with the SCM service.  We must be sure not to clear the selection if the selected
     * repository is managed by an SCM other than Git.
     */
    set selectedRepository(repository) {
        const scmRepository = this.toScmRepository(repository);
        if (scmRepository) {
            this.scmService.selectedRepository = scmRepository;
        }
    }
    get selectedScmRepository() {
        return this.toGitScmRepository(this.scmService.selectedRepository);
    }
    get selectedScmProvider() {
        return this.toGitScmProvider(this.scmService.selectedRepository);
    }
    get onDidChangeRepository() {
        return this.onDidChangeRepositoryEmitter.event;
    }
    fireDidChangeRepository(repository) {
        this.storageService.setData(this.selectedRepoStorageKey, repository);
        this.onDidChangeRepositoryEmitter.fire(repository);
    }
    /**
     * Returns with all know repositories.
     */
    get allRepositories() {
        const repositories = [];
        for (const scmRepository of this.scmService.repositories) {
            const repository = this.toGitRepository(scmRepository);
            if (repository) {
                repositories.push(repository);
            }
        }
        return repositories;
    }
    async refresh(options) {
        const repositories = [];
        const refreshing = [];
        for (const root of await this.workspaceService.roots) {
            refreshing.push(this.git.repositories(root.resource.toString(), { ...options }).then(result => { repositories.push(...result); }, () => { }));
        }
        await Promise.all(refreshing);
        this.updateRepositories(repositories);
    }
    updateRepositories(repositories) {
        this.storageService.setData(this.allRepoStorageKey, repositories);
        const registered = new Set();
        const toUnregister = new Map();
        for (const scmRepository of this.scmService.repositories) {
            const repository = this.toGitRepository(scmRepository);
            if (repository) {
                registered.add(repository.localUri);
                toUnregister.set(repository.localUri, scmRepository);
            }
        }
        for (const repository of repositories) {
            toUnregister.delete(repository.localUri);
            if (!registered.has(repository.localUri)) {
                registered.add(repository.localUri);
                this.registerScmProvider(repository);
            }
        }
        for (const [, scmRepository] of toUnregister) {
            scmRepository.dispose();
        }
    }
    registerScmProvider(repository) {
        const provider = this.scmProviderFactory({ repository });
        const scmRepository = this.scmService.registerScmProvider(provider, {
            input: {
                placeholder: 'Message (press {0} to commit)',
                validator: async (value) => {
                    const issue = await this.commitMessageValidator.validate(value);
                    return issue && {
                        message: issue.message,
                        type: issue.status
                    };
                }
            }
        });
        provider.input = scmRepository.input;
    }
    toScmRepository(repository) {
        return repository && this.scmService.repositories.find(scmRepository => common_1.Repository.equal(this.toGitRepository(scmRepository), repository));
    }
    toGitRepository(scmRepository) {
        const provider = this.toGitScmProvider(scmRepository);
        return provider && provider.repository;
    }
    toGitScmProvider(scmRepository) {
        const gitScmRepository = this.toGitScmRepository(scmRepository);
        return gitScmRepository && gitScmRepository.provider;
    }
    toGitScmRepository(scmRepository) {
        return GitScmRepository.is(scmRepository) ? scmRepository : undefined;
    }
};
__decorate([
    (0, inversify_1.inject)(git_scm_provider_1.GitScmProvider.Factory),
    __metadata("design:type", Function)
], GitRepositoryProvider.prototype, "scmProviderFactory", void 0);
__decorate([
    (0, inversify_1.inject)(git_commit_message_validator_1.GitCommitMessageValidator),
    __metadata("design:type", git_commit_message_validator_1.GitCommitMessageValidator)
], GitRepositoryProvider.prototype, "commitMessageValidator", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.Git),
    __metadata("design:type", Object)
], GitRepositoryProvider.prototype, "git", void 0);
__decorate([
    (0, inversify_1.inject)(workspace_service_1.WorkspaceService),
    __metadata("design:type", workspace_service_1.WorkspaceService)
], GitRepositoryProvider.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(scm_service_1.ScmService),
    __metadata("design:type", scm_service_1.ScmService)
], GitRepositoryProvider.prototype, "scmService", void 0);
__decorate([
    (0, inversify_1.inject)(storage_service_1.StorageService),
    __metadata("design:type", Object)
], GitRepositoryProvider.prototype, "storageService", void 0);
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], GitRepositoryProvider.prototype, "fileService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GitRepositoryProvider.prototype, "init", null);
GitRepositoryProvider = __decorate([
    (0, inversify_1.injectable)()
], GitRepositoryProvider);
exports.GitRepositoryProvider = GitRepositoryProvider;
var GitScmRepository;
(function (GitScmRepository) {
    function is(scmRepository) {
        return !!scmRepository && scmRepository.provider instanceof git_scm_provider_1.GitScmProvider;
    }
    GitScmRepository.is = is;
})(GitScmRepository = exports.GitScmRepository || (exports.GitScmRepository = {}));
//# sourceMappingURL=git-repository-provider.js.map