"use strict";
// *****************************************************************************
// Copyright (C) 2020 Arm and others.
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
exports.GitDiffTreeModel = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const common_1 = require("@theia/core/lib/common");
const uri_1 = require("@theia/core/lib/common/uri");
const scm_tree_model_1 = require("@theia/scm/lib/browser/scm-tree-model");
const common_2 = require("../../common");
const scm_service_1 = require("@theia/scm/lib/browser/scm-service");
const git_scm_provider_1 = require("../git-scm-provider");
const git_resource_opener_1 = require("./git-resource-opener");
let GitDiffTreeModel = class GitDiffTreeModel extends scm_tree_model_1.ScmTreeModel {
    constructor() {
        super();
        this._groups = [];
        this.toDisposeOnContentChange = new common_1.DisposableCollection();
        this.toDispose.push(this.toDisposeOnContentChange);
    }
    async setContent(options) {
        const { rootUri, diffOptions } = options;
        this.toDisposeOnContentChange.dispose();
        const scmRepository = this.scmService.findRepository(new uri_1.default(rootUri));
        if (scmRepository && scmRepository.provider.id === 'git') {
            const provider = scmRepository.provider;
            this.provider = provider;
            this.diffOptions = diffOptions;
            this.refreshRepository(provider);
            this.toDisposeOnContentChange.push(provider.onDidChange(() => {
                this.refreshRepository(provider);
            }));
        }
    }
    async refreshRepository(provider) {
        const repository = { localUri: provider.rootUri };
        const gitFileChanges = await this.git.diff(repository, this.diffOptions);
        const group = { id: 'changes', label: 'Files Changed', resources: [], provider, dispose: () => { } };
        const resources = gitFileChanges
            .map(change => new git_scm_provider_1.GitScmFileChange(change, provider, this.diffOptions.range))
            .map(change => ({
            sourceUri: new uri_1.default(change.uri),
            decorations: {
                letter: common_2.GitFileStatus.toAbbreviation(change.gitFileChange.status, true),
                color: common_2.GitFileStatus.getColor(change.gitFileChange.status, true),
                tooltip: common_2.GitFileStatus.toString(change.gitFileChange.status, true)
            },
            open: async () => this.open(change),
            group,
        }));
        const changesGroup = { ...group, resources };
        this._groups = [changesGroup];
        this.root = this.createTree();
    }
    get rootUri() {
        if (this.provider) {
            return this.provider.rootUri;
        }
    }
    ;
    canTabToWidget() {
        return true;
    }
    get groups() {
        return this._groups;
    }
    ;
    async open(change) {
        const uriToOpen = change.getUriToOpen();
        await this.resourceOpener.open(uriToOpen);
    }
    storeState() {
        if (this.provider) {
            return {
                ...super.storeState(),
                rootUri: this.provider.rootUri,
                diffOptions: this.diffOptions,
            };
        }
        else {
            return super.storeState();
        }
    }
    restoreState(oldState) {
        super.restoreState(oldState);
        if (oldState.rootUri && oldState.diffOptions) {
            this.setContent(oldState);
        }
    }
};
__decorate([
    (0, inversify_1.inject)(common_2.Git),
    __metadata("design:type", Object)
], GitDiffTreeModel.prototype, "git", void 0);
__decorate([
    (0, inversify_1.inject)(scm_service_1.ScmService),
    __metadata("design:type", scm_service_1.ScmService)
], GitDiffTreeModel.prototype, "scmService", void 0);
__decorate([
    (0, inversify_1.inject)(git_resource_opener_1.GitResourceOpener),
    __metadata("design:type", Object)
], GitDiffTreeModel.prototype, "resourceOpener", void 0);
GitDiffTreeModel = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], GitDiffTreeModel);
exports.GitDiffTreeModel = GitDiffTreeModel;
(function (GitDiffTreeModel) {
    ;
})(GitDiffTreeModel = exports.GitDiffTreeModel || (exports.GitDiffTreeModel = {}));
exports.GitDiffTreeModel = GitDiffTreeModel;
//# sourceMappingURL=git-diff-tree-model.js.map