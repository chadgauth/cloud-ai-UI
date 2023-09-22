import { LanguagesMain, SerializedLanguageConfiguration, WorkspaceEditDto, PluginInfo, LanguageStatus as LanguageStatusDTO } from '../../common/plugin-api-rpc';
import { SerializedDocumentFilter, MarkerData, Range, DocumentLink, WorkspaceSymbolParams, CodeActionProviderDocumentation, CodeActionContext, DocumentDropEditProviderMetadata } from '../../common/plugin-api-rpc-model';
import { RPCProtocol } from '../../common/rpc-protocol';
import { WorkspaceSymbolProvider } from '@theia/monaco/lib/browser/monaco-languages';
import { Disposable } from '@theia/core/lib/common/disposable';
import { Event } from '@theia/core/lib/common/event';
import * as vst from '@theia/core/shared/vscode-languageserver-protocol';
import * as theia from '@theia/plugin';
import { UriComponents } from '../../common/uri-components';
import { CancellationToken } from '@theia/core/lib/common';
import { CallHierarchyService } from '@theia/callhierarchy/lib/browser';
import { TypeHierarchyService } from '@theia/typehierarchy/lib/browser';
import * as monaco from '@theia/monaco-editor-core';
import * as MonacoLanguageSelector from '@theia/monaco-editor-core/esm/vs/editor/common/languageSelector';
import { EditorLanguageStatusService } from '@theia/editor/lib/browser/language-status/editor-language-status-service';
import { LanguageSelector } from '@theia/editor/lib/common/language-selector';
import { DocumentOnDropEdit, DocumentOnDropEditProvider, EvaluatableExpression, EvaluatableExpressionProvider, InlineValue, InlineValueContext, InlineValuesProvider } from '@theia/monaco-editor-core/esm/vs/editor/common/languages';
import { ITextModel } from '@theia/monaco-editor-core/esm/vs/editor/common/model';
import { CodeActionTriggerKind } from '../../plugin/types-impl';
import { VSDataTransfer } from '@theia/monaco-editor-core/esm/vs/base/common/dataTransfer';
import { FileUploadService } from '@theia/filesystem/lib/browser/file-upload-service';
export declare class LanguagesMainImpl implements LanguagesMain, Disposable {
    private readonly monacoLanguages;
    private readonly problemManager;
    private readonly callHierarchyServiceContributionRegistry;
    private readonly typeHierarchyServiceContributionRegistry;
    protected readonly languageStatusService: EditorLanguageStatusService;
    protected readonly fileUploadService: FileUploadService;
    private readonly proxy;
    private readonly services;
    private readonly toDispose;
    constructor(rpc: RPCProtocol);
    dispose(): void;
    $getLanguages(): Promise<string[]>;
    $changeLanguage(resource: UriComponents, languageId: string): Promise<void>;
    protected register(handle: number, service: Disposable): void;
    $unregister(handle: number): void;
    $setLanguageConfiguration(handle: number, languageId: string, configuration: SerializedLanguageConfiguration): void;
    $registerCompletionSupport(handle: number, pluginInfo: PluginInfo, selector: SerializedDocumentFilter[], triggerCharacters: string[], supportsResolveDetails: boolean): void;
    protected provideCompletionItems(handle: number, model: monaco.editor.ITextModel, position: monaco.Position, context: monaco.languages.CompletionContext, token: monaco.CancellationToken): monaco.languages.ProviderResult<monaco.languages.CompletionList>;
    protected resolveCompletionItem(handle: number, item: monaco.languages.CompletionItem, token: monaco.CancellationToken): monaco.languages.ProviderResult<monaco.languages.CompletionItem>;
    $registerDefinitionProvider(handle: number, pluginInfo: PluginInfo, selector: SerializedDocumentFilter[]): void;
    $registerDeclarationProvider(handle: number, pluginInfo: PluginInfo, selector: SerializedDocumentFilter[]): void;
    $registerReferenceProvider(handle: number, pluginInfo: PluginInfo, selector: SerializedDocumentFilter[]): void;
    protected createReferenceProvider(handle: number): monaco.languages.ReferenceProvider;
    protected provideReferences(handle: number, model: monaco.editor.ITextModel, position: monaco.Position, context: monaco.languages.ReferenceContext, token: monaco.CancellationToken): monaco.languages.ProviderResult<monaco.languages.Location[]>;
    $registerSignatureHelpProvider(handle: number, pluginInfo: PluginInfo, selector: SerializedDocumentFilter[], metadata: theia.SignatureHelpProviderMetadata): void;
    $clearDiagnostics(id: string): void;
    $changeDiagnostics(id: string, delta: [string, MarkerData[]][]): void;
    $registerImplementationProvider(handle: number, pluginInfo: PluginInfo, selector: SerializedDocumentFilter[]): void;
    protected createImplementationProvider(handle: number): monaco.languages.ImplementationProvider;
    protected provideImplementation(handle: number, model: monaco.editor.ITextModel, position: monaco.Position, token: monaco.CancellationToken): monaco.languages.ProviderResult<monaco.languages.Definition>;
    $registerTypeDefinitionProvider(handle: number, pluginInfo: PluginInfo, selector: SerializedDocumentFilter[]): void;
    protected createTypeDefinitionProvider(handle: number): monaco.languages.TypeDefinitionProvider;
    protected provideTypeDefinition(handle: number, model: monaco.editor.ITextModel, position: monaco.Position, token: monaco.CancellationToken): monaco.languages.ProviderResult<monaco.languages.Definition>;
    $registerHoverProvider(handle: number, pluginInfo: PluginInfo, selector: SerializedDocumentFilter[]): void;
    protected createHoverProvider(handle: number): monaco.languages.HoverProvider;
    protected provideHover(handle: number, model: monaco.editor.ITextModel, position: monaco.Position, token: monaco.CancellationToken): monaco.languages.ProviderResult<monaco.languages.Hover>;
    $registerEvaluatableExpressionProvider(handle: number, pluginInfo: PluginInfo, selector: SerializedDocumentFilter[]): void;
    protected createEvaluatableExpressionProvider(handle: number): EvaluatableExpressionProvider;
    protected provideEvaluatableExpression(handle: number, model: ITextModel, position: monaco.Position, token: monaco.CancellationToken): monaco.languages.ProviderResult<EvaluatableExpression | undefined>;
    $registerInlineValuesProvider(handle: number, pluginInfo: PluginInfo, selector: SerializedDocumentFilter[]): void;
    protected createInlineValuesProvider(handle: number): InlineValuesProvider;
    protected provideInlineValues(handle: number, model: ITextModel, range: Range, context: InlineValueContext, token: monaco.CancellationToken): monaco.languages.ProviderResult<InlineValue[] | undefined>;
    $emitInlineValuesEvent(eventHandle: number, event?: any): void;
    $registerDocumentHighlightProvider(handle: number, _pluginInfo: PluginInfo, selector: SerializedDocumentFilter[]): void;
    protected createDocumentHighlightProvider(handle: number): monaco.languages.DocumentHighlightProvider;
    protected provideDocumentHighlights(handle: number, model: monaco.editor.ITextModel, position: monaco.Position, token: monaco.CancellationToken): monaco.languages.ProviderResult<monaco.languages.DocumentHighlight[]>;
    $registerWorkspaceSymbolProvider(handle: number, pluginInfo: PluginInfo): void;
    protected createWorkspaceSymbolProvider(handle: number): WorkspaceSymbolProvider;
    protected provideWorkspaceSymbols(handle: number, params: WorkspaceSymbolParams, token: monaco.CancellationToken): Thenable<vst.SymbolInformation[]>;
    protected resolveWorkspaceSymbol(handle: number, symbol: vst.SymbolInformation, token: monaco.CancellationToken): Thenable<vst.SymbolInformation | undefined>;
    $registerDocumentLinkProvider(handle: number, pluginInfo: PluginInfo, selector: SerializedDocumentFilter[]): void;
    protected createLinkProvider(handle: number): monaco.languages.LinkProvider;
    protected provideLinks(handle: number, model: monaco.editor.ITextModel, token: monaco.CancellationToken): Promise<monaco.languages.ProviderResult<monaco.languages.ILinksList>>;
    protected resolveLink(handle: number, link: monaco.languages.ILink, token: monaco.CancellationToken): Promise<monaco.languages.ProviderResult<monaco.languages.ILink>>;
    protected toMonacoLink(link: DocumentLink): monaco.languages.ILink;
    $registerCodeLensSupport(handle: number, pluginInfo: PluginInfo, selector: SerializedDocumentFilter[], eventHandle: number): void;
    protected createCodeLensProvider(handle: number): monaco.languages.CodeLensProvider;
    protected provideCodeLenses(handle: number, model: monaco.editor.ITextModel, token: monaco.CancellationToken): Promise<monaco.languages.ProviderResult<monaco.languages.CodeLensList>>;
    protected resolveCodeLens(handle: number, model: monaco.editor.ITextModel, codeLens: monaco.languages.CodeLens, token: monaco.CancellationToken): monaco.languages.ProviderResult<monaco.languages.CodeLens>;
    $emitCodeLensEvent(eventHandle: number, event?: any): void;
    $registerOutlineSupport(handle: number, pluginInfo: PluginInfo, selector: SerializedDocumentFilter[], displayName?: string): void;
    protected createDocumentSymbolProvider(handle: number, displayName?: string): monaco.languages.DocumentSymbolProvider;
    protected provideDocumentSymbols(handle: number, model: monaco.editor.ITextModel, token: monaco.CancellationToken): monaco.languages.ProviderResult<monaco.languages.DocumentSymbol[]>;
    protected createDefinitionProvider(handle: number): monaco.languages.DefinitionProvider;
    protected createDeclarationProvider(handle: number): monaco.languages.DeclarationProvider;
    protected provideDeclaration(handle: number, model: monaco.editor.ITextModel, position: monaco.Position, token: monaco.CancellationToken): monaco.languages.ProviderResult<monaco.languages.Definition>;
    protected provideDefinition(handle: number, model: monaco.editor.ITextModel, position: monaco.Position, token: monaco.CancellationToken): monaco.languages.ProviderResult<monaco.languages.Definition>;
    protected createSignatureHelpProvider(handle: number, metadata: theia.SignatureHelpProviderMetadata): monaco.languages.SignatureHelpProvider;
    protected provideSignatureHelp(handle: number, model: monaco.editor.ITextModel, position: monaco.Position, token: monaco.CancellationToken, context: monaco.languages.SignatureHelpContext): Promise<monaco.languages.ProviderResult<monaco.languages.SignatureHelpResult>>;
    $registerDocumentFormattingSupport(handle: number, pluginInfo: PluginInfo, selector: SerializedDocumentFilter[]): void;
    createDocumentFormattingSupport(handle: number, pluginInfo: PluginInfo): monaco.languages.DocumentFormattingEditProvider;
    protected provideDocumentFormattingEdits(handle: number, model: monaco.editor.ITextModel, options: monaco.languages.FormattingOptions, token: monaco.CancellationToken): monaco.languages.ProviderResult<monaco.languages.TextEdit[]>;
    $registerRangeFormattingSupport(handle: number, pluginInfo: PluginInfo, selector: SerializedDocumentFilter[]): void;
    createRangeFormattingSupport(handle: number, pluginInfo: PluginInfo): monaco.languages.DocumentRangeFormattingEditProvider;
    protected provideDocumentRangeFormattingEdits(handle: number, model: monaco.editor.ITextModel, range: Range, options: monaco.languages.FormattingOptions, token: monaco.CancellationToken): monaco.languages.ProviderResult<monaco.languages.TextEdit[]>;
    $registerOnTypeFormattingProvider(handle: number, pluginInfo: PluginInfo, selector: SerializedDocumentFilter[], autoFormatTriggerCharacters: string[]): void;
    protected createOnTypeFormattingProvider(handle: number, autoFormatTriggerCharacters: string[]): monaco.languages.OnTypeFormattingEditProvider;
    protected provideOnTypeFormattingEdits(handle: number, model: monaco.editor.ITextModel, position: monaco.Position, ch: string, options: monaco.languages.FormattingOptions, token: monaco.CancellationToken): monaco.languages.ProviderResult<monaco.languages.TextEdit[]>;
    $registerDocumentDropEditProvider(handle: number, selector: SerializedDocumentFilter[], metadata?: DocumentDropEditProviderMetadata): void;
    createDocumentDropEditProvider(handle: number, _metadata?: DocumentDropEditProviderMetadata): DocumentOnDropEditProvider;
    protected provideDocumentDropEdits(handle: number, model: ITextModel, position: monaco.IPosition, dataTransfer: VSDataTransfer, token: CancellationToken): Promise<DocumentOnDropEdit | undefined>;
    $registerFoldingRangeProvider(handle: number, pluginInfo: PluginInfo, selector: SerializedDocumentFilter[], eventHandle: number | undefined): void;
    createFoldingRangeProvider(handle: number): monaco.languages.FoldingRangeProvider;
    $emitFoldingRangeEvent(eventHandle: number, event?: unknown): void;
    protected provideFoldingRanges(handle: number, model: monaco.editor.ITextModel, context: monaco.languages.FoldingContext, token: monaco.CancellationToken): monaco.languages.ProviderResult<monaco.languages.FoldingRange[]>;
    $registerSelectionRangeProvider(handle: number, pluginInfo: PluginInfo, selector: SerializedDocumentFilter[]): void;
    protected createSelectionRangeProvider(handle: number): monaco.languages.SelectionRangeProvider;
    protected provideSelectionRanges(handle: number, model: monaco.editor.ITextModel, positions: monaco.Position[], token: monaco.CancellationToken): monaco.languages.ProviderResult<monaco.languages.SelectionRange[][]>;
    $registerDocumentColorProvider(handle: number, pluginInfo: PluginInfo, selector: SerializedDocumentFilter[]): void;
    createColorProvider(handle: number): monaco.languages.DocumentColorProvider;
    protected provideDocumentColors(handle: number, model: monaco.editor.ITextModel, token: monaco.CancellationToken): monaco.languages.ProviderResult<monaco.languages.IColorInformation[]>;
    protected provideColorPresentations(handle: number, model: monaco.editor.ITextModel, colorInfo: monaco.languages.IColorInformation, token: monaco.CancellationToken): monaco.languages.ProviderResult<monaco.languages.IColorPresentation[]>;
    $registerInlayHintsProvider(handle: number, pluginInfo: PluginInfo, selector: SerializedDocumentFilter[], displayName?: string, eventHandle?: number): void;
    createInlayHintsProvider(handle: number): monaco.languages.InlayHintsProvider;
    $emitInlayHintsEvent(eventHandle: number, event?: any): void;
    $registerInlineCompletionsSupport(handle: number, selector: SerializedDocumentFilter[]): void;
    $registerQuickFixProvider(handle: number, pluginInfo: PluginInfo, selector: SerializedDocumentFilter[], providedCodeActionKinds?: string[], documentation?: CodeActionProviderDocumentation): void;
    protected provideCodeActions(handle: number, model: monaco.editor.ITextModel, rangeOrSelection: Range, context: monaco.languages.CodeActionContext, token: monaco.CancellationToken): Promise<monaco.languages.CodeActionList | undefined>;
    protected toModelCodeActionContext(context: monaco.languages.CodeActionContext): CodeActionContext;
    toCodeActionTriggerKind(type: monaco.languages.CodeActionTriggerType): CodeActionTriggerKind;
    protected resolveCodeAction(handle: number, codeAction: monaco.languages.CodeAction, token: monaco.CancellationToken): Promise<monaco.languages.CodeAction>;
    $registerRenameProvider(handle: number, pluginInfo: PluginInfo, selector: SerializedDocumentFilter[], supportsResolveLocation: boolean): void;
    protected createRenameProvider(handle: number, supportsResolveLocation: boolean): monaco.languages.RenameProvider;
    protected provideRenameEdits(handle: number, model: monaco.editor.ITextModel, position: monaco.Position, newName: string, token: monaco.CancellationToken): monaco.languages.ProviderResult<monaco.languages.WorkspaceEdit & monaco.languages.Rejection>;
    $registerCallHierarchyProvider(handle: number, selector: SerializedDocumentFilter[]): void;
    protected createCallHierarchyService(handle: number, language: LanguageSelector): CallHierarchyService;
    protected resolveRenameLocation(handle: number, model: monaco.editor.ITextModel, position: monaco.Position, token: monaco.CancellationToken): monaco.languages.ProviderResult<monaco.languages.RenameLocation>;
    $registerTypeHierarchyProvider(handle: number, selector: SerializedDocumentFilter[]): void;
    protected createTypeHierarchyService(handle: number, language: LanguageSelector): TypeHierarchyService;
    $registerDocumentSemanticTokensProvider(handle: number, pluginInfo: PluginInfo, selector: SerializedDocumentFilter[], legend: theia.SemanticTokensLegend, eventHandle: number | undefined): void;
    protected createDocumentSemanticTokensProvider(handle: number, legend: theia.SemanticTokensLegend, event?: Event<void>): monaco.languages.DocumentSemanticTokensProvider;
    $emitDocumentSemanticTokensEvent(eventHandle: number): void;
    $registerDocumentRangeSemanticTokensProvider(handle: number, pluginInfo: PluginInfo, selector: SerializedDocumentFilter[], legend: theia.SemanticTokensLegend): void;
    protected createDocumentRangeSemanticTokensProvider(handle: number, legend: theia.SemanticTokensLegend): monaco.languages.DocumentRangeSemanticTokensProvider;
    protected toLanguageSelector(filters: SerializedDocumentFilter[]): MonacoLanguageSelector.LanguageSelector & LanguageSelector;
    $registerLinkedEditingRangeProvider(handle: number, selector: SerializedDocumentFilter[]): void;
    protected createLinkedEditingRangeProvider(handle: number): monaco.languages.LinkedEditingRangeProvider;
    $setLanguageStatus(handle: number, status: LanguageStatusDTO): void;
    $removeLanguageStatus(handle: number): void;
}
export declare function toMonacoWorkspaceEdit(data: WorkspaceEditDto | undefined): monaco.languages.WorkspaceEdit;
//# sourceMappingURL=languages-main.d.ts.map