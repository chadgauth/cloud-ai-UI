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
exports.FileChangeCollection = void 0;
/**
 * A file change collection guarantees that only one change is reported for each URI.
 *
 * Changes are normalized according following rules:
 * - ADDED + ADDED => ADDED
 * - ADDED + UPDATED => ADDED
 * - ADDED + DELETED => [ADDED, DELETED]
 * - UPDATED + ADDED => UPDATED
 * - UPDATED + UPDATED => UPDATED
 * - UPDATED + DELETED => DELETED
 * - DELETED + ADDED => UPDATED
 * - DELETED + UPDATED => UPDATED
 * - DELETED + DELETED => DELETED
 */
class FileChangeCollection {
    constructor() {
        this.changes = new Map();
    }
    push(change) {
        const changes = this.changes.get(change.uri) || [];
        this.normalize(changes, change);
        this.changes.set(change.uri, changes);
    }
    normalize(changes, change) {
        let currentType;
        let nextType = change.type;
        do {
            const current = changes.pop();
            currentType = current && current.type;
            nextType = this.reduce(currentType, nextType);
        } while (!Array.isArray(nextType) && currentType !== undefined && currentType !== nextType);
        const uri = change.uri;
        if (Array.isArray(nextType)) {
            changes.push(...nextType.map(type => ({ uri, type })));
        }
        else {
            changes.push({ uri, type: nextType });
        }
    }
    reduce(current, change) {
        if (current === undefined) {
            return change;
        }
        if (current === 1 /* ADDED */) {
            if (change === 2 /* DELETED */) {
                return [1 /* ADDED */, 2 /* DELETED */];
            }
            return 1 /* ADDED */;
        }
        if (change === 2 /* DELETED */) {
            return 2 /* DELETED */;
        }
        return 0 /* UPDATED */;
    }
    values() {
        return Array.from(this.changes.values()).reduce((acc, val) => acc.concat(val), []);
    }
}
exports.FileChangeCollection = FileChangeCollection;
//# sourceMappingURL=file-change-collection.js.map