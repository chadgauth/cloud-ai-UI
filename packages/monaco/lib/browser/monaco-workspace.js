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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonacoWorkspace = exports.ResourceTextEdit = exports.ResourceFileEdit = exports.WorkspaceTextEdit = exports.WorkspaceFileEdit = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const uri_1 = require("@theia/core/lib/common/uri");
const event_1 = require("@theia/core/lib/common/event");
const browser_1 = require("@theia/filesystem/lib/browser");
const browser_2 = require("@theia/editor/lib/browser");
const monaco_text_model_service_1 = require("./monaco-text-model-service");
const monaco_editor_1 = require("./monaco-editor");
const browser_3 = require("@theia/markers/lib/browser");
const types_1 = require("@theia/core/lib/common/types");
const file_service_1 = require("@theia/filesystem/lib/browser/file-service");
const monaco = require("@theia/monaco-editor-core");
const bulkEditService_1 = require("@theia/monaco-editor-core/esm/vs/editor/browser/services/bulkEditService");
const editorWorker_1 = require("@theia/monaco-editor-core/esm/vs/editor/common/services/editorWorker");
const standaloneServices_1 = require("@theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices");
const snippetParser_1 = require("@theia/monaco-editor-core/esm/vs/editor/contrib/snippet/browser/snippetParser");
const common_1 = require("@theia/core/lib/common");
var WorkspaceFileEdit;
(function (WorkspaceFileEdit) {
    function is(arg) {
        return ('oldResource' in arg && monaco.Uri.isUri(arg.oldResource)) ||
            ('newResource' in arg && monaco.Uri.isUri(arg.newResource));
    }
    WorkspaceFileEdit.is = is;
})(WorkspaceFileEdit = exports.WorkspaceFileEdit || (exports.WorkspaceFileEdit = {}));
var WorkspaceTextEdit;
(function (WorkspaceTextEdit) {
    function is(arg) {
        return (0, common_1.isObject)(arg)
            && monaco.Uri.isUri(arg.resource)
            && (0, common_1.isObject)(arg.textEdit);
    }
    WorkspaceTextEdit.is = is;
})(WorkspaceTextEdit = exports.WorkspaceTextEdit || (exports.WorkspaceTextEdit = {}));
var ResourceFileEdit;
(function (ResourceFileEdit) {
    function is(arg) {
        return (0, common_1.isObject)(arg) && (monaco.Uri.isUri(arg.oldResource) || monaco.Uri.isUri(arg.newResource));
    }
    ResourceFileEdit.is = is;
})(ResourceFileEdit = exports.ResourceFileEdit || (exports.ResourceFileEdit = {}));
var ResourceTextEdit;
(function (ResourceTextEdit) {
    function is(arg) {
        return ('resource' in arg && monaco.Uri.isUri(arg.resource));
    }
    ResourceTextEdit.is = is;
})(ResourceTextEdit = exports.ResourceTextEdit || (exports.ResourceTextEdit = {}));
let MonacoWorkspace = class MonacoWorkspace {
    constructor() {
        this.ready = new Promise(resolve => {
            this.resolveReady = resolve;
        });
        this.onDidOpenTextDocumentEmitter = new event_1.Emitter();
        this.onDidOpenTextDocument = this.onDidOpenTextDocumentEmitter.event;
        this.onDidCloseTextDocumentEmitter = new event_1.Emitter();
        this.onDidCloseTextDocument = this.onDidCloseTextDocumentEmitter.event;
        this.onDidChangeTextDocumentEmitter = new event_1.Emitter();
        this.onDidChangeTextDocument = this.onDidChangeTextDocumentEmitter.event;
        this.onWillSaveTextDocumentEmitter = new event_1.Emitter();
        this.onWillSaveTextDocument = this.onWillSaveTextDocumentEmitter.event;
        this.onDidSaveTextDocumentEmitter = new event_1.Emitter();
        this.onDidSaveTextDocument = this.onDidSaveTextDocumentEmitter.event;
        this.suppressedOpenIfDirty = [];
    }
    init() {
        this.resolveReady();
        for (const model of this.textModelService.models) {
            this.fireDidOpen(model);
        }
        this.textModelService.onDidCreate(model => this.fireDidOpen(model));
    }
    get textDocuments() {
        return this.textModelService.models;
    }
    getTextDocument(uri) {
        return this.textModelService.get(uri);
    }
    fireDidOpen(model) {
        this.doFireDidOpen(model);
        model.textEditorModel.onDidChangeLanguage(e => {
            this.problems.cleanAllMarkers(new uri_1.default(model.uri));
            model.setLanguageId(e.oldLanguage);
            try {
                this.fireDidClose(model);
            }
            finally {
                model.setLanguageId(undefined);
            }
            this.doFireDidOpen(model);
        });
        model.onDidChangeContent(event => this.fireDidChangeContent(event));
        model.onDidSaveModel(() => this.fireDidSave(model));
        model.onWillSaveModel(event => this.fireWillSave(event));
        model.onDirtyChanged(() => this.openEditorIfDirty(model));
        model.onDispose(() => this.fireDidClose(model));
    }
    doFireDidOpen(model) {
        this.onDidOpenTextDocumentEmitter.fire(model);
    }
    fireDidClose(model) {
        this.onDidCloseTextDocumentEmitter.fire(model);
    }
    fireDidChangeContent(event) {
        this.onDidChangeTextDocumentEmitter.fire(event);
    }
    fireWillSave(event) {
        this.onWillSaveTextDocumentEmitter.fire(event);
    }
    fireDidSave(model) {
        this.onDidSaveTextDocumentEmitter.fire(model);
    }
    openEditorIfDirty(model) {
        if (model.suppressOpenEditorWhenDirty || this.suppressedOpenIfDirty.indexOf(model) !== -1) {
            return;
        }
        if (model.dirty && monaco_editor_1.MonacoEditor.findByDocument(this.editorManager, model).length === 0) {
            // create a new reference to make sure the model is not disposed before it is
            // acquired by the editor, thus losing the changes that made it dirty.
            this.textModelService.createModelReference(model.textEditorModel.uri).then(ref => {
                (model.autoSave !== 'off' ? new Promise(resolve => model.onDidSaveModel(resolve)) :
                    this.editorManager.open(new uri_1.default(model.uri), { mode: 'open' })).then(() => ref.dispose());
            });
        }
    }
    async suppressOpenIfDirty(model, cb) {
        this.suppressedOpenIfDirty.push(model);
        try {
            await cb();
        }
        finally {
            const i = this.suppressedOpenIfDirty.indexOf(model);
            if (i !== -1) {
                this.suppressedOpenIfDirty.splice(i, 1);
            }
        }
    }
    /**
     * Applies given edits to the given model.
     * The model is saved if no editors is opened for it.
     */
    applyBackgroundEdit(model, editOperations, shouldSave = true) {
        return this.suppressOpenIfDirty(model, async () => {
            const editor = monaco_editor_1.MonacoEditor.findByDocument(this.editorManager, model)[0];
            const cursorState = editor && editor.getControl().getSelections() || [];
            model.textEditorModel.pushStackElement();
            model.textEditorModel.pushEditOperations(cursorState, editOperations, () => cursorState);
            model.textEditorModel.pushStackElement();
            if (!editor && shouldSave) {
                await model.save();
            }
        });
    }
    async applyBulkEdit(edits, options) {
        try {
            let totalEdits = 0;
            let totalFiles = 0;
            const fileEdits = edits.filter(edit => edit instanceof bulkEditService_1.ResourceFileEdit);
            const [snippetEdits, textEdits] = types_1.ArrayUtils.partition(edits.filter(edit => edit instanceof bulkEditService_1.ResourceTextEdit), edit => { var _a, _b; return edit.textEdit.insertAsSnippet && (edit.resource.toString() === ((_b = (_a = this.editorManager.activeEditor) === null || _a === void 0 ? void 0 : _a.getResourceUri()) === null || _b === void 0 ? void 0 : _b.toString())); });
            if (fileEdits.length > 0) {
                await this.performFileEdits(fileEdits);
            }
            if (textEdits.length > 0) {
                const result = await this.performTextEdits(textEdits);
                totalEdits += result.totalEdits;
                totalFiles += result.totalFiles;
            }
            if (snippetEdits.length > 0) {
                await this.performSnippetEdits(snippetEdits);
            }
            // when enabled (option AND setting) loop over all dirty working copies and trigger save
            // for those that were involved in this bulk edit operation.
            const resources = new Set(edits
                .filter((edit) => edit instanceof bulkEditService_1.ResourceTextEdit)
                .map(edit => edit.resource.toString()));
            if (resources.size > 0 && (options === null || options === void 0 ? void 0 : options.respectAutoSaveConfig) && this.editorPreferences.get('files.refactoring.autoSave') === true) {
                await this.saveAll(resources);
            }
            const ariaSummary = this.getAriaSummary(totalEdits, totalFiles);
            return { ariaSummary, success: true };
        }
        catch (e) {
            console.error('Failed to apply Resource edits:', e);
            return {
                ariaSummary: `Error applying Resource edits: ${e.toString()}`,
                success: false
            };
        }
    }
    async saveAll(resources) {
        await Promise.all(Array.from(resources.values()).map(uri => { var _a; return (_a = this.textModelService.get(uri)) === null || _a === void 0 ? void 0 : _a.save(); }));
    }
    getAriaSummary(totalEdits, totalFiles) {
        if (totalEdits === 0) {
            return common_1.nls.localizeByDefault('Made no edits');
        }
        if (totalEdits > 1 && totalFiles > 1) {
            return common_1.nls.localizeByDefault('Made {0} text edits in {1} files', totalEdits, totalFiles);
        }
        return common_1.nls.localizeByDefault('Made {0} text edits in one file', totalEdits);
    }
    async performTextEdits(edits) {
        let totalEdits = 0;
        let totalFiles = 0;
        const resourceEdits = new Map();
        for (const edit of edits) {
            if (typeof edit.versionId === 'number') {
                const model = this.textModelService.get(edit.resource.toString());
                if (model && model.textEditorModel.getVersionId() !== edit.versionId) {
                    throw new Error(`${model.uri} has changed in the meantime`);
                }
            }
            const key = edit.resource.toString();
            let array = resourceEdits.get(key);
            if (!array) {
                array = [];
                resourceEdits.set(key, array);
            }
            array.push(edit);
        }
        const pending = [];
        for (const [key, value] of resourceEdits) {
            pending.push((async () => {
                var _a;
                const uri = monaco.Uri.parse(key);
                let eol;
                const editOperations = [];
                const minimalEdits = await standaloneServices_1.StandaloneServices.get(editorWorker_1.IEditorWorkerService)
                    .computeMoreMinimalEdits(uri, value.map(edit => this.transformSnippetStringToInsertText(edit)));
                if (minimalEdits) {
                    for (const textEdit of minimalEdits) {
                        if (typeof textEdit.eol === 'number') {
                            eol = textEdit.eol;
                        }
                        if (monaco.Range.isEmpty(textEdit.range) && !textEdit.text) {
                            // skip no-op
                            continue;
                        }
                        editOperations.push({
                            forceMoveMarkers: false,
                            range: monaco.Range.lift(textEdit.range),
                            text: textEdit.text
                        });
                    }
                }
                if (!editOperations.length && eol === undefined) {
                    return;
                }
                const reference = await this.textModelService.createModelReference(uri);
                try {
                    const document = reference.object;
                    const model = document.textEditorModel;
                    const editor = monaco_editor_1.MonacoEditor.findByDocument(this.editorManager, document)[0];
                    const cursorState = (_a = editor === null || editor === void 0 ? void 0 : editor.getControl().getSelections()) !== null && _a !== void 0 ? _a : [];
                    // start a fresh operation
                    model.pushStackElement();
                    if (editOperations.length) {
                        model.pushEditOperations(cursorState, editOperations, () => cursorState);
                    }
                    if (eol !== undefined) {
                        model.pushEOL(eol);
                    }
                    // push again to make this change an undoable operation
                    model.pushStackElement();
                    totalFiles += 1;
                    totalEdits += editOperations.length;
                }
                finally {
                    reference.dispose();
                }
            })());
        }
        await Promise.all(pending);
        return { totalEdits, totalFiles };
    }
    async performFileEdits(edits) {
        for (const edit of edits) {
            const options = edit.options || {};
            if (edit.newResource && edit.oldResource) {
                // rename
                if (options.overwrite === undefined && options.ignoreIfExists && await this.fileService.exists(new uri_1.default(edit.newResource))) {
                    return; // not overwriting, but ignoring, and the target file exists
                }
                await this.fileService.move(new uri_1.default(edit.oldResource), new uri_1.default(edit.newResource), { overwrite: options.overwrite });
            }
            else if (!edit.newResource && edit.oldResource) {
                // delete file
                if (await this.fileService.exists(new uri_1.default(edit.oldResource))) {
                    let useTrash = this.filePreferences['files.enableTrash'];
                    if (useTrash && !(this.fileService.hasCapability(new uri_1.default(edit.oldResource), 4096 /* Trash */))) {
                        useTrash = false; // not supported by provider
                    }
                    await this.fileService.delete(new uri_1.default(edit.oldResource), { useTrash, recursive: options.recursive });
                }
                else if (!options.ignoreIfNotExists) {
                    throw new Error(`${edit.oldResource} does not exist and can not be deleted`);
                }
            }
            else if (edit.newResource && !edit.oldResource) {
                // create file
                if (options.overwrite === undefined && options.ignoreIfExists && await this.fileService.exists(new uri_1.default(edit.newResource))) {
                    return; // not overwriting, but ignoring, and the target file exists
                }
                await this.fileService.create(new uri_1.default(edit.newResource), undefined, { overwrite: options.overwrite });
            }
        }
    }
    async performSnippetEdits(edits) {
        var _a;
        const activeEditor = (_a = monaco_editor_1.MonacoEditor.getActive(this.editorManager)) === null || _a === void 0 ? void 0 : _a.getControl();
        if (activeEditor) {
            const snippetController = activeEditor.getContribution('snippetController2');
            snippetController.apply(edits.map(edit => ({ range: monaco.Range.lift(edit.textEdit.range), template: edit.textEdit.text })));
        }
    }
    transformSnippetStringToInsertText(resourceEdit) {
        if (resourceEdit.textEdit.insertAsSnippet) {
            return { ...resourceEdit.textEdit, insertAsSnippet: false, text: snippetParser_1.SnippetParser.asInsertText(resourceEdit.textEdit.text) };
        }
        else {
            return resourceEdit.textEdit;
        }
    }
};
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], MonacoWorkspace.prototype, "fileService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.FileSystemPreferences),
    __metadata("design:type", Object)
], MonacoWorkspace.prototype, "filePreferences", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.EditorPreferences),
    __metadata("design:type", Object)
], MonacoWorkspace.prototype, "editorPreferences", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_text_model_service_1.MonacoTextModelService),
    __metadata("design:type", monaco_text_model_service_1.MonacoTextModelService)
], MonacoWorkspace.prototype, "textModelService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.EditorManager),
    __metadata("design:type", browser_2.EditorManager)
], MonacoWorkspace.prototype, "editorManager", void 0);
__decorate([
    (0, inversify_1.inject)(browser_3.ProblemManager),
    __metadata("design:type", browser_3.ProblemManager)
], MonacoWorkspace.prototype, "problems", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MonacoWorkspace.prototype, "init", null);
MonacoWorkspace = __decorate([
    (0, inversify_1.injectable)()
], MonacoWorkspace);
exports.MonacoWorkspace = MonacoWorkspace;
//# sourceMappingURL=monaco-workspace.js.map