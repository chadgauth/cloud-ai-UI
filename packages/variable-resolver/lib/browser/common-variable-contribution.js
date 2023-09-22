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
exports.CommonVariableContribution = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const application_protocol_1 = require("@theia/core/lib/common/application-protocol");
const env_variables_1 = require("@theia/core/lib/common/env-variables");
const command_1 = require("@theia/core/lib/common/command");
const os_1 = require("@theia/core/lib/common/os");
const preference_service_1 = require("@theia/core/lib/browser/preferences/preference-service");
const resource_context_key_1 = require("@theia/core/lib/browser/resource-context-key");
const browser_1 = require("@theia/core/lib/browser");
const cancellation_1 = require("@theia/core/lib/common/cancellation");
const uri_1 = require("@theia/core/lib/common/uri");
let CommonVariableContribution = class CommonVariableContribution {
    async registerVariables(variables) {
        const execPath = await this.env.getExecPath();
        variables.registerVariable({
            name: 'execPath',
            resolve: () => execPath
        });
        variables.registerVariable({
            name: 'pathSeparator',
            resolve: () => os_1.OS.backend.isWindows ? '\\' : '/'
        });
        variables.registerVariable({
            name: 'env',
            resolve: async (_, envVariableName) => {
                const envVariable = envVariableName && await this.env.getValue(envVariableName);
                const envValue = envVariable && envVariable.value;
                return envValue || '';
            }
        });
        variables.registerVariable({
            name: 'config',
            resolve: (resourceUri = new uri_1.default(this.resourceContextKey.get()), preferenceName) => {
                if (!preferenceName) {
                    return undefined;
                }
                return this.preferences.get(preferenceName, undefined, resourceUri && resourceUri.toString());
            }
        });
        variables.registerVariable({
            name: 'command',
            resolve: async (contextUri, commandId, configurationSection, commandIdVariables, configuration) => {
                if (commandId) {
                    if (commandIdVariables === null || commandIdVariables === void 0 ? void 0 : commandIdVariables[commandId]) {
                        commandId = commandIdVariables[commandId];
                    }
                    const result = await this.commands.executeCommand(commandId, configuration);
                    // eslint-disable-next-line no-null/no-null
                    if (result === null) {
                        throw (0, cancellation_1.cancelled)();
                    }
                    return result;
                }
            }
        });
        variables.registerVariable({
            name: 'input',
            resolve: async (resourceUri = new uri_1.default(this.resourceContextKey.get()), variable, section) => {
                var _a, _b;
                if (!variable || !section) {
                    return undefined;
                }
                const configuration = this.preferences.get(section, undefined, resourceUri && resourceUri.toString());
                const inputs = !!configuration && 'inputs' in configuration ? configuration.inputs : undefined;
                const input = Array.isArray(inputs) && inputs.find(item => !!item && item.id === variable);
                if (!input) {
                    return undefined;
                }
                if (input.type === 'promptString') {
                    if (typeof input.description !== 'string') {
                        return undefined;
                    }
                    return (_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.input({
                        prompt: input.description,
                        value: input.default
                    });
                }
                if (input.type === 'pickString') {
                    if (typeof input.description !== 'string' || !Array.isArray(input.options)) {
                        return undefined;
                    }
                    const elements = [];
                    for (const option of input.options) {
                        if (typeof option !== 'string') {
                            return undefined;
                        }
                        if (option === input.default) {
                            elements.unshift({
                                description: 'Default',
                                label: option,
                                value: option
                            });
                        }
                        else {
                            elements.push({
                                label: option,
                                value: option
                            });
                        }
                    }
                    const selectedPick = await ((_b = this.quickInputService) === null || _b === void 0 ? void 0 : _b.showQuickPick(elements, { placeholder: input.description }));
                    return selectedPick === null || selectedPick === void 0 ? void 0 : selectedPick.value;
                }
                if (input.type === 'command') {
                    if (typeof input.command !== 'string') {
                        return undefined;
                    }
                    return this.commands.executeCommand(input.command, input.args);
                }
                return undefined;
            }
        });
    }
};
__decorate([
    (0, inversify_1.inject)(env_variables_1.EnvVariablesServer),
    __metadata("design:type", Object)
], CommonVariableContribution.prototype, "env", void 0);
__decorate([
    (0, inversify_1.inject)(command_1.CommandService),
    __metadata("design:type", Object)
], CommonVariableContribution.prototype, "commands", void 0);
__decorate([
    (0, inversify_1.inject)(preference_service_1.PreferenceService),
    __metadata("design:type", Object)
], CommonVariableContribution.prototype, "preferences", void 0);
__decorate([
    (0, inversify_1.inject)(resource_context_key_1.ResourceContextKey),
    __metadata("design:type", resource_context_key_1.ResourceContextKey)
], CommonVariableContribution.prototype, "resourceContextKey", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.QuickInputService),
    (0, inversify_1.optional)(),
    __metadata("design:type", Object)
], CommonVariableContribution.prototype, "quickInputService", void 0);
__decorate([
    (0, inversify_1.inject)(application_protocol_1.ApplicationServer),
    __metadata("design:type", Object)
], CommonVariableContribution.prototype, "appServer", void 0);
CommonVariableContribution = __decorate([
    (0, inversify_1.injectable)()
], CommonVariableContribution);
exports.CommonVariableContribution = CommonVariableContribution;
//# sourceMappingURL=common-variable-contribution.js.map