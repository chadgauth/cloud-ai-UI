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
exports.updateToEdit = exports.CellExecutionStateChangedEvent = exports.CellExecution = exports.NotebookExecutionStateService = exports.NotebookExecutionType = void 0;
const core_1 = require("@theia/core");
const inversify_1 = require("@theia/core/shared/inversify");
const notebook_service_1 = require("./notebook-service");
const common_1 = require("../../common");
const uuid_1 = require("uuid");
var NotebookExecutionType;
(function (NotebookExecutionType) {
    NotebookExecutionType[NotebookExecutionType["cell"] = 0] = "cell";
    NotebookExecutionType[NotebookExecutionType["notebook"] = 1] = "notebook";
})(NotebookExecutionType = exports.NotebookExecutionType || (exports.NotebookExecutionType = {}));
let NotebookExecutionStateService = class NotebookExecutionStateService {
    constructor() {
        this.executions = new Map();
        this.onDidChangeExecutionEmitter = new core_1.Emitter();
        this.onDidChangeExecution = this.onDidChangeExecutionEmitter.event;
        this.onDidChangeLastRunFailStateEmitter = new core_1.Emitter();
        this.onDidChangeLastRunFailState = this.onDidChangeLastRunFailStateEmitter.event;
    }
    createCellExecution(notebookUri, cellHandle) {
        const notebook = this.notebookService.getNotebookEditorModel(notebookUri);
        if (!notebook) {
            throw new Error(`Notebook not found: ${notebookUri.toString()}`);
        }
        let execution = this.executions.get(`${notebookUri}/${cellHandle}`);
        if (!execution) {
            execution = this.createNotebookCellExecution(notebook, cellHandle);
            this.executions.set(`${notebookUri}/${cellHandle}`, execution);
            execution.initialize();
            this.onDidChangeExecutionEmitter.fire(new CellExecutionStateChangedEvent(notebookUri, cellHandle, execution));
        }
        return execution;
    }
    createNotebookCellExecution(notebook, cellHandle) {
        const notebookUri = notebook.uri;
        const execution = new CellExecution(cellHandle, notebook);
        execution.onDidUpdate(() => this.onDidChangeExecutionEmitter.fire(new CellExecutionStateChangedEvent(notebookUri, cellHandle, execution)));
        execution.onDidComplete(lastRunSuccess => this.onCellExecutionDidComplete(notebookUri, cellHandle, execution, lastRunSuccess));
        return execution;
    }
    onCellExecutionDidComplete(notebookUri, cellHandle, exe, lastRunSuccess) {
        const notebookExecutions = this.executions.get(`${notebookUri}/${cellHandle}`);
        if (!notebookExecutions) {
            return;
        }
        exe.dispose();
        this.executions.delete(`${notebookUri}/${cellHandle}`);
        this.onDidChangeExecutionEmitter.fire(new CellExecutionStateChangedEvent(notebookUri, cellHandle));
    }
    getCellExecution(cellUri) {
        const parsed = common_1.CellUri.parse(cellUri);
        if (!parsed) {
            throw new Error(`Not a cell URI: ${cellUri}`);
        }
        return this.executions.get(`${parsed.notebook.toString()}/${parsed.handle}`);
    }
    dispose() {
        this.onDidChangeExecutionEmitter.dispose();
        this.onDidChangeLastRunFailStateEmitter.dispose();
        this.executions.forEach(cellExecution => cellExecution.dispose());
    }
};
__decorate([
    (0, inversify_1.inject)(notebook_service_1.NotebookService),
    __metadata("design:type", notebook_service_1.NotebookService)
], NotebookExecutionStateService.prototype, "notebookService", void 0);
NotebookExecutionStateService = __decorate([
    (0, inversify_1.injectable)()
], NotebookExecutionStateService);
exports.NotebookExecutionStateService = NotebookExecutionStateService;
class CellExecution {
    constructor(cellHandle, notebook) {
        this.cellHandle = cellHandle;
        this.notebook = notebook;
        this.onDidUpdateEmitter = new core_1.Emitter();
        this.onDidUpdate = this.onDidUpdateEmitter.event;
        this.onDidCompleteEmitter = new core_1.Emitter();
        this.onDidComplete = this.onDidCompleteEmitter.event;
        this._state = common_1.NotebookCellExecutionState.Unconfirmed;
        this._didPause = false;
        this._isPaused = false;
        console.debug(`CellExecution#ctor ${this.getCellLog()}`);
    }
    get state() {
        return this._state;
    }
    get notebookURI() {
        return this.notebook.uri;
    }
    get didPause() {
        return this._didPause;
    }
    get isPaused() {
        return this._isPaused;
    }
    initialize() {
        const startExecuteEdit = {
            editType: 9 /* PartialInternalMetadata */,
            handle: this.cellHandle,
            internalMetadata: {
                executionId: (0, uuid_1.v4)(),
                runStartTime: undefined,
                runEndTime: undefined,
                lastRunSuccess: undefined,
                executionOrder: undefined,
                renderDuration: undefined,
            }
        };
        this.applyExecutionEdits([startExecuteEdit]);
    }
    getCellLog() {
        return `${this.notebookURI.toString()}, ${this.cellHandle}`;
    }
    confirm() {
        this._state = common_1.NotebookCellExecutionState.Pending;
        this.onDidUpdateEmitter.fire();
    }
    update(updates) {
        if (updates.some(u => u.editType === common_1.CellExecutionUpdateType.ExecutionState)) {
            this._state = common_1.NotebookCellExecutionState.Executing;
        }
        if (!this._didPause && updates.some(u => u.editType === common_1.CellExecutionUpdateType.ExecutionState && u.didPause)) {
            this._didPause = true;
        }
        const lastIsPausedUpdate = [...updates].reverse().find(u => u.editType === common_1.CellExecutionUpdateType.ExecutionState && typeof u.isPaused === 'boolean');
        if (lastIsPausedUpdate) {
            this._isPaused = lastIsPausedUpdate.isPaused;
        }
        const cellModel = this.notebook.cells.find(c => c.handle === this.cellHandle);
        if (!cellModel) {
            console.debug(`CellExecution#update, updating cell not in notebook: ${this.notebook.uri.toString()}, ${this.cellHandle}`);
        }
        else {
            const edits = updates.map(update => updateToEdit(update, this.cellHandle));
            this.applyExecutionEdits(edits);
        }
        if (updates.some(u => u.editType === common_1.CellExecutionUpdateType.ExecutionState)) {
            this.onDidUpdateEmitter.fire();
        }
    }
    complete(completionData) {
        const cellModel = this.notebook.cells.find(c => c.handle === this.cellHandle);
        if (!cellModel) {
            console.debug(`CellExecution#complete, completing cell not in notebook: ${this.notebook.uri.toString()}, ${this.cellHandle}`);
        }
        else {
            const edit = {
                editType: 9 /* PartialInternalMetadata */,
                handle: this.cellHandle,
                internalMetadata: {
                    lastRunSuccess: completionData.lastRunSuccess,
                    // eslint-disable-next-line no-null/no-null
                    runStartTime: this._didPause ? null : cellModel.internalMetadata.runStartTime,
                    // eslint-disable-next-line no-null/no-null
                    runEndTime: this._didPause ? null : completionData.runEndTime,
                }
            };
            this.applyExecutionEdits([edit]);
        }
        this.onDidCompleteEmitter.fire(completionData.lastRunSuccess);
    }
    dispose() {
        this.onDidUpdateEmitter.dispose();
        this.onDidCompleteEmitter.dispose();
    }
    applyExecutionEdits(edits) {
        this.notebook.applyEdits(edits, false);
    }
}
exports.CellExecution = CellExecution;
class CellExecutionStateChangedEvent {
    constructor(notebook, cellHandle, changed) {
        this.notebook = notebook;
        this.cellHandle = cellHandle;
        this.changed = changed;
        this.type = NotebookExecutionType.cell;
    }
    affectsCell(cell) {
        const parsedUri = common_1.CellUri.parse(cell);
        return !!parsedUri && this.notebook.isEqual(parsedUri.notebook) && this.cellHandle === parsedUri.handle;
    }
    affectsNotebook(notebook) {
        return this.notebook.toString() === notebook.toString();
    }
}
exports.CellExecutionStateChangedEvent = CellExecutionStateChangedEvent;
function updateToEdit(update, cellHandle) {
    if (update.editType === common_1.CellExecutionUpdateType.Output) {
        return {
            editType: 2 /* Output */,
            handle: update.cellHandle,
            append: update.append,
            outputs: update.outputs,
        };
    }
    else if (update.editType === common_1.CellExecutionUpdateType.OutputItems) {
        return {
            editType: 7 /* OutputItems */,
            items: update.items,
            append: update.append,
        };
    }
    else if (update.editType === common_1.CellExecutionUpdateType.ExecutionState) {
        const newInternalMetadata = {};
        if (typeof update.executionOrder !== 'undefined') {
            newInternalMetadata.executionOrder = update.executionOrder;
        }
        if (typeof update.runStartTime !== 'undefined') {
            newInternalMetadata.runStartTime = update.runStartTime;
        }
        return {
            editType: 9 /* PartialInternalMetadata */,
            handle: cellHandle,
            internalMetadata: newInternalMetadata
        };
    }
    throw new Error('Unknown cell update type');
}
exports.updateToEdit = updateToEdit;
//# sourceMappingURL=notebook-execution-state-service.js.map