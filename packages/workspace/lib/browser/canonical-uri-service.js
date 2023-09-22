"use strict";
// *****************************************************************************
// Copyright (C) 2023 STMicroelectronics and others.
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
exports.CanonicalUriService = void 0;
const common_1 = require("@theia/core/lib/common");
const inversify_1 = require("@theia/core/shared/inversify");
const vscode_languageserver_protocol_1 = require("@theia/core/shared/vscode-languageserver-protocol");
let CanonicalUriService = class CanonicalUriService {
    constructor() {
        this.providers = new Map();
    }
    registerCanonicalUriProvider(scheme, provider) {
        if (this.providers.has(scheme)) {
            throw new Error(`Canonical URI provider for scheme: '${scheme}' already exists`);
        }
        this.providers.set(scheme, provider);
        return vscode_languageserver_protocol_1.Disposable.create(() => { this.removeCanonicalUriProvider(scheme); });
    }
    removeCanonicalUriProvider(scheme) {
        const provider = this.providers.get(scheme);
        if (!provider) {
            throw new Error(`No Canonical URI provider for scheme: '${scheme}' exists`);
        }
        this.providers.delete(scheme);
        provider.dispose();
    }
    async provideCanonicalUri(uri, targetScheme, token = common_1.CancellationToken.None) {
        const provider = this.providers.get(uri.scheme);
        if (!provider) {
            console.warn(`No Canonical URI provider for scheme: '${uri.scheme}' exists`);
            return undefined;
        }
        return provider.provideCanonicalUri(uri, targetScheme, token);
    }
};
CanonicalUriService = __decorate([
    (0, inversify_1.injectable)()
], CanonicalUriService);
exports.CanonicalUriService = CanonicalUriService;
//# sourceMappingURL=canonical-uri-service.js.map