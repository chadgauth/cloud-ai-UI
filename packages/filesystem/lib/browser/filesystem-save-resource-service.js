"use strict";
// *****************************************************************************
// Copyright (C) 2022 Ericsson and others.
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
exports.FilesystemSaveResourceService = void 0;
const core_1 = require("@theia/core");
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/core/lib/browser");
const save_resource_service_1 = require("@theia/core/lib/browser/save-resource-service");
const file_service_1 = require("./file-service");
const file_dialog_1 = require("./file-dialog");
let FilesystemSaveResourceService = class FilesystemSaveResourceService extends save_resource_service_1.SaveResourceService {
    /**
     * This method ensures a few things about `widget`:
     * - `widget.getResourceUri()` actually returns a URI.
     * - `widget.saveable.createSnapshot` is defined.
     * - `widget.saveable.revert` is defined.
     */
    canSaveAs(widget) {
        return widget !== undefined
            && browser_1.Saveable.isSource(widget)
            && typeof widget.saveable.createSnapshot === 'function'
            && typeof widget.saveable.revert === 'function'
            && browser_1.Navigatable.is(widget)
            && widget.getResourceUri() !== undefined;
    }
    /**
     * Save `sourceWidget` to a new file picked by the user.
     */
    async saveAs(sourceWidget, options) {
        let exist = false;
        let overwrite = false;
        let selected;
        const canSave = this.canSaveNotSaveAs(sourceWidget);
        const uri = sourceWidget.getResourceUri();
        do {
            selected = await this.fileDialogService.showSaveDialog({
                title: browser_1.CommonCommands.SAVE_AS.label,
                filters: {},
                inputValue: uri.path.base
            });
            if (selected) {
                exist = await this.fileService.exists(selected);
                if (exist) {
                    overwrite = await this.confirmOverwrite(selected);
                }
            }
        } while ((selected && exist && !overwrite) || ((selected === null || selected === void 0 ? void 0 : selected.isEqual(uri)) && !canSave));
        if (selected && selected.isEqual(uri)) {
            await this.save(sourceWidget, options);
        }
        else if (selected) {
            try {
                await this.copyAndSave(sourceWidget, selected, overwrite);
            }
            catch (e) {
                console.warn(e);
            }
        }
    }
    /**
     * @param sourceWidget widget to save as `target`.
     * @param target The new URI for the widget.
     * @param overwrite
     */
    async copyAndSave(sourceWidget, target, overwrite) {
        const snapshot = sourceWidget.saveable.createSnapshot();
        if (!await this.fileService.exists(target)) {
            const sourceUri = sourceWidget.getResourceUri();
            if (this.fileService.canHandleResource(sourceUri)) {
                await this.fileService.copy(sourceUri, target, { overwrite });
            }
            else {
                await this.fileService.createFile(target);
            }
        }
        const targetWidget = await (0, browser_1.open)(this.openerService, target, { widgetOptions: { ref: sourceWidget } });
        const targetSaveable = browser_1.Saveable.get(targetWidget);
        if (targetWidget && targetSaveable && targetSaveable.applySnapshot) {
            targetSaveable.applySnapshot(snapshot);
            await sourceWidget.saveable.revert();
            sourceWidget.close();
            browser_1.Saveable.save(targetWidget, { formatType: 1 /* ON */ });
        }
        else {
            this.messageService.error(core_1.nls.localize('theia/workspace/failApply', 'Could not apply changes to new file'));
        }
    }
    async confirmOverwrite(uri) {
        // Electron already handles the confirmation so do not prompt again.
        if (this.isElectron()) {
            return true;
        }
        // Prompt users for confirmation before overwriting.
        const confirmed = await new browser_1.ConfirmDialog({
            title: core_1.nls.localizeByDefault('Overwrite'),
            msg: core_1.nls.localizeByDefault('{0} already exists. Are you sure you want to overwrite it?', uri.toString())
        }).open();
        return !!confirmed;
    }
    isElectron() {
        return core_1.environment.electron.is();
    }
};
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], FilesystemSaveResourceService.prototype, "fileService", void 0);
__decorate([
    (0, inversify_1.inject)(file_dialog_1.FileDialogService),
    __metadata("design:type", Object)
], FilesystemSaveResourceService.prototype, "fileDialogService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.OpenerService),
    __metadata("design:type", Object)
], FilesystemSaveResourceService.prototype, "openerService", void 0);
FilesystemSaveResourceService = __decorate([
    (0, inversify_1.injectable)()
], FilesystemSaveResourceService);
exports.FilesystemSaveResourceService = FilesystemSaveResourceService;
//# sourceMappingURL=filesystem-save-resource-service.js.map