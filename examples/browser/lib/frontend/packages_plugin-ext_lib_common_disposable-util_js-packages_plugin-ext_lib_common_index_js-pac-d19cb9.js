"use strict";
(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_plugin-ext_lib_common_disposable-util_js-packages_plugin-ext_lib_common_index_js-pac-d19cb9"],{

/***/ "../../packages/notebook/lib/common/index.js":
/*!***************************************************!*\
  !*** ../../packages/notebook/lib/common/index.js ***!
  \***************************************************/
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
__exportStar(__webpack_require__(/*! ./notebook-common */ "../../packages/notebook/lib/common/notebook-common.js"), exports);
__exportStar(__webpack_require__(/*! ./notebook-range */ "../../packages/notebook/lib/common/notebook-range.js"), exports);

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/notebook/lib/common'] = this;


/***/ }),

/***/ "../../packages/notebook/lib/common/notebook-common.js":
/*!*************************************************************!*\
  !*** ../../packages/notebook/lib/common/notebook-common.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

/* provided dependency */ var Buffer = __webpack_require__(/*! buffer */ "../../node_modules/buffer/index.js")["Buffer"];

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
exports.CellUri = exports.isTextStreamMime = exports.CellExecutionUpdateType = exports.NotebookCellExecutionState = exports.SelectionStateType = exports.NotebookCellsChangeType = exports.CellKind = void 0;
const buffer_1 = __webpack_require__(/*! @theia/core/lib/common/buffer */ "../../packages/core/lib/common/buffer.js");
var CellKind;
(function (CellKind) {
    CellKind[CellKind["Markup"] = 1] = "Markup";
    CellKind[CellKind["Code"] = 2] = "Code";
})(CellKind = exports.CellKind || (exports.CellKind = {}));
;
var NotebookCellsChangeType;
(function (NotebookCellsChangeType) {
    NotebookCellsChangeType[NotebookCellsChangeType["ModelChange"] = 1] = "ModelChange";
    NotebookCellsChangeType[NotebookCellsChangeType["Move"] = 2] = "Move";
    NotebookCellsChangeType[NotebookCellsChangeType["ChangeCellLanguage"] = 5] = "ChangeCellLanguage";
    NotebookCellsChangeType[NotebookCellsChangeType["Initialize"] = 6] = "Initialize";
    NotebookCellsChangeType[NotebookCellsChangeType["ChangeCellMetadata"] = 7] = "ChangeCellMetadata";
    NotebookCellsChangeType[NotebookCellsChangeType["Output"] = 8] = "Output";
    NotebookCellsChangeType[NotebookCellsChangeType["OutputItem"] = 9] = "OutputItem";
    NotebookCellsChangeType[NotebookCellsChangeType["ChangeCellContent"] = 10] = "ChangeCellContent";
    NotebookCellsChangeType[NotebookCellsChangeType["ChangeDocumentMetadata"] = 11] = "ChangeDocumentMetadata";
    NotebookCellsChangeType[NotebookCellsChangeType["ChangeCellInternalMetadata"] = 12] = "ChangeCellInternalMetadata";
    // ChangeCellMime = 13,
    NotebookCellsChangeType[NotebookCellsChangeType["Unknown"] = 100] = "Unknown";
})(NotebookCellsChangeType = exports.NotebookCellsChangeType || (exports.NotebookCellsChangeType = {}));
var SelectionStateType;
(function (SelectionStateType) {
    SelectionStateType[SelectionStateType["Handle"] = 0] = "Handle";
    SelectionStateType[SelectionStateType["Index"] = 1] = "Index";
})(SelectionStateType = exports.SelectionStateType || (exports.SelectionStateType = {}));
;
;
;
var NotebookCellExecutionState;
(function (NotebookCellExecutionState) {
    NotebookCellExecutionState[NotebookCellExecutionState["Unconfirmed"] = 1] = "Unconfirmed";
    NotebookCellExecutionState[NotebookCellExecutionState["Pending"] = 2] = "Pending";
    NotebookCellExecutionState[NotebookCellExecutionState["Executing"] = 3] = "Executing";
})(NotebookCellExecutionState = exports.NotebookCellExecutionState || (exports.NotebookCellExecutionState = {}));
var CellExecutionUpdateType;
(function (CellExecutionUpdateType) {
    CellExecutionUpdateType[CellExecutionUpdateType["Output"] = 1] = "Output";
    CellExecutionUpdateType[CellExecutionUpdateType["OutputItems"] = 2] = "OutputItems";
    CellExecutionUpdateType[CellExecutionUpdateType["ExecutionState"] = 3] = "ExecutionState";
})(CellExecutionUpdateType = exports.CellExecutionUpdateType || (exports.CellExecutionUpdateType = {}));
/**
 * Whether the provided mime type is a text stream like `stdout`, `stderr`.
 */
function isTextStreamMime(mimeType) {
    return ['application/vnd.code.notebook.stdout', 'application/vnd.code.notebook.stderr'].includes(mimeType);
}
exports.isTextStreamMime = isTextStreamMime;
var CellUri;
(function (CellUri) {
    CellUri.scheme = 'vscode-notebook-cell';
    const _lengths = ['W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f'];
    const _padRegexp = new RegExp(`^[${_lengths.join('')}]+`);
    const _radix = 7;
    function generate(notebook, handle) {
        const s = handle.toString(_radix);
        const p = s.length < _lengths.length ? _lengths[s.length - 1] : 'z';
        const fragment = `${p}${s}s${Buffer.from(buffer_1.BinaryBuffer.fromString(notebook.scheme).buffer).toString('base64')} `;
        return notebook.withScheme(CellUri.scheme).withFragment(fragment);
    }
    CellUri.generate = generate;
    function parse(cell) {
        if (cell.scheme !== CellUri.scheme) {
            return undefined;
        }
        const idx = cell.fragment.indexOf('s');
        if (idx < 0) {
            return undefined;
        }
        const handle = parseInt(cell.fragment.substring(0, idx).replace(_padRegexp, ''), _radix);
        const parsedScheme = Buffer.from(cell.fragment.substring(idx + 1), 'base64').toString();
        if (isNaN(handle)) {
            return undefined;
        }
        return {
            handle,
            notebook: cell.withScheme(parsedScheme).withoutFragment()
        };
    }
    CellUri.parse = parse;
    function generateCellPropertyUri(notebook, handle, cellScheme) {
        return CellUri.generate(notebook, handle).withScheme(cellScheme);
    }
    CellUri.generateCellPropertyUri = generateCellPropertyUri;
    function parseCellPropertyUri(uri, propertyScheme) {
        if (uri.scheme !== propertyScheme) {
            return undefined;
        }
        return CellUri.parse(uri.withScheme(CellUri.scheme));
    }
    CellUri.parseCellPropertyUri = parseCellPropertyUri;
})(CellUri = exports.CellUri || (exports.CellUri = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/notebook/lib/common/notebook-common'] = this;


/***/ }),

/***/ "../../packages/notebook/lib/common/notebook-range.js":
/*!************************************************************!*\
  !*** ../../packages/notebook/lib/common/notebook-range.js ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, exports) {


// *****************************************************************************
// Copyright (C) 2023 Typefox and others.
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

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/notebook/lib/common/notebook-range'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/common/arrays.js":
/*!******************************************************!*\
  !*** ../../packages/plugin-ext/lib/common/arrays.js ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports) {


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
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// based on https://github.com/microsoft/vscode/blob/04c36be045a94fee58e5f8992d3e3fd980294a84/src/vs/base/common/arrays.ts
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isReadonlyArray = exports.flatten = exports.isNonEmptyArray = exports.coalesce = void 0;
/**
 * @returns New array with all falsy values removed. The original array IS NOT modified.
 */
function coalesce(array) {
    return array.filter(e => !!e);
}
exports.coalesce = coalesce;
function isNonEmptyArray(obj) {
    return Array.isArray(obj) && obj.length > 0;
}
exports.isNonEmptyArray = isNonEmptyArray;
function flatten(arr) {
    return [].concat(...arr);
}
exports.flatten = flatten;
/**
 * @returns 'true' if the 'arg' is a 'ReadonlyArray'.
 */
function isReadonlyArray(arg) {
    // Since Typescript does not properly narrow down typings for 'ReadonlyArray' we need to help it.
    return Array.isArray(arg);
}
exports.isReadonlyArray = isReadonlyArray;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/common/arrays'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/common/disposable-util.js":
/*!***************************************************************!*\
  !*** ../../packages/plugin-ext/lib/common/disposable-util.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, exports) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.dispose = void 0;
function dispose(first, ...rest) {
    if (Array.isArray(first)) {
        first.forEach(d => d && d.dispose());
        return [];
    }
    else if (rest.length === 0) {
        if (first) {
            first.dispose();
            return first;
        }
        return undefined;
    }
    else {
        dispose(first);
        dispose(rest);
        return [];
    }
}
exports.dispose = dispose;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/common/disposable-util'] = this;


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

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/common'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/common/plugin-ext-api-contribution.js":
/*!***************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/common/plugin-ext-api-contribution.js ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MainPluginApiProvider = exports.ExtPluginApiProvider = void 0;
exports.ExtPluginApiProvider = 'extPluginApi';
exports.MainPluginApiProvider = Symbol('mainPluginApi');

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/common/plugin-ext-api-contribution'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/common/plugin-identifiers.js":
/*!******************************************************************!*\
  !*** ../../packages/plugin-ext/lib/common/plugin-identifiers.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports) {


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

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/common/plugin-identifiers'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/common/plugin-protocol.js":
/*!***************************************************************!*\
  !*** ../../packages/plugin-ext/lib/common/plugin-protocol.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/common/plugin-protocol'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/common/uri-components.js":
/*!**************************************************************!*\
  !*** ../../packages/plugin-ext/lib/common/uri-components.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, exports) {


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
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.theiaUritoUriComponents = exports.Schemes = void 0;
// some well known URI schemas
// based on https://github.com/microsoft/vscode/blob/04c36be045a94fee58e5f8992d3e3fd980294a84/src/vs/base/common/network.ts#L9-L79
// TODO move to network.ts file
var Schemes;
(function (Schemes) {
    /**
     * A schema that is used for models that exist in memory
     * only and that have no correspondence on a server or such.
     */
    Schemes.inMemory = 'inmemory';
    /**
     * A schema that is used for setting files
     */
    Schemes.vscode = 'vscode';
    /**
     * A schema that is used for internal private files
     */
    Schemes.internal = 'private';
    /**
     * A walk-through document.
     */
    Schemes.walkThrough = 'walkThrough';
    /**
     * An embedded code snippet.
     */
    Schemes.walkThroughSnippet = 'walkThroughSnippet';
    Schemes.http = 'http';
    Schemes.https = 'https';
    Schemes.file = 'file';
    Schemes.mailto = 'mailto';
    Schemes.untitled = 'untitled';
    Schemes.data = 'data';
    Schemes.command = 'command';
    Schemes.vscodeRemote = 'vscode-remote';
    Schemes.vscodeRemoteResource = 'vscode-remote-resource';
    Schemes.userData = 'vscode-userdata';
    Schemes.vscodeCustomEditor = 'vscode-custom-editor';
    Schemes.vscodeSettings = 'vscode-settings';
    Schemes.webviewPanel = 'webview-panel';
})(Schemes = exports.Schemes || (exports.Schemes = {}));
function theiaUritoUriComponents(uri) {
    return uri.toComponents();
}
exports.theiaUritoUriComponents = theiaUritoUriComponents;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/common/uri-components'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/plugin/markdown-string.js":
/*!***************************************************************!*\
  !*** ../../packages/plugin-ext/lib/plugin/markdown-string.js ***!
  \***************************************************************/
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _MarkdownString_delegate;
var MarkdownString_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MarkdownString = void 0;
const markdown_rendering_1 = __webpack_require__(/*! @theia/core/lib/common/markdown-rendering */ "../../packages/core/lib/common/markdown-rendering/index.js");
const types_1 = __webpack_require__(/*! ../common/types */ "../../packages/plugin-ext/lib/common/types.js");
const types_impl_1 = __webpack_require__(/*! ./types-impl */ "../../packages/plugin-ext/lib/plugin/types-impl.js");
// Copied from https://github.com/microsoft/vscode/blob/7d9b1c37f8e5ae3772782ba3b09d827eb3fdd833/src/vs/workbench/api/common/extHostTypes.ts
let MarkdownString = MarkdownString_1 = class MarkdownString {
    constructor(value, supportThemeIcons = false) {
        _MarkdownString_delegate.set(this, void 0);
        __classPrivateFieldSet(this, _MarkdownString_delegate, new markdown_rendering_1.MarkdownStringImpl(value, { supportThemeIcons }), "f");
    }
    /**
     * @returns whether the thing is a markdown string implementation with helper methods.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static isMarkdownString(thing) {
        if (thing instanceof MarkdownString_1) {
            return true;
        }
        return thing && thing.appendCodeblock && thing.appendMarkdown && thing.appendText && (thing.value !== undefined);
    }
    get value() {
        return __classPrivateFieldGet(this, _MarkdownString_delegate, "f").value;
    }
    set value(value) {
        __classPrivateFieldGet(this, _MarkdownString_delegate, "f").value = value;
    }
    get isTrusted() {
        return __classPrivateFieldGet(this, _MarkdownString_delegate, "f").isTrusted;
    }
    set isTrusted(value) {
        __classPrivateFieldGet(this, _MarkdownString_delegate, "f").isTrusted = value;
    }
    get supportThemeIcons() {
        return __classPrivateFieldGet(this, _MarkdownString_delegate, "f").supportThemeIcons;
    }
    set supportThemeIcons(value) {
        __classPrivateFieldGet(this, _MarkdownString_delegate, "f").supportThemeIcons = value;
    }
    get supportHtml() {
        return __classPrivateFieldGet(this, _MarkdownString_delegate, "f").supportHtml;
    }
    set supportHtml(value) {
        __classPrivateFieldGet(this, _MarkdownString_delegate, "f").supportHtml = value;
    }
    get baseUri() {
        return types_impl_1.URI.revive(__classPrivateFieldGet(this, _MarkdownString_delegate, "f").baseUri);
    }
    set baseUri(value) {
        __classPrivateFieldGet(this, _MarkdownString_delegate, "f").baseUri = value;
    }
    appendText(value) {
        __classPrivateFieldGet(this, _MarkdownString_delegate, "f").appendText(value);
        return this;
    }
    appendMarkdown(value) {
        __classPrivateFieldGet(this, _MarkdownString_delegate, "f").appendMarkdown(value);
        return this;
    }
    appendCodeblock(value, language) {
        __classPrivateFieldGet(this, _MarkdownString_delegate, "f").appendCodeblock(language !== null && language !== void 0 ? language : '', value);
        return this;
    }
    toJSON() {
        const plainObject = { value: this.value };
        if (this.isTrusted !== undefined) {
            plainObject.isTrusted = this.isTrusted;
        }
        if (this.supportThemeIcons !== undefined) {
            plainObject.supportThemeIcons = this.supportThemeIcons;
        }
        if (this.supportHtml !== undefined) {
            plainObject.supportHtml = this.supportHtml;
        }
        if (this.baseUri !== undefined) {
            plainObject.baseUri = this.baseUri.toJSON();
        }
        return plainObject;
    }
};
_MarkdownString_delegate = new WeakMap();
MarkdownString = MarkdownString_1 = __decorate([
    types_1.es5ClassCompat,
    __metadata("design:paramtypes", [String, Boolean])
], MarkdownString);
exports.MarkdownString = MarkdownString;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/plugin/markdown-string'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/plugin/type-converters.js":
/*!***************************************************************!*\
  !*** ../../packages/plugin-ext/lib/plugin/type-converters.js ***!
  \***************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fromHierarchyItem = exports.toLocation = exports.isModelCallHierarchyOutgoingCall = exports.isModelCallHierarchyIncomingCall = exports.isModelCallHierarchyItem = exports.isUriComponents = exports.isModelRange = exports.isModelLocation = exports.toSymbolTag = exports.fromSymbolTag = exports.toDocumentSymbol = exports.fromDocumentSymbol = exports.toCodeActionTriggerKind = exports.SymbolKind = exports.fromWorkspaceEdit = exports.SignatureHelp = exports.SignatureInformation = exports.ParameterInformation = exports.fromDocumentHighlight = exports.fromDocumentHighlightKind = exports.DocumentLink = exports.fromDefinitionLink = exports.fromTextDocumentShowOptions = exports.fromLocation = exports.toInlineValueContext = exports.fromInlineValue = exports.fromEvaluatableExpression = exports.fromHover = exports.convertCode = exports.convertDiagnosticToMarkerData = exports.fromTextEdit = exports.toCompletionItemKind = exports.fromCompletionItemKind = exports.fromGlobPattern = exports.fromDocumentSelector = exports.toMarkdown = exports.fromMarkdownOrString = exports.fromMarkdown = exports.fromManyMarkdown = exports.fromRangeOrRangeWithMessage = exports.isDecorationOptionsArr = exports.toPosition = exports.fromPosition = exports.fromRange = exports.toRange = exports.fromSelection = exports.toSelection = exports.toWebviewPanelShowOptions = exports.fromViewColumn = exports.toViewColumn = void 0;
exports.NotebookDto = exports.NotebookKernelSourceAction = exports.NotebookRange = exports.NotebookCellExecutionSummary = exports.NotebookCellOutputConverter = exports.NotebookCellOutputItem = exports.NotebookCellOutput = exports.NotebookCellKind = exports.NotebookCellData = exports.NotebookData = exports.NotebookStatusBarItem = exports.NotebookDocumentContentOptions = exports.DataTransfer = exports.DataTransferItem = exports.InlayHintKind = exports.pluginToPluginInfo = exports.pathOrURIToURI = exports.ViewColumn = exports.ThemableDecorationAttachmentRenderOptions = exports.ThemableDecorationRenderOptions = exports.DecorationRangeBehavior = exports.DecorationRenderOptions = exports.convertToTransferQuickPickItems = exports.fromColorPresentation = exports.toColor = exports.fromColor = exports.fromFoldingRangeKind = exports.fromFoldingRange = exports.fromSelectionRange = exports.toSymbolInformation = exports.fromSymbolInformation = exports.getShellExecutionOptions = exports.getShellArgs = exports.getCustomExecution = exports.getShellExecution = exports.getProcessExecution = exports.fromCustomExecution = exports.fromShellExecution = exports.fromProcessExecution = exports.toTask = exports.fromTask = exports.toWorkspaceFolder = exports.toTypeHierarchyItem = exports.fromTypeHierarchyItem = exports.isModelTypeHierarchyItem = exports.toCallHierarchyOutgoingCall = exports.toCallHierarchyIncomingCall = exports.toCallHierarchyItem = exports.fromCallHierarchyItem = void 0;
const lstypes = __webpack_require__(/*! @theia/core/shared/vscode-languageserver-protocol */ "../../packages/core/shared/vscode-languageserver-protocol/index.js");
const types_impl_1 = __webpack_require__(/*! ./types-impl */ "../../packages/plugin-ext/lib/plugin/types-impl.js");
const rpc = __webpack_require__(/*! ../common/plugin-api-rpc */ "../../packages/plugin-ext/lib/common/plugin-api-rpc.js");
const plugin_api_rpc_1 = __webpack_require__(/*! ../common/plugin-api-rpc */ "../../packages/plugin-ext/lib/common/plugin-api-rpc.js");
const model = __webpack_require__(/*! ../common/plugin-api-rpc-model */ "../../packages/plugin-ext/lib/common/plugin-api-rpc-model.js");
const markdown_string_1 = __webpack_require__(/*! ./markdown-string */ "../../packages/plugin-ext/lib/plugin/markdown-string.js");
const types = __webpack_require__(/*! ./types-impl */ "../../packages/plugin-ext/lib/plugin/types-impl.js");
const arrays_1 = __webpack_require__(/*! ../common/arrays */ "../../packages/plugin-ext/lib/common/arrays.js");
const markdown_rendering_1 = __webpack_require__(/*! @theia/core/lib/common/markdown-rendering */ "../../packages/core/lib/common/markdown-rendering/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const notebooks = __webpack_require__(/*! @theia/notebook/lib/common */ "../../packages/notebook/lib/common/index.js");
const buffer_1 = __webpack_require__(/*! @theia/core/lib/common/buffer */ "../../packages/core/lib/common/buffer.js");
const common_2 = __webpack_require__(/*! @theia/notebook/lib/common */ "../../packages/notebook/lib/common/index.js");
const SIDE_GROUP = -2;
const ACTIVE_GROUP = -1;
function toViewColumn(ep) {
    if (typeof ep !== 'number') {
        return undefined;
    }
    if (ep === plugin_api_rpc_1.EditorPosition.ONE) {
        return types.ViewColumn.One;
    }
    else if (ep === plugin_api_rpc_1.EditorPosition.TWO) {
        return types.ViewColumn.Two;
    }
    else if (ep === plugin_api_rpc_1.EditorPosition.THREE) {
        return types.ViewColumn.Three;
    }
    else if (ep === plugin_api_rpc_1.EditorPosition.FOUR) {
        return types.ViewColumn.Four;
    }
    else if (ep === plugin_api_rpc_1.EditorPosition.FIVE) {
        return types.ViewColumn.Five;
    }
    else if (ep === plugin_api_rpc_1.EditorPosition.SIX) {
        return types.ViewColumn.Six;
    }
    else if (ep === plugin_api_rpc_1.EditorPosition.SEVEN) {
        return types.ViewColumn.Seven;
    }
    else if (ep === plugin_api_rpc_1.EditorPosition.EIGHT) {
        return types.ViewColumn.Eight;
    }
    else if (ep === plugin_api_rpc_1.EditorPosition.NINE) {
        return types.ViewColumn.Nine;
    }
    return undefined;
}
exports.toViewColumn = toViewColumn;
function fromViewColumn(column) {
    if (typeof column === 'number' && column >= types.ViewColumn.One) {
        return column - 1;
    }
    if (column === types.ViewColumn.Beside) {
        return SIDE_GROUP;
    }
    return ACTIVE_GROUP;
}
exports.fromViewColumn = fromViewColumn;
function toWebviewPanelShowOptions(options) {
    if (typeof options === 'object') {
        const showOptions = options;
        return {
            area: showOptions.area ? showOptions.area : types.WebviewPanelTargetArea.Main,
            viewColumn: showOptions.viewColumn ? fromViewColumn(showOptions.viewColumn) : undefined,
            preserveFocus: showOptions.preserveFocus ? showOptions.preserveFocus : false
        };
    }
    return {
        area: types.WebviewPanelTargetArea.Main,
        viewColumn: fromViewColumn(options),
        preserveFocus: false
    };
}
exports.toWebviewPanelShowOptions = toWebviewPanelShowOptions;
function toSelection(selection) {
    const { selectionStartLineNumber, selectionStartColumn, positionLineNumber, positionColumn } = selection;
    const start = new types.Position(selectionStartLineNumber - 1, selectionStartColumn - 1);
    const end = new types.Position(positionLineNumber - 1, positionColumn - 1);
    return new types.Selection(start, end);
}
exports.toSelection = toSelection;
function fromSelection(selection) {
    const { active, anchor } = selection;
    return {
        selectionStartLineNumber: anchor.line + 1,
        selectionStartColumn: anchor.character + 1,
        positionLineNumber: active.line + 1,
        positionColumn: active.character + 1
    };
}
exports.fromSelection = fromSelection;
function toRange(range) {
    const { startLineNumber, startColumn, endLineNumber, endColumn } = range;
    return new types.Range(startLineNumber - 1, startColumn - 1, endLineNumber - 1, endColumn - 1);
}
exports.toRange = toRange;
function fromRange(range) {
    if (!range) {
        return undefined;
    }
    const { start, end } = range;
    return {
        startLineNumber: start.line + 1,
        startColumn: start.character + 1,
        endLineNumber: end.line + 1,
        endColumn: end.character + 1
    };
}
exports.fromRange = fromRange;
function fromPosition(position) {
    return { lineNumber: position.line + 1, column: position.character + 1 };
}
exports.fromPosition = fromPosition;
function toPosition(position) {
    return new types.Position(position.lineNumber - 1, position.column - 1);
}
exports.toPosition = toPosition;
function isDecorationOptions(arg) {
    return (0, common_1.isObject)(arg) && typeof arg.range !== 'undefined';
}
function isDecorationOptionsArr(something) {
    if (something.length === 0) {
        return true;
    }
    return isDecorationOptions(something[0]) ? true : false;
}
exports.isDecorationOptionsArr = isDecorationOptionsArr;
function fromRangeOrRangeWithMessage(ranges) {
    if (isDecorationOptionsArr(ranges)) {
        return ranges.map(r => {
            let hoverMessage;
            if (Array.isArray(r.hoverMessage)) {
                hoverMessage = fromManyMarkdown(r.hoverMessage);
            }
            else if (r.hoverMessage) {
                hoverMessage = fromMarkdown(r.hoverMessage);
            }
            else {
                hoverMessage = undefined;
            }
            return {
                range: fromRange(r.range),
                hoverMessage: hoverMessage,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                renderOptions: r.renderOptions
            };
        });
    }
    else {
        return ranges.map(r => ({ range: fromRange(r) }));
    }
}
exports.fromRangeOrRangeWithMessage = fromRangeOrRangeWithMessage;
function fromManyMarkdown(markup) {
    return markup.map(fromMarkdown);
}
exports.fromManyMarkdown = fromManyMarkdown;
function isCodeblock(arg) {
    return (0, common_1.isObject)(arg)
        && typeof arg.language === 'string'
        && typeof arg.value === 'string';
}
function fromMarkdown(markup) {
    if (isCodeblock(markup)) {
        const { language, value } = markup;
        return { value: '```' + language + '\n' + value + '\n```\n' };
    }
    else if (markup instanceof markdown_string_1.MarkdownString) {
        return markup.toJSON();
    }
    else if (markdown_rendering_1.MarkdownString.is(markup)) {
        return markup;
    }
    else if (typeof markup === 'string') {
        return { value: markup };
    }
    else {
        return { value: '' };
    }
}
exports.fromMarkdown = fromMarkdown;
function fromMarkdownOrString(value) {
    if (value === undefined) {
        return undefined;
    }
    else if (typeof value === 'string') {
        return value;
    }
    else {
        return fromMarkdown(value);
    }
}
exports.fromMarkdownOrString = fromMarkdownOrString;
function toMarkdown(value) {
    const implemented = new markdown_string_1.MarkdownString(value.value, value.supportThemeIcons);
    implemented.isTrusted = value.isTrusted;
    implemented.supportHtml = value.supportHtml;
    implemented.baseUri = value.baseUri && types_impl_1.URI.revive(implemented.baseUri);
    return implemented;
}
exports.toMarkdown = toMarkdown;
function fromDocumentSelector(selector) {
    if (!selector) {
        return undefined;
    }
    else if ((0, arrays_1.isReadonlyArray)(selector)) {
        return selector.map(fromDocumentSelector);
    }
    else if (typeof selector === 'string') {
        return selector;
    }
    else {
        return {
            language: selector.language,
            scheme: selector.scheme,
            pattern: fromGlobPattern(selector.pattern)
        };
    }
}
exports.fromDocumentSelector = fromDocumentSelector;
function fromGlobPattern(pattern) {
    if (typeof pattern === 'string') {
        return pattern;
    }
    if (isRelativePattern(pattern)) {
        return new types.RelativePattern(pattern.baseUri, pattern.pattern);
    }
    return pattern;
}
exports.fromGlobPattern = fromGlobPattern;
function isRelativePattern(obj) {
    const rp = obj;
    return rp && typeof rp.baseUri === 'string' && typeof rp.pattern === 'string';
}
function fromCompletionItemKind(kind) {
    switch (kind) {
        case types.CompletionItemKind.Method: return model.CompletionItemKind.Method;
        case types.CompletionItemKind.Function: return model.CompletionItemKind.Function;
        case types.CompletionItemKind.Constructor: return model.CompletionItemKind.Constructor;
        case types.CompletionItemKind.Field: return model.CompletionItemKind.Field;
        case types.CompletionItemKind.Variable: return model.CompletionItemKind.Variable;
        case types.CompletionItemKind.Class: return model.CompletionItemKind.Class;
        case types.CompletionItemKind.Interface: return model.CompletionItemKind.Interface;
        case types.CompletionItemKind.Struct: return model.CompletionItemKind.Struct;
        case types.CompletionItemKind.Module: return model.CompletionItemKind.Module;
        case types.CompletionItemKind.Property: return model.CompletionItemKind.Property;
        case types.CompletionItemKind.Unit: return model.CompletionItemKind.Unit;
        case types.CompletionItemKind.Value: return model.CompletionItemKind.Value;
        case types.CompletionItemKind.Constant: return model.CompletionItemKind.Constant;
        case types.CompletionItemKind.Enum: return model.CompletionItemKind.Enum;
        case types.CompletionItemKind.EnumMember: return model.CompletionItemKind.EnumMember;
        case types.CompletionItemKind.Keyword: return model.CompletionItemKind.Keyword;
        case types.CompletionItemKind.Snippet: return model.CompletionItemKind.Snippet;
        case types.CompletionItemKind.Text: return model.CompletionItemKind.Text;
        case types.CompletionItemKind.Color: return model.CompletionItemKind.Color;
        case types.CompletionItemKind.File: return model.CompletionItemKind.File;
        case types.CompletionItemKind.Reference: return model.CompletionItemKind.Reference;
        case types.CompletionItemKind.Folder: return model.CompletionItemKind.Folder;
        case types.CompletionItemKind.Event: return model.CompletionItemKind.Event;
        case types.CompletionItemKind.Operator: return model.CompletionItemKind.Operator;
        case types.CompletionItemKind.TypeParameter: return model.CompletionItemKind.TypeParameter;
        case types.CompletionItemKind.User: return model.CompletionItemKind.User;
        case types.CompletionItemKind.Issue: return model.CompletionItemKind.Issue;
    }
    return model.CompletionItemKind.Property;
}
exports.fromCompletionItemKind = fromCompletionItemKind;
function toCompletionItemKind(kind) {
    switch (kind) {
        case model.CompletionItemKind.Method: return types.CompletionItemKind.Method;
        case model.CompletionItemKind.Function: return types.CompletionItemKind.Function;
        case model.CompletionItemKind.Constructor: return types.CompletionItemKind.Constructor;
        case model.CompletionItemKind.Field: return types.CompletionItemKind.Field;
        case model.CompletionItemKind.Variable: return types.CompletionItemKind.Variable;
        case model.CompletionItemKind.Class: return types.CompletionItemKind.Class;
        case model.CompletionItemKind.Interface: return types.CompletionItemKind.Interface;
        case model.CompletionItemKind.Struct: return types.CompletionItemKind.Struct;
        case model.CompletionItemKind.Module: return types.CompletionItemKind.Module;
        case model.CompletionItemKind.Property: return types.CompletionItemKind.Property;
        case model.CompletionItemKind.Unit: return types.CompletionItemKind.Unit;
        case model.CompletionItemKind.Value: return types.CompletionItemKind.Value;
        case model.CompletionItemKind.Constant: return types.CompletionItemKind.Constant;
        case model.CompletionItemKind.Enum: return types.CompletionItemKind.Enum;
        case model.CompletionItemKind.EnumMember: return types.CompletionItemKind.EnumMember;
        case model.CompletionItemKind.Keyword: return types.CompletionItemKind.Keyword;
        case model.CompletionItemKind.Snippet: return types.CompletionItemKind.Snippet;
        case model.CompletionItemKind.Text: return types.CompletionItemKind.Text;
        case model.CompletionItemKind.Color: return types.CompletionItemKind.Color;
        case model.CompletionItemKind.File: return types.CompletionItemKind.File;
        case model.CompletionItemKind.Reference: return types.CompletionItemKind.Reference;
        case model.CompletionItemKind.Folder: return types.CompletionItemKind.Folder;
        case model.CompletionItemKind.Event: return types.CompletionItemKind.Event;
        case model.CompletionItemKind.Operator: return types.CompletionItemKind.Operator;
        case model.CompletionItemKind.TypeParameter: return types.CompletionItemKind.TypeParameter;
        case model.CompletionItemKind.User: return types.CompletionItemKind.User;
        case model.CompletionItemKind.Issue: return types.CompletionItemKind.Issue;
    }
    return types.CompletionItemKind.Property;
}
exports.toCompletionItemKind = toCompletionItemKind;
function fromTextEdit(edit) {
    return {
        text: edit.newText,
        range: fromRange(edit.range)
    };
}
exports.fromTextEdit = fromTextEdit;
function fromSnippetTextEdit(edit) {
    return {
        text: edit.snippet.value,
        range: fromRange(edit.range),
        insertAsSnippet: true
    };
}
function convertDiagnosticToMarkerData(diagnostic) {
    return {
        code: convertCode(diagnostic.code),
        severity: convertSeverity(diagnostic.severity),
        message: diagnostic.message,
        source: diagnostic.source,
        startLineNumber: diagnostic.range.start.line + 1,
        startColumn: diagnostic.range.start.character + 1,
        endLineNumber: diagnostic.range.end.line + 1,
        endColumn: diagnostic.range.end.character + 1,
        relatedInformation: convertRelatedInformation(diagnostic.relatedInformation),
        tags: convertTags(diagnostic.tags)
    };
}
exports.convertDiagnosticToMarkerData = convertDiagnosticToMarkerData;
function convertCode(code) {
    if (typeof code === 'number') {
        return String(code);
    }
    if (typeof code === 'string' || typeof code === 'undefined') {
        return code;
    }
    else {
        return String(code.value);
    }
    ;
}
exports.convertCode = convertCode;
function convertSeverity(severity) {
    switch (severity) {
        case types.DiagnosticSeverity.Error: return types.MarkerSeverity.Error;
        case types.DiagnosticSeverity.Warning: return types.MarkerSeverity.Warning;
        case types.DiagnosticSeverity.Information: return types.MarkerSeverity.Info;
        case types.DiagnosticSeverity.Hint: return types.MarkerSeverity.Hint;
    }
}
function convertRelatedInformation(diagnosticsRelatedInformation) {
    if (!diagnosticsRelatedInformation) {
        return undefined;
    }
    const relatedInformation = [];
    for (const item of diagnosticsRelatedInformation) {
        relatedInformation.push({
            resource: item.location.uri.toString(),
            message: item.message,
            startLineNumber: item.location.range.start.line + 1,
            startColumn: item.location.range.start.character + 1,
            endLineNumber: item.location.range.end.line + 1,
            endColumn: item.location.range.end.character + 1
        });
    }
    return relatedInformation;
}
function convertTags(tags) {
    if (!tags) {
        return undefined;
    }
    const markerTags = [];
    for (const tag of tags) {
        switch (tag) {
            case types.DiagnosticTag.Unnecessary:
                markerTags.push(types.MarkerTag.Unnecessary);
                break;
            case types.DiagnosticTag.Deprecated:
                markerTags.push(types.MarkerTag.Deprecated);
                break;
        }
    }
    return markerTags;
}
function fromHover(hover) {
    return {
        range: fromRange(hover.range),
        contents: fromManyMarkdown(hover.contents)
    };
}
exports.fromHover = fromHover;
function fromEvaluatableExpression(evaluatableExpression) {
    return {
        range: fromRange(evaluatableExpression.range),
        expression: evaluatableExpression.expression
    };
}
exports.fromEvaluatableExpression = fromEvaluatableExpression;
function fromInlineValue(inlineValue) {
    if (inlineValue instanceof types_impl_1.InlineValueText) {
        return {
            type: 'text',
            range: fromRange(inlineValue.range),
            text: inlineValue.text
        };
    }
    else if (inlineValue instanceof types_impl_1.InlineValueVariableLookup) {
        return {
            type: 'variable',
            range: fromRange(inlineValue.range),
            variableName: inlineValue.variableName,
            caseSensitiveLookup: inlineValue.caseSensitiveLookup
        };
    }
    else if (inlineValue instanceof types_impl_1.InlineValueEvaluatableExpression) {
        return {
            type: 'expression',
            range: fromRange(inlineValue.range),
            expression: inlineValue.expression
        };
    }
    else {
        throw new Error('Unknown InlineValue type');
    }
}
exports.fromInlineValue = fromInlineValue;
function toInlineValueContext(inlineValueContext) {
    const ivLocation = inlineValueContext.stoppedLocation;
    return {
        frameId: inlineValueContext.frameId,
        stoppedLocation: new types.Range(ivLocation.startLineNumber, ivLocation.startColumn, ivLocation.endLineNumber, ivLocation.endColumn)
    };
}
exports.toInlineValueContext = toInlineValueContext;
function fromLocation(location) {
    return {
        uri: location.uri,
        range: fromRange(location.range)
    };
}
exports.fromLocation = fromLocation;
function fromTextDocumentShowOptions(options) {
    if (options.selection) {
        return {
            ...options,
            selection: fromRange(options.selection),
        };
    }
    return options;
}
exports.fromTextDocumentShowOptions = fromTextDocumentShowOptions;
function fromDefinitionLink(definitionLink) {
    return {
        uri: definitionLink.targetUri,
        range: fromRange(definitionLink.targetRange),
        originSelectionRange: definitionLink.originSelectionRange ? fromRange(definitionLink.originSelectionRange) : undefined,
        targetSelectionRange: definitionLink.targetSelectionRange ? fromRange(definitionLink.targetSelectionRange) : undefined
    };
}
exports.fromDefinitionLink = fromDefinitionLink;
var DocumentLink;
(function (DocumentLink) {
    function from(link) {
        return {
            range: fromRange(link.range),
            url: link.target,
            tooltip: link.tooltip
        };
    }
    DocumentLink.from = from;
    function to(link) {
        let target = undefined;
        if (link.url) {
            try {
                target = typeof link.url === 'string' ? types_impl_1.URI.parse(link.url, true) : types_impl_1.URI.revive(link.url);
            }
            catch (err) {
                // ignore
            }
        }
        return new types.DocumentLink(toRange(link.range), target);
    }
    DocumentLink.to = to;
})(DocumentLink = exports.DocumentLink || (exports.DocumentLink = {}));
function fromDocumentHighlightKind(kind) {
    switch (kind) {
        case types.DocumentHighlightKind.Text: return model.DocumentHighlightKind.Text;
        case types.DocumentHighlightKind.Read: return model.DocumentHighlightKind.Read;
        case types.DocumentHighlightKind.Write: return model.DocumentHighlightKind.Write;
    }
    return model.DocumentHighlightKind.Text;
}
exports.fromDocumentHighlightKind = fromDocumentHighlightKind;
function fromDocumentHighlight(documentHighlight) {
    return {
        range: fromRange(documentHighlight.range),
        kind: fromDocumentHighlightKind(documentHighlight.kind)
    };
}
exports.fromDocumentHighlight = fromDocumentHighlight;
var ParameterInformation;
(function (ParameterInformation) {
    function from(info) {
        return {
            label: info.label,
            documentation: info.documentation ? fromMarkdown(info.documentation) : undefined
        };
    }
    ParameterInformation.from = from;
    function to(info) {
        return {
            label: info.label,
            documentation: markdown_rendering_1.MarkdownString.is(info.documentation) ? toMarkdown(info.documentation) : info.documentation
        };
    }
    ParameterInformation.to = to;
})(ParameterInformation = exports.ParameterInformation || (exports.ParameterInformation = {}));
var SignatureInformation;
(function (SignatureInformation) {
    function from(info) {
        return {
            label: info.label,
            documentation: info.documentation ? fromMarkdown(info.documentation) : undefined,
            parameters: info.parameters && info.parameters.map(ParameterInformation.from),
            activeParameter: info.activeParameter
        };
    }
    SignatureInformation.from = from;
    function to(info) {
        return {
            label: info.label,
            documentation: markdown_rendering_1.MarkdownString.is(info.documentation) ? toMarkdown(info.documentation) : info.documentation,
            parameters: info.parameters && info.parameters.map(ParameterInformation.to),
            activeParameter: info.activeParameter
        };
    }
    SignatureInformation.to = to;
})(SignatureInformation = exports.SignatureInformation || (exports.SignatureInformation = {}));
var SignatureHelp;
(function (SignatureHelp) {
    function from(id, help) {
        return {
            id,
            activeSignature: help.activeSignature,
            activeParameter: help.activeParameter,
            signatures: help.signatures && help.signatures.map(SignatureInformation.from)
        };
    }
    SignatureHelp.from = from;
    function to(help) {
        return {
            activeSignature: help.activeSignature,
            activeParameter: help.activeParameter,
            signatures: help.signatures && help.signatures.map(SignatureInformation.to)
        };
    }
    SignatureHelp.to = to;
})(SignatureHelp = exports.SignatureHelp || (exports.SignatureHelp = {}));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fromWorkspaceEdit(value, documents) {
    const result = {
        edits: []
    };
    for (const entry of value._allEntries()) {
        if ((entry === null || entry === void 0 ? void 0 : entry._type) === 2 /* Text */) {
            // text edits
            const doc = documents ? documents.getDocument(entry.uri.toString()) : undefined;
            const workspaceTextEditDto = {
                resource: entry.uri,
                modelVersionId: doc === null || doc === void 0 ? void 0 : doc.version,
                textEdit: (entry.edit instanceof types.TextEdit) ? fromTextEdit(entry.edit) : fromSnippetTextEdit(entry.edit),
                metadata: entry.metadata
            };
            result.edits.push(workspaceTextEditDto);
        }
        else if ((entry === null || entry === void 0 ? void 0 : entry._type) === 1 /* File */) {
            // resource edits
            const workspaceFileEditDto = {
                oldResource: entry.from,
                newResource: entry.to,
                options: entry.options,
                metadata: entry.metadata
            };
            result.edits.push(workspaceFileEditDto);
        }
        else if ((entry === null || entry === void 0 ? void 0 : entry._type) === 3 /* Cell */) {
            // cell edit
            if (entry.edit) {
                result.edits.push({
                    metadata: entry.metadata,
                    resource: entry.uri,
                    cellEdit: entry.edit,
                });
            }
        }
        else if ((entry === null || entry === void 0 ? void 0 : entry._type) === 5 /* CellReplace */) {
            // cell replace
            result.edits.push({
                metadata: entry.metadata,
                resource: entry.uri,
                cellEdit: {
                    editType: 1 /* Replace */,
                    index: entry.index,
                    count: entry.count,
                    cells: entry.cells.map(NotebookCellData.from)
                }
            });
        }
    }
    return result;
}
exports.fromWorkspaceEdit = fromWorkspaceEdit;
var SymbolKind;
(function (SymbolKind) {
    const fromMapping = Object.create(null);
    fromMapping[model.SymbolKind.File] = model.SymbolKind.File;
    fromMapping[model.SymbolKind.Module] = model.SymbolKind.Module;
    fromMapping[model.SymbolKind.Namespace] = model.SymbolKind.Namespace;
    fromMapping[model.SymbolKind.Package] = model.SymbolKind.Package;
    fromMapping[model.SymbolKind.Class] = model.SymbolKind.Class;
    fromMapping[model.SymbolKind.Method] = model.SymbolKind.Method;
    fromMapping[model.SymbolKind.Property] = model.SymbolKind.Property;
    fromMapping[model.SymbolKind.Field] = model.SymbolKind.Field;
    fromMapping[model.SymbolKind.Constructor] = model.SymbolKind.Constructor;
    fromMapping[model.SymbolKind.Enum] = model.SymbolKind.Enum;
    fromMapping[model.SymbolKind.Interface] = model.SymbolKind.Interface;
    fromMapping[model.SymbolKind.Function] = model.SymbolKind.Function;
    fromMapping[model.SymbolKind.Variable] = model.SymbolKind.Variable;
    fromMapping[model.SymbolKind.Constant] = model.SymbolKind.Constant;
    fromMapping[model.SymbolKind.String] = model.SymbolKind.String;
    fromMapping[model.SymbolKind.Number] = model.SymbolKind.Number;
    fromMapping[model.SymbolKind.Boolean] = model.SymbolKind.Boolean;
    fromMapping[model.SymbolKind.Array] = model.SymbolKind.Array;
    fromMapping[model.SymbolKind.Object] = model.SymbolKind.Object;
    fromMapping[model.SymbolKind.Key] = model.SymbolKind.Key;
    fromMapping[model.SymbolKind.Null] = model.SymbolKind.Null;
    fromMapping[model.SymbolKind.EnumMember] = model.SymbolKind.EnumMember;
    fromMapping[model.SymbolKind.Struct] = model.SymbolKind.Struct;
    fromMapping[model.SymbolKind.Event] = model.SymbolKind.Event;
    fromMapping[model.SymbolKind.Operator] = model.SymbolKind.Operator;
    fromMapping[model.SymbolKind.TypeParameter] = model.SymbolKind.TypeParameter;
    function fromSymbolKind(kind) {
        return fromMapping[kind] || model.SymbolKind.Property;
    }
    SymbolKind.fromSymbolKind = fromSymbolKind;
    function toSymbolKind(kind) {
        for (const k in fromMapping) {
            if (fromMapping[k] === kind) {
                return Number(k);
            }
        }
        return model.SymbolKind.Property;
    }
    SymbolKind.toSymbolKind = toSymbolKind;
})(SymbolKind = exports.SymbolKind || (exports.SymbolKind = {}));
function toCodeActionTriggerKind(triggerKind) {
    switch (triggerKind) {
        case model.CodeActionTriggerKind.Invoke:
            return types.CodeActionTriggerKind.Invoke;
        case model.CodeActionTriggerKind.Automatic:
            return types.CodeActionTriggerKind.Automatic;
    }
}
exports.toCodeActionTriggerKind = toCodeActionTriggerKind;
function fromDocumentSymbol(info) {
    const result = {
        name: info.name,
        detail: info.detail,
        range: fromRange(info.range),
        tags: info.tags ? info.tags.map(fromSymbolTag) : [],
        selectionRange: fromRange(info.selectionRange),
        kind: SymbolKind.fromSymbolKind(info.kind)
    };
    if (info.children) {
        result.children = info.children.map(fromDocumentSymbol);
    }
    return result;
}
exports.fromDocumentSymbol = fromDocumentSymbol;
function toDocumentSymbol(symbol) {
    return {
        name: symbol.name,
        detail: symbol.detail,
        range: toRange(symbol.range),
        tags: symbol.tags && symbol.tags.length > 0 ? symbol.tags.map(toSymbolTag) : [],
        selectionRange: toRange(symbol.selectionRange),
        children: symbol.children ? symbol.children.map(toDocumentSymbol) : [],
        kind: SymbolKind.toSymbolKind(symbol.kind)
    };
}
exports.toDocumentSymbol = toDocumentSymbol;
function fromSymbolTag(kind) {
    switch (kind) {
        case types.SymbolTag.Deprecated: return model.SymbolTag.Deprecated;
    }
}
exports.fromSymbolTag = fromSymbolTag;
function toSymbolTag(kind) {
    switch (kind) {
        case model.SymbolTag.Deprecated: return types.SymbolTag.Deprecated;
    }
}
exports.toSymbolTag = toSymbolTag;
function isModelLocation(arg) {
    return (0, common_1.isObject)(arg) &&
        isModelRange(arg.range) &&
        isUriComponents(arg.uri);
}
exports.isModelLocation = isModelLocation;
function isModelRange(arg) {
    return (0, common_1.isObject)(arg) &&
        typeof arg.startLineNumber === 'number' &&
        typeof arg.startColumn === 'number' &&
        typeof arg.endLineNumber === 'number' &&
        typeof arg.endColumn === 'number';
}
exports.isModelRange = isModelRange;
function isUriComponents(arg) {
    return (0, common_1.isObject)(arg) &&
        typeof arg.scheme === 'string' &&
        typeof arg.path === 'string' &&
        typeof arg.query === 'string' &&
        typeof arg.fragment === 'string';
}
exports.isUriComponents = isUriComponents;
function isModelCallHierarchyItem(arg) {
    return (0, common_1.isObject)(arg)
        && isModelRange(arg.range)
        && isModelRange(arg.selectionRange)
        && isUriComponents(arg.uri)
        && !!arg.name;
}
exports.isModelCallHierarchyItem = isModelCallHierarchyItem;
function isModelCallHierarchyIncomingCall(arg) {
    return (0, common_1.isObject)(arg) &&
        'from' in arg &&
        'fromRanges' in arg &&
        isModelCallHierarchyItem(arg.from);
}
exports.isModelCallHierarchyIncomingCall = isModelCallHierarchyIncomingCall;
function isModelCallHierarchyOutgoingCall(arg) {
    return (0, common_1.isObject)(arg) &&
        'to' in arg &&
        'fromRanges' in arg &&
        isModelCallHierarchyItem(arg.to);
}
exports.isModelCallHierarchyOutgoingCall = isModelCallHierarchyOutgoingCall;
function toLocation(value) {
    return new types.Location(types_impl_1.URI.revive(value.uri), toRange(value.range));
}
exports.toLocation = toLocation;
function fromHierarchyItem(item) {
    return {
        kind: SymbolKind.fromSymbolKind(item.kind),
        name: item.name,
        detail: item.detail,
        uri: item.uri,
        range: fromRange(item.range),
        selectionRange: fromRange(item.selectionRange),
        tags: item.tags,
        _itemId: item._itemId,
        _sessionId: item._sessionId,
    };
}
exports.fromHierarchyItem = fromHierarchyItem;
function fromCallHierarchyItem(item) {
    return fromHierarchyItem(item);
}
exports.fromCallHierarchyItem = fromCallHierarchyItem;
function toCallHierarchyItem(value) {
    const item = new types.CallHierarchyItem(SymbolKind.toSymbolKind(value.kind), value.name, value.detail ? value.detail : '', types_impl_1.URI.revive(value.uri), toRange(value.range), toRange(value.selectionRange));
    item.tags = value.tags;
    item._itemId = value._itemId;
    item._sessionId = value._sessionId;
    return item;
}
exports.toCallHierarchyItem = toCallHierarchyItem;
function toCallHierarchyIncomingCall(value) {
    return new types.CallHierarchyIncomingCall(toCallHierarchyItem(value.from), value.fromRanges && value.fromRanges.map(toRange));
}
exports.toCallHierarchyIncomingCall = toCallHierarchyIncomingCall;
function toCallHierarchyOutgoingCall(value) {
    return new types.CallHierarchyOutgoingCall(toCallHierarchyItem(value.to), value.fromRanges && value.fromRanges.map(toRange));
}
exports.toCallHierarchyOutgoingCall = toCallHierarchyOutgoingCall;
function isModelTypeHierarchyItem(arg) {
    return (0, common_1.isObject)(arg)
        && isModelRange(arg.range)
        && isModelRange(arg.selectionRange)
        && isUriComponents(arg.uri)
        && !!arg.name;
}
exports.isModelTypeHierarchyItem = isModelTypeHierarchyItem;
function fromTypeHierarchyItem(item) {
    return fromHierarchyItem(item);
}
exports.fromTypeHierarchyItem = fromTypeHierarchyItem;
function toTypeHierarchyItem(value) {
    const item = new types.TypeHierarchyItem(SymbolKind.toSymbolKind(value.kind), value.name, value.detail ? value.detail : '', types_impl_1.URI.revive(value.uri), toRange(value.selectionRange), toRange(value.range));
    item.tags = value.tags;
    item._itemId = value._itemId;
    item._sessionId = value._sessionId;
    return item;
}
exports.toTypeHierarchyItem = toTypeHierarchyItem;
function toWorkspaceFolder(folder) {
    return {
        uri: types_impl_1.URI.revive(folder.uri),
        name: folder.name,
        index: folder.index
    };
}
exports.toWorkspaceFolder = toWorkspaceFolder;
function fromTask(task) {
    if (!task) {
        return undefined;
    }
    const taskDto = {};
    taskDto.label = task.name;
    taskDto.source = task.source;
    taskDto.runOptions = { reevaluateOnRerun: task.runOptions.reevaluateOnRerun };
    if (task.hasProblemMatchers) {
        taskDto.problemMatcher = task.problemMatchers;
    }
    if ('detail' in task) {
        taskDto.detail = task.detail;
    }
    if (typeof task.scope === 'number') {
        taskDto.scope = task.scope;
    }
    else if (task.scope !== undefined) {
        taskDto.scope = task.scope.uri.toString();
    }
    else {
        taskDto.scope = types.TaskScope.Workspace;
    }
    if (task.presentationOptions) {
        taskDto.presentation = task.presentationOptions;
    }
    if (task.group) {
        taskDto.group = {
            kind: task.group.id,
            isDefault: !!task.group.isDefault
        };
    }
    const taskDefinition = task.definition;
    if (!taskDefinition) {
        return taskDto;
    }
    taskDto.type = taskDefinition.type;
    const { type, ...properties } = taskDefinition;
    for (const key in properties) {
        if (properties.hasOwnProperty(key)) {
            taskDto[key] = properties[key];
        }
    }
    const execution = task.execution;
    if (!execution) {
        return taskDto;
    }
    if (types.ShellExecution.is(execution)) {
        return fromShellExecution(execution, taskDto);
    }
    if (types.ProcessExecution.is(execution)) {
        return fromProcessExecution(execution, taskDto);
    }
    if (types.CustomExecution.is(execution)) {
        return fromCustomExecution(execution, taskDto);
    }
    return taskDto;
}
exports.fromTask = fromTask;
function toTask(taskDto) {
    if (!taskDto) {
        throw new Error('Task should be provided for converting');
    }
    const { type, taskType, label, source, scope, problemMatcher, detail, command, args, options, group, presentation, runOptions, ...properties } = taskDto;
    const result = {};
    result.name = label;
    result.source = source;
    result.runOptions = runOptions !== null && runOptions !== void 0 ? runOptions : {};
    if (detail) {
        result.detail = detail;
    }
    if (typeof scope === 'string') {
        const uri = types_impl_1.URI.parse(scope);
        result.scope = {
            uri,
            name: uri.toString(),
            index: 0
        };
    }
    else {
        result.scope = scope;
    }
    const taskDefinition = {
        type: type
    };
    result.definition = taskDefinition;
    if (taskType === 'process') {
        result.execution = getProcessExecution(taskDto);
    }
    const execution = { command, args, options };
    if (taskType === 'shell' || types.ShellExecution.is(execution)) {
        result.execution = getShellExecution(taskDto);
    }
    if (taskType === 'customExecution' || types.CustomExecution.is(execution)) {
        result.execution = getCustomExecution(taskDto);
        // if taskType is customExecution, we need to put all the information into taskDefinition,
        // because some parameters may be in taskDefinition.
        taskDefinition.label = label;
        taskDefinition.command = command;
        taskDefinition.args = args;
        taskDefinition.options = options;
    }
    if (group) {
        result.group = new types.TaskGroup(group.kind, group.kind, group.isDefault);
    }
    if (presentation) {
        result.presentationOptions = presentation;
    }
    if (!properties) {
        return result;
    }
    for (const key in properties) {
        if (properties.hasOwnProperty(key)) {
            taskDefinition[key] = properties[key];
        }
    }
    return result;
}
exports.toTask = toTask;
function fromProcessExecution(execution, taskDto) {
    taskDto.taskType = 'process';
    taskDto.command = execution.process;
    taskDto.args = execution.args;
    const options = execution.options;
    if (options) {
        taskDto.options = options;
    }
    return taskDto;
}
exports.fromProcessExecution = fromProcessExecution;
function fromShellExecution(execution, taskDto) {
    taskDto.taskType = 'shell';
    const options = execution.options;
    if (options) {
        taskDto.options = getShellExecutionOptions(options);
    }
    const commandLine = execution.commandLine;
    if (commandLine) {
        taskDto.command = commandLine;
        return taskDto;
    }
    if (execution.command) {
        taskDto.command = getCommand(execution.command);
        taskDto.args = getShellArgs(execution.args);
        return taskDto;
    }
    else {
        throw new Error('Command is undefined');
    }
}
exports.fromShellExecution = fromShellExecution;
function fromCustomExecution(execution, taskDto) {
    taskDto.taskType = 'customExecution';
    const callback = execution.callback;
    if (callback) {
        taskDto.callback = callback;
        return taskDto;
    }
    else {
        throw new Error('Converting CustomExecution callback is not implemented');
    }
}
exports.fromCustomExecution = fromCustomExecution;
function getProcessExecution(taskDto) {
    return new types.ProcessExecution(taskDto.command, taskDto.args || [], taskDto.options || {});
}
exports.getProcessExecution = getProcessExecution;
function getShellExecution(taskDto) {
    if (taskDto.command && Array.isArray(taskDto.args) && taskDto.args.length !== 0) {
        return new types.ShellExecution(taskDto.command, taskDto.args, taskDto.options || {});
    }
    return new types.ShellExecution(taskDto.command || taskDto.commandLine, taskDto.options || {});
}
exports.getShellExecution = getShellExecution;
function getCustomExecution(taskDto) {
    return new types.CustomExecution(taskDto.callback);
}
exports.getCustomExecution = getCustomExecution;
function getShellArgs(args) {
    if (!args || args.length === 0) {
        return [];
    }
    const element = args[0];
    if (typeof element === 'string') {
        return args;
    }
    const result = [];
    const shellQuotedArgs = args;
    shellQuotedArgs.forEach(arg => {
        result.push(arg.value);
    });
    return result;
}
exports.getShellArgs = getShellArgs;
function getCommand(command) {
    return typeof command === 'string' ? command : command.value;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getShellExecutionOptions(options) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = {};
    const env = options.env;
    if (env) {
        result['env'] = env;
    }
    const executable = options.executable;
    if (executable) {
        result['executable'] = executable;
    }
    const shellQuoting = options.shellQuoting;
    if (shellQuoting) {
        result['shellQuoting'] = shellQuoting;
    }
    const shellArgs = options.shellArgs;
    if (shellArgs) {
        result['shellArgs'] = shellArgs;
    }
    const cwd = options.cwd;
    if (cwd) {
        Object.assign(result, { cwd });
    }
    return result;
}
exports.getShellExecutionOptions = getShellExecutionOptions;
function fromSymbolInformation(symbolInformation) {
    if (!symbolInformation) {
        return undefined;
    }
    if (symbolInformation.location && symbolInformation.location.range) {
        const p1 = lstypes.Position.create(symbolInformation.location.range.start.line, symbolInformation.location.range.start.character);
        const p2 = lstypes.Position.create(symbolInformation.location.range.end.line, symbolInformation.location.range.end.character);
        return lstypes.SymbolInformation.create(symbolInformation.name, symbolInformation.kind++, lstypes.Range.create(p1, p2), symbolInformation.location.uri.toString(), symbolInformation.containerName);
    }
    return {
        name: symbolInformation.name,
        containerName: symbolInformation.containerName,
        kind: symbolInformation.kind++,
        location: {
            uri: symbolInformation.location.uri.toString(),
            range: symbolInformation.location.range,
        }
    };
}
exports.fromSymbolInformation = fromSymbolInformation;
function toSymbolInformation(symbolInformation) {
    if (!symbolInformation) {
        return undefined;
    }
    return {
        name: symbolInformation.name,
        containerName: symbolInformation.containerName,
        kind: symbolInformation.kind,
        location: {
            uri: types_impl_1.URI.parse(symbolInformation.location.uri),
            range: symbolInformation.location.range
        }
    };
}
exports.toSymbolInformation = toSymbolInformation;
function fromSelectionRange(selectionRange) {
    return { range: fromRange(selectionRange.range) };
}
exports.fromSelectionRange = fromSelectionRange;
function fromFoldingRange(foldingRange) {
    const range = {
        start: foldingRange.start + 1,
        end: foldingRange.end + 1
    };
    if (foldingRange.kind) {
        range.kind = fromFoldingRangeKind(foldingRange.kind);
    }
    return range;
}
exports.fromFoldingRange = fromFoldingRange;
function fromFoldingRangeKind(kind) {
    if (kind) {
        switch (kind) {
            case types.FoldingRangeKind.Comment:
                return model.FoldingRangeKind.Comment;
            case types.FoldingRangeKind.Imports:
                return model.FoldingRangeKind.Imports;
            case types.FoldingRangeKind.Region:
                return model.FoldingRangeKind.Region;
        }
    }
    return undefined;
}
exports.fromFoldingRangeKind = fromFoldingRangeKind;
function fromColor(color) {
    return [color.red, color.green, color.blue, color.alpha];
}
exports.fromColor = fromColor;
function toColor(color) {
    return new types.Color(color[0], color[1], color[2], color[3]);
}
exports.toColor = toColor;
function fromColorPresentation(colorPresentation) {
    return {
        label: colorPresentation.label,
        textEdit: colorPresentation.textEdit ? fromTextEdit(colorPresentation.textEdit) : undefined,
        additionalTextEdits: colorPresentation.additionalTextEdits ? colorPresentation.additionalTextEdits.map(value => fromTextEdit(value)) : undefined
    };
}
exports.fromColorPresentation = fromColorPresentation;
function convertToTransferQuickPickItems(items) {
    return items.map((item, index) => {
        if (typeof item === 'string') {
            return { type: 'item', label: item, handle: index };
        }
        else if (item.kind === types_impl_1.QuickPickItemKind.Separator) {
            return { type: 'separator', label: item.label, handle: index };
        }
        else {
            const { label, description, detail, picked, alwaysShow, buttons } = item;
            return {
                type: 'item',
                label,
                description,
                detail,
                picked,
                alwaysShow,
                buttons,
                handle: index,
            };
        }
    });
}
exports.convertToTransferQuickPickItems = convertToTransferQuickPickItems;
var DecorationRenderOptions;
(function (DecorationRenderOptions) {
    function from(options) {
        return {
            isWholeLine: options.isWholeLine,
            rangeBehavior: options.rangeBehavior ? DecorationRangeBehavior.from(options.rangeBehavior) : undefined,
            overviewRulerLane: options.overviewRulerLane,
            light: options.light ? ThemableDecorationRenderOptions.from(options.light) : undefined,
            dark: options.dark ? ThemableDecorationRenderOptions.from(options.dark) : undefined,
            backgroundColor: options.backgroundColor,
            outline: options.outline,
            outlineColor: options.outlineColor,
            outlineStyle: options.outlineStyle,
            outlineWidth: options.outlineWidth,
            border: options.border,
            borderColor: options.borderColor,
            borderRadius: options.borderRadius,
            borderSpacing: options.borderSpacing,
            borderStyle: options.borderStyle,
            borderWidth: options.borderWidth,
            fontStyle: options.fontStyle,
            fontWeight: options.fontWeight,
            textDecoration: options.textDecoration,
            cursor: options.cursor,
            color: options.color,
            opacity: options.opacity,
            letterSpacing: options.letterSpacing,
            gutterIconPath: options.gutterIconPath ? pathOrURIToURI(options.gutterIconPath) : undefined,
            gutterIconSize: options.gutterIconSize,
            overviewRulerColor: options.overviewRulerColor,
            before: options.before ? ThemableDecorationAttachmentRenderOptions.from(options.before) : undefined,
            after: options.after ? ThemableDecorationAttachmentRenderOptions.from(options.after) : undefined,
        };
    }
    DecorationRenderOptions.from = from;
})(DecorationRenderOptions = exports.DecorationRenderOptions || (exports.DecorationRenderOptions = {}));
var DecorationRangeBehavior;
(function (DecorationRangeBehavior) {
    function from(value) {
        if (typeof value === 'undefined') {
            return value;
        }
        switch (value) {
            case types.DecorationRangeBehavior.OpenOpen:
                return rpc.TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges;
            case types.DecorationRangeBehavior.ClosedClosed:
                return rpc.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges;
            case types.DecorationRangeBehavior.OpenClosed:
                return rpc.TrackedRangeStickiness.GrowsOnlyWhenTypingBefore;
            case types.DecorationRangeBehavior.ClosedOpen:
                return rpc.TrackedRangeStickiness.GrowsOnlyWhenTypingAfter;
        }
    }
    DecorationRangeBehavior.from = from;
})(DecorationRangeBehavior = exports.DecorationRangeBehavior || (exports.DecorationRangeBehavior = {}));
var ThemableDecorationRenderOptions;
(function (ThemableDecorationRenderOptions) {
    function from(options) {
        if (typeof options === 'undefined') {
            return options;
        }
        return {
            backgroundColor: options.backgroundColor,
            outline: options.outline,
            outlineColor: options.outlineColor,
            outlineStyle: options.outlineStyle,
            outlineWidth: options.outlineWidth,
            border: options.border,
            borderColor: options.borderColor,
            borderRadius: options.borderRadius,
            borderSpacing: options.borderSpacing,
            borderStyle: options.borderStyle,
            borderWidth: options.borderWidth,
            fontStyle: options.fontStyle,
            fontWeight: options.fontWeight,
            textDecoration: options.textDecoration,
            cursor: options.cursor,
            color: options.color,
            opacity: options.opacity,
            letterSpacing: options.letterSpacing,
            gutterIconPath: options.gutterIconPath ? pathOrURIToURI(options.gutterIconPath) : undefined,
            gutterIconSize: options.gutterIconSize,
            overviewRulerColor: options.overviewRulerColor,
            before: options.before ? ThemableDecorationAttachmentRenderOptions.from(options.before) : undefined,
            after: options.after ? ThemableDecorationAttachmentRenderOptions.from(options.after) : undefined,
        };
    }
    ThemableDecorationRenderOptions.from = from;
})(ThemableDecorationRenderOptions = exports.ThemableDecorationRenderOptions || (exports.ThemableDecorationRenderOptions = {}));
var ThemableDecorationAttachmentRenderOptions;
(function (ThemableDecorationAttachmentRenderOptions) {
    function from(options) {
        if (typeof options === 'undefined') {
            return options;
        }
        return {
            contentText: options.contentText,
            contentIconPath: options.contentIconPath ? pathOrURIToURI(options.contentIconPath) : undefined,
            border: options.border,
            borderColor: options.borderColor,
            fontStyle: options.fontStyle,
            fontWeight: options.fontWeight,
            textDecoration: options.textDecoration,
            color: options.color,
            backgroundColor: options.backgroundColor,
            margin: options.margin,
            width: options.width,
            height: options.height,
        };
    }
    ThemableDecorationAttachmentRenderOptions.from = from;
})(ThemableDecorationAttachmentRenderOptions = exports.ThemableDecorationAttachmentRenderOptions || (exports.ThemableDecorationAttachmentRenderOptions = {}));
var ViewColumn;
(function (ViewColumn) {
    function from(column) {
        if (typeof column === 'number' && column >= types.ViewColumn.One) {
            return column - 1; // adjust zero index (ViewColumn.ONE => 0)
        }
        if (column === types.ViewColumn.Beside) {
            return SIDE_GROUP;
        }
        return ACTIVE_GROUP; // default is always the active group
    }
    ViewColumn.from = from;
    function to(position) {
        if (typeof position === 'number' && position >= 0) {
            return position + 1; // adjust to index (ViewColumn.ONE => 1)
        }
        throw new Error('invalid \'EditorGroupColumn\'');
    }
    ViewColumn.to = to;
})(ViewColumn = exports.ViewColumn || (exports.ViewColumn = {}));
function pathOrURIToURI(value) {
    if (typeof value === 'undefined') {
        return value;
    }
    if (typeof value === 'string') {
        return types_impl_1.URI.file(value);
    }
    else {
        return value;
    }
}
exports.pathOrURIToURI = pathOrURIToURI;
function pluginToPluginInfo(plugin) {
    return {
        id: plugin.model.id,
        name: plugin.model.name,
        displayName: plugin.model.displayName
    };
}
exports.pluginToPluginInfo = pluginToPluginInfo;
var InlayHintKind;
(function (InlayHintKind) {
    function from(kind) {
        return kind;
    }
    InlayHintKind.from = from;
    function to(kind) {
        return kind;
    }
    InlayHintKind.to = to;
})(InlayHintKind = exports.InlayHintKind || (exports.InlayHintKind = {}));
var DataTransferItem;
(function (DataTransferItem) {
    function to(mime, item, resolveFileData) {
        const file = item.fileData;
        if (file) {
            return new class extends types.DataTransferItem {
                asFile() {
                    return {
                        name: file.name,
                        uri: types_impl_1.URI.revive(file.uri),
                        data: () => resolveFileData(item.id),
                    };
                }
            }('');
        }
        if (mime === 'text/uri-list' && item.uriListData) {
            return new types.DataTransferItem(reviveUriList(item.uriListData));
        }
        return new types.DataTransferItem(item.asString);
    }
    DataTransferItem.to = to;
    function reviveUriList(parts) {
        return parts.map(part => typeof part === 'string' ? part : types_impl_1.URI.revive(part).toString()).join('\r\n');
    }
})(DataTransferItem = exports.DataTransferItem || (exports.DataTransferItem = {}));
var DataTransfer;
(function (DataTransfer) {
    function toDataTransfer(value, resolveFileData) {
        const dataTransfer = new types.DataTransfer();
        for (const [mimeType, item] of value.items) {
            dataTransfer.set(mimeType, DataTransferItem.to(mimeType, item, resolveFileData));
        }
        return dataTransfer;
    }
    DataTransfer.toDataTransfer = toDataTransfer;
})(DataTransfer = exports.DataTransfer || (exports.DataTransfer = {}));
var NotebookDocumentContentOptions;
(function (NotebookDocumentContentOptions) {
    function from(options) {
        var _a, _b, _c;
        return {
            transientOutputs: (_a = options === null || options === void 0 ? void 0 : options.transientOutputs) !== null && _a !== void 0 ? _a : false,
            transientCellMetadata: (_b = options === null || options === void 0 ? void 0 : options.transientCellMetadata) !== null && _b !== void 0 ? _b : {},
            transientDocumentMetadata: (_c = options === null || options === void 0 ? void 0 : options.transientDocumentMetadata) !== null && _c !== void 0 ? _c : {},
        };
    }
    NotebookDocumentContentOptions.from = from;
})(NotebookDocumentContentOptions = exports.NotebookDocumentContentOptions || (exports.NotebookDocumentContentOptions = {}));
var NotebookStatusBarItem;
(function (NotebookStatusBarItem) {
    function from(item, commandsConverter, disposables) {
        const command = typeof item.command === 'string' ? { title: '', command: item.command } : item.command;
        return {
            alignment: item.alignment === types.NotebookCellStatusBarAlignment.Left ? 1 /* Left */ : 2 /* Right */,
            command: commandsConverter.toSafeCommand(command, disposables),
            text: item.text,
            tooltip: item.tooltip,
            priority: item.priority
        };
    }
    NotebookStatusBarItem.from = from;
})(NotebookStatusBarItem = exports.NotebookStatusBarItem || (exports.NotebookStatusBarItem = {}));
var NotebookData;
(function (NotebookData) {
    function from(data) {
        var _a;
        const res = {
            metadata: (_a = data.metadata) !== null && _a !== void 0 ? _a : Object.create(null),
            cells: [],
        };
        for (const cell of data.cells) {
            // types.NotebookCellData.validate(cell);
            res.cells.push(NotebookCellData.from(cell));
        }
        return res;
    }
    NotebookData.from = from;
    function to(data) {
        const res = new types.NotebookData(data.cells.map(NotebookCellData.to));
        if (!(0, common_1.isEmptyObject)(data.metadata)) {
            res.metadata = data.metadata;
        }
        return res;
    }
    NotebookData.to = to;
})(NotebookData = exports.NotebookData || (exports.NotebookData = {}));
var NotebookCellData;
(function (NotebookCellData) {
    function from(data) {
        return {
            cellKind: NotebookCellKind.from(data.kind),
            language: data.languageId,
            source: data.value,
            // metadata: data.metadata,
            // internalMetadata: NotebookCellExecutionSummary.from(data.executionSummary ?? {}),
            outputs: data.outputs ? data.outputs.map(NotebookCellOutputConverter.from) : []
        };
    }
    NotebookCellData.from = from;
    function to(data) {
        return new types.NotebookCellData(NotebookCellKind.to(data.cellKind), data.source, data.language, data.outputs ? data.outputs.map(NotebookCellOutput.to) : undefined, data.metadata, data.internalMetadata ? NotebookCellExecutionSummary.to(data.internalMetadata) : undefined);
    }
    NotebookCellData.to = to;
})(NotebookCellData = exports.NotebookCellData || (exports.NotebookCellData = {}));
var NotebookCellKind;
(function (NotebookCellKind) {
    function from(data) {
        switch (data) {
            case types.NotebookCellKind.Markup:
                return notebooks.CellKind.Markup;
            case types.NotebookCellKind.Code:
            default:
                return notebooks.CellKind.Code;
        }
    }
    NotebookCellKind.from = from;
    function to(data) {
        switch (data) {
            case notebooks.CellKind.Markup:
                return types.NotebookCellKind.Markup;
            case notebooks.CellKind.Code:
            default:
                return types.NotebookCellKind.Code;
        }
    }
    NotebookCellKind.to = to;
})(NotebookCellKind = exports.NotebookCellKind || (exports.NotebookCellKind = {}));
var NotebookCellOutput;
(function (NotebookCellOutput) {
    function from(output) {
        return {
            outputId: output.outputId,
            items: output.items.map(NotebookCellOutputItem.from),
            metadata: output.metadata
        };
    }
    NotebookCellOutput.from = from;
    function to(output) {
        const items = output.items.map(NotebookCellOutputItem.to);
        return new types.NotebookCellOutput(items, output.outputId, output.metadata);
    }
    NotebookCellOutput.to = to;
})(NotebookCellOutput = exports.NotebookCellOutput || (exports.NotebookCellOutput = {}));
var NotebookCellOutputItem;
(function (NotebookCellOutputItem) {
    function from(item) {
        return {
            mime: item.mime,
            valueBytes: buffer_1.BinaryBuffer.wrap(item.data),
        };
    }
    NotebookCellOutputItem.from = from;
    function to(item) {
        return new types.NotebookCellOutputItem(item.valueBytes.buffer, item.mime);
    }
    NotebookCellOutputItem.to = to;
})(NotebookCellOutputItem = exports.NotebookCellOutputItem || (exports.NotebookCellOutputItem = {}));
var NotebookCellOutputConverter;
(function (NotebookCellOutputConverter) {
    function from(output) {
        return {
            outputId: output.outputId,
            items: output.items.map(NotebookCellOutputItem.from),
            metadata: output.metadata
        };
    }
    NotebookCellOutputConverter.from = from;
    function to(output) {
        const items = output.items.map(NotebookCellOutputItem.to);
        return new types.NotebookCellOutput(items, output.outputId, output.metadata);
    }
    NotebookCellOutputConverter.to = to;
    function ensureUniqueMimeTypes(items, warn = false) {
        const seen = new Set();
        const removeIdx = new Set();
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            // We can have multiple text stream mime types in the same output.
            if (!seen.has(item.mime) || (0, common_2.isTextStreamMime)(item.mime)) {
                seen.add(item.mime);
                continue;
            }
            // duplicated mime types... first has won
            removeIdx.add(i);
            if (warn) {
                console.warn(`DUPLICATED mime type '${item.mime}' will be dropped`);
            }
        }
        if (removeIdx.size === 0) {
            return items;
        }
        return items.filter((_, index) => !removeIdx.has(index));
    }
    NotebookCellOutputConverter.ensureUniqueMimeTypes = ensureUniqueMimeTypes;
})(NotebookCellOutputConverter = exports.NotebookCellOutputConverter || (exports.NotebookCellOutputConverter = {}));
var NotebookCellExecutionSummary;
(function (NotebookCellExecutionSummary) {
    function to(data) {
        return {
            timing: typeof data.runStartTime === 'number' && typeof data.runEndTime === 'number' ? { startTime: data.runStartTime, endTime: data.runEndTime } : undefined,
            executionOrder: data.executionOrder,
            success: data.lastRunSuccess
        };
    }
    NotebookCellExecutionSummary.to = to;
    function from(data) {
        var _a, _b;
        return {
            lastRunSuccess: data.success,
            runStartTime: (_a = data.timing) === null || _a === void 0 ? void 0 : _a.startTime,
            runEndTime: (_b = data.timing) === null || _b === void 0 ? void 0 : _b.endTime,
            executionOrder: data.executionOrder
        };
    }
    NotebookCellExecutionSummary.from = from;
})(NotebookCellExecutionSummary = exports.NotebookCellExecutionSummary || (exports.NotebookCellExecutionSummary = {}));
var NotebookRange;
(function (NotebookRange) {
    function from(range) {
        return { start: range.start, end: range.end };
    }
    NotebookRange.from = from;
    function to(range) {
        return new types.NotebookRange(range.start, range.end);
    }
    NotebookRange.to = to;
})(NotebookRange = exports.NotebookRange || (exports.NotebookRange = {}));
var NotebookKernelSourceAction;
(function (NotebookKernelSourceAction) {
    function from(item, commandsConverter, disposables) {
        const command = typeof item.command === 'string' ? { title: '', command: item.command } : item.command;
        return {
            command: commandsConverter.toSafeCommand(command, disposables),
            label: item.label,
            description: item.description,
            detail: item.detail,
            documentation: item.documentation
        };
    }
    NotebookKernelSourceAction.from = from;
})(NotebookKernelSourceAction = exports.NotebookKernelSourceAction || (exports.NotebookKernelSourceAction = {}));
var NotebookDto;
(function (NotebookDto) {
    function toNotebookOutputItemDto(item) {
        return {
            mime: item.mime,
            valueBytes: item.data
        };
    }
    NotebookDto.toNotebookOutputItemDto = toNotebookOutputItemDto;
    function toNotebookOutputDto(output) {
        return {
            outputId: output.outputId,
            metadata: output.metadata,
            items: output.outputs.map(toNotebookOutputItemDto)
        };
    }
    NotebookDto.toNotebookOutputDto = toNotebookOutputDto;
    function toNotebookCellDataDto(cell) {
        return {
            cellKind: cell.cellKind,
            language: cell.language,
            source: cell.source,
            internalMetadata: cell.internalMetadata,
            metadata: cell.metadata,
            outputs: cell.outputs.map(toNotebookOutputDto)
        };
    }
    NotebookDto.toNotebookCellDataDto = toNotebookCellDataDto;
    // export function toNotebookDataDto(data: NotebookData): rpc.NotebookDataDto {
    //     return {
    //         metadata: data.metadata,
    //         cells: data.cells.map(toNotebookCellDataDto)
    //     };
    // }
    function fromNotebookOutputItemDto(item) {
        return {
            mime: item.mime,
            data: item.valueBytes
        };
    }
    NotebookDto.fromNotebookOutputItemDto = fromNotebookOutputItemDto;
    function fromNotebookOutputDto(output) {
        return {
            outputId: output.outputId,
            metadata: output.metadata,
            outputs: output.items.map(fromNotebookOutputItemDto)
        };
    }
    NotebookDto.fromNotebookOutputDto = fromNotebookOutputDto;
    function fromNotebookCellDataDto(cell) {
        return {
            cellKind: cell.cellKind,
            language: cell.language,
            source: cell.source,
            outputs: cell.outputs.map(fromNotebookOutputDto),
            metadata: cell.metadata,
            internalMetadata: cell.internalMetadata
        };
    }
    NotebookDto.fromNotebookCellDataDto = fromNotebookCellDataDto;
    // export function fromNotebookDataDto(data: rpc.NotebookDataDto): NotebookData {
    //     return {
    //         metadata: data.metadata,
    //         cells: data.cells.map(fromNotebookCellDataDto)
    //     };
    // }
    // export function toNotebookCellDto(cell: Cell): rpc.NotebookCellDto {
    //     return {
    //         handle: cell.handle,
    //         uri: cell.uri,
    //         source: cell.textBuffer.getLinesContent(),
    //         eol: cell.textBuffer.getEOL(),
    //         language: cell.language,
    //         cellKind: cell.cellKind,
    //         outputs: cell.outputs.map(toNotebookOutputDto),
    //         metadata: cell.metadata,
    //         internalMetadata: cell.internalMetadata,
    //     };
    // }
    function fromCellExecuteUpdateDto(data) {
        if (data.editType === common_2.CellExecutionUpdateType.Output) {
            return {
                editType: data.editType,
                cellHandle: data.cellHandle,
                append: data.append,
                outputs: data.outputs.map(fromNotebookOutputDto)
            };
        }
        else if (data.editType === common_2.CellExecutionUpdateType.OutputItems) {
            return {
                editType: data.editType,
                append: data.append,
                items: data.items.map(fromNotebookOutputItemDto)
            };
        }
        else {
            return data;
        }
    }
    NotebookDto.fromCellExecuteUpdateDto = fromCellExecuteUpdateDto;
    function fromCellExecuteCompleteDto(data) {
        return data;
    }
    NotebookDto.fromCellExecuteCompleteDto = fromCellExecuteCompleteDto;
    // export function fromCellEditOperationDto(edit: rpc.CellEditOperationDto): CellEditOperation {
    //     if (edit.editType === CellEditType.Replace) {
    //         return {
    //             editType: edit.editType,
    //             index: edit.index,
    //             count: edit.count,
    //             cells: edit.cells.map(fromNotebookCellDataDto)
    //         };
    //     } else {
    //         return edit;
    //     }
    // }
})(NotebookDto = exports.NotebookDto || (exports.NotebookDto = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/plugin/type-converters'] = this;


/***/ })

}]);
//# sourceMappingURL=packages_plugin-ext_lib_common_disposable-util_js-packages_plugin-ext_lib_common_index_js-pac-d19cb9.js.map