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
exports.DebugMainImpl = void 0;
const plugin_api_rpc_1 = require("../../../common/plugin-api-rpc");
const debug_session_manager_1 = require("@theia/debug/lib/browser/debug-session-manager");
const browser_1 = require("@theia/core/lib/browser");
const browser_2 = require("@theia/editor/lib/browser");
const breakpoint_manager_1 = require("@theia/debug/lib/browser/breakpoint/breakpoint-manager");
const debug_source_breakpoint_1 = require("@theia/debug/lib/browser/model/debug-source-breakpoint");
const vscode_uri_1 = require("@theia/core/shared/vscode-uri");
const debug_configuration_manager_1 = require("@theia/debug/lib/browser/debug-configuration-manager");
const terminal_service_1 = require("@theia/terminal/lib/browser/base/terminal-service");
const message_service_protocol_1 = require("@theia/core/lib/common/message-service-protocol");
const output_channel_1 = require("@theia/output/lib/browser/output-channel");
const debug_preferences_1 = require("@theia/debug/lib/browser/debug-preferences");
const plugin_debug_adapter_contribution_1 = require("./plugin-debug-adapter-contribution");
const plugin_debug_configuration_provider_1 = require("./plugin-debug-configuration-provider");
const plugin_debug_session_contribution_registry_1 = require("./plugin-debug-session-contribution-registry");
const disposable_1 = require("@theia/core/lib/common/disposable");
const plugin_debug_session_factory_1 = require("./plugin-debug-session-factory");
const plugin_debug_service_1 = require("./plugin-debug-service");
const hosted_plugin_1 = require("../../../hosted/browser/hosted-plugin");
const debug_function_breakpoint_1 = require("@theia/debug/lib/browser/model/debug-function-breakpoint");
const file_service_1 = require("@theia/filesystem/lib/browser/file-service");
const console_session_manager_1 = require("@theia/console/lib/browser/console-session-manager");
const debug_console_session_1 = require("@theia/debug/lib/browser/console/debug-console-session");
const common_1 = require("@theia/core/lib/common");
const debug_contribution_1 = require("@theia/debug/lib/browser/debug-contribution");
const browser_3 = require("@theia/workspace/lib/browser");
const debug_session_options_1 = require("@theia/debug/lib/browser/debug-session-options");
class DebugMainImpl {
    constructor(rpc, connectionMain, container) {
        this.connectionMain = connectionMain;
        this.debuggerContributions = new Map();
        this.configurationProviders = new Map();
        this.toDispose = new disposable_1.DisposableCollection();
        this.debugExt = rpc.getProxy(plugin_api_rpc_1.MAIN_RPC_CONTEXT.DEBUG_EXT);
        this.sessionManager = container.get(debug_session_manager_1.DebugSessionManager);
        this.labelProvider = container.get(browser_1.LabelProvider);
        this.editorManager = container.get(browser_2.EditorManager);
        this.breakpointsManager = container.get(breakpoint_manager_1.BreakpointManager);
        this.consoleSessionManager = container.get(console_session_manager_1.ConsoleSessionManager);
        this.configurationManager = container.get(debug_configuration_manager_1.DebugConfigurationManager);
        this.terminalService = container.get(terminal_service_1.TerminalService);
        this.messages = container.get(message_service_protocol_1.MessageClient);
        this.outputChannelManager = container.get(output_channel_1.OutputChannelManager);
        this.debugPreferences = container.get(debug_preferences_1.DebugPreferences);
        this.pluginDebugService = container.get(plugin_debug_service_1.PluginDebugService);
        this.sessionContributionRegistrator = container.get(plugin_debug_session_contribution_registry_1.PluginDebugSessionContributionRegistry);
        this.debugContributionProvider = container.getNamed(common_1.ContributionProvider, debug_contribution_1.DebugContribution);
        this.fileService = container.get(file_service_1.FileService);
        this.pluginService = container.get(hosted_plugin_1.HostedPluginSupport);
        this.workspaceService = container.get(browser_3.WorkspaceService);
        const fireDidChangeBreakpoints = ({ added, removed, changed }) => {
            this.debugExt.$breakpointsDidChange(this.toTheiaPluginApiBreakpoints(added), removed.map(b => b.id), this.toTheiaPluginApiBreakpoints(changed));
        };
        this.debugExt.$breakpointsDidChange(this.toTheiaPluginApiBreakpoints(this.breakpointsManager.getBreakpoints()), [], []);
        this.debugExt.$breakpointsDidChange(this.toTheiaPluginApiBreakpoints(this.breakpointsManager.getFunctionBreakpoints()), [], []);
        this.toDispose.pushAll([
            this.breakpointsManager.onDidChangeBreakpoints(fireDidChangeBreakpoints),
            this.breakpointsManager.onDidChangeFunctionBreakpoints(fireDidChangeBreakpoints),
            this.sessionManager.onDidCreateDebugSession(debugSession => this.debugExt.$sessionDidCreate(debugSession.id)),
            this.sessionManager.onDidStartDebugSession(debugSession => this.debugExt.$sessionDidStart(debugSession.id)),
            this.sessionManager.onDidDestroyDebugSession(debugSession => this.debugExt.$sessionDidDestroy(debugSession.id)),
            this.sessionManager.onDidChangeActiveDebugSession(event => this.debugExt.$sessionDidChange(event.current && event.current.id)),
            this.sessionManager.onDidReceiveDebugSessionCustomEvent(event => this.debugExt.$onSessionCustomEvent(event.session.id, event.event, event.body))
        ]);
    }
    dispose() {
        this.toDispose.dispose();
    }
    async $appendToDebugConsole(value) {
        const session = this.consoleSessionManager.selectedSession;
        if (session instanceof debug_console_session_1.DebugConsoleSession) {
            session.append(value);
        }
    }
    async $appendLineToDebugConsole(value) {
        const session = this.consoleSessionManager.selectedSession;
        if (session instanceof debug_console_session_1.DebugConsoleSession) {
            session.appendLine(value);
        }
    }
    async $registerDebuggerContribution(description) {
        const debugType = description.type;
        const terminalOptionsExt = await this.debugExt.$getTerminalCreationOptions(debugType);
        if (this.toDispose.disposed) {
            return;
        }
        const debugSessionFactory = new plugin_debug_session_factory_1.PluginDebugSessionFactory(this.terminalService, this.editorManager, this.breakpointsManager, this.labelProvider, this.messages, this.outputChannelManager, this.debugPreferences, async (sessionId) => {
            const connection = await this.connectionMain.ensureConnection(sessionId);
            return connection;
        }, this.fileService, terminalOptionsExt, this.debugContributionProvider, this.workspaceService);
        const toDispose = new disposable_1.DisposableCollection(disposable_1.Disposable.create(() => this.debuggerContributions.delete(debugType)));
        this.debuggerContributions.set(debugType, toDispose);
        toDispose.pushAll([
            this.pluginDebugService.registerDebugAdapterContribution(new plugin_debug_adapter_contribution_1.PluginDebugAdapterContribution(description, this.debugExt, this.pluginService)),
            this.sessionContributionRegistrator.registerDebugSessionContribution({
                debugType: description.type,
                debugSessionFactory: () => debugSessionFactory
            })
        ]);
        this.toDispose.push(disposable_1.Disposable.create(() => this.$unregisterDebuggerConfiguration(debugType)));
    }
    async $unregisterDebuggerConfiguration(debugType) {
        const disposable = this.debuggerContributions.get(debugType);
        if (disposable) {
            disposable.dispose();
        }
    }
    $registerDebugConfigurationProvider(description) {
        const handle = description.handle;
        const toDispose = new disposable_1.DisposableCollection(disposable_1.Disposable.create(() => this.configurationProviders.delete(handle)));
        this.configurationProviders.set(handle, toDispose);
        toDispose.push(this.pluginDebugService.registerDebugConfigurationProvider(new plugin_debug_configuration_provider_1.PluginDebugConfigurationProvider(description, this.debugExt)));
        this.toDispose.push(disposable_1.Disposable.create(() => this.$unregisterDebugConfigurationProvider(handle)));
    }
    async $unregisterDebugConfigurationProvider(handle) {
        const disposable = this.configurationProviders.get(handle);
        if (disposable) {
            disposable.dispose();
        }
    }
    async $addBreakpoints(breakpoints) {
        const newBreakpoints = new Map();
        breakpoints.forEach(b => newBreakpoints.set(b.id, b));
        this.breakpointsManager.findMarkers({
            dataFilter: data => {
                // install only new breakpoints
                if (newBreakpoints.has(data.id)) {
                    newBreakpoints.delete(data.id);
                }
                return false;
            }
        });
        let addedFunctionBreakpoints = false;
        const functionBreakpoints = this.breakpointsManager.getFunctionBreakpoints();
        for (const breakpoint of functionBreakpoints) {
            // install only new breakpoints
            if (newBreakpoints.has(breakpoint.id)) {
                newBreakpoints.delete(breakpoint.id);
            }
        }
        for (const breakpoint of newBreakpoints.values()) {
            if (breakpoint.location) {
                const location = breakpoint.location;
                const column = breakpoint.location.range.startColumn;
                this.breakpointsManager.addBreakpoint({
                    id: breakpoint.id,
                    uri: vscode_uri_1.URI.revive(location.uri).toString(),
                    enabled: breakpoint.enabled,
                    raw: {
                        line: breakpoint.location.range.startLineNumber + 1,
                        column: column > 0 ? column + 1 : undefined,
                        condition: breakpoint.condition,
                        hitCondition: breakpoint.hitCondition,
                        logMessage: breakpoint.logMessage
                    }
                });
            }
            else if (breakpoint.functionName) {
                addedFunctionBreakpoints = true;
                functionBreakpoints.push({
                    id: breakpoint.id,
                    enabled: breakpoint.enabled,
                    raw: {
                        name: breakpoint.functionName
                    }
                });
            }
        }
        if (addedFunctionBreakpoints) {
            this.breakpointsManager.setFunctionBreakpoints(functionBreakpoints);
        }
    }
    async $getDebugProtocolBreakpoint(sessionId, breakpointId) {
        var _a;
        const session = this.sessionManager.getSession(sessionId);
        if (session) {
            return (_a = session.getBreakpoint(breakpointId)) === null || _a === void 0 ? void 0 : _a.raw;
        }
        else {
            throw new Error(`Debug session '${sessionId}' not found`);
        }
    }
    async $removeBreakpoints(breakpoints) {
        const { labelProvider, breakpointsManager, editorManager } = this;
        const session = this.sessionManager.currentSession;
        const ids = new Set(breakpoints);
        for (const origin of this.breakpointsManager.findMarkers({ dataFilter: data => ids.has(data.id) })) {
            const breakpoint = new debug_source_breakpoint_1.DebugSourceBreakpoint(origin.data, { labelProvider, breakpoints: breakpointsManager, editorManager, session });
            breakpoint.remove();
        }
        for (const origin of this.breakpointsManager.getFunctionBreakpoints()) {
            if (ids.has(origin.id)) {
                const breakpoint = new debug_function_breakpoint_1.DebugFunctionBreakpoint(origin, { labelProvider, breakpoints: breakpointsManager, editorManager, session });
                breakpoint.remove();
            }
        }
    }
    async $customRequest(sessionId, command, args) {
        const session = this.sessionManager.getSession(sessionId);
        if (session) {
            return session.sendCustomRequest(command, args);
        }
        throw new Error(`Debug session '${sessionId}' not found`);
    }
    async $startDebugging(folder, nameOrConfiguration, options) {
        // search for matching options
        let sessionOptions;
        if (typeof nameOrConfiguration === 'string') {
            for (const configOptions of this.configurationManager.all) {
                if (configOptions.name === nameOrConfiguration) {
                    sessionOptions = configOptions;
                }
            }
        }
        else {
            sessionOptions = {
                name: nameOrConfiguration.name,
                configuration: nameOrConfiguration
            };
        }
        if (!sessionOptions) {
            console.error(`There is no debug configuration for ${nameOrConfiguration}`);
            return false;
        }
        // translate given extra data
        const workspaceFolderUri = folder && vscode_uri_1.URI.revive(folder.uri).toString();
        if (debug_session_options_1.DebugSessionOptions.isConfiguration(sessionOptions)) {
            sessionOptions = { ...sessionOptions, configuration: { ...sessionOptions.configuration, ...options }, workspaceFolderUri };
        }
        else {
            sessionOptions = { ...sessionOptions, ...options, workspaceFolderUri };
        }
        // start options
        const session = await this.sessionManager.start(sessionOptions);
        return !!session;
    }
    async $stopDebugging(sessionId) {
        if (sessionId) {
            const session = this.sessionManager.getSession(sessionId);
            return this.sessionManager.terminateSession(session);
        }
        // Terminate all sessions if no session is provided.
        for (const session of this.sessionManager.sessions) {
            this.sessionManager.terminateSession(session);
        }
    }
    toTheiaPluginApiBreakpoints(breakpoints) {
        return breakpoints.map(b => this.toTheiaPluginApiBreakpoint(b));
    }
    toTheiaPluginApiBreakpoint(breakpoint) {
        if ('uri' in breakpoint) {
            const raw = breakpoint.raw;
            return {
                id: breakpoint.id,
                enabled: breakpoint.enabled,
                condition: breakpoint.raw.condition,
                hitCondition: breakpoint.raw.hitCondition,
                logMessage: raw.logMessage,
                location: {
                    uri: vscode_uri_1.URI.parse(breakpoint.uri),
                    range: {
                        startLineNumber: raw.line - 1,
                        startColumn: (raw.column || 1) - 1,
                        endLineNumber: raw.line - 1,
                        endColumn: (raw.column || 1) - 1
                    }
                }
            };
        }
        return {
            id: breakpoint.id,
            enabled: breakpoint.enabled,
            functionName: breakpoint.raw.name
        };
    }
}
exports.DebugMainImpl = DebugMainImpl;
//# sourceMappingURL=debug-main.js.map