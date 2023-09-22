"use strict";
// *****************************************************************************
// Copyright (C) 2020 Red Hat, Inc. and others.
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
exports.score = void 0;
const glob_1 = require("@theia/core/lib/common/glob");
function score(selector, uriScheme, path, candidateLanguage, candidateIsSynchronized) {
    if (Array.isArray(selector)) {
        let ret = 0;
        for (const filter of selector) {
            const value = score(filter, uriScheme, path, candidateLanguage, candidateIsSynchronized);
            if (value === 10) {
                return value;
            }
            if (value > ret) {
                ret = value;
            }
        }
        return ret;
    }
    else if (typeof selector === 'string') {
        if (!candidateIsSynchronized) {
            return 0;
        }
        if (selector === '*') {
            return 5;
        }
        else if (selector === candidateLanguage) {
            return 10;
        }
        else {
            return 0;
        }
    }
    else if (selector) {
        const { language, pattern, scheme, hasAccessToAllModels } = selector;
        if (!candidateIsSynchronized && !hasAccessToAllModels) {
            return 0;
        }
        let result = 0;
        if (scheme) {
            if (scheme === uriScheme) {
                result = 10;
            }
            else if (scheme === '*') {
                result = 5;
            }
            else {
                return 0;
            }
        }
        if (language) {
            if (language === candidateLanguage) {
                result = 10;
            }
            else if (language === '*') {
                result = Math.max(result, 5);
            }
            else {
                return 0;
            }
        }
        if (pattern) {
            if (pattern === path || (0, glob_1.match)(pattern, path)) {
                result = 10;
            }
            else {
                return 0;
            }
        }
        return result;
    }
    else {
        return 0;
    }
}
exports.score = score;
//# sourceMappingURL=language-selector.js.map