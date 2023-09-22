"use strict";
// *****************************************************************************
// Copyright (C) 2023 TypeFox and others.
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotebooksExtImpl = void 0;
const core_1 = require("@theia/core");
const types_impl_1 = require("../types-impl");
const common_1 = require("../../common");
const cache_1 = require("../../common/cache");
const typeConverters = require("../type-converters");
const buffer_1 = require("@theia/core/lib/common/buffer");
const notebook_document_1 = require("./notebook-document");
const notebook_editor_1 = require("./notebook-editor");
class NotebooksExtImpl {
    constructor(rpc, commands, textDocumentsAndEditors, textDocuments) {
        this.textDocumentsAndEditors = textDocumentsAndEditors;
        this.textDocuments = textDocuments;
        this.notebookStatusBarItemProviders = new Map();
        this.onDidChangeActiveNotebookEditorEmitter = new core_1.Emitter();
        this.onDidChangeActiveNotebookEditor = this.onDidChangeActiveNotebookEditorEmitter.event;
        this.onDidOpenNotebookDocumentEmitter = new core_1.Emitter();
        this.onDidOpenNotebookDocument = this.onDidOpenNotebookDocumentEmitter.event;
        this.onDidCloseNotebookDocumentEmitter = new core_1.Emitter();
        this.onDidCloseNotebookDocument = this.onDidCloseNotebookDocumentEmitter.event;
        this.onDidChangeVisibleNotebookEditorsEmitter = new core_1.Emitter();
        this.onDidChangeVisibleNotebookEditors = this.onDidChangeVisibleNotebookEditorsEmitter.event;
        this.visibleNotebookEditors = [];
        this.documents = new Map();
        this.editors = new Map();
        this.statusBarRegistry = new cache_1.Cache('NotebookCellStatusBarCache');
        // --- serialize/deserialize
        this.currentSerializerHandle = 0;
        this.notebookSerializer = new Map();
        this.notebookProxy = rpc.getProxy(common_1.PLUGIN_RPC_CONTEXT.NOTEBOOKS_MAIN);
        this.notebookDocumentsProxy = rpc.getProxy(common_1.PLUGIN_RPC_CONTEXT.NOTEBOOK_DOCUMENTS_MAIN);
        this.notebookEditors = rpc.getProxy(common_1.PLUGIN_RPC_CONTEXT.NOTEBOOK_EDITORS_MAIN);
        commands.registerArgumentProcessor({
            processArgument: (arg) => {
                var _a;
                if (arg && arg.uri && this.documents.has(arg.uri.toString())) {
                    return (_a = this.documents.get(arg.uri.toString())) === null || _a === void 0 ? void 0 : _a.apiNotebook;
                }
                return arg;
            }
        });
    }
    get activeApiNotebookEditor() {
        var _a;
        return (_a = this.activeNotebookEditor) === null || _a === void 0 ? void 0 : _a.apiEditor;
    }
    get visibleApiNotebookEditors() {
        return this.visibleNotebookEditors.map(editor => editor.apiEditor);
    }
    async $provideNotebookCellStatusBarItems(handle, uri, index, token) {
        const provider = this.notebookStatusBarItemProviders.get(handle);
        const revivedUri = core_1.URI.fromComponents(uri);
        const document = this.documents.get(revivedUri.toString());
        if (!document || !provider) {
            return;
        }
        const cell = document.getCellFromIndex(index);
        if (!cell) {
            return;
        }
        const result = await provider.provideCellStatusBarItems(cell.apiCell, token);
        if (!result) {
            return undefined;
        }
        const disposables = new core_1.DisposableCollection();
        const cacheId = this.statusBarRegistry.add([disposables]);
        const resultArr = Array.isArray(result) ? result : [result];
        const items = resultArr.map(item => typeConverters.NotebookStatusBarItem.from(item, this.commandsConverter, disposables));
        return {
            cacheId,
            items
        };
    }
    $releaseNotebookCellStatusBarItems(cacheId) {
        this.statusBarRegistry.delete(cacheId);
    }
    registerNotebookSerializer(plugin, viewType, serializer, options) {
        if (!viewType || !viewType.trim()) {
            throw new Error('viewType cannot be empty or just whitespace');
        }
        const handle = this.currentSerializerHandle++;
        this.notebookSerializer.set(handle, serializer);
        this.notebookProxy.$registerNotebookSerializer(handle, { id: plugin.model.id, location: plugin.pluginUri }, viewType, typeConverters.NotebookDocumentContentOptions.from(options));
        return core_1.Disposable.create(() => {
            this.notebookProxy.$unregisterNotebookSerializer(handle);
        });
    }
    async $dataToNotebook(handle, bytes, token) {
        const serializer = this.notebookSerializer.get(handle);
        if (!serializer) {
            throw new Error('No serializer found');
        }
        const data = await serializer.deserializeNotebook(bytes.buffer, token);
        return typeConverters.NotebookData.from(data);
    }
    async $notebookToData(handle, data, token) {
        const serializer = this.notebookSerializer.get(handle);
        if (!serializer) {
            throw new Error('No serializer found');
        }
        const bytes = await serializer.serializeNotebook(typeConverters.NotebookData.to(data), token);
        return buffer_1.BinaryBuffer.wrap(bytes);
    }
    registerNotebookCellStatusBarItemProvider(notebookType, provider) {
        const handle = this.currentSerializerHandle++;
        const eventHandle = typeof provider.onDidChangeCellStatusBarItems === 'function' ? this.currentSerializerHandle++ : undefined;
        this.notebookStatusBarItemProviders.set(handle, provider);
        this.notebookProxy.$registerNotebookCellStatusBarItemProvider(handle, eventHandle, notebookType);
        let subscription;
        if (eventHandle !== undefined) {
            subscription = provider.onDidChangeCellStatusBarItems(_ => this.notebookProxy.$emitCellStatusBarEvent(eventHandle));
        }
        return core_1.Disposable.create(() => {
            this.notebookStatusBarItemProviders.delete(handle);
            this.notebookProxy.$unregisterNotebookCellStatusBarItemProvider(handle, eventHandle);
            subscription === null || subscription === void 0 ? void 0 : subscription.dispose();
        });
    }
    getEditorById(editorId) {
        const editor = this.editors.get(editorId);
        if (!editor) {
            throw new Error(`unknown text editor: ${editorId}. known editors: ${[...this.editors.keys()]} `);
        }
        return editor;
    }
    getAllApiDocuments() {
        return [...this.documents.values()].map(doc => doc.apiNotebook);
    }
    async $acceptDocumentsAndEditorsDelta(delta) {
        var _a, _b, _c;
        if (delta.removedDocuments) {
            for (const uri of delta.removedDocuments) {
                const revivedUri = core_1.URI.fromComponents(uri);
                const document = this.documents.get(revivedUri.toString());
                if (document) {
                    document.dispose();
                    this.documents.delete(revivedUri.toString());
                    this.onDidCloseNotebookDocumentEmitter.fire(document.apiNotebook);
                }
                for (const editor of this.editors.values()) {
                    if (editor.notebookData.uri.toString() === revivedUri.toString()) {
                        this.editors.delete(editor.id);
                    }
                }
            }
        }
        if (delta.addedDocuments) {
            for (const modelData of delta.addedDocuments) {
                const uri = types_impl_1.URI.from(modelData.uri);
                if (this.documents.has(uri.toString())) {
                    throw new Error(`adding EXISTING notebook ${uri} `);
                }
                const document = new notebook_document_1.NotebookDocument(this.notebookDocumentsProxy, this.textDocumentsAndEditors, this.textDocuments, uri, modelData);
                (_a = this.documents.get(uri.toString())) === null || _a === void 0 ? void 0 : _a.dispose();
                this.documents.set(uri.toString(), document);
                this.onDidOpenNotebookDocumentEmitter.fire(document.apiNotebook);
            }
        }
        if (delta.addedEditors) {
            for (const editorModelData of delta.addedEditors) {
                if (this.editors.has(editorModelData.id)) {
                    return;
                }
                const revivedUri = core_1.URI.fromComponents(editorModelData.documentUri);
                const document = this.documents.get(revivedUri.toString());
                if (document) {
                    this.createExtHostEditor(document, editorModelData.id, editorModelData);
                }
            }
        }
        const removedEditors = [];
        if (delta.removedEditors) {
            for (const editorId of delta.removedEditors) {
                const editor = this.editors.get(editorId);
                if (editor) {
                    this.editors.delete(editorId);
                    if (((_b = this.activeNotebookEditor) === null || _b === void 0 ? void 0 : _b.id) === editor.id) {
                        this.activeNotebookEditor = undefined;
                    }
                    removedEditors.push(editor);
                }
            }
        }
        if (delta.visibleEditors) {
            this.visibleNotebookEditors = delta.visibleEditors.map(id => this.editors.get(id)).filter(editor => !!editor);
            const visibleEditorsSet = new Set();
            this.visibleNotebookEditors.forEach(editor => visibleEditorsSet.add(editor.id));
            for (const editor of this.editors.values()) {
                const newValue = visibleEditorsSet.has(editor.id);
                editor.acceptVisibility(newValue);
            }
            this.visibleNotebookEditors = [...this.editors.values()].map(e => e).filter(e => e.visible);
            this.onDidChangeVisibleNotebookEditorsEmitter.fire(this.visibleApiNotebookEditors);
        }
        if (delta.newActiveEditor === null) {
            // clear active notebook as current active editor is non-notebook editor
            this.activeNotebookEditor = undefined;
        }
        else if (delta.newActiveEditor) {
            const activeEditor = this.editors.get(delta.newActiveEditor);
            if (!activeEditor) {
                console.error(`FAILED to find active notebook editor ${delta.newActiveEditor}`);
            }
            this.activeNotebookEditor = this.editors.get(delta.newActiveEditor);
        }
        if (delta.newActiveEditor !== undefined) {
            this.onDidChangeActiveNotebookEditorEmitter.fire((_c = this.activeNotebookEditor) === null || _c === void 0 ? void 0 : _c.apiEditor);
        }
    }
    getNotebookDocument(uri, relaxed) {
        const result = this.documents.get(uri.toString());
        if (!result && !relaxed) {
            throw new Error(`NO notebook document for '${uri}'`);
        }
        return result;
    }
    createExtHostEditor(document, editorId, data) {
        if (this.editors.has(editorId)) {
            throw new Error(`editor with id ALREADY EXISTS: ${editorId}`);
        }
        const editor = new notebook_editor_1.NotebookEditor(editorId, document, data.visibleRanges.map(typeConverters.NotebookRange.to), data.selections.map(typeConverters.NotebookRange.to), typeof data.viewColumn === 'number' ? typeConverters.ViewColumn.to(data.viewColumn) : undefined);
        this.editors.set(editorId, editor);
    }
    async createNotebookDocument(options) {
        const canonicalUri = await this.notebookDocumentsProxy.$tryCreateNotebook({
            viewType: options.viewType,
            content: options.content && typeConverters.NotebookData.from(options.content)
        });
        return types_impl_1.URI.from(canonicalUri);
    }
    async openNotebookDocument(uri) {
        const cached = this.documents.get(uri.toString());
        if (cached) {
            return cached.apiNotebook;
        }
        const canonicalUri = await this.notebookDocumentsProxy.$tryOpenNotebook(uri);
        const document = this.documents.get(core_1.URI.fromComponents(canonicalUri).toString());
        return document === null || document === void 0 ? void 0 : document.apiNotebook;
    }
    async showNotebookDocument(notebookOrUri, options) {
        var _a;
        if (core_1.URI.isUri(notebookOrUri)) {
            notebookOrUri = await this.openNotebookDocument(notebookOrUri);
        }
        const notebook = notebookOrUri;
        let resolvedOptions;
        if (typeof options === 'object') {
            resolvedOptions = {
                position: typeConverters.ViewColumn.from(options.viewColumn),
                preserveFocus: options.preserveFocus,
                selections: options.selections && options.selections.map(typeConverters.NotebookRange.from),
                pinned: typeof options.preview === 'boolean' ? !options.preview : undefined
            };
        }
        else {
            resolvedOptions = {
                preserveFocus: false
            };
        }
        const editorId = await this.notebookEditors.$tryShowNotebookDocument(notebook.uri, notebook.notebookType, resolvedOptions);
        const editor = editorId && ((_a = this.editors.get(editorId)) === null || _a === void 0 ? void 0 : _a.apiEditor);
        if (editor) {
            return editor;
        }
        if (editorId) {
            throw new Error(`Could NOT open editor for "${notebook.uri.toString()}" because another editor opened in the meantime.`);
        }
        else {
            throw new Error(`Could NOT open editor for "${notebook.uri.toString()}".`);
        }
    }
}
exports.NotebooksExtImpl = NotebooksExtImpl;
//# sourceMappingURL=notebooks.js.map