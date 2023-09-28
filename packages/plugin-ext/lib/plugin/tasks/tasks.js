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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksExtImpl = void 0;
const plugin_api_rpc_1 = require("../../common/plugin-api-rpc");
const converter = require("../type-converters");
const types_impl_1 = require("../types-impl");
const task_provider_1 = require("./task-provider");
const event_1 = require("@theia/core/lib/common/event");
const coreutils_1 = require("@theia/core/shared/@phosphor/coreutils");
const cancellation_1 = require("@theia/core/lib/common/cancellation");
class TasksExtImpl {
    constructor(rpc, terminalExt) {
        this.terminalExt = terminalExt;
        this.callId = 0;
        this.adaptersMap = new Map();
        this.executions = new Map();
        this.callbackIdBase = coreutils_1.UUID.uuid4();
        this.customExecutionIds = new Map();
        this.customExecutionFunctions = new Map();
        this.onDidExecuteTask = new event_1.Emitter();
        this.onDidTerminateTask = new event_1.Emitter();
        this.onDidExecuteTaskProcess = new event_1.Emitter();
        this.onDidTerminateTaskProcess = new event_1.Emitter();
        this.proxy = rpc.getProxy(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.TASKS_MAIN);
    }
    get taskExecutions() {
        return [...this.executions.values()];
    }
    get onDidStartTask() {
        return this.onDidExecuteTask.event;
    }
    async $onDidStartTask(execution, terminalId) {
        const customExecution = this.customExecutionFunctions.get(execution.task.executionId || '');
        if (customExecution) {
            const taskDefinition = converter.toTask(execution.task).definition;
            const pty = await customExecution(taskDefinition);
            this.terminalExt.attachPtyToTerminal(terminalId, pty);
            if (pty.onDidClose) {
                const disposable = pty.onDidClose((e = undefined) => {
                    disposable.dispose();
                    // eslint-disable-next-line no-void
                    this.proxy.$customExecutionComplete(execution.id, e === void 0 ? undefined : e);
                });
            }
        }
        this.lastStartedTask = execution.id;
        this.onDidExecuteTask.fire({
            execution: this.getTaskExecution(execution)
        });
    }
    get onDidEndTask() {
        return this.onDidTerminateTask.event;
    }
    $onDidEndTask(id) {
        const taskExecution = this.executions.get(id);
        if (!taskExecution) {
            throw new Error(`Task execution with id ${id} is not found`);
        }
        this.executions.delete(id);
        this.onDidTerminateTask.fire({
            execution: taskExecution
        });
    }
    get onDidStartTaskProcess() {
        return this.onDidExecuteTaskProcess.event;
    }
    $onDidStartTaskProcess(processId, executionDto) {
        this.onDidExecuteTaskProcess.fire({
            processId,
            execution: this.getTaskExecution(executionDto)
        });
    }
    get onDidEndTaskProcess() {
        return this.onDidTerminateTaskProcess.event;
    }
    $onDidEndTaskProcess(exitCode, taskId) {
        const taskExecution = this.executions.get(taskId);
        if (!taskExecution) {
            throw new Error(`Task execution with id ${taskId} is not found`);
        }
        this.onDidTerminateTaskProcess.fire({
            execution: taskExecution,
            exitCode
        });
    }
    registerTaskProvider(type, provider) {
        const callId = this.addNewAdapter(new task_provider_1.TaskProviderAdapter(provider));
        this.proxy.$registerTaskProvider(callId, type);
        return this.createDisposable(callId);
    }
    async fetchTasks(filter) {
        const taskVersion = filter ? filter.version : undefined;
        const taskType = filter ? filter.type : undefined;
        const taskDtos = await this.proxy.$fetchTasks(taskVersion, taskType);
        return taskDtos.map(dto => converter.toTask(dto));
    }
    async executeTask(task) {
        const taskDto = converter.fromTask(task);
        if (taskDto) {
            // If this task is a custom execution, then we need to save it away
            // in the provided custom execution map that is cleaned up after the
            // task is executed.
            if (types_impl_1.CustomExecution.is(task.execution)) {
                taskDto.executionId = this.addCustomExecution(task.execution.callback);
            }
            const executionDto = await this.proxy.$executeTask(taskDto);
            if (executionDto) {
                const taskExecution = this.getTaskExecution(executionDto);
                return taskExecution;
            }
            throw new Error('Run task config does not return after being started');
        }
        throw new Error('Task was not successfully transformed into a task config');
    }
    async $provideTasks(handle) {
        const adapter = this.adaptersMap.get(handle);
        if (adapter) {
            return adapter.provideTasks(cancellation_1.CancellationToken.None).then(tasks => {
                for (const task of tasks) {
                    if (task.taskType === 'customExecution') {
                        this.applyCustomExecution(task);
                    }
                }
                return tasks;
            });
        }
        else {
            throw new Error('No adapter found to provide tasks');
        }
    }
    async $resolveTask(handle, task, token) {
        const adapter = this.adaptersMap.get(handle);
        if (adapter) {
            return adapter.resolveTask(task, token).then(resolvedTask => {
                var _a;
                // ensure we do not lose task type and execution id during resolution as we need it for custom execution
                resolvedTask.taskType = (_a = resolvedTask.taskType) !== null && _a !== void 0 ? _a : task.taskType;
                if (resolvedTask.taskType === 'customExecution') {
                    this.applyCustomExecution(resolvedTask);
                }
                return resolvedTask;
            });
        }
        else {
            throw new Error('No adapter found to resolve task');
        }
    }
    applyCustomExecution(task) {
        if (task.callback) {
            task.executionId = this.addCustomExecution(task.callback);
            task.callback = undefined;
        }
    }
    addNewAdapter(adapter) {
        const callId = this.nextCallId();
        this.adaptersMap.set(callId, adapter);
        return callId;
    }
    nextCallId() {
        return this.callId++;
    }
    createDisposable(callId) {
        return new types_impl_1.Disposable(() => {
            this.adaptersMap.delete(callId);
            this.proxy.$unregister(callId);
        });
    }
    // Initial `this.executions` map with the running tasks from the previous session
    async $initLoadedTasks(taskExecutions) {
        taskExecutions.forEach(execution => this.getTaskExecution(execution));
    }
    getTaskExecution(execution) {
        const executionId = execution.id;
        let result = this.executions.get(executionId);
        if (result) {
            return result;
        }
        result = {
            task: converter.toTask(execution.task),
            terminate: () => {
                this.proxy.$terminateTask(executionId);
            }
        };
        this.executions.set(executionId, result);
        return result;
    }
    addCustomExecution(callback) {
        let id = this.customExecutionIds.get(callback);
        if (!id) {
            id = this.nextCallbackId();
            this.customExecutionIds.set(callback, id);
            this.customExecutionFunctions.set(id, callback);
        }
        return id;
    }
    nextCallbackId() {
        return this.callbackIdBase + this.callbackId++;
    }
}
exports.TasksExtImpl = TasksExtImpl;
//# sourceMappingURL=tasks.js.map