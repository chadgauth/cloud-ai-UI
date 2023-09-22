"use strict";
// *****************************************************************************
// Copyright (C) 2020 Alibaba Inc. and others.
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
exports.PseudoPty = void 0;
const core_1 = require("@theia/core");
class PseudoPty {
    constructor() {
        this.pid = -1;
        this.cols = -1;
        this.rows = -1;
        this.process = '';
        this.handleFlowControl = false;
        this.onData = core_1.Event.None;
        this.onExit = core_1.Event.None;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    on(event, listener) { }
    resize(columns, rows) { }
    write(data) { }
    kill(signal) { }
    pause() { }
    resume() { }
}
exports.PseudoPty = PseudoPty;
//# sourceMappingURL=pseudo-pty.js.map