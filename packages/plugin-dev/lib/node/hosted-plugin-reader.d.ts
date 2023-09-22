import { BackendApplicationContribution } from '@theia/core/lib/node/backend-application';
import { HostedPluginReader as PluginReaderHosted } from '@theia/plugin-ext/lib/hosted/node/plugin-reader';
import { PluginMetadata } from '@theia/plugin-ext/lib/common/plugin-protocol';
import { HostedPluginDeployerHandler } from '@theia/plugin-ext/lib/hosted/node/hosted-plugin-deployer-handler';
export declare class HostedPluginReader implements BackendApplicationContribution {
    protected pluginReader: PluginReaderHosted;
    private readonly hostedPlugin;
    protected deployerHandler: HostedPluginDeployerHandler;
    initialize(): Promise<void>;
    getPlugin(): Promise<PluginMetadata | undefined>;
}
//# sourceMappingURL=hosted-plugin-reader.d.ts.map