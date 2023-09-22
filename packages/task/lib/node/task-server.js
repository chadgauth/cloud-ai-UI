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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskServerImpl = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const common_1 = require("@theia/core/lib/common/");
const task_manager_1 = require("./task-manager");
const task_runner_1 = require("./task-runner");
const process_task_1 = require("./process/process-task");
const task_problem_collector_1 = require("./task-problem-collector");
let TaskServerImpl = class TaskServerImpl {
    constructor() {
        /** Task clients, to send notifications-to. */
        this.clients = [];
        /** Map of task id and task disposable */
        this.toDispose = new Map();
        /** Map of task id and task background status. */
        // Currently there is only one property ('isActive'), but in the future we may want to store more properties
        this.backgroundTaskStatusMap = new Map();
        /** task context - {task id - problem collector} */
        this.problemCollectors = new Map();
    }
    dispose() {
        for (const toDispose of this.toDispose.values()) {
            toDispose.dispose();
        }
        this.toDispose.clear();
        this.backgroundTaskStatusMap.clear();
    }
    disposeByTaskId(taskId) {
        if (this.toDispose.has(taskId)) {
            this.toDispose.get(taskId).dispose();
            this.toDispose.delete(taskId);
        }
        if (this.backgroundTaskStatusMap.has(taskId)) {
            this.backgroundTaskStatusMap.delete(taskId);
        }
    }
    async getTasks(context) {
        const taskInfo = [];
        const tasks = this.taskManager.getTasks(context);
        if (tasks !== undefined) {
            for (const task of tasks) {
                taskInfo.push(await task.getRuntimeInfo());
            }
        }
        this.logger.debug(`getTasks(): about to return task information for ${taskInfo.length} tasks`);
        return Promise.resolve(taskInfo);
    }
    async run(taskConfiguration, ctx, option) {
        const runner = this.runnerRegistry.getRunner(taskConfiguration.type, taskConfiguration.taskType);
        const task = await runner.run(taskConfiguration, ctx);
        if (!this.toDispose.has(task.id)) {
            this.toDispose.set(task.id, new common_1.DisposableCollection());
        }
        if (taskConfiguration.isBackground && !this.backgroundTaskStatusMap.has(task.id)) {
            this.backgroundTaskStatusMap.set(task.id, { 'isActive': false });
        }
        this.toDispose.get(task.id).push(task.onExit(event => {
            this.taskManager.delete(task);
            this.fireTaskExitedEvent(event, task);
            this.removedCachedProblemCollector(event.ctx || '', event.taskId);
            this.disposeByTaskId(event.taskId);
        }));
        const resolvedMatchers = option && option.customization ? option.customization.problemMatcher || [] : [];
        if (resolvedMatchers.length > 0) {
            this.toDispose.get(task.id).push(task.onOutput(event => {
                let collector = this.getCachedProblemCollector(event.ctx || '', event.taskId);
                if (!collector) {
                    collector = new task_problem_collector_1.ProblemCollector(resolvedMatchers);
                    this.cacheProblemCollector(event.ctx || '', event.taskId, collector);
                }
                const problems = collector.processLine(event.line);
                if (problems.length > 0) {
                    this.fireTaskOutputProcessedEvent({
                        taskId: event.taskId,
                        config: taskConfiguration,
                        ctx: event.ctx,
                        problems
                    });
                }
                if (taskConfiguration.isBackground) {
                    const backgroundTaskStatus = this.backgroundTaskStatusMap.get(event.taskId);
                    if (!backgroundTaskStatus.isActive) {
                        // Get the 'activeOnStart' value of the problem matcher 'background' property
                        const activeOnStart = collector.isTaskActiveOnStart();
                        if (activeOnStart) {
                            backgroundTaskStatus.isActive = true;
                        }
                        else {
                            const isBeginsPatternMatch = collector.matchBeginMatcher(event.line);
                            if (isBeginsPatternMatch) {
                                backgroundTaskStatus.isActive = true;
                            }
                        }
                    }
                    if (backgroundTaskStatus.isActive) {
                        const isEndsPatternMatch = collector.matchEndMatcher(event.line);
                        // Mark ends pattern as matches, only after begins pattern matches
                        if (isEndsPatternMatch) {
                            this.fireBackgroundTaskEndedEvent({
                                taskId: event.taskId,
                                ctx: event.ctx
                            });
                        }
                    }
                }
            }));
        }
        this.toDispose.get(task.id).push(task);
        const taskInfo = await task.getRuntimeInfo();
        this.fireTaskCreatedEvent(taskInfo);
        return taskInfo;
    }
    async getRegisteredTaskTypes() {
        return this.runnerRegistry.getRunnerTypes();
    }
    async customExecutionComplete(id, exitCode) {
        const task = this.taskManager.get(id);
        await task.callbackTaskComplete(exitCode);
    }
    fireTaskExitedEvent(event, task) {
        this.logger.debug(log => log('task has exited:', event));
        if (task instanceof process_task_1.ProcessTask) {
            this.clients.forEach(client => {
                client.onDidEndTaskProcess(event);
            });
        }
        this.clients.forEach(client => {
            client.onTaskExit(event);
        });
    }
    fireTaskCreatedEvent(event, task) {
        this.logger.debug(log => log('task created:', event));
        this.clients.forEach(client => {
            client.onTaskCreated(event);
        });
        if (task && task instanceof process_task_1.ProcessTask) {
            this.clients.forEach(client => {
                client.onDidStartTaskProcess(event);
            });
        }
    }
    fireTaskOutputProcessedEvent(event) {
        this.clients.forEach(client => client.onDidProcessTaskOutput(event));
    }
    fireBackgroundTaskEndedEvent(event) {
        this.clients.forEach(client => client.onBackgroundTaskEnded(event));
    }
    /** Kill task for a given id. Rejects if task is not found */
    async kill(id) {
        const taskToKill = this.taskManager.get(id);
        if (taskToKill !== undefined) {
            this.logger.info(`Killing task id ${id}`);
            return taskToKill.kill();
        }
        else {
            this.logger.info(`Could not find task to kill, task id ${id}. Already terminated?`);
            return Promise.reject(new Error(`Could not find task to kill, task id ${id}. Already terminated?`));
        }
    }
    /** Adds a client to this server */
    setClient(client) {
        this.logger.debug('a client has connected - adding it to the list:');
        this.clients.push(client);
    }
    /** Removes a client, from this server */
    disconnectClient(client) {
        this.logger.debug('a client has disconnected - removed from list:');
        const idx = this.clients.indexOf(client);
        if (idx > -1) {
            this.clients.splice(idx, 1);
        }
    }
    getCachedProblemCollector(ctx, taskId) {
        if (this.problemCollectors.has(ctx)) {
            return this.problemCollectors.get(ctx).get(taskId);
        }
    }
    cacheProblemCollector(ctx, taskId, problemCollector) {
        if (this.problemCollectors.has(ctx)) {
            if (!this.problemCollectors.get(ctx).has(taskId)) {
                this.problemCollectors.get(ctx).set(taskId, problemCollector);
            }
        }
        else {
            const forNewContext = new Map();
            forNewContext.set(taskId, problemCollector);
            this.problemCollectors.set(ctx, forNewContext);
        }
    }
    removedCachedProblemCollector(ctx, taskId) {
        if (this.problemCollectors.has(ctx) && this.problemCollectors.get(ctx).has(taskId)) {
            this.problemCollectors.get(ctx).delete(taskId);
        }
    }
};
__decorate([
    (0, inversify_1.inject)(common_1.ILogger),
    (0, inversify_1.named)('task'),
    __metadata("design:type", Object)
], TaskServerImpl.prototype, "logger", void 0);
__decorate([
    (0, inversify_1.inject)(task_manager_1.TaskManager),
    __metadata("design:type", task_manager_1.TaskManager)
], TaskServerImpl.prototype, "taskManager", void 0);
__decorate([
    (0, inversify_1.inject)(task_runner_1.TaskRunnerRegistry),
    __metadata("design:type", task_runner_1.TaskRunnerRegistry)
], TaskServerImpl.prototype, "runnerRegistry", void 0);
TaskServerImpl = __decorate([
    (0, inversify_1.injectable)()
], TaskServerImpl);
exports.TaskServerImpl = TaskServerImpl;
//# sourceMappingURL=task-server.js.map