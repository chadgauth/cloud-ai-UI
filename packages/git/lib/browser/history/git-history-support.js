"use strict";
// *****************************************************************************
// Copyright (C) 2019 Arm and others.
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
exports.GitHistorySupport = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const core_1 = require("@theia/core");
const common_1 = require("../../common");
const git_scm_provider_1 = require("../git-scm-provider");
const git_repository_tracker_1 = require("../git-repository-tracker");
let GitHistorySupport = class GitHistorySupport {
    constructor() {
        this.onDidChangeHistoryEmitter = new core_1.Emitter({
            onFirstListenerAdd: () => this.onFirstListenerAdd(),
            onLastListenerRemove: () => this.onLastListenerRemove()
        });
        this.onDidChangeHistory = this.onDidChangeHistoryEmitter.event;
    }
    async getCommitHistory(options) {
        const repository = this.provider.repository;
        const gitOptions = {
            uri: options ? options.uri : undefined,
            maxCount: options ? options.maxCount : undefined,
            range: options === null || options === void 0 ? void 0 : options.range,
            shortSha: true
        };
        const commits = await this.git.log(repository, gitOptions);
        if (commits.length > 0) {
            return commits.map(commit => this.provider.createScmHistoryCommit(commit));
        }
        else {
            const pathIsUnderVersionControl = !options || !options.uri || await this.git.lsFiles(repository, options.uri, { errorUnmatch: true });
            if (!pathIsUnderVersionControl) {
                throw new Error('It is not under version control.');
            }
            else {
                throw new Error('No commits have been committed.');
            }
        }
    }
    onFirstListenerAdd() {
        this.onGitEventDisposable = this.repositoryTracker.onGitEvent(event => {
            const { status, oldStatus } = event || { status: undefined, oldStatus: undefined };
            let isBranchChanged = false;
            let isHeaderChanged = false;
            if (oldStatus) {
                isBranchChanged = !!status && status.branch !== oldStatus.branch;
                isHeaderChanged = !!status && status.currentHead !== oldStatus.currentHead;
            }
            if (isBranchChanged || isHeaderChanged || oldStatus === undefined) {
                this.onDidChangeHistoryEmitter.fire(undefined);
            }
        });
    }
    onLastListenerRemove() {
        if (this.onGitEventDisposable) {
            this.onGitEventDisposable.dispose();
            this.onGitEventDisposable = undefined;
        }
    }
};
__decorate([
    (0, inversify_1.inject)(git_scm_provider_1.GitScmProvider),
    __metadata("design:type", git_scm_provider_1.GitScmProvider)
], GitHistorySupport.prototype, "provider", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.Git),
    __metadata("design:type", Object)
], GitHistorySupport.prototype, "git", void 0);
__decorate([
    (0, inversify_1.inject)(git_repository_tracker_1.GitRepositoryTracker),
    __metadata("design:type", git_repository_tracker_1.GitRepositoryTracker)
], GitHistorySupport.prototype, "repositoryTracker", void 0);
GitHistorySupport = __decorate([
    (0, inversify_1.injectable)()
], GitHistorySupport);
exports.GitHistorySupport = GitHistorySupport;
//# sourceMappingURL=git-history-support.js.map