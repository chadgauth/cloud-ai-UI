import { PluginContribution, DeployedPlugin } from '../../common';
import { LabelProviderContribution } from '@theia/core/lib/browser';
import { PreferenceSchemaProperties } from '@theia/core/lib/browser/preferences';
import { MonacoSnippetSuggestProvider } from '@theia/monaco/lib/browser/monaco-snippet-suggest-provider';
import { PluginSharedStyle } from './plugin-shared-style';
import { CommandRegistry, Command, CommandHandler } from '@theia/core/lib/common/command';
import { Disposable } from '@theia/core/lib/common/disposable';
import { Emitter } from '@theia/core/lib/common/event';
import { TaskDefinitionRegistry, ProblemMatcherRegistry, ProblemPatternRegistry } from '@theia/task/lib/browser';
import { NotebookRendererRegistry, NotebookTypeRegistry } from '@theia/notebook/lib/browser';
import { PluginDebugService } from './debug/plugin-debug-service';
import { DebugSchemaUpdater } from '@theia/debug/lib/browser/debug-schema-updater';
import { MonacoThemingService } from '@theia/monaco/lib/browser/monaco-theming-service';
import { ColorRegistry } from '@theia/core/lib/browser/color-registry';
import { PluginIconThemeService } from './plugin-icon-theme-service';
import { ContributionProvider } from '@theia/core/lib/common';
import { TerminalProfileStore } from '@theia/terminal/lib/browser/terminal-profile-service';
import { TerminalService } from '@theia/terminal/lib/browser/base/terminal-service';
import { PluginTerminalRegistry } from './plugin-terminal-registry';
import { ContextKeyService } from '@theia/core/lib/browser/context-key-service';
export declare class PluginContributionHandler {
    private injections;
    private readonly grammarsRegistry;
    private readonly viewRegistry;
    private readonly customEditorRegistry;
    private readonly menusContributionHandler;
    private readonly preferenceSchemaProvider;
    private readonly preferenceOverrideService;
    private readonly monacoTextmateService;
    private readonly keybindingsContributionHandler;
    protected readonly snippetSuggestProvider: MonacoSnippetSuggestProvider;
    protected readonly commands: CommandRegistry;
    protected readonly style: PluginSharedStyle;
    protected readonly taskDefinitionRegistry: TaskDefinitionRegistry;
    protected readonly problemMatcherRegistry: ProblemMatcherRegistry;
    protected readonly problemPatternRegistry: ProblemPatternRegistry;
    protected readonly debugService: PluginDebugService;
    protected readonly debugSchema: DebugSchemaUpdater;
    protected readonly monacoThemingService: MonacoThemingService;
    protected readonly colors: ColorRegistry;
    protected readonly iconThemeService: PluginIconThemeService;
    protected readonly terminalService: TerminalService;
    protected readonly pluginTerminalRegistry: PluginTerminalRegistry;
    protected readonly contributedProfileStore: TerminalProfileStore;
    protected readonly notebookTypeRegistry: NotebookTypeRegistry;
    protected readonly notebookRendererRegistry: NotebookRendererRegistry;
    protected readonly contributionProvider: ContributionProvider<LabelProviderContribution>;
    protected readonly contextKeyService: ContextKeyService;
    protected readonly commandHandlers: Map<string, ((...args: any[]) => any) | undefined>;
    protected readonly onDidRegisterCommandHandlerEmitter: Emitter<string>;
    readonly onDidRegisterCommandHandler: import("@theia/core/lib/common").Event<string>;
    /**
     * Always synchronous in order to simplify handling disconnections.
     * @throws never, loading of each contribution should handle errors
     * in order to avoid preventing loading of other contributions or extensions
     */
    handleContributions(clientId: string, plugin: DeployedPlugin): Disposable;
    protected registerCommands(contribution: PluginContribution): Disposable;
    registerCommand(command: Command, enablement?: string): Disposable;
    registerCommandHandler(id: string, execute: CommandHandler['execute']): Disposable;
    hasCommand(id: string): boolean;
    hasCommandHandler(id: string): boolean;
    protected updateDefaultOverridesSchema(configurationDefaults: PreferenceSchemaProperties): Disposable;
    private createRegex;
    private convertIndentationRules;
    private convertFolding;
    private convertTokenTypes;
    private convertEmbeddedLanguages;
    private convertOnEnterRules;
    private createEnterAction;
}
//# sourceMappingURL=plugin-contribution-handler.d.ts.map