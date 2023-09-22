import { RpcServer, RpcProxy } from '@theia/core';
import { Repository, WorkingDirectoryStatus } from './git-model';
import { Disposable, Event } from '@theia/core/lib/common';
/**
 * An event representing a `Git` status change in one of the watched local working directory.
 */
export interface GitStatusChangeEvent {
    /**
     * The source `Git` repository where the event belongs to.
     */
    readonly source: Repository;
    /**
     * The new working directory state.
     */
    readonly status: WorkingDirectoryStatus;
    /**
     * The previous working directory state, if any.
     */
    readonly oldStatus?: WorkingDirectoryStatus;
}
export declare namespace GitStatusChangeEvent {
    /**
     * `true` if the argument is a `GitStatusEvent`, otherwise `false`.
     * @param event the argument to check whether it is a Git status change event or not.
     */
    function is(event: unknown): event is GitStatusChangeEvent;
}
/**
 * Client watcher for `Git`.
 */
export interface GitWatcherClient {
    /**
     * Invoked with the event that encapsulates the status change in the repository.
     */
    onGitChanged(event: GitStatusChangeEvent): Promise<void>;
}
/**
 * The symbol of the Git watcher backend for DI.
 */
export declare const GitWatcherServer: unique symbol;
/**
 * Service representation communicating between the backend and the frontend.
 */
export interface GitWatcherServer extends RpcServer<GitWatcherClient> {
    /**
     * Watches status changes in the given repository.
     */
    watchGitChanges(repository: Repository): Promise<number>;
    /**
     * De-registers any previously added watchers identified by the unique `watcher` argument. If the watcher cannot be found
     * with its unique ID, the request will be rejected.
     */
    unwatchGitChanges(watcher: number): Promise<void>;
}
export declare const GitWatcherServerProxy: unique symbol;
export declare type GitWatcherServerProxy = RpcProxy<GitWatcherServer>;
export declare class ReconnectingGitWatcherServer implements GitWatcherServer {
    private readonly proxy;
    private watcherSequence;
    private readonly watchParams;
    private readonly localToRemoteWatcher;
    constructor(proxy: GitWatcherServerProxy);
    watchGitChanges(repository: Repository): Promise<number>;
    unwatchGitChanges(watcher: number): Promise<void>;
    dispose(): void;
    setClient(client: GitWatcherClient): void;
    private reconnect;
    private doWatchGitChanges;
}
/**
 * Unique WS endpoint path to the Git watcher service.
 */
export declare const GitWatcherPath = "/services/git-watcher";
export declare class GitWatcher implements GitWatcherClient, Disposable {
    private readonly server;
    private readonly toDispose;
    private readonly onGitEventEmitter;
    constructor(server: GitWatcherServer);
    dispose(): void;
    get onGitEvent(): Event<GitStatusChangeEvent>;
    onGitChanged(event: GitStatusChangeEvent): Promise<void>;
    watchGitChanges(repository: Repository): Promise<Disposable>;
}
//# sourceMappingURL=git-watcher.d.ts.map