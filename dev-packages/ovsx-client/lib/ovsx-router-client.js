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
//# sourceMappingURL=ovsx-router-client.js.map