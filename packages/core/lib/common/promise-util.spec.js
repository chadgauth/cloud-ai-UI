"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// *****************************************************************************
// Copyright (C) 2021 Red Hat and others.
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
const assert = require("assert/strict");
const promise_util_1 = require("./promise-util");
const event_1 = require("./event");
const cancellation_1 = require("./cancellation");
describe('promise-util', () => {
    describe('waitForEvent', () => {
        it('should time out', async () => {
            const emitter = new event_1.Emitter();
            await assert.rejects((0, promise_util_1.waitForEvent)(emitter.event, 1000), reason => reason instanceof cancellation_1.CancellationError);
        });
        it('should get event', async () => {
            const emitter = new event_1.Emitter();
            setTimeout(() => {
                emitter.fire('abcd');
            }, 500);
            assert.strictEqual(await (0, promise_util_1.waitForEvent)(emitter.event, 1000), 'abcd');
        });
    });
    describe('firstTrue', () => {
        it('should resolve to false when the promises arg is empty', async () => {
            const actual = await (0, promise_util_1.firstTrue)();
            assert.strictEqual(actual, false);
        });
        it('should resolve to true when the first promise resolves to true', async () => {
            const signals = [];
            const createPromise = (signal, timeout, result) => new Promise(resolve => setTimeout(() => {
                signals.push(signal);
                resolve(result);
            }, timeout));
            const actual = await (0, promise_util_1.firstTrue)(createPromise('a', 10, false), createPromise('b', 20, false), createPromise('c', 30, true), createPromise('d', 40, false), createPromise('e', 50, true));
            assert.strictEqual(actual, true);
            assert.deepStrictEqual(signals, ['a', 'b', 'c']);
        });
        it('should reject when one of the promises rejects', async () => {
            await assert.rejects((0, promise_util_1.firstTrue)(new Promise(resolve => setTimeout(() => resolve(false), 10)), new Promise(resolve => setTimeout(() => resolve(false), 20)), new Promise((_, reject) => setTimeout(() => reject(new Error('my test error')), 30)), new Promise(resolve => setTimeout(() => resolve(true), 40))), /Error: my test error/);
        });
    });
});
//# sourceMappingURL=promise-util.spec.js.map