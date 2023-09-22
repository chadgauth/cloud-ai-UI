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
exports.MultiFileDownloadHandler = exports.SingleFileDownloadHandler = exports.DownloadLinkHandler = exports.FileDownloadHandler = void 0;
const os = require("os");
const fs = require("@theia/core/shared/fs-extra");
const path = require("path");
const uuid_1 = require("uuid");
const inversify_1 = require("@theia/core/shared/inversify");
const http_status_codes_1 = require("http-status-codes");
const uri_1 = require("@theia/core/lib/common/uri");
const objects_1 = require("@theia/core/lib/common/objects");
const logger_1 = require("@theia/core/lib/common/logger");
const file_uri_1 = require("@theia/core/lib/node/file-uri");
const directory_archiver_1 = require("./directory-archiver");
const file_download_data_1 = require("../../common/download/file-download-data");
const file_download_cache_1 = require("./file-download-cache");
let FileDownloadHandler = class FileDownloadHandler {
    /**
     * Prepares the file and the link for download
     */
    async prepareDownload(request, response, options) {
        const name = path.basename(options.filePath);
        try {
            await fs.access(options.filePath, fs.constants.R_OK);
            const stat = await fs.stat(options.filePath);
            this.fileDownloadCache.addDownload(options.downloadId, { file: options.filePath, remove: options.remove, size: stat.size, root: options.root });
            // do not send filePath but instead use the downloadId
            const data = { name, id: options.downloadId };
            response.status(http_status_codes_1.OK).send(data).end();
        }
        catch (e) {
            this.handleError(response, e, http_status_codes_1.INTERNAL_SERVER_ERROR);
        }
    }
    async download(request, response, downloadInfo, id) {
        const filePath = downloadInfo.file;
        const statSize = downloadInfo.size;
        // this sets the content-disposition and content-type automatically
        response.attachment(filePath);
        try {
            await fs.access(filePath, fs.constants.R_OK);
            response.setHeader('Accept-Ranges', 'bytes');
            // parse range header and combine multiple ranges
            const range = this.parseRangeHeader(request.headers['range'], statSize);
            if (!range) {
                response.setHeader('Content-Length', statSize);
                this.streamDownload(http_status_codes_1.OK, response, fs.createReadStream(filePath), id);
            }
            else {
                const rangeStart = range.start;
                const rangeEnd = range.end;
                if (rangeStart >= statSize || rangeEnd >= statSize) {
                    response.setHeader('Content-Range', `bytes */${statSize}`);
                    // Return the 416 'Requested Range Not Satisfiable'.
                    response.status(http_status_codes_1.REQUESTED_RANGE_NOT_SATISFIABLE).end();
                    return;
                }
                response.setHeader('Content-Range', `bytes ${rangeStart}-${rangeEnd}/${statSize}`);
                response.setHeader('Content-Length', rangeStart === rangeEnd ? 0 : (rangeEnd - rangeStart + 1));
                response.setHeader('Cache-Control', 'no-cache');
                this.streamDownload(http_status_codes_1.PARTIAL_CONTENT, response, fs.createReadStream(filePath, { start: rangeStart, end: rangeEnd }), id);
            }
        }
        catch (e) {
            this.fileDownloadCache.deleteDownload(id);
            this.handleError(response, e, http_status_codes_1.INTERNAL_SERVER_ERROR);
        }
    }
    /**
     * Streams the file and pipe it to the Response to avoid any OOM issues
     */
    streamDownload(status, response, stream, id) {
        response.status(status);
        stream.on('error', error => {
            this.fileDownloadCache.deleteDownload(id);
            this.handleError(response, error, http_status_codes_1.INTERNAL_SERVER_ERROR);
        });
        response.on('error', error => {
            this.fileDownloadCache.deleteDownload(id);
            this.handleError(response, error, http_status_codes_1.INTERNAL_SERVER_ERROR);
        });
        response.on('close', () => {
            stream.destroy();
        });
        stream.pipe(response);
    }
    parseRangeHeader(range, statSize) {
        if (!range || range.length === 0 || Array.isArray(range)) {
            return;
        }
        const index = range.indexOf('=');
        if (index === -1) {
            return;
        }
        const rangeType = range.slice(0, index);
        if (rangeType !== 'bytes') {
            return;
        }
        const [start, end] = range.slice(index + 1).split('-').map(r => parseInt(r, 10));
        return {
            start: isNaN(start) ? 0 : start,
            end: (isNaN(end) || end > statSize - 1) ? (statSize - 1) : end
        };
    }
    async archive(inputPath, outputPath = path.join(os.tmpdir(), (0, uuid_1.v4)()), entries) {
        await this.directoryArchiver.archive(inputPath, outputPath, entries);
        return outputPath;
    }
    async createTempDir(downloadId = (0, uuid_1.v4)()) {
        const outputPath = path.join(os.tmpdir(), downloadId);
        await fs.mkdir(outputPath);
        return outputPath;
    }
    async handleError(response, reason, status = http_status_codes_1.INTERNAL_SERVER_ERROR) {
        this.logger.error(reason);
        response.status(status).send('Unable to download file.').end();
    }
};
__decorate([
    (0, inversify_1.inject)(logger_1.ILogger),
    __metadata("design:type", Object)
], FileDownloadHandler.prototype, "logger", void 0);
__decorate([
    (0, inversify_1.inject)(directory_archiver_1.DirectoryArchiver),
    __metadata("design:type", directory_archiver_1.DirectoryArchiver)
], FileDownloadHandler.prototype, "directoryArchiver", void 0);
__decorate([
    (0, inversify_1.inject)(file_download_cache_1.FileDownloadCache),
    __metadata("design:type", file_download_cache_1.FileDownloadCache)
], FileDownloadHandler.prototype, "fileDownloadCache", void 0);
FileDownloadHandler = __decorate([
    (0, inversify_1.injectable)()
], FileDownloadHandler);
exports.FileDownloadHandler = FileDownloadHandler;
(function (FileDownloadHandler) {
    FileDownloadHandler.SINGLE = Symbol('single');
    FileDownloadHandler.MULTI = Symbol('multi');
    FileDownloadHandler.DOWNLOAD_LINK = Symbol('download');
})(FileDownloadHandler = exports.FileDownloadHandler || (exports.FileDownloadHandler = {}));
exports.FileDownloadHandler = FileDownloadHandler;
let DownloadLinkHandler = class DownloadLinkHandler extends FileDownloadHandler {
    async handle(request, response) {
        const { method, query } = request;
        if (method !== 'GET' && method !== 'HEAD') {
            this.handleError(response, `Unexpected HTTP method. Expected GET got '${method}' instead.`, http_status_codes_1.METHOD_NOT_ALLOWED);
            return;
        }
        if (query === undefined || query.id === undefined || typeof query.id !== 'string') {
            this.handleError(response, `Cannot access the 'id' query from the request. The query was: ${JSON.stringify(query)}.`, http_status_codes_1.BAD_REQUEST);
            return;
        }
        const cancelDownload = query.cancel;
        const downloadInfo = this.fileDownloadCache.getDownload(query.id);
        if (!downloadInfo) {
            this.handleError(response, `Cannot find the file from the request. The query was: ${JSON.stringify(query)}.`, http_status_codes_1.NOT_FOUND);
            return;
        }
        // allow head request to determine the content length for parallel downloaders
        if (method === 'HEAD') {
            response.setHeader('Content-Length', downloadInfo.size);
            response.status(http_status_codes_1.OK).end();
            return;
        }
        if (!cancelDownload) {
            this.download(request, response, downloadInfo, query.id);
        }
        else {
            this.logger.info('Download', query.id, 'has been cancelled');
            this.fileDownloadCache.deleteDownload(query.id);
        }
    }
};
DownloadLinkHandler = __decorate([
    (0, inversify_1.injectable)()
], DownloadLinkHandler);
exports.DownloadLinkHandler = DownloadLinkHandler;
let SingleFileDownloadHandler = class SingleFileDownloadHandler extends FileDownloadHandler {
    async handle(request, response) {
        const { method, body, query } = request;
        if (method !== 'GET') {
            this.handleError(response, `Unexpected HTTP method. Expected GET got '${method}' instead.`, http_status_codes_1.METHOD_NOT_ALLOWED);
            return;
        }
        if (body !== undefined && !(0, objects_1.isEmpty)(body)) {
            this.handleError(response, `The request body must either undefined or empty when downloading a single file. The body was: ${JSON.stringify(body)}.`, http_status_codes_1.BAD_REQUEST);
            return;
        }
        if (query === undefined || query.uri === undefined || typeof query.uri !== 'string') {
            this.handleError(response, `Cannot access the 'uri' query from the request. The query was: ${JSON.stringify(query)}.`, http_status_codes_1.BAD_REQUEST);
            return;
        }
        const uri = new uri_1.default(query.uri).toString(true);
        const filePath = file_uri_1.FileUri.fsPath(uri);
        let stat;
        try {
            stat = await fs.stat(filePath);
        }
        catch {
            this.handleError(response, `The file does not exist. URI: ${uri}.`, http_status_codes_1.NOT_FOUND);
            return;
        }
        try {
            const downloadId = (0, uuid_1.v4)();
            const options = { filePath, downloadId, remove: false };
            if (!stat.isDirectory()) {
                await this.prepareDownload(request, response, options);
            }
            else {
                const outputRootPath = await this.createTempDir(downloadId);
                const outputPath = path.join(outputRootPath, `${path.basename(filePath)}.tar`);
                await this.archive(filePath, outputPath);
                options.filePath = outputPath;
                options.remove = true;
                options.root = outputRootPath;
                await this.prepareDownload(request, response, options);
            }
        }
        catch (e) {
            this.handleError(response, e, http_status_codes_1.INTERNAL_SERVER_ERROR);
        }
    }
};
SingleFileDownloadHandler = __decorate([
    (0, inversify_1.injectable)()
], SingleFileDownloadHandler);
exports.SingleFileDownloadHandler = SingleFileDownloadHandler;
let MultiFileDownloadHandler = class MultiFileDownloadHandler extends FileDownloadHandler {
    async handle(request, response) {
        const { method, body } = request;
        if (method !== 'PUT') {
            this.handleError(response, `Unexpected HTTP method. Expected PUT got '${method}' instead.`, http_status_codes_1.METHOD_NOT_ALLOWED);
            return;
        }
        if (body === undefined) {
            this.handleError(response, 'The request body must be defined when downloading multiple files.', http_status_codes_1.BAD_REQUEST);
            return;
        }
        if (!file_download_data_1.FileDownloadData.is(body)) {
            this.handleError(response, `Unexpected body format. Cannot extract the URIs from the request body. Body was: ${JSON.stringify(body)}.`, http_status_codes_1.BAD_REQUEST);
            return;
        }
        if (body.uris.length === 0) {
            this.handleError(response, `Insufficient body format. No URIs were defined by the request body. Body was: ${JSON.stringify(body)}.`, http_status_codes_1.BAD_REQUEST);
            return;
        }
        for (const uri of body.uris) {
            try {
                await fs.access(file_uri_1.FileUri.fsPath(uri));
            }
            catch {
                this.handleError(response, `The file does not exist. URI: ${uri}.`, http_status_codes_1.NOT_FOUND);
                return;
            }
        }
        try {
            const downloadId = (0, uuid_1.v4)();
            const outputRootPath = await this.createTempDir(downloadId);
            const distinctUris = Array.from(new Set(body.uris.map(uri => new uri_1.default(uri))));
            const tarPaths = [];
            // We should have one key in the map per FS drive.
            for (const [rootUri, uris] of (await this.directoryArchiver.findCommonParents(distinctUris)).entries()) {
                const rootPath = file_uri_1.FileUri.fsPath(rootUri);
                const entries = uris.map(file_uri_1.FileUri.fsPath).map(p => path.relative(rootPath, p));
                const outputPath = path.join(outputRootPath, `${path.basename(rootPath)}.tar`);
                await this.archive(rootPath, outputPath, entries);
                tarPaths.push(outputPath);
            }
            const options = { filePath: '', downloadId, remove: true, root: outputRootPath };
            if (tarPaths.length === 1) {
                // tslint:disable-next-line:whitespace
                const [outputPath,] = tarPaths;
                options.filePath = outputPath;
                await this.prepareDownload(request, response, options);
            }
            else {
                // We need to tar the tars.
                const outputPath = path.join(outputRootPath, `theia-archive-${Date.now()}.tar`);
                options.filePath = outputPath;
                await this.archive(outputRootPath, outputPath, tarPaths.map(p => path.relative(outputRootPath, p)));
                await this.prepareDownload(request, response, options);
            }
        }
        catch (e) {
            this.handleError(response, e, http_status_codes_1.INTERNAL_SERVER_ERROR);
        }
    }
};
MultiFileDownloadHandler = __decorate([
    (0, inversify_1.injectable)()
], MultiFileDownloadHandler);
exports.MultiFileDownloadHandler = MultiFileDownloadHandler;
//# sourceMappingURL=file-download-handler.js.map