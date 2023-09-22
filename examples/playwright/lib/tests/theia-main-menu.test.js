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
const util_1 = require("../util");
const theia_app_1 = require("../theia-app");
const theia_fixture_1 = require("./fixtures/theia-fixture");
let menuBar;
theia_fixture_1.default.describe('Theia Main Menu', () => {
    theia_fixture_1.default.beforeAll(async () => {
        const app = await theia_app_1.TheiaApp.load(theia_fixture_1.page);
        menuBar = app.menuBar;
    });
    (0, theia_fixture_1.default)('should show the main menu bar', async () => {
        const menuBarItems = await menuBar.visibleMenuBarItems();
        (0, test_1.expect)(menuBarItems).toContain('File');
        (0, test_1.expect)(menuBarItems).toContain('Edit');
        (0, test_1.expect)(menuBarItems).toContain('Help');
    });
    (0, theia_fixture_1.default)("should open main menu 'File'", async () => {
        const mainMenu = await menuBar.openMenu('File');
        (0, test_1.expect)(await mainMenu.isOpen()).toBe(true);
    });
    (0, theia_fixture_1.default)("should show the menu items 'New Text File' and 'New Folder'", async () => {
        const mainMenu = await menuBar.openMenu('File');
        const menuItems = await mainMenu.visibleMenuItems();
        (0, test_1.expect)(menuItems).toContain('New Text File');
        (0, test_1.expect)(menuItems).toContain('New Folder...');
    });
    (0, theia_fixture_1.default)("should return menu item by name 'New Text File'", async () => {
        const mainMenu = await menuBar.openMenu('File');
        const menuItem = await mainMenu.menuItemByName('New Text File');
        (0, test_1.expect)(menuItem).toBeDefined();
        const label = await (menuItem === null || menuItem === void 0 ? void 0 : menuItem.label());
        (0, test_1.expect)(label).toBe('New Text File');
        const shortCut = await (menuItem === null || menuItem === void 0 ? void 0 : menuItem.shortCut());
        (0, test_1.expect)(shortCut).toBe(util_1.OSUtil.isMacOS ? '⌥ N' : 'Alt+N');
        const hasSubmenu = await (menuItem === null || menuItem === void 0 ? void 0 : menuItem.hasSubmenu());
        (0, test_1.expect)(hasSubmenu).toBe(false);
    });
    (0, theia_fixture_1.default)('should detect whether menu item has submenu', async () => {
        const mainMenu = await menuBar.openMenu('File');
        const newFileItem = await mainMenu.menuItemByName('New Text File');
        const settingsItem = await mainMenu.menuItemByName('Preferences');
        (0, test_1.expect)(await (newFileItem === null || newFileItem === void 0 ? void 0 : newFileItem.hasSubmenu())).toBe(false);
        (0, test_1.expect)(await (settingsItem === null || settingsItem === void 0 ? void 0 : settingsItem.hasSubmenu())).toBe(true);
    });
    (0, theia_fixture_1.default)('should be able to show menu item in submenu by path', async () => {
        const mainMenu = await menuBar.openMenu('File');
        const openPreferencesItem = await mainMenu.menuItemByNamePath('Preferences', 'Settings');
        const label = await (openPreferencesItem === null || openPreferencesItem === void 0 ? void 0 : openPreferencesItem.label());
        (0, test_1.expect)(label).toBe('Settings');
    });
    (0, theia_fixture_1.default)('should close main menu', async () => {
        const mainMenu = await menuBar.openMenu('File');
        await mainMenu.close();
        (0, test_1.expect)(await mainMenu.isOpen()).toBe(false);
    });
});
//# sourceMappingURL=theia-main-menu.test.js.map