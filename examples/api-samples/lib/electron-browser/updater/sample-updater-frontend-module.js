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
const electron_ipc_connection_provider_1 = require("@theia/core/lib/electron-browser/messaging/electron-ipc-connection-provider");
const common_1 = require("@theia/core/lib/common");
const sample_updater_1 = require("../../common/updater/sample-updater");
const sample_updater_frontend_contribution_1 = require("./sample-updater-frontend-contribution");
exports.default = new inversify_1.ContainerModule(bind => {
    bind(sample_updater_frontend_contribution_1.ElectronMenuUpdater).toSelf().inSingletonScope();
    bind(sample_updater_frontend_contribution_1.SampleUpdaterClientImpl).toSelf().inSingletonScope();
    bind(sample_updater_1.SampleUpdaterClient).toService(sample_updater_frontend_contribution_1.SampleUpdaterClientImpl);
    bind(sample_updater_1.SampleUpdater).toDynamicValue(context => {
        const client = context.container.get(sample_updater_frontend_contribution_1.SampleUpdaterClientImpl);
        return electron_ipc_connection_provider_1.ElectronIpcConnectionProvider.createProxy(context.container, sample_updater_1.SampleUpdaterPath, client);
    }).inSingletonScope();
    bind(sample_updater_frontend_contribution_1.SampleUpdaterFrontendContribution).toSelf().inSingletonScope();
    bind(common_1.MenuContribution).toService(sample_updater_frontend_contribution_1.SampleUpdaterFrontendContribution);
    bind(common_1.CommandContribution).toService(sample_updater_frontend_contribution_1.SampleUpdaterFrontendContribution);
});
//# sourceMappingURL=sample-updater-frontend-module.js.map