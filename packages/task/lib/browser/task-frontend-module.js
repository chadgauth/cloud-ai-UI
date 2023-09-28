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
const browser_1 = require("@theia/core/lib/browser");
const common_1 = require("@theia/core/lib/common");
const messaging_1 = require("@theia/core/lib/browser/messaging");
const quick_open_task_1 = require("./quick-open-task");
const task_contribution_1 = require("./task-contribution");
const task_service_1 = require("./task-service");
const task_configurations_1 = require("./task-configurations");
const provided_task_configurations_1 = require("./provided-task-configurations");
const task_frontend_contribution_1 = require("./task-frontend-contribution");
const task_common_module_1 = require("../common/task-common-module");
const task_protocol_1 = require("../common/task-protocol");
const task_watcher_1 = require("../common/task-watcher");
const process_task_frontend_module_1 = require("./process/process-task-frontend-module");
const task_schema_updater_1 = require("./task-schema-updater");
const task_definition_registry_1 = require("./task-definition-registry");
const task_problem_matcher_registry_1 = require("./task-problem-matcher-registry");
const task_problem_pattern_registry_1 = require("./task-problem-pattern-registry");
const task_configuration_manager_1 = require("./task-configuration-manager");
const task_preferences_1 = require("./task-preferences");
require("../../src/browser/style/index.css");
require("./tasks-monaco-contribution");
const task_name_resolver_1 = require("./task-name-resolver");
const task_source_resolver_1 = require("./task-source-resolver");
const task_templates_1 = require("./task-templates");
const task_terminal_widget_manager_1 = require("./task-terminal-widget-manager");
const json_schema_store_1 = require("@theia/core/lib/browser/json-schema-store");
const quick_access_1 = require("@theia/core/lib/browser/quick-input/quick-access");
exports.default = new inversify_1.ContainerModule(bind => {
    bind(task_frontend_contribution_1.TaskFrontendContribution).toSelf().inSingletonScope();
    bind(task_service_1.TaskService).toSelf().inSingletonScope();
    for (const identifier of [browser_1.FrontendApplicationContribution, common_1.CommandContribution, browser_1.KeybindingContribution, common_1.MenuContribution, quick_access_1.QuickAccessContribution]) {
        bind(identifier).toService(task_frontend_contribution_1.TaskFrontendContribution);
    }
    bind(quick_open_task_1.QuickOpenTask).toSelf().inSingletonScope();
    bind(quick_open_task_1.TaskRunningQuickOpen).toSelf().inSingletonScope();
    bind(quick_open_task_1.TaskTerminateQuickOpen).toSelf().inSingletonScope();
    bind(quick_open_task_1.TaskRestartRunningQuickOpen).toSelf().inSingletonScope();
    bind(task_configurations_1.TaskConfigurations).toSelf().inSingletonScope();
    bind(provided_task_configurations_1.ProvidedTaskConfigurations).toSelf().inSingletonScope();
    bind(task_configuration_manager_1.TaskConfigurationManager).toSelf().inSingletonScope();
    bind(task_protocol_1.TaskServer).toDynamicValue(ctx => {
        const connection = ctx.container.get(messaging_1.WebSocketConnectionProvider);
        const taskWatcher = ctx.container.get(task_watcher_1.TaskWatcher);
        return connection.createProxy(task_protocol_1.taskPath, taskWatcher.getTaskClient());
    }).inSingletonScope();
    bind(task_definition_registry_1.TaskDefinitionRegistry).toSelf().inSingletonScope();
    bind(task_problem_matcher_registry_1.ProblemMatcherRegistry).toSelf().inSingletonScope();
    bind(task_problem_pattern_registry_1.ProblemPatternRegistry).toSelf().inSingletonScope();
    (0, task_common_module_1.createCommonBindings)(bind);
    bind(task_contribution_1.TaskProviderRegistry).toSelf().inSingletonScope();
    bind(task_contribution_1.TaskResolverRegistry).toSelf().inSingletonScope();
    (0, common_1.bindContributionProvider)(bind, task_contribution_1.TaskContribution);
    bind(task_schema_updater_1.TaskSchemaUpdater).toSelf().inSingletonScope();
    bind(json_schema_store_1.JsonSchemaContribution).toService(task_schema_updater_1.TaskSchemaUpdater);
    bind(task_name_resolver_1.TaskNameResolver).toSelf().inSingletonScope();
    bind(task_source_resolver_1.TaskSourceResolver).toSelf().inSingletonScope();
    bind(task_templates_1.TaskTemplateSelector).toSelf().inSingletonScope();
    bind(task_terminal_widget_manager_1.TaskTerminalWidgetManager).toSelf().inSingletonScope();
    (0, process_task_frontend_module_1.bindProcessTaskModule)(bind);
    (0, task_preferences_1.bindTaskPreferences)(bind);
});
//# sourceMappingURL=task-frontend-module.js.map