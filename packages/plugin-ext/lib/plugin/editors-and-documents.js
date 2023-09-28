"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditorsAndDocumentsExtImpl = void 0;
const plugin_api_rpc_1 = require("../common/plugin-api-rpc");
const text_editor_1 = require("./text-editor");
const event_1 = require("@theia/core/lib/common/event");
const document_data_1 = require("./document-data");
const assert_1 = require("../common/assert");
const Converter = require("./type-converters");
const disposable_util_1 = require("../common/disposable-util");
const types_impl_1 = require("./types-impl");
class EditorsAndDocumentsExtImpl {
    constructor(rpc) {
        this.rpc = rpc;
        this.activeEditorId = null;
        this._onDidAddDocuments = new event_1.Emitter();
        this._onDidRemoveDocuments = new event_1.Emitter();
        this._onDidChangeVisibleTextEditors = new event_1.Emitter();
        this._onDidChangeActiveTextEditor = new event_1.Emitter();
        this.onDidAddDocuments = this._onDidAddDocuments.event;
        this.onDidRemoveDocuments = this._onDidRemoveDocuments.event;
        this.onDidChangeVisibleTextEditors = this._onDidChangeVisibleTextEditors.event;
        this.onDidChangeActiveTextEditor = this._onDidChangeActiveTextEditor.event;
        this.documents = new Map();
        this.editors = new Map();
    }
    async $acceptEditorsAndDocumentsDelta(delta) {
        const removedDocuments = new Array();
        const addedDocuments = new Array();
        const removedEditors = new Array();
        if (delta.removedDocuments) {
            for (const uriComponent of delta.removedDocuments) {
                const uri = types_impl_1.URI.revive(uriComponent);
                const id = uri.toString();
                const data = this.documents.get(id);
                this.documents.delete(id);
                if (data) {
                    removedDocuments.push(data);
                }
            }
        }
        if (delta.addedDocuments) {
            for (const data of delta.addedDocuments) {
                const resource = types_impl_1.URI.revive(data.uri);
                (0, assert_1.ok)(!this.documents.has(resource.toString()), `document '${resource}' already exists!`);
                const documentData = new document_data_1.DocumentDataExt(this.rpc.getProxy(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.DOCUMENTS_MAIN), resource, data.lines, data.EOL, data.modeId, data.versionId, data.isDirty);
                this.documents.set(resource.toString(), documentData);
                addedDocuments.push(documentData);
            }
        }
        if (delta.removedEditors) {
            for (const id of delta.removedEditors) {
                const editor = this.editors.get(id);
                this.editors.delete(id);
                if (editor) {
                    removedEditors.push(editor);
                }
            }
        }
        if (delta.addedEditors) {
            for (const data of delta.addedEditors) {
                const resource = types_impl_1.URI.revive(data.documentUri);
                (0, assert_1.ok)(this.documents.has(resource.toString()), `document '${resource}' doesn't exist`);
                (0, assert_1.ok)(!this.editors.has(data.id), `editor '${data.id}' already exists!`);
                const documentData = this.documents.get(resource.toString());
                const editor = new text_editor_1.TextEditorExt(this.rpc.getProxy(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.TEXT_EDITORS_MAIN), data.id, documentData, data.selections.map(Converter.toSelection), data.options, data.visibleRanges.map(Converter.toRange), Converter.toViewColumn(data.editorPosition));
                this.editors.set(data.id, editor);
            }
        }
        // TODO investigate how to get rid of it to align with VS Code extension host code
        if (this.activeEditorId && delta.removedEditors && delta.removedEditors.indexOf(this.activeEditorId) !== -1 && this.editors.size !== 0) {
            // to be compatible with VSCode, when active editor is closed onDidChangeActiveTextEditor
            // should be triggered with undefined before next editor, if any, become active.
            this.activeEditorId = null;
            this._onDidChangeActiveTextEditor.fire(undefined);
        }
        if (delta.newActiveEditor !== undefined) {
            (0, assert_1.ok)(delta.newActiveEditor === null || this.editors.has(delta.newActiveEditor), `active editor '${delta.newActiveEditor}' does not exist`);
            this.activeEditorId = delta.newActiveEditor;
        }
        (0, disposable_util_1.dispose)(removedDocuments);
        (0, disposable_util_1.dispose)(removedEditors);
        // now that the internal state is complete, fire events
        if (delta.removedDocuments) {
            this._onDidRemoveDocuments.fire(removedDocuments);
        }
        if (delta.addedDocuments) {
            this._onDidAddDocuments.fire(addedDocuments);
        }
        if (delta.removedEditors || delta.addedEditors) {
            this._onDidChangeVisibleTextEditors.fire(this.allEditors());
        }
        if (delta.newActiveEditor !== undefined) {
            this._onDidChangeActiveTextEditor.fire(this.activeEditor());
        }
    }
    allEditors() {
        const result = new Array();
        this.editors.forEach(editor => result.push(editor));
        return result;
    }
    activeEditor() {
        if (!this.activeEditorId) {
            return undefined;
        }
        else {
            return this.editors.get(this.activeEditorId);
        }
    }
    allDocuments() {
        const result = new Array();
        this.documents.forEach(data => result.push(data));
        return result;
    }
    getDocument(uri) {
        return this.documents.get(uri);
    }
    getEditor(id) {
        return this.editors.get(id);
    }
}
exports.EditorsAndDocumentsExtImpl = EditorsAndDocumentsExtImpl;
//# sourceMappingURL=editors-and-documents.js.map