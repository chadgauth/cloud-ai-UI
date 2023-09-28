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
exports.TaskService = exports.TaskEndedTypes = void 0;
const browser_1 = require("@theia/core/lib/browser");
const opener_service_1 = require("@theia/core/lib/browser/opener-service");
const common_1 = require("@theia/core/lib/common");
const message_service_1 = require("@theia/core/lib/common/message-service");
const promise_util_1 = require("@theia/core/lib/common/promise-util");
const quick_pick_service_1 = require("@theia/core/lib/common/quick-pick-service");
const label_provider_1 = require("@theia/core/lib/browser/label-provider");
const uri_1 = require("@theia/core/lib/common/uri");
const browser_2 = require("@theia/editor/lib/browser");
const problem_manager_1 = require("@theia/markers/lib/browser/problem/problem-manager");
const terminal_service_1 = require("@theia/terminal/lib/browser/base/terminal-service");
const browser_3 = require("@theia/variable-resolver/lib/browser");
const workspace_service_1 = require("@theia/workspace/lib/browser/workspace-service");
const inversify_1 = require("@theia/core/shared/inversify");
const vscode_languageserver_protocol_1 = require("@theia/core/shared/vscode-languageserver-protocol");
const common_2 = require("../common");
const task_watcher_1 = require("../common/task-watcher");
const provided_task_configurations_1 = require("./provided-task-configurations");
const task_configurations_1 = require("./task-configurations");
const task_contribution_1 = require("./task-contribution");
const task_definition_registry_1 = require("./task-definition-registry");
const task_name_resolver_1 = require("./task-name-resolver");
const task_source_resolver_1 = require("./task-source-resolver");
const task_problem_matcher_registry_1 = require("./task-problem-matcher-registry");
const task_schema_updater_1 = require("./task-schema-updater");
const task_configuration_manager_1 = require("./task-configuration-manager");
const problem_widget_1 = require("@theia/markers/lib/browser/problem/problem-widget");
const task_node_1 = require("./task-node");
const monaco_workspace_1 = require("@theia/monaco/lib/browser/monaco-workspace");
const task_terminal_widget_manager_1 = require("./task-terminal-widget-manager");
const shell_terminal_protocol_1 = require("@theia/terminal/lib/common/shell-terminal-protocol");
const async_mutex_1 = require("async-mutex");
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
//# sourceMappingURL=task-service.js.map