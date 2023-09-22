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
var MonacoEditorProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonacoEditorProvider = exports.MonacoEditorFactory = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const uri_1 = require("@theia/core/lib/common/uri");
const browser_1 = require("@theia/editor/lib/browser");
const diff_uris_1 = require("@theia/core/lib/browser/diff-uris");
const inversify_1 = require("@theia/core/shared/inversify");
const common_1 = require("@theia/core/lib/common");
const vscode_languageserver_protocol_1 = require("@theia/core/shared/vscode-languageserver-protocol");
const monaco_command_service_1 = require("./monaco-command-service");
const monaco_context_menu_1 = require("./monaco-context-menu");
const monaco_diff_editor_1 = require("./monaco-diff-editor");
const monaco_diff_navigator_factory_1 = require("./monaco-diff-navigator-factory");
const monaco_editor_1 = require("./monaco-editor");
const monaco_editor_model_1 = require("./monaco-editor-model");
const monaco_editor_service_1 = require("./monaco-editor-service");
const monaco_text_model_service_1 = require("./monaco-text-model-service");
const monaco_workspace_1 = require("./monaco-workspace");
const monaco_bulk_edit_service_1 = require("./monaco-bulk-edit-service");
const application_protocol_1 = require("@theia/core/lib/common/application-protocol");
const core_1 = require("@theia/core");
const browser_2 = require("@theia/core/lib/browser");
const monaco_resolved_keybinding_1 = require("./monaco-resolved-keybinding");
const monaco_to_protocol_converter_1 = require("./monaco-to-protocol-converter");
const protocol_to_monaco_converter_1 = require("./protocol-to-monaco-converter");
const browser_3 = require("@theia/filesystem/lib/browser");
const monaco_quick_input_service_1 = require("./monaco-quick-input-service");
const contextKeyService_1 = require("@theia/monaco-editor-core/esm/vs/platform/contextkey/browser/contextKeyService");
const openerService_1 = require("@theia/monaco-editor-core/esm/vs/editor/browser/services/openerService");
const standaloneServices_1 = require("@theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices");
const opener_1 = require("@theia/monaco-editor-core/esm/vs/platform/opener/common/opener");
const keybindings_1 = require("@theia/monaco-editor-core/esm/vs/base/common/keybindings");
const codeEditorService_1 = require("@theia/monaco-editor-core/esm/vs/editor/browser/services/codeEditorService");
const instantiation_1 = require("@theia/monaco-editor-core/esm/vs/platform/instantiation/common/instantiation");
const keybinding_1 = require("@theia/monaco-editor-core/esm/vs/platform/keybinding/common/keybinding");
const promise_util_1 = require("@theia/core/lib/common/promise-util");
const resolverService_1 = require("@theia/monaco-editor-core/esm/vs/editor/common/services/resolverService");
const contextView_1 = require("@theia/monaco-editor-core/esm/vs/platform/contextview/browser/contextView");
const bulkEditService_1 = require("@theia/monaco-editor-core/esm/vs/editor/browser/services/bulkEditService");
const contextkey_1 = require("@theia/monaco-editor-core/esm/vs/platform/contextkey/common/contextkey");
const quickInput_1 = require("@theia/monaco-editor-core/esm/vs/platform/quickinput/common/quickInput");
const commands_1 = require("@theia/monaco-editor-core/esm/vs/platform/commands/common/commands");
exports.MonacoEditorFactory = Symbol('MonacoEditorFactory');
let MonacoEditorProvider = MonacoEditorProvider_1 = class MonacoEditorProvider {
    constructor(codeEditorService, textModelService, contextMenuService, m2p, p2m, workspace, commandServiceFactory, editorPreferences, diffNavigatorFactory, 
    /** @deprecated since 1.6.0 */
    applicationServer, contextKeyService) {
        this.codeEditorService = codeEditorService;
        this.textModelService = textModelService;
        this.contextMenuService = contextMenuService;
        this.m2p = m2p;
        this.p2m = p2m;
        this.workspace = workspace;
        this.commandServiceFactory = commandServiceFactory;
        this.editorPreferences = editorPreferences;
        this.diffNavigatorFactory = diffNavigatorFactory;
        this.applicationServer = applicationServer;
        this.contextKeyService = contextKeyService;
        standaloneServices_1.StandaloneServices.initialize({
            [codeEditorService_1.ICodeEditorService.toString()]: codeEditorService,
        });
    }
    /**
     * Returns the last focused MonacoEditor.
     * It takes into account inline editors as well.
     * If you are interested only in standalone editors then use `MonacoEditor.getCurrent(EditorManager)`
     */
    get current() {
        return this._current;
    }
    async getModel(uri, toDispose) {
        const reference = await this.textModelService.createModelReference(uri);
        // if document is invalid makes sure that all events from underlying resource are processed before throwing invalid model
        if (!reference.object.valid) {
            await reference.object.sync();
        }
        if (!reference.object.valid) {
            reference.dispose();
            throw Object.assign(new Error(`'${uri.toString()}' is invalid`), { code: 'MODEL_IS_INVALID' });
        }
        toDispose.push(reference);
        return reference.object;
    }
    async get(uri) {
        await this.editorPreferences.ready;
        return this.doCreateEditor(uri, (override, toDispose) => this.createEditor(uri, override, toDispose));
    }
    async doCreateEditor(uri, factory) {
        const commandService = this.commandServiceFactory();
        const domNode = document.createElement('div');
        const contextKeyService = this.contextKeyService.createScoped(domNode);
        const { codeEditorService, textModelService, contextMenuService } = this;
        const workspaceEditService = this.bulkEditService;
        const toDispose = new common_1.DisposableCollection(commandService);
        const openerService = new openerService_1.OpenerService(codeEditorService, commandService);
        openerService.registerOpener({
            open: (u, options) => this.interceptOpen(u, options)
        });
        const overrides = [
            [codeEditorService_1.ICodeEditorService, codeEditorService],
            [resolverService_1.ITextModelService, textModelService],
            [contextView_1.IContextMenuService, contextMenuService],
            [bulkEditService_1.IBulkEditService, workspaceEditService],
            [contextkey_1.IContextKeyService, contextKeyService],
            [opener_1.IOpenerService, openerService],
            [quickInput_1.IQuickInputService, this.quickInputService],
            [commands_1.ICommandService, commandService]
        ];
        const editor = await factory(overrides, toDispose);
        editor.onDispose(() => toDispose.dispose());
        this.injectKeybindingResolver(editor);
        const standaloneCommandService = new standaloneServices_1.StandaloneCommandService(standaloneServices_1.StandaloneServices.get(instantiation_1.IInstantiationService));
        commandService.setDelegate(standaloneCommandService);
        toDispose.push(editor.onFocusChanged(focused => {
            if (focused) {
                this._current = editor;
            }
        }));
        toDispose.push(common_1.Disposable.create(() => {
            if (this._current === editor) {
                this._current = undefined;
            }
        }));
        return editor;
    }
    /**
     * Intercept internal Monaco open calls and delegate to OpenerService.
     */
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
        const uri = new uri_1.default(monacoUri.toString());
        try {
            await (0, browser_2.open)(this.openerService, uri, options);
            return true;
        }
        catch (e) {
            console.error(`Fail to open '${uri.toString()}':`, e);
            return false;
        }
    }
    injectKeybindingResolver(editor) {
        const keybindingService = standaloneServices_1.StandaloneServices.get(keybinding_1.IKeybindingService);
        keybindingService.resolveKeybinding = keybinding => [new monaco_resolved_keybinding_1.MonacoResolvedKeybinding(monaco_resolved_keybinding_1.MonacoResolvedKeybinding.keySequence(keybinding), this.keybindingRegistry)];
        keybindingService.resolveKeyboardEvent = keyboardEvent => {
            const keybinding = new keybindings_1.SimpleKeybinding(keyboardEvent.ctrlKey, keyboardEvent.shiftKey, keyboardEvent.altKey, keyboardEvent.metaKey, keyboardEvent.keyCode).toChord();
            return new monaco_resolved_keybinding_1.MonacoResolvedKeybinding(monaco_resolved_keybinding_1.MonacoResolvedKeybinding.keySequence(keybinding), this.keybindingRegistry);
        };
    }
    createEditor(uri, override, toDispose) {
        if (diff_uris_1.DiffUris.isDiffUri(uri)) {
            return this.createMonacoDiffEditor(uri, override, toDispose);
        }
        return this.createMonacoEditor(uri, override, toDispose);
    }
    get preferencePrefixes() {
        return ['editor.'];
    }
    async createMonacoEditor(uri, override, toDispose) {
        const model = await this.getModel(uri, toDispose);
        const options = this.createMonacoEditorOptions(model);
        const factory = this.factories.getContributions().find(({ scheme }) => uri.scheme === scheme);
        const editor = factory
            ? factory.create(model, options, override)
            : new monaco_editor_1.MonacoEditor(uri, model, document.createElement('div'), this.services, options, override);
        toDispose.push(this.editorPreferences.onPreferenceChanged(event => {
            if (event.affects(uri.toString(), model.languageId)) {
                this.updateMonacoEditorOptions(editor, event);
            }
        }));
        toDispose.push(editor.onLanguageChanged(() => this.updateMonacoEditorOptions(editor)));
        editor.document.onWillSaveModel(event => event.waitUntil(this.formatOnSave(editor, event)));
        return editor;
    }
    createMonacoEditorOptions(model) {
        const options = this.createOptions(this.preferencePrefixes, model.uri, model.languageId);
        options.model = model.textEditorModel;
        options.readOnly = model.readOnly;
        options.lineNumbersMinChars = model.lineNumbersMinChars;
        return options;
    }
    updateMonacoEditorOptions(editor, event) {
        if (event) {
            const preferenceName = event.preferenceName;
            const overrideIdentifier = editor.document.languageId;
            const newValue = this.editorPreferences.get({ preferenceName, overrideIdentifier }, undefined, editor.uri.toString());
            editor.getControl().updateOptions(this.setOption(preferenceName, newValue, this.preferencePrefixes));
        }
        else {
            const options = this.createMonacoEditorOptions(editor.document);
            delete options.model;
            editor.getControl().updateOptions(options);
        }
    }
    shouldFormat(editor, event) {
        var _a;
        if (event.reason !== vscode_languageserver_protocol_1.TextDocumentSaveReason.Manual) {
            return false;
        }
        if ((_a = event.options) === null || _a === void 0 ? void 0 : _a.formatType) {
            switch (event.options.formatType) {
                case 1 /* ON */: return true;
                case 2 /* OFF */: return false;
                case 3 /* DIRTY */: return editor.document.dirty;
            }
        }
        return true;
    }
    async formatOnSave(editor, event) {
        if (!this.shouldFormat(editor, event)) {
            return [];
        }
        const overrideIdentifier = editor.document.languageId;
        const uri = editor.uri.toString();
        const formatOnSave = this.editorPreferences.get({ preferenceName: 'editor.formatOnSave', overrideIdentifier }, undefined, uri);
        if (formatOnSave) {
            const formatOnSaveTimeout = this.editorPreferences.get({ preferenceName: 'editor.formatOnSaveTimeout', overrideIdentifier }, undefined, uri);
            await Promise.race([
                (0, promise_util_1.timeoutReject)(formatOnSaveTimeout, `Aborted format on save after ${formatOnSaveTimeout}ms`),
                editor.runAction('editor.action.formatDocument')
            ]);
        }
        const shouldRemoveWhiteSpace = this.filePreferences.get({ preferenceName: 'files.trimTrailingWhitespace', overrideIdentifier }, undefined, uri);
        if (shouldRemoveWhiteSpace) {
            await editor.runAction('editor.action.trimTrailingWhitespace');
        }
        return [];
    }
    get diffPreferencePrefixes() {
        return [...this.preferencePrefixes, 'diffEditor.'];
    }
    async createMonacoDiffEditor(uri, override, toDispose) {
        const [original, modified] = diff_uris_1.DiffUris.decode(uri);
        const [originalModel, modifiedModel] = await Promise.all([this.getModel(original, toDispose), this.getModel(modified, toDispose)]);
        const options = this.createMonacoDiffEditorOptions(originalModel, modifiedModel);
        const editor = new monaco_diff_editor_1.MonacoDiffEditor(uri, document.createElement('div'), originalModel, modifiedModel, this.services, this.diffNavigatorFactory, options, override);
        toDispose.push(this.editorPreferences.onPreferenceChanged(event => {
            const originalFileUri = original.withoutQuery().withScheme('file').toString();
            if (event.affects(originalFileUri, editor.document.languageId)) {
                this.updateMonacoDiffEditorOptions(editor, event, originalFileUri);
            }
        }));
        toDispose.push(editor.onLanguageChanged(() => this.updateMonacoDiffEditorOptions(editor)));
        return editor;
    }
    createMonacoDiffEditorOptions(original, modified) {
        const options = this.createOptions(this.diffPreferencePrefixes, modified.uri, modified.languageId);
        options.originalEditable = !original.readOnly;
        options.readOnly = modified.readOnly;
        return options;
    }
    updateMonacoDiffEditorOptions(editor, event, resourceUri) {
        if (event) {
            const preferenceName = event.preferenceName;
            const overrideIdentifier = editor.document.languageId;
            const newValue = this.editorPreferences.get({ preferenceName, overrideIdentifier }, undefined, resourceUri);
            editor.diffEditor.updateOptions(this.setOption(preferenceName, newValue, this.diffPreferencePrefixes));
        }
        else {
            const options = this.createMonacoDiffEditorOptions(editor.originalModel, editor.modifiedModel);
            editor.diffEditor.updateOptions(options);
        }
    }
    createOptions(prefixes, uri, overrideIdentifier) {
        const flat = {};
        for (const preferenceName of Object.keys(this.editorPreferences)) {
            flat[preferenceName] = this.editorPreferences.get({ preferenceName, overrideIdentifier }, undefined, uri);
        }
        return Object.entries(flat).reduce((tree, [preferenceName, value]) => this.setOption(preferenceName, (0, common_1.deepClone)(value), prefixes, tree), {});
    }
    setOption(preferenceName, value, prefixes, options = {}) {
        const optionName = this.toOptionName(preferenceName, prefixes);
        this.doSetOption(options, value, optionName.split('.'));
        return options;
    }
    toOptionName(preferenceName, prefixes) {
        for (const prefix of prefixes) {
            if (preferenceName.startsWith(prefix)) {
                return preferenceName.substring(prefix.length);
            }
        }
        return preferenceName;
    }
    doSetOption(obj, value, names) {
        for (let i = 0; i < names.length - 1; i++) {
            const name = names[i];
            if (obj[name] === undefined) {
                obj = obj[name] = {};
            }
            else if (typeof obj[name] !== 'object' || obj[name] === null) { // eslint-disable-line no-null/no-null
                console.warn(`Preference (diff)editor.${names.join('.')} conflicts with another preference name.`);
                obj = obj[name] = {};
            }
            else {
                obj = obj[name];
            }
        }
        obj[names[names.length - 1]] = value;
    }
    getDiffNavigator(editor) {
        if (editor instanceof monaco_diff_editor_1.MonacoDiffEditor) {
            return editor.diffNavigator;
        }
        return monaco_diff_navigator_factory_1.MonacoDiffNavigatorFactory.nullNavigator;
    }
    async createInline(uri, node, options) {
        return this.doCreateEditor(uri, async (override, toDispose) => {
            const overrides = override ? Array.from(override) : [];
            overrides.push([contextView_1.IContextMenuService, { showContextMenu: () => { } }]);
            const document = new monaco_editor_model_1.MonacoEditorModel({
                uri,
                readContents: async () => '',
                dispose: () => { }
            }, this.m2p, this.p2m);
            toDispose.push(document);
            const model = (await document.load()).textEditorModel;
            return new monaco_editor_1.MonacoEditor(uri, document, node, this.services, Object.assign({
                model,
                isSimpleWidget: true,
                autoSizing: false,
                minHeight: 1,
                maxHeight: 1
            }, MonacoEditorProvider_1.inlineOptions, options), overrides);
        });
    }
};
MonacoEditorProvider.inlineOptions = {
    wordWrap: 'on',
    overviewRulerLanes: 0,
    glyphMargin: false,
    lineNumbers: 'off',
    folding: false,
    selectOnLineNumbers: false,
    hideCursorInOverviewRuler: true,
    selectionHighlight: false,
    scrollbar: {
        horizontal: 'hidden'
    },
    lineDecorationsWidth: 0,
    overviewRulerBorder: false,
    scrollBeyondLastLine: false,
    renderLineHighlight: 'none',
    fixedOverflowWidgets: true,
    acceptSuggestionOnEnter: 'smart',
    minimap: {
        enabled: false
    }
};
__decorate([
    (0, inversify_1.inject)(core_1.ContributionProvider),
    (0, inversify_1.named)(exports.MonacoEditorFactory),
    __metadata("design:type", Object)
], MonacoEditorProvider.prototype, "factories", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_bulk_edit_service_1.MonacoBulkEditService),
    __metadata("design:type", monaco_bulk_edit_service_1.MonacoBulkEditService)
], MonacoEditorProvider.prototype, "bulkEditService", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_editor_1.MonacoEditorServices),
    __metadata("design:type", monaco_editor_1.MonacoEditorServices)
], MonacoEditorProvider.prototype, "services", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.KeybindingRegistry),
    __metadata("design:type", browser_2.KeybindingRegistry)
], MonacoEditorProvider.prototype, "keybindingRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.OpenerService),
    __metadata("design:type", Object)
], MonacoEditorProvider.prototype, "openerService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_3.FileSystemPreferences),
    __metadata("design:type", Object)
], MonacoEditorProvider.prototype, "filePreferences", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_quick_input_service_1.MonacoQuickInputImplementation),
    __metadata("design:type", monaco_quick_input_service_1.MonacoQuickInputImplementation)
], MonacoEditorProvider.prototype, "quickInputService", void 0);
MonacoEditorProvider = MonacoEditorProvider_1 = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(monaco_editor_service_1.MonacoEditorService)),
    __param(1, (0, inversify_1.inject)(monaco_text_model_service_1.MonacoTextModelService)),
    __param(2, (0, inversify_1.inject)(monaco_context_menu_1.MonacoContextMenuService)),
    __param(3, (0, inversify_1.inject)(monaco_to_protocol_converter_1.MonacoToProtocolConverter)),
    __param(4, (0, inversify_1.inject)(protocol_to_monaco_converter_1.ProtocolToMonacoConverter)),
    __param(5, (0, inversify_1.inject)(monaco_workspace_1.MonacoWorkspace)),
    __param(6, (0, inversify_1.inject)(monaco_command_service_1.MonacoCommandServiceFactory)),
    __param(7, (0, inversify_1.inject)(browser_1.EditorPreferences)),
    __param(8, (0, inversify_1.inject)(monaco_diff_navigator_factory_1.MonacoDiffNavigatorFactory)),
    __param(9, (0, inversify_1.inject)(application_protocol_1.ApplicationServer)),
    __param(10, (0, inversify_1.inject)(contextKeyService_1.ContextKeyService)),
    __metadata("design:paramtypes", [monaco_editor_service_1.MonacoEditorService,
        monaco_text_model_service_1.MonacoTextModelService,
        monaco_context_menu_1.MonacoContextMenuService,
        monaco_to_protocol_converter_1.MonacoToProtocolConverter,
        protocol_to_monaco_converter_1.ProtocolToMonacoConverter,
        monaco_workspace_1.MonacoWorkspace, Function, Object, monaco_diff_navigator_factory_1.MonacoDiffNavigatorFactory, Object, contextKeyService_1.ContextKeyService])
], MonacoEditorProvider);
exports.MonacoEditorProvider = MonacoEditorProvider;
//# sourceMappingURL=monaco-editor-provider.js.map