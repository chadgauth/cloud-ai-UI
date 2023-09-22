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
exports.ProcessTask = exports.TaskFactory = exports.TaskProcessOptions = exports.removeAnsiEscapeCodes = void 0;
/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT License. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/
const inversify_1 = require("@theia/core/shared/inversify");
const common_1 = require("@theia/core/lib/common/");
const task_1 = require("../task");
const task_manager_1 = require("../task-manager");
// copied from https://github.com/microsoft/vscode/blob/1.79.0/src/vs/base/common/strings.ts#L736
const CSI_SEQUENCE = /(:?\x1b\[|\x9B)[=?>!]?[\d;:]*["$#'* ]?[a-zA-Z@^`{}|~]/g;
// Plus additional markers for custom `\x1b]...\x07` instructions.
const CSI_CUSTOM_SEQUENCE = /\x1b\].*?\x07/g;
function removeAnsiEscapeCodes(str) {
    if (str) {
        str = str.replace(CSI_SEQUENCE, '').replace(CSI_CUSTOM_SEQUENCE, '');
    }
    return str.trimEnd();
}
exports.removeAnsiEscapeCodes = removeAnsiEscapeCodes;
exports.TaskProcessOptions = Symbol('TaskProcessOptions');
exports.TaskFactory = Symbol('TaskFactory');
/** Represents a Task launched as a process by `ProcessTaskRunner`. */
let ProcessTask = class ProcessTask extends task_1.Task {
    constructor(taskManager, logger, options) {
        super(taskManager, logger, options);
        this.options = options;
        const toDispose = this.process.onClose(async (event) => {
            toDispose.dispose();
            this.fireTaskExited(await this.getTaskExitedEvent(event));
        });
        // Buffer to accumulate incoming output.
        let dataBuffer = '';
        this.process.outputStream.on('data', (chunk) => {
            dataBuffer += chunk;
            while (1) {
                // Check if we have a complete line.
                const eolIdx = dataBuffer.indexOf('\n');
                if (eolIdx < 0) {
                    break;
                }
                // Get and remove the line from the data buffer.
                const lineBuf = dataBuffer.slice(0, eolIdx);
                dataBuffer = dataBuffer.slice(eolIdx + 1);
                const processedLine = removeAnsiEscapeCodes(lineBuf);
                this.fireOutputLine({
                    taskId: this.taskId,
                    ctx: this.context,
                    line: processedLine
                });
            }
        });
        this.command = this.options.command;
        this.logger.info(`Created new task, id: ${this.id}, process id: ${this.options.process.id}, OS PID: ${this.process.pid}, context: ${this.context}`);
    }
    kill() {
        return new Promise(resolve => {
            if (this.process.killed) {
                resolve();
            }
            else {
                const toDispose = this.process.onClose(event => {
                    toDispose.dispose();
                    resolve();
                });
                this.process.kill();
            }
        });
    }
    async getTaskExitedEvent(evt) {
        return {
            taskId: this.taskId,
            ctx: this.context,
            code: evt.code,
            signal: evt.signal,
            config: this.options.config,
            terminalId: this.process.id,
            processId: this.process.id
        };
    }
    getRuntimeInfo() {
        return {
            taskId: this.id,
            ctx: this.context,
            config: this.options.config,
            terminalId: this.process.id,
            processId: this.process.id,
            command: this.command
        };
    }
    get process() {
        return this.options.process;
    }
    get processType() {
        return this.options.processType;
    }
};
ProcessTask = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(task_manager_1.TaskManager)),
    __param(1, (0, inversify_1.inject)(common_1.ILogger)),
    __param(1, (0, inversify_1.named)('task')),
    __param(2, (0, inversify_1.inject)(exports.TaskProcessOptions)),
    __metadata("design:paramtypes", [task_manager_1.TaskManager, Object, Object])
], ProcessTask);
exports.ProcessTask = ProcessTask;
//# sourceMappingURL=process-task.js.map