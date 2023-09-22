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
exports.keybindingSchema = exports.KeybindingSchemaUpdater = void 0;
const common_1 = require("@theia/core/lib/common");
const inversify_1 = require("@theia/core/shared/inversify");
const uri_1 = require("@theia/core/lib/common/uri");
let KeybindingSchemaUpdater = class KeybindingSchemaUpdater {
    constructor() {
        this.uri = new uri_1.default(keybindingSchemaId);
    }
    init() {
        this.inMemoryResources.add(new uri_1.default(keybindingSchemaId), '');
        this.updateSchema();
        this.commandRegistry.onCommandsChanged(() => this.updateSchema());
    }
    registerSchemas(store) {
        store.registerSchema({
            fileMatch: ['keybindings.json', 'keymaps.json'],
            url: this.uri.toString(),
        });
    }
    updateSchema() {
        var _a;
        const schema = (0, common_1.deepClone)(exports.keybindingSchema);
        const enumValues = schema.items.allOf[0].properties.command.anyOf[1].enum;
        const enumDescriptions = schema.items.allOf[0].properties.command.anyOf[1].enumDescriptions;
        for (const command of this.commandRegistry.getAllCommands()) {
            if (command.handlers.length > 0 && !command.id.startsWith('_')) {
                enumValues.push(command.id);
                enumDescriptions.push((_a = command.label) !== null && _a !== void 0 ? _a : '');
            }
        }
        this.inMemoryResources.update(this.uri, JSON.stringify(schema));
    }
};
__decorate([
    (0, inversify_1.inject)(common_1.CommandRegistry),
    __metadata("design:type", common_1.CommandRegistry)
], KeybindingSchemaUpdater.prototype, "commandRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.InMemoryResources),
    __metadata("design:type", common_1.InMemoryResources)
], KeybindingSchemaUpdater.prototype, "inMemoryResources", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], KeybindingSchemaUpdater.prototype, "init", null);
KeybindingSchemaUpdater = __decorate([
    (0, inversify_1.injectable)()
], KeybindingSchemaUpdater);
exports.KeybindingSchemaUpdater = KeybindingSchemaUpdater;
const keybindingSchemaId = 'vscode://schemas/keybindings';
exports.keybindingSchema = {
    $id: keybindingSchemaId,
    type: 'array',
    title: 'Keybinding Configuration File',
    default: [],
    definitions: {
        key: { type: 'string', description: common_1.nls.localizeByDefault('Key or key sequence (separated by space)') },
    },
    items: {
        type: 'object',
        defaultSnippets: [{ body: { key: '$1', command: '$2', when: '$3' } }],
        allOf: [
            {
                required: ['command'],
                properties: {
                    command: {
                        anyOf: [{ type: 'string' }, { enum: [], enumDescriptions: [] }], description: common_1.nls.localizeByDefault('Name of the command to execute')
                    },
                    when: { type: 'string', description: common_1.nls.localizeByDefault('Condition when the key is active.') },
                    args: { description: common_1.nls.localizeByDefault('Arguments to pass to the command to execute.') },
                    context: {
                        type: 'string',
                        description: common_1.nls.localizeByDefault('Condition when the key is active.'),
                        deprecationMessage: common_1.nls.localize('theia/keybinding-schema-updater/deprecation', 'Use `when` clause instead.')
                    }
                }
            },
            {
                anyOf: [
                    { required: ['key'], properties: { key: { $ref: '#/definitions/key' }, } },
                    { required: ['keybinding'], properties: { keybinding: { $ref: '#/definitions/key' } } }
                ]
            }
        ]
    },
    allowComments: true,
    allowTrailingCommas: true,
};
//# sourceMappingURL=keybinding-schema-updater.js.map