import { PluginDeployerFileHandler, PluginDeployerEntry, PluginDeployerFileHandlerContext } from '@theia/plugin-ext';
import { PluginVSCodeEnvironment } from '../common/plugin-vscode-environment';
export declare const isVSCodePluginFile: (pluginPath?: string | undefined) => boolean;
export declare class PluginVsCodeFileHandler implements PluginDeployerFileHandler {
    protected readonly environment: PluginVSCodeEnvironment;
    private readonly systemExtensionsDirUri;
    constructor();
    accept(resolvedPlugin: PluginDeployerEntry): Promise<boolean>;
    handle(context: PluginDeployerFileHandlerContext): Promise<void>;
    protected getExtensionDir(context: PluginDeployerFileHandlerContext): Promise<string>;
    protected decompress(extensionDir: string, context: PluginDeployerFileHandlerContext): Promise<void>;
}
//# sourceMappingURL=plugin-vscode-file-handler.d.ts.map