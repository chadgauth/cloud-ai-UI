"use strict";
(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_vsx-registry_lib_browser_vsx-registry-frontend-module_js"],{

/***/ "../../packages/preferences/lib/browser/index.js":
/*!*******************************************************!*\
  !*** ../../packages/preferences/lib/browser/index.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! @theia/core/lib/browser/preferences */ "../../packages/core/lib/browser/preferences/index.js"), exports);
__exportStar(__webpack_require__(/*! ./abstract-resource-preference-provider */ "../../packages/preferences/lib/browser/abstract-resource-preference-provider.js"), exports);
__exportStar(__webpack_require__(/*! ./user-preference-provider */ "../../packages/preferences/lib/browser/user-preference-provider.js"), exports);
__exportStar(__webpack_require__(/*! ./workspace-preference-provider */ "../../packages/preferences/lib/browser/workspace-preference-provider.js"), exports);
__exportStar(__webpack_require__(/*! ./folders-preferences-provider */ "../../packages/preferences/lib/browser/folders-preferences-provider.js"), exports);
__exportStar(__webpack_require__(/*! ./folder-preference-provider */ "../../packages/preferences/lib/browser/folder-preference-provider.js"), exports);
__exportStar(__webpack_require__(/*! ./user-configs-preference-provider */ "../../packages/preferences/lib/browser/user-configs-preference-provider.js"), exports);

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/preferences/lib/browser'] = this;


/***/ }),

/***/ "../../packages/vsx-registry/lib/browser/recommended-extensions/preference-provider-overrides.js":
/*!*******************************************************************************************************!*\
  !*** ../../packages/vsx-registry/lib/browser/recommended-extensions/preference-provider-overrides.js ***!
  \*******************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.bindPreferenceProviderOverrides = exports.WorkspaceFilePreferenceProviderWithExtensions = exports.UserPreferenceProviderWithExtensions = exports.FolderPreferenceProviderWithExtensions = void 0;
const browser_1 = __webpack_require__(/*! @theia/preferences/lib/browser */ "../../packages/preferences/lib/browser/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const recommended_extensions_json_schema_1 = __webpack_require__(/*! ./recommended-extensions-json-schema */ "../../packages/vsx-registry/lib/browser/recommended-extensions/recommended-extensions-json-schema.js");
const workspace_file_preference_provider_1 = __webpack_require__(/*! @theia/preferences/lib/browser/workspace-file-preference-provider */ "../../packages/preferences/lib/browser/workspace-file-preference-provider.js");
const preference_bindings_1 = __webpack_require__(/*! @theia/preferences/lib/browser/preference-bindings */ "../../packages/preferences/lib/browser/preference-bindings.js");
const section_preference_provider_1 = __webpack_require__(/*! @theia/preferences/lib/browser/section-preference-provider */ "../../packages/preferences/lib/browser/section-preference-provider.js");
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

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/vsx-registry/lib/browser/recommended-extensions/preference-provider-overrides'] = this;


/***/ }),

/***/ "../../packages/vsx-registry/lib/browser/recommended-extensions/recommended-extensions-json-schema.js":
/*!************************************************************************************************************!*\
  !*** ../../packages/vsx-registry/lib/browser/recommended-extensions/recommended-extensions-json-schema.js ***!
  \************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
exports.ExtensionSchemaContribution = exports.extensionsConfigurationSchema = exports.extensionsSchemaID = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const browser_1 = __webpack_require__(/*! @theia/workspace/lib/browser */ "../../packages/workspace/lib/browser/index.js");
exports.extensionsSchemaID = 'vscode://schemas/extensions';
exports.extensionsConfigurationSchema = {
    $id: exports.extensionsSchemaID,
    default: { recommendations: [] },
    type: 'object',
    properties: {
        recommendations: {
            title: 'A list of extensions recommended for users of this workspace. Should use the form "<publisher>.<extension name>"',
            type: 'array',
            items: {
                type: 'string',
                pattern: '^\\w[\\w-]+\\.\\w[\\w-]+$',
                patternErrorMessage: "Expected format '${publisher}.${name}'. Example: 'eclipse.theia'."
            },
            default: [],
        },
        unwantedRecommendations: {
            title: 'A list of extensions recommended by default that should not be recommended to users of this workspace. Should use the form "<publisher>.<extension name>"',
            type: 'array',
            items: {
                type: 'string',
                pattern: '^\\w[\\w-]+\\.\\w[\\w-]+$',
                patternErrorMessage: "Expected format '${publisher}.${name}'. Example: 'eclipse.theia'."
            },
            default: [],
        }
    },
    allowComments: true,
    allowTrailingCommas: true,
};
let ExtensionSchemaContribution = class ExtensionSchemaContribution {
    constructor() {
        this.uri = new uri_1.default(exports.extensionsSchemaID);
    }
    init() {
        this.inmemoryResources.add(this.uri, JSON.stringify(exports.extensionsConfigurationSchema));
    }
    registerSchemas(context) {
        context.registerSchema({
            fileMatch: ['extensions.json'],
            url: this.uri.toString(),
        });
        this.workspaceService.updateSchema('extensions', { $ref: this.uri.toString() });
    }
};
__decorate([
    (0, inversify_1.inject)(core_1.InMemoryResources),
    __metadata("design:type", core_1.InMemoryResources)
], ExtensionSchemaContribution.prototype, "inmemoryResources", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.WorkspaceService),
    __metadata("design:type", browser_1.WorkspaceService)
], ExtensionSchemaContribution.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ExtensionSchemaContribution.prototype, "init", null);
ExtensionSchemaContribution = __decorate([
    (0, inversify_1.injectable)()
], ExtensionSchemaContribution);
exports.ExtensionSchemaContribution = ExtensionSchemaContribution;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/vsx-registry/lib/browser/recommended-extensions/recommended-extensions-json-schema'] = this;


/***/ }),

/***/ "../../packages/vsx-registry/lib/browser/recommended-extensions/recommended-extensions-preference-contribution.js":
/*!************************************************************************************************************************!*\
  !*** ../../packages/vsx-registry/lib/browser/recommended-extensions/recommended-extensions-preference-contribution.js ***!
  \************************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.bindExtensionPreferences = exports.ExtensionNotificationPreferences = exports.recommendedExtensionNotificationPreferencesSchema = exports.IGNORE_RECOMMENDATIONS_ID = exports.recommendedExtensionsPreferencesSchema = void 0;
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const json_schema_store_1 = __webpack_require__(/*! @theia/core/lib/browser/json-schema-store */ "../../packages/core/lib/browser/json-schema-store.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
const preference_configurations_1 = __webpack_require__(/*! @theia/core/lib/browser/preferences/preference-configurations */ "../../packages/core/lib/browser/preferences/preference-configurations.js");
const recommended_extensions_json_schema_1 = __webpack_require__(/*! ./recommended-extensions-json-schema */ "../../packages/vsx-registry/lib/browser/recommended-extensions/recommended-extensions-json-schema.js");
exports.recommendedExtensionsPreferencesSchema = {
    type: 'object',
    scope: browser_1.PreferenceScope.Folder,
    properties: {
        extensions: {
            $ref: recommended_extensions_json_schema_1.extensionsSchemaID,
            description: nls_1.nls.localize('theia/vsx-registry/recommendedExtensions', 'A list of the names of extensions recommended for use in this workspace.'),
            defaultValue: { recommendations: [] },
        },
    },
};
exports.IGNORE_RECOMMENDATIONS_ID = 'extensions.ignoreRecommendations';
exports.recommendedExtensionNotificationPreferencesSchema = {
    type: 'object',
    scope: browser_1.PreferenceScope.Folder,
    properties: {
        [exports.IGNORE_RECOMMENDATIONS_ID]: {
            description: nls_1.nls.localize('theia/vsx-registry/showRecommendedExtensions', 'Controls whether notifications are shown for extension recommendations.'),
            default: false,
            type: 'boolean'
        }
    }
};
exports.ExtensionNotificationPreferences = Symbol('ExtensionNotificationPreferences');
function bindExtensionPreferences(bind) {
    bind(recommended_extensions_json_schema_1.ExtensionSchemaContribution).toSelf().inSingletonScope();
    bind(json_schema_store_1.JsonSchemaContribution).toService(recommended_extensions_json_schema_1.ExtensionSchemaContribution);
    bind(browser_1.PreferenceContribution).toConstantValue({ schema: exports.recommendedExtensionsPreferencesSchema });
    bind(preference_configurations_1.PreferenceConfiguration).toConstantValue({ name: 'extensions' });
    bind(exports.ExtensionNotificationPreferences).toDynamicValue(({ container }) => {
        const preferenceService = container.get(browser_1.PreferenceService);
        return (0, browser_1.createPreferenceProxy)(preferenceService, exports.recommendedExtensionNotificationPreferencesSchema);
    }).inSingletonScope();
    bind(browser_1.PreferenceContribution).toConstantValue({ schema: exports.recommendedExtensionNotificationPreferencesSchema });
}
exports.bindExtensionPreferences = bindExtensionPreferences;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/vsx-registry/lib/browser/recommended-extensions/recommended-extensions-preference-contribution'] = this;


/***/ }),

/***/ "../../packages/vsx-registry/lib/browser/vsx-extension-commands.js":
/*!*************************************************************************!*\
  !*** ../../packages/vsx-registry/lib/browser/vsx-extension-commands.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VSXExtensionsCommands = void 0;
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
var VSXExtensionsCommands;
(function (VSXExtensionsCommands) {
    const EXTENSIONS_CATEGORY = 'Extensions';
    VSXExtensionsCommands.CLEAR_ALL = common_1.Command.toDefaultLocalizedCommand({
        id: 'vsxExtensions.clearAll',
        category: EXTENSIONS_CATEGORY,
        label: 'Clear Search Results',
        iconClass: (0, browser_1.codicon)('clear-all')
    });
    VSXExtensionsCommands.INSTALL_FROM_VSIX = {
        id: 'vsxExtensions.installFromVSIX',
        category: nls_1.nls.localizeByDefault(EXTENSIONS_CATEGORY),
        originalCategory: EXTENSIONS_CATEGORY,
        originalLabel: 'Install from VSIX...',
        label: nls_1.nls.localizeByDefault('Install from VSIX') + '...',
        dialogLabel: nls_1.nls.localizeByDefault('Install from VSIX')
    };
    VSXExtensionsCommands.INSTALL_ANOTHER_VERSION = {
        id: 'vsxExtensions.installAnotherVersion'
    };
    VSXExtensionsCommands.COPY = {
        id: 'vsxExtensions.copy'
    };
    VSXExtensionsCommands.COPY_EXTENSION_ID = {
        id: 'vsxExtensions.copyExtensionId'
    };
    VSXExtensionsCommands.SHOW_BUILTINS = common_1.Command.toDefaultLocalizedCommand({
        id: 'vsxExtension.showBuiltins',
        label: 'Show Built-in Extensions',
        category: EXTENSIONS_CATEGORY,
    });
    VSXExtensionsCommands.SHOW_INSTALLED = common_1.Command.toLocalizedCommand({
        id: 'vsxExtension.showInstalled',
        label: 'Show Installed Extensions',
        category: EXTENSIONS_CATEGORY,
    }, 'theia/vsx-registry/showInstalled');
    VSXExtensionsCommands.SHOW_RECOMMENDATIONS = common_1.Command.toDefaultLocalizedCommand({
        id: 'vsxExtension.showRecommendations',
        label: 'Show Recommended Extensions',
        category: EXTENSIONS_CATEGORY,
    });
})(VSXExtensionsCommands = exports.VSXExtensionsCommands || (exports.VSXExtensionsCommands = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/vsx-registry/lib/browser/vsx-extension-commands'] = this;


/***/ }),

/***/ "../../packages/vsx-registry/lib/browser/vsx-extension-editor-manager.js":
/*!*******************************************************************************!*\
  !*** ../../packages/vsx-registry/lib/browser/vsx-extension-editor-manager.js ***!
  \*******************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2020 TypeFox and others.
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
exports.VSXExtensionEditorManager = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const plugin_vscode_uri_1 = __webpack_require__(/*! @theia/plugin-ext-vscode/lib/common/plugin-vscode-uri */ "../../packages/plugin-ext-vscode/lib/common/plugin-vscode-uri.js");
const vsx_extension_editor_1 = __webpack_require__(/*! ./vsx-extension-editor */ "../../packages/vsx-registry/lib/browser/vsx-extension-editor.js");
let VSXExtensionEditorManager = class VSXExtensionEditorManager extends browser_1.WidgetOpenHandler {
    constructor() {
        super(...arguments);
        this.id = vsx_extension_editor_1.VSXExtensionEditor.ID;
    }
    canHandle(uri) {
        const id = plugin_vscode_uri_1.VSCodeExtensionUri.toId(uri);
        return !!id ? 500 : 0;
    }
    createWidgetOptions(uri) {
        const id = plugin_vscode_uri_1.VSCodeExtensionUri.toId(uri);
        if (!id) {
            throw new Error('Invalid URI: ' + uri.toString());
        }
        return { id };
    }
};
VSXExtensionEditorManager = __decorate([
    (0, inversify_1.injectable)()
], VSXExtensionEditorManager);
exports.VSXExtensionEditorManager = VSXExtensionEditorManager;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/vsx-registry/lib/browser/vsx-extension-editor-manager'] = this;


/***/ }),

/***/ "../../packages/vsx-registry/lib/browser/vsx-extension-editor.js":
/*!***********************************************************************!*\
  !*** ../../packages/vsx-registry/lib/browser/vsx-extension-editor.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2020 TypeFox and others.
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
var VSXExtensionEditor_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VSXExtensionEditor = void 0;
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const vsx_extension_1 = __webpack_require__(/*! ./vsx-extension */ "../../packages/vsx-registry/lib/browser/vsx-extension.js");
const vsx_extensions_model_1 = __webpack_require__(/*! ./vsx-extensions-model */ "../../packages/vsx-registry/lib/browser/vsx-extensions-model.js");
const promise_util_1 = __webpack_require__(/*! @theia/core/lib/common/promise-util */ "../../packages/core/lib/common/promise-util.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
let VSXExtensionEditor = VSXExtensionEditor_1 = class VSXExtensionEditor extends browser_1.ReactWidget {
    constructor() {
        super(...arguments);
        this.deferredScrollContainer = new promise_util_1.Deferred();
        this.resolveScrollContainer = (element) => {
            if (!element) {
                this.deferredScrollContainer.reject(new Error('element is null'));
            }
            else if (!element.scrollContainer) {
                this.deferredScrollContainer.reject(new Error('element.scrollContainer is undefined'));
            }
            else {
                this.deferredScrollContainer.resolve(element.scrollContainer);
            }
        };
    }
    init() {
        this.addClass('theia-vsx-extension-editor');
        this.id = VSXExtensionEditor_1.ID + ':' + this.extension.id;
        this.title.closable = true;
        this.updateTitle();
        this.title.iconClass = (0, browser_1.codicon)('list-selection');
        this.node.tabIndex = -1;
        this.update();
        this.toDispose.push(this.model.onDidChange(() => this.update()));
    }
    getScrollContainer() {
        return this.deferredScrollContainer.promise;
    }
    onActivateRequest(msg) {
        super.onActivateRequest(msg);
        this.node.focus();
    }
    onUpdateRequest(msg) {
        super.onUpdateRequest(msg);
        this.updateTitle();
    }
    onAfterShow(msg) {
        super.onAfterShow(msg);
        this.update();
    }
    updateTitle() {
        const label = nls_1.nls.localizeByDefault('Extension: {0}', (this.extension.displayName || this.extension.name));
        this.title.label = label;
        this.title.caption = label;
    }
    onResize(msg) {
        super.onResize(msg);
        this.update();
    }
    ;
    render() {
        return React.createElement(vsx_extension_1.VSXExtensionEditorComponent, { ref: this.resolveScrollContainer, extension: this.extension });
    }
};
VSXExtensionEditor.ID = 'vsx-extension-editor';
__decorate([
    (0, inversify_1.inject)(vsx_extension_1.VSXExtension),
    __metadata("design:type", vsx_extension_1.VSXExtension)
], VSXExtensionEditor.prototype, "extension", void 0);
__decorate([
    (0, inversify_1.inject)(vsx_extensions_model_1.VSXExtensionsModel),
    __metadata("design:type", vsx_extensions_model_1.VSXExtensionsModel)
], VSXExtensionEditor.prototype, "model", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VSXExtensionEditor.prototype, "init", null);
VSXExtensionEditor = VSXExtensionEditor_1 = __decorate([
    (0, inversify_1.injectable)()
], VSXExtensionEditor);
exports.VSXExtensionEditor = VSXExtensionEditor;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/vsx-registry/lib/browser/vsx-extension-editor'] = this;


/***/ }),

/***/ "../../packages/vsx-registry/lib/browser/vsx-extension.js":
/*!****************************************************************!*\
  !*** ../../packages/vsx-registry/lib/browser/vsx-extension.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2020 TypeFox and others.
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
var VSXExtension_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VSXExtensionEditorComponent = exports.VSXExtensionComponent = exports.AbstractVSXExtensionComponent = exports.VSXExtension = exports.VSXExtensionFactory = exports.VSXExtensionOptions = exports.VSXExtensionData = exports.VSXExtensionsContextMenu = exports.EXTENSIONS_CONTEXT_MENU = void 0;
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const DOMPurify = __webpack_require__(/*! @theia/core/shared/dompurify */ "../../packages/core/shared/dompurify/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const opener_service_1 = __webpack_require__(/*! @theia/core/lib/browser/opener-service */ "../../packages/core/lib/browser/opener-service.js");
const hosted_plugin_1 = __webpack_require__(/*! @theia/plugin-ext/lib/hosted/browser/hosted-plugin */ "../../packages/plugin-ext/lib/hosted/browser/hosted-plugin.js");
const plugin_protocol_1 = __webpack_require__(/*! @theia/plugin-ext/lib/common/plugin-protocol */ "../../packages/plugin-ext/lib/common/plugin-protocol.js");
const plugin_vscode_uri_1 = __webpack_require__(/*! @theia/plugin-ext-vscode/lib/common/plugin-vscode-uri */ "../../packages/plugin-ext-vscode/lib/common/plugin-vscode-uri.js");
const progress_service_1 = __webpack_require__(/*! @theia/core/lib/common/progress-service */ "../../packages/core/lib/common/progress-service.js");
const endpoint_1 = __webpack_require__(/*! @theia/core/lib/browser/endpoint */ "../../packages/core/lib/browser/endpoint.js");
const vsx_environment_1 = __webpack_require__(/*! ../common/vsx-environment */ "../../packages/vsx-registry/lib/common/vsx-environment.js");
const vsx_extensions_search_model_1 = __webpack_require__(/*! ./vsx-extensions-search-model */ "../../packages/vsx-registry/lib/browser/vsx-extensions-search-model.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const window_service_1 = __webpack_require__(/*! @theia/core/lib/browser/window/window-service */ "../../packages/core/lib/browser/window/window-service.js");
const markdown_rendering_1 = __webpack_require__(/*! @theia/core/lib/common/markdown-rendering */ "../../packages/core/lib/common/markdown-rendering/index.js");
exports.EXTENSIONS_CONTEXT_MENU = ['extensions_context_menu'];
var VSXExtensionsContextMenu;
(function (VSXExtensionsContextMenu) {
    VSXExtensionsContextMenu.INSTALL = [...exports.EXTENSIONS_CONTEXT_MENU, '1_install'];
    VSXExtensionsContextMenu.COPY = [...exports.EXTENSIONS_CONTEXT_MENU, '2_copy'];
})(VSXExtensionsContextMenu = exports.VSXExtensionsContextMenu || (exports.VSXExtensionsContextMenu = {}));
let VSXExtensionData = class VSXExtensionData {
};
VSXExtensionData.KEYS = new Set([
    'version',
    'iconUrl',
    'publisher',
    'name',
    'displayName',
    'description',
    'averageRating',
    'downloadCount',
    'downloadUrl',
    'readmeUrl',
    'licenseUrl',
    'repository',
    'license',
    'readme',
    'preview',
    'namespaceAccess',
    'publishedBy'
]);
VSXExtensionData = __decorate([
    (0, inversify_1.injectable)()
], VSXExtensionData);
exports.VSXExtensionData = VSXExtensionData;
let VSXExtensionOptions = class VSXExtensionOptions {
};
VSXExtensionOptions = __decorate([
    (0, inversify_1.injectable)()
], VSXExtensionOptions);
exports.VSXExtensionOptions = VSXExtensionOptions;
exports.VSXExtensionFactory = Symbol('VSXExtensionFactory');
let VSXExtension = VSXExtension_1 = class VSXExtension {
    constructor() {
        this.data = {};
        this._busy = 0;
    }
    /**
     * Ensure the version string begins with `'v'`.
     */
    static formatVersion(version) {
        if (version && !version.startsWith('v')) {
            return `v${version}`;
        }
        return version;
    }
    postConstruct() {
        this.registryUri = this.environment.getRegistryUri();
    }
    get uri() {
        return plugin_vscode_uri_1.VSCodeExtensionUri.toUri(this.id);
    }
    get id() {
        return this.options.id;
    }
    get visible() {
        return !!this.name;
    }
    get plugin() {
        return this.pluginSupport.getPlugin(this.id);
    }
    get installed() {
        return !!this.plugin;
    }
    get builtin() {
        var _a;
        return ((_a = this.plugin) === null || _a === void 0 ? void 0 : _a.type) === plugin_protocol_1.PluginType.System;
    }
    update(data) {
        for (const key of VSXExtensionData.KEYS) {
            if (key in data) {
                Object.assign(this.data, { [key]: data[key] });
            }
        }
    }
    reloadWindow() {
        this.windowService.reload();
    }
    getData(key) {
        var _a;
        const model = (_a = this.plugin) === null || _a === void 0 ? void 0 : _a.metadata.model;
        if (model && key in model) {
            return model[key];
        }
        return this.data[key];
    }
    get iconUrl() {
        const plugin = this.plugin;
        const iconUrl = plugin && plugin.metadata.model.iconUrl;
        if (iconUrl) {
            return new endpoint_1.Endpoint({ path: iconUrl }).getRestUrl().toString();
        }
        return this.data['iconUrl'];
    }
    get publisher() {
        return this.getData('publisher');
    }
    get name() {
        return this.getData('name');
    }
    get displayName() {
        return this.getData('displayName') || this.name;
    }
    get description() {
        return this.getData('description');
    }
    get version() {
        return this.getData('version');
    }
    get averageRating() {
        return this.getData('averageRating');
    }
    get downloadCount() {
        return this.getData('downloadCount');
    }
    get downloadUrl() {
        return this.getData('downloadUrl');
    }
    get readmeUrl() {
        const plugin = this.plugin;
        const readmeUrl = plugin && plugin.metadata.model.readmeUrl;
        if (readmeUrl) {
            return new endpoint_1.Endpoint({ path: readmeUrl }).getRestUrl().toString();
        }
        return this.data['readmeUrl'];
    }
    get licenseUrl() {
        let licenseUrl = this.data['licenseUrl'];
        if (licenseUrl) {
            return licenseUrl;
        }
        else {
            const plugin = this.plugin;
            licenseUrl = plugin && plugin.metadata.model.licenseUrl;
            if (licenseUrl) {
                return new endpoint_1.Endpoint({ path: licenseUrl }).getRestUrl().toString();
            }
        }
    }
    get repository() {
        return this.getData('repository');
    }
    get license() {
        return this.getData('license');
    }
    get readme() {
        return this.getData('readme');
    }
    get preview() {
        return this.getData('preview');
    }
    get namespaceAccess() {
        return this.getData('namespaceAccess');
    }
    get publishedBy() {
        return this.getData('publishedBy');
    }
    get tooltip() {
        let md = `__${this.displayName}__ ${VSXExtension_1.formatVersion(this.version)}\n\n${this.description}\n_____\n\n${common_1.nls.localizeByDefault('Publisher: {0}', this.publisher)}`;
        if (this.license) {
            md += `  \r${common_1.nls.localize('theia/vsx-registry/license', 'License: {0}', this.license)}`;
        }
        if (this.downloadCount) {
            md += `  \r${common_1.nls.localize('theia/vsx-registry/downloadCount', 'Download count: {0}', downloadCompactFormatter.format(this.downloadCount))}`;
        }
        if (this.averageRating) {
            md += `  \r${getAverageRatingTitle(this.averageRating)}`;
        }
        return md;
    }
    get busy() {
        return !!this._busy;
    }
    async install(options) {
        var _a;
        this._busy++;
        try {
            await this.progressService.withProgress(common_1.nls.localizeByDefault("Installing extension '{0}' v{1}...", this.id, (_a = this.version) !== null && _a !== void 0 ? _a : 0), 'extensions', () => this.pluginServer.deploy(this.uri.toString(), undefined, options));
        }
        finally {
            this._busy--;
        }
    }
    async uninstall() {
        this._busy++;
        try {
            const { plugin } = this;
            if (plugin) {
                await this.progressService.withProgress(common_1.nls.localizeByDefault('Uninstalling {0}...', this.id), 'extensions', () => this.pluginServer.uninstall(plugin_protocol_1.PluginIdentifiers.componentsToVersionedId(plugin.metadata.model)));
            }
        }
        finally {
            this._busy--;
        }
    }
    handleContextMenu(e) {
        e.preventDefault();
        this.contextMenuRenderer.render({
            menuPath: exports.EXTENSIONS_CONTEXT_MENU,
            anchor: {
                x: e.clientX,
                y: e.clientY,
            },
            args: [this]
        });
    }
    /**
     * Get the registry link for the given extension.
     * @param path the url path.
     * @returns the registry link for the given extension at the path.
     */
    async getRegistryLink(path = '') {
        const registryUri = new uri_1.default(await this.registryUri);
        if (this.downloadUrl) {
            const downloadUri = new uri_1.default(this.downloadUrl);
            if (downloadUri.authority !== registryUri.authority) {
                throw new Error('cannot generate a valid URL');
            }
        }
        return registryUri.resolve('extension/' + this.id.replace('.', '/')).resolve(path);
    }
    async serialize() {
        const serializedExtension = [];
        serializedExtension.push(`Name: ${this.displayName}`);
        serializedExtension.push(`Id: ${this.id}`);
        serializedExtension.push(`Description: ${this.description}`);
        serializedExtension.push(`Version: ${this.version}`);
        serializedExtension.push(`Publisher: ${this.publisher}`);
        if (this.downloadUrl !== undefined) {
            const registryLink = await this.getRegistryLink();
            serializedExtension.push(`Open VSX Link: ${registryLink.toString()}`);
        }
        ;
        return serializedExtension.join('\n');
    }
    async open(options = { mode: 'reveal' }) {
        await this.doOpen(this.uri, options);
    }
    async doOpen(uri, options) {
        await (0, opener_service_1.open)(this.openerService, uri, options);
    }
    render(host) {
        return React.createElement(VSXExtensionComponent, { extension: this, host: host, hoverService: this.hoverService });
    }
};
__decorate([
    (0, inversify_1.inject)(VSXExtensionOptions),
    __metadata("design:type", VSXExtensionOptions)
], VSXExtension.prototype, "options", void 0);
__decorate([
    (0, inversify_1.inject)(opener_service_1.OpenerService),
    __metadata("design:type", Object)
], VSXExtension.prototype, "openerService", void 0);
__decorate([
    (0, inversify_1.inject)(hosted_plugin_1.HostedPluginSupport),
    __metadata("design:type", hosted_plugin_1.HostedPluginSupport)
], VSXExtension.prototype, "pluginSupport", void 0);
__decorate([
    (0, inversify_1.inject)(plugin_protocol_1.PluginServer),
    __metadata("design:type", Object)
], VSXExtension.prototype, "pluginServer", void 0);
__decorate([
    (0, inversify_1.inject)(progress_service_1.ProgressService),
    __metadata("design:type", progress_service_1.ProgressService)
], VSXExtension.prototype, "progressService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.ContextMenuRenderer),
    __metadata("design:type", browser_1.ContextMenuRenderer)
], VSXExtension.prototype, "contextMenuRenderer", void 0);
__decorate([
    (0, inversify_1.inject)(vsx_environment_1.VSXEnvironment),
    __metadata("design:type", Object)
], VSXExtension.prototype, "environment", void 0);
__decorate([
    (0, inversify_1.inject)(vsx_extensions_search_model_1.VSXExtensionsSearchModel),
    __metadata("design:type", vsx_extensions_search_model_1.VSXExtensionsSearchModel)
], VSXExtension.prototype, "search", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.HoverService),
    __metadata("design:type", browser_1.HoverService)
], VSXExtension.prototype, "hoverService", void 0);
__decorate([
    (0, inversify_1.inject)(window_service_1.WindowService),
    __metadata("design:type", Object)
], VSXExtension.prototype, "windowService", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.CommandRegistry),
    __metadata("design:type", common_1.CommandRegistry)
], VSXExtension.prototype, "commandRegistry", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VSXExtension.prototype, "postConstruct", null);
VSXExtension = VSXExtension_1 = __decorate([
    (0, inversify_1.injectable)()
], VSXExtension);
exports.VSXExtension = VSXExtension;
class AbstractVSXExtensionComponent extends React.Component {
    constructor() {
        super(...arguments);
        this.install = async (event) => {
            event === null || event === void 0 ? void 0 : event.stopPropagation();
            this.forceUpdate();
            try {
                const pending = this.props.extension.install();
                this.forceUpdate();
                await pending;
            }
            finally {
                this.forceUpdate();
            }
        };
        this.uninstall = async (event) => {
            event === null || event === void 0 ? void 0 : event.stopPropagation();
            try {
                const pending = this.props.extension.uninstall();
                this.forceUpdate();
                await pending;
            }
            finally {
                this.forceUpdate();
            }
        };
        this.reloadWindow = (event) => {
            event === null || event === void 0 ? void 0 : event.stopPropagation();
            this.props.extension.reloadWindow();
        };
        this.manage = (e) => {
            e.stopPropagation();
            this.props.extension.handleContextMenu(e);
        };
    }
    renderAction(host) {
        var _a;
        const { builtin, busy, plugin } = this.props.extension;
        const isFocused = ((_a = host === null || host === void 0 ? void 0 : host.model.getFocusedNode()) === null || _a === void 0 ? void 0 : _a.element) === this.props.extension;
        const tabIndex = (!host || isFocused) ? 0 : undefined;
        const installed = !!plugin;
        const outOfSynch = plugin === null || plugin === void 0 ? void 0 : plugin.metadata.outOfSync;
        if (builtin) {
            return React.createElement("div", { className: "codicon codicon-settings-gear action", tabIndex: tabIndex, onClick: this.manage });
        }
        if (busy) {
            if (installed) {
                return React.createElement("button", { className: "theia-button action theia-mod-disabled" }, common_1.nls.localizeByDefault('Uninstalling'));
            }
            return React.createElement("button", { className: "theia-button action prominent theia-mod-disabled" }, common_1.nls.localizeByDefault('Installing'));
        }
        if (installed) {
            return React.createElement("div", null,
                outOfSynch
                    ? React.createElement("button", { className: "theia-button action", onClick: this.reloadWindow }, common_1.nls.localizeByDefault('Reload Required'))
                    : React.createElement("button", { className: "theia-button action", onClick: this.uninstall }, common_1.nls.localizeByDefault('Uninstall')),
                React.createElement("div", { className: "codicon codicon-settings-gear action", onClick: this.manage }));
        }
        return React.createElement("button", { className: "theia-button prominent action", onClick: this.install }, common_1.nls.localizeByDefault('Install'));
    }
}
exports.AbstractVSXExtensionComponent = AbstractVSXExtensionComponent;
const downloadFormatter = new Intl.NumberFormat();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const downloadCompactFormatter = new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' });
const averageRatingFormatter = (averageRating) => Math.round(averageRating * 2) / 2;
const getAverageRatingTitle = (averageRating) => common_1.nls.localizeByDefault('Average rating: {0} out of 5', averageRatingFormatter(averageRating));
class VSXExtensionComponent extends AbstractVSXExtensionComponent {
    render() {
        const { iconUrl, publisher, displayName, description, version, downloadCount, averageRating, tooltip } = this.props.extension;
        return React.createElement("div", { className: 'theia-vsx-extension noselect', onMouseEnter: event => {
                this.props.hoverService.requestHover({
                    content: new markdown_rendering_1.MarkdownStringImpl(tooltip),
                    target: event.currentTarget,
                    position: 'right'
                });
            } },
            iconUrl ?
                React.createElement("img", { className: 'theia-vsx-extension-icon', src: iconUrl }) :
                React.createElement("div", { className: 'theia-vsx-extension-icon placeholder' }),
            React.createElement("div", { className: 'theia-vsx-extension-content' },
                React.createElement("div", { className: 'title' },
                    React.createElement("div", { className: 'noWrapInfo' },
                        React.createElement("span", { className: 'name' }, displayName),
                        " ",
                        React.createElement("span", { className: 'version' }, VSXExtension.formatVersion(version))),
                    React.createElement("div", { className: 'stat' },
                        !!downloadCount && React.createElement("span", { className: 'download-count' },
                            React.createElement("i", { className: (0, browser_1.codicon)('cloud-download') }),
                            downloadCompactFormatter.format(downloadCount)),
                        !!averageRating && React.createElement("span", { className: 'average-rating' },
                            React.createElement("i", { className: (0, browser_1.codicon)('star-full') }),
                            averageRatingFormatter(averageRating)))),
                React.createElement("div", { className: 'noWrapInfo theia-vsx-extension-description' }, description),
                React.createElement("div", { className: 'theia-vsx-extension-action-bar' },
                    React.createElement("span", { className: 'noWrapInfo theia-vsx-extension-publisher' }, publisher),
                    this.renderAction(this.props.host))));
    }
}
exports.VSXExtensionComponent = VSXExtensionComponent;
class VSXExtensionEditorComponent extends AbstractVSXExtensionComponent {
    constructor() {
        super(...arguments);
        // TODO replace with webview
        this.openLink = (event) => {
            if (!this.body) {
                return;
            }
            const target = event.nativeEvent.target;
            if (!(target instanceof HTMLElement)) {
                return;
            }
            let node = target;
            while (node.tagName.toLowerCase() !== 'a') {
                if (node === this.body) {
                    return;
                }
                if (!(node.parentElement instanceof HTMLElement)) {
                    return;
                }
                node = node.parentElement;
            }
            const href = node.getAttribute('href');
            if (href && !href.startsWith('#')) {
                event.preventDefault();
                this.props.extension.doOpen(new uri_1.default(href));
            }
        };
        this.openExtension = async (e) => {
            e.stopPropagation();
            e.preventDefault();
            const extension = this.props.extension;
            const uri = await extension.getRegistryLink();
            extension.doOpen(uri);
        };
        this.searchPublisher = (e) => {
            e.stopPropagation();
            e.preventDefault();
            const extension = this.props.extension;
            if (extension.publisher) {
                extension.search.query = extension.publisher;
            }
        };
        this.openPublishedBy = async (e) => {
            e.stopPropagation();
            e.preventDefault();
            const extension = this.props.extension;
            const homepage = extension.publishedBy && extension.publishedBy.homepage;
            if (homepage) {
                extension.doOpen(new uri_1.default(homepage));
            }
        };
        this.openAverageRating = async (e) => {
            e.stopPropagation();
            e.preventDefault();
            const extension = this.props.extension;
            const uri = await extension.getRegistryLink('reviews');
            extension.doOpen(uri);
        };
        this.openRepository = (e) => {
            e.stopPropagation();
            e.preventDefault();
            const extension = this.props.extension;
            if (extension.repository) {
                extension.doOpen(new uri_1.default(extension.repository));
            }
        };
        this.openLicense = (e) => {
            e.stopPropagation();
            e.preventDefault();
            const extension = this.props.extension;
            const licenseUrl = extension.licenseUrl;
            if (licenseUrl) {
                extension.doOpen(new uri_1.default(licenseUrl));
            }
        };
    }
    get scrollContainer() {
        return this._scrollContainer;
    }
    render() {
        const { builtin, preview, id, iconUrl, publisher, displayName, description, version, averageRating, downloadCount, repository, license, readme } = this.props.extension;
        const sanitizedReadme = !!readme ? DOMPurify.sanitize(readme) : undefined;
        return React.createElement(React.Fragment, null,
            React.createElement("div", { className: 'header', ref: ref => this.header = (ref || undefined) },
                iconUrl ?
                    React.createElement("img", { className: 'icon-container', src: iconUrl }) :
                    React.createElement("div", { className: 'icon-container placeholder' }),
                React.createElement("div", { className: 'details' },
                    React.createElement("div", { className: 'title' },
                        React.createElement("span", { title: 'Extension name', className: 'name', onClick: this.openExtension }, displayName),
                        React.createElement("span", { title: 'Extension identifier', className: 'identifier' }, id),
                        preview && React.createElement("span", { className: 'preview' }, "Preview"),
                        builtin && React.createElement("span", { className: 'builtin' }, "Built-in")),
                    React.createElement("div", { className: 'subtitle' },
                        React.createElement("span", { title: 'Publisher name', className: 'publisher', onClick: this.searchPublisher },
                            this.renderNamespaceAccess(),
                            publisher),
                        !!downloadCount && React.createElement("span", { className: 'download-count', onClick: this.openExtension },
                            React.createElement("i", { className: (0, browser_1.codicon)('cloud-download') }),
                            downloadFormatter.format(downloadCount)),
                        averageRating !== undefined &&
                            React.createElement("span", { className: 'average-rating', title: getAverageRatingTitle(averageRating), onClick: this.openAverageRating }, this.renderStars()),
                        repository && React.createElement("span", { className: 'repository', onClick: this.openRepository }, "Repository"),
                        license && React.createElement("span", { className: 'license', onClick: this.openLicense }, license),
                        version && React.createElement("span", { className: 'version' }, VSXExtension.formatVersion(version))),
                    React.createElement("div", { className: 'description noWrapInfo' }, description),
                    this.renderAction())),
            sanitizedReadme &&
                React.createElement("div", { className: 'scroll-container', ref: ref => this._scrollContainer = (ref || undefined) },
                    React.createElement("div", { className: 'body', ref: ref => this.body = (ref || undefined), onClick: this.openLink, 
                        // eslint-disable-next-line react/no-danger
                        dangerouslySetInnerHTML: { __html: sanitizedReadme } })));
    }
    renderNamespaceAccess() {
        const { publisher, namespaceAccess, publishedBy } = this.props.extension;
        if (namespaceAccess === undefined) {
            return undefined;
        }
        let tooltip = publishedBy ? ` Published by "${publishedBy.loginName}".` : '';
        let icon;
        if (namespaceAccess === 'public') {
            icon = 'globe';
            tooltip = `Everyone can publish to "${publisher}" namespace.` + tooltip;
        }
        else {
            icon = 'shield';
            tooltip = `Only verified owners can publish to "${publisher}" namespace.` + tooltip;
        }
        return React.createElement("i", { className: `${(0, browser_1.codicon)(icon)} namespace-access`, title: tooltip, onClick: this.openPublishedBy });
    }
    renderStars() {
        const rating = this.props.extension.averageRating || 0;
        const renderStarAt = (position) => position <= rating ?
            React.createElement("i", { className: (0, browser_1.codicon)('star-full') }) :
            position > rating && position - rating < 1 ?
                React.createElement("i", { className: (0, browser_1.codicon)('star-half') }) :
                React.createElement("i", { className: (0, browser_1.codicon)('star-empty') });
        return React.createElement(React.Fragment, null,
            renderStarAt(1),
            renderStarAt(2),
            renderStarAt(3),
            renderStarAt(4),
            renderStarAt(5));
    }
}
exports.VSXExtensionEditorComponent = VSXExtensionEditorComponent;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/vsx-registry/lib/browser/vsx-extension'] = this;


/***/ }),

/***/ "../../packages/vsx-registry/lib/browser/vsx-extensions-contribution.js":
/*!******************************************************************************!*\
  !*** ../../packages/vsx-registry/lib/browser/vsx-extensions-contribution.js ***!
  \******************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2020 TypeFox and others.
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
exports.VSXExtensionsContribution = void 0;
const luxon_1 = __webpack_require__(/*! luxon */ "../../node_modules/luxon/build/node/luxon.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const debounce = __webpack_require__(/*! @theia/core/shared/lodash.debounce */ "../../packages/core/shared/lodash.debounce/index.js");
const command_1 = __webpack_require__(/*! @theia/core/lib/common/command */ "../../packages/core/lib/common/command.js");
const view_contribution_1 = __webpack_require__(/*! @theia/core/lib/browser/shell/view-contribution */ "../../packages/core/lib/browser/shell/view-contribution.js");
const vsx_extensions_view_container_1 = __webpack_require__(/*! ./vsx-extensions-view-container */ "../../packages/vsx-registry/lib/browser/vsx-extensions-view-container.js");
const vsx_extensions_model_1 = __webpack_require__(/*! ./vsx-extensions-model */ "../../packages/vsx-registry/lib/browser/vsx-extensions-model.js");
const color_1 = __webpack_require__(/*! @theia/core/lib/common/color */ "../../packages/core/lib/common/color.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/filesystem/lib/browser */ "../../packages/filesystem/lib/browser/index.js");
const browser_2 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const plugin_vscode_commands_contribution_1 = __webpack_require__(/*! @theia/plugin-ext-vscode/lib/browser/plugin-vscode-commands-contribution */ "../../packages/plugin-ext-vscode/lib/browser/plugin-vscode-commands-contribution.js");
const vsx_extension_1 = __webpack_require__(/*! ./vsx-extension */ "../../packages/vsx-registry/lib/browser/vsx-extension.js");
const clipboard_service_1 = __webpack_require__(/*! @theia/core/lib/browser/clipboard-service */ "../../packages/core/lib/browser/clipboard-service.js");
const vsx_extensions_search_model_1 = __webpack_require__(/*! ./vsx-extensions-search-model */ "../../packages/vsx-registry/lib/browser/vsx-extensions-search-model.js");
const recommended_extensions_preference_contribution_1 = __webpack_require__(/*! ./recommended-extensions/recommended-extensions-preference-contribution */ "../../packages/vsx-registry/lib/browser/recommended-extensions/recommended-extensions-preference-contribution.js");
const vsx_extension_commands_1 = __webpack_require__(/*! ./vsx-extension-commands */ "../../packages/vsx-registry/lib/browser/vsx-extension-commands.js");
const ovsx_client_1 = __webpack_require__(/*! @theia/ovsx-client */ "../../dev-packages/ovsx-client/lib/index.js");
const ovsx_client_provider_1 = __webpack_require__(/*! ../common/ovsx-client-provider */ "../../packages/vsx-registry/lib/common/ovsx-client-provider.js");
let VSXExtensionsContribution = class VSXExtensionsContribution extends view_contribution_1.AbstractViewContribution {
    constructor() {
        super({
            widgetId: vsx_extensions_view_container_1.VSXExtensionsViewContainer.ID,
            widgetName: vsx_extensions_view_container_1.VSXExtensionsViewContainer.LABEL,
            defaultWidgetOptions: {
                area: 'left',
                rank: 500
            },
            toggleCommandId: 'vsxExtensions.toggle',
            toggleKeybinding: 'ctrlcmd+shift+x'
        });
    }
    init() {
        const oneShotDisposable = this.model.onDidChange(debounce(() => {
            this.showRecommendedToast();
            oneShotDisposable.dispose();
        }, 5000, { trailing: true }));
    }
    async initializeLayout(app) {
        await this.openView({ activate: false });
    }
    registerCommands(commands) {
        super.registerCommands(commands);
        commands.registerCommand(vsx_extension_commands_1.VSXExtensionsCommands.CLEAR_ALL, {
            execute: () => this.model.search.query = '',
            isEnabled: () => !!this.model.search.query,
            isVisible: () => true,
        });
        commands.registerCommand(vsx_extension_commands_1.VSXExtensionsCommands.INSTALL_FROM_VSIX, {
            execute: () => this.installFromVSIX()
        });
        commands.registerCommand(vsx_extension_commands_1.VSXExtensionsCommands.INSTALL_ANOTHER_VERSION, {
            // Check downloadUrl to ensure we have an idea of where to look for other versions.
            isEnabled: (extension) => !extension.builtin && !!extension.downloadUrl,
            execute: async (extension) => this.installAnotherVersion(extension),
        });
        commands.registerCommand(vsx_extension_commands_1.VSXExtensionsCommands.COPY, {
            execute: (extension) => this.copy(extension)
        });
        commands.registerCommand(vsx_extension_commands_1.VSXExtensionsCommands.COPY_EXTENSION_ID, {
            execute: (extension) => this.copyExtensionId(extension)
        });
        commands.registerCommand(vsx_extension_commands_1.VSXExtensionsCommands.SHOW_BUILTINS, {
            execute: () => this.showBuiltinExtensions()
        });
        commands.registerCommand(vsx_extension_commands_1.VSXExtensionsCommands.SHOW_INSTALLED, {
            execute: () => this.showInstalledExtensions()
        });
        commands.registerCommand(vsx_extension_commands_1.VSXExtensionsCommands.SHOW_RECOMMENDATIONS, {
            execute: () => this.showRecommendedExtensions()
        });
    }
    registerMenus(menus) {
        super.registerMenus(menus);
        menus.registerMenuAction(vsx_extension_1.VSXExtensionsContextMenu.COPY, {
            commandId: vsx_extension_commands_1.VSXExtensionsCommands.COPY.id,
            label: common_1.nls.localizeByDefault('Copy'),
            order: '0'
        });
        menus.registerMenuAction(vsx_extension_1.VSXExtensionsContextMenu.COPY, {
            commandId: vsx_extension_commands_1.VSXExtensionsCommands.COPY_EXTENSION_ID.id,
            label: common_1.nls.localizeByDefault('Copy Extension ID'),
            order: '1'
        });
        menus.registerMenuAction(vsx_extension_1.VSXExtensionsContextMenu.INSTALL, {
            commandId: vsx_extension_commands_1.VSXExtensionsCommands.INSTALL_ANOTHER_VERSION.id,
            label: common_1.nls.localizeByDefault('Install Another Version...'),
        });
    }
    registerColors(colors) {
        // VS Code colors should be aligned with https://code.visualstudio.com/api/references/theme-color#extensions
        colors.register({
            id: 'extensionButton.prominentBackground', defaults: {
                dark: '#327e36',
                light: '#327e36'
            }, description: 'Button background color for actions extension that stand out (e.g. install button).'
        }, {
            id: 'extensionButton.prominentForeground', defaults: {
                dark: color_1.Color.white,
                light: color_1.Color.white
            }, description: 'Button foreground color for actions extension that stand out (e.g. install button).'
        }, {
            id: 'extensionButton.prominentHoverBackground', defaults: {
                dark: '#28632b',
                light: '#28632b'
            }, description: 'Button background hover color for actions extension that stand out (e.g. install button).'
        }, {
            id: 'extensionEditor.tableHeadBorder', defaults: {
                dark: color_1.Color.transparent('#ffffff', 0.7),
                light: color_1.Color.transparent('#000000', 0.7),
                hcDark: color_1.Color.white,
                hcLight: color_1.Color.black
            }, description: 'Border color for the table head row of the extension editor view'
        }, {
            id: 'extensionEditor.tableCellBorder', defaults: {
                dark: color_1.Color.transparent('#ffffff', 0.2),
                light: color_1.Color.transparent('#000000', 0.2),
                hcDark: color_1.Color.white,
                hcLight: color_1.Color.black
            }, description: 'Border color for a table row of the extension editor view'
        });
    }
    /**
     * Installs a local .vsix file after prompting the `Open File` dialog. Resolves to the URI of the file.
     */
    async installFromVSIX() {
        const props = {
            title: vsx_extension_commands_1.VSXExtensionsCommands.INSTALL_FROM_VSIX.dialogLabel,
            openLabel: common_1.nls.localizeByDefault('Install from VSIX'),
            filters: { 'VSIX Extensions (*.vsix)': ['vsix'] },
            canSelectMany: false
        };
        const extensionUri = await this.fileDialogService.showOpenDialog(props);
        if (extensionUri) {
            if (extensionUri.path.ext === '.vsix') {
                const extensionName = this.labelProvider.getName(extensionUri);
                try {
                    await this.commandRegistry.executeCommand(plugin_vscode_commands_contribution_1.VscodeCommands.INSTALL_FROM_VSIX.id, extensionUri);
                    this.messageService.info(common_1.nls.localizeByDefault('Completed installing {0} extension from VSIX.', extensionName));
                }
                catch (e) {
                    this.messageService.error(common_1.nls.localize('theia/vsx-registry/failedInstallingVSIX', 'Failed to install {0} from VSIX.', extensionName));
                    console.warn(e);
                }
            }
            else {
                this.messageService.error(common_1.nls.localize('theia/vsx-registry/invalidVSIX', 'The selected file is not a valid "*.vsix" plugin.'));
            }
        }
    }
    /**
     * Given an extension, displays a quick pick of other compatible versions and installs the selected version.
     *
     * @param extension a VSX extension.
     */
    async installAnotherVersion(extension) {
        const extensionId = extension.id;
        const currentVersion = extension.version;
        const client = await this.clientProvider();
        const { extensions } = await client.query({ extensionId, includeAllVersions: true });
        const latestCompatible = this.vsxApiFilter.getLatestCompatibleExtension(extensions);
        let compatibleExtensions = [];
        let activeItem = undefined;
        if (latestCompatible) {
            compatibleExtensions = extensions.slice(extensions.findIndex(ext => ext.version === latestCompatible.version));
        }
        const items = compatibleExtensions.map(ext => {
            var _a;
            const item = {
                label: ext.version,
                description: (_a = luxon_1.DateTime.fromISO(ext.timestamp).toRelative({ locale: common_1.nls.locale })) !== null && _a !== void 0 ? _a : ''
            };
            if (currentVersion === ext.version) {
                item.description += ` (${common_1.nls.localizeByDefault('Current')})`;
                activeItem = item;
            }
            return item;
        });
        const selectedItem = await this.quickInput.showQuickPick(items, {
            placeholder: common_1.nls.localizeByDefault('Select Version to Install'),
            runIfSingle: false,
            activeItem
        });
        if (selectedItem) {
            const selectedExtension = this.model.getExtension(extensionId);
            if (selectedExtension) {
                await this.updateVersion(selectedExtension, selectedItem.label);
            }
        }
    }
    async copy(extension) {
        this.clipboardService.writeText(await extension.serialize());
    }
    copyExtensionId(extension) {
        this.clipboardService.writeText(extension.id);
    }
    /**
     * Updates an extension to a specific version.
     *
     * @param extension the extension to update.
     * @param updateToVersion the version to update to.
     * @param revertToVersion the version to revert to (in case of failure).
     */
    async updateVersion(extension, updateToVersion) {
        try {
            await extension.install({ version: updateToVersion, ignoreOtherVersions: true });
        }
        catch {
            this.messageService.warn(common_1.nls.localize('theia/vsx-registry/vsx-extensions-contribution/update-version-version-error', 'Failed to install version {0} of {1}.', updateToVersion, extension.displayName));
            return;
        }
        try {
            if (extension.version !== updateToVersion) {
                await extension.uninstall();
            }
        }
        catch {
            this.messageService.warn(common_1.nls.localize('theia/vsx-registry/vsx-extensions-contribution/update-version-uninstall-error', 'Error while removing the extension: {0}.', extension.displayName));
        }
    }
    async showRecommendedToast() {
        var _a;
        if (!this.preferenceService.get(recommended_extensions_preference_contribution_1.IGNORE_RECOMMENDATIONS_ID, false)) {
            const recommended = new Set([...this.model.recommended]);
            for (const installed of this.model.installed) {
                recommended.delete(installed);
            }
            if (recommended.size) {
                const install = common_1.nls.localizeByDefault('Install');
                const showRecommendations = common_1.nls.localizeByDefault('Show Recommendations');
                const userResponse = await this.messageService.info(common_1.nls.localize('theia/vsx-registry/recommendedExtensions', 'Do you want to install the recommended extensions for this repository?'), install, showRecommendations);
                if (userResponse === install) {
                    for (const recommendation of recommended) {
                        (_a = this.model.getExtension(recommendation)) === null || _a === void 0 ? void 0 : _a.install();
                    }
                }
                else if (userResponse === showRecommendations) {
                    await this.showRecommendedExtensions();
                }
            }
        }
    }
    async showBuiltinExtensions() {
        await this.openView({ activate: true });
        this.model.search.query = vsx_extensions_search_model_1.BUILTIN_QUERY;
    }
    async showInstalledExtensions() {
        await this.openView({ activate: true });
        this.model.search.query = vsx_extensions_search_model_1.INSTALLED_QUERY;
    }
    async showRecommendedExtensions() {
        await this.openView({ activate: true });
        this.model.search.query = vsx_extensions_search_model_1.RECOMMENDED_QUERY;
    }
};
__decorate([
    (0, inversify_1.inject)(vsx_extensions_model_1.VSXExtensionsModel),
    __metadata("design:type", vsx_extensions_model_1.VSXExtensionsModel)
], VSXExtensionsContribution.prototype, "model", void 0);
__decorate([
    (0, inversify_1.inject)(command_1.CommandRegistry),
    __metadata("design:type", command_1.CommandRegistry)
], VSXExtensionsContribution.prototype, "commandRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.FileDialogService),
    __metadata("design:type", Object)
], VSXExtensionsContribution.prototype, "fileDialogService", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.MessageService),
    __metadata("design:type", common_1.MessageService)
], VSXExtensionsContribution.prototype, "messageService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.LabelProvider),
    __metadata("design:type", browser_2.LabelProvider)
], VSXExtensionsContribution.prototype, "labelProvider", void 0);
__decorate([
    (0, inversify_1.inject)(clipboard_service_1.ClipboardService),
    __metadata("design:type", Object)
], VSXExtensionsContribution.prototype, "clipboardService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.PreferenceService),
    __metadata("design:type", Object)
], VSXExtensionsContribution.prototype, "preferenceService", void 0);
__decorate([
    (0, inversify_1.inject)(ovsx_client_provider_1.OVSXClientProvider),
    __metadata("design:type", Function)
], VSXExtensionsContribution.prototype, "clientProvider", void 0);
__decorate([
    (0, inversify_1.inject)(ovsx_client_1.OVSXApiFilter),
    __metadata("design:type", Object)
], VSXExtensionsContribution.prototype, "vsxApiFilter", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.QuickInputService),
    __metadata("design:type", Object)
], VSXExtensionsContribution.prototype, "quickInput", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VSXExtensionsContribution.prototype, "init", null);
VSXExtensionsContribution = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], VSXExtensionsContribution);
exports.VSXExtensionsContribution = VSXExtensionsContribution;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/vsx-registry/lib/browser/vsx-extensions-contribution'] = this;


/***/ }),

/***/ "../../packages/vsx-registry/lib/browser/vsx-extensions-model.js":
/*!***********************************************************************!*\
  !*** ../../packages/vsx-registry/lib/browser/vsx-extensions-model.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2020 TypeFox and others.
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
exports.VSXExtensionsModel = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const p_debounce_1 = __webpack_require__(/*! p-debounce */ "../../node_modules/p-debounce/index.js");
const markdownit = __webpack_require__(/*! @theia/core/shared/markdown-it */ "../../packages/core/shared/markdown-it.js");
const DOMPurify = __webpack_require__(/*! @theia/core/shared/dompurify */ "../../packages/core/shared/dompurify/index.js");
const event_1 = __webpack_require__(/*! @theia/core/lib/common/event */ "../../packages/core/lib/common/event.js");
const cancellation_1 = __webpack_require__(/*! @theia/core/lib/common/cancellation */ "../../packages/core/lib/common/cancellation.js");
const hosted_plugin_1 = __webpack_require__(/*! @theia/plugin-ext/lib/hosted/browser/hosted-plugin */ "../../packages/plugin-ext/lib/hosted/browser/hosted-plugin.js");
const vsx_extension_1 = __webpack_require__(/*! ./vsx-extension */ "../../packages/vsx-registry/lib/browser/vsx-extension.js");
const progress_service_1 = __webpack_require__(/*! @theia/core/lib/common/progress-service */ "../../packages/core/lib/common/progress-service.js");
const vsx_extensions_search_model_1 = __webpack_require__(/*! ./vsx-extensions-search-model */ "../../packages/vsx-registry/lib/browser/vsx-extensions-search-model.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const browser_2 = __webpack_require__(/*! @theia/workspace/lib/browser */ "../../packages/workspace/lib/browser/index.js");
const ovsx_types_1 = __webpack_require__(/*! @theia/ovsx-client/lib/ovsx-types */ "../../dev-packages/ovsx-client/lib/ovsx-types.js");
const ovsx_client_provider_1 = __webpack_require__(/*! ../common/ovsx-client-provider */ "../../packages/vsx-registry/lib/common/ovsx-client-provider.js");
const request_1 = __webpack_require__(/*! @theia/core/shared/@theia/request */ "../../packages/core/shared/@theia/request/index.js");
const ovsx_client_1 = __webpack_require__(/*! @theia/ovsx-client */ "../../dev-packages/ovsx-client/lib/index.js");
let VSXExtensionsModel = class VSXExtensionsModel {
    constructor() {
        /**
         * Single source for all extensions
         */
        this.extensions = new Map();
        this.onDidChangeEmitter = new event_1.Emitter();
        this._installed = new Set();
        this._recommended = new Set();
        this._searchResult = new Set();
        this.searchCancellationTokenSource = new cancellation_1.CancellationTokenSource();
        this.updateSearchResult = (0, p_debounce_1.default)(async () => {
            const { token } = this.resetSearchCancellationTokenSource();
            await this.doUpdateSearchResult({ query: this.search.query, includeAllVersions: true }, token);
        }, 500);
    }
    init() {
        this.initialized = this.doInit().catch(console.error);
    }
    async doInit() {
        await Promise.all([
            this.initInstalled(),
            this.initSearchResult(),
            this.initRecommended(),
        ]);
    }
    get onDidChange() {
        return this.onDidChangeEmitter.event;
    }
    get installed() {
        return this._installed.values();
    }
    get searchError() {
        return this._searchError;
    }
    get searchResult() {
        return this._searchResult.values();
    }
    get recommended() {
        return this._recommended.values();
    }
    isInstalled(id) {
        return this._installed.has(id);
    }
    getExtension(id) {
        return this.extensions.get(id);
    }
    resolve(id) {
        return this.doChange(async () => {
            await this.initialized;
            const extension = await this.refresh(id);
            if (!extension) {
                throw new Error(`Failed to resolve ${id} extension.`);
            }
            if (extension.readmeUrl) {
                try {
                    const rawReadme = request_1.RequestContext.asText(await this.request.request({ url: extension.readmeUrl }));
                    const readme = this.compileReadme(rawReadme);
                    extension.update({ readme });
                }
                catch (e) {
                    if (!ovsx_types_1.VSXResponseError.is(e) || e.statusCode !== 404) {
                        console.error(`[${id}]: failed to compile readme, reason:`, e);
                    }
                }
            }
            return extension;
        });
    }
    async initInstalled() {
        await this.pluginSupport.willStart;
        this.pluginSupport.onDidChangePlugins(() => this.updateInstalled());
        try {
            await this.updateInstalled();
        }
        catch (e) {
            console.error(e);
        }
    }
    async initSearchResult() {
        this.search.onDidChangeQuery(() => this.updateSearchResult());
        try {
            await this.updateSearchResult();
        }
        catch (e) {
            console.error(e);
        }
    }
    async initRecommended() {
        this.preferences.onPreferenceChanged(change => {
            if (change.preferenceName === 'extensions') {
                this.updateRecommended();
            }
        });
        await this.preferences.ready;
        try {
            await this.updateRecommended();
        }
        catch (e) {
            console.error(e);
        }
    }
    resetSearchCancellationTokenSource() {
        this.searchCancellationTokenSource.cancel();
        return this.searchCancellationTokenSource = new cancellation_1.CancellationTokenSource();
    }
    setExtension(id) {
        let extension = this.extensions.get(id);
        if (!extension) {
            extension = this.extensionFactory({ id });
            this.extensions.set(id, extension);
        }
        return extension;
    }
    doChange(task, token = cancellation_1.CancellationToken.None) {
        return this.progressService.withProgress('', 'extensions', async () => {
            if (token && token.isCancellationRequested) {
                return;
            }
            const result = await task();
            if (token && token.isCancellationRequested) {
                return;
            }
            this.onDidChangeEmitter.fire();
            return result;
        });
    }
    doUpdateSearchResult(param, token) {
        return this.doChange(async () => {
            const searchResult = new Set();
            if (!param.query) {
                this._searchResult = searchResult;
                return;
            }
            const client = await this.clientProvider();
            const result = await client.search(param);
            this._searchError = result.error;
            if (token.isCancellationRequested) {
                return;
            }
            for (const data of result.extensions) {
                const id = data.namespace.toLowerCase() + '.' + data.name.toLowerCase();
                const allVersions = this.vsxApiFilter.getLatestCompatibleVersion(data);
                if (!allVersions) {
                    continue;
                }
                this.setExtension(id).update(Object.assign(data, {
                    publisher: data.namespace,
                    downloadUrl: data.files.download,
                    iconUrl: data.files.icon,
                    readmeUrl: data.files.readme,
                    licenseUrl: data.files.license,
                    version: allVersions.version
                }));
                searchResult.add(id);
            }
            this._searchResult = searchResult;
        }, token);
    }
    async updateInstalled() {
        const prevInstalled = this._installed;
        return this.doChange(async () => {
            const plugins = this.pluginSupport.plugins;
            const currInstalled = new Set();
            const refreshing = [];
            for (const plugin of plugins) {
                if (plugin.model.engine.type === 'vscode') {
                    const version = plugin.model.version;
                    const id = plugin.model.id;
                    this._installed.delete(id);
                    const extension = this.setExtension(id);
                    currInstalled.add(extension.id);
                    refreshing.push(this.refresh(id, version));
                }
            }
            for (const id of this._installed) {
                const extension = this.getExtension(id);
                if (!extension) {
                    continue;
                }
                refreshing.push(this.refresh(id, extension.version));
            }
            const installed = new Set([...prevInstalled, ...currInstalled]);
            const installedSorted = Array.from(installed).sort((a, b) => this.compareExtensions(a, b));
            this._installed = new Set(installedSorted.values());
            await Promise.all(refreshing);
        });
    }
    updateRecommended() {
        return this.doChange(async () => {
            const allRecommendations = new Set();
            const allUnwantedRecommendations = new Set();
            const updateRecommendationsForScope = (scope, root) => {
                const { recommendations, unwantedRecommendations } = this.getRecommendationsForScope(scope, root);
                recommendations.forEach(recommendation => allRecommendations.add(recommendation));
                unwantedRecommendations.forEach(unwantedRecommendation => allUnwantedRecommendations.add(unwantedRecommendation));
            };
            updateRecommendationsForScope('defaultValue'); // In case there are application-default recommendations.
            const roots = await this.workspaceService.roots;
            for (const root of roots) {
                updateRecommendationsForScope('workspaceFolderValue', root.resource);
            }
            if (this.workspaceService.saved) {
                updateRecommendationsForScope('workspaceValue');
            }
            const recommendedSorted = new Set(Array.from(allRecommendations).sort((a, b) => this.compareExtensions(a, b)));
            allUnwantedRecommendations.forEach(unwantedRecommendation => recommendedSorted.delete(unwantedRecommendation));
            this._recommended = recommendedSorted;
            return Promise.all(Array.from(recommendedSorted, plugin => this.refresh(plugin)));
        });
    }
    getRecommendationsForScope(scope, root) {
        var _a, _b, _c;
        const configuredValue = (_a = this.preferences.inspect('extensions', root === null || root === void 0 ? void 0 : root.toString())) === null || _a === void 0 ? void 0 : _a[scope];
        return {
            recommendations: (_b = configuredValue === null || configuredValue === void 0 ? void 0 : configuredValue.recommendations) !== null && _b !== void 0 ? _b : [],
            unwantedRecommendations: (_c = configuredValue === null || configuredValue === void 0 ? void 0 : configuredValue.unwantedRecommendations) !== null && _c !== void 0 ? _c : [],
        };
    }
    compileReadme(readmeMarkdown) {
        const readmeHtml = markdownit({ html: true }).render(readmeMarkdown);
        return DOMPurify.sanitize(readmeHtml);
    }
    async refresh(id, version) {
        try {
            let extension = this.getExtension(id);
            if (!this.shouldRefresh(extension)) {
                return extension;
            }
            const client = await this.clientProvider();
            let data;
            if (version === undefined) {
                const { extensions } = await client.query({ extensionId: id, includeAllVersions: true });
                if (extensions === null || extensions === void 0 ? void 0 : extensions.length) {
                    data = this.vsxApiFilter.getLatestCompatibleExtension(extensions);
                }
            }
            else {
                const { extensions } = await client.query({ extensionId: id, extensionVersion: version, includeAllVersions: true });
                if (extensions === null || extensions === void 0 ? void 0 : extensions.length) {
                    data = extensions === null || extensions === void 0 ? void 0 : extensions[0];
                }
            }
            if (!data) {
                return;
            }
            if (data.error) {
                return this.onDidFailRefresh(id, data.error);
            }
            extension = this.setExtension(id);
            extension.update(Object.assign(data, {
                publisher: data.namespace,
                downloadUrl: data.files.download,
                iconUrl: data.files.icon,
                readmeUrl: data.files.readme,
                licenseUrl: data.files.license,
                version: data.version
            }));
            return extension;
        }
        catch (e) {
            return this.onDidFailRefresh(id, e);
        }
    }
    /**
     * Determines if the given extension should be refreshed.
     * @param extension the extension to refresh.
     */
    shouldRefresh(extension) {
        if (extension === undefined) {
            return true;
        }
        return !extension.builtin;
    }
    onDidFailRefresh(id, error) {
        const cached = this.getExtension(id);
        if (cached && cached.installed) {
            return cached;
        }
        console.error(`[${id}]: failed to refresh, reason:`, error);
        return undefined;
    }
    /**
     * Compare two extensions based on their display name, and publisher if applicable.
     * @param a the first extension id for comparison.
     * @param b the second extension id for comparison.
     */
    compareExtensions(a, b) {
        const extensionA = this.getExtension(a);
        const extensionB = this.getExtension(b);
        if (!extensionA || !extensionB) {
            return 0;
        }
        if (extensionA.displayName && extensionB.displayName) {
            return extensionA.displayName.localeCompare(extensionB.displayName);
        }
        if (extensionA.publisher && extensionB.publisher) {
            return extensionA.publisher.localeCompare(extensionB.publisher);
        }
        return 0;
    }
};
__decorate([
    (0, inversify_1.inject)(ovsx_client_provider_1.OVSXClientProvider),
    __metadata("design:type", Function)
], VSXExtensionsModel.prototype, "clientProvider", void 0);
__decorate([
    (0, inversify_1.inject)(hosted_plugin_1.HostedPluginSupport),
    __metadata("design:type", hosted_plugin_1.HostedPluginSupport)
], VSXExtensionsModel.prototype, "pluginSupport", void 0);
__decorate([
    (0, inversify_1.inject)(vsx_extension_1.VSXExtensionFactory),
    __metadata("design:type", Function)
], VSXExtensionsModel.prototype, "extensionFactory", void 0);
__decorate([
    (0, inversify_1.inject)(progress_service_1.ProgressService),
    __metadata("design:type", progress_service_1.ProgressService)
], VSXExtensionsModel.prototype, "progressService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.PreferenceService),
    __metadata("design:type", Object)
], VSXExtensionsModel.prototype, "preferences", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.WorkspaceService),
    __metadata("design:type", browser_2.WorkspaceService)
], VSXExtensionsModel.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(vsx_extensions_search_model_1.VSXExtensionsSearchModel),
    __metadata("design:type", vsx_extensions_search_model_1.VSXExtensionsSearchModel)
], VSXExtensionsModel.prototype, "search", void 0);
__decorate([
    (0, inversify_1.inject)(request_1.RequestService),
    __metadata("design:type", Object)
], VSXExtensionsModel.prototype, "request", void 0);
__decorate([
    (0, inversify_1.inject)(ovsx_client_1.OVSXApiFilter),
    __metadata("design:type", Object)
], VSXExtensionsModel.prototype, "vsxApiFilter", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VSXExtensionsModel.prototype, "init", null);
VSXExtensionsModel = __decorate([
    (0, inversify_1.injectable)()
], VSXExtensionsModel);
exports.VSXExtensionsModel = VSXExtensionsModel;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/vsx-registry/lib/browser/vsx-extensions-model'] = this;


/***/ }),

/***/ "../../packages/vsx-registry/lib/browser/vsx-extensions-search-bar.js":
/*!****************************************************************************!*\
  !*** ../../packages/vsx-registry/lib/browser/vsx-extensions-search-bar.js ***!
  \****************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2020 TypeFox and others.
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
exports.VSXExtensionsSearchBar = void 0;
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const widgets_1 = __webpack_require__(/*! @theia/core/lib/browser/widgets */ "../../packages/core/lib/browser/widgets/index.js");
const vsx_extensions_search_model_1 = __webpack_require__(/*! ./vsx-extensions-search-model */ "../../packages/vsx-registry/lib/browser/vsx-extensions-search-model.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
let VSXExtensionsSearchBar = class VSXExtensionsSearchBar extends widgets_1.ReactWidget {
    constructor() {
        super(...arguments);
        this.updateQuery = (e) => this.model.query = e.target.value;
    }
    init() {
        this.id = 'vsx-extensions-search-bar';
        this.addClass('theia-vsx-extensions-search-bar');
        this.model.onDidChangeQuery((query) => this.updateSearchTerm(query));
    }
    render() {
        return React.createElement("input", { type: 'text', ref: input => this.input = input || undefined, defaultValue: this.model.query, spellCheck: false, className: 'theia-input', placeholder: nls_1.nls.localize('theia/vsx-registry/searchPlaceholder', 'Search Extensions in {0}', 'Open VSX Registry'), onChange: this.updateQuery });
    }
    updateSearchTerm(term) {
        if (this.input) {
            this.input.value = term;
        }
    }
    onActivateRequest(msg) {
        super.onActivateRequest(msg);
        if (this.input) {
            this.input.focus();
        }
    }
    onAfterAttach(msg) {
        super.onAfterAttach(msg);
        this.update();
    }
};
__decorate([
    (0, inversify_1.inject)(vsx_extensions_search_model_1.VSXExtensionsSearchModel),
    __metadata("design:type", vsx_extensions_search_model_1.VSXExtensionsSearchModel)
], VSXExtensionsSearchBar.prototype, "model", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VSXExtensionsSearchBar.prototype, "init", null);
VSXExtensionsSearchBar = __decorate([
    (0, inversify_1.injectable)()
], VSXExtensionsSearchBar);
exports.VSXExtensionsSearchBar = VSXExtensionsSearchBar;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/vsx-registry/lib/browser/vsx-extensions-search-bar'] = this;


/***/ }),

/***/ "../../packages/vsx-registry/lib/browser/vsx-extensions-search-model.js":
/*!******************************************************************************!*\
  !*** ../../packages/vsx-registry/lib/browser/vsx-extensions-search-model.js ***!
  \******************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2020 TypeFox and others.
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
exports.VSXExtensionsSearchModel = exports.RECOMMENDED_QUERY = exports.INSTALLED_QUERY = exports.BUILTIN_QUERY = exports.VSXSearchMode = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const event_1 = __webpack_require__(/*! @theia/core/lib/common/event */ "../../packages/core/lib/common/event.js");
var VSXSearchMode;
(function (VSXSearchMode) {
    VSXSearchMode[VSXSearchMode["Initial"] = 0] = "Initial";
    VSXSearchMode[VSXSearchMode["None"] = 1] = "None";
    VSXSearchMode[VSXSearchMode["Search"] = 2] = "Search";
    VSXSearchMode[VSXSearchMode["Installed"] = 3] = "Installed";
    VSXSearchMode[VSXSearchMode["Builtin"] = 4] = "Builtin";
    VSXSearchMode[VSXSearchMode["Recommended"] = 5] = "Recommended";
})(VSXSearchMode = exports.VSXSearchMode || (exports.VSXSearchMode = {}));
exports.BUILTIN_QUERY = '@builtin';
exports.INSTALLED_QUERY = '@installed';
exports.RECOMMENDED_QUERY = '@recommended';
let VSXExtensionsSearchModel = class VSXExtensionsSearchModel {
    constructor() {
        this.onDidChangeQueryEmitter = new event_1.Emitter();
        this.onDidChangeQuery = this.onDidChangeQueryEmitter.event;
        this.specialQueries = new Map([
            [exports.BUILTIN_QUERY, VSXSearchMode.Builtin],
            [exports.INSTALLED_QUERY, VSXSearchMode.Installed],
            [exports.RECOMMENDED_QUERY, VSXSearchMode.Recommended],
        ]);
        this._query = '';
    }
    set query(query) {
        if (this._query === query) {
            return;
        }
        this._query = query;
        this.onDidChangeQueryEmitter.fire(this._query);
    }
    get query() {
        return this._query;
    }
    getModeForQuery() {
        var _a;
        return this.query
            ? (_a = this.specialQueries.get(this.query)) !== null && _a !== void 0 ? _a : VSXSearchMode.Search
            : VSXSearchMode.None;
    }
};
VSXExtensionsSearchModel = __decorate([
    (0, inversify_1.injectable)()
], VSXExtensionsSearchModel);
exports.VSXExtensionsSearchModel = VSXExtensionsSearchModel;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/vsx-registry/lib/browser/vsx-extensions-search-model'] = this;


/***/ }),

/***/ "../../packages/vsx-registry/lib/browser/vsx-extensions-source.js":
/*!************************************************************************!*\
  !*** ../../packages/vsx-registry/lib/browser/vsx-extensions-source.js ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2020 TypeFox and others.
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
exports.VSXExtensionsSource = exports.VSXExtensionsSourceOptions = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const source_tree_1 = __webpack_require__(/*! @theia/core/lib/browser/source-tree */ "../../packages/core/lib/browser/source-tree/index.js");
const vsx_extensions_model_1 = __webpack_require__(/*! ./vsx-extensions-model */ "../../packages/vsx-registry/lib/browser/vsx-extensions-model.js");
const debounce = __webpack_require__(/*! @theia/core/shared/lodash.debounce */ "../../packages/core/shared/lodash.debounce/index.js");
let VSXExtensionsSourceOptions = class VSXExtensionsSourceOptions {
};
VSXExtensionsSourceOptions.INSTALLED = 'installed';
VSXExtensionsSourceOptions.BUILT_IN = 'builtin';
VSXExtensionsSourceOptions.SEARCH_RESULT = 'searchResult';
VSXExtensionsSourceOptions.RECOMMENDED = 'recommended';
VSXExtensionsSourceOptions = __decorate([
    (0, inversify_1.injectable)()
], VSXExtensionsSourceOptions);
exports.VSXExtensionsSourceOptions = VSXExtensionsSourceOptions;
let VSXExtensionsSource = class VSXExtensionsSource extends source_tree_1.TreeSource {
    constructor() {
        super(...arguments);
        this.scheduleFireDidChange = debounce(() => this.fireDidChange(), 100, { leading: false, trailing: true });
    }
    init() {
        this.fireDidChange();
        this.toDispose.push(this.model.onDidChange(() => this.scheduleFireDidChange()));
    }
    getModel() {
        return this.model;
    }
    *getElements() {
        for (const id of this.doGetElements()) {
            const extension = this.model.getExtension(id);
            if (!extension) {
                continue;
            }
            if (this.options.id === VSXExtensionsSourceOptions.RECOMMENDED) {
                if (this.model.isInstalled(id)) {
                    continue;
                }
            }
            if (this.options.id === VSXExtensionsSourceOptions.BUILT_IN) {
                if (extension.builtin) {
                    yield extension;
                }
            }
            else if (!extension.builtin) {
                yield extension;
            }
        }
    }
    doGetElements() {
        if (this.options.id === VSXExtensionsSourceOptions.SEARCH_RESULT) {
            return this.model.searchResult;
        }
        if (this.options.id === VSXExtensionsSourceOptions.RECOMMENDED) {
            return this.model.recommended;
        }
        return this.model.installed;
    }
};
__decorate([
    (0, inversify_1.inject)(VSXExtensionsSourceOptions),
    __metadata("design:type", VSXExtensionsSourceOptions)
], VSXExtensionsSource.prototype, "options", void 0);
__decorate([
    (0, inversify_1.inject)(vsx_extensions_model_1.VSXExtensionsModel),
    __metadata("design:type", vsx_extensions_model_1.VSXExtensionsModel)
], VSXExtensionsSource.prototype, "model", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VSXExtensionsSource.prototype, "init", null);
VSXExtensionsSource = __decorate([
    (0, inversify_1.injectable)()
], VSXExtensionsSource);
exports.VSXExtensionsSource = VSXExtensionsSource;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/vsx-registry/lib/browser/vsx-extensions-source'] = this;


/***/ }),

/***/ "../../packages/vsx-registry/lib/browser/vsx-extensions-view-container.js":
/*!********************************************************************************!*\
  !*** ../../packages/vsx-registry/lib/browser/vsx-extensions-view-container.js ***!
  \********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/********************************************************************************
 * Copyright (C) 2020 TypeFox and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0
 *******************************************************************************‚*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var VSXExtensionsViewContainer_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VSXExtensionsViewContainer = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const vsx_extensions_search_bar_1 = __webpack_require__(/*! ./vsx-extensions-search-bar */ "../../packages/vsx-registry/lib/browser/vsx-extensions-search-bar.js");
const vsx_extensions_model_1 = __webpack_require__(/*! ./vsx-extensions-model */ "../../packages/vsx-registry/lib/browser/vsx-extensions-model.js");
const vsx_extensions_search_model_1 = __webpack_require__(/*! ./vsx-extensions-search-model */ "../../packages/vsx-registry/lib/browser/vsx-extensions-search-model.js");
const vsx_extensions_widget_1 = __webpack_require__(/*! ./vsx-extensions-widget */ "../../packages/vsx-registry/lib/browser/vsx-extensions-widget.js");
const vsx_extensions_source_1 = __webpack_require__(/*! ./vsx-extensions-source */ "../../packages/vsx-registry/lib/browser/vsx-extensions-source.js");
const vsx_extension_commands_1 = __webpack_require__(/*! ./vsx-extension-commands */ "../../packages/vsx-registry/lib/browser/vsx-extension-commands.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
let VSXExtensionsViewContainer = VSXExtensionsViewContainer_1 = class VSXExtensionsViewContainer extends browser_1.ViewContainer {
    constructor() {
        super(...arguments);
        this.disableDNDBetweenContainers = true;
        this.currentMode = vsx_extensions_search_model_1.VSXSearchMode.Initial;
        this.lastModeState = new Map();
    }
    init() {
        super.init();
        this.id = VSXExtensionsViewContainer_1.ID;
        this.addClass('theia-vsx-extensions-view-container');
        this.setTitleOptions({
            label: VSXExtensionsViewContainer_1.LABEL,
            iconClass: (0, browser_1.codicon)('extensions'),
            closeable: true
        });
    }
    onActivateRequest(msg) {
        this.searchBar.activate();
    }
    onAfterAttach(msg) {
        super.onBeforeAttach(msg);
        this.updateMode();
        this.toDisposeOnDetach.push(this.model.search.onDidChangeQuery(() => this.updateMode()));
    }
    configureLayout(layout) {
        layout.addWidget(this.searchBar);
        super.configureLayout(layout);
    }
    updateMode() {
        const currentMode = this.model.search.getModeForQuery();
        if (currentMode === this.currentMode) {
            return;
        }
        if (this.currentMode !== vsx_extensions_search_model_1.VSXSearchMode.Initial) {
            this.lastModeState.set(this.currentMode, super.doStoreState());
        }
        this.currentMode = currentMode;
        const lastState = this.lastModeState.get(currentMode);
        if (lastState) {
            super.doRestoreState(lastState);
        }
        else {
            for (const part of this.getParts()) {
                this.applyModeToPart(part);
            }
        }
        const specialWidgets = this.getWidgetsForMode();
        if (specialWidgets === null || specialWidgets === void 0 ? void 0 : specialWidgets.length) {
            const widgetChecker = new Set(specialWidgets);
            const relevantParts = this.getParts().filter(part => widgetChecker.has(part.wrapped.id));
            relevantParts.forEach(part => {
                part.collapsed = false;
                part.show();
            });
        }
    }
    registerPart(part) {
        super.registerPart(part);
        this.applyModeToPart(part);
    }
    applyModeToPart(part) {
        if (this.shouldShowWidget(part)) {
            part.show();
        }
        else {
            part.hide();
        }
    }
    shouldShowWidget(part) {
        const widgetsToShow = this.getWidgetsForMode();
        if (widgetsToShow.length) {
            return widgetsToShow.includes(part.wrapped.id);
        }
        return part.wrapped.id !== (0, vsx_extensions_widget_1.generateExtensionWidgetId)(vsx_extensions_source_1.VSXExtensionsSourceOptions.SEARCH_RESULT);
    }
    getWidgetsForMode() {
        switch (this.currentMode) {
            case vsx_extensions_search_model_1.VSXSearchMode.Builtin:
                return [(0, vsx_extensions_widget_1.generateExtensionWidgetId)(vsx_extensions_source_1.VSXExtensionsSourceOptions.BUILT_IN)];
            case vsx_extensions_search_model_1.VSXSearchMode.Installed:
                return [(0, vsx_extensions_widget_1.generateExtensionWidgetId)(vsx_extensions_source_1.VSXExtensionsSourceOptions.INSTALLED)];
            case vsx_extensions_search_model_1.VSXSearchMode.Recommended:
                return [(0, vsx_extensions_widget_1.generateExtensionWidgetId)(vsx_extensions_source_1.VSXExtensionsSourceOptions.RECOMMENDED)];
            case vsx_extensions_search_model_1.VSXSearchMode.Search:
                return [(0, vsx_extensions_widget_1.generateExtensionWidgetId)(vsx_extensions_source_1.VSXExtensionsSourceOptions.SEARCH_RESULT)];
            default:
                return [];
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    doStoreState() {
        const modes = {};
        for (const mode of this.lastModeState.keys()) {
            modes[mode] = this.lastModeState.get(mode);
        }
        return {
            query: this.model.search.query,
            modes
        };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    doRestoreState(state) {
        // eslint-disable-next-line guard-for-in
        for (const key in state.modes) {
            const mode = Number(key);
            const modeState = state.modes[mode];
            if (modeState) {
                this.lastModeState.set(mode, modeState);
            }
        }
        this.model.search.query = state.query;
    }
    updateToolbarItems(allParts) {
        super.updateToolbarItems(allParts);
        this.registerToolbarItem(vsx_extension_commands_1.VSXExtensionsCommands.INSTALL_FROM_VSIX.id, { tooltip: vsx_extension_commands_1.VSXExtensionsCommands.INSTALL_FROM_VSIX.label, group: 'other_1' });
        this.registerToolbarItem(vsx_extension_commands_1.VSXExtensionsCommands.CLEAR_ALL.id, { tooltip: vsx_extension_commands_1.VSXExtensionsCommands.CLEAR_ALL.label, priority: 1, onDidChange: this.model.onDidChange });
    }
    getToggleVisibilityGroupLabel() {
        return 'a/' + nls_1.nls.localizeByDefault('Views');
    }
};
VSXExtensionsViewContainer.ID = 'vsx-extensions-view-container';
VSXExtensionsViewContainer.LABEL = nls_1.nls.localizeByDefault('Extensions');
__decorate([
    (0, inversify_1.inject)(vsx_extensions_search_bar_1.VSXExtensionsSearchBar),
    __metadata("design:type", vsx_extensions_search_bar_1.VSXExtensionsSearchBar)
], VSXExtensionsViewContainer.prototype, "searchBar", void 0);
__decorate([
    (0, inversify_1.inject)(vsx_extensions_model_1.VSXExtensionsModel),
    __metadata("design:type", vsx_extensions_model_1.VSXExtensionsModel)
], VSXExtensionsViewContainer.prototype, "model", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VSXExtensionsViewContainer.prototype, "init", null);
VSXExtensionsViewContainer = VSXExtensionsViewContainer_1 = __decorate([
    (0, inversify_1.injectable)()
], VSXExtensionsViewContainer);
exports.VSXExtensionsViewContainer = VSXExtensionsViewContainer;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/vsx-registry/lib/browser/vsx-extensions-view-container'] = this;


/***/ }),

/***/ "../../packages/vsx-registry/lib/browser/vsx-extensions-widget.js":
/*!************************************************************************!*\
  !*** ../../packages/vsx-registry/lib/browser/vsx-extensions-widget.js ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2020 TypeFox and others.
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
var VSXExtensionsWidget_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VSXExtensionsWidget = exports.generateExtensionWidgetId = exports.VSXExtensionsWidgetOptions = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const source_tree_1 = __webpack_require__(/*! @theia/core/lib/browser/source-tree */ "../../packages/core/lib/browser/source-tree/index.js");
const vsx_extensions_source_1 = __webpack_require__(/*! ./vsx-extensions-source */ "../../packages/vsx-registry/lib/browser/vsx-extensions-source.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const alert_message_1 = __webpack_require__(/*! @theia/core/lib/browser/widgets/alert-message */ "../../packages/core/lib/browser/widgets/alert-message.js");
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
let VSXExtensionsWidgetOptions = class VSXExtensionsWidgetOptions extends vsx_extensions_source_1.VSXExtensionsSourceOptions {
};
VSXExtensionsWidgetOptions = __decorate([
    (0, inversify_1.injectable)()
], VSXExtensionsWidgetOptions);
exports.VSXExtensionsWidgetOptions = VSXExtensionsWidgetOptions;
const generateExtensionWidgetId = (widgetId) => VSXExtensionsWidget.ID + ':' + widgetId;
exports.generateExtensionWidgetId = generateExtensionWidgetId;
let VSXExtensionsWidget = VSXExtensionsWidget_1 = class VSXExtensionsWidget extends source_tree_1.SourceTreeWidget {
    constructor() {
        super(...arguments);
        this.onDidChangeBadgeEmitter = new common_1.Emitter();
        this.onDidChangeBadgeTooltipEmitter = new common_1.Emitter();
    }
    static createWidget(parent, options) {
        const child = source_tree_1.SourceTreeWidget.createContainer(parent, {
            virtualized: false,
            scrollIfActive: true
        });
        child.bind(vsx_extensions_source_1.VSXExtensionsSourceOptions).toConstantValue(options);
        child.bind(vsx_extensions_source_1.VSXExtensionsSource).toSelf();
        child.unbind(source_tree_1.SourceTreeWidget);
        child.bind(VSXExtensionsWidgetOptions).toConstantValue(options);
        child.bind(VSXExtensionsWidget_1).toSelf();
        return child.get(VSXExtensionsWidget_1);
    }
    init() {
        var _a;
        super.init();
        this.addClass('theia-vsx-extensions');
        this.id = (0, exports.generateExtensionWidgetId)(this.options.id);
        this.toDispose.push(this.extensionsSource);
        this.source = this.extensionsSource;
        const title = (_a = this.options.title) !== null && _a !== void 0 ? _a : this.computeTitle();
        this.title.label = title;
        this.title.caption = title;
        this.toDispose.push(this.source.onDidChange(async () => {
            this.badge = await this.resolveCount();
        }));
    }
    get onDidChangeBadge() {
        return this.onDidChangeBadgeEmitter.event;
    }
    get badge() {
        return this._badge;
    }
    set badge(count) {
        this._badge = count;
        this.onDidChangeBadgeEmitter.fire();
    }
    get onDidChangeBadgeTooltip() {
        return this.onDidChangeBadgeTooltipEmitter.event;
    }
    get badgeTooltip() {
        return this._badgeTooltip;
    }
    set badgeTooltip(tooltip) {
        this._badgeTooltip = tooltip;
        this.onDidChangeBadgeTooltipEmitter.fire();
    }
    computeTitle() {
        switch (this.options.id) {
            case vsx_extensions_source_1.VSXExtensionsSourceOptions.INSTALLED:
                return nls_1.nls.localizeByDefault('Installed');
            case vsx_extensions_source_1.VSXExtensionsSourceOptions.BUILT_IN:
                return nls_1.nls.localizeByDefault('Built-in');
            case vsx_extensions_source_1.VSXExtensionsSourceOptions.RECOMMENDED:
                return nls_1.nls.localizeByDefault('Recommended');
            case vsx_extensions_source_1.VSXExtensionsSourceOptions.SEARCH_RESULT:
                return 'Open VSX Registry';
            default:
                return '';
        }
    }
    async resolveCount() {
        var _a;
        if (this.options.id !== vsx_extensions_source_1.VSXExtensionsSourceOptions.SEARCH_RESULT) {
            const elements = await ((_a = this.source) === null || _a === void 0 ? void 0 : _a.getElements()) || [];
            return [...elements].length;
        }
        return undefined;
    }
    tapNode(node) {
        super.tapNode(node);
        this.model.openNode(node);
    }
    handleDblClickEvent() {
        // Don't open the editor view on a double click.
    }
    renderTree(model) {
        if (this.options.id === vsx_extensions_source_1.VSXExtensionsSourceOptions.SEARCH_RESULT) {
            const searchError = this.extensionsSource.getModel().searchError;
            if (!!searchError) {
                const message = nls_1.nls.localize('theia/vsx-registry/errorFetching', 'Error fetching extensions.');
                const configurationHint = nls_1.nls.localize('theia/vsx-registry/errorFetchingConfigurationHint', 'This could be caused by network configuration issues.');
                const hint = searchError.includes('ENOTFOUND') ? configurationHint : '';
                return React.createElement(alert_message_1.AlertMessage, { type: 'ERROR', header: `${message} ${searchError} ${hint}` });
            }
        }
        return super.renderTree(model);
    }
};
VSXExtensionsWidget.ID = 'vsx-extensions';
__decorate([
    (0, inversify_1.inject)(VSXExtensionsWidgetOptions),
    __metadata("design:type", VSXExtensionsWidgetOptions)
], VSXExtensionsWidget.prototype, "options", void 0);
__decorate([
    (0, inversify_1.inject)(vsx_extensions_source_1.VSXExtensionsSource),
    __metadata("design:type", vsx_extensions_source_1.VSXExtensionsSource)
], VSXExtensionsWidget.prototype, "extensionsSource", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VSXExtensionsWidget.prototype, "init", null);
VSXExtensionsWidget = VSXExtensionsWidget_1 = __decorate([
    (0, inversify_1.injectable)()
], VSXExtensionsWidget);
exports.VSXExtensionsWidget = VSXExtensionsWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/vsx-registry/lib/browser/vsx-extensions-widget'] = this;


/***/ }),

/***/ "../../packages/vsx-registry/lib/browser/vsx-language-quick-pick-service.js":
/*!**********************************************************************************!*\
  !*** ../../packages/vsx-registry/lib/browser/vsx-language-quick-pick-service.js ***!
  \**********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VSXLanguageQuickPickService = void 0;
const language_quick_pick_service_1 = __webpack_require__(/*! @theia/core/lib/browser/i18n/language-quick-pick-service */ "../../packages/core/lib/browser/i18n/language-quick-pick-service.js");
const request_1 = __webpack_require__(/*! @theia/core/shared/@theia/request */ "../../packages/core/shared/@theia/request/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const plugin_ext_1 = __webpack_require__(/*! @theia/plugin-ext */ "../../packages/plugin-ext/lib/common/index.js");
const ovsx_client_provider_1 = __webpack_require__(/*! ../common/ovsx-client-provider */ "../../packages/vsx-registry/lib/common/ovsx-client-provider.js");
const plugin_vscode_uri_1 = __webpack_require__(/*! @theia/plugin-ext-vscode/lib/common/plugin-vscode-uri */ "../../packages/plugin-ext-vscode/lib/common/plugin-vscode-uri.js");
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

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/vsx-registry/lib/browser/vsx-language-quick-pick-service'] = this;


/***/ }),

/***/ "../../packages/vsx-registry/lib/browser/vsx-registry-frontend-module.js":
/*!*******************************************************************************!*\
  !*** ../../packages/vsx-registry/lib/browser/vsx-registry-frontend-module.js ***!
  \*******************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2020 TypeFox and others.
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
__webpack_require__(/*! ../../src/browser/style/index.css */ "../../packages/vsx-registry/src/browser/style/index.css");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const vsx_extensions_view_container_1 = __webpack_require__(/*! ./vsx-extensions-view-container */ "../../packages/vsx-registry/lib/browser/vsx-extensions-view-container.js");
const vsx_extensions_contribution_1 = __webpack_require__(/*! ./vsx-extensions-contribution */ "../../packages/vsx-registry/lib/browser/vsx-extensions-contribution.js");
const vsx_extensions_search_bar_1 = __webpack_require__(/*! ./vsx-extensions-search-bar */ "../../packages/vsx-registry/lib/browser/vsx-extensions-search-bar.js");
const vsx_extensions_model_1 = __webpack_require__(/*! ./vsx-extensions-model */ "../../packages/vsx-registry/lib/browser/vsx-extensions-model.js");
const color_application_contribution_1 = __webpack_require__(/*! @theia/core/lib/browser/color-application-contribution */ "../../packages/core/lib/browser/color-application-contribution.js");
const vsx_extensions_widget_1 = __webpack_require__(/*! ./vsx-extensions-widget */ "../../packages/vsx-registry/lib/browser/vsx-extensions-widget.js");
const vsx_extension_1 = __webpack_require__(/*! ./vsx-extension */ "../../packages/vsx-registry/lib/browser/vsx-extension.js");
const vsx_extension_editor_1 = __webpack_require__(/*! ./vsx-extension-editor */ "../../packages/vsx-registry/lib/browser/vsx-extension-editor.js");
const vsx_extension_editor_manager_1 = __webpack_require__(/*! ./vsx-extension-editor-manager */ "../../packages/vsx-registry/lib/browser/vsx-extension-editor-manager.js");
const vsx_extensions_source_1 = __webpack_require__(/*! ./vsx-extensions-source */ "../../packages/vsx-registry/lib/browser/vsx-extensions-source.js");
const vsx_extensions_search_model_1 = __webpack_require__(/*! ./vsx-extensions-search-model */ "../../packages/vsx-registry/lib/browser/vsx-extensions-search-model.js");
const recommended_extensions_preference_contribution_1 = __webpack_require__(/*! ./recommended-extensions/recommended-extensions-preference-contribution */ "../../packages/vsx-registry/lib/browser/recommended-extensions/recommended-extensions-preference-contribution.js");
const preference_provider_overrides_1 = __webpack_require__(/*! ./recommended-extensions/preference-provider-overrides */ "../../packages/vsx-registry/lib/browser/recommended-extensions/preference-provider-overrides.js");
const vsx_environment_1 = __webpack_require__(/*! ../common/vsx-environment */ "../../packages/vsx-registry/lib/common/vsx-environment.js");
const language_quick_pick_service_1 = __webpack_require__(/*! @theia/core/lib/browser/i18n/language-quick-pick-service */ "../../packages/core/lib/browser/i18n/language-quick-pick-service.js");
const vsx_language_quick_pick_service_1 = __webpack_require__(/*! ./vsx-language-quick-pick-service */ "../../packages/vsx-registry/lib/browser/vsx-language-quick-pick-service.js");
exports["default"] = new inversify_1.ContainerModule((bind, unbind, isBound, rebind) => {
    bind(vsx_environment_1.VSXEnvironment)
        .toDynamicValue(ctx => browser_1.WebSocketConnectionProvider.createProxy(ctx.container, vsx_environment_1.VSX_ENVIRONMENT_PATH))
        .inSingletonScope();
    bind(vsx_extension_1.VSXExtension).toSelf();
    bind(vsx_extension_1.VSXExtensionFactory).toFactory(ctx => (option) => {
        const child = ctx.container.createChild();
        child.bind(vsx_extension_1.VSXExtensionOptions).toConstantValue(option);
        return child.get(vsx_extension_1.VSXExtension);
    });
    bind(vsx_extensions_model_1.VSXExtensionsModel).toSelf().inSingletonScope();
    bind(vsx_extension_editor_1.VSXExtensionEditor).toSelf();
    bind(browser_1.WidgetFactory).toDynamicValue(ctx => ({
        id: vsx_extension_editor_1.VSXExtensionEditor.ID,
        createWidget: async (options) => {
            const extension = await ctx.container.get(vsx_extensions_model_1.VSXExtensionsModel).resolve(options.id);
            const child = ctx.container.createChild();
            child.bind(vsx_extension_1.VSXExtension).toConstantValue(extension);
            return child.get(vsx_extension_editor_1.VSXExtensionEditor);
        }
    })).inSingletonScope();
    bind(vsx_extension_editor_manager_1.VSXExtensionEditorManager).toSelf().inSingletonScope();
    bind(browser_1.OpenHandler).toService(vsx_extension_editor_manager_1.VSXExtensionEditorManager);
    bind(browser_1.WidgetFactory).toDynamicValue(({ container }) => ({
        id: vsx_extensions_widget_1.VSXExtensionsWidget.ID,
        createWidget: async (options) => vsx_extensions_widget_1.VSXExtensionsWidget.createWidget(container, options)
    })).inSingletonScope();
    bind(browser_1.WidgetFactory).toDynamicValue(ctx => ({
        id: vsx_extensions_view_container_1.VSXExtensionsViewContainer.ID,
        createWidget: async () => {
            const child = ctx.container.createChild();
            child.bind(browser_1.ViewContainerIdentifier).toConstantValue({
                id: vsx_extensions_view_container_1.VSXExtensionsViewContainer.ID,
                progressLocationId: 'extensions'
            });
            child.bind(vsx_extensions_view_container_1.VSXExtensionsViewContainer).toSelf();
            const viewContainer = child.get(vsx_extensions_view_container_1.VSXExtensionsViewContainer);
            const widgetManager = child.get(browser_1.WidgetManager);
            for (const id of [
                vsx_extensions_source_1.VSXExtensionsSourceOptions.SEARCH_RESULT,
                vsx_extensions_source_1.VSXExtensionsSourceOptions.RECOMMENDED,
                vsx_extensions_source_1.VSXExtensionsSourceOptions.INSTALLED,
                vsx_extensions_source_1.VSXExtensionsSourceOptions.BUILT_IN,
            ]) {
                const widget = await widgetManager.getOrCreateWidget(vsx_extensions_widget_1.VSXExtensionsWidget.ID, { id });
                viewContainer.addWidget(widget, {
                    initiallyCollapsed: id === vsx_extensions_source_1.VSXExtensionsSourceOptions.BUILT_IN
                });
            }
            return viewContainer;
        }
    })).inSingletonScope();
    bind(vsx_extensions_search_model_1.VSXExtensionsSearchModel).toSelf().inSingletonScope();
    bind(vsx_extensions_search_bar_1.VSXExtensionsSearchBar).toSelf().inSingletonScope();
    rebind(language_quick_pick_service_1.LanguageQuickPickService).to(vsx_language_quick_pick_service_1.VSXLanguageQuickPickService).inSingletonScope();
    (0, browser_1.bindViewContribution)(bind, vsx_extensions_contribution_1.VSXExtensionsContribution);
    bind(browser_1.FrontendApplicationContribution).toService(vsx_extensions_contribution_1.VSXExtensionsContribution);
    bind(color_application_contribution_1.ColorContribution).toService(vsx_extensions_contribution_1.VSXExtensionsContribution);
    (0, recommended_extensions_preference_contribution_1.bindExtensionPreferences)(bind);
    (0, preference_provider_overrides_1.bindPreferenceProviderOverrides)(bind, unbind);
});

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/vsx-registry/lib/browser/vsx-registry-frontend-module'] = this;


/***/ }),

/***/ "../../node_modules/css-loader/dist/cjs.js!../../packages/vsx-registry/src/browser/style/index.css":
/*!*********************************************************************************************************!*\
  !*** ../../node_modules/css-loader/dist/cjs.js!../../packages/vsx-registry/src/browser/style/index.css ***!
  \*********************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "../../node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/api.js */ "../../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/getUrl.js */ "../../node_modules/css-loader/dist/runtime/getUrl.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
// Imports



var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(/*! defaultIcon.png */ "../../packages/vsx-registry/src/browser/style/defaultIcon.png"), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/********************************************************************************
 * Copyright (C) 2020 TypeFox and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0
 ********************************************************************************/

:root {
  --theia-vsx-extension-icon-size: calc(var(--theia-ui-icon-font-size) * 3);
  --theia-vsx-extension-editor-icon-size: calc(
    var(--theia-vsx-extension-icon-size) * 3
  );
}

.theia-vsx-extensions {
  height: 100%;
}

.theia-vsx-extension,
.theia-vsx-extensions-view-container .part > .body {
  min-height: calc(var(--theia-content-line-height) * 3);
}

.theia-vsx-extensions-search-bar {
  padding: var(--theia-ui-padding) var(--theia-scrollbar-width)
    var(--theia-ui-padding) 18px
    /* expansion toggle padding of tree elements in result list */;
  display: flex;
  align-content: center;
}

.theia-vsx-extensions-search-bar .theia-input {
  overflow: hidden;
  line-height: var(--theia-content-line-height);
  flex: 1;
  padding-top: calc(var(--theia-ui-padding) / 2);
  padding-bottom: calc(var(--theia-ui-padding) / 2);
}

.theia-vsx-extension {
  display: flex;
  flex-direction: row;
  line-height: calc(var(--theia-content-line-height) * 17 / 22);
  align-items: center;
}

.theia-vsx-extension-icon {
  height: var(--theia-vsx-extension-icon-size);
  width: var(--theia-vsx-extension-icon-size);
  align-self: center;
  padding-right: calc(var(--theia-ui-padding) * 2.5);
  flex-shrink: 0;
  object-fit: contain;
}

.theia-vsx-extension-icon.placeholder {
  background-size: var(--theia-vsx-extension-icon-size);
  background-repeat: no-repeat;
  background-image: url(${___CSS_LOADER_URL_REPLACEMENT_0___});
}

.theia-vsx-extension-content {
  display: flex;
  flex-direction: column;
  width: calc(
    100% - var(--theia-vsx-extension-icon-size) - var(--theia-ui-padding) * 2.5
  );
}

.theia-vsx-extension-content .title {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  white-space: nowrap;
}

.theia-vsx-extension-content .title .name {
  font-weight: bold;
}

.theia-vsx-extension-content .title .version,
.theia-vsx-extension-content .title .stat {
  opacity: 0.85;
  font-size: 80%;
}

.theia-vsx-extension-content .title .stat .codicon {
  font-size: 110%;
}

.theia-vsx-extension-content .title .stat .download-count,
.theia-vsx-extension-content .title .stat .average-rating {
  display: inline-flex;
  align-items: center;
}

.theia-vsx-extension-content .title .stat .average-rating > i {
  color: #ff8e00;
}

.theia-vsx-extension-editor .download-count > i,
.theia-vsx-extension-content .title .stat .average-rating > i,
.theia-vsx-extension-content .title .stat .download-count > i {
  padding-right: calc(var(--theia-ui-padding) / 2);
}

.theia-vsx-extension-content .title .stat .average-rating,
.theia-vsx-extension-content .title .stat .download-count {
  padding-left: var(--theia-ui-padding);
}

.theia-vsx-extension-description {
  padding-right: calc(var(--theia-ui-padding) * 2);
}

.theia-vsx-extension-publisher {
  font-weight: 600;
  font-size: 90%;
}

.theia-vsx-extension-action-bar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  white-space: nowrap;
}

.theia-vsx-extension-action-bar .action {
  font-size: 90%;
  min-width: auto !important;
  padding: 2px var(--theia-ui-padding) !important;
  margin-top: 2px;
  vertical-align: middle;
}

/* Editor Section */

.theia-vsx-extension-editor {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding-top: 0;
  position: relative;
}

.theia-vsx-extension-editor .header {
  display: flex;
  padding: calc(var(--theia-ui-padding) * 3) calc(var(--theia-ui-padding) * 3)
    calc(var(--theia-ui-padding) * 3);
  flex-shrink: 0;
  border-bottom: 1px solid hsla(0, 0%, 50%, 0.5);
  width: 100%;
  background: var(--theia-editor-background);
}

.theia-vsx-extension-editor .scroll-container {
  position: relative;
  padding-top: 0;
  max-width: 100%;
  width: 100%;
}

.theia-vsx-extension-editor .body {
  flex: 1;
  padding: calc(var(--theia-ui-padding) * 2);
  padding-top: 0;
  max-width: 1000px;
  margin: 0 auto;
  line-height: 22px;
}

.theia-vsx-extension-editor .body h1 {
  padding-bottom: var(--theia-ui-padding);
  border-bottom: 1px solid hsla(0, 0%, 50%, 0.5);
  margin-top: calc(var(--theia-ui-padding) * 5);
}

.theia-vsx-extension-editor .body a {
  text-decoration: none;
}

.theia-vsx-extension-editor .body a:hover {
  text-decoration: underline;
}

.theia-vsx-extension-editor .body table {
  border-collapse: collapse;
}

.theia-vsx-extension-editor .body table > thead > tr > th {
  text-align: left;
  border-bottom: 1px solid var(--theia-extensionEditor-tableHeadBorder);
}

.theia-vsx-extension-editor .body table > thead > tr > th,
.theia-vsx-extension-editor .body table > thead > tr > td,
.theia-vsx-extension-editor .body table > tbody > tr > th,
.theia-vsx-extension-editor .body table > tbody > tr > td {
  padding: 5px 10px;
}

.theia-vsx-extension-editor .body table > tbody > tr + tr > td {
  border-top: 1px solid var(--theia-extensionEditor-tableCellBorder);
}

.theia-vsx-extension-editor .scroll-container .body pre {
  white-space: normal;
}

.theia-vsx-extension-editor .body img {
  max-width: 100%;
}

.theia-vsx-extension-editor .header .icon-container {
  height: var(--theia-vsx-extension-editor-icon-size);
  width: var(--theia-vsx-extension-editor-icon-size);
  align-self: center;
  padding-right: calc(var(--theia-ui-padding) * 2.5);
  flex-shrink: 0;
  object-fit: contain;
}

.theia-vsx-extension-editor .header .icon-container.placeholder {
  background-size: var(--theia-vsx-extension-editor-icon-size);
  background-repeat: no-repeat;
  background-image: url(${___CSS_LOADER_URL_REPLACEMENT_0___});
}

.theia-vsx-extension-editor .header .details {
  overflow: hidden;
  user-select: text;
  -webkit-user-select: text;
}

.theia-vsx-extension-editor .header .details .title,
.theia-vsx-extension-editor .header .details .subtitle {
  display: flex;
  align-items: center;
}

.theia-vsx-extension-editor .header .details .title .name {
  flex: 0;
  font-size: calc(var(--theia-ui-font-size1) * 2);
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
}

.theia-vsx-extension-editor .header .details .title .identifier {
  margin-left: calc(var(--theia-ui-padding) * 5 / 3);
  opacity: 0.6;
  background: hsla(0, 0%, 68%, 0.31);
  user-select: text;
  -webkit-user-select: text;
  white-space: nowrap;
}

.theia-vsx-extension-editor .header .details .title .preview {
  background: #d63f26;
}

.vs .theia-vsx-extension-editor .header .details .title .preview {
  color: white;
}

.theia-vsx-extension-editor .header .details .title .identifier,
.theia-vsx-extension-editor .header .details .title .preview,
.theia-vsx-extension-editor .header .details .title .builtin {
  line-height: var(--theia-code-line-height);
}

.theia-vsx-extension-editor .header .details .title .identifier,
.theia-vsx-extension-editor .header .details .title .preview {
  padding: calc(var(--theia-ui-padding) * 2 / 3);
  padding-top: 0px;
  padding-bottom: 0px;
  border-radius: calc(var(--theia-ui-padding) * 2 / 3);
}

.theia-vsx-extension-editor .header .details .title .preview,
.theia-vsx-extension-editor .header .details .title .builtin {
  font-size: var(--theia-ui-font-size0);
  font-style: italic;
  margin-left: calc(var(--theia-ui-padding) * 5 / 3);
}

.theia-vsx-extension-editor .header .details .subtitle {
  padding-top: var(--theia-ui-padding);
  white-space: nowrap;
}

.theia-vsx-extension-editor .header .details .subtitle > span {
  display: flex;
  align-items: center;
  cursor: pointer;
  line-height: var(--theia-content-line-height);
  height: var(--theia-content-line-height);
}

.theia-vsx-extension-editor
  .header
  .details
  .subtitle
  > span:not(:first-child):not(:empty) {
  border-left: 1px solid hsla(0, 0%, 50%, 0.7);
  padding-left: calc(var(--theia-ui-padding) * 2);
  margin-left: calc(var(--theia-ui-padding) * 2);
  font-weight: 500;
}

.theia-vsx-extension-editor .header .details .subtitle .publisher {
  font-size: var(--theia-ui-font-size3);
}

.theia-vsx-extension-editor
  .header
  .details
  .subtitle
  .publisher
  .namespace-access,
.theia-vsx-extension-editor .header .details .subtitle .download-count::before {
  padding-right: var(--theia-ui-padding);
}

.theia-vsx-extension-editor .header .details .subtitle .average-rating > i {
  color: #ff8e00;
}

.theia-vsx-extension-editor
  .header
  .details
  .subtitle
  .average-rating
  > i:not(:first-child) {
  padding-left: calc(var(--theia-ui-padding) / 2);
}

.theia-vsx-extension-editor .header .details .description {
  margin-top: calc(var(--theia-ui-padding) * 5 / 3);
}

.theia-vsx-extension-editor .action {
  font-weight: 600;
  margin-top: calc(var(--theia-ui-padding) * 5 / 3);
  margin-left: 0px;
  padding: 1px var(--theia-ui-padding);
  vertical-align: middle;
}

/** Theming */

.theia-vsx-extension-editor .action.prominent,
.theia-vsx-extension-action-bar .action.prominent {
  color: var(--theia-extensionButton-prominentForeground);
  background-color: var(--theia-extensionButton-prominentBackground);
}

.theia-vsx-extension-editor .action.prominent:hover,
.theia-vsx-extension-action-bar .action.prominent:hover {
  background-color: var(--theia-extensionButton-prominentHoverBackground);
}
`, "",{"version":3,"sources":["webpack://./../../packages/vsx-registry/src/browser/style/index.css"],"names":[],"mappings":"AAAA;;;;;;;;;;;;;;iFAciF;;AAEjF;EACE,yEAAyE;EACzE;;GAEC;AACH;;AAEA;EACE,YAAY;AACd;;AAEA;;EAEE,sDAAsD;AACxD;;AAEA;EACE;;kEAEgE;EAChE,aAAa;EACb,qBAAqB;AACvB;;AAEA;EACE,gBAAgB;EAChB,6CAA6C;EAC7C,OAAO;EACP,8CAA8C;EAC9C,iDAAiD;AACnD;;AAEA;EACE,aAAa;EACb,mBAAmB;EACnB,6DAA6D;EAC7D,mBAAmB;AACrB;;AAEA;EACE,4CAA4C;EAC5C,2CAA2C;EAC3C,kBAAkB;EAClB,kDAAkD;EAClD,cAAc;EACd,mBAAmB;AACrB;;AAEA;EACE,qDAAqD;EACrD,4BAA4B;EAC5B,yDAAwC;AAC1C;;AAEA;EACE,aAAa;EACb,sBAAsB;EACtB;;GAEC;AACH;;AAEA;EACE,aAAa;EACb,mBAAmB;EACnB,8BAA8B;EAC9B,mBAAmB;EACnB,mBAAmB;AACrB;;AAEA;EACE,iBAAiB;AACnB;;AAEA;;EAEE,aAAa;EACb,cAAc;AAChB;;AAEA;EACE,eAAe;AACjB;;AAEA;;EAEE,oBAAoB;EACpB,mBAAmB;AACrB;;AAEA;EACE,cAAc;AAChB;;AAEA;;;EAGE,gDAAgD;AAClD;;AAEA;;EAEE,qCAAqC;AACvC;;AAEA;EACE,gDAAgD;AAClD;;AAEA;EACE,gBAAgB;EAChB,cAAc;AAChB;;AAEA;EACE,aAAa;EACb,mBAAmB;EACnB,8BAA8B;EAC9B,mBAAmB;EACnB,mBAAmB;AACrB;;AAEA;EACE,cAAc;EACd,0BAA0B;EAC1B,+CAA+C;EAC/C,eAAe;EACf,sBAAsB;AACxB;;AAEA,mBAAmB;;AAEnB;EACE,YAAY;EACZ,gBAAgB;EAChB,aAAa;EACb,sBAAsB;EACtB,cAAc;EACd,kBAAkB;AACpB;;AAEA;EACE,aAAa;EACb;qCACmC;EACnC,cAAc;EACd,8CAA8C;EAC9C,WAAW;EACX,0CAA0C;AAC5C;;AAEA;EACE,kBAAkB;EAClB,cAAc;EACd,eAAe;EACf,WAAW;AACb;;AAEA;EACE,OAAO;EACP,0CAA0C;EAC1C,cAAc;EACd,iBAAiB;EACjB,cAAc;EACd,iBAAiB;AACnB;;AAEA;EACE,uCAAuC;EACvC,8CAA8C;EAC9C,6CAA6C;AAC/C;;AAEA;EACE,qBAAqB;AACvB;;AAEA;EACE,0BAA0B;AAC5B;;AAEA;EACE,yBAAyB;AAC3B;;AAEA;EACE,gBAAgB;EAChB,qEAAqE;AACvE;;AAEA;;;;EAIE,iBAAiB;AACnB;;AAEA;EACE,kEAAkE;AACpE;;AAEA;EACE,mBAAmB;AACrB;;AAEA;EACE,eAAe;AACjB;;AAEA;EACE,mDAAmD;EACnD,kDAAkD;EAClD,kBAAkB;EAClB,kDAAkD;EAClD,cAAc;EACd,mBAAmB;AACrB;;AAEA;EACE,4DAA4D;EAC5D,4BAA4B;EAC5B,yDAAwC;AAC1C;;AAEA;EACE,gBAAgB;EAChB,iBAAiB;EACjB,yBAAyB;AAC3B;;AAEA;;EAEE,aAAa;EACb,mBAAmB;AACrB;;AAEA;EACE,OAAO;EACP,+CAA+C;EAC/C,gBAAgB;EAChB,mBAAmB;EACnB,eAAe;AACjB;;AAEA;EACE,kDAAkD;EAClD,YAAY;EACZ,kCAAkC;EAClC,iBAAiB;EACjB,yBAAyB;EACzB,mBAAmB;AACrB;;AAEA;EACE,mBAAmB;AACrB;;AAEA;EACE,YAAY;AACd;;AAEA;;;EAGE,0CAA0C;AAC5C;;AAEA;;EAEE,8CAA8C;EAC9C,gBAAgB;EAChB,mBAAmB;EACnB,oDAAoD;AACtD;;AAEA;;EAEE,qCAAqC;EACrC,kBAAkB;EAClB,kDAAkD;AACpD;;AAEA;EACE,oCAAoC;EACpC,mBAAmB;AACrB;;AAEA;EACE,aAAa;EACb,mBAAmB;EACnB,eAAe;EACf,6CAA6C;EAC7C,wCAAwC;AAC1C;;AAEA;;;;;EAKE,4CAA4C;EAC5C,+CAA+C;EAC/C,8CAA8C;EAC9C,gBAAgB;AAClB;;AAEA;EACE,qCAAqC;AACvC;;AAEA;;;;;;;EAOE,sCAAsC;AACxC;;AAEA;EACE,cAAc;AAChB;;AAEA;;;;;;EAME,+CAA+C;AACjD;;AAEA;EACE,iDAAiD;AACnD;;AAEA;EACE,gBAAgB;EAChB,iDAAiD;EACjD,gBAAgB;EAChB,oCAAoC;EACpC,sBAAsB;AACxB;;AAEA,aAAa;;AAEb;;EAEE,uDAAuD;EACvD,kEAAkE;AACpE;;AAEA;;EAEE,uEAAuE;AACzE","sourcesContent":["/********************************************************************************\n * Copyright (C) 2020 TypeFox and others.\n *\n * This program and the accompanying materials are made available under the\n * terms of the Eclipse Public License v. 2.0 which is available at\n * http://www.eclipse.org/legal/epl-2.0.\n *\n * This Source Code may also be made available under the following Secondary\n * Licenses when the conditions for such availability set forth in the Eclipse\n * Public License v. 2.0 are satisfied: GNU General Public License, version 2\n * with the GNU Classpath Exception which is available at\n * https://www.gnu.org/software/classpath/license.html.\n *\n * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0\n ********************************************************************************/\n\n:root {\n  --theia-vsx-extension-icon-size: calc(var(--theia-ui-icon-font-size) * 3);\n  --theia-vsx-extension-editor-icon-size: calc(\n    var(--theia-vsx-extension-icon-size) * 3\n  );\n}\n\n.theia-vsx-extensions {\n  height: 100%;\n}\n\n.theia-vsx-extension,\n.theia-vsx-extensions-view-container .part > .body {\n  min-height: calc(var(--theia-content-line-height) * 3);\n}\n\n.theia-vsx-extensions-search-bar {\n  padding: var(--theia-ui-padding) var(--theia-scrollbar-width)\n    var(--theia-ui-padding) 18px\n    /* expansion toggle padding of tree elements in result list */;\n  display: flex;\n  align-content: center;\n}\n\n.theia-vsx-extensions-search-bar .theia-input {\n  overflow: hidden;\n  line-height: var(--theia-content-line-height);\n  flex: 1;\n  padding-top: calc(var(--theia-ui-padding) / 2);\n  padding-bottom: calc(var(--theia-ui-padding) / 2);\n}\n\n.theia-vsx-extension {\n  display: flex;\n  flex-direction: row;\n  line-height: calc(var(--theia-content-line-height) * 17 / 22);\n  align-items: center;\n}\n\n.theia-vsx-extension-icon {\n  height: var(--theia-vsx-extension-icon-size);\n  width: var(--theia-vsx-extension-icon-size);\n  align-self: center;\n  padding-right: calc(var(--theia-ui-padding) * 2.5);\n  flex-shrink: 0;\n  object-fit: contain;\n}\n\n.theia-vsx-extension-icon.placeholder {\n  background-size: var(--theia-vsx-extension-icon-size);\n  background-repeat: no-repeat;\n  background-image: url(\"defaultIcon.png\");\n}\n\n.theia-vsx-extension-content {\n  display: flex;\n  flex-direction: column;\n  width: calc(\n    100% - var(--theia-vsx-extension-icon-size) - var(--theia-ui-padding) * 2.5\n  );\n}\n\n.theia-vsx-extension-content .title {\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n  align-items: center;\n  white-space: nowrap;\n}\n\n.theia-vsx-extension-content .title .name {\n  font-weight: bold;\n}\n\n.theia-vsx-extension-content .title .version,\n.theia-vsx-extension-content .title .stat {\n  opacity: 0.85;\n  font-size: 80%;\n}\n\n.theia-vsx-extension-content .title .stat .codicon {\n  font-size: 110%;\n}\n\n.theia-vsx-extension-content .title .stat .download-count,\n.theia-vsx-extension-content .title .stat .average-rating {\n  display: inline-flex;\n  align-items: center;\n}\n\n.theia-vsx-extension-content .title .stat .average-rating > i {\n  color: #ff8e00;\n}\n\n.theia-vsx-extension-editor .download-count > i,\n.theia-vsx-extension-content .title .stat .average-rating > i,\n.theia-vsx-extension-content .title .stat .download-count > i {\n  padding-right: calc(var(--theia-ui-padding) / 2);\n}\n\n.theia-vsx-extension-content .title .stat .average-rating,\n.theia-vsx-extension-content .title .stat .download-count {\n  padding-left: var(--theia-ui-padding);\n}\n\n.theia-vsx-extension-description {\n  padding-right: calc(var(--theia-ui-padding) * 2);\n}\n\n.theia-vsx-extension-publisher {\n  font-weight: 600;\n  font-size: 90%;\n}\n\n.theia-vsx-extension-action-bar {\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n  align-items: center;\n  white-space: nowrap;\n}\n\n.theia-vsx-extension-action-bar .action {\n  font-size: 90%;\n  min-width: auto !important;\n  padding: 2px var(--theia-ui-padding) !important;\n  margin-top: 2px;\n  vertical-align: middle;\n}\n\n/* Editor Section */\n\n.theia-vsx-extension-editor {\n  height: 100%;\n  overflow: hidden;\n  display: flex;\n  flex-direction: column;\n  padding-top: 0;\n  position: relative;\n}\n\n.theia-vsx-extension-editor .header {\n  display: flex;\n  padding: calc(var(--theia-ui-padding) * 3) calc(var(--theia-ui-padding) * 3)\n    calc(var(--theia-ui-padding) * 3);\n  flex-shrink: 0;\n  border-bottom: 1px solid hsla(0, 0%, 50%, 0.5);\n  width: 100%;\n  background: var(--theia-editor-background);\n}\n\n.theia-vsx-extension-editor .scroll-container {\n  position: relative;\n  padding-top: 0;\n  max-width: 100%;\n  width: 100%;\n}\n\n.theia-vsx-extension-editor .body {\n  flex: 1;\n  padding: calc(var(--theia-ui-padding) * 2);\n  padding-top: 0;\n  max-width: 1000px;\n  margin: 0 auto;\n  line-height: 22px;\n}\n\n.theia-vsx-extension-editor .body h1 {\n  padding-bottom: var(--theia-ui-padding);\n  border-bottom: 1px solid hsla(0, 0%, 50%, 0.5);\n  margin-top: calc(var(--theia-ui-padding) * 5);\n}\n\n.theia-vsx-extension-editor .body a {\n  text-decoration: none;\n}\n\n.theia-vsx-extension-editor .body a:hover {\n  text-decoration: underline;\n}\n\n.theia-vsx-extension-editor .body table {\n  border-collapse: collapse;\n}\n\n.theia-vsx-extension-editor .body table > thead > tr > th {\n  text-align: left;\n  border-bottom: 1px solid var(--theia-extensionEditor-tableHeadBorder);\n}\n\n.theia-vsx-extension-editor .body table > thead > tr > th,\n.theia-vsx-extension-editor .body table > thead > tr > td,\n.theia-vsx-extension-editor .body table > tbody > tr > th,\n.theia-vsx-extension-editor .body table > tbody > tr > td {\n  padding: 5px 10px;\n}\n\n.theia-vsx-extension-editor .body table > tbody > tr + tr > td {\n  border-top: 1px solid var(--theia-extensionEditor-tableCellBorder);\n}\n\n.theia-vsx-extension-editor .scroll-container .body pre {\n  white-space: normal;\n}\n\n.theia-vsx-extension-editor .body img {\n  max-width: 100%;\n}\n\n.theia-vsx-extension-editor .header .icon-container {\n  height: var(--theia-vsx-extension-editor-icon-size);\n  width: var(--theia-vsx-extension-editor-icon-size);\n  align-self: center;\n  padding-right: calc(var(--theia-ui-padding) * 2.5);\n  flex-shrink: 0;\n  object-fit: contain;\n}\n\n.theia-vsx-extension-editor .header .icon-container.placeholder {\n  background-size: var(--theia-vsx-extension-editor-icon-size);\n  background-repeat: no-repeat;\n  background-image: url(\"defaultIcon.png\");\n}\n\n.theia-vsx-extension-editor .header .details {\n  overflow: hidden;\n  user-select: text;\n  -webkit-user-select: text;\n}\n\n.theia-vsx-extension-editor .header .details .title,\n.theia-vsx-extension-editor .header .details .subtitle {\n  display: flex;\n  align-items: center;\n}\n\n.theia-vsx-extension-editor .header .details .title .name {\n  flex: 0;\n  font-size: calc(var(--theia-ui-font-size1) * 2);\n  font-weight: 600;\n  white-space: nowrap;\n  cursor: pointer;\n}\n\n.theia-vsx-extension-editor .header .details .title .identifier {\n  margin-left: calc(var(--theia-ui-padding) * 5 / 3);\n  opacity: 0.6;\n  background: hsla(0, 0%, 68%, 0.31);\n  user-select: text;\n  -webkit-user-select: text;\n  white-space: nowrap;\n}\n\n.theia-vsx-extension-editor .header .details .title .preview {\n  background: #d63f26;\n}\n\n.vs .theia-vsx-extension-editor .header .details .title .preview {\n  color: white;\n}\n\n.theia-vsx-extension-editor .header .details .title .identifier,\n.theia-vsx-extension-editor .header .details .title .preview,\n.theia-vsx-extension-editor .header .details .title .builtin {\n  line-height: var(--theia-code-line-height);\n}\n\n.theia-vsx-extension-editor .header .details .title .identifier,\n.theia-vsx-extension-editor .header .details .title .preview {\n  padding: calc(var(--theia-ui-padding) * 2 / 3);\n  padding-top: 0px;\n  padding-bottom: 0px;\n  border-radius: calc(var(--theia-ui-padding) * 2 / 3);\n}\n\n.theia-vsx-extension-editor .header .details .title .preview,\n.theia-vsx-extension-editor .header .details .title .builtin {\n  font-size: var(--theia-ui-font-size0);\n  font-style: italic;\n  margin-left: calc(var(--theia-ui-padding) * 5 / 3);\n}\n\n.theia-vsx-extension-editor .header .details .subtitle {\n  padding-top: var(--theia-ui-padding);\n  white-space: nowrap;\n}\n\n.theia-vsx-extension-editor .header .details .subtitle > span {\n  display: flex;\n  align-items: center;\n  cursor: pointer;\n  line-height: var(--theia-content-line-height);\n  height: var(--theia-content-line-height);\n}\n\n.theia-vsx-extension-editor\n  .header\n  .details\n  .subtitle\n  > span:not(:first-child):not(:empty) {\n  border-left: 1px solid hsla(0, 0%, 50%, 0.7);\n  padding-left: calc(var(--theia-ui-padding) * 2);\n  margin-left: calc(var(--theia-ui-padding) * 2);\n  font-weight: 500;\n}\n\n.theia-vsx-extension-editor .header .details .subtitle .publisher {\n  font-size: var(--theia-ui-font-size3);\n}\n\n.theia-vsx-extension-editor\n  .header\n  .details\n  .subtitle\n  .publisher\n  .namespace-access,\n.theia-vsx-extension-editor .header .details .subtitle .download-count::before {\n  padding-right: var(--theia-ui-padding);\n}\n\n.theia-vsx-extension-editor .header .details .subtitle .average-rating > i {\n  color: #ff8e00;\n}\n\n.theia-vsx-extension-editor\n  .header\n  .details\n  .subtitle\n  .average-rating\n  > i:not(:first-child) {\n  padding-left: calc(var(--theia-ui-padding) / 2);\n}\n\n.theia-vsx-extension-editor .header .details .description {\n  margin-top: calc(var(--theia-ui-padding) * 5 / 3);\n}\n\n.theia-vsx-extension-editor .action {\n  font-weight: 600;\n  margin-top: calc(var(--theia-ui-padding) * 5 / 3);\n  margin-left: 0px;\n  padding: 1px var(--theia-ui-padding);\n  vertical-align: middle;\n}\n\n/** Theming */\n\n.theia-vsx-extension-editor .action.prominent,\n.theia-vsx-extension-action-bar .action.prominent {\n  color: var(--theia-extensionButton-prominentForeground);\n  background-color: var(--theia-extensionButton-prominentBackground);\n}\n\n.theia-vsx-extension-editor .action.prominent:hover,\n.theia-vsx-extension-action-bar .action.prominent:hover {\n  background-color: var(--theia-extensionButton-prominentHoverBackground);\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../packages/vsx-registry/src/browser/style/index.css":
/*!***************************************************************!*\
  !*** ../../packages/vsx-registry/src/browser/style/index.css ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/css-loader/dist/cjs.js!./index.css */ "../../node_modules/css-loader/dist/cjs.js!../../packages/vsx-registry/src/browser/style/index.css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "../../packages/vsx-registry/src/browser/style/defaultIcon.png":
/*!*********************************************************************!*\
  !*** ../../packages/vsx-registry/src/browser/style/defaultIcon.png ***!
  \*********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "2bc325d1f8537598f02c..png";

/***/ })

}]);
//# sourceMappingURL=packages_vsx-registry_lib_browser_vsx-registry-frontend-module_js.js.map