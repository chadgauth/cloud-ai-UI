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
exports.VariableResolverFrontendContribution = exports.LIST_VARIABLES = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const common_1 = require("@theia/core/lib/common");
const variable_1 = require("./variable");
const variable_quick_open_service_1 = require("./variable-quick-open-service");
exports.LIST_VARIABLES = {
    id: 'variable.list',
    label: 'Variable: List All'
};
let VariableResolverFrontendContribution = class VariableResolverFrontendContribution {
    constructor(contributionProvider, variableRegistry, variableQuickOpenService) {
        this.contributionProvider = contributionProvider;
        this.variableRegistry = variableRegistry;
        this.variableQuickOpenService = variableQuickOpenService;
    }
    onStart() {
        this.contributionProvider.getContributions().forEach(contrib => contrib.registerVariables(this.variableRegistry));
    }
    registerCommands(commands) {
        commands.registerCommand(exports.LIST_VARIABLES, {
            isEnabled: () => true,
            execute: () => this.variableQuickOpenService.open()
        });
    }
};
VariableResolverFrontendContribution = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(common_1.ContributionProvider)),
    __param(0, (0, inversify_1.named)(variable_1.VariableContribution)),
    __param(1, (0, inversify_1.inject)(variable_1.VariableRegistry)),
    __param(2, (0, inversify_1.inject)(variable_quick_open_service_1.VariableQuickOpenService)),
    __metadata("design:paramtypes", [Object, variable_1.VariableRegistry,
        variable_quick_open_service_1.VariableQuickOpenService])
], VariableResolverFrontendContribution);
exports.VariableResolverFrontendContribution = VariableResolverFrontendContribution;
//# sourceMappingURL=variable-resolver-frontend-contribution.js.map