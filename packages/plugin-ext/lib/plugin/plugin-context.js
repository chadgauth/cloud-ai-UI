"use strict";
// *****************************************************************************
// Copyright (C) 2018-2022 Red Hat, Inc. and others.
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
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Plugin_pluginManager, _PluginExt_pluginManager;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginExt = exports.Plugin = exports.createAPIFactory = void 0;
const command_registry_1 = require("./command-registry");
const event_1 = require("@theia/core/lib/common/event");
const cancellation_1 = require("@theia/core/lib/common/cancellation");
const quick_open_1 = require("./quick-open");
const plugin_api_rpc_1 = require("../common/plugin-api-rpc");
const status_bar_message_registry_1 = require("./status-bar-message-registry");
const window_state_1 = require("./window-state");
const types_impl_1 = require("./types-impl");
const authentication_ext_1 = require("./authentication-ext");
const plugin_api_rpc_model_1 = require("../common/plugin-api-rpc-model");
const text_editors_1 = require("./text-editors");
const documents_1 = require("./documents");
const editor_options_1 = require("../common/editor-options");
const output_channel_registry_1 = require("./output-channel-registry");
const terminal_ext_1 = require("./terminal-ext");
const languages_1 = require("./languages");
const type_converters_1 = require("./type-converters");
const dialogs_1 = require("./dialogs");
const notification_1 = require("./notification");
const language_selector_1 = require("@theia/editor/lib/common/language-selector");
const markdown_string_1 = require("./markdown-string");
const tree_views_1 = require("./tree/tree-views");
const connection_1 = require("../common/connection");
const tasks_1 = require("./tasks/tasks");
const file_system_ext_impl_1 = require("./file-system-ext-impl");
const scm_1 = require("./scm");
const decorations_1 = require("./decorations");
const file_system_event_service_ext_impl_1 = require("./file-system-event-service-ext-impl");
const label_service_1 = require("../plugin/label-service");
const tests_api_1 = require("./stubs/tests-api");
const timeline_1 = require("./timeline");
const theming_1 = require("./theming");
const comments_1 = require("./comments");
const custom_editors_1 = require("./custom-editors");
const webview_views_1 = require("./webview-views");
const common_1 = require("../common");
const endpoint_1 = require("@theia/core/lib/browser/endpoint");
const files_1 = require("@theia/filesystem/lib/common/files");
const tabs_1 = require("./tabs");
const notebooks_1 = require("./notebook/notebooks");
const telemetry_ext_1 = require("./telemetry-ext");
const notebook_document_1 = require("./notebook/notebook-document");
const notebook_renderers_1 = require("./notebook/notebook-renderers");
const notebook_kernels_1 = require("./notebook/notebook-kernels");
const notebook_documents_1 = require("./notebook/notebook-documents");
const notebook_editors_1 = require("./notebook/notebook-editors");
function createAPIFactory(rpc, pluginManager, envExt, debugExt, preferenceRegistryExt, editorsAndDocumentsExt, workspaceExt, messageRegistryExt, clipboard, webviewExt, localizationExt) {
    const authenticationExt = rpc.set(plugin_api_rpc_1.MAIN_RPC_CONTEXT.AUTHENTICATION_EXT, new authentication_ext_1.AuthenticationExtImpl(rpc));
    const commandRegistry = rpc.set(plugin_api_rpc_1.MAIN_RPC_CONTEXT.COMMAND_REGISTRY_EXT, new command_registry_1.CommandRegistryImpl(rpc));
    const quickOpenExt = rpc.set(plugin_api_rpc_1.MAIN_RPC_CONTEXT.QUICK_OPEN_EXT, new quick_open_1.QuickOpenExtImpl(rpc));
    const dialogsExt = new dialogs_1.DialogsExtImpl(rpc);
    const windowStateExt = rpc.set(plugin_api_rpc_1.MAIN_RPC_CONTEXT.WINDOW_STATE_EXT, new window_state_1.WindowStateExtImpl(rpc));
    const notificationExt = rpc.set(plugin_api_rpc_1.MAIN_RPC_CONTEXT.NOTIFICATION_EXT, new notification_1.NotificationExtImpl(rpc));
    const editors = rpc.set(plugin_api_rpc_1.MAIN_RPC_CONTEXT.TEXT_EDITORS_EXT, new text_editors_1.TextEditorsExtImpl(rpc, editorsAndDocumentsExt));
    const documents = rpc.set(plugin_api_rpc_1.MAIN_RPC_CONTEXT.DOCUMENTS_EXT, new documents_1.DocumentsExtImpl(rpc, editorsAndDocumentsExt));
    const notebooksExt = rpc.set(plugin_api_rpc_1.MAIN_RPC_CONTEXT.NOTEBOOKS_EXT, new notebooks_1.NotebooksExtImpl(rpc, commandRegistry, editorsAndDocumentsExt, documents));
    const notebookEditors = rpc.set(plugin_api_rpc_1.MAIN_RPC_CONTEXT.NOTEBOOK_EDITORS_EXT, new notebook_editors_1.NotebookEditorsExtImpl(notebooksExt));
    const notebookRenderers = rpc.set(plugin_api_rpc_1.MAIN_RPC_CONTEXT.NOTEBOOK_RENDERERS_EXT, new notebook_renderers_1.NotebookRenderersExtImpl(rpc, notebooksExt));
    const notebookKernels = rpc.set(plugin_api_rpc_1.MAIN_RPC_CONTEXT.NOTEBOOK_KERNELS_EXT, new notebook_kernels_1.NotebookKernelsExtImpl(rpc, notebooksExt, commandRegistry));
    const notebookDocuments = rpc.set(plugin_api_rpc_1.MAIN_RPC_CONTEXT.NOTEBOOK_DOCUMENTS_EXT, new notebook_documents_1.NotebookDocumentsExtImpl(notebooksExt));
    const statusBarMessageRegistryExt = new status_bar_message_registry_1.StatusBarMessageRegistryExt(rpc);
    const terminalExt = rpc.set(plugin_api_rpc_1.MAIN_RPC_CONTEXT.TERMINAL_EXT, new terminal_ext_1.TerminalServiceExtImpl(rpc));
    const outputChannelRegistryExt = rpc.set(plugin_api_rpc_1.MAIN_RPC_CONTEXT.OUTPUT_CHANNEL_REGISTRY_EXT, new output_channel_registry_1.OutputChannelRegistryExtImpl(rpc));
    const treeViewsExt = rpc.set(plugin_api_rpc_1.MAIN_RPC_CONTEXT.TREE_VIEWS_EXT, new tree_views_1.TreeViewsExtImpl(rpc, commandRegistry));
    const tasksExt = rpc.set(plugin_api_rpc_1.MAIN_RPC_CONTEXT.TASKS_EXT, new tasks_1.TasksExtImpl(rpc, terminalExt));
    const connectionExt = rpc.set(plugin_api_rpc_1.MAIN_RPC_CONTEXT.CONNECTION_EXT, new connection_1.ConnectionImpl(rpc.getProxy(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.CONNECTION_MAIN)));
    const fileSystemExt = rpc.set(plugin_api_rpc_1.MAIN_RPC_CONTEXT.FILE_SYSTEM_EXT, new file_system_ext_impl_1.FileSystemExtImpl(rpc));
    const languagesExt = rpc.set(plugin_api_rpc_1.MAIN_RPC_CONTEXT.LANGUAGES_EXT, new languages_1.LanguagesExtImpl(rpc, documents, commandRegistry, fileSystemExt));
    const extHostFileSystemEvent = rpc.set(plugin_api_rpc_1.MAIN_RPC_CONTEXT.ExtHostFileSystemEventService, new file_system_event_service_ext_impl_1.ExtHostFileSystemEventService(rpc, editorsAndDocumentsExt));
    const scmExt = rpc.set(plugin_api_rpc_1.MAIN_RPC_CONTEXT.SCM_EXT, new scm_1.ScmExtImpl(rpc, commandRegistry));
    const decorationsExt = rpc.set(plugin_api_rpc_1.MAIN_RPC_CONTEXT.DECORATIONS_EXT, new decorations_1.DecorationsExtImpl(rpc));
    const labelServiceExt = rpc.set(plugin_api_rpc_1.MAIN_RPC_CONTEXT.LABEL_SERVICE_EXT, new label_service_1.LabelServiceExtImpl(rpc));
    const timelineExt = rpc.set(plugin_api_rpc_1.MAIN_RPC_CONTEXT.TIMELINE_EXT, new timeline_1.TimelineExtImpl(rpc, commandRegistry));
    const themingExt = rpc.set(plugin_api_rpc_1.MAIN_RPC_CONTEXT.THEMING_EXT, new theming_1.ThemingExtImpl(rpc));
    const commentsExt = rpc.set(plugin_api_rpc_1.MAIN_RPC_CONTEXT.COMMENTS_EXT, new comments_1.CommentsExtImpl(rpc, commandRegistry, documents));
    const tabsExt = rpc.set(plugin_api_rpc_1.MAIN_RPC_CONTEXT.TABS_EXT, new tabs_1.TabsExtImpl(rpc));
    const customEditorExt = rpc.set(plugin_api_rpc_1.MAIN_RPC_CONTEXT.CUSTOM_EDITORS_EXT, new custom_editors_1.CustomEditorsExtImpl(rpc, documents, webviewExt, workspaceExt));
    const webviewViewsExt = rpc.set(plugin_api_rpc_1.MAIN_RPC_CONTEXT.WEBVIEW_VIEWS_EXT, new webview_views_1.WebviewViewsExtImpl(rpc, webviewExt));
    const telemetryExt = rpc.set(plugin_api_rpc_1.MAIN_RPC_CONTEXT.TELEMETRY_EXT, new telemetry_ext_1.TelemetryExtImpl());
    rpc.set(plugin_api_rpc_1.MAIN_RPC_CONTEXT.DEBUG_EXT, debugExt);
    return function (plugin) {
        const authentication = {
            registerAuthenticationProvider(id, label, provider, options) {
                return authenticationExt.registerAuthenticationProvider(id, label, provider, options);
            },
            getSession(providerId, scopes, options) {
                return authenticationExt.getSession(plugin, providerId, scopes, options);
            },
            get onDidChangeSessions() {
                return authenticationExt.onDidChangeSessions;
            }
        };
        function commandIsDeclaredInPackage(id, model) {
            var _a;
            const rawCommands = (_a = model.contributes) === null || _a === void 0 ? void 0 : _a.commands;
            if (!rawCommands) {
                return false;
            }
            return Array.isArray(rawCommands) ? rawCommands.some(candidate => candidate.command === id) : rawCommands.command === id;
        }
        const commands = {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            registerCommand(command, handler, thisArg) {
                // use of the ID when registering commands
                if (typeof command === 'string') {
                    if (handler && commandIsDeclaredInPackage(command, plugin.rawModel)) {
                        return commandRegistry.registerHandler(command, handler, thisArg);
                    }
                    return commandRegistry.registerCommand({ id: command }, handler, thisArg);
                }
                return commandRegistry.registerCommand(command, handler, thisArg);
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            executeCommand(commandId, ...args) {
                return commandRegistry.executeCommand(commandId, ...args);
            },
            registerTextEditorCommand(command, handler, thisArg) {
                const internalHandler = (...args) => {
                    const activeTextEditor = editors.getActiveEditor();
                    if (!activeTextEditor) {
                        console.warn('Cannot execute ' + command + ' because there is no active text editor.');
                        return undefined;
                    }
                    return activeTextEditor.edit((edit) => {
                        args.unshift(activeTextEditor, edit);
                        handler.apply(thisArg, args);
                    }).then(result => {
                        if (!result) {
                            console.warn('Edits from command ' + command + ' were not applied.');
                        }
                    }, err => {
                        console.warn('An error occurred while running command ' + command, err);
                    });
                };
                return commandIsDeclaredInPackage(command, plugin.rawModel)
                    ? commandRegistry.registerHandler(command, internalHandler)
                    : commandRegistry.registerCommand({ id: command }, internalHandler);
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            registerHandler(commandId, handler, thisArg) {
                return commandRegistry.registerHandler(commandId, handler, thisArg);
            },
            getKeyBinding(commandId) {
                return commandRegistry.getKeyBinding(commandId);
            },
            getCommands(filterInternal = false) {
                return commandRegistry.getCommands(filterInternal);
            },
            registerDiffInformationCommand(command, callback, thisArg) {
                // Dummy implementation.
                return new types_impl_1.Disposable(() => { });
            }
        };
        const { onDidChangeActiveTerminal, onDidChangeTerminalState, onDidCloseTerminal, onDidOpenTerminal } = terminalExt;
        const showInformationMessage = messageRegistryExt.showMessage.bind(messageRegistryExt, plugin_api_rpc_1.MainMessageType.Info);
        const showWarningMessage = messageRegistryExt.showMessage.bind(messageRegistryExt, plugin_api_rpc_1.MainMessageType.Warning);
        const showErrorMessage = messageRegistryExt.showMessage.bind(messageRegistryExt, plugin_api_rpc_1.MainMessageType.Error);
        const window = {
            get activeTerminal() {
                return terminalExt.activeTerminal;
            },
            get activeTextEditor() {
                return editors.getActiveEditor();
            },
            get visibleTextEditors() {
                return editors.getVisibleTextEditors();
            },
            get terminals() {
                return terminalExt.terminals;
            },
            onDidChangeActiveTerminal,
            onDidChangeActiveTextEditor(listener, thisArg, disposables) {
                return editors.onDidChangeActiveTextEditor(listener, thisArg, disposables);
            },
            onDidChangeVisibleTextEditors(listener, thisArg, disposables) {
                return editors.onDidChangeVisibleTextEditors(listener, thisArg, disposables);
            },
            onDidChangeTextEditorSelection(listener, thisArg, disposables) {
                return editors.onDidChangeTextEditorSelection(listener, thisArg, disposables);
            },
            onDidChangeTextEditorOptions(listener, thisArg, disposables) {
                return editors.onDidChangeTextEditorOptions(listener, thisArg, disposables);
            },
            onDidChangeTextEditorViewColumn(listener, thisArg, disposables) {
                return editors.onDidChangeTextEditorViewColumn(listener, thisArg, disposables);
            },
            onDidChangeTextEditorVisibleRanges(listener, thisArg, disposables) {
                return editors.onDidChangeTextEditorVisibleRanges(listener, thisArg, disposables);
            },
            async showTextDocument(documentArg, columnOrOptions, preserveFocus) {
                let documentOptions;
                const uri = documentArg instanceof types_impl_1.URI ? documentArg : documentArg.uri;
                if (typeof columnOrOptions === 'number') {
                    documentOptions = {
                        viewColumn: columnOrOptions
                    };
                }
                else if (columnOrOptions && (columnOrOptions.preserveFocus || columnOrOptions.preview || columnOrOptions.selection || columnOrOptions.viewColumn)) {
                    documentOptions = {
                        ...columnOrOptions
                    };
                }
                if (preserveFocus) {
                    if (documentOptions) {
                        documentOptions.preserveFocus = preserveFocus;
                    }
                    else {
                        documentOptions = { preserveFocus };
                    }
                }
                await documents.showDocument(uri, documentOptions);
                const textEditor = editors.getVisibleTextEditors().find(editor => editor.document.uri.toString() === uri.toString());
                if (textEditor) {
                    return Promise.resolve(textEditor);
                }
                else {
                    throw new Error(`Failed to show text document ${documentArg.toString()}`);
                }
            },
            get visibleNotebookEditors() {
                return notebooksExt.visibleApiNotebookEditors;
            },
            onDidChangeVisibleNotebookEditors(listener, thisArg, disposables) {
                return notebooksExt.onDidChangeVisibleNotebookEditors(listener, thisArg, disposables);
            },
            get activeNotebookEditor() {
                return notebooksExt.activeApiNotebookEditor;
            }, onDidChangeActiveNotebookEditor(listener, thisArg, disposables) {
                return notebooksExt.onDidChangeActiveNotebookEditor(listener, thisArg, disposables);
            },
            onDidChangeNotebookEditorSelection(listener, thisArg, disposables) {
                return notebookEditors.onDidChangeNotebookEditorSelection(listener, thisArg, disposables);
            },
            onDidChangeNotebookEditorVisibleRanges(listener, thisArg, disposables) {
                return notebookEditors.onDidChangeNotebookEditorVisibleRanges(listener, thisArg, disposables);
            },
            showNotebookDocument(document, options) {
                return notebooksExt.showNotebookDocument(document, options);
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            showQuickPick(items, options, token) {
                return quickOpenExt.showQuickPick(items, options, token);
            },
            createQuickPick() {
                return quickOpenExt.createQuickPick(plugin);
            },
            showWorkspaceFolderPick(options) {
                return workspaceExt.pickWorkspaceFolder(options);
            },
            showInformationMessage,
            showWarningMessage,
            showErrorMessage,
            showOpenDialog(options) {
                return dialogsExt.showOpenDialog(options);
            },
            showSaveDialog(options) {
                return dialogsExt.showSaveDialog(options);
            },
            showUploadDialog(options) {
                return dialogsExt.showUploadDialog(options);
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setStatusBarMessage(text, arg) {
                return statusBarMessageRegistryExt.setStatusBarMessage(text, arg);
            },
            showInputBox(options, token) {
                return quickOpenExt.showInput(options, token);
            },
            createStatusBarItem(alignmentOrId, priorityOrAlignment, priorityArg) {
                let id;
                let alignment;
                let priority;
                if (typeof alignmentOrId === 'string') {
                    id = alignmentOrId;
                    alignment = priorityOrAlignment;
                    priority = priorityArg;
                }
                else {
                    alignment = alignmentOrId;
                    priority = priorityOrAlignment;
                }
                return statusBarMessageRegistryExt.createStatusBarItem(alignment, priority, id);
            },
            createOutputChannel(name, options) {
                return !options
                    ? outputChannelRegistryExt.createOutputChannel(name, (0, type_converters_1.pluginToPluginInfo)(plugin))
                    : outputChannelRegistryExt.createOutputChannel(name, (0, type_converters_1.pluginToPluginInfo)(plugin), options);
            },
            createWebviewPanel(viewType, title, showOptions, options = {}) {
                return webviewExt.createWebview(viewType, title, showOptions, options, plugin);
            },
            registerWebviewPanelSerializer(viewType, serializer) {
                return webviewExt.registerWebviewPanelSerializer(viewType, serializer, plugin);
            },
            registerCustomEditorProvider(viewType, provider, options = {}) {
                return customEditorExt.registerCustomEditorProvider(viewType, provider, options, plugin);
            },
            registerWebviewViewProvider(viewType, provider, options) {
                return webviewViewsExt.registerWebviewViewProvider(viewType, provider, plugin, options === null || options === void 0 ? void 0 : options.webviewOptions);
            },
            get state() {
                return windowStateExt.getWindowState();
            },
            onDidChangeWindowState(listener, thisArg, disposables) {
                return windowStateExt.onDidChangeWindowState(listener, thisArg, disposables);
            },
            createTerminal(nameOrOptions, shellPath, shellArgs) {
                return terminalExt.createTerminal(nameOrOptions, shellPath, shellArgs);
            },
            onDidChangeTerminalState,
            onDidCloseTerminal,
            onDidOpenTerminal,
            createTextEditorDecorationType(options) {
                return editors.createTextEditorDecorationType(options);
            },
            registerTreeDataProvider(viewId, treeDataProvider) {
                return treeViewsExt.registerTreeDataProvider(plugin, viewId, treeDataProvider);
            },
            createTreeView(viewId, options) {
                return treeViewsExt.createTreeView(plugin, viewId, options);
            },
            withScmProgress(task) {
                const options = { location: types_impl_1.ProgressLocation.SourceControl };
                return notificationExt.withProgress(options, () => task({ report() { } }));
            },
            withProgress(options, task) {
                return notificationExt.withProgress(options, task);
            },
            registerFileDecorationProvider(provider) {
                return decorationsExt.registerFileDecorationProvider(provider, (0, type_converters_1.pluginToPluginInfo)(plugin));
            },
            registerUriHandler(handler) {
                // TODO ?
                return new types_impl_1.Disposable(() => { });
            },
            createInputBox() {
                return quickOpenExt.createInputBox(plugin);
            },
            registerTerminalLinkProvider(provider) {
                return terminalExt.registerTerminalLinkProvider(provider);
            },
            registerTerminalProfileProvider(id, provider) {
                return terminalExt.registerTerminalProfileProvider(id, provider);
            },
            get activeColorTheme() {
                return themingExt.activeColorTheme;
            },
            onDidChangeActiveColorTheme(listener, thisArg, disposables) {
                return themingExt.onDidChangeActiveColorTheme(listener, thisArg, disposables);
            },
            get tabGroups() {
                return tabsExt.tabGroups;
            },
            /** @stubbed ExternalUriOpener */
            registerExternalUriOpener(id, opener, metadata) {
                return types_impl_1.Disposable.NULL;
            },
            /** @stubbed ProfileContentHandler */
            registerProfileContentHandler(id, profileContentHandler) {
                return types_impl_1.Disposable.NULL;
            },
            /** @stubbed TerminalQuickFixProvider */
            registerTerminalQuickFixProvider(id, provider) {
                return terminalExt.registerTerminalQuickFixProvider(id, provider);
            },
            /** @stubbed ShareProvider */
            registerShareProvider: () => types_impl_1.Disposable.NULL,
        };
        const workspace = {
            get fs() {
                return fileSystemExt.fileSystem;
            },
            get rootPath() {
                return workspaceExt.rootPath;
            },
            get workspaceFolders() {
                return workspaceExt.workspaceFolders;
            },
            get workspaceFile() {
                return workspaceExt.workspaceFile;
            },
            get name() {
                return workspaceExt.name;
            },
            onDidChangeWorkspaceFolders(listener, thisArg, disposables) {
                return workspaceExt.onDidChangeWorkspaceFolders(listener, thisArg, disposables);
            },
            get notebookDocuments() {
                return notebooksExt.getAllApiDocuments();
            },
            get textDocuments() {
                return documents.getAllDocumentData().map(data => data.document);
            },
            onDidChangeTextDocument(listener, thisArg, disposables) {
                return documents.onDidChangeDocument(listener, thisArg, disposables);
            },
            onDidCloseTextDocument(listener, thisArg, disposables) {
                return documents.onDidRemoveDocument(listener, thisArg, disposables);
            },
            onDidOpenNotebookDocument(listener, thisArg, disposables) {
                return notebooksExt.onDidOpenNotebookDocument(listener, thisArg, disposables);
            },
            onDidCloseNotebookDocument(listener, thisArg, disposables) {
                return notebooksExt.onDidCloseNotebookDocument(listener, thisArg, disposables);
            },
            onWillSaveNotebookDocument(listener, thisArg, disposables) {
                return types_impl_1.Disposable.NULL;
            },
            onDidSaveNotebookDocument(listener, thisArg, disposables) {
                return notebookDocuments.onDidSaveNotebookDocument(listener, thisArg, disposables);
            },
            onDidChangeNotebookDocument(listener, thisArg, disposables) {
                return notebookDocuments.onDidChangeNotebookDocument(listener, thisArg, disposables);
            },
            onDidOpenTextDocument(listener, thisArg, disposables) {
                return documents.onDidAddDocument(listener, thisArg, disposables);
            },
            onWillSaveTextDocument(listener, thisArg, disposables) {
                return documents.onWillSaveTextDocument(listener, thisArg, disposables);
            },
            onDidSaveTextDocument(listener, thisArg, disposables) {
                return documents.onDidSaveTextDocument(listener, thisArg, disposables);
            },
            onDidCreateFiles: (listener, thisArg, disposables) => extHostFileSystemEvent.onDidCreateFile(listener, thisArg, disposables),
            onDidDeleteFiles: (listener, thisArg, disposables) => extHostFileSystemEvent.onDidDeleteFile(listener, thisArg, disposables),
            onDidRenameFiles: (listener, thisArg, disposables) => extHostFileSystemEvent.onDidRenameFile(listener, thisArg, disposables),
            onWillCreateFiles: (listener, thisArg, disposables) => extHostFileSystemEvent.getOnWillCreateFileEvent(plugin)(listener, thisArg, disposables),
            onWillDeleteFiles: (listener, thisArg, disposables) => extHostFileSystemEvent.getOnWillDeleteFileEvent(plugin)(listener, thisArg, disposables),
            onWillRenameFiles: (listener, thisArg, disposables) => extHostFileSystemEvent.getOnWillRenameFileEvent(plugin)(listener, thisArg, disposables),
            getConfiguration(section, resource) {
                return preferenceRegistryExt.getConfiguration(section, resource);
            },
            onDidChangeConfiguration(listener, thisArgs, disposables) {
                return preferenceRegistryExt.onDidChangeConfiguration(listener, thisArgs, disposables);
            },
            async openTextDocument(uriOrFileNameOrOptions) {
                const options = uriOrFileNameOrOptions;
                let uri;
                if (typeof uriOrFileNameOrOptions === 'string') {
                    uri = types_impl_1.URI.file(uriOrFileNameOrOptions);
                }
                else if (uriOrFileNameOrOptions instanceof types_impl_1.URI) {
                    uri = uriOrFileNameOrOptions;
                }
                else if (!options || typeof options === 'object') {
                    uri = await documents.createDocumentData(options);
                }
                else {
                    return Promise.reject(new Error('illegal argument - uriOrFileNameOrOptions'));
                }
                const data = await documents.openDocument(uri);
                return data && data.document;
            },
            async openNotebookDocument(uriOrType, content) {
                let uri;
                if (types_impl_1.URI.isUri(uriOrType)) {
                    uri = uriOrType;
                    await notebooksExt.openNotebookDocument(uriOrType);
                }
                else if (typeof uriOrType === 'string') {
                    uri = types_impl_1.URI.revive(await notebooksExt.createNotebookDocument({ viewType: uriOrType, content }));
                }
                else {
                    throw new Error('Invalid arguments');
                }
                return notebooksExt.getNotebookDocument(uri).apiNotebook;
            },
            createFileSystemWatcher: (pattern, ignoreCreate, ignoreChange, ignoreDelete) => extHostFileSystemEvent.createFileSystemWatcher((0, type_converters_1.fromGlobPattern)(pattern), ignoreCreate, ignoreChange, ignoreDelete),
            findFiles(include, exclude, maxResults, token) {
                return workspaceExt.findFiles(include, exclude, maxResults, token);
            },
            findTextInFiles(query, optionsOrCallback, callbackOrToken, token) {
                return workspaceExt.findTextInFiles(query, optionsOrCallback, callbackOrToken, token);
            },
            saveAll(includeUntitled) {
                return editors.saveAll(includeUntitled);
            },
            applyEdit(edit, metadata) {
                return editors.applyWorkspaceEdit(edit, metadata);
            },
            registerTextDocumentContentProvider(scheme, provider) {
                return workspaceExt.registerTextDocumentContentProvider(scheme, provider);
            },
            registerFileSystemProvider(scheme, provider, options) {
                return fileSystemExt.registerFileSystemProvider(scheme, provider, options);
            },
            getWorkspaceFolder(uri) {
                return workspaceExt.getWorkspaceFolder(uri);
            },
            asRelativePath(pathOrUri, includeWorkspace) {
                return workspaceExt.getRelativePath(pathOrUri, includeWorkspace);
            },
            updateWorkspaceFolders: (index, deleteCount, ...workspaceFoldersToAdd) => workspaceExt.updateWorkspaceFolders(index, deleteCount || 0, ...workspaceFoldersToAdd),
            registerTaskProvider(type, provider) {
                return tasks.registerTaskProvider(type, provider);
            },
            registerResourceLabelFormatter(formatter) {
                return labelServiceExt.$registerResourceLabelFormatter(formatter);
            },
            registerTimelineProvider(scheme, provider) {
                return timelineExt.registerTimelineProvider(plugin, scheme, provider);
            },
            registerNotebookSerializer(notebookType, serializer, options) {
                return notebooksExt.registerNotebookSerializer(plugin, notebookType, serializer, options);
            },
            get isTrusted() {
                return workspaceExt.trusted;
            },
            async requestWorkspaceTrust(options) {
                return workspaceExt.requestWorkspaceTrust(options);
            },
            get onDidGrantWorkspaceTrust() {
                return workspaceExt.onDidGrantWorkspaceTrust;
            },
            registerEditSessionIdentityProvider(scheme, provider) {
                return workspaceExt.$registerEditSessionIdentityProvider(scheme, provider);
            },
            /**
             * @stubbed
             * This is a stub implementation, that should minimally satisfy vscode built-in extensions
             * that currently use this proposed API.
             */
            onWillCreateEditSessionIdentity: () => types_impl_1.Disposable.NULL,
            registerCanonicalUriProvider(scheme, provider) {
                return workspaceExt.registerCanonicalUriProvider(scheme, provider);
            },
            getCanonicalUri(uri, options, token) {
                return workspaceExt.getCanonicalUri(uri, options, token);
            }
        };
        const onDidChangeLogLevel = new event_1.Emitter();
        const env = Object.freeze({
            get appName() { return envExt.appName; },
            get appRoot() { return envExt.appRoot; },
            get appHost() { return envExt.appHost; },
            get language() { return envExt.language; },
            get isNewAppInstall() { return envExt.isNewAppInstall; },
            get isTelemetryEnabled() { return telemetryExt.isTelemetryEnabled; },
            get onDidChangeTelemetryEnabled() {
                return telemetryExt.onDidChangeTelemetryEnabled;
            },
            createTelemetryLogger(sender, options) {
                return telemetryExt.createTelemetryLogger(sender, options);
            },
            get remoteName() { return envExt.remoteName; },
            get machineId() { return envExt.machineId; },
            get sessionId() { return envExt.sessionId; },
            get uriScheme() { return envExt.uriScheme; },
            get shell() { return envExt.shell; },
            get uiKind() { return envExt.uiKind; },
            clipboard,
            getEnvVariable(envVarName) {
                return envExt.getEnvVariable(envVarName);
            },
            getQueryParameter(queryParamName) {
                return envExt.getQueryParameter(queryParamName);
            },
            getQueryParameters() {
                return envExt.getQueryParameters();
            },
            getClientOperatingSystem() {
                return envExt.getClientOperatingSystem();
            },
            openExternal(uri) {
                return windowStateExt.openUri(uri);
            },
            asExternalUri(target) {
                return windowStateExt.asExternalUri(target);
            },
            get logLevel() { return types_impl_1.LogLevel.Info; },
            get onDidChangeLogLevel() { return onDidChangeLogLevel.event; }
        });
        const extensions = Object.freeze({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            getExtension(extensionId, includeFromDifferentExtensionHosts = false) {
                includeFromDifferentExtensionHosts = false;
                const plg = pluginManager.getPluginById(extensionId.toLowerCase());
                if (plg) {
                    return new PluginExt(pluginManager, plg);
                }
                return undefined;
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            get all() {
                return pluginManager.getAllPlugins().map(plg => new PluginExt(pluginManager, plg));
            },
            get allAcrossExtensionHosts() {
                // we only support one extension host ATM so equivalent to calling "all()"
                return this.all;
            },
            get onDidChange() {
                return pluginManager.onDidChange;
            }
        });
        const languages = {
            getLanguages() {
                return languagesExt.getLanguages();
            },
            setTextDocumentLanguage(document, languageId) {
                return languagesExt.changeLanguage(document.uri, languageId);
            },
            match(selector, document) {
                return (0, language_selector_1.score)((0, type_converters_1.fromDocumentSelector)(selector), document.uri.scheme, document.uri.path, document.languageId, true);
            },
            get onDidChangeDiagnostics() {
                return languagesExt.onDidChangeDiagnostics;
            },
            getDiagnostics(resource) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                return languagesExt.getDiagnostics(resource);
            },
            createDiagnosticCollection(name) {
                return languagesExt.createDiagnosticCollection(name);
            },
            setLanguageConfiguration(language, configuration) {
                return languagesExt.setLanguageConfiguration(language, configuration);
            },
            registerCompletionItemProvider(selector, provider, ...triggerCharacters) {
                return languagesExt.registerCompletionItemProvider(selector, provider, triggerCharacters, (0, type_converters_1.pluginToPluginInfo)(plugin));
            },
            registerInlineCompletionItemProvider(selector, provider) {
                return languagesExt.registerInlineCompletionsProvider(selector, provider);
            },
            registerDefinitionProvider(selector, provider) {
                return languagesExt.registerDefinitionProvider(selector, provider, (0, type_converters_1.pluginToPluginInfo)(plugin));
            },
            registerDeclarationProvider(selector, provider) {
                return languagesExt.registerDeclarationProvider(selector, provider, (0, type_converters_1.pluginToPluginInfo)(plugin));
            },
            registerSignatureHelpProvider(selector, provider, first, ...remaining) {
                let metadata;
                if (typeof first === 'object') {
                    metadata = first;
                }
                else {
                    const triggerCharacters = [];
                    metadata = { triggerCharacters, retriggerCharacters: [] };
                    if (first) {
                        triggerCharacters.push(first, ...remaining);
                    }
                }
                return languagesExt.registerSignatureHelpProvider(selector, provider, metadata, (0, type_converters_1.pluginToPluginInfo)(plugin));
            },
            registerTypeDefinitionProvider(selector, provider) {
                return languagesExt.registerTypeDefinitionProvider(selector, provider, (0, type_converters_1.pluginToPluginInfo)(plugin));
            },
            registerImplementationProvider(selector, provider) {
                return languagesExt.registerImplementationProvider(selector, provider, (0, type_converters_1.pluginToPluginInfo)(plugin));
            },
            registerHoverProvider(selector, provider) {
                return languagesExt.registerHoverProvider(selector, provider, (0, type_converters_1.pluginToPluginInfo)(plugin));
            },
            registerEvaluatableExpressionProvider(selector, provider) {
                return languagesExt.registerEvaluatableExpressionProvider(selector, provider, (0, type_converters_1.pluginToPluginInfo)(plugin));
            },
            registerInlineValuesProvider(selector, provider) {
                return languagesExt.registerInlineValuesProvider(selector, provider, (0, type_converters_1.pluginToPluginInfo)(plugin));
            },
            registerDocumentHighlightProvider(selector, provider) {
                return languagesExt.registerDocumentHighlightProvider(selector, provider, (0, type_converters_1.pluginToPluginInfo)(plugin));
            },
            registerWorkspaceSymbolProvider(provider) {
                return languagesExt.registerWorkspaceSymbolProvider(provider, (0, type_converters_1.pluginToPluginInfo)(plugin));
            },
            registerDocumentFormattingEditProvider(selector, provider) {
                return languagesExt.registerDocumentFormattingEditProvider(selector, provider, (0, type_converters_1.pluginToPluginInfo)(plugin));
            },
            registerDocumentRangeFormattingEditProvider(selector, provider) {
                return languagesExt.registerDocumentRangeFormattingEditProvider(selector, provider, (0, type_converters_1.pluginToPluginInfo)(plugin));
            },
            registerOnTypeFormattingEditProvider(selector, provider, firstTriggerCharacter, ...moreTriggerCharacters) {
                return languagesExt.registerOnTypeFormattingEditProvider(selector, provider, [firstTriggerCharacter].concat(moreTriggerCharacters), (0, type_converters_1.pluginToPluginInfo)(plugin));
            },
            registerDocumentDropEditProvider(selector, provider, metadata) {
                return languagesExt.registerDocumentDropEditProvider(selector, provider, metadata);
            },
            registerDocumentLinkProvider(selector, provider) {
                return languagesExt.registerDocumentLinkProvider(selector, provider, (0, type_converters_1.pluginToPluginInfo)(plugin));
            },
            registerCodeActionsProvider(selector, provider, metadata) {
                return languagesExt.registerCodeActionsProvider(selector, provider, plugin.model, (0, type_converters_1.pluginToPluginInfo)(plugin), metadata);
            },
            registerCodeLensProvider(selector, provider) {
                return languagesExt.registerCodeLensProvider(selector, provider, (0, type_converters_1.pluginToPluginInfo)(plugin));
            },
            registerReferenceProvider(selector, provider) {
                return languagesExt.registerReferenceProvider(selector, provider, (0, type_converters_1.pluginToPluginInfo)(plugin));
            },
            registerDocumentSymbolProvider(selector, provider, metadata) {
                return languagesExt.registerDocumentSymbolProvider(selector, provider, (0, type_converters_1.pluginToPluginInfo)(plugin), metadata);
            },
            registerColorProvider(selector, provider) {
                return languagesExt.registerColorProvider(selector, provider, (0, type_converters_1.pluginToPluginInfo)(plugin));
            },
            registerInlayHintsProvider(selector, provider) {
                return languagesExt.registerInlayHintsProvider(selector, provider, (0, type_converters_1.pluginToPluginInfo)(plugin));
            },
            registerFoldingRangeProvider(selector, provider) {
                return languagesExt.registerFoldingRangeProvider(selector, provider, (0, type_converters_1.pluginToPluginInfo)(plugin));
            },
            registerSelectionRangeProvider(selector, provider) {
                return languagesExt.registerSelectionRangeProvider(selector, provider, (0, type_converters_1.pluginToPluginInfo)(plugin));
            },
            registerRenameProvider(selector, provider) {
                return languagesExt.registerRenameProvider(selector, provider, (0, type_converters_1.pluginToPluginInfo)(plugin));
            },
            registerDocumentSemanticTokensProvider(selector, provider, legend) {
                return languagesExt.registerDocumentSemanticTokensProvider(selector, provider, legend, (0, type_converters_1.pluginToPluginInfo)(plugin));
            },
            registerDocumentRangeSemanticTokensProvider(selector, provider, legend) {
                return languagesExt.registerDocumentRangeSemanticTokensProvider(selector, provider, legend, (0, type_converters_1.pluginToPluginInfo)(plugin));
            },
            registerCallHierarchyProvider(selector, provider) {
                return languagesExt.registerCallHierarchyProvider(selector, provider);
            },
            registerTypeHierarchyProvider(selector, provider) {
                return languagesExt.registerTypeHierarchyProvider(selector, provider);
            },
            registerLinkedEditingRangeProvider(selector, provider) {
                return languagesExt.registerLinkedEditingRangeProvider(selector, provider);
            },
            createLanguageStatusItem(id, selector) {
                return languagesExt.createLanguageStatusItem(plugin, id, selector);
            },
            registerDocumentPasteEditProvider(selector, provider, metadata) {
                return languagesExt.registerDocumentPasteEditProvider(plugin, selector, provider, metadata);
            }
        };
        // Tests API (@stubbed)
        // The following implementation is temporarily `@stubbed` and marked as such under `theia.d.ts`
        const tests = {
            createTestController(provider, controllerLabel, refreshHandler) {
                return {
                    id: provider,
                    label: controllerLabel,
                    items: tests_api_1.testItemCollection,
                    refreshHandler,
                    createRunProfile: tests_api_1.createRunProfile,
                    createTestRun: tests_api_1.createTestRun,
                    createTestItem: tests_api_1.createTestItem,
                    dispose: () => undefined,
                };
            },
        };
        /* End of Tests API */
        const plugins = {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            get all() {
                return pluginManager.getAllPlugins().map(plg => new PluginExt(pluginManager, plg));
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            getPlugin(pluginId) {
                const plg = pluginManager.getPluginById(pluginId.toLowerCase());
                if (plg) {
                    return new PluginExt(pluginManager, plg);
                }
                return undefined;
            },
            get onDidChange() {
                return pluginManager.onDidChange;
            }
        };
        const debuggersContributions = plugin.rawModel.contributes && plugin.rawModel.contributes.debuggers || [];
        debugExt.assistedInject(connectionExt, commandRegistry);
        debugExt.registerDebuggersContributions(plugin.pluginFolder, plugin.model.entryPoint.frontend ? 'frontend' : 'backend', debuggersContributions);
        const debug = {
            get activeDebugSession() {
                return debugExt.activeDebugSession;
            },
            get activeDebugConsole() {
                return debugExt.activeDebugConsole;
            },
            get breakpoints() {
                return debugExt.breakpoints;
            },
            get onDidChangeActiveDebugSession() {
                return debugExt.onDidChangeActiveDebugSession;
            },
            get onDidStartDebugSession() {
                return debugExt.onDidStartDebugSession;
            },
            get onDidReceiveDebugSessionCustomEvent() {
                return debugExt.onDidReceiveDebugSessionCustomEvent;
            },
            get onDidTerminateDebugSession() {
                return debugExt.onDidTerminateDebugSession;
            },
            get onDidChangeBreakpoints() {
                return debugExt.onDidChangeBreakpoints;
            },
            registerDebugAdapterDescriptorFactory(debugType, factory) {
                return debugExt.registerDebugAdapterDescriptorFactory(debugType, factory);
            },
            registerDebugConfigurationProvider(debugType, provider, triggerKind) {
                return debugExt.registerDebugConfigurationProvider(debugType, provider, triggerKind || plugin_api_rpc_1.DebugConfigurationProviderTriggerKind.Initial);
            },
            registerDebugAdapterTrackerFactory(debugType, factory) {
                return debugExt.registerDebugAdapterTrackerFactory(debugType, factory);
            },
            startDebugging(folder, nameOrConfiguration, parentSessionOrOptions) {
                if (!parentSessionOrOptions || (typeof parentSessionOrOptions === 'object' && 'configuration' in parentSessionOrOptions)) {
                    return debugExt.startDebugging(folder, nameOrConfiguration, { parentSession: parentSessionOrOptions });
                }
                return debugExt.startDebugging(folder, nameOrConfiguration, parentSessionOrOptions || {});
            },
            stopDebugging(session) {
                return debugExt.stopDebugging(session);
            },
            addBreakpoints(breakpoints) {
                debugExt.addBreakpoints(breakpoints);
            },
            removeBreakpoints(breakpoints) {
                debugExt.removeBreakpoints(breakpoints);
            },
            asDebugSourceUri(source, session) {
                return debugExt.asDebugSourceUri(source, session);
            }
        };
        const tasks = {
            registerTaskProvider(type, provider) {
                return tasksExt.registerTaskProvider(type, provider);
            },
            fetchTasks(filter) {
                return tasksExt.fetchTasks(filter);
            },
            executeTask(task) {
                return tasksExt.executeTask(task);
            },
            get taskExecutions() {
                return tasksExt.taskExecutions;
            },
            onDidStartTask(listener, thisArg, disposables) {
                return tasksExt.onDidStartTask(listener, thisArg, disposables);
            },
            onDidEndTask(listener, thisArg, disposables) {
                return tasksExt.onDidEndTask(listener, thisArg, disposables);
            },
            onDidStartTaskProcess(listener, thisArg, disposables) {
                return tasksExt.onDidStartTaskProcess(listener, thisArg, disposables);
            },
            onDidEndTaskProcess(listener, thisArg, disposables) {
                return tasksExt.onDidEndTaskProcess(listener, thisArg, disposables);
            }
        };
        const scm = {
            get inputBox() {
                const inputBox = scmExt.getLastInputBox(plugin);
                if (inputBox) {
                    return inputBox;
                }
                else {
                    throw new Error('Input box not found!');
                }
            },
            createSourceControl(id, label, rootUri) {
                return scmExt.createSourceControl(plugin, id, label, rootUri);
            }
        };
        const comments = {
            createCommentController(id, label) {
                return commentsExt.createCommentController(plugin, id, label);
            }
        };
        const l10n = {
            // eslint-disable-next-line max-len
            t(...params) {
                if (typeof params[0] === 'string') {
                    const key = params.shift();
                    // We have either rest args which are Array<string | number | boolean> or an array with a single Record<string, any>.
                    // This ensures we get a Record<string | number, any> which will be formatted correctly.
                    const argsFormatted = !params || typeof params[0] !== 'object' ? params : params[0];
                    return localizationExt.translateMessage(plugin.model.id, { message: key, args: argsFormatted });
                }
                return localizationExt.translateMessage(plugin.model.id, params[0]);
            },
            get bundle() {
                return localizationExt.getBundle(plugin.model.id);
            },
            get uri() {
                return localizationExt.getBundleUri(plugin.model.id);
            }
        };
        // notebooks API (@stubbed)
        // The following implementation is temporarily `@stubbed` and marked as such under `theia.d.ts`
        const notebooks = {
            createNotebookController(id, notebookType, label, handler, rendererScripts) {
                return notebookKernels.createNotebookController(plugin.model.id, id, notebookType, label, handler, rendererScripts);
            },
            createRendererMessaging(rendererId) {
                return notebookRenderers.createRendererMessaging(rendererId);
            },
            registerNotebookCellStatusBarItemProvider(notebookType, provider) {
                return notebooksExt.registerNotebookCellStatusBarItemProvider(notebookType, provider);
            },
            onDidChangeNotebookCellExecutionState: notebookKernels.onDidChangeNotebookCellExecutionState,
            createNotebookControllerDetectionTask(notebookType) {
                return notebookKernels.createNotebookControllerDetectionTask(notebookType);
            },
            registerKernelSourceActionProvider(notebookType, provider) {
                return notebookKernels.registerKernelSourceActionProvider(notebookType, provider);
            }
        };
        return {
            version: require('../../package.json').version,
            authentication,
            commands,
            comments,
            window,
            workspace,
            env,
            extensions,
            languages,
            plugins,
            debug,
            tasks,
            scm,
            notebooks,
            l10n,
            tests,
            // Types
            StatusBarAlignment: types_impl_1.StatusBarAlignment,
            Disposable: types_impl_1.Disposable,
            EventEmitter: event_1.Emitter,
            CancellationTokenSource: cancellation_1.CancellationTokenSource,
            MarkdownString: markdown_string_1.MarkdownString,
            Position: types_impl_1.Position,
            Range: types_impl_1.Range,
            Selection: types_impl_1.Selection,
            ViewColumn: types_impl_1.ViewColumn,
            TextEditorSelectionChangeKind: types_impl_1.TextEditorSelectionChangeKind,
            Uri: types_impl_1.URI,
            EndOfLine: types_impl_1.EndOfLine,
            TextEditorRevealType: types_impl_1.TextEditorRevealType,
            TextEditorCursorStyle: editor_options_1.TextEditorCursorStyle,
            TextEditorLineNumbersStyle: types_impl_1.TextEditorLineNumbersStyle,
            ThemeColor: types_impl_1.ThemeColor,
            ThemeIcon: types_impl_1.ThemeIcon,
            SnippetString: types_impl_1.SnippetString,
            DecorationRangeBehavior: types_impl_1.DecorationRangeBehavior,
            OverviewRulerLane: types_impl_1.OverviewRulerLane,
            ConfigurationTarget: types_impl_1.ConfigurationTarget,
            RelativePattern: types_impl_1.RelativePattern,
            IndentAction: types_impl_1.IndentAction,
            CompletionItem: types_impl_1.CompletionItem,
            CompletionItemKind: types_impl_1.CompletionItemKind,
            CompletionList: types_impl_1.CompletionList,
            DebugConsoleMode: types_impl_1.DebugConsoleMode,
            DiagnosticSeverity: types_impl_1.DiagnosticSeverity,
            DiagnosticRelatedInformation: types_impl_1.DiagnosticRelatedInformation,
            LanguageStatusSeverity: types_impl_1.LanguageStatusSeverity,
            Location: types_impl_1.Location,
            LogLevel: types_impl_1.LogLevel,
            DiagnosticTag: types_impl_1.DiagnosticTag,
            CompletionItemTag: types_impl_1.CompletionItemTag,
            Diagnostic: types_impl_1.Diagnostic,
            CompletionTriggerKind: types_impl_1.CompletionTriggerKind,
            TextEdit: types_impl_1.TextEdit,
            SnippetTextEdit: types_impl_1.SnippetTextEdit,
            ProgressLocation: types_impl_1.ProgressLocation,
            ProgressOptions: types_impl_1.ProgressOptions,
            Progress: types_impl_1.Progress,
            ParameterInformation: types_impl_1.ParameterInformation,
            QuickPickItemKind: types_impl_1.QuickPickItemKind,
            SignatureInformation: types_impl_1.SignatureInformation,
            SignatureHelp: types_impl_1.SignatureHelp,
            SignatureHelpTriggerKind: types_impl_1.SignatureHelpTriggerKind,
            Hover: types_impl_1.Hover,
            EvaluatableExpression: types_impl_1.EvaluatableExpression,
            InlineValueEvaluatableExpression: types_impl_1.InlineValueEvaluatableExpression,
            InlineValueText: types_impl_1.InlineValueText,
            InlineValueVariableLookup: types_impl_1.InlineValueVariableLookup,
            InlineValueContext: types_impl_1.InlineValueContext,
            DocumentHighlightKind: types_impl_1.DocumentHighlightKind,
            DocumentHighlight: types_impl_1.DocumentHighlight,
            DocumentLink: types_impl_1.DocumentLink,
            DocumentDropEdit: types_impl_1.DocumentDropEdit,
            CodeLens: types_impl_1.CodeLens,
            CodeActionKind: types_impl_1.CodeActionKind,
            CodeActionTrigger: types_impl_1.CodeActionTrigger,
            CodeActionTriggerKind: types_impl_1.CodeActionTriggerKind,
            TextDocumentSaveReason: types_impl_1.TextDocumentSaveReason,
            CodeAction: types_impl_1.CodeAction,
            DataTransferItem: types_impl_1.DataTransferItem,
            DataTransfer: types_impl_1.DataTransfer,
            TreeItem: types_impl_1.TreeItem,
            TreeItemCollapsibleState: types_impl_1.TreeItemCollapsibleState,
            TreeItemCheckboxState: types_impl_1.TreeItemCheckboxState,
            SymbolKind: plugin_api_rpc_model_1.SymbolKind,
            SymbolTag: types_impl_1.SymbolTag,
            DocumentSymbol: types_impl_1.DocumentSymbol,
            WorkspaceEdit: types_impl_1.WorkspaceEdit,
            SymbolInformation: types_impl_1.SymbolInformation,
            FileType: types_impl_1.FileType,
            FilePermission: files_1.FilePermission,
            FileChangeType: types_impl_1.FileChangeType,
            ShellQuoting: types_impl_1.ShellQuoting,
            ShellExecution: types_impl_1.ShellExecution,
            ProcessExecution: types_impl_1.ProcessExecution,
            CustomExecution: types_impl_1.CustomExecution,
            TaskScope: types_impl_1.TaskScope,
            TaskRevealKind: types_impl_1.TaskRevealKind,
            TaskPanelKind: types_impl_1.TaskPanelKind,
            TaskGroup: types_impl_1.TaskGroup,
            Task: types_impl_1.Task,
            Task2: types_impl_1.Task2,
            DebugAdapterExecutable: types_impl_1.DebugAdapterExecutable,
            DebugAdapterServer: types_impl_1.DebugAdapterServer,
            DebugAdapterNamedPipeServer: types_impl_1.DebugAdapterNamedPipeServer,
            DebugAdapterInlineImplementation: types_impl_1.DebugAdapterInlineImplementation,
            DebugConfigurationProviderTriggerKind: plugin_api_rpc_1.DebugConfigurationProviderTriggerKind,
            Breakpoint: types_impl_1.Breakpoint,
            SourceBreakpoint: types_impl_1.SourceBreakpoint,
            FunctionBreakpoint: types_impl_1.FunctionBreakpoint,
            Color: types_impl_1.Color,
            ColorInformation: types_impl_1.ColorInformation,
            ColorPresentation: types_impl_1.ColorPresentation,
            FoldingRange: types_impl_1.FoldingRange,
            SelectionRange: types_impl_1.SelectionRange,
            FoldingRangeKind: types_impl_1.FoldingRangeKind,
            OperatingSystem: types_impl_1.OperatingSystem,
            WebviewPanelTargetArea: types_impl_1.WebviewPanelTargetArea,
            UIKind: types_impl_1.UIKind,
            FileSystemError: types_impl_1.FileSystemError,
            CommentThreadState: types_impl_1.CommentThreadState,
            CommentThreadCollapsibleState: types_impl_1.CommentThreadCollapsibleState,
            QuickInputButtons: types_impl_1.QuickInputButtons,
            CommentMode: types_impl_1.CommentMode,
            CallHierarchyItem: types_impl_1.CallHierarchyItem,
            CallHierarchyIncomingCall: types_impl_1.CallHierarchyIncomingCall,
            CallHierarchyOutgoingCall: types_impl_1.CallHierarchyOutgoingCall,
            TypeHierarchyItem: types_impl_1.TypeHierarchyItem,
            TimelineItem: types_impl_1.TimelineItem,
            EnvironmentVariableMutatorType: types_impl_1.EnvironmentVariableMutatorType,
            SemanticTokensLegend: types_impl_1.SemanticTokensLegend,
            SemanticTokensBuilder: types_impl_1.SemanticTokensBuilder,
            SemanticTokens: types_impl_1.SemanticTokens,
            SemanticTokensEdits: types_impl_1.SemanticTokensEdits,
            SemanticTokensEdit: types_impl_1.SemanticTokensEdit,
            TextDocumentChangeReason: types_impl_1.TextDocumentChangeReason,
            ColorThemeKind: types_impl_1.ColorThemeKind,
            SourceControlInputBoxValidationType: types_impl_1.SourceControlInputBoxValidationType,
            FileDecoration: types_impl_1.FileDecoration,
            TerminalLink: types_impl_1.TerminalLink,
            TerminalProfile: types_impl_1.TerminalProfile,
            CancellationError: cancellation_1.CancellationError,
            ExtensionMode: types_impl_1.ExtensionMode,
            LinkedEditingRanges: types_impl_1.LinkedEditingRanges,
            InputBoxValidationSeverity: types_impl_1.InputBoxValidationSeverity,
            InlayHint: types_impl_1.InlayHint,
            InlayHintKind: types_impl_1.InlayHintKind,
            InlayHintLabelPart: types_impl_1.InlayHintLabelPart,
            TelemetryTrustedValue: types_impl_1.TelemetryTrustedValue,
            NotebookCellData: types_impl_1.NotebookCellData,
            NotebookCellExecutionState: types_impl_1.NotebookCellExecutionState,
            NotebookCellKind: types_impl_1.NotebookCellKind,
            NotebookCellOutput: types_impl_1.NotebookCellOutput,
            NotebookCellOutputItem: types_impl_1.NotebookCellOutputItem,
            NotebookCellStatusBarAlignment: types_impl_1.NotebookCellStatusBarAlignment,
            NotebookCellStatusBarItem: types_impl_1.NotebookCellStatusBarItem,
            NotebookControllerAffinity: types_impl_1.NotebookControllerAffinity,
            NotebookData: types_impl_1.NotebookData,
            NotebookEditorRevealType: types_impl_1.NotebookEditorRevealType,
            NotebookDocument: notebook_document_1.NotebookDocument,
            NotebookRange: types_impl_1.NotebookRange,
            NotebookEdit: types_impl_1.NotebookEdit,
            NotebookKernelSourceAction: types_impl_1.NotebookKernelSourceAction,
            NotebookRendererScript: types_impl_1.NotebookRendererScript,
            TestRunProfileKind: types_impl_1.TestRunProfileKind,
            TestTag: types_impl_1.TestTag,
            TestRunRequest: types_impl_1.TestRunRequest,
            TestMessage: types_impl_1.TestMessage,
            ExtensionKind: types_impl_1.ExtensionKind,
            InlineCompletionItem: types_impl_1.InlineCompletionItem,
            InlineCompletionList: types_impl_1.InlineCompletionList,
            InlineCompletionTriggerKind: types_impl_1.InlineCompletionTriggerKind,
            TabInputText: types_impl_1.TextTabInput,
            TabInputTextDiff: types_impl_1.TextDiffTabInput,
            TabInputTextMerge: types_impl_1.TextMergeTabInput,
            TabInputCustom: types_impl_1.CustomEditorTabInput,
            TabInputNotebook: types_impl_1.NotebookEditorTabInput,
            TabInputNotebookDiff: types_impl_1.NotebookDiffEditorTabInput,
            TabInputWebview: types_impl_1.WebviewEditorTabInput,
            TabInputTerminal: types_impl_1.TerminalEditorTabInput,
            TerminalLocation: types_impl_1.TerminalLocation,
            TerminalOutputAnchor: types_impl_1.TerminalOutputAnchor,
            TerminalExitReason: types_impl_1.TerminalExitReason,
            DocumentPasteEdit: types_impl_1.DocumentPasteEdit,
            ExternalUriOpenerPriority: types_impl_1.ExternalUriOpenerPriority,
            TerminalQuickFixType: types_impl_1.TerminalQuickFixType,
            EditSessionIdentityMatch: types_impl_1.EditSessionIdentityMatch
        };
    };
}
exports.createAPIFactory = createAPIFactory;
class Plugin {
    constructor(pluginManager, plugin) {
        _Plugin_pluginManager.set(this, void 0);
        __classPrivateFieldSet(this, _Plugin_pluginManager, pluginManager, "f");
        this.id = plugin.model.id;
        this.pluginPath = plugin.pluginFolder;
        this.packageJSON = plugin.rawModel;
        this.pluginType = plugin.model.entryPoint.frontend ? 'frontend' : 'backend';
        if (this.pluginType === 'frontend') {
            const { origin } = new endpoint_1.Endpoint();
            this.pluginUri = types_impl_1.URI.parse(origin + '/' + common_1.PluginPackage.toPluginUrl(plugin.model, ''));
        }
        else {
            this.pluginUri = types_impl_1.URI.parse(plugin.pluginUri);
        }
    }
    get isActive() {
        return __classPrivateFieldGet(this, _Plugin_pluginManager, "f").isActive(this.id);
    }
    get exports() {
        return __classPrivateFieldGet(this, _Plugin_pluginManager, "f").getPluginExport(this.id);
    }
    activate() {
        return __classPrivateFieldGet(this, _Plugin_pluginManager, "f").activatePlugin(this.id).then(() => this.exports);
    }
}
exports.Plugin = Plugin;
_Plugin_pluginManager = new WeakMap();
class PluginExt extends Plugin {
    constructor(pluginManager, plugin, isFromDifferentExtensionHost = false) {
        super(pluginManager, plugin);
        _PluginExt_pluginManager.set(this, void 0);
        __classPrivateFieldSet(this, _PluginExt_pluginManager, pluginManager, "f");
        this.extensionPath = this.pluginPath;
        this.extensionUri = this.pluginUri;
        this.extensionKind = types_impl_1.ExtensionKind.UI; // stub as a local extension (not running on a remote workspace)
        this.isFromDifferentExtensionHost = isFromDifferentExtensionHost;
    }
    get isActive() {
        return __classPrivateFieldGet(this, _PluginExt_pluginManager, "f").isActive(this.id);
    }
    get exports() {
        return __classPrivateFieldGet(this, _PluginExt_pluginManager, "f").getPluginExport(this.id);
    }
    activate() {
        return __classPrivateFieldGet(this, _PluginExt_pluginManager, "f").activatePlugin(this.id).then(() => this.exports);
    }
}
exports.PluginExt = PluginExt;
_PluginExt_pluginManager = new WeakMap();
//# sourceMappingURL=plugin-context.js.map