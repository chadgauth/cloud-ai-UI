"use strict";
// *****************************************************************************
// Copyright (C) 2023 TypeFox and others.
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
exports.NotebookCellToolbarFactory = void 0;
const React = require("@theia/core/shared/react");
const core_1 = require("@theia/core");
const inversify_1 = require("@theia/core/shared/inversify");
const context_key_service_1 = require("@theia/core/lib/browser/context-key-service");
const notebook_cell_toolbar_1 = require("./notebook-cell-toolbar");
const browser_1 = require("@theia/core/lib/browser");
let NotebookCellToolbarFactory = class NotebookCellToolbarFactory {
    renderCellToolbar(menuPath, notebookModel, cell) {
        return React.createElement(notebook_cell_toolbar_1.NotebookCellToolbar, { getMenuItems: () => this.getMenuItems(menuPath, notebookModel, cell), onContextKeysChanged: cell.notebookCellContextManager.onDidChangeContext });
    }
    renderSidebar(menuPath, notebookModel, cell, output) {
        return React.createElement(notebook_cell_toolbar_1.NotebookCellSidebar, { getMenuItems: () => this.getMenuItems(menuPath, notebookModel, cell, output), onContextKeysChanged: cell.notebookCellContextManager.onDidChangeContext });
    }
    getMenuItems(menuItemPath, notebookModel, cell, output) {
        var _a, _b, _c;
        const inlineItems = [];
        for (const menuNode of this.menuRegistry.getMenu(menuItemPath).children) {
            if (!menuNode.when || this.contextKeyService.match(menuNode.when, (_a = cell.context) !== null && _a !== void 0 ? _a : undefined)) {
                if (menuNode.role === 2 /* Flat */) {
                    inlineItems.push(...(_c = (_b = menuNode.children) === null || _b === void 0 ? void 0 : _b.map(child => this.createToolbarItem(child, notebookModel, cell, output))) !== null && _c !== void 0 ? _c : []);
                }
                else {
                    inlineItems.push(this.createToolbarItem(menuNode, notebookModel, cell, output));
                }
            }
        }
        return inlineItems;
    }
    createToolbarItem(menuNode, notebookModel, cell, output) {
        const menuPath = menuNode.role === 0 /* Submenu */ ? this.menuRegistry.getPath(menuNode) : undefined;
        return {
            id: menuNode.id,
            icon: menuNode.icon,
            label: menuNode.label,
            onClick: menuPath ?
                e => this.contextMenuRenderer.render({
                    anchor: e.nativeEvent,
                    menuPath,
                    includeAnchorArg: false,
                    args: [notebookModel, cell, output]
                }) :
                () => this.commandRegistry.executeCommand(menuNode.command, notebookModel, cell, output)
        };
    }
};
__decorate([
    (0, inversify_1.inject)(core_1.MenuModelRegistry),
    __metadata("design:type", core_1.MenuModelRegistry)
], NotebookCellToolbarFactory.prototype, "menuRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(context_key_service_1.ContextKeyService),
    __metadata("design:type", Object)
], NotebookCellToolbarFactory.prototype, "contextKeyService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.ContextMenuRenderer),
    __metadata("design:type", browser_1.ContextMenuRenderer)
], NotebookCellToolbarFactory.prototype, "contextMenuRenderer", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.CommandRegistry),
    __metadata("design:type", core_1.CommandRegistry)
], NotebookCellToolbarFactory.prototype, "commandRegistry", void 0);
NotebookCellToolbarFactory = __decorate([
    (0, inversify_1.injectable)()
], NotebookCellToolbarFactory);
exports.NotebookCellToolbarFactory = NotebookCellToolbarFactory;
//# sourceMappingURL=notebook-cell-toolbar-factory.js.map