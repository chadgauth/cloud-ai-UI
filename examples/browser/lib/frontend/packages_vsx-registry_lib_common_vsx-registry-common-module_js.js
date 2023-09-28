(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_vsx-registry_lib_common_vsx-registry-common-module_js"],{

/***/ "../../packages/core/shared/@theia/request/index.js":
/*!**********************************************************!*\
  !*** ../../packages/core/shared/@theia/request/index.js ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! @theia/request */ "../../dev-packages/request/lib/index.js");

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/shared/@theia/request'] = this;


/***/ }),

/***/ "../../packages/vsx-registry/lib/common/index.js":
/*!*******************************************************!*\
  !*** ../../packages/vsx-registry/lib/common/index.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2023 Ericsson and others.
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
exports.VSXExtensionUri = exports.VSXEnvironment = exports.OVSXUrlResolver = exports.OVSXClientProvider = void 0;
var ovsx_client_provider_1 = __webpack_require__(/*! ./ovsx-client-provider */ "../../packages/vsx-registry/lib/common/ovsx-client-provider.js");
Object.defineProperty(exports, "OVSXClientProvider", ({ enumerable: true, get: function () { return ovsx_client_provider_1.OVSXClientProvider; } }));
Object.defineProperty(exports, "OVSXUrlResolver", ({ enumerable: true, get: function () { return ovsx_client_provider_1.OVSXUrlResolver; } }));
var vsx_environment_1 = __webpack_require__(/*! ./vsx-environment */ "../../packages/vsx-registry/lib/common/vsx-environment.js");
Object.defineProperty(exports, "VSXEnvironment", ({ enumerable: true, get: function () { return vsx_environment_1.VSXEnvironment; } }));
var vsx_extension_uri_1 = __webpack_require__(/*! ./vsx-extension-uri */ "../../packages/vsx-registry/lib/common/vsx-extension-uri.js");
Object.defineProperty(exports, "VSXExtensionUri", ({ enumerable: true, get: function () { return vsx_extension_uri_1.VSXExtensionUri; } }));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/vsx-registry/lib/common'] = this;


/***/ }),

/***/ "../../packages/vsx-registry/lib/common/vsx-extension-uri.js":
/*!*******************************************************************!*\
  !*** ../../packages/vsx-registry/lib/common/vsx-extension-uri.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
exports.VSXExtensionUri = void 0;
const plugin_vscode_uri_1 = __webpack_require__(/*! @theia/plugin-ext-vscode/lib/common/plugin-vscode-uri */ "../../packages/plugin-ext-vscode/lib/common/plugin-vscode-uri.js");
Object.defineProperty(exports, "VSXExtensionUri", ({ enumerable: true, get: function () { return plugin_vscode_uri_1.VSCodeExtensionUri; } }));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/vsx-registry/lib/common/vsx-extension-uri'] = this;


/***/ }),

/***/ "../../packages/vsx-registry/lib/common/vsx-registry-common-module.js":
/*!****************************************************************************!*\
  !*** ../../packages/vsx-registry/lib/common/vsx-registry-common-module.js ***!
  \****************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2023 Ericsson and others.
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
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const common_1 = __webpack_require__(/*! ../common */ "../../packages/vsx-registry/lib/common/index.js");
const request_1 = __webpack_require__(/*! @theia/core/shared/@theia/request */ "../../packages/core/shared/@theia/request/index.js");
const ovsx_client_1 = __webpack_require__(/*! @theia/ovsx-client */ "../../dev-packages/ovsx-client/lib/index.js");
const vsx_environment_1 = __webpack_require__(/*! ./vsx-environment */ "../../packages/vsx-registry/lib/common/vsx-environment.js");
exports["default"] = new inversify_1.ContainerModule(bind => {
    bind(common_1.OVSXUrlResolver)
        .toFunction(url => url);
    bind(common_1.OVSXClientProvider)
        .toDynamicValue(ctx => {
        var _a;
        const vsxEnvironment = ctx.container.get(vsx_environment_1.VSXEnvironment);
        const requestService = ctx.container.get(request_1.RequestService);
        const urlResolver = ctx.container.get(common_1.OVSXUrlResolver);
        const clientPromise = Promise
            .all([
            vsxEnvironment.getRegistryApiUri(),
            (_a = vsxEnvironment.getOvsxRouterConfig) === null || _a === void 0 ? void 0 : _a.call(vsxEnvironment),
        ])
            .then(async ([apiUrl, ovsxRouterConfig]) => {
            if (ovsxRouterConfig) {
                const clientFactory = ovsx_client_1.OVSXHttpClient.createClientFactory(requestService);
                return ovsx_client_1.OVSXRouterClient.FromConfig(ovsxRouterConfig, async (url) => clientFactory(await urlResolver(url)), [ovsx_client_1.RequestContainsFilterFactory, ovsx_client_1.ExtensionIdMatchesFilterFactory]);
            }
            return new ovsx_client_1.OVSXHttpClient(await urlResolver(apiUrl), requestService);
        });
        // reuse the promise for subsequent calls to this provider
        return () => clientPromise;
    })
        .inSingletonScope();
    bind(ovsx_client_1.OVSXApiFilter)
        .toDynamicValue(ctx => {
        const vsxEnvironment = ctx.container.get(vsx_environment_1.VSXEnvironment);
        const apiFilter = new ovsx_client_1.OVSXApiFilterImpl('-- temporary invalid version value --');
        vsxEnvironment.getVscodeApiVersion()
            .then(apiVersion => apiFilter.supportedApiVersion = apiVersion);
        return apiFilter;
    })
        .inSingletonScope();
});

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/vsx-registry/lib/common/vsx-registry-common-module'] = this;


/***/ })

}]);
//# sourceMappingURL=packages_vsx-registry_lib_common_vsx-registry-common-module_js.js.map