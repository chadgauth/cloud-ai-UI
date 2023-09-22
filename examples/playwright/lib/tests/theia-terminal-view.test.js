"use strict";
// *****************************************************************************
// Copyright (C) 2023 EclipseSource and others.
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
const test_1 = require("@playwright/test");
const theia_app_1 = require("../theia-app");
const theia_workspace_1 = require("../theia-workspace");
const theia_fixture_1 = require("./fixtures/theia-fixture");
const theia_terminal_1 = require("../theia-terminal");
let app;
theia_fixture_1.default.describe('Theia Terminal View', () => {
    theia_fixture_1.default.beforeAll(async () => {
        const ws = new theia_workspace_1.TheiaWorkspace(['src/tests/resources/sample-files1']);
        app = await theia_app_1.TheiaApp.load(theia_fixture_1.page, ws);
    });
    (0, theia_fixture_1.default)('should be possible to open a new terminal', async () => {
        const terminal = await app.openTerminal(theia_terminal_1.TheiaTerminal);
        (0, test_1.expect)(await terminal.isTabVisible()).toBe(true);
        (0, test_1.expect)(await terminal.isDisplayed()).toBe(true);
        (0, test_1.expect)(await terminal.isActive()).toBe(true);
    });
    (0, theia_fixture_1.default)('should be possible to open two terminals, switch among them, and close them', async () => {
        const terminal1 = await app.openTerminal(theia_terminal_1.TheiaTerminal);
        const terminal2 = await app.openTerminal(theia_terminal_1.TheiaTerminal);
        const allTerminals = [terminal1, terminal2];
        // all terminal tabs should be visible
        for (const terminal of allTerminals) {
            (0, test_1.expect)(await terminal.isTabVisible()).toBe(true);
        }
        // activate one terminal after the other and check that only this terminal is active
        for (const terminal of allTerminals) {
            await terminal.activate();
            (0, test_1.expect)(await terminal1.isActive()).toBe(terminal1 === terminal);
            (0, test_1.expect)(await terminal2.isActive()).toBe(terminal2 === terminal);
        }
        // close all terminals
        for (const terminal of allTerminals) {
            await terminal.activate();
            await terminal.close();
        }
        // check that all terminals are closed
        for (const terminal of allTerminals) {
            (0, test_1.expect)(await terminal.isTabVisible()).toBe(false);
        }
    });
    (0, theia_fixture_1.default)('should allow to write and read terminal contents', async () => {
        const terminal = await app.openTerminal(theia_terminal_1.TheiaTerminal);
        await terminal.write('hello');
        const contents = await terminal.contents();
        (0, test_1.expect)(contents).toContain('hello');
    });
    (0, theia_fixture_1.default)('should allow to submit a command and read output', async () => {
        const terminal = await app.openTerminal(theia_terminal_1.TheiaTerminal);
        if (process.platform === 'win32') {
            await terminal.submit('dir');
        }
        else {
            await terminal.submit('ls');
        }
        const contents = await terminal.contents();
        (0, test_1.expect)(contents).toContain('sample.txt');
    });
});
//# sourceMappingURL=theia-terminal-view.test.js.map