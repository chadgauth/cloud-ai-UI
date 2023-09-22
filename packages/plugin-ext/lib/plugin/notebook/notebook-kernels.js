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
exports.createKernelId = exports.NotebookKernelsExtImpl = void 0;
const common_1 = require("../../common");
const core_1 = require("@theia/core");
const type_converters_1 = require("../type-converters");
const promise_util_1 = require("@theia/core/lib/common/promise-util");
const common_2 = require("@theia/notebook/lib/common");
const types_impl_1 = require("../types-impl");
class NotebookKernelsExtImpl {
    constructor(rpc, notebooks, commands) {
        this.notebooks = notebooks;
        this.commands = commands;
        this.activeExecutions = new Map();
        this.kernelData = new Map();
        this.kernelDetectionTasks = new Map();
        this.currentKernelDetectionTaskHandle = 0;
        this.kernelSourceActionProviders = new Map();
        this.currentSourceActionProviderHandle = 0;
        this.onDidChangeCellExecutionStateEmitter = new core_1.Emitter();
        this.onDidChangeNotebookCellExecutionState = this.onDidChangeCellExecutionStateEmitter.event;
        this.currentHandle = 0;
        this.proxy = rpc.getProxy(common_1.PLUGIN_RPC_CONTEXT.NOTEBOOK_KERNELS_MAIN);
    }
    createNotebookController(extensionId, id, viewType, label, handler, rendererScripts) {
        for (const kernelData of this.kernelData.values()) {
            if (kernelData.controller.id === id && extensionId === kernelData.extensionId) {
                throw new Error(`notebook controller with id '${id}' ALREADY exist`);
            }
        }
        const handle = this.currentHandle++;
        const that = this;
        console.debug(`NotebookController[${handle}], CREATED by ${extensionId}, ${id}`);
        const defaultExecuteHandler = () => console.warn(`NO execute handler from notebook controller '${data.id}' of extension: '${extensionId}'`);
        let isDisposed = false;
        const commandDisposables = new core_1.DisposableCollection();
        const onDidChangeSelection = new core_1.Emitter();
        const onDidReceiveMessage = new core_1.Emitter();
        const data = {
            id: createKernelId(extensionId, id),
            notebookType: viewType,
            extensionId: extensionId,
            label: label || extensionId,
        };
        //
        let executeHandler = handler !== null && handler !== void 0 ? handler : defaultExecuteHandler;
        let interruptHandler;
        this.proxy.$addKernel(handle, data).catch(err => {
            // this can happen when a kernel with that ID is already registered
            console.log(err);
            isDisposed = true;
        });
        // update: all setters write directly into the dto object
        // and trigger an update. the actual update will only happen
        // once per event loop execution
        let tokenPool = 0;
        const update = () => {
            if (isDisposed) {
                return;
            }
            const myToken = ++tokenPool;
            Promise.resolve().then(() => {
                if (myToken === tokenPool) {
                    this.proxy.$updateKernel(handle, data);
                }
            });
        };
        // notebook documents that are associated to this controller
        const associatedNotebooks = new Map();
        const controller = {
            get id() { return id; },
            get notebookType() { return data.notebookType; },
            onDidChangeSelectedNotebooks: onDidChangeSelection.event,
            onDidReceiveMessage: onDidReceiveMessage.event,
            get label() {
                return data.label;
            },
            set label(value) {
                data.label = value !== null && value !== void 0 ? value : extensionId;
                update();
            },
            get detail() {
                var _a;
                return (_a = data.detail) !== null && _a !== void 0 ? _a : '';
            },
            set detail(value) {
                data.detail = value;
                update();
            },
            get description() {
                var _a;
                return (_a = data.description) !== null && _a !== void 0 ? _a : '';
            },
            set description(value) {
                data.description = value;
                update();
            },
            get supportedLanguages() {
                return data.supportedLanguages;
            },
            set supportedLanguages(value) {
                data.supportedLanguages = value;
                update();
            },
            get supportsExecutionOrder() {
                var _a;
                return (_a = data.supportsExecutionOrder) !== null && _a !== void 0 ? _a : false;
            },
            set supportsExecutionOrder(value) {
                data.supportsExecutionOrder = value;
                update();
            },
            get rendererScripts() {
                var _a;
                return (_a = data.rendererScripts) !== null && _a !== void 0 ? _a : [];
            },
            set rendererScripts(value) {
                data.rendererScripts = value;
                update();
            },
            get executeHandler() {
                return executeHandler;
            },
            set executeHandler(value) {
                executeHandler = value !== null && value !== void 0 ? value : defaultExecuteHandler;
            },
            get interruptHandler() {
                return interruptHandler;
            },
            set interruptHandler(value) {
                interruptHandler = value;
                data.supportsInterrupt = Boolean(value);
                update();
            },
            createNotebookCellExecution(cell) {
                if (isDisposed) {
                    throw new Error('notebook controller is DISPOSED');
                }
                if (!associatedNotebooks.has(cell.notebook.uri.toString())) {
                    console.debug(`NotebookController[${handle}] NOT associated to notebook, associated to THESE notebooks:`, Array.from(associatedNotebooks.keys()).map(u => u.toString()));
                    throw new Error(`notebook controller is NOT associated to notebook: ${cell.notebook.uri.toString()}`);
                }
                return that.createNotebookCellExecution(cell, createKernelId(extensionId, this.id));
            },
            dispose: () => {
                if (!isDisposed) {
                    console.debug(`NotebookController[${handle}], DISPOSED`);
                    isDisposed = true;
                    this.kernelData.delete(handle);
                    commandDisposables.dispose();
                    onDidChangeSelection.dispose();
                    onDidReceiveMessage.dispose();
                    this.proxy.$removeKernel(handle);
                }
            },
            updateNotebookAffinity(notebook, priority) {
                that.proxy.$updateNotebookPriority(handle, notebook.uri, priority);
            },
            async postMessage(message, editor) {
                return Promise.resolve(true); // TODO needs implementation
            },
            asWebviewUri(localResource) {
                throw new Error('Method not implemented.');
            }
        };
        this.kernelData.set(handle, {
            extensionId: extensionId,
            controller,
            onDidReceiveMessage,
            onDidChangeSelection,
            associatedNotebooks
        });
        return controller;
    }
    createNotebookCellExecution(cell, controllerId) {
        if (cell.index < 0) {
            throw new Error('CANNOT execute cell that has been REMOVED from notebook');
        }
        const notebook = this.notebooks.getNotebookDocument(types_impl_1.URI.from(cell.notebook.uri));
        const cellObj = notebook.getCellFromApiCell(cell);
        if (!cellObj) {
            throw new Error('invalid cell');
        }
        if (this.activeExecutions.has(cellObj.uri.toString())) {
            throw new Error(`duplicate execution for ${cellObj.uri}`);
        }
        const execution = new NotebookCellExecutionTask(controllerId, cellObj, this.proxy);
        this.activeExecutions.set(cellObj.uri.toString(), execution);
        const listener = execution.onDidChangeState(() => {
            if (execution.state === NotebookCellExecutionTaskState.Resolved) {
                execution.dispose();
                listener.dispose();
                this.activeExecutions.delete(cellObj.uri.toString());
            }
        });
        return execution.asApiObject();
    }
    createNotebookControllerDetectionTask(viewType) {
        const handle = this.currentKernelDetectionTaskHandle++;
        const that = this;
        this.proxy.$addKernelDetectionTask(handle, viewType);
        const detectionTask = {
            dispose: () => {
                this.kernelDetectionTasks.delete(handle);
                that.proxy.$removeKernelDetectionTask(handle);
            }
        };
        this.kernelDetectionTasks.set(handle, detectionTask);
        return detectionTask;
    }
    registerKernelSourceActionProvider(viewType, provider) {
        const handle = this.currentSourceActionProviderHandle++;
        const eventHandle = typeof provider.onDidChangeNotebookKernelSourceActions === 'function' ? handle : undefined;
        const that = this;
        this.kernelSourceActionProviders.set(handle, provider);
        this.proxy.$addKernelSourceActionProvider(handle, handle, viewType);
        let subscription;
        if (eventHandle !== undefined) {
            subscription = provider.onDidChangeNotebookKernelSourceActions(_ => this.proxy.$emitNotebookKernelSourceActionsChangeEvent(eventHandle));
        }
        return {
            dispose: () => {
                this.kernelSourceActionProviders.delete(handle);
                that.proxy.$removeKernelSourceActionProvider(handle, handle);
                subscription === null || subscription === void 0 ? void 0 : subscription.dispose();
            }
        };
    }
    $acceptNotebookAssociation(handle, uri, value) {
        const obj = this.kernelData.get(handle);
        if (obj) {
            // update data structure
            const notebook = this.notebooks.getNotebookDocument(types_impl_1.URI.from(uri));
            if (value) {
                obj.associatedNotebooks.set(notebook.uri.toString(), true);
            }
            else {
                obj.associatedNotebooks.delete(notebook.uri.toString());
            }
            console.debug(`NotebookController[${handle}] ASSOCIATE notebook`, notebook.uri.toString(), value);
            // send event
            obj.onDidChangeSelection.fire({
                selected: value,
                notebook: notebook.apiNotebook
            });
        }
    }
    async $executeCells(handle, uri, handles) {
        const obj = this.kernelData.get(handle);
        if (!obj) {
            // extension can dispose kernels in the meantime
            return Promise.resolve();
        }
        const document = this.notebooks.getNotebookDocument(types_impl_1.URI.from(uri));
        const cells = [];
        for (const cellHandle of handles) {
            const cell = document.getCell(cellHandle);
            if (cell) {
                cells.push(cell.apiCell);
            }
        }
        try {
            console.debug(`NotebookController[${handle}] EXECUTE cells`, document.uri.toString(), cells.length);
            await obj.controller.executeHandler.call(obj.controller, cells, document.apiNotebook, obj.controller);
        }
        catch (err) {
            console.error(`NotebookController[${handle}] execute cells FAILED`, err);
            console.error(err);
        }
    }
    async $cancelCells(handle, uri, handles) {
        var _a;
        const obj = this.kernelData.get(handle);
        if (!obj) {
            // extension can dispose kernels in the meantime
            return Promise.resolve();
        }
        // cancel or interrupt depends on the controller. When an interrupt handler is used we
        // don't trigger the cancelation token of executions.N
        const document = this.notebooks.getNotebookDocument(types_impl_1.URI.from(uri));
        if (obj.controller.interruptHandler) {
            await obj.controller.interruptHandler.call(obj.controller, document.apiNotebook);
        }
        else {
            for (const cellHandle of handles) {
                const cell = document.getCell(cellHandle);
                if (cell) {
                    (_a = this.activeExecutions.get(cell.uri.toString())) === null || _a === void 0 ? void 0 : _a.cancel();
                }
            }
        }
    }
    $acceptKernelMessageFromRenderer(handle, editorId, message) {
        const obj = this.kernelData.get(handle);
        if (!obj) {
            // extension can dispose kernels in the meantime
            return;
        }
        const editor = this.notebooks.getEditorById(editorId);
        obj.onDidReceiveMessage.fire(Object.freeze({ editor: editor.apiEditor, message }));
    }
    $cellExecutionChanged(uri, cellHandle, state) {
        // Proposed Api though seems needed by jupyter for telemetry
    }
    async $provideKernelSourceActions(handle, token) {
        const provider = this.kernelSourceActionProviders.get(handle);
        if (provider) {
            const disposables = new core_1.DisposableCollection();
            const ret = await provider.provideNotebookKernelSourceActions(token);
            return (ret !== null && ret !== void 0 ? ret : []).map(item => type_converters_1.NotebookKernelSourceAction.from(item, this.commands.converter, disposables));
        }
        return [];
    }
}
exports.NotebookKernelsExtImpl = NotebookKernelsExtImpl;
var NotebookCellExecutionTaskState;
(function (NotebookCellExecutionTaskState) {
    NotebookCellExecutionTaskState[NotebookCellExecutionTaskState["Init"] = 0] = "Init";
    NotebookCellExecutionTaskState[NotebookCellExecutionTaskState["Started"] = 1] = "Started";
    NotebookCellExecutionTaskState[NotebookCellExecutionTaskState["Resolved"] = 2] = "Resolved";
})(NotebookCellExecutionTaskState || (NotebookCellExecutionTaskState = {}));
class NotebookCellExecutionTask {
    constructor(controllerId, cell, proxy) {
        this.cell = cell;
        this.proxy = proxy;
        this._handle = NotebookCellExecutionTask.HANDLE++;
        this._onDidChangeState = new core_1.Emitter();
        this.onDidChangeState = this._onDidChangeState.event;
        this._state = NotebookCellExecutionTaskState.Init;
        this.tokenSource = new core_1.CancellationTokenSource();
        this.collector = new TimeoutBasedCollector(10, updates => this.update(updates));
        this.executionOrder = cell.internalMetadata.executionOrder;
        this.proxy.$createExecution(this._handle, controllerId, this.cell.notebookDocument.uri, this.cell.handle);
    }
    get state() { return this._state; }
    cancel() {
        this.tokenSource.cancel();
    }
    async updateSoon(update) {
        await this.collector.addItem(update);
    }
    async update(update) {
        const updates = Array.isArray(update) ? update : [update];
        return this.proxy.$updateExecution(this._handle, updates);
    }
    verifyStateForOutput() {
        if (this._state === NotebookCellExecutionTaskState.Init) {
            throw new Error('Must call start before modifying cell output');
        }
        if (this._state === NotebookCellExecutionTaskState.Resolved) {
            throw new Error('Cannot modify cell output after calling resolve');
        }
    }
    cellIndexToHandle(cellOrCellIndex) {
        let cell = this.cell;
        if (cellOrCellIndex) {
            cell = this.cell.notebookDocument.getCellFromApiCell(cellOrCellIndex);
        }
        if (!cell) {
            throw new Error('INVALID cell');
        }
        return cell.handle;
    }
    validateAndConvertOutputs(items) {
        return items.map(output => {
            const newOutput = type_converters_1.NotebookCellOutputConverter.ensureUniqueMimeTypes(output.items, true);
            if (newOutput === output.items) {
                return type_converters_1.NotebookCellOutputConverter.from(output);
            }
            return type_converters_1.NotebookCellOutputConverter.from({
                items: newOutput,
                outputId: output.outputId,
                metadata: output.metadata
            });
        });
    }
    async updateOutputs(outputs, cell, append) {
        const handle = this.cellIndexToHandle(cell);
        const outputDtos = this.validateAndConvertOutputs(Array.isArray(outputs) ? outputs : [outputs]);
        return this.updateSoon({
            editType: common_2.CellExecutionUpdateType.Output,
            cellHandle: handle,
            append,
            outputs: outputDtos
        });
    }
    async updateOutputItems(items, output, append) {
        items = type_converters_1.NotebookCellOutputConverter.ensureUniqueMimeTypes(Array.isArray(items) ? items : [items], true);
        return this.updateSoon({
            editType: common_2.CellExecutionUpdateType.OutputItems,
            items: items.map(type_converters_1.NotebookCellOutputItem.from),
            append
        });
    }
    asApiObject() {
        const that = this;
        const result = {
            get token() { return that.tokenSource.token; },
            get cell() { return that.cell.apiCell; },
            get executionOrder() { return that.executionOrder; },
            set executionOrder(v) {
                that.executionOrder = v;
                that.update([{
                        editType: common_2.CellExecutionUpdateType.ExecutionState,
                        executionOrder: that.executionOrder
                    }]);
            },
            start(startTime) {
                if (that._state === NotebookCellExecutionTaskState.Resolved || that._state === NotebookCellExecutionTaskState.Started) {
                    throw new Error('Cannot call start again');
                }
                that._state = NotebookCellExecutionTaskState.Started;
                that._onDidChangeState.fire();
                that.update({
                    editType: common_2.CellExecutionUpdateType.ExecutionState,
                    runStartTime: startTime
                });
            },
            end(success, endTime) {
                if (that._state === NotebookCellExecutionTaskState.Resolved) {
                    throw new Error('Cannot call resolve twice');
                }
                that._state = NotebookCellExecutionTaskState.Resolved;
                that._onDidChangeState.fire();
                // The last update needs to be ordered correctly and applied immediately,
                // so we use updateSoon and immediately flush.
                that.collector.flush();
                that.proxy.$completeExecution(that._handle, {
                    runEndTime: endTime,
                    lastRunSuccess: success
                });
            },
            clearOutput(cell) {
                that.verifyStateForOutput();
                return that.updateOutputs([], cell, false);
            },
            appendOutput(outputs, cell) {
                that.verifyStateForOutput();
                return that.updateOutputs(outputs, cell, true);
            },
            replaceOutput(outputs, cell) {
                that.verifyStateForOutput();
                return that.updateOutputs(outputs, cell, false);
            },
            appendOutputItems(items, output) {
                that.verifyStateForOutput();
                return that.updateOutputItems(items, output, true);
            },
            replaceOutputItems(items, output) {
                that.verifyStateForOutput();
                return that.updateOutputItems(items, output, false);
            }
        };
        return Object.freeze(result);
    }
    dispose() {
    }
}
NotebookCellExecutionTask.HANDLE = 0;
class TimeoutBasedCollector {
    constructor(delay, callback) {
        this.delay = delay;
        this.callback = callback;
        this.batch = [];
        this.startedTimer = Date.now();
    }
    addItem(item) {
        this.batch.push(item);
        if (!this.currentDeferred) {
            this.currentDeferred = new promise_util_1.Deferred();
            this.startedTimer = Date.now();
            (0, promise_util_1.timeout)(this.delay).then(() => this.flush());
        }
        // This can be called by the extension repeatedly for a long time before the timeout is able to run.
        // Force a flush after the delay.
        if (Date.now() - this.startedTimer > this.delay) {
            return this.flush();
        }
        return this.currentDeferred.promise;
    }
    flush() {
        if (this.batch.length === 0 || !this.currentDeferred) {
            return Promise.resolve();
        }
        const deferred = this.currentDeferred;
        this.currentDeferred = undefined;
        const batch = this.batch;
        this.batch = [];
        return this.callback(batch)
            .finally(() => deferred.resolve());
    }
}
function createKernelId(extensionIdentifier, id) {
    return `${extensionIdentifier}/${id}`;
}
exports.createKernelId = createKernelId;
//# sourceMappingURL=notebook-kernels.js.map