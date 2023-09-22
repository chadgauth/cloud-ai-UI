"use strict";
// *****************************************************************************
// Copyright (C) 2017 TypeFox and others.
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
require("../../src/browser/style/terminal.css");
require("xterm/css/xterm.css");
const inversify_1 = require("@theia/core/shared/inversify");
const common_1 = require("@theia/core/lib/common");
const core_1 = require("@theia/core");
const browser_1 = require("@theia/core/lib/browser");
const tab_bar_toolbar_1 = require("@theia/core/lib/browser/shell/tab-bar-toolbar");
const terminal_frontend_contribution_1 = require("./terminal-frontend-contribution");
const terminal_widget_impl_1 = require("./terminal-widget-impl");
const terminal_widget_1 = require("./base/terminal-widget");
const terminal_protocol_1 = require("../common/terminal-protocol");
const terminal_watcher_1 = require("../common/terminal-watcher");
const shell_terminal_protocol_1 = require("../common/shell-terminal-protocol");
const terminal_common_module_1 = require("../common/terminal-common-module");
const terminal_service_1 = require("./base/terminal-service");
const terminal_preferences_1 = require("./terminal-preferences");
const terminal_contribution_1 = require("./terminal-contribution");
const terminal_search_widget_1 = require("./search/terminal-search-widget");
const terminal_quick_open_service_1 = require("./terminal-quick-open-service");
const terminal_search_container_1 = require("./search/terminal-search-container");
const terminal_copy_on_selection_handler_1 = require("./terminal-copy-on-selection-handler");
const color_application_contribution_1 = require("@theia/core/lib/browser/color-application-contribution");
const terminal_theme_service_1 = require("./terminal-theme-service");
const quick_access_1 = require("@theia/core/lib/browser/quick-input/quick-access");
const terminal_link_provider_1 = require("./terminal-link-provider");
const terminal_url_link_provider_1 = require("./terminal-url-link-provider");
const terminal_file_link_provider_1 = require("./terminal-file-link-provider");
const terminal_profile_service_1 = require("./terminal-profile-service");
exports.default = new inversify_1.ContainerModule(bind => {
    (0, terminal_preferences_1.bindTerminalPreferences)(bind);
    bind(terminal_widget_1.TerminalWidget).to(terminal_widget_impl_1.TerminalWidgetImpl).inTransientScope();
    bind(terminal_watcher_1.TerminalWatcher).toSelf().inSingletonScope();
    let terminalNum = 0;
    bind(browser_1.WidgetFactory).toDynamicValue(ctx => ({
        id: terminal_widget_impl_1.TERMINAL_WIDGET_FACTORY_ID,
        createWidget: (options) => {
            const child = new inversify_1.Container({ defaultScope: 'Singleton' });
            child.parent = ctx.container;
            const counter = terminalNum++;
            const domId = options.id || 'terminal-' + counter;
            const widgetOptions = {
                title: `${common_1.nls.localizeByDefault('Terminal')} ${counter}`,
                useServerTitle: true,
                destroyTermOnClose: true,
                ...options
            };
            child.bind(terminal_widget_1.TerminalWidgetOptions).toConstantValue(widgetOptions);
            child.bind('terminal-dom-id').toConstantValue(domId);
            child.bind(terminal_search_widget_1.TerminalSearchWidgetFactory).toDynamicValue(context => (0, terminal_search_container_1.createTerminalSearchFactory)(context.container));
            return child.get(terminal_widget_1.TerminalWidget);
        }
    }));
    bind(terminal_quick_open_service_1.TerminalQuickOpenService).toSelf().inSingletonScope();
    bind(terminal_copy_on_selection_handler_1.TerminalCopyOnSelectionHandler).toSelf().inSingletonScope();
    bind(terminal_quick_open_service_1.TerminalQuickOpenContribution).toSelf().inSingletonScope();
    for (const identifier of [common_1.CommandContribution, quick_access_1.QuickAccessContribution]) {
        bind(identifier).toService(terminal_quick_open_service_1.TerminalQuickOpenContribution);
    }
    bind(terminal_theme_service_1.TerminalThemeService).toSelf().inSingletonScope();
    bind(terminal_frontend_contribution_1.TerminalFrontendContribution).toSelf().inSingletonScope();
    bind(terminal_service_1.TerminalService).toService(terminal_frontend_contribution_1.TerminalFrontendContribution);
    for (const identifier of [common_1.CommandContribution, common_1.MenuContribution, browser_1.KeybindingContribution, tab_bar_toolbar_1.TabBarToolbarContribution, color_application_contribution_1.ColorContribution]) {
        bind(identifier).toService(terminal_frontend_contribution_1.TerminalFrontendContribution);
    }
    bind(terminal_protocol_1.ITerminalServer).toDynamicValue(ctx => {
        const connection = ctx.container.get(browser_1.WebSocketConnectionProvider);
        const terminalWatcher = ctx.container.get(terminal_watcher_1.TerminalWatcher);
        return connection.createProxy(terminal_protocol_1.terminalPath, terminalWatcher.getTerminalClient());
    }).inSingletonScope();
    bind(shell_terminal_protocol_1.ShellTerminalServerProxy).toDynamicValue(ctx => {
        const connection = ctx.container.get(browser_1.WebSocketConnectionProvider);
        const terminalWatcher = ctx.container.get(terminal_watcher_1.TerminalWatcher);
        return connection.createProxy(shell_terminal_protocol_1.shellTerminalPath, terminalWatcher.getTerminalClient());
    }).inSingletonScope();
    bind(shell_terminal_protocol_1.IShellTerminalServer).toService(shell_terminal_protocol_1.ShellTerminalServerProxy);
    (0, terminal_common_module_1.createCommonBindings)(bind);
    (0, core_1.bindContributionProvider)(bind, terminal_contribution_1.TerminalContribution);
    // terminal link provider contribution point
    (0, core_1.bindContributionProvider)(bind, terminal_link_provider_1.TerminalLinkProvider);
    bind(terminal_link_provider_1.TerminalLinkProviderContribution).toSelf().inSingletonScope();
    bind(terminal_contribution_1.TerminalContribution).toService(terminal_link_provider_1.TerminalLinkProviderContribution);
    bind(terminal_link_provider_1.XtermLinkFactory).toFactory(terminal_link_provider_1.createXtermLinkFactory);
    // default terminal link provider
    bind(terminal_url_link_provider_1.UrlLinkProvider).toSelf().inSingletonScope();
    bind(terminal_link_provider_1.TerminalLinkProvider).toService(terminal_url_link_provider_1.UrlLinkProvider);
    bind(terminal_file_link_provider_1.FileLinkProvider).toSelf().inSingletonScope();
    bind(terminal_link_provider_1.TerminalLinkProvider).toService(terminal_file_link_provider_1.FileLinkProvider);
    bind(terminal_file_link_provider_1.FileDiffPreLinkProvider).toSelf().inSingletonScope();
    bind(terminal_link_provider_1.TerminalLinkProvider).toService(terminal_file_link_provider_1.FileDiffPreLinkProvider);
    bind(terminal_file_link_provider_1.FileDiffPostLinkProvider).toSelf().inSingletonScope();
    bind(terminal_link_provider_1.TerminalLinkProvider).toService(terminal_file_link_provider_1.FileDiffPostLinkProvider);
    bind(terminal_profile_service_1.ContributedTerminalProfileStore).to(terminal_profile_service_1.DefaultProfileStore).inSingletonScope();
    bind(terminal_profile_service_1.UserTerminalProfileStore).to(terminal_profile_service_1.DefaultProfileStore).inSingletonScope();
    bind(terminal_profile_service_1.TerminalProfileService).toDynamicValue(ctx => {
        const userStore = ctx.container.get(terminal_profile_service_1.UserTerminalProfileStore);
        const contributedStore = ctx.container.get(terminal_profile_service_1.ContributedTerminalProfileStore);
        return new terminal_profile_service_1.DefaultTerminalProfileService(userStore, contributedStore);
    }).inSingletonScope();
    bind(browser_1.FrontendApplicationContribution).to(terminal_frontend_contribution_1.TerminalFrontendContribution);
});
//# sourceMappingURL=terminal-frontend-module.js.map