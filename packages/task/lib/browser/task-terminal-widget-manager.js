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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskTerminalWidgetManager = exports.TaskTerminalWidgetOpenerOptions = exports.TaskTerminalWidget = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/core/lib/browser");
const terminal_service_1 = require("@theia/terminal/lib/browser/base/terminal-service");
const common_1 = require("../common");
const task_protocol_1 = require("../common/process/task-protocol");
const task_definition_registry_1 = require("./task-definition-registry");
const workspace_service_1 = require("@theia/workspace/lib/browser/workspace-service");
const uri_1 = require("@theia/core/lib/common/uri");
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
//# sourceMappingURL=task-terminal-widget-manager.js.map