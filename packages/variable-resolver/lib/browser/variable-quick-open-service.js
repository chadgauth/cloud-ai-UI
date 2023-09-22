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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VariableQuickOpenService = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const message_service_1 = require("@theia/core/lib/common/message-service");
const variable_1 = require("./variable");
const variable_resolver_service_1 = require("./variable-resolver-service");
const browser_1 = require("@theia/core/lib/browser");
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
//# sourceMappingURL=variable-quick-open-service.js.map