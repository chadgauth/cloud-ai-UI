"use strict";
// *****************************************************************************
// Copyright (C) 2022 EclipseSource and others.
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
class TheiaSampleApp extends theia_app_1.TheiaApp {
    constructor() {
        super(...arguments);
        this.toolbar = new theia_toolbar_1.TheiaToolbar(this);
    }
    async waitForInitialized() {
        await this.toolbar.show();
    }
    async toggleToolbar() {
        await this.toolbar.toggle();
    }
    async isToolbarVisible() {
        return this.toolbar.isShown();
    }
}
let app;
theia_fixture_1.default.describe('Theia Sample Application', () => {
    (0, theia_fixture_1.default)('should load', async () => {
        app = await theia_app_1.TheiaApp.loadApp(theia_fixture_1.page, TheiaSampleApp);
    });
    (0, theia_fixture_1.default)('should start with visible toolbar', async () => {
        (0, test_1.expect)(await app.isToolbarVisible()).toBe(true);
    });
    (0, theia_fixture_1.default)('should toggle toolbar', async () => {
        await app.toggleToolbar();
        (0, test_1.expect)(await app.isToolbarVisible()).toBe(false);
        await app.toggleToolbar();
        (0, test_1.expect)(await app.isToolbarVisible()).toBe(true);
        await app.toggleToolbar();
        (0, test_1.expect)(await app.isToolbarVisible()).toBe(false);
    });
});
//# sourceMappingURL=theia-sample-app.test.js.map