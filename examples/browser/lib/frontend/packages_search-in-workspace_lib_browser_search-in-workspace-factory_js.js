"use strict";
(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_search-in-workspace_lib_browser_search-in-workspace-factory_js"],{

/***/ "../../packages/search-in-workspace/lib/browser/components/search-in-workspace-input.js":
/*!**********************************************************************************************!*\
  !*** ../../packages/search-in-workspace/lib/browser/components/search-in-workspace-input.js ***!
  \**********************************************************************************************/
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
exports.SearchInWorkspaceInput = void 0;
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const debounce = __webpack_require__(/*! @theia/core/shared/lodash.debounce */ "../../packages/core/shared/lodash.debounce/index.js");
;
class SearchInWorkspaceInput extends React.Component {
    constructor(props) {
        super(props);
        this.input = React.createRef();
        /**
         * Handle history navigation without overriding the parent's onKeyDown handler, if any.
         */
        this.onKeyDown = (e) => {
            var _a, _b, _c, _d;
            if (browser_1.Key.ARROW_UP.keyCode === ((_a = browser_1.KeyCode.createKeyCode(e.nativeEvent).key) === null || _a === void 0 ? void 0 : _a.keyCode)) {
                e.preventDefault();
                this.previousValue();
            }
            else if (browser_1.Key.ARROW_DOWN.keyCode === ((_b = browser_1.KeyCode.createKeyCode(e.nativeEvent).key) === null || _b === void 0 ? void 0 : _b.keyCode)) {
                e.preventDefault();
                this.nextValue();
            }
            (_d = (_c = this.props).onKeyDown) === null || _d === void 0 ? void 0 : _d.call(_c, e);
        };
        /**
         * Handle history collection without overriding the parent's onChange handler, if any.
         */
        this.onChange = (e) => {
            var _a, _b;
            this.addToHistory();
            (_b = (_a = this.props).onChange) === null || _b === void 0 ? void 0 : _b.call(_a, e);
        };
        /**
         * Add a nonempty current value to the history, if not already present. (Debounced, 1 second delay.)
         */
        this.addToHistory = debounce(this.doAddToHistory, 1000);
        this.state = {
            history: [],
            index: 0,
        };
    }
    updateState(index, history) {
        this.value = history ? history[index] : this.state.history[index];
        this.setState(prevState => {
            const newState = {
                ...prevState,
                index,
            };
            if (history) {
                newState.history = history;
            }
            return newState;
        });
    }
    get value() {
        var _a, _b;
        return (_b = (_a = this.input.current) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : '';
    }
    set value(value) {
        if (this.input.current) {
            this.input.current.value = value;
        }
    }
    /**
     * Switch the input's text to the previous value, if any.
     */
    previousValue() {
        const { history, index } = this.state;
        if (!this.value) {
            this.value = history[index];
        }
        else if (index > 0 && index < history.length) {
            this.updateState(index - 1);
        }
    }
    /**
     * Switch the input's text to the next value, if any.
     */
    nextValue() {
        const { history, index } = this.state;
        if (index === history.length - 1) {
            this.value = '';
        }
        else if (!this.value) {
            this.value = history[index];
        }
        else if (index >= 0 && index < history.length - 1) {
            this.updateState(index + 1);
        }
    }
    doAddToHistory() {
        if (!this.value) {
            return;
        }
        const history = this.state.history
            .filter(term => term !== this.value)
            .concat(this.value)
            .slice(-SearchInWorkspaceInput.LIMIT);
        this.updateState(history.length - 1, history);
    }
    render() {
        return (React.createElement("input", { ...this.props, onKeyDown: this.onKeyDown, onChange: this.onChange, spellCheck: false, ref: this.input }));
    }
}
exports.SearchInWorkspaceInput = SearchInWorkspaceInput;
SearchInWorkspaceInput.LIMIT = 100;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/search-in-workspace/lib/browser/components/search-in-workspace-input'] = this;


/***/ }),

/***/ "../../packages/search-in-workspace/lib/browser/search-in-workspace-context-key-service.js":
/*!*************************************************************************************************!*\
  !*** ../../packages/search-in-workspace/lib/browser/search-in-workspace-context-key-service.js ***!
  \*************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SearchInWorkspaceContextKeyService = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const context_key_service_1 = __webpack_require__(/*! @theia/core/lib/browser/context-key-service */ "../../packages/core/lib/browser/context-key-service.js");
let SearchInWorkspaceContextKeyService = class SearchInWorkspaceContextKeyService {
    get searchViewletVisible() {
        return this._searchViewletVisible;
    }
    get searchViewletFocus() {
        return this._searchViewletFocus;
    }
    setSearchInputBoxFocus(searchInputBoxFocus) {
        this.searchInputBoxFocus.set(searchInputBoxFocus);
        this.updateInputBoxFocus();
    }
    setReplaceInputBoxFocus(replaceInputBoxFocus) {
        this.replaceInputBoxFocus.set(replaceInputBoxFocus);
        this.updateInputBoxFocus();
    }
    setPatternIncludesInputBoxFocus(patternIncludesInputBoxFocus) {
        this.patternIncludesInputBoxFocus.set(patternIncludesInputBoxFocus);
        this.updateInputBoxFocus();
    }
    setPatternExcludesInputBoxFocus(patternExcludesInputBoxFocus) {
        this.patternExcludesInputBoxFocus.set(patternExcludesInputBoxFocus);
        this.updateInputBoxFocus();
    }
    updateInputBoxFocus() {
        this.inputBoxFocus.set(this.searchInputBoxFocus.get() ||
            this.replaceInputBoxFocus.get() ||
            this.patternIncludesInputBoxFocus.get() ||
            this.patternExcludesInputBoxFocus.get());
    }
    get replaceActive() {
        return this._replaceActive;
    }
    get hasSearchResult() {
        return this._hasSearchResult;
    }
    init() {
        this._searchViewletVisible = this.contextKeyService.createKey('searchViewletVisible', false);
        this._searchViewletFocus = this.contextKeyService.createKey('searchViewletFocus', false);
        this.inputBoxFocus = this.contextKeyService.createKey('inputBoxFocus', false);
        this.searchInputBoxFocus = this.contextKeyService.createKey('searchInputBoxFocus', false);
        this.replaceInputBoxFocus = this.contextKeyService.createKey('replaceInputBoxFocus', false);
        this.patternIncludesInputBoxFocus = this.contextKeyService.createKey('patternIncludesInputBoxFocus', false);
        this.patternExcludesInputBoxFocus = this.contextKeyService.createKey('patternExcludesInputBoxFocus', false);
        this._replaceActive = this.contextKeyService.createKey('replaceActive', false);
        this._hasSearchResult = this.contextKeyService.createKey('hasSearchResult', false);
    }
};
__decorate([
    (0, inversify_1.inject)(context_key_service_1.ContextKeyService),
    __metadata("design:type", Object)
], SearchInWorkspaceContextKeyService.prototype, "contextKeyService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SearchInWorkspaceContextKeyService.prototype, "init", null);
SearchInWorkspaceContextKeyService = __decorate([
    (0, inversify_1.injectable)()
], SearchInWorkspaceContextKeyService);
exports.SearchInWorkspaceContextKeyService = SearchInWorkspaceContextKeyService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/search-in-workspace/lib/browser/search-in-workspace-context-key-service'] = this;


/***/ }),

/***/ "../../packages/search-in-workspace/lib/browser/search-in-workspace-factory.js":
/*!*************************************************************************************!*\
  !*** ../../packages/search-in-workspace/lib/browser/search-in-workspace-factory.js ***!
  \*************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2021 SAP SE or an SAP affiliate company and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SearchInWorkspaceFactory = exports.SEARCH_VIEW_CONTAINER_TITLE_OPTIONS = exports.SEARCH_VIEW_CONTAINER_ID = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const search_in_workspace_widget_1 = __webpack_require__(/*! ./search-in-workspace-widget */ "../../packages/search-in-workspace/lib/browser/search-in-workspace-widget.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
exports.SEARCH_VIEW_CONTAINER_ID = 'search-view-container';
exports.SEARCH_VIEW_CONTAINER_TITLE_OPTIONS = {
    label: nls_1.nls.localizeByDefault('Search'),
    iconClass: (0, browser_1.codicon)('search'),
    closeable: true
};
let SearchInWorkspaceFactory = class SearchInWorkspaceFactory {
    constructor() {
        this.id = exports.SEARCH_VIEW_CONTAINER_ID;
        this.searchWidgetOptions = {
            canHide: false,
            initiallyCollapsed: false
        };
    }
    async createWidget() {
        const viewContainer = this.viewContainerFactory({
            id: exports.SEARCH_VIEW_CONTAINER_ID,
            progressLocationId: 'search'
        });
        viewContainer.setTitleOptions(exports.SEARCH_VIEW_CONTAINER_TITLE_OPTIONS);
        const widget = await this.widgetManager.getOrCreateWidget(search_in_workspace_widget_1.SearchInWorkspaceWidget.ID);
        viewContainer.addWidget(widget, this.searchWidgetOptions);
        return viewContainer;
    }
};
__decorate([
    (0, inversify_1.inject)(browser_1.ViewContainer.Factory),
    __metadata("design:type", Function)
], SearchInWorkspaceFactory.prototype, "viewContainerFactory", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.WidgetManager),
    __metadata("design:type", browser_1.WidgetManager)
], SearchInWorkspaceFactory.prototype, "widgetManager", void 0);
SearchInWorkspaceFactory = __decorate([
    (0, inversify_1.injectable)()
], SearchInWorkspaceFactory);
exports.SearchInWorkspaceFactory = SearchInWorkspaceFactory;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/search-in-workspace/lib/browser/search-in-workspace-factory'] = this;


/***/ }),

/***/ "../../packages/search-in-workspace/lib/browser/search-in-workspace-preferences.js":
/*!*****************************************************************************************!*\
  !*** ../../packages/search-in-workspace/lib/browser/search-in-workspace-preferences.js ***!
  \*****************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.bindSearchInWorkspacePreferences = exports.createSearchInWorkspacePreferences = exports.SearchInWorkspacePreferences = exports.SearchInWorkspacePreferenceContribution = exports.SearchInWorkspaceConfiguration = exports.searchInWorkspacePreferencesSchema = void 0;
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
const preferences_1 = __webpack_require__(/*! @theia/core/lib/browser/preferences */ "../../packages/core/lib/browser/preferences/index.js");
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

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/search-in-workspace/lib/browser/search-in-workspace-preferences'] = this;


/***/ }),

/***/ "../../packages/search-in-workspace/lib/browser/search-in-workspace-result-tree-widget.js":
/*!************************************************************************************************!*\
  !*** ../../packages/search-in-workspace/lib/browser/search-in-workspace-result-tree-widget.js ***!
  \************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2018 TypeFox and others.
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SearchInWorkspaceResultTreeWidget = exports.SearchInWorkspaceResultLineNode = exports.SearchInWorkspaceFileNode = exports.SearchInWorkspaceRootFolderNode = exports.SearchInWorkspaceRoot = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const browser_2 = __webpack_require__(/*! @theia/editor/lib/browser */ "../../packages/editor/lib/browser/index.js");
const browser_3 = __webpack_require__(/*! @theia/workspace/lib/browser */ "../../packages/workspace/lib/browser/index.js");
const browser_4 = __webpack_require__(/*! @theia/filesystem/lib/browser */ "../../packages/filesystem/lib/browser/index.js");
const file_service_1 = __webpack_require__(/*! @theia/filesystem/lib/browser/file-service */ "../../packages/filesystem/lib/browser/file-service.js");
const search_in_workspace_service_1 = __webpack_require__(/*! ./search-in-workspace-service */ "../../packages/search-in-workspace/lib/browser/search-in-workspace-service.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const search_in_workspace_preferences_1 = __webpack_require__(/*! ./search-in-workspace-preferences */ "../../packages/search-in-workspace/lib/browser/search-in-workspace-preferences.js");
const color_registry_1 = __webpack_require__(/*! @theia/core/lib/browser/color-registry */ "../../packages/core/lib/browser/color-registry.js");
const minimatch = __webpack_require__(/*! minimatch */ "../../packages/search-in-workspace/node_modules/minimatch/minimatch.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
const debounce = __webpack_require__(/*! @theia/core/shared/lodash.debounce */ "../../packages/core/shared/lodash.debounce/index.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
const ROOT_ID = 'ResultTree';
var SearchInWorkspaceRoot;
(function (SearchInWorkspaceRoot) {
    function is(node) {
        return browser_1.CompositeTreeNode.is(node) && node.id === ROOT_ID;
    }
    SearchInWorkspaceRoot.is = is;
})(SearchInWorkspaceRoot = exports.SearchInWorkspaceRoot || (exports.SearchInWorkspaceRoot = {}));
var SearchInWorkspaceRootFolderNode;
(function (SearchInWorkspaceRootFolderNode) {
    function is(node) {
        return browser_1.ExpandableTreeNode.is(node) && browser_1.SelectableTreeNode.is(node) && 'path' in node && 'folderUri' in node && !('fileUri' in node);
    }
    SearchInWorkspaceRootFolderNode.is = is;
})(SearchInWorkspaceRootFolderNode = exports.SearchInWorkspaceRootFolderNode || (exports.SearchInWorkspaceRootFolderNode = {}));
var SearchInWorkspaceFileNode;
(function (SearchInWorkspaceFileNode) {
    function is(node) {
        return browser_1.ExpandableTreeNode.is(node) && browser_1.SelectableTreeNode.is(node) && 'path' in node && 'fileUri' in node && !('folderUri' in node);
    }
    SearchInWorkspaceFileNode.is = is;
})(SearchInWorkspaceFileNode = exports.SearchInWorkspaceFileNode || (exports.SearchInWorkspaceFileNode = {}));
var SearchInWorkspaceResultLineNode;
(function (SearchInWorkspaceResultLineNode) {
    function is(node) {
        return browser_1.SelectableTreeNode.is(node) && 'line' in node && 'character' in node && 'lineText' in node;
    }
    SearchInWorkspaceResultLineNode.is = is;
})(SearchInWorkspaceResultLineNode = exports.SearchInWorkspaceResultLineNode || (exports.SearchInWorkspaceResultLineNode = {}));
let SearchInWorkspaceResultTreeWidget = class SearchInWorkspaceResultTreeWidget extends browser_1.TreeWidget {
    constructor(props, model, contextMenuRenderer) {
        super(props, model, contextMenuRenderer);
        this._showReplaceButtons = false;
        this._replaceTerm = '';
        this.searchTerm = '';
        this.startSearchOnModification = (activeEditor) => debounce(() => this.searchActiveEditor(activeEditor, this.searchTerm, this.searchOptions), this.searchOnEditorModificationDelay);
        this.searchOnEditorModificationDelay = 300;
        this.toDisposeOnActiveEditorChanged = new disposable_1.DisposableCollection();
        // The default root name to add external search results in the case that a workspace is opened.
        this.defaultRootName = nls_1.nls.localizeByDefault('Other files');
        this.forceVisibleRootNode = false;
        this.appliedDecorations = new Map();
        this.changeEmitter = new core_1.Emitter();
        this.onExpansionChangedEmitter = new core_1.Emitter();
        this.onExpansionChanged = this.onExpansionChangedEmitter.event;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.focusInputEmitter = new core_1.Emitter();
        this.remove = (node, e) => this.doRemove(node, e);
        model.root = {
            id: ROOT_ID,
            parent: undefined,
            visible: false,
            children: []
        };
        this.toDispose.push(model.onSelectionChanged(nodes => {
            const node = nodes[0];
            if (SearchInWorkspaceResultLineNode.is(node)) {
                this.doOpen(node, true, true);
            }
        }));
        this.toDispose.push(model.onOpenNode(node => {
            if (SearchInWorkspaceResultLineNode.is(node)) {
                this.doOpen(node, true, false);
            }
        }));
        this.resultTree = new Map();
        this.toDispose.push(model.onNodeRefreshed(() => this.changeEmitter.fire(this.resultTree)));
    }
    init() {
        super.init();
        this.addClass('resultContainer');
        this.toDispose.push(this.changeEmitter);
        this.toDispose.push(this.focusInputEmitter);
        this.toDispose.push(this.editorManager.onActiveEditorChanged(activeEditor => {
            this.updateCurrentEditorDecorations();
            this.toDisposeOnActiveEditorChanged.dispose();
            this.toDispose.push(this.toDisposeOnActiveEditorChanged);
            if (activeEditor) {
                this.toDisposeOnActiveEditorChanged.push(activeEditor.editor.onDocumentContentChanged(() => {
                    if (this.searchTerm !== '' && this.searchInWorkspacePreferences['search.searchOnEditorModification']) {
                        this.startSearchOnModification(activeEditor)();
                    }
                }));
            }
        }));
        this.toDispose.push(this.searchInWorkspacePreferences.onPreferenceChanged(() => {
            this.update();
        }));
        this.toDispose.push(this.fileService.onDidFilesChange(event => {
            if (event.gotDeleted()) {
                event.getDeleted().forEach(deletedFile => {
                    const fileNodes = this.getFileNodesByUri(deletedFile.resource);
                    fileNodes.forEach(node => this.removeFileNode(node));
                });
                this.model.refresh();
            }
        }));
        this.toDispose.push(this.model.onExpansionChanged(() => {
            this.onExpansionChangedEmitter.fire(undefined);
        }));
    }
    get fileNumber() {
        let num = 0;
        for (const rootFolderNode of this.resultTree.values()) {
            num += rootFolderNode.children.length;
        }
        return num;
    }
    set showReplaceButtons(srb) {
        this._showReplaceButtons = srb;
        this.update();
    }
    set replaceTerm(rt) {
        this._replaceTerm = rt;
        this.update();
    }
    get isReplacing() {
        return this._replaceTerm !== '' && this._showReplaceButtons;
    }
    get onChange() {
        return this.changeEmitter.event;
    }
    get onFocusInput() {
        return this.focusInputEmitter.event;
    }
    collapseAll() {
        for (const rootFolderNode of this.resultTree.values()) {
            for (const fileNode of rootFolderNode.children) {
                this.expansionService.collapseNode(fileNode);
            }
            if (rootFolderNode.visible) {
                this.expansionService.collapseNode(rootFolderNode);
            }
        }
    }
    expandAll() {
        for (const rootFolderNode of this.resultTree.values()) {
            for (const fileNode of rootFolderNode.children) {
                this.expansionService.expandNode(fileNode);
            }
            if (rootFolderNode.visible) {
                this.expansionService.expandNode(rootFolderNode);
            }
        }
    }
    areResultsCollapsed() {
        for (const rootFolderNode of this.resultTree.values()) {
            for (const fileNode of rootFolderNode.children) {
                if (!browser_1.ExpandableTreeNode.isCollapsed(fileNode)) {
                    return false;
                }
            }
        }
        return true;
    }
    /**
     * Find matches for the given editor.
     * @param searchTerm the search term.
     * @param widget the editor widget.
     * @param searchOptions the search options to apply.
     *
     * @returns the list of matches.
     */
    findMatches(searchTerm, widget, searchOptions) {
        if (!widget.editor.document.findMatches) {
            return [];
        }
        const results = widget.editor.document.findMatches({
            searchString: searchTerm,
            isRegex: !!searchOptions.useRegExp,
            matchCase: !!searchOptions.matchCase,
            matchWholeWord: !!searchOptions.matchWholeWord,
            limitResultCount: searchOptions.maxResults
        });
        const matches = [];
        results.forEach(r => {
            const lineText = widget.editor.document.getLineContent(r.range.start.line);
            matches.push({
                line: r.range.start.line,
                character: r.range.start.character,
                length: r.range.end.character - r.range.start.character,
                lineText
            });
        });
        return matches;
    }
    /**
     * Convert a pattern to match all directories.
     * @param workspaceRootUri the uri of the current workspace root.
     * @param pattern the pattern to be converted.
     */
    convertPatternToGlob(workspaceRootUri, pattern) {
        if (pattern.startsWith('**/')) {
            return pattern;
        }
        if (pattern.startsWith('./')) {
            if (workspaceRootUri === undefined) {
                return pattern;
            }
            return workspaceRootUri.toString() + pattern.replace('./', '/');
        }
        return pattern.startsWith('/')
            ? '**' + pattern
            : '**/' + pattern;
    }
    /**
     * Determine if the URI matches any of the patterns.
     * @param uri the editor URI.
     * @param patterns the glob patterns to verify.
     */
    inPatternList(uri, patterns) {
        const opts = { dot: true, matchBase: true };
        return patterns.some(pattern => minimatch(uri.toString(), this.convertPatternToGlob(this.workspaceService.getWorkspaceRootUri(uri), pattern), opts));
    }
    /**
     * Determine if the given editor satisfies the filtering criteria.
     * An editor should be searched only if:
     * - it is not excluded through the `excludes` list.
     * - it is not explicitly present in a non-empty `includes` list.
     */
    shouldApplySearch(editorWidget, searchOptions) {
        const excludePatterns = this.getExcludeGlobs(searchOptions.exclude);
        if (this.inPatternList(editorWidget.editor.uri, excludePatterns)) {
            return false;
        }
        const includePatterns = searchOptions.include;
        if (!!(includePatterns === null || includePatterns === void 0 ? void 0 : includePatterns.length) && !this.inPatternList(editorWidget.editor.uri, includePatterns)) {
            return false;
        }
        return true;
    }
    /**
     * Search the active editor only and update the tree with those results.
     */
    searchActiveEditor(activeEditor, searchTerm, searchOptions) {
        const includesExternalResults = () => !!this.resultTree.get(this.defaultRootName);
        // Check if outside workspace results are present before searching.
        const hasExternalResultsBefore = includesExternalResults();
        // Collect search results for the given editor.
        const results = this.searchInEditor(activeEditor, searchTerm, searchOptions);
        // Update the tree by removing the result node, and add new results if applicable.
        this.getFileNodesByUri(activeEditor.editor.uri).forEach(fileNode => this.removeFileNode(fileNode));
        if (results) {
            this.appendToResultTree(results);
        }
        // Check if outside workspace results are present after searching.
        const hasExternalResultsAfter = includesExternalResults();
        // Redo a search to update the tree node visibility if:
        // + `Other files` node was present, now it is not.
        // + `Other files` node was not present, now it is.
        if (hasExternalResultsBefore ? !hasExternalResultsAfter : hasExternalResultsAfter) {
            this.search(this.searchTerm, this.searchOptions);
            return;
        }
        this.handleSearchCompleted();
    }
    /**
     * Perform a search in all open editors.
     * @param searchTerm the search term.
     * @param searchOptions the search options to apply.
     *
     * @returns the tuple of result count, and the list of search results.
     */
    searchInOpenEditors(searchTerm, searchOptions) {
        // Track the number of results found.
        let numberOfResults = 0;
        const searchResults = [];
        this.editorManager.all.forEach(e => {
            const editorResults = this.searchInEditor(e, searchTerm, searchOptions);
            if (editorResults) {
                numberOfResults += editorResults.matches.length;
                searchResults.push(editorResults);
            }
        });
        return {
            numberOfResults,
            matches: searchResults
        };
    }
    /**
     * Perform a search in the target editor.
     * @param editorWidget the editor widget.
     * @param searchTerm the search term.
     * @param searchOptions the search options to apply.
     *
     * @returns the search results from the given editor, undefined if the editor is either filtered or has no matches found.
     */
    searchInEditor(editorWidget, searchTerm, searchOptions) {
        var _a;
        if (!this.shouldApplySearch(editorWidget, searchOptions)) {
            return undefined;
        }
        const matches = this.findMatches(searchTerm, editorWidget, searchOptions);
        if (matches.length <= 0) {
            return undefined;
        }
        const fileUri = editorWidget.editor.uri.toString();
        const root = (_a = this.workspaceService.getWorkspaceRootUri(editorWidget.editor.uri)) === null || _a === void 0 ? void 0 : _a.toString();
        return {
            root: root !== null && root !== void 0 ? root : this.defaultRootName,
            fileUri,
            matches
        };
    }
    /**
     * Append search results to the result tree.
     * @param result Search result.
     */
    appendToResultTree(result) {
        const collapseValue = this.searchInWorkspacePreferences['search.collapseResults'];
        let path;
        if (result.root === this.defaultRootName) {
            path = new uri_1.default(result.fileUri).path.dir.fsPath();
        }
        else {
            path = this.filenameAndPath(result.root, result.fileUri).path;
        }
        const tree = this.resultTree;
        let rootFolderNode = tree.get(result.root);
        if (!rootFolderNode) {
            rootFolderNode = this.createRootFolderNode(result.root);
            tree.set(result.root, rootFolderNode);
        }
        let fileNode = rootFolderNode.children.find(f => f.fileUri === result.fileUri);
        if (!fileNode) {
            fileNode = this.createFileNode(result.root, path, result.fileUri, rootFolderNode);
            rootFolderNode.children.push(fileNode);
        }
        for (const match of result.matches) {
            const line = this.createResultLineNode(result, match, fileNode);
            if (fileNode.children.findIndex(lineNode => lineNode.id === line.id) < 0) {
                fileNode.children.push(line);
            }
        }
        this.collapseFileNode(fileNode, collapseValue);
    }
    /**
     * Handle when searching completed.
     */
    handleSearchCompleted(cancelIndicator) {
        if (cancelIndicator) {
            cancelIndicator.cancel();
        }
        this.sortResultTree();
        this.refreshModelChildren();
    }
    /**
     * Sort the result tree by URIs.
     */
    sortResultTree() {
        // Sort the result map by folder URI.
        const entries = [...this.resultTree.entries()];
        entries.sort(([, a], [, b]) => this.compare(a.folderUri, b.folderUri));
        this.resultTree = new Map(entries);
        // Update the list of children nodes, sorting them by their file URI.
        entries.forEach(([, folder]) => {
            folder.children.sort((a, b) => this.compare(a.fileUri, b.fileUri));
        });
    }
    /**
     * Search and populate the result tree with matches.
     * @param searchTerm the search term.
     * @param searchOptions the search options to apply.
     */
    async search(searchTerm, searchOptions) {
        this.searchTerm = searchTerm;
        this.searchOptions = searchOptions;
        searchOptions = {
            ...searchOptions,
            exclude: this.getExcludeGlobs(searchOptions.exclude)
        };
        this.resultTree.clear();
        this.forceVisibleRootNode = false;
        if (this.cancelIndicator) {
            this.cancelIndicator.cancel();
        }
        if (searchTerm === '') {
            this.refreshModelChildren();
            return;
        }
        this.cancelIndicator = new core_1.CancellationTokenSource();
        const cancelIndicator = this.cancelIndicator;
        const token = this.cancelIndicator.token;
        const progress = await this.progressService.showProgress({ text: `search: ${searchTerm}`, options: { location: 'search' } });
        token.onCancellationRequested(() => {
            progress.cancel();
            if (searchId) {
                this.searchService.cancel(searchId);
            }
            this.cancelIndicator = undefined;
            this.changeEmitter.fire(this.resultTree);
        });
        // Collect search results for opened editors which otherwise may not be found by ripgrep (ex: dirty editors).
        const { numberOfResults, matches } = this.searchInOpenEditors(searchTerm, searchOptions);
        // The root node is visible if outside workspace results are found and workspace root(s) are present.
        this.forceVisibleRootNode = matches.some(m => m.root === this.defaultRootName) && this.workspaceService.opened;
        matches.forEach(m => this.appendToResultTree(m));
        // Exclude files already covered by searching open editors.
        this.editorManager.all.forEach(e => {
            const excludePath = e.editor.uri.path.toString();
            searchOptions.exclude = searchOptions.exclude ? searchOptions.exclude.concat(excludePath) : [excludePath];
        });
        // Reduce `maxResults` due to editor results.
        if (searchOptions.maxResults) {
            searchOptions.maxResults -= numberOfResults;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let pendingRefreshTimeout;
        const searchId = await this.searchService.search(searchTerm, {
            onResult: (aSearchId, result) => {
                if (token.isCancellationRequested || aSearchId !== searchId) {
                    return;
                }
                this.appendToResultTree(result);
                if (pendingRefreshTimeout) {
                    clearTimeout(pendingRefreshTimeout);
                }
                pendingRefreshTimeout = setTimeout(() => this.refreshModelChildren(), 100);
            },
            onDone: () => {
                this.handleSearchCompleted(cancelIndicator);
            }
        }, searchOptions).catch(() => {
            this.handleSearchCompleted(cancelIndicator);
        });
    }
    focusFirstResult() {
        if (SearchInWorkspaceRoot.is(this.model.root) && this.model.root.children.length > 0) {
            const node = this.model.root.children[0];
            if (browser_1.SelectableTreeNode.is(node)) {
                this.node.focus();
                this.model.selectNode(node);
            }
        }
    }
    /**
     * Collapse the search-in-workspace file node
     * based on the preference value.
     */
    collapseFileNode(node, preferenceValue) {
        if (preferenceValue === 'auto' && node.children.length >= 10) {
            node.expanded = false;
        }
        else if (preferenceValue === 'alwaysCollapse') {
            node.expanded = false;
        }
        else if (preferenceValue === 'alwaysExpand') {
            node.expanded = true;
        }
    }
    handleUp(event) {
        if (!this.model.getPrevSelectableNode(this.model.getFocusedNode())) {
            this.focusInputEmitter.fire(true);
        }
        else {
            super.handleUp(event);
        }
    }
    async refreshModelChildren() {
        if (SearchInWorkspaceRoot.is(this.model.root)) {
            this.model.root.children = Array.from(this.resultTree.values());
            this.model.refresh();
            this.updateCurrentEditorDecorations();
        }
    }
    updateCurrentEditorDecorations() {
        this.shell.allTabBars.forEach(tb => {
            const currentTitle = tb.currentTitle;
            if (currentTitle && currentTitle.owner instanceof browser_2.EditorWidget) {
                const widget = currentTitle.owner;
                const fileNodes = this.getFileNodesByUri(widget.editor.uri);
                if (fileNodes.length > 0) {
                    fileNodes.forEach(node => {
                        this.decorateEditor(node, widget);
                    });
                }
                else {
                    this.decorateEditor(undefined, widget);
                }
            }
        });
        const currentWidget = this.editorManager.currentEditor;
        if (currentWidget) {
            const fileNodes = this.getFileNodesByUri(currentWidget.editor.uri);
            fileNodes.forEach(node => {
                this.decorateEditor(node, currentWidget);
            });
        }
    }
    createRootFolderNode(rootUri) {
        const uri = new uri_1.default(rootUri);
        return {
            selected: false,
            path: uri.path.fsPath(),
            folderUri: rootUri,
            uri: new uri_1.default(rootUri),
            children: [],
            expanded: true,
            id: rootUri,
            parent: this.model.root,
            visible: this.forceVisibleRootNode || this.workspaceService.isMultiRootWorkspaceOpened
        };
    }
    createFileNode(rootUri, path, fileUri, parent) {
        return {
            selected: false,
            path,
            children: [],
            expanded: true,
            id: `${rootUri}::${fileUri}`,
            parent,
            fileUri,
            uri: new uri_1.default(fileUri),
        };
    }
    createResultLineNode(result, match, fileNode) {
        return {
            ...result,
            ...match,
            selected: false,
            id: result.fileUri + '-' + match.line + '-' + match.character + '-' + match.length,
            name: typeof match.lineText === 'string' ? match.lineText : match.lineText.text,
            parent: fileNode
        };
    }
    getFileNodesByUri(uri) {
        const nodes = [];
        const fileUri = uri.withScheme('file').toString();
        for (const rootFolderNode of this.resultTree.values()) {
            const rootUri = new uri_1.default(rootFolderNode.path).withScheme('file');
            if (rootUri.isEqualOrParent(uri) || rootFolderNode.id === this.defaultRootName) {
                for (const fileNode of rootFolderNode.children) {
                    if (fileNode.fileUri === fileUri) {
                        nodes.push(fileNode);
                    }
                }
            }
        }
        return nodes;
    }
    filenameAndPath(rootUriStr, uriStr) {
        const uri = new uri_1.default(uriStr);
        const relativePath = new uri_1.default(rootUriStr).relative(uri.parent);
        return {
            name: this.labelProvider.getName(uri),
            path: relativePath ? relativePath.fsPath() : ''
        };
    }
    getDepthPadding(depth) {
        return super.getDepthPadding(depth) + 5;
    }
    renderCaption(node, props) {
        if (SearchInWorkspaceRootFolderNode.is(node)) {
            return this.renderRootFolderNode(node);
        }
        else if (SearchInWorkspaceFileNode.is(node)) {
            return this.renderFileNode(node);
        }
        else if (SearchInWorkspaceResultLineNode.is(node)) {
            return this.renderResultLineNode(node);
        }
        return '';
    }
    renderTailDecorations(node, props) {
        return React.createElement("div", { className: 'result-node-buttons' },
            this._showReplaceButtons && this.renderReplaceButton(node),
            this.renderRemoveButton(node));
    }
    doReplace(node, e) {
        const selection = browser_1.SelectableTreeNode.isSelected(node) ? this.selectionService.selection : [node];
        selection.forEach(n => this.replace(n));
        e.stopPropagation();
    }
    renderReplaceButton(node) {
        const isResultLineNode = SearchInWorkspaceResultLineNode.is(node);
        return React.createElement("span", { className: isResultLineNode ? (0, browser_1.codicon)('replace') : (0, browser_1.codicon)('replace-all'), onClick: e => this.doReplace(node, e), title: isResultLineNode
                ? nls_1.nls.localizeByDefault('Replace')
                : nls_1.nls.localizeByDefault('Replace All') });
    }
    getFileCount(node) {
        if (SearchInWorkspaceRoot.is(node)) {
            return node.children.reduce((acc, current) => acc + this.getFileCount(current), 0);
        }
        else if (SearchInWorkspaceRootFolderNode.is(node)) {
            return node.children.length;
        }
        else if (SearchInWorkspaceFileNode.is(node)) {
            return 1;
        }
        return 0;
    }
    getResultCount(node) {
        if (SearchInWorkspaceRoot.is(node)) {
            return node.children.reduce((acc, current) => acc + this.getResultCount(current), 0);
        }
        else if (SearchInWorkspaceRootFolderNode.is(node)) {
            return node.children.reduce((acc, current) => acc + this.getResultCount(current), 0);
        }
        else if (SearchInWorkspaceFileNode.is(node)) {
            return node.children.length;
        }
        else if (SearchInWorkspaceResultLineNode.is(node)) {
            return 1;
        }
        return 0;
    }
    /**
     * Replace results under the node passed into the function. If node is undefined, replace all results.
     * @param node Node in the tree widget where the "replace all" operation is performed
     */
    async replace(node) {
        const replaceForNode = node || this.model.root;
        const needConfirm = !SearchInWorkspaceFileNode.is(node) && !SearchInWorkspaceResultLineNode.is(node);
        const replacementText = this._replaceTerm;
        if (!needConfirm || await this.confirmReplaceAll(this.getResultCount(replaceForNode), this.getFileCount(replaceForNode), replacementText)) {
            (node ? [node] : Array.from(this.resultTree.values())).forEach(n => {
                this.replaceResult(n, !!node, replacementText);
                this.removeNode(n);
            });
        }
    }
    confirmReplaceAll(resultNumber, fileNumber, replacementText) {
        return new browser_1.ConfirmDialog({
            title: nls_1.nls.localizeByDefault('Replace All'),
            msg: this.buildReplaceAllConfirmationMessage(resultNumber, fileNumber, replacementText)
        }).open();
    }
    buildReplaceAllConfirmationMessage(occurrences, fileCount, replaceValue) {
        if (occurrences === 1) {
            if (fileCount === 1) {
                if (replaceValue) {
                    return nls_1.nls.localizeByDefault("Replace {0} occurrence across {1} file with '{2}'?", occurrences, fileCount, replaceValue);
                }
                return nls_1.nls.localizeByDefault('Replace {0} occurrence across {1} file?', occurrences, fileCount);
            }
            if (replaceValue) {
                return nls_1.nls.localizeByDefault("Replace {0} occurrence across {1} files with '{2}'?", occurrences, fileCount, replaceValue);
            }
            return nls_1.nls.localizeByDefault('Replace {0} occurrence across {1} files?', occurrences, fileCount);
        }
        if (fileCount === 1) {
            if (replaceValue) {
                return nls_1.nls.localizeByDefault("Replace {0} occurrences across {1} file with '{2}'?", occurrences, fileCount, replaceValue);
            }
            return nls_1.nls.localizeByDefault('Replace {0} occurrences across {1} file?', occurrences, fileCount);
        }
        if (replaceValue) {
            return nls_1.nls.localizeByDefault("Replace {0} occurrences across {1} files with '{2}'?", occurrences, fileCount, replaceValue);
        }
        return nls_1.nls.localizeByDefault('Replace {0} occurrences across {1} files?', occurrences, fileCount);
    }
    updateRightResults(node) {
        const fileNode = node.parent;
        const rightPositionedNodes = fileNode.children.filter(rl => rl.line === node.line && rl.character > node.character);
        const diff = this._replaceTerm.length - this.searchTerm.length;
        rightPositionedNodes.forEach(r => r.character += diff);
    }
    /**
     * Replace text either in all search matches under a node or in all search matches, and save the changes.
     * @param node - node in the tree widget in which the "replace all" is performed.
     * @param {boolean} replaceOne - whether the function is to replace all matches under a node. If it is false, replace all.
     * @param replacementText - text to be used for all replacements in the current replacement cycle.
     */
    async replaceResult(node, replaceOne, replacementText) {
        const toReplace = [];
        if (SearchInWorkspaceRootFolderNode.is(node)) {
            node.children.forEach(fileNode => this.replaceResult(fileNode, replaceOne, replacementText));
        }
        else if (SearchInWorkspaceFileNode.is(node)) {
            toReplace.push(...node.children);
        }
        else if (SearchInWorkspaceResultLineNode.is(node)) {
            toReplace.push(node);
            this.updateRightResults(node);
        }
        if (toReplace.length > 0) {
            // Store the state of all tracked editors before another editor widget might be created for text replacing.
            const trackedEditors = this.editorManager.all;
            // Open the file only if the function is called to replace all matches under a specific node.
            const widget = replaceOne ? await this.doOpen(toReplace[0]) : await this.doGetWidget(toReplace[0]);
            const source = widget.editor.document.getText();
            const replaceOperations = toReplace.map(resultLineNode => ({
                text: replacementText,
                range: {
                    start: {
                        line: resultLineNode.line - 1,
                        character: resultLineNode.character - 1
                    },
                    end: {
                        line: resultLineNode.line - 1,
                        character: resultLineNode.character - 1 + resultLineNode.length
                    }
                }
            }));
            // Replace the text.
            await widget.editor.replaceText({
                source,
                replaceOperations
            });
            // Save the text replacement changes in the editor.
            await widget.saveable.save();
            // Dispose the widget if it is not opened but created for `replaceAll`.
            if (!replaceOne) {
                if (trackedEditors.indexOf(widget) === -1) {
                    widget.dispose();
                }
            }
        }
    }
    doRemove(node, e) {
        const selection = browser_1.SelectableTreeNode.isSelected(node) ? this.selectionService.selection : [node];
        selection.forEach(n => this.removeNode(n));
        e.stopPropagation();
    }
    renderRemoveButton(node) {
        return React.createElement("span", { className: (0, browser_1.codicon)('close'), onClick: e => this.remove(node, e), title: 'Dismiss' });
    }
    removeNode(node) {
        if (SearchInWorkspaceRootFolderNode.is(node)) {
            this.removeRootFolderNode(node);
        }
        else if (SearchInWorkspaceFileNode.is(node)) {
            this.removeFileNode(node);
        }
        else if (SearchInWorkspaceResultLineNode.is(node)) {
            this.removeResultLineNode(node);
        }
        this.refreshModelChildren();
    }
    removeRootFolderNode(node) {
        for (const rootUri of this.resultTree.keys()) {
            if (rootUri === node.folderUri) {
                this.resultTree.delete(rootUri);
                break;
            }
        }
    }
    removeFileNode(node) {
        const rootFolderNode = node.parent;
        const index = rootFolderNode.children.findIndex(fileNode => fileNode.id === node.id);
        if (index > -1) {
            rootFolderNode.children.splice(index, 1);
        }
        if (this.getFileCount(rootFolderNode) === 0) {
            this.removeRootFolderNode(rootFolderNode);
        }
    }
    removeResultLineNode(node) {
        const fileNode = node.parent;
        const index = fileNode.children.findIndex(n => n.fileUri === node.fileUri && n.line === node.line && n.character === node.character);
        if (index > -1) {
            fileNode.children.splice(index, 1);
            if (this.getResultCount(fileNode) === 0) {
                this.removeFileNode(fileNode);
            }
        }
    }
    renderRootFolderNode(node) {
        return React.createElement("div", { className: 'result' },
            React.createElement("div", { className: 'result-head' },
                React.createElement("div", { className: `result-head-info noWrapInfo noselect ${node.selected ? 'selected' : ''}` },
                    React.createElement("span", { className: `file-icon ${this.toNodeIcon(node) || ''}` }),
                    React.createElement("div", { className: 'noWrapInfo' },
                        React.createElement("span", { className: 'file-name' }, this.toNodeName(node)),
                        node.path !== '/' + this.defaultRootName &&
                            React.createElement("span", { className: 'file-path ' + browser_1.TREE_NODE_INFO_CLASS }, node.path))),
                React.createElement("span", { className: 'notification-count-container highlighted-count-container' },
                    React.createElement("span", { className: 'notification-count' }, this.getFileCount(node)))));
    }
    renderFileNode(node) {
        return React.createElement("div", { className: 'result' },
            React.createElement("div", { className: 'result-head' },
                React.createElement("div", { className: `result-head-info noWrapInfo noselect ${node.selected ? 'selected' : ''}`, title: new uri_1.default(node.fileUri).path.fsPath() },
                    React.createElement("span", { className: `file-icon ${this.toNodeIcon(node)}` }),
                    React.createElement("div", { className: 'noWrapInfo' },
                        React.createElement("span", { className: 'file-name' }, this.toNodeName(node)),
                        React.createElement("span", { className: 'file-path ' + browser_1.TREE_NODE_INFO_CLASS }, node.path))),
                React.createElement("span", { className: 'notification-count-container' },
                    React.createElement("span", { className: 'notification-count' }, this.getResultCount(node)))));
    }
    renderResultLineNode(node) {
        const character = typeof node.lineText === 'string' ? node.character : node.lineText.character;
        const lineText = typeof node.lineText === 'string' ? node.lineText : node.lineText.text;
        let start = Math.max(0, character - 26);
        const wordBreak = /\b/g;
        while (start > 0 && wordBreak.test(lineText) && wordBreak.lastIndex < character) {
            if (character - wordBreak.lastIndex < 26) {
                break;
            }
            start = wordBreak.lastIndex;
            wordBreak.lastIndex++;
        }
        const before = lineText.slice(start, character - 1).trimLeft();
        return React.createElement("div", { className: `resultLine noWrapInfo noselect ${node.selected ? 'selected' : ''}`, title: lineText.trim() },
            this.searchInWorkspacePreferences['search.lineNumbers'] && React.createElement("span", { className: 'theia-siw-lineNumber' }, node.line),
            React.createElement("span", null, before),
            this.renderMatchLinePart(node),
            React.createElement("span", null, lineText.slice(node.character + node.length - 1, 250 - before.length + node.length)));
    }
    renderMatchLinePart(node) {
        const replaceTerm = this.isReplacing ? React.createElement("span", { className: 'replace-term' }, this._replaceTerm) : '';
        const className = `match${this.isReplacing ? ' strike-through' : ''}`;
        const match = typeof node.lineText === 'string' ?
            node.lineText.substring(node.character - 1, node.length + node.character - 1)
            : node.lineText.text.substring(node.lineText.character - 1, node.length + node.lineText.character - 1);
        return React.createElement(React.Fragment, null,
            React.createElement("span", { className: className }, match),
            replaceTerm);
    }
    /**
     * Get the editor widget by the node.
     * @param {SearchInWorkspaceResultLineNode} node - the node representing a match in the search results.
     * @returns The editor widget to which the text replace will be done.
     */
    async doGetWidget(node) {
        const fileUri = new uri_1.default(node.fileUri);
        const editorWidget = await this.editorManager.getOrCreateByUri(fileUri);
        return editorWidget;
    }
    async doOpen(node, asDiffWidget = false, preview = false) {
        let fileUri;
        const resultNode = node.parent;
        if (resultNode && this.isReplacing && asDiffWidget) {
            const leftUri = new uri_1.default(node.fileUri);
            const rightUri = await this.createReplacePreview(resultNode);
            fileUri = browser_1.DiffUris.encode(leftUri, rightUri);
        }
        else {
            fileUri = new uri_1.default(node.fileUri);
        }
        const opts = {
            selection: {
                start: {
                    line: node.line - 1,
                    character: node.character - 1
                },
                end: {
                    line: node.line - 1,
                    character: node.character - 1 + node.length
                }
            },
            mode: preview ? 'reveal' : 'activate',
            preview,
        };
        const editorWidget = await this.editorManager.open(fileUri, opts);
        if (!browser_1.DiffUris.isDiffUri(fileUri)) {
            this.decorateEditor(resultNode, editorWidget);
        }
        return editorWidget;
    }
    async createReplacePreview(node) {
        const fileUri = new uri_1.default(node.fileUri).withScheme('file');
        const openedEditor = this.editorManager.all.find(({ editor }) => editor.uri.toString() === fileUri.toString());
        let content;
        if (openedEditor) {
            content = openedEditor.editor.document.getText();
        }
        else {
            const resource = await this.fileResourceResolver.resolve(fileUri);
            content = await resource.readContents();
        }
        const lines = content.split('\n');
        node.children.forEach(l => {
            const leftPositionedNodes = node.children.filter(rl => rl.line === l.line && rl.character < l.character);
            const diff = (this._replaceTerm.length - this.searchTerm.length) * leftPositionedNodes.length;
            const start = lines[l.line - 1].substring(0, l.character - 1 + diff);
            const end = lines[l.line - 1].substring(l.character - 1 + diff + l.length);
            lines[l.line - 1] = start + this._replaceTerm + end;
        });
        return fileUri.withScheme(common_1.MEMORY_TEXT).withQuery(lines.join('\n'));
    }
    decorateEditor(node, editorWidget) {
        if (!browser_1.DiffUris.isDiffUri(editorWidget.editor.uri)) {
            const key = `${editorWidget.editor.uri.toString()}#search-in-workspace-matches`;
            const oldDecorations = this.appliedDecorations.get(key) || [];
            const newDecorations = this.createEditorDecorations(node);
            const appliedDecorations = editorWidget.editor.deltaDecorations({
                newDecorations,
                oldDecorations,
            });
            this.appliedDecorations.set(key, appliedDecorations);
        }
    }
    createEditorDecorations(resultNode) {
        const decorations = [];
        if (resultNode) {
            resultNode.children.forEach(res => {
                decorations.push({
                    range: {
                        start: {
                            line: res.line - 1,
                            character: res.character - 1
                        },
                        end: {
                            line: res.line - 1,
                            character: res.character - 1 + res.length
                        }
                    },
                    options: {
                        overviewRuler: {
                            color: {
                                id: 'editor.findMatchHighlightBackground'
                            },
                            position: browser_2.OverviewRulerLane.Center
                        },
                        className: res.selected ? 'current-search-in-workspace-editor-match' : 'search-in-workspace-editor-match',
                        stickiness: browser_2.TrackedRangeStickiness.GrowsOnlyWhenTypingBefore
                    }
                });
            });
        }
        return decorations;
    }
    /**
     * Get the list of exclude globs.
     * @param excludeOptions the exclude search option.
     *
     * @returns the list of exclude globs.
     */
    getExcludeGlobs(excludeOptions) {
        const excludePreferences = this.filesystemPreferences['files.exclude'];
        const excludePreferencesGlobs = Object.keys(excludePreferences).filter(key => !!excludePreferences[key]);
        return [...new Set([...excludePreferencesGlobs, ...excludeOptions || []])];
    }
    /**
     * Compare two normalized strings.
     *
     * @param a {string} the first string.
     * @param b {string} the second string.
     */
    compare(a, b) {
        const itemA = a.toLowerCase().trim();
        const itemB = b.toLowerCase().trim();
        return itemA.localeCompare(itemB);
    }
    /**
     * @param recursive if true, all child nodes will be included in the stringified result.
     */
    nodeToString(node, recursive) {
        if (SearchInWorkspaceFileNode.is(node) || SearchInWorkspaceRootFolderNode.is(node)) {
            if (recursive) {
                return this.nodeIteratorToString(new browser_1.TopDownTreeIterator(node, { pruneSiblings: true }));
            }
            return this.labelProvider.getLongName(node.uri);
        }
        if (SearchInWorkspaceResultLineNode.is(node)) {
            return `  ${node.line}:${node.character}: ${node.lineText}`;
        }
        return '';
    }
    treeToString() {
        return this.nodeIteratorToString(this.getVisibleNodes());
    }
    *getVisibleNodes() {
        for (const { node } of this.rows.values()) {
            yield node;
        }
    }
    nodeIteratorToString(nodes) {
        const strings = [];
        for (const node of nodes) {
            const string = this.nodeToString(node, false);
            if (string.length !== 0) {
                strings.push(string);
            }
        }
        return strings.join(core_1.EOL);
    }
};
__decorate([
    (0, inversify_1.inject)(search_in_workspace_service_1.SearchInWorkspaceService),
    __metadata("design:type", search_in_workspace_service_1.SearchInWorkspaceService)
], SearchInWorkspaceResultTreeWidget.prototype, "searchService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.EditorManager),
    __metadata("design:type", browser_2.EditorManager)
], SearchInWorkspaceResultTreeWidget.prototype, "editorManager", void 0);
__decorate([
    (0, inversify_1.inject)(browser_4.FileResourceResolver),
    __metadata("design:type", browser_4.FileResourceResolver)
], SearchInWorkspaceResultTreeWidget.prototype, "fileResourceResolver", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.ApplicationShell),
    __metadata("design:type", browser_1.ApplicationShell)
], SearchInWorkspaceResultTreeWidget.prototype, "shell", void 0);
__decorate([
    (0, inversify_1.inject)(browser_3.WorkspaceService),
    __metadata("design:type", browser_3.WorkspaceService)
], SearchInWorkspaceResultTreeWidget.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.TreeExpansionService),
    __metadata("design:type", Object)
], SearchInWorkspaceResultTreeWidget.prototype, "expansionService", void 0);
__decorate([
    (0, inversify_1.inject)(search_in_workspace_preferences_1.SearchInWorkspacePreferences),
    __metadata("design:type", Object)
], SearchInWorkspaceResultTreeWidget.prototype, "searchInWorkspacePreferences", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.ProgressService),
    __metadata("design:type", core_1.ProgressService)
], SearchInWorkspaceResultTreeWidget.prototype, "progressService", void 0);
__decorate([
    (0, inversify_1.inject)(color_registry_1.ColorRegistry),
    __metadata("design:type", color_registry_1.ColorRegistry)
], SearchInWorkspaceResultTreeWidget.prototype, "colorRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(browser_4.FileSystemPreferences),
    __metadata("design:type", Object)
], SearchInWorkspaceResultTreeWidget.prototype, "filesystemPreferences", void 0);
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], SearchInWorkspaceResultTreeWidget.prototype, "fileService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SearchInWorkspaceResultTreeWidget.prototype, "init", null);
SearchInWorkspaceResultTreeWidget = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(browser_1.TreeProps)),
    __param(1, (0, inversify_1.inject)(browser_1.TreeModel)),
    __param(2, (0, inversify_1.inject)(browser_1.ContextMenuRenderer)),
    __metadata("design:paramtypes", [Object, Object, browser_1.ContextMenuRenderer])
], SearchInWorkspaceResultTreeWidget);
exports.SearchInWorkspaceResultTreeWidget = SearchInWorkspaceResultTreeWidget;
(function (SearchInWorkspaceResultTreeWidget) {
    let Menus;
    (function (Menus) {
        Menus.BASE = ['siw-tree-context-menu'];
        /** Dismiss command, or others that only affect the widget itself */
        Menus.INTERNAL = [...Menus.BASE, '1_internal'];
        /** Copy a stringified representation of content */
        Menus.COPY = [...Menus.BASE, '2_copy'];
        /** Commands that lead out of the widget, like revealing a file in the navigator */
        Menus.EXTERNAL = [...Menus.BASE, '3_external'];
    })(Menus = SearchInWorkspaceResultTreeWidget.Menus || (SearchInWorkspaceResultTreeWidget.Menus = {}));
})(SearchInWorkspaceResultTreeWidget = exports.SearchInWorkspaceResultTreeWidget || (exports.SearchInWorkspaceResultTreeWidget = {}));
exports.SearchInWorkspaceResultTreeWidget = SearchInWorkspaceResultTreeWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/search-in-workspace/lib/browser/search-in-workspace-result-tree-widget'] = this;


/***/ }),

/***/ "../../packages/search-in-workspace/lib/browser/search-in-workspace-service.js":
/*!*************************************************************************************!*\
  !*** ../../packages/search-in-workspace/lib/browser/search-in-workspace-service.js ***!
  \*************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2017-2018 Ericsson and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SearchInWorkspaceService = exports.SearchInWorkspaceClientImpl = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const search_in_workspace_interface_1 = __webpack_require__(/*! ../common/search-in-workspace-interface */ "../../packages/search-in-workspace/lib/common/search-in-workspace-interface.js");
const browser_1 = __webpack_require__(/*! @theia/workspace/lib/browser */ "../../packages/workspace/lib/browser/index.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
/**
 * Class that will receive the search results from the server.  This is separate
 * from the SearchInWorkspaceService class only to avoid a cycle in the
 * dependency injection.
 */
let SearchInWorkspaceClientImpl = class SearchInWorkspaceClientImpl {
    onResult(searchId, result) {
        this.service.onResult(searchId, result);
    }
    onDone(searchId, error) {
        this.service.onDone(searchId, error);
    }
    setService(service) {
        this.service = service;
    }
};
SearchInWorkspaceClientImpl = __decorate([
    (0, inversify_1.injectable)()
], SearchInWorkspaceClientImpl);
exports.SearchInWorkspaceClientImpl = SearchInWorkspaceClientImpl;
/**
 * Service to search text in the workspace files.
 */
let SearchInWorkspaceService = class SearchInWorkspaceService {
    constructor() {
        // All the searches that we have started, that are not done yet (onDone
        // with that searchId has not been called).
        this.pendingSearches = new Map();
        // Due to the asynchronicity of the node backend, it's possible that we
        // start a search, receive an event for that search, and then receive
        // the search id for that search.We therefore need to keep those
        // events until we get the search id and return it to the caller.
        // Otherwise the caller would discard the event because it doesn't know
        // the search id yet.
        this.pendingOnDones = new Map();
        this.lastKnownSearchId = -1;
    }
    init() {
        this.client.setService(this);
    }
    isEnabled() {
        return this.workspaceService.opened;
    }
    onResult(searchId, result) {
        const callbacks = this.pendingSearches.get(searchId);
        if (callbacks) {
            callbacks.onResult(searchId, result);
        }
    }
    onDone(searchId, error) {
        const callbacks = this.pendingSearches.get(searchId);
        if (callbacks) {
            this.pendingSearches.delete(searchId);
            callbacks.onDone(searchId, error);
        }
        else {
            if (searchId > this.lastKnownSearchId) {
                this.logger.debug(`Got an onDone for a searchId we don't know about (${searchId}), stashing it for later with error = `, error);
                this.pendingOnDones.set(searchId, error);
            }
            else {
                // It's possible to receive an onDone for a search we have cancelled.  Just ignore it.
                this.logger.debug(`Got an onDone for a searchId we don't know about (${searchId}), but it's probably an old one, error = `, error);
            }
        }
    }
    // Start a search of the string "what" in the workspace.
    async search(what, callbacks, opts) {
        if (!this.workspaceService.opened) {
            throw new Error('Search failed: no workspace root.');
        }
        const roots = await this.workspaceService.roots;
        return this.doSearch(what, roots.map(r => r.resource.toString()), callbacks, opts);
    }
    async doSearch(what, rootsUris, callbacks, opts) {
        const searchId = await this.searchServer.search(what, rootsUris, opts);
        this.pendingSearches.set(searchId, callbacks);
        this.lastKnownSearchId = searchId;
        this.logger.debug('Service launched search ' + searchId);
        // Check if we received an onDone before search() returned.
        if (this.pendingOnDones.has(searchId)) {
            this.logger.debug('Ohh, we have a stashed onDone for that searchId');
            const error = this.pendingOnDones.get(searchId);
            this.pendingOnDones.delete(searchId);
            // Call the client's searchId, but first give it a
            // chance to record the returned searchId.
            setTimeout(() => {
                this.onDone(searchId, error);
            }, 0);
        }
        return searchId;
    }
    async searchWithCallback(what, rootsUris, callbacks, opts) {
        return this.doSearch(what, rootsUris, callbacks, opts);
    }
    // Cancel an ongoing search.
    cancel(searchId) {
        this.pendingSearches.delete(searchId);
        this.searchServer.cancel(searchId);
    }
};
__decorate([
    (0, inversify_1.inject)(search_in_workspace_interface_1.SearchInWorkspaceServer),
    __metadata("design:type", Object)
], SearchInWorkspaceService.prototype, "searchServer", void 0);
__decorate([
    (0, inversify_1.inject)(SearchInWorkspaceClientImpl),
    __metadata("design:type", SearchInWorkspaceClientImpl)
], SearchInWorkspaceService.prototype, "client", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.WorkspaceService),
    __metadata("design:type", browser_1.WorkspaceService)
], SearchInWorkspaceService.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.ILogger),
    __metadata("design:type", Object)
], SearchInWorkspaceService.prototype, "logger", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SearchInWorkspaceService.prototype, "init", null);
SearchInWorkspaceService = __decorate([
    (0, inversify_1.injectable)()
], SearchInWorkspaceService);
exports.SearchInWorkspaceService = SearchInWorkspaceService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/search-in-workspace/lib/browser/search-in-workspace-service'] = this;


/***/ }),

/***/ "../../packages/search-in-workspace/lib/browser/search-in-workspace-widget.js":
/*!************************************************************************************!*\
  !*** ../../packages/search-in-workspace/lib/browser/search-in-workspace-widget.js ***!
  \************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2018 TypeFox and others.
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
var SearchInWorkspaceWidget_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SearchInWorkspaceWidget = void 0;
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const search_in_workspace_result_tree_widget_1 = __webpack_require__(/*! ./search-in-workspace-result-tree-widget */ "../../packages/search-in-workspace/lib/browser/search-in-workspace-result-tree-widget.js");
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const client_1 = __webpack_require__(/*! @theia/core/shared/react-dom/client */ "../../packages/core/shared/react-dom/client/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const browser_2 = __webpack_require__(/*! @theia/workspace/lib/browser */ "../../packages/workspace/lib/browser/index.js");
const search_in_workspace_context_key_service_1 = __webpack_require__(/*! ./search-in-workspace-context-key-service */ "../../packages/search-in-workspace/lib/browser/search-in-workspace-context-key-service.js");
const progress_bar_factory_1 = __webpack_require__(/*! @theia/core/lib/browser/progress-bar-factory */ "../../packages/core/lib/browser/progress-bar-factory.js");
const browser_3 = __webpack_require__(/*! @theia/editor/lib/browser */ "../../packages/editor/lib/browser/index.js");
const search_in_workspace_preferences_1 = __webpack_require__(/*! ./search-in-workspace-preferences */ "../../packages/search-in-workspace/lib/browser/search-in-workspace-preferences.js");
const search_in_workspace_input_1 = __webpack_require__(/*! ./components/search-in-workspace-input */ "../../packages/search-in-workspace/lib/browser/components/search-in-workspace-input.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
let SearchInWorkspaceWidget = SearchInWorkspaceWidget_1 = class SearchInWorkspaceWidget extends browser_1.BaseWidget {
    constructor() {
        super(...arguments);
        this.showSearchDetails = false;
        this._hasResults = false;
        this.resultNumber = 0;
        this.searchFieldContainerIsFocused = false;
        this.searchTerm = '';
        this.replaceTerm = '';
        this.searchRef = React.createRef();
        this.replaceRef = React.createRef();
        this.includeRef = React.createRef();
        this.excludeRef = React.createRef();
        this._showReplaceField = false;
        this.onDidUpdateEmitter = new common_1.Emitter();
        this.onDidUpdate = this.onDidUpdateEmitter.event;
        this.focusSearchFieldContainer = () => this.doFocusSearchFieldContainer();
        this.blurSearchFieldContainer = () => this.doBlurSearchFieldContainer();
        this.search = (e) => {
            e.persist();
            const searchOnType = this.searchInWorkspacePreferences['search.searchOnType'];
            if (searchOnType) {
                const delay = this.searchInWorkspacePreferences['search.searchOnTypeDebouncePeriod'] || 0;
                window.clearTimeout(this._searchTimeout);
                this._searchTimeout = window.setTimeout(() => this.doSearch(e), delay);
            }
        };
        this.onKeyDownSearch = (e) => {
            var _a;
            if (browser_1.Key.ENTER.keyCode === ((_a = browser_1.KeyCode.createKeyCode(e.nativeEvent).key) === null || _a === void 0 ? void 0 : _a.keyCode)) {
                this.searchTerm = e.target.value;
                this.performSearch();
            }
        };
        this.handleFocusSearchInputBox = () => this.contextKeyService.setSearchInputBoxFocus(true);
        this.handleBlurSearchInputBox = () => this.contextKeyService.setSearchInputBoxFocus(false);
        this.updateReplaceTerm = (e) => this.doUpdateReplaceTerm(e);
        this.handleFocusReplaceInputBox = () => this.contextKeyService.setReplaceInputBoxFocus(true);
        this.handleBlurReplaceInputBox = () => this.contextKeyService.setReplaceInputBoxFocus(false);
        this.handleFocusIncludesInputBox = () => this.contextKeyService.setPatternIncludesInputBoxFocus(true);
        this.handleBlurIncludesInputBox = () => this.contextKeyService.setPatternIncludesInputBoxFocus(false);
        this.handleFocusExcludesInputBox = () => this.contextKeyService.setPatternExcludesInputBoxFocus(true);
        this.handleBlurExcludesInputBox = () => this.contextKeyService.setPatternExcludesInputBoxFocus(false);
    }
    get hasResults() {
        return this._hasResults;
    }
    set hasResults(hasResults) {
        this.contextKeyService.hasSearchResult.set(hasResults);
        this._hasResults = hasResults;
    }
    get showReplaceField() {
        return this._showReplaceField;
    }
    set showReplaceField(showReplaceField) {
        this.contextKeyService.replaceActive.set(showReplaceField);
        this._showReplaceField = showReplaceField;
    }
    init() {
        this.id = SearchInWorkspaceWidget_1.ID;
        this.title.label = SearchInWorkspaceWidget_1.LABEL;
        this.title.caption = SearchInWorkspaceWidget_1.LABEL;
        this.title.iconClass = (0, browser_1.codicon)('search');
        this.title.closable = true;
        this.contentNode = document.createElement('div');
        this.contentNode.classList.add('t-siw-search-container');
        this.searchFormContainer = document.createElement('div');
        this.searchFormContainer.classList.add('searchHeader');
        this.contentNode.appendChild(this.searchFormContainer);
        this.searchFormContainerRoot = (0, client_1.createRoot)(this.searchFormContainer);
        this.node.tabIndex = 0;
        this.node.appendChild(this.contentNode);
        this.matchCaseState = {
            className: (0, browser_1.codicon)('case-sensitive'),
            enabled: false,
            title: nls_1.nls.localizeByDefault('Match Case')
        };
        this.wholeWordState = {
            className: (0, browser_1.codicon)('whole-word'),
            enabled: false,
            title: nls_1.nls.localizeByDefault('Match Whole Word')
        };
        this.regExpState = {
            className: (0, browser_1.codicon)('regex'),
            enabled: false,
            title: nls_1.nls.localizeByDefault('Use Regular Expression')
        };
        this.includeIgnoredState = {
            className: (0, browser_1.codicon)('eye'),
            enabled: false,
            title: nls_1.nls.localize('theia/search-in-workspace/includeIgnoredFiles', 'Include Ignored Files')
        };
        this.searchInWorkspaceOptions = {
            matchCase: false,
            matchWholeWord: false,
            useRegExp: false,
            includeIgnored: false,
            include: [],
            exclude: [],
            maxResults: 2000
        };
        this.toDispose.push(this.resultTreeWidget.onChange(r => {
            this.hasResults = r.size > 0;
            this.resultNumber = 0;
            const results = Array.from(r.values());
            results.forEach(rootFolder => rootFolder.children.forEach(file => this.resultNumber += file.children.length));
            this.update();
        }));
        this.toDispose.push(this.resultTreeWidget.onFocusInput(b => {
            this.focusInputField();
        }));
        this.toDispose.push(this.searchInWorkspacePreferences.onPreferenceChanged(e => {
            if (e.preferenceName === 'search.smartCase') {
                this.performSearch();
            }
        }));
        this.toDispose.push(this.resultTreeWidget);
        this.toDispose.push(this.resultTreeWidget.onExpansionChanged(() => {
            this.onDidUpdateEmitter.fire();
        }));
        this.toDispose.push(this.progressBarFactory({ container: this.node, insertMode: 'prepend', locationId: 'search' }));
    }
    storeState() {
        var _a, _b, _c, _d;
        return {
            matchCaseState: this.matchCaseState,
            wholeWordState: this.wholeWordState,
            regExpState: this.regExpState,
            includeIgnoredState: this.includeIgnoredState,
            showSearchDetails: this.showSearchDetails,
            searchInWorkspaceOptions: this.searchInWorkspaceOptions,
            searchTerm: this.searchTerm,
            replaceTerm: this.replaceTerm,
            showReplaceField: this.showReplaceField,
            searchHistoryState: (_a = this.searchRef.current) === null || _a === void 0 ? void 0 : _a.state,
            replaceHistoryState: (_b = this.replaceRef.current) === null || _b === void 0 ? void 0 : _b.state,
            includeHistoryState: (_c = this.includeRef.current) === null || _c === void 0 ? void 0 : _c.state,
            excludeHistoryState: (_d = this.excludeRef.current) === null || _d === void 0 ? void 0 : _d.state,
        };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    restoreState(oldState) {
        var _a, _b, _c, _d;
        this.matchCaseState = oldState.matchCaseState;
        this.wholeWordState = oldState.wholeWordState;
        this.regExpState = oldState.regExpState;
        this.includeIgnoredState = oldState.includeIgnoredState;
        // Override the title of the restored state, as we could have changed languages in between
        this.matchCaseState.title = nls_1.nls.localizeByDefault('Match Case');
        this.wholeWordState.title = nls_1.nls.localizeByDefault('Match Whole Word');
        this.regExpState.title = nls_1.nls.localizeByDefault('Use Regular Expression');
        this.includeIgnoredState.title = nls_1.nls.localize('theia/search-in-workspace/includeIgnoredFiles', 'Include Ignored Files');
        this.showSearchDetails = oldState.showSearchDetails;
        this.searchInWorkspaceOptions = oldState.searchInWorkspaceOptions;
        this.searchTerm = oldState.searchTerm;
        this.replaceTerm = oldState.replaceTerm;
        this.showReplaceField = oldState.showReplaceField;
        this.resultTreeWidget.replaceTerm = this.replaceTerm;
        this.resultTreeWidget.showReplaceButtons = this.showReplaceField;
        (_a = this.searchRef.current) === null || _a === void 0 ? void 0 : _a.setState(oldState.searchHistoryState);
        (_b = this.replaceRef.current) === null || _b === void 0 ? void 0 : _b.setState(oldState.replaceHistoryState);
        (_c = this.includeRef.current) === null || _c === void 0 ? void 0 : _c.setState(oldState.includeHistoryState);
        (_d = this.excludeRef.current) === null || _d === void 0 ? void 0 : _d.setState(oldState.excludeHistoryState);
        this.refresh();
    }
    findInFolder(uris) {
        this.showSearchDetails = true;
        const values = Array.from(new Set(uris.map(uri => `${uri}/**`)));
        const value = values.join(', ');
        this.searchInWorkspaceOptions.include = values;
        if (this.includeRef.current) {
            this.includeRef.current.value = value;
            this.includeRef.current.addToHistory();
        }
        this.update();
    }
    /**
     * Update the search term and input field.
     * @param term the search term.
     * @param showReplaceField controls if the replace field should be displayed.
     */
    updateSearchTerm(term, showReplaceField) {
        this.searchTerm = term;
        if (this.searchRef.current) {
            this.searchRef.current.value = term;
            this.searchRef.current.addToHistory();
        }
        if (showReplaceField) {
            this.showReplaceField = true;
        }
        this.refresh();
    }
    hasResultList() {
        return this.hasResults;
    }
    hasSearchTerm() {
        return this.searchTerm !== '';
    }
    refresh() {
        this.performSearch();
        this.update();
    }
    getCancelIndicator() {
        return this.resultTreeWidget.cancelIndicator;
    }
    collapseAll() {
        this.resultTreeWidget.collapseAll();
        this.update();
    }
    expandAll() {
        this.resultTreeWidget.expandAll();
        this.update();
    }
    areResultsCollapsed() {
        return this.resultTreeWidget.areResultsCollapsed();
    }
    clear() {
        this.searchTerm = '';
        this.replaceTerm = '';
        this.searchInWorkspaceOptions.include = [];
        this.searchInWorkspaceOptions.exclude = [];
        this.includeIgnoredState.enabled = false;
        this.matchCaseState.enabled = false;
        this.wholeWordState.enabled = false;
        this.regExpState.enabled = false;
        if (this.searchRef.current) {
            this.searchRef.current.value = '';
        }
        if (this.replaceRef.current) {
            this.replaceRef.current.value = '';
        }
        if (this.includeRef.current) {
            this.includeRef.current.value = '';
        }
        if (this.excludeRef.current) {
            this.excludeRef.current.value = '';
        }
        this.performSearch();
        this.update();
    }
    onAfterAttach(msg) {
        super.onAfterAttach(msg);
        this.searchFormContainerRoot.render(React.createElement(React.Fragment, null,
            this.renderSearchHeader(),
            this.renderSearchInfo()));
        browser_1.Widget.attach(this.resultTreeWidget, this.contentNode);
        this.toDisposeOnDetach.push(common_1.Disposable.create(() => {
            browser_1.Widget.detach(this.resultTreeWidget);
        }));
    }
    onUpdateRequest(msg) {
        super.onUpdateRequest(msg);
        const searchInfo = this.renderSearchInfo();
        if (searchInfo) {
            this.searchFormContainerRoot.render(React.createElement(React.Fragment, null,
                this.renderSearchHeader(),
                searchInfo));
            this.onDidUpdateEmitter.fire(undefined);
        }
    }
    onResize(msg) {
        super.onResize(msg);
        browser_1.MessageLoop.sendMessage(this.resultTreeWidget, browser_1.Widget.ResizeMessage.UnknownSize);
    }
    onAfterShow(msg) {
        super.onAfterShow(msg);
        this.focusInputField();
        this.contextKeyService.searchViewletVisible.set(true);
    }
    onAfterHide(msg) {
        super.onAfterHide(msg);
        this.contextKeyService.searchViewletVisible.set(false);
    }
    onActivateRequest(msg) {
        super.onActivateRequest(msg);
        this.focusInputField();
    }
    focusInputField() {
        const f = document.getElementById('search-input-field');
        if (f) {
            f.focus();
            f.select();
        }
    }
    renderSearchHeader() {
        const searchAndReplaceContainer = this.renderSearchAndReplace();
        const searchDetails = this.renderSearchDetails();
        return React.createElement("div", null,
            searchAndReplaceContainer,
            searchDetails);
    }
    renderSearchAndReplace() {
        const toggleContainer = this.renderReplaceFieldToggle();
        const searchField = this.renderSearchField();
        const replaceField = this.renderReplaceField();
        return React.createElement("div", { className: 'search-and-replace-container' },
            toggleContainer,
            React.createElement("div", { className: 'search-and-replace-fields' },
                searchField,
                replaceField));
    }
    renderReplaceFieldToggle() {
        const toggle = React.createElement("span", { className: (0, browser_1.codicon)(this.showReplaceField ? 'chevron-down' : 'chevron-right') });
        return React.createElement("div", { title: nls_1.nls.localizeByDefault('Toggle Replace'), className: 'replace-toggle', tabIndex: 0, onClick: e => {
                const elArr = document.getElementsByClassName('replace-toggle');
                if (elArr && elArr.length > 0) {
                    elArr[0].focus();
                }
                this.showReplaceField = !this.showReplaceField;
                this.resultTreeWidget.showReplaceButtons = this.showReplaceField;
                this.update();
            } }, toggle);
    }
    renderNotification() {
        if (this.workspaceService.tryGetRoots().length <= 0 && this.editorManager.all.length <= 0) {
            return React.createElement("div", { className: 'search-notification show' },
                React.createElement("div", null, nls_1.nls.localize('theia/search-in-workspace/noFolderSpecified', 'You have not opened or specified a folder. Only open files are currently searched.')));
        }
        return React.createElement("div", { className: `search-notification ${this.searchInWorkspaceOptions.maxResults && this.resultNumber >= this.searchInWorkspaceOptions.maxResults ? 'show' : ''}` },
            React.createElement("div", null, nls_1.nls.localize('theia/search-in-workspace/resultSubset', 'This is only a subset of all results. Use a more specific search term to narrow down the result list.')));
    }
    doFocusSearchFieldContainer() {
        this.searchFieldContainerIsFocused = true;
        this.update();
    }
    doBlurSearchFieldContainer() {
        this.searchFieldContainerIsFocused = false;
        this.update();
    }
    doSearch(e) {
        var _a;
        if (e.target) {
            const searchValue = e.target.value;
            if (this.searchTerm === searchValue && browser_1.Key.ENTER.keyCode !== ((_a = browser_1.KeyCode.createKeyCode(e.nativeEvent).key) === null || _a === void 0 ? void 0 : _a.keyCode)) {
                return;
            }
            else {
                this.searchTerm = searchValue;
                this.performSearch();
            }
        }
    }
    performSearch() {
        const searchOptions = {
            ...this.searchInWorkspaceOptions,
            followSymlinks: this.shouldFollowSymlinks(),
            matchCase: this.shouldMatchCase()
        };
        this.resultTreeWidget.search(this.searchTerm, searchOptions);
    }
    shouldFollowSymlinks() {
        return this.searchInWorkspacePreferences['search.followSymlinks'];
    }
    /**
     * Determine if search should be case sensitive.
     */
    shouldMatchCase() {
        if (this.matchCaseState.enabled) {
            return this.matchCaseState.enabled;
        }
        // search.smartCase makes siw search case-sensitive if the search term contains uppercase letter(s).
        return (!!this.searchInWorkspacePreferences['search.smartCase']
            && this.searchTerm !== this.searchTerm.toLowerCase());
    }
    renderSearchField() {
        const input = React.createElement(search_in_workspace_input_1.SearchInWorkspaceInput, { id: 'search-input-field', className: 'theia-input', title: SearchInWorkspaceWidget_1.LABEL, type: 'text', size: 1, placeholder: SearchInWorkspaceWidget_1.LABEL, defaultValue: this.searchTerm, autoComplete: 'off', onKeyUp: this.search, onKeyDown: this.onKeyDownSearch, onFocus: this.handleFocusSearchInputBox, onBlur: this.handleBlurSearchInputBox, ref: this.searchRef });
        const notification = this.renderNotification();
        const optionContainer = this.renderOptionContainer();
        const tooMany = this.searchInWorkspaceOptions.maxResults && this.resultNumber >= this.searchInWorkspaceOptions.maxResults ? 'tooManyResults' : '';
        const className = `search-field-container ${tooMany} ${this.searchFieldContainerIsFocused ? 'focused' : ''}`;
        return React.createElement("div", { className: className },
            React.createElement("div", { className: 'search-field', tabIndex: -1, onFocus: this.focusSearchFieldContainer, onBlur: this.blurSearchFieldContainer },
                input,
                optionContainer),
            notification);
    }
    doUpdateReplaceTerm(e) {
        var _a;
        if (e.target) {
            this.replaceTerm = e.target.value;
            this.resultTreeWidget.replaceTerm = this.replaceTerm;
            if (((_a = browser_1.KeyCode.createKeyCode(e.nativeEvent).key) === null || _a === void 0 ? void 0 : _a.keyCode) === browser_1.Key.ENTER.keyCode) {
                this.performSearch();
            }
            this.update();
        }
    }
    renderReplaceField() {
        const replaceAllButtonContainer = this.renderReplaceAllButtonContainer();
        const replace = nls_1.nls.localizeByDefault('Replace');
        return React.createElement("div", { className: `replace-field${this.showReplaceField ? '' : ' hidden'}` },
            React.createElement(search_in_workspace_input_1.SearchInWorkspaceInput, { id: 'replace-input-field', className: 'theia-input', title: replace, type: 'text', size: 1, placeholder: replace, defaultValue: this.replaceTerm, autoComplete: 'off', onKeyUp: this.updateReplaceTerm, onFocus: this.handleFocusReplaceInputBox, onBlur: this.handleBlurReplaceInputBox, ref: this.replaceRef }),
            replaceAllButtonContainer);
    }
    renderReplaceAllButtonContainer() {
        // The `Replace All` button is enabled if there is a search term present with results.
        const enabled = this.searchTerm !== '' && this.resultNumber > 0;
        return React.createElement("div", { className: 'replace-all-button-container' },
            React.createElement("span", { title: nls_1.nls.localizeByDefault('Replace All'), className: `${(0, browser_1.codicon)('replace-all', true)} ${enabled ? ' ' : ' disabled'}`, onClick: () => {
                    if (enabled) {
                        this.resultTreeWidget.replace(undefined);
                    }
                } }));
    }
    renderOptionContainer() {
        const matchCaseOption = this.renderOptionElement(this.matchCaseState);
        const wholeWordOption = this.renderOptionElement(this.wholeWordState);
        const regexOption = this.renderOptionElement(this.regExpState);
        const includeIgnoredOption = this.renderOptionElement(this.includeIgnoredState);
        return React.createElement("div", { className: 'option-buttons' },
            matchCaseOption,
            wholeWordOption,
            regexOption,
            includeIgnoredOption);
    }
    renderOptionElement(opt) {
        return React.createElement("span", { className: `${opt.className} option action-label ${opt.enabled ? 'enabled' : ''}`, title: opt.title, onClick: () => this.handleOptionClick(opt) });
    }
    handleOptionClick(option) {
        option.enabled = !option.enabled;
        this.updateSearchOptions();
        this.searchFieldContainerIsFocused = true;
        this.performSearch();
        this.update();
    }
    updateSearchOptions() {
        this.searchInWorkspaceOptions.matchCase = this.matchCaseState.enabled;
        this.searchInWorkspaceOptions.matchWholeWord = this.wholeWordState.enabled;
        this.searchInWorkspaceOptions.useRegExp = this.regExpState.enabled;
        this.searchInWorkspaceOptions.includeIgnored = this.includeIgnoredState.enabled;
    }
    renderSearchDetails() {
        const expandButton = this.renderExpandGlobFieldsButton();
        const globFieldContainer = this.renderGlobFieldContainer();
        return React.createElement("div", { className: 'search-details' },
            expandButton,
            globFieldContainer);
    }
    renderGlobFieldContainer() {
        const includeField = this.renderGlobField('include');
        const excludeField = this.renderGlobField('exclude');
        return React.createElement("div", { className: `glob-field-container${!this.showSearchDetails ? ' hidden' : ''}` },
            includeField,
            excludeField);
    }
    renderExpandGlobFieldsButton() {
        return React.createElement("div", { className: 'button-container' },
            React.createElement("span", { title: nls_1.nls.localizeByDefault('Toggle Search Details'), className: (0, browser_1.codicon)('ellipsis'), onClick: () => {
                    this.showSearchDetails = !this.showSearchDetails;
                    this.update();
                } }));
    }
    renderGlobField(kind) {
        const currentValue = this.searchInWorkspaceOptions[kind];
        const value = currentValue && currentValue.join(', ') || '';
        return React.createElement("div", { className: 'glob-field' },
            React.createElement("div", { className: 'label' }, nls_1.nls.localizeByDefault('files to ' + kind)),
            React.createElement(search_in_workspace_input_1.SearchInWorkspaceInput, { className: 'theia-input', type: 'text', size: 1, defaultValue: value, autoComplete: 'off', id: kind + '-glob-field', placeholder: kind === 'include'
                    ? nls_1.nls.localizeByDefault('e.g. *.ts, src/**/include')
                    : nls_1.nls.localizeByDefault('e.g. *.ts, src/**/exclude'), onKeyUp: e => {
                    var _a;
                    if (e.target) {
                        const targetValue = e.target.value || '';
                        let shouldSearch = browser_1.Key.ENTER.keyCode === ((_a = browser_1.KeyCode.createKeyCode(e.nativeEvent).key) === null || _a === void 0 ? void 0 : _a.keyCode);
                        const currentOptions = (this.searchInWorkspaceOptions[kind] || []).slice().map(s => s.trim()).sort();
                        const candidateOptions = this.splitOnComma(targetValue).map(s => s.trim()).sort();
                        const sameAs = (left, right) => {
                            if (left.length !== right.length) {
                                return false;
                            }
                            for (let i = 0; i < left.length; i++) {
                                if (left[i] !== right[i]) {
                                    return false;
                                }
                            }
                            return true;
                        };
                        if (!sameAs(currentOptions, candidateOptions)) {
                            this.searchInWorkspaceOptions[kind] = this.splitOnComma(targetValue);
                            shouldSearch = true;
                        }
                        if (shouldSearch) {
                            this.performSearch();
                        }
                    }
                }, onFocus: kind === 'include' ? this.handleFocusIncludesInputBox : this.handleFocusExcludesInputBox, onBlur: kind === 'include' ? this.handleBlurIncludesInputBox : this.handleBlurExcludesInputBox, ref: kind === 'include' ? this.includeRef : this.excludeRef }));
    }
    splitOnComma(patterns) {
        return patterns.length > 0 ? patterns.split(',').map(s => s.trim()) : [];
    }
    renderSearchInfo() {
        const message = this.getSearchResultMessage() || '';
        return React.createElement("div", { className: 'search-info' }, message);
    }
    getSearchResultMessage() {
        if (!this.searchTerm) {
            return undefined;
        }
        if (this.resultNumber === 0) {
            const isIncludesPresent = this.searchInWorkspaceOptions.include && this.searchInWorkspaceOptions.include.length > 0;
            const isExcludesPresent = this.searchInWorkspaceOptions.exclude && this.searchInWorkspaceOptions.exclude.length > 0;
            let message;
            if (isIncludesPresent && isExcludesPresent) {
                message = nls_1.nls.localizeByDefault("No results found in '{0}' excluding '{1}' - ", this.searchInWorkspaceOptions.include.toString(), this.searchInWorkspaceOptions.exclude.toString());
            }
            else if (isIncludesPresent) {
                message = nls_1.nls.localizeByDefault("No results found in '{0}' - ", this.searchInWorkspaceOptions.include.toString());
            }
            else if (isExcludesPresent) {
                message = nls_1.nls.localizeByDefault("No results found excluding '{0}' - ", this.searchInWorkspaceOptions.exclude.toString());
            }
            else {
                message = nls_1.nls.localizeByDefault('No results found') + ' - ';
            }
            // We have to trim here as vscode will always add a trailing " - " string
            return message.substring(0, message.length - 2).trim();
        }
        else {
            if (this.resultNumber === 1 && this.resultTreeWidget.fileNumber === 1) {
                return nls_1.nls.localizeByDefault('{0} result in {1} file', this.resultNumber.toString(), this.resultTreeWidget.fileNumber.toString());
            }
            else if (this.resultTreeWidget.fileNumber === 1) {
                return nls_1.nls.localizeByDefault('{0} results in {1} file', this.resultNumber.toString(), this.resultTreeWidget.fileNumber.toString());
            }
            else if (this.resultTreeWidget.fileNumber > 0) {
                return nls_1.nls.localizeByDefault('{0} results in {1} files', this.resultNumber.toString(), this.resultTreeWidget.fileNumber.toString());
            }
            else {
                // if fileNumber === 0, return undefined so that `onUpdateRequest()` would not re-render component
                return undefined;
            }
        }
    }
};
SearchInWorkspaceWidget.ID = 'search-in-workspace';
SearchInWorkspaceWidget.LABEL = nls_1.nls.localizeByDefault('Search');
__decorate([
    (0, inversify_1.inject)(search_in_workspace_result_tree_widget_1.SearchInWorkspaceResultTreeWidget),
    __metadata("design:type", search_in_workspace_result_tree_widget_1.SearchInWorkspaceResultTreeWidget)
], SearchInWorkspaceWidget.prototype, "resultTreeWidget", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.WorkspaceService),
    __metadata("design:type", browser_2.WorkspaceService)
], SearchInWorkspaceWidget.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(search_in_workspace_context_key_service_1.SearchInWorkspaceContextKeyService),
    __metadata("design:type", search_in_workspace_context_key_service_1.SearchInWorkspaceContextKeyService)
], SearchInWorkspaceWidget.prototype, "contextKeyService", void 0);
__decorate([
    (0, inversify_1.inject)(progress_bar_factory_1.ProgressBarFactory),
    __metadata("design:type", Function)
], SearchInWorkspaceWidget.prototype, "progressBarFactory", void 0);
__decorate([
    (0, inversify_1.inject)(browser_3.EditorManager),
    __metadata("design:type", browser_3.EditorManager)
], SearchInWorkspaceWidget.prototype, "editorManager", void 0);
__decorate([
    (0, inversify_1.inject)(search_in_workspace_preferences_1.SearchInWorkspacePreferences),
    __metadata("design:type", Object)
], SearchInWorkspaceWidget.prototype, "searchInWorkspacePreferences", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SearchInWorkspaceWidget.prototype, "init", null);
SearchInWorkspaceWidget = SearchInWorkspaceWidget_1 = __decorate([
    (0, inversify_1.injectable)()
], SearchInWorkspaceWidget);
exports.SearchInWorkspaceWidget = SearchInWorkspaceWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/search-in-workspace/lib/browser/search-in-workspace-widget'] = this;


/***/ }),

/***/ "../../packages/search-in-workspace/lib/common/search-in-workspace-interface.js":
/*!**************************************************************************************!*\
  !*** ../../packages/search-in-workspace/lib/common/search-in-workspace-interface.js ***!
  \**************************************************************************************/
/***/ (function(__unused_webpack_module, exports) {


// *****************************************************************************
// Copyright (C) 2017-2018 Ericsson and others.
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
exports.SearchInWorkspaceServer = exports.SIW_WS_PATH = exports.SearchInWorkspaceClient = exports.SearchInWorkspaceResult = void 0;
var SearchInWorkspaceResult;
(function (SearchInWorkspaceResult) {
    /**
     * Sort search in workspace results according to file, line, character position
     * and then length.
     */
    function compare(a, b) {
        if (a.fileUri !== b.fileUri) {
            return a.fileUri < b.fileUri ? -1 : 1;
        }
        return 0;
    }
    SearchInWorkspaceResult.compare = compare;
})(SearchInWorkspaceResult = exports.SearchInWorkspaceResult || (exports.SearchInWorkspaceResult = {}));
exports.SearchInWorkspaceClient = Symbol('SearchInWorkspaceClient');
exports.SIW_WS_PATH = '/services/search-in-workspace';
exports.SearchInWorkspaceServer = Symbol('SearchInWorkspaceServer');

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/search-in-workspace/lib/common/search-in-workspace-interface'] = this;


/***/ })

}]);
//# sourceMappingURL=packages_search-in-workspace_lib_browser_search-in-workspace-factory_js.js.map