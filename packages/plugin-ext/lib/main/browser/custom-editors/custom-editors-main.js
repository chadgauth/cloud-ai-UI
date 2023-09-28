"use strict";
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
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// some code copied and modified from https://github.com/microsoft/vscode/blob/53eac52308c4611000a171cc7bf1214293473c78/src/vs/workbench/api/browser/mainThreadCustomEditors.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomTextEditorModel = exports.MainCustomEditorModel = exports.CustomEditorsMainImpl = void 0;
const plugin_api_rpc_1 = require("../../../common/plugin-api-rpc");
const hosted_plugin_1 = require("../../../hosted/browser/hosted-plugin");
const plugin_custom_editor_registry_1 = require("./plugin-custom-editor-registry");
const custom_editor_widget_1 = require("./custom-editor-widget");
const core_1 = require("@theia/core");
const vscode_uri_1 = require("@theia/core/shared/vscode-uri");
const uri_1 = require("@theia/core/lib/common/uri");
const disposable_1 = require("@theia/core/lib/common/disposable");
const cancellation_1 = require("@theia/core/lib/common/cancellation");
const text_editor_model_service_1 = require("../text-editor-model-service");
const custom_editor_service_1 = require("./custom-editor-service");
const file_service_1 = require("@theia/filesystem/lib/browser/file-service");
const undo_redo_service_1 = require("@theia/editor/lib/browser/undo-redo-service");
const widget_manager_1 = require("@theia/core/lib/browser/widget-manager");
const browser_1 = require("@theia/core/lib/browser");
const browser_2 = require("@theia/editor/lib/browser");
const types_impl_1 = require("../../../plugin/types-impl");
class CustomEditorsMainImpl {
    constructor(rpc, container, webviewsMain) {
        this.webviewsMain = webviewsMain;
        this.editorProviders = new Map();
        this.pluginService = container.get(hosted_plugin_1.HostedPluginSupport);
        this.shell = container.get(browser_1.ApplicationShell);
        this.textModelService = container.get(text_editor_model_service_1.EditorModelService);
        this.fileService = container.get(file_service_1.FileService);
        this.customEditorService = container.get(custom_editor_service_1.CustomEditorService);
        this.undoRedoService = container.get(undo_redo_service_1.UndoRedoService);
        this.customEditorRegistry = container.get(plugin_custom_editor_registry_1.PluginCustomEditorRegistry);
        this.labelProvider = container.get(browser_1.DefaultUriLabelProviderContribution);
        this.editorPreferences = container.get(browser_2.EditorPreferences);
        this.widgetManager = container.get(widget_manager_1.WidgetManager);
        this.proxy = rpc.getProxy(plugin_api_rpc_1.MAIN_RPC_CONTEXT.CUSTOM_EDITORS_EXT);
    }
    dispose() {
        for (const disposable of this.editorProviders.values()) {
            disposable.dispose();
        }
        this.editorProviders.clear();
    }
    $registerTextEditorProvider(viewType, options, capabilities) {
        this.registerEditorProvider(1 /* Text */, viewType, options, capabilities, true);
    }
    $registerCustomEditorProvider(viewType, options, supportsMultipleEditorsPerDocument) {
        this.registerEditorProvider(0 /* Custom */, viewType, options, {}, supportsMultipleEditorsPerDocument);
    }
    async registerEditorProvider(modelType, viewType, options, capabilities, supportsMultipleEditorsPerDocument) {
        if (this.editorProviders.has(viewType)) {
            throw new Error(`Provider for ${viewType} already registered`);
        }
        const disposables = new disposable_1.DisposableCollection();
        disposables.push(this.customEditorRegistry.registerResolver(viewType, async (widget, widgetOpenerOptions) => {
            const { resource, identifier } = widget;
            widget.options = options;
            const cancellationSource = new cancellation_1.CancellationTokenSource();
            let modelRef = await this.getOrCreateCustomEditorModel(modelType, resource, viewType, cancellationSource.token);
            widget.modelRef = modelRef;
            widget.onDidDispose(() => {
                // If the model is still dirty, make sure we have time to save it
                if (modelRef.object.dirty) {
                    const sub = modelRef.object.onDirtyChanged(() => {
                        if (!modelRef.object.dirty) {
                            sub.dispose();
                            modelRef.dispose();
                        }
                    });
                    return;
                }
                modelRef.dispose();
            });
            if (capabilities.supportsMove) {
                const onMoveCancelTokenSource = new cancellation_1.CancellationTokenSource();
                widget.onMove(async (newResource) => {
                    const oldModel = modelRef;
                    modelRef = await this.getOrCreateCustomEditorModel(modelType, newResource, viewType, onMoveCancelTokenSource.token);
                    this.proxy.$onMoveCustomEditor(identifier.id, vscode_uri_1.URI.file(newResource.path.toString()), viewType);
                    oldModel.dispose();
                });
            }
            const _cancellationSource = new cancellation_1.CancellationTokenSource();
            await this.proxy.$resolveWebviewEditor(vscode_uri_1.URI.file(resource.path.toString()), identifier.id, viewType, this.labelProvider.getName(resource), widgetOpenerOptions, options, _cancellationSource.token);
        }));
        this.editorProviders.set(viewType, disposables);
    }
    $unregisterEditorProvider(viewType) {
        const provider = this.editorProviders.get(viewType);
        if (!provider) {
            throw new Error(`No provider for ${viewType} registered`);
        }
        provider.dispose();
        this.editorProviders.delete(viewType);
        this.customEditorService.models.disposeAllModelsForView(viewType);
    }
    async getOrCreateCustomEditorModel(modelType, resource, viewType, cancellationToken) {
        const existingModel = this.customEditorService.models.tryRetain(resource, viewType);
        if (existingModel) {
            return existingModel;
        }
        switch (modelType) {
            case 1 /* Text */: {
                const model = CustomTextEditorModel.create(viewType, resource, this.textModelService, this.fileService);
                return this.customEditorService.models.add(resource, viewType, model);
            }
            case 0 /* Custom */: {
                const model = MainCustomEditorModel.create(this.proxy, viewType, resource, this.undoRedoService, this.fileService, this.editorPreferences, cancellationToken);
                return this.customEditorService.models.add(resource, viewType, model);
            }
        }
    }
    async getCustomEditorModel(resourceComponents, viewType) {
        const resource = vscode_uri_1.URI.revive(resourceComponents);
        const model = await this.customEditorService.models.get(new uri_1.default(resource), viewType);
        if (!model || !(model instanceof MainCustomEditorModel)) {
            throw new Error('Could not find model for custom editor');
        }
        return model;
    }
    async $onDidEdit(resourceComponents, viewType, editId, label) {
        const model = await this.getCustomEditorModel(resourceComponents, viewType);
        model.pushEdit(editId, label);
    }
    async $onContentChange(resourceComponents, viewType) {
        const model = await this.getCustomEditorModel(resourceComponents, viewType);
        model.changeContent();
    }
    async $createCustomEditorPanel(panelId, title, widgetOpenerOptions, options) {
        const view = await this.widgetManager.getOrCreateWidget(custom_editor_widget_1.CustomEditorWidget.FACTORY_ID, { id: panelId });
        this.webviewsMain.hookWebview(view);
        view.title.label = title;
        const { enableFindWidget, retainContextWhenHidden, enableScripts, enableForms, localResourceRoots, ...contentOptions } = options;
        view.viewColumn = types_impl_1.ViewColumn.One; // behaviour might be overridden later using widgetOpenerOptions (if available)
        view.options = { enableFindWidget, retainContextWhenHidden };
        view.setContentOptions({
            allowScripts: enableScripts,
            allowForms: enableForms,
            localResourceRoots: localResourceRoots && localResourceRoots.map(root => root.toString()),
            ...contentOptions,
            ...view.contentOptions
        });
        if (view.isAttached) {
            if (view.isVisible) {
                this.shell.revealWidget(view.id);
            }
            return;
        }
        const showOptions = {
            preserveFocus: true
        };
        if (widgetOpenerOptions) {
            if (widgetOpenerOptions.mode === 'reveal') {
                showOptions.preserveFocus = false;
            }
            if (widgetOpenerOptions.widgetOptions) {
                let area;
                switch (widgetOpenerOptions.widgetOptions.area) {
                    case 'main':
                        area = types_impl_1.WebviewPanelTargetArea.Main;
                    case 'left':
                        area = types_impl_1.WebviewPanelTargetArea.Left;
                    case 'right':
                        area = types_impl_1.WebviewPanelTargetArea.Right;
                    case 'bottom':
                        area = types_impl_1.WebviewPanelTargetArea.Bottom;
                    default: // includes 'top' and 'secondaryWindow'
                        area = types_impl_1.WebviewPanelTargetArea.Main;
                }
                showOptions.area = area;
                if (widgetOpenerOptions.widgetOptions.mode === 'split-right' ||
                    widgetOpenerOptions.widgetOptions.mode === 'open-to-right') {
                    showOptions.viewColumn = types_impl_1.ViewColumn.Beside;
                }
            }
        }
        this.webviewsMain.addOrReattachWidget(view, showOptions);
    }
}
exports.CustomEditorsMainImpl = CustomEditorsMainImpl;
class MainCustomEditorModel {
    constructor(proxy, viewType, editorResource, editable, undoRedoService, fileService, editorPreferences) {
        this.proxy = proxy;
        this.viewType = viewType;
        this.editorResource = editorResource;
        this.editable = editable;
        this.undoRedoService = undoRedoService;
        this.fileService = fileService;
        this.editorPreferences = editorPreferences;
        this.currentEditIndex = -1;
        this.savePoint = -1;
        this.isDirtyFromContentChange = false;
        this.edits = [];
        this.toDispose = new disposable_1.DisposableCollection();
        this.onDirtyChangedEmitter = new core_1.Emitter();
        this.onDirtyChanged = this.onDirtyChangedEmitter.event;
        this.autoSave = this.editorPreferences.get('files.autoSave', undefined, editorResource.toString());
        this.autoSaveDelay = this.editorPreferences.get('files.autoSaveDelay', undefined, editorResource.toString());
        this.toDispose.push(this.editorPreferences.onPreferenceChanged(event => {
            if (event.preferenceName === 'files.autoSave') {
                this.autoSave = this.editorPreferences.get('files.autoSave', undefined, editorResource.toString());
            }
            if (event.preferenceName === 'files.autoSaveDelay') {
                this.autoSaveDelay = this.editorPreferences.get('files.autoSaveDelay', undefined, editorResource.toString());
            }
        }));
        this.toDispose.push(this.onDirtyChangedEmitter);
    }
    static async create(proxy, viewType, resource, undoRedoService, fileService, editorPreferences, cancellation) {
        const { editable } = await proxy.$createCustomDocument(vscode_uri_1.URI.file(resource.path.toString()), viewType, {}, cancellation);
        return new MainCustomEditorModel(proxy, viewType, resource, editable, undoRedoService, fileService, editorPreferences);
    }
    get resource() {
        return vscode_uri_1.URI.file(this.editorResource.path.toString());
    }
    get dirty() {
        if (this.isDirtyFromContentChange) {
            return true;
        }
        if (this.edits.length > 0) {
            return this.savePoint !== this.currentEditIndex;
        }
        return false;
    }
    get readonly() {
        return !this.editable;
    }
    setProxy(proxy) {
        this.proxy = proxy;
    }
    dispose() {
        if (this.editable) {
            this.undoRedoService.removeElements(this.editorResource);
        }
        this.proxy.$disposeCustomDocument(this.resource, this.viewType);
    }
    changeContent() {
        this.change(() => {
            this.isDirtyFromContentChange = true;
        });
    }
    pushEdit(editId, label) {
        if (!this.editable) {
            throw new Error('Document is not editable');
        }
        this.change(() => {
            this.spliceEdits(editId);
            this.currentEditIndex = this.edits.length - 1;
        });
        this.undoRedoService.pushElement(this.editorResource, () => this.undo(), () => this.redo());
    }
    async revert(options) {
        if (!this.editable) {
            return;
        }
        if (this.currentEditIndex === this.savePoint && !this.isDirtyFromContentChange) {
            return;
        }
        const cancellationSource = new cancellation_1.CancellationTokenSource();
        this.proxy.$revert(this.resource, this.viewType, cancellationSource.token);
        this.change(() => {
            this.isDirtyFromContentChange = false;
            this.currentEditIndex = this.savePoint;
            this.spliceEdits();
        });
    }
    async save(options) {
        await this.saveCustomEditor(options);
    }
    async saveCustomEditor(options) {
        var _a;
        if (!this.editable) {
            return;
        }
        const cancelable = new cancellation_1.CancellationTokenSource();
        const savePromise = this.proxy.$onSave(this.resource, this.viewType, cancelable.token);
        (_a = this.ongoingSave) === null || _a === void 0 ? void 0 : _a.cancel();
        this.ongoingSave = cancelable;
        try {
            await savePromise;
            if (this.ongoingSave === cancelable) { // Make sure we are still doing the same save
                this.change(() => {
                    this.isDirtyFromContentChange = false;
                    this.savePoint = this.currentEditIndex;
                });
            }
        }
        finally {
            if (this.ongoingSave === cancelable) { // Make sure we are still doing the same save
                this.ongoingSave = undefined;
            }
        }
    }
    async saveCustomEditorAs(resource, targetResource, options) {
        if (this.editable) {
            const source = new cancellation_1.CancellationTokenSource();
            await this.proxy.$onSaveAs(this.resource, this.viewType, vscode_uri_1.URI.file(targetResource.path.toString()), source.token);
            this.change(() => {
                this.savePoint = this.currentEditIndex;
            });
        }
        else {
            // Since the editor is readonly, just copy the file over
            await this.fileService.copy(resource, targetResource, { overwrite: false });
        }
    }
    async undo() {
        if (!this.editable) {
            return;
        }
        if (this.currentEditIndex < 0) {
            // nothing to undo
            return;
        }
        const undoneEdit = this.edits[this.currentEditIndex];
        this.change(() => {
            --this.currentEditIndex;
        });
        await this.proxy.$undo(this.resource, this.viewType, undoneEdit, this.dirty);
    }
    async redo() {
        if (!this.editable) {
            return;
        }
        if (this.currentEditIndex >= this.edits.length - 1) {
            // nothing to redo
            return;
        }
        const redoneEdit = this.edits[this.currentEditIndex + 1];
        this.change(() => {
            ++this.currentEditIndex;
        });
        await this.proxy.$redo(this.resource, this.viewType, redoneEdit, this.dirty);
    }
    spliceEdits(editToInsert) {
        const start = this.currentEditIndex + 1;
        const toRemove = this.edits.length - this.currentEditIndex;
        const removedEdits = typeof editToInsert === 'number'
            ? this.edits.splice(start, toRemove, editToInsert)
            : this.edits.splice(start, toRemove);
        if (removedEdits.length) {
            this.proxy.$disposeEdits(this.resource, this.viewType, removedEdits);
        }
    }
    change(makeEdit) {
        const wasDirty = this.dirty;
        makeEdit();
        if (this.dirty !== wasDirty) {
            this.onDirtyChangedEmitter.fire();
        }
        if (this.autoSave !== 'off' && this.dirty && this.resource.scheme !== core_1.UNTITLED_SCHEME) {
            const handle = window.setTimeout(() => {
                this.save();
                window.clearTimeout(handle);
            }, this.autoSaveDelay);
        }
    }
}
exports.MainCustomEditorModel = MainCustomEditorModel;
// copied from https://github.com/microsoft/vscode/blob/53eac52308c4611000a171cc7bf1214293473c78/src/vs/workbench/contrib/customEditor/common/customTextEditorModel.ts
class CustomTextEditorModel {
    constructor(viewType, editorResource, model, fileService) {
        this.viewType = viewType;
        this.editorResource = editorResource;
        this.model = model;
        this.fileService = fileService;
        this.toDispose = new disposable_1.DisposableCollection();
        this.onDirtyChangedEmitter = new core_1.Emitter();
        this.onDirtyChanged = this.onDirtyChangedEmitter.event;
        this.toDispose.push(this.editorTextModel.onDirtyChanged(e => {
            this.onDirtyChangedEmitter.fire();
        }));
        this.toDispose.push(this.onDirtyChangedEmitter);
    }
    static async create(viewType, resource, editorModelService, fileService) {
        const model = await editorModelService.createModelReference(resource);
        model.object.suppressOpenEditorWhenDirty = true;
        return new CustomTextEditorModel(viewType, resource, model, fileService);
    }
    get autoSave() {
        return this.editorTextModel.autoSave;
    }
    get autoSaveDelay() {
        return this.editorTextModel.autoSaveDelay;
    }
    dispose() {
        this.toDispose.dispose();
        this.model.dispose();
    }
    get resource() {
        return vscode_uri_1.URI.file(this.editorResource.path.toString());
    }
    get dirty() {
        return this.editorTextModel.dirty;
    }
    ;
    get readonly() {
        return this.editorTextModel.readOnly;
    }
    get editorTextModel() {
        return this.model.object;
    }
    revert(options) {
        return this.editorTextModel.revert(options);
    }
    save(options) {
        return this.saveCustomEditor(options);
    }
    saveCustomEditor(options) {
        return this.editorTextModel.save(options);
    }
    async saveCustomEditorAs(resource, targetResource, options) {
        await this.saveCustomEditor(options);
        await this.fileService.copy(resource, targetResource, { overwrite: false });
    }
}
exports.CustomTextEditorModel = CustomTextEditorModel;
//# sourceMappingURL=custom-editors-main.js.map