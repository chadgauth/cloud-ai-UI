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
exports.DefaultDebugSessionFactory = exports.DebugSessionFactory = exports.DebugSessionContributionRegistryImpl = exports.DebugSessionContributionRegistry = exports.DebugSessionContribution = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const common_1 = require("@theia/core/lib/common");
const browser_1 = require("@theia/core/lib/browser");
const browser_2 = require("@theia/editor/lib/browser");
const terminal_service_1 = require("@theia/terminal/lib/browser/base/terminal-service");
const ws_connection_provider_1 = require("@theia/core/lib/browser/messaging/ws-connection-provider");
const debug_session_1 = require("./debug-session");
const breakpoint_manager_1 = require("./breakpoint/breakpoint-manager");
const output_channel_1 = require("@theia/output/lib/browser/output-channel");
const debug_preferences_1 = require("./debug-preferences");
const debug_session_connection_1 = require("./debug-session-connection");
const debug_service_1 = require("../common/debug-service");
const contribution_provider_1 = require("@theia/core/lib/common/contribution-provider");
const file_service_1 = require("@theia/filesystem/lib/browser/file-service");
const debug_contribution_1 = require("./debug-contribution");
const browser_3 = require("@theia/workspace/lib/browser");
/**
 * DebugSessionContribution symbol for DI.
 */
exports.DebugSessionContribution = Symbol('DebugSessionContribution');
/**
 * DebugSessionContributionRegistry symbol for DI.
 */
exports.DebugSessionContributionRegistry = Symbol('DebugSessionContributionRegistry');
let DebugSessionContributionRegistryImpl = class DebugSessionContributionRegistryImpl {
    constructor() {
        this.contribs = new Map();
    }
    init() {
        for (const contrib of this.contributions.getContributions()) {
            this.contribs.set(contrib.debugType, contrib);
        }
    }
    get(debugType) {
        return this.contribs.get(debugType);
    }
};
__decorate([
    (0, inversify_1.inject)(contribution_provider_1.ContributionProvider),
    (0, inversify_1.named)(exports.DebugSessionContribution),
    __metadata("design:type", Object)
], DebugSessionContributionRegistryImpl.prototype, "contributions", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DebugSessionContributionRegistryImpl.prototype, "init", null);
DebugSessionContributionRegistryImpl = __decorate([
    (0, inversify_1.injectable)()
], DebugSessionContributionRegistryImpl);
exports.DebugSessionContributionRegistryImpl = DebugSessionContributionRegistryImpl;
/**
 * DebugSessionFactory symbol for DI.
 */
exports.DebugSessionFactory = Symbol('DebugSessionFactory');
let DefaultDebugSessionFactory = class DefaultDebugSessionFactory {
    get(sessionId, options, parentSession) {
        const connection = new debug_session_connection_1.DebugSessionConnection(sessionId, () => new Promise(resolve => this.connectionProvider.openChannel(`${debug_service_1.DebugAdapterPath}/${sessionId}`, wsChannel => {
            resolve(new debug_service_1.ForwardingDebugChannel(wsChannel));
        }, { reconnecting: false })), this.getTraceOutputChannel());
        return new debug_session_1.DebugSession(sessionId, options, parentSession, connection, this.terminalService, this.editorManager, this.breakpoints, this.labelProvider, this.messages, this.fileService, this.debugContributionProvider, this.workspaceService);
    }
    getTraceOutputChannel() {
        if (this.debugPreferences['debug.trace']) {
            return this.outputChannelManager.getChannel('Debug adapters');
        }
    }
};
__decorate([
    (0, inversify_1.inject)(ws_connection_provider_1.WebSocketConnectionProvider),
    __metadata("design:type", ws_connection_provider_1.WebSocketConnectionProvider)
], DefaultDebugSessionFactory.prototype, "connectionProvider", void 0);
__decorate([
    (0, inversify_1.inject)(terminal_service_1.TerminalService),
    __metadata("design:type", Object)
], DefaultDebugSessionFactory.prototype, "terminalService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.EditorManager),
    __metadata("design:type", browser_2.EditorManager)
], DefaultDebugSessionFactory.prototype, "editorManager", void 0);
__decorate([
    (0, inversify_1.inject)(breakpoint_manager_1.BreakpointManager),
    __metadata("design:type", breakpoint_manager_1.BreakpointManager)
], DefaultDebugSessionFactory.prototype, "breakpoints", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.LabelProvider),
    __metadata("design:type", browser_1.LabelProvider)
], DefaultDebugSessionFactory.prototype, "labelProvider", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.MessageClient),
    __metadata("design:type", common_1.MessageClient)
], DefaultDebugSessionFactory.prototype, "messages", void 0);
__decorate([
    (0, inversify_1.inject)(output_channel_1.OutputChannelManager),
    __metadata("design:type", output_channel_1.OutputChannelManager)
], DefaultDebugSessionFactory.prototype, "outputChannelManager", void 0);
__decorate([
    (0, inversify_1.inject)(debug_preferences_1.DebugPreferences),
    __metadata("design:type", Object)
], DefaultDebugSessionFactory.prototype, "debugPreferences", void 0);
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], DefaultDebugSessionFactory.prototype, "fileService", void 0);
__decorate([
    (0, inversify_1.inject)(contribution_provider_1.ContributionProvider),
    (0, inversify_1.named)(debug_contribution_1.DebugContribution),
    __metadata("design:type", Object)
], DefaultDebugSessionFactory.prototype, "debugContributionProvider", void 0);
__decorate([
    (0, inversify_1.inject)(browser_3.WorkspaceService),
    __metadata("design:type", browser_3.WorkspaceService)
], DefaultDebugSessionFactory.prototype, "workspaceService", void 0);
DefaultDebugSessionFactory = __decorate([
    (0, inversify_1.injectable)()
], DefaultDebugSessionFactory);
exports.DefaultDebugSessionFactory = DefaultDebugSessionFactory;
//# sourceMappingURL=debug-session-contribution.js.map