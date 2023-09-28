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
const assert = require("assert");
const file_uri_1 = require("@theia/core/lib/node/file-uri");
const file_change_collection_1 = require("./file-change-collection");
describe('FileChangeCollection', () => {
    assertChanges({
        changes: [1 /* ADDED */, 1 /* ADDED */],
        expected: 1 /* ADDED */
    });
    assertChanges({
        changes: [1 /* ADDED */, 0 /* UPDATED */],
        expected: 1 /* ADDED */
    });
    assertChanges({
        changes: [1 /* ADDED */, 2 /* DELETED */],
        expected: [1 /* ADDED */, 2 /* DELETED */]
    });
    assertChanges({
        changes: [0 /* UPDATED */, 1 /* ADDED */],
        expected: 0 /* UPDATED */
    });
    assertChanges({
        changes: [0 /* UPDATED */, 0 /* UPDATED */],
        expected: 0 /* UPDATED */
    });
    assertChanges({
        changes: [0 /* UPDATED */, 2 /* DELETED */],
        expected: 2 /* DELETED */
    });
    assertChanges({
        changes: [2 /* DELETED */, 1 /* ADDED */],
        expected: 0 /* UPDATED */
    });
    assertChanges({
        changes: [2 /* DELETED */, 0 /* UPDATED */],
        expected: 0 /* UPDATED */
    });
    assertChanges({
        changes: [2 /* DELETED */, 2 /* DELETED */],
        expected: 2 /* DELETED */
    });
    assertChanges({
        changes: [1 /* ADDED */, 0 /* UPDATED */, 2 /* DELETED */],
        expected: [1 /* ADDED */, 2 /* DELETED */]
    });
    assertChanges({
        changes: [1 /* ADDED */, 0 /* UPDATED */, 2 /* DELETED */, 1 /* ADDED */],
        expected: [1 /* ADDED */]
    });
    assertChanges({
        changes: [1 /* ADDED */, 0 /* UPDATED */, 2 /* DELETED */, 0 /* UPDATED */],
        expected: [1 /* ADDED */]
    });
    assertChanges({
        changes: [1 /* ADDED */, 0 /* UPDATED */, 2 /* DELETED */, 2 /* DELETED */],
        expected: [1 /* ADDED */, 2 /* DELETED */]
    });
    function assertChanges({ changes, expected }) {
        const expectedTypes = Array.isArray(expected) ? expected : [expected];
        const expectation = expectedTypes.map(type => typeAsString(type)).join(' + ');
        it(`${changes.map(type => typeAsString(type)).join(' + ')} => ${expectation}`, () => {
            const collection = new file_change_collection_1.FileChangeCollection();
            const uri = file_uri_1.FileUri.create('/root/foo/bar.txt').toString();
            for (const type of changes) {
                collection.push({ uri, type });
            }
            const actual = collection.values().map(({ type }) => typeAsString(type)).join(' + ');
            assert.deepStrictEqual(expectation, actual);
        });
    }
    function typeAsString(type) {
        return type === 0 /* UPDATED */ ? 'UPDATED' : type === 1 /* ADDED */ ? 'ADDED' : 'DELETED';
    }
});
//# sourceMappingURL=file-change-collection.spec.js.map