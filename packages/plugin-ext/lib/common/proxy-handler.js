"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RpcInvocationHandler = exports.ClientProxyHandler = void 0;
/********************************************************************************
 * Copyright (C) 2022 STMicroelectronics and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0
 ********************************************************************************/
/* eslint-disable @typescript-eslint/no-explicit-any */
const core_1 = require("@theia/core/");
const promise_util_1 = require("@theia/core/lib/common/promise-util");
/**
 * A proxy handler that will send any method invocation on the proxied object
 * as a rcp protocol message over a channel.
 */
class ClientProxyHandler {
    constructor(options) {
        this.rpcDeferred = new promise_util_1.Deferred();
        this.isRpcInitialized = false;
        Object.assign(this, options);
    }
    initializeRpc() {
        const clientOptions = { encoder: this.encoder, decoder: this.decoder, mode: 'clientOnly' };
        this.channelProvider().then(channel => {
            const rpc = new core_1.RpcProtocol(channel, undefined, clientOptions);
            this.rpcDeferred.resolve(rpc);
            this.isRpcInitialized = true;
        });
    }
    get(target, name, receiver) {
        if (!this.isRpcInitialized) {
            this.initializeRpc();
        }
        if (target[name] || name.charCodeAt(0) !== 36 /* CharCode.DollarSign */) {
            return target[name];
        }
        const isNotify = this.isNotification(name);
        return (...args) => {
            const method = name.toString();
            return this.rpcDeferred.promise.then(async (connection) => {
                if (isNotify) {
                    connection.sendNotification(method, args);
                }
                else {
                    return await connection.sendRequest(method, args);
                }
            });
        };
    }
    /**
     * Return whether the given property represents a notification. If true,
     * the promise returned from the invocation will resolve immediately to `undefined`
     *
     * A property leads to a notification rather than a method call if its name
     * begins with `notify` or `on`.
     *
     * @param p - The property being called on the proxy.
     * @return Whether `p` represents a notification.
     */
    isNotification(p) {
        let propertyString = p.toString();
        if (propertyString.charCodeAt(0) === 36 /* CharCode.DollarSign */) {
            propertyString = propertyString.substring(1);
        }
        return propertyString.startsWith('notify') || propertyString.startsWith('on');
    }
}
exports.ClientProxyHandler = ClientProxyHandler;
class RpcInvocationHandler {
    constructor(options) {
        this.rpcDeferred = new promise_util_1.Deferred();
        Object.assign(this, options);
    }
    listen(channel) {
        const serverOptions = { encoder: this.encoder, decoder: this.decoder, mode: 'serverOnly' };
        const server = new core_1.RpcProtocol(channel, (method, args) => this.handleRequest(method, args), serverOptions);
        server.onNotification((e) => this.onNotification(e.method, e.args));
        this.rpcDeferred.resolve(server);
    }
    handleRequest(method, args) {
        return this.rpcDeferred.promise.then(() => this.target[method](...args));
    }
    onNotification(method, args) {
        this.target[method](...args);
    }
}
exports.RpcInvocationHandler = RpcInvocationHandler;
//# sourceMappingURL=proxy-handler.js.map