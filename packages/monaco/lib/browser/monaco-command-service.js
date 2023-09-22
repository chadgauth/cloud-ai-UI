"use strict";
// *****************************************************************************
// Copyright (C) 2017 TypeFox and others.
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonacoCommandService = exports.MonacoCommandServiceFactory = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const command_1 = require("@theia/core/lib/common/command");
const event_1 = require("@theia/core/lib/common/event");
const disposable_1 = require("@theia/core/lib/common/disposable");
exports.MonacoCommandServiceFactory = Symbol('MonacoCommandServiceFactory');
let MonacoCommandService = class MonacoCommandService {
    constructor(commandRegistry) {
        this.commandRegistry = commandRegistry;
        this.onWillExecuteCommandEmitter = new event_1.Emitter();
        this.onDidExecuteCommandEmitter = new event_1.Emitter();
        this.toDispose = new disposable_1.DisposableCollection(this.onWillExecuteCommandEmitter, this.onDidExecuteCommandEmitter);
        this.delegateListeners = new disposable_1.DisposableCollection();
        this.toDispose.push(this.commandRegistry.onWillExecuteCommand(e => this.onWillExecuteCommandEmitter.fire(e)));
        this.toDispose.push(this.commandRegistry.onDidExecuteCommand(e => this.onDidExecuteCommandEmitter.fire(e)));
    }
    dispose() {
        this.toDispose.dispose();
    }
    get onWillExecuteCommand() {
        return this.onWillExecuteCommandEmitter.event;
    }
    get onDidExecuteCommand() {
        return this.onDidExecuteCommandEmitter.event;
    }
    setDelegate(delegate) {
        if (this.toDispose.disposed) {
            return;
        }
        this.delegateListeners.dispose();
        this.toDispose.push(this.delegateListeners);
        this.delegate = delegate;
        if (this.delegate) {
            this.delegateListeners.push(this.delegate.onWillExecuteCommand(event => this.onWillExecuteCommandEmitter.fire(event)));
            this.delegateListeners.push(this.delegate.onDidExecuteCommand(event => this.onDidExecuteCommandEmitter.fire(event)));
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async executeCommand(commandId, ...args) {
        try {
            await this.commandRegistry.executeCommand(commandId, ...args);
        }
        catch (e) {
            if (e.code === 'NO_ACTIVE_HANDLER') {
                return this.executeMonacoCommand(commandId, ...args);
            }
            throw e;
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async executeMonacoCommand(commandId, ...args) {
        if (this.delegate) {
            return this.delegate.executeCommand(commandId, ...args);
        }
        throw new Error(`command '${commandId}' not found`);
    }
};
MonacoCommandService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(command_1.CommandRegistry)),
    __metadata("design:paramtypes", [command_1.CommandRegistry])
], MonacoCommandService);
exports.MonacoCommandService = MonacoCommandService;
//# sourceMappingURL=monaco-command-service.js.map