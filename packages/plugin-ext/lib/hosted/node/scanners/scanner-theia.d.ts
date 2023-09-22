import { IconThemeContribution, IconUrl, PluginCommand, PluginContribution, PluginEngine, PluginLifecycle, PluginModel, PluginPackage, PluginPackageCommand, PluginScanner, PluginTaskDefinitionContribution, SnippetContribution, ThemeContribution, PluginPackageLocalization, Localization, PluginPackageTranslation, Translation, TerminalProfile } from '../../../common/plugin-protocol';
import { IJSONSchema } from '@theia/core/lib/common/json-schema';
import { ColorDefinition } from '@theia/core/lib/common/color';
import { PluginUriFactory } from './plugin-uri-factory';
export declare class TheiaPluginScanner implements PluginScanner {
    private readonly _apiType;
    private readonly grammarsReader;
    protected readonly pluginUriFactory: PluginUriFactory;
    get apiType(): PluginEngine;
    getModel(plugin: PluginPackage): PluginModel;
    getLifecycle(plugin: PluginPackage): PluginLifecycle;
    getDependencies(rawPlugin: PluginPackage): Map<string, string> | undefined;
    getContribution(rawPlugin: PluginPackage): Promise<PluginContribution | undefined>;
    protected readTerminals(pck: PluginPackage): TerminalProfile[] | undefined;
    protected readLocalizations(pck: PluginPackage): Promise<Localization[] | undefined>;
    protected readLocalization({ languageId, languageName, localizedLanguageName, translations }: PluginPackageLocalization, pluginPath: string): Promise<Localization>;
    protected readTranslation(packageTranslation: PluginPackageTranslation, pluginPath: string): Promise<Translation>;
    protected readCommand({ command, title, original, category, icon, enablement }: PluginPackageCommand, pck: PluginPackage): PluginCommand;
    protected transformIconUrl(plugin: PluginPackage, original?: IconUrl): {
        iconUrl?: IconUrl;
        themeIcon?: string;
    } | undefined;
    protected toPluginUrl(pck: PluginPackage, relativePath: string): string;
    protected readColors(pck: PluginPackage): ColorDefinition[] | undefined;
    protected readThemes(pck: PluginPackage): ThemeContribution[] | undefined;
    protected readIconThemes(pck: PluginPackage): IconThemeContribution[] | undefined;
    protected readSnippets(pck: PluginPackage): SnippetContribution[] | undefined;
    protected readJson<T>(filePath: string): Promise<T | undefined>;
    protected readFile(filePath: string): Promise<string>;
    private readConfiguration;
    private readKeybinding;
    private readCustomEditors;
    private readCustomEditor;
    private readViewsContainers;
    private readViewContainer;
    private readViews;
    private readView;
    private readViewsWelcome;
    private readViewWelcome;
    private extractPluginViewsIds;
    private readMenus;
    private readMenu;
    private readLanguages;
    private readSubmenus;
    private readSubmenu;
    private readLanguage;
    private readDebuggers;
    private readDebugger;
    private readTaskDefinition;
    protected toSchema(definition: PluginTaskDefinitionContribution): IJSONSchema;
    protected resolveSchemaAttributes(type: string, configurationAttributes: {
        [request: string]: IJSONSchema;
    }): IJSONSchema[];
    private extractValidAutoClosingPairs;
    private extractValidSurroundingPairs;
}
//# sourceMappingURL=scanner-theia.d.ts.map