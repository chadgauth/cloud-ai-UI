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
const theia_explorer_view_1 = require("../theia-explorer-view");
const theia_workspace_1 = require("../theia-workspace");
const theia_fixture_1 = require("./fixtures/theia-fixture");
theia_fixture_1.default.describe('Theia Workspace', () => {
    (0, theia_fixture_1.default)('should be initialized empty by default', async () => {
        const app = await theia_app_1.TheiaApp.load(theia_fixture_1.page);
        const explorer = await app.openView(theia_explorer_view_1.TheiaExplorerView);
        const fileStatElements = await explorer.visibleFileStatNodes(theia_explorer_view_1.DOT_FILES_FILTER);
        (0, test_1.expect)(fileStatElements.length).toBe(0);
    });
    (0, theia_fixture_1.default)('should be initialized with the contents of a file location', async () => {
        const ws = new theia_workspace_1.TheiaWorkspace(['src/tests/resources/sample-files1']);
        const app = await theia_app_1.TheiaApp.load(theia_fixture_1.page, ws);
        const explorer = await app.openView(theia_explorer_view_1.TheiaExplorerView);
        // resources/sample-files1 contains two folders and one file
        (0, test_1.expect)(await explorer.existsDirectoryNode('sampleFolder')).toBe(true);
        (0, test_1.expect)(await explorer.existsDirectoryNode('sampleFolderCompact')).toBe(true);
        (0, test_1.expect)(await explorer.existsFileNode('sample.txt')).toBe(true);
    });
    (0, theia_fixture_1.default)('should be initialized with the contents of multiple file locations', async () => {
        const ws = new theia_workspace_1.TheiaWorkspace(['src/tests/resources/sample-files1', 'src/tests/resources/sample-files2']);
        const app = await theia_app_1.TheiaApp.load(theia_fixture_1.page, ws);
        const explorer = await app.openView(theia_explorer_view_1.TheiaExplorerView);
        // resources/sample-files1 contains two folders and one file
        (0, test_1.expect)(await explorer.existsDirectoryNode('sampleFolder')).toBe(true);
        (0, test_1.expect)(await explorer.existsDirectoryNode('sampleFolderCompact')).toBe(true);
        (0, test_1.expect)(await explorer.existsFileNode('sample.txt')).toBe(true);
        // resources/sample-files2 contains one file
        (0, test_1.expect)(await explorer.existsFileNode('another-sample.txt')).toBe(true);
    });
});
//# sourceMappingURL=theia-workspace.test.js.map