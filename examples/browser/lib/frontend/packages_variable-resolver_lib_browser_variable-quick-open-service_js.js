"use strict";
(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_variable-resolver_lib_browser_variable-quick-open-service_js"],{

/***/ "../../packages/variable-resolver/lib/browser/variable-quick-open-service.js":
/*!***********************************************************************************!*\
  !*** ../../packages/variable-resolver/lib/browser/variable-quick-open-service.js ***!
  \***********************************************************************************/
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VariableQuickOpenService = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const message_service_1 = __webpack_require__(/*! @theia/core/lib/common/message-service */ "../../packages/core/lib/common/message-service.js");
const variable_1 = __webpack_require__(/*! ./variable */ "../../packages/variable-resolver/lib/browser/variable.js");
const variable_resolver_service_1 = __webpack_require__(/*! ./variable-resolver-service */ "../../packages/variable-resolver/lib/browser/variable-resolver-service.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
let VariableQuickOpenService = class VariableQuickOpenService {
    constructor(variableRegistry) {
        this.variableRegistry = variableRegistry;
    }
    open() {
        var _a;
        this.items = this.variableRegistry.getVariables().map(v => ({
            label: '${' + v.name + '}',
            detail: v.description,
            execute: () => {
                setTimeout(() => this.showValue(v));
            }
        }));
        (_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.showQuickPick(this.items, { placeholder: 'Registered variables' });
    }
    async showValue(variable) {
        var _a;
        const argument = await ((_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.input({
            placeHolder: 'Type a variable argument'
        }));
        const value = await this.variableResolver.resolve('${' + variable.name + ':' + argument + '}');
        if (typeof value === 'string') {
            this.messages.info(value);
        }
    }
};
__decorate([
    (0, inversify_1.inject)(message_service_1.MessageService),
    __metadata("design:type", message_service_1.MessageService)
], VariableQuickOpenService.prototype, "messages", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.QuickInputService),
    (0, inversify_1.optional)(),
    __metadata("design:type", Object)
], VariableQuickOpenService.prototype, "quickInputService", void 0);
__decorate([
    (0, inversify_1.inject)(variable_resolver_service_1.VariableResolverService),
    __metadata("design:type", variable_resolver_service_1.VariableResolverService)
], VariableQuickOpenService.prototype, "variableResolver", void 0);
VariableQuickOpenService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(variable_1.VariableRegistry)),
    __metadata("design:paramtypes", [variable_1.VariableRegistry])
], VariableQuickOpenService);
exports.VariableQuickOpenService = VariableQuickOpenService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/variable-resolver/lib/browser/variable-quick-open-service'] = this;


/***/ }),

/***/ "../../packages/variable-resolver/lib/browser/variable-resolver-service.js":
/*!*********************************************************************************!*\
  !*** ../../packages/variable-resolver/lib/browser/variable-resolver-service.js ***!
  \*********************************************************************************/
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
var VariableResolverService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VariableResolverService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const variable_1 = __webpack_require__(/*! ./variable */ "../../packages/variable-resolver/lib/browser/variable.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
/**
 * The variable resolver service should be used to resolve variables in strings.
 */
let VariableResolverService = VariableResolverService_1 = class VariableResolverService {
    /**
     * Resolve the variables in the given string array.
     * @param value The array of data to resolve variables in.
     * @param options Options of the variable resolution.
     * @returns Promise to array with variables resolved. Never rejects.
     *
     * @deprecated since 1.28.0 use {@link resolve} instead.
     */
    resolveArray(value, options = {}) {
        return this.resolve(value, options);
    }
    /**
     * Resolve the variables for all strings found in the object and nested objects.
     * @param value Data to resolve variables in.
     * @param options Options of the variable resolution
     * @returns Promise to object with variables resolved. Returns `undefined` if a variable resolution was cancelled.
     */
    async resolve(value, options = {}) {
        const context = new VariableResolverService_1.Context(this.variableRegistry, options);
        try {
            return await this.doResolve(value, context);
        }
        catch (error) {
            if ((0, core_1.isCancelled)(error)) {
                return undefined;
            }
            throw error;
        }
    }
    async doResolve(value, context) {
        // eslint-disable-next-line no-null/no-null
        if (value === undefined || value === null) {
            return value;
        }
        if (typeof value === 'string') {
            return this.doResolveString(value, context);
        }
        if (Array.isArray(value)) {
            return this.doResolveArray(value, context);
        }
        if (typeof value === 'object') {
            return this.doResolveObject(value, context);
        }
        return value;
    }
    async doResolveObject(obj, context) {
        const result = {};
        for (const name of Object.keys(obj)) {
            const value = obj[name];
            const resolved = await this.doResolve(value, context);
            result[name] = resolved;
        }
        return result;
    }
    async doResolveArray(values, context) {
        const result = [];
        for (const value of values) {
            const resolved = await this.doResolve(value, context);
            result.push(resolved);
        }
        return result;
    }
    async doResolveString(value, context) {
        await this.resolveVariables(value, context);
        return value.replace(VariableResolverService_1.VAR_REGEXP, (match, varName) => {
            const varValue = context.get(varName);
            return varValue !== undefined ? varValue : match;
        });
    }
    async resolveVariables(value, context) {
        const variableRegExp = new RegExp(VariableResolverService_1.VAR_REGEXP);
        let match;
        // eslint-disable-next-line no-null/no-null
        while ((match = variableRegExp.exec(value)) !== null) {
            const variableName = match[1];
            await context.resolve(variableName);
        }
    }
};
VariableResolverService.VAR_REGEXP = /\$\{(.*?)\}/g;
__decorate([
    (0, inversify_1.inject)(variable_1.VariableRegistry),
    __metadata("design:type", variable_1.VariableRegistry)
], VariableResolverService.prototype, "variableRegistry", void 0);
VariableResolverService = VariableResolverService_1 = __decorate([
    (0, inversify_1.injectable)()
], VariableResolverService);
exports.VariableResolverService = VariableResolverService;
(function (VariableResolverService) {
    class Context {
        constructor(variableRegistry, options) {
            this.variableRegistry = variableRegistry;
            this.options = options;
            this.resolved = new Map();
        }
        get(name) {
            return this.resolved.get(name);
        }
        async resolve(name) {
            if (this.resolved.has(name)) {
                return;
            }
            try {
                let variableName = name;
                let argument;
                const parts = name.split(':', 2);
                if (parts.length > 1) {
                    variableName = parts[0];
                    argument = parts[1];
                }
                const variable = this.variableRegistry.getVariable(variableName);
                const resolved = await (variable === null || variable === void 0 ? void 0 : variable.resolve(this.options.context, argument, this.options.configurationSection, this.options.commandIdVariables, this.options.configuration));
                if (typeof resolved === 'bigint' ||
                    typeof resolved === 'boolean' ||
                    typeof resolved === 'number' ||
                    typeof resolved === 'string') {
                    this.resolved.set(name, `${resolved}`);
                }
                else {
                    this.resolved.set(name, undefined);
                }
            }
            catch (e) {
                if ((0, core_1.isCancelled)(e)) {
                    throw e;
                }
                this.resolved.set(name, undefined);
                console.error(`Failed to resolve '${name}' variable:`, e);
            }
        }
    }
    VariableResolverService.Context = Context;
})(VariableResolverService = exports.VariableResolverService || (exports.VariableResolverService = {}));
exports.VariableResolverService = VariableResolverService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/variable-resolver/lib/browser/variable-resolver-service'] = this;


/***/ }),

/***/ "../../packages/variable-resolver/lib/browser/variable.js":
/*!****************************************************************!*\
  !*** ../../packages/variable-resolver/lib/browser/variable.js ***!
  \****************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VariableRegistry = exports.VariableContribution = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
exports.VariableContribution = Symbol('VariableContribution');
/**
 * The variable registry manages variables.
 */
let VariableRegistry = class VariableRegistry {
    constructor() {
        this.variables = new Map();
        this.toDispose = new core_1.DisposableCollection();
    }
    dispose() {
        this.toDispose.dispose();
    }
    /**
     * Register the given variable.
     * Do nothing if a variable is already registered for the given variable name.
     */
    registerVariable(variable) {
        if (this.variables.has(variable.name)) {
            console.warn(`A variables with name ${variable.name} is already registered.`);
            return core_1.Disposable.NULL;
        }
        this.variables.set(variable.name, variable);
        const disposable = {
            dispose: () => this.variables.delete(variable.name)
        };
        this.toDispose.push(disposable);
        return disposable;
    }
    /**
     * Return all registered variables.
     */
    getVariables() {
        return [...this.variables.values()];
    }
    /**
     * Get a variable for the given name or `undefined` if none.
     */
    getVariable(name) {
        return this.variables.get(name);
    }
    /**
     * Register an array of variables.
     * Do nothing if a variable is already registered for the given variable name.
     */
    registerVariables(variables) {
        return variables.map(v => this.registerVariable(v));
    }
};
VariableRegistry = __decorate([
    (0, inversify_1.injectable)()
], VariableRegistry);
exports.VariableRegistry = VariableRegistry;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/variable-resolver/lib/browser/variable'] = this;


/***/ })

}]);
//# sourceMappingURL=packages_variable-resolver_lib_browser_variable-quick-open-service_js.js.map