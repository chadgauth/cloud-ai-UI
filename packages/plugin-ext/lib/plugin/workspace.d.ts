import * as theia from '@theia/plugin';
import { Event } from '@theia/core/lib/common/event';
import { CancellationToken } from '@theia/core/lib/common/cancellation';
import { WorkspaceExt } from '../common/plugin-api-rpc';
import { RPCProtocol } from '../common/rpc-protocol';
import { WorkspaceRootsChangeEvent, SearchInWorkspaceResult } from '../common/plugin-api-rpc-model';
import { EditorsAndDocumentsExtImpl } from './editors-and-documents';
import { URI } from './types-impl';
import { MessageRegistryExt } from './message-registry';
import { FileStat } from '@theia/filesystem/lib/common/files';
export declare class WorkspaceExtImpl implements WorkspaceExt {
    private editorsAndDocuments;
    private messageService;
    private proxy;
    private workspaceFoldersChangedEmitter;
    readonly onDidChangeWorkspaceFolders: Event<theia.WorkspaceFoldersChangeEvent>;
    private folders;
    private workspaceFileUri;
    private documentContentProviders;
    private searchInWorkspaceEmitter;
    protected workspaceSearchSequence: number;
    private _trusted?;
    private didGrantWorkspaceTrustEmitter;
    readonly onDidGrantWorkspaceTrust: Event<void>;
    private canonicalUriProviders;
    constructor(rpc: RPCProtocol, editorsAndDocuments: EditorsAndDocumentsExtImpl, messageService: MessageRegistryExt);
    get rootPath(): string | undefined;
    get workspaceFolders(): theia.WorkspaceFolder[] | undefined;
    get workspaceFile(): theia.Uri | undefined;
    get name(): string | undefined;
    resolveProxy(url: string): Promise<string | undefined>;
    $onWorkspaceFoldersChanged(event: WorkspaceRootsChangeEvent): void;
    $onWorkspaceLocationChanged(stat: FileStat | undefined): void;
    $onTextSearchResult(searchRequestId: number, done: boolean, result?: SearchInWorkspaceResult): void;
    private deltaFolders;
    private foldersDiff;
    private toWorkspaceFolder;
    pickWorkspaceFolder(options?: theia.WorkspaceFolderPickOptions): PromiseLike<theia.WorkspaceFolder | undefined>;
    findFiles(include: theia.GlobPattern, exclude?: theia.GlobPattern | null, maxResults?: number, token?: CancellationToken): PromiseLike<URI[]>;
    findTextInFiles(query: theia.TextSearchQuery, optionsOrCallback: theia.FindTextInFilesOptions | ((result: theia.TextSearchResult) => void), callbackOrToken?: CancellationToken | ((result: theia.TextSearchResult) => void), token?: CancellationToken): Promise<theia.TextSearchComplete>;
    registerTextDocumentContentProvider(scheme: string, provider: theia.TextDocumentContentProvider): theia.Disposable;
    $provideTextDocumentContent(documentURI: string): Promise<string | undefined | null>;
    getWorkspaceFolder(uri: theia.Uri, resolveParent?: boolean): theia.WorkspaceFolder | undefined;
    private hasFolder;
    getRelativePath(pathOrUri: string | theia.Uri, includeWorkspace?: boolean): string | undefined;
    updateWorkspaceFolders(start: number, deleteCount: number, ...workspaceFoldersToAdd: {
        uri: theia.Uri;
        name?: string;
    }[]): boolean;
    private refreshWorkspaceFile;
    private updateWorkSpace;
    get trusted(): boolean;
    requestWorkspaceTrust(options?: theia.WorkspaceTrustRequestOptions): Promise<boolean | undefined>;
    $onWorkspaceTrustChanged(trust: boolean | undefined): void;
    registerCanonicalUriProvider(scheme: string, provider: theia.CanonicalUriProvider): theia.Disposable;
    $disposeCanonicalUriProvider(scheme: string): void;
    getCanonicalUri(uri: theia.Uri, options: theia.CanonicalUriRequestOptions, token: theia.CancellationToken): Promise<theia.Uri | undefined>;
    $provideCanonicalUri(uri: string, targetScheme: string, token: CancellationToken): Promise<string | undefined>;
    /** @stubbed */
    $registerEditSessionIdentityProvider(scheme: string, provider: theia.EditSessionIdentityProvider): theia.Disposable;
}
//# sourceMappingURL=workspace.d.ts.map