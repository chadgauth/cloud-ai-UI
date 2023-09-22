"use strict";
/********************************************************************************
 * Copyright (C) 2021 Ericsson and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0
 ********************************************************************************/
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
exports.MemoryProviderService = void 0;
const core_1 = require("@theia/core");
const inversify_1 = require("@theia/core/shared/inversify");
const debug_session_manager_1 = require("@theia/debug/lib/browser/debug-session-manager");
const memory_provider_1 = require("./memory-provider");
const nls_1 = require("@theia/core/lib/common/nls");
let MemoryProviderService = class MemoryProviderService {
    readMemory(readMemoryArguments) {
        const readError = nls_1.nls.localize('theia/memory-inspector/provider/readError', 'Cannot read memory. No active debug session.');
        const session = this.getSession(readError);
        if (!session.capabilities.supportsReadMemoryRequest) {
            throw new Error('Cannot read memory. The current session does not support the request.');
        }
        const provider = this.getProvider(session);
        return provider.readMemory(session, readMemoryArguments);
    }
    writeMemory(writeMemoryArguments) {
        const writeError = nls_1.nls.localize('theia/memory-inspector/provider/writeError', 'Cannot write memory. No active debug session.');
        const session = this.getSession(writeError);
        if (!session.capabilities.supportsWriteMemoryRequest) {
            throw new Error('Cannot write memory. The current session does not support the request.');
        }
        const provider = this.getProvider(session, 'writeMemory');
        return provider.writeMemory(session, writeMemoryArguments);
    }
    getLocals() {
        const localsError = nls_1.nls.localize('theia/memory-inspector/provider/localsError', 'Cannot read local variables. No active debug session.');
        const session = this.getSession(localsError);
        const provider = this.getProvider(session, 'getLocals');
        return provider.getLocals(session);
    }
    supportsVariableReferenceSyntax(variable) {
        if (!this.sessionManager.currentSession) {
            return false;
        }
        const provider = this.getProvider(this.sessionManager.currentSession, 'supportsVariableReferenceSyntax');
        return provider.supportsVariableReferenceSyntax(this.sessionManager.currentSession, variable);
    }
    formatVariableReference(variable) {
        if (!this.sessionManager.currentSession) {
            return '';
        }
        const provider = this.getProvider(this.sessionManager.currentSession, 'formatVariableReference');
        return provider.formatVariableReference(this.sessionManager.currentSession, variable);
    }
    /** @throws with {@link message} if there is no active debug session. */
    getSession(message) {
        if (this.sessionManager.currentSession) {
            return this.sessionManager.currentSession;
        }
        throw new Error(message);
    }
    getProvider(session, ensure) {
        var _a;
        return (_a = this.contributions.getContributions()
            .find((candidate) => Boolean(!ensure || candidate[ensure]) && candidate.canHandle(session))) !== null && _a !== void 0 ? _a : this.defaultProvider;
    }
};
__decorate([
    (0, inversify_1.inject)(debug_session_manager_1.DebugSessionManager),
    __metadata("design:type", debug_session_manager_1.DebugSessionManager)
], MemoryProviderService.prototype, "sessionManager", void 0);
__decorate([
    (0, inversify_1.inject)(memory_provider_1.DefaultMemoryProvider),
    __metadata("design:type", memory_provider_1.DefaultMemoryProvider)
], MemoryProviderService.prototype, "defaultProvider", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.ContributionProvider),
    (0, inversify_1.named)(memory_provider_1.MemoryProvider),
    __metadata("design:type", Object)
], MemoryProviderService.prototype, "contributions", void 0);
MemoryProviderService = __decorate([
    (0, inversify_1.injectable)()
], MemoryProviderService);
exports.MemoryProviderService = MemoryProviderService;
//# sourceMappingURL=memory-provider-service.js.map