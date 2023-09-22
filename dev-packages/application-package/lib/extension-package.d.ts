import { NpmRegistry, PublishedNodePackage, NodePackage } from './npm-registry';
export interface Extension {
    frontendPreload?: string;
    frontend?: string;
    frontendElectron?: string;
    secondaryWindow?: string;
    backend?: string;
    backendElectron?: string;
    electronMain?: string;
    preload?: string;
}
export interface ExtensionPackageOptions {
    /**
     * Alias to use in place of the original package's name.
     */
    alias?: string;
}
export declare class ExtensionPackage {
    readonly raw: PublishedNodePackage & Partial<RawExtensionPackage>;
    protected readonly registry: NpmRegistry;
    protected _name: string;
    constructor(raw: PublishedNodePackage & Partial<RawExtensionPackage>, registry: NpmRegistry, options?: ExtensionPackageOptions);
    /**
     * The name of the extension's package as defined in "dependencies" (might be aliased)
     */
    get name(): string;
    get version(): string;
    get description(): string;
    get theiaExtensions(): Extension[];
    get installed(): boolean;
    get dependent(): string | undefined;
    get transitive(): boolean;
    get parent(): ExtensionPackage | undefined;
    protected view(): Promise<RawExtensionPackage.ViewState>;
    protected readme?: string;
    getReadme(): Promise<string>;
    protected resolveReadme(): Promise<string>;
    getAuthor(): string;
}
export interface RawExtensionPackage extends PublishedNodePackage {
    installed?: RawExtensionPackage.InstalledState;
    view?: RawExtensionPackage.ViewState;
    theiaExtensions: Extension[];
}
export declare namespace RawExtensionPackage {
    interface InstalledState {
        version: string;
        packagePath: string;
        transitive: boolean;
        parent?: ExtensionPackage;
    }
    class ViewState {
        protected readonly registry: NpmRegistry;
        readme?: string;
        tags?: {
            [tag: string]: string;
        };
        constructor(registry: NpmRegistry);
        get latestVersion(): string | undefined;
    }
    function is(pck: NodePackage | undefined): pck is RawExtensionPackage;
    function view(registry: NpmRegistry, name: string, version?: string): Promise<RawExtensionPackage | undefined>;
}
//# sourceMappingURL=extension-package.d.ts.map