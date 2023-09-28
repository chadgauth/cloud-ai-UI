"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HostedPluginServerImpl = void 0;
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
const inversify_1 = require("@theia/core/shared/inversify");
const plugin_protocol_1 = require("../../common/plugin-protocol");
const hosted_plugin_1 = require("./hosted-plugin");
const core_1 = require("@theia/core");
const plugin_ext_api_contribution_1 = require("../../common/plugin-ext-api-contribution");
const hosted_plugin_deployer_handler_1 = require("./hosted-plugin-deployer-handler");
const plugin_deployer_impl_1 = require("../../main/node/plugin-deployer-impl");
const hosted_plugin_localization_service_1 = require("./hosted-plugin-localization-service");
const plugin_uninstallation_manager_1 = require("../../main/node/plugin-uninstallation-manager");
let HostedPluginServerImpl = class HostedPluginServerImpl {
    constructor(hostedPlugin) {
        this.hostedPlugin = hostedPlugin;
        this.toDispose = new core_1.DisposableCollection();
        this.pluginVersions = new Map();
    }
    // We ignore any plugins that are marked as uninstalled the first time the frontend requests information about deployed plugins.
    get ignoredPlugins() {
        if (!this._ignoredPlugins) {
            this._ignoredPlugins = new Set(this.uninstallationManager.getUninstalledPluginIds());
        }
        return this._ignoredPlugins;
    }
    init() {
        this.toDispose.pushAll([
            this.pluginDeployer.onDidDeploy(() => { var _a; return (_a = this.client) === null || _a === void 0 ? void 0 : _a.onDidDeploy(); }),
            this.uninstallationManager.onDidChangeUninstalledPlugins(currentUninstalled => {
                var _a;
                if (this._ignoredPlugins) {
                    const uninstalled = new Set(currentUninstalled);
                    for (const previouslyUninstalled of this._ignoredPlugins) {
                        if (!uninstalled.has(previouslyUninstalled)) {
                            this._ignoredPlugins.delete(previouslyUninstalled);
                        }
                    }
                }
                (_a = this.client) === null || _a === void 0 ? void 0 : _a.onDidDeploy();
            }),
            core_1.Disposable.create(() => this.hostedPlugin.clientClosed()),
        ]);
    }
    dispose() {
        this.toDispose.dispose();
    }
    setClient(client) {
        this.client = client;
        this.hostedPlugin.setClient(client);
    }
    async getDeployedPluginIds() {
        const backendMetadata = await this.deployerHandler.getDeployedBackendPluginIds();
        if (backendMetadata.length > 0) {
            this.hostedPlugin.runPluginServer();
        }
        const plugins = new Set();
        const addIds = async (identifiers) => {
            for (const pluginId of identifiers) {
                if (this.isRelevantPlugin(pluginId)) {
                    plugins.add(pluginId);
                }
            }
        };
        addIds(await this.deployerHandler.getDeployedFrontendPluginIds());
        addIds(backendMetadata);
        addIds(await this.hostedPlugin.getExtraDeployedPluginIds());
        return Array.from(plugins);
    }
    /**
     * Ensures that the plugin was not uninstalled when this session was started
     * and that it matches the first version of the given plugin seen by this session.
     *
     * The deployment system may have multiple versions of the same plugin available, but
     * a single session should only ever activate one of them.
     */
    isRelevantPlugin(identifier) {
        const versionAndId = plugin_protocol_1.PluginIdentifiers.idAndVersionFromVersionedId(identifier);
        if (!versionAndId) {
            return false;
        }
        const knownVersion = this.pluginVersions.get(versionAndId.id);
        if (knownVersion !== undefined && knownVersion !== versionAndId.version) {
            return false;
        }
        if (this.ignoredPlugins.has(identifier)) {
            return false;
        }
        if (knownVersion === undefined) {
            this.pluginVersions.set(versionAndId.id, versionAndId.version);
        }
        return true;
    }
    getUninstalledPluginIds() {
        return Promise.resolve(this.uninstallationManager.getUninstalledPluginIds());
    }
    async getDeployedPlugins({ pluginIds }) {
        if (!pluginIds.length) {
            return [];
        }
        const plugins = [];
        let extraDeployedPlugins;
        for (const versionedId of pluginIds) {
            if (!this.isRelevantPlugin(versionedId)) {
                continue;
            }
            let plugin = this.deployerHandler.getDeployedPlugin(versionedId);
            if (!plugin) {
                if (!extraDeployedPlugins) {
                    extraDeployedPlugins = new Map();
                    for (const extraDeployedPlugin of await this.hostedPlugin.getExtraDeployedPlugins()) {
                        extraDeployedPlugins.set(plugin_protocol_1.PluginIdentifiers.componentsToVersionedId(extraDeployedPlugin.metadata.model), extraDeployedPlugin);
                    }
                }
                plugin = extraDeployedPlugins.get(versionedId);
            }
            if (plugin) {
                plugins.push(plugin);
            }
        }
        return Promise.all(plugins.map(plugin => this.localizationService.localizePlugin(plugin)));
    }
    onMessage(pluginHostId, message) {
        this.hostedPlugin.onMessage(pluginHostId, message);
        return Promise.resolve();
    }
    getExtPluginAPI() {
        return Promise.resolve(this.extPluginAPIContributions.getContributions().map(p => p.provideApi()));
    }
};
__decorate([
    (0, inversify_1.inject)(core_1.ILogger),
    __metadata("design:type", Object)
], HostedPluginServerImpl.prototype, "logger", void 0);
__decorate([
    (0, inversify_1.inject)(hosted_plugin_deployer_handler_1.HostedPluginDeployerHandler),
    __metadata("design:type", hosted_plugin_deployer_handler_1.HostedPluginDeployerHandler)
], HostedPluginServerImpl.prototype, "deployerHandler", void 0);
__decorate([
    (0, inversify_1.inject)(plugin_protocol_1.PluginDeployer),
    __metadata("design:type", plugin_deployer_impl_1.PluginDeployerImpl)
], HostedPluginServerImpl.prototype, "pluginDeployer", void 0);
__decorate([
    (0, inversify_1.inject)(hosted_plugin_localization_service_1.HostedPluginLocalizationService),
    __metadata("design:type", hosted_plugin_localization_service_1.HostedPluginLocalizationService)
], HostedPluginServerImpl.prototype, "localizationService", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.ContributionProvider),
    (0, inversify_1.named)(Symbol.for(plugin_ext_api_contribution_1.ExtPluginApiProvider)),
    __metadata("design:type", Object)
], HostedPluginServerImpl.prototype, "extPluginAPIContributions", void 0);
__decorate([
    (0, inversify_1.inject)(plugin_uninstallation_manager_1.PluginUninstallationManager),
    __metadata("design:type", plugin_uninstallation_manager_1.PluginUninstallationManager)
], HostedPluginServerImpl.prototype, "uninstallationManager", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HostedPluginServerImpl.prototype, "init", null);
HostedPluginServerImpl = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(hosted_plugin_1.HostedPluginSupport)),
    __metadata("design:paramtypes", [hosted_plugin_1.HostedPluginSupport])
], HostedPluginServerImpl);
exports.HostedPluginServerImpl = HostedPluginServerImpl;
//# sourceMappingURL=plugin-service.js.map