import * as theia from '@theia/plugin';
import { interfaces } from '@theia/core/shared/inversify';
import { WorkspaceExt, WorkspaceMain, WorkspaceFolderPickOptionsMain } from '../../common/plugin-api-rpc';
import { RPCProtocol } from '../../common/rpc-protocol';
import { UriComponents } from '../../common/uri-components';
import URI from '@theia/core/lib/common/uri';
import { CanonicalUriService } from '@theia/workspace/lib/browser';
import { Resource } from '@theia/core/lib/common/resource';
import { Disposable, DisposableCollection } from '@theia/core/lib/common/disposable';
import { Event, ResourceResolver } from '@theia/core';
import { FileStat } from '@theia/filesystem/lib/common/files';
export declare class WorkspaceMainImpl implements WorkspaceMain, Disposable {
    private readonly proxy;
    private storageProxy;
    private monacoQuickInputService;
    private fileSearchService;
    private searchInWorkspaceService;
    private roots;
    private resourceResolver;
    private pluginServer;
    private requestService;
    private workspaceService;
    protected readonly canonicalUriService: CanonicalUriService;
    private workspaceTrustService;
    private fsPreferences;
    protected readonly toDispose: DisposableCollection;
    protected workspaceSearch: Set<number>;
    protected readonly canonicalUriProviders: Map<string, Disposable>;
    constructor(rpc: RPCProtocol, container: interfaces.Container);
    dispose(): void;
    $resolveProxy(url: string): Promise<string | undefined>;
    protected processWorkspaceFoldersChanged(roots: string[]): Promise<void>;
    private isAnyRootChanged;
    $getWorkspace(): Promise<FileStat | undefined>;
    $pickWorkspaceFolder(options: WorkspaceFolderPickOptionsMain): Promise<theia.WorkspaceFolder | undefined>;
    $startFileSearch(includePattern: string, includeFolderUri: string | undefined, excludePatternOrDisregardExcludes?: string | false, maxResults?: number): Promise<UriComponents[]>;
    $findTextInFiles(query: theia.TextSearchQuery, options: theia.FindTextInFilesOptions, searchRequestId: number, token?: theia.CancellationToken): Promise<theia.TextSearchComplete>;
    $registerTextDocumentContentProvider(scheme: string): Promise<void>;
    $unregisterTextDocumentContentProvider(scheme: string): void;
    $onTextDocumentContentChange(uri: string, content: string): void;
    $updateWorkspaceFolders(start: number, deleteCount?: number, ...rootsToAdd: string[]): Promise<void>;
    $requestWorkspaceTrust(_options?: theia.WorkspaceTrustRequestOptions): Promise<boolean | undefined>;
    $registerCanonicalUriProvider(scheme: string): Promise<void | undefined>;
    $unregisterCanonicalUriProvider(scheme: string): void;
    $getCanonicalUri(uri: string, targetScheme: string, token: theia.CancellationToken): Promise<string | undefined>;
}
/**
 * Text content provider for resources with custom scheme.
 */
export interface TextContentResourceProvider {
    /**
     * Provides resource for given URI
     */
    provideResource(uri: URI): Resource;
}
export declare class TextContentResourceResolver implements ResourceResolver {
    private providers;
    private resources;
    resolve(uri: URI): Promise<Resource>;
    registerContentProvider(scheme: string, proxy: WorkspaceExt): void;
    unregisterContentProvider(scheme: string): void;
    onContentChange(uri: string, content: string): void;
}
export declare class TextContentResource implements Resource {
    uri: URI;
    private proxy;
    protected disposable: Disposable;
    private onDidChangeContentsEmitter;
    readonly onDidChangeContents: Event<void>;
    cache: string | undefined;
    constructor(uri: URI, proxy: WorkspaceExt, disposable: Disposable);
    readContents(options?: {
        encoding?: string;
    }): Promise<string>;
    dispose(): void;
    setContent(content: string): void;
}
//# sourceMappingURL=workspace-main.d.ts.map