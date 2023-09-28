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
exports.TypeHierarchyServiceProvider = exports.TypeHierarchyService = void 0;
const common_1 = require("@theia/core/lib/common");
const inversify_1 = require("@theia/core/shared/inversify");
const language_selector_1 = require("@theia/editor/lib/common/language-selector");
exports.TypeHierarchyService = Symbol('TypeHierarchyService');
let TypeHierarchyServiceProvider = class TypeHierarchyServiceProvider {
    constructor() {
        this.onDidChangeEmitter = new common_1.Emitter();
        this.services = [];
    }
    get onDidChange() {
        return this.onDidChangeEmitter.event;
    }
    init() {
        this.services = this.services.concat(this.contributions.getContributions());
    }
    get(languageId, uri) {
        return this.services
            .filter(service => this.score(service, languageId, uri) > 0)
            .sort((left, right) => this.score(right, languageId, uri) - this.score(left, languageId, uri))[0];
    }
    score(service, languageId, uri) {
        return (0, language_selector_1.score)(service.selector, uri.scheme, uri.path.toString(), languageId, true);
    }
    add(service) {
        this.services.push(service);
        const that = this;
        this.onDidChangeEmitter.fire();
        return {
            dispose: () => {
                that.remove(service);
            }
        };
    }
    remove(service) {
        const length = this.services.length;
        this.services = this.services.filter(value => value !== service);
        const serviceWasRemoved = length !== this.services.length;
        if (serviceWasRemoved) {
            this.onDidChangeEmitter.fire();
        }
        return serviceWasRemoved;
    }
};
__decorate([
    (0, inversify_1.inject)(common_1.ContributionProvider),
    (0, inversify_1.named)(exports.TypeHierarchyService),
    __metadata("design:type", Object)
], TypeHierarchyServiceProvider.prototype, "contributions", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TypeHierarchyServiceProvider.prototype, "init", null);
TypeHierarchyServiceProvider = __decorate([
    (0, inversify_1.injectable)()
], TypeHierarchyServiceProvider);
exports.TypeHierarchyServiceProvider = TypeHierarchyServiceProvider;
//# sourceMappingURL=typehierarchy-service.js.map