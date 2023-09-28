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
exports.TaskFrontendContribution = exports.TaskCommands = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const common_1 = require("@theia/core/lib/common");
const quick_open_task_1 = require("./quick-open-task");
const browser_1 = require("@theia/core/lib/browser");
const widget_manager_1 = require("@theia/core/lib/browser/widget-manager");
const task_contribution_1 = require("./task-contribution");
const task_service_1 = require("./task-service");
const terminal_frontend_contribution_1 = require("@theia/terminal/lib/browser/terminal-frontend-contribution");
const task_schema_updater_1 = require("./task-schema-updater");
const common_2 = require("../common");
const browser_2 = require("@theia/editor/lib/browser");
const workspace_service_1 = require("@theia/workspace/lib/browser/workspace-service");
var TaskCommands;
(function (TaskCommands) {
    const TASK_CATEGORY = 'Task';
    const TASK_CATEGORY_KEY = common_1.nls.getDefaultKey(TASK_CATEGORY);
    TaskCommands.TASK_RUN = common_1.Command.toDefaultLocalizedCommand({
        id: 'task:run',
        category: TASK_CATEGORY,
        label: 'Run Task...'
    });
    TaskCommands.TASK_RUN_BUILD = common_1.Command.toDefaultLocalizedCommand({
        id: 'task:run:build',
        category: TASK_CATEGORY,
        label: 'Run Build Task'
    });
    TaskCommands.TASK_RUN_TEST = common_1.Command.toDefaultLocalizedCommand({
        id: 'task:run:test',
        category: TASK_CATEGORY,
        label: 'Run Test Task'
    });
    TaskCommands.WORKBENCH_RUN_TASK = common_1.Command.toLocalizedCommand({
        id: 'workbench.action.tasks.runTask',
        category: TASK_CATEGORY
    }, '', TASK_CATEGORY_KEY);
    TaskCommands.TASK_RUN_LAST = common_1.Command.toDefaultLocalizedCommand({
        id: 'task:run:last',
        category: TASK_CATEGORY,
        label: 'Rerun Last Task'
    });
    TaskCommands.TASK_ATTACH = common_1.Command.toLocalizedCommand({
        id: 'task:attach',
        category: TASK_CATEGORY,
        label: 'Attach Task...'
    }, 'theia/task/attachTask', TASK_CATEGORY_KEY);
    TaskCommands.TASK_RUN_TEXT = common_1.Command.toDefaultLocalizedCommand({
        id: 'task:run:text',
        category: TASK_CATEGORY,
        label: 'Run Selected Text'
    });
    TaskCommands.TASK_CONFIGURE = common_1.Command.toDefaultLocalizedCommand({
        id: 'task:configure',
        category: TASK_CATEGORY,
        label: 'Configure Tasks...'
    });
    TaskCommands.TASK_OPEN_USER = common_1.Command.toLocalizedCommand({
        id: 'task:open_user',
        category: TASK_CATEGORY,
        label: 'Open User Tasks'
    }, 'theia/task/openUserTasks', TASK_CATEGORY_KEY);
    TaskCommands.TASK_CLEAR_HISTORY = common_1.Command.toLocalizedCommand({
        id: 'task:clear-history',
        category: TASK_CATEGORY,
        label: 'Clear History'
    }, 'theia/task/clearHistory', TASK_CATEGORY_KEY);
    TaskCommands.TASK_SHOW_RUNNING = common_1.Command.toDefaultLocalizedCommand({
        id: 'task:show-running',
        category: TASK_CATEGORY,
        label: 'Show Running Tasks'
    });
    TaskCommands.TASK_TERMINATE = common_1.Command.toDefaultLocalizedCommand({
        id: 'task:terminate',
        category: TASK_CATEGORY,
        label: 'Terminate Task'
    });
    TaskCommands.TASK_RESTART_RUNNING = common_1.Command.toDefaultLocalizedCommand({
        id: 'task:restart-running',
        category: TASK_CATEGORY,
        label: 'Restart Running Task...'
    });
})(TaskCommands = exports.TaskCommands || (exports.TaskCommands = {}));
const TASKS_STORAGE_KEY = 'tasks';
let TaskFrontendContribution = class TaskFrontendContribution {
    init() {
        this.taskWatcher.onTaskCreated(() => this.updateRunningTasksItem());
        this.taskWatcher.onTaskExit(() => this.updateRunningTasksItem());
    }
    onStart() {
        this.contributionProvider.getContributions().forEach(contrib => {
            if (contrib.registerResolvers) {
                contrib.registerResolvers(this.taskResolverRegistry);
            }
            if (contrib.registerProviders) {
                contrib.registerProviders(this.taskProviderRegistry);
            }
        });
        this.schemaUpdater.update();
        this.storageService.getData(TASKS_STORAGE_KEY, { recent: [] })
            .then(tasks => this.taskService.recentTasks = tasks.recent);
    }
    onStop() {
        const recent = this.taskService.recentTasks;
        this.storageService.setData(TASKS_STORAGE_KEY, { recent });
    }
    /**
     * Contribute a status-bar item to trigger
     * the `Show Running Tasks` command.
     */
    async updateRunningTasksItem() {
        const id = 'show-running-tasks';
        const items = await this.taskService.getRunningTasks();
        if (!!items.length) {
            this.statusBar.setElement(id, {
                text: `$(tools) ${items.length}`,
                tooltip: TaskCommands.TASK_SHOW_RUNNING.label,
                alignment: browser_1.StatusBarAlignment.LEFT,
                priority: 2,
                command: TaskCommands.TASK_SHOW_RUNNING.id,
            });
        }
        else {
            this.statusBar.removeElement(id);
        }
    }
    registerCommands(registry) {
        registry.registerCommand(TaskCommands.WORKBENCH_RUN_TASK, {
            isEnabled: () => true,
            execute: async (label) => {
                const didExecute = await this.taskService.runTaskByLabel(this.taskService.startUserAction(), label);
                if (!didExecute) {
                    this.quickOpenTask.open();
                }
            }
        });
        registry.registerCommand(TaskCommands.TASK_RUN, {
            isEnabled: () => true,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            execute: (...args) => {
                const [source, label, scope] = args;
                if (source && label) {
                    return this.taskService.run(this.taskService.startUserAction(), source, label, scope);
                }
                return this.quickOpenTask.open();
            }
        });
        registry.registerCommand(TaskCommands.TASK_RUN_BUILD, {
            isEnabled: () => this.workspaceService.opened,
            execute: () => this.quickOpenTask.runBuildOrTestTask('build')
        });
        registry.registerCommand(TaskCommands.TASK_RUN_TEST, {
            isEnabled: () => this.workspaceService.opened,
            execute: () => this.quickOpenTask.runBuildOrTestTask('test')
        });
        registry.registerCommand(TaskCommands.TASK_ATTACH, {
            isEnabled: () => true,
            execute: () => this.quickOpenTask.attach()
        });
        registry.registerCommand(TaskCommands.TASK_RUN_LAST, {
            execute: async () => {
                if (!await this.taskService.runLastTask(this.taskService.startUserAction())) {
                    await this.quickOpenTask.open();
                }
            }
        });
        registry.registerCommand(TaskCommands.TASK_RUN_TEXT, {
            isVisible: () => !!this.editorManager.currentEditor,
            isEnabled: () => !!this.editorManager.currentEditor,
            execute: () => this.taskService.runSelectedText()
        });
        registry.registerCommand(TaskCommands.TASK_CONFIGURE, {
            execute: () => this.quickOpenTask.configure()
        });
        registry.registerCommand(TaskCommands.TASK_OPEN_USER, {
            execute: () => {
                this.taskService.openUserTasks();
            }
        });
        registry.registerCommand(TaskCommands.TASK_CLEAR_HISTORY, {
            execute: () => this.taskService.clearRecentTasks()
        });
        registry.registerCommand(TaskCommands.TASK_SHOW_RUNNING, {
            execute: () => this.taskRunningQuickOpen.open()
        });
        registry.registerCommand(TaskCommands.TASK_TERMINATE, {
            execute: () => this.taskTerminateQuickOpen.open()
        });
        registry.registerCommand(TaskCommands.TASK_RESTART_RUNNING, {
            execute: () => this.taskRestartRunningQuickOpen.open()
        });
    }
    registerMenus(menus) {
        menus.registerMenuAction(terminal_frontend_contribution_1.TerminalMenus.TERMINAL_TASKS, {
            commandId: TaskCommands.TASK_RUN.id,
            order: '0'
        });
        menus.registerMenuAction(terminal_frontend_contribution_1.TerminalMenus.TERMINAL_TASKS, {
            commandId: TaskCommands.TASK_RUN_BUILD.id,
            order: '1'
        });
        menus.registerMenuAction(terminal_frontend_contribution_1.TerminalMenus.TERMINAL_TASKS, {
            commandId: TaskCommands.TASK_RUN_TEST.id,
            order: '2'
        });
        menus.registerMenuAction(terminal_frontend_contribution_1.TerminalMenus.TERMINAL_TASKS, {
            commandId: TaskCommands.TASK_RUN_LAST.id,
            order: '3'
        });
        menus.registerMenuAction(terminal_frontend_contribution_1.TerminalMenus.TERMINAL_TASKS, {
            commandId: TaskCommands.TASK_ATTACH.id,
            order: '4'
        });
        menus.registerMenuAction(terminal_frontend_contribution_1.TerminalMenus.TERMINAL_TASKS, {
            commandId: TaskCommands.TASK_RUN_TEXT.id,
            order: '5'
        });
        menus.registerMenuAction(terminal_frontend_contribution_1.TerminalMenus.TERMINAL_TASKS_INFO, {
            commandId: TaskCommands.TASK_SHOW_RUNNING.id,
            label: TaskCommands.TASK_SHOW_RUNNING.label + '...',
            order: '0'
        });
        menus.registerMenuAction(terminal_frontend_contribution_1.TerminalMenus.TERMINAL_TASKS_INFO, {
            commandId: TaskCommands.TASK_RESTART_RUNNING.id,
            label: TaskCommands.TASK_RESTART_RUNNING.label,
            order: '1'
        });
        menus.registerMenuAction(terminal_frontend_contribution_1.TerminalMenus.TERMINAL_TASKS_INFO, {
            commandId: TaskCommands.TASK_TERMINATE.id,
            label: TaskCommands.TASK_TERMINATE.label + '...',
            order: '2'
        });
        menus.registerMenuAction(terminal_frontend_contribution_1.TerminalMenus.TERMINAL_TASKS_CONFIG, {
            commandId: TaskCommands.TASK_CONFIGURE.id,
            order: '0'
        });
    }
    registerQuickAccessProvider() {
        this.quickOpenTask.registerQuickAccessProvider();
    }
    registerKeybindings(keybindings) {
        keybindings.registerKeybinding({
            command: TaskCommands.TASK_RUN_LAST.id,
            keybinding: 'ctrlcmd+shift+k',
            when: '!textInputFocus || editorReadonly'
        });
    }
};
__decorate([
    (0, inversify_1.inject)(quick_open_task_1.QuickOpenTask),
    __metadata("design:type", quick_open_task_1.QuickOpenTask)
], TaskFrontendContribution.prototype, "quickOpenTask", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.EditorManager),
    __metadata("design:type", browser_2.EditorManager)
], TaskFrontendContribution.prototype, "editorManager", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.FrontendApplication),
    __metadata("design:type", browser_1.FrontendApplication)
], TaskFrontendContribution.prototype, "app", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.ILogger),
    (0, inversify_1.named)('task'),
    __metadata("design:type", Object)
], TaskFrontendContribution.prototype, "logger", void 0);
__decorate([
    (0, inversify_1.inject)(widget_manager_1.WidgetManager),
    __metadata("design:type", widget_manager_1.WidgetManager)
], TaskFrontendContribution.prototype, "widgetManager", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.ContributionProvider),
    (0, inversify_1.named)(task_contribution_1.TaskContribution),
    __metadata("design:type", Object)
], TaskFrontendContribution.prototype, "contributionProvider", void 0);
__decorate([
    (0, inversify_1.inject)(task_contribution_1.TaskProviderRegistry),
    __metadata("design:type", task_contribution_1.TaskProviderRegistry)
], TaskFrontendContribution.prototype, "taskProviderRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(task_contribution_1.TaskResolverRegistry),
    __metadata("design:type", task_contribution_1.TaskResolverRegistry)
], TaskFrontendContribution.prototype, "taskResolverRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(task_service_1.TaskService),
    __metadata("design:type", task_service_1.TaskService)
], TaskFrontendContribution.prototype, "taskService", void 0);
__decorate([
    (0, inversify_1.inject)(task_schema_updater_1.TaskSchemaUpdater),
    __metadata("design:type", task_schema_updater_1.TaskSchemaUpdater)
], TaskFrontendContribution.prototype, "schemaUpdater", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.StorageService),
    __metadata("design:type", Object)
], TaskFrontendContribution.prototype, "storageService", void 0);
__decorate([
    (0, inversify_1.inject)(quick_open_task_1.TaskRunningQuickOpen),
    __metadata("design:type", quick_open_task_1.TaskRunningQuickOpen)
], TaskFrontendContribution.prototype, "taskRunningQuickOpen", void 0);
__decorate([
    (0, inversify_1.inject)(quick_open_task_1.TaskTerminateQuickOpen),
    __metadata("design:type", quick_open_task_1.TaskTerminateQuickOpen)
], TaskFrontendContribution.prototype, "taskTerminateQuickOpen", void 0);
__decorate([
    (0, inversify_1.inject)(quick_open_task_1.TaskRestartRunningQuickOpen),
    __metadata("design:type", quick_open_task_1.TaskRestartRunningQuickOpen)
], TaskFrontendContribution.prototype, "taskRestartRunningQuickOpen", void 0);
__decorate([
    (0, inversify_1.inject)(common_2.TaskWatcher),
    __metadata("design:type", common_2.TaskWatcher)
], TaskFrontendContribution.prototype, "taskWatcher", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.StatusBar),
    __metadata("design:type", Object)
], TaskFrontendContribution.prototype, "statusBar", void 0);
__decorate([
    (0, inversify_1.inject)(workspace_service_1.WorkspaceService),
    __metadata("design:type", workspace_service_1.WorkspaceService)
], TaskFrontendContribution.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TaskFrontendContribution.prototype, "init", null);
TaskFrontendContribution = __decorate([
    (0, inversify_1.injectable)()
], TaskFrontendContribution);
exports.TaskFrontendContribution = TaskFrontendContribution;
//# sourceMappingURL=task-frontend-contribution.js.map