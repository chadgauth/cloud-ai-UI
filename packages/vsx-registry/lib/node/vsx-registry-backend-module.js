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
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@theia/core");
const node_1 = require("@theia/core/lib/node");
const inversify_1 = require("@theia/core/shared/inversify");
const plugin_protocol_1 = require("@theia/plugin-ext/lib/common/plugin-protocol");
const vsx_environment_1 = require("../common/vsx-environment");
const vsx_cli_1 = require("./vsx-cli");
const vsx_environment_impl_1 = require("./vsx-environment-impl");
const vsx_extension_resolver_1 = require("./vsx-extension-resolver");
exports.default = new inversify_1.ContainerModule(bind => {
    bind(vsx_environment_1.VSXEnvironment).to(vsx_environment_impl_1.VSXEnvironmentImpl).inSingletonScope();
    bind(vsx_cli_1.VsxCli).toSelf().inSingletonScope();
    bind(node_1.CliContribution).toService(vsx_cli_1.VsxCli);
    bind(core_1.ConnectionHandler)
        .toDynamicValue(ctx => new core_1.JsonRpcConnectionHandler(vsx_environment_1.VSX_ENVIRONMENT_PATH, () => ctx.container.get(vsx_environment_1.VSXEnvironment)))
        .inSingletonScope();
    bind(vsx_extension_resolver_1.VSXExtensionResolver).toSelf().inSingletonScope();
    bind(plugin_protocol_1.PluginDeployerResolver).toService(vsx_extension_resolver_1.VSXExtensionResolver);
});
//# sourceMappingURL=vsx-registry-backend-module.js.map