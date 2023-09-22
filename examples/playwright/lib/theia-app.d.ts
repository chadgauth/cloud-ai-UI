import { Page } from '@playwright/test';
import { TheiaEditor } from './theia-editor';
import { TheiaMenuBar } from './theia-main-menu';
import { TheiaPreferenceScope, TheiaPreferenceView } from './theia-preference-view';
import { TheiaQuickCommandPalette } from './theia-quick-command-palette';
import { TheiaStatusBar } from './theia-status-bar';
import { TheiaTerminal } from './theia-terminal';
import { TheiaView } from './theia-view';
import { TheiaWorkspace } from './theia-workspace';
export interface TheiaAppData {
    loadingSelector: string;
    shellSelector: string;
}
export declare const DefaultTheiaAppData: TheiaAppData;
export declare class TheiaApp {
    page: Page;
    protected appData: TheiaAppData;
    readonly statusBar: TheiaStatusBar;
    readonly quickCommandPalette: TheiaQuickCommandPalette;
    readonly menuBar: TheiaMenuBar;
    workspace: TheiaWorkspace;
    static load(page: Page, initialWorkspace?: TheiaWorkspace): Promise<TheiaApp>;
    static loadApp<T extends TheiaApp>(page: Page, appFactory: {
        new (page: Page, initialWorkspace?: TheiaWorkspace): T;
    }, initialWorkspace?: TheiaWorkspace): Promise<T>;
    constructor(page: Page, initialWorkspace?: TheiaWorkspace, appData?: TheiaAppData);
    protected load(): Promise<void>;
    protected loadOrReload(page: Page, url: string): Promise<void>;
    isMainContentPanelVisible(): Promise<boolean>;
    openPreferences(viewFactory: {
        new (app: TheiaApp): TheiaPreferenceView;
    }, preferenceScope?: TheiaPreferenceScope): Promise<TheiaPreferenceView>;
    openView<T extends TheiaView>(viewFactory: {
        new (app: TheiaApp): T;
    }): Promise<T>;
    openEditor<T extends TheiaEditor>(filePath: string, editorFactory: {
        new (filePath: string, app: TheiaApp): T;
    }, editorName?: string, expectFileNodes?: boolean): Promise<T>;
    activateExistingEditor<T extends TheiaEditor>(filePath: string, editorFactory: {
        new (filePath: string, app: TheiaApp): T;
    }): Promise<T>;
    openTerminal<T extends TheiaTerminal>(terminalFactory: {
        new (id: string, app: TheiaApp): T;
    }): Promise<T>;
    protected runAndWaitForNewTabs(command: () => Promise<void>): Promise<string[]>;
    protected waitForNewTabs(tabIds: string[]): Promise<string[]>;
    protected visibleTabIds(): Promise<string[]>;
    /** Specific Theia apps may add additional conditions to wait for. */
    waitForInitialized(): Promise<void>;
}
//# sourceMappingURL=theia-app.d.ts.map