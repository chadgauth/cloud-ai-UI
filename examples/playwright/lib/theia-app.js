"use strict";
// *****************************************************************************
// Copyright (C) 2021-2023 logi.cals GmbH, EclipseSource and others.
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
exports.TheiaApp = exports.DefaultTheiaAppData = void 0;
const theia_explorer_view_1 = require("./theia-explorer-view");
const theia_main_menu_1 = require("./theia-main-menu");
const theia_preference_view_1 = require("./theia-preference-view");
const theia_quick_command_palette_1 = require("./theia-quick-command-palette");
const theia_status_bar_1 = require("./theia-status-bar");
const theia_workspace_1 = require("./theia-workspace");
;
exports.DefaultTheiaAppData = {
    loadingSelector: '.theia-preload',
    shellSelector: '.theia-ApplicationShell'
};
class TheiaApp {
    constructor(page, initialWorkspace, appData = exports.DefaultTheiaAppData) {
        this.page = page;
        this.appData = appData;
        this.statusBar = new theia_status_bar_1.TheiaStatusBar(this);
        this.quickCommandPalette = new theia_quick_command_palette_1.TheiaQuickCommandPalette(this);
        this.menuBar = new theia_main_menu_1.TheiaMenuBar(this);
        this.workspace = initialWorkspace ? initialWorkspace : new theia_workspace_1.TheiaWorkspace();
        this.workspace.initialize();
    }
    static async load(page, initialWorkspace) {
        return this.loadApp(page, TheiaApp, initialWorkspace);
    }
    static async loadApp(page, appFactory, initialWorkspace) {
        const app = new appFactory(page, initialWorkspace);
        await app.load();
        return app;
    }
    async load() {
        await this.loadOrReload(this.page, '/#' + this.workspace.urlEncodedPath);
        await this.page.waitForSelector(this.appData.loadingSelector, { state: 'detached' });
        await this.page.waitForSelector(this.appData.shellSelector);
        await this.waitForInitialized();
    }
    async loadOrReload(page, url) {
        if (page.url() === url) {
            await page.reload();
        }
        else {
            const wasLoadedAlready = await page.isVisible(this.appData.shellSelector);
            await page.goto(url);
            if (wasLoadedAlready) {
                // Theia doesn't refresh on URL change only
                // So we need to reload if the app was already loaded before
                await page.reload();
            }
        }
    }
    async isMainContentPanelVisible() {
        const contentPanel = await this.page.$('#theia-main-content-panel');
        return !!contentPanel && contentPanel.isVisible();
    }
    async openPreferences(viewFactory, preferenceScope = theia_preference_view_1.TheiaPreferenceScope.Workspace) {
        const view = new viewFactory(this);
        if (await view.isTabVisible()) {
            await view.activate();
            return view;
        }
        await view.open(preferenceScope);
        return view;
    }
    async openView(viewFactory) {
        const view = new viewFactory(this);
        if (await view.isTabVisible()) {
            await view.activate();
            return view;
        }
        await view.open();
        return view;
    }
    async openEditor(filePath, editorFactory, editorName, expectFileNodes = true) {
        const explorer = await this.openView(theia_explorer_view_1.TheiaExplorerView);
        if (!explorer) {
            throw Error('TheiaExplorerView could not be opened.');
        }
        if (expectFileNodes) {
            await explorer.waitForVisibleFileNodes();
            const fileStatElements = await explorer.visibleFileStatNodes(theia_explorer_view_1.DOT_FILES_FILTER);
            if (fileStatElements.length < 1) {
                throw Error('TheiaExplorerView is empty.');
            }
        }
        const fileNode = await explorer.fileStatNode(filePath);
        if (!fileNode || !await (fileNode === null || fileNode === void 0 ? void 0 : fileNode.isFile())) {
            throw Error(`Specified path '${filePath}' could not be found or isn't a file.`);
        }
        const editor = new editorFactory(filePath, this);
        const contextMenu = await fileNode.openContextMenu();
        const editorToUse = editorName ? editorName : editor.name ? editor.name : undefined;
        if (editorToUse) {
            const menuItem = await contextMenu.menuItemByNamePath('Open With', editorToUse);
            if (!menuItem) {
                throw Error(`Editor named '${editorName}' could not be found in "Open With" menu.`);
            }
            await menuItem.click();
        }
        else {
            await contextMenu.clickMenuItem('Open');
        }
        await editor.waitForVisible();
        return editor;
    }
    async activateExistingEditor(filePath, editorFactory) {
        const editor = new editorFactory(filePath, this);
        if (!await editor.isTabVisible()) {
            throw new Error(`Could not find opened editor for file ${filePath}`);
        }
        await editor.activate();
        await editor.waitForVisible();
        return editor;
    }
    async openTerminal(terminalFactory) {
        const mainMenu = await this.menuBar.openMenu('Terminal');
        const menuItem = await mainMenu.menuItemByName('New Terminal');
        if (!menuItem) {
            throw Error('Menu item \'New Terminal\' could not be found.');
        }
        const newTabIds = await this.runAndWaitForNewTabs(() => menuItem.click());
        if (newTabIds.length > 1) {
            console.warn('More than one new tab detected after opening the terminal');
        }
        return new terminalFactory(newTabIds[0], this);
    }
    async runAndWaitForNewTabs(command) {
        const tabIdsBefore = await this.visibleTabIds();
        await command();
        return (await this.waitForNewTabs(tabIdsBefore)).filter(item => !tabIdsBefore.includes(item));
    }
    async waitForNewTabs(tabIds) {
        let tabIdsCurrent;
        while ((tabIdsCurrent = (await this.visibleTabIds())).length <= tabIds.length) {
            console.debug('Awaiting a new tab to appear');
        }
        return tabIdsCurrent;
    }
    async visibleTabIds() {
        const tabs = await this.page.$$('.p-TabBar-tab');
        const tabIds = (await Promise.all(tabs.map(tab => tab.getAttribute('id')))).filter(id => !!id);
        return tabIds;
    }
    /** Specific Theia apps may add additional conditions to wait for. */
    async waitForInitialized() {
        // empty by default
    }
}
exports.TheiaApp = TheiaApp;
//# sourceMappingURL=theia-app.js.map