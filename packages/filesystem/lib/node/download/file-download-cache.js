"use strict";
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
exports.FileDownloadCache = void 0;
// *****************************************************************************
// Copyright (C) 2019 Bitsler and others.
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
const inversify_1 = require("@theia/core/shared/inversify");
const logger_1 = require("@theia/core/lib/common/logger");
const rimraf = require("rimraf");
let FileDownloadCache = class FileDownloadCache {
    constructor() {
        this.downloads = new Map();
        this.expireTimeInMinutes = 1;
    }
    addDownload(id, downloadInfo) {
        downloadInfo.file = encodeURIComponent(downloadInfo.file);
        if (downloadInfo.root) {
            downloadInfo.root = encodeURIComponent(downloadInfo.root);
        }
        // expires in 1 minute enough for parallel connections to be connected.
        downloadInfo.expire = Date.now() + (this.expireTimeInMinutes * 600000);
        this.downloads.set(id, downloadInfo);
    }
    getDownload(id) {
        this.expireDownloads();
        const downloadInfo = this.downloads.get(id);
        if (downloadInfo) {
            downloadInfo.file = decodeURIComponent(downloadInfo.file);
            if (downloadInfo.root) {
                downloadInfo.root = decodeURIComponent(downloadInfo.root);
            }
        }
        return downloadInfo;
    }
    deleteDownload(id) {
        const downloadInfo = this.downloads.get(id);
        if (downloadInfo && downloadInfo.remove) {
            this.deleteRecursively(downloadInfo.root || downloadInfo.file);
        }
        this.downloads.delete(id);
    }
    values() {
        this.expireDownloads();
        return [...this.downloads.entries()].reduce((downloads, [key, value]) => ({ ...downloads, [key]: value }), {});
    }
    deleteRecursively(pathToDelete) {
        rimraf(pathToDelete, error => {
            if (error) {
                this.logger.warn(`An error occurred while deleting the temporary data from the disk. Cannot clean up: ${pathToDelete}.`, error);
            }
        });
    }
    expireDownloads() {
        const time = Date.now();
        for (const [id, download] of this.downloads.entries()) {
            if (download.expire && download.expire <= time) {
                this.deleteDownload(id);
            }
        }
    }
};
__decorate([
    (0, inversify_1.inject)(logger_1.ILogger),
    __metadata("design:type", Object)
], FileDownloadCache.prototype, "logger", void 0);
FileDownloadCache = __decorate([
    (0, inversify_1.injectable)()
], FileDownloadCache);
exports.FileDownloadCache = FileDownloadCache;
//# sourceMappingURL=file-download-cache.js.map