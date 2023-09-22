import * as theia from '@theia/plugin';
import * as lstypes from '@theia/core/shared/vscode-languageserver-protocol';
import { URI } from './types-impl';
import * as rpc from '../common/plugin-api-rpc';
import { DecorationOptions, EditorPosition, Plugin, Position, Selection, TaskDto, WorkspaceEditDto } from '../common/plugin-api-rpc';
import * as model from '../common/plugin-api-rpc-model';
import { LanguageSelector, RelativePattern } from '@theia/editor/lib/common/language-selector';
import { MarkdownString as PluginMarkdownStringImpl } from './markdown-string';
import * as types from './types-impl';
import { UriComponents } from '../common/uri-components';
import { MarkdownString as MarkdownStringDTO } from '@theia/core/lib/common/markdown-rendering';
import { DisposableCollection } from '@theia/core/lib/common';
import * as notebooks from '@theia/notebook/lib/common';
import { CommandsConverter } from './command-registry';
import { CellData, CellOutput, CellOutputItem, CellRange } from '@theia/notebook/lib/common';
import { CellExecuteUpdate, CellExecutionComplete } from '@theia/notebook/lib/browser';
export declare function toViewColumn(ep?: EditorPosition): theia.ViewColumn | undefined;
export declare function fromViewColumn(column?: theia.ViewColumn): number;
export declare function toWebviewPanelShowOptions(options: theia.ViewColumn | theia.WebviewPanelShowOptions): theia.WebviewPanelShowOptions;
export declare function toSelection(selection: Selection): types.Selection;
export declare function fromSelection(selection: types.Selection): Selection;
export declare function toRange(range: model.Range): types.Range;
export declare function fromRange(range: undefined): undefined;
export declare function fromRange(range: theia.Range): model.Range;
export declare function fromRange(range: theia.Range | undefined): model.Range | undefined;
export declare function fromPosition(position: types.Position | theia.Position): Position;
export declare function toPosition(position: Position): types.Position;
export declare function isDecorationOptionsArr(something: theia.Range[] | theia.DecorationOptions[]): something is theia.DecorationOptions[];
export declare function fromRangeOrRangeWithMessage(ranges: theia.Range[] | theia.DecorationOptions[]): DecorationOptions[];
export declare function fromManyMarkdown(markup: (theia.MarkdownString | theia.MarkedString)[]): MarkdownStringDTO[];
export declare function fromMarkdown(markup: theia.MarkdownString | theia.MarkedString): MarkdownStringDTO;
export declare function fromMarkdownOrString(value: string | theia.MarkdownString | undefined): string | MarkdownStringDTO | undefined;
export declare function toMarkdown(value: MarkdownStringDTO): PluginMarkdownStringImpl;
export declare function fromDocumentSelector(selector: theia.DocumentSelector | undefined): LanguageSelector | undefined;
export declare function fromGlobPattern(pattern: theia.GlobPattern): string | RelativePattern;
export declare function fromCompletionItemKind(kind?: types.CompletionItemKind): model.CompletionItemKind;
export declare function toCompletionItemKind(kind?: model.CompletionItemKind): types.CompletionItemKind;
export declare function fromTextEdit(edit: theia.TextEdit): model.TextEdit;
export declare function convertDiagnosticToMarkerData(diagnostic: theia.Diagnostic): model.MarkerData;
export declare function convertCode(code: string | number | {
    value: string | number;
    target: theia.Uri;
} | undefined): string | undefined;
export declare function fromHover(hover: theia.Hover): model.Hover;
export declare function fromEvaluatableExpression(evaluatableExpression: theia.EvaluatableExpression): model.EvaluatableExpression;
export declare function fromInlineValue(inlineValue: theia.InlineValue): model.InlineValue;
export declare function toInlineValueContext(inlineValueContext: model.InlineValueContext): theia.InlineValueContext;
export declare function fromLocation(location: theia.Location): model.Location;
export declare function fromTextDocumentShowOptions(options: theia.TextDocumentShowOptions): model.TextDocumentShowOptions;
export declare function fromDefinitionLink(definitionLink: theia.DefinitionLink): model.LocationLink;
export declare namespace DocumentLink {
    function from(link: theia.DocumentLink): model.DocumentLink;
    function to(link: model.DocumentLink): theia.DocumentLink;
}
export declare function fromDocumentHighlightKind(kind?: theia.DocumentHighlightKind): model.DocumentHighlightKind | undefined;
export declare function fromDocumentHighlight(documentHighlight: theia.DocumentHighlight): model.DocumentHighlight;
export declare namespace ParameterInformation {
    function from(info: types.ParameterInformation): model.ParameterInformation;
    function to(info: model.ParameterInformation): types.ParameterInformation;
}
export declare namespace SignatureInformation {
    function from(info: types.SignatureInformation): model.SignatureInformation;
    function to(info: model.SignatureInformation): types.SignatureInformation;
}
export declare namespace SignatureHelp {
    function from(id: number, help: types.SignatureHelp): model.SignatureHelp;
    function to(help: model.SignatureHelp): types.SignatureHelp;
}
export declare function fromWorkspaceEdit(value: theia.WorkspaceEdit, documents?: any): WorkspaceEditDto;
export declare namespace SymbolKind {
    function fromSymbolKind(kind: theia.SymbolKind): model.SymbolKind;
    function toSymbolKind(kind: model.SymbolKind): theia.SymbolKind;
}
export declare function toCodeActionTriggerKind(triggerKind: model.CodeActionTriggerKind): types.CodeActionTriggerKind;
export declare function fromDocumentSymbol(info: theia.DocumentSymbol): model.DocumentSymbol;
export declare function toDocumentSymbol(symbol: model.DocumentSymbol): theia.DocumentSymbol;
export declare function fromSymbolTag(kind: types.SymbolTag): model.SymbolTag;
export declare function toSymbolTag(kind: model.SymbolTag): types.SymbolTag;
export declare function isModelLocation(arg: unknown): arg is model.Location;
export declare function isModelRange(arg: unknown): arg is model.Range;
export declare function isUriComponents(arg: unknown): arg is UriComponents;
export declare function isModelCallHierarchyItem(arg: unknown): arg is model.CallHierarchyItem;
export declare function isModelCallHierarchyIncomingCall(arg: unknown): arg is model.CallHierarchyIncomingCall;
export declare function isModelCallHierarchyOutgoingCall(arg: unknown): arg is model.CallHierarchyOutgoingCall;
export declare function toLocation(value: model.Location): types.Location;
export declare function fromHierarchyItem(item: types.CallHierarchyItem | types.TypeHierarchyItem): model.HierarchyItem;
export declare function fromCallHierarchyItem(item: types.CallHierarchyItem): model.CallHierarchyItem;
export declare function toCallHierarchyItem(value: model.CallHierarchyItem): types.CallHierarchyItem;
export declare function toCallHierarchyIncomingCall(value: model.CallHierarchyIncomingCall): types.CallHierarchyIncomingCall;
export declare function toCallHierarchyOutgoingCall(value: model.CallHierarchyOutgoingCall): types.CallHierarchyOutgoingCall;
export declare function isModelTypeHierarchyItem(arg: unknown): arg is model.TypeHierarchyItem;
export declare function fromTypeHierarchyItem(item: types.TypeHierarchyItem): model.TypeHierarchyItem;
export declare function toTypeHierarchyItem(value: model.TypeHierarchyItem): types.TypeHierarchyItem;
export declare function toWorkspaceFolder(folder: model.WorkspaceFolder): theia.WorkspaceFolder;
export declare function fromTask(task: theia.Task): TaskDto | undefined;
export declare function toTask(taskDto: TaskDto): theia.Task;
export declare function fromProcessExecution(execution: theia.ProcessExecution, taskDto: TaskDto): TaskDto;
export declare function fromShellExecution(execution: theia.ShellExecution, taskDto: TaskDto): TaskDto;
export declare function fromCustomExecution(execution: types.CustomExecution, taskDto: TaskDto): TaskDto;
export declare function getProcessExecution(taskDto: TaskDto): theia.ProcessExecution;
export declare function getShellExecution(taskDto: TaskDto): theia.ShellExecution;
export declare function getCustomExecution(taskDto: TaskDto): theia.CustomExecution;
export declare function getShellArgs(args: undefined | (string | theia.ShellQuotedString)[]): string[];
export declare function getShellExecutionOptions(options: theia.ShellExecutionOptions): {
    [key: string]: any;
};
export declare function fromSymbolInformation(symbolInformation: theia.SymbolInformation): lstypes.SymbolInformation | undefined;
export declare function toSymbolInformation(symbolInformation: lstypes.SymbolInformation): theia.SymbolInformation | undefined;
export declare function fromSelectionRange(selectionRange: theia.SelectionRange): model.SelectionRange;
export declare function fromFoldingRange(foldingRange: theia.FoldingRange): model.FoldingRange;
export declare function fromFoldingRangeKind(kind: theia.FoldingRangeKind | undefined): model.FoldingRangeKind | undefined;
export declare function fromColor(color: types.Color): [number, number, number, number];
export declare function toColor(color: [number, number, number, number]): types.Color;
export declare function fromColorPresentation(colorPresentation: theia.ColorPresentation): model.ColorPresentation;
export declare function convertToTransferQuickPickItems(items: rpc.Item[]): rpc.TransferQuickPickItems[];
export declare namespace DecorationRenderOptions {
    function from(options: theia.DecorationRenderOptions): rpc.DecorationRenderOptions;
}
export declare namespace DecorationRangeBehavior {
    function from(value: types.DecorationRangeBehavior): rpc.TrackedRangeStickiness;
}
export declare namespace ThemableDecorationRenderOptions {
    function from(options: theia.ThemableDecorationRenderOptions): rpc.ThemeDecorationRenderOptions;
}
export declare namespace ThemableDecorationAttachmentRenderOptions {
    function from(options: theia.ThemableDecorationAttachmentRenderOptions): rpc.ContentDecorationRenderOptions;
}
export declare namespace ViewColumn {
    function from(column?: theia.ViewColumn): rpc.EditorGroupColumn;
    function to(position: rpc.EditorGroupColumn): theia.ViewColumn;
}
export declare function pathOrURIToURI(value: string | URI): URI;
export declare function pluginToPluginInfo(plugin: Plugin): rpc.PluginInfo;
export declare namespace InlayHintKind {
    function from(kind: theia.InlayHintKind): model.InlayHintKind;
    function to(kind: model.InlayHintKind): theia.InlayHintKind;
}
export declare namespace DataTransferItem {
    function to(mime: string, item: model.DataTransferItemDTO, resolveFileData: (itemId: string) => Promise<Uint8Array>): theia.DataTransferItem;
}
export declare namespace DataTransfer {
    function toDataTransfer(value: model.DataTransferDTO, resolveFileData: (itemId: string) => Promise<Uint8Array>): theia.DataTransfer;
}
export declare namespace NotebookDocumentContentOptions {
    function from(options: theia.NotebookDocumentContentOptions | undefined): notebooks.TransientOptions;
}
export declare namespace NotebookStatusBarItem {
    function from(item: theia.NotebookCellStatusBarItem, commandsConverter: CommandsConverter, disposables: DisposableCollection): notebooks.NotebookCellStatusBarItem;
}
export declare namespace NotebookData {
    function from(data: theia.NotebookData): rpc.NotebookDataDto;
    function to(data: rpc.NotebookDataDto): theia.NotebookData;
}
export declare namespace NotebookCellData {
    function from(data: theia.NotebookCellData): rpc.NotebookCellDataDto;
    function to(data: rpc.NotebookCellDataDto): theia.NotebookCellData;
}
export declare namespace NotebookCellKind {
    function from(data: theia.NotebookCellKind): notebooks.CellKind;
    function to(data: notebooks.CellKind): theia.NotebookCellKind;
}
export declare namespace NotebookCellOutput {
    function from(output: theia.NotebookCellOutput & {
        outputId: string;
    }): rpc.NotebookOutputDto;
    function to(output: rpc.NotebookOutputDto): theia.NotebookCellOutput;
}
export declare namespace NotebookCellOutputItem {
    function from(item: types.NotebookCellOutputItem): rpc.NotebookOutputItemDto;
    function to(item: rpc.NotebookOutputItemDto): types.NotebookCellOutputItem;
}
export declare namespace NotebookCellOutputConverter {
    function from(output: types.NotebookCellOutput): rpc.NotebookOutputDto;
    function to(output: rpc.NotebookOutputDto): types.NotebookCellOutput;
    function ensureUniqueMimeTypes(items: types.NotebookCellOutputItem[], warn?: boolean): types.NotebookCellOutputItem[];
}
export declare namespace NotebookCellExecutionSummary {
    function to(data: notebooks.NotebookCellInternalMetadata): theia.NotebookCellExecutionSummary;
    function from(data: theia.NotebookCellExecutionSummary): Partial<notebooks.NotebookCellInternalMetadata>;
}
export declare namespace NotebookRange {
    function from(range: theia.NotebookRange): CellRange;
    function to(range: CellRange): types.NotebookRange;
}
export declare namespace NotebookKernelSourceAction {
    function from(item: theia.NotebookKernelSourceAction, commandsConverter: CommandsConverter, disposables: DisposableCollection): rpc.NotebookKernelSourceActionDto;
}
export declare namespace NotebookDto {
    function toNotebookOutputItemDto(item: CellOutputItem): rpc.NotebookOutputItemDto;
    function toNotebookOutputDto(output: CellOutput): rpc.NotebookOutputDto;
    function toNotebookCellDataDto(cell: CellData): rpc.NotebookCellDataDto;
    function fromNotebookOutputItemDto(item: rpc.NotebookOutputItemDto): CellOutputItem;
    function fromNotebookOutputDto(output: rpc.NotebookOutputDto): CellOutput;
    function fromNotebookCellDataDto(cell: rpc.NotebookCellDataDto): CellData;
    function fromCellExecuteUpdateDto(data: rpc.CellExecuteUpdateDto): CellExecuteUpdate;
    function fromCellExecuteCompleteDto(data: rpc.CellExecutionCompleteDto): CellExecutionComplete;
}
//# sourceMappingURL=type-converters.d.ts.map