import { OutputChannelRegistryMainImpl } from '@theia/plugin-ext/lib/main/browser/output-channel-registry-main';
import { PluginMetricsCreator } from './plugin-metrics-creator';
import { PluginInfo } from '@theia/plugin-ext/lib/common/plugin-api-rpc';
export declare class PluginMetricsOutputChannelRegistry extends OutputChannelRegistryMainImpl {
    protected readonly pluginMetricsCreator: PluginMetricsCreator;
    $append(channelName: string, errorOrValue: string, pluginInfo: PluginInfo): PromiseLike<void>;
}
//# sourceMappingURL=plugin-metrics-output-registry.d.ts.map