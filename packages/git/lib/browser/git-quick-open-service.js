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
exports.GitQuickOpenService = exports.GitAction = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const common_1 = require("../common");
const git_repository_provider_1 = require("./git-repository-provider");
const message_service_1 = require("@theia/core/lib/common/message-service");
const workspace_service_1 = require("@theia/workspace/lib/browser/workspace-service");
const git_error_handler_1 = require("./git-error-handler");
const progress_service_1 = require("@theia/core/lib/common/progress-service");
const uri_1 = require("@theia/core/lib/common/uri");
const nls_1 = require("@theia/core/lib/common/nls");
const browser_1 = require("@theia/core/lib/browser");
const file_service_1 = require("@theia/filesystem/lib/browser/file-service");
var GitAction;
(function (GitAction) {
    GitAction[GitAction["PULL"] = 0] = "PULL";
    GitAction[GitAction["PUSH"] = 1] = "PUSH";
})(GitAction = exports.GitAction || (exports.GitAction = {}));
/**
 * Service delegating into the `Quick Input Service`, so that the Git commands can be further refined.
 * For instance, the `remote` can be specified for `pull`, `push`, and `fetch`. And the branch can be
 * specified for `git merge`.
 */
let GitQuickOpenService = class GitQuickOpenService {
    constructor() {
        this.buildDefaultProjectPath = this.doBuildDefaultProjectPath.bind(this);
        this.wrapWithProgress = (fn) => this.doWrapWithProgress(fn);
    }
    async clone(url, folder, branch) {
        return this.withProgress(async () => {
            var _a;
            if (!folder) {
                const roots = await this.workspaceService.roots;
                folder = roots[0].resource.toString();
            }
            if (url) {
                const repo = await this.git.clone(url, {
                    localUri: await this.buildDefaultProjectPath(folder, url),
                    branch: branch
                });
                return repo.localUri;
            }
            (_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.showQuickPick([
                new GitQuickPickItem(nls_1.nls.localize('theia/git/cloneQuickInputLabel', 'Please provide a Git repository location. Press \'Enter\' to confirm or \'Escape\' to cancel.'))
            ], {
                placeholder: nls_1.nls.localize('vscode.git/dist/commands/selectFolder', 'Select Repository Location'),
                onDidChangeValue: (quickPick, filter) => this.query(quickPick, filter, folder)
            });
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query(quickPick, filter, folder) {
        quickPick.busy = true;
        const { git, buildDefaultProjectPath, gitErrorHandler, wrapWithProgress } = this;
        try {
            if (filter === undefined || filter.length === 0) {
                quickPick.items = [
                    new GitQuickPickItem(nls_1.nls.localize('theia/git/cloneQuickInputLabel', 'Please provide a Git repository location. Press \'Enter\' to confirm or \'Escape\' to cancel.'))
                ];
            }
            else {
                quickPick.items = [
                    new GitQuickPickItem(nls_1.nls.localize('theia/git/cloneRepository', 'Clone the Git repository: {0}. Press \'Enter\' to confirm or \'Escape\' to cancel.', filter), wrapWithProgress(async () => {
                        try {
                            await git.clone(filter, { localUri: await buildDefaultProjectPath(folder, filter) });
                        }
                        catch (error) {
                            gitErrorHandler.handleError(error);
                        }
                    }))
                ];
            }
        }
        catch (err) {
            quickPick.items = [new GitQuickPickItem('$(error) ' + nls_1.nls.localizeByDefault('Error: {0}', err.message))];
            console.error(err);
        }
        finally {
            quickPick.busy = false;
        }
    }
    async doBuildDefaultProjectPath(folderPath, gitURI) {
        if (!(await this.fileService.exists(new uri_1.default(folderPath)))) {
            // user specifies its own project path, doesn't want us to guess it
            return folderPath;
        }
        const uriSplitted = gitURI.split('/');
        let projectPath = folderPath + '/' + (uriSplitted.pop() || uriSplitted.pop());
        if (projectPath.endsWith('.git')) {
            projectPath = projectPath.substring(0, projectPath.length - '.git'.length);
        }
        return projectPath;
    }
    async fetch() {
        const repository = this.getRepository();
        if (!repository) {
            return;
        }
        return this.withProgress(async () => {
            var _a;
            const remotes = await this.getRemotes();
            const execute = async (item) => {
                try {
                    await this.git.fetch(repository, { remote: item.ref.name });
                }
                catch (error) {
                    this.gitErrorHandler.handleError(error);
                }
            };
            const items = remotes.map(remote => new GitQuickPickItem(remote.name, execute, remote, remote.fetch));
            (_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.showQuickPick(items, { placeholder: nls_1.nls.localize('theia/git/fetchPickRemote', 'Pick a remote to fetch from:') });
        });
    }
    async performDefaultGitAction(action) {
        var _a;
        const remote = await this.getRemotes();
        const defaultRemote = (_a = remote[0]) === null || _a === void 0 ? void 0 : _a.name;
        const repository = this.getRepository();
        if (!repository) {
            return;
        }
        return this.withProgress(async () => {
            try {
                if (action === GitAction.PULL) {
                    await this.git.pull(repository, { remote: defaultRemote });
                    console.log(`Git Pull: successfully completed from ${defaultRemote}.`);
                }
                else if (action === GitAction.PUSH) {
                    await this.git.push(repository, { remote: defaultRemote, setUpstream: true });
                    console.log(`Git Push: successfully completed to ${defaultRemote}.`);
                }
            }
            catch (error) {
                this.gitErrorHandler.handleError(error);
            }
        });
    }
    async push() {
        const repository = this.getRepository();
        if (!repository) {
            return;
        }
        return this.withProgress(async () => {
            var _a;
            const [remotes, currentBranch] = await Promise.all([this.getRemotes(), this.getCurrentBranch()]);
            const execute = async (item) => {
                try {
                    await this.git.push(repository, { remote: item.label, setUpstream: true });
                }
                catch (error) {
                    this.gitErrorHandler.handleError(error);
                }
            };
            const items = remotes.map(remote => new GitQuickPickItem(remote.name, execute, remote, remote.push));
            const branchName = currentBranch ? `'${currentBranch.name}' ` : '';
            (_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.showQuickPick(items, {
                placeholder: nls_1.nls.localize('vscode.git/dist/commands/pick remote', "Pick a remote to publish the branch '{0}' to:", branchName)
            });
        });
    }
    async pull() {
        const repository = this.getRepository();
        if (!repository) {
            return;
        }
        return this.withProgress(async () => {
            var _a;
            const remotes = await this.getRemotes();
            const defaultRemote = remotes[0].name; // I wish I could use assignment destructuring here. (GH-413)
            const executeRemote = async (remoteItem) => {
                var _a;
                // The first remote is the default.
                if (remoteItem.ref.name === defaultRemote) {
                    try {
                        await this.git.pull(repository, { remote: remoteItem.label });
                    }
                    catch (error) {
                        this.gitErrorHandler.handleError(error);
                    }
                }
                else {
                    // Otherwise we need to propose the branches from
                    const branches = await this.getBranches();
                    const executeBranch = async (branchItem) => {
                        try {
                            await this.git.pull(repository, { remote: remoteItem.ref.name, branch: branchItem.ref.nameWithoutRemote });
                        }
                        catch (error) {
                            this.gitErrorHandler.handleError(error);
                        }
                    };
                    const branchItems = branches
                        .filter(branch => branch.type === common_1.BranchType.Remote)
                        .filter(branch => (branch.name || '').startsWith(`${remoteItem.label}/`))
                        .map(branch => new GitQuickPickItem(branch.name, executeBranch, branch));
                    (_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.showQuickPick(branchItems, {
                        placeholder: nls_1.nls.localize('vscode.git/dist/commands/pick branch pull', 'Pick a branch to pull from')
                    });
                }
            };
            const remoteItems = remotes.map(remote => new GitQuickPickItem(remote.name, executeRemote, remote, remote.fetch));
            (_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.showQuickPick(remoteItems, {
                placeholder: nls_1.nls.localize('vscode.git/dist/commands/pick remote pull repo', 'Pick a remote to pull the branch from')
            });
        });
    }
    async merge() {
        const repository = this.getRepository();
        if (!repository) {
            return;
        }
        return this.withProgress(async () => {
            var _a;
            const [branches, currentBranch] = await Promise.all([this.getBranches(), this.getCurrentBranch()]);
            const execute = async (item) => {
                try {
                    await this.git.merge(repository, { branch: item.label });
                }
                catch (error) {
                    this.gitErrorHandler.handleError(error);
                }
            };
            const items = branches.map(branch => new GitQuickPickItem(branch.name, execute, branch));
            const branchName = currentBranch ? `'${currentBranch.name}' ` : '';
            (_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.showQuickPick(items, {
                placeholder: nls_1.nls.localize('theia/git/mergeQuickPickPlaceholder', 'Pick a branch to merge into the currently active {0} branch:', branchName)
            });
        });
    }
    async checkout() {
        const repository = this.getRepository();
        if (!repository) {
            return;
        }
        return this.withProgress(async () => {
            var _a;
            const [branches, currentBranch] = await Promise.all([this.getBranches(), this.getCurrentBranch()]);
            if (currentBranch) {
                // We do not show the current branch.
                const index = branches.findIndex(branch => branch && branch.name === currentBranch.name);
                branches.splice(index, 1);
            }
            const switchBranch = async (item) => {
                try {
                    await this.git.checkout(repository, { branch: item.ref.nameWithoutRemote });
                }
                catch (error) {
                    this.gitErrorHandler.handleError(error);
                }
            };
            const items = branches.map(branch => new GitQuickPickItem(branch.type === common_1.BranchType.Remote ? branch.name : branch.nameWithoutRemote, switchBranch, branch, branch.type === common_1.BranchType.Remote
                ? nls_1.nls.localize('vscode.git/dist/commands/remote branch at', 'Remote branch at {0}', (branch.tip.sha.length > 8 ? ` ${branch.tip.sha.slice(0, 7)}` : ''))
                : (branch.tip.sha.length > 8 ? ` ${branch.tip.sha.slice(0, 7)}` : '')));
            const createBranchItem = async () => {
                var _a;
                const { git, gitErrorHandler, wrapWithProgress } = this;
                const getItems = (lookFor) => {
                    const dynamicItems = [];
                    if (lookFor === undefined || lookFor.length === 0) {
                        dynamicItems.push(new GitQuickPickItem(nls_1.nls.localize('theia/git/checkoutProvideBranchName', 'Please provide a branch name. '), () => { }));
                    }
                    else {
                        dynamicItems.push(new GitQuickPickItem(nls_1.nls.localize('theia/git/checkoutCreateLocalBranchWithName', "Create a new local branch with name: {0}. Press 'Enter' to confirm or 'Escape' to cancel.", lookFor), wrapWithProgress(async () => {
                            try {
                                await git.branch(repository, { toCreate: lookFor });
                                await git.checkout(repository, { branch: lookFor });
                            }
                            catch (error) {
                                gitErrorHandler.handleError(error);
                            }
                        })));
                    }
                    return dynamicItems;
                };
                (_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.showQuickPick(getItems(), {
                    placeholder: nls_1.nls.localize('vscode.git/dist/commands/branch name', 'Branch name'),
                    onDidChangeValue: (quickPick, filter) => {
                        quickPick.items = getItems(filter);
                    }
                });
            };
            items.unshift(new GitQuickPickItem(nls_1.nls.localize('vscode.git/dist/commands/create branch', 'Create new branch...'), createBranchItem));
            (_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.showQuickPick(items, { placeholder: nls_1.nls.localize('theia/git/checkoutSelectRef', 'Select a ref to checkout or create a new local branch:') });
        });
    }
    async chooseTagsAndBranches(execFunc, repository = this.getRepository()) {
        if (!repository) {
            return;
        }
        return this.withProgress(async () => {
            var _a;
            const [branches, tags, currentBranch] = await Promise.all([this.getBranches(repository), this.getTags(repository), this.getCurrentBranch(repository)]);
            const execute = async (item) => {
                execFunc(item.ref.name, currentBranch ? currentBranch.name : '');
            };
            const branchItems = branches.map(branch => new GitQuickPickItem(branch.name, execute, branch));
            const branchName = currentBranch ? `'${currentBranch.name}' ` : '';
            const tagItems = tags.map(tag => new GitQuickPickItem(tag.name, execute, tag));
            (_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.showQuickPick([...branchItems, ...tagItems], { placeholder: nls_1.nls.localize('theia/git/compareWithBranchOrTag', 'Pick a branch or tag to compare with the currently active {0} branch:', branchName) });
        });
    }
    async commitMessageForAmend() {
        const repository = this.getRepository();
        if (!repository) {
            throw new Error(nls_1.nls.localize('theia/git/noRepositoriesSelected', 'No repositories were selected.'));
        }
        return this.withProgress(async () => {
            const lastMessage = (await this.git.exec(repository, ['log', '--format=%B', '-n', '1'])).stdout.trim();
            if (lastMessage.length === 0) {
                throw new Error(nls_1.nls.localize('theia/git/repositoryNotInitialized', 'Repository {0} is not yet initialized.', repository.localUri));
            }
            const message = lastMessage.replace(/[\r\n]+/g, ' ');
            const result = await new Promise(async (resolve, reject) => {
                var _a;
                const getItems = (lookFor) => {
                    const items = [];
                    if (!lookFor) {
                        const label = nls_1.nls.localize('theia/git/amendReuseMessag', "To reuse the last commit message, press 'Enter' or 'Escape' to cancel.");
                        items.push(new GitQuickPickItem(label, () => resolve(lastMessage), label));
                    }
                    else {
                        items.push(new GitQuickPickItem(nls_1.nls.localize('theia/git/amendRewrite', "Rewrite previous commit message. Press 'Enter' to confirm or 'Escape' to cancel."), () => resolve(lookFor)));
                    }
                    return items;
                };
                const updateItems = (quickPick, filter) => {
                    quickPick.items = getItems(filter);
                };
                (_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.showQuickPick(getItems(), { placeholder: message, onDidChangeValue: updateItems });
            });
            return result;
        });
    }
    async stash() {
        const repository = this.getRepository();
        if (!repository) {
            return;
        }
        return this.withProgress(async () => {
            var _a;
            const doStash = this.wrapWithProgress(async (message) => {
                this.git.stash(repository, { message });
            });
            const getItems = (lookFor) => {
                const items = [];
                if (lookFor === undefined || lookFor.length === 0) {
                    items.push(new GitQuickPickItem(nls_1.nls.localize('theia/git/stashChanges', "Stash changes. Press 'Enter' to confirm or 'Escape' to cancel."), () => doStash('')));
                }
                else {
                    items.push(new GitQuickPickItem(nls_1.nls.localize('theia/git/stashChangesWithMessage', "Stash changes with message: {0}. Press 'Enter' to confirm or 'Escape' to cancel.", lookFor), () => doStash(lookFor)));
                }
                return items;
            };
            const updateItems = (quickPick, filter) => {
                quickPick.items = getItems(filter);
            };
            (_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.showQuickPick(getItems(), {
                placeholder: nls_1.nls.localize('vscode.git/dist/commands/stash message', 'Stash message'), onDidChangeValue: updateItems
            });
        });
    }
    async doStashAction(action, text, getMessage) {
        const repository = this.getRepository();
        if (!repository) {
            return;
        }
        return this.withProgress(async () => {
            var _a;
            const list = await this.git.stash(repository, { action: 'list' });
            if (list) {
                const items = list.map(stash => new GitQuickPickItem(stash.message, this.wrapWithProgress(async () => {
                    try {
                        await this.git.stash(repository, { action, id: stash.id });
                        if (getMessage) {
                            this.messageService.info(await getMessage());
                        }
                    }
                    catch (error) {
                        this.gitErrorHandler.handleError(error);
                    }
                })));
                (_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.showQuickPick(items, { placeholder: text });
            }
        });
    }
    async applyStash() {
        this.doStashAction('apply', nls_1.nls.localize('vscode.git/dist/commands/pick stash to apply', 'Pick a stash to apply'));
    }
    async popStash() {
        this.doStashAction('pop', nls_1.nls.localize('vscode.git/dist/commands/pick stash to pop', 'Pick a stash to pop'));
    }
    async dropStash() {
        const repository = this.getRepository();
        if (!repository) {
            return;
        }
        this.doStashAction('drop', nls_1.nls.localize('vscode.git/dist/commands/pick stash to drop', 'Pick a stash to drop'), async () => nls_1.nls.localize('theia/git/dropStashMessage', 'Stash successfully removed.'));
    }
    async applyLatestStash() {
        const repository = this.getRepository();
        if (!repository) {
            return;
        }
        return this.withProgress(async () => {
            try {
                await this.git.stash(repository, {
                    action: 'apply'
                });
            }
            catch (error) {
                this.gitErrorHandler.handleError(error);
            }
        });
    }
    async popLatestStash() {
        const repository = this.getRepository();
        if (!repository) {
            return;
        }
        return this.withProgress(async () => {
            try {
                await this.git.stash(repository, {
                    action: 'pop'
                });
            }
            catch (error) {
                this.gitErrorHandler.handleError(error);
            }
        });
    }
    async initRepository() {
        var _a;
        const wsRoots = await this.workspaceService.roots;
        if (wsRoots && wsRoots.length > 1) {
            const items = wsRoots.map(root => this.toRepositoryPathQuickOpenItem(root));
            (_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.showQuickPick(items, { placeholder: nls_1.nls.localize('vscode.git/dist/commands/init', 'Pick workspace folder to initialize git repo in') });
        }
        else {
            const rootUri = wsRoots[0].resource;
            this.doInitRepository(rootUri.toString());
        }
    }
    async doInitRepository(uri) {
        this.withProgress(async () => this.git.exec({ localUri: uri }, ['init']));
    }
    toRepositoryPathQuickOpenItem(root) {
        const rootUri = root.resource;
        const execute = async (item) => {
            const wsRoot = item.ref.toString();
            this.doInitRepository(wsRoot);
        };
        return new GitQuickPickItem(this.labelProvider.getName(rootUri), execute, rootUri, this.labelProvider.getLongName(rootUri.parent));
    }
    getRepository() {
        return this.repositoryProvider.selectedRepository;
    }
    async getRemotes() {
        const repository = this.getRepository();
        if (!repository) {
            return [];
        }
        return this.withProgress(async () => {
            try {
                return await this.git.remote(repository, { verbose: true });
            }
            catch (error) {
                this.gitErrorHandler.handleError(error);
                return [];
            }
        });
    }
    async getTags(repository = this.getRepository()) {
        if (!repository) {
            return [];
        }
        return this.withProgress(async () => {
            const result = await this.git.exec(repository, ['tag', '--sort=-creatordate']);
            return result.stdout !== '' ? result.stdout.trim().split('\n').map(tag => ({ name: tag })) : [];
        });
    }
    async getBranches(repository = this.getRepository()) {
        if (!repository) {
            return [];
        }
        return this.withProgress(async () => {
            try {
                const [local, remote] = await Promise.all([
                    this.git.branch(repository, { type: 'local' }),
                    this.git.branch(repository, { type: 'remote' })
                ]);
                return [...local, ...remote];
            }
            catch (error) {
                this.gitErrorHandler.handleError(error);
                return [];
            }
        });
    }
    async getCurrentBranch(repository = this.getRepository()) {
        if (!repository) {
            return undefined;
        }
        return this.withProgress(async () => {
            try {
                return await this.git.branch(repository, { type: 'current' });
            }
            catch (error) {
                this.gitErrorHandler.handleError(error);
                return undefined;
            }
        });
    }
    withProgress(fn) {
        return this.progressService.withProgress('', 'scm', fn);
    }
    doWrapWithProgress(fn) {
        return (...args) => this.withProgress(() => fn(...args));
    }
};
__decorate([
    (0, inversify_1.inject)(git_error_handler_1.GitErrorHandler),
    __metadata("design:type", git_error_handler_1.GitErrorHandler)
], GitQuickOpenService.prototype, "gitErrorHandler", void 0);
__decorate([
    (0, inversify_1.inject)(progress_service_1.ProgressService),
    __metadata("design:type", progress_service_1.ProgressService)
], GitQuickOpenService.prototype, "progressService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.LabelProvider),
    __metadata("design:type", browser_1.LabelProvider)
], GitQuickOpenService.prototype, "labelProvider", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.Git),
    __metadata("design:type", Object)
], GitQuickOpenService.prototype, "git", void 0);
__decorate([
    (0, inversify_1.inject)(git_repository_provider_1.GitRepositoryProvider),
    __metadata("design:type", git_repository_provider_1.GitRepositoryProvider)
], GitQuickOpenService.prototype, "repositoryProvider", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.QuickInputService),
    (0, inversify_1.optional)(),
    __metadata("design:type", Object)
], GitQuickOpenService.prototype, "quickInputService", void 0);
__decorate([
    (0, inversify_1.inject)(message_service_1.MessageService),
    __metadata("design:type", message_service_1.MessageService)
], GitQuickOpenService.prototype, "messageService", void 0);
__decorate([
    (0, inversify_1.inject)(workspace_service_1.WorkspaceService),
    __metadata("design:type", workspace_service_1.WorkspaceService)
], GitQuickOpenService.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], GitQuickOpenService.prototype, "fileService", void 0);
GitQuickOpenService = __decorate([
    (0, inversify_1.injectable)()
], GitQuickOpenService);
exports.GitQuickOpenService = GitQuickOpenService;
class GitQuickPickItem {
    constructor(label, execute, ref, description, alwaysShow = true, sortByLabel = false) {
        this.label = label;
        this.ref = ref;
        this.description = description;
        this.alwaysShow = alwaysShow;
        this.sortByLabel = sortByLabel;
        this.execute = execute ? createExecFunction(execute, this) : undefined;
    }
}
function createExecFunction(f, item) {
    return () => { f(item); };
}
//# sourceMappingURL=git-quick-open-service.js.map