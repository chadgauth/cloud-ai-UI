"use strict";
// *****************************************************************************
// Copyright (C) 2018 Ericsson and others.
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
exports.UntitledWorkspaceService = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const workspace_file_service_1 = require("./workspace-file-service");
let UntitledWorkspaceService = class UntitledWorkspaceService {
    isUntitledWorkspace(candidate) {
        return !!candidate && this.workspaceFileService.isWorkspaceFile(candidate) && candidate.path.base.startsWith('Untitled');
    }
    async getUntitledWorkspaceUri(configDirUri, isAcceptable, warnOnHits) {
        const parentDir = configDirUri.resolve('workspaces');
        const workspaceExtensions = this.workspaceFileService.getWorkspaceFileExtensions();
        const defaultFileExtension = workspaceExtensions[this.workspaceFileService.defaultFileTypeIndex];
        let uri;
        let attempts = 0;
        do {
            attempts++;
            uri = parentDir.resolve(`Untitled-${Math.round(Math.random() * 1000)}.${defaultFileExtension}`);
            if (attempts === 10) {
                warnOnHits === null || warnOnHits === void 0 ? void 0 : warnOnHits();
            }
            if (attempts === 50) {
                throw new Error('Workspace Service: too many attempts to find unused filename.');
            }
        } while (!(await isAcceptable(uri)));
        return uri;
    }
};
__decorate([
    (0, inversify_1.inject)(workspace_file_service_1.WorkspaceFileService),
    __metadata("design:type", workspace_file_service_1.WorkspaceFileService)
], UntitledWorkspaceService.prototype, "workspaceFileService", void 0);
UntitledWorkspaceService = __decorate([
    (0, inversify_1.injectable)()
], UntitledWorkspaceService);
exports.UntitledWorkspaceService = UntitledWorkspaceService;
//# sourceMappingURL=untitled-workspace-service.js.map