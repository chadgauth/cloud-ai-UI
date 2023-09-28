"use strict";
// *****************************************************************************
// Copyright (C) 2021 EclipseSource and others.
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
exports.WorkspaceTrustService = void 0;
const browser_1 = require("@theia/core/lib/browser");
const preference_service_1 = require("@theia/core/lib/browser/preferences/preference-service");
const message_service_1 = require("@theia/core/lib/common/message-service");
const nls_1 = require("@theia/core/lib/common/nls");
const promise_util_1 = require("@theia/core/lib/common/promise-util");
const inversify_1 = require("@theia/core/shared/inversify");
const window_service_1 = require("@theia/core/lib/browser/window/window-service");
const workspace_trust_preferences_1 = require("./workspace-trust-preferences");
const frontend_application_config_provider_1 = require("@theia/core/lib/browser/frontend-application-config-provider");
const workspace_service_1 = require("./workspace-service");
const STORAGE_TRUSTED = 'trusted';
let WorkspaceTrustService = class WorkspaceTrustService {
    constructor() {
        this.workspaceTrust = new promise_util_1.Deferred();
    }
    init() {
        this.doInit();
    }
    async doInit() {
        await this.workspaceService.ready;
        await this.resolveWorkspaceTrust();
        this.preferences.onPreferenceChanged(change => this.handlePreferenceChange(change));
    }
    getWorkspaceTrust() {
        return this.workspaceTrust.promise;
    }
    async resolveWorkspaceTrust(givenTrust) {
        if (!this.isWorkspaceTrustResolved()) {
            const trust = givenTrust !== null && givenTrust !== void 0 ? givenTrust : await this.calculateWorkspaceTrust();
            if (trust !== undefined) {
                await this.storeWorkspaceTrust(trust);
                this.workspaceTrust.resolve(trust);
            }
        }
    }
    isWorkspaceTrustResolved() {
        return this.workspaceTrust.state !== 'unresolved';
    }
    async calculateWorkspaceTrust() {
        if (!this.workspaceTrustPref[workspace_trust_preferences_1.WORKSPACE_TRUST_ENABLED]) {
            // in VS Code if workspace trust is disabled, we implicitly trust the workspace
            return true;
        }
        if (this.workspaceTrustPref[workspace_trust_preferences_1.WORKSPACE_TRUST_EMPTY_WINDOW] && !this.workspaceService.workspace) {
            return true;
        }
        if (this.workspaceTrustPref[workspace_trust_preferences_1.WORKSPACE_TRUST_STARTUP_PROMPT] === workspace_trust_preferences_1.WorkspaceTrustPrompt.NEVER) {
            return false;
        }
        return this.loadWorkspaceTrust();
    }
    async loadWorkspaceTrust() {
        if (this.workspaceTrustPref[workspace_trust_preferences_1.WORKSPACE_TRUST_STARTUP_PROMPT] === workspace_trust_preferences_1.WorkspaceTrustPrompt.ONCE) {
            return this.storage.getData(STORAGE_TRUSTED);
        }
    }
    async storeWorkspaceTrust(trust) {
        if (this.workspaceTrustPref[workspace_trust_preferences_1.WORKSPACE_TRUST_STARTUP_PROMPT] === workspace_trust_preferences_1.WorkspaceTrustPrompt.ONCE) {
            return this.storage.setData(STORAGE_TRUSTED, trust);
        }
    }
    async handlePreferenceChange(change) {
        if (change.preferenceName === workspace_trust_preferences_1.WORKSPACE_TRUST_STARTUP_PROMPT && change.newValue !== workspace_trust_preferences_1.WorkspaceTrustPrompt.ONCE) {
            this.storage.setData(STORAGE_TRUSTED, undefined);
        }
        if (change.preferenceName === workspace_trust_preferences_1.WORKSPACE_TRUST_ENABLED && this.isWorkspaceTrustResolved() && await this.confirmRestart()) {
            this.windowService.setSafeToShutDown();
            this.windowService.reload();
        }
        if (change.preferenceName === workspace_trust_preferences_1.WORKSPACE_TRUST_ENABLED || change.preferenceName === workspace_trust_preferences_1.WORKSPACE_TRUST_EMPTY_WINDOW) {
            this.resolveWorkspaceTrust();
        }
    }
    async confirmRestart() {
        const shouldRestart = await new browser_1.ConfirmDialog({
            title: nls_1.nls.localizeByDefault('A setting has changed that requires a restart to take effect.'),
            msg: nls_1.nls.localizeByDefault('Press the restart button to restart {0} and enable the setting.', frontend_application_config_provider_1.FrontendApplicationConfigProvider.get().applicationName),
            ok: nls_1.nls.localizeByDefault('Restart'),
            cancel: browser_1.Dialog.CANCEL,
        }).open();
        return shouldRestart === true;
    }
    async requestWorkspaceTrust() {
        if (!this.isWorkspaceTrustResolved()) {
            const isTrusted = await this.messageService.info(nls_1.nls.localize('theia/workspace/trustRequest', 'An extension requests workspace trust but the corresponding API is not yet fully supported. Do you want to trust this workspace?'), browser_1.Dialog.YES, browser_1.Dialog.NO);
            const trusted = isTrusted === browser_1.Dialog.YES;
            this.resolveWorkspaceTrust(trusted);
        }
        return this.workspaceTrust.promise;
    }
};
__decorate([
    (0, inversify_1.inject)(workspace_service_1.WorkspaceService),
    __metadata("design:type", workspace_service_1.WorkspaceService)
], WorkspaceTrustService.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(preference_service_1.PreferenceService),
    __metadata("design:type", Object)
], WorkspaceTrustService.prototype, "preferences", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.StorageService),
    __metadata("design:type", Object)
], WorkspaceTrustService.prototype, "storage", void 0);
__decorate([
    (0, inversify_1.inject)(message_service_1.MessageService),
    __metadata("design:type", message_service_1.MessageService)
], WorkspaceTrustService.prototype, "messageService", void 0);
__decorate([
    (0, inversify_1.inject)(workspace_trust_preferences_1.WorkspaceTrustPreferences),
    __metadata("design:type", Object)
], WorkspaceTrustService.prototype, "workspaceTrustPref", void 0);
__decorate([
    (0, inversify_1.inject)(window_service_1.WindowService),
    __metadata("design:type", Object)
], WorkspaceTrustService.prototype, "windowService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WorkspaceTrustService.prototype, "init", null);
WorkspaceTrustService = __decorate([
    (0, inversify_1.injectable)()
], WorkspaceTrustService);
exports.WorkspaceTrustService = WorkspaceTrustService;
//# sourceMappingURL=workspace-trust-service.js.map