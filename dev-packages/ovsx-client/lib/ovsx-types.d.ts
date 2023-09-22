import { MaybePromise } from './types';
export interface ExtensionLike {
    name: string;
    namespace: string;
    version?: string;
}
export declare namespace ExtensionLike {
    function id<T extends ExtensionLike>(extension: T): `${string}.${string}`;
    function idWithVersion<T extends ExtensionLike>(extension: T): `${string}.${string}@${string}`;
    function fromId(id: string): ExtensionLike;
}
export interface OVSXClient {
    /**
     * GET https://openvsx.org/api/-/search
     */
    search(searchOptions?: VSXSearchOptions): Promise<VSXSearchResult>;
    /**
     * GET https://openvsx.org/api/-/query
     *
     * Fetch one or all versions of an extension.
     */
    query(queryOptions?: VSXQueryOptions): Promise<VSXQueryResult>;
}
/** @deprecated since 1.31.0 use {@link VSXSearchOptions} instead */
export declare type VSXSearchParam = VSXSearchOptions;
/**
 * The possible options when performing a search.
 *
 * For available options, and default values consult the `swagger`: https://open-vsx.org/swagger-ui/index.html.
 *
 * Should be aligned with https://github.com/eclipse/openvsx/blob/b5694a712e07d266801394916bac30609e16d77b/server/src/main/java/org/eclipse/openvsx/RegistryAPI.java#L246-L266
 */
export interface VSXSearchOptions {
    /**
     * The query text for searching.
     */
    query?: string;
    /**
     * The extension category.
     */
    category?: string;
    /**
     * The maximum number of entries to return.
     */
    size?: number;
    /**
     * The number of entries to skip (usually a multiple of the page size).
     */
    offset?: number;
    /**
     * The sort order.
     */
    sortOrder?: 'asc' | 'desc';
    /**
     * The sort key.
     */
    sortBy?: 'averageRating' | 'downloadCount' | 'relevance' | 'timestamp';
    /**
     * By default an OpenVSX registry will return the last known version of
     * extensions. Setting this field to `true` will have the registry specify
     * the {@link VSXExtensionRaw.allVersions} field which references all known
     * versions for each returned extension.
     *
     * @default false
     */
    includeAllVersions?: boolean;
}
/**
 * Should be aligned with https://github.com/eclipse/openvsx/blob/e8f64fe145fc05d2de1469735d50a7a90e400bc4/server/src/main/java/org/eclipse/openvsx/json/SearchResultJson.java
 */
export interface VSXSearchResult {
    error?: string;
    offset: number;
    extensions: VSXSearchEntry[];
}
/** @deprecated since 1.31.0 use {@link VSXQueryOptions} instead */
export declare type VSXQueryParam = VSXQueryOptions;
/**
 * The possible options when performing a search.
 *
 * For available options, and default values consult the `swagger`: https://open-vsx.org/swagger-ui/index.html.
 *
 * Should be aligned with https://github.com/eclipse/openvsx/blob/b5694a712e07d266801394916bac30609e16d77b/server/src/main/java/org/eclipse/openvsx/json/QueryParamJson.java#L18-L46
 */
export interface VSXQueryOptions {
    namespaceName?: string;
    extensionName?: string;
    extensionVersion?: string;
    extensionId?: string;
    extensionUuid?: string;
    namespaceUuid?: string;
    includeAllVersions?: boolean;
}
export interface VSXQueryResult {
    extensions: VSXExtensionRaw[];
}
/**
 * This type describes the data as found in {@link VSXSearchEntry.allVersions}.
 *
 * Note that this type only represents one version of a given plugin, despite the name.
 */
export interface VSXAllVersions {
    url: string;
    version: string;
    engines?: {
        [version: string]: string;
    };
}
/**
 * Should be aligned with https://github.com/eclipse/openvsx/blob/master/server/src/main/java/org/eclipse/openvsx/json/SearchEntryJson.java
 */
export interface VSXSearchEntry {
    url: string;
    files: {
        download: string;
        manifest?: string;
        readme?: string;
        license?: string;
        icon?: string;
    };
    name: string;
    namespace: string;
    version: string;
    timestamp: string;
    averageRating?: number;
    downloadCount: number;
    displayName?: string;
    description?: string;
    /**
     * May be undefined when {@link VSXSearchOptions.includeAllVersions} is
     * `false` or `undefined`.
     */
    allVersions?: VSXAllVersions[];
}
export declare type VSXExtensionNamespaceAccess = 'public' | 'restricted';
/**
 * Should be aligned with https://github.com/eclipse/openvsx/blob/master/server/src/main/java/org/eclipse/openvsx/json/UserJson.java
 */
export interface VSXUser {
    loginName: string;
    homepage?: string;
}
export interface VSXExtensionRawFiles {
    download: string;
    readme?: string;
    license?: string;
    icon?: string;
}
/**
 * Should be aligned with https://github.com/eclipse/openvsx/blob/master/server/src/main/java/org/eclipse/openvsx/json/ExtensionJson.java
 */
export interface VSXExtensionRaw {
    error?: string;
    namespaceUrl: string;
    reviewsUrl: string;
    name: string;
    namespace: string;
    publishedBy: VSXUser;
    namespaceAccess: VSXExtensionNamespaceAccess;
    files: VSXExtensionRawFiles;
    allVersions: {
        [version: string]: string;
    };
    averageRating?: number;
    downloadCount: number;
    reviewCount: number;
    version: string;
    timestamp: string;
    preview?: boolean;
    displayName?: string;
    description?: string;
    categories?: string[];
    tags?: string[];
    license?: string;
    homepage?: string;
    repository?: string;
    bugs?: string;
    markdown?: string;
    galleryColor?: string;
    galleryTheme?: string;
    qna?: string;
    engines?: {
        [engine: string]: string;
    };
}
export interface VSXResponseError extends Error {
    statusCode: number;
}
export declare namespace VSXResponseError {
    function is(error: unknown): error is VSXResponseError;
}
/**
 * Builtin namespaces maintained by the framework.
 */
export declare namespace VSXBuiltinNamespaces {
    /**
     * Namespace for individual vscode builtin extensions.
     */
    const VSCODE = "vscode";
    /**
     * Namespace for vscode builtin extension packs.
     * - corresponds to: https://github.com/eclipse-theia/vscode-builtin-extensions/blob/af9cfeb2ea23e1668a8340c1c2fb5afd56be07d7/src/create-extension-pack.js#L45
     */
    const THEIA = "eclipse-theia";
    /**
     * Determines if the extension namespace is a builtin maintained by the framework.
     * @param namespace the extension namespace to verify.
     */
    function is(namespace: string): boolean;
}
export declare type OVSXClientProvider = (uri: string) => MaybePromise<OVSXClient>;
//# sourceMappingURL=ovsx-types.d.ts.map