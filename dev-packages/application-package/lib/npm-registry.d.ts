import * as nano from 'nano';
import { NodeRequestService } from '@theia/request/lib/node-request-service';
import { NpmRegistryProps } from './application-props';
export interface IChangeStream {
    on(event: 'data', cb: (change: {
        id: string;
    }) => void): void;
    destroy(): void;
}
export interface Author {
    name: string;
    email: string;
}
export interface Maintainer {
    username: string;
    email: string;
}
export interface Dependencies {
    [name: string]: string | undefined;
}
export interface NodePackage {
    name?: string;
    version?: string;
    description?: string;
    publisher?: Maintainer;
    author?: string | Author;
    maintainers?: Maintainer[];
    keywords?: string[];
    dependencies?: Dependencies;
    peerDependencies?: Dependencies;
    [property: string]: any;
}
export interface PublishedNodePackage extends NodePackage {
    name: string;
    version: string;
}
export declare namespace PublishedNodePackage {
    function is(pck: NodePackage | undefined): pck is PublishedNodePackage;
}
export interface ViewResult {
    'dist-tags': {
        [tag: string]: string;
    };
    'versions': {
        [version: string]: NodePackage;
    };
    'readme': string;
    [key: string]: any;
}
export declare function sortByKey(object: {
    [key: string]: any;
}): {
    [key: string]: any;
};
export declare class NpmRegistryOptions {
    /**
     * Default: false.
     */
    readonly watchChanges: boolean;
}
export declare class NpmRegistry {
    readonly props: NpmRegistryProps;
    protected readonly options: NpmRegistryOptions;
    protected changes?: nano.ChangesReaderScope;
    protected readonly index: Map<string, Promise<ViewResult>>;
    protected request: NodeRequestService;
    constructor(options?: Partial<NpmRegistryOptions>);
    updateProps(props?: Partial<NpmRegistryProps>): void;
    protected resetIndex(): void;
    protected invalidate(name: string): void;
    view(name: string): Promise<ViewResult>;
    protected doView(name: string): Promise<ViewResult>;
}
//# sourceMappingURL=npm-registry.d.ts.map