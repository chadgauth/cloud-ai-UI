"use strict";
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
exports.GitContribution = exports.GIT_MENUS = exports.GIT_COMMANDS = void 0;
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
const inversify_1 = require("@theia/core/shared/inversify");
const core_1 = require("@theia/core");
const browser_1 = require("@theia/core/lib/browser");
const browser_2 = require("@theia/editor/lib/browser");
const common_1 = require("../common");
const git_repository_tracker_1 = require("./git-repository-tracker");
const git_quick_open_service_1 = require("./git-quick-open-service");
const git_sync_service_1 = require("./git-sync-service");
const browser_3 = require("@theia/workspace/lib/browser");
const git_repository_provider_1 = require("./git-repository-provider");
const git_error_handler_1 = require("../browser/git-error-handler");
const scm_widget_1 = require("@theia/scm/lib/browser/scm-widget");
const scm_tree_widget_1 = require("@theia/scm/lib/browser/scm-tree-widget");
const progress_service_1 = require("@theia/core/lib/common/progress-service");
const git_preferences_1 = require("./git-preferences");
const scm_input_1 = require("@theia/scm/lib/browser/scm-input");
const decorations_service_1 = require("@theia/core/lib/browser/decorations-service");
const git_decoration_provider_1 = require("./git-decoration-provider");
const nls_1 = require("@theia/core/lib/common/nls");
var GIT_COMMANDS;
(function (GIT_COMMANDS) {
    const GIT_CATEGORY_KEY = 'vscode.git/package/displayName';
    const GIT_CATEGORY = 'Git';
    GIT_COMMANDS.CLONE = core_1.Command.toLocalizedCommand({
        id: 'git.clone',
        category: GIT_CATEGORY,
        label: 'Clone...'
    }, 'vscode.git/package/command.clone', GIT_CATEGORY_KEY);
    GIT_COMMANDS.FETCH = core_1.Command.toLocalizedCommand({
        id: 'git.fetch',
        category: GIT_CATEGORY,
        label: 'Fetch...'
    }, 'vscode.git/package/command.fetch', GIT_CATEGORY_KEY);
    GIT_COMMANDS.PULL_DEFAULT = core_1.Command.toLocalizedCommand({
        id: 'git.pull.default',
        category: GIT_CATEGORY,
        label: 'Pull'
    }, 'vscode.git/package/command.pull', GIT_CATEGORY_KEY);
    GIT_COMMANDS.PULL_DEFAULT_FAVORITE = {
        id: GIT_COMMANDS.PULL_DEFAULT.id + '.favorite',
        label: GIT_COMMANDS.PULL_DEFAULT.label,
        originalLabel: GIT_COMMANDS.PULL_DEFAULT.originalLabel
    };
    GIT_COMMANDS.PULL = core_1.Command.toLocalizedCommand({
        id: 'git.pull',
        category: GIT_CATEGORY,
        label: 'Pull from...'
    }, 'vscode.git/package/command.pullFrom', GIT_CATEGORY_KEY);
    GIT_COMMANDS.PUSH_DEFAULT = core_1.Command.toLocalizedCommand({
        id: 'git.push.default',
        category: GIT_CATEGORY,
        label: 'Push'
    }, 'vscode.git/package/command.push', GIT_CATEGORY_KEY);
    GIT_COMMANDS.PUSH_DEFAULT_FAVORITE = {
        id: GIT_COMMANDS.PUSH_DEFAULT.id + '.favorite',
        label: GIT_COMMANDS.PUSH_DEFAULT.label,
        originalLabel: GIT_COMMANDS.PUSH_DEFAULT.originalLabel
    };
    GIT_COMMANDS.PUSH = core_1.Command.toLocalizedCommand({
        id: 'git.push',
        category: GIT_CATEGORY,
        label: 'Push to...'
    }, 'vscode.git/package/command.pushTo', GIT_CATEGORY_KEY);
    GIT_COMMANDS.MERGE = core_1.Command.toLocalizedCommand({
        id: 'git.merge',
        category: GIT_CATEGORY,
        label: 'Merge...'
    }, 'vscode.git/package/command.merge', GIT_CATEGORY_KEY);
    GIT_COMMANDS.CHECKOUT = core_1.Command.toLocalizedCommand({
        id: 'git.checkout',
        category: GIT_CATEGORY,
        label: 'Checkout'
    }, 'vscode.git/package/command.checkout', GIT_CATEGORY_KEY);
    GIT_COMMANDS.COMMIT = {
        ...core_1.Command.toLocalizedCommand({
            id: 'git.commit.all',
            label: 'Commit',
            iconClass: (0, browser_1.codicon)('check')
        }, 'vscode.git/package/command.commit'),
        tooltip: 'Commit all the staged changes',
    };
    GIT_COMMANDS.COMMIT_ADD_SIGN_OFF = core_1.Command.toLocalizedCommand({
        id: 'git-commit-add-sign-off',
        label: 'Add Signed-off-by',
        category: GIT_CATEGORY,
        iconClass: (0, browser_1.codicon)('edit')
    }, 'theia/git/addSignedOff', GIT_CATEGORY_KEY);
    GIT_COMMANDS.COMMIT_AMEND = {
        id: 'git.commit.amend'
    };
    GIT_COMMANDS.COMMIT_SIGN_OFF = {
        id: 'git.commit.signOff'
    };
    GIT_COMMANDS.OPEN_FILE = core_1.Command.toLocalizedCommand({
        id: 'git.open.file',
        category: GIT_CATEGORY,
        label: 'Open File',
        iconClass: (0, browser_1.codicon)('go-to-file')
    }, 'vscode.git/package/command.openFile', GIT_CATEGORY_KEY);
    GIT_COMMANDS.OPEN_CHANGED_FILE = core_1.Command.toLocalizedCommand({
        id: 'git.open.changed.file',
        category: GIT_CATEGORY,
        label: 'Open File',
        iconClass: (0, browser_1.codicon)('go-to-file')
    }, 'vscode.git/package/command.openFile', GIT_CATEGORY_KEY);
    GIT_COMMANDS.OPEN_CHANGES = core_1.Command.toLocalizedCommand({
        id: 'git.open.changes',
        category: GIT_CATEGORY,
        label: 'Open Changes',
        iconClass: (0, browser_1.codicon)('git-compare')
    }, 'vscode.git/package/command.openChange', GIT_CATEGORY_KEY);
    GIT_COMMANDS.SYNC = core_1.Command.toLocalizedCommand({
        id: 'git.sync',
        category: GIT_CATEGORY,
        label: 'Sync'
    }, 'vscode.git/package/command.sync', GIT_CATEGORY_KEY);
    GIT_COMMANDS.PUBLISH = core_1.Command.toLocalizedCommand({
        id: 'git.publish',
        category: GIT_CATEGORY,
        label: 'Publish Branch'
    }, 'vscode.git/package/command.publish', GIT_CATEGORY_KEY);
    GIT_COMMANDS.STAGE = core_1.Command.toLocalizedCommand({
        id: 'git.stage',
        category: GIT_CATEGORY,
        label: 'Stage Changes',
        iconClass: (0, browser_1.codicon)('add')
    }, 'vscode.git/package/command.stage', GIT_CATEGORY_KEY);
    GIT_COMMANDS.STAGE_ALL = core_1.Command.toLocalizedCommand({
        id: 'git.stage.all',
        category: GIT_CATEGORY,
        label: 'Stage All Changes',
        iconClass: (0, browser_1.codicon)('add')
    }, 'vscode.git/package/command.stageAll', GIT_CATEGORY_KEY);
    GIT_COMMANDS.UNSTAGE = core_1.Command.toLocalizedCommand({
        id: 'git.unstage',
        category: GIT_CATEGORY,
        label: 'Unstage Changes',
        iconClass: (0, browser_1.codicon)('dash')
    }, 'vscode.git/package/command.unstage', GIT_CATEGORY_KEY);
    GIT_COMMANDS.UNSTAGE_ALL = core_1.Command.toLocalizedCommand({
        id: 'git.unstage.all',
        category: GIT_CATEGORY,
        label: 'Unstage All',
        iconClass: (0, browser_1.codicon)('dash')
    }, 'vscode.git/package/command.unstageAll', GIT_CATEGORY_KEY);
    GIT_COMMANDS.DISCARD = core_1.Command.toLocalizedCommand({
        id: 'git.discard',
        iconClass: (0, browser_1.codicon)('discard'),
        category: GIT_CATEGORY,
        label: 'Discard Changes'
    }, 'vscode.git/package/command.clean', GIT_CATEGORY_KEY);
    GIT_COMMANDS.DISCARD_ALL = core_1.Command.toLocalizedCommand({
        id: 'git.discard.all',
        category: GIT_CATEGORY,
        label: 'Discard All Changes',
        iconClass: (0, browser_1.codicon)('discard')
    }, 'vscode.git/package/command.cleanAll', GIT_CATEGORY_KEY);
    GIT_COMMANDS.STASH = core_1.Command.toLocalizedCommand({
        id: 'git.stash',
        category: GIT_CATEGORY,
        label: 'Stash...'
    }, 'vscode.git/package/command.stash', GIT_CATEGORY_KEY);
    GIT_COMMANDS.APPLY_STASH = core_1.Command.toLocalizedCommand({
        id: 'git.stash.apply',
        category: GIT_CATEGORY,
        label: 'Apply Stash...'
    }, 'vscode.git/package/command.stashApply', GIT_CATEGORY_KEY);
    GIT_COMMANDS.APPLY_LATEST_STASH = core_1.Command.toLocalizedCommand({
        id: 'git.stash.apply.latest',
        category: GIT_CATEGORY,
        label: 'Apply Latest Stash'
    }, 'vscode.git/package/command.stashApplyLatest', GIT_CATEGORY_KEY);
    GIT_COMMANDS.POP_STASH = core_1.Command.toLocalizedCommand({
        id: 'git.stash.pop',
        category: GIT_CATEGORY,
        label: 'Pop Stash...'
    }, 'vscode.git/package/command.stashPop', GIT_CATEGORY_KEY);
    GIT_COMMANDS.POP_LATEST_STASH = core_1.Command.toLocalizedCommand({
        id: 'git.stash.pop.latest',
        category: GIT_CATEGORY,
        label: 'Pop Latest Stash'
    }, 'vscode.git/package/command.stashPopLatest', GIT_CATEGORY_KEY);
    GIT_COMMANDS.DROP_STASH = core_1.Command.toLocalizedCommand({
        id: 'git.stash.drop',
        category: GIT_CATEGORY,
        label: 'Drop Stash...'
    }, 'vscode.git/package/command.stashDrop', GIT_CATEGORY_KEY);
    GIT_COMMANDS.REFRESH = core_1.Command.toLocalizedCommand({
        id: 'git-refresh',
        label: 'Refresh',
        category: GIT_CATEGORY,
        iconClass: (0, browser_1.codicon)('refresh')
    }, 'vscode.git/package/command.refresh', GIT_CATEGORY_KEY);
    GIT_COMMANDS.INIT_REPOSITORY = core_1.Command.toLocalizedCommand({
        id: 'git-init',
        label: 'Initialize Repository',
        category: GIT_CATEGORY,
        iconClass: (0, browser_1.codicon)('add')
    }, 'vscode.git/package/command.init', GIT_CATEGORY_KEY);
})(GIT_COMMANDS = exports.GIT_COMMANDS || (exports.GIT_COMMANDS = {}));
var GIT_MENUS;
(function (GIT_MENUS) {
    // Top level Groups
    GIT_MENUS.FAV_GROUP = '2_favorites';
    GIT_MENUS.COMMANDS_GROUP = '3_commands';
    GIT_MENUS.SUBMENU_COMMIT = {
        group: GIT_MENUS.COMMANDS_GROUP,
        label: nls_1.nls.localize('vscode.git/package/submenu.commit', 'Commit'),
        menuGroups: ['1_commit'],
    };
    GIT_MENUS.SUBMENU_CHANGES = {
        group: GIT_MENUS.COMMANDS_GROUP,
        label: nls_1.nls.localize('vscode.git/package/submenu.changes', 'Changes'),
        menuGroups: ['1_changes']
    };
    GIT_MENUS.SUBMENU_PULL_PUSH = {
        group: GIT_MENUS.COMMANDS_GROUP,
        label: nls_1.nls.localize('vscode.git/package/submenu.pullpush', 'Pull, Push'),
        menuGroups: ['2_pull', '3_push', '4_fetch']
    };
    GIT_MENUS.SUBMENU_STASH = {
        group: GIT_MENUS.COMMANDS_GROUP,
        label: nls_1.nls.localize('vscode.git/package/submenu.stash', 'Stash'),
        menuGroups: ['1_stash']
    };
})(GIT_MENUS = exports.GIT_MENUS || (exports.GIT_MENUS = {}));
let GitContribution = class GitContribution {
    constructor() {
        this.toDispose = new core_1.DisposableCollection();
    }
    onStart() {
        this.updateStatusBar();
        this.repositoryTracker.onGitEvent(() => this.updateStatusBar());
        this.syncService.onDidChange(() => this.updateStatusBar());
        this.decorationsService.registerDecorationsProvider(this.gitDecorationProvider);
    }
    registerMenus(menus) {
        menus.registerMenuAction(browser_2.EditorContextMenu.NAVIGATION, {
            commandId: GIT_COMMANDS.OPEN_FILE.id
        });
        menus.registerMenuAction(browser_2.EditorContextMenu.NAVIGATION, {
            commandId: GIT_COMMANDS.OPEN_CHANGES.id
        });
        const registerResourceAction = (group, action) => {
            menus.registerMenuAction(scm_tree_widget_1.ScmTreeWidget.RESOURCE_INLINE_MENU, action);
            menus.registerMenuAction([...scm_tree_widget_1.ScmTreeWidget.RESOURCE_CONTEXT_MENU, group], action);
        };
        registerResourceAction('navigation', {
            commandId: GIT_COMMANDS.OPEN_CHANGED_FILE.id,
            when: 'scmProvider == git && scmResourceGroup == workingTree || scmProvider == git && scmResourceGroup == untrackedChanges'
        });
        registerResourceAction('1_modification', {
            commandId: GIT_COMMANDS.DISCARD.id,
            when: 'scmProvider == git && scmResourceGroup == workingTree || scmProvider == git && scmResourceGroup == untrackedChanges'
        });
        registerResourceAction('1_modification', {
            commandId: GIT_COMMANDS.STAGE.id,
            when: 'scmProvider == git && scmResourceGroup == workingTree || scmProvider == git && scmResourceGroup == untrackedChanges'
        });
        registerResourceAction('navigation', {
            commandId: GIT_COMMANDS.OPEN_CHANGED_FILE.id,
            when: 'scmProvider == git && scmResourceGroup == index'
        });
        registerResourceAction('1_modification', {
            commandId: GIT_COMMANDS.UNSTAGE.id,
            when: 'scmProvider == git && scmResourceGroup == index'
        });
        registerResourceAction('navigation', {
            commandId: GIT_COMMANDS.OPEN_CHANGED_FILE.id,
            when: 'scmProvider == git && scmResourceGroup == merge'
        });
        registerResourceAction('1_modification', {
            commandId: GIT_COMMANDS.DISCARD.id,
            when: 'scmProvider == git && scmResourceGroup == merge'
        });
        registerResourceAction('1_modification', {
            commandId: GIT_COMMANDS.STAGE.id,
            when: 'scmProvider == git && scmResourceGroup == merge'
        });
        const registerResourceFolderAction = (group, action) => {
            menus.registerMenuAction(scm_tree_widget_1.ScmTreeWidget.RESOURCE_FOLDER_INLINE_MENU, action);
            menus.registerMenuAction([...scm_tree_widget_1.ScmTreeWidget.RESOURCE_FOLDER_CONTEXT_MENU, group], action);
        };
        registerResourceFolderAction('1_modification', {
            commandId: GIT_COMMANDS.DISCARD.id,
            when: 'scmProvider == git && scmResourceGroup == workingTree || scmProvider == git && scmResourceGroup == untrackedChanges'
        });
        registerResourceFolderAction('1_modification', {
            commandId: GIT_COMMANDS.STAGE.id,
            when: 'scmProvider == git && scmResourceGroup == workingTree || scmProvider == git && scmResourceGroup == untrackedChanges'
        });
        registerResourceFolderAction('1_modification', {
            commandId: GIT_COMMANDS.UNSTAGE.id,
            when: 'scmProvider == git && scmResourceGroup == index'
        });
        registerResourceFolderAction('1_modification', {
            commandId: GIT_COMMANDS.DISCARD.id,
            when: 'scmProvider == git && scmResourceGroup == merge'
        });
        registerResourceFolderAction('1_modification', {
            commandId: GIT_COMMANDS.STAGE.id,
            when: 'scmProvider == git && scmResourceGroup == merge'
        });
        const registerResourceGroupAction = (group, action) => {
            menus.registerMenuAction(scm_tree_widget_1.ScmTreeWidget.RESOURCE_GROUP_INLINE_MENU, action);
            menus.registerMenuAction([...scm_tree_widget_1.ScmTreeWidget.RESOURCE_GROUP_CONTEXT_MENU, group], action);
        };
        registerResourceGroupAction('1_modification', {
            commandId: GIT_COMMANDS.STAGE_ALL.id,
            when: 'scmProvider == git && scmResourceGroup == merge',
        });
        registerResourceGroupAction('1_modification', {
            commandId: GIT_COMMANDS.UNSTAGE_ALL.id,
            when: 'scmProvider == git && scmResourceGroup == index',
        });
        registerResourceGroupAction('1_modification', {
            commandId: GIT_COMMANDS.STAGE_ALL.id,
            when: 'scmProvider == git && scmResourceGroup == workingTree || scmProvider == git && scmResourceGroup == untrackedChanges',
        });
        registerResourceGroupAction('1_modification', {
            commandId: GIT_COMMANDS.DISCARD_ALL.id,
            when: 'scmProvider == git && scmResourceGroup == workingTree || scmProvider == git && scmResourceGroup == untrackedChanges',
        });
    }
    registerCommands(registry) {
        registry.registerCommand(GIT_COMMANDS.FETCH, {
            execute: () => this.withProgress(() => this.quickOpenService.fetch()),
            isEnabled: () => !!this.repositoryTracker.selectedRepository
        });
        registry.registerCommand(GIT_COMMANDS.PULL_DEFAULT, {
            execute: () => this.withProgress(() => this.quickOpenService.performDefaultGitAction(git_quick_open_service_1.GitAction.PULL)),
            isEnabled: () => !!this.repositoryTracker.selectedRepository
        });
        registry.registerCommand(GIT_COMMANDS.PULL_DEFAULT_FAVORITE, {
            execute: () => registry.executeCommand(GIT_COMMANDS.PULL_DEFAULT.id),
            isEnabled: () => !!this.repositoryTracker.selectedRepository
        });
        registry.registerCommand(GIT_COMMANDS.PULL, {
            execute: () => this.withProgress(() => this.quickOpenService.pull()),
            isEnabled: () => !!this.repositoryTracker.selectedRepository
        });
        registry.registerCommand(GIT_COMMANDS.PUSH_DEFAULT, {
            execute: () => this.withProgress(() => this.quickOpenService.performDefaultGitAction(git_quick_open_service_1.GitAction.PUSH)),
            isEnabled: () => !!this.repositoryTracker.selectedRepository
        });
        registry.registerCommand(GIT_COMMANDS.PUSH_DEFAULT_FAVORITE, {
            execute: () => registry.executeCommand(GIT_COMMANDS.PUSH_DEFAULT.id),
            isEnabled: () => !!this.repositoryTracker.selectedRepository
        });
        registry.registerCommand(GIT_COMMANDS.PUSH, {
            execute: () => this.withProgress(() => this.quickOpenService.push()),
            isEnabled: () => !!this.repositoryTracker.selectedRepository
        });
        registry.registerCommand(GIT_COMMANDS.MERGE, {
            execute: () => this.withProgress(() => this.quickOpenService.merge()),
            isEnabled: () => !!this.repositoryTracker.selectedRepository
        });
        registry.registerCommand(GIT_COMMANDS.CHECKOUT, {
            execute: () => this.withProgress(() => this.quickOpenService.checkout()),
            isEnabled: () => !!this.repositoryTracker.selectedRepository
        });
        registry.registerCommand(GIT_COMMANDS.COMMIT_SIGN_OFF, {
            execute: () => this.withProgress(() => this.commit({ signOff: true })),
            isEnabled: () => !!this.repositoryTracker.selectedRepository
        });
        registry.registerCommand(GIT_COMMANDS.COMMIT_AMEND, {
            execute: () => this.withProgress(async () => this.amend()),
            isEnabled: () => !!this.repositoryTracker.selectedRepository
        });
        registry.registerCommand(GIT_COMMANDS.STAGE_ALL, {
            execute: () => {
                const provider = this.repositoryProvider.selectedScmProvider;
                if (provider) {
                    if (this.gitPreferences['git.untrackedChanges'] === 'mixed') {
                        return this.withProgress(() => provider.stageAll());
                    }
                    else {
                        const toStage = provider.unstagedChanges.concat(provider.mergeChanges)
                            .filter(change => change.status !== common_1.GitFileStatus.New)
                            .map(change => change.uri.toString());
                        return this.withProgress(() => provider.stage(toStage));
                    }
                }
            },
            isEnabled: () => {
                const provider = this.repositoryProvider.selectedScmProvider;
                if (!provider) {
                    return false;
                }
                if (this.gitPreferences['git.untrackedChanges'] === 'mixed') {
                    return Boolean(provider.unstagedChanges.length || provider.mergeChanges.length);
                }
                else {
                    const isNotUntracked = (change) => change.status !== common_1.GitFileStatus.New;
                    return Boolean(provider.unstagedChanges.filter(isNotUntracked).length || provider.mergeChanges.filter(isNotUntracked).length);
                }
            }
        });
        registry.registerCommand(GIT_COMMANDS.UNSTAGE_ALL, {
            execute: () => {
                const provider = this.repositoryProvider.selectedScmProvider;
                return provider && this.withProgress(() => provider.unstageAll());
            },
            isEnabled: () => !!this.repositoryProvider.selectedScmProvider
        });
        registry.registerCommand(GIT_COMMANDS.DISCARD_ALL, {
            execute: () => {
                const provider = this.repositoryProvider.selectedScmProvider;
                return provider && this.withProgress(() => provider.discardAll());
            },
            isEnabled: () => !!this.repositoryProvider.selectedScmProvider
        });
        registry.registerCommand(GIT_COMMANDS.OPEN_FILE, {
            execute: widget => this.openFile(widget),
            isEnabled: widget => !!this.getOpenFileOptions(widget),
            isVisible: widget => !!this.getOpenFileOptions(widget)
        });
        registry.registerCommand(GIT_COMMANDS.OPEN_CHANGES, {
            execute: widget => this.openChanges(widget),
            isEnabled: widget => !!this.getOpenChangesOptions(widget),
            isVisible: widget => !!this.getOpenChangesOptions(widget)
        });
        registry.registerCommand(GIT_COMMANDS.SYNC, {
            execute: () => this.withProgress(() => this.syncService.sync()),
            isEnabled: () => this.syncService.canSync(),
            isVisible: () => this.syncService.canSync()
        });
        registry.registerCommand(GIT_COMMANDS.PUBLISH, {
            execute: () => this.withProgress(() => this.syncService.publish()),
            isEnabled: () => this.syncService.canPublish(),
            isVisible: () => this.syncService.canPublish()
        });
        registry.registerCommand(GIT_COMMANDS.CLONE, {
            isEnabled: () => this.workspaceService.opened,
            execute: (url, folder, branch) => this.quickOpenService.clone(url, folder, branch)
        });
        registry.registerCommand(GIT_COMMANDS.COMMIT, {
            execute: () => this.withProgress(() => this.commit()),
            isEnabled: () => !!this.repositoryTracker.selectedRepository
        });
        registry.registerCommand(GIT_COMMANDS.REFRESH, {
            execute: () => this.withProgress(() => this.repositoryProvider.refresh())
        });
        registry.registerCommand(GIT_COMMANDS.COMMIT_ADD_SIGN_OFF, {
            execute: async () => this.withProgress(() => this.addSignOff()),
            isEnabled: () => !!this.repositoryTracker.selectedRepository
        });
        registry.registerCommand(GIT_COMMANDS.UNSTAGE, {
            execute: (...arg) => {
                const resources = arg.filter(r => r.sourceUri).map(r => r.sourceUri.toString());
                const provider = this.repositoryProvider.selectedScmProvider;
                return provider && this.withProgress(() => provider.unstage(resources));
            },
            isEnabled: (...arg) => !!this.repositoryProvider.selectedScmProvider
                && arg.some(r => r.sourceUri)
        });
        registry.registerCommand(GIT_COMMANDS.STAGE, {
            execute: (...arg) => {
                const resources = arg.filter(r => r.sourceUri).map(r => r.sourceUri.toString());
                const provider = this.repositoryProvider.selectedScmProvider;
                return provider && this.withProgress(() => provider.stage(resources));
            },
            isEnabled: (...arg) => !!this.repositoryProvider.selectedScmProvider
                && arg.some(r => r.sourceUri)
        });
        registry.registerCommand(GIT_COMMANDS.DISCARD, {
            execute: (...arg) => {
                const resources = arg.filter(r => r.sourceUri).map(r => r.sourceUri.toString());
                const provider = this.repositoryProvider.selectedScmProvider;
                return provider && this.withProgress(() => provider.discard(resources));
            },
            isEnabled: (...arg) => !!this.repositoryProvider.selectedScmProvider
                && arg.some(r => r.sourceUri)
        });
        registry.registerCommand(GIT_COMMANDS.OPEN_CHANGED_FILE, {
            execute: (...arg) => {
                for (const resource of arg) {
                    this.editorManager.open(resource.sourceUri, { mode: 'reveal' });
                }
            }
        });
        registry.registerCommand(GIT_COMMANDS.STASH, {
            execute: () => this.quickOpenService.stash(),
            isEnabled: () => !!this.repositoryTracker.selectedRepository &&
                !!this.repositoryTracker.selectedRepositoryStatus &&
                this.repositoryTracker.selectedRepositoryStatus.changes.length > 0
        });
        registry.registerCommand(GIT_COMMANDS.APPLY_STASH, {
            execute: () => this.quickOpenService.applyStash(),
            isEnabled: () => !!this.repositoryTracker.selectedRepository
        });
        registry.registerCommand(GIT_COMMANDS.APPLY_LATEST_STASH, {
            execute: () => this.quickOpenService.applyLatestStash(),
            isEnabled: () => !!this.repositoryTracker.selectedRepository
        });
        registry.registerCommand(GIT_COMMANDS.POP_STASH, {
            execute: () => this.quickOpenService.popStash(),
            isEnabled: () => !!this.repositoryTracker.selectedRepository
        });
        registry.registerCommand(GIT_COMMANDS.POP_LATEST_STASH, {
            execute: () => this.quickOpenService.popLatestStash(),
            isEnabled: () => !!this.repositoryTracker.selectedRepository
        });
        registry.registerCommand(GIT_COMMANDS.DROP_STASH, {
            execute: () => this.quickOpenService.dropStash(),
            isEnabled: () => !!this.repositoryTracker.selectedRepository
        });
        registry.registerCommand(GIT_COMMANDS.INIT_REPOSITORY, {
            execute: () => this.quickOpenService.initRepository(),
            isEnabled: widget => this.workspaceService.opened && (!widget || widget instanceof scm_widget_1.ScmWidget) && !this.repositoryProvider.selectedRepository,
            isVisible: widget => this.workspaceService.opened && (!widget || widget instanceof scm_widget_1.ScmWidget) && !this.repositoryProvider.selectedRepository
        });
    }
    async amend() {
        {
            const scmRepository = this.repositoryProvider.selectedScmRepository;
            if (!scmRepository) {
                return;
            }
            try {
                const lastCommit = await scmRepository.provider.amendSupport.getLastCommit();
                if (lastCommit === undefined) {
                    scmRepository.input.issue = {
                        type: scm_input_1.ScmInputIssueType.Error,
                        message: nls_1.nls.localize('theia/git/noPreviousCommit', 'No previous commit to amend')
                    };
                    scmRepository.input.focus();
                    return;
                }
                const message = await this.quickOpenService.commitMessageForAmend();
                await this.commit({ message, amend: true });
            }
            catch (e) {
                if (!(e instanceof Error) || e.message !== 'User abort.') {
                    throw e;
                }
            }
        }
    }
    withProgress(task) {
        return this.progressService.withProgress('', 'scm', task);
    }
    registerToolbarItems(registry) {
        registry.registerItem({
            id: GIT_COMMANDS.OPEN_FILE.id,
            command: GIT_COMMANDS.OPEN_FILE.id,
            tooltip: GIT_COMMANDS.OPEN_FILE.label
        });
        registry.registerItem({
            id: GIT_COMMANDS.OPEN_CHANGES.id,
            command: GIT_COMMANDS.OPEN_CHANGES.id,
            tooltip: GIT_COMMANDS.OPEN_CHANGES.label
        });
        registry.registerItem({
            id: GIT_COMMANDS.INIT_REPOSITORY.id,
            command: GIT_COMMANDS.INIT_REPOSITORY.id,
            tooltip: GIT_COMMANDS.INIT_REPOSITORY.label
        });
        const registerItem = (item) => {
            const commandId = item.command;
            const id = '__git.tabbar.toolbar.' + commandId;
            const command = this.commands.getCommand(commandId);
            this.commands.registerCommand({ id, iconClass: command && command.iconClass }, {
                execute: (widget, ...args) => widget instanceof scm_widget_1.ScmWidget && this.commands.executeCommand(commandId, ...args),
                isEnabled: (widget, ...args) => widget instanceof scm_widget_1.ScmWidget && this.commands.isEnabled(commandId, ...args),
                isVisible: (widget, ...args) => widget instanceof scm_widget_1.ScmWidget &&
                    this.commands.isVisible(commandId, ...args) &&
                    !!this.repositoryProvider.selectedRepository
            });
            item.command = id;
            registry.registerItem(item);
        };
        registerItem({
            id: GIT_COMMANDS.COMMIT.id,
            command: GIT_COMMANDS.COMMIT.id,
            tooltip: GIT_COMMANDS.COMMIT.label
        });
        registerItem({
            id: GIT_COMMANDS.REFRESH.id,
            command: GIT_COMMANDS.REFRESH.id,
            tooltip: GIT_COMMANDS.REFRESH.label
        });
        registerItem({
            id: GIT_COMMANDS.COMMIT_ADD_SIGN_OFF.id,
            command: GIT_COMMANDS.COMMIT_ADD_SIGN_OFF.id,
            tooltip: GIT_COMMANDS.COMMIT_ADD_SIGN_OFF.label
        });
        // Favorites menu group
        [GIT_COMMANDS.PULL_DEFAULT_FAVORITE, GIT_COMMANDS.PUSH_DEFAULT_FAVORITE].forEach((command, index) => registerItem({
            id: command.id + '_fav',
            command: command.id,
            tooltip: command.label,
            group: GIT_MENUS.FAV_GROUP,
            priority: 100 - index
        }));
        registerItem({
            id: GIT_COMMANDS.COMMIT_AMEND.id,
            command: GIT_COMMANDS.COMMIT_AMEND.id,
            tooltip: nls_1.nls.localize('vscode.git/package/command.commitStagedAmend', 'Commit (Amend)'),
            group: this.asSubMenuItemOf(GIT_MENUS.SUBMENU_COMMIT)
        });
        registerItem({
            id: GIT_COMMANDS.COMMIT_SIGN_OFF.id,
            command: GIT_COMMANDS.COMMIT_SIGN_OFF.id,
            tooltip: nls_1.nls.localize('vscode.git/package/command.commitStagedSigned', 'Commit (Signed Off)'),
            group: this.asSubMenuItemOf(GIT_MENUS.SUBMENU_COMMIT)
        });
        [GIT_COMMANDS.PULL_DEFAULT, GIT_COMMANDS.PULL].forEach(command => registerItem({
            id: command.id,
            command: command.id,
            tooltip: command.label,
            group: this.asSubMenuItemOf(GIT_MENUS.SUBMENU_PULL_PUSH)
        }));
        [GIT_COMMANDS.PUSH_DEFAULT, GIT_COMMANDS.PUSH].forEach(command => registerItem({
            id: command.id,
            command: command.id,
            tooltip: command.label,
            group: this.asSubMenuItemOf(GIT_MENUS.SUBMENU_PULL_PUSH, 1)
        }));
        registerItem({
            id: GIT_COMMANDS.FETCH.id,
            command: GIT_COMMANDS.FETCH.id,
            tooltip: GIT_COMMANDS.FETCH.label,
            group: this.asSubMenuItemOf(GIT_MENUS.SUBMENU_PULL_PUSH, 2)
        });
        [
            GIT_COMMANDS.STASH, GIT_COMMANDS.APPLY_STASH,
            GIT_COMMANDS.APPLY_LATEST_STASH, GIT_COMMANDS.POP_STASH,
            GIT_COMMANDS.POP_LATEST_STASH, GIT_COMMANDS.DROP_STASH
        ].forEach((command, index) => registerItem({
            id: command.id,
            command: command.id,
            tooltip: command.label,
            group: this.asSubMenuItemOf(GIT_MENUS.SUBMENU_STASH),
            priority: 100 - index
        }));
        registerItem({
            id: GIT_COMMANDS.STAGE_ALL.id,
            command: GIT_COMMANDS.STAGE_ALL.id,
            tooltip: GIT_COMMANDS.STAGE_ALL.label,
            group: this.asSubMenuItemOf(GIT_MENUS.SUBMENU_CHANGES),
            priority: 30
        });
        registerItem({
            id: GIT_COMMANDS.UNSTAGE_ALL.id,
            command: GIT_COMMANDS.UNSTAGE_ALL.id,
            tooltip: GIT_COMMANDS.UNSTAGE_ALL.label,
            group: this.asSubMenuItemOf(GIT_MENUS.SUBMENU_CHANGES),
            priority: 20
        });
        registerItem({
            id: GIT_COMMANDS.DISCARD_ALL.id,
            command: GIT_COMMANDS.DISCARD_ALL.id,
            tooltip: GIT_COMMANDS.DISCARD_ALL.label,
            group: this.asSubMenuItemOf(GIT_MENUS.SUBMENU_CHANGES),
            priority: 10
        });
        registerItem({
            id: GIT_COMMANDS.MERGE.id,
            command: GIT_COMMANDS.MERGE.id,
            tooltip: GIT_COMMANDS.MERGE.label,
            group: GIT_MENUS.COMMANDS_GROUP
        });
    }
    asSubMenuItemOf(submenu, groupIdx = 0) {
        return submenu.group + '/' + submenu.label + '/' + submenu.menuGroups[groupIdx];
    }
    hasConflicts(changes) {
        return changes.some(c => c.status === common_1.GitFileStatus.Conflicted);
    }
    allStaged(changes) {
        return !changes.some(c => !c.staged);
    }
    async openFile(widget) {
        const options = this.getOpenFileOptions(widget);
        return options && this.editorManager.open(options.uri, options.options);
    }
    getOpenFileOptions(widget) {
        const ref = widget ? widget : this.editorManager.currentEditor;
        if (ref instanceof browser_2.EditorWidget && browser_1.DiffUris.isDiffUri(ref.editor.uri)) {
            const [, right] = browser_1.DiffUris.decode(ref.editor.uri);
            const uri = right.withScheme('file');
            const selection = ref.editor.selection;
            return { uri, options: { selection, widgetOptions: { ref } } };
        }
        return undefined;
    }
    async openChanges(widget) {
        const options = this.getOpenChangesOptions(widget);
        if (options) {
            const provider = this.repositoryProvider.selectedScmProvider;
            return provider && provider.openChange(options.change, options.options);
        }
        return undefined;
    }
    getOpenChangesOptions(widget) {
        const provider = this.repositoryProvider.selectedScmProvider;
        if (!provider) {
            return undefined;
        }
        const ref = widget ? widget : this.editorManager.currentEditor;
        if (ref instanceof browser_2.EditorWidget && !browser_1.DiffUris.isDiffUri(ref.editor.uri)) {
            const uri = ref.editor.uri;
            const change = provider.findChange(uri);
            if (change && provider.getUriToOpen(change).toString() !== uri.toString()) {
                const selection = ref.editor.selection;
                return { change, options: { selection, widgetOptions: { ref } } };
            }
        }
        return undefined;
    }
    updateStatusBar() {
        const scmProvider = this.repositoryProvider.selectedScmProvider;
        if (!scmProvider) {
            return;
        }
        const statusBarCommands = [];
        const checkoutCommand = this.getCheckoutStatusBarCommand();
        if (checkoutCommand) {
            statusBarCommands.push(checkoutCommand);
        }
        const syncCommand = this.getSyncStatusBarCommand();
        if (syncCommand) {
            statusBarCommands.push(syncCommand);
        }
        scmProvider.statusBarCommands = statusBarCommands;
    }
    getCheckoutStatusBarCommand() {
        const scmProvider = this.repositoryProvider.selectedScmProvider;
        if (!scmProvider) {
            return undefined;
        }
        const status = scmProvider.getStatus();
        if (!status) {
            return undefined;
        }
        const branch = status.branch ? status.branch : status.currentHead ? status.currentHead.substring(0, 8) : 'NO-HEAD';
        const changes = (scmProvider.unstagedChanges.length > 0 ? '*' : '')
            + (scmProvider.stagedChanges.length > 0 ? '+' : '')
            + (scmProvider.mergeChanges.length > 0 ? '!' : '');
        return {
            command: GIT_COMMANDS.CHECKOUT.id,
            title: `$(codicon-source-control) ${branch}${changes}`,
            tooltip: `${branch}${changes}`
        };
    }
    getSyncStatusBarCommand() {
        const status = this.repositoryTracker.selectedRepositoryStatus;
        if (!status || !status.branch) {
            return undefined;
        }
        if (this.syncService.isSyncing()) {
            return {
                title: '$(codicon-sync~spin)',
                tooltip: nls_1.nls.localize('vscode.git/statusbar/syncing changes', 'Synchronizing Changes...')
            };
        }
        const { upstreamBranch, aheadBehind } = status;
        if (upstreamBranch) {
            return {
                title: '$(codicon-sync)' + (aheadBehind && (aheadBehind.ahead + aheadBehind.behind) > 0 ? ` ${aheadBehind.behind}↓ ${aheadBehind.ahead}↑` : ''),
                command: GIT_COMMANDS.SYNC.id,
                tooltip: nls_1.nls.localize('vscode.git/repository/sync changes', 'Synchronize Changes')
            };
        }
        return {
            title: '$(codicon-cloud-upload)',
            command: GIT_COMMANDS.PUBLISH.id,
            tooltip: nls_1.nls.localize('vscode.git/statusbar/publish changes', 'Publish Changes')
        };
    }
    async commit(options = {}) {
        const scmRepository = this.repositoryProvider.selectedScmRepository;
        if (!scmRepository) {
            return;
        }
        const message = options.message || scmRepository.input.value;
        if (!message.trim()) {
            scmRepository.input.issue = {
                type: scm_input_1.ScmInputIssueType.Error,
                message: nls_1.nls.localize('vscode.git/repository/commitMessageWhitespacesOnlyWarning', 'Please provide a commit message')
            };
            scmRepository.input.focus();
            return;
        }
        if (!scmRepository.provider.stagedChanges.length) {
            scmRepository.input.issue = {
                type: scm_input_1.ScmInputIssueType.Error,
                message: nls_1.nls.localize('vscode.git/commands/no changes', 'No changes added to commit')
            };
            scmRepository.input.focus();
            return;
        }
        scmRepository.input.issue = undefined;
        try {
            // We can make sure, repository exists, otherwise we would not have this button.
            const amend = options.amend;
            const signOff = options.signOff || this.gitPreferences['git.alwaysSignOff'];
            const repository = scmRepository.provider.repository;
            await this.git.commit(repository, message, { signOff, amend });
            scmRepository.input.value = '';
        }
        catch (error) {
            this.gitErrorHandler.handleError(error);
        }
    }
    async addSignOff() {
        const scmRepository = this.repositoryProvider.selectedScmRepository;
        if (!scmRepository) {
            return;
        }
        try {
            const repository = scmRepository.provider.repository;
            const [username, email] = (await Promise.all([
                this.git.exec(repository, ['config', 'user.name']),
                this.git.exec(repository, ['config', 'user.email'])
            ])).map(result => result.stdout.trim());
            const signOff = `\n\nSigned-off-by: ${username} <${email}>`;
            const value = scmRepository.input.value;
            if (value.endsWith(signOff)) {
                scmRepository.input.value = value.substring(0, value.length - signOff.length);
            }
            else {
                scmRepository.input.value = `${value}${signOff}`;
            }
            scmRepository.input.focus();
        }
        catch (e) {
            scmRepository.input.issue = {
                type: scm_input_1.ScmInputIssueType.Warning,
                message: nls_1.nls.localize('theia/git/missingUserInfo', 'Make sure you configure your \'user.name\' and \'user.email\' in git.')
            };
        }
    }
    /**
     * It should be aligned with https://code.visualstudio.com/api/references/theme-color#git-colors
     */
    registerColors(colors) {
        colors.register({
            id: 'gitDecoration.addedResourceForeground',
            description: 'Color for added resources.',
            defaults: {
                light: '#587c0c',
                dark: '#81b88b',
                hcDark: '#a1e3ad',
                hcLight: '#374e06'
            }
        }, {
            id: 'gitDecoration.modifiedResourceForeground',
            description: 'Color for modified resources.',
            defaults: {
                light: '#895503',
                dark: '#E2C08D',
                hcDark: '#E2C08D',
                hcLight: '#895503'
            }
        }, {
            id: 'gitDecoration.deletedResourceForeground',
            description: 'Color for deleted resources.',
            defaults: {
                light: '#ad0707',
                dark: '#c74e39',
                hcDark: '#c74e39',
                hcLight: '#ad0707'
            }
        }, {
            id: 'gitDecoration.untrackedResourceForeground',
            description: 'Color for untracked resources.',
            defaults: {
                light: '#007100',
                dark: '#73C991',
                hcDark: '#73C991',
                hcLight: '#007100'
            }
        }, {
            id: 'gitDecoration.conflictingResourceForeground',
            description: 'Color for resources with conflicts.',
            defaults: {
                light: '#6c6cc4',
                dark: '#6c6cc4',
                hcDark: '#c74e39',
                hcLight: '#ad0707'
            }
        }, {
            id: 'gitlens.gutterBackgroundColor',
            description: 'Specifies the background color of the gutter blame annotations',
            defaults: {
                dark: '#FFFFFF13',
                light: '#0000000C',
                hcDark: '#FFFFFF13'
            }
        }, {
            id: 'gitlens.gutterForegroundColor',
            description: 'Specifies the foreground color of the gutter blame annotations',
            defaults: {
                dark: '#BEBEBE',
                light: '#747474',
                hcDark: '#BEBEBE'
            }
        }, {
            id: 'gitlens.lineHighlightBackgroundColor',
            description: 'Specifies the background color of the associated line highlights in blame annotations',
            defaults: {
                dark: '#00BCF233',
                light: '#00BCF233',
                hcDark: '#00BCF233'
            }
        });
    }
};
GitContribution.GIT_CHECKOUT = 'git.checkout';
GitContribution.GIT_SYNC_STATUS = 'git-sync-status';
__decorate([
    (0, inversify_1.inject)(browser_2.EditorManager),
    __metadata("design:type", browser_2.EditorManager)
], GitContribution.prototype, "editorManager", void 0);
__decorate([
    (0, inversify_1.inject)(git_quick_open_service_1.GitQuickOpenService),
    __metadata("design:type", git_quick_open_service_1.GitQuickOpenService)
], GitContribution.prototype, "quickOpenService", void 0);
__decorate([
    (0, inversify_1.inject)(git_repository_tracker_1.GitRepositoryTracker),
    __metadata("design:type", git_repository_tracker_1.GitRepositoryTracker)
], GitContribution.prototype, "repositoryTracker", void 0);
__decorate([
    (0, inversify_1.inject)(git_sync_service_1.GitSyncService),
    __metadata("design:type", git_sync_service_1.GitSyncService)
], GitContribution.prototype, "syncService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_3.WorkspaceService),
    __metadata("design:type", browser_3.WorkspaceService)
], GitContribution.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(git_repository_provider_1.GitRepositoryProvider),
    __metadata("design:type", git_repository_provider_1.GitRepositoryProvider)
], GitContribution.prototype, "repositoryProvider", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.Git),
    __metadata("design:type", Object)
], GitContribution.prototype, "git", void 0);
__decorate([
    (0, inversify_1.inject)(git_error_handler_1.GitErrorHandler),
    __metadata("design:type", git_error_handler_1.GitErrorHandler)
], GitContribution.prototype, "gitErrorHandler", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.CommandRegistry),
    __metadata("design:type", core_1.CommandRegistry)
], GitContribution.prototype, "commands", void 0);
__decorate([
    (0, inversify_1.inject)(progress_service_1.ProgressService),
    __metadata("design:type", progress_service_1.ProgressService)
], GitContribution.prototype, "progressService", void 0);
__decorate([
    (0, inversify_1.inject)(git_preferences_1.GitPreferences),
    __metadata("design:type", Object)
], GitContribution.prototype, "gitPreferences", void 0);
__decorate([
    (0, inversify_1.inject)(decorations_service_1.DecorationsService),
    __metadata("design:type", Object)
], GitContribution.prototype, "decorationsService", void 0);
__decorate([
    (0, inversify_1.inject)(git_decoration_provider_1.GitDecorationProvider),
    __metadata("design:type", git_decoration_provider_1.GitDecorationProvider)
], GitContribution.prototype, "gitDecorationProvider", void 0);
GitContribution = __decorate([
    (0, inversify_1.injectable)()
], GitContribution);
exports.GitContribution = GitContribution;
//# sourceMappingURL=git-contribution.js.map