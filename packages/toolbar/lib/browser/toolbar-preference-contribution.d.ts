import { PreferenceSchema, PreferenceProxy } from '@theia/core/lib/browser';
export declare const TOOLBAR_ENABLE_PREFERENCE_ID = "toolbar.showToolbar";
export declare const ToolbarPreferencesSchema: PreferenceSchema;
declare class ToolbarPreferencesContribution {
    [TOOLBAR_ENABLE_PREFERENCE_ID]: boolean;
}
export declare const ToolbarPreferences: unique symbol;
export declare type ToolbarPreferences = PreferenceProxy<ToolbarPreferencesContribution>;
export {};
//# sourceMappingURL=toolbar-preference-contribution.d.ts.map