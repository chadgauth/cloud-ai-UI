import { Disposable, DisposableCollection, Emitter, URI } from '@theia/core';
import { BinaryBuffer } from '@theia/core/lib/common/buffer';
import { NotebookData, NotebookExtensionDescription, TransientOptions } from '../../common';
import { NotebookModel, NotebookModelProps } from '../view-model/notebook-model';
import { FileService } from '@theia/filesystem/lib/browser/file-service';
import { MonacoTextModelService } from '@theia/monaco/lib/browser/monaco-text-model-service';
import { NotebookCellModel, NotebookCellModelProps } from '../view-model/notebook-cell-model';
import { Deferred } from '@theia/core/lib/common/promise-util';
export declare const NotebookProvider: unique symbol;
export interface SimpleNotebookProviderInfo {
    readonly notebookType: string;
    readonly serializer: NotebookSerializer;
    readonly extensionData: NotebookExtensionDescription;
}
export interface NotebookSerializer {
    options: TransientOptions;
    dataToNotebook(data: BinaryBuffer): Promise<NotebookData>;
    notebookToData(data: NotebookData): Promise<BinaryBuffer>;
}
export declare class NotebookService implements Disposable {
    protected fileService: FileService;
    protected modelService: MonacoTextModelService;
    protected notebookModelFactory: (props: NotebookModelProps) => NotebookModel;
    protected notebookCellModelFactory: (props: NotebookCellModelProps) => NotebookCellModel;
    protected notebookSerializerEmitter: Emitter<string>;
    readonly onNotebookSerializer: import("@theia/core").Event<string>;
    protected readonly disposables: DisposableCollection;
    protected readonly notebookProviders: Map<string, SimpleNotebookProviderInfo>;
    protected readonly notebookModels: Map<string, NotebookModel>;
    protected readonly didAddViewTypeEmitter: Emitter<string>;
    readonly onDidAddViewType: import("@theia/core").Event<string>;
    protected readonly didRemoveViewTypeEmitter: Emitter<string>;
    readonly onDidRemoveViewType: import("@theia/core").Event<string>;
    protected readonly willOpenNotebookTypeEmitter: Emitter<string>;
    readonly onWillOpenNotebook: import("@theia/core").Event<string>;
    protected readonly willAddNotebookDocumentEmitter: Emitter<URI>;
    readonly onWillAddNotebookDocument: import("@theia/core").Event<URI>;
    protected readonly didAddNotebookDocumentEmitter: Emitter<NotebookModel>;
    readonly onDidAddNotebookDocument: import("@theia/core").Event<NotebookModel>;
    protected readonly willRemoveNotebookDocumentEmitter: Emitter<NotebookModel>;
    readonly onWillRemoveNotebookDocument: import("@theia/core").Event<NotebookModel>;
    protected readonly didRemoveNotebookDocumentEmitter: Emitter<NotebookModel>;
    readonly onDidRemoveNotebookDocument: import("@theia/core").Event<NotebookModel>;
    dispose(): void;
    protected readonly ready: Deferred<void>;
    /**
     * Marks the notebook service as ready. From this point on, the service will start dispatching the `onNotebookSerializer` event.
     */
    markReady(): void;
    registerNotebookSerializer(notebookType: string, extensionData: NotebookExtensionDescription, serializer: NotebookSerializer): Disposable;
    createNotebookModel(data: NotebookData, viewType: string, uri: URI): Promise<NotebookModel>;
    getNotebookDataProvider(viewType: string): Promise<SimpleNotebookProviderInfo>;
    /**
     * When the application starts up, notebook providers from plugins are not registered yet.
     * It takes a few seconds for the plugin host to start so that notebook data providers can be registered.
     * This methods waits until the notebook provider is registered.
     */
    protected waitForNotebookProvider(type: string): Promise<SimpleNotebookProviderInfo | undefined>;
    getNotebookEditorModel(uri: URI): NotebookModel | undefined;
    getNotebookModels(): Iterable<NotebookModel>;
    willOpenNotebook(type: string): Promise<void>;
    listNotebookDocuments(): NotebookModel[];
}
//# sourceMappingURL=notebook-service.d.ts.map