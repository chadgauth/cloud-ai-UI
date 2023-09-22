"use strict";
// *****************************************************************************
// Copyright (C) 2020 Ericsson and others.
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
exports.MiniBrowserElectronMainContribution = void 0;
const electron_security_token_service_1 = require("@theia/core/lib/electron-main/electron-security-token-service");
const inversify_1 = require("@theia/core/shared/inversify");
const mini_browser_endpoint_1 = require("../common/mini-browser-endpoint");
/**
 * Since the mini-browser might serve content from a new origin,
 * we need to attach the ElectronSecurityToken for the Electron
 * backend to accept HTTP requests.
 */
let MiniBrowserElectronMainContribution = class MiniBrowserElectronMainContribution {
    async onStart(app) {
        const url = this.getMiniBrowserEndpoint(await app.backendPort);
        await this.electronSecurityTokenService.setElectronSecurityTokenCookie(url);
    }
    getMiniBrowserEndpoint(port) {
        var _a;
        const pattern = (_a = process.env[mini_browser_endpoint_1.MiniBrowserEndpoint.HOST_PATTERN_ENV]) !== null && _a !== void 0 ? _a : mini_browser_endpoint_1.MiniBrowserEndpoint.HOST_PATTERN_DEFAULT;
        return 'http://' + pattern.replace('{{hostname}}', `localhost:${port}`);
    }
};
__decorate([
    (0, inversify_1.inject)(electron_security_token_service_1.ElectronSecurityTokenService),
    __metadata("design:type", electron_security_token_service_1.ElectronSecurityTokenService)
], MiniBrowserElectronMainContribution.prototype, "electronSecurityTokenService", void 0);
MiniBrowserElectronMainContribution = __decorate([
    (0, inversify_1.injectable)()
], MiniBrowserElectronMainContribution);
exports.MiniBrowserElectronMainContribution = MiniBrowserElectronMainContribution;
//# sourceMappingURL=mini-browser-electron-main-contribution.js.map