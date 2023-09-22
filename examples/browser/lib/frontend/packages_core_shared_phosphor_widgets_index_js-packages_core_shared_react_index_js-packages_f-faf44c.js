(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_core_shared_phosphor_widgets_index_js-packages_core_shared_react_index_js-packages_f-faf44c"],{

/***/ "../../packages/core/shared/@phosphor/widgets/index.js":
/*!*************************************************************!*\
  !*** ../../packages/core/shared/@phosphor/widgets/index.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! @phosphor/widgets */ "../../node_modules/@phosphor/widgets/lib/index.js");

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/shared/@phosphor/widgets'] = this;


/***/ }),

/***/ "../../packages/core/shared/lodash.throttle/index.js":
/*!***********************************************************!*\
  !*** ../../packages/core/shared/lodash.throttle/index.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! lodash.throttle */ "../../node_modules/lodash.throttle/index.js");

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/shared/lodash.throttle'] = this;


/***/ }),

/***/ "../../packages/core/shared/react/index.js":
/*!*************************************************!*\
  !*** ../../packages/core/shared/react/index.js ***!
  \*************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! react */ "../../node_modules/react/index.js");

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/shared/react'] = this;


/***/ }),

/***/ "../../packages/filesystem/lib/browser/file-upload-service.js":
/*!********************************************************************!*\
  !*** ../../packages/filesystem/lib/browser/file-upload-service.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var FileUploadService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FileUploadService = exports.HTTP_UPLOAD_URL = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const cancellation_1 = __webpack_require__(/*! @theia/core/lib/common/cancellation */ "../../packages/core/lib/common/cancellation.js");
const promise_util_1 = __webpack_require__(/*! @theia/core/lib/common/promise-util */ "../../packages/core/lib/common/promise-util.js");
const message_service_1 = __webpack_require__(/*! @theia/core/lib/common/message-service */ "../../packages/core/lib/common/message-service.js");
const endpoint_1 = __webpack_require__(/*! @theia/core/lib/browser/endpoint */ "../../packages/core/lib/browser/endpoint.js");
const throttle = __webpack_require__(/*! @theia/core/shared/lodash.throttle */ "../../packages/core/shared/lodash.throttle/index.js");
const file_upload_1 = __webpack_require__(/*! ../common/file-upload */ "../../packages/filesystem/lib/common/file-upload.js");
const async_mutex_1 = __webpack_require__(/*! async-mutex */ "../../node_modules/async-mutex/lib/index.js");
const filesystem_preferences_1 = __webpack_require__(/*! ./filesystem-preferences */ "../../packages/filesystem/lib/browser/filesystem-preferences.js");
const file_service_1 = __webpack_require__(/*! ./file-service */ "../../packages/filesystem/lib/browser/file-service.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
exports.HTTP_UPLOAD_URL = new endpoint_1.Endpoint({ path: file_upload_1.HTTP_FILE_UPLOAD_PATH }).getRestUrl().toString(true);
let FileUploadService = FileUploadService_1 = class FileUploadService {
    get maxConcurrentUploads() {
        const maxConcurrentUploads = this.fileSystemPreferences['files.maxConcurrentUploads'];
        return maxConcurrentUploads > 0 ? maxConcurrentUploads : Infinity;
    }
    init() {
        this.uploadForm = this.createUploadForm();
    }
    createUploadForm() {
        const targetInput = document.createElement('input');
        targetInput.type = 'text';
        targetInput.spellcheck = false;
        targetInput.name = FileUploadService_1.TARGET;
        targetInput.classList.add('theia-input');
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.classList.add('theia-input');
        fileInput.name = FileUploadService_1.UPLOAD;
        fileInput.multiple = true;
        const form = document.createElement('form');
        form.style.display = 'none';
        form.enctype = 'multipart/form-data';
        form.append(targetInput);
        form.append(fileInput);
        document.body.appendChild(form);
        fileInput.addEventListener('change', () => {
            if (this.deferredUpload && fileInput.value) {
                const source = new FormData(form);
                // clean up to allow upload to the same folder twice
                fileInput.value = '';
                const targetUri = new uri_1.default(source.get(FileUploadService_1.TARGET));
                const { resolve, reject } = this.deferredUpload;
                this.deferredUpload = undefined;
                const { onDidUpload } = this.uploadForm;
                this.withProgress((progress, token) => this.uploadAll(targetUri, { source, progress, token, onDidUpload }), this.uploadForm.progress).then(resolve, reject);
            }
        });
        return { targetInput, fileInput };
    }
    async upload(targetUri, params = {}) {
        const { source, onDidUpload, leaveInTemp } = params;
        if (source) {
            return this.withProgress((progress, token) => this.uploadAll(typeof targetUri === 'string' ? new uri_1.default(targetUri) : targetUri, { source, progress, token, leaveInTemp, onDidUpload }), params.progress);
        }
        this.deferredUpload = new promise_util_1.Deferred();
        this.uploadForm.targetInput.value = String(targetUri);
        this.uploadForm.fileInput.click();
        this.uploadForm.progress = params.progress;
        this.uploadForm.onDidUpload = params.onDidUpload;
        return this.deferredUpload.promise;
    }
    getUploadUrl() {
        return exports.HTTP_UPLOAD_URL;
    }
    async uploadAll(targetUri, params) {
        const responses = [];
        const status = new Map();
        const result = {
            uploaded: []
        };
        /**
         * When `false`: display the uploading progress.
         * When `true`: display the server-processing progress.
         */
        let waitingForResponses = false;
        const report = throttle(() => {
            if (waitingForResponses) {
                /** Number of files being processed. */
                const total = status.size;
                /** Number of files uploaded and processed. */
                let done = 0;
                for (const item of status.values()) {
                    if (item.uploaded) {
                        done += 1;
                    }
                }
                params.progress.report({
                    message: nls_1.nls.localize('theia/filesystem/processedOutOf', 'Processed {0} out of {1}', done, total),
                    work: { total, done }
                });
            }
            else {
                /** Total number of bytes being uploaded. */
                let total = 0;
                /** Current number of bytes uploaded. */
                let done = 0;
                for (const item of status.values()) {
                    total += item.total;
                    done += item.done;
                }
                params.progress.report({
                    message: nls_1.nls.localize('theia/filesystem/uploadedOutOf', 'Uploaded {0} out of {1}', result.uploaded.length, status.size),
                    work: { total, done }
                });
            }
        }, 100);
        const uploads = [];
        const uploadSemaphore = new async_mutex_1.Semaphore(this.maxConcurrentUploads);
        try {
            await this.index(targetUri, params.source, {
                token: params.token,
                progress: params.progress,
                accept: async (item) => {
                    if (await this.fileService.exists(item.uri) && !await this.confirmOverwrite(item.uri)) {
                        return;
                    }
                    // Track and initialize the file in the status map:
                    status.set(item.file, { total: item.file.size, done: 0 });
                    report();
                    // Don't await here: the semaphore will organize the uploading tasks, not the async indexer.
                    uploads.push(uploadSemaphore.runExclusive(async () => {
                        (0, cancellation_1.checkCancelled)(params.token);
                        const { upload, response } = this.uploadFile(item.file, item.uri, params.token, params.leaveInTemp, (total, done) => {
                            const entry = status.get(item.file);
                            if (entry) {
                                entry.total = total;
                                entry.done = done;
                                report();
                            }
                        });
                        function onError(error) {
                            status.delete(item.file);
                            throw error;
                        }
                        responses.push(response
                            .then(() => {
                            (0, cancellation_1.checkCancelled)(params.token);
                            // Consider the file uploaded once the server sends OK back.
                            result.uploaded.push(item.uri.toString(true));
                            const entry = status.get(item.file);
                            if (entry) {
                                entry.uploaded = true;
                                report();
                            }
                        })
                            .catch(onError));
                        // Have the queue wait for the upload only.
                        return upload
                            .catch(onError);
                    }));
                }
            });
            (0, cancellation_1.checkCancelled)(params.token);
            await Promise.all(uploads);
            (0, cancellation_1.checkCancelled)(params.token);
            waitingForResponses = true;
            report();
            await Promise.all(responses);
        }
        catch (error) {
            uploadSemaphore.cancel();
            if (!(0, cancellation_1.isCancelled)(error)) {
                throw error;
            }
        }
        return result;
    }
    async confirmOverwrite(fileUri) {
        const dialog = new browser_1.ConfirmDialog({
            title: nls_1.nls.localizeByDefault('Replace'),
            msg: nls_1.nls.localizeByDefault("A file or folder with the name '{0}' already exists in the destination folder. Do you want to replace it?", fileUri.path.base),
            ok: nls_1.nls.localizeByDefault('Replace'),
            cancel: browser_1.Dialog.CANCEL
        });
        return !!await dialog.open();
    }
    uploadFile(file, targetUri, token, leaveInTemp, onProgress) {
        const data = new FormData();
        data.set('uri', targetUri.toString(true));
        data.set('file', file);
        if (leaveInTemp) {
            data.set('leaveInTemp', 'true');
        }
        // TODO: Use Fetch API once it supports upload monitoring.
        const xhr = new XMLHttpRequest();
        token.onCancellationRequested(() => xhr.abort());
        const upload = new Promise((resolve, reject) => {
            this.registerEvents(xhr.upload, unregister => ({
                progress: (event) => {
                    if (event.total === event.loaded) {
                        unregister();
                        resolve();
                    }
                    else {
                        onProgress(event.total, event.loaded);
                    }
                },
                abort: () => {
                    unregister();
                    reject((0, cancellation_1.cancelled)());
                },
                error: () => {
                    unregister();
                    reject(new Error('POST upload error'));
                },
                // `load` fires once the response is received, not when the upload is finished.
                // `resolve` should be called earlier within `progress` but this is a safety catch.
                load: () => {
                    unregister();
                    if (xhr.status === 200) {
                        resolve();
                    }
                    else {
                        reject(new Error(`POST request failed: ${xhr.status} ${xhr.statusText}`));
                    }
                },
            }));
        });
        const response = new Promise((resolve, reject) => {
            this.registerEvents(xhr, unregister => ({
                abort: () => {
                    unregister();
                    reject((0, cancellation_1.cancelled)());
                },
                error: () => {
                    unregister();
                    reject(new Error('POST request error'));
                },
                load: () => {
                    unregister();
                    if (xhr.status === 200) {
                        resolve();
                    }
                    else {
                        reject(new Error(`POST request failed: ${xhr.status} ${xhr.statusText}`));
                    }
                }
            }));
        });
        xhr.open('POST', this.getUploadUrl(), /* async: */ true);
        xhr.send(data);
        return {
            upload,
            response
        };
    }
    /**
     * Utility function to attach events and get a callback to unregister those.
     *
     * You may not call `unregister` in the same tick as `register` is invoked.
     */
    registerEvents(target, register) {
        const events = register(() => {
            for (const [event, fn] of Object.entries(events)) {
                target.removeEventListener(event, fn);
            }
        });
        for (const [event, fn] of Object.entries(events)) {
            target.addEventListener(event, fn);
        }
    }
    async withProgress(cb, { text } = { text: nls_1.nls.localize('theia/filesystem/uploadFiles', 'Uploading Files') }) {
        const cancellationSource = new cancellation_1.CancellationTokenSource();
        const { token } = cancellationSource;
        const progress = await this.messageService.showProgress({ text, options: { cancelable: true } }, () => cancellationSource.cancel());
        try {
            return await cb(progress, token);
        }
        finally {
            progress.cancel();
        }
    }
    async index(targetUri, source, context) {
        if (source instanceof FormData) {
            await this.indexFormData(targetUri, source, context);
        }
        else if (source instanceof DataTransfer) {
            await this.indexDataTransfer(targetUri, source, context);
        }
        else {
            await this.indexCustomDataTransfer(targetUri, source, context);
        }
    }
    async indexFormData(targetUri, formData, context) {
        for (const entry of formData.getAll(FileUploadService_1.UPLOAD)) {
            if (entry instanceof File) {
                await this.indexFile(targetUri, entry, context);
            }
        }
    }
    async indexDataTransfer(targetUri, dataTransfer, context) {
        (0, cancellation_1.checkCancelled)(context.token);
        if (dataTransfer.items) {
            await this.indexDataTransferItemList(targetUri, dataTransfer.items, context);
        }
        else {
            await this.indexFileList(targetUri, dataTransfer.files, context);
        }
    }
    async indexCustomDataTransfer(targetUri, dataTransfer, context) {
        for (const item of dataTransfer.values()) {
            const fileInfo = item.asFile();
            if (fileInfo) {
                await this.indexFile(targetUri, new File([await fileInfo.data()], item.id), context);
            }
        }
    }
    async indexFileList(targetUri, files, context) {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file) {
                await this.indexFile(targetUri, file, context);
            }
        }
    }
    async indexFile(targetUri, file, context) {
        await context.accept({
            uri: targetUri.resolve(file.name),
            file
        });
    }
    async indexDataTransferItemList(targetUri, items, context) {
        (0, cancellation_1.checkCancelled)(context.token);
        const entries = [];
        for (let i = 0; i < items.length; i++) {
            const entry = items[i].webkitGetAsEntry();
            entries.push(entry);
        }
        await this.indexEntries(targetUri, entries, context);
    }
    async indexEntry(targetUri, entry, context) {
        (0, cancellation_1.checkCancelled)(context.token);
        if (!entry) {
            return;
        }
        if (entry.isDirectory) {
            await this.indexDirectoryEntry(targetUri, entry, context);
        }
        else {
            await this.indexFileEntry(targetUri, entry, context);
        }
    }
    /**
     *  Read all entries within a folder by block of 100 files or folders until the
     *  whole folder has been read.
     */
    async indexDirectoryEntry(targetUri, entry, context) {
        (0, cancellation_1.checkCancelled)(context.token);
        const newTargetUri = targetUri.resolve(entry.name);
        return new Promise(async (resolve, reject) => {
            const reader = entry.createReader();
            const getEntries = () => reader.readEntries(async (results) => {
                try {
                    if (!context.token.isCancellationRequested && results && results.length) {
                        await this.indexEntries(newTargetUri, results, context);
                        getEntries(); // loop to read all getEntries
                    }
                    else {
                        resolve();
                    }
                }
                catch (e) {
                    reject(e);
                }
            }, reject);
            getEntries();
        });
    }
    async indexEntries(targetUri, entries, context) {
        (0, cancellation_1.checkCancelled)(context.token);
        for (let i = 0; i < entries.length; i++) {
            await this.indexEntry(targetUri, entries[i], context);
        }
    }
    async indexFileEntry(targetUri, entry, context) {
        await new Promise((resolve, reject) => {
            try {
                entry.file(file => this.indexFile(targetUri, file, context).then(resolve, reject), reject);
            }
            catch (e) {
                reject(e);
            }
        });
    }
};
FileUploadService.TARGET = 'target';
FileUploadService.UPLOAD = 'upload';
__decorate([
    (0, inversify_1.inject)(message_service_1.MessageService),
    __metadata("design:type", message_service_1.MessageService)
], FileUploadService.prototype, "messageService", void 0);
__decorate([
    (0, inversify_1.inject)(filesystem_preferences_1.FileSystemPreferences),
    __metadata("design:type", Object)
], FileUploadService.prototype, "fileSystemPreferences", void 0);
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], FileUploadService.prototype, "fileService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FileUploadService.prototype, "init", null);
FileUploadService = FileUploadService_1 = __decorate([
    (0, inversify_1.injectable)()
], FileUploadService);
exports.FileUploadService = FileUploadService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/filesystem/lib/browser/file-upload-service'] = this;


/***/ }),

/***/ "../../packages/filesystem/lib/common/file-upload.js":
/*!***********************************************************!*\
  !*** ../../packages/filesystem/lib/common/file-upload.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

// *****************************************************************************
// Copyright (C) 2021 Ericsson and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HTTP_FILE_UPLOAD_PATH = void 0;
exports.HTTP_FILE_UPLOAD_PATH = '/file-upload';

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/filesystem/lib/common/file-upload'] = this;


/***/ })

}]);
//# sourceMappingURL=packages_core_shared_phosphor_widgets_index_js-packages_core_shared_react_index_js-packages_f-faf44c.js.map