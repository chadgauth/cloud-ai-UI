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
const raw_process_1 = require("./raw-process");
const terminal_process_1 = require("./terminal-process");
const task_terminal_process_1 = require("./task-terminal-process");
const node_1 = require("@theia/core/lib/node");
const process_manager_1 = require("./process-manager");
const common_1 = require("@theia/core/lib/common");
const multi_ring_buffer_1 = require("./multi-ring-buffer");
exports.default = new inversify_1.ContainerModule(bind => {
    bind(raw_process_1.RawProcess).toSelf().inTransientScope();
    bind(process_manager_1.ProcessManager).toSelf().inSingletonScope();
    bind(node_1.BackendApplicationContribution).toService(process_manager_1.ProcessManager);
    bind(common_1.ILogger).toDynamicValue(ctx => {
        const parentLogger = ctx.container.get(common_1.ILogger);
        return parentLogger.child('process');
    }).inSingletonScope().whenTargetNamed('process');
    bind(raw_process_1.RawProcessFactory).toFactory(ctx => (options) => {
        const child = new inversify_1.Container({ defaultScope: 'Singleton' });
        child.parent = ctx.container;
        child.bind(raw_process_1.RawProcessOptions).toConstantValue(options);
        return child.get(raw_process_1.RawProcess);
    });
    bind(terminal_process_1.TerminalProcess).toSelf().inTransientScope();
    bind(terminal_process_1.TerminalProcessFactory).toFactory(ctx => (options) => {
        const child = new inversify_1.Container({ defaultScope: 'Singleton' });
        child.parent = ctx.container;
        child.bind(terminal_process_1.TerminalProcessOptions).toConstantValue(options);
        return child.get(terminal_process_1.TerminalProcess);
    });
    bind(task_terminal_process_1.TaskTerminalProcess).toSelf().inTransientScope();
    bind(task_terminal_process_1.TaskTerminalProcessFactory).toFactory(ctx => (options) => {
        const child = ctx.container.createChild();
        child.bind(terminal_process_1.TerminalProcessOptions).toConstantValue(options);
        return child.get(task_terminal_process_1.TaskTerminalProcess);
    });
    bind(multi_ring_buffer_1.MultiRingBuffer).toSelf().inTransientScope();
    /* 1MB size, TODO should be a user preference. */
    bind(multi_ring_buffer_1.MultiRingBufferOptions).toConstantValue({ size: 1048576 });
});
//# sourceMappingURL=process-backend-module.js.map