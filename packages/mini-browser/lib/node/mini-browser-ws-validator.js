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
exports.MiniBrowserWsRequestValidator = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const url = require("url");
const mini_browser_endpoint_1 = require("../common/mini-browser-endpoint");
/**
 * Prevents explicit WebSocket connections from the mini-browser virtual host.
 */
let MiniBrowserWsRequestValidator = class MiniBrowserWsRequestValidator {
    constructor() {
        this.serveSameOrigin = false;
    }
    init() {
        const pattern = process.env[mini_browser_endpoint_1.MiniBrowserEndpoint.HOST_PATTERN_ENV] || mini_browser_endpoint_1.MiniBrowserEndpoint.HOST_PATTERN_DEFAULT;
        if (pattern === '{{hostname}}') {
            this.serveSameOrigin = true;
        }
        const vhostRe = pattern
            .replace(/\./g, '\\.')
            .replace('{{uuid}}', '.+')
            .replace('{{hostname}}', '.+');
        this.miniBrowserHostRe = new RegExp(vhostRe, 'i');
    }
    async allowWsUpgrade(request) {
        if (request.headers.origin && !this.serveSameOrigin) {
            const origin = url.parse(request.headers.origin);
            if (origin.host && this.miniBrowserHostRe.test(origin.host)) {
                // If the origin comes from the WebViews, refuse:
                return false;
            }
        }
        return true;
    }
};
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MiniBrowserWsRequestValidator.prototype, "init", null);
MiniBrowserWsRequestValidator = __decorate([
    (0, inversify_1.injectable)()
], MiniBrowserWsRequestValidator);
exports.MiniBrowserWsRequestValidator = MiniBrowserWsRequestValidator;
//# sourceMappingURL=mini-browser-ws-validator.js.map