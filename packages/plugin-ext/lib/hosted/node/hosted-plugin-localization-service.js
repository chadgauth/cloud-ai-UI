"use strict";
// *****************************************************************************
// Copyright (C) 2021 TypeFox and others.
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
exports.HostedPluginLocalizationService = void 0;
const path = require("path");
const fs = require("@theia/core/shared/fs-extra");
const localization_provider_1 = require("@theia/core/lib/node/i18n/localization-provider");
const localization_1 = require("@theia/core/lib/common/i18n/localization");
const inversify_1 = require("@theia/core/shared/inversify");
const common_1 = require("../../common");
const env_variables_1 = require("@theia/core/lib/common/env-variables");
const core_1 = require("@theia/core");
const promise_util_1 = require("@theia/core/lib/common/promise-util");
const language_pack_service_1 = require("../../common/language-pack-service");
let HostedPluginLocalizationService = class HostedPluginLocalizationService {
    constructor() {
        this.localizationDisposeMap = new Map();
        this.translationConfigFiles = new Map();
        this._ready = new promise_util_1.Deferred();
        /**
         * This promise resolves when the cache has been cleaned up after starting the backend server.
         * Once resolved, the service allows to cache localization files for plugins.
         */
        this.ready = this._ready.promise;
    }
    initialize() {
        this.getLocalizationCacheDir()
            .then(cacheDir => fs.emptyDir(cacheDir))
            .then(() => this._ready.resolve());
    }
    async deployLocalizations(plugin) {
        var _a, _b;
        const disposable = new core_1.DisposableCollection();
        if ((_a = plugin.contributes) === null || _a === void 0 ? void 0 : _a.localizations) {
            // Indicator that this plugin is a vscode language pack
            // Language packs translate Theia and some builtin vscode extensions
            const localizations = buildLocalizations(plugin.contributes.localizations);
            disposable.push(core_1.Disposable.create(() => {
                this.localizationProvider.removeLocalizations(...localizations);
            }));
            this.localizationProvider.addLocalizations(...localizations);
        }
        if (plugin.metadata.model.l10n || ((_b = plugin.contributes) === null || _b === void 0 ? void 0 : _b.localizations)) {
            // Indicator that this plugin is a vscode language pack or has its own localization bundles
            // These bundles are purely used for translating plugins
            // The branch above builds localizations for Theia's own strings
            disposable.push(await this.updateLanguagePackBundles(plugin));
        }
        if (!disposable.disposed) {
            const versionedId = common_1.PluginIdentifiers.componentsToVersionedId(plugin.metadata.model);
            disposable.push(core_1.Disposable.create(() => {
                this.localizationDisposeMap.delete(versionedId);
            }));
            this.localizationDisposeMap.set(versionedId, disposable);
        }
    }
    undeployLocalizations(plugin) {
        var _a;
        (_a = this.localizationDisposeMap.get(plugin)) === null || _a === void 0 ? void 0 : _a.dispose();
    }
    async updateLanguagePackBundles(plugin) {
        var _a;
        const disposable = new core_1.DisposableCollection();
        const pluginId = plugin.metadata.model.id;
        const packageUri = new core_1.URI(plugin.metadata.model.packageUri);
        if ((_a = plugin.contributes) === null || _a === void 0 ? void 0 : _a.localizations) {
            for (const localization of plugin.contributes.localizations) {
                for (const translation of localization.translations) {
                    const l10n = getL10nTranslation(translation);
                    if (l10n) {
                        const translatedPluginId = translation.id;
                        const translationUri = packageUri.resolve(translation.path);
                        const locale = localization.languageId;
                        // We store a bundle for another extension in here
                        // Hence we use `translatedPluginId` instead of `pluginId`
                        this.languagePackService.storeBundle(translatedPluginId, locale, {
                            contents: processL10nBundle(l10n),
                            uri: translationUri.toString()
                        });
                        disposable.push(core_1.Disposable.create(() => {
                            // Only dispose the deleted locale for the specific plugin
                            this.languagePackService.deleteBundle(translatedPluginId, locale);
                        }));
                    }
                }
            }
        }
        // The `l10n` field of the plugin model points to a relative directory path within the plugin
        // It is supposed to contain localization bundles that contain translations of the plugin strings into different languages
        if (plugin.metadata.model.l10n) {
            const bundleDirectory = packageUri.resolve(plugin.metadata.model.l10n);
            const bundles = await loadPluginBundles(bundleDirectory);
            if (bundles) {
                for (const [locale, bundle] of Object.entries(bundles)) {
                    this.languagePackService.storeBundle(pluginId, locale, bundle);
                }
                disposable.push(core_1.Disposable.create(() => {
                    // Dispose all bundles contributed by the deleted plugin
                    this.languagePackService.deleteBundle(pluginId);
                }));
            }
        }
        return disposable;
    }
    /**
     * Performs localization of the plugin model. Translates entries such as command names, view names and other items.
     *
     * Translatable items are indicated with a `%id%` value.
     * The `id` is the translation key that gets replaced with the localized value for the currently selected language.
     *
     * Returns a copy of the plugin argument and does not modify the argument.
     * This is done to preserve the original `%id%` values for subsequent invocations of this method.
     */
    async localizePlugin(plugin) {
        const currentLanguage = this.localizationProvider.getCurrentLanguage();
        const localization = this.localizationProvider.loadLocalization(currentLanguage);
        const pluginPath = new core_1.URI(plugin.metadata.model.packageUri).path.fsPath();
        const pluginId = plugin.metadata.model.id;
        try {
            const translations = await loadPackageTranslations(pluginPath, currentLanguage);
            plugin = localizePackage(plugin, translations, (key, original) => {
                const fullKey = `${pluginId}/package/${key}`;
                return localization_1.Localization.localize(localization, fullKey, original);
            });
        }
        catch (err) {
            console.error(`Failed to localize plugin '${pluginId}'.`, err);
        }
        return plugin;
    }
    getNlsConfig() {
        const locale = this.localizationProvider.getCurrentLanguage();
        const configFile = this.translationConfigFiles.get(locale);
        if (locale === core_1.nls.defaultLocale || !configFile) {
            return { locale, availableLanguages: {} };
        }
        const cache = path.dirname(configFile);
        return {
            locale,
            availableLanguages: { '*': locale },
            _languagePackSupport: true,
            _cacheRoot: cache,
            _languagePackId: locale,
            _translationsConfigFile: configFile
        };
    }
    async buildTranslationConfig(plugins) {
        var _a;
        await this.ready;
        const cacheDir = await this.getLocalizationCacheDir();
        const configs = new Map();
        for (const plugin of plugins) {
            if ((_a = plugin.contributes) === null || _a === void 0 ? void 0 : _a.localizations) {
                const pluginPath = new core_1.URI(plugin.metadata.model.packageUri).path.fsPath();
                for (const localization of plugin.contributes.localizations) {
                    const config = configs.get(localization.languageId) || {};
                    for (const translation of localization.translations) {
                        const fullPath = path.join(pluginPath, translation.path);
                        config[translation.id] = fullPath;
                    }
                    configs.set(localization.languageId, config);
                }
            }
        }
        for (const [language, config] of configs.entries()) {
            const languageConfigDir = path.join(cacheDir, language);
            await fs.mkdirs(languageConfigDir);
            const configFile = path.join(languageConfigDir, `nls.config.${language}.json`);
            this.translationConfigFiles.set(language, configFile);
            await fs.writeJson(configFile, config);
        }
    }
    async getLocalizationCacheDir() {
        const configDir = new core_1.URI(await this.envVariables.getConfigDirUri()).path.fsPath();
        const cacheDir = path.join(configDir, 'localization-cache');
        return cacheDir;
    }
};
__decorate([
    (0, inversify_1.inject)(localization_provider_1.LocalizationProvider),
    __metadata("design:type", localization_provider_1.LocalizationProvider)
], HostedPluginLocalizationService.prototype, "localizationProvider", void 0);
__decorate([
    (0, inversify_1.inject)(language_pack_service_1.LanguagePackService),
    __metadata("design:type", Object)
], HostedPluginLocalizationService.prototype, "languagePackService", void 0);
__decorate([
    (0, inversify_1.inject)(env_variables_1.EnvVariablesServer),
    __metadata("design:type", Object)
], HostedPluginLocalizationService.prototype, "envVariables", void 0);
HostedPluginLocalizationService = __decorate([
    (0, inversify_1.injectable)()
], HostedPluginLocalizationService);
exports.HostedPluginLocalizationService = HostedPluginLocalizationService;
// New plugin localization logic using vscode.l10n
function getL10nTranslation(translation) {
    // 'bundle' is a special key that contains all translations for the l10n vscode API
    // If that doesn't exist, we can assume that the language pack is using the old vscode-nls API
    return translation.contents.bundle;
}
async function loadPluginBundles(l10nUri) {
    try {
        const directory = l10nUri.path.fsPath();
        const files = await fs.readdir(directory);
        const result = {};
        await Promise.all(files.map(async (fileName) => {
            const match = fileName.match(/^bundle\.l10n\.([\w\-]+)\.json$/);
            if (match) {
                const locale = match[1];
                const contents = await fs.readJSON(path.join(directory, fileName));
                result[locale] = {
                    contents,
                    uri: l10nUri.resolve(fileName).toString()
                };
            }
        }));
        return result;
    }
    catch (err) {
        // The directory either doesn't exist or its contents cannot be parsed
        console.error(`Failed to load plugin localization bundles from ${l10nUri}.`, err);
        // In any way we should just safely return undefined
        return undefined;
    }
}
function processL10nBundle(bundle) {
    const processedBundle = {};
    for (const [name, value] of Object.entries(bundle)) {
        const stringValue = typeof value === 'string' ? value : value.message;
        processedBundle[name] = stringValue;
    }
    return processedBundle;
}
// Old plugin localization logic for vscode-nls
// vscode-nls was used until version 1.73 of VSCode to translate extensions
function buildLocalizations(localizations) {
    const theiaLocalizations = [];
    for (const localization of localizations) {
        const theiaLocalization = {
            languageId: localization.languageId,
            languageName: localization.languageName,
            localizedLanguageName: localization.localizedLanguageName,
            languagePack: true,
            translations: {}
        };
        for (const translation of localization.translations) {
            for (const [scope, value] of Object.entries(translation.contents)) {
                for (const [key, item] of Object.entries(value)) {
                    const translationKey = buildTranslationKey(translation.id, scope, key);
                    theiaLocalization.translations[translationKey] = item;
                }
            }
        }
        theiaLocalizations.push(theiaLocalization);
    }
    return theiaLocalizations;
}
function buildTranslationKey(pluginId, scope, key) {
    return `${pluginId}/${localization_1.Localization.transformKey(scope)}/${key}`;
}
async function loadPackageTranslations(pluginPath, locale) {
    const localizedPluginPath = path.join(pluginPath, `package.nls.${locale}.json`);
    try {
        const defaultValue = coerceLocalizations(await fs.readJson(path.join(pluginPath, 'package.nls.json')));
        if (await fs.pathExists(localizedPluginPath)) {
            return {
                translation: coerceLocalizations(await fs.readJson(localizedPluginPath)),
                default: defaultValue
            };
        }
        return {
            default: defaultValue
        };
    }
    catch (e) {
        if (e.code !== 'ENOENT') {
            throw e;
        }
        return {};
    }
}
function isLocalizeInfo(obj) {
    return (0, core_1.isObject)(obj) && 'message' in obj || false;
}
function coerceLocalizations(translations) {
    for (const [key, value] of Object.entries(translations)) {
        if (isLocalizeInfo(value)) {
            translations[key] = value.message;
        }
        else if (typeof value !== 'string') {
            // Only strings or LocalizeInfo values are valid
            translations[key] = 'INVALID TRANSLATION VALUE';
        }
    }
    return translations;
}
const NLS_REGEX = /^%([\w\d.-]+)%$/i;
function localizePackage(value, translations, callback) {
    if (typeof value === 'string') {
        const match = NLS_REGEX.exec(value);
        let result = value;
        if (match) {
            const key = match[1];
            if (translations.translation) {
                result = translations.translation[key];
            }
            else if (translations.default) {
                result = callback(key, translations.default[key]);
            }
        }
        return result;
    }
    if (Array.isArray(value)) {
        const result = [];
        for (const item of value) {
            result.push(localizePackage(item, translations, callback));
        }
        return result;
    }
    if ((0, core_1.isObject)(value)) {
        const result = {};
        for (const [name, item] of Object.entries(value)) {
            result[name] = localizePackage(item, translations, callback);
        }
        return result;
    }
    return value;
}
//# sourceMappingURL=hosted-plugin-localization-service.js.map