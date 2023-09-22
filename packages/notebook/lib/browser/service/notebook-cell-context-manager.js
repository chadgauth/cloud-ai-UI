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
exports.NotebookCellContextManager = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const context_key_service_1 = require("@theia/core/lib/browser/context-key-service");
const notebook_context_keys_1 = require("../contributions/notebook-context-keys");
const core_1 = require("@theia/core");
const common_1 = require("../../common");
const notebook_execution_state_service_1 = require("../service/notebook-execution-state-service");
let NotebookCellContextManager = class NotebookCellContextManager {
    constructor() {
        this.toDispose = new core_1.DisposableCollection();
        this.onDidChangeContextEmitter = new core_1.Emitter();
        this.onDidChangeContext = this.onDidChangeContextEmitter.event;
    }
    updateCellContext(cell, newHtmlContext) {
        var _a;
        if (newHtmlContext !== this.currentContext) {
            this.toDispose.dispose();
            (_a = this.currentStore) === null || _a === void 0 ? void 0 : _a.dispose();
            this.currentContext = newHtmlContext;
            this.currentStore = this.contextKeyService.createScoped(newHtmlContext);
            this.currentStore.setContext(notebook_context_keys_1.NOTEBOOK_CELL_TYPE, cell.cellKind === common_1.CellKind.Code ? 'code' : 'markdown');
            this.toDispose.push(cell.onDidRequestCellEditChange(cellEdit => {
                var _a;
                (_a = this.currentStore) === null || _a === void 0 ? void 0 : _a.setContext(notebook_context_keys_1.NOTEBOOK_CELL_MARKDOWN_EDIT_MODE, cellEdit);
                this.onDidChangeContextEmitter.fire();
            }));
            this.toDispose.push(this.executionStateService.onDidChangeExecution(e => {
                var _a, _b, _c, _d;
                if (e.affectsCell(cell.uri)) {
                    (_a = this.currentStore) === null || _a === void 0 ? void 0 : _a.setContext(notebook_context_keys_1.NOTEBOOK_CELL_EXECUTING, !!e.changed);
                    (_b = this.currentStore) === null || _b === void 0 ? void 0 : _b.setContext(notebook_context_keys_1.NOTEBOOK_CELL_EXECUTION_STATE, (_d = (_c = e.changed) === null || _c === void 0 ? void 0 : _c.state) !== null && _d !== void 0 ? _d : 'idle');
                    this.onDidChangeContextEmitter.fire();
                }
            }));
            this.onDidChangeContextEmitter.fire();
        }
    }
    dispose() {
        var _a;
        this.toDispose.dispose();
        (_a = this.currentStore) === null || _a === void 0 ? void 0 : _a.dispose();
        this.onDidChangeContextEmitter.dispose();
    }
};
__decorate([
    (0, inversify_1.inject)(context_key_service_1.ContextKeyService),
    __metadata("design:type", Object)
], NotebookCellContextManager.prototype, "contextKeyService", void 0);
__decorate([
    (0, inversify_1.inject)(notebook_execution_state_service_1.NotebookExecutionStateService),
    __metadata("design:type", notebook_execution_state_service_1.NotebookExecutionStateService)
], NotebookCellContextManager.prototype, "executionStateService", void 0);
NotebookCellContextManager = __decorate([
    (0, inversify_1.injectable)()
], NotebookCellContextManager);
exports.NotebookCellContextManager = NotebookCellContextManager;
//# sourceMappingURL=notebook-cell-context-manager.js.map