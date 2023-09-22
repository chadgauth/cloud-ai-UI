"use strict";
// *****************************************************************************
// Copyright (C) 2021 EclipseSource and others.
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
exports.ElectronNavigatorMenuContribution = exports.OPEN_CONTAINING_FOLDER = void 0;
const core_1 = require("@theia/core");
const browser_1 = require("@theia/core/lib/browser");
const widget_manager_1 = require("@theia/core/lib/browser/widget-manager");
const inversify_1 = require("@theia/core/shared/inversify");
const browser_2 = require("@theia/filesystem/lib/browser");
const browser_3 = require("../browser");
const navigator_contribution_1 = require("../browser/navigator-contribution");
const os_1 = require("@theia/core/lib/common/os");
const browser_4 = require("@theia/workspace/lib/browser");
const uri_command_handler_1 = require("@theia/core/lib/common/uri-command-handler");
require("@theia/core/lib/electron-common/electron-api");
exports.OPEN_CONTAINING_FOLDER = core_1.Command.toDefaultLocalizedCommand({
    id: 'revealFileInOS',
    category: browser_1.CommonCommands.FILE_CATEGORY,
    label: os_1.isWindows ? 'Reveal in File Explorer' :
        os_1.isOSX ? 'Reveal in Finder' :
            /* linux */ 'Open Containing Folder'
});
let ElectronNavigatorMenuContribution = class ElectronNavigatorMenuContribution {
    registerCommands(commands) {
        commands.registerCommand(exports.OPEN_CONTAINING_FOLDER, uri_command_handler_1.UriAwareCommandHandler.MonoSelect(this.selectionService, {
            execute: async (uri) => {
                window.electronTheiaCore.showItemInFolder(uri['codeUri'].fsPath);
            },
            isEnabled: uri => !!this.workspaceService.getWorkspaceRootUri(uri),
            isVisible: uri => !!this.workspaceService.getWorkspaceRootUri(uri),
        }));
    }
    registerMenus(menus) {
        menus.registerMenuAction(navigator_contribution_1.NavigatorContextMenu.NAVIGATION, {
            commandId: exports.OPEN_CONTAINING_FOLDER.id,
            label: exports.OPEN_CONTAINING_FOLDER.label
        });
        menus.registerMenuAction(navigator_contribution_1.SHELL_TABBAR_CONTEXT_REVEAL, {
            commandId: exports.OPEN_CONTAINING_FOLDER.id,
            label: exports.OPEN_CONTAINING_FOLDER.label,
            order: '4'
        });
    }
    registerKeybindings(keybindings) {
        keybindings.registerKeybinding({
            command: exports.OPEN_CONTAINING_FOLDER.id,
            keybinding: 'ctrlcmd+alt+p',
            when: 'filesExplorerFocus'
        });
    }
    getSelectedFileStatNodes() {
        const navigator = this.tryGetNavigatorWidget();
        return navigator ? navigator.model.selectedNodes.filter(browser_2.FileStatNode.is) : [];
    }
    tryGetNavigatorWidget() {
        return this.widgetManager.tryGetWidget(browser_3.FILE_NAVIGATOR_ID);
    }
};
__decorate([
    (0, inversify_1.inject)(core_1.SelectionService),
    __metadata("design:type", core_1.SelectionService)
], ElectronNavigatorMenuContribution.prototype, "selectionService", void 0);
__decorate([
    (0, inversify_1.inject)(widget_manager_1.WidgetManager),
    __metadata("design:type", widget_manager_1.WidgetManager)
], ElectronNavigatorMenuContribution.prototype, "widgetManager", void 0);
__decorate([
    (0, inversify_1.inject)(browser_4.WorkspaceService),
    __metadata("design:type", browser_4.WorkspaceService)
], ElectronNavigatorMenuContribution.prototype, "workspaceService", void 0);
ElectronNavigatorMenuContribution = __decorate([
    (0, inversify_1.injectable)()
], ElectronNavigatorMenuContribution);
exports.ElectronNavigatorMenuContribution = ElectronNavigatorMenuContribution;
//# sourceMappingURL=electron-navigator-menu-contribution.js.map