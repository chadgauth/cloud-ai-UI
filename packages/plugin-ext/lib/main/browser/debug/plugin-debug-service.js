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
exports.PluginDebugService = void 0;
const debug_service_1 = require("@theia/debug/lib/common/debug-service");
const debounce = require("@theia/core/shared/lodash.debounce");
const core_1 = require("@theia/core");
const disposable_1 = require("@theia/core/lib/common/disposable");
const inversify_1 = require("@theia/core/shared/inversify");
const ws_connection_provider_1 = require("@theia/core/lib/browser/messaging/ws-connection-provider");
const browser_1 = require("@theia/workspace/lib/browser");
const plugin_api_rpc_1 = require("../../../common/plugin-api-rpc");
/**
 * Debug service to work with plugin and extension contributions.
 */
let PluginDebugService = class PluginDebugService {
    constructor() {
        this.onDidChangeDebuggersEmitter = new core_1.Emitter();
        this.debuggers = [];
        this.contributors = new Map();
        this.configurationProviders = new Map();
        this.toDispose = new disposable_1.DisposableCollection(this.onDidChangeDebuggersEmitter);
        this.onDidChangeDebugConfigurationProvidersEmitter = new core_1.Emitter();
        // maps session and contribution
        this.sessionId2contrib = new Map();
        // debouncing to send a single notification for multiple registrations at initialization time
        this.fireOnDidConfigurationProvidersChanged = debounce(() => {
            this.onDidChangeDebugConfigurationProvidersEmitter.fire();
        }, 100);
    }
    get onDidChangeDebuggers() {
        return this.onDidChangeDebuggersEmitter.event;
    }
    get onDidChangeDebugConfigurationProviders() {
        return this.onDidChangeDebugConfigurationProvidersEmitter.event;
    }
    init() {
        this.delegated = this.connectionProvider.createProxy(debug_service_1.DebugPath);
        this.toDispose.pushAll([
            disposable_1.Disposable.create(() => this.delegated.dispose()),
            disposable_1.Disposable.create(() => {
                for (const sessionId of this.sessionId2contrib.keys()) {
                    const contrib = this.sessionId2contrib.get(sessionId);
                    contrib.terminateDebugSession(sessionId);
                }
                this.sessionId2contrib.clear();
            })
        ]);
    }
    registerDebugAdapterContribution(contrib) {
        const { type } = contrib;
        if (this.contributors.has(type)) {
            console.warn(`Debugger with type '${type}' already registered.`);
            return disposable_1.Disposable.NULL;
        }
        this.contributors.set(type, contrib);
        return disposable_1.Disposable.create(() => this.unregisterDebugAdapterContribution(type));
    }
    unregisterDebugAdapterContribution(debugType) {
        this.contributors.delete(debugType);
    }
    registerDebugConfigurationProvider(provider) {
        const handle = provider.handle;
        this.configurationProviders.set(handle, provider);
        this.fireOnDidConfigurationProvidersChanged();
        return disposable_1.Disposable.create(() => this.unregisterDebugConfigurationProvider(handle));
    }
    unregisterDebugConfigurationProvider(handle) {
        this.configurationProviders.delete(handle);
        this.fireOnDidConfigurationProvidersChanged();
    }
    async debugTypes() {
        const debugTypes = new Set(await this.delegated.debugTypes());
        for (const contribution of this.debuggers) {
            debugTypes.add(contribution.type);
        }
        for (const debugType of this.contributors.keys()) {
            debugTypes.add(debugType);
        }
        return [...debugTypes];
    }
    async provideDebugConfigurations(debugType, workspaceFolderUri) {
        const pluginProviders = Array.from(this.configurationProviders.values()).filter(p => (p.triggerKind === plugin_api_rpc_1.DebugConfigurationProviderTriggerKind.Initial &&
            (p.type === debugType || p.type === '*') &&
            p.provideDebugConfigurations));
        if (pluginProviders.length === 0) {
            return this.delegated.provideDebugConfigurations(debugType, workspaceFolderUri);
        }
        const results = [];
        await Promise.all(pluginProviders.map(async (p) => {
            const result = await p.provideDebugConfigurations(workspaceFolderUri);
            if (result) {
                results.push(...result);
            }
        }));
        return results;
    }
    async fetchDynamicDebugConfiguration(name, providerType, folder) {
        const pluginProviders = Array.from(this.configurationProviders.values()).filter(p => (p.triggerKind === plugin_api_rpc_1.DebugConfigurationProviderTriggerKind.Dynamic &&
            p.type === providerType &&
            p.provideDebugConfigurations));
        for (const provider of pluginProviders) {
            const configurations = await provider.provideDebugConfigurations(folder);
            for (const configuration of configurations) {
                if (configuration.name === name) {
                    return configuration;
                }
            }
        }
    }
    async provideDynamicDebugConfigurations(folder) {
        const pluginProviders = Array.from(this.configurationProviders.values()).filter(p => (p.triggerKind === plugin_api_rpc_1.DebugConfigurationProviderTriggerKind.Dynamic &&
            p.provideDebugConfigurations));
        const configurationsRecord = {};
        await Promise.all(pluginProviders.map(async (provider) => {
            const configurations = await provider.provideDebugConfigurations(folder);
            let configurationsPerType = configurationsRecord[provider.type];
            configurationsPerType = configurationsPerType ? configurationsPerType.concat(configurations) : configurations;
            if (configurationsPerType.length > 0) {
                configurationsRecord[provider.type] = configurationsPerType;
            }
        }));
        return configurationsRecord;
    }
    async resolveDebugConfiguration(config, workspaceFolderUri) {
        const allProviders = Array.from(this.configurationProviders.values());
        const resolvers = allProviders
            .filter(p => p.type === config.type && !!p.resolveDebugConfiguration)
            .map(p => p.resolveDebugConfiguration);
        // Append debug type '*' at the end
        resolvers.push(...allProviders
            .filter(p => p.type === '*' && !!p.resolveDebugConfiguration)
            .map(p => p.resolveDebugConfiguration));
        const resolved = await this.resolveDebugConfigurationByResolversChain(config, workspaceFolderUri, resolvers);
        return resolved ? this.delegated.resolveDebugConfiguration(resolved, workspaceFolderUri) : resolved;
    }
    async resolveDebugConfigurationWithSubstitutedVariables(config, workspaceFolderUri) {
        const allProviders = Array.from(this.configurationProviders.values());
        const resolvers = allProviders
            .filter(p => p.type === config.type && !!p.resolveDebugConfigurationWithSubstitutedVariables)
            .map(p => p.resolveDebugConfigurationWithSubstitutedVariables);
        // Append debug type '*' at the end
        resolvers.push(...allProviders
            .filter(p => p.type === '*' && !!p.resolveDebugConfigurationWithSubstitutedVariables)
            .map(p => p.resolveDebugConfigurationWithSubstitutedVariables));
        const resolved = await this.resolveDebugConfigurationByResolversChain(config, workspaceFolderUri, resolvers);
        return resolved
            ? this.delegated.resolveDebugConfigurationWithSubstitutedVariables(resolved, workspaceFolderUri)
            : resolved;
    }
    async resolveDebugConfigurationByResolversChain(config, workspaceFolderUri, resolvers) {
        let resolved = config;
        for (const resolver of resolvers) {
            try {
                if (!resolved) {
                    // A provider has indicated to stop and process undefined or null as per specified in the vscode API
                    // https://code.visualstudio.com/api/references/vscode-api#DebugConfigurationProvider
                    break;
                }
                resolved = await resolver(workspaceFolderUri, resolved);
            }
            catch (e) {
                console.error(e);
            }
        }
        return resolved;
    }
    registerDebugger(contribution) {
        this.debuggers.push(contribution);
        return disposable_1.Disposable.create(() => {
            const index = this.debuggers.indexOf(contribution);
            if (index !== -1) {
                this.debuggers.splice(index, 1);
            }
        });
    }
    async provideDebuggerVariables(debugType) {
        for (const contribution of this.debuggers) {
            if (contribution.type === debugType) {
                const variables = contribution.variables;
                if (variables && Object.keys(variables).length > 0) {
                    return variables;
                }
            }
        }
        return {};
    }
    async getDebuggersForLanguage(language) {
        const debuggers = await this.delegated.getDebuggersForLanguage(language);
        for (const contributor of this.debuggers) {
            const languages = contributor.languages;
            if (languages && languages.indexOf(language) !== -1) {
                const { label, type } = contributor;
                debuggers.push({ type, label: label || type });
            }
        }
        return debuggers;
    }
    async getSchemaAttributes(debugType) {
        let schemas = await this.delegated.getSchemaAttributes(debugType);
        for (const contribution of this.debuggers) {
            if (contribution.configurationAttributes &&
                (contribution.type === debugType || contribution.type === '*' || debugType === '*')) {
                schemas = schemas.concat(contribution.configurationAttributes);
            }
        }
        return schemas;
    }
    async getConfigurationSnippets() {
        let snippets = await this.delegated.getConfigurationSnippets();
        for (const contribution of this.debuggers) {
            if (contribution.configurationSnippets) {
                snippets = snippets.concat(contribution.configurationSnippets);
            }
        }
        return snippets;
    }
    async createDebugSession(config, workspaceFolder) {
        const contributor = this.contributors.get(config.type);
        if (contributor) {
            const sessionId = await contributor.createDebugSession(config, workspaceFolder);
            this.sessionId2contrib.set(sessionId, contributor);
            return sessionId;
        }
        else {
            return this.delegated.createDebugSession(config, workspaceFolder);
        }
    }
    async terminateDebugSession(sessionId) {
        const contributor = this.sessionId2contrib.get(sessionId);
        if (contributor) {
            this.sessionId2contrib.delete(sessionId);
            return contributor.terminateDebugSession(sessionId);
        }
        else {
            return this.delegated.terminateDebugSession(sessionId);
        }
    }
    dispose() {
        this.toDispose.dispose();
    }
};
__decorate([
    (0, inversify_1.inject)(ws_connection_provider_1.WebSocketConnectionProvider),
    __metadata("design:type", ws_connection_provider_1.WebSocketConnectionProvider)
], PluginDebugService.prototype, "connectionProvider", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.WorkspaceService),
    __metadata("design:type", browser_1.WorkspaceService)
], PluginDebugService.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PluginDebugService.prototype, "init", null);
PluginDebugService = __decorate([
    (0, inversify_1.injectable)()
], PluginDebugService);
exports.PluginDebugService = PluginDebugService;
//# sourceMappingURL=plugin-debug-service.js.map