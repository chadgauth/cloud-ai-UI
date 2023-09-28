"use strict";
// *****************************************************************************
// Copyright (C) 2017 Ericsson and others.
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
const core_1 = require("@theia/core");
const messaging_1 = require("@theia/core/lib/common/messaging");
const node_1 = require("@theia/core/lib/node");
const process_task_runner_backend_module_1 = require("./process/process-task-runner-backend-module");
const custom_task_runner_backend_module_1 = require("./custom/custom-task-runner-backend-module");
const task_backend_application_contribution_1 = require("./task-backend-application-contribution");
const task_manager_1 = require("./task-manager");
const task_runner_1 = require("./task-runner");
const task_server_1 = require("./task-server");
const task_common_module_1 = require("../common/task-common-module");
const common_1 = require("../common");
exports.default = new inversify_1.ContainerModule(bind => {
    bind(task_manager_1.TaskManager).toSelf().inSingletonScope();
    bind(node_1.BackendApplicationContribution).toService(task_manager_1.TaskManager);
    bind(common_1.TaskServer).to(task_server_1.TaskServerImpl).inSingletonScope();
    bind(messaging_1.ConnectionHandler).toDynamicValue(ctx => new messaging_1.RpcConnectionHandler(common_1.taskPath, client => {
        const taskServer = ctx.container.get(common_1.TaskServer);
        taskServer.setClient(client);
        // when connection closes, cleanup that client of task-server
        client.onDidCloseConnection(() => {
            taskServer.disconnectClient(client);
        });
        return taskServer;
    })).inSingletonScope();
    (0, task_common_module_1.createCommonBindings)(bind);
    bind(task_runner_1.TaskRunnerRegistry).toSelf().inSingletonScope();
    (0, core_1.bindContributionProvider)(bind, task_runner_1.TaskRunnerContribution);
    bind(task_backend_application_contribution_1.TaskBackendApplicationContribution).toSelf().inSingletonScope();
    bind(node_1.BackendApplicationContribution).toService(task_backend_application_contribution_1.TaskBackendApplicationContribution);
    (0, process_task_runner_backend_module_1.bindProcessTaskRunnerModule)(bind);
    (0, custom_task_runner_backend_module_1.bindCustomTaskRunnerModule)(bind);
});
//# sourceMappingURL=task-backend-module.js.map