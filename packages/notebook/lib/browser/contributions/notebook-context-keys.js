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
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=notebook-context-keys.js.map