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
exports.DebugAdapterSessionManager = void 0;
const coreutils_1 = require("@theia/core/shared/@phosphor/coreutils");
const inversify_1 = require("@theia/core/shared/inversify");
const debug_service_1 = require("../common/debug-service");
const debug_model_1 = require("../common/debug-model");
/**
 * Debug adapter session manager.
 */
let DebugAdapterSessionManager = class DebugAdapterSessionManager {
    constructor() {
        this.sessions = new Map();
    }
    configure(service) {
        service.wsChannel(`${debug_service_1.DebugAdapterPath}/:id`, ({ id }, wsChannel) => {
            const session = this.find(id);
            if (!session) {
                wsChannel.close();
                return;
            }
            session.start(new debug_service_1.ForwardingDebugChannel(wsChannel));
        });
    }
    /**
     * Creates a new [debug adapter session](#DebugAdapterSession).
     * @param config The [DebugConfiguration](#DebugConfiguration)
     * @returns The debug adapter session
     */
    async create(config, registry) {
        const sessionId = coreutils_1.UUID.uuid4();
        let communicationProvider;
        if ('debugServer' in config) {
            communicationProvider = this.debugAdapterFactory.connect(config.debugServer);
        }
        else {
            const executable = await registry.provideDebugAdapterExecutable(config);
            communicationProvider = this.debugAdapterFactory.start(executable);
        }
        const sessionFactory = registry.debugAdapterSessionFactory(config.type) || this.debugAdapterSessionFactory;
        const session = sessionFactory.get(sessionId, communicationProvider);
        this.sessions.set(sessionId, session);
        if (config.parentSession) {
            const parentSession = this.sessions.get(config.parentSession.id);
            if (parentSession) {
                session.parentSession = parentSession;
            }
        }
        return session;
    }
    /**
     * Removes [debug adapter session](#DebugAdapterSession) from the list of the instantiated sessions.
     * Is invoked when session is terminated and isn't needed anymore.
     * @param sessionId The session identifier
     */
    remove(sessionId) {
        this.sessions.delete(sessionId);
    }
    /**
     * Finds the debug adapter session by its id.
     * Returning the value 'undefined' means the session isn't found.
     * @param sessionId The session identifier
     * @returns The debug adapter session
     */
    find(sessionId) {
        return this.sessions.get(sessionId);
    }
    /**
     * Returns all instantiated debug adapter sessions.
     * @returns An array of debug adapter sessions
     */
    getAll() {
        return this.sessions.values();
    }
};
__decorate([
    (0, inversify_1.inject)(debug_model_1.DebugAdapterSessionFactory),
    __metadata("design:type", Object)
], DebugAdapterSessionManager.prototype, "debugAdapterSessionFactory", void 0);
__decorate([
    (0, inversify_1.inject)(debug_model_1.DebugAdapterFactory),
    __metadata("design:type", Object)
], DebugAdapterSessionManager.prototype, "debugAdapterFactory", void 0);
DebugAdapterSessionManager = __decorate([
    (0, inversify_1.injectable)()
], DebugAdapterSessionManager);
exports.DebugAdapterSessionManager = DebugAdapterSessionManager;
//# sourceMappingURL=debug-adapter-session-manager.js.map