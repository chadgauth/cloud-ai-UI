/// <reference types="react" />
import * as React from '@theia/core/shared/react';
import URI from '@theia/core/lib/common/uri';
import { CommandRegistry } from '@theia/core/lib/common';
import { WorkspaceService } from '@theia/workspace/lib/browser';
import { Message, ReactWidget, LabelProvider, PreferenceService } from '@theia/core/lib/browser';
import { ApplicationInfo, ApplicationServer } from '@theia/core/lib/common/application-protocol';
import { EnvVariablesServer } from '@theia/core/lib/common/env-variables';
import { WindowService } from '@theia/core/lib/browser/window/window-service';
/**
 * Default implementation of the `GettingStartedWidget`.
 * The widget is displayed when there are currently no workspaces present.
 * Some of the features displayed include:
 * - `open` commands.
 * - `recently used workspaces`.
 * - `settings` commands.
 * - `help` commands.
 * - helpful links.
 */
export declare class GettingStartedWidget extends ReactWidget {
    /**
     * The widget `id`.
     */
    static readonly ID = "getting.started.widget";
    /**
     * The widget `label` which is used for display purposes.
     */
    static readonly LABEL: string;
    /**
     * The `ApplicationInfo` for the application if available.
     * Used in order to obtain the version number of the application.
     */
    protected applicationInfo: ApplicationInfo | undefined;
    /**
     * The application name which is used for display purposes.
     */
    protected applicationName: string;
    protected home: string | undefined;
    /**
     * The recently used workspaces limit.
     * Used in order to limit the number of recently used workspaces to display.
     */
    protected recentLimit: number;
    /**
     * The list of recently used workspaces.
     */
    protected recentWorkspaces: string[];
    /**
     * Collection of useful links to display for end users.
     */
    protected readonly documentationUrl = "https://www.theia-ide.org/docs/";
    protected readonly compatibilityUrl = "https://eclipse-theia.github.io/vscode-theia-comparator/status.html";
    protected readonly extensionUrl = "https://www.theia-ide.org/docs/authoring_extensions";
    protected readonly pluginUrl = "https://www.theia-ide.org/docs/authoring_plugins";
    protected readonly appServer: ApplicationServer;
    protected readonly commandRegistry: CommandRegistry;
    protected readonly environments: EnvVariablesServer;
    protected readonly labelProvider: LabelProvider;
    protected readonly windowService: WindowService;
    protected readonly workspaceService: WorkspaceService;
    protected readonly preferenceService: PreferenceService;
    protected init(): void;
    protected doInit(): Promise<void>;
    protected onActivateRequest(msg: Message): void;
    /**
     * Render the content of the widget.
     */
    protected render(): React.ReactNode;
    /**
     * Render the widget header.
     * Renders the title `{applicationName} Getting Started`.
     */
    protected renderHeader(): React.ReactNode;
    /**
     * Render the `open` section.
     * Displays a collection of `open` commands.
     */
    protected renderOpen(): React.ReactNode;
    /**
     * Render the recently used workspaces section.
     */
    protected renderRecentWorkspaces(): React.ReactNode;
    /**
     * Render the settings section.
     * Generally used to display useful links.
     */
    protected renderSettings(): React.ReactNode;
    /**
     * Render the help section.
     */
    protected renderHelp(): React.ReactNode;
    /**
     * Render the version section.
     */
    protected renderVersion(): React.ReactNode;
    protected renderPreferences(): React.ReactNode;
    /**
     * Build the list of workspace paths.
     * @param workspaces {string[]} the list of workspaces.
     * @returns {string[]} the list of workspace paths.
     */
    protected buildPaths(workspaces: string[]): string[];
    /**
     * Trigger the open command.
     */
    protected doOpen: () => Promise<unknown>;
    protected doOpenEnter: (e: React.KeyboardEvent) => void;
    /**
     * Trigger the open file command.
     */
    protected doOpenFile: () => Promise<unknown>;
    protected doOpenFileEnter: (e: React.KeyboardEvent) => void;
    /**
     * Trigger the open folder command.
     */
    protected doOpenFolder: () => Promise<unknown>;
    protected doOpenFolderEnter: (e: React.KeyboardEvent) => void;
    /**
     * Trigger the open workspace command.
     */
    protected doOpenWorkspace: () => Promise<unknown>;
    protected doOpenWorkspaceEnter: (e: React.KeyboardEvent) => void;
    /**
     * Trigger the open recent workspace command.
     */
    protected doOpenRecentWorkspace: () => Promise<unknown>;
    protected doOpenRecentWorkspaceEnter: (e: React.KeyboardEvent) => void;
    /**
     * Trigger the open preferences command.
     * Used to open the preferences widget.
     */
    protected doOpenPreferences: () => Promise<unknown>;
    protected doOpenPreferencesEnter: (e: React.KeyboardEvent) => void;
    /**
     * Trigger the open keyboard shortcuts command.
     * Used to open the keyboard shortcuts widget.
     */
    protected doOpenKeyboardShortcuts: () => Promise<unknown>;
    protected doOpenKeyboardShortcutsEnter: (e: React.KeyboardEvent) => void;
    /**
     * Open a workspace given its uri.
     * @param uri {URI} the workspace uri.
     */
    protected open: (uri: URI) => void;
    protected openEnter: (e: React.KeyboardEvent, uri: URI) => void;
    /**
     * Open a link in an external window.
     * @param url the link.
     */
    protected doOpenExternalLink: (url: string) => undefined;
    protected doOpenExternalLinkEnter: (e: React.KeyboardEvent, url: string) => void;
    protected isEnterKey(e: React.KeyboardEvent): boolean;
}
export interface PreferencesProps {
    preferenceService: PreferenceService;
}
//# sourceMappingURL=getting-started-widget.d.ts.map