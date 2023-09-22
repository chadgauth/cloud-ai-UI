"use strict";
// *****************************************************************************
// Copyright (C) 2019 TypeFox and others.
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
exports.WorkspaceBreadcrumbsContribution = void 0;
const filepath_breadcrumbs_contribution_1 = require("@theia/filesystem/lib/browser/breadcrumbs/filepath-breadcrumbs-contribution");
const inversify_1 = require("@theia/core/shared/inversify");
const workspace_service_1 = require("./workspace-service");
let WorkspaceBreadcrumbsContribution = class WorkspaceBreadcrumbsContribution extends filepath_breadcrumbs_contribution_1.FilepathBreadcrumbsContribution {
    getContainerClassCreator(fileURI) {
        const workspaceRoot = this.workspaceService.getWorkspaceRootUri(fileURI);
        return (location, index) => {
            if (location.isEqual(fileURI)) {
                return 'file';
            }
            else if (workspaceRoot === null || workspaceRoot === void 0 ? void 0 : workspaceRoot.isEqual(location)) {
                return 'root_folder';
            }
            return 'folder';
        };
    }
    getIconClassCreator(fileURI) {
        const workspaceRoot = this.workspaceService.getWorkspaceRootUri(fileURI);
        return (location, index) => {
            if (location.isEqual(fileURI) || (workspaceRoot === null || workspaceRoot === void 0 ? void 0 : workspaceRoot.isEqual(location))) {
                return this.labelProvider.getIcon(location) + ' file-icon';
            }
            return '';
        };
    }
    filterBreadcrumbs(uri, breadcrumb) {
        const workspaceRootUri = this.workspaceService.getWorkspaceRootUri(uri);
        const firstCrumbToHide = this.workspaceService.isMultiRootWorkspaceOpened ? workspaceRootUri === null || workspaceRootUri === void 0 ? void 0 : workspaceRootUri.parent : workspaceRootUri;
        return super.filterBreadcrumbs(uri, breadcrumb) && (!firstCrumbToHide || !breadcrumb.uri.isEqualOrParent(firstCrumbToHide));
    }
};
__decorate([
    (0, inversify_1.inject)(workspace_service_1.WorkspaceService),
    __metadata("design:type", workspace_service_1.WorkspaceService)
], WorkspaceBreadcrumbsContribution.prototype, "workspaceService", void 0);
WorkspaceBreadcrumbsContribution = __decorate([
    (0, inversify_1.injectable)()
], WorkspaceBreadcrumbsContribution);
exports.WorkspaceBreadcrumbsContribution = WorkspaceBreadcrumbsContribution;
//# sourceMappingURL=workspace-breadcrumbs-contribution.js.map