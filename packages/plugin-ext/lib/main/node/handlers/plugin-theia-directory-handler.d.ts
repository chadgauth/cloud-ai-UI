import type { URI } from '@theia/core';
import { Deferred } from '@theia/core/lib/common/promise-util';
import { PluginDeployerDirectoryHandler, PluginDeployerEntry, PluginDeployerDirectoryHandlerContext } from '../../../common/plugin-protocol';
import { PluginCliContribution } from '../plugin-cli-contribution';
export declare class PluginTheiaDirectoryHandler implements PluginDeployerDirectoryHandler {
    protected readonly deploymentDirectory: Deferred<URI>;
    protected readonly pluginCli: PluginCliContribution;
    constructor();
    accept(resolvedPlugin: PluginDeployerEntry): Promise<boolean>;
    handle(context: PluginDeployerDirectoryHandlerContext): Promise<void>;
    protected copyDirectory(context: PluginDeployerDirectoryHandlerContext): Promise<void>;
    protected getExtensionDir(context: PluginDeployerDirectoryHandlerContext): Promise<string>;
}
//# sourceMappingURL=plugin-theia-directory-handler.d.ts.map