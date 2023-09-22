import { interfaces } from '@theia/core/shared/inversify';
import { PreferenceProxy, PreferenceService, PreferenceSchema } from '@theia/core/lib/browser';
export declare const HostedPluginConfigSchema: PreferenceSchema;
export interface HostedPluginConfiguration {
    'hosted-plugin.watchMode': boolean;
    'hosted-plugin.debugMode': string;
    'hosted-plugin.launchOutFiles': string[];
}
export declare const HostedPluginPreferenceContribution: unique symbol;
export declare const HostedPluginPreferences: unique symbol;
export declare type HostedPluginPreferences = PreferenceProxy<HostedPluginConfiguration>;
export declare function createNavigatorPreferences(preferences: PreferenceService, schema?: PreferenceSchema): HostedPluginPreferences;
export declare function bindHostedPluginPreferences(bind: interfaces.Bind): void;
//# sourceMappingURL=hosted-plugin-preferences.d.ts.map