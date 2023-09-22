import { TheiaApp } from './theia-app';
import { TheiaView } from './theia-view';
export declare const PreferenceIds: {
    Editor: {
        AutoSave: string;
        RenderWhitespace: string;
    };
    Explorer: {
        AutoReveal: string;
    };
    DiffEditor: {
        MaxComputationTime: string;
    };
};
export declare const DefaultPreferences: {
    Editor: {
        AutoSave: {
            Off: string;
            AfterDelay: string;
            OnFocusChange: string;
            OnWindowChange: string;
        };
        RenderWhitespace: {
            None: string;
            Boundary: string;
            Selection: string;
            Trailing: string;
            All: string;
        };
    };
    Explorer: {
        AutoReveal: {
            Enabled: boolean;
        };
    };
    DiffEditor: {
        MaxComputationTime: string;
    };
};
export declare enum TheiaPreferenceScope {
    User = "User",
    Workspace = "Workspace"
}
export declare class TheiaPreferenceView extends TheiaView {
    customTimeout?: number;
    protected modificationIndicator: string;
    protected optionSelectLabel: string;
    protected optionSelectDropdown: string;
    protected optionSelectDropdownValue: string;
    constructor(app: TheiaApp);
    open(preferenceScope?: TheiaPreferenceScope): Promise<TheiaView>;
    protected getScopeSelector(scope: TheiaPreferenceScope): string;
    openPreferenceScope(scope: TheiaPreferenceScope): Promise<void>;
    getBooleanPreferenceByPath(sectionTitle: string, name: string): Promise<boolean>;
    getBooleanPreferenceById(preferenceId: string): Promise<boolean>;
    setBooleanPreferenceByPath(sectionTitle: string, name: string, value: boolean): Promise<void>;
    setBooleanPreferenceById(preferenceId: string, value: boolean): Promise<void>;
    getStringPreferenceByPath(sectionTitle: string, name: string): Promise<string>;
    getStringPreferenceById(preferenceId: string): Promise<string>;
    setStringPreferenceByPath(sectionTitle: string, name: string, value: string): Promise<void>;
    setStringPreferenceById(preferenceId: string, value: string): Promise<void>;
    getOptionsPreferenceByPath(sectionTitle: string, name: string): Promise<string>;
    getOptionsPreferenceById(preferenceId: string): Promise<string>;
    setOptionsPreferenceByPath(sectionTitle: string, name: string, value: string): Promise<void>;
    setOptionsPreferenceById(preferenceId: string, value: string): Promise<void>;
    resetPreferenceByPath(sectionTitle: string, name: string): Promise<void>;
    resetPreferenceById(preferenceId: string): Promise<void>;
    private findPreferenceId;
    private findPreferenceEditorById;
    private getPreferenceSelector;
    private getPreferenceEditorSelector;
    private findPreferenceResetButton;
    waitForModified(preferenceId: string): Promise<void>;
    waitForUnmodified(preferenceId: string): Promise<void>;
    private getPreferenceGutterSelector;
}
//# sourceMappingURL=theia-preference-view.d.ts.map