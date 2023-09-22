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
exports.NotebookKernelsMainImpl = void 0;
const core_1 = require("@theia/core");
const language_service_1 = require("@theia/core/lib/browser/language-service");
const common_1 = require("../../../common");
const browser_1 = require("@theia/notebook/lib/browser");
const lifecycle_1 = require("@theia/monaco-editor-core/esm/vs/base/common/lifecycle");
const type_converters_1 = require("../../../plugin/type-converters");
class NotebookKernel {
    constructor(data, languageService) {
        var _a, _b, _c, _d;
        this.languageService = languageService;
        this.onDidChangeEmitter = new core_1.Emitter();
        this.onDidChange = this.onDidChangeEmitter.event;
        this.id = data.id;
        this.viewType = data.notebookType;
        this.extension = data.extensionId;
        this.implementsInterrupt = (_a = data.supportsInterrupt) !== null && _a !== void 0 ? _a : false;
        this.label = data.label;
        this.description = data.description;
        this.detail = data.detail;
        this.supportedLanguages = (data.supportedLanguages && data.supportedLanguages.length > 0) ? data.supportedLanguages : languageService.languages.map(lang => lang.id);
        this.implementsExecutionOrder = (_b = data.supportsExecutionOrder) !== null && _b !== void 0 ? _b : false;
        this.preloads = (_d = (_c = data.preloads) === null || _c === void 0 ? void 0 : _c.map(u => ({ uri: core_1.URI.fromComponents(u.uri), provides: u.provides }))) !== null && _d !== void 0 ? _d : [];
    }
    get preloadUris() {
        return this.preloads.map(p => p.uri);
    }
    get preloadProvides() {
        return this.preloads.map(p => p.provides).flat();
    }
    update(data) {
        const event = Object.create(null);
        if (data.label !== undefined) {
            this.label = data.label;
            event.label = true;
        }
        if (data.description !== undefined) {
            this.description = data.description;
            event.description = true;
        }
        if (data.detail !== undefined) {
            this.detail = data.detail;
            event.detail = true;
        }
        if (data.supportedLanguages !== undefined) {
            this.supportedLanguages = (data.supportedLanguages && data.supportedLanguages.length > 0) ?
                data.supportedLanguages :
                this.languageService.languages.map(lang => lang.id);
            event.supportedLanguages = true;
        }
        if (data.supportsExecutionOrder !== undefined) {
            this.implementsExecutionOrder = data.supportsExecutionOrder;
            event.hasExecutionOrder = true;
        }
        if (data.supportsInterrupt !== undefined) {
            this.implementsInterrupt = data.supportsInterrupt;
            event.hasInterruptHandler = true;
        }
        this.onDidChangeEmitter.fire(event);
    }
}
class KernelDetectionTask {
    constructor(notebookType) {
        this.notebookType = notebookType;
    }
}
class NotebookKernelsMainImpl {
    constructor(rpc, container) {
        this.kernels = new Map();
        this.kernelDetectionTasks = new Map();
        this.kernelSourceActionProviders = new Map();
        this.kernelSourceActionProvidersEventRegistrations = new Map();
        this.executions = new Map();
        this.proxy = rpc.getProxy(common_1.MAIN_RPC_CONTEXT.NOTEBOOK_KERNELS_EXT);
        this.notebookKernelService = container.get(browser_1.NotebookKernelService);
        this.notebookExecutionStateService = container.get(browser_1.NotebookExecutionStateService);
        this.notebookService = container.get(browser_1.NotebookService);
        this.languageService = container.get(language_service_1.LanguageService);
    }
    $postMessage(handle, editorId, message) {
        throw new Error('Method not implemented.');
    }
    async $addKernel(handle, data) {
        const that = this;
        const kernel = new class extends NotebookKernel {
            async executeNotebookCellsRequest(uri, handles) {
                await that.proxy.$executeCells(handle, uri.toComponents(), handles);
            }
            async cancelNotebookCellExecution(uri, handles) {
                await that.proxy.$cancelCells(handle, uri.toComponents(), handles);
            }
        }(data, this.languageService);
        const listener = this.notebookKernelService.onDidChangeSelectedKernel(e => {
            if (e.oldKernel === kernel.id) {
                this.proxy.$acceptNotebookAssociation(handle, e.notebook.toComponents(), false);
            }
            else if (e.newKernel === kernel.id) {
                this.proxy.$acceptNotebookAssociation(handle, e.notebook.toComponents(), true);
            }
        });
        const registration = this.notebookKernelService.registerKernel(kernel);
        this.kernels.set(handle, [kernel, (0, lifecycle_1.combinedDisposable)(listener, registration)]);
    }
    $updateKernel(handle, data) {
        const tuple = this.kernels.get(handle);
        if (tuple) {
            tuple[0].update(data);
        }
    }
    $removeKernel(handle) {
        const tuple = this.kernels.get(handle);
        if (tuple) {
            tuple[1].dispose();
            this.kernels.delete(handle);
        }
    }
    $updateNotebookPriority(handle, uri, value) {
        throw new Error('Method not implemented.');
    }
    $createExecution(handle, controllerId, uriComponents, cellHandle) {
        var _a;
        const uri = core_1.URI.fromComponents(uriComponents);
        const notebook = this.notebookService.getNotebookEditorModel(uri);
        if (!notebook) {
            throw new Error(`Notebook not found: ${uri.toString()}`);
        }
        const kernel = this.notebookKernelService.getMatchingKernel(notebook);
        if (!kernel.selected || kernel.selected.id !== controllerId) {
            throw new Error(`Kernel is not selected: ${(_a = kernel.selected) === null || _a === void 0 ? void 0 : _a.id} !== ${controllerId}`);
        }
        const execution = this.notebookExecutionStateService.createCellExecution(uri, cellHandle);
        execution.confirm();
        this.executions.set(handle, execution);
    }
    $updateExecution(handle, updates) {
        const execution = this.executions.get(handle);
        execution === null || execution === void 0 ? void 0 : execution.update(updates.map(type_converters_1.NotebookDto.fromCellExecuteUpdateDto));
    }
    $completeExecution(handle, data) {
        try {
            const execution = this.executions.get(handle);
            execution === null || execution === void 0 ? void 0 : execution.complete(type_converters_1.NotebookDto.fromCellExecuteCompleteDto(data));
        }
        finally {
            this.executions.delete(handle);
        }
    }
    // TODO implement notebook execution (special api for executing full notebook instead of just cells)
    $createNotebookExecution(handle, controllerId, uri) {
        throw new Error('Method not implemented.');
    }
    $beginNotebookExecution(handle) {
        throw new Error('Method not implemented.');
    }
    $completeNotebookExecution(handle) {
        throw new Error('Method not implemented.');
    }
    async $addKernelDetectionTask(handle, notebookType) {
        const kernelDetectionTask = new KernelDetectionTask(notebookType);
        const registration = this.notebookKernelService.registerNotebookKernelDetectionTask(kernelDetectionTask);
        this.kernelDetectionTasks.set(handle, [kernelDetectionTask, registration]);
    }
    $removeKernelDetectionTask(handle) {
        const tuple = this.kernelDetectionTasks.get(handle);
        if (tuple) {
            tuple[1].dispose();
            this.kernelDetectionTasks.delete(handle);
        }
    }
    async $addKernelSourceActionProvider(handle, eventHandle, notebookType) {
        const kernelSourceActionProvider = {
            viewType: notebookType,
            provideKernelSourceActions: async () => {
                const actions = await this.proxy.$provideKernelSourceActions(handle, core_1.CancellationToken.None);
                return actions.map(action => ({
                    label: action.label,
                    command: action.command,
                    description: action.description,
                    detail: action.detail,
                    documentation: action.documentation,
                }));
            }
        };
        if (typeof eventHandle === 'number') {
            const emitter = new core_1.Emitter();
            this.kernelSourceActionProvidersEventRegistrations.set(eventHandle, emitter);
            kernelSourceActionProvider.onDidChangeSourceActions = emitter.event;
        }
        const registration = this.notebookKernelService.registerKernelSourceActionProvider(notebookType, kernelSourceActionProvider);
        this.kernelSourceActionProviders.set(handle, [kernelSourceActionProvider, registration]);
    }
    $removeKernelSourceActionProvider(handle, eventHandle) {
        const tuple = this.kernelSourceActionProviders.get(handle);
        if (tuple) {
            tuple[1].dispose();
            this.kernelSourceActionProviders.delete(handle);
        }
        if (typeof eventHandle === 'number') {
            this.kernelSourceActionProvidersEventRegistrations.delete(eventHandle);
        }
    }
    $emitNotebookKernelSourceActionsChangeEvent(eventHandle) {
    }
    dispose() {
        this.kernels.forEach(kernel => kernel[1].dispose());
    }
}
exports.NotebookKernelsMainImpl = NotebookKernelsMainImpl;
//# sourceMappingURL=notebook-kernels-main.js.map