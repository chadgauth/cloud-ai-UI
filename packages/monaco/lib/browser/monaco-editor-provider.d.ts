import URI from '@theia/core/lib/common/uri';
import { EditorPreferenceChange, EditorPreferences, TextEditor, DiffNavigator } from '@theia/editor/lib/browser';
import { DisposableCollection } from '@theia/core/lib/common';
import { MonacoCommandServiceFactory } from './monaco-command-service';
import { MonacoContextMenuService } from './monaco-context-menu';
import { MonacoDiffEditor } from './monaco-diff-editor';
import { MonacoDiffNavigatorFactory } from './monaco-diff-navigator-factory';
import { EditorServiceOverrides, MonacoEditor, MonacoEditorServices } from './monaco-editor';
import { MonacoEditorModel, WillSaveMonacoModelEvent } from './monaco-editor-model';
import { MonacoEditorService } from './monaco-editor-service';
import { MonacoTextModelService } from './monaco-text-model-service';
import { MonacoWorkspace } from './monaco-workspace';
import { MonacoBulkEditService } from './monaco-bulk-edit-service';
import { ApplicationServer } from '@theia/core/lib/common/application-protocol';
import { ContributionProvider } from '@theia/core';
import { KeybindingRegistry, OpenerService } from '@theia/core/lib/browser';
import { MonacoToProtocolConverter } from './monaco-to-protocol-converter';
import { ProtocolToMonacoConverter } from './protocol-to-monaco-converter';
import { FileSystemPreferences } from '@theia/filesystem/lib/browser';
import { MonacoQuickInputImplementation } from './monaco-quick-input-service';
import { ContextKeyService } from '@theia/monaco-editor-core/esm/vs/platform/contextkey/browser/contextKeyService';
import * as monaco from '@theia/monaco-editor-core';
import { OpenExternalOptions, OpenInternalOptions } from '@theia/monaco-editor-core/esm/vs/platform/opener/common/opener';
export declare const MonacoEditorFactory: unique symbol;
export interface MonacoEditorFactory {
    readonly scheme: string;
    create(model: MonacoEditorModel, defaultOptions: MonacoEditor.IOptions, defaultOverrides: EditorServiceOverrides): MonacoEditor;
}
export declare class MonacoEditorProvider {
    protected readonly codeEditorService: MonacoEditorService;
    protected readonly textModelService: MonacoTextModelService;
    protected readonly contextMenuService: MonacoContextMenuService;
    protected readonly m2p: MonacoToProtocolConverter;
    protected readonly p2m: ProtocolToMonacoConverter;
    protected readonly workspace: MonacoWorkspace;
    protected readonly commandServiceFactory: MonacoCommandServiceFactory;
    protected readonly editorPreferences: EditorPreferences;
    protected readonly diffNavigatorFactory: MonacoDiffNavigatorFactory;
    /** @deprecated since 1.6.0 */
    protected readonly applicationServer: ApplicationServer;
    protected readonly contextKeyService: ContextKeyService;
    protected readonly factories: ContributionProvider<MonacoEditorFactory>;
    protected readonly bulkEditService: MonacoBulkEditService;
    protected readonly services: MonacoEditorServices;
    protected readonly keybindingRegistry: KeybindingRegistry;
    protected readonly openerService: OpenerService;
    protected readonly filePreferences: FileSystemPreferences;
    protected readonly quickInputService: MonacoQuickInputImplementation;
    protected _current: MonacoEditor | undefined;
    /**
     * Returns the last focused MonacoEditor.
     * It takes into account inline editors as well.
     * If you are interested only in standalone editors then use `MonacoEditor.getCurrent(EditorManager)`
     */
    get current(): MonacoEditor | undefined;
    constructor(codeEditorService: MonacoEditorService, textModelService: MonacoTextModelService, contextMenuService: MonacoContextMenuService, m2p: MonacoToProtocolConverter, p2m: ProtocolToMonacoConverter, workspace: MonacoWorkspace, commandServiceFactory: MonacoCommandServiceFactory, editorPreferences: EditorPreferences, diffNavigatorFactory: MonacoDiffNavigatorFactory, 
    /** @deprecated since 1.6.0 */
    applicationServer: ApplicationServer, contextKeyService: ContextKeyService);
    protected getModel(uri: URI, toDispose: DisposableCollection): Promise<MonacoEditorModel>;
    get(uri: URI): Promise<MonacoEditor>;
    protected doCreateEditor(uri: URI, factory: (override: EditorServiceOverrides, toDispose: DisposableCollection) => Promise<MonacoEditor>): Promise<MonacoEditor>;
    /**
     * Intercept internal Monaco open calls and delegate to OpenerService.
     */
    protected interceptOpen(monacoUri: monaco.Uri | string, monacoOptions?: OpenInternalOptions | OpenExternalOptions): Promise<boolean>;
    protected injectKeybindingResolver(editor: MonacoEditor): void;
    protected createEditor(uri: URI, override: EditorServiceOverrides, toDispose: DisposableCollection): Promise<MonacoEditor>;
    protected get preferencePrefixes(): string[];
    createMonacoEditor(uri: URI, override: EditorServiceOverrides, toDispose: DisposableCollection): Promise<MonacoEditor>;
    protected createMonacoEditorOptions(model: MonacoEditorModel): MonacoEditor.IOptions;
    protected updateMonacoEditorOptions(editor: MonacoEditor, event?: EditorPreferenceChange): void;
    protected shouldFormat(editor: MonacoEditor, event: WillSaveMonacoModelEvent): boolean;
    protected formatOnSave(editor: MonacoEditor, event: WillSaveMonacoModelEvent): Promise<monaco.editor.IIdentifiedSingleEditOperation[]>;
    protected get diffPreferencePrefixes(): string[];
    protected createMonacoDiffEditor(uri: URI, override: EditorServiceOverrides, toDispose: DisposableCollection): Promise<MonacoDiffEditor>;
    protected createMonacoDiffEditorOptions(original: MonacoEditorModel, modified: MonacoEditorModel): MonacoDiffEditor.IOptions;
    protected updateMonacoDiffEditorOptions(editor: MonacoDiffEditor, event?: EditorPreferenceChange, resourceUri?: string): void;
    /** @deprecated always pass a language as an overrideIdentifier */
    protected createOptions(prefixes: string[], uri: string): Record<string, any>;
    protected createOptions(prefixes: string[], uri: string, overrideIdentifier: string): Record<string, any>;
    protected setOption(preferenceName: string, value: any, prefixes: string[], options?: Record<string, any>): {
        [name: string]: any;
    };
    protected toOptionName(preferenceName: string, prefixes: string[]): string;
    protected doSetOption(obj: Record<string, any>, value: any, names: string[]): void;
    getDiffNavigator(editor: TextEditor): DiffNavigator;
    createInline(uri: URI, node: HTMLElement, options?: MonacoEditor.IOptions): Promise<MonacoEditor>;
    static inlineOptions: monaco.editor.IEditorConstructionOptions;
}
//# sourceMappingURL=monaco-editor-provider.d.ts.map