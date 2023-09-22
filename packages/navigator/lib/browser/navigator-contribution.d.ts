import { AbstractViewContribution } from '@theia/core/lib/browser/shell/view-contribution';
import { FrontendApplication, FrontendApplicationContribution, KeybindingRegistry, OpenerService, PreferenceService, Widget, NavigatableWidget } from '@theia/core/lib/browser';
import { CommandRegistry, MenuModelRegistry, MenuPath, Mutable } from '@theia/core/lib/common';
import { WorkspaceCommandContribution, WorkspacePreferences, WorkspaceService } from '@theia/workspace/lib/browser';
import { FileNavigatorWidget } from './navigator-widget';
import { FileNavigatorPreferences } from './navigator-preferences';
import { FileNavigatorFilter } from './navigator-filter';
import { NavigatorContextKeyService } from './navigator-context-key-service';
import { TabBarToolbarContribution, TabBarToolbarItem, TabBarToolbarRegistry } from '@theia/core/lib/browser/shell/tab-bar-toolbar';
import { NavigatorDiff } from './navigator-diff';
import { FileNode } from '@theia/filesystem/lib/browser';
import { ClipboardService } from '@theia/core/lib/browser/clipboard-service';
import { SelectionService } from '@theia/core/lib/common/selection-service';
import { OpenEditorsWidget } from './open-editors-widget/navigator-open-editors-widget';
import URI from '@theia/core/lib/common/uri';
import { FileNavigatorCommands } from './file-navigator-commands';
export { FileNavigatorCommands };
/**
 * Navigator `More Actions...` toolbar item groups.
 * Used in order to group items present in the toolbar.
 */
export declare namespace NavigatorMoreToolbarGroups {
    const NEW_OPEN = "1_navigator_new_open";
    const TOOLS = "2_navigator_tools";
    const WORKSPACE = "3_navigator_workspace";
}
export declare const NAVIGATOR_CONTEXT_MENU: MenuPath;
export declare const SHELL_TABBAR_CONTEXT_REVEAL: MenuPath;
/**
 * Navigator context menu default groups should be aligned
 * with VS Code default groups: https://code.visualstudio.com/api/references/contribution-points#contributes.menus
 */
export declare namespace NavigatorContextMenu {
    const NAVIGATION: string[];
    /** @deprecated use NAVIGATION */
    const OPEN: string[];
    /** @deprecated use NAVIGATION */
    const NEW: string[];
    const WORKSPACE: string[];
    const COMPARE: string[];
    /** @deprecated use COMPARE */
    const DIFF: string[];
    const SEARCH: string[];
    const CLIPBOARD: string[];
    const MODIFICATION: string[];
    /** @deprecated use MODIFICATION */
    const MOVE: string[];
    /** @deprecated use MODIFICATION */
    const ACTIONS: string[];
    const OPEN_WITH: string[];
}
export declare const FILE_NAVIGATOR_TOGGLE_COMMAND_ID = "fileNavigator:toggle";
export declare class FileNavigatorContribution extends AbstractViewContribution<FileNavigatorWidget> implements FrontendApplicationContribution, TabBarToolbarContribution {
    protected readonly fileNavigatorPreferences: FileNavigatorPreferences;
    protected readonly openerService: OpenerService;
    protected readonly fileNavigatorFilter: FileNavigatorFilter;
    protected readonly workspaceService: WorkspaceService;
    protected readonly workspacePreferences: WorkspacePreferences;
    protected readonly clipboardService: ClipboardService;
    protected readonly commandRegistry: CommandRegistry;
    protected readonly tabbarToolbarRegistry: TabBarToolbarRegistry;
    protected readonly contextKeyService: NavigatorContextKeyService;
    protected readonly menuRegistry: MenuModelRegistry;
    protected readonly navigatorDiff: NavigatorDiff;
    protected readonly preferenceService: PreferenceService;
    protected readonly selectionService: SelectionService;
    protected readonly workspaceCommandContribution: WorkspaceCommandContribution;
    constructor(fileNavigatorPreferences: FileNavigatorPreferences, openerService: OpenerService, fileNavigatorFilter: FileNavigatorFilter, workspaceService: WorkspaceService, workspacePreferences: WorkspacePreferences);
    protected init(): void;
    protected doInit(): Promise<void>;
    private onDidCreateNewResource;
    initializeLayout(app: FrontendApplication): Promise<void>;
    registerCommands(registry: CommandRegistry): void;
    protected get editorWidgets(): NavigatableWidget[];
    protected getSelectedFileNodes(): FileNode[];
    protected withWidget<T>(widget: Widget | undefined, cb: (navigator: FileNavigatorWidget) => T): T | false;
    protected withOpenEditorsWidget<T>(widget: Widget, cb: (navigator: OpenEditorsWidget) => T): T | false;
    registerMenus(registry: MenuModelRegistry): void;
    registerKeybindings(registry: KeybindingRegistry): void;
    registerToolbarItems(toolbarRegistry: TabBarToolbarRegistry): Promise<void>;
    /**
     * Register commands to the `More Actions...` navigator toolbar item.
     */
    registerMoreToolbarItem: (item: Mutable<TabBarToolbarItem>) => void;
    /**
     * Reveals and selects node in the file navigator to which given widget is related.
     * Does nothing if given widget undefined or doesn't have related resource.
     *
     * @param widget widget file resource of which should be revealed and selected
     */
    selectWidgetFileNode(widget: Widget | undefined): Promise<boolean>;
    selectFileNode(uri?: URI): Promise<boolean>;
    protected onCurrentWidgetChangedHandler(): void;
    /**
     * Collapse file navigator nodes and set focus on first visible node
     * - single root workspace: collapse all nodes except root
     * - multiple root workspace: collapse all nodes, even roots
     */
    collapseFileNavigatorTree(): Promise<void>;
    /**
     * force refresh workspace in navigator
     */
    refreshWorkspace(): Promise<void>;
}
//# sourceMappingURL=navigator-contribution.d.ts.map