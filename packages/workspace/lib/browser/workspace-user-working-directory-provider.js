"use strict";
// *****************************************************************************
// Copyright (C) 2022 Ericsson and others.
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
exports.WorkspaceUserWorkingDirectoryProvider = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const user_working_directory_provider_1 = require("@theia/core/lib/browser/user-working-directory-provider");
const workspace_service_1 = require("./workspace-service");
const file_service_1 = require("@theia/filesystem/lib/browser/file-service");
let WorkspaceUserWorkingDirectoryProvider = class WorkspaceUserWorkingDirectoryProvider extends user_working_directory_provider_1.UserWorkingDirectoryProvider {
    async getUserWorkingDir() {
        var _a, _b;
        return (_b = (_a = await this.getFromSelection()) !== null && _a !== void 0 ? _a : await this.getFromWorkspace()) !== null && _b !== void 0 ? _b : this.getFromUserHome();
    }
    getFromWorkspace() {
        var _a;
        return (_a = this.workspaceService.tryGetRoots()[0]) === null || _a === void 0 ? void 0 : _a.resource;
    }
    async ensureIsDirectory(uri) {
        if (uri) {
            const asFile = uri.withScheme('file');
            const stat = await this.fileService.resolve(asFile)
                .catch(() => this.fileService.resolve(asFile.parent))
                .catch(() => undefined);
            return (stat === null || stat === void 0 ? void 0 : stat.isDirectory) ? stat.resource : stat === null || stat === void 0 ? void 0 : stat.resource.parent;
        }
    }
};
__decorate([
    (0, inversify_1.inject)(workspace_service_1.WorkspaceService),
    __metadata("design:type", workspace_service_1.WorkspaceService)
], WorkspaceUserWorkingDirectoryProvider.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], WorkspaceUserWorkingDirectoryProvider.prototype, "fileService", void 0);
WorkspaceUserWorkingDirectoryProvider = __decorate([
    (0, inversify_1.injectable)()
], WorkspaceUserWorkingDirectoryProvider);
exports.WorkspaceUserWorkingDirectoryProvider = WorkspaceUserWorkingDirectoryProvider;
//# sourceMappingURL=workspace-user-working-directory-provider.js.map