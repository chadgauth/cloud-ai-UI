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
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// copied from https://github.com/Microsoft/vscode/blob/master/src/vs/workbench/services/extensions/node/rpcProtocol.ts
// with small modifications
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerMsgPackExtensions = exports.BatchingChannel = exports.RPCProtocolImpl = exports.ConnectionClosedError = exports.createProxyIdentifier = exports.ProxyIdentifier = exports.RPCProtocol = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const core_1 = require("@theia/core");
const event_1 = require("@theia/core/lib/common/event");
const channel_1 = require("@theia/core/lib/common/message-rpc/channel");
const rpc_message_encoder_1 = require("@theia/core/lib/common/message-rpc/rpc-message-encoder");
const uint8_array_message_buffer_1 = require("@theia/core/lib/common/message-rpc/uint8-array-message-buffer");
const proxy_handler_1 = require("./proxy-handler");
const msg_pack_extension_manager_1 = require("@theia/core/lib/common/message-rpc/msg-pack-extension-manager");
const vscode_uri_1 = require("@theia/core/shared/vscode-uri");
const buffer_1 = require("@theia/core/lib/common/buffer");
const types_impl_1 = require("../plugin/types-impl");
exports.RPCProtocol = Symbol('RPCProtocol');
class ProxyIdentifier {
    constructor(isMain, id) {
        this.isMain = isMain;
        // TODO this is nasty, rewrite this
        this.id = id.toString();
    }
}
exports.ProxyIdentifier = ProxyIdentifier;
function createProxyIdentifier(identifier) {
    return new ProxyIdentifier(false, identifier);
}
exports.createProxyIdentifier = createProxyIdentifier;
var ConnectionClosedError;
(function (ConnectionClosedError) {
    const code = 'RPC_PROTOCOL_CLOSED';
    function create(message = 'connection is closed') {
        return Object.assign(new Error(message), { code });
    }
    ConnectionClosedError.create = create;
    function is(error) {
        return (0, core_1.isObject)(error) && 'code' in error && error.code === code;
    }
    ConnectionClosedError.is = is;
})(ConnectionClosedError = exports.ConnectionClosedError || (exports.ConnectionClosedError = {}));
class RPCProtocolImpl {
    constructor(channel) {
        this.locals = new Map();
        this.proxies = new Map();
        this.encoder = new rpc_message_encoder_1.MsgPackMessageEncoder();
        this.decoder = new rpc_message_encoder_1.MsgPackMessageDecoder();
        this.toDispose = new core_1.DisposableCollection(core_1.Disposable.create(() => { }));
        this.toDispose.push(this.multiplexer = new channel_1.ChannelMultiplexer(new BatchingChannel(channel)));
        this.toDispose.push(core_1.Disposable.create(() => this.proxies.clear()));
    }
    dispose() {
        this.toDispose.dispose();
    }
    get isDisposed() {
        return this.toDispose.disposed;
    }
    getProxy(proxyId) {
        if (this.isDisposed) {
            throw ConnectionClosedError.create();
        }
        let proxy = this.proxies.get(proxyId.id);
        if (!proxy) {
            proxy = this.createProxy(proxyId.id);
            this.proxies.set(proxyId.id, proxy);
        }
        return proxy;
    }
    createProxy(proxyId) {
        const handler = new proxy_handler_1.ClientProxyHandler({ id: proxyId, encoder: this.encoder, decoder: this.decoder, channelProvider: () => this.multiplexer.open(proxyId) });
        return new Proxy(Object.create(null), handler);
    }
    set(identifier, instance) {
        if (this.isDisposed) {
            throw ConnectionClosedError.create();
        }
        const invocationHandler = this.locals.get(identifier.id);
        if (!invocationHandler) {
            const handler = new proxy_handler_1.RpcInvocationHandler({ id: identifier.id, target: instance, encoder: this.encoder, decoder: this.decoder });
            const channel = this.multiplexer.getOpenChannel(identifier.id);
            if (channel) {
                handler.listen(channel);
            }
            else {
                const channelOpenListener = this.multiplexer.onDidOpenChannel(event => {
                    if (event.id === identifier.id) {
                        handler.listen(event.channel);
                        channelOpenListener.dispose();
                    }
                });
            }
            this.locals.set(identifier.id, handler);
            if (core_1.Disposable.is(instance)) {
                this.toDispose.push(instance);
            }
            this.toDispose.push(core_1.Disposable.create(() => this.locals.delete(identifier.id)));
        }
        return instance;
    }
}
exports.RPCProtocolImpl = RPCProtocolImpl;
/**
 * Wraps and underlying channel to send/receive multiple messages in one go:
 *  - multiple messages to be sent from one stack get sent in bulk at `process.nextTick`.
 *  - each incoming message is handled in a separate `process.nextTick`.
 */
class BatchingChannel {
    constructor(underlyingChannel) {
        this.underlyingChannel = underlyingChannel;
        this.messagesToSend = [];
        this.onMessageEmitter = new event_1.Emitter();
        this.onClose = this.underlyingChannel.onClose;
        this.onError = this.underlyingChannel.onError;
        underlyingChannel.onMessage(msg => this.handleMessages(msg()));
    }
    get onMessage() {
        return this.onMessageEmitter.event;
    }
    ;
    close() {
        this.underlyingChannel.close();
        this.onMessageEmitter.dispose();
        this.messagesToSend = [];
    }
    getWriteBuffer() {
        const writer = new uint8_array_message_buffer_1.Uint8ArrayWriteBuffer();
        writer.onCommit(buffer => this.commitSingleMessage(buffer));
        return writer;
    }
    commitSingleMessage(msg) {
        if (this.messagesToSend.length === 0) {
            if (typeof setImmediate !== 'undefined') {
                setImmediate(() => this.sendAccumulated());
            }
            else {
                setTimeout(() => this.sendAccumulated(), 0);
            }
        }
        this.messagesToSend.push(msg);
    }
    sendAccumulated() {
        const cachedMessages = this.messagesToSend;
        this.messagesToSend = [];
        const writer = this.underlyingChannel.getWriteBuffer();
        if (cachedMessages.length > 0) {
            writer.writeLength(cachedMessages.length);
            cachedMessages.forEach(msg => {
                writer.writeBytes(msg);
            });
        }
        writer.commit();
    }
    handleMessages(buffer) {
        // Read in the list of messages and dispatch each message individually
        const length = buffer.readLength();
        if (length > 0) {
            for (let index = 0; index < length; index++) {
                const message = buffer.readBytes();
                this.onMessageEmitter.fire(() => new uint8_array_message_buffer_1.Uint8ArrayReadBuffer(message));
            }
        }
    }
}
exports.BatchingChannel = BatchingChannel;
function registerMsgPackExtensions() {
    msg_pack_extension_manager_1.MsgPackExtensionManager.getInstance().registerExtensions({
        class: core_1.URI,
        tag: 2,
        serialize: (instance) => instance.toString(),
        deserialize: data => new core_1.URI(data)
    }, {
        class: types_impl_1.Range,
        tag: 3,
        serialize: (range) => ({
            start: {
                line: range.start.line,
                character: range.start.character
            },
            end: {
                line: range.end.line,
                character: range.end.character
            }
        }),
        deserialize: data => {
            const start = new types_impl_1.Position(data.start.line, data.start.character);
            const end = new types_impl_1.Position(data.end.line, data.end.character);
            return new types_impl_1.Range(start, end);
        }
    }, {
        class: vscode_uri_1.URI,
        tag: 4,
        // eslint-disable-next-line arrow-body-style
        serialize: (instance) => {
            return instance.toString();
        },
        deserialize: data => vscode_uri_1.URI.parse(data)
    }, {
        class: buffer_1.BinaryBuffer,
        tag: 5,
        // eslint-disable-next-line arrow-body-style
        serialize: (instance) => {
            return instance.buffer;
        },
        // eslint-disable-next-line arrow-body-style
        deserialize: buffer => {
            return buffer_1.BinaryBuffer.wrap(buffer);
        }
    });
}
exports.registerMsgPackExtensions = registerMsgPackExtensions;
//# sourceMappingURL=rpc-protocol.js.map