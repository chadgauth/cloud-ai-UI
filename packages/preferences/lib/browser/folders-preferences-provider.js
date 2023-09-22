"use strict";
// *****************************************************************************
// Copyright (C) 2019 Ericsson and others.
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
exports.FoldersPreferencesProvider = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const inversify_1 = require("@theia/core/shared/inversify");
const uri_1 = require("@theia/core/lib/common/uri");
const preferences_1 = require("@theia/core/lib/browser/preferences");
const workspace_service_1 = require("@theia/workspace/lib/browser/workspace-service");
const preference_configurations_1 = require("@theia/core/lib/browser/preferences/preference-configurations");
const folder_preference_provider_1 = require("./folder-preference-provider");
let FoldersPreferencesProvider = class FoldersPreferencesProvider extends preferences_1.PreferenceProvider {
    constructor() {
        super(...arguments);
        this.providers = new Map();
    }
    init() {
        this.doInit();
    }
    async doInit() {
        await this.workspaceService.roots;
        this.updateProviders();
        this.workspaceService.onWorkspaceChanged(() => this.updateProviders());
        const readyPromises = [];
        for (const provider of this.providers.values()) {
            readyPromises.push(provider.ready.catch(e => console.error(e)));
        }
        Promise.all(readyPromises).then(() => this._ready.resolve());
    }
    updateProviders() {
        const roots = this.workspaceService.tryGetRoots();
        const toDelete = new Set(this.providers.keys());
        for (const folder of roots) {
            for (const configPath of this.configurations.getPaths()) {
                for (const configName of [...this.configurations.getSectionNames(), this.configurations.getConfigName()]) {
                    const sectionUri = this.configurations.createUri(folder.resource, configPath, configName);
                    const sectionKey = sectionUri.toString();
                    toDelete.delete(sectionKey);
                    if (!this.providers.has(sectionKey)) {
                        const provider = this.createProvider(sectionUri, configName, folder);
                        this.providers.set(sectionKey, provider);
                    }
                }
            }
        }
        for (const key of toDelete) {
            const provider = this.providers.get(key);
            if (provider) {
                this.providers.delete(key);
                provider.dispose();
            }
        }
    }
    getConfigUri(resourceUri, sectionName = this.configurations.getConfigName()) {
        for (const provider of this.getFolderProviders(resourceUri)) {
            const configUri = provider.getConfigUri(resourceUri);
            if (configUri && this.configurations.getName(configUri) === sectionName) {
                return configUri;
            }
        }
        return undefined;
    }
    getContainingConfigUri(resourceUri, sectionName = this.configurations.getConfigName()) {
        for (const provider of this.getFolderProviders(resourceUri)) {
            const configUri = provider.getConfigUri();
            if (provider.contains(resourceUri) && this.configurations.getName(configUri) === sectionName) {
                return configUri;
            }
        }
        return undefined;
    }
    getDomain() {
        return this.workspaceService.tryGetRoots().map(root => root.resource.toString());
    }
    resolve(preferenceName, resourceUri) {
        const result = {};
        const groups = this.groupProvidersByConfigName(resourceUri);
        for (const group of groups.values()) {
            for (const provider of group) {
                const { value, configUri } = provider.resolve(preferenceName, resourceUri);
                if (configUri && value !== undefined) {
                    result.configUri = configUri;
                    result.value = preferences_1.PreferenceProvider.merge(result.value, value);
                    break;
                }
            }
        }
        return result;
    }
    getPreferences(resourceUri) {
        let result = {};
        const groups = this.groupProvidersByConfigName(resourceUri);
        for (const group of groups.values()) {
            for (const provider of group) {
                if (provider.getConfigUri(resourceUri)) {
                    const preferences = provider.getPreferences();
                    result = preferences_1.PreferenceProvider.merge(result, preferences);
                    break;
                }
            }
        }
        return result;
    }
    async setPreference(preferenceName, value, resourceUri) {
        const firstPathFragment = preferenceName.split('.', 1)[0];
        const defaultConfigName = this.configurations.getConfigName();
        const configName = this.configurations.isSectionName(firstPathFragment) ? firstPathFragment : defaultConfigName;
        const providers = this.getFolderProviders(resourceUri);
        let configPath;
        const candidates = providers.filter(provider => {
            // Attempt to figure out the settings folder (.vscode or .theia) we're interested in.
            const containingConfigUri = provider.getConfigUri(resourceUri);
            if (configPath === undefined && containingConfigUri) {
                configPath = this.configurations.getPath(containingConfigUri);
            }
            const providerName = this.configurations.getName(containingConfigUri !== null && containingConfigUri !== void 0 ? containingConfigUri : provider.getConfigUri());
            return providerName === configName || providerName === defaultConfigName;
        });
        const configNameAndPathMatches = [];
        const configNameOnlyMatches = [];
        const configUriMatches = [];
        const otherMatches = [];
        for (const candidate of candidates) {
            const domainMatches = candidate.getConfigUri(resourceUri);
            const configUri = domainMatches !== null && domainMatches !== void 0 ? domainMatches : candidate.getConfigUri();
            const nameMatches = this.configurations.getName(configUri) === configName;
            const pathMatches = this.configurations.getPath(configUri) === configPath;
            // Perfect match, run immediately in case we can bail out early.
            if (nameMatches && domainMatches) {
                if (await candidate.setPreference(preferenceName, value, resourceUri)) {
                    return true;
                }
            }
            else if (nameMatches && pathMatches) { // Right file in the right folder.
                configNameAndPathMatches.push(candidate);
            }
            else if (nameMatches) { // Right file.
                configNameOnlyMatches.push(candidate);
            }
            else if (domainMatches) { // Currently valid and governs target URI
                configUriMatches.push(candidate);
            }
            else {
                otherMatches.push(candidate);
            }
        }
        const candidateSets = [configNameAndPathMatches, configNameOnlyMatches, configUriMatches, otherMatches];
        for (const candidateSet of candidateSets) {
            for (const candidate of candidateSet) {
                if (await candidate.setPreference(preferenceName, value, resourceUri)) {
                    return true;
                }
            }
        }
        return false;
    }
    canHandleScope(scope) {
        return this.workspaceService.isMultiRootWorkspaceOpened && scope === preferences_1.PreferenceScope.Folder || scope === preferences_1.PreferenceScope.Workspace;
    }
    groupProvidersByConfigName(resourceUri) {
        const groups = new Map();
        const providers = this.getFolderProviders(resourceUri);
        for (const configName of [this.configurations.getConfigName(), ...this.configurations.getSectionNames()]) {
            const group = [];
            for (const provider of providers) {
                if (this.configurations.getName(provider.getConfigUri()) === configName) {
                    group.push(provider);
                }
            }
            groups.set(configName, group);
        }
        return groups;
    }
    getFolderProviders(resourceUri) {
        if (!resourceUri) {
            return [];
        }
        const resourcePath = new uri_1.default(resourceUri).path;
        let folder = { relativity: Number.MAX_SAFE_INTEGER };
        const providers = new Map();
        for (const provider of this.providers.values()) {
            const uri = provider.folderUri.toString();
            const folderProviders = (providers.get(uri) || []);
            folderProviders.push(provider);
            providers.set(uri, folderProviders);
            // in case we have nested folders mounted as workspace roots, select the innermost enclosing folder
            const relativity = provider.folderUri.path.relativity(resourcePath);
            if (relativity >= 0 && folder.relativity > relativity) {
                folder = { relativity, uri };
            }
        }
        return folder.uri && providers.get(folder.uri) || [];
    }
    createProvider(uri, section, folder) {
        const provider = this.folderPreferenceProviderFactory(uri, section, folder);
        this.toDispose.push(provider);
        this.toDispose.push(provider.onDidPreferencesChanged(change => this.onDidPreferencesChangedEmitter.fire(change)));
        return provider;
    }
};
__decorate([
    (0, inversify_1.inject)(workspace_service_1.WorkspaceService),
    __metadata("design:type", workspace_service_1.WorkspaceService)
], FoldersPreferencesProvider.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(folder_preference_provider_1.FolderPreferenceProviderFactory),
    __metadata("design:type", Function)
], FoldersPreferencesProvider.prototype, "folderPreferenceProviderFactory", void 0);
__decorate([
    (0, inversify_1.inject)(preference_configurations_1.PreferenceConfigurations),
    __metadata("design:type", preference_configurations_1.PreferenceConfigurations)
], FoldersPreferencesProvider.prototype, "configurations", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FoldersPreferencesProvider.prototype, "init", null);
FoldersPreferencesProvider = __decorate([
    (0, inversify_1.injectable)()
], FoldersPreferencesProvider);
exports.FoldersPreferencesProvider = FoldersPreferencesProvider;
//# sourceMappingURL=folders-preferences-provider.js.map