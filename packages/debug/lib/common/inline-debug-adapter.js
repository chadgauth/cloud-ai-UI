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
exports.InlineDebugAdapter = void 0;
const event_1 = require("@theia/core/lib/common/event");
/**
 * A debug adapter for using the inline implementation from a plugin.
 */
class InlineDebugAdapter {
    constructor(debugAdapter) {
        this.debugAdapter = debugAdapter;
        this.messageReceivedEmitter = new event_1.Emitter();
        this.onMessageReceived = this.messageReceivedEmitter.event;
        this.onError = event_1.Event.None;
        this.closeEmitter = new event_1.Emitter();
        this.onClose = this.closeEmitter.event;
        this.debugAdapter.onDidSendMessage(msg => {
            this.messageReceivedEmitter.fire(JSON.stringify(msg));
        });
    }
    async start() {
    }
    send(message) {
        this.debugAdapter.handleMessage(JSON.parse(message));
    }
    async stop() {
        this.debugAdapter.dispose();
    }
}
exports.InlineDebugAdapter = InlineDebugAdapter;
//# sourceMappingURL=inline-debug-adapter.js.map