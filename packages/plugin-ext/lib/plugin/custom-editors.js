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
// copied and modified from https://github.com/microsoft/vscode/blob/53eac52308c4611000a171cc7bf1214293473c78/src/vs/workbench/api/common/extHostCustomEditors.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomEditorsExtImpl = void 0;
const plugin_api_rpc_1 = require("../common/plugin-api-rpc");
const types_impl_1 = require("./types-impl");
const webviews_1 = require("./webviews");
const cancellation_1 = require("@theia/core/lib/common/cancellation");
const disposable_1 = require("@theia/core/lib/common/disposable");
const cache_1 = require("../common/cache");
class CustomEditorsExtImpl {
    constructor(rpc, documentExt, webviewExt, workspace) {
        this.documentExt = documentExt;
        this.webviewExt = webviewExt;
        this.workspace = workspace;
        this.editorProviders = new EditorProviderStore();
        this.documents = new CustomDocumentStore();
        this.proxy = rpc.getProxy(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.CUSTOM_EDITORS_MAIN);
    }
    registerCustomEditorProvider(viewType, provider, options, plugin) {
        const disposables = new disposable_1.DisposableCollection();
        if ('resolveCustomTextEditor' in provider) {
            disposables.push(this.editorProviders.addTextProvider(viewType, plugin, provider));
            this.proxy.$registerTextEditorProvider(viewType, options.webviewOptions || {}, {
                supportsMove: !!provider.moveCustomTextEditor,
            });
        }
        else {
            disposables.push(this.editorProviders.addCustomProvider(viewType, plugin, provider));
            if (this.supportEditing(provider)) {
                disposables.push(provider.onDidChangeCustomDocument((e) => {
                    const entry = this.getCustomDocumentEntry(viewType, e.document.uri);
                    if (isEditEvent(e)) {
                        const editId = entry.addEdit(e);
                        this.proxy.$onDidEdit(e.document.uri, viewType, editId, e.label);
                    }
                    else {
                        this.proxy.$onContentChange(e.document.uri, viewType);
                    }
                }));
            }
            this.proxy.$registerCustomEditorProvider(viewType, options.webviewOptions || {}, !!options.supportsMultipleEditorsPerDocument);
        }
        return types_impl_1.Disposable.from(disposables, types_impl_1.Disposable.create(() => {
            this.proxy.$unregisterEditorProvider(viewType);
        }));
    }
    async $createCustomDocument(resource, viewType, openContext, cancellation) {
        const entry = this.editorProviders.get(viewType);
        if (!entry) {
            throw new Error(`No provider found for '${viewType}'`);
        }
        if (entry.type !== 1 /* Custom */) {
            throw new Error(`Invalid provide type for '${viewType}'`);
        }
        const revivedResource = types_impl_1.URI.revive(resource);
        const document = await entry.provider.openCustomDocument(revivedResource, openContext, cancellation);
        this.documents.add(viewType, document);
        return { editable: this.supportEditing(entry.provider) };
    }
    async $disposeCustomDocument(resource, viewType) {
        const entry = this.editorProviders.get(viewType);
        if (!entry) {
            throw new Error(`No provider found for '${viewType}'`);
        }
        if (entry.type !== 1 /* Custom */) {
            throw new Error(`Invalid provider type for '${viewType}'`);
        }
        const revivedResource = types_impl_1.URI.revive(resource);
        const { document } = this.getCustomDocumentEntry(viewType, revivedResource);
        this.documents.delete(viewType, document);
        document.dispose();
    }
    async $resolveWebviewEditor(resource, handler, viewType, title, widgetOpenerOptions, options, cancellation) {
        const entry = this.editorProviders.get(viewType);
        if (!entry) {
            throw new Error(`No provider found for '${viewType}'`);
        }
        const panel = this.webviewExt.createWebviewPanel(viewType, title, {}, options, entry.plugin, handler);
        const webviewOptions = webviews_1.WebviewImpl.toWebviewOptions(options, this.workspace, entry.plugin);
        await this.proxy.$createCustomEditorPanel(handler, title, widgetOpenerOptions, webviewOptions);
        const revivedResource = types_impl_1.URI.revive(resource);
        switch (entry.type) {
            case 1 /* Custom */: {
                const { document } = this.getCustomDocumentEntry(viewType, revivedResource);
                return entry.provider.resolveCustomEditor(document, panel, cancellation);
            }
            case 0 /* Text */: {
                const document = this.documentExt.getDocument(revivedResource);
                return entry.provider.resolveCustomTextEditor(document, panel, cancellation);
            }
            default: {
                throw new Error('Unknown webview provider type');
            }
        }
    }
    getCustomDocumentEntry(viewType, resource) {
        const entry = this.documents.get(viewType, types_impl_1.URI.revive(resource));
        if (!entry) {
            throw new Error('No custom document found');
        }
        return entry;
    }
    $disposeEdits(resourceComponents, viewType, editIds) {
        const document = this.getCustomDocumentEntry(viewType, resourceComponents);
        document.disposeEdits(editIds);
    }
    async $onMoveCustomEditor(handle, newResourceComponents, viewType) {
        const entry = this.editorProviders.get(viewType);
        if (!entry) {
            throw new Error(`No provider found for '${viewType}'`);
        }
        if (!entry.provider.moveCustomTextEditor) {
            throw new Error(`Provider does not implement move '${viewType}'`);
        }
        const webview = this.webviewExt.getWebviewPanel(handle);
        if (!webview) {
            throw new Error('No webview found');
        }
        const resource = types_impl_1.URI.revive(newResourceComponents);
        const document = this.documentExt.getDocument(resource);
        const cancellationSource = new cancellation_1.CancellationTokenSource();
        await entry.provider.moveCustomTextEditor(document, webview, cancellationSource.token);
    }
    async $undo(resourceComponents, viewType, editId, isDirty) {
        const entry = this.getCustomDocumentEntry(viewType, resourceComponents);
        return entry.undo(editId, isDirty);
    }
    async $redo(resourceComponents, viewType, editId, isDirty) {
        const entry = this.getCustomDocumentEntry(viewType, resourceComponents);
        return entry.redo(editId, isDirty);
    }
    async $revert(resourceComponents, viewType, cancellation) {
        const entry = this.getCustomDocumentEntry(viewType, resourceComponents);
        const provider = this.getCustomEditorProvider(viewType);
        await provider.revertCustomDocument(entry.document, cancellation);
    }
    async $onSave(resourceComponents, viewType, cancellation) {
        const entry = this.getCustomDocumentEntry(viewType, resourceComponents);
        const provider = this.getCustomEditorProvider(viewType);
        await provider.saveCustomDocument(entry.document, cancellation);
    }
    async $onSaveAs(resourceComponents, viewType, targetResource, cancellation) {
        const entry = this.getCustomDocumentEntry(viewType, resourceComponents);
        const provider = this.getCustomEditorProvider(viewType);
        return provider.saveCustomDocumentAs(entry.document, types_impl_1.URI.revive(targetResource), cancellation);
    }
    getCustomEditorProvider(viewType) {
        const entry = this.editorProviders.get(viewType);
        const provider = entry === null || entry === void 0 ? void 0 : entry.provider;
        if (!provider || !this.supportEditing(provider)) {
            throw new Error('Custom document is not editable');
        }
        return provider;
    }
    supportEditing(provider) {
        return !!provider.onDidChangeCustomDocument;
    }
}
exports.CustomEditorsExtImpl = CustomEditorsExtImpl;
function isEditEvent(e) {
    return typeof e.undo === 'function'
        && typeof e.redo === 'function';
}
class CustomDocumentStoreEntry {
    constructor(document) {
        this.document = document;
        this.edits = new cache_1.Cache('custom documents');
    }
    addEdit(item) {
        return this.edits.add([item]);
    }
    async undo(editId, isDirty) {
        await this.getEdit(editId).undo();
    }
    async redo(editId, isDirty) {
        await this.getEdit(editId).redo();
    }
    disposeEdits(editIds) {
        for (const id of editIds) {
            this.edits.delete(id);
        }
    }
    getEdit(editId) {
        const edit = this.edits.get(editId, 0);
        if (!edit) {
            throw new Error('No edit found');
        }
        return edit;
    }
}
class EditorProviderStore {
    constructor() {
        this.providers = new Map();
    }
    addTextProvider(viewType, plugin, provider) {
        return this.add(0 /* Text */, viewType, plugin, provider);
    }
    addCustomProvider(viewType, plugin, provider) {
        return this.add(1 /* Custom */, viewType, plugin, provider);
    }
    get(viewType) {
        return this.providers.get(viewType);
    }
    add(type, viewType, plugin, provider) {
        if (this.providers.has(viewType)) {
            throw new Error(`Provider for viewType:${viewType} already registered`);
        }
        this.providers.set(viewType, { type, plugin: plugin, provider });
        return new types_impl_1.Disposable(() => this.providers.delete(viewType));
    }
}
class CustomDocumentStore {
    constructor() {
        this.documents = new Map();
    }
    get(viewType, resource) {
        return this.documents.get(this.key(viewType, resource));
    }
    add(viewType, document) {
        const key = this.key(viewType, document.uri);
        if (this.documents.has(key)) {
            throw new Error(`Document already exists for viewType:${viewType} resource:${document.uri}`);
        }
        const entry = new CustomDocumentStoreEntry(document);
        this.documents.set(key, entry);
        return entry;
    }
    delete(viewType, document) {
        const key = this.key(viewType, document.uri);
        this.documents.delete(key);
    }
    key(viewType, resource) {
        return `${viewType}@@@${resource}`;
    }
}
//# sourceMappingURL=custom-editors.js.map