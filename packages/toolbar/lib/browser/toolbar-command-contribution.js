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
exports.bindToolbar = exports.ToolbarCommandContribution = void 0;
const core_1 = require("@theia/core");
const browser_1 = require("@theia/core/lib/browser");
const inversify_1 = require("@theia/core/shared/inversify");
const browser_2 = require("@theia/editor/lib/browser");
const toolbar_1 = require("./toolbar");
const toolbar_icon_selector_dialog_1 = require("./toolbar-icon-selector-dialog");
const toolbar_interfaces_1 = require("./toolbar-interfaces");
const toolbar_command_quick_input_service_1 = require("./toolbar-command-quick-input-service");
const toolbar_storage_provider_1 = require("./toolbar-storage-provider");
const toolbar_controller_1 = require("./toolbar-controller");
const toolbar_preference_contribution_1 = require("./toolbar-preference-contribution");
const toolbar_defaults_1 = require("./toolbar-defaults");
const toolbar_constants_1 = require("./toolbar-constants");
const json_schema_store_1 = require("@theia/core/lib/browser/json-schema-store");
const toolbar_preference_schema_1 = require("./toolbar-preference-schema");
const uri_1 = require("@theia/core/lib/common/uri");
let ToolbarCommandContribution = class ToolbarCommandContribution {
    constructor() {
        this.schemaURI = new uri_1.default(toolbar_preference_schema_1.toolbarSchemaId);
    }
    registerSchemas(context) {
        this.inMemoryResources.add(this.schemaURI, JSON.stringify(toolbar_preference_schema_1.toolbarConfigurationSchema));
        context.registerSchema({
            fileMatch: ['toolbar.json'],
            url: this.schemaURI.toString(),
        });
    }
    registerCommands(registry) {
        registry.registerCommand(toolbar_constants_1.ToolbarCommands.CUSTOMIZE_TOOLBAR, {
            execute: () => this.model.openOrCreateJSONFile(true),
        });
        registry.registerCommand(toolbar_constants_1.ToolbarCommands.RESET_TOOLBAR, {
            execute: () => this.model.clearAll(),
        });
        registry.registerCommand(toolbar_constants_1.ToolbarCommands.TOGGLE_TOOLBAR, {
            execute: () => {
                const isVisible = this.preferenceService.get(toolbar_preference_contribution_1.TOOLBAR_ENABLE_PREFERENCE_ID);
                this.preferenceService.set(toolbar_preference_contribution_1.TOOLBAR_ENABLE_PREFERENCE_ID, !isVisible, browser_1.PreferenceScope.User);
            },
        });
        registry.registerCommand(toolbar_constants_1.ToolbarCommands.REMOVE_COMMAND_FROM_TOOLBAR, {
            execute: async (_widget, position, id) => position && this.model.removeItem(position, id),
            isVisible: (...args) => this.isToolbarWidget(args[0]),
        });
        registry.registerCommand(toolbar_constants_1.ToolbarCommands.INSERT_GROUP_LEFT, {
            execute: async (_widget, position) => position && this.model.insertGroup(position, 'left'),
            isVisible: (widget, position) => {
                if (position) {
                    const { alignment, groupIndex, itemIndex } = position;
                    const owningGroupLength = this.toolbarModel.toolbarItems.items[alignment][groupIndex].length;
                    return this.isToolbarWidget(widget) && (owningGroupLength > 1) && (itemIndex > 0);
                }
                return false;
            },
        });
        registry.registerCommand(toolbar_constants_1.ToolbarCommands.INSERT_GROUP_RIGHT, {
            execute: async (_widget, position) => position && this.model.insertGroup(position, 'right'),
            isVisible: (widget, position) => {
                if (position) {
                    const { alignment, groupIndex, itemIndex } = position;
                    const owningGroupLength = this.toolbarModel.toolbarItems.items[alignment][groupIndex].length;
                    const isNotLastItem = itemIndex < (owningGroupLength - 1);
                    return this.isToolbarWidget(widget) && owningGroupLength > 1 && isNotLastItem;
                }
                return false;
            },
        });
        registry.registerCommand(toolbar_constants_1.ToolbarCommands.ADD_COMMAND_TO_TOOLBAR, {
            execute: () => this.toolbarCommandPickService.openIconDialog(),
        });
    }
    isToolbarWidget(arg) {
        return arg instanceof toolbar_1.ToolbarImpl;
    }
    registerKeybindings(keys) {
        keys.registerKeybinding({
            command: toolbar_constants_1.ToolbarCommands.TOGGLE_TOOLBAR.id,
            keybinding: 'alt+t',
        });
    }
    registerMenus(registry) {
        registry.registerMenuAction(browser_1.CommonMenus.VIEW_LAYOUT, {
            commandId: toolbar_constants_1.ToolbarCommands.TOGGLE_TOOLBAR.id,
            order: 'z',
        });
        registry.registerMenuAction(toolbar_constants_1.ToolbarMenus.TOOLBAR_ITEM_CONTEXT_MENU, {
            commandId: toolbar_constants_1.ToolbarCommands.ADD_COMMAND_TO_TOOLBAR.id,
            order: 'a',
        });
        registry.registerMenuAction(toolbar_constants_1.ToolbarMenus.TOOLBAR_ITEM_CONTEXT_MENU, {
            commandId: toolbar_constants_1.ToolbarCommands.INSERT_GROUP_LEFT.id,
            order: 'b',
        });
        registry.registerMenuAction(toolbar_constants_1.ToolbarMenus.TOOLBAR_ITEM_CONTEXT_MENU, {
            commandId: toolbar_constants_1.ToolbarCommands.INSERT_GROUP_RIGHT.id,
            order: 'c',
        });
        registry.registerMenuAction(toolbar_constants_1.ToolbarMenus.TOOLBAR_ITEM_CONTEXT_MENU, {
            commandId: toolbar_constants_1.ToolbarCommands.REMOVE_COMMAND_FROM_TOOLBAR.id,
            order: 'd',
        });
        registry.registerMenuAction(toolbar_constants_1.ToolbarMenus.TOOLBAR_BACKGROUND_CONTEXT_MENU, {
            commandId: toolbar_constants_1.ToolbarCommands.ADD_COMMAND_TO_TOOLBAR.id,
            order: 'a',
        });
        registry.registerMenuAction(toolbar_constants_1.ToolbarMenus.TOOLBAR_BACKGROUND_CONTEXT_MENU, {
            commandId: toolbar_constants_1.ToolbarCommands.CUSTOMIZE_TOOLBAR.id,
            order: 'b',
        });
        registry.registerMenuAction(toolbar_constants_1.ToolbarMenus.TOOLBAR_BACKGROUND_CONTEXT_MENU, {
            commandId: toolbar_constants_1.ToolbarCommands.TOGGLE_TOOLBAR.id,
            order: 'c',
        });
        registry.registerMenuAction(toolbar_constants_1.ToolbarMenus.TOOLBAR_BACKGROUND_CONTEXT_MENU, {
            commandId: toolbar_constants_1.ToolbarCommands.RESET_TOOLBAR.id,
            order: 'd',
        });
    }
};
__decorate([
    (0, inversify_1.inject)(toolbar_controller_1.ToolbarController),
    __metadata("design:type", toolbar_controller_1.ToolbarController)
], ToolbarCommandContribution.prototype, "model", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.QuickInputService),
    __metadata("design:type", Object)
], ToolbarCommandContribution.prototype, "quickInputService", void 0);
__decorate([
    (0, inversify_1.inject)(toolbar_command_quick_input_service_1.ToolbarCommandQuickInputService),
    __metadata("design:type", toolbar_command_quick_input_service_1.ToolbarCommandQuickInputService)
], ToolbarCommandContribution.prototype, "toolbarCommandPickService", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.CommandService),
    __metadata("design:type", Object)
], ToolbarCommandContribution.prototype, "commandService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.EditorManager),
    __metadata("design:type", browser_2.EditorManager)
], ToolbarCommandContribution.prototype, "editorManager", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.PreferenceService),
    __metadata("design:type", Object)
], ToolbarCommandContribution.prototype, "preferenceService", void 0);
__decorate([
    (0, inversify_1.inject)(toolbar_controller_1.ToolbarController),
    __metadata("design:type", toolbar_controller_1.ToolbarController)
], ToolbarCommandContribution.prototype, "toolbarModel", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.InMemoryResources),
    __metadata("design:type", core_1.InMemoryResources)
], ToolbarCommandContribution.prototype, "inMemoryResources", void 0);
ToolbarCommandContribution = __decorate([
    (0, inversify_1.injectable)()
], ToolbarCommandContribution);
exports.ToolbarCommandContribution = ToolbarCommandContribution;
function bindToolbar(bind) {
    bind(toolbar_interfaces_1.ToolbarFactory).toFactory(({ container }) => () => {
        const child = new inversify_1.Container({ defaultScope: 'Singleton' });
        child.parent = container;
        child.bind(toolbar_interfaces_1.Toolbar).to(toolbar_1.ToolbarImpl);
        return child.get(toolbar_interfaces_1.Toolbar);
    });
    bind(ToolbarCommandContribution).toSelf().inSingletonScope();
    bind(core_1.CommandContribution).to(ToolbarCommandContribution);
    bind(core_1.MenuContribution).toService(ToolbarCommandContribution);
    bind(browser_1.KeybindingContribution).toService(ToolbarCommandContribution);
    bind(json_schema_store_1.JsonSchemaContribution).toService(ToolbarCommandContribution);
    bind(toolbar_command_quick_input_service_1.ToolbarCommandQuickInputService).toSelf().inSingletonScope();
    (0, toolbar_icon_selector_dialog_1.bindToolbarIconDialog)(bind);
    bind(toolbar_defaults_1.ToolbarDefaultsFactory).toConstantValue(toolbar_defaults_1.ToolbarDefaults);
    bind(toolbar_preference_contribution_1.ToolbarPreferences).toDynamicValue(({ container }) => {
        const preferences = container.get(browser_1.PreferenceService);
        return (0, browser_1.createPreferenceProxy)(preferences, toolbar_preference_contribution_1.ToolbarPreferencesSchema);
    }).inSingletonScope();
    bind(browser_1.PreferenceContribution).toConstantValue({
        schema: toolbar_preference_contribution_1.ToolbarPreferencesSchema,
    });
    bind(toolbar_constants_1.UserToolbarURI).toConstantValue(toolbar_constants_1.USER_TOOLBAR_URI);
    bind(toolbar_controller_1.ToolbarController).toSelf().inSingletonScope();
    bind(toolbar_storage_provider_1.ToolbarStorageProvider).toSelf().inSingletonScope();
    (0, core_1.bindContributionProvider)(bind, toolbar_interfaces_1.ToolbarContribution);
    bind(toolbar_interfaces_1.LateInjector).toFactory((context) => (id) => (0, toolbar_interfaces_1.lateInjector)(context.container, id));
}
exports.bindToolbar = bindToolbar;
//# sourceMappingURL=toolbar-command-contribution.js.map