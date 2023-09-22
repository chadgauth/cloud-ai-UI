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
exports.SocketDebugAdapter = exports.ProcessDebugAdapter = void 0;
const disposable_1 = require("@theia/core/lib/common/disposable");
const event_1 = require("@theia/core/lib/common/event");
class StreamDebugAdapter extends disposable_1.DisposableCollection {
    constructor(fromAdapter, toAdapter) {
        super();
        this.fromAdapter = fromAdapter;
        this.toAdapter = toAdapter;
        this.messageReceivedEmitter = new event_1.Emitter();
        this.onMessageReceived = this.messageReceivedEmitter.event;
        this.errorEmitter = new event_1.Emitter();
        this.onError = this.errorEmitter.event;
        this.closeEmitter = new event_1.Emitter();
        this.onClose = this.closeEmitter.event;
        this.contentLength = -1;
        this.buffer = Buffer.alloc(0);
        this.fromAdapter.on('data', (data) => this.handleData(data));
        this.fromAdapter.on('close', () => this.handleClosed()); // FIXME pass a proper exit code
        this.fromAdapter.on('error', error => this.errorEmitter.fire(error));
        this.toAdapter.on('error', error => this.errorEmitter.fire(error));
    }
    handleClosed() {
        this.closeEmitter.fire();
    }
    send(message) {
        const msg = `${StreamDebugAdapter.CONTENT_LENGTH}: ${Buffer.byteLength(message, 'utf8')}${StreamDebugAdapter.TWO_CRLF}${message}`;
        this.toAdapter.write(msg, 'utf8');
    }
    handleData(data) {
        this.buffer = Buffer.concat([this.buffer, data]);
        while (true) {
            if (this.contentLength >= 0) {
                if (this.buffer.length >= this.contentLength) {
                    const message = this.buffer.toString('utf8', 0, this.contentLength);
                    this.buffer = this.buffer.slice(this.contentLength);
                    this.contentLength = -1;
                    if (message.length > 0) {
                        this.messageReceivedEmitter.fire(message);
                    }
                    continue; // there may be more complete messages to process
                }
            }
            else {
                let idx = this.buffer.indexOf(StreamDebugAdapter.CONTENT_LENGTH);
                if (idx > 0) {
                    // log unrecognized output
                    const output = this.buffer.slice(0, idx);
                    console.log(output.toString('utf-8'));
                    this.buffer = this.buffer.slice(idx);
                }
                idx = this.buffer.indexOf(StreamDebugAdapter.TWO_CRLF);
                if (idx !== -1) {
                    const header = this.buffer.toString('utf8', 0, idx);
                    const lines = header.split('\r\n');
                    for (let i = 0; i < lines.length; i++) {
                        const pair = lines[i].split(/: +/);
                        if (pair[0] === StreamDebugAdapter.CONTENT_LENGTH) {
                            this.contentLength = +pair[1];
                        }
                    }
                    this.buffer = this.buffer.slice(idx + StreamDebugAdapter.TWO_CRLF.length);
                    continue;
                }
            }
            break;
        }
    }
}
// these constants are for the message header, see: https://microsoft.github.io/debug-adapter-protocol/overview#header-part
StreamDebugAdapter.TWO_CRLF = '\r\n\r\n';
StreamDebugAdapter.CONTENT_LENGTH = 'Content-Length';
class ProcessDebugAdapter extends StreamDebugAdapter {
    constructor(process) {
        super(process.stdout, process.stdin);
        this.process = process;
    }
    async stop() {
        var _a;
        this.process.kill();
        (_a = this.process.stdin) === null || _a === void 0 ? void 0 : _a.end();
    }
}
exports.ProcessDebugAdapter = ProcessDebugAdapter;
class SocketDebugAdapter extends StreamDebugAdapter {
    constructor(socket) {
        super(socket, socket);
        this.socket = socket;
    }
    stop() {
        return new Promise(resolve => {
            this.socket.end(() => resolve());
        });
    }
}
exports.SocketDebugAdapter = SocketDebugAdapter;
//# sourceMappingURL=stream-debug-adapter.js.map