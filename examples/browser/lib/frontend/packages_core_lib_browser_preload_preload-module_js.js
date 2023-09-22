"use strict";
(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_core_lib_browser_preload_preload-module_js"],{

/***/ "../../packages/core/lib/browser/preload/i18n-preload-contribution.js":
/*!****************************************************************************!*\
  !*** ../../packages/core/lib/browser/preload/i18n-preload-contribution.js ***!
  \****************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.I18nPreloadContribution = void 0;
const frontend_application_config_provider_1 = __webpack_require__(/*! ../frontend-application-config-provider */ "../../packages/core/lib/browser/frontend-application-config-provider.js");
const nls_1 = __webpack_require__(/*! ../../common/nls */ "../../packages/core/lib/common/nls.js");
const inversify_1 = __webpack_require__(/*! inversify */ "../../node_modules/inversify/es/inversify.js");
const localization_server_1 = __webpack_require__(/*! ../../common/i18n/localization-server */ "../../packages/core/lib/common/i18n/localization-server.js");
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

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/lib/browser/preload/i18n-preload-contribution'] = this;


/***/ }),

/***/ "../../packages/core/lib/browser/preload/os-preload-contribution.js":
/*!**************************************************************************!*\
  !*** ../../packages/core/lib/browser/preload/os-preload-contribution.js ***!
  \**************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OSPreloadContribution = void 0;
const inversify_1 = __webpack_require__(/*! inversify */ "../../node_modules/inversify/es/inversify.js");
const common_1 = __webpack_require__(/*! ../../common */ "../../packages/core/lib/common/index.js");
let OSPreloadContribution = class OSPreloadContribution {
    async initialize() {
        const osType = await this.osBackendProvider.getBackendOS();
        const isWindows = osType === 'Windows';
        const isOSX = osType === 'OSX';
        common_1.OS.backend.isOSX = isOSX;
        common_1.OS.backend.isWindows = isWindows;
        common_1.OS.backend.type = () => osType;
        common_1.OS.backend.EOL = isWindows ? '\r\n' : '\n';
    }
};
__decorate([
    (0, inversify_1.inject)(common_1.OSBackendProvider),
    __metadata("design:type", Object)
], OSPreloadContribution.prototype, "osBackendProvider", void 0);
OSPreloadContribution = __decorate([
    (0, inversify_1.injectable)()
], OSPreloadContribution);
exports.OSPreloadContribution = OSPreloadContribution;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/lib/browser/preload/os-preload-contribution'] = this;


/***/ }),

/***/ "../../packages/core/lib/browser/preload/preload-module.js":
/*!*****************************************************************!*\
  !*** ../../packages/core/lib/browser/preload/preload-module.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
const inversify_1 = __webpack_require__(/*! inversify */ "../../node_modules/inversify/es/inversify.js");
const preloader_1 = __webpack_require__(/*! ./preloader */ "../../packages/core/lib/browser/preload/preloader.js");
const contribution_provider_1 = __webpack_require__(/*! ../../common/contribution-provider */ "../../packages/core/lib/common/contribution-provider.js");
const i18n_preload_contribution_1 = __webpack_require__(/*! ./i18n-preload-contribution */ "../../packages/core/lib/browser/preload/i18n-preload-contribution.js");
const os_preload_contribution_1 = __webpack_require__(/*! ./os-preload-contribution */ "../../packages/core/lib/browser/preload/os-preload-contribution.js");
const theme_preload_contribution_1 = __webpack_require__(/*! ./theme-preload-contribution */ "../../packages/core/lib/browser/preload/theme-preload-contribution.js");
const localization_server_1 = __webpack_require__(/*! ../../common/i18n/localization-server */ "../../packages/core/lib/common/i18n/localization-server.js");
const ws_connection_provider_1 = __webpack_require__(/*! ../messaging/ws-connection-provider */ "../../packages/core/lib/browser/messaging/ws-connection-provider.js");
const os_1 = __webpack_require__(/*! ../../common/os */ "../../packages/core/lib/common/os.js");
exports["default"] = new inversify_1.ContainerModule(bind => {
    bind(preloader_1.Preloader).toSelf().inSingletonScope();
    (0, contribution_provider_1.bindContributionProvider)(bind, preloader_1.PreloadContribution);
    bind(localization_server_1.LocalizationServer).toDynamicValue(ctx => ws_connection_provider_1.WebSocketConnectionProvider.createProxy(ctx.container, localization_server_1.LocalizationServerPath)).inSingletonScope();
    bind(os_1.OSBackendProvider).toDynamicValue(ctx => ws_connection_provider_1.WebSocketConnectionProvider.createProxy(ctx.container, os_1.OSBackendProviderPath)).inSingletonScope();
    bind(i18n_preload_contribution_1.I18nPreloadContribution).toSelf().inSingletonScope();
    bind(preloader_1.PreloadContribution).toService(i18n_preload_contribution_1.I18nPreloadContribution);
    bind(os_preload_contribution_1.OSPreloadContribution).toSelf().inSingletonScope();
    bind(preloader_1.PreloadContribution).toService(os_preload_contribution_1.OSPreloadContribution);
    bind(theme_preload_contribution_1.ThemePreloadContribution).toSelf().inSingletonScope();
    bind(preloader_1.PreloadContribution).toService(theme_preload_contribution_1.ThemePreloadContribution);
});

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/lib/browser/preload/preload-module'] = this;


/***/ }),

/***/ "../../packages/core/lib/browser/preload/theme-preload-contribution.js":
/*!*****************************************************************************!*\
  !*** ../../packages/core/lib/browser/preload/theme-preload-contribution.js ***!
  \*****************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ThemePreloadContribution = void 0;
const frontend_application_config_provider_1 = __webpack_require__(/*! ../frontend-application-config-provider */ "../../packages/core/lib/browser/frontend-application-config-provider.js");
const inversify_1 = __webpack_require__(/*! inversify */ "../../node_modules/inversify/es/inversify.js");
let ThemePreloadContribution = class ThemePreloadContribution {
    initialize() {
        var _a;
        // The default light background color is based on the `colors#editor.background` value from
        // `packages/monaco/data/monaco-themes/vscode/dark_vs.json` and the dark background comes from the `light_vs.json`.
        const dark = (_a = window.matchMedia) === null || _a === void 0 ? void 0 : _a.call(window, '(prefers-color-scheme: dark)').matches;
        const value = window.localStorage.getItem(frontend_application_config_provider_1.DEFAULT_BACKGROUND_COLOR_STORAGE_KEY) || (dark ? '#1E1E1E' : '#FFFFFF');
        document.documentElement.style.setProperty('--theia-editor-background', value);
    }
};
ThemePreloadContribution = __decorate([
    (0, inversify_1.injectable)()
], ThemePreloadContribution);
exports.ThemePreloadContribution = ThemePreloadContribution;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/lib/browser/preload/theme-preload-contribution'] = this;


/***/ }),

/***/ "../../packages/core/lib/common/i18n/localization-server.js":
/*!******************************************************************!*\
  !*** ../../packages/core/lib/common/i18n/localization-server.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LocalizationServer = exports.LocalizationServerPath = void 0;
exports.LocalizationServerPath = '/localization-server';
exports.LocalizationServer = Symbol('LocalizationServer');

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/lib/common/i18n/localization-server'] = this;


/***/ })

}]);
//# sourceMappingURL=packages_core_lib_browser_preload_preload-module_js.js.map