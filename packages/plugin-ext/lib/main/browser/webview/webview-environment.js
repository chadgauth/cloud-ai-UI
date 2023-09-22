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
exports.WebviewEnvironment = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const endpoint_1 = require("@theia/core/lib/browser/endpoint");
const promise_util_1 = require("@theia/core/lib/common/promise-util");
const env_variables_1 = require("@theia/core/lib/common/env-variables");
const webview_protocol_1 = require("../../common/webview-protocol");
const environment_1 = require("@theia/core/shared/@theia/application-package/lib/environment");
let WebviewEnvironment = class WebviewEnvironment {
    constructor() {
        this.externalEndpointHost = new promise_util_1.Deferred();
    }
    init() {
        this.doInit();
    }
    async doInit() {
        this._hostPatternPromise = this.getHostPattern();
        try {
            const endpointPattern = await this.hostPatternPromise;
            const { host } = new endpoint_1.Endpoint();
            this.externalEndpointHost.resolve(endpointPattern.replace('{{hostname}}', host));
        }
        catch (e) {
            this.externalEndpointHost.reject(e);
        }
    }
    get hostPatternPromise() {
        return this._hostPatternPromise;
    }
    async externalEndpointUrl() {
        const host = await this.externalEndpointHost.promise;
        return new endpoint_1.Endpoint({
            host,
            path: '/webview'
        }).getRestUrl();
    }
    async externalEndpoint() {
        return (await this.externalEndpointUrl()).toString(true);
    }
    async resourceRoot(host) {
        if (host === 'frontend') {
            return (await this.externalEndpointUrl()).withPath('{{path}}').toString(true);
        }
        // Make sure we preserve the scheme of the resource but convert it into a normal path segment
        // The scheme is important as we need to know if we are requesting a local or a remote resource.
        return (await this.externalEndpointUrl()).resolve('theia-resource/{{scheme}}//{{authority}}/{{path}}').toString(true);
    }
    async cspSource() {
        return (await this.externalEndpointUrl()).withPath('').withQuery('').withFragment('').toString(true).replace('{{uuid}}', '*');
    }
    async getHostPattern() {
        return environment_1.environment.electron.is()
            ? webview_protocol_1.WebviewExternalEndpoint.defaultPattern
            : this.environments.getValue(webview_protocol_1.WebviewExternalEndpoint.pattern)
                .then(variable => (variable === null || variable === void 0 ? void 0 : variable.value) || webview_protocol_1.WebviewExternalEndpoint.defaultPattern);
    }
};
__decorate([
    (0, inversify_1.inject)(env_variables_1.EnvVariablesServer),
    __metadata("design:type", Object)
], WebviewEnvironment.prototype, "environments", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WebviewEnvironment.prototype, "init", null);
WebviewEnvironment = __decorate([
    (0, inversify_1.injectable)()
], WebviewEnvironment);
exports.WebviewEnvironment = WebviewEnvironment;
//# sourceMappingURL=webview-environment.js.map