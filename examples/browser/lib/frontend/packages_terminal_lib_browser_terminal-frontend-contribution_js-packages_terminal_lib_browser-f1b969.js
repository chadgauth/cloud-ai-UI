"use strict";
(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_terminal_lib_browser_terminal-frontend-contribution_js-packages_terminal_lib_browser-f1b969"],{

/***/ "../../packages/terminal/lib/browser/base/terminal-widget.js":
/*!*******************************************************************!*\
  !*** ../../packages/terminal/lib/browser/base/terminal-widget.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2018 Red Hat, Inc. and others.
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
exports.TerminalWidgetOptions = exports.TerminalWidget = exports.TerminalLocation = void 0;
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
var TerminalLocation;
(function (TerminalLocation) {
    TerminalLocation[TerminalLocation["Panel"] = 1] = "Panel";
    TerminalLocation[TerminalLocation["Editor"] = 2] = "Editor";
})(TerminalLocation = exports.TerminalLocation || (exports.TerminalLocation = {}));
/**
 * Terminal UI widget.
 */
class TerminalWidget extends browser_1.BaseWidget {
}
exports.TerminalWidget = TerminalWidget;
/**
 * Terminal widget options.
 */
exports.TerminalWidgetOptions = Symbol('TerminalWidgetOptions');

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/terminal/lib/browser/base/terminal-widget'] = this;


/***/ }),

/***/ "../../packages/terminal/lib/browser/search/terminal-search-widget.js":
/*!****************************************************************************!*\
  !*** ../../packages/terminal/lib/browser/search/terminal-search-widget.js ***!
  \****************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2019 Red Hat, Inc. and others.
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
exports.TerminalSearchWidget = exports.TerminalSearchWidgetFactory = exports.TERMINAL_SEARCH_WIDGET_FACTORY_ID = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const react_widget_1 = __webpack_require__(/*! @theia/core/lib/browser/widgets/react-widget */ "../../packages/core/lib/browser/widgets/react-widget.js");
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
__webpack_require__(/*! ../../../src/browser/style/terminal-search.css */ "../../packages/terminal/src/browser/style/terminal-search.css");
const xterm_1 = __webpack_require__(/*! xterm */ "../../node_modules/xterm/lib/xterm.js");
const xterm_addon_search_1 = __webpack_require__(/*! xterm-addon-search */ "../../node_modules/xterm-addon-search/lib/xterm-addon-search.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
exports.TERMINAL_SEARCH_WIDGET_FACTORY_ID = 'terminal-search';
exports.TerminalSearchWidgetFactory = Symbol('TerminalSearchWidgetFactory');
let TerminalSearchWidget = class TerminalSearchWidget extends react_widget_1.ReactWidget {
    constructor() {
        super(...arguments);
        this.searchOptions = {};
        this.onSearchInputFocus = () => {
            if (this.searchBox) {
                this.searchBox.classList.add('focused');
            }
        };
        this.onSearchInputBlur = () => {
            if (this.searchBox) {
                this.searchBox.classList.remove('focused');
            }
        };
        this.handleHide = () => {
            this.hide();
        };
        this.handleCaseSensitiveOptionClicked = (event) => {
            this.searchOptions.caseSensitive = !this.searchOptions.caseSensitive;
            this.updateSearchInputBox(this.searchOptions.caseSensitive, event.currentTarget);
        };
        this.handleWholeWordOptionClicked = (event) => {
            this.searchOptions.wholeWord = !this.searchOptions.wholeWord;
            this.updateSearchInputBox(this.searchOptions.wholeWord, event.currentTarget);
        };
        this.handleRegexOptionClicked = (event) => {
            this.searchOptions.regex = !this.searchOptions.regex;
            this.updateSearchInputBox(this.searchOptions.regex, event.currentTarget);
        };
        this.onInputChanged = (event) => {
            // move to previous search result on `Shift + Enter`
            if (event && event.shiftKey && event.keyCode === browser_1.Key.ENTER.keyCode) {
                this.search(false, 'previous');
                return;
            }
            // move to next search result on `Enter`
            if (event && event.keyCode === browser_1.Key.ENTER.keyCode) {
                this.search(false, 'next');
                return;
            }
            this.search(true, 'next');
        };
        this.handleNextButtonClicked = () => {
            this.search(false, 'next');
        };
        this.handlePreviousButtonClicked = () => {
            this.search(false, 'previous');
        };
    }
    init() {
        this.node.classList.add('theia-search-terminal-widget-parent');
        this.searchAddon = new xterm_addon_search_1.SearchAddon();
        this.terminal.loadAddon(this.searchAddon);
        this.hide();
        this.update();
    }
    render() {
        return React.createElement("div", { className: 'theia-search-terminal-widget' },
            React.createElement("div", { className: 'theia-search-elem-box', ref: searchBox => this.searchBox = searchBox },
                React.createElement("input", { title: 'Find', type: 'text', spellCheck: 'false', placeholder: 'Find', ref: ip => this.searchInput = ip, onKeyUp: this.onInputChanged, onFocus: this.onSearchInputFocus, onBlur: this.onSearchInputBlur }),
                React.createElement("div", { title: 'Match case', tabIndex: 0, className: 'search-elem ' + (0, browser_1.codicon)('case-sensitive'), onClick: this.handleCaseSensitiveOptionClicked }),
                React.createElement("div", { title: 'Match whole word', tabIndex: 0, className: 'search-elem ' + (0, browser_1.codicon)('whole-word'), onClick: this.handleWholeWordOptionClicked }),
                React.createElement("div", { title: 'Use regular expression', tabIndex: 0, className: 'search-elem ' + (0, browser_1.codicon)('regex'), onClick: this.handleRegexOptionClicked })),
            React.createElement("button", { title: 'Previous match', className: 'search-elem ' + (0, browser_1.codicon)('arrow-up'), onClick: this.handlePreviousButtonClicked }),
            React.createElement("button", { title: 'Next match', className: 'search-elem ' + (0, browser_1.codicon)('arrow-down'), onClick: this.handleNextButtonClicked }),
            React.createElement("button", { title: 'Close', className: 'search-elem ' + (0, browser_1.codicon)('close'), onClick: this.handleHide }));
    }
    updateSearchInputBox(enable, optionElement) {
        if (enable) {
            optionElement.classList.add('option-enabled');
        }
        else {
            optionElement.classList.remove('option-enabled');
        }
        this.searchInput.focus();
    }
    search(incremental, searchDirection) {
        if (this.searchInput) {
            this.searchOptions.incremental = incremental;
            const searchText = this.searchInput.value;
            if (searchDirection === 'next') {
                this.searchAddon.findNext(searchText, this.searchOptions);
            }
            if (searchDirection === 'previous') {
                this.searchAddon.findPrevious(searchText, this.searchOptions);
            }
        }
    }
    onAfterHide() {
        this.terminal.focus();
    }
    onAfterShow() {
        if (this.searchInput) {
            this.searchInput.select();
        }
    }
};
__decorate([
    (0, inversify_1.inject)(xterm_1.Terminal),
    __metadata("design:type", xterm_1.Terminal)
], TerminalSearchWidget.prototype, "terminal", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TerminalSearchWidget.prototype, "init", null);
TerminalSearchWidget = __decorate([
    (0, inversify_1.injectable)()
], TerminalSearchWidget);
exports.TerminalSearchWidget = TerminalSearchWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/terminal/lib/browser/search/terminal-search-widget'] = this;


/***/ }),

/***/ "../../packages/terminal/lib/browser/shell-terminal-profile.js":
/*!*********************************************************************!*\
  !*** ../../packages/terminal/lib/browser/shell-terminal-profile.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ShellTerminalProfile = void 0;
class ShellTerminalProfile {
    constructor(terminalService, options) {
        this.terminalService = terminalService;
        this.options = options;
    }
    async start() {
        const widget = await this.terminalService.newTerminal(this.options);
        widget.start();
        return widget;
    }
    /**
     * Makes a copy of this profile modified with the options given
     * as an argument.
     * @param options the options to override
     * @returns a modified copy of this profile
     */
    modify(options) {
        return new ShellTerminalProfile(this.terminalService, { ...this.options, ...options });
    }
}
exports.ShellTerminalProfile = ShellTerminalProfile;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/terminal/lib/browser/shell-terminal-profile'] = this;


/***/ }),

/***/ "../../packages/terminal/lib/browser/terminal-copy-on-selection-handler.js":
/*!*********************************************************************************!*\
  !*** ../../packages/terminal/lib/browser/terminal-copy-on-selection-handler.js ***!
  \*********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2019 Red Hat, Inc. and others.
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
exports.TerminalCopyOnSelectionHandler = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
let TerminalCopyOnSelectionHandler = class TerminalCopyOnSelectionHandler {
    constructor() {
        this.copyListener = (ev) => {
            if (this.interceptCopy && ev.clipboardData) {
                ev.clipboardData.setData('text/plain', this.textToCopy);
                ev.preventDefault();
            }
        };
    }
    init() {
        document.addEventListener('copy', this.copyListener);
    }
    async clipBoardCopyIsGranted() {
        // Unfortunately Firefox doesn't support permission check `clipboard-write`, so let try to copy anyway,
        if (browser_1.isFirefox) {
            return true;
        }
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const permissions = navigator.permissions;
            const { state } = await permissions.query({ name: 'clipboard-write' });
            if (state === 'granted') {
                return true;
            }
        }
        catch (e) { }
        return false;
    }
    executeCommandCopy() {
        try {
            this.interceptCopy = true;
            document.execCommand('copy');
            this.interceptCopy = false;
        }
        catch (e) {
            // do nothing
        }
    }
    async writeToClipBoard() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const clipboard = navigator.clipboard;
        if (!clipboard) {
            this.executeCommandCopy();
            return;
        }
        try {
            await clipboard.writeText(this.textToCopy);
        }
        catch (e) {
            this.executeCommandCopy();
        }
    }
    async copy(text) {
        this.textToCopy = text;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const permissions = navigator.permissions;
        if (permissions && permissions.query && await this.clipBoardCopyIsGranted()) {
            await this.writeToClipBoard();
        }
        else {
            this.executeCommandCopy();
        }
    }
};
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TerminalCopyOnSelectionHandler.prototype, "init", null);
TerminalCopyOnSelectionHandler = __decorate([
    (0, inversify_1.injectable)()
], TerminalCopyOnSelectionHandler);
exports.TerminalCopyOnSelectionHandler = TerminalCopyOnSelectionHandler;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/terminal/lib/browser/terminal-copy-on-selection-handler'] = this;


/***/ }),

/***/ "../../packages/terminal/lib/browser/terminal-frontend-contribution.js":
/*!*****************************************************************************!*\
  !*** ../../packages/terminal/lib/browser/terminal-frontend-contribution.js ***!
  \*****************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TerminalFrontendContribution = exports.TerminalCommands = exports.TerminalMenus = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const terminal_widget_impl_1 = __webpack_require__(/*! ./terminal-widget-impl */ "../../packages/terminal/lib/browser/terminal-widget-impl.js");
const terminal_widget_1 = __webpack_require__(/*! ./base/terminal-widget */ "../../packages/terminal/lib/browser/base/terminal-widget.js");
const terminal_profile_service_1 = __webpack_require__(/*! ./terminal-profile-service */ "../../packages/terminal/lib/browser/terminal-profile-service.js");
const uri_command_handler_1 = __webpack_require__(/*! @theia/core/lib/common/uri-command-handler */ "../../packages/core/lib/common/uri-command-handler.js");
const shell_terminal_protocol_1 = __webpack_require__(/*! ../common/shell-terminal-protocol */ "../../packages/terminal/lib/common/shell-terminal-protocol.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const browser_2 = __webpack_require__(/*! @theia/workspace/lib/browser */ "../../packages/workspace/lib/browser/index.js");
const context_key_service_1 = __webpack_require__(/*! @theia/core/lib/browser/context-key-service */ "../../packages/core/lib/browser/context-key-service.js");
const terminal_theme_service_1 = __webpack_require__(/*! ./terminal-theme-service */ "../../packages/terminal/lib/browser/terminal-theme-service.js");
const file_service_1 = __webpack_require__(/*! @theia/filesystem/lib/browser/file-service */ "../../packages/filesystem/lib/browser/file-service.js");
const terminal_watcher_1 = __webpack_require__(/*! ../common/terminal-watcher */ "../../packages/terminal/lib/common/terminal-watcher.js");
const base_terminal_protocol_1 = __webpack_require__(/*! ../common/base-terminal-protocol */ "../../packages/terminal/lib/common/base-terminal-protocol.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
const terminal_preferences_1 = __webpack_require__(/*! ./terminal-preferences */ "../../packages/terminal/lib/browser/terminal-preferences.js");
const shell_terminal_profile_1 = __webpack_require__(/*! ./shell-terminal-profile */ "../../packages/terminal/lib/browser/shell-terminal-profile.js");
const browser_3 = __webpack_require__(/*! @theia/variable-resolver/lib/browser */ "../../packages/variable-resolver/lib/browser/index.js");
var TerminalMenus;
(function (TerminalMenus) {
    TerminalMenus.TERMINAL = [...core_1.MAIN_MENU_BAR, '7_terminal'];
    TerminalMenus.TERMINAL_NEW = [...TerminalMenus.TERMINAL, '1_terminal'];
    TerminalMenus.TERMINAL_TASKS = [...TerminalMenus.TERMINAL, '2_terminal'];
    TerminalMenus.TERMINAL_TASKS_INFO = [...TerminalMenus.TERMINAL_TASKS, '3_terminal'];
    TerminalMenus.TERMINAL_TASKS_CONFIG = [...TerminalMenus.TERMINAL_TASKS, '4_terminal'];
    TerminalMenus.TERMINAL_NAVIGATOR_CONTEXT_MENU = ['navigator-context-menu', 'navigation'];
    TerminalMenus.TERMINAL_OPEN_EDITORS_CONTEXT_MENU = ['open-editors-context-menu', 'navigation'];
    TerminalMenus.TERMINAL_CONTEXT_MENU = ['terminal-context-menu'];
})(TerminalMenus = exports.TerminalMenus || (exports.TerminalMenus = {}));
var TerminalCommands;
(function (TerminalCommands) {
    const TERMINAL_CATEGORY = 'Terminal';
    TerminalCommands.NEW = common_1.Command.toDefaultLocalizedCommand({
        id: 'terminal:new',
        category: TERMINAL_CATEGORY,
        label: 'Create New Terminal'
    });
    TerminalCommands.PROFILE_NEW = common_1.Command.toLocalizedCommand({
        id: 'terminal:new:profile',
        category: TERMINAL_CATEGORY,
        label: 'Create New Integrated Terminal from a Profile'
    });
    TerminalCommands.PROFILE_DEFAULT = common_1.Command.toLocalizedCommand({
        id: 'terminal:profile:default',
        category: TERMINAL_CATEGORY,
        label: 'Choose the default Terminal Profile'
    });
    TerminalCommands.NEW_ACTIVE_WORKSPACE = common_1.Command.toDefaultLocalizedCommand({
        id: 'terminal:new:active:workspace',
        category: TERMINAL_CATEGORY,
        label: 'Create New Terminal (In Active Workspace)'
    });
    TerminalCommands.TERMINAL_CLEAR = common_1.Command.toDefaultLocalizedCommand({
        id: 'terminal:clear',
        category: TERMINAL_CATEGORY,
        label: 'Clear'
    });
    TerminalCommands.TERMINAL_CONTEXT = common_1.Command.toDefaultLocalizedCommand({
        id: 'terminal:context',
        category: TERMINAL_CATEGORY,
        label: 'Open in Terminal'
    });
    TerminalCommands.SPLIT = common_1.Command.toDefaultLocalizedCommand({
        id: 'terminal:split',
        category: TERMINAL_CATEGORY,
        label: 'Split Terminal'
    });
    TerminalCommands.TERMINAL_FIND_TEXT = common_1.Command.toDefaultLocalizedCommand({
        id: 'terminal:find',
        category: TERMINAL_CATEGORY,
        label: 'Find'
    });
    TerminalCommands.TERMINAL_FIND_TEXT_CANCEL = common_1.Command.toDefaultLocalizedCommand({
        id: 'terminal:find:cancel',
        category: TERMINAL_CATEGORY,
        label: 'Hide Find'
    });
    TerminalCommands.SCROLL_LINE_UP = common_1.Command.toDefaultLocalizedCommand({
        id: 'terminal:scroll:line:up',
        category: TERMINAL_CATEGORY,
        label: 'Scroll Up (Line)'
    });
    TerminalCommands.SCROLL_LINE_DOWN = common_1.Command.toDefaultLocalizedCommand({
        id: 'terminal:scroll:line:down',
        category: TERMINAL_CATEGORY,
        label: 'Scroll Down (Line)'
    });
    TerminalCommands.SCROLL_TO_TOP = common_1.Command.toDefaultLocalizedCommand({
        id: 'terminal:scroll:top',
        category: TERMINAL_CATEGORY,
        label: 'Scroll to Top'
    });
    TerminalCommands.SCROLL_PAGE_UP = common_1.Command.toDefaultLocalizedCommand({
        id: 'terminal:scroll:page:up',
        category: TERMINAL_CATEGORY,
        label: 'Scroll Up (Page)'
    });
    TerminalCommands.SCROLL_PAGE_DOWN = common_1.Command.toDefaultLocalizedCommand({
        id: 'terminal:scroll:page:down',
        category: TERMINAL_CATEGORY,
        label: 'Scroll Down (Page)'
    });
    TerminalCommands.TOGGLE_TERMINAL = common_1.Command.toDefaultLocalizedCommand({
        id: 'workbench.action.terminal.toggleTerminal',
        category: TERMINAL_CATEGORY,
        label: 'Toggle Terminal'
    });
    TerminalCommands.KILL_TERMINAL = common_1.Command.toDefaultLocalizedCommand({
        id: 'terminal:kill',
        category: TERMINAL_CATEGORY,
        label: 'Kill Terminal'
    });
    TerminalCommands.SELECT_ALL = {
        id: 'terminal:select:all',
        label: browser_1.CommonCommands.SELECT_ALL.label,
        category: TERMINAL_CATEGORY,
    };
    /**
     * Command that displays all terminals that are currently opened
     */
    TerminalCommands.SHOW_ALL_OPENED_TERMINALS = common_1.Command.toDefaultLocalizedCommand({
        id: 'workbench.action.showAllTerminals',
        category: browser_1.CommonCommands.VIEW_CATEGORY,
        label: 'Show All Opened Terminals'
    });
})(TerminalCommands = exports.TerminalCommands || (exports.TerminalCommands = {}));
let TerminalFrontendContribution = class TerminalFrontendContribution {
    constructor() {
        this.mergePreferencesPromise = Promise.resolve();
        this.onDidCreateTerminalEmitter = new common_1.Emitter();
        this.onDidCreateTerminal = this.onDidCreateTerminalEmitter.event;
        this.onDidChangeCurrentTerminalEmitter = new common_1.Emitter();
        this.onDidChangeCurrentTerminal = this.onDidChangeCurrentTerminalEmitter.event;
        // IDs of the most recently used terminals
        this.mostRecentlyUsedTerminalEntries = [];
    }
    init() {
        this.shell.onDidChangeCurrentWidget(() => this.updateCurrentTerminal());
        this.widgetManager.onDidCreateWidget(({ widget }) => {
            if (widget instanceof terminal_widget_1.TerminalWidget) {
                this.updateCurrentTerminal();
                this.onDidCreateTerminalEmitter.fire(widget);
                this.setLastUsedTerminal(widget);
            }
        });
        const terminalFocusKey = this.contextKeyService.createKey('terminalFocus', false);
        const terminalSearchToggle = this.contextKeyService.createKey('terminalHideSearch', false);
        const updateFocusKey = () => {
            terminalFocusKey.set(this.shell.activeWidget instanceof terminal_widget_1.TerminalWidget);
            terminalSearchToggle.set(this.terminalHideSearch);
        };
        updateFocusKey();
        this.shell.onDidChangeActiveWidget(updateFocusKey);
        this.terminalWatcher.onStoreTerminalEnvVariablesRequested(data => {
            this.storageService.setData(base_terminal_protocol_1.ENVIRONMENT_VARIABLE_COLLECTIONS_KEY, data);
        });
        this.terminalWatcher.onUpdateTerminalEnvVariablesRequested(() => {
            this.storageService.getData(base_terminal_protocol_1.ENVIRONMENT_VARIABLE_COLLECTIONS_KEY).then(data => {
                if (data) {
                    const collectionsJson = JSON.parse(data);
                    collectionsJson.forEach(c => this.shellTerminalServer.setCollection(c.extensionIdentifier, true, c.collection ? c.collection : [], c.description));
                }
            });
        });
    }
    get terminalHideSearch() {
        if (!(this.shell.activeWidget instanceof terminal_widget_1.TerminalWidget)) {
            return false;
        }
        const searchWidget = this.shell.activeWidget.getSearchBox();
        return searchWidget.isVisible;
    }
    async onStart(app) {
        await this.contributeDefaultProfiles();
        this.terminalPreferences.onPreferenceChanged(e => {
            if (e.preferenceName.startsWith('terminal.integrated.')) {
                this.mergePreferencesPromise = this.mergePreferencesPromise.finally(() => this.mergePreferences());
            }
        });
        this.mergePreferencesPromise = this.mergePreferencesPromise.finally(() => this.mergePreferences());
        // extension contributions get read after this point: need to set the default profile if necessary
        this.profileService.onAdded(id => {
            let defaultProfileId;
            switch (common_1.OS.backend.type()) {
                case common_1.OS.Type.Windows: {
                    defaultProfileId = this.terminalPreferences['terminal.integrated.defaultProfile.windows'];
                    break;
                }
                case common_1.OS.Type.Linux: {
                    defaultProfileId = this.terminalPreferences['terminal.integrated.defaultProfile.linux'];
                    break;
                }
                case common_1.OS.Type.OSX: {
                    defaultProfileId = this.terminalPreferences['terminal.integrated.defaultProfile.osx'];
                    break;
                }
            }
            if (defaultProfileId) {
                this.profileService.setDefaultProfile(defaultProfileId);
            }
        });
    }
    async contributeDefaultProfiles() {
        if (common_1.OS.backend.isWindows) {
            this.contributedProfileStore.registerTerminalProfile('cmd', new shell_terminal_profile_1.ShellTerminalProfile(this, {
                shellPath: await this.resolveShellPath([
                    '${env:windir}\\Sysnative\\cmd.exe',
                    '${env:windir}\\System32\\cmd.exe'
                ])
            }));
        }
        else {
            this.contributedProfileStore.registerTerminalProfile('SHELL', new shell_terminal_profile_1.ShellTerminalProfile(this, {
                shellPath: await this.resolveShellPath('${SHELL}'),
                shellArgs: ['-l']
            }));
        }
        // contribute default profiles based on legacy preferences
    }
    async mergePreferences() {
        var _a, _b, _c;
        let profiles;
        let defaultProfile;
        let legacyShellPath;
        let legacyShellArgs;
        const removed = new Set(this.userProfileStore.all.map(([id, profile]) => id));
        switch (common_1.OS.backend.type()) {
            case common_1.OS.Type.Windows: {
                profiles = this.terminalPreferences['terminal.integrated.profiles.windows'];
                defaultProfile = this.terminalPreferences['terminal.integrated.defaultProfile.windows'];
                legacyShellPath = (_a = this.terminalPreferences['terminal.integrated.shell.windows']) !== null && _a !== void 0 ? _a : undefined;
                legacyShellArgs = this.terminalPreferences['terminal.integrated.shellArgs.windows'];
                break;
            }
            case common_1.OS.Type.Linux: {
                profiles = this.terminalPreferences['terminal.integrated.profiles.linux'];
                defaultProfile = this.terminalPreferences['terminal.integrated.defaultProfile.linux'];
                legacyShellPath = (_b = this.terminalPreferences['terminal.integrated.shell.linux']) !== null && _b !== void 0 ? _b : undefined;
                legacyShellArgs = this.terminalPreferences['terminal.integrated.shellArgs.linux'];
                break;
            }
            case common_1.OS.Type.OSX: {
                profiles = this.terminalPreferences['terminal.integrated.profiles.osx'];
                defaultProfile = this.terminalPreferences['terminal.integrated.defaultProfile.osx'];
                legacyShellPath = (_c = this.terminalPreferences['terminal.integrated.shell.osx']) !== null && _c !== void 0 ? _c : undefined;
                legacyShellArgs = this.terminalPreferences['terminal.integrated.shellArgs.osx'];
                break;
            }
        }
        if (profiles) {
            for (const id of Object.getOwnPropertyNames(profiles)) {
                const profile = profiles[id];
                removed.delete(id);
                if (profile) {
                    const shellPath = await this.resolveShellPath(profile.path);
                    if (shellPath) {
                        const options = {
                            shellPath: shellPath,
                            shellArgs: profile.args ? await this.variableResolver.resolve(profile.args) : undefined,
                            useServerTitle: profile.overrideName ? false : undefined,
                            env: profile.env ? await this.variableResolver.resolve(profile.env) : undefined,
                            title: profile.overrideName ? id : undefined
                        };
                        this.userProfileStore.registerTerminalProfile(id, new shell_terminal_profile_1.ShellTerminalProfile(this, options));
                    }
                }
                else {
                    this.userProfileStore.registerTerminalProfile(id, terminal_profile_service_1.NULL_PROFILE);
                }
            }
        }
        if (legacyShellPath) {
            this.userProfileStore.registerTerminalProfile('Legacy Shell Preferences', new shell_terminal_profile_1.ShellTerminalProfile(this, {
                shellPath: legacyShellPath,
                shellArgs: legacyShellArgs
            }));
            // if no other default is set, use the legacy preferences as default if they exist
            this.profileService.setDefaultProfile('Legacy Shell Preferences');
        }
        if (defaultProfile && this.profileService.getProfile(defaultProfile)) {
            this.profileService.setDefaultProfile(defaultProfile);
        }
        for (const id of removed) {
            this.userProfileStore.unregisterTerminalProfile(id);
        }
    }
    async resolveShellPath(path) {
        if (!path) {
            return undefined;
        }
        if (typeof path === 'string') {
            path = [path];
        }
        for (const p of path) {
            const resolved = await this.variableResolver.resolve(p);
            if (resolved) {
                const resolvedURI = uri_1.default.fromFilePath(resolved);
                if (await this.fileService.exists(resolvedURI)) {
                    return resolved;
                }
            }
        }
        return undefined;
    }
    onWillStop() {
        const preferenceValue = this.terminalPreferences['terminal.integrated.confirmOnExit'];
        if (preferenceValue !== 'never') {
            const allTerminals = this.widgetManager.getWidgets(terminal_widget_impl_1.TERMINAL_WIDGET_FACTORY_ID);
            if (allTerminals.length) {
                return {
                    prepare: async () => {
                        if (preferenceValue === 'always') {
                            return allTerminals.length;
                        }
                        else {
                            const activeTerminals = await Promise.all(allTerminals.map(widget => widget.hasChildProcesses()))
                                .then(hasChildProcesses => hasChildProcesses.filter(hasChild => hasChild));
                            return activeTerminals.length;
                        }
                    },
                    action: async (activeTerminalCount) => activeTerminalCount === 0 || this.confirmExitWithActiveTerminals(activeTerminalCount),
                    reason: 'Active integrated terminal',
                };
            }
        }
    }
    async confirmExitWithActiveTerminals(activeTerminalCount) {
        const msg = activeTerminalCount === 1
            ? nls_1.nls.localizeByDefault('Do you want to terminate the active terminal session?')
            : nls_1.nls.localizeByDefault('Do you want to terminate the {0} active terminal sessions?', activeTerminalCount);
        const safeToExit = await new browser_1.ConfirmDialog({
            title: '',
            msg,
            ok: nls_1.nls.localizeByDefault('Terminate'),
            cancel: browser_1.Dialog.CANCEL,
        }).open();
        return safeToExit === true;
    }
    get currentTerminal() {
        return this._currentTerminal;
    }
    setCurrentTerminal(current) {
        if (this._currentTerminal !== current) {
            this._currentTerminal = current;
            this.onDidChangeCurrentTerminalEmitter.fire(this._currentTerminal);
        }
    }
    updateCurrentTerminal() {
        const widget = this.shell.currentWidget;
        if (widget instanceof terminal_widget_1.TerminalWidget) {
            this.setCurrentTerminal(widget);
        }
        else if (!this._currentTerminal || !this._currentTerminal.isVisible) {
            this.setCurrentTerminal(undefined);
        }
    }
    getLastUsedTerminalId() {
        const mostRecent = this.mostRecentlyUsedTerminalEntries[this.mostRecentlyUsedTerminalEntries.length - 1];
        if (mostRecent) {
            return mostRecent.id;
        }
    }
    get lastUsedTerminal() {
        const id = this.getLastUsedTerminalId();
        if (id) {
            return this.getById(id);
        }
    }
    setLastUsedTerminal(lastUsedTerminal) {
        const lastUsedTerminalId = lastUsedTerminal.id;
        const entryIndex = this.mostRecentlyUsedTerminalEntries.findIndex(entry => entry.id === lastUsedTerminalId);
        let toDispose;
        if (entryIndex >= 0) {
            toDispose = this.mostRecentlyUsedTerminalEntries[entryIndex].disposables;
            this.mostRecentlyUsedTerminalEntries.splice(entryIndex, 1);
        }
        else {
            toDispose = new common_1.DisposableCollection();
            toDispose.push(lastUsedTerminal.onDidChangeVisibility((isVisible) => {
                if (isVisible) {
                    this.setLastUsedTerminal(lastUsedTerminal);
                }
            }));
            toDispose.push(lastUsedTerminal.onDidDispose(() => {
                const index = this.mostRecentlyUsedTerminalEntries.findIndex(entry => entry.id === lastUsedTerminalId);
                if (index >= 0) {
                    this.mostRecentlyUsedTerminalEntries[index].disposables.dispose();
                    this.mostRecentlyUsedTerminalEntries.splice(index, 1);
                }
            }));
        }
        const newEntry = { id: lastUsedTerminalId, disposables: toDispose };
        if (lastUsedTerminal.isVisible) {
            this.mostRecentlyUsedTerminalEntries.push(newEntry);
        }
        else {
            this.mostRecentlyUsedTerminalEntries = [newEntry, ...this.mostRecentlyUsedTerminalEntries];
        }
    }
    get all() {
        return this.widgetManager.getWidgets(terminal_widget_impl_1.TERMINAL_WIDGET_FACTORY_ID);
    }
    getById(id) {
        return this.all.find(terminal => terminal.id === id);
    }
    getByTerminalId(terminalId) {
        return this.all.find(terminal => terminal.terminalId === terminalId);
    }
    getDefaultShell() {
        return this.shellTerminalServer.getDefaultShell();
    }
    registerCommands(commands) {
        commands.registerCommand(TerminalCommands.NEW, {
            execute: () => this.openTerminal()
        });
        commands.registerCommand(TerminalCommands.PROFILE_NEW, {
            execute: async () => {
                const profile = await this.selectTerminalProfile(nls_1.nls.localize('theia/terminal/selectProfile', 'Select a profile for the new terminal'));
                if (!profile) {
                    return;
                }
                this.openTerminal(undefined, profile[1]);
            }
        });
        commands.registerCommand(TerminalCommands.PROFILE_DEFAULT, {
            execute: () => this.chooseDefaultProfile()
        });
        commands.registerCommand(TerminalCommands.NEW_ACTIVE_WORKSPACE, {
            execute: () => this.openActiveWorkspaceTerminal()
        });
        commands.registerCommand(TerminalCommands.SPLIT, {
            execute: () => this.splitTerminal(),
            isEnabled: w => this.withWidget(w, () => true),
            isVisible: w => this.withWidget(w, () => true),
        });
        commands.registerCommand(TerminalCommands.TERMINAL_CLEAR);
        commands.registerHandler(TerminalCommands.TERMINAL_CLEAR.id, {
            execute: () => { var _a; return (_a = this.currentTerminal) === null || _a === void 0 ? void 0 : _a.clearOutput(); }
        });
        commands.registerCommand(TerminalCommands.TERMINAL_CONTEXT, uri_command_handler_1.UriAwareCommandHandler.MonoSelect(this.selectionService, {
            execute: uri => this.openInTerminal(uri)
        }));
        commands.registerCommand(TerminalCommands.TERMINAL_FIND_TEXT);
        commands.registerHandler(TerminalCommands.TERMINAL_FIND_TEXT.id, {
            isEnabled: () => {
                if (this.shell.activeWidget instanceof terminal_widget_1.TerminalWidget) {
                    return !this.shell.activeWidget.getSearchBox().isVisible;
                }
                return false;
            },
            execute: () => {
                const termWidget = this.shell.activeWidget;
                const terminalSearchBox = termWidget.getSearchBox();
                terminalSearchBox.show();
            }
        });
        commands.registerCommand(TerminalCommands.TERMINAL_FIND_TEXT_CANCEL);
        commands.registerHandler(TerminalCommands.TERMINAL_FIND_TEXT_CANCEL.id, {
            isEnabled: () => {
                if (this.shell.activeWidget instanceof terminal_widget_1.TerminalWidget) {
                    return this.shell.activeWidget.getSearchBox().isVisible;
                }
                return false;
            },
            execute: () => {
                const termWidget = this.shell.activeWidget;
                const terminalSearchBox = termWidget.getSearchBox();
                terminalSearchBox.hide();
            }
        });
        commands.registerCommand(TerminalCommands.SCROLL_LINE_UP, {
            isEnabled: () => this.shell.activeWidget instanceof terminal_widget_1.TerminalWidget,
            isVisible: () => false,
            execute: () => {
                this.shell.activeWidget.scrollLineUp();
            }
        });
        commands.registerCommand(TerminalCommands.SCROLL_LINE_DOWN, {
            isEnabled: () => this.shell.activeWidget instanceof terminal_widget_1.TerminalWidget,
            isVisible: () => false,
            execute: () => {
                this.shell.activeWidget.scrollLineDown();
            }
        });
        commands.registerCommand(TerminalCommands.SCROLL_TO_TOP, {
            isEnabled: () => this.shell.activeWidget instanceof terminal_widget_1.TerminalWidget,
            isVisible: () => false,
            execute: () => {
                this.shell.activeWidget.scrollToTop();
            }
        });
        commands.registerCommand(TerminalCommands.SCROLL_PAGE_UP, {
            isEnabled: () => this.shell.activeWidget instanceof terminal_widget_1.TerminalWidget,
            isVisible: () => false,
            execute: () => {
                this.shell.activeWidget.scrollPageUp();
            }
        });
        commands.registerCommand(TerminalCommands.SCROLL_PAGE_DOWN, {
            isEnabled: () => this.shell.activeWidget instanceof terminal_widget_1.TerminalWidget,
            isVisible: () => false,
            execute: () => {
                this.shell.activeWidget.scrollPageDown();
            }
        });
        commands.registerCommand(TerminalCommands.TOGGLE_TERMINAL, {
            execute: () => this.toggleTerminal()
        });
        commands.registerCommand(TerminalCommands.KILL_TERMINAL, {
            isEnabled: () => !!this.currentTerminal,
            execute: () => { var _a; return (_a = this.currentTerminal) === null || _a === void 0 ? void 0 : _a.close(); }
        });
        commands.registerCommand(TerminalCommands.SELECT_ALL, {
            isEnabled: () => !!this.currentTerminal,
            execute: () => { var _a; return (_a = this.currentTerminal) === null || _a === void 0 ? void 0 : _a.selectAll(); }
        });
    }
    toggleTerminal() {
        const terminals = this.shell.getWidgets('bottom').filter(w => w instanceof terminal_widget_1.TerminalWidget);
        if (terminals.length === 0) {
            this.openTerminal();
            return;
        }
        if (this.shell.bottomPanel.isHidden) {
            this.shell.bottomPanel.setHidden(false);
            terminals[0].activate();
            return;
        }
        if (this.shell.bottomPanel.isVisible) {
            const visibleTerminal = terminals.find(t => t.isVisible);
            if (!visibleTerminal) {
                this.shell.bottomPanel.activateWidget(terminals[0]);
            }
            else if (this.shell.activeWidget !== visibleTerminal) {
                this.shell.bottomPanel.activateWidget(visibleTerminal);
            }
            else {
                this.shell.bottomPanel.setHidden(true);
            }
        }
    }
    async openInTerminal(uri) {
        // Determine folder path of URI
        let stat;
        try {
            stat = await this.fileService.resolve(uri);
        }
        catch {
            return;
        }
        // Use folder if a file was selected
        const cwd = (stat.isDirectory) ? uri.toString() : uri.parent.toString();
        // Open terminal
        const termWidget = await this.newTerminal({ cwd });
        termWidget.start();
        this.open(termWidget);
    }
    registerMenus(menus) {
        menus.registerSubmenu(TerminalMenus.TERMINAL, terminal_widget_impl_1.TerminalWidgetImpl.LABEL);
        menus.registerMenuAction(TerminalMenus.TERMINAL_NEW, {
            commandId: TerminalCommands.NEW.id,
            label: nls_1.nls.localizeByDefault('New Terminal'),
            order: '0'
        });
        menus.registerMenuAction(TerminalMenus.TERMINAL_NEW, {
            commandId: TerminalCommands.PROFILE_NEW.id,
            label: nls_1.nls.localize('theia/terminal/profileNew', 'New Terminal (With Profile)...'),
            order: '1'
        });
        menus.registerMenuAction(TerminalMenus.TERMINAL_NEW, {
            commandId: TerminalCommands.PROFILE_DEFAULT.id,
            label: nls_1.nls.localize('theia/terminal/profileDefault', 'Choose Default Profile...'),
            order: '3'
        });
        menus.registerMenuAction(TerminalMenus.TERMINAL_NEW, {
            commandId: TerminalCommands.SPLIT.id,
            order: '3'
        });
        menus.registerMenuAction(TerminalMenus.TERMINAL_NAVIGATOR_CONTEXT_MENU, {
            commandId: TerminalCommands.TERMINAL_CONTEXT.id,
            order: 'z'
        });
        menus.registerMenuAction(TerminalMenus.TERMINAL_OPEN_EDITORS_CONTEXT_MENU, {
            commandId: TerminalCommands.TERMINAL_CONTEXT.id,
            order: 'z'
        });
        menus.registerMenuAction([...TerminalMenus.TERMINAL_CONTEXT_MENU, '_1'], {
            commandId: TerminalCommands.NEW_ACTIVE_WORKSPACE.id,
            label: nls_1.nls.localizeByDefault('New Terminal')
        });
        menus.registerMenuAction([...TerminalMenus.TERMINAL_CONTEXT_MENU, '_1'], {
            commandId: TerminalCommands.SPLIT.id
        });
        menus.registerMenuAction([...TerminalMenus.TERMINAL_CONTEXT_MENU, '_2'], {
            commandId: browser_1.CommonCommands.COPY.id
        });
        menus.registerMenuAction([...TerminalMenus.TERMINAL_CONTEXT_MENU, '_2'], {
            commandId: browser_1.CommonCommands.PASTE.id
        });
        menus.registerMenuAction([...TerminalMenus.TERMINAL_CONTEXT_MENU, '_2'], {
            commandId: TerminalCommands.SELECT_ALL.id
        });
        menus.registerMenuAction([...TerminalMenus.TERMINAL_CONTEXT_MENU, '_3'], {
            commandId: TerminalCommands.TERMINAL_CLEAR.id
        });
        menus.registerMenuAction([...TerminalMenus.TERMINAL_CONTEXT_MENU, '_4'], {
            commandId: TerminalCommands.KILL_TERMINAL.id
        });
    }
    registerToolbarItems(toolbar) {
        toolbar.registerItem({
            id: TerminalCommands.SPLIT.id,
            command: TerminalCommands.SPLIT.id,
            icon: (0, browser_1.codicon)('split-horizontal'),
            tooltip: TerminalCommands.SPLIT.label
        });
    }
    registerKeybindings(keybindings) {
        /* Register passthrough keybindings for combinations recognized by
           xterm.js and converted to control characters.
             See: https://github.com/xtermjs/xterm.js/blob/v3/src/Terminal.ts#L1684 */
        /* Register ctrl + k (the passed Key) as a passthrough command in the
           context of the terminal.  */
        const regCtrl = (k) => {
            keybindings.registerKeybinding({
                command: browser_1.KeybindingRegistry.PASSTHROUGH_PSEUDO_COMMAND,
                keybinding: browser_1.KeyCode.createKeyCode({ key: k, ctrl: true }).toString(),
                when: 'terminalFocus',
            });
        };
        /* Register alt + k (the passed Key) as a passthrough command in the
           context of the terminal.  */
        const regAlt = (k) => {
            keybindings.registerKeybinding({
                command: browser_1.KeybindingRegistry.PASSTHROUGH_PSEUDO_COMMAND,
                keybinding: browser_1.KeyCode.createKeyCode({ key: k, alt: true }).toString(),
                when: 'terminalFocus'
            });
        };
        /* ctrl-space (000 - NUL).  */
        regCtrl(browser_1.Key.SPACE);
        /* ctrl-A (001/1/0x1) through ctrl-Z (032/26/0x1A).  */
        for (let i = 0; i < 26; i++) {
            regCtrl({
                keyCode: browser_1.Key.KEY_A.keyCode + i,
                code: 'Key' + String.fromCharCode('A'.charCodeAt(0) + i)
            });
        }
        /* ctrl-[ or ctrl-3 (033/27/0x1B - ESC).  */
        regCtrl(browser_1.Key.BRACKET_LEFT);
        regCtrl(browser_1.Key.DIGIT3);
        /* ctrl-\ or ctrl-4 (034/28/0x1C - FS).  */
        regCtrl(browser_1.Key.BACKSLASH);
        regCtrl(browser_1.Key.DIGIT4);
        /* ctrl-] or ctrl-5 (035/29/0x1D - GS).  */
        regCtrl(browser_1.Key.BRACKET_RIGHT);
        regCtrl(browser_1.Key.DIGIT5);
        /* ctrl-6 (036/30/0x1E - RS).  */
        regCtrl(browser_1.Key.DIGIT6);
        /* ctrl-7 (037/31/0x1F - US).  */
        regCtrl(browser_1.Key.DIGIT7);
        /* ctrl-8 (177/127/0x7F - DEL).  */
        regCtrl(browser_1.Key.DIGIT8);
        /* alt-A (0x1B 0x62) through alt-Z (0x1B 0x7A).  */
        for (let i = 0; i < 26; i++) {
            regAlt({
                keyCode: browser_1.Key.KEY_A.keyCode + i,
                code: 'Key' + String.fromCharCode('A'.charCodeAt(0) + i)
            });
        }
        /* alt-` (0x1B 0x60).  */
        regAlt(browser_1.Key.BACKQUOTE);
        /* alt-0 (0x1B 0x30) through alt-9 (0x1B 0x39).  */
        for (let i = 0; i < 10; i++) {
            regAlt({
                keyCode: browser_1.Key.DIGIT0.keyCode + i,
                code: 'Digit' + String.fromCharCode('0'.charCodeAt(0) + i)
            });
        }
        if (common_1.isOSX) {
            // selectAll on OSX
            keybindings.registerKeybinding({
                command: browser_1.KeybindingRegistry.PASSTHROUGH_PSEUDO_COMMAND,
                keybinding: 'ctrlcmd+a',
                when: 'terminalFocus'
            });
        }
        keybindings.registerKeybinding({
            command: TerminalCommands.NEW.id,
            keybinding: 'ctrl+shift+`'
        });
        keybindings.registerKeybinding({
            command: TerminalCommands.NEW_ACTIVE_WORKSPACE.id,
            keybinding: 'ctrl+`'
        });
        keybindings.registerKeybinding({
            command: TerminalCommands.TERMINAL_CLEAR.id,
            keybinding: 'ctrlcmd+k',
            when: 'terminalFocus'
        });
        keybindings.registerKeybinding({
            command: TerminalCommands.TERMINAL_FIND_TEXT.id,
            keybinding: 'ctrlcmd+f',
            when: 'terminalFocus'
        });
        keybindings.registerKeybinding({
            command: TerminalCommands.TERMINAL_FIND_TEXT_CANCEL.id,
            keybinding: 'esc',
            when: 'terminalHideSearch'
        });
        keybindings.registerKeybinding({
            command: TerminalCommands.SCROLL_LINE_UP.id,
            keybinding: 'ctrl+shift+up',
            when: 'terminalFocus'
        });
        keybindings.registerKeybinding({
            command: TerminalCommands.SCROLL_LINE_DOWN.id,
            keybinding: 'ctrl+shift+down',
            when: 'terminalFocus'
        });
        keybindings.registerKeybinding({
            command: TerminalCommands.SCROLL_TO_TOP.id,
            keybinding: 'shift-home',
            when: 'terminalFocus'
        });
        keybindings.registerKeybinding({
            command: TerminalCommands.SCROLL_PAGE_UP.id,
            keybinding: 'shift-pageUp',
            when: 'terminalFocus'
        });
        keybindings.registerKeybinding({
            command: TerminalCommands.SCROLL_PAGE_DOWN.id,
            keybinding: 'shift-pageDown',
            when: 'terminalFocus'
        });
        keybindings.registerKeybinding({
            command: TerminalCommands.TOGGLE_TERMINAL.id,
            keybinding: 'ctrl+`',
        });
        keybindings.registerKeybinding({
            command: TerminalCommands.SELECT_ALL.id,
            keybinding: 'ctrlcmd+a',
            when: 'terminalFocus'
        });
    }
    async newTerminal(options) {
        const widget = await this.widgetManager.getOrCreateWidget(terminal_widget_impl_1.TERMINAL_WIDGET_FACTORY_ID, {
            created: new Date().toISOString(),
            ...options
        });
        return widget;
    }
    // TODO: reuse WidgetOpenHandler.open
    open(widget, options) {
        var _a;
        const area = widget.location === terminal_widget_1.TerminalLocation.Editor ? 'main' : 'bottom';
        const widgetOptions = { area: area, ...options === null || options === void 0 ? void 0 : options.widgetOptions };
        let preserveFocus = false;
        if (typeof widget.location === 'object') {
            if ('parentTerminal' in widget.location) {
                widgetOptions.ref = this.getById(widget.location.parentTerminal);
                widgetOptions.mode = 'split-right';
            }
            else if ('viewColumn' in widget.location) {
                preserveFocus = (_a = widget.location.preserveFocus) !== null && _a !== void 0 ? _a : false;
                switch (widget.location.viewColumn) {
                    case common_1.ViewColumn.Active:
                        widgetOptions.ref = this.shell.currentWidget;
                        widgetOptions.mode = 'tab-after';
                        break;
                    case common_1.ViewColumn.Beside:
                        widgetOptions.ref = this.shell.currentWidget;
                        widgetOptions.mode = 'split-right';
                        break;
                    default:
                        widgetOptions.area = 'main';
                        const mainAreaTerminals = this.shell.getWidgets('main').filter(w => w instanceof terminal_widget_1.TerminalWidget && w.isVisible);
                        const column = Math.min(widget.location.viewColumn, mainAreaTerminals.length);
                        widgetOptions.mode = widget.location.viewColumn <= mainAreaTerminals.length ? 'split-left' : 'split-right';
                        widgetOptions.ref = mainAreaTerminals[column - 1];
                }
            }
        }
        const op = {
            mode: 'activate',
            ...options,
            widgetOptions: widgetOptions
        };
        if (!widget.isAttached) {
            this.shell.addWidget(widget, op.widgetOptions);
        }
        if (op.mode === 'activate' && !preserveFocus) {
            this.shell.activateWidget(widget.id);
        }
        else if (op.mode === 'reveal' || preserveFocus) {
            this.shell.revealWidget(widget.id);
        }
    }
    async selectTerminalCwd() {
        return new Promise(async (resolve) => {
            var _a, _b;
            const roots = this.workspaceService.tryGetRoots();
            if (roots.length === 0) {
                resolve(undefined);
            }
            else if (roots.length === 1) {
                resolve(roots[0].resource.toString());
            }
            else {
                const items = roots.map(({ resource }) => ({
                    label: this.labelProvider.getName(resource),
                    description: this.labelProvider.getLongName(resource),
                    resource
                }));
                const selectedItem = await ((_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.showQuickPick(items, {
                    placeholder: nls_1.nls.localizeByDefault('Select current working directory for new terminal')
                }));
                resolve((_b = selectedItem === null || selectedItem === void 0 ? void 0 : selectedItem.resource) === null || _b === void 0 ? void 0 : _b.toString());
            }
        });
    }
    async selectTerminalProfile(placeholder) {
        return new Promise(async (resolve) => {
            var _a;
            const profiles = this.profileService.all;
            if (profiles.length === 0) {
                resolve(undefined);
            }
            else {
                const items = profiles.map(([id, profile]) => ({
                    label: id,
                    profile
                }));
                const selectedItem = await ((_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.showQuickPick(items, {
                    placeholder
                }));
                resolve(selectedItem ? [selectedItem.label, selectedItem.profile] : undefined);
            }
        });
    }
    async splitTerminal(referenceTerminal) {
        if (referenceTerminal || this.currentTerminal) {
            const ref = referenceTerminal !== null && referenceTerminal !== void 0 ? referenceTerminal : this.currentTerminal;
            await this.openTerminal({ ref, mode: 'split-right' });
        }
    }
    async openTerminal(options, terminalProfile) {
        let profile = terminalProfile;
        if (!terminalProfile) {
            profile = this.profileService.defaultProfile;
            if (!profile) {
                throw new Error('There are not profiles registered');
            }
        }
        if (profile instanceof shell_terminal_profile_1.ShellTerminalProfile) {
            if (this.workspaceService.workspace) {
                const cwd = await this.selectTerminalCwd();
                if (!cwd) {
                    return;
                }
                profile = profile.modify({ cwd });
            }
        }
        const termWidget = await (profile === null || profile === void 0 ? void 0 : profile.start());
        if (!!termWidget) {
            this.open(termWidget, { widgetOptions: options });
        }
    }
    async chooseDefaultProfile() {
        const result = await this.selectTerminalProfile(nls_1.nls.localizeByDefault('Select your default terminal profile'));
        if (!result) {
            return;
        }
        this.preferenceService.set(`terminal.integrated.defaultProfile.${common_1.OS.backend.type().toLowerCase()}`, result[0], browser_1.PreferenceScope.User);
    }
    async openActiveWorkspaceTerminal(options) {
        const termWidget = await this.newTerminal({});
        termWidget.start();
        this.open(termWidget, { widgetOptions: options });
    }
    withWidget(widget, fn) {
        if (widget instanceof terminal_widget_1.TerminalWidget) {
            return fn(widget);
        }
        return false;
    }
    /**
     * It should be aligned with https://code.visualstudio.com/api/references/theme-color#integrated-terminal-colors
     */
    registerColors(colors) {
        colors.register({
            id: 'terminal.background',
            defaults: {
                dark: 'panel.background',
                light: 'panel.background',
                hcDark: 'panel.background',
                hcLight: 'panel.background'
            },
            description: 'The background color of the terminal, this allows coloring the terminal differently to the panel.'
        });
        colors.register({
            id: 'terminal.foreground',
            defaults: {
                light: '#333333',
                dark: '#CCCCCC',
                hcDark: '#FFFFFF',
                hcLight: '#292929'
            },
            description: 'The foreground color of the terminal.'
        });
        colors.register({
            id: 'terminalCursor.foreground',
            description: 'The foreground color of the terminal cursor.'
        });
        colors.register({
            id: 'terminalCursor.background',
            description: 'The background color of the terminal cursor. Allows customizing the color of a character overlapped by a block cursor.'
        });
        colors.register({
            id: 'terminal.selectionBackground',
            defaults: {
                light: 'editor.selectionBackground',
                dark: 'editor.selectionBackground',
                hcDark: 'editor.selectionBackground',
                hcLight: 'editor.selectionBackground'
            },
            description: 'The selection background color of the terminal.'
        });
        colors.register({
            id: 'terminal.border',
            defaults: {
                light: 'panel.border',
                dark: 'panel.border',
                hcDark: 'panel.border',
                hcLight: 'panel.border'
            },
            description: 'The color of the border that separates split panes within the terminal. This defaults to panel.border.'
        });
        // eslint-disable-next-line guard-for-in
        for (const id in terminal_theme_service_1.terminalAnsiColorMap) {
            const entry = terminal_theme_service_1.terminalAnsiColorMap[id];
            const colorName = id.substring(13);
            colors.register({
                id,
                defaults: entry.defaults,
                description: `'${colorName}'  ANSI color in the terminal.`
            });
        }
    }
};
__decorate([
    (0, inversify_1.inject)(browser_1.ApplicationShell),
    __metadata("design:type", browser_1.ApplicationShell)
], TerminalFrontendContribution.prototype, "shell", void 0);
__decorate([
    (0, inversify_1.inject)(shell_terminal_protocol_1.ShellTerminalServerProxy),
    __metadata("design:type", Object)
], TerminalFrontendContribution.prototype, "shellTerminalServer", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.WidgetManager),
    __metadata("design:type", browser_1.WidgetManager)
], TerminalFrontendContribution.prototype, "widgetManager", void 0);
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], TerminalFrontendContribution.prototype, "fileService", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.SelectionService),
    __metadata("design:type", common_1.SelectionService)
], TerminalFrontendContribution.prototype, "selectionService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.LabelProvider),
    __metadata("design:type", browser_1.LabelProvider)
], TerminalFrontendContribution.prototype, "labelProvider", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.QuickInputService),
    (0, inversify_1.optional)(),
    __metadata("design:type", Object)
], TerminalFrontendContribution.prototype, "quickInputService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.WorkspaceService),
    __metadata("design:type", browser_2.WorkspaceService)
], TerminalFrontendContribution.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(terminal_profile_service_1.TerminalProfileService),
    __metadata("design:type", Object)
], TerminalFrontendContribution.prototype, "profileService", void 0);
__decorate([
    (0, inversify_1.inject)(terminal_profile_service_1.UserTerminalProfileStore),
    __metadata("design:type", Object)
], TerminalFrontendContribution.prototype, "userProfileStore", void 0);
__decorate([
    (0, inversify_1.inject)(terminal_profile_service_1.ContributedTerminalProfileStore),
    __metadata("design:type", Object)
], TerminalFrontendContribution.prototype, "contributedProfileStore", void 0);
__decorate([
    (0, inversify_1.inject)(terminal_watcher_1.TerminalWatcher),
    __metadata("design:type", terminal_watcher_1.TerminalWatcher)
], TerminalFrontendContribution.prototype, "terminalWatcher", void 0);
__decorate([
    (0, inversify_1.inject)(browser_3.VariableResolverService),
    __metadata("design:type", browser_3.VariableResolverService)
], TerminalFrontendContribution.prototype, "variableResolver", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.StorageService),
    __metadata("design:type", Object)
], TerminalFrontendContribution.prototype, "storageService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.PreferenceService),
    __metadata("design:type", Object)
], TerminalFrontendContribution.prototype, "preferenceService", void 0);
__decorate([
    (0, inversify_1.inject)(terminal_preferences_1.TerminalPreferences),
    __metadata("design:type", Object)
], TerminalFrontendContribution.prototype, "terminalPreferences", void 0);
__decorate([
    (0, inversify_1.inject)(context_key_service_1.ContextKeyService),
    __metadata("design:type", Object)
], TerminalFrontendContribution.prototype, "contextKeyService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TerminalFrontendContribution.prototype, "init", null);
TerminalFrontendContribution = __decorate([
    (0, inversify_1.injectable)()
], TerminalFrontendContribution);
exports.TerminalFrontendContribution = TerminalFrontendContribution;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/terminal/lib/browser/terminal-frontend-contribution'] = this;


/***/ }),

/***/ "../../packages/terminal/lib/browser/terminal-preferences.js":
/*!*******************************************************************!*\
  !*** ../../packages/terminal/lib/browser/terminal-preferences.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2018 Bitsler and others.
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
exports.bindTerminalPreferences = exports.createTerminalPreferences = exports.TerminalPreferences = exports.TerminalPreferenceContribution = exports.isTerminalRendererType = exports.DEFAULT_TERMINAL_RENDERER_TYPE = exports.TerminalConfigSchema = void 0;
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
const editor_generated_preference_schema_1 = __webpack_require__(/*! @theia/editor/lib/browser/editor-generated-preference-schema */ "../../packages/editor/lib/browser/editor-generated-preference-schema.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const terminal_theme_service_1 = __webpack_require__(/*! ./terminal-theme-service */ "../../packages/terminal/lib/browser/terminal-theme-service.js");
const commonProfileProperties = {
    env: {
        type: 'object',
        additionalProperties: {
            type: 'string'
        },
        markdownDescription: nls_1.nls.localizeByDefault('An object with environment variables that will be added to the terminal profile process. Set to `null` to delete environment variables from the base environment.'),
    },
    overrideName: {
        type: 'boolean',
        description: nls_1.nls.localizeByDefault('Controls whether or not the profile name overrides the auto detected one.')
    },
    icon: {
        type: 'string',
        markdownDescription: nls_1.nls.localize('theia/terminal/profileIcon', 'A codicon ID to associate with the terminal icon.\nterminal-tmux:"$(terminal-tmux)"')
    },
    color: {
        type: 'string',
        enum: Object.getOwnPropertyNames(terminal_theme_service_1.terminalAnsiColorMap),
        description: nls_1.nls.localize('theia/terminal/profileColor', 'A terminal theme color ID to associate with the terminal.')
    }
};
const stringOrStringArray = {
    oneOf: [
        { type: 'string' },
        {
            type: 'array',
            items: {
                type: 'string'
            }
        }
    ]
};
const pathProperty = {
    description: nls_1.nls.localize('theia/terminal/profilePath', 'The path of the shell that this profile uses.'),
    ...stringOrStringArray
};
function shellArgsDeprecatedMessage(type) {
    return nls_1.nls.localize('theia/terminal/shell.deprecated', 'This is deprecated, the new recommended way to configure your default shell is by creating a terminal profile in \'terminal.integrated.profiles.{0}\' and setting its profile name as the default in \'terminal.integrated.defaultProfile.{0}.\'', type.toString().toLowerCase());
}
exports.TerminalConfigSchema = {
    type: 'object',
    properties: {
        'terminal.enableCopy': {
            type: 'boolean',
            description: nls_1.nls.localize('theia/terminal/enableCopy', 'Enable ctrl-c (cmd-c on macOS) to copy selected text'),
            default: true
        },
        'terminal.enablePaste': {
            type: 'boolean',
            description: nls_1.nls.localize('theia/terminal/enablePaste', 'Enable ctrl-v (cmd-v on macOS) to paste from clipboard'),
            default: true
        },
        'terminal.integrated.fontFamily': {
            type: 'string',
            markdownDescription: nls_1.nls.localizeByDefault('Controls the font family of the terminal. Defaults to {0}\'s value.', '`#editor.fontFamily#`'),
            default: editor_generated_preference_schema_1.editorGeneratedPreferenceProperties['editor.fontFamily'].default,
        },
        'terminal.integrated.fontSize': {
            type: 'number',
            description: nls_1.nls.localizeByDefault('Controls the font size in pixels of the terminal.'),
            minimum: 6,
            default: editor_generated_preference_schema_1.editorGeneratedPreferenceProperties['editor.fontSize'].default
        },
        'terminal.integrated.fontWeight': {
            type: 'string',
            enum: ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
            description: nls_1.nls.localizeByDefault('The font weight to use within the terminal for non-bold text. Accepts \"normal\" and \"bold\" keywords or numbers between 1 and 1000.'),
            default: 'normal'
        },
        'terminal.integrated.fontWeightBold': {
            type: 'string',
            enum: ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
            description: nls_1.nls.localizeByDefault('The font weight to use within the terminal for bold text. Accepts \"normal\" and \"bold\" keywords or numbers between 1 and 1000.'),
            default: 'bold'
        },
        'terminal.integrated.drawBoldTextInBrightColors': {
            description: nls_1.nls.localizeByDefault('Controls whether bold text in the terminal will always use the \"bright\" ANSI color variant.'),
            type: 'boolean',
            default: true,
        },
        'terminal.integrated.letterSpacing': {
            description: nls_1.nls.localizeByDefault('Controls the letter spacing of the terminal. This is an integer value which represents the number of additional pixels to add between characters.'),
            type: 'number',
            default: 1
        },
        'terminal.integrated.lineHeight': {
            description: nls_1.nls.localizeByDefault('Controls the line height of the terminal. This number is multiplied by the terminal font size to get the actual line-height in pixels.'),
            type: 'number',
            minimum: 1,
            default: 1
        },
        'terminal.integrated.scrollback': {
            description: nls_1.nls.localizeByDefault('Controls the maximum number of lines the terminal keeps in its buffer. We pre-allocate memory based on this value in order to ensure a smooth experience. As such, as the value increases, so will the amount of memory.'),
            type: 'number',
            default: 1000
        },
        'terminal.integrated.fastScrollSensitivity': {
            markdownDescription: nls_1.nls.localizeByDefault('Scrolling speed multiplier when pressing `Alt`.'),
            type: 'number',
            default: 5,
        },
        'terminal.integrated.rendererType': {
            description: nls_1.nls.localize('theia/terminal/rendererType', 'Controls how the terminal is rendered.'),
            type: 'string',
            enum: ['canvas', 'dom'],
            default: 'canvas'
        },
        'terminal.integrated.copyOnSelection': {
            description: nls_1.nls.localizeByDefault('Controls whether text selected in the terminal will be copied to the clipboard.'),
            type: 'boolean',
            default: false,
        },
        'terminal.integrated.cursorBlinking': {
            description: nls_1.nls.localizeByDefault('Controls whether the terminal cursor blinks.'),
            type: 'boolean',
            default: false
        },
        'terminal.integrated.cursorStyle': {
            description: nls_1.nls.localizeByDefault('Controls the style of terminal cursor.'),
            enum: ['block', 'underline', 'line'],
            default: 'block'
        },
        'terminal.integrated.cursorWidth': {
            markdownDescription: nls_1.nls.localizeByDefault('Controls the width of the cursor when {0} is set to {1}.', '`#terminal.integrated.cursorStyle#`', '`line`'),
            type: 'number',
            default: 1
        },
        'terminal.integrated.shell.windows': {
            type: ['string', 'null'],
            typeDetails: { isFilepath: true },
            markdownDescription: nls_1.nls.localize('theia/terminal/shellWindows', 'The path of the shell that the terminal uses on Windows. (default: \'{0}\').', 'C:\\Windows\\System32\\cmd.exe'),
            default: undefined,
            deprecationMessage: shellArgsDeprecatedMessage(core_1.OS.Type.Windows),
        },
        'terminal.integrated.shell.osx': {
            type: ['string', 'null'],
            markdownDescription: nls_1.nls.localize('theia/terminal/shellOsx', 'The path of the shell that the terminal uses on macOS (default: \'{0}\'}).', '/bin/bash'),
            default: undefined,
            deprecationMessage: shellArgsDeprecatedMessage(core_1.OS.Type.OSX),
        },
        'terminal.integrated.shell.linux': {
            type: ['string', 'null'],
            markdownDescription: nls_1.nls.localize('theia/terminal/shellLinux', 'The path of the shell that the terminal uses on Linux (default: \'{0}\'}).', '/bin/bash'),
            default: undefined,
            deprecationMessage: shellArgsDeprecatedMessage(core_1.OS.Type.Linux),
        },
        'terminal.integrated.shellArgs.windows': {
            type: 'array',
            markdownDescription: nls_1.nls.localize('theia/terminal/shellArgsWindows', 'The command line arguments to use when on the Windows terminal.'),
            default: [],
            deprecationMessage: shellArgsDeprecatedMessage(core_1.OS.Type.Windows),
        },
        'terminal.integrated.shellArgs.osx': {
            type: 'array',
            markdownDescription: nls_1.nls.localize('theia/terminal/shellArgsOsx', 'The command line arguments to use when on the macOS terminal.'),
            default: [
                '-l'
            ],
            deprecationMessage: shellArgsDeprecatedMessage(core_1.OS.Type.OSX),
        },
        'terminal.integrated.shellArgs.linux': {
            type: 'array',
            markdownDescription: nls_1.nls.localize('theia/terminal/shellArgsLinux', 'The command line arguments to use when on the Linux terminal.'),
            default: [],
            deprecationMessage: shellArgsDeprecatedMessage(core_1.OS.Type.Linux),
        },
        'terminal.integrated.confirmOnExit': {
            type: 'string',
            description: nls_1.nls.localizeByDefault('Controls whether to confirm when the window closes if there are active terminal sessions.'),
            enum: ['never', 'always', 'hasChildProcesses'],
            enumDescriptions: [
                nls_1.nls.localizeByDefault('Never confirm.'),
                nls_1.nls.localizeByDefault('Always confirm if there are terminals.'),
                nls_1.nls.localizeByDefault('Confirm if there are any terminals that have child processes.'),
            ],
            default: 'never'
        },
        'terminal.integrated.enablePersistentSessions': {
            type: 'boolean',
            description: nls_1.nls.localizeByDefault('Persist terminal sessions/history for the workspace across window reloads.'),
            default: true
        },
        'terminal.integrated.defaultProfile.windows': {
            type: 'string',
            description: nls_1.nls.localize('theia/terminal/defaultProfile', 'The default profile used on {0}', core_1.OS.Type.Windows.toString())
        },
        'terminal.integrated.defaultProfile.linux': {
            type: 'string',
            description: nls_1.nls.localize('theia/terminal/defaultProfile', 'The default profile used on {0}', core_1.OS.Type.Linux.toString())
        },
        'terminal.integrated.defaultProfile.osx': {
            type: 'string',
            description: nls_1.nls.localize('theia/terminal/defaultProfile', 'The default profile used on {0}', core_1.OS.Type.OSX.toString())
        },
        'terminal.integrated.profiles.windows': {
            markdownDescription: nls_1.nls.localize('theia/terminal/profiles', 'The profiles to present when creating a new terminal. Set the path property manually with optional args.\nSet an existing profile to `null` to hide the profile from the list, for example: `"{0}": null`.', 'cmd'),
            anyOf: [
                {
                    type: 'object',
                    properties: {},
                    additionalProperties: {
                        oneOf: [{
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                    path: pathProperty,
                                    args: {
                                        ...stringOrStringArray,
                                        description: nls_1.nls.localize('theia/terminal/profileArgs', 'The shell arguments that this profile uses.'),
                                    },
                                    ...commonProfileProperties
                                },
                                required: ['path']
                            },
                            {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                    source: {
                                        type: 'string',
                                        description: nls_1.nls.localizeByDefault('A profile source that will auto detect the paths to the shell. Note that non-standard executable locations are not supported and must be created manually in a new profile.')
                                    },
                                    args: {
                                        ...stringOrStringArray,
                                        description: nls_1.nls.localize('theia/terminal/profileArgs', 'The shell arguments that this profile uses.'),
                                    },
                                    ...commonProfileProperties
                                },
                                required: ['source'],
                                default: {
                                    path: 'C:\\Windows\\System32\\cmd.exe'
                                }
                            }, {
                                type: 'null'
                            }]
                    },
                    default: {
                        cmd: {
                            path: 'C:\\Windows\\System32\\cmd.exe'
                        }
                    }
                },
                { type: 'null' }
            ]
        },
        'terminal.integrated.profiles.linux': {
            markdownDescription: nls_1.nls.localize('theia/terminal/profiles', 'The profiles to present when creating a new terminal. Set the path property manually with optional args.\nSet an existing profile to `null` to hide the profile from the list, for example: `"{0}": null`.', 'bash'),
            anyOf: [{
                    type: 'object',
                    properties: {},
                    additionalProperties: {
                        oneOf: [
                            {
                                type: 'object',
                                properties: {
                                    path: pathProperty,
                                    args: {
                                        type: 'array',
                                        items: { type: 'string' },
                                        description: nls_1.nls.localize('theia/terminal/profileArgs', 'The shell arguments that this profile uses.'),
                                    },
                                    ...commonProfileProperties
                                },
                                required: ['path'],
                                additionalProperties: false,
                            },
                            { type: 'null' }
                        ]
                    },
                    default: {
                        path: '${env:SHELL}',
                        args: ['-l']
                    }
                },
                { type: 'null' }
            ]
        },
        'terminal.integrated.profiles.osx': {
            markdownDescription: nls_1.nls.localize('theia/terminal/profiles', 'The profiles to present when creating a new terminal. Set the path property manually with optional args.\nSet an existing profile to `null` to hide the profile from the list, for example: `"{0}": null`.', 'zsh'),
            anyOf: [{
                    type: 'object',
                    properties: {},
                    additionalProperties: {
                        oneOf: [
                            {
                                type: 'object',
                                properties: {
                                    path: pathProperty,
                                    args: {
                                        type: 'array',
                                        items: { type: 'string' },
                                        description: nls_1.nls.localize('theia/terminal/profileArgs', 'The shell arguments that this profile uses.'),
                                    },
                                    ...commonProfileProperties
                                },
                                required: ['path'],
                                additionalProperties: false,
                            },
                            { type: 'null' }
                        ]
                    },
                    default: {
                        path: '${env:SHELL}',
                        args: ['-l']
                    }
                },
                { type: 'null' }
            ]
        },
    }
};
exports.DEFAULT_TERMINAL_RENDERER_TYPE = 'canvas';
function isTerminalRendererType(arg) {
    return typeof arg === 'string' && (arg === 'canvas' || arg === 'dom');
}
exports.isTerminalRendererType = isTerminalRendererType;
exports.TerminalPreferenceContribution = Symbol('TerminalPreferenceContribution');
exports.TerminalPreferences = Symbol('TerminalPreferences');
function createTerminalPreferences(preferences, schema = exports.TerminalConfigSchema) {
    return (0, browser_1.createPreferenceProxy)(preferences, schema);
}
exports.createTerminalPreferences = createTerminalPreferences;
function bindTerminalPreferences(bind) {
    bind(exports.TerminalPreferences).toDynamicValue(ctx => {
        const preferences = ctx.container.get(browser_1.PreferenceService);
        const contribution = ctx.container.get(exports.TerminalPreferenceContribution);
        return createTerminalPreferences(preferences, contribution.schema);
    }).inSingletonScope();
    bind(exports.TerminalPreferenceContribution).toConstantValue({ schema: exports.TerminalConfigSchema });
    bind(browser_1.PreferenceContribution).toService(exports.TerminalPreferenceContribution);
}
exports.bindTerminalPreferences = bindTerminalPreferences;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/terminal/lib/browser/terminal-preferences'] = this;


/***/ }),

/***/ "../../packages/terminal/lib/browser/terminal-profile-service.js":
/*!***********************************************************************!*\
  !*** ../../packages/terminal/lib/browser/terminal-profile-service.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DefaultTerminalProfileService = exports.DefaultProfileStore = exports.NULL_PROFILE = exports.UserTerminalProfileStore = exports.ContributedTerminalProfileStore = exports.TerminalProfileService = void 0;
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
exports.TerminalProfileService = Symbol('TerminalProfileService');
exports.ContributedTerminalProfileStore = Symbol('ContributedTerminalProfileStore');
exports.UserTerminalProfileStore = Symbol('UserTerminalProfileStore');
exports.NULL_PROFILE = {
    start: async () => { throw new Error('you cannot start a null profile'); }
};
let DefaultProfileStore = class DefaultProfileStore {
    constructor() {
        this.onAddedEmitter = new core_1.Emitter();
        this.onRemovedEmitter = new core_1.Emitter();
        this.profiles = new Map();
        this.onAdded = this.onAddedEmitter.event;
        this.onRemoved = this.onRemovedEmitter.event;
    }
    registerTerminalProfile(id, profile) {
        this.profiles.set(id, profile);
        this.onAddedEmitter.fire([id, profile]);
    }
    unregisterTerminalProfile(id) {
        this.profiles.delete(id);
        this.onRemovedEmitter.fire(id);
    }
    hasProfile(id) {
        return this.profiles.has(id);
    }
    getProfile(id) {
        return this.profiles.get(id);
    }
    get all() {
        return [...this.profiles.entries()];
    }
};
DefaultProfileStore = __decorate([
    (0, inversify_1.injectable)()
], DefaultProfileStore);
exports.DefaultProfileStore = DefaultProfileStore;
let DefaultTerminalProfileService = class DefaultTerminalProfileService {
    constructor(...stores) {
        this.defaultProfileIndex = 0;
        this.order = [];
        this.onAddedEmitter = new core_1.Emitter();
        this.onRemovedEmitter = new core_1.Emitter();
        this.onAdded = this.onAddedEmitter.event;
        this.onRemoved = this.onRemovedEmitter.event;
        this.stores = stores;
        for (const store of this.stores) {
            store.onAdded(e => {
                if (e[1] === exports.NULL_PROFILE) {
                    this.handleRemoved(e[0]);
                }
                else {
                    this.handleAdded(e[0]);
                }
            });
            store.onRemoved(id => {
                if (!this.getProfile(id)) {
                    this.handleRemoved(id);
                }
                else {
                    // we may have removed a null profile
                    this.handleAdded(id);
                }
            });
        }
    }
    handleRemoved(id) {
        const index = this.order.indexOf(id);
        if (index >= 0 && !this.getProfile(id)) {
            // the profile was removed, but it's still in the `order` array
            this.order.splice(index, 1);
            this.defaultProfileIndex = Math.max(0, Math.min(this.order.length - 1, index));
            this.onRemovedEmitter.fire(id);
        }
    }
    handleAdded(id) {
        const index = this.order.indexOf(id);
        if (index < 0) {
            this.order.push(id);
            this.onAddedEmitter.fire(id);
        }
    }
    get defaultProfile() {
        const id = this.order[this.defaultProfileIndex];
        if (id) {
            return this.getProfile(id);
        }
        return undefined;
    }
    setDefaultProfile(id) {
        const profile = this.getProfile(id);
        if (!profile) {
            throw new Error(`Cannot set default to unknown profile '${id}' `);
        }
        this.defaultProfileIndex = this.order.indexOf(id);
    }
    getProfile(id) {
        for (const store of this.stores) {
            if (store.hasProfile(id)) {
                const found = store.getProfile(id);
                return found === exports.NULL_PROFILE ? undefined : found;
            }
        }
        return undefined;
    }
    getId(profile) {
        for (const [id, p] of this.all) {
            if (p === profile) {
                return id;
            }
        }
    }
    get all() {
        return this.order.filter(id => !!this.getProfile(id)).map(id => [id, this.getProfile(id)]);
    }
};
DefaultTerminalProfileService = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [Object])
], DefaultTerminalProfileService);
exports.DefaultTerminalProfileService = DefaultTerminalProfileService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/terminal/lib/browser/terminal-profile-service'] = this;


/***/ }),

/***/ "../../packages/terminal/lib/browser/terminal-theme-service.js":
/*!*********************************************************************!*\
  !*** ../../packages/terminal/lib/browser/terminal-theme-service.js ***!
  \*********************************************************************/
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
exports.TerminalThemeService = exports.terminalAnsiColorMap = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const color_registry_1 = __webpack_require__(/*! @theia/core/lib/browser/color-registry */ "../../packages/core/lib/browser/color-registry.js");
const theming_1 = __webpack_require__(/*! @theia/core/lib/browser/theming */ "../../packages/core/lib/browser/theming.js");
/**
 * It should be aligned with https://github.com/microsoft/vscode/blob/0dfa355b3ad185a6289ba28a99c141ab9e72d2be/src/vs/workbench/contrib/terminal/common/terminalColorRegistry.ts#L40
 */
exports.terminalAnsiColorMap = {
    'terminal.ansiBlack': {
        index: 0,
        defaults: {
            light: '#000000',
            dark: '#000000',
            hcDark: '#000000',
            hcLight: '#292929'
        }
    },
    'terminal.ansiRed': {
        index: 1,
        defaults: {
            light: '#cd3131',
            dark: '#cd3131',
            hcDark: '#cd0000',
            hcLight: '#cd3131'
        }
    },
    'terminal.ansiGreen': {
        index: 2,
        defaults: {
            light: '#00BC00',
            dark: '#0DBC79',
            hcDark: '#00cd00',
            hcLight: '#00bc00'
        }
    },
    'terminal.ansiYellow': {
        index: 3,
        defaults: {
            light: '#949800',
            dark: '#e5e510',
            hcDark: '#cdcd00',
            hcLight: '#949800'
        }
    },
    'terminal.ansiBlue': {
        index: 4,
        defaults: {
            light: '#0451a5',
            dark: '#2472c8',
            hcDark: '#0000ee',
            hcLight: '#0451a5'
        }
    },
    'terminal.ansiMagenta': {
        index: 5,
        defaults: {
            light: '#bc05bc',
            dark: '#bc3fbc',
            hcDark: '#cd00cd',
            hcLight: '#bc05bc'
        }
    },
    'terminal.ansiCyan': {
        index: 6,
        defaults: {
            light: '#0598bc',
            dark: '#11a8cd',
            hcDark: '#00cdcd',
            hcLight: '#0598b'
        }
    },
    'terminal.ansiWhite': {
        index: 7,
        defaults: {
            light: '#555555',
            dark: '#e5e5e5',
            hcDark: '#e5e5e5',
            hcLight: '#555555'
        }
    },
    'terminal.ansiBrightBlack': {
        index: 8,
        defaults: {
            light: '#666666',
            dark: '#666666',
            hcDark: '#7f7f7f',
            hcLight: '#666666'
        }
    },
    'terminal.ansiBrightRed': {
        index: 9,
        defaults: {
            light: '#cd3131',
            dark: '#f14c4c',
            hcDark: '#ff0000',
            hcLight: '#cd3131'
        }
    },
    'terminal.ansiBrightGreen': {
        index: 10,
        defaults: {
            light: '#14CE14',
            dark: '#23d18b',
            hcDark: '#00ff00',
            hcLight: '#00bc00'
        }
    },
    'terminal.ansiBrightYellow': {
        index: 11,
        defaults: {
            light: '#b5ba00',
            dark: '#f5f543',
            hcDark: '#ffff00',
            hcLight: '#b5ba00'
        }
    },
    'terminal.ansiBrightBlue': {
        index: 12,
        defaults: {
            light: '#0451a5',
            dark: '#3b8eea',
            hcDark: '#5c5cff',
            hcLight: '#0451a5'
        }
    },
    'terminal.ansiBrightMagenta': {
        index: 13,
        defaults: {
            light: '#bc05bc',
            dark: '#d670d6',
            hcDark: '#ff00ff',
            hcLight: '#bc05bc'
        }
    },
    'terminal.ansiBrightCyan': {
        index: 14,
        defaults: {
            light: '#0598bc',
            dark: '#29b8db',
            hcDark: '#00ffff',
            hcLight: '#0598bc'
        }
    },
    'terminal.ansiBrightWhite': {
        index: 15,
        defaults: {
            light: '#a5a5a5',
            dark: '#e5e5e5',
            hcDark: '#ffffff',
            hcLight: '#a5a5a5'
        }
    }
};
let TerminalThemeService = class TerminalThemeService {
    get onDidChange() {
        return this.themeService.onDidColorThemeChange;
    }
    get theme() {
        const foregroundColor = this.colorRegistry.getCurrentColor('terminal.foreground');
        const backgroundColor = this.colorRegistry.getCurrentColor('terminal.background') || this.colorRegistry.getCurrentColor('panel.background');
        const cursorColor = this.colorRegistry.getCurrentColor('terminalCursor.foreground') || foregroundColor;
        const cursorAccentColor = this.colorRegistry.getCurrentColor('terminalCursor.background') || backgroundColor;
        const selectionColor = this.colorRegistry.getCurrentColor('terminal.selectionBackground');
        const theme = {
            background: backgroundColor,
            foreground: foregroundColor,
            cursor: cursorColor,
            cursorAccent: cursorAccentColor,
            selection: selectionColor
        };
        // eslint-disable-next-line guard-for-in
        for (const id in exports.terminalAnsiColorMap) {
            const colorId = id.substring(13);
            const colorName = colorId.charAt(0).toLowerCase() + colorId.slice(1);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            theme[colorName] = this.colorRegistry.getCurrentColor(id);
        }
        return theme;
    }
};
__decorate([
    (0, inversify_1.inject)(color_registry_1.ColorRegistry),
    __metadata("design:type", color_registry_1.ColorRegistry)
], TerminalThemeService.prototype, "colorRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(theming_1.ThemeService),
    __metadata("design:type", theming_1.ThemeService)
], TerminalThemeService.prototype, "themeService", void 0);
TerminalThemeService = __decorate([
    (0, inversify_1.injectable)()
], TerminalThemeService);
exports.TerminalThemeService = TerminalThemeService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/terminal/lib/browser/terminal-theme-service'] = this;


/***/ }),

/***/ "../../packages/terminal/lib/browser/terminal-widget-impl.js":
/*!*******************************************************************!*\
  !*** ../../packages/terminal/lib/browser/terminal-widget-impl.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var TerminalWidgetImpl_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TerminalWidgetImpl = exports.TerminalContribution = exports.TERMINAL_WIDGET_FACTORY_ID = void 0;
const xterm_1 = __webpack_require__(/*! xterm */ "../../node_modules/xterm/lib/xterm.js");
const xterm_addon_fit_1 = __webpack_require__(/*! xterm-addon-fit */ "../../node_modules/xterm-addon-fit/lib/xterm-addon-fit.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const browser_2 = __webpack_require__(/*! @theia/workspace/lib/browser */ "../../packages/workspace/lib/browser/index.js");
const shell_terminal_protocol_1 = __webpack_require__(/*! ../common/shell-terminal-protocol */ "../../packages/terminal/lib/common/shell-terminal-protocol.js");
const terminal_protocol_1 = __webpack_require__(/*! ../common/terminal-protocol */ "../../packages/terminal/lib/common/terminal-protocol.js");
const base_terminal_protocol_1 = __webpack_require__(/*! ../common/base-terminal-protocol */ "../../packages/terminal/lib/common/base-terminal-protocol.js");
const terminal_watcher_1 = __webpack_require__(/*! ../common/terminal-watcher */ "../../packages/terminal/lib/common/terminal-watcher.js");
const terminal_widget_1 = __webpack_require__(/*! ./base/terminal-widget */ "../../packages/terminal/lib/browser/base/terminal-widget.js");
const promise_util_1 = __webpack_require__(/*! @theia/core/lib/common/promise-util */ "../../packages/core/lib/common/promise-util.js");
const terminal_preferences_1 = __webpack_require__(/*! ./terminal-preferences */ "../../packages/terminal/lib/browser/terminal-preferences.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const terminal_service_1 = __webpack_require__(/*! ./base/terminal-service */ "../../packages/terminal/lib/browser/base/terminal-service.js");
const terminal_search_widget_1 = __webpack_require__(/*! ./search/terminal-search-widget */ "../../packages/terminal/lib/browser/search/terminal-search-widget.js");
const terminal_copy_on_selection_handler_1 = __webpack_require__(/*! ./terminal-copy-on-selection-handler */ "../../packages/terminal/lib/browser/terminal-copy-on-selection-handler.js");
const terminal_theme_service_1 = __webpack_require__(/*! ./terminal-theme-service */ "../../packages/terminal/lib/browser/terminal-theme-service.js");
const shell_command_builder_1 = __webpack_require__(/*! @theia/process/lib/common/shell-command-builder */ "../../packages/process/lib/common/shell-command-builder.js");
const keys_1 = __webpack_require__(/*! @theia/core/lib/browser/keys */ "../../packages/core/lib/browser/keys.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
const terminal_frontend_contribution_1 = __webpack_require__(/*! ./terminal-frontend-contribution */ "../../packages/terminal/lib/browser/terminal-frontend-contribution.js");
const debounce = __webpack_require__(/*! p-debounce */ "../../node_modules/p-debounce/index.js");
const markdown_string_1 = __webpack_require__(/*! @theia/core/lib/common/markdown-rendering/markdown-string */ "../../packages/core/lib/common/markdown-rendering/markdown-string.js");
const markdown_renderer_1 = __webpack_require__(/*! @theia/core/lib/browser/markdown-rendering/markdown-renderer */ "../../packages/core/lib/browser/markdown-rendering/markdown-renderer.js");
exports.TERMINAL_WIDGET_FACTORY_ID = 'terminal';
exports.TerminalContribution = Symbol('TerminalContribution');
let TerminalWidgetImpl = TerminalWidgetImpl_1 = class TerminalWidgetImpl extends terminal_widget_1.TerminalWidget {
    constructor() {
        super(...arguments);
        this.isExtractable = true;
        this.terminalKind = 'user';
        this._terminalId = -1;
        this.onTermDidClose = new core_1.Emitter();
        this.restored = false;
        this.closeOnDispose = true;
        this.isAttachedCloseListener = false;
        this.shown = false;
        this.lastCwd = new uri_1.default();
        this.onDidOpenEmitter = new core_1.Emitter();
        this.onDidOpen = this.onDidOpenEmitter.event;
        this.onDidOpenFailureEmitter = new core_1.Emitter();
        this.onDidOpenFailure = this.onDidOpenFailureEmitter.event;
        this.onSizeChangedEmitter = new core_1.Emitter();
        this.onSizeChanged = this.onSizeChangedEmitter.event;
        this.onDataEmitter = new core_1.Emitter();
        this.onData = this.onDataEmitter.event;
        this.onKeyEmitter = new core_1.Emitter();
        this.onKey = this.onKeyEmitter.event;
        this.onMouseEnterLinkHoverEmitter = new core_1.Emitter();
        this.onMouseEnterLinkHover = this.onMouseEnterLinkHoverEmitter.event;
        this.onMouseLeaveLinkHoverEmitter = new core_1.Emitter();
        this.onMouseLeaveLinkHover = this.onMouseLeaveLinkHoverEmitter.event;
        this.toDisposeOnConnect = new core_1.DisposableCollection();
        this.needsResize = true;
        // Device status code emitted by Xterm.js
        // Check: https://github.com/xtermjs/xterm.js/blob/release/3.14/src/InputHandler.ts#L1055-L1082
        this.deviceStatusCodes = new Set(['\u001B[>0;276;0c', '\u001B[>85;95;0c', '\u001B[>83;40003;0c', '\u001B[?1;2c', '\u001B[?6c']);
        this.termOpened = false;
        this.initialData = '';
        this.resizeTerminal = debounce(() => this.doResizeTerminal(), 50);
    }
    get markdownRenderer() {
        this._markdownRenderer || (this._markdownRenderer = this.markdownRendererFactory());
        return this._markdownRenderer;
    }
    init() {
        this.setTitle(this.options.title || TerminalWidgetImpl_1.LABEL);
        if (this.options.iconClass) {
            this.title.iconClass = this.options.iconClass;
        }
        else {
            this.title.iconClass = (0, browser_1.codicon)('terminal');
        }
        if (this.options.kind) {
            this.terminalKind = this.options.kind;
        }
        if (this.options.destroyTermOnClose === true) {
            this.toDispose.push(core_1.Disposable.create(() => this.term.dispose()));
        }
        this.location = this.options.location || terminal_widget_1.TerminalLocation.Panel;
        this.title.closable = true;
        this.addClass('terminal-container');
        this.term = new xterm_1.Terminal({
            cursorBlink: this.preferences['terminal.integrated.cursorBlinking'],
            cursorStyle: this.getCursorStyle(),
            cursorWidth: this.preferences['terminal.integrated.cursorWidth'],
            fontFamily: this.preferences['terminal.integrated.fontFamily'],
            fontSize: this.preferences['terminal.integrated.fontSize'],
            fontWeight: this.preferences['terminal.integrated.fontWeight'],
            fontWeightBold: this.preferences['terminal.integrated.fontWeightBold'],
            drawBoldTextInBrightColors: this.preferences['terminal.integrated.drawBoldTextInBrightColors'],
            letterSpacing: this.preferences['terminal.integrated.letterSpacing'],
            lineHeight: this.preferences['terminal.integrated.lineHeight'],
            scrollback: this.preferences['terminal.integrated.scrollback'],
            fastScrollSensitivity: this.preferences['terminal.integrated.fastScrollSensitivity'],
            rendererType: this.getTerminalRendererType(this.preferences['terminal.integrated.rendererType']),
            theme: this.themeService.theme
        });
        this.fitAddon = new xterm_addon_fit_1.FitAddon();
        this.term.loadAddon(this.fitAddon);
        this.initializeLinkHover();
        this.toDispose.push(this.preferences.onPreferenceChanged(change => {
            const lastSeparator = change.preferenceName.lastIndexOf('.');
            if (lastSeparator > 0) {
                let preferenceName = change.preferenceName.substring(lastSeparator + 1);
                let preferenceValue = change.newValue;
                if (preferenceName === 'rendererType') {
                    const newRendererType = preferenceValue;
                    if (newRendererType !== this.getTerminalRendererType(newRendererType)) {
                        // Given terminal renderer type is not supported or invalid
                        preferenceValue = terminal_preferences_1.DEFAULT_TERMINAL_RENDERER_TYPE;
                    }
                }
                else if (preferenceName === 'cursorBlinking') {
                    // Convert the terminal preference into a valid `xterm` option
                    preferenceName = 'cursorBlink';
                }
                else if (preferenceName === 'cursorStyle') {
                    preferenceValue = this.getCursorStyle();
                }
                try {
                    this.term.setOption(preferenceName, preferenceValue);
                }
                catch (e) {
                    console.debug(`xterm configuration: '${preferenceName}' with value '${preferenceValue}' is not valid.`);
                }
                this.needsResize = true;
                this.update();
            }
        }));
        this.toDispose.push(this.themeService.onDidChange(() => this.term.setOption('theme', this.themeService.theme)));
        this.attachCustomKeyEventHandler();
        const titleChangeListenerDispose = this.term.onTitleChange((title) => {
            if (this.options.useServerTitle) {
                this.title.label = title;
            }
        });
        this.toDispose.push(titleChangeListenerDispose);
        this.toDispose.push(this.terminalWatcher.onTerminalError(({ terminalId, error, attached }) => {
            if (terminalId === this.terminalId) {
                this.exitStatus = { code: undefined, reason: base_terminal_protocol_1.TerminalExitReason.Process };
                this.logger.error(`The terminal process terminated. Cause: ${error}`);
                if (!attached) {
                    this.dispose();
                }
            }
        }));
        this.toDispose.push(this.terminalWatcher.onTerminalExit(({ terminalId, code, reason, attached }) => {
            if (terminalId === this.terminalId) {
                if (reason) {
                    this.exitStatus = { code, reason };
                }
                else {
                    this.exitStatus = { code, reason: base_terminal_protocol_1.TerminalExitReason.Process };
                }
                if (!attached) {
                    this.dispose();
                }
            }
        }));
        this.toDispose.push(this.toDisposeOnConnect);
        this.toDispose.push(this.shellTerminalServer.onDidCloseConnection(() => {
            const disposable = this.shellTerminalServer.onDidOpenConnection(() => {
                disposable.dispose();
                this.reconnectTerminalProcess();
            });
            this.toDispose.push(disposable);
        }));
        this.toDispose.push(this.onTermDidClose);
        this.toDispose.push(this.onDidOpenEmitter);
        this.toDispose.push(this.onDidOpenFailureEmitter);
        this.toDispose.push(this.onSizeChangedEmitter);
        this.toDispose.push(this.onDataEmitter);
        this.toDispose.push(this.onKeyEmitter);
        const touchEndListener = (event) => {
            if (this.node.contains(event.target)) {
                this.lastTouchEnd = event;
            }
        };
        document.addEventListener('touchend', touchEndListener, { passive: true });
        this.onDispose(() => {
            document.removeEventListener('touchend', touchEndListener);
        });
        const mouseListener = (event) => {
            this.lastMousePosition = { x: event.x, y: event.y };
        };
        this.node.addEventListener('mousemove', mouseListener);
        this.onDispose(() => {
            this.node.removeEventListener('mousemove', mouseListener);
        });
        const contextMenuListener = (event) => {
            event.preventDefault();
            event.stopPropagation();
            this.contextMenuRenderer.render({ menuPath: terminal_frontend_contribution_1.TerminalMenus.TERMINAL_CONTEXT_MENU, anchor: event });
        };
        this.node.addEventListener('contextmenu', contextMenuListener);
        this.onDispose(() => this.node.removeEventListener('contextmenu', contextMenuListener));
        this.toDispose.push(this.term.onSelectionChange(() => {
            if (this.copyOnSelection) {
                this.copyOnSelectionHandler.copy(this.term.getSelection());
            }
        }));
        this.toDispose.push(this.term.onResize(data => {
            this.onSizeChangedEmitter.fire(data);
        }));
        this.toDispose.push(this.term.onData(data => {
            this.onDataEmitter.fire(data);
        }));
        this.toDispose.push(this.term.onBinary(data => {
            this.onDataEmitter.fire(data);
        }));
        this.toDispose.push(this.term.onKey(data => {
            this.onKeyEmitter.fire(data);
        }));
        for (const contribution of this.terminalContributionProvider.getContributions()) {
            contribution.onCreate(this);
        }
        this.searchBox = this.terminalSearchBoxFactory(this.term);
        this.toDispose.push(this.searchBox);
    }
    get kind() {
        return this.terminalKind;
    }
    /**
     * Get the cursor style compatible with `xterm`.
     * @returns CursorStyle
     */
    getCursorStyle() {
        const value = this.preferences['terminal.integrated.cursorStyle'];
        return value === 'line' ? 'bar' : value;
    }
    /**
     * Returns given renderer type if it is valid and supported or default renderer otherwise.
     *
     * @param terminalRendererType desired terminal renderer type
     */
    getTerminalRendererType(terminalRendererType) {
        if (terminalRendererType && (0, terminal_preferences_1.isTerminalRendererType)(terminalRendererType)) {
            return terminalRendererType;
        }
        return terminal_preferences_1.DEFAULT_TERMINAL_RENDERER_TYPE;
    }
    initializeLinkHover() {
        this.linkHover = document.createElement('div');
        this.linkHover.style.position = 'fixed';
        this.linkHover.style.color = 'var(--theia-editorHoverWidget-foreground)';
        this.linkHover.style.backgroundColor = 'var(--theia-editorHoverWidget-background)';
        this.linkHover.style.borderColor = 'var(--theia-editorHoverWidget-border)';
        this.linkHover.style.borderWidth = '0.5px';
        this.linkHover.style.borderStyle = 'solid';
        this.linkHover.style.padding = '5px';
        // Above the xterm.js canvas layers:
        // https://github.com/xtermjs/xterm.js/blob/ff790236c1b205469f17a21246141f512d844295/src/renderer/Renderer.ts#L41-L46
        this.linkHover.style.zIndex = '10';
        // Initially invisible:
        this.linkHover.style.display = 'none';
        this.linkHoverButton = document.createElement('a');
        this.linkHoverButton.textContent = this.linkHoverMessage();
        this.linkHoverButton.style.cursor = 'pointer';
        this.linkHover.appendChild(this.linkHoverButton);
        const cmdCtrl = common_1.isOSX ? 'cmd' : 'ctrl';
        const cmdHint = document.createTextNode(` (${nls_1.nls.localizeByDefault(`${cmdCtrl} + click`)})`);
        this.linkHover.appendChild(cmdHint);
        const onMouseEnter = (mouseEvent) => this.onMouseEnterLinkHoverEmitter.fire(mouseEvent);
        this.linkHover.addEventListener('mouseenter', onMouseEnter);
        this.toDispose.push(core_1.Disposable.create(() => this.linkHover.removeEventListener('mouseenter', onMouseEnter)));
        const onMouseLeave = (mouseEvent) => this.onMouseLeaveLinkHoverEmitter.fire(mouseEvent);
        this.linkHover.addEventListener('mouseleave', onMouseLeave);
        this.toDispose.push(core_1.Disposable.create(() => this.linkHover.removeEventListener('mouseleave', onMouseLeave)));
        this.node.appendChild(this.linkHover);
    }
    showLinkHover(invokeAction, x, y, message) {
        var _a, _b, _c, _d;
        const mouseY = (_b = (_a = this.lastMousePosition) === null || _a === void 0 ? void 0 : _a.y) !== null && _b !== void 0 ? _b : y;
        const mouseX = (_d = (_c = this.lastMousePosition) === null || _c === void 0 ? void 0 : _c.x) !== null && _d !== void 0 ? _d : x;
        this.linkHoverButton.textContent = this.linkHoverMessage(message);
        this.linkHoverButton.onclick = (mouseEvent) => invokeAction(mouseEvent);
        this.linkHover.style.display = 'inline';
        this.linkHover.style.top = `${mouseY - 30}px`;
        this.linkHover.style.left = `${mouseX - 60}px`;
    }
    linkHoverMessage(message) {
        return message !== null && message !== void 0 ? message : nls_1.nls.localizeByDefault('Follow link');
    }
    hideLinkHover() {
        this.linkHover.style.display = 'none';
        // eslint-disable-next-line no-null/no-null
        this.linkHoverButton.onclick = null;
    }
    getTerminal() {
        return this.term;
    }
    getSearchBox() {
        return this.searchBox;
    }
    onCloseRequest(msg) {
        this.exitStatus = { code: undefined, reason: base_terminal_protocol_1.TerminalExitReason.User };
        super.onCloseRequest(msg);
    }
    get dimensions() {
        return {
            cols: this.term.cols,
            rows: this.term.rows,
        };
    }
    get cwd() {
        if (!base_terminal_protocol_1.IBaseTerminalServer.validateId(this.terminalId)) {
            return Promise.reject(new Error('terminal is not started'));
        }
        if (this.terminalService.getById(this.id)) {
            return this.shellTerminalServer.getCwdURI(this.terminalId)
                .then(cwdUrl => {
                this.lastCwd = new uri_1.default(cwdUrl);
                return this.lastCwd;
            }).catch(() => this.lastCwd);
        }
        return Promise.resolve(new uri_1.default());
    }
    get processId() {
        if (!base_terminal_protocol_1.IBaseTerminalServer.validateId(this.terminalId)) {
            return Promise.reject(new Error('terminal is not started'));
        }
        return this.shellTerminalServer.getProcessId(this.terminalId);
    }
    get processInfo() {
        if (!base_terminal_protocol_1.IBaseTerminalServer.validateId(this.terminalId)) {
            return Promise.reject(new Error('terminal is not started'));
        }
        return this.shellTerminalServer.getProcessInfo(this.terminalId);
    }
    get envVarCollectionDescriptionsByExtension() {
        if (!base_terminal_protocol_1.IBaseTerminalServer.validateId(this.terminalId)) {
            return Promise.reject(new Error('terminal is not started'));
        }
        return this.shellTerminalServer.getEnvVarCollectionDescriptionsByExtension(this.terminalId);
    }
    get terminalId() {
        return this._terminalId;
    }
    get lastTouchEndEvent() {
        return this.lastTouchEnd;
    }
    get hiddenFromUser() {
        var _a;
        if (this.shown) {
            return false;
        }
        return (_a = this.options.hideFromUser) !== null && _a !== void 0 ? _a : false;
    }
    get transient() {
        // The terminal is transient if session persistence is disabled or it's explicitly marked as transient
        return !this.preferences['terminal.integrated.enablePersistentSessions'] || !!this.options.isTransient;
    }
    onDispose(onDispose) {
        this.toDispose.push(core_1.Disposable.create(onDispose));
    }
    clearOutput() {
        this.term.clear();
    }
    selectAll() {
        this.term.selectAll();
    }
    async hasChildProcesses() {
        return this.shellTerminalServer.hasChildProcesses(await this.processId);
    }
    storeState() {
        this.closeOnDispose = false;
        if (this.transient || this.options.isPseudoTerminal) {
            return {};
        }
        return { terminalId: this.terminalId, titleLabel: this.title.label };
    }
    restoreState(oldState) {
        // transient terminals and pseudo terminals are not restored
        if (this.transient || this.options.isPseudoTerminal) {
            this.dispose();
            return;
        }
        if (this.restored === false) {
            const state = oldState;
            /* This is a workaround to issue #879 */
            this.restored = true;
            this.title.label = state.titleLabel;
            this.start(state.terminalId);
        }
    }
    /**
     * Create a new shell terminal in the back-end and attach it to a
     * new terminal widget.
     * If id is provided attach to the terminal for this id.
     */
    async start(id) {
        this._terminalId = typeof id !== 'number' ? await this.createTerminal() : await this.attachTerminal(id);
        this.resizeTerminalProcess();
        this.connectTerminalProcess();
        if (base_terminal_protocol_1.IBaseTerminalServer.validateId(this.terminalId)) {
            this.onDidOpenEmitter.fire(undefined);
            await this.shellTerminalServer.onAttachAttempted(this._terminalId);
            return this.terminalId;
        }
        this.onDidOpenFailureEmitter.fire(undefined);
        throw new Error('Failed to start terminal' + (id ? ` for id: ${id}.` : '.'));
    }
    async attachTerminal(id) {
        const terminalId = await this.shellTerminalServer.attach(id);
        if (base_terminal_protocol_1.IBaseTerminalServer.validateId(terminalId)) {
            // reset exit status if a new terminal process is attached
            this.exitStatus = undefined;
            return terminalId;
        }
        this.logger.warn(`Failed attaching to terminal id ${id}, the terminal is most likely gone. Starting up a new terminal instead.`);
        if (this.kind === 'user') {
            return this.createTerminal();
        }
        else {
            return -1;
        }
    }
    async createTerminal() {
        var _a, _b;
        let rootURI = (_a = this.options.cwd) === null || _a === void 0 ? void 0 : _a.toString();
        if (!rootURI) {
            const root = (await this.workspaceService.roots)[0];
            rootURI = (_b = root === null || root === void 0 ? void 0 : root.resource) === null || _b === void 0 ? void 0 : _b.toString();
        }
        const { cols, rows } = this.term;
        const terminalId = await this.shellTerminalServer.create({
            shell: this.options.shellPath || this.shellPreferences.shell[core_1.OS.backend.type()],
            args: this.options.shellArgs || this.shellPreferences.shellArgs[core_1.OS.backend.type()],
            env: this.options.env,
            strictEnv: this.options.strictEnv,
            isPseudo: this.options.isPseudoTerminal,
            rootURI,
            cols,
            rows
        });
        if (base_terminal_protocol_1.IBaseTerminalServer.validateId(terminalId)) {
            return terminalId;
        }
        throw new Error('Error creating terminal widget, see the backend error log for more information.');
    }
    processMessage(msg) {
        super.processMessage(msg);
        switch (msg.type) {
            case 'fit-request':
                this.onFitRequest(msg);
                break;
            default:
                break;
        }
    }
    onFitRequest(msg) {
        super.onFitRequest(msg);
        browser_1.MessageLoop.sendMessage(this, browser_1.Widget.ResizeMessage.UnknownSize);
    }
    onActivateRequest(msg) {
        super.onActivateRequest(msg);
        this.term.focus();
    }
    onAfterShow(msg) {
        super.onAfterShow(msg);
        this.update();
        this.shown = true;
    }
    onAfterAttach(msg) {
        browser_1.Widget.attach(this.searchBox, this.node);
        super.onAfterAttach(msg);
        this.update();
    }
    onBeforeDetach(msg) {
        browser_1.Widget.detach(this.searchBox);
        super.onBeforeDetach(msg);
    }
    onResize(msg) {
        super.onResize(msg);
        this.needsResize = true;
        this.update();
    }
    onUpdateRequest(msg) {
        super.onUpdateRequest(msg);
        if (!this.isVisible || !this.isAttached) {
            return;
        }
        this.open();
        if (this.needsResize) {
            this.resizeTerminal();
            this.needsResize = false;
            this.resizeTerminalProcess();
        }
    }
    connectTerminalProcess() {
        if (typeof this.terminalId !== 'number') {
            return;
        }
        if (this.options.isPseudoTerminal) {
            return;
        }
        this.toDisposeOnConnect.dispose();
        this.toDispose.push(this.toDisposeOnConnect);
        const waitForConnection = this.waitForConnection = new promise_util_1.Deferred();
        this.webSocketConnectionProvider.listen({
            path: `${terminal_protocol_1.terminalsPath}/${this.terminalId}`,
            onConnection: connection => {
                connection.onMessage(e => {
                    this.write(e().readString());
                });
                // Excludes the device status code emitted by Xterm.js
                const sendData = (data) => {
                    if (data && !this.deviceStatusCodes.has(data) && !this.disableEnterWhenAttachCloseListener()) {
                        connection.getWriteBuffer().writeString(data).commit();
                    }
                };
                const disposable = new core_1.DisposableCollection();
                disposable.push(this.term.onData(sendData));
                disposable.push(this.term.onBinary(sendData));
                connection.onClose(() => disposable.dispose());
                if (waitForConnection) {
                    waitForConnection.resolve(connection);
                }
            }
        }, { reconnecting: false });
    }
    async reconnectTerminalProcess() {
        if (this.options.isPseudoTerminal) {
            return;
        }
        if (typeof this.terminalId === 'number') {
            await this.start(this.terminalId);
        }
    }
    open() {
        if (this.termOpened) {
            return;
        }
        this.term.open(this.node);
        if (browser_1.isFirefox) {
            // monkey patching intersection observer handling for secondary window support
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const renderService = this.term._core._renderService;
            const originalFunc = renderService._onIntersectionChange.bind(renderService);
            const replacement = function (entry) {
                if (entry.target.ownerDocument !== document) {
                    // in Firefox, the intersection observer always reports the widget as non-intersecting if the dom element
                    // is in a different document from when the IntersectionObserver started observing. Since we know
                    // that the widget is always "visible" when in a secondary window, so we mark the entry as "intersecting"
                    const patchedEvent = {
                        ...entry,
                        isIntersecting: true,
                    };
                    originalFunc(patchedEvent);
                }
                else {
                    originalFunc(entry);
                }
            };
            renderService._onIntersectionChange = replacement;
        }
        if (this.initialData) {
            this.term.write(this.initialData);
        }
        this.termOpened = true;
        this.initialData = '';
        if (browser_1.isFirefox) {
            // The software scrollbars don't work with xterm.js, so we disable the scrollbar if we are on firefox.
            if (this.term.element) {
                this.term.element.children.item(0).style.overflow = 'hidden';
            }
        }
    }
    write(data) {
        if (this.termOpened) {
            this.term.write(data);
        }
        else {
            this.initialData += data;
        }
    }
    resize(cols, rows) {
        this.term.resize(cols, rows);
    }
    sendText(text) {
        if (this.waitForConnection) {
            this.waitForConnection.promise.then(connection => connection.getWriteBuffer().writeString(text).commit());
        }
    }
    async executeCommand(commandOptions) {
        this.sendText(this.shellCommandBuilder.buildCommand(await this.processInfo, commandOptions) + core_1.OS.backend.EOL);
    }
    scrollLineUp() {
        this.term.scrollLines(-1);
    }
    scrollLineDown() {
        this.term.scrollLines(1);
    }
    scrollToTop() {
        this.term.scrollToTop();
    }
    scrollToBottom() {
        this.term.scrollToBottom();
    }
    scrollPageUp() {
        this.term.scrollPages(-1);
    }
    scrollPageDown() {
        this.term.scrollPages(1);
    }
    resetTerminal() {
        this.term.reset();
    }
    writeLine(text) {
        this.term.writeln(text);
    }
    get onTerminalDidClose() {
        return this.onTermDidClose.event;
    }
    dispose() {
        if (this.closeOnDispose === true && typeof this.terminalId === 'number' && !this.exitStatus) {
            // Close the backend terminal only when explicitly closing the terminal
            // a refresh for example won't close it.
            this.shellTerminalServer.close(this.terminalId);
            // Exit status is set when terminal is closed by user or by process, so most likely an extension closed it.
            this.exitStatus = { code: undefined, reason: base_terminal_protocol_1.TerminalExitReason.Extension };
        }
        if (this.exitStatus) {
            this.onTermDidClose.fire(this);
        }
        if (this.enhancedPreviewNode) {
            // don't use preview node anymore. rendered markdown will be disposed on super call
            this.enhancedPreviewNode = undefined;
        }
        super.dispose();
    }
    doResizeTerminal() {
        if (this.isDisposed) {
            return;
        }
        const geo = this.fitAddon.proposeDimensions();
        const cols = geo.cols;
        const rows = geo.rows - 1; // subtract one row for margin
        this.term.resize(cols, rows);
    }
    resizeTerminalProcess() {
        if (this.options.isPseudoTerminal) {
            return;
        }
        if (!base_terminal_protocol_1.IBaseTerminalServer.validateId(this.terminalId)
            || this.exitStatus
            || !this.terminalService.getById(this.id)) {
            return;
        }
        const { cols, rows } = this.term;
        this.shellTerminalServer.resize(this.terminalId, cols, rows);
    }
    get enableCopy() {
        return this.preferences['terminal.enableCopy'];
    }
    get enablePaste() {
        return this.preferences['terminal.enablePaste'];
    }
    get shellPreferences() {
        var _a, _b, _c;
        return {
            shell: {
                Windows: (_a = this.preferences['terminal.integrated.shell.windows']) !== null && _a !== void 0 ? _a : undefined,
                Linux: (_b = this.preferences['terminal.integrated.shell.linux']) !== null && _b !== void 0 ? _b : undefined,
                OSX: (_c = this.preferences['terminal.integrated.shell.osx']) !== null && _c !== void 0 ? _c : undefined,
            },
            shellArgs: {
                Windows: this.preferences['terminal.integrated.shellArgs.windows'],
                Linux: this.preferences['terminal.integrated.shellArgs.linux'],
                OSX: this.preferences['terminal.integrated.shellArgs.osx'],
            }
        };
    }
    customKeyHandler(event) {
        const keyBindings = browser_1.KeyCode.createKeyCode(event).toString();
        const ctrlCmdCopy = (common_1.isOSX && keyBindings === 'meta+c') || (!common_1.isOSX && keyBindings === 'ctrl+c');
        const ctrlCmdPaste = (common_1.isOSX && keyBindings === 'meta+v') || (!common_1.isOSX && keyBindings === 'ctrl+v');
        if (ctrlCmdCopy && this.enableCopy && this.term.hasSelection()) {
            return false;
        }
        if (ctrlCmdPaste && this.enablePaste) {
            return false;
        }
        return true;
    }
    get copyOnSelection() {
        return this.preferences['terminal.integrated.copyOnSelection'];
    }
    attachCustomKeyEventHandler() {
        this.term.attachCustomKeyEventHandler(e => this.customKeyHandler(e));
    }
    setTitle(title) {
        this.title.caption = title;
        this.title.label = title;
    }
    waitOnExit(waitOnExit) {
        if (waitOnExit) {
            if (typeof waitOnExit === 'string') {
                let message = waitOnExit;
                // Bold the message and add an extra new line to make it stand out from the rest of the output
                message = `\r\n\x1b[1m${message}\x1b[0m`;
                this.write(message);
            }
            this.attachPressEnterKeyToCloseListener(this.term);
            return;
        }
        this.dispose();
    }
    attachPressEnterKeyToCloseListener(term) {
        if (term.textarea) {
            this.isAttachedCloseListener = true;
            this.addKeyListener(term.textarea, keys_1.Key.ENTER, (event) => {
                this.dispose();
                this.isAttachedCloseListener = false;
            });
        }
    }
    disableEnterWhenAttachCloseListener() {
        return this.isAttachedCloseListener;
    }
    getEnhancedPreviewNode() {
        if (this.enhancedPreviewNode) {
            return this.enhancedPreviewNode;
        }
        this.enhancedPreviewNode = document.createElement('div');
        Promise.all([this.envVarCollectionDescriptionsByExtension, this.processId, this.processInfo])
            .then((values) => {
            const extensions = values[0];
            const processId = values[1];
            const processInfo = values[2];
            const markdown = new markdown_string_1.MarkdownStringImpl();
            markdown.appendMarkdown('Process ID: ' + processId + '\\\n');
            markdown.appendMarkdown('Command line: ' +
                processInfo.executable +
                ' ' +
                processInfo.arguments.join(' ') +
                '\n\n---\n\n');
            markdown.appendMarkdown('The following extensions have contributed to this terminal\'s environment:\n');
            extensions.forEach((value, key) => {
                if (value === undefined) {
                    markdown.appendMarkdown('* ' + key + '\n');
                }
                else if (typeof value === 'string') {
                    markdown.appendMarkdown('* ' + key + ': ' + value + '\n');
                }
                else {
                    markdown.appendMarkdown('* ' + key + ': ' + value.value + '\n');
                }
            });
            const enhancedPreviewNode = this.enhancedPreviewNode;
            if (!this.isDisposed && enhancedPreviewNode) {
                const result = this.markdownRenderer.render(markdown);
                this.toDispose.push(result);
                enhancedPreviewNode.appendChild(result.element);
            }
        });
        return this.enhancedPreviewNode;
    }
};
TerminalWidgetImpl.LABEL = nls_1.nls.localizeByDefault('Terminal');
__decorate([
    (0, inversify_1.inject)(browser_2.WorkspaceService),
    __metadata("design:type", browser_2.WorkspaceService)
], TerminalWidgetImpl.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.WebSocketConnectionProvider),
    __metadata("design:type", browser_1.WebSocketConnectionProvider)
], TerminalWidgetImpl.prototype, "webSocketConnectionProvider", void 0);
__decorate([
    (0, inversify_1.inject)(terminal_widget_1.TerminalWidgetOptions),
    __metadata("design:type", Object)
], TerminalWidgetImpl.prototype, "options", void 0);
__decorate([
    (0, inversify_1.inject)(shell_terminal_protocol_1.ShellTerminalServerProxy),
    __metadata("design:type", Object)
], TerminalWidgetImpl.prototype, "shellTerminalServer", void 0);
__decorate([
    (0, inversify_1.inject)(terminal_watcher_1.TerminalWatcher),
    __metadata("design:type", terminal_watcher_1.TerminalWatcher)
], TerminalWidgetImpl.prototype, "terminalWatcher", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.ILogger),
    (0, inversify_1.named)('terminal'),
    __metadata("design:type", Object)
], TerminalWidgetImpl.prototype, "logger", void 0);
__decorate([
    (0, inversify_1.inject)('terminal-dom-id'),
    __metadata("design:type", String)
], TerminalWidgetImpl.prototype, "id", void 0);
__decorate([
    (0, inversify_1.inject)(terminal_preferences_1.TerminalPreferences),
    __metadata("design:type", Object)
], TerminalWidgetImpl.prototype, "preferences", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.ContributionProvider),
    (0, inversify_1.named)(exports.TerminalContribution),
    __metadata("design:type", Object)
], TerminalWidgetImpl.prototype, "terminalContributionProvider", void 0);
__decorate([
    (0, inversify_1.inject)(terminal_service_1.TerminalService),
    __metadata("design:type", Object)
], TerminalWidgetImpl.prototype, "terminalService", void 0);
__decorate([
    (0, inversify_1.inject)(terminal_search_widget_1.TerminalSearchWidgetFactory),
    __metadata("design:type", Function)
], TerminalWidgetImpl.prototype, "terminalSearchBoxFactory", void 0);
__decorate([
    (0, inversify_1.inject)(terminal_copy_on_selection_handler_1.TerminalCopyOnSelectionHandler),
    __metadata("design:type", terminal_copy_on_selection_handler_1.TerminalCopyOnSelectionHandler)
], TerminalWidgetImpl.prototype, "copyOnSelectionHandler", void 0);
__decorate([
    (0, inversify_1.inject)(terminal_theme_service_1.TerminalThemeService),
    __metadata("design:type", terminal_theme_service_1.TerminalThemeService)
], TerminalWidgetImpl.prototype, "themeService", void 0);
__decorate([
    (0, inversify_1.inject)(shell_command_builder_1.ShellCommandBuilder),
    __metadata("design:type", shell_command_builder_1.ShellCommandBuilder)
], TerminalWidgetImpl.prototype, "shellCommandBuilder", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.ContextMenuRenderer),
    __metadata("design:type", browser_1.ContextMenuRenderer)
], TerminalWidgetImpl.prototype, "contextMenuRenderer", void 0);
__decorate([
    (0, inversify_1.inject)(markdown_renderer_1.MarkdownRendererFactory),
    __metadata("design:type", Function)
], TerminalWidgetImpl.prototype, "markdownRendererFactory", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TerminalWidgetImpl.prototype, "init", null);
TerminalWidgetImpl = TerminalWidgetImpl_1 = __decorate([
    (0, inversify_1.injectable)()
], TerminalWidgetImpl);
exports.TerminalWidgetImpl = TerminalWidgetImpl;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/terminal/lib/browser/terminal-widget-impl'] = this;


/***/ }),

/***/ "../../packages/terminal/lib/common/base-terminal-protocol.js":
/*!********************************************************************!*\
  !*** ../../packages/terminal/lib/common/base-terminal-protocol.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2017 Ericsson and others.
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
exports.EnvironmentVariableMutatorType = exports.ENVIRONMENT_VARIABLE_COLLECTIONS_KEY = exports.DispatchingBaseTerminalClient = exports.TerminalExitReason = exports.IBaseTerminalServer = void 0;
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
var IBaseTerminalServer;
(function (IBaseTerminalServer) {
    function validateId(id) {
        return typeof id === 'number' && id !== -1;
    }
    IBaseTerminalServer.validateId = validateId;
})(IBaseTerminalServer = exports.IBaseTerminalServer || (exports.IBaseTerminalServer = {}));
var TerminalExitReason;
(function (TerminalExitReason) {
    TerminalExitReason[TerminalExitReason["Unknown"] = 0] = "Unknown";
    TerminalExitReason[TerminalExitReason["Shutdown"] = 1] = "Shutdown";
    TerminalExitReason[TerminalExitReason["Process"] = 2] = "Process";
    TerminalExitReason[TerminalExitReason["User"] = 3] = "User";
    TerminalExitReason[TerminalExitReason["Extension"] = 4] = "Extension";
})(TerminalExitReason = exports.TerminalExitReason || (exports.TerminalExitReason = {}));
class DispatchingBaseTerminalClient {
    constructor() {
        this.clients = new Set();
    }
    push(client) {
        this.clients.add(client);
        return core_1.Disposable.create(() => this.clients.delete(client));
    }
    onTerminalExitChanged(event) {
        this.clients.forEach(c => {
            try {
                c.onTerminalExitChanged(event);
            }
            catch (e) {
                console.error(e);
            }
        });
    }
    onTerminalError(event) {
        this.clients.forEach(c => {
            try {
                c.onTerminalError(event);
            }
            catch (e) {
                console.error(e);
            }
        });
    }
    updateTerminalEnvVariables() {
        this.clients.forEach(c => {
            try {
                c.updateTerminalEnvVariables();
            }
            catch (e) {
                console.error(e);
            }
        });
    }
    storeTerminalEnvVariables(data) {
        this.clients.forEach(c => {
            try {
                c.storeTerminalEnvVariables(data);
            }
            catch (e) {
                console.error(e);
            }
        });
    }
}
exports.DispatchingBaseTerminalClient = DispatchingBaseTerminalClient;
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// some code copied and modified from https://github.com/microsoft/vscode/blob/1.49.0/src/vs/workbench/contrib/terminal/common/environmentVariable.ts
exports.ENVIRONMENT_VARIABLE_COLLECTIONS_KEY = 'terminal.integrated.environmentVariableCollections';
var EnvironmentVariableMutatorType;
(function (EnvironmentVariableMutatorType) {
    EnvironmentVariableMutatorType[EnvironmentVariableMutatorType["Replace"] = 1] = "Replace";
    EnvironmentVariableMutatorType[EnvironmentVariableMutatorType["Append"] = 2] = "Append";
    EnvironmentVariableMutatorType[EnvironmentVariableMutatorType["Prepend"] = 3] = "Prepend";
})(EnvironmentVariableMutatorType = exports.EnvironmentVariableMutatorType || (exports.EnvironmentVariableMutatorType = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/terminal/lib/common/base-terminal-protocol'] = this;


/***/ }),

/***/ "../../packages/terminal/lib/common/terminal-protocol.js":
/*!***************************************************************!*\
  !*** ../../packages/terminal/lib/common/terminal-protocol.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, exports) {


// *****************************************************************************
// Copyright (C) 2017 Ericsson and others.
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
exports.terminalsPath = exports.terminalPath = exports.ITerminalServer = void 0;
exports.ITerminalServer = Symbol('ITerminalServer');
exports.terminalPath = '/services/terminal';
exports.terminalsPath = '/services/terminals';

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/terminal/lib/common/terminal-protocol'] = this;


/***/ }),

/***/ "../../packages/terminal/lib/common/terminal-watcher.js":
/*!**************************************************************!*\
  !*** ../../packages/terminal/lib/common/terminal-watcher.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2017 Ericsson and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TerminalWatcher = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const event_1 = __webpack_require__(/*! @theia/core/lib/common/event */ "../../packages/core/lib/common/event.js");
let TerminalWatcher = class TerminalWatcher {
    constructor() {
        this.onTerminalExitEmitter = new event_1.Emitter();
        this.onTerminalErrorEmitter = new event_1.Emitter();
        this.onStoreTerminalEnvVariablesRequestedEmitter = new event_1.Emitter();
        this.onUpdateTerminalEnvVariablesRequestedEmitter = new event_1.Emitter();
    }
    getTerminalClient() {
        const exitEmitter = this.onTerminalExitEmitter;
        const errorEmitter = this.onTerminalErrorEmitter;
        const storeTerminalEnvVariablesEmitter = this.onStoreTerminalEnvVariablesRequestedEmitter;
        const updateTerminalEnvVariablesEmitter = this.onUpdateTerminalEnvVariablesRequestedEmitter;
        return {
            storeTerminalEnvVariables(data) {
                storeTerminalEnvVariablesEmitter.fire(data);
            },
            updateTerminalEnvVariables() {
                updateTerminalEnvVariablesEmitter.fire(undefined);
            },
            onTerminalExitChanged(event) {
                exitEmitter.fire(event);
            },
            onTerminalError(event) {
                errorEmitter.fire(event);
            }
        };
    }
    get onTerminalExit() {
        return this.onTerminalExitEmitter.event;
    }
    get onTerminalError() {
        return this.onTerminalErrorEmitter.event;
    }
    get onStoreTerminalEnvVariablesRequested() {
        return this.onStoreTerminalEnvVariablesRequestedEmitter.event;
    }
    get onUpdateTerminalEnvVariablesRequested() {
        return this.onUpdateTerminalEnvVariablesRequestedEmitter.event;
    }
};
TerminalWatcher = __decorate([
    (0, inversify_1.injectable)()
], TerminalWatcher);
exports.TerminalWatcher = TerminalWatcher;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/terminal/lib/common/terminal-watcher'] = this;


/***/ }),

/***/ "../../node_modules/css-loader/dist/cjs.js!../../packages/terminal/src/browser/style/terminal-search.css":
/*!***************************************************************************************************************!*\
  !*** ../../node_modules/css-loader/dist/cjs.js!../../packages/terminal/src/browser/style/terminal-search.css ***!
  \***************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "../../node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/api.js */ "../../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/********************************************************************************
 * Copyright (C) 2019 Red Hat, Inc. and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0
 ********************************************************************************/

.theia-search-terminal-widget-parent {
  background: var(--theia-sideBar-background);
  position: absolute;
  margin: 0px;
  border: var(--theia-border-width) solid transparent;
  padding: 0px;
  top: 1px;
  right: 19px;

  z-index: 10;
}

.theia-search-terminal-widget-parent .theia-search-elem-box {
  display: flex;
  margin: 0px;
  border: var(--theia-border-width) solid transparent;
  padding: 0px;
  align-items: center;
  color: var(--theia-input-foreground);
  background: var(--theia-input-background);
}

.theia-search-terminal-widget-parent .theia-search-elem-box input {
  margin-left: 5px;
  padding: 0px;
  width: 100px;
  height: 18px;
  color: inherit;
  background-color: inherit;
  border: var(--theia-border-width) solid transparent;
  outline: none;
}

.theia-search-terminal-widget-parent
  .theia-search-elem-box
  .search-elem.codicon {
  height: 16px;
  width: 18px;
}

.theia-search-terminal-widget-parent .search-elem.codicon {
  border: var(--theia-border-width) solid transparent;
  height: 20px;
  width: 20px;
  opacity: 0.7;
  outline: none;
  color: var(--theia-input-foreground);
  padding: 0px;
  margin-left: 3px;
}

.theia-search-terminal-widget-parent .search-elem:hover {
  opacity: 1;
}

.theia-search-terminal-widget-parent .theia-search-elem-box.focused {
  border: var(--theia-border-width) solid var(--theia-focusBorder);
}

.theia-search-terminal-widget-parent
  .theia-search-elem-box
  .search-elem.option-enabled {
  border: var(--theia-border-width) solid var(--theia-inputOption-activeBorder);
  background-color: var(--theia-inputOption-activeBackground);
}

.theia-search-terminal-widget-parent .theia-search-terminal-widget {
  margin: 2px;
  display: flex;
  align-items: center;
  font: var(--theia-content-font-size);
  color: var(--theia-input-foreground);
}

.theia-search-terminal-widget-parent .theia-search-terminal-widget button {
  background-color: transparent;
}

.theia-search-terminal-widget-parent
  .theia-search-terminal-widget
  button:focus {
  border: var(--theia-border-width) var(--theia-focusBorder) solid;
}
`, "",{"version":3,"sources":["webpack://./../../packages/terminal/src/browser/style/terminal-search.css"],"names":[],"mappings":"AAAA;;;;;;;;;;;;;;iFAciF;;AAEjF;EACE,2CAA2C;EAC3C,kBAAkB;EAClB,WAAW;EACX,mDAAmD;EACnD,YAAY;EACZ,QAAQ;EACR,WAAW;;EAEX,WAAW;AACb;;AAEA;EACE,aAAa;EACb,WAAW;EACX,mDAAmD;EACnD,YAAY;EACZ,mBAAmB;EACnB,oCAAoC;EACpC,yCAAyC;AAC3C;;AAEA;EACE,gBAAgB;EAChB,YAAY;EACZ,YAAY;EACZ,YAAY;EACZ,cAAc;EACd,yBAAyB;EACzB,mDAAmD;EACnD,aAAa;AACf;;AAEA;;;EAGE,YAAY;EACZ,WAAW;AACb;;AAEA;EACE,mDAAmD;EACnD,YAAY;EACZ,WAAW;EACX,YAAY;EACZ,aAAa;EACb,oCAAoC;EACpC,YAAY;EACZ,gBAAgB;AAClB;;AAEA;EACE,UAAU;AACZ;;AAEA;EACE,gEAAgE;AAClE;;AAEA;;;EAGE,6EAA6E;EAC7E,2DAA2D;AAC7D;;AAEA;EACE,WAAW;EACX,aAAa;EACb,mBAAmB;EACnB,oCAAoC;EACpC,oCAAoC;AACtC;;AAEA;EACE,6BAA6B;AAC/B;;AAEA;;;EAGE,gEAAgE;AAClE","sourcesContent":["/********************************************************************************\n * Copyright (C) 2019 Red Hat, Inc. and others.\n *\n * This program and the accompanying materials are made available under the\n * terms of the Eclipse Public License v. 2.0 which is available at\n * http://www.eclipse.org/legal/epl-2.0.\n *\n * This Source Code may also be made available under the following Secondary\n * Licenses when the conditions for such availability set forth in the Eclipse\n * Public License v. 2.0 are satisfied: GNU General Public License, version 2\n * with the GNU Classpath Exception which is available at\n * https://www.gnu.org/software/classpath/license.html.\n *\n * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0\n ********************************************************************************/\n\n.theia-search-terminal-widget-parent {\n  background: var(--theia-sideBar-background);\n  position: absolute;\n  margin: 0px;\n  border: var(--theia-border-width) solid transparent;\n  padding: 0px;\n  top: 1px;\n  right: 19px;\n\n  z-index: 10;\n}\n\n.theia-search-terminal-widget-parent .theia-search-elem-box {\n  display: flex;\n  margin: 0px;\n  border: var(--theia-border-width) solid transparent;\n  padding: 0px;\n  align-items: center;\n  color: var(--theia-input-foreground);\n  background: var(--theia-input-background);\n}\n\n.theia-search-terminal-widget-parent .theia-search-elem-box input {\n  margin-left: 5px;\n  padding: 0px;\n  width: 100px;\n  height: 18px;\n  color: inherit;\n  background-color: inherit;\n  border: var(--theia-border-width) solid transparent;\n  outline: none;\n}\n\n.theia-search-terminal-widget-parent\n  .theia-search-elem-box\n  .search-elem.codicon {\n  height: 16px;\n  width: 18px;\n}\n\n.theia-search-terminal-widget-parent .search-elem.codicon {\n  border: var(--theia-border-width) solid transparent;\n  height: 20px;\n  width: 20px;\n  opacity: 0.7;\n  outline: none;\n  color: var(--theia-input-foreground);\n  padding: 0px;\n  margin-left: 3px;\n}\n\n.theia-search-terminal-widget-parent .search-elem:hover {\n  opacity: 1;\n}\n\n.theia-search-terminal-widget-parent .theia-search-elem-box.focused {\n  border: var(--theia-border-width) solid var(--theia-focusBorder);\n}\n\n.theia-search-terminal-widget-parent\n  .theia-search-elem-box\n  .search-elem.option-enabled {\n  border: var(--theia-border-width) solid var(--theia-inputOption-activeBorder);\n  background-color: var(--theia-inputOption-activeBackground);\n}\n\n.theia-search-terminal-widget-parent .theia-search-terminal-widget {\n  margin: 2px;\n  display: flex;\n  align-items: center;\n  font: var(--theia-content-font-size);\n  color: var(--theia-input-foreground);\n}\n\n.theia-search-terminal-widget-parent .theia-search-terminal-widget button {\n  background-color: transparent;\n}\n\n.theia-search-terminal-widget-parent\n  .theia-search-terminal-widget\n  button:focus {\n  border: var(--theia-border-width) var(--theia-focusBorder) solid;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../packages/terminal/src/browser/style/terminal-search.css":
/*!*********************************************************************!*\
  !*** ../../packages/terminal/src/browser/style/terminal-search.css ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_terminal_search_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/css-loader/dist/cjs.js!./terminal-search.css */ "../../node_modules/css-loader/dist/cjs.js!../../packages/terminal/src/browser/style/terminal-search.css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_terminal_search_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_terminal_search_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ })

}]);
//# sourceMappingURL=packages_terminal_lib_browser_terminal-frontend-contribution_js-packages_terminal_lib_browser-f1b969.js.map