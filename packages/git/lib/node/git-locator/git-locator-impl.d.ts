import { GitLocator, GitLocateOptions } from './git-locator-protocol';
export declare type FindGitRepositories = (path: string, progressCb: (repos: string[]) => void) => Promise<string[]>;
export interface GitLocateContext {
    maxCount: number;
    readonly visited: Map<string, boolean>;
}
export declare class GitLocatorImpl implements GitLocator {
    protected readonly options: {
        info: (message: string, ...args: any[]) => void;
        error: (message: string, ...args: any[]) => void;
    };
    constructor(options?: {
        info?: (message: string, ...args: any[]) => void;
        error?: (message: string, ...args: any[]) => void;
    });
    dispose(): void;
    locate(basePath: string, options: GitLocateOptions): Promise<string[]>;
    protected doLocate(basePath: string, context: GitLocateContext): Promise<string[]>;
    protected generateNested(repositoryPaths: string[], context: GitLocateContext): IterableIterator<Promise<string[]>>;
    protected locateNested(repositoryPath: string, context: GitLocateContext): Promise<string[]>;
    protected generateRepositories(repositoryPath: string, files: string[], context: GitLocateContext): IterableIterator<Promise<string[]>>;
    protected locateFrom(generator: (context: GitLocateContext) => IterableIterator<Promise<string[]>>, parentContext: GitLocateContext, initial?: string[]): Promise<string[]>;
    static map(repository: string): Promise<string>;
}
//# sourceMappingURL=git-locator-impl.d.ts.map