"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageRegistryExt = void 0;
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
const plugin_api_rpc_1 = require("../common/plugin-api-rpc");
class MessageRegistryExt {
    constructor(rpc) {
        this.proxy = rpc.getProxy(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.MESSAGE_REGISTRY_MAIN);
    }
    async showMessage(type, message, optionsOrFirstItem, ...rest) {
        const options = {};
        const actions = [];
        const items = [];
        const pushItem = (item) => {
            items.push(item);
            if (typeof item === 'string') {
                actions.push({ title: item });
            }
            else {
                actions.push({ title: item.title, isCloseAffordance: item.isCloseAffordance });
                if (item.isCloseAffordance) {
                    options.onCloseActionHandle = actions.length - 1;
                }
            }
        };
        if (optionsOrFirstItem) {
            if (typeof optionsOrFirstItem === 'string' || 'title' in optionsOrFirstItem) {
                pushItem(optionsOrFirstItem);
            }
            else {
                if ('modal' in optionsOrFirstItem) {
                    options.modal = optionsOrFirstItem.modal;
                    if ('detail' in optionsOrFirstItem) {
                        options.detail = optionsOrFirstItem.detail;
                    }
                }
            }
        }
        for (const item of rest) {
            pushItem(item);
        }
        const actionHandle = await this.proxy.$showMessage(type, message, options, actions);
        return actionHandle !== undefined ? items[actionHandle] : undefined;
    }
}
exports.MessageRegistryExt = MessageRegistryExt;
//# sourceMappingURL=message-registry.js.map