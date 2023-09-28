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
const inversify_1 = require("@theia/core/shared/inversify");
const common_1 = require("@theia/core/lib/common");
const browser_1 = require("@theia/core/lib/browser");
const browser_2 = require("@theia/filesystem/lib/browser");
const storage_service_1 = require("@theia/core/lib/browser/storage-service");
const label_provider_1 = require("@theia/core/lib/browser/label-provider");
const browser_3 = require("@theia/variable-resolver/lib/browser");
const common_2 = require("../common");
const workspace_frontend_contribution_1 = require("./workspace-frontend-contribution");
const workspace_service_1 = require("./workspace-service");
const workspace_commands_1 = require("./workspace-commands");
const workspace_variable_contribution_1 = require("./workspace-variable-contribution");
const workspace_storage_service_1 = require("./workspace-storage-service");
const workspace_uri_contribution_1 = require("./workspace-uri-contribution");
const workspace_preferences_1 = require("./workspace-preferences");
const quick_open_workspace_1 = require("./quick-open-workspace");
const workspace_delete_handler_1 = require("./workspace-delete-handler");
const workspace_duplicate_handler_1 = require("./workspace-duplicate-handler");
const workspace_utils_1 = require("./workspace-utils");
const workspace_compare_handler_1 = require("./workspace-compare-handler");
const diff_service_1 = require("./diff-service");
const json_schema_store_1 = require("@theia/core/lib/browser/json-schema-store");
const workspace_schema_updater_1 = require("./workspace-schema-updater");
const workspace_breadcrumbs_contribution_1 = require("./workspace-breadcrumbs-contribution");
const filepath_breadcrumbs_contribution_1 = require("@theia/filesystem/lib/browser/breadcrumbs/filepath-breadcrumbs-contribution");
const workspace_trust_service_1 = require("./workspace-trust-service");
const workspace_trust_preferences_1 = require("./workspace-trust-preferences");
const user_working_directory_provider_1 = require("@theia/core/lib/browser/user-working-directory-provider");
const workspace_user_working_directory_provider_1 = require("./workspace-user-working-directory-provider");
const window_title_updater_1 = require("@theia/core/lib/browser/window/window-title-updater");
const workspace_window_title_updater_1 = require("./workspace-window-title-updater");
const canonical_uri_service_1 = require("./canonical-uri-service");
exports.default = new inversify_1.ContainerModule((bind, unbind, isBound, rebind) => {
    (0, workspace_preferences_1.bindWorkspacePreferences)(bind);
    (0, workspace_trust_preferences_1.bindWorkspaceTrustPreferences)(bind);
    bind(workspace_service_1.WorkspaceService).toSelf().inSingletonScope();
    bind(browser_1.FrontendApplicationContribution).toService(workspace_service_1.WorkspaceService);
    bind(canonical_uri_service_1.CanonicalUriService).toSelf().inSingletonScope();
    bind(common_2.WorkspaceServer).toDynamicValue(ctx => {
        const provider = ctx.container.get(browser_1.WebSocketConnectionProvider);
        return provider.createProxy(common_2.workspacePath);
    }).inSingletonScope();
    bind(workspace_frontend_contribution_1.WorkspaceFrontendContribution).toSelf().inSingletonScope();
    for (const identifier of [browser_1.FrontendApplicationContribution, common_1.CommandContribution, browser_1.KeybindingContribution, common_1.MenuContribution]) {
        bind(identifier).toService(workspace_frontend_contribution_1.WorkspaceFrontendContribution);
    }
    bind(browser_2.OpenFileDialogFactory).toFactory(ctx => (props) => (0, browser_2.createOpenFileDialogContainer)(ctx.container, props).get(browser_2.OpenFileDialog));
    bind(browser_2.SaveFileDialogFactory).toFactory(ctx => (props) => (0, browser_2.createSaveFileDialogContainer)(ctx.container, props).get(browser_2.SaveFileDialog));
    bind(workspace_commands_1.WorkspaceCommandContribution).toSelf().inSingletonScope();
    bind(common_1.CommandContribution).toService(workspace_commands_1.WorkspaceCommandContribution);
    bind(workspace_commands_1.FileMenuContribution).toSelf().inSingletonScope();
    bind(common_1.MenuContribution).toService(workspace_commands_1.FileMenuContribution);
    bind(workspace_commands_1.EditMenuContribution).toSelf().inSingletonScope();
    bind(common_1.MenuContribution).toService(workspace_commands_1.EditMenuContribution);
    bind(workspace_delete_handler_1.WorkspaceDeleteHandler).toSelf().inSingletonScope();
    bind(workspace_duplicate_handler_1.WorkspaceDuplicateHandler).toSelf().inSingletonScope();
    bind(workspace_compare_handler_1.WorkspaceCompareHandler).toSelf().inSingletonScope();
    bind(diff_service_1.DiffService).toSelf().inSingletonScope();
    bind(workspace_storage_service_1.WorkspaceStorageService).toSelf().inSingletonScope();
    rebind(storage_service_1.StorageService).toService(workspace_storage_service_1.WorkspaceStorageService);
    bind(label_provider_1.LabelProviderContribution).to(workspace_uri_contribution_1.WorkspaceUriLabelProviderContribution).inSingletonScope();
    bind(workspace_variable_contribution_1.WorkspaceVariableContribution).toSelf().inSingletonScope();
    bind(browser_3.VariableContribution).toService(workspace_variable_contribution_1.WorkspaceVariableContribution);
    bind(quick_open_workspace_1.QuickOpenWorkspace).toSelf().inSingletonScope();
    bind(workspace_utils_1.WorkspaceUtils).toSelf().inSingletonScope();
    bind(common_2.WorkspaceFileService).toSelf().inSingletonScope();
    bind(common_2.UntitledWorkspaceService).toSelf().inSingletonScope();
    bind(workspace_schema_updater_1.WorkspaceSchemaUpdater).toSelf().inSingletonScope();
    bind(json_schema_store_1.JsonSchemaContribution).toService(workspace_schema_updater_1.WorkspaceSchemaUpdater);
    rebind(filepath_breadcrumbs_contribution_1.FilepathBreadcrumbsContribution).to(workspace_breadcrumbs_contribution_1.WorkspaceBreadcrumbsContribution).inSingletonScope();
    bind(workspace_trust_service_1.WorkspaceTrustService).toSelf().inSingletonScope();
    rebind(user_working_directory_provider_1.UserWorkingDirectoryProvider).to(workspace_user_working_directory_provider_1.WorkspaceUserWorkingDirectoryProvider).inSingletonScope();
    rebind(window_title_updater_1.WindowTitleUpdater).to(workspace_window_title_updater_1.WorkspaceWindowTitleUpdater).inSingletonScope();
});
//# sourceMappingURL=workspace-frontend-module.js.map