"use strict";
// *****************************************************************************
// Copyright (C) 2023 Ericsson and others.
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSystemLockingImpl = exports.FileSystemLocking = void 0;
const async_mutex_1 = require("async-mutex");
const inversify_1 = require("inversify");
const path = require("path");
exports.FileSystemLocking = Symbol('FileSystemLocking');
let FileSystemLockingImpl = class FileSystemLockingImpl {
    lockPath(lockPath, transaction, thisArg) {
        const resolvedLockPath = this.resolveLockPath(lockPath);
        return this.getLock(resolvedLockPath).runExclusive(async () => transaction.call(thisArg, resolvedLockPath));
    }
    resolveLockPath(lockPath) {
        // try to normalize the path to avoid two paths pointing to the same file
        return path.resolve(lockPath);
    }
    getLocks() {
        var _a;
        var _b;
        const kLocks = Symbol.for('FileSystemLockingImpl.Locks');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (_a = (_b = globalThis)[kLocks]) !== null && _a !== void 0 ? _a : (_b[kLocks] = this.initializeLocks());
    }
    initializeLocks() {
        const locks = new Map();
        const cleanup = setInterval(() => this.cleanupLocks(locks), 60000);
        process.once('beforeExit', () => clearInterval(cleanup));
        return locks;
    }
    cleanupLocks(locks) {
        locks.forEach((lock, lockPath) => {
            if (!lock.isLocked()) {
                locks.delete(lockPath);
            }
        });
    }
    getLock(lockPath) {
        const locks = this.getLocks();
        let lock = locks.get(lockPath);
        if (!lock) {
            locks.set(lockPath, lock = new async_mutex_1.Mutex());
        }
        return lock;
    }
};
FileSystemLockingImpl = __decorate([
    (0, inversify_1.injectable)()
], FileSystemLockingImpl);
exports.FileSystemLockingImpl = FileSystemLockingImpl;
//# sourceMappingURL=filesystem-locking.js.map