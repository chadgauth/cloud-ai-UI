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
const theia_toolbar_1 = require("../theia-toolbar");
const theia_fixture_1 = require("./fixtures/theia-fixture");
let app;
let toolbar;
theia_fixture_1.default.describe('Theia Toolbar', () => {
    theia_fixture_1.default.beforeAll(async () => {
        app = await theia_app_1.TheiaApp.load(theia_fixture_1.page);
        toolbar = new theia_toolbar_1.TheiaToolbar(app);
    });
    (0, theia_fixture_1.default)('should toggle the toolbar and check visibility', async () => {
        // depending on the user settings we have different starting conditions for the toolbar
        const isShownInitially = await toolbar.isShown();
        (0, test_1.expect)(await toolbar.isShown()).toBe(isShownInitially);
        await toolbar.toggle();
        (0, test_1.expect)(await toolbar.isShown()).toBe(!isShownInitially);
        await toolbar.hide();
        (0, test_1.expect)(await toolbar.isShown()).toBe(false);
        await toolbar.show();
        (0, test_1.expect)(await toolbar.isShown()).toBe(true);
    });
    (0, theia_fixture_1.default)('should show the default toolbar tools of the sample Theia application', async () => {
        (0, test_1.expect)(await toolbar.toolbarItems()).toHaveLength(5);
        (0, test_1.expect)(await toolbar.toolbarItemIds()).toStrictEqual([
            'textEditor.commands.go.back',
            'textEditor.commands.go.forward',
            'workbench.action.splitEditorRight',
            'theia-sample-toolbar-contribution',
            'workbench.action.showCommands'
        ]);
    });
    (0, theia_fixture_1.default)('should trigger the "Command Palette" toolbar tool as expect the command palette to open', async () => {
        const commandPaletteTool = await toolbar.toolBarItem('workbench.action.showCommands');
        (0, test_1.expect)(commandPaletteTool).toBeDefined;
        (0, test_1.expect)(await commandPaletteTool.isEnabled()).toBe(true);
        await commandPaletteTool.trigger();
        (0, test_1.expect)(await app.quickCommandPalette.isOpen()).toBe(true);
        await app.quickCommandPalette.hide();
        (0, test_1.expect)(await app.quickCommandPalette.isOpen()).toBe(false);
    });
});
//# sourceMappingURL=theia-toolbar.test.js.map