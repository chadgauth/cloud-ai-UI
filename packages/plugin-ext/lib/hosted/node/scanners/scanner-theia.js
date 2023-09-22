"use strict";
// *****************************************************************************
// Copyright (C) 2015-2021 Red Hat, Inc.
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
exports.TheiaPluginScanner = void 0;
/* eslint-disable @theia/localization-check */
const inversify_1 = require("@theia/core/shared/inversify");
const plugin_protocol_1 = require("../../../common/plugin-protocol");
const fs_1 = require("fs");
const path = require("path");
const types_1 = require("@theia/core/lib/common/types");
const grammars_reader_1 = require("./grammars-reader");
const errors_1 = require("../../../common/errors");
const jsoncparser = require("jsonc-parser");
const objects_1 = require("@theia/core/lib/common/objects");
const preference_schema_1 = require("@theia/core/lib/common/preferences/preference-schema");
const plugin_uri_factory_1 = require("./plugin-uri-factory");
var nls;
(function (nls) {
    function localize(key, _default) {
        return _default;
    }
    nls.localize = localize;
})(nls || (nls = {}));
const INTERNAL_CONSOLE_OPTIONS_SCHEMA = {
    enum: ['neverOpen', 'openOnSessionStart', 'openOnFirstSessionStart'],
    default: 'openOnFirstSessionStart',
    description: nls.localize('internalConsoleOptions', 'Controls when the internal debug console should open.')
};
const colorIdPattern = '^\\w+[.\\w+]*$';
let TheiaPluginScanner = class TheiaPluginScanner {
    constructor() {
        this._apiType = 'theiaPlugin';
    }
    get apiType() {
        return this._apiType;
    }
    getModel(plugin) {
        var _a;
        const publisher = (_a = plugin.publisher) !== null && _a !== void 0 ? _a : plugin_protocol_1.PluginIdentifiers.UNPUBLISHED;
        const result = {
            packagePath: plugin.packagePath,
            packageUri: this.pluginUriFactory.createUri(plugin).toString(),
            // see id definition: https://github.com/microsoft/vscode/blob/15916055fe0cb9411a5f36119b3b012458fe0a1d/src/vs/platform/extensions/common/extensions.ts#L167-L169
            id: `${publisher.toLowerCase()}.${plugin.name.toLowerCase()}`,
            name: plugin.name,
            publisher,
            version: plugin.version,
            displayName: plugin.displayName,
            description: plugin.description,
            l10n: plugin.l10n,
            engine: {
                type: this._apiType,
                version: plugin.engines[this._apiType]
            },
            entryPoint: {
                frontend: plugin.theiaPlugin.frontend,
                backend: plugin.theiaPlugin.backend
            }
        };
        return result;
    }
    getLifecycle(plugin) {
        return {
            startMethod: 'start',
            stopMethod: 'stop',
            frontendModuleName: (0, plugin_protocol_1.buildFrontendModuleName)(plugin),
            backendInitPath: path.join(__dirname, 'backend-init-theia')
        };
    }
    getDependencies(rawPlugin) {
        // skip it since there is no way to load transitive dependencies for Theia plugins yet
        return undefined;
    }
    async getContribution(rawPlugin) {
        if (!rawPlugin.contributes && !rawPlugin.activationEvents) {
            return undefined;
        }
        const contributions = {
            activationEvents: rawPlugin.activationEvents
        };
        if (!rawPlugin.contributes) {
            return contributions;
        }
        try {
            if (rawPlugin.contributes.configuration) {
                const configurations = Array.isArray(rawPlugin.contributes.configuration) ? rawPlugin.contributes.configuration : [rawPlugin.contributes.configuration];
                contributions.configuration = [];
                for (const c of configurations) {
                    const config = this.readConfiguration(c, rawPlugin.packagePath);
                    if (config) {
                        contributions.configuration.push(config);
                    }
                }
            }
        }
        catch (err) {
            console.error(`Could not read '${rawPlugin.name}' contribution 'configuration'.`, rawPlugin.contributes.configuration, err);
        }
        const configurationDefaults = rawPlugin.contributes.configurationDefaults;
        contributions.configurationDefaults = preference_schema_1.PreferenceSchemaProperties.is(configurationDefaults) ? configurationDefaults : undefined;
        try {
            if (rawPlugin.contributes.submenus) {
                contributions.submenus = this.readSubmenus(rawPlugin.contributes.submenus, rawPlugin);
            }
        }
        catch (err) {
            console.error(`Could not read '${rawPlugin.name}' contribution 'submenus'.`, rawPlugin.contributes.submenus, err);
        }
        try {
            if (rawPlugin.contributes.customEditors) {
                const customEditors = this.readCustomEditors(rawPlugin.contributes.customEditors);
                contributions.customEditors = customEditors;
            }
        }
        catch (err) {
            console.error(`Could not read '${rawPlugin.name}' contribution 'customEditors'.`, rawPlugin.contributes.customEditors, err);
        }
        try {
            if (rawPlugin.contributes.viewsContainers) {
                const viewsContainers = rawPlugin.contributes.viewsContainers;
                contributions.viewsContainers = {};
                for (const location of Object.keys(viewsContainers)) {
                    const containers = this.readViewsContainers(viewsContainers[location], rawPlugin);
                    const loc = location === 'activitybar' ? 'left' : location === 'panel' ? 'bottom' : location;
                    if (contributions.viewsContainers[loc]) {
                        contributions.viewsContainers[loc] = contributions.viewsContainers[loc].concat(containers);
                    }
                    else {
                        contributions.viewsContainers[loc] = containers;
                    }
                }
            }
        }
        catch (err) {
            console.error(`Could not read '${rawPlugin.name}' contribution 'viewsContainers'.`, rawPlugin.contributes.viewsContainers, err);
        }
        try {
            if (rawPlugin.contributes.views) {
                contributions.views = {};
                for (const location of Object.keys(rawPlugin.contributes.views)) {
                    const views = this.readViews(rawPlugin.contributes.views[location]);
                    contributions.views[location] = views;
                }
            }
        }
        catch (err) {
            console.error(`Could not read '${rawPlugin.name}' contribution 'views'.`, rawPlugin.contributes.views, err);
        }
        try {
            if (rawPlugin.contributes.viewsWelcome) {
                contributions.viewsWelcome = this.readViewsWelcome(rawPlugin.contributes.viewsWelcome, rawPlugin.contributes.views);
            }
        }
        catch (err) {
            console.error(`Could not read '${rawPlugin.name}' contribution 'viewsWelcome'.`, rawPlugin.contributes.viewsWelcome, err);
        }
        try {
            const pluginCommands = rawPlugin.contributes.commands;
            if (pluginCommands) {
                const commands = Array.isArray(pluginCommands) ? pluginCommands : [pluginCommands];
                contributions.commands = commands.map(command => this.readCommand(command, rawPlugin));
            }
        }
        catch (err) {
            console.error(`Could not read '${rawPlugin.name}' contribution 'commands'.`, rawPlugin.contributes.commands, err);
        }
        try {
            if (rawPlugin.contributes.menus) {
                contributions.menus = {};
                for (const location of Object.keys(rawPlugin.contributes.menus)) {
                    const menus = this.readMenus(rawPlugin.contributes.menus[location]);
                    contributions.menus[location] = menus;
                }
            }
        }
        catch (err) {
            console.error(`Could not read '${rawPlugin.name}' contribution 'menus'.`, rawPlugin.contributes.menus, err);
        }
        try {
            if (rawPlugin.contributes.keybindings) {
                const rawKeybindings = Array.isArray(rawPlugin.contributes.keybindings) ? rawPlugin.contributes.keybindings : [rawPlugin.contributes.keybindings];
                contributions.keybindings = rawKeybindings.map(rawKeybinding => this.readKeybinding(rawKeybinding));
            }
        }
        catch (err) {
            console.error(`Could not read '${rawPlugin.name}' contribution 'keybindings'.`, rawPlugin.contributes.keybindings, err);
        }
        try {
            if (rawPlugin.contributes.debuggers) {
                const debuggers = this.readDebuggers(rawPlugin.contributes.debuggers);
                contributions.debuggers = debuggers;
            }
        }
        catch (err) {
            console.error(`Could not read '${rawPlugin.name}' contribution 'debuggers'.`, rawPlugin.contributes.debuggers, err);
        }
        try {
            if (rawPlugin.contributes.taskDefinitions) {
                const definitions = rawPlugin.contributes.taskDefinitions;
                contributions.taskDefinitions = definitions.map(definitionContribution => this.readTaskDefinition(rawPlugin.name, definitionContribution));
            }
        }
        catch (err) {
            console.error(`Could not read '${rawPlugin.name}' contribution 'taskDefinitions'.`, rawPlugin.contributes.taskDefinitions, err);
        }
        try {
            contributions.problemMatchers = rawPlugin.contributes.problemMatchers;
        }
        catch (err) {
            console.error(`Could not read '${rawPlugin.name}' contribution 'problemMatchers'.`, rawPlugin.contributes.problemMatchers, err);
        }
        try {
            contributions.problemPatterns = rawPlugin.contributes.problemPatterns;
        }
        catch (err) {
            console.error(`Could not read '${rawPlugin.name}' contribution 'problemPatterns'.`, rawPlugin.contributes.problemPatterns, err);
        }
        try {
            contributions.resourceLabelFormatters = rawPlugin.contributes.resourceLabelFormatters;
        }
        catch (err) {
            console.error(`Could not read '${rawPlugin.name}' contribution 'resourceLabelFormatters'.`, rawPlugin.contributes.resourceLabelFormatters, err);
        }
        try {
            contributions.authentication = rawPlugin.contributes.authentication;
        }
        catch (err) {
            console.error(`Could not read '${rawPlugin.name}' contribution 'authentication'.`, rawPlugin.contributes.authentication, err);
        }
        try {
            contributions.notebooks = rawPlugin.contributes.notebooks;
        }
        catch (err) {
            console.error(`Could not read '${rawPlugin.name}' contribution 'notebooks'.`, rawPlugin.contributes.authentication, err);
        }
        try {
            contributions.notebookRenderer = rawPlugin.contributes.notebookRenderer;
        }
        catch (err) {
            console.error(`Could not read '${rawPlugin.name}' contribution 'notebooks'.`, rawPlugin.contributes.authentication, err);
        }
        try {
            contributions.snippets = this.readSnippets(rawPlugin);
        }
        catch (err) {
            console.error(`Could not read '${rawPlugin.name}' contribution 'snippets'.`, rawPlugin.contributes.snippets, err);
        }
        try {
            contributions.themes = this.readThemes(rawPlugin);
        }
        catch (err) {
            console.error(`Could not read '${rawPlugin.name}' contribution 'themes'.`, rawPlugin.contributes.themes, err);
        }
        try {
            contributions.iconThemes = this.readIconThemes(rawPlugin);
        }
        catch (err) {
            console.error(`Could not read '${rawPlugin.name}' contribution 'iconThemes'.`, rawPlugin.contributes.iconThemes, err);
        }
        try {
            contributions.colors = this.readColors(rawPlugin);
        }
        catch (err) {
            console.error(`Could not read '${rawPlugin.name}' contribution 'colors'.`, rawPlugin.contributes.colors, err);
        }
        try {
            contributions.terminalProfiles = this.readTerminals(rawPlugin);
        }
        catch (err) {
            console.error(`Could not read '${rawPlugin.name}' contribution 'terminals'.`, rawPlugin.contributes.terminal, err);
        }
        const [localizationsResult, languagesResult, grammarsResult] = await Promise.allSettled([
            this.readLocalizations(rawPlugin),
            rawPlugin.contributes.languages ? this.readLanguages(rawPlugin.contributes.languages, rawPlugin.packagePath) : undefined,
            rawPlugin.contributes.grammars ? this.grammarsReader.readGrammars(rawPlugin.contributes.grammars, rawPlugin.packagePath) : undefined
        ]);
        if (localizationsResult.status === 'fulfilled') {
            contributions.localizations = localizationsResult.value;
        }
        else {
            console.error(`Could not read '${rawPlugin.name}' contribution 'localizations'.`, rawPlugin.contributes.localizations, localizationsResult.reason);
        }
        if (rawPlugin.contributes.languages) {
            if (languagesResult.status === 'fulfilled') {
                contributions.languages = languagesResult.value;
            }
            else {
                console.error(`Could not read '${rawPlugin.name}' contribution 'languages'.`, rawPlugin.contributes.languages, languagesResult.reason);
            }
        }
        if (rawPlugin.contributes.grammars) {
            if (grammarsResult.status === 'fulfilled') {
                contributions.grammars = grammarsResult.value;
            }
            else {
                console.error(`Could not read '${rawPlugin.name}' contribution 'grammars'.`, rawPlugin.contributes.grammars, grammarsResult.reason);
            }
        }
        return contributions;
    }
    readTerminals(pck) {
        var _a, _b;
        if (!((_b = (_a = pck === null || pck === void 0 ? void 0 : pck.contributes) === null || _a === void 0 ? void 0 : _a.terminal) === null || _b === void 0 ? void 0 : _b.profiles)) {
            return undefined;
        }
        return pck.contributes.terminal.profiles.filter(profile => profile.id && profile.title);
    }
    async readLocalizations(pck) {
        if (!pck.contributes || !pck.contributes.localizations) {
            return undefined;
        }
        return Promise.all(pck.contributes.localizations.map(e => this.readLocalization(e, pck.packagePath)));
    }
    async readLocalization({ languageId, languageName, localizedLanguageName, translations }, pluginPath) {
        const local = {
            languageId,
            languageName,
            localizedLanguageName,
            translations: []
        };
        local.translations = await Promise.all(translations.map(e => this.readTranslation(e, pluginPath)));
        return local;
    }
    async readTranslation(packageTranslation, pluginPath) {
        const translation = await this.readJson(path.resolve(pluginPath, packageTranslation.path));
        if (!translation) {
            throw new Error(`Could not read json file '${packageTranslation.path}'.`);
        }
        translation.id = packageTranslation.id;
        translation.path = packageTranslation.path;
        return translation;
    }
    readCommand({ command, title, original, category, icon, enablement }, pck) {
        var _a;
        const { themeIcon, iconUrl } = (_a = this.transformIconUrl(pck, icon)) !== null && _a !== void 0 ? _a : {};
        return { command, title, originalTitle: original, category, iconUrl, themeIcon, enablement };
    }
    transformIconUrl(plugin, original) {
        if (original) {
            if (typeof original === 'string') {
                if (original.startsWith('$(')) {
                    return { themeIcon: original };
                }
                else {
                    return { iconUrl: this.toPluginUrl(plugin, original) };
                }
            }
            else {
                return {
                    iconUrl: {
                        light: this.toPluginUrl(plugin, original.light),
                        dark: this.toPluginUrl(plugin, original.dark)
                    }
                };
            }
        }
    }
    toPluginUrl(pck, relativePath) {
        return plugin_protocol_1.PluginPackage.toPluginUrl(pck, relativePath);
    }
    readColors(pck) {
        if (!pck.contributes || !pck.contributes.colors) {
            return undefined;
        }
        const result = [];
        for (const contribution of pck.contributes.colors) {
            if (typeof contribution.id !== 'string' || contribution.id.length === 0) {
                console.error("'configuration.colors.id' must be defined and can not be empty");
                continue;
            }
            if (!contribution.id.match(colorIdPattern)) {
                console.error("'configuration.colors.id' must follow the word[.word]*");
                continue;
            }
            if (typeof contribution.description !== 'string' || contribution.id.length === 0) {
                console.error("'configuration.colors.description' must be defined and can not be empty");
                continue;
            }
            const defaults = contribution.defaults;
            if (!defaults || typeof defaults !== 'object' || typeof defaults.light !== 'string' || typeof defaults.dark !== 'string' || typeof defaults.highContrast !== 'string') {
                console.error("'configuration.colors.defaults' must be defined and must contain 'light', 'dark' and 'highContrast'");
                continue;
            }
            result.push({
                id: contribution.id,
                description: contribution.description,
                defaults: {
                    light: defaults.light,
                    dark: defaults.dark,
                    hc: defaults.highContrast
                }
            });
        }
        return result;
    }
    readThemes(pck) {
        if (!pck.contributes || !pck.contributes.themes) {
            return undefined;
        }
        const result = [];
        for (const contribution of pck.contributes.themes) {
            if (contribution.path) {
                result.push({
                    id: contribution.id,
                    uri: this.pluginUriFactory.createUri(pck, contribution.path).toString(),
                    description: contribution.description,
                    label: contribution.label,
                    uiTheme: contribution.uiTheme
                });
            }
        }
        return result;
    }
    readIconThemes(pck) {
        if (!pck.contributes || !pck.contributes.iconThemes) {
            return undefined;
        }
        const result = [];
        for (const contribution of pck.contributes.iconThemes) {
            if (typeof contribution.id !== 'string') {
                console.error('Expected string in `contributes.iconThemes.id`. Provided value:', contribution.id);
                continue;
            }
            if (typeof contribution.path !== 'string') {
                console.error('Expected string in `contributes.iconThemes.path`. Provided value:', contribution.path);
                continue;
            }
            result.push({
                id: contribution.id,
                uri: this.pluginUriFactory.createUri(pck, contribution.path).toString(),
                description: contribution.description,
                label: contribution.label,
                uiTheme: contribution.uiTheme
            });
        }
        return result;
    }
    readSnippets(pck) {
        if (!pck.contributes || !pck.contributes.snippets) {
            return undefined;
        }
        const result = [];
        for (const contribution of pck.contributes.snippets) {
            if (contribution.path) {
                result.push({
                    language: contribution.language,
                    source: pck.displayName || pck.name,
                    uri: this.pluginUriFactory.createUri(pck, contribution.path).toString()
                });
            }
        }
        return result;
    }
    async readJson(filePath) {
        const content = await this.readFile(filePath);
        return content ? jsoncparser.parse(content, undefined, { disallowComments: false }) : undefined;
    }
    async readFile(filePath) {
        try {
            const content = await fs_1.promises.readFile(filePath, { encoding: 'utf8' });
            return content;
        }
        catch (e) {
            if (!(0, errors_1.isENOENT)(e)) {
                console.error(e);
            }
            return '';
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readConfiguration(rawConfiguration, pluginPath) {
        return preference_schema_1.PreferenceSchema.is(rawConfiguration) ? rawConfiguration : undefined;
    }
    readKeybinding(rawKeybinding) {
        return {
            keybinding: rawKeybinding.key,
            command: rawKeybinding.command,
            when: rawKeybinding.when,
            mac: rawKeybinding.mac,
            linux: rawKeybinding.linux,
            win: rawKeybinding.win,
            args: rawKeybinding.args
        };
    }
    readCustomEditors(rawCustomEditors) {
        return rawCustomEditors.map(rawCustomEditor => this.readCustomEditor(rawCustomEditor));
    }
    readCustomEditor(rawCustomEditor) {
        return {
            viewType: rawCustomEditor.viewType,
            displayName: rawCustomEditor.displayName,
            selector: rawCustomEditor.selector || [],
            priority: rawCustomEditor.priority || plugin_protocol_1.CustomEditorPriority.default
        };
    }
    readViewsContainers(rawViewsContainers, pck) {
        return rawViewsContainers.map(rawViewContainer => this.readViewContainer(rawViewContainer, pck));
    }
    readViewContainer(rawViewContainer, pck) {
        const themeIcon = rawViewContainer.icon.startsWith('$(') ? rawViewContainer.icon : undefined;
        const iconUrl = this.toPluginUrl(pck, rawViewContainer.icon);
        return {
            id: rawViewContainer.id,
            title: rawViewContainer.title,
            iconUrl,
            themeIcon,
        };
    }
    readViews(rawViews) {
        return rawViews.map(rawView => this.readView(rawView));
    }
    readView(rawView) {
        const result = {
            id: rawView.id,
            name: rawView.name,
            when: rawView.when,
            type: rawView.type
        };
        return result;
    }
    readViewsWelcome(rawViewsWelcome, rowViews) {
        return rawViewsWelcome.map(rawViewWelcome => this.readViewWelcome(rawViewWelcome, this.extractPluginViewsIds(rowViews)));
    }
    readViewWelcome(rawViewWelcome, pluginViewsIds) {
        const result = {
            view: rawViewWelcome.view,
            content: rawViewWelcome.contents,
            when: rawViewWelcome.when,
            // if the plugin contributes Welcome view to its own view - it will be ordered first
            order: pluginViewsIds.findIndex(v => v === rawViewWelcome.view) > -1 ? 0 : 1
        };
        return result;
    }
    extractPluginViewsIds(views) {
        const pluginViewsIds = [];
        if (views) {
            for (const location of Object.keys(views)) {
                const viewsIds = views[location].map(view => view.id);
                pluginViewsIds.push(...viewsIds);
            }
            ;
        }
        return pluginViewsIds;
    }
    readMenus(rawMenus) {
        return rawMenus.map(rawMenu => this.readMenu(rawMenu));
    }
    readMenu(rawMenu) {
        const result = {
            command: rawMenu.command,
            submenu: rawMenu.submenu,
            alt: rawMenu.alt,
            group: rawMenu.group,
            when: rawMenu.when
        };
        return result;
    }
    async readLanguages(rawLanguages, pluginPath) {
        return Promise.all(rawLanguages.map(language => this.readLanguage(language, pluginPath)));
    }
    readSubmenus(rawSubmenus, plugin) {
        return rawSubmenus.map(submenu => this.readSubmenu(submenu, plugin));
    }
    readSubmenu(rawSubmenu, plugin) {
        var _a;
        const icon = this.transformIconUrl(plugin, rawSubmenu.icon);
        return {
            icon: (_a = icon === null || icon === void 0 ? void 0 : icon.iconUrl) !== null && _a !== void 0 ? _a : icon === null || icon === void 0 ? void 0 : icon.themeIcon,
            id: rawSubmenu.id,
            label: rawSubmenu.label
        };
    }
    async readLanguage(rawLang, pluginPath) {
        // TODO: add validation to all parameters
        const result = {
            id: rawLang.id,
            aliases: rawLang.aliases,
            extensions: rawLang.extensions,
            filenamePatterns: rawLang.filenamePatterns,
            filenames: rawLang.filenames,
            firstLine: rawLang.firstLine,
            mimetypes: rawLang.mimetypes
        };
        if (rawLang.configuration) {
            const rawConfiguration = await this.readJson(path.resolve(pluginPath, rawLang.configuration));
            if (rawConfiguration) {
                const configuration = {
                    brackets: rawConfiguration.brackets,
                    comments: rawConfiguration.comments,
                    folding: rawConfiguration.folding,
                    wordPattern: rawConfiguration.wordPattern,
                    autoClosingPairs: this.extractValidAutoClosingPairs(rawLang.id, rawConfiguration),
                    indentationRules: rawConfiguration.indentationRules,
                    surroundingPairs: this.extractValidSurroundingPairs(rawLang.id, rawConfiguration),
                    onEnterRules: rawConfiguration.onEnterRules,
                };
                result.configuration = configuration;
            }
        }
        return result;
    }
    readDebuggers(rawDebuggers) {
        return rawDebuggers.map(rawDebug => this.readDebugger(rawDebug));
    }
    readDebugger(rawDebugger) {
        const result = {
            type: rawDebugger.type,
            label: rawDebugger.label,
            languages: rawDebugger.languages,
            enableBreakpointsFor: rawDebugger.enableBreakpointsFor,
            variables: rawDebugger.variables,
            adapterExecutableCommand: rawDebugger.adapterExecutableCommand,
            configurationSnippets: rawDebugger.configurationSnippets,
            win: rawDebugger.win,
            winx86: rawDebugger.winx86,
            windows: rawDebugger.windows,
            osx: rawDebugger.osx,
            linux: rawDebugger.linux,
            program: rawDebugger.program,
            args: rawDebugger.args,
            runtime: rawDebugger.runtime,
            runtimeArgs: rawDebugger.runtimeArgs
        };
        result.configurationAttributes = rawDebugger.configurationAttributes
            && this.resolveSchemaAttributes(rawDebugger.type, rawDebugger.configurationAttributes);
        return result;
    }
    readTaskDefinition(pluginName, definitionContribution) {
        const propertyKeys = definitionContribution.properties ? Object.keys(definitionContribution.properties) : [];
        const schema = this.toSchema(definitionContribution);
        return {
            taskType: definitionContribution.type,
            source: pluginName,
            properties: {
                required: definitionContribution.required || [],
                all: propertyKeys,
                schema
            }
        };
    }
    toSchema(definition) {
        const reconciliation = { ...definition, type: 'object' };
        const schema = (0, objects_1.deepClone)(reconciliation);
        if (schema.properties === undefined) {
            schema.properties = Object.create(null);
        }
        schema.type = 'object';
        schema.properties.type = { type: 'string', const: definition.type };
        return schema;
    }
    resolveSchemaAttributes(type, configurationAttributes) {
        const taskSchema = {};
        return Object.keys(configurationAttributes).map(request => {
            const attributes = (0, objects_1.deepClone)(configurationAttributes[request]);
            const defaultRequired = ['name', 'type', 'request'];
            attributes.required = attributes.required && attributes.required.length ? defaultRequired.concat(attributes.required) : defaultRequired;
            attributes.additionalProperties = false;
            attributes.type = 'object';
            if (!attributes.properties) {
                attributes.properties = {};
            }
            const properties = attributes.properties;
            properties['type'] = {
                enum: [type],
                description: nls.localize('debugType', 'Type of configuration.'),
                pattern: '^(?!node2)',
                errorMessage: nls.localize('debugTypeNotRecognised', 'The debug type is not recognized. Make sure that you have a corresponding debug extension installed and that it is enabled.'),
                patternErrorMessage: nls.localize('node2NotSupported', '"node2" is no longer supported, use "node" instead and set the "protocol" attribute to "inspector".')
            };
            properties['name'] = {
                type: 'string',
                description: nls.localize('debugName', 'Name of configuration; appears in the launch configuration drop down menu.'),
                default: 'Launch'
            };
            properties['request'] = {
                enum: [request],
                description: nls.localize('debugRequest', 'Request type of configuration. Can be "launch" or "attach".'),
            };
            properties['debugServer'] = {
                type: 'number',
                description: nls.localize('debugServer', 'For debug extension development only: if a port is specified VS Code tries to connect to a debug adapter running in server mode'),
                default: 4711
            };
            properties['preLaunchTask'] = {
                anyOf: [taskSchema, {
                        type: ['string'],
                    }],
                default: '',
                description: nls.localize('debugPrelaunchTask', 'Task to run before debug session starts.')
            };
            properties['postDebugTask'] = {
                anyOf: [taskSchema, {
                        type: ['string'],
                    }],
                default: '',
                description: nls.localize('debugPostDebugTask', 'Task to run after debug session ends.')
            };
            properties['internalConsoleOptions'] = INTERNAL_CONSOLE_OPTIONS_SCHEMA;
            const osProperties = Object.assign({}, properties);
            properties['windows'] = {
                type: 'object',
                description: nls.localize('debugWindowsConfiguration', 'Windows specific launch configuration attributes.'),
                properties: osProperties
            };
            properties['osx'] = {
                type: 'object',
                description: nls.localize('debugOSXConfiguration', 'OS X specific launch configuration attributes.'),
                properties: osProperties
            };
            properties['linux'] = {
                type: 'object',
                description: nls.localize('debugLinuxConfiguration', 'Linux specific launch configuration attributes.'),
                properties: osProperties
            };
            Object.keys(attributes.properties).forEach(name => {
                // Use schema allOf property to get independent error reporting #21113
                attributes.properties[name].pattern = attributes.properties[name].pattern || '^(?!.*\\$\\{(env|config|command)\\.)';
                attributes.properties[name].patternErrorMessage = attributes.properties[name].patternErrorMessage ||
                    nls.localize('deprecatedVariables', "'env.', 'config.' and 'command.' are deprecated, use 'env:', 'config:' and 'command:' instead.");
            });
            return attributes;
        });
    }
    extractValidAutoClosingPairs(langId, configuration) {
        const source = configuration.autoClosingPairs;
        if (typeof source === 'undefined') {
            return undefined;
        }
        if (!Array.isArray(source)) {
            console.warn(`[${langId}]: language configuration: expected \`autoClosingPairs\` to be an array.`);
            return undefined;
        }
        let result = undefined;
        for (let i = 0, len = source.length; i < len; i++) {
            const pair = source[i];
            if (Array.isArray(pair)) {
                if (!isCharacterPair(pair)) {
                    console.warn(`[${langId}]: language configuration: expected \`autoClosingPairs[${i}]\` to be an array of two strings or an object.`);
                    continue;
                }
                result = result || [];
                result.push({ open: pair[0], close: pair[1] });
            }
            else {
                if (!(0, types_1.isObject)(pair)) {
                    console.warn(`[${langId}]: language configuration: expected \`autoClosingPairs[${i}]\` to be an array of two strings or an object.`);
                    continue;
                }
                if (typeof pair.open !== 'string') {
                    console.warn(`[${langId}]: language configuration: expected \`autoClosingPairs[${i}].open\` to be a string.`);
                    continue;
                }
                if (typeof pair.close !== 'string') {
                    console.warn(`[${langId}]: language configuration: expected \`autoClosingPairs[${i}].close\` to be a string.`);
                    continue;
                }
                if (typeof pair.notIn !== 'undefined') {
                    if (!(0, types_1.isStringArray)(pair.notIn)) {
                        console.warn(`[${langId}]: language configuration: expected \`autoClosingPairs[${i}].notIn\` to be a string array.`);
                        continue;
                    }
                }
                result = result || [];
                result.push({ open: pair.open, close: pair.close, notIn: pair.notIn });
            }
        }
        return result;
    }
    extractValidSurroundingPairs(langId, configuration) {
        const source = configuration.surroundingPairs;
        if (typeof source === 'undefined') {
            return undefined;
        }
        if (!Array.isArray(source)) {
            console.warn(`[${langId}]: language configuration: expected \`surroundingPairs\` to be an array.`);
            return undefined;
        }
        let result = undefined;
        for (let i = 0, len = source.length; i < len; i++) {
            const pair = source[i];
            if (Array.isArray(pair)) {
                if (!isCharacterPair(pair)) {
                    console.warn(`[${langId}]: language configuration: expected \`surroundingPairs[${i}]\` to be an array of two strings or an object.`);
                    continue;
                }
                result = result || [];
                result.push({ open: pair[0], close: pair[1] });
            }
            else {
                if (!(0, types_1.isObject)(pair)) {
                    console.warn(`[${langId}]: language configuration: expected \`surroundingPairs[${i}]\` to be an array of two strings or an object.`);
                    continue;
                }
                if (typeof pair.open !== 'string') {
                    console.warn(`[${langId}]: language configuration: expected \`surroundingPairs[${i}].open\` to be a string.`);
                    continue;
                }
                if (typeof pair.close !== 'string') {
                    console.warn(`[${langId}]: language configuration: expected \`surroundingPairs[${i}].close\` to be a string.`);
                    continue;
                }
                result = result || [];
                result.push({ open: pair.open, close: pair.close });
            }
        }
        return result;
    }
};
__decorate([
    (0, inversify_1.inject)(grammars_reader_1.GrammarsReader),
    __metadata("design:type", grammars_reader_1.GrammarsReader)
], TheiaPluginScanner.prototype, "grammarsReader", void 0);
__decorate([
    (0, inversify_1.inject)(plugin_uri_factory_1.PluginUriFactory),
    __metadata("design:type", Object)
], TheiaPluginScanner.prototype, "pluginUriFactory", void 0);
TheiaPluginScanner = __decorate([
    (0, inversify_1.injectable)()
], TheiaPluginScanner);
exports.TheiaPluginScanner = TheiaPluginScanner;
function isCharacterPair(something) {
    return ((0, types_1.isStringArray)(something)
        && something.length === 2);
}
//# sourceMappingURL=scanner-theia.js.map