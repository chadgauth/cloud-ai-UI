"use strict";
// *****************************************************************************
// Copyright (C) 2018 Red Hat, Inc. and others.
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
exports.TaskRunnerRegistry = exports.TaskRunnerContribution = exports.TaskRunner = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const process_task_runner_1 = require("./process/process-task-runner");
const task_runner_protocol_1 = require("./task-runner-protocol");
Object.defineProperty(exports, "TaskRunner", { enumerable: true, get: function () { return task_runner_protocol_1.TaskRunner; } });
exports.TaskRunnerContribution = Symbol('TaskRunnerContribution');
/**
 * The {@link TaskRunnerRegistry} is the common component for the registration and provisioning of
 * {@link TaskRunner}s. Theia will collect all {@link TaskRunner}s and invoke {@link TaskRunnerContribution#registerRunner}
 * for each contribution. The `TaskServer` will use the runners provided by this registry to execute `TaskConfiguration`s that
 * have been triggered by the user.
 */
let TaskRunnerRegistry = class TaskRunnerRegistry {
    init() {
        this.runners = new Map();
        this.defaultRunner = this.processTaskRunner;
    }
    /**
     * Registers the given {@link TaskRunner} to execute Tasks of the specified type.
     * If there is already a {@link TaskRunner} registered for the specified type the registration will
     * be overwritten with the new value.
     * @param type the task type for which the given runner should be registered.
     * @param runner the task runner that should be registered.
     *
     * @returns a `Disposable` that can be invoked to unregister the given runner.
     */
    registerRunner(type, runner) {
        this.runners.set(type, runner);
        return {
            dispose: () => this.runners.delete(type)
        };
    }
    /**
     * Looks for a registered {@link TaskRunner} for each of the task types in sequence and returns the first that is found
     * If no task runner is registered for any of the types, the default runner is returned.
     * @param types the task types.
     *
     * @returns the registered {@link TaskRunner} or a default runner if none is registered for the specified types.
     */
    getRunner(...types) {
        for (const type of types) {
            const runner = this.runners.get(type);
            if (runner) {
                return runner;
            }
        }
        return this.defaultRunner;
    }
    /**
     * Derives all task types for which a {@link TaskRunner} is registered.
     *
     * @returns all derived task types.
     */
    getRunnerTypes() {
        return [...this.runners.keys()];
    }
};
__decorate([
    (0, inversify_1.inject)(process_task_runner_1.ProcessTaskRunner),
    __metadata("design:type", process_task_runner_1.ProcessTaskRunner)
], TaskRunnerRegistry.prototype, "processTaskRunner", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TaskRunnerRegistry.prototype, "init", null);
TaskRunnerRegistry = __decorate([
    (0, inversify_1.injectable)()
], TaskRunnerRegistry);
exports.TaskRunnerRegistry = TaskRunnerRegistry;
//# sourceMappingURL=task-runner.js.map