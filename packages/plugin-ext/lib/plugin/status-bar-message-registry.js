"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusBarMessageRegistryExt = void 0;
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
const types_impl_1 = require("./types-impl");
const plugin_api_rpc_1 = require("../common/plugin-api-rpc");
const status_bar_item_1 = require("./status-bar/status-bar-item");
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
class StatusBarMessageRegistryExt {
    constructor(rpc) {
        this.proxy = rpc.getProxy(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.STATUS_BAR_MESSAGE_REGISTRY_MAIN);
        this.statusMessage = new StatusBarMessage(this);
    }
    // copied from https://github.com/Microsoft/vscode/blob/6c8f02b41db9ae5c4d15df767d47755e5c73b9d5/src/vs/workbench/api/node/extHostStatusBar.ts#L174
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setStatusBarMessage(text, timeoutOrThenable) {
        const d = this.statusMessage.setMessage(text);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let handle;
        if (typeof timeoutOrThenable === 'number') {
            handle = setTimeout(() => d.dispose(), timeoutOrThenable);
        }
        else if (typeof timeoutOrThenable !== 'undefined') {
            timeoutOrThenable.then(() => d.dispose(), () => d.dispose());
        }
        return new types_impl_1.Disposable(() => {
            d.dispose();
            clearTimeout(handle);
        });
    }
    createStatusBarItem(alignment, priority, id) {
        return new status_bar_item_1.StatusBarItemImpl(this.proxy, alignment, priority, id);
    }
}
exports.StatusBarMessageRegistryExt = StatusBarMessageRegistryExt;
// copied from https://github.com/Microsoft/vscode/blob/6c8f02b41db9ae5c4d15df767d47755e5c73b9d5/src/vs/workbench/api/node/extHostStatusBar.ts#L122
class StatusBarMessage {
    constructor(statusBar) {
        this._messages = [];
        this._item = statusBar.createStatusBarItem(types_impl_1.StatusBarAlignment.Left, Number.MIN_VALUE);
    }
    dispose() {
        this._messages.length = 0;
        this._item.dispose();
    }
    setMessage(message) {
        const data = { message }; // use object to not confuse equal strings
        this._messages.unshift(data);
        this._update();
        return new types_impl_1.Disposable(() => {
            const idx = this._messages.indexOf(data);
            if (idx >= 0) {
                this._messages.splice(idx, 1);
                this._update();
            }
        });
    }
    _update() {
        if (this._messages.length > 0) {
            this._item.text = this._messages[0].message;
            this._item.show();
        }
        else {
            this._item.hide();
        }
    }
}
//# sourceMappingURL=status-bar-message-registry.js.map