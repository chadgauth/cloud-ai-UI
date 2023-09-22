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
exports.NotebookMenus = exports.NotebookActionsContribution = exports.NotebookCommands = void 0;
const core_1 = require("@theia/core");
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/core/lib/browser");
const notebook_service_1 = require("../service/notebook-service");
const common_1 = require("../../common");
const notebook_kernel_quick_pick_service_1 = require("../service/notebook-kernel-quick-pick-service");
const notebook_execution_service_1 = require("../service/notebook-execution-service");
const notebook_editor_widget_1 = require("../notebook-editor-widget");
var NotebookCommands;
(function (NotebookCommands) {
    NotebookCommands.ADD_NEW_CELL_COMMAND = core_1.Command.toDefaultLocalizedCommand({
        id: 'notebook.add-new-cell',
        iconClass: (0, browser_1.codicon)('add')
    });
    NotebookCommands.ADD_NEW_MARKDOWN_CELL_COMMAND = core_1.Command.toDefaultLocalizedCommand({
        id: 'notebook.add-new-markdown-cell',
        iconClass: (0, browser_1.codicon)('add')
    });
    NotebookCommands.ADD_NEW_CODE_CELL_COMMAND = core_1.Command.toDefaultLocalizedCommand({
        id: 'notebook.add-new-code-cell',
        iconClass: (0, browser_1.codicon)('add')
    });
    NotebookCommands.SELECT_KERNEL_COMMAND = core_1.Command.toDefaultLocalizedCommand({
        id: 'notebook.selectKernel',
        category: 'Notebook',
        iconClass: (0, browser_1.codicon)('server-environment')
    });
    NotebookCommands.EXECUTE_NOTEBOOK_COMMAND = core_1.Command.toDefaultLocalizedCommand({
        id: 'notebook.execute',
        category: 'Notebook',
        iconClass: (0, browser_1.codicon)('run-all')
    });
    NotebookCommands.CLEAR_ALL_OUTPUTS_COMMAND = core_1.Command.toDefaultLocalizedCommand({
        id: 'notebook.clear-all-outputs',
        category: 'Notebook',
        iconClass: (0, browser_1.codicon)('clear-all')
    });
})(NotebookCommands = exports.NotebookCommands || (exports.NotebookCommands = {}));
let NotebookActionsContribution = class NotebookActionsContribution {
    registerCommands(commands) {
        commands.registerCommand(NotebookCommands.ADD_NEW_CELL_COMMAND, {
            execute: (notebookModel, cellKind, index) => {
                var _a;
                const insertIndex = index !== null && index !== void 0 ? index : (notebookModel.selectedCell ? notebookModel.cells.indexOf(notebookModel.selectedCell) : 0);
                let firstCodeCell;
                if (cellKind === common_1.CellKind.Code) {
                    firstCodeCell = notebookModel.cells.find(cell => cell.cellKind === common_1.CellKind.Code);
                }
                notebookModel.applyEdits([{
                        editType: 1 /* Replace */,
                        index: insertIndex,
                        count: 0,
                        cells: [{
                                cellKind,
                                language: (_a = firstCodeCell === null || firstCodeCell === void 0 ? void 0 : firstCodeCell.language) !== null && _a !== void 0 ? _a : 'markdown',
                                source: '',
                                outputs: [],
                                metadata: {},
                            }]
                    }], true);
            }
        });
        commands.registerCommand(NotebookCommands.ADD_NEW_MARKDOWN_CELL_COMMAND, {
            execute: (notebookModel) => commands.executeCommand(NotebookCommands.ADD_NEW_CELL_COMMAND.id, notebookModel, common_1.CellKind.Markup)
        });
        commands.registerCommand(NotebookCommands.ADD_NEW_CODE_CELL_COMMAND, {
            execute: (notebookModel) => commands.executeCommand(NotebookCommands.ADD_NEW_CELL_COMMAND.id, notebookModel, common_1.CellKind.Code)
        });
        commands.registerCommand(NotebookCommands.SELECT_KERNEL_COMMAND, {
            execute: (notebookModel) => this.notebookKernelQuickPickService.showQuickPick(notebookModel)
        });
        commands.registerCommand(NotebookCommands.EXECUTE_NOTEBOOK_COMMAND, {
            execute: (notebookModel) => this.notebookExecutionService.executeNotebookCells(notebookModel, notebookModel.cells)
        });
        commands.registerCommand(NotebookCommands.CLEAR_ALL_OUTPUTS_COMMAND, {
            execute: (notebookModel) => notebookModel.cells.forEach(cell => cell.spliceNotebookCellOutputs({ start: 0, deleteCount: cell.outputs.length, newOutputs: [] }))
        });
        commands.registerHandler(browser_1.CommonCommands.UNDO.id, {
            isEnabled: () => this.shell.activeWidget instanceof notebook_editor_widget_1.NotebookEditorWidget,
            execute: () => this.shell.activeWidget.undo()
        });
        commands.registerHandler(browser_1.CommonCommands.REDO.id, {
            isEnabled: () => this.shell.activeWidget instanceof notebook_editor_widget_1.NotebookEditorWidget,
            execute: () => this.shell.activeWidget.redo()
        });
    }
    registerMenus(menus) {
        // independent submenu for plugins to add commands
        menus.registerIndependentSubmenu(NotebookMenus.NOTEBOOK_MAIN_TOOLBAR, 'Notebook Main Toolbar');
        // Add Notebook Cell items
        menus.registerSubmenu(NotebookMenus.NOTEBOOK_MAIN_TOOLBAR_CELL_ADD_GROUP, 'Add Notebook Cell', { role: 1 /* Group */ });
        menus.registerMenuAction(NotebookMenus.NOTEBOOK_MAIN_TOOLBAR_CELL_ADD_GROUP, {
            commandId: NotebookCommands.ADD_NEW_CODE_CELL_COMMAND.id,
            label: core_1.nls.localizeByDefault('Code'),
            icon: (0, browser_1.codicon)('add'),
        });
        menus.registerMenuAction(NotebookMenus.NOTEBOOK_MAIN_TOOLBAR_CELL_ADD_GROUP, {
            commandId: NotebookCommands.ADD_NEW_MARKDOWN_CELL_COMMAND.id,
            label: core_1.nls.localizeByDefault('Markdown'),
            icon: (0, browser_1.codicon)('add'),
        });
        // Execution related items
        menus.registerSubmenu(NotebookMenus.NOTEBOOK_MAIN_TOOLBAR_EXECUTION_GROUP, 'Cell Execution', { role: 1 /* Group */ });
        menus.registerMenuAction(NotebookMenus.NOTEBOOK_MAIN_TOOLBAR_EXECUTION_GROUP, {
            commandId: NotebookCommands.EXECUTE_NOTEBOOK_COMMAND.id,
            label: core_1.nls.localizeByDefault('Run All'),
            icon: (0, browser_1.codicon)('run-all'),
            order: '10'
        });
        menus.registerMenuAction(NotebookMenus.NOTEBOOK_MAIN_TOOLBAR_EXECUTION_GROUP, {
            commandId: NotebookCommands.CLEAR_ALL_OUTPUTS_COMMAND.id,
            label: core_1.nls.localizeByDefault('Clear All Outputs'),
            icon: (0, browser_1.codicon)('clear-all'),
            order: '30'
        });
        // other items
    }
};
__decorate([
    (0, inversify_1.inject)(notebook_service_1.NotebookService),
    __metadata("design:type", notebook_service_1.NotebookService)
], NotebookActionsContribution.prototype, "notebookService", void 0);
__decorate([
    (0, inversify_1.inject)(notebook_kernel_quick_pick_service_1.NotebookKernelQuickPickService),
    __metadata("design:type", notebook_kernel_quick_pick_service_1.KernelPickerMRUStrategy)
], NotebookActionsContribution.prototype, "notebookKernelQuickPickService", void 0);
__decorate([
    (0, inversify_1.inject)(notebook_execution_service_1.NotebookExecutionService),
    __metadata("design:type", notebook_execution_service_1.NotebookExecutionService)
], NotebookActionsContribution.prototype, "notebookExecutionService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.ApplicationShell),
    __metadata("design:type", browser_1.ApplicationShell)
], NotebookActionsContribution.prototype, "shell", void 0);
NotebookActionsContribution = __decorate([
    (0, inversify_1.injectable)()
], NotebookActionsContribution);
exports.NotebookActionsContribution = NotebookActionsContribution;
var NotebookMenus;
(function (NotebookMenus) {
    NotebookMenus.NOTEBOOK_MAIN_TOOLBAR = 'notebook/toolbar';
    NotebookMenus.NOTEBOOK_MAIN_TOOLBAR_CELL_ADD_GROUP = [NotebookMenus.NOTEBOOK_MAIN_TOOLBAR, 'cell-add-group'];
    NotebookMenus.NOTEBOOK_MAIN_TOOLBAR_EXECUTION_GROUP = [NotebookMenus.NOTEBOOK_MAIN_TOOLBAR, 'cell-execution-group'];
})(NotebookMenus = exports.NotebookMenus || (exports.NotebookMenus = {}));
//# sourceMappingURL=notebook-actions-contribution.js.map