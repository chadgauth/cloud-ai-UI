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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditorMenuContribution = exports.EditorMainMenu = exports.EditorContextMenu = exports.EDITOR_CONTEXT_MENU = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const core_1 = require("@theia/core");
const browser_1 = require("@theia/core/lib/browser");
const editor_command_1 = require("./editor-command");
const nls_1 = require("@theia/core/lib/common/nls");
exports.EDITOR_CONTEXT_MENU = ['editor_context_menu'];
/**
 * Editor context menu default groups should be aligned
 * with VS Code default groups: https://code.visualstudio.com/api/references/contribution-points#contributes.menus
 */
var EditorContextMenu;
(function (EditorContextMenu) {
    EditorContextMenu.NAVIGATION = [...exports.EDITOR_CONTEXT_MENU, 'navigation'];
    EditorContextMenu.MODIFICATION = [...exports.EDITOR_CONTEXT_MENU, '1_modification'];
    EditorContextMenu.CUT_COPY_PASTE = [...exports.EDITOR_CONTEXT_MENU, '9_cutcopypaste'];
    EditorContextMenu.COMMANDS = [...exports.EDITOR_CONTEXT_MENU, 'z_commands'];
    EditorContextMenu.UNDO_REDO = [...exports.EDITOR_CONTEXT_MENU, '1_undo'];
})(EditorContextMenu = exports.EditorContextMenu || (exports.EditorContextMenu = {}));
var EditorMainMenu;
(function (EditorMainMenu) {
    /**
     * The main `Go` menu item.
     */
    EditorMainMenu.GO = [...core_1.MAIN_MENU_BAR, '5_go'];
    /**
     * Navigation menu group in the `Go` main-menu.
     */
    EditorMainMenu.NAVIGATION_GROUP = [...EditorMainMenu.GO, '1_navigation_group'];
    /**
     * Context management group in the `Go` main menu: Pane and editor switching commands.
     */
    EditorMainMenu.CONTEXT_GROUP = [...EditorMainMenu.GO, '1.1_context_group'];
    /**
     * Submenu for switching panes in the main area.
     */
    EditorMainMenu.PANE_GROUP = [...EditorMainMenu.CONTEXT_GROUP, '2_pane_group'];
    EditorMainMenu.BY_NUMBER = [...EditorMainMenu.PANE_GROUP, '1_by_number'];
    EditorMainMenu.NEXT_PREVIOUS = [...EditorMainMenu.PANE_GROUP, '2_by_location'];
    /**
     * Workspace menu group in the `Go` main-menu.
     */
    EditorMainMenu.WORKSPACE_GROUP = [...EditorMainMenu.GO, '2_workspace_group'];
    /**
     * Language features menu group in the `Go` main-menu.
     */
    EditorMainMenu.LANGUAGE_FEATURES_GROUP = [...EditorMainMenu.GO, '3_language_features_group'];
    /**
     * Location menu group in the `Go` main-menu.
     */
    EditorMainMenu.LOCATION_GROUP = [...EditorMainMenu.GO, '4_locations'];
})(EditorMainMenu = exports.EditorMainMenu || (exports.EditorMainMenu = {}));
let EditorMenuContribution = class EditorMenuContribution {
    registerMenus(registry) {
        registry.registerMenuAction(EditorContextMenu.UNDO_REDO, {
            commandId: browser_1.CommonCommands.UNDO.id
        });
        registry.registerMenuAction(EditorContextMenu.UNDO_REDO, {
            commandId: browser_1.CommonCommands.REDO.id
        });
        registry.registerMenuAction(EditorContextMenu.CUT_COPY_PASTE, {
            commandId: browser_1.CommonCommands.CUT.id,
            order: '0'
        });
        registry.registerMenuAction(EditorContextMenu.CUT_COPY_PASTE, {
            commandId: browser_1.CommonCommands.COPY.id,
            order: '1'
        });
        registry.registerMenuAction(EditorContextMenu.CUT_COPY_PASTE, {
            commandId: browser_1.CommonCommands.PASTE.id,
            order: '2'
        });
        // Editor navigation. Go > Back and Go > Forward.
        registry.registerSubmenu(EditorMainMenu.GO, nls_1.nls.localizeByDefault('Go'));
        registry.registerMenuAction(EditorMainMenu.NAVIGATION_GROUP, {
            commandId: editor_command_1.EditorCommands.GO_BACK.id,
            label: editor_command_1.EditorCommands.GO_BACK.label,
            order: '1'
        });
        registry.registerMenuAction(EditorMainMenu.NAVIGATION_GROUP, {
            commandId: editor_command_1.EditorCommands.GO_FORWARD.id,
            label: editor_command_1.EditorCommands.GO_FORWARD.label,
            order: '2'
        });
        registry.registerMenuAction(EditorMainMenu.NAVIGATION_GROUP, {
            commandId: editor_command_1.EditorCommands.GO_LAST_EDIT.id,
            label: nls_1.nls.localizeByDefault('Last Edit Location'),
            order: '3'
        });
        registry.registerSubmenu(EditorMainMenu.PANE_GROUP, nls_1.nls.localizeByDefault('Switch Group'));
        registry.registerMenuAction(EditorMainMenu.BY_NUMBER, {
            commandId: 'workbench.action.focusFirstEditorGroup',
            label: nls_1.nls.localizeByDefault('Group 1'),
        });
        registry.registerMenuAction(EditorMainMenu.BY_NUMBER, {
            commandId: 'workbench.action.focusSecondEditorGroup',
            label: nls_1.nls.localizeByDefault('Group 2'),
        });
        registry.registerMenuAction(EditorMainMenu.BY_NUMBER, {
            commandId: 'workbench.action.focusThirdEditorGroup',
            label: nls_1.nls.localizeByDefault('Group 3'),
        });
        registry.registerMenuAction(EditorMainMenu.BY_NUMBER, {
            commandId: 'workbench.action.focusFourthEditorGroup',
            label: nls_1.nls.localizeByDefault('Group 4'),
        });
        registry.registerMenuAction(EditorMainMenu.BY_NUMBER, {
            commandId: 'workbench.action.focusFifthEditorGroup',
            label: nls_1.nls.localizeByDefault('Group 5'),
        });
        registry.registerMenuAction(EditorMainMenu.NEXT_PREVIOUS, {
            commandId: browser_1.CommonCommands.NEXT_TAB_GROUP.id,
            label: nls_1.nls.localizeByDefault('Next Group'),
            order: '1'
        });
        registry.registerMenuAction(EditorMainMenu.NEXT_PREVIOUS, {
            commandId: browser_1.CommonCommands.PREVIOUS_TAB_GROUP.id,
            label: nls_1.nls.localizeByDefault('Previous Group'),
            order: '2'
        });
        registry.registerMenuAction(EditorMainMenu.LOCATION_GROUP, {
            commandId: editor_command_1.EditorCommands.GOTO_LINE_COLUMN.id,
            order: '1'
        });
        // Toggle Commands.
        registry.registerMenuAction(browser_1.CommonMenus.VIEW_TOGGLE, {
            commandId: editor_command_1.EditorCommands.TOGGLE_WORD_WRAP.id,
            order: '0'
        });
        registry.registerMenuAction(browser_1.CommonMenus.VIEW_TOGGLE, {
            commandId: editor_command_1.EditorCommands.TOGGLE_MINIMAP.id,
            order: '1',
        });
        registry.registerMenuAction(browser_1.CommonMenus.VIEW_TOGGLE, {
            commandId: browser_1.CommonCommands.TOGGLE_BREADCRUMBS.id,
            order: '2',
        });
        registry.registerMenuAction(browser_1.CommonMenus.VIEW_TOGGLE, {
            commandId: editor_command_1.EditorCommands.TOGGLE_RENDER_WHITESPACE.id,
            order: '3'
        });
        registry.registerMenuAction(browser_1.CommonMenus.VIEW_TOGGLE, {
            commandId: editor_command_1.EditorCommands.TOGGLE_STICKY_SCROLL.id,
            order: '4'
        });
        registry.registerMenuAction(browser_1.CommonMenus.FILE_CLOSE, {
            commandId: browser_1.CommonCommands.CLOSE_MAIN_TAB.id,
            label: nls_1.nls.localizeByDefault('Close Editor'),
            order: '1'
        });
        registry.registerMenuAction(browser_1.CommonMenus.VIEW_EDITOR_SUBMENU_SPLIT, {
            commandId: editor_command_1.EditorCommands.SPLIT_EDITOR_RIGHT.id,
            label: nls_1.nls.localizeByDefault('Split Editor Right'),
            order: '0'
        });
        registry.registerMenuAction(browser_1.CommonMenus.VIEW_EDITOR_SUBMENU_SPLIT, {
            commandId: editor_command_1.EditorCommands.SPLIT_EDITOR_LEFT.id,
            label: nls_1.nls.localizeByDefault('Split Editor Left'),
            order: '1'
        });
        registry.registerMenuAction(browser_1.CommonMenus.VIEW_EDITOR_SUBMENU_SPLIT, {
            commandId: editor_command_1.EditorCommands.SPLIT_EDITOR_UP.id,
            label: nls_1.nls.localizeByDefault('Split Editor Up'),
            order: '2'
        });
        registry.registerMenuAction(browser_1.CommonMenus.VIEW_EDITOR_SUBMENU_SPLIT, {
            commandId: editor_command_1.EditorCommands.SPLIT_EDITOR_DOWN.id,
            label: nls_1.nls.localizeByDefault('Split Editor Down'),
            order: '3'
        });
        registry.registerMenuAction(browser_1.CommonMenus.VIEW_EDITOR_SUBMENU_ORTHO, {
            commandId: editor_command_1.EditorCommands.SPLIT_EDITOR_HORIZONTAL.id,
            label: nls_1.nls.localize('theia/editor/splitHorizontal', 'Split Editor Horizontal'),
            order: '1'
        });
        registry.registerMenuAction(browser_1.CommonMenus.VIEW_EDITOR_SUBMENU_ORTHO, {
            commandId: editor_command_1.EditorCommands.SPLIT_EDITOR_VERTICAL.id,
            label: nls_1.nls.localize('theia/editor/splitVertical', 'Split Editor Vertical'),
            order: '2'
        });
        registry.registerSubmenu(browser_1.CommonMenus.VIEW_EDITOR_SUBMENU, nls_1.nls.localizeByDefault('Editor Layout'));
    }
};
EditorMenuContribution = __decorate([
    (0, inversify_1.injectable)()
], EditorMenuContribution);
exports.EditorMenuContribution = EditorMenuContribution;
//# sourceMappingURL=editor-menu.js.map