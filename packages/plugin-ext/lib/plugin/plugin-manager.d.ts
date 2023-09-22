import { PluginManagerExt, PluginManager, Plugin, PluginAPI, ConfigStorage, PluginManagerInitializeParams, PluginManagerStartParams, TerminalServiceExt, LocalizationExt } from '../common/plugin-api-rpc';
import { PluginMetadata, PluginJsonValidationContribution } from '../common/plugin-protocol';
import * as theia from '@theia/plugin';
import { EnvExtImpl } from './env';
import { PreferenceRegistryExtImpl } from './preference-registry';
import { KeyValueStorageProxy } from './plugin-storage';
import { ExtPluginApi } from '../common/plugin-ext-api-contribution';
import { RPCProtocol } from '../common/rpc-protocol';
import { WebviewsExtImpl } from './webviews';
import { SecretsExtImpl } from '../plugin/secrets-ext';
import { Deferred } from '@theia/core/lib/common/promise-util';
export interface PluginHost {
    loadPlugin(plugin: Plugin): any;
    init(data: PluginMetadata[]): Promise<[Plugin[], Plugin[]]> | [Plugin[], Plugin[]];
    initExtApi(extApi: ExtPluginApi[]): void;
    loadTests?(): Promise<void>;
}
interface StopFn {
    (): void | Promise<void>;
}
interface StopOptions {
    /**
     * if terminating then stopping will ignore all errors,
     * since the main side is already gone and any requests are likely to fail
     * or hang
     */
    terminating: boolean;
}
declare class ActivatedPlugin {
    readonly pluginContext: theia.PluginContext;
    readonly exports?: PluginAPI | undefined;
    readonly stopFn?: StopFn | undefined;
    constructor(pluginContext: theia.PluginContext, exports?: PluginAPI | undefined, stopFn?: StopFn | undefined);
}
export declare class PluginManagerExtImpl implements PluginManagerExt, PluginManager {
    private readonly host;
    private readonly envExt;
    private readonly terminalService;
    private readonly storageProxy;
    private readonly secrets;
    private readonly preferencesManager;
    private readonly webview;
    private readonly localization;
    private readonly rpc;
    static SUPPORTED_ACTIVATION_EVENTS: Set<string>;
    private configStorage;
    private readonly registry;
    private readonly activations;
    /** promises to whether loading each plugin has been successful */
    private readonly loadedPlugins;
    private readonly activatedPlugins;
    private readonly pluginContextsMap;
    private onDidChangeEmitter;
    private messageRegistryProxy;
    private notificationMain;
    protected fireOnDidChange(): void;
    protected jsonValidation: PluginJsonValidationContribution[];
    protected ready: Deferred<void>;
    constructor(host: PluginHost, envExt: EnvExtImpl, terminalService: TerminalServiceExt, storageProxy: KeyValueStorageProxy, secrets: SecretsExtImpl, preferencesManager: PreferenceRegistryExtImpl, webview: WebviewsExtImpl, localization: LocalizationExt, rpc: RPCProtocol);
    $stop(pluginId?: string): Promise<void>;
    terminate(): Promise<void>;
    protected stopAll(options?: StopOptions): Promise<void>;
    protected stopPlugin(id: string, plugin: ActivatedPlugin, options?: StopOptions): Promise<void>;
    $init(params: PluginManagerInitializeParams): Promise<void>;
    $start(params: PluginManagerStartParams): Promise<void>;
    protected registerPlugin(plugin: Plugin): void;
    protected setActivation(activationEvent: string, activation: () => Promise<void>): void;
    protected loadPlugin(plugin: Plugin, configStorage: ConfigStorage, visited?: Set<string>): Promise<boolean>;
    $updateStoragePath(path: string | undefined): Promise<void>;
    $activateByEvent(activationEvent: string): Promise<void>;
    protected activateByBaseEvent(baseEvent: string): Promise<void>;
    protected activateBySingleEvent(activationEvent: string): Promise<void>;
    $activatePlugin(id: string): Promise<void>;
    private startPlugin;
    getAllPlugins(): Plugin[];
    getPluginExport(pluginId: string): PluginAPI | undefined;
    getPluginById(pluginId: string): Plugin | undefined;
    isRunning(pluginId: string): boolean;
    isActive(pluginId: string): boolean;
    activatePlugin(pluginId: string): PromiseLike<void>;
    get onDidChange(): theia.Event<void>;
}
export {};
//# sourceMappingURL=plugin-manager.d.ts.map