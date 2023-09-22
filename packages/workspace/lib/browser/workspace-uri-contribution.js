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
exports.WorkspaceUriLabelProviderContribution = void 0;
const label_provider_1 = require("@theia/core/lib/browser/label-provider");
const uri_1 = require("@theia/core/lib/common/uri");
const inversify_1 = require("@theia/core/shared/inversify");
const files_1 = require("@theia/filesystem/lib/common/files");
const workspace_service_1 = require("./workspace-service");
const workspace_variable_contribution_1 = require("./workspace-variable-contribution");
let WorkspaceUriLabelProviderContribution = class WorkspaceUriLabelProviderContribution extends label_provider_1.DefaultUriLabelProviderContribution {
    init() {
        // no-op, backward compatibility
    }
    canHandle(element) {
        if ((element instanceof uri_1.default && element.scheme === 'file' || label_provider_1.URIIconReference.is(element) || files_1.FileStat.is(element))) {
            return 10;
        }
        return 0;
    }
    getIcon(element) {
        return super.getIcon(this.asURIIconReference(element));
    }
    getName(element) {
        return super.getName(this.asURIIconReference(element));
    }
    /**
     * trims the workspace root from a file uri, if it is a child.
     */
    getLongName(element) {
        const uri = this.getUri(element);
        if (uri) {
            const formatting = this.findFormatting(uri);
            if (formatting) {
                return this.formatUri(uri, formatting);
            }
        }
        const relativePath = uri && this.workspaceVariable.getWorkspaceRelativePath(uri);
        return relativePath || super.getLongName(this.asURIIconReference(element));
    }
    getDetails(element) {
        const uri = this.getUri(element);
        if (!uri) {
            return this.getLongName(element);
        }
        // Parent in order to omit the name - that's what comes out of `getName`, and `getDetails` should supplement, not duplicate.
        const relativePath = uri && this.workspaceVariable.getWorkspaceRelativePath(uri.parent);
        if (relativePath !== undefined) {
            const prefix = this.workspaceService.tryGetRoots().length > 1 ? this.getName(this.workspaceVariable.getWorkspaceRootUri(uri)) : '';
            const separator = prefix && relativePath ? ' • ' : '';
            return prefix + separator + relativePath;
        }
        return this.getLongName(uri.parent);
    }
    asURIIconReference(element) {
        var _a;
        if (files_1.FileStat.is(element)) {
            return label_provider_1.URIIconReference.create(element.isDirectory ? 'folder' : 'file', element.resource);
        }
        const uri = this.getUri(element);
        if (uri && ((_a = this.workspaceVariable.getWorkspaceRootUri(uri)) === null || _a === void 0 ? void 0 : _a.isEqual(uri))) {
            return label_provider_1.URIIconReference.create('folder', uri);
        }
        return element;
    }
    getUri(element) {
        if (files_1.FileStat.is(element)) {
            return element.resource;
        }
        return super.getUri(element);
    }
};
__decorate([
    (0, inversify_1.inject)(workspace_variable_contribution_1.WorkspaceVariableContribution),
    __metadata("design:type", workspace_variable_contribution_1.WorkspaceVariableContribution)
], WorkspaceUriLabelProviderContribution.prototype, "workspaceVariable", void 0);
__decorate([
    (0, inversify_1.inject)(workspace_service_1.WorkspaceService),
    __metadata("design:type", workspace_service_1.WorkspaceService)
], WorkspaceUriLabelProviderContribution.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WorkspaceUriLabelProviderContribution.prototype, "init", null);
WorkspaceUriLabelProviderContribution = __decorate([
    (0, inversify_1.injectable)()
], WorkspaceUriLabelProviderContribution);
exports.WorkspaceUriLabelProviderContribution = WorkspaceUriLabelProviderContribution;
//# sourceMappingURL=workspace-uri-contribution.js.map