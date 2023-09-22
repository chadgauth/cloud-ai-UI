/// <reference types="lodash" />
import { interfaces } from '@theia/core/shared/inversify';
import { PluginMetadata, HostedPluginServer, DeployedPlugin, PluginServer, PluginIdentifiers } from '../../common/plugin-protocol';
import { HostedPluginWatcher } from './hosted-plugin-watcher';
import { PluginManagerExt } from '../../common/plugin-api-rpc';
import { RPCProtocol } from '../../common/rpc-protocol';
import { DisposableCollection, Emitter, ILogger, ContributionProvider, CommandRegistry, WillExecuteCommandEvent, RpcProxy, ProgressService } from '@theia/core';
import { PreferenceServiceImpl, PreferenceProviderProvider } from '@theia/core/lib/browser/preferences';
import { WorkspaceService } from '@theia/workspace/lib/browser';
import { PluginContributionHandler } from '../../main/browser/plugin-contribution-handler';
import { MainPluginApiProvider } from '../../common/plugin-ext-api-contribution';
import { PluginPathsService } from '../../main/common/plugin-paths-protocol';
import { Deferred } from '@theia/core/lib/common/promise-util';
import { DebugSessionManager } from '@theia/debug/lib/browser/debug-session-manager';
import { DebugConfigurationManager } from '@theia/debug/lib/browser/debug-configuration-manager';
import { WaitUntilEvent } from '@theia/core/lib/common/event';
import { FileSearchService } from '@theia/file-search/lib/common/file-search-service';
import { FrontendApplicationStateService } from '@theia/core/lib/browser/frontend-application-state';
import { PluginViewRegistry } from '../../main/browser/view/plugin-view-registry';
import { WillResolveTaskProvider, TaskProviderRegistry, TaskResolverRegistry } from '@theia/task/lib/browser/task-contribution';
import { TaskDefinitionRegistry } from '@theia/task/lib/browser/task-definition-registry';
import { WebviewEnvironment } from '../../main/browser/webview/webview-environment';
import { WebviewWidget } from '../../main/browser/webview/webview';
import { WidgetManager } from '@theia/core/lib/browser/widget-manager';
import { TerminalService } from '@theia/terminal/lib/browser/base/terminal-service';
import { EnvVariablesServer } from '@theia/core/lib/common/env-variables';
import { JsonSchemaStore } from '@theia/core/lib/browser/json-schema-store';
import { FileService, FileSystemProviderActivationEvent } from '@theia/filesystem/lib/browser/file-service';
import { PluginCustomEditorRegistry } from '../../main/browser/custom-editors/plugin-custom-editor-registry';
import { Measurement, Stopwatch } from '@theia/core/lib/common';
import { NotebookTypeRegistry, NotebookService } from '@theia/notebook/lib/browser';
export declare type PluginHost = 'frontend' | string;
export declare type DebugActivationEvent = 'onDebugResolve' | 'onDebugInitialConfigurations' | 'onDebugAdapterProtocolTracker' | 'onDebugDynamicConfigurations';
export declare const PluginProgressLocation = "plugin";
export declare const ALL_ACTIVATION_EVENT = "*";
export declare class HostedPluginSupport {
    protected readonly clientId: string;
    protected container: interfaces.Container;
    protected readonly logger: ILogger;
    protected readonly server: RpcProxy<HostedPluginServer>;
    protected readonly watcher: HostedPluginWatcher;
    protected readonly contributionHandler: PluginContributionHandler;
    protected readonly mainPluginApiProviders: ContributionProvider<MainPluginApiProvider>;
    protected readonly pluginServer: PluginServer;
    protected readonly preferenceProviderProvider: PreferenceProviderProvider;
    protected readonly preferenceServiceImpl: PreferenceServiceImpl;
    protected readonly pluginPathsService: PluginPathsService;
    protected readonly workspaceService: WorkspaceService;
    protected readonly notebookService: NotebookService;
    protected readonly commands: CommandRegistry;
    protected readonly debugSessionManager: DebugSessionManager;
    protected readonly debugConfigurationManager: DebugConfigurationManager;
    protected readonly fileService: FileService;
    protected readonly fileSearchService: FileSearchService;
    protected readonly appState: FrontendApplicationStateService;
    protected readonly notebookTypeRegistry: NotebookTypeRegistry;
    protected readonly viewRegistry: PluginViewRegistry;
    protected readonly taskProviderRegistry: TaskProviderRegistry;
    protected readonly taskResolverRegistry: TaskResolverRegistry;
    protected readonly taskDefinitionRegistry: TaskDefinitionRegistry;
    protected readonly progressService: ProgressService;
    protected readonly webviewEnvironment: WebviewEnvironment;
    protected readonly widgets: WidgetManager;
    protected readonly terminalService: TerminalService;
    protected readonly envServer: EnvVariablesServer;
    protected readonly jsonSchemaStore: JsonSchemaStore;
    protected readonly customEditorRegistry: PluginCustomEditorRegistry;
    protected readonly stopwatch: Stopwatch;
    protected theiaReadyPromise: Promise<any>;
    protected readonly managers: Map<string, PluginManagerExt>;
    protected readonly contributions: Map<`${string}.${string}`, PluginContributions>;
    protected readonly activationEvents: Set<string>;
    protected readonly onDidChangePluginsEmitter: Emitter<void>;
    readonly onDidChangePlugins: import("@theia/core").Event<void>;
    protected readonly deferredWillStart: Deferred<void>;
    /**
     * Resolves when the initial plugins are loaded and about to be started.
     */
    get willStart(): Promise<void>;
    protected readonly deferredDidStart: Deferred<void>;
    /**
     * Resolves when the initial plugins are started.
     */
    get didStart(): Promise<void>;
    protected init(): void;
    get plugins(): PluginMetadata[];
    getPlugin(id: PluginIdentifiers.UnversionedId): DeployedPlugin | undefined;
    /** do not call it, except from the plugin frontend contribution */
    onStart(container: interfaces.Container): void;
    protected loadQueue: Promise<void>;
    load: import("lodash").DebouncedFuncLeading<() => Promise<void>>;
    protected doLoad(): Promise<void>;
    /**
     * Sync loaded and deployed plugins:
     * - undeployed plugins are unloaded
     * - newly deployed plugins are initialized
     */
    protected syncPlugins(): Promise<void>;
    /**
     * Always synchronous in order to simplify handling disconnections.
     * @throws never
     */
    protected loadContributions(toDisconnect: DisposableCollection): Map<PluginHost, PluginContributions[]>;
    protected startPlugins(contributionsByHost: Map<PluginHost, PluginContributions[]>, toDisconnect: DisposableCollection): Promise<void>;
    protected obtainManager(host: string, hostContributions: PluginContributions[], toDisconnect: DisposableCollection): Promise<PluginManagerExt | undefined>;
    protected initRpc(host: PluginHost, pluginId: string): RPCProtocol;
    protected createServerRpc(pluginHostId: string): RPCProtocol;
    protected updateStoragePath(): Promise<void>;
    protected getStoragePath(): Promise<string | undefined>;
    protected getHostGlobalStoragePath(): Promise<string>;
    activateByEvent(activationEvent: string): Promise<void>;
    activateByViewContainer(viewContainerId: string): Promise<void>;
    activateByView(viewId: string): Promise<void>;
    activateByLanguage(languageId: string): Promise<void>;
    activateByCommand(commandId: string): Promise<void>;
    activateByTaskType(taskType: string): Promise<void>;
    activateByCustomEditor(viewType: string): Promise<void>;
    activateByNotebook(viewType: string): Promise<void>;
    activateByFileSystem(event: FileSystemProviderActivationEvent): Promise<void>;
    activateByTerminalProfile(profileId: string): Promise<void>;
    protected ensureFileSystemActivation(event: FileSystemProviderActivationEvent): void;
    protected ensureCommandHandlerRegistration(event: WillExecuteCommandEvent): void;
    protected ensureTaskActivation(event: WillResolveTaskProvider): void;
    protected ensureDebugActivation(event: WaitUntilEvent, activationEvent?: DebugActivationEvent, debugType?: string): void;
    activateByDebug(activationEvent?: DebugActivationEvent, debugType?: string): Promise<void>;
    protected activateByWorkspaceContains(manager: PluginManagerExt, plugin: DeployedPlugin): Promise<void>;
    activatePlugin(id: string): Promise<void>;
    protected measure(name: string): Measurement;
    protected getPluginCount(plugins: number): string;
    protected readonly webviewsToRestore: Map<string, WebviewWidget>;
    protected readonly webviewRevivers: Map<string, (webview: WebviewWidget) => Promise<void>>;
    registerWebviewReviver(viewType: string, reviver: (webview: WebviewWidget) => Promise<void>): void;
    unregisterWebviewReviver(viewType: string): void;
    protected preserveWebviews(): Promise<void>;
    protected preserveWebview(webview: WebviewWidget): void;
    protected restoreWebview(webview: WebviewWidget): Promise<void>;
    protected getDeserializationFailedContents(message: string): string;
}
export declare class PluginContributions extends DisposableCollection {
    readonly plugin: DeployedPlugin;
    constructor(plugin: DeployedPlugin);
    state: PluginContributions.State;
}
export declare namespace PluginContributions {
    enum State {
        INITIALIZING = 0,
        LOADING = 1,
        LOADED = 2,
        STARTING = 3,
        STARTED = 4
    }
}
//# sourceMappingURL=hosted-plugin.d.ts.map