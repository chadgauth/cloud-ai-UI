"use strict";
// *****************************************************************************
// Copyright (C) 2020 TypeFox and others.
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
exports.VSXEnvironmentImpl = void 0;
const uri_1 = require("@theia/core/lib/common/uri");
const inversify_1 = require("@theia/core/shared/inversify");
const plugin_vscode_cli_contribution_1 = require("@theia/plugin-ext-vscode/lib/node/plugin-vscode-cli-contribution");
const vsx_cli_1 = require("./vsx-cli");
let VSXEnvironmentImpl = class VSXEnvironmentImpl {
    constructor() {
        var _a;
        this._registryUri = new uri_1.default(((_a = process.env['VSX_REGISTRY_URL']) === null || _a === void 0 ? void 0 : _a.trim()) || 'https://open-vsx.org');
    }
    async getRegistryUri() {
        return this._registryUri.toString(true);
    }
    async getRegistryApiUri() {
        return this._registryUri.resolve('api').toString(true);
    }
    async getVscodeApiVersion() {
        return this.pluginVscodeCli.vsCodeApiVersionPromise;
    }
    async getOvsxRouterConfig() {
        return this.vsxCli.ovsxRouterConfig;
    }
};
__decorate([
    (0, inversify_1.inject)(plugin_vscode_cli_contribution_1.PluginVsCodeCliContribution),
    __metadata("design:type", plugin_vscode_cli_contribution_1.PluginVsCodeCliContribution)
], VSXEnvironmentImpl.prototype, "pluginVscodeCli", void 0);
__decorate([
    (0, inversify_1.inject)(vsx_cli_1.VsxCli),
    __metadata("design:type", vsx_cli_1.VsxCli)
], VSXEnvironmentImpl.prototype, "vsxCli", void 0);
VSXEnvironmentImpl = __decorate([
    (0, inversify_1.injectable)()
], VSXEnvironmentImpl);
exports.VSXEnvironmentImpl = VSXEnvironmentImpl;
//# sourceMappingURL=vsx-environment-impl.js.map