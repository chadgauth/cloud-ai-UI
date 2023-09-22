"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// *****************************************************************************
// Copyright (C) 2017 Ericsson and others.
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
const chai = require("chai");
const terminal_test_container_1 = require("./test/terminal-test-container");
const shell_terminal_protocol_1 = require("../common/shell-terminal-protocol");
/**
 * Globals
 */
const expect = chai.expect;
describe('ShellServer', function () {
    this.timeout(5000);
    let shellTerminalServer;
    beforeEach(() => {
        shellTerminalServer = (0, terminal_test_container_1.createTerminalTestContainer)().get(shell_terminal_protocol_1.IShellTerminalServer);
    });
    it('test shell terminal create', async function () {
        const createResult = shellTerminalServer.create({});
        expect(await createResult).to.be.greaterThan(-1);
    });
});
//# sourceMappingURL=shell-terminal-server.spec.js.map