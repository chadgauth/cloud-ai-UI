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
Object.defineProperty(exports, "__esModule", { value: true });
exports.codename = exports.signame = exports.parseArgs = void 0;
const core_1 = require("@theia/core");
const os = require("os");
const stringArgv = require('string-argv');
/**
 * Parses the given line into an array of args respecting escapes and string literals.
 * @param line the given line to parse
 */
function parseArgs(line) {
    if (line) {
        return stringArgv(line);
    }
    return [];
}
exports.parseArgs = parseArgs;
// Polyfill for Object.entries, until we upgrade to ES2017.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function objectEntries(obj) {
    const props = Object.keys(obj);
    const result = new Array(props.length);
    for (let i = 0; i < props.length; i++) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        result[i] = [props[i], obj[props[i]]];
    }
    return result;
}
/**
 * Convert a signal number to its short name (using the signal definitions of
 * the current host).  Should never be called on Windows.  For Linux, this is
 * only valid for the x86 and ARM architectures, since other architectures may
 * use different numbers, see signal(7).
 */
function signame(sig) {
    // We should never reach this on Windows, since signals are not a thing
    // there.
    if (core_1.isWindows) {
        throw new Error('Trying to get a signal name on Windows.');
    }
    for (const entry of objectEntries(os.constants.signals)) {
        if (entry[1] === sig) {
            return entry[0];
        }
    }
    // Don't know this signal?  Return the number as a string.
    return sig.toString(10);
}
exports.signame = signame;
/**
 * Convert a code number to its short name
 */
function codename(code) {
    for (const entry of objectEntries(os.constants.errno)) {
        if (entry[1] === code) {
            return entry[0];
        }
    }
    // Return the number as string if we did not find a name for it.
    return code.toString(10);
}
exports.codename = codename;
//# sourceMappingURL=utils.js.map