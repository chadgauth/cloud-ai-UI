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
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// some code copied and modified from https://github.com/microsoft/vscode/blob/da5fb7d5b865aa522abc7e82c10b746834b98639/src/vs/workbench/api/node/extHostExtensionService.ts
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
exports.PluginContributions = exports.HostedPluginSupport = exports.ALL_ACTIVATION_EVENT = exports.PluginProgressLocation = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const debounce = require("@theia/core/shared/lodash.debounce");
const coreutils_1 = require("@theia/core/shared/@phosphor/coreutils");
const inversify_1 = require("@theia/core/shared/inversify");
const plugin_worker_1 = require("./plugin-worker");
const plugin_protocol_1 = require("../../common/plugin-protocol");
const hosted_plugin_watcher_1 = require("./hosted-plugin-watcher");
const plugin_api_rpc_1 = require("../../common/plugin-api-rpc");
const main_context_1 = require("../../main/browser/main-context");
const rpc_protocol_1 = require("../../common/rpc-protocol");
const core_1 = require("@theia/core");
const preferences_1 = require("@theia/core/lib/browser/preferences");
const browser_1 = require("@theia/workspace/lib/browser");
const plugin_contribution_handler_1 = require("../../main/browser/plugin-contribution-handler");
const env_main_1 = require("../../main/browser/env-main");
const plugin_ext_api_contribution_1 = require("../../common/plugin-ext-api-contribution");
const plugin_paths_protocol_1 = require("../../main/common/plugin-paths-protocol");
const preference_registry_main_1 = require("../../main/browser/preference-registry-main");
const promise_util_1 = require("@theia/core/lib/common/promise-util");
const debug_session_manager_1 = require("@theia/debug/lib/browser/debug-session-manager");
const debug_configuration_manager_1 = require("@theia/debug/lib/browser/debug-configuration-manager");
const file_search_service_1 = require("@theia/file-search/lib/common/file-search-service");
const frontend_application_state_1 = require("@theia/core/lib/browser/frontend-application-state");
const plugin_view_registry_1 = require("../../main/browser/view/plugin-view-registry");
const task_contribution_1 = require("@theia/task/lib/browser/task-contribution");
const task_definition_registry_1 = require("@theia/task/lib/browser/task-definition-registry");
const webview_environment_1 = require("../../main/browser/webview/webview-environment");
const webview_1 = require("../../main/browser/webview/webview");
const widget_manager_1 = require("@theia/core/lib/browser/widget-manager");
const terminal_service_1 = require("@theia/terminal/lib/browser/base/terminal-service");
const env_variables_1 = require("@theia/core/lib/common/env-variables");
const uri_1 = require("@theia/core/lib/common/uri");
const frontend_application_config_provider_1 = require("@theia/core/lib/browser/frontend-application-config-provider");
const environment_1 = require("@theia/core/shared/@theia/application-package/lib/environment");
const json_schema_store_1 = require("@theia/core/lib/browser/json-schema-store");
const file_service_1 = require("@theia/filesystem/lib/browser/file-service");
const plugin_custom_editor_registry_1 = require("../../main/browser/custom-editors/plugin-custom-editor-registry");
const custom_editor_widget_1 = require("../../main/browser/custom-editors/custom-editor-widget");
const standaloneServices_1 = require("@theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices");
const language_1 = require("@theia/monaco-editor-core/esm/vs/editor/common/languages/language");
const common_1 = require("@theia/core/lib/common");
const uint8_array_message_buffer_1 = require("@theia/core/lib/common/message-rpc/uint8-array-message-buffer");
const channel_1 = require("@theia/core/lib/common/message-rpc/channel");
const browser_2 = require("@theia/notebook/lib/browser");
exports.PluginProgressLocation = 'plugin';
exports.ALL_ACTIVATION_EVENT = '*';
let HostedPluginSupport = class HostedPluginSupport {
    constructor() {
        this.clientId = coreutils_1.UUID.uuid4();
        this.managers = new Map();
        this.contributions = new Map();
        this.activationEvents = new Set();
        this.onDidChangePluginsEmitter = new core_1.Emitter();
        this.onDidChangePlugins = this.onDidChangePluginsEmitter.event;
        this.deferredWillStart = new promise_util_1.Deferred();
        this.deferredDidStart = new promise_util_1.Deferred();
        this.loadQueue = Promise.resolve(undefined);
        this.load = debounce(() => this.loadQueue = this.loadQueue.then(async () => {
            try {
                await this.progressService.withProgress('', exports.PluginProgressLocation, () => this.doLoad());
            }
            catch (e) {
                console.error('Failed to load plugins:', e);
            }
        }), 50, { leading: true });
        this.webviewsToRestore = new Map();
        this.webviewRevivers = new Map();
    }
    /**
     * Resolves when the initial plugins are loaded and about to be started.
     */
    get willStart() {
        return this.deferredWillStart.promise;
    }
    /**
     * Resolves when the initial plugins are started.
     */
    get didStart() {
        return this.deferredDidStart.promise;
    }
    init() {
        this.theiaReadyPromise = Promise.all([this.preferenceServiceImpl.ready, this.workspaceService.roots]);
        this.workspaceService.onWorkspaceChanged(() => this.updateStoragePath());
        const languageService = standaloneServices_1.StandaloneServices.get(language_1.ILanguageService);
        for (const language of languageService['_encounteredLanguages']) {
            this.activateByLanguage(language);
        }
        languageService.onDidEncounterLanguage(language => this.activateByLanguage(language));
        this.commands.onWillExecuteCommand(event => this.ensureCommandHandlerRegistration(event));
        this.debugSessionManager.onWillStartDebugSession(event => this.ensureDebugActivation(event));
        this.debugSessionManager.onWillResolveDebugConfiguration(event => this.ensureDebugActivation(event, 'onDebugResolve', event.debugType));
        this.debugConfigurationManager.onWillProvideDebugConfiguration(event => this.ensureDebugActivation(event, 'onDebugInitialConfigurations'));
        // Activate all providers of dynamic configurations, i.e. Let the user pick a configuration from all the available ones.
        this.debugConfigurationManager.onWillProvideDynamicDebugConfiguration(event => this.ensureDebugActivation(event, 'onDebugDynamicConfigurations', exports.ALL_ACTIVATION_EVENT));
        this.viewRegistry.onDidExpandView(id => this.activateByView(id));
        this.taskProviderRegistry.onWillProvideTaskProvider(event => this.ensureTaskActivation(event));
        this.taskResolverRegistry.onWillProvideTaskResolver(event => this.ensureTaskActivation(event));
        this.fileService.onWillActivateFileSystemProvider(event => this.ensureFileSystemActivation(event));
        this.customEditorRegistry.onWillOpenCustomEditor(event => this.activateByCustomEditor(event));
        this.notebookService.onWillOpenNotebook(async (event) => this.activateByNotebook(event));
        this.widgets.onDidCreateWidget(({ factoryId, widget }) => {
            if ((factoryId === webview_1.WebviewWidget.FACTORY_ID || factoryId === custom_editor_widget_1.CustomEditorWidget.FACTORY_ID) && widget instanceof webview_1.WebviewWidget) {
                const storeState = widget.storeState.bind(widget);
                const restoreState = widget.restoreState.bind(widget);
                widget.storeState = () => {
                    if (this.webviewRevivers.has(widget.viewType)) {
                        return storeState();
                    }
                    return undefined;
                };
                widget.restoreState = state => {
                    if (state.viewType) {
                        restoreState(state);
                        this.preserveWebview(widget);
                    }
                    else {
                        widget.dispose();
                    }
                };
            }
        });
    }
    get plugins() {
        const plugins = [];
        this.contributions.forEach(contributions => plugins.push(contributions.plugin.metadata));
        return plugins;
    }
    getPlugin(id) {
        const contributions = this.contributions.get(id);
        return contributions && contributions.plugin;
    }
    /** do not call it, except from the plugin frontend contribution */
    onStart(container) {
        this.container = container;
        this.load();
        this.watcher.onDidDeploy(() => this.load());
        this.server.onDidOpenConnection(() => this.load());
    }
    async doLoad() {
        const toDisconnect = new core_1.DisposableCollection(core_1.Disposable.create(() => { }));
        toDisconnect.push(core_1.Disposable.create(() => this.preserveWebviews()));
        this.server.onDidCloseConnection(() => toDisconnect.dispose());
        // process empty plugins as well in order to properly remove stale plugin widgets
        await this.syncPlugins();
        // it has to be resolved before awaiting layout is initialized
        // otherwise clients can hang forever in the initialization phase
        this.deferredWillStart.resolve();
        // make sure that the previous state, including plugin widgets, is restored
        // and core layout is initialized, i.e. explorer, scm, debug views are already added to the shell
        // but shell is not yet revealed
        await this.appState.reachedState('initialized_layout');
        if (toDisconnect.disposed) {
            // if disconnected then don't try to load plugin contributions
            return;
        }
        const contributionsByHost = this.loadContributions(toDisconnect);
        await this.viewRegistry.initWidgets();
        // remove restored plugin widgets which were not registered by contributions
        this.viewRegistry.removeStaleWidgets();
        await this.theiaReadyPromise;
        if (toDisconnect.disposed) {
            // if disconnected then don't try to init plugin code and dynamic contributions
            return;
        }
        await this.startPlugins(contributionsByHost, toDisconnect);
        this.deferredDidStart.resolve();
    }
    /**
     * Sync loaded and deployed plugins:
     * - undeployed plugins are unloaded
     * - newly deployed plugins are initialized
     */
    async syncPlugins() {
        var _a;
        let initialized = 0;
        const waitPluginsMeasurement = this.measure('waitForDeployment');
        let syncPluginsMeasurement;
        const toUnload = new Set(this.contributions.keys());
        let didChangeInstallationStatus = false;
        try {
            const newPluginIds = [];
            const [deployedPluginIds, uninstalledPluginIds] = await Promise.all([this.server.getDeployedPluginIds(), this.server.getUninstalledPluginIds()]);
            waitPluginsMeasurement.log('Waiting for backend deployment');
            syncPluginsMeasurement = this.measure('syncPlugins');
            for (const versionedId of deployedPluginIds) {
                const unversionedId = plugin_protocol_1.PluginIdentifiers.unversionedFromVersioned(versionedId);
                toUnload.delete(unversionedId);
                if (!this.contributions.has(unversionedId)) {
                    newPluginIds.push(versionedId);
                }
            }
            for (const pluginId of toUnload) {
                (_a = this.contributions.get(pluginId)) === null || _a === void 0 ? void 0 : _a.dispose();
            }
            for (const versionedId of uninstalledPluginIds) {
                const plugin = this.getPlugin(plugin_protocol_1.PluginIdentifiers.unversionedFromVersioned(versionedId));
                if (plugin && plugin_protocol_1.PluginIdentifiers.componentsToVersionedId(plugin.metadata.model) === versionedId && !plugin.metadata.outOfSync) {
                    plugin.metadata.outOfSync = didChangeInstallationStatus = true;
                }
            }
            for (const contribution of this.contributions.values()) {
                if (contribution.plugin.metadata.outOfSync && !uninstalledPluginIds.includes(plugin_protocol_1.PluginIdentifiers.componentsToVersionedId(contribution.plugin.metadata.model))) {
                    contribution.plugin.metadata.outOfSync = false;
                    didChangeInstallationStatus = true;
                }
            }
            if (newPluginIds.length) {
                const plugins = await this.server.getDeployedPlugins({ pluginIds: newPluginIds });
                for (const plugin of plugins) {
                    const pluginId = plugin_protocol_1.PluginIdentifiers.componentsToUnversionedId(plugin.metadata.model);
                    const contributions = new PluginContributions(plugin);
                    this.contributions.set(pluginId, contributions);
                    contributions.push(core_1.Disposable.create(() => this.contributions.delete(pluginId)));
                    initialized++;
                }
            }
        }
        finally {
            if (initialized || toUnload.size || didChangeInstallationStatus) {
                this.onDidChangePluginsEmitter.fire(undefined);
            }
            if (!syncPluginsMeasurement) {
                // await didn't complete normally
                waitPluginsMeasurement.error('Backend deployment failed.');
            }
        }
        syncPluginsMeasurement === null || syncPluginsMeasurement === void 0 ? void 0 : syncPluginsMeasurement.log(`Sync of ${this.getPluginCount(initialized)}`);
    }
    /**
     * Always synchronous in order to simplify handling disconnections.
     * @throws never
     */
    loadContributions(toDisconnect) {
        let loaded = 0;
        const loadPluginsMeasurement = this.measure('loadPlugins');
        const hostContributions = new Map();
        console.log(`[${this.clientId}] Loading plugin contributions`);
        for (const contributions of this.contributions.values()) {
            const plugin = contributions.plugin.metadata;
            const pluginId = plugin.model.id;
            if (contributions.state === PluginContributions.State.INITIALIZING) {
                contributions.state = PluginContributions.State.LOADING;
                contributions.push(core_1.Disposable.create(() => console.log(`[${pluginId}]: Unloaded plugin.`)));
                contributions.push(this.contributionHandler.handleContributions(this.clientId, contributions.plugin));
                contributions.state = PluginContributions.State.LOADED;
                console.debug(`[${this.clientId}][${pluginId}]: Loaded contributions.`);
                loaded++;
            }
            if (contributions.state === PluginContributions.State.LOADED) {
                contributions.state = PluginContributions.State.STARTING;
                const host = plugin.model.entryPoint.frontend ? 'frontend' : plugin.host;
                const dynamicContributions = hostContributions.get(host) || [];
                dynamicContributions.push(contributions);
                hostContributions.set(host, dynamicContributions);
                toDisconnect.push(core_1.Disposable.create(() => {
                    contributions.state = PluginContributions.State.LOADED;
                    console.debug(`[${this.clientId}][${pluginId}]: Disconnected.`);
                }));
            }
        }
        loadPluginsMeasurement.log(`Load contributions of ${this.getPluginCount(loaded)}`);
        return hostContributions;
    }
    async startPlugins(contributionsByHost, toDisconnect) {
        let started = 0;
        const startPluginsMeasurement = this.measure('startPlugins');
        const [hostLogPath, hostStoragePath, hostGlobalStoragePath] = await Promise.all([
            this.pluginPathsService.getHostLogPath(),
            this.getStoragePath(),
            this.getHostGlobalStoragePath()
        ]);
        if (toDisconnect.disposed) {
            return;
        }
        const thenable = [];
        const configStorage = {
            hostLogPath,
            hostStoragePath,
            hostGlobalStoragePath
        };
        for (const [host, hostContributions] of contributionsByHost) {
            // do not start plugins for electron browser
            if (host === 'frontend' && environment_1.environment.electron.is()) {
                continue;
            }
            const manager = await this.obtainManager(host, hostContributions, toDisconnect);
            if (!manager) {
                continue;
            }
            const plugins = hostContributions.map(contributions => contributions.plugin.metadata);
            thenable.push((async () => {
                try {
                    const activationEvents = [...this.activationEvents];
                    await manager.$start({ plugins, configStorage, activationEvents });
                    if (toDisconnect.disposed) {
                        return;
                    }
                    console.log(`[${this.clientId}] Starting plugins.`);
                    for (const contributions of hostContributions) {
                        started++;
                        const plugin = contributions.plugin;
                        const id = plugin.metadata.model.id;
                        contributions.state = PluginContributions.State.STARTED;
                        console.debug(`[${this.clientId}][${id}]: Started plugin.`);
                        toDisconnect.push(contributions.push(core_1.Disposable.create(() => {
                            console.debug(`[${this.clientId}][${id}]: Stopped plugin.`);
                            manager.$stop(id);
                        })));
                        this.activateByWorkspaceContains(manager, plugin);
                    }
                }
                catch (e) {
                    console.error(`Failed to start plugins for '${host}' host`, e);
                }
            })());
        }
        await Promise.all(thenable);
        await this.activateByEvent('onStartupFinished');
        if (toDisconnect.disposed) {
            return;
        }
        startPluginsMeasurement.log(`Start of ${this.getPluginCount(started)}`);
    }
    async obtainManager(host, hostContributions, toDisconnect) {
        var _a;
        let manager = this.managers.get(host);
        if (!manager) {
            const pluginId = (0, plugin_protocol_1.getPluginId)(hostContributions[0].plugin.metadata.model);
            const rpc = this.initRpc(host, pluginId);
            toDisconnect.push(rpc);
            manager = rpc.getProxy(plugin_api_rpc_1.MAIN_RPC_CONTEXT.HOSTED_PLUGIN_MANAGER_EXT);
            this.managers.set(host, manager);
            toDisconnect.push(core_1.Disposable.create(() => this.managers.delete(host)));
            const [extApi, globalState, workspaceState, webviewResourceRoot, webviewCspSource, defaultShell, jsonValidation] = await Promise.all([
                this.server.getExtPluginAPI(),
                this.pluginServer.getAllStorageValues(undefined),
                this.pluginServer.getAllStorageValues({
                    workspace: (_a = this.workspaceService.workspace) === null || _a === void 0 ? void 0 : _a.resource.toString(),
                    roots: this.workspaceService.tryGetRoots().map(root => root.resource.toString())
                }),
                this.webviewEnvironment.resourceRoot(host),
                this.webviewEnvironment.cspSource(),
                this.terminalService.getDefaultShell(),
                this.jsonSchemaStore.schemas
            ]);
            if (toDisconnect.disposed) {
                return undefined;
            }
            const isElectron = environment_1.environment.electron.is();
            await manager.$init({
                preferences: (0, preference_registry_main_1.getPreferences)(this.preferenceProviderProvider, this.workspaceService.tryGetRoots()),
                globalState,
                workspaceState,
                env: {
                    queryParams: (0, env_main_1.getQueryParameters)(),
                    language: core_1.nls.locale || core_1.nls.defaultLocale,
                    shell: defaultShell,
                    uiKind: isElectron ? plugin_api_rpc_1.UIKind.Desktop : plugin_api_rpc_1.UIKind.Web,
                    appName: frontend_application_config_provider_1.FrontendApplicationConfigProvider.get().applicationName,
                    appHost: isElectron ? 'desktop' : 'web' // TODO: 'web' could be the embedder's name, e.g. 'github.dev'
                },
                extApi,
                webview: {
                    webviewResourceRoot,
                    webviewCspSource
                },
                jsonValidation
            });
            if (toDisconnect.disposed) {
                return undefined;
            }
        }
        return manager;
    }
    initRpc(host, pluginId) {
        const rpc = host === 'frontend' ? new plugin_worker_1.PluginWorker().rpc : this.createServerRpc(host);
        (0, main_context_1.setUpPluginApi)(rpc, this.container);
        this.mainPluginApiProviders.getContributions().forEach(p => p.initialize(rpc, this.container));
        return rpc;
    }
    createServerRpc(pluginHostId) {
        const channel = new channel_1.BasicChannel(() => {
            const writer = new uint8_array_message_buffer_1.Uint8ArrayWriteBuffer();
            writer.onCommit(buffer => {
                this.server.onMessage(pluginHostId, buffer);
            });
            return writer;
        });
        // Create RPC protocol before adding the listener to the watcher to receive the watcher's cached messages after the rpc protocol was created.
        const rpc = new rpc_protocol_1.RPCProtocolImpl(channel);
        this.watcher.onPostMessageEvent(received => {
            if (pluginHostId === received.pluginHostId) {
                channel.onMessageEmitter.fire(() => new uint8_array_message_buffer_1.Uint8ArrayReadBuffer(received.message));
            }
        });
        return rpc;
    }
    async updateStoragePath() {
        const path = await this.getStoragePath();
        for (const manager of this.managers.values()) {
            manager.$updateStoragePath(path);
        }
    }
    async getStoragePath() {
        var _a;
        const roots = await this.workspaceService.roots;
        return this.pluginPathsService.getHostStoragePath((_a = this.workspaceService.workspace) === null || _a === void 0 ? void 0 : _a.resource.toString(), roots.map(root => root.resource.toString()));
    }
    async getHostGlobalStoragePath() {
        const configDirUri = await this.envServer.getConfigDirUri();
        const globalStorageFolderUri = new uri_1.default(configDirUri).resolve('globalStorage');
        // Make sure that folder by the path exists
        if (!await this.fileService.exists(globalStorageFolderUri)) {
            await this.fileService.createFolder(globalStorageFolderUri, { fromUserGesture: false });
        }
        const globalStorageFolderFsPath = await this.fileService.fsPath(globalStorageFolderUri);
        if (!globalStorageFolderFsPath) {
            throw new Error(`Could not resolve the FS path for URI: ${globalStorageFolderUri}`);
        }
        return globalStorageFolderFsPath;
    }
    async activateByEvent(activationEvent) {
        if (this.activationEvents.has(activationEvent)) {
            return;
        }
        this.activationEvents.add(activationEvent);
        await Promise.all(Array.from(this.managers.values(), manager => manager.$activateByEvent(activationEvent)));
    }
    async activateByViewContainer(viewContainerId) {
        await Promise.all(this.viewRegistry.getContainerViews(viewContainerId).map(viewId => this.activateByView(viewId)));
    }
    async activateByView(viewId) {
        await this.activateByEvent(`onView:${viewId}`);
    }
    async activateByLanguage(languageId) {
        await this.activateByEvent(`onLanguage:${languageId}`);
    }
    async activateByCommand(commandId) {
        await this.activateByEvent(`onCommand:${commandId}`);
    }
    async activateByTaskType(taskType) {
        await this.activateByEvent(`onTaskType:${taskType}`);
    }
    async activateByCustomEditor(viewType) {
        await this.activateByEvent(`onCustomEditor:${viewType}`);
    }
    async activateByNotebook(viewType) {
        await this.activateByEvent(`onNotebook:${viewType}`);
    }
    activateByFileSystem(event) {
        return this.activateByEvent(`onFileSystem:${event.scheme}`);
    }
    activateByTerminalProfile(profileId) {
        return this.activateByEvent(`onTerminalProfile:${profileId}`);
    }
    ensureFileSystemActivation(event) {
        event.waitUntil(this.activateByFileSystem(event));
    }
    ensureCommandHandlerRegistration(event) {
        const activation = this.activateByCommand(event.commandId);
        if (this.commands.getCommand(event.commandId) &&
            (!this.contributionHandler.hasCommand(event.commandId) ||
                this.contributionHandler.hasCommandHandler(event.commandId))) {
            return;
        }
        const waitForCommandHandler = new promise_util_1.Deferred();
        const listener = this.contributionHandler.onDidRegisterCommandHandler(id => {
            if (id === event.commandId) {
                listener.dispose();
                waitForCommandHandler.resolve();
            }
        });
        const p = Promise.all([
            activation,
            waitForCommandHandler.promise
        ]);
        p.then(() => listener.dispose(), () => listener.dispose());
        event.waitUntil(p);
    }
    ensureTaskActivation(event) {
        const promises = [this.activateByCommand('workbench.action.tasks.runTask')];
        const taskType = event.taskType;
        if (taskType) {
            if (taskType === exports.ALL_ACTIVATION_EVENT) {
                for (const taskDefinition of this.taskDefinitionRegistry.getAll()) {
                    promises.push(this.activateByTaskType(taskDefinition.taskType));
                }
            }
            else {
                promises.push(this.activateByTaskType(taskType));
            }
        }
        event.waitUntil(Promise.all(promises));
    }
    ensureDebugActivation(event, activationEvent, debugType) {
        event.waitUntil(this.activateByDebug(activationEvent, debugType));
    }
    async activateByDebug(activationEvent, debugType) {
        const promises = [this.activateByEvent('onDebug')];
        if (activationEvent) {
            promises.push(this.activateByEvent(activationEvent));
            if (debugType) {
                promises.push(this.activateByEvent(activationEvent + ':' + debugType));
            }
        }
        await Promise.all(promises);
    }
    async activateByWorkspaceContains(manager, plugin) {
        const activationEvents = plugin.contributes && plugin.contributes.activationEvents;
        if (!activationEvents) {
            return;
        }
        const paths = [];
        const includePatterns = [];
        // should be aligned with https://github.com/microsoft/vscode/blob/da5fb7d5b865aa522abc7e82c10b746834b98639/src/vs/workbench/api/node/extHostExtensionService.ts#L460-L469
        for (const activationEvent of activationEvents) {
            if (/^workspaceContains:/.test(activationEvent)) {
                const fileNameOrGlob = activationEvent.substring('workspaceContains:'.length);
                if (fileNameOrGlob.indexOf(exports.ALL_ACTIVATION_EVENT) >= 0 || fileNameOrGlob.indexOf('?') >= 0) {
                    includePatterns.push(fileNameOrGlob);
                }
                else {
                    paths.push(fileNameOrGlob);
                }
            }
        }
        const activatePlugin = () => manager.$activateByEvent(`onPlugin:${plugin.metadata.model.id}`);
        const promises = [];
        if (paths.length) {
            promises.push(this.workspaceService.containsSome(paths));
        }
        if (includePatterns.length) {
            const tokenSource = new core_1.CancellationTokenSource();
            const searchTimeout = setTimeout(() => {
                tokenSource.cancel();
                // activate eagerly if took to long to search
                activatePlugin();
            }, 7000);
            promises.push((async () => {
                try {
                    const result = await this.fileSearchService.find('', {
                        rootUris: this.workspaceService.tryGetRoots().map(r => r.resource.toString()),
                        includePatterns,
                        limit: 1
                    }, tokenSource.token);
                    return result.length > 0;
                }
                catch (e) {
                    if (!(0, core_1.isCancelled)(e)) {
                        console.error(e);
                    }
                    return false;
                }
                finally {
                    clearTimeout(searchTimeout);
                }
            })());
        }
        if (promises.length && await Promise.all(promises).then(exists => exists.some(v => v))) {
            await activatePlugin();
        }
    }
    async activatePlugin(id) {
        const activation = [];
        for (const manager of this.managers.values()) {
            activation.push(manager.$activatePlugin(id));
        }
        await Promise.all(activation);
    }
    measure(name) {
        return this.stopwatch.start(name, { context: this.clientId });
    }
    getPluginCount(plugins) {
        return `${plugins} plugin${plugins === 1 ? '' : 's'}`;
    }
    registerWebviewReviver(viewType, reviver) {
        if (this.webviewRevivers.has(viewType)) {
            throw new Error(`Reviver for ${viewType} already registered`);
        }
        this.webviewRevivers.set(viewType, reviver);
        if (this.webviewsToRestore.has(viewType)) {
            this.restoreWebview(this.webviewsToRestore.get(viewType));
        }
    }
    unregisterWebviewReviver(viewType) {
        this.webviewRevivers.delete(viewType);
    }
    async preserveWebviews() {
        for (const webview of this.widgets.getWidgets(webview_1.WebviewWidget.FACTORY_ID)) {
            this.preserveWebview(webview);
        }
        for (const webview of this.widgets.getWidgets(custom_editor_widget_1.CustomEditorWidget.FACTORY_ID)) {
            webview.modelRef.dispose();
            if (webview['closeWithoutSaving']) {
                delete webview['closeWithoutSaving'];
            }
            this.customEditorRegistry.resolveWidget(webview);
        }
    }
    preserveWebview(webview) {
        if (!this.webviewsToRestore.has(webview.viewType)) {
            this.activateByEvent(`onWebviewPanel:${webview.viewType}`);
            this.webviewsToRestore.set(webview.viewType, webview);
            webview.disposed.connect(() => this.webviewsToRestore.delete(webview.viewType));
        }
    }
    async restoreWebview(webview) {
        const restore = this.webviewRevivers.get(webview.viewType);
        if (restore) {
            try {
                await restore(webview);
            }
            catch (e) {
                webview.setHTML(this.getDeserializationFailedContents(`
                An error occurred while restoring '${webview.viewType}' view. Please check logs.
                `));
                console.error('Failed to restore the webview', e);
            }
        }
    }
    getDeserializationFailedContents(message) {
        return `<!DOCTYPE html>
        <html>
            <head>
                <meta http-equiv="Content-type" content="text/html;charset=UTF-8">
                <meta http-equiv="Content-Security-Policy" content="default-src 'none';">
            </head>
            <body>${message}</body>
        </html>`;
    }
};
__decorate([
    (0, inversify_1.inject)(core_1.ILogger),
    __metadata("design:type", Object)
], HostedPluginSupport.prototype, "logger", void 0);
__decorate([
    (0, inversify_1.inject)(plugin_protocol_1.HostedPluginServer),
    __metadata("design:type", Object)
], HostedPluginSupport.prototype, "server", void 0);
__decorate([
    (0, inversify_1.inject)(hosted_plugin_watcher_1.HostedPluginWatcher),
    __metadata("design:type", hosted_plugin_watcher_1.HostedPluginWatcher)
], HostedPluginSupport.prototype, "watcher", void 0);
__decorate([
    (0, inversify_1.inject)(plugin_contribution_handler_1.PluginContributionHandler),
    __metadata("design:type", plugin_contribution_handler_1.PluginContributionHandler)
], HostedPluginSupport.prototype, "contributionHandler", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.ContributionProvider),
    (0, inversify_1.named)(plugin_ext_api_contribution_1.MainPluginApiProvider),
    __metadata("design:type", Object)
], HostedPluginSupport.prototype, "mainPluginApiProviders", void 0);
__decorate([
    (0, inversify_1.inject)(plugin_protocol_1.PluginServer),
    __metadata("design:type", Object)
], HostedPluginSupport.prototype, "pluginServer", void 0);
__decorate([
    (0, inversify_1.inject)(preferences_1.PreferenceProviderProvider),
    __metadata("design:type", Function)
], HostedPluginSupport.prototype, "preferenceProviderProvider", void 0);
__decorate([
    (0, inversify_1.inject)(preferences_1.PreferenceServiceImpl),
    __metadata("design:type", preferences_1.PreferenceServiceImpl)
], HostedPluginSupport.prototype, "preferenceServiceImpl", void 0);
__decorate([
    (0, inversify_1.inject)(plugin_paths_protocol_1.PluginPathsService),
    __metadata("design:type", Object)
], HostedPluginSupport.prototype, "pluginPathsService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.WorkspaceService),
    __metadata("design:type", browser_1.WorkspaceService)
], HostedPluginSupport.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.NotebookService),
    __metadata("design:type", browser_2.NotebookService)
], HostedPluginSupport.prototype, "notebookService", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.CommandRegistry),
    __metadata("design:type", core_1.CommandRegistry)
], HostedPluginSupport.prototype, "commands", void 0);
__decorate([
    (0, inversify_1.inject)(debug_session_manager_1.DebugSessionManager),
    __metadata("design:type", debug_session_manager_1.DebugSessionManager)
], HostedPluginSupport.prototype, "debugSessionManager", void 0);
__decorate([
    (0, inversify_1.inject)(debug_configuration_manager_1.DebugConfigurationManager),
    __metadata("design:type", debug_configuration_manager_1.DebugConfigurationManager)
], HostedPluginSupport.prototype, "debugConfigurationManager", void 0);
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], HostedPluginSupport.prototype, "fileService", void 0);
__decorate([
    (0, inversify_1.inject)(file_search_service_1.FileSearchService),
    __metadata("design:type", Object)
], HostedPluginSupport.prototype, "fileSearchService", void 0);
__decorate([
    (0, inversify_1.inject)(frontend_application_state_1.FrontendApplicationStateService),
    __metadata("design:type", frontend_application_state_1.FrontendApplicationStateService)
], HostedPluginSupport.prototype, "appState", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.NotebookTypeRegistry),
    __metadata("design:type", browser_2.NotebookTypeRegistry)
], HostedPluginSupport.prototype, "notebookTypeRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(plugin_view_registry_1.PluginViewRegistry),
    __metadata("design:type", plugin_view_registry_1.PluginViewRegistry)
], HostedPluginSupport.prototype, "viewRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(task_contribution_1.TaskProviderRegistry),
    __metadata("design:type", task_contribution_1.TaskProviderRegistry)
], HostedPluginSupport.prototype, "taskProviderRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(task_contribution_1.TaskResolverRegistry),
    __metadata("design:type", task_contribution_1.TaskResolverRegistry)
], HostedPluginSupport.prototype, "taskResolverRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(task_definition_registry_1.TaskDefinitionRegistry),
    __metadata("design:type", task_definition_registry_1.TaskDefinitionRegistry)
], HostedPluginSupport.prototype, "taskDefinitionRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.ProgressService),
    __metadata("design:type", core_1.ProgressService)
], HostedPluginSupport.prototype, "progressService", void 0);
__decorate([
    (0, inversify_1.inject)(webview_environment_1.WebviewEnvironment),
    __metadata("design:type", webview_environment_1.WebviewEnvironment)
], HostedPluginSupport.prototype, "webviewEnvironment", void 0);
__decorate([
    (0, inversify_1.inject)(widget_manager_1.WidgetManager),
    __metadata("design:type", widget_manager_1.WidgetManager)
], HostedPluginSupport.prototype, "widgets", void 0);
__decorate([
    (0, inversify_1.inject)(terminal_service_1.TerminalService),
    __metadata("design:type", Object)
], HostedPluginSupport.prototype, "terminalService", void 0);
__decorate([
    (0, inversify_1.inject)(env_variables_1.EnvVariablesServer),
    __metadata("design:type", Object)
], HostedPluginSupport.prototype, "envServer", void 0);
__decorate([
    (0, inversify_1.inject)(json_schema_store_1.JsonSchemaStore),
    __metadata("design:type", json_schema_store_1.JsonSchemaStore)
], HostedPluginSupport.prototype, "jsonSchemaStore", void 0);
__decorate([
    (0, inversify_1.inject)(plugin_custom_editor_registry_1.PluginCustomEditorRegistry),
    __metadata("design:type", plugin_custom_editor_registry_1.PluginCustomEditorRegistry)
], HostedPluginSupport.prototype, "customEditorRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.Stopwatch),
    __metadata("design:type", common_1.Stopwatch)
], HostedPluginSupport.prototype, "stopwatch", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HostedPluginSupport.prototype, "init", null);
HostedPluginSupport = __decorate([
    (0, inversify_1.injectable)()
], HostedPluginSupport);
exports.HostedPluginSupport = HostedPluginSupport;
class PluginContributions extends core_1.DisposableCollection {
    constructor(plugin) {
        super();
        this.plugin = plugin;
        this.state = PluginContributions.State.INITIALIZING;
    }
}
exports.PluginContributions = PluginContributions;
(function (PluginContributions) {
    let State;
    (function (State) {
        State[State["INITIALIZING"] = 0] = "INITIALIZING";
        State[State["LOADING"] = 1] = "LOADING";
        State[State["LOADED"] = 2] = "LOADED";
        State[State["STARTING"] = 3] = "STARTING";
        State[State["STARTED"] = 4] = "STARTED";
    })(State = PluginContributions.State || (PluginContributions.State = {}));
})(PluginContributions = exports.PluginContributions || (exports.PluginContributions = {}));
//# sourceMappingURL=hosted-plugin.js.map