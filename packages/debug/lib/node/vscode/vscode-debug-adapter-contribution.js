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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractVSCodeDebugAdapterContribution = exports.VSCodeDebuggerContribution = void 0;
/* eslint-disable @theia/localization-check */
const fs = require("@theia/core/shared/fs-extra");
const path = require("path");
const os_1 = require("@theia/core/lib/common/os");
const objects_1 = require("@theia/core/lib/common/objects");
const inversify_1 = require("@theia/core/shared/inversify");
var nls;
(function (nls) {
    function localize(key, _default) {
        return _default;
    }
    nls.localize = localize;
})(nls || (nls = {}));
const INTERNAL_CONSOLE_OPTIONS_SCHEMA = {
    enum: ['neverOpen', 'openOnSessionStart', 'openOnFirstSessionStart'],
    default: 'openOnFirstSessionStart',
    description: nls.localize('internalConsoleOptions', 'Controls when the internal debug console should open.')
};
var VSCodeDebuggerContribution;
(function (VSCodeDebuggerContribution) {
    function toPlatformInfo(executable) {
        if (os_1.isWindows && !process.env.hasOwnProperty('PROCESSOR_ARCHITEW6432')) {
            return executable.winx86 || executable.win || executable.windows;
        }
        if (os_1.isWindows) {
            return executable.win || executable.windows;
        }
        if (os_1.isOSX) {
            return executable.osx;
        }
        return executable.linux;
    }
    VSCodeDebuggerContribution.toPlatformInfo = toPlatformInfo;
})(VSCodeDebuggerContribution = exports.VSCodeDebuggerContribution || (exports.VSCodeDebuggerContribution = {}));
let AbstractVSCodeDebugAdapterContribution = class AbstractVSCodeDebugAdapterContribution {
    constructor(type, extensionPath) {
        this.type = type;
        this.extensionPath = extensionPath;
        this.pckPath = path.join(this.extensionPath, 'package.json');
        this.pck = this.parse();
        this.debuggerContribution = this.resolveDebuggerContribution();
        this.label = this.debuggerContribution.then(({ label }) => label);
        this.languages = this.debuggerContribution.then(({ languages }) => languages);
        this.schemaAttributes = this.resolveSchemaAttributes();
    }
    async parse() {
        let text = await fs.readFile(this.pckPath, 'utf8');
        const nlsPath = path.join(this.extensionPath, 'package.nls.json');
        if (await fs.pathExists(nlsPath)) {
            const nlsMap = await fs.readJSON(nlsPath);
            for (const key of Object.keys(nlsMap)) {
                const value = nlsMap[key].replace(/\"/g, '\\"');
                text = text.split('%' + key + '%').join(value);
            }
        }
        return JSON.parse(text);
    }
    async resolveDebuggerContribution() {
        const pck = await this.pck;
        const debuggerContribution = pck.contributes.debuggers.find(d => d.type === this.type);
        if (!debuggerContribution) {
            throw new Error(`Debugger contribution for '${this.type}' type is not found in ${this.pckPath}`);
        }
        return debuggerContribution;
    }
    async getSchemaAttributes() {
        return this.schemaAttributes || (this.schemaAttributes = this.resolveSchemaAttributes());
    }
    async resolveSchemaAttributes() {
        const debuggerContribution = await this.debuggerContribution;
        if (!debuggerContribution.configurationAttributes) {
            return [];
        }
        const taskSchema = {}; // TODO
        const { configurationAttributes } = debuggerContribution;
        return Object.keys(configurationAttributes).map(request => {
            const attributes = (0, objects_1.deepClone)(configurationAttributes[request]);
            const defaultRequired = ['name', 'type', 'request'];
            attributes.required = attributes.required && attributes.required.length ? defaultRequired.concat(attributes.required) : defaultRequired;
            attributes.additionalProperties = false;
            attributes.type = 'object';
            if (!attributes.properties) {
                attributes.properties = {};
            }
            const properties = attributes.properties;
            properties['type'] = {
                enum: [this.type],
                description: nls.localize('debugType', 'Type of configuration.'),
                pattern: '^(?!node2)',
                errorMessage: nls.localize('debugTypeNotRecognised', 'The debug type is not recognized. Make sure that you have a corresponding debug extension installed and that it is enabled.'),
                patternErrorMessage: nls.localize('node2NotSupported', '"node2" is no longer supported, use "node" instead and set the "protocol" attribute to "inspector".')
            };
            properties['name'] = {
                type: 'string',
                description: nls.localize('debugName', 'Name of configuration; appears in the launch configuration drop down menu.'),
                default: 'Launch'
            };
            properties['request'] = {
                enum: [request],
                description: nls.localize('debugRequest', 'Request type of configuration. Can be "launch" or "attach".'),
            };
            properties['debugServer'] = {
                type: 'number',
                description: nls.localize('debugServer', 'For debug extension development only: if a port is specified VS Code tries to connect to a debug adapter running in server mode'),
                default: 4711
            };
            properties['preLaunchTask'] = {
                anyOf: [taskSchema, {
                        type: ['string'],
                    }],
                default: '',
                defaultSnippets: [{ body: { task: '', type: '' } }],
                description: nls.localize('debugPrelaunchTask', 'Task to run before debug session starts.')
            };
            properties['postDebugTask'] = {
                anyOf: [taskSchema, {
                        type: ['string'],
                    }],
                default: '',
                defaultSnippets: [{ body: { task: '', type: '' } }],
                description: nls.localize('debugPostDebugTask', 'Task to run after debug session ends.')
            };
            properties['internalConsoleOptions'] = INTERNAL_CONSOLE_OPTIONS_SCHEMA;
            const osProperties = Object.assign({}, properties);
            properties['windows'] = {
                type: 'object',
                description: nls.localize('debugWindowsConfiguration', 'Windows specific launch configuration attributes.'),
                properties: osProperties
            };
            properties['osx'] = {
                type: 'object',
                description: nls.localize('debugOSXConfiguration', 'OS X specific launch configuration attributes.'),
                properties: osProperties
            };
            properties['linux'] = {
                type: 'object',
                description: nls.localize('debugLinuxConfiguration', 'Linux specific launch configuration attributes.'),
                properties: osProperties
            };
            Object.keys(attributes.properties).forEach(name => {
                // Use schema allOf property to get independent error reporting #21113
                attributes.properties[name].pattern = attributes.properties[name].pattern || '^(?!.*\\$\\{(env|config|command)\\.)';
                attributes.properties[name].patternErrorMessage = attributes.properties[name].patternErrorMessage ||
                    nls.localize('deprecatedVariables', "'env.', 'config.' and 'command.' are deprecated, use 'env:', 'config:' and 'command:' instead.");
            });
            return attributes;
        });
    }
    async getConfigurationSnippets() {
        const debuggerContribution = await this.debuggerContribution;
        return debuggerContribution.configurationSnippets || [];
    }
    async provideDebugAdapterExecutable() {
        const contribution = await this.debuggerContribution;
        const info = VSCodeDebuggerContribution.toPlatformInfo(contribution);
        let program = (info && info.program || contribution.program);
        if (!program) {
            return undefined;
        }
        program = path.join(this.extensionPath, program);
        const programArgs = info && info.args || contribution.args || [];
        let runtime = info && info.runtime || contribution.runtime;
        if (runtime && runtime.indexOf('./') === 0) {
            runtime = path.join(this.extensionPath, runtime);
        }
        const runtimeArgs = info && info.runtimeArgs || contribution.runtimeArgs || [];
        if (runtime === 'node') {
            const modulePath = program;
            return {
                modulePath: modulePath,
                execArgv: runtimeArgs,
                args: programArgs
            };
        }
        else {
            const command = runtime ? runtime : program;
            const args = runtime ? [...runtimeArgs, program, ...programArgs] : programArgs;
            return {
                command,
                args
            };
        }
    }
};
AbstractVSCodeDebugAdapterContribution = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.unmanaged)()),
    __param(1, (0, inversify_1.unmanaged)()),
    __metadata("design:paramtypes", [String, String])
], AbstractVSCodeDebugAdapterContribution);
exports.AbstractVSCodeDebugAdapterContribution = AbstractVSCodeDebugAdapterContribution;
//# sourceMappingURL=vscode-debug-adapter-contribution.js.map