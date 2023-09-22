"use strict";
// *****************************************************************************
// Copyright (C) 2018 TypeFox and others.
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
exports.KeymapsFrontendContribution = exports.KeymapsCommands = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const common_1 = require("@theia/core/lib/common");
const browser_1 = require("@theia/core/lib/browser");
const common_frontend_contribution_1 = require("@theia/core/lib/browser/common-frontend-contribution");
const keymaps_service_1 = require("./keymaps-service");
const keybindings_widget_1 = require("./keybindings-widget");
const nls_1 = require("@theia/core/lib/common/nls");
var KeymapsCommands;
(function (KeymapsCommands) {
    KeymapsCommands.OPEN_KEYMAPS = common_1.Command.toDefaultLocalizedCommand({
        id: 'keymaps:open',
        category: common_frontend_contribution_1.CommonCommands.PREFERENCES_CATEGORY,
        label: 'Open Keyboard Shortcuts',
    });
    KeymapsCommands.OPEN_KEYMAPS_JSON = common_1.Command.toDefaultLocalizedCommand({
        id: 'keymaps:openJson',
        category: common_frontend_contribution_1.CommonCommands.PREFERENCES_CATEGORY,
        label: 'Open Keyboard Shortcuts (JSON)',
    });
    KeymapsCommands.OPEN_KEYMAPS_JSON_TOOLBAR = {
        id: 'keymaps:openJson.toolbar',
        iconClass: (0, browser_1.codicon)('json')
    };
    KeymapsCommands.CLEAR_KEYBINDINGS_SEARCH = {
        id: 'keymaps.clearSearch',
        iconClass: (0, browser_1.codicon)('clear-all')
    };
})(KeymapsCommands = exports.KeymapsCommands || (exports.KeymapsCommands = {}));
let KeymapsFrontendContribution = class KeymapsFrontendContribution extends browser_1.AbstractViewContribution {
    constructor() {
        super({
            widgetId: keybindings_widget_1.KeybindingWidget.ID,
            widgetName: keybindings_widget_1.KeybindingWidget.LABEL,
            defaultWidgetOptions: {
                area: 'main'
            },
        });
    }
    registerCommands(commands) {
        commands.registerCommand(KeymapsCommands.OPEN_KEYMAPS, {
            isEnabled: () => true,
            execute: () => this.openView({ activate: true })
        });
        commands.registerCommand(KeymapsCommands.OPEN_KEYMAPS_JSON, {
            isEnabled: () => true,
            execute: () => this.keymaps.open()
        });
        commands.registerCommand(KeymapsCommands.OPEN_KEYMAPS_JSON_TOOLBAR, {
            isEnabled: w => this.withWidget(w, () => true),
            isVisible: w => this.withWidget(w, () => true),
            execute: w => this.withWidget(w, widget => this.keymaps.open(widget)),
        });
        commands.registerCommand(KeymapsCommands.CLEAR_KEYBINDINGS_SEARCH, {
            isEnabled: w => this.withWidget(w, widget => widget.hasSearch()),
            isVisible: w => this.withWidget(w, () => true),
            execute: w => this.withWidget(w, widget => widget.clearSearch()),
        });
    }
    registerMenus(menus) {
        menus.registerMenuAction(common_frontend_contribution_1.CommonMenus.FILE_SETTINGS_SUBMENU_OPEN, {
            commandId: KeymapsCommands.OPEN_KEYMAPS.id,
            label: nls_1.nls.localizeByDefault('Keyboard Shortcuts'),
            order: 'a20'
        });
        menus.registerMenuAction(common_frontend_contribution_1.CommonMenus.SETTINGS_OPEN, {
            commandId: KeymapsCommands.OPEN_KEYMAPS.id,
            label: nls_1.nls.localizeByDefault('Keyboard Shortcuts'),
            order: 'a20'
        });
    }
    registerKeybindings(keybindings) {
        keybindings.registerKeybinding({
            command: KeymapsCommands.OPEN_KEYMAPS.id,
            keybinding: 'ctrl+alt+,'
        });
    }
    async registerToolbarItems(toolbar) {
        const widget = await this.widget;
        const onDidChange = widget.onDidUpdate;
        toolbar.registerItem({
            id: KeymapsCommands.OPEN_KEYMAPS_JSON_TOOLBAR.id,
            command: KeymapsCommands.OPEN_KEYMAPS_JSON_TOOLBAR.id,
            tooltip: nls_1.nls.localizeByDefault('Open Keyboard Shortcuts (JSON)'),
            priority: 0,
        });
        toolbar.registerItem({
            id: KeymapsCommands.CLEAR_KEYBINDINGS_SEARCH.id,
            command: KeymapsCommands.CLEAR_KEYBINDINGS_SEARCH.id,
            tooltip: nls_1.nls.localizeByDefault('Clear Keybindings Search Input'),
            priority: 1,
            onDidChange,
        });
    }
    /**
     * Determine if the current widget is the keybindings widget.
     */
    withWidget(widget = this.tryGetWidget(), fn) {
        if (widget instanceof keybindings_widget_1.KeybindingWidget && widget.id === keybindings_widget_1.KeybindingWidget.ID) {
            return fn(widget);
        }
        return false;
    }
};
__decorate([
    (0, inversify_1.inject)(keymaps_service_1.KeymapsService),
    __metadata("design:type", keymaps_service_1.KeymapsService)
], KeymapsFrontendContribution.prototype, "keymaps", void 0);
KeymapsFrontendContribution = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], KeymapsFrontendContribution);
exports.KeymapsFrontendContribution = KeymapsFrontendContribution;
//# sourceMappingURL=keymaps-frontend-contribution.js.map