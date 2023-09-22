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
exports.NotebookCodeCellOutputs = exports.NotebookCodeCellStatus = exports.NotebookCodeCellRenderer = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const React = require("@theia/core/shared/react");
const monaco_editor_1 = require("@theia/monaco/lib/browser/monaco-editor");
const cell_output_webview_1 = require("../renderers/cell-output-webview");
const notebook_renderer_registry_1 = require("../notebook-renderer-registry");
const notebook_cell_editor_1 = require("./notebook-cell-editor");
const notebook_cell_toolbar_factory_1 = require("./notebook-cell-toolbar-factory");
const notebook_cell_actions_contribution_1 = require("../contributions/notebook-cell-actions-contribution");
const notebook_execution_state_service_1 = require("../service/notebook-execution-state-service");
const browser_1 = require("@theia/core/lib/browser");
const common_1 = require("../../common");
const core_1 = require("@theia/core");
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
//# sourceMappingURL=notebook-code-cell-view.js.map