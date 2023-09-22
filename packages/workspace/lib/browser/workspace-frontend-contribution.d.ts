import { CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry, MessageService, MaybeArray } from '@theia/core/lib/common';
import { OpenerService, KeybindingRegistry, KeybindingContribution, FrontendApplicationContribution, OnWillStopAction, Navigatable, SaveableSource, Widget } from '@theia/core/lib/browser';
import { FileDialogService, FileDialogTreeFilters } from '@theia/filesystem/lib/browser';
import { ContextKeyService } from '@theia/core/lib/browser/context-key-service';
import { WorkspaceService } from './workspace-service';
import { WorkspaceFileService } from '../common';
import { QuickOpenWorkspace } from './quick-open-workspace';
import URI from '@theia/core/lib/common/uri';
import { FileService } from '@theia/filesystem/lib/browser/file-service';
import { EncodingRegistry } from '@theia/core/lib/browser/encoding-registry';
import { DisposableCollection } from '@theia/core/lib/common/disposable';
import { PreferenceConfigurations } from '@theia/core/lib/browser/preferences/preference-configurations';
import { FileStat } from '@theia/filesystem/lib/common/files';
import { FilesystemSaveResourceService } from '@theia/filesystem/lib/browser/filesystem-save-resource-service';
export declare enum WorkspaceStates {
    /**
     * The state is `empty` when no workspace is opened.
     */
    empty = "empty",
    /**
     * The state is `workspace` when a workspace is opened.
     */
    workspace = "workspace",
    /**
     * The state is `folder` when a folder is opened. (1 folder)
     */
    folder = "folder"
}
export declare type WorkspaceState = keyof typeof WorkspaceStates;
export declare type WorkbenchState = keyof typeof WorkspaceStates;
/** Create the workspace section after open {@link CommonMenus.FILE_OPEN}. */
export declare const FILE_WORKSPACE: string[];
export declare class WorkspaceFrontendContribution implements CommandContribution, KeybindingContribution, MenuContribution, FrontendApplicationContribution {
    protected readonly messageService: MessageService;
    protected readonly fileService: FileService;
    protected readonly openerService: OpenerService;
    protected readonly workspaceService: WorkspaceService;
    protected readonly quickOpenWorkspace: QuickOpenWorkspace;
    protected readonly fileDialogService: FileDialogService;
    protected readonly contextKeyService: ContextKeyService;
    protected readonly encodingRegistry: EncodingRegistry;
    protected readonly preferenceConfigurations: PreferenceConfigurations;
    protected readonly saveService: FilesystemSaveResourceService;
    protected readonly workspaceFileService: WorkspaceFileService;
    configure(): void;
    protected readonly toDisposeOnUpdateEncodingOverrides: DisposableCollection;
    protected updateEncodingOverrides(): void;
    protected updateStyles(): void;
    registerCommands(commands: CommandRegistry): void;
    registerMenus(menus: MenuModelRegistry): void;
    registerKeybindings(keybindings: KeybindingRegistry): void;
    /**
     * This is the generic `Open` method. Opens files and directories too. Resolves to the opened URI.
     * Except when you are on either Windows or Linux `AND` running in electron. If so, it opens a file.
     */
    protected doOpen(): Promise<URI | undefined>;
    /**
     * Opens a file after prompting the `Open File` dialog. Resolves to `undefined`, if
     *  - the workspace root is not set,
     *  - the file to open does not exist, or
     *  - it was not a file, but a directory.
     *
     * Otherwise, resolves to the URI of the file.
     */
    protected doOpenFile(): Promise<URI | undefined>;
    /**
     * Opens one or more folders after prompting the `Open Folder` dialog. Resolves to `undefined`, if
     *  - the user's selection is empty or contains only files.
     *  - the new workspace is equal to the old workspace.
     *
     * Otherwise, resolves to the URI of the new workspace:
     *  - a single folder if a single folder was selected.
     *  - a new, untitled workspace file if multiple folders were selected.
     */
    protected doOpenFolder(): Promise<URI | undefined>;
    protected getOpenableWorkspaceUri(uris: MaybeArray<URI>): Promise<URI | undefined>;
    protected createMultiRootWorkspace(roots: FileStat[]): Promise<URI>;
    /**
     * Opens a workspace after raising the `Open Workspace` dialog. Resolves to the URI of the recently opened workspace,
     * if it was successful. Otherwise, resolves to `undefined`.
     */
    protected doOpenWorkspace(): Promise<URI | undefined>;
    protected closeWorkspace(): Promise<void>;
    /**
     * @returns whether the file was successfully saved.
     */
    protected saveWorkspaceAs(): Promise<boolean>;
    canBeSavedAs(widget: Widget | undefined): widget is Widget & SaveableSource & Navigatable;
    saveAs(widget: Widget & SaveableSource & Navigatable): Promise<void>;
    protected updateWorkspaceStateKey(): WorkspaceState;
    protected updateWorkbenchStateKey(): WorkbenchState;
    protected doUpdateState(): WorkspaceState | WorkbenchState;
    protected getWorkspaceDialogFileFilters(): FileDialogTreeFilters;
    private isElectron;
    /**
     * Get the current workspace URI.
     *
     * @returns the current workspace URI.
     */
    private getCurrentWorkspaceUri;
    onWillStop(): OnWillStopAction<boolean> | undefined;
}
export declare namespace WorkspaceFrontendContribution {
    /**
     * File filter for all Theia and VS Code workspace file types.
     *
     * @deprecated Since 1.39.0 Use `WorkspaceFrontendContribution#getWorkspaceDialogFileFilters` instead.
     */
    const DEFAULT_FILE_FILTER: FileDialogTreeFilters;
}
//# sourceMappingURL=workspace-frontend-contribution.d.ts.map