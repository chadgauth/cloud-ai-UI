"use strict";
// *****************************************************************************
// Copyright (C) 2021 ByteDance and others.
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
exports.bindCustomTaskRunnerModule = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const custom_task_1 = require("./custom-task");
const custom_task_runner_1 = require("./custom-task-runner");
const custom_task_runner_contribution_1 = require("./custom-task-runner-contribution");
const task_runner_1 = require("../task-runner");
function bindCustomTaskRunnerModule(bind) {
    bind(custom_task_1.CustomTask).toSelf().inTransientScope();
    bind(custom_task_1.TaskFactory).toFactory(ctx => (options) => {
        const child = new inversify_1.Container({ defaultScope: 'Singleton' });
        child.parent = ctx.container;
        child.bind(custom_task_1.TaskCustomOptions).toConstantValue(options);
        return child.get(custom_task_1.CustomTask);
    });
    bind(custom_task_runner_1.CustomTaskRunner).toSelf().inSingletonScope();
    bind(custom_task_runner_contribution_1.CustomTaskRunnerContribution).toSelf().inSingletonScope();
    bind(task_runner_1.TaskRunnerContribution).toService(custom_task_runner_contribution_1.CustomTaskRunnerContribution);
}
exports.bindCustomTaskRunnerModule = bindCustomTaskRunnerModule;
//# sourceMappingURL=custom-task-runner-backend-module.js.map