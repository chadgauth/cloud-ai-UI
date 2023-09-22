"use strict";
// *****************************************************************************
// Copyright (C) 2020 TypeFox and others.
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
exports.VSXExtensionsModel = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const p_debounce_1 = require("p-debounce");
const markdownit = require("@theia/core/shared/markdown-it");
const DOMPurify = require("@theia/core/shared/dompurify");
const event_1 = require("@theia/core/lib/common/event");
const cancellation_1 = require("@theia/core/lib/common/cancellation");
const hosted_plugin_1 = require("@theia/plugin-ext/lib/hosted/browser/hosted-plugin");
const vsx_extension_1 = require("./vsx-extension");
const progress_service_1 = require("@theia/core/lib/common/progress-service");
const vsx_extensions_search_model_1 = require("./vsx-extensions-search-model");
const browser_1 = require("@theia/core/lib/browser");
const browser_2 = require("@theia/workspace/lib/browser");
const ovsx_types_1 = require("@theia/ovsx-client/lib/ovsx-types");
const ovsx_client_provider_1 = require("../common/ovsx-client-provider");
const request_1 = require("@theia/core/shared/@theia/request");
const ovsx_client_1 = require("@theia/ovsx-client");
let VSXExtensionsModel = class VSXExtensionsModel {
    constructor() {
        /**
         * Single source for all extensions
         */
        this.extensions = new Map();
        this.onDidChangeEmitter = new event_1.Emitter();
        this._installed = new Set();
        this._recommended = new Set();
        this._searchResult = new Set();
        this.searchCancellationTokenSource = new cancellation_1.CancellationTokenSource();
        this.updateSearchResult = (0, p_debounce_1.default)(async () => {
            const { token } = this.resetSearchCancellationTokenSource();
            await this.doUpdateSearchResult({ query: this.search.query, includeAllVersions: true }, token);
        }, 500);
    }
    init() {
        this.initialized = this.doInit().catch(console.error);
    }
    async doInit() {
        await Promise.all([
            this.initInstalled(),
            this.initSearchResult(),
            this.initRecommended(),
        ]);
    }
    get onDidChange() {
        return this.onDidChangeEmitter.event;
    }
    get installed() {
        return this._installed.values();
    }
    get searchError() {
        return this._searchError;
    }
    get searchResult() {
        return this._searchResult.values();
    }
    get recommended() {
        return this._recommended.values();
    }
    isInstalled(id) {
        return this._installed.has(id);
    }
    getExtension(id) {
        return this.extensions.get(id);
    }
    resolve(id) {
        return this.doChange(async () => {
            await this.initialized;
            const extension = await this.refresh(id);
            if (!extension) {
                throw new Error(`Failed to resolve ${id} extension.`);
            }
            if (extension.readmeUrl) {
                try {
                    const rawReadme = request_1.RequestContext.asText(await this.request.request({ url: extension.readmeUrl }));
                    const readme = this.compileReadme(rawReadme);
                    extension.update({ readme });
                }
                catch (e) {
                    if (!ovsx_types_1.VSXResponseError.is(e) || e.statusCode !== 404) {
                        console.error(`[${id}]: failed to compile readme, reason:`, e);
                    }
                }
            }
            return extension;
        });
    }
    async initInstalled() {
        await this.pluginSupport.willStart;
        this.pluginSupport.onDidChangePlugins(() => this.updateInstalled());
        try {
            await this.updateInstalled();
        }
        catch (e) {
            console.error(e);
        }
    }
    async initSearchResult() {
        this.search.onDidChangeQuery(() => this.updateSearchResult());
        try {
            await this.updateSearchResult();
        }
        catch (e) {
            console.error(e);
        }
    }
    async initRecommended() {
        this.preferences.onPreferenceChanged(change => {
            if (change.preferenceName === 'extensions') {
                this.updateRecommended();
            }
        });
        await this.preferences.ready;
        try {
            await this.updateRecommended();
        }
        catch (e) {
            console.error(e);
        }
    }
    resetSearchCancellationTokenSource() {
        this.searchCancellationTokenSource.cancel();
        return this.searchCancellationTokenSource = new cancellation_1.CancellationTokenSource();
    }
    setExtension(id) {
        let extension = this.extensions.get(id);
        if (!extension) {
            extension = this.extensionFactory({ id });
            this.extensions.set(id, extension);
        }
        return extension;
    }
    doChange(task, token = cancellation_1.CancellationToken.None) {
        return this.progressService.withProgress('', 'extensions', async () => {
            if (token && token.isCancellationRequested) {
                return;
            }
            const result = await task();
            if (token && token.isCancellationRequested) {
                return;
            }
            this.onDidChangeEmitter.fire();
            return result;
        });
    }
    doUpdateSearchResult(param, token) {
        return this.doChange(async () => {
            const searchResult = new Set();
            if (!param.query) {
                this._searchResult = searchResult;
                return;
            }
            const client = await this.clientProvider();
            const result = await client.search(param);
            this._searchError = result.error;
            if (token.isCancellationRequested) {
                return;
            }
            for (const data of result.extensions) {
                const id = data.namespace.toLowerCase() + '.' + data.name.toLowerCase();
                const allVersions = this.vsxApiFilter.getLatestCompatibleVersion(data);
                if (!allVersions) {
                    continue;
                }
                this.setExtension(id).update(Object.assign(data, {
                    publisher: data.namespace,
                    downloadUrl: data.files.download,
                    iconUrl: data.files.icon,
                    readmeUrl: data.files.readme,
                    licenseUrl: data.files.license,
                    version: allVersions.version
                }));
                searchResult.add(id);
            }
            this._searchResult = searchResult;
        }, token);
    }
    async updateInstalled() {
        const prevInstalled = this._installed;
        return this.doChange(async () => {
            const plugins = this.pluginSupport.plugins;
            const currInstalled = new Set();
            const refreshing = [];
            for (const plugin of plugins) {
                if (plugin.model.engine.type === 'vscode') {
                    const version = plugin.model.version;
                    const id = plugin.model.id;
                    this._installed.delete(id);
                    const extension = this.setExtension(id);
                    currInstalled.add(extension.id);
                    refreshing.push(this.refresh(id, version));
                }
            }
            for (const id of this._installed) {
                const extension = this.getExtension(id);
                if (!extension) {
                    continue;
                }
                refreshing.push(this.refresh(id, extension.version));
            }
            const installed = new Set([...prevInstalled, ...currInstalled]);
            const installedSorted = Array.from(installed).sort((a, b) => this.compareExtensions(a, b));
            this._installed = new Set(installedSorted.values());
            await Promise.all(refreshing);
        });
    }
    updateRecommended() {
        return this.doChange(async () => {
            const allRecommendations = new Set();
            const allUnwantedRecommendations = new Set();
            const updateRecommendationsForScope = (scope, root) => {
                const { recommendations, unwantedRecommendations } = this.getRecommendationsForScope(scope, root);
                recommendations.forEach(recommendation => allRecommendations.add(recommendation));
                unwantedRecommendations.forEach(unwantedRecommendation => allUnwantedRecommendations.add(unwantedRecommendation));
            };
            updateRecommendationsForScope('defaultValue'); // In case there are application-default recommendations.
            const roots = await this.workspaceService.roots;
            for (const root of roots) {
                updateRecommendationsForScope('workspaceFolderValue', root.resource);
            }
            if (this.workspaceService.saved) {
                updateRecommendationsForScope('workspaceValue');
            }
            const recommendedSorted = new Set(Array.from(allRecommendations).sort((a, b) => this.compareExtensions(a, b)));
            allUnwantedRecommendations.forEach(unwantedRecommendation => recommendedSorted.delete(unwantedRecommendation));
            this._recommended = recommendedSorted;
            return Promise.all(Array.from(recommendedSorted, plugin => this.refresh(plugin)));
        });
    }
    getRecommendationsForScope(scope, root) {
        var _a, _b, _c;
        const configuredValue = (_a = this.preferences.inspect('extensions', root === null || root === void 0 ? void 0 : root.toString())) === null || _a === void 0 ? void 0 : _a[scope];
        return {
            recommendations: (_b = configuredValue === null || configuredValue === void 0 ? void 0 : configuredValue.recommendations) !== null && _b !== void 0 ? _b : [],
            unwantedRecommendations: (_c = configuredValue === null || configuredValue === void 0 ? void 0 : configuredValue.unwantedRecommendations) !== null && _c !== void 0 ? _c : [],
        };
    }
    compileReadme(readmeMarkdown) {
        const readmeHtml = markdownit({ html: true }).render(readmeMarkdown);
        return DOMPurify.sanitize(readmeHtml);
    }
    async refresh(id, version) {
        try {
            let extension = this.getExtension(id);
            if (!this.shouldRefresh(extension)) {
                return extension;
            }
            const client = await this.clientProvider();
            let data;
            if (version === undefined) {
                const { extensions } = await client.query({ extensionId: id, includeAllVersions: true });
                if (extensions === null || extensions === void 0 ? void 0 : extensions.length) {
                    data = this.vsxApiFilter.getLatestCompatibleExtension(extensions);
                }
            }
            else {
                const { extensions } = await client.query({ extensionId: id, extensionVersion: version, includeAllVersions: true });
                if (extensions === null || extensions === void 0 ? void 0 : extensions.length) {
                    data = extensions === null || extensions === void 0 ? void 0 : extensions[0];
                }
            }
            if (!data) {
                return;
            }
            if (data.error) {
                return this.onDidFailRefresh(id, data.error);
            }
            extension = this.setExtension(id);
            extension.update(Object.assign(data, {
                publisher: data.namespace,
                downloadUrl: data.files.download,
                iconUrl: data.files.icon,
                readmeUrl: data.files.readme,
                licenseUrl: data.files.license,
                version: data.version
            }));
            return extension;
        }
        catch (e) {
            return this.onDidFailRefresh(id, e);
        }
    }
    /**
     * Determines if the given extension should be refreshed.
     * @param extension the extension to refresh.
     */
    shouldRefresh(extension) {
        if (extension === undefined) {
            return true;
        }
        return !extension.builtin;
    }
    onDidFailRefresh(id, error) {
        const cached = this.getExtension(id);
        if (cached && cached.installed) {
            return cached;
        }
        console.error(`[${id}]: failed to refresh, reason:`, error);
        return undefined;
    }
    /**
     * Compare two extensions based on their display name, and publisher if applicable.
     * @param a the first extension id for comparison.
     * @param b the second extension id for comparison.
     */
    compareExtensions(a, b) {
        const extensionA = this.getExtension(a);
        const extensionB = this.getExtension(b);
        if (!extensionA || !extensionB) {
            return 0;
        }
        if (extensionA.displayName && extensionB.displayName) {
            return extensionA.displayName.localeCompare(extensionB.displayName);
        }
        if (extensionA.publisher && extensionB.publisher) {
            return extensionA.publisher.localeCompare(extensionB.publisher);
        }
        return 0;
    }
};
__decorate([
    (0, inversify_1.inject)(ovsx_client_provider_1.OVSXClientProvider),
    __metadata("design:type", Function)
], VSXExtensionsModel.prototype, "clientProvider", void 0);
__decorate([
    (0, inversify_1.inject)(hosted_plugin_1.HostedPluginSupport),
    __metadata("design:type", hosted_plugin_1.HostedPluginSupport)
], VSXExtensionsModel.prototype, "pluginSupport", void 0);
__decorate([
    (0, inversify_1.inject)(vsx_extension_1.VSXExtensionFactory),
    __metadata("design:type", Function)
], VSXExtensionsModel.prototype, "extensionFactory", void 0);
__decorate([
    (0, inversify_1.inject)(progress_service_1.ProgressService),
    __metadata("design:type", progress_service_1.ProgressService)
], VSXExtensionsModel.prototype, "progressService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.PreferenceService),
    __metadata("design:type", Object)
], VSXExtensionsModel.prototype, "preferences", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.WorkspaceService),
    __metadata("design:type", browser_2.WorkspaceService)
], VSXExtensionsModel.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(vsx_extensions_search_model_1.VSXExtensionsSearchModel),
    __metadata("design:type", vsx_extensions_search_model_1.VSXExtensionsSearchModel)
], VSXExtensionsModel.prototype, "search", void 0);
__decorate([
    (0, inversify_1.inject)(request_1.RequestService),
    __metadata("design:type", Object)
], VSXExtensionsModel.prototype, "request", void 0);
__decorate([
    (0, inversify_1.inject)(ovsx_client_1.OVSXApiFilter),
    __metadata("design:type", Object)
], VSXExtensionsModel.prototype, "vsxApiFilter", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VSXExtensionsModel.prototype, "init", null);
VSXExtensionsModel = __decorate([
    (0, inversify_1.injectable)()
], VSXExtensionsModel);
exports.VSXExtensionsModel = VSXExtensionsModel;
//# sourceMappingURL=vsx-extensions-model.js.map