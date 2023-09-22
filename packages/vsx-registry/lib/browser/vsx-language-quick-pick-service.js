"use strict";
// *****************************************************************************
// Copyright (C) 2022 TypeFox and others.
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
exports.VSXLanguageQuickPickService = void 0;
const language_quick_pick_service_1 = require("@theia/core/lib/browser/i18n/language-quick-pick-service");
const request_1 = require("@theia/core/shared/@theia/request");
const inversify_1 = require("@theia/core/shared/inversify");
const plugin_ext_1 = require("@theia/plugin-ext");
const ovsx_client_provider_1 = require("../common/ovsx-client-provider");
const plugin_vscode_uri_1 = require("@theia/plugin-ext-vscode/lib/common/plugin-vscode-uri");
let VSXLanguageQuickPickService = class VSXLanguageQuickPickService extends language_quick_pick_service_1.LanguageQuickPickService {
    async getAvailableLanguages() {
        const client = await this.clientProvider();
        const searchResult = await client.search({
            category: 'Language Packs',
            sortBy: 'downloadCount',
            sortOrder: 'desc',
            size: 20
        });
        if (searchResult.error) {
            throw new Error('Error while loading available languages: ' + searchResult.error);
        }
        const extensionLanguages = await Promise.all(searchResult.extensions.map(async (extension) => ({
            extension,
            languages: await this.loadExtensionLanguages(extension)
        })));
        const languages = new Map();
        for (const extension of extensionLanguages) {
            for (const localizationContribution of extension.languages) {
                if (!languages.has(localizationContribution.languageId)) {
                    languages.set(localizationContribution.languageId, {
                        ...this.createLanguageQuickPickItem(localizationContribution),
                        execute: async () => {
                            const extensionUri = plugin_vscode_uri_1.VSCodeExtensionUri.toUri(extension.extension.name, extension.extension.namespace).toString();
                            await this.pluginServer.deploy(extensionUri);
                        }
                    });
                }
            }
        }
        return Array.from(languages.values());
    }
    async loadExtensionLanguages(extension) {
        var _a, _b;
        // When searching for extensions on ovsx, we don't receive the `manifest` property.
        // This property is only set when querying a specific extension.
        // To improve performance, we assume that a manifest exists at `/package.json`.
        const downloadUrl = extension.files.download;
        const parentUrl = downloadUrl.substring(0, downloadUrl.lastIndexOf('/'));
        const manifestUrl = parentUrl + '/package.json';
        try {
            const manifestRequest = await this.requestService.request({ url: manifestUrl });
            const manifestContent = request_1.RequestContext.asJson(manifestRequest);
            const localizations = (_b = (_a = manifestContent.contributes) === null || _a === void 0 ? void 0 : _a.localizations) !== null && _b !== void 0 ? _b : [];
            return localizations.map(e => ({
                languageId: e.languageId,
                languageName: e.languageName,
                localizedLanguageName: e.localizedLanguageName,
                languagePack: true
            }));
        }
        catch {
            // The `package.json` file might not actually exist, simply return an empty array
            return [];
        }
    }
};
__decorate([
    (0, inversify_1.inject)(ovsx_client_provider_1.OVSXClientProvider),
    __metadata("design:type", Function)
], VSXLanguageQuickPickService.prototype, "clientProvider", void 0);
__decorate([
    (0, inversify_1.inject)(request_1.RequestService),
    __metadata("design:type", Object)
], VSXLanguageQuickPickService.prototype, "requestService", void 0);
__decorate([
    (0, inversify_1.inject)(plugin_ext_1.PluginServer),
    __metadata("design:type", Object)
], VSXLanguageQuickPickService.prototype, "pluginServer", void 0);
VSXLanguageQuickPickService = __decorate([
    (0, inversify_1.injectable)()
], VSXLanguageQuickPickService);
exports.VSXLanguageQuickPickService = VSXLanguageQuickPickService;
//# sourceMappingURL=vsx-language-quick-pick-service.js.map