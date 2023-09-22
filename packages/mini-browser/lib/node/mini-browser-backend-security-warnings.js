"use strict";
// *****************************************************************************
// Copyright (C) 2021 Ericsson and others.
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiniBrowserBackendSecurityWarnings = void 0;
const backend_application_config_provider_1 = require("@theia/core/lib/node/backend-application-config-provider");
const inversify_1 = require("@theia/core/shared/inversify");
const mini_browser_endpoint_1 = require("../common/mini-browser-endpoint");
let MiniBrowserBackendSecurityWarnings = class MiniBrowserBackendSecurityWarnings {
    initialize() {
        this.checkHostPattern();
    }
    async checkHostPattern() {
        if (backend_application_config_provider_1.BackendApplicationConfigProvider.get()['warnOnPotentiallyInsecureHostPattern'] === false) {
            return;
        }
        const envHostPattern = process.env[mini_browser_endpoint_1.MiniBrowserEndpoint.HOST_PATTERN_ENV];
        if (envHostPattern && envHostPattern !== mini_browser_endpoint_1.MiniBrowserEndpoint.HOST_PATTERN_DEFAULT) {
            console.warn(`\
MINI BROWSER SECURITY WARNING

    Changing the @theia/mini-browser host pattern can lead to security vulnerabilities.
        Current pattern: "${envHostPattern}"
    Please read @theia/mini-browser/README.md for more information.
`);
        }
    }
};
MiniBrowserBackendSecurityWarnings = __decorate([
    (0, inversify_1.injectable)()
], MiniBrowserBackendSecurityWarnings);
exports.MiniBrowserBackendSecurityWarnings = MiniBrowserBackendSecurityWarnings;
//# sourceMappingURL=mini-browser-backend-security-warnings.js.map