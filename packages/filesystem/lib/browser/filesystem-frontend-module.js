"use strict";
// *****************************************************************************
// Copyright (C) 2017-2018 TypeFox and others.
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
exports.bindFileResource = void 0;
require("../../src/browser/style/index.css");
const inversify_1 = require("@theia/core/shared/inversify");
const common_1 = require("@theia/core/lib/common");
const browser_1 = require("@theia/core/lib/browser");
const file_resource_1 = require("./file-resource");
const filesystem_preferences_1 = require("./filesystem-preferences");
const filesystem_frontend_contribution_1 = require("./filesystem-frontend-contribution");
const file_upload_service_1 = require("./file-upload-service");
const file_tree_1 = require("./file-tree");
const file_service_1 = require("./file-service");
const remote_file_system_provider_1 = require("../common/remote-file-system-provider");
const contribution_provider_1 = require("@theia/core/lib/common/contribution-provider");
const remote_file_service_contribution_1 = require("./remote-file-service-contribution");
const filesystem_watcher_error_handler_1 = require("./filesystem-watcher-error-handler");
const filepath_breadcrumbs_contribution_1 = require("./breadcrumbs/filepath-breadcrumbs-contribution");
const filepath_breadcrumbs_container_1 = require("./breadcrumbs/filepath-breadcrumbs-container");
const filesystem_save_resource_service_1 = require("./filesystem-save-resource-service");
const save_resource_service_1 = require("@theia/core/lib/browser/save-resource-service");
exports.default = new inversify_1.ContainerModule((bind, unbind, isBound, rebind) => {
    (0, filesystem_preferences_1.bindFileSystemPreferences)(bind);
    (0, contribution_provider_1.bindContributionProvider)(bind, file_service_1.FileServiceContribution);
    bind(file_service_1.FileService).toSelf().inSingletonScope();
    bind(remote_file_system_provider_1.RemoteFileSystemServer).toDynamicValue(ctx => browser_1.WebSocketConnectionProvider.createProxy(ctx.container, remote_file_system_provider_1.remoteFileSystemPath, new remote_file_system_provider_1.RemoteFileSystemProxyFactory()));
    bind(remote_file_system_provider_1.RemoteFileSystemProvider).toSelf().inSingletonScope();
    bind(remote_file_service_contribution_1.RemoteFileServiceContribution).toSelf().inSingletonScope();
    bind(file_service_1.FileServiceContribution).toService(remote_file_service_contribution_1.RemoteFileServiceContribution);
    bind(filesystem_watcher_error_handler_1.FileSystemWatcherErrorHandler).toSelf().inSingletonScope();
    bindFileResource(bind);
    bind(file_upload_service_1.FileUploadService).toSelf().inSingletonScope();
    bind(filesystem_frontend_contribution_1.FileSystemFrontendContribution).toSelf().inSingletonScope();
    bind(common_1.CommandContribution).toService(filesystem_frontend_contribution_1.FileSystemFrontendContribution);
    bind(browser_1.FrontendApplicationContribution).toService(filesystem_frontend_contribution_1.FileSystemFrontendContribution);
    bind(file_tree_1.FileTreeLabelProvider).toSelf().inSingletonScope();
    bind(browser_1.LabelProviderContribution).toService(file_tree_1.FileTreeLabelProvider);
    bind(filepath_breadcrumbs_container_1.BreadcrumbsFileTreeWidget).toDynamicValue(ctx => (0, filepath_breadcrumbs_container_1.createFileTreeBreadcrumbsWidget)(ctx.container));
    bind(filepath_breadcrumbs_contribution_1.FilepathBreadcrumbsContribution).toSelf().inSingletonScope();
    bind(browser_1.BreadcrumbsContribution).toService(filepath_breadcrumbs_contribution_1.FilepathBreadcrumbsContribution);
    bind(filesystem_save_resource_service_1.FilesystemSaveResourceService).toSelf().inSingletonScope();
    rebind(save_resource_service_1.SaveResourceService).toService(filesystem_save_resource_service_1.FilesystemSaveResourceService);
    bind(file_tree_1.FileTreeDecoratorAdapter).toSelf().inSingletonScope();
});
function bindFileResource(bind) {
    bind(file_resource_1.FileResourceResolver).toSelf().inSingletonScope();
    bind(common_1.ResourceResolver).toService(file_resource_1.FileResourceResolver);
}
exports.bindFileResource = bindFileResource;
//# sourceMappingURL=filesystem-frontend-module.js.map