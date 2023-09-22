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
exports.MonacoEditor = exports.MonacoEditorServices = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const domutils_1 = require("@theia/core/shared/@phosphor/domutils");
const context_key_service_1 = require("@theia/core/lib/browser/context-key-service");
const common_1 = require("@theia/core/lib/common");
const monaco_to_protocol_converter_1 = require("./monaco-to-protocol-converter");
const protocol_to_monaco_converter_1 = require("./protocol-to-monaco-converter");
const encodings_1 = require("@theia/core/lib/common/encodings");
const monaco = require("@theia/monaco-editor-core");
const standaloneServices_1 = require("@theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices");
const language_1 = require("@theia/monaco-editor-core/esm/vs/editor/common/languages/language");
const serviceCollection_1 = require("@theia/monaco-editor-core/esm/vs/platform/instantiation/common/serviceCollection");
const standaloneCodeEditor_1 = require("@theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneCodeEditor");
let MonacoEditorServices = class MonacoEditorServices {
    constructor(services) {
        Object.assign(this, services);
    }
};
__decorate([
    (0, inversify_1.inject)(monaco_to_protocol_converter_1.MonacoToProtocolConverter),
    __metadata("design:type", monaco_to_protocol_converter_1.MonacoToProtocolConverter)
], MonacoEditorServices.prototype, "m2p", void 0);
__decorate([
    (0, inversify_1.inject)(protocol_to_monaco_converter_1.ProtocolToMonacoConverter),
    __metadata("design:type", protocol_to_monaco_converter_1.ProtocolToMonacoConverter)
], MonacoEditorServices.prototype, "p2m", void 0);
__decorate([
    (0, inversify_1.inject)(context_key_service_1.ContextKeyService),
    __metadata("design:type", Object)
], MonacoEditorServices.prototype, "contextKeyService", void 0);
MonacoEditorServices = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.unmanaged)()),
    __metadata("design:paramtypes", [MonacoEditorServices])
], MonacoEditorServices);
exports.MonacoEditorServices = MonacoEditorServices;
class MonacoEditor extends MonacoEditorServices {
    constructor(uri, document, node, services, options, override) {
        super(services);
        this.uri = uri;
        this.document = document;
        this.node = node;
        this.toDispose = new common_1.DisposableCollection();
        this.onCursorPositionChangedEmitter = new common_1.Emitter();
        this.onSelectionChangedEmitter = new common_1.Emitter();
        this.onFocusChangedEmitter = new common_1.Emitter();
        this.onDocumentContentChangedEmitter = new common_1.Emitter();
        this.onMouseDownEmitter = new common_1.Emitter();
        this.onLanguageChangedEmitter = new common_1.Emitter();
        this.onLanguageChanged = this.onLanguageChangedEmitter.event;
        this.onScrollChangedEmitter = new common_1.Emitter();
        this.onEncodingChanged = this.document.onDidChangeEncoding;
        this.onResizeEmitter = new common_1.Emitter();
        this.onDidResize = this.onResizeEmitter.event;
        this.documents = new Set();
        /* `true` because it is derived from an URI during the instantiation */
        this._languageAutoDetected = true;
        this.toDispose.pushAll([
            this.onCursorPositionChangedEmitter,
            this.onSelectionChangedEmitter,
            this.onFocusChangedEmitter,
            this.onDocumentContentChangedEmitter,
            this.onMouseDownEmitter,
            this.onLanguageChangedEmitter,
            this.onScrollChangedEmitter
        ]);
        this.documents.add(document);
        this.autoSizing = options && options.autoSizing !== undefined ? options.autoSizing : false;
        this.minHeight = options && options.minHeight !== undefined ? options.minHeight : -1;
        this.maxHeight = options && options.maxHeight !== undefined ? options.maxHeight : -1;
        this.toDispose.push(this.create(options, override));
        this.addHandlers(this.editor);
    }
    getEncoding() {
        return this.document.getEncoding() || encodings_1.UTF8;
    }
    setEncoding(encoding, mode) {
        return this.document.setEncoding(encoding, mode);
    }
    create(options, override) {
        const combinedOptions = {
            ...options,
            lightbulb: { enabled: true },
            fixedOverflowWidgets: true,
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
        /**
         * @monaco-uplift. Should be guaranteed to work.
         * Incomparable enums prevent TypeScript from believing that public IStandaloneCodeEditor is satisfied by private StandaloneCodeEditor
         */
        return this.editor = instantiator.createInstance(standaloneCodeEditor_1.StandaloneEditor, this.node, combinedOptions);
    }
    getInstantiatorWithOverrides(override) {
        const instantiator = standaloneServices_1.StandaloneServices.initialize({});
        if (override) {
            const overrideServices = new serviceCollection_1.ServiceCollection(...override);
            return instantiator.createChild(overrideServices);
        }
        return instantiator;
    }
    addHandlers(codeEditor) {
        this.toDispose.push(codeEditor.onDidChangeModelLanguage(e => this.fireLanguageChanged(e.newLanguage)));
        this.toDispose.push(codeEditor.onDidChangeConfiguration(() => this.refresh()));
        this.toDispose.push(codeEditor.onDidChangeModel(() => this.refresh()));
        this.toDispose.push(codeEditor.onDidChangeModelContent(e => {
            this.refresh();
            this.onDocumentContentChangedEmitter.fire({ document: this.document, contentChanges: e.changes.map(this.mapModelContentChange.bind(this)) });
        }));
        this.toDispose.push(codeEditor.onDidChangeCursorPosition(() => this.onCursorPositionChangedEmitter.fire(this.cursor)));
        this.toDispose.push(codeEditor.onDidChangeCursorSelection(() => this.onSelectionChangedEmitter.fire(this.selection)));
        this.toDispose.push(codeEditor.onDidFocusEditorText(() => this.onFocusChangedEmitter.fire(this.isFocused())));
        this.toDispose.push(codeEditor.onDidBlurEditorText(() => this.onFocusChangedEmitter.fire(this.isFocused())));
        this.toDispose.push(codeEditor.onMouseDown(e => {
            const { element, position, range } = e.target;
            this.onMouseDownEmitter.fire({
                target: {
                    ...e.target,
                    element: element || undefined,
                    mouseColumn: this.m2p.asPosition(undefined, e.target.mouseColumn).character,
                    range: range && this.m2p.asRange(range) || undefined,
                    position: position && this.m2p.asPosition(position.lineNumber, position.column) || undefined,
                    detail: e.target.detail || {},
                },
                event: e.event.browserEvent
            });
        }));
        this.toDispose.push(codeEditor.onDidScrollChange(e => {
            this.onScrollChangedEmitter.fire(undefined);
        }));
    }
    getVisibleRanges() {
        return this.editor.getVisibleRanges().map(range => this.m2p.asRange(range));
    }
    mapModelContentChange(change) {
        return {
            range: this.m2p.asRange(change.range),
            rangeLength: change.rangeLength,
            text: change.text
        };
    }
    get onDispose() {
        return this.toDispose.onDispose;
    }
    get onDocumentContentChanged() {
        return this.onDocumentContentChangedEmitter.event;
    }
    get isReadonly() {
        return this.document.isReadonly();
    }
    get cursor() {
        const { lineNumber, column } = this.editor.getPosition();
        return this.m2p.asPosition(lineNumber, column);
    }
    set cursor(cursor) {
        const position = this.p2m.asPosition(cursor);
        this.editor.setPosition(position);
    }
    get onCursorPositionChanged() {
        return this.onCursorPositionChangedEmitter.event;
    }
    get selection() {
        return this.m2p.asRange(this.editor.getSelection());
    }
    set selection(selection) {
        const range = this.p2m.asRange(selection);
        this.editor.setSelection(range);
    }
    get onSelectionChanged() {
        return this.onSelectionChangedEmitter.event;
    }
    get onScrollChanged() {
        return this.onScrollChangedEmitter.event;
    }
    revealPosition(raw, options = { vertical: 'center' }) {
        const position = this.p2m.asPosition(raw);
        switch (options.vertical) {
            case 'auto':
                this.editor.revealPosition(position);
                break;
            case 'center':
                this.editor.revealPositionInCenter(position);
                break;
            case 'centerIfOutsideViewport':
                this.editor.revealPositionInCenterIfOutsideViewport(position);
                break;
        }
    }
    revealRange(raw, options = { at: 'center' }) {
        const range = this.p2m.asRange(raw);
        switch (options.at) {
            case 'top':
                this.editor.revealRangeAtTop(range);
                break;
            case 'center':
                this.editor.revealRangeInCenter(range);
                break;
            case 'centerIfOutsideViewport':
                this.editor.revealRangeInCenterIfOutsideViewport(range);
                break;
            case 'auto':
                this.editor.revealRange(range);
                break;
        }
    }
    focus() {
        /**
         * `this.editor.focus` forcefully changes the focus editor state,
         * regardless whether the textarea actually received the focus.
         * It could lead to issues like https://github.com/eclipse-theia/theia/issues/7902
         * Instead we focus the underlying textarea.
         */
        const node = this.editor.getDomNode();
        if (node) {
            const textarea = node.querySelector('textarea');
            textarea.focus();
        }
    }
    blur() {
        const node = this.editor.getDomNode();
        if (node) {
            const textarea = node.querySelector('textarea');
            textarea.blur();
        }
    }
    isFocused({ strict } = { strict: false }) {
        if (!this.editor.hasTextFocus()) {
            return false;
        }
        if (strict) {
            return !this.isSuggestWidgetVisible() && !this.isFindWidgetVisible() && !this.isRenameInputVisible();
        }
        return true;
    }
    get onFocusChanged() {
        return this.onFocusChangedEmitter.event;
    }
    get onMouseDown() {
        return this.onMouseDownEmitter.event;
    }
    /**
     * `true` if the suggest widget is visible in the editor. Otherwise, `false`.
     */
    isSuggestWidgetVisible() {
        return this.contextKeyService.match('suggestWidgetVisible', this.editor.getDomNode() || this.node);
    }
    /**
     * `true` if the find (and replace) widget is visible in the editor. Otherwise, `false`.
     */
    isFindWidgetVisible() {
        return this.contextKeyService.match('findWidgetVisible', this.editor.getDomNode() || this.node);
    }
    /**
     * `true` if the name rename refactoring input HTML element is visible. Otherwise, `false`.
     */
    isRenameInputVisible() {
        return this.contextKeyService.match('renameInputVisible', this.editor.getDomNode() || this.node);
    }
    dispose() {
        this.toDispose.dispose();
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    trigger(source, handlerId, payload) {
        this.editor.trigger(source, handlerId, payload);
    }
    getControl() {
        return this.editor;
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
        if (this.autoSizing) {
            // eslint-disable-next-line no-null/no-null
            this.resize(null);
        }
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
        if (!this.autoSizing) {
            return hostNode.offsetHeight - boxSizing.verticalSum;
        }
        const lineHeight = this.editor.getOption(monaco.editor.EditorOption.lineHeight);
        const lineCount = this.editor.getModel().getLineCount();
        const contentHeight = lineHeight * lineCount;
        const horizontalScrollbarHeight = this.editor.getLayoutInfo().horizontalScrollbarHeight;
        const editorHeight = contentHeight + horizontalScrollbarHeight;
        if (this.minHeight >= 0) {
            const minHeight = lineHeight * this.minHeight + horizontalScrollbarHeight;
            if (editorHeight < minHeight) {
                return minHeight;
            }
        }
        if (this.maxHeight >= 0) {
            const maxHeight = lineHeight * this.maxHeight + horizontalScrollbarHeight;
            return Math.min(maxHeight, editorHeight);
        }
        return editorHeight;
    }
    isActionSupported(id) {
        const action = this.editor.getAction(id);
        return !!action && action.isSupported();
    }
    async runAction(id) {
        const action = this.editor.getAction(id);
        if (action && action.isSupported()) {
            await action.run();
        }
    }
    deltaDecorations(params) {
        const oldDecorations = params.oldDecorations;
        const newDecorations = this.toDeltaDecorations(params);
        return this.editor.deltaDecorations(oldDecorations, newDecorations);
    }
    toDeltaDecorations(params) {
        return params.newDecorations.map(({ options: theiaOptions, range }) => {
            const options = {
                ...theiaOptions,
                hoverMessage: this.fromStringToMarkdownString(theiaOptions.hoverMessage),
                glyphMarginHoverMessage: this.fromStringToMarkdownString(theiaOptions.glyphMarginHoverMessage)
            };
            return {
                options,
                range: this.p2m.asRange(range),
            };
        });
    }
    fromStringToMarkdownString(hoverMessage) {
        if (typeof hoverMessage === 'string') {
            return { value: hoverMessage };
        }
        return hoverMessage;
    }
    fromMarkdownToString(maybeMarkdown) {
        if (!maybeMarkdown) {
            return undefined;
        }
        if (typeof maybeMarkdown === 'string') {
            return maybeMarkdown;
        }
        if (Array.isArray(maybeMarkdown)) {
            return maybeMarkdown.map(({ value }) => value).join('\n');
        }
        return maybeMarkdown.value;
    }
    getLinesDecorations(startLineNumber, endLineNumber) {
        const toPosition = (line) => this.p2m.asPosition({ line, character: 0 });
        const start = toPosition(startLineNumber).lineNumber;
        const end = toPosition(endLineNumber).lineNumber;
        return this.editor
            .getModel()
            .getLinesDecorations(start, end)
            .map(this.toEditorDecoration.bind(this));
    }
    toEditorDecoration(decoration) {
        const range = this.m2p.asRange(decoration.range);
        const { id, options: monacoOptions } = decoration;
        const options = {
            ...monacoOptions,
            hoverMessage: this.fromMarkdownToString(monacoOptions.hoverMessage),
            glyphMarginHoverMessage: this.fromMarkdownToString(monacoOptions.hoverMessage),
        };
        return {
            options: (0, common_1.nullToUndefined)(options),
            range,
            id
        };
    }
    getVisibleColumn(position) {
        return this.editor.getVisibleColumnFromPosition(this.p2m.asPosition(position));
    }
    async replaceText(params) {
        const edits = params.replaceOperations.map(param => {
            const range = monaco.Range.fromPositions(this.p2m.asPosition(param.range.start), this.p2m.asPosition(param.range.end));
            return {
                forceMoveMarkers: true,
                identifier: {
                    major: range.startLineNumber,
                    minor: range.startColumn
                },
                range,
                text: param.text
            };
        });
        return this.editor.executeEdits(params.source, edits);
    }
    executeEdits(edits) {
        return this.editor.executeEdits('MonacoEditor', this.p2m.asTextEdits(edits));
    }
    storeViewState() {
        return this.editor.saveViewState();
    }
    restoreViewState(state) {
        this.editor.restoreViewState(state);
    }
    get languageAutoDetected() {
        return this._languageAutoDetected;
    }
    async detectLanguage() {
        const languageService = standaloneServices_1.StandaloneServices.get(language_1.ILanguageService);
        const firstLine = this.document.textEditorModel.getLineContent(1);
        const model = this.getControl().getModel();
        const language = languageService.createByFilepathOrFirstLine(model && model.uri, firstLine);
        this.setLanguage(language.languageId);
        this._languageAutoDetected = true;
    }
    setLanguage(languageId) {
        for (const document of this.documents) {
            monaco.editor.setModelLanguage(document.textEditorModel, languageId);
        }
    }
    fireLanguageChanged(languageId) {
        this._languageAutoDetected = false;
        this.onLanguageChangedEmitter.fire(languageId);
    }
    getResourceUri() {
        return this.uri;
    }
    createMoveToUri(resourceUri) {
        return this.uri.withPath(resourceUri.path);
    }
}
exports.MonacoEditor = MonacoEditor;
(function (MonacoEditor) {
    function getAll(manager) {
        return manager.all.map(e => get(e)).filter(e => !!e);
    }
    MonacoEditor.getAll = getAll;
    function getCurrent(manager) {
        return get(manager.currentEditor);
    }
    MonacoEditor.getCurrent = getCurrent;
    function getActive(manager) {
        return get(manager.activeEditor);
    }
    MonacoEditor.getActive = getActive;
    function get(editorWidget) {
        if (editorWidget && editorWidget.editor instanceof MonacoEditor) {
            return editorWidget.editor;
        }
        return undefined;
    }
    MonacoEditor.get = get;
    function findByDocument(manager, document) {
        return getAll(manager).filter(candidate => candidate.documents.has(document));
    }
    MonacoEditor.findByDocument = findByDocument;
    function getWidgetFor(manager, control) {
        if (!control) {
            return undefined;
        }
        return manager.all.find(widget => {
            const candidate = get(widget);
            return candidate && candidate.getControl() === control;
        });
    }
    MonacoEditor.getWidgetFor = getWidgetFor;
})(MonacoEditor = exports.MonacoEditor || (exports.MonacoEditor = {}));
//# sourceMappingURL=monaco-editor.js.map