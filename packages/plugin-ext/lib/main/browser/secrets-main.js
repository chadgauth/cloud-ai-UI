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
exports.SecretsMainImpl = void 0;
const common_1 = require("../../common");
const credentials_service_1 = require("@theia/core/lib/browser/credentials-service");
class SecretsMainImpl {
    constructor(rpc, container) {
        this.proxy = rpc.getProxy(common_1.MAIN_RPC_CONTEXT.SECRETS_EXT);
        this.credentialsService = container.get(credentials_service_1.CredentialsService);
        this.credentialsService.onDidChangePassword(e => {
            const extensionId = e.service.substring(window.location.hostname.length + 1);
            this.proxy.$onDidChangePassword({ extensionId, key: e.account });
        });
    }
    static getFullKey(extensionId) {
        return `${window.location.hostname}-${extensionId}`;
    }
    async $getPassword(extensionId, key) {
        const fullKey = SecretsMainImpl.getFullKey(extensionId);
        const passwordData = await this.credentialsService.getPassword(fullKey, key);
        if (passwordData) {
            try {
                const data = JSON.parse(passwordData);
                if (data.extensionId === extensionId) {
                    return data.content;
                }
            }
            catch (e) {
                throw new Error('Cannot get password');
            }
        }
        return undefined;
    }
    async $setPassword(extensionId, key, value) {
        const fullKey = SecretsMainImpl.getFullKey(extensionId);
        const passwordData = JSON.stringify({
            extensionId,
            content: value
        });
        return this.credentialsService.setPassword(fullKey, key, passwordData);
    }
    async $deletePassword(extensionId, key) {
        try {
            const fullKey = SecretsMainImpl.getFullKey(extensionId);
            await this.credentialsService.deletePassword(fullKey, key);
        }
        catch (e) {
            throw new Error('Cannot delete password');
        }
    }
}
exports.SecretsMainImpl = SecretsMainImpl;
//# sourceMappingURL=secrets-main.js.map