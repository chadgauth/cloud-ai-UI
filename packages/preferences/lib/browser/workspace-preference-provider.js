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
exports.WorkspacePreferenceProvider = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const inversify_1 = require("@theia/core/shared/inversify");
const disposable_1 = require("@theia/core/lib/common/disposable");
const preferences_1 = require("@theia/core/lib/browser/preferences");
const workspace_service_1 = require("@theia/workspace/lib/browser/workspace-service");
const workspace_file_preference_provider_1 = require("./workspace-file-preference-provider");
let WorkspacePreferenceProvider = class WorkspacePreferenceProvider extends preferences_1.PreferenceProvider {
    constructor() {
        super(...arguments);
        this.toDisposeOnEnsureDelegateUpToDate = new disposable_1.DisposableCollection();
    }
    init() {
        this.workspaceService.ready.then(() => {
            // If there is no workspace after the workspace service is initialized, then no more work is needed for this provider to be ready.
            // If there is a workspace, then we wait for the new delegate to be ready before declaring this provider ready.
            if (!this.workspaceService.workspace) {
                this._ready.resolve();
            }
        });
        this.workspaceService.onWorkspaceLocationChanged(() => this.ensureDelegateUpToDate());
        this.workspaceService.onWorkspaceChanged(() => this.ensureDelegateUpToDate());
    }
    getConfigUri(resourceUri = this.ensureResourceUri(), sectionName) {
        var _a;
        return (_a = this.delegate) === null || _a === void 0 ? void 0 : _a.getConfigUri(resourceUri, sectionName);
    }
    getContainingConfigUri(resourceUri = this.ensureResourceUri(), sectionName) {
        var _a, _b;
        return (_b = (_a = this.delegate) === null || _a === void 0 ? void 0 : _a.getContainingConfigUri) === null || _b === void 0 ? void 0 : _b.call(_a, resourceUri, sectionName);
    }
    get delegate() {
        return this._delegate;
    }
    ensureDelegateUpToDate() {
        const delegate = this.createDelegate();
        if (this._delegate !== delegate) {
            this.toDisposeOnEnsureDelegateUpToDate.dispose();
            this.toDispose.push(this.toDisposeOnEnsureDelegateUpToDate);
            this._delegate = delegate;
            if (delegate) {
                // If this provider has not yet declared itself ready, it should do so when the new delegate is ready.
                delegate.ready.then(() => this._ready.resolve(), () => { });
            }
            if (delegate instanceof workspace_file_preference_provider_1.WorkspaceFilePreferenceProvider) {
                this.toDisposeOnEnsureDelegateUpToDate.pushAll([
                    delegate,
                    delegate.onDidPreferencesChanged(changes => this.onDidPreferencesChangedEmitter.fire(changes))
                ]);
            }
        }
    }
    createDelegate() {
        const workspace = this.workspaceService.workspace;
        if (!workspace) {
            return undefined;
        }
        if (!this.workspaceService.isMultiRootWorkspaceOpened) {
            return this.folderPreferenceProvider;
        }
        if (this._delegate instanceof workspace_file_preference_provider_1.WorkspaceFilePreferenceProvider && this._delegate.getConfigUri().isEqual(workspace.resource)) {
            return this._delegate;
        }
        return this.workspaceFileProviderFactory({
            workspaceUri: workspace.resource
        });
    }
    get(preferenceName, resourceUri = this.ensureResourceUri()) {
        const delegate = this.delegate;
        return delegate ? delegate.get(preferenceName, resourceUri) : undefined;
    }
    resolve(preferenceName, resourceUri = this.ensureResourceUri()) {
        const delegate = this.delegate;
        return delegate ? delegate.resolve(preferenceName, resourceUri) : {};
    }
    getPreferences(resourceUri = this.ensureResourceUri()) {
        const delegate = this.delegate;
        return delegate ? delegate.getPreferences(resourceUri) : {};
    }
    async setPreference(preferenceName, value, resourceUri = this.ensureResourceUri()) {
        const delegate = this.delegate;
        if (delegate) {
            return delegate.setPreference(preferenceName, value, resourceUri);
        }
        return false;
    }
    ensureResourceUri() {
        if (this.workspaceService.workspace && !this.workspaceService.isMultiRootWorkspaceOpened) {
            return this.workspaceService.workspace.resource.toString();
        }
        return undefined;
    }
};
__decorate([
    (0, inversify_1.inject)(workspace_service_1.WorkspaceService),
    __metadata("design:type", workspace_service_1.WorkspaceService)
], WorkspacePreferenceProvider.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(workspace_file_preference_provider_1.WorkspaceFilePreferenceProviderFactory),
    __metadata("design:type", Function)
], WorkspacePreferenceProvider.prototype, "workspaceFileProviderFactory", void 0);
__decorate([
    (0, inversify_1.inject)(preferences_1.PreferenceProvider),
    (0, inversify_1.named)(preferences_1.PreferenceScope.Folder),
    __metadata("design:type", preferences_1.PreferenceProvider)
], WorkspacePreferenceProvider.prototype, "folderPreferenceProvider", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WorkspacePreferenceProvider.prototype, "init", null);
WorkspacePreferenceProvider = __decorate([
    (0, inversify_1.injectable)()
], WorkspacePreferenceProvider);
exports.WorkspacePreferenceProvider = WorkspacePreferenceProvider;
//# sourceMappingURL=workspace-preference-provider.js.map