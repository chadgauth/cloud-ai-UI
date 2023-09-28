"use strict";
// *****************************************************************************
// Copyright (C) 2019 Ericsson and others.
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
exports.bindSearchInWorkspacePreferences = exports.createSearchInWorkspacePreferences = exports.SearchInWorkspacePreferences = exports.SearchInWorkspacePreferenceContribution = exports.SearchInWorkspaceConfiguration = exports.searchInWorkspacePreferencesSchema = void 0;
const nls_1 = require("@theia/core/lib/common/nls");
const preferences_1 = require("@theia/core/lib/browser/preferences");
exports.searchInWorkspacePreferencesSchema = {
    type: 'object',
    properties: {
        'search.lineNumbers': {
            description: nls_1.nls.localizeByDefault('Controls whether to show line numbers for search results.'),
            default: false,
            type: 'boolean',
        },
        'search.collapseResults': {
            description: nls_1.nls.localizeByDefault('Controls whether the search results will be collapsed or expanded.'),
            default: 'auto',
            type: 'string',
            enum: ['auto', 'alwaysCollapse', 'alwaysExpand'],
        },
        'search.searchOnType': {
            description: nls_1.nls.localizeByDefault('Search all files as you type.'),
            default: true,
            type: 'boolean',
        },
        'search.searchOnTypeDebouncePeriod': {
            // eslint-disable-next-line max-len
            markdownDescription: nls_1.nls.localizeByDefault('When {0} is enabled, controls the timeout in milliseconds between a character being typed and the search starting. Has no effect when {0} is disabled.', '`#search.searchOnType#`'),
            default: 300,
            type: 'number',
        },
        'search.searchOnEditorModification': {
            description: nls_1.nls.localize('theia/search-in-workspace/searchOnEditorModification', 'Search the active editor when modified.'),
            default: true,
            type: 'boolean',
        },
        'search.smartCase': {
            // eslint-disable-next-line max-len
            description: nls_1.nls.localizeByDefault('Search case-insensitively if the pattern is all lowercase, otherwise, search case-sensitively.'),
            default: false,
            type: 'boolean',
        },
        'search.followSymlinks': {
            description: nls_1.nls.localizeByDefault('Controls whether to follow symlinks while searching.'),
            default: true,
            type: 'boolean',
        }
    }
};
class SearchInWorkspaceConfiguration {
}
exports.SearchInWorkspaceConfiguration = SearchInWorkspaceConfiguration;
exports.SearchInWorkspacePreferenceContribution = Symbol('SearchInWorkspacePreferenceContribution');
exports.SearchInWorkspacePreferences = Symbol('SearchInWorkspacePreferences');
function createSearchInWorkspacePreferences(preferences, schema = exports.searchInWorkspacePreferencesSchema) {
    return (0, preferences_1.createPreferenceProxy)(preferences, schema);
}
exports.createSearchInWorkspacePreferences = createSearchInWorkspacePreferences;
function bindSearchInWorkspacePreferences(bind) {
    bind(exports.SearchInWorkspacePreferences).toDynamicValue(ctx => {
        const preferences = ctx.container.get(preferences_1.PreferenceService);
        const contribution = ctx.container.get(exports.SearchInWorkspacePreferenceContribution);
        return createSearchInWorkspacePreferences(preferences, contribution.schema);
    }).inSingletonScope();
    bind(exports.SearchInWorkspacePreferenceContribution).toConstantValue({ schema: exports.searchInWorkspacePreferencesSchema });
    bind(preferences_1.PreferenceContribution).toService(exports.SearchInWorkspacePreferenceContribution);
}
exports.bindSearchInWorkspacePreferences = bindSearchInWorkspacePreferences;
//# sourceMappingURL=search-in-workspace-preferences.js.map