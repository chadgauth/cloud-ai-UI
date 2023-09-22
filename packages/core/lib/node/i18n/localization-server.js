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
exports.LocalizationServerImpl = void 0;
const inversify_1 = require("inversify");
const nls_1 = require("../../common/nls");
const promise_util_1 = require("../../common/promise-util");
const localization_contribution_1 = require("./localization-contribution");
const localization_provider_1 = require("./localization-provider");
let LocalizationServerImpl = class LocalizationServerImpl {
    constructor() {
        this.initialized = new promise_util_1.Deferred();
    }
    async initialize() {
        await this.localizationRegistry.initialize();
        this.initialized.resolve();
    }
    waitForInitialization() {
        return this.initialized.promise;
    }
    async loadLocalization(languageId) {
        await this.waitForInitialization();
        languageId = this.localizationProvider.getAvailableLanguages().some(e => e.languageId === languageId) ? languageId : nls_1.nls.defaultLocale;
        this.localizationProvider.setCurrentLanguage(languageId);
        return this.localizationProvider.loadLocalization(languageId);
    }
};
__decorate([
    (0, inversify_1.inject)(localization_contribution_1.LocalizationRegistry),
    __metadata("design:type", localization_contribution_1.LocalizationRegistry)
], LocalizationServerImpl.prototype, "localizationRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(localization_provider_1.LocalizationProvider),
    __metadata("design:type", localization_provider_1.LocalizationProvider)
], LocalizationServerImpl.prototype, "localizationProvider", void 0);
LocalizationServerImpl = __decorate([
    (0, inversify_1.injectable)()
], LocalizationServerImpl);
exports.LocalizationServerImpl = LocalizationServerImpl;
//# sourceMappingURL=localization-server.js.map