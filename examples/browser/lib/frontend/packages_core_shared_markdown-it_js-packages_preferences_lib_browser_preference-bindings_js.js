(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_core_shared_markdown-it_js-packages_preferences_lib_browser_preference-bindings_js"],{

/***/ "../../packages/core/shared/markdown-it.js":
/*!*************************************************!*\
  !*** ../../packages/core/shared/markdown-it.js ***!
  \*************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! markdown-it */ "../../node_modules/markdown-it/index.js");

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/shared/markdown-it'] = this;


/***/ }),

/***/ "../../packages/preferences/lib/browser/abstract-resource-preference-provider.js":
/*!***************************************************************************************!*\
  !*** ../../packages/preferences/lib/browser/abstract-resource-preference-provider.js ***!
  \***************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2018 Ericsson and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AbstractResourcePreferenceProvider = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-null/no-null */
const jsoncparser = __webpack_require__(/*! jsonc-parser */ "../../node_modules/jsonc-parser/lib/esm/main.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const preference_configurations_1 = __webpack_require__(/*! @theia/core/lib/browser/preferences/preference-configurations */ "../../packages/core/lib/browser/preferences/preference-configurations.js");
const promise_util_1 = __webpack_require__(/*! @theia/core/lib/common/promise-util */ "../../packages/core/lib/common/promise-util.js");
const file_service_1 = __webpack_require__(/*! @theia/filesystem/lib/browser/file-service */ "../../packages/filesystem/lib/browser/file-service.js");
const preference_transaction_manager_1 = __webpack_require__(/*! ./preference-transaction-manager */ "../../packages/preferences/lib/browser/preference-transaction-manager.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
let AbstractResourcePreferenceProvider = class AbstractResourcePreferenceProvider extends browser_1.PreferenceProvider {
    constructor() {
        super(...arguments);
        this.preferences = {};
        this._fileExists = false;
        this.loading = new promise_util_1.Deferred();
        this.onDidChangeValidityEmitter = new core_1.Emitter();
    }
    set fileExists(exists) {
        if (exists !== this._fileExists) {
            this._fileExists = exists;
            this.onDidChangeValidityEmitter.fire(exists);
        }
    }
    get onDidChangeValidity() {
        return this.onDidChangeValidityEmitter.event;
    }
    init() {
        this.doInit();
    }
    async doInit() {
        const uri = this.getUri();
        this.toDispose.push(disposable_1.Disposable.create(() => this.loading.reject(new Error(`Preference provider for '${uri}' was disposed.`))));
        await this.readPreferencesFromFile();
        this._ready.resolve();
        this.loading.resolve();
        const storageUri = this.toFileManager().getConfigUri();
        this.toDispose.pushAll([
            this.fileService.watch(storageUri),
            this.fileService.onDidFilesChange(e => {
                if (e.contains(storageUri)) {
                    this.readPreferencesFromFile();
                }
            }),
            disposable_1.Disposable.create(() => this.reset()),
        ]);
    }
    get valid() {
        return this._fileExists;
    }
    getConfigUri(resourceUri) {
        if (!resourceUri) {
            return this.getUri();
        }
        return this.valid && this.contains(resourceUri) ? this.getUri() : undefined;
    }
    contains(resourceUri) {
        if (!resourceUri) {
            return true;
        }
        const domain = this.getDomain();
        if (!domain) {
            return true;
        }
        const resourcePath = new uri_1.default(resourceUri).path;
        return domain.some(uri => new uri_1.default(uri).path.relativity(resourcePath) >= 0);
    }
    getPreferences(resourceUri) {
        return this.valid && this.contains(resourceUri) ? this.preferences : {};
    }
    async setPreference(key, value, resourceUri) {
        let path;
        if (this.toDispose.disposed || !(path = this.getPath(key)) || !this.contains(resourceUri)) {
            return false;
        }
        return this.doSetPreference(key, path, value);
    }
    async doSetPreference(key, path, value) {
        var _a;
        if (!((_a = this.transaction) === null || _a === void 0 ? void 0 : _a.open)) {
            const current = this.transaction;
            this.transaction = this.transactionFactory(this.toFileManager(), current === null || current === void 0 ? void 0 : current.result);
            this.transaction.onWillConclude(({ status, waitUntil }) => {
                if (status) {
                    waitUntil((async () => {
                        await this.readPreferencesFromFile();
                        await this.fireDidPreferencesChanged(); // Ensure all consumers of the event have received it.
                    })());
                }
            });
            this.toDispose.push(this.transaction);
        }
        return this.transaction.enqueueAction(key, path, value);
    }
    /**
     * Use this method as intermediary for interactions with actual files.
     * Allows individual providers to modify where they store their files without disrupting the preference system's
     * conventions about scope and file location.
     */
    toFileManager() {
        return this;
    }
    getPath(preferenceName) {
        const asOverride = this.preferenceOverrideService.overriddenPreferenceName(preferenceName);
        if (asOverride === null || asOverride === void 0 ? void 0 : asOverride.overrideIdentifier) {
            return [this.preferenceOverrideService.markLanguageOverride(asOverride.overrideIdentifier), asOverride.preferenceName];
        }
        return [preferenceName];
    }
    async readPreferencesFromFile() {
        const content = await this.fileService.read(this.toFileManager().getConfigUri())
            .then(value => {
            this.fileExists = true;
            return value;
        })
            .catch(() => {
            this.fileExists = false;
            return { value: '' };
        });
        this.readPreferencesFromContent(content.value);
    }
    readPreferencesFromContent(content) {
        let preferencesInJson;
        try {
            preferencesInJson = this.parse(content);
        }
        catch {
            preferencesInJson = {};
        }
        const parsedPreferences = this.getParsedContent(preferencesInJson);
        this.handlePreferenceChanges(parsedPreferences);
    }
    parse(content) {
        content = content.trim();
        if (!content) {
            return undefined;
        }
        const strippedContent = jsoncparser.stripComments(content);
        return jsoncparser.parse(strippedContent);
    }
    handlePreferenceChanges(newPrefs) {
        const oldPrefs = Object.assign({}, this.preferences);
        this.preferences = newPrefs;
        const prefNames = new Set([...Object.keys(oldPrefs), ...Object.keys(newPrefs)]);
        const prefChanges = [];
        const uri = this.getUri();
        for (const prefName of prefNames.values()) {
            const oldValue = oldPrefs[prefName];
            const newValue = newPrefs[prefName];
            const schemaProperties = this.schemaProvider.getCombinedSchema().properties[prefName];
            if (schemaProperties) {
                const scope = schemaProperties.scope;
                // do not emit the change event if the change is made out of the defined preference scope
                if (!this.schemaProvider.isValidInScope(prefName, this.getScope())) {
                    console.warn(`Preference ${prefName} in ${uri} can only be defined in scopes: ${browser_1.PreferenceScope.getScopeNames(scope).join(', ')}.`);
                    continue;
                }
            }
            if (!browser_1.PreferenceProvider.deepEqual(newValue, oldValue)) {
                prefChanges.push({
                    preferenceName: prefName, newValue, oldValue, scope: this.getScope(), domain: this.getDomain()
                });
            }
        }
        if (prefChanges.length > 0) {
            this.emitPreferencesChangedEvent(prefChanges);
        }
    }
    reset() {
        const preferences = this.preferences;
        this.preferences = {};
        const changes = [];
        for (const prefName of Object.keys(preferences)) {
            const value = preferences[prefName];
            if (value !== undefined) {
                changes.push({
                    preferenceName: prefName, newValue: undefined, oldValue: value, scope: this.getScope(), domain: this.getDomain()
                });
            }
        }
        if (changes.length > 0) {
            this.emitPreferencesChangedEvent(changes);
        }
    }
};
__decorate([
    (0, inversify_1.inject)(preference_transaction_manager_1.PreferenceTransactionFactory),
    __metadata("design:type", Function)
], AbstractResourcePreferenceProvider.prototype, "transactionFactory", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.PreferenceSchemaProvider),
    __metadata("design:type", browser_1.PreferenceSchemaProvider)
], AbstractResourcePreferenceProvider.prototype, "schemaProvider", void 0);
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], AbstractResourcePreferenceProvider.prototype, "fileService", void 0);
__decorate([
    (0, inversify_1.inject)(preference_configurations_1.PreferenceConfigurations),
    __metadata("design:type", preference_configurations_1.PreferenceConfigurations)
], AbstractResourcePreferenceProvider.prototype, "configurations", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AbstractResourcePreferenceProvider.prototype, "init", null);
AbstractResourcePreferenceProvider = __decorate([
    (0, inversify_1.injectable)()
], AbstractResourcePreferenceProvider);
exports.AbstractResourcePreferenceProvider = AbstractResourcePreferenceProvider;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/preferences/lib/browser/abstract-resource-preference-provider'] = this;


/***/ }),

/***/ "../../packages/preferences/lib/browser/folder-preference-provider.js":
/*!****************************************************************************!*\
  !*** ../../packages/preferences/lib/browser/folder-preference-provider.js ***!
  \****************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FolderPreferenceProvider = exports.FolderPreferenceProviderFolder = exports.FolderPreferenceProviderFactory = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const files_1 = __webpack_require__(/*! @theia/filesystem/lib/common/files */ "../../packages/filesystem/lib/common/files.js");
const section_preference_provider_1 = __webpack_require__(/*! ./section-preference-provider */ "../../packages/preferences/lib/browser/section-preference-provider.js");
exports.FolderPreferenceProviderFactory = Symbol('FolderPreferenceProviderFactory');
exports.FolderPreferenceProviderFolder = Symbol('FolderPreferenceProviderFolder');
let FolderPreferenceProvider = class FolderPreferenceProvider extends section_preference_provider_1.SectionPreferenceProvider {
    get folderUri() {
        if (!this._folderUri) {
            this._folderUri = this.folder.resource;
        }
        return this._folderUri;
    }
    getScope() {
        if (!this.workspaceService.isMultiRootWorkspaceOpened) {
            // when FolderPreferenceProvider is used as a delegate of WorkspacePreferenceProvider in a one-folder workspace
            return browser_1.PreferenceScope.Workspace;
        }
        return browser_1.PreferenceScope.Folder;
    }
    getDomain() {
        return [this.folderUri.toString()];
    }
};
__decorate([
    (0, inversify_1.inject)(exports.FolderPreferenceProviderFolder),
    __metadata("design:type", Object)
], FolderPreferenceProvider.prototype, "folder", void 0);
FolderPreferenceProvider = __decorate([
    (0, inversify_1.injectable)()
], FolderPreferenceProvider);
exports.FolderPreferenceProvider = FolderPreferenceProvider;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/preferences/lib/browser/folder-preference-provider'] = this;


/***/ }),

/***/ "../../packages/preferences/lib/browser/folders-preferences-provider.js":
/*!******************************************************************************!*\
  !*** ../../packages/preferences/lib/browser/folders-preferences-provider.js ***!
  \******************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FoldersPreferencesProvider = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const preferences_1 = __webpack_require__(/*! @theia/core/lib/browser/preferences */ "../../packages/core/lib/browser/preferences/index.js");
const workspace_service_1 = __webpack_require__(/*! @theia/workspace/lib/browser/workspace-service */ "../../packages/workspace/lib/browser/workspace-service.js");
const preference_configurations_1 = __webpack_require__(/*! @theia/core/lib/browser/preferences/preference-configurations */ "../../packages/core/lib/browser/preferences/preference-configurations.js");
const folder_preference_provider_1 = __webpack_require__(/*! ./folder-preference-provider */ "../../packages/preferences/lib/browser/folder-preference-provider.js");
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

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/preferences/lib/browser/folders-preferences-provider'] = this;


/***/ }),

/***/ "../../packages/preferences/lib/browser/monaco-jsonc-editor.js":
/*!*********************************************************************!*\
  !*** ../../packages/preferences/lib/browser/monaco-jsonc-editor.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2021 Ericsson and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MonacoJSONCEditor = void 0;
const jsoncparser = __webpack_require__(/*! jsonc-parser */ "../../node_modules/jsonc-parser/lib/esm/main.js");
const monaco_workspace_1 = __webpack_require__(/*! @theia/monaco/lib/browser/monaco-workspace */ "../../packages/monaco/lib/browser/monaco-workspace.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const monaco = __webpack_require__(/*! @theia/monaco-editor-core */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/editor.main.js");
let MonacoJSONCEditor = class MonacoJSONCEditor {
    async setValue(model, path, value, shouldSave = true) {
        const edits = this.getEditOperations(model, path, value);
        if (edits.length > 0) {
            await this.workspace.applyBackgroundEdit(model, edits, shouldSave);
        }
    }
    getEditOperations(model, path, value) {
        const textModel = model.textEditorModel;
        const content = model.getText().trim();
        // Everything is already undefined - no need for changes.
        if (!content && value === undefined) {
            return [];
        }
        // Delete the entire document.
        if (!path.length && value === undefined) {
            return [{
                    range: textModel.getFullModelRange(),
                    text: null,
                    forceMoveMarkers: false
                }];
        }
        const { insertSpaces, tabSize, defaultEOL } = textModel.getOptions();
        const jsonCOptions = {
            formattingOptions: {
                insertSpaces,
                tabSize,
                eol: defaultEOL === monaco.editor.DefaultEndOfLine.LF ? '\n' : '\r\n'
            }
        };
        return jsoncparser.modify(content, path, value, jsonCOptions).map(edit => {
            const start = textModel.getPositionAt(edit.offset);
            const end = textModel.getPositionAt(edit.offset + edit.length);
            return {
                range: monaco.Range.fromPositions(start, end),
                text: edit.content || null,
                forceMoveMarkers: false
            };
        });
    }
};
__decorate([
    (0, inversify_1.inject)(monaco_workspace_1.MonacoWorkspace),
    __metadata("design:type", monaco_workspace_1.MonacoWorkspace)
], MonacoJSONCEditor.prototype, "workspace", void 0);
MonacoJSONCEditor = __decorate([
    (0, inversify_1.injectable)()
], MonacoJSONCEditor);
exports.MonacoJSONCEditor = MonacoJSONCEditor;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/preferences/lib/browser/monaco-jsonc-editor'] = this;


/***/ }),

/***/ "../../packages/preferences/lib/browser/preference-bindings.js":
/*!*********************************************************************!*\
  !*** ../../packages/preferences/lib/browser/preference-bindings.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2018 Ericsson and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.bindPreferenceProviders = exports.bindFactory = exports.bindWorkspaceFilePreferenceProvider = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const preferences_1 = __webpack_require__(/*! @theia/core/lib/browser/preferences */ "../../packages/core/lib/browser/preferences/index.js");
const user_preference_provider_1 = __webpack_require__(/*! ./user-preference-provider */ "../../packages/preferences/lib/browser/user-preference-provider.js");
const workspace_preference_provider_1 = __webpack_require__(/*! ./workspace-preference-provider */ "../../packages/preferences/lib/browser/workspace-preference-provider.js");
const workspace_file_preference_provider_1 = __webpack_require__(/*! ./workspace-file-preference-provider */ "../../packages/preferences/lib/browser/workspace-file-preference-provider.js");
const folders_preferences_provider_1 = __webpack_require__(/*! ./folders-preferences-provider */ "../../packages/preferences/lib/browser/folders-preferences-provider.js");
const folder_preference_provider_1 = __webpack_require__(/*! ./folder-preference-provider */ "../../packages/preferences/lib/browser/folder-preference-provider.js");
const user_configs_preference_provider_1 = __webpack_require__(/*! ./user-configs-preference-provider */ "../../packages/preferences/lib/browser/user-configs-preference-provider.js");
const section_preference_provider_1 = __webpack_require__(/*! ./section-preference-provider */ "../../packages/preferences/lib/browser/section-preference-provider.js");
function bindWorkspaceFilePreferenceProvider(bind) {
    bind(workspace_file_preference_provider_1.WorkspaceFilePreferenceProviderFactory).toFactory(ctx => (options) => {
        const child = new inversify_1.Container({ defaultScope: 'Singleton' });
        child.parent = ctx.container;
        child.bind(workspace_file_preference_provider_1.WorkspaceFilePreferenceProvider).toSelf();
        child.bind(workspace_file_preference_provider_1.WorkspaceFilePreferenceProviderOptions).toConstantValue(options);
        return child.get(workspace_file_preference_provider_1.WorkspaceFilePreferenceProvider);
    });
}
exports.bindWorkspaceFilePreferenceProvider = bindWorkspaceFilePreferenceProvider;
function bindFactory(bind, factoryId, constructor, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
...parameterBindings) {
    bind(factoryId).toFactory(ctx => 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (...args) => {
        const child = new inversify_1.Container({ defaultScope: 'Singleton' });
        child.parent = ctx.container;
        for (let i = 0; i < parameterBindings.length; i++) {
            child.bind(parameterBindings[i]).toConstantValue(args[i]);
        }
        child.bind(constructor).to(constructor);
        return child.get(constructor);
    });
}
exports.bindFactory = bindFactory;
function bindPreferenceProviders(bind, unbind) {
    unbind(preferences_1.PreferenceProvider);
    bind(preferences_1.PreferenceProvider).to(user_configs_preference_provider_1.UserConfigsPreferenceProvider).inSingletonScope().whenTargetNamed(preferences_1.PreferenceScope.User);
    bind(preferences_1.PreferenceProvider).to(workspace_preference_provider_1.WorkspacePreferenceProvider).inSingletonScope().whenTargetNamed(preferences_1.PreferenceScope.Workspace);
    bind(preferences_1.PreferenceProvider).to(folders_preferences_provider_1.FoldersPreferencesProvider).inSingletonScope().whenTargetNamed(preferences_1.PreferenceScope.Folder);
    bindWorkspaceFilePreferenceProvider(bind);
    bindFactory(bind, user_preference_provider_1.UserPreferenceProviderFactory, user_preference_provider_1.UserPreferenceProvider, section_preference_provider_1.SectionPreferenceProviderUri, section_preference_provider_1.SectionPreferenceProviderSection);
    bindFactory(bind, folder_preference_provider_1.FolderPreferenceProviderFactory, folder_preference_provider_1.FolderPreferenceProvider, section_preference_provider_1.SectionPreferenceProviderUri, section_preference_provider_1.SectionPreferenceProviderSection, folder_preference_provider_1.FolderPreferenceProviderFolder);
}
exports.bindPreferenceProviders = bindPreferenceProviders;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/preferences/lib/browser/preference-bindings'] = this;


/***/ }),

/***/ "../../packages/preferences/lib/browser/preference-transaction-manager.js":
/*!********************************************************************************!*\
  !*** ../../packages/preferences/lib/browser/preference-transaction-manager.js ***!
  \********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2021 Ericsson and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.preferenceTransactionFactoryCreator = exports.PreferenceTransactionFactory = exports.PreferenceTransaction = exports.PreferenceTransactionPreludeProvider = exports.PreferenceContext = exports.Transaction = void 0;
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const promise_util_1 = __webpack_require__(/*! @theia/core/lib/common/promise-util */ "../../packages/core/lib/common/promise-util.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const preference_scope_1 = __webpack_require__(/*! @theia/core/lib/common/preferences/preference-scope */ "../../packages/core/lib/common/preferences/preference-scope.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const async_mutex_1 = __webpack_require__(/*! async-mutex */ "../../node_modules/async-mutex/lib/index.js");
const monaco_text_model_service_1 = __webpack_require__(/*! @theia/monaco/lib/browser/monaco-text-model-service */ "../../packages/monaco/lib/browser/monaco-text-model-service.js");
const monaco_jsonc_editor_1 = __webpack_require__(/*! ./monaco-jsonc-editor */ "../../packages/preferences/lib/browser/monaco-jsonc-editor.js");
const editor_manager_1 = __webpack_require__(/*! @theia/editor/lib/browser/editor-manager */ "../../packages/editor/lib/browser/editor-manager.js");
let Transaction = 
/**
 * Represents a batch of interactions with an underlying resource.
 */
class Transaction {
    constructor() {
        this._open = true;
        this._result = new promise_util_1.Deferred();
        /**
         * The transaction will self-dispose when the queue is empty, once at least one action has been processed.
         */
        this.queue = new async_mutex_1.Mutex(new core_1.CancellationError());
        this.onWillConcludeEmitter = new core_1.Emitter();
        this.status = new promise_util_1.Deferred();
        /**
         * Whether any actions have been added to the transaction.
         * The Transaction will not self-dispose until at least one action has been performed.
         */
        this.inUse = false;
    }
    /**
     * Whether the transaction is still accepting new interactions.
     * Enqueueing an action when the Transaction is no longer open will throw an error.
     */
    get open() {
        return this._open;
    }
    /**
     * The status of the transaction when complete.
     */
    get result() {
        return this._result.promise;
    }
    /**
     * An event fired when the transaction is wrapping up.
     * Consumers can call `waitUntil` on the event to delay the resolution of the `result` Promise.
     */
    get onWillConclude() {
        return this.onWillConcludeEmitter.event;
    }
    init() {
        this.doInit();
    }
    async doInit() {
        const release = await this.queue.acquire();
        try {
            const status = await this.setUp();
            this.status.resolve(status);
        }
        catch {
            this.dispose();
        }
        finally {
            release();
        }
    }
    async waitFor(delay, disposeIfRejected) {
        try {
            await this.queue.runExclusive(() => delay);
        }
        catch {
            if (disposeIfRejected) {
                this.dispose();
            }
        }
    }
    /**
     * @returns a promise reflecting the result of performing an action. Typically the promise will not resolve until the whole transaction is complete.
     */
    async enqueueAction(...args) {
        if (this._open) {
            let release;
            try {
                release = await this.queue.acquire();
                if (!this.inUse) {
                    this.inUse = true;
                    this.disposeWhenDone();
                }
                return this.act(...args);
            }
            catch (e) {
                if (e instanceof core_1.CancellationError) {
                    throw e;
                }
                return false;
            }
            finally {
                release === null || release === void 0 ? void 0 : release();
            }
        }
        else {
            throw new Error('Transaction used after disposal.');
        }
    }
    disposeWhenDone() {
        // Due to properties of the micro task system, it's possible for something to have been enqueued between
        // the resolution of the waitForUnlock() promise and the the time this code runs, so we have to check.
        this.queue.waitForUnlock().then(() => {
            if (!this.queue.isLocked()) {
                this.dispose();
            }
            else {
                this.disposeWhenDone();
            }
        });
    }
    async conclude() {
        if (this._open) {
            try {
                this._open = false;
                this.queue.cancel();
                const result = await this.tearDown();
                const status = this.status.state === 'unresolved' || this.status.state === 'rejected' ? false : await this.status.promise;
                await core_1.WaitUntilEvent.fire(this.onWillConcludeEmitter, { status });
                this.onWillConcludeEmitter.dispose();
                this._result.resolve(result);
            }
            catch {
                this._result.resolve(false);
            }
        }
    }
    dispose() {
        this.conclude();
    }
};
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Transaction.prototype, "init", null);
Transaction = __decorate([
    (0, inversify_1.injectable)()
    /**
     * Represents a batch of interactions with an underlying resource.
     */
], Transaction);
exports.Transaction = Transaction;
exports.PreferenceContext = Symbol('PreferenceContext');
exports.PreferenceTransactionPreludeProvider = Symbol('PreferenceTransactionPreludeProvider');
let PreferenceTransaction = class PreferenceTransaction extends Transaction {
    async doInit() {
        var _a;
        this.waitFor((_a = this.prelude) === null || _a === void 0 ? void 0 : _a.call(this));
        await super.doInit();
    }
    async setUp() {
        const reference = await this.textModelService.createModelReference(this.context.getConfigUri());
        if (this._open) {
            this.reference = reference;
        }
        else {
            reference.dispose();
            return false;
        }
        if (reference.object.dirty) {
            const shouldContinue = await this.handleDirtyEditor();
            if (!shouldContinue) {
                this.dispose();
                return false;
            }
        }
        return true;
    }
    /**
     * @returns whether the setting operation in progress, and any others started in the meantime, should continue.
     */
    async handleDirtyEditor() {
        var _a;
        const saveAndRetry = core_1.nls.localizeByDefault('Save and Retry');
        const open = core_1.nls.localizeByDefault('Open File');
        const msg = await this.messageService.error(
        // eslint-disable-next-line @theia/localization-check
        core_1.nls.localizeByDefault('Unable to write into {0} settings because the file has unsaved changes. Please save the {0} settings file first and then try again.', core_1.nls.localizeByDefault(preference_scope_1.PreferenceScope[this.context.getScope()].toLocaleLowerCase())), saveAndRetry, open);
        if ((_a = this.reference) === null || _a === void 0 ? void 0 : _a.object) {
            if (msg === open) {
                this.editorManager.open(new uri_1.default(this.reference.object.uri));
            }
            else if (msg === saveAndRetry) {
                await this.reference.object.save();
                return true;
            }
        }
        return false;
    }
    async act(key, path, value) {
        var _a;
        const model = (_a = this.reference) === null || _a === void 0 ? void 0 : _a.object;
        try {
            if (model) {
                await this.jsoncEditor.setValue(model, path, value);
                return this.result;
            }
            return false;
        }
        catch (e) {
            const message = `Failed to update the value of '${key}' in '${this.context.getConfigUri()}'.`;
            this.messageService.error(`${message} Please check if it is corrupted.`);
            console.error(`${message}`, e);
            return false;
        }
    }
    async tearDown() {
        var _a, _b;
        try {
            const model = (_a = this.reference) === null || _a === void 0 ? void 0 : _a.object;
            if (model) {
                if (this.status.state === 'resolved' && await this.status.promise) {
                    await model.save();
                    return true;
                }
            }
            return false;
        }
        finally {
            (_b = this.reference) === null || _b === void 0 ? void 0 : _b.dispose();
            this.reference = undefined;
        }
    }
};
__decorate([
    (0, inversify_1.inject)(exports.PreferenceContext),
    __metadata("design:type", Object)
], PreferenceTransaction.prototype, "context", void 0);
__decorate([
    (0, inversify_1.inject)(exports.PreferenceTransactionPreludeProvider),
    __metadata("design:type", Function)
], PreferenceTransaction.prototype, "prelude", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_text_model_service_1.MonacoTextModelService),
    __metadata("design:type", monaco_text_model_service_1.MonacoTextModelService)
], PreferenceTransaction.prototype, "textModelService", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_jsonc_editor_1.MonacoJSONCEditor),
    __metadata("design:type", monaco_jsonc_editor_1.MonacoJSONCEditor)
], PreferenceTransaction.prototype, "jsoncEditor", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.MessageService),
    __metadata("design:type", core_1.MessageService)
], PreferenceTransaction.prototype, "messageService", void 0);
__decorate([
    (0, inversify_1.inject)(editor_manager_1.EditorManager),
    __metadata("design:type", editor_manager_1.EditorManager)
], PreferenceTransaction.prototype, "editorManager", void 0);
PreferenceTransaction = __decorate([
    (0, inversify_1.injectable)()
], PreferenceTransaction);
exports.PreferenceTransaction = PreferenceTransaction;
exports.PreferenceTransactionFactory = Symbol('PreferenceTransactionFactory');
const preferenceTransactionFactoryCreator = ({ container }) => (context, waitFor) => {
    const child = container.createChild();
    child.bind(exports.PreferenceContext).toConstantValue(context);
    child.bind(exports.PreferenceTransactionPreludeProvider).toConstantValue(() => waitFor);
    return child.get(PreferenceTransaction);
};
exports.preferenceTransactionFactoryCreator = preferenceTransactionFactoryCreator;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/preferences/lib/browser/preference-transaction-manager'] = this;


/***/ }),

/***/ "../../packages/preferences/lib/browser/section-preference-provider.js":
/*!*****************************************************************************!*\
  !*** ../../packages/preferences/lib/browser/section-preference-provider.js ***!
  \*****************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SectionPreferenceProvider = exports.SectionPreferenceProviderSection = exports.SectionPreferenceProviderUri = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const abstract_resource_preference_provider_1 = __webpack_require__(/*! ./abstract-resource-preference-provider */ "../../packages/preferences/lib/browser/abstract-resource-preference-provider.js");
const workspace_service_1 = __webpack_require__(/*! @theia/workspace/lib/browser/workspace-service */ "../../packages/workspace/lib/browser/workspace-service.js");
const preference_configurations_1 = __webpack_require__(/*! @theia/core/lib/browser/preferences/preference-configurations */ "../../packages/core/lib/browser/preferences/preference-configurations.js");
exports.SectionPreferenceProviderUri = Symbol('SectionPreferenceProviderUri');
exports.SectionPreferenceProviderSection = Symbol('SectionPreferenceProviderSection');
/**
 * This class encapsulates the logic of using separate files for some workspace configuration like 'launch.json' or 'tasks.json'.
 * Anything that is not a contributed section will be in the main config file.
 */
let SectionPreferenceProvider = class SectionPreferenceProvider extends abstract_resource_preference_provider_1.AbstractResourcePreferenceProvider {
    get isSection() {
        if (typeof this._isSection === 'undefined') {
            this._isSection = this.preferenceConfigurations.isSectionName(this.section);
        }
        return this._isSection;
    }
    getUri() {
        return this.uri;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parse(content) {
        const prefs = super.parse(content);
        if (this.isSection) {
            if (prefs === undefined) {
                return undefined;
            }
            const result = {};
            result[this.section] = { ...prefs };
            return result;
        }
        else {
            return prefs;
        }
    }
    getPath(preferenceName) {
        if (!this.isSection) {
            return super.getPath(preferenceName);
        }
        if (preferenceName === this.section) {
            return [];
        }
        if (preferenceName.startsWith(`${this.section}.`)) {
            return [preferenceName.slice(this.section.length + 1)];
        }
        return undefined;
    }
};
__decorate([
    (0, inversify_1.inject)(workspace_service_1.WorkspaceService),
    __metadata("design:type", workspace_service_1.WorkspaceService)
], SectionPreferenceProvider.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(exports.SectionPreferenceProviderUri),
    __metadata("design:type", uri_1.default)
], SectionPreferenceProvider.prototype, "uri", void 0);
__decorate([
    (0, inversify_1.inject)(exports.SectionPreferenceProviderSection),
    __metadata("design:type", String)
], SectionPreferenceProvider.prototype, "section", void 0);
__decorate([
    (0, inversify_1.inject)(preference_configurations_1.PreferenceConfigurations),
    __metadata("design:type", preference_configurations_1.PreferenceConfigurations)
], SectionPreferenceProvider.prototype, "preferenceConfigurations", void 0);
SectionPreferenceProvider = __decorate([
    (0, inversify_1.injectable)()
], SectionPreferenceProvider);
exports.SectionPreferenceProvider = SectionPreferenceProvider;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/preferences/lib/browser/section-preference-provider'] = this;


/***/ }),

/***/ "../../packages/preferences/lib/browser/user-configs-preference-provider.js":
/*!**********************************************************************************!*\
  !*** ../../packages/preferences/lib/browser/user-configs-preference-provider.js ***!
  \**********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserConfigsPreferenceProvider = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const preference_provider_1 = __webpack_require__(/*! @theia/core/lib/browser/preferences/preference-provider */ "../../packages/core/lib/browser/preferences/preference-provider.js");
const preference_configurations_1 = __webpack_require__(/*! @theia/core/lib/browser/preferences/preference-configurations */ "../../packages/core/lib/browser/preferences/preference-configurations.js");
const browser_1 = __webpack_require__(/*! @theia/userstorage/lib/browser */ "../../packages/userstorage/lib/browser/index.js");
const user_preference_provider_1 = __webpack_require__(/*! ./user-preference-provider */ "../../packages/preferences/lib/browser/user-preference-provider.js");
/**
 * Binds together preference section prefs providers for user-level preferences.
 */
let UserConfigsPreferenceProvider = class UserConfigsPreferenceProvider extends preference_provider_1.PreferenceProvider {
    constructor() {
        super(...arguments);
        this.providers = new Map();
    }
    init() {
        this.doInit();
    }
    async doInit() {
        this.createProviders();
        const readyPromises = [];
        for (const provider of this.providers.values()) {
            readyPromises.push(provider.ready.catch(e => console.error(e)));
        }
        Promise.all(readyPromises).then(() => this._ready.resolve());
    }
    createProviders() {
        for (const configName of [...this.configurations.getSectionNames(), this.configurations.getConfigName()]) {
            const sectionUri = browser_1.UserStorageUri.resolve(configName + '.json');
            const sectionKey = sectionUri.toString();
            if (!this.providers.has(sectionKey)) {
                const provider = this.createProvider(sectionUri, configName);
                this.providers.set(sectionKey, provider);
            }
        }
    }
    getConfigUri(resourceUri, sectionName = this.configurations.getConfigName()) {
        for (const provider of this.providers.values()) {
            const configUri = provider.getConfigUri(resourceUri);
            if (configUri && this.configurations.getName(configUri) === sectionName) {
                return configUri;
            }
        }
        return undefined;
    }
    resolve(preferenceName, resourceUri) {
        const result = {};
        for (const provider of this.providers.values()) {
            const { value, configUri } = provider.resolve(preferenceName, resourceUri);
            if (configUri && value !== undefined) {
                result.configUri = configUri;
                result.value = preference_provider_1.PreferenceProvider.merge(result.value, value);
            }
        }
        return result;
    }
    getPreferences(resourceUri) {
        let result = {};
        for (const provider of this.providers.values()) {
            const preferences = provider.getPreferences();
            result = preference_provider_1.PreferenceProvider.merge(result, preferences);
        }
        return result;
    }
    async setPreference(preferenceName, value, resourceUri) {
        const sectionName = preferenceName.split('.', 1)[0];
        const defaultConfigName = this.configurations.getConfigName();
        const configName = this.configurations.isSectionName(sectionName) ? sectionName : defaultConfigName;
        const setWithConfigName = async (name) => {
            for (const provider of this.providers.values()) {
                if (this.configurations.getName(provider.getConfigUri()) === name) {
                    if (await provider.setPreference(preferenceName, value, resourceUri)) {
                        return true;
                    }
                }
            }
            return false;
        };
        if (await setWithConfigName(configName)) { // Try in the section we believe it belongs in.
            return true;
        }
        else if (configName !== defaultConfigName) { // Fall back to `settings.json` if that fails.
            return setWithConfigName(defaultConfigName);
        }
        return false;
    }
    createProvider(uri, sectionName) {
        const provider = this.providerFactory(uri, sectionName);
        this.toDispose.push(provider);
        this.toDispose.push(provider.onDidPreferencesChanged(change => this.onDidPreferencesChangedEmitter.fire(change)));
        return provider;
    }
};
__decorate([
    (0, inversify_1.inject)(user_preference_provider_1.UserPreferenceProviderFactory),
    __metadata("design:type", Function)
], UserConfigsPreferenceProvider.prototype, "providerFactory", void 0);
__decorate([
    (0, inversify_1.inject)(preference_configurations_1.PreferenceConfigurations),
    __metadata("design:type", preference_configurations_1.PreferenceConfigurations)
], UserConfigsPreferenceProvider.prototype, "configurations", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserConfigsPreferenceProvider.prototype, "init", null);
UserConfigsPreferenceProvider = __decorate([
    (0, inversify_1.injectable)()
], UserConfigsPreferenceProvider);
exports.UserConfigsPreferenceProvider = UserConfigsPreferenceProvider;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/preferences/lib/browser/user-configs-preference-provider'] = this;


/***/ }),

/***/ "../../packages/preferences/lib/browser/user-preference-provider.js":
/*!**************************************************************************!*\
  !*** ../../packages/preferences/lib/browser/user-preference-provider.js ***!
  \**************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2018 Ericsson and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserPreferenceProvider = exports.UserPreferenceProviderFactory = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const section_preference_provider_1 = __webpack_require__(/*! ./section-preference-provider */ "../../packages/preferences/lib/browser/section-preference-provider.js");
exports.UserPreferenceProviderFactory = Symbol('UserPreferenceProviderFactory');
;
/**
 * A @SectionPreferenceProvider that targets the user-level settings
 */
let UserPreferenceProvider = class UserPreferenceProvider extends section_preference_provider_1.SectionPreferenceProvider {
    getScope() {
        return browser_1.PreferenceScope.User;
    }
};
UserPreferenceProvider = __decorate([
    (0, inversify_1.injectable)()
], UserPreferenceProvider);
exports.UserPreferenceProvider = UserPreferenceProvider;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/preferences/lib/browser/user-preference-provider'] = this;


/***/ }),

/***/ "../../packages/preferences/lib/browser/workspace-file-preference-provider.js":
/*!************************************************************************************!*\
  !*** ../../packages/preferences/lib/browser/workspace-file-preference-provider.js ***!
  \************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2019 TypeFox and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WorkspaceFilePreferenceProvider = exports.WorkspaceFilePreferenceProviderFactory = exports.WorkspaceFilePreferenceProviderOptions = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const preferences_1 = __webpack_require__(/*! @theia/core/lib/browser/preferences */ "../../packages/core/lib/browser/preferences/index.js");
const workspace_service_1 = __webpack_require__(/*! @theia/workspace/lib/browser/workspace-service */ "../../packages/workspace/lib/browser/workspace-service.js");
const abstract_resource_preference_provider_1 = __webpack_require__(/*! ./abstract-resource-preference-provider */ "../../packages/preferences/lib/browser/abstract-resource-preference-provider.js");
let WorkspaceFilePreferenceProviderOptions = class WorkspaceFilePreferenceProviderOptions {
};
WorkspaceFilePreferenceProviderOptions = __decorate([
    (0, inversify_1.injectable)()
], WorkspaceFilePreferenceProviderOptions);
exports.WorkspaceFilePreferenceProviderOptions = WorkspaceFilePreferenceProviderOptions;
exports.WorkspaceFilePreferenceProviderFactory = Symbol('WorkspaceFilePreferenceProviderFactory');
let WorkspaceFilePreferenceProvider = class WorkspaceFilePreferenceProvider extends abstract_resource_preference_provider_1.AbstractResourcePreferenceProvider {
    constructor() {
        super(...arguments);
        this.sectionsInsideSettings = new Set();
    }
    getUri() {
        return this.options.workspaceUri;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parse(content) {
        const data = super.parse(content);
        if (workspace_service_1.WorkspaceData.is(data)) {
            const settings = { ...data.settings };
            for (const key of this.configurations.getSectionNames().filter(name => name !== 'settings')) {
                // If the user has written configuration inside the "settings" object, we will respect that.
                if (settings[key]) {
                    this.sectionsInsideSettings.add(key);
                }
                // Favor sections outside the "settings" object to agree with VSCode behavior
                if (data[key]) {
                    settings[key] = data[key];
                    this.sectionsInsideSettings.delete(key);
                }
            }
            return settings;
        }
        return {};
    }
    getPath(preferenceName) {
        var _a;
        const firstSegment = preferenceName.split('.', 1)[0];
        const remainder = preferenceName.slice(firstSegment.length + 1);
        if (this.belongsInSection(firstSegment, remainder)) {
            // Default to writing sections outside the "settings" object.
            const path = [firstSegment];
            if (remainder) {
                path.push(remainder);
            }
            // If the user has already written this section inside the "settings" object, modify it there.
            if (this.sectionsInsideSettings.has(firstSegment)) {
                path.unshift('settings');
            }
            return path;
        }
        return ['settings'].concat((_a = super.getPath(preferenceName)) !== null && _a !== void 0 ? _a : []);
    }
    /**
     * @returns `true` if `firstSegment` is a section name (e.g. `tasks`, `launch`)
     */
    belongsInSection(firstSegment, remainder) {
        return this.configurations.isSectionName(firstSegment);
    }
    getScope() {
        return preferences_1.PreferenceScope.Workspace;
    }
    getDomain() {
        // workspace file is treated as part of the workspace
        return this.workspaceService.tryGetRoots().map(r => r.resource.toString()).concat([this.options.workspaceUri.toString()]);
    }
};
__decorate([
    (0, inversify_1.inject)(workspace_service_1.WorkspaceService),
    __metadata("design:type", workspace_service_1.WorkspaceService)
], WorkspaceFilePreferenceProvider.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(WorkspaceFilePreferenceProviderOptions),
    __metadata("design:type", WorkspaceFilePreferenceProviderOptions)
], WorkspaceFilePreferenceProvider.prototype, "options", void 0);
WorkspaceFilePreferenceProvider = __decorate([
    (0, inversify_1.injectable)()
], WorkspaceFilePreferenceProvider);
exports.WorkspaceFilePreferenceProvider = WorkspaceFilePreferenceProvider;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/preferences/lib/browser/workspace-file-preference-provider'] = this;


/***/ }),

/***/ "../../packages/preferences/lib/browser/workspace-preference-provider.js":
/*!*******************************************************************************!*\
  !*** ../../packages/preferences/lib/browser/workspace-preference-provider.js ***!
  \*******************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2018 Ericsson and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WorkspacePreferenceProvider = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
const preferences_1 = __webpack_require__(/*! @theia/core/lib/browser/preferences */ "../../packages/core/lib/browser/preferences/index.js");
const workspace_service_1 = __webpack_require__(/*! @theia/workspace/lib/browser/workspace-service */ "../../packages/workspace/lib/browser/workspace-service.js");
const workspace_file_preference_provider_1 = __webpack_require__(/*! ./workspace-file-preference-provider */ "../../packages/preferences/lib/browser/workspace-file-preference-provider.js");
let WorkspacePreferenceProvider = class WorkspacePreferenceProvider extends preferences_1.PreferenceProvider {
    constructor() {
        super(...arguments);
        this.toDisposeOnEnsureDelegateUpToDate = new disposable_1.DisposableCollection();
    }
    init() {
        this.workspaceService.ready.then(() => {
            // If there is no workspace after the workspace service is initialized, then no more work is needed for this provider to be ready.
            // If there is a workspace, then we wait for the new delegate to be ready before declaring this provider ready.
            if (!this.workspaceService.workspace) {
                this._ready.resolve();
            }
        });
        this.workspaceService.onWorkspaceLocationChanged(() => this.ensureDelegateUpToDate());
        this.workspaceService.onWorkspaceChanged(() => this.ensureDelegateUpToDate());
    }
    getConfigUri(resourceUri = this.ensureResourceUri(), sectionName) {
        var _a;
        return (_a = this.delegate) === null || _a === void 0 ? void 0 : _a.getConfigUri(resourceUri, sectionName);
    }
    getContainingConfigUri(resourceUri = this.ensureResourceUri(), sectionName) {
        var _a, _b;
        return (_b = (_a = this.delegate) === null || _a === void 0 ? void 0 : _a.getContainingConfigUri) === null || _b === void 0 ? void 0 : _b.call(_a, resourceUri, sectionName);
    }
    get delegate() {
        return this._delegate;
    }
    ensureDelegateUpToDate() {
        const delegate = this.createDelegate();
        if (this._delegate !== delegate) {
            this.toDisposeOnEnsureDelegateUpToDate.dispose();
            this.toDispose.push(this.toDisposeOnEnsureDelegateUpToDate);
            this._delegate = delegate;
            if (delegate) {
                // If this provider has not yet declared itself ready, it should do so when the new delegate is ready.
                delegate.ready.then(() => this._ready.resolve(), () => { });
            }
            if (delegate instanceof workspace_file_preference_provider_1.WorkspaceFilePreferenceProvider) {
                this.toDisposeOnEnsureDelegateUpToDate.pushAll([
                    delegate,
                    delegate.onDidPreferencesChanged(changes => this.onDidPreferencesChangedEmitter.fire(changes))
                ]);
            }
        }
    }
    createDelegate() {
        const workspace = this.workspaceService.workspace;
        if (!workspace) {
            return undefined;
        }
        if (!this.workspaceService.isMultiRootWorkspaceOpened) {
            return this.folderPreferenceProvider;
        }
        if (this._delegate instanceof workspace_file_preference_provider_1.WorkspaceFilePreferenceProvider && this._delegate.getConfigUri().isEqual(workspace.resource)) {
            return this._delegate;
        }
        return this.workspaceFileProviderFactory({
            workspaceUri: workspace.resource
        });
    }
    get(preferenceName, resourceUri = this.ensureResourceUri()) {
        const delegate = this.delegate;
        return delegate ? delegate.get(preferenceName, resourceUri) : undefined;
    }
    resolve(preferenceName, resourceUri = this.ensureResourceUri()) {
        const delegate = this.delegate;
        return delegate ? delegate.resolve(preferenceName, resourceUri) : {};
    }
    getPreferences(resourceUri = this.ensureResourceUri()) {
        const delegate = this.delegate;
        return delegate ? delegate.getPreferences(resourceUri) : {};
    }
    async setPreference(preferenceName, value, resourceUri = this.ensureResourceUri()) {
        const delegate = this.delegate;
        if (delegate) {
            return delegate.setPreference(preferenceName, value, resourceUri);
        }
        return false;
    }
    ensureResourceUri() {
        if (this.workspaceService.workspace && !this.workspaceService.isMultiRootWorkspaceOpened) {
            return this.workspaceService.workspace.resource.toString();
        }
        return undefined;
    }
};
__decorate([
    (0, inversify_1.inject)(workspace_service_1.WorkspaceService),
    __metadata("design:type", workspace_service_1.WorkspaceService)
], WorkspacePreferenceProvider.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(workspace_file_preference_provider_1.WorkspaceFilePreferenceProviderFactory),
    __metadata("design:type", Function)
], WorkspacePreferenceProvider.prototype, "workspaceFileProviderFactory", void 0);
__decorate([
    (0, inversify_1.inject)(preferences_1.PreferenceProvider),
    (0, inversify_1.named)(preferences_1.PreferenceScope.Folder),
    __metadata("design:type", preferences_1.PreferenceProvider)
], WorkspacePreferenceProvider.prototype, "folderPreferenceProvider", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WorkspacePreferenceProvider.prototype, "init", null);
WorkspacePreferenceProvider = __decorate([
    (0, inversify_1.injectable)()
], WorkspacePreferenceProvider);
exports.WorkspacePreferenceProvider = WorkspacePreferenceProvider;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/preferences/lib/browser/workspace-preference-provider'] = this;


/***/ })

}]);
//# sourceMappingURL=packages_core_shared_markdown-it_js-packages_preferences_lib_browser_preference-bindings_js.js.map