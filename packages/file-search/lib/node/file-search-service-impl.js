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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSearchServiceImpl = void 0;
const cp = require("child_process");
const fuzzy = require("@theia/core/shared/fuzzy");
const readline = require("readline");
const ripgrep_1 = require("@vscode/ripgrep");
const inversify_1 = require("@theia/core/shared/inversify");
const uri_1 = require("@theia/core/lib/common/uri");
const file_uri_1 = require("@theia/core/lib/node/file-uri");
const core_1 = require("@theia/core");
const node_1 = require("@theia/process/lib/node");
const file_search_service_1 = require("../common/file-search-service");
const path = require("path");
let FileSearchServiceImpl = class FileSearchServiceImpl {
    constructor(logger, 
    /** @deprecated since 1.7.0 */
    rawProcessFactory) {
        this.logger = logger;
        this.rawProcessFactory = rawProcessFactory;
    }
    async find(searchPattern, options, clientToken) {
        const cancellationSource = new core_1.CancellationTokenSource();
        if (clientToken) {
            clientToken.onCancellationRequested(() => cancellationSource.cancel());
        }
        const token = cancellationSource.token;
        const opts = {
            fuzzyMatch: true,
            limit: Number.MAX_SAFE_INTEGER,
            useGitIgnore: true,
            ...options
        };
        const roots = options.rootOptions || {};
        if (options.rootUris) {
            for (const rootUri of options.rootUris) {
                if (!roots[rootUri]) {
                    roots[rootUri] = {};
                }
            }
        }
        // eslint-disable-next-line guard-for-in
        for (const rootUri in roots) {
            const rootOptions = roots[rootUri];
            if (opts.includePatterns) {
                const includePatterns = rootOptions.includePatterns || [];
                rootOptions.includePatterns = [...includePatterns, ...opts.includePatterns];
            }
            if (opts.excludePatterns) {
                const excludePatterns = rootOptions.excludePatterns || [];
                rootOptions.excludePatterns = [...excludePatterns, ...opts.excludePatterns];
            }
            if (rootOptions.useGitIgnore === undefined) {
                rootOptions.useGitIgnore = opts.useGitIgnore;
            }
        }
        const exactMatches = new Set();
        const fuzzyMatches = new Set();
        if (core_1.isWindows) {
            // Allow users on Windows to search for paths using either forwards or backwards slash
            searchPattern = searchPattern.replace(/\//g, '\\');
        }
        const patterns = searchPattern.toLocaleLowerCase().trim().split(file_search_service_1.WHITESPACE_QUERY_SEPARATOR);
        await Promise.all(Object.keys(roots).map(async (root) => {
            try {
                const rootUri = new uri_1.default(root);
                const rootPath = file_uri_1.FileUri.fsPath(rootUri);
                const rootOptions = roots[root];
                await this.doFind(rootUri, rootOptions, candidate => {
                    // Convert OS-native candidate path to a file URI string
                    const fileUri = file_uri_1.FileUri.create(path.resolve(rootPath, candidate)).toString();
                    // Skip results that have already been matched.
                    if (exactMatches.has(fileUri) || fuzzyMatches.has(fileUri)) {
                        return;
                    }
                    // Determine if the candidate matches any of the patterns exactly or fuzzy
                    const candidatePattern = candidate.toLocaleLowerCase();
                    const patternExists = patterns.every(pattern => candidatePattern.indexOf(pattern) !== -1);
                    if (patternExists) {
                        exactMatches.add(fileUri);
                    }
                    else if (!searchPattern || searchPattern === '*') {
                        exactMatches.add(fileUri);
                    }
                    else {
                        const fuzzyPatternExists = patterns.every(pattern => fuzzy.test(pattern, candidate));
                        if (opts.fuzzyMatch && fuzzyPatternExists) {
                            fuzzyMatches.add(fileUri);
                        }
                    }
                    // Preemptively terminate the search when the list of exact matches reaches the limit.
                    if (exactMatches.size === opts.limit) {
                        cancellationSource.cancel();
                    }
                }, token);
            }
            catch (e) {
                console.error('Failed to search:', root, e);
            }
        }));
        if (clientToken && clientToken.isCancellationRequested) {
            return [];
        }
        // Return the list of results limited by the search limit.
        return [...exactMatches, ...fuzzyMatches].slice(0, opts.limit);
    }
    doFind(rootUri, options, accept, token) {
        return new Promise((resolve, reject) => {
            const cwd = file_uri_1.FileUri.fsPath(rootUri);
            const args = this.getSearchArgs(options);
            const ripgrep = cp.spawn(ripgrep_1.rgPath, args, { cwd });
            ripgrep.on('error', reject);
            ripgrep.on('exit', (code, signal) => {
                if (typeof code === 'number' && code !== 0) {
                    reject(new Error(`"${ripgrep_1.rgPath}" exited with code: ${code}`));
                }
                else if (typeof signal === 'string') {
                    reject(new Error(`"${ripgrep_1.rgPath}" was terminated by signal: ${signal}`));
                }
            });
            token.onCancellationRequested(() => {
                ripgrep.kill(); // most likely sends a signal.
                resolve(); // avoid rejecting for no good reason.
            });
            const lineReader = readline.createInterface({
                input: ripgrep.stdout,
                crlfDelay: Infinity,
            });
            lineReader.on('line', line => {
                if (!token.isCancellationRequested) {
                    accept(line);
                }
            });
            lineReader.on('close', () => resolve());
        });
    }
    getSearchArgs(options) {
        const args = ['--files', '--hidden', '--case-sensitive', '--no-require-git', '--no-config'];
        if (options.includePatterns) {
            for (const includePattern of options.includePatterns) {
                if (includePattern) {
                    args.push('--glob', includePattern);
                }
            }
        }
        if (options.excludePatterns) {
            for (const excludePattern of options.excludePatterns) {
                if (excludePattern) {
                    args.push('--glob', `!${excludePattern}`);
                }
            }
        }
        if (options.useGitIgnore) {
            // ripgrep follows `.gitignore` by default, but it doesn't exclude `.git`:
            args.push('--glob', '!.git');
        }
        else {
            args.push('--no-ignore');
        }
        return args;
    }
};
FileSearchServiceImpl = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(core_1.ILogger)),
    __param(1, (0, inversify_1.inject)(node_1.RawProcessFactory)),
    __metadata("design:paramtypes", [Object, Function])
], FileSearchServiceImpl);
exports.FileSearchServiceImpl = FileSearchServiceImpl;
//# sourceMappingURL=file-search-service-impl.js.map