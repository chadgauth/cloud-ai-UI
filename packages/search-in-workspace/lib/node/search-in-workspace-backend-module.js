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
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("@theia/core/shared/inversify");
const common_1 = require("@theia/core/lib/common");
const search_in_workspace_interface_1 = require("../common/search-in-workspace-interface");
const ripgrep_search_in_workspace_server_1 = require("./ripgrep-search-in-workspace-server");
const ripgrep_1 = require("@vscode/ripgrep");
exports.default = new inversify_1.ContainerModule(bind => {
    bind(search_in_workspace_interface_1.SearchInWorkspaceServer).to(ripgrep_search_in_workspace_server_1.RipgrepSearchInWorkspaceServer);
    bind(common_1.ConnectionHandler).toDynamicValue(ctx => new common_1.RpcConnectionHandler(search_in_workspace_interface_1.SIW_WS_PATH, client => {
        const server = ctx.container.get(search_in_workspace_interface_1.SearchInWorkspaceServer);
        server.setClient(client);
        client.onDidCloseConnection(() => server.dispose());
        return server;
    }));
    bind(ripgrep_search_in_workspace_server_1.RgPath).toConstantValue(ripgrep_1.rgPath);
});
//# sourceMappingURL=search-in-workspace-backend-module.js.map