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
exports.ToolbarCommandQuickInputService = void 0;
const core_1 = require("@theia/core");
const browser_1 = require("@theia/core/lib/browser");
const inversify_1 = require("@theia/core/shared/inversify");
const toolbar_icon_selector_dialog_1 = require("./toolbar-icon-selector-dialog");
const toolbar_interfaces_1 = require("./toolbar-interfaces");
const toolbar_controller_1 = require("./toolbar-controller");
let ToolbarCommandQuickInputService = class ToolbarCommandQuickInputService {
    constructor() {
        this.quickPickItems = [];
        this.columnQuickPickItems = [
            {
                label: core_1.nls.localize('theia/toolbar/leftColumn', 'Left Column'),
                id: toolbar_interfaces_1.ToolbarAlignment.LEFT,
            },
            {
                label: core_1.nls.localize('theia/toolbar/centerColumn', 'Center Column'),
                id: toolbar_interfaces_1.ToolbarAlignment.CENTER,
            },
            {
                label: core_1.nls.localize('theia/toolbar/rightColumn', 'Right Column'),
                id: toolbar_interfaces_1.ToolbarAlignment.RIGHT
            },
        ];
    }
    openIconDialog() {
        this.quickPickItems = this.generateCommandsList();
        this.quickInputService.showQuickPick(this.quickPickItems, {
            placeholder: core_1.nls.localize('theia/toolbar/addCommandPlaceholder', 'Find a command to add to the toolbar'),
        });
    }
    openColumnQP() {
        return this.quickInputService.showQuickPick(this.columnQuickPickItems, {
            placeholder: core_1.nls.localize('theia/toolbar/toolbarLocationPlaceholder', 'Where would you like the command added?')
        });
    }
    generateCommandsList() {
        const { recent, other } = this.quickCommandService.getCommands();
        return [...recent, ...other].map(command => {
            const formattedItem = this.quickCommandService.toItem(command);
            return {
                ...formattedItem,
                alwaysShow: true,
                execute: async () => {
                    var _a;
                    const iconDialog = this.iconDialogFactory(command);
                    const iconClass = await iconDialog.open();
                    if (iconClass) {
                        const { id } = (_a = await this.openColumnQP()) !== null && _a !== void 0 ? _a : {};
                        if (toolbar_interfaces_1.ToolbarAlignmentString.is(id)) {
                            this.model.addItem({ ...command, iconClass }, id);
                        }
                    }
                },
            };
        });
    }
};
__decorate([
    (0, inversify_1.inject)(core_1.CommandService),
    __metadata("design:type", Object)
], ToolbarCommandQuickInputService.prototype, "commandService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.QuickInputService),
    __metadata("design:type", Object)
], ToolbarCommandQuickInputService.prototype, "quickInputService", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.CommandRegistry),
    __metadata("design:type", core_1.CommandRegistry)
], ToolbarCommandQuickInputService.prototype, "commandRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.QuickCommandService),
    __metadata("design:type", browser_1.QuickCommandService)
], ToolbarCommandQuickInputService.prototype, "quickCommandService", void 0);
__decorate([
    (0, inversify_1.inject)(toolbar_controller_1.ToolbarController),
    __metadata("design:type", toolbar_controller_1.ToolbarController)
], ToolbarCommandQuickInputService.prototype, "model", void 0);
__decorate([
    (0, inversify_1.inject)(toolbar_icon_selector_dialog_1.ToolbarIconDialogFactory),
    __metadata("design:type", Function)
], ToolbarCommandQuickInputService.prototype, "iconDialogFactory", void 0);
ToolbarCommandQuickInputService = __decorate([
    (0, inversify_1.injectable)()
], ToolbarCommandQuickInputService);
exports.ToolbarCommandQuickInputService = ToolbarCommandQuickInputService;
//# sourceMappingURL=toolbar-command-quick-input-service.js.map