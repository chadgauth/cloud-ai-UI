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
exports.DebugSession = exports.debugStateContextValue = exports.DebugState = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const React = require("@theia/core/shared/react");
const common_1 = require("@theia/core/lib/common");
const debug_thread_1 = require("./model/debug-thread");
const debug_source_1 = require("./model/debug-source");
const debug_source_breakpoint_1 = require("./model/debug-source-breakpoint");
const debounce = require("p-debounce");
const uri_1 = require("@theia/core/lib/common/uri");
const breakpoint_manager_1 = require("./breakpoint/breakpoint-manager");
const debug_session_options_1 = require("./debug-session-options");
const debug_common_1 = require("../common/debug-common");
const breakpoint_marker_1 = require("./breakpoint/breakpoint-marker");
const debug_function_breakpoint_1 = require("./model/debug-function-breakpoint");
const promise_util_1 = require("@theia/core/lib/common/promise-util");
const debug_instruction_breakpoint_1 = require("./model/debug-instruction-breakpoint");
const core_1 = require("@theia/core");
var DebugState;
(function (DebugState) {
    DebugState[DebugState["Inactive"] = 0] = "Inactive";
    DebugState[DebugState["Initializing"] = 1] = "Initializing";
    DebugState[DebugState["Running"] = 2] = "Running";
    DebugState[DebugState["Stopped"] = 3] = "Stopped";
})(DebugState = exports.DebugState || (exports.DebugState = {}));
/**
 * The mapped string values must not change as they are used for the `debugState` when context closure.
 * For more details see the `Debugger contexts` section of the [official doc](https://code.visualstudio.com/api/references/when-clause-contexts#available-contexts).
 */
function debugStateContextValue(state) {
    switch (state) {
        case DebugState.Initializing: return 'initializing';
        case DebugState.Stopped: return 'stopped';
        case DebugState.Running: return 'running';
        default: return 'inactive';
    }
}
exports.debugStateContextValue = debugStateContextValue;
// FIXME: make injectable to allow easily inject services
class DebugSession {
    constructor(id, options, parentSession, connection, terminalServer, editorManager, breakpoints, labelProvider, messages, fileService, debugContributionProvider, workspaceService, 
    /**
     * Number of millis after a `stop` request times out. It's 5 seconds by default.
     */
    stopTimeout = 5000) {
        this.id = id;
        this.options = options;
        this.parentSession = parentSession;
        this.connection = connection;
        this.terminalServer = terminalServer;
        this.editorManager = editorManager;
        this.breakpoints = breakpoints;
        this.labelProvider = labelProvider;
        this.messages = messages;
        this.fileService = fileService;
        this.debugContributionProvider = debugContributionProvider;
        this.workspaceService = workspaceService;
        this.stopTimeout = stopTimeout;
        this.deferredOnDidConfigureCapabilities = new promise_util_1.Deferred();
        this.onDidChangeEmitter = new common_1.Emitter();
        this.onDidChange = this.onDidChangeEmitter.event;
        this.onDidFocusStackFrameEmitter = new common_1.Emitter();
        this.onDidChangeBreakpointsEmitter = new common_1.Emitter();
        this.onDidChangeBreakpoints = this.onDidChangeBreakpointsEmitter.event;
        this.childSessions = new Map();
        this.toDispose = new common_1.DisposableCollection();
        this.isStopping = false;
        this._capabilities = {};
        this.sources = new Map();
        this._threads = new Map();
        this.toDisposeOnCurrentThread = new common_1.DisposableCollection();
        /**
         * The `send('initialize')` request could resolve later than `on('initialized')` emits the event.
         * Hence, the `configure` would use the empty object `capabilities`.
         * Using the empty `capabilities` could result in missing exception breakpoint filters, as
         * always `capabilities.exceptionBreakpointFilters` is falsy. This deferred promise works
         * around this timing issue. https://github.com/eclipse-theia/theia/issues/11886
         */
        this.didReceiveCapabilities = new promise_util_1.Deferred();
        this.initialized = false;
        this.scheduleUpdateThreads = debounce(() => this.updateThreads(undefined), 100);
        this.pendingThreads = Promise.resolve();
        this._breakpoints = new Map();
        this.updatingBreakpoints = false;
        this.connection.onRequest('runInTerminal', (request) => this.runInTerminal(request));
        this.connection.onDidClose(() => {
            this.toDispose.dispose();
        });
        this.registerDebugContributions(options.configuration.type, this.connection);
        if (parentSession) {
            parentSession.childSessions.set(id, this);
            this.toDispose.push(common_1.Disposable.create(() => {
                var _a, _b;
                (_b = (_a = this.parentSession) === null || _a === void 0 ? void 0 : _a.childSessions) === null || _b === void 0 ? void 0 : _b.delete(id);
            }));
        }
        this.connection.onDidClose(() => this.toDispose.dispose());
        this.toDispose.pushAll([
            this.onDidChangeEmitter,
            this.onDidChangeBreakpointsEmitter,
            common_1.Disposable.create(() => {
                this.clearBreakpoints();
                this.doUpdateThreads([]);
            }),
            this.connection,
            this.connection.on('initialized', () => this.configure()),
            this.connection.on('breakpoint', ({ body }) => this.updateBreakpoint(body)),
            this.connection.on('continued', e => this.handleContinued(e)),
            this.connection.on('stopped', e => this.handleStopped(e)),
            this.connection.on('thread', e => this.handleThread(e)),
            this.connection.on('capabilities', event => this.updateCapabilities(event.body.capabilities)),
            this.breakpoints.onDidChangeMarkers(uri => this.updateBreakpoints({ uri, sourceModified: true }))
        ]);
    }
    fireDidChange() {
        this.onDidChangeEmitter.fire(undefined);
    }
    get onDidFocusStackFrame() {
        return this.onDidFocusStackFrameEmitter.event;
    }
    fireDidChangeBreakpoints(uri) {
        this.onDidChangeBreakpointsEmitter.fire(uri);
    }
    get onDispose() {
        return this.toDispose.onDispose;
    }
    get configuration() {
        return this.options.configuration;
    }
    get capabilities() {
        return this._capabilities;
    }
    getSource(raw) {
        const uri = debug_source_1.DebugSource.toUri(raw).toString();
        const source = this.sources.get(uri) || new debug_source_1.DebugSource(this, this.editorManager, this.labelProvider);
        source.update({ raw });
        this.sources.set(uri, source);
        return source;
    }
    getSourceForUri(uri) {
        return this.sources.get(uri.toString());
    }
    async toSource(uri) {
        const source = this.getSourceForUri(uri);
        if (source) {
            return source;
        }
        return this.getSource(await this.toDebugSource(uri));
    }
    async toDebugSource(uri) {
        if (uri.scheme === debug_source_1.DebugSource.SCHEME) {
            return {
                name: uri.path.toString(),
                sourceReference: Number(uri.query)
            };
        }
        const name = uri.displayName;
        let path;
        const underlying = await this.fileService.toUnderlyingResource(uri);
        if (underlying.scheme === 'file') {
            path = await this.fileService.fsPath(underlying);
        }
        else {
            path = uri.toString();
        }
        return { name, path };
    }
    get threads() {
        return this._threads.values();
    }
    get threadCount() {
        return this._threads.size;
    }
    *getThreads(filter) {
        for (const thread of this.threads) {
            if (filter(thread)) {
                yield thread;
            }
        }
    }
    get runningThreads() {
        return this.getThreads(thread => !thread.stopped);
    }
    get stoppedThreads() {
        return this.getThreads(thread => thread.stopped);
    }
    async pauseAll() {
        const promises = [];
        for (const thread of this.runningThreads) {
            promises.push((async () => {
                try {
                    await thread.pause();
                }
                catch (e) {
                    console.error('pauseAll failed:', e);
                }
            })());
        }
        await Promise.all(promises);
    }
    async continueAll() {
        const promises = [];
        for (const thread of this.stoppedThreads) {
            promises.push((async () => {
                try {
                    await thread.continue();
                }
                catch (e) {
                    console.error('continueAll failed:', e);
                }
            })());
        }
        await Promise.all(promises);
    }
    get currentFrame() {
        return this.currentThread && this.currentThread.currentFrame;
    }
    get currentThread() {
        return this._currentThread;
    }
    set currentThread(thread) {
        this.toDisposeOnCurrentThread.dispose();
        this._currentThread = thread;
        this.fireDidChange();
        if (thread) {
            this.toDisposeOnCurrentThread.push(thread.onDidChanged(() => this.fireDidChange()));
            this.toDisposeOnCurrentThread.push(thread.onDidFocusStackFrame(frame => this.onDidFocusStackFrameEmitter.fire(frame)));
            // If this thread is missing stack frame information, then load that.
            this.updateFrames();
        }
    }
    get state() {
        if (this.connection.disposed) {
            return DebugState.Inactive;
        }
        if (!this.initialized) {
            return DebugState.Initializing;
        }
        const thread = this.currentThread;
        if (thread) {
            return thread.stopped ? DebugState.Stopped : DebugState.Running;
        }
        return !!this.stoppedThreads.next().value ? DebugState.Stopped : DebugState.Running;
    }
    async getScopes() {
        const { currentFrame } = this;
        return currentFrame ? currentFrame.getScopes() : [];
    }
    async start() {
        await this.initialize();
        await this.launchOrAttach();
    }
    async initialize() {
        try {
            const response = await this.connection.sendRequest('initialize', {
                clientID: 'Theia',
                clientName: 'Theia IDE',
                adapterID: this.configuration.type,
                locale: 'en-US',
                linesStartAt1: true,
                columnsStartAt1: true,
                pathFormat: 'path',
                supportsVariableType: false,
                supportsVariablePaging: false,
                supportsRunInTerminalRequest: true
            });
            this.updateCapabilities((response === null || response === void 0 ? void 0 : response.body) || {});
            this.didReceiveCapabilities.resolve();
        }
        catch (err) {
            this.didReceiveCapabilities.reject(err);
            throw err;
        }
    }
    async launchOrAttach() {
        try {
            await this.sendRequest(this.configuration.request, this.configuration);
        }
        catch (reason) {
            this.messages.showMessage({
                type: common_1.MessageType.Error,
                text: reason.message || 'Debug session initialization failed. See console for details.',
                options: {
                    timeout: 10000
                }
            });
            throw reason;
        }
    }
    async configure() {
        await this.didReceiveCapabilities.promise;
        if (this.capabilities.exceptionBreakpointFilters) {
            const exceptionBreakpoints = [];
            for (const filter of this.capabilities.exceptionBreakpointFilters) {
                const origin = this.breakpoints.getExceptionBreakpoint(filter.filter);
                exceptionBreakpoints.push(breakpoint_marker_1.ExceptionBreakpoint.create(filter, origin));
            }
            this.breakpoints.setExceptionBreakpoints(exceptionBreakpoints);
        }
        await this.updateBreakpoints({ sourceModified: false });
        if (this.capabilities.supportsConfigurationDoneRequest) {
            await this.sendRequest('configurationDone', {});
        }
        this.initialized = true;
        await this.updateThreads(undefined);
    }
    canTerminate() {
        return !!this.capabilities.supportsTerminateRequest;
    }
    canRestart() {
        return !!this.capabilities.supportsRestartRequest;
    }
    async restart() {
        if (this.canRestart()) {
            await this.sendRequest('restart', {});
        }
    }
    async stop(isRestart, callback) {
        if (!this.isStopping) {
            this.isStopping = true;
            if (this.canTerminate()) {
                const terminated = this.waitFor('terminated', this.stopTimeout);
                try {
                    await this.connection.sendRequest('terminate', { restart: isRestart }, this.stopTimeout);
                    await terminated;
                }
                catch (e) {
                    this.handleTerminateError(e);
                }
            }
            else {
                const terminateDebuggee = this.initialized && this.capabilities.supportTerminateDebuggee;
                try {
                    await this.sendRequest('disconnect', { restart: isRestart, terminateDebuggee }, this.stopTimeout);
                }
                catch (e) {
                    this.handleDisconnectError(e);
                }
            }
            callback();
        }
    }
    /**
     * Invoked when sending the `terminate` request to the debugger is rejected or timed out.
     */
    handleTerminateError(err) {
        console.error('Did not receive terminated event in time', err);
    }
    /**
     * Invoked when sending the `disconnect` request to the debugger is rejected or timed out.
     */
    handleDisconnectError(err) {
        console.error('Error on disconnect', err);
    }
    async disconnect(isRestart, callback) {
        if (!this.isStopping) {
            this.isStopping = true;
            await this.sendRequest('disconnect', { restart: isRestart });
            callback();
        }
    }
    async completions(text, column, line) {
        const frameId = this.currentFrame && this.currentFrame.raw.id;
        const response = await this.sendRequest('completions', { frameId, text, column, line });
        return response.body.targets;
    }
    async evaluate(expression, context) {
        const frameId = this.currentFrame && this.currentFrame.raw.id;
        const response = await this.sendRequest('evaluate', { expression, frameId, context });
        return response.body;
    }
    sendRequest(command, args, timeout) {
        return this.connection.sendRequest(command, args, timeout);
    }
    sendCustomRequest(command, args) {
        return this.connection.sendCustomRequest(command, args);
    }
    on(kind, listener) {
        return this.connection.on(kind, listener);
    }
    waitFor(kind, ms) {
        return (0, promise_util_1.waitForEvent)(this.connection.onEvent(kind), ms).then();
    }
    get onDidCustomEvent() {
        return this.connection.onDidCustomEvent;
    }
    async runInTerminal({ arguments: { title, cwd, args, env } }) {
        const terminal = await this.doCreateTerminal({ title, cwd, env, useServerTitle: false });
        const { processId } = terminal;
        await terminal.executeCommand({ cwd, args, env });
        return { processId: await processId };
    }
    async doCreateTerminal(options) {
        let terminal = undefined;
        for (const t of this.terminalServer.all) {
            if ((t.title.label === options.title || t.title.caption === options.title) && (await t.hasChildProcesses()) === false) {
                terminal = t;
                break;
            }
        }
        if (!terminal) {
            terminal = await this.terminalServer.newTerminal(options);
            await terminal.start();
        }
        this.terminalServer.open(terminal);
        return terminal;
    }
    clearThreads() {
        for (const thread of this.threads) {
            thread.clear();
        }
        this.updateCurrentThread();
    }
    clearThread(threadId) {
        const thread = this._threads.get(threadId);
        if (thread) {
            thread.clear();
        }
        this.updateCurrentThread();
    }
    updateThreads(stoppedDetails) {
        return this.pendingThreads = this.pendingThreads.then(async () => {
            try {
                const response = await this.sendRequest('threads', {});
                // java debugger returns an empty body sometimes
                const threads = response && response.body && response.body.threads || [];
                this.doUpdateThreads(threads, stoppedDetails);
            }
            catch (e) {
                console.error('updateThreads failed:', e);
            }
        });
    }
    doUpdateThreads(threads, stoppedDetails) {
        const existing = this._threads;
        this._threads = new Map();
        for (const raw of threads) {
            const id = raw.id;
            const thread = existing.get(id) || new debug_thread_1.DebugThread(this);
            this._threads.set(id, thread);
            const data = { raw };
            if (stoppedDetails) {
                if (stoppedDetails.threadId === id) {
                    data.stoppedDetails = stoppedDetails;
                }
                else if (stoppedDetails.allThreadsStopped) {
                    data.stoppedDetails = {
                        // When a debug adapter notifies us that all threads are stopped,
                        // we do not know why the others are stopped, so we should default
                        // to something generic.
                        reason: '',
                    };
                }
            }
            thread.update(data);
        }
        this.updateCurrentThread(stoppedDetails);
    }
    updateCurrentThread(stoppedDetails) {
        const { currentThread } = this;
        let threadId = currentThread && currentThread.raw.id;
        if (stoppedDetails && !stoppedDetails.preserveFocusHint && !!stoppedDetails.threadId) {
            threadId = stoppedDetails.threadId;
        }
        this.currentThread = typeof threadId === 'number' && this._threads.get(threadId)
            || this._threads.values().next().value;
    }
    async updateFrames() {
        const thread = this._currentThread;
        if (!thread || thread.pendingFrameCount || thread.frameCount) {
            return;
        }
        if (this.capabilities.supportsDelayedStackTraceLoading) {
            await thread.fetchFrames(1);
            await thread.fetchFrames(19);
        }
        else {
            await thread.fetchFrames();
        }
    }
    updateCapabilities(capabilities) {
        Object.assign(this._capabilities, capabilities);
        this.deferredOnDidConfigureCapabilities.resolve();
    }
    get breakpointUris() {
        return this._breakpoints.keys();
    }
    getSourceBreakpoints(uri) {
        const breakpoints = [];
        for (const breakpoint of this.getBreakpoints(uri)) {
            if (breakpoint instanceof debug_source_breakpoint_1.DebugSourceBreakpoint) {
                breakpoints.push(breakpoint);
            }
        }
        return breakpoints;
    }
    getFunctionBreakpoints() {
        return this.getBreakpoints(breakpoint_manager_1.BreakpointManager.FUNCTION_URI).filter((breakpoint) => breakpoint instanceof debug_function_breakpoint_1.DebugFunctionBreakpoint);
    }
    getInstructionBreakpoints() {
        if (this.capabilities.supportsInstructionBreakpoints) {
            return this.getBreakpoints(breakpoint_manager_1.BreakpointManager.INSTRUCTION_URI)
                .filter((breakpoint) => breakpoint instanceof debug_instruction_breakpoint_1.DebugInstructionBreakpoint);
        }
        return this.breakpoints.getInstructionBreakpoints().map(origin => new debug_instruction_breakpoint_1.DebugInstructionBreakpoint(origin, this.asDebugBreakpointOptions()));
    }
    getBreakpoints(uri) {
        if (uri) {
            return this._breakpoints.get(uri.toString()) || [];
        }
        const result = [];
        for (const breakpoints of this._breakpoints.values()) {
            result.push(...breakpoints);
        }
        return result;
    }
    getBreakpoint(id) {
        for (const breakpoints of this._breakpoints.values()) {
            const breakpoint = breakpoints.find(b => b.id === id);
            if (breakpoint) {
                return breakpoint;
            }
        }
        return undefined;
    }
    clearBreakpoints() {
        const uris = [...this._breakpoints.keys()];
        this._breakpoints.clear();
        for (const uri of uris) {
            this.fireDidChangeBreakpoints(new uri_1.default(uri));
        }
    }
    updateBreakpoint(body) {
        this.updatingBreakpoints = true;
        try {
            const raw = body.breakpoint;
            if (body.reason === 'new') {
                if (raw.source && typeof raw.line === 'number') {
                    const uri = debug_source_1.DebugSource.toUri(raw.source);
                    const origin = breakpoint_marker_1.SourceBreakpoint.create(uri, { line: raw.line, column: raw.column });
                    if (this.breakpoints.addBreakpoint(origin)) {
                        const breakpoints = this.getSourceBreakpoints(uri);
                        const breakpoint = new debug_source_breakpoint_1.DebugSourceBreakpoint(origin, this.asDebugBreakpointOptions());
                        breakpoint.update({ raw });
                        breakpoints.push(breakpoint);
                        this.setSourceBreakpoints(uri, breakpoints);
                    }
                }
            }
            if (body.reason === 'removed' && raw.id) {
                const toRemove = this.findBreakpoint(b => b.idFromAdapter === raw.id);
                if (toRemove) {
                    toRemove.remove();
                    const breakpoints = this.getBreakpoints(toRemove.uri);
                    const index = breakpoints.indexOf(toRemove);
                    if (index !== -1) {
                        breakpoints.splice(index, 1);
                        this.setBreakpoints(toRemove.uri, breakpoints);
                    }
                }
            }
            if (body.reason === 'changed' && raw.id) {
                const toUpdate = this.findBreakpoint(b => b.idFromAdapter === raw.id);
                if (toUpdate) {
                    toUpdate.update({ raw });
                    if (toUpdate instanceof debug_source_breakpoint_1.DebugSourceBreakpoint) {
                        const sourceBreakpoints = this.getSourceBreakpoints(toUpdate.uri);
                        // in order to dedup again if a debugger converted line breakpoint to inline breakpoint
                        // i.e. assigned a column to a line breakpoint
                        this.setSourceBreakpoints(toUpdate.uri, sourceBreakpoints);
                    }
                    else {
                        this.fireDidChangeBreakpoints(toUpdate.uri);
                    }
                }
            }
        }
        finally {
            this.updatingBreakpoints = false;
        }
    }
    findBreakpoint(match) {
        for (const [, breakpoints] of this._breakpoints) {
            for (const breakpoint of breakpoints) {
                if (match(breakpoint)) {
                    return breakpoint;
                }
            }
        }
        return undefined;
    }
    async updateBreakpoints(options) {
        if (this.updatingBreakpoints) {
            return;
        }
        const { uri, sourceModified } = options;
        await this.deferredOnDidConfigureCapabilities.promise;
        for (const affectedUri of this.getAffectedUris(uri)) {
            if (affectedUri.toString() === breakpoint_manager_1.BreakpointManager.EXCEPTION_URI.toString()) {
                await this.sendExceptionBreakpoints();
            }
            else if (affectedUri.toString() === breakpoint_manager_1.BreakpointManager.FUNCTION_URI.toString()) {
                await this.sendFunctionBreakpoints(affectedUri);
            }
            else if (affectedUri.toString() === breakpoint_manager_1.BreakpointManager.INSTRUCTION_URI.toString()) {
                await this.sendInstructionBreakpoints();
            }
            else {
                await this.sendSourceBreakpoints(affectedUri, sourceModified);
            }
        }
    }
    async sendExceptionBreakpoints() {
        const filters = [];
        const filterOptions = this.capabilities.supportsExceptionFilterOptions ? [] : undefined;
        for (const breakpoint of this.breakpoints.getExceptionBreakpoints()) {
            if (breakpoint.enabled) {
                if (filterOptions) {
                    filterOptions.push({
                        filterId: breakpoint.raw.filter,
                        condition: breakpoint.condition
                    });
                }
                else {
                    filters.push(breakpoint.raw.filter);
                }
            }
        }
        await this.sendRequest('setExceptionBreakpoints', { filters, filterOptions });
    }
    async sendFunctionBreakpoints(affectedUri) {
        const all = this.breakpoints.getFunctionBreakpoints().map(origin => new debug_function_breakpoint_1.DebugFunctionBreakpoint(origin, this.asDebugBreakpointOptions()));
        const enabled = all.filter(b => b.enabled);
        if (this.capabilities.supportsFunctionBreakpoints) {
            try {
                const response = await this.sendRequest('setFunctionBreakpoints', {
                    breakpoints: enabled.map(b => b.origin.raw)
                });
                // Apparently, `body` and `breakpoints` can be missing.
                // https://github.com/eclipse-theia/theia/issues/11885
                // https://github.com/microsoft/vscode/blob/80004351ccf0884b58359f7c8c801c91bb827d83/src/vs/workbench/contrib/debug/browser/debugSession.ts#L448-L449
                if (response && response.body) {
                    response.body.breakpoints.forEach((raw, index) => {
                        // node debug adapter returns more breakpoints sometimes
                        if (enabled[index]) {
                            enabled[index].update({ raw });
                        }
                    });
                }
            }
            catch (error) {
                // could be error or promise rejection of DebugProtocol.SetFunctionBreakpoints
                if (error instanceof Error) {
                    console.error(`Error setting breakpoints: ${error.message}`);
                }
                else {
                    // handle adapters that send failed DebugProtocol.SetFunctionBreakpoints for invalid breakpoints
                    const genericMessage = 'Function breakpoint not valid for current debug session';
                    const message = error.message ? `${error.message}` : genericMessage;
                    console.warn(`Could not handle function breakpoints: ${message}, disabling...`);
                    enabled.forEach(b => b.update({
                        raw: {
                            verified: false,
                            message
                        }
                    }));
                }
            }
        }
        this.setBreakpoints(affectedUri, all);
    }
    async sendSourceBreakpoints(affectedUri, sourceModified) {
        const source = await this.toSource(affectedUri);
        const all = this.breakpoints.findMarkers({ uri: affectedUri }).map(({ data }) => new debug_source_breakpoint_1.DebugSourceBreakpoint(data, this.asDebugBreakpointOptions()));
        const enabled = all.filter(b => b.enabled);
        try {
            const breakpoints = enabled.map(({ origin }) => origin.raw);
            const response = await this.sendRequest('setBreakpoints', {
                source: source.raw,
                sourceModified,
                breakpoints,
                lines: breakpoints.map(({ line }) => line)
            });
            response.body.breakpoints.forEach((raw, index) => {
                // node debug adapter returns more breakpoints sometimes
                if (enabled[index]) {
                    enabled[index].update({ raw });
                }
            });
        }
        catch (error) {
            // could be error or promise rejection of DebugProtocol.SetBreakpointsResponse
            if (error instanceof Error) {
                console.error(`Error setting breakpoints: ${error.message}`);
            }
            else {
                // handle adapters that send failed DebugProtocol.SetBreakpointsResponse for invalid breakpoints
                const genericMessage = 'Breakpoint not valid for current debug session';
                const message = error.message ? `${error.message}` : genericMessage;
                console.warn(`Could not handle breakpoints for ${affectedUri}: ${message}, disabling...`);
                enabled.forEach(b => b.update({
                    raw: {
                        verified: false,
                        message
                    }
                }));
            }
        }
        this.setSourceBreakpoints(affectedUri, all);
    }
    async sendInstructionBreakpoints() {
        if (!this.capabilities.supportsInstructionBreakpoints) {
            return;
        }
        const all = this.breakpoints.getInstructionBreakpoints().map(breakpoint => new debug_instruction_breakpoint_1.DebugInstructionBreakpoint(breakpoint, this.asDebugBreakpointOptions()));
        const enabled = all.filter(breakpoint => breakpoint.enabled);
        try {
            const response = await this.sendRequest('setInstructionBreakpoints', {
                breakpoints: enabled.map(renderable => renderable.origin),
            });
            response.body.breakpoints.forEach((raw, index) => { var _a; return (_a = enabled[index]) === null || _a === void 0 ? void 0 : _a.update({ raw }); });
        }
        catch {
            enabled.forEach(breakpoint => breakpoint.update({ raw: { verified: false } }));
        }
        this.setBreakpoints(breakpoint_manager_1.BreakpointManager.INSTRUCTION_URI, all);
    }
    setBreakpoints(uri, breakpoints) {
        this._breakpoints.set(uri.toString(), breakpoints);
        this.fireDidChangeBreakpoints(uri);
    }
    setSourceBreakpoints(uri, breakpoints) {
        const distinct = this.dedupSourceBreakpoints(breakpoints);
        this.setBreakpoints(uri, distinct);
    }
    dedupSourceBreakpoints(all) {
        const positions = new Map();
        for (const breakpoint of all) {
            let primary = positions.get(breakpoint.renderPosition()) || breakpoint;
            if (primary !== breakpoint) {
                let secondary = breakpoint;
                if (secondary.raw && secondary.raw.line === secondary.origin.raw.line && secondary.raw.column === secondary.origin.raw.column) {
                    [primary, secondary] = [breakpoint, primary];
                }
                primary.origins.push(...secondary.origins);
            }
            positions.set(primary.renderPosition(), primary);
        }
        return [...positions.values()];
    }
    *getAffectedUris(uri) {
        if (uri) {
            yield uri;
        }
        else {
            for (const uriString of this.breakpoints.getUris()) {
                yield new uri_1.default(uriString);
            }
            yield breakpoint_manager_1.BreakpointManager.FUNCTION_URI;
            yield breakpoint_manager_1.BreakpointManager.EXCEPTION_URI;
        }
    }
    asDebugBreakpointOptions() {
        const { labelProvider, breakpoints, editorManager } = this;
        return { labelProvider, breakpoints, editorManager, session: this };
    }
    get label() {
        const suffixes = [];
        if (debug_session_options_1.InternalDebugSessionOptions.is(this.options) && this.options.id) {
            suffixes.push(String(this.options.id + 1));
        }
        if (this.workspaceService.isMultiRootWorkspaceOpened && this.options.workspaceFolderUri) {
            suffixes.push(this.labelProvider.getName(new uri_1.default(this.options.workspaceFolderUri)));
        }
        return suffixes.length === 0 ? this.configuration.name : this.configuration.name + ` (${suffixes.join(' - ')})`;
    }
    get visible() {
        return this.state > DebugState.Inactive;
    }
    render() {
        let label = '';
        const state = this.state === DebugState.Stopped ? core_1.nls.localizeByDefault('Paused') : core_1.nls.localizeByDefault('Running');
        const child = this.getSingleChildSession();
        if (child && child.configuration.compact) {
            // Inlines the name of the child debug session
            label = `: ${child.label}`;
        }
        return React.createElement("div", { className: 'theia-debug-session', title: 'Session' },
            React.createElement("span", { className: 'label' }, this.label + label),
            React.createElement("span", { className: 'status' }, state));
    }
    *getElements() {
        const child = this.getSingleChildSession();
        if (child && child.configuration.compact) {
            // Inlines the elements of the child debug session
            return yield* child.getElements();
        }
        yield* this.threads;
        yield* this.childSessions.values();
    }
    getSingleChildSession() {
        if (this._threads.size === 0 && this.childSessions.size === 1) {
            const child = this.childSessions.values().next().value;
            return child;
        }
        return undefined;
    }
    async handleContinued({ body: { allThreadsContinued, threadId } }) {
        if (allThreadsContinued !== false) {
            this.clearThreads();
        }
        else {
            this.clearThread(threadId);
        }
    }
    ;
    async handleStopped({ body }) {
        // Update thread list
        await this.updateThreads(body);
        // Update current thread's frames immediately
        await this.updateFrames();
    }
    ;
    async handleThread({ body: { reason, threadId } }) {
        if (reason === 'started') {
            this.scheduleUpdateThreads();
        }
        else if (reason === 'exited') {
            this._threads.delete(threadId);
            this.updateCurrentThread();
        }
    }
    ;
    registerDebugContributions(configType, connection) {
        for (const contrib of this.debugContributionProvider.getContributions()) {
            contrib.register(configType, connection);
        }
    }
    ;
    /**
     * Returns the top-most parent session that is responsible for the console. If this session uses a {@link DebugConsoleMode.Separate separate console}
     * or does not have any parent session, undefined is returned.
     */
    findConsoleParent() {
        if (this.configuration.consoleMode !== debug_common_1.DebugConsoleMode.MergeWithParent) {
            return undefined;
        }
        let debugSession = this;
        do {
            debugSession = debugSession.parentSession;
        } while ((debugSession === null || debugSession === void 0 ? void 0 : debugSession.parentSession) && debugSession.configuration.consoleMode === debug_common_1.DebugConsoleMode.MergeWithParent);
        return debugSession;
    }
}
exports.DebugSession = DebugSession;
//# sourceMappingURL=debug-session.js.map