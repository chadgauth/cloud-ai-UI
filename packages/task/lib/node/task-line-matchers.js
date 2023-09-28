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
exports.WatchModeLineMatcher = exports.StartStopLineMatcher = void 0;
const task_abstract_line_matcher_1 = require("./task-abstract-line-matcher");
class StartStopLineMatcher extends task_abstract_line_matcher_1.AbstractLineMatcher {
    constructor(matcher) {
        super(matcher);
    }
    /**
     * Finds the problem identified by this line matcher.
     *
     * @param line the line of text to find the problem from
     * @return the identified problem. If the problem is not found, `undefined` is returned.
     */
    match(line) {
        if (!this.activePattern) {
            this.resetActivePatternIndex();
        }
        if (this.activePattern) {
            const originalProblemData = Object.assign(this.getEmptyProblemData(), this.cachedProblemData);
            const foundMatch = this.doOneLineMatch(line);
            if (foundMatch) {
                if (this.isUsingTheLastPattern()) {
                    const matchResult = this.getMarkerMatch(this.cachedProblemData);
                    if (this.isLastPatternLoop()) {
                        this.cachedProblemData = originalProblemData;
                    }
                    else {
                        this.resetCachedProblemData();
                        this.resetActivePatternIndex();
                    }
                    return matchResult;
                }
                else {
                    this.nextProblemPattern();
                }
            }
            else {
                this.resetCachedProblemData();
                if (this.activePatternIndex !== 0) { // if no match, use the first pattern to parse the same line
                    this.resetActivePatternIndex();
                    return this.match(line);
                }
            }
        }
        return undefined;
    }
}
exports.StartStopLineMatcher = StartStopLineMatcher;
class WatchModeLineMatcher extends StartStopLineMatcher {
    constructor(matcher) {
        super(matcher);
        this.activeOnStart = false;
        this.beginsPattern = matcher.watching.beginsPattern;
        this.endsPattern = matcher.watching.endsPattern;
        this.activeOnStart = matcher.watching.activeOnStart === true;
        this.resetActivePatternIndex(this.activeOnStart ? 0 : -1);
    }
    /**
     * Finds the problem identified by this line matcher.
     *
     * @param line the line of text to find the problem from
     * @return the identified problem. If the problem is not found, `undefined` is returned.
     */
    match(line) {
        if (this.activeOnStart) {
            this.activeOnStart = false;
            this.resetActivePatternIndex(0);
            this.resetCachedProblemData();
            return super.match(line);
        }
        if (this.matchBegin(line)) {
            const beginsPatternMatch = this.getMarkerMatch(this.cachedProblemData);
            this.resetCachedProblemData();
            return beginsPatternMatch;
        }
        if (this.matchEnd(line)) {
            this.resetCachedProblemData();
            return undefined;
        }
        if (this.activePattern) {
            return super.match(line);
        }
        return undefined;
    }
    matchBegin(line) {
        const beginRegexp = new RegExp(this.beginsPattern.regexp);
        const regexMatches = beginRegexp.exec(line);
        if (regexMatches) {
            this.fillProblemData(this.cachedProblemData, this.beginsPattern, regexMatches);
            this.resetActivePatternIndex(0);
            return true;
        }
        return false;
    }
    matchEnd(line) {
        const endRegexp = new RegExp(this.endsPattern.regexp);
        const match = endRegexp.exec(line);
        if (match) {
            this.resetActivePatternIndex(-1);
            return true;
        }
        return false;
    }
}
exports.WatchModeLineMatcher = WatchModeLineMatcher;
//# sourceMappingURL=task-line-matchers.js.map