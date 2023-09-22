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
const theia_app_1 = require("../theia-app");
const theia_notification_indicator_1 = require("../theia-notification-indicator");
const theia_problem_indicator_1 = require("../theia-problem-indicator");
const theia_toggle_bottom_indicator_1 = require("../theia-toggle-bottom-indicator");
const theia_fixture_1 = require("./fixtures/theia-fixture");
let statusBar;
theia_fixture_1.default.describe('Theia Status Bar', () => {
    theia_fixture_1.default.beforeAll(async () => {
        const app = await theia_app_1.TheiaApp.load(theia_fixture_1.page);
        statusBar = app.statusBar;
    });
    (0, theia_fixture_1.default)('should show status bar', async () => {
        (0, test_1.expect)(await statusBar.isVisible()).toBe(true);
    });
    (0, theia_fixture_1.default)('should contain status bar elements', async () => {
        const problemIndicator = await statusBar.statusIndicator(theia_problem_indicator_1.TheiaProblemIndicator);
        const notificationIndicator = await statusBar.statusIndicator(theia_notification_indicator_1.TheiaNotificationIndicator);
        const toggleBottomIndicator = await statusBar.statusIndicator(theia_toggle_bottom_indicator_1.TheiaToggleBottomIndicator);
        (0, test_1.expect)(await problemIndicator.isVisible()).toBe(true);
        (0, test_1.expect)(await notificationIndicator.isVisible()).toBe(true);
        (0, test_1.expect)(await toggleBottomIndicator.isVisible()).toBe(true);
    });
});
//# sourceMappingURL=theia-status-bar.test.js.map