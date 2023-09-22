"use strict";
(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_core_lib_common_markdown-rendering_markdown-string_js-packages_terminal_lib_browser_-799165"],{

/***/ "../../packages/core/lib/common/markdown-rendering/icon-utilities.js":
/*!***************************************************************************!*\
  !*** ../../packages/core/lib/common/markdown-rendering/icon-utilities.js ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, exports) {


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
exports.escapeIcons = exports.CSSIcon = void 0;
// Copied from https://github.com/microsoft/vscode/blob/7d9b1c37f8e5ae3772782ba3b09d827eb3fdd833/src/vs/base/common/codicons.ts
var CSSIcon;
(function (CSSIcon) {
    CSSIcon.iconNameSegment = '[A-Za-z0-9]+';
    CSSIcon.iconNameExpression = '[A-Za-z0-9-]+';
    CSSIcon.iconModifierExpression = '~[A-Za-z]+';
    CSSIcon.iconNameCharacter = '[A-Za-z0-9~-]';
})(CSSIcon = exports.CSSIcon || (exports.CSSIcon = {}));
const iconsRegex = new RegExp(`\\$\\(${CSSIcon.iconNameExpression}(?:${CSSIcon.iconModifierExpression})?\\)`, 'g'); // no capturing groups
const escapeIconsRegex = new RegExp(`(\\\\)?${iconsRegex.source}`, 'g');
function escapeIcons(text) {
    return text.replace(escapeIconsRegex, (match, escaped) => escaped ? match : `\\${match}`);
}
exports.escapeIcons = escapeIcons;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/lib/common/markdown-rendering/icon-utilities'] = this;


/***/ }),

/***/ "../../packages/core/lib/common/markdown-rendering/markdown-string.js":
/*!****************************************************************************!*\
  !*** ../../packages/core/lib/common/markdown-rendering/markdown-string.js ***!
  \****************************************************************************/
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
exports.escapeMarkdownSyntaxTokens = exports.MarkdownStringImpl = exports.MarkdownString = exports.MarkdownStringTextNewlineStyle = void 0;
const strings_1 = __webpack_require__(/*! ../strings */ "../../packages/core/lib/common/strings.js");
const icon_utilities_1 = __webpack_require__(/*! ./icon-utilities */ "../../packages/core/lib/common/markdown-rendering/icon-utilities.js");
const types_1 = __webpack_require__(/*! ../types */ "../../packages/core/lib/common/types.js");
var MarkdownStringTextNewlineStyle;
(function (MarkdownStringTextNewlineStyle) {
    MarkdownStringTextNewlineStyle[MarkdownStringTextNewlineStyle["Paragraph"] = 0] = "Paragraph";
    MarkdownStringTextNewlineStyle[MarkdownStringTextNewlineStyle["Break"] = 1] = "Break";
})(MarkdownStringTextNewlineStyle = exports.MarkdownStringTextNewlineStyle || (exports.MarkdownStringTextNewlineStyle = {}));
var MarkdownString;
(function (MarkdownString) {
    /**
     * @returns whether the candidate satisfies the interface of a markdown string
     */
    function is(candidate) {
        return (0, types_1.isObject)(candidate) && (0, types_1.isString)(candidate.value);
    }
    MarkdownString.is = is;
})(MarkdownString = exports.MarkdownString || (exports.MarkdownString = {}));
// Copied from https://github.com/microsoft/vscode/blob/7d9b1c37f8e5ae3772782ba3b09d827eb3fdd833/src/vs/base/common/htmlContent.ts
class MarkdownStringImpl {
    constructor(value = '', isTrustedOrOptions = false) {
        var _a, _b, _c;
        this.value = value;
        if (typeof this.value !== 'string') {
            throw new Error('Illegal value for MarkdownString. Expected string, got ' + typeof this.value);
        }
        if (typeof isTrustedOrOptions === 'boolean') {
            this.isTrusted = isTrustedOrOptions;
            this.supportThemeIcons = false;
            this.supportHtml = false;
        }
        else {
            this.isTrusted = (_a = isTrustedOrOptions.isTrusted) !== null && _a !== void 0 ? _a : undefined;
            this.supportThemeIcons = (_b = isTrustedOrOptions.supportThemeIcons) !== null && _b !== void 0 ? _b : false;
            this.supportHtml = (_c = isTrustedOrOptions.supportHtml) !== null && _c !== void 0 ? _c : false;
        }
    }
    appendText(value, newlineStyle = MarkdownStringTextNewlineStyle.Paragraph) {
        this.value += escapeMarkdownSyntaxTokens(this.supportThemeIcons ? (0, icon_utilities_1.escapeIcons)(value) : value)
            .replace(/([ \t]+)/g, (_match, g1) => '&nbsp;'.repeat(g1.length))
            .replace(/\>/gm, '\\>')
            .replace(/\n/g, newlineStyle === MarkdownStringTextNewlineStyle.Break ? '\\\n' : '\n\n');
        return this;
    }
    appendMarkdown(value) {
        this.value += value;
        return this;
    }
    appendCodeblock(langId, code) {
        this.value += '\n```';
        this.value += langId;
        this.value += '\n';
        this.value += code;
        this.value += '\n```\n';
        return this;
    }
    appendLink(target, label, title) {
        this.value += '[';
        this.value += this._escape(label, ']');
        this.value += '](';
        this.value += this._escape(String(target), ')');
        if (title) {
            this.value += ` "${this._escape(this._escape(title, '"'), ')')}"`;
        }
        this.value += ')';
        return this;
    }
    _escape(value, ch) {
        const r = new RegExp((0, strings_1.escapeRegExpCharacters)(ch), 'g');
        return value.replace(r, (match, offset) => {
            if (value.charAt(offset - 1) !== '\\') {
                return `\\${match}`;
            }
            else {
                return match;
            }
        });
    }
}
exports.MarkdownStringImpl = MarkdownStringImpl;
function escapeMarkdownSyntaxTokens(text) {
    // escape markdown syntax tokens: http://daringfireball.net/projects/markdown/syntax#backslash
    return text.replace(/[\\`*_{}[\]()#+\-!]/g, '\\$&');
}
exports.escapeMarkdownSyntaxTokens = escapeMarkdownSyntaxTokens;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/lib/common/markdown-rendering/markdown-string'] = this;


/***/ }),

/***/ "../../packages/terminal/lib/browser/base/terminal-service.js":
/*!********************************************************************!*\
  !*** ../../packages/terminal/lib/browser/base/terminal-service.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TerminalService = void 0;
/**
 * Service manipulating terminal widgets.
 */
exports.TerminalService = Symbol('TerminalService');

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/terminal/lib/browser/base/terminal-service'] = this;


/***/ }),

/***/ "../../packages/terminal/lib/browser/search/terminal-search-container.js":
/*!*******************************************************************************!*\
  !*** ../../packages/terminal/lib/browser/search/terminal-search-container.js ***!
  \*******************************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createTerminalSearchFactory = void 0;
const terminal_search_widget_1 = __webpack_require__(/*! ./terminal-search-widget */ "../../packages/terminal/lib/browser/search/terminal-search-widget.js");
const xterm_1 = __webpack_require__(/*! xterm */ "../../node_modules/xterm/lib/xterm.js");
function createTerminalSearchFactory(container) {
    container.bind(terminal_search_widget_1.TerminalSearchWidget).toSelf().inSingletonScope();
    return (terminal) => {
        container.bind(xterm_1.Terminal).toConstantValue(terminal);
        return container.get(terminal_search_widget_1.TerminalSearchWidget);
    };
}
exports.createTerminalSearchFactory = createTerminalSearchFactory;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/terminal/lib/browser/search/terminal-search-container'] = this;


/***/ }),

/***/ "../../packages/terminal/lib/browser/terminal-contribution.js":
/*!********************************************************************!*\
  !*** ../../packages/terminal/lib/browser/terminal-contribution.js ***!
  \********************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TerminalContribution = void 0;
const terminal_widget_impl_1 = __webpack_require__(/*! ./terminal-widget-impl */ "../../packages/terminal/lib/browser/terminal-widget-impl.js");
Object.defineProperty(exports, "TerminalContribution", ({ enumerable: true, get: function () { return terminal_widget_impl_1.TerminalContribution; } }));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/terminal/lib/browser/terminal-contribution'] = this;


/***/ }),

/***/ "../../packages/terminal/lib/browser/terminal-file-link-provider.js":
/*!**************************************************************************!*\
  !*** ../../packages/terminal/lib/browser/terminal-file-link-provider.js ***!
  \**************************************************************************/
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
exports.FileDiffPostLinkProvider = exports.FileDiffPreLinkProvider = exports.FileLinkProvider = void 0;
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const file_service_1 = __webpack_require__(/*! @theia/filesystem/lib/browser/file-service */ "../../packages/filesystem/lib/browser/file-service.js");
const terminal_widget_impl_1 = __webpack_require__(/*! ./terminal-widget-impl */ "../../packages/terminal/lib/browser/terminal-widget-impl.js");
let FileLinkProvider = class FileLinkProvider {
    async provideLinks(line, terminal) {
        const links = [];
        const regExp = await this.createRegExp();
        let regExpResult;
        while (regExpResult = regExp.exec(line)) {
            const match = regExpResult[0];
            if (await this.isValidFile(match, terminal)) {
                links.push({
                    startIndex: regExp.lastIndex - match.length,
                    length: match.length,
                    handle: () => this.open(match, terminal)
                });
            }
        }
        return links;
    }
    async createRegExp() {
        const baseLocalLinkClause = core_1.OS.backend.isWindows ? winLocalLinkClause : unixLocalLinkClause;
        return new RegExp(`${baseLocalLinkClause}(${lineAndColumnClause})`, 'g');
    }
    async isValidFile(match, terminal) {
        try {
            const toOpen = await this.toURI(match, await this.getCwd(terminal));
            if (toOpen) {
                // TODO: would be better to ask the opener service, but it returns positively even for unknown files.
                try {
                    const stat = await this.fileService.resolve(toOpen);
                    return !stat.isDirectory;
                }
                catch { }
            }
        }
        catch (err) {
            console.trace('Error validating ' + match, err);
        }
        return false;
    }
    async toURI(match, cwd) {
        const path = await this.extractPath(match);
        if (!path) {
            return;
        }
        const pathObj = new core_1.Path(path);
        return pathObj.isAbsolute ? cwd.withPath(path) : cwd.resolve(path);
    }
    async getCwd(terminal) {
        if (terminal instanceof terminal_widget_impl_1.TerminalWidgetImpl) {
            return terminal.cwd;
        }
        return terminal.lastCwd;
    }
    async extractPath(link) {
        const matches = (await this.createRegExp()).exec(link);
        if (!matches) {
            return undefined;
        }
        return matches[1];
    }
    async open(match, terminal) {
        const toOpen = await this.toURI(match, await this.getCwd(terminal));
        if (!toOpen) {
            return;
        }
        const position = await this.extractPosition(match);
        let options = {};
        if (position) {
            options = { selection: { start: position } };
        }
        try {
            const opener = await this.openerService.getOpener(toOpen, options);
            opener.open(toOpen, options);
        }
        catch (err) {
            console.error('Cannot open link ' + match, err);
        }
    }
    async extractPosition(link) {
        const matches = (await this.createRegExp()).exec(link);
        const info = { line: 1, character: 1 };
        if (!matches) {
            return info;
        }
        const lineAndColumnMatchIndex = core_1.OS.backend.isWindows ? winLineAndColumnMatchIndex : unixLineAndColumnMatchIndex;
        for (let i = 0; i < lineAndColumnClause.length; i++) {
            const lineMatchIndex = lineAndColumnMatchIndex + (lineAndColumnClauseGroupCount * i);
            const rowNumber = matches[lineMatchIndex];
            if (rowNumber) {
                info.line = parseInt(rowNumber, 10) - 1;
                const columnNumber = matches[lineMatchIndex + 2];
                if (columnNumber) {
                    info.character = parseInt(columnNumber, 10) - 1;
                }
                break;
            }
        }
        return info;
    }
};
__decorate([
    (0, inversify_1.inject)(browser_1.OpenerService),
    __metadata("design:type", Object)
], FileLinkProvider.prototype, "openerService", void 0);
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], FileLinkProvider.prototype, "fileService", void 0);
FileLinkProvider = __decorate([
    (0, inversify_1.injectable)()
], FileLinkProvider);
exports.FileLinkProvider = FileLinkProvider;
let FileDiffPreLinkProvider = class FileDiffPreLinkProvider extends FileLinkProvider {
    async createRegExp() {
        return /^--- a\/(\S*)/g;
    }
};
FileDiffPreLinkProvider = __decorate([
    (0, inversify_1.injectable)()
], FileDiffPreLinkProvider);
exports.FileDiffPreLinkProvider = FileDiffPreLinkProvider;
let FileDiffPostLinkProvider = class FileDiffPostLinkProvider extends FileLinkProvider {
    async createRegExp() {
        return /^\+\+\+ b\/(\S*)/g;
    }
};
FileDiffPostLinkProvider = __decorate([
    (0, inversify_1.injectable)()
], FileDiffPostLinkProvider);
exports.FileDiffPostLinkProvider = FileDiffPostLinkProvider;
// The following regular expressions are taken from:
// https://github.com/microsoft/vscode/blob/b118105bf28d773fbbce683f7230d058be2f89a7/src/vs/workbench/contrib/terminal/browser/links/terminalLocalLinkDetector.ts#L34-L58
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const pathPrefix = '(\\.\\.?|\\~)';
const pathSeparatorClause = '\\/';
// '":; are allowed in paths but they are often separators so ignore them
// Also disallow \\ to prevent a catastrophic backtracking case #24795
const excludedPathCharactersClause = '[^\\0\\s!`&*()\\[\\]\'":;\\\\]';
/** A regex that matches paths in the form /foo, ~/foo, ./foo, ../foo, foo/bar */
const unixLocalLinkClause = '((' + pathPrefix + '|(' + excludedPathCharactersClause + ')+)?(' + pathSeparatorClause + '(' + excludedPathCharactersClause + ')+)+)';
const winDrivePrefix = '(?:\\\\\\\\\\?\\\\)?[a-zA-Z]:';
const winPathPrefix = '(' + winDrivePrefix + '|\\.\\.?|\\~)';
const winPathSeparatorClause = '(\\\\|\\/)';
const winExcludedPathCharactersClause = '[^\\0<>\\?\\|\\/\\s!`&*()\\[\\]\'":;]';
/** A regex that matches paths in the form \\?\c:\foo c:\foo, ~\foo, .\foo, ..\foo, foo\bar */
const winLocalLinkClause = '((' + winPathPrefix + '|(' + winExcludedPathCharactersClause + ')+)?(' + winPathSeparatorClause + '(' + winExcludedPathCharactersClause + ')+)+)';
/** As xterm reads from DOM, space in that case is non-breaking char ASCII code - 160, replacing space with nonBreakingSpace or space ASCII code - 32. */
const lineAndColumnClause = [
    // "(file path)", line 45 [see #40468]
    '((\\S*)[\'"], line ((\\d+)( column (\\d+))?))',
    // "(file path)",45 [see #78205]
    '((\\S*)[\'"],((\\d+)(:(\\d+))?))',
    // (file path) on line 8, column 13
    '((\\S*) on line ((\\d+)(, column (\\d+))?))',
    // (file path):line 8, column 13
    '((\\S*):line ((\\d+)(, column (\\d+))?))',
    // (file path)(45), (file path) (45), (file path)(45,18), (file path) (45,18), (file path)(45, 18), (file path) (45, 18), also with []
    '(([^\\s\\(\\)]*)(\\s?[\\(\\[](\\d+)(,\\s?(\\d+))?)[\\)\\]])',
    // (file path):336, (file path):336:9
    '(([^:\\s\\(\\)<>\'\"\\[\\]]*)(:(\\d+))?(:(\\d+))?)'
].join('|').replace(/ /g, `[${'\u00A0'} ]`);
// Changing any regex may effect this value, hence changes this as well if required.
const winLineAndColumnMatchIndex = 12;
const unixLineAndColumnMatchIndex = 11;
// Each line and column clause have 6 groups (ie no. of expressions in round brackets)
const lineAndColumnClauseGroupCount = 6;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/terminal/lib/browser/terminal-file-link-provider'] = this;


/***/ }),

/***/ "../../packages/terminal/lib/browser/terminal-frontend-module.js":
/*!***********************************************************************!*\
  !*** ../../packages/terminal/lib/browser/terminal-frontend-module.js ***!
  \***********************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
__webpack_require__(/*! ../../src/browser/style/terminal.css */ "../../packages/terminal/src/browser/style/terminal.css");
__webpack_require__(/*! xterm/css/xterm.css */ "../../node_modules/xterm/css/xterm.css");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const tab_bar_toolbar_1 = __webpack_require__(/*! @theia/core/lib/browser/shell/tab-bar-toolbar */ "../../packages/core/lib/browser/shell/tab-bar-toolbar/index.js");
const terminal_frontend_contribution_1 = __webpack_require__(/*! ./terminal-frontend-contribution */ "../../packages/terminal/lib/browser/terminal-frontend-contribution.js");
const terminal_widget_impl_1 = __webpack_require__(/*! ./terminal-widget-impl */ "../../packages/terminal/lib/browser/terminal-widget-impl.js");
const terminal_widget_1 = __webpack_require__(/*! ./base/terminal-widget */ "../../packages/terminal/lib/browser/base/terminal-widget.js");
const terminal_protocol_1 = __webpack_require__(/*! ../common/terminal-protocol */ "../../packages/terminal/lib/common/terminal-protocol.js");
const terminal_watcher_1 = __webpack_require__(/*! ../common/terminal-watcher */ "../../packages/terminal/lib/common/terminal-watcher.js");
const shell_terminal_protocol_1 = __webpack_require__(/*! ../common/shell-terminal-protocol */ "../../packages/terminal/lib/common/shell-terminal-protocol.js");
const terminal_common_module_1 = __webpack_require__(/*! ../common/terminal-common-module */ "../../packages/terminal/lib/common/terminal-common-module.js");
const terminal_service_1 = __webpack_require__(/*! ./base/terminal-service */ "../../packages/terminal/lib/browser/base/terminal-service.js");
const terminal_preferences_1 = __webpack_require__(/*! ./terminal-preferences */ "../../packages/terminal/lib/browser/terminal-preferences.js");
const terminal_contribution_1 = __webpack_require__(/*! ./terminal-contribution */ "../../packages/terminal/lib/browser/terminal-contribution.js");
const terminal_search_widget_1 = __webpack_require__(/*! ./search/terminal-search-widget */ "../../packages/terminal/lib/browser/search/terminal-search-widget.js");
const terminal_quick_open_service_1 = __webpack_require__(/*! ./terminal-quick-open-service */ "../../packages/terminal/lib/browser/terminal-quick-open-service.js");
const terminal_search_container_1 = __webpack_require__(/*! ./search/terminal-search-container */ "../../packages/terminal/lib/browser/search/terminal-search-container.js");
const terminal_copy_on_selection_handler_1 = __webpack_require__(/*! ./terminal-copy-on-selection-handler */ "../../packages/terminal/lib/browser/terminal-copy-on-selection-handler.js");
const color_application_contribution_1 = __webpack_require__(/*! @theia/core/lib/browser/color-application-contribution */ "../../packages/core/lib/browser/color-application-contribution.js");
const terminal_theme_service_1 = __webpack_require__(/*! ./terminal-theme-service */ "../../packages/terminal/lib/browser/terminal-theme-service.js");
const quick_access_1 = __webpack_require__(/*! @theia/core/lib/browser/quick-input/quick-access */ "../../packages/core/lib/browser/quick-input/quick-access.js");
const terminal_link_provider_1 = __webpack_require__(/*! ./terminal-link-provider */ "../../packages/terminal/lib/browser/terminal-link-provider.js");
const terminal_url_link_provider_1 = __webpack_require__(/*! ./terminal-url-link-provider */ "../../packages/terminal/lib/browser/terminal-url-link-provider.js");
const terminal_file_link_provider_1 = __webpack_require__(/*! ./terminal-file-link-provider */ "../../packages/terminal/lib/browser/terminal-file-link-provider.js");
const terminal_profile_service_1 = __webpack_require__(/*! ./terminal-profile-service */ "../../packages/terminal/lib/browser/terminal-profile-service.js");
exports["default"] = new inversify_1.ContainerModule(bind => {
    (0, terminal_preferences_1.bindTerminalPreferences)(bind);
    bind(terminal_widget_1.TerminalWidget).to(terminal_widget_impl_1.TerminalWidgetImpl).inTransientScope();
    bind(terminal_watcher_1.TerminalWatcher).toSelf().inSingletonScope();
    let terminalNum = 0;
    bind(browser_1.WidgetFactory).toDynamicValue(ctx => ({
        id: terminal_widget_impl_1.TERMINAL_WIDGET_FACTORY_ID,
        createWidget: (options) => {
            const child = new inversify_1.Container({ defaultScope: 'Singleton' });
            child.parent = ctx.container;
            const counter = terminalNum++;
            const domId = options.id || 'terminal-' + counter;
            const widgetOptions = {
                title: `${common_1.nls.localizeByDefault('Terminal')} ${counter}`,
                useServerTitle: true,
                destroyTermOnClose: true,
                ...options
            };
            child.bind(terminal_widget_1.TerminalWidgetOptions).toConstantValue(widgetOptions);
            child.bind('terminal-dom-id').toConstantValue(domId);
            child.bind(terminal_search_widget_1.TerminalSearchWidgetFactory).toDynamicValue(context => (0, terminal_search_container_1.createTerminalSearchFactory)(context.container));
            return child.get(terminal_widget_1.TerminalWidget);
        }
    }));
    bind(terminal_quick_open_service_1.TerminalQuickOpenService).toSelf().inSingletonScope();
    bind(terminal_copy_on_selection_handler_1.TerminalCopyOnSelectionHandler).toSelf().inSingletonScope();
    bind(terminal_quick_open_service_1.TerminalQuickOpenContribution).toSelf().inSingletonScope();
    for (const identifier of [common_1.CommandContribution, quick_access_1.QuickAccessContribution]) {
        bind(identifier).toService(terminal_quick_open_service_1.TerminalQuickOpenContribution);
    }
    bind(terminal_theme_service_1.TerminalThemeService).toSelf().inSingletonScope();
    bind(terminal_frontend_contribution_1.TerminalFrontendContribution).toSelf().inSingletonScope();
    bind(terminal_service_1.TerminalService).toService(terminal_frontend_contribution_1.TerminalFrontendContribution);
    for (const identifier of [common_1.CommandContribution, common_1.MenuContribution, browser_1.KeybindingContribution, tab_bar_toolbar_1.TabBarToolbarContribution, color_application_contribution_1.ColorContribution]) {
        bind(identifier).toService(terminal_frontend_contribution_1.TerminalFrontendContribution);
    }
    bind(terminal_protocol_1.ITerminalServer).toDynamicValue(ctx => {
        const connection = ctx.container.get(browser_1.WebSocketConnectionProvider);
        const terminalWatcher = ctx.container.get(terminal_watcher_1.TerminalWatcher);
        return connection.createProxy(terminal_protocol_1.terminalPath, terminalWatcher.getTerminalClient());
    }).inSingletonScope();
    bind(shell_terminal_protocol_1.ShellTerminalServerProxy).toDynamicValue(ctx => {
        const connection = ctx.container.get(browser_1.WebSocketConnectionProvider);
        const terminalWatcher = ctx.container.get(terminal_watcher_1.TerminalWatcher);
        return connection.createProxy(shell_terminal_protocol_1.shellTerminalPath, terminalWatcher.getTerminalClient());
    }).inSingletonScope();
    bind(shell_terminal_protocol_1.IShellTerminalServer).toService(shell_terminal_protocol_1.ShellTerminalServerProxy);
    (0, terminal_common_module_1.createCommonBindings)(bind);
    (0, core_1.bindContributionProvider)(bind, terminal_contribution_1.TerminalContribution);
    // terminal link provider contribution point
    (0, core_1.bindContributionProvider)(bind, terminal_link_provider_1.TerminalLinkProvider);
    bind(terminal_link_provider_1.TerminalLinkProviderContribution).toSelf().inSingletonScope();
    bind(terminal_contribution_1.TerminalContribution).toService(terminal_link_provider_1.TerminalLinkProviderContribution);
    bind(terminal_link_provider_1.XtermLinkFactory).toFactory(terminal_link_provider_1.createXtermLinkFactory);
    // default terminal link provider
    bind(terminal_url_link_provider_1.UrlLinkProvider).toSelf().inSingletonScope();
    bind(terminal_link_provider_1.TerminalLinkProvider).toService(terminal_url_link_provider_1.UrlLinkProvider);
    bind(terminal_file_link_provider_1.FileLinkProvider).toSelf().inSingletonScope();
    bind(terminal_link_provider_1.TerminalLinkProvider).toService(terminal_file_link_provider_1.FileLinkProvider);
    bind(terminal_file_link_provider_1.FileDiffPreLinkProvider).toSelf().inSingletonScope();
    bind(terminal_link_provider_1.TerminalLinkProvider).toService(terminal_file_link_provider_1.FileDiffPreLinkProvider);
    bind(terminal_file_link_provider_1.FileDiffPostLinkProvider).toSelf().inSingletonScope();
    bind(terminal_link_provider_1.TerminalLinkProvider).toService(terminal_file_link_provider_1.FileDiffPostLinkProvider);
    bind(terminal_profile_service_1.ContributedTerminalProfileStore).to(terminal_profile_service_1.DefaultProfileStore).inSingletonScope();
    bind(terminal_profile_service_1.UserTerminalProfileStore).to(terminal_profile_service_1.DefaultProfileStore).inSingletonScope();
    bind(terminal_profile_service_1.TerminalProfileService).toDynamicValue(ctx => {
        const userStore = ctx.container.get(terminal_profile_service_1.UserTerminalProfileStore);
        const contributedStore = ctx.container.get(terminal_profile_service_1.ContributedTerminalProfileStore);
        return new terminal_profile_service_1.DefaultTerminalProfileService(userStore, contributedStore);
    }).inSingletonScope();
    bind(browser_1.FrontendApplicationContribution).to(terminal_frontend_contribution_1.TerminalFrontendContribution);
});

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/terminal/lib/browser/terminal-frontend-module'] = this;


/***/ }),

/***/ "../../packages/terminal/lib/browser/terminal-quick-open-service.js":
/*!**************************************************************************!*\
  !*** ../../packages/terminal/lib/browser/terminal-quick-open-service.js ***!
  \**************************************************************************/
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TerminalQuickOpenService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TerminalQuickOpenContribution = exports.TerminalQuickOpenService = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const terminal_service_1 = __webpack_require__(/*! ./base/terminal-service */ "../../packages/terminal/lib/browser/base/terminal-service.js");
const terminal_frontend_contribution_1 = __webpack_require__(/*! ./terminal-frontend-contribution */ "../../packages/terminal/lib/browser/terminal-frontend-contribution.js");
const quick_input_service_1 = __webpack_require__(/*! @theia/core/lib/browser/quick-input/quick-input-service */ "../../packages/core/lib/browser/quick-input/quick-input-service.js");
let TerminalQuickOpenService = TerminalQuickOpenService_1 = class TerminalQuickOpenService {
    open() {
        var _a;
        (_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.open(TerminalQuickOpenService_1.PREFIX);
    }
    async getPicks(filter, token) {
        const items = [];
        // Get the sorted list of currently opened terminal widgets that aren't hidden from users
        const widgets = this.terminalService.all.filter(widget => !widget.hiddenFromUser)
            .sort((a, b) => this.compareItems(a, b));
        for (const widget of widgets) {
            items.push(this.toItem(widget));
        }
        // Append a quick open item to create a new terminal.
        items.push({
            label: common_1.nls.localizeByDefault('Create New Terminal'),
            iconClasses: (0, browser_1.codiconArray)('add'),
            execute: () => this.doCreateNewTerminal()
        });
        return (0, quick_input_service_1.filterItems)(items, filter);
    }
    registerQuickAccessProvider() {
        this.quickAccessRegistry.registerQuickAccessProvider({
            getInstance: () => this,
            prefix: TerminalQuickOpenService_1.PREFIX,
            placeholder: '',
            helpEntries: [{ description: common_1.nls.localizeByDefault('Show All Opened Terminals'), needsEditor: false }]
        });
    }
    /**
     * Compare two terminal widgets by label. If labels are identical, compare by the widget id.
     * @param a `TerminalWidget` for comparison
     * @param b `TerminalWidget` for comparison
     */
    compareItems(a, b) {
        const normalize = (str) => str.trim().toLowerCase();
        if (normalize(a.title.label) !== normalize(b.title.label)) {
            return normalize(a.title.label).localeCompare(normalize(b.title.label));
        }
        else {
            return normalize(a.id).localeCompare(normalize(b.id));
        }
    }
    doCreateNewTerminal() {
        this.commandService.executeCommand(terminal_frontend_contribution_1.TerminalCommands.NEW.id);
    }
    /**
     * Convert the terminal widget to the quick pick item.
     * @param {TerminalWidget} widget - the terminal widget.
     * @returns quick pick item.
     */
    toItem(widget) {
        return {
            label: widget.title.label,
            description: widget.id,
            ariaLabel: widget.title.label,
            execute: () => this.terminalService.open(widget)
        };
    }
};
TerminalQuickOpenService.PREFIX = 'term ';
__decorate([
    (0, inversify_1.inject)(browser_1.QuickInputService),
    (0, inversify_1.optional)(),
    __metadata("design:type", Object)
], TerminalQuickOpenService.prototype, "quickInputService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.QuickAccessRegistry),
    __metadata("design:type", Object)
], TerminalQuickOpenService.prototype, "quickAccessRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.CommandService),
    __metadata("design:type", Object)
], TerminalQuickOpenService.prototype, "commandService", void 0);
__decorate([
    (0, inversify_1.inject)(terminal_service_1.TerminalService),
    __metadata("design:type", Object)
], TerminalQuickOpenService.prototype, "terminalService", void 0);
TerminalQuickOpenService = TerminalQuickOpenService_1 = __decorate([
    (0, inversify_1.injectable)()
], TerminalQuickOpenService);
exports.TerminalQuickOpenService = TerminalQuickOpenService;
/**
 * TODO: merge it to TerminalFrontendContribution.
 */
let TerminalQuickOpenContribution = class TerminalQuickOpenContribution {
    registerQuickAccessProvider() {
        this.terminalQuickOpenService.registerQuickAccessProvider();
    }
    registerCommands(commands) {
        commands.registerCommand(terminal_frontend_contribution_1.TerminalCommands.SHOW_ALL_OPENED_TERMINALS, {
            execute: () => this.terminalQuickOpenService.open()
        });
    }
};
__decorate([
    (0, inversify_1.inject)(TerminalQuickOpenService),
    __metadata("design:type", TerminalQuickOpenService)
], TerminalQuickOpenContribution.prototype, "terminalQuickOpenService", void 0);
TerminalQuickOpenContribution = __decorate([
    (0, inversify_1.injectable)()
], TerminalQuickOpenContribution);
exports.TerminalQuickOpenContribution = TerminalQuickOpenContribution;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/terminal/lib/browser/terminal-quick-open-service'] = this;


/***/ }),

/***/ "../../packages/terminal/lib/browser/terminal-url-link-provider.js":
/*!*************************************************************************!*\
  !*** ../../packages/terminal/lib/browser/terminal-url-link-provider.js ***!
  \*************************************************************************/
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
exports.UrlLinkProvider = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
let UrlLinkProvider = class UrlLinkProvider {
    constructor() {
        this.urlRegExp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
        this.localhostRegExp = /(https?:\/\/)?(localhost|127\.0\.0\.1|0\.0\.0\.0)(:[0-9]{1,5})?([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
    }
    async provideLinks(line, terminal) {
        return [...this.matchUrlLinks(line), ...this.matchLocalhostLinks(line)];
    }
    matchUrlLinks(line) {
        const links = [];
        let regExpResult;
        while (regExpResult = this.urlRegExp.exec(line)) {
            const match = regExpResult[0];
            links.push({
                startIndex: this.urlRegExp.lastIndex - match.length,
                length: match.length,
                handle: () => (0, browser_1.open)(this.openerService, new uri_1.default(match)).then()
            });
        }
        return links;
    }
    matchLocalhostLinks(line) {
        const links = [];
        let regExpResult;
        while (regExpResult = this.localhostRegExp.exec(line)) {
            const match = regExpResult[0];
            links.push({
                startIndex: this.localhostRegExp.lastIndex - match.length,
                length: match.length,
                handle: async () => {
                    const uri = match.startsWith('http') ? match : `http://${match}`;
                    (0, browser_1.open)(this.openerService, new uri_1.default(uri));
                }
            });
        }
        return links;
    }
};
__decorate([
    (0, inversify_1.inject)(browser_1.OpenerService),
    __metadata("design:type", Object)
], UrlLinkProvider.prototype, "openerService", void 0);
UrlLinkProvider = __decorate([
    (0, inversify_1.injectable)()
], UrlLinkProvider);
exports.UrlLinkProvider = UrlLinkProvider;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/terminal/lib/browser/terminal-url-link-provider'] = this;


/***/ }),

/***/ "../../packages/terminal/lib/common/shell-terminal-protocol.js":
/*!*********************************************************************!*\
  !*** ../../packages/terminal/lib/common/shell-terminal-protocol.js ***!
  \*********************************************************************/
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
exports.ShellTerminalServerProxy = exports.shellTerminalPath = exports.IShellTerminalServer = void 0;
exports.IShellTerminalServer = Symbol('IShellTerminalServer');
exports.shellTerminalPath = '/services/shell-terminal';
;
exports.ShellTerminalServerProxy = Symbol('ShellTerminalServerProxy');

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/terminal/lib/common/shell-terminal-protocol'] = this;


/***/ }),

/***/ "../../packages/terminal/lib/common/terminal-common-module.js":
/*!********************************************************************!*\
  !*** ../../packages/terminal/lib/common/terminal-common-module.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2018 Ericsson and others.
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
exports.createCommonBindings = void 0;
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
/**
 * Create the bindings common to node and browser.
 *
 * @param bind The bind function from inversify.
 */
function createCommonBindings(bind) {
    bind(core_1.ILogger).toDynamicValue(ctx => {
        const logger = ctx.container.get(core_1.ILogger);
        return logger.child('terminal');
    }).inSingletonScope().whenTargetNamed('terminal');
}
exports.createCommonBindings = createCommonBindings;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/terminal/lib/common/terminal-common-module'] = this;


/***/ }),

/***/ "../../packages/variable-resolver/lib/browser/index.js":
/*!*************************************************************!*\
  !*** ../../packages/variable-resolver/lib/browser/index.js ***!
  \*************************************************************/
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
__exportStar(__webpack_require__(/*! ./variable */ "../../packages/variable-resolver/lib/browser/variable.js"), exports);
__exportStar(__webpack_require__(/*! ./variable-quick-open-service */ "../../packages/variable-resolver/lib/browser/variable-quick-open-service.js"), exports);
__exportStar(__webpack_require__(/*! ./variable-resolver-service */ "../../packages/variable-resolver/lib/browser/variable-resolver-service.js"), exports);

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/variable-resolver/lib/browser'] = this;


/***/ }),

/***/ "../../packages/workspace/lib/browser/index.js":
/*!*****************************************************!*\
  !*** ../../packages/workspace/lib/browser/index.js ***!
  \*****************************************************/
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
__exportStar(__webpack_require__(/*! ./workspace-commands */ "../../packages/workspace/lib/browser/workspace-commands.js"), exports);
__exportStar(__webpack_require__(/*! ./workspace-service */ "../../packages/workspace/lib/browser/workspace-service.js"), exports);
__exportStar(__webpack_require__(/*! ./canonical-uri-service */ "../../packages/workspace/lib/browser/canonical-uri-service.js"), exports);
__exportStar(__webpack_require__(/*! ./workspace-frontend-contribution */ "../../packages/workspace/lib/browser/workspace-frontend-contribution.js"), exports);
__exportStar(__webpack_require__(/*! ./workspace-frontend-module */ "../../packages/workspace/lib/browser/workspace-frontend-module.js"), exports);
__exportStar(__webpack_require__(/*! ./workspace-preferences */ "../../packages/workspace/lib/browser/workspace-preferences.js"), exports);
__exportStar(__webpack_require__(/*! ./workspace-trust-service */ "../../packages/workspace/lib/browser/workspace-trust-service.js"), exports);

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/workspace/lib/browser'] = this;


/***/ }),

/***/ "../../node_modules/css-loader/dist/cjs.js!../../packages/terminal/src/browser/style/terminal.css":
/*!********************************************************************************************************!*\
  !*** ../../node_modules/css-loader/dist/cjs.js!../../packages/terminal/src/browser/style/terminal.css ***!
  \********************************************************************************************************/
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
 * Copyright (C) 2017 TypeFox and others.
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

.terminal-container {
  width: 100%;
  height: 100%;
  padding: var(--theia-code-padding);
  background: var(--theia-terminal-background);
}

.xterm .xterm-screen canvas {
  /* fix random 1px white border on terminal in Firefox. See https://github.com/eclipse-theia/theia/issues/4665 */
  border: 1px solid var(--theia-terminal-background);
}

.terminal-container .xterm .xterm-helper-textarea {
  /* fix secondary cursor-like issue. See https://github.com/eclipse-theia/theia/issues/8158 */
  opacity: 0 !important;
}
`, "",{"version":3,"sources":["webpack://./../../packages/terminal/src/browser/style/terminal.css"],"names":[],"mappings":"AAAA;;;;;;;;;;;;;;iFAciF;;AAEjF;EACE,WAAW;EACX,YAAY;EACZ,kCAAkC;EAClC,4CAA4C;AAC9C;;AAEA;EACE,+GAA+G;EAC/G,kDAAkD;AACpD;;AAEA;EACE,4FAA4F;EAC5F,qBAAqB;AACvB","sourcesContent":["/********************************************************************************\n * Copyright (C) 2017 TypeFox and others.\n *\n * This program and the accompanying materials are made available under the\n * terms of the Eclipse Public License v. 2.0 which is available at\n * http://www.eclipse.org/legal/epl-2.0.\n *\n * This Source Code may also be made available under the following Secondary\n * Licenses when the conditions for such availability set forth in the Eclipse\n * Public License v. 2.0 are satisfied: GNU General Public License, version 2\n * with the GNU Classpath Exception which is available at\n * https://www.gnu.org/software/classpath/license.html.\n *\n * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0\n ********************************************************************************/\n\n.terminal-container {\n  width: 100%;\n  height: 100%;\n  padding: var(--theia-code-padding);\n  background: var(--theia-terminal-background);\n}\n\n.xterm .xterm-screen canvas {\n  /* fix random 1px white border on terminal in Firefox. See https://github.com/eclipse-theia/theia/issues/4665 */\n  border: 1px solid var(--theia-terminal-background);\n}\n\n.terminal-container .xterm .xterm-helper-textarea {\n  /* fix secondary cursor-like issue. See https://github.com/eclipse-theia/theia/issues/8158 */\n  opacity: 0 !important;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../packages/terminal/src/browser/style/terminal.css":
/*!**************************************************************!*\
  !*** ../../packages/terminal/src/browser/style/terminal.css ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_terminal_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/css-loader/dist/cjs.js!./terminal.css */ "../../node_modules/css-loader/dist/cjs.js!../../packages/terminal/src/browser/style/terminal.css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_terminal_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_terminal_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ })

}]);
//# sourceMappingURL=packages_core_lib_common_markdown-rendering_markdown-string_js-packages_terminal_lib_browser_-799165.js.map