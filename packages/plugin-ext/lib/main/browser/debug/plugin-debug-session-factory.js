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
exports.PluginDebugSessionFactory = exports.PluginDebugSession = void 0;
const debug_session_contribution_1 = require("@theia/debug/lib/browser/debug-session-contribution");
const debug_session_1 = require("@theia/debug/lib/browser/debug-session");
const debug_session_connection_1 = require("@theia/debug/lib/browser/debug-session-connection");
class PluginDebugSession extends debug_session_1.DebugSession {
    constructor(id, options, parentSession, connection, terminalServer, editorManager, breakpoints, labelProvider, messages, fileService, terminalOptionsExt, debugContributionProvider, workspaceService) {
        super(id, options, parentSession, connection, terminalServer, editorManager, breakpoints, labelProvider, messages, fileService, debugContributionProvider, workspaceService);
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
        this.terminalOptionsExt = terminalOptionsExt;
        this.debugContributionProvider = debugContributionProvider;
        this.workspaceService = workspaceService;
    }
    async doCreateTerminal(terminalWidgetOptions) {
        terminalWidgetOptions = Object.assign({}, terminalWidgetOptions, this.terminalOptionsExt);
        return super.doCreateTerminal(terminalWidgetOptions);
    }
}
exports.PluginDebugSession = PluginDebugSession;
/**
 * Session factory for a client debug session that communicates with debug adapter contributed as plugin.
 * The main difference is to use a connection factory that creates [Channel](#Channel) over Rpc channel.
 */
class PluginDebugSessionFactory extends debug_session_contribution_1.DefaultDebugSessionFactory {
    constructor(terminalService, editorManager, breakpoints, labelProvider, messages, outputChannelManager, debugPreferences, connectionFactory, fileService, terminalOptionsExt, debugContributionProvider, workspaceService) {
        super();
        this.terminalService = terminalService;
        this.editorManager = editorManager;
        this.breakpoints = breakpoints;
        this.labelProvider = labelProvider;
        this.messages = messages;
        this.outputChannelManager = outputChannelManager;
        this.debugPreferences = debugPreferences;
        this.connectionFactory = connectionFactory;
        this.fileService = fileService;
        this.terminalOptionsExt = terminalOptionsExt;
        this.debugContributionProvider = debugContributionProvider;
        this.workspaceService = workspaceService;
    }
    get(sessionId, options, parentSession) {
        const connection = new debug_session_connection_1.DebugSessionConnection(sessionId, this.connectionFactory, this.getTraceOutputChannel());
        return new PluginDebugSession(sessionId, options, parentSession, connection, this.terminalService, this.editorManager, this.breakpoints, this.labelProvider, this.messages, this.fileService, this.terminalOptionsExt, this.debugContributionProvider, this.workspaceService);
    }
}
exports.PluginDebugSessionFactory = PluginDebugSessionFactory;
//# sourceMappingURL=plugin-debug-session-factory.js.map