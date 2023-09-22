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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WindowStateExtImpl = void 0;
const types_impl_1 = require("./types-impl");
const plugin_api_rpc_1 = require("../common/plugin-api-rpc");
const event_1 = require("@theia/core/lib/common/event");
const uri_components_1 = require("../common/uri-components");
class WindowStateExtImpl {
    constructor(rpc) {
        this.windowStateChangedEmitter = new event_1.Emitter();
        this.onDidChangeWindowState = this.windowStateChangedEmitter.event;
        this.proxy = rpc.getProxy(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.WINDOW_MAIN);
        this.windowStateCached = { focused: true }; // supposed tab is active on start
    }
    getWindowState() {
        return this.windowStateCached;
    }
    $onWindowStateChanged(focused) {
        const state = { focused: focused };
        if (state === this.windowStateCached) {
            return;
        }
        this.windowStateCached = state;
        this.windowStateChangedEmitter.fire(state);
    }
    openUri(uri) {
        return this.proxy.$openUri(uri);
    }
    async asExternalUri(target) {
        if (!target.scheme.trim().length) {
            throw new Error('Invalid scheme - cannot be empty');
        }
        if (uri_components_1.Schemes.http !== target.scheme && uri_components_1.Schemes.https !== target.scheme) {
            throw new Error(`Invalid scheme '${target.scheme}'`);
        }
        const uri = await this.proxy.$asExternalUri(target);
        return types_impl_1.URI.revive(uri);
    }
}
exports.WindowStateExtImpl = WindowStateExtImpl;
//# sourceMappingURL=window-state.js.map