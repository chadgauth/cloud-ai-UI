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
exports.CellEditor = void 0;
const React = require("@theia/core/shared/react");
const monaco_code_editor_1 = require("@theia/monaco/lib/browser/monaco-code-editor");
const monaco_editor_provider_1 = require("@theia/monaco/lib/browser/monaco-editor-provider");
const core_1 = require("@theia/core");
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
//# sourceMappingURL=notebook-cell-editor.js.map