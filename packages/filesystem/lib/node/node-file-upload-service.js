"use strict";
// *****************************************************************************
// Copyright (C) 2019 TypeFox and others.
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
var NodeFileUploadService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeFileUploadService = void 0;
const multer = require("multer");
const path = require("path");
const os = require("os");
const fs = require("@theia/core/shared/fs-extra");
const node_1 = require("@theia/core/lib/node");
const inversify_1 = require("@theia/core/shared/inversify");
const file_upload_1 = require("../common/file-upload");
let NodeFileUploadService = NodeFileUploadService_1 = class NodeFileUploadService {
    async configure(app) {
        const [dest, http_path] = await Promise.all([
            this.getTemporaryUploadDest(),
            this.getHttpFileUploadPath()
        ]);
        console.debug(`HTTP file upload URL path: ${http_path}`);
        console.debug(`Backend file upload cache path: ${dest}`);
        app.post(http_path, 
        // `multer` handles `multipart/form-data` containing our file to upload.
        multer({ dest }).single('file'), (request, response, next) => this.handleFileUpload(request, response));
    }
    /**
     * @returns URL path on which to accept file uploads.
     */
    async getHttpFileUploadPath() {
        return file_upload_1.HTTP_FILE_UPLOAD_PATH;
    }
    /**
     * @returns Path to a folder where to temporarily store uploads.
     */
    async getTemporaryUploadDest() {
        return path.join(os.tmpdir(), NodeFileUploadService_1.UPLOAD_DIR);
    }
    async handleFileUpload(request, response) {
        const fields = request.body;
        if (!request.file || typeof fields !== 'object' || typeof fields.uri !== 'string') {
            response.sendStatus(400); // bad request
            return;
        }
        try {
            const target = node_1.FileUri.fsPath(fields.uri);
            if (!fields.leaveInTemp) {
                await fs.move(request.file.path, target, { overwrite: true });
            }
            else {
                // leave the file where it is, just rename it to its original name
                fs.rename(request.file.path, request.file.path.replace(request.file.filename, request.file.originalname));
            }
            response.status(200).send(target); // ok
        }
        catch (error) {
            console.error(error);
            response.sendStatus(500); // internal server error
        }
    }
};
NodeFileUploadService.UPLOAD_DIR = 'theia_upload';
NodeFileUploadService = NodeFileUploadService_1 = __decorate([
    (0, inversify_1.injectable)()
], NodeFileUploadService);
exports.NodeFileUploadService = NodeFileUploadService;
//# sourceMappingURL=node-file-upload-service.js.map