"use strict";
// *****************************************************************************
// Copyright (C) 2020 Ericsson and others.
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
var PreferencesWidget_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreferencesWidget = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/core/lib/browser");
const preference_editor_widget_1 = require("./preference-editor-widget");
const preference_tree_widget_1 = require("./preference-tree-widget");
const preference_searchbar_widget_1 = require("./preference-searchbar-widget");
const preference_scope_tabbar_widget_1 = require("./preference-scope-tabbar-widget");
const nls_1 = require("@theia/core/lib/common/nls");
let PreferencesWidget = PreferencesWidget_1 = class PreferencesWidget extends browser_1.Panel {
    get currentScope() {
        return this.tabBarWidget.currentScope;
    }
    setSearchTerm(query) {
        return this.searchbarWidget.updateSearchTerm(query);
    }
    setScope(scope) {
        this.tabBarWidget.setScope(scope);
    }
    onResize(msg) {
        super.onResize(msg);
        if (msg.width < 600 && this.treeWidget && !this.treeWidget.isHidden) {
            this.treeWidget.hide();
            this.editorWidget.addClass('full-pane');
        }
        else if (msg.width >= 600 && this.treeWidget && this.treeWidget.isHidden) {
            this.treeWidget.show();
            this.editorWidget.removeClass('full-pane');
        }
    }
    onActivateRequest(msg) {
        super.onActivateRequest(msg);
        this.searchbarWidget.focus();
    }
    init() {
        this.id = PreferencesWidget_1.ID;
        this.title.label = PreferencesWidget_1.LABEL;
        this.title.closable = true;
        this.addClass('theia-settings-container');
        this.title.iconClass = (0, browser_1.codicon)('settings');
        this.searchbarWidget.addClass('preferences-searchbar-widget');
        this.addWidget(this.searchbarWidget);
        this.tabBarWidget.addClass('preferences-tabbar-widget');
        this.addWidget(this.tabBarWidget);
        this.treeWidget.addClass('preferences-tree-widget');
        this.addWidget(this.treeWidget);
        this.editorWidget.addClass('preferences-editor-widget');
        this.addWidget(this.editorWidget);
        this.update();
    }
    getPreviewNode() {
        return this.node;
    }
    storeState() {
        return {
            scopeTabBarState: this.tabBarWidget.storeState(),
            editorState: this.editorWidget.storeState(),
            searchbarWidgetState: this.searchbarWidget.storeState(),
        };
    }
    restoreState(state) {
        this.tabBarWidget.restoreState(state.scopeTabBarState);
        this.editorWidget.restoreState(state.editorState);
        this.searchbarWidget.restoreState(state.searchbarWidgetState);
    }
};
/**
 * The widget `id`.
 */
PreferencesWidget.ID = 'settings_widget';
/**
 * The widget `label` which is used for display purposes.
 */
PreferencesWidget.LABEL = nls_1.nls.localizeByDefault('Settings');
__decorate([
    (0, inversify_1.inject)(preference_editor_widget_1.PreferencesEditorWidget),
    __metadata("design:type", preference_editor_widget_1.PreferencesEditorWidget)
], PreferencesWidget.prototype, "editorWidget", void 0);
__decorate([
    (0, inversify_1.inject)(preference_tree_widget_1.PreferencesTreeWidget),
    __metadata("design:type", preference_tree_widget_1.PreferencesTreeWidget)
], PreferencesWidget.prototype, "treeWidget", void 0);
__decorate([
    (0, inversify_1.inject)(preference_searchbar_widget_1.PreferencesSearchbarWidget),
    __metadata("design:type", preference_searchbar_widget_1.PreferencesSearchbarWidget)
], PreferencesWidget.prototype, "searchbarWidget", void 0);
__decorate([
    (0, inversify_1.inject)(preference_scope_tabbar_widget_1.PreferencesScopeTabBar),
    __metadata("design:type", preference_scope_tabbar_widget_1.PreferencesScopeTabBar)
], PreferencesWidget.prototype, "tabBarWidget", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PreferencesWidget.prototype, "init", null);
PreferencesWidget = PreferencesWidget_1 = __decorate([
    (0, inversify_1.injectable)()
], PreferencesWidget);
exports.PreferencesWidget = PreferencesWidget;
//# sourceMappingURL=preference-widget.js.map