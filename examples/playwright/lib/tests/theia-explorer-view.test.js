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
let app;
let explorer;
theia_fixture_1.default.describe('Theia Explorer View', () => {
    theia_fixture_1.default.beforeAll(async () => {
        const ws = new theia_workspace_1.TheiaWorkspace(['src/tests/resources/sample-files1']);
        app = await theia_app_1.TheiaApp.load(theia_fixture_1.page, ws);
        explorer = await app.openView(theia_explorer_view_1.TheiaExplorerView);
        await explorer.waitForVisibleFileNodes();
    });
    (0, theia_fixture_1.default)('should be visible and active after being opened', async () => {
        (0, test_1.expect)(await explorer.isTabVisible()).toBe(true);
        (0, test_1.expect)(await explorer.isDisplayed()).toBe(true);
        (0, test_1.expect)(await explorer.isActive()).toBe(true);
    });
    (0, theia_fixture_1.default)("should be opened at the left and have the title 'Explorer'", async () => {
        (0, test_1.expect)(await explorer.isInSidePanel()).toBe(true);
        (0, test_1.expect)(await explorer.side()).toBe('left');
        (0, test_1.expect)(await explorer.title()).toBe('Explorer');
    });
    (0, theia_fixture_1.default)('should be possible to close and reopen it', async () => {
        await explorer.close();
        (0, test_1.expect)(await explorer.isTabVisible()).toBe(false);
        explorer = await app.openView(theia_explorer_view_1.TheiaExplorerView);
        (0, test_1.expect)(await explorer.isTabVisible()).toBe(true);
        (0, test_1.expect)(await explorer.isDisplayed()).toBe(true);
        (0, test_1.expect)(await explorer.isActive()).toBe(true);
    });
    (0, theia_fixture_1.default)('should show one folder named "sampleFolder", one named "sampleFolderCompact" and one file named "sample.txt"', async () => {
        await explorer.selectTreeNode('sampleFolder');
        (0, test_1.expect)(await explorer.isTreeNodeSelected('sampleFolder')).toBe(true);
        const fileStatElements = await explorer.visibleFileStatNodes(theia_explorer_view_1.DOT_FILES_FILTER);
        (0, test_1.expect)(fileStatElements.length).toBe(3);
        let file;
        let folder;
        let compactFolder;
        if (await fileStatElements[0].isFolder()) {
            folder = fileStatElements[0];
            compactFolder = fileStatElements[1];
            file = fileStatElements[2];
        }
        else {
            folder = fileStatElements[2];
            compactFolder = fileStatElements[1];
            file = fileStatElements[0];
        }
        (0, test_1.expect)(await folder.label()).toBe('sampleFolder');
        (0, test_1.expect)(await folder.isFile()).toBe(false);
        (0, test_1.expect)(await folder.isFolder()).toBe(true);
        (0, test_1.expect)(await compactFolder.label()).toBe('sampleFolderCompact');
        (0, test_1.expect)(await compactFolder.isFile()).toBe(false);
        (0, test_1.expect)(await compactFolder.isFolder()).toBe(true);
        (0, test_1.expect)(await file.label()).toBe('sample.txt');
        (0, test_1.expect)(await file.isFolder()).toBe(false);
        (0, test_1.expect)(await file.isFile()).toBe(true);
    });
    (0, theia_fixture_1.default)('should provide file stat node by single path fragment "sample.txt"', async () => {
        const file = await explorer.getFileStatNodeByLabel('sample.txt');
        (0, test_1.expect)(await file.label()).toBe('sample.txt');
        (0, test_1.expect)(await file.isFolder()).toBe(false);
        (0, test_1.expect)(await file.isFile()).toBe(true);
    });
    (0, theia_fixture_1.default)('should provide file stat nodes that can define whether they are collapsed or not and that can be expanded and collapsed', async () => {
        const file = await explorer.getFileStatNodeByLabel('sample.txt');
        (0, test_1.expect)(await file.isCollapsed()).toBe(false);
        const folder = await explorer.getFileStatNodeByLabel('sampleFolder');
        (0, test_1.expect)(await folder.isCollapsed()).toBe(true);
        await folder.expand();
        (0, test_1.expect)(await folder.isCollapsed()).toBe(false);
        await folder.collapse();
        (0, test_1.expect)(await folder.isCollapsed()).toBe(true);
    });
    (0, theia_fixture_1.default)('should provide file stat node by path "sampleFolder/sampleFolder1/sampleFolder1-1/sampleFile1-1-1.txt"', async () => {
        const file = await explorer.fileStatNode('sampleFolder/sampleFolder1/sampleFolder1-1/sampleFile1-1-1.txt');
        if (!file) {
            throw Error('File stat node could not be retrieved by path');
        }
        (0, test_1.expect)(await file.label()).toBe('sampleFile1-1-1.txt');
    });
    (0, theia_fixture_1.default)('should be able to check if compact folder "sampleFolderCompact/nestedFolder1/nestedFolder2" exists', async () => {
        const fileStatElements = await explorer.visibleFileStatNodes();
        // default setting `explorer.compactFolders=true` renders folders in a compact form - single child folders will be compressed in a combined tree element
        (0, test_1.expect)(await explorer.existsDirectoryNode('sampleFolderCompact/nestedFolder1/nestedFolder2', true /* compact */)).toBe(true);
        // the `existsDirectoryNode` function will expand the folder, hence we wait for the file nodes to increase as we expect a txt child file node
        await explorer.waitForFileNodesToIncrease(fileStatElements.length);
    });
    (0, theia_fixture_1.default)('should provide file stat node by path of compact folder "sampleFolderCompact/nestedFolder1/nestedFolder2/sampleFile1-1.txt"', async () => {
        const file = await explorer.fileStatNode('sampleFolderCompact/nestedFolder1/nestedFolder2/sampleFile1-1.txt', true /* compact */);
        if (!file) {
            throw Error('File stat node could not be retrieved by path');
        }
        (0, test_1.expect)(await file.label()).toBe('sampleFile1-1.txt');
    });
    (0, theia_fixture_1.default)('should open context menu on "sample.txt"', async () => {
        const file = await explorer.getFileStatNodeByLabel('sample.txt');
        const menu = await file.openContextMenu();
        (0, test_1.expect)(await menu.isOpen()).toBe(true);
        const menuItems = await menu.visibleMenuItems();
        (0, test_1.expect)(menuItems).toContain('Open');
        (0, test_1.expect)(menuItems).toContain('Delete');
        (0, test_1.expect)(menuItems).toContain('Download');
        await menu.close();
        (0, test_1.expect)(await menu.isOpen()).toBe(false);
    });
    (0, theia_fixture_1.default)('should rename "sample.txt"', async () => {
        await explorer.renameNode('sample.txt', 'sample-new.txt');
        (0, test_1.expect)(await explorer.existsFileNode('sample-new.txt')).toBe(true);
        await explorer.renameNode('sample-new.txt', 'sample.txt');
        (0, test_1.expect)(await explorer.existsFileNode('sample.txt')).toBe(true);
    });
    (0, theia_fixture_1.default)('should open context menu on nested folder segment "nestedFolder1"', async () => {
        (0, test_1.expect)(await explorer.existsDirectoryNode('sampleFolderCompact/nestedFolder1/nestedFolder2', true /* compact */)).toBe(true);
        const folder = await explorer.getFileStatNodeByLabel('sampleFolderCompact/nestedFolder1/nestedFolder2', true /* compact */);
        const menu = await folder.openContextMenuOnSegment('nestedFolder1');
        (0, test_1.expect)(await menu.isOpen()).toBe(true);
        const menuItems = await menu.visibleMenuItems();
        (0, test_1.expect)(menuItems).toContain('New File...');
        (0, test_1.expect)(menuItems).toContain('New Folder...');
        (0, test_1.expect)(menuItems).toContain('Open in Terminal');
        (0, test_1.expect)(menuItems).toContain('Find in Folder...');
        await menu.close();
        (0, test_1.expect)(await menu.isOpen()).toBe(false);
    });
    (0, theia_fixture_1.default)('should rename compact folder "sampleFolderCompact" to "sampleDirectoryCompact', async () => {
        (0, test_1.expect)(await explorer.existsDirectoryNode('sampleFolderCompact/nestedFolder1/nestedFolder2', true /* compact */)).toBe(true);
        await explorer.renameNode('sampleFolderCompact/nestedFolder1/nestedFolder2', 'sampleDirectoryCompact', true /* confirm */, 'sampleFolderCompact' /* nodeSegmentLabel */);
        (0, test_1.expect)(await explorer.existsDirectoryNode('sampleDirectoryCompact/nestedFolder1/nestedFolder2', true /* compact */)).toBe(true);
    });
    (0, theia_fixture_1.default)('should delete nested folder "sampleDirectoryCompact/nestedFolder1/nestedFolder2"', async () => {
        const fileStatElements = await explorer.visibleFileStatNodes();
        (0, test_1.expect)(await explorer.existsDirectoryNode('sampleDirectoryCompact/nestedFolder1/nestedFolder2', true /* compact */)).toBe(true);
        await explorer.deleteNode('sampleDirectoryCompact/nestedFolder1/nestedFolder2', true /* confirm */, 'nestedFolder2' /* nodeSegmentLabel */);
        await explorer.waitForFileNodesToDecrease(fileStatElements.length);
        const updatedFileStatElements = await explorer.visibleFileStatNodes();
        (0, test_1.expect)(updatedFileStatElements.length).toBe(fileStatElements.length - 1);
    });
    (0, theia_fixture_1.default)('should delete compact folder "sampleDirectoryCompact/nestedFolder1"', async () => {
        const fileStatElements = await explorer.visibleFileStatNodes();
        (0, test_1.expect)(await explorer.existsDirectoryNode('sampleDirectoryCompact/nestedFolder1', true /* compact */)).toBe(true);
        await explorer.deleteNode('sampleDirectoryCompact/nestedFolder1', true /* confirm */, 'sampleDirectoryCompact' /* nodeSegmentLabel */);
        await explorer.waitForFileNodesToDecrease(fileStatElements.length);
        const updatedFileStatElements = await explorer.visibleFileStatNodes();
        (0, test_1.expect)(updatedFileStatElements.length).toBe(fileStatElements.length - 1);
    });
});
//# sourceMappingURL=theia-explorer-view.test.js.map