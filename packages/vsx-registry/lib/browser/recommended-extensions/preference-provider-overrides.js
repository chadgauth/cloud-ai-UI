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
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindPreferenceProviderOverrides = exports.WorkspaceFilePreferenceProviderWithExtensions = exports.UserPreferenceProviderWithExtensions = exports.FolderPreferenceProviderWithExtensions = void 0;
const browser_1 = require("@theia/preferences/lib/browser");
const inversify_1 = require("@theia/core/shared/inversify");
const recommended_extensions_json_schema_1 = require("./recommended-extensions-json-schema");
const workspace_file_preference_provider_1 = require("@theia/preferences/lib/browser/workspace-file-preference-provider");
const preference_bindings_1 = require("@theia/preferences/lib/browser/preference-bindings");
const section_preference_provider_1 = require("@theia/preferences/lib/browser/section-preference-provider");
/**
 * The overrides in this file are required because the base preference providers assume that a
 * section name (extensions) will not be used as a prefix (extensions.ignoreRecommendations).
 */
let FolderPreferenceProviderWithExtensions = class FolderPreferenceProviderWithExtensions extends browser_1.FolderPreferenceProvider {
    getPath(preferenceName) {
        const path = super.getPath(preferenceName);
        if (this.section !== 'extensions' || !(path === null || path === void 0 ? void 0 : path.length)) {
            return path;
        }
        const isExtensionsField = path[0] in recommended_extensions_json_schema_1.extensionsConfigurationSchema.properties;
        if (isExtensionsField) {
            return path;
        }
        return undefined;
    }
};
FolderPreferenceProviderWithExtensions = __decorate([
    (0, inversify_1.injectable)()
], FolderPreferenceProviderWithExtensions);
exports.FolderPreferenceProviderWithExtensions = FolderPreferenceProviderWithExtensions;
let UserPreferenceProviderWithExtensions = class UserPreferenceProviderWithExtensions extends browser_1.UserPreferenceProvider {
    getPath(preferenceName) {
        const path = super.getPath(preferenceName);
        if (this.section !== 'extensions' || !(path === null || path === void 0 ? void 0 : path.length)) {
            return path;
        }
        const isExtensionsField = path[0] in recommended_extensions_json_schema_1.extensionsConfigurationSchema.properties;
        if (isExtensionsField) {
            return path;
        }
        return undefined;
    }
};
UserPreferenceProviderWithExtensions = __decorate([
    (0, inversify_1.injectable)()
], UserPreferenceProviderWithExtensions);
exports.UserPreferenceProviderWithExtensions = UserPreferenceProviderWithExtensions;
let WorkspaceFilePreferenceProviderWithExtensions = class WorkspaceFilePreferenceProviderWithExtensions extends workspace_file_preference_provider_1.WorkspaceFilePreferenceProvider {
    belongsInSection(firstSegment, remainder) {
        if (firstSegment === 'extensions') {
            return remainder in recommended_extensions_json_schema_1.extensionsConfigurationSchema.properties;
        }
        return this.configurations.isSectionName(firstSegment);
    }
};
WorkspaceFilePreferenceProviderWithExtensions = __decorate([
    (0, inversify_1.injectable)()
], WorkspaceFilePreferenceProviderWithExtensions);
exports.WorkspaceFilePreferenceProviderWithExtensions = WorkspaceFilePreferenceProviderWithExtensions;
function bindPreferenceProviderOverrides(bind, unbind) {
    unbind(browser_1.UserPreferenceProviderFactory);
    unbind(browser_1.FolderPreferenceProviderFactory);
    unbind(workspace_file_preference_provider_1.WorkspaceFilePreferenceProviderFactory);
    (0, preference_bindings_1.bindFactory)(bind, browser_1.UserPreferenceProviderFactory, UserPreferenceProviderWithExtensions, section_preference_provider_1.SectionPreferenceProviderUri, section_preference_provider_1.SectionPreferenceProviderSection);
    (0, preference_bindings_1.bindFactory)(bind, browser_1.FolderPreferenceProviderFactory, FolderPreferenceProviderWithExtensions, section_preference_provider_1.SectionPreferenceProviderUri, section_preference_provider_1.SectionPreferenceProviderSection, browser_1.FolderPreferenceProviderFolder);
    bind(workspace_file_preference_provider_1.WorkspaceFilePreferenceProviderFactory).toFactory(ctx => (options) => {
        const child = new inversify_1.Container({ defaultScope: 'Singleton' });
        child.parent = ctx.container;
        child.bind(workspace_file_preference_provider_1.WorkspaceFilePreferenceProvider).to(WorkspaceFilePreferenceProviderWithExtensions);
        child.bind(workspace_file_preference_provider_1.WorkspaceFilePreferenceProviderOptions).toConstantValue(options);
        return child.get(workspace_file_preference_provider_1.WorkspaceFilePreferenceProvider);
    });
}
exports.bindPreferenceProviderOverrides = bindPreferenceProviderOverrides;
//# sourceMappingURL=preference-provider-overrides.js.map