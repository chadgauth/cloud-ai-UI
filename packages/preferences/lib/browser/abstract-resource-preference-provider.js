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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractResourcePreferenceProvider = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-null/no-null */
const jsoncparser = require("jsonc-parser");
const inversify_1 = require("@theia/core/shared/inversify");
const disposable_1 = require("@theia/core/lib/common/disposable");
const browser_1 = require("@theia/core/lib/browser");
const uri_1 = require("@theia/core/lib/common/uri");
const preference_configurations_1 = require("@theia/core/lib/browser/preferences/preference-configurations");
const promise_util_1 = require("@theia/core/lib/common/promise-util");
const file_service_1 = require("@theia/filesystem/lib/browser/file-service");
const preference_transaction_manager_1 = require("./preference-transaction-manager");
const core_1 = require("@theia/core");
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
//# sourceMappingURL=abstract-resource-preference-provider.js.map