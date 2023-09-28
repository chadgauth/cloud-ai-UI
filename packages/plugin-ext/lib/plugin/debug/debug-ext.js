"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebugExtImpl = void 0;
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
const event_1 = require("@theia/core/lib/common/event");
const path_1 = require("@theia/core/lib/common/path");
const vscode_uri_1 = require("@theia/core/shared/vscode-uri");
const plugin_api_rpc_1 = require("../../common/plugin-api-rpc");
const debug_uri_utils_1 = require("@theia/debug/lib/common/debug-uri-utils");
const types_impl_1 = require("../types-impl");
const plugin_debug_adapter_session_1 = require("./plugin-debug-adapter-session");
const plugin_debug_adapter_tracker_1 = require("./plugin-debug-adapter-tracker");
const uuid = require("uuid");
const plugin_debug_adapter_creator_1 = require("./plugin-debug-adapter-creator");
const plugin_node_debug_adapter_creator_1 = require("../node/debug/plugin-node-debug-adapter-creator");
/* eslint-disable @typescript-eslint/no-explicit-any */
class DebugExtImpl {
    constructor(rpc) {
        // debug sessions by sessionId
        this.sessions = new Map();
        /**
         * Only use internally, don't send it to the frontend. It's expensive!
         * It's already there as a part of the plugin metadata.
         */
        this.debuggersContributions = new Map();
        this.descriptorFactories = new Map();
        this.trackerFactories = [];
        this.contributionPaths = new Map();
        this.contributionTypes = new Map();
        this.onDidChangeBreakpointsEmitter = new event_1.Emitter();
        this.onDidChangeActiveDebugSessionEmitter = new event_1.Emitter();
        this.onDidTerminateDebugSessionEmitter = new event_1.Emitter();
        this.onDidCreateDebugSessionEmitter = new event_1.Emitter();
        this.onDidStartDebugSessionEmitter = new event_1.Emitter();
        this.onDidReceiveDebugSessionCustomEmitter = new event_1.Emitter();
        this._breakpoints = new Map();
        this.frontendAdapterCreator = new plugin_debug_adapter_creator_1.PluginDebugAdapterCreator();
        this.backendAdapterCreator = new plugin_node_debug_adapter_creator_1.NodeDebugAdapterCreator();
        this.proxy = rpc.getProxy(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.DEBUG_MAIN);
        this.activeDebugConsole = {
            append: (value) => this.proxy.$appendToDebugConsole(value),
            appendLine: (value) => this.proxy.$appendLineToDebugConsole(value)
        };
        this.configurationProviderHandleGenerator = 0;
        this.configurationProviders = [];
    }
    get breakpoints() {
        return [...this._breakpoints.values()];
    }
    /**
     * Sets dependencies.
     */
    assistedInject(connectionExt, commandRegistryExt) {
        this.connectionExt = connectionExt;
        this.commandRegistryExt = commandRegistryExt;
    }
    /**
     * Registers contributions.
     * @param pluginFolder plugin folder path
     * @param pluginType plugin type
     * @param contributions available debuggers contributions
     */
    registerDebuggersContributions(pluginFolder, pluginType, contributions) {
        contributions.forEach(contribution => {
            this.contributionPaths.set(contribution.type, pluginFolder);
            this.contributionTypes.set(contribution.type, pluginType);
            this.debuggersContributions.set(contribution.type, contribution);
            this.proxy.$registerDebuggerContribution({
                type: contribution.type,
                label: contribution.label || contribution.type
            });
            console.log(`Debugger contribution has been registered: ${contribution.type}`);
        });
    }
    get onDidReceiveDebugSessionCustomEvent() {
        return this.onDidReceiveDebugSessionCustomEmitter.event;
    }
    get onDidChangeActiveDebugSession() {
        return this.onDidChangeActiveDebugSessionEmitter.event;
    }
    get onDidTerminateDebugSession() {
        return this.onDidTerminateDebugSessionEmitter.event;
    }
    get onDidCreateDebugSession() {
        return this.onDidCreateDebugSessionEmitter.event;
    }
    get onDidStartDebugSession() {
        return this.onDidStartDebugSessionEmitter.event;
    }
    get onDidChangeBreakpoints() {
        return this.onDidChangeBreakpointsEmitter.event;
    }
    addBreakpoints(breakpoints) {
        const added = [];
        for (const b of breakpoints) {
            if (this._breakpoints.has(b.id)) {
                continue;
            }
            this._breakpoints.set(b.id, b);
            added.push(b);
        }
        if (added.length) {
            this.onDidChangeBreakpointsEmitter.fire({ added, removed: [], changed: [] });
            this.proxy.$addBreakpoints(added);
        }
    }
    removeBreakpoints(breakpoints) {
        const removed = [];
        const removedIds = [];
        for (const b of breakpoints) {
            if (!this._breakpoints.has(b.id)) {
                continue;
            }
            this._breakpoints.delete(b.id);
            removed.push(b);
            removedIds.push(b.id);
        }
        if (removed.length) {
            this.onDidChangeBreakpointsEmitter.fire({ added: [], removed, changed: [] });
            this.proxy.$removeBreakpoints(removedIds);
        }
    }
    startDebugging(folder, nameOrConfiguration, options) {
        var _a;
        return this.proxy.$startDebugging(folder, nameOrConfiguration, {
            parentSessionId: (_a = options.parentSession) === null || _a === void 0 ? void 0 : _a.id,
            compact: options.compact,
            consoleMode: options.consoleMode,
            suppressSaveBeforeStart: options.suppressSaveBeforeStart,
            suppressDebugStatusbar: options.suppressDebugStatusbar,
            suppressDebugView: options.suppressDebugView,
            lifecycleManagedByParent: options.lifecycleManagedByParent,
            noDebug: options.noDebug
        });
    }
    stopDebugging(session) {
        return this.proxy.$stopDebugging(session === null || session === void 0 ? void 0 : session.id);
    }
    asDebugSourceUri(source, session) {
        return this.getDebugSourceUri(source, session === null || session === void 0 ? void 0 : session.id);
    }
    getDebugSourceUri(raw, sessionId) {
        var _a;
        if (raw.sourceReference && raw.sourceReference > 0) {
            let query = 'ref=' + String(raw.sourceReference);
            if (sessionId) {
                query += `&session=${sessionId}`;
            }
            return types_impl_1.URI.from({ scheme: debug_uri_utils_1.DEBUG_SCHEME, path: (_a = raw.path) !== null && _a !== void 0 ? _a : '', query });
        }
        if (!raw.path) {
            throw new Error('Unrecognized source type: ' + JSON.stringify(raw));
        }
        if (raw.path.match(debug_uri_utils_1.SCHEME_PATTERN)) {
            return types_impl_1.URI.parse(raw.path);
        }
        return types_impl_1.URI.file(raw.path);
    }
    registerDebugAdapterDescriptorFactory(debugType, factory) {
        if (this.descriptorFactories.has(debugType)) {
            throw new Error(`Descriptor factory for ${debugType} has been already registered`);
        }
        this.descriptorFactories.set(debugType, factory);
        return types_impl_1.Disposable.create(() => this.descriptorFactories.delete(debugType));
    }
    registerDebugAdapterTrackerFactory(debugType, factory) {
        if (!factory) {
            return types_impl_1.Disposable.create(() => { });
        }
        this.trackerFactories.push([debugType, factory]);
        return types_impl_1.Disposable.create(() => {
            this.trackerFactories = this.trackerFactories.filter(tuple => tuple[1] !== factory);
        });
    }
    registerDebugConfigurationProvider(debugType, provider, trigger) {
        console.log(`Debug configuration provider has been registered: ${debugType}, trigger: ${trigger}`);
        const handle = this.configurationProviderHandleGenerator++;
        this.configurationProviders.push({ handle, type: debugType, trigger, provider });
        const descriptor = {
            handle,
            type: debugType,
            trigger,
            provideDebugConfiguration: !!provider.provideDebugConfigurations,
            resolveDebugConfigurations: !!provider.resolveDebugConfiguration,
            resolveDebugConfigurationWithSubstitutedVariables: !!provider.resolveDebugConfigurationWithSubstitutedVariables
        };
        this.proxy.$registerDebugConfigurationProvider(descriptor);
        return types_impl_1.Disposable.create(() => {
            this.configurationProviders = this.configurationProviders.filter(p => (p.handle !== handle));
            this.proxy.$unregisterDebugConfigurationProvider(handle);
        });
    }
    async $onSessionCustomEvent(sessionId, event, body) {
        const session = this.sessions.get(sessionId);
        if (session) {
            this.onDidReceiveDebugSessionCustomEmitter.fire({ event, body, session });
        }
    }
    async $sessionDidCreate(sessionId) {
        const session = this.sessions.get(sessionId);
        if (session) {
            this.onDidCreateDebugSessionEmitter.fire(session);
        }
    }
    async $sessionDidStart(sessionId) {
        const session = this.sessions.get(sessionId);
        if (session) {
            this.onDidStartDebugSessionEmitter.fire(session);
        }
    }
    async $sessionDidDestroy(sessionId) {
        const session = this.sessions.get(sessionId);
        if (session) {
            this.onDidTerminateDebugSessionEmitter.fire(session);
            this.sessions.delete(sessionId);
        }
    }
    async $sessionDidChange(sessionId) {
        this.activeDebugSession = sessionId ? this.sessions.get(sessionId) : undefined;
        this.onDidChangeActiveDebugSessionEmitter.fire(this.activeDebugSession);
    }
    async $breakpointsDidChange(added, removed, changed) {
        const a = [];
        const r = [];
        const c = [];
        for (const b of added) {
            if (this._breakpoints.has(b.id)) {
                continue;
            }
            const bExt = this.toBreakpointExt(b);
            if (bExt) {
                this._breakpoints.set(bExt.id, bExt);
                a.push(bExt);
            }
        }
        for (const id of removed) {
            const bExt = this._breakpoints.get(id);
            if (bExt) {
                this._breakpoints.delete(id);
                r.push(bExt);
            }
        }
        for (const b of changed) {
            const bExt = this._breakpoints.get(b.id);
            if (bExt) {
                const { functionName, location, enabled, condition, hitCondition, logMessage } = b;
                if (bExt instanceof types_impl_1.FunctionBreakpoint && functionName) {
                    Object.assign(bExt, { enabled, condition, hitCondition, logMessage, functionName });
                }
                else if (bExt instanceof types_impl_1.SourceBreakpoint && location) {
                    const range = new types_impl_1.Range(location.range.startLineNumber, location.range.startColumn, location.range.endLineNumber, location.range.endColumn);
                    Object.assign(bExt, { enabled, condition, hitCondition, logMessage, location: new types_impl_1.Location(vscode_uri_1.URI.revive(location.uri), range) });
                }
                c.push(bExt);
            }
        }
        this.onDidChangeBreakpointsEmitter.fire({ added: a, removed: r, changed: c });
    }
    toBreakpointExt({ functionName, location, enabled, condition, hitCondition, logMessage, id }) {
        if (location) {
            const range = new types_impl_1.Range(location.range.startLineNumber, location.range.startColumn, location.range.endLineNumber, location.range.endColumn);
            return new types_impl_1.SourceBreakpoint(new types_impl_1.Location(vscode_uri_1.URI.revive(location.uri), range), enabled, condition, hitCondition, logMessage, id);
        }
        if (functionName) {
            return new types_impl_1.FunctionBreakpoint(functionName, enabled, condition, hitCondition, logMessage, id);
        }
        return undefined;
    }
    async $createDebugSession(debugConfiguration, workspaceFolderUri) {
        const sessionId = uuid.v4();
        const parentSession = debugConfiguration.parentSessionId ? this.sessions.get(debugConfiguration.parentSessionId) : undefined;
        const theiaSession = {
            id: sessionId,
            type: debugConfiguration.type,
            name: debugConfiguration.name,
            parentSession: parentSession,
            workspaceFolder: this.toWorkspaceFolder(workspaceFolderUri),
            configuration: debugConfiguration,
            customRequest: async (command, args) => {
                var _a;
                const response = await this.proxy.$customRequest(sessionId, command, args);
                if (response && response.success) {
                    return response.body;
                }
                return Promise.reject(new Error((_a = response.message) !== null && _a !== void 0 ? _a : 'custom request failed'));
            },
            getDebugProtocolBreakpoint: async (breakpoint) => this.proxy.$getDebugProtocolBreakpoint(sessionId, breakpoint.id)
        };
        const tracker = await this.createDebugAdapterTracker(theiaSession);
        const communicationProvider = await this.createDebugAdapter(theiaSession, debugConfiguration);
        const debugAdapterSession = new plugin_debug_adapter_session_1.PluginDebugAdapterSession(communicationProvider, tracker, theiaSession);
        this.sessions.set(sessionId, debugAdapterSession);
        const connection = await this.connectionExt.ensureConnection(sessionId);
        debugAdapterSession.start(connection);
        return sessionId;
    }
    async $terminateDebugSession(sessionId) {
        const debugAdapterSession = this.sessions.get(sessionId);
        if (debugAdapterSession) {
            await debugAdapterSession.stop();
        }
    }
    async $getTerminalCreationOptions(debugType) {
        return this.doGetTerminalCreationOptions(debugType);
    }
    async doGetTerminalCreationOptions(debugType) {
        return undefined;
    }
    getConfigurationProviderRecord(handle) {
        const record = this.configurationProviders.find(p => p.handle === handle);
        if (!record) {
            throw new Error('No Debug configuration provider found with given handle number: ' + handle);
        }
        const { provider, type } = record;
        return { provider, type };
    }
    async $provideDebugConfigurationsByHandle(handle, workspaceFolderUri) {
        var _a;
        const { provider, type } = this.getConfigurationProviderRecord(handle);
        const configurations = await ((_a = provider.provideDebugConfigurations) === null || _a === void 0 ? void 0 : _a.call(provider, this.toWorkspaceFolder(workspaceFolderUri)));
        if (!configurations) {
            throw new Error('nothing returned from DebugConfigurationProvider.provideDebugConfigurations, type: ' + type);
        }
        return configurations;
    }
    async $resolveDebugConfigurationByHandle(handle, workspaceFolderUri, debugConfiguration) {
        var _a;
        const { provider } = this.getConfigurationProviderRecord(handle);
        return (_a = provider.resolveDebugConfiguration) === null || _a === void 0 ? void 0 : _a.call(provider, this.toWorkspaceFolder(workspaceFolderUri), debugConfiguration);
    }
    async $resolveDebugConfigurationWithSubstitutedVariablesByHandle(handle, workspaceFolderUri, debugConfiguration) {
        var _a;
        const { provider } = this.getConfigurationProviderRecord(handle);
        return (_a = provider.resolveDebugConfigurationWithSubstitutedVariables) === null || _a === void 0 ? void 0 : _a.call(provider, this.toWorkspaceFolder(workspaceFolderUri), debugConfiguration);
    }
    async createDebugAdapterTracker(session) {
        return plugin_debug_adapter_tracker_1.PluginDebugAdapterTracker.create(session, this.trackerFactories);
    }
    async createDebugAdapter(session, debugConfiguration) {
        const executable = await this.resolveDebugAdapterExecutable(debugConfiguration);
        const descriptorFactory = this.descriptorFactories.get(session.type);
        return this.getAdapterCreator(debugConfiguration).createDebugAdapter(session, debugConfiguration, executable, descriptorFactory);
    }
    async resolveDebugAdapterExecutable(debugConfiguration) {
        const { type } = debugConfiguration;
        const contribution = this.debuggersContributions.get(type);
        if (contribution) {
            if (contribution.adapterExecutableCommand) {
                const executable = await this.commandRegistryExt.executeCommand(contribution.adapterExecutableCommand);
                if (executable) {
                    return executable;
                }
            }
            else {
                const contributionPath = this.contributionPaths.get(type);
                if (contributionPath) {
                    return this.getAdapterCreator(debugConfiguration).resolveDebugAdapterExecutable(contributionPath, contribution);
                }
            }
        }
        throw new Error(`It is not possible to provide debug adapter executable for '${debugConfiguration.type}'.`);
    }
    toWorkspaceFolder(folder) {
        if (!folder) {
            return undefined;
        }
        const uri = vscode_uri_1.URI.parse(folder);
        const path = new path_1.Path(uri.path);
        return {
            uri: uri,
            name: path.base,
            index: 0
        };
    }
    getAdapterCreator(debugConfiguration) {
        const pluginType = this.contributionTypes.get(debugConfiguration.type);
        return pluginType === 'frontend' ? this.frontendAdapterCreator : this.backendAdapterCreator;
    }
}
exports.DebugExtImpl = DebugExtImpl;
//# sourceMappingURL=debug-ext.js.map