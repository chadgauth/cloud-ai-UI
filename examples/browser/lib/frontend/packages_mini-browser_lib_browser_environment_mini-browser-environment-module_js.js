(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_mini-browser_lib_browser_environment_mini-browser-environment-module_js"],{

/***/ "../../packages/core/shared/@theia/application-package/lib/environment/index.js":
/*!**************************************************************************************!*\
  !*** ../../packages/core/shared/@theia/application-package/lib/environment/index.js ***!
  \**************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! @theia/application-package/lib/environment */ "../../dev-packages/application-package/lib/environment.js");

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/shared/@theia/application-package/lib/environment'] = this;


/***/ }),

/***/ "../../packages/mini-browser/lib/browser/environment/mini-browser-environment-module.js":
/*!**********************************************************************************************!*\
  !*** ../../packages/mini-browser/lib/browser/environment/mini-browser-environment-module.js ***!
  \**********************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2020 Ericsson and others.
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
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const mini_browser_environment_1 = __webpack_require__(/*! ./mini-browser-environment */ "../../packages/mini-browser/lib/browser/environment/mini-browser-environment.js");
exports["default"] = new inversify_1.ContainerModule(bind => {
    bind(mini_browser_environment_1.MiniBrowserEnvironment).toSelf().inSingletonScope();
    bind(browser_1.FrontendApplicationContribution).toService(mini_browser_environment_1.MiniBrowserEnvironment);
});

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/mini-browser/lib/browser/environment/mini-browser-environment-module'] = this;


/***/ }),

/***/ "../../packages/mini-browser/lib/browser/environment/mini-browser-environment.js":
/*!***************************************************************************************!*\
  !*** ../../packages/mini-browser/lib/browser/environment/mini-browser-environment.js ***!
  \***************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2020 Ericsson and others.
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
exports.MiniBrowserEnvironment = void 0;
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const env_variables_1 = __webpack_require__(/*! @theia/core/lib/common/env-variables */ "../../packages/core/lib/common/env-variables/index.js");
const environment_1 = __webpack_require__(/*! @theia/core/shared/@theia/application-package/lib/environment */ "../../packages/core/shared/@theia/application-package/lib/environment/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const uuid_1 = __webpack_require__(/*! uuid */ "../../node_modules/uuid/dist/esm-browser/index.js");
const mini_browser_endpoint_1 = __webpack_require__(/*! ../../common/mini-browser-endpoint */ "../../packages/mini-browser/lib/common/mini-browser-endpoint.js");
/**
 * Fetch values from the backend's environment and caches them locally.
 * Helps with deploying various mini-browser endpoints.
 */
let MiniBrowserEnvironment = class MiniBrowserEnvironment {
    init() {
        this._hostPatternPromise = this.getHostPattern()
            .then(pattern => this._hostPattern = pattern);
    }
    get hostPatternPromise() {
        return this._hostPatternPromise;
    }
    get hostPattern() {
        return this._hostPattern;
    }
    async onStart() {
        await this._hostPatternPromise;
    }
    /**
     * Throws if `hostPatternPromise` is not yet resolved.
     */
    getEndpoint(uuid, hostname) {
        if (this._hostPattern === undefined) {
            throw new Error('MiniBrowserEnvironment is not finished initializing');
        }
        return new browser_1.Endpoint({
            path: mini_browser_endpoint_1.MiniBrowserEndpoint.PATH,
            host: this._hostPattern
                .replace('{{uuid}}', uuid)
                .replace('{{hostname}}', hostname || this.getDefaultHostname()),
        });
    }
    /**
     * Throws if `hostPatternPromise` is not yet resolved.
     */
    getRandomEndpoint() {
        return this.getEndpoint((0, uuid_1.v4)());
    }
    async getHostPattern() {
        return environment_1.environment.electron.is()
            ? mini_browser_endpoint_1.MiniBrowserEndpoint.HOST_PATTERN_DEFAULT
            : this.environment.getValue(mini_browser_endpoint_1.MiniBrowserEndpoint.HOST_PATTERN_ENV)
                .then(envVar => (envVar === null || envVar === void 0 ? void 0 : envVar.value) || mini_browser_endpoint_1.MiniBrowserEndpoint.HOST_PATTERN_DEFAULT);
    }
    getDefaultHostname() {
        return self.location.host;
    }
};
__decorate([
    (0, inversify_1.inject)(env_variables_1.EnvVariablesServer),
    __metadata("design:type", Object)
], MiniBrowserEnvironment.prototype, "environment", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MiniBrowserEnvironment.prototype, "init", null);
MiniBrowserEnvironment = __decorate([
    (0, inversify_1.injectable)()
], MiniBrowserEnvironment);
exports.MiniBrowserEnvironment = MiniBrowserEnvironment;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/mini-browser/lib/browser/environment/mini-browser-environment'] = this;


/***/ }),

/***/ "../../packages/mini-browser/lib/common/mini-browser-endpoint.js":
/*!***********************************************************************!*\
  !*** ../../packages/mini-browser/lib/common/mini-browser-endpoint.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

// *****************************************************************************
// Copyright (C) 2020 Ericsson and others.
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
exports.MiniBrowserEndpoint = void 0;
/**
 * The mini-browser can now serve content on its own host/origin.
 *
 * The virtual host can be configured with this `THEIA_MINI_BROWSER_HOST_PATTERN`
 * environment variable. `{{hostname}}` represents the current host, and `{{uuid}}`
 * will be replace by a random uuid value.
 */
var MiniBrowserEndpoint;
(function (MiniBrowserEndpoint) {
    MiniBrowserEndpoint.PATH = '/mini-browser';
    MiniBrowserEndpoint.HOST_PATTERN_ENV = 'THEIA_MINI_BROWSER_HOST_PATTERN';
    MiniBrowserEndpoint.HOST_PATTERN_DEFAULT = '{{uuid}}.mini-browser.{{hostname}}';
})(MiniBrowserEndpoint = exports.MiniBrowserEndpoint || (exports.MiniBrowserEndpoint = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/mini-browser/lib/common/mini-browser-endpoint'] = this;


/***/ })

}]);
//# sourceMappingURL=packages_mini-browser_lib_browser_environment_mini-browser-environment-module_js.js.map