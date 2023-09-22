"use strict";
// *****************************************************************************
// Copyright (C) 2018 TypeFox and others.
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
exports.PreferencesJsonSchemaContribution = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const uri_1 = require("@theia/core/lib/common/uri");
const core_1 = require("@theia/core");
const preference_contribution_1 = require("@theia/core/lib/browser/preferences/preference-contribution");
const preference_configurations_1 = require("@theia/core/lib/browser/preferences/preference-configurations");
const browser_1 = require("@theia/core/lib/browser");
const browser_2 = require("@theia/workspace/lib/browser");
const PREFERENCE_URI_PREFIX = 'vscode://schemas/settings/';
const USER_STORAGE_PREFIX = 'user-storage:/';
let PreferencesJsonSchemaContribution = class PreferencesJsonSchemaContribution {
    constructor() {
        this.serializeSchema = (scope) => JSON.stringify(this.schemaProvider.getSchema(scope));
    }
    registerSchemas(context) {
        this.registerSchema(browser_1.PreferenceScope.Default, context);
        this.registerSchema(browser_1.PreferenceScope.User, context);
        this.registerSchema(browser_1.PreferenceScope.Workspace, context);
        this.registerSchema(browser_1.PreferenceScope.Folder, context);
        this.workspaceService.updateSchema('settings', { $ref: this.getSchemaURIForScope(browser_1.PreferenceScope.Workspace).toString() });
        this.schemaProvider.onDidPreferenceSchemaChanged(() => this.updateInMemoryResources());
    }
    registerSchema(scope, context) {
        const scopeStr = browser_1.PreferenceScope[scope].toLowerCase();
        const uri = new uri_1.default(PREFERENCE_URI_PREFIX + scopeStr);
        this.inmemoryResources.add(uri, this.serializeSchema(scope));
        context.registerSchema({
            fileMatch: this.getFileMatch(scopeStr),
            url: uri.toString()
        });
    }
    updateInMemoryResources() {
        this.inmemoryResources.update(this.getSchemaURIForScope(browser_1.PreferenceScope.Default), this.serializeSchema(+browser_1.PreferenceScope.Default));
        this.inmemoryResources.update(this.getSchemaURIForScope(browser_1.PreferenceScope.User), this.serializeSchema(+browser_1.PreferenceScope.User));
        this.inmemoryResources.update(this.getSchemaURIForScope(browser_1.PreferenceScope.Workspace), this.serializeSchema(+browser_1.PreferenceScope.Workspace));
        this.inmemoryResources.update(this.getSchemaURIForScope(browser_1.PreferenceScope.Folder), this.serializeSchema(+browser_1.PreferenceScope.Folder));
    }
    getSchemaURIForScope(scope) {
        return new uri_1.default(PREFERENCE_URI_PREFIX + browser_1.PreferenceScope[scope].toLowerCase());
    }
    getFileMatch(scope) {
        const baseName = this.preferenceConfigurations.getConfigName() + '.json';
        return [baseName, new uri_1.default(USER_STORAGE_PREFIX + scope).resolve(baseName).toString()];
    }
};
__decorate([
    (0, inversify_1.inject)(preference_contribution_1.PreferenceSchemaProvider),
    __metadata("design:type", preference_contribution_1.PreferenceSchemaProvider)
], PreferencesJsonSchemaContribution.prototype, "schemaProvider", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.InMemoryResources),
    __metadata("design:type", core_1.InMemoryResources)
], PreferencesJsonSchemaContribution.prototype, "inmemoryResources", void 0);
__decorate([
    (0, inversify_1.inject)(preference_configurations_1.PreferenceConfigurations),
    __metadata("design:type", preference_configurations_1.PreferenceConfigurations)
], PreferencesJsonSchemaContribution.prototype, "preferenceConfigurations", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.WorkspaceService),
    __metadata("design:type", browser_2.WorkspaceService)
], PreferencesJsonSchemaContribution.prototype, "workspaceService", void 0);
PreferencesJsonSchemaContribution = __decorate([
    (0, inversify_1.injectable)()
], PreferencesJsonSchemaContribution);
exports.PreferencesJsonSchemaContribution = PreferencesJsonSchemaContribution;
//# sourceMappingURL=preferences-json-schema-contribution.js.map