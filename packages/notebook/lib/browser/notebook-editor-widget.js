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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotebookEditorWidget = exports.NOTEBOOK_EDITOR_ID_PREFIX = exports.createNotebookEditorWidgetContainer = exports.NotebookEditorContainerFactory = void 0;
const React = require("@theia/core/shared/react");
const core_1 = require("@theia/core");
const browser_1 = require("@theia/core/lib/browser");
const common_1 = require("../common");
const notebook_cell_list_view_1 = require("./view/notebook-cell-list-view");
const notebook_code_cell_view_1 = require("./view/notebook-code-cell-view");
const notebook_markdown_cell_view_1 = require("./view/notebook-markdown-cell-view");
const notebook_cell_toolbar_factory_1 = require("./view/notebook-cell-toolbar-factory");
const inversify_1 = require("@theia/core/shared/inversify");
const vscode_languageserver_protocol_1 = require("@theia/core/shared/vscode-languageserver-protocol");
const notebook_editor_service_1 = require("./service/notebook-editor-service");
const notebook_main_toolbar_1 = require("./view/notebook-main-toolbar");
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
//# sourceMappingURL=notebook-editor-widget.js.map