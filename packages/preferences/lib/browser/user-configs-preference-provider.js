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
exports.UserConfigsPreferenceProvider = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const inversify_1 = require("@theia/core/shared/inversify");
const preference_provider_1 = require("@theia/core/lib/browser/preferences/preference-provider");
const preference_configurations_1 = require("@theia/core/lib/browser/preferences/preference-configurations");
const browser_1 = require("@theia/userstorage/lib/browser");
const user_preference_provider_1 = require("./user-preference-provider");
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
//# sourceMappingURL=user-configs-preference-provider.js.map