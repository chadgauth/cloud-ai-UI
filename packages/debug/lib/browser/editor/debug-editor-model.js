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
var DebugEditorModel_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebugEditorModel = exports.DebugEditorModelFactory = void 0;
const debounce = require("p-debounce");
const inversify_1 = require("@theia/core/shared/inversify");
const monaco = require("@theia/monaco-editor-core");
const configuration_1 = require("@theia/monaco-editor-core/esm/vs/platform/configuration/common/configuration");
const uri_1 = require("@theia/core/lib/common/uri");
const core_1 = require("@theia/core");
const browser_1 = require("@theia/core/lib/browser");
const monaco_frontend_module_1 = require("@theia/monaco/lib/browser/monaco-frontend-module");
const breakpoint_manager_1 = require("../breakpoint/breakpoint-manager");
const debug_session_manager_1 = require("../debug-session-manager");
const breakpoint_marker_1 = require("../breakpoint/breakpoint-marker");
const debug_editor_1 = require("./debug-editor");
const debug_hover_widget_1 = require("./debug-hover-widget");
const debug_breakpoint_widget_1 = require("./debug-breakpoint-widget");
const debug_exception_widget_1 = require("./debug-exception-widget");
const debug_inline_value_decorator_1 = require("./debug-inline-value-decorator");
exports.DebugEditorModelFactory = Symbol('DebugEditorModelFactory');
let DebugEditorModel = DebugEditorModel_1 = class DebugEditorModel {
    constructor() {
        this.toDispose = new core_1.DisposableCollection();
        this.toDisposeOnUpdate = new core_1.DisposableCollection();
        this.breakpointDecorations = [];
        this.breakpointRanges = new Map();
        this.currentBreakpointDecorations = [];
        this.editorDecorations = [];
        this.updatingDecorations = false;
        this.update = debounce(async () => {
            if (this.toDispose.disposed) {
                return;
            }
            this.toDisposeOnUpdate.dispose();
            this.toggleExceptionWidget();
            await this.updateEditorDecorations();
            this.updateEditorHover();
        }, 100);
        this.hintDecorations = [];
    }
    static createContainer(parent, editor) {
        const child = (0, debug_hover_widget_1.createDebugHoverWidgetContainer)(parent, editor);
        child.bind(DebugEditorModel_1).toSelf();
        child.bind(debug_breakpoint_widget_1.DebugBreakpointWidget).toSelf();
        child.bind(debug_exception_widget_1.DebugExceptionWidget).toSelf();
        return child;
    }
    static createModel(parent, editor) {
        return DebugEditorModel_1.createContainer(parent, editor).get(DebugEditorModel_1);
    }
    init() {
        this.uri = new uri_1.default(this.editor.getControl().getModel().uri.toString());
        this.toDispose.pushAll([
            this.hover,
            this.breakpointWidget,
            this.exceptionWidget,
            this.editor.getControl().onMouseDown(event => this.handleMouseDown(event)),
            this.editor.getControl().onMouseMove(event => this.handleMouseMove(event)),
            this.editor.getControl().onMouseLeave(event => this.handleMouseLeave(event)),
            this.editor.getControl().onKeyDown(() => this.hover.hide({ immediate: false })),
            this.editor.getControl().onDidChangeModelContent(() => this.update()),
            this.editor.getControl().getModel().onDidChangeDecorations(() => this.updateBreakpoints()),
            this.editor.onDidResize(e => this.breakpointWidget.inputSize = e),
            this.sessions.onDidChange(() => this.update()),
            this.toDisposeOnUpdate,
            this.sessionManager.onDidChangeBreakpoints(({ session, uri }) => {
                if ((!session || session === this.sessionManager.currentSession) && uri.isEqual(this.uri)) {
                    this.render();
                }
            }),
            this.breakpoints.onDidChangeBreakpoints(event => this.closeBreakpointIfAffected(event)),
        ]);
        this.update();
        this.render();
    }
    dispose() {
        this.toDispose.dispose();
    }
    /**
     * To disable the default editor-contribution hover from Code when
     * the editor has the `currentFrame`. Otherwise, both `textdocument/hover`
     * and the debug hovers are visible at the same time when hovering over a symbol.
     */
    async updateEditorHover() {
        if (this.sessions.isCurrentEditorFrame(this.uri)) {
            const codeEditor = this.editor.getControl();
            codeEditor.updateOptions({ hover: { enabled: false } });
            this.toDisposeOnUpdate.push(core_1.Disposable.create(() => {
                const model = codeEditor.getModel();
                const overrides = {
                    resource: model.uri,
                    overrideIdentifier: model.getLanguageId(),
                };
                const { enabled, delay, sticky } = this.configurationService.getValue('editor.hover', overrides);
                codeEditor.updateOptions({
                    hover: {
                        enabled,
                        delay,
                        sticky
                    }
                });
            }));
        }
    }
    async updateEditorDecorations() {
        const [newFrameDecorations, inlineValueDecorations] = await Promise.all([
            this.createFrameDecorations(),
            this.createInlineValueDecorations()
        ]);
        const codeEditor = this.editor.getControl();
        codeEditor.removeDecorations([debug_inline_value_decorator_1.INLINE_VALUE_DECORATION_KEY]);
        codeEditor.setDecorationsByType('Inline debug decorations', debug_inline_value_decorator_1.INLINE_VALUE_DECORATION_KEY, inlineValueDecorations);
        this.editorDecorations = this.deltaDecorations(this.editorDecorations, newFrameDecorations);
    }
    async createInlineValueDecorations() {
        if (!this.sessions.isCurrentEditorFrame(this.uri)) {
            return [];
        }
        const { currentFrame } = this.sessions;
        return this.inlineValueDecorator.calculateDecorations(this, currentFrame);
    }
    createFrameDecorations() {
        const { currentFrame, topFrame } = this.sessions;
        if (!currentFrame) {
            return [];
        }
        if (!this.sessions.isCurrentEditorFrame(this.uri)) {
            return [];
        }
        const decorations = [];
        const columnUntilEOLRange = new monaco.Range(currentFrame.raw.line, currentFrame.raw.column, currentFrame.raw.line, 1 << 30);
        const range = new monaco.Range(currentFrame.raw.line, currentFrame.raw.column, currentFrame.raw.line, currentFrame.raw.column + 1);
        if (topFrame === currentFrame) {
            decorations.push({
                options: DebugEditorModel_1.TOP_STACK_FRAME_MARGIN,
                range
            });
            decorations.push({
                options: DebugEditorModel_1.TOP_STACK_FRAME_DECORATION,
                range: columnUntilEOLRange
            });
            const { topFrameRange } = this;
            if (topFrameRange && topFrameRange.startLineNumber === currentFrame.raw.line && topFrameRange.startColumn !== currentFrame.raw.column) {
                decorations.push({
                    options: DebugEditorModel_1.TOP_STACK_FRAME_INLINE_DECORATION,
                    range: columnUntilEOLRange
                });
            }
            this.topFrameRange = columnUntilEOLRange;
        }
        else {
            decorations.push({
                options: DebugEditorModel_1.FOCUSED_STACK_FRAME_MARGIN,
                range
            });
            decorations.push({
                options: DebugEditorModel_1.FOCUSED_STACK_FRAME_DECORATION,
                range: columnUntilEOLRange
            });
        }
        return decorations;
    }
    async toggleExceptionWidget() {
        const { currentFrame } = this.sessions;
        if (!currentFrame) {
            return;
        }
        if (!this.sessions.isCurrentEditorFrame(this.uri)) {
            this.exceptionWidget.hide();
            return;
        }
        const info = await currentFrame.thread.getExceptionInfo();
        if (!info) {
            this.exceptionWidget.hide();
            return;
        }
        this.exceptionWidget.show({
            info,
            lineNumber: currentFrame.raw.line,
            column: currentFrame.raw.column
        });
    }
    render() {
        this.renderBreakpoints();
        this.renderCurrentBreakpoints();
    }
    renderBreakpoints() {
        const breakpoints = this.breakpoints.getBreakpoints(this.uri);
        const decorations = this.createBreakpointDecorations(breakpoints);
        this.breakpointDecorations = this.deltaDecorations(this.breakpointDecorations, decorations);
        this.updateBreakpointRanges(breakpoints);
    }
    createBreakpointDecorations(breakpoints) {
        return breakpoints.map(breakpoint => this.createBreakpointDecoration(breakpoint));
    }
    createBreakpointDecoration(breakpoint) {
        const lineNumber = breakpoint.raw.line;
        const column = breakpoint.raw.column;
        const range = typeof column === 'number' ? new monaco.Range(lineNumber, column, lineNumber, column + 1) : new monaco.Range(lineNumber, 1, lineNumber, 2);
        return {
            range,
            options: {
                stickiness: DebugEditorModel_1.STICKINESS
            }
        };
    }
    updateBreakpointRanges(breakpoints) {
        this.breakpointRanges.clear();
        for (let i = 0; i < this.breakpointDecorations.length; i++) {
            const decoration = this.breakpointDecorations[i];
            const breakpoint = breakpoints[i];
            const range = this.editor.getControl().getModel().getDecorationRange(decoration);
            this.breakpointRanges.set(decoration, [range, breakpoint]);
        }
    }
    renderCurrentBreakpoints() {
        const decorations = this.createCurrentBreakpointDecorations();
        this.currentBreakpointDecorations = this.deltaDecorations(this.currentBreakpointDecorations, decorations);
    }
    createCurrentBreakpointDecorations() {
        const breakpoints = this.sessions.getBreakpoints(this.uri);
        return breakpoints.map(breakpoint => this.createCurrentBreakpointDecoration(breakpoint));
    }
    createCurrentBreakpointDecoration(breakpoint) {
        const lineNumber = breakpoint.line;
        const column = breakpoint.column;
        const range = typeof column === 'number' ? new monaco.Range(lineNumber, column, lineNumber, column + 1) : new monaco.Range(lineNumber, 1, lineNumber, 1);
        const { className, message } = breakpoint.getDecoration();
        const renderInline = typeof column === 'number' && (column > this.editor.getControl().getModel().getLineFirstNonWhitespaceColumn(lineNumber));
        return {
            range,
            options: {
                glyphMarginClassName: className,
                glyphMarginHoverMessage: message.map(value => ({ value })),
                stickiness: DebugEditorModel_1.STICKINESS,
                beforeContentClassName: renderInline ? `theia-debug-breakpoint-column codicon ${className}` : undefined
            }
        };
    }
    updateBreakpoints() {
        if (this.areBreakpointsAffected()) {
            const breakpoints = this.createBreakpoints();
            this.breakpoints.setBreakpoints(this.uri, breakpoints);
        }
    }
    areBreakpointsAffected() {
        if (this.updatingDecorations || !this.editor.getControl().getModel()) {
            return false;
        }
        for (const decoration of this.breakpointDecorations) {
            const range = this.editor.getControl().getModel().getDecorationRange(decoration);
            const oldRange = this.breakpointRanges.get(decoration)[0];
            if (!range || !range.equalsRange(oldRange)) {
                return true;
            }
        }
        return false;
    }
    createBreakpoints() {
        var _a;
        const { uri } = this;
        const lines = new Set();
        const breakpoints = [];
        for (const decoration of this.breakpointDecorations) {
            const range = this.editor.getControl().getModel().getDecorationRange(decoration);
            if (range && !lines.has(range.startLineNumber)) {
                const line = range.startLineNumber;
                const column = range.startColumn;
                const oldBreakpoint = (_a = this.breakpointRanges.get(decoration)) === null || _a === void 0 ? void 0 : _a[1];
                const isLineBreakpoint = (oldBreakpoint === null || oldBreakpoint === void 0 ? void 0 : oldBreakpoint.raw.line) !== undefined && (oldBreakpoint === null || oldBreakpoint === void 0 ? void 0 : oldBreakpoint.raw.column) === undefined;
                const change = isLineBreakpoint ? { line } : { line, column };
                const breakpoint = breakpoint_marker_1.SourceBreakpoint.create(uri, change, oldBreakpoint);
                breakpoints.push(breakpoint);
                lines.add(line);
            }
        }
        return breakpoints;
    }
    get position() {
        return this.editor.getControl().getPosition();
    }
    getBreakpoint(position = this.position) {
        return this.getInlineBreakpoint(position) || this.getLineBreakpoints(position)[0];
    }
    getInlineBreakpoint(position = this.position) {
        return this.sessions.getInlineBreakpoint(this.uri, position.lineNumber, position.column);
    }
    getLineBreakpoints(position = this.position) {
        return this.sessions.getLineBreakpoints(this.uri, position.lineNumber);
    }
    addBreakpoint(raw) {
        this.breakpoints.addBreakpoint(breakpoint_marker_1.SourceBreakpoint.create(this.uri, raw));
    }
    toggleBreakpoint(position = this.position) {
        const { lineNumber } = position;
        const breakpoints = this.getLineBreakpoints(position);
        if (breakpoints.length) {
            for (const breakpoint of breakpoints) {
                breakpoint.remove();
            }
        }
        else {
            this.addBreakpoint({ line: lineNumber });
        }
    }
    addInlineBreakpoint() {
        const { position } = this;
        const { lineNumber, column } = position;
        const breakpoint = this.getInlineBreakpoint(position);
        if (breakpoint) {
            return;
        }
        this.addBreakpoint({ line: lineNumber, column });
    }
    acceptBreakpoint() {
        const { position, values } = this.breakpointWidget;
        if (position && values) {
            const breakpoint = position.column > 0 ? this.getInlineBreakpoint(position) : this.getLineBreakpoints(position)[0];
            if (breakpoint) {
                breakpoint.updateOrigins(values);
            }
            else {
                const { lineNumber } = position;
                const column = position.column > 0 ? position.column : undefined;
                this.addBreakpoint({ line: lineNumber, column, ...values });
            }
            this.breakpointWidget.hide();
        }
    }
    handleMouseDown(event) {
        if (event.target && event.target.type === monaco.editor.MouseTargetType.GUTTER_GLYPH_MARGIN) {
            if (!event.event.rightButton) {
                this.toggleBreakpoint(event.target.position);
            }
        }
        this.hintBreakpoint(event);
    }
    handleMouseMove(event) {
        this.showHover(event);
        this.hintBreakpoint(event);
    }
    handleMouseLeave(event) {
        this.hideHover(event);
        this.deltaHintDecorations([]);
    }
    hintBreakpoint(event) {
        const hintDecorations = this.createHintDecorations(event);
        this.deltaHintDecorations(hintDecorations);
    }
    deltaHintDecorations(hintDecorations) {
        this.hintDecorations = this.deltaDecorations(this.hintDecorations, hintDecorations);
    }
    createHintDecorations(event) {
        if (event.target && event.target.type === monaco.editor.MouseTargetType.GUTTER_GLYPH_MARGIN && event.target.position) {
            const lineNumber = event.target.position.lineNumber;
            if (this.getLineBreakpoints(event.target.position).length) {
                return [];
            }
            return [{
                    range: new monaco.Range(lineNumber, 1, lineNumber, 1),
                    options: DebugEditorModel_1.BREAKPOINT_HINT_DECORATION
                }];
        }
        return [];
    }
    closeBreakpointIfAffected({ uri, removed }) {
        if (!uri.isEqual(this.uri)) {
            return;
        }
        const position = this.breakpointWidget.position;
        if (!position) {
            return;
        }
        for (const breakpoint of removed) {
            if (breakpoint.raw.line === position.lineNumber) {
                this.breakpointWidget.hide();
                break;
            }
        }
    }
    showHover(mouseEvent) {
        const targetType = mouseEvent.target.type;
        const stopKey = core_1.isOSX ? 'metaKey' : 'ctrlKey';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (targetType === monaco.editor.MouseTargetType.CONTENT_WIDGET && mouseEvent.target.detail === this.hover.getId() && !mouseEvent.event[stopKey]) {
            // mouse moved on top of debug hover widget
            return;
        }
        if (targetType === monaco.editor.MouseTargetType.CONTENT_TEXT) {
            this.hover.show({
                selection: mouseEvent.target.range,
                immediate: false
            });
        }
        else {
            this.hover.hide({ immediate: false });
        }
    }
    hideHover({ event }) {
        const rect = this.hover.getDomNode().getBoundingClientRect();
        if (event.posx < rect.left || event.posx > rect.right || event.posy < rect.top || event.posy > rect.bottom) {
            this.hover.hide({ immediate: false });
        }
    }
    deltaDecorations(oldDecorations, newDecorations) {
        this.updatingDecorations = true;
        try {
            return this.editor.getControl().deltaDecorations(oldDecorations, newDecorations);
        }
        finally {
            this.updatingDecorations = false;
        }
    }
};
DebugEditorModel.CONTEXT_MENU = ['debug-editor-context-menu'];
DebugEditorModel.STICKINESS = monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges;
DebugEditorModel.BREAKPOINT_HINT_DECORATION = {
    glyphMarginClassName: 'codicon-debug-hint',
    stickiness: DebugEditorModel_1.STICKINESS
};
DebugEditorModel.TOP_STACK_FRAME_MARGIN = {
    glyphMarginClassName: 'codicon-debug-stackframe',
    stickiness: DebugEditorModel_1.STICKINESS
};
DebugEditorModel.FOCUSED_STACK_FRAME_MARGIN = {
    glyphMarginClassName: 'codicon-debug-stackframe-focused',
    stickiness: DebugEditorModel_1.STICKINESS
};
DebugEditorModel.TOP_STACK_FRAME_DECORATION = {
    isWholeLine: true,
    className: 'theia-debug-top-stack-frame-line',
    stickiness: DebugEditorModel_1.STICKINESS
};
DebugEditorModel.TOP_STACK_FRAME_INLINE_DECORATION = {
    beforeContentClassName: 'theia-debug-top-stack-frame-column'
};
DebugEditorModel.FOCUSED_STACK_FRAME_DECORATION = {
    isWholeLine: true,
    className: 'theia-debug-focused-stack-frame-line',
    stickiness: DebugEditorModel_1.STICKINESS
};
__decorate([
    (0, inversify_1.inject)(debug_hover_widget_1.DebugHoverWidget),
    __metadata("design:type", debug_hover_widget_1.DebugHoverWidget)
], DebugEditorModel.prototype, "hover", void 0);
__decorate([
    (0, inversify_1.inject)(debug_editor_1.DebugEditor),
    __metadata("design:type", Object)
], DebugEditorModel.prototype, "editor", void 0);
__decorate([
    (0, inversify_1.inject)(breakpoint_manager_1.BreakpointManager),
    __metadata("design:type", breakpoint_manager_1.BreakpointManager)
], DebugEditorModel.prototype, "breakpoints", void 0);
__decorate([
    (0, inversify_1.inject)(debug_session_manager_1.DebugSessionManager),
    __metadata("design:type", debug_session_manager_1.DebugSessionManager)
], DebugEditorModel.prototype, "sessions", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.ContextMenuRenderer),
    __metadata("design:type", browser_1.ContextMenuRenderer)
], DebugEditorModel.prototype, "contextMenu", void 0);
__decorate([
    (0, inversify_1.inject)(debug_breakpoint_widget_1.DebugBreakpointWidget),
    __metadata("design:type", debug_breakpoint_widget_1.DebugBreakpointWidget)
], DebugEditorModel.prototype, "breakpointWidget", void 0);
__decorate([
    (0, inversify_1.inject)(debug_exception_widget_1.DebugExceptionWidget),
    __metadata("design:type", debug_exception_widget_1.DebugExceptionWidget)
], DebugEditorModel.prototype, "exceptionWidget", void 0);
__decorate([
    (0, inversify_1.inject)(debug_inline_value_decorator_1.DebugInlineValueDecorator),
    __metadata("design:type", debug_inline_value_decorator_1.DebugInlineValueDecorator)
], DebugEditorModel.prototype, "inlineValueDecorator", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_frontend_module_1.MonacoConfigurationService),
    __metadata("design:type", Object)
], DebugEditorModel.prototype, "configurationService", void 0);
__decorate([
    (0, inversify_1.inject)(debug_session_manager_1.DebugSessionManager),
    __metadata("design:type", debug_session_manager_1.DebugSessionManager)
], DebugEditorModel.prototype, "sessionManager", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DebugEditorModel.prototype, "init", null);
DebugEditorModel = DebugEditorModel_1 = __decorate([
    (0, inversify_1.injectable)()
], DebugEditorModel);
exports.DebugEditorModel = DebugEditorModel;
//# sourceMappingURL=debug-editor-model.js.map