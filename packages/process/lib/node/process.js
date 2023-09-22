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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Process = exports.ProcessType = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const common_1 = require("@theia/core/lib/common");
const node_1 = require("@theia/core/lib/node");
const core_1 = require("@theia/core");
const child_process_1 = require("child_process");
const fs = require("fs");
const process_manager_types_1 = require("../common/process-manager-types");
Object.defineProperty(exports, "ProcessType", { enumerable: true, get: function () { return process_manager_types_1.ProcessType; } });
let Process = class Process {
    constructor(processManager, logger, type, options) {
        this.processManager = processManager;
        this.logger = logger;
        this.type = type;
        this.options = options;
        this.startEmitter = new common_1.Emitter();
        this.exitEmitter = new common_1.Emitter();
        this.closeEmitter = new common_1.Emitter();
        this.errorEmitter = new common_1.Emitter();
        this._killed = false;
        this.id = this.processManager.register(this);
        this.initialCwd = options && options.options && 'cwd' in options.options && options.options['cwd'].toString() || __dirname;
    }
    get killed() {
        return this._killed;
    }
    get onStart() {
        return this.startEmitter.event;
    }
    /**
     * Wait for the process to exit, streams can still emit data.
     */
    get onExit() {
        return this.exitEmitter.event;
    }
    get onError() {
        return this.errorEmitter.event;
    }
    /**
     * Waits for both process exit and for all the streams to be closed.
     */
    get onClose() {
        return this.closeEmitter.event;
    }
    emitOnStarted() {
        this.startEmitter.fire({});
    }
    /**
     * Emit the onExit event for this process.  Only one of code and signal
     * should be defined.
     */
    emitOnExit(code, signal) {
        const exitEvent = { code, signal };
        this.handleOnExit(exitEvent);
        this.exitEmitter.fire(exitEvent);
    }
    /**
     * Emit the onClose event for this process.  Only one of code and signal
     * should be defined.
     */
    emitOnClose(code, signal) {
        this.closeEmitter.fire({ code, signal });
    }
    handleOnExit(event) {
        this._killed = true;
        const signalSuffix = event.signal ? `, signal: ${event.signal}` : '';
        const executable = this.isForkOptions(this.options) ? this.options.modulePath : this.options.command;
        this.logger.debug(`Process ${this.pid} has exited with code ${event.code}${signalSuffix}.`, executable, this.options.args);
    }
    emitOnError(err) {
        this.handleOnError(err);
        this.errorEmitter.fire(err);
    }
    async emitOnErrorAsync(error) {
        process.nextTick(this.emitOnError.bind(this), error);
    }
    handleOnError(error) {
        this._killed = true;
        this.logger.error(error);
    }
    isForkOptions(options) {
        return (0, common_1.isObject)(options) && !!options.modulePath;
    }
    /**
     * @returns the current working directory as a URI (usually file:// URI)
     */
    getCwdURI() {
        if (core_1.isOSX) {
            return new Promise(resolve => {
                (0, child_process_1.exec)('lsof -OPln -p ' + this.pid + ' | grep cwd', (error, stdout, stderr) => {
                    if (stdout !== '') {
                        resolve(node_1.FileUri.create(stdout.substring(stdout.indexOf('/'), stdout.length - 1)).toString());
                    }
                    else {
                        resolve(node_1.FileUri.create(this.initialCwd).toString());
                    }
                });
            });
        }
        else if (!core_1.isWindows) {
            return new Promise(resolve => {
                fs.readlink('/proc/' + this.pid + '/cwd', (err, linkedstr) => {
                    if (err || !linkedstr) {
                        resolve(node_1.FileUri.create(this.initialCwd).toString());
                    }
                    else {
                        resolve(node_1.FileUri.create(linkedstr).toString());
                    }
                });
            });
        }
        else {
            return new Promise(resolve => {
                resolve(node_1.FileUri.create(this.initialCwd).toString());
            });
        }
    }
};
Process = __decorate([
    (0, inversify_1.injectable)(),
    __param(2, (0, inversify_1.unmanaged)()),
    __metadata("design:paramtypes", [Object, Object, Number, Object])
], Process);
exports.Process = Process;
//# sourceMappingURL=process.js.map