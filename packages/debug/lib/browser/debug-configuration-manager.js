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
exports.DebugConfigurationManager = void 0;
/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT License. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/
const debounce = require("p-debounce");
const jsonc_parser_1 = require("jsonc-parser");
const inversify_1 = require("@theia/core/shared/inversify");
const uri_1 = require("@theia/core/lib/common/uri");
const event_1 = require("@theia/core/lib/common/event");
const browser_1 = require("@theia/editor/lib/browser");
const monaco_editor_1 = require("@theia/monaco/lib/browser/monaco-editor");
const browser_2 = require("@theia/core/lib/browser");
const quick_pick_service_1 = require("@theia/core/lib/common/quick-pick-service");
const workspace_service_1 = require("@theia/workspace/lib/browser/workspace-service");
const debug_configuration_model_1 = require("./debug-configuration-model");
const debug_session_options_1 = require("./debug-session-options");
const debug_service_1 = require("../common/debug-service");
const context_key_service_1 = require("@theia/core/lib/browser/context-key-service");
const debug_common_1 = require("../common/debug-common");
const workspace_variable_contribution_1 = require("@theia/workspace/lib/browser/workspace-variable-contribution");
const preference_configurations_1 = require("@theia/core/lib/browser/preferences/preference-configurations");
const monaco_text_model_service_1 = require("@theia/monaco/lib/browser/monaco-text-model-service");
const commands_1 = require("@theia/monaco-editor-core/esm/vs/platform/commands/common/commands");
const standaloneServices_1 = require("@theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices");
const core_1 = require("@theia/core");
let DebugConfigurationManager = class DebugConfigurationManager {
    constructor() {
        this.onDidChangeEmitter = new event_1.Emitter();
        this.onDidChange = this.onDidChangeEmitter.event;
        this.onWillProvideDebugConfigurationEmitter = new event_1.Emitter();
        this.onWillProvideDebugConfiguration = this.onWillProvideDebugConfigurationEmitter.event;
        this.onWillProvideDynamicDebugConfigurationEmitter = new event_1.Emitter();
        this.recentDynamicOptionsTracker = [];
        this.models = new Map();
        this.updateModels = debounce(async () => {
            const roots = await this.workspaceService.roots;
            const toDelete = new Set(this.models.keys());
            for (const rootStat of roots) {
                const key = rootStat.resource.toString();
                toDelete.delete(key);
                if (!this.models.has(key)) {
                    const model = new debug_configuration_model_1.DebugConfigurationModel(key, this.preferences);
                    model.onDidChange(() => this.updateCurrent());
                    model.onDispose(() => this.models.delete(key));
                    this.models.set(key, model);
                }
            }
            for (const uri of toDelete) {
                const model = this.models.get(uri);
                if (model) {
                    model.dispose();
                }
            }
            this.updateCurrent();
        }, 500);
    }
    get onWillProvideDynamicDebugConfiguration() {
        return this.onWillProvideDynamicDebugConfigurationEmitter.event;
    }
    get onDidChangeConfigurationProviders() {
        return this.debug.onDidChangeDebugConfigurationProviders;
    }
    init() {
        this.doInit();
    }
    async doInit() {
        this.debugConfigurationTypeKey = this.contextKeyService.createKey('debugConfigurationType', undefined);
        this.initialized = this.preferences.ready.then(() => {
            this.workspaceService.onWorkspaceChanged(this.updateModels);
            this.preferences.onPreferenceChanged(e => {
                if (e.preferenceName === 'launch') {
                    this.updateModels();
                }
            });
            return this.updateModels();
        });
    }
    /**
     * All _non-dynamic_ debug configurations.
     */
    get all() {
        return this.getAll();
    }
    *getAll() {
        for (const model of this.models.values()) {
            for (const configuration of model.configurations) {
                yield this.configurationToOptions(configuration, model.workspaceFolderUri);
            }
            for (const compound of model.compounds) {
                yield this.compoundToOptions(compound, model.workspaceFolderUri);
            }
        }
    }
    get supported() {
        return this.getSupported();
    }
    async getSupported() {
        await this.initialized;
        const debugTypes = await this.debug.debugTypes();
        return this.doGetSupported(new Set(debugTypes));
    }
    *doGetSupported(debugTypes) {
        for (const options of this.getAll()) {
            if (options.configuration && debugTypes.has(options.configuration.type)) {
                yield options;
            }
        }
    }
    get current() {
        return this._currentOptions;
    }
    async getSelectedConfiguration() {
        if (!debug_session_options_1.DebugSessionOptions.isDynamic(this._currentOptions)) {
            return this._currentOptions;
        }
        // Refresh a dynamic configuration from the provider.
        // This allow providers to update properties before the execution e.g. program
        const { providerType, workspaceFolderUri, configuration: { name } } = this._currentOptions;
        const configuration = await this.fetchDynamicDebugConfiguration(name, providerType, workspaceFolderUri);
        if (!configuration) {
            const message = core_1.nls.localize('theia/debug/missingConfiguration', "Dynamic configuration '{0}:{1}' is missing or not applicable", providerType, name);
            throw new Error(message);
        }
        return { name, configuration, providerType, workspaceFolderUri };
    }
    set current(option) {
        this.updateCurrent(option);
        this.updateRecentlyUsedDynamicConfigurationOptions(option);
    }
    updateRecentlyUsedDynamicConfigurationOptions(option) {
        if (debug_session_options_1.DebugSessionOptions.isDynamic(option)) {
            // Removing an item already present in the list
            const index = this.recentDynamicOptionsTracker.findIndex(item => this.dynamicOptionsMatch(item, option));
            if (index > -1) {
                this.recentDynamicOptionsTracker.splice(index, 1);
            }
            // Adding new item, most recent at the top of the list
            const recentMax = 3;
            if (this.recentDynamicOptionsTracker.unshift(option) > recentMax) {
                // Keep the latest 3 dynamic configuration options to not clutter the dropdown.
                this.recentDynamicOptionsTracker.splice(recentMax);
            }
        }
    }
    dynamicOptionsMatch(one, other) {
        return one.providerType !== undefined
            && one.configuration.name === other.configuration.name
            && one.providerType === other.providerType
            && one.workspaceFolderUri === other.workspaceFolderUri;
    }
    get recentDynamicOptions() {
        return this.recentDynamicOptionsTracker;
    }
    updateCurrent(options = this._currentOptions) {
        var _a;
        if (debug_session_options_1.DebugSessionOptions.isCompound(options)) {
            this._currentOptions = options && this.find(options.compound, options.workspaceFolderUri);
        }
        else {
            this._currentOptions = options && this.find(options.configuration, options.workspaceFolderUri, options.providerType);
        }
        if (!this._currentOptions) {
            const model = this.getModel();
            if (model) {
                const configuration = model.configurations[0];
                if (configuration) {
                    this._currentOptions = this.configurationToOptions(configuration, model.workspaceFolderUri);
                }
            }
        }
        this.debugConfigurationTypeKey.set(this.current && ((_a = this.current.configuration) === null || _a === void 0 ? void 0 : _a.type));
        this.onDidChangeEmitter.fire(undefined);
    }
    find(nameOrConfigurationOrCompound, workspaceFolderUri, providerType) {
        if (debug_common_1.DebugConfiguration.is(nameOrConfigurationOrCompound) && providerType) {
            // providerType is only applicable to dynamic debug configurations and may only be created if we have a configuration given
            return this.configurationToOptions(nameOrConfigurationOrCompound, workspaceFolderUri, providerType);
        }
        const name = typeof nameOrConfigurationOrCompound === 'string' ? nameOrConfigurationOrCompound : nameOrConfigurationOrCompound.name;
        const configuration = this.findConfiguration(name, workspaceFolderUri);
        if (configuration) {
            return this.configurationToOptions(configuration, workspaceFolderUri);
        }
        const compound = this.findCompound(name, workspaceFolderUri);
        if (compound) {
            return this.compoundToOptions(compound, workspaceFolderUri);
        }
    }
    findConfigurations(name, workspaceFolderUri) {
        const matches = [];
        for (const model of this.models.values()) {
            if (model.workspaceFolderUri === workspaceFolderUri) {
                for (const configuration of model.configurations) {
                    if (configuration.name === name) {
                        matches.push(configuration);
                    }
                }
            }
        }
        return matches;
    }
    findConfiguration(name, workspaceFolderUri) {
        for (const model of this.models.values()) {
            if (model.workspaceFolderUri === workspaceFolderUri) {
                for (const configuration of model.configurations) {
                    if (configuration.name === name) {
                        return configuration;
                    }
                }
            }
        }
    }
    findCompound(name, workspaceFolderUri) {
        for (const model of this.models.values()) {
            if (model.workspaceFolderUri === workspaceFolderUri) {
                for (const compound of model.compounds) {
                    if (compound.name === name) {
                        return compound;
                    }
                }
            }
        }
    }
    async openConfiguration() {
        var _a;
        const currentUri = new uri_1.default((_a = this.current) === null || _a === void 0 ? void 0 : _a.workspaceFolderUri);
        const model = this.getModel(currentUri);
        if (model) {
            await this.doOpen(model);
        }
    }
    configurationToOptions(configuration, workspaceFolderUri, providerType) {
        return { name: configuration.name, configuration, providerType, workspaceFolderUri };
    }
    compoundToOptions(compound, workspaceFolderUri) {
        return { name: compound.name, compound, workspaceFolderUri };
    }
    async addConfiguration() {
        let rootUri = undefined;
        if (this.workspaceService.saved && this.workspaceService.tryGetRoots().length > 1) {
            rootUri = await this.selectRootUri();
            // Do not continue if the user explicitly does not choose a location.
            if (!rootUri) {
                return;
            }
        }
        const model = this.getModel(rootUri);
        if (!model) {
            return;
        }
        const widget = await this.doOpen(model);
        if (!(widget.editor instanceof monaco_editor_1.MonacoEditor)) {
            return;
        }
        const editor = widget.editor.getControl();
        const commandService = standaloneServices_1.StandaloneServices.get(commands_1.ICommandService);
        let position;
        let depthInArray = 0;
        let lastProperty = '';
        (0, jsonc_parser_1.visit)(editor.getValue(), {
            onObjectProperty: property => {
                lastProperty = property;
            },
            onArrayBegin: offset => {
                if (lastProperty === 'configurations' && depthInArray === 0) {
                    position = editor.getModel().getPositionAt(offset + 1);
                }
                depthInArray++;
            },
            onArrayEnd: () => {
                depthInArray--;
            }
        });
        if (!position) {
            return;
        }
        // Check if there are more characters on a line after a "configurations": [, if yes enter a newline
        if (editor.getModel().getLineLastNonWhitespaceColumn(position.lineNumber) > position.column) {
            editor.setPosition(position);
            editor.trigger('debug', 'lineBreakInsert', undefined);
        }
        // Check if there is already an empty line to insert suggest, if yes just place the cursor
        if (editor.getModel().getLineLastNonWhitespaceColumn(position.lineNumber + 1) === 0) {
            editor.setPosition({ lineNumber: position.lineNumber + 1, column: 1 << 30 });
            await commandService.executeCommand('editor.action.deleteLines');
        }
        editor.setPosition(position);
        await commandService.executeCommand('editor.action.insertLineAfter');
        await commandService.executeCommand('editor.action.triggerSuggest');
    }
    async selectRootUri() {
        const workspaceRoots = this.workspaceService.tryGetRoots();
        const items = [];
        for (const workspaceRoot of workspaceRoots) {
            items.push({
                label: this.labelProvider.getName(workspaceRoot.resource),
                description: this.labelProvider.getLongName(workspaceRoot.resource),
                value: workspaceRoot.resource
            });
        }
        const root = await this.quickPickService.show(items, {
            placeholder: core_1.nls.localize('theia/debug/addConfigurationPlaceholder', 'Select workspace root to add configuration to'),
        });
        return root === null || root === void 0 ? void 0 : root.value;
    }
    getModel(uri) {
        const workspaceFolderUri = this.workspaceVariables.getWorkspaceRootUri(uri);
        if (workspaceFolderUri) {
            const key = workspaceFolderUri.toString();
            for (const model of this.models.values()) {
                if (model.workspaceFolderUri === key) {
                    return model;
                }
            }
        }
        for (const model of this.models.values()) {
            if (model.uri) {
                return model;
            }
        }
        return this.models.values().next().value;
    }
    async doOpen(model) {
        const uri = await this.doCreate(model);
        return this.editorManager.open(uri, {
            mode: 'activate'
        });
    }
    async doCreate(model) {
        var _a;
        const uri = (_a = model.uri) !== null && _a !== void 0 ? _a : this.preferences.getConfigUri(browser_2.PreferenceScope.Folder, model.workspaceFolderUri, 'launch');
        if (!uri) { // Since we are requesting information about a known workspace folder, this should never happen.
            throw new Error('PreferenceService.getConfigUri has returned undefined when a URI was expected.');
        }
        const settingsUri = this.preferences.getConfigUri(browser_2.PreferenceScope.Folder, model.workspaceFolderUri);
        // Users may have placed their debug configurations in a `settings.json`, in which case we shouldn't modify the file.
        if (settingsUri && !uri.isEqual(settingsUri)) {
            await this.ensureContent(uri, model);
        }
        return uri;
    }
    /**
     * Checks whether a `launch.json` file contains the minimum necessary content.
     * If content not found, provides content and populates the file using Monaco.
     */
    async ensureContent(uri, model) {
        const textModel = await this.textModelService.createModelReference(uri);
        const currentContent = textModel.object.valid ? textModel.object.getText() : '';
        try { // Look for the minimal well-formed launch.json content: {configurations: []}
            const parsedContent = (0, jsonc_parser_1.parse)(currentContent);
            if (Array.isArray(parsedContent.configurations)) {
                return;
            }
        }
        catch {
            // Just keep going
        }
        const debugType = await this.selectDebugType();
        const configurations = debugType ? await this.provideDebugConfigurations(debugType, model.workspaceFolderUri) : [];
        const content = this.getInitialConfigurationContent(configurations);
        textModel.object.textEditorModel.setValue(content); // Will clobber anything the user has entered!
        await textModel.object.save();
    }
    async provideDebugConfigurations(debugType, workspaceFolderUri) {
        await this.fireWillProvideDebugConfiguration();
        return this.debug.provideDebugConfigurations(debugType, workspaceFolderUri);
    }
    async fireWillProvideDebugConfiguration() {
        await event_1.WaitUntilEvent.fire(this.onWillProvideDebugConfigurationEmitter, {});
    }
    async provideDynamicDebugConfigurations() {
        await this.fireWillProvideDynamicDebugConfiguration();
        const roots = this.workspaceService.tryGetRoots();
        const promises = roots.map(async (root) => {
            const configsMap = await this.debug.provideDynamicDebugConfigurations(root.resource.toString());
            const optionsMap = Object.fromEntries(Object.entries(configsMap).map(([type, configs]) => {
                const options = configs.map(config => ({
                    name: config.name,
                    providerType: type,
                    configuration: config,
                    workspaceFolderUri: root.resource.toString()
                }));
                return [type, options];
            }));
            return optionsMap;
        });
        const typesToOptionsRecords = await Promise.all(promises);
        const consolidatedTypesToOptions = {};
        for (const typesToOptionsInstance of typesToOptionsRecords) {
            for (const [providerType, configurationsOptions] of Object.entries(typesToOptionsInstance)) {
                if (!consolidatedTypesToOptions[providerType]) {
                    consolidatedTypesToOptions[providerType] = [];
                }
                consolidatedTypesToOptions[providerType].push(...configurationsOptions);
            }
        }
        return consolidatedTypesToOptions;
    }
    async fetchDynamicDebugConfiguration(name, type, folder) {
        await this.fireWillProvideDynamicDebugConfiguration();
        return this.debug.fetchDynamicDebugConfiguration(name, type, folder);
    }
    async fireWillProvideDynamicDebugConfiguration() {
        await this.initialized;
        await event_1.WaitUntilEvent.fire(this.onWillProvideDynamicDebugConfigurationEmitter, {});
    }
    getInitialConfigurationContent(initialConfigurations) {
        return `{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  "version": "0.2.0",
  "configurations": ${JSON.stringify(initialConfigurations, undefined, '  ').split('\n').map(line => '  ' + line).join('\n').trim()}
}
`;
    }
    async selectDebugType() {
        const widget = this.editorManager.currentEditor;
        if (!widget) {
            return undefined;
        }
        const { languageId } = widget.editor.document;
        const debuggers = await this.debug.getDebuggersForLanguage(languageId);
        if (debuggers.length === 0) {
            return undefined;
        }
        const items = debuggers.map(({ label, type }) => ({ label, value: type }));
        const selectedItem = await this.quickPickService.show(items, { placeholder: 'Select Environment' });
        return selectedItem === null || selectedItem === void 0 ? void 0 : selectedItem.value;
    }
    async load() {
        var _a, _b;
        await this.initialized;
        const data = await this.storage.getData('debug.configurations', {});
        this.resolveRecentDynamicOptionsFromData(data.recentDynamicOptions);
        // Between versions v1.26 and v1.27, the expected format of the data changed so that old stored data
        // may not contain the configuration key.
        if (debug_session_options_1.DebugSessionOptions.isConfiguration(data.current)) {
            // ensure options name is reflected from old configurations data
            data.current.name = (_a = data.current.name) !== null && _a !== void 0 ? _a : (_b = data.current.configuration) === null || _b === void 0 ? void 0 : _b.name;
            this.current = this.find(data.current.configuration, data.current.workspaceFolderUri, data.current.providerType);
        }
        else if (debug_session_options_1.DebugSessionOptions.isCompound(data.current)) {
            this.current = this.find(data.current.name, data.current.workspaceFolderUri);
        }
    }
    resolveRecentDynamicOptionsFromData(options) {
        if (!options || this.recentDynamicOptionsTracker.length !== 0) {
            return;
        }
        // ensure options name is reflected from old configurations data
        const dynamicOptions = options.map(option => {
            var _a;
            option.name = (_a = option.name) !== null && _a !== void 0 ? _a : option.configuration.name;
            return option;
        }).filter(debug_session_options_1.DebugSessionOptions.isDynamic);
        this.recentDynamicOptionsTracker = dynamicOptions;
    }
    save() {
        const data = {};
        const { current, recentDynamicOptionsTracker } = this;
        if (current) {
            data.current = current;
        }
        if (this.recentDynamicOptionsTracker.length > 0) {
            data.recentDynamicOptions = recentDynamicOptionsTracker;
        }
        if (Object.keys(data).length > 0) {
            this.storage.setData('debug.configurations', data);
        }
    }
};
__decorate([
    (0, inversify_1.inject)(workspace_service_1.WorkspaceService),
    __metadata("design:type", workspace_service_1.WorkspaceService)
], DebugConfigurationManager.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.EditorManager),
    __metadata("design:type", browser_1.EditorManager)
], DebugConfigurationManager.prototype, "editorManager", void 0);
__decorate([
    (0, inversify_1.inject)(debug_service_1.DebugService),
    __metadata("design:type", Object)
], DebugConfigurationManager.prototype, "debug", void 0);
__decorate([
    (0, inversify_1.inject)(quick_pick_service_1.QuickPickService),
    __metadata("design:type", Object)
], DebugConfigurationManager.prototype, "quickPickService", void 0);
__decorate([
    (0, inversify_1.inject)(context_key_service_1.ContextKeyService),
    __metadata("design:type", Object)
], DebugConfigurationManager.prototype, "contextKeyService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.LabelProvider),
    __metadata("design:type", browser_2.LabelProvider)
], DebugConfigurationManager.prototype, "labelProvider", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_text_model_service_1.MonacoTextModelService),
    __metadata("design:type", monaco_text_model_service_1.MonacoTextModelService)
], DebugConfigurationManager.prototype, "textModelService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.PreferenceService),
    __metadata("design:type", Object)
], DebugConfigurationManager.prototype, "preferences", void 0);
__decorate([
    (0, inversify_1.inject)(preference_configurations_1.PreferenceConfigurations),
    __metadata("design:type", preference_configurations_1.PreferenceConfigurations)
], DebugConfigurationManager.prototype, "preferenceConfigurations", void 0);
__decorate([
    (0, inversify_1.inject)(workspace_variable_contribution_1.WorkspaceVariableContribution),
    __metadata("design:type", workspace_variable_contribution_1.WorkspaceVariableContribution)
], DebugConfigurationManager.prototype, "workspaceVariables", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DebugConfigurationManager.prototype, "init", null);
__decorate([
    (0, inversify_1.inject)(browser_2.StorageService),
    __metadata("design:type", Object)
], DebugConfigurationManager.prototype, "storage", void 0);
DebugConfigurationManager = __decorate([
    (0, inversify_1.injectable)()
], DebugConfigurationManager);
exports.DebugConfigurationManager = DebugConfigurationManager;
//# sourceMappingURL=debug-configuration-manager.js.map