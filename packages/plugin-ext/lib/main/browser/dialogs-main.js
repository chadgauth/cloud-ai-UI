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
exports.DialogsMainImpl = void 0;
const browser_1 = require("@theia/filesystem/lib/browser");
const browser_2 = require("@theia/workspace/lib/browser");
const uri_1 = require("@theia/core/lib/common/uri");
const file_upload_service_1 = require("@theia/filesystem/lib/browser/file-upload-service");
const file_service_1 = require("@theia/filesystem/lib/browser/file-service");
const env_variables_1 = require("@theia/core/lib/common/env-variables");
const core_1 = require("@theia/core");
class DialogsMainImpl {
    constructor(rpc, container) {
        this.workspaceService = container.get(browser_2.WorkspaceService);
        this.fileService = container.get(file_service_1.FileService);
        this.environments = container.get(env_variables_1.EnvVariablesServer);
        this.fileDialogService = container.get(browser_1.FileDialogService);
        this.uploadService = container.get(file_upload_service_1.FileUploadService);
    }
    async getRootStat(defaultUri) {
        let rootStat;
        // Try to use default URI as root
        if (defaultUri) {
            try {
                rootStat = await this.fileService.resolve(new uri_1.default(defaultUri));
            }
            catch {
                rootStat = undefined;
            }
            // Try to use as root the parent folder of existing file URI/non existing URI
            if (rootStat && !rootStat.isDirectory || !rootStat) {
                try {
                    rootStat = await this.fileService.resolve(new uri_1.default(defaultUri).parent);
                }
                catch {
                    rootStat = undefined;
                }
            }
        }
        // Try to use workspace service root if there is no pre-configured URI
        if (!rootStat) {
            rootStat = (await this.workspaceService.roots)[0];
        }
        // Try to use current user home if root folder is still not taken
        if (!rootStat) {
            const homeDirUri = await this.environments.getHomeDirUri();
            try {
                rootStat = await this.fileService.resolve(new uri_1.default(homeDirUri));
            }
            catch { }
        }
        return rootStat;
    }
    async $showOpenDialog(options) {
        const rootStat = await this.getRootStat(options.defaultUri ? options.defaultUri : undefined);
        if (!rootStat) {
            throw new Error('Unable to find the rootStat');
        }
        try {
            const canSelectFiles = typeof options.canSelectFiles === 'boolean' ? options.canSelectFiles : true;
            const canSelectFolders = typeof options.canSelectFolders === 'boolean' ? options.canSelectFolders : true;
            let title = options.title;
            if (!title) {
                if (canSelectFiles && canSelectFolders) {
                    title = 'Open';
                }
                else {
                    if (canSelectFiles) {
                        title = 'Open File';
                    }
                    else {
                        title = 'Open Folder';
                    }
                    if (options.canSelectMany) {
                        title += '(s)';
                    }
                }
            }
            // Create open file dialog props
            const dialogProps = {
                title: title,
                openLabel: options.openLabel,
                canSelectFiles: options.canSelectFiles,
                canSelectFolders: options.canSelectFolders,
                canSelectMany: options.canSelectMany,
                filters: options.filters
            };
            const result = await this.fileDialogService.showOpenDialog(dialogProps, rootStat);
            if (Array.isArray(result)) {
                return result.map(uri => uri.path.toString());
            }
            else {
                return result ? [result].map(uri => uri.path.toString()) : undefined;
            }
        }
        catch (error) {
            console.error(error);
        }
        return undefined;
    }
    async $showSaveDialog(options) {
        var _a;
        const rootStat = await this.getRootStat(options.defaultUri ? options.defaultUri : undefined);
        // File name field should be empty unless the URI is a file
        let fileNameValue = '';
        if (options.defaultUri) {
            let defaultURIStat;
            try {
                defaultURIStat = await this.fileService.resolve(new uri_1.default(options.defaultUri));
            }
            catch { }
            if (defaultURIStat && !defaultURIStat.isDirectory || !defaultURIStat) {
                fileNameValue = new uri_1.default(options.defaultUri).path.base;
            }
        }
        try {
            // Create save file dialog props
            const dialogProps = {
                title: (_a = options.title) !== null && _a !== void 0 ? _a : core_1.nls.localizeByDefault('Save'),
                saveLabel: options.saveLabel,
                filters: options.filters,
                inputValue: fileNameValue
            };
            const result = await this.fileDialogService.showSaveDialog(dialogProps, rootStat);
            if (result) {
                return result.path.toString();
            }
            return undefined;
        }
        catch (error) {
            console.error(error);
        }
        return undefined;
    }
    async $showUploadDialog(options) {
        const rootStat = await this.getRootStat(options.defaultUri);
        // Fail if root not fount
        if (!rootStat) {
            throw new Error('Failed to resolve base directory where files should be uploaded');
        }
        const uploadResult = await this.uploadService.upload(rootStat.resource.toString());
        if (uploadResult) {
            return uploadResult.uploaded;
        }
        return undefined;
    }
}
exports.DialogsMainImpl = DialogsMainImpl;
//# sourceMappingURL=dialogs-main.js.map