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
exports.EditorsAndDocumentsMain = void 0;
const plugin_api_rpc_1 = require("../../common/plugin-api-rpc");
const disposable_1 = require("@theia/core/lib/common/disposable");
const text_editor_model_service_1 = require("./text-editor-model-service");
const monaco_editor_1 = require("@theia/monaco/lib/browser/monaco-editor");
const text_editor_main_1 = require("./text-editor-main");
const core_1 = require("@theia/core");
const browser_1 = require("@theia/editor/lib/browser");
class EditorsAndDocumentsMain {
    constructor(rpc, container) {
        this.textEditors = new Map();
        this.onTextEditorAddEmitter = new core_1.Emitter();
        this.onTextEditorRemoveEmitter = new core_1.Emitter();
        this.onDocumentAddEmitter = new core_1.Emitter();
        this.onDocumentRemoveEmitter = new core_1.Emitter();
        this.onTextEditorAdd = this.onTextEditorAddEmitter.event;
        this.onTextEditorRemove = this.onTextEditorRemoveEmitter.event;
        this.onDocumentAdd = this.onDocumentAddEmitter.event;
        this.onDocumentRemove = this.onDocumentRemoveEmitter.event;
        this.toDispose = new core_1.DisposableCollection(disposable_1.Disposable.create(() => this.textEditors.clear()));
        this.proxy = rpc.getProxy(plugin_api_rpc_1.MAIN_RPC_CONTEXT.EDITORS_AND_DOCUMENTS_EXT);
        this.editorService = container.get(browser_1.EditorManager);
        this.modelService = container.get(text_editor_model_service_1.EditorModelService);
        this.stateComputer = new EditorAndDocumentStateComputer(d => this.onDelta(d), this.editorService, this.modelService);
        this.toDispose.push(this.stateComputer);
        this.toDispose.push(this.onTextEditorAddEmitter);
        this.toDispose.push(this.onTextEditorRemoveEmitter);
        this.toDispose.push(this.onDocumentAddEmitter);
        this.toDispose.push(this.onDocumentRemoveEmitter);
    }
    listen() {
        this.stateComputer.listen();
    }
    dispose() {
        this.toDispose.dispose();
    }
    onDelta(delta) {
        const removedEditors = new Array();
        const addedEditors = new Array();
        const removedDocuments = delta.removedDocuments.map(d => d.textEditorModel.uri);
        for (const editor of delta.addedEditors) {
            const textEditorMain = new text_editor_main_1.TextEditorMain(editor.id, editor.editor.getControl().getModel(), editor.editor);
            this.textEditors.set(editor.id, textEditorMain);
            this.toDispose.push(textEditorMain);
            addedEditors.push(textEditorMain);
        }
        for (const { id } of delta.removedEditors) {
            const textEditorMain = this.textEditors.get(id);
            if (textEditorMain) {
                textEditorMain.dispose();
                this.textEditors.delete(id);
                removedEditors.push(id);
            }
        }
        const deltaExt = {};
        let empty = true;
        if (delta.newActiveEditor !== undefined) {
            empty = false;
            deltaExt.newActiveEditor = delta.newActiveEditor;
        }
        if (removedDocuments.length > 0) {
            empty = false;
            deltaExt.removedDocuments = removedDocuments;
        }
        if (removedEditors.length > 0) {
            empty = false;
            deltaExt.removedEditors = removedEditors;
        }
        if (delta.addedDocuments.length > 0) {
            empty = false;
            deltaExt.addedDocuments = delta.addedDocuments.map(d => this.toModelAddData(d));
        }
        if (delta.addedEditors.length > 0) {
            empty = false;
            deltaExt.addedEditors = addedEditors.map(e => this.toTextEditorAddData(e));
        }
        if (!empty) {
            this.proxy.$acceptEditorsAndDocumentsDelta(deltaExt);
            this.onDocumentRemoveEmitter.fire(removedDocuments);
            this.onDocumentAddEmitter.fire(delta.addedDocuments);
            this.onTextEditorRemoveEmitter.fire(removedEditors);
            this.onTextEditorAddEmitter.fire(addedEditors);
        }
    }
    toModelAddData(model) {
        return {
            uri: model.textEditorModel.uri,
            versionId: model.textEditorModel.getVersionId(),
            lines: model.textEditorModel.getLinesContent(),
            languageId: model.getLanguageId(),
            EOL: model.textEditorModel.getEOL(),
            modeId: model.languageId,
            isDirty: model.dirty
        };
    }
    toTextEditorAddData(textEditor) {
        const properties = textEditor.getProperties();
        return {
            id: textEditor.getId(),
            documentUri: textEditor.getModel().uri,
            options: properties.options,
            selections: properties.selections,
            visibleRanges: properties.visibleRanges,
            editorPosition: this.findEditorPosition(textEditor)
        };
    }
    findEditorPosition(editor) {
        return plugin_api_rpc_1.EditorPosition.ONE; // TODO: fix this when Theia has support splitting editors
    }
    getEditor(id) {
        return this.textEditors.get(id);
    }
    saveAll(includeUntitled) {
        return this.modelService.saveAll(includeUntitled);
    }
    hideEditor(id) {
        for (const editorWidget of this.editorService.all) {
            const monacoEditor = monaco_editor_1.MonacoEditor.get(editorWidget);
            if (monacoEditor) {
                if (id === new EditorSnapshot(monacoEditor).id) {
                    editorWidget.close();
                    break;
                }
            }
        }
        return Promise.resolve();
    }
}
exports.EditorsAndDocumentsMain = EditorsAndDocumentsMain;
class EditorAndDocumentStateComputer {
    constructor(callback, editorService, modelService) {
        this.callback = callback;
        this.editorService = editorService;
        this.modelService = modelService;
        this.editors = new Map();
        this.toDispose = new core_1.DisposableCollection(disposable_1.Disposable.create(() => this.currentState = undefined));
    }
    listen() {
        if (this.toDispose.disposed) {
            return;
        }
        this.toDispose.push(this.editorService.onCreated(widget => {
            this.onTextEditorAdd(widget);
            this.update();
        }));
        this.toDispose.push(this.editorService.onCurrentEditorChanged(() => this.update()));
        this.toDispose.push(this.modelService.onModelAdded(this.onModelAdded, this));
        this.toDispose.push(this.modelService.onModelRemoved(() => this.update()));
        for (const widget of this.editorService.all) {
            this.onTextEditorAdd(widget);
        }
        this.update();
    }
    dispose() {
        this.toDispose.dispose();
    }
    onModelAdded(model) {
        if (!this.currentState) {
            this.update();
            return;
        }
        this.currentState = new EditorAndDocumentState(this.currentState.documents.add(model), this.currentState.editors, this.currentState.activeEditor);
        this.callback(new EditorAndDocumentStateDelta([], [model], [], [], undefined, undefined));
    }
    onTextEditorAdd(widget) {
        const editor = monaco_editor_1.MonacoEditor.get(widget);
        if (!editor) {
            return;
        }
        const id = editor.getControl().getId();
        const toDispose = new core_1.DisposableCollection(editor.onDispose(() => this.onTextEditorRemove(editor)), disposable_1.Disposable.create(() => this.editors.delete(id)));
        this.editors.set(id, toDispose);
        this.toDispose.push(toDispose);
    }
    onTextEditorRemove(e) {
        const toDispose = this.editors.get(e.getControl().getId());
        if (toDispose) {
            toDispose.dispose();
            this.update();
        }
    }
    update() {
        const models = new Set();
        for (const model of this.modelService.getModels()) {
            models.add(model);
        }
        let activeId = null;
        const activeEditor = monaco_editor_1.MonacoEditor.getCurrent(this.editorService);
        const editors = new Map();
        for (const widget of this.editorService.all) {
            const editor = monaco_editor_1.MonacoEditor.get(widget);
            // VS Code tracks only visible widgets
            if (!editor || !widget.isVisible) {
                continue;
            }
            const model = editor.getControl().getModel();
            if (model && !model.isDisposed()) {
                const editorSnapshot = new EditorSnapshot(editor);
                editors.set(editorSnapshot.id, editorSnapshot);
                if (activeEditor === editor) {
                    activeId = editorSnapshot.id;
                }
            }
        }
        const newState = new EditorAndDocumentState(models, editors, activeId);
        const delta = EditorAndDocumentState.compute(this.currentState, newState);
        if (!delta.isEmpty) {
            this.currentState = newState;
            this.callback(delta);
        }
    }
}
class EditorAndDocumentStateDelta {
    constructor(removedDocuments, addedDocuments, removedEditors, addedEditors, oldActiveEditor, newActiveEditor) {
        this.removedDocuments = removedDocuments;
        this.addedDocuments = addedDocuments;
        this.removedEditors = removedEditors;
        this.addedEditors = addedEditors;
        this.oldActiveEditor = oldActiveEditor;
        this.newActiveEditor = newActiveEditor;
        this.isEmpty = this.removedDocuments.length === 0
            && this.addedDocuments.length === 0
            && this.addedEditors.length === 0
            && this.removedEditors.length === 0
            && this.newActiveEditor === this.oldActiveEditor;
    }
}
class EditorAndDocumentState {
    constructor(documents, editors, activeEditor) {
        this.documents = documents;
        this.editors = editors;
        this.activeEditor = activeEditor;
    }
    static compute(before, after) {
        if (!before) {
            return new EditorAndDocumentStateDelta([], Array.from(after.documents), [], Array.from(after.editors.values()), undefined, after.activeEditor);
        }
        const documentDelta = Delta.ofSets(before.documents, after.documents);
        const editorDelta = Delta.ofMaps(before.editors, after.editors);
        const oldActiveEditor = before.activeEditor !== after.activeEditor ? before.activeEditor : undefined;
        const newActiveEditor = before.activeEditor !== after.activeEditor ? after.activeEditor : undefined;
        return new EditorAndDocumentStateDelta(documentDelta.removed, documentDelta.added, editorDelta.removed, editorDelta.added, oldActiveEditor, newActiveEditor);
    }
}
class EditorSnapshot {
    constructor(editor) {
        this.editor = editor;
        this.id = `${editor.getControl().getId()},${editor.getControl().getModel().id}`;
    }
}
var Delta;
(function (Delta) {
    function ofSets(before, after) {
        const removed = [];
        const added = [];
        before.forEach(element => {
            if (!after.has(element)) {
                removed.push(element);
            }
        });
        after.forEach(element => {
            if (!before.has(element)) {
                added.push(element);
            }
        });
        return { removed, added };
    }
    Delta.ofSets = ofSets;
    function ofMaps(before, after) {
        const removed = [];
        const added = [];
        before.forEach((value, index) => {
            if (!after.has(index)) {
                removed.push(value);
            }
        });
        after.forEach((value, index) => {
            if (!before.has(index)) {
                added.push(value);
            }
        });
        return { removed, added };
    }
    Delta.ofMaps = ofMaps;
})(Delta || (Delta = {}));
//# sourceMappingURL=editors-and-documents-main.js.map