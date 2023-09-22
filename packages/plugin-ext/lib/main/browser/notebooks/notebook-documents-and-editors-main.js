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
exports.NotebooksAndEditorsMain = void 0;
const core_1 = require("@theia/core");
const browser_1 = require("@theia/notebook/lib/browser");
const common_1 = require("../../../common");
const notebook_dto_1 = require("./notebook-dto");
const browser_2 = require("@theia/core/lib/browser");
const collections_1 = require("../../../common/collections");
const async_mutex_1 = require("async-mutex");
class NotebookAndEditorState {
    constructor(documents, textEditors, activeEditor, visibleEditors) {
        this.documents = documents;
        this.textEditors = textEditors;
        this.activeEditor = activeEditor;
        this.visibleEditors = visibleEditors;
        //
    }
    static delta(before, after) {
        if (!before) {
            return {
                addedDocuments: [...after.documents],
                removedDocuments: [],
                addedEditors: [...after.textEditors.values()],
                removedEditors: [],
                visibleEditors: [...after.visibleEditors].map(editor => editor[0])
            };
        }
        const documentDelta = (0, collections_1.diffSets)(before.documents, after.documents);
        const editorDelta = (0, collections_1.diffMaps)(before.textEditors, after.textEditors);
        const newActiveEditor = before.activeEditor !== after.activeEditor ? after.activeEditor : undefined;
        const visibleEditorDelta = (0, collections_1.diffMaps)(before.visibleEditors, after.visibleEditors);
        return {
            addedDocuments: documentDelta.added,
            removedDocuments: documentDelta.removed.map(e => e.uri.toComponents()),
            addedEditors: editorDelta.added,
            removedEditors: editorDelta.removed.map(removed => removed.id),
            newActiveEditor: newActiveEditor,
            visibleEditors: visibleEditorDelta.added.length === 0 && visibleEditorDelta.removed.length === 0
                ? undefined
                : [...after.visibleEditors].map(editor => editor[0])
        };
    }
}
class NotebooksAndEditorsMain {
    constructor(rpc, container, notebookDocumentsMain, notebookEditorsMain) {
        this.notebookDocumentsMain = notebookDocumentsMain;
        this.notebookEditorsMain = notebookEditorsMain;
        this.disposables = new core_1.DisposableCollection();
        this.editorListeners = new Map();
        this.updateMutex = new async_mutex_1.Mutex();
        this.proxy = rpc.getProxy(common_1.MAIN_RPC_CONTEXT.NOTEBOOKS_EXT);
        this.notebookService = container.get(browser_1.NotebookService);
        this.notebookEditorService = container.get(browser_1.NotebookEditorWidgetService);
        this.WidgetManager = container.get(browser_2.WidgetManager);
        this.notebookService.onDidAddNotebookDocument(async () => this.updateState(), this, this.disposables);
        this.notebookService.onDidRemoveNotebookDocument(async () => this.updateState(), this, this.disposables);
        // this.WidgetManager.onActiveEditorChanged(() => this.updateState(), this, this.disposables);
        this.notebookEditorService.onDidAddNotebookEditor(async (editor) => this.handleEditorAdd(editor), this, this.disposables);
        this.notebookEditorService.onDidRemoveNotebookEditor(async (editor) => this.handleEditorRemove(editor), this, this.disposables);
        this.notebookEditorService.onFocusedEditorChanged(async (editor) => this.updateState(editor), this, this.disposables);
    }
    dispose() {
        this.notebookDocumentsMain.dispose();
        this.notebookEditorsMain.dispose();
        this.disposables.dispose();
        this.editorListeners.forEach(listeners => listeners.forEach(listener => listener.dispose()));
    }
    async handleEditorAdd(editor) {
        const listeners = this.editorListeners.get(editor.id);
        const disposable = editor.onDidChangeModel(() => this.updateState());
        if (listeners) {
            listeners.push(disposable);
        }
        else {
            this.editorListeners.set(editor.id, [disposable]);
        }
        await this.updateState();
    }
    handleEditorRemove(editor) {
        const listeners = this.editorListeners.get(editor.id);
        listeners === null || listeners === void 0 ? void 0 : listeners.forEach(listener => listener.dispose());
        this.editorListeners.delete(editor.id);
        this.updateState();
    }
    async updateState(focusedEditor) {
        await this.updateMutex.runExclusive(async () => this.doUpdateState(focusedEditor));
    }
    async doUpdateState(focusedEditor) {
        const editors = new Map();
        const visibleEditorsMap = new Map();
        for (const editor of this.notebookEditorService.listNotebookEditors()) {
            if (editor.model) {
                editors.set(editor.id, editor);
            }
        }
        const activeNotebookEditor = this.notebookEditorService.currentFocusedEditor;
        let activeEditor = null;
        if (activeNotebookEditor) {
            activeEditor = activeNotebookEditor.id;
        }
        else if (focusedEditor === null || focusedEditor === void 0 ? void 0 : focusedEditor.model) {
            activeEditor = focusedEditor.id;
        }
        if (activeEditor && !editors.has(activeEditor)) {
            activeEditor = null;
        }
        const notebookEditors = this.WidgetManager.getWidgets(browser_1.NotebookEditorWidget.ID);
        for (const notebookEditor of notebookEditors) {
            if ((notebookEditor === null || notebookEditor === void 0 ? void 0 : notebookEditor.model) && editors.has(notebookEditor.id) && notebookEditor.isVisible) {
                visibleEditorsMap.set(notebookEditor.id, notebookEditor);
            }
        }
        const newState = new NotebookAndEditorState(new Set(this.notebookService.listNotebookDocuments()), editors, activeEditor, visibleEditorsMap);
        await this.onDelta(NotebookAndEditorState.delta(this.currentState, newState));
        this.currentState = newState;
    }
    async onDelta(delta) {
        if (NotebooksAndEditorsMain._isDeltaEmpty(delta)) {
            return;
        }
        const dto = {
            removedDocuments: delta.removedDocuments,
            removedEditors: delta.removedEditors,
            newActiveEditor: delta.newActiveEditor,
            visibleEditors: delta.visibleEditors,
            addedDocuments: delta.addedDocuments.map(NotebooksAndEditorsMain.asModelAddData),
            // addedEditors: delta.addedEditors.map(this.asEditorAddData, this),
        };
        // send to extension FIRST
        await this.proxy.$acceptDocumentsAndEditorsDelta(dto);
        // handle internally
        this.notebookEditorsMain.handleEditorsRemoved(delta.removedEditors);
        this.notebookDocumentsMain.handleNotebooksRemoved(delta.removedDocuments);
        this.notebookDocumentsMain.handleNotebooksAdded(delta.addedDocuments);
        this.notebookEditorsMain.handleEditorsAdded(delta.addedEditors);
    }
    static _isDeltaEmpty(delta) {
        if (delta.addedDocuments !== undefined && delta.addedDocuments.length > 0) {
            return false;
        }
        if (delta.removedDocuments !== undefined && delta.removedDocuments.length > 0) {
            return false;
        }
        if (delta.addedEditors !== undefined && delta.addedEditors.length > 0) {
            return false;
        }
        if (delta.removedEditors !== undefined && delta.removedEditors.length > 0) {
            return false;
        }
        if (delta.visibleEditors !== undefined && delta.visibleEditors.length > 0) {
            return false;
        }
        if (delta.newActiveEditor !== undefined) {
            return false;
        }
        return true;
    }
    static asModelAddData(e) {
        return {
            viewType: e.viewType,
            uri: e.uri.toComponents(),
            metadata: e.metadata,
            versionId: 1,
            cells: e.cells.map(notebook_dto_1.NotebookDto.toNotebookCellDto)
        };
    }
}
exports.NotebooksAndEditorsMain = NotebooksAndEditorsMain;
//# sourceMappingURL=notebook-documents-and-editors-main.js.map