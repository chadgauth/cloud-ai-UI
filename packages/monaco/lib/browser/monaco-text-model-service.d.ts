import URI from '@theia/core/lib/common/uri';
import { ResourceProvider, ReferenceCollection, Event, MaybePromise, Resource, ContributionProvider } from '@theia/core';
import { EditorPreferences, EditorPreferenceChange } from '@theia/editor/lib/browser';
import { MonacoEditorModel } from './monaco-editor-model';
import { IDisposable, IReference } from '@theia/monaco-editor-core/esm/vs/base/common/lifecycle';
import { MonacoToProtocolConverter } from './monaco-to-protocol-converter';
import { ProtocolToMonacoConverter } from './protocol-to-monaco-converter';
import { ILogger } from '@theia/core/lib/common/logger';
import * as monaco from '@theia/monaco-editor-core';
import { ITextModelService, ITextModelContentProvider } from '@theia/monaco-editor-core/esm/vs/editor/common/services/resolverService';
import { ITextModelUpdateOptions } from '@theia/monaco-editor-core/esm/vs/editor/common/model';
import { FileService } from '@theia/filesystem/lib/browser/file-service';
export declare const MonacoEditorModelFactory: unique symbol;
export interface MonacoEditorModelFactory {
    readonly scheme: string;
    createModel(resource: Resource): MaybePromise<MonacoEditorModel>;
}
export declare class MonacoTextModelService implements ITextModelService {
    readonly _serviceBrand: undefined;
    /**
     * This component does some asynchronous work before being fully initialized.
     *
     * @deprecated since 1.25.0. Is instantly resolved.
     */
    readonly ready: Promise<void>;
    protected readonly _models: ReferenceCollection<string, MonacoEditorModel>;
    protected readonly resourceProvider: ResourceProvider;
    protected readonly editorPreferences: EditorPreferences;
    protected readonly m2p: MonacoToProtocolConverter;
    protected readonly p2m: ProtocolToMonacoConverter;
    protected readonly factories: ContributionProvider<MonacoEditorModelFactory>;
    protected readonly logger: ILogger;
    protected readonly fileService: FileService;
    protected init(): void;
    get models(): MonacoEditorModel[];
    get(uri: string): MonacoEditorModel | undefined;
    get onDidCreate(): Event<MonacoEditorModel>;
    createModelReference(raw: monaco.Uri | URI): Promise<IReference<MonacoEditorModel>>;
    protected loadModel(uri: URI): Promise<MonacoEditorModel>;
    protected createModel(resource: Resource): MaybePromise<MonacoEditorModel>;
    protected readonly modelOptions: {
        [name: string]: (keyof ITextModelUpdateOptions | undefined);
    };
    protected toModelOption(editorPreference: EditorPreferenceChange['preferenceName']): keyof ITextModelUpdateOptions | undefined;
    protected updateModel(model: MonacoEditorModel, change?: EditorPreferenceChange): void;
    /** @deprecated pass MonacoEditorModel instead  */
    protected getModelOptions(uri: string): ITextModelUpdateOptions;
    protected getModelOptions(model: MonacoEditorModel): ITextModelUpdateOptions;
    registerTextModelContentProvider(scheme: string, provider: ITextModelContentProvider): IDisposable;
    canHandleResource(resource: monaco.Uri): boolean;
}
//# sourceMappingURL=monaco-text-model-service.d.ts.map