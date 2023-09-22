"use strict";
// *****************************************************************************
// Copyright (C) 2019 Ericsson and others.
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
exports.FolderPreferenceProvider = exports.FolderPreferenceProviderFolder = exports.FolderPreferenceProviderFactory = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/core/lib/browser");
const files_1 = require("@theia/filesystem/lib/common/files");
const section_preference_provider_1 = require("./section-preference-provider");
exports.FolderPreferenceProviderFactory = Symbol('FolderPreferenceProviderFactory');
exports.FolderPreferenceProviderFolder = Symbol('FolderPreferenceProviderFolder');
let FolderPreferenceProvider = class FolderPreferenceProvider extends section_preference_provider_1.SectionPreferenceProvider {
    get folderUri() {
        if (!this._folderUri) {
            this._folderUri = this.folder.resource;
        }
        return this._folderUri;
    }
    getScope() {
        if (!this.workspaceService.isMultiRootWorkspaceOpened) {
            // when FolderPreferenceProvider is used as a delegate of WorkspacePreferenceProvider in a one-folder workspace
            return browser_1.PreferenceScope.Workspace;
        }
        return browser_1.PreferenceScope.Folder;
    }
    getDomain() {
        return [this.folderUri.toString()];
    }
};
__decorate([
    (0, inversify_1.inject)(exports.FolderPreferenceProviderFolder),
    __metadata("design:type", Object)
], FolderPreferenceProvider.prototype, "folder", void 0);
FolderPreferenceProvider = __decorate([
    (0, inversify_1.injectable)()
], FolderPreferenceProvider);
exports.FolderPreferenceProvider = FolderPreferenceProvider;
//# sourceMappingURL=folder-preference-provider.js.map