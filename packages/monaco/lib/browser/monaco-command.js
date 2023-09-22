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
exports.MonacoEditorCommandHandlers = exports.MonacoCommands = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const command_1 = require("@theia/core/lib/common/command");
const browser_1 = require("@theia/core/lib/browser");
const browser_2 = require("@theia/editor/lib/browser");
const monaco_editor_1 = require("./monaco-editor");
const monaco_command_registry_1 = require("./monaco-command-registry");
const monaco_editor_service_1 = require("./monaco-editor-service");
const monaco_text_model_service_1 = require("./monaco-text-model-service");
const protocol_to_monaco_converter_1 = require("./protocol-to-monaco-converter");
const nls_1 = require("@theia/core/lib/common/nls");
const contextKeyService_1 = require("@theia/monaco-editor-core/esm/vs/platform/contextkey/browser/contextKeyService");
const editorExtensions_1 = require("@theia/monaco-editor-core/esm/vs/editor/browser/editorExtensions");
const commands_1 = require("@theia/monaco-editor-core/esm/vs/platform/commands/common/commands");
const monaco = require("@theia/monaco-editor-core");
const standaloneServices_1 = require("@theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices");
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
//# sourceMappingURL=monaco-command.js.map