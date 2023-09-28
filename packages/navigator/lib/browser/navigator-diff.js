"use strict";
// *****************************************************************************
// Copyright (C) 2019 David Saunders and others.
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
exports.NavigatorDiff = exports.NavigatorDiffCommands = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const common_1 = require("@theia/core/lib/common");
const opener_service_1 = require("@theia/core/lib/browser/opener-service");
const message_service_1 = require("@theia/core/lib/common/message-service");
const command_1 = require("@theia/core/lib/common/command");
const diff_uris_1 = require("@theia/core/lib/browser/diff-uris");
const file_service_1 = require("@theia/filesystem/lib/browser/file-service");
const files_1 = require("@theia/filesystem/lib/common/files");
var NavigatorDiffCommands;
(function (NavigatorDiffCommands) {
    const COMPARE_CATEGORY = 'Compare';
    NavigatorDiffCommands.COMPARE_FIRST = command_1.Command.toDefaultLocalizedCommand({
        id: 'compare:first',
        category: COMPARE_CATEGORY,
        label: 'Select for Compare'
    });
    NavigatorDiffCommands.COMPARE_SECOND = command_1.Command.toDefaultLocalizedCommand({
        id: 'compare:second',
        category: COMPARE_CATEGORY,
        label: 'Compare with Selected'
    });
})(NavigatorDiffCommands = exports.NavigatorDiffCommands || (exports.NavigatorDiffCommands = {}));
let NavigatorDiff = class NavigatorDiff {
    constructor() {
        this._firstCompareFile = undefined;
    }
    get firstCompareFile() {
        return this._firstCompareFile;
    }
    set firstCompareFile(uri) {
        this._firstCompareFile = uri;
        this._isFirstFileSelected = true;
    }
    get isFirstFileSelected() {
        return this._isFirstFileSelected;
    }
    async isDirectory(uri) {
        try {
            const stat = await this.fileService.resolve(uri);
            return stat.isDirectory;
        }
        catch (e) {
            if (e instanceof files_1.FileOperationError && e.fileOperationResult === 1 /* FILE_NOT_FOUND */) {
                return true;
            }
        }
        return false;
    }
    async getURISelection() {
        const uri = common_1.UriSelection.getUri(this.selectionService.selection);
        if (!uri) {
            return undefined;
        }
        if (await this.isDirectory(uri)) {
            return undefined;
        }
        return uri;
    }
    /**
     * Adds the initial file for comparison
     * @see SelectionService
     * @see compareFiles
     * @returns Promise<boolean> indicating whether the uri is valid
     */
    async addFirstComparisonFile() {
        const uriSelected = await this.getURISelection();
        if (uriSelected === undefined) {
            return false;
        }
        this.firstCompareFile = uriSelected;
        return true;
    }
    /**
     * Compare selected files.  First file is selected through addFirstComparisonFile
     * @see SelectionService
     * @see addFirstComparisonFile
     * @returns Promise<boolean> indicating whether the comparison was completed successfully
     */
    async compareFiles() {
        const uriSelected = await this.getURISelection();
        if (this.firstCompareFile === undefined || uriSelected === undefined) {
            return false;
        }
        const diffUri = diff_uris_1.DiffUris.encode(this.firstCompareFile, uriSelected);
        (0, opener_service_1.open)(this.openerService, diffUri).catch(e => {
            this.notifications.error(e.message);
        });
        return true;
    }
};
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], NavigatorDiff.prototype, "fileService", void 0);
__decorate([
    (0, inversify_1.inject)(opener_service_1.OpenerService),
    __metadata("design:type", Object)
], NavigatorDiff.prototype, "openerService", void 0);
__decorate([
    (0, inversify_1.inject)(message_service_1.MessageService),
    __metadata("design:type", message_service_1.MessageService)
], NavigatorDiff.prototype, "notifications", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.SelectionService),
    __metadata("design:type", common_1.SelectionService)
], NavigatorDiff.prototype, "selectionService", void 0);
NavigatorDiff = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], NavigatorDiff);
exports.NavigatorDiff = NavigatorDiff;
//# sourceMappingURL=navigator-diff.js.map