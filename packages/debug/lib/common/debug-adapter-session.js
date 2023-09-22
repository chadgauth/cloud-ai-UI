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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebugAdapterSessionImpl = void 0;
/**
 * [DebugAdapterSession](#DebugAdapterSession) implementation.
 */
class DebugAdapterSessionImpl {
    constructor(id, debugAdapter) {
        this.id = id;
        this.debugAdapter = debugAdapter;
        this.isClosed = false;
        this.debugAdapter.onMessageReceived((message) => this.send(message));
        this.debugAdapter.onClose(() => this.onDebugAdapterExit());
        this.debugAdapter.onError(error => this.onDebugAdapterError(error));
    }
    async start(channel) {
        console.debug(`starting debug adapter session '${this.id}'`);
        if (this.channel) {
            throw new Error('The session has already been started, id: ' + this.id);
        }
        this.channel = channel;
        this.channel.onMessage((message) => this.write(message));
        this.channel.onClose(() => this.channel = undefined);
    }
    onDebugAdapterExit() {
        this.isClosed = true;
        console.debug(`onDebugAdapterExit session: '${this.id}'`);
        if (this.channel) {
            this.channel.close();
            this.channel = undefined;
        }
    }
    onDebugAdapterError(error) {
        console.debug(`error in debug adapter session: '${this.id}': ${JSON.stringify(error)}`);
        const event = {
            type: 'event',
            event: 'error',
            seq: -1,
            body: error
        };
        this.send(JSON.stringify(event));
    }
    send(message) {
        if (this.channel) {
            this.channel.send(message);
        }
    }
    write(message) {
        if (!this.isClosed) {
            this.debugAdapter.send(message);
        }
    }
    async stop() {
        var _a;
        console.debug(`stopping debug adapter session: '${this.id}'`);
        if (!this.isClosed) {
            await this.debugAdapter.stop();
        }
        (_a = this.channel) === null || _a === void 0 ? void 0 : _a.close();
        this.channel = undefined;
    }
}
exports.DebugAdapterSessionImpl = DebugAdapterSessionImpl;
//# sourceMappingURL=debug-adapter-session.js.map