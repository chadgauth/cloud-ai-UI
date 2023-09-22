"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecorationsMainImpl = void 0;
// *****************************************************************************
// Copyright (C) 2019 Red Hat, Inc. and others.
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
const plugin_api_rpc_1 = require("../../../common/plugin-api-rpc");
const event_1 = require("@theia/core/lib/common/event");
const vscode_uri_1 = require("@theia/core/shared/vscode-uri");
const cancellation_1 = require("@theia/core/lib/common/cancellation");
const uri_1 = require("@theia/core/lib/common/uri");
const decorations_service_1 = require("@theia/core/lib/browser/decorations-service");
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// some code copied and modified from https://github.com/microsoft/vscode/blob/1.52.1/src/vs/workbench/api/browser/mainThreadDecorations.ts#L85
class DecorationRequestsQueue {
    constructor(proxy, handle) {
        this.proxy = proxy;
        this.handle = handle;
        this.idPool = 0;
        this.requests = new Map();
        this.resolver = new Map();
    }
    enqueue(uri, token) {
        const id = ++this.idPool;
        const result = new Promise(resolve => {
            this.requests.set(id, { id, uri: vscode_uri_1.URI.parse(uri.toString()) });
            this.resolver.set(id, resolve);
            this.processQueue();
        });
        token.onCancellationRequested(() => {
            this.requests.delete(id);
            this.resolver.delete(id);
        });
        return result;
    }
    processQueue() {
        if (typeof this.timer === 'number') {
            // already queued
            return;
        }
        this.timer = setTimeout(() => {
            // make request
            const requests = this.requests;
            const resolver = this.resolver;
            this.proxy.$provideDecorations(this.handle, [...requests.values()], cancellation_1.CancellationToken.None).then(data => {
                for (const [id, resolve] of resolver) {
                    resolve(data[id]);
                }
            });
            // reset
            this.requests = new Map();
            this.resolver = new Map();
            this.timer = undefined;
        }, 0);
    }
}
class DecorationsMainImpl {
    constructor(rpc, container) {
        this.providers = new Map();
        this.proxy = rpc.getProxy(plugin_api_rpc_1.MAIN_RPC_CONTEXT.DECORATIONS_EXT);
        this.decorationsService = container.get(decorations_service_1.DecorationsService);
    }
    dispose() {
        this.providers.forEach(value => value.forEach(v => v.dispose()));
        this.providers.clear();
    }
    async $registerDecorationProvider(handle) {
        const emitter = new event_1.Emitter();
        const queue = new DecorationRequestsQueue(this.proxy, handle);
        const registration = this.decorationsService.registerDecorationsProvider({
            onDidChange: emitter.event,
            provideDecorations: async (uri, token) => {
                const data = await queue.enqueue(uri, token);
                if (!data) {
                    return undefined;
                }
                const [bubble, tooltip, letter, themeColor] = data;
                return {
                    weight: 10,
                    bubble: bubble !== null && bubble !== void 0 ? bubble : false,
                    colorId: themeColor === null || themeColor === void 0 ? void 0 : themeColor.id,
                    tooltip,
                    letter
                };
            }
        });
        this.providers.set(handle, [emitter, registration]);
    }
    $onDidChange(handle, resources) {
        const providerSet = this.providers.get(handle);
        if (providerSet) {
            const [emitter] = providerSet;
            emitter.fire(resources && resources.map(r => new uri_1.default(vscode_uri_1.URI.revive(r).toString())));
        }
    }
    $unregisterDecorationProvider(handle) {
        const provider = this.providers.get(handle);
        if (provider) {
            provider.forEach(p => p.dispose());
            this.providers.delete(handle);
        }
    }
}
exports.DecorationsMainImpl = DecorationsMainImpl;
//# sourceMappingURL=decorations-main.js.map