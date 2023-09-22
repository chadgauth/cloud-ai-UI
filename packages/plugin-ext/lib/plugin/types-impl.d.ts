import type * as theia from '@theia/plugin';
import { URI as CodeURI, UriComponents } from '@theia/core/shared/vscode-uri';
import { SymbolKind } from '../common/plugin-api-rpc-model';
import { FileSystemProviderErrorCode } from '@theia/filesystem/lib/common/files';
import { CellMetadataEdit, NotebookDocumentMetadataEdit } from '@theia/notebook/lib/common';
/**
 * This is an implementation of #theia.Uri based on vscode-uri.
 * This is supposed to fix https://github.com/eclipse-theia/theia/issues/8752
 * We cannot simply upgrade the dependency, because the current version 3.x
 * is not compatible with our current codebase
 */
export declare class URI extends CodeURI implements theia.Uri {
    protected constructor(scheme: string, authority?: string, path?: string, query?: string, fragment?: string, _strict?: boolean);
    protected constructor(components: UriComponents);
    /**
     * Override to create the correct class.
     */
    with(change: {
        scheme?: string;
        authority?: string | null;
        path?: string | null;
        query?: string | null;
        fragment?: string | null;
    }): URI;
    static joinPath(uri: URI, ...pathSegments: string[]): URI;
    /**
     * Override to create the correct class.
     * @param data
     */
    static revive(data: UriComponents | CodeURI): URI;
    static revive(data: UriComponents | CodeURI | null): URI | null;
    static revive(data: UriComponents | CodeURI | undefined): URI | undefined;
    static parse(value: string, _strict?: boolean): URI;
    static file(path: string): URI;
    /**
     * There is quite some magic in to vscode URI class related to
     * transferring via JSON.stringify(). Making the CodeURI instance
     * makes sure we transfer this object as a vscode-uri URI.
     */
    toJSON(): UriComponents;
}
export declare class Disposable {
    private disposable;
    static from(...disposables: {
        dispose(): any;
    }[]): Disposable;
    constructor(func: () => void);
    /**
     * Dispose this object.
     */
    dispose(): void;
    static create(func: () => void): Disposable;
    static NULL: Disposable;
}
export interface AccessibilityInformation {
    label: string;
    role?: string;
}
export declare enum StatusBarAlignment {
    Left = 1,
    Right = 2
}
export declare enum TextEditorLineNumbersStyle {
    Off = 0,
    On = 1,
    Relative = 2
}
/**
 * Denotes a column in the editor window.
 * Columns are used to show editors side by side.
 */
export declare enum ViewColumn {
    Active = -1,
    Beside = -2,
    One = 1,
    Two = 2,
    Three = 3,
    Four = 4,
    Five = 5,
    Six = 6,
    Seven = 7,
    Eight = 8,
    Nine = 9
}
/**
 * Represents a color theme kind.
 */
export declare enum ColorThemeKind {
    Light = 1,
    Dark = 2,
    HighContrast = 3,
    HighContrastLight = 4
}
export declare enum ExtensionMode {
    /**
     * The extension is installed normally (for example, from the marketplace
     * or VSIX) in the editor.
     */
    Production = 1,
    /**
     * The extension is running from an `--extensionDevelopmentPath` provided
     * when launching the editor.
     */
    Development = 2,
    /**
     * The extension is running from an `--extensionTestsPath` and
     * the extension host is running unit tests.
     */
    Test = 3
}
export declare enum ExtensionKind {
    UI = 1,
    Workspace = 2
}
/**
 * Represents the validation type of the Source Control input.
 */
export declare enum SourceControlInputBoxValidationType {
    /**
     * Something not allowed by the rules of a language or other means.
     */
    Error = 0,
    /**
     * Something suspicious but allowed.
     */
    Warning = 1,
    /**
     * Something to inform about but not a problem.
     */
    Information = 2
}
export declare enum ExternalUriOpenerPriority {
    None = 0,
    Option = 1,
    Default = 2,
    Preferred = 3
}
export declare class ColorTheme implements theia.ColorTheme {
    readonly kind: ColorThemeKind;
    constructor(kind: ColorThemeKind);
}
/**
 * Represents sources that can cause `window.onDidChangeEditorSelection`
 */
export declare enum TextEditorSelectionChangeKind {
    Keyboard = 1,
    Mouse = 2,
    Command = 3
}
export declare namespace TextEditorSelectionChangeKind {
    function fromValue(s: string | undefined): TextEditorSelectionChangeKind | undefined;
}
export declare enum TextDocumentChangeReason {
    Undo = 1,
    Redo = 2
}
export declare class Position {
    private _line;
    private _character;
    constructor(line: number, char: number);
    get line(): number;
    get character(): number;
    isBefore(other: Position): boolean;
    isBeforeOrEqual(other: Position): boolean;
    isAfter(other: Position): boolean;
    isAfterOrEqual(other: Position): boolean;
    isEqual(other: Position): boolean;
    compareTo(other: Position): number;
    translate(change: {
        lineDelta?: number;
        characterDelta?: number;
    }): Position;
    translate(lineDelta?: number, characterDelta?: number): Position;
    with(change: {
        line?: number;
        character?: number;
    }): Position;
    with(line?: number, character?: number): Position;
    static Min(...positions: Position[]): Position;
    static Max(...positions: Position[]): Position;
    static isPosition(other: unknown): other is Position;
    toJSON(): unknown;
}
export declare class Range {
    protected _start: Position;
    protected _end: Position;
    constructor(start: Position, end: Position);
    constructor(startLine: number, startColumn: number, endLine: number, endColumn: number);
    get start(): Position;
    get end(): Position;
    contains(positionOrRange: Position | Range): boolean;
    isEqual(other: Range): boolean;
    intersection(other: Range): Range | undefined;
    union(other: Range): Range;
    get isEmpty(): boolean;
    get isSingleLine(): boolean;
    with(change: {
        start?: Position;
        end?: Position;
    }): Range;
    with(start?: Position, end?: Position): Range;
    static isRange(arg: unknown): arg is theia.Range;
    toJSON(): unknown;
}
export declare class Selection extends Range {
    private _anchor;
    private _active;
    constructor(anchor: Position, active: Position);
    constructor(anchorLine: number, anchorColumn: number, activeLine: number, activeColumn: number);
    get active(): Position;
    get anchor(): Position;
    get isReversed(): boolean;
}
export declare namespace TextDocumentShowOptions {
    /**
     * @param candidate
     * @returns `true` if `candidate` is an instance of options that includes a selection.
     * This function should be used to determine whether TextDocumentOptions passed into commands by plugins
     * need to be translated to TextDocumentShowOptions in the style of the RPC model. Selection is the only field that requires translation.
     */
    function isTextDocumentShowOptions(candidate: unknown): candidate is theia.TextDocumentShowOptions;
}
export declare enum EndOfLine {
    LF = 1,
    CRLF = 2
}
export declare enum EnvironmentVariableMutatorType {
    Replace = 1,
    Append = 2,
    Prepend = 3
}
export declare class SnippetString {
    static isSnippetString(thing: {}): thing is SnippetString;
    private static _escape;
    private _tabstop;
    value: string;
    constructor(value?: string);
    appendText(string: string): SnippetString;
    appendTabstop(number?: number): SnippetString;
    appendPlaceholder(value: string | ((snippet: SnippetString) => void), number?: number): SnippetString;
    appendChoice(values: string[], number?: number): SnippetString;
    appendVariable(name: string, defaultValue?: string | ((snippet: SnippetString) => void)): SnippetString;
}
export declare class ThemeColor {
    id: string;
    constructor(id: string);
}
export declare class ThemeIcon {
    id: string;
    color?: ThemeColor | undefined;
    static readonly File: ThemeIcon;
    static readonly Folder: ThemeIcon;
    private constructor();
}
export declare namespace ThemeIcon {
    function is(item: unknown): item is ThemeIcon;
}
export declare enum TextEditorRevealType {
    Default = 0,
    InCenter = 1,
    InCenterIfOutsideViewport = 2,
    AtTop = 3
}
/**
 * These values match very carefully the values of `TrackedRangeStickiness`
 */
export declare enum DecorationRangeBehavior {
    /**
     * TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges
     */
    OpenOpen = 0,
    /**
     * TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges
     */
    ClosedClosed = 1,
    /**
     * TrackedRangeStickiness.GrowsOnlyWhenTypingBefore
     */
    OpenClosed = 2,
    /**
     * TrackedRangeStickiness.GrowsOnlyWhenTypingAfter
     */
    ClosedOpen = 3
}
/**
 * Vertical Lane in the overview ruler of the editor.
 */
export declare enum OverviewRulerLane {
    Left = 1,
    Center = 2,
    Right = 4,
    Full = 7
}
export declare enum ConfigurationTarget {
    Global = 1,
    Workspace = 2,
    WorkspaceFolder = 3,
    Default = 4,
    Memory = 5
}
export declare class RelativePattern {
    pattern: string;
    private _base;
    get base(): string;
    set base(base: string);
    private _baseUri;
    get baseUri(): URI;
    set baseUri(baseUri: URI);
    constructor(base: theia.WorkspaceFolder | URI | string, pattern: string);
    pathToRelative(from: string, to: string): string;
}
export declare enum IndentAction {
    None = 0,
    Indent = 1,
    IndentOutdent = 2,
    Outdent = 3
}
export declare class TextEdit {
    protected _range: Range;
    protected _newText: string;
    protected _newEol: EndOfLine;
    get range(): Range;
    set range(value: Range);
    get newText(): string;
    set newText(value: string);
    get newEol(): EndOfLine;
    set newEol(value: EndOfLine);
    constructor(range: Range | undefined, newText: string | undefined);
    static isTextEdit(thing: {}): thing is TextEdit;
    static replace(range: Range, newText: string): TextEdit;
    static insert(position: Position, newText: string): TextEdit;
    static delete(range: Range): TextEdit;
    static setEndOfLine(eol: EndOfLine): TextEdit;
}
export declare enum CompletionTriggerKind {
    Invoke = 0,
    TriggerCharacter = 1,
    TriggerForIncompleteCompletions = 2
}
export declare enum CompletionItemKind {
    Text = 0,
    Method = 1,
    Function = 2,
    Constructor = 3,
    Field = 4,
    Variable = 5,
    Class = 6,
    Interface = 7,
    Module = 8,
    Property = 9,
    Unit = 10,
    Value = 11,
    Enum = 12,
    Keyword = 13,
    Snippet = 14,
    Color = 15,
    File = 16,
    Reference = 17,
    Folder = 18,
    EnumMember = 19,
    Constant = 20,
    Struct = 21,
    Event = 22,
    Operator = 23,
    TypeParameter = 24,
    User = 25,
    Issue = 26
}
export declare class CompletionItem implements theia.CompletionItem {
    label: string;
    kind?: CompletionItemKind;
    tags?: CompletionItemTag[];
    detail: string;
    documentation: string | theia.MarkdownString;
    sortText: string;
    filterText: string;
    preselect: boolean;
    insertText: string | SnippetString;
    range: Range;
    textEdit: TextEdit;
    additionalTextEdits: TextEdit[];
    command: theia.Command;
    constructor(label: string, kind?: CompletionItemKind);
}
export declare class CompletionList {
    isIncomplete?: boolean;
    items: theia.CompletionItem[];
    constructor(items?: theia.CompletionItem[], isIncomplete?: boolean);
}
export declare enum InlineCompletionTriggerKind {
    Invoke = 0,
    Automatic = 1
}
export declare class InlineCompletionItem implements theia.InlineCompletionItem {
    filterText?: string;
    insertText: string;
    range?: Range;
    command?: theia.Command;
    constructor(insertText: string, range?: Range, command?: theia.Command);
}
export declare class InlineCompletionList implements theia.InlineCompletionList {
    items: theia.InlineCompletionItem[];
    commands: theia.Command[] | undefined;
    constructor(items: theia.InlineCompletionItem[]);
}
export declare enum DiagnosticSeverity {
    Error = 0,
    Warning = 1,
    Information = 2,
    Hint = 3
}
export declare enum DebugConsoleMode {
    Separate = 0,
    MergeWithParent = 1
}
export declare class Location {
    uri: URI;
    range: Range;
    constructor(uri: URI, rangeOrPosition: Range | Position | undefined);
    static isLocation(thing: {}): thing is theia.Location;
}
export declare class DiagnosticRelatedInformation {
    location: Location;
    message: string;
    constructor(location: Location, message: string);
}
export declare enum DiagnosticTag {
    Unnecessary = 1,
    Deprecated = 2
}
export declare enum CompletionItemTag {
    Deprecated = 1
}
export declare class Diagnostic {
    range: Range;
    message: string;
    severity: DiagnosticSeverity;
    source?: string;
    code?: string | number;
    relatedInformation?: DiagnosticRelatedInformation[];
    tags?: DiagnosticTag[];
    constructor(range: Range, message: string, severity?: DiagnosticSeverity);
}
export declare enum MarkerSeverity {
    Hint = 1,
    Info = 2,
    Warning = 4,
    Error = 8
}
export declare enum MarkerTag {
    Unnecessary = 1,
    Deprecated = 2
}
export declare enum NotebookCellKind {
    Markup = 1,
    Code = 2
}
export declare enum NotebookCellStatusBarAlignment {
    Left = 1,
    Right = 2
}
export declare enum NotebookControllerAffinity {
    Default = 1,
    Preferred = 2
}
export declare enum NotebookEditorRevealType {
    Default = 0,
    InCenter = 1,
    InCenterIfOutsideViewport = 2,
    AtTop = 3
}
export declare enum NotebookCellExecutionState {
    /**
     * The cell is idle.
     */
    Idle = 1,
    /**
     * Execution for the cell is pending.
     */
    Pending = 2,
    /**
     * The cell is currently executing.
     */
    Executing = 3
}
export declare class NotebookKernelSourceAction {
    label: string;
    description?: string;
    detail?: string;
    command?: theia.Command;
    constructor(label: string);
}
export declare class NotebookCellData implements theia.NotebookCellData {
    languageId: string;
    kind: NotebookCellKind;
    value: string;
    outputs?: theia.NotebookCellOutput[];
    metadata?: {
        [key: string]: any;
    };
    executionSummary?: theia.NotebookCellExecutionSummary;
    constructor(kind: NotebookCellKind, value: string, languageId: string, outputs?: theia.NotebookCellOutput[], metadata?: Record<string, unknown>, executionSummary?: theia.NotebookCellExecutionSummary);
}
export declare class NotebookCellOutput implements theia.NotebookCellOutput {
    outputId: string;
    items: theia.NotebookCellOutputItem[];
    metadata?: {
        [key: string]: any;
    };
    constructor(items: theia.NotebookCellOutputItem[], idOrMetadata?: string | Record<string, any>, metadata?: {
        [key: string]: any;
    });
}
export declare class NotebookCellOutputItem implements theia.NotebookCellOutputItem {
    #private;
    mime: string;
    data: Uint8Array;
    static text(value: string, mime?: string): NotebookCellOutputItem;
    static json(value: any, mime?: string): NotebookCellOutputItem;
    static stdout(value: string): NotebookCellOutputItem;
    static stderr(value: string): NotebookCellOutputItem;
    static error(value: Error): NotebookCellOutputItem;
    constructor(data: Uint8Array, mime: string);
}
export declare class NotebookCellStatusBarItem implements theia.NotebookCellStatusBarItem {
    text: string;
    alignment: NotebookCellStatusBarAlignment;
    command?: string | theia.Command;
    tooltip?: string;
    priority?: number;
    accessibilityInformation?: AccessibilityInformation;
    /**
     * Creates a new NotebookCellStatusBarItem.
     * @param text The text to show for the item.
     * @param alignment Whether the item is aligned to the left or right.
     * @stubbed
     */
    constructor(text: string, alignment: NotebookCellStatusBarAlignment);
}
export declare class NotebookData implements theia.NotebookData {
    cells: NotebookCellData[];
    metadata?: {
        [key: string]: any;
    };
    constructor(cells: NotebookCellData[]);
}
export declare class NotebookRange implements theia.NotebookRange {
    static isNotebookRange(thing: unknown): thing is theia.NotebookRange;
    readonly start: number;
    readonly end: number;
    readonly isEmpty: boolean;
    with(change: {
        start?: number;
        end?: number;
    }): NotebookRange;
    constructor(start: number, end: number);
}
export declare class SnippetTextEdit implements theia.SnippetTextEdit {
    range: Range;
    snippet: SnippetString;
    static isSnippetTextEdit(thing: unknown): thing is SnippetTextEdit;
    static replace(range: Range, snippet: SnippetString): SnippetTextEdit;
    static insert(position: Position, snippet: SnippetString): SnippetTextEdit;
    constructor(range: Range, snippet: SnippetString);
}
export declare class NotebookEdit implements theia.NotebookEdit {
    range: theia.NotebookRange;
    newCells: theia.NotebookCellData[];
    newCellMetadata?: {
        [key: string]: any;
    } | undefined;
    newNotebookMetadata?: {
        [key: string]: any;
    } | undefined;
    static isNotebookCellEdit(thing: unknown): thing is NotebookEdit;
    static replaceCells(range: NotebookRange, newCells: NotebookCellData[]): NotebookEdit;
    static insertCells(index: number, newCells: NotebookCellData[]): NotebookEdit;
    static deleteCells(range: NotebookRange): NotebookEdit;
    static updateCellMetadata(index: number, newCellMetadata: {
        [key: string]: any;
    }): NotebookEdit;
    static updateNotebookMetadata(newNotebookMetadata: {
        [key: string]: any;
    }): NotebookEdit;
    constructor(range: NotebookRange, newCells: NotebookCellData[], newCellMetadata?: {
        [key: string]: unknown;
    }, newNotebookMetadata?: {
        [key: string]: unknown;
    });
}
export declare class NotebookRendererScript implements theia.NotebookRendererScript {
    uri: theia.Uri;
    provides: readonly string[];
    constructor(uri: theia.Uri, provides?: string | readonly string[]);
}
export declare class ParameterInformation {
    label: string | [number, number];
    documentation?: string | theia.MarkdownString;
    constructor(label: string | [number, number], documentation?: string | theia.MarkdownString);
}
export declare class SignatureInformation {
    label: string;
    documentation?: string | theia.MarkdownString;
    parameters: ParameterInformation[];
    activeParameter?: number;
    constructor(label: string, documentation?: string | theia.MarkdownString);
}
export declare enum SignatureHelpTriggerKind {
    Invoke = 1,
    TriggerCharacter = 2,
    ContentChange = 3
}
export declare class SignatureHelp {
    signatures: SignatureInformation[];
    activeSignature: number;
    activeParameter: number;
    constructor();
}
export declare class Hover {
    contents: Array<theia.MarkdownString | theia.MarkedString>;
    range?: Range;
    constructor(contents: theia.MarkdownString | theia.MarkedString | Array<theia.MarkdownString | theia.MarkedString>, range?: Range);
}
export declare class EvaluatableExpression {
    range: Range;
    expression?: string;
    constructor(range: Range, expression?: string);
}
export declare class InlineValueContext implements theia.InlineValueContext {
    frameId: number;
    stoppedLocation: Range;
    constructor(frameId: number, stoppedLocation: Range);
}
export declare class InlineValueText implements theia.InlineValueText {
    type: string;
    range: Range;
    text: string;
    constructor(range: Range, text: string);
}
export declare class InlineValueVariableLookup implements theia.InlineValueVariableLookup {
    type: string;
    range: Range;
    variableName?: string;
    caseSensitiveLookup: boolean;
    constructor(range: Range, variableName?: string, caseSensitiveLookup?: boolean);
}
export declare class InlineValueEvaluatableExpression implements theia.InlineValueEvaluatableExpression {
    type: string;
    range: Range;
    expression?: string;
    constructor(range: Range, expression?: string);
}
export declare type InlineValue = InlineValueText | InlineValueVariableLookup | InlineValueEvaluatableExpression;
export declare enum DocumentHighlightKind {
    Text = 0,
    Read = 1,
    Write = 2
}
export declare class DocumentHighlight {
    range: Range;
    kind?: DocumentHighlightKind;
    constructor(range: Range, kind?: DocumentHighlightKind);
}
export declare type Definition = Location | Location[];
export declare class DocumentLink {
    range: Range;
    target?: URI;
    tooltip?: string;
    constructor(range: Range, target: URI | undefined);
}
export declare class DocumentDropEdit {
    id?: string;
    priority?: number;
    label?: string;
    insertText: string | SnippetString;
    additionalEdit?: WorkspaceEdit;
    constructor(insertText: string | SnippetString);
}
export declare class CodeLens {
    range: Range;
    command?: theia.Command;
    get isResolved(): boolean;
    constructor(range: Range, command?: theia.Command);
}
export declare enum CodeActionTrigger {
    Automatic = 1,
    Manual = 2
}
/**
 * The reason why code actions were requested.
 */
export declare enum CodeActionTriggerKind {
    /**
     * Code actions were explicitly requested by the user or by an extension.
     */
    Invoke = 1,
    /**
     * Code actions were requested automatically.
     *
     * This typically happens when current selection in a file changes, but can
     * also be triggered when file content changes.
     */
    Automatic = 2
}
export declare class CodeActionKind {
    readonly value: string;
    private static readonly sep;
    static readonly Empty: CodeActionKind;
    static readonly QuickFix: CodeActionKind;
    static readonly Refactor: CodeActionKind;
    static readonly RefactorExtract: CodeActionKind;
    static readonly RefactorInline: CodeActionKind;
    static readonly RefactorMove: CodeActionKind;
    static readonly RefactorRewrite: CodeActionKind;
    static readonly Source: CodeActionKind;
    static readonly SourceOrganizeImports: CodeActionKind;
    static readonly SourceFixAll: CodeActionKind;
    constructor(value: string);
    append(parts: string): CodeActionKind;
    contains(other: CodeActionKind): boolean;
    intersects(other: CodeActionKind): boolean;
}
export declare enum TextDocumentSaveReason {
    Manual = 1,
    AfterDelay = 2,
    FocusOut = 3
}
export declare class CodeAction {
    title: string;
    command?: theia.Command;
    edit?: WorkspaceEdit;
    diagnostics?: Diagnostic[];
    kind?: CodeActionKind;
    disabled?: {
        reason: string;
    };
    isPreferred?: boolean;
    constructor(title: string, kind?: CodeActionKind);
}
export interface FileOperationOptions {
    overwrite?: boolean;
    ignoreIfExists?: boolean;
    ignoreIfNotExists?: boolean;
    recursive?: boolean;
}
export interface WorkspaceEditMetadata {
    needsConfirmation: boolean;
    label: string;
    description?: string;
    iconPath?: {
        id: string;
    } | {
        light: URI;
        dark: URI;
    } | ThemeIcon;
}
export declare const enum FileEditType {
    File = 1,
    Text = 2,
    Cell = 3,
    CellReplace = 5,
    Snippet = 6
}
export interface FileOperation {
    _type: FileEditType.File;
    from: URI | undefined;
    to: URI | undefined;
    options?: FileOperationOptions;
    metadata?: WorkspaceEditMetadata;
}
export interface FileTextEdit {
    _type: FileEditType.Text;
    uri: URI;
    edit: TextEdit;
    metadata?: WorkspaceEditMetadata;
}
export interface FileSnippetTextEdit {
    readonly _type: FileEditType.Snippet;
    readonly uri: URI;
    readonly range: Range;
    readonly edit: SnippetTextEdit;
    readonly metadata?: theia.WorkspaceEditEntryMetadata;
}
export interface FileCellEdit {
    readonly _type: FileEditType.Cell;
    readonly uri: URI;
    readonly edit?: CellMetadataEdit | NotebookDocumentMetadataEdit;
    readonly notebookMetadata?: Record<string, unknown>;
    readonly metadata?: theia.WorkspaceEditEntryMetadata;
}
export interface CellEdit {
    readonly _type: FileEditType.CellReplace;
    readonly metadata?: theia.WorkspaceEditEntryMetadata;
    readonly uri: URI;
    readonly index: number;
    readonly count: number;
    readonly cells: theia.NotebookCellData[];
}
declare type WorkspaceEditEntry = FileOperation | FileTextEdit | FileSnippetTextEdit | FileCellEdit | CellEdit | undefined;
export declare class WorkspaceEdit implements theia.WorkspaceEdit {
    private _edits;
    renameFile(from: theia.Uri, to: theia.Uri, options?: {
        overwrite?: boolean;
        ignoreIfExists?: boolean;
    }, metadata?: WorkspaceEditMetadata): void;
    createFile(uri: theia.Uri, options?: {
        overwrite?: boolean;
        ignoreIfExists?: boolean;
    }, metadata?: WorkspaceEditMetadata): void;
    deleteFile(uri: theia.Uri, options?: {
        recursive?: boolean;
        ignoreIfNotExists?: boolean;
    }, metadata?: WorkspaceEditMetadata): void;
    replace(uri: URI, range: Range, newText: string, metadata?: WorkspaceEditMetadata): void;
    insert(resource: URI, position: Position, newText: string, metadata?: WorkspaceEditMetadata): void;
    delete(resource: URI, range: Range, metadata?: WorkspaceEditMetadata): void;
    has(uri: URI): boolean;
    set(uri: URI, edits: ReadonlyArray<TextEdit | SnippetTextEdit>): void;
    set(uri: URI, edits: ReadonlyArray<[TextEdit | SnippetTextEdit, theia.WorkspaceEditEntryMetadata]>): void;
    set(uri: URI, edits: ReadonlyArray<NotebookEdit>): void;
    set(uri: URI, edits: ReadonlyArray<[NotebookEdit, theia.WorkspaceEditEntryMetadata]>): void;
    get(uri: URI): TextEdit[];
    entries(): [URI, TextEdit[]][];
    _allEntries(): ReadonlyArray<WorkspaceEditEntry>;
    get size(): number;
    toJSON(): any;
}
export declare class DataTransferItem {
    readonly value: any;
    asString(): Thenable<string>;
    asFile(): theia.DataTransferFile | undefined;
    constructor(value: any);
}
/**
 * A map containing a mapping of the mime type of the corresponding transferred data.
 *
 * Drag and drop controllers that implement {@link TreeDragAndDropController.handleDrag `handleDrag`} can add additional mime types to the
 * data transfer. These additional mime types will only be included in the `handleDrop` when the the drag was initiated from
 * an element in the same drag and drop controller.
 */
export declare class DataTransfer implements Iterable<[mimeType: string, item: DataTransferItem]> {
    private items;
    get(mimeType: string): DataTransferItem | undefined;
    set(mimeType: string, value: DataTransferItem): void;
    has(mimeType: string): boolean;
    forEach(callbackfn: (item: DataTransferItem, mimeType: string, dataTransfer: DataTransfer) => void, thisArg?: any): void;
    [Symbol.iterator](): IterableIterator<[mimeType: string, item: DataTransferItem]>;
    clear(): void;
}
export declare class TreeItem {
    collapsibleState: theia.TreeItemCollapsibleState;
    label?: string | theia.TreeItemLabel;
    id?: string;
    iconPath?: string | URI | {
        light: string | URI;
        dark: string | URI;
    } | ThemeIcon;
    resourceUri?: URI;
    tooltip?: string | undefined;
    command?: theia.Command;
    contextValue?: string;
    checkboxState?: theia.TreeItemCheckboxState | {
        readonly state: theia.TreeItemCheckboxState;
        readonly tooltip?: string;
        readonly accessibilityInformation?: AccessibilityInformation;
    };
    constructor(label: string | theia.TreeItemLabel, collapsibleState?: theia.TreeItemCollapsibleState);
    constructor(resourceUri: URI, collapsibleState?: theia.TreeItemCollapsibleState);
}
export declare enum TreeItemCollapsibleState {
    None = 0,
    Collapsed = 1,
    Expanded = 2
}
export declare enum TreeItemCheckboxState {
    Unchecked = 0,
    Checked = 1
}
export declare enum SymbolTag {
    Deprecated = 1
}
export declare class SymbolInformation {
    static validate(candidate: SymbolInformation): void;
    name: string;
    location: Location;
    kind: SymbolKind;
    tags?: SymbolTag[];
    containerName: undefined | string;
    constructor(name: string, kind: SymbolKind, containerName: string, location: Location);
    constructor(name: string, kind: SymbolKind, range: Range, uri?: URI, containerName?: string);
    toJSON(): any;
}
export declare class DocumentSymbol {
    static validate(candidate: DocumentSymbol): void;
    name: string;
    detail: string;
    kind: SymbolKind;
    tags?: SymbolTag[];
    range: Range;
    selectionRange: Range;
    children: DocumentSymbol[];
    constructor(name: string, detail: string, kind: SymbolKind, range: Range, selectionRange: Range);
}
export declare enum CommentThreadState {
    Unresolved = 0,
    Resolved = 1
}
export declare enum CommentThreadCollapsibleState {
    Collapsed = 0,
    Expanded = 1
}
export declare class QuickInputButtons {
    static readonly Back: theia.QuickInputButton;
}
export declare class TerminalLink {
    static validate(candidate: TerminalLink): void;
    startIndex: number;
    length: number;
    tooltip?: string;
    constructor(startIndex: number, length: number, tooltip?: string);
}
export declare enum TerminalLocation {
    Panel = 1,
    Editor = 2
}
export declare enum TerminalOutputAnchor {
    Top = 0,
    Bottom = 1
}
export declare class TerminalProfile {
    readonly options: theia.TerminalOptions | theia.ExtensionTerminalOptions;
    /**
     * Creates a new terminal profile.
     * @param options The options that the terminal will launch with.
     */
    constructor(options: theia.TerminalOptions | theia.ExtensionTerminalOptions);
}
export declare enum TerminalExitReason {
    Unknown = 0,
    Shutdown = 1,
    Process = 2,
    User = 3,
    Extension = 4
}
export declare enum TerminalQuickFixType {
    command = "command",
    opener = "opener"
}
export declare class FileDecoration {
    static validate(d: FileDecoration): void;
    badge?: string;
    tooltip?: string;
    color?: theia.ThemeColor;
    priority?: number;
    propagate?: boolean;
    constructor(badge?: string, tooltip?: string, color?: ThemeColor);
}
export declare enum CommentMode {
    Editing = 0,
    Preview = 1
}
export declare enum FileChangeType {
    Changed = 1,
    Created = 2,
    Deleted = 3
}
export declare class FileSystemError extends Error {
    static FileExists(messageOrUri?: string | URI): FileSystemError;
    static FileNotFound(messageOrUri?: string | URI): FileSystemError;
    static FileNotADirectory(messageOrUri?: string | URI): FileSystemError;
    static FileIsADirectory(messageOrUri?: string | URI): FileSystemError;
    static NoPermissions(messageOrUri?: string | URI): FileSystemError;
    static Unavailable(messageOrUri?: string | URI): FileSystemError;
    readonly code: string;
    constructor(uriOrMessage?: string | URI, code?: FileSystemProviderErrorCode, terminator?: Function);
}
export declare enum FileType {
    Unknown = 0,
    File = 1,
    Directory = 2,
    SymbolicLink = 64
}
export interface FileStat {
    readonly type: FileType;
    readonly ctime: number;
    readonly mtime: number;
    readonly size: number;
}
export declare class ProgressOptions {
    /**
     * The location at which progress should show.
     */
    location: ProgressLocation;
    /**
     * A human-readable string which will be used to describe the
     * operation.
     */
    title?: string;
    /**
     * Controls if a cancel button should show to allow the user to
     * cancel the long running operation.  Note that currently only
     * `ProgressLocation.Notification` is supporting to show a cancel
     * button.
     */
    cancellable?: boolean;
    constructor(location: ProgressLocation, title?: string, cancellable?: boolean);
}
export declare class Progress<T> {
    /**
     * Report a progress update.
     * @param value A progress item, like a message and/or an
     * report on how much work finished
     */
    report(value: T): void;
}
export declare enum ProgressLocation {
    /**
     * Show progress for the source control viewlet, as overlay for the icon and as progress bar
     * inside the viewlet (when visible). Neither supports cancellation nor discrete progress.
     */
    SourceControl = 1,
    /**
     * Show progress in the status bar of the editor. Neither supports cancellation nor discrete progress.
     */
    Window = 10,
    /**
     * Show progress as notification with an optional cancel button. Supports to show infinite and discrete progress.
     */
    Notification = 15
}
export declare class ProcessExecution {
    private executionProcess;
    private arguments;
    private executionOptions;
    constructor(process: string, options?: theia.ProcessExecutionOptions);
    constructor(process: string, args: string[], options?: theia.ProcessExecutionOptions);
    get process(): string;
    set process(value: string);
    get args(): string[];
    set args(value: string[]);
    get options(): theia.ProcessExecutionOptions | undefined;
    set options(value: theia.ProcessExecutionOptions | undefined);
    static is(value: theia.ShellExecution | theia.ProcessExecution | theia.CustomExecution): value is ProcessExecution;
}
export declare enum QuickPickItemKind {
    Separator = -1,
    Default = 0
}
export declare enum ShellQuoting {
    Escape = 1,
    Strong = 2,
    Weak = 3
}
export declare enum TaskPanelKind {
    Shared = 1,
    Dedicated = 2,
    New = 3
}
export declare enum TaskRevealKind {
    Always = 1,
    Silent = 2,
    Never = 3
}
export declare class ShellExecution {
    private shellCommandLine;
    private shellCommand;
    private arguments;
    private shellOptions;
    constructor(commandLine: string, options?: theia.ShellExecutionOptions);
    constructor(command: string | theia.ShellQuotedString, args: (string | theia.ShellQuotedString)[], options?: theia.ShellExecutionOptions);
    get commandLine(): string;
    set commandLine(value: string);
    get command(): string | theia.ShellQuotedString;
    set command(value: string | theia.ShellQuotedString);
    get args(): (string | theia.ShellQuotedString)[];
    set args(value: (string | theia.ShellQuotedString)[]);
    get options(): theia.ShellExecutionOptions | undefined;
    set options(value: theia.ShellExecutionOptions | undefined);
    static is(value: theia.ShellExecution | theia.ProcessExecution | theia.CustomExecution): value is ShellExecution;
}
export declare class CustomExecution {
    private _callback;
    constructor(callback: (resolvedDefinition: theia.TaskDefinition) => Thenable<theia.Pseudoterminal>);
    set callback(value: (resolvedDefinition: theia.TaskDefinition) => Thenable<theia.Pseudoterminal>);
    get callback(): ((resolvedDefinition: theia.TaskDefinition) => Thenable<theia.Pseudoterminal>);
    static is(value: theia.ShellExecution | theia.ProcessExecution | theia.CustomExecution): value is CustomExecution;
}
export declare class TaskGroup {
    readonly id: 'clean' | 'build' | 'rebuild' | 'test';
    static Clean: TaskGroup;
    static Build: TaskGroup;
    static Rebuild: TaskGroup;
    static Test: TaskGroup;
    static from(value: string): TaskGroup | undefined;
    constructor(id: 'clean' | 'build' | 'rebuild' | 'test', label: string);
    constructor(id: 'clean' | 'build' | 'rebuild' | 'test', label: string, isDefault?: boolean | undefined);
    readonly isDefault: boolean;
}
export declare enum TaskScope {
    Global = 1,
    Workspace = 2
}
export declare class Task {
    private taskDefinition;
    private taskScope;
    private taskName;
    private taskExecution;
    private taskProblemMatchers;
    private hasTaskProblemMatchers;
    private isTaskBackground;
    private taskSource;
    private taskGroup;
    private taskPresentationOptions;
    private taskRunOptions;
    constructor(taskDefinition: theia.TaskDefinition, scope: theia.WorkspaceFolder | theia.TaskScope.Global | theia.TaskScope.Workspace, name: string, source: string, execution?: ProcessExecution | ShellExecution | CustomExecution, problemMatchers?: string | string[]);
    constructor(taskDefinition: theia.TaskDefinition, name: string, source: string, execution?: ProcessExecution | ShellExecution | CustomExecution, problemMatchers?: string | string[]);
    get definition(): theia.TaskDefinition;
    set definition(value: theia.TaskDefinition);
    get scope(): theia.TaskScope.Global | theia.TaskScope.Workspace | theia.WorkspaceFolder | undefined;
    set scope(value: theia.TaskScope.Global | theia.TaskScope.Workspace | theia.WorkspaceFolder | undefined);
    get name(): string;
    set name(value: string);
    get execution(): ProcessExecution | ShellExecution | CustomExecution | undefined;
    set execution(value: ProcessExecution | ShellExecution | CustomExecution | undefined);
    get problemMatchers(): string[];
    set problemMatchers(value: string[]);
    get hasProblemMatchers(): boolean;
    get isBackground(): boolean;
    set isBackground(value: boolean);
    get source(): string;
    set source(value: string);
    get group(): TaskGroup | undefined;
    set group(value: TaskGroup | undefined);
    get presentationOptions(): theia.TaskPresentationOptions;
    set presentationOptions(value: theia.TaskPresentationOptions);
    get runOptions(): theia.RunOptions;
    set runOptions(value: theia.RunOptions);
}
export declare class Task2 extends Task {
}
export declare class DebugAdapterExecutable {
    /**
     * The command or path of the debug adapter executable.
     * A command must be either an absolute path of an executable or the name of an command to be looked up via the PATH environment variable.
     * The special value 'node' will be mapped to VS Code's built-in Node.js runtime.
     */
    readonly command: string;
    /**
     * The arguments passed to the debug adapter executable. Defaults to an empty array.
     */
    readonly args?: string[];
    /**
     * Optional options to be used when the debug adapter is started.
     * Defaults to undefined.
     */
    readonly options?: theia.DebugAdapterExecutableOptions;
    /**
     * Creates a description for a debug adapter based on an executable program.
     *
     * @param command The command or executable path that implements the debug adapter.
     * @param args Optional arguments to be passed to the command or executable.
     * @param options Optional options to be used when starting the command or executable.
     */
    constructor(command: string, args?: string[], options?: theia.DebugAdapterExecutableOptions);
}
export declare namespace DebugAdapterExecutable {
    function is(adapter: theia.DebugAdapterDescriptor | undefined): adapter is theia.DebugAdapterExecutable;
}
/**
 * Represents a debug adapter running as a socket based server.
 */
export declare class DebugAdapterServer {
    /**
     * The port.
     */
    readonly port: number;
    /**
     * The host.
     */
    readonly host?: string;
    /**
     * Create a description for a debug adapter running as a socket based server.
     */
    constructor(port: number, host?: string);
}
export declare namespace DebugAdapterServer {
    function is(adapter: theia.DebugAdapterDescriptor | undefined): adapter is DebugAdapterServer;
}
/**
 * Represents a debug adapter running as a Named Pipe (on Windows)/UNIX Domain Socket (on non-Windows) based server.
 */
export declare class DebugAdapterNamedPipeServer {
    readonly path: string;
    /**
     * Create a description for a debug adapter running as a Named Pipe (on Windows)/UNIX Domain Socket (on non-Windows) based server.
     */
    constructor(path: string);
}
export declare namespace DebugAdapterNamedPipeServer {
    function is(adapter: theia.DebugAdapterDescriptor | undefined): adapter is DebugAdapterNamedPipeServer;
}
/**
 * A debug adapter descriptor for an inline implementation.
 */
export declare class DebugAdapterInlineImplementation {
    implementation: theia.DebugAdapter;
    /**
     * Create a descriptor for an inline implementation of a debug adapter.
     */
    constructor(impl: theia.DebugAdapter);
}
export declare namespace DebugAdapterInlineImplementation {
    function is(adapter: theia.DebugAdapterDescriptor | undefined): adapter is DebugAdapterInlineImplementation;
}
export declare type DebugAdapterDescriptor = DebugAdapterExecutable | DebugAdapterServer | DebugAdapterNamedPipeServer | DebugAdapterInlineImplementation;
export declare enum LogLevel {
    Off = 0,
    Trace = 1,
    Debug = 2,
    Info = 3,
    Warning = 4,
    Error = 5
}
/**
 * The base class of all breakpoint types.
 */
export declare class Breakpoint {
    /**
     * Is breakpoint enabled.
     */
    enabled: boolean;
    /**
     * An optional expression for conditional breakpoints.
     */
    condition?: string;
    /**
     * An optional expression that controls how many hits of the breakpoint are ignored.
     */
    hitCondition?: string;
    /**
     * An optional message that gets logged when this breakpoint is hit. Embedded expressions within {} are interpolated by the debug adapter.
     */
    logMessage?: string;
    protected constructor(enabled?: boolean, condition?: string, hitCondition?: string, logMessage?: string, id?: string);
    private _id;
    /**
     * The unique ID of the breakpoint.
     */
    get id(): string;
}
/**
 * A breakpoint specified by a source location.
 */
export declare class SourceBreakpoint extends Breakpoint {
    /**
     * The source and line position of this breakpoint.
     */
    location: Location;
    /**
     * Create a new breakpoint for a source location.
     */
    constructor(location: Location, enabled?: boolean, condition?: string, hitCondition?: string, logMessage?: string, id?: string);
}
/**
 * A breakpoint specified by a function name.
 */
export declare class FunctionBreakpoint extends Breakpoint {
    /**
     * The name of the function to which this breakpoint is attached.
     */
    functionName: string;
    /**
     * Create a new function breakpoint.
     */
    constructor(functionName: string, enabled?: boolean, condition?: string, hitCondition?: string, logMessage?: string, id?: string);
}
export declare class Color {
    readonly red: number;
    readonly green: number;
    readonly blue: number;
    readonly alpha: number;
    constructor(red: number, green: number, blue: number, alpha: number);
}
export declare class ColorInformation {
    range: Range;
    color: Color;
    constructor(range: Range, color: Color);
}
export declare class ColorPresentation {
    label: string;
    textEdit?: TextEdit;
    additionalTextEdits?: TextEdit[];
    constructor(label: string);
}
export declare enum ColorFormat {
    RGB = 0,
    HEX = 1,
    HSL = 2
}
export declare class InlayHintLabelPart implements theia.InlayHintLabelPart {
    value: string;
    tooltip?: string | theia.MarkdownString | undefined;
    location?: Location | undefined;
    command?: theia.Command | undefined;
    constructor(value: string);
}
export declare class InlayHint implements theia.InlayHint {
    position: theia.Position;
    label: string | InlayHintLabelPart[];
    tooltip?: string | theia.MarkdownString | undefined;
    kind?: InlayHintKind;
    textEdits?: TextEdit[];
    paddingLeft?: boolean;
    paddingRight?: boolean;
    constructor(position: theia.Position, label: string | InlayHintLabelPart[], kind?: InlayHintKind);
}
export declare enum InlayHintKind {
    Type = 1,
    Parameter = 2
}
export declare class FoldingRange {
    start: number;
    end: number;
    kind?: FoldingRangeKind;
    constructor(start: number, end: number, kind?: FoldingRangeKind);
}
export declare enum FoldingRangeKind {
    Comment = 1,
    Imports = 2,
    Region = 3
}
export declare class SelectionRange {
    range: Range;
    parent?: SelectionRange;
    constructor(range: Range, parent?: SelectionRange);
}
/**
 * Enumeration of the supported operating systems.
 */
export declare enum OperatingSystem {
    Windows = "Windows",
    Linux = "Linux",
    OSX = "OSX"
}
/** The areas of the application shell where webview panel can reside. */
export declare enum WebviewPanelTargetArea {
    Main = "main",
    Left = "left",
    Right = "right",
    Bottom = "bottom"
}
/**
 * Possible kinds of UI that can use extensions.
 */
export declare enum UIKind {
    /**
     * Extensions are accessed from a desktop application.
     */
    Desktop = 1,
    /**
     * Extensions are accessed from a web browser.
     */
    Web = 2
}
export declare class CallHierarchyItem {
    _sessionId?: string;
    _itemId?: string;
    kind: SymbolKind;
    name: string;
    detail?: string;
    uri: URI;
    range: Range;
    selectionRange: Range;
    tags?: readonly SymbolTag[];
    constructor(kind: SymbolKind, name: string, detail: string, uri: URI, range: Range, selectionRange: Range);
    static isCallHierarchyItem(thing: {}): thing is CallHierarchyItem;
}
export declare class CallHierarchyIncomingCall {
    from: theia.CallHierarchyItem;
    fromRanges: theia.Range[];
    constructor(item: CallHierarchyItem, fromRanges: Range[]);
}
export declare class CallHierarchyOutgoingCall {
    to: theia.CallHierarchyItem;
    fromRanges: theia.Range[];
    constructor(item: CallHierarchyItem, fromRanges: Range[]);
}
export declare class TypeHierarchyItem {
    _sessionId?: string;
    _itemId?: string;
    kind: SymbolKind;
    tags?: readonly SymbolTag[];
    name: string;
    detail?: string;
    uri: URI;
    range: Range;
    selectionRange: Range;
    constructor(kind: SymbolKind, name: string, detail: string, uri: URI, range: Range, selectionRange: Range);
    static isTypeHierarchyItem(thing: {}): thing is TypeHierarchyItem;
}
export declare enum LanguageStatusSeverity {
    Information = 0,
    Warning = 1,
    Error = 2
}
export declare class LinkedEditingRanges {
    ranges: theia.Range[];
    wordPattern?: RegExp;
    constructor(ranges: Range[], wordPattern?: RegExp);
}
export declare enum TestRunProfileKind {
    Run = 1,
    Debug = 2,
    Coverage = 3
}
export declare class TestTag implements theia.TestTag {
    readonly id: string;
    constructor(id: string);
}
export declare class TestRunRequest implements theia.TestRunRequest {
    readonly include: theia.TestItem[] | undefined;
    readonly exclude: theia.TestItem[] | undefined;
    readonly profile: theia.TestRunProfile | undefined;
    readonly continuous: boolean | undefined;
    constructor(include?: theia.TestItem[] | undefined, exclude?: theia.TestItem[] | undefined, profile?: theia.TestRunProfile | undefined, continuous?: boolean | undefined);
}
export declare class TestMessage implements theia.TestMessage {
    message: string | theia.MarkdownString;
    expectedOutput?: string;
    actualOutput?: string;
    location?: theia.Location;
    static diff(message: string | theia.MarkdownString, expected: string, actual: string): theia.TestMessage;
    constructor(message: string | theia.MarkdownString);
}
export declare class TimelineItem {
    timestamp: number;
    label: string;
    id?: string;
    iconPath?: theia.Uri | {
        light: theia.Uri;
        dark: theia.Uri;
    } | ThemeIcon;
    description?: string;
    detail?: string;
    command?: theia.Command;
    contextValue?: string;
    constructor(label: string, timestamp: number);
}
export declare class SemanticTokensLegend {
    readonly tokenTypes: string[];
    readonly tokenModifiers: string[];
    constructor(tokenTypes: string[], tokenModifiers?: string[]);
}
export declare class SemanticTokensBuilder {
    private _prevLine;
    private _prevChar;
    private _dataIsSortedAndDeltaEncoded;
    private _data;
    private _dataLen;
    private _tokenTypeStrToInt;
    private _tokenModifierStrToInt;
    private _hasLegend;
    constructor(legend?: SemanticTokensLegend);
    push(line: number, char: number, length: number, tokenType: number, tokenModifiers?: number): void;
    push(range: Range, tokenType: string, tokenModifiers?: string[]): void;
    private _push;
    private _pushEncoded;
    private static _sortAndDeltaEncode;
    build(resultId?: string): SemanticTokens;
}
export declare class SemanticTokens {
    readonly resultId: string | undefined;
    readonly data: Uint32Array;
    constructor(data: Uint32Array, resultId?: string);
}
export declare class SemanticTokensEdit {
    readonly start: number;
    readonly deleteCount: number;
    readonly data: Uint32Array | undefined;
    constructor(start: number, deleteCount: number, data?: Uint32Array);
}
export declare class SemanticTokensEdits {
    readonly resultId: string | undefined;
    readonly edits: SemanticTokensEdit[];
    constructor(edits: SemanticTokensEdit[], resultId?: string);
}
export declare enum InputBoxValidationSeverity {
    Info = 1,
    Warning = 2,
    Error = 3
}
export declare class TextTabInput {
    readonly uri: URI;
    constructor(uri: URI);
}
export declare class TextDiffTabInput {
    readonly original: URI;
    readonly modified: URI;
    constructor(original: URI, modified: URI);
}
export declare class TextMergeTabInput {
    readonly base: URI;
    readonly input1: URI;
    readonly input2: URI;
    readonly result: URI;
    constructor(base: URI, input1: URI, input2: URI, result: URI);
}
export declare class CustomEditorTabInput {
    readonly uri: URI;
    readonly viewType: string;
    constructor(uri: URI, viewType: string);
}
export declare class WebviewEditorTabInput {
    readonly viewType: string;
    constructor(viewType: string);
}
export declare class TelemetryTrustedValue<T> {
    readonly value: T;
    constructor(value: T);
}
export declare class TelemetryLogger {
    readonly sender: TelemetrySender;
    readonly options?: TelemetryLoggerOptions | undefined;
    readonly onDidChangeEnableStates: theia.Event<TelemetryLogger>;
    readonly isUsageEnabled: boolean;
    readonly isErrorsEnabled: boolean;
    logUsage(eventName: string, data?: Record<string, any | TelemetryTrustedValue<any>>): void;
    logError(eventNameOrError: string | Error, data?: Record<string, any | TelemetryTrustedValue<any>>): void;
    dispose(): void;
    constructor(sender: TelemetrySender, options?: TelemetryLoggerOptions | undefined);
}
export interface TelemetrySender {
    sendEventData(eventName: string, data?: Record<string, any>): void;
    sendErrorData(error: Error, data?: Record<string, any>): void;
    flush?(): void | Thenable<void>;
}
export interface TelemetryLoggerOptions {
    /**
     * Whether or not you want to avoid having the built-in common properties such as os, extension name, etc injected into the data object.
     * Defaults to `false` if not defined.
     */
    readonly ignoreBuiltInCommonProperties?: boolean;
    /**
     * Whether or not unhandled errors on the extension host caused by your extension should be logged to your sender.
     * Defaults to `false` if not defined.
     */
    readonly ignoreUnhandledErrors?: boolean;
    /**
     * Any additional common properties which should be injected into the data object.
     */
    readonly additionalCommonProperties?: Record<string, any>;
}
export declare class NotebookEditorTabInput {
    readonly uri: URI;
    readonly notebookType: string;
    constructor(uri: URI, notebookType: string);
}
export declare class NotebookDiffEditorTabInput {
    readonly original: URI;
    readonly modified: URI;
    readonly notebookType: string;
    constructor(original: URI, modified: URI, notebookType: string);
}
export declare class TerminalEditorTabInput {
    constructor();
}
export declare class InteractiveWindowInput {
    readonly uri: URI;
    readonly inputBoxUri: URI;
    constructor(uri: URI, inputBoxUri: URI);
}
export declare class DocumentPasteEdit {
    constructor(insertText: string | SnippetString, id: string, label: string);
    insertText: string | SnippetString;
    additionalEdit?: WorkspaceEdit;
    id: string;
    label: string;
    priority?: number;
}
export declare enum EditSessionIdentityMatch {
    Complete = 100,
    Partial = 50,
    None = 0
}
export {};
//# sourceMappingURL=types-impl.d.ts.map