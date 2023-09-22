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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiffComputer = void 0;
const jsdiff = require("diff");
class DiffComputer {
    computeDiff(previous, current) {
        const diffResult = diffArrays(previous, current);
        return diffResult;
    }
    computeDirtyDiff(previous, current) {
        const added = [];
        const removed = [];
        const modified = [];
        const changes = this.computeDiff(previous, current);
        let lastLine = -1;
        for (let i = 0; i < changes.length; i++) {
            const change = changes[i];
            const next = changes[i + 1];
            if (change.added) {
                // case: addition
                const start = lastLine + 1;
                const end = lastLine + change.count;
                added.push({ start, end });
                lastLine = end;
            }
            else if (change.removed && next && next.added) {
                const isFirstChange = i === 0;
                const isLastChange = i === changes.length - 2;
                const isNextEmptyLine = next.value.length > 0 && current[next.value[0]].length === 0;
                const isPrevEmptyLine = change.value.length > 0 && previous[change.value[0]].length === 0;
                if (isFirstChange && isNextEmptyLine) {
                    // special case: removing at the beginning
                    removed.push(0);
                }
                else if (isFirstChange && isPrevEmptyLine) {
                    // special case: adding at the beginning
                    const start = 0;
                    const end = next.count - 1;
                    added.push({ start, end });
                    lastLine = end;
                }
                else if (isLastChange && isNextEmptyLine) {
                    removed.push(lastLine + 1 /* = empty line */);
                }
                else {
                    // default case is a modification
                    const start = lastLine + 1;
                    const end = lastLine + next.count;
                    modified.push({ start, end });
                    lastLine = end;
                }
                i++; // consume next eagerly
            }
            else if (change.removed && !(next && next.added)) {
                removed.push(Math.max(0, lastLine));
            }
            else {
                lastLine += change.count;
            }
        }
        return { added, removed, modified };
    }
}
exports.DiffComputer = DiffComputer;
class ArrayDiff extends jsdiff.Diff {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tokenize(value) {
        return value;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    join(value) {
        return value;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    removeEmpty(value) {
        return value;
    }
}
const arrayDiff = new ArrayDiff();
/**
 * Computes diff without copying data.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function diffArrays(oldArr, newArr) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return arrayDiff.diff(oldArr, newArr);
}
//# sourceMappingURL=diff-computer.js.map