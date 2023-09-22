"use strict";
/********************************************************************************
 * Copyright (C) 2020 TypeFox and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0
 *******************************************************************************‚*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var VSXExtensionsViewContainer_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VSXExtensionsViewContainer = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/core/lib/browser");
const vsx_extensions_search_bar_1 = require("./vsx-extensions-search-bar");
const vsx_extensions_model_1 = require("./vsx-extensions-model");
const vsx_extensions_search_model_1 = require("./vsx-extensions-search-model");
const vsx_extensions_widget_1 = require("./vsx-extensions-widget");
const vsx_extensions_source_1 = require("./vsx-extensions-source");
const vsx_extension_commands_1 = require("./vsx-extension-commands");
const nls_1 = require("@theia/core/lib/common/nls");
let VSXExtensionsViewContainer = VSXExtensionsViewContainer_1 = class VSXExtensionsViewContainer extends browser_1.ViewContainer {
    constructor() {
        super(...arguments);
        this.disableDNDBetweenContainers = true;
        this.currentMode = vsx_extensions_search_model_1.VSXSearchMode.Initial;
        this.lastModeState = new Map();
    }
    init() {
        super.init();
        this.id = VSXExtensionsViewContainer_1.ID;
        this.addClass('theia-vsx-extensions-view-container');
        this.setTitleOptions({
            label: VSXExtensionsViewContainer_1.LABEL,
            iconClass: (0, browser_1.codicon)('extensions'),
            closeable: true
        });
    }
    onActivateRequest(msg) {
        this.searchBar.activate();
    }
    onAfterAttach(msg) {
        super.onBeforeAttach(msg);
        this.updateMode();
        this.toDisposeOnDetach.push(this.model.search.onDidChangeQuery(() => this.updateMode()));
    }
    configureLayout(layout) {
        layout.addWidget(this.searchBar);
        super.configureLayout(layout);
    }
    updateMode() {
        const currentMode = this.model.search.getModeForQuery();
        if (currentMode === this.currentMode) {
            return;
        }
        if (this.currentMode !== vsx_extensions_search_model_1.VSXSearchMode.Initial) {
            this.lastModeState.set(this.currentMode, super.doStoreState());
        }
        this.currentMode = currentMode;
        const lastState = this.lastModeState.get(currentMode);
        if (lastState) {
            super.doRestoreState(lastState);
        }
        else {
            for (const part of this.getParts()) {
                this.applyModeToPart(part);
            }
        }
        const specialWidgets = this.getWidgetsForMode();
        if (specialWidgets === null || specialWidgets === void 0 ? void 0 : specialWidgets.length) {
            const widgetChecker = new Set(specialWidgets);
            const relevantParts = this.getParts().filter(part => widgetChecker.has(part.wrapped.id));
            relevantParts.forEach(part => {
                part.collapsed = false;
                part.show();
            });
        }
    }
    registerPart(part) {
        super.registerPart(part);
        this.applyModeToPart(part);
    }
    applyModeToPart(part) {
        if (this.shouldShowWidget(part)) {
            part.show();
        }
        else {
            part.hide();
        }
    }
    shouldShowWidget(part) {
        const widgetsToShow = this.getWidgetsForMode();
        if (widgetsToShow.length) {
            return widgetsToShow.includes(part.wrapped.id);
        }
        return part.wrapped.id !== (0, vsx_extensions_widget_1.generateExtensionWidgetId)(vsx_extensions_source_1.VSXExtensionsSourceOptions.SEARCH_RESULT);
    }
    getWidgetsForMode() {
        switch (this.currentMode) {
            case vsx_extensions_search_model_1.VSXSearchMode.Builtin:
                return [(0, vsx_extensions_widget_1.generateExtensionWidgetId)(vsx_extensions_source_1.VSXExtensionsSourceOptions.BUILT_IN)];
            case vsx_extensions_search_model_1.VSXSearchMode.Installed:
                return [(0, vsx_extensions_widget_1.generateExtensionWidgetId)(vsx_extensions_source_1.VSXExtensionsSourceOptions.INSTALLED)];
            case vsx_extensions_search_model_1.VSXSearchMode.Recommended:
                return [(0, vsx_extensions_widget_1.generateExtensionWidgetId)(vsx_extensions_source_1.VSXExtensionsSourceOptions.RECOMMENDED)];
            case vsx_extensions_search_model_1.VSXSearchMode.Search:
                return [(0, vsx_extensions_widget_1.generateExtensionWidgetId)(vsx_extensions_source_1.VSXExtensionsSourceOptions.SEARCH_RESULT)];
            default:
                return [];
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    doStoreState() {
        const modes = {};
        for (const mode of this.lastModeState.keys()) {
            modes[mode] = this.lastModeState.get(mode);
        }
        return {
            query: this.model.search.query,
            modes
        };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    doRestoreState(state) {
        // eslint-disable-next-line guard-for-in
        for (const key in state.modes) {
            const mode = Number(key);
            const modeState = state.modes[mode];
            if (modeState) {
                this.lastModeState.set(mode, modeState);
            }
        }
        this.model.search.query = state.query;
    }
    updateToolbarItems(allParts) {
        super.updateToolbarItems(allParts);
        this.registerToolbarItem(vsx_extension_commands_1.VSXExtensionsCommands.INSTALL_FROM_VSIX.id, { tooltip: vsx_extension_commands_1.VSXExtensionsCommands.INSTALL_FROM_VSIX.label, group: 'other_1' });
        this.registerToolbarItem(vsx_extension_commands_1.VSXExtensionsCommands.CLEAR_ALL.id, { tooltip: vsx_extension_commands_1.VSXExtensionsCommands.CLEAR_ALL.label, priority: 1, onDidChange: this.model.onDidChange });
    }
    getToggleVisibilityGroupLabel() {
        return 'a/' + nls_1.nls.localizeByDefault('Views');
    }
};
VSXExtensionsViewContainer.ID = 'vsx-extensions-view-container';
VSXExtensionsViewContainer.LABEL = nls_1.nls.localizeByDefault('Extensions');
__decorate([
    (0, inversify_1.inject)(vsx_extensions_search_bar_1.VSXExtensionsSearchBar),
    __metadata("design:type", vsx_extensions_search_bar_1.VSXExtensionsSearchBar)
], VSXExtensionsViewContainer.prototype, "searchBar", void 0);
__decorate([
    (0, inversify_1.inject)(vsx_extensions_model_1.VSXExtensionsModel),
    __metadata("design:type", vsx_extensions_model_1.VSXExtensionsModel)
], VSXExtensionsViewContainer.prototype, "model", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VSXExtensionsViewContainer.prototype, "init", null);
VSXExtensionsViewContainer = VSXExtensionsViewContainer_1 = __decorate([
    (0, inversify_1.injectable)()
], VSXExtensionsViewContainer);
exports.VSXExtensionsViewContainer = VSXExtensionsViewContainer;
//# sourceMappingURL=vsx-extensions-view-container.js.map