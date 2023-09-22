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
exports.DiffService = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const diff_uris_1 = require("@theia/core/lib/browser/diff-uris");
const browser_1 = require("@theia/core/lib/browser");
const message_service_1 = require("@theia/core/lib/common/message-service");
const file_service_1 = require("@theia/filesystem/lib/browser/file-service");
let DiffService = class DiffService {
    async openDiffEditor(left, right, label, options) {
        if (left.scheme === 'file' && right.scheme === 'file') {
            const [resolvedLeft, resolvedRight] = await this.fileService.resolveAll([{ resource: left }, { resource: right }]);
            if (resolvedLeft.success && resolvedRight.success) {
                const leftStat = resolvedLeft.stat;
                const rightStat = resolvedRight.stat;
                if (leftStat && rightStat) {
                    if (!leftStat.isDirectory && !rightStat.isDirectory) {
                        const uri = diff_uris_1.DiffUris.encode(left, right, label);
                        await (0, browser_1.open)(this.openerService, uri, options);
                    }
                    else {
                        const details = (() => {
                            if (leftStat.isDirectory && rightStat.isDirectory) {
                                return 'Both resource were a directory.';
                            }
                            else {
                                if (leftStat.isDirectory) {
                                    return `'${left.path.base}' was a directory.`;
                                }
                                else {
                                    return `'${right.path.base}' was a directory.`;
                                }
                            }
                        });
                        this.messageService.warn(`Directories cannot be compared. ${details()}`);
                    }
                }
            }
        }
        else {
            const uri = diff_uris_1.DiffUris.encode(left, right, label);
            await (0, browser_1.open)(this.openerService, uri, options);
        }
    }
};
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], DiffService.prototype, "fileService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.OpenerService),
    __metadata("design:type", Object)
], DiffService.prototype, "openerService", void 0);
__decorate([
    (0, inversify_1.inject)(message_service_1.MessageService),
    __metadata("design:type", message_service_1.MessageService)
], DiffService.prototype, "messageService", void 0);
DiffService = __decorate([
    (0, inversify_1.injectable)()
], DiffService);
exports.DiffService = DiffService;
//# sourceMappingURL=diff-service.js.map