"use strict";
// *****************************************************************************
// Copyright (C) 2018 Ericsson and others.
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
const terminal_test_container_1 = require("./test/terminal-test-container");
const backend_application_1 = require("@theia/core/lib/node/backend-application");
const shell_terminal_protocol_1 = require("../common/shell-terminal-protocol");
const terminal_protocol_1 = require("../common/terminal-protocol");
const test_web_socket_channel_1 = require("@theia/core/lib/node/messaging/test/test-web-socket-channel");
describe('Terminal Backend Contribution', function () {
    this.timeout(10000);
    let server;
    let shellTerminalServer;
    beforeEach(async () => {
        const container = (0, terminal_test_container_1.createTerminalTestContainer)();
        const application = container.get(backend_application_1.BackendApplication);
        shellTerminalServer = container.get(shell_terminal_protocol_1.IShellTerminalServer);
        server = await application.start();
    });
    afterEach(() => {
        const s = server;
        server = undefined;
        shellTerminalServer = undefined;
        s.close();
    });
    it('is data received from the terminal ws server', async () => {
        const terminalId = await shellTerminalServer.create({});
        await new Promise((resolve, reject) => {
            const path = `${terminal_protocol_1.terminalsPath}/${terminalId}`;
            const { channel, multiplexer } = new test_web_socket_channel_1.TestWebSocketChannelSetup({ server, path });
            channel.onError(reject);
            channel.onClose(event => reject(new Error(`channel is closed with '${event.code}' code and '${event.reason}' reason}`)));
            multiplexer.onDidOpenChannel(event => {
                if (event.id === path) {
                    resolve();
                    channel.close();
                }
            });
        });
    });
});
//# sourceMappingURL=terminal-backend-contribution.slow-spec.js.map