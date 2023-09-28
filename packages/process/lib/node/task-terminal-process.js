"use strict";
// *****************************************************************************
// Copyright (C) 2021 SAP SE or an SAP affiliate company and others.
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
exports.TaskTerminalProcess = exports.TaskTerminalProcessFactory = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const terminal_process_1 = require("./terminal-process");
exports.TaskTerminalProcessFactory = Symbol('TaskTerminalProcessFactory');
let TaskTerminalProcess = class TaskTerminalProcess extends terminal_process_1.TerminalProcess {
    constructor() {
        super(...arguments);
        this.exited = false;
        this.attachmentAttempted = false;
    }
    onTerminalExit(code, signal) {
        this.emitOnExit(code, signal);
        this.exited = true;
        // Unregister process only if task terminal already attached (or failed attach),
        // Fixes https://github.com/eclipse-theia/theia/issues/2961
        if (this.attachmentAttempted) {
            this.unregisterProcess();
        }
    }
};
TaskTerminalProcess = __decorate([
    (0, inversify_1.injectable)()
], TaskTerminalProcess);
exports.TaskTerminalProcess = TaskTerminalProcess;
//# sourceMappingURL=task-terminal-process.js.map