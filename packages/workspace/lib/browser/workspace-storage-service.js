"use strict";
// *****************************************************************************
// Copyright (C) 2017 TypeFox and others.
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
exports.WorkspaceStorageService = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const storage_service_1 = require("@theia/core/lib/browser/storage-service");
const workspace_service_1 = require("./workspace-service");
/*
 * Prefixes any stored data with the current workspace path.
 */
let WorkspaceStorageService = class WorkspaceStorageService {
    init() {
        this.initialized = this.workspaceService.roots.then(() => {
            this.updatePrefix();
            this.workspaceService.onWorkspaceLocationChanged(() => this.updatePrefix());
        });
    }
    async setData(key, data) {
        if (!this.prefix) {
            await this.initialized;
        }
        const fullKey = this.prefixWorkspaceURI(key);
        return this.storageService.setData(fullKey, data);
    }
    async getData(key, defaultValue) {
        await this.initialized;
        const fullKey = this.prefixWorkspaceURI(key);
        return this.storageService.getData(fullKey, defaultValue);
    }
    prefixWorkspaceURI(originalKey) {
        return `${this.prefix}:${originalKey}`;
    }
    getPrefix(workspaceStat) {
        return workspaceStat ? workspaceStat.resource.toString() : '_global_';
    }
    updatePrefix() {
        this.prefix = this.getPrefix(this.workspaceService.workspace);
    }
};
__decorate([
    (0, inversify_1.inject)(storage_service_1.LocalStorageService),
    __metadata("design:type", Object)
], WorkspaceStorageService.prototype, "storageService", void 0);
__decorate([
    (0, inversify_1.inject)(workspace_service_1.WorkspaceService),
    __metadata("design:type", workspace_service_1.WorkspaceService)
], WorkspaceStorageService.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WorkspaceStorageService.prototype, "init", null);
WorkspaceStorageService = __decorate([
    (0, inversify_1.injectable)()
], WorkspaceStorageService);
exports.WorkspaceStorageService = WorkspaceStorageService;
//# sourceMappingURL=workspace-storage-service.js.map