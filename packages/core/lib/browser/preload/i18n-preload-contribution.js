"use strict";
// *****************************************************************************
// Copyright (C) 2023 TypeFox and others.
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
exports.I18nPreloadContribution = void 0;
const frontend_application_config_provider_1 = require("../frontend-application-config-provider");
const nls_1 = require("../../common/nls");
const inversify_1 = require("inversify");
const localization_server_1 = require("../../common/i18n/localization-server");
let I18nPreloadContribution = class I18nPreloadContribution {
    async initialize() {
        const defaultLocale = frontend_application_config_provider_1.FrontendApplicationConfigProvider.get().defaultLocale;
        if (defaultLocale && !nls_1.nls.locale) {
            Object.assign(nls_1.nls, {
                locale: defaultLocale
            });
        }
        if (nls_1.nls.locale) {
            const localization = await this.localizationServer.loadLocalization(nls_1.nls.locale);
            if (localization.languagePack) {
                nls_1.nls.localization = localization;
            }
            else {
                // In case the localization that we've loaded doesn't localize Theia completely (languagePack is false)
                // We simply reset the locale to the default again
                Object.assign(nls_1.nls, {
                    locale: defaultLocale || undefined
                });
            }
        }
    }
};
__decorate([
    (0, inversify_1.inject)(localization_server_1.LocalizationServer),
    __metadata("design:type", Object)
], I18nPreloadContribution.prototype, "localizationServer", void 0);
I18nPreloadContribution = __decorate([
    (0, inversify_1.injectable)()
], I18nPreloadContribution);
exports.I18nPreloadContribution = I18nPreloadContribution;
//# sourceMappingURL=i18n-preload-contribution.js.map