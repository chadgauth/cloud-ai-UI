"use strict";
// *****************************************************************************
// Copyright (C) 2017 TypeFox and others.
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonacoEditorMenuContribution = exports.MonacoMenus = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const common_1 = require("@theia/core/lib/common");
const browser_1 = require("@theia/editor/lib/browser");
const monaco_command_registry_1 = require("./monaco-command-registry");
const nls_1 = require("@theia/core/lib/common/nls");
const actions_1 = require("@theia/monaco-editor-core/esm/vs/platform/actions/common/actions");
var MonacoMenus;
(function (MonacoMenus) {
    MonacoMenus.SELECTION = [...common_1.MAIN_MENU_BAR, '3_selection'];
    MonacoMenus.PEEK_CONTEXT_SUBMENU = [...browser_1.EDITOR_CONTEXT_MENU, 'navigation', 'peek_submenu'];
    MonacoMenus.MARKERS_GROUP = [...browser_1.EditorMainMenu.GO, '5_markers_group'];
})(MonacoMenus = exports.MonacoMenus || (exports.MonacoMenus = {}));
let MonacoEditorMenuContribution = class MonacoEditorMenuContribution {
    constructor(commands) {
        this.commands = commands;
    }
    registerMenus(registry) {
        for (const item of actions_1.MenuRegistry.getMenuItems(actions_1.MenuId.EditorContext)) {
            if (!(0, actions_1.isIMenuItem)(item)) {
                continue;
            }
            const commandId = this.commands.validate(item.command.id);
            if (commandId) {
                const menuPath = [...browser_1.EDITOR_CONTEXT_MENU, (item.group || '')];
                registry.registerMenuAction(menuPath, this.buildMenuAction(commandId, item));
            }
        }
        this.registerPeekSubmenu(registry);
        registry.registerSubmenu(MonacoMenus.SELECTION, nls_1.nls.localizeByDefault('Selection'));
        for (const item of actions_1.MenuRegistry.getMenuItems(actions_1.MenuId.MenubarSelectionMenu)) {
            if (!(0, actions_1.isIMenuItem)(item)) {
                continue;
            }
            const commandId = this.commands.validate(item.command.id);
            if (commandId) {
                const menuPath = [...MonacoMenus.SELECTION, (item.group || '')];
                registry.registerMenuAction(menuPath, this.buildMenuAction(commandId, item));
            }
        }
        // Builtin monaco language features commands.
        registry.registerMenuAction(browser_1.EditorMainMenu.LANGUAGE_FEATURES_GROUP, {
            commandId: 'editor.action.quickOutline',
            label: nls_1.nls.localizeByDefault('Go to Symbol in Editor...'),
            order: '1'
        });
        registry.registerMenuAction(browser_1.EditorMainMenu.LANGUAGE_FEATURES_GROUP, {
            commandId: 'editor.action.revealDefinition',
            label: nls_1.nls.localizeByDefault('Go to Definition'),
            order: '2'
        });
        registry.registerMenuAction(browser_1.EditorMainMenu.LANGUAGE_FEATURES_GROUP, {
            commandId: 'editor.action.revealDeclaration',
            label: nls_1.nls.localizeByDefault('Go to Declaration'),
            order: '3'
        });
        registry.registerMenuAction(browser_1.EditorMainMenu.LANGUAGE_FEATURES_GROUP, {
            commandId: 'editor.action.goToTypeDefinition',
            label: nls_1.nls.localizeByDefault('Go to Type Definition'),
            order: '4'
        });
        registry.registerMenuAction(browser_1.EditorMainMenu.LANGUAGE_FEATURES_GROUP, {
            commandId: 'editor.action.goToImplementation',
            label: nls_1.nls.localizeByDefault('Go to Implementations'),
            order: '5'
        });
        registry.registerMenuAction(browser_1.EditorMainMenu.LANGUAGE_FEATURES_GROUP, {
            commandId: 'editor.action.goToReferences',
            label: nls_1.nls.localizeByDefault('Go to References'),
            order: '6'
        });
        registry.registerMenuAction(browser_1.EditorMainMenu.LOCATION_GROUP, {
            commandId: 'editor.action.jumpToBracket',
            label: nls_1.nls.localizeByDefault('Go to Bracket'),
            order: '2'
        });
        // Builtin monaco problem commands.
        registry.registerMenuAction(MonacoMenus.MARKERS_GROUP, {
            commandId: 'editor.action.marker.nextInFiles',
            label: nls_1.nls.localizeByDefault('Next Problem'),
            order: '1'
        });
        registry.registerMenuAction(MonacoMenus.MARKERS_GROUP, {
            commandId: 'editor.action.marker.prevInFiles',
            label: nls_1.nls.localizeByDefault('Previous Problem'),
            order: '2'
        });
    }
    registerPeekSubmenu(registry) {
        registry.registerSubmenu(MonacoMenus.PEEK_CONTEXT_SUBMENU, nls_1.nls.localizeByDefault('Peek'));
        for (const item of actions_1.MenuRegistry.getMenuItems(actions_1.MenuId.EditorContextPeek)) {
            if (!(0, actions_1.isIMenuItem)(item)) {
                continue;
            }
            const commandId = this.commands.validate(item.command.id);
            if (commandId) {
                registry.registerMenuAction([...MonacoMenus.PEEK_CONTEXT_SUBMENU, item.group || ''], this.buildMenuAction(commandId, item));
            }
        }
    }
    buildMenuAction(commandId, item) {
        const title = typeof item.command.title === 'string' ? item.command.title : item.command.title.value;
        const label = this.removeMnemonic(title);
        const order = item.order ? String(item.order) : '';
        return { commandId, order, label };
    }
    removeMnemonic(label) {
        return label.replace(/\(&&\w\)|&&/g, '');
    }
};
MonacoEditorMenuContribution = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(monaco_command_registry_1.MonacoCommandRegistry)),
    __metadata("design:paramtypes", [monaco_command_registry_1.MonacoCommandRegistry])
], MonacoEditorMenuContribution);
exports.MonacoEditorMenuContribution = MonacoEditorMenuContribution;
//# sourceMappingURL=monaco-menu.js.map