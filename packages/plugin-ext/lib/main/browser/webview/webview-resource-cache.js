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
exports.WebviewResourceCache = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const promise_util_1 = require("@theia/core/lib/common/promise-util");
/**
 * Browser based cache of webview resources across all instances.
 */
let WebviewResourceCache = class WebviewResourceCache {
    constructor() {
        this.cache = new promise_util_1.Deferred();
        this.resolveCache();
    }
    async resolveCache() {
        try {
            this.cache.resolve(await caches.open('webview:v1'));
        }
        catch (e) {
            console.error('Failed to enable webview caching: ', e);
            this.cache.resolve(undefined);
        }
    }
    async match(url) {
        const cache = await this.cache.promise;
        if (!cache) {
            return undefined;
        }
        const response = await cache.match(url);
        if (!response) {
            return undefined;
        }
        return {
            eTag: response.headers.get('ETag') || undefined,
            body: async () => {
                const buffer = await response.arrayBuffer();
                return new Uint8Array(buffer);
            }
        };
    }
    async delete(url) {
        const cache = await this.cache.promise;
        if (!cache) {
            return false;
        }
        return cache.delete(url);
    }
    async put(url, response) {
        if (!response.eTag) {
            return;
        }
        const cache = await this.cache.promise;
        if (!cache) {
            return;
        }
        const body = await response.body();
        await cache.put(url, new Response(body, {
            status: 200,
            headers: { 'ETag': response.eTag }
        }));
    }
};
WebviewResourceCache = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], WebviewResourceCache);
exports.WebviewResourceCache = WebviewResourceCache;
//# sourceMappingURL=webview-resource-cache.js.map