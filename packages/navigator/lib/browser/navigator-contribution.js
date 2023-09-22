"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileNavigatorContribution = exports.FILE_NAVIGATOR_TOGGLE_COMMAND_ID = exports.NavigatorContextMenu = exports.SHELL_TABBAR_CONTEXT_REVEAL = exports.NAVIGATOR_CONTEXT_MENU = exports.NavigatorMoreToolbarGroups = exports.FileNavigatorCommands = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const view_contribution_1 = require("@theia/core/lib/browser/shell/view-contribution");
const browser_1 = require("@theia/core/lib/browser");
const file_download_command_contribution_1 = require("@theia/filesystem/lib/browser/download/file-download-command-contribution");
const common_1 = require("@theia/core/lib/common");
const browser_2 = require("@theia/workspace/lib/browser");
const navigator_widget_factory_1 = require("./navigator-widget-factory");
const navigator_widget_1 = require("./navigator-widget");
const navigator_preferences_1 = require("./navigator-preferences");
const navigator_filter_1 = require("./navigator-filter");
const navigator_tree_1 = require("./navigator-tree");
const navigator_context_key_service_1 = require("./navigator-context-key-service");
const tab_bar_toolbar_1 = require("@theia/core/lib/browser/shell/tab-bar-toolbar");
const filesystem_frontend_contribution_1 = require("@theia/filesystem/lib/browser/filesystem-frontend-contribution");
const navigator_diff_1 = require("./navigator-diff");
const browser_3 = require("@theia/filesystem/lib/browser");
const clipboard_service_1 = require("@theia/core/lib/browser/clipboard-service");
const selection_service_1 = require("@theia/core/lib/common/selection-service");
const navigator_open_editors_widget_1 = require("./open-editors-widget/navigator-open-editors-widget");
const navigator_open_editors_menus_1 = require("./open-editors-widget/navigator-open-editors-menus");
const navigator_open_editors_commands_1 = require("./open-editors-widget/navigator-open-editors-commands");
const nls_1 = require("@theia/core/lib/common/nls");
const uri_command_handler_1 = require("@theia/core/lib/common/uri-command-handler");
const file_navigator_commands_1 = require("./file-navigator-commands");
Object.defineProperty(exports, "FileNavigatorCommands", { enumerable: true, get: function () { return file_navigator_commands_1.FileNavigatorCommands; } });
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
//# sourceMappingURL=navigator-contribution.js.map