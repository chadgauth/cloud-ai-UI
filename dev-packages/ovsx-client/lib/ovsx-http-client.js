"use strict";
// *****************************************************************************
// Copyright (C) 2023 Ericsson and others.
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OVSXHttpClient = void 0;
const request_1 = require("@theia/request");
class OVSXHttpClient {
    constructor(vsxRegistryUrl, requestService) {
        this.vsxRegistryUrl = vsxRegistryUrl;
        this.requestService = requestService;
    }
    /**
     * @param requestService
     * @returns factory that will cache clients based on the requested input URL.
     */
    static createClientFactory(requestService) {
        // eslint-disable-next-line no-null/no-null
        const cachedClients = Object.create(null);
        return url => { var _a; return (_a = cachedClients[url]) !== null && _a !== void 0 ? _a : (cachedClients[url] = new this(url, requestService)); };
    }
    async search(searchOptions) {
        try {
            return await this.requestJson(this.buildUrl('api/-/search', searchOptions));
        }
        catch (err) {
            return {
                error: (err === null || err === void 0 ? void 0 : err.message) || String(err),
                offset: -1,
                extensions: []
            };
        }
    }
    async query(queryOptions) {
        try {
            return await this.requestJson(this.buildUrl('api/-/query', queryOptions));
        }
        catch (error) {
            console.warn(error);
            return {
                extensions: []
            };
        }
    }
    async requestJson(url) {
        return request_1.RequestContext.asJson(await this.requestService.request({
            url,
            headers: { 'Accept': 'application/json' }
        }));
    }
    buildUrl(url, query) {
        return new URL(`${url}${this.buildQueryString(query)}`, this.vsxRegistryUrl).toString();
    }
    buildQueryString(searchQuery) {
        if (!searchQuery) {
            return '';
        }
        let queryString = '';
        for (const [key, value] of Object.entries(searchQuery)) {
            if (typeof value === 'string') {
                queryString += `&${key}=${encodeURIComponent(value)}`;
            }
            else if (typeof value === 'boolean' || typeof value === 'number') {
                queryString += `&${key}=${value}`;
            }
        }
        return queryString && '?' + queryString.slice(1);
    }
}
exports.OVSXHttpClient = OVSXHttpClient;
//# sourceMappingURL=ovsx-http-client.js.map