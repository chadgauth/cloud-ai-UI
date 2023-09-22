"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const React = require("@theia/core/shared/react");
const common_1 = require("../../common");
const browser_1 = require("@theia/core/lib/browser");
const core_1 = require("@theia/core");
const notebook_actions_contribution_1 = require("../contributions/notebook-actions-contribution");
const notebook_cell_actions_contribution_1 = require("../contributions/notebook-cell-actions-contribution");
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
//# sourceMappingURL=notebook-cell-list-view.js.map