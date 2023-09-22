"use strict";
// *****************************************************************************
// Copyright (C) 2018 Red Hat, Inc. and others.
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
exports.DebugServiceImpl = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const debug_adapter_session_manager_1 = require("./debug-adapter-session-manager");
const debug_adapter_contribution_registry_1 = require("../common/debug-adapter-contribution-registry");
const core_1 = require("@theia/core");
/**
 * DebugService implementation.
 */
let DebugServiceImpl = class DebugServiceImpl {
    constructor() {
        this.sessions = new Set();
    }
    get onDidChangeDebugConfigurationProviders() {
        return core_1.Event.None;
    }
    dispose() {
        this.terminateDebugSession();
    }
    async debugTypes() {
        return this.registry.debugTypes();
    }
    getDebuggersForLanguage(language) {
        return this.registry.getDebuggersForLanguage(language);
    }
    getSchemaAttributes(debugType) {
        return this.registry.getSchemaAttributes(debugType);
    }
    getConfigurationSnippets() {
        return this.registry.getConfigurationSnippets();
    }
    async provideDebuggerVariables(debugType) {
        // TODO: Support resolution of variables map through Theia extensions?
        return {};
    }
    async provideDebugConfigurations(debugType, workspaceFolderUri) {
        return this.registry.provideDebugConfigurations(debugType, workspaceFolderUri);
    }
    async provideDynamicDebugConfigurations() {
        // TODO: Support dynamic debug configurations through Theia extensions?
        return {};
    }
    fetchDynamicDebugConfiguration(name, type, folder) {
        // TODO: Support dynamic debug configurations through Theia extensions?
        return Promise.resolve(undefined);
    }
    async resolveDebugConfiguration(config, workspaceFolderUri) {
        return this.registry.resolveDebugConfiguration(config, workspaceFolderUri);
    }
    async resolveDebugConfigurationWithSubstitutedVariables(config, workspaceFolderUri) {
        return this.registry.resolveDebugConfigurationWithSubstitutedVariables(config, workspaceFolderUri);
    }
    async createDebugSession(config, _workspaceFolderUri) {
        const session = await this.sessionManager.create(config, this.registry);
        this.sessions.add(session.id);
        return session.id;
    }
    async terminateDebugSession(sessionId) {
        if (sessionId) {
            await this.doStop(sessionId);
        }
        else {
            const promises = [];
            const sessions = [...this.sessions];
            this.sessions.clear();
            for (const session of sessions) {
                promises.push((async () => {
                    try {
                        await this.doStop(session);
                    }
                    catch (e) {
                        console.error('terminateDebugSession failed:', e);
                    }
                })());
            }
            await Promise.all(promises);
        }
    }
    async doStop(sessionId) {
        const debugSession = this.sessionManager.find(sessionId);
        if (debugSession) {
            this.sessionManager.remove(sessionId);
            this.sessions.delete(sessionId);
            await debugSession.stop();
        }
    }
};
__decorate([
    (0, inversify_1.inject)(debug_adapter_session_manager_1.DebugAdapterSessionManager),
    __metadata("design:type", debug_adapter_session_manager_1.DebugAdapterSessionManager)
], DebugServiceImpl.prototype, "sessionManager", void 0);
__decorate([
    (0, inversify_1.inject)(debug_adapter_contribution_registry_1.DebugAdapterContributionRegistry),
    __metadata("design:type", debug_adapter_contribution_registry_1.DebugAdapterContributionRegistry)
], DebugServiceImpl.prototype, "registry", void 0);
DebugServiceImpl = __decorate([
    (0, inversify_1.injectable)()
], DebugServiceImpl);
exports.DebugServiceImpl = DebugServiceImpl;
//# sourceMappingURL=debug-service-impl.js.map