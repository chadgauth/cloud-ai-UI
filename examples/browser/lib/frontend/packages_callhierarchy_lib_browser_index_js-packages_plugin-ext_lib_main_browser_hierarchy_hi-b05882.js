"use strict";
(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_callhierarchy_lib_browser_index_js-packages_plugin-ext_lib_main_browser_hierarchy_hi-b05882"],{

/***/ "../../packages/callhierarchy/lib/browser/index.js":
/*!*********************************************************!*\
  !*** ../../packages/callhierarchy/lib/browser/index.js ***!
  \*********************************************************/
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
__exportStar(__webpack_require__(/*! ./callhierarchy */ "../../packages/callhierarchy/lib/browser/callhierarchy.js"), exports);
__exportStar(__webpack_require__(/*! ./callhierarchy-contribution */ "../../packages/callhierarchy/lib/browser/callhierarchy-contribution.js"), exports);
__exportStar(__webpack_require__(/*! ./callhierarchy-frontend-module */ "../../packages/callhierarchy/lib/browser/callhierarchy-frontend-module.js"), exports);
__exportStar(__webpack_require__(/*! ./callhierarchy-service */ "../../packages/callhierarchy/lib/browser/callhierarchy-service.js"), exports);

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/callhierarchy/lib/browser'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/hierarchy/hierarchy-types-converters.js":
/*!******************************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/hierarchy/hierarchy-types-converters.js ***!
  \******************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2020 Red Hat, Inc. and others.
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
exports.fromCallHierarchyCalleeToModelCallHierarchyOutgoingCall = exports.fromCallHierarchyCallerToModelCallHierarchyIncomingCall = exports.toCallee = exports.fromCaller = exports.toCaller = exports.fromItemHierarchyDefinition = exports.toItemHierarchyDefinition = exports.SymbolKindConverter = exports.toRange = exports.fromRange = exports.fromPosition = exports.toLocation = exports.fromLocation = exports.fromUriComponents = exports.toUriComponents = void 0;
const languageProtocol = __webpack_require__(/*! @theia/core/shared/vscode-languageserver-protocol */ "../../packages/core/shared/vscode-languageserver-protocol/index.js");
const vscode_uri_1 = __webpack_require__(/*! @theia/core/shared/vscode-uri */ "../../packages/core/shared/vscode-uri/index.js");
const model = __webpack_require__(/*! ../../../common/plugin-api-rpc-model */ "../../packages/plugin-ext/lib/common/plugin-api-rpc-model.js");
function toUriComponents(uri) {
    return vscode_uri_1.URI.parse(uri);
}
exports.toUriComponents = toUriComponents;
function fromUriComponents(uri) {
    return vscode_uri_1.URI.revive(uri).toString();
}
exports.fromUriComponents = fromUriComponents;
function fromLocation(location) {
    return {
        uri: vscode_uri_1.URI.parse(location.uri),
        range: fromRange(location.range)
    };
}
exports.fromLocation = fromLocation;
function toLocation(uri, range) {
    return {
        uri: vscode_uri_1.URI.revive(uri).toString(),
        range: toRange(range)
    };
}
exports.toLocation = toLocation;
function fromPosition(position) {
    return {
        lineNumber: position.line,
        column: position.character
    };
}
exports.fromPosition = fromPosition;
function fromRange(range) {
    const { start, end } = range;
    return {
        startLineNumber: start.line + 1,
        startColumn: start.character + 1,
        endLineNumber: end.line + 1,
        endColumn: end.character + 1,
    };
}
exports.fromRange = fromRange;
function toRange(range) {
    return languageProtocol.Range.create(range.startLineNumber - 1, range.startColumn - 1, range.endLineNumber - 1, range.endColumn - 1);
}
exports.toRange = toRange;
var SymbolKindConverter;
(function (SymbolKindConverter) {
    function fromSymbolKind(kind) {
        switch (kind) {
            case languageProtocol.SymbolKind.File: return model.SymbolKind.File;
            case languageProtocol.SymbolKind.Module: return model.SymbolKind.Module;
            case languageProtocol.SymbolKind.Namespace: return model.SymbolKind.Namespace;
            case languageProtocol.SymbolKind.Package: return model.SymbolKind.Package;
            case languageProtocol.SymbolKind.Class: return model.SymbolKind.Class;
            case languageProtocol.SymbolKind.Method: return model.SymbolKind.Method;
            case languageProtocol.SymbolKind.Property: return model.SymbolKind.Property;
            case languageProtocol.SymbolKind.Field: return model.SymbolKind.Field;
            case languageProtocol.SymbolKind.Constructor: return model.SymbolKind.Constructor;
            case languageProtocol.SymbolKind.Enum: return model.SymbolKind.Enum;
            case languageProtocol.SymbolKind.Interface: return model.SymbolKind.Interface;
            case languageProtocol.SymbolKind.Function: return model.SymbolKind.Function;
            case languageProtocol.SymbolKind.Variable: return model.SymbolKind.Variable;
            case languageProtocol.SymbolKind.Constant: return model.SymbolKind.Constant;
            case languageProtocol.SymbolKind.String: return model.SymbolKind.String;
            case languageProtocol.SymbolKind.Number: return model.SymbolKind.Number;
            case languageProtocol.SymbolKind.Boolean: return model.SymbolKind.Boolean;
            case languageProtocol.SymbolKind.Array: return model.SymbolKind.Array;
            case languageProtocol.SymbolKind.Object: return model.SymbolKind.Object;
            case languageProtocol.SymbolKind.Key: return model.SymbolKind.Key;
            case languageProtocol.SymbolKind.Null: return model.SymbolKind.Null;
            case languageProtocol.SymbolKind.EnumMember: return model.SymbolKind.EnumMember;
            case languageProtocol.SymbolKind.Struct: return model.SymbolKind.Struct;
            case languageProtocol.SymbolKind.Event: return model.SymbolKind.Event;
            case languageProtocol.SymbolKind.Operator: return model.SymbolKind.Operator;
            case languageProtocol.SymbolKind.TypeParameter: return model.SymbolKind.TypeParameter;
            default: return model.SymbolKind.Property;
        }
    }
    SymbolKindConverter.fromSymbolKind = fromSymbolKind;
    function toSymbolKind(kind) {
        switch (kind) {
            case model.SymbolKind.File: return languageProtocol.SymbolKind.File;
            case model.SymbolKind.Module: return languageProtocol.SymbolKind.Module;
            case model.SymbolKind.Namespace: return languageProtocol.SymbolKind.Namespace;
            case model.SymbolKind.Package: return languageProtocol.SymbolKind.Package;
            case model.SymbolKind.Class: return languageProtocol.SymbolKind.Class;
            case model.SymbolKind.Method: return languageProtocol.SymbolKind.Method;
            case model.SymbolKind.Property: return languageProtocol.SymbolKind.Property;
            case model.SymbolKind.Field: return languageProtocol.SymbolKind.Field;
            case model.SymbolKind.Constructor: return languageProtocol.SymbolKind.Constructor;
            case model.SymbolKind.Enum: return languageProtocol.SymbolKind.Enum;
            case model.SymbolKind.Interface: return languageProtocol.SymbolKind.Interface;
            case model.SymbolKind.Function: return languageProtocol.SymbolKind.Function;
            case model.SymbolKind.Variable: return languageProtocol.SymbolKind.Variable;
            case model.SymbolKind.Constant: return languageProtocol.SymbolKind.Constant;
            case model.SymbolKind.String: return languageProtocol.SymbolKind.String;
            case model.SymbolKind.Number: return languageProtocol.SymbolKind.Number;
            case model.SymbolKind.Boolean: return languageProtocol.SymbolKind.Boolean;
            case model.SymbolKind.Array: return languageProtocol.SymbolKind.Array;
            case model.SymbolKind.Object: return languageProtocol.SymbolKind.Object;
            case model.SymbolKind.Key: return languageProtocol.SymbolKind.Key;
            case model.SymbolKind.Null: return languageProtocol.SymbolKind.Null;
            case model.SymbolKind.EnumMember: return languageProtocol.SymbolKind.EnumMember;
            case model.SymbolKind.Struct: return languageProtocol.SymbolKind.Struct;
            case model.SymbolKind.Event: return languageProtocol.SymbolKind.Event;
            case model.SymbolKind.Operator: return languageProtocol.SymbolKind.Operator;
            case model.SymbolKind.TypeParameter: return languageProtocol.SymbolKind.TypeParameter;
            default: return languageProtocol.SymbolKind.Property;
        }
    }
    SymbolKindConverter.toSymbolKind = toSymbolKind;
})(SymbolKindConverter = exports.SymbolKindConverter || (exports.SymbolKindConverter = {}));
function toItemHierarchyDefinition(modelItem) {
    return {
        ...modelItem,
        kind: SymbolKindConverter.toSymbolKind(modelItem.kind),
        range: toRange(modelItem.range),
        selectionRange: toRange(modelItem.selectionRange),
    };
}
exports.toItemHierarchyDefinition = toItemHierarchyDefinition;
function fromItemHierarchyDefinition(definition) {
    return {
        ...definition,
        kind: SymbolKindConverter.fromSymbolKind(definition.kind),
        range: fromRange(definition.range),
        selectionRange: fromRange(definition.range),
    };
}
exports.fromItemHierarchyDefinition = fromItemHierarchyDefinition;
function toCaller(caller) {
    return {
        from: toItemHierarchyDefinition(caller.from),
        fromRanges: caller.fromRanges.map(toRange)
    };
}
exports.toCaller = toCaller;
function fromCaller(caller) {
    return {
        from: fromItemHierarchyDefinition(caller.from),
        fromRanges: caller.fromRanges.map(fromRange)
    };
}
exports.fromCaller = fromCaller;
function toCallee(callee) {
    return {
        to: toItemHierarchyDefinition(callee.to),
        fromRanges: callee.fromRanges.map(toRange),
    };
}
exports.toCallee = toCallee;
function fromCallHierarchyCallerToModelCallHierarchyIncomingCall(caller) {
    return {
        from: fromItemHierarchyDefinition(caller.from),
        fromRanges: caller.fromRanges.map(fromRange),
    };
}
exports.fromCallHierarchyCallerToModelCallHierarchyIncomingCall = fromCallHierarchyCallerToModelCallHierarchyIncomingCall;
function fromCallHierarchyCalleeToModelCallHierarchyOutgoingCall(callee) {
    return {
        to: fromItemHierarchyDefinition(callee.to),
        fromRanges: callee.fromRanges.map(fromRange),
    };
}
exports.fromCallHierarchyCalleeToModelCallHierarchyOutgoingCall = fromCallHierarchyCalleeToModelCallHierarchyOutgoingCall;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/hierarchy/hierarchy-types-converters'] = this;


/***/ }),

/***/ "../../packages/typehierarchy/lib/browser/index.js":
/*!*********************************************************!*\
  !*** ../../packages/typehierarchy/lib/browser/index.js ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
__exportStar(__webpack_require__(/*! ./typehierarchy */ "../../packages/typehierarchy/lib/browser/typehierarchy.js"), exports);
__exportStar(__webpack_require__(/*! ./typehierarchy-contribution */ "../../packages/typehierarchy/lib/browser/typehierarchy-contribution.js"), exports);
__exportStar(__webpack_require__(/*! ./typehierarchy-frontend-module */ "../../packages/typehierarchy/lib/browser/typehierarchy-frontend-module.js"), exports);
__exportStar(__webpack_require__(/*! ./typehierarchy-service */ "../../packages/typehierarchy/lib/browser/typehierarchy-service.js"), exports);

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/typehierarchy/lib/browser'] = this;


/***/ }),

/***/ "../../packages/typehierarchy/lib/browser/typehierarchy.js":
/*!*****************************************************************!*\
  !*** ../../packages/typehierarchy/lib/browser/typehierarchy.js ***!
  \*****************************************************************/
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

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/typehierarchy/lib/browser/typehierarchy'] = this;


/***/ })

}]);
//# sourceMappingURL=packages_callhierarchy_lib_browser_index_js-packages_plugin-ext_lib_main_browser_hierarchy_hi-b05882.js.map