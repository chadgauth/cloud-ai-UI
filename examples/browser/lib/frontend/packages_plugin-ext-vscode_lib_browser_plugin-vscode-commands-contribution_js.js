"use strict";
(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_plugin-ext-vscode_lib_browser_plugin-vscode-commands-contribution_js"],{

/***/ "../../packages/plugin-ext-vscode/lib/browser/plugin-vscode-commands-contribution.js":
/*!*******************************************************************************************!*\
  !*** ../../packages/plugin-ext-vscode/lib/browser/plugin-vscode-commands-contribution.js ***!
  \*******************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2018 Red Hat, Inc. and others.
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
exports.PluginVscodeCommandsContribution = exports.VscodeCommands = void 0;
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const context_key_service_1 = __webpack_require__(/*! @theia/core/lib/browser/context-key-service */ "../../packages/core/lib/browser/context-key-service.js");
const application_shell_mouse_tracker_1 = __webpack_require__(/*! @theia/core/lib/browser/shell/application-shell-mouse-tracker */ "../../packages/core/lib/browser/shell/application-shell-mouse-tracker.js");
const command_1 = __webpack_require__(/*! @theia/core/lib/common/command */ "../../packages/core/lib/common/command.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const browser_2 = __webpack_require__(/*! @theia/editor/lib/browser */ "../../packages/editor/lib/browser/index.js");
const documents_main_1 = __webpack_require__(/*! @theia/plugin-ext/lib/main/browser/documents-main */ "../../packages/plugin-ext/lib/main/browser/documents-main.js");
const type_converters_1 = __webpack_require__(/*! @theia/plugin-ext/lib/plugin/type-converters */ "../../packages/plugin-ext/lib/plugin/type-converters.js");
const browser_3 = __webpack_require__(/*! @theia/workspace/lib/browser */ "../../packages/workspace/lib/browser/index.js");
const workspace_service_1 = __webpack_require__(/*! @theia/workspace/lib/browser/workspace-service */ "../../packages/workspace/lib/browser/workspace-service.js");
const diff_service_1 = __webpack_require__(/*! @theia/workspace/lib/browser/diff-service */ "../../packages/workspace/lib/browser/diff-service.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const vscode_uri_1 = __webpack_require__(/*! @theia/core/shared/vscode-uri */ "../../packages/core/shared/vscode-uri/index.js");
const plugin_protocol_1 = __webpack_require__(/*! @theia/plugin-ext/lib/common/plugin-protocol */ "../../packages/plugin-ext/lib/common/plugin-protocol.js");
const terminal_frontend_contribution_1 = __webpack_require__(/*! @theia/terminal/lib/browser/terminal-frontend-contribution */ "../../packages/terminal/lib/browser/terminal-frontend-contribution.js");
const quick_open_workspace_1 = __webpack_require__(/*! @theia/workspace/lib/browser/quick-open-workspace */ "../../packages/workspace/lib/browser/quick-open-workspace.js");
const terminal_service_1 = __webpack_require__(/*! @theia/terminal/lib/browser/base/terminal-service */ "../../packages/terminal/lib/browser/base/terminal-service.js");
const navigator_contribution_1 = __webpack_require__(/*! @theia/navigator/lib/browser/navigator-contribution */ "../../packages/navigator/lib/browser/navigator-contribution.js");
const browser_4 = __webpack_require__(/*! @theia/navigator/lib/browser */ "../../packages/navigator/lib/browser/index.js");
const tree_selection_1 = __webpack_require__(/*! @theia/core/lib/browser/tree/tree-selection */ "../../packages/core/lib/browser/tree/tree-selection.js");
const file_service_1 = __webpack_require__(/*! @theia/filesystem/lib/browser/file-service */ "../../packages/filesystem/lib/browser/file-service.js");
const browser_5 = __webpack_require__(/*! @theia/callhierarchy/lib/browser */ "../../packages/callhierarchy/lib/browser/index.js");
const browser_6 = __webpack_require__(/*! @theia/typehierarchy/lib/browser */ "../../packages/typehierarchy/lib/browser/index.js");
const monaco_text_model_service_1 = __webpack_require__(/*! @theia/monaco/lib/browser/monaco-text-model-service */ "../../packages/monaco/lib/browser/monaco-text-model-service.js");
const hierarchy_types_converters_1 = __webpack_require__(/*! @theia/plugin-ext/lib/main/browser/hierarchy/hierarchy-types-converters */ "../../packages/plugin-ext/lib/main/browser/hierarchy/hierarchy-types-converters.js");
const custom_editor_opener_1 = __webpack_require__(/*! @theia/plugin-ext/lib/main/browser/custom-editors/custom-editor-opener */ "../../packages/plugin-ext/lib/main/browser/custom-editors/custom-editor-opener.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
const window_service_1 = __webpack_require__(/*! @theia/core/lib/browser/window/window-service */ "../../packages/core/lib/browser/window/window-service.js");
const monaco = __webpack_require__(/*! @theia/monaco-editor-core */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/editor.main.js");
const plugin_vscode_uri_1 = __webpack_require__(/*! ../common/plugin-vscode-uri */ "../../packages/plugin-ext-vscode/lib/common/plugin-vscode-uri.js");
const vscode_theia_menu_mappings_1 = __webpack_require__(/*! @theia/plugin-ext/lib/main/browser/menus/vscode-theia-menu-mappings */ "../../packages/plugin-ext/lib/main/browser/menus/vscode-theia-menu-mappings.js");
var VscodeCommands;
(function (VscodeCommands) {
    VscodeCommands.OPEN = {
        id: 'vscode.open'
    };
    VscodeCommands.OPEN_WITH = {
        id: 'vscode.openWith'
    };
    VscodeCommands.OPEN_FOLDER = {
        id: 'vscode.openFolder'
    };
    VscodeCommands.DIFF = {
        id: 'vscode.diff'
    };
    VscodeCommands.INSTALL_FROM_VSIX = {
        id: 'workbench.extensions.installExtension'
    };
})(VscodeCommands = exports.VscodeCommands || (exports.VscodeCommands = {}));
let PluginVscodeCommandsContribution = class PluginVscodeCommandsContribution {
    async openWith(commandId, resource, columnOrOptions, openerId) {
        if (!resource) {
            throw new Error(`${commandId} command requires at least URI argument.`);
        }
        if (!vscode_uri_1.URI.isUri(resource)) {
            throw new Error(`Invalid argument for ${commandId} command with URI argument. Found ${resource}`);
        }
        let options;
        if (typeof columnOrOptions === 'number') {
            options = {
                viewColumn: columnOrOptions
            };
        }
        else if (columnOrOptions) {
            options = {
                ...columnOrOptions
            };
        }
        const uri = new uri_1.default(resource);
        const editorOptions = documents_main_1.DocumentsMainImpl.toEditorOpenerOptions(this.shell, options);
        let openHandler;
        if (typeof openerId === 'string') {
            const lowerViewType = openerId.toLowerCase();
            const openers = await this.openerService.getOpeners();
            for (const opener of openers) {
                const idLowerCase = opener.id.toLowerCase();
                if (lowerViewType === idLowerCase) {
                    openHandler = opener;
                    break;
                }
            }
        }
        else {
            openHandler = await this.openerService.getOpener(uri, editorOptions);
        }
        if (openHandler) {
            await openHandler.open(uri, editorOptions);
            return true;
        }
        return false;
    }
    registerCommands(commands) {
        commands.registerCommand(VscodeCommands.OPEN, {
            isVisible: () => false,
            execute: async (resource, columnOrOptions) => {
                try {
                    await this.openWith(VscodeCommands.OPEN.id, resource, columnOrOptions);
                }
                catch (error) {
                    const message = nls_1.nls.localizeByDefault("Unable to open '{0}'", resource.path);
                    const reason = nls_1.nls.localizeByDefault('Error: {0}', error.message);
                    this.messageService.error(`${message}\n${reason}`);
                    console.warn(error);
                }
            }
        });
        commands.registerCommand(VscodeCommands.OPEN_WITH, {
            isVisible: () => false,
            execute: async (resource, viewType, columnOrOptions) => {
                if (!viewType) {
                    throw new Error(`Running the contributed command: ${VscodeCommands.OPEN_WITH} failed.`);
                }
                if (viewType.toLowerCase() === 'default') {
                    return commands.executeCommand(VscodeCommands.OPEN.id, resource, columnOrOptions);
                }
                let result = await this.openWith(VscodeCommands.OPEN_WITH.id, resource, columnOrOptions, viewType);
                if (!result) {
                    result = await this.openWith(VscodeCommands.OPEN_WITH.id, resource, columnOrOptions, custom_editor_opener_1.CustomEditorOpener.toCustomEditorId(viewType));
                }
                if (!result) {
                    throw new Error(`Could not find an editor for '${viewType}'`);
                }
            }
        });
        commands.registerCommand(VscodeCommands.OPEN_FOLDER, {
            isVisible: () => false,
            execute: async (resource, arg = {}) => {
                if (!resource) {
                    return commands.executeCommand(browser_3.WorkspaceCommands.OPEN_WORKSPACE.id);
                }
                if (!vscode_uri_1.URI.isUri(resource)) {
                    throw new Error(`Invalid argument for ${VscodeCommands.OPEN_FOLDER.id} command with URI argument. Found ${resource}`);
                }
                let options;
                if (typeof arg === 'boolean') {
                    options = { preserveWindow: !arg };
                }
                else {
                    options = { preserveWindow: !arg.forceNewWindow };
                }
                this.workspaceService.open(new uri_1.default(resource), options);
            }
        });
        commands.registerCommand(VscodeCommands.DIFF, {
            isVisible: () => false,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            execute: async (left, right, label, options) => {
                if (!left || !right) {
                    throw new Error(`${VscodeCommands.DIFF} command requires at least two URI arguments. Found left=${left}, right=${right} as arguments`);
                }
                if (!vscode_uri_1.URI.isUri(left)) {
                    throw new Error(`Invalid argument for ${VscodeCommands.DIFF.id} command with left argument. Expecting URI left type but found ${left}`);
                }
                if (!vscode_uri_1.URI.isUri(right)) {
                    throw new Error(`Invalid argument for ${VscodeCommands.DIFF.id} command with right argument. Expecting URI right type but found ${right}`);
                }
                const leftURI = new uri_1.default(left);
                const editorOptions = documents_main_1.DocumentsMainImpl.toEditorOpenerOptions(this.shell, options);
                await this.diffService.openDiffEditor(leftURI, new uri_1.default(right), label, editorOptions);
            }
        });
        // https://code.visualstudio.com/docs/getstarted/keybindings#_navigation
        /*
         * internally, in VS Code, any widget opened in the main area is represented as an editor
         * operations below apply to them, but not to side-bar widgets, like the explorer
         *
         * in Theia, there are not such difference and any widget can be put in any area
         * because of it we filter out editors from views based on `NavigatableWidget.is`
         * and apply actions only to them
         */
        if (!core_1.environment.electron.is() || core_1.isOSX) {
            commands.registerCommand({ id: 'workbench.action.files.openFileFolder' }, {
                execute: () => commands.executeCommand(browser_3.WorkspaceCommands.OPEN.id)
            });
        }
        commands.registerCommand({ id: 'workbench.action.files.openFile' }, {
            execute: () => commands.executeCommand(browser_3.WorkspaceCommands.OPEN_FILE.id)
        });
        commands.registerCommand({ id: 'workbench.action.files.openFolder' }, {
            execute: () => commands.executeCommand(browser_3.WorkspaceCommands.OPEN_FOLDER.id)
        });
        commands.registerCommand({ id: 'workbench.action.addRootFolder' }, {
            execute: () => commands.executeCommand(browser_3.WorkspaceCommands.ADD_FOLDER.id)
        });
        commands.registerCommand({ id: 'workbench.action.saveWorkspaceAs' }, {
            execute: () => commands.executeCommand(browser_3.WorkspaceCommands.SAVE_WORKSPACE_AS.id)
        });
        commands.registerCommand({ id: 'workbench.action.gotoLine' }, {
            execute: () => commands.executeCommand(browser_2.EditorCommands.GOTO_LINE_COLUMN.id)
        });
        commands.registerCommand({ id: 'workbench.action.quickOpen' }, {
            execute: (prefix) => this.quickInput.open(typeof prefix === 'string' ? prefix : '')
        });
        commands.registerCommand({ id: 'workbench.action.openSettings' }, {
            execute: (query) => commands.executeCommand(browser_1.CommonCommands.OPEN_PREFERENCES.id, query)
        });
        commands.registerCommand({ id: 'workbench.action.openWorkspaceConfigFile' }, {
            execute: () => commands.executeCommand(browser_3.WorkspaceCommands.OPEN_WORKSPACE_FILE.id)
        });
        commands.registerCommand({ id: 'workbench.files.action.refreshFilesExplorer' }, {
            execute: () => commands.executeCommand(navigator_contribution_1.FileNavigatorCommands.REFRESH_NAVIGATOR.id)
        });
        commands.registerCommand({ id: VscodeCommands.INSTALL_FROM_VSIX.id }, {
            execute: async (vsixUriOrExtensionId) => {
                if (typeof vsixUriOrExtensionId === 'string') {
                    await this.pluginServer.deploy(plugin_vscode_uri_1.VSCodeExtensionUri.toVsxExtensionUriString(vsixUriOrExtensionId));
                }
                else {
                    const uriPath = (0, type_converters_1.isUriComponents)(vsixUriOrExtensionId) ? vscode_uri_1.URI.revive(vsixUriOrExtensionId).fsPath : await this.fileService.fsPath(vsixUriOrExtensionId);
                    await this.pluginServer.deploy(`local-file:${uriPath}`);
                }
            }
        });
        commands.registerCommand({ id: 'workbench.action.files.save', }, {
            execute: (uri) => {
                if (uri) {
                    const uriString = uri.toString();
                    const widget = this.shell.widgets.find(w => {
                        const resourceUri = browser_1.Saveable.is(w) && browser_1.NavigatableWidget.is(w) && w.getResourceUri();
                        return (resourceUri && resourceUri.toString()) === uriString;
                    });
                    if (browser_1.Saveable.is(widget)) {
                        browser_1.Saveable.save(widget);
                    }
                }
                else {
                    this.shell.save();
                }
            }
        });
        commands.registerCommand({ id: 'workbench.action.files.saveAll', }, {
            execute: () => this.shell.saveAll()
        });
        commands.registerCommand({ id: 'workbench.action.closeActiveEditor' }, {
            execute: () => commands.executeCommand(browser_1.CommonCommands.CLOSE_MAIN_TAB.id)
        });
        commands.registerCommand({ id: 'workbench.action.closeOtherEditors' }, {
            execute: async (uri) => {
                let editor = this.editorManager.currentEditor || this.shell.currentWidget;
                if (uri) {
                    const uriString = uri.toString();
                    editor = this.editorManager.all.find(e => {
                        const resourceUri = e.getResourceUri();
                        return (resourceUri && resourceUri.toString()) === uriString;
                    });
                }
                const toClose = this.shell.widgets.filter(widget => widget !== editor && this.codeEditorWidgetUtil.is(widget));
                await this.shell.closeMany(toClose);
            }
        });
        const performActionOnGroup = (cb, uri) => {
            let editor = this.editorManager.currentEditor || this.shell.currentWidget;
            if (uri) {
                const uriString = uri.toString();
                editor = this.editorManager.all.find(e => {
                    const resourceUri = e.getResourceUri();
                    return (resourceUri && resourceUri.toString()) === uriString;
                });
            }
            if (editor) {
                const tabBar = this.shell.getTabBarFor(editor);
                if (tabBar) {
                    cb(tabBar, ({ owner }) => this.codeEditorWidgetUtil.is(owner));
                }
            }
        };
        commands.registerCommand({
            id: 'workbench.action.closeEditorsInGroup',
            label: nls_1.nls.localizeByDefault('Close All Editors in Group')
        }, {
            execute: (uri) => performActionOnGroup(this.shell.closeTabs, uri)
        });
        commands.registerCommand({
            id: 'workbench.files.saveAllInGroup',
            label: nls_1.nls.localizeByDefault('Save All in Group')
        }, {
            execute: (uri) => performActionOnGroup(this.shell.saveTabs, uri)
        });
        commands.registerCommand({ id: 'workbench.action.closeEditorsInOtherGroups' }, {
            execute: () => {
                const editor = this.editorManager.currentEditor || this.shell.currentWidget;
                if (editor) {
                    const editorTabBar = this.shell.getTabBarFor(editor);
                    for (const tabBar of this.shell.allTabBars) {
                        if (tabBar !== editorTabBar) {
                            this.shell.closeTabs(tabBar, ({ owner }) => this.codeEditorWidgetUtil.is(owner));
                        }
                    }
                }
            }
        });
        commands.registerCommand({ id: 'workbench.action.closeEditorsToTheLeft' }, {
            execute: () => {
                const editor = this.editorManager.currentEditor || this.shell.currentWidget;
                if (editor) {
                    const tabBar = this.shell.getTabBarFor(editor);
                    if (tabBar) {
                        let left = true;
                        this.shell.closeTabs(tabBar, ({ owner }) => {
                            if (owner === editor) {
                                left = false;
                                return false;
                            }
                            return left && this.codeEditorWidgetUtil.is(owner);
                        });
                    }
                }
            }
        });
        commands.registerCommand({ id: 'workbench.action.closeEditorsToTheRight' }, {
            execute: () => {
                const editor = this.editorManager.currentEditor || this.shell.currentWidget;
                if (editor) {
                    const tabBar = this.shell.getTabBarFor(editor);
                    if (tabBar) {
                        let left = true;
                        this.shell.closeTabs(tabBar, ({ owner }) => {
                            if (owner === editor) {
                                left = false;
                                return false;
                            }
                            return !left && this.codeEditorWidgetUtil.is(owner);
                        });
                    }
                }
            }
        });
        commands.registerCommand({ id: 'workbench.action.closeAllEditors' }, {
            execute: async () => {
                const toClose = this.shell.widgets.filter(widget => this.codeEditorWidgetUtil.is(widget));
                await this.shell.closeMany(toClose);
            }
        });
        commands.registerCommand({ id: 'workbench.action.nextEditor' }, {
            execute: () => this.shell.activateNextTab()
        });
        commands.registerCommand({ id: 'workbench.action.previousEditor' }, {
            execute: () => this.shell.activatePreviousTab()
        });
        commands.registerCommand({ id: 'workbench.action.navigateBack' }, {
            execute: () => commands.executeCommand(browser_2.EditorCommands.GO_BACK.id)
        });
        commands.registerCommand({ id: 'workbench.action.navigateForward' }, {
            execute: () => commands.executeCommand(browser_2.EditorCommands.GO_FORWARD.id)
        });
        commands.registerCommand({ id: 'workbench.action.navigateToLastEditLocation' }, {
            execute: () => commands.executeCommand(browser_2.EditorCommands.GO_LAST_EDIT.id)
        });
        commands.registerCommand({ id: 'openInTerminal' }, {
            execute: (resource) => this.terminalContribution.openInTerminal(new uri_1.default(resource.toString()))
        });
        commands.registerCommand({ id: 'workbench.action.reloadWindow' }, {
            execute: () => {
                this.windowService.reload();
            }
        });
        /**
         * TODO:
         * Open Next: workbench.action.openNextRecentlyUsedEditorInGroup
         * Open Previous: workbench.action.openPreviousRecentlyUsedEditorInGroup
         * Copy Path of Active File: workbench.action.files.copyPathOfActiveFile
         * Reveal Active File in Windows: workbench.action.files.revealActiveFileInWindows
         * Show Opened File in New Window: workbench.action.files.showOpenedFileInNewWindow
         * Compare Opened File With: workbench.files.action.compareFileWith
         */
        // Register built-in language service commands
        // see https://code.visualstudio.com/api/references/commands
        /* eslint-disable @typescript-eslint/no-explicit-any */
        // TODO register other `vscode.execute...` commands.
        // see https://github.com/microsoft/vscode/blob/master/src/vs/workbench/api/common/extHostApiCommands.ts
        commands.registerCommand({
            id: 'vscode.executeDefinitionProvider'
        }, {
            execute: ((resource, position) => commands.executeCommand('_executeDefinitionProvider', monaco.Uri.from(resource), position))
        });
        commands.registerCommand({
            id: 'vscode.executeDeclarationProvider'
        }, {
            execute: ((resource, position) => commands.executeCommand('_executeDeclarationProvider', monaco.Uri.from(resource), position))
        });
        commands.registerCommand({
            id: 'vscode.executeTypeDefinitionProvider'
        }, {
            execute: ((resource, position) => commands.executeCommand('_executeTypeDefinitionProvider', monaco.Uri.from(resource), position))
        });
        commands.registerCommand({
            id: 'vscode.executeImplementationProvider'
        }, {
            execute: ((resource, position) => commands.executeCommand('_executeImplementationProvider', monaco.Uri.from(resource), position))
        });
        commands.registerCommand({
            id: 'vscode.executeHoverProvider'
        }, {
            execute: ((resource, position) => commands.executeCommand('_executeHoverProvider', monaco.Uri.from(resource), position))
        });
        commands.registerCommand({
            id: 'vscode.executeDocumentHighlights'
        }, {
            execute: ((resource, position) => commands.executeCommand('_executeDocumentHighlights', monaco.Uri.from(resource), position))
        });
        commands.registerCommand({
            id: 'vscode.executeReferenceProvider'
        }, {
            execute: ((resource, position) => commands.executeCommand('_executeReferenceProvider', monaco.Uri.from(resource), position))
        });
        commands.registerCommand({
            id: 'vscode.executeDocumentSymbolProvider'
        }, {
            execute: (resource) => commands.executeCommand('_executeDocumentSymbolProvider', monaco.Uri.parse(resource.toString())).then((value) => {
                if (!Array.isArray(value) || value === undefined) {
                    return undefined;
                }
                return value.map(loc => (0, type_converters_1.toDocumentSymbol)(loc));
            })
        });
        commands.registerCommand({
            id: 'vscode.executeFormatDocumentProvider'
        }, {
            execute: ((resource, options) => commands.executeCommand('_executeFormatDocumentProvider', monaco.Uri.from(resource), options))
        });
        commands.registerCommand({
            id: 'vscode.executeFormatRangeProvider'
        }, {
            execute: ((resource, range, options) => commands.executeCommand('_executeFormatRangeProvider', monaco.Uri.from(resource), range, options))
        });
        commands.registerCommand({
            id: 'vscode.executeFormatOnTypeProvider'
        }, {
            execute: ((resource, position, ch, options) => commands.executeCommand('_executeFormatOnTypeProvider', monaco.Uri.from(resource), position, ch, options))
        });
        commands.registerCommand({
            id: 'vscode.prepareCallHierarchy'
        }, {
            execute: async (resource, position) => {
                const provider = await this.getCallHierarchyServiceForUri(resource);
                const definition = await (provider === null || provider === void 0 ? void 0 : provider.getRootDefinition(resource.path, (0, type_converters_1.toPosition)(position), new core_1.CancellationTokenSource().token));
                if (definition) {
                    return definition.items.map(item => (0, hierarchy_types_converters_1.fromItemHierarchyDefinition)(item));
                }
                ;
                return [];
            }
        });
        commands.registerCommand({
            id: 'vscode.provideIncomingCalls'
        }, {
            execute: async (item) => {
                const resource = vscode_uri_1.URI.from(item.uri);
                const provider = await this.getCallHierarchyServiceForUri(resource);
                const incomingCalls = await (provider === null || provider === void 0 ? void 0 : provider.getCallers((0, hierarchy_types_converters_1.toItemHierarchyDefinition)(item), new core_1.CancellationTokenSource().token));
                if (incomingCalls) {
                    return incomingCalls.map(hierarchy_types_converters_1.fromCallHierarchyCallerToModelCallHierarchyIncomingCall);
                }
                return [];
            },
        });
        commands.registerCommand({
            id: 'vscode.provideOutgoingCalls'
        }, {
            execute: async (item) => {
                var _a;
                const resource = vscode_uri_1.URI.from(item.uri);
                const provider = await this.getCallHierarchyServiceForUri(resource);
                const outgoingCalls = await ((_a = provider === null || provider === void 0 ? void 0 : provider.getCallees) === null || _a === void 0 ? void 0 : _a.call(provider, (0, hierarchy_types_converters_1.toItemHierarchyDefinition)(item), new core_1.CancellationTokenSource().token));
                if (outgoingCalls) {
                    return outgoingCalls.map(hierarchy_types_converters_1.fromCallHierarchyCalleeToModelCallHierarchyOutgoingCall);
                }
                return [];
            }
        });
        commands.registerCommand({
            id: 'vscode.prepareTypeHierarchy'
        }, {
            execute: async (resource, position) => {
                const provider = await this.getTypeHierarchyServiceForUri(resource);
                const session = await (provider === null || provider === void 0 ? void 0 : provider.prepareSession(resource.path, (0, type_converters_1.toPosition)(position), new core_1.CancellationTokenSource().token));
                return session ? session.items.map(item => (0, hierarchy_types_converters_1.fromItemHierarchyDefinition)(item)) : [];
            }
        });
        commands.registerCommand({
            id: 'vscode.provideSupertypes'
        }, {
            execute: async (item) => {
                if (!item._sessionId || !item._itemId) {
                    return [];
                }
                const resource = vscode_uri_1.URI.from(item.uri);
                const provider = await this.getTypeHierarchyServiceForUri(resource);
                const items = await (provider === null || provider === void 0 ? void 0 : provider.provideSuperTypes(item._sessionId, item._itemId, new core_1.CancellationTokenSource().token));
                return (items ? items : []).map(typeItem => (0, hierarchy_types_converters_1.fromItemHierarchyDefinition)(typeItem));
            }
        });
        commands.registerCommand({
            id: 'vscode.provideSubtypes'
        }, {
            execute: async (item) => {
                if (!item._sessionId || !item._itemId) {
                    return [];
                }
                const resource = vscode_uri_1.URI.from(item.uri);
                const provider = await this.getTypeHierarchyServiceForUri(resource);
                const items = await (provider === null || provider === void 0 ? void 0 : provider.provideSubTypes(item._sessionId, item._itemId, new core_1.CancellationTokenSource().token));
                return (items ? items : []).map(typeItem => (0, hierarchy_types_converters_1.fromItemHierarchyDefinition)(typeItem));
            }
        });
        commands.registerCommand({
            id: 'workbench.action.openRecent'
        }, {
            execute: () => this.quickOpenWorkspace.select()
        });
        commands.registerCommand({
            id: 'explorer.newFolder'
        }, {
            execute: () => commands.executeCommand(browser_3.WorkspaceCommands.NEW_FOLDER.id)
        });
        commands.registerCommand({
            id: 'workbench.action.terminal.sendSequence'
        }, {
            execute: (args) => {
                if (args === undefined || args.text === undefined) {
                    return;
                }
                const currentTerminal = this.terminalService.currentTerminal;
                if (currentTerminal === undefined) {
                    return;
                }
                currentTerminal.sendText(args.text);
            }
        });
        commands.registerCommand({
            id: 'workbench.action.terminal.kill'
        }, {
            execute: () => {
                const currentTerminal = this.terminalService.currentTerminal;
                if (currentTerminal === undefined) {
                    return;
                }
                currentTerminal.dispose();
            }
        });
        commands.registerCommand({
            id: 'workbench.view.explorer'
        }, {
            execute: () => commands.executeCommand(navigator_contribution_1.FileNavigatorCommands.FOCUS.id)
        });
        commands.registerCommand({
            id: 'copyFilePath'
        }, {
            execute: () => commands.executeCommand(browser_1.CommonCommands.COPY_PATH.id)
        });
        commands.registerCommand({
            id: 'copyRelativeFilePath'
        }, {
            execute: () => commands.executeCommand(browser_3.WorkspaceCommands.COPY_RELATIVE_FILE_PATH.id)
        });
        commands.registerCommand({
            id: 'revealInExplorer'
        }, {
            execute: async (resource) => {
                if (!vscode_uri_1.URI.isUri(resource)) {
                    return;
                }
                let navigator = await this.shell.revealWidget(browser_4.FILE_NAVIGATOR_ID);
                if (!navigator) {
                    await this.commandService.executeCommand(navigator_contribution_1.FILE_NAVIGATOR_TOGGLE_COMMAND_ID);
                    navigator = await this.shell.revealWidget(browser_4.FILE_NAVIGATOR_ID);
                }
                if (navigator instanceof browser_4.FileNavigatorWidget) {
                    const model = navigator.model;
                    const node = await model.revealFile(new uri_1.default(resource));
                    if (tree_selection_1.SelectableTreeNode.is(node)) {
                        model.selectNode(node);
                    }
                }
            }
        });
        commands.registerCommand({
            id: 'workbench.experimental.requestUsbDevice'
        }, {
            execute: async (options) => {
                var _a;
                const usb = navigator.usb;
                if (!usb) {
                    return undefined;
                }
                const device = await usb.requestDevice({ filters: (_a = options === null || options === void 0 ? void 0 : options.filters) !== null && _a !== void 0 ? _a : [] });
                if (!device) {
                    return undefined;
                }
                return {
                    deviceClass: device.deviceClass,
                    deviceProtocol: device.deviceProtocol,
                    deviceSubclass: device.deviceSubclass,
                    deviceVersionMajor: device.deviceVersionMajor,
                    deviceVersionMinor: device.deviceVersionMinor,
                    deviceVersionSubminor: device.deviceVersionSubminor,
                    manufacturerName: device.manufacturerName,
                    productId: device.productId,
                    productName: device.productName,
                    serialNumber: device.serialNumber,
                    usbVersionMajor: device.usbVersionMajor,
                    usbVersionMinor: device.usbVersionMinor,
                    usbVersionSubminor: device.usbVersionSubminor,
                    vendorId: device.vendorId,
                };
            }
        });
        commands.registerCommand({
            id: 'workbench.experimental.requestSerialPort'
        }, {
            execute: async (options) => {
                var _a;
                const serial = navigator.serial;
                if (!serial) {
                    return undefined;
                }
                const port = await serial.requestPort({ filters: (_a = options === null || options === void 0 ? void 0 : options.filters) !== null && _a !== void 0 ? _a : [] });
                if (!port) {
                    return undefined;
                }
                const info = port.getInfo();
                return {
                    usbVendorId: info.usbVendorId,
                    usbProductId: info.usbProductId
                };
            }
        });
        commands.registerCommand({
            id: 'workbench.experimental.requestHidDevice'
        }, {
            execute: async (options) => {
                var _a;
                const hid = navigator.hid;
                if (!hid) {
                    return undefined;
                }
                const devices = await hid.requestDevice({ filters: (_a = options === null || options === void 0 ? void 0 : options.filters) !== null && _a !== void 0 ? _a : [] });
                if (!devices.length) {
                    return undefined;
                }
                const device = devices[0];
                return {
                    opened: device.opened,
                    vendorId: device.vendorId,
                    productId: device.productId,
                    productName: device.productName,
                    collections: device.collections
                };
            }
        });
    }
    async resolveLanguageId(resource) {
        const reference = await this.textModelService.createModelReference(resource);
        const languageId = reference.object.languageId;
        reference.dispose();
        return languageId;
    }
    async getCallHierarchyServiceForUri(resource) {
        const languageId = await this.resolveLanguageId(resource);
        return this.callHierarchyProvider.get(languageId, new uri_1.default(resource));
    }
    async getTypeHierarchyServiceForUri(resource) {
        const languageId = await this.resolveLanguageId(resource);
        return this.typeHierarchyProvider.get(languageId, new uri_1.default(resource));
    }
};
__decorate([
    (0, inversify_1.inject)(command_1.CommandService),
    __metadata("design:type", Object)
], PluginVscodeCommandsContribution.prototype, "commandService", void 0);
__decorate([
    (0, inversify_1.inject)(context_key_service_1.ContextKeyService),
    __metadata("design:type", Object)
], PluginVscodeCommandsContribution.prototype, "contextKeyService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.EditorManager),
    __metadata("design:type", browser_2.EditorManager)
], PluginVscodeCommandsContribution.prototype, "editorManager", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.ApplicationShell),
    __metadata("design:type", browser_1.ApplicationShell)
], PluginVscodeCommandsContribution.prototype, "shell", void 0);
__decorate([
    (0, inversify_1.inject)(diff_service_1.DiffService),
    __metadata("design:type", diff_service_1.DiffService)
], PluginVscodeCommandsContribution.prototype, "diffService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.OpenerService),
    __metadata("design:type", Object)
], PluginVscodeCommandsContribution.prototype, "openerService", void 0);
__decorate([
    (0, inversify_1.inject)(application_shell_mouse_tracker_1.ApplicationShellMouseTracker),
    __metadata("design:type", application_shell_mouse_tracker_1.ApplicationShellMouseTracker)
], PluginVscodeCommandsContribution.prototype, "mouseTracker", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.QuickInputService),
    (0, inversify_1.optional)(),
    __metadata("design:type", Object)
], PluginVscodeCommandsContribution.prototype, "quickInput", void 0);
__decorate([
    (0, inversify_1.inject)(workspace_service_1.WorkspaceService),
    __metadata("design:type", workspace_service_1.WorkspaceService)
], PluginVscodeCommandsContribution.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(terminal_frontend_contribution_1.TerminalFrontendContribution),
    __metadata("design:type", terminal_frontend_contribution_1.TerminalFrontendContribution)
], PluginVscodeCommandsContribution.prototype, "terminalContribution", void 0);
__decorate([
    (0, inversify_1.inject)(quick_open_workspace_1.QuickOpenWorkspace),
    __metadata("design:type", quick_open_workspace_1.QuickOpenWorkspace)
], PluginVscodeCommandsContribution.prototype, "quickOpenWorkspace", void 0);
__decorate([
    (0, inversify_1.inject)(terminal_service_1.TerminalService),
    __metadata("design:type", Object)
], PluginVscodeCommandsContribution.prototype, "terminalService", void 0);
__decorate([
    (0, inversify_1.inject)(vscode_theia_menu_mappings_1.CodeEditorWidgetUtil),
    __metadata("design:type", vscode_theia_menu_mappings_1.CodeEditorWidgetUtil)
], PluginVscodeCommandsContribution.prototype, "codeEditorWidgetUtil", void 0);
__decorate([
    (0, inversify_1.inject)(plugin_protocol_1.PluginServer),
    __metadata("design:type", Object)
], PluginVscodeCommandsContribution.prototype, "pluginServer", void 0);
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], PluginVscodeCommandsContribution.prototype, "fileService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_5.CallHierarchyServiceProvider),
    __metadata("design:type", browser_5.CallHierarchyServiceProvider)
], PluginVscodeCommandsContribution.prototype, "callHierarchyProvider", void 0);
__decorate([
    (0, inversify_1.inject)(browser_6.TypeHierarchyServiceProvider),
    __metadata("design:type", browser_6.TypeHierarchyServiceProvider)
], PluginVscodeCommandsContribution.prototype, "typeHierarchyProvider", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_text_model_service_1.MonacoTextModelService),
    __metadata("design:type", monaco_text_model_service_1.MonacoTextModelService)
], PluginVscodeCommandsContribution.prototype, "textModelService", void 0);
__decorate([
    (0, inversify_1.inject)(window_service_1.WindowService),
    __metadata("design:type", Object)
], PluginVscodeCommandsContribution.prototype, "windowService", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.MessageService),
    __metadata("design:type", core_1.MessageService)
], PluginVscodeCommandsContribution.prototype, "messageService", void 0);
PluginVscodeCommandsContribution = __decorate([
    (0, inversify_1.injectable)()
], PluginVscodeCommandsContribution);
exports.PluginVscodeCommandsContribution = PluginVscodeCommandsContribution;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext-vscode/lib/browser/plugin-vscode-commands-contribution'] = this;


/***/ })

}]);
//# sourceMappingURL=packages_plugin-ext-vscode_lib_browser_plugin-vscode-commands-contribution_js.js.map