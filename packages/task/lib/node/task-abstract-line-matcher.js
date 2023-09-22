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
exports.AbstractLineMatcher = void 0;
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const os_1 = require("@theia/core/lib/common/os");
const vscode_languageserver_protocol_1 = require("@theia/core/shared/vscode-languageserver-protocol");
const problem_matcher_protocol_1 = require("../common/problem-matcher-protocol");
const uri_1 = require("@theia/core/lib/common/uri");
const severity_1 = require("@theia/core/lib/common/severity");
const numbers_1 = require("@theia/core/lib/common/numbers");
const path_1 = require("path");
const endOfLine = os_1.EOL;
class AbstractLineMatcher {
    constructor(matcher) {
        this.matcher = matcher;
        this.patterns = [];
        this.activePatternIndex = 0;
        if (Array.isArray(matcher.pattern)) {
            this.patterns = matcher.pattern;
        }
        else {
            this.patterns = [matcher.pattern];
        }
        this.cachedProblemData = this.getEmptyProblemData();
        if (this.patterns.slice(0, this.patternCount - 1).some(p => !!p.loop)) {
            console.error('Problem Matcher: Only the last pattern can loop');
        }
    }
    /**
     * Number of problem patterns that the line matcher uses.
     */
    get patternCount() {
        return this.patterns.length;
    }
    getEmptyProblemData() {
        // eslint-disable-next-line no-null/no-null
        return Object.create(null);
    }
    fillProblemData(data, pattern, matches) {
        if (data) {
            this.fillProperty(data, 'file', pattern, matches, true);
            this.appendProperty(data, 'message', pattern, matches, true);
            this.fillProperty(data, 'code', pattern, matches, true);
            this.fillProperty(data, 'severity', pattern, matches, true);
            this.fillProperty(data, 'location', pattern, matches, true);
            this.fillProperty(data, 'line', pattern, matches);
            this.fillProperty(data, 'character', pattern, matches);
            this.fillProperty(data, 'endLine', pattern, matches);
            this.fillProperty(data, 'endCharacter', pattern, matches);
            return true;
        }
        return false;
    }
    appendProperty(data, property, pattern, matches, trim = false) {
        const patternProperty = pattern[property];
        if (data[property] === undefined) {
            this.fillProperty(data, property, pattern, matches, trim);
        }
        else if (patternProperty !== undefined && patternProperty < matches.length) {
            let value = matches[patternProperty];
            if (trim) {
                value = value.trim();
            }
            data[property] += endOfLine + value;
        }
    }
    fillProperty(data, property, pattern, matches, trim = false) {
        const patternAtProperty = pattern[property];
        if (data[property] === undefined && patternAtProperty !== undefined && patternAtProperty < matches.length) {
            let value = matches[patternAtProperty];
            if (value !== undefined) {
                if (trim) {
                    value = value.trim();
                }
                data[property] = value;
            }
        }
    }
    getMarkerMatch(data) {
        try {
            const location = this.getLocation(data);
            if (data.file && location && data.message) {
                const marker = {
                    severity: this.getSeverity(data),
                    range: location,
                    message: data.message
                };
                if (data.code !== undefined) {
                    marker.code = data.code;
                }
                if (this.matcher.source !== undefined) {
                    marker.source = this.matcher.source;
                }
                return {
                    description: this.matcher,
                    resource: this.getResource(data.file, this.matcher),
                    marker
                };
            }
            return {
                description: this.matcher
            };
        }
        catch (err) {
            console.error(`Failed to convert problem data into match: ${JSON.stringify(data)}`);
        }
        return undefined;
    }
    getLocation(data) {
        if (data.kind === problem_matcher_protocol_1.ProblemLocationKind.File) {
            return this.createRange(0, 0, 0, 0);
        }
        if (data.location) {
            return this.parseLocationInfo(data.location);
        }
        if (!data.line) {
            // eslint-disable-next-line no-null/no-null
            return null;
        }
        const startLine = parseInt(data.line);
        const startColumn = data.character ? parseInt(data.character) : undefined;
        const endLine = data.endLine ? parseInt(data.endLine) : undefined;
        const endColumn = data.endCharacter ? parseInt(data.endCharacter) : undefined;
        return this.createRange(startLine, startColumn, endLine, endColumn);
    }
    parseLocationInfo(value) {
        if (!value || !value.match(/(\d+|\d+,\d+|\d+,\d+,\d+,\d+)/)) {
            // eslint-disable-next-line no-null/no-null
            return null;
        }
        const parts = value.split(',');
        const startLine = parseInt(parts[0]);
        const startColumn = parts.length > 1 ? parseInt(parts[1]) : undefined;
        if (parts.length > 3) {
            return this.createRange(startLine, startColumn, parseInt(parts[2]), parseInt(parts[3]));
        }
        else {
            return this.createRange(startLine, startColumn, undefined, undefined);
        }
    }
    createRange(startLine, startColumn, endLine, endColumn) {
        let range;
        if (startColumn !== undefined) {
            if (endColumn !== undefined) {
                range = vscode_languageserver_protocol_1.Range.create(startLine, startColumn, endLine || startLine, endColumn);
            }
            else {
                range = vscode_languageserver_protocol_1.Range.create(startLine, startColumn, startLine, startColumn);
            }
        }
        else {
            range = vscode_languageserver_protocol_1.Range.create(startLine, 1, startLine, numbers_1.MAX_SAFE_INTEGER);
        }
        // range indexes should be zero-based
        return vscode_languageserver_protocol_1.Range.create(this.getZeroBasedRangeIndex(range.start.line), this.getZeroBasedRangeIndex(range.start.character), this.getZeroBasedRangeIndex(range.end.line), this.getZeroBasedRangeIndex(range.end.character));
    }
    getZeroBasedRangeIndex(ind) {
        return ind === 0 ? ind : ind - 1;
    }
    getSeverity(data) {
        // eslint-disable-next-line no-null/no-null
        let result = null;
        if (data.severity) {
            const value = data.severity;
            if (value) {
                result = severity_1.Severity.fromValue(value);
                if (result === severity_1.Severity.Ignore) {
                    if (value === 'E') {
                        result = severity_1.Severity.Error;
                    }
                    else if (value === 'W') {
                        result = severity_1.Severity.Warning;
                    }
                    else if (value === 'I') {
                        result = severity_1.Severity.Info;
                    }
                    else if (value.toLowerCase() === 'hint') {
                        result = severity_1.Severity.Info;
                    }
                    else if (value.toLowerCase() === 'note') {
                        result = severity_1.Severity.Info;
                    }
                }
            }
        }
        // eslint-disable-next-line no-null/no-null
        if (result === null || result === severity_1.Severity.Ignore) {
            result = this.matcher.severity || severity_1.Severity.Error;
        }
        return severity_1.Severity.toDiagnosticSeverity(result);
    }
    getResource(filename, matcher) {
        const kind = matcher.fileLocation;
        let fullPath;
        if (kind === problem_matcher_protocol_1.FileLocationKind.Absolute) {
            fullPath = filename;
        }
        else if ((kind === problem_matcher_protocol_1.FileLocationKind.Relative) && matcher.filePrefix) {
            let relativeFileName = filename.replace(/\\/g, '/');
            if (relativeFileName.startsWith('./')) {
                relativeFileName = relativeFileName.slice(2);
            }
            fullPath = (0, path_1.join)(matcher.filePrefix, relativeFileName);
        }
        if (fullPath === undefined) {
            throw new Error('FileLocationKind is not actionable. Does the matcher have a filePrefix? This should never happen.');
        }
        if (matcher.uriProvider !== undefined) {
            return matcher.uriProvider(fullPath);
        }
        else {
            return uri_1.default.fromFilePath(fullPath);
        }
    }
    resetActivePatternIndex(defaultIndex) {
        if (defaultIndex === undefined) {
            defaultIndex = 0;
        }
        this.activePatternIndex = defaultIndex;
        this.activePattern = this.patterns[defaultIndex];
    }
    nextProblemPattern() {
        this.activePatternIndex++;
        if (this.activePatternIndex > this.patternCount - 1) {
            this.resetActivePatternIndex();
        }
        else {
            this.activePattern = this.patterns[this.activePatternIndex];
        }
    }
    doOneLineMatch(line) {
        var _a;
        var _b;
        if (this.activePattern) {
            const regexp = new RegExp(this.activePattern.regexp);
            const regexMatches = regexp.exec(line);
            if (regexMatches) {
                (_a = (_b = this.cachedProblemData).kind) !== null && _a !== void 0 ? _a : (_b.kind = this.activePattern.kind);
                return this.fillProblemData(this.cachedProblemData, this.activePattern, regexMatches);
            }
        }
        return false;
    }
    // check if active pattern is the last pattern
    isUsingTheLastPattern() {
        return this.patternCount > 0 && this.activePatternIndex === this.patternCount - 1;
    }
    isLastPatternLoop() {
        return this.patternCount > 0 && !!this.patterns[this.patternCount - 1].loop;
    }
    resetCachedProblemData() {
        this.cachedProblemData = this.getEmptyProblemData();
    }
}
exports.AbstractLineMatcher = AbstractLineMatcher;
//# sourceMappingURL=task-abstract-line-matcher.js.map