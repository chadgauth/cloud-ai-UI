"use strict";
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
const core_1 = require("@theia/core");
const React = require("@theia/core/shared/react");
const browser_1 = require("@theia/core/lib/browser");
const notebook_actions_contribution_1 = require("../contributions/notebook-actions-contribution");
const notebook_kernel_service_1 = require("../service/notebook-kernel-service");
const inversify_1 = require("@theia/core/shared/inversify");
const context_key_service_1 = require("@theia/core/lib/browser/context-key-service");
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
//# sourceMappingURL=notebook-main-toolbar.js.map