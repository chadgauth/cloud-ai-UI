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
exports.ElectronGitEnvProvider = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const git_env_provider_1 = require("../../node/env/git-env-provider");
const askpass_1 = require("../askpass/askpass");
/**
 * Git environment provider for Electron.
 *
 * This Git environment provider is customized for the Electron-based application. It sets the `GIT_ASKPASS` environment variable, to run
 * a custom script for the authentication.
 */
let ElectronGitEnvProvider = class ElectronGitEnvProvider extends git_env_provider_1.DefaultGitEnvProvider {
    init() {
        super.init();
        this.toDispose.push(this.askpass);
    }
    async getEnv() {
        if (!this._env) {
            this._env = this.askpass.getEnv();
        }
        return this._env;
    }
};
__decorate([
    (0, inversify_1.inject)(askpass_1.Askpass),
    __metadata("design:type", askpass_1.Askpass)
], ElectronGitEnvProvider.prototype, "askpass", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ElectronGitEnvProvider.prototype, "init", null);
ElectronGitEnvProvider = __decorate([
    (0, inversify_1.injectable)()
], ElectronGitEnvProvider);
exports.ElectronGitEnvProvider = ElectronGitEnvProvider;
//# sourceMappingURL=electron-git-env-provider.js.map