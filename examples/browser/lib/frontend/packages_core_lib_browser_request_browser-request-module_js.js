"use strict";
(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_core_lib_browser_request_browser-request-module_js"],{

/***/ "../../packages/core/lib/browser/request/browser-request-module.js":
/*!*************************************************************************!*\
  !*** ../../packages/core/lib/browser/request/browser-request-module.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/********************************************************************************
 * Copyright (C) 2022 TypeFox and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
const inversify_1 = __webpack_require__(/*! inversify */ "../../node_modules/inversify/es/inversify.js");
const request_1 = __webpack_require__(/*! @theia/request */ "../../dev-packages/request/lib/index.js");
const browser_request_service_1 = __webpack_require__(/*! ./browser-request-service */ "../../packages/core/lib/browser/request/browser-request-service.js");
exports["default"] = new inversify_1.ContainerModule(bind => {
    bind(request_1.RequestService).to(browser_request_service_1.XHRBrowserRequestService).inSingletonScope();
});

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/lib/browser/request/browser-request-module'] = this;


/***/ }),

/***/ "../../packages/core/lib/browser/request/browser-request-service.js":
/*!**************************************************************************!*\
  !*** ../../packages/core/lib/browser/request/browser-request-service.js ***!
  \**************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/********************************************************************************
 * Copyright (C) 2022 TypeFox and others.
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
exports.XHRBrowserRequestService = exports.ProxyingBrowserRequestService = exports.AbstractBrowserRequestService = void 0;
const inversify_1 = __webpack_require__(/*! inversify */ "../../node_modules/inversify/es/inversify.js");
const request_1 = __webpack_require__(/*! @theia/request */ "../../dev-packages/request/lib/index.js");
const preference_service_1 = __webpack_require__(/*! ../preferences/preference-service */ "../../packages/core/lib/browser/preferences/preference-service.js");
let AbstractBrowserRequestService = class AbstractBrowserRequestService {
    constructor() {
        this.configurePromise = Promise.resolve();
    }
    init() {
        this.configurePromise = this.preferenceService.ready.then(() => {
            const proxyUrl = this.preferenceService.get('http.proxy');
            const proxyAuthorization = this.preferenceService.get('http.proxyAuthorization');
            const strictSSL = this.preferenceService.get('http.proxyStrictSSL');
            return this.configure({
                proxyUrl,
                proxyAuthorization,
                strictSSL
            });
        });
        this.preferenceService.onPreferencesChanged(e => {
            this.configurePromise.then(() => {
                var _a, _b, _c;
                return this.configure({
                    proxyUrl: (_a = e['http.proxy']) === null || _a === void 0 ? void 0 : _a.newValue,
                    proxyAuthorization: (_b = e['http.proxyAuthorization']) === null || _b === void 0 ? void 0 : _b.newValue,
                    strictSSL: (_c = e['http.proxyStrictSSL']) === null || _c === void 0 ? void 0 : _c.newValue
                });
            });
        });
    }
};
__decorate([
    (0, inversify_1.inject)(preference_service_1.PreferenceService),
    __metadata("design:type", Object)
], AbstractBrowserRequestService.prototype, "preferenceService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AbstractBrowserRequestService.prototype, "init", null);
AbstractBrowserRequestService = __decorate([
    (0, inversify_1.injectable)()
], AbstractBrowserRequestService);
exports.AbstractBrowserRequestService = AbstractBrowserRequestService;
let ProxyingBrowserRequestService = class ProxyingBrowserRequestService extends AbstractBrowserRequestService {
    configure(config) {
        return this.backendRequestService.configure(config);
    }
    resolveProxy(url) {
        return this.backendRequestService.resolveProxy(url);
    }
    async request(options) {
        // Wait for both the preferences and the configuration of the backend service
        await this.configurePromise;
        const backendResult = await this.backendRequestService.request(options);
        return request_1.RequestContext.decompress(backendResult);
    }
};
__decorate([
    (0, inversify_1.inject)(request_1.BackendRequestService),
    __metadata("design:type", Object)
], ProxyingBrowserRequestService.prototype, "backendRequestService", void 0);
ProxyingBrowserRequestService = __decorate([
    (0, inversify_1.injectable)()
], ProxyingBrowserRequestService);
exports.ProxyingBrowserRequestService = ProxyingBrowserRequestService;
let XHRBrowserRequestService = class XHRBrowserRequestService extends ProxyingBrowserRequestService {
    configure(config) {
        if (config.proxyAuthorization !== undefined) {
            this.authorization = config.proxyAuthorization;
        }
        return super.configure(config);
    }
    async request(options, token) {
        var _a;
        try {
            const xhrResult = await this.xhrRequest(options, token);
            const statusCode = (_a = xhrResult.res.statusCode) !== null && _a !== void 0 ? _a : 200;
            if (statusCode >= 400) {
                // We might've been blocked by the firewall
                // Try it through the backend request service
                return super.request(options);
            }
            return xhrResult;
        }
        catch {
            return super.request(options);
        }
    }
    xhrRequest(options, token) {
        const authorization = this.authorization || options.proxyAuthorization;
        if (authorization) {
            options.headers = {
                ...(options.headers || {}),
                'Proxy-Authorization': authorization
            };
        }
        const xhr = new XMLHttpRequest();
        return new Promise((resolve, reject) => {
            xhr.open(options.type || 'GET', options.url || '', true, options.user, options.password);
            this.setRequestHeaders(xhr, options);
            xhr.responseType = 'arraybuffer';
            xhr.onerror = () => reject(new Error(xhr.statusText && ('XHR failed: ' + xhr.statusText) || 'XHR failed'));
            xhr.onload = () => {
                resolve({
                    url: options.url,
                    res: {
                        statusCode: xhr.status,
                        headers: this.getResponseHeaders(xhr)
                    },
                    buffer: new Uint8Array(xhr.response)
                });
            };
            xhr.ontimeout = e => reject(new Error(`XHR timeout: ${options.timeout}ms`));
            if (options.timeout) {
                xhr.timeout = options.timeout;
            }
            xhr.send(options.data);
            token === null || token === void 0 ? void 0 : token.onCancellationRequested(() => {
                xhr.abort();
                reject();
            });
        });
    }
    setRequestHeaders(xhr, options) {
        if (options.headers) {
            for (const k of Object.keys(options.headers)) {
                switch (k) {
                    case 'User-Agent':
                    case 'Accept-Encoding':
                    case 'Content-Length':
                        // unsafe headers
                        continue;
                }
                xhr.setRequestHeader(k, options.headers[k]);
            }
        }
    }
    getResponseHeaders(xhr) {
        const headers = {};
        for (const line of xhr.getAllResponseHeaders().split(/\r\n|\n|\r/g)) {
            if (line) {
                const idx = line.indexOf(':');
                headers[line.substring(0, idx).trim().toLowerCase()] = line.substring(idx + 1).trim();
            }
        }
        return headers;
    }
};
XHRBrowserRequestService = __decorate([
    (0, inversify_1.injectable)()
], XHRBrowserRequestService);
exports.XHRBrowserRequestService = XHRBrowserRequestService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/lib/browser/request/browser-request-service'] = this;


/***/ })

}]);
//# sourceMappingURL=packages_core_lib_browser_request_browser-request-module_js.js.map