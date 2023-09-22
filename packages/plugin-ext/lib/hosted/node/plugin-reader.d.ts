/// <reference types="express" />
import * as express from '@theia/core/shared/express';
import { ILogger } from '@theia/core';
import { BackendApplicationContribution } from '@theia/core/lib/node/backend-application';
import { PluginMetadata, PluginPackage, PluginContribution } from '../../common/plugin-protocol';
import { MetadataScanner } from './metadata-scanner';
export declare class HostedPluginReader implements BackendApplicationContribution {
    protected readonly logger: ILogger;
    protected readonly scanner: MetadataScanner;
    private readonly metadataProcessors;
    /**
     * Map between a plugin id and its local storage
     */
    protected pluginsIdsFiles: Map<string, string>;
    configure(app: express.Application): void;
    protected handleMissingResource(req: express.Request, res: express.Response): Promise<void>;
    /**
     * @throws never
     */
    getPluginMetadata(pluginPath: string | undefined): Promise<PluginMetadata | undefined>;
    readPackage(pluginPath: string | undefined): Promise<PluginPackage | undefined>;
    readMetadata(plugin: PluginPackage): PluginMetadata;
    readContribution(plugin: PluginPackage): Promise<PluginContribution | undefined>;
    readDependencies(plugin: PluginPackage): Map<string, string> | undefined;
}
//# sourceMappingURL=plugin-reader.d.ts.map