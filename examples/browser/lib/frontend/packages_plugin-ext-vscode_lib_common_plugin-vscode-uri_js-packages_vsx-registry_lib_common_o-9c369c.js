"use strict";
(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_plugin-ext-vscode_lib_common_plugin-vscode-uri_js-packages_vsx-registry_lib_common_o-9c369c"],{

/***/ "../../dev-packages/ovsx-client/lib/index.js":
/*!***************************************************!*\
  !*** ../../dev-packages/ovsx-client/lib/index.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OVSXRouterClient = exports.OVSXMockClient = exports.OVSXHttpClient = exports.OVSXApiFilterImpl = exports.OVSXApiFilter = void 0;
var ovsx_api_filter_1 = __webpack_require__(/*! ./ovsx-api-filter */ "../../dev-packages/ovsx-client/lib/ovsx-api-filter.js");
Object.defineProperty(exports, "OVSXApiFilter", ({ enumerable: true, get: function () { return ovsx_api_filter_1.OVSXApiFilter; } }));
Object.defineProperty(exports, "OVSXApiFilterImpl", ({ enumerable: true, get: function () { return ovsx_api_filter_1.OVSXApiFilterImpl; } }));
var ovsx_http_client_1 = __webpack_require__(/*! ./ovsx-http-client */ "../../dev-packages/ovsx-client/lib/ovsx-http-client.js");
Object.defineProperty(exports, "OVSXHttpClient", ({ enumerable: true, get: function () { return ovsx_http_client_1.OVSXHttpClient; } }));
var ovsx_mock_client_1 = __webpack_require__(/*! ./ovsx-mock-client */ "../../dev-packages/ovsx-client/lib/ovsx-mock-client.js");
Object.defineProperty(exports, "OVSXMockClient", ({ enumerable: true, get: function () { return ovsx_mock_client_1.OVSXMockClient; } }));
var ovsx_router_client_1 = __webpack_require__(/*! ./ovsx-router-client */ "../../dev-packages/ovsx-client/lib/ovsx-router-client.js");
Object.defineProperty(exports, "OVSXRouterClient", ({ enumerable: true, get: function () { return ovsx_router_client_1.OVSXRouterClient; } }));
__exportStar(__webpack_require__(/*! ./ovsx-router-filters */ "../../dev-packages/ovsx-client/lib/ovsx-router-filters/index.js"), exports);
__exportStar(__webpack_require__(/*! ./ovsx-types */ "../../dev-packages/ovsx-client/lib/ovsx-types.js"), exports);


/***/ }),

/***/ "../../dev-packages/ovsx-client/lib/ovsx-api-filter.js":
/*!*************************************************************!*\
  !*** ../../dev-packages/ovsx-client/lib/ovsx-api-filter.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OVSXApiFilterImpl = exports.OVSXApiFilter = void 0;
const semver = __webpack_require__(/*! semver */ "../../node_modules/semver/index.js");
const ovsx_types_1 = __webpack_require__(/*! ./ovsx-types */ "../../dev-packages/ovsx-client/lib/ovsx-types.js");
exports.OVSXApiFilter = Symbol('OVSXApiFilter');
class OVSXApiFilterImpl {
    constructor(supportedApiVersion) {
        this.supportedApiVersion = supportedApiVersion;
    }
    getLatestCompatibleExtension(extensions) {
        if (extensions.length === 0) {
            return;
        }
        else if (this.isBuiltinNamespace(extensions[0].namespace.toLowerCase())) {
            return extensions.find(extension => this.versionGreaterThanOrEqualTo(extension.version, this.supportedApiVersion));
        }
        else {
            return extensions.find(extension => { var _a, _b; return this.supportedVscodeApiSatisfies((_b = (_a = extension.engines) === null || _a === void 0 ? void 0 : _a.vscode) !== null && _b !== void 0 ? _b : '*'); });
        }
    }
    getLatestCompatibleVersion(searchEntry) {
        function getLatestCompatibleVersion(predicate) {
            if (searchEntry.allVersions) {
                return searchEntry.allVersions.find(predicate);
            }
            // If the allVersions field is missing then try to use the
            // searchEntry as VSXAllVersions and check if it's compatible:
            if (predicate(searchEntry)) {
                return searchEntry;
            }
        }
        if (this.isBuiltinNamespace(searchEntry.namespace)) {
            return getLatestCompatibleVersion(allVersions => this.versionGreaterThanOrEqualTo(allVersions.version, this.supportedApiVersion));
        }
        else {
            return getLatestCompatibleVersion(allVersions => { var _a, _b; return this.supportedVscodeApiSatisfies((_b = (_a = allVersions.engines) === null || _a === void 0 ? void 0 : _a.vscode) !== null && _b !== void 0 ? _b : '*'); });
        }
    }
    isBuiltinNamespace(namespace) {
        return ovsx_types_1.VSXBuiltinNamespaces.is(namespace);
    }
    /**
     * @returns `a >= b`
     */
    versionGreaterThanOrEqualTo(a, b) {
        const versionA = semver.clean(a);
        const versionB = semver.clean(b);
        if (!versionA || !versionB) {
            return false;
        }
        return semver.lte(versionA, versionB);
    }
    supportedVscodeApiSatisfies(vscodeApiRange) {
        return semver.satisfies(this.supportedApiVersion, vscodeApiRange);
    }
}
exports.OVSXApiFilterImpl = OVSXApiFilterImpl;


/***/ }),

/***/ "../../dev-packages/ovsx-client/lib/ovsx-http-client.js":
/*!**************************************************************!*\
  !*** ../../dev-packages/ovsx-client/lib/ovsx-http-client.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OVSXHttpClient = void 0;
const request_1 = __webpack_require__(/*! @theia/request */ "../../dev-packages/request/lib/index.js");
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


/***/ }),

/***/ "../../dev-packages/ovsx-client/lib/ovsx-mock-client.js":
/*!**************************************************************!*\
  !*** ../../dev-packages/ovsx-client/lib/ovsx-mock-client.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, exports) => {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OVSXMockClient = void 0;
/**
 * Querying will only find exact matches.
 * Searching will try to find the query string in various fields.
 */
class OVSXMockClient {
    constructor(extensions = []) {
        this.extensions = extensions;
    }
    setExtensions(extensions) {
        this.extensions = extensions;
        return this;
    }
    /**
     * @param baseUrl required to construct the URLs required by {@link VSXExtensionRaw}.
     * @param ids list of ids to generate {@link VSXExtensionRaw} from.
     */
    setExtensionsFromIds(baseUrl, ids) {
        const now = Date.now();
        const url = new OVSXMockClient.UrlBuilder(baseUrl);
        this.extensions = ids.map((extension, i) => {
            const [id, version = '0.0.1'] = extension.split('@', 2);
            const [namespace, name] = id.split('.', 2);
            return {
                allVersions: {
                    [version]: url.extensionUrl(namespace, name, `/${version}`)
                },
                displayName: name,
                downloadCount: 0,
                files: {
                    download: url.extensionFileUrl(namespace, name, version, `/${id}-${version}.vsix`)
                },
                name,
                namespace,
                namespaceAccess: 'public',
                namespaceUrl: url.namespaceUrl(namespace),
                publishedBy: {
                    loginName: 'mock'
                },
                reviewCount: 0,
                reviewsUrl: url.extensionReviewsUrl(namespace, name),
                timestamp: new Date(now - ids.length + i + 1).toISOString(),
                version,
                description: `Mock VS Code Extension for ${id}`
            };
        });
        return this;
    }
    async query(queryOptions) {
        return {
            extensions: this.extensions
                .filter(extension => typeof queryOptions === 'object' && (this.compare(queryOptions.extensionId, this.id(extension)) &&
                this.compare(queryOptions.extensionName, extension.name) &&
                this.compare(queryOptions.extensionVersion, extension.version) &&
                this.compare(queryOptions.namespaceName, extension.namespace)))
        };
    }
    async search(searchOptions) {
        var _a, _b;
        const query = searchOptions === null || searchOptions === void 0 ? void 0 : searchOptions.query;
        const offset = (_a = searchOptions === null || searchOptions === void 0 ? void 0 : searchOptions.offset) !== null && _a !== void 0 ? _a : 0;
        const size = (_b = searchOptions === null || searchOptions === void 0 ? void 0 : searchOptions.size) !== null && _b !== void 0 ? _b : 18;
        const end = offset + size;
        return {
            offset,
            extensions: this.extensions
                .filter(extension => typeof query !== 'string' || (this.includes(query, this.id(extension)) ||
                this.includes(query, extension.description) ||
                this.includes(query, extension.displayName)))
                .sort((a, b) => this.sort(a, b, searchOptions))
                .filter((extension, i) => i >= offset && i < end)
                .map(extension => ({
                downloadCount: extension.downloadCount,
                files: extension.files,
                name: extension.name,
                namespace: extension.namespace,
                timestamp: extension.timestamp,
                url: `${extension.namespaceUrl}/${extension.name}`,
                version: extension.version,
            }))
        };
    }
    id(extension) {
        return `${extension.namespace}.${extension.name}`;
    }
    /**
     * Case sensitive.
     */
    compare(expected, value) {
        return expected === undefined || value === undefined || expected === value;
    }
    /**
     * Case insensitive.
     */
    includes(needle, value) {
        return value === undefined || value.toLowerCase().includes(needle.toLowerCase());
    }
    sort(a, b, searchOptions) {
        var _a, _b, _c, _d;
        let order = 0;
        const sortBy = (_a = searchOptions === null || searchOptions === void 0 ? void 0 : searchOptions.sortBy) !== null && _a !== void 0 ? _a : 'relevance';
        const sortOrder = (_b = searchOptions === null || searchOptions === void 0 ? void 0 : searchOptions.sortOrder) !== null && _b !== void 0 ? _b : 'desc';
        if (sortBy === 'averageRating') {
            order = ((_c = a.averageRating) !== null && _c !== void 0 ? _c : -1) - ((_d = b.averageRating) !== null && _d !== void 0 ? _d : -1);
        }
        else if (sortBy === 'downloadCount') {
            order = a.downloadCount - b.downloadCount;
        }
        else if (sortBy === 'relevance') {
            order = 0;
        }
        else if (sortBy === 'timestamp') {
            order = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        }
        if (sortOrder === 'asc') {
            order *= -1;
        }
        return order;
    }
}
exports.OVSXMockClient = OVSXMockClient;
(function (OVSXMockClient) {
    /**
     * URLs should respect the official OpenVSX API:
     * https://open-vsx.org/swagger-ui/index.html
     */
    class UrlBuilder {
        constructor(baseUrl) {
            this.baseUrl = baseUrl;
        }
        url(path) {
            return this.baseUrl + path;
        }
        apiUrl(path) {
            return this.url(`/api${path}`);
        }
        namespaceUrl(namespace, path = '') {
            return this.apiUrl(`/${namespace}${path}`);
        }
        extensionUrl(namespace, name, path = '') {
            return this.apiUrl(`/${namespace}/${name}${path}`);
        }
        extensionReviewsUrl(namespace, name) {
            return this.apiUrl(`/${namespace}/${name}/reviews`);
        }
        extensionFileUrl(namespace, name, version, path = '') {
            return this.apiUrl(`/${namespace}/${name}/${version}/file${path}`);
        }
    }
    OVSXMockClient.UrlBuilder = UrlBuilder;
})(OVSXMockClient = exports.OVSXMockClient || (exports.OVSXMockClient = {}));


/***/ }),

/***/ "../../dev-packages/ovsx-client/lib/ovsx-router-client.js":
/*!****************************************************************!*\
  !*** ../../dev-packages/ovsx-client/lib/ovsx-router-client.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, exports) => {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OVSXRouterClient = exports.createFilterFactory = void 0;
/**
 * Helper function to create factories that handle a single condition key.
 */
function createFilterFactory(conditionKey, factory) {
    return (conditions, remainingKeys) => {
        if (conditionKey in conditions) {
            const filter = factory(conditions[conditionKey]);
            if (filter) {
                remainingKeys.delete(conditionKey);
                return filter;
            }
        }
    };
}
exports.createFilterFactory = createFilterFactory;
/**
 * Route and agglomerate queries according to {@link routerConfig}.
 * {@link ruleFactories} is the actual logic used to evaluate the config.
 * Each rule implementation will be ran sequentially over each configured rule.
 */
class OVSXRouterClient {
    constructor(useDefault, clientProvider, rules) {
        this.useDefault = useDefault;
        this.clientProvider = clientProvider;
        this.rules = rules;
    }
    static async FromConfig(routerConfig, clientProvider, filterFactories) {
        const rules = routerConfig.rules ? await this.ParseRules(routerConfig.rules, filterFactories, routerConfig.registries) : [];
        return new this(this.ParseUse(routerConfig.use, routerConfig.registries), clientProvider, rules);
    }
    static async ParseRules(rules, filterFactories, aliases) {
        return Promise.all(rules.map(async ({ use, ...conditions }) => {
            const remainingKeys = new Set(Object.keys(conditions));
            const filters = removeNullValues(await Promise.all(filterFactories.map(filterFactory => filterFactory(conditions, remainingKeys))));
            if (remainingKeys.size > 0) {
                throw new Error(`unknown conditions: ${Array.from(remainingKeys).join(', ')}`);
            }
            return {
                filters,
                use: this.ParseUse(use, aliases)
            };
        }));
    }
    static ParseUse(use, aliases) {
        if (typeof use === 'string') {
            return [alias(use)];
        }
        else if (Array.isArray(use)) {
            return use.map(alias);
        }
        else {
            return [];
        }
        function alias(aliasOrUri) {
            var _a;
            return (_a = aliases === null || aliases === void 0 ? void 0 : aliases[aliasOrUri]) !== null && _a !== void 0 ? _a : aliasOrUri;
        }
    }
    async search(searchOptions) {
        return this.runRules(filter => { var _a; return (_a = filter.filterSearchOptions) === null || _a === void 0 ? void 0 : _a.call(filter, searchOptions); }, rule => rule.use.length > 0
            ? this.mergedSearch(rule.use, searchOptions)
            : this.emptySearchResult(searchOptions), () => this.mergedSearch(this.useDefault, searchOptions));
    }
    async query(queryOptions = {}) {
        return this.runRules(filter => { var _a; return (_a = filter.filterQueryOptions) === null || _a === void 0 ? void 0 : _a.call(filter, queryOptions); }, rule => rule.use.length > 0
            ? this.mergedQuery(rule.use, queryOptions)
            : this.emptyQueryResult(queryOptions), () => this.mergedQuery(this.useDefault, queryOptions));
    }
    emptySearchResult(searchOptions) {
        var _a;
        return {
            extensions: [],
            offset: (_a = searchOptions === null || searchOptions === void 0 ? void 0 : searchOptions.offset) !== null && _a !== void 0 ? _a : 0
        };
    }
    emptyQueryResult(queryOptions) {
        return {
            extensions: []
        };
    }
    async mergedQuery(registries, queryOptions) {
        return this.mergeQueryResults(await createMapping(registries, async (registry) => (await this.clientProvider(registry)).query(queryOptions)));
    }
    async mergedSearch(registries, searchOptions) {
        return this.mergeSearchResults(await createMapping(registries, async (registry) => (await this.clientProvider(registry)).search(searchOptions)));
    }
    async mergeSearchResults(results) {
        const filtering = [];
        results.forEach((result, sourceUri) => {
            filtering.push(Promise
                .all(result.extensions.map(extension => this.filterExtension(sourceUri, extension)))
                .then(removeNullValues));
        });
        return {
            extensions: interleave(await Promise.all(filtering)),
            offset: Math.min(...Array.from(results.values(), result => result.offset))
        };
    }
    async mergeQueryResults(results) {
        const filtering = [];
        results.forEach((result, sourceUri) => {
            result.extensions.forEach(extension => filtering.push(this.filterExtension(sourceUri, extension)));
        });
        return {
            extensions: removeNullValues(await Promise.all(filtering))
        };
    }
    async filterExtension(sourceUri, extension) {
        return this.runRules(filter => { var _a; return (_a = filter.filterExtension) === null || _a === void 0 ? void 0 : _a.call(filter, extension); }, rule => rule.use.includes(sourceUri) ? extension : undefined, () => extension);
    }
    async runRules(runFilter, onRuleMatched, onNoRuleMatched) {
        for (const rule of this.rules) {
            const results = removeNullValues(await Promise.all(rule.filters.map(filter => runFilter(filter))));
            if (results.length > 0 && results.every(value => value)) {
                return onRuleMatched(rule);
            }
        }
        return onNoRuleMatched === null || onNoRuleMatched === void 0 ? void 0 : onNoRuleMatched();
    }
}
exports.OVSXRouterClient = OVSXRouterClient;
function nonNullable(value) {
    // eslint-disable-next-line no-null/no-null
    return typeof value !== 'undefined' && value !== null;
}
function removeNullValues(values) {
    return values.filter(nonNullable);
}
/**
 * Create a map where the keys are each element from {@link values} and the
 * values are the result of a mapping function applied on the key.
 */
async function createMapping(values, map, thisArg) {
    return new Map(await Promise.all(values.map(async (value, index) => [value, await map.call(thisArg, value, index)])));
}
/**
 * @example
 * interleave([[1, 2, 3], [4, 5], [6, 7, 8]]) === [1, 4, 6, 2, 5, 7, 3, 8]
 */
function interleave(arrays) {
    const interleaved = [];
    const length = Math.max(...arrays.map(array => array.length));
    for (let i = 0; i < length; i++) {
        for (const array of arrays) {
            if (i < array.length) {
                interleaved.push(array[i]);
            }
        }
    }
    return interleaved;
}


/***/ }),

/***/ "../../dev-packages/ovsx-client/lib/ovsx-router-filters/abstract-reg-exp-filter.js":
/*!*****************************************************************************************!*\
  !*** ../../dev-packages/ovsx-client/lib/ovsx-router-filters/abstract-reg-exp-filter.js ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack_module, exports) => {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AbstractRegExpFilter = void 0;
class AbstractRegExpFilter {
    constructor(regExp) {
        this.regExp = regExp;
    }
    test(value) {
        return typeof value === 'string' && this.regExp.test(value);
    }
}
exports.AbstractRegExpFilter = AbstractRegExpFilter;


/***/ }),

/***/ "../../dev-packages/ovsx-client/lib/ovsx-router-filters/extension-id-matches-filter.js":
/*!*********************************************************************************************!*\
  !*** ../../dev-packages/ovsx-client/lib/ovsx-router-filters/extension-id-matches-filter.js ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ExtensionIdMatchesFilter = exports.ExtensionIdMatchesFilterFactory = void 0;
const ovsx_router_client_1 = __webpack_require__(/*! ../ovsx-router-client */ "../../dev-packages/ovsx-client/lib/ovsx-router-client.js");
const ovsx_types_1 = __webpack_require__(/*! ../ovsx-types */ "../../dev-packages/ovsx-client/lib/ovsx-types.js");
const abstract_reg_exp_filter_1 = __webpack_require__(/*! ./abstract-reg-exp-filter */ "../../dev-packages/ovsx-client/lib/ovsx-router-filters/abstract-reg-exp-filter.js");
exports.ExtensionIdMatchesFilterFactory = (0, ovsx_router_client_1.createFilterFactory)('ifExtensionIdMatches', ifExtensionIdMatches => {
    if (typeof ifExtensionIdMatches !== 'string') {
        throw new TypeError(`expected a string, got: ${typeof ifExtensionIdMatches}`);
    }
    return new ExtensionIdMatchesFilter(new RegExp(ifExtensionIdMatches, 'i'));
});
class ExtensionIdMatchesFilter extends abstract_reg_exp_filter_1.AbstractRegExpFilter {
    filterExtension(extension) {
        return this.test(ovsx_types_1.ExtensionLike.id(extension));
    }
}
exports.ExtensionIdMatchesFilter = ExtensionIdMatchesFilter;


/***/ }),

/***/ "../../dev-packages/ovsx-client/lib/ovsx-router-filters/index.js":
/*!***********************************************************************!*\
  !*** ../../dev-packages/ovsx-client/lib/ovsx-router-filters/index.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RequestContainsFilterFactory = exports.ExtensionIdMatchesFilterFactory = void 0;
var extension_id_matches_filter_1 = __webpack_require__(/*! ./extension-id-matches-filter */ "../../dev-packages/ovsx-client/lib/ovsx-router-filters/extension-id-matches-filter.js");
Object.defineProperty(exports, "ExtensionIdMatchesFilterFactory", ({ enumerable: true, get: function () { return extension_id_matches_filter_1.ExtensionIdMatchesFilterFactory; } }));
var request_contains_filter_1 = __webpack_require__(/*! ./request-contains-filter */ "../../dev-packages/ovsx-client/lib/ovsx-router-filters/request-contains-filter.js");
Object.defineProperty(exports, "RequestContainsFilterFactory", ({ enumerable: true, get: function () { return request_contains_filter_1.RequestContainsFilterFactory; } }));


/***/ }),

/***/ "../../dev-packages/ovsx-client/lib/ovsx-router-filters/request-contains-filter.js":
/*!*****************************************************************************************!*\
  !*** ../../dev-packages/ovsx-client/lib/ovsx-router-filters/request-contains-filter.js ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RequestContainsFilter = exports.RequestContainsFilterFactory = void 0;
const ovsx_router_client_1 = __webpack_require__(/*! ../ovsx-router-client */ "../../dev-packages/ovsx-client/lib/ovsx-router-client.js");
const abstract_reg_exp_filter_1 = __webpack_require__(/*! ./abstract-reg-exp-filter */ "../../dev-packages/ovsx-client/lib/ovsx-router-filters/abstract-reg-exp-filter.js");
exports.RequestContainsFilterFactory = (0, ovsx_router_client_1.createFilterFactory)('ifRequestContains', ifRequestContains => {
    if (typeof ifRequestContains !== 'string') {
        throw new TypeError(`expected a string, got: ${typeof ifRequestContains}`);
    }
    return new RequestContainsFilter(new RegExp(ifRequestContains, 'i'));
});
class RequestContainsFilter extends abstract_reg_exp_filter_1.AbstractRegExpFilter {
    filterSearchOptions(searchOptions) {
        return !searchOptions || this.test(searchOptions.query) || this.test(searchOptions.category);
    }
    filterQueryOptions(queryOptions) {
        return !queryOptions || Object.values(queryOptions).some(this.test, this);
    }
}
exports.RequestContainsFilter = RequestContainsFilter;


/***/ }),

/***/ "../../dev-packages/ovsx-client/lib/ovsx-types.js":
/*!********************************************************!*\
  !*** ../../dev-packages/ovsx-client/lib/ovsx-types.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports) => {


// *****************************************************************************
// Copyright (C) 2020 TypeFox and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VSXBuiltinNamespaces = exports.VSXResponseError = exports.ExtensionLike = void 0;
var ExtensionLike;
(function (ExtensionLike) {
    function id(extension) {
        return `${extension.namespace}.${extension.name}`;
    }
    ExtensionLike.id = id;
    function idWithVersion(extension) {
        if (!extension.version) {
            throw new Error(`no valid "version" value provided for "${id(extension)}"`);
        }
        return `${id(extension)}@${extension.version}`;
    }
    ExtensionLike.idWithVersion = idWithVersion;
    // eslint-disable-next-line @typescript-eslint/no-shadow
    function fromId(id) {
        const [left, version] = id.split('@', 2);
        const [namespace, name] = left.split('.', 2);
        return {
            name,
            namespace,
            version
        };
    }
    ExtensionLike.fromId = fromId;
})(ExtensionLike = exports.ExtensionLike || (exports.ExtensionLike = {}));
var VSXResponseError;
(function (VSXResponseError) {
    function is(error) {
        return !!error && typeof error === 'object' && typeof error.statusCode === 'number';
    }
    VSXResponseError.is = is;
})(VSXResponseError = exports.VSXResponseError || (exports.VSXResponseError = {}));
/**
 * Builtin namespaces maintained by the framework.
 */
var VSXBuiltinNamespaces;
(function (VSXBuiltinNamespaces) {
    /**
     * Namespace for individual vscode builtin extensions.
     */
    VSXBuiltinNamespaces.VSCODE = 'vscode';
    /**
     * Namespace for vscode builtin extension packs.
     * - corresponds to: https://github.com/eclipse-theia/vscode-builtin-extensions/blob/af9cfeb2ea23e1668a8340c1c2fb5afd56be07d7/src/create-extension-pack.js#L45
     */
    VSXBuiltinNamespaces.THEIA = 'eclipse-theia';
    /**
     * Determines if the extension namespace is a builtin maintained by the framework.
     * @param namespace the extension namespace to verify.
     */
    function is(namespace) {
        return namespace === VSXBuiltinNamespaces.VSCODE
            || namespace === VSXBuiltinNamespaces.THEIA;
    }
    VSXBuiltinNamespaces.is = is;
})(VSXBuiltinNamespaces = exports.VSXBuiltinNamespaces || (exports.VSXBuiltinNamespaces = {}));


/***/ }),

/***/ "../../packages/plugin-ext-vscode/lib/common/plugin-vscode-uri.js":
/*!************************************************************************!*\
  !*** ../../packages/plugin-ext-vscode/lib/common/plugin-vscode-uri.js ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2022 Ericsson and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VSCodeExtensionUri = void 0;
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
/**
 * Static methods for identifying a plugin as the target of the VSCode deployment system.
 * In practice, this means that it will be resolved and deployed by the Open-VSX system.
 */
var VSCodeExtensionUri;
(function (VSCodeExtensionUri) {
    VSCodeExtensionUri.VSCODE_PREFIX = 'vscode:extension/';
    /**
     * Should be used to prefix a plugin's ID to ensure that it is identified as a VSX Extension.
     * @returns `vscode:extension/${id}`
     */
    function toVsxExtensionUriString(id) {
        return `${VSCodeExtensionUri.VSCODE_PREFIX}${id}`;
    }
    VSCodeExtensionUri.toVsxExtensionUriString = toVsxExtensionUriString;
    function toUri(idOrName, namespace) {
        if (typeof namespace === 'string') {
            return new uri_1.default(toVsxExtensionUriString(`${namespace}.${idOrName}`));
        }
        else {
            return new uri_1.default(toVsxExtensionUriString(idOrName));
        }
    }
    VSCodeExtensionUri.toUri = toUri;
    function toId(uri) {
        if (uri.scheme === 'vscode' && uri.path.dir.toString() === 'extension') {
            return uri.path.base;
        }
        return undefined;
    }
    VSCodeExtensionUri.toId = toId;
})(VSCodeExtensionUri = exports.VSCodeExtensionUri || (exports.VSCodeExtensionUri = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext-vscode/lib/common/plugin-vscode-uri'] = this;


/***/ }),

/***/ "../../packages/vsx-registry/lib/common/ovsx-client-provider.js":
/*!**********************************************************************!*\
  !*** ../../packages/vsx-registry/lib/common/ovsx-client-provider.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createOVSXClient = exports.OVSXClientProvider = exports.OVSXUrlResolver = void 0;
const ovsx_client_1 = __webpack_require__(/*! @theia/ovsx-client */ "../../dev-packages/ovsx-client/lib/index.js");
exports.OVSXUrlResolver = Symbol('OVSXUrlResolver');
exports.OVSXClientProvider = Symbol('OVSXClientProvider');
/**
 * @deprecated since 1.32.0
 */
async function createOVSXClient(vsxEnvironment, requestService) {
    const apiUrl = await vsxEnvironment.getRegistryApiUri();
    return new ovsx_client_1.OVSXHttpClient(apiUrl, requestService);
}
exports.createOVSXClient = createOVSXClient;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/vsx-registry/lib/common/ovsx-client-provider'] = this;


/***/ }),

/***/ "../../packages/vsx-registry/lib/common/vsx-environment.js":
/*!*****************************************************************!*\
  !*** ../../packages/vsx-registry/lib/common/vsx-environment.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, exports) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VSXEnvironment = exports.VSX_ENVIRONMENT_PATH = void 0;
exports.VSX_ENVIRONMENT_PATH = '/services/vsx-environment';
exports.VSXEnvironment = Symbol('VSXEnvironment');

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/vsx-registry/lib/common/vsx-environment'] = this;


/***/ })

}]);
//# sourceMappingURL=packages_plugin-ext-vscode_lib_common_plugin-vscode-uri_js-packages_vsx-registry_lib_common_o-9c369c.js.map