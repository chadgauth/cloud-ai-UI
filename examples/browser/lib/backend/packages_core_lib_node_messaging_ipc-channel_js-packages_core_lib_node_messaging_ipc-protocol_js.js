"use strict";
exports.id = "packages_core_lib_node_messaging_ipc-channel_js-packages_core_lib_node_messaging_ipc-protocol_js";
exports.ids = ["packages_core_lib_node_messaging_ipc-channel_js-packages_core_lib_node_messaging_ipc-protocol_js"];
exports.modules = {

/***/ "../../packages/core/lib/node/messaging/binary-message-pipe.js":
/*!*********************************************************************!*\
  !*** ../../packages/core/lib/node/messaging/binary-message-pipe.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


// *****************************************************************************
// Copyright (C) 2022 STMicroelectronics and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BinaryMessagePipe = void 0;
const common_1 = __webpack_require__(/*! ../../common */ "../../packages/core/lib/common/index.js");
const uint8_array_message_buffer_1 = __webpack_require__(/*! ../../common/message-rpc/uint8-array-message-buffer */ "../../packages/core/lib/common/message-rpc/uint8-array-message-buffer.js");
/**
 * A `BinaryMessagePipe` is capable of sending and retrieving binary messages i.e. {@link Uint8Array}s over
 * and underlying streamed process pipe/fd. The message length of individual messages is encoding at the beginning of
 * a new message. This makes it possible to extract messages from the streamed data.
 */
class BinaryMessagePipe {
    constructor(underlyingPipe) {
        this.underlyingPipe = underlyingPipe;
        this.dataHandler = (chunk) => this.handleChunk(chunk);
        this.onMessageEmitter = new common_1.Emitter();
        this.cachedMessageData = {
            chunks: [],
            missingBytes: 0
        };
        underlyingPipe.on('data', this.dataHandler);
    }
    get onMessage() {
        return this.onMessageEmitter.event;
    }
    send(message) {
        this.underlyingPipe.write(this.encodeMessageStart(message));
        this.underlyingPipe.write(message);
    }
    handleChunk(chunk) {
        if (this.cachedMessageData.missingBytes === 0) {
            // There is no currently streamed message => We expect that the beginning of the chunk is the message start for a new message
            this.handleNewMessage(chunk);
        }
        else {
            // The chunk contains message data intended for the currently cached message
            this.handleMessageContentChunk(chunk);
        }
    }
    handleNewMessage(chunk) {
        if (chunk.byteLength < this.messageStartByteLength) {
            // The chunk only contains a part of the encoded message start
            this.cachedMessageData.partialMessageStart = chunk;
            return;
        }
        const messageLength = this.readMessageStart(chunk);
        if (chunk.length - this.messageStartByteLength > messageLength) {
            // The initial chunk contains more than one binary message => Fire `onMessage` for first message and handle remaining content
            const firstMessage = chunk.slice(this.messageStartByteLength, this.messageStartByteLength + messageLength);
            this.onMessageEmitter.fire(firstMessage);
            this.handleNewMessage(chunk.slice(this.messageStartByteLength + messageLength));
        }
        else if (chunk.length - this.messageStartByteLength === messageLength) {
            // The initial chunk contains exactly one complete message. => Directly fire the `onMessage` event.
            this.onMessageEmitter.fire(chunk.slice(this.messageStartByteLength));
        }
        else {
            // The initial chunk contains only part of the message content => Cache message data
            this.cachedMessageData.chunks = [chunk.slice(this.messageStartByteLength)];
            this.cachedMessageData.missingBytes = messageLength - chunk.byteLength + this.messageStartByteLength;
        }
    }
    handleMessageContentChunk(chunk) {
        if (this.cachedMessageData) {
            if (chunk.byteLength < this.cachedMessageData.missingBytes) {
                // The chunk only contains parts of the missing bytes for the cached message.
                this.cachedMessageData.chunks.push(chunk);
                this.cachedMessageData.missingBytes -= chunk.byteLength;
            }
            else if (chunk.byteLength === this.cachedMessageData.missingBytes) {
                // Chunk contains exactly the missing data for the cached message
                this.cachedMessageData.chunks.push(chunk);
                this.emitCachedMessage();
            }
            else {
                // Chunk contains missing data for the cached message + data for the next message
                const messageEnd = this.cachedMessageData.missingBytes;
                const missingData = chunk.slice(0, messageEnd);
                this.cachedMessageData.chunks.push(missingData);
                this.emitCachedMessage();
                this.handleNewMessage(chunk.slice(messageEnd));
            }
        }
    }
    emitCachedMessage() {
        const message = Buffer.concat(this.cachedMessageData.chunks);
        this.onMessageEmitter.fire(message);
        this.cachedMessageData.chunks = [];
        this.cachedMessageData.missingBytes = 0;
    }
    /**
     * Encodes the start of a new message into a {@link Uint8Array}.
     * The message start consists of a identifier string and the length of the following message.
     * @returns the buffer contains the encoded message start
     */
    encodeMessageStart(message) {
        const writer = new uint8_array_message_buffer_1.Uint8ArrayWriteBuffer()
            .writeString(BinaryMessagePipe.MESSAGE_START_IDENTIFIER)
            .writeUint32(message.length);
        const messageStart = writer.getCurrentContents();
        writer.dispose();
        return messageStart;
    }
    get messageStartByteLength() {
        // 4 bytes for length of id + id string length + 4 bytes for length of message
        return 4 + BinaryMessagePipe.MESSAGE_START_IDENTIFIER.length + 4;
    }
    /**
     * Reads the start of a new message from a stream chunk (or cached message) received from the underlying pipe.
     * The message start is expected to consist of an identifier string and the length of the message.
     * @param chunk The stream chunk.
     * @returns The length of the message content to read.
     * @throws An error if the message start can not be read successfully.
     */
    readMessageStart(chunk) {
        const messageData = this.cachedMessageData.partialMessageStart ? Buffer.concat([this.cachedMessageData.partialMessageStart, chunk]) : chunk;
        this.cachedMessageData.partialMessageStart = undefined;
        const reader = new uint8_array_message_buffer_1.Uint8ArrayReadBuffer(messageData);
        const identifier = reader.readString();
        if (identifier !== BinaryMessagePipe.MESSAGE_START_IDENTIFIER) {
            throw new Error(`Could not read message start. The start identifier should be '${BinaryMessagePipe.MESSAGE_START_IDENTIFIER}' but was '${identifier}`);
        }
        const length = reader.readUint32();
        return length;
    }
    dispose() {
        this.underlyingPipe.removeListener('data', this.dataHandler);
        this.underlyingPipe.end();
        this.onMessageEmitter.dispose();
        this.cachedMessageData = {
            chunks: [],
            missingBytes: 0
        };
    }
}
exports.BinaryMessagePipe = BinaryMessagePipe;
BinaryMessagePipe.MESSAGE_START_IDENTIFIER = '<MessageStart>';


/***/ }),

/***/ "../../packages/core/lib/node/messaging/ipc-channel.js":
/*!*************************************************************!*\
  !*** ../../packages/core/lib/node/messaging/ipc-channel.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


// *****************************************************************************
// Copyright (C) 2022 STMicroelectronics and others.
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
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IPCChannel = void 0;
const net_1 = __webpack_require__(/*! net */ "net");
const common_1 = __webpack_require__(/*! ../../common */ "../../packages/core/lib/common/index.js");
const uint8_array_message_buffer_1 = __webpack_require__(/*! ../../common/message-rpc/uint8-array-message-buffer */ "../../packages/core/lib/common/message-rpc/uint8-array-message-buffer.js");
const binary_message_pipe_1 = __webpack_require__(/*! ./binary-message-pipe */ "../../packages/core/lib/node/messaging/binary-message-pipe.js");
/**
 * A {@link Channel} to send messages between two processes using a dedicated pipe/fd for binary messages.
 * This fd is opened as 5th channel in addition to the default stdios (stdin, stdout, stderr, ipc). This means the default channels
 * are not blocked and can be used by the respective process for additional custom message handling.
 */
class IPCChannel extends common_1.AbstractChannel {
    constructor(childProcess) {
        super();
        this.ipcErrorListener = error => this.onErrorEmitter.fire(error);
        if (childProcess) {
            this.setupChildProcess(childProcess);
        }
        else {
            this.setupProcess();
        }
        this.messagePipe.onMessage(message => {
            this.onMessageEmitter.fire(() => new uint8_array_message_buffer_1.Uint8ArrayReadBuffer(message));
        });
    }
    setupChildProcess(childProcess) {
        childProcess.once('exit', code => this.onCloseEmitter.fire({ reason: 'Child process has been terminated', code: code !== null && code !== void 0 ? code : undefined }));
        this.messagePipe = new binary_message_pipe_1.BinaryMessagePipe(childProcess.stdio[4]);
        childProcess.on('error', this.ipcErrorListener);
        this.toDispose.push(common_1.Disposable.create(() => {
            childProcess.removeListener('error', this.ipcErrorListener);
            this.messagePipe.dispose();
        }));
    }
    setupProcess() {
        process.once('beforeExit', code => this.onCloseEmitter.fire({ reason: 'Process is about to be terminated', code }));
        this.messagePipe = new binary_message_pipe_1.BinaryMessagePipe(new net_1.Socket({ fd: 4 }));
        process.on('uncaughtException', this.ipcErrorListener);
        this.toDispose.push(common_1.Disposable.create(() => {
            process.removeListener('uncaughtException', this.ipcErrorListener);
            this.messagePipe.dispose();
        }));
    }
    getWriteBuffer() {
        const result = new uint8_array_message_buffer_1.Uint8ArrayWriteBuffer();
        result.onCommit(buffer => {
            this.messagePipe.send(buffer);
        });
        return result;
    }
}
exports.IPCChannel = IPCChannel;


/***/ }),

/***/ "../../packages/core/lib/node/messaging/ipc-protocol.js":
/*!**************************************************************!*\
  !*** ../../packages/core/lib/node/messaging/ipc-protocol.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, exports) => {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createIpcEnv = exports.checkParentAlive = exports.IPCEntryPoint = exports.ipcEntryPoint = void 0;
const THEIA_PARENT_PID = 'THEIA_PARENT_PID';
const THEIA_ENTRY_POINT = 'THEIA_ENTRY_POINT';
exports.ipcEntryPoint = process.env[THEIA_ENTRY_POINT];
var IPCEntryPoint;
(function (IPCEntryPoint) {
    /**
     * Throws if `THEIA_ENTRY_POINT` is undefined or empty.
     */
    function getScriptFromEnv() {
        if (!exports.ipcEntryPoint) {
            throw new Error(`"${THEIA_ENTRY_POINT}" is missing from the environment`);
        }
        return exports.ipcEntryPoint;
    }
    IPCEntryPoint.getScriptFromEnv = getScriptFromEnv;
})(IPCEntryPoint = exports.IPCEntryPoint || (exports.IPCEntryPoint = {}));
/**
 * Exit the current process if the parent process is not alive.
 * Relevant only for some OS, like Windows
 */
function checkParentAlive() {
    if (process.env[THEIA_PARENT_PID]) {
        const parentPid = Number(process.env[THEIA_PARENT_PID]);
        if (typeof parentPid === 'number' && !isNaN(parentPid)) {
            setInterval(() => {
                try {
                    // throws an exception if the main process doesn't exist anymore.
                    process.kill(parentPid, 0);
                }
                catch {
                    process.exit();
                }
            }, 5000);
        }
    }
}
exports.checkParentAlive = checkParentAlive;
function createIpcEnv(options) {
    const op = Object.assign({}, options);
    const childEnv = Object.assign({}, op.env);
    for (const key of Object.keys(childEnv)) {
        if (key.startsWith('THEIA_')) {
            delete childEnv[key];
        }
    }
    childEnv[THEIA_PARENT_PID] = String(process.pid);
    childEnv[THEIA_ENTRY_POINT] = op.entryPoint;
    return childEnv;
}
exports.createIpcEnv = createIpcEnv;


/***/ })

};
;
//# sourceMappingURL=packages_core_lib_node_messaging_ipc-channel_js-packages_core_lib_node_messaging_ipc-protocol_js.js.map