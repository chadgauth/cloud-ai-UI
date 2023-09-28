"use strict";
// *****************************************************************************
// Copyright (C) 2017 Ericsson and others.
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
exports.TerminalWatcher = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const event_1 = require("@theia/core/lib/common/event");
let TerminalWatcher = class TerminalWatcher {
    constructor() {
        this.onTerminalExitEmitter = new event_1.Emitter();
        this.onTerminalErrorEmitter = new event_1.Emitter();
        this.onStoreTerminalEnvVariablesRequestedEmitter = new event_1.Emitter();
        this.onUpdateTerminalEnvVariablesRequestedEmitter = new event_1.Emitter();
    }
    getTerminalClient() {
        const exitEmitter = this.onTerminalExitEmitter;
        const errorEmitter = this.onTerminalErrorEmitter;
        const storeTerminalEnvVariablesEmitter = this.onStoreTerminalEnvVariablesRequestedEmitter;
        const updateTerminalEnvVariablesEmitter = this.onUpdateTerminalEnvVariablesRequestedEmitter;
        return {
            storeTerminalEnvVariables(data) {
                storeTerminalEnvVariablesEmitter.fire(data);
            },
            updateTerminalEnvVariables() {
                updateTerminalEnvVariablesEmitter.fire(undefined);
            },
            onTerminalExitChanged(event) {
                exitEmitter.fire(event);
            },
            onTerminalError(event) {
                errorEmitter.fire(event);
            }
        };
    }
    get onTerminalExit() {
        return this.onTerminalExitEmitter.event;
    }
    get onTerminalError() {
        return this.onTerminalErrorEmitter.event;
    }
    get onStoreTerminalEnvVariablesRequested() {
        return this.onStoreTerminalEnvVariablesRequestedEmitter.event;
    }
    get onUpdateTerminalEnvVariablesRequested() {
        return this.onUpdateTerminalEnvVariablesRequestedEmitter.event;
    }
};
TerminalWatcher = __decorate([
    (0, inversify_1.injectable)()
], TerminalWatcher);
exports.TerminalWatcher = TerminalWatcher;
//# sourceMappingURL=terminal-watcher.js.map