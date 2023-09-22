export declare class TheiaWorkspace {
    protected pathOfFilesToInitialize?: string[] | undefined;
    protected workspacePath: string;
    /**
     * Creates a Theia workspace location with the specified path to files that shall be copied to this workspace.
     * The `pathOfFilesToInitialize` must be relative to cwd of the node process.
     *
     * @param {string[]} pathOfFilesToInitialize Path to files or folders that shall be copied to the workspace
     */
    constructor(pathOfFilesToInitialize?: string[] | undefined);
    /** Performs the file system operations preparing the workspace location synchronously. */
    initialize(): void;
    get path(): string;
    get urlEncodedPath(): string;
    get escapedPath(): string;
    clear(): void;
    remove(): void;
}
//# sourceMappingURL=theia-workspace.d.ts.map