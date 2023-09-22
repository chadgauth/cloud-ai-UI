"use strict";
// *****************************************************************************
// Copyright (C) 2021 Red Hat, Inc. and others.
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
exports.SecretStorageExt = exports.SecretsExtImpl = void 0;
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// code copied and modified from https://github.com/microsoft/vscode/blob/1.55.2/src/vs/workbench/api/common/extHostSecrets.ts
const plugin_api_rpc_1 = require("../common/plugin-api-rpc");
const event_1 = require("@theia/core/lib/common/event");
class SecretsExtImpl {
    constructor(rpc) {
        this.onDidChangePasswordEmitter = new event_1.Emitter();
        this.onDidChangePassword = this.onDidChangePasswordEmitter.event;
        this.proxy = rpc.getProxy(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.SECRETS_MAIN);
    }
    async $onDidChangePassword(e) {
        this.onDidChangePasswordEmitter.fire(e);
    }
    get(extensionId, key) {
        return this.proxy.$getPassword(extensionId, key);
    }
    store(extensionId, key, value) {
        return this.proxy.$setPassword(extensionId, key, value);
    }
    delete(extensionId, key) {
        return this.proxy.$deletePassword(extensionId, key);
    }
}
exports.SecretsExtImpl = SecretsExtImpl;
class SecretStorageExt {
    constructor(pluginDescription, secretState) {
        this.onDidChangeEmitter = new event_1.Emitter();
        this.onDidChange = this.onDidChangeEmitter.event;
        this.id = pluginDescription.model.id.toLowerCase();
        this.secretState = secretState;
        this.secretState.onDidChangePassword(e => {
            if (e.extensionId === this.id) {
                this.onDidChangeEmitter.fire({ key: e.key });
            }
        });
    }
    get(key) {
        return this.secretState.get(this.id, key);
    }
    store(key, value) {
        return this.secretState.store(this.id, key, value);
    }
    delete(key) {
        return this.secretState.delete(this.id, key);
    }
}
exports.SecretStorageExt = SecretStorageExt;
//# sourceMappingURL=secrets-ext.js.map