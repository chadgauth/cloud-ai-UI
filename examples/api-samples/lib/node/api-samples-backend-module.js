"use strict";
// *****************************************************************************
// Copyright (C) 2021 Ericsson and others.
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
const node_1 = require("@theia/core/lib/node");
const sample_backend_application_server_1 = require("./sample-backend-application-server");
const sample_mock_open_vsx_server_1 = require("./sample-mock-open-vsx-server");
const sample_app_info_1 = require("../common/vsx/sample-app-info");
const sample_backend_app_info_1 = require("./sample-backend-app-info");
const sample_ovsx_client_factory_1 = require("../common/vsx/sample-ovsx-client-factory");
exports.default = new inversify_1.ContainerModule((bind, unbind, isBound, rebind) => {
    (0, sample_ovsx_client_factory_1.rebindOVSXClientFactory)(rebind);
    bind(sample_backend_app_info_1.SampleBackendAppInfo).toSelf().inSingletonScope();
    bind(sample_app_info_1.SampleAppInfo).toService(sample_backend_app_info_1.SampleBackendAppInfo);
    bind(node_1.BackendApplicationContribution).toService(sample_backend_app_info_1.SampleBackendAppInfo);
    // bind a mock/sample OpenVSX registry:
    bind(node_1.BackendApplicationContribution).to(sample_mock_open_vsx_server_1.SampleMockOpenVsxServer).inSingletonScope();
    if (process.env.SAMPLE_BACKEND_APPLICATION_SERVER) {
        bind(node_1.BackendApplicationServer).to(sample_backend_application_server_1.SampleBackendApplicationServer).inSingletonScope();
    }
});
//# sourceMappingURL=api-samples-backend-module.js.map