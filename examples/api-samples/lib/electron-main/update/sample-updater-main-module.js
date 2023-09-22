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
const inversify_1 = require("@theia/core/shared/inversify");
const proxy_factory_1 = require("@theia/core/lib/common/messaging/proxy-factory");
const electron_main_application_1 = require("@theia/core/lib/electron-main/electron-main-application");
const electron_connection_handler_1 = require("@theia/core/lib/electron-common/messaging/electron-connection-handler");
const sample_updater_1 = require("../../common/updater/sample-updater");
const sample_updater_impl_1 = require("./sample-updater-impl");
exports.default = new inversify_1.ContainerModule(bind => {
    bind(sample_updater_impl_1.SampleUpdaterImpl).toSelf().inSingletonScope();
    bind(sample_updater_1.SampleUpdater).toService(sample_updater_impl_1.SampleUpdaterImpl);
    bind(electron_main_application_1.ElectronMainApplicationContribution).toService(sample_updater_1.SampleUpdater);
    bind(electron_connection_handler_1.ElectronConnectionHandler).toDynamicValue(context => new proxy_factory_1.RpcConnectionHandler(sample_updater_1.SampleUpdaterPath, client => {
        const server = context.container.get(sample_updater_1.SampleUpdater);
        server.setClient(client);
        client.onDidCloseConnection(() => server.disconnectClient(client));
        return server;
    })).inSingletonScope();
});
//# sourceMappingURL=sample-updater-main-module.js.map