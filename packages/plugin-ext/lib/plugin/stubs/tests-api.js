"use strict";
// *****************************************************************************
// Copyright (C) 2022 Ericsson and others.
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
exports.createTestItem = exports.testItemCollection = exports.createTestRun = exports.createRunProfile = void 0;
/* tslint:disable:typedef */
const cancellation_1 = require("@theia/core/lib/common/cancellation");
const createRunProfile = (label, kind, runHandler, isDefault, tag, supportsContinuousRun) => ({
    label,
    kind,
    isDefault: isDefault !== null && isDefault !== void 0 ? isDefault : false,
    tag,
    supportsContinuousRun: supportsContinuousRun !== null && supportsContinuousRun !== void 0 ? supportsContinuousRun : false,
    runHandler,
    configureHandler: undefined,
    dispose: () => undefined,
});
exports.createRunProfile = createRunProfile;
const createTestRun = (request, name, persist) => ({
    name,
    token: cancellation_1.CancellationToken.None,
    isPersisted: false,
    enqueued: (test) => undefined,
    started: (test) => undefined,
    skipped: (test) => undefined,
    failed: (test, message, duration) => undefined,
    errored: (test, message, duration) => undefined,
    passed: (test, duration) => undefined,
    appendOutput: (output, location, test) => undefined,
    end: () => undefined,
});
exports.createTestRun = createTestRun;
exports.testItemCollection = {
    add: () => { },
    delete: () => { },
    forEach: () => { },
    *[Symbol.iterator]() { },
    get: () => undefined,
    replace: () => { },
    size: 0,
};
const createTestItem = (id, label, uri) => ({
    id,
    label,
    uri,
    children: exports.testItemCollection,
    parent: undefined,
    tags: [],
    canResolveChildren: false,
    busy: false,
    range: undefined,
    error: undefined,
});
exports.createTestItem = createTestItem;
//# sourceMappingURL=tests-api.js.map