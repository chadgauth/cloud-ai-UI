"use strict";
// *****************************************************************************
// Copyright (C) 2017-2021 Ericsson and others.
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RipgrepSearchInWorkspaceServer = exports.RgPath = void 0;
const fs = require("@theia/core/shared/fs-extra");
const path = require("path");
const core_1 = require("@theia/core");
const node_1 = require("@theia/process/lib/node");
const file_uri_1 = require("@theia/core/lib/node/file-uri");
const uri_1 = require("@theia/core/lib/common/uri");
const inversify_1 = require("@theia/core/shared/inversify");
exports.RgPath = Symbol('RgPath');
function bytesOrTextToString(obj) {
    return 'bytes' in obj ?
        Buffer.from(obj.bytes, 'base64').toString() :
        obj.text;
}
let RipgrepSearchInWorkspaceServer = class RipgrepSearchInWorkspaceServer {
    constructor(logger, rawProcessFactory) {
        this.logger = logger;
        this.rawProcessFactory = rawProcessFactory;
        // List of ongoing searches, maps search id to a the started rg process.
        this.ongoingSearches = new Map();
        // Each incoming search is given a unique id, returned to the client.  This is the next id we will assigned.
        this.nextSearchId = 1;
    }
    setClient(client) {
        this.client = client;
    }
    getArgs(options) {
        const args = new Set();
        args.add('--hidden');
        args.add('--json');
        if (options === null || options === void 0 ? void 0 : options.matchCase) {
            args.add('--case-sensitive');
        }
        else {
            args.add('--ignore-case');
        }
        if (options === null || options === void 0 ? void 0 : options.includeIgnored) {
            args.add('--no-ignore');
        }
        if (options === null || options === void 0 ? void 0 : options.maxFileSize) {
            args.add('--max-filesize=' + options.maxFileSize.trim());
        }
        else {
            args.add('--max-filesize=20M');
        }
        if (options === null || options === void 0 ? void 0 : options.include) {
            this.addGlobArgs(args, options.include, false);
        }
        if (options === null || options === void 0 ? void 0 : options.exclude) {
            this.addGlobArgs(args, options.exclude, true);
        }
        if (options === null || options === void 0 ? void 0 : options.followSymlinks) {
            args.add('--follow');
        }
        if ((options === null || options === void 0 ? void 0 : options.useRegExp) || (options === null || options === void 0 ? void 0 : options.matchWholeWord)) {
            args.add('--regexp');
        }
        else {
            args.add('--fixed-strings');
            args.add('--');
        }
        return Array.from(args);
    }
    /**
     * Add glob patterns to ripgrep's arguments
     * @param args ripgrep set of arguments
     * @param patterns patterns to include as globs
     * @param exclude whether to negate the glob pattern or not
     */
    addGlobArgs(args, patterns, exclude = false) {
        const sanitizedPatterns = patterns.map(pattern => pattern.trim()).filter(pattern => pattern.length > 0);
        for (let pattern of sanitizedPatterns) {
            // make sure the pattern always starts with `**/`
            if (pattern.startsWith('/')) {
                pattern = '**' + pattern;
            }
            else if (!pattern.startsWith('**/')) {
                pattern = '**/' + pattern;
            }
            // add the exclusion prefix
            if (exclude) {
                pattern = '!' + pattern;
            }
            args.add(`--glob=${pattern}`);
            // add a generic glob cli argument entry to include files inside a given directory
            if (!pattern.endsWith('*')) {
                // ensure the new pattern ends with `/*`
                pattern += pattern.endsWith('/') ? '*' : '/*';
                args.add(`--glob=${pattern}`);
            }
        }
    }
    /**
     * Transforms relative patterns to absolute paths, one for each given search path.
     * The resulting paths are not validated in the file system as the pattern keeps glob information.
     *
     * @returns The resulting list may be larger than the received patterns as a relative pattern may
     * resolve to multiple absolute patterns up to the number of search paths.
     */
    replaceRelativeToAbsolute(roots, patterns = []) {
        const expandedPatterns = new Set();
        for (const pattern of patterns) {
            if (this.isPatternRelative(pattern)) {
                // create new patterns using the absolute form for each root
                for (const root of roots) {
                    expandedPatterns.add(path.resolve(root, pattern));
                }
            }
            else {
                expandedPatterns.add(pattern);
            }
        }
        return Array.from(expandedPatterns);
    }
    /**
     * Tests if the pattern is relative and should/can be made absolute.
     */
    isPatternRelative(pattern) {
        return pattern.replace(/\\/g, '/').startsWith('./');
    }
    /**
     * By default, sets the search directories for the string WHAT to the provided ROOTURIS directories
     * and returns the assigned search id.
     *
     * The include / exclude (options in SearchInWorkspaceOptions) are lists of patterns for files to
     * include / exclude during search (glob characters are allowed).
     *
     * include patterns successfully recognized as absolute paths will override the default search and set
     * the search directories to the ones provided as includes.
     * Relative paths are allowed, the application will attempt to translate them to valid absolute paths
     * based on the applicable search directories.
     */
    async search(what, rootUris, options = {}) {
        // Start the rg process.  Use --vimgrep to get one result per
        // line, --color=always to get color control characters that
        // we'll use to parse the lines.
        const searchId = this.nextSearchId++;
        const rootPaths = rootUris.map(root => file_uri_1.FileUri.fsPath(root));
        // If there are absolute paths in `include` we will remove them and use
        // those as paths to search from.
        const searchPaths = await this.extractSearchPathsFromIncludes(rootPaths, options);
        options.include = this.replaceRelativeToAbsolute(searchPaths, options.include);
        options.exclude = this.replaceRelativeToAbsolute(searchPaths, options.exclude);
        const rgArgs = this.getArgs(options);
        // If we use matchWholeWord we use regExp internally, so we need
        // to escape regexp characters if we actually not set regexp true in UI.
        if ((options === null || options === void 0 ? void 0 : options.matchWholeWord) && !options.useRegExp) {
            what = what.replace(/[\-\\\{\}\*\+\?\|\^\$\.\[\]\(\)\#]/g, '\\$&');
            if (!/\B/.test(what.charAt(0))) {
                what = '\\b' + what;
            }
            if (!/\B/.test(what.charAt(what.length - 1))) {
                what = what + '\\b';
            }
        }
        const args = [...rgArgs, what, ...searchPaths];
        const processOptions = {
            command: this.rgPath,
            args
        };
        // TODO: Use child_process directly instead of rawProcessFactory?
        const rgProcess = this.rawProcessFactory(processOptions);
        this.ongoingSearches.set(searchId, rgProcess);
        rgProcess.onError(error => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let errorCode = error.code;
            // Try to provide somewhat clearer error messages, if possible.
            if (errorCode === 'ENOENT') {
                errorCode = 'could not find the ripgrep (rg) binary';
            }
            else if (errorCode === 'EACCES') {
                errorCode = 'could not execute the ripgrep (rg) binary';
            }
            const errorStr = `An error happened while searching (${errorCode}).`;
            this.wrapUpSearch(searchId, errorStr);
        });
        // Running counter of results.
        let numResults = 0;
        // Buffer to accumulate incoming output.
        let databuf = '';
        let currentSearchResult;
        rgProcess.outputStream.on('data', (chunk) => {
            // We might have already reached the max number of
            // results, sent a TERM signal to rg, but we still get
            // the data that was already output in the mean time.
            // It's not necessary to return early here (the check
            // for maxResults below would avoid sending extra
            // results), but it avoids doing unnecessary work.
            if ((options === null || options === void 0 ? void 0 : options.maxResults) && numResults >= options.maxResults) {
                return;
            }
            databuf += chunk;
            while (1) {
                // Check if we have a complete line.
                const eolIdx = databuf.indexOf('\n');
                if (eolIdx < 0) {
                    break;
                }
                // Get and remove the line from the data buffer.
                const lineBuf = databuf.slice(0, eolIdx);
                databuf = databuf.slice(eolIdx + 1);
                const obj = JSON.parse(lineBuf);
                if (obj.type === 'begin') {
                    const file = bytesOrTextToString(obj.data.path);
                    if (file) {
                        currentSearchResult = {
                            fileUri: file_uri_1.FileUri.create(file).toString(),
                            root: this.getRoot(file, rootUris).toString(),
                            matches: []
                        };
                    }
                    else {
                        this.logger.error('Begin message without path. ' + JSON.stringify(obj));
                    }
                }
                else if (obj.type === 'end') {
                    if (currentSearchResult && this.client) {
                        this.client.onResult(searchId, currentSearchResult);
                    }
                    currentSearchResult = undefined;
                }
                else if (obj.type === 'match') {
                    if (!currentSearchResult) {
                        continue;
                    }
                    const data = obj.data;
                    const file = bytesOrTextToString(data.path);
                    const line = data.line_number;
                    const lineText = bytesOrTextToString(data.lines);
                    if (file === undefined || lineText === undefined) {
                        continue;
                    }
                    const lineInBytes = Buffer.from(lineText);
                    for (const submatch of data.submatches) {
                        const startOffset = lineInBytes.slice(0, submatch.start).toString().length;
                        const match = bytesOrTextToString(submatch.match);
                        let lineInfo = lineText.trimRight();
                        if (lineInfo.length > 300) {
                            const prefixLength = 25;
                            const start = Math.max(startOffset - prefixLength, 0);
                            const length = prefixLength + match.length + 70;
                            let prefix = '';
                            if (start >= prefixLength) {
                                prefix = '...';
                            }
                            const character = (start < prefixLength ? start : prefixLength) + prefix.length + 1;
                            lineInfo = {
                                text: prefix + lineInfo.substring(start, start + length),
                                character
                            };
                        }
                        currentSearchResult.matches.push({
                            line,
                            character: startOffset + 1,
                            length: match.length,
                            lineText: lineInfo
                        });
                        numResults++;
                        // Did we reach the maximum number of results?
                        if ((options === null || options === void 0 ? void 0 : options.maxResults) && numResults >= options.maxResults) {
                            rgProcess.kill();
                            if (currentSearchResult && this.client) {
                                this.client.onResult(searchId, currentSearchResult);
                            }
                            currentSearchResult = undefined;
                            this.wrapUpSearch(searchId);
                            break;
                        }
                    }
                }
            }
        });
        rgProcess.outputStream.on('end', () => {
            // If we reached maxResults, we should have already
            // wrapped up the search.  Returning early avoids
            // logging a warning message in wrapUpSearch.
            if ((options === null || options === void 0 ? void 0 : options.maxResults) && numResults >= options.maxResults) {
                return;
            }
            this.wrapUpSearch(searchId);
        });
        return searchId;
    }
    /**
     * The default search paths are set to be the root paths associated to a workspace
     * however the search scope can be further refined with the include paths available in the search options.
     * This method will replace the searching paths to the ones specified in the 'include' options but as long
     * as the 'include' paths can be successfully validated as existing.
     *
     * Therefore the returned array of paths can be either the workspace root paths or a set of validated paths
     * derived from the include options which can be used to perform the search.
     *
     * Any pattern that resulted in a valid search path will be removed from the 'include' list as it is
     * provided as an equivalent search path instead.
     */
    async extractSearchPathsFromIncludes(rootPaths, options) {
        if (!options.include) {
            return rootPaths;
        }
        const resolvedPaths = new Set();
        const include = [];
        for (const pattern of options.include) {
            let keep = true;
            for (const root of rootPaths) {
                const absolutePath = await this.getAbsolutePathFromPattern(root, pattern);
                // undefined means the pattern cannot be converted into an absolute path
                if (absolutePath) {
                    resolvedPaths.add(absolutePath);
                    keep = false;
                }
            }
            if (keep) {
                include.push(pattern);
            }
        }
        options.include = include;
        return resolvedPaths.size > 0
            ? Array.from(resolvedPaths)
            : rootPaths;
    }
    /**
     * Transform include/exclude option patterns from relative patterns to absolute patterns.
     * E.g. './abc/foo.*' to '${root}/abc/foo.*', the transformation does not validate the
     * pattern against the file system as glob suffixes remain.
     *
     * @returns undefined if the pattern cannot be converted into an absolute path.
     */
    async getAbsolutePathFromPattern(root, pattern) {
        pattern = pattern.replace(/\\/g, '/');
        // The pattern is not referring to a single file or folder, i.e. not to be converted
        if (!path.isAbsolute(pattern) && !pattern.startsWith('./')) {
            return undefined;
        }
        // remove the `/**` suffix if present
        if (pattern.endsWith('/**')) {
            pattern = pattern.substring(0, pattern.length - 3);
        }
        // if `pattern` is absolute then `root` will be ignored by `path.resolve()`
        const targetPath = path.resolve(root, pattern);
        if (await fs.pathExists(targetPath)) {
            return targetPath;
        }
        return undefined;
    }
    /**
     * Returns the root folder uri that a file belongs to.
     * In case that a file belongs to more than one root folders, returns the root folder that is closest to the file.
     * If the file is not from the current workspace, returns empty string.
     * @param filePath string path of the file
     * @param rootUris string URIs of the root folders in the current workspace
     */
    getRoot(filePath, rootUris) {
        const roots = rootUris.filter(root => new uri_1.default(root).withScheme('file').isEqualOrParent(file_uri_1.FileUri.create(filePath).withScheme('file')));
        if (roots.length > 0) {
            return file_uri_1.FileUri.create(file_uri_1.FileUri.fsPath(roots.sort((r1, r2) => r2.length - r1.length)[0]));
        }
        return new uri_1.default();
    }
    // Cancel an ongoing search.  Trying to cancel a search that doesn't exist isn't an
    // error, otherwise we'd have to deal with race conditions, where a client cancels a
    // search that finishes normally at the same time.
    cancel(searchId) {
        const process = this.ongoingSearches.get(searchId);
        if (process) {
            process.kill();
            this.wrapUpSearch(searchId);
        }
        return Promise.resolve();
    }
    // Send onDone to the client and clean up what we know about search searchId.
    wrapUpSearch(searchId, error) {
        if (this.ongoingSearches.delete(searchId)) {
            if (this.client) {
                this.logger.debug('Sending onDone for ' + searchId, error);
                this.client.onDone(searchId, error);
            }
            else {
                this.logger.debug('Wrapping up search ' + searchId + ' but no client');
            }
        }
        else {
            this.logger.debug("Trying to wrap up a search we don't know about " + searchId);
        }
    }
    dispose() {
    }
};
__decorate([
    (0, inversify_1.inject)(exports.RgPath),
    __metadata("design:type", String)
], RipgrepSearchInWorkspaceServer.prototype, "rgPath", void 0);
RipgrepSearchInWorkspaceServer = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(core_1.ILogger)),
    __param(1, (0, inversify_1.inject)(node_1.RawProcessFactory)),
    __metadata("design:paramtypes", [Object, Function])
], RipgrepSearchInWorkspaceServer);
exports.RipgrepSearchInWorkspaceServer = RipgrepSearchInWorkspaceServer;
//# sourceMappingURL=ripgrep-search-in-workspace-server.js.map