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
var NotebookKernelHistoryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotebookKernelHistoryService = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/core/lib/browser");
const notebook_kernel_service_1 = require("./notebook-kernel-service");
const MAX_KERNELS_IN_HISTORY = 5;
let NotebookKernelHistoryService = NotebookKernelHistoryService_1 = class NotebookKernelHistoryService {
    constructor() {
        this.mostRecentKernelsMap = {};
    }
    init() {
        this.loadState();
    }
    getKernels(notebook) {
        const allAvailableKernels = this.notebookKernelService.getMatchingKernel(notebook);
        const allKernels = allAvailableKernels.all;
        const selectedKernel = allAvailableKernels.selected;
        // We will suggest the only kernel
        const suggested = allAvailableKernels.all.length === 1 ? allAvailableKernels.all[0] : undefined;
        const mostRecentKernelIds = this.mostRecentKernelsMap[notebook.viewType] ? this.mostRecentKernelsMap[notebook.viewType].map(kernel => kernel[1]) : [];
        const all = mostRecentKernelIds.map(kernelId => allKernels.find(kernel => kernel.id === kernelId)).filter(kernel => !!kernel);
        return {
            selected: selectedKernel !== null && selectedKernel !== void 0 ? selectedKernel : suggested,
            all
        };
    }
    addMostRecentKernel(kernel) {
        var _a;
        const viewType = kernel.viewType;
        const recentKernels = (_a = this.mostRecentKernelsMap[viewType]) !== null && _a !== void 0 ? _a : [kernel.id];
        if (recentKernels.length > MAX_KERNELS_IN_HISTORY) {
            recentKernels.splice(MAX_KERNELS_IN_HISTORY);
        }
        this.mostRecentKernelsMap[viewType] = recentKernels;
        this.saveState();
    }
    saveState() {
        let notEmpty = false;
        for (const [_, kernels] of Object.entries(this.mostRecentKernelsMap)) {
            notEmpty = notEmpty || Object.entries(kernels).length > 0;
        }
        this.storageService.setData(NotebookKernelHistoryService_1.STORAGE_KEY, notEmpty ? this.mostRecentKernelsMap : undefined);
    }
    async loadState() {
        const kernelMap = await this.storageService.getData(NotebookKernelHistoryService_1.STORAGE_KEY);
        if (kernelMap) {
            this.mostRecentKernelsMap = kernelMap;
        }
        else {
            this.mostRecentKernelsMap = {};
        }
    }
    clear() {
        this.mostRecentKernelsMap = {};
        this.saveState();
    }
    dispose() {
    }
};
NotebookKernelHistoryService.STORAGE_KEY = 'notebook.kernelHistory';
__decorate([
    (0, inversify_1.inject)(browser_1.StorageService),
    __metadata("design:type", Object)
], NotebookKernelHistoryService.prototype, "storageService", void 0);
__decorate([
    (0, inversify_1.inject)(notebook_kernel_service_1.NotebookKernelService),
    __metadata("design:type", notebook_kernel_service_1.NotebookKernelService)
], NotebookKernelHistoryService.prototype, "notebookKernelService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NotebookKernelHistoryService.prototype, "init", null);
NotebookKernelHistoryService = NotebookKernelHistoryService_1 = __decorate([
    (0, inversify_1.injectable)()
], NotebookKernelHistoryService);
exports.NotebookKernelHistoryService = NotebookKernelHistoryService;
//# sourceMappingURL=notebook-kernel-history-service.js.map