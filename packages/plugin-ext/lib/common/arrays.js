"use strict";
// *****************************************************************************
// Copyright (C) 2020 TypeFox and others.
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
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// based on https://github.com/microsoft/vscode/blob/04c36be045a94fee58e5f8992d3e3fd980294a84/src/vs/base/common/arrays.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.isReadonlyArray = exports.flatten = exports.isNonEmptyArray = exports.coalesce = void 0;
/**
 * @returns New array with all falsy values removed. The original array IS NOT modified.
 */
function coalesce(array) {
    return array.filter(e => !!e);
}
exports.coalesce = coalesce;
function isNonEmptyArray(obj) {
    return Array.isArray(obj) && obj.length > 0;
}
exports.isNonEmptyArray = isNonEmptyArray;
function flatten(arr) {
    return [].concat(...arr);
}
exports.flatten = flatten;
/**
 * @returns 'true' if the 'arg' is a 'ReadonlyArray'.
 */
function isReadonlyArray(arg) {
    // Since Typescript does not properly narrow down typings for 'ReadonlyArray' we need to help it.
    return Array.isArray(arg);
}
exports.isReadonlyArray = isReadonlyArray;
//# sourceMappingURL=arrays.js.map