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
exports.NotebookExecutionService = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const notebook_execution_state_service_1 = require("../service/notebook-execution-state-service");
const common_1 = require("../../common");
const notebook_kernel_service_1 = require("./notebook-kernel-service");
const core_1 = require("@theia/core");
const notebook_kernel_quick_pick_service_1 = require("./notebook-kernel-quick-pick-service");
const notebook_kernel_history_service_1 = require("./notebook-kernel-history-service");
const notebook_actions_contribution_1 = require("../contributions/notebook-actions-contribution");
let NotebookExecutionService = class NotebookExecutionService {
    constructor() {
        this.cellExecutionParticipants = new Set();
    }
    async executeNotebookCells(notebook, cells) {
        const cellsArr = Array.from(cells)
            .filter(c => c.cellKind === common_1.CellKind.Code);
        if (!cellsArr.length) {
            return;
        }
        // create cell executions
        const cellExecutions = [];
        for (const cell of cellsArr) {
            const cellExe = this.notebookExecutionStateService.getCellExecution(cell.uri);
            if (!cellExe) {
                cellExecutions.push([cell, this.notebookExecutionStateService.createCellExecution(notebook.uri, cell.handle)]);
            }
        }
        const kernel = await this.resolveKernel(notebook);
        if (!kernel) {
            // clear all pending cell executions
            cellExecutions.forEach(cellExe => cellExe[1].complete({}));
            return;
        }
        // filter cell executions based on selected kernel
        const validCellExecutions = [];
        for (const [cell, cellExecution] of cellExecutions) {
            if (!kernel.supportedLanguages.includes(cell.language)) {
                cellExecution.complete({});
            }
            else {
                validCellExecutions.push(cellExecution);
            }
        }
        // request execution
        if (validCellExecutions.length > 0) {
            await this.runExecutionParticipants(validCellExecutions);
            this.notebookKernelService.selectKernelForNotebook(kernel, notebook);
            await kernel.executeNotebookCellsRequest(notebook.uri, validCellExecutions.map(c => c.cellHandle));
            // the connecting state can change before the kernel resolves executeNotebookCellsRequest
            const unconfirmed = validCellExecutions.filter(exe => exe.state === common_1.NotebookCellExecutionState.Unconfirmed);
            if (unconfirmed.length) {
                unconfirmed.forEach(exe => exe.complete({}));
            }
        }
    }
    registerExecutionParticipant(participant) {
        this.cellExecutionParticipants.add(participant);
        return core_1.Disposable.create(() => this.cellExecutionParticipants.delete(participant));
    }
    async runExecutionParticipants(executions) {
        for (const participant of this.cellExecutionParticipants) {
            await participant.onWillExecuteCell(executions);
        }
        return;
    }
    async cancelNotebookCellHandles(notebook, cells) {
        const cellsArr = Array.from(cells);
        const kernel = this.notebookKernelService.getSelectedOrSuggestedKernel(notebook);
        if (kernel) {
            await kernel.cancelNotebookCellExecution(notebook.uri, cellsArr);
        }
    }
    async cancelNotebookCells(notebook, cells) {
        this.cancelNotebookCellHandles(notebook, Array.from(cells, cell => cell.handle));
    }
    async resolveKernel(notebook) {
        const alreadySelected = this.notebookKernelHistoryService.getKernels(notebook);
        if (alreadySelected.selected) {
            return alreadySelected.selected;
        }
        await this.commandService.executeCommand(notebook_actions_contribution_1.NotebookCommands.SELECT_KERNEL_COMMAND.id, notebook);
        const { selected } = this.notebookKernelHistoryService.getKernels(notebook);
        return selected;
    }
};
__decorate([
    (0, inversify_1.inject)(notebook_execution_state_service_1.NotebookExecutionStateService),
    __metadata("design:type", notebook_execution_state_service_1.NotebookExecutionStateService)
], NotebookExecutionService.prototype, "notebookExecutionStateService", void 0);
__decorate([
    (0, inversify_1.inject)(notebook_kernel_service_1.NotebookKernelService),
    __metadata("design:type", notebook_kernel_service_1.NotebookKernelService)
], NotebookExecutionService.prototype, "notebookKernelService", void 0);
__decorate([
    (0, inversify_1.inject)(notebook_kernel_history_service_1.NotebookKernelHistoryService),
    __metadata("design:type", notebook_kernel_history_service_1.NotebookKernelHistoryService)
], NotebookExecutionService.prototype, "notebookKernelHistoryService", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.CommandService),
    __metadata("design:type", Object)
], NotebookExecutionService.prototype, "commandService", void 0);
__decorate([
    (0, inversify_1.inject)(notebook_kernel_quick_pick_service_1.NotebookKernelQuickPickService),
    __metadata("design:type", notebook_kernel_quick_pick_service_1.NotebookKernelQuickPickServiceImpl)
], NotebookExecutionService.prototype, "notebookKernelQuickPickService", void 0);
NotebookExecutionService = __decorate([
    (0, inversify_1.injectable)()
], NotebookExecutionService);
exports.NotebookExecutionService = NotebookExecutionService;
//# sourceMappingURL=notebook-execution-service.js.map