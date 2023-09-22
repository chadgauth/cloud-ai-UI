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
exports.PluginDeployerImpl = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const inversify_1 = require("@theia/core/shared/inversify");
const semver = require("semver");
const plugin_protocol_1 = require("../../common/plugin-protocol");
const plugin_deployer_entry_impl_1 = require("./plugin-deployer-entry-impl");
const plugin_deployer_resolver_context_impl_1 = require("./plugin-deployer-resolver-context-impl");
const plugin_deployer_proxy_entry_impl_1 = require("./plugin-deployer-proxy-entry-impl");
const plugin_deployer_file_handler_context_impl_1 = require("./plugin-deployer-file-handler-context-impl");
const plugin_deployer_directory_handler_context_impl_1 = require("./plugin-deployer-directory-handler-context-impl");
const core_1 = require("@theia/core");
const plugin_cli_contribution_1 = require("./plugin-cli-contribution");
const common_1 = require("@theia/core/lib/common");
let PluginDeployerImpl = class PluginDeployerImpl {
    constructor() {
        this.onDidDeployEmitter = new core_1.Emitter();
        this.onDidDeploy = this.onDidDeployEmitter.event;
    }
    start() {
        this.logger.debug('Starting the deployer with the list of resolvers', this.pluginResolvers);
        this.doStart();
    }
    async initResolvers() {
        // call init on each resolver
        const pluginDeployerResolverInit = new plugin_deployer_resolver_context_impl_1.PluginDeployerResolverInitImpl();
        const promises = this.pluginResolvers.map(async (pluginResolver) => {
            if (pluginResolver.init) {
                pluginResolver.init(pluginDeployerResolverInit);
            }
        });
        return Promise.all(promises);
    }
    async doStart() {
        // init resolvers
        await this.initResolvers();
        // check THEIA_DEFAULT_PLUGINS or THEIA_PLUGINS env var
        const defaultPluginsValue = process.env.THEIA_DEFAULT_PLUGINS || undefined;
        const pluginsValue = process.env.THEIA_PLUGINS || undefined;
        // check the `--plugins` CLI option
        const defaultPluginsValueViaCli = this.cliContribution.localDir();
        this.logger.debug('Found the list of default plugins ID on env:', defaultPluginsValue);
        this.logger.debug('Found the list of plugins ID on env:', pluginsValue);
        this.logger.debug('Found the list of default plugins ID from CLI:', defaultPluginsValueViaCli);
        // transform it to array
        const defaultPluginIdList = defaultPluginsValue ? defaultPluginsValue.split(',') : [];
        const pluginIdList = pluginsValue ? pluginsValue.split(',') : [];
        const systemEntries = defaultPluginIdList.concat(pluginIdList).concat(defaultPluginsValueViaCli ? defaultPluginsValueViaCli.split(',') : []);
        const userEntries = [];
        const context = { userEntries, systemEntries };
        for (const contribution of this.participants.getContributions()) {
            if (contribution.onWillStart) {
                await contribution.onWillStart(context);
            }
        }
        const deployPlugins = this.measure('deployPlugins');
        const unresolvedUserEntries = context.userEntries.map(id => ({
            id,
            type: plugin_protocol_1.PluginType.User
        }));
        const unresolvedSystemEntries = context.systemEntries.map(id => ({
            id,
            type: plugin_protocol_1.PluginType.System
        }));
        const plugins = await this.resolvePlugins([...unresolvedUserEntries, ...unresolvedSystemEntries]);
        deployPlugins.log('Resolve plugins list');
        await this.deployPlugins(plugins);
        deployPlugins.log('Deploy plugins list');
    }
    async uninstall(pluginId) {
        await this.pluginDeployerHandler.uninstallPlugin(pluginId);
    }
    async undeploy(pluginId) {
        if (await this.pluginDeployerHandler.undeployPlugin(pluginId)) {
            this.onDidDeployEmitter.fire();
        }
    }
    async deploy(plugin, options) {
        const deploy = this.measure('deploy');
        const numDeployedPlugins = await this.deployMultipleEntries([plugin], options);
        deploy.log(`Deploy plugin ${plugin.id}`);
        return numDeployedPlugins;
    }
    async deployMultipleEntries(plugins, options) {
        const pluginsToDeploy = await this.resolvePlugins(plugins, options);
        return this.deployPlugins(pluginsToDeploy);
    }
    /**
     * Resolves plugins for the given type.
     *
     * Only call it a single time before triggering a single deploy to prevent re-resolving of extension dependencies, i.e.
     * ```ts
     * const deployer: PluginDeployer;
     * deployer.deployPlugins(await deployer.resolvePlugins(allPluginEntries));
     * ```
     */
    async resolvePlugins(plugins, options) {
        const visited = new Set();
        const hasBeenVisited = (id) => visited.has(id) || (visited.add(id), false);
        const pluginsToDeploy = new Map();
        const unversionedIdsHandled = new Map();
        const queue = [...plugins];
        while (queue.length) {
            const pendingDependencies = [];
            await Promise.all(queue.map(async (entry) => {
                var _a, _b;
                if (hasBeenVisited(entry.id)) {
                    return;
                }
                const type = (_a = entry.type) !== null && _a !== void 0 ? _a : plugin_protocol_1.PluginType.System;
                try {
                    const pluginDeployerEntries = await this.resolveAndHandle(entry.id, type, options);
                    for (const deployerEntry of pluginDeployerEntries) {
                        const pluginData = await this.pluginDeployerHandler.getPluginDependencies(deployerEntry);
                        const versionedId = pluginData && plugin_protocol_1.PluginIdentifiers.componentsToVersionedId(pluginData.metadata.model);
                        const unversionedId = versionedId && plugin_protocol_1.PluginIdentifiers.componentsToUnversionedId(pluginData.metadata.model);
                        if (unversionedId && !pluginsToDeploy.has(versionedId)) {
                            pluginsToDeploy.set(versionedId, deployerEntry);
                            if (pluginData.mapping) {
                                pendingDependencies.push({ dependencies: pluginData.mapping, type });
                            }
                            const otherVersions = (_b = unversionedIdsHandled.get(unversionedId)) !== null && _b !== void 0 ? _b : [];
                            otherVersions.push(pluginData.metadata.model.version);
                            if (otherVersions.length === 1) {
                                unversionedIdsHandled.set(unversionedId, otherVersions);
                            }
                            else {
                                this.findBestVersion(unversionedId, otherVersions, pluginsToDeploy);
                            }
                        }
                    }
                }
                catch (e) {
                    console.error(`Failed to resolve plugins from '${entry.id}'`, e);
                }
            }));
            queue.length = 0;
            for (const { dependencies, type } of pendingDependencies) {
                for (const [dependency, deployableDependency] of dependencies) {
                    if (!unversionedIdsHandled.has(dependency)) {
                        queue.push({
                            id: deployableDependency,
                            type
                        });
                    }
                }
            }
        }
        return [...pluginsToDeploy.values()];
    }
    async resolveAndHandle(id, type, options) {
        const entries = await this.resolvePlugin(id, type, options);
        await this.applyFileHandlers(entries);
        await this.applyDirectoryFileHandlers(entries);
        return entries;
    }
    findBestVersion(unversionedId, versions, knownPlugins) {
        // If left better, return negative. Then best is index 0.
        versions.map(version => ({ version, plugin: knownPlugins.get(plugin_protocol_1.PluginIdentifiers.idAndVersionToVersionedId({ version, id: unversionedId })) }))
            .sort((left, right) => {
            const leftPlugin = left.plugin;
            const rightPlugin = right.plugin;
            if (!leftPlugin && !rightPlugin) {
                return 0;
            }
            if (!rightPlugin) {
                return -1;
            }
            if (!leftPlugin) {
                return 1;
            }
            if (leftPlugin.type === plugin_protocol_1.PluginType.System && rightPlugin.type === plugin_protocol_1.PluginType.User) {
                return -1;
            }
            if (leftPlugin.type === plugin_protocol_1.PluginType.User && rightPlugin.type === plugin_protocol_1.PluginType.System) {
                return 1;
            }
            if (semver.gtr(left.version, right.version)) {
                return -1;
            }
            return 1;
        }).forEach((versionedEntry, index) => {
            var _a;
            if (index !== 0) {
                // Mark as not accepted to prevent deployment of all but the winner.
                (_a = versionedEntry.plugin) === null || _a === void 0 ? void 0 : _a.accept();
            }
        });
    }
    /**
     * deploy all plugins that have been accepted
     */
    async deployPlugins(pluginsToDeploy) {
        const acceptedPlugins = pluginsToDeploy.filter(pluginDeployerEntry => pluginDeployerEntry.isAccepted());
        const acceptedFrontendPlugins = pluginsToDeploy.filter(pluginDeployerEntry => pluginDeployerEntry.isAccepted(plugin_protocol_1.PluginDeployerEntryType.FRONTEND));
        const acceptedBackendPlugins = pluginsToDeploy.filter(pluginDeployerEntry => pluginDeployerEntry.isAccepted(plugin_protocol_1.PluginDeployerEntryType.BACKEND));
        this.logger.debug('the accepted plugins are', acceptedPlugins);
        this.logger.debug('the acceptedFrontendPlugins plugins are', acceptedFrontendPlugins);
        this.logger.debug('the acceptedBackendPlugins plugins are', acceptedBackendPlugins);
        acceptedPlugins.forEach(plugin => {
            this.logger.debug('will deploy plugin', plugin.id(), 'with changes', JSON.stringify(plugin.getChanges()), 'and this plugin has been resolved by', plugin.resolvedBy());
        });
        // local path to launch
        const pluginPaths = acceptedBackendPlugins.map(pluginEntry => pluginEntry.path());
        this.logger.debug('local path to deploy on remote instance', pluginPaths);
        const deployments = await Promise.all([
            // start the backend plugins
            this.pluginDeployerHandler.deployBackendPlugins(acceptedBackendPlugins),
            this.pluginDeployerHandler.deployFrontendPlugins(acceptedFrontendPlugins)
        ]);
        this.onDidDeployEmitter.fire(undefined);
        return deployments.reduce((accumulated, current) => accumulated += current !== null && current !== void 0 ? current : 0, 0);
    }
    /**
     * If there are some single files, try to see if we can work on these files (like unpacking it, etc)
     */
    async applyFileHandlers(pluginDeployerEntries) {
        const waitPromises = pluginDeployerEntries.filter(pluginDeployerEntry => pluginDeployerEntry.isResolved()).flatMap(pluginDeployerEntry => this.pluginDeployerFileHandlers.map(async (pluginFileHandler) => {
            const proxyPluginDeployerEntry = new plugin_deployer_proxy_entry_impl_1.ProxyPluginDeployerEntry(pluginFileHandler, (pluginDeployerEntry));
            if (await pluginFileHandler.accept(proxyPluginDeployerEntry)) {
                const pluginDeployerFileHandlerContext = new plugin_deployer_file_handler_context_impl_1.PluginDeployerFileHandlerContextImpl(proxyPluginDeployerEntry);
                await pluginFileHandler.handle(pluginDeployerFileHandlerContext);
            }
        }));
        await Promise.all(waitPromises);
    }
    /**
     * Check for all registered directories to see if there are some plugins that can be accepted to be deployed.
     */
    async applyDirectoryFileHandlers(pluginDeployerEntries) {
        const waitPromises = pluginDeployerEntries.filter(pluginDeployerEntry => pluginDeployerEntry.isResolved()).flatMap(pluginDeployerEntry => this.pluginDeployerDirectoryHandlers.map(async (pluginDirectoryHandler) => {
            const proxyPluginDeployerEntry = new plugin_deployer_proxy_entry_impl_1.ProxyPluginDeployerEntry(pluginDirectoryHandler, (pluginDeployerEntry));
            if (await pluginDirectoryHandler.accept(proxyPluginDeployerEntry)) {
                const pluginDeployerDirectoryHandlerContext = new plugin_deployer_directory_handler_context_impl_1.PluginDeployerDirectoryHandlerContextImpl(proxyPluginDeployerEntry);
                await pluginDirectoryHandler.handle(pluginDeployerDirectoryHandlerContext);
            }
        }));
        await Promise.all(waitPromises);
    }
    /**
     * Check a plugin ID see if there are some resolvers that can handle it. If there is a matching resolver, then we resolve the plugin
     */
    async resolvePlugin(pluginId, type = plugin_protocol_1.PluginType.System, options) {
        const pluginDeployerEntries = [];
        const foundPluginResolver = this.pluginResolvers.find(pluginResolver => pluginResolver.accept(pluginId));
        // there is a resolver for the input
        if (foundPluginResolver) {
            // create context object
            const context = new plugin_deployer_resolver_context_impl_1.PluginDeployerResolverContextImpl(foundPluginResolver, pluginId);
            await foundPluginResolver.resolve(context, options);
            context.getPlugins().forEach(entry => {
                entry.type = type;
                pluginDeployerEntries.push(entry);
            });
        }
        else {
            // log it for now
            this.logger.error('No plugin resolver found for the entry', pluginId);
            const unresolvedEntry = new plugin_deployer_entry_impl_1.PluginDeployerEntryImpl(pluginId, pluginId);
            unresolvedEntry.type = type;
            pluginDeployerEntries.push(unresolvedEntry);
        }
        return pluginDeployerEntries;
    }
    measure(name) {
        return this.stopwatch.start(name);
    }
};
__decorate([
    (0, inversify_1.inject)(core_1.ILogger),
    __metadata("design:type", Object)
], PluginDeployerImpl.prototype, "logger", void 0);
__decorate([
    (0, inversify_1.inject)(plugin_protocol_1.PluginDeployerHandler),
    __metadata("design:type", Object)
], PluginDeployerImpl.prototype, "pluginDeployerHandler", void 0);
__decorate([
    (0, inversify_1.inject)(plugin_cli_contribution_1.PluginCliContribution),
    __metadata("design:type", plugin_cli_contribution_1.PluginCliContribution)
], PluginDeployerImpl.prototype, "cliContribution", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.Stopwatch),
    __metadata("design:type", common_1.Stopwatch)
], PluginDeployerImpl.prototype, "stopwatch", void 0);
__decorate([
    (0, inversify_1.optional)(),
    (0, inversify_1.multiInject)(plugin_protocol_1.PluginDeployerResolver),
    __metadata("design:type", Array)
], PluginDeployerImpl.prototype, "pluginResolvers", void 0);
__decorate([
    (0, inversify_1.optional)(),
    (0, inversify_1.multiInject)(plugin_protocol_1.PluginDeployerFileHandler),
    __metadata("design:type", Array)
], PluginDeployerImpl.prototype, "pluginDeployerFileHandlers", void 0);
__decorate([
    (0, inversify_1.optional)(),
    (0, inversify_1.multiInject)(plugin_protocol_1.PluginDeployerDirectoryHandler),
    __metadata("design:type", Array)
], PluginDeployerImpl.prototype, "pluginDeployerDirectoryHandlers", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.ContributionProvider),
    (0, inversify_1.named)(plugin_protocol_1.PluginDeployerParticipant),
    __metadata("design:type", Object)
], PluginDeployerImpl.prototype, "participants", void 0);
PluginDeployerImpl = __decorate([
    (0, inversify_1.injectable)()
], PluginDeployerImpl);
exports.PluginDeployerImpl = PluginDeployerImpl;
//# sourceMappingURL=plugin-deployer-impl.js.map