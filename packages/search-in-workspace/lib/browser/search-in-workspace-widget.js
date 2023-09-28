"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchInWorkspaceWidget = void 0;
const browser_1 = require("@theia/core/lib/browser");
const inversify_1 = require("@theia/core/shared/inversify");
const search_in_workspace_result_tree_widget_1 = require("./search-in-workspace-result-tree-widget");
const React = require("@theia/core/shared/react");
const client_1 = require("@theia/core/shared/react-dom/client");
const common_1 = require("@theia/core/lib/common");
const browser_2 = require("@theia/workspace/lib/browser");
const search_in_workspace_context_key_service_1 = require("./search-in-workspace-context-key-service");
const progress_bar_factory_1 = require("@theia/core/lib/browser/progress-bar-factory");
const browser_3 = require("@theia/editor/lib/browser");
const search_in_workspace_preferences_1 = require("./search-in-workspace-preferences");
const search_in_workspace_input_1 = require("./components/search-in-workspace-input");
const nls_1 = require("@theia/core/lib/common/nls");
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
//# sourceMappingURL=search-in-workspace-widget.js.map