"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
// eslint-disable-next-line import/no-extraneous-dependencies
require("reflect-metadata");
const channel_1 = require("@theia/core/lib/common/message-rpc/channel");
const uint8_array_message_buffer_1 = require("@theia/core/lib/common/message-rpc/uint8-array-message-buffer");
const plugin_api_rpc_1 = require("../../../common/plugin-api-rpc");
const plugin_protocol_1 = require("../../../common/plugin-protocol");
const rpc_protocol_1 = require("../../../common/rpc-protocol");
const clipboard_ext_1 = require("../../../plugin/clipboard-ext");
const editors_and_documents_1 = require("../../../plugin/editors-and-documents");
const message_registry_1 = require("../../../plugin/message-registry");
const plugin_context_1 = require("../../../plugin/plugin-context");
const plugin_manager_1 = require("../../../plugin/plugin-manager");
const plugin_storage_1 = require("../../../plugin/plugin-storage");
const preference_registry_1 = require("../../../plugin/preference-registry");
const secrets_ext_1 = require("../../../plugin/secrets-ext");
const terminal_ext_1 = require("../../../plugin/terminal-ext");
const webviews_1 = require("../../../plugin/webviews");
const workspace_1 = require("../../../plugin/workspace");
const debug_stub_1 = require("./debug-stub");
const plugin_manifest_loader_1 = require("./plugin-manifest-loader");
const worker_env_ext_1 = require("./worker-env-ext");
const localization_ext_1 = require("../../../plugin/localization-ext");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ctx = self;
const pluginsApiImpl = new Map();
const pluginsModulesNames = new Map();
const channel = new channel_1.BasicChannel(() => {
    const writeBuffer = new uint8_array_message_buffer_1.Uint8ArrayWriteBuffer();
    writeBuffer.onCommit(buffer => {
        ctx.postMessage(buffer);
    });
    return writeBuffer;
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
addEventListener('message', (message) => {
    channel.onMessageEmitter.fire(() => new uint8_array_message_buffer_1.Uint8ArrayReadBuffer(message.data));
});
const rpc = new rpc_protocol_1.RPCProtocolImpl(channel);
const scripts = new Set();
function initialize(contextPath, pluginMetadata) {
    const path = '/context/' + contextPath;
    if (!scripts.has(path)) {
        ctx.importScripts(path);
        scripts.add(path);
    }
}
const envExt = new worker_env_ext_1.WorkerEnvExtImpl(rpc);
const storageProxy = new plugin_storage_1.KeyValueStorageProxy(rpc);
const editorsAndDocuments = new editors_and_documents_1.EditorsAndDocumentsExtImpl(rpc);
const messageRegistryExt = new message_registry_1.MessageRegistryExt(rpc);
const workspaceExt = new workspace_1.WorkspaceExtImpl(rpc, editorsAndDocuments, messageRegistryExt);
const preferenceRegistryExt = new preference_registry_1.PreferenceRegistryExtImpl(rpc, workspaceExt);
const debugExt = (0, debug_stub_1.createDebugExtStub)(rpc);
const clipboardExt = new clipboard_ext_1.ClipboardExt(rpc);
const webviewExt = new webviews_1.WebviewsExtImpl(rpc, workspaceExt);
const secretsExt = new secrets_ext_1.SecretsExtImpl(rpc);
const localizationExt = new localization_ext_1.LocalizationExtImpl(rpc);
const terminalService = new terminal_ext_1.TerminalServiceExtImpl(rpc);
const pluginManager = new plugin_manager_1.PluginManagerExtImpl({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    loadPlugin(plugin) {
        if (plugin.pluginPath) {
            if (isElectron()) {
                ctx.importScripts(plugin.pluginPath);
            }
            else {
                if (plugin.lifecycle.frontendModuleName) {
                    // Set current module name being imported
                    ctx.frontendModuleName = plugin.lifecycle.frontendModuleName;
                }
                ctx.importScripts('/hostedPlugin/' + (0, plugin_protocol_1.getPluginId)(plugin.model) + '/' + plugin.pluginPath);
            }
        }
        if (plugin.lifecycle.frontendModuleName) {
            if (!ctx[plugin.lifecycle.frontendModuleName]) {
                console.error(`WebWorker: Cannot start plugin "${plugin.model.name}". Frontend plugin not found: "${plugin.lifecycle.frontendModuleName}"`);
                return;
            }
            return ctx[plugin.lifecycle.frontendModuleName];
        }
    },
    async init(rawPluginData) {
        const result = [];
        const foreign = [];
        // Process the plugins concurrently, making sure to keep the order.
        const plugins = await Promise.all(rawPluginData.map(async (plg) => {
            const pluginModel = plg.model;
            const pluginLifecycle = plg.lifecycle;
            if (pluginModel.entryPoint.frontend) {
                let frontendInitPath = pluginLifecycle.frontendInitPath;
                if (frontendInitPath) {
                    initialize(frontendInitPath, plg);
                }
                else {
                    frontendInitPath = '';
                }
                const rawModel = await (0, plugin_manifest_loader_1.loadManifest)(pluginModel);
                const plugin = {
                    pluginPath: pluginModel.entryPoint.frontend,
                    pluginFolder: pluginModel.packagePath,
                    pluginUri: pluginModel.packageUri,
                    model: pluginModel,
                    lifecycle: pluginLifecycle,
                    rawModel,
                    isUnderDevelopment: !!plg.isUnderDevelopment
                };
                const apiImpl = apiFactory(plugin);
                pluginsApiImpl.set(plugin.model.id, apiImpl);
                pluginsModulesNames.set(plugin.lifecycle.frontendModuleName, plugin);
                return { target: result, plugin };
            }
            else {
                return {
                    target: foreign,
                    plugin: {
                        pluginPath: pluginModel.entryPoint.backend,
                        pluginFolder: pluginModel.packagePath,
                        pluginUri: pluginModel.packageUri,
                        model: pluginModel,
                        lifecycle: pluginLifecycle,
                        get rawModel() {
                            throw new Error('not supported');
                        },
                        isUnderDevelopment: !!plg.isUnderDevelopment
                    }
                };
            }
        }));
        // Collect the ordered plugins and insert them in the target array:
        for (const { target, plugin } of plugins) {
            target.push(plugin);
        }
        return [result, foreign];
    },
    initExtApi(extApi) {
        for (const api of extApi) {
            try {
                if (api.frontendExtApi) {
                    ctx.importScripts(api.frontendExtApi.initPath);
                    ctx[api.frontendExtApi.initVariable][api.frontendExtApi.initFunction](rpc, pluginsModulesNames);
                }
            }
            catch (e) {
                console.error(e);
            }
        }
    }
}, envExt, terminalService, storageProxy, secretsExt, preferenceRegistryExt, webviewExt, localizationExt, rpc);
const apiFactory = (0, plugin_context_1.createAPIFactory)(rpc, pluginManager, envExt, debugExt, preferenceRegistryExt, editorsAndDocuments, workspaceExt, messageRegistryExt, clipboardExt, webviewExt, localizationExt);
let defaultApi;
const handler = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get: (target, name) => {
        const plugin = pluginsModulesNames.get(name);
        if (plugin) {
            const apiImpl = pluginsApiImpl.get(plugin.model.id);
            return apiImpl;
        }
        if (!defaultApi) {
            defaultApi = apiFactory(plugin_api_rpc_1.emptyPlugin);
        }
        return defaultApi;
    }
};
ctx['theia'] = new Proxy(Object.create(null), handler);
rpc.set(plugin_api_rpc_1.MAIN_RPC_CONTEXT.HOSTED_PLUGIN_MANAGER_EXT, pluginManager);
rpc.set(plugin_api_rpc_1.MAIN_RPC_CONTEXT.EDITORS_AND_DOCUMENTS_EXT, editorsAndDocuments);
rpc.set(plugin_api_rpc_1.MAIN_RPC_CONTEXT.WORKSPACE_EXT, workspaceExt);
rpc.set(plugin_api_rpc_1.MAIN_RPC_CONTEXT.PREFERENCE_REGISTRY_EXT, preferenceRegistryExt);
rpc.set(plugin_api_rpc_1.MAIN_RPC_CONTEXT.STORAGE_EXT, storageProxy);
rpc.set(plugin_api_rpc_1.MAIN_RPC_CONTEXT.WEBVIEWS_EXT, webviewExt);
function isElectron() {
    if (typeof navigator === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent.indexOf('Electron') >= 0) {
        return true;
    }
    return false;
}
//# sourceMappingURL=worker-main.js.map