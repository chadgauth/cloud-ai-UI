"use strict";
// *****************************************************************************
// Copyright (C) 20023 Typefox and others.
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotebookModel = exports.createNotebookModelContainer = exports.NotebookModelFactory = void 0;
const core_1 = require("@theia/core");
const common_1 = require("../../common");
const file_service_1 = require("@theia/filesystem/lib/browser/file-service");
const notebook_cell_model_1 = require("./notebook-cell-model");
const monaco_text_model_service_1 = require("@theia/monaco/lib/browser/monaco-text-model-service");
const inversify_1 = require("@theia/core/shared/inversify");
const undo_redo_service_1 = require("@theia/editor/lib/browser/undo-redo-service");
exports.NotebookModelFactory = Symbol('NotebookModelFactory');
function createNotebookModelContainer(parent, props) {
    const child = parent.createChild();
    child.bind(NotebookModelProps).toConstantValue(props);
    child.bind(NotebookModel).toSelf();
    return child;
}
exports.createNotebookModelContainer = createNotebookModelContainer;
const NotebookModelProps = Symbol('NotebookModelProps');
let NotebookModel = class NotebookModel {
    constructor(props, modelService, cellModelFactory) {
        this.props = props;
        this.cellModelFactory = cellModelFactory;
        this.onDirtyChangedEmitter = new core_1.Emitter();
        this.onDirtyChanged = this.onDirtyChangedEmitter.event;
        this.onDidSaveNotebookEmitter = new core_1.Emitter();
        this.onDidSaveNotebook = this.onDidSaveNotebookEmitter.event;
        this.onDidAddOrRemoveCellEmitter = new core_1.Emitter();
        this.onDidAddOrRemoveCell = this.onDidAddOrRemoveCellEmitter.event;
        this.onDidChangeContentEmitter = new core_1.Emitter();
        this.onDidChangeContent = this.onDidChangeContentEmitter.event;
        this.nextHandle = 0;
        this.dirtyCells = [];
        this.metadata = {};
        this.dirty = false;
        this.cells = props.data.cells.map((cell, index) => cellModelFactory({
            uri: common_1.CellUri.generate(props.uri, index),
            handle: index,
            source: cell.source,
            language: cell.language,
            cellKind: cell.cellKind,
            outputs: cell.outputs,
            metadata: cell.metadata,
            internalMetadata: cell.internalMetadata,
            collapseState: cell.collapseState
        }));
        this.addCellOutputListeners(this.cells);
        this.metadata = this.metadata;
        modelService.onDidCreate(editorModel => {
            const modelUri = new core_1.URI(editorModel.uri);
            if (modelUri.scheme === common_1.CellUri.scheme) {
                const cellUri = common_1.CellUri.parse(modelUri);
                if (cellUri && cellUri.notebook.isEqual(this.uri)) {
                    const cell = this.cells.find(c => c.handle === cellUri.handle);
                    if (cell) {
                        cell.textModel = editorModel;
                    }
                }
            }
        });
        this.nextHandle = this.cells.length;
    }
    get uri() {
        return this.props.uri;
    }
    get viewType() {
        return this.props.viewType;
    }
    dispose() {
        this.onDirtyChangedEmitter.dispose();
        this.onDidSaveNotebookEmitter.dispose();
        this.onDidAddOrRemoveCellEmitter.dispose();
        this.onDidChangeContentEmitter.dispose();
        this.cells.forEach(cell => cell.dispose());
    }
    async save(options) {
        this.dirtyCells = [];
        this.dirty = false;
        this.onDirtyChangedEmitter.fire();
        const serializedNotebook = await this.props.serializer.notebookToData({
            cells: this.cells.map(cell => cell.getData()),
            metadata: this.metadata
        });
        this.fileService.writeFile(this.uri, serializedNotebook);
        this.onDidSaveNotebookEmitter.fire();
    }
    createSnapshot() {
        const model = this;
        return {
            read() {
                return JSON.stringify({
                    cells: model.cells.map(cell => cell.getData()),
                    metadata: model.metadata
                });
            }
        };
    }
    async revert(options) {
        this.dirty = false;
        this.onDirtyChangedEmitter.fire();
    }
    isDirty() {
        return this.dirty;
    }
    cellDirtyChanged(cell, dirtyState) {
        if (dirtyState) {
            this.dirtyCells.push(cell);
        }
        else {
            this.dirtyCells.splice(this.dirtyCells.indexOf(cell), 1);
        }
        const oldDirtyState = this.dirty;
        this.dirty = this.dirtyCells.length > 0;
        if (this.dirty !== oldDirtyState) {
            this.onDirtyChangedEmitter.fire();
        }
    }
    undo() {
        // TODO we probably need to check if a monaco editor is focused and if so, not undo
        this.undoRedoService.undo(this.uri);
    }
    redo() {
        // TODO see undo
        this.undoRedoService.redo(this.uri);
    }
    setSelectedCell(cell) {
        this.selectedCell = cell;
    }
    addCellOutputListeners(cells) {
        for (const cell of cells) {
            cell.onDidChangeOutputs(() => {
                this.dirty = true;
                this.onDirtyChangedEmitter.fire();
            });
        }
    }
    applyEdits(rawEdits, computeUndoRedo) {
        const editsWithDetails = rawEdits.map((edit, index) => {
            let cellIndex = -1;
            if ('index' in edit) {
                cellIndex = edit.index;
            }
            else if ('handle' in edit) {
                cellIndex = this.getCellIndexByHandle(edit.handle);
            }
            return {
                edit,
                cellIndex,
                end: edit.editType === 1 /* Replace */ ? edit.index + edit.count : cellIndex,
                originalIndex: index
            };
        }).filter(edit => !!edit);
        for (const { edit, cellIndex } of editsWithDetails) {
            const cell = this.cells[cellIndex];
            if (cell) {
                this.cellDirtyChanged(cell, true);
            }
            switch (edit.editType) {
                case 1 /* Replace */:
                    this.replaceCells(edit.index, edit.count, edit.cells, computeUndoRedo);
                    break;
                case 2 /* Output */: {
                    if (edit.append) {
                        cell.spliceNotebookCellOutputs({ deleteCount: 0, newOutputs: edit.outputs, start: cell.outputs.length });
                    }
                    else {
                        // could definitely be more efficient. See vscode __spliceNotebookCellOutputs2
                        // For now, just replace the whole existing output with the new output
                        cell.spliceNotebookCellOutputs({ start: 0, deleteCount: cell.outputs.length, newOutputs: edit.outputs });
                    }
                    break;
                }
                case 7 /* OutputItems */:
                    break;
                case 3 /* Metadata */:
                    this.updateNotebookMetadata(edit.metadata, computeUndoRedo);
                    break;
                case 9 /* PartialInternalMetadata */:
                    this.changeCellInternalMetadataPartial(this.cells[cellIndex], edit.internalMetadata);
                    break;
                case 4 /* CellLanguage */:
                    this.changeCellLanguage(this.cells[cellIndex], edit.language, computeUndoRedo);
                    break;
                case 5 /* DocumentMetadata */:
                    break;
                case 6 /* Move */:
                    this.moveCellToIndex(cellIndex, edit.length, edit.newIdx, computeUndoRedo);
                    break;
            }
        }
    }
    replaceCells(start, deleteCount, newCells, computeUndoRedo) {
        const cells = newCells.map(cell => {
            const handle = this.nextHandle++;
            return this.cellModelFactory({
                uri: common_1.CellUri.generate(this.uri, handle),
                handle: handle,
                source: cell.source,
                language: cell.language,
                cellKind: cell.cellKind,
                outputs: cell.outputs,
                metadata: cell.metadata,
                internalMetadata: cell.internalMetadata,
                collapseState: cell.collapseState
            });
        });
        this.addCellOutputListeners(cells);
        const changes = [[start, deleteCount, cells]];
        const deletedCells = this.cells.splice(start, deleteCount, ...cells);
        for (const cell of deletedCells) {
            cell.dispose();
        }
        if (computeUndoRedo) {
            this.undoRedoService.pushElement(this.uri, async () => this.replaceCells(start, newCells.length, deletedCells.map(cell => cell.getData()), false), async () => this.replaceCells(start, deleteCount, newCells, false));
        }
        this.onDidAddOrRemoveCellEmitter.fire({ rawEvent: { kind: common_1.NotebookCellsChangeType.ModelChange, changes } });
        this.onDidChangeContentEmitter.fire({ rawEvents: [{ kind: common_1.NotebookCellsChangeType.ModelChange, changes }] });
    }
    changeCellInternalMetadataPartial(cell, internalMetadata) {
        var _a;
        const newInternalMetadata = {
            ...cell.internalMetadata
        };
        let k;
        // eslint-disable-next-line guard-for-in
        for (k in internalMetadata) {
            newInternalMetadata[k] = ((_a = internalMetadata[k]) !== null && _a !== void 0 ? _a : undefined);
        }
        cell.internalMetadata = newInternalMetadata;
        this.onDidChangeContentEmitter.fire({
            rawEvents: [
                { kind: common_1.NotebookCellsChangeType.ChangeCellInternalMetadata, index: this.cells.indexOf(cell), internalMetadata: newInternalMetadata }
            ]
        });
    }
    updateNotebookMetadata(metadata, computeUndoRedo) {
        const oldMetadata = this.metadata;
        if (computeUndoRedo) {
            this.undoRedoService.pushElement(this.uri, async () => this.updateNotebookMetadata(oldMetadata, false), async () => this.updateNotebookMetadata(metadata, false));
        }
        this.metadata = metadata;
        this.onDidChangeContentEmitter.fire({
            rawEvents: [{ kind: common_1.NotebookCellsChangeType.ChangeDocumentMetadata, metadata: this.metadata }],
            synchronous: true,
        });
    }
    changeCellLanguage(cell, languageId, computeUndoRedo) {
        if (cell.language === languageId) {
            return;
        }
        cell.language = languageId;
        this.onDidChangeContentEmitter.fire({
            rawEvents: [{ kind: common_1.NotebookCellsChangeType.ChangeCellLanguage, index: this.cells.indexOf(cell), language: languageId }],
            synchronous: true,
        });
    }
    moveCellToIndex(fromIndex, length, toIndex, computeUndoRedo) {
        if (computeUndoRedo) {
            this.undoRedoService.pushElement(this.uri, async () => { this.moveCellToIndex(toIndex, length, fromIndex, false); }, async () => { this.moveCellToIndex(fromIndex, length, toIndex, false); });
        }
        const cells = this.cells.splice(fromIndex, length);
        this.cells.splice(toIndex, 0, ...cells);
        this.onDidChangeContentEmitter.fire({
            rawEvents: [{ kind: common_1.NotebookCellsChangeType.Move, index: fromIndex, length, newIdx: toIndex, cells }],
        });
        return true;
    }
    getCellIndexByHandle(handle) {
        return this.cells.findIndex(c => c.handle === handle);
    }
};
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], NotebookModel.prototype, "fileService", void 0);
__decorate([
    (0, inversify_1.inject)(undo_redo_service_1.UndoRedoService),
    __metadata("design:type", undo_redo_service_1.UndoRedoService)
], NotebookModel.prototype, "undoRedoService", void 0);
NotebookModel = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(NotebookModelProps)),
    __param(1, (0, inversify_1.inject)(monaco_text_model_service_1.MonacoTextModelService)),
    __param(2, (0, inversify_1.inject)(notebook_cell_model_1.NotebookCellModelFactory)),
    __metadata("design:paramtypes", [Object, monaco_text_model_service_1.MonacoTextModelService, Function])
], NotebookModel);
exports.NotebookModel = NotebookModel;
//# sourceMappingURL=notebook-model.js.map