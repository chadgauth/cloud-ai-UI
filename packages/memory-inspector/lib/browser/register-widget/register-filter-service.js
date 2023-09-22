"use strict";
/********************************************************************************
 * Copyright (C) 2021 Ericsson and others.
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterFilterServiceImpl = exports.RegisterFilterServiceOptions = exports.RegisterFilterService = exports.AllOrCustom = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
var AllOrCustom;
(function (AllOrCustom) {
    AllOrCustom["All"] = "All";
    AllOrCustom["Custom"] = "Custom";
})(AllOrCustom = exports.AllOrCustom || (exports.AllOrCustom = {}));
exports.RegisterFilterService = Symbol('RegisterFilterService');
exports.RegisterFilterServiceOptions = Symbol('RegisterFilterServiceOptions');
let RegisterFilterServiceImpl = class RegisterFilterServiceImpl {
    constructor() {
        this.filters = new Map();
        this.currentFilter = AllOrCustom.All;
    }
    get filterLabels() {
        return [...this.filters.keys()];
    }
    get currentFilterLabel() {
        return this.currentFilter;
    }
    init() {
        this.filters.set(AllOrCustom.All, undefined);
        this.filters.set(AllOrCustom.Custom, new Set());
        for (const [key, values] of Object.entries(this.options)) {
            this.filters.set(key, new Set(values));
        }
    }
    setFilter(filterLabel) {
        if (this.filters.has(filterLabel)) {
            this.currentFilter = filterLabel;
        }
    }
    shouldDisplayRegister(registerName) {
        const currentFilter = this.filters.get(this.currentFilter);
        return !currentFilter || currentFilter.has(registerName);
    }
    currentFilterRegisters() {
        const currentFilterRegisters = this.filters.get(this.currentFilter);
        return currentFilterRegisters ? Array.from(currentFilterRegisters) : [];
    }
};
__decorate([
    (0, inversify_1.inject)(exports.RegisterFilterServiceOptions),
    __metadata("design:type", Object)
], RegisterFilterServiceImpl.prototype, "options", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RegisterFilterServiceImpl.prototype, "init", null);
RegisterFilterServiceImpl = __decorate([
    (0, inversify_1.injectable)()
], RegisterFilterServiceImpl);
exports.RegisterFilterServiceImpl = RegisterFilterServiceImpl;
//# sourceMappingURL=register-filter-service.js.map