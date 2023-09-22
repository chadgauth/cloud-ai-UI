"use strict";
// *****************************************************************************
// Copyright (C) 2019 Red Hat, Inc. and others.
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
var PluginVsCodeCliContribution_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginVsCodeCliContribution = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const plugin_vscode_types_1 = require("../common/plugin-vscode-types");
const promise_util_1 = require("@theia/core/lib/common/promise-util");
/**
 * CLI Contribution allowing to override the VS Code API version which is returned by `vscode.version` API call.
 */
let PluginVsCodeCliContribution = PluginVsCodeCliContribution_1 = class PluginVsCodeCliContribution {
    constructor() {
        this.vsCodeApiVersionDeferred = new promise_util_1.Deferred();
    }
    get vsCodeApiVersionPromise() {
        return this.vsCodeApiVersionDeferred.promise;
    }
    configure(conf) {
        conf.option(PluginVsCodeCliContribution_1.VSCODE_API_VERSION, {
            // eslint-disable-next-line max-len
            description: `Overrides the version returned by VSCode API 'vscode.version'. Example: --${PluginVsCodeCliContribution_1.VSCODE_API_VERSION}=<Wanted Version>. Default [${plugin_vscode_types_1.VSCODE_DEFAULT_API_VERSION}]`,
            type: 'string',
            nargs: 1
        });
    }
    setArguments(args) {
        var _a;
        const arg = args[PluginVsCodeCliContribution_1.VSCODE_API_VERSION];
        this.vsCodeApiVersion = (arg === null || arg === void 0 ? void 0 : arg.trim()) || ((_a = process.env['VSCODE_API_VERSION']) === null || _a === void 0 ? void 0 : _a.trim()) || plugin_vscode_types_1.VSCODE_DEFAULT_API_VERSION;
        process.env['VSCODE_API_VERSION'] = this.vsCodeApiVersion;
        this.vsCodeApiVersionDeferred.resolve(this.vsCodeApiVersion);
    }
    process(env) {
        if (this.vsCodeApiVersion) {
            env['VSCODE_API_VERSION'] = this.vsCodeApiVersion;
        }
    }
};
/**
 * CLI argument name to define the supported VS Code API version.
 */
PluginVsCodeCliContribution.VSCODE_API_VERSION = 'vscode-api-version';
PluginVsCodeCliContribution = PluginVsCodeCliContribution_1 = __decorate([
    (0, inversify_1.injectable)()
], PluginVsCodeCliContribution);
exports.PluginVsCodeCliContribution = PluginVsCodeCliContribution;
//# sourceMappingURL=plugin-vscode-cli-contribution.js.map