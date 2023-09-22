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
exports.GitDiffContribution = exports.ScmNavigatorMoreToolbarGroups = exports.GitDiffCommands = void 0;
const common_1 = require("@theia/core/lib/common");
const browser_1 = require("@theia/core/lib/browser");
const widget_manager_1 = require("@theia/core/lib/browser/widget-manager");
const browser_2 = require("@theia/editor/lib/browser");
const inversify_1 = require("@theia/core/shared/inversify");
const git_diff_widget_1 = require("./git-diff-widget");
const git_commit_detail_widget_1 = require("../history/git-commit-detail-widget");
const scm_service_1 = require("@theia/scm/lib/browser/scm-service");
const navigator_contribution_1 = require("@theia/navigator/lib/browser/navigator-contribution");
const git_quick_open_service_1 = require("../git-quick-open-service");
const diff_uris_1 = require("@theia/core/lib/browser/diff-uris");
const git_resource_1 = require("../git-resource");
const workspace_commands_1 = require("@theia/workspace/lib/browser/workspace-commands");
const browser_3 = require("@theia/workspace/lib/browser");
const event_1 = require("@theia/core/lib/common/event");
const file_service_1 = require("@theia/filesystem/lib/browser/file-service");
const nls_1 = require("@theia/core/lib/common/nls");
var GitDiffCommands;
(function (GitDiffCommands) {
    GitDiffCommands.OPEN_FILE_DIFF = common_1.Command.toLocalizedCommand({
        id: 'git-diff:open-file-diff',
        category: 'Git Diff',
        label: 'Compare With...'
    }, 'theia/git/compareWith');
    GitDiffCommands.TREE_VIEW_MODE = {
        id: 'git.viewmode.tree',
        tooltip: nls_1.nls.localizeByDefault('View as Tree'),
        iconClass: (0, browser_1.codicon)('list-tree'),
        originalLabel: 'View as Tree',
        label: nls_1.nls.localizeByDefault('View as Tree')
    };
    GitDiffCommands.LIST_VIEW_MODE = {
        id: 'git.viewmode.list',
        tooltip: nls_1.nls.localizeByDefault('View as List'),
        iconClass: (0, browser_1.codicon)('list-flat'),
        originalLabel: 'View as List',
        label: nls_1.nls.localizeByDefault('View as List')
    };
    GitDiffCommands.PREVIOUS_CHANGE = {
        id: 'git.navigate-changes.previous',
        tooltip: nls_1.nls.localizeByDefault('Previous Change'),
        iconClass: (0, browser_1.codicon)('arrow-left'),
        originalLabel: 'Previous Change',
        label: nls_1.nls.localizeByDefault('Previous Change')
    };
    GitDiffCommands.NEXT_CHANGE = {
        id: 'git.navigate-changes.next',
        tooltip: nls_1.nls.localizeByDefault('Next Change'),
        iconClass: (0, browser_1.codicon)('arrow-right'),
        originalLabel: 'Next Change',
        label: nls_1.nls.localizeByDefault('Next Change')
    };
})(GitDiffCommands = exports.GitDiffCommands || (exports.GitDiffCommands = {}));
var ScmNavigatorMoreToolbarGroups;
(function (ScmNavigatorMoreToolbarGroups) {
    ScmNavigatorMoreToolbarGroups.SCM = '3_navigator_scm';
})(ScmNavigatorMoreToolbarGroups = exports.ScmNavigatorMoreToolbarGroups || (exports.ScmNavigatorMoreToolbarGroups = {}));
let GitDiffContribution = class GitDiffContribution extends browser_1.AbstractViewContribution {
    constructor(selectionService, widgetManager, app, quickOpenService, fileService, openerService, notifications, scmService) {
        super({
            widgetId: git_diff_widget_1.GIT_DIFF,
            widgetName: 'Git diff',
            defaultWidgetOptions: {
                area: 'left',
                rank: 500
            }
        });
        this.selectionService = selectionService;
        this.widgetManager = widgetManager;
        this.app = app;
        this.quickOpenService = quickOpenService;
        this.fileService = fileService;
        this.openerService = openerService;
        this.notifications = notifications;
        this.scmService = scmService;
    }
    registerMenus(menus) {
        menus.registerMenuAction(navigator_contribution_1.NavigatorContextMenu.COMPARE, {
            commandId: GitDiffCommands.OPEN_FILE_DIFF.id
        });
    }
    registerCommands(commands) {
        commands.registerCommand(GitDiffCommands.OPEN_FILE_DIFF, this.newWorkspaceRootUriAwareCommandHandler({
            isVisible: uri => !!this.findGitRepository(uri),
            isEnabled: uri => !!this.findGitRepository(uri),
            execute: async (fileUri) => {
                const repository = this.findGitRepository(fileUri);
                if (repository) {
                    await this.quickOpenService.chooseTagsAndBranches(async (fromRevision, toRevision) => {
                        const uri = fileUri.toString();
                        const fileStat = await this.fileService.resolve(fileUri);
                        const diffOptions = {
                            uri,
                            range: {
                                fromRevision
                            }
                        };
                        if (fileStat.isDirectory) {
                            this.showWidget({ rootUri: repository.localUri, diffOptions });
                        }
                        else {
                            const fromURI = fileUri.withScheme(git_resource_1.GIT_RESOURCE_SCHEME).withQuery(fromRevision);
                            const toURI = fileUri;
                            const diffUri = diff_uris_1.DiffUris.encode(fromURI, toURI);
                            if (diffUri) {
                                (0, browser_1.open)(this.openerService, diffUri).catch(e => {
                                    this.notifications.error(e.message);
                                });
                            }
                        }
                    }, repository);
                }
            }
        }));
        commands.registerCommand(GitDiffCommands.PREVIOUS_CHANGE, {
            execute: widget => {
                if (widget instanceof git_diff_widget_1.GitDiffWidget) {
                    widget.goToPreviousChange();
                }
            },
            isVisible: widget => widget instanceof git_diff_widget_1.GitDiffWidget,
        });
        commands.registerCommand(GitDiffCommands.NEXT_CHANGE, {
            execute: widget => {
                if (widget instanceof git_diff_widget_1.GitDiffWidget) {
                    widget.goToNextChange();
                }
            },
            isVisible: widget => widget instanceof git_diff_widget_1.GitDiffWidget,
        });
    }
    registerToolbarItems(registry) {
        this.fileNavigatorContribution.registerMoreToolbarItem({
            id: GitDiffCommands.OPEN_FILE_DIFF.id,
            command: GitDiffCommands.OPEN_FILE_DIFF.id,
            tooltip: GitDiffCommands.OPEN_FILE_DIFF.label,
            group: ScmNavigatorMoreToolbarGroups.SCM,
        });
        const viewModeEmitter = new event_1.Emitter();
        const extractDiffWidget = (widget) => {
            if (widget instanceof git_diff_widget_1.GitDiffWidget) {
                return widget;
            }
        };
        const extractCommitDetailWidget = (widget) => {
            const ref = widget ? widget : this.editorManager.currentEditor;
            if (ref instanceof git_commit_detail_widget_1.GitCommitDetailWidget) {
                return ref;
            }
            return undefined;
        };
        const registerToggleViewItem = (command, mode) => {
            const id = command.id;
            const item = {
                id,
                command: id,
                tooltip: command.label,
                onDidChange: viewModeEmitter.event
            };
            this.commandRegistry.registerCommand({ id, iconClass: command && command.iconClass }, {
                execute: widget => {
                    const widgetWithChanges = extractDiffWidget(widget) || extractCommitDetailWidget(widget);
                    if (widgetWithChanges) {
                        widgetWithChanges.viewMode = mode;
                        viewModeEmitter.fire();
                    }
                },
                isVisible: widget => {
                    const widgetWithChanges = extractDiffWidget(widget) || extractCommitDetailWidget(widget);
                    if (widgetWithChanges) {
                        return widgetWithChanges.viewMode !== mode;
                    }
                    return false;
                },
            });
            registry.registerItem(item);
        };
        registerToggleViewItem(GitDiffCommands.TREE_VIEW_MODE, 'tree');
        registerToggleViewItem(GitDiffCommands.LIST_VIEW_MODE, 'list');
        registry.registerItem({
            id: GitDiffCommands.PREVIOUS_CHANGE.id,
            command: GitDiffCommands.PREVIOUS_CHANGE.id,
            tooltip: GitDiffCommands.PREVIOUS_CHANGE.label,
        });
        registry.registerItem({
            id: GitDiffCommands.NEXT_CHANGE.id,
            command: GitDiffCommands.NEXT_CHANGE.id,
            tooltip: GitDiffCommands.NEXT_CHANGE.label,
        });
    }
    findGitRepository(uri) {
        const repo = this.scmService.findRepository(uri);
        if (repo && repo.provider.id === 'git') {
            return { localUri: repo.provider.rootUri };
        }
        return undefined;
    }
    async showWidget(options) {
        const widget = await this.widget;
        await widget.setContent(options);
        return this.openView({
            activate: true
        });
    }
    newWorkspaceRootUriAwareCommandHandler(handler) {
        return new workspace_commands_1.WorkspaceRootUriAwareCommandHandler(this.workspaceService, this.selectionService, handler);
    }
};
__decorate([
    (0, inversify_1.inject)(browser_2.EditorManager),
    __metadata("design:type", browser_2.EditorManager)
], GitDiffContribution.prototype, "editorManager", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.CommandRegistry),
    __metadata("design:type", common_1.CommandRegistry)
], GitDiffContribution.prototype, "commandRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(navigator_contribution_1.FileNavigatorContribution),
    __metadata("design:type", navigator_contribution_1.FileNavigatorContribution)
], GitDiffContribution.prototype, "fileNavigatorContribution", void 0);
__decorate([
    (0, inversify_1.inject)(browser_3.WorkspaceService),
    __metadata("design:type", browser_3.WorkspaceService)
], GitDiffContribution.prototype, "workspaceService", void 0);
GitDiffContribution = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(common_1.SelectionService)),
    __param(1, (0, inversify_1.inject)(widget_manager_1.WidgetManager)),
    __param(2, (0, inversify_1.inject)(browser_1.FrontendApplication)),
    __param(3, (0, inversify_1.inject)(git_quick_open_service_1.GitQuickOpenService)),
    __param(4, (0, inversify_1.inject)(file_service_1.FileService)),
    __param(5, (0, inversify_1.inject)(browser_1.OpenerService)),
    __param(6, (0, inversify_1.inject)(common_1.MessageService)),
    __param(7, (0, inversify_1.inject)(scm_service_1.ScmService)),
    __metadata("design:paramtypes", [common_1.SelectionService,
        widget_manager_1.WidgetManager,
        browser_1.FrontendApplication,
        git_quick_open_service_1.GitQuickOpenService,
        file_service_1.FileService, Object, common_1.MessageService,
        scm_service_1.ScmService])
], GitDiffContribution);
exports.GitDiffContribution = GitDiffContribution;
//# sourceMappingURL=git-diff-contribution.js.map