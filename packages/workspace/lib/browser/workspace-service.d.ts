import URI from '@theia/core/lib/common/uri';
import { WorkspaceServer, UntitledWorkspaceService, WorkspaceFileService } from '../common';
import { WindowService } from '@theia/core/lib/browser/window/window-service';
import { FrontendApplicationContribution, PreferenceServiceImpl, PreferenceSchemaProvider, LabelProvider } from '@theia/core/lib/browser';
import { Deferred } from '@theia/core/lib/common/promise-util';
import { EnvVariablesServer } from '@theia/core/lib/common/env-variables';
import { ILogger, Disposable, DisposableCollection, Emitter, Event, MaybePromise, MessageService } from '@theia/core';
import { WorkspacePreferences } from './workspace-preferences';
import { FileStat, BaseStat } from '@theia/filesystem/lib/common/files';
import { FileService } from '@theia/filesystem/lib/browser/file-service';
import { WindowTitleService } from '@theia/core/lib/browser/window/window-title-service';
import { FileSystemPreferences } from '@theia/filesystem/lib/browser';
import { WorkspaceSchemaUpdater } from './workspace-schema-updater';
import { IJSONSchema } from '@theia/core/lib/common/json-schema';
/**
 * The workspace service.
 */
export declare class WorkspaceService implements FrontendApplicationContribution {
    protected _workspace: FileStat | undefined;
    protected _roots: FileStat[];
    protected deferredRoots: Deferred<FileStat[]>;
    protected readonly fileService: FileService;
    protected readonly server: WorkspaceServer;
    protected readonly windowService: WindowService;
    protected logger: ILogger;
    protected preferences: WorkspacePreferences;
    protected readonly preferenceImpl: PreferenceServiceImpl;
    protected readonly schemaProvider: PreferenceSchemaProvider;
    protected readonly envVariableServer: EnvVariablesServer;
    protected readonly messageService: MessageService;
    protected readonly labelProvider: LabelProvider;
    protected readonly fsPreferences: FileSystemPreferences;
    protected readonly schemaUpdater: WorkspaceSchemaUpdater;
    protected readonly untitledWorkspaceService: UntitledWorkspaceService;
    protected readonly workspaceFileService: WorkspaceFileService;
    protected readonly windowTitleService: WindowTitleService;
    protected _ready: Deferred<void>;
    get ready(): Promise<void>;
    protected init(): void;
    protected doInit(): Promise<void>;
    /**
     * Resolves to the default workspace URI as string.
     *
     * The default implementation tries to extract the default workspace location
     * from the `window.location.hash`, then falls-back to the most recently
     * used workspace root from the server.
     *
     * It is not ensured that the resolved workspace URI is valid, it can point
     * to a non-existing location.
     */
    protected getDefaultWorkspaceUri(): MaybePromise<string | undefined>;
    protected doGetDefaultWorkspaceUri(): Promise<string | undefined>;
    /**
     * Set the URL fragment to the given workspace path.
     */
    protected setURLFragment(workspacePath: string): void;
    get roots(): Promise<FileStat[]>;
    tryGetRoots(): FileStat[];
    get workspace(): FileStat | undefined;
    protected readonly onWorkspaceChangeEmitter: Emitter<FileStat[]>;
    get onWorkspaceChanged(): Event<FileStat[]>;
    protected readonly onWorkspaceLocationChangedEmitter: Emitter<FileStat | undefined>;
    get onWorkspaceLocationChanged(): Event<FileStat | undefined>;
    protected readonly toDisposeOnWorkspace: DisposableCollection;
    protected setWorkspace(workspaceStat: FileStat | undefined): Promise<void>;
    protected updateWorkspace(): Promise<void>;
    protected updateRoots(): Promise<void>;
    protected computeRoots(): Promise<FileStat[]>;
    protected getWorkspaceDataFromFile(): Promise<WorkspaceData | undefined>;
    protected updateTitle(): void;
    /**
     * on unload, we set our workspace root as the last recently used on the backend.
     */
    onStop(): void;
    recentWorkspaces(): Promise<string[]>;
    removeRecentWorkspace(uri: string): Promise<void>;
    /**
     * Returns `true` if theia has an opened workspace or folder
     * @returns {boolean}
     */
    get opened(): boolean;
    /**
     * Returns `true` if a multiple-root workspace is currently open.
     * @returns {boolean}
     */
    get isMultiRootWorkspaceOpened(): boolean;
    /**
     * Opens directory, or recreates a workspace from the file that `uri` points to.
     */
    open(uri: URI, options?: WorkspaceInput): void;
    protected doOpen(uri: URI, options?: WorkspaceInput): Promise<URI | undefined>;
    /**
     * Adds root folder(s) to the workspace
     * @param uris URI or URIs of the root folder(s) to add
     */
    addRoot(uris: URI[] | URI): Promise<void>;
    /**
     * Removes root folder(s) from workspace.
     */
    removeRoots(uris: URI[]): Promise<void>;
    spliceRoots(start: number, deleteCount?: number, ...rootsToAdd: URI[]): Promise<URI[]>;
    getUntitledWorkspace(): Promise<URI>;
    protected writeWorkspaceFile(workspaceFile: FileStat | undefined, workspaceData: WorkspaceData): Promise<FileStat | undefined>;
    /**
     * Clears current workspace root.
     */
    close(): Promise<void>;
    /**
     * returns a FileStat if the argument URI points to an existing directory. Otherwise, `undefined`.
     */
    protected toValidRoot(uri: URI | string | undefined): Promise<FileStat | undefined>;
    /**
     * returns a FileStat if the argument URI points to a file or directory. Otherwise, `undefined`.
     */
    protected toFileStat(uri: URI | string | undefined): Promise<FileStat | undefined>;
    protected openWindow(uri: FileStat, options?: WorkspaceInput): void;
    protected reloadWindow(options?: WorkspaceInput): void;
    protected openNewWindow(workspacePath: string, options?: WorkspaceInput): void;
    protected shouldPreserveWindow(options?: WorkspaceInput): boolean;
    /**
     * Return true if one of the paths in paths array is present in the workspace
     * NOTE: You should always explicitly use `/` as the separator between the path segments.
     */
    containsSome(paths: string[]): Promise<boolean>;
    /**
     * `true` if the current workspace is configured using a configuration file.
     *
     * `false` if there is no workspace or the workspace is simply a folder.
     */
    get saved(): boolean;
    /**
     * Save workspace data into a file
     * @param uri URI or FileStat of the workspace file
     */
    save(uri: URI | FileStat): Promise<void>;
    protected readonly rootWatchers: Map<string, Disposable>;
    protected watchRoots(): Promise<void>;
    protected refreshRootWatchers(): Promise<void>;
    protected watchRoot(root: FileStat): Promise<void>;
    protected getExcludes(uri: string): string[];
    /**
     * Returns the workspace root uri that the given file belongs to.
     * In case that the file is found in more than one workspace roots, returns the root that is closest to the file.
     * If the file is not from the current workspace, returns `undefined`.
     * @param uri URI of the file
     */
    getWorkspaceRootUri(uri: URI | undefined): URI | undefined;
    areWorkspaceRoots(uris: URI[]): boolean;
    /**
     * Check if the file should be considered as a workspace file.
     *
     * Example: We should not try to read the contents of an .exe file.
     */
    protected isWorkspaceFile(candidate: FileStat | URI): boolean;
    isUntitledWorkspace(candidate?: URI): boolean;
    isSafeToReload(withURI?: URI): Promise<boolean>;
    /**
     *
     * @param key the property key under which to store the schema (e.g. tasks, launch)
     * @param schema the schema for the property. If none is supplied, the update is treated as a deletion.
     */
    updateSchema(key: string, schema?: IJSONSchema): Promise<boolean>;
}
export interface WorkspaceInput {
    /**
     * Tests whether the same window should be used or a new one has to be opened after setting the workspace root. By default it is `false`.
     */
    preserveWindow?: boolean;
}
export interface WorkspaceData {
    folders: Array<{
        path: string;
        name?: string;
    }>;
    [key: string]: {
        [id: string]: any;
    };
}
export declare namespace WorkspaceData {
    function is(data: unknown): data is WorkspaceData;
    function buildWorkspaceData(folders: string[] | FileStat[], additionalFields?: Partial<WorkspaceData>): WorkspaceData;
    function transformToRelative(data: WorkspaceData, workspaceFile?: FileStat): WorkspaceData;
    function transformToAbsolute(data: WorkspaceData, workspaceFile?: BaseStat): WorkspaceData;
}
//# sourceMappingURL=workspace-service.d.ts.map