"use strict";
// *****************************************************************************
// Copyright (C) 2021 Red Hat, Inc. and others.
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
exports.join = exports.normalize = void 0;
const separator = '/';
function normalize(path) {
    if (!path || path.length === 0) {
        return '.';
    }
    const isAbsolute = path.charCodeAt(0) === 47;
    const trailingSlash = path.charCodeAt(path.length - 1) === 47;
    const parts = path.split(separator);
    const result = [];
    for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        if (p === '') {
            continue;
        }
        if (p === '..') {
            result.pop();
            continue;
        }
        result.push(p);
    }
    if (result.length === 0) {
        return '.';
    }
    path = result.join(separator);
    if (isAbsolute) {
        path = '/' + path;
    }
    if (trailingSlash) {
        path += '/';
    }
    return path;
}
exports.normalize = normalize;
function join(...paths) {
    if (paths.length === 0) {
        return '.';
    }
    const path = paths.join(separator);
    return normalize(path);
}
exports.join = join;
//# sourceMappingURL=path.js.map