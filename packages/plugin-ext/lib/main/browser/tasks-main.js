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
exports.TasksMainImpl = void 0;
const plugin_api_rpc_1 = require("../../common/plugin-api-rpc");
const common_1 = require("@theia/core/lib/common");
const task_contribution_1 = require("@theia/task/lib/browser/task-contribution");
const task_protocol_1 = require("@theia/task/lib/common/task-protocol");
const task_watcher_1 = require("@theia/task/lib/common/task-watcher");
const task_service_1 = require("@theia/task/lib/browser/task-service");
const browser_1 = require("@theia/task/lib/browser");
const revealKindMap = new Map([
    [1, task_protocol_1.RevealKind.Always],
    [2, task_protocol_1.RevealKind.Silent],
    [3, task_protocol_1.RevealKind.Never],
    [task_protocol_1.RevealKind.Always, 1],
    [task_protocol_1.RevealKind.Silent, 2],
    [task_protocol_1.RevealKind.Never, 3]
]);
const panelKindMap = new Map([
    [1, task_protocol_1.PanelKind.Shared],
    [2, task_protocol_1.PanelKind.Dedicated],
    [3, task_protocol_1.PanelKind.New],
    [task_protocol_1.PanelKind.Shared, 1],
    [task_protocol_1.PanelKind.Dedicated, 2],
    [task_protocol_1.PanelKind.New, 3]
]);
class TasksMainImpl {
    constructor(rpc, container) {
        this.taskProviders = new Map();
        this.toDispose = new common_1.DisposableCollection();
        this.proxy = rpc.getProxy(plugin_api_rpc_1.MAIN_RPC_CONTEXT.TASKS_EXT);
        this.taskProviderRegistry = container.get(task_contribution_1.TaskProviderRegistry);
        this.taskResolverRegistry = container.get(task_contribution_1.TaskResolverRegistry);
        this.taskWatcher = container.get(task_watcher_1.TaskWatcher);
        this.taskService = container.get(task_service_1.TaskService);
        this.taskDefinitionRegistry = container.get(browser_1.TaskDefinitionRegistry);
        this.toDispose.push(this.taskWatcher.onTaskCreated((event) => {
            this.proxy.$onDidStartTask({
                id: event.taskId,
                task: this.fromTaskConfiguration(event.config)
            }, event.terminalId);
        }));
        this.toDispose.push(this.taskWatcher.onTaskExit((event) => {
            this.proxy.$onDidEndTask(event.taskId);
        }));
        this.toDispose.push(this.taskWatcher.onDidStartTaskProcess((event) => {
            if (event.processId !== undefined) {
                this.proxy.$onDidStartTaskProcess(event.processId, {
                    id: event.taskId,
                    task: this.fromTaskConfiguration(event.config)
                });
            }
        }));
        this.toDispose.push(this.taskWatcher.onDidEndTaskProcess((event) => {
            if (event.code !== undefined) {
                this.proxy.$onDidEndTaskProcess(event.code, event.taskId);
            }
        }));
        // Inform proxy about running tasks form previous session
        this.$taskExecutions().then(executions => {
            if (executions.length > 0) {
                this.proxy.$initLoadedTasks(executions);
            }
        });
    }
    dispose() {
        this.toDispose.dispose();
    }
    $registerTaskProvider(handle, type) {
        const taskProvider = this.createTaskProvider(handle);
        const taskResolver = this.createTaskResolver(handle);
        const toDispose = new common_1.DisposableCollection(this.taskProviderRegistry.register(type, taskProvider, handle), this.taskResolverRegistry.registerTaskResolver(type, taskResolver), common_1.Disposable.create(() => this.taskProviders.delete(handle)));
        this.taskProviders.set(handle, toDispose);
        this.toDispose.push(toDispose);
    }
    $unregister(handle) {
        const disposable = this.taskProviders.get(handle);
        if (disposable) {
            disposable.dispose();
        }
    }
    async $fetchTasks(taskVersion, taskType) {
        if (taskVersion && !taskVersion.startsWith('2.')) { // Theia does not support 1.x or earlier task versions
            return [];
        }
        const token = this.taskService.startUserAction();
        const [configured, provided] = await Promise.all([
            this.taskService.getConfiguredTasks(token),
            this.taskService.getProvidedTasks(token)
        ]);
        const result = [];
        for (const tasks of [configured, provided]) {
            for (const task of tasks) {
                if (!taskType || (!!this.taskDefinitionRegistry.getDefinition(task) ? task._source === taskType : task.type === taskType)) {
                    result.push(this.fromTaskConfiguration(task));
                }
            }
        }
        return result;
    }
    async $executeTask(taskDto) {
        const taskConfig = this.toTaskConfiguration(taskDto);
        const taskInfo = await this.taskService.runTask(taskConfig);
        if (taskInfo) {
            return {
                id: taskInfo.taskId,
                task: this.fromTaskConfiguration(taskInfo.config)
            };
        }
    }
    async $taskExecutions() {
        const runningTasks = await this.taskService.getRunningTasks();
        return runningTasks.map(taskInfo => ({
            id: taskInfo.taskId,
            task: this.fromTaskConfiguration(taskInfo.config)
        }));
    }
    $terminateTask(id) {
        this.taskService.kill(id);
    }
    async $customExecutionComplete(id, exitCode) {
        this.taskService.customExecutionComplete(id, exitCode);
    }
    createTaskProvider(handle) {
        return {
            provideTasks: () => this.proxy.$provideTasks(handle).then(tasks => tasks.map(taskDto => this.toTaskConfiguration(taskDto)))
        };
    }
    createTaskResolver(handle) {
        return {
            resolveTask: taskConfig => this.proxy.$resolveTask(handle, this.fromTaskConfiguration(taskConfig)).then(task => this.toTaskConfiguration(task))
        };
    }
    toTaskConfiguration(taskDto) {
        const { group, presentation, scope, source, runOptions, ...common } = taskDto !== null && taskDto !== void 0 ? taskDto : {};
        const partialConfig = {};
        if (presentation) {
            partialConfig.presentation = this.convertTaskPresentation(presentation);
        }
        if (group) {
            partialConfig.group = {
                kind: group.kind,
                isDefault: group.isDefault
            };
        }
        return {
            ...common,
            ...partialConfig,
            runOptions,
            _scope: scope,
            _source: source,
        };
    }
    fromTaskConfiguration(task) {
        const { group, presentation, _scope, _source, ...common } = task;
        const partialDto = {};
        if (presentation) {
            partialDto.presentation = this.convertTaskPresentation(presentation);
        }
        if (group === 'build' || group === 'test') {
            partialDto.group = {
                kind: group,
                isDefault: false
            };
        }
        else if (typeof group === 'object') {
            partialDto.group = group;
        }
        return {
            ...common,
            ...partialDto,
            scope: _scope,
            source: _source,
        };
    }
    convertTaskPresentation(presentationFrom) {
        if (presentationFrom) {
            const { reveal, panel, ...common } = presentationFrom;
            const presentationTo = {};
            if (reveal) {
                presentationTo.reveal = revealKindMap.get(reveal);
            }
            if (panel) {
                presentationTo.panel = panelKindMap.get(panel);
            }
            return {
                ...common,
                ...presentationTo,
            };
        }
    }
}
exports.TasksMainImpl = TasksMainImpl;
//# sourceMappingURL=tasks-main.js.map