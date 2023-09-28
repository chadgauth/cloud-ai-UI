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
exports.ElectronFileDialogService = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const message_service_1 = require("@theia/core/lib/common/message-service");
const filesystem_1 = require("../../common/filesystem");
const file_dialog_1 = require("../../browser/file-dialog");
//
// We are OK to use this here because the electron backend and frontend are on the same host.
// If required, we can move this single service (and its module) to a dedicated Theia extension,
// and at packaging time, clients can decide whether they need the native or the browser-based
// solution.
//
// eslint-disable-next-line @theia/runtime-import-check
const file_uri_1 = require("@theia/core/lib/node/file-uri");
let ElectronFileDialogService = class ElectronFileDialogService extends file_dialog_1.DefaultFileDialogService {
    async showOpenDialog(props, folder) {
        const rootNode = await this.getRootNode(folder);
        if (rootNode) {
            const filePaths = await window.electronTheiaFilesystem.showOpenDialog(this.toOpenDialogOptions(rootNode.uri, props));
            if (!filePaths || filePaths.length === 0) {
                return undefined;
            }
            const uris = filePaths.map(path => file_uri_1.FileUri.create(path));
            const canAccess = await this.canRead(uris);
            const result = canAccess ? uris.length === 1 ? uris[0] : uris : undefined;
            return result;
        }
        return undefined;
    }
    async showSaveDialog(props, folder) {
        const rootNode = await this.getRootNode(folder);
        if (rootNode) {
            const filePath = await window.electronTheiaFilesystem.showSaveDialog(this.toSaveDialogOptions(rootNode.uri, props));
            if (!filePath) {
                return undefined;
            }
            const uri = file_uri_1.FileUri.create(filePath);
            const exists = await this.fileService.exists(uri);
            if (!exists) {
                return uri;
            }
            const canWrite = await this.canReadWrite(uri);
            return canWrite ? uri : undefined;
        }
        return undefined;
    }
    async canReadWrite(uris) {
        for (const uri of Array.isArray(uris) ? uris : [uris]) {
            if (!(await this.fileService.access(uri, filesystem_1.FileAccess.Constants.R_OK | filesystem_1.FileAccess.Constants.W_OK))) {
                this.messageService.error(`Cannot access resource at ${uri.path}.`);
                return false;
            }
        }
        return true;
    }
    async canRead(uris) {
        const resources = Array.isArray(uris) ? uris : [uris];
        const unreadableResourcePaths = [];
        await Promise.all(resources.map(async (resource) => {
            if (!await this.fileService.access(resource, filesystem_1.FileAccess.Constants.R_OK)) {
                unreadableResourcePaths.push(resource.path.toString());
            }
        }));
        if (unreadableResourcePaths.length > 0) {
            this.messageService.error(`Cannot read ${unreadableResourcePaths.length} resource(s): ${unreadableResourcePaths.join(', ')}`);
        }
        return unreadableResourcePaths.length === 0;
    }
    toOpenDialogOptions(uri, props) {
        const result = {
            path: file_uri_1.FileUri.fsPath(uri)
        };
        result.title = props.title;
        result.buttonLabel = props.openLabel;
        result.maxWidth = props.maxWidth;
        result.modal = props.modal;
        result.openFiles = props.canSelectFiles;
        result.openFolders = props.canSelectFolders;
        result.selectMany = props.canSelectMany;
        if (props.filters) {
            result.filters = [];
            const filters = Object.entries(props.filters);
            for (const [label, extensions] of filters) {
                result.filters.push({ name: label, extensions: extensions });
            }
            if (props.canSelectFiles) {
                if (filters.length > 0) {
                    result.filters.push({ name: 'All Files', extensions: ['*'] });
                }
            }
        }
        return result;
    }
    toSaveDialogOptions(uri, props) {
        if (props.inputValue) {
            uri = uri.resolve(props.inputValue);
        }
        const result = {
            path: file_uri_1.FileUri.fsPath(uri)
        };
        result.title = props.title;
        result.buttonLabel = props.saveLabel;
        result.maxWidth = props.maxWidth;
        result.modal = props.modal;
        if (props.filters) {
            result.filters = [];
            const filters = Object.entries(props.filters);
            for (const [label, extensions] of filters) {
                result.filters.push({ name: label, extensions: extensions });
            }
        }
        return result;
    }
};
__decorate([
    (0, inversify_1.inject)(message_service_1.MessageService),
    __metadata("design:type", message_service_1.MessageService)
], ElectronFileDialogService.prototype, "messageService", void 0);
ElectronFileDialogService = __decorate([
    (0, inversify_1.injectable)()
], ElectronFileDialogService);
exports.ElectronFileDialogService = ElectronFileDialogService;
//# sourceMappingURL=electron-file-dialog-service.js.map