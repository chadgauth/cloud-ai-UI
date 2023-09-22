import { interfaces } from '@theia/core/shared/inversify';
import { PreferenceProxy, PreferenceService, PreferenceSchema } from '@theia/core/lib/browser/preferences';
export declare const GettingStartedPreferenceSchema: PreferenceSchema;
export interface GettingStartedConfiguration {
    'workbench.startupEditor': string;
}
export declare const GettingStartedPreferenceContribution: unique symbol;
export declare const GettingStartedPreferences: unique symbol;
export declare type GettingStartedPreferences = PreferenceProxy<GettingStartedConfiguration>;
export declare function createGettingStartedPreferences(preferences: PreferenceService, schema?: PreferenceSchema): GettingStartedPreferences;
export declare function bindGettingStartedPreferences(bind: interfaces.Bind): void;
//# sourceMappingURL=getting-started-preferences.d.ts.map