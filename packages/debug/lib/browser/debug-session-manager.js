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
exports.DebugSessionManager = void 0;
const core_1 = require("@theia/core");
const browser_1 = require("@theia/core/lib/browser");
const context_key_service_1 = require("@theia/core/lib/browser/context-key-service");
const uri_1 = require("@theia/core/lib/common/uri");
const browser_2 = require("@theia/editor/lib/browser");
const quick_open_task_1 = require("@theia/task/lib/browser/quick-open-task");
const task_service_1 = require("@theia/task/lib/browser/task-service");
const browser_3 = require("@theia/variable-resolver/lib/browser");
const inversify_1 = require("@theia/core/shared/inversify");
const debug_service_1 = require("../common/debug-service");
const breakpoint_manager_1 = require("./breakpoint/breakpoint-manager");
const debug_configuration_manager_1 = require("./debug-configuration-manager");
const debug_session_1 = require("./debug-session");
const debug_session_contribution_1 = require("./debug-session-contribution");
const debug_session_options_1 = require("./debug-session-options");
const debug_source_breakpoint_1 = require("./model/debug-source-breakpoint");
const debug_function_breakpoint_1 = require("./model/debug-function-breakpoint");
const debug_instruction_breakpoint_1 = require("./model/debug-instruction-breakpoint");
let DebugSessionManager = class DebugSessionManager {
    constructor() {
        this._sessions = new Map();
        this.onWillStartDebugSessionEmitter = new core_1.Emitter();
        this.onWillStartDebugSession = this.onWillStartDebugSessionEmitter.event;
        this.onWillResolveDebugConfigurationEmitter = new core_1.Emitter();
        this.onWillResolveDebugConfiguration = this.onWillResolveDebugConfigurationEmitter.event;
        this.onDidCreateDebugSessionEmitter = new core_1.Emitter();
        this.onDidCreateDebugSession = this.onDidCreateDebugSessionEmitter.event;
        this.onDidStartDebugSessionEmitter = new core_1.Emitter();
        this.onDidStartDebugSession = this.onDidStartDebugSessionEmitter.event;
        this.onDidStopDebugSessionEmitter = new core_1.Emitter();
        this.onDidStopDebugSession = this.onDidStopDebugSessionEmitter.event;
        this.onDidChangeActiveDebugSessionEmitter = new core_1.Emitter();
        this.onDidChangeActiveDebugSession = this.onDidChangeActiveDebugSessionEmitter.event;
        this.onDidDestroyDebugSessionEmitter = new core_1.Emitter();
        this.onDidDestroyDebugSession = this.onDidDestroyDebugSessionEmitter.event;
        this.onDidReceiveDebugSessionCustomEventEmitter = new core_1.Emitter();
        this.onDidReceiveDebugSessionCustomEvent = this.onDidReceiveDebugSessionCustomEventEmitter.event;
        this.onDidFocusStackFrameEmitter = new core_1.Emitter();
        this.onDidFocusStackFrame = this.onDidFocusStackFrameEmitter.event;
        this.onDidChangeBreakpointsEmitter = new core_1.Emitter();
        this.onDidChangeBreakpoints = this.onDidChangeBreakpointsEmitter.event;
        this.onDidChangeEmitter = new core_1.Emitter();
        this.onDidChange = this.onDidChangeEmitter.event;
        this.configurationIds = new Map();
        this.disposeOnCurrentSessionChanged = new core_1.DisposableCollection();
    }
    fireDidChangeBreakpoints(event) {
        this.onDidChangeBreakpointsEmitter.fire(event);
    }
    fireDidChange(current) {
        this.debugTypeKey.set(current === null || current === void 0 ? void 0 : current.configuration.type);
        this.inDebugModeKey.set(this.inDebugMode);
        this.debugStateKey.set((0, debug_session_1.debugStateContextValue)(this.state));
        this.onDidChangeEmitter.fire(current);
    }
    init() {
        this.debugTypeKey = this.contextKeyService.createKey('debugType', undefined);
        this.inDebugModeKey = this.contextKeyService.createKey('inDebugMode', this.inDebugMode);
        this.debugStateKey = this.contextKeyService.createKey('debugState', (0, debug_session_1.debugStateContextValue)(this.state));
        this.breakpoints.onDidChangeMarkers(uri => this.fireDidChangeBreakpoints({ uri }));
        this.labelProvider.onDidChange(event => {
            for (const uriString of this.breakpoints.getUris()) {
                const uri = new uri_1.default(uriString);
                if (event.affects(uri)) {
                    this.fireDidChangeBreakpoints({ uri });
                }
            }
        });
    }
    get inDebugMode() {
        return this.state > debug_session_1.DebugState.Inactive;
    }
    isCurrentEditorFrame(uri) {
        var _a, _b;
        return ((_b = (_a = this.currentFrame) === null || _a === void 0 ? void 0 : _a.source) === null || _b === void 0 ? void 0 : _b.uri.toString()) === (uri instanceof uri_1.default ? uri : new uri_1.default(uri)).toString();
    }
    async saveAll() {
        if (!this.shell.canSaveAll()) {
            return true; // Nothing to save.
        }
        try {
            await this.shell.saveAll();
            return true;
        }
        catch (error) {
            console.error('saveAll failed:', error);
            return false;
        }
    }
    async start(optionsOrName) {
        if (typeof optionsOrName === 'string') {
            const options = this.debugConfigurationManager.find(optionsOrName);
            return !!options && this.start(options);
        }
        return optionsOrName.configuration ? this.startConfiguration(optionsOrName) : this.startCompound(optionsOrName);
    }
    async startConfiguration(options) {
        return this.progressService.withProgress('Start...', 'debug', async () => {
            try {
                // If a parent session is available saving should be handled by the parent
                if (!options.configuration.parentSessionId && !options.configuration.suppressSaveBeforeStart && !await this.saveAll()) {
                    return undefined;
                }
                await this.fireWillStartDebugSession();
                const resolved = await this.resolveConfiguration(options);
                if (!resolved || !resolved.configuration) {
                    // As per vscode API: https://code.visualstudio.com/api/references/vscode-api#DebugConfigurationProvider
                    // "Returning the value 'undefined' prevents the debug session from starting.
                    // Returning the value 'null' prevents the debug session from starting and opens the
                    // underlying debug configuration instead."
                    // eslint-disable-next-line no-null/no-null
                    if (resolved === null) {
                        this.debugConfigurationManager.openConfiguration();
                    }
                    return undefined;
                }
                // preLaunchTask isn't run in case of auto restart as well as postDebugTask
                if (!options.configuration.__restart) {
                    const taskRun = await this.runTask(options.workspaceFolderUri, resolved.configuration.preLaunchTask, true);
                    if (!taskRun) {
                        return undefined;
                    }
                }
                const sessionId = await this.debug.createDebugSession(resolved.configuration, options.workspaceFolderUri);
                return this.doStart(sessionId, resolved);
            }
            catch (e) {
                if (debug_service_1.DebugError.NotFound.is(e)) {
                    this.messageService.error(`The debug session type "${e.data.type}" is not supported.`);
                    return undefined;
                }
                this.messageService.error('There was an error starting the debug session, check the logs for more details.');
                console.error('Error starting the debug session', e);
                throw e;
            }
        });
    }
    async startCompound(options) {
        let configurations = [];
        const compoundRoot = options.compound.stopAll ? new debug_session_options_1.DebugCompoundRoot() : undefined;
        try {
            configurations = this.getCompoundConfigurations(options, compoundRoot);
        }
        catch (error) {
            this.messageService.error(error.message);
            return;
        }
        if (options.compound.preLaunchTask) {
            const taskRun = await this.runTask(options.workspaceFolderUri, options.compound.preLaunchTask, true);
            if (!taskRun) {
                return undefined;
            }
        }
        // Compound launch is a success only if each configuration launched successfully
        const values = await Promise.all(configurations.map(async (configuration) => {
            const newSession = await this.startConfiguration(configuration);
            if (newSession) {
                compoundRoot === null || compoundRoot === void 0 ? void 0 : compoundRoot.onDidSessionStop(() => newSession.stop(false, () => this.debug.terminateDebugSession(newSession.id)));
            }
            return newSession;
        }));
        const result = values.every(success => !!success);
        return result;
    }
    getCompoundConfigurations(options, compoundRoot) {
        const compound = options.compound;
        if (!compound.configurations) {
            throw new Error(core_1.nls.localizeByDefault('Compound must have "configurations" attribute set in order to start multiple configurations.'));
        }
        const configurations = [];
        for (const configData of compound.configurations) {
            const name = typeof configData === 'string' ? configData : configData.name;
            if (name === compound.name) {
                throw new Error(core_1.nls.localize('theia/debug/compound-cycle', "Launch configuration '{0}' contains a cycle with itself", name));
            }
            const workspaceFolderUri = typeof configData === 'string' ? options.workspaceFolderUri : configData.folder;
            const matchingOptions = [...this.debugConfigurationManager.all]
                .filter(option => option.name === name && !!option.configuration && option.workspaceFolderUri === workspaceFolderUri);
            if (matchingOptions.length === 1) {
                const match = matchingOptions[0];
                if (debug_session_options_1.DebugSessionOptions.isConfiguration(match)) {
                    configurations.push({ ...match, compoundRoot, configuration: { ...match.configuration, noDebug: options.noDebug } });
                }
                else {
                    throw new Error(core_1.nls.localizeByDefault("Could not find launch configuration '{0}' in the workspace.", name));
                }
            }
            else {
                throw new Error(matchingOptions.length === 0
                    ? workspaceFolderUri
                        ? core_1.nls.localizeByDefault("Can not find folder with name '{0}' for configuration '{1}' in compound '{2}'.", workspaceFolderUri, name, compound.name)
                        : core_1.nls.localizeByDefault("Could not find launch configuration '{0}' in the workspace.", name)
                    : core_1.nls.localizeByDefault("There are multiple launch configurations '{0}' in the workspace. Use folder name to qualify the configuration.", name));
            }
        }
        return configurations;
    }
    async fireWillStartDebugSession() {
        await core_1.WaitUntilEvent.fire(this.onWillStartDebugSessionEmitter, {});
    }
    async resolveConfiguration(options) {
        if (debug_session_options_1.InternalDebugSessionOptions.is(options)) {
            return options;
        }
        const { workspaceFolderUri } = options;
        let configuration = await this.resolveDebugConfiguration(options.configuration, workspaceFolderUri);
        if (configuration) {
            // Resolve command variables provided by the debugger
            const commandIdVariables = await this.debug.provideDebuggerVariables(configuration.type);
            configuration = await this.variableResolver.resolve(configuration, {
                context: options.workspaceFolderUri ? new uri_1.default(options.workspaceFolderUri) : undefined,
                configurationSection: 'launch',
                commandIdVariables,
                configuration
            });
            if (configuration) {
                configuration = await this.resolveDebugConfigurationWithSubstitutedVariables(configuration, workspaceFolderUri);
            }
        }
        if (!configuration) {
            return configuration;
        }
        const key = configuration.name + workspaceFolderUri;
        const id = this.configurationIds.has(key) ? this.configurationIds.get(key) + 1 : 0;
        this.configurationIds.set(key, id);
        return {
            id,
            ...options,
            name: configuration.name,
            configuration
        };
    }
    async resolveDebugConfiguration(configuration, workspaceFolderUri) {
        await this.fireWillResolveDebugConfiguration(configuration.type);
        return this.debug.resolveDebugConfiguration(configuration, workspaceFolderUri);
    }
    async fireWillResolveDebugConfiguration(debugType) {
        await core_1.WaitUntilEvent.fire(this.onWillResolveDebugConfigurationEmitter, { debugType });
    }
    async resolveDebugConfigurationWithSubstitutedVariables(configuration, workspaceFolderUri) {
        return this.debug.resolveDebugConfigurationWithSubstitutedVariables(configuration, workspaceFolderUri);
    }
    async doStart(sessionId, options) {
        const parentSession = options.configuration.parentSessionId ? this._sessions.get(options.configuration.parentSessionId) : undefined;
        const contrib = this.sessionContributionRegistry.get(options.configuration.type);
        const sessionFactory = contrib ? contrib.debugSessionFactory() : this.debugSessionFactory;
        const session = sessionFactory.get(sessionId, options, parentSession);
        this._sessions.set(sessionId, session);
        this.debugTypeKey.set(session.configuration.type);
        this.onDidCreateDebugSessionEmitter.fire(session);
        let state = debug_session_1.DebugState.Inactive;
        session.onDidChange(() => {
            if (state !== session.state) {
                state = session.state;
                if (state === debug_session_1.DebugState.Stopped) {
                    this.onDidStopDebugSessionEmitter.fire(session);
                }
            }
            this.updateCurrentSession(session);
        });
        session.onDidChangeBreakpoints(uri => this.fireDidChangeBreakpoints({ session, uri }));
        session.on('terminated', async (event) => {
            const restart = event.body && event.body.restart;
            if (restart) {
                // postDebugTask isn't run in case of auto restart as well as preLaunchTask
                this.doRestart(session, !!restart);
            }
            else {
                await session.disconnect(false, () => this.debug.terminateDebugSession(session.id));
                await this.runTask(session.options.workspaceFolderUri, session.configuration.postDebugTask);
            }
        });
        session.on('exited', async (event) => {
            await session.disconnect(false, () => this.debug.terminateDebugSession(session.id));
        });
        session.onDispose(() => this.cleanup(session));
        session.start().then(() => this.onDidStartDebugSessionEmitter.fire(session)).catch(e => {
            session.stop(false, () => {
                this.debug.terminateDebugSession(session.id);
            });
        });
        session.onDidCustomEvent(({ event, body }) => this.onDidReceiveDebugSessionCustomEventEmitter.fire({ event, body, session }));
        return session;
    }
    cleanup(session) {
        if (this.remove(session.id)) {
            this.onDidDestroyDebugSessionEmitter.fire(session);
        }
    }
    async doRestart(session, isRestart) {
        if (session.canRestart()) {
            await session.restart();
            return session;
        }
        const { options, configuration } = session;
        session.stop(isRestart, () => this.debug.terminateDebugSession(session.id));
        configuration.__restart = isRestart;
        return this.start(options);
    }
    async terminateSession(session) {
        if (!session) {
            this.updateCurrentSession(this._currentSession);
            session = this._currentSession;
        }
        if (session) {
            if (session.options.compoundRoot) {
                session.options.compoundRoot.stopSession();
            }
            else if (session.parentSession && session.configuration.lifecycleManagedByParent) {
                this.terminateSession(session.parentSession);
            }
            else {
                session.stop(false, () => this.debug.terminateDebugSession(session.id));
            }
        }
    }
    async restartSession(session) {
        if (!session) {
            this.updateCurrentSession(this._currentSession);
            session = this._currentSession;
        }
        if (session) {
            if (session.parentSession && session.configuration.lifecycleManagedByParent) {
                return this.restartSession(session.parentSession);
            }
            else {
                return this.doRestart(session, true);
            }
        }
    }
    remove(sessionId) {
        const existed = this._sessions.delete(sessionId);
        const { currentSession } = this;
        if (currentSession && currentSession.id === sessionId) {
            this.updateCurrentSession(undefined);
        }
        return existed;
    }
    getSession(sessionId) {
        return this._sessions.get(sessionId);
    }
    get sessions() {
        return Array.from(this._sessions.values()).filter(session => session.state > debug_session_1.DebugState.Inactive);
    }
    get currentSession() {
        return this._currentSession;
    }
    set currentSession(current) {
        if (this._currentSession === current) {
            return;
        }
        this.disposeOnCurrentSessionChanged.dispose();
        const previous = this.currentSession;
        this._currentSession = current;
        this.onDidChangeActiveDebugSessionEmitter.fire({ previous, current });
        if (current) {
            this.disposeOnCurrentSessionChanged.push(current.onDidChange(() => {
                if (this.currentFrame === this.topFrame) {
                    this.open();
                }
                this.fireDidChange(current);
            }));
            this.disposeOnCurrentSessionChanged.push(current.onDidFocusStackFrame(frame => this.onDidFocusStackFrameEmitter.fire({ session: current, frame })));
        }
        this.updateBreakpoints(previous, current);
        this.open();
        this.fireDidChange(current);
    }
    open() {
        const { currentFrame } = this;
        if (currentFrame) {
            currentFrame.open();
        }
    }
    updateBreakpoints(previous, current) {
        const affectedUri = new Set();
        for (const session of [previous, current]) {
            if (session) {
                for (const uriString of session.breakpointUris) {
                    if (!affectedUri.has(uriString)) {
                        affectedUri.add(uriString);
                        this.fireDidChangeBreakpoints({
                            session: current,
                            uri: new uri_1.default(uriString)
                        });
                    }
                }
            }
        }
    }
    updateCurrentSession(session) {
        this.currentSession = session || this.sessions[0];
    }
    get currentThread() {
        const session = this.currentSession;
        return session && session.currentThread;
    }
    get state() {
        const session = this.currentSession;
        return session ? session.state : debug_session_1.DebugState.Inactive;
    }
    get currentFrame() {
        const { currentThread } = this;
        return currentThread && currentThread.currentFrame;
    }
    get topFrame() {
        const { currentThread } = this;
        return currentThread && currentThread.topFrame;
    }
    getFunctionBreakpoints(session = this.currentSession) {
        if (session && session.state > debug_session_1.DebugState.Initializing) {
            return session.getFunctionBreakpoints();
        }
        const { labelProvider, breakpoints, editorManager } = this;
        return this.breakpoints.getFunctionBreakpoints().map(origin => new debug_function_breakpoint_1.DebugFunctionBreakpoint(origin, { labelProvider, breakpoints, editorManager }));
    }
    getInstructionBreakpoints(session = this.currentSession) {
        if (session && session.state > debug_session_1.DebugState.Initializing) {
            return session.getInstructionBreakpoints();
        }
        const { labelProvider, breakpoints, editorManager } = this;
        return this.breakpoints.getInstructionBreakpoints().map(origin => new debug_instruction_breakpoint_1.DebugInstructionBreakpoint(origin, { labelProvider, breakpoints, editorManager }));
    }
    getBreakpoints(arg, arg2) {
        const uri = arg instanceof uri_1.default ? arg : undefined;
        const session = arg instanceof debug_session_1.DebugSession ? arg : arg2 instanceof debug_session_1.DebugSession ? arg2 : this.currentSession;
        if (session && session.state > debug_session_1.DebugState.Initializing) {
            return session.getSourceBreakpoints(uri);
        }
        const { labelProvider, breakpoints, editorManager } = this;
        return this.breakpoints.findMarkers({ uri }).map(({ data }) => new debug_source_breakpoint_1.DebugSourceBreakpoint(data, { labelProvider, breakpoints, editorManager }));
    }
    getLineBreakpoints(uri, line) {
        const session = this.currentSession;
        if (session && session.state > debug_session_1.DebugState.Initializing) {
            return session.getSourceBreakpoints(uri).filter(breakpoint => breakpoint.line === line);
        }
        const { labelProvider, breakpoints, editorManager } = this;
        return this.breakpoints.getLineBreakpoints(uri, line).map(origin => new debug_source_breakpoint_1.DebugSourceBreakpoint(origin, { labelProvider, breakpoints, editorManager }));
    }
    getInlineBreakpoint(uri, line, column) {
        const session = this.currentSession;
        if (session && session.state > debug_session_1.DebugState.Initializing) {
            return session.getSourceBreakpoints(uri).filter(breakpoint => breakpoint.line === line && breakpoint.column === column)[0];
        }
        const origin = this.breakpoints.getInlineBreakpoint(uri, line, column);
        const { labelProvider, breakpoints, editorManager } = this;
        return origin && new debug_source_breakpoint_1.DebugSourceBreakpoint(origin, { labelProvider, breakpoints, editorManager });
    }
    /**
     * Runs the given tasks.
     * @param taskName the task name to run, see [TaskNameResolver](#TaskNameResolver)
     * @return true if it allowed to continue debugging otherwise it returns false
     */
    async runTask(workspaceFolderUri, taskName, checkErrors) {
        if (!taskName) {
            return true;
        }
        const taskInfo = await this.taskService.runWorkspaceTask(this.taskService.startUserAction(), workspaceFolderUri, taskName);
        if (!checkErrors) {
            return true;
        }
        if (!taskInfo) {
            return this.doPostTaskAction(`Could not run the task '${taskName}'.`);
        }
        const getExitCodePromise = this.taskService.getExitCode(taskInfo.taskId).then(result => ({ taskEndedType: task_service_1.TaskEndedTypes.TaskExited, value: result }));
        const isBackgroundTaskEndedPromise = this.taskService.isBackgroundTaskEnded(taskInfo.taskId).then(result => ({ taskEndedType: task_service_1.TaskEndedTypes.BackgroundTaskEnded, value: result }));
        // After start running the task, we wait for the task process to exit and if it is a background task, we also wait for a feedback
        // that a background task is active, as soon as one of the promises fulfills, we can continue and analyze the results.
        const taskEndedInfo = await Promise.race([getExitCodePromise, isBackgroundTaskEndedPromise]);
        if (taskEndedInfo.taskEndedType === task_service_1.TaskEndedTypes.BackgroundTaskEnded && taskEndedInfo.value) {
            return true;
        }
        if (taskEndedInfo.taskEndedType === task_service_1.TaskEndedTypes.TaskExited && taskEndedInfo.value === 0) {
            return true;
        }
        else if (taskEndedInfo.taskEndedType === task_service_1.TaskEndedTypes.TaskExited && taskEndedInfo.value !== undefined) {
            return this.doPostTaskAction(`Task '${taskName}' terminated with exit code ${taskEndedInfo.value}.`);
        }
        else {
            const signal = await this.taskService.getTerminateSignal(taskInfo.taskId);
            if (signal !== undefined) {
                return this.doPostTaskAction(`Task '${taskName}' terminated by signal ${signal}.`);
            }
            else {
                return this.doPostTaskAction(`Task '${taskName}' terminated for unknown reason.`);
            }
        }
    }
    async doPostTaskAction(errorMessage) {
        const actions = ['Open launch.json', 'Cancel', 'Configure Task', 'Debug Anyway'];
        const result = await this.messageService.error(errorMessage, ...actions);
        switch (result) {
            case actions[0]: // open launch.json
                this.debugConfigurationManager.openConfiguration();
                return false;
            case actions[1]: // cancel
                return false;
            case actions[2]: // configure tasks
                this.quickOpenTask.configure();
                return false;
            default: // continue debugging
                return true;
        }
    }
};
__decorate([
    (0, inversify_1.inject)(debug_session_contribution_1.DebugSessionFactory),
    __metadata("design:type", Object)
], DebugSessionManager.prototype, "debugSessionFactory", void 0);
__decorate([
    (0, inversify_1.inject)(debug_service_1.DebugService),
    __metadata("design:type", Object)
], DebugSessionManager.prototype, "debug", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.LabelProvider),
    __metadata("design:type", browser_1.LabelProvider)
], DebugSessionManager.prototype, "labelProvider", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.EditorManager),
    __metadata("design:type", browser_2.EditorManager)
], DebugSessionManager.prototype, "editorManager", void 0);
__decorate([
    (0, inversify_1.inject)(breakpoint_manager_1.BreakpointManager),
    __metadata("design:type", breakpoint_manager_1.BreakpointManager)
], DebugSessionManager.prototype, "breakpoints", void 0);
__decorate([
    (0, inversify_1.inject)(browser_3.VariableResolverService),
    __metadata("design:type", browser_3.VariableResolverService)
], DebugSessionManager.prototype, "variableResolver", void 0);
__decorate([
    (0, inversify_1.inject)(debug_session_contribution_1.DebugSessionContributionRegistry),
    __metadata("design:type", Object)
], DebugSessionManager.prototype, "sessionContributionRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.MessageService),
    __metadata("design:type", core_1.MessageService)
], DebugSessionManager.prototype, "messageService", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.ProgressService),
    __metadata("design:type", core_1.ProgressService)
], DebugSessionManager.prototype, "progressService", void 0);
__decorate([
    (0, inversify_1.inject)(context_key_service_1.ContextKeyService),
    __metadata("design:type", Object)
], DebugSessionManager.prototype, "contextKeyService", void 0);
__decorate([
    (0, inversify_1.inject)(task_service_1.TaskService),
    __metadata("design:type", task_service_1.TaskService)
], DebugSessionManager.prototype, "taskService", void 0);
__decorate([
    (0, inversify_1.inject)(debug_configuration_manager_1.DebugConfigurationManager),
    __metadata("design:type", debug_configuration_manager_1.DebugConfigurationManager)
], DebugSessionManager.prototype, "debugConfigurationManager", void 0);
__decorate([
    (0, inversify_1.inject)(quick_open_task_1.QuickOpenTask),
    __metadata("design:type", quick_open_task_1.QuickOpenTask)
], DebugSessionManager.prototype, "quickOpenTask", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.ApplicationShell),
    __metadata("design:type", browser_1.ApplicationShell)
], DebugSessionManager.prototype, "shell", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DebugSessionManager.prototype, "init", null);
DebugSessionManager = __decorate([
    (0, inversify_1.injectable)()
], DebugSessionManager);
exports.DebugSessionManager = DebugSessionManager;
//# sourceMappingURL=debug-session-manager.js.map