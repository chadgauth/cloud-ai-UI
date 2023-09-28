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
require("../../../src/main/style/status-bar.css");
require("../../../src/main/browser/style/index.css");
require("../../../src/main/browser/style/comments.css");
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/core/lib/browser");
const common_1 = require("@theia/core/lib/common");
const messaging_1 = require("@theia/core/lib/browser/messaging");
const hosted_plugin_1 = require("../../hosted/browser/hosted-plugin");
const hosted_plugin_watcher_1 = require("../../hosted/browser/hosted-plugin-watcher");
const commands_1 = require("./commands");
const plugin_frontend_contribution_1 = require("./plugin-frontend-contribution");
const plugin_protocol_1 = require("../../common/plugin-protocol");
const modal_notification_1 = require("./dialogs/modal-notification");
const plugin_ext_widget_1 = require("./plugin-ext-widget");
const plugin_frontend_view_contribution_1 = require("./plugin-frontend-view-contribution");
const text_editor_model_service_1 = require("./text-editor-model-service");
const menus_contribution_handler_1 = require("./menus/menus-contribution-handler");
const plugin_contribution_handler_1 = require("./plugin-contribution-handler");
const plugin_view_registry_1 = require("./view/plugin-view-registry");
const workspace_main_1 = require("./workspace-main");
const plugin_ext_api_contribution_1 = require("../../common/plugin-ext-api-contribution");
const plugin_paths_protocol_1 = require("../common/plugin-paths-protocol");
const keybindings_contribution_handler_1 = require("./keybindings/keybindings-contribution-handler");
const debug_session_contribution_1 = require("@theia/debug/lib/browser/debug-session-contribution");
const plugin_debug_session_contribution_registry_1 = require("./debug/plugin-debug-session-contribution-registry");
const plugin_debug_service_1 = require("./debug/plugin-debug-service");
const debug_service_1 = require("@theia/debug/lib/common/debug-service");
const plugin_shared_style_1 = require("./plugin-shared-style");
const selection_provider_command_1 = require("./selection-provider-command");
const view_column_service_1 = require("./view-column-service");
const view_context_key_service_1 = require("./view/view-context-key-service");
const plugin_view_widget_1 = require("./view/plugin-view-widget");
const tree_view_widget_1 = require("./view/tree-view-widget");
const rpc_protocol_1 = require("../../common/rpc-protocol");
const common_2 = require("../../common");
const languages_main_1 = require("./languages-main");
const output_channel_registry_main_1 = require("./output-channel-registry-main");
const webview_1 = require("./webview/webview");
const webview_environment_1 = require("./webview/webview-environment");
const webview_theme_data_provider_1 = require("./webview/webview-theme-data-provider");
const webview_preferences_1 = require("./webview/webview-preferences");
const webview_resource_cache_1 = require("./webview/webview-resource-cache");
const plugin_icon_theme_service_1 = require("./plugin-icon-theme-service");
const plugin_tree_view_node_label_provider_1 = require("./view/plugin-tree-view-node-label-provider");
const webview_widget_factory_1 = require("./webview/webview-widget-factory");
const comments_service_1 = require("./comments/comments-service");
const comments_decorator_1 = require("./comments/comments-decorator");
const comments_contribution_1 = require("./comments/comments-contribution");
const comments_context_key_service_1 = require("./comments/comments-context-key-service");
const custom_editor_contribution_1 = require("./custom-editors/custom-editor-contribution");
const plugin_custom_editor_registry_1 = require("./custom-editors/plugin-custom-editor-registry");
const custom_editor_widget_factory_1 = require("../browser/custom-editors/custom-editor-widget-factory");
const custom_editor_widget_1 = require("./custom-editors/custom-editor-widget");
const custom_editor_service_1 = require("./custom-editors/custom-editor-service");
const webview_frontend_security_warnings_1 = require("./webview/webview-frontend-security-warnings");
const plugin_authentication_service_1 = require("./plugin-authentication-service");
const authentication_service_1 = require("@theia/core/lib/browser/authentication-service");
const tree_view_decorator_service_1 = require("./view/tree-view-decorator-service");
const vscode_theia_menu_mappings_1 = require("./menus/vscode-theia-menu-mappings");
const plugin_menu_command_adapter_1 = require("./menus/plugin-menu-command-adapter");
require("./theme-icon-override");
const plugin_terminal_registry_1 = require("./plugin-terminal-registry");
const dnd_file_content_store_1 = require("./view/dnd-file-content-store");
const webview_context_keys_1 = require("./webview/webview-context-keys");
const language_pack_service_1 = require("../../common/language-pack-service");
const tab_bar_toolbar_1 = require("@theia/core/lib/browser/shell/tab-bar-toolbar");
const browser_2 = require("@theia/notebook/lib/browser");
const cell_output_webview_1 = require("./notebooks/renderers/cell-output-webview");
exports.default = new inversify_1.ContainerModule((bind, unbind, isBound, rebind) => {
    bind(languages_main_1.LanguagesMainImpl).toSelf().inTransientScope();
    bind(common_2.LanguagesMainFactory).toFactory(context => (rpc) => {
        const child = context.container.createChild();
        child.bind(rpc_protocol_1.RPCProtocol).toConstantValue(rpc);
        return child.get(languages_main_1.LanguagesMainImpl);
    });
    bind(output_channel_registry_main_1.OutputChannelRegistryMainImpl).toSelf().inTransientScope();
    bind(common_2.OutputChannelRegistryFactory).toFactory(context => () => {
        const child = context.container.createChild();
        return child.get(output_channel_registry_main_1.OutputChannelRegistryMainImpl);
    });
    bind(modal_notification_1.ModalNotification).toSelf().inSingletonScope();
    bind(hosted_plugin_1.HostedPluginSupport).toSelf().inSingletonScope();
    bind(hosted_plugin_watcher_1.HostedPluginWatcher).toSelf().inSingletonScope();
    bind(selection_provider_command_1.SelectionProviderCommandContribution).toSelf().inSingletonScope();
    bind(common_1.CommandContribution).toService(selection_provider_command_1.SelectionProviderCommandContribution);
    bind(commands_1.OpenUriCommandHandler).toSelf().inSingletonScope();
    bind(plugin_frontend_contribution_1.PluginApiFrontendContribution).toSelf().inSingletonScope();
    bind(common_1.CommandContribution).toService(plugin_frontend_contribution_1.PluginApiFrontendContribution);
    bind(tab_bar_toolbar_1.TabBarToolbarContribution).toService(plugin_frontend_contribution_1.PluginApiFrontendContribution);
    bind(text_editor_model_service_1.EditorModelService).toSelf().inSingletonScope();
    bind(browser_1.FrontendApplicationContribution).toDynamicValue(ctx => ({
        onStart() {
            ctx.container.get(hosted_plugin_1.HostedPluginSupport).onStart(ctx.container);
        }
    }));
    bind(plugin_protocol_1.HostedPluginServer).toDynamicValue(ctx => {
        const connection = ctx.container.get(messaging_1.WebSocketConnectionProvider);
        const hostedWatcher = ctx.container.get(hosted_plugin_watcher_1.HostedPluginWatcher);
        return connection.createProxy(plugin_protocol_1.hostedServicePath, hostedWatcher.getHostedPluginClient());
    }).inSingletonScope();
    bind(plugin_paths_protocol_1.PluginPathsService).toDynamicValue(ctx => {
        const connection = ctx.container.get(messaging_1.WebSocketConnectionProvider);
        return connection.createProxy(plugin_paths_protocol_1.pluginPathsServicePath);
    }).inSingletonScope();
    (0, browser_1.bindViewContribution)(bind, plugin_frontend_view_contribution_1.PluginFrontendViewContribution);
    bind(plugin_ext_widget_1.PluginWidget).toSelf();
    bind(browser_1.WidgetFactory).toDynamicValue(ctx => ({
        id: plugin_frontend_view_contribution_1.PluginFrontendViewContribution.PLUGINS_WIDGET_FACTORY_ID,
        createWidget: () => ctx.container.get(plugin_ext_widget_1.PluginWidget)
    }));
    bind(plugin_protocol_1.PluginServer).toDynamicValue(ctx => {
        const provider = ctx.container.get(messaging_1.WebSocketConnectionProvider);
        return provider.createProxy(plugin_protocol_1.pluginServerJsonRpcPath);
    }).inSingletonScope();
    bind(view_context_key_service_1.ViewContextKeyService).toSelf().inSingletonScope();
    (0, tree_view_decorator_service_1.bindTreeViewDecoratorUtilities)(bind);
    bind(plugin_tree_view_node_label_provider_1.PluginTreeViewNodeLabelProvider).toSelf().inSingletonScope();
    bind(browser_1.LabelProviderContribution).toService(plugin_tree_view_node_label_provider_1.PluginTreeViewNodeLabelProvider);
    bind(dnd_file_content_store_1.DnDFileContentStore).toSelf().inSingletonScope();
    bind(browser_1.WidgetFactory).toDynamicValue(({ container }) => ({
        id: plugin_view_registry_1.PLUGIN_VIEW_DATA_FACTORY_ID,
        createWidget: (options) => {
            const props = {
                contextMenuPath: tree_view_widget_1.VIEW_ITEM_CONTEXT_MENU,
                expandOnlyOnExpansionToggleClick: true,
                expansionTogglePadding: 22,
                globalSelection: true,
                leftPadding: 8,
                search: true,
                multiSelect: options.multiSelect
            };
            const child = (0, browser_1.createTreeContainer)(container, {
                props,
                tree: tree_view_widget_1.PluginTree,
                model: tree_view_widget_1.PluginTreeModel,
                widget: tree_view_widget_1.TreeViewWidget,
                decoratorService: tree_view_decorator_service_1.TreeViewDecoratorService
            });
            child.bind(tree_view_widget_1.TreeViewWidgetOptions).toConstantValue(options);
            return child.get(browser_1.TreeWidget);
        }
    })).inSingletonScope();
    (0, webview_preferences_1.bindWebviewPreferences)(bind);
    bind(webview_environment_1.WebviewEnvironment).toSelf().inSingletonScope();
    bind(webview_theme_data_provider_1.WebviewThemeDataProvider).toSelf().inSingletonScope();
    bind(webview_resource_cache_1.WebviewResourceCache).toSelf().inSingletonScope();
    bind(webview_1.WebviewWidget).toSelf();
    bind(webview_widget_factory_1.WebviewWidgetFactory).toDynamicValue(ctx => new webview_widget_factory_1.WebviewWidgetFactory(ctx.container)).inSingletonScope();
    bind(browser_1.WidgetFactory).toService(webview_widget_factory_1.WebviewWidgetFactory);
    bind(webview_context_keys_1.WebviewContextKeys).toSelf().inSingletonScope();
    bind(browser_1.FrontendApplicationContribution).toService(webview_context_keys_1.WebviewContextKeys);
    bind(custom_editor_contribution_1.CustomEditorContribution).toSelf().inSingletonScope();
    bind(common_1.CommandContribution).toService(custom_editor_contribution_1.CustomEditorContribution);
    bind(plugin_custom_editor_registry_1.PluginCustomEditorRegistry).toSelf().inSingletonScope();
    bind(custom_editor_service_1.CustomEditorService).toSelf().inSingletonScope();
    bind(custom_editor_widget_1.CustomEditorWidget).toSelf();
    bind(custom_editor_widget_factory_1.CustomEditorWidgetFactory).toDynamicValue(ctx => new custom_editor_widget_factory_1.CustomEditorWidgetFactory(ctx.container)).inSingletonScope();
    bind(browser_1.WidgetFactory).toService(custom_editor_widget_factory_1.CustomEditorWidgetFactory);
    bind(plugin_view_widget_1.PluginViewWidget).toSelf();
    bind(browser_1.WidgetFactory).toDynamicValue(({ container }) => ({
        id: plugin_view_registry_1.PLUGIN_VIEW_FACTORY_ID,
        createWidget: (identifier) => {
            const child = container.createChild();
            child.bind(plugin_view_widget_1.PluginViewWidgetIdentifier).toConstantValue(identifier);
            return child.get(plugin_view_widget_1.PluginViewWidget);
        }
    })).inSingletonScope();
    bind(browser_1.WidgetFactory).toDynamicValue(({ container }) => ({
        id: plugin_view_registry_1.PLUGIN_VIEW_CONTAINER_FACTORY_ID,
        createWidget: (identifier) => container.get(browser_1.ViewContainer.Factory)(identifier)
    })).inSingletonScope();
    bind(plugin_shared_style_1.PluginSharedStyle).toSelf().inSingletonScope();
    bind(plugin_view_registry_1.PluginViewRegistry).toSelf().inSingletonScope();
    bind(browser_1.FrontendApplicationContribution).toService(plugin_view_registry_1.PluginViewRegistry);
    bind(plugin_icon_theme_service_1.PluginIconThemeFactory).toFactory(({ container }) => (definition) => {
        const child = container.createChild();
        child.bind(plugin_icon_theme_service_1.PluginIconThemeDefinition).toConstantValue(definition);
        child.bind(plugin_icon_theme_service_1.PluginIconTheme).toSelf().inSingletonScope();
        return child.get(plugin_icon_theme_service_1.PluginIconTheme);
    });
    bind(plugin_icon_theme_service_1.PluginIconThemeService).toSelf().inSingletonScope();
    bind(browser_1.LabelProviderContribution).toService(plugin_icon_theme_service_1.PluginIconThemeService);
    bind(menus_contribution_handler_1.MenusContributionPointHandler).toSelf().inSingletonScope();
    bind(plugin_menu_command_adapter_1.PluginMenuCommandAdapter).toSelf().inSingletonScope();
    bind(vscode_theia_menu_mappings_1.CodeEditorWidgetUtil).toSelf().inSingletonScope();
    bind(keybindings_contribution_handler_1.KeybindingsContributionPointHandler).toSelf().inSingletonScope();
    bind(plugin_contribution_handler_1.PluginContributionHandler).toSelf().inSingletonScope();
    bind(workspace_main_1.TextContentResourceResolver).toSelf().inSingletonScope();
    bind(common_1.ResourceResolver).toService(workspace_main_1.TextContentResourceResolver);
    (0, common_1.bindContributionProvider)(bind, plugin_ext_api_contribution_1.MainPluginApiProvider);
    bind(plugin_debug_service_1.PluginDebugService).toSelf().inSingletonScope();
    rebind(debug_service_1.DebugService).toService(plugin_debug_service_1.PluginDebugService);
    bind(plugin_debug_session_contribution_registry_1.PluginDebugSessionContributionRegistry).toSelf().inSingletonScope();
    rebind(debug_session_contribution_1.DebugSessionContributionRegistry).toService(plugin_debug_session_contribution_registry_1.PluginDebugSessionContributionRegistry);
    bind(view_column_service_1.ViewColumnService).toSelf().inSingletonScope();
    bind(comments_service_1.CommentsService).to(comments_service_1.PluginCommentService).inSingletonScope();
    bind(comments_decorator_1.CommentingRangeDecorator).toSelf().inSingletonScope();
    bind(comments_contribution_1.CommentsContribution).toSelf().inSingletonScope();
    bind(comments_context_key_service_1.CommentsContextKeyService).toSelf().inSingletonScope();
    bind(webview_frontend_security_warnings_1.WebviewFrontendSecurityWarnings).toSelf().inSingletonScope();
    bind(browser_1.FrontendApplicationContribution).toService(webview_frontend_security_warnings_1.WebviewFrontendSecurityWarnings);
    bind(plugin_authentication_service_1.PluginAuthenticationServiceImpl).toSelf().inSingletonScope();
    rebind(authentication_service_1.AuthenticationService).toService(plugin_authentication_service_1.PluginAuthenticationServiceImpl);
    bind(plugin_terminal_registry_1.PluginTerminalRegistry).toSelf().inSingletonScope();
    bind(language_pack_service_1.LanguagePackService).toDynamicValue(ctx => {
        const provider = ctx.container.get(messaging_1.WebSocketConnectionProvider);
        return provider.createProxy(language_pack_service_1.languagePackServicePath);
    }).inSingletonScope();
    bind(browser_2.CellOutputWebviewFactory).toFactory(ctx => async (cell) => (0, cell_output_webview_1.createCellOutputWebviewContainer)(ctx.container, cell).getAsync(cell_output_webview_1.CellOutputWebviewImpl));
});
//# sourceMappingURL=plugin-ext-frontend-module.js.map