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
exports.PluginHostRPC = void 0;
const dynamic_require_1 = require("@theia/core/lib/node/dynamic-require");
const plugin_manager_1 = require("../../plugin/plugin-manager");
const plugin_api_rpc_1 = require("../../common/plugin-api-rpc");
const plugin_context_1 = require("../../plugin/plugin-context");
const preference_registry_1 = require("../../plugin/preference-registry");
const debug_ext_1 = require("../../plugin/debug/debug-ext");
const editors_and_documents_1 = require("../../plugin/editors-and-documents");
const workspace_1 = require("../../plugin/workspace");
const message_registry_1 = require("../../plugin/message-registry");
const env_node_ext_1 = require("../../plugin/node/env-node-ext");
const clipboard_ext_1 = require("../../plugin/clipboard-ext");
const plugin_manifest_loader_1 = require("./plugin-manifest-loader");
const plugin_storage_1 = require("../../plugin/plugin-storage");
const webviews_1 = require("../../plugin/webviews");
const terminal_ext_1 = require("../../plugin/terminal-ext");
const secrets_ext_1 = require("../../plugin/secrets-ext");
const plugin_host_proxy_1 = require("./plugin-host-proxy");
const localization_ext_1 = require("../../plugin/localization-ext");
/**
 * Handle the RPC calls.
 */
class PluginHostRPC {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(rpc) {
        this.rpc = rpc;
    }
    initialize() {
        const envExt = new env_node_ext_1.EnvNodeExtImpl(this.rpc);
        const storageProxy = new plugin_storage_1.KeyValueStorageProxy(this.rpc);
        const debugExt = new debug_ext_1.DebugExtImpl(this.rpc);
        const editorsAndDocumentsExt = new editors_and_documents_1.EditorsAndDocumentsExtImpl(this.rpc);
        const messageRegistryExt = new message_registry_1.MessageRegistryExt(this.rpc);
        const workspaceExt = new workspace_1.WorkspaceExtImpl(this.rpc, editorsAndDocumentsExt, messageRegistryExt);
        const preferenceRegistryExt = new preference_registry_1.PreferenceRegistryExtImpl(this.rpc, workspaceExt);
        const clipboardExt = new clipboard_ext_1.ClipboardExt(this.rpc);
        const webviewExt = new webviews_1.WebviewsExtImpl(this.rpc, workspaceExt);
        const terminalService = new terminal_ext_1.TerminalServiceExtImpl(this.rpc);
        const secretsExt = new secrets_ext_1.SecretsExtImpl(this.rpc);
        const localizationExt = new localization_ext_1.LocalizationExtImpl(this.rpc);
        this.pluginManager = this.createPluginManager(envExt, terminalService, storageProxy, preferenceRegistryExt, webviewExt, secretsExt, localizationExt, this.rpc);
        this.rpc.set(plugin_api_rpc_1.MAIN_RPC_CONTEXT.HOSTED_PLUGIN_MANAGER_EXT, this.pluginManager);
        this.rpc.set(plugin_api_rpc_1.MAIN_RPC_CONTEXT.EDITORS_AND_DOCUMENTS_EXT, editorsAndDocumentsExt);
        this.rpc.set(plugin_api_rpc_1.MAIN_RPC_CONTEXT.WORKSPACE_EXT, workspaceExt);
        this.rpc.set(plugin_api_rpc_1.MAIN_RPC_CONTEXT.PREFERENCE_REGISTRY_EXT, preferenceRegistryExt);
        this.rpc.set(plugin_api_rpc_1.MAIN_RPC_CONTEXT.STORAGE_EXT, storageProxy);
        this.rpc.set(plugin_api_rpc_1.MAIN_RPC_CONTEXT.WEBVIEWS_EXT, webviewExt);
        this.rpc.set(plugin_api_rpc_1.MAIN_RPC_CONTEXT.SECRETS_EXT, secretsExt);
        this.apiFactory = (0, plugin_context_1.createAPIFactory)(this.rpc, this.pluginManager, envExt, debugExt, preferenceRegistryExt, editorsAndDocumentsExt, workspaceExt, messageRegistryExt, clipboardExt, webviewExt, localizationExt);
        (0, plugin_host_proxy_1.connectProxyResolver)(workspaceExt, preferenceRegistryExt);
    }
    async terminate() {
        await this.pluginManager.terminate();
    }
    initContext(contextPath, plugin) {
        const { name, version } = plugin.rawModel;
        console.debug('PLUGIN_HOST(' + process.pid + '): initializing(' + name + '@' + version + ' with ' + contextPath + ')');
        try {
            const backendInit = (0, dynamic_require_1.dynamicRequire)(contextPath);
            backendInit.doInitialization(this.apiFactory, plugin);
        }
        catch (e) {
            console.error(e);
        }
    }
    createPluginManager(envExt, terminalService, storageProxy, preferencesManager, webview, secretsExt, localization, 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rpc) {
        const { extensionTestsPath } = process.env;
        const self = this;
        const pluginManager = new plugin_manager_1.PluginManagerExtImpl({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            loadPlugin(plugin) {
                console.debug('PLUGIN_HOST(' + process.pid + '): PluginManagerExtImpl/loadPlugin(' + plugin.pluginPath + ')');
                // cleaning the cache for all files of that plug-in.
                // this prevents a memory leak on plugin host restart. See for reference:
                // https://github.com/eclipse-theia/theia/pull/4931
                // https://github.com/nodejs/node/issues/8443
                (0, dynamic_require_1.removeFromCache)(mod => mod.id.startsWith(plugin.pluginFolder));
                if (plugin.pluginPath) {
                    return (0, dynamic_require_1.dynamicRequire)(plugin.pluginPath);
                }
            },
            async init(raw) {
                console.log('PLUGIN_HOST(' + process.pid + '): PluginManagerExtImpl/init()');
                const result = [];
                const foreign = [];
                for (const plg of raw) {
                    try {
                        const pluginModel = plg.model;
                        const pluginLifecycle = plg.lifecycle;
                        const rawModel = await (0, plugin_manifest_loader_1.loadManifest)(pluginModel.packagePath);
                        rawModel.packagePath = pluginModel.packagePath;
                        if (pluginModel.entryPoint.frontend) {
                            foreign.push({
                                pluginPath: pluginModel.entryPoint.frontend,
                                pluginFolder: pluginModel.packagePath,
                                pluginUri: pluginModel.packageUri,
                                model: pluginModel,
                                lifecycle: pluginLifecycle,
                                rawModel,
                                isUnderDevelopment: !!plg.isUnderDevelopment
                            });
                        }
                        else {
                            let backendInitPath = pluginLifecycle.backendInitPath;
                            // if no init path, try to init as regular Theia plugin
                            if (!backendInitPath) {
                                backendInitPath = __dirname + '/scanners/backend-init-theia.js';
                            }
                            const plugin = {
                                pluginPath: pluginModel.entryPoint.backend,
                                pluginFolder: pluginModel.packagePath,
                                pluginUri: pluginModel.packageUri,
                                model: pluginModel,
                                lifecycle: pluginLifecycle,
                                rawModel,
                                isUnderDevelopment: !!plg.isUnderDevelopment
                            };
                            self.initContext(backendInitPath, plugin);
                            result.push(plugin);
                        }
                    }
                    catch (e) {
                        console.error(`Failed to initialize ${plg.model.id} plugin.`, e);
                    }
                }
                return [result, foreign];
            },
            initExtApi(extApi) {
                for (const api of extApi) {
                    if (api.backendInitPath) {
                        try {
                            const extApiInit = (0, dynamic_require_1.dynamicRequire)(api.backendInitPath);
                            extApiInit.provideApi(rpc, pluginManager);
                        }
                        catch (e) {
                            console.error(e);
                        }
                    }
                }
            },
            loadTests: extensionTestsPath ? async () => {
                /* eslint-disable @typescript-eslint/no-explicit-any */
                // Require the test runner via node require from the provided path
                let testRunner;
                let requireError;
                try {
                    testRunner = (0, dynamic_require_1.dynamicRequire)(extensionTestsPath);
                }
                catch (error) {
                    requireError = error;
                }
                // Execute the runner if it follows our spec
                if (testRunner && typeof testRunner.run === 'function') {
                    return new Promise((resolve, reject) => {
                        testRunner.run(extensionTestsPath, (error) => {
                            if (error) {
                                reject(error.toString());
                            }
                            else {
                                resolve(undefined);
                            }
                        });
                    });
                }
                throw new Error(requireError ?
                    requireError.toString() :
                    `Path ${extensionTestsPath} does not point to a valid extension test runner.`);
            } : undefined
        }, envExt, terminalService, storageProxy, secretsExt, preferencesManager, webview, localization, rpc);
        return pluginManager;
    }
}
exports.PluginHostRPC = PluginHostRPC;
//# sourceMappingURL=plugin-host-rpc.js.map