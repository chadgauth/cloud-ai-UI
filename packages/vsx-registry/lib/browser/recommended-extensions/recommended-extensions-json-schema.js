"use strict";
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
exports.ExtensionSchemaContribution = exports.extensionsConfigurationSchema = exports.extensionsSchemaID = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const core_1 = require("@theia/core");
const uri_1 = require("@theia/core/lib/common/uri");
const browser_1 = require("@theia/workspace/lib/browser");
exports.extensionsSchemaID = 'vscode://schemas/extensions';
exports.extensionsConfigurationSchema = {
    $id: exports.extensionsSchemaID,
    default: { recommendations: [] },
    type: 'object',
    properties: {
        recommendations: {
            title: 'A list of extensions recommended for users of this workspace. Should use the form "<publisher>.<extension name>"',
            type: 'array',
            items: {
                type: 'string',
                pattern: '^\\w[\\w-]+\\.\\w[\\w-]+$',
                patternErrorMessage: "Expected format '${publisher}.${name}'. Example: 'eclipse.theia'."
            },
            default: [],
        },
        unwantedRecommendations: {
            title: 'A list of extensions recommended by default that should not be recommended to users of this workspace. Should use the form "<publisher>.<extension name>"',
            type: 'array',
            items: {
                type: 'string',
                pattern: '^\\w[\\w-]+\\.\\w[\\w-]+$',
                patternErrorMessage: "Expected format '${publisher}.${name}'. Example: 'eclipse.theia'."
            },
            default: [],
        }
    },
    allowComments: true,
    allowTrailingCommas: true,
};
let ExtensionSchemaContribution = class ExtensionSchemaContribution {
    constructor() {
        this.uri = new uri_1.default(exports.extensionsSchemaID);
    }
    init() {
        this.inmemoryResources.add(this.uri, JSON.stringify(exports.extensionsConfigurationSchema));
    }
    registerSchemas(context) {
        context.registerSchema({
            fileMatch: ['extensions.json'],
            url: this.uri.toString(),
        });
        this.workspaceService.updateSchema('extensions', { $ref: this.uri.toString() });
    }
};
__decorate([
    (0, inversify_1.inject)(core_1.InMemoryResources),
    __metadata("design:type", core_1.InMemoryResources)
], ExtensionSchemaContribution.prototype, "inmemoryResources", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.WorkspaceService),
    __metadata("design:type", browser_1.WorkspaceService)
], ExtensionSchemaContribution.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ExtensionSchemaContribution.prototype, "init", null);
ExtensionSchemaContribution = __decorate([
    (0, inversify_1.injectable)()
], ExtensionSchemaContribution);
exports.ExtensionSchemaContribution = ExtensionSchemaContribution;
//# sourceMappingURL=recommended-extensions-json-schema.js.map