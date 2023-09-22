"use strict";
// *****************************************************************************
// Copyright (C) 2022 Ericsson and others.
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindToolbarApplicationShell = exports.ApplicationShellWithToolbarOverride = void 0;
const browser_1 = require("@theia/core/lib/browser");
const inversify_1 = require("@theia/core/shared/inversify");
const theia_dock_panel_1 = require("@theia/core/lib/browser/shell/theia-dock-panel");
const toolbar_interfaces_1 = require("./toolbar-interfaces");
const toolbar_preference_contribution_1 = require("./toolbar-preference-contribution");
let ApplicationShellWithToolbarOverride = class ApplicationShellWithToolbarOverride extends browser_1.ApplicationShell {
    init() {
        this.doInit();
    }
    async doInit() {
        this.toolbar = this.toolbarFactory();
        this.toolbar.id = 'main-toolbar';
        super.init();
        await this.toolbarPreferences.ready;
        this.tryShowToolbar();
        this.mainPanel.onDidToggleMaximized(() => {
            this.tryShowToolbar();
        });
        this.bottomPanel.onDidToggleMaximized(() => {
            this.tryShowToolbar();
        });
        this.preferenceService.onPreferenceChanged(event => {
            if (event.preferenceName === toolbar_preference_contribution_1.TOOLBAR_ENABLE_PREFERENCE_ID) {
                this.tryShowToolbar();
            }
        });
    }
    tryShowToolbar() {
        const doShowToolbarFromPreference = this.toolbarPreferences[toolbar_preference_contribution_1.TOOLBAR_ENABLE_PREFERENCE_ID];
        const isShellMaximized = this.mainPanel.hasClass(theia_dock_panel_1.MAXIMIZED_CLASS) || this.bottomPanel.hasClass(theia_dock_panel_1.MAXIMIZED_CLASS);
        if (doShowToolbarFromPreference && !isShellMaximized) {
            this.toolbar.show();
            return true;
        }
        this.toolbar.hide();
        return false;
    }
    createLayout() {
        const bottomSplitLayout = this.createSplitLayout([this.mainPanel, this.bottomPanel], [1, 0], { orientation: 'vertical', spacing: 0 });
        const panelForBottomArea = new browser_1.SplitPanel({ layout: bottomSplitLayout });
        panelForBottomArea.id = 'theia-bottom-split-panel';
        const leftRightSplitLayout = this.createSplitLayout([this.leftPanelHandler.container, panelForBottomArea, this.rightPanelHandler.container], [0, 1, 0], { orientation: 'horizontal', spacing: 0 });
        const panelForSideAreas = new browser_1.SplitPanel({ layout: leftRightSplitLayout });
        panelForSideAreas.id = 'theia-left-right-split-panel';
        return this.createBoxLayout([this.topPanel, this.toolbar, panelForSideAreas, this.statusBar], [0, 0, 1, 0], { direction: 'top-to-bottom', spacing: 0 });
    }
};
__decorate([
    (0, inversify_1.inject)(toolbar_preference_contribution_1.ToolbarPreferences),
    __metadata("design:type", Object)
], ApplicationShellWithToolbarOverride.prototype, "toolbarPreferences", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.PreferenceService),
    __metadata("design:type", Object)
], ApplicationShellWithToolbarOverride.prototype, "preferenceService", void 0);
__decorate([
    (0, inversify_1.inject)(toolbar_interfaces_1.ToolbarFactory),
    __metadata("design:type", Function)
], ApplicationShellWithToolbarOverride.prototype, "toolbarFactory", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ApplicationShellWithToolbarOverride.prototype, "init", null);
ApplicationShellWithToolbarOverride = __decorate([
    (0, inversify_1.injectable)()
], ApplicationShellWithToolbarOverride);
exports.ApplicationShellWithToolbarOverride = ApplicationShellWithToolbarOverride;
const bindToolbarApplicationShell = (bind, rebind, unbind) => {
    bind(ApplicationShellWithToolbarOverride).toSelf().inSingletonScope();
    rebind(browser_1.ApplicationShell).toService(ApplicationShellWithToolbarOverride);
};
exports.bindToolbarApplicationShell = bindToolbarApplicationShell;
//# sourceMappingURL=application-shell-with-toolbar-override.js.map