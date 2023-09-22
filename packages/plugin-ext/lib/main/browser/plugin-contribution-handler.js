"use strict";
// *****************************************************************************
// Copyright (C) 2018 Red Hat, Inc. and others.
//
// This program and the accompanying materials are made available under the
// terms of the Eclipse Public License v. 2.0 which is available at
// http://www.eclipse.org/legal/epl-2.0.
//
// This Source Code may also be made available under the following Secondary
// Licenses when the conditions for such availability set forth in the Eclipse
// Public License v. 2.0 are satisfied: GNU General Public License, version 2
// with the GNU Classpath Exception which is available at
// https://www.gnu.org/software/classpath/license.html.
//
// SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0
// *****************************************************************************
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginContributionHandler = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const textmate_1 = require("@theia/monaco/lib/browser/textmate");
const menus_contribution_handler_1 = require("./menus/menus-contribution-handler");
const plugin_view_registry_1 = require("./view/plugin-view-registry");
const plugin_custom_editor_registry_1 = require("./custom-editors/plugin-custom-editor-registry");
const common_1 = require("../../common");
const browser_1 = require("@theia/core/lib/browser");
const preferences_1 = require("@theia/core/lib/browser/preferences");
const keybindings_contribution_handler_1 = require("./keybindings/keybindings-contribution-handler");
const monaco_snippet_suggest_provider_1 = require("@theia/monaco/lib/browser/monaco-snippet-suggest-provider");
const plugin_shared_style_1 = require("./plugin-shared-style");
const command_1 = require("@theia/core/lib/common/command");
const disposable_1 = require("@theia/core/lib/common/disposable");
const event_1 = require("@theia/core/lib/common/event");
const browser_2 = require("@theia/task/lib/browser");
const browser_3 = require("@theia/notebook/lib/browser");
const plugin_debug_service_1 = require("./debug/plugin-debug-service");
const debug_schema_updater_1 = require("@theia/debug/lib/browser/debug-schema-updater");
const monaco_theming_service_1 = require("@theia/monaco/lib/browser/monaco-theming-service");
const color_registry_1 = require("@theia/core/lib/browser/color-registry");
const plugin_icon_theme_service_1 = require("./plugin-icon-theme-service");
const common_2 = require("@theia/core/lib/common");
const monaco = require("@theia/monaco-editor-core");
const themeService_1 = require("@theia/monaco-editor-core/esm/vs/platform/theme/common/themeService");
const terminal_profile_service_1 = require("@theia/terminal/lib/browser/terminal-profile-service");
const terminal_service_1 = require("@theia/terminal/lib/browser/base/terminal-service");
const plugin_terminal_registry_1 = require("./plugin-terminal-registry");
const context_key_service_1 = require("@theia/core/lib/browser/context-key-service");
let PluginContributionHandler = class PluginContributionHandler {
    constructor() {
        this.injections = new Map();
        this.commandHandlers = new Map();
        this.onDidRegisterCommandHandlerEmitter = new event_1.Emitter();
        this.onDidRegisterCommandHandler = this.onDidRegisterCommandHandlerEmitter.event;
    }
    /**
     * Always synchronous in order to simplify handling disconnections.
     * @throws never, loading of each contribution should handle errors
     * in order to avoid preventing loading of other contributions or extensions
     */
    handleContributions(clientId, plugin) {
        const contributions = plugin.contributes;
        if (!contributions) {
            return disposable_1.Disposable.NULL;
        }
        const toDispose = new disposable_1.DisposableCollection(disposable_1.Disposable.create(() => { }));
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const logError = (message, ...args) => console.error(`[${clientId}][${plugin.metadata.model.id}]: ${message}`, ...args);
        const logWarning = (message, ...args) => console.warn(`[${clientId}][${plugin.metadata.model.id}]: ${message}`, ...args);
        const pushContribution = (id, contribute) => {
            if (toDispose.disposed) {
                return;
            }
            try {
                toDispose.push(contribute());
            }
            catch (e) {
                logError(`Failed to load '${id}' contribution.`, e);
            }
        };
        const configuration = contributions.configuration;
        if (configuration) {
            for (const config of configuration) {
                pushContribution('configuration', () => this.preferenceSchemaProvider.setSchema(config));
            }
        }
        const configurationDefaults = contributions.configurationDefaults;
        if (configurationDefaults) {
            pushContribution('configurationDefaults', () => this.updateDefaultOverridesSchema(configurationDefaults));
        }
        const languages = contributions.languages;
        if (languages && languages.length) {
            for (const lang of languages) {
                // it is not possible to unregister a language
                monaco.languages.register({
                    id: lang.id,
                    aliases: lang.aliases,
                    extensions: lang.extensions,
                    filenamePatterns: lang.filenamePatterns,
                    filenames: lang.filenames,
                    firstLine: lang.firstLine,
                    mimetypes: lang.mimetypes
                });
                const langConfiguration = lang.configuration;
                if (langConfiguration) {
                    pushContribution(`language.${lang.id}.configuration`, () => monaco.languages.setLanguageConfiguration(lang.id, {
                        wordPattern: this.createRegex(langConfiguration.wordPattern),
                        autoClosingPairs: langConfiguration.autoClosingPairs,
                        brackets: langConfiguration.brackets,
                        comments: langConfiguration.comments,
                        folding: this.convertFolding(langConfiguration.folding),
                        surroundingPairs: langConfiguration.surroundingPairs,
                        indentationRules: this.convertIndentationRules(langConfiguration.indentationRules),
                        onEnterRules: this.convertOnEnterRules(langConfiguration.onEnterRules),
                    }));
                }
            }
        }
        const grammars = contributions.grammars;
        if (grammars && grammars.length) {
            const grammarsWithLanguage = [];
            for (const grammar of grammars) {
                if (grammar.injectTo) {
                    for (const injectScope of grammar.injectTo) {
                        pushContribution(`grammar.injectTo.${injectScope}`, () => {
                            const injections = this.injections.get(injectScope) || [];
                            injections.push(grammar.scope);
                            this.injections.set(injectScope, injections);
                            return disposable_1.Disposable.create(() => {
                                const index = injections.indexOf(grammar.scope);
                                if (index !== -1) {
                                    injections.splice(index, 1);
                                }
                            });
                        });
                    }
                }
                if (grammar.language) {
                    // processing is deferred.
                    grammarsWithLanguage.push(grammar);
                }
                pushContribution(`grammar.textmate.scope.${grammar.scope}`, () => this.grammarsRegistry.registerTextmateGrammarScope(grammar.scope, {
                    async getGrammarDefinition() {
                        return {
                            format: grammar.format,
                            content: grammar.grammar || '',
                            location: grammar.grammarLocation
                        };
                    },
                    getInjections: (scopeName) => this.injections.get(scopeName)
                }));
            }
            // load grammars on next tick to await registration of languages from all plugins in current tick
            // see https://github.com/eclipse-theia/theia/issues/6907#issuecomment-578600243
            setTimeout(() => {
                for (const grammar of grammarsWithLanguage) {
                    const language = grammar.language;
                    pushContribution(`grammar.language.${language}.scope`, () => this.grammarsRegistry.mapLanguageIdToTextmateGrammar(language, grammar.scope));
                    pushContribution(`grammar.language.${language}.configuration`, () => {
                        var _a;
                        return this.grammarsRegistry.registerGrammarConfiguration(language, {
                            embeddedLanguages: this.convertEmbeddedLanguages(grammar.embeddedLanguages, logWarning),
                            tokenTypes: this.convertTokenTypes(grammar.tokenTypes),
                            balancedBracketSelectors: (_a = grammar.balancedBracketScopes) !== null && _a !== void 0 ? _a : ['*'],
                            unbalancedBracketSelectors: grammar.balancedBracketScopes,
                        });
                    });
                }
                // activate grammars only once everything else is loaded.
                // see https://github.com/eclipse-theia/theia-cpp-extensions/issues/100#issuecomment-610643866
                setTimeout(() => {
                    for (const grammar of grammarsWithLanguage) {
                        const language = grammar.language;
                        pushContribution(`grammar.language.${language}.activation`, () => this.monacoTextmateService.activateLanguage(language));
                    }
                });
            });
        }
        pushContribution('commands', () => this.registerCommands(contributions));
        pushContribution('menus', () => this.menusContributionHandler.handle(plugin));
        pushContribution('keybindings', () => this.keybindingsContributionHandler.handle(contributions));
        if (contributions.customEditors) {
            for (const customEditor of contributions.customEditors) {
                pushContribution(`customEditors.${customEditor.viewType}`, () => this.customEditorRegistry.registerCustomEditor(customEditor));
            }
        }
        if (contributions.viewsContainers) {
            for (const location in contributions.viewsContainers) {
                if (contributions.viewsContainers.hasOwnProperty(location)) {
                    for (const viewContainer of contributions.viewsContainers[location]) {
                        pushContribution(`viewContainers.${viewContainer.id}`, () => this.viewRegistry.registerViewContainer(location, viewContainer));
                    }
                }
            }
        }
        if (contributions.views) {
            // eslint-disable-next-line guard-for-in
            for (const location in contributions.views) {
                for (const view of contributions.views[location]) {
                    pushContribution(`views.${view.id}`, () => this.viewRegistry.registerView(location, view));
                }
            }
        }
        if (contributions.viewsWelcome) {
            for (const [index, viewWelcome] of contributions.viewsWelcome.entries()) {
                pushContribution(`viewsWelcome.${viewWelcome.view}.${index}`, () => this.viewRegistry.registerViewWelcome(viewWelcome));
            }
        }
        if (contributions.snippets) {
            for (const snippet of contributions.snippets) {
                pushContribution(`snippets.${snippet.uri}`, () => this.snippetSuggestProvider.fromURI(snippet.uri, {
                    language: snippet.language,
                    source: snippet.source
                }));
            }
        }
        if (contributions.themes && contributions.themes.length) {
            const pending = {};
            for (const theme of contributions.themes) {
                pushContribution(`themes.${theme.uri}`, () => this.monacoThemingService.register(theme, pending));
            }
        }
        if (contributions.iconThemes && contributions.iconThemes.length) {
            for (const iconTheme of contributions.iconThemes) {
                pushContribution(`iconThemes.${iconTheme.uri}`, () => this.iconThemeService.register(iconTheme, plugin));
            }
        }
        const colors = contributions.colors;
        if (colors) {
            pushContribution('colors', () => this.colors.register(...colors));
        }
        if (contributions.taskDefinitions) {
            for (const taskDefinition of contributions.taskDefinitions) {
                pushContribution(`taskDefinitions.${taskDefinition.taskType}`, () => this.taskDefinitionRegistry.register(taskDefinition));
            }
        }
        if (contributions.problemPatterns) {
            for (const problemPattern of contributions.problemPatterns) {
                pushContribution(`problemPatterns.${problemPattern.name || problemPattern.regexp}`, () => this.problemPatternRegistry.register(problemPattern));
            }
        }
        if (contributions.problemMatchers) {
            for (const problemMatcher of contributions.problemMatchers) {
                pushContribution(`problemMatchers.${problemMatcher.label}`, () => this.problemMatcherRegistry.register(problemMatcher));
            }
        }
        if (contributions.debuggers && contributions.debuggers.length) {
            toDispose.push(disposable_1.Disposable.create(() => this.debugSchema.update()));
            for (const contribution of contributions.debuggers) {
                pushContribution(`debuggers.${contribution.type}`, () => this.debugService.registerDebugger(contribution));
            }
            this.debugSchema.update();
        }
        if (contributions.resourceLabelFormatters) {
            for (const formatter of contributions.resourceLabelFormatters) {
                for (const contribution of this.contributionProvider.getContributions()) {
                    if (contribution instanceof browser_1.DefaultUriLabelProviderContribution) {
                        pushContribution(`resourceLabelFormatters.${formatter.scheme}`, () => contribution.registerFormatter(formatter));
                    }
                }
            }
        }
        const self = this;
        if (contributions.terminalProfiles) {
            for (const profile of contributions.terminalProfiles) {
                pushContribution(`terminalProfiles.${profile.id}`, () => {
                    this.contributedProfileStore.registerTerminalProfile(profile.title, {
                        async start() {
                            const terminalId = await self.pluginTerminalRegistry.start(profile.id);
                            const result = self.terminalService.getById(terminalId);
                            if (!result) {
                                throw new Error(`Error starting terminal from profile ${profile.id}`);
                            }
                            return result;
                        }
                    });
                    return disposable_1.Disposable.create(() => {
                        this.contributedProfileStore.unregisterTerminalProfile(profile.id);
                    });
                });
            }
        }
        if (contributions.notebooks) {
            for (const notebook of contributions.notebooks) {
                pushContribution(`notebook.${notebook.type}`, () => this.notebookTypeRegistry.registerNotebookType(notebook));
            }
        }
        if (contributions.notebookRenderer) {
            for (const renderer of contributions.notebookRenderer) {
                pushContribution(`notebookRenderer.${renderer.id}`, () => this.notebookRendererRegistry.registerNotebookRenderer(renderer, `/hostedPlugin/${(0, common_1.getPluginId)(plugin.metadata.model)}`));
            }
        }
        return toDispose;
    }
    registerCommands(contribution) {
        if (!contribution.commands) {
            return disposable_1.Disposable.NULL;
        }
        const toDispose = new disposable_1.DisposableCollection();
        for (const { iconUrl, themeIcon, command, category, title, originalTitle, enablement } of contribution.commands) {
            const reference = iconUrl && this.style.toIconClass(iconUrl);
            const icon = themeIcon && themeService_1.ThemeIcon.fromString(themeIcon);
            let iconClass;
            if (reference) {
                toDispose.push(reference);
                iconClass = reference.object.iconClass;
            }
            else if (icon) {
                iconClass = themeService_1.ThemeIcon.asClassName(icon);
            }
            toDispose.push(this.registerCommand({ id: command, category, label: title, originalLabel: originalTitle, iconClass }, enablement));
        }
        return toDispose;
    }
    registerCommand(command, enablement) {
        if (this.hasCommand(command.id)) {
            console.warn(`command '${command.id}' already registered`);
            return disposable_1.Disposable.NULL;
        }
        const commandHandler = {
            execute: async (...args) => {
                const handler = this.commandHandlers.get(command.id);
                if (!handler) {
                    throw new Error(`command '${command.id}' not found`);
                }
                return handler(...args);
            },
            // Always enabled - a command can be executed programmatically or via the commands palette.
            isEnabled: () => {
                if (enablement) {
                    return this.contextKeyService.match(enablement);
                }
                return true;
            },
            // Visibility rules are defined via the `menus` contribution point.
            isVisible() { return true; }
        };
        if (enablement) {
            const contextKeys = this.contextKeyService.parseKeys(enablement);
            if (contextKeys && contextKeys.size > 0) {
                commandHandler.onDidChangeEnabled = (listener) => this.contextKeyService.onDidChange(e => {
                    if (e.affects(contextKeys)) {
                        listener();
                    }
                });
            }
        }
        const toDispose = new disposable_1.DisposableCollection();
        if (this.commands.getCommand(command.id)) {
            // overriding built-in command, i.e. `type` by the VSCodeVim extension
            toDispose.push(this.commands.registerHandler(command.id, commandHandler));
        }
        else {
            toDispose.push(this.commands.registerCommand(command, commandHandler));
        }
        this.commandHandlers.set(command.id, undefined);
        toDispose.push(disposable_1.Disposable.create(() => this.commandHandlers.delete(command.id)));
        return toDispose;
    }
    registerCommandHandler(id, execute) {
        if (this.hasCommandHandler(id)) {
            console.warn(`command handler '${id}' already registered`);
            return disposable_1.Disposable.NULL;
        }
        this.commandHandlers.set(id, execute);
        this.onDidRegisterCommandHandlerEmitter.fire(id);
        return disposable_1.Disposable.create(() => this.commandHandlers.set(id, undefined));
    }
    hasCommand(id) {
        return this.commandHandlers.has(id);
    }
    hasCommandHandler(id) {
        return !!this.commandHandlers.get(id);
    }
    updateDefaultOverridesSchema(configurationDefaults) {
        const defaultOverrides = {
            id: preferences_1.DefaultOverridesPreferenceSchemaId,
            title: 'Default Configuration Overrides',
            properties: {}
        };
        // eslint-disable-next-line guard-for-in
        for (const key in configurationDefaults) {
            const defaultValue = configurationDefaults[key];
            if (this.preferenceOverrideService.testOverrideValue(key, defaultValue)) {
                // language specific override
                defaultOverrides.properties[key] = {
                    type: 'object',
                    default: defaultValue,
                    description: `Configure editor settings to be overridden for ${key} language.`
                };
            }
            else {
                // regular configuration override
                defaultOverrides.properties[key] = {
                    default: defaultValue,
                    description: `Configure default setting for ${key}.`
                };
            }
        }
        if (Object.keys(defaultOverrides.properties).length) {
            return this.preferenceSchemaProvider.setSchema(defaultOverrides);
        }
        return disposable_1.Disposable.NULL;
    }
    createRegex(value) {
        if (typeof value === 'string') {
            return new RegExp(value, '');
        }
        if (typeof value == 'undefined') {
            return undefined;
        }
        return new RegExp(value.pattern, value.flags);
    }
    convertIndentationRules(rules) {
        if (!rules) {
            return undefined;
        }
        return {
            decreaseIndentPattern: this.createRegex(rules.decreaseIndentPattern),
            increaseIndentPattern: this.createRegex(rules.increaseIndentPattern),
            indentNextLinePattern: this.createRegex(rules.indentNextLinePattern),
            unIndentedLinePattern: this.createRegex(rules.unIndentedLinePattern)
        };
    }
    convertFolding(folding) {
        if (!folding) {
            return undefined;
        }
        const result = {
            offSide: folding.offSide
        };
        if (folding.markers) {
            result.markers = {
                end: this.createRegex(folding.markers.end),
                start: this.createRegex(folding.markers.start)
            };
        }
        return result;
    }
    convertTokenTypes(tokenTypes) {
        if (typeof tokenTypes === 'undefined' || tokenTypes === null) {
            return undefined;
        }
        const result = Object.create(null);
        const scopes = Object.keys(tokenTypes);
        const len = scopes.length;
        for (let i = 0; i < len; i++) {
            const scope = scopes[i];
            const tokenType = tokenTypes[scope];
            switch (tokenType) {
                case 'string':
                    result[scope] = 2 /* String */;
                    break;
                case 'other':
                    result[scope] = 0 /* Other */;
                    break;
                case 'comment':
                    result[scope] = 1 /* Comment */;
                    break;
            }
        }
        return result;
    }
    convertEmbeddedLanguages(languages, logWarning) {
        if (typeof languages === 'undefined' || languages === null) {
            return undefined;
        }
        const result = Object.create(null);
        const scopes = Object.keys(languages);
        const len = scopes.length;
        for (let i = 0; i < len; i++) {
            const scope = scopes[i];
            const langId = languages[scope];
            result[scope] = (0, textmate_1.getEncodedLanguageId)(langId);
            if (!result[scope]) {
                logWarning(`Language for '${scope}' not found.`);
            }
        }
        return result;
    }
    convertOnEnterRules(onEnterRules) {
        if (!onEnterRules) {
            return undefined;
        }
        const result = [];
        for (const onEnterRule of onEnterRules) {
            const rule = {
                beforeText: this.createRegex(onEnterRule.beforeText),
                afterText: this.createRegex(onEnterRule.afterText),
                previousLineText: this.createRegex(onEnterRule.previousLineText),
                action: this.createEnterAction(onEnterRule.action),
            };
            result.push(rule);
        }
        return result;
    }
    createEnterAction(action) {
        let indentAction;
        switch (action.indent) {
            case 'indent':
                indentAction = monaco.languages.IndentAction.Indent;
                break;
            case 'indentOutdent':
                indentAction = monaco.languages.IndentAction.IndentOutdent;
                break;
            case 'outdent':
                indentAction = monaco.languages.IndentAction.Outdent;
                break;
            default:
                indentAction = monaco.languages.IndentAction.None;
                break;
        }
        return { indentAction, appendText: action.appendText, removeText: action.removeText };
    }
};
__decorate([
    (0, inversify_1.inject)(textmate_1.TextmateRegistry),
    __metadata("design:type", textmate_1.TextmateRegistry)
], PluginContributionHandler.prototype, "grammarsRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(plugin_view_registry_1.PluginViewRegistry),
    __metadata("design:type", plugin_view_registry_1.PluginViewRegistry)
], PluginContributionHandler.prototype, "viewRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(plugin_custom_editor_registry_1.PluginCustomEditorRegistry),
    __metadata("design:type", plugin_custom_editor_registry_1.PluginCustomEditorRegistry)
], PluginContributionHandler.prototype, "customEditorRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(menus_contribution_handler_1.MenusContributionPointHandler),
    __metadata("design:type", menus_contribution_handler_1.MenusContributionPointHandler)
], PluginContributionHandler.prototype, "menusContributionHandler", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.PreferenceSchemaProvider),
    __metadata("design:type", browser_1.PreferenceSchemaProvider)
], PluginContributionHandler.prototype, "preferenceSchemaProvider", void 0);
__decorate([
    (0, inversify_1.inject)(preferences_1.PreferenceLanguageOverrideService),
    __metadata("design:type", preferences_1.PreferenceLanguageOverrideService)
], PluginContributionHandler.prototype, "preferenceOverrideService", void 0);
__decorate([
    (0, inversify_1.inject)(textmate_1.MonacoTextmateService),
    __metadata("design:type", textmate_1.MonacoTextmateService)
], PluginContributionHandler.prototype, "monacoTextmateService", void 0);
__decorate([
    (0, inversify_1.inject)(keybindings_contribution_handler_1.KeybindingsContributionPointHandler),
    __metadata("design:type", keybindings_contribution_handler_1.KeybindingsContributionPointHandler)
], PluginContributionHandler.prototype, "keybindingsContributionHandler", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_snippet_suggest_provider_1.MonacoSnippetSuggestProvider),
    __metadata("design:type", monaco_snippet_suggest_provider_1.MonacoSnippetSuggestProvider)
], PluginContributionHandler.prototype, "snippetSuggestProvider", void 0);
__decorate([
    (0, inversify_1.inject)(command_1.CommandRegistry),
    __metadata("design:type", command_1.CommandRegistry)
], PluginContributionHandler.prototype, "commands", void 0);
__decorate([
    (0, inversify_1.inject)(plugin_shared_style_1.PluginSharedStyle),
    __metadata("design:type", plugin_shared_style_1.PluginSharedStyle)
], PluginContributionHandler.prototype, "style", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.TaskDefinitionRegistry),
    __metadata("design:type", browser_2.TaskDefinitionRegistry)
], PluginContributionHandler.prototype, "taskDefinitionRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.ProblemMatcherRegistry),
    __metadata("design:type", browser_2.ProblemMatcherRegistry)
], PluginContributionHandler.prototype, "problemMatcherRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.ProblemPatternRegistry),
    __metadata("design:type", browser_2.ProblemPatternRegistry)
], PluginContributionHandler.prototype, "problemPatternRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(plugin_debug_service_1.PluginDebugService),
    __metadata("design:type", plugin_debug_service_1.PluginDebugService)
], PluginContributionHandler.prototype, "debugService", void 0);
__decorate([
    (0, inversify_1.inject)(debug_schema_updater_1.DebugSchemaUpdater),
    __metadata("design:type", debug_schema_updater_1.DebugSchemaUpdater)
], PluginContributionHandler.prototype, "debugSchema", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_theming_service_1.MonacoThemingService),
    __metadata("design:type", monaco_theming_service_1.MonacoThemingService)
], PluginContributionHandler.prototype, "monacoThemingService", void 0);
__decorate([
    (0, inversify_1.inject)(color_registry_1.ColorRegistry),
    __metadata("design:type", color_registry_1.ColorRegistry)
], PluginContributionHandler.prototype, "colors", void 0);
__decorate([
    (0, inversify_1.inject)(plugin_icon_theme_service_1.PluginIconThemeService),
    __metadata("design:type", plugin_icon_theme_service_1.PluginIconThemeService)
], PluginContributionHandler.prototype, "iconThemeService", void 0);
__decorate([
    (0, inversify_1.inject)(terminal_service_1.TerminalService),
    __metadata("design:type", Object)
], PluginContributionHandler.prototype, "terminalService", void 0);
__decorate([
    (0, inversify_1.inject)(plugin_terminal_registry_1.PluginTerminalRegistry),
    __metadata("design:type", plugin_terminal_registry_1.PluginTerminalRegistry)
], PluginContributionHandler.prototype, "pluginTerminalRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(terminal_profile_service_1.ContributedTerminalProfileStore),
    __metadata("design:type", Object)
], PluginContributionHandler.prototype, "contributedProfileStore", void 0);
__decorate([
    (0, inversify_1.inject)(browser_3.NotebookTypeRegistry),
    __metadata("design:type", browser_3.NotebookTypeRegistry)
], PluginContributionHandler.prototype, "notebookTypeRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(browser_3.NotebookRendererRegistry),
    __metadata("design:type", browser_3.NotebookRendererRegistry)
], PluginContributionHandler.prototype, "notebookRendererRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(common_2.ContributionProvider),
    (0, inversify_1.named)(browser_1.LabelProviderContribution),
    __metadata("design:type", Object)
], PluginContributionHandler.prototype, "contributionProvider", void 0);
__decorate([
    (0, inversify_1.inject)(context_key_service_1.ContextKeyService),
    __metadata("design:type", Object)
], PluginContributionHandler.prototype, "contextKeyService", void 0);
PluginContributionHandler = __decorate([
    (0, inversify_1.injectable)()
], PluginContributionHandler);
exports.PluginContributionHandler = PluginContributionHandler;
//# sourceMappingURL=plugin-contribution-handler.js.map