"use strict";
// *****************************************************************************
// Copyright (C) 2018 Red Hat, Inc. and others.
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
exports.PluginApiContribution = void 0;
const path = require("path");
const url = require("url");
const vhost = require('vhost');
const express = require("@theia/core/shared/express");
const inversify_1 = require("@theia/core/shared/inversify");
const webview_protocol_1 = require("../common/webview-protocol");
const environment_1 = require("@theia/core/shared/@theia/application-package/lib/environment");
const application_package_1 = require("@theia/core/shared/@theia/application-package");
let PluginApiContribution = class PluginApiContribution {
    constructor() {
        this.serveSameOrigin = false;
    }
    init() {
        const webviewExternalEndpoint = this.webviewExternalEndpoint();
        console.log(`Configuring to accept webviews on '${webviewExternalEndpoint}' hostname.`);
        this.webviewExternalEndpointRegExp = new RegExp(webviewExternalEndpoint, 'i');
    }
    configure(app) {
        const webviewApp = express();
        webviewApp.use('/webview', express.static(path.join(this.applicationPackage.projectPath, 'lib', 'webview', 'pre')));
        app.use(vhost(this.webviewExternalEndpointRegExp, webviewApp));
    }
    allowWsUpgrade(request) {
        if (request.headers.origin && !this.serveSameOrigin) {
            const origin = url.parse(request.headers.origin);
            if (origin.host && this.webviewExternalEndpointRegExp.test(origin.host)) {
                // If the origin comes from the WebViews, refuse:
                return false;
            }
        }
        return true;
    }
    webviewExternalEndpointPattern() {
        let endpointPattern;
        if (environment_1.environment.electron.is()) {
            endpointPattern = webview_protocol_1.WebviewExternalEndpoint.defaultPattern;
        }
        else {
            endpointPattern = process.env[webview_protocol_1.WebviewExternalEndpoint.pattern] || webview_protocol_1.WebviewExternalEndpoint.defaultPattern;
        }
        if (endpointPattern === '{{hostname}}') {
            this.serveSameOrigin = true;
        }
        return endpointPattern;
    }
    /**
     * Returns a RegExp pattern matching the expected WebView endpoint's host.
     */
    webviewExternalEndpoint() {
        return `^${this.webviewExternalEndpointPattern()
            .replace(/\./g, '\\.')
            .replace('{{uuid}}', '.+')
            .replace('{{hostname}}', '.+')}$`;
    }
};
__decorate([
    (0, inversify_1.inject)(application_package_1.ApplicationPackage),
    __metadata("design:type", application_package_1.ApplicationPackage)
], PluginApiContribution.prototype, "applicationPackage", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PluginApiContribution.prototype, "init", null);
PluginApiContribution = __decorate([
    (0, inversify_1.injectable)()
], PluginApiContribution);
exports.PluginApiContribution = PluginApiContribution;
//# sourceMappingURL=plugin-service.js.map