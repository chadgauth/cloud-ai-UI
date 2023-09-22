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
require("../../src/browser/style/index.css");
const inversify_1 = require("@theia/core/shared/inversify");
const debug_configuration_manager_1 = require("./debug-configuration-manager");
const debug_widget_1 = require("./view/debug-widget");
const debug_service_1 = require("../common/debug-service");
const browser_1 = require("@theia/core/lib/browser");
const debug_session_manager_1 = require("./debug-session-manager");
const debug_resource_1 = require("./debug-resource");
const debug_session_contribution_1 = require("./debug-session-contribution");
const core_1 = require("@theia/core");
const context_key_service_1 = require("@theia/core/lib/browser/context-key-service");
const debug_frontend_application_contribution_1 = require("./debug-frontend-application-contribution");
const debug_console_contribution_1 = require("./console/debug-console-contribution");
const breakpoint_manager_1 = require("./breakpoint/breakpoint-manager");
const debug_editor_service_1 = require("./editor/debug-editor-service");
const debug_editor_model_1 = require("./editor/debug-editor-model");
const debug_preferences_1 = require("./debug-preferences");
const debug_schema_updater_1 = require("./debug-schema-updater");
const debug_call_stack_item_type_key_1 = require("./debug-call-stack-item-type-key");
const launch_preferences_1 = require("./preferences/launch-preferences");
const debug_prefix_configuration_1 = require("./debug-prefix-configuration");
const command_1 = require("@theia/core/lib/common/command");
const tab_bar_toolbar_1 = require("@theia/core/lib/browser/shell/tab-bar-toolbar");
const color_application_contribution_1 = require("@theia/core/lib/browser/color-application-contribution");
const debug_watch_manager_1 = require("./debug-watch-manager");
const monaco_editor_service_1 = require("@theia/monaco/lib/browser/monaco-editor-service");
const debug_breakpoint_widget_1 = require("./editor/debug-breakpoint-widget");
const debug_inline_value_decorator_1 = require("./editor/debug-inline-value-decorator");
const json_schema_store_1 = require("@theia/core/lib/browser/json-schema-store");
const tab_bar_decorator_1 = require("@theia/core/lib/browser/shell/tab-bar-decorator");
const debug_tab_bar_decorator_1 = require("./debug-tab-bar-decorator");
const debug_contribution_1 = require("./debug-contribution");
const quick_access_1 = require("@theia/core/lib/browser/quick-input/quick-access");
const debug_view_model_1 = require("./view/debug-view-model");
const debug_toolbar_widget_1 = require("./view/debug-toolbar-widget");
const debug_session_widget_1 = require("./view/debug-session-widget");
const disassembly_view_contribution_1 = require("./disassembly-view/disassembly-view-contribution");
exports.default = new inversify_1.ContainerModule((bind) => {
    (0, core_1.bindContributionProvider)(bind, debug_contribution_1.DebugContribution);
    bind(debug_call_stack_item_type_key_1.DebugCallStackItemTypeKey).toDynamicValue(({ container }) => container.get(context_key_service_1.ContextKeyService).createKey('callStackItemType', undefined)).inSingletonScope();
    (0, core_1.bindContributionProvider)(bind, debug_session_contribution_1.DebugSessionContribution);
    bind(debug_session_contribution_1.DebugSessionFactory).to(debug_session_contribution_1.DefaultDebugSessionFactory).inSingletonScope();
    bind(debug_session_manager_1.DebugSessionManager).toSelf().inSingletonScope();
    bind(breakpoint_manager_1.BreakpointManager).toSelf().inSingletonScope();
    bind(debug_editor_model_1.DebugEditorModelFactory).toDynamicValue(({ container }) => (editor => debug_editor_model_1.DebugEditorModel.createModel(container, editor))).inSingletonScope();
    bind(debug_editor_service_1.DebugEditorService).toSelf().inSingletonScope().onActivation((context, service) => {
        context.container.get(monaco_editor_service_1.MonacoEditorService).registerDecorationType('Debug breakpoint placeholder', debug_breakpoint_widget_1.DebugBreakpointWidget.PLACEHOLDER_DECORATION, {});
        return service;
    });
    bind(browser_1.WidgetFactory).toDynamicValue(({ container }) => ({
        id: debug_widget_1.DebugWidget.ID,
        createWidget: () => debug_widget_1.DebugWidget.createWidget(container)
    })).inSingletonScope();
    debug_console_contribution_1.DebugConsoleContribution.bindContribution(bind);
    bind(debug_schema_updater_1.DebugSchemaUpdater).toSelf().inSingletonScope();
    bind(json_schema_store_1.JsonSchemaContribution).toService(debug_schema_updater_1.DebugSchemaUpdater);
    bind(debug_configuration_manager_1.DebugConfigurationManager).toSelf().inSingletonScope();
    bind(debug_inline_value_decorator_1.DebugInlineValueDecorator).toSelf().inSingletonScope();
    bind(browser_1.FrontendApplicationContribution).toService(debug_inline_value_decorator_1.DebugInlineValueDecorator);
    bind(debug_service_1.DebugService).toDynamicValue(context => browser_1.WebSocketConnectionProvider.createProxy(context.container, debug_service_1.DebugPath)).inSingletonScope();
    bind(debug_resource_1.DebugResourceResolver).toSelf().inSingletonScope();
    bind(core_1.ResourceResolver).toService(debug_resource_1.DebugResourceResolver);
    (0, browser_1.bindViewContribution)(bind, debug_frontend_application_contribution_1.DebugFrontendApplicationContribution);
    bind(browser_1.FrontendApplicationContribution).toService(debug_frontend_application_contribution_1.DebugFrontendApplicationContribution);
    bind(tab_bar_toolbar_1.TabBarToolbarContribution).toService(debug_frontend_application_contribution_1.DebugFrontendApplicationContribution);
    bind(color_application_contribution_1.ColorContribution).toService(debug_frontend_application_contribution_1.DebugFrontendApplicationContribution);
    bind(debug_session_contribution_1.DebugSessionContributionRegistryImpl).toSelf().inSingletonScope();
    bind(debug_session_contribution_1.DebugSessionContributionRegistry).toService(debug_session_contribution_1.DebugSessionContributionRegistryImpl);
    bind(debug_prefix_configuration_1.DebugPrefixConfiguration).toSelf().inSingletonScope();
    for (const identifier of [command_1.CommandContribution, quick_access_1.QuickAccessContribution]) {
        bind(identifier).toService(debug_prefix_configuration_1.DebugPrefixConfiguration);
    }
    (0, debug_preferences_1.bindDebugPreferences)(bind);
    (0, launch_preferences_1.bindLaunchPreferences)(bind);
    bind(debug_watch_manager_1.DebugWatchManager).toSelf().inSingletonScope();
    bind(debug_tab_bar_decorator_1.DebugTabBarDecorator).toSelf().inSingletonScope();
    bind(tab_bar_decorator_1.TabBarDecorator).toService(debug_tab_bar_decorator_1.DebugTabBarDecorator);
    bind(debug_view_model_1.DebugViewModel).toSelf().inSingletonScope();
    bind(debug_toolbar_widget_1.DebugToolBar).toSelf().inSingletonScope();
    for (const subwidget of debug_session_widget_1.DebugSessionWidget.subwidgets) {
        bind(browser_1.WidgetFactory).toDynamicValue(({ container }) => ({
            id: subwidget.FACTORY_ID,
            createWidget: () => subwidget.createWidget(container),
        }));
    }
    (0, disassembly_view_contribution_1.bindDisassemblyView)(bind);
});
//# sourceMappingURL=debug-frontend-module.js.map