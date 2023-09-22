"use strict";
// *****************************************************************************
// Copyright (C) 2018 Red Hat, Inc. and others.
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
// copied from https://github.com/microsoft/vscode/blob/1.37.0/src/vs/workbench/api/common/extHostTypes.ts
/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT License. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _a, _NotebookCellOutputItem_encoder;
var URI_1, Disposable_1, Position_1, Range_1, SnippetString_1, ThemeIcon_1, TextEdit_1, Location_1, NotebookEdit_1, CodeActionKind_1, SymbolInformation_1, DocumentSymbol_1, FileSystemError_1, TaskGroup_1, CallHierarchyItem_1, TypeHierarchyItem_1, TestMessage_1, SemanticTokensBuilder_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotebookCellExecutionState = exports.NotebookEditorRevealType = exports.NotebookControllerAffinity = exports.NotebookCellStatusBarAlignment = exports.NotebookCellKind = exports.MarkerTag = exports.MarkerSeverity = exports.Diagnostic = exports.CompletionItemTag = exports.DiagnosticTag = exports.DiagnosticRelatedInformation = exports.Location = exports.DebugConsoleMode = exports.DiagnosticSeverity = exports.InlineCompletionList = exports.InlineCompletionItem = exports.InlineCompletionTriggerKind = exports.CompletionList = exports.CompletionItem = exports.CompletionItemKind = exports.CompletionTriggerKind = exports.TextEdit = exports.IndentAction = exports.RelativePattern = exports.ConfigurationTarget = exports.OverviewRulerLane = exports.DecorationRangeBehavior = exports.TextEditorRevealType = exports.ThemeIcon = exports.ThemeColor = exports.SnippetString = exports.EnvironmentVariableMutatorType = exports.EndOfLine = exports.TextDocumentShowOptions = exports.Selection = exports.Range = exports.Position = exports.TextDocumentChangeReason = exports.TextEditorSelectionChangeKind = exports.ColorTheme = exports.ExternalUriOpenerPriority = exports.SourceControlInputBoxValidationType = exports.ExtensionKind = exports.ExtensionMode = exports.ColorThemeKind = exports.ViewColumn = exports.TextEditorLineNumbersStyle = exports.StatusBarAlignment = exports.Disposable = exports.URI = void 0;
exports.CommentMode = exports.FileDecoration = exports.TerminalQuickFixType = exports.TerminalExitReason = exports.TerminalProfile = exports.TerminalOutputAnchor = exports.TerminalLocation = exports.TerminalLink = exports.QuickInputButtons = exports.CommentThreadCollapsibleState = exports.CommentThreadState = exports.DocumentSymbol = exports.SymbolInformation = exports.SymbolTag = exports.TreeItemCheckboxState = exports.TreeItemCollapsibleState = exports.TreeItem = exports.DataTransfer = exports.DataTransferItem = exports.WorkspaceEdit = exports.CodeAction = exports.TextDocumentSaveReason = exports.CodeActionKind = exports.CodeActionTriggerKind = exports.CodeActionTrigger = exports.CodeLens = exports.DocumentDropEdit = exports.DocumentLink = exports.DocumentHighlight = exports.DocumentHighlightKind = exports.InlineValueEvaluatableExpression = exports.InlineValueVariableLookup = exports.InlineValueText = exports.InlineValueContext = exports.EvaluatableExpression = exports.Hover = exports.SignatureHelp = exports.SignatureHelpTriggerKind = exports.SignatureInformation = exports.ParameterInformation = exports.NotebookRendererScript = exports.NotebookEdit = exports.SnippetTextEdit = exports.NotebookRange = exports.NotebookData = exports.NotebookCellStatusBarItem = exports.NotebookCellOutputItem = exports.NotebookCellOutput = exports.NotebookCellData = exports.NotebookKernelSourceAction = void 0;
exports.SemanticTokensLegend = exports.TimelineItem = exports.TestMessage = exports.TestRunRequest = exports.TestTag = exports.TestRunProfileKind = exports.LinkedEditingRanges = exports.LanguageStatusSeverity = exports.TypeHierarchyItem = exports.CallHierarchyOutgoingCall = exports.CallHierarchyIncomingCall = exports.CallHierarchyItem = exports.UIKind = exports.WebviewPanelTargetArea = exports.OperatingSystem = exports.SelectionRange = exports.FoldingRangeKind = exports.FoldingRange = exports.InlayHintKind = exports.InlayHint = exports.InlayHintLabelPart = exports.ColorFormat = exports.ColorPresentation = exports.ColorInformation = exports.Color = exports.FunctionBreakpoint = exports.SourceBreakpoint = exports.Breakpoint = exports.LogLevel = exports.DebugAdapterInlineImplementation = exports.DebugAdapterNamedPipeServer = exports.DebugAdapterServer = exports.DebugAdapterExecutable = exports.Task2 = exports.Task = exports.TaskScope = exports.TaskGroup = exports.CustomExecution = exports.ShellExecution = exports.TaskRevealKind = exports.TaskPanelKind = exports.ShellQuoting = exports.QuickPickItemKind = exports.ProcessExecution = exports.ProgressLocation = exports.Progress = exports.ProgressOptions = exports.FileType = exports.FileSystemError = exports.FileChangeType = void 0;
exports.EditSessionIdentityMatch = exports.DocumentPasteEdit = exports.InteractiveWindowInput = exports.TerminalEditorTabInput = exports.NotebookDiffEditorTabInput = exports.NotebookEditorTabInput = exports.TelemetryLogger = exports.TelemetryTrustedValue = exports.WebviewEditorTabInput = exports.CustomEditorTabInput = exports.TextMergeTabInput = exports.TextDiffTabInput = exports.TextTabInput = exports.InputBoxValidationSeverity = exports.SemanticTokensEdits = exports.SemanticTokensEdit = exports.SemanticTokens = exports.SemanticTokensBuilder = void 0;
/* eslint-disable no-null/no-null */
const coreutils_1 = require("@theia/core/shared/@phosphor/coreutils");
const errors_1 = require("../common/errors");
const vscode_uri_1 = require("@theia/core/shared/vscode-uri");
const paths_util_1 = require("../common/paths-util");
const strings_1 = require("@theia/core/lib/common/strings");
const plugin_api_rpc_model_1 = require("../common/plugin-api-rpc-model");
const files_1 = require("@theia/filesystem/lib/common/files");
const paths = require("path");
const types_1 = require("../common/types");
const common_1 = require("@theia/core/lib/common");
/**
 * This is an implementation of #theia.Uri based on vscode-uri.
 * This is supposed to fix https://github.com/eclipse-theia/theia/issues/8752
 * We cannot simply upgrade the dependency, because the current version 3.x
 * is not compatible with our current codebase
 */
let URI = URI_1 = class URI extends vscode_uri_1.URI {
    constructor(schemeOrData, authority, path, query, fragment, _strict = false) {
        if (typeof schemeOrData === 'string') {
            super(schemeOrData, authority, path, query, fragment, _strict);
        }
        else {
            super(schemeOrData);
        }
    }
    /**
     * Override to create the correct class.
     */
    with(change) {
        return new URI_1(super.with(change));
    }
    static joinPath(uri, ...pathSegments) {
        if (!uri.path) {
            throw new Error('\'joinPath\' called on URI without path');
        }
        const newPath = paths.posix.join(uri.path, ...pathSegments);
        return new URI_1(uri.scheme, uri.authority, newPath, uri.query, uri.fragment);
    }
    static revive(data) {
        const uri = vscode_uri_1.URI.revive(data);
        return uri ? new URI_1(uri) : undefined;
    }
    static parse(value, _strict) {
        return new URI_1(vscode_uri_1.URI.parse(value, _strict));
    }
    static file(path) {
        return new URI_1(vscode_uri_1.URI.file(path));
    }
    /**
     * There is quite some magic in to vscode URI class related to
     * transferring via JSON.stringify(). Making the CodeURI instance
     * makes sure we transfer this object as a vscode-uri URI.
     */
    toJSON() {
        return vscode_uri_1.URI.from(this).toJSON();
    }
};
URI = URI_1 = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [Object, String, String, String, String, Boolean])
], URI);
exports.URI = URI;
let Disposable = Disposable_1 = class Disposable {
    constructor(func) {
        this.disposable = func;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static from(...disposables) {
        return new Disposable_1(() => {
            if (disposables) {
                for (const disposable of disposables) {
                    if (disposable && typeof disposable.dispose === 'function') {
                        disposable.dispose();
                    }
                }
            }
        });
    }
    /**
     * Dispose this object.
     */
    dispose() {
        if (this.disposable) {
            this.disposable();
            this.disposable = undefined;
        }
    }
    static create(func) {
        return new Disposable_1(func);
    }
};
Disposable = Disposable_1 = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [Function])
], Disposable);
exports.Disposable = Disposable;
var StatusBarAlignment;
(function (StatusBarAlignment) {
    StatusBarAlignment[StatusBarAlignment["Left"] = 1] = "Left";
    StatusBarAlignment[StatusBarAlignment["Right"] = 2] = "Right";
})(StatusBarAlignment = exports.StatusBarAlignment || (exports.StatusBarAlignment = {}));
var TextEditorLineNumbersStyle;
(function (TextEditorLineNumbersStyle) {
    TextEditorLineNumbersStyle[TextEditorLineNumbersStyle["Off"] = 0] = "Off";
    TextEditorLineNumbersStyle[TextEditorLineNumbersStyle["On"] = 1] = "On";
    TextEditorLineNumbersStyle[TextEditorLineNumbersStyle["Relative"] = 2] = "Relative";
})(TextEditorLineNumbersStyle = exports.TextEditorLineNumbersStyle || (exports.TextEditorLineNumbersStyle = {}));
/**
 * Denotes a column in the editor window.
 * Columns are used to show editors side by side.
 */
var ViewColumn;
(function (ViewColumn) {
    ViewColumn[ViewColumn["Active"] = -1] = "Active";
    ViewColumn[ViewColumn["Beside"] = -2] = "Beside";
    ViewColumn[ViewColumn["One"] = 1] = "One";
    ViewColumn[ViewColumn["Two"] = 2] = "Two";
    ViewColumn[ViewColumn["Three"] = 3] = "Three";
    ViewColumn[ViewColumn["Four"] = 4] = "Four";
    ViewColumn[ViewColumn["Five"] = 5] = "Five";
    ViewColumn[ViewColumn["Six"] = 6] = "Six";
    ViewColumn[ViewColumn["Seven"] = 7] = "Seven";
    ViewColumn[ViewColumn["Eight"] = 8] = "Eight";
    ViewColumn[ViewColumn["Nine"] = 9] = "Nine";
})(ViewColumn = exports.ViewColumn || (exports.ViewColumn = {}));
/**
 * Represents a color theme kind.
 */
var ColorThemeKind;
(function (ColorThemeKind) {
    ColorThemeKind[ColorThemeKind["Light"] = 1] = "Light";
    ColorThemeKind[ColorThemeKind["Dark"] = 2] = "Dark";
    ColorThemeKind[ColorThemeKind["HighContrast"] = 3] = "HighContrast";
    ColorThemeKind[ColorThemeKind["HighContrastLight"] = 4] = "HighContrastLight";
})(ColorThemeKind = exports.ColorThemeKind || (exports.ColorThemeKind = {}));
var ExtensionMode;
(function (ExtensionMode) {
    /**
     * The extension is installed normally (for example, from the marketplace
     * or VSIX) in the editor.
     */
    ExtensionMode[ExtensionMode["Production"] = 1] = "Production";
    /**
     * The extension is running from an `--extensionDevelopmentPath` provided
     * when launching the editor.
     */
    ExtensionMode[ExtensionMode["Development"] = 2] = "Development";
    /**
     * The extension is running from an `--extensionTestsPath` and
     * the extension host is running unit tests.
     */
    ExtensionMode[ExtensionMode["Test"] = 3] = "Test";
})(ExtensionMode = exports.ExtensionMode || (exports.ExtensionMode = {}));
var ExtensionKind;
(function (ExtensionKind) {
    ExtensionKind[ExtensionKind["UI"] = 1] = "UI";
    ExtensionKind[ExtensionKind["Workspace"] = 2] = "Workspace";
})(ExtensionKind = exports.ExtensionKind || (exports.ExtensionKind = {}));
/**
 * Represents the validation type of the Source Control input.
 */
var SourceControlInputBoxValidationType;
(function (SourceControlInputBoxValidationType) {
    /**
     * Something not allowed by the rules of a language or other means.
     */
    SourceControlInputBoxValidationType[SourceControlInputBoxValidationType["Error"] = 0] = "Error";
    /**
     * Something suspicious but allowed.
     */
    SourceControlInputBoxValidationType[SourceControlInputBoxValidationType["Warning"] = 1] = "Warning";
    /**
     * Something to inform about but not a problem.
     */
    SourceControlInputBoxValidationType[SourceControlInputBoxValidationType["Information"] = 2] = "Information";
})(SourceControlInputBoxValidationType = exports.SourceControlInputBoxValidationType || (exports.SourceControlInputBoxValidationType = {}));
var ExternalUriOpenerPriority;
(function (ExternalUriOpenerPriority) {
    ExternalUriOpenerPriority[ExternalUriOpenerPriority["None"] = 0] = "None";
    ExternalUriOpenerPriority[ExternalUriOpenerPriority["Option"] = 1] = "Option";
    ExternalUriOpenerPriority[ExternalUriOpenerPriority["Default"] = 2] = "Default";
    ExternalUriOpenerPriority[ExternalUriOpenerPriority["Preferred"] = 3] = "Preferred";
})(ExternalUriOpenerPriority = exports.ExternalUriOpenerPriority || (exports.ExternalUriOpenerPriority = {}));
let ColorTheme = class ColorTheme {
    constructor(kind) {
        this.kind = kind;
    }
};
ColorTheme = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [Number])
], ColorTheme);
exports.ColorTheme = ColorTheme;
/**
 * Represents sources that can cause `window.onDidChangeEditorSelection`
 */
var TextEditorSelectionChangeKind;
(function (TextEditorSelectionChangeKind) {
    TextEditorSelectionChangeKind[TextEditorSelectionChangeKind["Keyboard"] = 1] = "Keyboard";
    TextEditorSelectionChangeKind[TextEditorSelectionChangeKind["Mouse"] = 2] = "Mouse";
    TextEditorSelectionChangeKind[TextEditorSelectionChangeKind["Command"] = 3] = "Command";
})(TextEditorSelectionChangeKind = exports.TextEditorSelectionChangeKind || (exports.TextEditorSelectionChangeKind = {}));
(function (TextEditorSelectionChangeKind) {
    function fromValue(s) {
        switch (s) {
            case 'keyboard': return TextEditorSelectionChangeKind.Keyboard;
            case 'mouse': return TextEditorSelectionChangeKind.Mouse;
            case 'api': return TextEditorSelectionChangeKind.Command;
        }
        return undefined;
    }
    TextEditorSelectionChangeKind.fromValue = fromValue;
})(TextEditorSelectionChangeKind = exports.TextEditorSelectionChangeKind || (exports.TextEditorSelectionChangeKind = {}));
var TextDocumentChangeReason;
(function (TextDocumentChangeReason) {
    TextDocumentChangeReason[TextDocumentChangeReason["Undo"] = 1] = "Undo";
    TextDocumentChangeReason[TextDocumentChangeReason["Redo"] = 2] = "Redo";
})(TextDocumentChangeReason = exports.TextDocumentChangeReason || (exports.TextDocumentChangeReason = {}));
let Position = Position_1 = class Position {
    constructor(line, char) {
        if (line < 0) {
            throw new Error('line number cannot be negative');
        }
        if (char < 0) {
            throw new Error('char number cannot be negative');
        }
        this._line = line;
        this._character = char;
    }
    get line() {
        return this._line;
    }
    get character() {
        return this._character;
    }
    isBefore(other) {
        if (this._line < other._line) {
            return true;
        }
        if (other._line < this._line) {
            return false;
        }
        return this._character < other._character;
    }
    isBeforeOrEqual(other) {
        if (this._line < other._line) {
            return true;
        }
        if (other._line < this._line) {
            return false;
        }
        return this._character <= other._character;
    }
    isAfter(other) {
        return !this.isBeforeOrEqual(other);
    }
    isAfterOrEqual(other) {
        return !this.isBefore(other);
    }
    isEqual(other) {
        return this._line === other._line && this._character === other._character;
    }
    compareTo(other) {
        if (this._line < other._line) {
            return -1;
        }
        else if (this._line > other.line) {
            return 1;
        }
        else {
            // equal line
            if (this._character < other._character) {
                return -1;
            }
            else if (this._character > other._character) {
                return 1;
            }
            else {
                // equal line and character
                return 0;
            }
        }
    }
    translate(lineDeltaOrChange, characterDelta = 0) {
        if (lineDeltaOrChange === null || characterDelta === null) {
            throw (0, errors_1.illegalArgument)();
        }
        let lineDelta;
        if (typeof lineDeltaOrChange === 'undefined') {
            lineDelta = 0;
        }
        else if (typeof lineDeltaOrChange === 'number') {
            lineDelta = lineDeltaOrChange;
        }
        else {
            lineDelta = typeof lineDeltaOrChange.lineDelta === 'number' ? lineDeltaOrChange.lineDelta : 0;
            characterDelta = typeof lineDeltaOrChange.characterDelta === 'number' ? lineDeltaOrChange.characterDelta : 0;
        }
        if (lineDelta === 0 && characterDelta === 0) {
            return this;
        }
        return new Position_1(this.line + lineDelta, this.character + characterDelta);
    }
    with(lineOrChange, character = this.character) {
        if (lineOrChange === null || character === null) {
            throw (0, errors_1.illegalArgument)();
        }
        let line;
        if (typeof lineOrChange === 'undefined') {
            line = this.line;
        }
        else if (typeof lineOrChange === 'number') {
            line = lineOrChange;
        }
        else {
            line = typeof lineOrChange.line === 'number' ? lineOrChange.line : this.line;
            character = typeof lineOrChange.character === 'number' ? lineOrChange.character : this.character;
        }
        if (line === this.line && character === this.character) {
            return this;
        }
        return new Position_1(line, character);
    }
    static Min(...positions) {
        let result = positions.pop();
        for (const p of positions) {
            if (p.isBefore(result)) {
                result = p;
            }
        }
        return result;
    }
    static Max(...positions) {
        let result = positions.pop();
        for (const p of positions) {
            if (p.isAfter(result)) {
                result = p;
            }
        }
        return result;
    }
    static isPosition(other) {
        if (!other) {
            return false;
        }
        if (typeof other !== 'object' || Array.isArray(other)) {
            return false;
        }
        if (other instanceof Position_1) {
            return true;
        }
        const { line, character } = other;
        if (typeof line === 'number' && typeof character === 'number') {
            return true;
        }
        return false;
    }
    toJSON() {
        return { line: this.line, character: this.character };
    }
};
Position = Position_1 = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [Number, Number])
], Position);
exports.Position = Position;
let Range = Range_1 = class Range {
    constructor(startLineOrStart, startColumnOrEnd, endLine, endColumn) {
        let start = undefined;
        let end = undefined;
        if (typeof startLineOrStart === 'number' && typeof startColumnOrEnd === 'number' && typeof endLine === 'number' && typeof endColumn === 'number') {
            start = new Position(startLineOrStart, startColumnOrEnd);
            end = new Position(endLine, endColumn);
        }
        else if (startLineOrStart instanceof Position && startColumnOrEnd instanceof Position) {
            start = startLineOrStart;
            end = startColumnOrEnd;
        }
        if (!start || !end) {
            throw new Error('Invalid arguments');
        }
        if (start.isBefore(end)) {
            this._start = start;
            this._end = end;
        }
        else {
            this._start = end;
            this._end = start;
        }
    }
    get start() {
        return this._start;
    }
    get end() {
        return this._end;
    }
    contains(positionOrRange) {
        if (positionOrRange instanceof Range_1) {
            return this.contains(positionOrRange._start)
                && this.contains(positionOrRange._end);
        }
        else if (positionOrRange instanceof Position) {
            if (positionOrRange.isBefore(this._start)) {
                return false;
            }
            if (this._end.isBefore(positionOrRange)) {
                return false;
            }
            return true;
        }
        return false;
    }
    isEqual(other) {
        return this._start.isEqual(other._start) && this._end.isEqual(other._end);
    }
    intersection(other) {
        const start = Position.Max(other.start, this._start);
        const end = Position.Min(other.end, this._end);
        if (start.isAfter(end)) {
            // this happens when there is no overlap:
            // |-----|
            //          |----|
            return undefined;
        }
        return new Range_1(start, end);
    }
    union(other) {
        if (this.contains(other)) {
            return this;
        }
        else if (other.contains(this)) {
            return other;
        }
        const start = Position.Min(other.start, this._start);
        const end = Position.Max(other.end, this.end);
        return new Range_1(start, end);
    }
    get isEmpty() {
        return this._start.isEqual(this._end);
    }
    get isSingleLine() {
        return this._start.line === this._end.line;
    }
    with(startOrChange, end = this.end) {
        if (startOrChange === null || end === null) {
            throw (0, errors_1.illegalArgument)();
        }
        let start;
        if (!startOrChange) {
            start = this.start;
        }
        else if (Position.isPosition(startOrChange)) {
            start = startOrChange;
        }
        else {
            start = startOrChange.start || this.start;
            end = startOrChange.end || this.end;
        }
        if (start.isEqual(this._start) && end.isEqual(this.end)) {
            return this;
        }
        return new Range_1(start, end);
    }
    static isRange(arg) {
        if (arg instanceof Range_1) {
            return true;
        }
        return (0, common_1.isObject)(arg)
            && Position.isPosition(arg.start)
            && Position.isPosition(arg.end);
    }
    toJSON() {
        return [this.start, this.end];
    }
};
Range = Range_1 = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [Object, Object, Number, Number])
], Range);
exports.Range = Range;
let Selection = class Selection extends Range {
    constructor(anchorLineOrAnchor, anchorColumnOrActive, activeLine, activeColumn) {
        let anchor = undefined;
        let active = undefined;
        if (typeof anchorLineOrAnchor === 'number' && typeof anchorColumnOrActive === 'number' && typeof activeLine === 'number' && typeof activeColumn === 'number') {
            anchor = new Position(anchorLineOrAnchor, anchorColumnOrActive);
            active = new Position(activeLine, activeColumn);
        }
        else if (anchorLineOrAnchor instanceof Position && anchorColumnOrActive instanceof Position) {
            anchor = anchorLineOrAnchor;
            active = anchorColumnOrActive;
        }
        if (!anchor || !active) {
            throw new Error('Invalid arguments');
        }
        super(anchor, active);
        this._anchor = anchor;
        this._active = active;
    }
    get active() {
        return this._active;
    }
    get anchor() {
        return this._anchor;
    }
    get isReversed() {
        return this._anchor === this._end;
    }
};
Selection = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [Object, Object, Number, Number])
], Selection);
exports.Selection = Selection;
var TextDocumentShowOptions;
(function (TextDocumentShowOptions) {
    /**
     * @param candidate
     * @returns `true` if `candidate` is an instance of options that includes a selection.
     * This function should be used to determine whether TextDocumentOptions passed into commands by plugins
     * need to be translated to TextDocumentShowOptions in the style of the RPC model. Selection is the only field that requires translation.
     */
    function isTextDocumentShowOptions(candidate) {
        if (!candidate) {
            return false;
        }
        const options = candidate;
        return Range.isRange(options.selection);
    }
    TextDocumentShowOptions.isTextDocumentShowOptions = isTextDocumentShowOptions;
})(TextDocumentShowOptions = exports.TextDocumentShowOptions || (exports.TextDocumentShowOptions = {}));
var EndOfLine;
(function (EndOfLine) {
    EndOfLine[EndOfLine["LF"] = 1] = "LF";
    EndOfLine[EndOfLine["CRLF"] = 2] = "CRLF";
})(EndOfLine = exports.EndOfLine || (exports.EndOfLine = {}));
var EnvironmentVariableMutatorType;
(function (EnvironmentVariableMutatorType) {
    EnvironmentVariableMutatorType[EnvironmentVariableMutatorType["Replace"] = 1] = "Replace";
    EnvironmentVariableMutatorType[EnvironmentVariableMutatorType["Append"] = 2] = "Append";
    EnvironmentVariableMutatorType[EnvironmentVariableMutatorType["Prepend"] = 3] = "Prepend";
})(EnvironmentVariableMutatorType = exports.EnvironmentVariableMutatorType || (exports.EnvironmentVariableMutatorType = {}));
let SnippetString = SnippetString_1 = class SnippetString {
    constructor(value) {
        this._tabstop = 1;
        this.value = value || '';
    }
    static isSnippetString(thing) {
        if (thing instanceof SnippetString_1) {
            return true;
        }
        if (!thing) {
            return false;
        }
        return typeof thing.value === 'string';
    }
    static _escape(value) {
        return value.replace(/\$|}|\\/g, '\\$&');
    }
    appendText(string) {
        this.value += SnippetString_1._escape(string);
        return this;
    }
    appendTabstop(number = this._tabstop++) {
        this.value += '$';
        this.value += number;
        return this;
    }
    appendPlaceholder(value, number = this._tabstop++) {
        if (typeof value === 'function') {
            const nested = new SnippetString_1();
            nested._tabstop = this._tabstop;
            value(nested);
            this._tabstop = nested._tabstop;
            value = nested.value;
        }
        else {
            value = SnippetString_1._escape(value);
        }
        this.value += '${';
        this.value += number;
        this.value += ':';
        this.value += value;
        this.value += '}';
        return this;
    }
    appendChoice(values, number = this._tabstop++) {
        const value = values.map(s => s.replace(/\$|}|\\|,/g, '\\$&')).join(',');
        this.value += `\$\{${number}|${value}|\}`;
        return this;
    }
    appendVariable(name, defaultValue) {
        if (typeof defaultValue === 'function') {
            const nested = new SnippetString_1();
            nested._tabstop = this._tabstop;
            defaultValue(nested);
            this._tabstop = nested._tabstop;
            defaultValue = nested.value;
        }
        else if (typeof defaultValue === 'string') {
            defaultValue = defaultValue.replace(/\$|}/g, '\\$&');
        }
        this.value += '${';
        this.value += name;
        if (defaultValue) {
            this.value += ':';
            this.value += defaultValue;
        }
        this.value += '}';
        return this;
    }
};
SnippetString = SnippetString_1 = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [String])
], SnippetString);
exports.SnippetString = SnippetString;
let ThemeColor = class ThemeColor {
    constructor(id) {
        this.id = id;
    }
};
ThemeColor = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [String])
], ThemeColor);
exports.ThemeColor = ThemeColor;
let ThemeIcon = ThemeIcon_1 = class ThemeIcon {
    constructor(id, color) {
        this.id = id;
        this.color = color;
    }
};
ThemeIcon.File = new ThemeIcon_1('file');
ThemeIcon.Folder = new ThemeIcon_1('folder');
ThemeIcon = ThemeIcon_1 = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [String, ThemeColor])
], ThemeIcon);
exports.ThemeIcon = ThemeIcon;
(function (ThemeIcon) {
    function is(item) {
        return (0, common_1.isObject)(item) && 'id' in item;
    }
    ThemeIcon.is = is;
})(ThemeIcon = exports.ThemeIcon || (exports.ThemeIcon = {}));
exports.ThemeIcon = ThemeIcon;
var TextEditorRevealType;
(function (TextEditorRevealType) {
    TextEditorRevealType[TextEditorRevealType["Default"] = 0] = "Default";
    TextEditorRevealType[TextEditorRevealType["InCenter"] = 1] = "InCenter";
    TextEditorRevealType[TextEditorRevealType["InCenterIfOutsideViewport"] = 2] = "InCenterIfOutsideViewport";
    TextEditorRevealType[TextEditorRevealType["AtTop"] = 3] = "AtTop";
})(TextEditorRevealType = exports.TextEditorRevealType || (exports.TextEditorRevealType = {}));
/**
 * These values match very carefully the values of `TrackedRangeStickiness`
 */
var DecorationRangeBehavior;
(function (DecorationRangeBehavior) {
    /**
     * TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges
     */
    DecorationRangeBehavior[DecorationRangeBehavior["OpenOpen"] = 0] = "OpenOpen";
    /**
     * TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges
     */
    DecorationRangeBehavior[DecorationRangeBehavior["ClosedClosed"] = 1] = "ClosedClosed";
    /**
     * TrackedRangeStickiness.GrowsOnlyWhenTypingBefore
     */
    DecorationRangeBehavior[DecorationRangeBehavior["OpenClosed"] = 2] = "OpenClosed";
    /**
     * TrackedRangeStickiness.GrowsOnlyWhenTypingAfter
     */
    DecorationRangeBehavior[DecorationRangeBehavior["ClosedOpen"] = 3] = "ClosedOpen";
})(DecorationRangeBehavior = exports.DecorationRangeBehavior || (exports.DecorationRangeBehavior = {}));
/**
 * Vertical Lane in the overview ruler of the editor.
 */
var OverviewRulerLane;
(function (OverviewRulerLane) {
    OverviewRulerLane[OverviewRulerLane["Left"] = 1] = "Left";
    OverviewRulerLane[OverviewRulerLane["Center"] = 2] = "Center";
    OverviewRulerLane[OverviewRulerLane["Right"] = 4] = "Right";
    OverviewRulerLane[OverviewRulerLane["Full"] = 7] = "Full";
})(OverviewRulerLane = exports.OverviewRulerLane || (exports.OverviewRulerLane = {}));
var ConfigurationTarget;
(function (ConfigurationTarget) {
    ConfigurationTarget[ConfigurationTarget["Global"] = 1] = "Global";
    ConfigurationTarget[ConfigurationTarget["Workspace"] = 2] = "Workspace";
    ConfigurationTarget[ConfigurationTarget["WorkspaceFolder"] = 3] = "WorkspaceFolder";
    ConfigurationTarget[ConfigurationTarget["Default"] = 4] = "Default";
    ConfigurationTarget[ConfigurationTarget["Memory"] = 5] = "Memory";
})(ConfigurationTarget = exports.ConfigurationTarget || (exports.ConfigurationTarget = {}));
let RelativePattern = class RelativePattern {
    constructor(base, pattern) {
        this.pattern = pattern;
        if (typeof base !== 'string') {
            if (!base || !URI.isUri(base) && !URI.isUri(base.uri)) {
                throw (0, errors_1.illegalArgument)('base');
            }
        }
        if (typeof pattern !== 'string') {
            throw (0, errors_1.illegalArgument)('pattern');
        }
        if (typeof base === 'string') {
            this.baseUri = URI.file(base);
        }
        else if (URI.isUri(base)) {
            this.baseUri = base;
        }
        else {
            this.baseUri = base.uri;
        }
    }
    get base() {
        return this._base;
    }
    set base(base) {
        this._base = base;
        this._baseUri = URI.file(base);
    }
    get baseUri() {
        return this._baseUri;
    }
    set baseUri(baseUri) {
        this._baseUri = baseUri;
        this.base = baseUri.fsPath;
    }
    pathToRelative(from, to) {
        return (0, paths_util_1.relative)(from, to);
    }
};
RelativePattern = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [Object, String])
], RelativePattern);
exports.RelativePattern = RelativePattern;
var IndentAction;
(function (IndentAction) {
    IndentAction[IndentAction["None"] = 0] = "None";
    IndentAction[IndentAction["Indent"] = 1] = "Indent";
    IndentAction[IndentAction["IndentOutdent"] = 2] = "IndentOutdent";
    IndentAction[IndentAction["Outdent"] = 3] = "Outdent";
})(IndentAction = exports.IndentAction || (exports.IndentAction = {}));
let TextEdit = TextEdit_1 = class TextEdit {
    constructor(range, newText) {
        this.range = range;
        this.newText = newText;
    }
    get range() {
        return this._range;
    }
    set range(value) {
        if (value && !Range.isRange(value)) {
            throw (0, errors_1.illegalArgument)('range');
        }
        this._range = value;
    }
    get newText() {
        return this._newText || '';
    }
    set newText(value) {
        if (value && typeof value !== 'string') {
            throw (0, errors_1.illegalArgument)('newText');
        }
        this._newText = value;
    }
    get newEol() {
        return this._newEol;
    }
    set newEol(value) {
        if (value && typeof value !== 'number') {
            throw (0, errors_1.illegalArgument)('newEol');
        }
        this._newEol = value;
    }
    static isTextEdit(thing) {
        if (thing instanceof TextEdit_1) {
            return true;
        }
        if (!thing) {
            return false;
        }
        return Range.isRange(thing.range)
            && typeof thing.newText === 'string';
    }
    static replace(range, newText) {
        return new TextEdit_1(range, newText);
    }
    static insert(position, newText) {
        return TextEdit_1.replace(new Range(position, position), newText);
    }
    static delete(range) {
        return TextEdit_1.replace(range, '');
    }
    static setEndOfLine(eol) {
        const ret = new TextEdit_1(undefined, undefined);
        ret.newEol = eol;
        return ret;
    }
};
TextEdit = TextEdit_1 = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [Object, Object])
], TextEdit);
exports.TextEdit = TextEdit;
var CompletionTriggerKind;
(function (CompletionTriggerKind) {
    CompletionTriggerKind[CompletionTriggerKind["Invoke"] = 0] = "Invoke";
    CompletionTriggerKind[CompletionTriggerKind["TriggerCharacter"] = 1] = "TriggerCharacter";
    CompletionTriggerKind[CompletionTriggerKind["TriggerForIncompleteCompletions"] = 2] = "TriggerForIncompleteCompletions";
})(CompletionTriggerKind = exports.CompletionTriggerKind || (exports.CompletionTriggerKind = {}));
var CompletionItemKind;
(function (CompletionItemKind) {
    CompletionItemKind[CompletionItemKind["Text"] = 0] = "Text";
    CompletionItemKind[CompletionItemKind["Method"] = 1] = "Method";
    CompletionItemKind[CompletionItemKind["Function"] = 2] = "Function";
    CompletionItemKind[CompletionItemKind["Constructor"] = 3] = "Constructor";
    CompletionItemKind[CompletionItemKind["Field"] = 4] = "Field";
    CompletionItemKind[CompletionItemKind["Variable"] = 5] = "Variable";
    CompletionItemKind[CompletionItemKind["Class"] = 6] = "Class";
    CompletionItemKind[CompletionItemKind["Interface"] = 7] = "Interface";
    CompletionItemKind[CompletionItemKind["Module"] = 8] = "Module";
    CompletionItemKind[CompletionItemKind["Property"] = 9] = "Property";
    CompletionItemKind[CompletionItemKind["Unit"] = 10] = "Unit";
    CompletionItemKind[CompletionItemKind["Value"] = 11] = "Value";
    CompletionItemKind[CompletionItemKind["Enum"] = 12] = "Enum";
    CompletionItemKind[CompletionItemKind["Keyword"] = 13] = "Keyword";
    CompletionItemKind[CompletionItemKind["Snippet"] = 14] = "Snippet";
    CompletionItemKind[CompletionItemKind["Color"] = 15] = "Color";
    CompletionItemKind[CompletionItemKind["File"] = 16] = "File";
    CompletionItemKind[CompletionItemKind["Reference"] = 17] = "Reference";
    CompletionItemKind[CompletionItemKind["Folder"] = 18] = "Folder";
    CompletionItemKind[CompletionItemKind["EnumMember"] = 19] = "EnumMember";
    CompletionItemKind[CompletionItemKind["Constant"] = 20] = "Constant";
    CompletionItemKind[CompletionItemKind["Struct"] = 21] = "Struct";
    CompletionItemKind[CompletionItemKind["Event"] = 22] = "Event";
    CompletionItemKind[CompletionItemKind["Operator"] = 23] = "Operator";
    CompletionItemKind[CompletionItemKind["TypeParameter"] = 24] = "TypeParameter";
    CompletionItemKind[CompletionItemKind["User"] = 25] = "User";
    CompletionItemKind[CompletionItemKind["Issue"] = 26] = "Issue";
})(CompletionItemKind = exports.CompletionItemKind || (exports.CompletionItemKind = {}));
let CompletionItem = class CompletionItem {
    constructor(label, kind) {
        this.label = label;
        this.kind = kind;
    }
};
CompletionItem = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [String, Number])
], CompletionItem);
exports.CompletionItem = CompletionItem;
let CompletionList = class CompletionList {
    constructor(items = [], isIncomplete = false) {
        this.items = items;
        this.isIncomplete = isIncomplete;
    }
};
CompletionList = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [Array, Boolean])
], CompletionList);
exports.CompletionList = CompletionList;
var InlineCompletionTriggerKind;
(function (InlineCompletionTriggerKind) {
    InlineCompletionTriggerKind[InlineCompletionTriggerKind["Invoke"] = 0] = "Invoke";
    InlineCompletionTriggerKind[InlineCompletionTriggerKind["Automatic"] = 1] = "Automatic";
})(InlineCompletionTriggerKind = exports.InlineCompletionTriggerKind || (exports.InlineCompletionTriggerKind = {}));
let InlineCompletionItem = class InlineCompletionItem {
    constructor(insertText, range, command) {
        this.insertText = insertText;
        this.range = range;
        this.command = command;
    }
};
InlineCompletionItem = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [String, Range, Object])
], InlineCompletionItem);
exports.InlineCompletionItem = InlineCompletionItem;
let InlineCompletionList = class InlineCompletionList {
    constructor(items) {
        this.commands = undefined;
        this.items = items;
    }
};
InlineCompletionList = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [Array])
], InlineCompletionList);
exports.InlineCompletionList = InlineCompletionList;
var DiagnosticSeverity;
(function (DiagnosticSeverity) {
    DiagnosticSeverity[DiagnosticSeverity["Error"] = 0] = "Error";
    DiagnosticSeverity[DiagnosticSeverity["Warning"] = 1] = "Warning";
    DiagnosticSeverity[DiagnosticSeverity["Information"] = 2] = "Information";
    DiagnosticSeverity[DiagnosticSeverity["Hint"] = 3] = "Hint";
})(DiagnosticSeverity = exports.DiagnosticSeverity || (exports.DiagnosticSeverity = {}));
var DebugConsoleMode;
(function (DebugConsoleMode) {
    DebugConsoleMode[DebugConsoleMode["Separate"] = 0] = "Separate";
    DebugConsoleMode[DebugConsoleMode["MergeWithParent"] = 1] = "MergeWithParent";
})(DebugConsoleMode = exports.DebugConsoleMode || (exports.DebugConsoleMode = {}));
let Location = Location_1 = class Location {
    constructor(uri, rangeOrPosition) {
        this.uri = uri;
        if (rangeOrPosition instanceof Range) {
            this.range = rangeOrPosition;
        }
        else if (rangeOrPosition instanceof Position) {
            this.range = new Range(rangeOrPosition, rangeOrPosition);
        }
    }
    static isLocation(thing) {
        if (thing instanceof Location_1) {
            return true;
        }
        if (!thing) {
            return false;
        }
        return Range.isRange(thing.range)
            && URI.isUri(thing.uri);
    }
};
Location = Location_1 = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [URI, Object])
], Location);
exports.Location = Location;
let DiagnosticRelatedInformation = class DiagnosticRelatedInformation {
    constructor(location, message) {
        this.location = location;
        this.message = message;
    }
};
DiagnosticRelatedInformation = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [Location, String])
], DiagnosticRelatedInformation);
exports.DiagnosticRelatedInformation = DiagnosticRelatedInformation;
var DiagnosticTag;
(function (DiagnosticTag) {
    DiagnosticTag[DiagnosticTag["Unnecessary"] = 1] = "Unnecessary";
    DiagnosticTag[DiagnosticTag["Deprecated"] = 2] = "Deprecated";
})(DiagnosticTag = exports.DiagnosticTag || (exports.DiagnosticTag = {}));
var CompletionItemTag;
(function (CompletionItemTag) {
    CompletionItemTag[CompletionItemTag["Deprecated"] = 1] = "Deprecated";
})(CompletionItemTag = exports.CompletionItemTag || (exports.CompletionItemTag = {}));
let Diagnostic = class Diagnostic {
    constructor(range, message, severity = DiagnosticSeverity.Error) {
        this.range = range;
        this.message = message;
        this.severity = severity;
    }
};
Diagnostic = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [Range, String, Number])
], Diagnostic);
exports.Diagnostic = Diagnostic;
var MarkerSeverity;
(function (MarkerSeverity) {
    MarkerSeverity[MarkerSeverity["Hint"] = 1] = "Hint";
    MarkerSeverity[MarkerSeverity["Info"] = 2] = "Info";
    MarkerSeverity[MarkerSeverity["Warning"] = 4] = "Warning";
    MarkerSeverity[MarkerSeverity["Error"] = 8] = "Error";
})(MarkerSeverity = exports.MarkerSeverity || (exports.MarkerSeverity = {}));
var MarkerTag;
(function (MarkerTag) {
    MarkerTag[MarkerTag["Unnecessary"] = 1] = "Unnecessary";
    MarkerTag[MarkerTag["Deprecated"] = 2] = "Deprecated";
})(MarkerTag = exports.MarkerTag || (exports.MarkerTag = {}));
var NotebookCellKind;
(function (NotebookCellKind) {
    NotebookCellKind[NotebookCellKind["Markup"] = 1] = "Markup";
    NotebookCellKind[NotebookCellKind["Code"] = 2] = "Code";
})(NotebookCellKind = exports.NotebookCellKind || (exports.NotebookCellKind = {}));
var NotebookCellStatusBarAlignment;
(function (NotebookCellStatusBarAlignment) {
    NotebookCellStatusBarAlignment[NotebookCellStatusBarAlignment["Left"] = 1] = "Left";
    NotebookCellStatusBarAlignment[NotebookCellStatusBarAlignment["Right"] = 2] = "Right";
})(NotebookCellStatusBarAlignment = exports.NotebookCellStatusBarAlignment || (exports.NotebookCellStatusBarAlignment = {}));
var NotebookControllerAffinity;
(function (NotebookControllerAffinity) {
    NotebookControllerAffinity[NotebookControllerAffinity["Default"] = 1] = "Default";
    NotebookControllerAffinity[NotebookControllerAffinity["Preferred"] = 2] = "Preferred";
})(NotebookControllerAffinity = exports.NotebookControllerAffinity || (exports.NotebookControllerAffinity = {}));
var NotebookEditorRevealType;
(function (NotebookEditorRevealType) {
    NotebookEditorRevealType[NotebookEditorRevealType["Default"] = 0] = "Default";
    NotebookEditorRevealType[NotebookEditorRevealType["InCenter"] = 1] = "InCenter";
    NotebookEditorRevealType[NotebookEditorRevealType["InCenterIfOutsideViewport"] = 2] = "InCenterIfOutsideViewport";
    NotebookEditorRevealType[NotebookEditorRevealType["AtTop"] = 3] = "AtTop";
})(NotebookEditorRevealType = exports.NotebookEditorRevealType || (exports.NotebookEditorRevealType = {}));
var NotebookCellExecutionState;
(function (NotebookCellExecutionState) {
    /**
     * The cell is idle.
     */
    NotebookCellExecutionState[NotebookCellExecutionState["Idle"] = 1] = "Idle";
    /**
     * Execution for the cell is pending.
     */
    NotebookCellExecutionState[NotebookCellExecutionState["Pending"] = 2] = "Pending";
    /**
     * The cell is currently executing.
     */
    NotebookCellExecutionState[NotebookCellExecutionState["Executing"] = 3] = "Executing";
})(NotebookCellExecutionState = exports.NotebookCellExecutionState || (exports.NotebookCellExecutionState = {}));
class NotebookKernelSourceAction {
    constructor(label) {
        this.label = label;
    }
}
exports.NotebookKernelSourceAction = NotebookKernelSourceAction;
let NotebookCellData = class NotebookCellData {
    constructor(kind, value, languageId, outputs, metadata, executionSummary) {
        this.kind = kind;
        this.value = value;
        this.languageId = languageId;
        this.outputs = outputs !== null && outputs !== void 0 ? outputs : [];
        this.metadata = metadata;
        this.executionSummary = executionSummary;
    }
};
NotebookCellData = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [Number, String, String, Array, Object, Object])
], NotebookCellData);
exports.NotebookCellData = NotebookCellData;
let NotebookCellOutput = class NotebookCellOutput {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(items, idOrMetadata, metadata) {
        this.items = items;
        if (typeof idOrMetadata === 'string') {
            this.outputId = idOrMetadata;
            this.metadata = metadata;
        }
        else {
            this.outputId = coreutils_1.UUID.uuid4();
            this.metadata = idOrMetadata !== null && idOrMetadata !== void 0 ? idOrMetadata : metadata;
        }
    }
};
NotebookCellOutput = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [Array, Object, Object])
], NotebookCellOutput);
exports.NotebookCellOutput = NotebookCellOutput;
class NotebookCellOutputItem {
    constructor(data, mime) {
        this.data = data;
        this.mime = mime;
    }
    static text(value, mime) {
        const bytes = __classPrivateFieldGet(NotebookCellOutputItem, _a, "f", _NotebookCellOutputItem_encoder).encode(String(value));
        return new NotebookCellOutputItem(bytes, mime || 'text/plain');
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static json(value, mime) {
        const jsonStr = JSON.stringify(value, undefined, '\t');
        return NotebookCellOutputItem.text(jsonStr, mime);
    }
    static stdout(value) {
        return NotebookCellOutputItem.text(value, 'application/vnd.code.notebook.stdout');
    }
    static stderr(value) {
        return NotebookCellOutputItem.text(value, 'application/vnd.code.notebook.stderr');
    }
    static error(value) {
        return NotebookCellOutputItem.json(value, 'application/vnd.code.notebook.error');
    }
}
exports.NotebookCellOutputItem = NotebookCellOutputItem;
_a = NotebookCellOutputItem;
_NotebookCellOutputItem_encoder = { value: new TextEncoder() };
let NotebookCellStatusBarItem = class NotebookCellStatusBarItem {
    /**
     * Creates a new NotebookCellStatusBarItem.
     * @param text The text to show for the item.
     * @param alignment Whether the item is aligned to the left or right.
     * @stubbed
     */
    constructor(text, alignment) {
        this.text = text;
        this.alignment = alignment;
    }
};
NotebookCellStatusBarItem = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [String, Number])
], NotebookCellStatusBarItem);
exports.NotebookCellStatusBarItem = NotebookCellStatusBarItem;
let NotebookData = class NotebookData {
    constructor(cells) {
        this.cells = cells;
    }
};
NotebookData = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [Array])
], NotebookData);
exports.NotebookData = NotebookData;
class NotebookRange {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }
    static isNotebookRange(thing) {
        if (thing instanceof NotebookRange) {
            return true;
        }
        if (!thing) {
            return false;
        }
        return typeof thing.start === 'number'
            && typeof thing.end === 'number';
    }
    with(change) {
        let newStart = this.start;
        let newEnd = this.end;
        if (change.start !== undefined) {
            newStart = change.start;
        }
        if (change.end !== undefined) {
            newEnd = change.end;
        }
        if (newStart === this.start && newEnd === this.end) {
            return this;
        }
        return new NotebookRange(newStart, newEnd);
    }
}
exports.NotebookRange = NotebookRange;
class SnippetTextEdit {
    constructor(range, snippet) {
        this.range = range;
        this.snippet = snippet;
    }
    static isSnippetTextEdit(thing) {
        return thing instanceof SnippetTextEdit || (0, common_1.isObject)(thing)
            && Range.isRange(thing.range)
            && SnippetString.isSnippetString(thing.snippet);
    }
    static replace(range, snippet) {
        return new SnippetTextEdit(range, snippet);
    }
    static insert(position, snippet) {
        return SnippetTextEdit.replace(new Range(position, position), snippet);
    }
}
exports.SnippetTextEdit = SnippetTextEdit;
let NotebookEdit = NotebookEdit_1 = class NotebookEdit {
    constructor(range, newCells, newCellMetadata, newNotebookMetadata) {
        this.range = range;
        this.newCells = newCells;
        this.newCellMetadata = newCellMetadata;
        this.newNotebookMetadata = newNotebookMetadata;
    }
    static isNotebookCellEdit(thing) {
        if (thing instanceof NotebookEdit_1) {
            return true;
        }
        if (!thing) {
            return false;
        }
        return NotebookRange.isNotebookRange(thing)
            && Array.isArray(thing.newCells);
    }
    static replaceCells(range, newCells) {
        return new NotebookEdit_1(range, newCells);
    }
    static insertCells(index, newCells) {
        return new NotebookEdit_1(new NotebookRange(index, index), newCells);
    }
    static deleteCells(range) {
        return new NotebookEdit_1(range, []);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static updateCellMetadata(index, newCellMetadata) {
        return new NotebookEdit_1(new NotebookRange(index, index), [], newCellMetadata);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static updateNotebookMetadata(newNotebookMetadata) {
        return new NotebookEdit_1(new NotebookRange(0, 0), [], undefined, newNotebookMetadata);
    }
};
NotebookEdit = NotebookEdit_1 = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [NotebookRange, Array, Object, Object])
], NotebookEdit);
exports.NotebookEdit = NotebookEdit;
class NotebookRendererScript {
    constructor(uri, provides) {
        this.uri = uri;
        this.provides = Array.isArray(provides) ? provides : [provides];
    }
    ;
}
exports.NotebookRendererScript = NotebookRendererScript;
let ParameterInformation = class ParameterInformation {
    constructor(label, documentation) {
        this.label = label;
        this.documentation = documentation;
    }
};
ParameterInformation = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [Object, Object])
], ParameterInformation);
exports.ParameterInformation = ParameterInformation;
let SignatureInformation = class SignatureInformation {
    constructor(label, documentation) {
        this.label = label;
        this.documentation = documentation;
        this.parameters = [];
    }
};
SignatureInformation = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [String, Object])
], SignatureInformation);
exports.SignatureInformation = SignatureInformation;
var SignatureHelpTriggerKind;
(function (SignatureHelpTriggerKind) {
    SignatureHelpTriggerKind[SignatureHelpTriggerKind["Invoke"] = 1] = "Invoke";
    SignatureHelpTriggerKind[SignatureHelpTriggerKind["TriggerCharacter"] = 2] = "TriggerCharacter";
    SignatureHelpTriggerKind[SignatureHelpTriggerKind["ContentChange"] = 3] = "ContentChange";
})(SignatureHelpTriggerKind = exports.SignatureHelpTriggerKind || (exports.SignatureHelpTriggerKind = {}));
let SignatureHelp = class SignatureHelp {
    constructor() {
        this.signatures = [];
    }
};
SignatureHelp = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [])
], SignatureHelp);
exports.SignatureHelp = SignatureHelp;
let Hover = class Hover {
    constructor(contents, range) {
        if (!contents) {
            (0, errors_1.illegalArgument)('contents must be defined');
        }
        if (Array.isArray(contents)) {
            this.contents = contents;
        }
        else {
            this.contents = [contents];
        }
        this.range = range;
    }
};
Hover = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [Object, Range])
], Hover);
exports.Hover = Hover;
let EvaluatableExpression = class EvaluatableExpression {
    constructor(range, expression) {
        if (!range) {
            (0, errors_1.illegalArgument)('range must be defined');
        }
        this.range = range;
        this.expression = expression;
    }
};
EvaluatableExpression = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [Range, String])
], EvaluatableExpression);
exports.EvaluatableExpression = EvaluatableExpression;
let InlineValueContext = class InlineValueContext {
    constructor(frameId, stoppedLocation) {
        if (!frameId) {
            (0, errors_1.illegalArgument)('frameId must be defined');
        }
        if (!stoppedLocation) {
            (0, errors_1.illegalArgument)('stoppedLocation must be defined');
        }
        this.frameId = frameId;
        this.stoppedLocation = stoppedLocation;
    }
};
InlineValueContext = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [Number, Range])
], InlineValueContext);
exports.InlineValueContext = InlineValueContext;
let InlineValueText = class InlineValueText {
    constructor(range, text) {
        this.type = 'text';
        if (!range) {
            (0, errors_1.illegalArgument)('range must be defined');
        }
        if (!text) {
            (0, errors_1.illegalArgument)('text must be defined');
        }
        this.range = range;
        this.text = text;
    }
};
InlineValueText = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [Range, String])
], InlineValueText);
exports.InlineValueText = InlineValueText;
let InlineValueVariableLookup = class InlineValueVariableLookup {
    constructor(range, variableName, caseSensitiveLookup) {
        this.type = 'variable';
        if (!range) {
            (0, errors_1.illegalArgument)('range must be defined');
        }
        this.range = range;
        this.caseSensitiveLookup = caseSensitiveLookup || true;
        this.variableName = variableName;
    }
};
InlineValueVariableLookup = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [Range, String, Boolean])
], InlineValueVariableLookup);
exports.InlineValueVariableLookup = InlineValueVariableLookup;
let InlineValueEvaluatableExpression = class InlineValueEvaluatableExpression {
    constructor(range, expression) {
        this.type = 'expression';
        if (!range) {
            (0, errors_1.illegalArgument)('range must be defined');
        }
        this.range = range;
        this.expression = expression;
    }
};
InlineValueEvaluatableExpression = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [Range, String])
], InlineValueEvaluatableExpression);
exports.InlineValueEvaluatableExpression = InlineValueEvaluatableExpression;
var DocumentHighlightKind;
(function (DocumentHighlightKind) {
    DocumentHighlightKind[DocumentHighlightKind["Text"] = 0] = "Text";
    DocumentHighlightKind[DocumentHighlightKind["Read"] = 1] = "Read";
    DocumentHighlightKind[DocumentHighlightKind["Write"] = 2] = "Write";
})(DocumentHighlightKind = exports.DocumentHighlightKind || (exports.DocumentHighlightKind = {}));
let DocumentHighlight = class DocumentHighlight {
    constructor(range, kind) {
        this.range = range;
        this.kind = kind;
    }
};
DocumentHighlight = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [Range, Number])
], DocumentHighlight);
exports.DocumentHighlight = DocumentHighlight;
let DocumentLink = class DocumentLink {
    constructor(range, target) {
        if (target && !(URI.isUri(target))) {
            throw (0, errors_1.illegalArgument)('target');
        }
        if (!Range.isRange(range) || range.isEmpty) {
            throw (0, errors_1.illegalArgument)('range');
        }
        this.range = range;
        this.target = target;
    }
};
DocumentLink = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [Range, Object])
], DocumentLink);
exports.DocumentLink = DocumentLink;
let DocumentDropEdit = class DocumentDropEdit {
    constructor(insertText) {
        this.insertText = insertText;
    }
};
DocumentDropEdit = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [Object])
], DocumentDropEdit);
exports.DocumentDropEdit = DocumentDropEdit;
let CodeLens = class CodeLens {
    constructor(range, command) {
        this.range = range;
        this.command = command;
    }
    get isResolved() {
        return !!this.command;
    }
};
CodeLens = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [Range, Object])
], CodeLens);
exports.CodeLens = CodeLens;
var CodeActionTrigger;
(function (CodeActionTrigger) {
    CodeActionTrigger[CodeActionTrigger["Automatic"] = 1] = "Automatic";
    CodeActionTrigger[CodeActionTrigger["Manual"] = 2] = "Manual";
})(CodeActionTrigger = exports.CodeActionTrigger || (exports.CodeActionTrigger = {}));
/**
 * The reason why code actions were requested.
 */
var CodeActionTriggerKind;
(function (CodeActionTriggerKind) {
    /**
     * Code actions were explicitly requested by the user or by an extension.
     */
    CodeActionTriggerKind[CodeActionTriggerKind["Invoke"] = 1] = "Invoke";
    /**
     * Code actions were requested automatically.
     *
     * This typically happens when current selection in a file changes, but can
     * also be triggered when file content changes.
     */
    CodeActionTriggerKind[CodeActionTriggerKind["Automatic"] = 2] = "Automatic";
})(CodeActionTriggerKind = exports.CodeActionTriggerKind || (exports.CodeActionTriggerKind = {}));
let CodeActionKind = CodeActionKind_1 = class CodeActionKind {
    constructor(value) {
        this.value = value;
    }
    append(parts) {
        return new CodeActionKind_1(this.value ? this.value + CodeActionKind_1.sep + parts : parts);
    }
    contains(other) {
        return this.value === other.value || (0, strings_1.startsWithIgnoreCase)(other.value, this.value + CodeActionKind_1.sep);
    }
    intersects(other) {
        return this.contains(other) || other.contains(this);
    }
};
CodeActionKind.sep = '.';
CodeActionKind.Empty = new CodeActionKind_1('');
CodeActionKind.QuickFix = CodeActionKind_1.Empty.append('quickfix');
CodeActionKind.Refactor = CodeActionKind_1.Empty.append('refactor');
CodeActionKind.RefactorExtract = CodeActionKind_1.Refactor.append('extract');
CodeActionKind.RefactorInline = CodeActionKind_1.Refactor.append('inline');
CodeActionKind.RefactorMove = CodeActionKind_1.Refactor.append('move');
CodeActionKind.RefactorRewrite = CodeActionKind_1.Refactor.append('rewrite');
CodeActionKind.Source = CodeActionKind_1.Empty.append('source');
CodeActionKind.SourceOrganizeImports = CodeActionKind_1.Source.append('organizeImports');
CodeActionKind.SourceFixAll = CodeActionKind_1.Source.append('fixAll');
CodeActionKind = CodeActionKind_1 = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [String])
], CodeActionKind);
exports.CodeActionKind = CodeActionKind;
var TextDocumentSaveReason;
(function (TextDocumentSaveReason) {
    TextDocumentSaveReason[TextDocumentSaveReason["Manual"] = 1] = "Manual";
    TextDocumentSaveReason[TextDocumentSaveReason["AfterDelay"] = 2] = "AfterDelay";
    TextDocumentSaveReason[TextDocumentSaveReason["FocusOut"] = 3] = "FocusOut";
})(TextDocumentSaveReason = exports.TextDocumentSaveReason || (exports.TextDocumentSaveReason = {}));
let CodeAction = class CodeAction {
    constructor(title, kind) {
        this.title = title;
        this.kind = kind;
    }
};
CodeAction = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [String, CodeActionKind])
], CodeAction);
exports.CodeAction = CodeAction;
let WorkspaceEdit = class WorkspaceEdit {
    constructor() {
        this._edits = new Array();
    }
    renameFile(from, to, options, metadata) {
        this._edits.push({ _type: 1, from, to, options, metadata });
    }
    createFile(uri, options, metadata) {
        this._edits.push({ _type: 1, from: undefined, to: uri, options, metadata });
    }
    deleteFile(uri, options, metadata) {
        this._edits.push({ _type: 1, from: uri, to: undefined, options, metadata });
    }
    replace(uri, range, newText, metadata) {
        this._edits.push({ _type: 2, uri, edit: new TextEdit(range, newText), metadata });
    }
    insert(resource, position, newText, metadata) {
        this.replace(resource, new Range(position, position), newText, metadata);
    }
    delete(resource, range, metadata) {
        this.replace(resource, range, '', metadata);
    }
    has(uri) {
        for (const edit of this._edits) {
            if (edit && edit._type === 2 && edit.uri.toString() === uri.toString()) {
                return true;
            }
        }
        return false;
    }
    set(uri, edits) {
        if (!edits) {
            // remove all text edits for `uri`
            for (let i = 0; i < this._edits.length; i++) {
                const element = this._edits[i];
                if (element &&
                    (element._type === 2 /* Text */ || element._type === 6 /* Snippet */) &&
                    element.uri.toString() === uri.toString()) {
                    this._edits[i] = undefined;
                }
            }
            this._edits = this._edits.filter(e => !!e);
        }
        else {
            // append edit to the end
            for (const editOrTuple of edits) {
                if (!editOrTuple) {
                    continue;
                }
                let edit;
                let metadata;
                if (Array.isArray(editOrTuple)) {
                    edit = editOrTuple[0];
                    metadata = editOrTuple[1];
                }
                else {
                    edit = editOrTuple;
                }
                if (NotebookEdit.isNotebookCellEdit(edit)) {
                    if (edit.newCellMetadata) {
                        this._edits.push({
                            _type: 3 /* Cell */, metadata, uri,
                            edit: { editType: 3 /* Metadata */, index: edit.range.start, metadata: edit.newCellMetadata }
                        });
                    }
                    else if (edit.newNotebookMetadata) {
                        this._edits.push({
                            _type: 3 /* Cell */, metadata, uri,
                            edit: { editType: 5 /* DocumentMetadata */, metadata: edit.newNotebookMetadata }, notebookMetadata: edit.newNotebookMetadata
                        });
                    }
                    else {
                        const start = edit.range.start;
                        const end = edit.range.end;
                        if (start !== end || edit.newCells.length > 0) {
                            this._edits.push({ _type: 5 /* CellReplace */, uri, index: start, count: end - start, cells: edit.newCells, metadata });
                        }
                    }
                }
                else if (SnippetTextEdit.isSnippetTextEdit(edit)) {
                    this._edits.push({ _type: 6 /* Snippet */, uri, range: edit.range, edit, metadata });
                }
                else {
                    this._edits.push({ _type: 2 /* Text */, uri, edit });
                }
            }
        }
    }
    get(uri) {
        const res = [];
        for (const candidate of this._edits) {
            if (candidate && candidate._type === 2 && candidate.uri.toString() === uri.toString()) {
                res.push(candidate.edit);
            }
        }
        if (res.length === 0) {
            return undefined;
        }
        return res;
    }
    entries() {
        const textEdits = new Map();
        for (const candidate of this._edits) {
            if (candidate && candidate._type === 2 /* Text */) {
                let textEdit = textEdits.get(candidate.uri.toString());
                if (!textEdit) {
                    textEdit = [candidate.uri, []];
                    textEdits.set(candidate.uri.toString(), textEdit);
                }
                textEdit[1].push(candidate.edit);
            }
        }
        const result = [];
        textEdits.forEach(v => result.push(v));
        return result;
    }
    // _allEntries(): ([URI, Array<TextEdit | SnippetTextEdit>, theia.WorkspaceEditEntryMetadata] | [URI, URI, FileOperationOptions, WorkspaceEditMetadata])[] {
    //     const res: ([URI, Array<TextEdit | SnippetTextEdit>, theia.WorkspaceEditEntryMetadata] | [URI, URI, FileOperationOptions, WorkspaceEditMetadata])[] = [];
    //     for (const edit of this._edits) {
    //         if (!edit) {
    //             continue;
    //         }
    //         if (edit._type === FileEditType.File) {
    //             res.push([edit.from!, edit.to!, edit.options!, edit.metadata!]);
    //         } else {
    //             res.push([edit.uri, [edit.edit], edit.metadata!]);
    //         }
    //     }
    //     return res;
    // }
    _allEntries() {
        return this._edits;
    }
    get size() {
        return this.entries().length;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    toJSON() {
        return this.entries();
    }
};
WorkspaceEdit = __decorate([
    types_1.es5ClassCompat
], WorkspaceEdit);
exports.WorkspaceEdit = WorkspaceEdit;
class DataTransferItem {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(value) {
        this.value = value;
    }
    asString() {
        return Promise.resolve(typeof this.value === 'string' ? this.value : JSON.stringify(this.value));
    }
    asFile() {
        return undefined;
    }
}
exports.DataTransferItem = DataTransferItem;
/**
 * A map containing a mapping of the mime type of the corresponding transferred data.
 *
 * Drag and drop controllers that implement {@link TreeDragAndDropController.handleDrag `handleDrag`} can add additional mime types to the
 * data transfer. These additional mime types will only be included in the `handleDrop` when the the drag was initiated from
 * an element in the same drag and drop controller.
 */
let DataTransfer = class DataTransfer {
    constructor() {
        this.items = new Map();
    }
    get(mimeType) {
        return this.items.get(mimeType);
    }
    set(mimeType, value) {
        this.items.set(mimeType, value);
    }
    has(mimeType) {
        return this.items.has(mimeType);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    forEach(callbackfn, thisArg) {
        this.items.forEach((item, mimetype) => {
            callbackfn.call(thisArg, item, mimetype, this);
        });
    }
    [Symbol.iterator]() {
        return this.items[Symbol.iterator]();
    }
    clear() {
        this.items.clear();
    }
};
DataTransfer = __decorate([
    types_1.es5ClassCompat
], DataTransfer);
exports.DataTransfer = DataTransfer;
let TreeItem = class TreeItem {
    constructor(arg1, collapsibleState = TreeItemCollapsibleState.None) {
        this.collapsibleState = collapsibleState;
        if (arg1 instanceof URI) {
            this.resourceUri = arg1;
        }
        else {
            this.label = arg1;
        }
    }
};
TreeItem = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [Object, Number])
], TreeItem);
exports.TreeItem = TreeItem;
var TreeItemCollapsibleState;
(function (TreeItemCollapsibleState) {
    TreeItemCollapsibleState[TreeItemCollapsibleState["None"] = 0] = "None";
    TreeItemCollapsibleState[TreeItemCollapsibleState["Collapsed"] = 1] = "Collapsed";
    TreeItemCollapsibleState[TreeItemCollapsibleState["Expanded"] = 2] = "Expanded";
})(TreeItemCollapsibleState = exports.TreeItemCollapsibleState || (exports.TreeItemCollapsibleState = {}));
var TreeItemCheckboxState;
(function (TreeItemCheckboxState) {
    TreeItemCheckboxState[TreeItemCheckboxState["Unchecked"] = 0] = "Unchecked";
    TreeItemCheckboxState[TreeItemCheckboxState["Checked"] = 1] = "Checked";
})(TreeItemCheckboxState = exports.TreeItemCheckboxState || (exports.TreeItemCheckboxState = {}));
var SymbolTag;
(function (SymbolTag) {
    SymbolTag[SymbolTag["Deprecated"] = 1] = "Deprecated";
})(SymbolTag = exports.SymbolTag || (exports.SymbolTag = {}));
let SymbolInformation = SymbolInformation_1 = class SymbolInformation {
    constructor(name, kind, rangeOrContainer, locationOrUri, containerName) {
        this.name = name;
        this.kind = kind;
        this.containerName = containerName;
        if (typeof rangeOrContainer === 'string') {
            this.containerName = rangeOrContainer;
        }
        if (locationOrUri instanceof Location) {
            this.location = locationOrUri;
        }
        else if (rangeOrContainer instanceof Range) {
            this.location = new Location(locationOrUri, rangeOrContainer);
        }
        SymbolInformation_1.validate(this);
    }
    static validate(candidate) {
        if (!candidate.name) {
            throw new Error('Should provide a name inside candidate field');
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    toJSON() {
        return {
            name: this.name,
            kind: plugin_api_rpc_model_1.SymbolKind[this.kind],
            location: this.location,
            containerName: this.containerName
        };
    }
};
SymbolInformation = SymbolInformation_1 = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [String, Number, Object, Object, String])
], SymbolInformation);
exports.SymbolInformation = SymbolInformation;
let DocumentSymbol = DocumentSymbol_1 = class DocumentSymbol {
    constructor(name, detail, kind, range, selectionRange) {
        this.name = name;
        this.detail = detail;
        this.kind = kind;
        this.range = range;
        this.selectionRange = selectionRange;
        this.children = [];
        DocumentSymbol_1.validate(this);
    }
    static validate(candidate) {
        if (!candidate.name) {
            throw new Error('Should provide a name inside candidate field');
        }
        if (!candidate.range.contains(candidate.selectionRange)) {
            throw new Error('selectionRange must be contained in fullRange');
        }
        if (candidate.children) {
            candidate.children.forEach(DocumentSymbol_1.validate);
        }
    }
};
DocumentSymbol = DocumentSymbol_1 = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [String, String, Number, Range, Range])
], DocumentSymbol);
exports.DocumentSymbol = DocumentSymbol;
var CommentThreadState;
(function (CommentThreadState) {
    CommentThreadState[CommentThreadState["Unresolved"] = 0] = "Unresolved";
    CommentThreadState[CommentThreadState["Resolved"] = 1] = "Resolved";
})(CommentThreadState = exports.CommentThreadState || (exports.CommentThreadState = {}));
var CommentThreadCollapsibleState;
(function (CommentThreadCollapsibleState) {
    CommentThreadCollapsibleState[CommentThreadCollapsibleState["Collapsed"] = 0] = "Collapsed";
    CommentThreadCollapsibleState[CommentThreadCollapsibleState["Expanded"] = 1] = "Expanded";
})(CommentThreadCollapsibleState = exports.CommentThreadCollapsibleState || (exports.CommentThreadCollapsibleState = {}));
let QuickInputButtons = class QuickInputButtons {
};
QuickInputButtons.Back = {
    iconPath: {
        id: 'Back',
    },
    tooltip: 'Back'
};
QuickInputButtons = __decorate([
    types_1.es5ClassCompat
], QuickInputButtons);
exports.QuickInputButtons = QuickInputButtons;
let TerminalLink = class TerminalLink {
    constructor(startIndex, length, tooltip) {
        this.startIndex = startIndex;
        this.length = length;
        this.tooltip = tooltip;
    }
    static validate(candidate) {
        if (typeof candidate.startIndex !== 'number') {
            throw new Error('Should provide a startIndex inside candidate field');
        }
        if (typeof candidate.length !== 'number') {
            throw new Error('Should provide a length inside candidate field');
        }
    }
};
TerminalLink = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [Number, Number, String])
], TerminalLink);
exports.TerminalLink = TerminalLink;
var TerminalLocation;
(function (TerminalLocation) {
    TerminalLocation[TerminalLocation["Panel"] = 1] = "Panel";
    TerminalLocation[TerminalLocation["Editor"] = 2] = "Editor";
})(TerminalLocation = exports.TerminalLocation || (exports.TerminalLocation = {}));
var TerminalOutputAnchor;
(function (TerminalOutputAnchor) {
    TerminalOutputAnchor[TerminalOutputAnchor["Top"] = 0] = "Top";
    TerminalOutputAnchor[TerminalOutputAnchor["Bottom"] = 1] = "Bottom";
})(TerminalOutputAnchor = exports.TerminalOutputAnchor || (exports.TerminalOutputAnchor = {}));
class TerminalProfile {
    /**
     * Creates a new terminal profile.
     * @param options The options that the terminal will launch with.
     */
    constructor(options) {
        this.options = options;
    }
}
exports.TerminalProfile = TerminalProfile;
var TerminalExitReason;
(function (TerminalExitReason) {
    TerminalExitReason[TerminalExitReason["Unknown"] = 0] = "Unknown";
    TerminalExitReason[TerminalExitReason["Shutdown"] = 1] = "Shutdown";
    TerminalExitReason[TerminalExitReason["Process"] = 2] = "Process";
    TerminalExitReason[TerminalExitReason["User"] = 3] = "User";
    TerminalExitReason[TerminalExitReason["Extension"] = 4] = "Extension";
})(TerminalExitReason = exports.TerminalExitReason || (exports.TerminalExitReason = {}));
var TerminalQuickFixType;
(function (TerminalQuickFixType) {
    TerminalQuickFixType["command"] = "command";
    TerminalQuickFixType["opener"] = "opener";
})(TerminalQuickFixType = exports.TerminalQuickFixType || (exports.TerminalQuickFixType = {}));
let FileDecoration = class FileDecoration {
    constructor(badge, tooltip, color) {
        this.badge = badge;
        this.tooltip = tooltip;
        this.color = color;
    }
    static validate(d) {
        if (d.badge && d.badge.length !== 1 && d.badge.length !== 2) {
            throw new Error('The \'badge\'-property must be undefined or a short character');
        }
        if (!d.color && !d.badge && !d.tooltip) {
            throw new Error('The decoration is empty');
        }
    }
};
FileDecoration = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [String, String, ThemeColor])
], FileDecoration);
exports.FileDecoration = FileDecoration;
var CommentMode;
(function (CommentMode) {
    CommentMode[CommentMode["Editing"] = 0] = "Editing";
    CommentMode[CommentMode["Preview"] = 1] = "Preview";
})(CommentMode = exports.CommentMode || (exports.CommentMode = {}));
// #region file api
var FileChangeType;
(function (FileChangeType) {
    FileChangeType[FileChangeType["Changed"] = 1] = "Changed";
    FileChangeType[FileChangeType["Created"] = 2] = "Created";
    FileChangeType[FileChangeType["Deleted"] = 3] = "Deleted";
})(FileChangeType = exports.FileChangeType || (exports.FileChangeType = {}));
let FileSystemError = FileSystemError_1 = class FileSystemError extends Error {
    constructor(uriOrMessage, code = files_1.FileSystemProviderErrorCode.Unknown, terminator) {
        var _b;
        super(URI.isUri(uriOrMessage) ? uriOrMessage.toString(true) : uriOrMessage);
        this.code = (_b = terminator === null || terminator === void 0 ? void 0 : terminator.name) !== null && _b !== void 0 ? _b : 'Unknown';
        // mark the error as file system provider error so that
        // we can extract the error code on the receiving side
        (0, files_1.markAsFileSystemProviderError)(this, code);
        // workaround when extending builtin objects and when compiling to ES5, see:
        // https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
        if (typeof Object.setPrototypeOf === 'function') {
            Object.setPrototypeOf(this, FileSystemError_1.prototype);
        }
        if (typeof Error.captureStackTrace === 'function' && typeof terminator === 'function') {
            // nice stack traces
            Error.captureStackTrace(this, terminator);
        }
    }
    static FileExists(messageOrUri) {
        return new FileSystemError_1(messageOrUri, files_1.FileSystemProviderErrorCode.FileExists, FileSystemError_1.FileExists);
    }
    static FileNotFound(messageOrUri) {
        return new FileSystemError_1(messageOrUri, files_1.FileSystemProviderErrorCode.FileNotFound, FileSystemError_1.FileNotFound);
    }
    static FileNotADirectory(messageOrUri) {
        return new FileSystemError_1(messageOrUri, files_1.FileSystemProviderErrorCode.FileNotADirectory, FileSystemError_1.FileNotADirectory);
    }
    static FileIsADirectory(messageOrUri) {
        return new FileSystemError_1(messageOrUri, files_1.FileSystemProviderErrorCode.FileIsADirectory, FileSystemError_1.FileIsADirectory);
    }
    static NoPermissions(messageOrUri) {
        return new FileSystemError_1(messageOrUri, files_1.FileSystemProviderErrorCode.NoPermissions, FileSystemError_1.NoPermissions);
    }
    static Unavailable(messageOrUri) {
        return new FileSystemError_1(messageOrUri, files_1.FileSystemProviderErrorCode.Unavailable, FileSystemError_1.Unavailable);
    }
};
FileSystemError = FileSystemError_1 = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [Object, String, Function])
], FileSystemError);
exports.FileSystemError = FileSystemError;
// #endregion
var FileType;
(function (FileType) {
    FileType[FileType["Unknown"] = 0] = "Unknown";
    FileType[FileType["File"] = 1] = "File";
    FileType[FileType["Directory"] = 2] = "Directory";
    FileType[FileType["SymbolicLink"] = 64] = "SymbolicLink";
})(FileType = exports.FileType || (exports.FileType = {}));
let ProgressOptions = class ProgressOptions {
    constructor(location, title, cancellable) {
        this.location = location;
    }
};
ProgressOptions = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [Number, String, Boolean])
], ProgressOptions);
exports.ProgressOptions = ProgressOptions;
let Progress = class Progress {
    /**
     * Report a progress update.
     * @param value A progress item, like a message and/or an
     * report on how much work finished
     */
    report(value) {
    }
};
Progress = __decorate([
    types_1.es5ClassCompat
], Progress);
exports.Progress = Progress;
var ProgressLocation;
(function (ProgressLocation) {
    /**
     * Show progress for the source control viewlet, as overlay for the icon and as progress bar
     * inside the viewlet (when visible). Neither supports cancellation nor discrete progress.
     */
    ProgressLocation[ProgressLocation["SourceControl"] = 1] = "SourceControl";
    /**
     * Show progress in the status bar of the editor. Neither supports cancellation nor discrete progress.
     */
    ProgressLocation[ProgressLocation["Window"] = 10] = "Window";
    /**
     * Show progress as notification with an optional cancel button. Supports to show infinite and discrete progress.
     */
    ProgressLocation[ProgressLocation["Notification"] = 15] = "Notification";
})(ProgressLocation = exports.ProgressLocation || (exports.ProgressLocation = {}));
let ProcessExecution = class ProcessExecution {
    constructor(process, varg1, varg2) {
        if (typeof process !== 'string') {
            throw (0, errors_1.illegalArgument)('process');
        }
        this.executionProcess = process;
        if (varg1 !== undefined) {
            if (Array.isArray(varg1)) {
                this.arguments = varg1;
                this.executionOptions = varg2;
            }
            else {
                this.executionOptions = varg1;
            }
        }
        if (this.arguments === undefined) {
            this.arguments = [];
        }
    }
    get process() {
        return this.executionProcess;
    }
    set process(value) {
        if (typeof value !== 'string') {
            throw (0, errors_1.illegalArgument)('process');
        }
        this.executionProcess = value;
    }
    get args() {
        return this.arguments;
    }
    set args(value) {
        if (!Array.isArray(value)) {
            value = [];
        }
        this.arguments = value;
    }
    get options() {
        return this.executionOptions;
    }
    set options(value) {
        this.executionOptions = value;
    }
    static is(value) {
        const candidate = value;
        return candidate && !!candidate.process;
    }
};
ProcessExecution = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [String, Object, Object])
], ProcessExecution);
exports.ProcessExecution = ProcessExecution;
var QuickPickItemKind;
(function (QuickPickItemKind) {
    QuickPickItemKind[QuickPickItemKind["Separator"] = -1] = "Separator";
    QuickPickItemKind[QuickPickItemKind["Default"] = 0] = "Default";
})(QuickPickItemKind = exports.QuickPickItemKind || (exports.QuickPickItemKind = {}));
var ShellQuoting;
(function (ShellQuoting) {
    ShellQuoting[ShellQuoting["Escape"] = 1] = "Escape";
    ShellQuoting[ShellQuoting["Strong"] = 2] = "Strong";
    ShellQuoting[ShellQuoting["Weak"] = 3] = "Weak";
})(ShellQuoting = exports.ShellQuoting || (exports.ShellQuoting = {}));
var TaskPanelKind;
(function (TaskPanelKind) {
    TaskPanelKind[TaskPanelKind["Shared"] = 1] = "Shared";
    TaskPanelKind[TaskPanelKind["Dedicated"] = 2] = "Dedicated";
    TaskPanelKind[TaskPanelKind["New"] = 3] = "New";
})(TaskPanelKind = exports.TaskPanelKind || (exports.TaskPanelKind = {}));
var TaskRevealKind;
(function (TaskRevealKind) {
    TaskRevealKind[TaskRevealKind["Always"] = 1] = "Always";
    TaskRevealKind[TaskRevealKind["Silent"] = 2] = "Silent";
    TaskRevealKind[TaskRevealKind["Never"] = 3] = "Never";
})(TaskRevealKind = exports.TaskRevealKind || (exports.TaskRevealKind = {}));
let ShellExecution = class ShellExecution {
    constructor(arg0, arg1, arg2) {
        if (Array.isArray(arg1) || typeof arg1 === 'string') {
            if (!arg0) {
                throw (0, errors_1.illegalArgument)('command can\'t be undefined or null');
            }
            if (typeof arg0 !== 'string' && typeof arg0.value !== 'string') {
                throw (0, errors_1.illegalArgument)('command');
            }
            this.shellCommand = arg0;
            this.arguments = arg1;
            this.shellOptions = arg2;
        }
        else {
            if (typeof arg0 !== 'string') {
                throw (0, errors_1.illegalArgument)('commandLine');
            }
            this.shellCommandLine = arg0;
            this.shellOptions = arg1;
        }
    }
    get commandLine() {
        return this.shellCommandLine;
    }
    set commandLine(value) {
        if (typeof value !== 'string') {
            throw (0, errors_1.illegalArgument)('commandLine');
        }
        this.shellCommandLine = value;
    }
    get command() {
        return this.shellCommand;
    }
    set command(value) {
        if (typeof value !== 'string' && typeof value.value !== 'string') {
            throw (0, errors_1.illegalArgument)('command');
        }
        this.shellCommand = value;
    }
    get args() {
        return this.arguments;
    }
    set args(value) {
        this.arguments = value || [];
    }
    get options() {
        return this.shellOptions;
    }
    set options(value) {
        this.shellOptions = value;
    }
    static is(value) {
        const candidate = value;
        return candidate && (!!candidate.commandLine || !!candidate.command);
    }
};
ShellExecution = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [Object, Object, Object])
], ShellExecution);
exports.ShellExecution = ShellExecution;
let CustomExecution = class CustomExecution {
    constructor(callback) {
        this._callback = callback;
    }
    set callback(value) {
        this._callback = value;
    }
    get callback() {
        return this._callback;
    }
    static is(value) {
        const candidate = value;
        return candidate && (!!candidate._callback);
    }
};
CustomExecution = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [Function])
], CustomExecution);
exports.CustomExecution = CustomExecution;
let TaskGroup = TaskGroup_1 = class TaskGroup {
    constructor(id, label, isDefault) {
        this.id = id;
        this.isDefault = !!isDefault;
    }
    static from(value) {
        switch (value) {
            case 'clean':
                return TaskGroup_1.Clean;
            case 'build':
                return TaskGroup_1.Build;
            case 'rebuild':
                return TaskGroup_1.Rebuild;
            case 'test':
                return TaskGroup_1.Test;
            default:
                return undefined;
        }
    }
};
TaskGroup.Clean = new TaskGroup_1('clean', 'Clean');
TaskGroup.Build = new TaskGroup_1('build', 'Build');
TaskGroup.Rebuild = new TaskGroup_1('rebuild', 'Rebuild');
TaskGroup.Test = new TaskGroup_1('test', 'Test');
TaskGroup = TaskGroup_1 = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [String, String, Object])
], TaskGroup);
exports.TaskGroup = TaskGroup;
var TaskScope;
(function (TaskScope) {
    TaskScope[TaskScope["Global"] = 1] = "Global";
    TaskScope[TaskScope["Workspace"] = 2] = "Workspace";
})(TaskScope = exports.TaskScope || (exports.TaskScope = {}));
let Task = class Task {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args) {
        let taskDefinition;
        let scope;
        let name;
        let source;
        let execution;
        let problemMatchers;
        if (typeof args[1] === 'string') {
            [
                taskDefinition,
                name,
                source,
                execution,
                problemMatchers,
            ] = args;
        }
        else {
            [
                taskDefinition,
                scope,
                name,
                source,
                execution,
                problemMatchers,
            ] = args;
        }
        this.definition = taskDefinition;
        this.scope = scope;
        this.name = name;
        this.source = source;
        this.execution = execution;
        if (typeof problemMatchers === 'string') {
            this.taskProblemMatchers = [problemMatchers];
            this.hasTaskProblemMatchers = true;
        }
        else if (Array.isArray(problemMatchers)) {
            this.taskProblemMatchers = problemMatchers;
            this.hasTaskProblemMatchers = true;
        }
        else {
            this.taskProblemMatchers = [];
            this.hasTaskProblemMatchers = false;
        }
        this.isTaskBackground = false;
        this.presentationOptions = Object.create(null);
        this.taskRunOptions = Object.create(null);
    }
    get definition() {
        return this.taskDefinition;
    }
    set definition(value) {
        if (value === undefined || value === null) {
            throw (0, errors_1.illegalArgument)('Kind can\'t be undefined or null');
        }
        this.taskDefinition = value;
    }
    get scope() {
        return this.taskScope;
    }
    set scope(value) {
        if (value === null) {
            value = undefined;
        }
        this.taskScope = value;
    }
    get name() {
        return this.taskName;
    }
    set name(value) {
        if (typeof value !== 'string') {
            throw (0, errors_1.illegalArgument)('name');
        }
        this.taskName = value;
    }
    get execution() {
        return this.taskExecution;
    }
    set execution(value) {
        if (value === null) {
            value = undefined;
        }
        this.taskExecution = value;
    }
    get problemMatchers() {
        return this.taskProblemMatchers;
    }
    set problemMatchers(value) {
        if (!Array.isArray(value)) {
            this.taskProblemMatchers = [];
            this.hasTaskProblemMatchers = false;
            return;
        }
        this.taskProblemMatchers = value;
        this.hasTaskProblemMatchers = true;
    }
    get hasProblemMatchers() {
        return this.hasTaskProblemMatchers;
    }
    get isBackground() {
        return this.isTaskBackground;
    }
    set isBackground(value) {
        if (value !== true && value !== false) {
            value = false;
        }
        this.isTaskBackground = value;
    }
    get source() {
        return this.taskSource;
    }
    set source(value) {
        if (typeof value !== 'string' || value.length === 0) {
            throw (0, errors_1.illegalArgument)('source must be a string of length > 0');
        }
        this.taskSource = value;
    }
    get group() {
        return this.taskGroup;
    }
    set group(value) {
        if (value === undefined || value === null) {
            this.taskGroup = undefined;
            return;
        }
        this.taskGroup = value;
    }
    get presentationOptions() {
        return this.taskPresentationOptions;
    }
    set presentationOptions(value) {
        if (value === null || value === undefined) {
            value = Object.create(null);
        }
        this.taskPresentationOptions = value;
    }
    get runOptions() {
        return this.taskRunOptions;
    }
    set runOptions(value) {
        if (value === null || value === undefined) {
            value = Object.create(null);
        }
        this.taskRunOptions = value;
    }
};
Task = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [Object])
], Task);
exports.Task = Task;
let Task2 = class Task2 extends Task {
};
Task2 = __decorate([
    types_1.es5ClassCompat
], Task2);
exports.Task2 = Task2;
let DebugAdapterExecutable = class DebugAdapterExecutable {
    /**
     * Creates a description for a debug adapter based on an executable program.
     *
     * @param command The command or executable path that implements the debug adapter.
     * @param args Optional arguments to be passed to the command or executable.
     * @param options Optional options to be used when starting the command or executable.
     */
    constructor(command, args, options) {
        this.command = command;
        this.args = args;
        this.options = options;
    }
};
DebugAdapterExecutable = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [String, Array, Object])
], DebugAdapterExecutable);
exports.DebugAdapterExecutable = DebugAdapterExecutable;
(function (DebugAdapterExecutable) {
    function is(adapter) {
        return !!adapter && 'command' in adapter;
    }
    DebugAdapterExecutable.is = is;
})(DebugAdapterExecutable = exports.DebugAdapterExecutable || (exports.DebugAdapterExecutable = {}));
exports.DebugAdapterExecutable = DebugAdapterExecutable;
/**
 * Represents a debug adapter running as a socket based server.
 */
let DebugAdapterServer = class DebugAdapterServer {
    /**
     * Create a description for a debug adapter running as a socket based server.
     */
    constructor(port, host) {
        this.port = port;
        this.host = host;
    }
};
DebugAdapterServer = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [Number, String])
], DebugAdapterServer);
exports.DebugAdapterServer = DebugAdapterServer;
(function (DebugAdapterServer) {
    function is(adapter) {
        return !!adapter && 'port' in adapter;
    }
    DebugAdapterServer.is = is;
})(DebugAdapterServer = exports.DebugAdapterServer || (exports.DebugAdapterServer = {}));
exports.DebugAdapterServer = DebugAdapterServer;
/**
 * Represents a debug adapter running as a Named Pipe (on Windows)/UNIX Domain Socket (on non-Windows) based server.
 */
let DebugAdapterNamedPipeServer = class DebugAdapterNamedPipeServer {
    /**
     * Create a description for a debug adapter running as a Named Pipe (on Windows)/UNIX Domain Socket (on non-Windows) based server.
     */
    constructor(path) {
        this.path = path;
    }
};
DebugAdapterNamedPipeServer = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [String])
], DebugAdapterNamedPipeServer);
exports.DebugAdapterNamedPipeServer = DebugAdapterNamedPipeServer;
(function (DebugAdapterNamedPipeServer) {
    function is(adapter) {
        return !!adapter && 'path' in adapter;
    }
    DebugAdapterNamedPipeServer.is = is;
})(DebugAdapterNamedPipeServer = exports.DebugAdapterNamedPipeServer || (exports.DebugAdapterNamedPipeServer = {}));
exports.DebugAdapterNamedPipeServer = DebugAdapterNamedPipeServer;
/**
 * A debug adapter descriptor for an inline implementation.
 */
let DebugAdapterInlineImplementation = class DebugAdapterInlineImplementation {
    /**
     * Create a descriptor for an inline implementation of a debug adapter.
     */
    constructor(impl) {
        this.implementation = impl;
    }
};
DebugAdapterInlineImplementation = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [Object])
], DebugAdapterInlineImplementation);
exports.DebugAdapterInlineImplementation = DebugAdapterInlineImplementation;
(function (DebugAdapterInlineImplementation) {
    function is(adapter) {
        return !!adapter && 'implementation' in adapter;
    }
    DebugAdapterInlineImplementation.is = is;
})(DebugAdapterInlineImplementation = exports.DebugAdapterInlineImplementation || (exports.DebugAdapterInlineImplementation = {}));
exports.DebugAdapterInlineImplementation = DebugAdapterInlineImplementation;
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Off"] = 0] = "Off";
    LogLevel[LogLevel["Trace"] = 1] = "Trace";
    LogLevel[LogLevel["Debug"] = 2] = "Debug";
    LogLevel[LogLevel["Info"] = 3] = "Info";
    LogLevel[LogLevel["Warning"] = 4] = "Warning";
    LogLevel[LogLevel["Error"] = 5] = "Error";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
/**
 * The base class of all breakpoint types.
 */
let Breakpoint = class Breakpoint {
    constructor(enabled, condition, hitCondition, logMessage, id) {
        this.enabled = enabled || false;
        this.condition = condition;
        this.hitCondition = hitCondition;
        this.logMessage = logMessage;
        this._id = id;
    }
    /**
     * The unique ID of the breakpoint.
     */
    get id() {
        if (!this._id) {
            this._id = coreutils_1.UUID.uuid4();
        }
        return this._id;
    }
};
Breakpoint = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [Boolean, String, String, String, String])
], Breakpoint);
exports.Breakpoint = Breakpoint;
/**
 * A breakpoint specified by a source location.
 */
let SourceBreakpoint = class SourceBreakpoint extends Breakpoint {
    /**
     * Create a new breakpoint for a source location.
     */
    constructor(location, enabled, condition, hitCondition, logMessage, id) {
        super(enabled, condition, hitCondition, logMessage, id);
        this.location = location;
    }
};
SourceBreakpoint = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [Location, Boolean, String, String, String, String])
], SourceBreakpoint);
exports.SourceBreakpoint = SourceBreakpoint;
/**
 * A breakpoint specified by a function name.
 */
let FunctionBreakpoint = class FunctionBreakpoint extends Breakpoint {
    /**
     * Create a new function breakpoint.
     */
    constructor(functionName, enabled, condition, hitCondition, logMessage, id) {
        super(enabled, condition, hitCondition, logMessage, id);
        this.functionName = functionName;
    }
};
FunctionBreakpoint = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [String, Boolean, String, String, String, String])
], FunctionBreakpoint);
exports.FunctionBreakpoint = FunctionBreakpoint;
let Color = class Color {
    constructor(red, green, blue, alpha) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    }
};
Color = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [Number, Number, Number, Number])
], Color);
exports.Color = Color;
let ColorInformation = class ColorInformation {
    constructor(range, color) {
        if (color && !(color instanceof Color)) {
            throw (0, errors_1.illegalArgument)('color');
        }
        if (!Range.isRange(range)) {
            throw (0, errors_1.illegalArgument)('range');
        }
        this.range = range;
        this.color = color;
    }
};
ColorInformation = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [Range, Color])
], ColorInformation);
exports.ColorInformation = ColorInformation;
let ColorPresentation = class ColorPresentation {
    constructor(label) {
        if (!label || typeof label !== 'string') {
            throw (0, errors_1.illegalArgument)('label');
        }
        this.label = label;
    }
};
ColorPresentation = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [String])
], ColorPresentation);
exports.ColorPresentation = ColorPresentation;
var ColorFormat;
(function (ColorFormat) {
    ColorFormat[ColorFormat["RGB"] = 0] = "RGB";
    ColorFormat[ColorFormat["HEX"] = 1] = "HEX";
    ColorFormat[ColorFormat["HSL"] = 2] = "HSL";
})(ColorFormat = exports.ColorFormat || (exports.ColorFormat = {}));
let InlayHintLabelPart = class InlayHintLabelPart {
    constructor(value) {
        this.value = value;
    }
};
InlayHintLabelPart = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [String])
], InlayHintLabelPart);
exports.InlayHintLabelPart = InlayHintLabelPart;
let InlayHint = class InlayHint {
    constructor(position, label, kind) {
        this.position = position;
        this.label = label;
        this.kind = kind;
    }
};
InlayHint = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [Function, Object, Number])
], InlayHint);
exports.InlayHint = InlayHint;
var InlayHintKind;
(function (InlayHintKind) {
    InlayHintKind[InlayHintKind["Type"] = 1] = "Type";
    InlayHintKind[InlayHintKind["Parameter"] = 2] = "Parameter";
})(InlayHintKind = exports.InlayHintKind || (exports.InlayHintKind = {}));
let FoldingRange = class FoldingRange {
    constructor(start, end, kind) {
        this.start = start;
        this.end = end;
        this.kind = kind;
    }
};
FoldingRange = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [Number, Number, Number])
], FoldingRange);
exports.FoldingRange = FoldingRange;
var FoldingRangeKind;
(function (FoldingRangeKind) {
    FoldingRangeKind[FoldingRangeKind["Comment"] = 1] = "Comment";
    FoldingRangeKind[FoldingRangeKind["Imports"] = 2] = "Imports";
    FoldingRangeKind[FoldingRangeKind["Region"] = 3] = "Region";
})(FoldingRangeKind = exports.FoldingRangeKind || (exports.FoldingRangeKind = {}));
let SelectionRange = class SelectionRange {
    constructor(range, parent) {
        this.range = range;
        this.parent = parent;
        if (parent && !parent.range.contains(this.range)) {
            throw new Error('Invalid argument: parent must contain this range');
        }
    }
};
SelectionRange = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [Range, SelectionRange])
], SelectionRange);
exports.SelectionRange = SelectionRange;
/**
 * Enumeration of the supported operating systems.
 */
var OperatingSystem;
(function (OperatingSystem) {
    OperatingSystem["Windows"] = "Windows";
    OperatingSystem["Linux"] = "Linux";
    OperatingSystem["OSX"] = "OSX";
})(OperatingSystem = exports.OperatingSystem || (exports.OperatingSystem = {}));
/** The areas of the application shell where webview panel can reside. */
var WebviewPanelTargetArea;
(function (WebviewPanelTargetArea) {
    WebviewPanelTargetArea["Main"] = "main";
    WebviewPanelTargetArea["Left"] = "left";
    WebviewPanelTargetArea["Right"] = "right";
    WebviewPanelTargetArea["Bottom"] = "bottom";
})(WebviewPanelTargetArea = exports.WebviewPanelTargetArea || (exports.WebviewPanelTargetArea = {}));
/**
 * Possible kinds of UI that can use extensions.
 */
var UIKind;
(function (UIKind) {
    /**
     * Extensions are accessed from a desktop application.
     */
    UIKind[UIKind["Desktop"] = 1] = "Desktop";
    /**
     * Extensions are accessed from a web browser.
     */
    UIKind[UIKind["Web"] = 2] = "Web";
})(UIKind = exports.UIKind || (exports.UIKind = {}));
let CallHierarchyItem = CallHierarchyItem_1 = class CallHierarchyItem {
    constructor(kind, name, detail, uri, range, selectionRange) {
        this.kind = kind;
        this.name = name;
        this.detail = detail;
        this.uri = uri;
        this.range = range;
        this.selectionRange = selectionRange;
    }
    static isCallHierarchyItem(thing) {
        if (thing instanceof CallHierarchyItem_1) {
            return true;
        }
        if (!thing) {
            return false;
        }
        return typeof thing.kind === 'number' &&
            typeof thing.name === 'string' &&
            URI.isUri(thing.uri) &&
            Range.isRange(thing.range) &&
            Range.isRange(thing.selectionRange);
    }
};
CallHierarchyItem = CallHierarchyItem_1 = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [Number, String, String, URI, Range, Range])
], CallHierarchyItem);
exports.CallHierarchyItem = CallHierarchyItem;
let CallHierarchyIncomingCall = class CallHierarchyIncomingCall {
    constructor(item, fromRanges) {
        this.fromRanges = fromRanges;
        this.from = item;
    }
};
CallHierarchyIncomingCall = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [CallHierarchyItem, Array])
], CallHierarchyIncomingCall);
exports.CallHierarchyIncomingCall = CallHierarchyIncomingCall;
let CallHierarchyOutgoingCall = class CallHierarchyOutgoingCall {
    constructor(item, fromRanges) {
        this.fromRanges = fromRanges;
        this.to = item;
    }
};
CallHierarchyOutgoingCall = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [CallHierarchyItem, Array])
], CallHierarchyOutgoingCall);
exports.CallHierarchyOutgoingCall = CallHierarchyOutgoingCall;
let TypeHierarchyItem = TypeHierarchyItem_1 = class TypeHierarchyItem {
    constructor(kind, name, detail, uri, range, selectionRange) {
        this.kind = kind;
        this.name = name;
        this.detail = detail;
        this.uri = uri;
        this.range = range;
        this.selectionRange = selectionRange;
    }
    static isTypeHierarchyItem(thing) {
        if (thing instanceof TypeHierarchyItem_1) {
            return true;
        }
        if (!thing) {
            return false;
        }
        return typeof thing.kind === 'number' &&
            typeof thing.name === 'string' &&
            URI.isUri(thing.uri) &&
            Range.isRange(thing.range) &&
            Range.isRange(thing.selectionRange);
    }
};
TypeHierarchyItem = TypeHierarchyItem_1 = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [Number, String, String, URI, Range, Range])
], TypeHierarchyItem);
exports.TypeHierarchyItem = TypeHierarchyItem;
var LanguageStatusSeverity;
(function (LanguageStatusSeverity) {
    LanguageStatusSeverity[LanguageStatusSeverity["Information"] = 0] = "Information";
    LanguageStatusSeverity[LanguageStatusSeverity["Warning"] = 1] = "Warning";
    LanguageStatusSeverity[LanguageStatusSeverity["Error"] = 2] = "Error";
})(LanguageStatusSeverity = exports.LanguageStatusSeverity || (exports.LanguageStatusSeverity = {}));
let LinkedEditingRanges = class LinkedEditingRanges {
    constructor(ranges, wordPattern) {
        this.ranges = ranges;
        this.wordPattern = wordPattern;
    }
};
LinkedEditingRanges = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [Array, RegExp])
], LinkedEditingRanges);
exports.LinkedEditingRanges = LinkedEditingRanges;
var TestRunProfileKind;
(function (TestRunProfileKind) {
    TestRunProfileKind[TestRunProfileKind["Run"] = 1] = "Run";
    TestRunProfileKind[TestRunProfileKind["Debug"] = 2] = "Debug";
    TestRunProfileKind[TestRunProfileKind["Coverage"] = 3] = "Coverage";
})(TestRunProfileKind = exports.TestRunProfileKind || (exports.TestRunProfileKind = {}));
let TestTag = class TestTag {
    constructor(id) {
        this.id = id;
    }
};
TestTag = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [String])
], TestTag);
exports.TestTag = TestTag;
let TestRunRequest = class TestRunRequest {
    constructor(include = undefined, exclude = undefined, profile = undefined, continuous = undefined) {
        this.include = include;
        this.exclude = exclude;
        this.profile = profile;
        this.continuous = continuous;
    }
};
TestRunRequest = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], TestRunRequest);
exports.TestRunRequest = TestRunRequest;
let TestMessage = TestMessage_1 = class TestMessage {
    constructor(message) {
        this.message = message;
    }
    static diff(message, expected, actual) {
        const msg = new TestMessage_1(message);
        msg.expectedOutput = expected;
        msg.actualOutput = actual;
        return msg;
    }
};
TestMessage = TestMessage_1 = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [Object])
], TestMessage);
exports.TestMessage = TestMessage;
let TimelineItem = class TimelineItem {
    constructor(label, timestamp) {
        this.label = label;
        this.timestamp = timestamp;
    }
};
TimelineItem = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [String, Number])
], TimelineItem);
exports.TimelineItem = TimelineItem;
// #region Semantic Coloring
let SemanticTokensLegend = class SemanticTokensLegend {
    constructor(tokenTypes, tokenModifiers = []) {
        this.tokenTypes = tokenTypes;
        this.tokenModifiers = tokenModifiers;
    }
};
SemanticTokensLegend = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [Array, Array])
], SemanticTokensLegend);
exports.SemanticTokensLegend = SemanticTokensLegend;
function isStrArrayOrUndefined(arg) {
    return typeof arg === 'undefined' || (0, common_1.isStringArray)(arg);
}
let SemanticTokensBuilder = SemanticTokensBuilder_1 = class SemanticTokensBuilder {
    constructor(legend) {
        this._prevLine = 0;
        this._prevChar = 0;
        this._dataIsSortedAndDeltaEncoded = true;
        this._data = [];
        this._dataLen = 0;
        this._tokenTypeStrToInt = new Map();
        this._tokenModifierStrToInt = new Map();
        this._hasLegend = false;
        if (legend) {
            this._hasLegend = true;
            for (let i = 0, len = legend.tokenTypes.length; i < len; i++) {
                this._tokenTypeStrToInt.set(legend.tokenTypes[i], i);
            }
            for (let i = 0, len = legend.tokenModifiers.length; i < len; i++) {
                this._tokenModifierStrToInt.set(legend.tokenModifiers[i], i);
            }
        }
    }
    push(arg0, arg1, arg2, arg3, arg4) {
        if (typeof arg0 === 'number' && typeof arg1 === 'number' && typeof arg2 === 'number' && typeof arg3 === 'number' &&
            (typeof arg4 === 'number' || typeof arg4 === 'undefined')) {
            if (typeof arg4 === 'undefined') {
                arg4 = 0;
            }
            // 1st overload
            return this._pushEncoded(arg0, arg1, arg2, arg3, arg4);
        }
        if (Range.isRange(arg0) && typeof arg1 === 'string' && isStrArrayOrUndefined(arg2)) {
            // 2nd overload
            return this._push(arg0, arg1, arg2);
        }
        throw (0, errors_1.illegalArgument)();
    }
    _push(range, tokenType, tokenModifiers) {
        if (!this._hasLegend) {
            throw new Error('Legend must be provided in constructor');
        }
        if (range.start.line !== range.end.line) {
            throw new Error('`range` cannot span multiple lines');
        }
        if (!this._tokenTypeStrToInt.has(tokenType)) {
            throw new Error('`tokenType` is not in the provided legend');
        }
        const line = range.start.line;
        const char = range.start.character;
        const length = range.end.character - range.start.character;
        const nTokenType = this._tokenTypeStrToInt.get(tokenType);
        let nTokenModifiers = 0;
        if (tokenModifiers) {
            for (const tokenModifier of tokenModifiers) {
                if (!this._tokenModifierStrToInt.has(tokenModifier)) {
                    throw new Error('`tokenModifier` is not in the provided legend');
                }
                const nTokenModifier = this._tokenModifierStrToInt.get(tokenModifier);
                nTokenModifiers |= (1 << nTokenModifier) >>> 0;
            }
        }
        this._pushEncoded(line, char, length, nTokenType, nTokenModifiers);
    }
    _pushEncoded(line, char, length, tokenType, tokenModifiers) {
        if (this._dataIsSortedAndDeltaEncoded && (line < this._prevLine || (line === this._prevLine && char < this._prevChar))) {
            // push calls were ordered and are no longer ordered
            this._dataIsSortedAndDeltaEncoded = false;
            // Remove delta encoding from data
            const tokenCount = (this._data.length / 5) | 0;
            let prevLine = 0;
            let prevChar = 0;
            for (let i = 0; i < tokenCount; i++) {
                // eslint-disable-next-line @typescript-eslint/no-shadow
                let line = this._data[5 * i];
                // eslint-disable-next-line @typescript-eslint/no-shadow
                let char = this._data[5 * i + 1];
                if (line === 0) {
                    // on the same line as previous token
                    line = prevLine;
                    char += prevChar;
                }
                else {
                    // on a different line than previous token
                    line += prevLine;
                }
                this._data[5 * i] = line;
                this._data[5 * i + 1] = char;
                prevLine = line;
                prevChar = char;
            }
        }
        let pushLine = line;
        let pushChar = char;
        if (this._dataIsSortedAndDeltaEncoded && this._dataLen > 0) {
            pushLine -= this._prevLine;
            if (pushLine === 0) {
                pushChar -= this._prevChar;
            }
        }
        this._data[this._dataLen++] = pushLine;
        this._data[this._dataLen++] = pushChar;
        this._data[this._dataLen++] = length;
        this._data[this._dataLen++] = tokenType;
        this._data[this._dataLen++] = tokenModifiers;
        this._prevLine = line;
        this._prevChar = char;
    }
    static _sortAndDeltaEncode(data) {
        const pos = [];
        const tokenCount = (data.length / 5) | 0;
        for (let i = 0; i < tokenCount; i++) {
            pos[i] = i;
        }
        pos.sort((a, b) => {
            const aLine = data[5 * a];
            const bLine = data[5 * b];
            if (aLine === bLine) {
                const aChar = data[5 * a + 1];
                const bChar = data[5 * b + 1];
                return aChar - bChar;
            }
            return aLine - bLine;
        });
        const result = new Uint32Array(data.length);
        let prevLine = 0;
        let prevChar = 0;
        for (let i = 0; i < tokenCount; i++) {
            const srcOffset = 5 * pos[i];
            const line = data[srcOffset + 0];
            const char = data[srcOffset + 1];
            const length = data[srcOffset + 2];
            const tokenType = data[srcOffset + 3];
            const tokenModifiers = data[srcOffset + 4];
            const pushLine = line - prevLine;
            const pushChar = (pushLine === 0 ? char - prevChar : char);
            const dstOffset = 5 * i;
            result[dstOffset + 0] = pushLine;
            result[dstOffset + 1] = pushChar;
            result[dstOffset + 2] = length;
            result[dstOffset + 3] = tokenType;
            result[dstOffset + 4] = tokenModifiers;
            prevLine = line;
            prevChar = char;
        }
        return result;
    }
    build(resultId) {
        if (!this._dataIsSortedAndDeltaEncoded) {
            return new SemanticTokens(SemanticTokensBuilder_1._sortAndDeltaEncode(this._data), resultId);
        }
        return new SemanticTokens(new Uint32Array(this._data), resultId);
    }
};
SemanticTokensBuilder = SemanticTokensBuilder_1 = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [SemanticTokensLegend])
], SemanticTokensBuilder);
exports.SemanticTokensBuilder = SemanticTokensBuilder;
let SemanticTokens = class SemanticTokens {
    constructor(data, resultId) {
        this.resultId = resultId;
        this.data = data;
    }
};
SemanticTokens = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [Uint32Array, String])
], SemanticTokens);
exports.SemanticTokens = SemanticTokens;
let SemanticTokensEdit = class SemanticTokensEdit {
    constructor(start, deleteCount, data) {
        this.start = start;
        this.deleteCount = deleteCount;
        this.data = data;
    }
};
SemanticTokensEdit = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [Number, Number, Uint32Array])
], SemanticTokensEdit);
exports.SemanticTokensEdit = SemanticTokensEdit;
let SemanticTokensEdits = class SemanticTokensEdits {
    constructor(edits, resultId) {
        this.resultId = resultId;
        this.edits = edits;
    }
};
SemanticTokensEdits = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [Array, String])
], SemanticTokensEdits);
exports.SemanticTokensEdits = SemanticTokensEdits;
var InputBoxValidationSeverity;
(function (InputBoxValidationSeverity) {
    InputBoxValidationSeverity[InputBoxValidationSeverity["Info"] = 1] = "Info";
    InputBoxValidationSeverity[InputBoxValidationSeverity["Warning"] = 2] = "Warning";
    InputBoxValidationSeverity[InputBoxValidationSeverity["Error"] = 3] = "Error";
})(InputBoxValidationSeverity = exports.InputBoxValidationSeverity || (exports.InputBoxValidationSeverity = {}));
// #endregion
// #region Tab Inputs
class TextTabInput {
    constructor(uri) {
        this.uri = uri;
    }
}
exports.TextTabInput = TextTabInput;
class TextDiffTabInput {
    constructor(original, modified) {
        this.original = original;
        this.modified = modified;
    }
}
exports.TextDiffTabInput = TextDiffTabInput;
class TextMergeTabInput {
    constructor(base, input1, input2, result) {
        this.base = base;
        this.input1 = input1;
        this.input2 = input2;
        this.result = result;
    }
}
exports.TextMergeTabInput = TextMergeTabInput;
class CustomEditorTabInput {
    constructor(uri, viewType) {
        this.uri = uri;
        this.viewType = viewType;
    }
}
exports.CustomEditorTabInput = CustomEditorTabInput;
class WebviewEditorTabInput {
    constructor(viewType) {
        this.viewType = viewType;
    }
}
exports.WebviewEditorTabInput = WebviewEditorTabInput;
class TelemetryTrustedValue {
    constructor(value) {
        this.value = value;
    }
}
exports.TelemetryTrustedValue = TelemetryTrustedValue;
class TelemetryLogger {
    constructor(sender, options) {
        this.sender = sender;
        this.options = options;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    logUsage(eventName, data) { }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    logError(eventNameOrError, data) { }
    dispose() { }
}
exports.TelemetryLogger = TelemetryLogger;
class NotebookEditorTabInput {
    constructor(uri, notebookType) {
        this.uri = uri;
        this.notebookType = notebookType;
    }
}
exports.NotebookEditorTabInput = NotebookEditorTabInput;
class NotebookDiffEditorTabInput {
    constructor(original, modified, notebookType) {
        this.original = original;
        this.modified = modified;
        this.notebookType = notebookType;
    }
}
exports.NotebookDiffEditorTabInput = NotebookDiffEditorTabInput;
class TerminalEditorTabInput {
    constructor() { }
}
exports.TerminalEditorTabInput = TerminalEditorTabInput;
class InteractiveWindowInput {
    constructor(uri, inputBoxUri) {
        this.uri = uri;
        this.inputBoxUri = inputBoxUri;
    }
}
exports.InteractiveWindowInput = InteractiveWindowInput;
// #endregion
// #region DocumentPaste
let DocumentPasteEdit = class DocumentPasteEdit {
    constructor(insertText, id, label) {
        this.insertText = insertText;
        this.id = id;
        this.label = label;
    }
};
DocumentPasteEdit = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [Object, String, String])
], DocumentPasteEdit);
exports.DocumentPasteEdit = DocumentPasteEdit;
// #endregion
// #region DocumentPaste
var EditSessionIdentityMatch;
(function (EditSessionIdentityMatch) {
    EditSessionIdentityMatch[EditSessionIdentityMatch["Complete"] = 100] = "Complete";
    EditSessionIdentityMatch[EditSessionIdentityMatch["Partial"] = 50] = "Partial";
    EditSessionIdentityMatch[EditSessionIdentityMatch["None"] = 0] = "None";
})(EditSessionIdentityMatch = exports.EditSessionIdentityMatch || (exports.EditSessionIdentityMatch = {}));
// #endregion
//# sourceMappingURL=types-impl.js.map