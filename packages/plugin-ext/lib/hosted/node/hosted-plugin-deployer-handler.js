"use strict";
// *****************************************************************************
// Copyright (C) 2019 RedHat and others.
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
exports.HostedPluginDeployerHandler = void 0;
const fs = require("@theia/core/shared/fs-extra");
const inversify_1 = require("@theia/core/shared/inversify");
const core_1 = require("@theia/core");
const plugin_protocol_1 = require("../../common/plugin-protocol");
const plugin_reader_1 = require("./plugin-reader");
const promise_util_1 = require("@theia/core/lib/common/promise-util");
const hosted_plugin_localization_service_1 = require("./hosted-plugin-localization-service");
const common_1 = require("@theia/core/lib/common");
const plugin_uninstallation_manager_1 = require("../../main/node/plugin-uninstallation-manager");
let HostedPluginDeployerHandler = class HostedPluginDeployerHandler {
    constructor() {
        this.deployedLocations = new Map();
        this.sourceLocations = new Map();
        /**
         * Managed plugin metadata backend entries.
         */
        this.deployedBackendPlugins = new Map();
        /**
         * Managed plugin metadata frontend entries.
         */
        this.deployedFrontendPlugins = new Map();
        this.backendPluginsMetadataDeferred = new promise_util_1.Deferred();
        this.frontendPluginsMetadataDeferred = new promise_util_1.Deferred();
    }
    async getDeployedFrontendPluginIds() {
        // await first deploy
        await this.frontendPluginsMetadataDeferred.promise;
        // fetch the last deployed state
        return Array.from(this.deployedFrontendPlugins.keys());
    }
    async getDeployedBackendPluginIds() {
        // await first deploy
        await this.backendPluginsMetadataDeferred.promise;
        // fetch the last deployed state
        return Array.from(this.deployedBackendPlugins.keys());
    }
    getDeployedPluginsById(pluginId) {
        const matches = [];
        const handle = (plugins) => {
            for (const plugin of plugins) {
                if (plugin_protocol_1.PluginIdentifiers.componentsToVersionWithId(plugin.metadata.model).id === pluginId) {
                    matches.push(plugin);
                }
            }
        };
        handle(this.deployedFrontendPlugins.values());
        handle(this.deployedBackendPlugins.values());
        return matches;
    }
    getDeployedPlugin(pluginId) {
        var _a;
        return (_a = this.deployedBackendPlugins.get(pluginId)) !== null && _a !== void 0 ? _a : this.deployedFrontendPlugins.get(pluginId);
    }
    /**
     * @throws never! in order to isolate plugin deployment
     */
    async getPluginDependencies(entry) {
        const pluginPath = entry.path();
        try {
            const manifest = await this.reader.readPackage(pluginPath);
            if (!manifest) {
                return undefined;
            }
            const metadata = this.reader.readMetadata(manifest);
            const dependencies = { metadata };
            // Do not resolve system (aka builtin) plugins because it should be done statically at build time.
            if (entry.type !== plugin_protocol_1.PluginType.System) {
                dependencies.mapping = this.reader.readDependencies(manifest);
            }
            return dependencies;
        }
        catch (e) {
            console.error(`Failed to load plugin dependencies from '${pluginPath}' path`, e);
            return undefined;
        }
    }
    async deployFrontendPlugins(frontendPlugins) {
        let successes = 0;
        for (const plugin of frontendPlugins) {
            if (await this.deployPlugin(plugin, 'frontend')) {
                successes++;
            }
        }
        // resolve on first deploy
        this.frontendPluginsMetadataDeferred.resolve(undefined);
        return successes;
    }
    async deployBackendPlugins(backendPlugins) {
        let successes = 0;
        for (const plugin of backendPlugins) {
            if (await this.deployPlugin(plugin, 'backend')) {
                successes++;
            }
        }
        // rebuild translation config after deployment
        await this.localizationService.buildTranslationConfig([...this.deployedBackendPlugins.values()]);
        // resolve on first deploy
        this.backendPluginsMetadataDeferred.resolve(undefined);
        return successes;
    }
    /**
     * @throws never! in order to isolate plugin deployment.
     * @returns whether the plugin is deployed after running this function. If the plugin was already installed, will still return `true`.
     */
    async deployPlugin(entry, entryPoint) {
        var _a, _b;
        const pluginPath = entry.path();
        const deployPlugin = this.stopwatch.start('deployPlugin');
        let id;
        let success = true;
        try {
            const manifest = await this.reader.readPackage(pluginPath);
            if (!manifest) {
                deployPlugin.error(`Failed to read ${entryPoint} plugin manifest from '${pluginPath}''`);
                return success = false;
            }
            const metadata = this.reader.readMetadata(manifest);
            metadata.isUnderDevelopment = (_a = entry.getValue('isUnderDevelopment')) !== null && _a !== void 0 ? _a : false;
            id = plugin_protocol_1.PluginIdentifiers.componentsToVersionedId(metadata.model);
            const deployedLocations = (_b = this.deployedLocations.get(id)) !== null && _b !== void 0 ? _b : new Set();
            deployedLocations.add(entry.rootPath);
            this.deployedLocations.set(id, deployedLocations);
            this.setSourceLocationsForPlugin(id, entry);
            const deployedPlugins = entryPoint === 'backend' ? this.deployedBackendPlugins : this.deployedFrontendPlugins;
            if (deployedPlugins.has(id)) {
                deployPlugin.debug(`Skipped ${entryPoint} plugin ${metadata.model.name} already deployed`);
                return true;
            }
            const { type } = entry;
            const deployed = { metadata, type };
            deployed.contributes = await this.reader.readContribution(manifest);
            await this.localizationService.deployLocalizations(deployed);
            deployedPlugins.set(id, deployed);
            deployPlugin.debug(`Deployed ${entryPoint} plugin "${id}" from "${metadata.model.entryPoint[entryPoint] || pluginPath}"`);
        }
        catch (e) {
            deployPlugin.error(`Failed to deploy ${entryPoint} plugin from '${pluginPath}' path`, e);
            return success = false;
        }
        finally {
            if (success && id) {
                this.markAsInstalled(id);
            }
        }
        return success;
    }
    async uninstallPlugin(pluginId) {
        try {
            const sourceLocations = this.sourceLocations.get(pluginId);
            if (!sourceLocations) {
                return false;
            }
            await Promise.all(Array.from(sourceLocations, location => fs.remove(location).catch(err => console.error(`Failed to remove source for ${pluginId} at ${location}`, err))));
            this.sourceLocations.delete(pluginId);
            this.localizationService.undeployLocalizations(pluginId);
            this.uninstallationManager.markAsUninstalled(pluginId);
            return true;
        }
        catch (e) {
            console.error('Error uninstalling plugin', e);
            return false;
        }
    }
    markAsInstalled(id) {
        const metadata = plugin_protocol_1.PluginIdentifiers.idAndVersionFromVersionedId(id);
        if (metadata) {
            const toMarkAsUninstalled = [];
            const checkForDifferentVersions = (others) => {
                for (const other of others) {
                    const otherMetadata = plugin_protocol_1.PluginIdentifiers.idAndVersionFromVersionedId(other);
                    if (metadata.id === (otherMetadata === null || otherMetadata === void 0 ? void 0 : otherMetadata.id) && metadata.version !== otherMetadata.version) {
                        toMarkAsUninstalled.push(other);
                    }
                }
            };
            checkForDifferentVersions(this.deployedFrontendPlugins.keys());
            checkForDifferentVersions(this.deployedBackendPlugins.keys());
            this.uninstallationManager.markAsUninstalled(...toMarkAsUninstalled);
            this.uninstallationManager.markAsInstalled(id);
            toMarkAsUninstalled.forEach(pluginToUninstall => this.uninstallPlugin(pluginToUninstall));
        }
    }
    async undeployPlugin(pluginId) {
        this.deployedBackendPlugins.delete(pluginId);
        this.deployedFrontendPlugins.delete(pluginId);
        const deployedLocations = this.deployedLocations.get(pluginId);
        if (!deployedLocations) {
            return false;
        }
        const undeployPlugin = this.stopwatch.start('undeployPlugin');
        this.deployedLocations.delete(pluginId);
        for (const location of deployedLocations) {
            try {
                await fs.remove(location);
                undeployPlugin.log(`[${pluginId}]: undeployed from "${location}"`);
            }
            catch (e) {
                undeployPlugin.error(`[${pluginId}]: failed to undeploy from location "${location}". reason:`, e);
            }
        }
        return true;
    }
    setSourceLocationsForPlugin(id, entry) {
        var _a;
        const knownLocations = (_a = this.sourceLocations.get(id)) !== null && _a !== void 0 ? _a : new Set();
        const maybeStoredLocations = entry.getValue('sourceLocations');
        const storedLocations = Array.isArray(maybeStoredLocations) && maybeStoredLocations.every(location => typeof location === 'string')
            ? maybeStoredLocations.concat(entry.originalPath())
            : [entry.originalPath()];
        storedLocations.forEach(location => knownLocations.add(location));
        this.sourceLocations.set(id, knownLocations);
    }
};
__decorate([
    (0, inversify_1.inject)(core_1.ILogger),
    __metadata("design:type", Object)
], HostedPluginDeployerHandler.prototype, "logger", void 0);
__decorate([
    (0, inversify_1.inject)(plugin_reader_1.HostedPluginReader),
    __metadata("design:type", plugin_reader_1.HostedPluginReader)
], HostedPluginDeployerHandler.prototype, "reader", void 0);
__decorate([
    (0, inversify_1.inject)(hosted_plugin_localization_service_1.HostedPluginLocalizationService),
    __metadata("design:type", hosted_plugin_localization_service_1.HostedPluginLocalizationService)
], HostedPluginDeployerHandler.prototype, "localizationService", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.Stopwatch),
    __metadata("design:type", common_1.Stopwatch)
], HostedPluginDeployerHandler.prototype, "stopwatch", void 0);
__decorate([
    (0, inversify_1.inject)(plugin_uninstallation_manager_1.PluginUninstallationManager),
    __metadata("design:type", plugin_uninstallation_manager_1.PluginUninstallationManager)
], HostedPluginDeployerHandler.prototype, "uninstallationManager", void 0);
HostedPluginDeployerHandler = __decorate([
    (0, inversify_1.injectable)()
], HostedPluginDeployerHandler);
exports.HostedPluginDeployerHandler = HostedPluginDeployerHandler;
//# sourceMappingURL=hosted-plugin-deployer-handler.js.map