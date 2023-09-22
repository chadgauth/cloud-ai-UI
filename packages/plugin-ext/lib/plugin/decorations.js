"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecorationsExtImpl = void 0;
const plugin_api_rpc_1 = require("../common/plugin-api-rpc");
const types_impl_1 = require("./types-impl");
const path_1 = require("path");
class DecorationsExtImpl {
    constructor(rpc) {
        this.rpc = rpc;
        this.proxy = rpc.getProxy(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.DECORATIONS_MAIN);
        this.providersMap = new Map();
    }
    registerFileDecorationProvider(provider, pluginInfo) {
        const handle = DecorationsExtImpl.handle++;
        this.providersMap.set(handle, { provider, pluginInfo });
        this.proxy.$registerDecorationProvider(handle);
        const listener = provider.onDidChangeFileDecorations && provider.onDidChangeFileDecorations(e => {
            if (!e) {
                this.proxy.$onDidChange(handle, null);
                return;
            }
            const array = Array.isArray(e) ? e : [e];
            if (array.length <= DecorationsExtImpl.maxEventSize) {
                this.proxy.$onDidChange(handle, array);
                return;
            }
            // too many resources per event. pick one resource per folder, starting
            // with parent folders
            const mapped = array.map(uri => ({ uri, rank: (uri.path.match(/\//g) || []).length }));
            const groups = groupBy(mapped, (a, b) => a.rank - b.rank);
            const picked = [];
            outer: for (const uris of groups) {
                let lastDirname;
                for (const obj of uris) {
                    const myDirname = (0, path_1.dirname)(obj.uri.path);
                    if (lastDirname !== myDirname) {
                        lastDirname = myDirname;
                        if (picked.push(obj.uri) >= DecorationsExtImpl.maxEventSize) {
                            break outer;
                        }
                    }
                }
            }
            this.proxy.$onDidChange(handle, picked);
        });
        return new types_impl_1.Disposable(() => {
            listener === null || listener === void 0 ? void 0 : listener.dispose();
            this.proxy.$unregisterDecorationProvider(handle);
            this.providersMap.delete(handle);
        });
        function groupBy(data, compareFn) {
            const result = [];
            let currentGroup = undefined;
            for (const element of data.slice(0).sort(compareFn)) {
                if (!currentGroup || compareFn(currentGroup[0], element) !== 0) {
                    currentGroup = [element];
                    result.push(currentGroup);
                }
                else {
                    currentGroup.push(element);
                }
            }
            return result;
        }
    }
    async $provideDecorations(handle, requests, token) {
        if (!this.providersMap.has(handle)) {
            // might have been unregistered in the meantime
            return Object.create(null);
        }
        const result = Object.create(null);
        const { provider, pluginInfo } = this.providersMap.get(handle);
        await Promise.all(requests.map(async (request) => {
            try {
                const { uri, id } = request;
                const data = await Promise.resolve(provider.provideFileDecoration(types_impl_1.URI.revive(uri), token));
                if (!data) {
                    return;
                }
                try {
                    types_impl_1.FileDecoration.validate(data);
                    result[id] = [data.propagate, data.tooltip, data.badge, data.color];
                }
                catch (e) {
                    console.warn(`INVALID decoration from extension '${pluginInfo.name}': ${e}`);
                }
            }
            catch (err) {
                console.error(err);
            }
        }));
        return result;
    }
}
exports.DecorationsExtImpl = DecorationsExtImpl;
DecorationsExtImpl.handle = 0;
DecorationsExtImpl.maxEventSize = 250;
//# sourceMappingURL=decorations.js.map