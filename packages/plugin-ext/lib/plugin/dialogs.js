"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DialogsExtImpl = void 0;
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
const types_impl_1 = require("./types-impl");
class DialogsExtImpl {
    constructor(rpc) {
        this.proxy = rpc.getProxy(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.DIALOGS_MAIN);
    }
    showOpenDialog(options) {
        const optionsMain = {
            title: options.title,
            openLabel: options.openLabel,
            defaultUri: options.defaultUri ? options.defaultUri.path : undefined,
            canSelectFiles: typeof options.canSelectFiles === 'boolean' ? options.canSelectFiles : true,
            canSelectFolders: typeof options.canSelectFolders === 'boolean' ? options.canSelectFolders : false,
            canSelectMany: options.canSelectMany,
            filters: options.filters
        };
        return new Promise((resolve, reject) => {
            this.proxy.$showOpenDialog(optionsMain).then(result => {
                if (result) {
                    const uris = [];
                    for (let i = 0; i < result.length; i++) {
                        const uri = types_impl_1.URI.parse('file://' + result[i]);
                        uris.push(uri);
                    }
                    resolve(uris);
                }
                else {
                    resolve(undefined);
                }
            }).catch(reason => {
                reject(reason);
            });
        });
    }
    showSaveDialog(options) {
        const optionsMain = {
            title: options.title,
            saveLabel: options.saveLabel,
            defaultUri: options.defaultUri ? options.defaultUri.path : undefined,
            filters: options.filters
        };
        return new Promise((resolve, reject) => {
            this.proxy.$showSaveDialog(optionsMain).then(result => {
                if (result) {
                    resolve(types_impl_1.URI.parse('file://' + result));
                }
                else {
                    resolve(undefined);
                }
            }).catch(reason => {
                reject(reason);
            });
        });
    }
    showUploadDialog(options) {
        const optionsMain = {
            defaultUri: options.defaultUri ? options.defaultUri.path : undefined
        };
        return new Promise((resolve, reject) => {
            this.proxy.$showUploadDialog(optionsMain).then(result => {
                if (result) {
                    resolve(result.map(uri => types_impl_1.URI.parse(uri)));
                }
                else {
                    resolve(undefined);
                }
            }).catch(reason => {
                reject(reason);
            });
        });
    }
}
exports.DialogsExtImpl = DialogsExtImpl;
//# sourceMappingURL=dialogs.js.map