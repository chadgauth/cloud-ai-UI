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
const theia_app_1 = require("../theia-app");
const test_1 = require("@playwright/test");
const theia_fixture_1 = require("./fixtures/theia-fixture");
let app;
theia_fixture_1.default.describe('Theia Application', () => {
    (0, theia_fixture_1.default)('should load', async () => {
        app = await theia_app_1.TheiaApp.load(theia_fixture_1.page);
    });
    (0, theia_fixture_1.default)('should show main content panel', async () => {
        (0, test_1.expect)(await app.isMainContentPanelVisible()).toBe(true);
    });
});
//# sourceMappingURL=theia-app.test.js.map