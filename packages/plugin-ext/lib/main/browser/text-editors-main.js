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
exports.TextEditorsMainImpl = void 0;
const vscode_uri_1 = require("@theia/core/shared/vscode-uri");
const plugin_api_rpc_1 = require("../../common/plugin-api-rpc");
const disposable_1 = require("@theia/core/lib/common/disposable");
const errors_1 = require("../../common/errors");
const languages_main_1 = require("./languages-main");
const uri_components_1 = require("../../common/uri-components");
const endpoint_1 = require("@theia/core/lib/browser/endpoint");
const monaco = require("@theia/monaco-editor-core");
const bulkEditService_1 = require("@theia/monaco-editor-core/esm/vs/editor/browser/services/bulkEditService");
class TextEditorsMainImpl {
    constructor(editorsAndDocuments, documents, rpc, bulkEditService, monacoEditorService) {
        this.editorsAndDocuments = editorsAndDocuments;
        this.documents = documents;
        this.bulkEditService = bulkEditService;
        this.monacoEditorService = monacoEditorService;
        this.toDispose = new disposable_1.DisposableCollection();
        this.editorsToDispose = new Map();
        this.fileEndpoint = new endpoint_1.Endpoint({ path: 'file' }).getRestUrl();
        this.proxy = rpc.getProxy(plugin_api_rpc_1.MAIN_RPC_CONTEXT.TEXT_EDITORS_EXT);
        this.toDispose.push(editorsAndDocuments);
        this.toDispose.push(editorsAndDocuments.onTextEditorAdd(editors => editors.forEach(this.onTextEditorAdd, this)));
        this.toDispose.push(editorsAndDocuments.onTextEditorRemove(editors => editors.forEach(this.onTextEditorRemove, this)));
    }
    dispose() {
        this.toDispose.dispose();
    }
    onTextEditorAdd(editor) {
        const id = editor.getId();
        const toDispose = new disposable_1.DisposableCollection(editor.onPropertiesChangedEvent(e => {
            this.proxy.$acceptEditorPropertiesChanged(id, e);
        }), disposable_1.Disposable.create(() => this.editorsToDispose.delete(id)));
        this.editorsToDispose.set(id, toDispose);
        this.toDispose.push(toDispose);
    }
    onTextEditorRemove(id) {
        const disposables = this.editorsToDispose.get(id);
        if (disposables) {
            disposables.dispose();
        }
    }
    $tryShowTextDocument(uri, options) {
        return this.documents.$tryShowDocument(uri, options);
    }
    $trySetOptions(id, options) {
        if (!this.editorsAndDocuments.getEditor(id)) {
            return Promise.reject((0, errors_1.disposed)(`TextEditor: ${id}`));
        }
        this.editorsAndDocuments.getEditor(id).setConfiguration(options);
        return Promise.resolve();
    }
    $trySetSelections(id, selections) {
        if (!this.editorsAndDocuments.getEditor(id)) {
            return Promise.reject((0, errors_1.disposed)(`TextEditor: ${id}`));
        }
        this.editorsAndDocuments.getEditor(id).setSelections(selections);
        return Promise.resolve();
    }
    $tryRevealRange(id, range, revealType) {
        if (!this.editorsAndDocuments.getEditor(id)) {
            return Promise.reject((0, errors_1.disposed)(`TextEditor(${id})`));
        }
        this.editorsAndDocuments.getEditor(id).revealRange(new monaco.Range(range.startLineNumber, range.startColumn, range.endLineNumber, range.endColumn), revealType);
        return Promise.resolve();
    }
    $tryApplyEdits(id, modelVersionId, edits, opts) {
        if (!this.editorsAndDocuments.getEditor(id)) {
            return Promise.reject((0, errors_1.disposed)(`TextEditor(${id})`));
        }
        return Promise.resolve(this.editorsAndDocuments.getEditor(id).applyEdits(modelVersionId, edits, opts));
    }
    async $tryApplyWorkspaceEdit(dto, metadata) {
        const workspaceEdit = (0, languages_main_1.toMonacoWorkspaceEdit)(dto);
        try {
            const edits = bulkEditService_1.ResourceEdit.convert(workspaceEdit);
            const { success } = await this.bulkEditService.apply(edits, { respectAutoSaveConfig: metadata === null || metadata === void 0 ? void 0 : metadata.isRefactoring });
            return success;
        }
        catch {
            return false;
        }
    }
    $tryInsertSnippet(id, template, ranges, opts) {
        if (!this.editorsAndDocuments.getEditor(id)) {
            return Promise.reject((0, errors_1.disposed)(`TextEditor(${id})`));
        }
        return Promise.resolve(this.editorsAndDocuments.getEditor(id).insertSnippet(template, ranges, opts));
    }
    $registerTextEditorDecorationType(key, options) {
        this.injectRemoteUris(options);
        this.monacoEditorService.registerDecorationType('Plugin decoration', key, options);
        this.toDispose.push(disposable_1.Disposable.create(() => this.$removeTextEditorDecorationType(key)));
    }
    injectRemoteUris(options) {
        if (options.before) {
            options.before.contentIconPath = this.toRemoteUri(options.before.contentIconPath);
        }
        if (options.after) {
            options.after.contentIconPath = this.toRemoteUri(options.after.contentIconPath);
        }
        if ('gutterIconPath' in options) {
            options.gutterIconPath = this.toRemoteUri(options.gutterIconPath);
        }
        if ('dark' in options && options.dark) {
            this.injectRemoteUris(options.dark);
        }
        if ('light' in options && options.light) {
            this.injectRemoteUris(options.light);
        }
    }
    toRemoteUri(uri) {
        if (uri && uri.scheme === 'file') {
            return (0, uri_components_1.theiaUritoUriComponents)(this.fileEndpoint.withQuery(vscode_uri_1.URI.revive(uri).toString()));
        }
        return uri;
    }
    $removeTextEditorDecorationType(key) {
        this.monacoEditorService.removeDecorationType(key);
    }
    $tryHideEditor(id) {
        return this.editorsAndDocuments.hideEditor(id);
    }
    $trySetDecorations(id, key, ranges) {
        if (!this.editorsAndDocuments.getEditor(id)) {
            return Promise.reject((0, errors_1.disposed)(`TextEditor(${id})`));
        }
        this.editorsAndDocuments.getEditor(id).setDecorations(key, ranges);
        return Promise.resolve();
    }
    $trySetDecorationsFast(id, key, ranges) {
        if (!this.editorsAndDocuments.getEditor(id)) {
            return Promise.reject((0, errors_1.disposed)(`TextEditor(${id})`));
        }
        this.editorsAndDocuments.getEditor(id).setDecorationsFast(key, ranges);
        return Promise.resolve();
    }
    $saveAll(includeUntitled) {
        return this.editorsAndDocuments.saveAll(includeUntitled);
    }
}
exports.TextEditorsMainImpl = TextEditorsMainImpl;
//# sourceMappingURL=text-editors-main.js.map