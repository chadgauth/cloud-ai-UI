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
exports.ProblemCollector = void 0;
const problem_matcher_protocol_1 = require("../common/problem-matcher-protocol");
const task_line_matchers_1 = require("./task-line-matchers");
class ProblemCollector {
    constructor(problemMatchers) {
        this.problemMatchers = problemMatchers;
        this.lineMatchers = [];
        for (const matcher of problemMatchers) {
            if (problem_matcher_protocol_1.ProblemMatcher.isWatchModeWatcher(matcher)) {
                this.lineMatchers.push(new task_line_matchers_1.WatchModeLineMatcher(matcher));
            }
            else {
                this.lineMatchers.push(new task_line_matchers_1.StartStopLineMatcher(matcher));
            }
        }
    }
    processLine(line) {
        const markers = [];
        this.lineMatchers.forEach(lineMatcher => {
            const match = lineMatcher.match(line);
            if (match) {
                markers.push(match);
            }
        });
        return markers;
    }
    isTaskActiveOnStart() {
        const activeOnStart = this.lineMatchers.some(lineMatcher => (lineMatcher instanceof task_line_matchers_1.WatchModeLineMatcher) && lineMatcher.activeOnStart);
        return activeOnStart;
    }
    matchBeginMatcher(line) {
        const match = this.lineMatchers.some(lineMatcher => (lineMatcher instanceof task_line_matchers_1.WatchModeLineMatcher) && lineMatcher.matchBegin(line));
        return match;
    }
    matchEndMatcher(line) {
        const match = this.lineMatchers.some(lineMatcher => (lineMatcher instanceof task_line_matchers_1.WatchModeLineMatcher) && lineMatcher.matchEnd(line));
        return match;
    }
}
exports.ProblemCollector = ProblemCollector;
//# sourceMappingURL=task-problem-collector.js.map