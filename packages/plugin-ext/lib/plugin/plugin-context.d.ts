import type * as theia from '@theia/plugin';
import { Plugin as InternalPlugin, PluginManager, PluginAPIFactory } from '../common/plugin-api-rpc';
import { RPCProtocol } from '../common/rpc-protocol';
import { MessageRegistryExt } from './message-registry';
import { WorkspaceExtImpl } from './workspace';
import { EnvExtImpl } from './env';
import { ExtensionKind } from './types-impl';
import { EditorsAndDocumentsExtImpl } from './editors-and-documents';
import { PreferenceRegistryExtImpl } from './preference-registry';
import { DebugExtImpl } from './debug/debug-ext';
import { ClipboardExt } from './clipboard-ext';
import { WebviewsExtImpl } from './webviews';
import { LocalizationExtImpl } from './localization-ext';
export declare function createAPIFactory(rpc: RPCProtocol, pluginManager: PluginManager, envExt: EnvExtImpl, debugExt: DebugExtImpl, preferenceRegistryExt: PreferenceRegistryExtImpl, editorsAndDocumentsExt: EditorsAndDocumentsExtImpl, workspaceExt: WorkspaceExtImpl, messageRegistryExt: MessageRegistryExt, clipboard: ClipboardExt, webviewExt: WebviewsExtImpl, localizationExt: LocalizationExtImpl): PluginAPIFactory;
/**
 * Represents a Theia plugin as well as a VSCode extension.
 */
export interface ExtensionPlugin<T> extends theia.Plugin<T> {
    /**
     * The uri of the directory containing the extension. Same as {@linkcode theia.Plugin.pluginUri}.
     */
    readonly extensionUri: theia.Uri;
    /**
     * The absolute file path of the directory containing this extension.
     * Same as {@linkcode theia.Plugin.pluginPath}.
     */
    readonly extensionPath: string;
    /**
     * The extension kind describes if an extension runs where the UI runs
     * or if an extension runs where the remote extension host runs. The extension kind
     * is defined in the `package.json`-file of extensions. When no remote extension host exists,
     * the value is {@linkcode ExtensionKind.UI}.
     */
    extensionKind: theia.ExtensionKind;
}
export declare class Plugin<T> implements theia.Plugin<T> {
    #private;
    id: string;
    pluginPath: string;
    pluginUri: theia.Uri;
    packageJSON: any;
    pluginType: theia.PluginType;
    constructor(pluginManager: PluginManager, plugin: InternalPlugin);
    get isActive(): boolean;
    get exports(): T;
    activate(): PromiseLike<T>;
}
export declare class PluginExt<T> extends Plugin<T> implements ExtensionPlugin<T> {
    #private;
    extensionPath: string;
    extensionUri: theia.Uri;
    extensionKind: ExtensionKind;
    isFromDifferentExtensionHost: boolean;
    constructor(pluginManager: PluginManager, plugin: InternalPlugin, isFromDifferentExtensionHost?: boolean);
    get isActive(): boolean;
    get exports(): T;
    activate(): PromiseLike<T>;
}
//# sourceMappingURL=plugin-context.d.ts.map