"use strict";
// *****************************************************************************
// Copyright (C) 2018 TypeFox and others.
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
exports.MonacoDiffEditor = void 0;
const uri_1 = require("@theia/core/lib/common/uri");
const monaco_editor_1 = require("./monaco-editor");
const diff_uris_1 = require("@theia/core/lib/browser/diff-uris");
const standaloneCodeEditor_1 = require("@theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneCodeEditor");
class MonacoDiffEditor extends monaco_editor_1.MonacoEditor {
    constructor(uri, node, originalModel, modifiedModel, services, diffNavigatorFactory, options, override) {
        super(uri, modifiedModel, node, services, options, override);
        this.originalModel = originalModel;
        this.modifiedModel = modifiedModel;
        this.diffNavigatorFactory = diffNavigatorFactory;
        this.documents.add(originalModel);
        const original = originalModel.textEditorModel;
        const modified = modifiedModel.textEditorModel;
        this._diffNavigator = diffNavigatorFactory.createdDiffNavigator(this._diffEditor, options);
        this._diffEditor.setModel({ original, modified });
    }
    get diffEditor() {
        return this._diffEditor;
    }
    get diffNavigator() {
        return this._diffNavigator;
    }
    create(options, override) {
        const instantiator = this.getInstantiatorWithOverrides(override);
        /**
         *  @monaco-uplift. Should be guaranteed to work.
         *  Incomparable enums prevent TypeScript from believing that public IStandaloneDiffEditor is satisfied by private StandaloneDiffEditor
         */
        this._diffEditor = instantiator
            .createInstance(standaloneCodeEditor_1.StandaloneDiffEditor, this.node, { ...options, fixedOverflowWidgets: true });
        this.editor = this._diffEditor.getModifiedEditor();
        return this._diffEditor;
    }
    resize(dimension) {
        if (this.node) {
            const layoutSize = this.computeLayoutSize(this.node, dimension);
            this._diffEditor.layout(layoutSize);
        }
    }
    isActionSupported(id) {
        const action = this._diffEditor.getSupportedActions().find(a => a.id === id);
        return !!action && action.isSupported() && super.isActionSupported(id);
    }
    deltaDecorations(params) {
        console.warn('`deltaDecorations` should be called on either the original, or the modified editor.');
        return [];
    }
    getResourceUri() {
        return new uri_1.default(this.originalModel.uri);
    }
    createMoveToUri(resourceUri) {
        const [left, right] = diff_uris_1.DiffUris.decode(this.uri);
        return diff_uris_1.DiffUris.encode(left.withPath(resourceUri.path), right.withPath(resourceUri.path));
    }
}
exports.MonacoDiffEditor = MonacoDiffEditor;
//# sourceMappingURL=monaco-diff-editor.js.map