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
Object.defineProperty(exports, "__esModule", { value: true });
exports.launchSchemaId = exports.DebugSchemaUpdater = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const common_1 = require("@theia/core/lib/common");
const uri_1 = require("@theia/core/lib/common/uri");
const debug_service_1 = require("../common/debug-service");
const debug_preferences_1 = require("./debug-preferences");
const variable_input_schema_1 = require("@theia/variable-resolver/lib/browser/variable-input-schema");
const browser_1 = require("@theia/workspace/lib/browser");
const debug_compound_1 = require("../common/debug-compound");
let DebugSchemaUpdater = class DebugSchemaUpdater {
    constructor() {
        this.uri = new uri_1.default(exports.launchSchemaId);
    }
    init() {
        this.inmemoryResources.add(this.uri, '');
    }
    registerSchemas(context) {
        context.registerSchema({
            fileMatch: ['launch.json'],
            url: this.uri.toString()
        });
        this.workspaceService.updateSchema('launch', { $ref: this.uri.toString() });
    }
    async update() {
        const types = await this.debug.debugTypes();
        const schema = { ...(0, common_1.deepClone)(launchSchema) };
        const items = schema.properties['configurations'].items;
        const attributePromises = types.map(type => this.debug.getSchemaAttributes(type));
        for (const attributes of await Promise.all(attributePromises)) {
            for (const attribute of attributes) {
                const properties = {};
                for (const key of ['debugViewLocation', 'openDebug', 'internalConsoleOptions']) {
                    properties[key] = debug_preferences_1.debugPreferencesSchema.properties[`debug.${key}`];
                }
                attribute.properties = Object.assign(properties, attribute.properties);
                items.oneOf.push(attribute);
            }
        }
        items.defaultSnippets.push(...await this.debug.getConfigurationSnippets());
        const contents = JSON.stringify(schema);
        this.inmemoryResources.update(this.uri, contents);
    }
};
__decorate([
    (0, inversify_1.inject)(common_1.InMemoryResources),
    __metadata("design:type", common_1.InMemoryResources)
], DebugSchemaUpdater.prototype, "inmemoryResources", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.WorkspaceService),
    __metadata("design:type", browser_1.WorkspaceService)
], DebugSchemaUpdater.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(debug_service_1.DebugService),
    __metadata("design:type", Object)
], DebugSchemaUpdater.prototype, "debug", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DebugSchemaUpdater.prototype, "init", null);
DebugSchemaUpdater = __decorate([
    (0, inversify_1.injectable)()
], DebugSchemaUpdater);
exports.DebugSchemaUpdater = DebugSchemaUpdater;
exports.launchSchemaId = 'vscode://schemas/launch';
const launchSchema = {
    $id: exports.launchSchemaId,
    type: 'object',
    title: common_1.nls.localizeByDefault('Launch'),
    required: [],
    default: { version: '0.2.0', configurations: [], compounds: [] },
    properties: {
        version: {
            type: 'string',
            description: common_1.nls.localizeByDefault('Version of this file format.'),
            default: '0.2.0'
        },
        configurations: {
            type: 'array',
            description: common_1.nls.localizeByDefault('List of configurations. Add new configurations or edit existing ones by using IntelliSense.'),
            items: {
                defaultSnippets: [],
                'type': 'object',
                oneOf: []
            }
        },
        compounds: {
            type: 'array',
            description: common_1.nls.localizeByDefault('List of compounds. Each compound references multiple configurations which will get launched together.'),
            items: {
                type: 'object',
                required: ['name', 'configurations'],
                properties: {
                    name: {
                        type: 'string',
                        description: common_1.nls.localizeByDefault('Name of compound. Appears in the launch configuration drop down menu.')
                    },
                    configurations: {
                        type: 'array',
                        default: [],
                        items: {
                            oneOf: [{
                                    type: 'string',
                                    description: common_1.nls.localizeByDefault('Please use unique configuration names.')
                                }, {
                                    type: 'object',
                                    required: ['name'],
                                    properties: {
                                        name: {
                                            enum: [],
                                            description: common_1.nls.localizeByDefault('Name of compound. Appears in the launch configuration drop down menu.')
                                        },
                                        folder: {
                                            enum: [],
                                            description: common_1.nls.localizeByDefault('Name of folder in which the compound is located.')
                                        }
                                    }
                                }]
                        },
                        description: common_1.nls.localizeByDefault('Names of configurations that will be started as part of this compound.')
                    },
                    stopAll: {
                        type: 'boolean',
                        default: false,
                        description: common_1.nls.localizeByDefault('Controls whether manually terminating one session will stop all of the compound sessions.')
                    },
                    preLaunchTask: {
                        type: 'string',
                        default: '',
                        description: common_1.nls.localizeByDefault('Task to run before any of the compound configurations start.')
                    }
                },
                default: debug_compound_1.defaultCompound
            },
            default: [debug_compound_1.defaultCompound]
        },
        inputs: variable_input_schema_1.inputsSchema.definitions.inputs
    },
    allowComments: true,
    allowTrailingCommas: true,
};
//# sourceMappingURL=debug-schema-updater.js.map