"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentsExtImpl = void 0;
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
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/**
 * based on https://github.com/Microsoft/vscode/blob/bf9a27ec01f2ef82fc45f69e0c946c7d74a57d3e/src/vs/workbench/api/node/extHostDocumentSaveParticipant.ts
 */
const plugin_api_rpc_1 = require("../common/plugin-api-rpc");
const types_impl_1 = require("./types-impl");
const event_1 = require("@theia/core/lib/common/event");
const document_data_1 = require("./document-data");
const Converter = require("./type-converters");
const disposable_1 = require("@theia/core/lib/common/disposable");
class DocumentsExtImpl {
    constructor(rpc, editorsAndDocuments) {
        this.editorsAndDocuments = editorsAndDocuments;
        this.toDispose = new disposable_1.DisposableCollection();
        this._onDidAddDocument = new event_1.Emitter();
        this._onDidRemoveDocument = new event_1.Emitter();
        this._onDidChangeDocument = new event_1.Emitter();
        this._onDidSaveTextDocument = new event_1.Emitter();
        this._onWillSaveTextDocument = new event_1.Emitter();
        this.onDidAddDocument = this._onDidAddDocument.event;
        this.onDidRemoveDocument = this._onDidRemoveDocument.event;
        this.onDidChangeDocument = this._onDidChangeDocument.event;
        this.onDidSaveTextDocument = this._onDidSaveTextDocument.event;
        this.onWillSaveTextDocument = this._onWillSaveTextDocument.event;
        this.loadingDocuments = new Map();
        this.proxy = rpc.getProxy(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.DOCUMENTS_MAIN);
        this.toDispose.push(this.editorsAndDocuments.onDidAddDocuments(documents => {
            for (const document of documents) {
                this._onDidAddDocument.fire(document.document);
            }
        }));
        this.toDispose.push(this.editorsAndDocuments.onDidRemoveDocuments(documents => {
            for (const data of documents) {
                this._onDidRemoveDocument.fire(data.document);
            }
        }));
    }
    $acceptModelModeChanged(startUrl, oldModeId, newModeId) {
        const uri = types_impl_1.URI.revive(startUrl);
        const uriString = uri.toString();
        const data = this.editorsAndDocuments.getDocument(uriString);
        if (data) {
            this._onDidRemoveDocument.fire(data.document);
            data.acceptLanguageId(newModeId);
            this._onDidAddDocument.fire(data.document);
        }
    }
    $acceptModelSaved(strUrl) {
        const uri = types_impl_1.URI.revive(strUrl);
        const uriString = uri.toString();
        const data = this.editorsAndDocuments.getDocument(uriString);
        this.$acceptDirtyStateChanged(strUrl, false);
        if (data) {
            this._onDidSaveTextDocument.fire(data.document);
        }
    }
    async $acceptModelWillSave(strUrl, reason, saveTimeout) {
        const uri = types_impl_1.URI.revive(strUrl).toString();
        const operations = [];
        let didTimeout = false;
        // try to timeout early to squeeze edits at least from some save participants
        const didTimeoutHandle = setTimeout(() => didTimeout = true, saveTimeout - 250);
        try {
            await this._onWillSaveTextDocument.sequence(async (fireEvent) => {
                if (didTimeout) {
                    return false;
                }
                try {
                    const documentData = this.editorsAndDocuments.getDocument(uri);
                    if (documentData) {
                        const { document } = documentData;
                        await this.fireTextDocumentWillSaveEvent({
                            document, reason, fireEvent,
                            accept: operation => operations.push(operation)
                        });
                    }
                }
                catch (e) {
                    console.error(e);
                }
                return !didTimeout;
            });
        }
        finally {
            clearTimeout(didTimeoutHandle);
        }
        return operations;
    }
    /* eslint-disable @typescript-eslint/no-explicit-any */
    async fireTextDocumentWillSaveEvent({ document, reason, fireEvent, accept }) {
        const promises = [];
        fireEvent(Object.freeze({
            document, reason,
            waitUntil(p) {
                if (Object.isFrozen(promises)) {
                    throw new Error('waitUntil can not be called async');
                }
                promises.push(p);
            }
        }));
        Object.freeze(promises);
        await Promise.all(promises).then(allEdits => allEdits.forEach(edits => {
            if (Array.isArray(edits)) {
                edits.forEach(edit => {
                    if (types_impl_1.TextEdit.isTextEdit(edit)) {
                        accept(Converter.fromTextEdit(edit));
                    }
                });
            }
        }));
    }
    /* eslint-enable  @typescript-eslint/no-explicit-any */
    $acceptDirtyStateChanged(strUrl, isDirty) {
        const uri = types_impl_1.URI.revive(strUrl);
        const uriString = uri.toString();
        const data = this.editorsAndDocuments.getDocument(uriString);
        if (!data) {
            throw new Error('unknown document');
        }
        data.acceptIsDirty(isDirty);
        this._onDidChangeDocument.fire({
            document: data.document,
            contentChanges: [],
            reason: undefined,
        });
    }
    $acceptModelChanged(strUrl, e, isDirty) {
        const uri = types_impl_1.URI.revive(strUrl);
        const uriString = uri.toString();
        const data = this.editorsAndDocuments.getDocument(uriString);
        if (!data) {
            throw new Error('unknown document');
        }
        data.acceptIsDirty(isDirty);
        data.onEvents(e);
        this._onDidChangeDocument.fire({
            document: data.document,
            reason: e.reason,
            contentChanges: e.changes.map(change => ({
                range: Converter.toRange(change.range),
                rangeOffset: change.rangeOffset,
                rangeLength: change.rangeLength,
                text: change.text
            }))
        });
    }
    getAllDocumentData() {
        return this.editorsAndDocuments.allDocuments();
    }
    getDocumentData(resource) {
        if (resource) {
            return this.editorsAndDocuments.getDocument(resource.toString());
        }
        return undefined;
    }
    getDocument(resource) {
        const data = this.getDocumentData(resource);
        if (!(data === null || data === void 0 ? void 0 : data.document)) {
            throw new Error(`Unable to retrieve document from URI '${resource}'`);
        }
        return data.document;
    }
    /**
     * Retrieve document and open it in the editor if need.
     *
     * @param uri path to the resource
     * @param options if options exists, resource will be opened in editor, otherwise only document object is returned
     */
    async showDocument(uri, options) {
        // Determine whether the document is already loading
        const loadingDocument = this.loadingDocuments.get(uri.toString());
        if (loadingDocument) {
            // return the promise if document is already loading
            return loadingDocument;
        }
        try {
            // start opening document
            const document = this.loadDocument(uri, options);
            // add loader to the map
            this.loadingDocuments.set(uri.toString(), document);
            // wait the document being opened
            await document;
            // return opened document
            return document;
        }
        catch (error) {
            return Promise.reject(error);
        }
        finally {
            // remove loader from the map
            this.loadingDocuments.delete(uri.toString());
        }
    }
    async openDocument(uri) {
        const cached = this.editorsAndDocuments.getDocument(uri.toString());
        if (cached) {
            return cached;
        }
        await this.proxy.$tryOpenDocument(uri);
        return this.editorsAndDocuments.getDocument(uri.toString());
    }
    async loadDocument(uri, options) {
        let documentOptions;
        if (options) {
            let selection;
            if (options.selection) {
                const { start, end } = options.selection;
                selection = {
                    startLineNumber: start.line + 1,
                    startColumn: start.character + 1,
                    endLineNumber: end.line + 1,
                    endColumn: end.character + 1
                };
            }
            documentOptions = {
                selection,
                preserveFocus: options.preserveFocus,
                preview: options.preview,
                viewColumn: options.viewColumn
            };
        }
        await this.proxy.$tryShowDocument(uri, documentOptions);
        return this.editorsAndDocuments.getDocument(uri.toString());
    }
    async createDocumentData(options) {
        return this.proxy.$tryCreateDocument(options).then(data => types_impl_1.URI.revive(data));
    }
    setWordDefinitionFor(modeId, wordDefinition) {
        (0, document_data_1.setWordDefinitionFor)(modeId, wordDefinition);
    }
}
exports.DocumentsExtImpl = DocumentsExtImpl;
//# sourceMappingURL=documents.js.map