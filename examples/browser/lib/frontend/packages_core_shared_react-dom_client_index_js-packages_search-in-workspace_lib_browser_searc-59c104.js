(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_core_shared_react-dom_client_index_js-packages_search-in-workspace_lib_browser_searc-59c104"],{

/***/ "../../packages/core/shared/react-dom/client/index.js":
/*!************************************************************!*\
  !*** ../../packages/core/shared/react-dom/client/index.js ***!
  \************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! react-dom/client */ "../../node_modules/react-dom/client.js");

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/shared/react-dom/client'] = this;


/***/ }),

/***/ "../../packages/search-in-workspace/lib/browser/search-in-workspace-frontend-contribution.js":
/*!***************************************************************************************************!*\
  !*** ../../packages/search-in-workspace/lib/browser/search-in-workspace-frontend-contribution.js ***!
  \***************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SearchInWorkspaceFrontendContribution = exports.SearchInWorkspaceCommands = void 0;
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const search_in_workspace_widget_1 = __webpack_require__(/*! ./search-in-workspace-widget */ "../../packages/search-in-workspace/lib/browser/search-in-workspace-widget.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const widgets_1 = __webpack_require__(/*! @theia/core/lib/browser/widgets */ "../../packages/core/lib/browser/widgets/index.js");
const navigator_contribution_1 = __webpack_require__(/*! @theia/navigator/lib/browser/navigator-contribution */ "../../packages/navigator/lib/browser/navigator-contribution.js");
const uri_command_handler_1 = __webpack_require__(/*! @theia/core/lib/common/uri-command-handler */ "../../packages/core/lib/common/uri-command-handler.js");
const browser_2 = __webpack_require__(/*! @theia/workspace/lib/browser */ "../../packages/workspace/lib/browser/index.js");
const search_in_workspace_context_key_service_1 = __webpack_require__(/*! ./search-in-workspace-context-key-service */ "../../packages/search-in-workspace/lib/browser/search-in-workspace-context-key-service.js");
const editor_manager_1 = __webpack_require__(/*! @theia/editor/lib/browser/editor-manager */ "../../packages/editor/lib/browser/editor-manager.js");
const vscode_languageserver_protocol_1 = __webpack_require__(/*! @theia/core/shared/vscode-languageserver-protocol */ "../../packages/core/shared/vscode-languageserver-protocol/index.js");
const file_service_1 = __webpack_require__(/*! @theia/filesystem/lib/browser/file-service */ "../../packages/filesystem/lib/browser/file-service.js");
const search_in_workspace_factory_1 = __webpack_require__(/*! ./search-in-workspace-factory */ "../../packages/search-in-workspace/lib/browser/search-in-workspace-factory.js");
const search_in_workspace_result_tree_widget_1 = __webpack_require__(/*! ./search-in-workspace-result-tree-widget */ "../../packages/search-in-workspace/lib/browser/search-in-workspace-result-tree-widget.js");
const tree_widget_selection_1 = __webpack_require__(/*! @theia/core/lib/browser/tree/tree-widget-selection */ "../../packages/core/lib/browser/tree/tree-widget-selection.js");
const clipboard_service_1 = __webpack_require__(/*! @theia/core/lib/browser/clipboard-service */ "../../packages/core/lib/browser/clipboard-service.js");
const theme_1 = __webpack_require__(/*! @theia/core/lib/common/theme */ "../../packages/core/lib/common/theme.js");
var SearchInWorkspaceCommands;
(function (SearchInWorkspaceCommands) {
    const SEARCH_CATEGORY = 'Search';
    SearchInWorkspaceCommands.TOGGLE_SIW_WIDGET = {
        id: 'search-in-workspace.toggle'
    };
    SearchInWorkspaceCommands.OPEN_SIW_WIDGET = core_1.Command.toDefaultLocalizedCommand({
        id: 'search-in-workspace.open',
        category: SEARCH_CATEGORY,
        label: 'Find in Files'
    });
    SearchInWorkspaceCommands.REPLACE_IN_FILES = core_1.Command.toDefaultLocalizedCommand({
        id: 'search-in-workspace.replace',
        category: SEARCH_CATEGORY,
        label: 'Replace in Files'
    });
    SearchInWorkspaceCommands.FIND_IN_FOLDER = core_1.Command.toDefaultLocalizedCommand({
        id: 'search-in-workspace.in-folder',
        category: SEARCH_CATEGORY,
        label: 'Find in Folder...'
    });
    SearchInWorkspaceCommands.REFRESH_RESULTS = core_1.Command.toDefaultLocalizedCommand({
        id: 'search-in-workspace.refresh',
        category: SEARCH_CATEGORY,
        label: 'Refresh',
        iconClass: (0, widgets_1.codicon)('refresh')
    });
    SearchInWorkspaceCommands.CANCEL_SEARCH = core_1.Command.toDefaultLocalizedCommand({
        id: 'search-in-workspace.cancel',
        category: SEARCH_CATEGORY,
        label: 'Cancel Search',
        iconClass: (0, widgets_1.codicon)('search-stop')
    });
    SearchInWorkspaceCommands.COLLAPSE_ALL = core_1.Command.toDefaultLocalizedCommand({
        id: 'search-in-workspace.collapse-all',
        category: SEARCH_CATEGORY,
        label: 'Collapse All',
        iconClass: (0, widgets_1.codicon)('collapse-all')
    });
    SearchInWorkspaceCommands.EXPAND_ALL = core_1.Command.toDefaultLocalizedCommand({
        id: 'search-in-workspace.expand-all',
        category: SEARCH_CATEGORY,
        label: 'Expand All',
        iconClass: (0, widgets_1.codicon)('expand-all')
    });
    SearchInWorkspaceCommands.CLEAR_ALL = core_1.Command.toDefaultLocalizedCommand({
        id: 'search-in-workspace.clear-all',
        category: SEARCH_CATEGORY,
        label: 'Clear Search Results',
        iconClass: (0, widgets_1.codicon)('clear-all')
    });
    SearchInWorkspaceCommands.COPY_ALL = core_1.Command.toDefaultLocalizedCommand({
        id: 'search.action.copyAll',
        category: SEARCH_CATEGORY,
        label: 'Copy All',
    });
    SearchInWorkspaceCommands.COPY_ONE = core_1.Command.toDefaultLocalizedCommand({
        id: 'search.action.copyMatch',
        category: SEARCH_CATEGORY,
        label: 'Copy',
    });
    SearchInWorkspaceCommands.DISMISS_RESULT = core_1.Command.toDefaultLocalizedCommand({
        id: 'search.action.remove',
        category: SEARCH_CATEGORY,
        label: 'Dismiss',
    });
    SearchInWorkspaceCommands.REPLACE_RESULT = core_1.Command.toDefaultLocalizedCommand({
        id: 'search.action.replace',
    });
    SearchInWorkspaceCommands.REPLACE_ALL_RESULTS = core_1.Command.toDefaultLocalizedCommand({
        id: 'search.action.replaceAll'
    });
})(SearchInWorkspaceCommands = exports.SearchInWorkspaceCommands || (exports.SearchInWorkspaceCommands = {}));
let SearchInWorkspaceFrontendContribution = class SearchInWorkspaceFrontendContribution extends browser_1.AbstractViewContribution {
    constructor() {
        super({
            viewContainerId: search_in_workspace_factory_1.SEARCH_VIEW_CONTAINER_ID,
            widgetId: search_in_workspace_widget_1.SearchInWorkspaceWidget.ID,
            widgetName: search_in_workspace_widget_1.SearchInWorkspaceWidget.LABEL,
            defaultWidgetOptions: {
                area: 'left',
                rank: 200
            },
            toggleCommandId: SearchInWorkspaceCommands.TOGGLE_SIW_WIDGET.id
        });
    }
    init() {
        const updateFocusContextKey = () => this.contextKeyService.searchViewletFocus.set(this.shell.activeWidget instanceof search_in_workspace_widget_1.SearchInWorkspaceWidget);
        updateFocusContextKey();
        this.shell.onDidChangeActiveWidget(updateFocusContextKey);
    }
    async initializeLayout(app) {
        await this.openView({ activate: false });
    }
    async registerCommands(commands) {
        super.registerCommands(commands);
        commands.registerCommand(SearchInWorkspaceCommands.OPEN_SIW_WIDGET, {
            isEnabled: () => this.workspaceService.tryGetRoots().length > 0,
            execute: async () => {
                const widget = await this.openView({ activate: true });
                widget.updateSearchTerm(this.getSearchTerm());
            }
        });
        commands.registerCommand(SearchInWorkspaceCommands.REPLACE_IN_FILES, {
            isEnabled: () => this.workspaceService.tryGetRoots().length > 0,
            execute: async () => {
                const widget = await this.openView({ activate: true });
                widget.updateSearchTerm(this.getSearchTerm(), true);
            }
        });
        commands.registerCommand(SearchInWorkspaceCommands.FIND_IN_FOLDER, this.newMultiUriAwareCommandHandler({
            execute: async (uris) => {
                const resources = [];
                for (const { stat } of await this.fileService.resolveAll(uris.map(resource => ({ resource })))) {
                    if (stat) {
                        const uri = stat.resource;
                        let uriStr = this.labelProvider.getLongName(uri);
                        if (stat && !stat.isDirectory) {
                            uriStr = this.labelProvider.getLongName(uri.parent);
                        }
                        resources.push(uriStr);
                    }
                }
                const widget = await this.openView({ activate: true });
                widget.findInFolder(resources);
            }
        }));
        commands.registerCommand(SearchInWorkspaceCommands.CANCEL_SEARCH, {
            execute: w => this.withWidget(w, widget => widget.getCancelIndicator() && widget.getCancelIndicator().cancel()),
            isEnabled: w => this.withWidget(w, widget => widget.getCancelIndicator() !== undefined),
            isVisible: w => this.withWidget(w, widget => widget.getCancelIndicator() !== undefined)
        });
        commands.registerCommand(SearchInWorkspaceCommands.REFRESH_RESULTS, {
            execute: w => this.withWidget(w, widget => widget.refresh()),
            isEnabled: w => this.withWidget(w, widget => (widget.hasResultList() || widget.hasSearchTerm()) && this.workspaceService.tryGetRoots().length > 0),
            isVisible: w => this.withWidget(w, () => true)
        });
        commands.registerCommand(SearchInWorkspaceCommands.COLLAPSE_ALL, {
            execute: w => this.withWidget(w, widget => widget.collapseAll()),
            isEnabled: w => this.withWidget(w, widget => widget.hasResultList()),
            isVisible: w => this.withWidget(w, widget => !widget.areResultsCollapsed())
        });
        commands.registerCommand(SearchInWorkspaceCommands.EXPAND_ALL, {
            execute: w => this.withWidget(w, widget => widget.expandAll()),
            isEnabled: w => this.withWidget(w, widget => widget.hasResultList()),
            isVisible: w => this.withWidget(w, widget => widget.areResultsCollapsed())
        });
        commands.registerCommand(SearchInWorkspaceCommands.CLEAR_ALL, {
            execute: w => this.withWidget(w, widget => widget.clear()),
            isEnabled: w => this.withWidget(w, widget => widget.hasResultList()),
            isVisible: w => this.withWidget(w, () => true)
        });
        commands.registerCommand(SearchInWorkspaceCommands.DISMISS_RESULT, {
            isEnabled: () => this.withWidget(undefined, widget => {
                const { selection } = this.selectionService;
                return tree_widget_selection_1.TreeWidgetSelection.isSource(selection, widget.resultTreeWidget) && selection.length > 0;
            }),
            isVisible: () => this.withWidget(undefined, widget => {
                const { selection } = this.selectionService;
                return tree_widget_selection_1.TreeWidgetSelection.isSource(selection, widget.resultTreeWidget) && selection.length > 0;
            }),
            execute: () => this.withWidget(undefined, widget => {
                const { selection } = this.selectionService;
                if (tree_widget_selection_1.TreeWidgetSelection.is(selection)) {
                    selection.forEach(n => widget.resultTreeWidget.removeNode(n));
                }
            })
        });
        commands.registerCommand(SearchInWorkspaceCommands.REPLACE_RESULT, {
            isEnabled: () => this.withWidget(undefined, widget => {
                const { selection } = this.selectionService;
                return tree_widget_selection_1.TreeWidgetSelection.isSource(selection, widget.resultTreeWidget) && selection.length > 0 && !search_in_workspace_result_tree_widget_1.SearchInWorkspaceFileNode.is(selection[0]);
            }),
            isVisible: () => this.withWidget(undefined, widget => {
                const { selection } = this.selectionService;
                return tree_widget_selection_1.TreeWidgetSelection.isSource(selection, widget.resultTreeWidget) && selection.length > 0 && !search_in_workspace_result_tree_widget_1.SearchInWorkspaceFileNode.is(selection[0]);
            }),
            execute: () => this.withWidget(undefined, widget => {
                const { selection } = this.selectionService;
                if (tree_widget_selection_1.TreeWidgetSelection.is(selection)) {
                    selection.forEach(n => widget.resultTreeWidget.replace(n));
                }
            }),
        });
        commands.registerCommand(SearchInWorkspaceCommands.REPLACE_ALL_RESULTS, {
            isEnabled: () => this.withWidget(undefined, widget => {
                const { selection } = this.selectionService;
                return tree_widget_selection_1.TreeWidgetSelection.isSource(selection, widget.resultTreeWidget) && selection.length > 0
                    && search_in_workspace_result_tree_widget_1.SearchInWorkspaceFileNode.is(selection[0]);
            }),
            isVisible: () => this.withWidget(undefined, widget => {
                const { selection } = this.selectionService;
                return tree_widget_selection_1.TreeWidgetSelection.isSource(selection, widget.resultTreeWidget) && selection.length > 0
                    && search_in_workspace_result_tree_widget_1.SearchInWorkspaceFileNode.is(selection[0]);
            }),
            execute: () => this.withWidget(undefined, widget => {
                const { selection } = this.selectionService;
                if (tree_widget_selection_1.TreeWidgetSelection.is(selection)) {
                    selection.forEach(n => widget.resultTreeWidget.replace(n));
                }
            }),
        });
        commands.registerCommand(SearchInWorkspaceCommands.COPY_ONE, {
            isEnabled: () => this.withWidget(undefined, widget => {
                const { selection } = this.selectionService;
                return tree_widget_selection_1.TreeWidgetSelection.isSource(selection, widget.resultTreeWidget) && selection.length > 0;
            }),
            isVisible: () => this.withWidget(undefined, widget => {
                const { selection } = this.selectionService;
                return tree_widget_selection_1.TreeWidgetSelection.isSource(selection, widget.resultTreeWidget) && selection.length > 0;
            }),
            execute: () => this.withWidget(undefined, widget => {
                const { selection } = this.selectionService;
                if (tree_widget_selection_1.TreeWidgetSelection.is(selection)) {
                    const string = widget.resultTreeWidget.nodeToString(selection[0], true);
                    if (string.length !== 0) {
                        this.clipboardService.writeText(string);
                    }
                }
            })
        });
        commands.registerCommand(SearchInWorkspaceCommands.COPY_ALL, {
            isEnabled: () => this.withWidget(undefined, widget => {
                const { selection } = this.selectionService;
                return tree_widget_selection_1.TreeWidgetSelection.isSource(selection, widget.resultTreeWidget) && selection.length > 0;
            }),
            isVisible: () => this.withWidget(undefined, widget => {
                const { selection } = this.selectionService;
                return tree_widget_selection_1.TreeWidgetSelection.isSource(selection, widget.resultTreeWidget) && selection.length > 0;
            }),
            execute: () => this.withWidget(undefined, widget => {
                const { selection } = this.selectionService;
                if (tree_widget_selection_1.TreeWidgetSelection.is(selection)) {
                    const string = widget.resultTreeWidget.treeToString();
                    if (string.length !== 0) {
                        this.clipboardService.writeText(string);
                    }
                }
            })
        });
    }
    withWidget(widget = this.tryGetWidget(), fn) {
        if (widget instanceof search_in_workspace_widget_1.SearchInWorkspaceWidget && widget.id === search_in_workspace_widget_1.SearchInWorkspaceWidget.ID) {
            return fn(widget);
        }
        return false;
    }
    /**
     * Get the search term based on current editor selection.
     * @returns the selection if available.
     */
    getSearchTerm() {
        if (!this.editorManager.currentEditor) {
            return '';
        }
        // Get the current editor selection.
        const selection = this.editorManager.currentEditor.editor.selection;
        // Compute the selection range.
        const selectedRange = vscode_languageserver_protocol_1.Range.create(selection.start.line, selection.start.character, selection.end.line, selection.end.character);
        // Return the selection text if available, else return empty.
        return this.editorManager.currentEditor
            ? this.editorManager.currentEditor.editor.document.getText(selectedRange)
            : '';
    }
    registerKeybindings(keybindings) {
        super.registerKeybindings(keybindings);
        keybindings.registerKeybinding({
            command: SearchInWorkspaceCommands.OPEN_SIW_WIDGET.id,
            keybinding: 'ctrlcmd+shift+f'
        });
        keybindings.registerKeybinding({
            command: SearchInWorkspaceCommands.FIND_IN_FOLDER.id,
            keybinding: 'shift+alt+f',
            when: 'explorerResourceIsFolder'
        });
        keybindings.registerKeybinding({
            command: SearchInWorkspaceCommands.DISMISS_RESULT.id,
            keybinding: core_1.isOSX ? 'cmd+backspace' : 'del',
            when: 'searchViewletFocus && !inputBoxFocus'
        });
        keybindings.registerKeybinding({
            command: SearchInWorkspaceCommands.REPLACE_RESULT.id,
            keybinding: 'ctrlcmd+shift+1',
            when: 'searchViewletFocus && replaceActive',
        });
        keybindings.registerKeybinding({
            command: SearchInWorkspaceCommands.REPLACE_ALL_RESULTS.id,
            keybinding: 'ctrlcmd+shift+1',
            when: 'searchViewletFocus && replaceActive',
        });
        keybindings.registerKeybinding({
            command: SearchInWorkspaceCommands.COPY_ONE.id,
            keybinding: 'ctrlcmd+c',
            when: 'searchViewletFocus && !inputBoxFocus'
        });
    }
    registerMenus(menus) {
        super.registerMenus(menus);
        menus.registerMenuAction(navigator_contribution_1.NavigatorContextMenu.SEARCH, {
            commandId: SearchInWorkspaceCommands.FIND_IN_FOLDER.id,
            when: 'explorerResourceIsFolder'
        });
        menus.registerMenuAction(browser_1.CommonMenus.EDIT_FIND, {
            commandId: SearchInWorkspaceCommands.OPEN_SIW_WIDGET.id,
            order: '2'
        });
        menus.registerMenuAction(browser_1.CommonMenus.EDIT_FIND, {
            commandId: SearchInWorkspaceCommands.REPLACE_IN_FILES.id,
            order: '3'
        });
        menus.registerMenuAction(search_in_workspace_result_tree_widget_1.SearchInWorkspaceResultTreeWidget.Menus.INTERNAL, {
            commandId: SearchInWorkspaceCommands.REPLACE_RESULT.id,
            label: core_1.nls.localizeByDefault('Replace'),
            order: '1',
            when: 'replaceActive',
        });
        menus.registerMenuAction(search_in_workspace_result_tree_widget_1.SearchInWorkspaceResultTreeWidget.Menus.INTERNAL, {
            commandId: SearchInWorkspaceCommands.REPLACE_ALL_RESULTS.id,
            label: core_1.nls.localizeByDefault('Replace All'),
            order: '1',
            when: 'replaceActive',
        });
        menus.registerMenuAction(search_in_workspace_result_tree_widget_1.SearchInWorkspaceResultTreeWidget.Menus.INTERNAL, {
            commandId: SearchInWorkspaceCommands.DISMISS_RESULT.id,
            order: '1'
        });
        menus.registerMenuAction(search_in_workspace_result_tree_widget_1.SearchInWorkspaceResultTreeWidget.Menus.COPY, {
            commandId: SearchInWorkspaceCommands.COPY_ONE.id,
            order: '1',
        });
        menus.registerMenuAction(search_in_workspace_result_tree_widget_1.SearchInWorkspaceResultTreeWidget.Menus.COPY, {
            commandId: browser_1.CommonCommands.COPY_PATH.id,
            order: '2',
        });
        menus.registerMenuAction(search_in_workspace_result_tree_widget_1.SearchInWorkspaceResultTreeWidget.Menus.COPY, {
            commandId: SearchInWorkspaceCommands.COPY_ALL.id,
            order: '3',
        });
        menus.registerMenuAction(search_in_workspace_result_tree_widget_1.SearchInWorkspaceResultTreeWidget.Menus.EXTERNAL, {
            commandId: navigator_contribution_1.FileNavigatorCommands.REVEAL_IN_NAVIGATOR.id,
            order: '1',
        });
    }
    async registerToolbarItems(toolbarRegistry) {
        const widget = await this.widget;
        const onDidChange = widget.onDidUpdate;
        toolbarRegistry.registerItem({
            id: SearchInWorkspaceCommands.CANCEL_SEARCH.id,
            command: SearchInWorkspaceCommands.CANCEL_SEARCH.id,
            tooltip: SearchInWorkspaceCommands.CANCEL_SEARCH.label,
            priority: 0,
            onDidChange
        });
        toolbarRegistry.registerItem({
            id: SearchInWorkspaceCommands.REFRESH_RESULTS.id,
            command: SearchInWorkspaceCommands.REFRESH_RESULTS.id,
            tooltip: SearchInWorkspaceCommands.REFRESH_RESULTS.label,
            priority: 1,
            onDidChange
        });
        toolbarRegistry.registerItem({
            id: SearchInWorkspaceCommands.CLEAR_ALL.id,
            command: SearchInWorkspaceCommands.CLEAR_ALL.id,
            tooltip: SearchInWorkspaceCommands.CLEAR_ALL.label,
            priority: 2,
            onDidChange
        });
        toolbarRegistry.registerItem({
            id: SearchInWorkspaceCommands.COLLAPSE_ALL.id,
            command: SearchInWorkspaceCommands.COLLAPSE_ALL.id,
            tooltip: SearchInWorkspaceCommands.COLLAPSE_ALL.label,
            priority: 3,
            onDidChange
        });
        toolbarRegistry.registerItem({
            id: SearchInWorkspaceCommands.EXPAND_ALL.id,
            command: SearchInWorkspaceCommands.EXPAND_ALL.id,
            tooltip: SearchInWorkspaceCommands.EXPAND_ALL.label,
            priority: 3,
            onDidChange
        });
    }
    newUriAwareCommandHandler(handler) {
        return uri_command_handler_1.UriAwareCommandHandler.MonoSelect(this.selectionService, handler);
    }
    newMultiUriAwareCommandHandler(handler) {
        return uri_command_handler_1.UriAwareCommandHandler.MultiSelect(this.selectionService, handler);
    }
    registerThemeStyle(theme, collector) {
        const contrastBorder = theme.getColor('contrastBorder');
        if (contrastBorder && (0, theme_1.isHighContrast)(theme.type)) {
            collector.addRule(`
                .t-siw-search-container .searchHeader .search-field-container {
                    border-color: ${contrastBorder};
                }
            `);
        }
    }
};
__decorate([
    (0, inversify_1.inject)(core_1.SelectionService),
    __metadata("design:type", core_1.SelectionService)
], SearchInWorkspaceFrontendContribution.prototype, "selectionService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.LabelProvider),
    __metadata("design:type", browser_1.LabelProvider)
], SearchInWorkspaceFrontendContribution.prototype, "labelProvider", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.WorkspaceService),
    __metadata("design:type", browser_2.WorkspaceService)
], SearchInWorkspaceFrontendContribution.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], SearchInWorkspaceFrontendContribution.prototype, "fileService", void 0);
__decorate([
    (0, inversify_1.inject)(editor_manager_1.EditorManager),
    __metadata("design:type", editor_manager_1.EditorManager)
], SearchInWorkspaceFrontendContribution.prototype, "editorManager", void 0);
__decorate([
    (0, inversify_1.inject)(clipboard_service_1.ClipboardService),
    __metadata("design:type", Object)
], SearchInWorkspaceFrontendContribution.prototype, "clipboardService", void 0);
__decorate([
    (0, inversify_1.inject)(search_in_workspace_context_key_service_1.SearchInWorkspaceContextKeyService),
    __metadata("design:type", search_in_workspace_context_key_service_1.SearchInWorkspaceContextKeyService)
], SearchInWorkspaceFrontendContribution.prototype, "contextKeyService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SearchInWorkspaceFrontendContribution.prototype, "init", null);
SearchInWorkspaceFrontendContribution = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], SearchInWorkspaceFrontendContribution);
exports.SearchInWorkspaceFrontendContribution = SearchInWorkspaceFrontendContribution;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/search-in-workspace/lib/browser/search-in-workspace-frontend-contribution'] = this;


/***/ })

}]);
//# sourceMappingURL=packages_core_shared_react-dom_client_index_js-packages_search-in-workspace_lib_browser_searc-59c104.js.map