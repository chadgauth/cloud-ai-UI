"use strict";
(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_filesystem_lib_browser_download_file-download-command-contribution_js"],{

/***/ "../../packages/filesystem/lib/browser/download/file-download-command-contribution.js":
/*!********************************************************************************************!*\
  !*** ../../packages/filesystem/lib/browser/download/file-download-command-contribution.js ***!
  \********************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FileDownloadCommands = exports.FileDownloadCommandContribution = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser/browser */ "../../packages/core/lib/browser/browser.js");
const environment_1 = __webpack_require__(/*! @theia/core/shared/@theia/application-package/lib/environment */ "../../packages/core/shared/@theia/application-package/lib/environment/index.js");
const selection_service_1 = __webpack_require__(/*! @theia/core/lib/common/selection-service */ "../../packages/core/lib/common/selection-service.js");
const command_1 = __webpack_require__(/*! @theia/core/lib/common/command */ "../../packages/core/lib/common/command.js");
const uri_command_handler_1 = __webpack_require__(/*! @theia/core/lib/common/uri-command-handler */ "../../packages/core/lib/common/uri-command-handler.js");
const file_download_service_1 = __webpack_require__(/*! ./file-download-service */ "../../packages/filesystem/lib/browser/download/file-download-service.js");
const browser_2 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
let FileDownloadCommandContribution = class FileDownloadCommandContribution {
    registerCommands(registry) {
        registry.registerCommand(FileDownloadCommands.DOWNLOAD, uri_command_handler_1.UriAwareCommandHandler.MultiSelect(this.selectionService, {
            execute: uris => this.executeDownload(uris),
            isEnabled: uris => this.isDownloadEnabled(uris),
            isVisible: uris => this.isDownloadVisible(uris),
        }));
        registry.registerCommand(FileDownloadCommands.COPY_DOWNLOAD_LINK, uri_command_handler_1.UriAwareCommandHandler.MultiSelect(this.selectionService, {
            execute: uris => this.executeDownload(uris, { copyLink: true }),
            isEnabled: uris => browser_1.isChrome && this.isDownloadEnabled(uris),
            isVisible: uris => browser_1.isChrome && this.isDownloadVisible(uris),
        }));
    }
    async executeDownload(uris, options) {
        this.downloadService.download(uris, options);
    }
    isDownloadEnabled(uris) {
        return !environment_1.environment.electron.is() && uris.length > 0 && uris.every(u => u.scheme === 'file');
    }
    isDownloadVisible(uris) {
        return this.isDownloadEnabled(uris);
    }
};
__decorate([
    (0, inversify_1.inject)(file_download_service_1.FileDownloadService),
    __metadata("design:type", file_download_service_1.FileDownloadService)
], FileDownloadCommandContribution.prototype, "downloadService", void 0);
__decorate([
    (0, inversify_1.inject)(selection_service_1.SelectionService),
    __metadata("design:type", selection_service_1.SelectionService)
], FileDownloadCommandContribution.prototype, "selectionService", void 0);
FileDownloadCommandContribution = __decorate([
    (0, inversify_1.injectable)()
], FileDownloadCommandContribution);
exports.FileDownloadCommandContribution = FileDownloadCommandContribution;
var FileDownloadCommands;
(function (FileDownloadCommands) {
    FileDownloadCommands.DOWNLOAD = command_1.Command.toDefaultLocalizedCommand({
        id: 'file.download',
        category: browser_2.CommonCommands.FILE_CATEGORY,
        label: 'Download'
    });
    FileDownloadCommands.COPY_DOWNLOAD_LINK = command_1.Command.toLocalizedCommand({
        id: 'file.copyDownloadLink',
        category: browser_2.CommonCommands.FILE_CATEGORY,
        label: 'Copy Download Link'
    }, 'theia/filesystem/copyDownloadLink', browser_2.CommonCommands.FILE_CATEGORY_KEY);
})(FileDownloadCommands = exports.FileDownloadCommands || (exports.FileDownloadCommands = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/filesystem/lib/browser/download/file-download-command-contribution'] = this;


/***/ }),

/***/ "../../packages/filesystem/lib/browser/download/file-download-service.js":
/*!*******************************************************************************!*\
  !*** ../../packages/filesystem/lib/browser/download/file-download-service.js ***!
  \*******************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FileDownloadService = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const logger_1 = __webpack_require__(/*! @theia/core/lib/common/logger */ "../../packages/core/lib/common/logger.js");
const endpoint_1 = __webpack_require__(/*! @theia/core/lib/browser/endpoint */ "../../packages/core/lib/browser/endpoint.js");
const message_service_1 = __webpack_require__(/*! @theia/core/lib/common/message-service */ "../../packages/core/lib/common/message-service.js");
const widgets_1 = __webpack_require__(/*! @theia/core/lib/browser/widgets */ "../../packages/core/lib/browser/widgets/index.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
let FileDownloadService = class FileDownloadService {
    constructor() {
        this.downloadCounter = 0;
    }
    handleCopy(event, downloadUrl) {
        if (downloadUrl && event.clipboardData) {
            event.clipboardData.setData('text/plain', downloadUrl);
            event.preventDefault();
            this.messageService.info(core_1.nls.localize('theia/filesystem/copiedToClipboard', 'Copied the download link to the clipboard.'));
        }
    }
    async cancelDownload(id) {
        await fetch(`${this.endpoint()}/download/?id=${id}&cancel=true`);
    }
    async download(uris, options) {
        let cancel = false;
        if (uris.length === 0) {
            return;
        }
        const copyLink = options && options.copyLink ? true : false;
        try {
            const text = copyLink ?
                core_1.nls.localize('theia/filesystem/prepareDownloadLink', 'Preparing download link...') :
                core_1.nls.localize('theia/filesystem/prepareDownload', 'Preparing download...');
            const [progress, result] = await Promise.all([
                this.messageService.showProgress({
                    text: text,
                    options: { cancelable: true }
                }, () => { cancel = true; }),
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                new Promise(async (resolve) => {
                    const resp = await fetch(this.request(uris));
                    const jsonResp = await resp.json();
                    resolve({ response: resp, jsonResponse: jsonResp });
                })
            ]);
            const { response, jsonResponse } = result;
            if (cancel) {
                this.cancelDownload(jsonResponse.id);
                return;
            }
            const { status, statusText } = response;
            if (status === 200) {
                progress.cancel();
                const downloadUrl = `${this.endpoint()}/download/?id=${jsonResponse.id}`;
                if (copyLink) {
                    if (document.documentElement) {
                        const toDispose = (0, widgets_1.addClipboardListener)(document.documentElement, 'copy', e => {
                            toDispose.dispose();
                            this.handleCopy(e, downloadUrl);
                        });
                        document.execCommand('copy');
                    }
                }
                else {
                    this.forceDownload(jsonResponse.id, decodeURIComponent(jsonResponse.name));
                }
            }
            else {
                throw new Error(`Received unexpected status code: ${status}. [${statusText}]`);
            }
        }
        catch (e) {
            this.logger.error(`Error occurred when downloading: ${uris.map(u => u.toString(true))}.`, e);
        }
    }
    async forceDownload(id, title) {
        let url;
        try {
            if (this.anchor === undefined) {
                this.anchor = document.createElement('a');
            }
            const endpoint = this.endpoint();
            url = `${endpoint}/download/?id=${id}`;
            this.anchor.href = url;
            this.anchor.style.display = 'none';
            this.anchor.download = title;
            document.body.appendChild(this.anchor);
            this.anchor.click();
        }
        finally {
            // make sure anchor is removed from parent
            if (this.anchor && this.anchor.parentNode) {
                this.anchor.parentNode.removeChild(this.anchor);
            }
            if (url) {
                URL.revokeObjectURL(url);
            }
        }
    }
    request(uris) {
        const url = this.url(uris);
        const init = this.requestInit(uris);
        return new Request(url, init);
    }
    requestInit(uris) {
        if (uris.length === 1) {
            return {
                body: undefined,
                method: 'GET'
            };
        }
        return {
            method: 'PUT',
            body: JSON.stringify(this.body(uris)),
            headers: new Headers({ 'Content-Type': 'application/json' }),
        };
    }
    body(uris) {
        return {
            uris: uris.map(u => u.toString(true))
        };
    }
    url(uris) {
        const endpoint = this.endpoint();
        if (uris.length === 1) {
            // tslint:disable-next-line:whitespace
            const [uri,] = uris;
            return `${endpoint}/?uri=${uri.toString()}`;
        }
        return endpoint;
    }
    endpoint() {
        const url = this.filesUrl();
        return url.endsWith('/') ? url.slice(0, -1) : url;
    }
    filesUrl() {
        return new endpoint_1.Endpoint({ path: 'files' }).getRestUrl().toString();
    }
};
__decorate([
    (0, inversify_1.inject)(logger_1.ILogger),
    __metadata("design:type", Object)
], FileDownloadService.prototype, "logger", void 0);
__decorate([
    (0, inversify_1.inject)(message_service_1.MessageService),
    __metadata("design:type", message_service_1.MessageService)
], FileDownloadService.prototype, "messageService", void 0);
FileDownloadService = __decorate([
    (0, inversify_1.injectable)()
], FileDownloadService);
exports.FileDownloadService = FileDownloadService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/filesystem/lib/browser/download/file-download-service'] = this;


/***/ })

}]);
//# sourceMappingURL=packages_filesystem_lib_browser_download_file-download-command-contribution_js.js.map