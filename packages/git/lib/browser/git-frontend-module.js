"use strict";
// *****************************************************************************
// Copyright (C) 2018 TypeFox and others.
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
exports.createGitScmProviderFactory = void 0;
require("../../src/browser/style/index.css");
const inversify_1 = require("@theia/core/shared/inversify");
const common_1 = require("@theia/core/lib/common");
const browser_1 = require("@theia/core/lib/browser");
const tab_bar_toolbar_1 = require("@theia/core/lib/browser/shell/tab-bar-toolbar");
const common_2 = require("../common");
const git_contribution_1 = require("./git-contribution");
const git_diff_frontend_module_1 = require("./diff/git-diff-frontend-module");
const git_history_frontend_module_1 = require("./history/git-history-frontend-module");
const git_resource_resolver_1 = require("./git-resource-resolver");
const git_repository_provider_1 = require("./git-repository-provider");
const git_quick_open_service_1 = require("./git-quick-open-service");
const git_preferences_1 = require("./git-preferences");
const dirty_diff_module_1 = require("./dirty-diff/dirty-diff-module");
const blame_module_1 = require("./blame/blame-module");
const git_repository_tracker_1 = require("./git-repository-tracker");
const git_commit_message_validator_1 = require("./git-commit-message-validator");
const git_sync_service_1 = require("./git-sync-service");
const git_error_handler_1 = require("./git-error-handler");
const git_scm_provider_1 = require("./git-scm-provider");
const color_application_contribution_1 = require("@theia/core/lib/browser/color-application-contribution");
const scm_history_widget_1 = require("@theia/scm-extra/lib/browser/history/scm-history-widget");
const git_history_support_1 = require("./history/git-history-support");
const git_decoration_provider_1 = require("./git-decoration-provider");
exports.default = new inversify_1.ContainerModule(bind => {
    (0, git_preferences_1.bindGitPreferences)(bind);
    (0, git_diff_frontend_module_1.bindGitDiffModule)(bind);
    (0, git_history_frontend_module_1.bindGitHistoryModule)(bind);
    (0, dirty_diff_module_1.bindDirtyDiff)(bind);
    (0, blame_module_1.bindBlame)(bind);
    bind(git_repository_tracker_1.GitRepositoryTracker).toSelf().inSingletonScope();
    bind(common_2.GitWatcherServerProxy).toDynamicValue(context => browser_1.WebSocketConnectionProvider.createProxy(context.container, common_2.GitWatcherPath)).inSingletonScope();
    bind(common_2.GitWatcherServer).to(common_2.ReconnectingGitWatcherServer).inSingletonScope();
    bind(common_2.GitWatcher).toSelf().inSingletonScope();
    bind(common_2.Git).toDynamicValue(context => browser_1.WebSocketConnectionProvider.createProxy(context.container, common_2.GitPath)).inSingletonScope();
    bind(git_contribution_1.GitContribution).toSelf().inSingletonScope();
    bind(common_1.CommandContribution).toService(git_contribution_1.GitContribution);
    bind(common_1.MenuContribution).toService(git_contribution_1.GitContribution);
    bind(browser_1.FrontendApplicationContribution).toService(git_contribution_1.GitContribution);
    bind(tab_bar_toolbar_1.TabBarToolbarContribution).toService(git_contribution_1.GitContribution);
    bind(color_application_contribution_1.ColorContribution).toService(git_contribution_1.GitContribution);
    bind(git_resource_resolver_1.GitResourceResolver).toSelf().inSingletonScope();
    bind(common_1.ResourceResolver).toService(git_resource_resolver_1.GitResourceResolver);
    bind(git_scm_provider_1.GitScmProvider.Factory).toFactory(createGitScmProviderFactory);
    bind(git_repository_provider_1.GitRepositoryProvider).toSelf().inSingletonScope();
    bind(git_decoration_provider_1.GitDecorationProvider).toSelf().inSingletonScope();
    bind(git_quick_open_service_1.GitQuickOpenService).toSelf().inSingletonScope();
    bind(git_commit_message_validator_1.GitCommitMessageValidator).toSelf().inSingletonScope();
    bind(git_sync_service_1.GitSyncService).toSelf().inSingletonScope();
    bind(git_error_handler_1.GitErrorHandler).toSelf().inSingletonScope();
});
function createGitScmProviderFactory(ctx) {
    return (options) => {
        const container = ctx.container.createChild();
        container.bind(git_scm_provider_1.GitScmProviderOptions).toConstantValue(options);
        container.bind(git_scm_provider_1.GitScmProvider).toSelf().inSingletonScope();
        container.bind(git_history_support_1.GitHistorySupport).toSelf().inSingletonScope();
        container.bind(scm_history_widget_1.ScmHistorySupport).toService(git_history_support_1.GitHistorySupport);
        const provider = container.get(git_scm_provider_1.GitScmProvider);
        const historySupport = container.get(git_history_support_1.GitHistorySupport);
        provider.historySupport = historySupport;
        return provider;
    };
}
exports.createGitScmProviderFactory = createGitScmProviderFactory;
//# sourceMappingURL=git-frontend-module.js.map