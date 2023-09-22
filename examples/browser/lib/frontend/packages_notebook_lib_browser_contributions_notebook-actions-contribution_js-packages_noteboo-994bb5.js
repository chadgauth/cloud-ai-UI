"use strict";
(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_notebook_lib_browser_contributions_notebook-actions-contribution_js-packages_noteboo-994bb5"],{

/***/ "../../packages/monaco/lib/browser/monaco-code-editor.js":
/*!***************************************************************!*\
  !*** ../../packages/monaco/lib/browser/monaco-code-editor.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MonacoCodeEditor = void 0;
const monaco_editor_1 = __webpack_require__(/*! ./monaco-editor */ "../../packages/monaco/lib/browser/monaco-editor.js");
const codeEditorWidget_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/browser/widget/codeEditorWidget */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/browser/widget/codeEditorWidget.js");
const standaloneServices_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices.js");
const serviceCollection_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/platform/instantiation/common/serviceCollection */ "../../node_modules/@theia/monaco-editor-core/esm/vs/platform/instantiation/common/serviceCollection.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const monaco = __webpack_require__(/*! @theia/monaco-editor-core */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/editor.main.js");
const domutils_1 = __webpack_require__(/*! @theia/core/shared/@phosphor/domutils */ "../../packages/core/shared/@phosphor/domutils/index.js");
class MonacoCodeEditor extends monaco_editor_1.MonacoEditorServices {
    constructor(uri, document, node, services, options, override) {
        super(services);
        this.uri = uri;
        this.document = document;
        this.node = node;
        this.toDispose = new core_1.DisposableCollection();
        this.onCursorPositionChangedEmitter = new core_1.Emitter();
        this.onSelectionChangedEmitter = new core_1.Emitter();
        this.onFocusChangedEmitter = new core_1.Emitter();
        this.onDocumentContentChangedEmitter = new core_1.Emitter();
        this.onDocumentContentChanged = this.onDocumentContentChangedEmitter.event;
        this.onMouseDownEmitter = new core_1.Emitter();
        this.onLanguageChangedEmitter = new core_1.Emitter();
        this.onLanguageChanged = this.onLanguageChangedEmitter.event;
        this.onScrollChangedEmitter = new core_1.Emitter();
        this.onEncodingChanged = this.document.onDidChangeEncoding;
        this.onResizeEmitter = new core_1.Emitter();
        this.onDidResize = this.onResizeEmitter.event;
        this.toDispose.pushAll([
            this.onCursorPositionChangedEmitter,
            this.onSelectionChangedEmitter,
            this.onFocusChangedEmitter,
            this.onDocumentContentChangedEmitter,
            this.onMouseDownEmitter,
            this.onLanguageChangedEmitter,
            this.onScrollChangedEmitter
        ]);
        this.toDispose.push(this.create(options, override));
        this.addHandlers(this.editor);
        this.editor.setModel(document.textEditorModel);
    }
    getControl() {
        return this.editor;
    }
    create(options, override) {
        const combinedOptions = {
            ...options,
            lightbulb: { enabled: true },
            fixedOverflowWidgets: true,
            automaticLayout: true,
            scrollbar: {
                useShadows: false,
                verticalHasArrows: false,
                horizontalHasArrows: false,
                verticalScrollbarSize: 10,
                horizontalScrollbarSize: 10,
                ...options === null || options === void 0 ? void 0 : options.scrollbar,
            }
        };
        const instantiator = this.getInstantiatorWithOverrides(override);
        return this.editor = instantiator.createInstance(codeEditorWidget_1.CodeEditorWidget, this.node, {
            ...combinedOptions,
            dimension: {
                width: 0,
                height: 0
            },
        }, {});
    }
    addHandlers(codeEditor) {
        this.toDispose.push(codeEditor.onDidChangeModelLanguage(e => this.fireLanguageChanged(e.newLanguage)));
        this.toDispose.push(codeEditor.onDidChangeConfiguration(() => this.refresh()));
        this.toDispose.push(codeEditor.onDidChangeModel(() => this.refresh()));
        this.toDispose.push(codeEditor.onDidChangeModelContent(e => {
            this.refresh();
            this.onDocumentContentChangedEmitter.fire({ document: this.document, contentChanges: e.changes.map(this.mapModelContentChange.bind(this)) });
        }));
        this.toDispose.push(codeEditor.onMouseDown(e => {
            const { element, position, range } = e.target;
            this.onMouseDownEmitter.fire({
                target: {
                    ...e.target,
                    element: element || undefined,
                    mouseColumn: this.m2p.asPosition(undefined, e.target.mouseColumn).character,
                    range: range && this.m2p.asRange(range) || undefined,
                    position: position && this.m2p.asPosition(position.lineNumber, position.column) || undefined,
                    detail: undefined
                },
                event: e.event.browserEvent
            });
        }));
        this.toDispose.push(codeEditor.onDidScrollChange(e => {
            this.onScrollChangedEmitter.fire(undefined);
        }));
    }
    setLanguage(languageId) {
        monaco.editor.setModelLanguage(this.document.textEditorModel, languageId);
    }
    fireLanguageChanged(languageId) {
        this.onLanguageChangedEmitter.fire(languageId);
    }
    getInstantiatorWithOverrides(override) {
        const instantiator = standaloneServices_1.StandaloneServices.initialize({});
        if (override) {
            const overrideServices = new serviceCollection_1.ServiceCollection(...override);
            return instantiator.createChild(overrideServices);
        }
        return instantiator;
    }
    mapModelContentChange(change) {
        return {
            range: this.m2p.asRange(change.range),
            rangeLength: change.rangeLength,
            text: change.text
        };
    }
    refresh() {
        this.autoresize();
    }
    resizeToFit() {
        this.autoresize();
        // eslint-disable-next-line no-null/no-null
        this.onResizeEmitter.fire(null);
    }
    setSize(dimension) {
        this.resize(dimension);
        this.onResizeEmitter.fire(dimension);
    }
    autoresize() {
        this.resize();
    }
    resize(dimension) {
        if (this.node) {
            const layoutSize = this.computeLayoutSize(this.node, dimension);
            this.editor.layout(layoutSize);
        }
    }
    computeLayoutSize(hostNode, dimension) {
        if (dimension && dimension.width >= 0 && dimension.height >= 0) {
            return dimension;
        }
        const boxSizing = domutils_1.ElementExt.boxSizing(hostNode);
        const width = (!dimension || dimension.width < 0) ?
            this.getWidth(hostNode, boxSizing) :
            dimension.width;
        const height = (!dimension || dimension.height < 0) ?
            this.getHeight(hostNode, boxSizing) :
            dimension.height;
        return { width, height };
    }
    getWidth(hostNode, boxSizing) {
        return hostNode.offsetWidth - boxSizing.horizontalSum;
    }
    getHeight(hostNode, boxSizing) {
        return this.editor.getContentHeight();
    }
    dispose() {
        this.toDispose.dispose();
    }
}
exports.MonacoCodeEditor = MonacoCodeEditor;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/monaco/lib/browser/monaco-code-editor'] = this;


/***/ }),

/***/ "../../packages/notebook/lib/browser/contributions/notebook-actions-contribution.js":
/*!******************************************************************************************!*\
  !*** ../../packages/notebook/lib/browser/contributions/notebook-actions-contribution.js ***!
  \******************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotebookMenus = exports.NotebookActionsContribution = exports.NotebookCommands = void 0;
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const notebook_service_1 = __webpack_require__(/*! ../service/notebook-service */ "../../packages/notebook/lib/browser/service/notebook-service.js");
const common_1 = __webpack_require__(/*! ../../common */ "../../packages/notebook/lib/common/index.js");
const notebook_kernel_quick_pick_service_1 = __webpack_require__(/*! ../service/notebook-kernel-quick-pick-service */ "../../packages/notebook/lib/browser/service/notebook-kernel-quick-pick-service.js");
const notebook_execution_service_1 = __webpack_require__(/*! ../service/notebook-execution-service */ "../../packages/notebook/lib/browser/service/notebook-execution-service.js");
const notebook_editor_widget_1 = __webpack_require__(/*! ../notebook-editor-widget */ "../../packages/notebook/lib/browser/notebook-editor-widget.js");
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

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/notebook/lib/browser/contributions/notebook-actions-contribution'] = this;


/***/ }),

/***/ "../../packages/notebook/lib/browser/contributions/notebook-cell-actions-contribution.js":
/*!***********************************************************************************************!*\
  !*** ../../packages/notebook/lib/browser/contributions/notebook-cell-actions-contribution.js ***!
  \***********************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotebookCellActionContribution = exports.NotebookCellCommands = void 0;
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const notebook_context_keys_1 = __webpack_require__(/*! ./notebook-context-keys */ "../../packages/notebook/lib/browser/contributions/notebook-context-keys.js");
const context_key_service_1 = __webpack_require__(/*! @theia/core/lib/browser/context-key-service */ "../../packages/core/lib/browser/context-key-service.js");
const notebook_execution_service_1 = __webpack_require__(/*! ../service/notebook-execution-service */ "../../packages/notebook/lib/browser/service/notebook-execution-service.js");
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

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/notebook/lib/browser/contributions/notebook-cell-actions-contribution'] = this;


/***/ }),

/***/ "../../packages/notebook/lib/browser/contributions/notebook-context-keys.js":
/*!**********************************************************************************!*\
  !*** ../../packages/notebook/lib/browser/contributions/notebook-context-keys.js ***!
  \**********************************************************************************/
/***/ (function(__unused_webpack_module, exports) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotebookContextKeys = exports.NOTEBOOK_HAS_OUTPUTS = exports.NOTEBOOK_MISSING_KERNEL_EXTENSION = exports.NOTEBOOK_INTERRUPTIBLE_KERNEL = exports.NOTEBOOK_KERNEL_SELECTED = exports.NOTEBOOK_KERNEL_SOURCE_COUNT = exports.NOTEBOOK_KERNEL_COUNT = exports.NOTEBOOK_KERNEL = exports.NOTEBOOK_CELL_RESOURCE = exports.NOTEBOOK_CELL_OUTPUT_COLLAPSED = exports.NOTEBOOK_CELL_INPUT_COLLAPSED = exports.NOTEBOOK_CELL_HAS_OUTPUTS = exports.NOTEBOOK_CELL_EXECUTING = exports.NOTEBOOK_CELL_EXECUTION_STATE = exports.NOTEBOOK_CELL_LINE_NUMBERS = exports.NOTEBOOK_CELL_MARKDOWN_EDIT_MODE = exports.NOTEBOOK_CELL_EDITOR_FOCUSED = exports.NOTEBOOK_CELL_FOCUSED = exports.NOTEBOOK_CELL_EDITABLE = exports.NOTEBOOK_CELL_TYPE = exports.NOTEBOOK_VIEW_TYPE = exports.NOTEBOOK_LAST_CELL_FAILED = exports.NOTEBOOK_CURSOR_NAVIGATION_MODE = exports.NOTEBOOK_CELL_TOOLBAR_LOCATION = exports.NOTEBOOK_BREAKPOINT_MARGIN_ACTIVE = exports.NOTEBOOK_USE_CONSOLIDATED_OUTPUT_BUTTON = exports.NOTEBOOK_HAS_RUNNING_CELL = exports.NOTEBOOK_EDITOR_EDITABLE = exports.NOTEBOOK_OUTPUT_FOCUSED = exports.NOTEBOOK_CELL_LIST_FOCUSED = exports.NOTEBOOK_EDITOR_FOCUSED = exports.KEYBINDING_CONTEXT_NOTEBOOK_FIND_WIDGET_FOCUSED = exports.HAS_OPENED_NOTEBOOK = void 0;
exports.HAS_OPENED_NOTEBOOK = 'userHasOpenedNotebook';
exports.KEYBINDING_CONTEXT_NOTEBOOK_FIND_WIDGET_FOCUSED = 'notebookFindWidgetFocused';
exports.NOTEBOOK_EDITOR_FOCUSED = 'notebookEditorFocused';
exports.NOTEBOOK_CELL_LIST_FOCUSED = 'notebookCellListFocused';
exports.NOTEBOOK_OUTPUT_FOCUSED = 'notebookOutputFocused';
exports.NOTEBOOK_EDITOR_EDITABLE = 'notebookEditable';
exports.NOTEBOOK_HAS_RUNNING_CELL = 'notebookHasRunningCell';
exports.NOTEBOOK_USE_CONSOLIDATED_OUTPUT_BUTTON = 'notebookUseConsolidatedOutputButton';
exports.NOTEBOOK_BREAKPOINT_MARGIN_ACTIVE = 'notebookBreakpointMargin';
exports.NOTEBOOK_CELL_TOOLBAR_LOCATION = 'notebookCellToolbarLocation';
exports.NOTEBOOK_CURSOR_NAVIGATION_MODE = 'notebookCursorNavigationMode';
exports.NOTEBOOK_LAST_CELL_FAILED = 'notebookLastCellFailed';
exports.NOTEBOOK_VIEW_TYPE = 'notebookType';
exports.NOTEBOOK_CELL_TYPE = 'notebookCellType';
exports.NOTEBOOK_CELL_EDITABLE = 'notebookCellEditable';
exports.NOTEBOOK_CELL_FOCUSED = 'notebookCellFocused';
exports.NOTEBOOK_CELL_EDITOR_FOCUSED = 'notebookCellEditorFocused';
exports.NOTEBOOK_CELL_MARKDOWN_EDIT_MODE = 'notebookCellMarkdownEditMode';
exports.NOTEBOOK_CELL_LINE_NUMBERS = 'notebookCellLineNumbers';
exports.NOTEBOOK_CELL_EXECUTION_STATE = 'notebookCellExecutionState';
exports.NOTEBOOK_CELL_EXECUTING = 'notebookCellExecuting';
exports.NOTEBOOK_CELL_HAS_OUTPUTS = 'notebookCellHasOutputs';
exports.NOTEBOOK_CELL_INPUT_COLLAPSED = 'notebookCellInputIsCollapsed';
exports.NOTEBOOK_CELL_OUTPUT_COLLAPSED = 'notebookCellOutputIsCollapsed';
exports.NOTEBOOK_CELL_RESOURCE = 'notebookCellResource';
exports.NOTEBOOK_KERNEL = 'notebookKernel';
exports.NOTEBOOK_KERNEL_COUNT = 'notebookKernelCount';
exports.NOTEBOOK_KERNEL_SOURCE_COUNT = 'notebookKernelSourceCount';
exports.NOTEBOOK_KERNEL_SELECTED = 'notebookKernelSelected';
exports.NOTEBOOK_INTERRUPTIBLE_KERNEL = 'notebookInterruptibleKernel';
exports.NOTEBOOK_MISSING_KERNEL_EXTENSION = 'notebookMissingKernelExtension';
exports.NOTEBOOK_HAS_OUTPUTS = 'notebookHasOutputs';
var NotebookContextKeys;
(function (NotebookContextKeys) {
    function initNotebookContextKeys(service) {
        service.createKey(exports.HAS_OPENED_NOTEBOOK, false);
        service.createKey(exports.KEYBINDING_CONTEXT_NOTEBOOK_FIND_WIDGET_FOCUSED, false);
        // // Is Notebook
        // export const NOTEBOOK_IS_ACTIVE_EDITOR = ContextKeyExpr.equals('activeEditor', NOTEBOOK_EDITOR_ID);
        // export const INTERACTIVE_WINDOW_IS_ACTIVE_EDITOR = ContextKeyExpr.equals('activeEditor', INTERACTIVE_WINDOW_EDITOR_ID);
        // Editor keys
        service.createKey(exports.NOTEBOOK_EDITOR_FOCUSED, false);
        service.createKey(exports.NOTEBOOK_CELL_LIST_FOCUSED, false);
        service.createKey(exports.NOTEBOOK_OUTPUT_FOCUSED, false);
        service.createKey(exports.NOTEBOOK_EDITOR_EDITABLE, true);
        service.createKey(exports.NOTEBOOK_HAS_RUNNING_CELL, false);
        service.createKey(exports.NOTEBOOK_USE_CONSOLIDATED_OUTPUT_BUTTON, false);
        service.createKey(exports.NOTEBOOK_BREAKPOINT_MARGIN_ACTIVE, false);
        service.createKey(exports.NOTEBOOK_CELL_TOOLBAR_LOCATION, 'left');
        service.createKey(exports.NOTEBOOK_CURSOR_NAVIGATION_MODE, false);
        service.createKey(exports.NOTEBOOK_LAST_CELL_FAILED, false);
        // Cell keys
        service.createKey(exports.NOTEBOOK_VIEW_TYPE, undefined);
        service.createKey(exports.NOTEBOOK_CELL_TYPE, undefined);
        service.createKey(exports.NOTEBOOK_CELL_EDITABLE, false);
        service.createKey(exports.NOTEBOOK_CELL_FOCUSED, false);
        service.createKey(exports.NOTEBOOK_CELL_EDITOR_FOCUSED, false);
        service.createKey(exports.NOTEBOOK_CELL_MARKDOWN_EDIT_MODE, false);
        service.createKey(exports.NOTEBOOK_CELL_LINE_NUMBERS, 'inherit');
        service.createKey(exports.NOTEBOOK_CELL_EXECUTION_STATE, undefined);
        service.createKey(exports.NOTEBOOK_CELL_EXECUTING, false);
        service.createKey(exports.NOTEBOOK_CELL_HAS_OUTPUTS, false);
        service.createKey(exports.NOTEBOOK_CELL_INPUT_COLLAPSED, false);
        service.createKey(exports.NOTEBOOK_CELL_OUTPUT_COLLAPSED, false);
        service.createKey(exports.NOTEBOOK_CELL_RESOURCE, '');
        // Kernels
        service.createKey(exports.NOTEBOOK_KERNEL, undefined);
        service.createKey(exports.NOTEBOOK_KERNEL_COUNT, 0);
        service.createKey(exports.NOTEBOOK_KERNEL_SOURCE_COUNT, 0);
        service.createKey(exports.NOTEBOOK_KERNEL_SELECTED, false);
        service.createKey(exports.NOTEBOOK_INTERRUPTIBLE_KERNEL, false);
        service.createKey(exports.NOTEBOOK_MISSING_KERNEL_EXTENSION, false);
        service.createKey(exports.NOTEBOOK_HAS_OUTPUTS, false);
    }
    NotebookContextKeys.initNotebookContextKeys = initNotebookContextKeys;
})(NotebookContextKeys = exports.NotebookContextKeys || (exports.NotebookContextKeys = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/notebook/lib/browser/contributions/notebook-context-keys'] = this;


/***/ }),

/***/ "../../packages/notebook/lib/browser/notebook-editor-widget.js":
/*!*********************************************************************!*\
  !*** ../../packages/notebook/lib/browser/notebook-editor-widget.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotebookEditorWidget = exports.NOTEBOOK_EDITOR_ID_PREFIX = exports.createNotebookEditorWidgetContainer = exports.NotebookEditorContainerFactory = void 0;
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const common_1 = __webpack_require__(/*! ../common */ "../../packages/notebook/lib/common/index.js");
const notebook_cell_list_view_1 = __webpack_require__(/*! ./view/notebook-cell-list-view */ "../../packages/notebook/lib/browser/view/notebook-cell-list-view.js");
const notebook_code_cell_view_1 = __webpack_require__(/*! ./view/notebook-code-cell-view */ "../../packages/notebook/lib/browser/view/notebook-code-cell-view.js");
const notebook_markdown_cell_view_1 = __webpack_require__(/*! ./view/notebook-markdown-cell-view */ "../../packages/notebook/lib/browser/view/notebook-markdown-cell-view.js");
const notebook_cell_toolbar_factory_1 = __webpack_require__(/*! ./view/notebook-cell-toolbar-factory */ "../../packages/notebook/lib/browser/view/notebook-cell-toolbar-factory.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const vscode_languageserver_protocol_1 = __webpack_require__(/*! @theia/core/shared/vscode-languageserver-protocol */ "../../packages/core/shared/vscode-languageserver-protocol/index.js");
const notebook_editor_service_1 = __webpack_require__(/*! ./service/notebook-editor-service */ "../../packages/notebook/lib/browser/service/notebook-editor-service.js");
const notebook_main_toolbar_1 = __webpack_require__(/*! ./view/notebook-main-toolbar */ "../../packages/notebook/lib/browser/view/notebook-main-toolbar.js");
exports.NotebookEditorContainerFactory = Symbol('NotebookModelFactory');
function createNotebookEditorWidgetContainer(parent, props) {
    const child = parent.createChild();
    child.bind(NotebookEditorProps).toConstantValue(props);
    child.bind(NotebookEditorWidget).toSelf();
    return child;
}
exports.createNotebookEditorWidgetContainer = createNotebookEditorWidgetContainer;
const NotebookEditorProps = Symbol('NotebookEditorProps');
exports.NOTEBOOK_EDITOR_ID_PREFIX = 'notebook:';
let NotebookEditorWidget = class NotebookEditorWidget extends browser_1.ReactWidget {
    constructor(codeCellRenderer, markdownCellRenderer, props) {
        super();
        this.props = props;
        this.saveable = new browser_1.SaveableDelegate();
        this.onDidChangeModelEmitter = new vscode_languageserver_protocol_1.Emitter();
        this.onDidChangeModel = this.onDidChangeModelEmitter.event;
        this.renderers = new Map();
        this.id = exports.NOTEBOOK_EDITOR_ID_PREFIX + this.props.uri.toString();
        this.node.tabIndex = -1;
        this.title.closable = true;
        this.update();
        this.toDispose.push(this.onDidChangeModelEmitter);
        this.renderers.set(common_1.CellKind.Markup, markdownCellRenderer);
        this.renderers.set(common_1.CellKind.Code, codeCellRenderer);
        this.waitForData();
    }
    get notebookType() {
        return this.props.notebookType;
    }
    get model() {
        return this._model;
    }
    async waitForData() {
        this._model = await this.props.notebookData;
        this.saveable.set(this._model);
        this.toDispose.push(this._model);
        // Ensure that the model is loaded before adding the editor
        this.notebookEditorService.addNotebookEditor(this);
        this.update();
    }
    onActivateRequest(msg) {
        super.onActivateRequest(msg);
        this.node.focus();
    }
    getResourceUri() {
        return this.props.uri;
    }
    createMoveToUri(resourceUri) {
        return this.props.uri;
    }
    undo() {
        var _a;
        (_a = this.model) === null || _a === void 0 ? void 0 : _a.undo();
    }
    redo() {
        var _a;
        (_a = this.model) === null || _a === void 0 ? void 0 : _a.redo();
    }
    render() {
        if (this._model) {
            return React.createElement("div", null,
                this.notebookMainToolbarRenderer.render(this._model),
                React.createElement(notebook_cell_list_view_1.NotebookCellListView, { renderers: this.renderers, notebookModel: this._model, toolbarRenderer: this.cellToolbarFactory, commandRegistry: this.commandRegistry }));
        }
        else {
            return React.createElement("div", null);
        }
    }
    onAfterAttach(msg) {
        super.onAfterAttach(msg);
    }
    onAfterDetach(msg) {
        super.onAfterDetach(msg);
        this.notebookEditorService.removeNotebookEditor(this);
    }
};
NotebookEditorWidget.ID = 'notebook';
__decorate([
    (0, inversify_1.inject)(notebook_cell_toolbar_factory_1.NotebookCellToolbarFactory),
    __metadata("design:type", notebook_cell_toolbar_factory_1.NotebookCellToolbarFactory)
], NotebookEditorWidget.prototype, "cellToolbarFactory", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.CommandRegistry),
    __metadata("design:type", core_1.CommandRegistry)
], NotebookEditorWidget.prototype, "commandRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.MenuModelRegistry),
    __metadata("design:type", core_1.MenuModelRegistry)
], NotebookEditorWidget.prototype, "menuRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(notebook_editor_service_1.NotebookEditorWidgetService),
    __metadata("design:type", notebook_editor_service_1.NotebookEditorWidgetService)
], NotebookEditorWidget.prototype, "notebookEditorService", void 0);
__decorate([
    (0, inversify_1.inject)(notebook_main_toolbar_1.NotebookMainToolbarRenderer),
    __metadata("design:type", notebook_main_toolbar_1.NotebookMainToolbarRenderer)
], NotebookEditorWidget.prototype, "notebookMainToolbarRenderer", void 0);
NotebookEditorWidget = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(notebook_code_cell_view_1.NotebookCodeCellRenderer)),
    __param(1, (0, inversify_1.inject)(notebook_markdown_cell_view_1.NotebookMarkdownCellRenderer)),
    __param(2, (0, inversify_1.inject)(NotebookEditorProps)),
    __metadata("design:paramtypes", [notebook_code_cell_view_1.NotebookCodeCellRenderer,
        notebook_markdown_cell_view_1.NotebookMarkdownCellRenderer, Object])
], NotebookEditorWidget);
exports.NotebookEditorWidget = NotebookEditorWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/notebook/lib/browser/notebook-editor-widget'] = this;


/***/ }),

/***/ "../../packages/notebook/lib/browser/notebook-renderer-registry.js":
/*!*************************************************************************!*\
  !*** ../../packages/notebook/lib/browser/notebook-renderer-registry.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotebookRendererRegistry = void 0;
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
let NotebookRendererRegistry = class NotebookRendererRegistry {
    constructor() {
        this.notebookRenderers = [];
    }
    registerNotebookRenderer(type, basePath) {
        let entrypoint;
        if (typeof type.entrypoint === 'string') {
            entrypoint = {
                uri: new core_1.Path(basePath).join(type.entrypoint).toString()
            };
        }
        else {
            entrypoint = {
                uri: new core_1.Path(basePath).join(type.entrypoint.path).toString(),
                extends: type.entrypoint.extends
            };
        }
        this.notebookRenderers.push({
            ...type,
            mimeTypes: type.mimeTypes || [],
            requiresMessaging: type.requiresMessaging === 'always' || type.requiresMessaging === 'optional',
            entrypoint
        });
        return core_1.Disposable.create(() => {
            this.notebookRenderers.splice(this.notebookRenderers.findIndex(renderer => renderer.id === type.id), 1);
        });
    }
};
NotebookRendererRegistry = __decorate([
    (0, inversify_1.injectable)()
], NotebookRendererRegistry);
exports.NotebookRendererRegistry = NotebookRendererRegistry;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/notebook/lib/browser/notebook-renderer-registry'] = this;


/***/ }),

/***/ "../../packages/notebook/lib/browser/notebook-type-registry.js":
/*!*********************************************************************!*\
  !*** ../../packages/notebook/lib/browser/notebook-type-registry.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotebookTypeRegistry = void 0;
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
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
let NotebookTypeRegistry = class NotebookTypeRegistry {
    constructor() {
        this.notebookTypes = [];
    }
    registerNotebookType(type) {
        this.notebookTypes.push(type);
        return core_1.Disposable.create(() => {
            this.notebookTypes.splice(this.notebookTypes.indexOf(type), 1);
        });
    }
};
NotebookTypeRegistry = __decorate([
    (0, inversify_1.injectable)()
], NotebookTypeRegistry);
exports.NotebookTypeRegistry = NotebookTypeRegistry;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/notebook/lib/browser/notebook-type-registry'] = this;


/***/ }),

/***/ "../../packages/notebook/lib/browser/renderers/cell-output-webview.js":
/*!****************************************************************************!*\
  !*** ../../packages/notebook/lib/browser/renderers/cell-output-webview.js ***!
  \****************************************************************************/
/***/ (function(__unused_webpack_module, exports) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CellOutputWebviewFactory = void 0;
exports.CellOutputWebviewFactory = Symbol('outputWebviewFactory');

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/notebook/lib/browser/renderers/cell-output-webview'] = this;


/***/ }),

/***/ "../../packages/notebook/lib/browser/service/notebook-editor-service.js":
/*!******************************************************************************!*\
  !*** ../../packages/notebook/lib/browser/service/notebook-editor-service.js ***!
  \******************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotebookEditorWidgetService = void 0;
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const notebook_editor_widget_1 = __webpack_require__(/*! ../notebook-editor-widget */ "../../packages/notebook/lib/browser/notebook-editor-widget.js");
let NotebookEditorWidgetService = class NotebookEditorWidgetService {
    constructor() {
        this.notebookEditors = new Map();
        this.onNotebookEditorAddEmitter = new core_1.Emitter();
        this.onNotebookEditorsRemoveEmitter = new core_1.Emitter();
        this.onDidAddNotebookEditor = this.onNotebookEditorAddEmitter.event;
        this.onDidRemoveNotebookEditor = this.onNotebookEditorsRemoveEmitter.event;
        this.onFocusedEditorChangedEmitter = new core_1.Emitter();
        this.onFocusedEditorChanged = this.onFocusedEditorChangedEmitter.event;
        this.toDispose = new core_1.DisposableCollection();
        this.currentFocusedEditor = undefined;
    }
    init() {
        this.toDispose.push(this.applicationShell.onDidChangeActiveWidget(event => {
            var _a;
            if (((_a = event.newValue) === null || _a === void 0 ? void 0 : _a.id.startsWith(notebook_editor_widget_1.NOTEBOOK_EDITOR_ID_PREFIX)) && event.newValue !== this.currentFocusedEditor) {
                this.currentFocusedEditor = event.newValue;
                this.onFocusedEditorChangedEmitter.fire(this.currentFocusedEditor);
            }
        }));
    }
    dispose() {
        this.onNotebookEditorAddEmitter.dispose();
        this.onNotebookEditorsRemoveEmitter.dispose();
        this.onFocusedEditorChangedEmitter.dispose();
        this.toDispose.dispose();
    }
    // --- editor management
    addNotebookEditor(editor) {
        this.notebookEditors.set(editor.id, editor);
        this.onNotebookEditorAddEmitter.fire(editor);
    }
    removeNotebookEditor(editor) {
        if (this.notebookEditors.has(editor.id)) {
            this.notebookEditors.delete(editor.id);
            this.onNotebookEditorsRemoveEmitter.fire(editor);
        }
    }
    getNotebookEditor(editorId) {
        return this.notebookEditors.get(editorId);
    }
    listNotebookEditors() {
        return [...this.notebookEditors].map(e => e[1]);
    }
};
__decorate([
    (0, inversify_1.inject)(browser_1.ApplicationShell),
    __metadata("design:type", browser_1.ApplicationShell)
], NotebookEditorWidgetService.prototype, "applicationShell", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NotebookEditorWidgetService.prototype, "init", null);
NotebookEditorWidgetService = __decorate([
    (0, inversify_1.injectable)()
], NotebookEditorWidgetService);
exports.NotebookEditorWidgetService = NotebookEditorWidgetService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/notebook/lib/browser/service/notebook-editor-service'] = this;


/***/ }),

/***/ "../../packages/notebook/lib/browser/service/notebook-execution-service.js":
/*!*********************************************************************************!*\
  !*** ../../packages/notebook/lib/browser/service/notebook-execution-service.js ***!
  \*********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotebookExecutionService = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const notebook_execution_state_service_1 = __webpack_require__(/*! ../service/notebook-execution-state-service */ "../../packages/notebook/lib/browser/service/notebook-execution-state-service.js");
const common_1 = __webpack_require__(/*! ../../common */ "../../packages/notebook/lib/common/index.js");
const notebook_kernel_service_1 = __webpack_require__(/*! ./notebook-kernel-service */ "../../packages/notebook/lib/browser/service/notebook-kernel-service.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const notebook_kernel_quick_pick_service_1 = __webpack_require__(/*! ./notebook-kernel-quick-pick-service */ "../../packages/notebook/lib/browser/service/notebook-kernel-quick-pick-service.js");
const notebook_kernel_history_service_1 = __webpack_require__(/*! ./notebook-kernel-history-service */ "../../packages/notebook/lib/browser/service/notebook-kernel-history-service.js");
const notebook_actions_contribution_1 = __webpack_require__(/*! ../contributions/notebook-actions-contribution */ "../../packages/notebook/lib/browser/contributions/notebook-actions-contribution.js");
let NotebookExecutionService = class NotebookExecutionService {
    constructor() {
        this.cellExecutionParticipants = new Set();
    }
    async executeNotebookCells(notebook, cells) {
        const cellsArr = Array.from(cells)
            .filter(c => c.cellKind === common_1.CellKind.Code);
        if (!cellsArr.length) {
            return;
        }
        // create cell executions
        const cellExecutions = [];
        for (const cell of cellsArr) {
            const cellExe = this.notebookExecutionStateService.getCellExecution(cell.uri);
            if (!cellExe) {
                cellExecutions.push([cell, this.notebookExecutionStateService.createCellExecution(notebook.uri, cell.handle)]);
            }
        }
        const kernel = await this.resolveKernel(notebook);
        if (!kernel) {
            // clear all pending cell executions
            cellExecutions.forEach(cellExe => cellExe[1].complete({}));
            return;
        }
        // filter cell executions based on selected kernel
        const validCellExecutions = [];
        for (const [cell, cellExecution] of cellExecutions) {
            if (!kernel.supportedLanguages.includes(cell.language)) {
                cellExecution.complete({});
            }
            else {
                validCellExecutions.push(cellExecution);
            }
        }
        // request execution
        if (validCellExecutions.length > 0) {
            await this.runExecutionParticipants(validCellExecutions);
            this.notebookKernelService.selectKernelForNotebook(kernel, notebook);
            await kernel.executeNotebookCellsRequest(notebook.uri, validCellExecutions.map(c => c.cellHandle));
            // the connecting state can change before the kernel resolves executeNotebookCellsRequest
            const unconfirmed = validCellExecutions.filter(exe => exe.state === common_1.NotebookCellExecutionState.Unconfirmed);
            if (unconfirmed.length) {
                unconfirmed.forEach(exe => exe.complete({}));
            }
        }
    }
    registerExecutionParticipant(participant) {
        this.cellExecutionParticipants.add(participant);
        return core_1.Disposable.create(() => this.cellExecutionParticipants.delete(participant));
    }
    async runExecutionParticipants(executions) {
        for (const participant of this.cellExecutionParticipants) {
            await participant.onWillExecuteCell(executions);
        }
        return;
    }
    async cancelNotebookCellHandles(notebook, cells) {
        const cellsArr = Array.from(cells);
        const kernel = this.notebookKernelService.getSelectedOrSuggestedKernel(notebook);
        if (kernel) {
            await kernel.cancelNotebookCellExecution(notebook.uri, cellsArr);
        }
    }
    async cancelNotebookCells(notebook, cells) {
        this.cancelNotebookCellHandles(notebook, Array.from(cells, cell => cell.handle));
    }
    async resolveKernel(notebook) {
        const alreadySelected = this.notebookKernelHistoryService.getKernels(notebook);
        if (alreadySelected.selected) {
            return alreadySelected.selected;
        }
        await this.commandService.executeCommand(notebook_actions_contribution_1.NotebookCommands.SELECT_KERNEL_COMMAND.id, notebook);
        const { selected } = this.notebookKernelHistoryService.getKernels(notebook);
        return selected;
    }
};
__decorate([
    (0, inversify_1.inject)(notebook_execution_state_service_1.NotebookExecutionStateService),
    __metadata("design:type", notebook_execution_state_service_1.NotebookExecutionStateService)
], NotebookExecutionService.prototype, "notebookExecutionStateService", void 0);
__decorate([
    (0, inversify_1.inject)(notebook_kernel_service_1.NotebookKernelService),
    __metadata("design:type", notebook_kernel_service_1.NotebookKernelService)
], NotebookExecutionService.prototype, "notebookKernelService", void 0);
__decorate([
    (0, inversify_1.inject)(notebook_kernel_history_service_1.NotebookKernelHistoryService),
    __metadata("design:type", notebook_kernel_history_service_1.NotebookKernelHistoryService)
], NotebookExecutionService.prototype, "notebookKernelHistoryService", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.CommandService),
    __metadata("design:type", Object)
], NotebookExecutionService.prototype, "commandService", void 0);
__decorate([
    (0, inversify_1.inject)(notebook_kernel_quick_pick_service_1.NotebookKernelQuickPickService),
    __metadata("design:type", notebook_kernel_quick_pick_service_1.NotebookKernelQuickPickServiceImpl)
], NotebookExecutionService.prototype, "notebookKernelQuickPickService", void 0);
NotebookExecutionService = __decorate([
    (0, inversify_1.injectable)()
], NotebookExecutionService);
exports.NotebookExecutionService = NotebookExecutionService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/notebook/lib/browser/service/notebook-execution-service'] = this;


/***/ }),

/***/ "../../packages/notebook/lib/browser/service/notebook-execution-state-service.js":
/*!***************************************************************************************!*\
  !*** ../../packages/notebook/lib/browser/service/notebook-execution-state-service.js ***!
  \***************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.updateToEdit = exports.CellExecutionStateChangedEvent = exports.CellExecution = exports.NotebookExecutionStateService = exports.NotebookExecutionType = void 0;
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const notebook_service_1 = __webpack_require__(/*! ./notebook-service */ "../../packages/notebook/lib/browser/service/notebook-service.js");
const common_1 = __webpack_require__(/*! ../../common */ "../../packages/notebook/lib/common/index.js");
const uuid_1 = __webpack_require__(/*! uuid */ "../../node_modules/uuid/dist/esm-browser/index.js");
var NotebookExecutionType;
(function (NotebookExecutionType) {
    NotebookExecutionType[NotebookExecutionType["cell"] = 0] = "cell";
    NotebookExecutionType[NotebookExecutionType["notebook"] = 1] = "notebook";
})(NotebookExecutionType = exports.NotebookExecutionType || (exports.NotebookExecutionType = {}));
let NotebookExecutionStateService = class NotebookExecutionStateService {
    constructor() {
        this.executions = new Map();
        this.onDidChangeExecutionEmitter = new core_1.Emitter();
        this.onDidChangeExecution = this.onDidChangeExecutionEmitter.event;
        this.onDidChangeLastRunFailStateEmitter = new core_1.Emitter();
        this.onDidChangeLastRunFailState = this.onDidChangeLastRunFailStateEmitter.event;
    }
    createCellExecution(notebookUri, cellHandle) {
        const notebook = this.notebookService.getNotebookEditorModel(notebookUri);
        if (!notebook) {
            throw new Error(`Notebook not found: ${notebookUri.toString()}`);
        }
        let execution = this.executions.get(`${notebookUri}/${cellHandle}`);
        if (!execution) {
            execution = this.createNotebookCellExecution(notebook, cellHandle);
            this.executions.set(`${notebookUri}/${cellHandle}`, execution);
            execution.initialize();
            this.onDidChangeExecutionEmitter.fire(new CellExecutionStateChangedEvent(notebookUri, cellHandle, execution));
        }
        return execution;
    }
    createNotebookCellExecution(notebook, cellHandle) {
        const notebookUri = notebook.uri;
        const execution = new CellExecution(cellHandle, notebook);
        execution.onDidUpdate(() => this.onDidChangeExecutionEmitter.fire(new CellExecutionStateChangedEvent(notebookUri, cellHandle, execution)));
        execution.onDidComplete(lastRunSuccess => this.onCellExecutionDidComplete(notebookUri, cellHandle, execution, lastRunSuccess));
        return execution;
    }
    onCellExecutionDidComplete(notebookUri, cellHandle, exe, lastRunSuccess) {
        const notebookExecutions = this.executions.get(`${notebookUri}/${cellHandle}`);
        if (!notebookExecutions) {
            return;
        }
        exe.dispose();
        this.executions.delete(`${notebookUri}/${cellHandle}`);
        this.onDidChangeExecutionEmitter.fire(new CellExecutionStateChangedEvent(notebookUri, cellHandle));
    }
    getCellExecution(cellUri) {
        const parsed = common_1.CellUri.parse(cellUri);
        if (!parsed) {
            throw new Error(`Not a cell URI: ${cellUri}`);
        }
        return this.executions.get(`${parsed.notebook.toString()}/${parsed.handle}`);
    }
    dispose() {
        this.onDidChangeExecutionEmitter.dispose();
        this.onDidChangeLastRunFailStateEmitter.dispose();
        this.executions.forEach(cellExecution => cellExecution.dispose());
    }
};
__decorate([
    (0, inversify_1.inject)(notebook_service_1.NotebookService),
    __metadata("design:type", notebook_service_1.NotebookService)
], NotebookExecutionStateService.prototype, "notebookService", void 0);
NotebookExecutionStateService = __decorate([
    (0, inversify_1.injectable)()
], NotebookExecutionStateService);
exports.NotebookExecutionStateService = NotebookExecutionStateService;
class CellExecution {
    constructor(cellHandle, notebook) {
        this.cellHandle = cellHandle;
        this.notebook = notebook;
        this.onDidUpdateEmitter = new core_1.Emitter();
        this.onDidUpdate = this.onDidUpdateEmitter.event;
        this.onDidCompleteEmitter = new core_1.Emitter();
        this.onDidComplete = this.onDidCompleteEmitter.event;
        this._state = common_1.NotebookCellExecutionState.Unconfirmed;
        this._didPause = false;
        this._isPaused = false;
        console.debug(`CellExecution#ctor ${this.getCellLog()}`);
    }
    get state() {
        return this._state;
    }
    get notebookURI() {
        return this.notebook.uri;
    }
    get didPause() {
        return this._didPause;
    }
    get isPaused() {
        return this._isPaused;
    }
    initialize() {
        const startExecuteEdit = {
            editType: 9 /* PartialInternalMetadata */,
            handle: this.cellHandle,
            internalMetadata: {
                executionId: (0, uuid_1.v4)(),
                runStartTime: undefined,
                runEndTime: undefined,
                lastRunSuccess: undefined,
                executionOrder: undefined,
                renderDuration: undefined,
            }
        };
        this.applyExecutionEdits([startExecuteEdit]);
    }
    getCellLog() {
        return `${this.notebookURI.toString()}, ${this.cellHandle}`;
    }
    confirm() {
        this._state = common_1.NotebookCellExecutionState.Pending;
        this.onDidUpdateEmitter.fire();
    }
    update(updates) {
        if (updates.some(u => u.editType === common_1.CellExecutionUpdateType.ExecutionState)) {
            this._state = common_1.NotebookCellExecutionState.Executing;
        }
        if (!this._didPause && updates.some(u => u.editType === common_1.CellExecutionUpdateType.ExecutionState && u.didPause)) {
            this._didPause = true;
        }
        const lastIsPausedUpdate = [...updates].reverse().find(u => u.editType === common_1.CellExecutionUpdateType.ExecutionState && typeof u.isPaused === 'boolean');
        if (lastIsPausedUpdate) {
            this._isPaused = lastIsPausedUpdate.isPaused;
        }
        const cellModel = this.notebook.cells.find(c => c.handle === this.cellHandle);
        if (!cellModel) {
            console.debug(`CellExecution#update, updating cell not in notebook: ${this.notebook.uri.toString()}, ${this.cellHandle}`);
        }
        else {
            const edits = updates.map(update => updateToEdit(update, this.cellHandle));
            this.applyExecutionEdits(edits);
        }
        if (updates.some(u => u.editType === common_1.CellExecutionUpdateType.ExecutionState)) {
            this.onDidUpdateEmitter.fire();
        }
    }
    complete(completionData) {
        const cellModel = this.notebook.cells.find(c => c.handle === this.cellHandle);
        if (!cellModel) {
            console.debug(`CellExecution#complete, completing cell not in notebook: ${this.notebook.uri.toString()}, ${this.cellHandle}`);
        }
        else {
            const edit = {
                editType: 9 /* PartialInternalMetadata */,
                handle: this.cellHandle,
                internalMetadata: {
                    lastRunSuccess: completionData.lastRunSuccess,
                    // eslint-disable-next-line no-null/no-null
                    runStartTime: this._didPause ? null : cellModel.internalMetadata.runStartTime,
                    // eslint-disable-next-line no-null/no-null
                    runEndTime: this._didPause ? null : completionData.runEndTime,
                }
            };
            this.applyExecutionEdits([edit]);
        }
        this.onDidCompleteEmitter.fire(completionData.lastRunSuccess);
    }
    dispose() {
        this.onDidUpdateEmitter.dispose();
        this.onDidCompleteEmitter.dispose();
    }
    applyExecutionEdits(edits) {
        this.notebook.applyEdits(edits, false);
    }
}
exports.CellExecution = CellExecution;
class CellExecutionStateChangedEvent {
    constructor(notebook, cellHandle, changed) {
        this.notebook = notebook;
        this.cellHandle = cellHandle;
        this.changed = changed;
        this.type = NotebookExecutionType.cell;
    }
    affectsCell(cell) {
        const parsedUri = common_1.CellUri.parse(cell);
        return !!parsedUri && this.notebook.isEqual(parsedUri.notebook) && this.cellHandle === parsedUri.handle;
    }
    affectsNotebook(notebook) {
        return this.notebook.toString() === notebook.toString();
    }
}
exports.CellExecutionStateChangedEvent = CellExecutionStateChangedEvent;
function updateToEdit(update, cellHandle) {
    if (update.editType === common_1.CellExecutionUpdateType.Output) {
        return {
            editType: 2 /* Output */,
            handle: update.cellHandle,
            append: update.append,
            outputs: update.outputs,
        };
    }
    else if (update.editType === common_1.CellExecutionUpdateType.OutputItems) {
        return {
            editType: 7 /* OutputItems */,
            items: update.items,
            append: update.append,
        };
    }
    else if (update.editType === common_1.CellExecutionUpdateType.ExecutionState) {
        const newInternalMetadata = {};
        if (typeof update.executionOrder !== 'undefined') {
            newInternalMetadata.executionOrder = update.executionOrder;
        }
        if (typeof update.runStartTime !== 'undefined') {
            newInternalMetadata.runStartTime = update.runStartTime;
        }
        return {
            editType: 9 /* PartialInternalMetadata */,
            handle: cellHandle,
            internalMetadata: newInternalMetadata
        };
    }
    throw new Error('Unknown cell update type');
}
exports.updateToEdit = updateToEdit;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/notebook/lib/browser/service/notebook-execution-state-service'] = this;


/***/ }),

/***/ "../../packages/notebook/lib/browser/service/notebook-kernel-history-service.js":
/*!**************************************************************************************!*\
  !*** ../../packages/notebook/lib/browser/service/notebook-kernel-history-service.js ***!
  \**************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var NotebookKernelHistoryService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotebookKernelHistoryService = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const notebook_kernel_service_1 = __webpack_require__(/*! ./notebook-kernel-service */ "../../packages/notebook/lib/browser/service/notebook-kernel-service.js");
const MAX_KERNELS_IN_HISTORY = 5;
let NotebookKernelHistoryService = NotebookKernelHistoryService_1 = class NotebookKernelHistoryService {
    constructor() {
        this.mostRecentKernelsMap = {};
    }
    init() {
        this.loadState();
    }
    getKernels(notebook) {
        const allAvailableKernels = this.notebookKernelService.getMatchingKernel(notebook);
        const allKernels = allAvailableKernels.all;
        const selectedKernel = allAvailableKernels.selected;
        // We will suggest the only kernel
        const suggested = allAvailableKernels.all.length === 1 ? allAvailableKernels.all[0] : undefined;
        const mostRecentKernelIds = this.mostRecentKernelsMap[notebook.viewType] ? this.mostRecentKernelsMap[notebook.viewType].map(kernel => kernel[1]) : [];
        const all = mostRecentKernelIds.map(kernelId => allKernels.find(kernel => kernel.id === kernelId)).filter(kernel => !!kernel);
        return {
            selected: selectedKernel !== null && selectedKernel !== void 0 ? selectedKernel : suggested,
            all
        };
    }
    addMostRecentKernel(kernel) {
        var _a;
        const viewType = kernel.viewType;
        const recentKernels = (_a = this.mostRecentKernelsMap[viewType]) !== null && _a !== void 0 ? _a : [kernel.id];
        if (recentKernels.length > MAX_KERNELS_IN_HISTORY) {
            recentKernels.splice(MAX_KERNELS_IN_HISTORY);
        }
        this.mostRecentKernelsMap[viewType] = recentKernels;
        this.saveState();
    }
    saveState() {
        let notEmpty = false;
        for (const [_, kernels] of Object.entries(this.mostRecentKernelsMap)) {
            notEmpty = notEmpty || Object.entries(kernels).length > 0;
        }
        this.storageService.setData(NotebookKernelHistoryService_1.STORAGE_KEY, notEmpty ? this.mostRecentKernelsMap : undefined);
    }
    async loadState() {
        const kernelMap = await this.storageService.getData(NotebookKernelHistoryService_1.STORAGE_KEY);
        if (kernelMap) {
            this.mostRecentKernelsMap = kernelMap;
        }
        else {
            this.mostRecentKernelsMap = {};
        }
    }
    clear() {
        this.mostRecentKernelsMap = {};
        this.saveState();
    }
    dispose() {
    }
};
NotebookKernelHistoryService.STORAGE_KEY = 'notebook.kernelHistory';
__decorate([
    (0, inversify_1.inject)(browser_1.StorageService),
    __metadata("design:type", Object)
], NotebookKernelHistoryService.prototype, "storageService", void 0);
__decorate([
    (0, inversify_1.inject)(notebook_kernel_service_1.NotebookKernelService),
    __metadata("design:type", notebook_kernel_service_1.NotebookKernelService)
], NotebookKernelHistoryService.prototype, "notebookKernelService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NotebookKernelHistoryService.prototype, "init", null);
NotebookKernelHistoryService = NotebookKernelHistoryService_1 = __decorate([
    (0, inversify_1.injectable)()
], NotebookKernelHistoryService);
exports.NotebookKernelHistoryService = NotebookKernelHistoryService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/notebook/lib/browser/service/notebook-kernel-history-service'] = this;


/***/ }),

/***/ "../../packages/notebook/lib/browser/service/notebook-kernel-quick-pick-service.js":
/*!*****************************************************************************************!*\
  !*** ../../packages/notebook/lib/browser/service/notebook-kernel-quick-pick-service.js ***!
  \*****************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KernelPickerMRUStrategy = exports.NotebookKernelQuickPickServiceImpl = exports.NotebookKernelQuickPickService = exports.JUPYTER_EXTENSION_ID = void 0;
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const notebook_kernel_service_1 = __webpack_require__(/*! ./notebook-kernel-service */ "../../packages/notebook/lib/browser/service/notebook-kernel-service.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const notebook_kernel_history_service_1 = __webpack_require__(/*! ./notebook-kernel-history-service */ "../../packages/notebook/lib/browser/service/notebook-kernel-history-service.js");
const debounce = __webpack_require__(/*! @theia/core/shared/lodash.debounce */ "../../packages/core/shared/lodash.debounce/index.js");
exports.JUPYTER_EXTENSION_ID = 'ms-toolsai.jupyter';
exports.NotebookKernelQuickPickService = Symbol('NotebookKernelQuickPickService');
function isKernelPick(item) {
    return 'kernel' in item;
}
function isGroupedKernelsPick(item) {
    return 'kernels' in item;
}
function isSourcePick(item) {
    return 'action' in item;
}
function isKernelSourceQuickPickItem(item) {
    return 'command' in item;
}
function supportAutoRun(item) {
    return 'autoRun' in item && !!item.autoRun;
}
const KERNEL_PICKER_UPDATE_DEBOUNCE = 200;
function toKernelQuickPick(kernel, selected) {
    const res = {
        kernel,
        label: kernel.label,
        description: kernel.description,
        detail: kernel.detail
    };
    if (kernel.id === (selected === null || selected === void 0 ? void 0 : selected.id)) {
        if (!res.description) {
            res.description = core_1.nls.localizeByDefault('Currently Selected');
        }
        else {
            res.description = core_1.nls.localizeByDefault('{0} - Currently Selected', res.description);
        }
    }
    return res;
}
let NotebookKernelQuickPickServiceImpl = class NotebookKernelQuickPickServiceImpl {
    async showQuickPick(editor, wantedId, skipAutoRun) {
        const notebook = editor;
        const matchResult = this.getMatchingResult(notebook);
        const { selected, all } = matchResult;
        let newKernel;
        if (wantedId) {
            for (const candidate of all) {
                if (candidate.id === wantedId) {
                    newKernel = candidate;
                    break;
                }
            }
            if (!newKernel) {
                console.warn(`wanted kernel DOES NOT EXIST, wanted: ${wantedId}, all: ${all.map(k => k.id)}`);
                return false;
            }
        }
        if (newKernel) {
            this.selectKernel(notebook, newKernel);
            return true;
        }
        const quickPick = this.quickInputService.createQuickPick();
        const quickPickItems = this.getKernelPickerQuickPickItems(matchResult);
        if (quickPickItems.length === 1 && supportAutoRun(quickPickItems[0]) && !skipAutoRun) {
            return this.handleQuickPick(editor, quickPickItems[0], quickPickItems);
        }
        quickPick.items = quickPickItems;
        quickPick.canSelectMany = false;
        quickPick.placeholder = selected
            ? core_1.nls.localizeByDefault("Change kernel for '{0}'", 'current') // TODO get label for current notebook from a label provider
            : core_1.nls.localizeByDefault("Select kernel for '{0}'", 'current');
        quickPick.busy = this.notebookKernelService.getKernelDetectionTasks(notebook).length > 0;
        const kernelDetectionTaskListener = this.notebookKernelService.onDidChangeKernelDetectionTasks(() => {
            quickPick.busy = this.notebookKernelService.getKernelDetectionTasks(notebook).length > 0;
        });
        const kernelChangeEventListener = debounce(core_1.Event.any(this.notebookKernelService.onDidChangeSourceActions, this.notebookKernelService.onDidAddKernel, this.notebookKernelService.onDidRemoveKernel, this.notebookKernelService.onDidChangeNotebookAffinity), KERNEL_PICKER_UPDATE_DEBOUNCE)(async () => {
            // reset quick pick progress
            quickPick.busy = false;
            const currentActiveItems = quickPick.activeItems;
            const newMatchResult = this.getMatchingResult(notebook);
            const newQuickPickItems = this.getKernelPickerQuickPickItems(newMatchResult);
            quickPick.keepScrollPosition = true;
            // recalculate active items
            const activeItems = [];
            for (const item of currentActiveItems) {
                if (isKernelPick(item)) {
                    const kernelId = item.kernel.id;
                    const sameItem = newQuickPickItems.find(pi => isKernelPick(pi) && pi.kernel.id === kernelId);
                    if (sameItem) {
                        activeItems.push(sameItem);
                    }
                }
                else if (isSourcePick(item)) {
                    const sameItem = newQuickPickItems.find(pi => isSourcePick(pi) && pi.action.command.id === item.action.command.id);
                    if (sameItem) {
                        activeItems.push(sameItem);
                    }
                }
            }
            quickPick.items = newQuickPickItems;
            quickPick.activeItems = activeItems;
        }, this);
        const pick = await new Promise((resolve, reject) => {
            quickPick.onDidAccept(() => {
                const item = quickPick.selectedItems[0];
                if (item) {
                    resolve({ selected: item, items: quickPick.items });
                }
                else {
                    resolve({ selected: undefined, items: quickPick.items });
                }
                quickPick.hide();
            });
            quickPick.onDidHide(() => {
                kernelDetectionTaskListener.dispose();
                kernelChangeEventListener === null || kernelChangeEventListener === void 0 ? void 0 : kernelChangeEventListener.dispose();
                quickPick.dispose();
                resolve({ selected: undefined, items: quickPick.items });
            });
            quickPick.show();
        });
        if (pick.selected) {
            return this.handleQuickPick(editor, pick.selected, pick.items);
        }
        return false;
    }
    getMatchingResult(notebook) {
        return this.notebookKernelService.getMatchingKernel(notebook);
    }
    async handleQuickPick(editor, pick, quickPickItems) {
        if (isKernelPick(pick)) {
            const newKernel = pick.kernel;
            this.selectKernel(editor, newKernel);
            return true;
        }
        if (isSourcePick(pick)) {
            // selected explicitly, it should trigger the execution?
            pick.action.run();
        }
        return true;
    }
    selectKernel(notebook, kernel) {
        this.notebookKernelService.selectKernelForNotebook(kernel, notebook);
    }
};
__decorate([
    (0, inversify_1.inject)(notebook_kernel_service_1.NotebookKernelService),
    __metadata("design:type", notebook_kernel_service_1.NotebookKernelService)
], NotebookKernelQuickPickServiceImpl.prototype, "notebookKernelService", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.QuickInputService),
    __metadata("design:type", Object)
], NotebookKernelQuickPickServiceImpl.prototype, "quickInputService", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.CommandService),
    __metadata("design:type", Object)
], NotebookKernelQuickPickServiceImpl.prototype, "commandService", void 0);
NotebookKernelQuickPickServiceImpl = __decorate([
    (0, inversify_1.injectable)()
], NotebookKernelQuickPickServiceImpl);
exports.NotebookKernelQuickPickServiceImpl = NotebookKernelQuickPickServiceImpl;
let KernelPickerMRUStrategy = class KernelPickerMRUStrategy extends NotebookKernelQuickPickServiceImpl {
    getKernelPickerQuickPickItems(matchResult) {
        const quickPickItems = [];
        if (matchResult.selected) {
            const kernelItem = toKernelQuickPick(matchResult.selected, matchResult.selected);
            quickPickItems.push(kernelItem);
        }
        // TODO use suggested here when kernel affinity is implemented. For now though show all kernels
        matchResult.all.filter(kernel => { var _a; return kernel.id !== ((_a = matchResult.selected) === null || _a === void 0 ? void 0 : _a.id); }).map(kernel => toKernelQuickPick(kernel, matchResult.selected))
            .forEach(kernel => {
            quickPickItems.push(kernel);
        });
        const shouldAutoRun = quickPickItems.length === 0;
        if (quickPickItems.length > 0) {
            quickPickItems.push({
                type: 'separator'
            });
        }
        // select another kernel quick pick
        quickPickItems.push({
            id: 'selectAnother',
            label: core_1.nls.localizeByDefault('Select Another Kernel...'),
            autoRun: shouldAutoRun
        });
        return quickPickItems;
    }
    selectKernel(notebook, kernel) {
        const currentInfo = this.notebookKernelService.getMatchingKernel(notebook);
        if (currentInfo.selected) {
            // there is already a selected kernel
            this.notebookKernelHistoryService.addMostRecentKernel(currentInfo.selected);
        }
        super.selectKernel(notebook, kernel);
        this.notebookKernelHistoryService.addMostRecentKernel(kernel);
    }
    getMatchingResult(notebook) {
        const { selected, all } = this.notebookKernelHistoryService.getKernels(notebook);
        const matchingResult = this.notebookKernelService.getMatchingKernel(notebook);
        return {
            selected: selected,
            all: matchingResult.all,
            suggestions: all,
            hidden: []
        };
    }
    async handleQuickPick(editor, pick, items) {
        if (pick.id === 'selectAnother') {
            return this.displaySelectAnotherQuickPick(editor, items.length === 1 && items[0] === pick);
        }
        return super.handleQuickPick(editor, pick, items);
    }
    async displaySelectAnotherQuickPick(editor, kernelListEmpty) {
        const notebook = editor;
        const disposables = new core_1.DisposableCollection();
        const quickPick = this.quickInputService.createQuickPick();
        const quickPickItem = await new Promise(resolve => {
            // select from kernel sources
            quickPick.title = kernelListEmpty ? core_1.nls.localizeByDefault('Select Kernel') : core_1.nls.localizeByDefault('Select Another Kernel');
            quickPick.placeholder = core_1.nls.localizeByDefault('Type to choose a kernel source');
            quickPick.busy = true;
            // quickPick.buttons = [this.quickInputService.backButton];
            quickPick.show();
            disposables.push(quickPick.onDidTriggerButton(button => {
                if (button === this.quickInputService.backButton) {
                    resolve(button);
                }
            }));
            quickPick.onDidTriggerItemButton(async (e) => {
                if (isKernelSourceQuickPickItem(e.item) && e.item.documentation !== undefined) {
                    const uri = core_1.URI.isUri(e.item.documentation) ? new core_1.URI(e.item.documentation) : await this.commandService.executeCommand(e.item.documentation);
                    if (uri) {
                        (await this.openerService.getOpener(uri, { openExternal: true })).open(uri, { openExternal: true });
                    }
                }
            });
            disposables.push(quickPick.onDidAccept(async () => {
                resolve(quickPick.selectedItems[0]);
            }));
            disposables.push(quickPick.onDidHide(() => {
                resolve(undefined);
            }));
            this.calculateKernelSources(editor).then(quickPickItems => {
                quickPick.items = quickPickItems;
                if (quickPick.items.length > 0) {
                    quickPick.busy = false;
                }
            });
            debounce(core_1.Event.any(this.notebookKernelService.onDidChangeSourceActions, this.notebookKernelService.onDidAddKernel, this.notebookKernelService.onDidRemoveKernel), KERNEL_PICKER_UPDATE_DEBOUNCE)(async () => {
                quickPick.busy = true;
                const quickPickItems = await this.calculateKernelSources(editor);
                quickPick.items = quickPickItems;
                quickPick.busy = false;
            });
        });
        quickPick.hide();
        disposables.dispose();
        if (quickPickItem === this.quickInputService.backButton) {
            return this.showQuickPick(editor, undefined, true);
        }
        if (quickPickItem) {
            const selectedKernelPickItem = quickPickItem;
            if (isKernelSourceQuickPickItem(selectedKernelPickItem)) {
                try {
                    const selectedKernelId = await this.executeCommand(notebook, selectedKernelPickItem.command);
                    if (selectedKernelId) {
                        const { all } = this.getMatchingResult(notebook);
                        const notebookKernel = all.find(kernel => kernel.id === `ms-toolsai.jupyter/${selectedKernelId}`);
                        if (notebookKernel) {
                            this.selectKernel(notebook, notebookKernel);
                            return true;
                        }
                        return true;
                    }
                    else {
                        return this.displaySelectAnotherQuickPick(editor, false);
                    }
                }
                catch (ex) {
                    return false;
                }
            }
            else if (isKernelPick(selectedKernelPickItem)) {
                this.selectKernel(notebook, selectedKernelPickItem.kernel);
                return true;
            }
            else if (isGroupedKernelsPick(selectedKernelPickItem)) {
                await this.selectOneKernel(notebook, selectedKernelPickItem.source, selectedKernelPickItem.kernels);
                return true;
            }
            else if (isSourcePick(selectedKernelPickItem)) {
                // selected explicilty, it should trigger the execution?
                try {
                    await selectedKernelPickItem.action.run();
                    return true;
                }
                catch (ex) {
                    return false;
                }
            }
            // } else if (isSearchMarketplacePick(selectedKernelPickItem)) {
            //     await this.showKernelExtension(
            //         this.paneCompositePartService,
            //         this.extensionWorkbenchService,
            //         this.extensionService,
            //         editor.textModel.viewType,
            //         []
            //     );
            //     return true;
            // } else if (isInstallExtensionPick(selectedKernelPickItem)) {
            //     await this.showKernelExtension(
            //         this.paneCompositePartService,
            //         this.extensionWorkbenchService,
            //         this.extensionService,
            //         editor.textModel.viewType,
            //         selectedKernelPickItem.extensionIds,
            //     );
            //     return true;
            // }
        }
        return false;
    }
    async calculateKernelSources(editor) {
        const notebook = editor;
        const actions = await this.notebookKernelService.getKernelSourceActionsFromProviders(notebook);
        const matchResult = this.getMatchingResult(notebook);
        const others = matchResult.all.filter(item => item.extension !== exports.JUPYTER_EXTENSION_ID);
        const quickPickItems = [];
        // group controllers by extension
        for (const group of core_1.ArrayUtils.groupBy(others, (a, b) => a.extension === b.extension ? 0 : 1)) {
            const source = group[0].extension;
            if (group.length > 1) {
                quickPickItems.push({
                    label: source,
                    kernels: group
                });
            }
            else {
                quickPickItems.push({
                    label: group[0].label,
                    kernel: group[0]
                });
            }
        }
        const validActions = actions.filter(action => action.command);
        quickPickItems.push(...validActions.map(action => {
            const buttons = action.documentation ? [{
                    iconClass: (0, browser_1.codicon)('info'),
                    tooltip: core_1.nls.localizeByDefault('Learn More'),
                }] : [];
            return {
                id: typeof action.command === 'string' ? action.command : action.command.id,
                label: action.label,
                description: action.description,
                command: action.command,
                documentation: action.documentation,
                buttons
            };
        }));
        return quickPickItems;
    }
    async selectOneKernel(notebook, source, kernels) {
        const quickPickItems = kernels.map(kernel => toKernelQuickPick(kernel, undefined));
        const quickPick = this.quickInputService.createQuickPick();
        quickPick.items = quickPickItems;
        quickPick.canSelectMany = false;
        quickPick.title = core_1.nls.localizeByDefault('Select Kernel from {0}', source);
        quickPick.onDidAccept(async () => {
            if (quickPick.selectedItems && quickPick.selectedItems.length > 0 && isKernelPick(quickPick.selectedItems[0])) {
                this.selectKernel(notebook, quickPick.selectedItems[0].kernel);
            }
            quickPick.hide();
            quickPick.dispose();
        });
        quickPick.onDidHide(() => {
            quickPick.dispose();
        });
        quickPick.show();
    }
    async executeCommand(notebook, command) {
        const id = typeof command === 'string' ? command : command.id;
        return this.commandService.executeCommand(id, { uri: notebook.uri });
    }
};
__decorate([
    (0, inversify_1.inject)(browser_1.OpenerService),
    __metadata("design:type", Object)
], KernelPickerMRUStrategy.prototype, "openerService", void 0);
__decorate([
    (0, inversify_1.inject)(notebook_kernel_history_service_1.NotebookKernelHistoryService),
    __metadata("design:type", notebook_kernel_history_service_1.NotebookKernelHistoryService)
], KernelPickerMRUStrategy.prototype, "notebookKernelHistoryService", void 0);
KernelPickerMRUStrategy = __decorate([
    (0, inversify_1.injectable)()
], KernelPickerMRUStrategy);
exports.KernelPickerMRUStrategy = KernelPickerMRUStrategy;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/notebook/lib/browser/service/notebook-kernel-quick-pick-service'] = this;


/***/ }),

/***/ "../../packages/notebook/lib/browser/service/notebook-kernel-service.js":
/*!******************************************************************************!*\
  !*** ../../packages/notebook/lib/browser/service/notebook-kernel-service.js ***!
  \******************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var NotebookKernelService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotebookKernelService = exports.SourceCommand = void 0;
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const notebook_service_1 = __webpack_require__(/*! ./notebook-service */ "../../packages/notebook/lib/browser/service/notebook-service.js");
class KernelInfo {
    constructor(kernel) {
        this.kernel = kernel;
        this.score = -1;
        this.time = KernelInfo.logicClock++;
    }
}
KernelInfo.logicClock = 0;
class SourceCommand {
    constructor(commandRegistry, command, model, isPrimary) {
        this.commandRegistry = commandRegistry;
        this.command = command;
        this.model = model;
        this.isPrimary = isPrimary;
        this.onDidChangeStateEmitter = new core_1.Emitter();
        this.onDidChangeState = this.onDidChangeStateEmitter.event;
    }
    async run() {
        if (this.execution) {
            return this.execution;
        }
        this.execution = this.runCommand();
        this.onDidChangeStateEmitter.fire();
        await this.execution;
        this.execution = undefined;
        this.onDidChangeStateEmitter.fire();
    }
    async runCommand() {
        try {
            await this.commandRegistry.executeCommand(this.command.id, {
                uri: this.model.uri,
            });
        }
        catch (error) {
            console.warn(`Kernel source command failed: ${error}`);
        }
    }
    dispose() {
        this.onDidChangeStateEmitter.dispose();
    }
}
exports.SourceCommand = SourceCommand;
const NOTEBOOK_KERNEL_BINDING_STORAGE_KEY = 'notebook.kernel.bindings';
let NotebookKernelService = NotebookKernelService_1 = class NotebookKernelService {
    constructor() {
        this.kernels = new Map();
        this.notebookBindings = {};
        this.kernelDetectionTasks = new Map();
        this.onDidChangeKernelDetectionTasksEmitter = new core_1.Emitter();
        this.onDidChangeKernelDetectionTasks = this.onDidChangeKernelDetectionTasksEmitter.event;
        this.onDidChangeSourceActionsEmitter = new core_1.Emitter();
        this.kernelSourceActionProviders = new Map();
        this.onDidChangeSourceActions = this.onDidChangeSourceActionsEmitter.event;
        this.onDidAddKernelEmitter = new core_1.Emitter();
        this.onDidAddKernel = this.onDidAddKernelEmitter.event;
        this.onDidRemoveKernelEmitter = new core_1.Emitter();
        this.onDidRemoveKernel = this.onDidRemoveKernelEmitter.event;
        this.onDidChangeSelectedNotebookKernelBindingEmitter = new core_1.Emitter();
        this.onDidChangeSelectedKernel = this.onDidChangeSelectedNotebookKernelBindingEmitter.event;
        this.onDidChangeNotebookAffinityEmitter = new core_1.Emitter();
        this.onDidChangeNotebookAffinity = this.onDidChangeNotebookAffinityEmitter.event;
    }
    init() {
        this.storageService.getData(NOTEBOOK_KERNEL_BINDING_STORAGE_KEY).then((value) => {
            if (value) {
                this.notebookBindings = value;
            }
        });
    }
    registerKernel(kernel) {
        if (this.kernels.has(kernel.id)) {
            throw new Error(`NOTEBOOK CONTROLLER with id '${kernel.id}' already exists`);
        }
        this.kernels.set(kernel.id, new KernelInfo(kernel));
        this.onDidAddKernelEmitter.fire(kernel);
        // auto associate the new kernel to existing notebooks it was
        // associated to in the past.
        for (const notebook of this.notebookService.getNotebookModels()) {
            this.tryAutoBindNotebook(notebook, kernel);
        }
        return core_1.Disposable.create(() => {
            if (this.kernels.delete(kernel.id)) {
                this.onDidRemoveKernelEmitter.fire(kernel);
            }
        });
    }
    getMatchingKernel(notebook) {
        var _a;
        const kernels = [];
        for (const info of this.kernels.values()) {
            const score = NotebookKernelService_1.score(info.kernel, notebook);
            if (score) {
                kernels.push({
                    score,
                    kernel: info.kernel,
                    instanceAffinity: 1 /* vscode.NotebookControllerPriority.Default */,
                });
            }
        }
        kernels
            .sort((a, b) => b.instanceAffinity - a.instanceAffinity || a.score - b.score || a.kernel.label.localeCompare(b.kernel.label));
        const all = kernels.map(obj => obj.kernel);
        // bound kernel
        const selectedId = this.notebookBindings[`${notebook.viewType}/${notebook.uri}`];
        const selected = selectedId ? (_a = this.kernels.get(selectedId)) === null || _a === void 0 ? void 0 : _a.kernel : undefined;
        const suggestions = kernels.filter(item => item.instanceAffinity > 1).map(item => item.kernel); // TODO implement notebookAffinity
        const hidden = kernels.filter(item => item.instanceAffinity < 0).map(item => item.kernel);
        return { all, selected, suggestions, hidden };
    }
    selectKernelForNotebook(kernel, notebook) {
        const key = `${notebook.viewType}/${notebook.uri}`;
        const oldKernel = this.notebookBindings[key];
        if (oldKernel !== (kernel === null || kernel === void 0 ? void 0 : kernel.id)) {
            if (kernel) {
                this.notebookBindings[key] = kernel.id;
            }
            else {
                delete this.notebookBindings[key];
            }
            this.storageService.setData(NOTEBOOK_KERNEL_BINDING_STORAGE_KEY, this.notebookBindings);
            this.onDidChangeSelectedNotebookKernelBindingEmitter.fire({ notebook: notebook.uri, oldKernel, newKernel: kernel === null || kernel === void 0 ? void 0 : kernel.id });
        }
    }
    getSelectedOrSuggestedKernel(notebook) {
        const info = this.getMatchingKernel(notebook);
        if (info.selected) {
            return info.selected;
        }
        return info.all.length === 1 ? info.all[0] : undefined;
    }
    getKernel(id) {
        var _a;
        return (_a = this.kernels.get(id)) === null || _a === void 0 ? void 0 : _a.kernel;
    }
    static score(kernel, notebook) {
        if (kernel.viewType === '*') {
            return 5;
        }
        else if (kernel.viewType === notebook.viewType) {
            return 10;
        }
        else {
            return 0;
        }
    }
    tryAutoBindNotebook(notebook, onlyThisKernel) {
        const id = this.notebookBindings[`${notebook.viewType}/${notebook.uri}`];
        if (!id) {
            // no kernel associated
            return;
        }
        const existingKernel = this.kernels.get(id);
        if (!existingKernel || !NotebookKernelService_1.score(existingKernel.kernel, notebook)) {
            // associated kernel not known, not matching
            return;
        }
        if (!onlyThisKernel || existingKernel.kernel === onlyThisKernel) {
            this.onDidChangeSelectedNotebookKernelBindingEmitter.fire({ notebook: notebook.uri, oldKernel: undefined, newKernel: existingKernel.kernel.id });
        }
    }
    registerNotebookKernelDetectionTask(task) {
        var _a;
        const notebookType = task.notebookType;
        const all = (_a = this.kernelDetectionTasks.get(notebookType)) !== null && _a !== void 0 ? _a : [];
        all.push(task);
        this.kernelDetectionTasks.set(notebookType, all);
        this.onDidChangeKernelDetectionTasksEmitter.fire(notebookType);
        return core_1.Disposable.create(() => {
            var _a;
            const allTasks = (_a = this.kernelDetectionTasks.get(notebookType)) !== null && _a !== void 0 ? _a : [];
            const taskIndex = allTasks.indexOf(task);
            if (taskIndex >= 0) {
                allTasks.splice(taskIndex, 1);
                this.kernelDetectionTasks.set(notebookType, allTasks);
                this.onDidChangeKernelDetectionTasksEmitter.fire(notebookType);
            }
        });
    }
    getKernelDetectionTasks(notebook) {
        var _a;
        return (_a = this.kernelDetectionTasks.get(notebook.viewType)) !== null && _a !== void 0 ? _a : [];
    }
    registerKernelSourceActionProvider(viewType, provider) {
        var _a, _b;
        const providers = (_a = this.kernelSourceActionProviders.get(viewType)) !== null && _a !== void 0 ? _a : [];
        providers.push(provider);
        this.kernelSourceActionProviders.set(viewType, providers);
        this.onDidChangeSourceActionsEmitter.fire({ viewType: viewType });
        const eventEmitterDisposable = (_b = provider.onDidChangeSourceActions) === null || _b === void 0 ? void 0 : _b.call(provider, () => {
            this.onDidChangeSourceActionsEmitter.fire({ viewType: viewType });
        });
        return core_1.Disposable.create(() => {
            var _a;
            const sourceProviders = (_a = this.kernelSourceActionProviders.get(viewType)) !== null && _a !== void 0 ? _a : [];
            const providerIndex = sourceProviders.indexOf(provider);
            if (providerIndex >= 0) {
                sourceProviders.splice(providerIndex, 1);
                this.kernelSourceActionProviders.set(viewType, sourceProviders);
            }
            eventEmitterDisposable === null || eventEmitterDisposable === void 0 ? void 0 : eventEmitterDisposable.dispose();
        });
    }
    async getKernelSourceActionsFromProviders(notebook) {
        var _a;
        const viewType = notebook.viewType;
        const providers = (_a = this.kernelSourceActionProviders.get(viewType)) !== null && _a !== void 0 ? _a : [];
        const promises = providers.map(provider => provider.provideKernelSourceActions());
        const allActions = await Promise.all(promises);
        return allActions.flat();
    }
    dispose() {
        this.onDidChangeKernelDetectionTasksEmitter.dispose();
        this.onDidChangeSourceActionsEmitter.dispose();
        this.onDidAddKernelEmitter.dispose();
        this.onDidRemoveKernelEmitter.dispose();
        this.onDidChangeSelectedNotebookKernelBindingEmitter.dispose();
        this.onDidChangeNotebookAffinityEmitter.dispose();
    }
};
__decorate([
    (0, inversify_1.inject)(notebook_service_1.NotebookService),
    __metadata("design:type", notebook_service_1.NotebookService)
], NotebookKernelService.prototype, "notebookService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.StorageService),
    __metadata("design:type", Object)
], NotebookKernelService.prototype, "storageService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NotebookKernelService.prototype, "init", null);
NotebookKernelService = NotebookKernelService_1 = __decorate([
    (0, inversify_1.injectable)()
], NotebookKernelService);
exports.NotebookKernelService = NotebookKernelService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/notebook/lib/browser/service/notebook-kernel-service'] = this;


/***/ }),

/***/ "../../packages/notebook/lib/browser/service/notebook-model-resolver-service.js":
/*!**************************************************************************************!*\
  !*** ../../packages/notebook/lib/browser/service/notebook-model-resolver-service.js ***!
  \**************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotebookModelResolverService = void 0;
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const file_service_1 = __webpack_require__(/*! @theia/filesystem/lib/browser/file-service */ "../../packages/filesystem/lib/browser/file-service.js");
const common_1 = __webpack_require__(/*! ../../common */ "../../packages/notebook/lib/common/index.js");
const notebook_service_1 = __webpack_require__(/*! ./notebook-service */ "../../packages/notebook/lib/browser/service/notebook-service.js");
const notebook_type_registry_1 = __webpack_require__(/*! ../notebook-type-registry */ "../../packages/notebook/lib/browser/notebook-type-registry.js");
let NotebookModelResolverService = class NotebookModelResolverService {
    constructor() {
        this.onDidChangeDirtyEmitter = new core_1.Emitter();
        this.onDidChangeDirty = this.onDidChangeDirtyEmitter.event;
        this.onDidSaveNotebookEmitter = new core_1.Emitter();
        this.onDidSaveNotebook = this.onDidSaveNotebookEmitter.event;
    }
    async resolve(arg, viewType) {
        var _a, _b;
        let resource;
        // let hasAssociatedFilePath = false;
        if (arg instanceof core_1.URI) {
            resource = arg;
        }
        else {
            arg = arg;
            if (!arg.untitledResource) {
                const notebookTypeInfo = this.notebookTypeRegistry.notebookTypes.find(info => info.type === viewType);
                if (!notebookTypeInfo) {
                    throw new Error('UNKNOWN view type: ' + viewType);
                }
                const suffix = (_b = this.getPossibleFileEndings((_a = notebookTypeInfo.selector) !== null && _a !== void 0 ? _a : [])) !== null && _b !== void 0 ? _b : '';
                for (let counter = 1;; counter++) {
                    const candidate = new core_1.URI()
                        .withScheme('untitled')
                        .withPath(`Untitled-notebook-${counter}${suffix}`)
                        .withQuery(viewType);
                    if (!this.notebookService.getNotebookEditorModel(candidate)) {
                        resource = candidate;
                        break;
                    }
                }
            }
            else if (arg.untitledResource.scheme === 'untitled') {
                resource = arg.untitledResource;
            }
            else {
                resource = arg.untitledResource.withScheme('untitled');
                // hasAssociatedFilePath = true;
            }
        }
        const notebookData = await this.resolveExistingNotebookData(resource, viewType);
        const notebookModel = await this.notebookService.createNotebookModel(notebookData, viewType, resource);
        notebookModel.onDirtyChanged(() => this.onDidChangeDirtyEmitter.fire(notebookModel));
        notebookModel.onDidSaveNotebook(() => this.onDidSaveNotebookEmitter.fire(notebookModel.uri.toComponents()));
        return notebookModel;
    }
    async resolveExistingNotebookData(resource, viewType) {
        if (resource.scheme === 'untitled') {
            return {
                cells: [
                    {
                        cellKind: common_1.CellKind.Markup,
                        language: 'markdown',
                        outputs: [],
                        source: ''
                    }
                ],
                metadata: {}
            };
        }
        else {
            const file = await this.fileService.readFile(resource);
            const dataProvider = await this.notebookService.getNotebookDataProvider(viewType);
            const notebook = await dataProvider.serializer.dataToNotebook(file.value);
            return notebook;
        }
    }
    getPossibleFileEndings(selectors) {
        for (const selector of selectors) {
            const ending = this.possibleFileEnding(selector);
            if (ending) {
                return ending;
            }
        }
        return undefined;
    }
    possibleFileEnding(selector) {
        const pattern = /^.*(\.[a-zA-Z0-9_-]+)$/;
        const candidate = typeof selector === 'string' ? selector : selector.filenamePattern;
        if (candidate) {
            const match = pattern.exec(candidate);
            if (match) {
                return match[1];
            }
        }
        return undefined;
    }
};
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], NotebookModelResolverService.prototype, "fileService", void 0);
__decorate([
    (0, inversify_1.inject)(notebook_service_1.NotebookService),
    __metadata("design:type", notebook_service_1.NotebookService)
], NotebookModelResolverService.prototype, "notebookService", void 0);
__decorate([
    (0, inversify_1.inject)(notebook_type_registry_1.NotebookTypeRegistry),
    __metadata("design:type", notebook_type_registry_1.NotebookTypeRegistry)
], NotebookModelResolverService.prototype, "notebookTypeRegistry", void 0);
NotebookModelResolverService = __decorate([
    (0, inversify_1.injectable)()
], NotebookModelResolverService);
exports.NotebookModelResolverService = NotebookModelResolverService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/notebook/lib/browser/service/notebook-model-resolver-service'] = this;


/***/ }),

/***/ "../../packages/notebook/lib/browser/service/notebook-renderer-messaging-service.js":
/*!******************************************************************************************!*\
  !*** ../../packages/notebook/lib/browser/service/notebook-renderer-messaging-service.js ***!
  \******************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotebookRendererMessagingService = void 0;
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
;
let NotebookRendererMessagingService = class NotebookRendererMessagingService {
    constructor() {
        this.postMessageEmitter = new core_1.Emitter();
        this.onShouldPostMessage = this.postMessageEmitter.event;
        this.activations = new Map();
        this.scopedMessaging = new Map();
    }
    receiveMessage(editorId, rendererId, message) {
        var _a, _b, _c;
        if (editorId === undefined) {
            const sends = [...this.scopedMessaging.values()].map(e => { var _a; return (_a = e.receiveMessageHandler) === null || _a === void 0 ? void 0 : _a.call(e, rendererId, message); });
            return Promise.all(sends).then(values => values.some(value => !!value));
        }
        return (_c = (_b = (_a = this.scopedMessaging.get(editorId)) === null || _a === void 0 ? void 0 : _a.receiveMessageHandler) === null || _b === void 0 ? void 0 : _b.call(_a, rendererId, message)) !== null && _c !== void 0 ? _c : Promise.resolve(false);
    }
    prepare(rendererId) {
        if (this.activations.has(rendererId)) {
            return;
        }
        const queue = [];
        this.activations.set(rendererId, queue);
        // activate renderer
        // this.extensionService.activateByEvent(`onRenderer:${rendererId}`).then(() => {
        //     for (const message of queue) {
        //         this.postMessageEmitter.fire(message);
        //     }
        //     this.activations.set(rendererId, undefined);
        // });
    }
    getScoped(editorId) {
        const existing = this.scopedMessaging.get(editorId);
        if (existing) {
            return existing;
        }
        const messaging = {
            postMessage: (rendererId, message) => this.postMessage(editorId, rendererId, message),
            dispose: () => this.scopedMessaging.delete(editorId),
        };
        this.scopedMessaging.set(editorId, messaging);
        return messaging;
    }
    postMessage(editorId, rendererId, message) {
        if (!this.activations.has(rendererId)) {
            this.prepare(rendererId);
        }
        const activation = this.activations.get(rendererId);
        const toSend = { rendererId, editorId, message };
        if (activation === undefined) {
            this.postMessageEmitter.fire(toSend);
        }
        else {
            activation.push(toSend);
        }
    }
    dispose() {
        this.postMessageEmitter.dispose();
    }
};
NotebookRendererMessagingService = __decorate([
    (0, inversify_1.injectable)()
], NotebookRendererMessagingService);
exports.NotebookRendererMessagingService = NotebookRendererMessagingService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/notebook/lib/browser/service/notebook-renderer-messaging-service'] = this;


/***/ }),

/***/ "../../packages/notebook/lib/browser/service/notebook-service.js":
/*!***********************************************************************!*\
  !*** ../../packages/notebook/lib/browser/service/notebook-service.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotebookService = exports.NotebookProvider = void 0;
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const notebook_model_1 = __webpack_require__(/*! ../view-model/notebook-model */ "../../packages/notebook/lib/browser/view-model/notebook-model.js");
const file_service_1 = __webpack_require__(/*! @theia/filesystem/lib/browser/file-service */ "../../packages/filesystem/lib/browser/file-service.js");
const monaco_text_model_service_1 = __webpack_require__(/*! @theia/monaco/lib/browser/monaco-text-model-service */ "../../packages/monaco/lib/browser/monaco-text-model-service.js");
const notebook_cell_model_1 = __webpack_require__(/*! ../view-model/notebook-cell-model */ "../../packages/notebook/lib/browser/view-model/notebook-cell-model.js");
const promise_util_1 = __webpack_require__(/*! @theia/core/lib/common/promise-util */ "../../packages/core/lib/common/promise-util.js");
exports.NotebookProvider = Symbol('notebook provider');
let NotebookService = class NotebookService {
    constructor() {
        this.notebookSerializerEmitter = new core_1.Emitter();
        this.onNotebookSerializer = this.notebookSerializerEmitter.event;
        this.disposables = new core_1.DisposableCollection();
        this.notebookProviders = new Map();
        this.notebookModels = new Map();
        this.didAddViewTypeEmitter = new core_1.Emitter();
        this.onDidAddViewType = this.didAddViewTypeEmitter.event;
        this.didRemoveViewTypeEmitter = new core_1.Emitter();
        this.onDidRemoveViewType = this.didRemoveViewTypeEmitter.event;
        this.willOpenNotebookTypeEmitter = new core_1.Emitter();
        this.onWillOpenNotebook = this.willOpenNotebookTypeEmitter.event;
        this.willAddNotebookDocumentEmitter = new core_1.Emitter();
        this.onWillAddNotebookDocument = this.willAddNotebookDocumentEmitter.event;
        this.didAddNotebookDocumentEmitter = new core_1.Emitter();
        this.onDidAddNotebookDocument = this.didAddNotebookDocumentEmitter.event;
        this.willRemoveNotebookDocumentEmitter = new core_1.Emitter();
        this.onWillRemoveNotebookDocument = this.willRemoveNotebookDocumentEmitter.event;
        this.didRemoveNotebookDocumentEmitter = new core_1.Emitter();
        this.onDidRemoveNotebookDocument = this.didRemoveNotebookDocumentEmitter.event;
        this.ready = new promise_util_1.Deferred();
    }
    dispose() {
        this.disposables.dispose();
    }
    /**
     * Marks the notebook service as ready. From this point on, the service will start dispatching the `onNotebookSerializer` event.
     */
    markReady() {
        this.ready.resolve();
    }
    registerNotebookSerializer(notebookType, extensionData, serializer) {
        if (this.notebookProviders.has(notebookType)) {
            throw new Error(`notebook provider for viewtype '${notebookType}' already exists`);
        }
        this.notebookProviders.set(notebookType, { notebookType: notebookType, serializer, extensionData });
        this.didAddViewTypeEmitter.fire(notebookType);
        return core_1.Disposable.create(() => {
            this.notebookProviders.delete(notebookType);
            this.didRemoveViewTypeEmitter.fire(notebookType);
        });
    }
    async createNotebookModel(data, viewType, uri) {
        var _a;
        const serializer = (_a = this.notebookProviders.get(viewType)) === null || _a === void 0 ? void 0 : _a.serializer;
        if (!serializer) {
            throw new Error('no notebook serializer for ' + viewType);
        }
        this.willAddNotebookDocumentEmitter.fire(uri);
        const model = this.notebookModelFactory({ data, uri, viewType, serializer });
        this.notebookModels.set(uri.toString(), model);
        // Resolve cell text models right after creating the notebook model
        // This ensures that all text models are available in the plugin host
        await Promise.all(model.cells.map(e => e.resolveTextModel()));
        this.didAddNotebookDocumentEmitter.fire(model);
        return model;
    }
    async getNotebookDataProvider(viewType) {
        await this.ready.promise;
        await this.notebookSerializerEmitter.sequence(async (listener) => listener(`onNotebookSerializer:${viewType}`));
        const result = await this.waitForNotebookProvider(viewType);
        if (!result) {
            throw new Error(`No provider registered for view type: '${viewType}'`);
        }
        return result;
    }
    /**
     * When the application starts up, notebook providers from plugins are not registered yet.
     * It takes a few seconds for the plugin host to start so that notebook data providers can be registered.
     * This methods waits until the notebook provider is registered.
     */
    async waitForNotebookProvider(type) {
        if (this.notebookProviders.has(type)) {
            return this.notebookProviders.get(type);
        }
        const deferred = new promise_util_1.Deferred();
        // 20 seconds of timeout
        const timeoutDuration = 20000;
        const disposable = this.onDidAddViewType(viewType => {
            if (viewType === type) {
                clearTimeout(timeout);
                disposable.dispose();
                deferred.resolve(this.notebookProviders.get(type));
            }
        });
        const timeout = setTimeout(() => {
            clearTimeout(timeout);
            disposable.dispose();
            deferred.reject();
        }, timeoutDuration);
        return deferred.promise;
    }
    getNotebookEditorModel(uri) {
        return this.notebookModels.get(uri.toString());
    }
    getNotebookModels() {
        return this.notebookModels.values();
    }
    async willOpenNotebook(type) {
        return this.willOpenNotebookTypeEmitter.sequence(async (listener) => listener(type));
    }
    listNotebookDocuments() {
        return [...this.notebookModels.values()];
    }
};
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], NotebookService.prototype, "fileService", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_text_model_service_1.MonacoTextModelService),
    __metadata("design:type", monaco_text_model_service_1.MonacoTextModelService)
], NotebookService.prototype, "modelService", void 0);
__decorate([
    (0, inversify_1.inject)(notebook_model_1.NotebookModelFactory),
    __metadata("design:type", Function)
], NotebookService.prototype, "notebookModelFactory", void 0);
__decorate([
    (0, inversify_1.inject)(notebook_cell_model_1.NotebookCellModelFactory),
    __metadata("design:type", Function)
], NotebookService.prototype, "notebookCellModelFactory", void 0);
NotebookService = __decorate([
    (0, inversify_1.injectable)()
], NotebookService);
exports.NotebookService = NotebookService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/notebook/lib/browser/service/notebook-service'] = this;


/***/ }),

/***/ "../../packages/notebook/lib/browser/view-model/notebook-cell-model.js":
/*!*****************************************************************************!*\
  !*** ../../packages/notebook/lib/browser/view-model/notebook-cell-model.js ***!
  \*****************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotebookCellModel = exports.createNotebookCellModelContainer = exports.NotebookCellModelFactory = void 0;
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const monaco_text_model_service_1 = __webpack_require__(/*! @theia/monaco/lib/browser/monaco-text-model-service */ "../../packages/monaco/lib/browser/monaco-text-model-service.js");
const notebook_cell_output_model_1 = __webpack_require__(/*! ./notebook-cell-output-model */ "../../packages/notebook/lib/browser/view-model/notebook-cell-output-model.js");
exports.NotebookCellModelFactory = Symbol('NotebookModelFactory');
function createNotebookCellModelContainer(parent, props, notebookCellContextManager) {
    const child = parent.createChild();
    child.bind(NotebookCellModelProps).toConstantValue(props);
    // We need the constructor as property here to avoid circular dependencies for the context manager
    child.bind(NotebookCellContextManager).to(notebookCellContextManager).inSingletonScope();
    child.bind(NotebookCellModel).toSelf();
    return child;
}
exports.createNotebookCellModelContainer = createNotebookCellModelContainer;
const NotebookCellContextManager = Symbol('NotebookCellContextManager');
const NotebookCellModelProps = Symbol('NotebookModelProps');
let NotebookCellModel = class NotebookCellModel {
    constructor() {
        this.onDidChangeOutputsEmitter = new core_1.Emitter();
        this.onDidChangeOutputs = this.onDidChangeOutputsEmitter.event;
        this.onDidChangeOutputItemsEmitter = new core_1.Emitter();
        this.onDidChangeOutputItems = this.onDidChangeOutputItemsEmitter.event;
        this.onDidChangeContentEmitter = new core_1.Emitter();
        this.onDidChangeContent = this.onDidChangeContentEmitter.event;
        this.onDidChangeMetadataEmitter = new core_1.Emitter();
        this.onDidChangeMetadata = this.onDidChangeMetadataEmitter.event;
        this.onDidChangeInternalMetadataEmitter = new core_1.Emitter();
        this.onDidChangeInternalMetadata = this.onDidChangeInternalMetadataEmitter.event;
        this.onDidChangeLanguageEmitter = new core_1.Emitter();
        this.onDidChangeLanguage = this.onDidChangeLanguageEmitter.event;
        this.onDidRequestCellEditChangeEmitter = new core_1.Emitter();
        this.onDidRequestCellEditChange = this.onDidRequestCellEditChangeEmitter.event;
        this.toDispose = new core_1.DisposableCollection();
    }
    get outputs() {
        return this._outputs;
    }
    get metadata() {
        return this._metadata;
    }
    get internalMetadata() {
        return this._internalMetadata;
    }
    set internalMetadata(newInternalMetadata) {
        const lastRunSuccessChanged = this._internalMetadata.lastRunSuccess !== newInternalMetadata.lastRunSuccess;
        newInternalMetadata = {
            ...newInternalMetadata,
            ...{ runStartTimeAdjustment: computeRunStartTimeAdjustment(this._internalMetadata, newInternalMetadata) }
        };
        this._internalMetadata = newInternalMetadata;
        this.onDidChangeInternalMetadataEmitter.fire({ lastRunSuccessChanged });
    }
    get context() {
        return this.htmlContext;
    }
    get textBuffer() {
        return this.textModel ? this.textModel.getText() : this.source;
    }
    get source() {
        return this.props.source;
    }
    set source(source) {
        this.props.source = source;
    }
    get language() {
        return this.props.language;
    }
    set language(newLanguage) {
        if (this.language === newLanguage) {
            return;
        }
        this.props.language = newLanguage;
        if (this.textModel) {
            this.textModel.setLanguageId(newLanguage);
        }
        this.language = newLanguage;
        this.onDidChangeLanguageEmitter.fire(newLanguage);
        this.onDidChangeContentEmitter.fire('language');
    }
    get uri() {
        return this.props.uri;
    }
    get handle() {
        return this.props.handle;
    }
    get cellKind() {
        return this.props.cellKind;
    }
    init() {
        var _a, _b;
        this._outputs = this.props.outputs.map(op => new notebook_cell_output_model_1.NotebookCellOutputModel(op));
        this._metadata = (_a = this.props.metadata) !== null && _a !== void 0 ? _a : {};
        this._internalMetadata = (_b = this.props.internalMetadata) !== null && _b !== void 0 ? _b : {};
    }
    refChanged(node) {
        if (node) {
            this.htmlContext = node;
            this.notebookCellContextManager.updateCellContext(this, node);
        }
    }
    dispose() {
        this.onDidChangeOutputsEmitter.dispose();
        this.onDidChangeOutputItemsEmitter.dispose();
        this.onDidChangeContentEmitter.dispose();
        this.onDidChangeMetadataEmitter.dispose();
        this.onDidChangeInternalMetadataEmitter.dispose();
        this.onDidChangeLanguageEmitter.dispose();
        this.notebookCellContextManager.dispose();
        this.textModel.dispose();
        this.toDispose.dispose();
    }
    requestEdit() {
        this.onDidRequestCellEditChangeEmitter.fire(true);
    }
    requestStopEdit() {
        this.onDidRequestCellEditChangeEmitter.fire(false);
    }
    spliceNotebookCellOutputs(splice) {
        if (splice.deleteCount > 0 && splice.newOutputs.length > 0) {
            const commonLen = Math.min(splice.deleteCount, splice.newOutputs.length);
            // update
            for (let i = 0; i < commonLen; i++) {
                const currentOutput = this.outputs[splice.start + i];
                const newOutput = splice.newOutputs[i];
                this.replaceOutputItems(currentOutput.outputId, newOutput);
            }
            this.outputs.splice(splice.start + commonLen, splice.deleteCount - commonLen, ...splice.newOutputs.slice(commonLen).map(op => new notebook_cell_output_model_1.NotebookCellOutputModel(op)));
            this.onDidChangeOutputsEmitter.fire({ start: splice.start + commonLen, deleteCount: splice.deleteCount - commonLen, newOutputs: splice.newOutputs.slice(commonLen) });
        }
        else {
            this.outputs.splice(splice.start, splice.deleteCount, ...splice.newOutputs.map(op => new notebook_cell_output_model_1.NotebookCellOutputModel(op)));
            this.onDidChangeOutputsEmitter.fire(splice);
        }
    }
    replaceOutputItems(outputId, newOutputItem) {
        const output = this.outputs.find(out => out.outputId === outputId);
        if (!output) {
            return false;
        }
        output.replaceData(newOutputItem);
        this.onDidChangeOutputItemsEmitter.fire();
        return true;
    }
    getData() {
        return {
            cellKind: this.cellKind,
            language: this.language,
            outputs: this.outputs.map(output => output.getData()),
            source: this.textBuffer,
            collapseState: this.props.collapseState,
            internalMetadata: this.internalMetadata,
            metadata: this.metadata
        };
    }
    async resolveTextModel() {
        if (this.textModel) {
            return this.textModel;
        }
        const ref = await this.textModelService.createModelReference(this.uri);
        this.textModel = ref.object;
        return ref.object;
    }
};
__decorate([
    (0, inversify_1.inject)(NotebookCellContextManager),
    __metadata("design:type", Object)
], NotebookCellModel.prototype, "notebookCellContextManager", void 0);
__decorate([
    (0, inversify_1.inject)(NotebookCellModelProps),
    __metadata("design:type", Object)
], NotebookCellModel.prototype, "props", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_text_model_service_1.MonacoTextModelService),
    __metadata("design:type", monaco_text_model_service_1.MonacoTextModelService)
], NotebookCellModel.prototype, "textModelService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NotebookCellModel.prototype, "init", null);
NotebookCellModel = __decorate([
    (0, inversify_1.injectable)()
], NotebookCellModel);
exports.NotebookCellModel = NotebookCellModel;
function computeRunStartTimeAdjustment(oldMetadata, newMetadata) {
    if (oldMetadata.runStartTime !== newMetadata.runStartTime && typeof newMetadata.runStartTime === 'number') {
        const offset = Date.now() - newMetadata.runStartTime;
        return offset < 0 ? Math.abs(offset) : 0;
    }
    else {
        return newMetadata.runStartTimeAdjustment;
    }
}

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/notebook/lib/browser/view-model/notebook-cell-model'] = this;


/***/ }),

/***/ "../../packages/notebook/lib/browser/view-model/notebook-cell-output-model.js":
/*!************************************************************************************!*\
  !*** ../../packages/notebook/lib/browser/view-model/notebook-cell-output-model.js ***!
  \************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotebookCellOutputModel = void 0;
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
class NotebookCellOutputModel {
    constructor(rawOutput) {
        this.rawOutput = rawOutput;
        this.didChangeDataEmitter = new core_1.Emitter();
        this.onDidChangeData = this.didChangeDataEmitter.event;
        this.requestOutputPresentationChangeEmitter = new core_1.Emitter();
        this.onRequestOutputPresentationChange = this.requestOutputPresentationChangeEmitter.event;
    }
    get outputId() {
        return this.rawOutput.outputId;
    }
    get outputs() {
        return this.rawOutput.outputs || [];
    }
    get metadata() {
        return this.rawOutput.metadata;
    }
    replaceData(rawData) {
        this.rawOutput = rawData;
        this.didChangeDataEmitter.fire();
    }
    appendData(items) {
        this.rawOutput.outputs.push(...items);
        this.didChangeDataEmitter.fire();
    }
    dispose() {
        this.didChangeDataEmitter.dispose();
        this.requestOutputPresentationChangeEmitter.dispose();
    }
    requestOutputPresentationUpdate() {
        this.requestOutputPresentationChangeEmitter.fire();
    }
    getData() {
        return {
            outputs: this.outputs,
            metadata: this.metadata,
            outputId: this.outputId
        };
    }
}
exports.NotebookCellOutputModel = NotebookCellOutputModel;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/notebook/lib/browser/view-model/notebook-cell-output-model'] = this;


/***/ }),

/***/ "../../packages/notebook/lib/browser/view-model/notebook-model.js":
/*!************************************************************************!*\
  !*** ../../packages/notebook/lib/browser/view-model/notebook-model.js ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 20023 Typefox and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotebookModel = exports.createNotebookModelContainer = exports.NotebookModelFactory = void 0;
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const common_1 = __webpack_require__(/*! ../../common */ "../../packages/notebook/lib/common/index.js");
const file_service_1 = __webpack_require__(/*! @theia/filesystem/lib/browser/file-service */ "../../packages/filesystem/lib/browser/file-service.js");
const notebook_cell_model_1 = __webpack_require__(/*! ./notebook-cell-model */ "../../packages/notebook/lib/browser/view-model/notebook-cell-model.js");
const monaco_text_model_service_1 = __webpack_require__(/*! @theia/monaco/lib/browser/monaco-text-model-service */ "../../packages/monaco/lib/browser/monaco-text-model-service.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const undo_redo_service_1 = __webpack_require__(/*! @theia/editor/lib/browser/undo-redo-service */ "../../packages/editor/lib/browser/undo-redo-service.js");
exports.NotebookModelFactory = Symbol('NotebookModelFactory');
function createNotebookModelContainer(parent, props) {
    const child = parent.createChild();
    child.bind(NotebookModelProps).toConstantValue(props);
    child.bind(NotebookModel).toSelf();
    return child;
}
exports.createNotebookModelContainer = createNotebookModelContainer;
const NotebookModelProps = Symbol('NotebookModelProps');
let NotebookModel = class NotebookModel {
    constructor(props, modelService, cellModelFactory) {
        this.props = props;
        this.cellModelFactory = cellModelFactory;
        this.onDirtyChangedEmitter = new core_1.Emitter();
        this.onDirtyChanged = this.onDirtyChangedEmitter.event;
        this.onDidSaveNotebookEmitter = new core_1.Emitter();
        this.onDidSaveNotebook = this.onDidSaveNotebookEmitter.event;
        this.onDidAddOrRemoveCellEmitter = new core_1.Emitter();
        this.onDidAddOrRemoveCell = this.onDidAddOrRemoveCellEmitter.event;
        this.onDidChangeContentEmitter = new core_1.Emitter();
        this.onDidChangeContent = this.onDidChangeContentEmitter.event;
        this.nextHandle = 0;
        this.dirtyCells = [];
        this.metadata = {};
        this.dirty = false;
        this.cells = props.data.cells.map((cell, index) => cellModelFactory({
            uri: common_1.CellUri.generate(props.uri, index),
            handle: index,
            source: cell.source,
            language: cell.language,
            cellKind: cell.cellKind,
            outputs: cell.outputs,
            metadata: cell.metadata,
            internalMetadata: cell.internalMetadata,
            collapseState: cell.collapseState
        }));
        this.addCellOutputListeners(this.cells);
        this.metadata = this.metadata;
        modelService.onDidCreate(editorModel => {
            const modelUri = new core_1.URI(editorModel.uri);
            if (modelUri.scheme === common_1.CellUri.scheme) {
                const cellUri = common_1.CellUri.parse(modelUri);
                if (cellUri && cellUri.notebook.isEqual(this.uri)) {
                    const cell = this.cells.find(c => c.handle === cellUri.handle);
                    if (cell) {
                        cell.textModel = editorModel;
                    }
                }
            }
        });
        this.nextHandle = this.cells.length;
    }
    get uri() {
        return this.props.uri;
    }
    get viewType() {
        return this.props.viewType;
    }
    dispose() {
        this.onDirtyChangedEmitter.dispose();
        this.onDidSaveNotebookEmitter.dispose();
        this.onDidAddOrRemoveCellEmitter.dispose();
        this.onDidChangeContentEmitter.dispose();
        this.cells.forEach(cell => cell.dispose());
    }
    async save(options) {
        this.dirtyCells = [];
        this.dirty = false;
        this.onDirtyChangedEmitter.fire();
        const serializedNotebook = await this.props.serializer.notebookToData({
            cells: this.cells.map(cell => cell.getData()),
            metadata: this.metadata
        });
        this.fileService.writeFile(this.uri, serializedNotebook);
        this.onDidSaveNotebookEmitter.fire();
    }
    createSnapshot() {
        const model = this;
        return {
            read() {
                return JSON.stringify({
                    cells: model.cells.map(cell => cell.getData()),
                    metadata: model.metadata
                });
            }
        };
    }
    async revert(options) {
        this.dirty = false;
        this.onDirtyChangedEmitter.fire();
    }
    isDirty() {
        return this.dirty;
    }
    cellDirtyChanged(cell, dirtyState) {
        if (dirtyState) {
            this.dirtyCells.push(cell);
        }
        else {
            this.dirtyCells.splice(this.dirtyCells.indexOf(cell), 1);
        }
        const oldDirtyState = this.dirty;
        this.dirty = this.dirtyCells.length > 0;
        if (this.dirty !== oldDirtyState) {
            this.onDirtyChangedEmitter.fire();
        }
    }
    undo() {
        // TODO we probably need to check if a monaco editor is focused and if so, not undo
        this.undoRedoService.undo(this.uri);
    }
    redo() {
        // TODO see undo
        this.undoRedoService.redo(this.uri);
    }
    setSelectedCell(cell) {
        this.selectedCell = cell;
    }
    addCellOutputListeners(cells) {
        for (const cell of cells) {
            cell.onDidChangeOutputs(() => {
                this.dirty = true;
                this.onDirtyChangedEmitter.fire();
            });
        }
    }
    applyEdits(rawEdits, computeUndoRedo) {
        const editsWithDetails = rawEdits.map((edit, index) => {
            let cellIndex = -1;
            if ('index' in edit) {
                cellIndex = edit.index;
            }
            else if ('handle' in edit) {
                cellIndex = this.getCellIndexByHandle(edit.handle);
            }
            return {
                edit,
                cellIndex,
                end: edit.editType === 1 /* Replace */ ? edit.index + edit.count : cellIndex,
                originalIndex: index
            };
        }).filter(edit => !!edit);
        for (const { edit, cellIndex } of editsWithDetails) {
            const cell = this.cells[cellIndex];
            if (cell) {
                this.cellDirtyChanged(cell, true);
            }
            switch (edit.editType) {
                case 1 /* Replace */:
                    this.replaceCells(edit.index, edit.count, edit.cells, computeUndoRedo);
                    break;
                case 2 /* Output */: {
                    if (edit.append) {
                        cell.spliceNotebookCellOutputs({ deleteCount: 0, newOutputs: edit.outputs, start: cell.outputs.length });
                    }
                    else {
                        // could definitely be more efficient. See vscode __spliceNotebookCellOutputs2
                        // For now, just replace the whole existing output with the new output
                        cell.spliceNotebookCellOutputs({ start: 0, deleteCount: cell.outputs.length, newOutputs: edit.outputs });
                    }
                    break;
                }
                case 7 /* OutputItems */:
                    break;
                case 3 /* Metadata */:
                    this.updateNotebookMetadata(edit.metadata, computeUndoRedo);
                    break;
                case 9 /* PartialInternalMetadata */:
                    this.changeCellInternalMetadataPartial(this.cells[cellIndex], edit.internalMetadata);
                    break;
                case 4 /* CellLanguage */:
                    this.changeCellLanguage(this.cells[cellIndex], edit.language, computeUndoRedo);
                    break;
                case 5 /* DocumentMetadata */:
                    break;
                case 6 /* Move */:
                    this.moveCellToIndex(cellIndex, edit.length, edit.newIdx, computeUndoRedo);
                    break;
            }
        }
    }
    replaceCells(start, deleteCount, newCells, computeUndoRedo) {
        const cells = newCells.map(cell => {
            const handle = this.nextHandle++;
            return this.cellModelFactory({
                uri: common_1.CellUri.generate(this.uri, handle),
                handle: handle,
                source: cell.source,
                language: cell.language,
                cellKind: cell.cellKind,
                outputs: cell.outputs,
                metadata: cell.metadata,
                internalMetadata: cell.internalMetadata,
                collapseState: cell.collapseState
            });
        });
        this.addCellOutputListeners(cells);
        const changes = [[start, deleteCount, cells]];
        const deletedCells = this.cells.splice(start, deleteCount, ...cells);
        for (const cell of deletedCells) {
            cell.dispose();
        }
        if (computeUndoRedo) {
            this.undoRedoService.pushElement(this.uri, async () => this.replaceCells(start, newCells.length, deletedCells.map(cell => cell.getData()), false), async () => this.replaceCells(start, deleteCount, newCells, false));
        }
        this.onDidAddOrRemoveCellEmitter.fire({ rawEvent: { kind: common_1.NotebookCellsChangeType.ModelChange, changes } });
        this.onDidChangeContentEmitter.fire({ rawEvents: [{ kind: common_1.NotebookCellsChangeType.ModelChange, changes }] });
    }
    changeCellInternalMetadataPartial(cell, internalMetadata) {
        var _a;
        const newInternalMetadata = {
            ...cell.internalMetadata
        };
        let k;
        // eslint-disable-next-line guard-for-in
        for (k in internalMetadata) {
            newInternalMetadata[k] = ((_a = internalMetadata[k]) !== null && _a !== void 0 ? _a : undefined);
        }
        cell.internalMetadata = newInternalMetadata;
        this.onDidChangeContentEmitter.fire({
            rawEvents: [
                { kind: common_1.NotebookCellsChangeType.ChangeCellInternalMetadata, index: this.cells.indexOf(cell), internalMetadata: newInternalMetadata }
            ]
        });
    }
    updateNotebookMetadata(metadata, computeUndoRedo) {
        const oldMetadata = this.metadata;
        if (computeUndoRedo) {
            this.undoRedoService.pushElement(this.uri, async () => this.updateNotebookMetadata(oldMetadata, false), async () => this.updateNotebookMetadata(metadata, false));
        }
        this.metadata = metadata;
        this.onDidChangeContentEmitter.fire({
            rawEvents: [{ kind: common_1.NotebookCellsChangeType.ChangeDocumentMetadata, metadata: this.metadata }],
            synchronous: true,
        });
    }
    changeCellLanguage(cell, languageId, computeUndoRedo) {
        if (cell.language === languageId) {
            return;
        }
        cell.language = languageId;
        this.onDidChangeContentEmitter.fire({
            rawEvents: [{ kind: common_1.NotebookCellsChangeType.ChangeCellLanguage, index: this.cells.indexOf(cell), language: languageId }],
            synchronous: true,
        });
    }
    moveCellToIndex(fromIndex, length, toIndex, computeUndoRedo) {
        if (computeUndoRedo) {
            this.undoRedoService.pushElement(this.uri, async () => { this.moveCellToIndex(toIndex, length, fromIndex, false); }, async () => { this.moveCellToIndex(fromIndex, length, toIndex, false); });
        }
        const cells = this.cells.splice(fromIndex, length);
        this.cells.splice(toIndex, 0, ...cells);
        this.onDidChangeContentEmitter.fire({
            rawEvents: [{ kind: common_1.NotebookCellsChangeType.Move, index: fromIndex, length, newIdx: toIndex, cells }],
        });
        return true;
    }
    getCellIndexByHandle(handle) {
        return this.cells.findIndex(c => c.handle === handle);
    }
};
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], NotebookModel.prototype, "fileService", void 0);
__decorate([
    (0, inversify_1.inject)(undo_redo_service_1.UndoRedoService),
    __metadata("design:type", undo_redo_service_1.UndoRedoService)
], NotebookModel.prototype, "undoRedoService", void 0);
NotebookModel = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(NotebookModelProps)),
    __param(1, (0, inversify_1.inject)(monaco_text_model_service_1.MonacoTextModelService)),
    __param(2, (0, inversify_1.inject)(notebook_cell_model_1.NotebookCellModelFactory)),
    __metadata("design:paramtypes", [Object, monaco_text_model_service_1.MonacoTextModelService, Function])
], NotebookModel);
exports.NotebookModel = NotebookModel;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/notebook/lib/browser/view-model/notebook-model'] = this;


/***/ }),

/***/ "../../packages/notebook/lib/browser/view/notebook-cell-editor.js":
/*!************************************************************************!*\
  !*** ../../packages/notebook/lib/browser/view/notebook-cell-editor.js ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CellEditor = void 0;
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const monaco_code_editor_1 = __webpack_require__(/*! @theia/monaco/lib/browser/monaco-code-editor */ "../../packages/monaco/lib/browser/monaco-code-editor.js");
const monaco_editor_provider_1 = __webpack_require__(/*! @theia/monaco/lib/browser/monaco-editor-provider */ "../../packages/monaco/lib/browser/monaco-editor-provider.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const DEFAULT_EDITOR_OPTIONS = {
    ...monaco_editor_provider_1.MonacoEditorProvider.inlineOptions,
    minHeight: -1,
    maxHeight: -1,
    scrollbar: {
        ...monaco_editor_provider_1.MonacoEditorProvider.inlineOptions.scrollbar,
        alwaysConsumeMouseWheel: false
    }
};
class CellEditor extends React.Component {
    constructor() {
        super(...arguments);
        this.toDispose = new core_1.DisposableCollection();
        this.assignRef = (component) => {
            this.container = component;
        };
        this.handleResize = () => {
            var _a;
            (_a = this.editor) === null || _a === void 0 ? void 0 : _a.refresh();
        };
    }
    componentDidMount() {
        this.disposeEditor();
        this.initEditor();
    }
    componentWillUnmount() {
        this.disposeEditor();
    }
    disposeEditor() {
        this.toDispose.dispose();
        this.toDispose = new core_1.DisposableCollection();
    }
    async initEditor() {
        const { cell, notebookModel, monacoServices } = this.props;
        if (this.container) {
            const editorNode = this.container;
            const editorModel = await cell.resolveTextModel();
            const uri = cell.uri;
            this.editor = new monaco_code_editor_1.MonacoCodeEditor(uri, editorModel, editorNode, monacoServices, DEFAULT_EDITOR_OPTIONS);
            this.toDispose.push(this.editor);
            this.editor.setLanguage(cell.language);
            this.toDispose.push(this.editor.getControl().onDidContentSizeChange(() => {
                editorNode.style.height = this.editor.getControl().getContentHeight() + 7 + 'px';
                this.editor.setSize({ width: -1, height: this.editor.getControl().getContentHeight() });
            }));
            this.toDispose.push(this.editor.onDocumentContentChanged(e => {
                notebookModel.cellDirtyChanged(cell, true);
                cell.source = e.document.getText();
            }));
        }
    }
    render() {
        return React.createElement("div", { className: 'theia-notebook-cell-editor', onResize: this.handleResize, id: this.props.cell.uri.toString(), ref: this.assignRef });
    }
}
exports.CellEditor = CellEditor;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/notebook/lib/browser/view/notebook-cell-editor'] = this;


/***/ }),

/***/ "../../packages/notebook/lib/browser/view/notebook-cell-list-view.js":
/*!***************************************************************************!*\
  !*** ../../packages/notebook/lib/browser/view/notebook-cell-list-view.js ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotebookCellDivider = exports.NotebookCellListView = void 0;
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
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const common_1 = __webpack_require__(/*! ../../common */ "../../packages/notebook/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const notebook_actions_contribution_1 = __webpack_require__(/*! ../contributions/notebook-actions-contribution */ "../../packages/notebook/lib/browser/contributions/notebook-actions-contribution.js");
const notebook_cell_actions_contribution_1 = __webpack_require__(/*! ../contributions/notebook-cell-actions-contribution */ "../../packages/notebook/lib/browser/contributions/notebook-cell-actions-contribution.js");
class NotebookCellListView extends React.Component {
    constructor(props) {
        super(props);
        this.toDispose = new core_1.DisposableCollection();
        this.state = { selectedCell: undefined, dragOverIndicator: undefined };
        this.toDispose.push(props.notebookModel.onDidAddOrRemoveCell(e => {
            this.setState({ selectedCell: undefined });
        }));
    }
    componentWillUnmount() {
        this.toDispose.dispose();
    }
    render() {
        return React.createElement("ul", { className: 'theia-notebook-cell-list' },
            this.props.notebookModel.cells
                .map((cell, index) => React.createElement(React.Fragment, { key: 'cell-' + cell.handle },
                React.createElement(NotebookCellDivider, { onAddNewCell: (kind) => this.onAddNewCell(kind, index), onDrop: e => this.onDrop(e, index), onDragOver: e => this.onDragOver(e, cell, 'top') }),
                this.shouldRenderDragOverIndicator(cell, 'top') && React.createElement(CellDropIndicator, null),
                React.createElement("li", { className: 'theia-notebook-cell' + (this.state.selectedCell === cell ? ' focused' : ''), onClick: () => {
                        this.setState({ selectedCell: cell });
                        this.props.notebookModel.setSelectedCell(cell);
                    }, onDragStart: e => this.onDragStart(e, index), onDragOver: e => this.onDragOver(e, cell), onDrop: e => this.onDrop(e, index), draggable: true, ref: (node) => cell.refChanged(node) },
                    React.createElement("div", { className: 'theia-notebook-cell-marker' + (this.state.selectedCell === cell ? ' theia-notebook-cell-marker-selected' : '') }),
                    React.createElement("div", { className: 'theia-notebook-cell-content' }, this.renderCellContent(cell, index)),
                    this.state.selectedCell === cell &&
                        this.props.toolbarRenderer.renderCellToolbar(notebook_cell_actions_contribution_1.NotebookCellActionContribution.ACTION_MENU, this.props.notebookModel, cell)),
                this.shouldRenderDragOverIndicator(cell, 'bottom') && React.createElement(CellDropIndicator, null))),
            React.createElement(NotebookCellDivider, { onAddNewCell: (kind) => this.onAddNewCell(kind, this.props.notebookModel.cells.length), onDrop: e => this.onDrop(e, this.props.notebookModel.cells.length - 1), onDragOver: e => this.onDragOver(e, this.props.notebookModel.cells[this.props.notebookModel.cells.length - 1], 'bottom') }));
    }
    renderCellContent(cell, index) {
        const renderer = this.props.renderers.get(cell.cellKind);
        if (!renderer) {
            throw new Error(`No renderer found for cell type ${cell.cellKind}`);
        }
        return renderer.render(this.props.notebookModel, cell, index);
    }
    onDragStart(event, index) {
        event.stopPropagation();
        event.dataTransfer.setData('text/notebook-cell-index', index.toString());
    }
    onDragOver(event, cell, position) {
        event.preventDefault();
        event.stopPropagation();
        // show indicator
        this.setState({ ...this.state, dragOverIndicator: { cell, position: (position !== null && position !== void 0 ? position : event.nativeEvent.offsetY < event.currentTarget.clientHeight / 2) ? 'top' : 'bottom' } });
    }
    onDrop(event, dropElementIndex) {
        var _a;
        const index = parseInt(event.dataTransfer.getData('text/notebook-cell-index'));
        const isTargetBelow = index < dropElementIndex;
        let newIdx = ((_a = this.state.dragOverIndicator) === null || _a === void 0 ? void 0 : _a.position) === 'top' ? dropElementIndex : dropElementIndex + 1;
        newIdx = isTargetBelow ? newIdx - 1 : newIdx;
        if (index !== undefined && index !== dropElementIndex) {
            this.props.notebookModel.applyEdits([{
                    editType: 6 /* Move */,
                    length: 1,
                    index,
                    newIdx
                }], true);
        }
        this.setState({ ...this.state, dragOverIndicator: undefined });
    }
    onAddNewCell(kind, index) {
        this.props.commandRegistry.executeCommand(notebook_actions_contribution_1.NotebookCommands.ADD_NEW_CELL_COMMAND.id, this.props.notebookModel, kind, index);
    }
    shouldRenderDragOverIndicator(cell, position) {
        return this.state.dragOverIndicator !== undefined &&
            this.state.dragOverIndicator.cell === cell &&
            this.state.dragOverIndicator.position === position;
    }
}
exports.NotebookCellListView = NotebookCellListView;
function NotebookCellDivider({ onAddNewCell, onDrop, onDragOver }) {
    const [hover, setHover] = React.useState(false);
    return React.createElement("li", { className: 'theia-notebook-cell-divider', onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false), onDrop: onDrop, onDragOver: onDragOver }, hover && React.createElement("div", { className: 'theia-notebook-add-cell-buttons' },
        React.createElement("button", { className: 'theia-notebook-add-cell-button', onClick: () => onAddNewCell(common_1.CellKind.Code), title: core_1.nls.localizeByDefault('Add Code Cell') },
            React.createElement("div", { className: (0, browser_1.codicon)('add') + ' theia-notebook-add-cell-button-icon' }),
            core_1.nls.localizeByDefault('Code')),
        React.createElement("button", { className: 'theia-notebook-add-cell-button', onClick: () => onAddNewCell(common_1.CellKind.Markup), title: core_1.nls.localizeByDefault('Add Markdown Cell') },
            React.createElement("div", { className: (0, browser_1.codicon)('add') + ' theia-notebook-add-cell-button-icon' }),
            core_1.nls.localizeByDefault('Markdown'))));
}
exports.NotebookCellDivider = NotebookCellDivider;
function CellDropIndicator() {
    return React.createElement("div", { className: 'theia-notebook-cell-drop-indicator' });
}

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/notebook/lib/browser/view/notebook-cell-list-view'] = this;


/***/ }),

/***/ "../../packages/notebook/lib/browser/view/notebook-cell-toolbar-factory.js":
/*!*********************************************************************************!*\
  !*** ../../packages/notebook/lib/browser/view/notebook-cell-toolbar-factory.js ***!
  \*********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotebookCellToolbarFactory = void 0;
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const context_key_service_1 = __webpack_require__(/*! @theia/core/lib/browser/context-key-service */ "../../packages/core/lib/browser/context-key-service.js");
const notebook_cell_toolbar_1 = __webpack_require__(/*! ./notebook-cell-toolbar */ "../../packages/notebook/lib/browser/view/notebook-cell-toolbar.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
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

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/notebook/lib/browser/view/notebook-cell-toolbar-factory'] = this;


/***/ }),

/***/ "../../packages/notebook/lib/browser/view/notebook-cell-toolbar.js":
/*!*************************************************************************!*\
  !*** ../../packages/notebook/lib/browser/view/notebook-cell-toolbar.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotebookCellSidebar = exports.NotebookCellToolbar = void 0;
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
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
class NotebookCellActionItems extends React.Component {
    constructor(props) {
        super(props);
        this.toDispose = new core_1.DisposableCollection();
        this.toDispose.push(props.onContextKeysChanged(e => {
            this.setState({ inlineItems: this.props.getMenuItems() });
        }));
        this.state = { inlineItems: this.props.getMenuItems() };
    }
    componentWillUnmount() {
        this.toDispose.dispose();
    }
    renderItem(item) {
        return React.createElement("div", { key: item.id, title: item.label, onClick: item.onClick, className: `${item.icon} ${browser_1.ACTION_ITEM} theia-notebook-cell-toolbar-item` });
    }
}
class NotebookCellToolbar extends NotebookCellActionItems {
    render() {
        return React.createElement("div", { className: 'theia-notebook-cell-toolbar' }, this.state.inlineItems.map(item => this.renderItem(item)));
    }
}
exports.NotebookCellToolbar = NotebookCellToolbar;
class NotebookCellSidebar extends NotebookCellActionItems {
    render() {
        return React.createElement("div", { className: 'theia-notebook-cell-sidebar' }, this.state.inlineItems.map(item => this.renderItem(item)));
    }
}
exports.NotebookCellSidebar = NotebookCellSidebar;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/notebook/lib/browser/view/notebook-cell-toolbar'] = this;


/***/ }),

/***/ "../../packages/notebook/lib/browser/view/notebook-code-cell-view.js":
/*!***************************************************************************!*\
  !*** ../../packages/notebook/lib/browser/view/notebook-code-cell-view.js ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotebookCodeCellOutputs = exports.NotebookCodeCellStatus = exports.NotebookCodeCellRenderer = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const monaco_editor_1 = __webpack_require__(/*! @theia/monaco/lib/browser/monaco-editor */ "../../packages/monaco/lib/browser/monaco-editor.js");
const cell_output_webview_1 = __webpack_require__(/*! ../renderers/cell-output-webview */ "../../packages/notebook/lib/browser/renderers/cell-output-webview.js");
const notebook_renderer_registry_1 = __webpack_require__(/*! ../notebook-renderer-registry */ "../../packages/notebook/lib/browser/notebook-renderer-registry.js");
const notebook_cell_editor_1 = __webpack_require__(/*! ./notebook-cell-editor */ "../../packages/notebook/lib/browser/view/notebook-cell-editor.js");
const notebook_cell_toolbar_factory_1 = __webpack_require__(/*! ./notebook-cell-toolbar-factory */ "../../packages/notebook/lib/browser/view/notebook-cell-toolbar-factory.js");
const notebook_cell_actions_contribution_1 = __webpack_require__(/*! ../contributions/notebook-cell-actions-contribution */ "../../packages/notebook/lib/browser/contributions/notebook-cell-actions-contribution.js");
const notebook_execution_state_service_1 = __webpack_require__(/*! ../service/notebook-execution-state-service */ "../../packages/notebook/lib/browser/service/notebook-execution-state-service.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const common_1 = __webpack_require__(/*! ../../common */ "../../packages/notebook/lib/common/index.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
let NotebookCodeCellRenderer = class NotebookCodeCellRenderer {
    render(notebookModel, cell, handle) {
        return React.createElement("div", null,
            React.createElement("div", { className: 'theia-notebook-cell-with-sidebar' },
                React.createElement("div", null, this.notebookCellToolbarFactory.renderSidebar(notebook_cell_actions_contribution_1.NotebookCellActionContribution.CODE_CELL_SIDEBAR_MENU, notebookModel, cell)),
                React.createElement("div", { className: 'theia-notebook-cell-editor-container' },
                    React.createElement(notebook_cell_editor_1.CellEditor, { notebookModel: notebookModel, cell: cell, monacoServices: this.monacoServices }),
                    React.createElement(NotebookCodeCellStatus, { cell: cell, executionStateService: this.executionStateService }))),
            React.createElement("div", { className: 'theia-notebook-cell-with-sidebar' },
                React.createElement(NotebookCodeCellOutputs, { cell: cell, outputWebviewFactory: this.cellOutputWebviewFactory, renderSidebar: () => this.notebookCellToolbarFactory.renderSidebar(notebook_cell_actions_contribution_1.NotebookCellActionContribution.OUTPUT_SIDEBAR_MENU, notebookModel, cell, cell.outputs[0]) })));
    }
};
__decorate([
    (0, inversify_1.inject)(monaco_editor_1.MonacoEditorServices),
    __metadata("design:type", monaco_editor_1.MonacoEditorServices)
], NotebookCodeCellRenderer.prototype, "monacoServices", void 0);
__decorate([
    (0, inversify_1.inject)(notebook_renderer_registry_1.NotebookRendererRegistry),
    __metadata("design:type", notebook_renderer_registry_1.NotebookRendererRegistry)
], NotebookCodeCellRenderer.prototype, "notebookRendererRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(cell_output_webview_1.CellOutputWebviewFactory),
    __metadata("design:type", Function)
], NotebookCodeCellRenderer.prototype, "cellOutputWebviewFactory", void 0);
__decorate([
    (0, inversify_1.inject)(notebook_cell_toolbar_factory_1.NotebookCellToolbarFactory),
    __metadata("design:type", notebook_cell_toolbar_factory_1.NotebookCellToolbarFactory)
], NotebookCodeCellRenderer.prototype, "notebookCellToolbarFactory", void 0);
__decorate([
    (0, inversify_1.inject)(notebook_execution_state_service_1.NotebookExecutionStateService),
    __metadata("design:type", notebook_execution_state_service_1.NotebookExecutionStateService)
], NotebookCodeCellRenderer.prototype, "executionStateService", void 0);
NotebookCodeCellRenderer = __decorate([
    (0, inversify_1.injectable)()
], NotebookCodeCellRenderer);
exports.NotebookCodeCellRenderer = NotebookCodeCellRenderer;
class NotebookCodeCellStatus extends React.Component {
    constructor(props) {
        super(props);
        this.toDispose = new core_1.DisposableCollection();
        this.state = {};
        this.toDispose.push(props.executionStateService.onDidChangeExecution(event => {
            if (event.affectsCell(this.props.cell.uri)) {
                this.setState({ currentExecution: event.changed });
            }
        }));
    }
    componentWillUnmount() {
        this.toDispose.dispose();
    }
    render() {
        return React.createElement("div", { className: 'notebook-cell-status' },
            React.createElement("div", { className: 'notebook-cell-status-left' }, this.renderExecutionState()),
            React.createElement("div", { className: 'notebook-cell-status-right' },
                React.createElement("span", null, this.props.cell.language)));
    }
    renderExecutionState() {
        var _a;
        const state = (_a = this.state.currentExecution) === null || _a === void 0 ? void 0 : _a.state;
        const { lastRunSuccess } = this.props.cell.internalMetadata;
        let iconClasses = undefined;
        let color = undefined;
        if (!state && lastRunSuccess) {
            iconClasses = (0, browser_1.codicon)('check');
            color = 'green';
        }
        else if (!state && lastRunSuccess === false) {
            iconClasses = (0, browser_1.codicon)('error');
            color = 'red';
        }
        else if (state === common_1.NotebookCellExecutionState.Pending || state === common_1.NotebookCellExecutionState.Unconfirmed) {
            iconClasses = (0, browser_1.codicon)('clock');
        }
        else if (state === common_1.NotebookCellExecutionState.Executing) {
            iconClasses = `${(0, browser_1.codicon)('sync')} theia-animation-spin`;
        }
        return React.createElement(React.Fragment, null, iconClasses &&
            React.createElement(React.Fragment, null,
                React.createElement("span", { className: `${iconClasses} notebook-cell-status-item`, style: { color } }),
                React.createElement("div", { className: 'notebook-cell-status-item' }, this.getExecutionTime())));
    }
    getExecutionTime() {
        const { runStartTime, runEndTime } = this.props.cell.internalMetadata;
        if (runStartTime && runEndTime) {
            return `${((runEndTime - runStartTime) / 1000).toLocaleString(undefined, { maximumFractionDigits: 1, minimumFractionDigits: 1 })}s`;
        }
        return '0.0s';
    }
}
exports.NotebookCodeCellStatus = NotebookCodeCellStatus;
class NotebookCodeCellOutputs extends React.Component {
    constructor(props) {
        super(props);
    }
    async componentDidMount() {
        const { cell, outputWebviewFactory } = this.props;
        cell.onDidChangeOutputs(async () => {
            if (!this.outputsWebview && cell.outputs.length > 0) {
                this.outputsWebview = await outputWebviewFactory(cell);
            }
            else if (this.outputsWebview && cell.outputs.length === 0) {
                this.outputsWebview.dispose();
                this.outputsWebview = undefined;
            }
            this.forceUpdate();
        });
        if (cell.outputs.length > 0) {
            this.outputsWebview = await outputWebviewFactory(cell);
            this.forceUpdate();
        }
    }
    componentDidUpdate() {
        var _a, _b;
        if (!((_a = this.outputsWebview) === null || _a === void 0 ? void 0 : _a.isAttached())) {
            (_b = this.outputsWebview) === null || _b === void 0 ? void 0 : _b.attachWebview();
        }
    }
    render() {
        return this.outputsWebview ?
            React.createElement(React.Fragment, null,
                this.props.renderSidebar(),
                this.outputsWebview.render()) :
            React.createElement(React.Fragment, null);
    }
}
exports.NotebookCodeCellOutputs = NotebookCodeCellOutputs;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/notebook/lib/browser/view/notebook-code-cell-view'] = this;


/***/ }),

/***/ "../../packages/notebook/lib/browser/view/notebook-main-toolbar.js":
/*!*************************************************************************!*\
  !*** ../../packages/notebook/lib/browser/view/notebook-main-toolbar.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotebookMainToolbar = exports.NotebookMainToolbarRenderer = void 0;
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
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const notebook_actions_contribution_1 = __webpack_require__(/*! ../contributions/notebook-actions-contribution */ "../../packages/notebook/lib/browser/contributions/notebook-actions-contribution.js");
const notebook_kernel_service_1 = __webpack_require__(/*! ../service/notebook-kernel-service */ "../../packages/notebook/lib/browser/service/notebook-kernel-service.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const context_key_service_1 = __webpack_require__(/*! @theia/core/lib/browser/context-key-service */ "../../packages/core/lib/browser/context-key-service.js");
let NotebookMainToolbarRenderer = class NotebookMainToolbarRenderer {
    render(notebookModel) {
        return React.createElement(NotebookMainToolbar, { notebookModel: notebookModel, menuRegistry: this.menuRegistry, notebookKernelService: this.notebookKernelService, commandRegistry: this.commandRegistry, contextKeyService: this.contextKeyService });
    }
};
__decorate([
    (0, inversify_1.inject)(notebook_kernel_service_1.NotebookKernelService),
    __metadata("design:type", notebook_kernel_service_1.NotebookKernelService)
], NotebookMainToolbarRenderer.prototype, "notebookKernelService", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.CommandRegistry),
    __metadata("design:type", core_1.CommandRegistry)
], NotebookMainToolbarRenderer.prototype, "commandRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.MenuModelRegistry),
    __metadata("design:type", core_1.MenuModelRegistry)
], NotebookMainToolbarRenderer.prototype, "menuRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(context_key_service_1.ContextKeyService),
    __metadata("design:type", Object)
], NotebookMainToolbarRenderer.prototype, "contextKeyService", void 0);
NotebookMainToolbarRenderer = __decorate([
    (0, inversify_1.injectable)()
], NotebookMainToolbarRenderer);
exports.NotebookMainToolbarRenderer = NotebookMainToolbarRenderer;
class NotebookMainToolbar extends React.Component {
    constructor(props) {
        var _a;
        super(props);
        this.toDispose = new core_1.DisposableCollection();
        this.state = { selectedKernelLabel: (_a = props.notebookKernelService.getSelectedOrSuggestedKernel(props.notebookModel)) === null || _a === void 0 ? void 0 : _a.label };
        this.toDispose.push(props.notebookKernelService.onDidChangeSelectedKernel(event => {
            var _a, _b;
            if (props.notebookModel.uri.isEqual(event.notebook)) {
                this.setState({ selectedKernelLabel: (_b = props.notebookKernelService.getKernel((_a = event.newKernel) !== null && _a !== void 0 ? _a : '')) === null || _b === void 0 ? void 0 : _b.label });
            }
        }));
        // in case the selected kernel is added after the notebook is loaded
        this.toDispose.push(props.notebookKernelService.onDidAddKernel(() => {
            var _a;
            if (!this.state.selectedKernelLabel) {
                this.setState({ selectedKernelLabel: (_a = props.notebookKernelService.getSelectedOrSuggestedKernel(props.notebookModel)) === null || _a === void 0 ? void 0 : _a.label });
            }
        }));
    }
    componentWillUnmount() {
        this.toDispose.dispose();
    }
    render() {
        var _a;
        return React.createElement("div", { className: 'theia-notebook-main-toolbar' },
            this.getMenuItems().map(item => this.renderMenuItem(item)),
            React.createElement("div", { style: { flexGrow: 1 } }),
            React.createElement("div", { className: 'theia-notebook-main-toolbar-item', onClick: () => this.props.commandRegistry.executeCommand(notebook_actions_contribution_1.NotebookCommands.SELECT_KERNEL_COMMAND.id, this.props.notebookModel) },
                React.createElement("span", { className: (0, browser_1.codicon)('server-environment') }),
                React.createElement("span", { className: ' theia-notebook-main-toolbar-item-text' }, (_a = this.state.selectedKernelLabel) !== null && _a !== void 0 ? _a : core_1.nls.localizeByDefault('Select Kernel'))));
    }
    renderMenuItem(item) {
        var _a;
        if (item.role === 1 /* Group */) {
            const itemNodes = (_a = item.children) === null || _a === void 0 ? void 0 : _a.map(child => this.renderMenuItem(child)).filter(child => !!child);
            return React.createElement(React.Fragment, { key: item.id },
                itemNodes,
                itemNodes && itemNodes.length > 0 && React.createElement("span", { key: `${item.id}-separator`, className: 'theia-notebook-toolbar-separator' }));
        }
        else if (!item.when || this.props.contextKeyService.match(item.when)) {
            return React.createElement("div", { key: item.id, title: item.id, className: 'theia-notebook-main-toolbar-item', onClick: () => {
                    if (item.command) {
                        this.props.commandRegistry.executeCommand(item.command, this.props.notebookModel);
                    }
                } },
                React.createElement("span", { className: item.icon }),
                React.createElement("span", { className: 'theia-notebook-main-toolbar-item-text' }, item.label));
        }
        return undefined;
    }
    getMenuItems() {
        const menuPath = notebook_actions_contribution_1.NotebookMenus.NOTEBOOK_MAIN_TOOLBAR;
        const pluginCommands = this.props.menuRegistry.getMenuNode(menuPath).children;
        return this.props.menuRegistry.getMenu([menuPath]).children.concat(pluginCommands);
    }
}
exports.NotebookMainToolbar = NotebookMainToolbar;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/notebook/lib/browser/view/notebook-main-toolbar'] = this;


/***/ }),

/***/ "../../packages/notebook/lib/browser/view/notebook-markdown-cell-view.js":
/*!*******************************************************************************!*\
  !*** ../../packages/notebook/lib/browser/view/notebook-markdown-cell-view.js ***!
  \*******************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotebookMarkdownCellRenderer = void 0;
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const markdown_renderer_1 = __webpack_require__(/*! @theia/core/lib/browser/markdown-rendering/markdown-renderer */ "../../packages/core/lib/browser/markdown-rendering/markdown-renderer.js");
const markdown_string_1 = __webpack_require__(/*! @theia/core/lib/common/markdown-rendering/markdown-string */ "../../packages/core/lib/common/markdown-rendering/markdown-string.js");
const notebook_cell_editor_1 = __webpack_require__(/*! ./notebook-cell-editor */ "../../packages/notebook/lib/browser/view/notebook-cell-editor.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const monaco_editor_1 = __webpack_require__(/*! @theia/monaco/lib/browser/monaco-editor */ "../../packages/monaco/lib/browser/monaco-editor.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
let NotebookMarkdownCellRenderer = class NotebookMarkdownCellRenderer {
    render(notebookModel, cell) {
        return React.createElement(MarkdownCell, { markdownRenderer: this.markdownRenderer, monacoServices: this.monacoServices, cell: cell, notebookModel: notebookModel });
    }
};
__decorate([
    (0, inversify_1.inject)(markdown_renderer_1.MarkdownRenderer),
    __metadata("design:type", Object)
], NotebookMarkdownCellRenderer.prototype, "markdownRenderer", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_editor_1.MonacoEditorServices),
    __metadata("design:type", monaco_editor_1.MonacoEditorServices)
], NotebookMarkdownCellRenderer.prototype, "monacoServices", void 0);
NotebookMarkdownCellRenderer = __decorate([
    (0, inversify_1.injectable)()
], NotebookMarkdownCellRenderer);
exports.NotebookMarkdownCellRenderer = NotebookMarkdownCellRenderer;
function MarkdownCell({ markdownRenderer, monacoServices, cell, notebookModel }) {
    const [editMode, setEditMode] = React.useState(false);
    React.useEffect(() => {
        const listener = cell.onDidRequestCellEditChange(cellEdit => setEditMode(cellEdit));
        return () => listener.dispose();
    }, [editMode]);
    let markdownContent = React.useMemo(() => markdownRenderer.render(new markdown_string_1.MarkdownStringImpl(cell.source)).element.innerHTML, [cell, editMode]);
    if (markdownContent.length === 0) {
        markdownContent = `<i class="theia-notebook-empty-markdown">${core_1.nls.localizeByDefault('Empty markdown cell, double-click or press enter to edit.')}</i>`;
    }
    return editMode ?
        React.createElement(notebook_cell_editor_1.CellEditor, { cell: cell, notebookModel: notebookModel, monacoServices: monacoServices }) :
        React.createElement("div", { className: 'theia-notebook-markdown-content', onDoubleClick: () => cell.requestEdit(), 
            // This sets the non React HTML node from the markdown renderers output as a child node to this react component
            // This is currently sadly the best way we have to combine React (Virtual Nodes) and normal dom nodes
            // the HTML is allready sanitized by the markdown renderer, so we don't need to sanitize it again
            dangerouslySetInnerHTML: { __html: markdownContent } });
}

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/notebook/lib/browser/view/notebook-markdown-cell-view'] = this;


/***/ })

}]);
//# sourceMappingURL=packages_notebook_lib_browser_contributions_notebook-actions-contribution_js-packages_noteboo-994bb5.js.map