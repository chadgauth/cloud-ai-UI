"use strict";
// *****************************************************************************
// Copyright (C) 2017 TypeFox and others.
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
exports.bindTerminalServer = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const terminal_backend_contribution_1 = require("./terminal-backend-contribution");
const messaging_1 = require("@theia/core/lib/common/messaging");
const shell_process_1 = require("./shell-process");
const terminal_protocol_1 = require("../common/terminal-protocol");
const base_terminal_protocol_1 = require("../common/base-terminal-protocol");
const terminal_server_1 = require("./terminal-server");
const shell_terminal_protocol_1 = require("../common/shell-terminal-protocol");
const shell_terminal_server_1 = require("../node/shell-terminal-server");
const terminal_watcher_1 = require("../common/terminal-watcher");
const terminal_common_module_1 = require("../common/terminal-common-module");
const messaging_service_1 = require("@theia/core/lib/node/messaging/messaging-service");
function bindTerminalServer(bind, { path, identifier, constructor }) {
    const dispatchingClient = new base_terminal_protocol_1.DispatchingBaseTerminalClient();
    bind(identifier).to(constructor).inSingletonScope().onActivation((context, terminalServer) => {
        terminalServer.setClient(dispatchingClient);
        dispatchingClient.push(context.container.get(terminal_watcher_1.TerminalWatcher).getTerminalClient());
        terminalServer.setClient = () => {
            throw new Error('use TerminalWatcher');
        };
        return terminalServer;
    });
    bind(messaging_1.ConnectionHandler).toDynamicValue(ctx => new messaging_1.RpcConnectionHandler(path, client => {
        const disposable = dispatchingClient.push(client);
        client.onDidCloseConnection(() => disposable.dispose());
        return ctx.container.get(identifier);
    })).inSingletonScope();
}
exports.bindTerminalServer = bindTerminalServer;
exports.default = new inversify_1.ContainerModule(bind => {
    bind(messaging_service_1.MessagingService.Contribution).to(terminal_backend_contribution_1.TerminalBackendContribution).inSingletonScope();
    bind(shell_process_1.ShellProcess).toSelf().inTransientScope();
    bind(shell_process_1.ShellProcessFactory).toFactory(ctx => (options) => {
        const child = new inversify_1.Container({ defaultScope: 'Singleton' });
        child.parent = ctx.container;
        child.bind(shell_process_1.ShellProcessOptions).toConstantValue(options);
        return child.get(shell_process_1.ShellProcess);
    });
    bind(terminal_watcher_1.TerminalWatcher).toSelf().inSingletonScope();
    bindTerminalServer(bind, {
        path: terminal_protocol_1.terminalPath,
        identifier: terminal_protocol_1.ITerminalServer,
        constructor: terminal_server_1.TerminalServer
    });
    bindTerminalServer(bind, {
        path: shell_terminal_protocol_1.shellTerminalPath,
        identifier: shell_terminal_protocol_1.IShellTerminalServer,
        constructor: shell_terminal_server_1.ShellTerminalServer
    });
    (0, terminal_common_module_1.createCommonBindings)(bind);
});
//# sourceMappingURL=terminal-backend-module.js.map