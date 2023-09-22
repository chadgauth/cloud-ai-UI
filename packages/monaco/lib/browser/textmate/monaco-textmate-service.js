"use strict";
// *****************************************************************************
// Copyright (C) 2018 Redhat, Ericsson and others.
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
exports.MonacoTextmateService = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const core_1 = require("@theia/core");
const browser_1 = require("@theia/core/lib/browser");
const theming_1 = require("@theia/core/lib/browser/theming");
const textmate_contribution_1 = require("./textmate-contribution");
const textmate_tokenizer_1 = require("./textmate-tokenizer");
const textmate_registry_1 = require("./textmate-registry");
const monaco_theme_registry_1 = require("./monaco-theme-registry");
const editor_preferences_1 = require("@theia/editor/lib/browser/editor-preferences");
const monaco = require("@theia/monaco-editor-core");
const languages_1 = require("@theia/monaco-editor-core/esm/vs/editor/common/languages");
const standaloneTheme_1 = require("@theia/monaco-editor-core/esm/vs/editor/standalone/common/standaloneTheme");
const standaloneServices_1 = require("@theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices");
const language_1 = require("@theia/monaco-editor-core/esm/vs/editor/common/languages/language");
const standaloneLanguages_1 = require("@theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneLanguages");
const monaco_theme_types_1 = require("./monaco-theme-types");
let MonacoTextmateService = class MonacoTextmateService {
    constructor() {
        this.tokenizerOption = {
            lineLimit: 400
        };
        this._activatedLanguages = new Set();
        this.toDisposeOnUpdateTheme = new core_1.DisposableCollection();
    }
    initialize() {
        if (!browser_1.isBasicWasmSupported) {
            console.log('Textmate support deactivated because WebAssembly is not detected.');
            return;
        }
        for (const grammarProvider of this.grammarProviders.getContributions()) {
            try {
                grammarProvider.registerTextmateLanguage(this.textmateRegistry);
            }
            catch (err) {
                console.error(err);
            }
        }
        this.grammarRegistry = this.registryFactory(this.monacoThemeRegistry.getThemeData(this.currentEditorTheme));
        this.tokenizerOption.lineLimit = this.preferences['editor.maxTokenizationLineLength'];
        this.preferences.onPreferenceChanged(e => {
            if (e.preferenceName === 'editor.maxTokenizationLineLength') {
                this.tokenizerOption.lineLimit = e.newValue;
            }
        });
        this.updateTheme();
        this.themeService.onDidColorThemeChange(() => this.updateTheme());
        for (const id of this.textmateRegistry.languages) {
            this.activateLanguage(id);
        }
    }
    updateTheme() {
        this.toDisposeOnUpdateTheme.dispose();
        const currentEditorTheme = this.currentEditorTheme;
        document.body.classList.add(currentEditorTheme);
        this.toDisposeOnUpdateTheme.push(core_1.Disposable.create(() => document.body.classList.remove(currentEditorTheme)));
        // first update registry to run tokenization with the proper theme
        const theme = this.monacoThemeRegistry.getThemeData(currentEditorTheme);
        if (theme) {
            this.grammarRegistry.setTheme(theme);
        }
        // then trigger tokenization by setting monaco theme
        monaco.editor.setTheme(currentEditorTheme);
    }
    get currentEditorTheme() {
        return this.themeService.getCurrentTheme().editorTheme || monaco_theme_registry_1.MonacoThemeRegistry.DARK_DEFAULT_THEME;
    }
    activateLanguage(language) {
        const toDispose = new core_1.DisposableCollection(core_1.Disposable.create(() => { }));
        toDispose.push(this.waitForLanguage(language, () => this.doActivateLanguage(language, toDispose)));
        return toDispose;
    }
    async doActivateLanguage(languageId, toDispose) {
        if (this._activatedLanguages.has(languageId)) {
            return;
        }
        this._activatedLanguages.add(languageId);
        toDispose.push(core_1.Disposable.create(() => this._activatedLanguages.delete(languageId)));
        const scopeName = this.textmateRegistry.getScope(languageId);
        if (!scopeName) {
            return;
        }
        const provider = this.textmateRegistry.getProvider(scopeName);
        if (!provider) {
            return;
        }
        const configuration = this.textmateRegistry.getGrammarConfiguration(languageId);
        const initialLanguage = (0, textmate_contribution_1.getEncodedLanguageId)(languageId);
        await this.onigasmProvider();
        if (toDispose.disposed) {
            return;
        }
        try {
            const grammar = await this.grammarRegistry.loadGrammarWithConfiguration(scopeName, initialLanguage, configuration);
            if (toDispose.disposed) {
                return;
            }
            if (!grammar) {
                throw new Error(`no grammar for ${scopeName}, ${initialLanguage}, ${JSON.stringify(configuration)}`);
            }
            const options = configuration.tokenizerOption ? configuration.tokenizerOption : this.tokenizerOption;
            const tokenizer = (0, textmate_tokenizer_1.createTextmateTokenizer)(grammar, options);
            toDispose.push(monaco.languages.setTokensProvider(languageId, tokenizer));
            const support = languages_1.TokenizationRegistry.get(languageId);
            const themeService = standaloneServices_1.StandaloneServices.get(standaloneTheme_1.IStandaloneThemeService);
            const languageService = standaloneServices_1.StandaloneServices.get(language_1.ILanguageService);
            const adapter = new standaloneLanguages_1.TokenizationSupportAdapter(languageId, tokenizer, languageService, themeService);
            support.tokenize = adapter.tokenize.bind(adapter);
        }
        catch (error) {
            this.logger.warn('No grammar for this language id', languageId, error);
        }
    }
    waitForLanguage(language, cb) {
        const languageService = standaloneServices_1.StandaloneServices.get(language_1.ILanguageService);
        if (languageService['_encounteredLanguages'].has(language)) {
            cb();
            return core_1.Disposable.NULL;
        }
        return monaco.languages.onLanguage(language, cb);
    }
};
__decorate([
    (0, inversify_1.inject)(core_1.ContributionProvider),
    (0, inversify_1.named)(textmate_contribution_1.LanguageGrammarDefinitionContribution),
    __metadata("design:type", Object)
], MonacoTextmateService.prototype, "grammarProviders", void 0);
__decorate([
    (0, inversify_1.inject)(textmate_registry_1.TextmateRegistry),
    __metadata("design:type", textmate_registry_1.TextmateRegistry)
], MonacoTextmateService.prototype, "textmateRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.ILogger),
    __metadata("design:type", Object)
], MonacoTextmateService.prototype, "logger", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_theme_types_1.OnigasmProvider),
    __metadata("design:type", Function)
], MonacoTextmateService.prototype, "onigasmProvider", void 0);
__decorate([
    (0, inversify_1.inject)(theming_1.ThemeService),
    __metadata("design:type", theming_1.ThemeService)
], MonacoTextmateService.prototype, "themeService", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_theme_registry_1.MonacoThemeRegistry),
    __metadata("design:type", monaco_theme_registry_1.MonacoThemeRegistry)
], MonacoTextmateService.prototype, "monacoThemeRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(editor_preferences_1.EditorPreferences),
    __metadata("design:type", Object)
], MonacoTextmateService.prototype, "preferences", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_theme_types_1.TextmateRegistryFactory),
    __metadata("design:type", Function)
], MonacoTextmateService.prototype, "registryFactory", void 0);
MonacoTextmateService = __decorate([
    (0, inversify_1.injectable)()
], MonacoTextmateService);
exports.MonacoTextmateService = MonacoTextmateService;
//# sourceMappingURL=monaco-textmate-service.js.map