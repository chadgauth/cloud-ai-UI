(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_file-search_lib_browser_quick-file-open_js"],{

/***/ "../../packages/core/shared/fuzzy/index.js":
/*!*************************************************!*\
  !*** ../../packages/core/shared/fuzzy/index.js ***!
  \*************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! fuzzy */ "../../node_modules/fuzzy/lib/fuzzy.js");

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/shared/fuzzy'] = this;


/***/ }),

/***/ "../../packages/file-search/lib/browser/quick-file-open.js":
/*!*****************************************************************!*\
  !*** ../../packages/file-search/lib/browser/quick-file-open.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2017 TypeFox and others.
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
var QuickFileOpenService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QuickFileOpenService = exports.quickFileOpen = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const workspace_service_1 = __webpack_require__(/*! @theia/workspace/lib/browser/workspace-service */ "../../packages/workspace/lib/browser/workspace-service.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const file_search_service_1 = __webpack_require__(/*! ../common/file-search-service */ "../../packages/file-search/lib/common/file-search-service.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const label_provider_1 = __webpack_require__(/*! @theia/core/lib/browser/label-provider */ "../../packages/core/lib/browser/label-provider.js");
const navigation_location_service_1 = __webpack_require__(/*! @theia/editor/lib/browser/navigation/navigation-location-service */ "../../packages/editor/lib/browser/navigation/navigation-location-service.js");
const fuzzy = __webpack_require__(/*! @theia/core/shared/fuzzy */ "../../packages/core/shared/fuzzy/index.js");
const message_service_1 = __webpack_require__(/*! @theia/core/lib/common/message-service */ "../../packages/core/lib/common/message-service.js");
const browser_2 = __webpack_require__(/*! @theia/filesystem/lib/browser */ "../../packages/filesystem/lib/browser/index.js");
const browser_3 = __webpack_require__(/*! @theia/editor/lib/browser */ "../../packages/editor/lib/browser/index.js");
const quick_input_service_1 = __webpack_require__(/*! @theia/core/lib/browser/quick-input/quick-input-service */ "../../packages/core/lib/browser/quick-input/quick-input-service.js");
exports.quickFileOpen = common_1.Command.toDefaultLocalizedCommand({
    id: 'file-search.openFile',
    category: browser_1.CommonCommands.FILE_CATEGORY,
    label: 'Open File...'
});
// Supports patterns of <path><#|:><line><#|:|,><col?>
const LINE_COLON_PATTERN = /\s?[#:\(](?:line )?(\d*)(?:[#:,](\d*))?\)?\s*$/;
let QuickFileOpenService = QuickFileOpenService_1 = class QuickFileOpenService {
    constructor() {
        /**
         * Whether to hide .gitignored (and other ignored) files.
         */
        this.hideIgnoredFiles = true;
        /**
         * Whether the dialog is currently open.
         */
        this.isOpen = false;
        this.updateIsOpen = true;
        this.filterAndRangeDefault = { filter: '', range: undefined };
        /**
         * Tracks the user file search filter and location range e.g. fileFilter:line:column or fileFilter:line,column
         */
        this.filterAndRange = this.filterAndRangeDefault;
    }
    registerQuickAccessProvider() {
        this.quickAccessRegistry.registerQuickAccessProvider({
            getInstance: () => this,
            prefix: QuickFileOpenService_1.PREFIX,
            placeholder: this.getPlaceHolder(),
            helpEntries: [{ description: 'Open File', needsEditor: false }]
        });
    }
    init() {
        var _a;
        (_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.onHide(() => {
            if (this.updateIsOpen) {
                this.isOpen = false;
            }
            else {
                this.updateIsOpen = true;
            }
        });
    }
    isEnabled() {
        return this.workspaceService.opened;
    }
    open() {
        var _a;
        // Triggering the keyboard shortcut while the dialog is open toggles
        // showing the ignored files.
        if (this.isOpen) {
            this.hideIgnoredFiles = !this.hideIgnoredFiles;
            this.hideQuickPick();
        }
        else {
            this.hideIgnoredFiles = true;
            this.filterAndRange = this.filterAndRangeDefault;
            this.isOpen = true;
        }
        (_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.open(this.filterAndRange.filter);
    }
    hideQuickPick() {
        var _a;
        this.updateIsOpen = false;
        (_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.hide();
    }
    /**
     * Get a string (suitable to show to the user) representing the keyboard
     * shortcut used to open the quick file open menu.
     */
    getKeyCommand() {
        const keyCommand = this.keybindingRegistry.getKeybindingsForCommand(exports.quickFileOpen.id);
        if (keyCommand) {
            // We only consider the first keybinding.
            const accel = this.keybindingRegistry.acceleratorFor(keyCommand[0], '+');
            return accel.join(' ');
        }
        return undefined;
    }
    async getPicks(filter, token) {
        const roots = this.workspaceService.tryGetRoots();
        this.filterAndRange = this.splitFilterAndRange(filter);
        const fileFilter = this.filterAndRange.filter;
        const alreadyCollected = new Set();
        const recentlyUsedItems = [];
        const locations = [...this.navigationLocationService.locations()].reverse();
        for (const location of locations) {
            const uriString = location.uri.toString();
            if (location.uri.scheme === 'file' && !alreadyCollected.has(uriString) && fuzzy.test(fileFilter, uriString)) {
                if (recentlyUsedItems.length === 0) {
                    recentlyUsedItems.push({
                        type: 'separator',
                        label: common_1.nls.localizeByDefault('recently opened')
                    });
                }
                const item = this.toItem(fileFilter, location.uri);
                recentlyUsedItems.push(item);
                alreadyCollected.add(uriString);
            }
        }
        if (fileFilter.length > 0) {
            const handler = async (results) => {
                if (token.isCancellationRequested || results.length <= 0) {
                    return [];
                }
                const result = [...recentlyUsedItems];
                const fileSearchResultItems = [];
                for (const fileUri of results) {
                    if (!alreadyCollected.has(fileUri)) {
                        const item = this.toItem(fileFilter, fileUri);
                        fileSearchResultItems.push(item);
                        alreadyCollected.add(fileUri);
                    }
                }
                // Create a copy of the file search results and sort.
                const sortedResults = fileSearchResultItems.slice();
                sortedResults.sort((a, b) => this.compareItems(a, b));
                if (sortedResults.length > 0) {
                    result.push({
                        type: 'separator',
                        label: common_1.nls.localizeByDefault('file results')
                    });
                    result.push(...sortedResults);
                }
                // Return the recently used items, followed by the search results.
                return result;
            };
            return this.fileSearchService.find(fileFilter, {
                rootUris: roots.map(r => r.resource.toString()),
                fuzzyMatch: true,
                limit: 200,
                useGitIgnore: this.hideIgnoredFiles,
                excludePatterns: this.hideIgnoredFiles
                    ? Object.keys(this.fsPreferences['files.exclude'])
                    : undefined,
            }, token).then(handler);
        }
        else {
            return roots.length !== 0 ? recentlyUsedItems : [];
        }
    }
    compareItems(left, right) {
        /**
         * Score a given string.
         *
         * @param str the string to score on.
         * @returns the score.
         */
        function score(str) {
            var _a;
            if (!str) {
                return 0;
            }
            let exactMatch = true;
            const partialMatches = querySplit.reduce((matched, part) => {
                const partMatches = str.includes(part);
                exactMatch = exactMatch && partMatches;
                return partMatches ? matched + QuickFileOpenService_1.Scores.partial : matched;
            }, 0);
            // Check fuzzy matches.
            const fuzzyMatch = (_a = fuzzy.match(queryJoin, str)) !== null && _a !== void 0 ? _a : { score: 0 };
            if (fuzzyMatch.score === Infinity && exactMatch) {
                return Number.MAX_SAFE_INTEGER;
            }
            return fuzzyMatch.score + partialMatches + (exactMatch ? QuickFileOpenService_1.Scores.exact : 0);
        }
        const query = normalize(this.filterAndRange.filter);
        // Adjust for whitespaces in the query.
        const querySplit = query.split(file_search_service_1.WHITESPACE_QUERY_SEPARATOR);
        const queryJoin = querySplit.join('');
        const compareByLabelScore = (l, r) => score(r.label) - score(l.label);
        const compareByLabelIndex = (l, r) => r.label.indexOf(query) - l.label.indexOf(query);
        const compareByLabel = (l, r) => l.label.localeCompare(r.label);
        const compareByPathScore = (l, r) => score(r.uri.path.toString()) - score(l.uri.path.toString());
        const compareByPathIndex = (l, r) => r.uri.path.toString().indexOf(query) - l.uri.path.toString().indexOf(query);
        const compareByPathLabel = (l, r) => l.uri.path.toString().localeCompare(r.uri.path.toString());
        return compareWithDiscriminators(left, right, compareByLabelScore, compareByLabelIndex, compareByLabel, compareByPathScore, compareByPathIndex, compareByPathLabel);
    }
    openFile(uri) {
        const options = this.buildOpenerOptions();
        const closedEditor = this.navigationLocationService.closedEditorsStack.find(editor => editor.uri.path.toString() === uri.path.toString());
        this.openerService.getOpener(uri, options)
            .then(opener => opener.open(uri, options))
            .then(widget => {
            // Attempt to restore the editor state if it exists, and no selection is explicitly requested.
            if (widget instanceof browser_3.EditorWidget && closedEditor && !options.selection) {
                widget.editor.restoreViewState(closedEditor.viewState);
            }
        })
            .catch(error => {
            console.warn(error);
            this.messageService.error(common_1.nls.localizeByDefault("Unable to open '{0}'", uri.path.toString()));
        });
    }
    buildOpenerOptions() {
        return { selection: this.filterAndRange.range };
    }
    toItem(lookFor, uriOrString) {
        const uri = uriOrString instanceof uri_1.default ? uriOrString : new uri_1.default(uriOrString);
        const label = this.labelProvider.getName(uri);
        const description = this.getItemDescription(uri);
        const iconClasses = this.getItemIconClasses(uri);
        return {
            label,
            description,
            highlights: {
                label: (0, quick_input_service_1.findMatches)(label, lookFor),
                description: (0, quick_input_service_1.findMatches)(description, lookFor)
            },
            iconClasses,
            uri,
            execute: () => this.openFile(uri)
        };
    }
    getItemIconClasses(uri) {
        const icon = this.labelProvider.getIcon(uri);
        return icon !== '' ? [icon + ' file-icon'] : [];
    }
    getItemDescription(uri) {
        return this.labelProvider.getDetails(uri);
    }
    getPlaceHolder() {
        let placeholder = common_1.nls.localizeByDefault('Search files by name (append {0} to go to line or {1} to go to symbol)', ':', '@');
        const keybinding = this.getKeyCommand();
        if (keybinding) {
            placeholder += common_1.nls.localize('theia/file-search/toggleIgnoredFiles', ' (Press {0} to show/hide ignored files)', keybinding);
        }
        return placeholder;
    }
    /**
     * Splits the given expression into a structure of search-file-filter and
     * location-range.
     *
     * @param expression patterns of <path><#|:><line><#|:|,><col?>
     */
    splitFilterAndRange(expression) {
        var _a, _b;
        let filter = expression;
        let range = undefined;
        // Find line and column number from the expression using RegExp.
        const patternMatch = LINE_COLON_PATTERN.exec(expression);
        if (patternMatch) {
            const line = parseInt((_a = patternMatch[1]) !== null && _a !== void 0 ? _a : '', 10);
            if (Number.isFinite(line)) {
                const lineNumber = line > 0 ? line - 1 : 0;
                const column = parseInt((_b = patternMatch[2]) !== null && _b !== void 0 ? _b : '', 10);
                const startColumn = Number.isFinite(column) && column > 0 ? column - 1 : 0;
                const position = browser_3.Position.create(lineNumber, startColumn);
                filter = expression.substring(0, patternMatch.index);
                range = browser_3.Range.create(position, position);
            }
        }
        return { filter, range };
    }
};
QuickFileOpenService.PREFIX = '';
/**
 * The score constants when comparing file search results.
 */
QuickFileOpenService.Scores = {
    max: 1000,
    exact: 500,
    partial: 250 // represents the score assigned to partial matching.
};
__decorate([
    (0, inversify_1.inject)(browser_1.KeybindingRegistry),
    __metadata("design:type", browser_1.KeybindingRegistry)
], QuickFileOpenService.prototype, "keybindingRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(workspace_service_1.WorkspaceService),
    __metadata("design:type", workspace_service_1.WorkspaceService)
], QuickFileOpenService.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.OpenerService),
    __metadata("design:type", Object)
], QuickFileOpenService.prototype, "openerService", void 0);
__decorate([
    (0, inversify_1.inject)(quick_input_service_1.QuickInputService),
    (0, inversify_1.optional)(),
    __metadata("design:type", Object)
], QuickFileOpenService.prototype, "quickInputService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.QuickAccessRegistry),
    __metadata("design:type", Object)
], QuickFileOpenService.prototype, "quickAccessRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(file_search_service_1.FileSearchService),
    __metadata("design:type", Object)
], QuickFileOpenService.prototype, "fileSearchService", void 0);
__decorate([
    (0, inversify_1.inject)(label_provider_1.LabelProvider),
    __metadata("design:type", label_provider_1.LabelProvider)
], QuickFileOpenService.prototype, "labelProvider", void 0);
__decorate([
    (0, inversify_1.inject)(navigation_location_service_1.NavigationLocationService),
    __metadata("design:type", navigation_location_service_1.NavigationLocationService)
], QuickFileOpenService.prototype, "navigationLocationService", void 0);
__decorate([
    (0, inversify_1.inject)(message_service_1.MessageService),
    __metadata("design:type", message_service_1.MessageService)
], QuickFileOpenService.prototype, "messageService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.FileSystemPreferences),
    __metadata("design:type", Object)
], QuickFileOpenService.prototype, "fsPreferences", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], QuickFileOpenService.prototype, "init", null);
QuickFileOpenService = QuickFileOpenService_1 = __decorate([
    (0, inversify_1.injectable)()
], QuickFileOpenService);
exports.QuickFileOpenService = QuickFileOpenService;
/**
 * Normalize a given string.
 *
 * @param str the raw string value.
 * @returns the normalized string value.
 */
function normalize(str) {
    return str.trim().toLowerCase();
}
function compareWithDiscriminators(left, right, ...discriminators) {
    let comparisonValue = 0;
    let i = 0;
    while (comparisonValue === 0 && i < discriminators.length) {
        comparisonValue = discriminators[i](left, right);
        i++;
    }
    return comparisonValue;
}

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/file-search/lib/browser/quick-file-open'] = this;


/***/ }),

/***/ "../../packages/file-search/lib/common/file-search-service.js":
/*!********************************************************************!*\
  !*** ../../packages/file-search/lib/common/file-search-service.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

// *****************************************************************************
// Copyright (C) 2017 TypeFox and others.
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
exports.WHITESPACE_QUERY_SEPARATOR = exports.FileSearchService = exports.fileSearchServicePath = void 0;
exports.fileSearchServicePath = '/services/search';
exports.FileSearchService = Symbol('FileSearchService');
exports.WHITESPACE_QUERY_SEPARATOR = /\s+/;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/file-search/lib/common/file-search-service'] = this;


/***/ })

}]);
//# sourceMappingURL=packages_file-search_lib_browser_quick-file-open_js.js.map