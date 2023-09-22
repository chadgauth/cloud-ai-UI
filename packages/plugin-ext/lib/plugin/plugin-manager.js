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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginManagerExtImpl = void 0;
const plugin_api_rpc_1 = require("../common/plugin-api-rpc");
const types = require("./types-impl");
const path_1 = require("./path");
const plugin_storage_1 = require("./plugin-storage");
const event_1 = require("@theia/core/lib/common/event");
const types_impl_1 = require("./types-impl");
const secrets_ext_1 = require("../plugin/secrets-ext");
const plugin_context_1 = require("./plugin-context");
const promise_util_1 = require("@theia/core/lib/common/promise-util");
class ActivatedPlugin {
    constructor(pluginContext, exports, stopFn) {
        this.pluginContext = pluginContext;
        this.exports = exports;
        this.stopFn = stopFn;
    }
}
class PluginManagerExtImpl {
    constructor(host, envExt, terminalService, storageProxy, secrets, preferencesManager, webview, localization, rpc) {
        this.host = host;
        this.envExt = envExt;
        this.terminalService = terminalService;
        this.storageProxy = storageProxy;
        this.secrets = secrets;
        this.preferencesManager = preferencesManager;
        this.webview = webview;
        this.localization = localization;
        this.rpc = rpc;
        this.registry = new Map();
        this.activations = new Map();
        /** promises to whether loading each plugin has been successful */
        this.loadedPlugins = new Map();
        this.activatedPlugins = new Map();
        this.pluginContextsMap = new Map();
        this.onDidChangeEmitter = new event_1.Emitter();
        this.jsonValidation = [];
        this.ready = new promise_util_1.Deferred();
        this.messageRegistryProxy = this.rpc.getProxy(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.MESSAGE_REGISTRY_MAIN);
        this.notificationMain = this.rpc.getProxy(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.NOTIFICATION_MAIN);
    }
    fireOnDidChange() {
        this.onDidChangeEmitter.fire(undefined);
    }
    async $stop(pluginId) {
        if (!pluginId) {
            return this.stopAll();
        }
        this.registry.delete(pluginId);
        this.pluginContextsMap.delete(pluginId);
        this.loadedPlugins.delete(pluginId);
        const plugin = this.activatedPlugins.get(pluginId);
        if (!plugin) {
            return;
        }
        this.activatedPlugins.delete(pluginId);
        return this.stopPlugin(pluginId, plugin);
    }
    async terminate() {
        return this.stopAll({ terminating: true });
    }
    async stopAll(options = { terminating: false }) {
        const promises = [];
        for (const [id, plugin] of this.activatedPlugins) {
            promises.push(this.stopPlugin(id, plugin, options));
        }
        this.registry.clear();
        this.loadedPlugins.clear();
        this.activatedPlugins.clear();
        this.pluginContextsMap.clear();
        await Promise.all(promises);
    }
    async stopPlugin(id, plugin, options = { terminating: false }) {
        let result;
        if (plugin.stopFn) {
            try {
                result = plugin.stopFn();
            }
            catch (e) {
                if (!options.terminating) {
                    console.error(`[${id}]: failed to stop:`, e);
                }
            }
        }
        const pluginContext = plugin.pluginContext;
        if (pluginContext) {
            for (const subscription of pluginContext.subscriptions) {
                try {
                    subscription.dispose();
                }
                catch (e) {
                    if (!options.terminating) {
                        console.error(`[${id}]: failed to dispose subscription:`, e);
                    }
                }
            }
        }
        try {
            await result;
        }
        catch (e) {
            if (!options.terminating) {
                console.error(`[${id}]: failed to stop:`, e);
            }
        }
    }
    async $init(params) {
        this.storageProxy.init(params.globalState, params.workspaceState);
        this.envExt.setQueryParameters(params.env.queryParams);
        this.envExt.setLanguage(params.env.language);
        this.envExt.setShell(params.env.shell);
        this.envExt.setUIKind(params.env.uiKind);
        this.envExt.setApplicationName(params.env.appName);
        this.envExt.setAppHost(params.env.appHost);
        this.preferencesManager.init(params.preferences);
        if (params.extApi) {
            this.host.initExtApi(params.extApi);
        }
        this.webview.init(params.webview);
        this.jsonValidation = params.jsonValidation;
    }
    async $start(params) {
        this.configStorage = params.configStorage;
        const [plugins, foreignPlugins] = await this.host.init(params.plugins);
        // add foreign plugins
        for (const plugin of foreignPlugins) {
            this.registerPlugin(plugin);
        }
        // add own plugins, before initialization
        for (const plugin of plugins) {
            this.registerPlugin(plugin);
        }
        // ensure plugins are registered before running activation events
        this.ready.resolve();
        // run eager plugins
        await this.$activateByEvent('*');
        for (const activationEvent of params.activationEvents) {
            await this.$activateByEvent(activationEvent);
        }
        if (this.host.loadTests) {
            return this.host.loadTests();
        }
        this.fireOnDidChange();
    }
    registerPlugin(plugin) {
        if (plugin.model.id === 'vscode.json-language-features' && this.jsonValidation.length) {
            // VS Code contributes all built-in validations via vscode.json-language-features;
            // we enrich them with Theia validations registered on startup.
            // Dynamic validations can be provided only via VS Code extensions.
            // Content is fetched by the extension later via vscode.workspace.openTextDocument.
            const contributes = plugin.rawModel.contributes = (plugin.rawModel.contributes || {});
            contributes.jsonValidation = (contributes.jsonValidation || []).concat(this.jsonValidation);
        }
        this.registry.set(plugin.model.id, plugin);
        if (plugin.pluginPath && Array.isArray(plugin.rawModel.activationEvents)) {
            const activation = () => this.$activatePlugin(plugin.model.id);
            // an internal activation event is a subject to change
            this.setActivation(`onPlugin:${plugin.model.id}`, activation);
            const unsupportedActivationEvents = plugin.rawModel.activationEvents.filter(e => !PluginManagerExtImpl.SUPPORTED_ACTIVATION_EVENTS.has(e.split(':')[0]));
            if (unsupportedActivationEvents.length) {
                console.warn(`Unsupported activation events: ${unsupportedActivationEvents.join(', ')}, please open an issue: https://github.com/eclipse-theia/theia/issues/new`);
            }
            for (let activationEvent of plugin.rawModel.activationEvents) {
                if (activationEvent === 'onUri') {
                    activationEvent = `onUri:theia://${plugin.model.id}`;
                }
                this.setActivation(activationEvent, activation);
            }
        }
    }
    setActivation(activationEvent, activation) {
        const activations = this.activations.get(activationEvent) || [];
        activations.push(activation);
        this.activations.set(activationEvent, activations);
    }
    async loadPlugin(plugin, configStorage, visited = new Set()) {
        // in order to break cycles
        if (visited.has(plugin.model.id)) {
            return true;
        }
        visited.add(plugin.model.id);
        let loading = this.loadedPlugins.get(plugin.model.id);
        if (!loading) {
            loading = (async () => {
                const progressId = await this.notificationMain.$startProgress({
                    title: `Activating ${plugin.model.displayName || plugin.model.name}`,
                    location: 'window'
                });
                try {
                    if (plugin.rawModel.extensionDependencies) {
                        for (const dependencyId of plugin.rawModel.extensionDependencies) {
                            const dependency = this.registry.get(dependencyId.toLowerCase());
                            if (dependency) {
                                const loadedSuccessfully = await this.loadPlugin(dependency, configStorage, visited);
                                if (!loadedSuccessfully) {
                                    throw new Error(`Dependent extension '${dependency.model.displayName || dependency.model.id}' failed to activate.`);
                                }
                            }
                            else {
                                throw new Error(`Dependent extension '${dependencyId}' is not installed.`);
                            }
                        }
                    }
                    let pluginMain = this.host.loadPlugin(plugin);
                    // see https://github.com/TypeFox/vscode/blob/70b8db24a37fafc77247de7f7cb5bb0195120ed0/src/vs/workbench/api/common/extHostExtensionService.ts#L372-L376
                    pluginMain = pluginMain || {};
                    await this.startPlugin(plugin, configStorage, pluginMain);
                    return true;
                }
                catch (err) {
                    const message = `Activating extension '${plugin.model.displayName || plugin.model.name}' failed:`;
                    this.messageRegistryProxy.$showMessage(plugin_api_rpc_1.MainMessageType.Error, message + ' ' + err.message, {}, []);
                    console.error(message, err);
                    return false;
                }
                finally {
                    this.notificationMain.$stopProgress(progressId);
                }
            })();
        }
        this.loadedPlugins.set(plugin.model.id, loading);
        return loading;
    }
    async $updateStoragePath(path) {
        if (this.configStorage) {
            this.configStorage.hostStoragePath = path;
        }
        this.pluginContextsMap.forEach((pluginContext, pluginId) => {
            pluginContext.storagePath = path ? (0, path_1.join)(path, pluginId) : undefined;
        });
    }
    async $activateByEvent(activationEvent) {
        // Prevent the plugin manager from performing activations before plugins are registered
        await this.ready.promise;
        if (activationEvent.endsWith(':*')) {
            const baseEvent = activationEvent.substring(0, activationEvent.length - 2);
            await this.activateByBaseEvent(baseEvent);
        }
        else {
            await this.activateBySingleEvent(activationEvent);
        }
    }
    async activateByBaseEvent(baseEvent) {
        await Promise.all(Array.from(this.activations.keys(), activation => activation.startsWith(baseEvent) && this.activateBySingleEvent(activation)));
    }
    async activateBySingleEvent(activationEvent) {
        const activations = this.activations.get(activationEvent);
        if (!activations) {
            return;
        }
        this.activations.set(activationEvent, undefined);
        const pendingActivations = [];
        while (activations.length) {
            pendingActivations.push(activations.pop()());
        }
        await Promise.all(pendingActivations);
    }
    async $activatePlugin(id) {
        const plugin = this.registry.get(id);
        if (plugin && this.configStorage) {
            await this.loadPlugin(plugin, this.configStorage);
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async startPlugin(plugin, configStorage, pluginMain) {
        const subscriptions = [];
        const asAbsolutePath = (relativePath) => (0, path_1.join)(plugin.pluginFolder, relativePath);
        const logPath = (0, path_1.join)(configStorage.hostLogPath, plugin.model.id); // todo check format
        const storagePath = configStorage.hostStoragePath ? (0, path_1.join)(configStorage.hostStoragePath, plugin.model.id) : undefined;
        const secrets = new secrets_ext_1.SecretStorageExt(plugin, this.secrets);
        const globalStoragePath = (0, path_1.join)(configStorage.hostGlobalStoragePath, plugin.model.id);
        const extension = new plugin_context_1.PluginExt(this, plugin);
        const extensionModeValue = plugin.isUnderDevelopment ? types.ExtensionMode.Development : types.ExtensionMode.Production;
        const pluginContext = {
            extensionPath: extension.extensionPath,
            extensionUri: extension.extensionUri,
            globalState: new plugin_storage_1.GlobalState(plugin.model.id, true, this.storageProxy),
            workspaceState: new plugin_storage_1.Memento(plugin.model.id, false, this.storageProxy),
            subscriptions: subscriptions,
            asAbsolutePath: asAbsolutePath,
            logPath: logPath,
            storagePath: storagePath,
            storageUri: storagePath ? types_impl_1.URI.file(storagePath) : undefined,
            secrets,
            globalStoragePath: globalStoragePath,
            globalStorageUri: types_impl_1.URI.file(globalStoragePath),
            environmentVariableCollection: this.terminalService.getEnvironmentVariableCollection(plugin.model.id),
            extensionMode: extensionModeValue,
            extension,
            logUri: types_impl_1.URI.file(logPath)
        };
        this.pluginContextsMap.set(plugin.model.id, pluginContext);
        let stopFn = undefined;
        if (typeof pluginMain[plugin.lifecycle.stopMethod] === 'function') {
            stopFn = pluginMain[plugin.lifecycle.stopMethod];
        }
        const id = plugin.model.displayName || plugin.model.id;
        if (typeof pluginMain[plugin.lifecycle.startMethod] === 'function') {
            await this.localization.initializeLocalizedMessages(plugin, this.envExt.language);
            const pluginExport = await pluginMain[plugin.lifecycle.startMethod].apply(getGlobal(), [pluginContext]);
            console.log(`calling activation function on ${id}`);
            this.activatedPlugins.set(plugin.model.id, new ActivatedPlugin(pluginContext, pluginExport, stopFn));
        }
        else {
            // https://github.com/TypeFox/vscode/blob/70b8db24a37fafc77247de7f7cb5bb0195120ed0/src/vs/workbench/api/common/extHostExtensionService.ts#L400-L401
            console.log(`plugin ${id}, ${plugin.lifecycle.startMethod} method is undefined so the module is the extension's exports`);
            this.activatedPlugins.set(plugin.model.id, new ActivatedPlugin(pluginContext, pluginMain));
        }
    }
    getAllPlugins() {
        return Array.from(this.registry.values());
    }
    getPluginExport(pluginId) {
        const activePlugin = this.activatedPlugins.get(pluginId);
        if (activePlugin) {
            return activePlugin.exports;
        }
        return undefined;
    }
    getPluginById(pluginId) {
        return this.registry.get(pluginId);
    }
    isRunning(pluginId) {
        return this.registry.has(pluginId);
    }
    isActive(pluginId) {
        return this.activatedPlugins.has(pluginId);
    }
    activatePlugin(pluginId) {
        return this.$activatePlugin(pluginId);
    }
    get onDidChange() {
        return this.onDidChangeEmitter.event;
    }
}
exports.PluginManagerExtImpl = PluginManagerExtImpl;
PluginManagerExtImpl.SUPPORTED_ACTIVATION_EVENTS = new Set([
    '*',
    'onLanguage',
    'onCommand',
    'onDebug',
    'onDebugInitialConfigurations',
    'onDebugResolve',
    'onDebugAdapterProtocolTracker',
    'onDebugDynamicConfigurations',
    'onTaskType',
    'workspaceContains',
    'onView',
    'onUri',
    'onTerminalProfile',
    'onWebviewPanel',
    'onFileSystem',
    'onCustomEditor',
    'onStartupFinished',
    'onAuthenticationRequest',
    'onNotebook',
    'onNotebookSerializer'
]);
// for electron
function getGlobal() {
    return typeof self === 'undefined' ? typeof global === 'undefined' ? null : global : self;
}
//# sourceMappingURL=plugin-manager.js.map