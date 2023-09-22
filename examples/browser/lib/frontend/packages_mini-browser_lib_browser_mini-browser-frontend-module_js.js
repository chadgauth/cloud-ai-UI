"use strict";
(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_mini-browser_lib_browser_mini-browser-frontend-module_js"],{

/***/ "../../packages/mini-browser/lib/browser/mini-browser-frontend-module.js":
/*!*******************************************************************************!*\
  !*** ../../packages/mini-browser/lib/browser/mini-browser-frontend-module.js ***!
  \*******************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
__webpack_require__(/*! ../../src/browser/style/index.css */ "../../packages/mini-browser/src/browser/style/index.css");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const opener_service_1 = __webpack_require__(/*! @theia/core/lib/browser/opener-service */ "../../packages/core/lib/browser/opener-service.js");
const widget_manager_1 = __webpack_require__(/*! @theia/core/lib/browser/widget-manager */ "../../packages/core/lib/browser/widget-manager.js");
const contribution_provider_1 = __webpack_require__(/*! @theia/core/lib/common/contribution-provider */ "../../packages/core/lib/common/contribution-provider.js");
const ws_connection_provider_1 = __webpack_require__(/*! @theia/core/lib/browser/messaging/ws-connection-provider */ "../../packages/core/lib/browser/messaging/ws-connection-provider.js");
const frontend_application_1 = __webpack_require__(/*! @theia/core/lib/browser/frontend-application */ "../../packages/core/lib/browser/frontend-application.js");
const tab_bar_toolbar_1 = __webpack_require__(/*! @theia/core/lib/browser/shell/tab-bar-toolbar */ "../../packages/core/lib/browser/shell/tab-bar-toolbar/index.js");
const command_1 = __webpack_require__(/*! @theia/core/lib/common/command */ "../../packages/core/lib/common/command.js");
const menu_1 = __webpack_require__(/*! @theia/core/lib/common/menu */ "../../packages/core/lib/common/menu/index.js");
const mini_browser_open_handler_1 = __webpack_require__(/*! ./mini-browser-open-handler */ "../../packages/mini-browser/lib/browser/mini-browser-open-handler.js");
const mini_browser_service_1 = __webpack_require__(/*! ../common/mini-browser-service */ "../../packages/mini-browser/lib/common/mini-browser-service.js");
const mini_browser_1 = __webpack_require__(/*! ./mini-browser */ "../../packages/mini-browser/lib/browser/mini-browser.js");
const mini_browser_content_1 = __webpack_require__(/*! ./mini-browser-content */ "../../packages/mini-browser/lib/browser/mini-browser-content.js");
const location_mapper_service_1 = __webpack_require__(/*! ./location-mapper-service */ "../../packages/mini-browser/lib/browser/location-mapper-service.js");
const mini_browser_frontend_security_warnings_1 = __webpack_require__(/*! ./mini-browser-frontend-security-warnings */ "../../packages/mini-browser/lib/browser/mini-browser-frontend-security-warnings.js");
exports["default"] = new inversify_1.ContainerModule(bind => {
    bind(mini_browser_content_1.MiniBrowserContent).toSelf();
    bind(mini_browser_content_1.MiniBrowserContentFactory).toFactory(context => (props) => {
        const { container } = context;
        const child = container.createChild();
        child.bind(mini_browser_content_1.MiniBrowserProps).toConstantValue(props);
        return child.get(mini_browser_content_1.MiniBrowserContent);
    });
    bind(mini_browser_1.MiniBrowser).toSelf();
    bind(widget_manager_1.WidgetFactory).toDynamicValue(context => ({
        id: mini_browser_1.MiniBrowser.ID,
        async createWidget(options) {
            const { container } = context;
            const child = container.createChild();
            const uri = new uri_1.default(options.uri);
            child.bind(mini_browser_1.MiniBrowserOptions).toConstantValue({ uri });
            return child.get(mini_browser_1.MiniBrowser);
        }
    })).inSingletonScope();
    bind(mini_browser_open_handler_1.MiniBrowserOpenHandler).toSelf().inSingletonScope();
    bind(opener_service_1.OpenHandler).toService(mini_browser_open_handler_1.MiniBrowserOpenHandler);
    bind(frontend_application_1.FrontendApplicationContribution).toService(mini_browser_open_handler_1.MiniBrowserOpenHandler);
    bind(command_1.CommandContribution).toService(mini_browser_open_handler_1.MiniBrowserOpenHandler);
    bind(menu_1.MenuContribution).toService(mini_browser_open_handler_1.MiniBrowserOpenHandler);
    bind(tab_bar_toolbar_1.TabBarToolbarContribution).toService(mini_browser_open_handler_1.MiniBrowserOpenHandler);
    (0, contribution_provider_1.bindContributionProvider)(bind, location_mapper_service_1.LocationMapper);
    bind(location_mapper_service_1.LocationMapper).to(location_mapper_service_1.FileLocationMapper).inSingletonScope();
    bind(location_mapper_service_1.LocationMapper).to(location_mapper_service_1.HttpLocationMapper).inSingletonScope();
    bind(location_mapper_service_1.LocationMapper).to(location_mapper_service_1.HttpsLocationMapper).inSingletonScope();
    bind(location_mapper_service_1.LocationWithoutSchemeMapper).toSelf().inSingletonScope();
    bind(location_mapper_service_1.LocationMapper).toService(location_mapper_service_1.LocationWithoutSchemeMapper);
    bind(location_mapper_service_1.LocationMapperService).toSelf().inSingletonScope();
    bind(mini_browser_service_1.MiniBrowserService).toDynamicValue(ctx => ws_connection_provider_1.WebSocketConnectionProvider.createProxy(ctx.container, mini_browser_service_1.MiniBrowserServicePath)).inSingletonScope();
    bind(mini_browser_frontend_security_warnings_1.MiniBrowserFrontendSecurityWarnings).toSelf().inSingletonScope();
    bind(frontend_application_1.FrontendApplicationContribution).toService(mini_browser_frontend_security_warnings_1.MiniBrowserFrontendSecurityWarnings);
});

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/mini-browser/lib/browser/mini-browser-frontend-module'] = this;


/***/ }),

/***/ "../../packages/mini-browser/lib/browser/mini-browser-frontend-security-warnings.js":
/*!******************************************************************************************!*\
  !*** ../../packages/mini-browser/lib/browser/mini-browser-frontend-security-warnings.js ***!
  \******************************************************************************************/
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
exports.MiniBrowserFrontendSecurityWarnings = void 0;
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const frontend_application_config_provider_1 = __webpack_require__(/*! @theia/core/lib/browser/frontend-application-config-provider */ "../../packages/core/lib/browser/frontend-application-config-provider.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
const window_service_1 = __webpack_require__(/*! @theia/core/lib/browser/window/window-service */ "../../packages/core/lib/browser/window/window-service.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const mini_browser_endpoint_1 = __webpack_require__(/*! ../common/mini-browser-endpoint */ "../../packages/mini-browser/lib/common/mini-browser-endpoint.js");
const mini_browser_environment_1 = __webpack_require__(/*! ./environment/mini-browser-environment */ "../../packages/mini-browser/lib/browser/environment/mini-browser-environment.js");
let MiniBrowserFrontendSecurityWarnings = class MiniBrowserFrontendSecurityWarnings {
    initialize() {
        this.checkHostPattern();
    }
    async checkHostPattern() {
        if (frontend_application_config_provider_1.FrontendApplicationConfigProvider.get()['warnOnPotentiallyInsecureHostPattern'] === false) {
            return;
        }
        const hostPattern = await this.miniBrowserEnvironment.hostPatternPromise;
        if (hostPattern !== mini_browser_endpoint_1.MiniBrowserEndpoint.HOST_PATTERN_DEFAULT) {
            const goToReadme = nls_1.nls.localize('theia/webview/goToReadme', 'Go To README');
            const message = nls_1.nls.localize('theia/webview/messageWarning', '\
            The {0} endpoint\'s host pattern has been changed to `{1}`; changing the pattern can lead to security vulnerabilities. \
            See `{2}` for more information.', 'mini-browser', hostPattern, '@theia/mini-browser/README.md');
            this.messageService.warn(message, browser_1.Dialog.OK, goToReadme).then(action => {
                if (action === goToReadme) {
                    this.windowService.openNewWindow('https://www.npmjs.com/package/@theia/mini-browser', { external: true });
                }
            });
        }
    }
};
__decorate([
    (0, inversify_1.inject)(window_service_1.WindowService),
    __metadata("design:type", Object)
], MiniBrowserFrontendSecurityWarnings.prototype, "windowService", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.MessageService),
    __metadata("design:type", core_1.MessageService)
], MiniBrowserFrontendSecurityWarnings.prototype, "messageService", void 0);
__decorate([
    (0, inversify_1.inject)(mini_browser_environment_1.MiniBrowserEnvironment),
    __metadata("design:type", mini_browser_environment_1.MiniBrowserEnvironment)
], MiniBrowserFrontendSecurityWarnings.prototype, "miniBrowserEnvironment", void 0);
MiniBrowserFrontendSecurityWarnings = __decorate([
    (0, inversify_1.injectable)()
], MiniBrowserFrontendSecurityWarnings);
exports.MiniBrowserFrontendSecurityWarnings = MiniBrowserFrontendSecurityWarnings;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/mini-browser/lib/browser/mini-browser-frontend-security-warnings'] = this;


/***/ }),

/***/ "../../node_modules/css-loader/dist/cjs.js!../../packages/mini-browser/src/browser/style/index.css":
/*!*********************************************************************************************************!*\
  !*** ../../node_modules/css-loader/dist/cjs.js!../../packages/mini-browser/src/browser/style/index.css ***!
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
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/********************************************************************************
 * Copyright (C) 2018 TypeFox and others.
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
  --theia-private-mini-browser-height: var(--theia-content-line-height);
}

.theia-mini-browser {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.theia-mini-browser-toolbar {
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  padding: 0 10px;
}

.theia-mini-browser-toolbar-read-only {
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  padding: 0 10px;
}

.theia-mini-browser-toolbar .theia-input {
  width: 100%;
  line-height: var(--theia-private-mini-browser-height);
  margin-left: 4px;
  margin-right: 4px;
}

.theia-mini-browser-toolbar-read-only .theia-input {
  width: 100%;
  line-height: var(--theia-private-mini-browser-height);
  margin-left: 4px;
  margin-right: 4px;
  cursor: pointer;
  background: var(--theia-input-background);
  border: none;
  text-decoration: underline;
  outline: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--theia-input-foreground);
}

.theia-mini-browser-toolbar-read-only .theia-input:hover {
  color: var(--theia-button-hoverBackground);
}

.theia-mini-browser-button {
  min-width: 1rem;
  text-align: center;
  flex-grow: 0;
  font-family: FontAwesome;
  font-size: calc(var(--theia-content-font-size) * 0.8);
  color: var(--theia-icon-foreground);
  margin: 0px 4px 0px 4px;
}

.theia-mini-browser-button:not(.theia-mini-browser-button-disabled):hover {
  cursor: pointer;
}

.theia-mini-browser-button-disabled {
  opacity: var(--theia-mod-disabled-opacity);
}

.theia-mini-browser-previous::before {
  content: "\\f053";
}

.theia-mini-browser-next::before {
  content: "\\f054";
}

.theia-mini-browser-refresh::before {
  content: "\\f021";
}

.theia-mini-browser-open::before {
  content: "\\f08e";
}

.theia-mini-browser-content-area {
  position: relative;
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
  overflow: hidden;
  margin-top: 6px;
}

.theia-mini-browser-pdf-container {
  width: 100%;
  height: 100%;
}

.theia-mini-browser-load-indicator {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
  background: var(--theia-editor-background);
  background-image: var(--theia-preloader);
  background-size: 60px 60px;
  background-repeat: no-repeat;
  background-position: center;
  transition: opacity 0.8s;
}

.theia-mini-browser-load-indicator.theia-fade-out {
  opacity: 0;
}

.theia-mini-browser-error-bar {
  height: 19px;
  padding-left: var(--theia-ui-padding);
  background-color: var(--theia-inputValidation-errorBorder);
  color: var(--theia-editor-foreground);
  font-size: var(--theia-statusBar-font-size);
  z-index: 1000; /* Above the transparent overlay (\`z-index: 999;\`). */
}

.theia-mini-browser-error-bar span {
  margin-top: 3px;
  margin-left: var(--theia-ui-padding);
}

.theia-mini-browser-content-area iframe {
  flex-grow: 1;
  border: none;
  margin: 0;
  padding: 0;
}
`, "",{"version":3,"sources":["webpack://./../../packages/mini-browser/src/browser/style/index.css"],"names":[],"mappings":"AAAA;;;;;;;;;;;;;;iFAciF;;AAEjF;EACE,qEAAqE;AACvE;;AAEA;EACE,aAAa;EACb,sBAAsB;EACtB,YAAY;AACd;;AAEA;EACE,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,6BAA6B;EAC7B,eAAe;AACjB;;AAEA;EACE,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,6BAA6B;EAC7B,eAAe;AACjB;;AAEA;EACE,WAAW;EACX,qDAAqD;EACrD,gBAAgB;EAChB,iBAAiB;AACnB;;AAEA;EACE,WAAW;EACX,qDAAqD;EACrD,gBAAgB;EAChB,iBAAiB;EACjB,eAAe;EACf,yCAAyC;EACzC,YAAY;EACZ,0BAA0B;EAC1B,aAAa;EACb,mBAAmB;EACnB,gBAAgB;EAChB,uBAAuB;EACvB,oCAAoC;AACtC;;AAEA;EACE,0CAA0C;AAC5C;;AAEA;EACE,eAAe;EACf,kBAAkB;EAClB,YAAY;EACZ,wBAAwB;EACxB,qDAAqD;EACrD,mCAAmC;EACnC,uBAAuB;AACzB;;AAEA;EACE,eAAe;AACjB;;AAEA;EACE,0CAA0C;AAC5C;;AAEA;EACE,gBAAgB;AAClB;;AAEA;EACE,gBAAgB;AAClB;;AAEA;EACE,gBAAgB;AAClB;;AAEA;EACE,gBAAgB;AAClB;;AAEA;EACE,kBAAkB;EAClB,aAAa;EACb,YAAY;EACZ,WAAW;EACX,sBAAsB;EACtB,gBAAgB;EAChB,eAAe;AACjB;;AAEA;EACE,WAAW;EACX,YAAY;AACd;;AAEA;EACE,kBAAkB;EAClB,MAAM;EACN,QAAQ;EACR,SAAS;EACT,OAAO;EACP,WAAW;EACX,0CAA0C;EAC1C,wCAAwC;EACxC,0BAA0B;EAC1B,4BAA4B;EAC5B,2BAA2B;EAC3B,wBAAwB;AAC1B;;AAEA;EACE,UAAU;AACZ;;AAEA;EACE,YAAY;EACZ,qCAAqC;EACrC,0DAA0D;EAC1D,qCAAqC;EACrC,2CAA2C;EAC3C,aAAa,EAAE,qDAAqD;AACtE;;AAEA;EACE,eAAe;EACf,oCAAoC;AACtC;;AAEA;EACE,YAAY;EACZ,YAAY;EACZ,SAAS;EACT,UAAU;AACZ","sourcesContent":["/********************************************************************************\n * Copyright (C) 2018 TypeFox and others.\n *\n * This program and the accompanying materials are made available under the\n * terms of the Eclipse Public License v. 2.0 which is available at\n * http://www.eclipse.org/legal/epl-2.0.\n *\n * This Source Code may also be made available under the following Secondary\n * Licenses when the conditions for such availability set forth in the Eclipse\n * Public License v. 2.0 are satisfied: GNU General Public License, version 2\n * with the GNU Classpath Exception which is available at\n * https://www.gnu.org/software/classpath/license.html.\n *\n * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0\n ********************************************************************************/\n\n:root {\n  --theia-private-mini-browser-height: var(--theia-content-line-height);\n}\n\n.theia-mini-browser {\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n}\n\n.theia-mini-browser-toolbar {\n  margin-top: 8px;\n  display: flex;\n  align-items: center;\n  justify-content: space-evenly;\n  padding: 0 10px;\n}\n\n.theia-mini-browser-toolbar-read-only {\n  margin-top: 8px;\n  display: flex;\n  align-items: center;\n  justify-content: space-evenly;\n  padding: 0 10px;\n}\n\n.theia-mini-browser-toolbar .theia-input {\n  width: 100%;\n  line-height: var(--theia-private-mini-browser-height);\n  margin-left: 4px;\n  margin-right: 4px;\n}\n\n.theia-mini-browser-toolbar-read-only .theia-input {\n  width: 100%;\n  line-height: var(--theia-private-mini-browser-height);\n  margin-left: 4px;\n  margin-right: 4px;\n  cursor: pointer;\n  background: var(--theia-input-background);\n  border: none;\n  text-decoration: underline;\n  outline: none;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  color: var(--theia-input-foreground);\n}\n\n.theia-mini-browser-toolbar-read-only .theia-input:hover {\n  color: var(--theia-button-hoverBackground);\n}\n\n.theia-mini-browser-button {\n  min-width: 1rem;\n  text-align: center;\n  flex-grow: 0;\n  font-family: FontAwesome;\n  font-size: calc(var(--theia-content-font-size) * 0.8);\n  color: var(--theia-icon-foreground);\n  margin: 0px 4px 0px 4px;\n}\n\n.theia-mini-browser-button:not(.theia-mini-browser-button-disabled):hover {\n  cursor: pointer;\n}\n\n.theia-mini-browser-button-disabled {\n  opacity: var(--theia-mod-disabled-opacity);\n}\n\n.theia-mini-browser-previous::before {\n  content: \"\\f053\";\n}\n\n.theia-mini-browser-next::before {\n  content: \"\\f054\";\n}\n\n.theia-mini-browser-refresh::before {\n  content: \"\\f021\";\n}\n\n.theia-mini-browser-open::before {\n  content: \"\\f08e\";\n}\n\n.theia-mini-browser-content-area {\n  position: relative;\n  display: flex;\n  height: 100%;\n  width: 100%;\n  flex-direction: column;\n  overflow: hidden;\n  margin-top: 6px;\n}\n\n.theia-mini-browser-pdf-container {\n  width: 100%;\n  height: 100%;\n}\n\n.theia-mini-browser-load-indicator {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 10;\n  background: var(--theia-editor-background);\n  background-image: var(--theia-preloader);\n  background-size: 60px 60px;\n  background-repeat: no-repeat;\n  background-position: center;\n  transition: opacity 0.8s;\n}\n\n.theia-mini-browser-load-indicator.theia-fade-out {\n  opacity: 0;\n}\n\n.theia-mini-browser-error-bar {\n  height: 19px;\n  padding-left: var(--theia-ui-padding);\n  background-color: var(--theia-inputValidation-errorBorder);\n  color: var(--theia-editor-foreground);\n  font-size: var(--theia-statusBar-font-size);\n  z-index: 1000; /* Above the transparent overlay (`z-index: 999;`). */\n}\n\n.theia-mini-browser-error-bar span {\n  margin-top: 3px;\n  margin-left: var(--theia-ui-padding);\n}\n\n.theia-mini-browser-content-area iframe {\n  flex-grow: 1;\n  border: none;\n  margin: 0;\n  padding: 0;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../packages/mini-browser/src/browser/style/index.css":
/*!***************************************************************!*\
  !*** ../../packages/mini-browser/src/browser/style/index.css ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/css-loader/dist/cjs.js!./index.css */ "../../node_modules/css-loader/dist/cjs.js!../../packages/mini-browser/src/browser/style/index.css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ })

}]);
//# sourceMappingURL=packages_mini-browser_lib_browser_mini-browser-frontend-module_js.js.map