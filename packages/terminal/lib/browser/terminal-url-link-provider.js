"use strict";
// *****************************************************************************
// Copyright (C) 2022 STMicroelectronics and others.
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
exports.UrlLinkProvider = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/core/lib/browser");
const uri_1 = require("@theia/core/lib/common/uri");
let UrlLinkProvider = class UrlLinkProvider {
    constructor() {
        this.urlRegExp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
        this.localhostRegExp = /(https?:\/\/)?(localhost|127\.0\.0\.1|0\.0\.0\.0)(:[0-9]{1,5})?([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
    }
    async provideLinks(line, terminal) {
        return [...this.matchUrlLinks(line), ...this.matchLocalhostLinks(line)];
    }
    matchUrlLinks(line) {
        const links = [];
        let regExpResult;
        while (regExpResult = this.urlRegExp.exec(line)) {
            const match = regExpResult[0];
            links.push({
                startIndex: this.urlRegExp.lastIndex - match.length,
                length: match.length,
                handle: () => (0, browser_1.open)(this.openerService, new uri_1.default(match)).then()
            });
        }
        return links;
    }
    matchLocalhostLinks(line) {
        const links = [];
        let regExpResult;
        while (regExpResult = this.localhostRegExp.exec(line)) {
            const match = regExpResult[0];
            links.push({
                startIndex: this.localhostRegExp.lastIndex - match.length,
                length: match.length,
                handle: async () => {
                    const uri = match.startsWith('http') ? match : `http://${match}`;
                    (0, browser_1.open)(this.openerService, new uri_1.default(uri));
                }
            });
        }
        return links;
    }
};
__decorate([
    (0, inversify_1.inject)(browser_1.OpenerService),
    __metadata("design:type", Object)
], UrlLinkProvider.prototype, "openerService", void 0);
UrlLinkProvider = __decorate([
    (0, inversify_1.injectable)()
], UrlLinkProvider);
exports.UrlLinkProvider = UrlLinkProvider;
//# sourceMappingURL=terminal-url-link-provider.js.map