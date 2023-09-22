"use strict";
// *****************************************************************************
// Copyright (C) 2020 Red Hat, Inc. and others.
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationExtImpl = void 0;
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// code copied and modified from https://github.com/microsoft/vscode/blob/1.47.3/src/vs/workbench/api/common/extHostAuthentication.ts
const types_impl_1 = require("./types-impl");
const plugin_api_rpc_1 = require("../common/plugin-api-rpc");
const event_1 = require("@theia/core/lib/common/event");
class AuthenticationExtImpl {
    constructor(rpc) {
        this.authenticationProviders = new Map();
        this.onDidChangeSessionsEmitter = new event_1.Emitter();
        this.onDidChangeSessions = this.onDidChangeSessionsEmitter.event;
        this.proxy = rpc.getProxy(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.AUTHENTICATION_MAIN);
    }
    async getSession(requestingExtension, providerId, scopes, options = {}) {
        const extensionName = requestingExtension.model.displayName || requestingExtension.model.name;
        const extensionId = requestingExtension.model.id.toLowerCase();
        return this.proxy.$getSession(providerId, scopes, extensionId, extensionName, options);
    }
    registerAuthenticationProvider(id, label, provider, options) {
        if (this.authenticationProviders.get(id)) {
            throw new Error(`An authentication provider with id '${id}' is already registered.`);
        }
        this.authenticationProviders.set(id, provider);
        const listener = provider.onDidChangeSessions(e => {
            this.proxy.$onDidChangeSessions(id, e);
        });
        this.proxy.$registerAuthenticationProvider(id, label, !!(options === null || options === void 0 ? void 0 : options.supportsMultipleAccounts));
        return new types_impl_1.Disposable(() => {
            listener.dispose();
            this.authenticationProviders.delete(id);
            this.proxy.$unregisterAuthenticationProvider(id);
        });
    }
    $createSession(providerId, scopes) {
        const authProvider = this.authenticationProviders.get(providerId);
        if (authProvider) {
            return Promise.resolve(authProvider.createSession(scopes));
        }
        throw new Error(`Unable to find authentication provider with handle: ${providerId}`);
    }
    $removeSession(providerId, sessionId) {
        const authProvider = this.authenticationProviders.get(providerId);
        if (authProvider) {
            return Promise.resolve(authProvider.removeSession(sessionId));
        }
        throw new Error(`Unable to find authentication provider with handle: ${providerId}`);
    }
    async $getSessions(providerId, scopes) {
        const authProvider = this.authenticationProviders.get(providerId);
        if (authProvider) {
            const sessions = await authProvider.getSessions(scopes);
            /* Wrap the session object received from the plugin to prevent serialization mismatches
            e.g. if the plugin object is constructed with the help of getters they won't be serialized:
            class SessionImpl implements AuthenticationSession {
                private _id;
                get id() {
                    return _id;
                }
            ...
            } will translate to JSON as { _id: '<sessionid>' } not { id: '<sessionid>' } */
            return sessions.map(session => ({
                id: session.id,
                accessToken: session.accessToken,
                account: { id: session.account.id, label: session.account.label },
                scopes: session.scopes
            }));
        }
        throw new Error(`Unable to find authentication provider with handle: ${providerId}`);
    }
    async $onDidChangeAuthenticationSessions(provider) {
        this.onDidChangeSessionsEmitter.fire({ provider });
    }
}
exports.AuthenticationExtImpl = AuthenticationExtImpl;
//# sourceMappingURL=authentication-ext.js.map