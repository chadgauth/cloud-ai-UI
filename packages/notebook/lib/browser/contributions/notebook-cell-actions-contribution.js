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
var NotebookCellActionContribution_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotebookCellActionContribution = exports.NotebookCellCommands = void 0;
const core_1 = require("@theia/core");
const browser_1 = require("@theia/core/lib/browser");
const inversify_1 = require("@theia/core/shared/inversify");
const notebook_context_keys_1 = require("./notebook-context-keys");
const context_key_service_1 = require("@theia/core/lib/browser/context-key-service");
const notebook_execution_service_1 = require("../service/notebook-execution-service");
var NotebookCellCommands;
(function (NotebookCellCommands) {
    NotebookCellCommands.EDIT_COMMAND = core_1.Command.toDefaultLocalizedCommand({
        id: 'notebook.cell.edit',
        iconClass: (0, browser_1.codicon)('edit')
    });
    NotebookCellCommands.STOP_EDIT_COMMAND = core_1.Command.toDefaultLocalizedCommand({
        id: 'notebook.cell.stop-edit',
        iconClass: (0, browser_1.codicon)('check')
    });
    NotebookCellCommands.DELETE_COMMAND = core_1.Command.toDefaultLocalizedCommand({
        id: 'notebook.cell.delete',
        iconClass: (0, browser_1.codicon)('trash')
    });
    NotebookCellCommands.SPLIT_CELL_COMMAND = core_1.Command.toDefaultLocalizedCommand({
        id: 'notebook.cell.split-cell',
        iconClass: (0, browser_1.codicon)('split-vertical'),
    });
    NotebookCellCommands.EXECUTE_SINGLE_CELL_COMMAND = core_1.Command.toDefaultLocalizedCommand({
        id: 'notebook.cell.execute-cell',
        iconClass: (0, browser_1.codicon)('play'),
    });
    NotebookCellCommands.STOP_CELL_EXECUTION_COMMAND = core_1.Command.toDefaultLocalizedCommand({
        id: 'notebook.cell.stop-cell-execution',
        iconClass: (0, browser_1.codicon)('stop'),
    });
    NotebookCellCommands.CLEAR_OUTPUTS_COMMAND = core_1.Command.toDefaultLocalizedCommand({
        id: 'notebook.cell.clear-outputs',
        label: 'Clear Cell Outputs',
    });
    NotebookCellCommands.CHANGE_OUTPUT_PRESENTATION_COMMAND = core_1.Command.toDefaultLocalizedCommand({
        id: 'notebook.cell.change-presentation',
        label: 'Change Presentation',
    });
})(NotebookCellCommands = exports.NotebookCellCommands || (exports.NotebookCellCommands = {}));
let NotebookCellActionContribution = NotebookCellActionContribution_1 = class NotebookCellActionContribution {
    init() {
        notebook_context_keys_1.NotebookContextKeys.initNotebookContextKeys(this.contextKeyService);
    }
    registerMenus(menus) {
        menus.registerMenuAction(NotebookCellActionContribution_1.ACTION_MENU, {
            commandId: NotebookCellCommands.EDIT_COMMAND.id,
            icon: NotebookCellCommands.EDIT_COMMAND.iconClass,
            when: `${notebook_context_keys_1.NOTEBOOK_CELL_TYPE} == 'markdown' && !${notebook_context_keys_1.NOTEBOOK_CELL_MARKDOWN_EDIT_MODE}`,
            label: core_1.nls.localizeByDefault('Edit Cell'),
            order: '10'
        });
        menus.registerMenuAction(NotebookCellActionContribution_1.ACTION_MENU, {
            commandId: NotebookCellCommands.STOP_EDIT_COMMAND.id,
            icon: NotebookCellCommands.STOP_EDIT_COMMAND.iconClass,
            when: `${notebook_context_keys_1.NOTEBOOK_CELL_TYPE} == 'markdown' && ${notebook_context_keys_1.NOTEBOOK_CELL_MARKDOWN_EDIT_MODE}`,
            label: core_1.nls.localizeByDefault('Stop Editing Cell'),
            order: '10'
        });
        menus.registerMenuAction(NotebookCellActionContribution_1.ACTION_MENU, {
            commandId: NotebookCellCommands.EXECUTE_SINGLE_CELL_COMMAND.id,
            icon: NotebookCellCommands.EXECUTE_SINGLE_CELL_COMMAND.iconClass,
            when: `${notebook_context_keys_1.NOTEBOOK_CELL_TYPE} == 'code'`,
            label: core_1.nls.localizeByDefault('Execute Cell'),
            order: '10'
        });
        menus.registerMenuAction(NotebookCellActionContribution_1.ACTION_MENU, {
            commandId: NotebookCellCommands.SPLIT_CELL_COMMAND.id,
            icon: NotebookCellCommands.SPLIT_CELL_COMMAND.iconClass,
            label: core_1.nls.localizeByDefault('Split Cell'),
            order: '20'
        });
        menus.registerMenuAction(NotebookCellActionContribution_1.ACTION_MENU, {
            commandId: NotebookCellCommands.DELETE_COMMAND.id,
            icon: NotebookCellCommands.DELETE_COMMAND.iconClass,
            label: core_1.nls.localizeByDefault('Delete Cell'),
            order: '999'
        });
        menus.registerSubmenu(NotebookCellActionContribution_1.ADDITIONAL_ACTION_MENU, core_1.nls.localizeByDefault('More'), {
            icon: (0, browser_1.codicon)('ellipsis'),
            role: 0 /* Submenu */,
            order: '30'
        });
        menus.registerIndependentSubmenu(NotebookCellActionContribution_1.CONTRIBUTED_CELL_ACTION_MENU, '', { role: 2 /* Flat */ });
        // since contributions are adding to an independent submenu we have to manually add it to the more submenu
        menus.getMenu(NotebookCellActionContribution_1.ADDITIONAL_ACTION_MENU).addNode(menus.getMenuNode(NotebookCellActionContribution_1.CONTRIBUTED_CELL_ACTION_MENU));
        // code cell sidebar menu
        menus.registerMenuAction(NotebookCellActionContribution_1.CODE_CELL_SIDEBAR_MENU, {
            commandId: NotebookCellCommands.EXECUTE_SINGLE_CELL_COMMAND.id,
            icon: NotebookCellCommands.EXECUTE_SINGLE_CELL_COMMAND.iconClass,
            label: core_1.nls.localizeByDefault('Execute Cell'),
            when: `!${notebook_context_keys_1.NOTEBOOK_CELL_EXECUTING}`
        });
        menus.registerMenuAction(NotebookCellActionContribution_1.CODE_CELL_SIDEBAR_MENU, {
            commandId: NotebookCellCommands.STOP_CELL_EXECUTION_COMMAND.id,
            icon: NotebookCellCommands.STOP_CELL_EXECUTION_COMMAND.iconClass,
            label: core_1.nls.localizeByDefault('Stop Cell Execution'),
            when: notebook_context_keys_1.NOTEBOOK_CELL_EXECUTING
        });
        // Notebook Cell extra execution options
        menus.registerIndependentSubmenu(NotebookCellActionContribution_1.CONTRIBUTED_CELL_EXECUTION_MENU, core_1.nls.localizeByDefault('More...'), { role: 2 /* Flat */, icon: (0, browser_1.codicon)('chevron-down') });
        menus.getMenu(NotebookCellActionContribution_1.CODE_CELL_SIDEBAR_MENU).addNode(menus.getMenuNode(NotebookCellActionContribution_1.CONTRIBUTED_CELL_EXECUTION_MENU));
        // code cell output sidebar menu
        menus.registerSubmenu(NotebookCellActionContribution_1.ADDITIONAL_OUTPUT_SIDEBAR_MENU, core_1.nls.localizeByDefault('More'), {
            icon: (0, browser_1.codicon)('ellipsis'),
            role: 0 /* Submenu */
        });
        menus.registerMenuAction(NotebookCellActionContribution_1.ADDITIONAL_OUTPUT_SIDEBAR_MENU, {
            commandId: NotebookCellCommands.CLEAR_OUTPUTS_COMMAND.id,
            label: core_1.nls.localizeByDefault('Clear Cell Outputs'),
        });
        menus.registerMenuAction(NotebookCellActionContribution_1.ADDITIONAL_OUTPUT_SIDEBAR_MENU, {
            commandId: NotebookCellCommands.CHANGE_OUTPUT_PRESENTATION_COMMAND.id,
            label: core_1.nls.localizeByDefault('Change Presentation'),
        });
    }
    registerCommands(commands) {
        commands.registerCommand(NotebookCellCommands.EDIT_COMMAND, { execute: (_, cell) => cell.requestEdit() });
        commands.registerCommand(NotebookCellCommands.STOP_EDIT_COMMAND, { execute: (_, cell) => cell.requestStopEdit() });
        commands.registerCommand(NotebookCellCommands.DELETE_COMMAND, {
            execute: (notebookModel, cell) => notebookModel.applyEdits([{
                    editType: 1 /* Replace */,
                    index: notebookModel.cells.indexOf(cell),
                    count: 1,
                    cells: []
                }], true)
        });
        commands.registerCommand(NotebookCellCommands.SPLIT_CELL_COMMAND);
        commands.registerCommand(NotebookCellCommands.EXECUTE_SINGLE_CELL_COMMAND, {
            execute: (notebookModel, cell) => this.notebookExecutionService.executeNotebookCells(notebookModel, [cell])
        });
        commands.registerCommand(NotebookCellCommands.STOP_CELL_EXECUTION_COMMAND, {
            execute: (notebookModel, cell) => this.notebookExecutionService.cancelNotebookCells(notebookModel, [cell])
        });
        commands.registerCommand(NotebookCellCommands.CLEAR_OUTPUTS_COMMAND, {
            execute: (notebookModel, cell) => cell.spliceNotebookCellOutputs({ start: 0, deleteCount: cell.outputs.length, newOutputs: [] })
        });
        commands.registerCommand(NotebookCellCommands.CHANGE_OUTPUT_PRESENTATION_COMMAND, {
            execute: (_, __, output) => output.requestOutputPresentationUpdate()
        });
    }
};
__decorate([
    (0, inversify_1.inject)(context_key_service_1.ContextKeyService),
    __metadata("design:type", Object)
], NotebookCellActionContribution.prototype, "contextKeyService", void 0);
__decorate([
    (0, inversify_1.inject)(notebook_execution_service_1.NotebookExecutionService),
    __metadata("design:type", notebook_execution_service_1.NotebookExecutionService)
], NotebookCellActionContribution.prototype, "notebookExecutionService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NotebookCellActionContribution.prototype, "init", null);
NotebookCellActionContribution = NotebookCellActionContribution_1 = __decorate([
    (0, inversify_1.injectable)()
], NotebookCellActionContribution);
exports.NotebookCellActionContribution = NotebookCellActionContribution;
(function (NotebookCellActionContribution) {
    NotebookCellActionContribution.ACTION_MENU = ['notebook-cell-actions-menu'];
    NotebookCellActionContribution.ADDITIONAL_ACTION_MENU = [...NotebookCellActionContribution.ACTION_MENU, 'more'];
    NotebookCellActionContribution.CONTRIBUTED_CELL_ACTION_MENU = 'notebook/cell/title';
    NotebookCellActionContribution.CONTRIBUTED_CELL_EXECUTION_MENU = 'notebook/cell/execute';
    NotebookCellActionContribution.CODE_CELL_SIDEBAR_MENU = ['code-cell-sidebar-menu'];
    NotebookCellActionContribution.OUTPUT_SIDEBAR_MENU = ['code-cell-output-sidebar-menu'];
    NotebookCellActionContribution.ADDITIONAL_OUTPUT_SIDEBAR_MENU = [...NotebookCellActionContribution.OUTPUT_SIDEBAR_MENU, 'more'];
})(NotebookCellActionContribution = exports.NotebookCellActionContribution || (exports.NotebookCellActionContribution = {}));
exports.NotebookCellActionContribution = NotebookCellActionContribution;
//# sourceMappingURL=notebook-cell-actions-contribution.js.map