import { CommandContribution, Command, CommandRegistry, DisposableCollection, MenuContribution, MenuModelRegistry, SelectionService, Emitter, Event } from '@theia/core/lib/common';
import { ApplicationShell, KeybindingContribution, WidgetManager, PreferenceService, KeybindingRegistry, LabelProvider, WidgetOpenerOptions, StorageService, QuickInputService, FrontendApplicationContribution, OnWillStopAction, FrontendApplication, Widget } from '@theia/core/lib/browser';
import { TabBarToolbarContribution, TabBarToolbarRegistry } from '@theia/core/lib/browser/shell/tab-bar-toolbar';
import { TerminalService } from './base/terminal-service';
import { TerminalWidgetOptions, TerminalWidget } from './base/terminal-widget';
import { TerminalProfile, TerminalProfileService, TerminalProfileStore } from './terminal-profile-service';
import { ShellTerminalServerProxy } from '../common/shell-terminal-protocol';
import URI from '@theia/core/lib/common/uri';
import { WorkspaceService } from '@theia/workspace/lib/browser';
import { ContextKeyService } from '@theia/core/lib/browser/context-key-service';
import { ColorContribution } from '@theia/core/lib/browser/color-application-contribution';
import { ColorRegistry } from '@theia/core/lib/browser/color-registry';
import { FileService } from '@theia/filesystem/lib/browser/file-service';
import { TerminalWatcher } from '../common/terminal-watcher';
import { TerminalPreferences } from './terminal-preferences';
import { VariableResolverService } from '@theia/variable-resolver/lib/browser';
export declare namespace TerminalMenus {
    const TERMINAL: string[];
    const TERMINAL_NEW: string[];
    const TERMINAL_TASKS: string[];
    const TERMINAL_TASKS_INFO: string[];
    const TERMINAL_TASKS_CONFIG: string[];
    const TERMINAL_NAVIGATOR_CONTEXT_MENU: string[];
    const TERMINAL_OPEN_EDITORS_CONTEXT_MENU: string[];
    const TERMINAL_CONTEXT_MENU: string[];
}
export declare namespace TerminalCommands {
    const NEW: Command;
    const PROFILE_NEW: Command;
    const PROFILE_DEFAULT: Command;
    const NEW_ACTIVE_WORKSPACE: Command;
    const TERMINAL_CLEAR: Command;
    const TERMINAL_CONTEXT: Command;
    const SPLIT: Command;
    const TERMINAL_FIND_TEXT: Command;
    const TERMINAL_FIND_TEXT_CANCEL: Command;
    const SCROLL_LINE_UP: Command;
    const SCROLL_LINE_DOWN: Command;
    const SCROLL_TO_TOP: Command;
    const SCROLL_PAGE_UP: Command;
    const SCROLL_PAGE_DOWN: Command;
    const TOGGLE_TERMINAL: Command;
    const KILL_TERMINAL: Command;
    const SELECT_ALL: Command;
    /**
     * Command that displays all terminals that are currently opened
     */
    const SHOW_ALL_OPENED_TERMINALS: Command;
}
export declare class TerminalFrontendContribution implements FrontendApplicationContribution, TerminalService, CommandContribution, MenuContribution, KeybindingContribution, TabBarToolbarContribution, ColorContribution {
    protected readonly shell: ApplicationShell;
    protected readonly shellTerminalServer: ShellTerminalServerProxy;
    protected readonly widgetManager: WidgetManager;
    protected readonly fileService: FileService;
    protected readonly selectionService: SelectionService;
    protected readonly labelProvider: LabelProvider;
    protected readonly quickInputService: QuickInputService;
    protected readonly workspaceService: WorkspaceService;
    protected readonly profileService: TerminalProfileService;
    protected readonly userProfileStore: TerminalProfileStore;
    protected readonly contributedProfileStore: TerminalProfileStore;
    protected readonly terminalWatcher: TerminalWatcher;
    protected readonly variableResolver: VariableResolverService;
    protected readonly storageService: StorageService;
    protected readonly preferenceService: PreferenceService;
    protected terminalPreferences: TerminalPreferences;
    protected mergePreferencesPromise: Promise<void>;
    protected readonly onDidCreateTerminalEmitter: Emitter<TerminalWidget>;
    readonly onDidCreateTerminal: Event<TerminalWidget>;
    protected readonly onDidChangeCurrentTerminalEmitter: Emitter<TerminalWidget | undefined>;
    readonly onDidChangeCurrentTerminal: Event<TerminalWidget | undefined>;
    protected readonly contextKeyService: ContextKeyService;
    protected init(): void;
    get terminalHideSearch(): boolean;
    onStart(app: FrontendApplication): Promise<void>;
    contributeDefaultProfiles(): Promise<void>;
    protected mergePreferences(): Promise<void>;
    protected resolveShellPath(path: string | string[] | undefined): Promise<string | undefined>;
    onWillStop(): OnWillStopAction<number> | undefined;
    protected confirmExitWithActiveTerminals(activeTerminalCount: number): Promise<boolean>;
    protected _currentTerminal: TerminalWidget | undefined;
    get currentTerminal(): TerminalWidget | undefined;
    protected setCurrentTerminal(current: TerminalWidget | undefined): void;
    protected updateCurrentTerminal(): void;
    protected mostRecentlyUsedTerminalEntries: {
        id: string;
        disposables: DisposableCollection;
    }[];
    protected getLastUsedTerminalId(): string | undefined;
    get lastUsedTerminal(): TerminalWidget | undefined;
    protected setLastUsedTerminal(lastUsedTerminal: TerminalWidget): void;
    get all(): TerminalWidget[];
    getById(id: string): TerminalWidget | undefined;
    getByTerminalId(terminalId: number): TerminalWidget | undefined;
    getDefaultShell(): Promise<string>;
    registerCommands(commands: CommandRegistry): void;
    protected toggleTerminal(): void;
    openInTerminal(uri: URI): Promise<void>;
    registerMenus(menus: MenuModelRegistry): void;
    registerToolbarItems(toolbar: TabBarToolbarRegistry): void;
    registerKeybindings(keybindings: KeybindingRegistry): void;
    newTerminal(options: TerminalWidgetOptions): Promise<TerminalWidget>;
    open(widget: TerminalWidget, options?: WidgetOpenerOptions): void;
    protected selectTerminalCwd(): Promise<string | undefined>;
    protected selectTerminalProfile(placeholder: string): Promise<[string, TerminalProfile] | undefined>;
    protected splitTerminal(referenceTerminal?: TerminalWidget): Promise<void>;
    protected openTerminal(options?: ApplicationShell.WidgetOptions, terminalProfile?: TerminalProfile): Promise<void>;
    protected chooseDefaultProfile(): Promise<void>;
    protected openActiveWorkspaceTerminal(options?: ApplicationShell.WidgetOptions): Promise<void>;
    protected withWidget<T>(widget: Widget | undefined, fn: (widget: TerminalWidget) => T): T | false;
    /**
     * It should be aligned with https://code.visualstudio.com/api/references/theme-color#integrated-terminal-colors
     */
    registerColors(colors: ColorRegistry): void;
}
//# sourceMappingURL=terminal-frontend-contribution.d.ts.map