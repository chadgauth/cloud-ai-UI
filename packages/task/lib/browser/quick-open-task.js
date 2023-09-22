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
var QuickOpenTask_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskRestartRunningQuickOpen = exports.RunningTaskQuickOpenItem = exports.TaskRunningQuickOpen = exports.TaskTerminateQuickOpen = exports.TaskConfigureQuickOpenItem = exports.ConfigureBuildOrTestTaskQuickOpenItem = exports.TaskRunQuickOpenItem = exports.QuickOpenTask = exports.SHOW_ALL = exports.NO_TASK_TO_RUN = exports.CONFIGURE_A_TASK = exports.CHOOSE_TASK = exports.TaskEntry = exports.ConfigureTaskAction = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const task_service_1 = require("./task-service");
const task_protocol_1 = require("../common/task-protocol");
const task_definition_registry_1 = require("./task-definition-registry");
const uri_1 = require("@theia/core/lib/common/uri");
const browser_1 = require("@theia/core/lib/browser");
const browser_2 = require("@theia/workspace/lib/browser");
const terminal_service_1 = require("@theia/terminal/lib/browser/base/terminal-service");
const provided_task_configurations_1 = require("./provided-task-configurations");
const task_name_resolver_1 = require("./task-name-resolver");
const task_source_resolver_1 = require("./task-source-resolver");
const task_configuration_manager_1 = require("./task-configuration-manager");
const quick_input_service_1 = require("@theia/core/lib/browser/quick-input/quick-input-service");
const nls_1 = require("@theia/core/lib/common/nls");
const pickerQuickAccess_1 = require("@theia/monaco-editor-core/esm/vs/platform/quickinput/browser/pickerQuickAccess");
var ConfigureTaskAction;
(function (ConfigureTaskAction) {
    ConfigureTaskAction.ID = 'workbench.action.tasks.configureTaskRunner';
    ConfigureTaskAction.TEXT = 'Configure Task';
})(ConfigureTaskAction = exports.ConfigureTaskAction || (exports.ConfigureTaskAction = {}));
var TaskEntry;
(function (TaskEntry) {
    function isQuickPickValue(item) {
        return 'value' in item && typeof item.value === 'string';
    }
    TaskEntry.isQuickPickValue = isQuickPickValue;
})(TaskEntry = exports.TaskEntry || (exports.TaskEntry = {}));
exports.CHOOSE_TASK = nls_1.nls.localizeByDefault('Select the task to run');
exports.CONFIGURE_A_TASK = nls_1.nls.localizeByDefault('Configure a Task');
exports.NO_TASK_TO_RUN = nls_1.nls.localize('theia/task/noTaskToRun', 'No task to run found. Configure Tasks...');
exports.SHOW_ALL = nls_1.nls.localizeByDefault('Show All Tasks...');
let QuickOpenTask = QuickOpenTask_1 = class QuickOpenTask {
    constructor() {
        this.description = 'Run Task';
        this.items = [];
    }
    init() {
        return this.doInit(this.taskService.startUserAction());
    }
    async doInit(token) {
        const recentTasks = this.taskService.recentTasks;
        const configuredTasks = await this.taskService.getConfiguredTasks(token);
        const providedTypes = this.taskDefinitionRegistry.getAll();
        const { filteredRecentTasks, filteredConfiguredTasks } = this.getFilteredTasks(recentTasks, configuredTasks, []);
        const isMulti = this.workspaceService.isMultiRootWorkspaceOpened;
        this.items = [];
        const filteredRecentTasksItems = this.getItems(filteredRecentTasks, 'recently used tasks', token, isMulti);
        const filteredConfiguredTasksItems = this.getItems(filteredConfiguredTasks, 'configured tasks', token, isMulti, {
            label: `$(plus) ${exports.CONFIGURE_A_TASK}`,
            execute: () => this.configure()
        });
        const providedTypeItems = this.createProvidedTypeItems(providedTypes);
        this.items.push(...filteredRecentTasksItems, ...filteredConfiguredTasksItems, ...providedTypeItems);
        if (!this.items.length) {
            this.items.push(({
                label: exports.NO_TASK_TO_RUN,
                execute: () => this.configure()
            }));
        }
    }
    createProvidedTypeItems(providedTypes) {
        const result = [];
        result.push({ type: 'separator', label: nls_1.nls.localizeByDefault('contributed') });
        providedTypes.sort((t1, t2) => t1.taskType.localeCompare(t2.taskType));
        for (const definition of providedTypes) {
            const type = definition.taskType;
            result.push(this.toProvidedTaskTypeEntry(type, `$(folder) ${type}`));
        }
        result.push(this.toProvidedTaskTypeEntry(exports.SHOW_ALL, exports.SHOW_ALL));
        return result;
    }
    toProvidedTaskTypeEntry(type, label) {
        return {
            label,
            value: type,
            /**
             * This function is used in the context of a QuickAccessProvider (triggered from the command palette: '?task').
             * It triggers a call to QuickOpenTask#getPicks,
             * the 'execute' function below is called when the user selects an entry for a task type which triggers the display of
             * the second level quick pick.
             *
             * Due to the asynchronous resolution of second-level tasks, there may be a delay in showing the quick input widget.
             *
             * NOTE: The widget is not delayed in other contexts e.g. by commands (Run Tasks), see the implementation at QuickOpenTask#open
             *
             * To improve the performance, we may consider using a `PickerQuickAccessProvider` instead of a `QuickAccessProvider`,
             * and support providing 'FastAndSlowPicks'.
             *
             * TODO: Consider the introduction and exposure of monaco `PickerQuickAccessProvider` and the corresponding refactoring for this and other
             * users of QuickAccessProvider.
             */
            execute: () => {
                this.doSecondLevel(type);
            }
        };
    }
    onDidTriggerGearIcon(item) {
        if (item instanceof TaskRunQuickOpenItem) {
            this.taskService.configure(item.token, item.task);
            this.quickInputService.hide();
        }
    }
    async open() {
        this.showMultiLevelQuickPick();
    }
    async showMultiLevelQuickPick(skipInit) {
        if (!skipInit) {
            await this.init();
        }
        const picker = this.quickInputService.createQuickPick();
        picker.placeholder = exports.CHOOSE_TASK;
        picker.matchOnDescription = true;
        picker.ignoreFocusOut = false;
        picker.items = this.items;
        const firstLevelTask = await this.doPickerFirstLevel(picker);
        if (!!firstLevelTask && TaskEntry.isQuickPickValue(firstLevelTask)) {
            // A taskType was selected
            picker.busy = true;
            await this.doSecondLevel(firstLevelTask.value);
        }
        else if (!!firstLevelTask && 'execute' in firstLevelTask && typeof firstLevelTask.execute === 'function') {
            firstLevelTask.execute();
        }
        picker.dispose();
    }
    async doPickerFirstLevel(picker) {
        picker.show();
        const firstLevelPickerResult = await new Promise(resolve => {
            picker.onDidAccept(async () => {
                resolve(picker.selectedItems ? picker.selectedItems[0] : undefined);
            });
        });
        return firstLevelPickerResult !== null && firstLevelPickerResult !== void 0 ? firstLevelPickerResult : undefined;
    }
    async doSecondLevel(taskType) {
        var _a;
        // Resolve Second level tasks based on selected TaskType
        const isMulti = this.workspaceService.isMultiRootWorkspaceOpened;
        const token = this.taskService.startUserAction();
        const providedTasks = taskType === exports.SHOW_ALL ?
            await this.taskService.getProvidedTasks(token, provided_task_configurations_1.ALL_TASK_TYPES) :
            await this.taskService.getProvidedTasks(token, taskType);
        const providedTasksItems = this.getItems(providedTasks, taskType + ' tasks', token, isMulti);
        const label = providedTasksItems.length ?
            nls_1.nls.localizeByDefault('Go back ↩') :
            nls_1.nls.localizeByDefault('No {0} tasks found. Go back ↩', taskType);
        providedTasksItems.push(({
            label,
            execute: () => this.showMultiLevelQuickPick(true)
        }));
        (_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.showQuickPick(providedTasksItems, { placeholder: exports.CHOOSE_TASK });
    }
    attach() {
        this.items = [];
        const isMulti = this.workspaceService.isMultiRootWorkspaceOpened;
        this.taskService.getRunningTasks().then(tasks => {
            var _a;
            if (!tasks.length) {
                this.items.push({
                    label: 'No tasks found',
                });
            }
            else {
                tasks.forEach((task) => {
                    // can only attach to terminal processes, so only list those
                    if (task.terminalId) {
                        this.items.push(new RunningTaskQuickOpenItem(task, this.taskService, this.taskNameResolver, this.taskSourceResolver, this.taskDefinitionRegistry, this.labelProvider, isMulti, () => this.taskService.attach(task.terminalId, task)));
                    }
                });
            }
            if (this.items.length === 0) {
                this.items.push(({
                    label: 'No tasks found'
                }));
            }
            (_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.showQuickPick(this.items, { placeholder: exports.CHOOSE_TASK });
        });
    }
    async configure() {
        var _a;
        (_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.pick(this.resolveItemsToConfigure(), { placeHolder: nls_1.nls.localizeByDefault('Select a task to configure') }).then(async (item) => {
            if (item && 'execute' in item && typeof item.execute === 'function') {
                item.execute();
            }
        });
    }
    async resolveItemsToConfigure() {
        const items = [];
        const isMulti = this.workspaceService.isMultiRootWorkspaceOpened;
        const token = this.taskService.startUserAction();
        const configuredTasks = await this.taskService.getConfiguredTasks(token);
        const providedTasks = await this.taskService.getProvidedTasks(token, provided_task_configurations_1.ALL_TASK_TYPES);
        // check if tasks.json exists. If not, display "Create tasks.json file from template"
        // If tasks.json exists and empty, display 'Open tasks.json file'
        const { filteredConfiguredTasks, filteredProvidedTasks } = this.getFilteredTasks([], configuredTasks, providedTasks);
        const groupedTasks = this.getGroupedTasksByWorkspaceFolder([...filteredConfiguredTasks, ...filteredProvidedTasks]);
        if (groupedTasks.has(task_protocol_1.TaskScope.Global.toString())) {
            const configs = groupedTasks.get(task_protocol_1.TaskScope.Global.toString());
            this.addConfigurationItems(items, configs, token, isMulti);
        }
        if (groupedTasks.has(task_protocol_1.TaskScope.Workspace.toString())) {
            const configs = groupedTasks.get(task_protocol_1.TaskScope.Workspace.toString());
            this.addConfigurationItems(items, configs, token, isMulti);
        }
        const rootUris = (await this.workspaceService.roots).map(rootStat => rootStat.resource.toString());
        for (const rootFolder of rootUris) {
            const folderName = new uri_1.default(rootFolder).displayName;
            if (groupedTasks.has(rootFolder)) {
                const configs = groupedTasks.get(rootFolder.toString());
                this.addConfigurationItems(items, configs, token, isMulti);
            }
            else {
                const { configUri } = this.preferences.resolve('tasks', [], rootFolder);
                const existTaskConfigFile = !!configUri;
                items.push(({
                    label: existTaskConfigFile ? 'Open tasks.json file' : 'Create tasks.json file from template',
                    execute: () => {
                        setTimeout(() => this.taskConfigurationManager.openConfiguration(rootFolder));
                    }
                }));
            }
            if (items.length > 0) {
                items.unshift({
                    type: 'separator',
                    label: isMulti ? folderName : ''
                });
            }
        }
        if (items.length === 0) {
            items.push(({
                label: 'No tasks found'
            }));
        }
        return items;
    }
    addConfigurationItems(items, configs, token, isMulti) {
        items.push(...configs.map(taskConfig => {
            const item = new TaskConfigureQuickOpenItem(token, taskConfig, this.taskService, this.taskNameResolver, this.workspaceService, isMulti);
            item['taskDefinitionRegistry'] = this.taskDefinitionRegistry;
            return item;
        }).sort((t1, t2) => t1.label.localeCompare(t2.label)));
    }
    getTaskItems() {
        return this.items.filter((item) => item.type !== 'separator' && item.task !== undefined);
    }
    async runBuildOrTestTask(buildOrTestType) {
        var _a;
        const shouldRunBuildTask = buildOrTestType === 'build';
        const token = this.taskService.startUserAction();
        await this.doInit(token);
        const taskItems = this.getTaskItems();
        if (taskItems.length > 0) { // the item in `this.items` is not 'No tasks found'
            const buildOrTestTasks = taskItems.filter((t) => shouldRunBuildTask ? task_protocol_1.TaskCustomization.isBuildTask(t.task) : task_protocol_1.TaskCustomization.isTestTask(t.task));
            if (buildOrTestTasks.length > 0) { // build / test tasks are defined in the workspace
                const defaultBuildOrTestTasks = buildOrTestTasks.filter((t) => shouldRunBuildTask ? task_protocol_1.TaskCustomization.isDefaultBuildTask(t.task) : task_protocol_1.TaskCustomization.isDefaultTestTask(t.task));
                if (defaultBuildOrTestTasks.length === 1) { // run the default build / test task
                    const defaultBuildOrTestTask = defaultBuildOrTestTasks[0];
                    const taskToRun = defaultBuildOrTestTask.task;
                    const scope = taskToRun._scope;
                    if (this.taskDefinitionRegistry && !!this.taskDefinitionRegistry.getDefinition(taskToRun)) {
                        this.taskService.run(token, taskToRun.source, taskToRun.label, scope);
                    }
                    else {
                        this.taskService.run(token, taskToRun._source, taskToRun.label, scope);
                    }
                    return;
                }
                // if default build / test task is not found, or there are more than one default,
                // display the list of build /test tasks to let the user decide which to run
                this.items = buildOrTestTasks;
            }
            else { // no build / test tasks, display an action item to configure the build / test task
                this.items = [({
                        label: `No ${buildOrTestType} task to run found. Configure ${buildOrTestType.charAt(0).toUpperCase() + buildOrTestType.slice(1)} Task...`,
                        execute: () => {
                            this.doInit(token).then(() => {
                                var _a;
                                // update the `tasks.json` file, instead of running the task itself
                                this.items = this.getTaskItems().map((item) => new ConfigureBuildOrTestTaskQuickOpenItem(token, item.task, this.taskService, this.workspaceService.isMultiRootWorkspaceOpened, this.taskNameResolver, shouldRunBuildTask, this.taskConfigurationManager, this.taskDefinitionRegistry, this.taskSourceResolver));
                                (_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.showQuickPick(this.items, { placeholder: `Select the task to be used as the default ${buildOrTestType} task` });
                            });
                        }
                    })];
            }
        }
        else { // no tasks are currently present, prompt users if they'd like to configure a task.
            this.items = [{
                    label: `No ${buildOrTestType} task to run found. Configure ${buildOrTestType.charAt(0).toUpperCase() + buildOrTestType.slice(1)} Task...`,
                    execute: () => this.configure()
                }];
        }
        (_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.showQuickPick(this.items, {
            placeholder: `Select the ${buildOrTestType} task to run`,
            onDidTriggerItemButton: ({ item }) => this.onDidTriggerGearIcon(item)
        });
    }
    async getPicks(filter, token) {
        await this.init();
        return (0, quick_input_service_1.filterItems)(this.items, filter);
    }
    registerQuickAccessProvider() {
        this.quickAccessRegistry.registerQuickAccessProvider({
            getInstance: () => this,
            prefix: QuickOpenTask_1.PREFIX,
            placeholder: 'Select the task to run',
            helpEntries: [{ description: 'Run Task', needsEditor: false }]
        });
    }
    getRunningTaskLabel(task) {
        return `Task id: ${task.taskId}, label: ${task.config.label}`;
    }
    getItems(tasks, groupLabel, token, isMulti, defaultTask) {
        const items = tasks.map(task => new TaskRunQuickOpenItem(token, task, this.taskService, isMulti, this.taskDefinitionRegistry, this.taskNameResolver, this.taskSourceResolver, this.taskConfigurationManager, [{
                iconClass: 'codicon-gear',
                tooltip: 'Configure Task',
            }])).sort((t1, t2) => {
            var _a, _b;
            let result = ((_a = t1.description) !== null && _a !== void 0 ? _a : '').localeCompare((_b = t2.description) !== null && _b !== void 0 ? _b : '');
            if (result === 0) {
                result = t1.label.localeCompare(t2.label);
            }
            return result;
        });
        if (items.length === 0 && defaultTask) {
            items.push(defaultTask);
        }
        if (items.length > 0) {
            items.unshift({ type: 'separator', label: groupLabel });
        }
        return items;
    }
    getFilteredTasks(recentTasks, configuredTasks, providedTasks) {
        const filteredRecentTasks = [];
        recentTasks.forEach(recent => {
            const originalTaskConfig = [...configuredTasks, ...providedTasks].find(t => this.taskDefinitionRegistry.compareTasks(recent, t));
            if (originalTaskConfig) {
                filteredRecentTasks.push(originalTaskConfig);
            }
        });
        const filteredProvidedTasks = [];
        providedTasks.forEach(provided => {
            const exist = [...filteredRecentTasks, ...configuredTasks].some(t => this.taskDefinitionRegistry.compareTasks(provided, t));
            if (!exist) {
                filteredProvidedTasks.push(provided);
            }
        });
        const filteredConfiguredTasks = [];
        configuredTasks.forEach(configured => {
            const exist = filteredRecentTasks.some(t => this.taskDefinitionRegistry.compareTasks(configured, t));
            if (!exist) {
                filteredConfiguredTasks.push(configured);
            }
        });
        return {
            filteredRecentTasks, filteredConfiguredTasks, filteredProvidedTasks
        };
    }
    getGroupedTasksByWorkspaceFolder(tasks) {
        const grouped = new Map();
        for (const task of tasks) {
            const scope = task._scope;
            if (grouped.has(scope.toString())) {
                grouped.get(scope.toString()).push(task);
            }
            else {
                grouped.set(scope.toString(), [task]);
            }
        }
        for (const taskConfigs of grouped.values()) {
            taskConfigs.sort((t1, t2) => t1.label.localeCompare(t2.label));
        }
        return grouped;
    }
};
QuickOpenTask.PREFIX = 'task ';
__decorate([
    (0, inversify_1.inject)(task_service_1.TaskService),
    __metadata("design:type", task_service_1.TaskService)
], QuickOpenTask.prototype, "taskService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.QuickInputService),
    (0, inversify_1.optional)(),
    __metadata("design:type", Object)
], QuickOpenTask.prototype, "quickInputService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.QuickAccessRegistry),
    __metadata("design:type", Object)
], QuickOpenTask.prototype, "quickAccessRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.WorkspaceService),
    __metadata("design:type", browser_2.WorkspaceService)
], QuickOpenTask.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(task_definition_registry_1.TaskDefinitionRegistry),
    __metadata("design:type", task_definition_registry_1.TaskDefinitionRegistry)
], QuickOpenTask.prototype, "taskDefinitionRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(task_name_resolver_1.TaskNameResolver),
    __metadata("design:type", task_name_resolver_1.TaskNameResolver)
], QuickOpenTask.prototype, "taskNameResolver", void 0);
__decorate([
    (0, inversify_1.inject)(task_source_resolver_1.TaskSourceResolver),
    __metadata("design:type", task_source_resolver_1.TaskSourceResolver)
], QuickOpenTask.prototype, "taskSourceResolver", void 0);
__decorate([
    (0, inversify_1.inject)(task_configuration_manager_1.TaskConfigurationManager),
    __metadata("design:type", task_configuration_manager_1.TaskConfigurationManager)
], QuickOpenTask.prototype, "taskConfigurationManager", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.PreferenceService),
    __metadata("design:type", Object)
], QuickOpenTask.prototype, "preferences", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.LabelProvider),
    __metadata("design:type", browser_1.LabelProvider)
], QuickOpenTask.prototype, "labelProvider", void 0);
QuickOpenTask = QuickOpenTask_1 = __decorate([
    (0, inversify_1.injectable)()
], QuickOpenTask);
exports.QuickOpenTask = QuickOpenTask;
class TaskRunQuickOpenItem {
    constructor(token, task, taskService, isMulti, taskDefinitionRegistry, taskNameResolver, taskSourceResolver, taskConfigurationManager, buttons) {
        this.token = token;
        this.task = task;
        this.taskService = taskService;
        this.isMulti = isMulti;
        this.taskDefinitionRegistry = taskDefinitionRegistry;
        this.taskNameResolver = taskNameResolver;
        this.taskSourceResolver = taskSourceResolver;
        this.taskConfigurationManager = taskConfigurationManager;
        this.buttons = buttons;
    }
    get label() {
        return this.taskNameResolver.resolve(this.task);
    }
    get description() {
        return renderScope(this.task._scope, this.isMulti);
    }
    get detail() {
        return this.task.detail;
    }
    execute() {
        const scope = this.task._scope;
        if (this.taskDefinitionRegistry && !!this.taskDefinitionRegistry.getDefinition(this.task)) {
            this.taskService.run(this.token, this.task.source || this.task._source, this.task.label, scope);
        }
        else {
            this.taskService.run(this.token, this.task._source, this.task.label, scope);
        }
    }
    trigger() {
        this.taskService.configure(this.token, this.task);
        return pickerQuickAccess_1.TriggerAction.CLOSE_PICKER;
    }
}
exports.TaskRunQuickOpenItem = TaskRunQuickOpenItem;
class ConfigureBuildOrTestTaskQuickOpenItem extends TaskRunQuickOpenItem {
    constructor(token, task, taskService, isMulti, taskNameResolver, isBuildTask, taskConfigurationManager, taskDefinitionRegistry, taskSourceResolver) {
        super(token, task, taskService, isMulti, taskDefinitionRegistry, taskNameResolver, taskSourceResolver, taskConfigurationManager);
        this.isBuildTask = isBuildTask;
    }
    execute() {
        this.taskService.updateTaskConfiguration(this.token, this.task, { group: { kind: this.isBuildTask ? 'build' : 'test', isDefault: true } })
            .then(() => {
            if (this.task._scope) {
                this.taskConfigurationManager.openConfiguration(this.task._scope);
            }
        });
    }
}
exports.ConfigureBuildOrTestTaskQuickOpenItem = ConfigureBuildOrTestTaskQuickOpenItem;
function renderScope(scope, isMulti) {
    if (typeof scope === 'string') {
        if (isMulti) {
            return new uri_1.default(scope).displayName;
        }
        else {
            return '';
        }
    }
    else {
        return task_protocol_1.TaskScope[scope];
    }
}
class TaskConfigureQuickOpenItem {
    constructor(token, task, taskService, taskNameResolver, workspaceService, isMulti) {
        this.token = token;
        this.task = task;
        this.taskService = taskService;
        this.taskNameResolver = taskNameResolver;
        this.workspaceService = workspaceService;
        this.isMulti = isMulti;
        const stat = this.workspaceService.workspace;
        this.isMulti = stat ? !stat.isDirectory : false;
    }
    get label() {
        return this.taskNameResolver.resolve(this.task);
    }
    get description() {
        return renderScope(this.task._scope, this.isMulti);
    }
    accept() {
        this.execute();
    }
    execute() {
        this.taskService.configure(this.token, this.task);
    }
}
exports.TaskConfigureQuickOpenItem = TaskConfigureQuickOpenItem;
let TaskTerminateQuickOpen = class TaskTerminateQuickOpen {
    async getItems() {
        const items = [];
        const runningTasks = await this.taskService.getRunningTasks();
        const isMulti = this.workspaceService.isMultiRootWorkspaceOpened;
        if (runningTasks.length <= 0) {
            items.push(({
                label: 'No task is currently running',
            }));
        }
        else {
            runningTasks.forEach((task) => {
                items.push(new RunningTaskQuickOpenItem(task, this.taskService, this.taskNameResolver, this.taskSourceResolver, this.taskDefinitionRegistry, this.labelProvider, isMulti, () => this.taskService.kill(task.taskId)));
            });
            if (runningTasks.length > 1) {
                items.push(({
                    label: 'All running tasks',
                    execute: () => {
                        runningTasks.forEach((t) => {
                            this.taskService.kill(t.taskId);
                        });
                    }
                }));
            }
        }
        return items;
    }
    async open() {
        var _a;
        const items = await this.getItems();
        (_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.showQuickPick(items, { placeholder: 'Select task to terminate' });
    }
};
__decorate([
    (0, inversify_1.inject)(browser_1.LabelProvider),
    __metadata("design:type", browser_1.LabelProvider)
], TaskTerminateQuickOpen.prototype, "labelProvider", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.QuickInputService),
    (0, inversify_1.optional)(),
    __metadata("design:type", Object)
], TaskTerminateQuickOpen.prototype, "quickInputService", void 0);
__decorate([
    (0, inversify_1.inject)(task_definition_registry_1.TaskDefinitionRegistry),
    __metadata("design:type", task_definition_registry_1.TaskDefinitionRegistry)
], TaskTerminateQuickOpen.prototype, "taskDefinitionRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(task_name_resolver_1.TaskNameResolver),
    __metadata("design:type", task_name_resolver_1.TaskNameResolver)
], TaskTerminateQuickOpen.prototype, "taskNameResolver", void 0);
__decorate([
    (0, inversify_1.inject)(task_source_resolver_1.TaskSourceResolver),
    __metadata("design:type", task_source_resolver_1.TaskSourceResolver)
], TaskTerminateQuickOpen.prototype, "taskSourceResolver", void 0);
__decorate([
    (0, inversify_1.inject)(task_service_1.TaskService),
    __metadata("design:type", task_service_1.TaskService)
], TaskTerminateQuickOpen.prototype, "taskService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.WorkspaceService),
    __metadata("design:type", browser_2.WorkspaceService)
], TaskTerminateQuickOpen.prototype, "workspaceService", void 0);
TaskTerminateQuickOpen = __decorate([
    (0, inversify_1.injectable)()
], TaskTerminateQuickOpen);
exports.TaskTerminateQuickOpen = TaskTerminateQuickOpen;
let TaskRunningQuickOpen = class TaskRunningQuickOpen {
    async getItems() {
        const items = [];
        const runningTasks = await this.taskService.getRunningTasks();
        const isMulti = this.workspaceService.isMultiRootWorkspaceOpened;
        if (runningTasks.length <= 0) {
            items.push(({
                label: 'No task is currently running',
            }));
        }
        else {
            runningTasks.forEach((task) => {
                items.push(new RunningTaskQuickOpenItem(task, this.taskService, this.taskNameResolver, this.taskSourceResolver, this.taskDefinitionRegistry, this.labelProvider, isMulti, () => {
                    if (task.terminalId) {
                        const terminal = this.terminalService.getByTerminalId(task.terminalId);
                        if (terminal) {
                            this.terminalService.open(terminal);
                        }
                    }
                }));
            });
        }
        return items;
    }
    async open() {
        var _a;
        const items = await this.getItems();
        (_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.showQuickPick(items, { placeholder: 'Select the task to show its output' });
    }
};
__decorate([
    (0, inversify_1.inject)(browser_1.LabelProvider),
    __metadata("design:type", browser_1.LabelProvider)
], TaskRunningQuickOpen.prototype, "labelProvider", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.QuickInputService),
    (0, inversify_1.optional)(),
    __metadata("design:type", Object)
], TaskRunningQuickOpen.prototype, "quickInputService", void 0);
__decorate([
    (0, inversify_1.inject)(task_definition_registry_1.TaskDefinitionRegistry),
    __metadata("design:type", task_definition_registry_1.TaskDefinitionRegistry)
], TaskRunningQuickOpen.prototype, "taskDefinitionRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(task_name_resolver_1.TaskNameResolver),
    __metadata("design:type", task_name_resolver_1.TaskNameResolver)
], TaskRunningQuickOpen.prototype, "taskNameResolver", void 0);
__decorate([
    (0, inversify_1.inject)(task_source_resolver_1.TaskSourceResolver),
    __metadata("design:type", task_source_resolver_1.TaskSourceResolver)
], TaskRunningQuickOpen.prototype, "taskSourceResolver", void 0);
__decorate([
    (0, inversify_1.inject)(task_service_1.TaskService),
    __metadata("design:type", task_service_1.TaskService)
], TaskRunningQuickOpen.prototype, "taskService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.WorkspaceService),
    __metadata("design:type", browser_2.WorkspaceService)
], TaskRunningQuickOpen.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(terminal_service_1.TerminalService),
    __metadata("design:type", Object)
], TaskRunningQuickOpen.prototype, "terminalService", void 0);
TaskRunningQuickOpen = __decorate([
    (0, inversify_1.injectable)()
], TaskRunningQuickOpen);
exports.TaskRunningQuickOpen = TaskRunningQuickOpen;
class RunningTaskQuickOpenItem {
    constructor(taskInfo, taskService, taskNameResolver, taskSourceResolver, taskDefinitionRegistry, labelProvider, isMulti, execute) {
        this.taskInfo = taskInfo;
        this.taskService = taskService;
        this.taskNameResolver = taskNameResolver;
        this.taskSourceResolver = taskSourceResolver;
        this.taskDefinitionRegistry = taskDefinitionRegistry;
        this.labelProvider = labelProvider;
        this.isMulti = isMulti;
        this.execute = execute;
    }
    get label() {
        return this.taskNameResolver.resolve(this.taskInfo.config);
    }
    get description() {
        return renderScope(this.taskInfo.config._scope, this.isMulti);
    }
    get detail() {
        return this.taskInfo.config.detail;
    }
}
exports.RunningTaskQuickOpenItem = RunningTaskQuickOpenItem;
let TaskRestartRunningQuickOpen = class TaskRestartRunningQuickOpen {
    async getItems() {
        const items = [];
        const runningTasks = await this.taskService.getRunningTasks();
        const isMulti = this.workspaceService.isMultiRootWorkspaceOpened;
        if (runningTasks.length <= 0) {
            items.push({
                label: 'No task to restart'
            });
        }
        else {
            runningTasks.forEach((task) => {
                items.push(new RunningTaskQuickOpenItem(task, this.taskService, this.taskNameResolver, this.taskSourceResolver, this.taskDefinitionRegistry, this.labelProvider, isMulti, () => this.taskService.restartTask(task)));
            });
        }
        return items;
    }
    async open() {
        var _a;
        const items = await this.getItems();
        (_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.showQuickPick(items, { placeholder: 'Select task to restart' });
    }
};
__decorate([
    (0, inversify_1.inject)(browser_1.LabelProvider),
    __metadata("design:type", browser_1.LabelProvider)
], TaskRestartRunningQuickOpen.prototype, "labelProvider", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.QuickInputService),
    (0, inversify_1.optional)(),
    __metadata("design:type", Object)
], TaskRestartRunningQuickOpen.prototype, "quickInputService", void 0);
__decorate([
    (0, inversify_1.inject)(task_definition_registry_1.TaskDefinitionRegistry),
    __metadata("design:type", task_definition_registry_1.TaskDefinitionRegistry)
], TaskRestartRunningQuickOpen.prototype, "taskDefinitionRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(task_name_resolver_1.TaskNameResolver),
    __metadata("design:type", task_name_resolver_1.TaskNameResolver)
], TaskRestartRunningQuickOpen.prototype, "taskNameResolver", void 0);
__decorate([
    (0, inversify_1.inject)(task_source_resolver_1.TaskSourceResolver),
    __metadata("design:type", task_source_resolver_1.TaskSourceResolver)
], TaskRestartRunningQuickOpen.prototype, "taskSourceResolver", void 0);
__decorate([
    (0, inversify_1.inject)(task_service_1.TaskService),
    __metadata("design:type", task_service_1.TaskService)
], TaskRestartRunningQuickOpen.prototype, "taskService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.WorkspaceService),
    __metadata("design:type", browser_2.WorkspaceService)
], TaskRestartRunningQuickOpen.prototype, "workspaceService", void 0);
TaskRestartRunningQuickOpen = __decorate([
    (0, inversify_1.injectable)()
], TaskRestartRunningQuickOpen);
exports.TaskRestartRunningQuickOpen = TaskRestartRunningQuickOpen;
//# sourceMappingURL=quick-open-task.js.map