"use strict";
// *****************************************************************************
// Copyright (C) 2017 TypeFox and others.
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
exports.JsonRpcProxyFactory = exports.JsonRpcConnectionHandler = exports.RpcProxyFactory = exports.RpcConnectionHandler = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const rpc_message_encoder_1 = require("../message-rpc/rpc-message-encoder");
const application_error_1 = require("../application-error");
const event_1 = require("../event");
const rpc_protocol_1 = require("../message-rpc/rpc-protocol");
const promise_util_1 = require("../promise-util");
const inversify_1 = require("../../../shared/inversify");
class RpcConnectionHandler {
    constructor(path, targetFactory, factoryConstructor = RpcProxyFactory) {
        this.path = path;
        this.targetFactory = targetFactory;
        this.factoryConstructor = factoryConstructor;
    }
    onConnection(connection) {
        const factory = new this.factoryConstructor();
        const proxy = factory.createProxy();
        factory.target = this.targetFactory(proxy);
        factory.listen(connection);
    }
}
exports.RpcConnectionHandler = RpcConnectionHandler;
const defaultRpcProtocolFactory = (channel, requestHandler) => new rpc_protocol_1.RpcProtocol(channel, requestHandler);
/**
 * Factory for RPC proxy objects.
 *
 * A RPC proxy exposes the programmatic interface of an object through
 * Theia's RPC protocol. This allows remote programs to call methods of this objects by
 * sending RPC requests. This takes place over a bi-directional stream,
 * where both ends can expose an object and both can call methods on each other'
 * exposed object.
 *
 * For example, assuming we have an object of the following type on one end:
 *
 *     class Foo {
 *         bar(baz: number): number { return baz + 1 }
 *     }
 *
 * which we want to expose through a RPC interface.  We would do:
 *
 *     let target = new Foo()
 *     let factory = new RpcProxyFactory<Foo>('/foo', target)
 *     factory.onConnection(connection)
 *
 * The party at the other end of the `connection`, in order to remotely call
 * methods on this object would do:
 *
 *     let factory = new RpcProxyFactory<Foo>('/foo')
 *     factory.onConnection(connection)
 *     let proxy = factory.createProxy();
 *     let result = proxy.bar(42)
 *     // result is equal to 43
 *
 * One the wire, it would look like this:
 *
 *     --> { "type":"1", "id": 1, "method": "bar", "args": [42]}
 *     <-- { "type":"3", "id": 1, "res": 43}
 *
 * Note that in the code of the caller, we didn't pass a target object to
 * RpcProxyFactory, because we don't want/need to expose an object.
 * If we had passed a target object, the other side could've called methods on
 * it.
 *
 * @param <T> - The type of the object to expose to RPC.
 */
class RpcProxyFactory {
    /**
     * Build a new RpcProxyFactory.
     *
     * @param target - The object to expose to RPC methods calls.  If this
     *   is omitted, the proxy won't be able to handle requests, only send them.
     */
    constructor(target, rpcProtocolFactory = defaultRpcProtocolFactory) {
        this.target = target;
        this.rpcProtocolFactory = rpcProtocolFactory;
        this.onDidOpenConnectionEmitter = new event_1.Emitter();
        this.onDidCloseConnectionEmitter = new event_1.Emitter();
        this.waitForConnection();
    }
    waitForConnection() {
        this.rpcDeferred = new promise_util_1.Deferred();
        this.rpcDeferred.promise.then(protocol => {
            protocol.channel.onClose(() => {
                this.onDidCloseConnectionEmitter.fire(undefined);
                // Wait for connection in case the backend reconnects
                this.waitForConnection();
            });
            this.onDidOpenConnectionEmitter.fire(undefined);
        });
    }
    /**
     * Connect a {@link Channel} to the factory by creating an {@link RpcProtocol} on top of it.
     *
     * This protocol will be used to send/receive RPC requests and
     * responses.
     */
    listen(channel) {
        const protocol = this.rpcProtocolFactory(channel, (meth, args) => this.onRequest(meth, ...args));
        protocol.onNotification(event => this.onNotification(event.method, ...event.args));
        this.rpcDeferred.resolve(protocol);
    }
    /**
     * Process an incoming RPC method call.
     *
     * onRequest is called when the RPC connection received a method call
     * request.  It calls the corresponding method on [[target]].
     *
     * The return value is a Promise object that is resolved with the return
     * value of the method call, if it is successful.  The promise is rejected
     * if the called method does not exist or if it throws.
     *
     * @returns A promise of the method call completion.
     */
    async onRequest(method, ...args) {
        try {
            if (this.target) {
                return await this.target[method](...args);
            }
            else {
                throw new Error(`no target was set to handle ${method}`);
            }
        }
        catch (error) {
            const e = this.serializeError(error);
            if (e instanceof rpc_message_encoder_1.ResponseError) {
                throw e;
            }
            const reason = e.message || '';
            const stack = e.stack || '';
            console.error(`Request ${method} failed with error: ${reason}`, stack);
            throw e;
        }
    }
    /**
     * Process an incoming RPC notification.
     *
     * Same as [[onRequest]], but called on incoming notifications rather than
     * methods calls.
     */
    onNotification(method, ...args) {
        if (this.target) {
            this.target[method](...args);
        }
    }
    /**
     * Create a Proxy exposing the interface of an object of type T.  This Proxy
     * can be used to do RPC method calls on the remote target object as
     * if it was local.
     *
     * If `T` implements `RpcServer` then a client is used as a target object for a remote target object.
     */
    createProxy() {
        const result = new Proxy(this, this);
        return result;
    }
    /**
     * Get a callable object that executes a RPC method call.
     *
     * Getting a property on the Proxy object returns a callable that, when
     * called, executes a RPC call.  The name of the property defines the
     * method to be called.  The callable takes a variable number of arguments,
     * which are passed in the RPC method call.
     *
     * For example, if you have a Proxy object:
     *
     *     let fooProxyFactory = RpcProxyFactory<Foo>('/foo')
     *     let fooProxy = fooProxyFactory.createProxy()
     *
     * accessing `fooProxy.bar` will return a callable that, when called,
     * executes a RPC method call to method `bar`.  Therefore, doing
     * `fooProxy.bar()` will call the `bar` method on the remote Foo object.
     *
     * @param target - unused.
     * @param p - The property accessed on the Proxy object.
     * @param receiver - unused.
     * @returns A callable that executes the RPC call.
     */
    get(target, p, receiver) {
        if (p === 'setClient') {
            return (client) => {
                this.target = client;
            };
        }
        if (p === 'getClient') {
            return () => this.target;
        }
        if (p === 'onDidOpenConnection') {
            return this.onDidOpenConnectionEmitter.event;
        }
        if (p === 'onDidCloseConnection') {
            return this.onDidCloseConnectionEmitter.event;
        }
        if (p === 'then') {
            // Prevent inversify from identifying this proxy as a promise object.
            return undefined;
        }
        const isNotify = this.isNotification(p);
        return (...args) => {
            const method = p.toString();
            const capturedError = new Error(`Request '${method}' failed`);
            return this.rpcDeferred.promise.then(connection => new Promise((resolve, reject) => {
                try {
                    if (isNotify) {
                        connection.sendNotification(method, args);
                        resolve(undefined);
                    }
                    else {
                        const resultPromise = connection.sendRequest(method, args);
                        resultPromise
                            .catch((err) => reject(this.deserializeError(capturedError, err)))
                            .then((result) => resolve(result));
                    }
                }
                catch (err) {
                    reject(err);
                }
            }));
        };
    }
    /**
     * Return whether the given property represents a notification.
     *
     * A property leads to a notification rather than a method call if its name
     * begins with `notify` or `on`.
     *
     * @param p - The property being called on the proxy.
     * @return Whether `p` represents a notification.
     */
    isNotification(p) {
        return p.toString().startsWith('notify') || p.toString().startsWith('on');
    }
    serializeError(e) {
        if (application_error_1.ApplicationError.is(e)) {
            return new rpc_message_encoder_1.ResponseError(e.code, '', Object.assign({ kind: 'application' }, e.toJson()));
        }
        return e;
    }
    deserializeError(capturedError, e) {
        if (e instanceof rpc_message_encoder_1.ResponseError) {
            const capturedStack = capturedError.stack || '';
            if (e.data && e.data.kind === 'application') {
                const { stack, data, message } = e.data;
                return application_error_1.ApplicationError.fromJson(e.code, {
                    message: message || capturedError.message,
                    data,
                    stack: `${capturedStack}\nCaused by: ${stack}`
                });
            }
            e.stack = capturedStack;
        }
        return e;
    }
}
exports.RpcProxyFactory = RpcProxyFactory;
/**
 * @deprecated since 1.39.0 use `RpcConnectionHandler` instead
 */
class JsonRpcConnectionHandler extends RpcConnectionHandler {
}
exports.JsonRpcConnectionHandler = JsonRpcConnectionHandler;
/**
 * @deprecated since 1.39.0 use `RpcProxyFactory` instead
 */
class JsonRpcProxyFactory extends RpcProxyFactory {
}
exports.JsonRpcProxyFactory = JsonRpcProxyFactory;
// eslint-disable-next-line deprecation/deprecation
(0, inversify_1.decorate)((0, inversify_1.injectable)(), JsonRpcProxyFactory);
// eslint-disable-next-line deprecation/deprecation
(0, inversify_1.decorate)((0, inversify_1.unmanaged)(), JsonRpcProxyFactory, 0);
//# sourceMappingURL=proxy-factory.js.map