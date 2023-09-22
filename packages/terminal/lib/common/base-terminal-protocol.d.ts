import { RpcServer } from '@theia/core/lib/common/messaging/proxy-factory';
import { Disposable } from '@theia/core';
import { MarkdownString } from '@theia/core/lib/common/markdown-rendering/markdown-string';
export interface TerminalProcessInfo {
    executable: string;
    arguments: string[];
}
export interface IBaseTerminalServerOptions {
}
export interface IBaseTerminalServer extends RpcServer<IBaseTerminalClient> {
    create(IBaseTerminalServerOptions: object): Promise<number>;
    getProcessId(id: number): Promise<number>;
    getProcessInfo(id: number): Promise<TerminalProcessInfo>;
    getEnvVarCollectionDescriptionsByExtension(id: number): Promise<Map<string, string | MarkdownString | undefined>>;
    getCwdURI(id: number): Promise<string>;
    resize(id: number, cols: number, rows: number): Promise<void>;
    attach(id: number): Promise<number>;
    onAttachAttempted(id: number): Promise<void>;
    close(id: number): Promise<void>;
    getDefaultShell(): Promise<string>;
    /**
     * Gets a single collection constructed by merging all environment variable collections into
     * one.
     */
    readonly collections: ReadonlyMap<string, EnvironmentVariableCollection>;
    /**
     * Gets a single collection constructed by merging all environment variable collections into
     * one.
     */
    readonly mergedCollection: MergedEnvironmentVariableCollection;
    /**
     * Sets an extension's environment variable collection.
     */
    setCollection(extensionIdentifier: string, persistent: boolean, collection: SerializableEnvironmentVariableCollection, description: string | MarkdownString | undefined): void;
    /**
     * Deletes an extension's environment variable collection.
     */
    deleteCollection(extensionIdentifier: string): void;
}
export declare namespace IBaseTerminalServer {
    function validateId(id?: number): boolean;
}
export interface IBaseTerminalExitEvent {
    terminalId: number;
    code?: number;
    reason?: TerminalExitReason;
    signal?: string;
    attached?: boolean;
}
export declare enum TerminalExitReason {
    Unknown = 0,
    Shutdown = 1,
    Process = 2,
    User = 3,
    Extension = 4
}
export interface IBaseTerminalErrorEvent {
    terminalId: number;
    error: Error;
    attached?: boolean;
}
export interface IBaseTerminalClient {
    onTerminalExitChanged(event: IBaseTerminalExitEvent): void;
    onTerminalError(event: IBaseTerminalErrorEvent): void;
    updateTerminalEnvVariables(): void;
    storeTerminalEnvVariables(data: string): void;
}
export declare class DispatchingBaseTerminalClient {
    protected readonly clients: Set<IBaseTerminalClient>;
    push(client: IBaseTerminalClient): Disposable;
    onTerminalExitChanged(event: IBaseTerminalExitEvent): void;
    onTerminalError(event: IBaseTerminalErrorEvent): void;
    updateTerminalEnvVariables(): void;
    storeTerminalEnvVariables(data: string): void;
}
export declare const ENVIRONMENT_VARIABLE_COLLECTIONS_KEY = "terminal.integrated.environmentVariableCollections";
export interface EnvironmentVariableCollection {
    readonly map: ReadonlyMap<string, EnvironmentVariableMutator>;
}
export interface EnvironmentVariableCollectionWithPersistence extends EnvironmentVariableCollection {
    readonly persistent: boolean;
    readonly description: string | MarkdownString | undefined;
}
export declare enum EnvironmentVariableMutatorType {
    Replace = 1,
    Append = 2,
    Prepend = 3
}
export interface EnvironmentVariableMutator {
    readonly value: string;
    readonly type: EnvironmentVariableMutatorType;
}
export interface ExtensionOwnedEnvironmentVariableMutator extends EnvironmentVariableMutator {
    readonly extensionIdentifier: string;
}
/**
 * Represents an environment variable collection that results from merging several collections
 * together.
 */
export interface MergedEnvironmentVariableCollection {
    readonly map: ReadonlyMap<string, ExtensionOwnedEnvironmentVariableMutator[]>;
    /**
     * Applies this collection to a process environment.
     */
    applyToProcessEnvironment(env: {
        [key: string]: string | null;
    }): void;
}
export interface SerializableExtensionEnvironmentVariableCollection {
    extensionIdentifier: string;
    collection: SerializableEnvironmentVariableCollection | undefined;
    description: string | MarkdownString | undefined;
}
export declare type SerializableEnvironmentVariableCollection = [string, EnvironmentVariableMutator][];
//# sourceMappingURL=base-terminal-protocol.d.ts.map