import { ILogger, DisposableCollection } from '@theia/core/lib/common';
import { IBaseTerminalServer, IBaseTerminalServerOptions, IBaseTerminalClient, TerminalProcessInfo, EnvironmentVariableCollection, MergedEnvironmentVariableCollection, SerializableEnvironmentVariableCollection, ExtensionOwnedEnvironmentVariableMutator, EnvironmentVariableCollectionWithPersistence } from '../common/base-terminal-protocol';
import { TerminalProcess, ProcessManager, TaskTerminalProcess } from '@theia/process/lib/node';
import { MarkdownString } from '@theia/core/lib/common/markdown-rendering/markdown-string';
export declare abstract class BaseTerminalServer implements IBaseTerminalServer {
    protected readonly processManager: ProcessManager;
    protected readonly logger: ILogger;
    protected client: IBaseTerminalClient | undefined;
    protected terminalToDispose: Map<number, DisposableCollection>;
    readonly collections: Map<string, EnvironmentVariableCollectionWithPersistence>;
    mergedCollection: MergedEnvironmentVariableCollection;
    constructor(processManager: ProcessManager, logger: ILogger);
    abstract create(options: IBaseTerminalServerOptions): Promise<number>;
    attach(id: number): Promise<number>;
    onAttachAttempted(id: number): Promise<void>;
    getProcessId(id: number): Promise<number>;
    getProcessInfo(id: number): Promise<TerminalProcessInfo>;
    getEnvVarCollectionDescriptionsByExtension(id: number): Promise<Map<string, string | MarkdownString | undefined>>;
    getCwdURI(id: number): Promise<string>;
    close(id: number): Promise<void>;
    getDefaultShell(): Promise<string>;
    dispose(): void;
    resize(id: number, cols: number, rows: number): Promise<void>;
    setClient(client: IBaseTerminalClient | undefined): void;
    protected notifyClientOnExit(term: TerminalProcess): DisposableCollection;
    protected postCreate(term: TerminalProcess): void;
    protected postAttachAttempted(term: TaskTerminalProcess): void;
    setCollection(extensionIdentifier: string, persistent: boolean, collection: SerializableEnvironmentVariableCollection, description: string | MarkdownString | undefined): void;
    deleteCollection(extensionIdentifier: string): void;
    private updateCollections;
    protected persistCollections(): void;
    private resolveMergedCollection;
}
export declare class MergedEnvironmentVariableCollectionImpl implements MergedEnvironmentVariableCollection {
    readonly map: Map<string, ExtensionOwnedEnvironmentVariableMutator[]>;
    constructor(collections: Map<string, EnvironmentVariableCollection>);
    applyToProcessEnvironment(env: {
        [key: string]: string | null;
    }): void;
}
//# sourceMappingURL=base-terminal-server.d.ts.map