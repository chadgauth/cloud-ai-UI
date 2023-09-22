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
exports.MonacoCodeEditor = void 0;
const monaco_editor_1 = require("./monaco-editor");
const codeEditorWidget_1 = require("@theia/monaco-editor-core/esm/vs/editor/browser/widget/codeEditorWidget");
const standaloneServices_1 = require("@theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices");
const serviceCollection_1 = require("@theia/monaco-editor-core/esm/vs/platform/instantiation/common/serviceCollection");
const core_1 = require("@theia/core");
const monaco = require("@theia/monaco-editor-core");
const domutils_1 = require("@theia/core/shared/@phosphor/domutils");
class MonacoCodeEditor extends monaco_editor_1.MonacoEditorServices {
    constructor(uri, document, node, services, options, override) {
        super(services);
        this.uri = uri;
        this.document = document;
        this.node = node;
        this.toDispose = new core_1.DisposableCollection();
        this.onCursorPositionChangedEmitter = new core_1.Emitter();
        this.onSelectionChangedEmitter = new core_1.Emitter();
        this.onFocusChangedEmitter = new core_1.Emitter();
        this.onDocumentContentChangedEmitter = new core_1.Emitter();
        this.onDocumentContentChanged = this.onDocumentContentChangedEmitter.event;
        this.onMouseDownEmitter = new core_1.Emitter();
        this.onLanguageChangedEmitter = new core_1.Emitter();
        this.onLanguageChanged = this.onLanguageChangedEmitter.event;
        this.onScrollChangedEmitter = new core_1.Emitter();
        this.onEncodingChanged = this.document.onDidChangeEncoding;
        this.onResizeEmitter = new core_1.Emitter();
        this.onDidResize = this.onResizeEmitter.event;
        this.toDispose.pushAll([
            this.onCursorPositionChangedEmitter,
            this.onSelectionChangedEmitter,
            this.onFocusChangedEmitter,
            this.onDocumentContentChangedEmitter,
            this.onMouseDownEmitter,
            this.onLanguageChangedEmitter,
            this.onScrollChangedEmitter
        ]);
        this.toDispose.push(this.create(options, override));
        this.addHandlers(this.editor);
        this.editor.setModel(document.textEditorModel);
    }
    getControl() {
        return this.editor;
    }
    create(options, override) {
        const combinedOptions = {
            ...options,
            lightbulb: { enabled: true },
            fixedOverflowWidgets: true,
            automaticLayout: true,
            scrollbar: {
                useShadows: false,
                verticalHasArrows: false,
                horizontalHasArrows: false,
                verticalScrollbarSize: 10,
                horizontalScrollbarSize: 10,
                ...options === null || options === void 0 ? void 0 : options.scrollbar,
            }
        };
        const instantiator = this.getInstantiatorWithOverrides(override);
        return this.editor = instantiator.createInstance(codeEditorWidget_1.CodeEditorWidget, this.node, {
            ...combinedOptions,
            dimension: {
                width: 0,
                height: 0
            },
        }, {});
    }
    addHandlers(codeEditor) {
        this.toDispose.push(codeEditor.onDidChangeModelLanguage(e => this.fireLanguageChanged(e.newLanguage)));
        this.toDispose.push(codeEditor.onDidChangeConfiguration(() => this.refresh()));
        this.toDispose.push(codeEditor.onDidChangeModel(() => this.refresh()));
        this.toDispose.push(codeEditor.onDidChangeModelContent(e => {
            this.refresh();
            this.onDocumentContentChangedEmitter.fire({ document: this.document, contentChanges: e.changes.map(this.mapModelContentChange.bind(this)) });
        }));
        this.toDispose.push(codeEditor.onMouseDown(e => {
            const { element, position, range } = e.target;
            this.onMouseDownEmitter.fire({
                target: {
                    ...e.target,
                    element: element || undefined,
                    mouseColumn: this.m2p.asPosition(undefined, e.target.mouseColumn).character,
                    range: range && this.m2p.asRange(range) || undefined,
                    position: position && this.m2p.asPosition(position.lineNumber, position.column) || undefined,
                    detail: undefined
                },
                event: e.event.browserEvent
            });
        }));
        this.toDispose.push(codeEditor.onDidScrollChange(e => {
            this.onScrollChangedEmitter.fire(undefined);
        }));
    }
    setLanguage(languageId) {
        monaco.editor.setModelLanguage(this.document.textEditorModel, languageId);
    }
    fireLanguageChanged(languageId) {
        this.onLanguageChangedEmitter.fire(languageId);
    }
    getInstantiatorWithOverrides(override) {
        const instantiator = standaloneServices_1.StandaloneServices.initialize({});
        if (override) {
            const overrideServices = new serviceCollection_1.ServiceCollection(...override);
            return instantiator.createChild(overrideServices);
        }
        return instantiator;
    }
    mapModelContentChange(change) {
        return {
            range: this.m2p.asRange(change.range),
            rangeLength: change.rangeLength,
            text: change.text
        };
    }
    refresh() {
        this.autoresize();
    }
    resizeToFit() {
        this.autoresize();
        // eslint-disable-next-line no-null/no-null
        this.onResizeEmitter.fire(null);
    }
    setSize(dimension) {
        this.resize(dimension);
        this.onResizeEmitter.fire(dimension);
    }
    autoresize() {
        this.resize();
    }
    resize(dimension) {
        if (this.node) {
            const layoutSize = this.computeLayoutSize(this.node, dimension);
            this.editor.layout(layoutSize);
        }
    }
    computeLayoutSize(hostNode, dimension) {
        if (dimension && dimension.width >= 0 && dimension.height >= 0) {
            return dimension;
        }
        const boxSizing = domutils_1.ElementExt.boxSizing(hostNode);
        const width = (!dimension || dimension.width < 0) ?
            this.getWidth(hostNode, boxSizing) :
            dimension.width;
        const height = (!dimension || dimension.height < 0) ?
            this.getHeight(hostNode, boxSizing) :
            dimension.height;
        return { width, height };
    }
    getWidth(hostNode, boxSizing) {
        return hostNode.offsetWidth - boxSizing.horizontalSum;
    }
    getHeight(hostNode, boxSizing) {
        return this.editor.getContentHeight();
    }
    dispose() {
        this.toDispose.dispose();
    }
}
exports.MonacoCodeEditor = MonacoCodeEditor;
//# sourceMappingURL=monaco-code-editor.js.map