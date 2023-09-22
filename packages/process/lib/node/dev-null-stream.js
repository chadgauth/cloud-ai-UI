"use strict";
// *****************************************************************************
// Copyright (C) 2019 Ericsson and others.
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
exports.DevNullStream = void 0;
const stream = require("stream");
/**
 * A Node stream like `/dev/null`.
 *
 * Writing goes to a black hole, reading returns `EOF`.
 */
class DevNullStream extends stream.Duplex {
    constructor(options = {}) {
        super();
        if (options.autoDestroy) {
            this.destroy();
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _write(chunk, encoding, callback) {
        callback();
    }
    _read(size) {
        // eslint-disable-next-line no-null/no-null
        this.push(null);
    }
}
exports.DevNullStream = DevNullStream;
//# sourceMappingURL=dev-null-stream.js.map