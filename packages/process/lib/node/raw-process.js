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
exports.RawProcess = exports.RawProcessFactory = exports.RawProcessOptions = exports.DevNullStream = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const process_manager_1 = require("./process-manager");
const common_1 = require("@theia/core/lib/common");
const process_1 = require("./process");
const child_process_1 = require("child_process");
// The class was here before, exporting to not break anything.
var dev_null_stream_1 = require("./dev-null-stream");
Object.defineProperty(exports, "DevNullStream", { enumerable: true, get: function () { return dev_null_stream_1.DevNullStream; } });
const dev_null_stream_2 = require("./dev-null-stream");
exports.RawProcessOptions = Symbol('RawProcessOptions');
exports.RawProcessFactory = Symbol('RawProcessFactory');
let RawProcess = class RawProcess extends process_1.Process {
    constructor(// eslint-disable-next-line @typescript-eslint/indent
    options, processManager, logger) {
        super(processManager, logger, process_1.ProcessType.Raw, options);
        const executable = this.isForkOptions(options) ? options.modulePath : options.command;
        this.logger.debug(`Starting raw process: ${executable},`
            + ` with args: ${options.args ? options.args.join(' ') : ''}, `
            + ` with options: ${JSON.stringify(options.options)}`);
        // About catching errors: spawn will sometimes throw directly
        // (EACCES on Linux), sometimes return a Process object with the pid
        // property undefined (ENOENT on Linux) and then emit an 'error' event.
        // For now, we try to normalize that into always emitting an 'error'
        // event.
        try {
            if (this.isForkOptions(options)) {
                this.process = (0, child_process_1.fork)(options.modulePath, options.args || [], options.options || {});
            }
            else {
                this.process = (0, child_process_1.spawn)(options.command, options.args || [], options.options || {});
            }
            this.process.on('error', (error) => {
                error.code = error.code || 'Unknown error';
                this.emitOnError(error);
            });
            // When no stdio option is passed, it is null by default.
            this.outputStream = this.process.stdout || new dev_null_stream_2.DevNullStream({ autoDestroy: true });
            this.inputStream = this.process.stdin || new dev_null_stream_2.DevNullStream({ autoDestroy: true });
            this.errorStream = this.process.stderr || new dev_null_stream_2.DevNullStream({ autoDestroy: true });
            this.process.on('exit', (exitCode, signal) => {
                // node's child_process exit sets the unused parameter to null,
                // but we want it to be undefined instead.
                this.emitOnExit(typeof exitCode === 'number' ? exitCode : undefined, typeof signal === 'string' ? signal : undefined);
                this.processManager.unregister(this);
            });
            this.process.on('close', (exitCode, signal) => {
                // node's child_process exit sets the unused parameter to null,
                // but we want it to be undefined instead.
                this.emitOnClose(typeof exitCode === 'number' ? exitCode : undefined, typeof signal === 'string' ? signal : undefined);
            });
            if (this.process.pid !== undefined) {
                process.nextTick(this.emitOnStarted.bind(this));
            }
        }
        catch (error) {
            /* When an error is thrown, set up some fake streams, so the client
               code doesn't break because these field are undefined.  */
            this.outputStream = new dev_null_stream_2.DevNullStream({ autoDestroy: true });
            this.inputStream = new dev_null_stream_2.DevNullStream({ autoDestroy: true });
            this.errorStream = new dev_null_stream_2.DevNullStream({ autoDestroy: true });
            /* Call the client error handler, but first give them a chance to register it.  */
            this.emitOnErrorAsync(error);
        }
    }
    get pid() {
        if (!this.process || !this.process.pid) {
            throw new Error('process did not start correctly');
        }
        return this.process.pid;
    }
    kill(signal) {
        if (this.process && this.killed === false) {
            this.process.kill(signal);
        }
    }
};
RawProcess = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(exports.RawProcessOptions)),
    __param(1, (0, inversify_1.inject)(process_manager_1.ProcessManager)),
    __param(2, (0, inversify_1.inject)(common_1.ILogger)),
    __param(2, (0, inversify_1.named)('process')),
    __metadata("design:paramtypes", [Object, process_manager_1.ProcessManager, Object])
], RawProcess);
exports.RawProcess = RawProcess;
//# sourceMappingURL=raw-process.js.map