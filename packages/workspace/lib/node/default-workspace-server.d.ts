/// <reference types="yargs" />
import * as yargs from '@theia/core/shared/yargs';
import { BackendApplicationContribution } from '@theia/core/lib/node';
import { CliContribution } from '@theia/core/lib/node/cli';
import { Deferred } from '@theia/core/lib/common/promise-util';
import { WorkspaceServer, UntitledWorkspaceService } from '../common';
import { EnvVariablesServer } from '@theia/core/lib/common/env-variables';
export declare class WorkspaceCliContribution implements CliContribution {
    protected readonly envVariablesServer: EnvVariablesServer;
    protected readonly untitledWorkspaceService: UntitledWorkspaceService;
    workspaceRoot: Deferred<string | undefined>;
    configure(conf: yargs.Argv): void;
    setArguments(args: yargs.Arguments): Promise<void>;
    protected normalizeWorkspaceArg(raw: string): string;
    protected buildWorkspaceForMultipleArguments(workspaceArguments: string[]): Promise<string | undefined>;
}
export declare class DefaultWorkspaceServer implements WorkspaceServer, BackendApplicationContribution {
    protected root: Deferred<string | undefined>;
    /**
     * Untitled workspaces that are not among the most recent N workspaces will be deleted on start. Increase this number to keep older files,
     * lower it to delete stale untitled workspaces more aggressively.
     */
    protected untitledWorkspaceStaleThreshold: number;
    protected readonly cliParams: WorkspaceCliContribution;
    protected readonly envServer: EnvVariablesServer;
    protected readonly untitledWorkspaceService: UntitledWorkspaceService;
    protected init(): void;
    protected doInit(): Promise<void>;
    onStart(): Promise<void>;
    protected getRoot(): Promise<string | undefined>;
    getMostRecentlyUsedWorkspace(): Promise<string | undefined>;
    setMostRecentlyUsedWorkspace(rawUri: string): Promise<void>;
    removeRecentWorkspace(rawUri: string): Promise<void>;
    getRecentWorkspaces(): Promise<string[]>;
    protected workspaceStillExist(workspaceRootUri: string): Promise<boolean>;
    protected getWorkspaceURIFromCli(): Promise<string | undefined>;
    /**
     * Writes the given uri as the most recently used workspace root to the user's home directory.
     * @param uri most recently used uri
     */
    protected writeToUserHome(data: RecentWorkspacePathsData): Promise<void>;
    protected writeToFile(fsPath: string, data: object): Promise<void>;
    /**
     * Reads the most recently used workspace root from the user's home directory.
     */
    protected readRecentWorkspacePathsFromUserHome(): Promise<RecentWorkspacePathsData | undefined>;
    protected readJsonFromFile(fsPath: string): Promise<object | undefined>;
    protected getUserStoragePath(): Promise<string>;
    /**
     * Removes untitled workspaces that are not among the most recently used workspaces.
     * Use the `untitledWorkspaceStaleThreshold` to configure when to delete workspaces.
     */
    protected removeOldUntitledWorkspaces(): Promise<void>;
}
export interface RecentWorkspacePathsData {
    recentRoots: string[];
}
export declare namespace RecentWorkspacePathsData {
    /**
     * Parses `data` as `RecentWorkspacePathsData` but removes any non-string array entry.
     *
     * Returns undefined if the given `data` does not contain a `recentRoots` array property.
     */
    function create(data: unknown): RecentWorkspacePathsData | undefined;
}
//# sourceMappingURL=default-workspace-server.d.ts.map