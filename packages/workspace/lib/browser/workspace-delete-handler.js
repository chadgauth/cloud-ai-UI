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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceDeleteHandler = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const uri_1 = require("@theia/core/lib/common/uri");
const browser_1 = require("@theia/core/lib/browser");
const workspace_service_1 = require("./workspace-service");
const workspace_utils_1 = require("./workspace-utils");
const file_service_1 = require("@theia/filesystem/lib/browser/file-service");
const filesystem_preferences_1 = require("@theia/filesystem/lib/browser/filesystem-preferences");
const nls_1 = require("@theia/core/lib/common/nls");
let WorkspaceDeleteHandler = class WorkspaceDeleteHandler {
    /**
     * Determine if the command is visible.
     *
     * @param uris URIs of selected resources.
     * @returns `true` if the command is visible.
     */
    isVisible(uris) {
        return !!uris.length && !this.workspaceUtils.containsRootDirectory(uris);
    }
    /**
     * Determine if the command is enabled.
     *
     * @param uris URIs of selected resources.
     * @returns `true` if the command is enabled.
     */
    isEnabled(uris) {
        return !!uris.length && !this.workspaceUtils.containsRootDirectory(uris);
    }
    /**
     * Execute the command.
     *
     * @param uris URIs of selected resources.
     */
    async execute(uris) {
        const distinctUris = uri_1.default.getDistinctParents(uris);
        const resolved = {
            recursive: true,
            useTrash: this.fsPreferences['files.enableTrash'] && distinctUris[0] && this.fileService.hasCapability(distinctUris[0], 4096 /* Trash */)
        };
        if (await this.confirm(distinctUris, resolved)) {
            await Promise.all(distinctUris.map(uri => this.delete(uri, resolved)));
        }
    }
    /**
     * Display dialog to confirm deletion.
     *
     * @param uris URIs of selected resources.
     */
    confirm(uris, options) {
        let title = uris.length === 1 ? nls_1.nls.localizeByDefault('File') : nls_1.nls.localizeByDefault('Files');
        if (options.useTrash) {
            title = nls_1.nls.localize('theia/workspace/trashTitle', 'Move {0} to Trash', title);
        }
        else {
            title = nls_1.nls.localizeByDefault('Delete {0}', title);
        }
        return new browser_1.ConfirmDialog({
            title,
            msg: this.getConfirmMessage(uris)
        }).open();
    }
    /**
     * Get the dialog confirmation message for deletion.
     *
     * @param uris URIs of selected resources.
     */
    getConfirmMessage(uris) {
        const dirty = this.getDirty(uris);
        if (dirty.length) {
            if (dirty.length === 1) {
                return nls_1.nls.localize('theia/workspace/confirmMessage.dirtySingle', 'Do you really want to delete {0} with unsaved changes?', dirty[0].path.base);
            }
            return nls_1.nls.localize('theia/workspace/confirmMessage.dirtyMultiple', 'Do you really want to delete {0} files with unsaved changes?', dirty.length);
        }
        if (uris.length === 1) {
            return nls_1.nls.localize('theia/workspace/confirmMessage.uriSingle', 'Do you really want to delete {0}?', uris[0].path.base);
        }
        if (uris.length > 10) {
            return nls_1.nls.localize('theia/workspace/confirmMessage.uriMultiple', 'Do you really want to delete all the {0} selected files?', uris.length);
        }
        const messageContainer = document.createElement('div');
        messageContainer.textContent = nls_1.nls.localize('theia/workspace/confirmMessage.delete', 'Do you really want to delete the following files?');
        const list = document.createElement('ul');
        list.style.listStyleType = 'none';
        for (const uri of uris) {
            const listItem = document.createElement('li');
            listItem.textContent = uri.path.base;
            list.appendChild(listItem);
        }
        messageContainer.appendChild(list);
        return messageContainer;
    }
    /**
     * Get which URI are presently dirty.
     *
     * @param uris URIs of selected resources.
     * @returns An array of dirty URI.
     */
    getDirty(uris) {
        const dirty = new Map();
        const widgets = browser_1.NavigatableWidget.getAffected(browser_1.SaveableWidget.getDirty(this.shell.widgets), uris);
        for (const [resourceUri] of widgets) {
            dirty.set(resourceUri.toString(), resourceUri);
        }
        return [...dirty.values()];
    }
    /**
     * Perform deletion of a given URI.
     *
     * @param uri URI of selected resource.
     * @param options deletion options.
     */
    async delete(uri, options) {
        try {
            await Promise.all([
                this.closeWithoutSaving(uri),
                options.useTrash ? this.moveFileToTrash(uri, options) : this.deleteFilePermanently(uri, options)
            ]);
        }
        catch (e) {
            console.error(e);
        }
    }
    async deleteFilePermanently(uri, options) {
        this.fileService.delete(uri, { ...options, useTrash: false });
    }
    async moveFileToTrash(uri, options) {
        try {
            await this.fileService.delete(uri, { ...options, useTrash: true });
        }
        catch (error) {
            console.error('Error deleting with trash:', error);
            if (await this.confirmDeletePermanently(uri)) {
                return this.deleteFilePermanently(uri, options);
            }
        }
    }
    /**
     * Display dialog to confirm the permanent deletion of a file.
     *
     * @param uri URI of selected resource.
     */
    async confirmDeletePermanently(uri) {
        const title = nls_1.nls.localize('theia/workspace/confirmDeletePermanently.title', 'Error deleting file');
        const msg = document.createElement('div');
        const question = document.createElement('p');
        question.textContent = nls_1.nls.localize('theia/workspace/confirmDeletePermanently.description', 'Failed to delete "{0}" using the Trash. Do you want to permanently delete instead?', uri.path.base);
        msg.append(question);
        const info = document.createElement('p');
        info.textContent = nls_1.nls.localize('theia/workspace/confirmDeletePermanently.solution', 'You can disable the use of Trash in the preferences.');
        msg.append(info);
        const response = await new browser_1.ConfirmDialog({ title, msg }).open();
        return response || false;
    }
    /**
     * Close widget without saving changes.
     *
     * @param uri URI of a selected resource.
     */
    async closeWithoutSaving(uri) {
        const toClose = [...browser_1.NavigatableWidget.getAffected(this.shell.widgets, uri)].map(([, widget]) => widget);
        await this.shell.closeMany(toClose, { save: false });
    }
};
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], WorkspaceDeleteHandler.prototype, "fileService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.ApplicationShell),
    __metadata("design:type", browser_1.ApplicationShell)
], WorkspaceDeleteHandler.prototype, "shell", void 0);
__decorate([
    (0, inversify_1.inject)(workspace_utils_1.WorkspaceUtils),
    __metadata("design:type", workspace_utils_1.WorkspaceUtils)
], WorkspaceDeleteHandler.prototype, "workspaceUtils", void 0);
__decorate([
    (0, inversify_1.inject)(workspace_service_1.WorkspaceService),
    __metadata("design:type", workspace_service_1.WorkspaceService)
], WorkspaceDeleteHandler.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(filesystem_preferences_1.FileSystemPreferences),
    __metadata("design:type", Object)
], WorkspaceDeleteHandler.prototype, "fsPreferences", void 0);
WorkspaceDeleteHandler = __decorate([
    (0, inversify_1.injectable)()
], WorkspaceDeleteHandler);
exports.WorkspaceDeleteHandler = WorkspaceDeleteHandler;
//# sourceMappingURL=workspace-delete-handler.js.map