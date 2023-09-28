import { PluginDeployerEntry, PluginDeployer, PluginDeployerParticipant, PluginDeployerHandler, PluginType, UnresolvedPluginEntry, PluginIdentifiers, PluginDeployOptions } from '../../common/plugin-protocol';
import { ILogger, Emitter, ContributionProvider } from '@theia/core';
import { PluginCliContribution } from './plugin-cli-contribution';
import { Measurement, Stopwatch } from '@theia/core/lib/common';
export declare class PluginDeployerImpl implements PluginDeployer {
    protected readonly onDidDeployEmitter: Emitter<void>;
    readonly onDidDeploy: import("@theia/core").Event<void>;
    protected readonly logger: ILogger;
    protected readonly pluginDeployerHandler: PluginDeployerHandler;
    protected readonly cliContribution: PluginCliContribution;
    protected readonly stopwatch: Stopwatch;
    /**
     * Inject all plugin resolvers found at runtime.
     */
    private pluginResolvers;
    /**
     * Inject all file handler for local resolved plugins.
     */
    private pluginDeployerFileHandlers;
    /**
     * Inject all directory handler for local resolved plugins.
     */
    private pluginDeployerDirectoryHandlers;
    protected readonly participants: ContributionProvider<PluginDeployerParticipant>;
    start(): void;
    initResolvers(): Promise<Array<void>>;
    protected doStart(): Promise<void>;
    uninstall(pluginId: PluginIdentifiers.VersionedId): Promise<void>;
    undeploy(pluginId: PluginIdentifiers.VersionedId): Promise<void>;
    deploy(plugin: UnresolvedPluginEntry, options?: PluginDeployOptions): Promise<number>;
    protected deployMultipleEntries(plugins: UnresolvedPluginEntry[], options?: PluginDeployOptions): Promise<number>;
    /**
     * Resolves plugins for the given type.
     *
     * Only call it a single time before triggering a single deploy to prevent re-resolving of extension dependencies, i.e.
     * ```ts
     * const deployer: PluginDeployer;
     * deployer.deployPlugins(await deployer.resolvePlugins(allPluginEntries));
     * ```
     */
    resolvePlugins(plugins: UnresolvedPluginEntry[], options?: PluginDeployOptions): Promise<PluginDeployerEntry[]>;
    protected resolveAndHandle(id: string, type: PluginType, options?: PluginDeployOptions): Promise<PluginDeployerEntry[]>;
    protected findBestVersion(unversionedId: PluginIdentifiers.UnversionedId, versions: string[], knownPlugins: Map<PluginIdentifiers.VersionedId, PluginDeployerEntry>): void;
    /**
     * deploy all plugins that have been accepted
     */
    deployPlugins(pluginsToDeploy: PluginDeployerEntry[]): Promise<number>;
    /**
     * If there are some single files, try to see if we can work on these files (like unpacking it, etc)
     */
    applyFileHandlers(pluginDeployerEntries: PluginDeployerEntry[]): Promise<void>;
    /**
     * Check for all registered directories to see if there are some plugins that can be accepted to be deployed.
     */
    applyDirectoryFileHandlers(pluginDeployerEntries: PluginDeployerEntry[]): Promise<void>;
    /**
     * Check a plugin ID see if there are some resolvers that can handle it. If there is a matching resolver, then we resolve the plugin
     */
    resolvePlugin(pluginId: string, type?: PluginType, options?: PluginDeployOptions): Promise<PluginDeployerEntry[]>;
    protected measure(name: string): Measurement;
}
//# sourceMappingURL=plugin-deployer-impl.d.ts.map