"use strict";
(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_monaco_lib_browser_monaco-frontend-module_js"],{

/***/ "../../packages/monaco/lib/browser/markdown-renderer/monaco-markdown-renderer.js":
/*!***************************************************************************************!*\
  !*** ../../packages/monaco/lib/browser/markdown-renderer/monaco-markdown-renderer.js ***!
  \***************************************************************************************/
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
exports.MonacoMarkdownRenderer = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const language_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/common/languages/language */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/common/languages/language.js");
const markdownRenderer_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/contrib/markdownRenderer/browser/markdownRenderer */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/contrib/markdownRenderer/browser/markdownRenderer.js");
const standaloneServices_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices.js");
const monaco_command_service_1 = __webpack_require__(/*! ../monaco-command-service */ "../../packages/monaco/lib/browser/monaco-command-service.js");
const monaco_editor_service_1 = __webpack_require__(/*! ../monaco-editor-service */ "../../packages/monaco/lib/browser/monaco-editor-service.js");
const openerService_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/browser/services/openerService */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/browser/services/openerService.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const lifecycle_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/base/common/lifecycle */ "../../node_modules/@theia/monaco-editor-core/esm/vs/base/common/lifecycle.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
let MonacoMarkdownRenderer = class MonacoMarkdownRenderer {
    render(markdown, options, markedOptions) {
        return this.delegate.render(markdown, this.transformOptions(options), markedOptions);
    }
    transformOptions(options) {
        if (!(options === null || options === void 0 ? void 0 : options.actionHandler)) {
            return options;
        }
        const monacoActionHandler = {
            disposables: this.toDisposableStore(options.actionHandler.disposables),
            callback: (content, e) => options.actionHandler.callback(content, e === null || e === void 0 ? void 0 : e.browserEvent)
        };
        return { ...options, actionHandler: monacoActionHandler };
    }
    toDisposableStore(current) {
        if (current instanceof lifecycle_1.DisposableStore) {
            return current;
        }
        else if (current instanceof core_1.DisposableCollection) {
            const store = new lifecycle_1.DisposableStore();
            current['disposables'].forEach(disposable => store.add(disposable));
            return store;
        }
        else {
            return new lifecycle_1.DisposableStore();
        }
    }
    init() {
        const languages = standaloneServices_1.StandaloneServices.get(language_1.ILanguageService);
        const openerService = new openerService_1.OpenerService(this.codeEditorService, this.commandServiceFactory());
        openerService.registerOpener({
            open: (u, options) => this.interceptOpen(u, options)
        });
        const getPreference = () => this.preferences.get('editor.fontFamily');
        const rendererOptions = new Proxy(Object.create(null), {
            get(_, field) {
                if (field === 'codeBlockFontFamily') {
                    return getPreference();
                }
                else {
                    return undefined;
                }
            }
        });
        this.delegate = new markdownRenderer_1.MarkdownRenderer(rendererOptions, languages, openerService);
    }
    async interceptOpen(monacoUri, monacoOptions) {
        let options = undefined;
        if (monacoOptions) {
            if ('openToSide' in monacoOptions && monacoOptions.openToSide) {
                options = Object.assign(options || {}, {
                    widgetOptions: {
                        mode: 'split-right'
                    }
                });
            }
            if ('openExternal' in monacoOptions && monacoOptions.openExternal) {
                options = Object.assign(options || {}, {
                    openExternal: true
                });
            }
        }
        const uri = new uri_1.URI(monacoUri.toString());
        try {
            await (0, browser_1.open)(this.openerService, uri, options);
            return true;
        }
        catch (e) {
            console.error(`Fail to open '${uri.toString()}':`, e);
            return false;
        }
    }
};
__decorate([
    (0, inversify_1.inject)(monaco_editor_service_1.MonacoEditorService),
    __metadata("design:type", monaco_editor_service_1.MonacoEditorService)
], MonacoMarkdownRenderer.prototype, "codeEditorService", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_command_service_1.MonacoCommandServiceFactory),
    __metadata("design:type", Function)
], MonacoMarkdownRenderer.prototype, "commandServiceFactory", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.OpenerService),
    __metadata("design:type", Object)
], MonacoMarkdownRenderer.prototype, "openerService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.PreferenceService),
    __metadata("design:type", Object)
], MonacoMarkdownRenderer.prototype, "preferences", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MonacoMarkdownRenderer.prototype, "init", null);
MonacoMarkdownRenderer = __decorate([
    (0, inversify_1.injectable)()
], MonacoMarkdownRenderer);
exports.MonacoMarkdownRenderer = MonacoMarkdownRenderer;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/monaco/lib/browser/markdown-renderer/monaco-markdown-renderer'] = this;


/***/ }),

/***/ "../../packages/monaco/lib/browser/monaco-command-registry.js":
/*!********************************************************************!*\
  !*** ../../packages/monaco/lib/browser/monaco-command-registry.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MonacoCommandRegistry = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/editor/lib/browser */ "../../packages/editor/lib/browser/index.js");
const monaco_editor_provider_1 = __webpack_require__(/*! ./monaco-editor-provider */ "../../packages/monaco/lib/browser/monaco-editor-provider.js");
let MonacoCommandRegistry = class MonacoCommandRegistry {
    validate(command) {
        return this.commands.commandIds.indexOf(command) !== -1 ? command : undefined;
    }
    registerCommand(command, handler) {
        this.commands.registerCommand({
            ...command,
            id: command.id
        }, this.newHandler(handler));
    }
    registerHandler(command, handler) {
        this.commands.registerHandler(command, this.newHandler(handler));
    }
    newHandler(monacoHandler) {
        return {
            execute: (...args) => this.execute(monacoHandler, ...args),
            isEnabled: (...args) => this.isEnabled(monacoHandler, ...args),
            isVisible: (...args) => this.isVisible(monacoHandler, ...args)
        };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    execute(monacoHandler, ...args) {
        const editor = this.monacoEditors.current;
        if (editor) {
            return Promise.resolve(monacoHandler.execute(editor, ...args));
        }
        return Promise.resolve();
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    isEnabled(monacoHandler, ...args) {
        const editor = this.monacoEditors.current;
        return !!editor && (!monacoHandler.isEnabled || monacoHandler.isEnabled(editor, ...args));
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    isVisible(monacoHandler, ...args) {
        return browser_1.TextEditorSelection.is(this.selectionService.selection);
    }
};
__decorate([
    (0, inversify_1.inject)(monaco_editor_provider_1.MonacoEditorProvider),
    __metadata("design:type", monaco_editor_provider_1.MonacoEditorProvider)
], MonacoCommandRegistry.prototype, "monacoEditors", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.CommandRegistry),
    __metadata("design:type", core_1.CommandRegistry)
], MonacoCommandRegistry.prototype, "commands", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.SelectionService),
    __metadata("design:type", core_1.SelectionService)
], MonacoCommandRegistry.prototype, "selectionService", void 0);
MonacoCommandRegistry = __decorate([
    (0, inversify_1.injectable)()
], MonacoCommandRegistry);
exports.MonacoCommandRegistry = MonacoCommandRegistry;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/monaco/lib/browser/monaco-command-registry'] = this;


/***/ }),

/***/ "../../packages/monaco/lib/browser/monaco-command.js":
/*!***********************************************************!*\
  !*** ../../packages/monaco/lib/browser/monaco-command.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MonacoEditorCommandHandlers = exports.MonacoCommands = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const command_1 = __webpack_require__(/*! @theia/core/lib/common/command */ "../../packages/core/lib/common/command.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const browser_2 = __webpack_require__(/*! @theia/editor/lib/browser */ "../../packages/editor/lib/browser/index.js");
const monaco_editor_1 = __webpack_require__(/*! ./monaco-editor */ "../../packages/monaco/lib/browser/monaco-editor.js");
const monaco_command_registry_1 = __webpack_require__(/*! ./monaco-command-registry */ "../../packages/monaco/lib/browser/monaco-command-registry.js");
const monaco_editor_service_1 = __webpack_require__(/*! ./monaco-editor-service */ "../../packages/monaco/lib/browser/monaco-editor-service.js");
const monaco_text_model_service_1 = __webpack_require__(/*! ./monaco-text-model-service */ "../../packages/monaco/lib/browser/monaco-text-model-service.js");
const protocol_to_monaco_converter_1 = __webpack_require__(/*! ./protocol-to-monaco-converter */ "../../packages/monaco/lib/browser/protocol-to-monaco-converter.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
const contextKeyService_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/platform/contextkey/browser/contextKeyService */ "../../node_modules/@theia/monaco-editor-core/esm/vs/platform/contextkey/browser/contextKeyService.js");
const editorExtensions_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/browser/editorExtensions */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/browser/editorExtensions.js");
const commands_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/platform/commands/common/commands */ "../../node_modules/@theia/monaco-editor-core/esm/vs/platform/commands/common/commands.js");
const monaco = __webpack_require__(/*! @theia/monaco-editor-core */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/editor.main.js");
const standaloneServices_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices.js");
var MonacoCommands;
(function (MonacoCommands) {
    MonacoCommands.COMMON_ACTIONS = new Map([
        ['undo', browser_1.CommonCommands.UNDO.id],
        ['redo', browser_1.CommonCommands.REDO.id],
        ['editor.action.selectAll', browser_1.CommonCommands.SELECT_ALL.id],
        ['actions.find', browser_1.CommonCommands.FIND.id],
        ['editor.action.startFindReplaceAction', browser_1.CommonCommands.REPLACE.id]
    ]);
    MonacoCommands.GO_TO_DEFINITION = 'editor.action.revealDefinition';
    MonacoCommands.EXCLUDE_ACTIONS = new Set([
        'editor.action.quickCommand',
        'editor.action.clipboardCutAction',
        'editor.action.clipboardCopyAction',
        'editor.action.clipboardPasteAction'
    ]);
})(MonacoCommands = exports.MonacoCommands || (exports.MonacoCommands = {}));
let MonacoEditorCommandHandlers = class MonacoEditorCommandHandlers {
    registerCommands() {
        this.registerMonacoCommands();
        this.registerEditorCommandHandlers();
    }
    /**
     * Register commands from Monaco to Theia registry.
     *
     * Monaco has different kind of commands which should be handled differently by Theia.
     *
     * ### Editor Actions
     *
     * They should be registered with a label to be visible in the quick command palette.
     *
     * Such actions should be enabled only if the current editor is available and
     * it supports such action in the current context.
     *
     * ### Editor Commands
     *
     * Such actions should be enabled only if the current editor is available.
     *
     * `actions.find` and `editor.action.startFindReplaceAction` are registered as handlers for `find` and `replace`.
     * If handlers are not enabled then the core should prevent the default browser behavior.
     * Other Theia extensions can register alternative implementations using custom enablement.
     *
     * ### Global Commands
     *
     * These commands are not necessary dependent on the current editor and enabled always.
     * But they depend on services which are global in VS Code, but bound to the editor in Monaco,
     * i.e. `ICodeEditorService` or `IContextKeyService`. We should take care of providing Theia implementations for such services.
     *
     * #### Global Native or Editor Commands
     *
     * Namely: `undo`, `redo` and `editor.action.selectAll`. They depend on `ICodeEditorService`.
     * They will try to delegate to the current editor and if it is not available delegate to the browser.
     * They are registered as handlers for corresponding core commands always.
     * Other Theia extensions can provide alternative implementations by introducing a dependency to `@theia/monaco` extension.
     *
     * #### Global Language Commands
     *
     * Like `_executeCodeActionProvider`, they depend on `ICodeEditorService` and `ITextModelService`.
     *
     * #### Global Context Commands
     *
     * It is `setContext`. It depends on `IContextKeyService`.
     *
     * #### Global Editor Commands
     *
     * Like `openReferenceToSide` and `openReference`, they depend on `IListService`.
     * We treat all commands which don't match any other category of global commands as global editor commands
     * and execute them using the instantiation service of the current editor.
     */
    registerMonacoCommands() {
        const editorActions = new Map(editorExtensions_1.EditorExtensionsRegistry.getEditorActions().map(({ id, label, alias }) => [id, { label, alias }]));
        const { codeEditorService } = this;
        const globalInstantiationService = standaloneServices_1.StandaloneServices.initialize({});
        const monacoCommands = commands_1.CommandsRegistry.getCommands();
        for (const id of monacoCommands.keys()) {
            if (MonacoCommands.EXCLUDE_ACTIONS.has(id)) {
                continue;
            }
            const handler = {
                execute: (...args) => {
                    /*
                     * We check monaco focused code editor first since they can contain inline like the debug console and embedded editors like in the peek reference.
                     * If there is not such then we check last focused editor tracked by us.
                     */
                    const editor = codeEditorService.getFocusedCodeEditor() || codeEditorService.getActiveCodeEditor();
                    if (editorActions.has(id)) {
                        const action = editor && editor.getAction(id);
                        if (!action) {
                            return;
                        }
                        return action.run();
                    }
                    if (!globalInstantiationService) {
                        return;
                    }
                    return globalInstantiationService.invokeFunction(monacoCommands.get(id).handler, ...args);
                },
                isEnabled: () => {
                    const editor = codeEditorService.getFocusedCodeEditor() || codeEditorService.getActiveCodeEditor();
                    if (editorActions.has(id)) {
                        const action = editor && editor.getAction(id);
                        return !!action && action.isSupported();
                    }
                    if (!!editorExtensions_1.EditorExtensionsRegistry.getEditorCommand(id)) {
                        return !!editor;
                    }
                    return true;
                }
            };
            const commandAction = editorActions.get(id);
            this.commandRegistry.registerCommand({ id, label: commandAction === null || commandAction === void 0 ? void 0 : commandAction.label, originalLabel: commandAction === null || commandAction === void 0 ? void 0 : commandAction.alias }, handler);
            const coreCommand = MonacoCommands.COMMON_ACTIONS.get(id);
            if (coreCommand) {
                this.commandRegistry.registerHandler(coreCommand, handler);
            }
        }
    }
    registerEditorCommandHandlers() {
        this.monacoCommandRegistry.registerHandler(browser_2.EditorCommands.SHOW_REFERENCES.id, this.newShowReferenceHandler());
        this.monacoCommandRegistry.registerHandler(browser_2.EditorCommands.CONFIG_INDENTATION.id, this.newConfigIndentationHandler());
        this.monacoCommandRegistry.registerHandler(browser_2.EditorCommands.CONFIG_EOL.id, this.newConfigEolHandler());
        this.monacoCommandRegistry.registerHandler(browser_2.EditorCommands.INDENT_USING_SPACES.id, this.newConfigTabSizeHandler(true));
        this.monacoCommandRegistry.registerHandler(browser_2.EditorCommands.INDENT_USING_TABS.id, this.newConfigTabSizeHandler(false));
        this.monacoCommandRegistry.registerHandler(browser_2.EditorCommands.REVERT_EDITOR.id, this.newRevertActiveEditorHandler());
        this.monacoCommandRegistry.registerHandler(browser_2.EditorCommands.REVERT_AND_CLOSE.id, this.newRevertAndCloseActiveEditorHandler());
    }
    newShowReferenceHandler() {
        return {
            execute: (editor, uri, position, locations) => {
                standaloneServices_1.StandaloneServices.get(commands_1.ICommandService).executeCommand('editor.action.showReferences', monaco.Uri.parse(uri), this.p2m.asPosition(position), locations.map(l => this.p2m.asLocation(l)));
            }
        };
    }
    newConfigIndentationHandler() {
        return {
            execute: editor => this.configureIndentation(editor)
        };
    }
    configureIndentation(editor) {
        var _a;
        const items = [true, false].map(useSpaces => ({
            label: nls_1.nls.localizeByDefault(`Indent Using ${useSpaces ? 'Spaces' : 'Tabs'}`),
            execute: () => this.configureTabSize(editor, useSpaces)
        }));
        (_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.showQuickPick(items, { placeholder: nls_1.nls.localizeByDefault('Select Action') });
    }
    newConfigEolHandler() {
        return {
            execute: editor => this.configureEol(editor)
        };
    }
    configureEol(editor) {
        var _a;
        const items = ['LF', 'CRLF'].map(lineEnding => ({
            label: lineEnding,
            execute: () => this.setEol(editor, lineEnding)
        }));
        (_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.showQuickPick(items, { placeholder: nls_1.nls.localizeByDefault('Select End of Line Sequence') });
    }
    setEol(editor, lineEnding) {
        const model = editor.document && editor.document.textEditorModel;
        if (model) {
            if (lineEnding === 'CRLF' || lineEnding === '\r\n') {
                model.pushEOL(1 /* CRLF */);
            }
            else {
                model.pushEOL(0 /* LF */);
            }
        }
    }
    newConfigTabSizeHandler(useSpaces) {
        return {
            execute: editor => this.configureTabSize(editor, useSpaces)
        };
    }
    configureTabSize(editor, useSpaces) {
        var _a;
        const model = editor.document && editor.document.textEditorModel;
        if (model) {
            const { tabSize } = model.getOptions();
            const sizes = Array.from(Array(8), (_, x) => x + 1);
            const tabSizeOptions = sizes.map(size => ({
                label: size === tabSize ? size + '   ' + nls_1.nls.localizeByDefault('Configured Tab Size') : size.toString(),
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                execute: () => model.updateOptions({
                    tabSize: size || tabSize,
                    insertSpaces: useSpaces
                })
            }));
            (_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.showQuickPick(tabSizeOptions, { placeholder: nls_1.nls.localizeByDefault('Select Tab Size for Current File') });
        }
    }
    newRevertActiveEditorHandler() {
        return {
            execute: () => this.revertEditor(this.getActiveEditor().editor),
        };
    }
    newRevertAndCloseActiveEditorHandler() {
        return {
            execute: async () => this.revertAndCloseActiveEditor(this.getActiveEditor())
        };
    }
    getActiveEditor() {
        const widget = this.editorManager.currentEditor;
        return { widget, editor: widget && monaco_editor_1.MonacoEditor.getCurrent(this.editorManager) };
    }
    async revertEditor(editor) {
        if (editor) {
            return editor.document.revert();
        }
    }
    async revertAndCloseActiveEditor(current) {
        if (current.editor && current.widget) {
            try {
                await this.revertEditor(current.editor);
                current.widget.close();
            }
            catch (error) {
                await this.shell.closeWidget(current.widget.id, { save: false });
            }
        }
    }
};
__decorate([
    (0, inversify_1.inject)(monaco_command_registry_1.MonacoCommandRegistry),
    __metadata("design:type", monaco_command_registry_1.MonacoCommandRegistry)
], MonacoEditorCommandHandlers.prototype, "monacoCommandRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(command_1.CommandRegistry),
    __metadata("design:type", command_1.CommandRegistry)
], MonacoEditorCommandHandlers.prototype, "commandRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(protocol_to_monaco_converter_1.ProtocolToMonacoConverter),
    __metadata("design:type", protocol_to_monaco_converter_1.ProtocolToMonacoConverter)
], MonacoEditorCommandHandlers.prototype, "p2m", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.QuickInputService),
    (0, inversify_1.optional)(),
    __metadata("design:type", Object)
], MonacoEditorCommandHandlers.prototype, "quickInputService", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_editor_service_1.MonacoEditorService),
    __metadata("design:type", monaco_editor_service_1.MonacoEditorService)
], MonacoEditorCommandHandlers.prototype, "codeEditorService", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_text_model_service_1.MonacoTextModelService),
    __metadata("design:type", monaco_text_model_service_1.MonacoTextModelService)
], MonacoEditorCommandHandlers.prototype, "textModelService", void 0);
__decorate([
    (0, inversify_1.inject)(contextKeyService_1.ContextKeyService),
    __metadata("design:type", contextKeyService_1.ContextKeyService)
], MonacoEditorCommandHandlers.prototype, "contextKeyService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.ApplicationShell),
    __metadata("design:type", browser_1.ApplicationShell)
], MonacoEditorCommandHandlers.prototype, "shell", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.EditorManager),
    __metadata("design:type", browser_2.EditorManager)
], MonacoEditorCommandHandlers.prototype, "editorManager", void 0);
MonacoEditorCommandHandlers = __decorate([
    (0, inversify_1.injectable)()
], MonacoEditorCommandHandlers);
exports.MonacoEditorCommandHandlers = MonacoEditorCommandHandlers;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/monaco/lib/browser/monaco-command'] = this;


/***/ }),

/***/ "../../packages/monaco/lib/browser/monaco-context-key-service.js":
/*!***********************************************************************!*\
  !*** ../../packages/monaco/lib/browser/monaco-context-key-service.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MonacoContextKeyService = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const contextKeyService_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/platform/contextkey/browser/contextKeyService */ "../../node_modules/@theia/monaco-editor-core/esm/vs/platform/contextkey/browser/contextKeyService.js");
const contextkey_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/platform/contextkey/common/contextkey */ "../../node_modules/@theia/monaco-editor-core/esm/vs/platform/contextkey/common/contextkey.js");
let MonacoContextKeyService = class MonacoContextKeyService {
    constructor() {
        this.onDidChangeEmitter = new core_1.Emitter();
        this.onDidChange = this.onDidChangeEmitter.event;
        this.expressions = new Map();
    }
    init() {
        this.contextKeyService.onDidChangeContext(e => this.onDidChangeEmitter.fire({
            affects: keys => e.affectsSome(keys)
        }));
    }
    createKey(key, defaultValue) {
        return this.contextKeyService.createKey(key, defaultValue);
    }
    match(expression, context) {
        const parsed = this.parse(expression);
        if (parsed) {
            const ctx = this.identifyContext(context);
            if (!ctx) {
                return this.contextKeyService.contextMatchesRules(parsed);
            }
            return parsed.evaluate(ctx);
        }
        return true;
    }
    identifyContext(callersContext, service = this.contextKeyService) {
        var _a;
        if (callersContext && 'getValue' in callersContext) {
            return callersContext;
        }
        else if (this.activeContext && 'getValue' in this.activeContext) {
            return this.activeContext;
        }
        const browserContext = (_a = callersContext !== null && callersContext !== void 0 ? callersContext : this.activeContext) !== null && _a !== void 0 ? _a : (document.activeElement instanceof HTMLElement ? document.activeElement : undefined);
        if (browserContext) {
            return service.getContext(browserContext);
        }
        return undefined;
    }
    parse(when) {
        let expression = this.expressions.get(when);
        if (!expression) {
            expression = contextkey_1.ContextKeyExpr.deserialize(when);
            if (expression) {
                this.expressions.set(when, expression);
            }
        }
        return expression;
    }
    parseKeys(expression) {
        const expr = contextkey_1.ContextKeyExpr.deserialize(expression);
        return expr ? new Set(expr.keys()) : expr;
    }
    with(values, callback) {
        const oldActive = this.activeContext;
        const id = this.contextKeyService.createChildContext();
        const child = this.contextKeyService.getContextValuesContainer(id);
        for (const [key, value] of Object.entries(values)) {
            child.setValue(key, value);
        }
        this.activeContext = child;
        try {
            return callback();
        }
        finally {
            this.activeContext = oldActive;
            this.contextKeyService.disposeContext(id);
        }
    }
    createScoped(target) {
        const scoped = this.contextKeyService.createScoped(target);
        if (scoped instanceof contextKeyService_1.AbstractContextKeyService) {
            return scoped;
        }
        return this;
    }
    createOverlay(overlay) {
        const delegate = this.contextKeyService.createOverlay(overlay);
        return {
            match: (expression, context) => {
                const parsed = this.parse(expression);
                if (parsed) {
                    const ctx = this.identifyContext(context, delegate);
                    if (!ctx) {
                        return delegate.contextMatchesRules(parsed);
                    }
                    return parsed.evaluate(ctx);
                }
                return true;
            },
            dispose: () => delegate.dispose(),
        };
    }
    setContext(key, value) {
        this.contextKeyService.setContext(key, value);
    }
    dispose() {
        this.activeContext = undefined;
        this.onDidChangeEmitter.dispose();
        this.contextKeyService.dispose();
    }
};
__decorate([
    (0, inversify_1.inject)(contextKeyService_1.ContextKeyService),
    __metadata("design:type", contextKeyService_1.ContextKeyService)
], MonacoContextKeyService.prototype, "contextKeyService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MonacoContextKeyService.prototype, "init", null);
MonacoContextKeyService = __decorate([
    (0, inversify_1.injectable)()
], MonacoContextKeyService);
exports.MonacoContextKeyService = MonacoContextKeyService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/monaco/lib/browser/monaco-context-key-service'] = this;


/***/ }),

/***/ "../../packages/monaco/lib/browser/monaco-formatting-conflicts.js":
/*!************************************************************************!*\
  !*** ../../packages/monaco/lib/browser/monaco-formatting-conflicts.js ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2020 Red Hat, Inc. and others.
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
exports.MonacoFormattingConflictsContribution = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const browser_2 = __webpack_require__(/*! @theia/editor/lib/browser */ "../../packages/editor/lib/browser/index.js");
const monaco_quick_input_service_1 = __webpack_require__(/*! ./monaco-quick-input-service */ "../../packages/monaco/lib/browser/monaco-quick-input-service.js");
const format_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/contrib/format/browser/format */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/contrib/format/browser/format.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
const PREFERENCE_NAME = 'editor.defaultFormatter';
let MonacoFormattingConflictsContribution = class MonacoFormattingConflictsContribution {
    async initialize() {
        format_1.FormattingConflicts.setFormatterSelector((formatters, document, mode) => this.selectFormatter(formatters, document, mode));
    }
    async setDefaultFormatter(language, formatter) {
        const name = this.preferenceSchema.overridePreferenceName({
            preferenceName: PREFERENCE_NAME,
            overrideIdentifier: language
        });
        await this.preferenceService.set(name, formatter);
    }
    getDefaultFormatter(language) {
        const name = this.preferenceSchema.overridePreferenceName({
            preferenceName: PREFERENCE_NAME,
            overrideIdentifier: language
        });
        return this.preferenceService.get(name);
    }
    async selectFormatter(formatters, document, mode) {
        if (formatters.length === 0) {
            return undefined;
        }
        if (formatters.length === 1) {
            return formatters[0];
        }
        const currentEditor = this.editorManager.currentEditor;
        if (!currentEditor) {
            return undefined;
        }
        const languageId = currentEditor.editor.document.languageId;
        const defaultFormatterId = this.getDefaultFormatter(languageId);
        if (defaultFormatterId) {
            const formatter = formatters.find(f => f.extensionId && f.extensionId.value === defaultFormatterId);
            if (formatter) {
                return formatter;
            }
        }
        return new Promise(async (resolve, reject) => {
            const items = formatters
                .filter(formatter => formatter.displayName)
                .map(formatter => ({
                label: formatter.displayName,
                detail: formatter.extensionId ? formatter.extensionId.value : undefined,
                value: formatter,
            }))
                .sort((a, b) => a.label.localeCompare(b.label));
            const selectedFormatter = await this.monacoQuickInputService.showQuickPick(items, { placeholder: nls_1.nls.localizeByDefault('Format Document With...') });
            if (selectedFormatter) {
                this.setDefaultFormatter(languageId, selectedFormatter.detail ? selectedFormatter.detail : '');
                resolve(selectedFormatter.value);
            }
            else {
                resolve(undefined);
            }
        });
    }
};
__decorate([
    (0, inversify_1.inject)(monaco_quick_input_service_1.MonacoQuickInputService),
    __metadata("design:type", monaco_quick_input_service_1.MonacoQuickInputService)
], MonacoFormattingConflictsContribution.prototype, "monacoQuickInputService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.PreferenceService),
    __metadata("design:type", Object)
], MonacoFormattingConflictsContribution.prototype, "preferenceService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.PreferenceLanguageOverrideService),
    __metadata("design:type", browser_1.PreferenceLanguageOverrideService)
], MonacoFormattingConflictsContribution.prototype, "preferenceSchema", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.EditorManager),
    __metadata("design:type", browser_2.EditorManager)
], MonacoFormattingConflictsContribution.prototype, "editorManager", void 0);
MonacoFormattingConflictsContribution = __decorate([
    (0, inversify_1.injectable)()
], MonacoFormattingConflictsContribution);
exports.MonacoFormattingConflictsContribution = MonacoFormattingConflictsContribution;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/monaco/lib/browser/monaco-formatting-conflicts'] = this;


/***/ }),

/***/ "../../packages/monaco/lib/browser/monaco-frontend-application-contribution.js":
/*!*************************************************************************************!*\
  !*** ../../packages/monaco/lib/browser/monaco-frontend-application-contribution.js ***!
  \*************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2018 Ericsson and others.
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
exports.MonacoFrontendApplicationContribution = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const monaco_snippet_suggest_provider_1 = __webpack_require__(/*! ./monaco-snippet-suggest-provider */ "../../packages/monaco/lib/browser/monaco-snippet-suggest-provider.js");
const monaco = __webpack_require__(/*! @theia/monaco-editor-core */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/editor.main.js");
const suggest_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/contrib/suggest/browser/suggest */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/contrib/suggest/browser/suggest.js");
const monaco_editor_service_1 = __webpack_require__(/*! ./monaco-editor-service */ "../../packages/monaco/lib/browser/monaco-editor-service.js");
const monaco_text_model_service_1 = __webpack_require__(/*! ./monaco-text-model-service */ "../../packages/monaco/lib/browser/monaco-text-model-service.js");
const contextKeyService_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/platform/contextkey/browser/contextKeyService */ "../../node_modules/@theia/monaco-editor-core/esm/vs/platform/contextkey/browser/contextKeyService.js");
const standaloneServices_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices.js");
const codeEditorService_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/browser/services/codeEditorService */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/browser/services/codeEditorService.js");
const resolverService_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/common/services/resolverService */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/common/services/resolverService.js");
const contextkey_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/platform/contextkey/common/contextkey */ "../../node_modules/@theia/monaco-editor-core/esm/vs/platform/contextkey/common/contextkey.js");
const contextView_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/platform/contextview/browser/contextView */ "../../node_modules/@theia/monaco-editor-core/esm/vs/platform/contextview/browser/contextView.js");
const monaco_context_menu_1 = __webpack_require__(/*! ./monaco-context-menu */ "../../packages/monaco/lib/browser/monaco-context-menu.js");
const monaco_theming_service_1 = __webpack_require__(/*! ./monaco-theming-service */ "../../packages/monaco/lib/browser/monaco-theming-service.js");
const theme_1 = __webpack_require__(/*! @theia/core/lib/common/theme */ "../../packages/core/lib/common/theme.js");
const editorOptions_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/common/config/editorOptions */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/common/config/editorOptions.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const editor_generated_preference_schema_1 = __webpack_require__(/*! @theia/editor/lib/browser/editor-generated-preference-schema */ "../../packages/editor/lib/browser/editor-generated-preference-schema.js");
let theiaDidInitialize = false;
const originalInitialize = standaloneServices_1.StandaloneServices.initialize;
standaloneServices_1.StandaloneServices.initialize = overrides => {
    if (!theiaDidInitialize) {
        console.warn('Monaco was initialized before overrides were installed by Theia\'s initialization.'
            + ' Please check the lifecycle of services that use Monaco and ensure that Monaco entities are not instantiated before Theia is initialized.', new Error());
    }
    return originalInitialize(overrides);
};
let MonacoFrontendApplicationContribution = class MonacoFrontendApplicationContribution {
    init() {
        this.addAdditionalPreferenceValidations();
        const { codeEditorService, textModelService, contextKeyService, contextMenuService } = this;
        theiaDidInitialize = true;
        standaloneServices_1.StandaloneServices.initialize({
            [codeEditorService_1.ICodeEditorService.toString()]: codeEditorService,
            [resolverService_1.ITextModelService.toString()]: textModelService,
            [contextkey_1.IContextKeyService.toString()]: contextKeyService,
            [contextView_1.IContextMenuService.toString()]: contextMenuService,
        });
        // Monaco registers certain quick access providers (e.g. QuickCommandAccess) at import time, but we want to use our own.
        this.quickAccessRegistry.clear();
        /**
         * @monaco-uplift.Should be guaranteed to work.
         * Incomparable enums prevent TypeScript from believing that public ITextModel satisfied private ITextModel
         */
        (0, suggest_1.setSnippetSuggestSupport)(this.snippetSuggestProvider);
        for (const language of monaco.languages.getLanguages()) {
            this.preferenceSchema.registerOverrideIdentifier(language.id);
        }
        const registerLanguage = monaco.languages.register.bind(monaco.languages);
        monaco.languages.register = language => {
            // first register override identifier, because monaco will immediately update already opened documents and then initialize with bad preferences.
            this.preferenceSchema.registerOverrideIdentifier(language.id);
            registerLanguage(language);
        };
        this.monacoThemingService.initialize();
    }
    initialize() { }
    registerThemeStyle(theme, collector) {
        if ((0, theme_1.isHighContrast)(theme.type)) {
            const focusBorder = theme.getColor('focusBorder');
            const contrastBorder = theme.getColor('contrastBorder');
            if (focusBorder) {
                // Quick input
                collector.addRule(`
                    .quick-input-list .monaco-list-row {
                        outline-offset: -1px;
                    }
                    .quick-input-list .monaco-list-row.focused {
                        outline: 1px dotted ${focusBorder};
                    }
                    .quick-input-list .monaco-list-row:hover {
                        outline: 1px dashed ${focusBorder};
                    }
                `);
                // Input box always displays an outline, even when unfocused
                collector.addRule(`
                    .monaco-editor .find-widget .monaco-inputbox {
                        outline: var(--theia-border-width) solid;
                        outline-offset: calc(-1 * var(--theia-border-width));
                        outline-color: var(--theia-focusBorder);
                    }
                `);
            }
            if (contrastBorder) {
                collector.addRule(`
                    .quick-input-widget {
                        outline: 1px solid ${contrastBorder};
                        outline-offset: -1px;
                    }
                `);
            }
        }
        else {
            collector.addRule(`
                .quick-input-widget {
                    box-shadow: rgb(0 0 0 / 36%) 0px 0px 8px 2px;
                }
            `);
        }
    }
    /**
     * For reasons that are unclear, while most preferences that apply in editors are validated, a few are not.
     * There is a utility in `examples/api-samples/src/browser/monaco-editor-preferences/monaco-editor-preference-extractor.ts` to help determine which are not.
     * Check `src/vs/editor/common/config/editorOptions.ts` for constructor arguments and to make sure that the preference names used to extract constructors are still accurate.
     */
    addAdditionalPreferenceValidations() {
        let editorIntConstructor;
        let editorBoolConstructor;
        let editorStringEnumConstructor;
        for (const validator of editorOptions_1.editorOptionsRegistry) {
            /* eslint-disable @typescript-eslint/no-explicit-any,max-len */
            if (editorIntConstructor && editorBoolConstructor && editorStringEnumConstructor) {
                break;
            }
            if (validator.name === 'acceptSuggestionOnCommitCharacter') {
                editorBoolConstructor = validator.constructor;
            }
            else if (validator.name === 'acceptSuggestionOnEnter') {
                editorStringEnumConstructor = validator.constructor;
            }
            else if (validator.name === 'accessibilityPageSize') {
                editorIntConstructor = validator.constructor;
            }
            /* eslint-enable @typescript-eslint/no-explicit-any */
        }
        if (editorIntConstructor && editorBoolConstructor && editorStringEnumConstructor) {
            let id = 200; // Needs to be bigger than the biggest index in the EditorOption enum.
            editorOptions_1.editorOptionsRegistry.push(new editorIntConstructor(id++, 'tabSize', 4, 1, core_1.MAX_SAFE_INTEGER, editor_generated_preference_schema_1.editorGeneratedPreferenceProperties['editor.tabSize']), new editorBoolConstructor(id++, 'insertSpaces', true, editor_generated_preference_schema_1.editorGeneratedPreferenceProperties['editor.insertSpaces']), new editorBoolConstructor(id++, 'detectIndentation', true, editor_generated_preference_schema_1.editorGeneratedPreferenceProperties['editor.detectIndentation']), new editorBoolConstructor(id++, 'trimAutoWhitespace', true, editor_generated_preference_schema_1.editorGeneratedPreferenceProperties['editor.trimAutoWhitespace']), new editorBoolConstructor(id++, 'largeFileOptimizations', true, editor_generated_preference_schema_1.editorGeneratedPreferenceProperties['editor.largeFileOptimizations']), new editorBoolConstructor(id++, 'wordBasedSuggestions', true, editor_generated_preference_schema_1.editorGeneratedPreferenceProperties['editor.wordBasedSuggestions']), new editorStringEnumConstructor(id++, 'wordBasedSuggestionsMode', 'matchingDocuments', editor_generated_preference_schema_1.editorGeneratedPreferenceProperties['editor.wordBasedSuggestionsMode'].enum, editor_generated_preference_schema_1.editorGeneratedPreferenceProperties['editor.wordBasedSuggestionsMode']), new editorBoolConstructor(id++, 'stablePeek', false, editor_generated_preference_schema_1.editorGeneratedPreferenceProperties['editor.stablePeek']), new editorIntConstructor(id++, 'maxTokenizationLineLength', 20000, 1, core_1.MAX_SAFE_INTEGER, editor_generated_preference_schema_1.editorGeneratedPreferenceProperties['editor.maxTokenizationLineLength']));
        }
    }
};
__decorate([
    (0, inversify_1.inject)(monaco_editor_service_1.MonacoEditorService),
    __metadata("design:type", monaco_editor_service_1.MonacoEditorService)
], MonacoFrontendApplicationContribution.prototype, "codeEditorService", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_text_model_service_1.MonacoTextModelService),
    __metadata("design:type", monaco_text_model_service_1.MonacoTextModelService)
], MonacoFrontendApplicationContribution.prototype, "textModelService", void 0);
__decorate([
    (0, inversify_1.inject)(contextKeyService_1.ContextKeyService),
    __metadata("design:type", contextKeyService_1.ContextKeyService)
], MonacoFrontendApplicationContribution.prototype, "contextKeyService", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_snippet_suggest_provider_1.MonacoSnippetSuggestProvider),
    __metadata("design:type", monaco_snippet_suggest_provider_1.MonacoSnippetSuggestProvider)
], MonacoFrontendApplicationContribution.prototype, "snippetSuggestProvider", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.PreferenceSchemaProvider),
    __metadata("design:type", browser_1.PreferenceSchemaProvider)
], MonacoFrontendApplicationContribution.prototype, "preferenceSchema", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.QuickAccessRegistry),
    __metadata("design:type", Object)
], MonacoFrontendApplicationContribution.prototype, "quickAccessRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_context_menu_1.MonacoContextMenuService),
    __metadata("design:type", monaco_context_menu_1.MonacoContextMenuService)
], MonacoFrontendApplicationContribution.prototype, "contextMenuService", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_theming_service_1.MonacoThemingService),
    __metadata("design:type", monaco_theming_service_1.MonacoThemingService)
], MonacoFrontendApplicationContribution.prototype, "monacoThemingService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MonacoFrontendApplicationContribution.prototype, "init", null);
MonacoFrontendApplicationContribution = __decorate([
    (0, inversify_1.injectable)()
], MonacoFrontendApplicationContribution);
exports.MonacoFrontendApplicationContribution = MonacoFrontendApplicationContribution;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/monaco/lib/browser/monaco-frontend-application-contribution'] = this;


/***/ }),

/***/ "../../packages/monaco/lib/browser/monaco-frontend-module.js":
/*!*******************************************************************!*\
  !*** ../../packages/monaco/lib/browser/monaco-frontend-module.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createMonacoConfigurationService = exports.MonacoConfigurationService = void 0;
const MonacoNls = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/nls */ "../../node_modules/@theia/monaco-editor-core/esm/vs/nls.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
const localization_1 = __webpack_require__(/*! @theia/core/lib/common/i18n/localization */ "../../packages/core/lib/common/i18n/localization.js");
Object.assign(MonacoNls, {
    localize(_key, label, ...args) {
        if (nls_1.nls.locale) {
            const defaultKey = nls_1.nls.getDefaultKey(label);
            if (defaultKey) {
                return nls_1.nls.localize(defaultKey, label, ...args);
            }
        }
        return localization_1.Localization.format(label, args);
    }
});
__webpack_require__(/*! ../../src/browser/style/index.css */ "../../packages/monaco/src/browser/style/index.css");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const browser_2 = __webpack_require__(/*! @theia/editor/lib/browser */ "../../packages/editor/lib/browser/index.js");
const monaco_editor_provider_1 = __webpack_require__(/*! ./monaco-editor-provider */ "../../packages/monaco/lib/browser/monaco-editor-provider.js");
const monaco_menu_1 = __webpack_require__(/*! ./monaco-menu */ "../../packages/monaco/lib/browser/monaco-menu.js");
const monaco_command_1 = __webpack_require__(/*! ./monaco-command */ "../../packages/monaco/lib/browser/monaco-command.js");
const monaco_keybinding_1 = __webpack_require__(/*! ./monaco-keybinding */ "../../packages/monaco/lib/browser/monaco-keybinding.js");
const monaco_languages_1 = __webpack_require__(/*! ./monaco-languages */ "../../packages/monaco/lib/browser/monaco-languages.js");
const monaco_workspace_1 = __webpack_require__(/*! ./monaco-workspace */ "../../packages/monaco/lib/browser/monaco-workspace.js");
const monaco_editor_service_1 = __webpack_require__(/*! ./monaco-editor-service */ "../../packages/monaco/lib/browser/monaco-editor-service.js");
const monaco_text_model_service_1 = __webpack_require__(/*! ./monaco-text-model-service */ "../../packages/monaco/lib/browser/monaco-text-model-service.js");
const monaco_context_menu_1 = __webpack_require__(/*! ./monaco-context-menu */ "../../packages/monaco/lib/browser/monaco-context-menu.js");
const monaco_outline_contribution_1 = __webpack_require__(/*! ./monaco-outline-contribution */ "../../packages/monaco/lib/browser/monaco-outline-contribution.js");
const monaco_status_bar_contribution_1 = __webpack_require__(/*! ./monaco-status-bar-contribution */ "../../packages/monaco/lib/browser/monaco-status-bar-contribution.js");
const monaco_command_service_1 = __webpack_require__(/*! ./monaco-command-service */ "../../packages/monaco/lib/browser/monaco-command-service.js");
const monaco_command_registry_1 = __webpack_require__(/*! ./monaco-command-registry */ "../../packages/monaco/lib/browser/monaco-command-registry.js");
const monaco_diff_navigator_factory_1 = __webpack_require__(/*! ./monaco-diff-navigator-factory */ "../../packages/monaco/lib/browser/monaco-diff-navigator-factory.js");
const monaco_frontend_application_contribution_1 = __webpack_require__(/*! ./monaco-frontend-application-contribution */ "../../packages/monaco/lib/browser/monaco-frontend-application-contribution.js");
const monaco_textmate_frontend_bindings_1 = __webpack_require__(/*! ./textmate/monaco-textmate-frontend-bindings */ "../../packages/monaco/lib/browser/textmate/monaco-textmate-frontend-bindings.js");
const monaco_bulk_edit_service_1 = __webpack_require__(/*! ./monaco-bulk-edit-service */ "../../packages/monaco/lib/browser/monaco-bulk-edit-service.js");
const monaco_outline_decorator_1 = __webpack_require__(/*! ./monaco-outline-decorator */ "../../packages/monaco/lib/browser/monaco-outline-decorator.js");
const outline_decorator_service_1 = __webpack_require__(/*! @theia/outline-view/lib/browser/outline-decorator-service */ "../../packages/outline-view/lib/browser/outline-decorator-service.js");
const monaco_snippet_suggest_provider_1 = __webpack_require__(/*! ./monaco-snippet-suggest-provider */ "../../packages/monaco/lib/browser/monaco-snippet-suggest-provider.js");
const context_key_service_1 = __webpack_require__(/*! @theia/core/lib/browser/context-key-service */ "../../packages/core/lib/browser/context-key-service.js");
const monaco_context_key_service_1 = __webpack_require__(/*! ./monaco-context-key-service */ "../../packages/monaco/lib/browser/monaco-context-key-service.js");
const monaco_mime_service_1 = __webpack_require__(/*! ./monaco-mime-service */ "../../packages/monaco/lib/browser/monaco-mime-service.js");
const mime_service_1 = __webpack_require__(/*! @theia/core/lib/browser/mime-service */ "../../packages/core/lib/browser/mime-service.js");
const monaco_editor_1 = __webpack_require__(/*! ./monaco-editor */ "../../packages/monaco/lib/browser/monaco-editor.js");
const monaco_color_registry_1 = __webpack_require__(/*! ./monaco-color-registry */ "../../packages/monaco/lib/browser/monaco-color-registry.js");
const color_registry_1 = __webpack_require__(/*! @theia/core/lib/browser/color-registry */ "../../packages/core/lib/browser/color-registry.js");
const monaco_theming_service_1 = __webpack_require__(/*! ./monaco-theming-service */ "../../packages/monaco/lib/browser/monaco-theming-service.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const workspace_symbol_command_1 = __webpack_require__(/*! ./workspace-symbol-command */ "../../packages/monaco/lib/browser/workspace-symbol-command.js");
const language_service_1 = __webpack_require__(/*! @theia/core/lib/browser/language-service */ "../../packages/core/lib/browser/language-service.js");
const monaco_to_protocol_converter_1 = __webpack_require__(/*! ./monaco-to-protocol-converter */ "../../packages/monaco/lib/browser/monaco-to-protocol-converter.js");
const protocol_to_monaco_converter_1 = __webpack_require__(/*! ./protocol-to-monaco-converter */ "../../packages/monaco/lib/browser/protocol-to-monaco-converter.js");
const monaco_formatting_conflicts_1 = __webpack_require__(/*! ./monaco-formatting-conflicts */ "../../packages/monaco/lib/browser/monaco-formatting-conflicts.js");
const monaco_quick_input_service_1 = __webpack_require__(/*! ./monaco-quick-input-service */ "../../packages/monaco/lib/browser/monaco-quick-input-service.js");
const monaco_gotoline_quick_access_1 = __webpack_require__(/*! ./monaco-gotoline-quick-access */ "../../packages/monaco/lib/browser/monaco-gotoline-quick-access.js");
const monaco_gotosymbol_quick_access_1 = __webpack_require__(/*! ./monaco-gotosymbol-quick-access */ "../../packages/monaco/lib/browser/monaco-gotosymbol-quick-access.js");
const quick_access_1 = __webpack_require__(/*! @theia/core/lib/browser/quick-input/quick-access */ "../../packages/core/lib/browser/quick-input/quick-access.js");
const monaco_quick_access_registry_1 = __webpack_require__(/*! ./monaco-quick-access-registry */ "../../packages/monaco/lib/browser/monaco-quick-access-registry.js");
const contextKeyService_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/platform/contextkey/browser/contextKeyService */ "../../node_modules/@theia/monaco-editor-core/esm/vs/platform/contextkey/browser/contextKeyService.js");
const configuration_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/platform/configuration/common/configuration */ "../../node_modules/@theia/monaco-editor-core/esm/vs/platform/configuration/common/configuration.js");
const standaloneServices_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices.js");
const markdown_renderer_1 = __webpack_require__(/*! @theia/core/lib/browser/markdown-rendering/markdown-renderer */ "../../packages/core/lib/browser/markdown-rendering/markdown-renderer.js");
const monaco_markdown_renderer_1 = __webpack_require__(/*! ./markdown-renderer/monaco-markdown-renderer */ "../../packages/monaco/lib/browser/markdown-renderer/monaco-markdown-renderer.js");
const theming_1 = __webpack_require__(/*! @theia/core/lib/browser/theming */ "../../packages/core/lib/browser/theming.js");
const monaco_indexed_db_1 = __webpack_require__(/*! ./monaco-indexed-db */ "../../packages/monaco/lib/browser/monaco-indexed-db.js");
(0, inversify_1.decorate)((0, inversify_1.injectable)(), contextKeyService_1.ContextKeyService);
exports["default"] = new inversify_1.ContainerModule((bind, unbind, isBound, rebind) => {
    bind(monaco_theming_service_1.MonacoThemingService).toSelf().inSingletonScope();
    bind(monaco_context_key_service_1.MonacoContextKeyService).toSelf().inSingletonScope();
    rebind(context_key_service_1.ContextKeyService).toService(monaco_context_key_service_1.MonacoContextKeyService);
    bind(monaco_snippet_suggest_provider_1.MonacoSnippetSuggestProvider).toSelf().inSingletonScope();
    bind(monaco_frontend_application_contribution_1.MonacoFrontendApplicationContribution).toSelf().inSingletonScope();
    bind(browser_1.FrontendApplicationContribution).toService(monaco_frontend_application_contribution_1.MonacoFrontendApplicationContribution);
    bind(browser_1.StylingParticipant).toService(monaco_frontend_application_contribution_1.MonacoFrontendApplicationContribution);
    bind(monaco_to_protocol_converter_1.MonacoToProtocolConverter).toSelf().inSingletonScope();
    bind(protocol_to_monaco_converter_1.ProtocolToMonacoConverter).toSelf().inSingletonScope();
    bind(monaco_languages_1.MonacoLanguages).toSelf().inSingletonScope();
    rebind(language_service_1.LanguageService).toService(monaco_languages_1.MonacoLanguages);
    bind(workspace_symbol_command_1.WorkspaceSymbolCommand).toSelf().inSingletonScope();
    for (const identifier of [common_1.CommandContribution, browser_1.KeybindingContribution, common_1.MenuContribution, quick_access_1.QuickAccessContribution]) {
        bind(identifier).toService(workspace_symbol_command_1.WorkspaceSymbolCommand);
    }
    bind(monaco_workspace_1.MonacoWorkspace).toSelf().inSingletonScope();
    bind(exports.MonacoConfigurationService).toDynamicValue(({ container }) => createMonacoConfigurationService(container)).inSingletonScope();
    bind(contextKeyService_1.ContextKeyService).toDynamicValue(({ container }) => new contextKeyService_1.ContextKeyService(container.get(exports.MonacoConfigurationService))).inSingletonScope();
    bind(monaco_bulk_edit_service_1.MonacoBulkEditService).toSelf().inSingletonScope();
    bind(monaco_editor_service_1.MonacoEditorService).toSelf().inSingletonScope();
    bind(monaco_text_model_service_1.MonacoTextModelService).toSelf().inSingletonScope();
    bind(monaco_context_menu_1.MonacoContextMenuService).toSelf().inSingletonScope();
    bind(monaco_editor_1.MonacoEditorServices).toSelf().inSingletonScope();
    bind(monaco_editor_provider_1.MonacoEditorProvider).toSelf().inSingletonScope();
    (0, core_1.bindContributionProvider)(bind, monaco_editor_provider_1.MonacoEditorFactory);
    (0, core_1.bindContributionProvider)(bind, monaco_text_model_service_1.MonacoEditorModelFactory);
    bind(monaco_command_service_1.MonacoCommandService).toSelf().inTransientScope();
    bind(monaco_command_service_1.MonacoCommandServiceFactory).toAutoFactory(monaco_command_service_1.MonacoCommandService);
    bind(browser_2.TextEditorProvider).toProvider(context => uri => context.container.get(monaco_editor_provider_1.MonacoEditorProvider).get(uri));
    bind(monaco_diff_navigator_factory_1.MonacoDiffNavigatorFactory).toSelf().inSingletonScope();
    bind(browser_2.DiffNavigatorProvider).toFactory(context => (editor) => context.container.get(monaco_editor_provider_1.MonacoEditorProvider).getDiffNavigator(editor));
    bind(monaco_outline_contribution_1.MonacoOutlineContribution).toSelf().inSingletonScope();
    bind(browser_1.FrontendApplicationContribution).toService(monaco_outline_contribution_1.MonacoOutlineContribution);
    rebind(markdown_renderer_1.MarkdownRenderer).to(monaco_markdown_renderer_1.MonacoMarkdownRenderer).inSingletonScope();
    bind(monaco_formatting_conflicts_1.MonacoFormattingConflictsContribution).toSelf().inSingletonScope();
    bind(browser_1.FrontendApplicationContribution).toService(monaco_formatting_conflicts_1.MonacoFormattingConflictsContribution);
    bind(monaco_status_bar_contribution_1.MonacoStatusBarContribution).toSelf().inSingletonScope();
    bind(browser_1.FrontendApplicationContribution).toService(monaco_status_bar_contribution_1.MonacoStatusBarContribution);
    bind(monaco_command_registry_1.MonacoCommandRegistry).toSelf().inSingletonScope();
    bind(monaco_command_1.MonacoEditorCommandHandlers).toSelf().inSingletonScope();
    bind(common_1.CommandContribution).toService(monaco_command_1.MonacoEditorCommandHandlers);
    bind(monaco_menu_1.MonacoEditorMenuContribution).toSelf().inSingletonScope();
    bind(common_1.MenuContribution).toService(monaco_menu_1.MonacoEditorMenuContribution);
    bind(monaco_keybinding_1.MonacoKeybindingContribution).toSelf().inSingletonScope();
    bind(browser_1.KeybindingContribution).toService(monaco_keybinding_1.MonacoKeybindingContribution);
    bind(monaco_quick_input_service_1.MonacoQuickInputImplementation).toSelf().inSingletonScope();
    bind(monaco_quick_input_service_1.MonacoQuickInputService).toSelf().inSingletonScope();
    bind(browser_1.QuickInputService).toService(monaco_quick_input_service_1.MonacoQuickInputService);
    bind(monaco_quick_access_registry_1.MonacoQuickAccessRegistry).toSelf().inSingletonScope();
    bind(quick_access_1.QuickAccessRegistry).toService(monaco_quick_access_registry_1.MonacoQuickAccessRegistry);
    bind(monaco_gotoline_quick_access_1.GotoLineQuickAccessContribution).toSelf().inSingletonScope();
    bind(quick_access_1.QuickAccessContribution).toService(monaco_gotoline_quick_access_1.GotoLineQuickAccessContribution);
    bind(monaco_gotosymbol_quick_access_1.GotoSymbolQuickAccessContribution).toSelf().inSingletonScope();
    bind(quick_access_1.QuickAccessContribution).toService(monaco_gotosymbol_quick_access_1.GotoSymbolQuickAccessContribution);
    (0, monaco_textmate_frontend_bindings_1.default)(bind, unbind, isBound, rebind);
    bind(monaco_outline_decorator_1.MonacoOutlineDecorator).toSelf().inSingletonScope();
    bind(outline_decorator_service_1.OutlineTreeDecorator).toService(monaco_outline_decorator_1.MonacoOutlineDecorator);
    bind(monaco_mime_service_1.MonacoMimeService).toSelf().inSingletonScope();
    rebind(mime_service_1.MimeService).toService(monaco_mime_service_1.MonacoMimeService);
    bind(monaco_color_registry_1.MonacoColorRegistry).toSelf().inSingletonScope();
    rebind(color_registry_1.ColorRegistry).toService(monaco_color_registry_1.MonacoColorRegistry);
    bind(monaco_indexed_db_1.ThemeServiceWithDB).toSelf().inSingletonScope();
    rebind(theming_1.ThemeService).toService(monaco_indexed_db_1.ThemeServiceWithDB);
});
exports.MonacoConfigurationService = Symbol('MonacoConfigurationService');
function createMonacoConfigurationService(container) {
    const preferences = container.get(browser_1.PreferenceService);
    const preferenceSchemaProvider = container.get(browser_1.PreferenceSchemaProvider);
    const service = standaloneServices_1.StandaloneServices.get(configuration_1.IConfigurationService);
    const _configuration = service['_configuration'];
    _configuration.getValue = (section, overrides) => {
        const overrideIdentifier = (overrides && 'overrideIdentifier' in overrides && typeof overrides.overrideIdentifier === 'string')
            ? overrides['overrideIdentifier']
            : undefined;
        const resourceUri = (overrides && 'resource' in overrides && !!overrides['resource']) ? overrides['resource'].toString() : undefined;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const proxy = (0, browser_1.createPreferenceProxy)(preferences, preferenceSchemaProvider.getCombinedSchema(), {
            resourceUri, overrideIdentifier, style: 'both'
        });
        if (section) {
            return proxy[section];
        }
        return proxy;
    };
    const toTarget = (scope) => {
        switch (scope) {
            case browser_1.PreferenceScope.Default: return 7 /* DEFAULT */;
            case browser_1.PreferenceScope.User: return 2 /* USER */;
            case browser_1.PreferenceScope.Workspace: return 5 /* WORKSPACE */;
            case browser_1.PreferenceScope.Folder: return 6 /* WORKSPACE_FOLDER */;
        }
    };
    const newFireDidChangeConfigurationContext = () => ({
        changes: [],
        affectedKeys: new Set(),
        keys: new Set(),
        overrides: new Map()
    });
    const fireDidChangeConfiguration = (source, context) => {
        if (!context.affectedKeys.size) {
            return;
        }
        const overrides = [];
        for (const [override, values] of context.overrides) {
            overrides.push([override, [...values]]);
        }
        service['_onDidChangeConfiguration'].fire({
            change: {
                keys: [...context.keys],
                overrides
            },
            affectedKeys: [...context.affectedKeys],
            source,
            affectsConfiguration: (prefix, options) => {
                var _a;
                if (!context.affectedKeys.has(prefix)) {
                    return false;
                }
                for (const change of context.changes) {
                    const overridden = preferences.overriddenPreferenceName(change.preferenceName);
                    const preferenceName = overridden ? overridden.preferenceName : change.preferenceName;
                    if (preferenceName.startsWith(prefix)) {
                        if ((options === null || options === void 0 ? void 0 : options.overrideIdentifier) !== undefined) {
                            if (overridden && overridden.overrideIdentifier !== (options === null || options === void 0 ? void 0 : options.overrideIdentifier)) {
                                continue;
                            }
                        }
                        if (change.affects((_a = options === null || options === void 0 ? void 0 : options.resource) === null || _a === void 0 ? void 0 : _a.toString())) {
                            return true;
                        }
                    }
                }
                return false;
            }
        });
    };
    preferences.onPreferencesChanged(event => {
        var _a;
        let source;
        let context = newFireDidChangeConfigurationContext();
        for (let key of Object.keys(event)) {
            const change = event[key];
            const target = toTarget(change.scope);
            if (source !== undefined && target !== source) {
                fireDidChangeConfiguration(source, context);
                context = newFireDidChangeConfigurationContext();
            }
            context.changes.push(change);
            source = target;
            let overrideKeys;
            if (key.startsWith('[')) {
                const index = key.indexOf('.');
                const override = key.substring(0, index);
                const overrideIdentifier = (_a = override.match(browser_1.OVERRIDE_PROPERTY_PATTERN)) === null || _a === void 0 ? void 0 : _a[1];
                if (overrideIdentifier) {
                    context.keys.add(override);
                    context.affectedKeys.add(override);
                    overrideKeys = context.overrides.get(overrideIdentifier) || new Set();
                    context.overrides.set(overrideIdentifier, overrideKeys);
                    key = key.substring(index + 1);
                }
            }
            while (key) {
                if (overrideKeys) {
                    overrideKeys.add(key);
                }
                context.keys.add(key);
                context.affectedKeys.add(key);
                const index = key.lastIndexOf('.');
                key = key.substring(0, index);
            }
        }
        if (source) {
            fireDidChangeConfiguration(source, context);
        }
    });
    return service;
}
exports.createMonacoConfigurationService = createMonacoConfigurationService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/monaco/lib/browser/monaco-frontend-module'] = this;


/***/ }),

/***/ "../../packages/monaco/lib/browser/monaco-gotoline-quick-access.js":
/*!*************************************************************************!*\
  !*** ../../packages/monaco/lib/browser/monaco-gotoline-quick-access.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2021 SAP SE or an SAP affiliate company and others.
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
exports.GotoLineQuickAccessContribution = exports.GotoLineQuickAccess = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const codeEditorService_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/browser/services/codeEditorService */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/browser/services/codeEditorService.js");
const standaloneGotoLineQuickAccess_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/standalone/browser/quickAccess/standaloneGotoLineQuickAccess */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/standalone/browser/quickAccess/standaloneGotoLineQuickAccess.js");
const quickAccess_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/platform/quickinput/common/quickAccess */ "../../node_modules/@theia/monaco-editor-core/esm/vs/platform/quickinput/common/quickAccess.js");
const platform_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/platform/registry/common/platform */ "../../node_modules/@theia/monaco-editor-core/esm/vs/platform/registry/common/platform.js");
let GotoLineQuickAccess = class GotoLineQuickAccess extends standaloneGotoLineQuickAccess_1.StandaloneGotoLineQuickAccessProvider {
    constructor(service) {
        super(service);
        this.service = service;
    }
    get activeTextEditorControl() {
        var _a;
        return (_a = (this.service.getFocusedCodeEditor() || this.service.getActiveCodeEditor())) !== null && _a !== void 0 ? _a : undefined;
    }
};
GotoLineQuickAccess = __decorate([
    __param(0, codeEditorService_1.ICodeEditorService),
    __metadata("design:paramtypes", [Object])
], GotoLineQuickAccess);
exports.GotoLineQuickAccess = GotoLineQuickAccess;
let GotoLineQuickAccessContribution = class GotoLineQuickAccessContribution {
    registerQuickAccessProvider() {
        platform_1.Registry.as(quickAccess_1.Extensions.Quickaccess).registerQuickAccessProvider({
            ctor: GotoLineQuickAccess,
            prefix: ':',
            placeholder: '',
            helpEntries: [{ description: 'Go to line' }]
        });
    }
};
GotoLineQuickAccessContribution = __decorate([
    (0, inversify_1.injectable)()
], GotoLineQuickAccessContribution);
exports.GotoLineQuickAccessContribution = GotoLineQuickAccessContribution;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/monaco/lib/browser/monaco-gotoline-quick-access'] = this;


/***/ }),

/***/ "../../packages/monaco/lib/browser/monaco-gotosymbol-quick-access.js":
/*!***************************************************************************!*\
  !*** ../../packages/monaco/lib/browser/monaco-gotosymbol-quick-access.js ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2021 SAP SE or an SAP affiliate company and others.
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
exports.GotoSymbolQuickAccessContribution = exports.GotoSymbolQuickAccess = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const codeEditorService_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/browser/services/codeEditorService */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/browser/services/codeEditorService.js");
const languageFeatures_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/common/services/languageFeatures */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/common/services/languageFeatures.js");
const outlineModel_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/contrib/documentSymbols/browser/outlineModel */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/contrib/documentSymbols/browser/outlineModel.js");
const standaloneGotoSymbolQuickAccess_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/standalone/browser/quickAccess/standaloneGotoSymbolQuickAccess */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/standalone/browser/quickAccess/standaloneGotoSymbolQuickAccess.js");
const quickAccess_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/platform/quickinput/common/quickAccess */ "../../node_modules/@theia/monaco-editor-core/esm/vs/platform/quickinput/common/quickAccess.js");
const platform_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/platform/registry/common/platform */ "../../node_modules/@theia/monaco-editor-core/esm/vs/platform/registry/common/platform.js");
let GotoSymbolQuickAccess = class GotoSymbolQuickAccess extends standaloneGotoSymbolQuickAccess_1.StandaloneGotoSymbolQuickAccessProvider {
    constructor(codeEditorService, languageFeatures, outlineService) {
        super(codeEditorService, languageFeatures, outlineService);
        this.codeEditorService = codeEditorService;
        this.languageFeatures = languageFeatures;
        this.outlineService = outlineService;
    }
    get activeTextEditorControl() {
        var _a, _b;
        return (_b = ((_a = this.codeEditorService.getFocusedCodeEditor()) !== null && _a !== void 0 ? _a : this.codeEditorService.getActiveCodeEditor())) !== null && _b !== void 0 ? _b : undefined;
    }
};
GotoSymbolQuickAccess = __decorate([
    __param(0, codeEditorService_1.ICodeEditorService),
    __param(1, languageFeatures_1.ILanguageFeaturesService),
    __param(2, outlineModel_1.IOutlineModelService),
    __metadata("design:paramtypes", [Object, Object, Object])
], GotoSymbolQuickAccess);
exports.GotoSymbolQuickAccess = GotoSymbolQuickAccess;
let GotoSymbolQuickAccessContribution = class GotoSymbolQuickAccessContribution {
    registerQuickAccessProvider() {
        platform_1.Registry.as(quickAccess_1.Extensions.Quickaccess).registerQuickAccessProvider({
            ctor: GotoSymbolQuickAccess,
            prefix: '@',
            placeholder: '',
            helpEntries: [{ description: 'Go to symbol' }]
        });
    }
};
GotoSymbolQuickAccessContribution = __decorate([
    (0, inversify_1.injectable)()
], GotoSymbolQuickAccessContribution);
exports.GotoSymbolQuickAccessContribution = GotoSymbolQuickAccessContribution;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/monaco/lib/browser/monaco-gotosymbol-quick-access'] = this;


/***/ }),

/***/ "../../packages/monaco/lib/browser/monaco-indexed-db.js":
/*!**************************************************************!*\
  !*** ../../packages/monaco/lib/browser/monaco-indexed-db.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2020 TypeFox and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ThemeServiceWithDB = exports.stateToTheme = exports.deleteTheme = exports.putTheme = exports.getThemes = exports.MonacoThemeState = exports.monacoDB = void 0;
const idb = __webpack_require__(/*! idb */ "../../node_modules/idb/build/esm/index.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
const theming_1 = __webpack_require__(/*! @theia/core/lib/browser/theming */ "../../packages/core/lib/browser/theming.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
let _monacoDB;
if ('indexedDB' in window) {
    _monacoDB = idb.openDB('theia-monaco', 1, {
        upgrade: db => {
            if (!db.objectStoreNames.contains('themes')) {
                db.createObjectStore('themes', { keyPath: 'id' });
            }
        }
    });
}
exports.monacoDB = _monacoDB;
var MonacoThemeState;
(function (MonacoThemeState) {
    function is(state) {
        return (0, core_1.isObject)(state) && 'id' in state && 'label' in state && 'uiTheme' in state && 'data' in state;
    }
    MonacoThemeState.is = is;
})(MonacoThemeState = exports.MonacoThemeState || (exports.MonacoThemeState = {}));
async function getThemes() {
    if (!exports.monacoDB) {
        return [];
    }
    const db = await exports.monacoDB;
    const result = await db.transaction('themes', 'readonly').objectStore('themes').getAll();
    return result.filter(MonacoThemeState.is);
}
exports.getThemes = getThemes;
function putTheme(state) {
    const toDispose = new disposable_1.DisposableCollection(disposable_1.Disposable.create(() => { }));
    doPutTheme(state, toDispose);
    return toDispose;
}
exports.putTheme = putTheme;
async function doPutTheme(state, toDispose) {
    if (!exports.monacoDB) {
        return;
    }
    const db = await exports.monacoDB;
    if (toDispose.disposed) {
        return;
    }
    const id = state.id;
    await db.transaction('themes', 'readwrite').objectStore('themes').put(state);
    if (toDispose.disposed) {
        await deleteTheme(id);
        return;
    }
    toDispose.push(disposable_1.Disposable.create(() => deleteTheme(id)));
}
async function deleteTheme(id) {
    if (!exports.monacoDB) {
        return;
    }
    const db = await exports.monacoDB;
    await db.transaction('themes', 'readwrite').objectStore('themes').delete(id);
}
exports.deleteTheme = deleteTheme;
function stateToTheme(state) {
    const { id, label, description, uiTheme, data } = state;
    const type = uiTheme === 'vs' ? 'light' : uiTheme === 'vs-dark' ? 'dark' : 'hc';
    return {
        type,
        id,
        label,
        description,
        editorTheme: data.name
    };
}
exports.stateToTheme = stateToTheme;
let ThemeServiceWithDB = class ThemeServiceWithDB extends theming_1.ThemeService {
    constructor() {
        super(...arguments);
        this.onDidRetrieveThemeEmitter = new core_1.Emitter();
    }
    get onDidRetrieveTheme() {
        return this.onDidRetrieveThemeEmitter.event;
    }
    loadUserTheme() {
        this.loadUserThemeWithDB();
    }
    async loadUserThemeWithDB() {
        var _a, _b, _c;
        const themeId = (_a = window.localStorage.getItem(theming_1.ThemeService.STORAGE_KEY)) !== null && _a !== void 0 ? _a : this.defaultTheme.id;
        const theme = (_c = (_b = this.themes[themeId]) !== null && _b !== void 0 ? _b : await getThemes().then(themes => {
            const matchingTheme = themes.find(candidate => candidate.id === themeId);
            if (matchingTheme) {
                this.onDidRetrieveThemeEmitter.fire(matchingTheme);
                return stateToTheme(matchingTheme);
            }
        })) !== null && _c !== void 0 ? _c : this.getTheme(themeId);
        // In case the theme comes from the DB.
        if (!this.themes[theme.id]) {
            this.themes[theme.id] = theme;
        }
        this.setCurrentTheme(theme.id, false);
        this.deferredInitializer.resolve();
    }
};
ThemeServiceWithDB = __decorate([
    (0, inversify_1.injectable)()
], ThemeServiceWithDB);
exports.ThemeServiceWithDB = ThemeServiceWithDB;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/monaco/lib/browser/monaco-indexed-db'] = this;


/***/ }),

/***/ "../../packages/monaco/lib/browser/monaco-keybinding.js":
/*!**************************************************************!*\
  !*** ../../packages/monaco/lib/browser/monaco-keybinding.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MonacoKeybindingContribution = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const monaco_command_1 = __webpack_require__(/*! ./monaco-command */ "../../packages/monaco/lib/browser/monaco-command.js");
const monaco_command_registry_1 = __webpack_require__(/*! ./monaco-command-registry */ "../../packages/monaco/lib/browser/monaco-command-registry.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const monaco_resolved_keybinding_1 = __webpack_require__(/*! ./monaco-resolved-keybinding */ "../../packages/monaco/lib/browser/monaco-resolved-keybinding.js");
const keybindingsRegistry_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/platform/keybinding/common/keybindingsRegistry */ "../../node_modules/@theia/monaco-editor-core/esm/vs/platform/keybinding/common/keybindingsRegistry.js");
const standaloneServices_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices.js");
const keybinding_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/platform/keybinding/common/keybinding */ "../../node_modules/@theia/monaco-editor-core/esm/vs/platform/keybinding/common/keybinding.js");
const monaco_context_key_service_1 = __webpack_require__(/*! ./monaco-context-key-service */ "../../packages/monaco/lib/browser/monaco-context-key-service.js");
const monaco_keycode_map_1 = __webpack_require__(/*! ./monaco-keycode-map */ "../../packages/monaco/lib/browser/monaco-keycode-map.js");
const monaco = __webpack_require__(/*! @theia/monaco-editor-core */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/editor.main.js");
let MonacoKeybindingContribution = class MonacoKeybindingContribution {
    constructor() {
        this.toDisposeOnKeybindingChange = new core_1.DisposableCollection();
    }
    init() {
        this.keybindings.onKeybindingsChanged(() => this.updateMonacoKeybindings());
    }
    registerKeybindings(registry) {
        var _a;
        const defaultKeybindings = keybindingsRegistry_1.KeybindingsRegistry.getDefaultKeybindings();
        for (const item of defaultKeybindings) {
            const command = this.commands.validate(item.command);
            if (command) {
                const when = (_a = (item.when && item.when.serialize())) !== null && _a !== void 0 ? _a : undefined;
                let keybinding;
                if (item.command === monaco_command_1.MonacoCommands.GO_TO_DEFINITION && !core_1.environment.electron.is()) {
                    keybinding = 'ctrlcmd+f11';
                }
                else {
                    keybinding = monaco_resolved_keybinding_1.MonacoResolvedKeybinding.toKeybinding(item.keybinding);
                }
                registry.registerKeybinding({ command, keybinding, when });
            }
        }
    }
    updateMonacoKeybindings() {
        const monacoKeybindingRegistry = standaloneServices_1.StandaloneServices.get(keybinding_1.IKeybindingService);
        if (monacoKeybindingRegistry instanceof standaloneServices_1.StandaloneKeybindingService) {
            this.toDisposeOnKeybindingChange.dispose();
            for (const binding of this.keybindings.getKeybindingsByScope(browser_1.KeybindingScope.USER).concat(this.keybindings.getKeybindingsByScope(browser_1.KeybindingScope.WORKSPACE))) {
                const resolved = this.keybindings.resolveKeybinding(binding);
                const command = binding.command;
                const when = binding.when
                    ? this.contextKeyService.parse(binding.when)
                    : binding.context
                        ? this.contextKeyService.parse(binding.context)
                        : undefined;
                this.toDisposeOnKeybindingChange.push(monacoKeybindingRegistry.addDynamicKeybinding(binding.command, this.toMonacoKeybindingNumber(resolved), (_, ...args) => this.theiaCommandRegistry.executeCommand(command, ...args), when));
            }
        }
    }
    toMonacoKeybindingNumber(codes) {
        const [firstPart, secondPart] = codes;
        if (codes.length > 2) {
            console.warn('Key chords should not consist of more than two parts; got ', codes);
        }
        const encodedFirstPart = this.toSingleMonacoKeybindingNumber(firstPart);
        const encodedSecondPart = secondPart ? this.toSingleMonacoKeybindingNumber(secondPart) << 16 : 0;
        return monaco.KeyMod.chord(encodedFirstPart, encodedSecondPart);
    }
    toSingleMonacoKeybindingNumber(code) {
        var _a;
        const keyCode = ((_a = code.key) === null || _a === void 0 ? void 0 : _a.keyCode) !== undefined ? monaco_keycode_map_1.KEY_CODE_MAP[code.key.keyCode] : 0;
        let encoded = (keyCode >>> 0) & 0x000000FF;
        if (code.alt) {
            encoded |= monaco.KeyMod.Alt;
        }
        if (code.shift) {
            encoded |= monaco.KeyMod.Shift;
        }
        if (code.ctrl) {
            encoded |= monaco.KeyMod.WinCtrl;
        }
        if (code.meta && core_1.isOSX) {
            encoded |= monaco.KeyMod.CtrlCmd;
        }
        return encoded;
    }
};
__decorate([
    (0, inversify_1.inject)(monaco_command_registry_1.MonacoCommandRegistry),
    __metadata("design:type", monaco_command_registry_1.MonacoCommandRegistry)
], MonacoKeybindingContribution.prototype, "commands", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.KeybindingRegistry),
    __metadata("design:type", browser_1.KeybindingRegistry)
], MonacoKeybindingContribution.prototype, "keybindings", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.CommandRegistry),
    __metadata("design:type", core_1.CommandRegistry)
], MonacoKeybindingContribution.prototype, "theiaCommandRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_context_key_service_1.MonacoContextKeyService),
    __metadata("design:type", monaco_context_key_service_1.MonacoContextKeyService)
], MonacoKeybindingContribution.prototype, "contextKeyService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MonacoKeybindingContribution.prototype, "init", null);
MonacoKeybindingContribution = __decorate([
    (0, inversify_1.injectable)()
], MonacoKeybindingContribution);
exports.MonacoKeybindingContribution = MonacoKeybindingContribution;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/monaco/lib/browser/monaco-keybinding'] = this;


/***/ }),

/***/ "../../packages/monaco/lib/browser/monaco-languages.js":
/*!*************************************************************!*\
  !*** ../../packages/monaco/lib/browser/monaco-languages.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MonacoLanguages = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const problem_manager_1 = __webpack_require__(/*! @theia/markers/lib/browser/problem/problem-manager */ "../../packages/markers/lib/browser/problem/problem-manager.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
const monaco_marker_collection_1 = __webpack_require__(/*! ./monaco-marker-collection */ "../../packages/monaco/lib/browser/monaco-marker-collection.js");
const protocol_to_monaco_converter_1 = __webpack_require__(/*! ./protocol-to-monaco-converter */ "../../packages/monaco/lib/browser/protocol-to-monaco-converter.js");
const monaco = __webpack_require__(/*! @theia/monaco-editor-core */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/editor.main.js");
let MonacoLanguages = class MonacoLanguages {
    constructor() {
        this.workspaceSymbolProviders = [];
        this.markers = new Map();
    }
    init() {
        this.problemManager.onDidChangeMarkers(uri => this.updateMarkers(uri));
        monaco.editor.onDidCreateModel(model => this.updateModelMarkers(model));
    }
    updateMarkers(uri) {
        const markers = this.problemManager.findMarkers({ uri });
        const uriString = uri.toString();
        const collection = this.markers.get(uriString) || new monaco_marker_collection_1.MonacoMarkerCollection(uri, this.p2m);
        this.markers.set(uriString, collection);
        collection.updateMarkers(markers);
    }
    updateModelMarkers(model) {
        const uriString = model.uri.toString();
        const uri = new uri_1.default(uriString);
        const collection = this.markers.get(uriString) || new monaco_marker_collection_1.MonacoMarkerCollection(uri, this.p2m);
        this.markers.set(uriString, collection);
        collection.updateModelMarkers(model);
    }
    registerWorkspaceSymbolProvider(provider) {
        this.workspaceSymbolProviders.push(provider);
        return disposable_1.Disposable.create(() => {
            const index = this.workspaceSymbolProviders.indexOf(provider);
            if (index !== -1) {
                this.workspaceSymbolProviders.splice(index, 1);
            }
        });
    }
    get languages() {
        return [...this.mergeLanguages(monaco.languages.getLanguages()).values()];
    }
    getLanguage(languageId) {
        return this.mergeLanguages(monaco.languages.getLanguages().filter(language => language.id === languageId)).get(languageId);
    }
    getExtension(languageId) {
        var _a;
        return (_a = this.getLanguage(languageId)) === null || _a === void 0 ? void 0 : _a.extensions.values().next().value;
    }
    getLanguageIdByLanguageName(languageName) {
        var _a;
        return (_a = monaco.languages.getLanguages().find(language => { var _a; return (_a = language.aliases) === null || _a === void 0 ? void 0 : _a.includes(languageName); })) === null || _a === void 0 ? void 0 : _a.id;
    }
    mergeLanguages(registered) {
        const languages = new Map();
        for (const { id, aliases, extensions, filenames } of registered) {
            const merged = languages.get(id) || {
                id,
                name: '',
                extensions: new Set(),
                filenames: new Set()
            };
            if (!merged.name && aliases && aliases.length) {
                merged.name = aliases[0];
            }
            if (extensions && extensions.length) {
                for (const extension of extensions) {
                    merged.extensions.add(extension);
                }
            }
            if (filenames && filenames.length) {
                for (const filename of filenames) {
                    merged.filenames.add(filename);
                }
            }
            languages.set(id, merged);
        }
        for (const [id, language] of languages) {
            if (!language.name) {
                language.name = id;
            }
        }
        return languages;
    }
};
__decorate([
    (0, inversify_1.inject)(problem_manager_1.ProblemManager),
    __metadata("design:type", problem_manager_1.ProblemManager)
], MonacoLanguages.prototype, "problemManager", void 0);
__decorate([
    (0, inversify_1.inject)(protocol_to_monaco_converter_1.ProtocolToMonacoConverter),
    __metadata("design:type", protocol_to_monaco_converter_1.ProtocolToMonacoConverter)
], MonacoLanguages.prototype, "p2m", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MonacoLanguages.prototype, "init", null);
MonacoLanguages = __decorate([
    (0, inversify_1.injectable)()
], MonacoLanguages);
exports.MonacoLanguages = MonacoLanguages;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/monaco/lib/browser/monaco-languages'] = this;


/***/ }),

/***/ "../../packages/monaco/lib/browser/monaco-marker-collection.js":
/*!*********************************************************************!*\
  !*** ../../packages/monaco/lib/browser/monaco-marker-collection.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2020 TypeFox and others.
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
exports.MonacoMarkerCollection = void 0;
const monaco = __webpack_require__(/*! @theia/monaco-editor-core */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/editor.main.js");
class MonacoMarkerCollection {
    constructor(uri, p2m) {
        this.markers = [];
        this.owners = new Map();
        this.didUpdate = false;
        this.uri = monaco.Uri.parse(uri.toString());
        this.p2m = p2m;
    }
    updateMarkers(markers) {
        this.markers = markers;
        const model = monaco.editor.getModel(this.uri);
        this.doUpdateMarkers(model ? model : undefined);
    }
    updateModelMarkers(model) {
        if (!this.didUpdate) {
            this.doUpdateMarkers(model);
            return;
        }
        for (const [owner, diagnostics] of this.owners) {
            this.setModelMarkers(model, owner, diagnostics);
        }
    }
    doUpdateMarkers(model) {
        if (!model) {
            this.didUpdate = false;
            return;
        }
        this.didUpdate = true;
        const toClean = new Set(this.owners.keys());
        this.owners.clear();
        for (const marker of this.markers) {
            const diagnostics = this.owners.get(marker.owner) || [];
            diagnostics.push(marker.data);
            this.owners.set(marker.owner, diagnostics);
        }
        for (const [owner, diagnostics] of this.owners) {
            toClean.delete(owner);
            this.setModelMarkers(model, owner, diagnostics);
        }
        for (const owner of toClean) {
            this.clearModelMarkers(model, owner);
        }
    }
    setModelMarkers(model, owner, diagnostics) {
        monaco.editor.setModelMarkers(model, owner, this.p2m.asDiagnostics(diagnostics));
    }
    clearModelMarkers(model, owner) {
        monaco.editor.setModelMarkers(model, owner, []);
    }
}
exports.MonacoMarkerCollection = MonacoMarkerCollection;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/monaco/lib/browser/monaco-marker-collection'] = this;


/***/ }),

/***/ "../../packages/monaco/lib/browser/monaco-menu.js":
/*!********************************************************!*\
  !*** ../../packages/monaco/lib/browser/monaco-menu.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MonacoEditorMenuContribution = exports.MonacoMenus = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/editor/lib/browser */ "../../packages/editor/lib/browser/index.js");
const monaco_command_registry_1 = __webpack_require__(/*! ./monaco-command-registry */ "../../packages/monaco/lib/browser/monaco-command-registry.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
const actions_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/platform/actions/common/actions */ "../../node_modules/@theia/monaco-editor-core/esm/vs/platform/actions/common/actions.js");
var MonacoMenus;
(function (MonacoMenus) {
    MonacoMenus.SELECTION = [...common_1.MAIN_MENU_BAR, '3_selection'];
    MonacoMenus.PEEK_CONTEXT_SUBMENU = [...browser_1.EDITOR_CONTEXT_MENU, 'navigation', 'peek_submenu'];
    MonacoMenus.MARKERS_GROUP = [...browser_1.EditorMainMenu.GO, '5_markers_group'];
})(MonacoMenus = exports.MonacoMenus || (exports.MonacoMenus = {}));
let MonacoEditorMenuContribution = class MonacoEditorMenuContribution {
    constructor(commands) {
        this.commands = commands;
    }
    registerMenus(registry) {
        for (const item of actions_1.MenuRegistry.getMenuItems(actions_1.MenuId.EditorContext)) {
            if (!(0, actions_1.isIMenuItem)(item)) {
                continue;
            }
            const commandId = this.commands.validate(item.command.id);
            if (commandId) {
                const menuPath = [...browser_1.EDITOR_CONTEXT_MENU, (item.group || '')];
                registry.registerMenuAction(menuPath, this.buildMenuAction(commandId, item));
            }
        }
        this.registerPeekSubmenu(registry);
        registry.registerSubmenu(MonacoMenus.SELECTION, nls_1.nls.localizeByDefault('Selection'));
        for (const item of actions_1.MenuRegistry.getMenuItems(actions_1.MenuId.MenubarSelectionMenu)) {
            if (!(0, actions_1.isIMenuItem)(item)) {
                continue;
            }
            const commandId = this.commands.validate(item.command.id);
            if (commandId) {
                const menuPath = [...MonacoMenus.SELECTION, (item.group || '')];
                registry.registerMenuAction(menuPath, this.buildMenuAction(commandId, item));
            }
        }
        // Builtin monaco language features commands.
        registry.registerMenuAction(browser_1.EditorMainMenu.LANGUAGE_FEATURES_GROUP, {
            commandId: 'editor.action.quickOutline',
            label: nls_1.nls.localizeByDefault('Go to Symbol in Editor...'),
            order: '1'
        });
        registry.registerMenuAction(browser_1.EditorMainMenu.LANGUAGE_FEATURES_GROUP, {
            commandId: 'editor.action.revealDefinition',
            label: nls_1.nls.localizeByDefault('Go to Definition'),
            order: '2'
        });
        registry.registerMenuAction(browser_1.EditorMainMenu.LANGUAGE_FEATURES_GROUP, {
            commandId: 'editor.action.revealDeclaration',
            label: nls_1.nls.localizeByDefault('Go to Declaration'),
            order: '3'
        });
        registry.registerMenuAction(browser_1.EditorMainMenu.LANGUAGE_FEATURES_GROUP, {
            commandId: 'editor.action.goToTypeDefinition',
            label: nls_1.nls.localizeByDefault('Go to Type Definition'),
            order: '4'
        });
        registry.registerMenuAction(browser_1.EditorMainMenu.LANGUAGE_FEATURES_GROUP, {
            commandId: 'editor.action.goToImplementation',
            label: nls_1.nls.localizeByDefault('Go to Implementations'),
            order: '5'
        });
        registry.registerMenuAction(browser_1.EditorMainMenu.LANGUAGE_FEATURES_GROUP, {
            commandId: 'editor.action.goToReferences',
            label: nls_1.nls.localizeByDefault('Go to References'),
            order: '6'
        });
        registry.registerMenuAction(browser_1.EditorMainMenu.LOCATION_GROUP, {
            commandId: 'editor.action.jumpToBracket',
            label: nls_1.nls.localizeByDefault('Go to Bracket'),
            order: '2'
        });
        // Builtin monaco problem commands.
        registry.registerMenuAction(MonacoMenus.MARKERS_GROUP, {
            commandId: 'editor.action.marker.nextInFiles',
            label: nls_1.nls.localizeByDefault('Next Problem'),
            order: '1'
        });
        registry.registerMenuAction(MonacoMenus.MARKERS_GROUP, {
            commandId: 'editor.action.marker.prevInFiles',
            label: nls_1.nls.localizeByDefault('Previous Problem'),
            order: '2'
        });
    }
    registerPeekSubmenu(registry) {
        registry.registerSubmenu(MonacoMenus.PEEK_CONTEXT_SUBMENU, nls_1.nls.localizeByDefault('Peek'));
        for (const item of actions_1.MenuRegistry.getMenuItems(actions_1.MenuId.EditorContextPeek)) {
            if (!(0, actions_1.isIMenuItem)(item)) {
                continue;
            }
            const commandId = this.commands.validate(item.command.id);
            if (commandId) {
                registry.registerMenuAction([...MonacoMenus.PEEK_CONTEXT_SUBMENU, item.group || ''], this.buildMenuAction(commandId, item));
            }
        }
    }
    buildMenuAction(commandId, item) {
        const title = typeof item.command.title === 'string' ? item.command.title : item.command.title.value;
        const label = this.removeMnemonic(title);
        const order = item.order ? String(item.order) : '';
        return { commandId, order, label };
    }
    removeMnemonic(label) {
        return label.replace(/\(&&\w\)|&&/g, '');
    }
};
MonacoEditorMenuContribution = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(monaco_command_registry_1.MonacoCommandRegistry)),
    __metadata("design:paramtypes", [monaco_command_registry_1.MonacoCommandRegistry])
], MonacoEditorMenuContribution);
exports.MonacoEditorMenuContribution = MonacoEditorMenuContribution;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/monaco/lib/browser/monaco-menu'] = this;


/***/ }),

/***/ "../../packages/monaco/lib/browser/monaco-mime-service.js":
/*!****************************************************************!*\
  !*** ../../packages/monaco/lib/browser/monaco-mime-service.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2019 Red Hat, Inc. and others.
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
exports.MonacoMimeService = void 0;
const debounce = __webpack_require__(/*! @theia/core/shared/lodash.debounce */ "../../packages/core/shared/lodash.debounce/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const mime_service_1 = __webpack_require__(/*! @theia/core/lib/browser/mime-service */ "../../packages/core/lib/browser/mime-service.js");
const standaloneServices_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices.js");
const language_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/common/languages/language */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/common/languages/language.js");
const monaco = __webpack_require__(/*! @theia/monaco-editor-core */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/editor.main.js");
const languagesAssociations_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/common/services/languagesAssociations */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/common/services/languagesAssociations.js");
let MonacoMimeService = class MonacoMimeService extends mime_service_1.MimeService {
    constructor() {
        super();
        this.associations = [];
        this.updatingAssociations = false;
        this.updateAssociations = debounce(() => {
            this.updatingAssociations = true;
            try {
                (0, languagesAssociations_1.clearConfiguredLanguageAssociations)();
                for (const association of this.associations) {
                    const mimetype = this.getMimeForMode(association.id) || `text/x-${association.id}`;
                    (0, languagesAssociations_1.registerConfiguredLanguageAssociation)({ id: association.id, mime: mimetype, filepattern: association.filepattern });
                }
                standaloneServices_1.StandaloneServices.get(language_1.ILanguageService)['_onDidChange'].fire(undefined);
            }
            finally {
                this.updatingAssociations = false;
            }
        });
        standaloneServices_1.StandaloneServices.get(language_1.ILanguageService).onDidChange(() => {
            if (this.updatingAssociations) {
                return;
            }
            this.updateAssociations();
        });
    }
    setAssociations(associations) {
        this.associations = associations;
        this.updateAssociations();
    }
    getMimeForMode(langId) {
        for (const language of monaco.languages.getLanguages()) {
            if (language.id === langId && language.mimetypes) {
                return language.mimetypes[0];
            }
        }
        return undefined;
    }
};
MonacoMimeService = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], MonacoMimeService);
exports.MonacoMimeService = MonacoMimeService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/monaco/lib/browser/monaco-mime-service'] = this;


/***/ }),

/***/ "../../packages/monaco/lib/browser/monaco-outline-contribution.js":
/*!************************************************************************!*\
  !*** ../../packages/monaco/lib/browser/monaco-outline-contribution.js ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MonacoOutlineSymbolInformationNode = exports.MonacoOutlineContribution = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/editor/lib/browser */ "../../packages/editor/lib/browser/index.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const outline_view_service_1 = __webpack_require__(/*! @theia/outline-view/lib/browser/outline-view-service */ "../../packages/outline-view/lib/browser/outline-view-service.js");
const outline_view_widget_1 = __webpack_require__(/*! @theia/outline-view/lib/browser/outline-view-widget */ "../../packages/outline-view/lib/browser/outline-view-widget.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const monaco_editor_1 = __webpack_require__(/*! ./monaco-editor */ "../../packages/monaco/lib/browser/monaco-editor.js");
const debounce = __webpack_require__(/*! @theia/core/shared/lodash.debounce */ "../../packages/core/shared/lodash.debounce/index.js");
const monaco = __webpack_require__(/*! @theia/monaco-editor-core */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/editor.main.js");
const languageFeatures_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/common/services/languageFeatures */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/common/services/languageFeatures.js");
const standaloneServices_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices.js");
let MonacoOutlineContribution = class MonacoOutlineContribution {
    constructor() {
        this.toDisposeOnEditor = new core_1.DisposableCollection();
        this.canUpdateOutline = true;
        this.tokenSource = new monaco.CancellationTokenSource();
    }
    onStart(app) {
        // updateOutline and handleCurrentEditorChanged need to be called even when the outline view widget is closed
        // in order to update breadcrumbs.
        standaloneServices_1.StandaloneServices.get(languageFeatures_1.ILanguageFeaturesService).documentSymbolProvider.onDidChange(debounce(() => this.updateOutline()));
        this.editorManager.onCurrentEditorChanged(debounce(() => this.handleCurrentEditorChanged(), 50));
        this.handleCurrentEditorChanged();
        this.outlineViewService.onDidSelect(async (node) => {
            if (MonacoOutlineSymbolInformationNode.is(node) && node.parent) {
                const options = {
                    mode: 'reveal',
                    selection: node.range
                };
                await this.selectInEditor(node, options);
            }
        });
        this.outlineViewService.onDidOpen(async (node) => {
            if (MonacoOutlineSymbolInformationNode.is(node)) {
                const options = {
                    selection: {
                        start: node.range.start
                    }
                };
                await this.selectInEditor(node, options);
            }
        });
    }
    async selectInEditor(node, options) {
        // Avoid cyclic updates: Outline -> Editor -> Outline.
        this.canUpdateOutline = false;
        try {
            await this.editorManager.open(node.uri, options);
        }
        finally {
            this.canUpdateOutline = true;
        }
    }
    handleCurrentEditorChanged() {
        this.toDisposeOnEditor.dispose();
        this.toDisposeOnEditor.push(core_1.Disposable.create(() => this.roots = undefined));
        const editor = this.editorManager.currentEditor;
        if (editor) {
            const model = monaco_editor_1.MonacoEditor.get(editor).getControl().getModel();
            if (model) {
                this.toDisposeOnEditor.push(model.onDidChangeContent(() => {
                    this.roots = undefined; // Invalidate the previously resolved roots.
                    this.updateOutline();
                }));
            }
            this.toDisposeOnEditor.push(editor.editor.onSelectionChanged(selection => this.updateOutline(selection)));
        }
        this.updateOutline();
    }
    async updateOutline(editorSelection) {
        if (!this.canUpdateOutline) {
            return;
        }
        this.tokenSource.cancel();
        this.tokenSource = new monaco.CancellationTokenSource();
        const token = this.tokenSource.token;
        const editor = monaco_editor_1.MonacoEditor.get(this.editorManager.currentEditor);
        const model = editor && editor.getControl().getModel();
        const roots = model && await this.createRoots(model, token, editorSelection);
        if (token.isCancellationRequested) {
            return;
        }
        this.outlineViewService.publish(roots || []);
    }
    async createRoots(model, token, editorSelection) {
        var _a;
        model = model;
        if (this.roots && this.roots.length > 0) {
            // Reset the selection on the tree nodes, so that we can apply the new ones based on the `editorSelection`.
            const resetSelection = (node) => {
                node.selected = false;
                node.children.forEach(resetSelection);
            };
            this.roots.forEach(resetSelection);
        }
        else {
            this.roots = [];
            const providers = standaloneServices_1.StandaloneServices.get(languageFeatures_1.ILanguageFeaturesService).documentSymbolProvider.all(model);
            if (token.isCancellationRequested) {
                return [];
            }
            const uri = new uri_1.default(model.uri.toString());
            for (const provider of providers) {
                try {
                    const symbols = (_a = await provider.provideDocumentSymbols(model, token)) !== null && _a !== void 0 ? _a : [];
                    if (token.isCancellationRequested) {
                        return [];
                    }
                    const nodes = this.createNodes(uri, symbols);
                    if (providers.length > 1 && provider.displayName) {
                        const providerRoot = this.createProviderRootNode(uri, provider.displayName, nodes);
                        this.roots.push(providerRoot);
                    }
                    else {
                        this.roots.push(...nodes);
                    }
                }
                catch {
                    /* collect symbols from other providers */
                }
            }
        }
        this.applySelection(this.roots, editorSelection);
        return this.roots;
    }
    createProviderRootNode(uri, displayName, children) {
        const node = {
            uri,
            id: displayName,
            name: displayName,
            iconClass: '',
            range: this.asRange(new monaco.Range(1, 1, 1, 1)),
            fullRange: this.asRange(new monaco.Range(1, 1, 1, 1)),
            children,
            parent: undefined,
            selected: false,
            expanded: true
        };
        return node;
    }
    createNodes(uri, symbols) {
        symbols = symbols;
        let rangeBased = false;
        const ids = new Map();
        const roots = [];
        const nodesByName = symbols.sort(this.orderByPosition).reduce((result, symbol) => {
            const node = this.createNode(uri, symbol, ids);
            if (symbol.children) {
                MonacoOutlineSymbolInformationNode.insert(roots, node);
            }
            else {
                rangeBased = rangeBased || symbol.range.startLineNumber !== symbol.range.endLineNumber;
                const values = result.get(symbol.name) || [];
                values.push({ symbol, node });
                result.set(symbol.name, values);
            }
            return result;
        }, new Map());
        for (const nodes of nodesByName.values()) {
            for (const { node, symbol } of nodes) {
                if (!symbol.containerName) {
                    MonacoOutlineSymbolInformationNode.insert(roots, node);
                }
                else {
                    const possibleParents = nodesByName.get(symbol.containerName);
                    if (possibleParents) {
                        const parent = possibleParents.find(possibleParent => this.parentContains(symbol, possibleParent.symbol, rangeBased));
                        if (parent) {
                            node.parent = parent.node;
                            MonacoOutlineSymbolInformationNode.insert(parent.node.children, node);
                        }
                    }
                }
            }
        }
        if (!roots.length) {
            const nodes = nodesByName.values().next().value;
            if (nodes && !nodes[0].node.parent) {
                return [nodes[0].node];
            }
            return [];
        }
        return roots;
    }
    /**
     * Sets the selection on the sub-trees based on the optional editor selection.
     * Select the narrowest node that is strictly contains the editor selection.
     */
    applySelection(roots, editorSelection) {
        if (editorSelection) {
            for (const root of roots) {
                if (this.parentContains(editorSelection, root.fullRange, true)) {
                    const { children } = root;
                    root.selected = !root.expanded || !this.applySelection(children, editorSelection);
                    return true;
                }
            }
        }
        return false;
    }
    /**
     * Returns `true` if `candidate` is strictly contained inside `parent`
     *
     * If the argument is a `DocumentSymbol`, then `getFullRange` will be used to retrieve the range of the underlying symbol.
     */
    parentContains(candidate, parent, rangeBased) {
        // TODO: move this code to the `monaco-languageclient`: https://github.com/eclipse-theia/theia/pull/2885#discussion_r217800446
        const candidateRange = browser_1.Range.is(candidate) ? candidate : this.getFullRange(candidate);
        const parentRange = browser_1.Range.is(parent) ? parent : this.getFullRange(parent);
        const sameStartLine = candidateRange.start.line === parentRange.start.line;
        const startColGreaterOrEqual = candidateRange.start.character >= parentRange.start.character;
        const startLineGreater = candidateRange.start.line > parentRange.start.line;
        const sameEndLine = candidateRange.end.line === parentRange.end.line;
        const endColSmallerOrEqual = candidateRange.end.character <= parentRange.end.character;
        const endLineSmaller = candidateRange.end.line < parentRange.end.line;
        return (((sameStartLine && startColGreaterOrEqual || startLineGreater) &&
            (sameEndLine && endColSmallerOrEqual || endLineSmaller)) || !rangeBased);
    }
    /**
     * `monaco` to LSP `Range` converter. Converts the `1-based` location indices into `0-based` ones.
     */
    asRange(range) {
        const { startLineNumber, startColumn, endLineNumber, endColumn } = range;
        return {
            start: {
                line: startLineNumber - 1,
                character: startColumn - 1
            },
            end: {
                line: endLineNumber - 1,
                character: endColumn - 1
            }
        };
    }
    /**
     * Returns with a range enclosing this symbol not including leading/trailing whitespace but everything else like comments.
     * This information is typically used to determine if the clients cursor is inside the symbol to reveal in the symbol in the UI.
     * This allows to obtain the range including the associated comments.
     *
     * See: [`DocumentSymbol#range`](https://microsoft.github.io/language-server-protocol/specification#textDocument_documentSymbol) for more details.
     */
    getFullRange(documentSymbol) {
        return this.asRange(documentSymbol.range);
    }
    /**
     * The range that should be selected and revealed when this symbol is being picked, e.g the name of a function. Must be contained by the `getSelectionRange`.
     *
     * See: [`DocumentSymbol#selectionRange`](https://microsoft.github.io/language-server-protocol/specification#textDocument_documentSymbol) for more details.
     */
    getNameRange(documentSymbol) {
        return this.asRange(documentSymbol.selectionRange);
    }
    createNode(uri, symbol, ids, parent) {
        const id = this.createId(symbol.name, ids);
        const children = [];
        const node = {
            children,
            id,
            iconClass: monaco.languages.SymbolKind[symbol.kind].toString().toLowerCase(),
            name: this.getName(symbol),
            detail: this.getDetail(symbol),
            parent,
            uri,
            range: this.getNameRange(symbol),
            fullRange: this.getFullRange(symbol),
            selected: false,
            expanded: this.shouldExpand(symbol)
        };
        if (symbol.children) {
            for (const child of symbol.children) {
                MonacoOutlineSymbolInformationNode.insert(children, this.createNode(uri, child, ids, node));
            }
        }
        return node;
    }
    getName(symbol) {
        return symbol.name;
    }
    getDetail(symbol) {
        return symbol.detail;
    }
    createId(name, ids) {
        const counter = ids.get(name);
        const index = typeof counter === 'number' ? counter + 1 : 0;
        ids.set(name, index);
        return name + '_' + index;
    }
    shouldExpand(symbol) {
        return [
            monaco.languages.SymbolKind.Class,
            monaco.languages.SymbolKind.Enum, monaco.languages.SymbolKind.File,
            monaco.languages.SymbolKind.Interface, monaco.languages.SymbolKind.Module,
            monaco.languages.SymbolKind.Namespace, monaco.languages.SymbolKind.Object,
            monaco.languages.SymbolKind.Package, monaco.languages.SymbolKind.Struct
        ].indexOf(symbol.kind) !== -1;
    }
    orderByPosition(symbol, symbol2) {
        const startLineComparison = symbol.range.startLineNumber - symbol2.range.startLineNumber;
        if (startLineComparison !== 0) {
            return startLineComparison;
        }
        const startOffsetComparison = symbol.range.startColumn - symbol2.range.startColumn;
        if (startOffsetComparison !== 0) {
            return startOffsetComparison;
        }
        const endLineComparison = symbol.range.endLineNumber - symbol2.range.endLineNumber;
        if (endLineComparison !== 0) {
            return endLineComparison;
        }
        return symbol.range.endColumn - symbol2.range.endColumn;
    }
};
__decorate([
    (0, inversify_1.inject)(outline_view_service_1.OutlineViewService),
    __metadata("design:type", outline_view_service_1.OutlineViewService)
], MonacoOutlineContribution.prototype, "outlineViewService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.EditorManager),
    __metadata("design:type", browser_1.EditorManager)
], MonacoOutlineContribution.prototype, "editorManager", void 0);
MonacoOutlineContribution = __decorate([
    (0, inversify_1.injectable)()
], MonacoOutlineContribution);
exports.MonacoOutlineContribution = MonacoOutlineContribution;
var MonacoOutlineSymbolInformationNode;
(function (MonacoOutlineSymbolInformationNode) {
    function is(node) {
        return outline_view_widget_1.OutlineSymbolInformationNode.is(node) && 'uri' in node && 'range' in node;
    }
    MonacoOutlineSymbolInformationNode.is = is;
    function insert(nodes, node) {
        const index = nodes.findIndex(current => compare(node, current) < 0);
        if (index === -1) {
            nodes.push(node);
        }
        else {
            nodes.splice(index, 0, node);
        }
    }
    MonacoOutlineSymbolInformationNode.insert = insert;
    function compare(node, node2) {
        const startLineComparison = node.range.start.line - node2.range.start.line;
        if (startLineComparison !== 0) {
            return startLineComparison;
        }
        const startColumnComparison = node.range.start.character - node2.range.start.character;
        if (startColumnComparison !== 0) {
            return startColumnComparison;
        }
        const endLineComparison = node2.range.end.line - node.range.end.line;
        if (endLineComparison !== 0) {
            return endLineComparison;
        }
        return node2.range.end.character - node.range.end.character;
    }
    MonacoOutlineSymbolInformationNode.compare = compare;
})(MonacoOutlineSymbolInformationNode = exports.MonacoOutlineSymbolInformationNode || (exports.MonacoOutlineSymbolInformationNode = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/monaco/lib/browser/monaco-outline-contribution'] = this;


/***/ }),

/***/ "../../packages/monaco/lib/browser/monaco-outline-decorator.js":
/*!*********************************************************************!*\
  !*** ../../packages/monaco/lib/browser/monaco-outline-decorator.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2018 RedHat and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MonacoOutlineDecorator = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const event_1 = __webpack_require__(/*! @theia/core/lib/common/event */ "../../packages/core/lib/common/event.js");
const tree_iterator_1 = __webpack_require__(/*! @theia/core/lib/browser/tree/tree-iterator */ "../../packages/core/lib/browser/tree/tree-iterator.js");
const monaco_outline_contribution_1 = __webpack_require__(/*! ./monaco-outline-contribution */ "../../packages/monaco/lib/browser/monaco-outline-contribution.js");
let MonacoOutlineDecorator = class MonacoOutlineDecorator {
    constructor() {
        this.id = 'theia-monaco-outline-decorator';
        this.emitter = new event_1.Emitter();
    }
    async decorations(tree) {
        return this.collectDecorations(tree);
    }
    get onDidChangeDecorations() {
        return this.emitter.event;
    }
    collectDecorations(tree) {
        const result = new Map();
        if (tree.root === undefined) {
            return result;
        }
        for (const treeNode of new tree_iterator_1.DepthFirstTreeIterator(tree.root)) {
            if (monaco_outline_contribution_1.MonacoOutlineSymbolInformationNode.is(treeNode) && treeNode.detail) {
                result.set(treeNode.id, this.toDecoration(treeNode));
            }
        }
        return result;
    }
    toDecoration(node) {
        const captionSuffixes = [{
                data: (node.detail || ''),
                fontData: {
                    color: 'var(--theia-descriptionForeground)',
                }
            }];
        return {
            captionSuffixes
        };
    }
};
MonacoOutlineDecorator = __decorate([
    (0, inversify_1.injectable)()
], MonacoOutlineDecorator);
exports.MonacoOutlineDecorator = MonacoOutlineDecorator;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/monaco/lib/browser/monaco-outline-decorator'] = this;


/***/ }),

/***/ "../../packages/monaco/lib/browser/monaco-quick-access-registry.js":
/*!*************************************************************************!*\
  !*** ../../packages/monaco/lib/browser/monaco-quick-access-registry.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2021 Red Hat and others.
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
exports.MonacoQuickAccessRegistry = void 0;
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const monaco_quick_input_service_1 = __webpack_require__(/*! ./monaco-quick-input-service */ "../../packages/monaco/lib/browser/monaco-quick-input-service.js");
const pickerQuickAccess_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/platform/quickinput/browser/pickerQuickAccess */ "../../node_modules/@theia/monaco-editor-core/esm/vs/platform/quickinput/browser/pickerQuickAccess.js");
const quickAccess_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/platform/quickinput/common/quickAccess */ "../../node_modules/@theia/monaco-editor-core/esm/vs/platform/quickinput/common/quickAccess.js");
const platform_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/platform/registry/common/platform */ "../../node_modules/@theia/monaco-editor-core/esm/vs/platform/registry/common/platform.js");
class MonacoPickerAccessProvider extends pickerQuickAccess_1.PickerQuickAccessProvider {
    constructor(prefix, options) {
        super(prefix, options);
    }
}
class TheiaQuickAccessDescriptor {
    constructor(theiaDescriptor, 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ctor, prefix, helpEntries, placeholder) {
        this.theiaDescriptor = theiaDescriptor;
        this.ctor = ctor;
        this.prefix = prefix;
        this.helpEntries = helpEntries;
        this.placeholder = placeholder;
    }
}
let MonacoQuickAccessRegistry = class MonacoQuickAccessRegistry {
    get monacoRegistry() {
        return platform_1.Registry.as(quickAccess_1.Extensions.Quickaccess);
    }
    registerQuickAccessProvider(descriptor) {
        const toMonacoPick = (item) => {
            if (browser_1.QuickPickSeparator.is(item)) {
                return item;
            }
            else {
                return new monaco_quick_input_service_1.MonacoQuickPickItem(item, this.keybindingRegistry);
            }
        };
        const inner = class extends MonacoPickerAccessProvider {
            getDescriptor() {
                return descriptor;
            }
            constructor() {
                super(descriptor.prefix);
            }
            async _getPicks(filter, disposables, token) {
                const result = await Promise.resolve(descriptor.getInstance().getPicks(filter, token));
                return result.map(toMonacoPick);
            }
        };
        return this.monacoRegistry.registerQuickAccessProvider(new TheiaQuickAccessDescriptor(descriptor, inner, descriptor.prefix, descriptor.helpEntries, descriptor.placeholder));
    }
    getQuickAccessProviders() {
        return this.monacoRegistry.getQuickAccessProviders()
            .filter(provider => provider instanceof TheiaQuickAccessDescriptor)
            .map(provider => provider.theiaDescriptor);
    }
    getQuickAccessProvider(prefix) {
        const monacoDescriptor = this.monacoRegistry.getQuickAccessProvider(prefix);
        return monacoDescriptor ? monacoDescriptor.theiaDescriptor : undefined;
    }
    clear() {
        if (this.monacoRegistry instanceof quickAccess_1.QuickAccessRegistry) {
            this.monacoRegistry.clear();
        }
    }
};
__decorate([
    (0, inversify_1.inject)(browser_1.KeybindingRegistry),
    __metadata("design:type", browser_1.KeybindingRegistry)
], MonacoQuickAccessRegistry.prototype, "keybindingRegistry", void 0);
MonacoQuickAccessRegistry = __decorate([
    (0, inversify_1.injectable)()
], MonacoQuickAccessRegistry);
exports.MonacoQuickAccessRegistry = MonacoQuickAccessRegistry;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/monaco/lib/browser/monaco-quick-access-registry'] = this;


/***/ }),

/***/ "../../packages/monaco/lib/browser/monaco-snippet-suggest-provider.js":
/*!****************************************************************************!*\
  !*** ../../packages/monaco/lib/browser/monaco-snippet-suggest-provider.js ***!
  \****************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MonacoSnippetSuggestProvider_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MonacoSnippetSuggestion = exports.JsonSerializedSnippet = exports.MonacoSnippetSuggestProvider = void 0;
const jsoncparser = __webpack_require__(/*! jsonc-parser */ "../../node_modules/jsonc-parser/lib/esm/main.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
const file_service_1 = __webpack_require__(/*! @theia/filesystem/lib/browser/file-service */ "../../packages/filesystem/lib/browser/file-service.js");
const files_1 = __webpack_require__(/*! @theia/filesystem/lib/common/files */ "../../packages/filesystem/lib/common/files.js");
const monaco = __webpack_require__(/*! @theia/monaco-editor-core */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/editor.main.js");
const snippetParser_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/contrib/snippet/browser/snippetParser */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/contrib/snippet/browser/snippetParser.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
let MonacoSnippetSuggestProvider = MonacoSnippetSuggestProvider_1 = class MonacoSnippetSuggestProvider {
    constructor() {
        this.snippets = new Map();
        this.pendingSnippets = new Map();
    }
    async provideCompletionItems(model, position, context) {
        // copied and modified from https://github.com/microsoft/vscode/blob/master/src/vs/workbench/contrib/snippets/browser/snippetCompletionProvider.ts
        if (position.column >= MonacoSnippetSuggestProvider_1._maxPrefix) {
            return undefined;
        }
        if (context.triggerKind === monaco.languages.CompletionTriggerKind.TriggerCharacter && context.triggerCharacter === ' ') {
            // no snippets when suggestions have been triggered by space
            return undefined;
        }
        const languageId = model.getLanguageId(); // TODO: look up a language id at the position
        await this.loadSnippets(languageId);
        const snippetsForLanguage = this.snippets.get(languageId) || [];
        const pos = { lineNumber: position.lineNumber, column: 1 };
        const lineOffsets = [];
        const linePrefixLow = model.getLineContent(position.lineNumber).substring(0, position.column - 1).toLowerCase();
        const endsInWhitespace = linePrefixLow.match(/\s$/);
        while (pos.column < position.column) {
            const word = model.getWordAtPosition(pos);
            if (word) {
                // at a word
                lineOffsets.push(word.startColumn - 1);
                pos.column = word.endColumn + 1;
                if (word.endColumn - 1 < linePrefixLow.length && !/\s/.test(linePrefixLow[word.endColumn - 1])) {
                    lineOffsets.push(word.endColumn - 1);
                }
            }
            else if (!/\s/.test(linePrefixLow[pos.column - 1])) {
                // at a none-whitespace character
                lineOffsets.push(pos.column - 1);
                pos.column += 1;
            }
            else {
                // always advance!
                pos.column += 1;
            }
        }
        const availableSnippets = new Set();
        snippetsForLanguage.forEach(availableSnippets.add, availableSnippets);
        const suggestions = [];
        for (const start of lineOffsets) {
            availableSnippets.forEach(snippet => {
                if (this.isPatternInWord(linePrefixLow, start, linePrefixLow.length, snippet.prefix.toLowerCase(), 0, snippet.prefix.length)) {
                    suggestions.push(new MonacoSnippetSuggestion(snippet, monaco.Range.fromPositions(position.delta(0, -(linePrefixLow.length - start)), position)));
                    availableSnippets.delete(snippet);
                }
            });
        }
        if (endsInWhitespace || lineOffsets.length === 0) {
            // add remaining snippets when the current prefix ends in whitespace or when no
            // interesting positions have been found
            availableSnippets.forEach(snippet => {
                suggestions.push(new MonacoSnippetSuggestion(snippet, monaco.Range.fromPositions(position)));
            });
        }
        // disambiguate suggestions with same labels
        suggestions.sort(MonacoSnippetSuggestion.compareByLabel);
        return { suggestions };
    }
    resolveCompletionItem(item, token) {
        return item instanceof MonacoSnippetSuggestion ? item.resolve() : item;
    }
    async loadSnippets(scope) {
        const pending = [];
        pending.push(...(this.pendingSnippets.get(scope) || []));
        pending.push(...(this.pendingSnippets.get('*') || []));
        if (pending.length) {
            await Promise.all(pending);
        }
    }
    fromURI(uri, options) {
        const toDispose = new disposable_1.DisposableCollection(disposable_1.Disposable.create(() => { }));
        const pending = this.loadURI(uri, options, toDispose);
        const { language } = options;
        const scopes = Array.isArray(language) ? language : !!language ? [language] : ['*'];
        for (const scope of scopes) {
            const pendingSnippets = this.pendingSnippets.get(scope) || [];
            pendingSnippets.push(pending);
            this.pendingSnippets.set(scope, pendingSnippets);
            toDispose.push(disposable_1.Disposable.create(() => {
                const index = pendingSnippets.indexOf(pending);
                if (index !== -1) {
                    pendingSnippets.splice(index, 1);
                }
            }));
        }
        return toDispose;
    }
    /**
     * should NOT throw to prevent load errors on suggest
     */
    async loadURI(uri, options, toDispose) {
        try {
            const resource = typeof uri === 'string' ? new uri_1.default(uri) : uri;
            const { value } = await this.fileService.read(resource);
            if (toDispose.disposed) {
                return;
            }
            const snippets = value && jsoncparser.parse(value, undefined, { disallowComments: false });
            toDispose.push(this.fromJSON(snippets, options));
        }
        catch (e) {
            if (!(e instanceof files_1.FileOperationError)) {
                console.error(e);
            }
        }
    }
    fromJSON(snippets, { language, source }) {
        const toDispose = new disposable_1.DisposableCollection();
        this.parseSnippets(snippets, (name, snippet) => {
            const { isFileTemplate, prefix, body, description } = snippet;
            const parsedBody = Array.isArray(body) ? body.join('\n') : body;
            const parsedPrefixes = !prefix ? [''] : Array.isArray(prefix) ? prefix : [prefix];
            if (typeof parsedBody !== 'string') {
                return;
            }
            const scopes = [];
            if (language) {
                if (Array.isArray(language)) {
                    scopes.push(...language);
                }
                else {
                    scopes.push(language);
                }
            }
            else if (typeof snippet.scope === 'string') {
                for (const rawScope of snippet.scope.split(',')) {
                    const scope = rawScope.trim();
                    if (scope) {
                        scopes.push(scope);
                    }
                }
            }
            parsedPrefixes.forEach(parsedPrefix => toDispose.push(this.push({
                isFileTemplate: Boolean(isFileTemplate),
                scopes,
                name,
                prefix: parsedPrefix,
                description,
                body: parsedBody,
                source
            })));
        });
        return toDispose;
    }
    parseSnippets(snippets, accept) {
        for (const [name, scopeOrTemplate] of Object.entries(snippets !== null && snippets !== void 0 ? snippets : {})) {
            if (JsonSerializedSnippet.is(scopeOrTemplate)) {
                accept(name, scopeOrTemplate);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-shadow
                for (const [name, template] of Object.entries(scopeOrTemplate)) {
                    accept(name, template);
                }
            }
        }
    }
    push(...snippets) {
        const toDispose = new disposable_1.DisposableCollection();
        for (const snippet of snippets) {
            for (const scope of snippet.scopes) {
                const languageSnippets = this.snippets.get(scope) || [];
                languageSnippets.push(snippet);
                this.snippets.set(scope, languageSnippets);
                toDispose.push(disposable_1.Disposable.create(() => {
                    const index = languageSnippets.indexOf(snippet);
                    if (index !== -1) {
                        languageSnippets.splice(index, 1);
                    }
                }));
            }
        }
        return toDispose;
    }
    isPatternInWord(patternLow, patternPos, patternLen, wordLow, wordPos, wordLen) {
        while (patternPos < patternLen && wordPos < wordLen) {
            if (patternLow[patternPos] === wordLow[wordPos]) {
                patternPos += 1;
            }
            wordPos += 1;
        }
        return patternPos === patternLen; // pattern must be exhausted
    }
};
MonacoSnippetSuggestProvider._maxPrefix = 10000;
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], MonacoSnippetSuggestProvider.prototype, "fileService", void 0);
MonacoSnippetSuggestProvider = MonacoSnippetSuggestProvider_1 = __decorate([
    (0, inversify_1.injectable)()
], MonacoSnippetSuggestProvider);
exports.MonacoSnippetSuggestProvider = MonacoSnippetSuggestProvider;
var JsonSerializedSnippet;
(function (JsonSerializedSnippet) {
    function is(obj) {
        return (0, common_1.isObject)(obj) && 'body' in obj;
    }
    JsonSerializedSnippet.is = is;
})(JsonSerializedSnippet = exports.JsonSerializedSnippet || (exports.JsonSerializedSnippet = {}));
class MonacoSnippetSuggestion {
    constructor(snippet, range) {
        this.snippet = snippet;
        this.range = range;
        this.noAutoAccept = true;
        this.kind = monaco.languages.CompletionItemKind.Snippet;
        this.insertTextRules = monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet;
        this.resolved = false;
        this.label = snippet.prefix;
        this.detail = `${snippet.description || snippet.name} (${snippet.source})`;
        this.insertText = snippet.body;
        this.sortText = `z-${snippet.prefix}`;
        this.range = range;
    }
    resolve() {
        if (!this.resolved) {
            const codeSnippet = new snippetParser_1.SnippetParser().parse(this.snippet.body).toString();
            this.documentation = { value: '```\n' + codeSnippet + '```' };
            this.resolved = true;
        }
        return this;
    }
    static compareByLabel(a, b) {
        return a.label > b.label ? 1 : a.label < b.label ? -1 : 0;
    }
}
exports.MonacoSnippetSuggestion = MonacoSnippetSuggestion;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/monaco/lib/browser/monaco-snippet-suggest-provider'] = this;


/***/ }),

/***/ "../../packages/monaco/lib/browser/monaco-status-bar-contribution.js":
/*!***************************************************************************!*\
  !*** ../../packages/monaco/lib/browser/monaco-status-bar-contribution.js ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2018 Ericsson
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
exports.MonacoStatusBarContribution = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const browser_2 = __webpack_require__(/*! @theia/editor/lib/browser */ "../../packages/editor/lib/browser/index.js");
const monaco_editor_1 = __webpack_require__(/*! ./monaco-editor */ "../../packages/monaco/lib/browser/monaco-editor.js");
let MonacoStatusBarContribution = class MonacoStatusBarContribution {
    constructor(editorManager, statusBar) {
        this.editorManager = editorManager;
        this.statusBar = statusBar;
        this.toDispose = new core_1.DisposableCollection();
    }
    onStart(app) {
        this.updateStatusBar();
        this.editorManager.onCurrentEditorChanged(() => this.updateStatusBar());
    }
    updateStatusBar() {
        const editor = this.editorManager.currentEditor;
        const editorModel = this.getModel(editor);
        if (editor && editorModel) {
            this.setConfigTabSizeWidget();
            this.setLineEndingWidget();
            this.toDispose.dispose();
            this.toDispose.push(editorModel.onDidChangeOptions(() => {
                this.setConfigTabSizeWidget();
                this.setLineEndingWidget();
            }));
            let previous = editorModel.getEOL();
            this.toDispose.push(editorModel.onDidChangeContent(e => {
                if (previous !== e.eol) {
                    previous = e.eol;
                    this.setLineEndingWidget();
                }
            }));
        }
        else {
            this.removeConfigTabSizeWidget();
            this.removeLineEndingWidget();
        }
    }
    setConfigTabSizeWidget() {
        const editor = this.editorManager.currentEditor;
        const editorModel = this.getModel(editor);
        if (editor && editorModel) {
            const modelOptions = editorModel.getOptions();
            const tabSize = modelOptions.tabSize;
            const spaceOrTabSizeMessage = modelOptions.insertSpaces
                ? core_1.nls.localizeByDefault('Spaces: {0}', tabSize)
                : core_1.nls.localizeByDefault('Tab Size: {0}', tabSize);
            this.statusBar.setElement('editor-status-tabbing-config', {
                text: spaceOrTabSizeMessage,
                alignment: browser_1.StatusBarAlignment.RIGHT,
                priority: 10,
                command: browser_2.EditorCommands.CONFIG_INDENTATION.id,
                tooltip: core_1.nls.localizeByDefault('Select Indentation')
            });
        }
    }
    removeConfigTabSizeWidget() {
        this.statusBar.removeElement('editor-status-tabbing-config');
    }
    setLineEndingWidget() {
        const editor = this.editorManager.currentEditor;
        const editorModel = this.getModel(editor);
        if (editor && editorModel) {
            const eol = editorModel.getEOL();
            const text = eol === '\n' ? 'LF' : 'CRLF';
            this.statusBar.setElement('editor-status-eol', {
                text: `${text}`,
                alignment: browser_1.StatusBarAlignment.RIGHT,
                priority: 11,
                command: browser_2.EditorCommands.CONFIG_EOL.id,
                tooltip: core_1.nls.localizeByDefault('Select End of Line Sequence')
            });
        }
    }
    removeLineEndingWidget() {
        this.statusBar.removeElement('editor-status-eol');
    }
    getModel(editor) {
        const monacoEditor = monaco_editor_1.MonacoEditor.get(editor);
        return monacoEditor && monacoEditor.getControl().getModel() || undefined;
    }
};
MonacoStatusBarContribution = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(browser_2.EditorManager)),
    __param(1, (0, inversify_1.inject)(browser_1.StatusBar)),
    __metadata("design:paramtypes", [browser_2.EditorManager, Object])
], MonacoStatusBarContribution);
exports.MonacoStatusBarContribution = MonacoStatusBarContribution;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/monaco/lib/browser/monaco-status-bar-contribution'] = this;


/***/ }),

/***/ "../../packages/monaco/lib/browser/monaco-theming-service.js":
/*!*******************************************************************!*\
  !*** ../../packages/monaco/lib/browser/monaco-theming-service.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var MonacoThemingService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MonacoThemingService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const jsoncparser = __webpack_require__(/*! jsonc-parser */ "../../node_modules/jsonc-parser/lib/esm/main.js");
const plistparser = __webpack_require__(/*! fast-plist */ "../../node_modules/fast-plist/release/src/main.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
const monaco_theme_registry_1 = __webpack_require__(/*! ./textmate/monaco-theme-registry */ "../../packages/monaco/lib/browser/textmate/monaco-theme-registry.js");
const monaco_indexed_db_1 = __webpack_require__(/*! ./monaco-indexed-db */ "../../packages/monaco/lib/browser/monaco-indexed-db.js");
const file_service_1 = __webpack_require__(/*! @theia/filesystem/lib/browser/file-service */ "../../packages/filesystem/lib/browser/file-service.js");
let MonacoThemingService = MonacoThemingService_1 = class MonacoThemingService {
    constructor() {
        this.toUpdateUiTheme = new disposable_1.DisposableCollection();
    }
    /** Register themes whose configuration needs to be loaded */
    register(theme, pending = {}) {
        const toDispose = new disposable_1.DisposableCollection(disposable_1.Disposable.create(() => { }));
        this.doRegister(theme, pending, toDispose);
        return toDispose;
    }
    async doRegister(theme, pending, toDispose) {
        try {
            const includes = {};
            const json = await this.loadTheme(theme.uri, includes, pending, toDispose);
            if (toDispose.disposed) {
                return;
            }
            const label = theme.label || new uri_1.default(theme.uri).path.base;
            const { id, description, uiTheme } = theme;
            toDispose.push(this.registerParsedTheme({ id, label, description, uiTheme: uiTheme, json, includes }));
        }
        catch (e) {
            console.error('Failed to load theme from ' + theme.uri, e);
        }
    }
    async loadTheme(uri, includes, pending, toDispose) {
        const result = await this.fileService.read(new uri_1.default(uri));
        const content = result.value;
        if (toDispose.disposed) {
            return;
        }
        const themeUri = new uri_1.default(uri);
        if (themeUri.path.ext !== '.json') {
            const value = plistparser.parse(content);
            if (value && 'settings' in value && Array.isArray(value.settings)) {
                return { tokenColors: value.settings };
            }
            throw new Error(`Problem parsing tmTheme file: ${uri}. 'settings' is not array.`);
        }
        const json = jsoncparser.parse(content, undefined, { disallowComments: false });
        if ('tokenColors' in json && typeof json.tokenColors === 'string') {
            const value = await this.doLoadTheme(themeUri, json.tokenColors, includes, pending, toDispose);
            if (toDispose.disposed) {
                return;
            }
            json.tokenColors = value.tokenColors;
        }
        if (json.include) {
            includes[json.include] = await this.doLoadTheme(themeUri, json.include, includes, pending, toDispose);
            if (toDispose.disposed) {
                return;
            }
        }
        this.clean(json.colors);
        return json;
    }
    doLoadTheme(themeUri, referencedPath, includes, pending, toDispose) {
        const referencedUri = themeUri.parent.resolve(referencedPath).toString();
        if (!pending[referencedUri]) {
            pending[referencedUri] = this.loadTheme(referencedUri, includes, pending, toDispose);
        }
        return pending[referencedUri];
    }
    initialize() {
        this.monacoThemeRegistry.initializeDefaultThemes();
        this.updateBodyUiTheme();
        this.themeService.onDidColorThemeChange(() => this.updateBodyUiTheme());
        this.themeService.onDidRetrieveTheme(theme => this.monacoThemeRegistry.setTheme(MonacoThemingService_1.toCssSelector(theme.id), theme.data));
        this.restore();
    }
    /** register a theme whose configuration has already been loaded */
    registerParsedTheme(theme) {
        const uiTheme = theme.uiTheme || 'vs-dark';
        const { label, description, json, includes } = theme;
        const id = theme.id || label;
        const cssSelector = MonacoThemingService_1.toCssSelector(id);
        const data = this.monacoThemeRegistry.register(json, includes, cssSelector, uiTheme);
        return this.doRegisterParsedTheme({ id, label, description, uiTheme, data });
    }
    updateBodyUiTheme() {
        this.toUpdateUiTheme.dispose();
        const type = this.themeService.getCurrentTheme().type;
        const uiTheme = type === 'hc' ? 'hc-black' : type === 'light' ? 'vs' : 'vs-dark';
        document.body.classList.add(uiTheme);
        this.toUpdateUiTheme.push(disposable_1.Disposable.create(() => document.body.classList.remove(uiTheme)));
    }
    doRegisterParsedTheme(state) {
        return new disposable_1.DisposableCollection(this.themeService.register((0, monaco_indexed_db_1.stateToTheme)(state)), (0, monaco_indexed_db_1.putTheme)(state));
    }
    async restore() {
        try {
            const themes = await (0, monaco_indexed_db_1.getThemes)();
            for (const state of themes) {
                this.monacoThemeRegistry.setTheme(state.data.name, state.data);
                this.doRegisterParsedTheme(state);
            }
        }
        catch (e) {
            console.error('Failed to restore monaco themes', e);
        }
    }
    /* remove all characters that are not allowed in css */
    static toCssSelector(str) {
        str = str.replace(/[^\-a-zA-Z0-9]/g, '-');
        if (str.charAt(0).match(/[0-9\-]/)) {
            str = '-' + str;
        }
        return str;
    }
    /** removes all invalid theming values */
    clean(obj) {
        for (const key in obj) {
            if (typeof obj[key] !== 'string') {
                delete obj[key];
            }
        }
    }
};
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], MonacoThemingService.prototype, "fileService", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_theme_registry_1.MonacoThemeRegistry),
    __metadata("design:type", monaco_theme_registry_1.MonacoThemeRegistry)
], MonacoThemingService.prototype, "monacoThemeRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_indexed_db_1.ThemeServiceWithDB),
    __metadata("design:type", monaco_indexed_db_1.ThemeServiceWithDB)
], MonacoThemingService.prototype, "themeService", void 0);
MonacoThemingService = MonacoThemingService_1 = __decorate([
    (0, inversify_1.injectable)()
], MonacoThemingService);
exports.MonacoThemingService = MonacoThemingService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/monaco/lib/browser/monaco-theming-service'] = this;


/***/ }),

/***/ "../../packages/monaco/lib/browser/textmate/monaco-textmate-frontend-bindings.js":
/*!***************************************************************************************!*\
  !*** ../../packages/monaco/lib/browser/textmate/monaco-textmate-frontend-bindings.js ***!
  \***************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2018 Ericsson and others.
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
exports.fetchOnigasm = exports.createOnigasmLib = exports.OnigasmLib = void 0;
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const textmate_registry_1 = __webpack_require__(/*! ./textmate-registry */ "../../packages/monaco/lib/browser/textmate/textmate-registry.js");
const textmate_contribution_1 = __webpack_require__(/*! ./textmate-contribution */ "../../packages/monaco/lib/browser/textmate/textmate-contribution.js");
const monaco_textmate_service_1 = __webpack_require__(/*! ./monaco-textmate-service */ "../../packages/monaco/lib/browser/textmate/monaco-textmate-service.js");
const monaco_theme_registry_1 = __webpack_require__(/*! ./monaco-theme-registry */ "../../packages/monaco/lib/browser/textmate/monaco-theme-registry.js");
const vscode_oniguruma_1 = __webpack_require__(/*! vscode-oniguruma */ "../../node_modules/vscode-oniguruma/release/main.js");
const vscode_textmate_1 = __webpack_require__(/*! vscode-textmate */ "../../node_modules/vscode-textmate/release/main.js");
const monaco_theme_types_1 = __webpack_require__(/*! ./monaco-theme-types */ "../../packages/monaco/lib/browser/textmate/monaco-theme-types.js");
class OnigasmLib {
    createOnigScanner(sources) {
        return (0, vscode_oniguruma_1.createOnigScanner)(sources);
    }
    createOnigString(sources) {
        return (0, vscode_oniguruma_1.createOnigString)(sources);
    }
}
exports.OnigasmLib = OnigasmLib;
exports["default"] = (bind, unbind, isBound, rebind) => {
    const onigLib = createOnigasmLib();
    bind(monaco_theme_types_1.OnigasmProvider).toConstantValue(() => onigLib);
    bind(monaco_textmate_service_1.MonacoTextmateService).toSelf().inSingletonScope();
    bind(browser_1.FrontendApplicationContribution).toService(monaco_textmate_service_1.MonacoTextmateService);
    (0, core_1.bindContributionProvider)(bind, textmate_contribution_1.LanguageGrammarDefinitionContribution);
    bind(textmate_registry_1.TextmateRegistry).toSelf().inSingletonScope();
    bind(monaco_theme_registry_1.MonacoThemeRegistry).toSelf().inSingletonScope();
    bind(monaco_theme_types_1.TextmateRegistryFactory).toFactory(({ container }) => (theme) => {
        const onigProvider = container.get(monaco_theme_types_1.OnigasmProvider);
        const textmateRegistry = container.get(textmate_registry_1.TextmateRegistry);
        return new vscode_textmate_1.Registry({
            onigLib: onigProvider(),
            theme,
            loadGrammar: async (scopeName) => {
                const provider = textmateRegistry.getProvider(scopeName);
                if (provider) {
                    const definition = await provider.getGrammarDefinition();
                    let rawGrammar;
                    if (typeof definition.content === 'string') {
                        rawGrammar = (0, vscode_textmate_1.parseRawGrammar)(definition.content, definition.format === 'json' ? 'grammar.json' : 'grammar.plist');
                    }
                    else {
                        rawGrammar = definition.content;
                    }
                    return rawGrammar;
                }
                return undefined;
            },
            getInjections: (scopeName) => {
                const provider = textmateRegistry.getProvider(scopeName);
                if (provider && provider.getInjections) {
                    return provider.getInjections(scopeName);
                }
                return [];
            }
        });
    });
};
async function createOnigasmLib() {
    if (!browser_1.isBasicWasmSupported) {
        throw new Error('wasm not supported');
    }
    const wasm = await fetchOnigasm();
    await (0, vscode_oniguruma_1.loadWASM)(wasm);
    return new OnigasmLib();
}
exports.createOnigasmLib = createOnigasmLib;
async function fetchOnigasm() {
    // Using Webpack's wasm loader should give us a URL to fetch the resource from:
    const onigasmPath = __webpack_require__(/*! vscode-oniguruma/release/onig.wasm */ "../../node_modules/vscode-oniguruma/release/onig.wasm");
    const response = await fetch(onigasmPath, { method: 'GET' });
    return response.arrayBuffer();
}
exports.fetchOnigasm = fetchOnigasm;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/monaco/lib/browser/textmate/monaco-textmate-frontend-bindings'] = this;


/***/ }),

/***/ "../../packages/monaco/lib/browser/textmate/monaco-textmate-service.js":
/*!*****************************************************************************!*\
  !*** ../../packages/monaco/lib/browser/textmate/monaco-textmate-service.js ***!
  \*****************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2018 Redhat, Ericsson and others.
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
exports.MonacoTextmateService = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const theming_1 = __webpack_require__(/*! @theia/core/lib/browser/theming */ "../../packages/core/lib/browser/theming.js");
const textmate_contribution_1 = __webpack_require__(/*! ./textmate-contribution */ "../../packages/monaco/lib/browser/textmate/textmate-contribution.js");
const textmate_tokenizer_1 = __webpack_require__(/*! ./textmate-tokenizer */ "../../packages/monaco/lib/browser/textmate/textmate-tokenizer.js");
const textmate_registry_1 = __webpack_require__(/*! ./textmate-registry */ "../../packages/monaco/lib/browser/textmate/textmate-registry.js");
const monaco_theme_registry_1 = __webpack_require__(/*! ./monaco-theme-registry */ "../../packages/monaco/lib/browser/textmate/monaco-theme-registry.js");
const editor_preferences_1 = __webpack_require__(/*! @theia/editor/lib/browser/editor-preferences */ "../../packages/editor/lib/browser/editor-preferences.js");
const monaco = __webpack_require__(/*! @theia/monaco-editor-core */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/editor.main.js");
const languages_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/common/languages */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/common/languages.js");
const standaloneTheme_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/standalone/common/standaloneTheme */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/standalone/common/standaloneTheme.js");
const standaloneServices_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices.js");
const language_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/common/languages/language */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/common/languages/language.js");
const standaloneLanguages_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneLanguages */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneLanguages.js");
const monaco_theme_types_1 = __webpack_require__(/*! ./monaco-theme-types */ "../../packages/monaco/lib/browser/textmate/monaco-theme-types.js");
let MonacoTextmateService = class MonacoTextmateService {
    constructor() {
        this.tokenizerOption = {
            lineLimit: 400
        };
        this._activatedLanguages = new Set();
        this.toDisposeOnUpdateTheme = new core_1.DisposableCollection();
    }
    initialize() {
        if (!browser_1.isBasicWasmSupported) {
            console.log('Textmate support deactivated because WebAssembly is not detected.');
            return;
        }
        for (const grammarProvider of this.grammarProviders.getContributions()) {
            try {
                grammarProvider.registerTextmateLanguage(this.textmateRegistry);
            }
            catch (err) {
                console.error(err);
            }
        }
        this.grammarRegistry = this.registryFactory(this.monacoThemeRegistry.getThemeData(this.currentEditorTheme));
        this.tokenizerOption.lineLimit = this.preferences['editor.maxTokenizationLineLength'];
        this.preferences.onPreferenceChanged(e => {
            if (e.preferenceName === 'editor.maxTokenizationLineLength') {
                this.tokenizerOption.lineLimit = e.newValue;
            }
        });
        this.updateTheme();
        this.themeService.onDidColorThemeChange(() => this.updateTheme());
        for (const id of this.textmateRegistry.languages) {
            this.activateLanguage(id);
        }
    }
    updateTheme() {
        this.toDisposeOnUpdateTheme.dispose();
        const currentEditorTheme = this.currentEditorTheme;
        document.body.classList.add(currentEditorTheme);
        this.toDisposeOnUpdateTheme.push(core_1.Disposable.create(() => document.body.classList.remove(currentEditorTheme)));
        // first update registry to run tokenization with the proper theme
        const theme = this.monacoThemeRegistry.getThemeData(currentEditorTheme);
        if (theme) {
            this.grammarRegistry.setTheme(theme);
        }
        // then trigger tokenization by setting monaco theme
        monaco.editor.setTheme(currentEditorTheme);
    }
    get currentEditorTheme() {
        return this.themeService.getCurrentTheme().editorTheme || monaco_theme_registry_1.MonacoThemeRegistry.DARK_DEFAULT_THEME;
    }
    activateLanguage(language) {
        const toDispose = new core_1.DisposableCollection(core_1.Disposable.create(() => { }));
        toDispose.push(this.waitForLanguage(language, () => this.doActivateLanguage(language, toDispose)));
        return toDispose;
    }
    async doActivateLanguage(languageId, toDispose) {
        if (this._activatedLanguages.has(languageId)) {
            return;
        }
        this._activatedLanguages.add(languageId);
        toDispose.push(core_1.Disposable.create(() => this._activatedLanguages.delete(languageId)));
        const scopeName = this.textmateRegistry.getScope(languageId);
        if (!scopeName) {
            return;
        }
        const provider = this.textmateRegistry.getProvider(scopeName);
        if (!provider) {
            return;
        }
        const configuration = this.textmateRegistry.getGrammarConfiguration(languageId);
        const initialLanguage = (0, textmate_contribution_1.getEncodedLanguageId)(languageId);
        await this.onigasmProvider();
        if (toDispose.disposed) {
            return;
        }
        try {
            const grammar = await this.grammarRegistry.loadGrammarWithConfiguration(scopeName, initialLanguage, configuration);
            if (toDispose.disposed) {
                return;
            }
            if (!grammar) {
                throw new Error(`no grammar for ${scopeName}, ${initialLanguage}, ${JSON.stringify(configuration)}`);
            }
            const options = configuration.tokenizerOption ? configuration.tokenizerOption : this.tokenizerOption;
            const tokenizer = (0, textmate_tokenizer_1.createTextmateTokenizer)(grammar, options);
            toDispose.push(monaco.languages.setTokensProvider(languageId, tokenizer));
            const support = languages_1.TokenizationRegistry.get(languageId);
            const themeService = standaloneServices_1.StandaloneServices.get(standaloneTheme_1.IStandaloneThemeService);
            const languageService = standaloneServices_1.StandaloneServices.get(language_1.ILanguageService);
            const adapter = new standaloneLanguages_1.TokenizationSupportAdapter(languageId, tokenizer, languageService, themeService);
            support.tokenize = adapter.tokenize.bind(adapter);
        }
        catch (error) {
            this.logger.warn('No grammar for this language id', languageId, error);
        }
    }
    waitForLanguage(language, cb) {
        const languageService = standaloneServices_1.StandaloneServices.get(language_1.ILanguageService);
        if (languageService['_encounteredLanguages'].has(language)) {
            cb();
            return core_1.Disposable.NULL;
        }
        return monaco.languages.onLanguage(language, cb);
    }
};
__decorate([
    (0, inversify_1.inject)(core_1.ContributionProvider),
    (0, inversify_1.named)(textmate_contribution_1.LanguageGrammarDefinitionContribution),
    __metadata("design:type", Object)
], MonacoTextmateService.prototype, "grammarProviders", void 0);
__decorate([
    (0, inversify_1.inject)(textmate_registry_1.TextmateRegistry),
    __metadata("design:type", textmate_registry_1.TextmateRegistry)
], MonacoTextmateService.prototype, "textmateRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.ILogger),
    __metadata("design:type", Object)
], MonacoTextmateService.prototype, "logger", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_theme_types_1.OnigasmProvider),
    __metadata("design:type", Function)
], MonacoTextmateService.prototype, "onigasmProvider", void 0);
__decorate([
    (0, inversify_1.inject)(theming_1.ThemeService),
    __metadata("design:type", theming_1.ThemeService)
], MonacoTextmateService.prototype, "themeService", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_theme_registry_1.MonacoThemeRegistry),
    __metadata("design:type", monaco_theme_registry_1.MonacoThemeRegistry)
], MonacoTextmateService.prototype, "monacoThemeRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(editor_preferences_1.EditorPreferences),
    __metadata("design:type", Object)
], MonacoTextmateService.prototype, "preferences", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_theme_types_1.TextmateRegistryFactory),
    __metadata("design:type", Function)
], MonacoTextmateService.prototype, "registryFactory", void 0);
MonacoTextmateService = __decorate([
    (0, inversify_1.injectable)()
], MonacoTextmateService);
exports.MonacoTextmateService = MonacoTextmateService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/monaco/lib/browser/textmate/monaco-textmate-service'] = this;


/***/ }),

/***/ "../../packages/monaco/lib/browser/textmate/monaco-theme-registry.js":
/*!***************************************************************************!*\
  !*** ../../packages/monaco/lib/browser/textmate/monaco-theme-registry.js ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
exports.MonacoThemeRegistry = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const monaco = __webpack_require__(/*! @theia/monaco-editor-core */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/editor.main.js");
const standaloneTheme_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/standalone/common/standaloneTheme */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/standalone/common/standaloneTheme.js");
const standaloneServices_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices.js");
const monaco_theme_types_1 = __webpack_require__(/*! ./monaco-theme-types */ "../../packages/monaco/lib/browser/textmate/monaco-theme-types.js");
let MonacoThemeRegistry = class MonacoThemeRegistry {
    initializeDefaultThemes() {
        this.register(__webpack_require__(/*! ../../../data/monaco-themes/vscode/dark_theia.json */ "../../packages/monaco/data/monaco-themes/vscode/dark_theia.json"), {
            './dark_vs.json': __webpack_require__(/*! ../../../data/monaco-themes/vscode/dark_vs.json */ "../../packages/monaco/data/monaco-themes/vscode/dark_vs.json"),
            './dark_plus.json': __webpack_require__(/*! ../../../data/monaco-themes/vscode/dark_plus.json */ "../../packages/monaco/data/monaco-themes/vscode/dark_plus.json")
        }, 'dark-theia', 'vs-dark');
        this.register(__webpack_require__(/*! ../../../data/monaco-themes/vscode/light_theia.json */ "../../packages/monaco/data/monaco-themes/vscode/light_theia.json"), {
            './light_vs.json': __webpack_require__(/*! ../../../data/monaco-themes/vscode/light_vs.json */ "../../packages/monaco/data/monaco-themes/vscode/light_vs.json"),
            './light_plus.json': __webpack_require__(/*! ../../../data/monaco-themes/vscode/light_plus.json */ "../../packages/monaco/data/monaco-themes/vscode/light_plus.json"),
        }, 'light-theia', 'vs');
        this.register(__webpack_require__(/*! ../../../data/monaco-themes/vscode/hc_theia.json */ "../../packages/monaco/data/monaco-themes/vscode/hc_theia.json"), {
            './hc_black.json': __webpack_require__(/*! ../../../data/monaco-themes/vscode/hc_black.json */ "../../packages/monaco/data/monaco-themes/vscode/hc_black.json")
        }, 'hc-theia', 'hc-black');
        this.register(__webpack_require__(/*! ../../../data/monaco-themes/vscode/hc_theia_light.json */ "../../packages/monaco/data/monaco-themes/vscode/hc_theia_light.json"), {
            './hc_light.json': __webpack_require__(/*! ../../../data/monaco-themes/vscode/hc_light.json */ "../../packages/monaco/data/monaco-themes/vscode/hc_light.json")
        }, 'hc-theia-light', 'hc-light');
    }
    getThemeData(name) {
        const theme = this.doGetTheme(name);
        return theme && theme.themeData;
    }
    getTheme(name) {
        return this.doGetTheme(name);
    }
    doGetTheme(name) {
        const standaloneThemeService = standaloneServices_1.StandaloneServices.get(standaloneTheme_1.IStandaloneThemeService);
        const theme = !name ? standaloneThemeService.getColorTheme() : standaloneThemeService['_knownThemes'].get(name);
        return theme;
    }
    setTheme(name, data) {
        // monaco auto refreshes a theme with new data
        monaco.editor.defineTheme(name, data);
    }
    /**
     * Register VS Code compatible themes
     */
    register(json, includes, givenName, monacoBase) {
        const name = givenName || json.name;
        const result = {
            name,
            base: monacoBase || 'vs',
            inherit: true,
            colors: {},
            rules: [],
            settings: []
        };
        if (typeof json.include !== 'undefined') {
            if (!includes || !includes[json.include]) {
                console.error(`Couldn't resolve includes theme ${json.include}.`);
            }
            else {
                const parentTheme = this.register(includes[json.include], includes);
                Object.assign(result.colors, parentTheme.colors);
                result.rules.push(...parentTheme.rules);
                result.settings.push(...parentTheme.settings);
            }
        }
        const tokenColors = json.tokenColors;
        if (Array.isArray(tokenColors)) {
            for (const tokenColor of tokenColors) {
                if (tokenColor.scope && tokenColor.settings) {
                    result.settings.push({
                        scope: tokenColor.scope,
                        settings: {
                            foreground: this.normalizeColor(tokenColor.settings.foreground),
                            background: this.normalizeColor(tokenColor.settings.background),
                            fontStyle: tokenColor.settings.fontStyle
                        }
                    });
                }
            }
        }
        if (json.colors) {
            Object.assign(result.colors, json.colors);
            result.encodedTokensColors = Object.keys(result.colors).map(key => result.colors[key]);
        }
        if (monacoBase && givenName) {
            for (const setting of result.settings) {
                this.transform(setting, rule => result.rules.push(rule));
            }
            // the default rule (scope empty) is always the first rule. Ignore all other default rules.
            const defaultTheme = standaloneServices_1.StandaloneServices.get(standaloneTheme_1.IStandaloneThemeService)['_knownThemes'].get(result.base);
            const foreground = result.colors['editor.foreground'] || defaultTheme.getColor('editor.foreground');
            const background = result.colors['editor.background'] || defaultTheme.getColor('editor.background');
            result.settings.unshift({
                settings: {
                    foreground: this.normalizeColor(foreground),
                    background: this.normalizeColor(background)
                }
            });
            const reg = this.registryFactory(result);
            result.encodedTokensColors = reg.getColorMap();
            // index 0 has to be set to null as it is 'undefined' by default, but monaco code expects it to be null
            // eslint-disable-next-line no-null/no-null
            result.encodedTokensColors[0] = null;
            this.setTheme(givenName, result);
        }
        return result;
    }
    transform(tokenColor, acceptor) {
        if (typeof tokenColor.scope === 'undefined') {
            tokenColor.scope = [''];
        }
        else if (typeof tokenColor.scope === 'string') {
            tokenColor.scope = tokenColor.scope.split(',').map((scope) => scope.trim());
        }
        for (const scope of tokenColor.scope) {
            acceptor({
                ...tokenColor.settings, token: scope
            });
        }
    }
    normalizeColor(color) {
        if (!color) {
            return undefined;
        }
        const normalized = String(color).replace(/^\#/, '').slice(0, 6);
        if (normalized.length < 6 || !(normalized).match(/^[0-9A-Fa-f]{6}$/)) {
            // ignoring not normalized colors to avoid breaking token color indexes between monaco and vscode-textmate
            console.error(`Color '${normalized}' is NOT normalized, it must have 6 positions.`);
            return undefined;
        }
        return '#' + normalized;
    }
};
__decorate([
    (0, inversify_1.inject)(monaco_theme_types_1.TextmateRegistryFactory),
    __metadata("design:type", Function)
], MonacoThemeRegistry.prototype, "registryFactory", void 0);
MonacoThemeRegistry = __decorate([
    (0, inversify_1.injectable)()
], MonacoThemeRegistry);
exports.MonacoThemeRegistry = MonacoThemeRegistry;
(function (MonacoThemeRegistry) {
    MonacoThemeRegistry.DARK_DEFAULT_THEME = 'dark-theia';
    MonacoThemeRegistry.LIGHT_DEFAULT_THEME = 'light-theia';
    MonacoThemeRegistry.HC_DEFAULT_THEME = 'hc-theia';
    MonacoThemeRegistry.HC_LIGHT_THEME = 'hc-theia-light';
})(MonacoThemeRegistry = exports.MonacoThemeRegistry || (exports.MonacoThemeRegistry = {}));
exports.MonacoThemeRegistry = MonacoThemeRegistry;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/monaco/lib/browser/textmate/monaco-theme-registry'] = this;


/***/ }),

/***/ "../../packages/monaco/lib/browser/textmate/monaco-theme-types.js":
/*!************************************************************************!*\
  !*** ../../packages/monaco/lib/browser/textmate/monaco-theme-types.js ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, exports) {


// *****************************************************************************
// Copyright (C) 2018 Ericsson and others.
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
exports.TextmateRegistryFactory = exports.OnigasmProvider = void 0;
exports.OnigasmProvider = Symbol('OnigasmProvider');
exports.TextmateRegistryFactory = Symbol('TextmateRegistryFactory');
;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/monaco/lib/browser/textmate/monaco-theme-types'] = this;


/***/ }),

/***/ "../../packages/monaco/lib/browser/textmate/textmate-contribution.js":
/*!***************************************************************************!*\
  !*** ../../packages/monaco/lib/browser/textmate/textmate-contribution.js ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2018 Ericsson and others.
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
exports.getEncodedLanguageId = exports.LanguageGrammarDefinitionContribution = void 0;
const monaco = __webpack_require__(/*! @theia/monaco-editor-core */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/editor.main.js");
/**
 * Callback for extensions to contribute language grammar definitions
 */
exports.LanguageGrammarDefinitionContribution = Symbol('LanguageGrammarDefinitionContribution');
function getEncodedLanguageId(languageId) {
    return monaco.languages.getEncodedLanguageId(languageId);
}
exports.getEncodedLanguageId = getEncodedLanguageId;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/monaco/lib/browser/textmate/textmate-contribution'] = this;


/***/ }),

/***/ "../../packages/monaco/lib/browser/textmate/textmate-registry.js":
/*!***********************************************************************!*\
  !*** ../../packages/monaco/lib/browser/textmate/textmate-registry.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2018 Ericsson and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TextmateRegistry = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
let TextmateRegistry = class TextmateRegistry {
    constructor() {
        this.scopeToProvider = new Map();
        this.languageToConfig = new Map();
        this.languageIdToScope = new Map();
    }
    get languages() {
        return this.languageIdToScope.keys();
    }
    registerTextmateGrammarScope(scope, provider) {
        const providers = this.scopeToProvider.get(scope) || [];
        const existingProvider = providers[0];
        if (existingProvider) {
            Promise.all([existingProvider.getGrammarDefinition(), provider.getGrammarDefinition()]).then(([a, b]) => {
                if (a.location !== b.location || !a.location && !b.location) {
                    console.warn(`a registered grammar provider for '${scope}' scope is overridden`);
                }
            });
        }
        providers.unshift(provider);
        this.scopeToProvider.set(scope, providers);
        return disposable_1.Disposable.create(() => {
            const index = providers.indexOf(provider);
            if (index !== -1) {
                providers.splice(index, 1);
            }
        });
    }
    getProvider(scope) {
        const providers = this.scopeToProvider.get(scope);
        return providers && providers[0];
    }
    mapLanguageIdToTextmateGrammar(languageId, scope) {
        const scopes = this.languageIdToScope.get(languageId) || [];
        const existingScope = scopes[0];
        if (typeof existingScope === 'string') {
            console.warn(`'${languageId}' language is remapped from '${existingScope}' to '${scope}' scope`);
        }
        scopes.unshift(scope);
        this.languageIdToScope.set(languageId, scopes);
        return disposable_1.Disposable.create(() => {
            const index = scopes.indexOf(scope);
            if (index !== -1) {
                scopes.splice(index, 1);
            }
        });
    }
    getScope(languageId) {
        const scopes = this.languageIdToScope.get(languageId);
        return scopes && scopes[0];
    }
    getLanguageId(scope) {
        for (const languageId of this.languageIdToScope.keys()) {
            if (this.getScope(languageId) === scope) {
                return languageId;
            }
        }
        return undefined;
    }
    registerGrammarConfiguration(languageId, config) {
        const configs = this.languageToConfig.get(languageId) || [];
        const existingConfig = configs[0];
        if (existingConfig) {
            console.warn(`a registered grammar configuration for '${languageId}' language is overridden`);
        }
        configs.unshift(config);
        this.languageToConfig.set(languageId, configs);
        return disposable_1.Disposable.create(() => {
            const index = configs.indexOf(config);
            if (index !== -1) {
                configs.splice(index, 1);
            }
        });
    }
    getGrammarConfiguration(languageId) {
        const configs = this.languageToConfig.get(languageId);
        return configs && configs[0] || {};
    }
};
TextmateRegistry = __decorate([
    (0, inversify_1.injectable)()
], TextmateRegistry);
exports.TextmateRegistry = TextmateRegistry;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/monaco/lib/browser/textmate/textmate-registry'] = this;


/***/ }),

/***/ "../../packages/monaco/lib/browser/textmate/textmate-tokenizer.js":
/*!************************************************************************!*\
  !*** ../../packages/monaco/lib/browser/textmate/textmate-tokenizer.js ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2018 Ericsson and others.
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
exports.createTextmateTokenizer = exports.TokenizerState = void 0;
const vscode_textmate_1 = __webpack_require__(/*! vscode-textmate */ "../../node_modules/vscode-textmate/release/main.js");
class TokenizerState {
    constructor(stackElement) {
        this.stackElement = stackElement;
    }
    clone() {
        return new TokenizerState(this.stackElement);
    }
    equals(other) {
        return other instanceof TokenizerState && (other === this || other.stackElement === this.stackElement);
    }
}
exports.TokenizerState = TokenizerState;
function createTextmateTokenizer(grammar, options) {
    if (options.lineLimit !== undefined && (options.lineLimit <= 0 || !Number.isInteger(options.lineLimit))) {
        throw new Error(`The 'lineLimit' must be a positive integer. It was ${options.lineLimit}.`);
    }
    return {
        getInitialState: () => new TokenizerState(vscode_textmate_1.INITIAL),
        tokenizeEncoded(line, state) {
            if (options.lineLimit !== undefined && line.length > options.lineLimit) {
                // Skip tokenizing the line if it exceeds the line limit.
                return { endState: state.stackElement, tokens: new Uint32Array() };
            }
            const result = grammar.tokenizeLine2(line, state.stackElement, 500);
            return {
                endState: new TokenizerState(result.ruleStack),
                tokens: result.tokens
            };
        },
        tokenize(line, state) {
            if (options.lineLimit !== undefined && line.length > options.lineLimit) {
                // Skip tokenizing the line if it exceeds the line limit.
                return { endState: state.stackElement, tokens: [] };
            }
            const result = grammar.tokenizeLine(line, state.stackElement, 500);
            return {
                endState: new TokenizerState(result.ruleStack),
                tokens: result.tokens.map(t => ({
                    startIndex: t.startIndex,
                    scopes: t.scopes.reverse().join(' ')
                }))
            };
        }
    };
}
exports.createTextmateTokenizer = createTextmateTokenizer;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/monaco/lib/browser/textmate/textmate-tokenizer'] = this;


/***/ }),

/***/ "../../packages/monaco/lib/browser/workspace-symbol-command.js":
/*!*********************************************************************!*\
  !*** ../../packages/monaco/lib/browser/workspace-symbol-command.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var WorkspaceSymbolCommand_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WorkspaceSymbolCommand = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const environment_1 = __webpack_require__(/*! @theia/core/shared/@theia/application-package/lib/environment */ "../../packages/core/shared/@theia/application-package/lib/environment/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const quick_input_1 = __webpack_require__(/*! @theia/core/lib/browser/quick-input */ "../../packages/core/lib/browser/quick-input/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const vscode_languageserver_protocol_1 = __webpack_require__(/*! @theia/core/shared/vscode-languageserver-protocol */ "../../packages/core/shared/vscode-languageserver-protocol/index.js");
const monaco_languages_1 = __webpack_require__(/*! ./monaco-languages */ "../../packages/monaco/lib/browser/monaco-languages.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const browser_2 = __webpack_require__(/*! @theia/editor/lib/browser */ "../../packages/editor/lib/browser/index.js");
let WorkspaceSymbolCommand = WorkspaceSymbolCommand_1 = class WorkspaceSymbolCommand {
    constructor() {
        this.command = common_1.Command.toDefaultLocalizedCommand({
            id: 'languages.workspace.symbol',
            label: 'Go to Symbol in Workspace...'
        });
    }
    isEnabled() {
        return this.languages.workspaceSymbolProviders !== undefined;
    }
    execute() {
        this.quickInputService.open(WorkspaceSymbolCommand_1.PREFIX);
    }
    registerCommands(commands) {
        commands.registerCommand(this.command, this);
    }
    registerMenus(menus) {
        menus.registerMenuAction(browser_2.EditorMainMenu.WORKSPACE_GROUP, {
            commandId: this.command.id,
            order: '2'
        });
    }
    isElectron() {
        return environment_1.environment.electron.is();
    }
    registerKeybindings(keybindings) {
        keybindings.registerKeybinding({
            command: this.command.id,
            keybinding: this.isElectron() ? 'ctrlcmd+t' : 'ctrlcmd+o',
        });
    }
    registerQuickAccessProvider() {
        this.quickAccessRegistry.registerQuickAccessProvider({
            getInstance: () => this,
            prefix: WorkspaceSymbolCommand_1.PREFIX,
            placeholder: '',
            helpEntries: [{ description: common_1.nls.localizeByDefault('Go to Symbol in Workspace'), needsEditor: false }]
        });
    }
    async getPicks(filter, token) {
        const items = [];
        if (this.languages.workspaceSymbolProviders) {
            const param = {
                query: filter
            };
            const workspaceProviderPromises = [];
            for (const provider of this.languages.workspaceSymbolProviders) {
                workspaceProviderPromises.push((async () => {
                    const symbols = await provider.provideWorkspaceSymbols(param, token);
                    if (symbols && !token.isCancellationRequested) {
                        for (const symbol of symbols) {
                            items.push(this.createItem(symbol, provider, filter, token));
                        }
                    }
                    return symbols;
                })());
            }
            await Promise.all(workspaceProviderPromises.map(p => p.then(sym => sym, _ => undefined)))
                .then(symbols => {
                const filteredSymbols = symbols.filter(el => el && el.length !== 0);
                if (filteredSymbols.length === 0) {
                    items.push({
                        label: filter.length === 0
                            ? common_1.nls.localize('theia/monaco/typeToSearchForSymbols', 'Type to search for symbols')
                            : common_1.nls.localize('theia/monaco/noSymbolsMatching', 'No symbols matching'),
                    });
                }
            }).catch();
        }
        return items;
    }
    createItem(sym, provider, filter, token) {
        const uri = new uri_1.default(sym.location.uri);
        const iconClasses = this.toCssClassName(sym.kind);
        let parent = sym.containerName;
        if (parent) {
            parent += ' - ';
        }
        const description = (parent || '') + this.labelProvider.getName(uri);
        return ({
            label: sym.name,
            description,
            ariaLabel: uri.toString(),
            iconClasses,
            highlights: {
                label: (0, quick_input_1.findMatches)(sym.name, filter),
                description: (0, quick_input_1.findMatches)(description, filter)
            },
            execute: () => {
                if (provider.resolveWorkspaceSymbol) {
                    provider.resolveWorkspaceSymbol(sym, token).then(resolvedSymbol => {
                        if (resolvedSymbol) {
                            this.openURL(uri, resolvedSymbol.location.range.start, resolvedSymbol.location.range.end);
                        }
                        else {
                            // the symbol didn't resolve -> use given symbol
                            this.openURL(uri, sym.location.range.start, sym.location.range.end);
                        }
                    });
                }
                else {
                    // resolveWorkspaceSymbol wasn't specified
                    this.openURL(uri, sym.location.range.start, sym.location.range.end);
                }
            }
        });
    }
    toCssClassName(symbolKind, inline) {
        const kind = SymbolKind[symbolKind];
        if (!kind) {
            return undefined;
        }
        return [`codicon ${inline ? 'inline' : 'block'} codicon-symbol-${kind.toLowerCase() || 'property'}`];
    }
    openURL(uri, start, end) {
        this.openerService.getOpener(uri).then(opener => opener.open(uri, {
            selection: vscode_languageserver_protocol_1.Range.create(start, end)
        }));
    }
};
WorkspaceSymbolCommand.PREFIX = '#';
__decorate([
    (0, inversify_1.inject)(monaco_languages_1.MonacoLanguages),
    __metadata("design:type", monaco_languages_1.MonacoLanguages)
], WorkspaceSymbolCommand.prototype, "languages", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.OpenerService),
    __metadata("design:type", Object)
], WorkspaceSymbolCommand.prototype, "openerService", void 0);
__decorate([
    (0, inversify_1.inject)(quick_input_1.QuickInputService),
    __metadata("design:type", Object)
], WorkspaceSymbolCommand.prototype, "quickInputService", void 0);
__decorate([
    (0, inversify_1.inject)(quick_input_1.QuickAccessRegistry),
    __metadata("design:type", Object)
], WorkspaceSymbolCommand.prototype, "quickAccessRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.SelectionService),
    __metadata("design:type", common_1.SelectionService)
], WorkspaceSymbolCommand.prototype, "selectionService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.LabelProvider),
    __metadata("design:type", browser_1.LabelProvider)
], WorkspaceSymbolCommand.prototype, "labelProvider", void 0);
WorkspaceSymbolCommand = WorkspaceSymbolCommand_1 = __decorate([
    (0, inversify_1.injectable)()
], WorkspaceSymbolCommand);
exports.WorkspaceSymbolCommand = WorkspaceSymbolCommand;
var SymbolKind;
(function (SymbolKind) {
    SymbolKind[SymbolKind["File"] = 1] = "File";
    SymbolKind[SymbolKind["Module"] = 2] = "Module";
    SymbolKind[SymbolKind["Namespace"] = 3] = "Namespace";
    SymbolKind[SymbolKind["Package"] = 4] = "Package";
    SymbolKind[SymbolKind["Class"] = 5] = "Class";
    SymbolKind[SymbolKind["Method"] = 6] = "Method";
    SymbolKind[SymbolKind["Property"] = 7] = "Property";
    SymbolKind[SymbolKind["Field"] = 8] = "Field";
    SymbolKind[SymbolKind["Constructor"] = 9] = "Constructor";
    SymbolKind[SymbolKind["Enum"] = 10] = "Enum";
    SymbolKind[SymbolKind["Interface"] = 11] = "Interface";
    SymbolKind[SymbolKind["Function"] = 12] = "Function";
    SymbolKind[SymbolKind["Variable"] = 13] = "Variable";
    SymbolKind[SymbolKind["Constant"] = 14] = "Constant";
    SymbolKind[SymbolKind["String"] = 15] = "String";
    SymbolKind[SymbolKind["Number"] = 16] = "Number";
    SymbolKind[SymbolKind["Boolean"] = 17] = "Boolean";
    SymbolKind[SymbolKind["Array"] = 18] = "Array";
    SymbolKind[SymbolKind["Object"] = 19] = "Object";
    SymbolKind[SymbolKind["Key"] = 20] = "Key";
    SymbolKind[SymbolKind["Null"] = 21] = "Null";
    SymbolKind[SymbolKind["EnumMember"] = 22] = "EnumMember";
    SymbolKind[SymbolKind["Struct"] = 23] = "Struct";
    SymbolKind[SymbolKind["Event"] = 24] = "Event";
    SymbolKind[SymbolKind["Operator"] = 25] = "Operator";
    SymbolKind[SymbolKind["TypeParameter"] = 26] = "TypeParameter";
})(SymbolKind || (SymbolKind = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/monaco/lib/browser/workspace-symbol-command'] = this;


/***/ }),

/***/ "../../node_modules/css-loader/dist/cjs.js!../../packages/monaco/src/browser/style/index.css":
/*!***************************************************************************************************!*\
  !*** ../../node_modules/css-loader/dist/cjs.js!../../packages/monaco/src/browser/style/index.css ***!
  \***************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "../../node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/api.js */ "../../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.monaco-editor {
  padding-bottom: 5.6px;
  font-family: var(--theia-code-font-family);
  font-size: inherit !important;
}

#quick-input-container {
  position: fixed;
  right: 50%;
  z-index: 1000000;
}

/*
 * set z-index to 0, so tabs are not above overlay widgets
 */
.p-TabBar.theia-app-centers {
  z-index: 0;
  display: flex;
}

.monaco-editor .zone-widget {
  position: absolute;
  z-index: 10;
  background-color: var(--theia-editorWidget-background);
}

.monaco-editor .zone-widget .zone-widget-container {
  border-top-style: solid;
  border-bottom-style: solid;
  border-top-width: 0;
  border-bottom-width: 0;
  border-top-color: var(--theia-peekView-border);
  border-bottom-color: var(--theia-peekView-border);
  position: relative;
}

.monaco-editor .parameter-hints-widget > .wrapper {
  overflow: hidden;
}

/* List highlight, see https://github.com/microsoft/vscode/blob/ff5f581425da6230b6f9216ecf19abf6c9d285a6/src/vs/workbench/browser/style.ts#L50 */
.monaco-tree .monaco-tree-row .monaco-highlighted-label .highlight,
.monaco-list .monaco-list-row .monaco-highlighted-label .highlight {
  color: var(--theia-list-highlightForeground) !important;
}

/* Scrollbars, see https://github.com/microsoft/vscode/blob/ff5f581425da6230b6f9216ecf19abf6c9d285a6/src/vs/workbench/browser/style.ts#L65 */
.monaco-scrollable-element > .shadow.top {
  box-shadow: var(--theia-scrollbar-shadow) 0 6px 6px -6px inset !important;
}

.monaco-scrollable-element > .shadow.left {
  box-shadow: var(--theia-scrollbar-shadow) 6px 0 6px -6px inset !important;
}

.monaco-scrollable-element > .shadow.top.left {
  box-shadow: var(--theia-scrollbar-shadow) 6px 6px 6px -6px inset !important;
}

.monaco-scrollable-element > .scrollbar > .slider {
  background: var(--theia-scrollbarSlider-background) !important;
}

.monaco-scrollable-element > .scrollbar > .slider:hover {
  background: var(--theia-scrollbarSlider-hoverBackground) !important;
}

.monaco-scrollable-element > .scrollbar > .slider.active {
  background: var(--theia-scrollbarSlider-activeBackground) !important;
}

.monaco-editor .codicon.codicon-debug-start {
  color: var(--theia-debugIcon-startForeground) !important;
}

.monaco-editor .codelens-decoration a {
  color: inherit !important;
}

.monaco-editor .reference-zone-widget .ref-tree .referenceMatch .highlight {
  color: unset !important;
}

.monaco-editor .find-widget .monaco-inputbox.synthetic-focus {
  outline: var(--theia-border-width) solid;
  outline-offset: calc(-1 * var(--theia-border-width));
  outline-color: var(--theia-focusBorder);
}

.monaco-editor .rename-box input {
  color: var(--theia-editor-foreground);
}

.monaco-editor .rename-box .rename-label {
  opacity: 0.8;
  padding: 3px;
  font-family: sans-serif;
}

/* Monaco Quick Input */
.quick-input-widget {
  background-color: var(--theia-quickInput-background) !important;
  color: var(--theia-foreground) !important;
}

.quick-input-list .monaco-list-row.focused {
  background-color: var(--theia-quickInputList-focusBackground) !important;
}

.quick-input-list .monaco-keybinding > .monaco-keybinding-key {
  color: inherit !important;
}

.quick-input-list .monaco-list-row.focused,
.quick-input-list .monaco-list-row.focused .monaco-highlighted-label,
.quick-input-list .monaco-list-row.focused .monaco-highlighted-label .codicon,
.quick-input-list .monaco-list-row.focused .quick-input-list-entry .quick-input-list-separator,
.quick-input-list .monaco-list-row.focused .monaco-highlighted-label .monaco-keybinding .monaco-keybinding-key,
.quick-input-list .monaco-list-row.focused .monaco-highlighted-label .monaco-keybinding .monaco-keybinding-key-separator {
  color: var(--theia-quickInputList-focusForeground) !important;
}

.quick-input-list .monaco-list-row .codicon {
  color: var(--theia-foreground) !important;
}

.quick-input-list .monaco-list-row.focused .codicon {
  color: var(--theia-list-foreground) !important;
}

.quick-input-list .monaco-list-row.focused .monaco-highlighted-label .highlight {
  color: var(--theia-list-focusHighlightForeground) !important;
}

.quick-input-titlebar .action-item .action-label {
    color: var(--theia-foreground) !important;
}

.monaco-list-rows
  .monaco-list-row:not(:first-child)
  .quick-input-list-entry.quick-input-list-separator-border {
  border-top: 1px solid var(--theia-pickerGroup-border) !important;
}
.quick-input-list .quick-input-list-separator {
  color: var(--theia-pickerGroup-foreground) !important;
}

.monaco-icon-label > .monaco-icon-label-container {
  flex: 1;
}

.quick-input-list-rows
  .quick-input-list-row
  .monaco-icon-label
  .monaco-icon-description-container
  .label-description {
    font-family: var(--theia-ui-font-family);
    font-size: calc(var(--theia-ui-font-size1) * 0.9) !important;
    color: var(--theia-foreground) !important;
    white-space: inherit;
}

.quick-input-list-rows
  .quick-input-list-row
  .monaco-icon-label
  .monaco-icon-label-container
  .monaco-icon-name-container
  .label-name {
    font-family: var(--theia-ui-font-family);
    font-size: var(--theia-ui-font-size1) !important;
    color: var(--theia-foreground) !important;
}

.quick-input-list .monaco-icon-label.codicon,
.quick-input-list .monaco-icon-label.file-icon {
  display: flex;
  text-align: left;
}

.codicon-file.default-file-icon.file-icon {
  padding-left: 2px;
  height: 22px;
}

.codicon-file.default-file-icon.file-icon::before {
  margin-right: 4px;
  font-size: var(--theia-ui-font-size1);
}

.quick-input-list .monaco-icon-label.codicon::before {
  position: relative;
  top: 3px;
}

.quick-input-list .monaco-icon-label.theia-file-icons-js {
  line-height: inherit;
}

.quick-input-list .quick-input-list-label {
  cursor: pointer !important;
}

.quick-input-progress.active.infinite {
    background-color: var(--theia-progressBar-background);
    width: 3%;
    /* \`progress-animation\` is defined in \`packages/core/src/browser/style/progress-bar.css\` */
    animation: progress-animation 1.3s 0s infinite cubic-bezier(0.645, 0.045, 0.355, 1);
}

.monaco-list:not(.drop-target) .monaco-list-row:hover:not(.selected):not(.focused) {
  background: var(--theia-list-hoverBackground);
}

.monaco-editor .peekview-widget .head .peekview-title {
  font-family: var(--theia-ui-font-family);
}

.monaco-editor .peekview-widget .referenceMatch {
  font-family: var(--theia-ui-font-family);
}

.monaco-editor .find-widget .monaco-findInput .input,
.monaco-editor .find-widget .matchesCount {
  font-family: var(--theia-ui-font-family);
}

.monaco-editor .monaco-action-bar .action-label.codicon {
  color: var(--theia-foreground);
}

.monaco-editor .monaco-action-bar .action-item.active {
	transform: none;
}

.monaco-editor .peekview-widget .monaco-list-row.focused.selected .label-name,
.monaco-editor .peekview-widget .monaco-list-row.focused.selected .label-description,
.monaco-editor .peekview-widget .monaco-list-row.focused.selected .monaco-highlighted-label,
.monaco-editor .peekview-widget .monaco-list-row.focused.selected .codicon {
  color: var(--theia-list-activeSelectionForeground) !important;
}

.quick-input-titlebar {
  background-color: var(--theia-quickInputTitle-background);
}

.quick-input-widget input {
  background-color: var(--theia-input-background) !important;
}

.monaco-editor .suggest-widget .monaco-list .monaco-list-row.focused>.contents>.main .monaco-highlighted-label .highlight {
    color: var(--vscode-editorSuggestWidget-focusHighlightForeground) !important;
}

.symbol-icon-center {
  align-self: center;
  margin-right: 4px;
}

.monaco-inputbox.error > .ibwrapper > .input,
.monaco-inputbox.warning > .ibwrapper > .input,
.monaco-inputbox.info > .ibwrapper > .input {
    outline: 0 !important;
}
`, "",{"version":3,"sources":["webpack://./../../packages/monaco/src/browser/style/index.css"],"names":[],"mappings":"AAAA;EACE,qBAAqB;EACrB,0CAA0C;EAC1C,6BAA6B;AAC/B;;AAEA;EACE,eAAe;EACf,UAAU;EACV,gBAAgB;AAClB;;AAEA;;EAEE;AACF;EACE,UAAU;EACV,aAAa;AACf;;AAEA;EACE,kBAAkB;EAClB,WAAW;EACX,sDAAsD;AACxD;;AAEA;EACE,uBAAuB;EACvB,0BAA0B;EAC1B,mBAAmB;EACnB,sBAAsB;EACtB,8CAA8C;EAC9C,iDAAiD;EACjD,kBAAkB;AACpB;;AAEA;EACE,gBAAgB;AAClB;;AAEA,gJAAgJ;AAChJ;;EAEE,uDAAuD;AACzD;;AAEA,4IAA4I;AAC5I;EACE,yEAAyE;AAC3E;;AAEA;EACE,yEAAyE;AAC3E;;AAEA;EACE,2EAA2E;AAC7E;;AAEA;EACE,8DAA8D;AAChE;;AAEA;EACE,mEAAmE;AACrE;;AAEA;EACE,oEAAoE;AACtE;;AAEA;EACE,wDAAwD;AAC1D;;AAEA;EACE,yBAAyB;AAC3B;;AAEA;EACE,uBAAuB;AACzB;;AAEA;EACE,wCAAwC;EACxC,oDAAoD;EACpD,uCAAuC;AACzC;;AAEA;EACE,qCAAqC;AACvC;;AAEA;EACE,YAAY;EACZ,YAAY;EACZ,uBAAuB;AACzB;;AAEA,uBAAuB;AACvB;EACE,+DAA+D;EAC/D,yCAAyC;AAC3C;;AAEA;EACE,wEAAwE;AAC1E;;AAEA;EACE,yBAAyB;AAC3B;;AAEA;;;;;;EAME,6DAA6D;AAC/D;;AAEA;EACE,yCAAyC;AAC3C;;AAEA;EACE,8CAA8C;AAChD;;AAEA;EACE,4DAA4D;AAC9D;;AAEA;IACI,yCAAyC;AAC7C;;AAEA;;;EAGE,gEAAgE;AAClE;AACA;EACE,qDAAqD;AACvD;;AAEA;EACE,OAAO;AACT;;AAEA;;;;;IAKI,wCAAwC;IACxC,4DAA4D;IAC5D,yCAAyC;IACzC,oBAAoB;AACxB;;AAEA;;;;;;IAMI,wCAAwC;IACxC,gDAAgD;IAChD,yCAAyC;AAC7C;;AAEA;;EAEE,aAAa;EACb,gBAAgB;AAClB;;AAEA;EACE,iBAAiB;EACjB,YAAY;AACd;;AAEA;EACE,iBAAiB;EACjB,qCAAqC;AACvC;;AAEA;EACE,kBAAkB;EAClB,QAAQ;AACV;;AAEA;EACE,oBAAoB;AACtB;;AAEA;EACE,0BAA0B;AAC5B;;AAEA;IACI,qDAAqD;IACrD,SAAS;IACT,0FAA0F;IAC1F,mFAAmF;AACvF;;AAEA;EACE,6CAA6C;AAC/C;;AAEA;EACE,wCAAwC;AAC1C;;AAEA;EACE,wCAAwC;AAC1C;;AAEA;;EAEE,wCAAwC;AAC1C;;AAEA;EACE,8BAA8B;AAChC;;AAEA;CACC,eAAe;AAChB;;AAEA;;;;EAIE,6DAA6D;AAC/D;;AAEA;EACE,yDAAyD;AAC3D;;AAEA;EACE,0DAA0D;AAC5D;;AAEA;IACI,4EAA4E;AAChF;;AAEA;EACE,kBAAkB;EAClB,iBAAiB;AACnB;;AAEA;;;IAGI,qBAAqB;AACzB","sourcesContent":[".monaco-editor {\n  padding-bottom: 5.6px;\n  font-family: var(--theia-code-font-family);\n  font-size: inherit !important;\n}\n\n#quick-input-container {\n  position: fixed;\n  right: 50%;\n  z-index: 1000000;\n}\n\n/*\n * set z-index to 0, so tabs are not above overlay widgets\n */\n.p-TabBar.theia-app-centers {\n  z-index: 0;\n  display: flex;\n}\n\n.monaco-editor .zone-widget {\n  position: absolute;\n  z-index: 10;\n  background-color: var(--theia-editorWidget-background);\n}\n\n.monaco-editor .zone-widget .zone-widget-container {\n  border-top-style: solid;\n  border-bottom-style: solid;\n  border-top-width: 0;\n  border-bottom-width: 0;\n  border-top-color: var(--theia-peekView-border);\n  border-bottom-color: var(--theia-peekView-border);\n  position: relative;\n}\n\n.monaco-editor .parameter-hints-widget > .wrapper {\n  overflow: hidden;\n}\n\n/* List highlight, see https://github.com/microsoft/vscode/blob/ff5f581425da6230b6f9216ecf19abf6c9d285a6/src/vs/workbench/browser/style.ts#L50 */\n.monaco-tree .monaco-tree-row .monaco-highlighted-label .highlight,\n.monaco-list .monaco-list-row .monaco-highlighted-label .highlight {\n  color: var(--theia-list-highlightForeground) !important;\n}\n\n/* Scrollbars, see https://github.com/microsoft/vscode/blob/ff5f581425da6230b6f9216ecf19abf6c9d285a6/src/vs/workbench/browser/style.ts#L65 */\n.monaco-scrollable-element > .shadow.top {\n  box-shadow: var(--theia-scrollbar-shadow) 0 6px 6px -6px inset !important;\n}\n\n.monaco-scrollable-element > .shadow.left {\n  box-shadow: var(--theia-scrollbar-shadow) 6px 0 6px -6px inset !important;\n}\n\n.monaco-scrollable-element > .shadow.top.left {\n  box-shadow: var(--theia-scrollbar-shadow) 6px 6px 6px -6px inset !important;\n}\n\n.monaco-scrollable-element > .scrollbar > .slider {\n  background: var(--theia-scrollbarSlider-background) !important;\n}\n\n.monaco-scrollable-element > .scrollbar > .slider:hover {\n  background: var(--theia-scrollbarSlider-hoverBackground) !important;\n}\n\n.monaco-scrollable-element > .scrollbar > .slider.active {\n  background: var(--theia-scrollbarSlider-activeBackground) !important;\n}\n\n.monaco-editor .codicon.codicon-debug-start {\n  color: var(--theia-debugIcon-startForeground) !important;\n}\n\n.monaco-editor .codelens-decoration a {\n  color: inherit !important;\n}\n\n.monaco-editor .reference-zone-widget .ref-tree .referenceMatch .highlight {\n  color: unset !important;\n}\n\n.monaco-editor .find-widget .monaco-inputbox.synthetic-focus {\n  outline: var(--theia-border-width) solid;\n  outline-offset: calc(-1 * var(--theia-border-width));\n  outline-color: var(--theia-focusBorder);\n}\n\n.monaco-editor .rename-box input {\n  color: var(--theia-editor-foreground);\n}\n\n.monaco-editor .rename-box .rename-label {\n  opacity: 0.8;\n  padding: 3px;\n  font-family: sans-serif;\n}\n\n/* Monaco Quick Input */\n.quick-input-widget {\n  background-color: var(--theia-quickInput-background) !important;\n  color: var(--theia-foreground) !important;\n}\n\n.quick-input-list .monaco-list-row.focused {\n  background-color: var(--theia-quickInputList-focusBackground) !important;\n}\n\n.quick-input-list .monaco-keybinding > .monaco-keybinding-key {\n  color: inherit !important;\n}\n\n.quick-input-list .monaco-list-row.focused,\n.quick-input-list .monaco-list-row.focused .monaco-highlighted-label,\n.quick-input-list .monaco-list-row.focused .monaco-highlighted-label .codicon,\n.quick-input-list .monaco-list-row.focused .quick-input-list-entry .quick-input-list-separator,\n.quick-input-list .monaco-list-row.focused .monaco-highlighted-label .monaco-keybinding .monaco-keybinding-key,\n.quick-input-list .monaco-list-row.focused .monaco-highlighted-label .monaco-keybinding .monaco-keybinding-key-separator {\n  color: var(--theia-quickInputList-focusForeground) !important;\n}\n\n.quick-input-list .monaco-list-row .codicon {\n  color: var(--theia-foreground) !important;\n}\n\n.quick-input-list .monaco-list-row.focused .codicon {\n  color: var(--theia-list-foreground) !important;\n}\n\n.quick-input-list .monaco-list-row.focused .monaco-highlighted-label .highlight {\n  color: var(--theia-list-focusHighlightForeground) !important;\n}\n\n.quick-input-titlebar .action-item .action-label {\n    color: var(--theia-foreground) !important;\n}\n\n.monaco-list-rows\n  .monaco-list-row:not(:first-child)\n  .quick-input-list-entry.quick-input-list-separator-border {\n  border-top: 1px solid var(--theia-pickerGroup-border) !important;\n}\n.quick-input-list .quick-input-list-separator {\n  color: var(--theia-pickerGroup-foreground) !important;\n}\n\n.monaco-icon-label > .monaco-icon-label-container {\n  flex: 1;\n}\n\n.quick-input-list-rows\n  .quick-input-list-row\n  .monaco-icon-label\n  .monaco-icon-description-container\n  .label-description {\n    font-family: var(--theia-ui-font-family);\n    font-size: calc(var(--theia-ui-font-size1) * 0.9) !important;\n    color: var(--theia-foreground) !important;\n    white-space: inherit;\n}\n\n.quick-input-list-rows\n  .quick-input-list-row\n  .monaco-icon-label\n  .monaco-icon-label-container\n  .monaco-icon-name-container\n  .label-name {\n    font-family: var(--theia-ui-font-family);\n    font-size: var(--theia-ui-font-size1) !important;\n    color: var(--theia-foreground) !important;\n}\n\n.quick-input-list .monaco-icon-label.codicon,\n.quick-input-list .monaco-icon-label.file-icon {\n  display: flex;\n  text-align: left;\n}\n\n.codicon-file.default-file-icon.file-icon {\n  padding-left: 2px;\n  height: 22px;\n}\n\n.codicon-file.default-file-icon.file-icon::before {\n  margin-right: 4px;\n  font-size: var(--theia-ui-font-size1);\n}\n\n.quick-input-list .monaco-icon-label.codicon::before {\n  position: relative;\n  top: 3px;\n}\n\n.quick-input-list .monaco-icon-label.theia-file-icons-js {\n  line-height: inherit;\n}\n\n.quick-input-list .quick-input-list-label {\n  cursor: pointer !important;\n}\n\n.quick-input-progress.active.infinite {\n    background-color: var(--theia-progressBar-background);\n    width: 3%;\n    /* `progress-animation` is defined in `packages/core/src/browser/style/progress-bar.css` */\n    animation: progress-animation 1.3s 0s infinite cubic-bezier(0.645, 0.045, 0.355, 1);\n}\n\n.monaco-list:not(.drop-target) .monaco-list-row:hover:not(.selected):not(.focused) {\n  background: var(--theia-list-hoverBackground);\n}\n\n.monaco-editor .peekview-widget .head .peekview-title {\n  font-family: var(--theia-ui-font-family);\n}\n\n.monaco-editor .peekview-widget .referenceMatch {\n  font-family: var(--theia-ui-font-family);\n}\n\n.monaco-editor .find-widget .monaco-findInput .input,\n.monaco-editor .find-widget .matchesCount {\n  font-family: var(--theia-ui-font-family);\n}\n\n.monaco-editor .monaco-action-bar .action-label.codicon {\n  color: var(--theia-foreground);\n}\n\n.monaco-editor .monaco-action-bar .action-item.active {\n\ttransform: none;\n}\n\n.monaco-editor .peekview-widget .monaco-list-row.focused.selected .label-name,\n.monaco-editor .peekview-widget .monaco-list-row.focused.selected .label-description,\n.monaco-editor .peekview-widget .monaco-list-row.focused.selected .monaco-highlighted-label,\n.monaco-editor .peekview-widget .monaco-list-row.focused.selected .codicon {\n  color: var(--theia-list-activeSelectionForeground) !important;\n}\n\n.quick-input-titlebar {\n  background-color: var(--theia-quickInputTitle-background);\n}\n\n.quick-input-widget input {\n  background-color: var(--theia-input-background) !important;\n}\n\n.monaco-editor .suggest-widget .monaco-list .monaco-list-row.focused>.contents>.main .monaco-highlighted-label .highlight {\n    color: var(--vscode-editorSuggestWidget-focusHighlightForeground) !important;\n}\n\n.symbol-icon-center {\n  align-self: center;\n  margin-right: 4px;\n}\n\n.monaco-inputbox.error > .ibwrapper > .input,\n.monaco-inputbox.warning > .ibwrapper > .input,\n.monaco-inputbox.info > .ibwrapper > .input {\n    outline: 0 !important;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../packages/monaco/src/browser/style/index.css":
/*!*********************************************************!*\
  !*** ../../packages/monaco/src/browser/style/index.css ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/css-loader/dist/cjs.js!./index.css */ "../../node_modules/css-loader/dist/cjs.js!../../packages/monaco/src/browser/style/index.css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "../../packages/monaco/data/monaco-themes/vscode/dark_plus.json":
/*!**********************************************************************!*\
  !*** ../../packages/monaco/data/monaco-themes/vscode/dark_plus.json ***!
  \**********************************************************************/
/***/ ((module) => {

module.exports = JSON.parse('{"$schema":"vscode://schemas/color-theme","name":"Dark+ (default dark)","include":"./dark_vs.json","tokenColors":[{"name":"Function declarations","scope":["entity.name.function","support.function","support.constant.handlebars","source.powershell variable.other.member","entity.name.operator.custom-literal"],"settings":{"foreground":"#DCDCAA"}},{"name":"Types declaration and references","scope":["meta.return-type","support.class","support.type","entity.name.type","entity.name.namespace","entity.other.attribute","entity.name.scope-resolution","entity.name.class","storage.type.numeric.go","storage.type.byte.go","storage.type.boolean.go","storage.type.string.go","storage.type.uintptr.go","storage.type.error.go","storage.type.rune.go","storage.type.cs","storage.type.generic.cs","storage.type.modifier.cs","storage.type.variable.cs","storage.type.annotation.java","storage.type.generic.java","storage.type.java","storage.type.object.array.java","storage.type.primitive.array.java","storage.type.primitive.java","storage.type.token.java","storage.type.groovy","storage.type.annotation.groovy","storage.type.parameters.groovy","storage.type.generic.groovy","storage.type.object.array.groovy","storage.type.primitive.array.groovy","storage.type.primitive.groovy"],"settings":{"foreground":"#4EC9B0"}},{"name":"Types declaration and references, TS grammar specific","scope":["meta.type.cast.expr","meta.type.new.expr","support.constant.math","support.constant.dom","support.constant.json","entity.other.inherited-class"],"settings":{"foreground":"#4EC9B0"}},{"name":"Control flow / Special keywords","scope":["keyword.control","source.cpp keyword.operator.new","keyword.operator.delete","keyword.other.using","keyword.other.operator","entity.name.operator"],"settings":{"foreground":"#C586C0"}},{"name":"Variable and parameter name","scope":["variable","meta.definition.variable.name","support.variable","entity.name.variable","constant.other.placeholder"],"settings":{"foreground":"#9CDCFE"}},{"name":"Constants and enums","scope":["variable.other.constant","variable.other.enummember"],"settings":{"foreground":"#4FC1FF"}},{"name":"Object keys, TS grammar specific","scope":["meta.object-literal.key"],"settings":{"foreground":"#9CDCFE"}},{"name":"CSS property value","scope":["support.constant.property-value","support.constant.font-name","support.constant.media-type","support.constant.media","constant.other.color.rgb-value","constant.other.rgb-value","support.constant.color"],"settings":{"foreground":"#CE9178"}},{"name":"Regular expression groups","scope":["punctuation.definition.group.regexp","punctuation.definition.group.assertion.regexp","punctuation.definition.character-class.regexp","punctuation.character.set.begin.regexp","punctuation.character.set.end.regexp","keyword.operator.negation.regexp","support.other.parenthesis.regexp"],"settings":{"foreground":"#CE9178"}},{"scope":["constant.character.character-class.regexp","constant.other.character-class.set.regexp","constant.other.character-class.regexp","constant.character.set.regexp"],"settings":{"foreground":"#d16969"}},{"scope":["keyword.operator.or.regexp","keyword.control.anchor.regexp"],"settings":{"foreground":"#DCDCAA"}},{"scope":"keyword.operator.quantifier.regexp","settings":{"foreground":"#d7ba7d"}},{"scope":"constant.character","settings":{"foreground":"#569cd6"}},{"scope":"constant.character.escape","settings":{"foreground":"#d7ba7d"}},{"scope":"entity.name.label","settings":{"foreground":"#C8C8C8"}}],"semanticTokenColors":{"newOperator":"#C586C0","stringLiteral":"#ce9178","customLiteral":"#DCDCAA","numberLiteral":"#b5cea8"}}');

/***/ }),

/***/ "../../packages/monaco/data/monaco-themes/vscode/dark_theia.json":
/*!***********************************************************************!*\
  !*** ../../packages/monaco/data/monaco-themes/vscode/dark_theia.json ***!
  \***********************************************************************/
/***/ ((module) => {

module.exports = JSON.parse('{"$schema":"vscode://schemas/color-theme","name":"Dark (Theia)","include":"./dark_plus.json"}');

/***/ }),

/***/ "../../packages/monaco/data/monaco-themes/vscode/dark_vs.json":
/*!********************************************************************!*\
  !*** ../../packages/monaco/data/monaco-themes/vscode/dark_vs.json ***!
  \********************************************************************/
/***/ ((module) => {

module.exports = JSON.parse('{"$schema":"vscode://schemas/color-theme","name":"Dark (Visual Studio)","colors":{"editor.background":"#1E1E1E","editor.foreground":"#D4D4D4","editor.inactiveSelectionBackground":"#3A3D41","editorIndentGuide.background":"#404040","editorIndentGuide.activeBackground":"#707070","editor.selectionHighlightBackground":"#ADD6FF26","list.dropBackground":"#383B3D","activityBarBadge.background":"#007ACC","sideBarTitle.foreground":"#BBBBBB","input.placeholderForeground":"#A6A6A6","menu.background":"#252526","menu.foreground":"#CCCCCC","menu.border":"#454545","statusBarItem.remoteForeground":"#FFF","statusBarItem.remoteBackground":"#16825D","ports.iconRunningProcessForeground":"#369432","sideBarSectionHeader.background":"#0000","sideBarSectionHeader.border":"#ccc3","tab.lastPinnedBorder":"#ccc3","list.activeSelectionIconForeground":"#FFF"},"tokenColors":[{"scope":["meta.embedded","source.groovy.embedded"],"settings":{"foreground":"#D4D4D4"}},{"scope":"emphasis","settings":{"fontStyle":"italic"}},{"scope":"strong","settings":{"fontStyle":"bold"}},{"scope":"header","settings":{"foreground":"#000080"}},{"scope":"comment","settings":{"foreground":"#6A9955"}},{"scope":"constant.language","settings":{"foreground":"#569cd6"}},{"scope":["constant.numeric","variable.other.enummember","keyword.operator.plus.exponent","keyword.operator.minus.exponent"],"settings":{"foreground":"#b5cea8"}},{"scope":"constant.regexp","settings":{"foreground":"#646695"}},{"scope":"entity.name.tag","settings":{"foreground":"#569cd6"}},{"scope":"entity.name.tag.css","settings":{"foreground":"#d7ba7d"}},{"scope":"entity.other.attribute-name","settings":{"foreground":"#9cdcfe"}},{"scope":["entity.other.attribute-name.class.css","entity.other.attribute-name.class.mixin.css","entity.other.attribute-name.id.css","entity.other.attribute-name.parent-selector.css","entity.other.attribute-name.pseudo-class.css","entity.other.attribute-name.pseudo-element.css","source.css.less entity.other.attribute-name.id","entity.other.attribute-name.scss"],"settings":{"foreground":"#d7ba7d"}},{"scope":"invalid","settings":{"foreground":"#f44747"}},{"scope":"markup.underline","settings":{"fontStyle":"underline"}},{"scope":"markup.bold","settings":{"fontStyle":"bold","foreground":"#569cd6"}},{"scope":"markup.heading","settings":{"fontStyle":"bold","foreground":"#569cd6"}},{"scope":"markup.italic","settings":{"fontStyle":"italic"}},{"scope":"markup.inserted","settings":{"foreground":"#b5cea8"}},{"scope":"markup.deleted","settings":{"foreground":"#ce9178"}},{"scope":"markup.changed","settings":{"foreground":"#569cd6"}},{"scope":"punctuation.definition.quote.begin.markdown","settings":{"foreground":"#6A9955"}},{"scope":"punctuation.definition.list.begin.markdown","settings":{"foreground":"#6796e6"}},{"scope":"markup.inline.raw","settings":{"foreground":"#ce9178"}},{"name":"brackets of XML/HTML tags","scope":"punctuation.definition.tag","settings":{"foreground":"#808080"}},{"scope":["meta.preprocessor","entity.name.function.preprocessor"],"settings":{"foreground":"#569cd6"}},{"scope":"meta.preprocessor.string","settings":{"foreground":"#ce9178"}},{"scope":"meta.preprocessor.numeric","settings":{"foreground":"#b5cea8"}},{"scope":"meta.structure.dictionary.key.python","settings":{"foreground":"#9cdcfe"}},{"scope":"meta.diff.header","settings":{"foreground":"#569cd6"}},{"scope":"storage","settings":{"foreground":"#569cd6"}},{"scope":"storage.type","settings":{"foreground":"#569cd6"}},{"scope":["storage.modifier","keyword.operator.noexcept"],"settings":{"foreground":"#569cd6"}},{"scope":["string","meta.embedded.assembly"],"settings":{"foreground":"#ce9178"}},{"scope":"string.tag","settings":{"foreground":"#ce9178"}},{"scope":"string.value","settings":{"foreground":"#ce9178"}},{"scope":"string.regexp","settings":{"foreground":"#d16969"}},{"name":"String interpolation","scope":["punctuation.definition.template-expression.begin","punctuation.definition.template-expression.end","punctuation.section.embedded"],"settings":{"foreground":"#569cd6"}},{"name":"Reset JavaScript string interpolation expression","scope":["meta.template.expression"],"settings":{"foreground":"#d4d4d4"}},{"scope":["support.type.vendored.property-name","support.type.property-name","variable.css","variable.scss","variable.other.less","source.coffee.embedded"],"settings":{"foreground":"#9cdcfe"}},{"scope":"keyword","settings":{"foreground":"#569cd6"}},{"scope":"keyword.control","settings":{"foreground":"#569cd6"}},{"scope":"keyword.operator","settings":{"foreground":"#d4d4d4"}},{"scope":["keyword.operator.new","keyword.operator.expression","keyword.operator.cast","keyword.operator.sizeof","keyword.operator.alignof","keyword.operator.typeid","keyword.operator.alignas","keyword.operator.instanceof","keyword.operator.logical.python","keyword.operator.wordlike"],"settings":{"foreground":"#569cd6"}},{"scope":"keyword.other.unit","settings":{"foreground":"#b5cea8"}},{"scope":["punctuation.section.embedded.begin.php","punctuation.section.embedded.end.php"],"settings":{"foreground":"#569cd6"}},{"scope":"support.function.git-rebase","settings":{"foreground":"#9cdcfe"}},{"scope":"constant.sha.git-rebase","settings":{"foreground":"#b5cea8"}},{"name":"coloring of the Java import and package identifiers","scope":["storage.modifier.import.java","variable.language.wildcard.java","storage.modifier.package.java"],"settings":{"foreground":"#d4d4d4"}},{"name":"this.self","scope":"variable.language","settings":{"foreground":"#569cd6"}}],"semanticHighlighting":true,"semanticTokenColors":{"newOperator":"#d4d4d4","stringLiteral":"#ce9178","customLiteral":"#D4D4D4","numberLiteral":"#b5cea8"}}');

/***/ }),

/***/ "../../packages/monaco/data/monaco-themes/vscode/hc_black.json":
/*!*********************************************************************!*\
  !*** ../../packages/monaco/data/monaco-themes/vscode/hc_black.json ***!
  \*********************************************************************/
/***/ ((module) => {

module.exports = JSON.parse('{"$schema":"vscode://schemas/color-theme","name":"Dark High Contrast","colors":{"editor.background":"#000000","editor.foreground":"#FFFFFF","editorIndentGuide.background":"#FFFFFF","editorIndentGuide.activeBackground":"#FFFFFF","sideBarTitle.foreground":"#FFFFFF","selection.background":"#008000","editor.selectionBackground":"#FFFFFF","statusBarItem.remoteBackground":"#00000000","ports.iconRunningProcessForeground":"#FFFFFF","editorWhitespace.foreground":"#7c7c7c"},"tokenColors":[{"scope":["meta.embedded","source.groovy.embedded"],"settings":{"foreground":"#FFFFFF"}},{"scope":"emphasis","settings":{"fontStyle":"italic"}},{"scope":"strong","settings":{"fontStyle":"bold"}},{"scope":"meta.diff.header","settings":{"foreground":"#000080"}},{"scope":"comment","settings":{"foreground":"#7ca668"}},{"scope":"constant.language","settings":{"foreground":"#569cd6"}},{"scope":["constant.numeric","constant.other.color.rgb-value","constant.other.rgb-value","support.constant.color"],"settings":{"foreground":"#b5cea8"}},{"scope":"constant.regexp","settings":{"foreground":"#b46695"}},{"scope":"constant.character","settings":{"foreground":"#569cd6"}},{"scope":"entity.name.tag","settings":{"foreground":"#569cd6"}},{"scope":"entity.name.tag.css","settings":{"foreground":"#d7ba7d"}},{"scope":"entity.other.attribute-name","settings":{"foreground":"#9cdcfe"}},{"scope":["entity.other.attribute-name.class.css","entity.other.attribute-name.class.mixin.css","entity.other.attribute-name.id.css","entity.other.attribute-name.parent-selector.css","entity.other.attribute-name.pseudo-class.css","entity.other.attribute-name.pseudo-element.css","source.css.less entity.other.attribute-name.id","entity.other.attribute-name.scss"],"settings":{"foreground":"#d7ba7d"}},{"scope":"invalid","settings":{"foreground":"#f44747"}},{"scope":"markup.underline","settings":{"fontStyle":"underline"}},{"scope":"markup.bold","settings":{"fontStyle":"bold"}},{"scope":"markup.heading","settings":{"fontStyle":"bold","foreground":"#6796e6"}},{"scope":"markup.italic","settings":{"fontStyle":"italic"}},{"scope":"markup.inserted","settings":{"foreground":"#b5cea8"}},{"scope":"markup.deleted","settings":{"foreground":"#ce9178"}},{"scope":"markup.changed","settings":{"foreground":"#569cd6"}},{"name":"brackets of XML/HTML tags","scope":["punctuation.definition.tag"],"settings":{"foreground":"#808080"}},{"scope":"meta.preprocessor","settings":{"foreground":"#569cd6"}},{"scope":"meta.preprocessor.string","settings":{"foreground":"#ce9178"}},{"scope":"meta.preprocessor.numeric","settings":{"foreground":"#b5cea8"}},{"scope":"meta.structure.dictionary.key.python","settings":{"foreground":"#9cdcfe"}},{"scope":"storage","settings":{"foreground":"#569cd6"}},{"scope":"storage.type","settings":{"foreground":"#569cd6"}},{"scope":"storage.modifier","settings":{"foreground":"#569cd6"}},{"scope":"string","settings":{"foreground":"#ce9178"}},{"scope":"string.tag","settings":{"foreground":"#ce9178"}},{"scope":"string.value","settings":{"foreground":"#ce9178"}},{"scope":"string.regexp","settings":{"foreground":"#d16969"}},{"name":"String interpolation","scope":["punctuation.definition.template-expression.begin","punctuation.definition.template-expression.end","punctuation.section.embedded"],"settings":{"foreground":"#569cd6"}},{"name":"Reset JavaScript string interpolation expression","scope":["meta.template.expression"],"settings":{"foreground":"#ffffff"}},{"scope":["support.type.vendored.property-name","support.type.property-name","variable.css","variable.scss","variable.other.less","source.coffee.embedded"],"settings":{"foreground":"#d4d4d4"}},{"scope":"keyword","settings":{"foreground":"#569cd6"}},{"scope":"keyword.control","settings":{"foreground":"#569cd6"}},{"scope":"keyword.operator","settings":{"foreground":"#d4d4d4"}},{"scope":["keyword.operator.new","keyword.operator.expression","keyword.operator.cast","keyword.operator.sizeof","keyword.operator.logical.python"],"settings":{"foreground":"#569cd6"}},{"scope":"keyword.other.unit","settings":{"foreground":"#b5cea8"}},{"scope":"support.function.git-rebase","settings":{"foreground":"#d4d4d4"}},{"scope":"constant.sha.git-rebase","settings":{"foreground":"#b5cea8"}},{"name":"coloring of the Java import and package identifiers","scope":["storage.modifier.import.java","variable.language.wildcard.java","storage.modifier.package.java"],"settings":{"foreground":"#d4d4d4"}},{"name":"coloring of the TS this","scope":"variable.language.this","settings":{"foreground":"#569cd6"}},{"name":"Function declarations","scope":["entity.name.function","support.function","support.constant.handlebars","source.powershell variable.other.member"],"settings":{"foreground":"#DCDCAA"}},{"name":"Types declaration and references","scope":["meta.return-type","support.class","support.type","entity.name.type","entity.name.namespace","entity.name.scope-resolution","entity.name.class","storage.type.cs","storage.type.generic.cs","storage.type.modifier.cs","storage.type.variable.cs","storage.type.annotation.java","storage.type.generic.java","storage.type.java","storage.type.object.array.java","storage.type.primitive.array.java","storage.type.primitive.java","storage.type.token.java","storage.type.groovy","storage.type.annotation.groovy","storage.type.parameters.groovy","storage.type.generic.groovy","storage.type.object.array.groovy","storage.type.primitive.array.groovy","storage.type.primitive.groovy"],"settings":{"foreground":"#4EC9B0"}},{"name":"Types declaration and references, TS grammar specific","scope":["meta.type.cast.expr","meta.type.new.expr","support.constant.math","support.constant.dom","support.constant.json","entity.other.inherited-class"],"settings":{"foreground":"#4EC9B0"}},{"name":"Control flow / Special keywords","scope":["keyword.control","source.cpp keyword.operator.new","source.cpp keyword.operator.delete","keyword.other.using","keyword.other.operator"],"settings":{"foreground":"#C586C0"}},{"name":"Variable and parameter name","scope":["variable","meta.definition.variable.name","support.variable"],"settings":{"foreground":"#9CDCFE"}},{"name":"Object keys, TS grammar specific","scope":["meta.object-literal.key"],"settings":{"foreground":"#9CDCFE"}},{"name":"CSS property value","scope":["support.constant.property-value","support.constant.font-name","support.constant.media-type","support.constant.media","constant.other.color.rgb-value","constant.other.rgb-value","support.constant.color"],"settings":{"foreground":"#CE9178"}},{"name":"HC Search Editor context line override","scope":"meta.resultLinePrefix.contextLinePrefix.search","settings":{"foreground":"#CBEDCB"}}],"semanticHighlighting":true,"semanticTokenColors":{"newOperator":"#FFFFFF","stringLiteral":"#ce9178","customLiteral":"#DCDCAA","numberLiteral":"#b5cea8"}}');

/***/ }),

/***/ "../../packages/monaco/data/monaco-themes/vscode/hc_light.json":
/*!*********************************************************************!*\
  !*** ../../packages/monaco/data/monaco-themes/vscode/hc_light.json ***!
  \*********************************************************************/
/***/ ((module) => {

module.exports = JSON.parse('{"$schema":"vscode://schemas/color-theme","name":"Light High Contrast","tokenColors":[{"scope":["meta.embedded","source.groovy.embedded"],"settings":{"foreground":"#292929"}},{"scope":"emphasis","settings":{"fontStyle":"italic"}},{"scope":"strong","settings":{"fontStyle":"bold"}},{"scope":"meta.diff.header","settings":{"foreground":"#062F4A"}},{"scope":"comment","settings":{"foreground":"#515151"}},{"scope":"constant.language","settings":{"foreground":"#0F4A85"}},{"scope":["constant.numeric","variable.other.enummember","keyword.operator.plus.exponent","keyword.operator.minus.exponent"],"settings":{"foreground":"#096d48"}},{"scope":"constant.regexp","settings":{"foreground":"#811F3F"}},{"scope":"entity.name.tag","settings":{"foreground":"#0F4A85"}},{"scope":"entity.name.selector","settings":{"foreground":"#0F4A85"}},{"scope":"entity.other.attribute-name","settings":{"foreground":"#264F78"}},{"scope":["entity.other.attribute-name.class.css","entity.other.attribute-name.class.mixin.css","entity.other.attribute-name.id.css","entity.other.attribute-name.parent-selector.css","entity.other.attribute-name.pseudo-class.css","entity.other.attribute-name.pseudo-element.css","source.css.less entity.other.attribute-name.id","entity.other.attribute-name.scss"],"settings":{"foreground":"#0F4A85"}},{"scope":"invalid","settings":{"foreground":"#B5200D"}},{"scope":"markup.underline","settings":{"fontStyle":"underline"}},{"scope":"markup.bold","settings":{"foreground":"#000080","fontStyle":"bold"}},{"scope":"markup.heading","settings":{"foreground":"#0F4A85","fontStyle":"bold"}},{"scope":"markup.italic","settings":{"fontStyle":"italic"}},{"scope":"markup.strikethrough","settings":{"fontStyle":"strikethrough"}},{"scope":"markup.inserted","settings":{"foreground":"#096d48"}},{"scope":"markup.deleted","settings":{"foreground":"#5A5A5A"}},{"scope":"markup.changed","settings":{"foreground":"#0451A5"}},{"scope":["punctuation.definition.quote.begin.markdown","punctuation.definition.list.begin.markdown"],"settings":{"foreground":"#0451A5"}},{"scope":"markup.inline.raw","settings":{"foreground":"#0F4A85"}},{"scope":"punctuation.definition.tag","settings":{"foreground":"#0F4A85"}},{"scope":["meta.preprocessor","entity.name.function.preprocessor"],"settings":{"foreground":"#0F4A85"}},{"scope":"meta.preprocessor.string","settings":{"foreground":"#b5200d"}},{"scope":"meta.preprocessor.numeric","settings":{"foreground":"#096d48"}},{"scope":"meta.structure.dictionary.key.python","settings":{"foreground":"#0451A5"}},{"scope":"storage","settings":{"foreground":"#0F4A85"}},{"scope":"storage.type","settings":{"foreground":"#0F4A85"}},{"scope":["storage.modifier","keyword.operator.noexcept"],"settings":{"foreground":"#0F4A85"}},{"scope":["string","meta.embedded.assembly"],"settings":{"foreground":"#0F4A85"}},{"scope":["string.comment.buffered.block.pug","string.quoted.pug","string.interpolated.pug","string.unquoted.plain.in.yaml","string.unquoted.plain.out.yaml","string.unquoted.block.yaml","string.quoted.single.yaml","string.quoted.double.xml","string.quoted.single.xml","string.unquoted.cdata.xml","string.quoted.double.html","string.quoted.single.html","string.unquoted.html","string.quoted.single.handlebars","string.quoted.double.handlebars"],"settings":{"foreground":"#0F4A85"}},{"scope":"string.regexp","settings":{"foreground":"#811F3F"}},{"scope":["punctuation.definition.template-expression.begin","punctuation.definition.template-expression.end","punctuation.section.embedded"],"settings":{"foreground":"#0F4A85"}},{"scope":["meta.template.expression"],"settings":{"foreground":"#000000"}},{"scope":["support.constant.property-value","support.constant.font-name","support.constant.media-type","support.constant.media","constant.other.color.rgb-value","constant.other.rgb-value","support.constant.color"],"settings":{"foreground":"#0451A5"}},{"scope":["support.type.vendored.property-name","support.type.property-name","variable.css","variable.scss","variable.other.less","source.coffee.embedded"],"settings":{"foreground":"#264F78"}},{"scope":["support.type.property-name.json"],"settings":{"foreground":"#0451A5"}},{"scope":"keyword","settings":{"foreground":"#0F4A85"}},{"scope":"keyword.control","settings":{"foreground":"#0F4A85"}},{"scope":"keyword.operator","settings":{"foreground":"#000000"}},{"scope":["keyword.operator.new","keyword.operator.expression","keyword.operator.cast","keyword.operator.sizeof","keyword.operator.alignof","keyword.operator.typeid","keyword.operator.alignas","keyword.operator.instanceof","keyword.operator.logical.python","keyword.operator.wordlike"],"settings":{"foreground":"#0F4A85"}},{"scope":"keyword.other.unit","settings":{"foreground":"#096d48"}},{"scope":["punctuation.section.embedded.begin.php","punctuation.section.embedded.end.php"],"settings":{"foreground":"#0F4A85"}},{"scope":"support.function.git-rebase","settings":{"foreground":"#0451A5"}},{"scope":"constant.sha.git-rebase","settings":{"foreground":"#096d48"}},{"scope":["storage.modifier.import.java","variable.language.wildcard.java","storage.modifier.package.java"],"settings":{"foreground":"#000000"}},{"scope":"variable.language","settings":{"foreground":"#0F4A85"}},{"scope":["entity.name.function","support.function","support.constant.handlebars","source.powershell variable.other.member","entity.name.operator.custom-literal"],"settings":{"foreground":"#5e2cbc"}},{"scope":["support.class","support.type","entity.name.type","entity.name.namespace","entity.other.attribute","entity.name.scope-resolution","entity.name.class","storage.type.numeric.go","storage.type.byte.go","storage.type.boolean.go","storage.type.string.go","storage.type.uintptr.go","storage.type.error.go","storage.type.rune.go","storage.type.cs","storage.type.generic.cs","storage.type.modifier.cs","storage.type.variable.cs","storage.type.annotation.java","storage.type.generic.java","storage.type.java","storage.type.object.array.java","storage.type.primitive.array.java","storage.type.primitive.java","storage.type.token.java","storage.type.groovy","storage.type.annotation.groovy","storage.type.parameters.groovy","storage.type.generic.groovy","storage.type.object.array.groovy","storage.type.primitive.array.groovy","storage.type.primitive.groovy"],"settings":{"foreground":"#185E73"}},{"scope":["meta.type.cast.expr","meta.type.new.expr","support.constant.math","support.constant.dom","support.constant.json","entity.other.inherited-class"],"settings":{"foreground":"#185E73"}},{"scope":["keyword.control","source.cpp keyword.operator.new","source.cpp keyword.operator.delete","keyword.other.using","keyword.other.operator","entity.name.operator"],"settings":{"foreground":"#b5200d"}},{"scope":["variable","meta.definition.variable.name","support.variable","entity.name.variable","constant.other.placeholder"],"settings":{"foreground":"#001080"}},{"scope":["variable.other.constant","variable.other.enummember"],"settings":{"foreground":"#02715D"}},{"scope":["meta.object-literal.key"],"settings":{"foreground":"#001080"}},{"scope":["support.constant.property-value","support.constant.font-name","support.constant.media-type","support.constant.media","constant.other.color.rgb-value","constant.other.rgb-value","support.constant.color"],"settings":{"foreground":"#0451A5"}},{"scope":["punctuation.definition.group.regexp","punctuation.definition.group.assertion.regexp","punctuation.definition.character-class.regexp","punctuation.character.set.begin.regexp","punctuation.character.set.end.regexp","keyword.operator.negation.regexp","support.other.parenthesis.regexp"],"settings":{"foreground":"#D16969"}},{"scope":["constant.character.character-class.regexp","constant.other.character-class.set.regexp","constant.other.character-class.regexp","constant.character.set.regexp"],"settings":{"foreground":"#811F3F"}},{"scope":"keyword.operator.quantifier.regexp","settings":{"foreground":"#000000"}},{"scope":["keyword.operator.or.regexp","keyword.control.anchor.regexp"],"settings":{"foreground":"#EE0000"}},{"scope":"constant.character","settings":{"foreground":"#0F4A85"}},{"scope":"constant.character.escape","settings":{"foreground":"#EE0000"}},{"scope":"entity.name.label","settings":{"foreground":"#000000"}},{"scope":"token.info-token","settings":{"foreground":"#316BCD"}},{"scope":"token.warn-token","settings":{"foreground":"#CD9731"}},{"scope":"token.error-token","settings":{"foreground":"#CD3131"}},{"scope":"token.debug-token","settings":{"foreground":"#800080"}}]}');

/***/ }),

/***/ "../../packages/monaco/data/monaco-themes/vscode/hc_theia.json":
/*!*********************************************************************!*\
  !*** ../../packages/monaco/data/monaco-themes/vscode/hc_theia.json ***!
  \*********************************************************************/
/***/ ((module) => {

module.exports = JSON.parse('{"$schema":"vscode://schemas/color-theme","name":"Dark High Contrast (Theia)","include":"./hc_black.json"}');

/***/ }),

/***/ "../../packages/monaco/data/monaco-themes/vscode/hc_theia_light.json":
/*!***************************************************************************!*\
  !*** ../../packages/monaco/data/monaco-themes/vscode/hc_theia_light.json ***!
  \***************************************************************************/
/***/ ((module) => {

module.exports = JSON.parse('{"$schema":"vscode://schemas/color-theme","name":"Light High Contrast (Theia)","include":"./hc_light.json"}');

/***/ }),

/***/ "../../packages/monaco/data/monaco-themes/vscode/light_plus.json":
/*!***********************************************************************!*\
  !*** ../../packages/monaco/data/monaco-themes/vscode/light_plus.json ***!
  \***********************************************************************/
/***/ ((module) => {

module.exports = JSON.parse('{"$schema":"vscode://schemas/color-theme","name":"Light+ (default light)","include":"./light_vs.json","tokenColors":[{"name":"Function declarations","scope":["entity.name.function","support.function","support.constant.handlebars","source.powershell variable.other.member","entity.name.operator.custom-literal"],"settings":{"foreground":"#795E26"}},{"name":"Types declaration and references","scope":["meta.return-type","support.class","support.type","entity.name.type","entity.name.namespace","entity.other.attribute","entity.name.scope-resolution","entity.name.class","storage.type.numeric.go","storage.type.byte.go","storage.type.boolean.go","storage.type.string.go","storage.type.uintptr.go","storage.type.error.go","storage.type.rune.go","storage.type.cs","storage.type.generic.cs","storage.type.modifier.cs","storage.type.variable.cs","storage.type.annotation.java","storage.type.generic.java","storage.type.java","storage.type.object.array.java","storage.type.primitive.array.java","storage.type.primitive.java","storage.type.token.java","storage.type.groovy","storage.type.annotation.groovy","storage.type.parameters.groovy","storage.type.generic.groovy","storage.type.object.array.groovy","storage.type.primitive.array.groovy","storage.type.primitive.groovy"],"settings":{"foreground":"#267f99"}},{"name":"Types declaration and references, TS grammar specific","scope":["meta.type.cast.expr","meta.type.new.expr","support.constant.math","support.constant.dom","support.constant.json","entity.other.inherited-class"],"settings":{"foreground":"#267f99"}},{"name":"Control flow / Special keywords","scope":["keyword.control","source.cpp keyword.operator.new","source.cpp keyword.operator.delete","keyword.other.using","keyword.other.operator","entity.name.operator"],"settings":{"foreground":"#AF00DB"}},{"name":"Variable and parameter name","scope":["variable","meta.definition.variable.name","support.variable","entity.name.variable","constant.other.placeholder"],"settings":{"foreground":"#001080"}},{"name":"Constants and enums","scope":["variable.other.constant","variable.other.enummember"],"settings":{"foreground":"#0070C1"}},{"name":"Object keys, TS grammar specific","scope":["meta.object-literal.key"],"settings":{"foreground":"#001080"}},{"name":"CSS property value","scope":["support.constant.property-value","support.constant.font-name","support.constant.media-type","support.constant.media","constant.other.color.rgb-value","constant.other.rgb-value","support.constant.color"],"settings":{"foreground":"#0451a5"}},{"name":"Regular expression groups","scope":["punctuation.definition.group.regexp","punctuation.definition.group.assertion.regexp","punctuation.definition.character-class.regexp","punctuation.character.set.begin.regexp","punctuation.character.set.end.regexp","keyword.operator.negation.regexp","support.other.parenthesis.regexp"],"settings":{"foreground":"#d16969"}},{"scope":["constant.character.character-class.regexp","constant.other.character-class.set.regexp","constant.other.character-class.regexp","constant.character.set.regexp"],"settings":{"foreground":"#811f3f"}},{"scope":"keyword.operator.quantifier.regexp","settings":{"foreground":"#000000"}},{"scope":["keyword.operator.or.regexp","keyword.control.anchor.regexp"],"settings":{"foreground":"#EE0000"}},{"scope":"constant.character","settings":{"foreground":"#0000ff"}},{"scope":"constant.character.escape","settings":{"foreground":"#EE0000"}},{"scope":"entity.name.label","settings":{"foreground":"#000000"}}],"semanticHighlighting":true,"semanticTokenColors":{"newOperator":"#AF00DB","stringLiteral":"#a31515","customLiteral":"#795E26","numberLiteral":"#098658"}}');

/***/ }),

/***/ "../../packages/monaco/data/monaco-themes/vscode/light_theia.json":
/*!************************************************************************!*\
  !*** ../../packages/monaco/data/monaco-themes/vscode/light_theia.json ***!
  \************************************************************************/
/***/ ((module) => {

module.exports = JSON.parse('{"$schema":"vscode://schemas/color-theme","name":"Light (Theia)","include":"./light_plus.json","colors":{"activityBar.background":"#ececec","activityBar.activeBorder":"#000000","activityBar.foreground":"#000000"}}');

/***/ }),

/***/ "../../packages/monaco/data/monaco-themes/vscode/light_vs.json":
/*!*********************************************************************!*\
  !*** ../../packages/monaco/data/monaco-themes/vscode/light_vs.json ***!
  \*********************************************************************/
/***/ ((module) => {

module.exports = JSON.parse('{"$schema":"vscode://schemas/color-theme","name":"Light (Visual Studio)","colors":{"editor.background":"#FFFFFF","editor.foreground":"#000000","editor.inactiveSelectionBackground":"#E5EBF1","editorIndentGuide.background":"#D3D3D3","editorIndentGuide.activeBackground":"#939393","editor.selectionHighlightBackground":"#ADD6FF80","editorSuggestWidget.background":"#F3F3F3","activityBarBadge.background":"#007ACC","sideBarTitle.foreground":"#6F6F6F","list.hoverBackground":"#E8E8E8","input.placeholderForeground":"#767676","searchEditor.textInputBorder":"#CECECE","settings.textInputBorder":"#CECECE","settings.numberInputBorder":"#CECECE","statusBarItem.remoteForeground":"#FFF","statusBarItem.remoteBackground":"#16825D","ports.iconRunningProcessForeground":"#369432","sideBarSectionHeader.background":"#0000","sideBarSectionHeader.border":"#61616130","tab.lastPinnedBorder":"#61616130","notebook.cellBorderColor":"#E8E8E8","notebook.selectedCellBackground":"#c8ddf150","statusBarItem.errorBackground":"#c72e0f","list.activeSelectionIconForeground":"#FFF"},"tokenColors":[{"scope":["meta.embedded","source.groovy.embedded"],"settings":{"foreground":"#000000ff"}},{"scope":"emphasis","settings":{"fontStyle":"italic"}},{"scope":"strong","settings":{"fontStyle":"bold"}},{"scope":"meta.diff.header","settings":{"foreground":"#000080"}},{"scope":"comment","settings":{"foreground":"#008000"}},{"scope":"constant.language","settings":{"foreground":"#0000ff"}},{"scope":["constant.numeric","variable.other.enummember","keyword.operator.plus.exponent","keyword.operator.minus.exponent"],"settings":{"foreground":"#098658"}},{"scope":"constant.regexp","settings":{"foreground":"#811f3f"}},{"name":"css tags in selectors, xml tags","scope":"entity.name.tag","settings":{"foreground":"#800000"}},{"scope":"entity.name.selector","settings":{"foreground":"#800000"}},{"scope":"entity.other.attribute-name","settings":{"foreground":"#ff0000"}},{"scope":["entity.other.attribute-name.class.css","entity.other.attribute-name.class.mixin.css","entity.other.attribute-name.id.css","entity.other.attribute-name.parent-selector.css","entity.other.attribute-name.pseudo-class.css","entity.other.attribute-name.pseudo-element.css","source.css.less entity.other.attribute-name.id","entity.other.attribute-name.scss"],"settings":{"foreground":"#800000"}},{"scope":"invalid","settings":{"foreground":"#cd3131"}},{"scope":"markup.underline","settings":{"fontStyle":"underline"}},{"scope":"markup.bold","settings":{"fontStyle":"bold","foreground":"#000080"}},{"scope":"markup.heading","settings":{"fontStyle":"bold","foreground":"#800000"}},{"scope":"markup.italic","settings":{"fontStyle":"italic"}},{"scope":"markup.inserted","settings":{"foreground":"#098658"}},{"scope":"markup.deleted","settings":{"foreground":"#a31515"}},{"scope":"markup.changed","settings":{"foreground":"#0451a5"}},{"scope":["punctuation.definition.quote.begin.markdown","punctuation.definition.list.begin.markdown"],"settings":{"foreground":"#0451a5"}},{"scope":"markup.inline.raw","settings":{"foreground":"#800000"}},{"name":"brackets of XML/HTML tags","scope":"punctuation.definition.tag","settings":{"foreground":"#800000"}},{"scope":["meta.preprocessor","entity.name.function.preprocessor"],"settings":{"foreground":"#0000ff"}},{"scope":"meta.preprocessor.string","settings":{"foreground":"#a31515"}},{"scope":"meta.preprocessor.numeric","settings":{"foreground":"#098658"}},{"scope":"meta.structure.dictionary.key.python","settings":{"foreground":"#0451a5"}},{"scope":"storage","settings":{"foreground":"#0000ff"}},{"scope":"storage.type","settings":{"foreground":"#0000ff"}},{"scope":["storage.modifier","keyword.operator.noexcept"],"settings":{"foreground":"#0000ff"}},{"scope":["string","meta.embedded.assembly"],"settings":{"foreground":"#a31515"}},{"scope":["string.comment.buffered.block.pug","string.quoted.pug","string.interpolated.pug","string.unquoted.plain.in.yaml","string.unquoted.plain.out.yaml","string.unquoted.block.yaml","string.quoted.single.yaml","string.quoted.double.xml","string.quoted.single.xml","string.unquoted.cdata.xml","string.quoted.double.html","string.quoted.single.html","string.unquoted.html","string.quoted.single.handlebars","string.quoted.double.handlebars"],"settings":{"foreground":"#0000ff"}},{"scope":"string.regexp","settings":{"foreground":"#811f3f"}},{"name":"String interpolation","scope":["punctuation.definition.template-expression.begin","punctuation.definition.template-expression.end","punctuation.section.embedded"],"settings":{"foreground":"#0000ff"}},{"name":"Reset JavaScript string interpolation expression","scope":["meta.template.expression"],"settings":{"foreground":"#000000"}},{"scope":["support.constant.property-value","support.constant.font-name","support.constant.media-type","support.constant.media","constant.other.color.rgb-value","constant.other.rgb-value","support.constant.color"],"settings":{"foreground":"#0451a5"}},{"scope":["support.type.vendored.property-name","support.type.property-name","variable.css","variable.scss","variable.other.less","source.coffee.embedded"],"settings":{"foreground":"#ff0000"}},{"scope":["support.type.property-name.json"],"settings":{"foreground":"#0451a5"}},{"scope":"keyword","settings":{"foreground":"#0000ff"}},{"scope":"keyword.control","settings":{"foreground":"#0000ff"}},{"scope":"keyword.operator","settings":{"foreground":"#000000"}},{"scope":["keyword.operator.new","keyword.operator.expression","keyword.operator.cast","keyword.operator.sizeof","keyword.operator.alignof","keyword.operator.typeid","keyword.operator.alignas","keyword.operator.instanceof","keyword.operator.logical.python","keyword.operator.wordlike"],"settings":{"foreground":"#0000ff"}},{"scope":"keyword.other.unit","settings":{"foreground":"#098658"}},{"scope":["punctuation.section.embedded.begin.php","punctuation.section.embedded.end.php"],"settings":{"foreground":"#800000"}},{"scope":"support.function.git-rebase","settings":{"foreground":"#0451a5"}},{"scope":"constant.sha.git-rebase","settings":{"foreground":"#098658"}},{"name":"coloring of the Java import and package identifiers","scope":["storage.modifier.import.java","variable.language.wildcard.java","storage.modifier.package.java"],"settings":{"foreground":"#000000"}},{"name":"this.self","scope":"variable.language","settings":{"foreground":"#0000ff"}}],"semanticHighlighting":true,"semanticTokenColors":{"newOperator":"#0000ff","stringLiteral":"#a31515","customLiteral":"#000000","numberLiteral":"#098658"}}');

/***/ })

}]);
//# sourceMappingURL=packages_monaco_lib_browser_monaco-frontend-module_js.js.map