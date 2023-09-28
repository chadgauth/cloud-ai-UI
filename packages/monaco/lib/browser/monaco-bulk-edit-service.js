"use strict";
// *****************************************************************************
// Copyright (C) 2018 TypeFox and others.
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
exports.MonacoBulkEditService = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const monaco_workspace_1 = require("./monaco-workspace");
const bulkEditService_1 = require("@theia/monaco-editor-core/esm/vs/editor/browser/services/bulkEditService");
let MonacoBulkEditService = class MonacoBulkEditService {
    async apply(editsIn, options) {
        const edits = Array.isArray(editsIn) ? editsIn : bulkEditService_1.ResourceEdit.convert(editsIn);
        if (this._previewHandler && ((options === null || options === void 0 ? void 0 : options.showPreview) || edits.some(value => { var _a; return (_a = value.metadata) === null || _a === void 0 ? void 0 : _a.needsConfirmation; }))) {
            editsIn = await this._previewHandler(edits, options);
            return { ariaSummary: '', success: true };
        }
        else {
            return this.workspace.applyBulkEdit(edits, options);
        }
    }
    hasPreviewHandler() {
        return Boolean(this._previewHandler);
    }
    setPreviewHandler(handler) {
        this._previewHandler = handler;
        const disposePreviewHandler = () => {
            if (this._previewHandler === handler) {
                this._previewHandler = undefined;
            }
        };
        return {
            dispose() {
                disposePreviewHandler();
            }
        };
    }
};
__decorate([
    (0, inversify_1.inject)(monaco_workspace_1.MonacoWorkspace),
    __metadata("design:type", monaco_workspace_1.MonacoWorkspace)
], MonacoBulkEditService.prototype, "workspace", void 0);
MonacoBulkEditService = __decorate([
    (0, inversify_1.injectable)()
], MonacoBulkEditService);
exports.MonacoBulkEditService = MonacoBulkEditService;
//# sourceMappingURL=monaco-bulk-edit-service.js.map