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
exports.MiniBrowserEnvironment = void 0;
const browser_1 = require("@theia/core/lib/browser");
const env_variables_1 = require("@theia/core/lib/common/env-variables");
const environment_1 = require("@theia/core/shared/@theia/application-package/lib/environment");
const inversify_1 = require("@theia/core/shared/inversify");
const uuid_1 = require("uuid");
const mini_browser_endpoint_1 = require("../../common/mini-browser-endpoint");
/**
 * Fetch values from the backend's environment and caches them locally.
 * Helps with deploying various mini-browser endpoints.
 */
let MiniBrowserEnvironment = class MiniBrowserEnvironment {
    init() {
        this._hostPatternPromise = this.getHostPattern()
            .then(pattern => this._hostPattern = pattern);
    }
    get hostPatternPromise() {
        return this._hostPatternPromise;
    }
    get hostPattern() {
        return this._hostPattern;
    }
    async onStart() {
        await this._hostPatternPromise;
    }
    /**
     * Throws if `hostPatternPromise` is not yet resolved.
     */
    getEndpoint(uuid, hostname) {
        if (this._hostPattern === undefined) {
            throw new Error('MiniBrowserEnvironment is not finished initializing');
        }
        return new browser_1.Endpoint({
            path: mini_browser_endpoint_1.MiniBrowserEndpoint.PATH,
            host: this._hostPattern
                .replace('{{uuid}}', uuid)
                .replace('{{hostname}}', hostname || this.getDefaultHostname()),
        });
    }
    /**
     * Throws if `hostPatternPromise` is not yet resolved.
     */
    getRandomEndpoint() {
        return this.getEndpoint((0, uuid_1.v4)());
    }
    async getHostPattern() {
        return environment_1.environment.electron.is()
            ? mini_browser_endpoint_1.MiniBrowserEndpoint.HOST_PATTERN_DEFAULT
            : this.environment.getValue(mini_browser_endpoint_1.MiniBrowserEndpoint.HOST_PATTERN_ENV)
                .then(envVar => (envVar === null || envVar === void 0 ? void 0 : envVar.value) || mini_browser_endpoint_1.MiniBrowserEndpoint.HOST_PATTERN_DEFAULT);
    }
    getDefaultHostname() {
        return self.location.host;
    }
};
__decorate([
    (0, inversify_1.inject)(env_variables_1.EnvVariablesServer),
    __metadata("design:type", Object)
], MiniBrowserEnvironment.prototype, "environment", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MiniBrowserEnvironment.prototype, "init", null);
MiniBrowserEnvironment = __decorate([
    (0, inversify_1.injectable)()
], MiniBrowserEnvironment);
exports.MiniBrowserEnvironment = MiniBrowserEnvironment;
//# sourceMappingURL=mini-browser-environment.js.map