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
const common_1 = require("@theia/core/lib/common");
const inversify_1 = require("@theia/core/shared/inversify");
const debug_service_1 = require("../common/debug-service");
const debug_adapter_factory_1 = require("./debug-adapter-factory");
const messaging_service_1 = require("@theia/core/lib/node/messaging/messaging-service");
const connection_container_module_1 = require("@theia/core/lib/node/messaging/connection-container-module");
const debug_model_1 = require("../common/debug-model");
const debug_service_impl_1 = require("./debug-service-impl");
const debug_adapter_contribution_registry_1 = require("../common/debug-adapter-contribution-registry");
const debug_adapter_session_manager_1 = require("./debug-adapter-session-manager");
const debugConnectionModule = connection_container_module_1.ConnectionContainerModule.create(({ bind, bindBackendService }) => {
    (0, common_1.bindContributionProvider)(bind, debug_model_1.DebugAdapterContribution);
    bind(debug_adapter_contribution_registry_1.DebugAdapterContributionRegistry).toSelf().inSingletonScope();
    bind(debug_service_1.DebugService).to(debug_service_impl_1.DebugServiceImpl).inSingletonScope();
    bindBackendService(debug_service_1.DebugPath, debug_service_1.DebugService);
});
exports.default = new inversify_1.ContainerModule(bind => {
    bind(connection_container_module_1.ConnectionContainerModule).toConstantValue(debugConnectionModule);
    bind(debug_model_1.DebugAdapterSessionFactory).to(debug_adapter_factory_1.DebugAdapterSessionFactoryImpl).inSingletonScope();
    bind(debug_model_1.DebugAdapterFactory).to(debug_adapter_factory_1.LaunchBasedDebugAdapterFactory).inSingletonScope();
    bind(debug_adapter_session_manager_1.DebugAdapterSessionManager).toSelf().inSingletonScope();
    bind(messaging_service_1.MessagingService.Contribution).toService(debug_adapter_session_manager_1.DebugAdapterSessionManager);
    bind(common_1.ILogger).toDynamicValue(({ container }) => container.get(common_1.ILogger).child('debug')).inSingletonScope().whenTargetNamed('debug');
});
//# sourceMappingURL=debug-backend-module.js.map