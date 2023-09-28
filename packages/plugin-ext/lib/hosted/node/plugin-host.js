"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
require("@theia/core/shared/reflect-metadata");
const rpc_protocol_1 = require("../../common/rpc-protocol");
const hosted_plugin_protocol_1 = require("./hosted-plugin-protocol");
const plugin_host_rpc_1 = require("./plugin-host-rpc");
const node_1 = require("@theia/core/lib/node");
console.log('PLUGIN_HOST(' + process.pid + ') starting instance');
// override exit() function, to do not allow plugin kill this node
process.exit = function (code) {
    const err = new Error('An plugin call process.exit() and it was prevented.');
    console.warn(err.stack);
};
// same for 'crash'(works only in electron)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const proc = process;
if (proc.crash) {
    proc.crash = function () {
        const err = new Error('An plugin call process.crash() and it was prevented.');
        console.warn(err.stack);
    };
}
process.on('uncaughtException', (err) => {
    console.error(err);
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const unhandledPromises = [];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
process.on('unhandledRejection', (reason, promise) => {
    unhandledPromises.push(promise);
    setTimeout(() => {
        const index = unhandledPromises.indexOf(promise);
        if (index >= 0) {
            promise.catch(err => {
                unhandledPromises.splice(index, 1);
                if (terminating && (rpc_protocol_1.ConnectionClosedError.is(err) || rpc_protocol_1.ConnectionClosedError.is(reason))) {
                    // during termination it is expected that pending rpc request are rejected
                    return;
                }
                console.error(`Promise rejection not handled in one second: ${err} , reason: ${reason}`);
                if (err && err.stack) {
                    console.error(`With stack trace: ${err.stack}`);
                }
            });
        }
    }, 1000);
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
process.on('rejectionHandled', (promise) => {
    const index = unhandledPromises.indexOf(promise);
    if (index >= 0) {
        unhandledPromises.splice(index, 1);
    }
});
let terminating = false;
const channel = new node_1.IPCChannel();
const rpc = new rpc_protocol_1.RPCProtocolImpl(channel);
process.on('message', async (message) => {
    if (terminating) {
        return;
    }
    try {
        const msg = JSON.parse(message);
        if (hosted_plugin_protocol_1.ProcessTerminateMessage.is(msg)) {
            terminating = true;
            if (msg.stopTimeout) {
                await Promise.race([
                    pluginHostRPC.terminate(),
                    new Promise(resolve => setTimeout(resolve, msg.stopTimeout))
                ]);
            }
            else {
                await pluginHostRPC.terminate();
            }
            rpc.dispose();
            if (process.send) {
                process.send(JSON.stringify({ type: hosted_plugin_protocol_1.ProcessTerminatedMessage.TYPE }));
            }
        }
    }
    catch (e) {
        console.error(e);
    }
});
const pluginHostRPC = new plugin_host_rpc_1.PluginHostRPC(rpc);
pluginHostRPC.initialize();
//# sourceMappingURL=plugin-host.js.map