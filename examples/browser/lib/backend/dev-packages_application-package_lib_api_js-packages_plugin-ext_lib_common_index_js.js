"use strict";
exports.id = "dev-packages_application-package_lib_api_js-packages_plugin-ext_lib_common_index_js";
exports.ids = ["dev-packages_application-package_lib_api_js-packages_plugin-ext_lib_common_index_js"];
exports.modules = {

/***/ "../../dev-packages/application-package/lib/api.js":
/*!*********************************************************!*\
  !*** ../../dev-packages/application-package/lib/api.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports) => {


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
exports.DEFAULT_SUPPORTED_API_VERSION = void 0;
/**
 * The default supported API version the framework supports.
 * The version should be in the format `x.y.z`.
 */
exports.DEFAULT_SUPPORTED_API_VERSION = '1.80.0';


/***/ }),

/***/ "../../packages/plugin-ext/lib/common/index.js":
/*!*****************************************************!*\
  !*** ../../packages/plugin-ext/lib/common/index.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2018 Red Hat, Inc. and others.
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
// Here we expose types from @theia/plugin, so it becomes a direct dependency
__exportStar(__webpack_require__(/*! ./plugin-protocol */ "../../packages/plugin-ext/lib/common/plugin-protocol.js"), exports);
__exportStar(__webpack_require__(/*! ./plugin-api-rpc */ "../../packages/plugin-ext/lib/common/plugin-api-rpc.js"), exports);
__exportStar(__webpack_require__(/*! ./plugin-ext-api-contribution */ "../../packages/plugin-ext/lib/common/plugin-ext-api-contribution.js"), exports);
const rpc_protocol_1 = __webpack_require__(/*! ./rpc-protocol */ "../../packages/plugin-ext/lib/common/rpc-protocol.js");
(0, rpc_protocol_1.registerMsgPackExtensions)();


/***/ }),

/***/ "../../packages/plugin-ext/lib/common/plugin-ext-api-contribution.js":
/*!***************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/common/plugin-ext-api-contribution.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MainPluginApiProvider = exports.ExtPluginApiProvider = void 0;
exports.ExtPluginApiProvider = 'extPluginApi';
exports.MainPluginApiProvider = Symbol('mainPluginApi');


/***/ }),

/***/ "../../packages/plugin-ext/lib/common/plugin-identifiers.js":
/*!******************************************************************!*\
  !*** ../../packages/plugin-ext/lib/common/plugin-identifiers.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, exports) => {


// *****************************************************************************
// Copyright (C) 2022 Ericsson and others.
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
exports.PluginIdentifiers = void 0;
var PluginIdentifiers;
(function (PluginIdentifiers) {
    /** Unpublished plugins (not from Open VSX or VSCode plugin store) may not have a `publisher` field. */
    PluginIdentifiers.UNPUBLISHED = '<unpublished>';
    /**
     * @returns a string in the format `<publisher>.<name>`
     */
    function componentsToUnversionedId({ publisher = PluginIdentifiers.UNPUBLISHED, name }) {
        return `${publisher.toLowerCase()}.${name.toLowerCase()}`;
    }
    PluginIdentifiers.componentsToUnversionedId = componentsToUnversionedId;
    /**
     * @returns a string in the format `<publisher>.<name>@<version>`.
     */
    function componentsToVersionedId({ publisher = PluginIdentifiers.UNPUBLISHED, name, version }) {
        return `${publisher.toLowerCase()}.${name.toLowerCase()}@${version}`;
    }
    PluginIdentifiers.componentsToVersionedId = componentsToVersionedId;
    function componentsToVersionWithId(components) {
        return { id: componentsToUnversionedId(components), version: components.version };
    }
    PluginIdentifiers.componentsToVersionWithId = componentsToVersionWithId;
    /**
     * @returns a string in the format `<id>@<version>`.
     */
    function idAndVersionToVersionedId({ id, version }) {
        return `${id}@${version}`;
    }
    PluginIdentifiers.idAndVersionToVersionedId = idAndVersionToVersionedId;
    /**
     * @returns a string in the format `<publisher>.<name>`.
     */
    function unversionedFromVersioned(id) {
        const endOfId = id.indexOf('@');
        return id.slice(0, endOfId);
    }
    PluginIdentifiers.unversionedFromVersioned = unversionedFromVersioned;
    /**
     * @returns `undefined` if it looks like the string passed in does not have the format returned by {@link PluginIdentifiers.toVersionedId}.
     */
    function identifiersFromVersionedId(probablyId) {
        const endOfPublisher = probablyId.indexOf('.');
        const endOfName = probablyId.indexOf('@', endOfPublisher);
        if (endOfPublisher === -1 || endOfName === -1) {
            return undefined;
        }
        return { publisher: probablyId.slice(0, endOfPublisher), name: probablyId.slice(endOfPublisher + 1, endOfName), version: probablyId.slice(endOfName + 1) };
    }
    PluginIdentifiers.identifiersFromVersionedId = identifiersFromVersionedId;
    /**
     * @returns `undefined` if it looks like the string passed in does not have the format returned by {@link PluginIdentifiers.toVersionedId}.
     */
    function idAndVersionFromVersionedId(probablyId) {
        const endOfPublisher = probablyId.indexOf('.');
        const endOfName = probablyId.indexOf('@', endOfPublisher);
        if (endOfPublisher === -1 || endOfName === -1) {
            return undefined;
        }
        return { id: probablyId.slice(0, endOfName), version: probablyId.slice(endOfName + 1) };
    }
    PluginIdentifiers.idAndVersionFromVersionedId = idAndVersionFromVersionedId;
})(PluginIdentifiers = exports.PluginIdentifiers || (exports.PluginIdentifiers = {}));


/***/ }),

/***/ "../../packages/plugin-ext/lib/common/plugin-protocol.js":
/*!***************************************************************!*\
  !*** ../../packages/plugin-ext/lib/common/plugin-protocol.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PluginHostEnvironmentVariable = exports.ServerPluginRunner = exports.PluginServer = exports.pluginServerJsonRpcPath = exports.PLUGIN_HOST_BACKEND = exports.HostedPluginServer = exports.PluginDeployerHandler = exports.HostedPluginClient = exports.buildFrontendModuleName = exports.getPluginId = exports.MetadataProcessor = exports.PluginType = exports.PluginDeployerEntryType = exports.PluginDeployerParticipant = exports.PluginDeployer = exports.PluginDeployerFileHandler = exports.PluginDeployerDirectoryHandler = exports.PluginDeployerResolver = exports.PluginScanner = exports.PluginViewType = exports.CustomEditorPriority = exports.PluginPackage = exports.hostedServicePath = exports.PluginIdentifiers = void 0;
const plugin_identifiers_1 = __webpack_require__(/*! ./plugin-identifiers */ "../../packages/plugin-ext/lib/common/plugin-identifiers.js");
Object.defineProperty(exports, "PluginIdentifiers", ({ enumerable: true, get: function () { return plugin_identifiers_1.PluginIdentifiers; } }));
exports.hostedServicePath = '/services/hostedPlugin';
var PluginPackage;
(function (PluginPackage) {
    function toPluginUrl(pck, relativePath) {
        return `hostedPlugin/${getPluginId(pck)}/${encodeURIComponent(relativePath)}`;
    }
    PluginPackage.toPluginUrl = toPluginUrl;
})(PluginPackage = exports.PluginPackage || (exports.PluginPackage = {}));
var CustomEditorPriority;
(function (CustomEditorPriority) {
    CustomEditorPriority["default"] = "default";
    CustomEditorPriority["builtin"] = "builtin";
    CustomEditorPriority["option"] = "option";
})(CustomEditorPriority = exports.CustomEditorPriority || (exports.CustomEditorPriority = {}));
var PluginViewType;
(function (PluginViewType) {
    PluginViewType["Tree"] = "tree";
    PluginViewType["Webview"] = "webview";
})(PluginViewType = exports.PluginViewType || (exports.PluginViewType = {}));
exports.PluginScanner = Symbol('PluginScanner');
/**
 * A plugin resolver is handling how to resolve a plugin link into a local resource.
 */
exports.PluginDeployerResolver = Symbol('PluginDeployerResolver');
exports.PluginDeployerDirectoryHandler = Symbol('PluginDeployerDirectoryHandler');
exports.PluginDeployerFileHandler = Symbol('PluginDeployerFileHandler');
exports.PluginDeployer = Symbol('PluginDeployer');
exports.PluginDeployerParticipant = Symbol('PluginDeployerParticipant');
var PluginDeployerEntryType;
(function (PluginDeployerEntryType) {
    PluginDeployerEntryType[PluginDeployerEntryType["FRONTEND"] = 0] = "FRONTEND";
    PluginDeployerEntryType[PluginDeployerEntryType["BACKEND"] = 1] = "BACKEND";
})(PluginDeployerEntryType = exports.PluginDeployerEntryType || (exports.PluginDeployerEntryType = {}));
/**
 * Whether a plugin installed by a user or system.
 */
var PluginType;
(function (PluginType) {
    PluginType[PluginType["System"] = 0] = "System";
    PluginType[PluginType["User"] = 1] = "User";
})(PluginType = exports.PluginType || (exports.PluginType = {}));
;
exports.MetadataProcessor = Symbol('MetadataProcessor');
function getPluginId(plugin) {
    return `${plugin.publisher}_${plugin.name}`.replace(/\W/g, '_');
}
exports.getPluginId = getPluginId;
function buildFrontendModuleName(plugin) {
    return `${plugin.publisher}_${plugin.name}`.replace(/\W/g, '_');
}
exports.buildFrontendModuleName = buildFrontendModuleName;
exports.HostedPluginClient = Symbol('HostedPluginClient');
exports.PluginDeployerHandler = Symbol('PluginDeployerHandler');
exports.HostedPluginServer = Symbol('HostedPluginServer');
exports.PLUGIN_HOST_BACKEND = 'main';
/**
 * The JSON-RPC workspace interface.
 */
exports.pluginServerJsonRpcPath = '/services/plugin-ext';
exports.PluginServer = Symbol('PluginServer');
exports.ServerPluginRunner = Symbol('ServerPluginRunner');
exports.PluginHostEnvironmentVariable = Symbol('PluginHostEnvironmentVariable');


/***/ })

};
;
//# sourceMappingURL=dev-packages_application-package_lib_api_js-packages_plugin-ext_lib_common_index_js.js.map