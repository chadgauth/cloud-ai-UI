"use strict";
// *****************************************************************************
// Copyright (C) 2021 ByteDance and others.
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
exports.CustomTask = exports.TaskFactory = exports.TaskCustomOptions = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const common_1 = require("@theia/core/lib/common/");
const task_1 = require("../task");
const task_manager_1 = require("../task-manager");
exports.TaskCustomOptions = Symbol('TaskCustomOptions');
exports.TaskFactory = Symbol('TaskFactory');
/** Represents a Task launched as a fake process by `CustomTaskRunner`. */
let CustomTask = class CustomTask extends task_1.Task {
    constructor(taskManager, logger, options) {
        super(taskManager, logger, options);
        this.options = options;
        this.logger.info(`Created new custom task, id: ${this.id}, context: ${this.context}`);
    }
    kill() {
        return Promise.resolve();
    }
    getRuntimeInfo() {
        return {
            taskId: this.id,
            ctx: this.context,
            config: this.options.config,
            terminalId: this.process.id,
            processId: this.process.id
        };
    }
    callbackTaskComplete(exitCode) {
        this.fireTaskExited({
            taskId: this.taskId,
            ctx: this.context,
            config: this.options.config,
            terminalId: this.process.id,
            processId: this.process.id,
            code: exitCode || 0
        });
    }
    get process() {
        return this.options.process;
    }
};
CustomTask = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(task_manager_1.TaskManager)),
    __param(1, (0, inversify_1.inject)(common_1.ILogger)),
    __param(1, (0, inversify_1.named)('task')),
    __param(2, (0, inversify_1.inject)(exports.TaskCustomOptions)),
    __metadata("design:paramtypes", [task_manager_1.TaskManager, Object, Object])
], CustomTask);
exports.CustomTask = CustomTask;
//# sourceMappingURL=custom-task.js.map