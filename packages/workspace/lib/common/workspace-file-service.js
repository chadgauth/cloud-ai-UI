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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceFileService = exports.VSCODE_EXT = exports.THEIA_EXT = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const files_1 = require("@theia/filesystem/lib/common/files");
/**
 * @deprecated Since 1.39.0. Use `WorkspaceFileService#getWorkspaceFileTypes` instead.
 */
exports.THEIA_EXT = 'theia-workspace';
/**
 * @deprecated Since 1.39.0. Use `WorkspaceFileService#getWorkspaceFileTypes` instead.
 */
exports.VSCODE_EXT = 'code-workspace';
let WorkspaceFileService = class WorkspaceFileService {
    constructor() {
        this._defaultFileTypeIndex = 0;
    }
    get defaultFileTypeIndex() {
        return this._defaultFileTypeIndex;
    }
    /**
     * Check if the file should be considered as a workspace file.
     *
     * Example: We should not try to read the contents of an .exe file.
     */
    isWorkspaceFile(candidate) {
        const uri = files_1.FileStat.is(candidate) ? candidate.resource : candidate;
        const extensions = this.getWorkspaceFileExtensions(true);
        return extensions.includes(uri.path.ext);
    }
    getWorkspaceFileTypes() {
        return [
            {
                name: 'Theia',
                extension: exports.THEIA_EXT
            },
            {
                name: 'Visual Studio Code',
                extension: exports.VSCODE_EXT
            }
        ];
    }
    getWorkspaceFileExtensions(dot) {
        return this.getWorkspaceFileTypes().map(type => dot ? `.${type.extension}` : type.extension);
    }
};
WorkspaceFileService = __decorate([
    (0, inversify_1.injectable)()
], WorkspaceFileService);
exports.WorkspaceFileService = WorkspaceFileService;
//# sourceMappingURL=workspace-file-service.js.map