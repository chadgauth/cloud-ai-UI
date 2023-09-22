"use strict";
(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_core_lib_browser_i18n_i18n-frontend-module_js"],{

/***/ "../../packages/core/lib/browser/i18n/i18n-frontend-module.js":
/*!********************************************************************!*\
  !*** ../../packages/core/lib/browser/i18n/i18n-frontend-module.js ***!
  \********************************************************************/
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
const inversify_1 = __webpack_require__(/*! inversify */ "../../node_modules/inversify/es/inversify.js");
const localization_1 = __webpack_require__(/*! ../../common/i18n/localization */ "../../packages/core/lib/common/i18n/localization.js");
const ws_connection_provider_1 = __webpack_require__(/*! ../messaging/ws-connection-provider */ "../../packages/core/lib/browser/messaging/ws-connection-provider.js");
const language_quick_pick_service_1 = __webpack_require__(/*! ./language-quick-pick-service */ "../../packages/core/lib/browser/i18n/language-quick-pick-service.js");
exports["default"] = new inversify_1.ContainerModule(bind => {
    bind(localization_1.AsyncLocalizationProvider).toDynamicValue(ctx => ctx.container.get(ws_connection_provider_1.WebSocketConnectionProvider).createProxy(localization_1.localizationPath)).inSingletonScope();
    bind(language_quick_pick_service_1.LanguageQuickPickService).toSelf().inSingletonScope();
});

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/lib/browser/i18n/i18n-frontend-module'] = this;


/***/ })

}]);
//# sourceMappingURL=packages_core_lib_browser_i18n_i18n-frontend-module_js.js.map