(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_debug_lib_browser_debug-session-manager_js"],{

/***/ "../../packages/core/shared/vscode-uri/index.js":
/*!******************************************************!*\
  !*** ../../packages/core/shared/vscode-uri/index.js ***!
  \******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! vscode-uri */ "../../node_modules/vscode-uri/lib/esm/index.js");

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/shared/vscode-uri'] = this;


/***/ }),

/***/ "../../packages/debug/lib/browser/breakpoint/breakpoint-manager.js":
/*!*************************************************************************!*\
  !*** ../../packages/debug/lib/browser/breakpoint/breakpoint-manager.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var BreakpointManager_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BreakpointManager = void 0;
const deepEqual = __webpack_require__(/*! fast-deep-equal */ "../../node_modules/fast-deep-equal/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const marker_manager_1 = __webpack_require__(/*! @theia/markers/lib/browser/marker-manager */ "../../packages/markers/lib/browser/marker-manager.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const breakpoint_marker_1 = __webpack_require__(/*! ./breakpoint-marker */ "../../packages/debug/lib/browser/breakpoint/breakpoint-marker.js");
let BreakpointManager = BreakpointManager_1 = class BreakpointManager extends marker_manager_1.MarkerManager {
    constructor() {
        super(...arguments);
        this.owner = 'breakpoint';
        this.onDidChangeBreakpointsEmitter = new common_1.Emitter();
        this.onDidChangeBreakpoints = this.onDidChangeBreakpointsEmitter.event;
        this.onDidChangeFunctionBreakpointsEmitter = new common_1.Emitter();
        this.onDidChangeFunctionBreakpoints = this.onDidChangeFunctionBreakpointsEmitter.event;
        this.onDidChangeInstructionBreakpointsEmitter = new common_1.Emitter();
        this.onDidChangeInstructionBreakpoints = this.onDidChangeInstructionBreakpointsEmitter.event;
        this._breakpointsEnabled = true;
        this.exceptionBreakpoints = new Map();
        this.functionBreakpoints = [];
        this.instructionBreakpoints = [];
    }
    getKind() {
        return breakpoint_marker_1.BREAKPOINT_KIND;
    }
    setMarkers(uri, owner, newMarkers) {
        const result = this.findMarkers({ uri, owner });
        const added = [];
        const removed = [];
        const changed = [];
        const oldMarkers = new Map(result.map(({ data }) => [data.id, data]));
        const ids = new Set();
        let didChangeMarkers = false;
        for (const newMarker of newMarkers) {
            ids.add(newMarker.id);
            const oldMarker = oldMarkers.get(newMarker.id);
            if (!oldMarker) {
                added.push(newMarker);
            }
            else {
                // We emit all existing markers as 'changed', but we only fire an event if something really did change.
                didChangeMarkers || (didChangeMarkers = !!added.length || !deepEqual(oldMarker, newMarker));
                changed.push(newMarker);
            }
        }
        for (const [id, data] of oldMarkers.entries()) {
            if (!ids.has(id)) {
                removed.push(data);
            }
        }
        if (added.length || removed.length || didChangeMarkers) {
            super.setMarkers(uri, owner, newMarkers);
            this.onDidChangeBreakpointsEmitter.fire({ uri, added, removed, changed });
        }
        return result;
    }
    getLineBreakpoints(uri, line) {
        return this.findMarkers({
            uri,
            dataFilter: breakpoint => breakpoint.raw.line === line
        }).map(({ data }) => data);
    }
    getInlineBreakpoint(uri, line, column) {
        const marker = this.findMarkers({
            uri,
            dataFilter: breakpoint => breakpoint.raw.line === line && breakpoint.raw.column === column
        })[0];
        return marker && marker.data;
    }
    getBreakpoints(uri) {
        return this.findMarkers({ uri }).map(marker => marker.data);
    }
    setBreakpoints(uri, breakpoints) {
        this.setMarkers(uri, this.owner, breakpoints.sort((a, b) => (a.raw.line - b.raw.line) || ((a.raw.column || 0) - (b.raw.column || 0))));
    }
    addBreakpoint(breakpoint) {
        const uri = new uri_1.default(breakpoint.uri);
        const breakpoints = this.getBreakpoints(uri);
        const newBreakpoints = breakpoints.filter(({ raw }) => !(raw.line === breakpoint.raw.line && raw.column === breakpoint.raw.column));
        if (breakpoints.length === newBreakpoints.length) {
            newBreakpoints.push(breakpoint);
            this.setBreakpoints(uri, newBreakpoints);
            return true;
        }
        return false;
    }
    enableAllBreakpoints(enabled) {
        for (const uriString of this.getUris()) {
            let didChange = false;
            const uri = new uri_1.default(uriString);
            const markers = this.findMarkers({ uri });
            for (const marker of markers) {
                if (marker.data.enabled !== enabled) {
                    marker.data.enabled = enabled;
                    didChange = true;
                }
            }
            if (didChange) {
                this.fireOnDidChangeMarkers(uri);
            }
        }
        let didChangeFunction = false;
        for (const breakpoint of this.getFunctionBreakpoints().concat(this.getInstructionBreakpoints())) {
            if (breakpoint.enabled !== enabled) {
                breakpoint.enabled = enabled;
                didChangeFunction = true;
            }
        }
        if (didChangeFunction) {
            this.fireOnDidChangeMarkers(BreakpointManager_1.FUNCTION_URI);
        }
    }
    get breakpointsEnabled() {
        return this._breakpointsEnabled;
    }
    set breakpointsEnabled(breakpointsEnabled) {
        if (this._breakpointsEnabled !== breakpointsEnabled) {
            this._breakpointsEnabled = breakpointsEnabled;
            for (const uri of this.getUris()) {
                this.fireOnDidChangeMarkers(new uri_1.default(uri));
            }
            this.fireOnDidChangeMarkers(BreakpointManager_1.FUNCTION_URI);
        }
    }
    getExceptionBreakpoint(filter) {
        return this.exceptionBreakpoints.get(filter);
    }
    getExceptionBreakpoints() {
        return this.exceptionBreakpoints.values();
    }
    setExceptionBreakpoints(exceptionBreakpoints) {
        const toRemove = new Set(this.exceptionBreakpoints.keys());
        for (const exceptionBreakpoint of exceptionBreakpoints) {
            const filter = exceptionBreakpoint.raw.filter;
            toRemove.delete(filter);
            this.exceptionBreakpoints.set(filter, exceptionBreakpoint);
        }
        for (const filter of toRemove) {
            this.exceptionBreakpoints.delete(filter);
        }
        if (toRemove.size || exceptionBreakpoints.length) {
            this.fireOnDidChangeMarkers(BreakpointManager_1.EXCEPTION_URI);
        }
    }
    toggleExceptionBreakpoint(filter) {
        const breakpoint = this.getExceptionBreakpoint(filter);
        if (breakpoint) {
            breakpoint.enabled = !breakpoint.enabled;
            this.fireOnDidChangeMarkers(BreakpointManager_1.EXCEPTION_URI);
        }
    }
    updateExceptionBreakpoint(filter, options) {
        const breakpoint = this.getExceptionBreakpoint(filter);
        if (breakpoint) {
            Object.assign(breakpoint, options);
            this.fireOnDidChangeMarkers(BreakpointManager_1.EXCEPTION_URI);
        }
    }
    getFunctionBreakpoints() {
        return this.functionBreakpoints;
    }
    setFunctionBreakpoints(functionBreakpoints) {
        const oldBreakpoints = new Map(this.functionBreakpoints.map(b => [b.id, b]));
        this.functionBreakpoints = functionBreakpoints;
        this.fireOnDidChangeMarkers(BreakpointManager_1.FUNCTION_URI);
        const added = [];
        const removed = [];
        const changed = [];
        const ids = new Set();
        for (const newBreakpoint of functionBreakpoints) {
            ids.add(newBreakpoint.id);
            if (oldBreakpoints.has(newBreakpoint.id)) {
                changed.push(newBreakpoint);
            }
            else {
                added.push(newBreakpoint);
            }
        }
        for (const [id, breakpoint] of oldBreakpoints.entries()) {
            if (!ids.has(id)) {
                removed.push(breakpoint);
            }
        }
        this.onDidChangeFunctionBreakpointsEmitter.fire({ uri: BreakpointManager_1.FUNCTION_URI, added, removed, changed });
    }
    getInstructionBreakpoints() {
        return Object.freeze(this.instructionBreakpoints.slice());
    }
    hasBreakpoints() {
        return Boolean(this.getUris().next().value || this.functionBreakpoints.length || this.instructionBreakpoints.length);
    }
    setInstructionBreakpoints(newBreakpoints) {
        const oldBreakpoints = new Map(this.instructionBreakpoints.map(breakpoint => [breakpoint.id, breakpoint]));
        const currentBreakpoints = new Map(newBreakpoints.map(breakpoint => [breakpoint.id, breakpoint]));
        const added = [];
        const changed = [];
        for (const [id, breakpoint] of currentBreakpoints.entries()) {
            const old = oldBreakpoints.get(id);
            if (old) {
                changed.push(old);
            }
            else {
                added.push(breakpoint);
            }
            oldBreakpoints.delete(id);
        }
        const removed = Array.from(oldBreakpoints.values());
        this.instructionBreakpoints = Array.from(currentBreakpoints.values());
        this.fireOnDidChangeMarkers(BreakpointManager_1.INSTRUCTION_URI);
        this.onDidChangeInstructionBreakpointsEmitter.fire({ uri: BreakpointManager_1.INSTRUCTION_URI, added, removed, changed });
    }
    addInstructionBreakpoint(address, offset, condition, hitCondition) {
        this.setInstructionBreakpoints(this.instructionBreakpoints.concat(breakpoint_marker_1.InstructionBreakpoint.create({
            instructionReference: address,
            offset,
            condition,
            hitCondition,
        })));
    }
    updateInstructionBreakpoint(id, options) {
        const breakpoint = this.instructionBreakpoints.find(candidate => id === candidate.id);
        if (breakpoint) {
            Object.assign(breakpoint, options);
            this.fireOnDidChangeMarkers(BreakpointManager_1.INSTRUCTION_URI);
            this.onDidChangeInstructionBreakpointsEmitter.fire({ uri: BreakpointManager_1.INSTRUCTION_URI, changed: [breakpoint], added: [], removed: [] });
        }
    }
    removeInstructionBreakpoint(address) {
        if (!address) {
            this.clearInstructionBreakpoints();
        }
        const breakpointIndex = this.instructionBreakpoints.findIndex(breakpoint => breakpoint.instructionReference === address);
        if (breakpointIndex !== -1) {
            const removed = this.instructionBreakpoints.splice(breakpointIndex, 1);
            this.fireOnDidChangeMarkers(BreakpointManager_1.INSTRUCTION_URI);
            this.onDidChangeInstructionBreakpointsEmitter.fire({ uri: BreakpointManager_1.INSTRUCTION_URI, added: [], changed: [], removed });
        }
    }
    clearInstructionBreakpoints() {
        this.setInstructionBreakpoints([]);
    }
    removeBreakpoints() {
        this.cleanAllMarkers();
        this.setFunctionBreakpoints([]);
        this.setInstructionBreakpoints([]);
    }
    async load() {
        const data = await this.storage.getData('breakpoints', {
            breakpointsEnabled: true,
            breakpoints: {}
        });
        this._breakpointsEnabled = data.breakpointsEnabled;
        // eslint-disable-next-line guard-for-in
        for (const uri in data.breakpoints) {
            this.setBreakpoints(new uri_1.default(uri), data.breakpoints[uri]);
        }
        if (data.functionBreakpoints) {
            this.setFunctionBreakpoints(data.functionBreakpoints);
        }
        if (data.exceptionBreakpoints) {
            this.setExceptionBreakpoints(data.exceptionBreakpoints);
        }
        if (data.instructionBreakpoints) {
            this.setInstructionBreakpoints(data.instructionBreakpoints);
        }
    }
    save() {
        const data = {
            breakpointsEnabled: this._breakpointsEnabled,
            breakpoints: {}
        };
        const uris = this.getUris();
        for (const uri of uris) {
            data.breakpoints[uri] = this.findMarkers({ uri: new uri_1.default(uri) }).map(marker => marker.data);
        }
        if (this.functionBreakpoints.length) {
            data.functionBreakpoints = this.functionBreakpoints;
        }
        if (this.exceptionBreakpoints.size) {
            data.exceptionBreakpoints = [...this.exceptionBreakpoints.values()];
        }
        if (this.instructionBreakpoints.length) {
            data.instructionBreakpoints = this.instructionBreakpoints;
        }
        this.storage.setData('breakpoints', data);
    }
};
BreakpointManager.EXCEPTION_URI = new uri_1.default('debug:exception://');
BreakpointManager.FUNCTION_URI = new uri_1.default('debug:function://');
BreakpointManager.INSTRUCTION_URI = new uri_1.default('debug:instruction://');
__decorate([
    (0, inversify_1.inject)(browser_1.StorageService),
    __metadata("design:type", Object)
], BreakpointManager.prototype, "storage", void 0);
BreakpointManager = BreakpointManager_1 = __decorate([
    (0, inversify_1.injectable)()
], BreakpointManager);
exports.BreakpointManager = BreakpointManager;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/debug/lib/browser/breakpoint/breakpoint-manager'] = this;


/***/ }),

/***/ "../../packages/debug/lib/browser/breakpoint/breakpoint-marker.js":
/*!************************************************************************!*\
  !*** ../../packages/debug/lib/browser/breakpoint/breakpoint-marker.js ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InstructionBreakpoint = exports.FunctionBreakpoint = exports.ExceptionBreakpoint = exports.BreakpointMarker = exports.SourceBreakpoint = exports.BREAKPOINT_KIND = void 0;
const coreutils_1 = __webpack_require__(/*! @theia/core/shared/@phosphor/coreutils */ "../../packages/core/shared/@phosphor/coreutils/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
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

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/debug/lib/browser/breakpoint/breakpoint-marker'] = this;


/***/ }),

/***/ "../../packages/debug/lib/browser/console/debug-console-items.js":
/*!***********************************************************************!*\
  !*** ../../packages/debug/lib/browser/console/debug-console-items.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DebugScope = exports.ExpressionItem = exports.DebugVirtualVariable = exports.DebugVariable = exports.ExpressionContainer = void 0;
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const console_session_1 = __webpack_require__(/*! @theia/console/lib/browser/console-session */ "../../packages/console/lib/browser/console-session.js");
const severity_1 = __webpack_require__(/*! @theia/core/lib/common/severity */ "../../packages/core/lib/common/severity.js");
const monaco = __webpack_require__(/*! @theia/monaco-editor-core */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/editor.main.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
class ExpressionContainer {
    constructor(options) {
        this.sessionProvider = options.session;
        this.variablesReference = options.variablesReference || 0;
        this.namedVariables = options.namedVariables;
        this.indexedVariables = options.indexedVariables;
        this.startOfVariables = options.startOfVariables || 0;
    }
    get session() {
        return this.sessionProvider();
    }
    render() {
        return undefined;
    }
    get hasElements() {
        return !!this.variablesReference;
    }
    async getElements() {
        if (!this.hasElements || !this.session) {
            return [][Symbol.iterator]();
        }
        if (!this.elements) {
            this.elements = this.doResolve();
        }
        return (await this.elements)[Symbol.iterator]();
    }
    async doResolve() {
        const result = [];
        if (this.namedVariables) {
            await this.fetch(result, 'named');
        }
        if (this.indexedVariables) {
            let chunkSize = ExpressionContainer.BASE_CHUNK_SIZE;
            while (this.indexedVariables > chunkSize * ExpressionContainer.BASE_CHUNK_SIZE) {
                chunkSize *= ExpressionContainer.BASE_CHUNK_SIZE;
            }
            if (this.indexedVariables > chunkSize) {
                const numberOfChunks = Math.ceil(this.indexedVariables / chunkSize);
                for (let i = 0; i < numberOfChunks; i++) {
                    const start = this.startOfVariables + i * chunkSize;
                    const count = Math.min(chunkSize, this.indexedVariables - i * chunkSize);
                    const { variablesReference } = this;
                    result.push(new DebugVirtualVariable({
                        session: this.sessionProvider,
                        variablesReference,
                        namedVariables: 0,
                        indexedVariables: count,
                        startOfVariables: start,
                        name: `[${start}..${start + count - 1}]`
                    }));
                }
                return result;
            }
        }
        await this.fetch(result, 'indexed', this.startOfVariables, this.indexedVariables);
        return result;
    }
    async fetch(result, filter, start, count) {
        try {
            const { variablesReference } = this;
            const response = await this.session.sendRequest('variables', { variablesReference, filter, start, count });
            const { variables } = response.body;
            const names = new Set();
            for (const variable of variables) {
                if (!names.has(variable.name)) {
                    result.push(new DebugVariable(this.sessionProvider, variable, this));
                    names.add(variable.name);
                }
            }
        }
        catch (e) {
            result.push({
                severity: severity_1.Severity.Error,
                visible: !!e.message,
                render: () => e.message
            });
        }
    }
}
exports.ExpressionContainer = ExpressionContainer;
ExpressionContainer.BASE_CHUNK_SIZE = 100;
class DebugVariable extends ExpressionContainer {
    constructor(session, variable, parent) {
        super({
            session,
            variablesReference: variable.variablesReference,
            namedVariables: variable.namedVariables,
            indexedVariables: variable.indexedVariables
        });
        this.variable = variable;
        this.parent = parent;
        this.setValueRef = (valueRef) => this.valueRef = valueRef || undefined;
        this.setNameRef = (nameRef) => this.nameRef = nameRef || undefined;
    }
    get name() {
        return this.variable.name;
    }
    get type() {
        return this._type || this.variable.type;
    }
    get value() {
        return this._value || this.variable.value;
    }
    render() {
        const { type, value, name } = this;
        return React.createElement("div", { className: this.variableClassName },
            React.createElement("span", { title: type || name, className: 'name', ref: this.setNameRef },
                name,
                !!value && ': '),
            React.createElement("span", { title: value, ref: this.setValueRef }, value));
    }
    get variableClassName() {
        const { type, value } = this;
        const classNames = ['theia-debug-console-variable'];
        if (type === 'number' || type === 'boolean' || type === 'string') {
            classNames.push(type);
        }
        else if (!isNaN(+value)) {
            classNames.push('number');
        }
        else if (DebugVariable.booleanRegex.test(value)) {
            classNames.push('boolean');
        }
        else if (DebugVariable.stringRegex.test(value)) {
            classNames.push('string');
        }
        return classNames.join(' ');
    }
    get supportSetVariable() {
        return !!this.session && !!this.session.capabilities.supportsSetVariable;
    }
    async setValue(value) {
        if (!this.session) {
            return;
        }
        const { name, parent } = this;
        const variablesReference = parent['variablesReference'];
        try {
            const response = await this.session.sendRequest('setVariable', { variablesReference, name, value });
            this._value = response.body.value;
            this._type = response.body.type;
            this.variablesReference = response.body.variablesReference || 0;
            this.namedVariables = response.body.namedVariables;
            this.indexedVariables = response.body.indexedVariables;
            this.elements = undefined;
            this.session['fireDidChange']();
        }
        catch (error) {
            console.error('setValue failed:', error);
        }
    }
    get supportCopyValue() {
        return !!this.valueRef && document.queryCommandSupported('copy');
    }
    copyValue() {
        const selection = document.getSelection();
        if (this.valueRef && selection) {
            selection.selectAllChildren(this.valueRef);
            document.execCommand('copy');
        }
    }
    get supportCopyAsExpression() {
        return !!this.nameRef && document.queryCommandSupported('copy');
    }
    copyAsExpression() {
        const selection = document.getSelection();
        if (this.nameRef && selection) {
            selection.selectAllChildren(this.nameRef);
            document.execCommand('copy');
        }
    }
    async open() {
        if (!this.supportSetVariable) {
            return;
        }
        const input = new browser_1.SingleTextInputDialog({
            title: core_1.nls.localize('theia/debug/debugVariableInput', 'Set {0} Value', this.name),
            initialValue: this.value,
            placeholder: core_1.nls.localizeByDefault('Value')
        });
        const newValue = await input.open();
        if (newValue) {
            await this.setValue(newValue);
        }
    }
}
exports.DebugVariable = DebugVariable;
DebugVariable.booleanRegex = /^true|false$/i;
DebugVariable.stringRegex = /^(['"]).*\1$/;
class DebugVirtualVariable extends ExpressionContainer {
    constructor(options) {
        super(options);
        this.options = options;
    }
    render() {
        return this.options.name;
    }
}
exports.DebugVirtualVariable = DebugVirtualVariable;
class ExpressionItem extends ExpressionContainer {
    constructor(_expression, session) {
        super({ session });
        this._expression = _expression;
        this._value = ExpressionItem.notAvailable;
        this._available = false;
    }
    get value() {
        return this._value;
    }
    get type() {
        return this._type;
    }
    get available() {
        return this._available;
    }
    get expression() {
        return this._expression;
    }
    render() {
        const valueClassNames = [];
        if (!this._available) {
            valueClassNames.push(console_session_1.ConsoleItem.errorClassName);
            valueClassNames.push('theia-debug-console-unavailable');
        }
        return React.createElement("div", { className: 'theia-debug-console-expression' },
            React.createElement("div", null, this._expression),
            React.createElement("div", { className: valueClassNames.join(' ') }, this._value));
    }
    async evaluate(context = 'repl') {
        const session = this.session;
        if (session) {
            try {
                const body = await session.evaluate(this._expression, context);
                this.setResult(body);
            }
            catch (err) {
                this.setResult(undefined, err.message);
            }
        }
        else {
            this.setResult(undefined, 'Please start a debug session to evaluate');
        }
    }
    setResult(body, error = ExpressionItem.notAvailable) {
        if (body) {
            this._value = body.result;
            this._type = body.type;
            this._available = true;
            this.variablesReference = body.variablesReference;
            this.namedVariables = body.namedVariables;
            this.indexedVariables = body.indexedVariables;
            this.severity = severity_1.Severity.Log;
        }
        else {
            this._value = error;
            this._type = undefined;
            this._available = false;
            this.variablesReference = 0;
            this.namedVariables = undefined;
            this.indexedVariables = undefined;
            this.severity = severity_1.Severity.Error;
        }
        this.elements = undefined;
    }
}
exports.ExpressionItem = ExpressionItem;
ExpressionItem.notAvailable = 'not available';
class DebugScope extends ExpressionContainer {
    constructor(raw, session) {
        super({
            session,
            variablesReference: raw.variablesReference,
            namedVariables: raw.namedVariables,
            indexedVariables: raw.indexedVariables
        });
        this.raw = raw;
    }
    render() {
        return this.name;
    }
    get expensive() {
        return this.raw.expensive;
    }
    get range() {
        const { line, column, endLine, endColumn } = this.raw;
        if (line !== undefined && column !== undefined && endLine !== undefined && endColumn !== undefined) {
            return new monaco.Range(line, column, endLine, endColumn);
        }
        return undefined;
    }
    get name() {
        return this.raw.name;
    }
}
exports.DebugScope = DebugScope;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/debug/lib/browser/console/debug-console-items'] = this;


/***/ }),

/***/ "../../packages/debug/lib/browser/debug-configuration-manager.js":
/*!***********************************************************************!*\
  !*** ../../packages/debug/lib/browser/debug-configuration-manager.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DebugConfigurationManager = void 0;
/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT License. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/
const debounce = __webpack_require__(/*! p-debounce */ "../../node_modules/p-debounce/index.js");
const jsonc_parser_1 = __webpack_require__(/*! jsonc-parser */ "../../node_modules/jsonc-parser/lib/esm/main.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const event_1 = __webpack_require__(/*! @theia/core/lib/common/event */ "../../packages/core/lib/common/event.js");
const browser_1 = __webpack_require__(/*! @theia/editor/lib/browser */ "../../packages/editor/lib/browser/index.js");
const monaco_editor_1 = __webpack_require__(/*! @theia/monaco/lib/browser/monaco-editor */ "../../packages/monaco/lib/browser/monaco-editor.js");
const browser_2 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const quick_pick_service_1 = __webpack_require__(/*! @theia/core/lib/common/quick-pick-service */ "../../packages/core/lib/common/quick-pick-service.js");
const workspace_service_1 = __webpack_require__(/*! @theia/workspace/lib/browser/workspace-service */ "../../packages/workspace/lib/browser/workspace-service.js");
const debug_configuration_model_1 = __webpack_require__(/*! ./debug-configuration-model */ "../../packages/debug/lib/browser/debug-configuration-model.js");
const debug_session_options_1 = __webpack_require__(/*! ./debug-session-options */ "../../packages/debug/lib/browser/debug-session-options.js");
const debug_service_1 = __webpack_require__(/*! ../common/debug-service */ "../../packages/debug/lib/common/debug-service.js");
const context_key_service_1 = __webpack_require__(/*! @theia/core/lib/browser/context-key-service */ "../../packages/core/lib/browser/context-key-service.js");
const debug_common_1 = __webpack_require__(/*! ../common/debug-common */ "../../packages/debug/lib/common/debug-common.js");
const workspace_variable_contribution_1 = __webpack_require__(/*! @theia/workspace/lib/browser/workspace-variable-contribution */ "../../packages/workspace/lib/browser/workspace-variable-contribution.js");
const preference_configurations_1 = __webpack_require__(/*! @theia/core/lib/browser/preferences/preference-configurations */ "../../packages/core/lib/browser/preferences/preference-configurations.js");
const monaco_text_model_service_1 = __webpack_require__(/*! @theia/monaco/lib/browser/monaco-text-model-service */ "../../packages/monaco/lib/browser/monaco-text-model-service.js");
const commands_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/platform/commands/common/commands */ "../../node_modules/@theia/monaco-editor-core/esm/vs/platform/commands/common/commands.js");
const standaloneServices_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
let DebugConfigurationManager = class DebugConfigurationManager {
    constructor() {
        this.onDidChangeEmitter = new event_1.Emitter();
        this.onDidChange = this.onDidChangeEmitter.event;
        this.onWillProvideDebugConfigurationEmitter = new event_1.Emitter();
        this.onWillProvideDebugConfiguration = this.onWillProvideDebugConfigurationEmitter.event;
        this.onWillProvideDynamicDebugConfigurationEmitter = new event_1.Emitter();
        this.recentDynamicOptionsTracker = [];
        this.models = new Map();
        this.updateModels = debounce(async () => {
            const roots = await this.workspaceService.roots;
            const toDelete = new Set(this.models.keys());
            for (const rootStat of roots) {
                const key = rootStat.resource.toString();
                toDelete.delete(key);
                if (!this.models.has(key)) {
                    const model = new debug_configuration_model_1.DebugConfigurationModel(key, this.preferences);
                    model.onDidChange(() => this.updateCurrent());
                    model.onDispose(() => this.models.delete(key));
                    this.models.set(key, model);
                }
            }
            for (const uri of toDelete) {
                const model = this.models.get(uri);
                if (model) {
                    model.dispose();
                }
            }
            this.updateCurrent();
        }, 500);
    }
    get onWillProvideDynamicDebugConfiguration() {
        return this.onWillProvideDynamicDebugConfigurationEmitter.event;
    }
    get onDidChangeConfigurationProviders() {
        return this.debug.onDidChangeDebugConfigurationProviders;
    }
    init() {
        this.doInit();
    }
    async doInit() {
        this.debugConfigurationTypeKey = this.contextKeyService.createKey('debugConfigurationType', undefined);
        this.initialized = this.preferences.ready.then(() => {
            this.workspaceService.onWorkspaceChanged(this.updateModels);
            this.preferences.onPreferenceChanged(e => {
                if (e.preferenceName === 'launch') {
                    this.updateModels();
                }
            });
            return this.updateModels();
        });
    }
    /**
     * All _non-dynamic_ debug configurations.
     */
    get all() {
        return this.getAll();
    }
    *getAll() {
        for (const model of this.models.values()) {
            for (const configuration of model.configurations) {
                yield this.configurationToOptions(configuration, model.workspaceFolderUri);
            }
            for (const compound of model.compounds) {
                yield this.compoundToOptions(compound, model.workspaceFolderUri);
            }
        }
    }
    get supported() {
        return this.getSupported();
    }
    async getSupported() {
        await this.initialized;
        const debugTypes = await this.debug.debugTypes();
        return this.doGetSupported(new Set(debugTypes));
    }
    *doGetSupported(debugTypes) {
        for (const options of this.getAll()) {
            if (options.configuration && debugTypes.has(options.configuration.type)) {
                yield options;
            }
        }
    }
    get current() {
        return this._currentOptions;
    }
    async getSelectedConfiguration() {
        if (!debug_session_options_1.DebugSessionOptions.isDynamic(this._currentOptions)) {
            return this._currentOptions;
        }
        // Refresh a dynamic configuration from the provider.
        // This allow providers to update properties before the execution e.g. program
        const { providerType, workspaceFolderUri, configuration: { name } } = this._currentOptions;
        const configuration = await this.fetchDynamicDebugConfiguration(name, providerType, workspaceFolderUri);
        if (!configuration) {
            const message = core_1.nls.localize('theia/debug/missingConfiguration', "Dynamic configuration '{0}:{1}' is missing or not applicable", providerType, name);
            throw new Error(message);
        }
        return { name, configuration, providerType, workspaceFolderUri };
    }
    set current(option) {
        this.updateCurrent(option);
        this.updateRecentlyUsedDynamicConfigurationOptions(option);
    }
    updateRecentlyUsedDynamicConfigurationOptions(option) {
        if (debug_session_options_1.DebugSessionOptions.isDynamic(option)) {
            // Removing an item already present in the list
            const index = this.recentDynamicOptionsTracker.findIndex(item => this.dynamicOptionsMatch(item, option));
            if (index > -1) {
                this.recentDynamicOptionsTracker.splice(index, 1);
            }
            // Adding new item, most recent at the top of the list
            const recentMax = 3;
            if (this.recentDynamicOptionsTracker.unshift(option) > recentMax) {
                // Keep the latest 3 dynamic configuration options to not clutter the dropdown.
                this.recentDynamicOptionsTracker.splice(recentMax);
            }
        }
    }
    dynamicOptionsMatch(one, other) {
        return one.providerType !== undefined
            && one.configuration.name === other.configuration.name
            && one.providerType === other.providerType
            && one.workspaceFolderUri === other.workspaceFolderUri;
    }
    get recentDynamicOptions() {
        return this.recentDynamicOptionsTracker;
    }
    updateCurrent(options = this._currentOptions) {
        var _a;
        if (debug_session_options_1.DebugSessionOptions.isCompound(options)) {
            this._currentOptions = options && this.find(options.compound, options.workspaceFolderUri);
        }
        else {
            this._currentOptions = options && this.find(options.configuration, options.workspaceFolderUri, options.providerType);
        }
        if (!this._currentOptions) {
            const model = this.getModel();
            if (model) {
                const configuration = model.configurations[0];
                if (configuration) {
                    this._currentOptions = this.configurationToOptions(configuration, model.workspaceFolderUri);
                }
            }
        }
        this.debugConfigurationTypeKey.set(this.current && ((_a = this.current.configuration) === null || _a === void 0 ? void 0 : _a.type));
        this.onDidChangeEmitter.fire(undefined);
    }
    find(nameOrConfigurationOrCompound, workspaceFolderUri, providerType) {
        if (debug_common_1.DebugConfiguration.is(nameOrConfigurationOrCompound) && providerType) {
            // providerType is only applicable to dynamic debug configurations and may only be created if we have a configuration given
            return this.configurationToOptions(nameOrConfigurationOrCompound, workspaceFolderUri, providerType);
        }
        const name = typeof nameOrConfigurationOrCompound === 'string' ? nameOrConfigurationOrCompound : nameOrConfigurationOrCompound.name;
        const configuration = this.findConfiguration(name, workspaceFolderUri);
        if (configuration) {
            return this.configurationToOptions(configuration, workspaceFolderUri);
        }
        const compound = this.findCompound(name, workspaceFolderUri);
        if (compound) {
            return this.compoundToOptions(compound, workspaceFolderUri);
        }
    }
    findConfigurations(name, workspaceFolderUri) {
        const matches = [];
        for (const model of this.models.values()) {
            if (model.workspaceFolderUri === workspaceFolderUri) {
                for (const configuration of model.configurations) {
                    if (configuration.name === name) {
                        matches.push(configuration);
                    }
                }
            }
        }
        return matches;
    }
    findConfiguration(name, workspaceFolderUri) {
        for (const model of this.models.values()) {
            if (model.workspaceFolderUri === workspaceFolderUri) {
                for (const configuration of model.configurations) {
                    if (configuration.name === name) {
                        return configuration;
                    }
                }
            }
        }
    }
    findCompound(name, workspaceFolderUri) {
        for (const model of this.models.values()) {
            if (model.workspaceFolderUri === workspaceFolderUri) {
                for (const compound of model.compounds) {
                    if (compound.name === name) {
                        return compound;
                    }
                }
            }
        }
    }
    async openConfiguration() {
        var _a;
        const currentUri = new uri_1.default((_a = this.current) === null || _a === void 0 ? void 0 : _a.workspaceFolderUri);
        const model = this.getModel(currentUri);
        if (model) {
            await this.doOpen(model);
        }
    }
    configurationToOptions(configuration, workspaceFolderUri, providerType) {
        return { name: configuration.name, configuration, providerType, workspaceFolderUri };
    }
    compoundToOptions(compound, workspaceFolderUri) {
        return { name: compound.name, compound, workspaceFolderUri };
    }
    async addConfiguration() {
        let rootUri = undefined;
        if (this.workspaceService.saved && this.workspaceService.tryGetRoots().length > 1) {
            rootUri = await this.selectRootUri();
            // Do not continue if the user explicitly does not choose a location.
            if (!rootUri) {
                return;
            }
        }
        const model = this.getModel(rootUri);
        if (!model) {
            return;
        }
        const widget = await this.doOpen(model);
        if (!(widget.editor instanceof monaco_editor_1.MonacoEditor)) {
            return;
        }
        const editor = widget.editor.getControl();
        const commandService = standaloneServices_1.StandaloneServices.get(commands_1.ICommandService);
        let position;
        let depthInArray = 0;
        let lastProperty = '';
        (0, jsonc_parser_1.visit)(editor.getValue(), {
            onObjectProperty: property => {
                lastProperty = property;
            },
            onArrayBegin: offset => {
                if (lastProperty === 'configurations' && depthInArray === 0) {
                    position = editor.getModel().getPositionAt(offset + 1);
                }
                depthInArray++;
            },
            onArrayEnd: () => {
                depthInArray--;
            }
        });
        if (!position) {
            return;
        }
        // Check if there are more characters on a line after a "configurations": [, if yes enter a newline
        if (editor.getModel().getLineLastNonWhitespaceColumn(position.lineNumber) > position.column) {
            editor.setPosition(position);
            editor.trigger('debug', 'lineBreakInsert', undefined);
        }
        // Check if there is already an empty line to insert suggest, if yes just place the cursor
        if (editor.getModel().getLineLastNonWhitespaceColumn(position.lineNumber + 1) === 0) {
            editor.setPosition({ lineNumber: position.lineNumber + 1, column: 1 << 30 });
            await commandService.executeCommand('editor.action.deleteLines');
        }
        editor.setPosition(position);
        await commandService.executeCommand('editor.action.insertLineAfter');
        await commandService.executeCommand('editor.action.triggerSuggest');
    }
    async selectRootUri() {
        const workspaceRoots = this.workspaceService.tryGetRoots();
        const items = [];
        for (const workspaceRoot of workspaceRoots) {
            items.push({
                label: this.labelProvider.getName(workspaceRoot.resource),
                description: this.labelProvider.getLongName(workspaceRoot.resource),
                value: workspaceRoot.resource
            });
        }
        const root = await this.quickPickService.show(items, {
            placeholder: core_1.nls.localize('theia/debug/addConfigurationPlaceholder', 'Select workspace root to add configuration to'),
        });
        return root === null || root === void 0 ? void 0 : root.value;
    }
    getModel(uri) {
        const workspaceFolderUri = this.workspaceVariables.getWorkspaceRootUri(uri);
        if (workspaceFolderUri) {
            const key = workspaceFolderUri.toString();
            for (const model of this.models.values()) {
                if (model.workspaceFolderUri === key) {
                    return model;
                }
            }
        }
        for (const model of this.models.values()) {
            if (model.uri) {
                return model;
            }
        }
        return this.models.values().next().value;
    }
    async doOpen(model) {
        const uri = await this.doCreate(model);
        return this.editorManager.open(uri, {
            mode: 'activate'
        });
    }
    async doCreate(model) {
        var _a;
        const uri = (_a = model.uri) !== null && _a !== void 0 ? _a : this.preferences.getConfigUri(browser_2.PreferenceScope.Folder, model.workspaceFolderUri, 'launch');
        if (!uri) { // Since we are requesting information about a known workspace folder, this should never happen.
            throw new Error('PreferenceService.getConfigUri has returned undefined when a URI was expected.');
        }
        const settingsUri = this.preferences.getConfigUri(browser_2.PreferenceScope.Folder, model.workspaceFolderUri);
        // Users may have placed their debug configurations in a `settings.json`, in which case we shouldn't modify the file.
        if (settingsUri && !uri.isEqual(settingsUri)) {
            await this.ensureContent(uri, model);
        }
        return uri;
    }
    /**
     * Checks whether a `launch.json` file contains the minimum necessary content.
     * If content not found, provides content and populates the file using Monaco.
     */
    async ensureContent(uri, model) {
        const textModel = await this.textModelService.createModelReference(uri);
        const currentContent = textModel.object.valid ? textModel.object.getText() : '';
        try { // Look for the minimal well-formed launch.json content: {configurations: []}
            const parsedContent = (0, jsonc_parser_1.parse)(currentContent);
            if (Array.isArray(parsedContent.configurations)) {
                return;
            }
        }
        catch {
            // Just keep going
        }
        const debugType = await this.selectDebugType();
        const configurations = debugType ? await this.provideDebugConfigurations(debugType, model.workspaceFolderUri) : [];
        const content = this.getInitialConfigurationContent(configurations);
        textModel.object.textEditorModel.setValue(content); // Will clobber anything the user has entered!
        await textModel.object.save();
    }
    async provideDebugConfigurations(debugType, workspaceFolderUri) {
        await this.fireWillProvideDebugConfiguration();
        return this.debug.provideDebugConfigurations(debugType, workspaceFolderUri);
    }
    async fireWillProvideDebugConfiguration() {
        await event_1.WaitUntilEvent.fire(this.onWillProvideDebugConfigurationEmitter, {});
    }
    async provideDynamicDebugConfigurations() {
        await this.fireWillProvideDynamicDebugConfiguration();
        const roots = this.workspaceService.tryGetRoots();
        const promises = roots.map(async (root) => {
            const configsMap = await this.debug.provideDynamicDebugConfigurations(root.resource.toString());
            const optionsMap = Object.fromEntries(Object.entries(configsMap).map(([type, configs]) => {
                const options = configs.map(config => ({
                    name: config.name,
                    providerType: type,
                    configuration: config,
                    workspaceFolderUri: root.resource.toString()
                }));
                return [type, options];
            }));
            return optionsMap;
        });
        const typesToOptionsRecords = await Promise.all(promises);
        const consolidatedTypesToOptions = {};
        for (const typesToOptionsInstance of typesToOptionsRecords) {
            for (const [providerType, configurationsOptions] of Object.entries(typesToOptionsInstance)) {
                if (!consolidatedTypesToOptions[providerType]) {
                    consolidatedTypesToOptions[providerType] = [];
                }
                consolidatedTypesToOptions[providerType].push(...configurationsOptions);
            }
        }
        return consolidatedTypesToOptions;
    }
    async fetchDynamicDebugConfiguration(name, type, folder) {
        await this.fireWillProvideDynamicDebugConfiguration();
        return this.debug.fetchDynamicDebugConfiguration(name, type, folder);
    }
    async fireWillProvideDynamicDebugConfiguration() {
        await this.initialized;
        await event_1.WaitUntilEvent.fire(this.onWillProvideDynamicDebugConfigurationEmitter, {});
    }
    getInitialConfigurationContent(initialConfigurations) {
        return `{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  "version": "0.2.0",
  "configurations": ${JSON.stringify(initialConfigurations, undefined, '  ').split('\n').map(line => '  ' + line).join('\n').trim()}
}
`;
    }
    async selectDebugType() {
        const widget = this.editorManager.currentEditor;
        if (!widget) {
            return undefined;
        }
        const { languageId } = widget.editor.document;
        const debuggers = await this.debug.getDebuggersForLanguage(languageId);
        if (debuggers.length === 0) {
            return undefined;
        }
        const items = debuggers.map(({ label, type }) => ({ label, value: type }));
        const selectedItem = await this.quickPickService.show(items, { placeholder: 'Select Environment' });
        return selectedItem === null || selectedItem === void 0 ? void 0 : selectedItem.value;
    }
    async load() {
        var _a, _b;
        await this.initialized;
        const data = await this.storage.getData('debug.configurations', {});
        this.resolveRecentDynamicOptionsFromData(data.recentDynamicOptions);
        // Between versions v1.26 and v1.27, the expected format of the data changed so that old stored data
        // may not contain the configuration key.
        if (debug_session_options_1.DebugSessionOptions.isConfiguration(data.current)) {
            // ensure options name is reflected from old configurations data
            data.current.name = (_a = data.current.name) !== null && _a !== void 0 ? _a : (_b = data.current.configuration) === null || _b === void 0 ? void 0 : _b.name;
            this.current = this.find(data.current.configuration, data.current.workspaceFolderUri, data.current.providerType);
        }
        else if (debug_session_options_1.DebugSessionOptions.isCompound(data.current)) {
            this.current = this.find(data.current.name, data.current.workspaceFolderUri);
        }
    }
    resolveRecentDynamicOptionsFromData(options) {
        if (!options || this.recentDynamicOptionsTracker.length !== 0) {
            return;
        }
        // ensure options name is reflected from old configurations data
        const dynamicOptions = options.map(option => {
            var _a;
            option.name = (_a = option.name) !== null && _a !== void 0 ? _a : option.configuration.name;
            return option;
        }).filter(debug_session_options_1.DebugSessionOptions.isDynamic);
        this.recentDynamicOptionsTracker = dynamicOptions;
    }
    save() {
        const data = {};
        const { current, recentDynamicOptionsTracker } = this;
        if (current) {
            data.current = current;
        }
        if (this.recentDynamicOptionsTracker.length > 0) {
            data.recentDynamicOptions = recentDynamicOptionsTracker;
        }
        if (Object.keys(data).length > 0) {
            this.storage.setData('debug.configurations', data);
        }
    }
};
__decorate([
    (0, inversify_1.inject)(workspace_service_1.WorkspaceService),
    __metadata("design:type", workspace_service_1.WorkspaceService)
], DebugConfigurationManager.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.EditorManager),
    __metadata("design:type", browser_1.EditorManager)
], DebugConfigurationManager.prototype, "editorManager", void 0);
__decorate([
    (0, inversify_1.inject)(debug_service_1.DebugService),
    __metadata("design:type", Object)
], DebugConfigurationManager.prototype, "debug", void 0);
__decorate([
    (0, inversify_1.inject)(quick_pick_service_1.QuickPickService),
    __metadata("design:type", Object)
], DebugConfigurationManager.prototype, "quickPickService", void 0);
__decorate([
    (0, inversify_1.inject)(context_key_service_1.ContextKeyService),
    __metadata("design:type", Object)
], DebugConfigurationManager.prototype, "contextKeyService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.LabelProvider),
    __metadata("design:type", browser_2.LabelProvider)
], DebugConfigurationManager.prototype, "labelProvider", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_text_model_service_1.MonacoTextModelService),
    __metadata("design:type", monaco_text_model_service_1.MonacoTextModelService)
], DebugConfigurationManager.prototype, "textModelService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.PreferenceService),
    __metadata("design:type", Object)
], DebugConfigurationManager.prototype, "preferences", void 0);
__decorate([
    (0, inversify_1.inject)(preference_configurations_1.PreferenceConfigurations),
    __metadata("design:type", preference_configurations_1.PreferenceConfigurations)
], DebugConfigurationManager.prototype, "preferenceConfigurations", void 0);
__decorate([
    (0, inversify_1.inject)(workspace_variable_contribution_1.WorkspaceVariableContribution),
    __metadata("design:type", workspace_variable_contribution_1.WorkspaceVariableContribution)
], DebugConfigurationManager.prototype, "workspaceVariables", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DebugConfigurationManager.prototype, "init", null);
__decorate([
    (0, inversify_1.inject)(browser_2.StorageService),
    __metadata("design:type", Object)
], DebugConfigurationManager.prototype, "storage", void 0);
DebugConfigurationManager = __decorate([
    (0, inversify_1.injectable)()
], DebugConfigurationManager);
exports.DebugConfigurationManager = DebugConfigurationManager;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/debug/lib/browser/debug-configuration-manager'] = this;


/***/ }),

/***/ "../../packages/debug/lib/browser/debug-configuration-model.js":
/*!*********************************************************************!*\
  !*** ../../packages/debug/lib/browser/debug-configuration-model.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
exports.DebugConfigurationModel = void 0;
const event_1 = __webpack_require__(/*! @theia/core/lib/common/event */ "../../packages/core/lib/common/event.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
const debug_common_1 = __webpack_require__(/*! ../common/debug-common */ "../../packages/debug/lib/common/debug-common.js");
const debug_compound_1 = __webpack_require__(/*! ../common/debug-compound */ "../../packages/debug/lib/common/debug-compound.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
class DebugConfigurationModel {
    constructor(workspaceFolderUri, preferences) {
        this.workspaceFolderUri = workspaceFolderUri;
        this.preferences = preferences;
        this.onDidChangeEmitter = new event_1.Emitter();
        this.onDidChange = this.onDidChangeEmitter.event;
        this.toDispose = new disposable_1.DisposableCollection(this.onDidChangeEmitter);
        this.reconcile();
        this.toDispose.push(this.preferences.onPreferenceChanged(e => {
            if (e.preferenceName === 'launch' && e.affects(workspaceFolderUri)) {
                this.reconcile();
            }
        }));
    }
    get uri() {
        return this.json.uri;
    }
    dispose() {
        this.toDispose.dispose();
    }
    get onDispose() {
        return this.toDispose.onDispose;
    }
    get configurations() {
        return this.json.configurations;
    }
    get compounds() {
        return this.json.compounds;
    }
    async reconcile() {
        this.json = this.parseConfigurations();
        this.onDidChangeEmitter.fire(undefined);
    }
    parseConfigurations() {
        const configurations = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { configUri, value } = this.preferences.resolve('launch', undefined, this.workspaceFolderUri);
        if ((0, common_1.isObject)(value) && Array.isArray(value.configurations)) {
            for (const configuration of value.configurations) {
                if (debug_common_1.DebugConfiguration.is(configuration)) {
                    configurations.push(configuration);
                }
            }
        }
        const compounds = [];
        if ((0, common_1.isObject)(value) && Array.isArray(value.compounds)) {
            for (const compound of value.compounds) {
                if (debug_compound_1.DebugCompound.is(compound)) {
                    compounds.push(compound);
                }
            }
        }
        return { uri: configUri, configurations, compounds };
    }
}
exports.DebugConfigurationModel = DebugConfigurationModel;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/debug/lib/browser/debug-configuration-model'] = this;


/***/ }),

/***/ "../../packages/debug/lib/browser/debug-contribution.js":
/*!**************************************************************!*\
  !*** ../../packages/debug/lib/browser/debug-contribution.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

// *****************************************************************************
// Copyright (C) 2021 SAP SE or an SAP affiliate company and others.
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
exports.DebugContribution = void 0;
exports.DebugContribution = Symbol('DebugContribution');

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/debug/lib/browser/debug-contribution'] = this;


/***/ }),

/***/ "../../packages/debug/lib/browser/debug-preferences.js":
/*!*************************************************************!*\
  !*** ../../packages/debug/lib/browser/debug-preferences.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2018 Ericsson and others.
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
exports.bindDebugPreferences = exports.createDebugPreferences = exports.DebugPreferences = exports.DebugPreferenceContribution = exports.DebugConfiguration = exports.debugPreferencesSchema = void 0;
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
const preferences_1 = __webpack_require__(/*! @theia/core/lib/browser/preferences */ "../../packages/core/lib/browser/preferences/index.js");
exports.debugPreferencesSchema = {
    type: 'object',
    properties: {
        'debug.trace': {
            type: 'boolean',
            default: false,
            description: nls_1.nls.localize('theia/debug/toggleTracing', 'Enable/disable tracing communications with debug adapters')
        },
        'debug.openDebug': {
            enum: ['neverOpen', 'openOnSessionStart', 'openOnFirstSessionStart', 'openOnDebugBreak'],
            default: 'openOnSessionStart',
            description: nls_1.nls.localizeByDefault('Controls when the debug view should open.')
        },
        'debug.internalConsoleOptions': {
            enum: ['neverOpen', 'openOnSessionStart', 'openOnFirstSessionStart'],
            default: 'openOnFirstSessionStart',
            description: nls_1.nls.localizeByDefault('Controls when the internal Debug Console should open.')
        },
        'debug.inlineValues': {
            type: 'boolean',
            default: false,
            description: nls_1.nls.localizeByDefault('Show variable values inline in editor while debugging.')
        },
        'debug.showInStatusBar': {
            enum: ['never', 'always', 'onFirstSessionStart'],
            enumDescriptions: [
                nls_1.nls.localizeByDefault('Never show debug in Status bar'),
                nls_1.nls.localizeByDefault('Always show debug in Status bar'),
                nls_1.nls.localizeByDefault('Show debug in Status bar only after debug was started for the first time')
            ],
            description: nls_1.nls.localizeByDefault('Controls when the debug Status bar should be visible.'),
            default: 'onFirstSessionStart'
        },
        'debug.confirmOnExit': {
            description: 'Controls whether to confirm when the window closes if there are active debug sessions.',
            type: 'string',
            enum: ['never', 'always'],
            enumDescriptions: [
                'Never confirm.',
                'Always confirm if there are debug sessions.',
            ],
            default: 'never'
        },
        'debug.disassemblyView.showSourceCode': {
            description: nls_1.nls.localizeByDefault('Show Source Code in Disassembly View.'),
            type: 'boolean',
            default: true,
        }
    }
};
class DebugConfiguration {
}
exports.DebugConfiguration = DebugConfiguration;
exports.DebugPreferenceContribution = Symbol('DebugPreferenceContribution');
exports.DebugPreferences = Symbol('DebugPreferences');
function createDebugPreferences(preferences, schema = exports.debugPreferencesSchema) {
    return (0, preferences_1.createPreferenceProxy)(preferences, schema);
}
exports.createDebugPreferences = createDebugPreferences;
function bindDebugPreferences(bind) {
    bind(exports.DebugPreferences).toDynamicValue(ctx => {
        const preferences = ctx.container.get(preferences_1.PreferenceService);
        const contribution = ctx.container.get(exports.DebugPreferenceContribution);
        return createDebugPreferences(preferences, contribution.schema);
    }).inSingletonScope();
    bind(exports.DebugPreferenceContribution).toConstantValue({ schema: exports.debugPreferencesSchema });
    bind(preferences_1.PreferenceContribution).toService(exports.DebugPreferenceContribution);
}
exports.bindDebugPreferences = bindDebugPreferences;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/debug/lib/browser/debug-preferences'] = this;


/***/ }),

/***/ "../../packages/debug/lib/browser/debug-session-connection.js":
/*!********************************************************************!*\
  !*** ../../packages/debug/lib/browser/debug-session-connection.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
exports.DebugSessionConnection = exports.DebugEventTypes = void 0;
const promise_util_1 = __webpack_require__(/*! @theia/core/lib/common/promise-util */ "../../packages/core/lib/common/promise-util.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
var DebugEventTypes;
(function (DebugEventTypes) {
    function isStandardEvent(event) {
        return standardDebugEvents.has(event);
    }
    DebugEventTypes.isStandardEvent = isStandardEvent;
    ;
})(DebugEventTypes = exports.DebugEventTypes || (exports.DebugEventTypes = {}));
const standardDebugEvents = new Set([
    'breakpoint',
    'capabilities',
    'continued',
    'exited',
    'initialized',
    'invalidated',
    'loadedSource',
    'module',
    'output',
    'process',
    'progressEnd',
    'progressStart',
    'progressUpdate',
    'stopped',
    'terminated',
    'thread'
]);
class DebugSessionConnection {
    constructor(sessionId, connectionFactory, traceOutputChannel) {
        this.sessionId = sessionId;
        this.traceOutputChannel = traceOutputChannel;
        this.sequence = 1;
        this.pendingRequests = new Map();
        this.requestHandlers = new Map();
        this.onDidCustomEventEmitter = new core_1.Emitter();
        this.onDidCustomEvent = this.onDidCustomEventEmitter.event;
        this.onDidCloseEmitter = new core_1.Emitter();
        this.onDidClose = this.onDidCloseEmitter.event;
        this.isClosed = false;
        this.toDispose = new core_1.DisposableCollection(this.onDidCustomEventEmitter, core_1.Disposable.create(() => this.pendingRequests.clear()), core_1.Disposable.create(() => this.emitters.clear()));
        this.allThreadsContinued = true;
        this.emitters = new Map();
        this.connectionPromise = this.createConnection(connectionFactory);
    }
    get disposed() {
        return this.toDispose.disposed;
    }
    checkDisposed() {
        if (this.disposed) {
            throw new Error('the debug session connection is disposed, id: ' + this.sessionId);
        }
    }
    dispose() {
        this.toDispose.dispose();
    }
    async createConnection(connectionFactory) {
        const connection = await connectionFactory(this.sessionId);
        connection.onClose(() => {
            this.isClosed = true;
            this.cancelPendingRequests();
            this.onDidCloseEmitter.fire();
        });
        connection.onMessage(data => this.handleMessage(data));
        return connection;
    }
    async sendRequest(command, args, timeout) {
        const result = await this.doSendRequest(command, args, timeout);
        if (command === 'next' || command === 'stepIn' ||
            command === 'stepOut' || command === 'stepBack' ||
            command === 'reverseContinue' || command === 'restartFrame') {
            this.fireContinuedEvent(args.threadId);
        }
        if (command === 'continue') {
            const response = result;
            const allThreadsContinued = response && response.body && response.body.allThreadsContinued;
            if (allThreadsContinued !== undefined) {
                this.allThreadsContinued = result.body.allThreadsContinued;
            }
            this.fireContinuedEvent(args.threadId, this.allThreadsContinued);
            return result;
        }
        return result;
    }
    sendCustomRequest(command, args) {
        return this.doSendRequest(command, args);
    }
    cancelPendingRequests() {
        this.pendingRequests.forEach((deferred, requestId) => {
            deferred.reject(new Error(`Request ${requestId} cancelled on connection close`));
        });
    }
    doSendRequest(command, args, timeout) {
        const result = new promise_util_1.Deferred();
        if (this.isClosed) {
            result.reject(new Error('Connection is closed'));
        }
        else {
            const request = {
                seq: this.sequence++,
                type: 'request',
                command: command,
                arguments: args
            };
            this.pendingRequests.set(request.seq, result);
            if (timeout) {
                const handle = setTimeout(() => {
                    const pendingRequest = this.pendingRequests.get(request.seq);
                    if (pendingRequest) {
                        // request has not been handled
                        this.pendingRequests.delete(request.seq);
                        const error = {
                            type: 'response',
                            seq: 0,
                            request_seq: request.seq,
                            success: false,
                            command,
                            message: `Request #${request.seq}: ${request.command} timed out`
                        };
                        pendingRequest.reject(error);
                    }
                }, timeout);
                result.promise.finally(() => clearTimeout(handle));
            }
            this.send(request);
        }
        return result.promise;
    }
    async send(message) {
        const connection = await this.connectionPromise;
        const messageStr = JSON.stringify(message);
        if (this.traceOutputChannel) {
            const now = new Date();
            const dateStr = `${now.toLocaleString(undefined, { hour12: false })}.${now.getMilliseconds()}`;
            this.traceOutputChannel.appendLine(`${this.sessionId.substring(0, 8)} ${dateStr} theia -> adapter: ${JSON.stringify(message, undefined, 4)}`);
        }
        connection.send(messageStr);
    }
    handleMessage(data) {
        const message = JSON.parse(data);
        if (this.traceOutputChannel) {
            const now = new Date();
            const dateStr = `${now.toLocaleString(undefined, { hour12: false })}.${now.getMilliseconds()}`;
            this.traceOutputChannel.appendLine(`${this.sessionId.substring(0, 8)} ${dateStr} theia <- adapter: ${JSON.stringify(message, undefined, 4)}`);
        }
        if (message.type === 'request') {
            this.handleRequest(message);
        }
        else if (message.type === 'response') {
            this.handleResponse(message);
        }
        else if (message.type === 'event') {
            this.handleEvent(message);
        }
    }
    handleResponse(response) {
        const pendingRequest = this.pendingRequests.get(response.request_seq);
        if (pendingRequest) {
            this.pendingRequests.delete(response.request_seq);
            if (!response.success) {
                pendingRequest.reject(response);
            }
            else {
                pendingRequest.resolve(response);
            }
        }
    }
    onRequest(command, handler) {
        this.requestHandlers.set(command, handler);
    }
    async handleRequest(request) {
        const response = {
            type: 'response',
            seq: 0,
            command: request.command,
            request_seq: request.seq,
            success: true,
        };
        const handler = this.requestHandlers.get(request.command);
        if (handler) {
            try {
                response.body = await handler(request);
            }
            catch (error) {
                response.success = false;
                response.message = error.message;
            }
        }
        else {
            console.error('Unhandled request', request);
        }
        await this.send(response);
    }
    handleEvent(event) {
        if (event.event === 'continued') {
            this.allThreadsContinued = event.body.allThreadsContinued === false ? false : true;
        }
        if (DebugEventTypes.isStandardEvent(event.event)) {
            this.doFire(event.event, event);
        }
        else {
            this.onDidCustomEventEmitter.fire(event);
        }
    }
    on(kind, listener) {
        return this.getEmitter(kind).event(listener);
    }
    onEvent(kind) {
        return this.getEmitter(kind).event;
    }
    fire(kind, e) {
        this.doFire(kind, e);
    }
    doFire(kind, e) {
        this.getEmitter(kind).fire(e);
    }
    getEmitter(kind) {
        const emitter = this.emitters.get(kind) || this.newEmitter();
        this.emitters.set(kind, emitter);
        return emitter;
    }
    newEmitter() {
        const emitter = new core_1.Emitter();
        this.checkDisposed();
        this.toDispose.push(emitter);
        return emitter;
    }
    fireContinuedEvent(threadId, allThreadsContinued = false) {
        this.fire('continued', {
            type: 'event',
            event: 'continued',
            body: {
                threadId,
                allThreadsContinued
            },
            seq: -1
        });
    }
}
exports.DebugSessionConnection = DebugSessionConnection;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/debug/lib/browser/debug-session-connection'] = this;


/***/ }),

/***/ "../../packages/debug/lib/browser/debug-session-contribution.js":
/*!**********************************************************************!*\
  !*** ../../packages/debug/lib/browser/debug-session-contribution.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DefaultDebugSessionFactory = exports.DebugSessionFactory = exports.DebugSessionContributionRegistryImpl = exports.DebugSessionContributionRegistry = exports.DebugSessionContribution = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const browser_2 = __webpack_require__(/*! @theia/editor/lib/browser */ "../../packages/editor/lib/browser/index.js");
const terminal_service_1 = __webpack_require__(/*! @theia/terminal/lib/browser/base/terminal-service */ "../../packages/terminal/lib/browser/base/terminal-service.js");
const ws_connection_provider_1 = __webpack_require__(/*! @theia/core/lib/browser/messaging/ws-connection-provider */ "../../packages/core/lib/browser/messaging/ws-connection-provider.js");
const debug_session_1 = __webpack_require__(/*! ./debug-session */ "../../packages/debug/lib/browser/debug-session.js");
const breakpoint_manager_1 = __webpack_require__(/*! ./breakpoint/breakpoint-manager */ "../../packages/debug/lib/browser/breakpoint/breakpoint-manager.js");
const output_channel_1 = __webpack_require__(/*! @theia/output/lib/browser/output-channel */ "../../packages/output/lib/browser/output-channel.js");
const debug_preferences_1 = __webpack_require__(/*! ./debug-preferences */ "../../packages/debug/lib/browser/debug-preferences.js");
const debug_session_connection_1 = __webpack_require__(/*! ./debug-session-connection */ "../../packages/debug/lib/browser/debug-session-connection.js");
const debug_service_1 = __webpack_require__(/*! ../common/debug-service */ "../../packages/debug/lib/common/debug-service.js");
const contribution_provider_1 = __webpack_require__(/*! @theia/core/lib/common/contribution-provider */ "../../packages/core/lib/common/contribution-provider.js");
const file_service_1 = __webpack_require__(/*! @theia/filesystem/lib/browser/file-service */ "../../packages/filesystem/lib/browser/file-service.js");
const debug_contribution_1 = __webpack_require__(/*! ./debug-contribution */ "../../packages/debug/lib/browser/debug-contribution.js");
const browser_3 = __webpack_require__(/*! @theia/workspace/lib/browser */ "../../packages/workspace/lib/browser/index.js");
/**
 * DebugSessionContribution symbol for DI.
 */
exports.DebugSessionContribution = Symbol('DebugSessionContribution');
/**
 * DebugSessionContributionRegistry symbol for DI.
 */
exports.DebugSessionContributionRegistry = Symbol('DebugSessionContributionRegistry');
let DebugSessionContributionRegistryImpl = class DebugSessionContributionRegistryImpl {
    constructor() {
        this.contribs = new Map();
    }
    init() {
        for (const contrib of this.contributions.getContributions()) {
            this.contribs.set(contrib.debugType, contrib);
        }
    }
    get(debugType) {
        return this.contribs.get(debugType);
    }
};
__decorate([
    (0, inversify_1.inject)(contribution_provider_1.ContributionProvider),
    (0, inversify_1.named)(exports.DebugSessionContribution),
    __metadata("design:type", Object)
], DebugSessionContributionRegistryImpl.prototype, "contributions", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DebugSessionContributionRegistryImpl.prototype, "init", null);
DebugSessionContributionRegistryImpl = __decorate([
    (0, inversify_1.injectable)()
], DebugSessionContributionRegistryImpl);
exports.DebugSessionContributionRegistryImpl = DebugSessionContributionRegistryImpl;
/**
 * DebugSessionFactory symbol for DI.
 */
exports.DebugSessionFactory = Symbol('DebugSessionFactory');
let DefaultDebugSessionFactory = class DefaultDebugSessionFactory {
    get(sessionId, options, parentSession) {
        const connection = new debug_session_connection_1.DebugSessionConnection(sessionId, () => new Promise(resolve => this.connectionProvider.openChannel(`${debug_service_1.DebugAdapterPath}/${sessionId}`, wsChannel => {
            resolve(new debug_service_1.ForwardingDebugChannel(wsChannel));
        }, { reconnecting: false })), this.getTraceOutputChannel());
        return new debug_session_1.DebugSession(sessionId, options, parentSession, connection, this.terminalService, this.editorManager, this.breakpoints, this.labelProvider, this.messages, this.fileService, this.debugContributionProvider, this.workspaceService);
    }
    getTraceOutputChannel() {
        if (this.debugPreferences['debug.trace']) {
            return this.outputChannelManager.getChannel('Debug adapters');
        }
    }
};
__decorate([
    (0, inversify_1.inject)(ws_connection_provider_1.WebSocketConnectionProvider),
    __metadata("design:type", ws_connection_provider_1.WebSocketConnectionProvider)
], DefaultDebugSessionFactory.prototype, "connectionProvider", void 0);
__decorate([
    (0, inversify_1.inject)(terminal_service_1.TerminalService),
    __metadata("design:type", Object)
], DefaultDebugSessionFactory.prototype, "terminalService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.EditorManager),
    __metadata("design:type", browser_2.EditorManager)
], DefaultDebugSessionFactory.prototype, "editorManager", void 0);
__decorate([
    (0, inversify_1.inject)(breakpoint_manager_1.BreakpointManager),
    __metadata("design:type", breakpoint_manager_1.BreakpointManager)
], DefaultDebugSessionFactory.prototype, "breakpoints", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.LabelProvider),
    __metadata("design:type", browser_1.LabelProvider)
], DefaultDebugSessionFactory.prototype, "labelProvider", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.MessageClient),
    __metadata("design:type", common_1.MessageClient)
], DefaultDebugSessionFactory.prototype, "messages", void 0);
__decorate([
    (0, inversify_1.inject)(output_channel_1.OutputChannelManager),
    __metadata("design:type", output_channel_1.OutputChannelManager)
], DefaultDebugSessionFactory.prototype, "outputChannelManager", void 0);
__decorate([
    (0, inversify_1.inject)(debug_preferences_1.DebugPreferences),
    __metadata("design:type", Object)
], DefaultDebugSessionFactory.prototype, "debugPreferences", void 0);
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], DefaultDebugSessionFactory.prototype, "fileService", void 0);
__decorate([
    (0, inversify_1.inject)(contribution_provider_1.ContributionProvider),
    (0, inversify_1.named)(debug_contribution_1.DebugContribution),
    __metadata("design:type", Object)
], DefaultDebugSessionFactory.prototype, "debugContributionProvider", void 0);
__decorate([
    (0, inversify_1.inject)(browser_3.WorkspaceService),
    __metadata("design:type", browser_3.WorkspaceService)
], DefaultDebugSessionFactory.prototype, "workspaceService", void 0);
DefaultDebugSessionFactory = __decorate([
    (0, inversify_1.injectable)()
], DefaultDebugSessionFactory);
exports.DefaultDebugSessionFactory = DefaultDebugSessionFactory;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/debug/lib/browser/debug-session-contribution'] = this;


/***/ }),

/***/ "../../packages/debug/lib/browser/debug-session-manager.js":
/*!*****************************************************************!*\
  !*** ../../packages/debug/lib/browser/debug-session-manager.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DebugSessionManager = void 0;
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const context_key_service_1 = __webpack_require__(/*! @theia/core/lib/browser/context-key-service */ "../../packages/core/lib/browser/context-key-service.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const browser_2 = __webpack_require__(/*! @theia/editor/lib/browser */ "../../packages/editor/lib/browser/index.js");
const quick_open_task_1 = __webpack_require__(/*! @theia/task/lib/browser/quick-open-task */ "../../packages/task/lib/browser/quick-open-task.js");
const task_service_1 = __webpack_require__(/*! @theia/task/lib/browser/task-service */ "../../packages/task/lib/browser/task-service.js");
const browser_3 = __webpack_require__(/*! @theia/variable-resolver/lib/browser */ "../../packages/variable-resolver/lib/browser/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const debug_service_1 = __webpack_require__(/*! ../common/debug-service */ "../../packages/debug/lib/common/debug-service.js");
const breakpoint_manager_1 = __webpack_require__(/*! ./breakpoint/breakpoint-manager */ "../../packages/debug/lib/browser/breakpoint/breakpoint-manager.js");
const debug_configuration_manager_1 = __webpack_require__(/*! ./debug-configuration-manager */ "../../packages/debug/lib/browser/debug-configuration-manager.js");
const debug_session_1 = __webpack_require__(/*! ./debug-session */ "../../packages/debug/lib/browser/debug-session.js");
const debug_session_contribution_1 = __webpack_require__(/*! ./debug-session-contribution */ "../../packages/debug/lib/browser/debug-session-contribution.js");
const debug_session_options_1 = __webpack_require__(/*! ./debug-session-options */ "../../packages/debug/lib/browser/debug-session-options.js");
const debug_source_breakpoint_1 = __webpack_require__(/*! ./model/debug-source-breakpoint */ "../../packages/debug/lib/browser/model/debug-source-breakpoint.js");
const debug_function_breakpoint_1 = __webpack_require__(/*! ./model/debug-function-breakpoint */ "../../packages/debug/lib/browser/model/debug-function-breakpoint.js");
const debug_instruction_breakpoint_1 = __webpack_require__(/*! ./model/debug-instruction-breakpoint */ "../../packages/debug/lib/browser/model/debug-instruction-breakpoint.js");
let DebugSessionManager = class DebugSessionManager {
    constructor() {
        this._sessions = new Map();
        this.onWillStartDebugSessionEmitter = new core_1.Emitter();
        this.onWillStartDebugSession = this.onWillStartDebugSessionEmitter.event;
        this.onWillResolveDebugConfigurationEmitter = new core_1.Emitter();
        this.onWillResolveDebugConfiguration = this.onWillResolveDebugConfigurationEmitter.event;
        this.onDidCreateDebugSessionEmitter = new core_1.Emitter();
        this.onDidCreateDebugSession = this.onDidCreateDebugSessionEmitter.event;
        this.onDidStartDebugSessionEmitter = new core_1.Emitter();
        this.onDidStartDebugSession = this.onDidStartDebugSessionEmitter.event;
        this.onDidStopDebugSessionEmitter = new core_1.Emitter();
        this.onDidStopDebugSession = this.onDidStopDebugSessionEmitter.event;
        this.onDidChangeActiveDebugSessionEmitter = new core_1.Emitter();
        this.onDidChangeActiveDebugSession = this.onDidChangeActiveDebugSessionEmitter.event;
        this.onDidDestroyDebugSessionEmitter = new core_1.Emitter();
        this.onDidDestroyDebugSession = this.onDidDestroyDebugSessionEmitter.event;
        this.onDidReceiveDebugSessionCustomEventEmitter = new core_1.Emitter();
        this.onDidReceiveDebugSessionCustomEvent = this.onDidReceiveDebugSessionCustomEventEmitter.event;
        this.onDidFocusStackFrameEmitter = new core_1.Emitter();
        this.onDidFocusStackFrame = this.onDidFocusStackFrameEmitter.event;
        this.onDidChangeBreakpointsEmitter = new core_1.Emitter();
        this.onDidChangeBreakpoints = this.onDidChangeBreakpointsEmitter.event;
        this.onDidChangeEmitter = new core_1.Emitter();
        this.onDidChange = this.onDidChangeEmitter.event;
        this.configurationIds = new Map();
        this.disposeOnCurrentSessionChanged = new core_1.DisposableCollection();
    }
    fireDidChangeBreakpoints(event) {
        this.onDidChangeBreakpointsEmitter.fire(event);
    }
    fireDidChange(current) {
        this.debugTypeKey.set(current === null || current === void 0 ? void 0 : current.configuration.type);
        this.inDebugModeKey.set(this.inDebugMode);
        this.debugStateKey.set((0, debug_session_1.debugStateContextValue)(this.state));
        this.onDidChangeEmitter.fire(current);
    }
    init() {
        this.debugTypeKey = this.contextKeyService.createKey('debugType', undefined);
        this.inDebugModeKey = this.contextKeyService.createKey('inDebugMode', this.inDebugMode);
        this.debugStateKey = this.contextKeyService.createKey('debugState', (0, debug_session_1.debugStateContextValue)(this.state));
        this.breakpoints.onDidChangeMarkers(uri => this.fireDidChangeBreakpoints({ uri }));
        this.labelProvider.onDidChange(event => {
            for (const uriString of this.breakpoints.getUris()) {
                const uri = new uri_1.default(uriString);
                if (event.affects(uri)) {
                    this.fireDidChangeBreakpoints({ uri });
                }
            }
        });
    }
    get inDebugMode() {
        return this.state > debug_session_1.DebugState.Inactive;
    }
    isCurrentEditorFrame(uri) {
        var _a, _b;
        return ((_b = (_a = this.currentFrame) === null || _a === void 0 ? void 0 : _a.source) === null || _b === void 0 ? void 0 : _b.uri.toString()) === (uri instanceof uri_1.default ? uri : new uri_1.default(uri)).toString();
    }
    async saveAll() {
        if (!this.shell.canSaveAll()) {
            return true; // Nothing to save.
        }
        try {
            await this.shell.saveAll();
            return true;
        }
        catch (error) {
            console.error('saveAll failed:', error);
            return false;
        }
    }
    async start(optionsOrName) {
        if (typeof optionsOrName === 'string') {
            const options = this.debugConfigurationManager.find(optionsOrName);
            return !!options && this.start(options);
        }
        return optionsOrName.configuration ? this.startConfiguration(optionsOrName) : this.startCompound(optionsOrName);
    }
    async startConfiguration(options) {
        return this.progressService.withProgress('Start...', 'debug', async () => {
            try {
                // If a parent session is available saving should be handled by the parent
                if (!options.configuration.parentSessionId && !options.configuration.suppressSaveBeforeStart && !await this.saveAll()) {
                    return undefined;
                }
                await this.fireWillStartDebugSession();
                const resolved = await this.resolveConfiguration(options);
                if (!resolved || !resolved.configuration) {
                    // As per vscode API: https://code.visualstudio.com/api/references/vscode-api#DebugConfigurationProvider
                    // "Returning the value 'undefined' prevents the debug session from starting.
                    // Returning the value 'null' prevents the debug session from starting and opens the
                    // underlying debug configuration instead."
                    // eslint-disable-next-line no-null/no-null
                    if (resolved === null) {
                        this.debugConfigurationManager.openConfiguration();
                    }
                    return undefined;
                }
                // preLaunchTask isn't run in case of auto restart as well as postDebugTask
                if (!options.configuration.__restart) {
                    const taskRun = await this.runTask(options.workspaceFolderUri, resolved.configuration.preLaunchTask, true);
                    if (!taskRun) {
                        return undefined;
                    }
                }
                const sessionId = await this.debug.createDebugSession(resolved.configuration, options.workspaceFolderUri);
                return this.doStart(sessionId, resolved);
            }
            catch (e) {
                if (debug_service_1.DebugError.NotFound.is(e)) {
                    this.messageService.error(`The debug session type "${e.data.type}" is not supported.`);
                    return undefined;
                }
                this.messageService.error('There was an error starting the debug session, check the logs for more details.');
                console.error('Error starting the debug session', e);
                throw e;
            }
        });
    }
    async startCompound(options) {
        let configurations = [];
        const compoundRoot = options.compound.stopAll ? new debug_session_options_1.DebugCompoundRoot() : undefined;
        try {
            configurations = this.getCompoundConfigurations(options, compoundRoot);
        }
        catch (error) {
            this.messageService.error(error.message);
            return;
        }
        if (options.compound.preLaunchTask) {
            const taskRun = await this.runTask(options.workspaceFolderUri, options.compound.preLaunchTask, true);
            if (!taskRun) {
                return undefined;
            }
        }
        // Compound launch is a success only if each configuration launched successfully
        const values = await Promise.all(configurations.map(async (configuration) => {
            const newSession = await this.startConfiguration(configuration);
            if (newSession) {
                compoundRoot === null || compoundRoot === void 0 ? void 0 : compoundRoot.onDidSessionStop(() => newSession.stop(false, () => this.debug.terminateDebugSession(newSession.id)));
            }
            return newSession;
        }));
        const result = values.every(success => !!success);
        return result;
    }
    getCompoundConfigurations(options, compoundRoot) {
        const compound = options.compound;
        if (!compound.configurations) {
            throw new Error(core_1.nls.localizeByDefault('Compound must have "configurations" attribute set in order to start multiple configurations.'));
        }
        const configurations = [];
        for (const configData of compound.configurations) {
            const name = typeof configData === 'string' ? configData : configData.name;
            if (name === compound.name) {
                throw new Error(core_1.nls.localize('theia/debug/compound-cycle', "Launch configuration '{0}' contains a cycle with itself", name));
            }
            const workspaceFolderUri = typeof configData === 'string' ? options.workspaceFolderUri : configData.folder;
            const matchingOptions = [...this.debugConfigurationManager.all]
                .filter(option => option.name === name && !!option.configuration && option.workspaceFolderUri === workspaceFolderUri);
            if (matchingOptions.length === 1) {
                const match = matchingOptions[0];
                if (debug_session_options_1.DebugSessionOptions.isConfiguration(match)) {
                    configurations.push({ ...match, compoundRoot, configuration: { ...match.configuration, noDebug: options.noDebug } });
                }
                else {
                    throw new Error(core_1.nls.localizeByDefault("Could not find launch configuration '{0}' in the workspace.", name));
                }
            }
            else {
                throw new Error(matchingOptions.length === 0
                    ? workspaceFolderUri
                        ? core_1.nls.localizeByDefault("Can not find folder with name '{0}' for configuration '{1}' in compound '{2}'.", workspaceFolderUri, name, compound.name)
                        : core_1.nls.localizeByDefault("Could not find launch configuration '{0}' in the workspace.", name)
                    : core_1.nls.localizeByDefault("There are multiple launch configurations '{0}' in the workspace. Use folder name to qualify the configuration.", name));
            }
        }
        return configurations;
    }
    async fireWillStartDebugSession() {
        await core_1.WaitUntilEvent.fire(this.onWillStartDebugSessionEmitter, {});
    }
    async resolveConfiguration(options) {
        if (debug_session_options_1.InternalDebugSessionOptions.is(options)) {
            return options;
        }
        const { workspaceFolderUri } = options;
        let configuration = await this.resolveDebugConfiguration(options.configuration, workspaceFolderUri);
        if (configuration) {
            // Resolve command variables provided by the debugger
            const commandIdVariables = await this.debug.provideDebuggerVariables(configuration.type);
            configuration = await this.variableResolver.resolve(configuration, {
                context: options.workspaceFolderUri ? new uri_1.default(options.workspaceFolderUri) : undefined,
                configurationSection: 'launch',
                commandIdVariables,
                configuration
            });
            if (configuration) {
                configuration = await this.resolveDebugConfigurationWithSubstitutedVariables(configuration, workspaceFolderUri);
            }
        }
        if (!configuration) {
            return configuration;
        }
        const key = configuration.name + workspaceFolderUri;
        const id = this.configurationIds.has(key) ? this.configurationIds.get(key) + 1 : 0;
        this.configurationIds.set(key, id);
        return {
            id,
            ...options,
            name: configuration.name,
            configuration
        };
    }
    async resolveDebugConfiguration(configuration, workspaceFolderUri) {
        await this.fireWillResolveDebugConfiguration(configuration.type);
        return this.debug.resolveDebugConfiguration(configuration, workspaceFolderUri);
    }
    async fireWillResolveDebugConfiguration(debugType) {
        await core_1.WaitUntilEvent.fire(this.onWillResolveDebugConfigurationEmitter, { debugType });
    }
    async resolveDebugConfigurationWithSubstitutedVariables(configuration, workspaceFolderUri) {
        return this.debug.resolveDebugConfigurationWithSubstitutedVariables(configuration, workspaceFolderUri);
    }
    async doStart(sessionId, options) {
        const parentSession = options.configuration.parentSessionId ? this._sessions.get(options.configuration.parentSessionId) : undefined;
        const contrib = this.sessionContributionRegistry.get(options.configuration.type);
        const sessionFactory = contrib ? contrib.debugSessionFactory() : this.debugSessionFactory;
        const session = sessionFactory.get(sessionId, options, parentSession);
        this._sessions.set(sessionId, session);
        this.debugTypeKey.set(session.configuration.type);
        this.onDidCreateDebugSessionEmitter.fire(session);
        let state = debug_session_1.DebugState.Inactive;
        session.onDidChange(() => {
            if (state !== session.state) {
                state = session.state;
                if (state === debug_session_1.DebugState.Stopped) {
                    this.onDidStopDebugSessionEmitter.fire(session);
                }
            }
            this.updateCurrentSession(session);
        });
        session.onDidChangeBreakpoints(uri => this.fireDidChangeBreakpoints({ session, uri }));
        session.on('terminated', async (event) => {
            const restart = event.body && event.body.restart;
            if (restart) {
                // postDebugTask isn't run in case of auto restart as well as preLaunchTask
                this.doRestart(session, !!restart);
            }
            else {
                await session.disconnect(false, () => this.debug.terminateDebugSession(session.id));
                await this.runTask(session.options.workspaceFolderUri, session.configuration.postDebugTask);
            }
        });
        session.on('exited', async (event) => {
            await session.disconnect(false, () => this.debug.terminateDebugSession(session.id));
        });
        session.onDispose(() => this.cleanup(session));
        session.start().then(() => this.onDidStartDebugSessionEmitter.fire(session)).catch(e => {
            session.stop(false, () => {
                this.debug.terminateDebugSession(session.id);
            });
        });
        session.onDidCustomEvent(({ event, body }) => this.onDidReceiveDebugSessionCustomEventEmitter.fire({ event, body, session }));
        return session;
    }
    cleanup(session) {
        if (this.remove(session.id)) {
            this.onDidDestroyDebugSessionEmitter.fire(session);
        }
    }
    async doRestart(session, isRestart) {
        if (session.canRestart()) {
            await session.restart();
            return session;
        }
        const { options, configuration } = session;
        session.stop(isRestart, () => this.debug.terminateDebugSession(session.id));
        configuration.__restart = isRestart;
        return this.start(options);
    }
    async terminateSession(session) {
        if (!session) {
            this.updateCurrentSession(this._currentSession);
            session = this._currentSession;
        }
        if (session) {
            if (session.options.compoundRoot) {
                session.options.compoundRoot.stopSession();
            }
            else if (session.parentSession && session.configuration.lifecycleManagedByParent) {
                this.terminateSession(session.parentSession);
            }
            else {
                session.stop(false, () => this.debug.terminateDebugSession(session.id));
            }
        }
    }
    async restartSession(session) {
        if (!session) {
            this.updateCurrentSession(this._currentSession);
            session = this._currentSession;
        }
        if (session) {
            if (session.parentSession && session.configuration.lifecycleManagedByParent) {
                return this.restartSession(session.parentSession);
            }
            else {
                return this.doRestart(session, true);
            }
        }
    }
    remove(sessionId) {
        const existed = this._sessions.delete(sessionId);
        const { currentSession } = this;
        if (currentSession && currentSession.id === sessionId) {
            this.updateCurrentSession(undefined);
        }
        return existed;
    }
    getSession(sessionId) {
        return this._sessions.get(sessionId);
    }
    get sessions() {
        return Array.from(this._sessions.values()).filter(session => session.state > debug_session_1.DebugState.Inactive);
    }
    get currentSession() {
        return this._currentSession;
    }
    set currentSession(current) {
        if (this._currentSession === current) {
            return;
        }
        this.disposeOnCurrentSessionChanged.dispose();
        const previous = this.currentSession;
        this._currentSession = current;
        this.onDidChangeActiveDebugSessionEmitter.fire({ previous, current });
        if (current) {
            this.disposeOnCurrentSessionChanged.push(current.onDidChange(() => {
                if (this.currentFrame === this.topFrame) {
                    this.open();
                }
                this.fireDidChange(current);
            }));
            this.disposeOnCurrentSessionChanged.push(current.onDidFocusStackFrame(frame => this.onDidFocusStackFrameEmitter.fire({ session: current, frame })));
        }
        this.updateBreakpoints(previous, current);
        this.open();
        this.fireDidChange(current);
    }
    open() {
        const { currentFrame } = this;
        if (currentFrame) {
            currentFrame.open();
        }
    }
    updateBreakpoints(previous, current) {
        const affectedUri = new Set();
        for (const session of [previous, current]) {
            if (session) {
                for (const uriString of session.breakpointUris) {
                    if (!affectedUri.has(uriString)) {
                        affectedUri.add(uriString);
                        this.fireDidChangeBreakpoints({
                            session: current,
                            uri: new uri_1.default(uriString)
                        });
                    }
                }
            }
        }
    }
    updateCurrentSession(session) {
        this.currentSession = session || this.sessions[0];
    }
    get currentThread() {
        const session = this.currentSession;
        return session && session.currentThread;
    }
    get state() {
        const session = this.currentSession;
        return session ? session.state : debug_session_1.DebugState.Inactive;
    }
    get currentFrame() {
        const { currentThread } = this;
        return currentThread && currentThread.currentFrame;
    }
    get topFrame() {
        const { currentThread } = this;
        return currentThread && currentThread.topFrame;
    }
    getFunctionBreakpoints(session = this.currentSession) {
        if (session && session.state > debug_session_1.DebugState.Initializing) {
            return session.getFunctionBreakpoints();
        }
        const { labelProvider, breakpoints, editorManager } = this;
        return this.breakpoints.getFunctionBreakpoints().map(origin => new debug_function_breakpoint_1.DebugFunctionBreakpoint(origin, { labelProvider, breakpoints, editorManager }));
    }
    getInstructionBreakpoints(session = this.currentSession) {
        if (session && session.state > debug_session_1.DebugState.Initializing) {
            return session.getInstructionBreakpoints();
        }
        const { labelProvider, breakpoints, editorManager } = this;
        return this.breakpoints.getInstructionBreakpoints().map(origin => new debug_instruction_breakpoint_1.DebugInstructionBreakpoint(origin, { labelProvider, breakpoints, editorManager }));
    }
    getBreakpoints(arg, arg2) {
        const uri = arg instanceof uri_1.default ? arg : undefined;
        const session = arg instanceof debug_session_1.DebugSession ? arg : arg2 instanceof debug_session_1.DebugSession ? arg2 : this.currentSession;
        if (session && session.state > debug_session_1.DebugState.Initializing) {
            return session.getSourceBreakpoints(uri);
        }
        const { labelProvider, breakpoints, editorManager } = this;
        return this.breakpoints.findMarkers({ uri }).map(({ data }) => new debug_source_breakpoint_1.DebugSourceBreakpoint(data, { labelProvider, breakpoints, editorManager }));
    }
    getLineBreakpoints(uri, line) {
        const session = this.currentSession;
        if (session && session.state > debug_session_1.DebugState.Initializing) {
            return session.getSourceBreakpoints(uri).filter(breakpoint => breakpoint.line === line);
        }
        const { labelProvider, breakpoints, editorManager } = this;
        return this.breakpoints.getLineBreakpoints(uri, line).map(origin => new debug_source_breakpoint_1.DebugSourceBreakpoint(origin, { labelProvider, breakpoints, editorManager }));
    }
    getInlineBreakpoint(uri, line, column) {
        const session = this.currentSession;
        if (session && session.state > debug_session_1.DebugState.Initializing) {
            return session.getSourceBreakpoints(uri).filter(breakpoint => breakpoint.line === line && breakpoint.column === column)[0];
        }
        const origin = this.breakpoints.getInlineBreakpoint(uri, line, column);
        const { labelProvider, breakpoints, editorManager } = this;
        return origin && new debug_source_breakpoint_1.DebugSourceBreakpoint(origin, { labelProvider, breakpoints, editorManager });
    }
    /**
     * Runs the given tasks.
     * @param taskName the task name to run, see [TaskNameResolver](#TaskNameResolver)
     * @return true if it allowed to continue debugging otherwise it returns false
     */
    async runTask(workspaceFolderUri, taskName, checkErrors) {
        if (!taskName) {
            return true;
        }
        const taskInfo = await this.taskService.runWorkspaceTask(this.taskService.startUserAction(), workspaceFolderUri, taskName);
        if (!checkErrors) {
            return true;
        }
        if (!taskInfo) {
            return this.doPostTaskAction(`Could not run the task '${taskName}'.`);
        }
        const getExitCodePromise = this.taskService.getExitCode(taskInfo.taskId).then(result => ({ taskEndedType: task_service_1.TaskEndedTypes.TaskExited, value: result }));
        const isBackgroundTaskEndedPromise = this.taskService.isBackgroundTaskEnded(taskInfo.taskId).then(result => ({ taskEndedType: task_service_1.TaskEndedTypes.BackgroundTaskEnded, value: result }));
        // After start running the task, we wait for the task process to exit and if it is a background task, we also wait for a feedback
        // that a background task is active, as soon as one of the promises fulfills, we can continue and analyze the results.
        const taskEndedInfo = await Promise.race([getExitCodePromise, isBackgroundTaskEndedPromise]);
        if (taskEndedInfo.taskEndedType === task_service_1.TaskEndedTypes.BackgroundTaskEnded && taskEndedInfo.value) {
            return true;
        }
        if (taskEndedInfo.taskEndedType === task_service_1.TaskEndedTypes.TaskExited && taskEndedInfo.value === 0) {
            return true;
        }
        else if (taskEndedInfo.taskEndedType === task_service_1.TaskEndedTypes.TaskExited && taskEndedInfo.value !== undefined) {
            return this.doPostTaskAction(`Task '${taskName}' terminated with exit code ${taskEndedInfo.value}.`);
        }
        else {
            const signal = await this.taskService.getTerminateSignal(taskInfo.taskId);
            if (signal !== undefined) {
                return this.doPostTaskAction(`Task '${taskName}' terminated by signal ${signal}.`);
            }
            else {
                return this.doPostTaskAction(`Task '${taskName}' terminated for unknown reason.`);
            }
        }
    }
    async doPostTaskAction(errorMessage) {
        const actions = ['Open launch.json', 'Cancel', 'Configure Task', 'Debug Anyway'];
        const result = await this.messageService.error(errorMessage, ...actions);
        switch (result) {
            case actions[0]: // open launch.json
                this.debugConfigurationManager.openConfiguration();
                return false;
            case actions[1]: // cancel
                return false;
            case actions[2]: // configure tasks
                this.quickOpenTask.configure();
                return false;
            default: // continue debugging
                return true;
        }
    }
};
__decorate([
    (0, inversify_1.inject)(debug_session_contribution_1.DebugSessionFactory),
    __metadata("design:type", Object)
], DebugSessionManager.prototype, "debugSessionFactory", void 0);
__decorate([
    (0, inversify_1.inject)(debug_service_1.DebugService),
    __metadata("design:type", Object)
], DebugSessionManager.prototype, "debug", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.LabelProvider),
    __metadata("design:type", browser_1.LabelProvider)
], DebugSessionManager.prototype, "labelProvider", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.EditorManager),
    __metadata("design:type", browser_2.EditorManager)
], DebugSessionManager.prototype, "editorManager", void 0);
__decorate([
    (0, inversify_1.inject)(breakpoint_manager_1.BreakpointManager),
    __metadata("design:type", breakpoint_manager_1.BreakpointManager)
], DebugSessionManager.prototype, "breakpoints", void 0);
__decorate([
    (0, inversify_1.inject)(browser_3.VariableResolverService),
    __metadata("design:type", browser_3.VariableResolverService)
], DebugSessionManager.prototype, "variableResolver", void 0);
__decorate([
    (0, inversify_1.inject)(debug_session_contribution_1.DebugSessionContributionRegistry),
    __metadata("design:type", Object)
], DebugSessionManager.prototype, "sessionContributionRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.MessageService),
    __metadata("design:type", core_1.MessageService)
], DebugSessionManager.prototype, "messageService", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.ProgressService),
    __metadata("design:type", core_1.ProgressService)
], DebugSessionManager.prototype, "progressService", void 0);
__decorate([
    (0, inversify_1.inject)(context_key_service_1.ContextKeyService),
    __metadata("design:type", Object)
], DebugSessionManager.prototype, "contextKeyService", void 0);
__decorate([
    (0, inversify_1.inject)(task_service_1.TaskService),
    __metadata("design:type", task_service_1.TaskService)
], DebugSessionManager.prototype, "taskService", void 0);
__decorate([
    (0, inversify_1.inject)(debug_configuration_manager_1.DebugConfigurationManager),
    __metadata("design:type", debug_configuration_manager_1.DebugConfigurationManager)
], DebugSessionManager.prototype, "debugConfigurationManager", void 0);
__decorate([
    (0, inversify_1.inject)(quick_open_task_1.QuickOpenTask),
    __metadata("design:type", quick_open_task_1.QuickOpenTask)
], DebugSessionManager.prototype, "quickOpenTask", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.ApplicationShell),
    __metadata("design:type", browser_1.ApplicationShell)
], DebugSessionManager.prototype, "shell", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DebugSessionManager.prototype, "init", null);
DebugSessionManager = __decorate([
    (0, inversify_1.injectable)()
], DebugSessionManager);
exports.DebugSessionManager = DebugSessionManager;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/debug/lib/browser/debug-session-manager'] = this;


/***/ }),

/***/ "../../packages/debug/lib/browser/debug-session-options.js":
/*!*****************************************************************!*\
  !*** ../../packages/debug/lib/browser/debug-session-options.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InternalDebugSessionOptions = exports.DebugSessionOptions = exports.DebugCompoundRoot = void 0;
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
class DebugCompoundRoot {
    constructor() {
        this.stopped = false;
        this.stopEmitter = new core_1.Emitter();
        this.onDidSessionStop = this.stopEmitter.event;
    }
    stopSession() {
        if (!this.stopped) { // avoid sending extraneous terminate events
            this.stopped = true;
            this.stopEmitter.fire();
        }
    }
}
exports.DebugCompoundRoot = DebugCompoundRoot;
var DebugSessionOptions;
(function (DebugSessionOptions) {
    function isConfiguration(options) {
        return !!options && 'configuration' in options && !!options.configuration;
    }
    DebugSessionOptions.isConfiguration = isConfiguration;
    function isDynamic(options) {
        return isConfiguration(options) && 'providerType' in options && !!options.providerType;
    }
    DebugSessionOptions.isDynamic = isDynamic;
    function isCompound(options) {
        return !!options && 'compound' in options && !!options.compound;
    }
    DebugSessionOptions.isCompound = isCompound;
})(DebugSessionOptions = exports.DebugSessionOptions || (exports.DebugSessionOptions = {}));
var InternalDebugSessionOptions;
(function (InternalDebugSessionOptions) {
    const SEPARATOR = '__CONF__';
    const SEPARATOR_CONFIGS = '__COMP__';
    function is(options) {
        return 'id' in options;
    }
    InternalDebugSessionOptions.is = is;
    /** @deprecated Please use `JSON.stringify` to serialize the options. */
    function toValue(options) {
        var _a;
        if (DebugSessionOptions.isCompound(options)) {
            return options.compound.name + SEPARATOR +
                options.workspaceFolderUri + SEPARATOR +
                ((_a = options.compound) === null || _a === void 0 ? void 0 : _a.configurations.join(SEPARATOR_CONFIGS));
        }
        return options.configuration.name + SEPARATOR +
            options.configuration.type + SEPARATOR +
            options.configuration.request + SEPARATOR +
            options.workspaceFolderUri + SEPARATOR +
            options.providerType;
    }
    InternalDebugSessionOptions.toValue = toValue;
    /** @deprecated Please use `JSON.parse` to restore previously serialized debug session options. */
    // eslint-disable-next-line deprecation/deprecation
    function parseValue(value) {
        const split = value.split(SEPARATOR);
        if (split.length === 5) {
            return { name: split[0], type: split[1], request: split[2], workspaceFolderUri: split[3], providerType: split[4] };
        }
        if (split.length === 3) {
            return { name: split[0], workspaceFolderUri: split[1], configurations: split[2].split(SEPARATOR_CONFIGS) };
        }
        throw new Error('Unexpected argument, the argument is expected to have been generated by the \'toValue\' function');
    }
    InternalDebugSessionOptions.parseValue = parseValue;
})(InternalDebugSessionOptions = exports.InternalDebugSessionOptions || (exports.InternalDebugSessionOptions = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/debug/lib/browser/debug-session-options'] = this;


/***/ }),

/***/ "../../packages/debug/lib/browser/debug-session.js":
/*!*********************************************************!*\
  !*** ../../packages/debug/lib/browser/debug-session.js ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
exports.DebugSession = exports.debugStateContextValue = exports.DebugState = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const debug_thread_1 = __webpack_require__(/*! ./model/debug-thread */ "../../packages/debug/lib/browser/model/debug-thread.js");
const debug_source_1 = __webpack_require__(/*! ./model/debug-source */ "../../packages/debug/lib/browser/model/debug-source.js");
const debug_source_breakpoint_1 = __webpack_require__(/*! ./model/debug-source-breakpoint */ "../../packages/debug/lib/browser/model/debug-source-breakpoint.js");
const debounce = __webpack_require__(/*! p-debounce */ "../../node_modules/p-debounce/index.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const breakpoint_manager_1 = __webpack_require__(/*! ./breakpoint/breakpoint-manager */ "../../packages/debug/lib/browser/breakpoint/breakpoint-manager.js");
const debug_session_options_1 = __webpack_require__(/*! ./debug-session-options */ "../../packages/debug/lib/browser/debug-session-options.js");
const debug_common_1 = __webpack_require__(/*! ../common/debug-common */ "../../packages/debug/lib/common/debug-common.js");
const breakpoint_marker_1 = __webpack_require__(/*! ./breakpoint/breakpoint-marker */ "../../packages/debug/lib/browser/breakpoint/breakpoint-marker.js");
const debug_function_breakpoint_1 = __webpack_require__(/*! ./model/debug-function-breakpoint */ "../../packages/debug/lib/browser/model/debug-function-breakpoint.js");
const promise_util_1 = __webpack_require__(/*! @theia/core/lib/common/promise-util */ "../../packages/core/lib/common/promise-util.js");
const debug_instruction_breakpoint_1 = __webpack_require__(/*! ./model/debug-instruction-breakpoint */ "../../packages/debug/lib/browser/model/debug-instruction-breakpoint.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
var DebugState;
(function (DebugState) {
    DebugState[DebugState["Inactive"] = 0] = "Inactive";
    DebugState[DebugState["Initializing"] = 1] = "Initializing";
    DebugState[DebugState["Running"] = 2] = "Running";
    DebugState[DebugState["Stopped"] = 3] = "Stopped";
})(DebugState = exports.DebugState || (exports.DebugState = {}));
/**
 * The mapped string values must not change as they are used for the `debugState` when context closure.
 * For more details see the `Debugger contexts` section of the [official doc](https://code.visualstudio.com/api/references/when-clause-contexts#available-contexts).
 */
function debugStateContextValue(state) {
    switch (state) {
        case DebugState.Initializing: return 'initializing';
        case DebugState.Stopped: return 'stopped';
        case DebugState.Running: return 'running';
        default: return 'inactive';
    }
}
exports.debugStateContextValue = debugStateContextValue;
// FIXME: make injectable to allow easily inject services
class DebugSession {
    constructor(id, options, parentSession, connection, terminalServer, editorManager, breakpoints, labelProvider, messages, fileService, debugContributionProvider, workspaceService, 
    /**
     * Number of millis after a `stop` request times out. It's 5 seconds by default.
     */
    stopTimeout = 5000) {
        this.id = id;
        this.options = options;
        this.parentSession = parentSession;
        this.connection = connection;
        this.terminalServer = terminalServer;
        this.editorManager = editorManager;
        this.breakpoints = breakpoints;
        this.labelProvider = labelProvider;
        this.messages = messages;
        this.fileService = fileService;
        this.debugContributionProvider = debugContributionProvider;
        this.workspaceService = workspaceService;
        this.stopTimeout = stopTimeout;
        this.deferredOnDidConfigureCapabilities = new promise_util_1.Deferred();
        this.onDidChangeEmitter = new common_1.Emitter();
        this.onDidChange = this.onDidChangeEmitter.event;
        this.onDidFocusStackFrameEmitter = new common_1.Emitter();
        this.onDidChangeBreakpointsEmitter = new common_1.Emitter();
        this.onDidChangeBreakpoints = this.onDidChangeBreakpointsEmitter.event;
        this.childSessions = new Map();
        this.toDispose = new common_1.DisposableCollection();
        this.isStopping = false;
        this._capabilities = {};
        this.sources = new Map();
        this._threads = new Map();
        this.toDisposeOnCurrentThread = new common_1.DisposableCollection();
        /**
         * The `send('initialize')` request could resolve later than `on('initialized')` emits the event.
         * Hence, the `configure` would use the empty object `capabilities`.
         * Using the empty `capabilities` could result in missing exception breakpoint filters, as
         * always `capabilities.exceptionBreakpointFilters` is falsy. This deferred promise works
         * around this timing issue. https://github.com/eclipse-theia/theia/issues/11886
         */
        this.didReceiveCapabilities = new promise_util_1.Deferred();
        this.initialized = false;
        this.scheduleUpdateThreads = debounce(() => this.updateThreads(undefined), 100);
        this.pendingThreads = Promise.resolve();
        this._breakpoints = new Map();
        this.updatingBreakpoints = false;
        this.connection.onRequest('runInTerminal', (request) => this.runInTerminal(request));
        this.connection.onDidClose(() => {
            this.toDispose.dispose();
        });
        this.registerDebugContributions(options.configuration.type, this.connection);
        if (parentSession) {
            parentSession.childSessions.set(id, this);
            this.toDispose.push(common_1.Disposable.create(() => {
                var _a, _b;
                (_b = (_a = this.parentSession) === null || _a === void 0 ? void 0 : _a.childSessions) === null || _b === void 0 ? void 0 : _b.delete(id);
            }));
        }
        this.connection.onDidClose(() => this.toDispose.dispose());
        this.toDispose.pushAll([
            this.onDidChangeEmitter,
            this.onDidChangeBreakpointsEmitter,
            common_1.Disposable.create(() => {
                this.clearBreakpoints();
                this.doUpdateThreads([]);
            }),
            this.connection,
            this.connection.on('initialized', () => this.configure()),
            this.connection.on('breakpoint', ({ body }) => this.updateBreakpoint(body)),
            this.connection.on('continued', e => this.handleContinued(e)),
            this.connection.on('stopped', e => this.handleStopped(e)),
            this.connection.on('thread', e => this.handleThread(e)),
            this.connection.on('capabilities', event => this.updateCapabilities(event.body.capabilities)),
            this.breakpoints.onDidChangeMarkers(uri => this.updateBreakpoints({ uri, sourceModified: true }))
        ]);
    }
    fireDidChange() {
        this.onDidChangeEmitter.fire(undefined);
    }
    get onDidFocusStackFrame() {
        return this.onDidFocusStackFrameEmitter.event;
    }
    fireDidChangeBreakpoints(uri) {
        this.onDidChangeBreakpointsEmitter.fire(uri);
    }
    get onDispose() {
        return this.toDispose.onDispose;
    }
    get configuration() {
        return this.options.configuration;
    }
    get capabilities() {
        return this._capabilities;
    }
    getSource(raw) {
        const uri = debug_source_1.DebugSource.toUri(raw).toString();
        const source = this.sources.get(uri) || new debug_source_1.DebugSource(this, this.editorManager, this.labelProvider);
        source.update({ raw });
        this.sources.set(uri, source);
        return source;
    }
    getSourceForUri(uri) {
        return this.sources.get(uri.toString());
    }
    async toSource(uri) {
        const source = this.getSourceForUri(uri);
        if (source) {
            return source;
        }
        return this.getSource(await this.toDebugSource(uri));
    }
    async toDebugSource(uri) {
        if (uri.scheme === debug_source_1.DebugSource.SCHEME) {
            return {
                name: uri.path.toString(),
                sourceReference: Number(uri.query)
            };
        }
        const name = uri.displayName;
        let path;
        const underlying = await this.fileService.toUnderlyingResource(uri);
        if (underlying.scheme === 'file') {
            path = await this.fileService.fsPath(underlying);
        }
        else {
            path = uri.toString();
        }
        return { name, path };
    }
    get threads() {
        return this._threads.values();
    }
    get threadCount() {
        return this._threads.size;
    }
    *getThreads(filter) {
        for (const thread of this.threads) {
            if (filter(thread)) {
                yield thread;
            }
        }
    }
    get runningThreads() {
        return this.getThreads(thread => !thread.stopped);
    }
    get stoppedThreads() {
        return this.getThreads(thread => thread.stopped);
    }
    async pauseAll() {
        const promises = [];
        for (const thread of this.runningThreads) {
            promises.push((async () => {
                try {
                    await thread.pause();
                }
                catch (e) {
                    console.error('pauseAll failed:', e);
                }
            })());
        }
        await Promise.all(promises);
    }
    async continueAll() {
        const promises = [];
        for (const thread of this.stoppedThreads) {
            promises.push((async () => {
                try {
                    await thread.continue();
                }
                catch (e) {
                    console.error('continueAll failed:', e);
                }
            })());
        }
        await Promise.all(promises);
    }
    get currentFrame() {
        return this.currentThread && this.currentThread.currentFrame;
    }
    get currentThread() {
        return this._currentThread;
    }
    set currentThread(thread) {
        this.toDisposeOnCurrentThread.dispose();
        this._currentThread = thread;
        this.fireDidChange();
        if (thread) {
            this.toDisposeOnCurrentThread.push(thread.onDidChanged(() => this.fireDidChange()));
            this.toDisposeOnCurrentThread.push(thread.onDidFocusStackFrame(frame => this.onDidFocusStackFrameEmitter.fire(frame)));
            // If this thread is missing stack frame information, then load that.
            this.updateFrames();
        }
    }
    get state() {
        if (this.connection.disposed) {
            return DebugState.Inactive;
        }
        if (!this.initialized) {
            return DebugState.Initializing;
        }
        const thread = this.currentThread;
        if (thread) {
            return thread.stopped ? DebugState.Stopped : DebugState.Running;
        }
        return !!this.stoppedThreads.next().value ? DebugState.Stopped : DebugState.Running;
    }
    async getScopes() {
        const { currentFrame } = this;
        return currentFrame ? currentFrame.getScopes() : [];
    }
    async start() {
        await this.initialize();
        await this.launchOrAttach();
    }
    async initialize() {
        try {
            const response = await this.connection.sendRequest('initialize', {
                clientID: 'Theia',
                clientName: 'Theia IDE',
                adapterID: this.configuration.type,
                locale: 'en-US',
                linesStartAt1: true,
                columnsStartAt1: true,
                pathFormat: 'path',
                supportsVariableType: false,
                supportsVariablePaging: false,
                supportsRunInTerminalRequest: true
            });
            this.updateCapabilities((response === null || response === void 0 ? void 0 : response.body) || {});
            this.didReceiveCapabilities.resolve();
        }
        catch (err) {
            this.didReceiveCapabilities.reject(err);
            throw err;
        }
    }
    async launchOrAttach() {
        try {
            await this.sendRequest(this.configuration.request, this.configuration);
        }
        catch (reason) {
            this.messages.showMessage({
                type: common_1.MessageType.Error,
                text: reason.message || 'Debug session initialization failed. See console for details.',
                options: {
                    timeout: 10000
                }
            });
            throw reason;
        }
    }
    async configure() {
        await this.didReceiveCapabilities.promise;
        if (this.capabilities.exceptionBreakpointFilters) {
            const exceptionBreakpoints = [];
            for (const filter of this.capabilities.exceptionBreakpointFilters) {
                const origin = this.breakpoints.getExceptionBreakpoint(filter.filter);
                exceptionBreakpoints.push(breakpoint_marker_1.ExceptionBreakpoint.create(filter, origin));
            }
            this.breakpoints.setExceptionBreakpoints(exceptionBreakpoints);
        }
        await this.updateBreakpoints({ sourceModified: false });
        if (this.capabilities.supportsConfigurationDoneRequest) {
            await this.sendRequest('configurationDone', {});
        }
        this.initialized = true;
        await this.updateThreads(undefined);
    }
    canTerminate() {
        return !!this.capabilities.supportsTerminateRequest;
    }
    canRestart() {
        return !!this.capabilities.supportsRestartRequest;
    }
    async restart() {
        if (this.canRestart()) {
            await this.sendRequest('restart', {});
        }
    }
    async stop(isRestart, callback) {
        if (!this.isStopping) {
            this.isStopping = true;
            if (this.canTerminate()) {
                const terminated = this.waitFor('terminated', this.stopTimeout);
                try {
                    await this.connection.sendRequest('terminate', { restart: isRestart }, this.stopTimeout);
                    await terminated;
                }
                catch (e) {
                    this.handleTerminateError(e);
                }
            }
            else {
                const terminateDebuggee = this.initialized && this.capabilities.supportTerminateDebuggee;
                try {
                    await this.sendRequest('disconnect', { restart: isRestart, terminateDebuggee }, this.stopTimeout);
                }
                catch (e) {
                    this.handleDisconnectError(e);
                }
            }
            callback();
        }
    }
    /**
     * Invoked when sending the `terminate` request to the debugger is rejected or timed out.
     */
    handleTerminateError(err) {
        console.error('Did not receive terminated event in time', err);
    }
    /**
     * Invoked when sending the `disconnect` request to the debugger is rejected or timed out.
     */
    handleDisconnectError(err) {
        console.error('Error on disconnect', err);
    }
    async disconnect(isRestart, callback) {
        if (!this.isStopping) {
            this.isStopping = true;
            await this.sendRequest('disconnect', { restart: isRestart });
            callback();
        }
    }
    async completions(text, column, line) {
        const frameId = this.currentFrame && this.currentFrame.raw.id;
        const response = await this.sendRequest('completions', { frameId, text, column, line });
        return response.body.targets;
    }
    async evaluate(expression, context) {
        const frameId = this.currentFrame && this.currentFrame.raw.id;
        const response = await this.sendRequest('evaluate', { expression, frameId, context });
        return response.body;
    }
    sendRequest(command, args, timeout) {
        return this.connection.sendRequest(command, args, timeout);
    }
    sendCustomRequest(command, args) {
        return this.connection.sendCustomRequest(command, args);
    }
    on(kind, listener) {
        return this.connection.on(kind, listener);
    }
    waitFor(kind, ms) {
        return (0, promise_util_1.waitForEvent)(this.connection.onEvent(kind), ms).then();
    }
    get onDidCustomEvent() {
        return this.connection.onDidCustomEvent;
    }
    async runInTerminal({ arguments: { title, cwd, args, env } }) {
        const terminal = await this.doCreateTerminal({ title, cwd, env, useServerTitle: false });
        const { processId } = terminal;
        await terminal.executeCommand({ cwd, args, env });
        return { processId: await processId };
    }
    async doCreateTerminal(options) {
        let terminal = undefined;
        for (const t of this.terminalServer.all) {
            if ((t.title.label === options.title || t.title.caption === options.title) && (await t.hasChildProcesses()) === false) {
                terminal = t;
                break;
            }
        }
        if (!terminal) {
            terminal = await this.terminalServer.newTerminal(options);
            await terminal.start();
        }
        this.terminalServer.open(terminal);
        return terminal;
    }
    clearThreads() {
        for (const thread of this.threads) {
            thread.clear();
        }
        this.updateCurrentThread();
    }
    clearThread(threadId) {
        const thread = this._threads.get(threadId);
        if (thread) {
            thread.clear();
        }
        this.updateCurrentThread();
    }
    updateThreads(stoppedDetails) {
        return this.pendingThreads = this.pendingThreads.then(async () => {
            try {
                const response = await this.sendRequest('threads', {});
                // java debugger returns an empty body sometimes
                const threads = response && response.body && response.body.threads || [];
                this.doUpdateThreads(threads, stoppedDetails);
            }
            catch (e) {
                console.error('updateThreads failed:', e);
            }
        });
    }
    doUpdateThreads(threads, stoppedDetails) {
        const existing = this._threads;
        this._threads = new Map();
        for (const raw of threads) {
            const id = raw.id;
            const thread = existing.get(id) || new debug_thread_1.DebugThread(this);
            this._threads.set(id, thread);
            const data = { raw };
            if (stoppedDetails) {
                if (stoppedDetails.threadId === id) {
                    data.stoppedDetails = stoppedDetails;
                }
                else if (stoppedDetails.allThreadsStopped) {
                    data.stoppedDetails = {
                        // When a debug adapter notifies us that all threads are stopped,
                        // we do not know why the others are stopped, so we should default
                        // to something generic.
                        reason: '',
                    };
                }
            }
            thread.update(data);
        }
        this.updateCurrentThread(stoppedDetails);
    }
    updateCurrentThread(stoppedDetails) {
        const { currentThread } = this;
        let threadId = currentThread && currentThread.raw.id;
        if (stoppedDetails && !stoppedDetails.preserveFocusHint && !!stoppedDetails.threadId) {
            threadId = stoppedDetails.threadId;
        }
        this.currentThread = typeof threadId === 'number' && this._threads.get(threadId)
            || this._threads.values().next().value;
    }
    async updateFrames() {
        const thread = this._currentThread;
        if (!thread || thread.pendingFrameCount || thread.frameCount) {
            return;
        }
        if (this.capabilities.supportsDelayedStackTraceLoading) {
            await thread.fetchFrames(1);
            await thread.fetchFrames(19);
        }
        else {
            await thread.fetchFrames();
        }
    }
    updateCapabilities(capabilities) {
        Object.assign(this._capabilities, capabilities);
        this.deferredOnDidConfigureCapabilities.resolve();
    }
    get breakpointUris() {
        return this._breakpoints.keys();
    }
    getSourceBreakpoints(uri) {
        const breakpoints = [];
        for (const breakpoint of this.getBreakpoints(uri)) {
            if (breakpoint instanceof debug_source_breakpoint_1.DebugSourceBreakpoint) {
                breakpoints.push(breakpoint);
            }
        }
        return breakpoints;
    }
    getFunctionBreakpoints() {
        return this.getBreakpoints(breakpoint_manager_1.BreakpointManager.FUNCTION_URI).filter((breakpoint) => breakpoint instanceof debug_function_breakpoint_1.DebugFunctionBreakpoint);
    }
    getInstructionBreakpoints() {
        if (this.capabilities.supportsInstructionBreakpoints) {
            return this.getBreakpoints(breakpoint_manager_1.BreakpointManager.INSTRUCTION_URI)
                .filter((breakpoint) => breakpoint instanceof debug_instruction_breakpoint_1.DebugInstructionBreakpoint);
        }
        return this.breakpoints.getInstructionBreakpoints().map(origin => new debug_instruction_breakpoint_1.DebugInstructionBreakpoint(origin, this.asDebugBreakpointOptions()));
    }
    getBreakpoints(uri) {
        if (uri) {
            return this._breakpoints.get(uri.toString()) || [];
        }
        const result = [];
        for (const breakpoints of this._breakpoints.values()) {
            result.push(...breakpoints);
        }
        return result;
    }
    getBreakpoint(id) {
        for (const breakpoints of this._breakpoints.values()) {
            const breakpoint = breakpoints.find(b => b.id === id);
            if (breakpoint) {
                return breakpoint;
            }
        }
        return undefined;
    }
    clearBreakpoints() {
        const uris = [...this._breakpoints.keys()];
        this._breakpoints.clear();
        for (const uri of uris) {
            this.fireDidChangeBreakpoints(new uri_1.default(uri));
        }
    }
    updateBreakpoint(body) {
        this.updatingBreakpoints = true;
        try {
            const raw = body.breakpoint;
            if (body.reason === 'new') {
                if (raw.source && typeof raw.line === 'number') {
                    const uri = debug_source_1.DebugSource.toUri(raw.source);
                    const origin = breakpoint_marker_1.SourceBreakpoint.create(uri, { line: raw.line, column: raw.column });
                    if (this.breakpoints.addBreakpoint(origin)) {
                        const breakpoints = this.getSourceBreakpoints(uri);
                        const breakpoint = new debug_source_breakpoint_1.DebugSourceBreakpoint(origin, this.asDebugBreakpointOptions());
                        breakpoint.update({ raw });
                        breakpoints.push(breakpoint);
                        this.setSourceBreakpoints(uri, breakpoints);
                    }
                }
            }
            if (body.reason === 'removed' && raw.id) {
                const toRemove = this.findBreakpoint(b => b.idFromAdapter === raw.id);
                if (toRemove) {
                    toRemove.remove();
                    const breakpoints = this.getBreakpoints(toRemove.uri);
                    const index = breakpoints.indexOf(toRemove);
                    if (index !== -1) {
                        breakpoints.splice(index, 1);
                        this.setBreakpoints(toRemove.uri, breakpoints);
                    }
                }
            }
            if (body.reason === 'changed' && raw.id) {
                const toUpdate = this.findBreakpoint(b => b.idFromAdapter === raw.id);
                if (toUpdate) {
                    toUpdate.update({ raw });
                    if (toUpdate instanceof debug_source_breakpoint_1.DebugSourceBreakpoint) {
                        const sourceBreakpoints = this.getSourceBreakpoints(toUpdate.uri);
                        // in order to dedup again if a debugger converted line breakpoint to inline breakpoint
                        // i.e. assigned a column to a line breakpoint
                        this.setSourceBreakpoints(toUpdate.uri, sourceBreakpoints);
                    }
                    else {
                        this.fireDidChangeBreakpoints(toUpdate.uri);
                    }
                }
            }
        }
        finally {
            this.updatingBreakpoints = false;
        }
    }
    findBreakpoint(match) {
        for (const [, breakpoints] of this._breakpoints) {
            for (const breakpoint of breakpoints) {
                if (match(breakpoint)) {
                    return breakpoint;
                }
            }
        }
        return undefined;
    }
    async updateBreakpoints(options) {
        if (this.updatingBreakpoints) {
            return;
        }
        const { uri, sourceModified } = options;
        await this.deferredOnDidConfigureCapabilities.promise;
        for (const affectedUri of this.getAffectedUris(uri)) {
            if (affectedUri.toString() === breakpoint_manager_1.BreakpointManager.EXCEPTION_URI.toString()) {
                await this.sendExceptionBreakpoints();
            }
            else if (affectedUri.toString() === breakpoint_manager_1.BreakpointManager.FUNCTION_URI.toString()) {
                await this.sendFunctionBreakpoints(affectedUri);
            }
            else if (affectedUri.toString() === breakpoint_manager_1.BreakpointManager.INSTRUCTION_URI.toString()) {
                await this.sendInstructionBreakpoints();
            }
            else {
                await this.sendSourceBreakpoints(affectedUri, sourceModified);
            }
        }
    }
    async sendExceptionBreakpoints() {
        const filters = [];
        const filterOptions = this.capabilities.supportsExceptionFilterOptions ? [] : undefined;
        for (const breakpoint of this.breakpoints.getExceptionBreakpoints()) {
            if (breakpoint.enabled) {
                if (filterOptions) {
                    filterOptions.push({
                        filterId: breakpoint.raw.filter,
                        condition: breakpoint.condition
                    });
                }
                else {
                    filters.push(breakpoint.raw.filter);
                }
            }
        }
        await this.sendRequest('setExceptionBreakpoints', { filters, filterOptions });
    }
    async sendFunctionBreakpoints(affectedUri) {
        const all = this.breakpoints.getFunctionBreakpoints().map(origin => new debug_function_breakpoint_1.DebugFunctionBreakpoint(origin, this.asDebugBreakpointOptions()));
        const enabled = all.filter(b => b.enabled);
        if (this.capabilities.supportsFunctionBreakpoints) {
            try {
                const response = await this.sendRequest('setFunctionBreakpoints', {
                    breakpoints: enabled.map(b => b.origin.raw)
                });
                // Apparently, `body` and `breakpoints` can be missing.
                // https://github.com/eclipse-theia/theia/issues/11885
                // https://github.com/microsoft/vscode/blob/80004351ccf0884b58359f7c8c801c91bb827d83/src/vs/workbench/contrib/debug/browser/debugSession.ts#L448-L449
                if (response && response.body) {
                    response.body.breakpoints.forEach((raw, index) => {
                        // node debug adapter returns more breakpoints sometimes
                        if (enabled[index]) {
                            enabled[index].update({ raw });
                        }
                    });
                }
            }
            catch (error) {
                // could be error or promise rejection of DebugProtocol.SetFunctionBreakpoints
                if (error instanceof Error) {
                    console.error(`Error setting breakpoints: ${error.message}`);
                }
                else {
                    // handle adapters that send failed DebugProtocol.SetFunctionBreakpoints for invalid breakpoints
                    const genericMessage = 'Function breakpoint not valid for current debug session';
                    const message = error.message ? `${error.message}` : genericMessage;
                    console.warn(`Could not handle function breakpoints: ${message}, disabling...`);
                    enabled.forEach(b => b.update({
                        raw: {
                            verified: false,
                            message
                        }
                    }));
                }
            }
        }
        this.setBreakpoints(affectedUri, all);
    }
    async sendSourceBreakpoints(affectedUri, sourceModified) {
        const source = await this.toSource(affectedUri);
        const all = this.breakpoints.findMarkers({ uri: affectedUri }).map(({ data }) => new debug_source_breakpoint_1.DebugSourceBreakpoint(data, this.asDebugBreakpointOptions()));
        const enabled = all.filter(b => b.enabled);
        try {
            const breakpoints = enabled.map(({ origin }) => origin.raw);
            const response = await this.sendRequest('setBreakpoints', {
                source: source.raw,
                sourceModified,
                breakpoints,
                lines: breakpoints.map(({ line }) => line)
            });
            response.body.breakpoints.forEach((raw, index) => {
                // node debug adapter returns more breakpoints sometimes
                if (enabled[index]) {
                    enabled[index].update({ raw });
                }
            });
        }
        catch (error) {
            // could be error or promise rejection of DebugProtocol.SetBreakpointsResponse
            if (error instanceof Error) {
                console.error(`Error setting breakpoints: ${error.message}`);
            }
            else {
                // handle adapters that send failed DebugProtocol.SetBreakpointsResponse for invalid breakpoints
                const genericMessage = 'Breakpoint not valid for current debug session';
                const message = error.message ? `${error.message}` : genericMessage;
                console.warn(`Could not handle breakpoints for ${affectedUri}: ${message}, disabling...`);
                enabled.forEach(b => b.update({
                    raw: {
                        verified: false,
                        message
                    }
                }));
            }
        }
        this.setSourceBreakpoints(affectedUri, all);
    }
    async sendInstructionBreakpoints() {
        if (!this.capabilities.supportsInstructionBreakpoints) {
            return;
        }
        const all = this.breakpoints.getInstructionBreakpoints().map(breakpoint => new debug_instruction_breakpoint_1.DebugInstructionBreakpoint(breakpoint, this.asDebugBreakpointOptions()));
        const enabled = all.filter(breakpoint => breakpoint.enabled);
        try {
            const response = await this.sendRequest('setInstructionBreakpoints', {
                breakpoints: enabled.map(renderable => renderable.origin),
            });
            response.body.breakpoints.forEach((raw, index) => { var _a; return (_a = enabled[index]) === null || _a === void 0 ? void 0 : _a.update({ raw }); });
        }
        catch {
            enabled.forEach(breakpoint => breakpoint.update({ raw: { verified: false } }));
        }
        this.setBreakpoints(breakpoint_manager_1.BreakpointManager.INSTRUCTION_URI, all);
    }
    setBreakpoints(uri, breakpoints) {
        this._breakpoints.set(uri.toString(), breakpoints);
        this.fireDidChangeBreakpoints(uri);
    }
    setSourceBreakpoints(uri, breakpoints) {
        const distinct = this.dedupSourceBreakpoints(breakpoints);
        this.setBreakpoints(uri, distinct);
    }
    dedupSourceBreakpoints(all) {
        const positions = new Map();
        for (const breakpoint of all) {
            let primary = positions.get(breakpoint.renderPosition()) || breakpoint;
            if (primary !== breakpoint) {
                let secondary = breakpoint;
                if (secondary.raw && secondary.raw.line === secondary.origin.raw.line && secondary.raw.column === secondary.origin.raw.column) {
                    [primary, secondary] = [breakpoint, primary];
                }
                primary.origins.push(...secondary.origins);
            }
            positions.set(primary.renderPosition(), primary);
        }
        return [...positions.values()];
    }
    *getAffectedUris(uri) {
        if (uri) {
            yield uri;
        }
        else {
            for (const uriString of this.breakpoints.getUris()) {
                yield new uri_1.default(uriString);
            }
            yield breakpoint_manager_1.BreakpointManager.FUNCTION_URI;
            yield breakpoint_manager_1.BreakpointManager.EXCEPTION_URI;
        }
    }
    asDebugBreakpointOptions() {
        const { labelProvider, breakpoints, editorManager } = this;
        return { labelProvider, breakpoints, editorManager, session: this };
    }
    get label() {
        const suffixes = [];
        if (debug_session_options_1.InternalDebugSessionOptions.is(this.options) && this.options.id) {
            suffixes.push(String(this.options.id + 1));
        }
        if (this.workspaceService.isMultiRootWorkspaceOpened && this.options.workspaceFolderUri) {
            suffixes.push(this.labelProvider.getName(new uri_1.default(this.options.workspaceFolderUri)));
        }
        return suffixes.length === 0 ? this.configuration.name : this.configuration.name + ` (${suffixes.join(' - ')})`;
    }
    get visible() {
        return this.state > DebugState.Inactive;
    }
    render() {
        let label = '';
        const state = this.state === DebugState.Stopped ? core_1.nls.localizeByDefault('Paused') : core_1.nls.localizeByDefault('Running');
        const child = this.getSingleChildSession();
        if (child && child.configuration.compact) {
            // Inlines the name of the child debug session
            label = `: ${child.label}`;
        }
        return React.createElement("div", { className: 'theia-debug-session', title: 'Session' },
            React.createElement("span", { className: 'label' }, this.label + label),
            React.createElement("span", { className: 'status' }, state));
    }
    *getElements() {
        const child = this.getSingleChildSession();
        if (child && child.configuration.compact) {
            // Inlines the elements of the child debug session
            return yield* child.getElements();
        }
        yield* this.threads;
        yield* this.childSessions.values();
    }
    getSingleChildSession() {
        if (this._threads.size === 0 && this.childSessions.size === 1) {
            const child = this.childSessions.values().next().value;
            return child;
        }
        return undefined;
    }
    async handleContinued({ body: { allThreadsContinued, threadId } }) {
        if (allThreadsContinued !== false) {
            this.clearThreads();
        }
        else {
            this.clearThread(threadId);
        }
    }
    ;
    async handleStopped({ body }) {
        // Update thread list
        await this.updateThreads(body);
        // Update current thread's frames immediately
        await this.updateFrames();
    }
    ;
    async handleThread({ body: { reason, threadId } }) {
        if (reason === 'started') {
            this.scheduleUpdateThreads();
        }
        else if (reason === 'exited') {
            this._threads.delete(threadId);
            this.updateCurrentThread();
        }
    }
    ;
    registerDebugContributions(configType, connection) {
        for (const contrib of this.debugContributionProvider.getContributions()) {
            contrib.register(configType, connection);
        }
    }
    ;
    /**
     * Returns the top-most parent session that is responsible for the console. If this session uses a {@link DebugConsoleMode.Separate separate console}
     * or does not have any parent session, undefined is returned.
     */
    findConsoleParent() {
        if (this.configuration.consoleMode !== debug_common_1.DebugConsoleMode.MergeWithParent) {
            return undefined;
        }
        let debugSession = this;
        do {
            debugSession = debugSession.parentSession;
        } while ((debugSession === null || debugSession === void 0 ? void 0 : debugSession.parentSession) && debugSession.configuration.consoleMode === debug_common_1.DebugConsoleMode.MergeWithParent);
        return debugSession;
    }
}
exports.DebugSession = DebugSession;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/debug/lib/browser/debug-session'] = this;


/***/ }),

/***/ "../../packages/debug/lib/browser/model/debug-breakpoint.js":
/*!******************************************************************!*\
  !*** ../../packages/debug/lib/browser/model/debug-breakpoint.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2019 TypeFox and others.
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
exports.DebugBreakpoint = exports.DebugBreakpointDecoration = exports.DebugBreakpointOptions = exports.DebugBreakpointData = void 0;
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
class DebugBreakpointData {
}
exports.DebugBreakpointData = DebugBreakpointData;
class DebugBreakpointOptions {
}
exports.DebugBreakpointOptions = DebugBreakpointOptions;
class DebugBreakpointDecoration {
}
exports.DebugBreakpointDecoration = DebugBreakpointDecoration;
class DebugBreakpoint extends DebugBreakpointOptions {
    constructor(uri, options) {
        super();
        this.uri = uri;
        this.setBreakpointEnabled = (event) => {
            this.setEnabled(event.target.checked);
        };
        Object.assign(this, options);
    }
    update(data) {
        Object.assign(this, data);
    }
    get idFromAdapter() {
        return this.raw && this.raw.id;
    }
    get id() {
        return this.origin.id;
    }
    get enabled() {
        return this.breakpoints.breakpointsEnabled && this.origin.enabled;
    }
    get installed() {
        return !!this.raw;
    }
    get verified() {
        return !!this.raw ? this.raw.verified : true;
    }
    get message() {
        return this.raw && this.raw.message || '';
    }
    render() {
        const classNames = ['theia-source-breakpoint'];
        if (!this.isEnabled()) {
            classNames.push(browser_1.DISABLED_CLASS);
        }
        const decoration = this.getDecoration();
        return React.createElement("div", { title: decoration.message.join('\n'), className: classNames.join(' ') },
            React.createElement("span", { className: 'theia-debug-breakpoint-icon codicon ' + decoration.className }),
            React.createElement("input", { className: 'theia-input', type: 'checkbox', checked: this.origin.enabled, onChange: this.setBreakpointEnabled }),
            this.doRender());
    }
    isEnabled() {
        return this.breakpoints.breakpointsEnabled && this.verified;
    }
    getDecoration() {
        if (!this.enabled) {
            return this.getDisabledBreakpointDecoration();
        }
        if (this.installed && !this.verified) {
            return this.getUnverifiedBreakpointDecoration();
        }
        return this.doGetDecoration();
    }
    getUnverifiedBreakpointDecoration() {
        const decoration = this.getBreakpointDecoration();
        return {
            className: decoration.className + '-unverified',
            message: [this.message || 'Unverified ' + decoration.message[0]]
        };
    }
    getDisabledBreakpointDecoration(message) {
        const decoration = this.getBreakpointDecoration();
        return {
            className: decoration.className + '-disabled',
            message: [message || ('Disabled ' + decoration.message[0])]
        };
    }
    doGetDecoration(messages = []) {
        if (this.message) {
            if (messages.length) {
                messages[messages.length - 1].concat(', ' + this.message);
            }
            else {
                messages.push(this.message);
            }
        }
        return this.getBreakpointDecoration(messages);
    }
}
exports.DebugBreakpoint = DebugBreakpoint;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/debug/lib/browser/model/debug-breakpoint'] = this;


/***/ }),

/***/ "../../packages/debug/lib/browser/model/debug-function-breakpoint.js":
/*!***************************************************************************!*\
  !*** ../../packages/debug/lib/browser/model/debug-function-breakpoint.js ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2019 TypeFox and others.
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
exports.DebugFunctionBreakpoint = void 0;
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const breakpoint_manager_1 = __webpack_require__(/*! ../breakpoint/breakpoint-manager */ "../../packages/debug/lib/browser/breakpoint/breakpoint-manager.js");
const debug_breakpoint_1 = __webpack_require__(/*! ./debug-breakpoint */ "../../packages/debug/lib/browser/model/debug-breakpoint.js");
const dialogs_1 = __webpack_require__(/*! @theia/core/lib/browser/dialogs */ "../../packages/core/lib/browser/dialogs.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
class DebugFunctionBreakpoint extends debug_breakpoint_1.DebugBreakpoint {
    constructor(origin, options) {
        super(breakpoint_manager_1.BreakpointManager.FUNCTION_URI, options);
        this.origin = origin;
    }
    setEnabled(enabled) {
        const breakpoints = this.breakpoints.getFunctionBreakpoints();
        const breakpoint = breakpoints.find(b => b.id === this.id);
        if (breakpoint && breakpoint.enabled !== enabled) {
            breakpoint.enabled = enabled;
            this.breakpoints.setFunctionBreakpoints(breakpoints);
        }
    }
    isEnabled() {
        return super.isEnabled() && this.isSupported();
    }
    isSupported() {
        const { session } = this;
        return !session || !!session.capabilities.supportsFunctionBreakpoints;
    }
    remove() {
        const breakpoints = this.breakpoints.getFunctionBreakpoints();
        const newBreakpoints = breakpoints.filter(b => b.id !== this.id);
        if (breakpoints.length !== newBreakpoints.length) {
            this.breakpoints.setFunctionBreakpoints(newBreakpoints);
        }
    }
    get name() {
        return this.origin.raw.name;
    }
    doRender() {
        return React.createElement("span", { className: 'line-info' }, this.name);
    }
    doGetDecoration() {
        if (!this.isSupported()) {
            return this.getDisabledBreakpointDecoration(core_1.nls.localizeByDefault('Function breakpoints are not supported by this debug type'));
        }
        return super.doGetDecoration();
    }
    getBreakpointDecoration(message) {
        return {
            className: 'codicon-debug-breakpoint-function',
            message: message || [core_1.nls.localizeByDefault('Function Breakpoint')]
        };
    }
    async open() {
        const input = new dialogs_1.SingleTextInputDialog({
            title: core_1.nls.localizeByDefault('Add Function Breakpoint'),
            initialValue: this.name
        });
        const newValue = await input.open();
        if (newValue !== undefined && newValue !== this.name) {
            const breakpoints = this.breakpoints.getFunctionBreakpoints();
            const breakpoint = breakpoints.find(b => b.id === this.id);
            if (breakpoint) {
                if (breakpoint.raw.name !== newValue) {
                    breakpoint.raw.name = newValue;
                    this.breakpoints.setFunctionBreakpoints(breakpoints);
                }
            }
            else {
                this.origin.raw.name = newValue;
                breakpoints.push(this.origin);
                this.breakpoints.setFunctionBreakpoints(breakpoints);
            }
        }
    }
}
exports.DebugFunctionBreakpoint = DebugFunctionBreakpoint;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/debug/lib/browser/model/debug-function-breakpoint'] = this;


/***/ }),

/***/ "../../packages/debug/lib/browser/model/debug-instruction-breakpoint.js":
/*!******************************************************************************!*\
  !*** ../../packages/debug/lib/browser/model/debug-instruction-breakpoint.js ***!
  \******************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
exports.DebugInstructionBreakpoint = void 0;
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const breakpoint_manager_1 = __webpack_require__(/*! ../breakpoint/breakpoint-manager */ "../../packages/debug/lib/browser/breakpoint/breakpoint-manager.js");
const debug_breakpoint_1 = __webpack_require__(/*! ./debug-breakpoint */ "../../packages/debug/lib/browser/model/debug-breakpoint.js");
class DebugInstructionBreakpoint extends debug_breakpoint_1.DebugBreakpoint {
    constructor(origin, options) {
        super(breakpoint_manager_1.BreakpointManager.INSTRUCTION_URI, options);
        this.origin = origin;
    }
    setEnabled(enabled) {
        if (enabled !== this.origin.enabled) {
            this.breakpoints.updateInstructionBreakpoint(this.origin.id, { enabled });
        }
    }
    isEnabled() {
        return super.isEnabled() && this.isSupported();
    }
    isSupported() {
        var _a;
        return Boolean((_a = this.session) === null || _a === void 0 ? void 0 : _a.capabilities.supportsInstructionBreakpoints);
    }
    remove() {
        this.breakpoints.removeInstructionBreakpoint(this.origin.instructionReference);
    }
    doRender() {
        return React.createElement("span", { className: "line-info" }, this.origin.instructionReference);
    }
    getBreakpointDecoration(message) {
        if (!this.isSupported()) {
            return {
                className: 'codicon-debug-breakpoint-unsupported',
                message: message !== null && message !== void 0 ? message : [core_1.nls.localize('theia/debug/instruction-breakpoint', 'Instruction Breakpoint')],
            };
        }
        if (this.origin.condition || this.origin.hitCondition) {
            return {
                className: 'codicon-debug-breakpoint-conditional',
                message: message || [core_1.nls.localizeByDefault('Conditional Breakpoint...')]
            };
        }
        return {
            className: 'codicon-debug-breakpoint',
            message: message || [core_1.nls.localize('theia/debug/instruction-breakpoint', 'Instruction Breakpoint')]
        };
    }
}
exports.DebugInstructionBreakpoint = DebugInstructionBreakpoint;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/debug/lib/browser/model/debug-instruction-breakpoint'] = this;


/***/ }),

/***/ "../../packages/debug/lib/browser/model/debug-source-breakpoint.js":
/*!*************************************************************************!*\
  !*** ../../packages/debug/lib/browser/model/debug-source-breakpoint.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DebugSourceBreakpoint = exports.DebugSourceBreakpointData = void 0;
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const debug_breakpoint_1 = __webpack_require__(/*! ./debug-breakpoint */ "../../packages/debug/lib/browser/model/debug-breakpoint.js");
class DebugSourceBreakpointData extends debug_breakpoint_1.DebugBreakpointData {
}
exports.DebugSourceBreakpointData = DebugSourceBreakpointData;
class DebugSourceBreakpoint extends debug_breakpoint_1.DebugBreakpoint {
    constructor(origin, options) {
        super(new uri_1.default(origin.uri), options);
        this.setBreakpointEnabled = (event) => {
            this.setEnabled(event.target.checked);
        };
        this.origins = [origin];
    }
    update(data) {
        super.update(data);
    }
    get origin() {
        return this.origins[0];
    }
    setEnabled(enabled) {
        const { uri, raw } = this;
        let shouldUpdate = false;
        let breakpoints = raw && this.doRemove(this.origins.filter(origin => !(origin.raw.line === raw.line && origin.raw.column === raw.column)));
        // Check for breakpoints array with at least one entry
        if (breakpoints && breakpoints.length) {
            shouldUpdate = true;
        }
        else {
            breakpoints = this.breakpoints.getBreakpoints(uri);
        }
        for (const breakpoint of breakpoints) {
            if (breakpoint.raw.line === this.origin.raw.line && breakpoint.raw.column === this.origin.raw.column && breakpoint.enabled !== enabled) {
                breakpoint.enabled = enabled;
                shouldUpdate = true;
            }
        }
        if (shouldUpdate) {
            this.breakpoints.setBreakpoints(this.uri, breakpoints);
        }
    }
    updateOrigins(data) {
        const breakpoints = this.breakpoints.getBreakpoints(this.uri);
        let shouldUpdate = false;
        const originPositions = new Set();
        this.origins.forEach(origin => originPositions.add(origin.raw.line + ':' + origin.raw.column));
        for (const breakpoint of breakpoints) {
            if (originPositions.has(breakpoint.raw.line + ':' + breakpoint.raw.column)) {
                Object.assign(breakpoint.raw, data);
                shouldUpdate = true;
            }
        }
        if (shouldUpdate) {
            this.breakpoints.setBreakpoints(this.uri, breakpoints);
        }
    }
    /** 1-based */
    get line() {
        return this.raw && this.raw.line || this.origins[0].raw.line;
    }
    get column() {
        return this.raw && this.raw.column || this.origins[0].raw.column;
    }
    get endLine() {
        return this.raw && this.raw.endLine;
    }
    get endColumn() {
        return this.raw && this.raw.endColumn;
    }
    get condition() {
        return this.origin.raw.condition;
    }
    get hitCondition() {
        return this.origin.raw.hitCondition;
    }
    get logMessage() {
        return this.origin.raw.logMessage;
    }
    get source() {
        return this.raw && this.raw.source && this.session && this.session.getSource(this.raw.source);
    }
    async open(options = {
        mode: 'reveal'
    }) {
        const { line, column, endLine, endColumn } = this;
        const selection = {
            start: {
                line: line - 1,
                character: typeof column === 'number' ? column - 1 : undefined
            }
        };
        if (typeof endLine === 'number') {
            selection.end = {
                line: endLine - 1,
                character: typeof endColumn === 'number' ? endColumn - 1 : undefined
            };
        }
        if (this.source) {
            await this.source.open({
                ...options,
                selection
            });
        }
        else {
            await this.editorManager.open(this.uri, {
                ...options,
                selection
            });
        }
    }
    doRender() {
        return React.createElement(React.Fragment, null,
            React.createElement("span", { className: 'line-info', title: this.labelProvider.getLongName(this.uri) },
                React.createElement("span", { className: 'name' },
                    this.labelProvider.getName(this.uri),
                    " "),
                React.createElement("span", { className: 'path ' + browser_1.TREE_NODE_INFO_CLASS },
                    this.labelProvider.getLongName(this.uri.parent),
                    " ")),
            React.createElement("span", { className: 'line' }, this.renderPosition()));
    }
    renderPosition() {
        return this.line + (typeof this.column === 'number' ? ':' + this.column : '');
    }
    doGetDecoration(messages = []) {
        if (this.logMessage || this.condition || this.hitCondition) {
            const { session } = this;
            if (this.logMessage) {
                if (session && !session.capabilities.supportsLogPoints) {
                    return this.getUnsupportedBreakpointDecoration('Logpoints not supported by this debug type');
                }
                messages.push('Log Message: ' + this.logMessage);
            }
            if (this.condition) {
                if (session && !session.capabilities.supportsConditionalBreakpoints) {
                    return this.getUnsupportedBreakpointDecoration('Conditional breakpoints not supported by this debug type');
                }
                messages.push('Expression: ' + this.condition);
            }
            if (this.hitCondition) {
                if (session && !session.capabilities.supportsHitConditionalBreakpoints) {
                    return this.getUnsupportedBreakpointDecoration('Hit conditional breakpoints not supported by this debug type');
                }
                messages.push('Hit Count: ' + this.hitCondition);
            }
        }
        return super.doGetDecoration(messages);
    }
    getUnsupportedBreakpointDecoration(message) {
        return {
            className: 'codicon-debug-breakpoint-unsupported',
            message: [message]
        };
    }
    getBreakpointDecoration(message) {
        if (this.logMessage) {
            return {
                className: 'codicon-debug-breakpoint-log',
                message: message || ['Logpoint']
            };
        }
        if (this.condition || this.hitCondition) {
            return {
                className: 'codicon-debug-breakpoint-conditional',
                message: message || ['Conditional Breakpoint']
            };
        }
        return {
            className: 'codicon-debug-breakpoint',
            message: message || ['Breakpoint']
        };
    }
    remove() {
        const breakpoints = this.doRemove(this.origins);
        if (breakpoints) {
            this.breakpoints.setBreakpoints(this.uri, breakpoints);
        }
    }
    doRemove(origins) {
        if (!origins.length) {
            return undefined;
        }
        const { uri } = this;
        const toRemove = new Set();
        origins.forEach(origin => toRemove.add(origin.raw.line + ':' + origin.raw.column));
        let shouldUpdate = false;
        const breakpoints = this.breakpoints.findMarkers({
            uri,
            dataFilter: data => {
                const result = !toRemove.has(data.raw.line + ':' + data.raw.column);
                shouldUpdate = shouldUpdate || !result;
                return result;
            }
        }).map(({ data }) => data);
        return shouldUpdate && breakpoints || undefined;
    }
}
exports.DebugSourceBreakpoint = DebugSourceBreakpoint;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/debug/lib/browser/model/debug-source-breakpoint'] = this;


/***/ }),

/***/ "../../packages/debug/lib/browser/model/debug-source.js":
/*!**************************************************************!*\
  !*** ../../packages/debug/lib/browser/model/debug-source.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DebugSource = exports.DebugSourceData = void 0;
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const vscode_uri_1 = __webpack_require__(/*! @theia/core/shared/vscode-uri */ "../../packages/core/shared/vscode-uri/index.js");
const debug_uri_utils_1 = __webpack_require__(/*! ../../common/debug-uri-utils */ "../../packages/debug/lib/common/debug-uri-utils.js");
class DebugSourceData {
}
exports.DebugSourceData = DebugSourceData;
class DebugSource extends DebugSourceData {
    constructor(session, editorManager, labelProvider) {
        super();
        this.session = session;
        this.editorManager = editorManager;
        this.labelProvider = labelProvider;
    }
    get uri() {
        return DebugSource.toUri(this.raw);
    }
    update(data) {
        Object.assign(this, data);
    }
    open(options) {
        return this.editorManager.open(this.uri, options);
    }
    async load() {
        const source = this.raw;
        const sourceReference = source.sourceReference;
        const response = await this.session.sendRequest('source', {
            sourceReference,
            source
        });
        return response.body.content;
    }
    get inMemory() {
        return this.uri.scheme === debug_uri_utils_1.DEBUG_SCHEME;
    }
    get name() {
        if (this.inMemory) {
            return this.raw.name || this.uri.path.base || this.uri.path.fsPath();
        }
        return this.labelProvider.getName(this.uri);
    }
    get longName() {
        if (this.inMemory) {
            return this.name;
        }
        return this.labelProvider.getLongName(this.uri);
    }
    static toUri(raw) {
        if (raw.sourceReference && raw.sourceReference > 0) {
            return new uri_1.default().withScheme(debug_uri_utils_1.DEBUG_SCHEME).withPath(raw.name).withQuery(String(raw.sourceReference));
        }
        if (!raw.path) {
            throw new Error('Unrecognized source type: ' + JSON.stringify(raw));
        }
        if (raw.path.match(debug_uri_utils_1.SCHEME_PATTERN)) {
            return new uri_1.default(raw.path);
        }
        return new uri_1.default(vscode_uri_1.URI.file(raw.path));
    }
}
exports.DebugSource = DebugSource;
DebugSource.SCHEME = debug_uri_utils_1.DEBUG_SCHEME;
DebugSource.SCHEME_PATTERN = debug_uri_utils_1.SCHEME_PATTERN;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/debug/lib/browser/model/debug-source'] = this;


/***/ }),

/***/ "../../packages/debug/lib/browser/model/debug-stack-frame.js":
/*!*******************************************************************!*\
  !*** ../../packages/debug/lib/browser/model/debug-stack-frame.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DebugStackFrame = exports.DebugStackFrameData = void 0;
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// Based on https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/workbench/contrib/debug/common/debugModel.ts
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const browser_2 = __webpack_require__(/*! @theia/editor/lib/browser */ "../../packages/editor/lib/browser/index.js");
const debug_console_items_1 = __webpack_require__(/*! ../console/debug-console-items */ "../../packages/debug/lib/browser/console/debug-console-items.js");
const monaco = __webpack_require__(/*! @theia/monaco-editor-core */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/editor.main.js");
class DebugStackFrameData {
}
exports.DebugStackFrameData = DebugStackFrameData;
class DebugStackFrame extends DebugStackFrameData {
    constructor(thread, session) {
        super();
        this.thread = thread;
        this.session = session;
    }
    get id() {
        return this.session.id + ':' + this.thread.id + ':' + this.raw.id;
    }
    get source() {
        return this._source;
    }
    update(data) {
        Object.assign(this, data);
        this._source = this.raw.source && this.session.getSource(this.raw.source);
    }
    async restart() {
        await this.session.sendRequest('restartFrame', this.toArgs({
            threadId: this.thread.id
        }));
    }
    async open(options) {
        if (!this.source) {
            return undefined;
        }
        const { line, column, endLine, endColumn } = this.raw;
        const selection = {
            start: browser_2.Position.create(this.clampPositive(line - 1), this.clampPositive(column - 1))
        };
        if (typeof endLine === 'number') {
            selection.end = {
                line: this.clampPositive(endLine - 1),
                character: typeof endColumn === 'number' ? this.clampPositive(endColumn - 1) : undefined
            };
        }
        this.source.open({
            mode: 'reveal',
            ...options,
            selection
        });
    }
    /**
     * Debugger can send `column: 0` value despite of initializing the debug session with `columnsStartAt1: true`.
     * This method can be used to ensure that neither `column` nor `column` are negative numbers.
     * See https://github.com/microsoft/vscode-mock-debug/issues/85.
     */
    clampPositive(value) {
        return Math.max(value, 0);
    }
    getScopes() {
        return this.scopes || (this.scopes = this.doGetScopes());
    }
    async doGetScopes() {
        let response;
        try {
            response = await this.session.sendRequest('scopes', this.toArgs());
        }
        catch {
            // no-op: ignore debug adapter errors
        }
        if (!response) {
            return [];
        }
        return response.body.scopes.map(raw => new debug_console_items_1.DebugScope(raw, () => this.session));
    }
    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/workbench/contrib/debug/common/debugModel.ts#L324-L335
    async getMostSpecificScopes(range) {
        const scopes = await this.getScopes();
        const nonExpensiveScopes = scopes.filter(s => !s.expensive);
        const haveRangeInfo = nonExpensiveScopes.some(s => !!s.range);
        if (!haveRangeInfo) {
            return nonExpensiveScopes;
        }
        const scopesContainingRange = nonExpensiveScopes.filter(scope => scope.range && monaco.Range.containsRange(scope.range, range))
            .sort((first, second) => (first.range.endLineNumber - first.range.startLineNumber) - (second.range.endLineNumber - second.range.startLineNumber));
        return scopesContainingRange.length ? scopesContainingRange : nonExpensiveScopes;
    }
    toArgs(arg) {
        return Object.assign({}, arg, {
            frameId: this.raw.id
        });
    }
    render() {
        const classNames = ['theia-debug-stack-frame'];
        if (this.raw.presentationHint === 'label') {
            classNames.push('label');
        }
        if (this.raw.presentationHint === 'subtle') {
            classNames.push('subtle');
        }
        if (!this.source || this.source.raw.presentationHint === 'deemphasize') {
            classNames.push(browser_1.DISABLED_CLASS);
        }
        return React.createElement("div", { className: classNames.join(' ') },
            React.createElement("span", { className: 'expression', title: this.raw.name }, this.raw.name),
            this.renderFile());
    }
    renderFile() {
        const { source } = this;
        if (!source) {
            return undefined;
        }
        const origin = source.raw.origin && `\n${source.raw.origin}` || '';
        return React.createElement("span", { className: 'file', title: source.longName + origin },
            React.createElement("span", { className: 'name' }, source.name),
            React.createElement("span", { className: 'line' },
                this.raw.line,
                ":",
                this.raw.column));
    }
    get range() {
        const { source, line: startLine, column: startColumn, endLine, endColumn } = this.raw;
        if (source) {
            return new monaco.Range(startLine, startColumn, endLine || startLine, endColumn || startColumn);
        }
        return undefined;
    }
}
exports.DebugStackFrame = DebugStackFrame;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/debug/lib/browser/model/debug-stack-frame'] = this;


/***/ }),

/***/ "../../packages/debug/lib/browser/model/debug-thread.js":
/*!**************************************************************!*\
  !*** ../../packages/debug/lib/browser/model/debug-thread.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DebugThread = exports.DebugThreadData = void 0;
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const debug_stack_frame_1 = __webpack_require__(/*! ./debug-stack-frame */ "../../packages/debug/lib/browser/model/debug-stack-frame.js");
class DebugThreadData {
}
exports.DebugThreadData = DebugThreadData;
class DebugThread extends DebugThreadData {
    constructor(session) {
        super();
        this.session = session;
        this.onDidChangedEmitter = new core_1.Emitter();
        this.onDidChanged = this.onDidChangedEmitter.event;
        this.onDidFocusStackFrameEmitter = new core_1.Emitter();
        this._frames = new Map();
        this.pendingFetch = Promise.resolve([]);
        this._pendingFetchCount = 0;
        this.pendingFetchCancel = new core_1.CancellationTokenSource();
    }
    get onDidFocusStackFrame() {
        return this.onDidFocusStackFrameEmitter.event;
    }
    get id() {
        return this.session.id + ':' + this.raw.id;
    }
    get currentFrame() {
        return this._currentFrame;
    }
    set currentFrame(frame) {
        this._currentFrame = frame;
        this.onDidChangedEmitter.fire(undefined);
        this.onDidFocusStackFrameEmitter.fire(frame);
    }
    get stopped() {
        return !!this.stoppedDetails;
    }
    update(data) {
        Object.assign(this, data);
        if ('stoppedDetails' in data) {
            this.clearFrames();
        }
    }
    clear() {
        this.update({
            raw: this.raw,
            stoppedDetails: undefined
        });
    }
    continue() {
        return this.session.sendRequest('continue', this.toArgs());
    }
    stepOver() {
        return this.session.sendRequest('next', this.toArgs());
    }
    stepIn() {
        return this.session.sendRequest('stepIn', this.toArgs());
    }
    stepOut() {
        return this.session.sendRequest('stepOut', this.toArgs());
    }
    pause() {
        return this.session.sendRequest('pause', this.toArgs());
    }
    async getExceptionInfo() {
        if (this.stoppedDetails && this.stoppedDetails.reason === 'exception') {
            if (this.session.capabilities.supportsExceptionInfoRequest) {
                const response = await this.session.sendRequest('exceptionInfo', this.toArgs());
                return {
                    id: response.body.exceptionId,
                    description: response.body.description,
                    details: response.body.details
                };
            }
            return {
                description: this.stoppedDetails.text
            };
        }
        return undefined;
    }
    get supportsTerminate() {
        return !!this.session.capabilities.supportsTerminateThreadsRequest;
    }
    async terminate() {
        if (this.supportsTerminate) {
            await this.session.sendRequest('terminateThreads', {
                threadIds: [this.raw.id]
            });
        }
    }
    get frames() {
        return this._frames.values();
    }
    get topFrame() {
        return this.frames.next().value;
    }
    get frameCount() {
        return this._frames.size;
    }
    async fetchFrames(levels = 20) {
        const cancel = this.pendingFetchCancel.token;
        this._pendingFetchCount += 1;
        return this.pendingFetch = this.pendingFetch.then(async () => {
            try {
                const start = this.frameCount;
                const frames = await this.doFetchFrames(start, levels);
                if (cancel.isCancellationRequested) {
                    return [];
                }
                return this.doUpdateFrames(frames);
            }
            catch (e) {
                console.error('fetchFrames failed:', e);
                return [];
            }
            finally {
                if (!cancel.isCancellationRequested) {
                    this._pendingFetchCount -= 1;
                }
            }
        });
    }
    get pendingFrameCount() {
        return this._pendingFetchCount;
    }
    async doFetchFrames(startFrame, levels) {
        try {
            const response = await this.session.sendRequest('stackTrace', this.toArgs({ startFrame, levels }));
            if (this.stoppedDetails) {
                this.stoppedDetails.totalFrames = response.body.totalFrames;
            }
            return response.body.stackFrames;
        }
        catch (e) {
            if (this.stoppedDetails) {
                this.stoppedDetails.framesErrorMessage = e.message;
            }
            return [];
        }
    }
    doUpdateFrames(frames) {
        const result = new Set();
        for (const raw of frames) {
            const id = raw.id;
            const frame = this._frames.get(id) || new debug_stack_frame_1.DebugStackFrame(this, this.session);
            this._frames.set(id, frame);
            frame.update({ raw });
            result.add(frame);
        }
        this.updateCurrentFrame();
        return [...result.values()];
    }
    clearFrames() {
        // Clear all frames
        this._frames.clear();
        // Cancel all request promises
        this.pendingFetchCancel.cancel();
        this.pendingFetchCancel = new core_1.CancellationTokenSource();
        // Empty all current requests
        this.pendingFetch = Promise.resolve([]);
        this._pendingFetchCount = 0;
        this.updateCurrentFrame();
    }
    updateCurrentFrame() {
        const { currentFrame } = this;
        const frameId = currentFrame && currentFrame.raw.id;
        this.currentFrame = typeof frameId === 'number' &&
            this._frames.get(frameId) ||
            this._frames.values().next().value;
    }
    toArgs(arg) {
        return Object.assign({}, arg, {
            threadId: this.raw.id
        });
    }
    render() {
        const reason = this.stoppedDetails && this.stoppedDetails.reason;
        const status = this.stoppedDetails ? reason ? `Paused on ${reason}` : 'Paused' : 'Running';
        return React.createElement("div", { className: 'theia-debug-thread', title: 'Thread' },
            React.createElement("span", { className: 'label' }, this.raw.name),
            React.createElement("span", { className: 'status' }, status));
    }
}
exports.DebugThread = DebugThread;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/debug/lib/browser/model/debug-thread'] = this;


/***/ }),

/***/ "../../packages/debug/lib/common/debug-common.js":
/*!*******************************************************!*\
  !*** ../../packages/debug/lib/common/debug-common.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
// FIXME: refactor extensions to get rid of this file and remove it
__exportStar(__webpack_require__(/*! ./debug-configuration */ "../../packages/debug/lib/common/debug-configuration.js"), exports);

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/debug/lib/common/debug-common'] = this;


/***/ }),

/***/ "../../packages/debug/lib/common/debug-compound.js":
/*!*********************************************************!*\
  !*** ../../packages/debug/lib/common/debug-compound.js ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2022 EclipseSource and others.
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
exports.DebugCompound = exports.defaultCompound = void 0;
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
exports.defaultCompound = { name: 'Compound', configurations: [] };
var DebugCompound;
(function (DebugCompound) {
    function is(arg) {
        return (0, common_1.isObject)(arg) && 'name' in arg && 'configurations' in arg;
    }
    DebugCompound.is = is;
})(DebugCompound = exports.DebugCompound || (exports.DebugCompound = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/debug/lib/common/debug-compound'] = this;


/***/ }),

/***/ "../../packages/debug/lib/common/debug-configuration.js":
/*!**************************************************************!*\
  !*** ../../packages/debug/lib/common/debug-configuration.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DebugConsoleMode = exports.DebugConfiguration = void 0;
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
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
var DebugConfiguration;
(function (DebugConfiguration) {
    function is(arg) {
        return (0, common_1.isObject)(arg) && 'type' in arg && 'name' in arg && 'request' in arg;
    }
    DebugConfiguration.is = is;
})(DebugConfiguration = exports.DebugConfiguration || (exports.DebugConfiguration = {}));
var DebugConsoleMode;
(function (DebugConsoleMode) {
    DebugConsoleMode[DebugConsoleMode["Separate"] = 0] = "Separate";
    DebugConsoleMode[DebugConsoleMode["MergeWithParent"] = 1] = "MergeWithParent";
})(DebugConsoleMode = exports.DebugConsoleMode || (exports.DebugConsoleMode = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/debug/lib/common/debug-configuration'] = this;


/***/ }),

/***/ "../../packages/debug/lib/common/debug-service.js":
/*!********************************************************!*\
  !*** ../../packages/debug/lib/common/debug-service.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
exports.ForwardingDebugChannel = exports.DebugError = exports.DebugAdapterPath = exports.DebugService = exports.DebugPath = void 0;
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const application_error_1 = __webpack_require__(/*! @theia/core/lib/common/application-error */ "../../packages/core/lib/common/application-error.js");
/**
 * The WS endpoint path to the Debug service.
 */
exports.DebugPath = '/services/debug';
/**
 * DebugService symbol for DI.
 */
exports.DebugService = Symbol('DebugService');
/**
 * The endpoint path to the debug adapter session.
 */
exports.DebugAdapterPath = '/services/debug-adapter';
var DebugError;
(function (DebugError) {
    DebugError.NotFound = application_error_1.ApplicationError.declare(-41000, (type) => ({
        message: `'${type}' debugger type is not supported.`,
        data: { type }
    }));
})(DebugError = exports.DebugError || (exports.DebugError = {}));
/**
 * A {@link DebugChannel} wrapper implementation that sends and receives messages to/from an underlying {@link Channel}.
 */
class ForwardingDebugChannel {
    constructor(underlyingChannel) {
        this.underlyingChannel = underlyingChannel;
        this.onMessageEmitter = new core_1.Emitter();
        this.underlyingChannel.onMessage(msg => this.onMessageEmitter.fire(msg().readString()));
    }
    send(content) {
        this.underlyingChannel.getWriteBuffer().writeString(content).commit();
    }
    onMessage(cb) {
        this.onMessageEmitter.event(cb);
    }
    onError(cb) {
        this.underlyingChannel.onError(cb);
    }
    onClose(cb) {
        this.underlyingChannel.onClose(event => { var _a; return cb((_a = event.code) !== null && _a !== void 0 ? _a : -1, event.reason); });
    }
    close() {
        this.underlyingChannel.close();
        this.onMessageEmitter.dispose();
    }
}
exports.ForwardingDebugChannel = ForwardingDebugChannel;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/debug/lib/common/debug-service'] = this;


/***/ }),

/***/ "../../packages/debug/lib/common/debug-uri-utils.js":
/*!**********************************************************!*\
  !*** ../../packages/debug/lib/common/debug-uri-utils.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

/********************************************************************************
 * Copyright (C) 2022 STMicroelectronics and others.
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
exports.SCHEME_PATTERN = exports.DEBUG_SCHEME = void 0;
/**
 * The URI scheme for debug URIs.
 */
exports.DEBUG_SCHEME = 'debug';
/**
 * The pattern for URI schemes.
 */
exports.SCHEME_PATTERN = /^[a-zA-Z][a-zA-Z0-9\+\-\.]+:/;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/debug/lib/common/debug-uri-utils'] = this;


/***/ })

}]);
//# sourceMappingURL=packages_debug_lib_browser_debug-session-manager_js.js.map