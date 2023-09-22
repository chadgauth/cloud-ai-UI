"use strict";
// *****************************************************************************
// Copyright (C) 2017 TypeFox and others.
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
exports.TextEditorPropertiesMain = exports.TextEditorMain = void 0;
const monaco = require("@theia/monaco-editor-core");
const disposable_1 = require("@theia/core/lib/common/disposable");
const plugin_api_rpc_1 = require("../../common/plugin-api-rpc");
const core_1 = require("@theia/core");
const editor_options_1 = require("../../common/editor-options");
const types_impl_1 = require("../../plugin/types-impl");
class TextEditorMain {
    constructor(id, model, editor) {
        this.id = id;
        this.model = model;
        this.onPropertiesChangedEmitter = new core_1.Emitter();
        this.toDispose = new disposable_1.DisposableCollection(disposable_1.Disposable.create(() => this.properties = undefined), this.onPropertiesChangedEmitter);
        this.toDisposeOnEditor = new disposable_1.DisposableCollection();
        this.toDispose.push(this.model.onDidChangeOptions(() => this.updateProperties(undefined)));
        this.setEditor(editor);
        this.updateProperties(undefined);
    }
    dispose() {
        this.toDispose.dispose();
    }
    updateProperties(source) {
        this.setProperties(TextEditorPropertiesMain.readFromEditor(this.properties, this.model, this.editor), source);
    }
    setProperties(newProperties, source) {
        const result = newProperties.generateDelta(this.properties, source);
        this.properties = newProperties;
        if (result) {
            this.onPropertiesChangedEmitter.fire(result);
        }
    }
    setEditor(editor) {
        if (this.editor === editor) {
            return;
        }
        this.toDisposeOnEditor.dispose();
        this.toDispose.push(this.toDisposeOnEditor);
        this.editor = editor;
        this.toDisposeOnEditor.push(disposable_1.Disposable.create(() => this.editor = undefined));
        if (this.editor) {
            const monacoEditor = this.editor.getControl();
            this.toDisposeOnEditor.push(this.editor.onSelectionChanged(_ => {
                this.updateProperties();
            }));
            this.toDisposeOnEditor.push(monacoEditor.onDidChangeModel(() => {
                this.setEditor(undefined);
            }));
            this.toDisposeOnEditor.push(monacoEditor.onDidChangeCursorSelection(e => {
                this.updateProperties(e.source);
            }));
            this.toDisposeOnEditor.push(monacoEditor.onDidChangeConfiguration(() => {
                this.updateProperties();
            }));
            this.toDisposeOnEditor.push(monacoEditor.onDidLayoutChange(() => {
                this.updateProperties();
            }));
            this.toDisposeOnEditor.push(monacoEditor.onDidScrollChange(() => {
                this.updateProperties();
            }));
            this.updateProperties();
        }
    }
    getId() {
        return this.id;
    }
    getModel() {
        return this.model;
    }
    getProperties() {
        return this.properties;
    }
    get onPropertiesChangedEvent() {
        return this.onPropertiesChangedEmitter.event;
    }
    setSelections(selections) {
        if (this.editor) {
            this.editor.getControl().setSelections(selections);
            return;
        }
        const monacoSelections = selections.map(TextEditorMain.toMonacoSelections);
        this.setProperties(new TextEditorPropertiesMain(monacoSelections, this.properties.options, this.properties.visibleRanges), undefined);
    }
    setConfiguration(newConfiguration) {
        this.setIndentConfiguration(newConfiguration);
        if (!this.editor) {
            return;
        }
        if (newConfiguration.cursorStyle) {
            const newCursorStyle = (0, editor_options_1.cursorStyleToString)(newConfiguration.cursorStyle);
            this.editor.getControl().updateOptions({
                cursorStyle: newCursorStyle
            });
        }
        if (typeof newConfiguration.lineNumbers !== 'undefined') {
            let lineNumbers;
            switch (newConfiguration.lineNumbers) {
                case types_impl_1.TextEditorLineNumbersStyle.On:
                    lineNumbers = 'on';
                    break;
                case types_impl_1.TextEditorLineNumbersStyle.Relative:
                    lineNumbers = 'relative';
                    break;
                default:
                    lineNumbers = 'off';
            }
            this.editor.getControl().updateOptions({
                lineNumbers: lineNumbers
            });
        }
    }
    setIndentConfiguration(newConfiguration) {
        if (newConfiguration.tabSize === 'auto' || newConfiguration.insertSpaces === 'auto') {
            const creationOpts = this.model.getOptions();
            let insertSpaces = creationOpts.insertSpaces;
            let tabSize = creationOpts.tabSize;
            if (newConfiguration.insertSpaces !== 'auto' && typeof newConfiguration.insertSpaces !== 'undefined') {
                insertSpaces = newConfiguration.insertSpaces;
            }
            if (newConfiguration.tabSize !== 'auto' && typeof newConfiguration.tabSize !== 'undefined') {
                tabSize = newConfiguration.tabSize;
            }
            this.model.detectIndentation(insertSpaces, tabSize);
            return;
        }
        const newOpts = {};
        if (typeof newConfiguration.insertSpaces !== 'undefined') {
            newOpts.insertSpaces = newConfiguration.insertSpaces;
        }
        if (typeof newConfiguration.tabSize !== 'undefined') {
            newOpts.tabSize = newConfiguration.tabSize;
        }
        this.model.updateOptions(newOpts);
    }
    revealRange(range, revealType) {
        if (!this.editor) {
            return;
        }
        switch (revealType) {
            case plugin_api_rpc_1.TextEditorRevealType.Default:
                this.editor.getControl().revealRange(range, monaco.editor.ScrollType.Smooth);
                break;
            case plugin_api_rpc_1.TextEditorRevealType.InCenter:
                this.editor.getControl().revealRangeInCenter(range, monaco.editor.ScrollType.Smooth);
                break;
            case plugin_api_rpc_1.TextEditorRevealType.InCenterIfOutsideViewport:
                this.editor.getControl().revealRangeInCenterIfOutsideViewport(range, monaco.editor.ScrollType.Smooth);
                break;
            case plugin_api_rpc_1.TextEditorRevealType.AtTop:
                this.editor.getControl().revealRangeAtTop(range, monaco.editor.ScrollType.Smooth);
                break;
            default:
                console.warn(`Unknown revealType: ${revealType}`);
                break;
        }
    }
    applyEdits(versionId, edits, opts) {
        if (this.model.getVersionId() !== versionId) {
            // model changed in the meantime
            return false;
        }
        if (!this.editor) {
            return false;
        }
        if (opts.setEndOfLine === types_impl_1.EndOfLine.CRLF) {
            this.model.setEOL(monaco.editor.EndOfLineSequence.CRLF);
        }
        else if (opts.setEndOfLine === types_impl_1.EndOfLine.LF) {
            this.model.setEOL(monaco.editor.EndOfLineSequence.LF);
        }
        const editOperations = [];
        for (const edit of edits) {
            const { range, text } = edit;
            if (!range && !text) {
                continue;
            }
            if (range && range.startLineNumber === range.endLineNumber && range.startColumn === range.endColumn && !edit.text) {
                continue;
            }
            editOperations.push({
                range: range ? monaco.Range.lift(range) : this.editor.getControl().getModel().getFullModelRange(),
                /* eslint-disable-next-line no-null/no-null */
                text: text || null,
                forceMoveMarkers: edit.forceMoveMarkers
            });
        }
        if (opts.undoStopBefore) {
            this.editor.getControl().pushUndoStop();
        }
        this.editor.getControl().executeEdits('MainThreadTextEditor', editOperations);
        if (opts.undoStopAfter) {
            this.editor.getControl().pushUndoStop();
        }
        return true;
    }
    insertSnippet(template, ranges, opts) {
        var _a;
        const snippetController = (_a = this.editor) === null || _a === void 0 ? void 0 : _a.getControl().getContribution('snippetController2');
        if (!snippetController || !this.editor) {
            return false;
        }
        const selections = ranges.map(r => new monaco.Selection(r.startLineNumber, r.startColumn, r.endLineNumber, r.endColumn));
        this.editor.getControl().setSelections(selections);
        this.editor.focus();
        snippetController.insert(template, 0, 0, opts.undoStopBefore, opts.undoStopAfter);
        return true;
    }
    setDecorations(key, ranges) {
        if (!this.editor) {
            return;
        }
        this.editor.getControl()
            .setDecorationsByType('Plugin decorations', key, ranges.map(option => Object.assign(option, { color: undefined })));
    }
    setDecorationsFast(key, _ranges) {
        if (!this.editor) {
            return;
        }
        const ranges = [];
        const len = Math.floor(_ranges.length / 4);
        for (let i = 0; i < len; i++) {
            ranges[i] = new monaco.Range(_ranges[4 * i], _ranges[4 * i + 1], _ranges[4 * i + 2], _ranges[4 * i + 3]);
        }
        this.editor.getControl().setDecorationsByTypeFast(key, ranges);
    }
    static toMonacoSelections(selection) {
        return new monaco.Selection(selection.selectionStartLineNumber, selection.selectionStartColumn, selection.positionLineNumber, selection.positionColumn);
    }
}
exports.TextEditorMain = TextEditorMain;
class TextEditorPropertiesMain {
    constructor(selections, options, visibleRanges) {
        this.selections = selections;
        this.options = options;
        this.visibleRanges = visibleRanges;
    }
    generateDelta(old, source) {
        const result = {
            options: undefined,
            selections: undefined,
            visibleRanges: undefined
        };
        if (!old || !TextEditorPropertiesMain.selectionsEqual(old.selections, this.selections)) {
            result.selections = {
                selections: this.selections,
                source: source
            };
        }
        if (!old || !TextEditorPropertiesMain.optionsEqual(old.options, this.options)) {
            result.options = this.options;
        }
        if (!old || !TextEditorPropertiesMain.rangesEqual(old.visibleRanges, this.visibleRanges)) {
            result.visibleRanges = this.visibleRanges;
        }
        if (result.selections || result.visibleRanges || result.options) {
            return result;
        }
        return undefined;
    }
    static readFromEditor(prevProperties, model, editor) {
        const selections = TextEditorPropertiesMain.getSelectionsFromEditor(prevProperties, editor);
        const options = TextEditorPropertiesMain.getOptionsFromEditor(prevProperties, model, editor);
        const visibleRanges = TextEditorPropertiesMain.getVisibleRangesFromEditor(prevProperties, editor);
        return new TextEditorPropertiesMain(selections, options, visibleRanges);
    }
    static getSelectionsFromEditor(prevProperties, editor) {
        let result = undefined;
        if (editor) {
            result = editor.getControl().getSelections() || undefined;
        }
        if (!result && prevProperties) {
            result = prevProperties.selections;
        }
        if (!result) {
            result = [new monaco.Selection(1, 1, 1, 1)];
        }
        return result;
    }
    static getOptionsFromEditor(prevProperties, model, editor) {
        if (model.isDisposed()) {
            return prevProperties.options;
        }
        let cursorStyle;
        let lineNumbers;
        if (editor) {
            const editorOptions = editor.getControl().getOptions();
            const lineNumbersOpts = editorOptions.get(monaco.editor.EditorOption.lineNumbers);
            cursorStyle = editorOptions.get(monaco.editor.EditorOption.cursorStyle);
            switch (lineNumbersOpts.renderType) {
                case monaco.editor.RenderLineNumbersType.Off:
                    lineNumbers = types_impl_1.TextEditorLineNumbersStyle.Off;
                    break;
                case monaco.editor.RenderLineNumbersType.Relative:
                    lineNumbers = types_impl_1.TextEditorLineNumbersStyle.Relative;
                    break;
                default:
                    lineNumbers = types_impl_1.TextEditorLineNumbersStyle.On;
                    break;
            }
        }
        else if (prevProperties) {
            cursorStyle = prevProperties.options.cursorStyle;
            lineNumbers = prevProperties.options.lineNumbers;
        }
        else {
            cursorStyle = editor_options_1.TextEditorCursorStyle.Line;
            lineNumbers = types_impl_1.TextEditorLineNumbersStyle.On;
        }
        const modelOptions = model.getOptions();
        return {
            insertSpaces: modelOptions.insertSpaces,
            tabSize: modelOptions.tabSize,
            cursorStyle,
            lineNumbers,
        };
    }
    static getVisibleRangesFromEditor(prevProperties, editor) {
        if (editor) {
            return editor.getControl().getVisibleRanges();
        }
        return [];
    }
    static selectionsEqual(a, b) {
        if (a.length !== b.length) {
            return false;
        }
        for (let i = 0; i < a.length; i++) {
            if (!a[i].equalsSelection(b[i])) {
                return false;
            }
        }
        return true;
    }
    static optionsEqual(a, b) {
        if (a && !b || !a && b) {
            return false;
        }
        if (!a && !b) {
            return true;
        }
        return (a.tabSize === b.tabSize
            && a.insertSpaces === b.insertSpaces
            && a.cursorStyle === b.cursorStyle
            && a.lineNumbers === b.lineNumbers);
    }
    static rangesEqual(a, b) {
        if (a.length !== b.length) {
            return false;
        }
        for (let i = 0; i < a.length; i++) {
            if (!a[i].equalsRange(b[i])) {
                return false;
            }
        }
        return true;
    }
}
exports.TextEditorPropertiesMain = TextEditorPropertiesMain;
//# sourceMappingURL=text-editor-main.js.map