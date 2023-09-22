import { interfaces } from '@theia/core/shared/inversify';
import { CustomEditorsMain, CustomEditorsExt, CustomTextEditorCapabilities } from '../../../common/plugin-api-rpc';
import { RPCProtocol } from '../../../common/rpc-protocol';
import { HostedPluginSupport } from '../../../hosted/browser/hosted-plugin';
import { PluginCustomEditorRegistry } from './plugin-custom-editor-registry';
import { UriComponents } from '../../../common/uri-components';
import { URI } from '@theia/core/shared/vscode-uri';
import TheiaURI from '@theia/core/lib/common/uri';
import { Disposable } from '@theia/core/lib/common/disposable';
import { Reference } from '@theia/core/lib/common/reference';
import { CancellationToken } from '@theia/core/lib/common/cancellation';
import { MonacoEditorModel } from '@theia/monaco/lib/browser/monaco-editor-model';
import { EditorModelService } from '../text-editor-model-service';
import { CustomEditorService } from './custom-editor-service';
import { FileService } from '@theia/filesystem/lib/browser/file-service';
import { UndoRedoService } from '@theia/editor/lib/browser/undo-redo-service';
import { WebviewsMainImpl } from '../webviews-main';
import { WidgetManager } from '@theia/core/lib/browser/widget-manager';
import { ApplicationShell, DefaultUriLabelProviderContribution, Saveable, SaveOptions, WidgetOpenerOptions } from '@theia/core/lib/browser';
import { WebviewOptions, WebviewPanelOptions } from '@theia/plugin';
import { EditorPreferences } from '@theia/editor/lib/browser';
declare const enum CustomEditorModelType {
    Custom = 0,
    Text = 1
}
export declare class CustomEditorsMainImpl implements CustomEditorsMain, Disposable {
    readonly webviewsMain: WebviewsMainImpl;
    protected readonly pluginService: HostedPluginSupport;
    protected readonly shell: ApplicationShell;
    protected readonly textModelService: EditorModelService;
    protected readonly fileService: FileService;
    protected readonly customEditorService: CustomEditorService;
    protected readonly undoRedoService: UndoRedoService;
    protected readonly customEditorRegistry: PluginCustomEditorRegistry;
    protected readonly labelProvider: DefaultUriLabelProviderContribution;
    protected readonly widgetManager: WidgetManager;
    protected readonly editorPreferences: EditorPreferences;
    private readonly proxy;
    private readonly editorProviders;
    constructor(rpc: RPCProtocol, container: interfaces.Container, webviewsMain: WebviewsMainImpl);
    dispose(): void;
    $registerTextEditorProvider(viewType: string, options: WebviewPanelOptions, capabilities: CustomTextEditorCapabilities): void;
    $registerCustomEditorProvider(viewType: string, options: WebviewPanelOptions, supportsMultipleEditorsPerDocument: boolean): void;
    protected registerEditorProvider(modelType: CustomEditorModelType, viewType: string, options: WebviewPanelOptions, capabilities: CustomTextEditorCapabilities, supportsMultipleEditorsPerDocument: boolean): Promise<void>;
    $unregisterEditorProvider(viewType: string): void;
    protected getOrCreateCustomEditorModel(modelType: CustomEditorModelType, resource: TheiaURI, viewType: string, cancellationToken: CancellationToken): Promise<Reference<CustomEditorModel>>;
    protected getCustomEditorModel(resourceComponents: UriComponents, viewType: string): Promise<MainCustomEditorModel>;
    $onDidEdit(resourceComponents: UriComponents, viewType: string, editId: number, label: string | undefined): Promise<void>;
    $onContentChange(resourceComponents: UriComponents, viewType: string): Promise<void>;
    $createCustomEditorPanel(panelId: string, title: string, widgetOpenerOptions: WidgetOpenerOptions | undefined, options: WebviewPanelOptions & WebviewOptions): Promise<void>;
}
export interface CustomEditorModel extends Saveable, Disposable {
    readonly viewType: string;
    readonly resource: URI;
    readonly readonly: boolean;
    readonly dirty: boolean;
    revert(options?: Saveable.RevertOptions): Promise<void>;
    saveCustomEditor(options?: SaveOptions): Promise<void>;
    saveCustomEditorAs(resource: TheiaURI, targetResource: TheiaURI, options?: SaveOptions): Promise<void>;
}
export declare class MainCustomEditorModel implements CustomEditorModel {
    private proxy;
    readonly viewType: string;
    private readonly editorResource;
    private readonly editable;
    private readonly undoRedoService;
    private readonly fileService;
    private readonly editorPreferences;
    private currentEditIndex;
    private savePoint;
    private isDirtyFromContentChange;
    private ongoingSave?;
    private readonly edits;
    private readonly toDispose;
    private readonly onDirtyChangedEmitter;
    readonly onDirtyChanged: import("@theia/core").Event<void>;
    autoSave: 'off' | 'afterDelay' | 'onFocusChange' | 'onWindowChange';
    autoSaveDelay: number;
    static create(proxy: CustomEditorsExt, viewType: string, resource: TheiaURI, undoRedoService: UndoRedoService, fileService: FileService, editorPreferences: EditorPreferences, cancellation: CancellationToken): Promise<MainCustomEditorModel>;
    constructor(proxy: CustomEditorsExt, viewType: string, editorResource: TheiaURI, editable: boolean, undoRedoService: UndoRedoService, fileService: FileService, editorPreferences: EditorPreferences);
    get resource(): URI;
    get dirty(): boolean;
    get readonly(): boolean;
    setProxy(proxy: CustomEditorsExt): void;
    dispose(): void;
    changeContent(): void;
    pushEdit(editId: number, label: string | undefined): void;
    revert(options?: Saveable.RevertOptions): Promise<void>;
    save(options?: SaveOptions): Promise<void>;
    saveCustomEditor(options?: SaveOptions): Promise<void>;
    saveCustomEditorAs(resource: TheiaURI, targetResource: TheiaURI, options?: SaveOptions): Promise<void>;
    private undo;
    private redo;
    private spliceEdits;
    private change;
}
export declare class CustomTextEditorModel implements CustomEditorModel {
    readonly viewType: string;
    readonly editorResource: TheiaURI;
    private readonly model;
    private readonly fileService;
    private readonly toDispose;
    private readonly onDirtyChangedEmitter;
    readonly onDirtyChanged: import("@theia/core").Event<void>;
    static create(viewType: string, resource: TheiaURI, editorModelService: EditorModelService, fileService: FileService): Promise<CustomTextEditorModel>;
    constructor(viewType: string, editorResource: TheiaURI, model: Reference<MonacoEditorModel>, fileService: FileService);
    get autoSave(): 'off' | 'afterDelay' | 'onFocusChange' | 'onWindowChange';
    get autoSaveDelay(): number;
    dispose(): void;
    get resource(): URI;
    get dirty(): boolean;
    get readonly(): boolean;
    get editorTextModel(): MonacoEditorModel;
    revert(options?: Saveable.RevertOptions): Promise<void>;
    save(options?: SaveOptions): Promise<void>;
    saveCustomEditor(options?: SaveOptions): Promise<void>;
    saveCustomEditorAs(resource: TheiaURI, targetResource: TheiaURI, options?: SaveOptions): Promise<void>;
}
export {};
//# sourceMappingURL=custom-editors-main.d.ts.map