(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_task_lib_browser_quick-open-task_js"],{

/***/ "../../packages/core/shared/@phosphor/coreutils/index.js":
/*!***************************************************************!*\
  !*** ../../packages/core/shared/@phosphor/coreutils/index.js ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! @phosphor/coreutils */ "../../node_modules/@phosphor/coreutils/lib/index.js");

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/shared/@phosphor/coreutils'] = this;


/***/ }),

/***/ "../../packages/task/lib/browser/provided-task-configurations.js":
/*!***********************************************************************!*\
  !*** ../../packages/task/lib/browser/provided-task-configurations.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2019 Ericsson and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProvidedTaskConfigurations = exports.ALL_TASK_TYPES = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const task_contribution_1 = __webpack_require__(/*! ./task-contribution */ "../../packages/task/lib/browser/task-contribution.js");
const task_definition_registry_1 = __webpack_require__(/*! ./task-definition-registry */ "../../packages/task/lib/browser/task-definition-registry.js");
const common_1 = __webpack_require__(/*! ../common */ "../../packages/task/lib/common/index.js");
exports.ALL_TASK_TYPES = '*';
let ProvidedTaskConfigurations = class ProvidedTaskConfigurations {
    constructor() {
        /**
         * Map of source (name of extension, or path of root folder that the task config comes from) and `task config map`.
         * For the second level of inner map, the key is task label.
         * For the third level of inner map, the key is the task scope and value TaskConfiguration.
         */
        this.tasksMap = new Map();
        this.currentToken = 0;
        this.activatedProvidersTypes = [];
        this.nextToken = 1;
    }
    startUserAction() {
        return this.nextToken++;
    }
    updateUserAction(token) {
        if (this.currentToken !== token) {
            this.currentToken = token;
            this.activatedProvidersTypes.length = 0;
        }
    }
    pushActivatedProvidersType(taskType) {
        if (!this.activatedProvidersTypes.includes(taskType)) {
            this.activatedProvidersTypes.push(taskType);
        }
    }
    isTaskProviderActivationNeeded(taskType) {
        if (!taskType || this.activatedProvidersTypes.includes(taskType) || this.activatedProvidersTypes.includes(exports.ALL_TASK_TYPES)) {
            return false;
        }
        return true;
    }
    /**
     * Activate providers for the given taskType
     * @param taskType A specific task type or '*' to indicate all task providers
     */
    async activateProviders(taskType) {
        if (!!taskType) {
            await this.taskProviderRegistry.activateProvider(taskType);
            this.pushActivatedProvidersType(taskType);
        }
    }
    /** returns a list of provided tasks matching an optional given type, or all if '*' is used */
    async getTasks(token, type) {
        await this.refreshTasks(token, type);
        const tasks = [];
        for (const taskLabelMap of this.tasksMap.values()) {
            for (const taskScopeMap of taskLabelMap.values()) {
                for (const task of taskScopeMap.values()) {
                    if (!type || task.type === type || type === exports.ALL_TASK_TYPES) {
                        tasks.push(task);
                    }
                }
            }
        }
        return tasks;
    }
    async refreshTasks(token, taskType) {
        const newProviderActivationNeeded = this.isTaskProviderActivationNeeded(taskType);
        if (token !== this.currentToken || newProviderActivationNeeded) {
            this.updateUserAction(token);
            await this.activateProviders(taskType);
            const providers = await this.taskProviderRegistry.getProviders();
            const providedTasks = (await Promise.all(providers.map(p => this.resolveTaskConfigurations(p))))
                .reduce((acc, taskArray) => acc.concat(taskArray), []);
            this.cacheTasks(providedTasks);
        }
    }
    async resolveTaskConfigurations(taskProvider) {
        return (await taskProvider.provideTasks())
            // Global/User tasks from providers are not supported.
            .filter(task => task.scope !== common_1.TaskScope.Global)
            .map(providedTask => {
            const originalPresentation = providedTask.presentation || {};
            return {
                ...providedTask,
                presentation: {
                    ...common_1.TaskOutputPresentation.getDefault(),
                    ...originalPresentation
                }
            };
        });
    }
    /** returns the task configuration for a given source and label or undefined if none */
    async getTask(token, source, taskLabel, scope) {
        await this.refreshTasks(token);
        return this.getCachedTask(source, taskLabel, scope);
    }
    /**
     * Finds the detected task for the given task customization.
     * The detected task is considered as a "match" to the task customization if it has all the `required` properties.
     * In case that more than one customization is found, return the one that has the biggest number of matched properties.
     *
     * @param customization the task customization
     * @return the detected task for the given task customization. If the task customization is not found, `undefined` is returned.
     */
    async getTaskToCustomize(token, customization, scope) {
        const definition = this.taskDefinitionRegistry.getDefinition(customization);
        if (!definition) {
            return undefined;
        }
        const matchedTasks = [];
        let highest = -1;
        const tasks = await this.getTasks(token, customization.type);
        for (const task of tasks) { // find detected tasks that match the `definition`
            const required = definition.properties.required || [];
            if (!required.every(requiredProp => customization[requiredProp] !== undefined)) {
                continue;
            }
            let score = required.length; // number of required properties
            const requiredProps = new Set(required);
            // number of optional properties
            score += definition.properties.all.filter(p => !requiredProps.has(p) && customization[p] !== undefined).length;
            if (score >= highest) {
                if (score > highest) {
                    highest = score;
                    matchedTasks.length = 0;
                }
                matchedTasks.push(task);
            }
        }
        // Tasks with scope set to 'Workspace' can be customized in a workspace root, and will not match
        // providers scope 'TaskScope.Workspace' unless specifically included as below.
        const scopes = [scope, common_1.TaskScope.Workspace];
        // find the task that matches the `customization`.
        // The scenario where more than one match is found should not happen unless users manually enter multiple customizations for one type of task
        // If this does happen, return the first match
        const matchedTask = matchedTasks.find(t => scopes.some(scp => scp === t._scope) && definition.properties.all.every(p => t[p] === customization[p]));
        return matchedTask;
    }
    getCachedTask(source, taskLabel, scope) {
        const labelConfigMap = this.tasksMap.get(source);
        if (labelConfigMap) {
            const scopeConfigMap = labelConfigMap.get(taskLabel);
            if (scopeConfigMap) {
                if (scope) {
                    return scopeConfigMap.get(scope.toString());
                }
                return Array.from(scopeConfigMap.values())[0];
            }
        }
    }
    cacheTasks(tasks) {
        this.tasksMap.clear();
        for (const task of tasks) {
            const label = task.label;
            const source = task._source;
            const scope = task._scope;
            if (this.tasksMap.has(source)) {
                const labelConfigMap = this.tasksMap.get(source);
                if (labelConfigMap.has(label)) {
                    labelConfigMap.get(label).set(scope.toString(), task);
                }
                else {
                    const newScopeConfigMap = new Map();
                    newScopeConfigMap.set(scope.toString(), task);
                    labelConfigMap.set(label, newScopeConfigMap);
                }
            }
            else {
                const newLabelConfigMap = new Map();
                const newScopeConfigMap = new Map();
                newScopeConfigMap.set(scope.toString(), task);
                newLabelConfigMap.set(label, newScopeConfigMap);
                this.tasksMap.set(source, newLabelConfigMap);
            }
        }
    }
};
__decorate([
    (0, inversify_1.inject)(task_contribution_1.TaskProviderRegistry),
    __metadata("design:type", task_contribution_1.TaskProviderRegistry)
], ProvidedTaskConfigurations.prototype, "taskProviderRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(task_definition_registry_1.TaskDefinitionRegistry),
    __metadata("design:type", task_definition_registry_1.TaskDefinitionRegistry)
], ProvidedTaskConfigurations.prototype, "taskDefinitionRegistry", void 0);
ProvidedTaskConfigurations = __decorate([
    (0, inversify_1.injectable)()
], ProvidedTaskConfigurations);
exports.ProvidedTaskConfigurations = ProvidedTaskConfigurations;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/task/lib/browser/provided-task-configurations'] = this;


/***/ }),

/***/ "../../packages/task/lib/browser/quick-open-task.js":
/*!**********************************************************!*\
  !*** ../../packages/task/lib/browser/quick-open-task.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TaskRestartRunningQuickOpen = exports.RunningTaskQuickOpenItem = exports.TaskRunningQuickOpen = exports.TaskTerminateQuickOpen = exports.TaskConfigureQuickOpenItem = exports.ConfigureBuildOrTestTaskQuickOpenItem = exports.TaskRunQuickOpenItem = exports.QuickOpenTask = exports.SHOW_ALL = exports.NO_TASK_TO_RUN = exports.CONFIGURE_A_TASK = exports.CHOOSE_TASK = exports.TaskEntry = exports.ConfigureTaskAction = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const task_service_1 = __webpack_require__(/*! ./task-service */ "../../packages/task/lib/browser/task-service.js");
const task_protocol_1 = __webpack_require__(/*! ../common/task-protocol */ "../../packages/task/lib/common/task-protocol.js");
const task_definition_registry_1 = __webpack_require__(/*! ./task-definition-registry */ "../../packages/task/lib/browser/task-definition-registry.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const browser_2 = __webpack_require__(/*! @theia/workspace/lib/browser */ "../../packages/workspace/lib/browser/index.js");
const terminal_service_1 = __webpack_require__(/*! @theia/terminal/lib/browser/base/terminal-service */ "../../packages/terminal/lib/browser/base/terminal-service.js");
const provided_task_configurations_1 = __webpack_require__(/*! ./provided-task-configurations */ "../../packages/task/lib/browser/provided-task-configurations.js");
const task_name_resolver_1 = __webpack_require__(/*! ./task-name-resolver */ "../../packages/task/lib/browser/task-name-resolver.js");
const task_source_resolver_1 = __webpack_require__(/*! ./task-source-resolver */ "../../packages/task/lib/browser/task-source-resolver.js");
const task_configuration_manager_1 = __webpack_require__(/*! ./task-configuration-manager */ "../../packages/task/lib/browser/task-configuration-manager.js");
const quick_input_service_1 = __webpack_require__(/*! @theia/core/lib/browser/quick-input/quick-input-service */ "../../packages/core/lib/browser/quick-input/quick-input-service.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
const pickerQuickAccess_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/platform/quickinput/browser/pickerQuickAccess */ "../../node_modules/@theia/monaco-editor-core/esm/vs/platform/quickinput/browser/pickerQuickAccess.js");
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

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/task/lib/browser/quick-open-task'] = this;


/***/ }),

/***/ "../../packages/task/lib/browser/task-configuration-manager.js":
/*!*********************************************************************!*\
  !*** ../../packages/task/lib/browser/task-configuration-manager.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2019 Ericsson and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TaskConfigurationManager = void 0;
const jsoncparser = __webpack_require__(/*! jsonc-parser */ "../../node_modules/jsonc-parser/lib/esm/main.js");
const debounce = __webpack_require__(/*! p-debounce */ "../../node_modules/p-debounce/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const event_1 = __webpack_require__(/*! @theia/core/lib/common/event */ "../../packages/core/lib/common/event.js");
const browser_1 = __webpack_require__(/*! @theia/editor/lib/browser */ "../../packages/editor/lib/browser/index.js");
const browser_2 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const quick_pick_service_1 = __webpack_require__(/*! @theia/core/lib/common/quick-pick-service */ "../../packages/core/lib/common/quick-pick-service.js");
const workspace_service_1 = __webpack_require__(/*! @theia/workspace/lib/browser/workspace-service */ "../../packages/workspace/lib/browser/workspace-service.js");
const task_configuration_model_1 = __webpack_require__(/*! ./task-configuration-model */ "../../packages/task/lib/browser/task-configuration-model.js");
const task_templates_1 = __webpack_require__(/*! ./task-templates */ "../../packages/task/lib/browser/task-templates.js");
const task_protocol_1 = __webpack_require__(/*! ../common/task-protocol */ "../../packages/task/lib/common/task-protocol.js");
const workspace_variable_contribution_1 = __webpack_require__(/*! @theia/workspace/lib/browser/workspace-variable-contribution */ "../../packages/workspace/lib/browser/workspace-variable-contribution.js");
const preference_configurations_1 = __webpack_require__(/*! @theia/core/lib/browser/preferences/preference-configurations */ "../../packages/core/lib/browser/preferences/preference-configurations.js");
const file_service_1 = __webpack_require__(/*! @theia/filesystem/lib/browser/file-service */ "../../packages/filesystem/lib/browser/file-service.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const task_schema_updater_1 = __webpack_require__(/*! ./task-schema-updater */ "../../packages/task/lib/browser/task-schema-updater.js");
/**
 * This class connects the the "tasks" preferences sections to task system: it collects tasks preference values and
 * provides them to the task system as raw, parsed JSON.
 */
let TaskConfigurationManager = class TaskConfigurationManager {
    constructor() {
        this.onDidChangeTaskConfigEmitter = new event_1.Emitter();
        this.onDidChangeTaskConfig = this.onDidChangeTaskConfigEmitter.event;
        this.models = new Map();
        this.updateModels = debounce(async () => {
            const roots = await this.workspaceService.roots;
            const toDelete = new Set([...this.models.keys()]
                .filter(key => key !== task_protocol_1.TaskScope.Global && key !== task_protocol_1.TaskScope.Workspace));
            this.updateWorkspaceModel();
            for (const rootStat of roots) {
                const key = rootStat.resource.toString();
                toDelete.delete(key);
                if (!this.models.has(key)) {
                    const model = new task_configuration_model_1.TaskConfigurationModel(key, this.folderPreferences);
                    model.onDidChange(() => this.onDidChangeTaskConfigEmitter.fire({ scope: key, type: 0 /* UPDATED */ }));
                    model.onDispose(() => this.models.delete(key));
                    this.models.set(key, model);
                    this.onDidChangeTaskConfigEmitter.fire({ scope: key, type: 0 /* UPDATED */ });
                }
            }
            for (const uri of toDelete) {
                const model = this.models.get(uri);
                if (model) {
                    model.dispose();
                }
                this.onDidChangeTaskConfigEmitter.fire({ scope: uri, type: 2 /* DELETED */ });
            }
        }, 500);
        this.toDisposeOnDelegateChange = new common_1.DisposableCollection();
    }
    init() {
        this.createModels();
        this.folderPreferences.onDidPreferencesChanged(e => {
            if (e['tasks']) {
                this.updateModels();
            }
        });
        this.workspaceService.onWorkspaceChanged(() => {
            this.updateModels();
        });
        this.workspaceService.onWorkspaceLocationChanged(() => {
            this.updateModels();
        });
    }
    createModels() {
        const userModel = new task_configuration_model_1.TaskConfigurationModel(task_protocol_1.TaskScope.Global, this.userPreferences);
        userModel.onDidChange(() => this.onDidChangeTaskConfigEmitter.fire({ scope: task_protocol_1.TaskScope.Global, type: 0 /* UPDATED */ }));
        this.models.set(task_protocol_1.TaskScope.Global, userModel);
        this.updateModels();
    }
    getTasks(scope) {
        var _a, _b;
        return (_b = (_a = this.getModel(scope)) === null || _a === void 0 ? void 0 : _a.configurations) !== null && _b !== void 0 ? _b : [];
    }
    getTask(name, scope) {
        return this.getTasks(scope).find((configuration) => configuration.name === name);
    }
    async openConfiguration(scope) {
        const taskPrefModel = this.getModel(scope);
        const maybeURI = typeof scope === 'string' ? scope : undefined;
        const configURI = this.preferenceService.getConfigUri(this.getMatchingPreferenceScope(scope), maybeURI, 'tasks');
        if (taskPrefModel && configURI) {
            await this.doOpen(taskPrefModel, configURI);
        }
    }
    async addTaskConfiguration(scope, taskConfig) {
        const taskPrefModel = this.getModel(scope);
        if (taskPrefModel) {
            const configurations = taskPrefModel.configurations;
            return this.setTaskConfigurations(scope, [...configurations, taskConfig]);
        }
        return false;
    }
    async setTaskConfigurations(scope, taskConfigs) {
        const taskPrefModel = this.getModel(scope);
        if (taskPrefModel) {
            return taskPrefModel.setConfigurations(taskConfigs);
        }
        return false;
    }
    getModel(scope) {
        return this.models.get(scope);
    }
    async doOpen(model, configURI) {
        if (!model.uri) {
            // The file has not yet been created.
            await this.doCreate(model, configURI);
        }
        return this.editorManager.open(configURI, {
            mode: 'activate'
        });
    }
    async doCreate(model, configURI) {
        var _a;
        const content = await this.getInitialConfigurationContent();
        if (content) {
            // All scopes but workspace.
            if (this.preferenceConfigurations.getName(configURI) === 'tasks') {
                await this.fileService.write(configURI, content);
            }
            else {
                let taskContent;
                try {
                    taskContent = jsoncparser.parse(content);
                }
                catch {
                    taskContent = (_a = this.taskSchemaProvider.getTaskSchema().default) !== null && _a !== void 0 ? _a : {};
                }
                await model.preferences.setPreference('tasks', taskContent);
            }
        }
    }
    getMatchingPreferenceScope(scope) {
        switch (scope) {
            case task_protocol_1.TaskScope.Global:
                return browser_2.PreferenceScope.User;
            case task_protocol_1.TaskScope.Workspace:
                return browser_2.PreferenceScope.Workspace;
            default:
                return browser_2.PreferenceScope.Folder;
        }
    }
    async getInitialConfigurationContent() {
        var _a;
        const selected = await this.quickPickService.show(this.taskTemplateSelector.selectTemplates(), {
            placeholder: 'Select a Task Template'
        });
        if (selected) {
            return (_a = selected.value) === null || _a === void 0 ? void 0 : _a.content;
        }
    }
    updateWorkspaceModel() {
        var _a;
        const isFolderWorkspace = this.workspaceService.opened && !this.workspaceService.saved;
        const newDelegate = isFolderWorkspace ? this.folderPreferences : this.workspacePreferences;
        const effectiveScope = isFolderWorkspace ? (_a = this.workspaceService.tryGetRoots()[0]) === null || _a === void 0 ? void 0 : _a.resource.toString() : task_protocol_1.TaskScope.Workspace;
        if (newDelegate !== this.workspaceDelegate) {
            this.workspaceDelegate = newDelegate;
            this.toDisposeOnDelegateChange.dispose();
            const workspaceModel = new task_configuration_model_1.TaskConfigurationModel(effectiveScope, newDelegate);
            this.toDisposeOnDelegateChange.push(workspaceModel);
            // If the delegate is the folder preference provider, its events will be relayed via the folder scope models.
            if (newDelegate === this.workspacePreferences) {
                this.toDisposeOnDelegateChange.push(workspaceModel.onDidChange(() => {
                    this.onDidChangeTaskConfigEmitter.fire({ scope: task_protocol_1.TaskScope.Workspace, type: 0 /* UPDATED */ });
                }));
            }
            this.models.set(task_protocol_1.TaskScope.Workspace, workspaceModel);
            this.onDidChangeTaskConfigEmitter.fire({ scope: effectiveScope, type: 0 /* UPDATED */ });
        }
    }
};
__decorate([
    (0, inversify_1.inject)(workspace_service_1.WorkspaceService),
    __metadata("design:type", workspace_service_1.WorkspaceService)
], TaskConfigurationManager.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.EditorManager),
    __metadata("design:type", browser_1.EditorManager)
], TaskConfigurationManager.prototype, "editorManager", void 0);
__decorate([
    (0, inversify_1.inject)(quick_pick_service_1.QuickPickService),
    __metadata("design:type", Object)
], TaskConfigurationManager.prototype, "quickPickService", void 0);
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], TaskConfigurationManager.prototype, "fileService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.PreferenceService),
    __metadata("design:type", Object)
], TaskConfigurationManager.prototype, "preferenceService", void 0);
__decorate([
    (0, inversify_1.inject)(task_schema_updater_1.TaskSchemaUpdater),
    __metadata("design:type", task_schema_updater_1.TaskSchemaUpdater)
], TaskConfigurationManager.prototype, "taskSchemaProvider", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.PreferenceProvider),
    (0, inversify_1.named)(browser_2.PreferenceScope.Folder),
    __metadata("design:type", browser_2.PreferenceProvider)
], TaskConfigurationManager.prototype, "folderPreferences", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.PreferenceProvider),
    (0, inversify_1.named)(browser_2.PreferenceScope.User),
    __metadata("design:type", browser_2.PreferenceProvider)
], TaskConfigurationManager.prototype, "userPreferences", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.PreferenceProvider),
    (0, inversify_1.named)(browser_2.PreferenceScope.Workspace),
    __metadata("design:type", browser_2.PreferenceProvider)
], TaskConfigurationManager.prototype, "workspacePreferences", void 0);
__decorate([
    (0, inversify_1.inject)(preference_configurations_1.PreferenceConfigurations),
    __metadata("design:type", preference_configurations_1.PreferenceConfigurations)
], TaskConfigurationManager.prototype, "preferenceConfigurations", void 0);
__decorate([
    (0, inversify_1.inject)(workspace_variable_contribution_1.WorkspaceVariableContribution),
    __metadata("design:type", workspace_variable_contribution_1.WorkspaceVariableContribution)
], TaskConfigurationManager.prototype, "workspaceVariables", void 0);
__decorate([
    (0, inversify_1.inject)(task_templates_1.TaskTemplateSelector),
    __metadata("design:type", task_templates_1.TaskTemplateSelector)
], TaskConfigurationManager.prototype, "taskTemplateSelector", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TaskConfigurationManager.prototype, "init", null);
TaskConfigurationManager = __decorate([
    (0, inversify_1.injectable)()
], TaskConfigurationManager);
exports.TaskConfigurationManager = TaskConfigurationManager;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/task/lib/browser/task-configuration-manager'] = this;


/***/ }),

/***/ "../../packages/task/lib/browser/task-configuration-model.js":
/*!*******************************************************************!*\
  !*** ../../packages/task/lib/browser/task-configuration-model.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2019 Ericsson and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TaskConfigurationModel = void 0;
const event_1 = __webpack_require__(/*! @theia/core/lib/common/event */ "../../packages/core/lib/common/event.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
/**
 * Holds the task configurations associated with a particular file. Uses an editor model to facilitate
 * non-destructive editing and coordination with editing the file by hand.
 */
class TaskConfigurationModel {
    constructor(scope, preferences) {
        this.scope = scope;
        this.preferences = preferences;
        this.onDidChangeEmitter = new event_1.Emitter();
        this.onDidChange = this.onDidChangeEmitter.event;
        this.toDispose = new disposable_1.DisposableCollection(this.onDidChangeEmitter);
        this.reconcile();
        this.toDispose.push(this.preferences.onDidPreferencesChanged((e) => {
            const change = e['tasks'];
            if (change && browser_1.PreferenceProviderDataChange.affects(change, this.getWorkspaceFolder())) {
                this.reconcile();
            }
        }));
    }
    get uri() {
        return this.json.uri;
    }
    getWorkspaceFolder() {
        return typeof this.scope === 'string' ? this.scope : undefined;
    }
    dispose() {
        this.toDispose.dispose();
    }
    get onDispose() {
        return this.toDispose.onDispose;
    }
    get configurations() {
        return this.json.configurations;
    }
    reconcile() {
        this.json = this.parseConfigurations();
        this.onDidChangeEmitter.fire(undefined);
    }
    setConfigurations(value) {
        return this.preferences.setPreference('tasks.tasks', value, this.getWorkspaceFolder());
    }
    parseConfigurations() {
        const configurations = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { configUri, value } = this.preferences.resolve('tasks', this.getWorkspaceFolder());
        if ((0, common_1.isObject)(value) && Array.isArray(value.tasks)) {
            for (const taskConfig of value.tasks) {
                configurations.push(taskConfig);
            }
        }
        return {
            uri: configUri,
            configurations
        };
    }
}
exports.TaskConfigurationModel = TaskConfigurationModel;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/task/lib/browser/task-configuration-model'] = this;


/***/ }),

/***/ "../../packages/task/lib/browser/task-configurations.js":
/*!**************************************************************!*\
  !*** ../../packages/task/lib/browser/task-configurations.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2017-2018 Ericsson and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TaskConfigurations = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const common_1 = __webpack_require__(/*! ../common */ "../../packages/task/lib/common/index.js");
const task_definition_registry_1 = __webpack_require__(/*! ./task-definition-registry */ "../../packages/task/lib/browser/task-definition-registry.js");
const provided_task_configurations_1 = __webpack_require__(/*! ./provided-task-configurations */ "../../packages/task/lib/browser/provided-task-configurations.js");
const task_configuration_manager_1 = __webpack_require__(/*! ./task-configuration-manager */ "../../packages/task/lib/browser/task-configuration-manager.js");
const task_schema_updater_1 = __webpack_require__(/*! ./task-schema-updater */ "../../packages/task/lib/browser/task-schema-updater.js");
const task_source_resolver_1 = __webpack_require__(/*! ./task-source-resolver */ "../../packages/task/lib/browser/task-source-resolver.js");
const common_2 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/workspace/lib/browser */ "../../packages/workspace/lib/browser/index.js");
/**
 * Watches a tasks.json configuration file and provides a parsed version of the contained task configurations
 */
let TaskConfigurations = class TaskConfigurations {
    constructor() {
        this.toDispose = new common_2.DisposableCollection();
        /**
         * Map of source (path of root folder that the task configs come from) and task config map.
         * For the inner map (i.e., task config map), the key is task label and value TaskConfiguration
         */
        this.tasksMap = new Map();
        /**
         * Map of source (path of root folder that the task configs come from) and task customizations map.
         */
        this.taskCustomizationMap = new Map();
        this.client = undefined;
        /**
         * Map of source (path of root folder that the task configs come from) and raw task configurations / customizations.
         * This map is used to store the data from `tasks.json` files in workspace.
         */
        this.rawTaskConfigurations = new Map();
        this.toDispose.push(common_2.Disposable.create(() => {
            this.tasksMap.clear();
            this.taskCustomizationMap.clear();
            this.rawTaskConfigurations.clear();
            this.client = undefined;
        }));
    }
    init() {
        this.toDispose.push(this.taskConfigurationManager.onDidChangeTaskConfig(async (change) => {
            try {
                await this.onDidTaskFileChange([change]);
                if (this.client) {
                    this.client.taskConfigurationChanged(this.getTaskLabels());
                }
            }
            catch (err) {
                console.error(err);
            }
        }));
        this.reorganizeTasks();
        this.toDispose.push(this.taskSchemaUpdater.onDidChangeTaskSchema(() => this.reorganizeTasks()));
    }
    setClient(client) {
        this.client = client;
    }
    dispose() {
        this.toDispose.dispose();
    }
    /** returns the list of known task labels */
    getTaskLabels() {
        return Array.from(this.tasksMap.values()).reduce((acc, labelConfigMap) => acc.concat(Array.from(labelConfigMap.keys())), []);
    }
    /**
     * returns a collection of known tasks, which includes:
     * - all the configured tasks in `tasks.json`, and
     * - the customized detected tasks.
     *
     * The invalid task configs are not returned.
     */
    async getTasks(token) {
        const configuredTasks = Array.from(this.tasksMap.values()).reduce((acc, labelConfigMap) => acc.concat(Array.from(labelConfigMap.values())), []);
        const detectedTasksAsConfigured = [];
        for (const [rootFolder, customizations] of Array.from(this.taskCustomizationMap.entries())) {
            for (const customization of customizations) {
                // TODO: getTasksToCustomize() will ask all task providers to contribute tasks. Doing this in a loop is bad.
                const detected = await this.providedTaskConfigurations.getTaskToCustomize(token, customization, rootFolder);
                if (detected) {
                    // there might be a provided task that has a different scope from the task we're inspecting
                    detectedTasksAsConfigured.push({ ...detected, ...customization });
                }
            }
        }
        return [...configuredTasks, ...detectedTasksAsConfigured];
    }
    getRawTaskConfigurations(scope) {
        if (scope === undefined) {
            const tasks = [];
            for (const configs of this.rawTaskConfigurations.values()) {
                tasks.push(...configs);
            }
            return tasks;
        }
        const scopeKey = this.getKeyFromScope(scope);
        if (this.rawTaskConfigurations.has(scopeKey)) {
            return Array.from(this.rawTaskConfigurations.get(scopeKey).values());
        }
        return [];
    }
    /**
     * returns a collection of invalid task configs as per the task schema defined in Theia.
     */
    getInvalidTaskConfigurations() {
        const invalidTaskConfigs = [];
        for (const taskConfigs of this.rawTaskConfigurations.values()) {
            for (const taskConfig of taskConfigs) {
                const isValid = this.isTaskConfigValid(taskConfig);
                if (!isValid) {
                    invalidTaskConfigs.push(taskConfig);
                }
            }
        }
        return invalidTaskConfigs;
    }
    /** returns the task configuration for a given label or undefined if none */
    getTask(scope, taskLabel) {
        const labelConfigMap = this.tasksMap.get(this.getKeyFromScope(scope));
        if (labelConfigMap) {
            return labelConfigMap.get(taskLabel);
        }
    }
    /** returns the customized task for a given label or undefined if none */
    async getCustomizedTask(token, scope, taskLabel) {
        const customizations = this.taskCustomizationMap.get(this.getKeyFromScope(scope));
        if (customizations) {
            const customization = customizations.find(cus => cus.label === taskLabel);
            if (customization) {
                const detected = await this.providedTaskConfigurations.getTaskToCustomize(token, customization, scope);
                if (detected) {
                    return {
                        ...detected,
                        ...customization,
                        type: detected.type
                    };
                }
            }
        }
    }
    /** removes tasks configured in the given task config file */
    removeTasks(scope) {
        const source = this.getKeyFromScope(scope);
        this.tasksMap.delete(source);
        this.taskCustomizationMap.delete(source);
    }
    /**
     * Removes task customization objects found in the given task config file from the memory.
     * Please note: this function does not modify the task config file.
     */
    removeTaskCustomizations(scope) {
        const source = this.getKeyFromScope(scope);
        this.taskCustomizationMap.delete(source);
    }
    /**
     * Returns the task customizations by type from a given root folder in the workspace.
     * @param type the type of task customizations
     * @param rootFolder the root folder to find task customizations from. If `undefined`, this function returns an empty array.
     */
    getTaskCustomizations(type, scope) {
        const customizationInRootFolder = this.taskCustomizationMap.get(this.getKeyFromScope(scope));
        if (customizationInRootFolder) {
            return customizationInRootFolder.filter(c => c.type === type);
        }
        else {
            return [];
        }
    }
    /**
     * Returns the customization object in `tasks.json` for the given task. Please note, this function
     * returns `undefined` if the given task is not a detected task, because configured tasks don't need
     * customization objects - users can modify its config directly in `tasks.json`.
     * @param taskConfig The task config, which could either be a configured task or a detected task.
     */
    getCustomizationForTask(taskConfig) {
        if (!this.isDetectedTask(taskConfig)) {
            return undefined;
        }
        const customizationByType = this.getTaskCustomizations(taskConfig.type, taskConfig._scope) || [];
        const hasCustomization = customizationByType.length > 0;
        if (hasCustomization) {
            const taskDefinition = this.taskDefinitionRegistry.getDefinition(taskConfig);
            if (taskDefinition) {
                const required = taskDefinition.properties.required || [];
                // Only support having one customization per task.
                return customizationByType.find(customization => required.every(property => customization[property] === taskConfig[property]));
            }
        }
        return undefined;
    }
    /**
     * Called when a change, to a config file we watch, is detected.
     */
    async onDidTaskFileChange(fileChanges) {
        for (const change of fileChanges) {
            if (change.type === 2 /* DELETED */) {
                this.removeTasks(change.scope);
            }
            else {
                // re-parse the config file
                await this.refreshTasks(change.scope);
            }
        }
    }
    /**
     * Read the task configs from the task configuration manager, and updates the list of available tasks.
     */
    async refreshTasks(scope) {
        await this.readTasks(scope);
        this.removeTasks(scope);
        this.removeTaskCustomizations(scope);
        this.reorganizeTasks();
    }
    /** parses a config file and extracts the tasks launch configurations */
    async readTasks(scope) {
        const rawConfigArray = this.taskConfigurationManager.getTasks(scope);
        const key = this.getKeyFromScope(scope);
        if (this.rawTaskConfigurations.has(key)) {
            this.rawTaskConfigurations.delete(key);
        }
        this.rawTaskConfigurations.set(key, rawConfigArray);
        return rawConfigArray;
    }
    async openUserTasks() {
        await this.taskConfigurationManager.openConfiguration(common_1.TaskScope.Global);
    }
    /** Adds given task to a config file and opens the file to provide ability to edit task configuration. */
    async configure(token, task) {
        const scope = task._scope;
        if (scope === common_1.TaskScope.Global) {
            return this.openUserTasks();
        }
        const workspace = this.workspaceService.workspace;
        if (!workspace) {
            return;
        }
        const configuredAndCustomizedTasks = await this.getTasks(token);
        if (!configuredAndCustomizedTasks.some(t => this.taskDefinitionRegistry.compareTasks(t, task))) {
            await this.saveTask(scope, task);
        }
        try {
            await this.taskConfigurationManager.openConfiguration(scope);
        }
        catch (e) {
            console.error(`Error occurred while opening 'tasks.json' in ${this.taskSourceResolver.resolve(task)}.`, e);
        }
    }
    getTaskCustomizationTemplate(task) {
        const definition = this.getTaskDefinition(task);
        if (!definition) {
            console.error('Detected / Contributed tasks should have a task definition.');
            return;
        }
        const customization = { type: task.type, runOptions: task.runOptions };
        definition.properties.all.forEach(p => {
            if (task[p] !== undefined) {
                customization[p] = task[p];
            }
        });
        if ('problemMatcher' in task) {
            const problemMatcher = [];
            if (Array.isArray(task.problemMatcher)) {
                problemMatcher.push(...task.problemMatcher.map(t => {
                    if (typeof t === 'string') {
                        return t;
                    }
                    else {
                        return t.name;
                    }
                }));
            }
            else if (typeof task.problemMatcher === 'string') {
                problemMatcher.push(task.problemMatcher);
            }
            else if (task.problemMatcher) {
                problemMatcher.push(task.problemMatcher.name);
            }
            customization.problemMatcher = problemMatcher.map(common_1.asVariableName);
        }
        if (task.group) {
            customization.group = task.group;
        }
        customization.label = task.label;
        return { ...customization };
    }
    /** Writes the task to a config file. Creates a config file if this one does not exist */
    saveTask(scope, task) {
        const { _source, $ident, ...preparedTask } = task;
        const customizedTaskTemplate = this.getTaskCustomizationTemplate(task) || preparedTask;
        return this.taskConfigurationManager.addTaskConfiguration(scope, customizedTaskTemplate);
    }
    /**
     * This function is called after a change in TaskDefinitionRegistry happens.
     * It checks all tasks that have been loaded, and re-organized them in `tasksMap` and `taskCustomizationMap`.
     */
    reorganizeTasks() {
        const newTaskMap = new Map();
        const newTaskCustomizationMap = new Map();
        const addCustomization = (rootFolder, customization) => {
            if (newTaskCustomizationMap.has(rootFolder)) {
                newTaskCustomizationMap.get(rootFolder).push(customization);
            }
            else {
                newTaskCustomizationMap.set(rootFolder, [customization]);
            }
        };
        const addConfiguredTask = (rootFolder, label, configuredTask) => {
            if (newTaskMap.has(rootFolder)) {
                newTaskMap.get(rootFolder).set(label, configuredTask);
            }
            else {
                const newConfigMap = new Map();
                newConfigMap.set(label, configuredTask);
                newTaskMap.set(rootFolder, newConfigMap);
            }
        };
        for (const [scopeKey, taskConfigs] of this.rawTaskConfigurations.entries()) {
            for (const taskConfig of taskConfigs) {
                const scope = this.getScopeFromKey(scopeKey);
                const isValid = this.isTaskConfigValid(taskConfig);
                if (!isValid) {
                    continue;
                }
                const transformedTask = this.getTransformedRawTask(taskConfig, scope);
                if (this.isDetectedTask(transformedTask)) {
                    addCustomization(scopeKey, transformedTask);
                }
                else {
                    addConfiguredTask(scopeKey, transformedTask['label'], transformedTask);
                }
            }
        }
        this.taskCustomizationMap = newTaskCustomizationMap;
        this.tasksMap = newTaskMap;
    }
    getTransformedRawTask(rawTask, scope) {
        let taskConfig;
        if (this.isDetectedTask(rawTask)) {
            const def = this.getTaskDefinition(rawTask);
            taskConfig = {
                ...rawTask,
                _source: def.source,
                _scope: scope
            };
        }
        else {
            taskConfig = {
                ...rawTask,
                _source: scope,
                _scope: scope
            };
        }
        return {
            ...taskConfig,
            presentation: common_1.TaskOutputPresentation.fromJson(rawTask)
        };
    }
    /**
     * Returns `true` if the given task configuration is valid as per the task schema defined in Theia
     * or contributed by Theia extensions and plugins, `false` otherwise.
     */
    isTaskConfigValid(task) {
        return this.taskSchemaUpdater.validate({ tasks: [task] });
    }
    /**
     * Updates the task config in the `tasks.json`.
     * The task config, together with updates, will be written into the `tasks.json` if it is not found in the file.
     *
     * @param task task that the updates will be applied to
     * @param update the updates to be applied
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async updateTaskConfig(token, task, update) {
        const scope = task._scope;
        const configuredAndCustomizedTasks = await this.getTasks(token);
        if (configuredAndCustomizedTasks.some(t => this.taskDefinitionRegistry.compareTasks(t, task))) { // task is already in `tasks.json`
            const jsonTasks = this.taskConfigurationManager.getTasks(scope);
            if (jsonTasks) {
                const ind = jsonTasks.findIndex((t) => {
                    if (t.type !== (task.type)) {
                        return false;
                    }
                    const def = this.taskDefinitionRegistry.getDefinition(t);
                    if (def) {
                        return def.properties.all.every(p => t[p] === task[p]);
                    }
                    return t.label === task.label;
                });
                jsonTasks[ind] = {
                    ...jsonTasks[ind],
                    ...update
                };
            }
            this.taskConfigurationManager.setTaskConfigurations(scope, jsonTasks);
        }
        else { // task is not in `tasks.json`
            Object.keys(update).forEach(taskProperty => {
                task[taskProperty] = update[taskProperty];
            });
            this.saveTask(scope, task);
        }
    }
    getKeyFromScope(scope) {
        // Converting the enums to string will not yield a valid URI, so the keys will be distinct from any URI.
        return scope.toString();
    }
    getScopeFromKey(key) {
        if (common_1.TaskScope.Global.toString() === key) {
            return common_1.TaskScope.Global;
        }
        else if (common_1.TaskScope.Workspace.toString() === key) {
            return common_1.TaskScope.Workspace;
        }
        else {
            return key;
        }
    }
    /** checks if the config is a detected / contributed task */
    isDetectedTask(task) {
        const taskDefinition = this.getTaskDefinition(task);
        // it is considered as a customization if the task definition registry finds a def for the task configuration
        return !!taskDefinition;
    }
    getTaskDefinition(task) {
        return this.taskDefinitionRegistry.getDefinition(task);
    }
};
__decorate([
    (0, inversify_1.inject)(browser_1.WorkspaceService),
    __metadata("design:type", browser_1.WorkspaceService)
], TaskConfigurations.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(task_definition_registry_1.TaskDefinitionRegistry),
    __metadata("design:type", task_definition_registry_1.TaskDefinitionRegistry)
], TaskConfigurations.prototype, "taskDefinitionRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(provided_task_configurations_1.ProvidedTaskConfigurations),
    __metadata("design:type", provided_task_configurations_1.ProvidedTaskConfigurations)
], TaskConfigurations.prototype, "providedTaskConfigurations", void 0);
__decorate([
    (0, inversify_1.inject)(task_configuration_manager_1.TaskConfigurationManager),
    __metadata("design:type", task_configuration_manager_1.TaskConfigurationManager)
], TaskConfigurations.prototype, "taskConfigurationManager", void 0);
__decorate([
    (0, inversify_1.inject)(task_schema_updater_1.TaskSchemaUpdater),
    __metadata("design:type", task_schema_updater_1.TaskSchemaUpdater)
], TaskConfigurations.prototype, "taskSchemaUpdater", void 0);
__decorate([
    (0, inversify_1.inject)(task_source_resolver_1.TaskSourceResolver),
    __metadata("design:type", task_source_resolver_1.TaskSourceResolver)
], TaskConfigurations.prototype, "taskSourceResolver", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TaskConfigurations.prototype, "init", null);
TaskConfigurations = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], TaskConfigurations);
exports.TaskConfigurations = TaskConfigurations;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/task/lib/browser/task-configurations'] = this;


/***/ }),

/***/ "../../packages/task/lib/browser/task-contribution.js":
/*!************************************************************!*\
  !*** ../../packages/task/lib/browser/task-contribution.js ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TaskProviderRegistry = exports.TaskResolverRegistry = exports.TaskContribution = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const event_1 = __webpack_require__(/*! @theia/core/lib/common/event */ "../../packages/core/lib/common/event.js");
exports.TaskContribution = Symbol('TaskContribution');
/**
 * The {@link TaskResolverRegistry} is the common component for registration and provision of
 * {@link TaskResolver}s. Theia will collect all {@link TaskContribution}s and invoke {@link TaskContribution#registerResolvers}
 * for each contribution.
 */
let TaskResolverRegistry = class TaskResolverRegistry {
    constructor() {
        this.onWillProvideTaskResolverEmitter = new event_1.Emitter();
        /**
         * Emit when the registry provides a registered resolver. i.e. when the {@link TaskResolverRegistry#getResolver}
         * function is called.
         */
        this.onWillProvideTaskResolver = this.onWillProvideTaskResolverEmitter.event;
        this.taskResolvers = new Map();
        this.executionResolvers = new Map();
    }
    /**
     * Registers the given {@link TaskResolver} to resolve the `TaskConfiguration` of the specified type.
     * If there is already a `TaskResolver` registered for the specified type the registration will
     * be overwritten with the new value.
     *
     * @deprecated since 1.12.0 use `registerTaskResolver` instead.
     *
     * @param type the task configuration type for which the given resolver should be registered.
     * @param resolver the task resolver that should be registered.
     *
     * @returns a `Disposable` that can be invoked to unregister the given resolver
     */
    register(type, resolver) {
        return this.registerTaskResolver(type, resolver);
    }
    /**
     * Registers the given {@link TaskResolver} to resolve the `TaskConfiguration` of the specified type.
     * If there is already a `TaskResolver` registered for the specified type the registration will
     * be overwritten with the new value.
     *
     * @param type the task configuration type for which the given resolver should be registered.
     * @param resolver the task resolver that should be registered.
     *
     * @returns a `Disposable` that can be invoked to unregister the given resolver
     */
    registerTaskResolver(type, resolver) {
        if (this.taskResolvers.has(type)) {
            console.warn(`Overriding task resolver for ${type}`);
        }
        this.taskResolvers.set(type, resolver);
        return {
            dispose: () => this.taskResolvers.delete(type)
        };
    }
    /**
     * Retrieves the {@link TaskResolver} registered for the given type task configuration type.
     *
     * @deprecated since 1.12.0 use `getTaskResolver()` instead.
     *
     * @param type the task configuration type
     *
     * @returns a promise of the registered `TaskResolver` or `undefined` if no resolver is registered for the given type.
     */
    async getResolver(type) {
        return this.getTaskResolver(type);
    }
    /**
     * Retrieves the {@link TaskResolver} registered for the given type task configuration type.
     * @param type the task configuration type
     *
     * @returns a promise of the registered `TaskResolver` or `undefined` if no resolver is registered for the given type.
     */
    async getTaskResolver(type) {
        await event_1.WaitUntilEvent.fire(this.onWillProvideTaskResolverEmitter, { taskType: type });
        return this.taskResolvers.get(type);
    }
    /**
     * Registers the given {@link TaskResolver} to resolve the `TaskConfiguration` for the
     * specified type of execution ('shell', 'process' or 'customExecution').
     * If there is already a `TaskResolver` registered for the specified type the registration will
     * be overwritten with the new value.
     *
     * @param type the task execution type for which the given resolver should be registered.
     * @param resolver the task resolver that should be registered.
     *
     * @returns a `Disposable` that can be invoked to unregister the given resolver
     */
    registerExecutionResolver(type, resolver) {
        if (this.executionResolvers.has(type)) {
            console.warn(`Overriding execution resolver for ${type}`);
        }
        this.executionResolvers.set(type, resolver);
        return {
            dispose: () => this.executionResolvers.delete(type)
        };
    }
    /**
     * Retrieves the {@link TaskResolver} registered for the given type of execution ('shell', 'process' or 'customExecution')..
     * @param type the task configuration type
     *
     * @returns a promise of the registered `TaskResolver` or `undefined` if no resolver is registered for the given type.
     */
    getExecutionResolver(executionType) {
        return this.executionResolvers.get(executionType);
    }
};
TaskResolverRegistry = __decorate([
    (0, inversify_1.injectable)()
], TaskResolverRegistry);
exports.TaskResolverRegistry = TaskResolverRegistry;
/**
 * The {@link TaskProviderRegistry} is the common component for registration and provision of
 * {@link TaskProvider}s. Theia will collect all {@link TaskContribution}s and invoke {@link TaskContribution#registerProviders}
 * for each contribution.
 */
let TaskProviderRegistry = class TaskProviderRegistry {
    constructor() {
        this.onWillProvideTaskProviderEmitter = new event_1.Emitter();
        /**
         * Emit when the registry provides a registered task provider. i.e. when the {@link TaskProviderRegistry#getProvider}
         * function is called.
         */
        this.onWillProvideTaskProvider = this.onWillProvideTaskProviderEmitter.event;
    }
    init() {
        this.providers = new Map();
    }
    /**
     * Registers the given {@link TaskProvider} for task configurations of the specified type
     * @param type the task configuration type for which the given provider should be registered.
     * @param provider the `TaskProvider` that should be registered.
     *
     * @returns a `Disposable` that can be invoked to unregister the given resolver.
     */
    register(type, provider, handle) {
        const key = handle === undefined ? type : `${type}::${handle}`;
        this.providers.set(key, provider);
        return {
            dispose: () => this.providers.delete(key)
        };
    }
    /**
     * Initiates activation of a TaskProvider with the given type
     * @param type the task configuration type, '*' indicates, all providers.
     */
    async activateProvider(type) {
        await event_1.WaitUntilEvent.fire(this.onWillProvideTaskProviderEmitter, { taskType: type });
    }
    /**
     * Retrieves the {@link TaskProvider} registered for the given type task configuration type.
     * If there is already a `TaskProvider` registered for the specified type the registration will
     * be overwritten with the new value.
     * @param type the task configuration type.
     *
     * @returns a promise of the registered `TaskProvider`` or `undefined` if no provider is registered for the given type.
     */
    async getProvider(type) {
        await this.activateProvider(type);
        return this.providers.get(type);
    }
    /**
     * Retrieve all registered {@link TaskProvider}s.
     *
     * Use {@link activateProvider} to control registration of providers as needed.
     * @returns a promise of all registered {@link TaskProvider}s.
     */
    async getProviders() {
        return [...this.providers.values()];
    }
};
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TaskProviderRegistry.prototype, "init", null);
TaskProviderRegistry = __decorate([
    (0, inversify_1.injectable)()
], TaskProviderRegistry);
exports.TaskProviderRegistry = TaskProviderRegistry;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/task/lib/browser/task-contribution'] = this;


/***/ }),

/***/ "../../packages/task/lib/browser/task-definition-registry.js":
/*!*******************************************************************!*\
  !*** ../../packages/task/lib/browser/task-definition-registry.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2019 Ericsson and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TaskDefinitionRegistry = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const coreutils_1 = __webpack_require__(/*! @theia/core/shared/@phosphor/coreutils */ "../../packages/core/shared/@phosphor/coreutils/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
let TaskDefinitionRegistry = class TaskDefinitionRegistry {
    constructor() {
        // task type - array of task definitions
        this.definitions = new Map();
        this.onDidRegisterTaskDefinitionEmitter = new common_1.Emitter();
        this.onDidUnregisterTaskDefinitionEmitter = new common_1.Emitter();
    }
    get onDidRegisterTaskDefinition() {
        return this.onDidRegisterTaskDefinitionEmitter.event;
    }
    get onDidUnregisterTaskDefinition() {
        return this.onDidUnregisterTaskDefinitionEmitter.event;
    }
    /**
     * Returns all task definitions that are registered
     * @return the task definitions that are registered
     */
    getAll() {
        const all = [];
        for (const definitions of this.definitions.values()) {
            all.push(...definitions);
        }
        return all;
    }
    /**
     * Finds the task definition(s) from the registry with the given `taskType`.
     *
     * @param taskType the type of the task
     * @return an array of the task definitions. If no task definitions are found, an empty array is returned.
     */
    getDefinitions(taskType) {
        return this.definitions.get(taskType) || [];
    }
    /**
     * Finds the task definition from the registry for the task configuration.
     * The task configuration is considered as a "match" to the task definition if it has all the `required` properties.
     * In case that more than one task definition is found, return the one that has the biggest number of matched properties.
     *
     * @param taskConfiguration the task configuration
     * @return the task definition for the task configuration. If the task definition is not found, `undefined` is returned.
     */
    getDefinition(taskConfiguration) {
        const definitions = this.getDefinitions(taskConfiguration.type);
        let matchedDefinition;
        let highest = -1;
        for (const def of definitions) {
            const required = def.properties.required || [];
            if (!required.every(requiredProp => taskConfiguration[requiredProp] !== undefined)) {
                continue;
            }
            let score = required.length; // number of required properties
            const requiredProps = new Set(required);
            // number of optional properties
            score += def.properties.all.filter(p => !requiredProps.has(p) && taskConfiguration[p] !== undefined).length;
            if (score > highest) {
                highest = score;
                matchedDefinition = def;
            }
        }
        return matchedDefinition;
    }
    /**
     * Add a task definition to the registry.
     *
     * @param definition the task definition to be added.
     */
    register(definition) {
        const taskType = definition.taskType;
        const definitions = this.definitions.get(taskType) || [];
        definitions.push(definition);
        this.definitions.set(taskType, definitions);
        this.onDidRegisterTaskDefinitionEmitter.fire(undefined);
        return disposable_1.Disposable.create(() => {
            const index = definitions.indexOf(definition);
            if (index !== -1) {
                definitions.splice(index, 1);
            }
            this.onDidUnregisterTaskDefinitionEmitter.fire(undefined);
        });
    }
    compareTasks(one, other) {
        const oneType = one.type;
        const otherType = other.type;
        if (oneType !== otherType) {
            return false;
        }
        if (one['taskType'] !== other['taskType']) {
            return false;
        }
        const def = this.getDefinition(one);
        if (def) {
            // scope is either a string or an enum value. Anyway...they must exactly match
            // "_scope" may hold the Uri to the associated workspace whereas
            // "scope" reflects the original TaskConfigurationScope as provided by plugins,
            // Matching "_scope" or "scope" are both accepted in order to correlate provided task
            // configurations (e.g. TaskScope.Workspace) against already configured tasks.
            return def.properties.all.every(p => p === 'type' || coreutils_1.JSONExt.deepEqual(one[p], other[p]))
                && (one._scope === other._scope || one.scope === other.scope);
        }
        return one.label === other.label && one._source === other._source;
    }
};
TaskDefinitionRegistry = __decorate([
    (0, inversify_1.injectable)()
], TaskDefinitionRegistry);
exports.TaskDefinitionRegistry = TaskDefinitionRegistry;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/task/lib/browser/task-definition-registry'] = this;


/***/ }),

/***/ "../../packages/task/lib/browser/task-name-resolver.js":
/*!*************************************************************!*\
  !*** ../../packages/task/lib/browser/task-name-resolver.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2019 Red Hat, Inc. and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TaskNameResolver = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const task_definition_registry_1 = __webpack_require__(/*! ./task-definition-registry */ "../../packages/task/lib/browser/task-definition-registry.js");
const task_configurations_1 = __webpack_require__(/*! ./task-configurations */ "../../packages/task/lib/browser/task-configurations.js");
let TaskNameResolver = class TaskNameResolver {
    /**
     * Returns task name to display.
     * It is aligned with VS Code.
     */
    resolve(task) {
        if (this.isDetectedTask(task)) {
            const scope = task._scope;
            const rawConfigs = this.taskConfigurations.getRawTaskConfigurations(scope);
            const jsonConfig = rawConfigs.find(rawConfig => this.taskDefinitionRegistry.compareTasks({
                ...rawConfig, _scope: scope
            }, task));
            // detected task that has a `label` defined in `tasks.json`
            if (jsonConfig && jsonConfig.label) {
                return jsonConfig.label;
            }
            return `${task.source || task._source}: ${task.label}`;
        }
        // it is a hack, when task is customized but extension is absent
        return task.label || `${task.type}: ${task.task}`;
    }
    isDetectedTask(task) {
        return !!this.taskDefinitionRegistry.getDefinition(task);
    }
};
__decorate([
    (0, inversify_1.inject)(task_definition_registry_1.TaskDefinitionRegistry),
    __metadata("design:type", task_definition_registry_1.TaskDefinitionRegistry)
], TaskNameResolver.prototype, "taskDefinitionRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(task_configurations_1.TaskConfigurations),
    __metadata("design:type", task_configurations_1.TaskConfigurations)
], TaskNameResolver.prototype, "taskConfigurations", void 0);
TaskNameResolver = __decorate([
    (0, inversify_1.injectable)()
], TaskNameResolver);
exports.TaskNameResolver = TaskNameResolver;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/task/lib/browser/task-name-resolver'] = this;


/***/ }),

/***/ "../../packages/task/lib/browser/task-node.js":
/*!****************************************************!*\
  !*** ../../packages/task/lib/browser/task-node.js ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TaskNode = void 0;
class TaskNode {
    constructor(taskId, childTasks, parentsID) {
        this.taskId = taskId;
        this.childTasks = childTasks;
        this.parentsID = parentsID;
    }
    addChildDependency(node) {
        this.childTasks.push(node);
    }
    addParentDependency(parentId) {
        this.parentsID.push(parentId);
    }
}
exports.TaskNode = TaskNode;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/task/lib/browser/task-node'] = this;


/***/ }),

/***/ "../../packages/task/lib/browser/task-problem-matcher-registry.js":
/*!************************************************************************!*\
  !*** ../../packages/task/lib/browser/task-problem-matcher-registry.js ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2019 Ericsson and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProblemMatcherRegistry = void 0;
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
const common_2 = __webpack_require__(/*! ../common */ "../../packages/task/lib/common/index.js");
const task_problem_pattern_registry_1 = __webpack_require__(/*! ./task-problem-pattern-registry */ "../../packages/task/lib/browser/task-problem-pattern-registry.js");
const severity_1 = __webpack_require__(/*! @theia/core/lib/common/severity */ "../../packages/core/lib/common/severity.js");
const promise_util_1 = __webpack_require__(/*! @theia/core/lib/common/promise-util */ "../../packages/core/lib/common/promise-util.js");
let ProblemMatcherRegistry = class ProblemMatcherRegistry {
    constructor() {
        this.matchers = new Map();
        this.readyPromise = new promise_util_1.Deferred();
        this.onDidChangeProblemMatcherEmitter = new common_1.Emitter();
    }
    get onDidChangeProblemMatcher() {
        return this.onDidChangeProblemMatcherEmitter.event;
    }
    init() {
        this.problemPatternRegistry.onReady().then(() => {
            this.fillDefaults();
            this.readyPromise.resolve();
            this.onDidChangeProblemMatcherEmitter.fire(undefined);
        });
    }
    onReady() {
        return this.readyPromise.promise;
    }
    /**
     * Add a problem matcher to the registry.
     *
     * @param definition the problem matcher to be added.
     */
    register(matcher) {
        if (!matcher.name) {
            console.error('Only named Problem Matchers can be registered.');
            return disposable_1.Disposable.NULL;
        }
        const toDispose = new disposable_1.DisposableCollection(disposable_1.Disposable.create(() => {
            /* mark as not disposed */
            this.onDidChangeProblemMatcherEmitter.fire(undefined);
        }));
        this.doRegister(matcher, toDispose).then(() => this.onDidChangeProblemMatcherEmitter.fire(undefined));
        return toDispose;
    }
    async doRegister(matcher, toDispose) {
        const problemMatcher = await this.getProblemMatcherFromContribution(matcher);
        if (toDispose.disposed) {
            return;
        }
        toDispose.push(this.add(problemMatcher));
    }
    /**
     * Finds the problem matcher from the registry by its name.
     *
     * @param name the name of the problem matcher
     * @return the problem matcher. If the task definition is not found, `undefined` is returned.
     */
    get(name) {
        return this.matchers.get((0, common_2.fromVariableName)(name));
    }
    /**
     * Returns all registered problem matchers in the registry.
     */
    getAll() {
        const all = [];
        for (const matcherName of this.matchers.keys()) {
            all.push(this.get(matcherName));
        }
        all.sort((one, other) => one.name.localeCompare(other.name));
        return all;
    }
    /**
     * Transforms the `ProblemMatcherContribution` to a `ProblemMatcher`
     *
     * @return the problem matcher
     */
    async getProblemMatcherFromContribution(matcher) {
        let baseMatcher;
        if (matcher.base) {
            baseMatcher = this.get(matcher.base);
        }
        let fileLocation;
        let filePrefix;
        if (matcher.fileLocation === undefined) {
            fileLocation = baseMatcher ? baseMatcher.fileLocation : common_2.FileLocationKind.Relative;
            filePrefix = baseMatcher ? baseMatcher.filePrefix : '${workspaceFolder}';
        }
        else {
            const locationAndPrefix = this.getFileLocationKindAndPrefix(matcher);
            fileLocation = locationAndPrefix.fileLocation;
            filePrefix = locationAndPrefix.filePrefix;
        }
        const patterns = [];
        if (matcher.pattern) {
            if (typeof matcher.pattern === 'string') {
                await this.problemPatternRegistry.onReady();
                const registeredPattern = this.problemPatternRegistry.get((0, common_2.fromVariableName)(matcher.pattern));
                if (Array.isArray(registeredPattern)) {
                    patterns.push(...registeredPattern);
                }
                else if (!!registeredPattern) {
                    patterns.push(registeredPattern);
                }
            }
            else if (Array.isArray(matcher.pattern)) {
                patterns.push(...matcher.pattern.map(p => common_2.ProblemPattern.fromProblemPatternContribution(p)));
            }
            else {
                patterns.push(common_2.ProblemPattern.fromProblemPatternContribution(matcher.pattern));
            }
        }
        else if (baseMatcher) {
            if (Array.isArray(baseMatcher.pattern)) {
                patterns.push(...baseMatcher.pattern);
            }
            else {
                patterns.push(baseMatcher.pattern);
            }
        }
        let deprecated = matcher.deprecated;
        if (deprecated === undefined && baseMatcher) {
            deprecated = baseMatcher.deprecated;
        }
        let applyTo;
        if (matcher.applyTo === undefined) {
            applyTo = baseMatcher ? baseMatcher.applyTo : common_2.ApplyToKind.allDocuments;
        }
        else {
            applyTo = common_2.ApplyToKind.fromString(matcher.applyTo) || common_2.ApplyToKind.allDocuments;
        }
        let severity = severity_1.Severity.fromValue(matcher.severity);
        if (matcher.severity === undefined && baseMatcher && baseMatcher.severity !== undefined) {
            severity = baseMatcher.severity;
        }
        let watching = common_2.WatchingMatcher.fromWatchingMatcherContribution(matcher.background || matcher.watching);
        if (watching === undefined && baseMatcher) {
            watching = baseMatcher.watching;
        }
        const problemMatcher = {
            name: matcher.name || (baseMatcher ? baseMatcher.name : undefined),
            label: matcher.label || (baseMatcher === null || baseMatcher === void 0 ? void 0 : baseMatcher.label) || '',
            deprecated,
            owner: matcher.owner || (baseMatcher ? baseMatcher.owner : ''),
            source: matcher.source || (baseMatcher ? baseMatcher.source : undefined),
            applyTo,
            fileLocation,
            filePrefix,
            pattern: patterns,
            severity,
            watching
        };
        return problemMatcher;
    }
    add(matcher) {
        this.matchers.set(matcher.name, matcher);
        return disposable_1.Disposable.create(() => this.matchers.delete(matcher.name));
    }
    getFileLocationKindAndPrefix(matcher) {
        let fileLocation = common_2.FileLocationKind.Relative;
        let filePrefix = '${workspaceFolder}';
        if (matcher.fileLocation !== undefined) {
            if (Array.isArray(matcher.fileLocation)) {
                if (matcher.fileLocation.length > 0) {
                    const locationKind = common_2.FileLocationKind.fromString(matcher.fileLocation[0]);
                    if (matcher.fileLocation.length === 1 && locationKind === common_2.FileLocationKind.Absolute) {
                        fileLocation = locationKind;
                    }
                    else if (matcher.fileLocation.length === 2 && locationKind === common_2.FileLocationKind.Relative && matcher.fileLocation[1]) {
                        fileLocation = locationKind;
                        filePrefix = matcher.fileLocation[1];
                    }
                }
            }
            else {
                const locationKind = common_2.FileLocationKind.fromString(matcher.fileLocation);
                if (locationKind) {
                    fileLocation = locationKind;
                    if (locationKind === common_2.FileLocationKind.Relative) {
                        filePrefix = '${workspaceFolder}';
                    }
                }
            }
        }
        return { fileLocation, filePrefix };
    }
    // copied from https://github.com/Microsoft/vscode/blob/1.33.1/src/vs/workbench/contrib/tasks/common/problemMatcher.ts
    fillDefaults() {
        this.add({
            name: 'msCompile',
            label: 'Microsoft compiler problems',
            owner: 'msCompile',
            applyTo: common_2.ApplyToKind.allDocuments,
            fileLocation: common_2.FileLocationKind.Absolute,
            pattern: (this.problemPatternRegistry.get('msCompile'))
        });
        this.add({
            name: 'lessCompile',
            label: 'Less problems',
            deprecated: true,
            owner: 'lessCompile',
            source: 'less',
            applyTo: common_2.ApplyToKind.allDocuments,
            fileLocation: common_2.FileLocationKind.Absolute,
            pattern: (this.problemPatternRegistry.get('lessCompile')),
            severity: severity_1.Severity.Error
        });
        this.add({
            name: 'gulp-tsc',
            label: 'Gulp TSC Problems',
            owner: 'typescript',
            source: 'ts',
            applyTo: common_2.ApplyToKind.closedDocuments,
            fileLocation: common_2.FileLocationKind.Relative,
            filePrefix: '${workspaceFolder}',
            pattern: (this.problemPatternRegistry.get('gulp-tsc'))
        });
        this.add({
            name: 'jshint',
            label: 'JSHint problems',
            owner: 'jshint',
            source: 'jshint',
            applyTo: common_2.ApplyToKind.allDocuments,
            fileLocation: common_2.FileLocationKind.Absolute,
            pattern: (this.problemPatternRegistry.get('jshint'))
        });
        this.add({
            name: 'jshint-stylish',
            label: 'JSHint stylish problems',
            owner: 'jshint',
            source: 'jshint',
            applyTo: common_2.ApplyToKind.allDocuments,
            fileLocation: common_2.FileLocationKind.Absolute,
            pattern: (this.problemPatternRegistry.get('jshint-stylish'))
        });
        this.add({
            name: 'eslint-compact',
            label: 'ESLint compact problems',
            owner: 'eslint',
            source: 'eslint',
            applyTo: common_2.ApplyToKind.allDocuments,
            fileLocation: common_2.FileLocationKind.Absolute,
            filePrefix: '${workspaceFolder}',
            pattern: (this.problemPatternRegistry.get('eslint-compact'))
        });
        this.add({
            name: 'eslint-stylish',
            label: 'ESLint stylish problems',
            owner: 'eslint',
            source: 'eslint',
            applyTo: common_2.ApplyToKind.allDocuments,
            fileLocation: common_2.FileLocationKind.Absolute,
            pattern: (this.problemPatternRegistry.get('eslint-stylish'))
        });
        this.add({
            name: 'go',
            label: 'Go problems',
            owner: 'go',
            source: 'go',
            applyTo: common_2.ApplyToKind.allDocuments,
            fileLocation: common_2.FileLocationKind.Relative,
            filePrefix: '${workspaceFolder}',
            pattern: (this.problemPatternRegistry.get('go'))
        });
    }
};
__decorate([
    (0, inversify_1.inject)(task_problem_pattern_registry_1.ProblemPatternRegistry),
    __metadata("design:type", task_problem_pattern_registry_1.ProblemPatternRegistry)
], ProblemMatcherRegistry.prototype, "problemPatternRegistry", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProblemMatcherRegistry.prototype, "init", null);
ProblemMatcherRegistry = __decorate([
    (0, inversify_1.injectable)()
], ProblemMatcherRegistry);
exports.ProblemMatcherRegistry = ProblemMatcherRegistry;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/task/lib/browser/task-problem-matcher-registry'] = this;


/***/ }),

/***/ "../../packages/task/lib/browser/task-problem-pattern-registry.js":
/*!************************************************************************!*\
  !*** ../../packages/task/lib/browser/task-problem-pattern-registry.js ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2019 Ericsson and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProblemPatternRegistry = void 0;
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
const promise_util_1 = __webpack_require__(/*! @theia/core/lib/common/promise-util */ "../../packages/core/lib/common/promise-util.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const common_1 = __webpack_require__(/*! ../common */ "../../packages/task/lib/common/index.js");
let ProblemPatternRegistry = class ProblemPatternRegistry {
    constructor() {
        this.patterns = new Map();
        this.readyPromise = new promise_util_1.Deferred();
    }
    init() {
        this.fillDefaults();
        this.readyPromise.resolve();
    }
    onReady() {
        return this.readyPromise.promise;
    }
    /**
     * Add a problem pattern to the registry.
     *
     * @param definition the problem pattern to be added.
     */
    register(value) {
        if (Array.isArray(value)) {
            const toDispose = new disposable_1.DisposableCollection();
            value.forEach(problemPatternContribution => toDispose.push(this.register(problemPatternContribution)));
            return toDispose;
        }
        if (!value.name) {
            console.error('Only named Problem Patterns can be registered.');
            return disposable_1.Disposable.NULL;
        }
        const problemPattern = common_1.ProblemPattern.fromProblemPatternContribution(value);
        return this.add(problemPattern.name, problemPattern);
    }
    /**
     * Finds the problem pattern(s) from the registry with the given name.
     *
     * @param key the name of the problem patterns
     * @return a problem pattern or an array of the problem patterns associated with the name. If no problem patterns are found, `undefined` is returned.
     */
    get(key) {
        return this.patterns.get(key);
    }
    add(key, value) {
        let toAdd;
        if (Array.isArray(value)) {
            toAdd = value.map(v => Object.assign(v, { name: key }));
        }
        else {
            toAdd = Object.assign(value, { name: key });
        }
        this.patterns.set(key, toAdd);
        return disposable_1.Disposable.create(() => this.patterns.delete(key));
    }
    // copied from https://github.com/Microsoft/vscode/blob/1.33.1/src/vs/workbench/contrib/tasks/common/problemMatcher.ts
    fillDefaults() {
        this.add('msCompile', {
            regexp: /^(?:\s+\d+\>)?([^\s].*)\((\d+|\d+,\d+|\d+,\d+,\d+,\d+)\)\s*:\s+(error|warning|info)\s+(\w{1,2}\d+)\s*:\s*(.*)$/.source,
            kind: common_1.ProblemLocationKind.Location,
            file: 1,
            location: 2,
            severity: 3,
            code: 4,
            message: 5
        });
        this.add('gulp-tsc', {
            regexp: /^([^\s].*)\((\d+|\d+,\d+|\d+,\d+,\d+,\d+)\):\s+(\d+)\s+(.*)$/.source,
            kind: common_1.ProblemLocationKind.Location,
            file: 1,
            location: 2,
            code: 3,
            message: 4
        });
        this.add('cpp', {
            regexp: /^([^\s].*)\((\d+|\d+,\d+|\d+,\d+,\d+,\d+)\):\s+(error|warning|info)\s+(C\d+)\s*:\s*(.*)$/.source,
            kind: common_1.ProblemLocationKind.Location,
            file: 1,
            location: 2,
            severity: 3,
            code: 4,
            message: 5
        });
        this.add('csc', {
            regexp: /^([^\s].*)\((\d+|\d+,\d+|\d+,\d+,\d+,\d+)\):\s+(error|warning|info)\s+(CS\d+)\s*:\s*(.*)$/.source,
            kind: common_1.ProblemLocationKind.Location,
            file: 1,
            location: 2,
            severity: 3,
            code: 4,
            message: 5
        });
        this.add('vb', {
            regexp: /^([^\s].*)\((\d+|\d+,\d+|\d+,\d+,\d+,\d+)\):\s+(error|warning|info)\s+(BC\d+)\s*:\s*(.*)$/.source,
            kind: common_1.ProblemLocationKind.Location,
            file: 1,
            location: 2,
            severity: 3,
            code: 4,
            message: 5
        });
        this.add('lessCompile', {
            regexp: /^\s*(.*) in file (.*) line no. (\d+)$/.source,
            kind: common_1.ProblemLocationKind.Location,
            message: 1,
            file: 2,
            line: 3
        });
        this.add('jshint', {
            regexp: /^(.*):\s+line\s+(\d+),\s+col\s+(\d+),\s(.+?)(?:\s+\((\w)(\d+)\))?$/.source,
            kind: common_1.ProblemLocationKind.Location,
            file: 1,
            line: 2,
            character: 3,
            message: 4,
            severity: 5,
            code: 6
        });
        this.add('jshint-stylish', [
            {
                regexp: /^(.+)$/.source,
                kind: common_1.ProblemLocationKind.Location,
                file: 1
            },
            {
                regexp: /^\s+line\s+(\d+)\s+col\s+(\d+)\s+(.+?)(?:\s+\((\w)(\d+)\))?$/.source,
                line: 1,
                character: 2,
                message: 3,
                severity: 4,
                code: 5,
                loop: true
            }
        ]);
        this.add('eslint-compact', {
            regexp: /^(.+):\sline\s(\d+),\scol\s(\d+),\s(Error|Warning|Info)\s-\s(.+)\s\((.+)\)$/.source,
            file: 1,
            kind: common_1.ProblemLocationKind.Location,
            line: 2,
            character: 3,
            severity: 4,
            message: 5,
            code: 6
        });
        this.add('eslint-stylish', [
            {
                regexp: /^([^\s].*)$/.source,
                kind: common_1.ProblemLocationKind.Location,
                file: 1
            },
            {
                regexp: /^\s+(\d+):(\d+)\s+(error|warning|info)\s+(.+?)(?:\s\s+(.*))?$/.source,
                line: 1,
                character: 2,
                severity: 3,
                message: 4,
                code: 5,
                loop: true
            }
        ]);
        this.add('go', {
            regexp: /^([^:]*: )?((.:)?[^:]*):(\d+)(:(\d+))?: (.*)$/.source,
            kind: common_1.ProblemLocationKind.Location,
            file: 2,
            line: 4,
            character: 6,
            message: 7
        });
    }
};
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProblemPatternRegistry.prototype, "init", null);
ProblemPatternRegistry = __decorate([
    (0, inversify_1.injectable)()
], ProblemPatternRegistry);
exports.ProblemPatternRegistry = ProblemPatternRegistry;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/task/lib/browser/task-problem-pattern-registry'] = this;


/***/ }),

/***/ "../../packages/task/lib/browser/task-schema-updater.js":
/*!**************************************************************!*\
  !*** ../../packages/task/lib/browser/task-schema-updater.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2019 Red Hat, Inc. and others.
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
// This file is inspired by VSCode and partially copied from https://github.com/Microsoft/vscode/blob/1.33.1/src/vs/workbench/contrib/tasks/common/problemMatcher.ts
// 'problemMatcher.ts' copyright:
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TaskSchemaUpdater = exports.taskSchemaId = void 0;
const Ajv = __webpack_require__(/*! @theia/core/shared/ajv */ "../../packages/core/shared/ajv/index.js");
const debounce = __webpack_require__(/*! p-debounce */ "../../node_modules/p-debounce/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const variable_input_schema_1 = __webpack_require__(/*! @theia/variable-resolver/lib/browser/variable-input-schema */ "../../packages/variable-resolver/lib/browser/variable-input-schema.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const task_problem_matcher_registry_1 = __webpack_require__(/*! ./task-problem-matcher-registry */ "../../packages/task/lib/browser/task-problem-matcher-registry.js");
const task_definition_registry_1 = __webpack_require__(/*! ./task-definition-registry */ "../../packages/task/lib/browser/task-definition-registry.js");
const common_2 = __webpack_require__(/*! ../common */ "../../packages/task/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/userstorage/lib/browser */ "../../packages/userstorage/lib/browser/index.js");
const browser_2 = __webpack_require__(/*! @theia/workspace/lib/browser */ "../../packages/workspace/lib/browser/index.js");
exports.taskSchemaId = 'vscode://schemas/tasks';
let TaskSchemaUpdater = class TaskSchemaUpdater {
    constructor() {
        this.onDidChangeTaskSchemaEmitter = new common_1.Emitter();
        this.onDidChangeTaskSchema = this.onDidChangeTaskSchemaEmitter.event;
        this.uri = new uri_1.default(exports.taskSchemaId);
        this.update = debounce(() => this.doUpdate(), 0);
    }
    init() {
        const resource = this.inmemoryResources.add(this.uri, '');
        if (resource.onDidChangeContents) {
            resource.onDidChangeContents(() => {
                this.onDidChangeTaskSchemaEmitter.fire(undefined);
            });
        }
        this.updateProblemMatcherNames();
        this.updateSupportedTaskTypes();
        // update problem matcher names in the task schema every time a problem matcher is added or disposed
        this.problemMatcherRegistry.onDidChangeProblemMatcher(() => this.updateProblemMatcherNames());
        // update supported task types in the task schema every time a task definition is registered or removed
        this.taskDefinitionRegistry.onDidRegisterTaskDefinition(() => this.updateSupportedTaskTypes());
        this.taskDefinitionRegistry.onDidUnregisterTaskDefinition(() => this.updateSupportedTaskTypes());
    }
    registerSchemas(context) {
        context.registerSchema({
            fileMatch: ['tasks.json', browser_1.UserStorageUri.resolve('tasks.json').toString()],
            url: this.uri.toString()
        });
        this.workspaceService.updateSchema('tasks', { $ref: this.uri.toString() });
    }
    doUpdate() {
        taskConfigurationSchema.anyOf = [processTaskConfigurationSchema, ...customizedDetectedTasks, ...customSchemas];
        const schema = this.getTaskSchema();
        this.doValidate = new Ajv().compile(schema);
        const schemaContent = JSON.stringify(schema);
        this.inmemoryResources.update(this.uri, schemaContent);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validate(data) {
        return !!this.doValidate && !!this.doValidate(data);
    }
    /**
     * Adds given task schema to `taskConfigurationSchema` as `oneOf` subschema.
     * Replaces existed subschema by given schema if the corresponding `$id` properties are equal.
     *
     * Note: please provide `$id` property for subschema to have ability remove/replace it.
     * @param schema subschema for adding to `taskConfigurationSchema`
     */
    addSubschema(schema) {
        const schemaId = schema.$id;
        if (schemaId) {
            this.doRemoveSubschema(schemaId);
        }
        customSchemas.push(schema);
        this.update();
    }
    /**
     * Removes task subschema from `taskConfigurationSchema`.
     *
     * @param arg `$id` property of subschema
     */
    removeSubschema(arg) {
        const isRemoved = this.doRemoveSubschema(arg);
        if (isRemoved) {
            this.update();
        }
    }
    /**
     * Removes task subschema from `customSchemas`, use `update()` to apply the changes for `taskConfigurationSchema`.
     *
     * @param arg `$id` property of subschema
     * @returns `true` if subschema was removed, `false` otherwise
     */
    doRemoveSubschema(arg) {
        const index = customSchemas.findIndex(existed => !!existed.$id && existed.$id === arg);
        if (index > -1) {
            customSchemas.splice(index, 1);
            return true;
        }
        return false;
    }
    /** Returns an array of task types that are registered, including the default types */
    async getRegisteredTaskTypes() {
        const serverSupportedTypes = await this.taskServer.getRegisteredTaskTypes();
        const browserSupportedTypes = this.taskDefinitionRegistry.getAll().map(def => def.taskType);
        const allTypes = new Set([...serverSupportedTypes, ...browserSupportedTypes]);
        return Array.from(allTypes.values()).sort();
    }
    updateSchemasForRegisteredTasks() {
        customizedDetectedTasks.length = 0;
        const definitions = this.taskDefinitionRegistry.getAll();
        definitions.forEach(def => {
            const customizedDetectedTask = {
                type: 'object',
                required: ['type'],
                properties: {}
            };
            const taskType = {
                ...defaultTaskType,
                enum: [def.taskType],
                default: def.taskType,
                description: 'The task type to customize'
            };
            customizedDetectedTask.properties.type = taskType;
            const required = def.properties.required || [];
            def.properties.all.forEach(taskProp => {
                if (required.find(requiredProp => requiredProp === taskProp)) { // property is mandatory
                    customizedDetectedTask.required.push(taskProp);
                }
                customizedDetectedTask.properties[taskProp] = { ...def.properties.schema.properties[taskProp] };
            });
            customizedDetectedTask.properties.label = taskLabel;
            customizedDetectedTask.properties.problemMatcher = problemMatcher;
            customizedDetectedTask.properties.presentation = presentation;
            customizedDetectedTask.properties.options = commandOptionsSchema;
            customizedDetectedTask.properties.group = group;
            customizedDetectedTask.properties.detail = detail;
            customizedDetectedTask.additionalProperties = true;
            customizedDetectedTasks.push(customizedDetectedTask);
        });
    }
    /** Returns the task's JSON schema */
    getTaskSchema() {
        return {
            type: 'object',
            default: { version: '2.0.0', tasks: [] },
            properties: {
                version: {
                    type: 'string',
                    default: '2.0.0'
                },
                tasks: {
                    type: 'array',
                    items: {
                        ...(0, common_1.deepClone)(taskConfigurationSchema)
                    }
                },
                inputs: variable_input_schema_1.inputsSchema.definitions.inputs
            },
            additionalProperties: false,
            allowComments: true,
            allowTrailingCommas: true,
        };
    }
    /** Gets the most up-to-date names of problem matchers from the registry and update the task schema */
    updateProblemMatcherNames() {
        const matcherNames = this.problemMatcherRegistry.getAll().map(m => (0, common_2.asVariableName)(m.name));
        problemMatcherNames.length = 0;
        problemMatcherNames.push(...matcherNames);
        this.update();
    }
    async updateSupportedTaskTypes() {
        this.updateSchemasForRegisteredTasks();
        this.update();
    }
};
__decorate([
    (0, inversify_1.inject)(common_1.InMemoryResources),
    __metadata("design:type", common_1.InMemoryResources)
], TaskSchemaUpdater.prototype, "inmemoryResources", void 0);
__decorate([
    (0, inversify_1.inject)(task_problem_matcher_registry_1.ProblemMatcherRegistry),
    __metadata("design:type", task_problem_matcher_registry_1.ProblemMatcherRegistry)
], TaskSchemaUpdater.prototype, "problemMatcherRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(task_definition_registry_1.TaskDefinitionRegistry),
    __metadata("design:type", task_definition_registry_1.TaskDefinitionRegistry)
], TaskSchemaUpdater.prototype, "taskDefinitionRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(common_2.TaskServer),
    __metadata("design:type", Object)
], TaskSchemaUpdater.prototype, "taskServer", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.WorkspaceService),
    __metadata("design:type", browser_2.WorkspaceService)
], TaskSchemaUpdater.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TaskSchemaUpdater.prototype, "init", null);
TaskSchemaUpdater = __decorate([
    (0, inversify_1.injectable)()
], TaskSchemaUpdater);
exports.TaskSchemaUpdater = TaskSchemaUpdater;
const commandSchema = {
    type: 'string',
    description: 'The actual command or script to execute'
};
const commandArgSchema = {
    type: 'array',
    description: 'A list of strings, each one being one argument to pass to the command',
    items: {
        type: 'string'
    }
};
const commandOptionsSchema = {
    type: 'object',
    description: 'The command options used when the command is executed',
    properties: {
        cwd: {
            type: 'string',
            description: 'The directory in which the command will be executed',
            default: '${workspaceFolder}'
        },
        env: {
            type: 'object',
            description: 'The environment of the executed program or shell. If omitted the parent process\' environment is used'
        },
        shell: {
            type: 'object',
            description: 'Configuration of the shell when task type is `shell`',
            properties: {
                executable: {
                    type: 'string',
                    description: 'The shell to use'
                },
                args: {
                    type: 'array',
                    description: `The arguments to be passed to the shell executable to run in command mode
                        (e.g ['-c'] for bash or ['/S', '/C'] for cmd.exe)`,
                    items: {
                        type: 'string'
                    }
                }
            }
        }
    }
};
const problemMatcherNames = [];
const defaultTaskTypes = ['shell', 'process'];
const supportedTaskTypes = [...defaultTaskTypes];
const taskLabel = {
    type: 'string',
    description: 'A unique string that identifies the task that is also used as task\'s user interface label'
};
const defaultTaskType = {
    type: 'string',
    enum: supportedTaskTypes,
    default: defaultTaskTypes[0],
    description: 'Determines what type of process will be used to execute the task. Only shell types will have output shown on the user interface'
};
const commandAndArgs = {
    command: commandSchema,
    args: commandArgSchema,
    options: commandOptionsSchema
};
const group = {
    oneOf: [
        {
            type: 'string'
        },
        {
            type: 'object',
            properties: {
                kind: {
                    type: 'string',
                    default: 'none',
                    description: 'The task\'s execution group.'
                },
                isDefault: {
                    type: 'boolean',
                    default: false,
                    description: 'Defines if this task is the default task in the group.'
                }
            }
        }
    ],
    enum: [
        { kind: 'build', isDefault: true },
        { kind: 'test', isDefault: true },
        'build',
        'test',
        'none'
    ],
    enumDescriptions: [
        'Marks the task as the default build task.',
        'Marks the task as the default test task.',
        'Marks the task as a build task accessible through the \'Run Build Task\' command.',
        'Marks the task as a test task accessible through the \'Run Test Task\' command.',
        'Assigns the task to no group'
    ],
    // eslint-disable-next-line max-len
    description: 'Defines to which execution group this task belongs to. It supports "build" to add it to the build group and "test" to add it to the test group.'
};
const problemPattern = {
    default: {
        regexp: '^([^\\\\s].*)\\\\((\\\\d+,\\\\d+)\\\\):\\\\s*(.*)$',
        file: 1,
        location: 2,
        message: 3
    },
    type: 'object',
    properties: {
        regexp: {
            type: 'string',
            description: 'The regular expression to find an error, warning or info in the output.'
        },
        kind: {
            type: 'string',
            description: 'whether the pattern matches a location (file and line) or only a file.'
        },
        file: {
            type: 'integer',
            description: 'The match group index of the filename. If omitted 1 is used.'
        },
        location: {
            type: 'integer',
            // eslint-disable-next-line max-len
            description: 'The match group index of the problem\'s location. Valid location patterns are: (line), (line,column) and (startLine,startColumn,endLine,endColumn). If omitted (line,column) is assumed.'
        },
        line: {
            type: 'integer',
            description: 'The match group index of the problem\'s line. Defaults to 2'
        },
        column: {
            type: 'integer',
            description: 'The match group index of the problem\'s line character. Defaults to 3'
        },
        endLine: {
            type: 'integer',
            description: 'The match group index of the problem\'s end line. Defaults to undefined'
        },
        endColumn: {
            type: 'integer',
            description: 'The match group index of the problem\'s end line character. Defaults to undefined'
        },
        severity: {
            type: 'integer',
            description: 'The match group index of the problem\'s severity. Defaults to undefined'
        },
        code: {
            type: 'integer',
            description: 'The match group index of the problem\'s code. Defaults to undefined'
        },
        message: {
            type: 'integer',
            description: 'The match group index of the message. If omitted it defaults to 4 if location is specified. Otherwise it defaults to 5.'
        },
        loop: {
            type: 'boolean',
            // eslint-disable-next-line max-len
            description: 'In a multi line matcher loop indicated whether this pattern is executed in a loop as long as it matches. Can only specified on a last pattern in a multi line pattern.'
        }
    }
};
const multiLineProblemPattern = {
    type: 'array',
    items: problemPattern
};
const watchingPattern = {
    type: 'object',
    additionalProperties: false,
    properties: {
        regexp: {
            type: 'string',
            description: 'The regular expression to detect the begin or end of a background task.'
        },
        file: {
            type: 'integer',
            description: 'The match group index of the filename. Can be omitted.'
        },
    }
};
const patternType = {
    anyOf: [
        {
            type: 'string',
            description: 'The name of a contributed or predefined pattern'
        },
        problemPattern,
        multiLineProblemPattern
    ],
    description: 'A problem pattern or the name of a contributed or predefined problem pattern. Can be omitted if base is specified.'
};
const problemMatcherObject = {
    type: 'object',
    properties: {
        base: {
            type: 'string',
            enum: problemMatcherNames,
            description: 'The name of a base problem matcher to use.'
        },
        owner: {
            type: 'string',
            description: 'The owner of the problem inside Code. Can be omitted if base is specified. Defaults to \'external\' if omitted and base is not specified.'
        },
        source: {
            type: 'string',
            description: 'A human-readable string describing the source of this diagnostic, e.g. \'typescript\' or \'super lint\'.'
        },
        severity: {
            type: 'string',
            enum: ['error', 'warning', 'info'],
            description: 'The default severity for captures problems. Is used if the pattern doesn\'t define a match group for severity.'
        },
        applyTo: {
            type: 'string',
            enum: ['allDocuments', 'openDocuments', 'closedDocuments'],
            description: 'Controls if a problem reported on a text document is applied only to open, closed or all documents.'
        },
        pattern: patternType,
        fileLocation: {
            oneOf: [
                {
                    type: 'string',
                    enum: ['absolute', 'relative', 'autoDetect']
                },
                {
                    type: 'array',
                    items: {
                        type: 'string'
                    }
                }
            ],
            description: 'Defines how file names reported in a problem pattern should be interpreted.'
        },
        background: {
            type: 'object',
            additionalProperties: false,
            description: 'Patterns to track the begin and end of a matcher active on a background task.',
            properties: {
                activeOnStart: {
                    type: 'boolean',
                    description: 'If set to true the background monitor is in active mode when the task starts. This is equals of issuing a line that matches the beginsPattern'
                },
                beginsPattern: {
                    oneOf: [
                        {
                            type: 'string'
                        },
                        watchingPattern
                    ],
                    description: 'If matched in the output the start of a background task is signaled.'
                },
                endsPattern: {
                    oneOf: [
                        {
                            type: 'string'
                        },
                        watchingPattern
                    ],
                    description: 'If matched in the output the end of a background task is signaled.'
                }
            }
        },
        watching: {
            type: 'object',
            additionalProperties: false,
            deprecationMessage: 'The watching property is deprecated. Use background instead.',
            description: 'Patterns to track the begin and end of a watching matcher.',
            properties: {
                activeOnStart: {
                    type: 'boolean',
                    description: 'If set to true the watcher is in active mode when the task starts. This is equals of issuing a line that matches the beginPattern'
                },
                beginsPattern: {
                    oneOf: [
                        {
                            type: 'string'
                        },
                        watchingPattern
                    ],
                    description: 'If matched in the output the start of a watching task is signaled.'
                },
                endsPattern: {
                    oneOf: [
                        {
                            type: 'string'
                        },
                        watchingPattern
                    ],
                    description: 'If matched in the output the end of a watching task is signaled.'
                }
            }
        }
    }
};
const problemMatcher = {
    anyOf: [
        {
            type: 'string',
            description: 'Name of the problem matcher to parse the output of the task',
            enum: problemMatcherNames
        },
        {
            type: 'array',
            description: 'Name(s) of the problem matcher(s) to parse the output of the task',
            items: {
                type: 'string',
                enum: problemMatcherNames
            }
        },
        problemMatcherObject,
        {
            type: 'array',
            description: 'User defined problem matcher(s) to parse the output of the task',
            items: problemMatcherObject
        }
    ]
};
const presentation = {
    type: 'object',
    default: {
        echo: true,
        reveal: 'always',
        focus: false,
        panel: 'shared',
        showReuseMessage: true,
        clear: false
    },
    description: 'Configures the panel that is used to present the task\'s output and reads its input.',
    additionalProperties: true,
    properties: {
        echo: {
            type: 'boolean',
            default: true,
            description: 'Controls whether the executed command is echoed to the panel. Default is true.'
        },
        focus: {
            type: 'boolean',
            default: false,
            description: 'Controls whether the panel takes focus. Default is false. If set to true the panel is revealed as well.'
        },
        reveal: {
            type: 'string',
            enum: ['always', 'silent', 'never'],
            enumDescriptions: [
                'Always reveals the terminal when this task is executed.',
                'Only reveals the terminal if the task exits with an error or the problem matcher finds an error.',
                'Never reveals the terminal when this task is executed.'
            ],
            default: 'always',
            description: 'Controls whether the terminal running the task is revealed or not. May be overridden by option \"revealProblems\". Default is \"always\".'
        },
        panel: {
            type: 'string',
            enum: ['shared', 'dedicated', 'new'],
            enumDescriptions: [
                'The terminal is shared and the output of other task runs are added to the same terminal.',
                // eslint-disable-next-line max-len
                'The terminal is dedicated to a specific task. If that task is executed again, the terminal is reused. However, the output of a different task is presented in a different terminal.',
                'Every execution of that task is using a new clean terminal.'
            ],
            default: 'shared',
            description: 'Controls if the panel is shared between tasks, dedicated to this task or a new one is created on every run.'
        },
        showReuseMessage: {
            type: 'boolean',
            default: true,
            description: 'Controls whether to show the "Terminal will be reused by tasks" message.'
        },
        clear: {
            type: 'boolean',
            default: false,
            description: 'Controls whether the terminal is cleared before this task is run.'
        }
    }
};
const detail = {
    type: 'string',
    description: 'An optional description of a task that shows in the Run Task quick pick as a detail.'
};
const taskIdentifier = {
    type: 'object',
    additionalProperties: true,
    properties: {
        type: {
            type: 'string',
            description: 'The task identifier.'
        }
    }
};
const processTaskConfigurationSchema = {
    type: 'object',
    required: ['type', 'label', 'command'],
    properties: {
        label: taskLabel,
        type: defaultTaskType,
        ...commandAndArgs,
        isBackground: {
            type: 'boolean',
            default: false,
            description: 'Whether the executed task is kept alive and is running in the background.'
        },
        dependsOn: {
            anyOf: [
                {
                    type: 'string',
                    description: 'Another task this task depends on.'
                },
                taskIdentifier,
                {
                    type: 'array',
                    description: 'The other tasks this task depends on.',
                    items: {
                        anyOf: [
                            {
                                type: 'string'
                            },
                            taskIdentifier
                        ]
                    }
                }
            ],
            description: 'Either a string representing another task or an array of other tasks that this task depends on.'
        },
        dependsOrder: {
            type: 'string',
            enum: ['parallel', 'sequence'],
            enumDescriptions: [
                'Run all dependsOn tasks in parallel.',
                'Run all dependsOn tasks in sequence.'
            ],
            default: 'parallel',
            description: 'Determines the order of the dependsOn tasks for this task. Note that this property is not recursive.'
        },
        windows: {
            type: 'object',
            description: 'Windows specific command configuration that overrides the command, args, and options',
            properties: commandAndArgs
        },
        osx: {
            type: 'object',
            description: 'MacOS specific command configuration that overrides the command, args, and options',
            properties: commandAndArgs
        },
        linux: {
            type: 'object',
            description: 'Linux specific command configuration that overrides the default command, args, and options',
            properties: commandAndArgs
        },
        group,
        problemMatcher,
        presentation,
        detail,
    },
    additionalProperties: true
};
const customizedDetectedTasks = [];
const customSchemas = [];
const taskConfigurationSchema = {
    $id: exports.taskSchemaId,
    anyOf: [processTaskConfigurationSchema, ...customizedDetectedTasks, ...customSchemas]
};

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/task/lib/browser/task-schema-updater'] = this;


/***/ }),

/***/ "../../packages/task/lib/browser/task-service.js":
/*!*******************************************************!*\
  !*** ../../packages/task/lib/browser/task-service.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TaskService = exports.TaskEndedTypes = void 0;
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const opener_service_1 = __webpack_require__(/*! @theia/core/lib/browser/opener-service */ "../../packages/core/lib/browser/opener-service.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const message_service_1 = __webpack_require__(/*! @theia/core/lib/common/message-service */ "../../packages/core/lib/common/message-service.js");
const promise_util_1 = __webpack_require__(/*! @theia/core/lib/common/promise-util */ "../../packages/core/lib/common/promise-util.js");
const quick_pick_service_1 = __webpack_require__(/*! @theia/core/lib/common/quick-pick-service */ "../../packages/core/lib/common/quick-pick-service.js");
const label_provider_1 = __webpack_require__(/*! @theia/core/lib/browser/label-provider */ "../../packages/core/lib/browser/label-provider.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const browser_2 = __webpack_require__(/*! @theia/editor/lib/browser */ "../../packages/editor/lib/browser/index.js");
const problem_manager_1 = __webpack_require__(/*! @theia/markers/lib/browser/problem/problem-manager */ "../../packages/markers/lib/browser/problem/problem-manager.js");
const terminal_service_1 = __webpack_require__(/*! @theia/terminal/lib/browser/base/terminal-service */ "../../packages/terminal/lib/browser/base/terminal-service.js");
const browser_3 = __webpack_require__(/*! @theia/variable-resolver/lib/browser */ "../../packages/variable-resolver/lib/browser/index.js");
const workspace_service_1 = __webpack_require__(/*! @theia/workspace/lib/browser/workspace-service */ "../../packages/workspace/lib/browser/workspace-service.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const vscode_languageserver_protocol_1 = __webpack_require__(/*! @theia/core/shared/vscode-languageserver-protocol */ "../../packages/core/shared/vscode-languageserver-protocol/index.js");
const common_2 = __webpack_require__(/*! ../common */ "../../packages/task/lib/common/index.js");
const task_watcher_1 = __webpack_require__(/*! ../common/task-watcher */ "../../packages/task/lib/common/task-watcher.js");
const provided_task_configurations_1 = __webpack_require__(/*! ./provided-task-configurations */ "../../packages/task/lib/browser/provided-task-configurations.js");
const task_configurations_1 = __webpack_require__(/*! ./task-configurations */ "../../packages/task/lib/browser/task-configurations.js");
const task_contribution_1 = __webpack_require__(/*! ./task-contribution */ "../../packages/task/lib/browser/task-contribution.js");
const task_definition_registry_1 = __webpack_require__(/*! ./task-definition-registry */ "../../packages/task/lib/browser/task-definition-registry.js");
const task_name_resolver_1 = __webpack_require__(/*! ./task-name-resolver */ "../../packages/task/lib/browser/task-name-resolver.js");
const task_source_resolver_1 = __webpack_require__(/*! ./task-source-resolver */ "../../packages/task/lib/browser/task-source-resolver.js");
const task_problem_matcher_registry_1 = __webpack_require__(/*! ./task-problem-matcher-registry */ "../../packages/task/lib/browser/task-problem-matcher-registry.js");
const task_schema_updater_1 = __webpack_require__(/*! ./task-schema-updater */ "../../packages/task/lib/browser/task-schema-updater.js");
const task_configuration_manager_1 = __webpack_require__(/*! ./task-configuration-manager */ "../../packages/task/lib/browser/task-configuration-manager.js");
const problem_widget_1 = __webpack_require__(/*! @theia/markers/lib/browser/problem/problem-widget */ "../../packages/markers/lib/browser/problem/problem-widget.js");
const task_node_1 = __webpack_require__(/*! ./task-node */ "../../packages/task/lib/browser/task-node.js");
const monaco_workspace_1 = __webpack_require__(/*! @theia/monaco/lib/browser/monaco-workspace */ "../../packages/monaco/lib/browser/monaco-workspace.js");
const task_terminal_widget_manager_1 = __webpack_require__(/*! ./task-terminal-widget-manager */ "../../packages/task/lib/browser/task-terminal-widget-manager.js");
const shell_terminal_protocol_1 = __webpack_require__(/*! @theia/terminal/lib/common/shell-terminal-protocol */ "../../packages/terminal/lib/common/shell-terminal-protocol.js");
const async_mutex_1 = __webpack_require__(/*! async-mutex */ "../../node_modules/async-mutex/lib/index.js");
var TaskEndedTypes;
(function (TaskEndedTypes) {
    TaskEndedTypes[TaskEndedTypes["TaskExited"] = 0] = "TaskExited";
    TaskEndedTypes[TaskEndedTypes["BackgroundTaskEnded"] = 1] = "BackgroundTaskEnded";
})(TaskEndedTypes = exports.TaskEndedTypes || (exports.TaskEndedTypes = {}));
let TaskService = class TaskService {
    constructor() {
        /**
         * The last executed task.
         */
        this.lastTask = { resolvedTask: undefined, option: undefined };
        this.cachedRecentTasks = [];
        this.runningTasks = new Map();
        this.taskStartingLock = new async_mutex_1.Mutex();
    }
    init() {
        this.getRunningTasks().then(tasks => tasks.forEach(task => {
            if (!this.runningTasks.has(task.taskId)) {
                this.runningTasks.set(task.taskId, {
                    exitCode: new promise_util_1.Deferred(), terminateSignal: new promise_util_1.Deferred(),
                    isBackgroundTaskEnded: new promise_util_1.Deferred()
                });
            }
        }));
        // notify user that task has started
        this.taskWatcher.onTaskCreated((event) => {
            if (!this.isEventForThisClient(event.ctx)) {
                return;
            }
            this.runningTasks.set(event.taskId, {
                exitCode: new promise_util_1.Deferred(),
                terminateSignal: new promise_util_1.Deferred(),
                isBackgroundTaskEnded: new promise_util_1.Deferred()
            });
        });
        this.taskWatcher.onOutputProcessed(async (event) => {
            if (!this.isEventForThisClient(event.ctx)) {
                return;
            }
            if (event.problems) {
                const runningTasksInfo = await this.getRunningTasks();
                // check if the task is active
                const matchedRunningTaskInfo = runningTasksInfo.find(taskInfo => {
                    const taskConfig = taskInfo.config;
                    return this.taskDefinitionRegistry.compareTasks(taskConfig, event.config);
                });
                const isTaskActiveAndOutputSilent = matchedRunningTaskInfo &&
                    matchedRunningTaskInfo.config.presentation && matchedRunningTaskInfo.config.presentation.reveal === common_2.RevealKind.Silent;
                event.problems.forEach(problem => {
                    const existingMarkers = this.problemManager.findMarkers({ owner: problem.description.owner });
                    const uris = new Set();
                    existingMarkers.forEach(marker => uris.add(marker.uri));
                    if (common_2.ProblemMatchData.is(problem) && problem.resource) {
                        // When task.presentation.reveal === RevealKind.Silent, put focus on the terminal only if it is an error
                        if (isTaskActiveAndOutputSilent && problem.marker.severity === vscode_languageserver_protocol_1.DiagnosticSeverity.Error) {
                            const terminalId = matchedRunningTaskInfo.terminalId;
                            if (terminalId) {
                                const terminal = this.terminalService.getByTerminalId(terminalId);
                                if (terminal) {
                                    const focus = !!matchedRunningTaskInfo.config.presentation.focus;
                                    if (focus) { // assign focus to the terminal if presentation.focus is true
                                        this.terminalService.open(terminal, { mode: 'activate' });
                                    }
                                    else { // show the terminal but not assign focus
                                        this.terminalService.open(terminal, { mode: 'reveal' });
                                    }
                                }
                            }
                        }
                        const uri = problem.resource.withScheme(problem.resource.scheme);
                        const document = this.monacoWorkspace.getTextDocument(uri.toString());
                        if (problem.description.applyTo === common_2.ApplyToKind.openDocuments && !!document ||
                            problem.description.applyTo === common_2.ApplyToKind.closedDocuments && !document ||
                            problem.description.applyTo === common_2.ApplyToKind.allDocuments) {
                            if (uris.has(uri.toString())) {
                                const newData = [
                                    ...existingMarkers
                                        .filter(marker => marker.uri === uri.toString())
                                        .map(markerData => markerData.data),
                                    problem.marker
                                ];
                                this.problemManager.setMarkers(uri, problem.description.owner, newData);
                            }
                            else {
                                this.problemManager.setMarkers(uri, problem.description.owner, [problem.marker]);
                            }
                        }
                    }
                    else { // should have received an event for finding the "background task begins" pattern
                        uris.forEach(uriString => this.problemManager.setMarkers(new uri_1.default(uriString), problem.description.owner, []));
                    }
                });
            }
        });
        this.taskWatcher.onBackgroundTaskEnded((event) => {
            if (!this.isEventForThisClient(event.ctx)) {
                return;
            }
            if (!this.runningTasks.has(event.taskId)) {
                this.runningTasks.set(event.taskId, {
                    exitCode: new promise_util_1.Deferred(),
                    terminateSignal: new promise_util_1.Deferred(),
                    isBackgroundTaskEnded: new promise_util_1.Deferred()
                });
            }
            this.runningTasks.get(event.taskId).isBackgroundTaskEnded.resolve(true);
        });
        // notify user that task has finished
        this.taskWatcher.onTaskExit((event) => {
            if (!this.isEventForThisClient(event.ctx)) {
                return;
            }
            if (!this.runningTasks.has(event.taskId)) {
                this.runningTasks.set(event.taskId, {
                    exitCode: new promise_util_1.Deferred(),
                    terminateSignal: new promise_util_1.Deferred(),
                    isBackgroundTaskEnded: new promise_util_1.Deferred()
                });
            }
            this.runningTasks.get(event.taskId).exitCode.resolve(event.code);
            this.runningTasks.get(event.taskId).terminateSignal.resolve(event.signal);
            setTimeout(() => this.runningTasks.delete(event.taskId), 60 * 1000);
            const taskConfig = event.config;
            const taskIdentifier = taskConfig ? this.getTaskIdentifier(taskConfig) : event.taskId.toString();
            if (event.code !== undefined) {
                if (event.code !== 0) {
                    const eventTaskConfig = event.config;
                    if (eventTaskConfig && eventTaskConfig.presentation && eventTaskConfig.presentation.reveal === common_2.RevealKind.Silent && event.terminalId) {
                        const terminal = this.terminalService.getByTerminalId(event.terminalId);
                        const focus = !!eventTaskConfig.presentation.focus;
                        if (terminal) {
                            if (focus) { // assign focus to the terminal if presentation.focus is true
                                this.terminalService.open(terminal, { mode: 'activate' });
                            }
                            else { // show the terminal but not assign focus
                                this.terminalService.open(terminal, { mode: 'reveal' });
                            }
                        }
                    }
                    this.messageService.error(`Task '${taskIdentifier}' has exited with code ${event.code}.`);
                }
            }
            else if (event.signal !== undefined) {
                this.messageService.info(`Task '${taskIdentifier}' was terminated by signal ${event.signal}.`);
            }
            else {
                console.error('Invalid TaskExitedEvent received, neither code nor signal is set.');
            }
        });
    }
    getTaskIdentifier(taskConfig) {
        const taskName = this.taskNameResolver.resolve(taskConfig);
        const sourceStrUri = this.taskSourceResolver.resolve(taskConfig);
        return `${taskName} (${this.labelProvider.getName(new uri_1.default(sourceStrUri))})`;
    }
    /**
     * Client should call this method to indicate that a new user-level action related to tasks has been started,
     * like invoking "Run Task..."
     * This method returns a token that can be used with various methods in this service.
     * As long as a client uses the same token, task providers will only asked once to contribute
     * tasks and the set of tasks will be cached. Each time the a new token is used, the cache of
     * contributed tasks is cleared.
     * @returns a token to be used for task-related actions
     */
    startUserAction() {
        return this.providedTaskConfigurations.startUserAction();
    }
    /**
     * Returns an array of the task configurations configured in tasks.json and provided by the extensions.
     * @param token  The cache token for the user interaction in progress
     */
    async getTasks(token) {
        const configuredTasks = await this.getConfiguredTasks(token);
        const providedTasks = await this.getProvidedTasks(token);
        const notCustomizedProvidedTasks = providedTasks.filter(provided => !configuredTasks.some(configured => this.taskDefinitionRegistry.compareTasks(configured, provided)));
        return [...configuredTasks, ...notCustomizedProvidedTasks];
    }
    /**
     * Returns an array of the valid task configurations which are configured in tasks.json files
     * @param token  The cache token for the user interaction in progress
     *
     */
    async getConfiguredTasks(token) {
        const invalidTaskConfig = this.taskConfigurations.getInvalidTaskConfigurations()[0];
        if (invalidTaskConfig) {
            const widget = await this.widgetManager.getOrCreateWidget(problem_widget_1.PROBLEMS_WIDGET_ID);
            const isProblemsWidgetVisible = widget && widget.isVisible;
            const currentEditorUri = this.editorManager.currentEditor && this.editorManager.currentEditor.editor.getResourceUri();
            let isInvalidTaskConfigFileOpen = false;
            if (currentEditorUri) {
                const folderUri = this.workspaceService.getWorkspaceRootUri(currentEditorUri);
                if (folderUri && folderUri.toString() === invalidTaskConfig._scope) {
                    isInvalidTaskConfigFileOpen = true;
                }
            }
            const warningMessage = 'Invalid task configurations are found. Open tasks.json and find details in the Problems view.';
            if (!isProblemsWidgetVisible || !isInvalidTaskConfigFileOpen) {
                this.messageService.warn(warningMessage, 'Open').then(actionOpen => {
                    if (actionOpen) {
                        if (invalidTaskConfig && invalidTaskConfig._scope) {
                            this.taskConfigurationManager.openConfiguration(invalidTaskConfig._scope);
                        }
                        if (!isProblemsWidgetVisible) {
                            this.commands.executeCommand('problemsView:toggle');
                        }
                    }
                });
            }
            else {
                this.messageService.warn(warningMessage);
            }
        }
        const validTaskConfigs = await this.taskConfigurations.getTasks(token);
        return validTaskConfigs;
    }
    /**
     * Returns an array that contains the task configurations provided by the task providers for the specified task type.
     * @param token  The cache token for the user interaction in progress
     * @param type The task type (filter) associated to the returning TaskConfigurations
     *
     * '*' indicates all tasks regardless of the type
     */
    getProvidedTasks(token, type) {
        return this.providedTaskConfigurations.getTasks(token, type);
    }
    addRecentTasks(tasks) {
        if (Array.isArray(tasks)) {
            tasks.forEach(task => this.addRecentTasks(task));
        }
        else {
            const ind = this.cachedRecentTasks.findIndex(recent => this.taskDefinitionRegistry.compareTasks(recent, tasks));
            if (ind >= 0) {
                this.cachedRecentTasks.splice(ind, 1);
            }
            this.cachedRecentTasks.unshift(tasks);
        }
    }
    get recentTasks() {
        return this.cachedRecentTasks;
    }
    set recentTasks(recent) {
        this.cachedRecentTasks = recent;
    }
    /**
     * Clears the list of recently used tasks.
     */
    clearRecentTasks() {
        this.cachedRecentTasks = [];
    }
    /**
     * Open user ser
     */
    openUserTasks() {
        return this.taskConfigurations.openUserTasks();
    }
    /**
     * Returns a task configuration provided by an extension by task source, scope and label.
     * If there are no task configuration, returns undefined.
     * @param token  The cache token for the user interaction in progress
     * @param source The source for configured tasks
     * @param label  The label of the task to find
     * @param scope  The task scope to look in
     */
    async getProvidedTask(token, source, label, scope) {
        return this.providedTaskConfigurations.getTask(token, source, label, scope);
    }
    /** Returns an array of running tasks 'TaskInfo' objects */
    getRunningTasks() {
        return this.taskServer.getTasks(this.getContext());
    }
    async customExecutionComplete(id, exitCode) {
        return this.taskServer.customExecutionComplete(id, exitCode);
    }
    /** Returns an array of task types that are registered, including the default types */
    getRegisteredTaskTypes() {
        return this.taskSchemaUpdater.getRegisteredTaskTypes();
    }
    /**
     * Get the last executed task.
     *
     * @returns the last executed task or `undefined`.
     */
    getLastTask() {
        return this.lastTask;
    }
    /**
     * Runs a task, by task configuration label.
     * Note, it looks for a task configured in tasks.json only.
     * @param token  The cache token for the user interaction in progress
     * @param scope The scope where to look for tasks
     * @param taskLabel the label to look for
     */
    async runConfiguredTask(token, scope, taskLabel) {
        const task = this.taskConfigurations.getTask(scope, taskLabel);
        if (!task) {
            this.logger.error(`Can't get task launch configuration for label: ${taskLabel}`);
            return;
        }
        this.run(token, task._source, taskLabel, scope);
    }
    /**
     * Run the last executed task.
     * @param token  The cache token for the user interaction in progress
     */
    async runLastTask(token) {
        var _a, _b;
        if (!((_a = this.lastTask) === null || _a === void 0 ? void 0 : _a.resolvedTask)) {
            return;
        }
        if (!((_b = this.lastTask.resolvedTask.runOptions) === null || _b === void 0 ? void 0 : _b.reevaluateOnRerun)) {
            return this.runResolvedTask(this.lastTask.resolvedTask, this.lastTask.option);
        }
        const { _source, label, _scope } = this.lastTask.resolvedTask;
        return this.run(token, _source, label, _scope);
    }
    /**
     * Runs a task, by the source and label of the task configuration.
     * It looks for configured and detected tasks.
     * @param token  The cache token for the user interaction in progress
     * @param source The source for configured tasks
     * @param taskLabel The label to look for
     * @param scope  The scope where to look for tasks
     */
    async run(token, source, taskLabel, scope) {
        var _a, _b;
        let task;
        task = this.taskConfigurations.getTask(scope, taskLabel);
        if (!task) { // if a configured task cannot be found, search from detected tasks
            task = await this.getProvidedTask(token, source, taskLabel, scope);
            if (!task) { // find from the customized detected tasks
                task = await this.taskConfigurations.getCustomizedTask(token, scope, taskLabel);
            }
            if (!task) {
                this.logger.error(`Can't get task launch configuration for label: ${taskLabel}`);
                return;
            }
        }
        const customizationObject = await this.getTaskCustomization(task);
        if (!customizationObject.problemMatcher) {
            // ask the user what s/he wants to use to parse the task output
            const items = this.getCustomizeProblemMatcherItems();
            const selected = await this.quickPickService.show(items, {
                placeholder: 'Select for which kind of errors and warnings to scan the task output'
            });
            if (selected && ('value' in selected)) {
                if ((_a = selected.value) === null || _a === void 0 ? void 0 : _a.problemMatchers) {
                    let matcherNames = [];
                    if (selected.value.problemMatchers && selected.value.problemMatchers.length === 0) { // never parse output for this task
                        matcherNames = [];
                    }
                    else if (selected.value.problemMatchers && selected.value.problemMatchers.length > 0) { // continue with user-selected parser
                        matcherNames = selected.value.problemMatchers.map(matcher => matcher.name);
                    }
                    customizationObject.problemMatcher = matcherNames;
                    // write the selected matcher (or the decision of "never parse") into the `tasks.json`
                    this.updateTaskConfiguration(token, task, { problemMatcher: matcherNames });
                }
                else if ((_b = selected.value) === null || _b === void 0 ? void 0 : _b.learnMore) { // user wants to learn more about parsing task output
                    (0, opener_service_1.open)(this.openerService, new uri_1.default('https://code.visualstudio.com/docs/editor/tasks#_processing-task-output-with-problem-matchers'));
                }
                // else, continue the task with no parser
            }
            else { // do not start the task in case that the user did not select any item from the list
                return;
            }
        }
        const resolvedMatchers = await this.resolveProblemMatchers(task, customizationObject);
        const runTaskOption = {
            customization: { ...customizationObject, ...{ problemMatcher: resolvedMatchers } }
        };
        if (task.dependsOn) {
            return this.runCompoundTask(token, task, runTaskOption);
        }
        else {
            return this.runTask(task, runTaskOption).catch(error => {
                console.error('Error at launching task', error);
                return undefined;
            });
        }
    }
    /**
     * Runs a compound task
     * @param token  The cache token for the user interaction in progress
     * @param task The task to be executed
     * @param option options for executing the task
     */
    async runCompoundTask(token, task, option) {
        const tasks = await this.getWorkspaceTasks(token, task._scope);
        try {
            const rootNode = new task_node_1.TaskNode(task, [], []);
            this.detectDirectedAcyclicGraph(task, rootNode, tasks);
        }
        catch (error) {
            console.error(`Error at launching task '${task.label}'`, error);
            this.messageService.error(error.message);
            return undefined;
        }
        return this.runTasksGraph(task, tasks, option).catch(error => {
            console.error(`Error at launching task '${task.label}'`, error);
            return undefined;
        });
    }
    /**
     * A recursive function that runs a task and all its sub tasks that it depends on.
     * A task can be executed only when all of its dependencies have been executed, or when it doesn’t have any dependencies at all.
     */
    async runTasksGraph(task, tasks, option) {
        if (task && task.dependsOn) {
            // In case it is an array of task dependencies
            if (Array.isArray(task.dependsOn) && task.dependsOn.length > 0) {
                const dependentTasks = [];
                for (let i = 0; i < task.dependsOn.length; i++) {
                    // It may be a string (a task label) or a JSON object which represents a TaskIdentifier (e.g. {"type":"npm", "script":"script1"})
                    const taskIdentifier = task.dependsOn[i];
                    const dependentTask = this.getDependentTask(taskIdentifier, tasks);
                    const taskCustomization = await this.getTaskCustomization(dependentTask);
                    const resolvedMatchers = await this.resolveProblemMatchers(dependentTask, taskCustomization);
                    dependentTasks.push({ 'task': dependentTask, 'taskCustomization': taskCustomization, 'resolvedMatchers': resolvedMatchers });
                    // In case the 'dependsOrder' is 'sequence'
                    if (task.dependsOrder && task.dependsOrder === common_2.DependsOrder.Sequence) {
                        await this.runTasksGraph(dependentTask, tasks, {
                            customization: { ...taskCustomization, ...{ problemMatcher: resolvedMatchers } }
                        });
                    }
                }
                // In case the 'dependsOrder' is 'parallel'
                if (((!task.dependsOrder) || (task.dependsOrder && task.dependsOrder === common_2.DependsOrder.Parallel))) {
                    const promises = dependentTasks.map(item => this.runTasksGraph(item.task, tasks, {
                        customization: { ...item.taskCustomization, ...{ problemMatcher: item.resolvedMatchers } }
                    }));
                    await Promise.all(promises);
                }
            }
            else if (!Array.isArray(task.dependsOn)) {
                // In case it is a string (a task label) or a JSON object which represents a TaskIdentifier (e.g. {"type":"npm", "script":"script1"})
                const taskIdentifier = task.dependsOn;
                const dependentTask = this.getDependentTask(taskIdentifier, tasks);
                const taskCustomization = await this.getTaskCustomization(dependentTask);
                const resolvedMatchers = await this.resolveProblemMatchers(dependentTask, taskCustomization);
                await this.runTasksGraph(dependentTask, tasks, {
                    customization: { ...taskCustomization, ...{ problemMatcher: resolvedMatchers } }
                });
            }
        }
        const taskInfo = await this.runTask(task, option);
        if (taskInfo) {
            const getExitCodePromise = this.getExitCode(taskInfo.taskId).then(result => ({ taskEndedType: TaskEndedTypes.TaskExited, value: result }));
            const isBackgroundTaskEndedPromise = this.isBackgroundTaskEnded(taskInfo.taskId).then(result => ({ taskEndedType: TaskEndedTypes.BackgroundTaskEnded, value: result }));
            // After start running the task, we wait for the task process to exit and if it is a background task, we also wait for a feedback
            // that a background task is active, as soon as one of the promises fulfills, we can continue and analyze the results.
            const taskEndedInfo = await Promise.race([getExitCodePromise, isBackgroundTaskEndedPromise]);
            if ((taskEndedInfo.taskEndedType === TaskEndedTypes.TaskExited && taskEndedInfo.value !== 0) ||
                (taskEndedInfo.taskEndedType === TaskEndedTypes.BackgroundTaskEnded && !taskEndedInfo.value)) {
                throw new Error('The task: ' + task.label + ' terminated with exit code ' + taskEndedInfo.value + '.');
            }
        }
        return taskInfo;
    }
    /**
     * Creates a graph of dependencies tasks from the root task and verify there is no DAG (Directed Acyclic Graph).
     * In case of detection of a circular dependency, an error is thrown with a message which describes the detected circular reference.
     */
    detectDirectedAcyclicGraph(task, taskNode, tasks) {
        if (task && task.dependsOn) {
            // In case the 'dependsOn' is an array
            if (Array.isArray(task.dependsOn) && task.dependsOn.length > 0) {
                for (let i = 0; i < task.dependsOn.length; i++) {
                    const childNode = this.createChildTaskNode(task, taskNode, task.dependsOn[i], tasks);
                    this.detectDirectedAcyclicGraph(childNode.taskConfiguration, childNode.node, tasks);
                }
            }
            else if (!Array.isArray(task.dependsOn)) {
                const childNode = this.createChildTaskNode(task, taskNode, task.dependsOn, tasks);
                this.detectDirectedAcyclicGraph(childNode.taskConfiguration, childNode.node, tasks);
            }
        }
    }
    // 'childTaskIdentifier' may be a string (a task label) or a JSON object which represents a TaskIdentifier (e.g. {"type":"npm", "script":"script1"})
    createChildTaskNode(task, taskNode, childTaskIdentifier, tasks) {
        const childTaskConfiguration = this.getDependentTask(childTaskIdentifier, tasks);
        // If current task and child task are identical or if
        // one of the child tasks is identical to one of the current task ancestors, then raise an error
        if (this.taskDefinitionRegistry.compareTasks(task, childTaskConfiguration) ||
            taskNode.parentsID.filter(t => this.taskDefinitionRegistry.compareTasks(childTaskConfiguration, t)).length > 0) {
            const fromNode = task.label;
            const toNode = childTaskConfiguration.label;
            throw new Error('Circular reference detected: ' + fromNode + ' -->  ' + toNode);
        }
        const childNode = new task_node_1.TaskNode(childTaskConfiguration, [], Object.assign([], taskNode.parentsID));
        childNode.addParentDependency(taskNode.taskId);
        taskNode.addChildDependency(childNode);
        return { 'taskConfiguration': childTaskConfiguration, 'node': childNode };
    }
    /**
     * Gets task configuration by task label or by a JSON object which represents a task identifier
     *
     * @param taskIdentifier The task label (string) or a JSON object which represents a TaskIdentifier (e.g. {"type":"npm", "script":"script1"})
     * @param tasks an array of the task configurations
     * @returns the correct TaskConfiguration object which matches the taskIdentifier
     */
    getDependentTask(taskIdentifier, tasks) {
        const notEnoughDataError = 'The information provided in the "dependsOn" is not enough for matching the correct task !';
        let currentTaskChildConfiguration;
        if (typeof (taskIdentifier) !== 'string') {
            // TaskIdentifier object does not support tasks of type 'shell' (The same behavior as in VS Code).
            // So if we want the 'dependsOn' property to include tasks of type 'shell',
            // then we must mention their labels (in the 'dependsOn' property) and not to create a task identifier object for them.
            currentTaskChildConfiguration = this.getTaskByTaskIdentifier(taskIdentifier, tasks);
            if (!currentTaskChildConfiguration.type) {
                this.messageService.error(notEnoughDataError);
                throw new Error(notEnoughDataError);
            }
            return currentTaskChildConfiguration;
        }
        else {
            currentTaskChildConfiguration = tasks.filter(t => taskIdentifier === this.taskNameResolver.resolve(t))[0];
            return currentTaskChildConfiguration;
        }
    }
    /**
     * Gets the matched task from an array of task configurations by TaskIdentifier.
     * In case that more than one task configuration matches, we returns the first one.
     *
     * @param taskIdentifier The task label (string) or a JSON object which represents a TaskIdentifier (e.g. {"type":"npm", "script":"script1"})
     * @param tasks An array of task configurations.
     * @returns The correct TaskConfiguration object which matches the taskIdentifier.
     */
    getTaskByTaskIdentifier(taskIdentifier, tasks) {
        const requiredProperties = Object.keys(taskIdentifier);
        const taskWithAllProperties = tasks.find(task => requiredProperties.every(property => task.hasOwnProperty(property) && task[property] === taskIdentifier[property]));
        return taskWithAllProperties !== null && taskWithAllProperties !== void 0 ? taskWithAllProperties : { label: '', _scope: '', type: '' }; // Fall back to empty TaskConfiguration
    }
    async runTask(task, option) {
        console.debug('entering runTask');
        const releaseLock = await this.taskStartingLock.acquire();
        console.debug('got lock');
        try {
            // resolve problemMatchers
            if (!option && task.problemMatcher) {
                const customizationObject = { type: task.taskType, problemMatcher: task.problemMatcher, runOptions: task.runOptions };
                const resolvedMatchers = await this.resolveProblemMatchers(task, customizationObject);
                option = {
                    customization: { ...customizationObject, ...{ problemMatcher: resolvedMatchers } }
                };
            }
            const runningTasksInfo = await this.getRunningTasks();
            // check if the task is active
            const matchedRunningTaskInfo = runningTasksInfo.find(taskInfo => {
                const taskConfig = taskInfo.config;
                return this.taskDefinitionRegistry.compareTasks(taskConfig, task);
            });
            console.debug(`running task ${JSON.stringify(task)}, already running = ${!!matchedRunningTaskInfo}`);
            if (matchedRunningTaskInfo) { // the task is active
                releaseLock();
                console.debug('released lock');
                const taskName = this.taskNameResolver.resolve(task);
                const terminalId = matchedRunningTaskInfo.terminalId;
                if (terminalId) {
                    const terminal = this.terminalService.getByTerminalId(terminalId);
                    if (terminal) {
                        if (common_2.TaskOutputPresentation.shouldSetFocusToTerminal(task)) { // assign focus to the terminal if presentation.focus is true
                            this.terminalService.open(terminal, { mode: 'activate' });
                        }
                        else if (common_2.TaskOutputPresentation.shouldAlwaysRevealTerminal(task)) { // show the terminal but not assign focus
                            this.terminalService.open(terminal, { mode: 'reveal' });
                        }
                    }
                }
                const selectedAction = await this.messageService.info(`The task '${taskName}' is already active`, 'Terminate Task', 'Restart Task');
                if (selectedAction === 'Terminate Task') {
                    await this.terminateTask(matchedRunningTaskInfo);
                }
                else if (selectedAction === 'Restart Task') {
                    return this.restartTask(matchedRunningTaskInfo, option);
                }
            }
            else { // run task as the task is not active
                console.debug('task about to start');
                const taskInfo = await this.doRunTask(task, option);
                releaseLock();
                console.debug('release lock 2');
                return taskInfo;
            }
        }
        catch (e) {
            releaseLock();
            throw e;
        }
    }
    /**
     * Terminates a task that is actively running.
     * @param activeTaskInfo the TaskInfo of the task that is actively running
     */
    async terminateTask(activeTaskInfo) {
        const taskId = activeTaskInfo.taskId;
        return this.kill(taskId);
    }
    /**
     * Terminates a task that is actively running, and restarts it.
     * @param activeTaskInfo the TaskInfo of the task that is actively running
     */
    async restartTask(activeTaskInfo, option) {
        await this.terminateTask(activeTaskInfo);
        return this.doRunTask(activeTaskInfo.config, option);
    }
    async doRunTask(task, option) {
        let overridePropertiesFunction = () => { };
        if (option && option.customization) {
            const taskDefinition = this.taskDefinitionRegistry.getDefinition(task);
            if (taskDefinition) { // use the customization object to override the task config
                overridePropertiesFunction = tsk => {
                    Object.keys(option.customization).forEach(customizedProperty => {
                        // properties used to define the task cannot be customized
                        if (customizedProperty !== 'type' && !taskDefinition.properties.all.some(pDefinition => pDefinition === customizedProperty)) {
                            tsk[customizedProperty] = option.customization[customizedProperty];
                        }
                    });
                };
            }
        }
        overridePropertiesFunction(task);
        this.addRecentTasks(task);
        try {
            const resolver = await this.taskResolverRegistry.getTaskResolver(task.type);
            const resolvedTask = resolver ? await resolver.resolveTask(task) : task;
            const executionResolver = this.taskResolverRegistry.getExecutionResolver(resolvedTask.taskType || resolvedTask.type);
            overridePropertiesFunction(resolvedTask);
            const taskToRun = executionResolver ? await executionResolver.resolveTask(resolvedTask) : resolvedTask;
            await this.removeProblemMarkers(option);
            return this.runResolvedTask(taskToRun, option);
        }
        catch (error) {
            const errMessage = `Error resolving task '${task.label}': ${error}`;
            this.logger.error(errMessage);
        }
        return undefined;
    }
    /**
     * Runs the first task with the given label.
     *
     * @param token  The cache token for the user interaction in progress
     * @param taskLabel The label of the task to be executed
     */
    async runTaskByLabel(token, taskLabel) {
        const tasks = await this.getTasks(token);
        for (const task of tasks) {
            if (task.label === taskLabel) {
                return this.runTask(task);
            }
        }
        return;
    }
    /**
     * Runs a task identified by the given identifier, but only if found in the given workspace folder
     *
     * @param token  The cache token for the user interaction in progress
     * @param workspaceFolderUri  The folder to restrict the search to
     * @param taskIdentifier The identifier to look for
     */
    async runWorkspaceTask(token, workspaceFolderUri, taskIdentifier) {
        const tasks = await this.getWorkspaceTasks(token, workspaceFolderUri);
        const task = this.getDependentTask(taskIdentifier, tasks);
        if (!task) {
            return undefined;
        }
        const taskCustomization = await this.getTaskCustomization(task);
        const resolvedMatchers = await this.resolveProblemMatchers(task, taskCustomization);
        try {
            const rootNode = new task_node_1.TaskNode(task, [], []);
            this.detectDirectedAcyclicGraph(task, rootNode, tasks);
        }
        catch (error) {
            this.logger.error(error.message);
            this.messageService.error(error.message);
            return undefined;
        }
        return this.runTasksGraph(task, tasks, {
            customization: { ...taskCustomization, ...{ problemMatcher: resolvedMatchers } }
        }).catch(error => {
            console.log(error.message);
            return undefined;
        });
    }
    /**
     * Updates the task configuration in the `tasks.json`.
     * The task config, together with updates, will be written into the `tasks.json` if it is not found in the file.
     *
     * @param token  The cache token for the user interaction in progress
     * @param task task that the updates will be applied to
     * @param update the updates to be applied
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async updateTaskConfiguration(token, task, update) {
        if (update.problemMatcher) {
            if (Array.isArray(update.problemMatcher)) {
                update.problemMatcher.forEach((_name, index) => update.problemMatcher[index] = (0, common_2.asVariableName)(update.problemMatcher[index]));
            }
            else {
                update.problemMatcher = (0, common_2.asVariableName)(update.problemMatcher);
            }
        }
        this.taskConfigurations.updateTaskConfig(token, task, update);
    }
    async getWorkspaceTasks(token, restrictToFolder) {
        const tasks = await this.getTasks(token);
        // if we pass undefined, return everything, otherwise only tasks with the same uri or workspace/global scope tasks
        return tasks.filter(t => typeof t._scope !== 'string' || t._scope === restrictToFolder);
    }
    async resolveProblemMatchers(task, customizationObject) {
        const notResolvedMatchers = customizationObject.problemMatcher ?
            (Array.isArray(customizationObject.problemMatcher) ? customizationObject.problemMatcher : [customizationObject.problemMatcher]) : undefined;
        let resolvedMatchers = [];
        if (notResolvedMatchers) {
            // resolve matchers before passing them to the server
            for (const matcher of notResolvedMatchers) {
                let resolvedMatcher;
                await this.problemMatcherRegistry.onReady();
                if (typeof matcher === 'string') {
                    resolvedMatcher = this.problemMatcherRegistry.get(matcher);
                }
                else {
                    resolvedMatcher = await this.problemMatcherRegistry.getProblemMatcherFromContribution(matcher);
                }
                if (resolvedMatcher) {
                    const scope = task._scope || task._source;
                    if (resolvedMatcher.filePrefix && scope) {
                        const options = {
                            context: new uri_1.default(scope).withScheme('file'),
                            configurationSection: 'tasks'
                        };
                        const resolvedPrefix = await this.variableResolverService.resolve(resolvedMatcher.filePrefix, options);
                        Object.assign(resolvedMatcher, { filePrefix: resolvedPrefix });
                    }
                    resolvedMatchers.push(resolvedMatcher);
                }
            }
        }
        else {
            resolvedMatchers = undefined;
        }
        return resolvedMatchers;
    }
    async getTaskCustomization(task) {
        const customizationObject = { type: '', _scope: task._scope, runOptions: task.runOptions };
        const customizationFound = this.taskConfigurations.getCustomizationForTask(task);
        if (customizationFound) {
            Object.assign(customizationObject, customizationFound);
        }
        else {
            Object.assign(customizationObject, {
                type: task.type,
                problemMatcher: task.problemMatcher
            });
        }
        return customizationObject;
    }
    async removeProblemMarkers(option) {
        if (option && option.customization) {
            const matchersFromOption = option.customization.problemMatcher || [];
            for (const matcher of matchersFromOption) {
                if (matcher && matcher.owner) {
                    const existingMarkers = this.problemManager.findMarkers({ owner: matcher.owner });
                    const uris = new Set();
                    existingMarkers.forEach(marker => uris.add(marker.uri));
                    uris.forEach(uriString => this.problemManager.setMarkers(new uri_1.default(uriString), matcher.owner, []));
                }
            }
        }
    }
    /**
     * Runs the resolved task and opens terminal widget if the task is based on a terminal process
     * @param resolvedTask the resolved task
     * @param option options to run the resolved task
     */
    async runResolvedTask(resolvedTask, option) {
        const taskLabel = resolvedTask.label;
        let taskInfo;
        try {
            taskInfo = await this.taskServer.run(resolvedTask, this.getContext(), option);
            this.lastTask = { resolvedTask, option };
            this.logger.debug(`Task created. Task id: ${taskInfo.taskId}`);
            /**
             * open terminal widget if the task is based on a terminal process (type: 'shell' or 'process')
             *
             * @todo Use a different mechanism to determine if the task should be attached?
             *       Reason: Maybe a new task type wants to also be displayed in a terminal.
             */
            if (typeof taskInfo.terminalId === 'number') {
                await this.attach(taskInfo.terminalId, taskInfo);
            }
            return taskInfo;
        }
        catch (error) {
            const errorStr = `Error launching task '${taskLabel}': ${error.message}`;
            this.logger.error(errorStr);
            this.messageService.error(errorStr);
            if (taskInfo && typeof taskInfo.terminalId === 'number') {
                this.shellTerminalServer.onAttachAttempted(taskInfo.terminalId);
            }
        }
    }
    getCustomizeProblemMatcherItems() {
        const items = [];
        items.push({
            label: 'Continue without scanning the task output',
            value: { problemMatchers: undefined }
        });
        items.push({
            label: 'Never scan the task output',
            value: { problemMatchers: [] }
        });
        items.push({
            label: 'Learn more about scanning the task output',
            value: { problemMatchers: undefined, learnMore: true }
        });
        items.push({ type: 'separator', label: 'registered parsers' });
        const registeredProblemMatchers = this.problemMatcherRegistry.getAll();
        items.push(...registeredProblemMatchers.map(matcher => ({
            label: matcher.label,
            value: { problemMatchers: [matcher] },
            description: (0, common_2.asVariableName)(matcher.name)
        })));
        return items;
    }
    /**
     * Run selected text in the last active terminal.
     */
    async runSelectedText() {
        if (!this.editorManager.currentEditor) {
            return;
        }
        const startLine = this.editorManager.currentEditor.editor.selection.start.line;
        const startCharacter = this.editorManager.currentEditor.editor.selection.start.character;
        const endLine = this.editorManager.currentEditor.editor.selection.end.line;
        const endCharacter = this.editorManager.currentEditor.editor.selection.end.character;
        let selectedRange = vscode_languageserver_protocol_1.Range.create(startLine, startCharacter, endLine, endCharacter);
        // if no text is selected, default to selecting entire line
        if (startLine === endLine && startCharacter === endCharacter) {
            selectedRange = vscode_languageserver_protocol_1.Range.create(startLine, 0, endLine + 1, 0);
        }
        const selectedText = this.editorManager.currentEditor.editor.document.getText(selectedRange).trimRight() + '\n';
        let terminal = this.terminalService.lastUsedTerminal;
        if (!terminal || terminal.kind !== 'user' || (await terminal.hasChildProcesses())) {
            terminal = await this.terminalService.newTerminal({ created: new Date().toString() });
            await terminal.start();
            this.terminalService.open(terminal);
        }
        terminal.sendText(selectedText);
    }
    async attach(terminalId, taskInfo) {
        let widgetOpenMode = 'open';
        if (taskInfo) {
            const terminalWidget = this.terminalService.getByTerminalId(terminalId);
            if (terminalWidget) {
                this.messageService.error('Task is already running in terminal');
                return this.terminalService.open(terminalWidget, { mode: 'activate' });
            }
            if (common_2.TaskOutputPresentation.shouldAlwaysRevealTerminal(taskInfo.config)) {
                if (common_2.TaskOutputPresentation.shouldSetFocusToTerminal(taskInfo.config)) { // assign focus to the terminal if presentation.focus is true
                    widgetOpenMode = 'activate';
                }
                else { // show the terminal but not assign focus
                    widgetOpenMode = 'reveal';
                }
            }
        }
        const { taskId } = taskInfo;
        // Create / find a terminal widget to display an execution output of a task that was launched as a command inside a shell.
        const widget = await this.taskTerminalWidgetManager.open({
            created: new Date().toString(),
            id: this.getTerminalWidgetId(terminalId),
            title: taskInfo
                ? `Task: ${taskInfo.config.label}`
                : `Task: #${taskId}`,
            destroyTermOnClose: true
        }, {
            widgetOptions: { area: 'bottom' },
            mode: widgetOpenMode,
            taskInfo
        });
        return widget.start(terminalId);
    }
    getTerminalWidgetId(terminalId) {
        const terminalWidget = this.terminalService.getByTerminalId(terminalId);
        if (terminalWidget) {
            return terminalWidget.id;
        }
    }
    /**
     * Opens an editor to configure the given task.
     *
     * @param token  The cache token for the user interaction in progress
     * @param task The task to configure
     */
    async configure(token, task) {
        Object.assign(task, { label: this.taskNameResolver.resolve(task) });
        await this.taskConfigurations.configure(token, task);
    }
    isEventForThisClient(context) {
        if (context === this.getContext()) {
            return true;
        }
        return false;
    }
    taskConfigurationChanged(event) {
        // do nothing for now
    }
    getContext() {
        var _a;
        return (_a = this.workspaceService.workspace) === null || _a === void 0 ? void 0 : _a.resource.toString();
    }
    /** Kill task for a given id if task is found */
    async kill(id) {
        try {
            await this.taskServer.kill(id);
        }
        catch (error) {
            this.logger.error(`Error killing task '${id}': ${error}`);
            this.messageService.error(`Error killing task '${id}': ${error}`);
            return;
        }
        this.logger.debug(`Task killed. Task id: ${id}`);
    }
    async isBackgroundTaskEnded(id) {
        const completedTask = this.runningTasks.get(id);
        return completedTask && completedTask.isBackgroundTaskEnded.promise;
    }
    async getExitCode(id) {
        const completedTask = this.runningTasks.get(id);
        return completedTask && completedTask.exitCode.promise;
    }
    async getTerminateSignal(id) {
        const completedTask = this.runningTasks.get(id);
        return completedTask && completedTask.terminateSignal.promise;
    }
};
__decorate([
    (0, inversify_1.inject)(browser_1.FrontendApplication),
    __metadata("design:type", browser_1.FrontendApplication)
], TaskService.prototype, "app", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.ApplicationShell),
    __metadata("design:type", browser_1.ApplicationShell)
], TaskService.prototype, "shell", void 0);
__decorate([
    (0, inversify_1.inject)(common_2.TaskServer),
    __metadata("design:type", Object)
], TaskService.prototype, "taskServer", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.ILogger),
    (0, inversify_1.named)('task'),
    __metadata("design:type", Object)
], TaskService.prototype, "logger", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.WidgetManager),
    __metadata("design:type", browser_1.WidgetManager)
], TaskService.prototype, "widgetManager", void 0);
__decorate([
    (0, inversify_1.inject)(task_watcher_1.TaskWatcher),
    __metadata("design:type", task_watcher_1.TaskWatcher)
], TaskService.prototype, "taskWatcher", void 0);
__decorate([
    (0, inversify_1.inject)(message_service_1.MessageService),
    __metadata("design:type", message_service_1.MessageService)
], TaskService.prototype, "messageService", void 0);
__decorate([
    (0, inversify_1.inject)(workspace_service_1.WorkspaceService),
    __metadata("design:type", workspace_service_1.WorkspaceService)
], TaskService.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(task_configurations_1.TaskConfigurations),
    __metadata("design:type", task_configurations_1.TaskConfigurations)
], TaskService.prototype, "taskConfigurations", void 0);
__decorate([
    (0, inversify_1.inject)(provided_task_configurations_1.ProvidedTaskConfigurations),
    __metadata("design:type", provided_task_configurations_1.ProvidedTaskConfigurations)
], TaskService.prototype, "providedTaskConfigurations", void 0);
__decorate([
    (0, inversify_1.inject)(browser_3.VariableResolverService),
    __metadata("design:type", browser_3.VariableResolverService)
], TaskService.prototype, "variableResolverService", void 0);
__decorate([
    (0, inversify_1.inject)(task_contribution_1.TaskResolverRegistry),
    __metadata("design:type", task_contribution_1.TaskResolverRegistry)
], TaskService.prototype, "taskResolverRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(terminal_service_1.TerminalService),
    __metadata("design:type", Object)
], TaskService.prototype, "terminalService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.EditorManager),
    __metadata("design:type", browser_2.EditorManager)
], TaskService.prototype, "editorManager", void 0);
__decorate([
    (0, inversify_1.inject)(problem_manager_1.ProblemManager),
    __metadata("design:type", problem_manager_1.ProblemManager)
], TaskService.prototype, "problemManager", void 0);
__decorate([
    (0, inversify_1.inject)(task_definition_registry_1.TaskDefinitionRegistry),
    __metadata("design:type", task_definition_registry_1.TaskDefinitionRegistry)
], TaskService.prototype, "taskDefinitionRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(task_problem_matcher_registry_1.ProblemMatcherRegistry),
    __metadata("design:type", task_problem_matcher_registry_1.ProblemMatcherRegistry)
], TaskService.prototype, "problemMatcherRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(quick_pick_service_1.QuickPickService),
    __metadata("design:type", Object)
], TaskService.prototype, "quickPickService", void 0);
__decorate([
    (0, inversify_1.inject)(opener_service_1.OpenerService),
    __metadata("design:type", Object)
], TaskService.prototype, "openerService", void 0);
__decorate([
    (0, inversify_1.inject)(shell_terminal_protocol_1.ShellTerminalServerProxy),
    __metadata("design:type", Object)
], TaskService.prototype, "shellTerminalServer", void 0);
__decorate([
    (0, inversify_1.inject)(task_name_resolver_1.TaskNameResolver),
    __metadata("design:type", task_name_resolver_1.TaskNameResolver)
], TaskService.prototype, "taskNameResolver", void 0);
__decorate([
    (0, inversify_1.inject)(task_source_resolver_1.TaskSourceResolver),
    __metadata("design:type", task_source_resolver_1.TaskSourceResolver)
], TaskService.prototype, "taskSourceResolver", void 0);
__decorate([
    (0, inversify_1.inject)(task_schema_updater_1.TaskSchemaUpdater),
    __metadata("design:type", task_schema_updater_1.TaskSchemaUpdater)
], TaskService.prototype, "taskSchemaUpdater", void 0);
__decorate([
    (0, inversify_1.inject)(task_configuration_manager_1.TaskConfigurationManager),
    __metadata("design:type", task_configuration_manager_1.TaskConfigurationManager)
], TaskService.prototype, "taskConfigurationManager", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.CommandService),
    __metadata("design:type", Object)
], TaskService.prototype, "commands", void 0);
__decorate([
    (0, inversify_1.inject)(label_provider_1.LabelProvider),
    __metadata("design:type", label_provider_1.LabelProvider)
], TaskService.prototype, "labelProvider", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_workspace_1.MonacoWorkspace),
    __metadata("design:type", monaco_workspace_1.MonacoWorkspace)
], TaskService.prototype, "monacoWorkspace", void 0);
__decorate([
    (0, inversify_1.inject)(task_terminal_widget_manager_1.TaskTerminalWidgetManager),
    __metadata("design:type", task_terminal_widget_manager_1.TaskTerminalWidgetManager)
], TaskService.prototype, "taskTerminalWidgetManager", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TaskService.prototype, "init", null);
TaskService = __decorate([
    (0, inversify_1.injectable)()
], TaskService);
exports.TaskService = TaskService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/task/lib/browser/task-service'] = this;


/***/ }),

/***/ "../../packages/task/lib/browser/task-source-resolver.js":
/*!***************************************************************!*\
  !*** ../../packages/task/lib/browser/task-source-resolver.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2019 Ericsson and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TaskSourceResolver = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const common_1 = __webpack_require__(/*! ../common */ "../../packages/task/lib/common/index.js");
const task_definition_registry_1 = __webpack_require__(/*! ./task-definition-registry */ "../../packages/task/lib/browser/task-definition-registry.js");
let TaskSourceResolver = class TaskSourceResolver {
    /**
     * Returns task source to display.
     */
    resolve(task) {
        if (typeof task._scope === 'string') {
            return task._scope;
        }
        else {
            return common_1.TaskScope[task._scope];
        }
    }
};
__decorate([
    (0, inversify_1.inject)(task_definition_registry_1.TaskDefinitionRegistry),
    __metadata("design:type", task_definition_registry_1.TaskDefinitionRegistry)
], TaskSourceResolver.prototype, "taskDefinitionRegistry", void 0);
TaskSourceResolver = __decorate([
    (0, inversify_1.injectable)()
], TaskSourceResolver);
exports.TaskSourceResolver = TaskSourceResolver;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/task/lib/browser/task-source-resolver'] = this;


/***/ }),

/***/ "../../packages/task/lib/browser/task-templates.js":
/*!*********************************************************!*\
  !*** ../../packages/task/lib/browser/task-templates.js ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2019 Ericsson and others.
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
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TaskTemplateSelector = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const dotnetBuild = {
    id: 'dotnetCore',
    label: '.NET Core',
    sort: 'NET Core',
    autoDetect: false,
    description: 'Executes .NET Core build command',
    content: [
        '{',
        '\t// See https://go.microsoft.com/fwlink/?LinkId=733558',
        '\t// for the documentation about the tasks.json format',
        '\t"version": "2.0.0",',
        '\t"tasks": [',
        '\t\t{',
        '\t\t\t"label": "build",',
        '\t\t\t"command": "dotnet",',
        '\t\t\t"type": "shell",',
        '\t\t\t"args": [',
        '\t\t\t\t"build",',
        '\t\t\t\t// Ask dotnet build to generate full paths for file names.',
        '\t\t\t\t"/property:GenerateFullPaths=true",',
        '\t\t\t\t// Do not generate summary otherwise it leads to duplicate errors in Problems panel',
        '\t\t\t\t"/consoleloggerparameters:NoSummary"',
        '\t\t\t],',
        '\t\t\t"group": "build",',
        '\t\t\t"presentation": {',
        '\t\t\t\t"reveal": "silent"',
        '\t\t\t},',
        '\t\t\t"problemMatcher": "$msCompile"',
        '\t\t}',
        '\t]',
        '}'
    ].join('\n')
};
const msbuild = {
    id: 'msbuild',
    label: 'MSBuild',
    autoDetect: false,
    description: 'Executes the build target',
    content: [
        '{',
        '\t// See https://go.microsoft.com/fwlink/?LinkId=733558',
        '\t// for the documentation about the tasks.json format',
        '\t"version": "2.0.0",',
        '\t"tasks": [',
        '\t\t{',
        '\t\t\t"label": "build",',
        '\t\t\t"type": "shell",',
        '\t\t\t"command": "msbuild",',
        '\t\t\t"args": [',
        '\t\t\t\t// Ask msbuild to generate full paths for file names.',
        '\t\t\t\t"/property:GenerateFullPaths=true",',
        '\t\t\t\t"/t:build",',
        '\t\t\t\t// Do not generate summary otherwise it leads to duplicate errors in Problems panel',
        '\t\t\t\t"/consoleloggerparameters:NoSummary"',
        '\t\t\t],',
        '\t\t\t"group": "build",',
        '\t\t\t"presentation": {',
        '\t\t\t\t// Reveal the output only if unrecognized errors occur.',
        '\t\t\t\t"reveal": "silent"',
        '\t\t\t},',
        '\t\t\t// Use the standard MS compiler pattern to detect errors, warnings and infos',
        '\t\t\t"problemMatcher": "$msCompile"',
        '\t\t}',
        '\t]',
        '}'
    ].join('\n')
};
const maven = {
    id: 'maven',
    label: 'maven',
    sort: 'MVN',
    autoDetect: false,
    description: 'Executes common maven commands',
    content: [
        '{',
        '\t// See https://go.microsoft.com/fwlink/?LinkId=733558',
        '\t// for the documentation about the tasks.json format',
        '\t"version": "2.0.0",',
        '\t"tasks": [',
        '\t\t{',
        '\t\t\t"label": "verify",',
        '\t\t\t"type": "shell",',
        '\t\t\t"command": "mvn -B verify",',
        '\t\t\t"group": "build"',
        '\t\t},',
        '\t\t{',
        '\t\t\t"label": "test",',
        '\t\t\t"type": "shell",',
        '\t\t\t"command": "mvn -B test",',
        '\t\t\t"group": "test"',
        '\t\t}',
        '\t]',
        '}'
    ].join('\n')
};
const command = {
    id: 'externalCommand',
    label: 'Others',
    autoDetect: false,
    description: 'Example to run an arbitrary external command',
    content: [
        '{',
        '\t// See https://go.microsoft.com/fwlink/?LinkId=733558',
        '\t// for the documentation about the tasks.json format',
        '\t"version": "2.0.0",',
        '\t"tasks": [',
        '\t\t{',
        '\t\t\t"label": "echo",',
        '\t\t\t"type": "shell",',
        '\t\t\t"command": "echo Hello"',
        '\t\t}',
        '\t]',
        '}'
    ].join('\n')
};
let TaskTemplateSelector = class TaskTemplateSelector {
    selectTemplates() {
        const templates = [
            dotnetBuild, msbuild, maven
        ].sort((a, b) => (a.sort || a.label).localeCompare(b.sort || b.label));
        templates.push(command);
        return templates.map(t => ({
            label: t.label,
            description: t.description,
            value: t
        }));
    }
};
TaskTemplateSelector = __decorate([
    (0, inversify_1.injectable)()
], TaskTemplateSelector);
exports.TaskTemplateSelector = TaskTemplateSelector;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/task/lib/browser/task-templates'] = this;


/***/ }),

/***/ "../../packages/task/lib/browser/task-terminal-widget-manager.js":
/*!***********************************************************************!*\
  !*** ../../packages/task/lib/browser/task-terminal-widget-manager.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2020 Ericsson and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TaskTerminalWidgetManager = exports.TaskTerminalWidgetOpenerOptions = exports.TaskTerminalWidget = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const terminal_service_1 = __webpack_require__(/*! @theia/terminal/lib/browser/base/terminal-service */ "../../packages/terminal/lib/browser/base/terminal-service.js");
const common_1 = __webpack_require__(/*! ../common */ "../../packages/task/lib/common/index.js");
const task_protocol_1 = __webpack_require__(/*! ../common/process/task-protocol */ "../../packages/task/lib/common/process/task-protocol.js");
const task_definition_registry_1 = __webpack_require__(/*! ./task-definition-registry */ "../../packages/task/lib/browser/task-definition-registry.js");
const workspace_service_1 = __webpack_require__(/*! @theia/workspace/lib/browser/workspace-service */ "../../packages/workspace/lib/browser/workspace-service.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
var TaskTerminalWidget;
(function (TaskTerminalWidget) {
    function is(widget) {
        return widget.kind === 'task';
    }
    TaskTerminalWidget.is = is;
})(TaskTerminalWidget = exports.TaskTerminalWidget || (exports.TaskTerminalWidget = {}));
var TaskTerminalWidgetOpenerOptions;
(function (TaskTerminalWidgetOpenerOptions) {
    function isDedicatedTerminal(options) {
        const taskConfig = options.taskInfo ? options.taskInfo.config : options.taskConfig;
        return !!taskConfig && !!taskConfig.presentation && taskConfig.presentation.panel === common_1.PanelKind.Dedicated;
    }
    TaskTerminalWidgetOpenerOptions.isDedicatedTerminal = isDedicatedTerminal;
    function isNewTerminal(options) {
        const taskConfig = options.taskInfo ? options.taskInfo.config : options.taskConfig;
        return !!taskConfig && !!taskConfig.presentation && taskConfig.presentation.panel === common_1.PanelKind.New;
    }
    TaskTerminalWidgetOpenerOptions.isNewTerminal = isNewTerminal;
    function isSharedTerminal(options) {
        const taskConfig = options.taskInfo ? options.taskInfo.config : options.taskConfig;
        return !!taskConfig && (taskConfig.presentation === undefined || taskConfig.presentation.panel === undefined || taskConfig.presentation.panel === common_1.PanelKind.Shared);
    }
    TaskTerminalWidgetOpenerOptions.isSharedTerminal = isSharedTerminal;
    function echoExecutedCommand(options) {
        const taskConfig = options.taskInfo ? options.taskInfo.config : options.taskConfig;
        return !!taskConfig && (taskConfig.presentation === undefined || taskConfig.presentation.echo === undefined || taskConfig.presentation.echo);
    }
    TaskTerminalWidgetOpenerOptions.echoExecutedCommand = echoExecutedCommand;
})(TaskTerminalWidgetOpenerOptions = exports.TaskTerminalWidgetOpenerOptions || (exports.TaskTerminalWidgetOpenerOptions = {}));
let TaskTerminalWidgetManager = class TaskTerminalWidgetManager {
    init() {
        this.taskWatcher.onTaskExit((event) => {
            const finishedTaskId = event.taskId;
            // find the terminal where the task ran, and mark it as "idle"
            for (const terminal of this.getTaskTerminalWidgets()) {
                if (terminal.taskId === finishedTaskId) {
                    const showReuseMessage = !!event.config && common_1.TaskOutputPresentation.shouldShowReuseMessage(event.config);
                    const closeOnFinish = !!event.config && common_1.TaskOutputPresentation.shouldCloseTerminalOnFinish(event.config);
                    this.updateTerminalOnTaskExit(terminal, showReuseMessage, closeOnFinish);
                    break;
                }
            }
        });
        this.terminalService.onDidCreateTerminal(async (widget) => {
            const terminal = TaskTerminalWidget.is(widget) && widget;
            if (terminal) {
                const didConnectListener = terminal.onDidOpen(async () => {
                    var _a, _b;
                    const context = (_b = (_a = this.workspaceService) === null || _a === void 0 ? void 0 : _a.workspace) === null || _b === void 0 ? void 0 : _b.resource.toString();
                    const tasksInfo = await this.taskServer.getTasks(context);
                    const taskInfo = tasksInfo.find(info => info.terminalId === widget.terminalId);
                    if (taskInfo) {
                        const taskConfig = taskInfo.config;
                        terminal.dedicated = !!taskConfig.presentation && !!taskConfig.presentation.panel && taskConfig.presentation.panel === common_1.PanelKind.Dedicated;
                        terminal.taskId = taskInfo.taskId;
                        terminal.taskConfig = taskConfig;
                        terminal.busy = true;
                    }
                    else {
                        this.updateTerminalOnTaskExit(terminal, true, false);
                    }
                });
                const didConnectFailureListener = terminal.onDidOpenFailure(async () => {
                    this.updateTerminalOnTaskExit(terminal, true, false);
                });
                terminal.onDidDispose(() => {
                    didConnectListener.dispose();
                    didConnectFailureListener.dispose();
                });
            }
        });
    }
    async newTaskTerminal(factoryOptions) {
        return this.terminalService.newTerminal({ ...factoryOptions, kind: 'task' });
    }
    async open(factoryOptions, openerOptions) {
        const taskInfo = openerOptions.taskInfo;
        const taskConfig = taskInfo ? taskInfo.config : openerOptions.taskConfig;
        const dedicated = TaskTerminalWidgetOpenerOptions.isDedicatedTerminal(openerOptions);
        if (dedicated && !taskConfig) {
            throw new Error('"taskConfig" must be included as part of the "option.taskInfo" if "isDedicated" is true');
        }
        const { isNew, widget } = await this.getWidgetToRunTask(factoryOptions, openerOptions);
        if (isNew) {
            this.shell.addWidget(widget, { area: openerOptions.widgetOptions ? openerOptions.widgetOptions.area : 'bottom' });
            widget.resetTerminal();
        }
        else {
            if (factoryOptions.title) {
                widget.setTitle(factoryOptions.title);
            }
            if (taskConfig && common_1.TaskOutputPresentation.shouldClearTerminalBeforeRun(taskConfig)) {
                widget.clearOutput();
            }
        }
        this.terminalService.open(widget, openerOptions);
        if (TaskTerminalWidgetOpenerOptions.echoExecutedCommand(openerOptions) &&
            taskInfo && task_protocol_1.ProcessTaskInfo.is(taskInfo) && taskInfo.command && taskInfo.command.length > 0) {
            widget.writeLine(`\x1b[1m> Executing task: ${taskInfo.command} <\x1b[0m\n`);
        }
        return widget;
    }
    async getWidgetToRunTask(factoryOptions, openerOptions) {
        var _a;
        let reusableTerminalWidget;
        const taskConfig = openerOptions.taskInfo ? openerOptions.taskInfo.config : openerOptions.taskConfig;
        if (TaskTerminalWidgetOpenerOptions.isDedicatedTerminal(openerOptions)) {
            for (const widget of this.getTaskTerminalWidgets()) {
                // to run a task whose `taskPresentation === 'dedicated'`, the terminal to be reused must be
                // 1) dedicated, 2) idle, 3) the one that ran the same task
                if (widget.dedicated &&
                    !widget.busy &&
                    widget.taskConfig && taskConfig &&
                    this.taskDefinitionRegistry.compareTasks(taskConfig, widget.taskConfig)) {
                    reusableTerminalWidget = widget;
                    break;
                }
            }
        }
        else if (TaskTerminalWidgetOpenerOptions.isSharedTerminal(openerOptions)) {
            const availableWidgets = [];
            for (const widget of this.getTaskTerminalWidgets()) {
                // to run a task whose `taskPresentation === 'shared'`, the terminal to be used must be
                // 1) not dedicated, and 2) idle
                if (!widget.dedicated && !widget.busy) {
                    availableWidgets.push(widget);
                }
            }
            const lastUsedWidget = availableWidgets.find(w => {
                const lastUsedTerminal = this.terminalService.lastUsedTerminal;
                return lastUsedTerminal && lastUsedTerminal.id === w.id;
            });
            reusableTerminalWidget = lastUsedWidget || availableWidgets[0];
        }
        // we are unable to find a terminal widget to run the task, or `taskPresentation === 'new'`
        const lastCwd = ((_a = taskConfig === null || taskConfig === void 0 ? void 0 : taskConfig.options) === null || _a === void 0 ? void 0 : _a.cwd) ? new uri_1.default(taskConfig.options.cwd) : new uri_1.default();
        if (!reusableTerminalWidget) {
            const widget = await this.newTaskTerminal(factoryOptions);
            widget.lastCwd = lastCwd;
            return { isNew: true, widget };
        }
        reusableTerminalWidget.lastCwd = lastCwd;
        return { isNew: false, widget: reusableTerminalWidget };
    }
    getTaskTerminalWidgets() {
        return this.terminalService.all.filter(TaskTerminalWidget.is);
    }
    updateTerminalOnTaskExit(terminal, showReuseMessage, closeOnFinish) {
        terminal.busy = false;
        if (closeOnFinish) {
            terminal.close();
        }
        else if (showReuseMessage) {
            terminal.scrollToBottom();
            terminal.writeLine('\x1b[1m\n\rTerminal will be reused by tasks. \x1b[0m\n');
        }
    }
};
__decorate([
    (0, inversify_1.inject)(browser_1.ApplicationShell),
    __metadata("design:type", browser_1.ApplicationShell)
], TaskTerminalWidgetManager.prototype, "shell", void 0);
__decorate([
    (0, inversify_1.inject)(task_definition_registry_1.TaskDefinitionRegistry),
    __metadata("design:type", task_definition_registry_1.TaskDefinitionRegistry)
], TaskTerminalWidgetManager.prototype, "taskDefinitionRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(terminal_service_1.TerminalService),
    __metadata("design:type", Object)
], TaskTerminalWidgetManager.prototype, "terminalService", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.TaskWatcher),
    __metadata("design:type", common_1.TaskWatcher)
], TaskTerminalWidgetManager.prototype, "taskWatcher", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.TaskServer),
    __metadata("design:type", Object)
], TaskTerminalWidgetManager.prototype, "taskServer", void 0);
__decorate([
    (0, inversify_1.inject)(workspace_service_1.WorkspaceService),
    __metadata("design:type", workspace_service_1.WorkspaceService)
], TaskTerminalWidgetManager.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TaskTerminalWidgetManager.prototype, "init", null);
TaskTerminalWidgetManager = __decorate([
    (0, inversify_1.injectable)()
], TaskTerminalWidgetManager);
exports.TaskTerminalWidgetManager = TaskTerminalWidgetManager;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/task/lib/browser/task-terminal-widget-manager'] = this;


/***/ }),

/***/ "../../packages/task/lib/common/index.js":
/*!***********************************************!*\
  !*** ../../packages/task/lib/common/index.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./task-protocol */ "../../packages/task/lib/common/task-protocol.js"), exports);
__exportStar(__webpack_require__(/*! ./task-watcher */ "../../packages/task/lib/common/task-watcher.js"), exports);
__exportStar(__webpack_require__(/*! ./problem-matcher-protocol */ "../../packages/task/lib/common/problem-matcher-protocol.js"), exports);
__exportStar(__webpack_require__(/*! ./task-util */ "../../packages/task/lib/common/task-util.js"), exports);

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/task/lib/common'] = this;


/***/ }),

/***/ "../../packages/task/lib/common/problem-matcher-protocol.js":
/*!******************************************************************!*\
  !*** ../../packages/task/lib/common/problem-matcher-protocol.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

// *****************************************************************************
// Copyright (C) 2019 Ericsson and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProblemMatchData = exports.ProblemPattern = exports.ProblemMatcher = exports.ProblemLocationKind = exports.WatchingMatcher = exports.FileLocationKind = exports.ApplyToKind = void 0;
var ApplyToKind;
(function (ApplyToKind) {
    ApplyToKind[ApplyToKind["allDocuments"] = 0] = "allDocuments";
    ApplyToKind[ApplyToKind["openDocuments"] = 1] = "openDocuments";
    ApplyToKind[ApplyToKind["closedDocuments"] = 2] = "closedDocuments";
})(ApplyToKind = exports.ApplyToKind || (exports.ApplyToKind = {}));
(function (ApplyToKind) {
    function fromString(value) {
        if (value) {
            value = value.toLowerCase();
            if (value === 'alldocuments') {
                return ApplyToKind.allDocuments;
            }
            else if (value === 'opendocuments') {
                return ApplyToKind.openDocuments;
            }
            else if (value === 'closeddocuments') {
                return ApplyToKind.closedDocuments;
            }
        }
        return undefined;
    }
    ApplyToKind.fromString = fromString;
})(ApplyToKind = exports.ApplyToKind || (exports.ApplyToKind = {}));
var FileLocationKind;
(function (FileLocationKind) {
    FileLocationKind[FileLocationKind["Auto"] = 0] = "Auto";
    FileLocationKind[FileLocationKind["Relative"] = 1] = "Relative";
    FileLocationKind[FileLocationKind["Absolute"] = 2] = "Absolute";
})(FileLocationKind = exports.FileLocationKind || (exports.FileLocationKind = {}));
(function (FileLocationKind) {
    function fromString(value) {
        value = value.toLowerCase();
        if (value === 'absolute') {
            return FileLocationKind.Absolute;
        }
        else if (value === 'relative') {
            return FileLocationKind.Relative;
        }
        else {
            return undefined;
        }
    }
    FileLocationKind.fromString = fromString;
})(FileLocationKind = exports.FileLocationKind || (exports.FileLocationKind = {}));
var WatchingMatcher;
(function (WatchingMatcher) {
    function fromWatchingMatcherContribution(value) {
        if (!value) {
            return undefined;
        }
        return {
            activeOnStart: !!value.activeOnStart,
            beginsPattern: typeof value.beginsPattern === 'string' ? { regexp: value.beginsPattern } : value.beginsPattern,
            endsPattern: typeof value.endsPattern === 'string' ? { regexp: value.endsPattern } : value.endsPattern
        };
    }
    WatchingMatcher.fromWatchingMatcherContribution = fromWatchingMatcherContribution;
})(WatchingMatcher = exports.WatchingMatcher || (exports.WatchingMatcher = {}));
var ProblemLocationKind;
(function (ProblemLocationKind) {
    ProblemLocationKind[ProblemLocationKind["File"] = 0] = "File";
    ProblemLocationKind[ProblemLocationKind["Location"] = 1] = "Location";
})(ProblemLocationKind = exports.ProblemLocationKind || (exports.ProblemLocationKind = {}));
(function (ProblemLocationKind) {
    function fromString(value) {
        value = value.toLowerCase();
        if (value === 'file') {
            return ProblemLocationKind.File;
        }
        else if (value === 'location') {
            return ProblemLocationKind.Location;
        }
        else {
            return undefined;
        }
    }
    ProblemLocationKind.fromString = fromString;
})(ProblemLocationKind = exports.ProblemLocationKind || (exports.ProblemLocationKind = {}));
var ProblemMatcher;
(function (ProblemMatcher) {
    function isWatchModeWatcher(matcher) {
        return !!matcher.watching;
    }
    ProblemMatcher.isWatchModeWatcher = isWatchModeWatcher;
})(ProblemMatcher = exports.ProblemMatcher || (exports.ProblemMatcher = {}));
var ProblemPattern;
(function (ProblemPattern) {
    function fromProblemPatternContribution(value) {
        return {
            name: value.name,
            regexp: value.regexp,
            kind: value.kind ? ProblemLocationKind.fromString(value.kind) : undefined,
            file: value.file,
            message: value.message,
            location: value.location,
            line: value.line,
            character: value.column || value.character,
            endLine: value.endLine,
            endCharacter: value.endColumn || value.endCharacter,
            code: value.code,
            severity: value.severity,
            loop: value.loop
        };
    }
    ProblemPattern.fromProblemPatternContribution = fromProblemPatternContribution;
})(ProblemPattern = exports.ProblemPattern || (exports.ProblemPattern = {}));
var ProblemMatchData;
(function (ProblemMatchData) {
    function is(data) {
        return 'marker' in data;
    }
    ProblemMatchData.is = is;
})(ProblemMatchData = exports.ProblemMatchData || (exports.ProblemMatchData = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/task/lib/common/problem-matcher-protocol'] = this;


/***/ }),

/***/ "../../packages/task/lib/common/process/task-protocol.js":
/*!***************************************************************!*\
  !*** ../../packages/task/lib/common/process/task-protocol.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProcessTaskError = exports.ProcessTaskInfo = void 0;
const application_error_1 = __webpack_require__(/*! @theia/core/lib/common/application-error */ "../../packages/core/lib/common/application-error.js");
var ProcessTaskInfo;
(function (ProcessTaskInfo) {
    function is(info) {
        return info['processId'] !== undefined;
    }
    ProcessTaskInfo.is = is;
})(ProcessTaskInfo = exports.ProcessTaskInfo || (exports.ProcessTaskInfo = {}));
var ProcessTaskError;
(function (ProcessTaskError) {
    ProcessTaskError.CouldNotRun = application_error_1.ApplicationError.declare(1, (code) => ({
        message: `Error starting process (${code})`,
        data: { code }
    }));
})(ProcessTaskError = exports.ProcessTaskError || (exports.ProcessTaskError = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/task/lib/common/process/task-protocol'] = this;


/***/ }),

/***/ "../../packages/task/lib/common/task-protocol.js":
/*!*******************************************************!*\
  !*** ../../packages/task/lib/common/task-protocol.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TaskScope = exports.TaskCustomization = exports.TaskOutputPresentation = exports.PanelKind = exports.RevealKind = exports.DependsOrder = exports.TaskClient = exports.TaskServer = exports.taskPath = void 0;
exports.taskPath = '/services/task';
exports.TaskServer = Symbol('TaskServer');
exports.TaskClient = Symbol('TaskClient');
var DependsOrder;
(function (DependsOrder) {
    DependsOrder["Sequence"] = "sequence";
    DependsOrder["Parallel"] = "parallel";
})(DependsOrder = exports.DependsOrder || (exports.DependsOrder = {}));
var RevealKind;
(function (RevealKind) {
    RevealKind["Always"] = "always";
    RevealKind["Silent"] = "silent";
    RevealKind["Never"] = "never";
})(RevealKind = exports.RevealKind || (exports.RevealKind = {}));
var PanelKind;
(function (PanelKind) {
    PanelKind["Shared"] = "shared";
    PanelKind["Dedicated"] = "dedicated";
    PanelKind["New"] = "new";
})(PanelKind = exports.PanelKind || (exports.PanelKind = {}));
var TaskOutputPresentation;
(function (TaskOutputPresentation) {
    function getDefault() {
        return {
            echo: true,
            reveal: RevealKind.Always,
            focus: false,
            panel: PanelKind.Shared,
            showReuseMessage: true,
            clear: false,
            close: false
        };
    }
    TaskOutputPresentation.getDefault = getDefault;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function fromJson(task) {
        let outputPresentation = getDefault();
        if (task && task.presentation) {
            if (task.presentation.reveal) {
                let reveal = RevealKind.Always;
                if (task.presentation.reveal === 'silent') {
                    reveal = RevealKind.Silent;
                }
                else if (task.presentation.reveal === 'never') {
                    reveal = RevealKind.Never;
                }
                outputPresentation = { ...outputPresentation, reveal };
            }
            if (task.presentation.panel) {
                let panel = PanelKind.Shared;
                if (task.presentation.panel === 'dedicated') {
                    panel = PanelKind.Dedicated;
                }
                else if (task.presentation.panel === 'new') {
                    panel = PanelKind.New;
                }
                outputPresentation = { ...outputPresentation, panel };
            }
            outputPresentation = {
                ...outputPresentation,
                echo: task.presentation.echo === undefined || task.presentation.echo,
                focus: shouldSetFocusToTerminal(task),
                showReuseMessage: shouldShowReuseMessage(task),
                clear: shouldClearTerminalBeforeRun(task),
                close: shouldCloseTerminalOnFinish(task)
            };
        }
        return outputPresentation;
    }
    TaskOutputPresentation.fromJson = fromJson;
    function shouldAlwaysRevealTerminal(task) {
        return !task.presentation || task.presentation.reveal === undefined || task.presentation.reveal === RevealKind.Always;
    }
    TaskOutputPresentation.shouldAlwaysRevealTerminal = shouldAlwaysRevealTerminal;
    function shouldSetFocusToTerminal(task) {
        return !!task.presentation && !!task.presentation.focus;
    }
    TaskOutputPresentation.shouldSetFocusToTerminal = shouldSetFocusToTerminal;
    function shouldClearTerminalBeforeRun(task) {
        return !!task.presentation && !!task.presentation.clear;
    }
    TaskOutputPresentation.shouldClearTerminalBeforeRun = shouldClearTerminalBeforeRun;
    function shouldCloseTerminalOnFinish(task) {
        return !!task.presentation && !!task.presentation.close;
    }
    TaskOutputPresentation.shouldCloseTerminalOnFinish = shouldCloseTerminalOnFinish;
    function shouldShowReuseMessage(task) {
        return !task.presentation || task.presentation.showReuseMessage === undefined || !!task.presentation.showReuseMessage;
    }
    TaskOutputPresentation.shouldShowReuseMessage = shouldShowReuseMessage;
})(TaskOutputPresentation = exports.TaskOutputPresentation || (exports.TaskOutputPresentation = {}));
var TaskCustomization;
(function (TaskCustomization) {
    function isBuildTask(task) {
        return task.group === 'build' || typeof task.group === 'object' && task.group.kind === 'build';
    }
    TaskCustomization.isBuildTask = isBuildTask;
    function isDefaultBuildTask(task) {
        return isDefaultTask(task) && isBuildTask(task);
    }
    TaskCustomization.isDefaultBuildTask = isDefaultBuildTask;
    function isDefaultTask(task) {
        return typeof task.group === 'object' && task.group.isDefault;
    }
    TaskCustomization.isDefaultTask = isDefaultTask;
    function isTestTask(task) {
        return task.group === 'test' || typeof task.group === 'object' && task.group.kind === 'test';
    }
    TaskCustomization.isTestTask = isTestTask;
    function isDefaultTestTask(task) {
        return isDefaultTask(task) && isTestTask(task);
    }
    TaskCustomization.isDefaultTestTask = isDefaultTestTask;
})(TaskCustomization = exports.TaskCustomization || (exports.TaskCustomization = {}));
var TaskScope;
(function (TaskScope) {
    TaskScope[TaskScope["Global"] = 1] = "Global";
    TaskScope[TaskScope["Workspace"] = 2] = "Workspace";
})(TaskScope = exports.TaskScope || (exports.TaskScope = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/task/lib/common/task-protocol'] = this;


/***/ }),

/***/ "../../packages/task/lib/common/task-util.js":
/*!***************************************************!*\
  !*** ../../packages/task/lib/common/task-util.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

// *****************************************************************************
// Copyright (C) 2023 EclipseSource and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fromVariableName = exports.asVariableName = void 0;
/**
 * Converts the given standard name to a variable name starting with '$' if not already present.
 *
 * Variable names are used, for instance, to reference problem matchers, within task configurations.
 *
 * @param name standard name
 * @returns variable name with leading '$' if not already present.
 *
 * @see {@link fromVariableName} for the reverse conversion.
 */
function asVariableName(name) {
    return name.startsWith('$') ? name : `$${name}`;
}
exports.asVariableName = asVariableName;
/**
 * Converts a given variable name to a standard name, effectively removing a leading '$' if present.
 *
 * Standard names are used, for instance, in registries to store variable objects
 *
 * @param name variable name
 * @returns variable name without leading '$' if present.
 *
 * @see {@link asVariableName} for the reverse conversion.
 */
function fromVariableName(name) {
    return name.startsWith('$') ? name.slice(1) : name;
}
exports.fromVariableName = fromVariableName;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/task/lib/common/task-util'] = this;


/***/ }),

/***/ "../../packages/task/lib/common/task-watcher.js":
/*!******************************************************!*\
  !*** ../../packages/task/lib/common/task-watcher.js ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TaskWatcher = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const event_1 = __webpack_require__(/*! @theia/core/lib/common/event */ "../../packages/core/lib/common/event.js");
let TaskWatcher = class TaskWatcher {
    constructor() {
        this.onTaskCreatedEmitter = new event_1.Emitter();
        this.onTaskExitEmitter = new event_1.Emitter();
        this.onDidStartTaskProcessEmitter = new event_1.Emitter();
        this.onDidEndTaskProcessEmitter = new event_1.Emitter();
        this.onOutputProcessedEmitter = new event_1.Emitter();
        this.onBackgroundTaskEndedEmitter = new event_1.Emitter();
    }
    getTaskClient() {
        const newTaskEmitter = this.onTaskCreatedEmitter;
        const exitEmitter = this.onTaskExitEmitter;
        const taskProcessStartedEmitter = this.onDidStartTaskProcessEmitter;
        const taskProcessEndedEmitter = this.onDidEndTaskProcessEmitter;
        const outputProcessedEmitter = this.onOutputProcessedEmitter;
        const backgroundTaskEndedEmitter = this.onBackgroundTaskEndedEmitter;
        return {
            onTaskCreated(event) {
                newTaskEmitter.fire(event);
            },
            onTaskExit(event) {
                exitEmitter.fire(event);
            },
            onDidStartTaskProcess(event) {
                taskProcessStartedEmitter.fire(event);
            },
            onDidEndTaskProcess(event) {
                taskProcessEndedEmitter.fire(event);
            },
            onDidProcessTaskOutput(event) {
                outputProcessedEmitter.fire(event);
            },
            onBackgroundTaskEnded(event) {
                backgroundTaskEndedEmitter.fire(event);
            }
        };
    }
    get onTaskCreated() {
        return this.onTaskCreatedEmitter.event;
    }
    get onTaskExit() {
        return this.onTaskExitEmitter.event;
    }
    get onDidStartTaskProcess() {
        return this.onDidStartTaskProcessEmitter.event;
    }
    get onDidEndTaskProcess() {
        return this.onDidEndTaskProcessEmitter.event;
    }
    get onOutputProcessed() {
        return this.onOutputProcessedEmitter.event;
    }
    get onBackgroundTaskEnded() {
        return this.onBackgroundTaskEndedEmitter.event;
    }
};
TaskWatcher = __decorate([
    (0, inversify_1.injectable)()
], TaskWatcher);
exports.TaskWatcher = TaskWatcher;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/task/lib/common/task-watcher'] = this;


/***/ }),

/***/ "../../packages/terminal/lib/browser/base/terminal-service.js":
/*!********************************************************************!*\
  !*** ../../packages/terminal/lib/browser/base/terminal-service.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TerminalService = void 0;
/**
 * Service manipulating terminal widgets.
 */
exports.TerminalService = Symbol('TerminalService');

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/terminal/lib/browser/base/terminal-service'] = this;


/***/ }),

/***/ "../../packages/terminal/lib/common/shell-terminal-protocol.js":
/*!*********************************************************************!*\
  !*** ../../packages/terminal/lib/common/shell-terminal-protocol.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ShellTerminalServerProxy = exports.shellTerminalPath = exports.IShellTerminalServer = void 0;
exports.IShellTerminalServer = Symbol('IShellTerminalServer');
exports.shellTerminalPath = '/services/shell-terminal';
;
exports.ShellTerminalServerProxy = Symbol('ShellTerminalServerProxy');

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/terminal/lib/common/shell-terminal-protocol'] = this;


/***/ }),

/***/ "../../packages/userstorage/lib/browser/index.js":
/*!*******************************************************!*\
  !*** ../../packages/userstorage/lib/browser/index.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./user-storage-uri */ "../../packages/userstorage/lib/browser/user-storage-uri.js"), exports);
__exportStar(__webpack_require__(/*! ./user-storage-frontend-module */ "../../packages/userstorage/lib/browser/user-storage-frontend-module.js"), exports);

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/userstorage/lib/browser'] = this;


/***/ }),

/***/ "../../packages/userstorage/lib/browser/user-storage-contribution.js":
/*!***************************************************************************!*\
  !*** ../../packages/userstorage/lib/browser/user-storage-contribution.js ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2020 TypeFox and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserStorageContribution = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
const env_variables_1 = __webpack_require__(/*! @theia/core/lib/common/env-variables */ "../../packages/core/lib/common/env-variables/index.js");
const delegating_file_system_provider_1 = __webpack_require__(/*! @theia/filesystem/lib/common/delegating-file-system-provider */ "../../packages/filesystem/lib/common/delegating-file-system-provider.js");
const user_storage_uri_1 = __webpack_require__(/*! ./user-storage-uri */ "../../packages/userstorage/lib/browser/user-storage-uri.js");
let UserStorageContribution = class UserStorageContribution {
    registerFileSystemProviders(service) {
        service.onWillActivateFileSystemProvider(event => {
            if (event.scheme === user_storage_uri_1.UserStorageUri.scheme) {
                event.waitUntil((async () => {
                    const provider = await this.createProvider(service);
                    service.registerProvider(user_storage_uri_1.UserStorageUri.scheme, provider);
                })());
            }
        });
    }
    async createProvider(service) {
        const delegate = await service.activateProvider('file');
        const configDirUri = new uri_1.default(await this.environments.getConfigDirUri());
        return new delegating_file_system_provider_1.DelegatingFileSystemProvider(delegate, {
            uriConverter: {
                to: resource => {
                    const relativePath = user_storage_uri_1.UserStorageUri.relative(resource);
                    if (relativePath) {
                        return configDirUri.resolve(relativePath).normalizePath();
                    }
                    return undefined;
                },
                from: resource => {
                    const relativePath = configDirUri.relative(resource);
                    if (relativePath) {
                        return user_storage_uri_1.UserStorageUri.resolve(relativePath);
                    }
                    return undefined;
                }
            }
        }, new disposable_1.DisposableCollection(delegate.watch(configDirUri, { excludes: [], recursive: true })));
    }
};
__decorate([
    (0, inversify_1.inject)(env_variables_1.EnvVariablesServer),
    __metadata("design:type", Object)
], UserStorageContribution.prototype, "environments", void 0);
UserStorageContribution = __decorate([
    (0, inversify_1.injectable)()
], UserStorageContribution);
exports.UserStorageContribution = UserStorageContribution;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/userstorage/lib/browser/user-storage-contribution'] = this;


/***/ }),

/***/ "../../packages/userstorage/lib/browser/user-storage-frontend-module.js":
/*!******************************************************************************!*\
  !*** ../../packages/userstorage/lib/browser/user-storage-frontend-module.js ***!
  \******************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const file_service_1 = __webpack_require__(/*! @theia/filesystem/lib/browser/file-service */ "../../packages/filesystem/lib/browser/file-service.js");
const user_storage_contribution_1 = __webpack_require__(/*! ./user-storage-contribution */ "../../packages/userstorage/lib/browser/user-storage-contribution.js");
exports["default"] = new inversify_1.ContainerModule(bind => {
    bind(user_storage_contribution_1.UserStorageContribution).toSelf().inSingletonScope();
    bind(file_service_1.FileServiceContribution).toService(user_storage_contribution_1.UserStorageContribution);
});

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/userstorage/lib/browser/user-storage-frontend-module'] = this;


/***/ }),

/***/ "../../packages/userstorage/lib/browser/user-storage-uri.js":
/*!******************************************************************!*\
  !*** ../../packages/userstorage/lib/browser/user-storage-uri.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserStorageUri = void 0;
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
exports.UserStorageUri = new uri_1.default('user-storage:/user');

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/userstorage/lib/browser/user-storage-uri'] = this;


/***/ }),

/***/ "../../packages/variable-resolver/lib/browser/variable-input-schema.js":
/*!*****************************************************************************!*\
  !*** ../../packages/variable-resolver/lib/browser/variable-input-schema.js ***!
  \*****************************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

// *****************************************************************************
// Copyright (C) 2019 TypeFox and others.
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
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/*
 * copied from
 * https://github.com/microsoft/vscode/blob/0a34756cae4fc67739e60c708b04637089f8bb0d/src/vs/workbench/services/configurationResolver/common/configurationResolverSchema.ts#L23
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.inputsSchema = void 0;
const idDescription = "The input's id is used to associate an input with a variable of the form ${input:id}.";
const typeDescription = 'The type of user input prompt to use.';
const descriptionDescription = 'The description is shown when the user is prompted for input.';
const defaultDescription = 'The default value for the input.';
exports.inputsSchema = {
    definitions: {
        inputs: {
            type: 'array',
            description: 'User inputs. Used for defining user input prompts, such as free string input or a choice from several options.',
            items: {
                oneOf: [
                    {
                        type: 'object',
                        required: ['id', 'type', 'description'],
                        additionalProperties: false,
                        properties: {
                            id: {
                                type: 'string',
                                description: idDescription
                            },
                            type: {
                                type: 'string',
                                description: typeDescription,
                                enum: ['promptString'],
                                enumDescriptions: [
                                    "The 'promptString' type opens an input box to ask the user for input."
                                ]
                            },
                            description: {
                                type: 'string',
                                description: descriptionDescription
                            },
                            default: {
                                type: 'string',
                                description: defaultDescription
                            },
                        }
                    },
                    {
                        type: 'object',
                        required: ['id', 'type', 'description', 'options'],
                        additionalProperties: false,
                        properties: {
                            id: {
                                type: 'string',
                                description: idDescription
                            },
                            type: {
                                type: 'string',
                                description: typeDescription,
                                enum: ['pickString'],
                                enumDescriptions: [
                                    "The 'pickString' type shows a selection list.",
                                ]
                            },
                            description: {
                                type: 'string',
                                description: descriptionDescription
                            },
                            default: {
                                type: 'string',
                                description: defaultDescription
                            },
                            options: {
                                type: 'array',
                                description: 'An array of strings that defines the options for a quick pick.',
                                items: {
                                    type: 'string'
                                }
                            }
                        }
                    },
                    {
                        type: 'object',
                        required: ['id', 'type', 'command'],
                        additionalProperties: false,
                        properties: {
                            id: {
                                type: 'string',
                                description: idDescription
                            },
                            type: {
                                type: 'string',
                                description: typeDescription,
                                enum: ['command'],
                                enumDescriptions: [
                                    "The 'command' type executes a command.",
                                ]
                            },
                            command: {
                                type: 'string',
                                description: 'The command to execute for this input variable.'
                            },
                            args: {
                                type: 'object',
                                description: 'Optional arguments passed to the command.'
                            }
                        }
                    }
                ]
            }
        }
    }
};

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/variable-resolver/lib/browser/variable-input-schema'] = this;


/***/ })

}]);
//# sourceMappingURL=packages_task_lib_browser_quick-open-task_js.js.map