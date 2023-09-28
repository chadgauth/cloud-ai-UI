"use strict";
// *****************************************************************************
// Copyright (C) 2018 Red Hat, Inc. and others.
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
exports.MenusContributionPointHandler = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const inversify_1 = require("@theia/core/shared/inversify");
const core_1 = require("@theia/core");
const common_1 = require("@theia/core/lib/common");
const tab_bar_toolbar_1 = require("@theia/core/lib/browser/shell/tab-bar-toolbar");
const scm_widget_1 = require("@theia/scm/lib/browser/scm-widget");
const browser_1 = require("@theia/core/lib/browser");
const vscode_theia_menu_mappings_1 = require("./vscode-theia-menu-mappings");
const plugin_menu_command_adapter_1 = require("./plugin-menu-command-adapter");
const contextkey_1 = require("@theia/monaco-editor-core/esm/vs/platform/contextkey/common/contextkey");
const context_key_service_1 = require("@theia/core/lib/browser/context-key-service");
const plugin_shared_style_1 = require("../plugin-shared-style");
const themeService_1 = require("@theia/monaco-editor-core/esm/vs/platform/theme/common/themeService");
let MenusContributionPointHandler = class MenusContributionPointHandler {
    constructor() {
        this.titleContributionContextKeys = new plugin_menu_command_adapter_1.ReferenceCountingSet();
        this.onDidChangeTitleContributionEmitter = new core_1.Emitter();
        this.initialized = false;
    }
    initialize() {
        this.initialized = true;
        this.commandAdapterRegistry.registerAdapter(this.commandAdapter);
        this.tabBarToolbar.registerMenuDelegate(vscode_theia_menu_mappings_1.PLUGIN_EDITOR_TITLE_MENU, widget => this.codeEditorWidgetUtil.is(widget));
        this.tabBarToolbar.registerItem({
            id: this.tabBarToolbar.toElementId(vscode_theia_menu_mappings_1.PLUGIN_EDITOR_TITLE_RUN_MENU), menuPath: vscode_theia_menu_mappings_1.PLUGIN_EDITOR_TITLE_RUN_MENU,
            icon: 'debug-alt', text: core_1.nls.localizeByDefault('Run or Debug...'),
            command: '', group: 'navigation', isVisible: widget => this.codeEditorWidgetUtil.is(widget)
        });
        this.tabBarToolbar.registerMenuDelegate(vscode_theia_menu_mappings_1.PLUGIN_SCM_TITLE_MENU, widget => widget instanceof scm_widget_1.ScmWidget);
        this.tabBarToolbar.registerMenuDelegate(vscode_theia_menu_mappings_1.PLUGIN_VIEW_TITLE_MENU, widget => !this.codeEditorWidgetUtil.is(widget));
        this.tabBarToolbar.registerItem({ id: 'plugin-menu-contribution-title-contribution', command: '_never_', onDidChange: this.onDidChangeTitleContributionEmitter.event });
        this.contextKeyService.onDidChange(event => {
            if (event.affects(this.titleContributionContextKeys)) {
                this.onDidChangeTitleContributionEmitter.fire();
            }
        });
    }
    getMatchingMenu(contributionPoint) {
        return vscode_theia_menu_mappings_1.codeToTheiaMappings.get(contributionPoint);
    }
    handle(plugin) {
        var _a, _b, _c, _d;
        const allMenus = (_a = plugin.contributes) === null || _a === void 0 ? void 0 : _a.menus;
        if (!allMenus) {
            return core_1.Disposable.NULL;
        }
        if (!this.initialized) {
            this.initialize();
        }
        const toDispose = new core_1.DisposableCollection();
        const submenus = (_c = (_b = plugin.contributes) === null || _b === void 0 ? void 0 : _b.submenus) !== null && _c !== void 0 ? _c : [];
        for (const submenu of submenus) {
            const iconClass = submenu.icon && this.toIconClass(submenu.icon, toDispose);
            this.menuRegistry.registerIndependentSubmenu(submenu.id, submenu.label, iconClass ? { iconClass } : undefined);
        }
        for (const [contributionPoint, items] of Object.entries(allMenus)) {
            for (const item of items) {
                try {
                    if (contributionPoint === 'commandPalette') {
                        toDispose.push(this.registerCommandPaletteAction(item));
                    }
                    else {
                        this.checkTitleContribution(contributionPoint, item, toDispose);
                        const targets = (_d = this.getMatchingMenu(contributionPoint)) !== null && _d !== void 0 ? _d : [contributionPoint];
                        const { group, order } = this.parseGroup(item.group);
                        const { submenu, command } = item;
                        if (submenu) {
                            targets.forEach(target => toDispose.push(this.menuRegistry.linkSubmenu(target, submenu, { order, when: item.when }, group)));
                        }
                        else if (command) {
                            toDispose.push(this.commandAdapter.addCommand(command));
                            targets.forEach(target => {
                                const node = new core_1.ActionMenuNode({
                                    commandId: command,
                                    when: item.when,
                                    order,
                                }, this.commands);
                                const parent = this.menuRegistry.getMenuNode(target, group);
                                toDispose.push(parent.addNode(node));
                            });
                        }
                    }
                }
                catch (error) {
                    console.warn(`Failed to register a menu item for plugin ${plugin.metadata.model.id} contributed to ${contributionPoint}`, item, error);
                }
            }
        }
        return toDispose;
    }
    parseGroup(rawGroup) {
        if (!rawGroup) {
            return {};
        }
        const separatorIndex = rawGroup.lastIndexOf('@');
        if (separatorIndex > -1) {
            return { group: rawGroup.substring(0, separatorIndex), order: rawGroup.substring(separatorIndex + 1) || undefined };
        }
        return { group: rawGroup };
    }
    registerCommandPaletteAction(menu) {
        if (menu.command && menu.when) {
            return this.quickCommandService.pushCommandContext(menu.command, menu.when);
        }
        return core_1.Disposable.NULL;
    }
    checkTitleContribution(contributionPoint, contribution, toDispose) {
        if (contribution.when && contributionPoint.endsWith('title')) {
            const expression = contextkey_1.ContextKeyExpr.deserialize(contribution.when);
            if (expression) {
                for (const key of expression.keys()) {
                    this.titleContributionContextKeys.add(key);
                    toDispose.push(core_1.Disposable.create(() => this.titleContributionContextKeys.delete(key)));
                }
                toDispose.push(core_1.Disposable.create(() => this.onDidChangeTitleContributionEmitter.fire()));
            }
        }
    }
    toIconClass(url, toDispose) {
        if (typeof url === 'string') {
            const asThemeIcon = themeService_1.ThemeIcon.fromString(url);
            if (asThemeIcon) {
                return themeService_1.ThemeIcon.asClassName(asThemeIcon);
            }
        }
        const reference = this.style.toIconClass(url);
        toDispose.push(reference);
        return reference.object.iconClass;
    }
};
__decorate([
    (0, inversify_1.inject)(common_1.MenuModelRegistry),
    __metadata("design:type", common_1.MenuModelRegistry)
], MenusContributionPointHandler.prototype, "menuRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.CommandRegistry),
    __metadata("design:type", core_1.CommandRegistry)
], MenusContributionPointHandler.prototype, "commands", void 0);
__decorate([
    (0, inversify_1.inject)(tab_bar_toolbar_1.TabBarToolbarRegistry),
    __metadata("design:type", tab_bar_toolbar_1.TabBarToolbarRegistry)
], MenusContributionPointHandler.prototype, "tabBarToolbar", void 0);
__decorate([
    (0, inversify_1.inject)(vscode_theia_menu_mappings_1.CodeEditorWidgetUtil),
    __metadata("design:type", vscode_theia_menu_mappings_1.CodeEditorWidgetUtil)
], MenusContributionPointHandler.prototype, "codeEditorWidgetUtil", void 0);
__decorate([
    (0, inversify_1.inject)(plugin_menu_command_adapter_1.PluginMenuCommandAdapter),
    __metadata("design:type", plugin_menu_command_adapter_1.PluginMenuCommandAdapter)
], MenusContributionPointHandler.prototype, "commandAdapter", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.MenuCommandAdapterRegistry),
    __metadata("design:type", Object)
], MenusContributionPointHandler.prototype, "commandAdapterRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(context_key_service_1.ContextKeyService),
    __metadata("design:type", Object)
], MenusContributionPointHandler.prototype, "contextKeyService", void 0);
__decorate([
    (0, inversify_1.inject)(plugin_shared_style_1.PluginSharedStyle),
    __metadata("design:type", plugin_shared_style_1.PluginSharedStyle)
], MenusContributionPointHandler.prototype, "style", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.QuickCommandService),
    (0, inversify_1.optional)(),
    __metadata("design:type", browser_1.QuickCommandService)
], MenusContributionPointHandler.prototype, "quickCommandService", void 0);
MenusContributionPointHandler = __decorate([
    (0, inversify_1.injectable)()
], MenusContributionPointHandler);
exports.MenusContributionPointHandler = MenusContributionPointHandler;
//# sourceMappingURL=menus-contribution-handler.js.map