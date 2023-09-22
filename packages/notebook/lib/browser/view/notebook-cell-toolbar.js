"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const React = require("@theia/core/shared/react");
const browser_1 = require("@theia/core/lib/browser");
const core_1 = require("@theia/core");
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
//# sourceMappingURL=notebook-cell-toolbar.js.map