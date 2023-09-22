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
const theia_problem_view_1 = require("../theia-problem-view");
const theia_fixture_1 = require("./fixtures/theia-fixture");
let app;
theia_fixture_1.default.describe('Theia Problems View', () => {
    theia_fixture_1.default.beforeAll(async () => {
        app = await theia_app_1.TheiaApp.load(theia_fixture_1.page);
    });
    (0, theia_fixture_1.default)('should be visible and active after being opened', async () => {
        const problemsView = await app.openView(theia_problem_view_1.TheiaProblemsView);
        (0, test_1.expect)(await problemsView.isTabVisible()).toBe(true);
        (0, test_1.expect)(await problemsView.isDisplayed()).toBe(true);
        (0, test_1.expect)(await problemsView.isActive()).toBe(true);
    });
    (0, theia_fixture_1.default)("should be opened at the bottom and have the title 'Problems'", async () => {
        const problemsView = await app.openView(theia_problem_view_1.TheiaProblemsView);
        (0, test_1.expect)(await problemsView.isInSidePanel()).toBe(false);
        (0, test_1.expect)(await problemsView.side()).toBe('bottom');
        (0, test_1.expect)(await problemsView.title()).toBe('Problems');
    });
    (0, theia_fixture_1.default)('should be closable', async () => {
        const problemsView = await app.openView(theia_problem_view_1.TheiaProblemsView);
        (0, test_1.expect)(await problemsView.isClosable()).toBe(true);
        await problemsView.close();
        (0, test_1.expect)(await problemsView.isTabVisible()).toBe(false);
        (0, test_1.expect)(await problemsView.isDisplayed()).toBe(false);
        (0, test_1.expect)(await problemsView.isActive()).toBe(false);
    });
    (0, theia_fixture_1.default)("should not throw an error if 'close' is called twice", async () => {
        const problemsView = await app.openView(theia_problem_view_1.TheiaProblemsView);
        await problemsView.close();
        await problemsView.close();
    });
});
//# sourceMappingURL=theia-problems-view.test.js.map