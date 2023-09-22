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
exports.FileDiffPostLinkProvider = exports.FileDiffPreLinkProvider = exports.FileLinkProvider = void 0;
const core_1 = require("@theia/core");
const browser_1 = require("@theia/core/lib/browser");
const inversify_1 = require("@theia/core/shared/inversify");
const file_service_1 = require("@theia/filesystem/lib/browser/file-service");
const terminal_widget_impl_1 = require("./terminal-widget-impl");
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
//# sourceMappingURL=terminal-file-link-provider.js.map