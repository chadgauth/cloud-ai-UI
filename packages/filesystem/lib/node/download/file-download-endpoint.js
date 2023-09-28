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
var FileDownloadEndpoint_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileDownloadEndpoint = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const url = require("url");
const inversify_1 = require("@theia/core/shared/inversify");
const body_parser_1 = require("body-parser");
const express_1 = require("@theia/core/shared/express");
const file_uri_1 = require("@theia/core/lib/node/file-uri");
const file_download_handler_1 = require("./file-download-handler");
let FileDownloadEndpoint = FileDownloadEndpoint_1 = class FileDownloadEndpoint {
    configure(app) {
        const router = (0, express_1.Router)();
        router.get('/download', (request, response) => this.downloadLinkHandler.handle(request, response));
        router.get('/', (request, response) => this.singleFileDownloadHandler.handle(request, response));
        router.put('/', (request, response) => this.multiFileDownloadHandler.handle(request, response));
        // Content-Type: application/json
        app.use((0, body_parser_1.json)());
        app.use(FileDownloadEndpoint_1.PATH, router);
        app.get('/file', (request, response) => {
            const uri = url.parse(request.url).query;
            if (!uri) {
                response.status(400).send('invalid uri');
                return;
            }
            const fsPath = file_uri_1.FileUri.fsPath(decodeURIComponent(uri));
            response.sendFile(fsPath);
        });
    }
};
FileDownloadEndpoint.PATH = '/files';
__decorate([
    (0, inversify_1.inject)(file_download_handler_1.FileDownloadHandler),
    (0, inversify_1.named)(file_download_handler_1.FileDownloadHandler.SINGLE),
    __metadata("design:type", file_download_handler_1.FileDownloadHandler)
], FileDownloadEndpoint.prototype, "singleFileDownloadHandler", void 0);
__decorate([
    (0, inversify_1.inject)(file_download_handler_1.FileDownloadHandler),
    (0, inversify_1.named)(file_download_handler_1.FileDownloadHandler.MULTI),
    __metadata("design:type", file_download_handler_1.FileDownloadHandler)
], FileDownloadEndpoint.prototype, "multiFileDownloadHandler", void 0);
__decorate([
    (0, inversify_1.inject)(file_download_handler_1.FileDownloadHandler),
    (0, inversify_1.named)(file_download_handler_1.FileDownloadHandler.DOWNLOAD_LINK),
    __metadata("design:type", file_download_handler_1.FileDownloadHandler)
], FileDownloadEndpoint.prototype, "downloadLinkHandler", void 0);
FileDownloadEndpoint = FileDownloadEndpoint_1 = __decorate([
    (0, inversify_1.injectable)()
], FileDownloadEndpoint);
exports.FileDownloadEndpoint = FileDownloadEndpoint;
//# sourceMappingURL=file-download-endpoint.js.map