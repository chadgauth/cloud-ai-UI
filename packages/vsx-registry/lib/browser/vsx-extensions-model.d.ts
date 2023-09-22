import { Emitter, Event } from '@theia/core/lib/common/event';
import { CancellationToken, CancellationTokenSource } from '@theia/core/lib/common/cancellation';
import { HostedPluginSupport } from '@theia/plugin-ext/lib/hosted/browser/hosted-plugin';
import { VSXExtension, VSXExtensionFactory } from './vsx-extension';
import { ProgressService } from '@theia/core/lib/common/progress-service';
import { VSXExtensionsSearchModel } from './vsx-extensions-search-model';
import { PreferenceInspectionScope, PreferenceService } from '@theia/core/lib/browser';
import { WorkspaceService } from '@theia/workspace/lib/browser';
import { RecommendedExtensions } from './recommended-extensions/recommended-extensions-preference-contribution';
import URI from '@theia/core/lib/common/uri';
import { VSXSearchOptions } from '@theia/ovsx-client/lib/ovsx-types';
import { OVSXClientProvider } from '../common/ovsx-client-provider';
import { RequestService } from '@theia/core/shared/@theia/request';
import { OVSXApiFilter } from '@theia/ovsx-client';
export declare class VSXExtensionsModel {
    protected initialized: Promise<void>;
    /**
     * Single source for all extensions
     */
    protected readonly extensions: Map<string, VSXExtension>;
    protected readonly onDidChangeEmitter: Emitter<void>;
    protected _installed: Set<string>;
    protected _recommended: Set<string>;
    protected _searchResult: Set<string>;
    protected _searchError?: string;
    protected searchCancellationTokenSource: CancellationTokenSource;
    protected updateSearchResult: () => Promise<void>;
    protected clientProvider: OVSXClientProvider;
    protected readonly pluginSupport: HostedPluginSupport;
    protected readonly extensionFactory: VSXExtensionFactory;
    protected readonly progressService: ProgressService;
    protected readonly preferences: PreferenceService;
    protected readonly workspaceService: WorkspaceService;
    readonly search: VSXExtensionsSearchModel;
    protected request: RequestService;
    protected vsxApiFilter: OVSXApiFilter;
    protected init(): void;
    protected doInit(): Promise<void>;
    get onDidChange(): Event<void>;
    get installed(): IterableIterator<string>;
    get searchError(): string | undefined;
    get searchResult(): IterableIterator<string>;
    get recommended(): IterableIterator<string>;
    isInstalled(id: string): boolean;
    getExtension(id: string): VSXExtension | undefined;
    resolve(id: string): Promise<VSXExtension>;
    protected initInstalled(): Promise<void>;
    protected initSearchResult(): Promise<void>;
    protected initRecommended(): Promise<void>;
    protected resetSearchCancellationTokenSource(): CancellationTokenSource;
    protected setExtension(id: string): VSXExtension;
    protected doChange<T>(task: () => Promise<T>): Promise<T>;
    protected doChange<T>(task: () => Promise<T>, token: CancellationToken): Promise<T | undefined>;
    protected doUpdateSearchResult(param: VSXSearchOptions, token: CancellationToken): Promise<void>;
    protected updateInstalled(): Promise<void>;
    protected updateRecommended(): Promise<Array<VSXExtension | undefined>>;
    protected getRecommendationsForScope(scope: PreferenceInspectionScope, root?: URI): Required<RecommendedExtensions>;
    protected compileReadme(readmeMarkdown: string): string;
    protected refresh(id: string, version?: string): Promise<VSXExtension | undefined>;
    /**
     * Determines if the given extension should be refreshed.
     * @param extension the extension to refresh.
     */
    protected shouldRefresh(extension?: VSXExtension): boolean;
    protected onDidFailRefresh(id: string, error: unknown): VSXExtension | undefined;
    /**
     * Compare two extensions based on their display name, and publisher if applicable.
     * @param a the first extension id for comparison.
     * @param b the second extension id for comparison.
     */
    protected compareExtensions(a: string, b: string): number;
}
//# sourceMappingURL=vsx-extensions-model.d.ts.map