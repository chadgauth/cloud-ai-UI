import { CancellationToken, Event } from '@theia/core';
import { URI as TheiaURI } from '../types-impl';
import * as theia from '@theia/plugin';
import { CommandRegistryExt, NotebookCellStatusBarListDto, NotebookDataDto, NotebookDocumentsAndEditorsDelta, NotebooksExt, Plugin } from '../../common';
import { RPCProtocol } from '../../common/rpc-protocol';
import { UriComponents } from '../../common/uri-components';
import { BinaryBuffer } from '@theia/core/lib/common/buffer';
import { NotebookDocument } from './notebook-document';
import { NotebookEditor } from './notebook-editor';
import { EditorsAndDocumentsExtImpl } from '../editors-and-documents';
import { DocumentsExtImpl } from '../documents';
export declare class NotebooksExtImpl implements NotebooksExt {
    private textDocumentsAndEditors;
    private textDocuments;
    private readonly notebookStatusBarItemProviders;
    private readonly commandsConverter;
    private readonly onDidChangeActiveNotebookEditorEmitter;
    readonly onDidChangeActiveNotebookEditor: Event<theia.NotebookEditor | undefined>;
    private readonly onDidOpenNotebookDocumentEmitter;
    onDidOpenNotebookDocument: Event<theia.NotebookDocument>;
    private readonly onDidCloseNotebookDocumentEmitter;
    onDidCloseNotebookDocument: Event<theia.NotebookDocument>;
    private readonly onDidChangeVisibleNotebookEditorsEmitter;
    onDidChangeVisibleNotebookEditors: Event<theia.NotebookEditor[]>;
    private activeNotebookEditor;
    get activeApiNotebookEditor(): theia.NotebookEditor | undefined;
    private visibleNotebookEditors;
    get visibleApiNotebookEditors(): theia.NotebookEditor[];
    private readonly documents;
    private readonly editors;
    private statusBarRegistry;
    private notebookProxy;
    private notebookDocumentsProxy;
    private notebookEditors;
    constructor(rpc: RPCProtocol, commands: CommandRegistryExt, textDocumentsAndEditors: EditorsAndDocumentsExtImpl, textDocuments: DocumentsExtImpl);
    $provideNotebookCellStatusBarItems(handle: number, uri: UriComponents, index: number, token: CancellationToken): Promise<NotebookCellStatusBarListDto | undefined>;
    $releaseNotebookCellStatusBarItems(cacheId: number): void;
    private currentSerializerHandle;
    private readonly notebookSerializer;
    registerNotebookSerializer(plugin: Plugin, viewType: string, serializer: theia.NotebookSerializer, options?: theia.NotebookDocumentContentOptions): theia.Disposable;
    $dataToNotebook(handle: number, bytes: BinaryBuffer, token: CancellationToken): Promise<NotebookDataDto>;
    $notebookToData(handle: number, data: NotebookDataDto, token: CancellationToken): Promise<BinaryBuffer>;
    registerNotebookCellStatusBarItemProvider(notebookType: string, provider: theia.NotebookCellStatusBarItemProvider): theia.Disposable;
    getEditorById(editorId: string): NotebookEditor;
    getAllApiDocuments(): theia.NotebookDocument[];
    $acceptDocumentsAndEditorsDelta(delta: NotebookDocumentsAndEditorsDelta): Promise<void>;
    getNotebookDocument(uri: TheiaURI, relaxed: true): NotebookDocument | undefined;
    getNotebookDocument(uri: TheiaURI): NotebookDocument;
    private createExtHostEditor;
    createNotebookDocument(options: {
        viewType: string;
        content?: theia.NotebookData;
    }): Promise<TheiaURI>;
    openNotebookDocument(uri: TheiaURI): Promise<theia.NotebookDocument>;
    showNotebookDocument(notebookOrUri: theia.NotebookDocument | TheiaURI, options?: theia.NotebookDocumentShowOptions): Promise<theia.NotebookEditor>;
}
//# sourceMappingURL=notebooks.d.ts.map