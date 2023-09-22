"use strict";
// *****************************************************************************
// Copyright (C) 2021 logi.cals GmbH, EclipseSource and others.
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
const theia_about_dialog_1 = require("../theia-about-dialog");
const theia_app_1 = require("../theia-app");
const theia_explorer_view_1 = require("../theia-explorer-view");
const theia_notification_indicator_1 = require("../theia-notification-indicator");
const theia_notification_overlay_1 = require("../theia-notification-overlay");
const theia_fixture_1 = require("./fixtures/theia-fixture");
let app;
let quickCommand;
theia_fixture_1.default.describe('Theia Quick Command', () => {
    theia_fixture_1.default.beforeAll(async () => {
        app = await theia_app_1.TheiaApp.load(theia_fixture_1.page);
        quickCommand = app.quickCommandPalette;
    });
    (0, theia_fixture_1.default)('should show quick command palette', async () => {
        await quickCommand.open();
        (0, test_1.expect)(await quickCommand.isOpen()).toBe(true);
        await quickCommand.hide();
        (0, test_1.expect)(await quickCommand.isOpen()).toBe(false);
        await quickCommand.open();
        (0, test_1.expect)(await quickCommand.isOpen()).toBe(true);
    });
    (0, theia_fixture_1.default)('should trigger \'About\' command after typing', async () => {
        await quickCommand.type('About');
        await quickCommand.trigger('About');
        (0, test_1.expect)(await quickCommand.isOpen()).toBe(false);
        const aboutDialog = new theia_about_dialog_1.TheiaAboutDialog(app);
        (0, test_1.expect)(await aboutDialog.isVisible()).toBe(true);
        await aboutDialog.close();
        (0, test_1.expect)(await aboutDialog.isVisible()).toBe(false);
        await quickCommand.type('Select All');
        await quickCommand.trigger('Select All');
        (0, test_1.expect)(await quickCommand.isOpen()).toBe(false);
    });
    (0, theia_fixture_1.default)('should trigger \'Toggle Explorer View\' command after typing', async () => {
        await quickCommand.type('Toggle Explorer');
        await quickCommand.trigger('Toggle Explorer View');
        (0, test_1.expect)(await quickCommand.isOpen()).toBe(false);
        const explorerView = new theia_explorer_view_1.TheiaExplorerView(app);
        (0, test_1.expect)(await explorerView.isDisplayed()).toBe(true);
    });
    (0, theia_fixture_1.default)('should trigger \'Quick Input: Test Positive Integer\' command by confirming via Enter', async () => {
        await quickCommand.type('Test Positive', true);
        (0, test_1.expect)(await quickCommand.isOpen()).toBe(true);
        await quickCommand.type('6', true);
        const notificationIndicator = new theia_notification_indicator_1.TheiaNotificationIndicator(app);
        const notification = new theia_notification_overlay_1.TheiaNotificationOverlay(app, notificationIndicator);
        (0, test_1.expect)(await notification.isEntryVisible('Positive Integer: 6')).toBe(true);
    });
});
//# sourceMappingURL=theia-quick-command.test.js.map