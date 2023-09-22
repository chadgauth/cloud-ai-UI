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
exports.PreferenceScopeCommandManager = exports.FOLDER_SCOPE_MENU_PATH = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/core/lib/browser");
const common_1 = require("@theia/core/lib/common");
const preference_types_1 = require("./preference-types");
/**
 * @deprecated since 1.17.0 moved to PreferenceMenus namespace.
 */
exports.FOLDER_SCOPE_MENU_PATH = preference_types_1.PreferenceMenus.FOLDER_SCOPE_MENU_PATH;
/**
 * @deprecated since 1.17.0. This work is now done in the PreferenceScopeTabbarWidget.
 */
let PreferenceScopeCommandManager = class PreferenceScopeCommandManager {
    constructor() {
        this.foldersAsCommands = [];
    }
    createFolderWorkspacesMenu(folderWorkspaces, currentFolderURI) {
        this.foldersAsCommands.forEach(folderCommand => {
            this.menuModelRegistry.unregisterMenuAction(folderCommand, exports.FOLDER_SCOPE_MENU_PATH);
            this.commandRegistry.unregisterCommand(folderCommand);
        });
        this.foldersAsCommands.length = 0;
        folderWorkspaces.forEach(folderWorkspace => {
            const folderLabel = this.labelProvider.getName(folderWorkspace.resource);
            const iconClass = currentFolderURI === folderWorkspace.resource.toString() ? (0, browser_1.codicon)('pass') : '';
            const newFolderAsCommand = {
                id: `preferenceScopeCommand:${folderWorkspace.resource.toString()}`,
                label: folderLabel,
                iconClass: iconClass
            };
            this.foldersAsCommands.push(newFolderAsCommand);
            this.commandRegistry.registerCommand(newFolderAsCommand, {
                isVisible: (callback, check) => check === 'from-tabbar',
                isEnabled: (callback, check) => check === 'from-tabbar',
                execute: (callback) => {
                    callback({ scope: browser_1.PreferenceScope.Folder, uri: folderWorkspace.resource.toString(), activeScopeIsFolder: true });
                }
            });
            this.menuModelRegistry.registerMenuAction(exports.FOLDER_SCOPE_MENU_PATH, {
                commandId: newFolderAsCommand.id,
                label: newFolderAsCommand.label
            });
        });
    }
};
__decorate([
    (0, inversify_1.inject)(common_1.CommandRegistry),
    __metadata("design:type", common_1.CommandRegistry)
], PreferenceScopeCommandManager.prototype, "commandRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.MenuModelRegistry),
    __metadata("design:type", common_1.MenuModelRegistry)
], PreferenceScopeCommandManager.prototype, "menuModelRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.LabelProvider),
    __metadata("design:type", browser_1.LabelProvider)
], PreferenceScopeCommandManager.prototype, "labelProvider", void 0);
PreferenceScopeCommandManager = __decorate([
    (0, inversify_1.injectable)()
], PreferenceScopeCommandManager);
exports.PreferenceScopeCommandManager = PreferenceScopeCommandManager;
//# sourceMappingURL=preference-scope-command-manager.js.map