"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstructionBreakpoint = exports.FunctionBreakpoint = exports.ExceptionBreakpoint = exports.BreakpointMarker = exports.SourceBreakpoint = exports.BREAKPOINT_KIND = void 0;
const coreutils_1 = require("@theia/core/shared/@phosphor/coreutils");
const common_1 = require("@theia/core/lib/common");
exports.BREAKPOINT_KIND = 'breakpoint';
var SourceBreakpoint;
(function (SourceBreakpoint) {
    function create(uri, data, origin) {
        return {
            id: origin ? origin.id : coreutils_1.UUID.uuid4(),
            uri: uri.toString(),
            enabled: origin ? origin.enabled : true,
            raw: {
                ...(origin && origin.raw),
                ...data
            }
        };
    }
    SourceBreakpoint.create = create;
})(SourceBreakpoint = exports.SourceBreakpoint || (exports.SourceBreakpoint = {}));
var BreakpointMarker;
(function (BreakpointMarker) {
    function is(node) {
        return 'kind' in node && node.kind === exports.BREAKPOINT_KIND;
    }
    BreakpointMarker.is = is;
})(BreakpointMarker = exports.BreakpointMarker || (exports.BreakpointMarker = {}));
var ExceptionBreakpoint;
(function (ExceptionBreakpoint) {
    function create(data, origin) {
        return {
            enabled: origin ? origin.enabled : false,
            condition: origin ? origin.condition : undefined,
            raw: {
                ...(origin && origin.raw),
                ...data
            }
        };
    }
    ExceptionBreakpoint.create = create;
})(ExceptionBreakpoint = exports.ExceptionBreakpoint || (exports.ExceptionBreakpoint = {}));
var FunctionBreakpoint;
(function (FunctionBreakpoint) {
    function create(data, origin) {
        return {
            id: origin ? origin.id : coreutils_1.UUID.uuid4(),
            enabled: origin ? origin.enabled : true,
            raw: {
                ...(origin && origin.raw),
                ...data
            }
        };
    }
    FunctionBreakpoint.create = create;
})(FunctionBreakpoint = exports.FunctionBreakpoint || (exports.FunctionBreakpoint = {}));
var InstructionBreakpoint;
(function (InstructionBreakpoint) {
    function create(raw, existing) {
        var _a, _b;
        return {
            ...raw,
            id: (_a = existing === null || existing === void 0 ? void 0 : existing.id) !== null && _a !== void 0 ? _a : coreutils_1.UUID.uuid4(),
            enabled: (_b = existing === null || existing === void 0 ? void 0 : existing.enabled) !== null && _b !== void 0 ? _b : true,
        };
    }
    InstructionBreakpoint.create = create;
    function is(arg) {
        return (0, common_1.isObject)(arg) && (0, common_1.isString)(arg.instructionReference);
    }
    InstructionBreakpoint.is = is;
})(InstructionBreakpoint = exports.InstructionBreakpoint || (exports.InstructionBreakpoint = {}));
//# sourceMappingURL=breakpoint-marker.js.map