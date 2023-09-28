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
exports.NotebookDocument = exports.Cell = void 0;
const notebookCommon = require("@theia/notebook/lib/common");
const core_1 = require("@theia/core");
const typeConverters = require("../type-converters");
const types_impl_1 = require("../types-impl");
class RawContentChangeEvent {
    constructor(start, deletedCount, deletedItems, items) {
        this.start = start;
        this.deletedCount = deletedCount;
        this.deletedItems = deletedItems;
        this.items = items;
    }
    asApiEvent() {
        return {
            range: new types_impl_1.NotebookRange(this.start, this.start + this.deletedCount),
            addedCells: this.items.map(cell => cell.apiCell),
            removedCells: this.deletedItems,
        };
    }
}
class Cell {
    constructor(notebookDocument, editorsAndDocuments, cellData) {
        var _a, _b, _c;
        this.notebookDocument = notebookDocument;
        this.editorsAndDocuments = editorsAndDocuments;
        this.cellData = cellData;
        this.handle = cellData.handle;
        this.uri = core_1.URI.fromComponents(cellData.uri);
        this.cellKind = cellData.cellKind;
        this.outputs = cellData.outputs.map(typeConverters.NotebookCellOutputConverter.to);
        this.internalMetadata = (_a = cellData.internalMetadata) !== null && _a !== void 0 ? _a : {};
        this.metadata = Object.freeze((_b = cellData.metadata) !== null && _b !== void 0 ? _b : {});
        this.previousResult = Object.freeze(typeConverters.NotebookCellExecutionSummary.to((_c = cellData.internalMetadata) !== null && _c !== void 0 ? _c : {}));
    }
    static asModelAddData(notebook, cell) {
        return {
            EOL: cell.eol,
            lines: cell.source,
            languageId: cell.language,
            uri: cell.uri,
            isDirty: false,
            versionId: 1,
            notebook,
            modeId: ''
        };
    }
    get language() {
        return this.apiCell.document.languageId;
    }
    get apiCell() {
        if (!this.cell) {
            const that = this;
            const data = this.editorsAndDocuments.getDocument(this.uri.toString());
            if (!data) {
                throw new Error(`MISSING extHostDocument for notebook cell: ${this.uri}`);
            }
            const apiCell = {
                get index() { return that.notebookDocument.getCellIndex(that); },
                notebook: that.notebookDocument.apiNotebook,
                kind: typeConverters.NotebookCellKind.to(this.cellData.cellKind),
                document: data.document,
                get outputs() { return that.outputs.slice(0); },
                get metadata() { return that.metadata; },
                get executionSummary() { return that.previousResult; }
            };
            this.cell = Object.freeze(apiCell);
        }
        return this.cell;
    }
    setOutputs(newOutputs) {
        this.outputs = newOutputs.map(typeConverters.NotebookCellOutputConverter.to);
    }
    // setOutputItems(outputId: string, append: boolean, newOutputItems: NotebookOutputItemDto[]): void {
    //     const newItems = newOutputItems.map(typeConverters.NotebookCellOutputItem.to);
    //     const output = this.outputs.find(op => op.id === outputId);
    //     if (output) {
    //         if (!append) {
    //             output.items.length = 0;
    //         }
    //         output.items.push(...newItems);
    //         // if (output.items.length > 1 && output.items.every(item => notebookCommon.isTextStreamMime(item.mime))) {
    //         //     // Look for the mimes in the items, and keep track of their order.
    //         //     // Merge the streams into one output item, per mime type.
    //         //     const mimeOutputs = new Map<string, Uint8Array[]>();
    //         //     const mimeTypes: string[] = [];
    //         //     output.items.forEach(item => {
    //         //         let items: Uint8Array[];
    //         //         if (mimeOutputs.has(item.mime)) {
    //         //             items = mimeOutputs.get(item.mime)!;
    //         //         } else {
    //         //             items = [];
    //         //             mimeOutputs.set(item.mime, items);
    //         //             mimeTypes.push(item.mime);
    //         //         }
    //         //         items.push(item.data);
    //         //     });
    //         //     output.items.length = 0;
    //         //     mimeTypes.forEach(mime => {
    //         //         const compressed = notebookCommon.compressOutputItemStreams(mimeOutputs.get(mime)!);
    //         //         output.items.push({
    //         //             mime,
    //         //             data: compressed.buffer
    //         //         });
    //         //     });
    //         // }
    //     }
    // }
    setMetadata(newMetadata) {
        this.metadata = Object.freeze(newMetadata);
    }
    setInternalMetadata(newInternalMetadata) {
        this.internalMetadata = newInternalMetadata;
        this.previousResult = Object.freeze(typeConverters.NotebookCellExecutionSummary.to(newInternalMetadata));
    }
}
exports.Cell = Cell;
class NotebookDocument {
    constructor(proxy, editorsAndDocuments, textDocuments, uri, notebookData) {
        var _a;
        this.proxy = proxy;
        this.editorsAndDocuments = editorsAndDocuments;
        this.textDocuments = textDocuments;
        this.uri = uri;
        this.versionId = 0;
        this.isDirty = false;
        this.disposed = false;
        this.notebookType = notebookData.viewType;
        this.metadata = (_a = notebookData.metadata) !== null && _a !== void 0 ? _a : {};
        this.versionId = notebookData.versionId;
        this.cells = notebookData.cells.map(cell => new Cell(this, editorsAndDocuments, cell));
    }
    get apiNotebook() {
        if (!this.notebook) {
            const that = this;
            const apiObject = {
                get uri() { return that.uri; },
                get version() { return that.versionId; },
                get notebookType() { return that.notebookType; },
                get isDirty() { return that.isDirty; },
                get isUntitled() { return that.uri.scheme === 'untitled'; },
                get isClosed() { return that.disposed; },
                get metadata() { return that.metadata; },
                get cellCount() { return that.cells.length; },
                cellAt(index) {
                    index = that.validateIndex(index);
                    return that.cells[index].apiCell;
                },
                getCells(range) {
                    const cells = range ? that.getCells(range) : that.cells;
                    return cells.map(cell => cell.apiCell);
                },
                save() {
                    return that.save();
                }
            };
            this.notebook = Object.freeze(apiObject);
        }
        return this.notebook;
    }
    validateIndex(index) {
        index = index | 0;
        if (index < 0) {
            return 0;
        }
        else if (index >= this.cells.length) {
            return this.cells.length - 1;
        }
        else {
            return index;
        }
    }
    validateRange(range) {
        let start = range.start | 0;
        let end = range.end | 0;
        if (start < 0) {
            start = 0;
        }
        if (end > this.cells.length) {
            end = this.cells.length;
        }
        return range.with({ start, end });
    }
    getCells(range) {
        range = this.validateRange(range);
        const result = [];
        for (let i = range.start; i < range.end; i++) {
            result.push(this.cells[i]);
        }
        return result;
    }
    async save() {
        if (this.disposed) {
            return Promise.reject(new Error('Notebook has been closed'));
        }
        return this.proxy.$trySaveNotebook(this.uri);
    }
    acceptDirty(isDirty) {
        this.isDirty = isDirty;
    }
    acceptModelChanged(event, isDirty, newMetadata) {
        this.versionId = event.versionId;
        this.isDirty = isDirty;
        // this.acceptDocumentPropertiesChanged({ metadata: newMetadata });
        const result = {
            notebook: this.apiNotebook,
            metadata: newMetadata,
            cellChanges: [],
            contentChanges: [],
        };
        const relaxedCellChanges = [];
        // -- apply change and populate content changes
        for (const rawEvent of event.rawEvents) {
            if (rawEvent.kind === notebookCommon.NotebookCellsChangeType.ModelChange) {
                this.spliceNotebookCells(rawEvent.changes, false, result.contentChanges);
            }
            else if (rawEvent.kind === notebookCommon.NotebookCellsChangeType.Move) {
                this.moveCells(rawEvent.index, rawEvent.length, rawEvent.newIdx, result.contentChanges);
            }
            else if (rawEvent.kind === notebookCommon.NotebookCellsChangeType.Output) {
                this.setCellOutputs(rawEvent.index, rawEvent.outputs);
                relaxedCellChanges.push({ cell: this.cells[rawEvent.index].apiCell, outputs: this.cells[rawEvent.index].apiCell.outputs });
                // } else if (rawEvent.kind === notebookCommon.NotebookCellsChangeType.OutputItem) {
                //     this._setCellOutputItems(rawEvent.index, rawEvent.outputId, rawEvent.append, rawEvent.outputItems);
                //     relaxedCellChanges.push({ cell: this.cells[rawEvent.index].apiCell, outputs: this.cells[rawEvent.index].apiCell.outputs });
            }
            else if (rawEvent.kind === notebookCommon.NotebookCellsChangeType.ChangeCellLanguage) {
                this.changeCellLanguage(rawEvent.index, rawEvent.language);
                relaxedCellChanges.push({ cell: this.cells[rawEvent.index].apiCell, document: this.cells[rawEvent.index].apiCell.document });
            }
            else if (rawEvent.kind === notebookCommon.NotebookCellsChangeType.ChangeCellContent) {
                relaxedCellChanges.push({ cell: this.cells[rawEvent.index].apiCell, document: this.cells[rawEvent.index].apiCell.document });
                // } else if (rawEvent.kind === notebookCommon.NotebookCellsChangeType.ChangeCellMime) {
                //     this._changeCellMime(rawEvent.index, rawEvent.mime);
            }
            else if (rawEvent.kind === notebookCommon.NotebookCellsChangeType.ChangeCellMetadata) {
                this.changeCellMetadata(rawEvent.index, rawEvent.metadata);
                relaxedCellChanges.push({ cell: this.cells[rawEvent.index].apiCell, metadata: this.cells[rawEvent.index].apiCell.metadata });
            }
            else if (rawEvent.kind === notebookCommon.NotebookCellsChangeType.ChangeCellInternalMetadata) {
                this.changeCellInternalMetadata(rawEvent.index, rawEvent.internalMetadata);
                relaxedCellChanges.push({ cell: this.cells[rawEvent.index].apiCell, executionSummary: this.cells[rawEvent.index].apiCell.executionSummary });
            }
        }
        // -- compact cellChanges
        const map = new Map();
        for (let i = 0; i < relaxedCellChanges.length; i++) {
            const relaxedCellChange = relaxedCellChanges[i];
            const existing = map.get(relaxedCellChange.cell);
            if (existing === undefined) {
                const newLen = result.cellChanges.push({
                    document: undefined,
                    executionSummary: undefined,
                    metadata: undefined,
                    outputs: undefined,
                    ...relaxedCellChange,
                });
                map.set(relaxedCellChange.cell, newLen - 1);
            }
            else {
                result.cellChanges[existing] = {
                    ...result.cellChanges[existing],
                    ...relaxedCellChange
                };
            }
        }
        // Freeze event properties so handlers cannot accidentally modify them
        Object.freeze(result);
        Object.freeze(result.cellChanges);
        Object.freeze(result.contentChanges);
        return result;
    }
    spliceNotebookCells(splices, initialization, bucket) {
        if (this.disposed) {
            return;
        }
        const contentChangeEvents = [];
        const addedCellDocuments = [];
        const removedCellDocuments = [];
        splices.reverse().forEach(splice => {
            const cellDtos = splice[2];
            const newCells = cellDtos.map((cell) => {
                const extCell = new Cell(this, this.editorsAndDocuments, cell);
                if (!initialization) {
                    addedCellDocuments.push(Cell.asModelAddData(this.apiNotebook, cell));
                }
                return extCell;
            });
            const changeEvent = new RawContentChangeEvent(splice[0], splice[1], [], newCells);
            const deletedItems = this.cells.splice(splice[0], splice[1], ...newCells);
            for (const cell of deletedItems) {
                removedCellDocuments.push(cell.uri.toComponents());
                changeEvent.deletedItems.push(cell.apiCell);
            }
            contentChangeEvents.push(changeEvent);
        });
        if (bucket) {
            for (const changeEvent of contentChangeEvents) {
                bucket.push(changeEvent.asApiEvent());
            }
        }
    }
    moveCells(index, length, newIdx, bucket) {
        const cells = this.cells.splice(index, length);
        this.cells.splice(newIdx, 0, ...cells);
        const changes = [
            new RawContentChangeEvent(index, length, cells.map(c => c.apiCell), []),
            new RawContentChangeEvent(newIdx, 0, [], cells)
        ];
        for (const change of changes) {
            bucket.push(change.asApiEvent());
        }
    }
    setCellOutputs(index, outputs) {
        const cell = this.cells[index];
        cell.setOutputs(outputs);
    }
    // private _setCellOutputItems(index: number, outputId: string, append: boolean, outputItems: NotebookOutputItemDto[]): void {
    //     const cell = this.cells[index];
    //     cell.setOutputItems(outputId, append, outputItems);
    // }
    changeCellLanguage(index, newLanguageId) {
        const cell = this.cells[index];
        if (cell.apiCell.document.languageId !== newLanguageId) {
            this.textDocuments.$acceptModelModeChanged(cell.uri.toComponents(), cell.language, newLanguageId);
        }
    }
    changeCellMetadata(index, newMetadata) {
        const cell = this.cells[index];
        cell.setMetadata(newMetadata);
    }
    changeCellInternalMetadata(index, newInternalMetadata) {
        const cell = this.cells[index];
        cell.setInternalMetadata(newInternalMetadata);
    }
    getCellFromApiCell(apiCell) {
        return this.cells.find(cell => cell.apiCell === apiCell);
    }
    getCell(cellHandle) {
        return this.cells.find(cell => cell.handle === cellHandle);
    }
    getCellFromIndex(index) {
        return this.cells[index];
    }
    getCellIndex(cell) {
        return this.cells.indexOf(cell);
    }
    dispose() {
        this.disposed = true;
    }
}
exports.NotebookDocument = NotebookDocument;
//# sourceMappingURL=notebook-document.js.map