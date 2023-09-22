"use strict";
// *****************************************************************************
// Copyright (C) 2019 TypeFox and others.
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
var GitScmProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitScmFileChange = exports.GitAmendSupport = exports.GitScmProvider = exports.GitScmProviderOptions = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const uri_1 = require("@theia/core/lib/common/uri");
const diff_uris_1 = require("@theia/core/lib/browser/diff-uris");
const core_1 = require("@theia/core");
const disposable_1 = require("@theia/core/lib/common/disposable");
const command_1 = require("@theia/core/lib/common/command");
const dialogs_1 = require("@theia/core/lib/browser/dialogs");
const editor_manager_1 = require("@theia/editor/lib/browser/editor-manager");
const browser_1 = require("@theia/workspace/lib/browser");
const common_1 = require("../common");
const git_resource_1 = require("./git-resource");
const git_error_handler_1 = require("./git-error-handler");
const label_provider_1 = require("@theia/core/lib/browser/label-provider");
const file_service_1 = require("@theia/filesystem/lib/browser/file-service");
const nls_1 = require("@theia/core/lib/common/nls");
const git_preferences_1 = require("./git-preferences");
let GitScmProviderOptions = class GitScmProviderOptions {
};
GitScmProviderOptions = __decorate([
    (0, inversify_1.injectable)()
], GitScmProviderOptions);
exports.GitScmProviderOptions = GitScmProviderOptions;
let GitScmProvider = GitScmProvider_1 = class GitScmProvider {
    constructor() {
        this.onDidChangeEmitter = new core_1.Emitter();
        this.onDidChange = this.onDidChangeEmitter.event;
        this.onDidChangeCommitTemplateEmitter = new core_1.Emitter();
        this.onDidChangeCommitTemplate = this.onDidChangeCommitTemplateEmitter.event;
        this.onDidChangeStatusBarCommandsEmitter = new core_1.Emitter();
        this.onDidChangeStatusBarCommands = this.onDidChangeStatusBarCommandsEmitter.event;
        this.toDispose = new disposable_1.DisposableCollection(this.onDidChangeEmitter, this.onDidChangeCommitTemplateEmitter, this.onDidChangeStatusBarCommandsEmitter);
        this.id = 'git';
        this.label = nls_1.nls.localize('vscode.git/package/displayName', 'Git');
        this.state = GitScmProvider_1.initState();
    }
    fireDidChange() {
        this.onDidChangeEmitter.fire(undefined);
    }
    dispose() {
        this.toDispose.dispose();
    }
    init() {
        this._amendSupport = new GitAmendSupport(this, this.repository, this.git);
        this.toDispose.push(this.gitPreferences.onPreferenceChanged(e => {
            if (e.preferenceName === 'git.untrackedChanges' && e.affects(this.rootUri)) {
                this.setStatus(this.getStatus());
            }
        }));
    }
    get repository() {
        return this.options.repository;
    }
    get rootUri() {
        return this.repository.localUri;
    }
    get amendSupport() {
        return this._amendSupport;
    }
    get acceptInputCommand() {
        return {
            command: 'git.commit.all',
            tooltip: nls_1.nls.localize('vscode.git/package/command.commitAll', 'Commit all the staged changes'),
            title: nls_1.nls.localize('vscode.git/package/command.commit', 'Commit')
        };
    }
    get statusBarCommands() {
        return this._statusBarCommands;
    }
    set statusBarCommands(statusBarCommands) {
        this._statusBarCommands = statusBarCommands;
        this.onDidChangeStatusBarCommandsEmitter.fire(statusBarCommands);
    }
    get groups() {
        return this.state.groups;
    }
    get stagedChanges() {
        return this.state.stagedChanges;
    }
    get unstagedChanges() {
        return this.state.unstagedChanges;
    }
    get mergeChanges() {
        return this.state.mergeChanges;
    }
    getStatus() {
        return this.state.status;
    }
    setStatus(status) {
        const state = GitScmProvider_1.initState(status);
        if (status) {
            for (const change of status.changes) {
                if (common_1.GitFileStatus[common_1.GitFileStatus.Conflicted.valueOf()] !== common_1.GitFileStatus[change.status]) {
                    if (change.staged) {
                        state.stagedChanges.push(change);
                    }
                    else {
                        state.unstagedChanges.push(change);
                    }
                }
                else {
                    if (!change.staged) {
                        state.mergeChanges.push(change);
                    }
                }
            }
        }
        const untrackedChangesPreference = this.gitPreferences['git.untrackedChanges'];
        const forWorkingTree = untrackedChangesPreference === 'mixed'
            ? state.unstagedChanges
            : state.unstagedChanges.filter(change => change.status !== common_1.GitFileStatus.New);
        const forUntracked = untrackedChangesPreference === 'separate'
            ? state.unstagedChanges.filter(change => change.status === common_1.GitFileStatus.New)
            : [];
        const hideWorkingIfEmpty = forUntracked.length > 0;
        state.groups.push(this.createGroup('merge', nls_1.nls.localize('vscode.git/repository/merge changes', 'Merge Changes'), state.mergeChanges, true));
        state.groups.push(this.createGroup('index', nls_1.nls.localize('vscode.git/repository/staged changes', 'Staged changes'), state.stagedChanges, true));
        state.groups.push(this.createGroup('workingTree', nls_1.nls.localize('vscode.git/repository/changes', 'Changes'), forWorkingTree, hideWorkingIfEmpty));
        state.groups.push(this.createGroup('untrackedChanges', nls_1.nls.localize('vscode.git/repository/untracked changes', 'Untracked Changes'), forUntracked, true));
        this.state = state;
        if (status && status.branch) {
            this.input.placeholder = nls_1.nls.localize('vscode.git/repository/commitMessageWithHeadLabel', 'Message (press {0} to commit on {1})', '{0}', status.branch);
        }
        else {
            this.input.placeholder = nls_1.nls.localize('vscode.git/repository/commitMessage', 'Message (press {0} to commit)');
        }
        this.fireDidChange();
    }
    createGroup(id, label, changes, hideWhenEmpty) {
        const group = {
            id,
            label,
            hideWhenEmpty,
            provider: this,
            resources: [],
            dispose: () => { }
        };
        for (const change of changes) {
            this.addScmResource(group, change);
        }
        return group;
    }
    addScmResource(group, change) {
        const sourceUri = new uri_1.default(change.uri);
        group.resources.push({
            group,
            sourceUri,
            decorations: {
                letter: common_1.GitFileStatus.toAbbreviation(change.status, change.staged),
                color: common_1.GitFileStatus.getColor(change.status, change.staged),
                tooltip: common_1.GitFileStatus.toString(change.status),
                strikeThrough: common_1.GitFileStatus.toStrikethrough(change.status)
            },
            open: async () => this.open(change, { mode: 'reveal' })
        });
    }
    async open(change, options) {
        const uriToOpen = this.getUriToOpen(change);
        await this.editorManager.open(uriToOpen, options);
    }
    getUriToOpen(change) {
        const changeUri = new uri_1.default(change.uri);
        const fromFileUri = change.oldUri ? new uri_1.default(change.oldUri) : changeUri; // set oldUri on renamed and copied
        if (change.status === common_1.GitFileStatus.Deleted) {
            if (change.staged) {
                return changeUri.withScheme(git_resource_1.GIT_RESOURCE_SCHEME).withQuery('HEAD');
            }
            else {
                return changeUri.withScheme(git_resource_1.GIT_RESOURCE_SCHEME);
            }
        }
        if (change.status !== common_1.GitFileStatus.New) {
            if (change.staged) {
                return diff_uris_1.DiffUris.encode(fromFileUri.withScheme(git_resource_1.GIT_RESOURCE_SCHEME).withQuery('HEAD'), changeUri.withScheme(git_resource_1.GIT_RESOURCE_SCHEME), nls_1.nls.localize('theia/git/tabTitleIndex', '{0} (Index)', this.labelProvider.getName(changeUri)));
            }
            if (this.stagedChanges.find(c => c.uri === change.uri)) {
                return diff_uris_1.DiffUris.encode(fromFileUri.withScheme(git_resource_1.GIT_RESOURCE_SCHEME), changeUri, nls_1.nls.localize('theia/git/tabTitleWorkingTree', '{0} (Working tree)', this.labelProvider.getName(changeUri)));
            }
            if (this.mergeChanges.find(c => c.uri === change.uri)) {
                return changeUri;
            }
            return diff_uris_1.DiffUris.encode(fromFileUri.withScheme(git_resource_1.GIT_RESOURCE_SCHEME).withQuery('HEAD'), changeUri, nls_1.nls.localize('theia/git/tabTitleWorkingTree', '{0} (Working tree)', this.labelProvider.getName(changeUri)));
        }
        if (change.staged) {
            return changeUri.withScheme(git_resource_1.GIT_RESOURCE_SCHEME);
        }
        if (this.stagedChanges.find(c => c.uri === change.uri)) {
            return diff_uris_1.DiffUris.encode(changeUri.withScheme(git_resource_1.GIT_RESOURCE_SCHEME), changeUri, nls_1.nls.localize('theia/git/tabTitleWorkingTree', '{0} (Working tree)', this.labelProvider.getName(changeUri)));
        }
        return changeUri;
    }
    async openChange(change, options) {
        const uriToOpen = this.getUriToOpen(change);
        return this.editorManager.open(uriToOpen, options);
    }
    findChange(uri) {
        const stringUri = uri.toString();
        const merge = this.mergeChanges.find(c => c.uri.toString() === stringUri);
        if (merge) {
            return merge;
        }
        const unstaged = this.unstagedChanges.find(c => c.uri.toString() === stringUri);
        if (unstaged) {
            return unstaged;
        }
        return this.stagedChanges.find(c => c.uri.toString() === stringUri);
    }
    async stageAll() {
        try {
            // TODO resolve deletion conflicts
            // TODO confirm staging unresolved files
            await this.git.add(this.repository, []);
        }
        catch (error) {
            this.gitErrorHandler.handleError(error);
        }
    }
    async stage(uriArg) {
        try {
            const { repository, unstagedChanges, mergeChanges } = this;
            const uris = Array.isArray(uriArg) ? uriArg : [uriArg];
            const unstagedUris = uris
                .filter(uri => {
                const resourceUri = new uri_1.default(uri);
                return unstagedChanges.some(change => resourceUri.isEqualOrParent(new uri_1.default(change.uri)))
                    || mergeChanges.some(change => resourceUri.isEqualOrParent(new uri_1.default(change.uri)));
            });
            if (unstagedUris.length !== 0) {
                // TODO resolve deletion conflicts
                // TODO confirm staging of a unresolved file
                await this.git.add(repository, uris);
            }
        }
        catch (error) {
            this.gitErrorHandler.handleError(error);
        }
    }
    async unstageAll() {
        try {
            const { repository, stagedChanges } = this;
            const uris = stagedChanges.map(c => c.uri);
            await this.git.unstage(repository, uris, { reset: 'index' });
        }
        catch (error) {
            this.gitErrorHandler.handleError(error);
        }
    }
    async unstage(uriArg) {
        try {
            const { repository, stagedChanges } = this;
            const uris = Array.isArray(uriArg) ? uriArg : [uriArg];
            const stagedUris = uris
                .filter(uri => {
                const resourceUri = new uri_1.default(uri);
                return stagedChanges.some(change => resourceUri.isEqualOrParent(new uri_1.default(change.uri)));
            });
            if (stagedUris.length !== 0) {
                await this.git.unstage(repository, uris, { reset: 'index' });
            }
        }
        catch (error) {
            this.gitErrorHandler.handleError(error);
        }
    }
    async discardAll() {
        if (await this.confirmAll()) {
            try {
                // discard new files
                const newUris = this.unstagedChanges.filter(c => c.status === common_1.GitFileStatus.New).map(c => c.uri);
                await this.deleteAll(newUris);
                // unstage changes
                const uris = this.unstagedChanges.filter(c => c.status !== common_1.GitFileStatus.New).map(c => c.uri);
                await this.git.unstage(this.repository, uris, { treeish: 'HEAD', reset: 'working-tree' });
            }
            catch (error) {
                this.gitErrorHandler.handleError(error);
            }
        }
    }
    async discard(uriArg) {
        const { repository } = this;
        const uris = Array.isArray(uriArg) ? uriArg : [uriArg];
        const status = this.getStatus();
        if (!status) {
            return;
        }
        const pairs = await Promise.all(uris
            .filter(uri => {
            const uriAsUri = new uri_1.default(uri);
            return status.changes.some(change => uriAsUri.isEqualOrParent(new uri_1.default(change.uri)));
        })
            .map(uri => {
            const includeIndexFlag = async () => {
                // Allow deletion, only iff the same file is not yet in the Git index.
                const isInIndex = await this.git.lsFiles(repository, uri, { errorUnmatch: true });
                return { uri, isInIndex };
            };
            return includeIndexFlag();
        }));
        const urisInIndex = pairs.filter(pair => pair.isInIndex).map(pair => pair.uri);
        if (urisInIndex.length !== 0) {
            if (!await this.confirm(urisInIndex)) {
                return;
            }
        }
        await Promise.all(pairs.map(pair => {
            const discardSingle = async () => {
                if (pair.isInIndex) {
                    try {
                        await this.git.unstage(repository, pair.uri, { treeish: 'HEAD', reset: 'working-tree' });
                    }
                    catch (error) {
                        this.gitErrorHandler.handleError(error);
                    }
                }
                else {
                    await this.commands.executeCommand(browser_1.WorkspaceCommands.FILE_DELETE.id, [new uri_1.default(pair.uri)]);
                }
            };
            return discardSingle();
        }));
    }
    confirm(paths) {
        let fileText;
        if (paths.length <= 3) {
            fileText = paths.map(path => this.labelProvider.getName(new uri_1.default(path))).join(', ');
        }
        else {
            fileText = `${paths.length} files`;
        }
        return new dialogs_1.ConfirmDialog({
            title: nls_1.nls.localize('vscode.git/package/command.clean', 'Discard Changes'),
            msg: nls_1.nls.localize('vscode.git/commands/confirm discard', 'Do you really want to discard changes in {0}?', fileText)
        }).open();
    }
    confirmAll() {
        return new dialogs_1.ConfirmDialog({
            title: nls_1.nls.localize('vscode.git/package/command.cleanAll', 'Discard All Changes'),
            msg: nls_1.nls.localize('vscode.git/commands/confirm discard all', 'Do you really want to discard all changes?')
        }).open();
    }
    async delete(uri) {
        try {
            await this.fileService.delete(uri, { recursive: true });
        }
        catch (e) {
            console.error(e);
        }
    }
    async deleteAll(uris) {
        await Promise.all(uris.map(uri => this.delete(new uri_1.default(uri))));
    }
    createScmCommit(gitCommit) {
        const scmCommit = {
            id: gitCommit.sha,
            summary: gitCommit.summary,
            authorName: gitCommit.author.name,
            authorEmail: gitCommit.author.email,
            authorDateRelative: gitCommit.authorDateRelative,
        };
        return scmCommit;
    }
    createScmHistoryCommit(gitCommit) {
        const range = {
            fromRevision: gitCommit.sha + '~1',
            toRevision: gitCommit.sha
        };
        const scmCommit = {
            ...this.createScmCommit(gitCommit),
            commitDetailUri: this.toCommitDetailUri(gitCommit.sha),
            scmProvider: this,
            gitFileChanges: gitCommit.fileChanges.map(change => new GitScmFileChange(change, this, range)),
            get fileChanges() {
                return this.gitFileChanges;
            },
            get commitDetailOptions() {
                return {
                    rootUri: this.scmProvider.rootUri,
                    commitSha: gitCommit.sha,
                    commitMessage: gitCommit.summary,
                    messageBody: gitCommit.body,
                    authorName: gitCommit.author.name,
                    authorEmail: gitCommit.author.email,
                    authorDate: gitCommit.author.timestamp,
                    authorDateRelative: gitCommit.authorDateRelative,
                };
            }
        };
        return scmCommit;
    }
    relativePath(uri) {
        const parsedUri = new uri_1.default(uri);
        const gitRepo = { localUri: this.rootUri };
        const relativePath = common_1.Repository.relativePath(gitRepo, parsedUri);
        if (relativePath) {
            return relativePath.toString();
        }
        return this.labelProvider.getLongName(parsedUri);
    }
    toCommitDetailUri(commitSha) {
        return new uri_1.default('').withScheme(GitScmProvider_1.GIT_COMMIT_DETAIL).withFragment(commitSha);
    }
};
__decorate([
    (0, inversify_1.inject)(editor_manager_1.EditorManager),
    __metadata("design:type", editor_manager_1.EditorManager)
], GitScmProvider.prototype, "editorManager", void 0);
__decorate([
    (0, inversify_1.inject)(git_error_handler_1.GitErrorHandler),
    __metadata("design:type", git_error_handler_1.GitErrorHandler)
], GitScmProvider.prototype, "gitErrorHandler", void 0);
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], GitScmProvider.prototype, "fileService", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.Git),
    __metadata("design:type", Object)
], GitScmProvider.prototype, "git", void 0);
__decorate([
    (0, inversify_1.inject)(command_1.CommandService),
    __metadata("design:type", Object)
], GitScmProvider.prototype, "commands", void 0);
__decorate([
    (0, inversify_1.inject)(GitScmProviderOptions),
    __metadata("design:type", GitScmProviderOptions)
], GitScmProvider.prototype, "options", void 0);
__decorate([
    (0, inversify_1.inject)(label_provider_1.LabelProvider),
    __metadata("design:type", label_provider_1.LabelProvider)
], GitScmProvider.prototype, "labelProvider", void 0);
__decorate([
    (0, inversify_1.inject)(git_preferences_1.GitPreferences),
    __metadata("design:type", Object)
], GitScmProvider.prototype, "gitPreferences", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GitScmProvider.prototype, "init", null);
GitScmProvider = GitScmProvider_1 = __decorate([
    (0, inversify_1.injectable)()
], GitScmProvider);
exports.GitScmProvider = GitScmProvider;
(function (GitScmProvider) {
    GitScmProvider.GIT_COMMIT_DETAIL = 'git-commit-detail-widget';
    function initState(status) {
        return {
            status,
            stagedChanges: [],
            unstagedChanges: [],
            mergeChanges: [],
            groups: []
        };
    }
    GitScmProvider.initState = initState;
    GitScmProvider.Factory = Symbol('GitScmProvider.Factory');
})(GitScmProvider = exports.GitScmProvider || (exports.GitScmProvider = {}));
exports.GitScmProvider = GitScmProvider;
class GitAmendSupport {
    constructor(provider, repository, git) {
        this.provider = provider;
        this.repository = repository;
        this.git = git;
    }
    async getInitialAmendingCommits(amendingHeadCommitSha, latestCommitSha) {
        const commits = await this.git.log(this.repository, {
            range: { toRevision: amendingHeadCommitSha, fromRevision: latestCommitSha },
            maxCount: 50
        });
        return commits.map(commit => this.provider.createScmCommit(commit));
    }
    async getMessage(commit) {
        return (await this.git.exec(this.repository, ['log', '-n', '1', '--format=%B', commit])).stdout.trim();
    }
    async reset(commit) {
        if (commit === 'HEAD~' && await this.isHeadInitialCommit()) {
            await this.git.exec(this.repository, ['update-ref', '-d', 'HEAD']);
        }
        else {
            await this.git.exec(this.repository, ['reset', commit, '--soft']);
        }
    }
    async isHeadInitialCommit() {
        const result = await this.git.revParse(this.repository, { ref: 'HEAD~' });
        return !result;
    }
    async getLastCommit() {
        const commits = await this.git.log(this.repository, { maxCount: 1 });
        if (commits.length > 0) {
            return this.provider.createScmCommit(commits[0]);
        }
    }
}
exports.GitAmendSupport = GitAmendSupport;
class GitScmFileChange {
    constructor(fileChange, scmProvider, range) {
        this.fileChange = fileChange;
        this.scmProvider = scmProvider;
        this.range = range;
    }
    get gitFileChange() {
        return this.fileChange;
    }
    get uri() {
        return this.fileChange.uri;
    }
    getCaption() {
        const provider = this.scmProvider;
        let result = `${provider.relativePath(this.fileChange.uri)} - ${common_1.GitFileStatus.toString(this.fileChange.status, true)}`;
        if (this.fileChange.oldUri) {
            result = `${provider.relativePath(this.fileChange.oldUri)} -> ${result}`;
        }
        return result;
    }
    getStatusCaption() {
        return common_1.GitFileStatus.toString(this.fileChange.status, true);
    }
    getStatusAbbreviation() {
        return common_1.GitFileStatus.toAbbreviation(this.fileChange.status, this.fileChange.staged);
    }
    getClassNameForStatus() {
        return 'git-status staged ' + common_1.GitFileStatus[this.fileChange.status].toLowerCase();
    }
    getUriToOpen() {
        const uri = new uri_1.default(this.fileChange.uri);
        const fromFileURI = this.fileChange.oldUri ? new uri_1.default(this.fileChange.oldUri) : uri; // set oldUri on renamed and copied
        if (!this.range) {
            return uri;
        }
        const fromURI = this.range.fromRevision
            ? fromFileURI.withScheme(git_resource_1.GIT_RESOURCE_SCHEME).withQuery(this.range.fromRevision.toString())
            : fromFileURI;
        const toURI = this.range.toRevision
            ? uri.withScheme(git_resource_1.GIT_RESOURCE_SCHEME).withQuery(this.range.toRevision.toString())
            : uri;
        let uriToOpen = uri;
        if (this.fileChange.status === common_1.GitFileStatus.Deleted) {
            uriToOpen = fromURI;
        }
        else if (this.fileChange.status === common_1.GitFileStatus.New) {
            uriToOpen = toURI;
        }
        else {
            uriToOpen = diff_uris_1.DiffUris.encode(fromURI, toURI);
        }
        return uriToOpen;
    }
}
exports.GitScmFileChange = GitScmFileChange;
//# sourceMappingURL=git-scm-provider.js.map