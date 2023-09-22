import { VSXAllVersions, VSXExtensionRaw, VSXSearchEntry } from './ovsx-types';
export declare const OVSXApiFilter: unique symbol;
/**
 * Filter various data types based on a pre-defined supported VS Code API version.
 */
export interface OVSXApiFilter {
    supportedApiVersion: string;
    /**
     * Get the latest compatible extension version:
     * - A builtin extension is fetched based on the extension version which matches the API.
     * - An extension satisfies compatibility if its `engines.vscode` version is supported.
     *
     * @param extensionId the extension id.
     * @returns the data for the latest compatible extension version if available, else `undefined`.
     */
    getLatestCompatibleExtension(extensions: VSXExtensionRaw[]): VSXExtensionRaw | undefined;
    getLatestCompatibleVersion(searchEntry: VSXSearchEntry): VSXAllVersions | undefined;
}
export declare class OVSXApiFilterImpl implements OVSXApiFilter {
    supportedApiVersion: string;
    constructor(supportedApiVersion: string);
    getLatestCompatibleExtension(extensions: VSXExtensionRaw[]): VSXExtensionRaw | undefined;
    getLatestCompatibleVersion(searchEntry: VSXSearchEntry): VSXAllVersions | undefined;
    protected isBuiltinNamespace(namespace: string): boolean;
    /**
     * @returns `a >= b`
     */
    protected versionGreaterThanOrEqualTo(a: string, b: string): boolean;
    protected supportedVscodeApiSatisfies(vscodeApiRange: string): boolean;
}
//# sourceMappingURL=ovsx-api-filter.d.ts.map