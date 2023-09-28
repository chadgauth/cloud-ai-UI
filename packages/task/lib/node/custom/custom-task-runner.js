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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomTaskRunner = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const core_1 = require("@theia/core");
const custom_task_1 = require("./custom-task");
const node_1 = require("@theia/process/lib/node");
/**
 * Task runner that runs a task as a pseudoterminal open.
 */
let CustomTaskRunner = class CustomTaskRunner {
    async run(taskConfig, ctx) {
        try {
            const terminalProcessOptions = { isPseudo: true };
            const terminal = this.terminalProcessFactory(terminalProcessOptions);
            return this.taskFactory({
                context: ctx,
                config: taskConfig,
                label: taskConfig.label,
                process: terminal,
            });
        }
        catch (error) {
            this.logger.error(`Error occurred while creating task: ${error}`);
            throw error;
        }
    }
};
__decorate([
    (0, inversify_1.inject)(core_1.ILogger),
    (0, inversify_1.named)('task'),
    __metadata("design:type", Object)
], CustomTaskRunner.prototype, "logger", void 0);
__decorate([
    (0, inversify_1.inject)(node_1.TerminalProcessFactory),
    __metadata("design:type", Function)
], CustomTaskRunner.prototype, "terminalProcessFactory", void 0);
__decorate([
    (0, inversify_1.inject)(custom_task_1.TaskFactory),
    __metadata("design:type", Function)
], CustomTaskRunner.prototype, "taskFactory", void 0);
CustomTaskRunner = __decorate([
    (0, inversify_1.injectable)()
], CustomTaskRunner);
exports.CustomTaskRunner = CustomTaskRunner;
//# sourceMappingURL=custom-task-runner.js.map