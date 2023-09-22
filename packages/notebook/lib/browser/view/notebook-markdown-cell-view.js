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
exports.NotebookMarkdownCellRenderer = void 0;
const React = require("@theia/core/shared/react");
const markdown_renderer_1 = require("@theia/core/lib/browser/markdown-rendering/markdown-renderer");
const markdown_string_1 = require("@theia/core/lib/common/markdown-rendering/markdown-string");
const notebook_cell_editor_1 = require("./notebook-cell-editor");
const inversify_1 = require("@theia/core/shared/inversify");
const monaco_editor_1 = require("@theia/monaco/lib/browser/monaco-editor");
const core_1 = require("@theia/core");
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
//# sourceMappingURL=notebook-markdown-cell-view.js.map