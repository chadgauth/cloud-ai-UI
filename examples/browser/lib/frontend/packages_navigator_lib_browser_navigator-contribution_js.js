"use strict";
(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_navigator_lib_browser_navigator-contribution_js"],{

/***/ "../../packages/navigator/lib/browser/file-navigator-commands.js":
/*!***********************************************************************!*\
  !*** ../../packages/navigator/lib/browser/file-navigator-commands.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2022 Ericsson and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FileNavigatorCommands = void 0;
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const browser_2 = __webpack_require__(/*! @theia/workspace/lib/browser */ "../../packages/workspace/lib/browser/index.js");
var FileNavigatorCommands;
(function (FileNavigatorCommands) {
    FileNavigatorCommands.REVEAL_IN_NAVIGATOR = common_1.Command.toLocalizedCommand({
        id: 'navigator.reveal',
        label: 'Reveal in Explorer'
    }, 'theia/navigator/reveal');
    FileNavigatorCommands.TOGGLE_HIDDEN_FILES = common_1.Command.toLocalizedCommand({
        id: 'navigator.toggle.hidden.files',
        label: 'Toggle Hidden Files'
    }, 'theia/navigator/toggleHiddenFiles');
    FileNavigatorCommands.TOGGLE_AUTO_REVEAL = common_1.Command.toLocalizedCommand({
        id: 'navigator.toggle.autoReveal',
        category: browser_1.CommonCommands.FILE_CATEGORY,
        label: 'Auto Reveal'
    }, 'theia/navigator/autoReveal', browser_1.CommonCommands.FILE_CATEGORY_KEY);
    FileNavigatorCommands.REFRESH_NAVIGATOR = common_1.Command.toLocalizedCommand({
        id: 'navigator.refresh',
        category: browser_1.CommonCommands.FILE_CATEGORY,
        label: 'Refresh in Explorer',
        iconClass: (0, browser_1.codicon)('refresh')
    }, 'theia/navigator/refresh', browser_1.CommonCommands.FILE_CATEGORY_KEY);
    FileNavigatorCommands.COLLAPSE_ALL = common_1.Command.toDefaultLocalizedCommand({
        id: 'navigator.collapse.all',
        category: browser_1.CommonCommands.FILE_CATEGORY,
        label: 'Collapse Folders in Explorer',
        iconClass: (0, browser_1.codicon)('collapse-all')
    });
    FileNavigatorCommands.ADD_ROOT_FOLDER = {
        id: 'navigator.addRootFolder'
    };
    FileNavigatorCommands.FOCUS = common_1.Command.toDefaultLocalizedCommand({
        id: 'workbench.files.action.focusFilesExplorer',
        category: browser_1.CommonCommands.FILE_CATEGORY,
        label: 'Focus on Files Explorer'
    });
    FileNavigatorCommands.OPEN = common_1.Command.toDefaultLocalizedCommand({
        id: 'navigator.open',
        category: browser_1.CommonCommands.FILE_CATEGORY,
        label: 'Open'
    });
    FileNavigatorCommands.NEW_FILE_TOOLBAR = {
        id: `${browser_2.WorkspaceCommands.NEW_FILE.id}.toolbar`,
        iconClass: (0, browser_1.codicon)('new-file')
    };
    FileNavigatorCommands.NEW_FOLDER_TOOLBAR = {
        id: `${browser_2.WorkspaceCommands.NEW_FOLDER.id}.toolbar`,
        iconClass: (0, browser_1.codicon)('new-folder')
    };
    /**
     * @deprecated since 1.21.0. Use WorkspaceCommands.COPY_RELATIVE_FILE_COMMAND instead.
     */
    FileNavigatorCommands.COPY_RELATIVE_FILE_PATH = browser_2.WorkspaceCommands.COPY_RELATIVE_FILE_PATH;
})(FileNavigatorCommands = exports.FileNavigatorCommands || (exports.FileNavigatorCommands = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/navigator/lib/browser/file-navigator-commands'] = this;


/***/ }),

/***/ "../../packages/navigator/lib/browser/navigator-contribution.js":
/*!**********************************************************************!*\
  !*** ../../packages/navigator/lib/browser/navigator-contribution.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2017-2018 TypeFox and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FileNavigatorContribution = exports.FILE_NAVIGATOR_TOGGLE_COMMAND_ID = exports.NavigatorContextMenu = exports.SHELL_TABBAR_CONTEXT_REVEAL = exports.NAVIGATOR_CONTEXT_MENU = exports.NavigatorMoreToolbarGroups = exports.FileNavigatorCommands = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const view_contribution_1 = __webpack_require__(/*! @theia/core/lib/browser/shell/view-contribution */ "../../packages/core/lib/browser/shell/view-contribution.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const file_download_command_contribution_1 = __webpack_require__(/*! @theia/filesystem/lib/browser/download/file-download-command-contribution */ "../../packages/filesystem/lib/browser/download/file-download-command-contribution.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const browser_2 = __webpack_require__(/*! @theia/workspace/lib/browser */ "../../packages/workspace/lib/browser/index.js");
const navigator_widget_factory_1 = __webpack_require__(/*! ./navigator-widget-factory */ "../../packages/navigator/lib/browser/navigator-widget-factory.js");
const navigator_widget_1 = __webpack_require__(/*! ./navigator-widget */ "../../packages/navigator/lib/browser/navigator-widget.js");
const navigator_preferences_1 = __webpack_require__(/*! ./navigator-preferences */ "../../packages/navigator/lib/browser/navigator-preferences.js");
const navigator_filter_1 = __webpack_require__(/*! ./navigator-filter */ "../../packages/navigator/lib/browser/navigator-filter.js");
const navigator_tree_1 = __webpack_require__(/*! ./navigator-tree */ "../../packages/navigator/lib/browser/navigator-tree.js");
const navigator_context_key_service_1 = __webpack_require__(/*! ./navigator-context-key-service */ "../../packages/navigator/lib/browser/navigator-context-key-service.js");
const tab_bar_toolbar_1 = __webpack_require__(/*! @theia/core/lib/browser/shell/tab-bar-toolbar */ "../../packages/core/lib/browser/shell/tab-bar-toolbar/index.js");
const filesystem_frontend_contribution_1 = __webpack_require__(/*! @theia/filesystem/lib/browser/filesystem-frontend-contribution */ "../../packages/filesystem/lib/browser/filesystem-frontend-contribution.js");
const navigator_diff_1 = __webpack_require__(/*! ./navigator-diff */ "../../packages/navigator/lib/browser/navigator-diff.js");
const browser_3 = __webpack_require__(/*! @theia/filesystem/lib/browser */ "../../packages/filesystem/lib/browser/index.js");
const clipboard_service_1 = __webpack_require__(/*! @theia/core/lib/browser/clipboard-service */ "../../packages/core/lib/browser/clipboard-service.js");
const selection_service_1 = __webpack_require__(/*! @theia/core/lib/common/selection-service */ "../../packages/core/lib/common/selection-service.js");
const navigator_open_editors_widget_1 = __webpack_require__(/*! ./open-editors-widget/navigator-open-editors-widget */ "../../packages/navigator/lib/browser/open-editors-widget/navigator-open-editors-widget.js");
const navigator_open_editors_menus_1 = __webpack_require__(/*! ./open-editors-widget/navigator-open-editors-menus */ "../../packages/navigator/lib/browser/open-editors-widget/navigator-open-editors-menus.js");
const navigator_open_editors_commands_1 = __webpack_require__(/*! ./open-editors-widget/navigator-open-editors-commands */ "../../packages/navigator/lib/browser/open-editors-widget/navigator-open-editors-commands.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
const uri_command_handler_1 = __webpack_require__(/*! @theia/core/lib/common/uri-command-handler */ "../../packages/core/lib/common/uri-command-handler.js");
const file_navigator_commands_1 = __webpack_require__(/*! ./file-navigator-commands */ "../../packages/navigator/lib/browser/file-navigator-commands.js");
Object.defineProperty(exports, "FileNavigatorCommands", ({ enumerable: true, get: function () { return file_navigator_commands_1.FileNavigatorCommands; } }));
/**
 * Navigator `More Actions...` toolbar item groups.
 * Used in order to group items present in the toolbar.
 */
var NavigatorMoreToolbarGroups;
(function (NavigatorMoreToolbarGroups) {
    NavigatorMoreToolbarGroups.NEW_OPEN = '1_navigator_new_open';
    NavigatorMoreToolbarGroups.TOOLS = '2_navigator_tools';
    NavigatorMoreToolbarGroups.WORKSPACE = '3_navigator_workspace';
})(NavigatorMoreToolbarGroups = exports.NavigatorMoreToolbarGroups || (exports.NavigatorMoreToolbarGroups = {}));
exports.NAVIGATOR_CONTEXT_MENU = ['navigator-context-menu'];
exports.SHELL_TABBAR_CONTEXT_REVEAL = [...browser_1.SHELL_TABBAR_CONTEXT_MENU, '2_reveal'];
/**
 * Navigator context menu default groups should be aligned
 * with VS Code default groups: https://code.visualstudio.com/api/references/contribution-points#contributes.menus
 */
var NavigatorContextMenu;
(function (NavigatorContextMenu) {
    NavigatorContextMenu.NAVIGATION = [...exports.NAVIGATOR_CONTEXT_MENU, 'navigation'];
    /** @deprecated use NAVIGATION */
    NavigatorContextMenu.OPEN = NavigatorContextMenu.NAVIGATION;
    /** @deprecated use NAVIGATION */
    NavigatorContextMenu.NEW = NavigatorContextMenu.NAVIGATION;
    NavigatorContextMenu.WORKSPACE = [...exports.NAVIGATOR_CONTEXT_MENU, '2_workspace'];
    NavigatorContextMenu.COMPARE = [...exports.NAVIGATOR_CONTEXT_MENU, '3_compare'];
    /** @deprecated use COMPARE */
    NavigatorContextMenu.DIFF = NavigatorContextMenu.COMPARE;
    NavigatorContextMenu.SEARCH = [...exports.NAVIGATOR_CONTEXT_MENU, '4_search'];
    NavigatorContextMenu.CLIPBOARD = [...exports.NAVIGATOR_CONTEXT_MENU, '5_cutcopypaste'];
    NavigatorContextMenu.MODIFICATION = [...exports.NAVIGATOR_CONTEXT_MENU, '7_modification'];
    /** @deprecated use MODIFICATION */
    NavigatorContextMenu.MOVE = NavigatorContextMenu.MODIFICATION;
    /** @deprecated use MODIFICATION */
    NavigatorContextMenu.ACTIONS = NavigatorContextMenu.MODIFICATION;
    NavigatorContextMenu.OPEN_WITH = [...NavigatorContextMenu.NAVIGATION, 'open_with'];
})(NavigatorContextMenu = exports.NavigatorContextMenu || (exports.NavigatorContextMenu = {}));
exports.FILE_NAVIGATOR_TOGGLE_COMMAND_ID = 'fileNavigator:toggle';
let FileNavigatorContribution = class FileNavigatorContribution extends view_contribution_1.AbstractViewContribution {
    constructor(fileNavigatorPreferences, openerService, fileNavigatorFilter, workspaceService, workspacePreferences) {
        super({
            viewContainerId: navigator_widget_factory_1.EXPLORER_VIEW_CONTAINER_ID,
            widgetId: navigator_widget_1.FILE_NAVIGATOR_ID,
            widgetName: navigator_widget_factory_1.EXPLORER_VIEW_CONTAINER_TITLE_OPTIONS.label,
            defaultWidgetOptions: {
                area: 'left',
                rank: 100
            },
            toggleCommandId: exports.FILE_NAVIGATOR_TOGGLE_COMMAND_ID,
            toggleKeybinding: 'ctrlcmd+shift+e'
        });
        this.fileNavigatorPreferences = fileNavigatorPreferences;
        this.openerService = openerService;
        this.fileNavigatorFilter = fileNavigatorFilter;
        this.workspaceService = workspaceService;
        this.workspacePreferences = workspacePreferences;
        /**
         * Register commands to the `More Actions...` navigator toolbar item.
         */
        this.registerMoreToolbarItem = (item) => {
            const commandId = item.command;
            const id = 'navigator.tabbar.toolbar.' + commandId;
            const command = this.commandRegistry.getCommand(commandId);
            this.commandRegistry.registerCommand({ id, iconClass: command && command.iconClass }, {
                execute: (w, ...args) => w instanceof navigator_widget_1.FileNavigatorWidget
                    && this.commandRegistry.executeCommand(commandId, ...args),
                isEnabled: (w, ...args) => w instanceof navigator_widget_1.FileNavigatorWidget
                    && this.commandRegistry.isEnabled(commandId, ...args),
                isVisible: (w, ...args) => w instanceof navigator_widget_1.FileNavigatorWidget
                    && this.commandRegistry.isVisible(commandId, ...args),
                isToggled: (w, ...args) => w instanceof navigator_widget_1.FileNavigatorWidget
                    && this.commandRegistry.isToggled(commandId, ...args),
            });
            item.command = id;
            this.tabbarToolbarRegistry.registerItem(item);
        };
    }
    init() {
        this.doInit();
    }
    async doInit() {
        await this.fileNavigatorPreferences.ready;
        this.shell.onDidChangeCurrentWidget(() => this.onCurrentWidgetChangedHandler());
        const updateFocusContextKeys = () => {
            const hasFocus = this.shell.activeWidget instanceof navigator_widget_1.FileNavigatorWidget;
            this.contextKeyService.explorerViewletFocus.set(hasFocus);
            this.contextKeyService.filesExplorerFocus.set(hasFocus);
        };
        updateFocusContextKeys();
        this.shell.onDidChangeActiveWidget(updateFocusContextKeys);
        this.workspaceCommandContribution.onDidCreateNewFile(async (event) => this.onDidCreateNewResource(event));
        this.workspaceCommandContribution.onDidCreateNewFolder(async (event) => this.onDidCreateNewResource(event));
    }
    async onDidCreateNewResource(event) {
        const navigator = this.tryGetWidget();
        if (!navigator || !navigator.isVisible) {
            return;
        }
        const model = navigator.model;
        const parent = await model.revealFile(event.parent);
        if (browser_3.DirNode.is(parent)) {
            await model.refresh(parent);
        }
        const node = await model.revealFile(event.uri);
        if (browser_1.SelectableTreeNode.is(node)) {
            model.selectNode(node);
            if (browser_3.DirNode.is(node)) {
                this.openView({ activate: true });
            }
        }
    }
    async initializeLayout(app) {
        await this.openView();
    }
    registerCommands(registry) {
        super.registerCommands(registry);
        registry.registerCommand(file_navigator_commands_1.FileNavigatorCommands.FOCUS, {
            execute: () => this.openView({ activate: true })
        });
        registry.registerCommand(file_navigator_commands_1.FileNavigatorCommands.REVEAL_IN_NAVIGATOR, uri_command_handler_1.UriAwareCommandHandler.MonoSelect(this.selectionService, {
            execute: async (uri) => {
                if (await this.selectFileNode(uri)) {
                    this.openView({ activate: false, reveal: true });
                }
            },
            isEnabled: uri => !!this.workspaceService.getWorkspaceRootUri(uri),
            isVisible: uri => !!this.workspaceService.getWorkspaceRootUri(uri),
        }));
        registry.registerCommand(file_navigator_commands_1.FileNavigatorCommands.TOGGLE_HIDDEN_FILES, {
            execute: () => {
                this.fileNavigatorFilter.toggleHiddenFiles();
            },
            isEnabled: () => true,
            isVisible: () => true
        });
        registry.registerCommand(file_navigator_commands_1.FileNavigatorCommands.TOGGLE_AUTO_REVEAL, {
            isEnabled: widget => this.withWidget(widget, () => this.workspaceService.opened),
            isVisible: widget => this.withWidget(widget, () => this.workspaceService.opened),
            execute: () => {
                const autoReveal = !this.fileNavigatorPreferences['explorer.autoReveal'];
                this.preferenceService.set('explorer.autoReveal', autoReveal, browser_1.PreferenceScope.User);
                if (autoReveal) {
                    this.selectWidgetFileNode(this.shell.currentWidget);
                }
            },
            isToggled: () => this.fileNavigatorPreferences['explorer.autoReveal']
        });
        registry.registerCommand(file_navigator_commands_1.FileNavigatorCommands.COLLAPSE_ALL, {
            execute: widget => this.withWidget(widget, () => this.collapseFileNavigatorTree()),
            isEnabled: widget => this.withWidget(widget, () => this.workspaceService.opened),
            isVisible: widget => this.withWidget(widget, () => this.workspaceService.opened)
        });
        registry.registerCommand(file_navigator_commands_1.FileNavigatorCommands.REFRESH_NAVIGATOR, {
            execute: widget => this.withWidget(widget, () => this.refreshWorkspace()),
            isEnabled: widget => this.withWidget(widget, () => this.workspaceService.opened),
            isVisible: widget => this.withWidget(widget, () => this.workspaceService.opened)
        });
        registry.registerCommand(file_navigator_commands_1.FileNavigatorCommands.ADD_ROOT_FOLDER, {
            execute: (...args) => registry.executeCommand(browser_2.WorkspaceCommands.ADD_FOLDER.id, ...args),
            isEnabled: (...args) => registry.isEnabled(browser_2.WorkspaceCommands.ADD_FOLDER.id, ...args),
            isVisible: (...args) => {
                if (!registry.isVisible(browser_2.WorkspaceCommands.ADD_FOLDER.id, ...args)) {
                    return false;
                }
                const navigator = this.tryGetWidget();
                const selection = navigator === null || navigator === void 0 ? void 0 : navigator.model.getFocusedNode();
                // The node that is selected when the user clicks in empty space.
                const root = navigator === null || navigator === void 0 ? void 0 : navigator.getContainerTreeNode();
                return selection === root;
            }
        });
        registry.registerCommand(navigator_diff_1.NavigatorDiffCommands.COMPARE_FIRST, {
            execute: () => {
                this.navigatorDiff.addFirstComparisonFile();
            },
            isEnabled: () => true,
            isVisible: () => true
        });
        registry.registerCommand(navigator_diff_1.NavigatorDiffCommands.COMPARE_SECOND, {
            execute: () => {
                this.navigatorDiff.compareFiles();
            },
            isEnabled: () => this.navigatorDiff.isFirstFileSelected,
            isVisible: () => this.navigatorDiff.isFirstFileSelected
        });
        registry.registerCommand(file_navigator_commands_1.FileNavigatorCommands.OPEN, {
            isEnabled: () => this.getSelectedFileNodes().length > 0,
            isVisible: () => this.getSelectedFileNodes().length > 0,
            execute: () => {
                this.getSelectedFileNodes().forEach(async (node) => {
                    const opener = await this.openerService.getOpener(node.uri);
                    opener.open(node.uri);
                });
            }
        });
        registry.registerCommand(navigator_open_editors_commands_1.OpenEditorsCommands.CLOSE_ALL_TABS_FROM_TOOLBAR, {
            execute: widget => this.withOpenEditorsWidget(widget, () => this.shell.closeMany(this.editorWidgets)),
            isEnabled: widget => this.withOpenEditorsWidget(widget, () => true),
            isVisible: widget => this.withOpenEditorsWidget(widget, () => true)
        });
        registry.registerCommand(navigator_open_editors_commands_1.OpenEditorsCommands.SAVE_ALL_TABS_FROM_TOOLBAR, {
            execute: widget => this.withOpenEditorsWidget(widget, () => registry.executeCommand(browser_1.CommonCommands.SAVE_ALL.id)),
            isEnabled: widget => this.withOpenEditorsWidget(widget, () => true),
            isVisible: widget => this.withOpenEditorsWidget(widget, () => true)
        });
        const filterEditorWidgets = (title) => {
            const { owner } = title;
            return browser_1.NavigatableWidget.is(owner);
        };
        registry.registerCommand(navigator_open_editors_commands_1.OpenEditorsCommands.CLOSE_ALL_EDITORS_IN_GROUP_FROM_ICON, {
            execute: (tabBarOrArea) => {
                this.shell.closeTabs(tabBarOrArea, filterEditorWidgets);
            },
            isVisible: () => false
        });
        registry.registerCommand(navigator_open_editors_commands_1.OpenEditorsCommands.SAVE_ALL_IN_GROUP_FROM_ICON, {
            execute: (tabBarOrArea) => {
                this.shell.saveTabs(tabBarOrArea, filterEditorWidgets);
            },
            isVisible: () => false
        });
        registry.registerCommand(file_navigator_commands_1.FileNavigatorCommands.NEW_FILE_TOOLBAR, {
            execute: (...args) => registry.executeCommand(browser_2.WorkspaceCommands.NEW_FILE.id, ...args),
            isEnabled: widget => this.withWidget(widget, () => this.workspaceService.opened),
            isVisible: widget => this.withWidget(widget, () => this.workspaceService.opened)
        });
        registry.registerCommand(file_navigator_commands_1.FileNavigatorCommands.NEW_FOLDER_TOOLBAR, {
            execute: (...args) => registry.executeCommand(browser_2.WorkspaceCommands.NEW_FOLDER.id, ...args),
            isEnabled: widget => this.withWidget(widget, () => this.workspaceService.opened),
            isVisible: widget => this.withWidget(widget, () => this.workspaceService.opened)
        });
    }
    get editorWidgets() {
        var _a;
        const openEditorsWidget = this.widgetManager.tryGetWidget(navigator_open_editors_widget_1.OpenEditorsWidget.ID);
        return (_a = openEditorsWidget === null || openEditorsWidget === void 0 ? void 0 : openEditorsWidget.editorWidgets) !== null && _a !== void 0 ? _a : [];
    }
    getSelectedFileNodes() {
        var _a;
        return ((_a = this.tryGetWidget()) === null || _a === void 0 ? void 0 : _a.model.selectedNodes.filter(browser_3.FileNode.is)) || [];
    }
    withWidget(widget = this.tryGetWidget(), cb) {
        if (widget instanceof navigator_widget_1.FileNavigatorWidget && widget.id === navigator_widget_1.FILE_NAVIGATOR_ID) {
            return cb(widget);
        }
        return false;
    }
    withOpenEditorsWidget(widget, cb) {
        if (widget instanceof navigator_open_editors_widget_1.OpenEditorsWidget && widget.id === navigator_open_editors_widget_1.OpenEditorsWidget.ID) {
            return cb(widget);
        }
        return false;
    }
    registerMenus(registry) {
        super.registerMenus(registry);
        registry.registerMenuAction(exports.SHELL_TABBAR_CONTEXT_REVEAL, {
            commandId: file_navigator_commands_1.FileNavigatorCommands.REVEAL_IN_NAVIGATOR.id,
            label: file_navigator_commands_1.FileNavigatorCommands.REVEAL_IN_NAVIGATOR.label,
            order: '5'
        });
        registry.registerMenuAction(NavigatorContextMenu.NAVIGATION, {
            commandId: file_navigator_commands_1.FileNavigatorCommands.OPEN.id,
            label: file_navigator_commands_1.FileNavigatorCommands.OPEN.label
        });
        registry.registerSubmenu(NavigatorContextMenu.OPEN_WITH, nls_1.nls.localizeByDefault('Open With...'));
        this.openerService.getOpeners().then(openers => {
            for (const opener of openers) {
                const openWithCommand = browser_2.WorkspaceCommands.FILE_OPEN_WITH(opener);
                registry.registerMenuAction(NavigatorContextMenu.OPEN_WITH, {
                    commandId: openWithCommand.id,
                    label: opener.label,
                    icon: opener.iconClass
                });
            }
        });
        registry.registerMenuAction(NavigatorContextMenu.CLIPBOARD, {
            commandId: browser_1.CommonCommands.COPY.id,
            order: 'a'
        });
        registry.registerMenuAction(NavigatorContextMenu.CLIPBOARD, {
            commandId: browser_1.CommonCommands.PASTE.id,
            order: 'b'
        });
        registry.registerMenuAction(NavigatorContextMenu.CLIPBOARD, {
            commandId: browser_1.CommonCommands.COPY_PATH.id,
            order: 'c'
        });
        registry.registerMenuAction(NavigatorContextMenu.CLIPBOARD, {
            commandId: browser_2.WorkspaceCommands.COPY_RELATIVE_FILE_PATH.id,
            label: browser_2.WorkspaceCommands.COPY_RELATIVE_FILE_PATH.label,
            order: 'd'
        });
        registry.registerMenuAction(NavigatorContextMenu.CLIPBOARD, {
            commandId: file_download_command_contribution_1.FileDownloadCommands.COPY_DOWNLOAD_LINK.id,
            order: 'z'
        });
        registry.registerMenuAction(NavigatorContextMenu.MODIFICATION, {
            commandId: browser_2.WorkspaceCommands.FILE_RENAME.id
        });
        registry.registerMenuAction(NavigatorContextMenu.MODIFICATION, {
            commandId: browser_2.WorkspaceCommands.FILE_DELETE.id
        });
        registry.registerMenuAction(NavigatorContextMenu.MODIFICATION, {
            commandId: browser_2.WorkspaceCommands.FILE_DUPLICATE.id
        });
        const downloadUploadMenu = [...exports.NAVIGATOR_CONTEXT_MENU, '6_downloadupload'];
        registry.registerMenuAction(downloadUploadMenu, {
            commandId: filesystem_frontend_contribution_1.FileSystemCommands.UPLOAD.id,
            order: 'a'
        });
        registry.registerMenuAction(downloadUploadMenu, {
            commandId: file_download_command_contribution_1.FileDownloadCommands.DOWNLOAD.id,
            order: 'b'
        });
        registry.registerMenuAction(NavigatorContextMenu.NAVIGATION, {
            commandId: browser_2.WorkspaceCommands.NEW_FILE.id,
            when: 'explorerResourceIsFolder'
        });
        registry.registerMenuAction(NavigatorContextMenu.NAVIGATION, {
            commandId: browser_2.WorkspaceCommands.NEW_FOLDER.id,
            when: 'explorerResourceIsFolder'
        });
        registry.registerMenuAction(NavigatorContextMenu.COMPARE, {
            commandId: browser_2.WorkspaceCommands.FILE_COMPARE.id
        });
        registry.registerMenuAction(NavigatorContextMenu.MODIFICATION, {
            commandId: file_navigator_commands_1.FileNavigatorCommands.COLLAPSE_ALL.id,
            label: nls_1.nls.localizeByDefault('Collapse All'),
            order: 'z2'
        });
        registry.registerMenuAction(NavigatorContextMenu.COMPARE, {
            commandId: navigator_diff_1.NavigatorDiffCommands.COMPARE_FIRST.id,
            order: 'za'
        });
        registry.registerMenuAction(NavigatorContextMenu.COMPARE, {
            commandId: navigator_diff_1.NavigatorDiffCommands.COMPARE_SECOND.id,
            order: 'zb'
        });
        // Open Editors Widget Menu Items
        registry.registerMenuAction(navigator_open_editors_menus_1.OpenEditorsContextMenu.CLIPBOARD, {
            commandId: browser_1.CommonCommands.COPY_PATH.id,
            order: 'a'
        });
        registry.registerMenuAction(navigator_open_editors_menus_1.OpenEditorsContextMenu.CLIPBOARD, {
            commandId: browser_2.WorkspaceCommands.COPY_RELATIVE_FILE_PATH.id,
            order: 'b'
        });
        registry.registerMenuAction(navigator_open_editors_menus_1.OpenEditorsContextMenu.SAVE, {
            commandId: browser_1.CommonCommands.SAVE.id,
            order: 'a'
        });
        registry.registerMenuAction(navigator_open_editors_menus_1.OpenEditorsContextMenu.COMPARE, {
            commandId: navigator_diff_1.NavigatorDiffCommands.COMPARE_FIRST.id,
            order: 'a'
        });
        registry.registerMenuAction(navigator_open_editors_menus_1.OpenEditorsContextMenu.COMPARE, {
            commandId: navigator_diff_1.NavigatorDiffCommands.COMPARE_SECOND.id,
            order: 'b'
        });
        registry.registerMenuAction(navigator_open_editors_menus_1.OpenEditorsContextMenu.MODIFICATION, {
            commandId: browser_1.CommonCommands.CLOSE_TAB.id,
            label: nls_1.nls.localizeByDefault('Close'),
            order: 'a'
        });
        registry.registerMenuAction(navigator_open_editors_menus_1.OpenEditorsContextMenu.MODIFICATION, {
            commandId: browser_1.CommonCommands.CLOSE_OTHER_TABS.id,
            label: nls_1.nls.localizeByDefault('Close Others'),
            order: 'b'
        });
        registry.registerMenuAction(navigator_open_editors_menus_1.OpenEditorsContextMenu.MODIFICATION, {
            commandId: browser_1.CommonCommands.CLOSE_ALL_MAIN_TABS.id,
            label: nls_1.nls.localizeByDefault('Close All'),
            order: 'c'
        });
        registry.registerMenuAction(NavigatorContextMenu.WORKSPACE, {
            commandId: file_navigator_commands_1.FileNavigatorCommands.ADD_ROOT_FOLDER.id,
            label: browser_2.WorkspaceCommands.ADD_FOLDER.label
        });
        registry.registerMenuAction(NavigatorContextMenu.WORKSPACE, {
            commandId: browser_2.WorkspaceCommands.REMOVE_FOLDER.id
        });
    }
    registerKeybindings(registry) {
        super.registerKeybindings(registry);
        registry.registerKeybinding({
            command: file_navigator_commands_1.FileNavigatorCommands.REVEAL_IN_NAVIGATOR.id,
            keybinding: 'alt+r'
        });
        registry.registerKeybinding({
            command: browser_2.WorkspaceCommands.FILE_DELETE.id,
            keybinding: common_1.isOSX ? 'cmd+backspace' : 'del',
            when: 'filesExplorerFocus'
        });
        registry.registerKeybinding({
            command: browser_2.WorkspaceCommands.FILE_RENAME.id,
            keybinding: 'f2',
            when: 'filesExplorerFocus'
        });
        registry.registerKeybinding({
            command: file_navigator_commands_1.FileNavigatorCommands.TOGGLE_HIDDEN_FILES.id,
            keybinding: 'ctrlcmd+i',
            when: 'filesExplorerFocus'
        });
    }
    async registerToolbarItems(toolbarRegistry) {
        toolbarRegistry.registerItem({
            id: file_navigator_commands_1.FileNavigatorCommands.NEW_FILE_TOOLBAR.id,
            command: file_navigator_commands_1.FileNavigatorCommands.NEW_FILE_TOOLBAR.id,
            tooltip: nls_1.nls.localizeByDefault('New File...'),
            priority: 0,
        });
        toolbarRegistry.registerItem({
            id: file_navigator_commands_1.FileNavigatorCommands.NEW_FOLDER_TOOLBAR.id,
            command: file_navigator_commands_1.FileNavigatorCommands.NEW_FOLDER_TOOLBAR.id,
            tooltip: nls_1.nls.localizeByDefault('New Folder...'),
            priority: 1,
        });
        toolbarRegistry.registerItem({
            id: file_navigator_commands_1.FileNavigatorCommands.REFRESH_NAVIGATOR.id,
            command: file_navigator_commands_1.FileNavigatorCommands.REFRESH_NAVIGATOR.id,
            tooltip: nls_1.nls.localizeByDefault('Refresh Explorer'),
            priority: 2,
        });
        toolbarRegistry.registerItem({
            id: file_navigator_commands_1.FileNavigatorCommands.COLLAPSE_ALL.id,
            command: file_navigator_commands_1.FileNavigatorCommands.COLLAPSE_ALL.id,
            tooltip: nls_1.nls.localizeByDefault('Collapse All'),
            priority: 3,
        });
        // More (...) toolbar items.
        this.registerMoreToolbarItem({
            id: file_navigator_commands_1.FileNavigatorCommands.TOGGLE_AUTO_REVEAL.id,
            command: file_navigator_commands_1.FileNavigatorCommands.TOGGLE_AUTO_REVEAL.id,
            tooltip: file_navigator_commands_1.FileNavigatorCommands.TOGGLE_AUTO_REVEAL.label,
            group: NavigatorMoreToolbarGroups.TOOLS,
        });
        this.registerMoreToolbarItem({
            id: browser_2.WorkspaceCommands.ADD_FOLDER.id,
            command: browser_2.WorkspaceCommands.ADD_FOLDER.id,
            tooltip: browser_2.WorkspaceCommands.ADD_FOLDER.label,
            group: NavigatorMoreToolbarGroups.WORKSPACE,
        });
        // Open Editors toolbar items.
        toolbarRegistry.registerItem({
            id: navigator_open_editors_commands_1.OpenEditorsCommands.SAVE_ALL_TABS_FROM_TOOLBAR.id,
            command: navigator_open_editors_commands_1.OpenEditorsCommands.SAVE_ALL_TABS_FROM_TOOLBAR.id,
            tooltip: navigator_open_editors_commands_1.OpenEditorsCommands.SAVE_ALL_TABS_FROM_TOOLBAR.label,
            priority: 0,
        });
        toolbarRegistry.registerItem({
            id: navigator_open_editors_commands_1.OpenEditorsCommands.CLOSE_ALL_TABS_FROM_TOOLBAR.id,
            command: navigator_open_editors_commands_1.OpenEditorsCommands.CLOSE_ALL_TABS_FROM_TOOLBAR.id,
            tooltip: navigator_open_editors_commands_1.OpenEditorsCommands.CLOSE_ALL_TABS_FROM_TOOLBAR.label,
            priority: 1,
        });
    }
    /**
     * Reveals and selects node in the file navigator to which given widget is related.
     * Does nothing if given widget undefined or doesn't have related resource.
     *
     * @param widget widget file resource of which should be revealed and selected
     */
    async selectWidgetFileNode(widget) {
        return this.selectFileNode(browser_1.NavigatableWidget.getUri(widget));
    }
    async selectFileNode(uri) {
        if (uri) {
            const { model } = await this.widget;
            const node = await model.revealFile(uri);
            if (browser_1.SelectableTreeNode.is(node)) {
                model.selectNode(node);
                return true;
            }
        }
        return false;
    }
    onCurrentWidgetChangedHandler() {
        if (this.fileNavigatorPreferences['explorer.autoReveal']) {
            this.selectWidgetFileNode(this.shell.currentWidget);
        }
    }
    /**
     * Collapse file navigator nodes and set focus on first visible node
     * - single root workspace: collapse all nodes except root
     * - multiple root workspace: collapse all nodes, even roots
     */
    async collapseFileNavigatorTree() {
        const { model } = await this.widget;
        // collapse all child nodes which are not the root (single root workspace)
        // collapse all root nodes (multiple root workspace)
        let root = model.root;
        if (navigator_tree_1.WorkspaceNode.is(root) && root.children.length === 1) {
            root = root.children[0];
        }
        root.children.forEach(child => browser_1.CompositeTreeNode.is(child) && model.collapseAll(child));
        // select first visible node
        const firstChild = navigator_tree_1.WorkspaceNode.is(root) ? root.children[0] : root;
        if (browser_1.SelectableTreeNode.is(firstChild)) {
            model.selectNode(firstChild);
        }
    }
    /**
     * force refresh workspace in navigator
     */
    async refreshWorkspace() {
        const { model } = await this.widget;
        await model.refresh();
    }
};
__decorate([
    (0, inversify_1.inject)(clipboard_service_1.ClipboardService),
    __metadata("design:type", Object)
], FileNavigatorContribution.prototype, "clipboardService", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.CommandRegistry),
    __metadata("design:type", common_1.CommandRegistry)
], FileNavigatorContribution.prototype, "commandRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(tab_bar_toolbar_1.TabBarToolbarRegistry),
    __metadata("design:type", tab_bar_toolbar_1.TabBarToolbarRegistry)
], FileNavigatorContribution.prototype, "tabbarToolbarRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(navigator_context_key_service_1.NavigatorContextKeyService),
    __metadata("design:type", navigator_context_key_service_1.NavigatorContextKeyService)
], FileNavigatorContribution.prototype, "contextKeyService", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.MenuModelRegistry),
    __metadata("design:type", common_1.MenuModelRegistry)
], FileNavigatorContribution.prototype, "menuRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(navigator_diff_1.NavigatorDiff),
    __metadata("design:type", navigator_diff_1.NavigatorDiff)
], FileNavigatorContribution.prototype, "navigatorDiff", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.PreferenceService),
    __metadata("design:type", Object)
], FileNavigatorContribution.prototype, "preferenceService", void 0);
__decorate([
    (0, inversify_1.inject)(selection_service_1.SelectionService),
    __metadata("design:type", selection_service_1.SelectionService)
], FileNavigatorContribution.prototype, "selectionService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.WorkspaceCommandContribution),
    __metadata("design:type", browser_2.WorkspaceCommandContribution)
], FileNavigatorContribution.prototype, "workspaceCommandContribution", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FileNavigatorContribution.prototype, "init", null);
FileNavigatorContribution = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(navigator_preferences_1.FileNavigatorPreferences)),
    __param(1, (0, inversify_1.inject)(browser_1.OpenerService)),
    __param(2, (0, inversify_1.inject)(navigator_filter_1.FileNavigatorFilter)),
    __param(3, (0, inversify_1.inject)(browser_2.WorkspaceService)),
    __param(4, (0, inversify_1.inject)(browser_2.WorkspacePreferences)),
    __metadata("design:paramtypes", [Object, Object, navigator_filter_1.FileNavigatorFilter,
        browser_2.WorkspaceService, Object])
], FileNavigatorContribution);
exports.FileNavigatorContribution = FileNavigatorContribution;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/navigator/lib/browser/navigator-contribution'] = this;


/***/ }),

/***/ "../../packages/navigator/lib/browser/navigator-diff.js":
/*!**************************************************************!*\
  !*** ../../packages/navigator/lib/browser/navigator-diff.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2019 David Saunders and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NavigatorDiff = exports.NavigatorDiffCommands = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const opener_service_1 = __webpack_require__(/*! @theia/core/lib/browser/opener-service */ "../../packages/core/lib/browser/opener-service.js");
const message_service_1 = __webpack_require__(/*! @theia/core/lib/common/message-service */ "../../packages/core/lib/common/message-service.js");
const command_1 = __webpack_require__(/*! @theia/core/lib/common/command */ "../../packages/core/lib/common/command.js");
const diff_uris_1 = __webpack_require__(/*! @theia/core/lib/browser/diff-uris */ "../../packages/core/lib/browser/diff-uris.js");
const file_service_1 = __webpack_require__(/*! @theia/filesystem/lib/browser/file-service */ "../../packages/filesystem/lib/browser/file-service.js");
const files_1 = __webpack_require__(/*! @theia/filesystem/lib/common/files */ "../../packages/filesystem/lib/common/files.js");
var NavigatorDiffCommands;
(function (NavigatorDiffCommands) {
    const COMPARE_CATEGORY = 'Compare';
    NavigatorDiffCommands.COMPARE_FIRST = command_1.Command.toDefaultLocalizedCommand({
        id: 'compare:first',
        category: COMPARE_CATEGORY,
        label: 'Select for Compare'
    });
    NavigatorDiffCommands.COMPARE_SECOND = command_1.Command.toDefaultLocalizedCommand({
        id: 'compare:second',
        category: COMPARE_CATEGORY,
        label: 'Compare with Selected'
    });
})(NavigatorDiffCommands = exports.NavigatorDiffCommands || (exports.NavigatorDiffCommands = {}));
let NavigatorDiff = class NavigatorDiff {
    constructor() {
        this._firstCompareFile = undefined;
    }
    get firstCompareFile() {
        return this._firstCompareFile;
    }
    set firstCompareFile(uri) {
        this._firstCompareFile = uri;
        this._isFirstFileSelected = true;
    }
    get isFirstFileSelected() {
        return this._isFirstFileSelected;
    }
    async isDirectory(uri) {
        try {
            const stat = await this.fileService.resolve(uri);
            return stat.isDirectory;
        }
        catch (e) {
            if (e instanceof files_1.FileOperationError && e.fileOperationResult === 1 /* FILE_NOT_FOUND */) {
                return true;
            }
        }
        return false;
    }
    async getURISelection() {
        const uri = common_1.UriSelection.getUri(this.selectionService.selection);
        if (!uri) {
            return undefined;
        }
        if (await this.isDirectory(uri)) {
            return undefined;
        }
        return uri;
    }
    /**
     * Adds the initial file for comparison
     * @see SelectionService
     * @see compareFiles
     * @returns Promise<boolean> indicating whether the uri is valid
     */
    async addFirstComparisonFile() {
        const uriSelected = await this.getURISelection();
        if (uriSelected === undefined) {
            return false;
        }
        this.firstCompareFile = uriSelected;
        return true;
    }
    /**
     * Compare selected files.  First file is selected through addFirstComparisonFile
     * @see SelectionService
     * @see addFirstComparisonFile
     * @returns Promise<boolean> indicating whether the comparison was completed successfully
     */
    async compareFiles() {
        const uriSelected = await this.getURISelection();
        if (this.firstCompareFile === undefined || uriSelected === undefined) {
            return false;
        }
        const diffUri = diff_uris_1.DiffUris.encode(this.firstCompareFile, uriSelected);
        (0, opener_service_1.open)(this.openerService, diffUri).catch(e => {
            this.notifications.error(e.message);
        });
        return true;
    }
};
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], NavigatorDiff.prototype, "fileService", void 0);
__decorate([
    (0, inversify_1.inject)(opener_service_1.OpenerService),
    __metadata("design:type", Object)
], NavigatorDiff.prototype, "openerService", void 0);
__decorate([
    (0, inversify_1.inject)(message_service_1.MessageService),
    __metadata("design:type", message_service_1.MessageService)
], NavigatorDiff.prototype, "notifications", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.SelectionService),
    __metadata("design:type", common_1.SelectionService)
], NavigatorDiff.prototype, "selectionService", void 0);
NavigatorDiff = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], NavigatorDiff);
exports.NavigatorDiff = NavigatorDiff;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/navigator/lib/browser/navigator-diff'] = this;


/***/ })

}]);
//# sourceMappingURL=packages_navigator_lib_browser_navigator-contribution_js.js.map