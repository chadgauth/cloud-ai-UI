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
exports.FileResourceResolver = exports.FileResource = exports.FileResourceVersion = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const resource_1 = require("@theia/core/lib/common/resource");
const disposable_1 = require("@theia/core/lib/common/disposable");
const event_1 = require("@theia/core/lib/common/event");
const files_1 = require("../common/files");
const file_service_1 = require("./file-service");
const dialogs_1 = require("@theia/core/lib/browser/dialogs");
const label_provider_1 = require("@theia/core/lib/browser/label-provider");
const filesystem_preferences_1 = require("./filesystem-preferences");
const frontend_application_state_1 = require("@theia/core/lib/browser/frontend-application-state");
const core_1 = require("@theia/core");
var FileResourceVersion;
(function (FileResourceVersion) {
    function is(version) {
        return !!version && 'encoding' in version && 'mtime' in version && 'etag' in version;
    }
    FileResourceVersion.is = is;
})(FileResourceVersion = exports.FileResourceVersion || (exports.FileResourceVersion = {}));
class FileResource {
    constructor(uri, fileService, options) {
        this.uri = uri;
        this.fileService = fileService;
        this.options = options;
        this.acceptTextOnly = true;
        this.toDispose = new disposable_1.DisposableCollection();
        this.onDidChangeContentsEmitter = new event_1.Emitter();
        this.onDidChangeContents = this.onDidChangeContentsEmitter.event;
        this.doWrite = async (content, options) => {
            const version = (options === null || options === void 0 ? void 0 : options.version) || this._version;
            const current = FileResourceVersion.is(version) ? version : undefined;
            const etag = current === null || current === void 0 ? void 0 : current.etag;
            try {
                const stat = await this.fileService.write(this.uri, content, {
                    encoding: options === null || options === void 0 ? void 0 : options.encoding,
                    overwriteEncoding: options === null || options === void 0 ? void 0 : options.overwriteEncoding,
                    etag,
                    mtime: current === null || current === void 0 ? void 0 : current.mtime
                });
                this._version = {
                    etag: stat.etag,
                    mtime: stat.mtime,
                    encoding: stat.encoding
                };
            }
            catch (e) {
                if (e instanceof files_1.FileOperationError && e.fileOperationResult === 3 /* FILE_MODIFIED_SINCE */) {
                    if (etag !== files_1.ETAG_DISABLED && await this.shouldOverwrite()) {
                        return this.doWrite(content, { ...options, version: { stat: { ...current, etag: files_1.ETAG_DISABLED } } });
                    }
                    const { message, stack } = e;
                    throw resource_1.ResourceError.OutOfSync({ message, stack, data: { uri: this.uri } });
                }
                throw e;
            }
        };
        this.doSaveContentChanges = async (changes, options) => {
            const version = (options === null || options === void 0 ? void 0 : options.version) || this._version;
            const current = FileResourceVersion.is(version) ? version : undefined;
            if (!current) {
                throw resource_1.ResourceError.NotFound({ message: 'has not been read yet', data: { uri: this.uri } });
            }
            const etag = current === null || current === void 0 ? void 0 : current.etag;
            try {
                const stat = await this.fileService.update(this.uri, changes, {
                    readEncoding: current.encoding,
                    encoding: options === null || options === void 0 ? void 0 : options.encoding,
                    overwriteEncoding: options === null || options === void 0 ? void 0 : options.overwriteEncoding,
                    etag,
                    mtime: current === null || current === void 0 ? void 0 : current.mtime
                });
                this._version = {
                    etag: stat.etag,
                    mtime: stat.mtime,
                    encoding: stat.encoding
                };
            }
            catch (e) {
                if (e instanceof files_1.FileOperationError && e.fileOperationResult === 1 /* FILE_NOT_FOUND */) {
                    const { message, stack } = e;
                    throw resource_1.ResourceError.NotFound({ message, stack, data: { uri: this.uri } });
                }
                if (e instanceof files_1.FileOperationError && e.fileOperationResult === 3 /* FILE_MODIFIED_SINCE */) {
                    const { message, stack } = e;
                    throw resource_1.ResourceError.OutOfSync({ message, stack, data: { uri: this.uri } });
                }
                throw e;
            }
        };
        this.toDispose.push(this.onDidChangeContentsEmitter);
        this.toDispose.push(this.fileService.onDidFilesChange(event => {
            if (event.contains(this.uri)) {
                this.sync();
            }
        }));
        this.toDispose.push(this.fileService.onDidRunOperation(e => {
            if ((e.isOperation(1 /* DELETE */) || e.isOperation(2 /* MOVE */)) && e.resource.isEqualOrParent(this.uri)) {
                this.sync();
            }
        }));
        try {
            this.toDispose.push(this.fileService.watch(this.uri));
        }
        catch (e) {
            console.error(e);
        }
        this.updateSavingContentChanges();
        this.toDispose.push(this.fileService.onDidChangeFileSystemProviderCapabilities(e => {
            if (e.scheme === this.uri.scheme) {
                this.updateSavingContentChanges();
            }
        }));
    }
    get version() {
        return this._version;
    }
    get encoding() {
        var _a;
        return (_a = this._version) === null || _a === void 0 ? void 0 : _a.encoding;
    }
    get isReadonly() {
        return this.options.isReadonly || this.fileService.hasCapability(this.uri, 2048 /* Readonly */);
    }
    dispose() {
        this.toDispose.dispose();
    }
    async readContents(options) {
        var _a, _b;
        try {
            const encoding = (options === null || options === void 0 ? void 0 : options.encoding) || ((_a = this.version) === null || _a === void 0 ? void 0 : _a.encoding);
            const stat = await this.fileService.read(this.uri, {
                encoding,
                etag: files_1.ETAG_DISABLED,
                acceptTextOnly: this.acceptTextOnly,
                limits: this.limits
            });
            this._version = {
                encoding: stat.encoding,
                etag: stat.etag,
                mtime: stat.mtime
            };
            return stat.value;
        }
        catch (e) {
            if (e instanceof file_service_1.TextFileOperationError && e.textFileOperationResult === 0 /* FILE_IS_BINARY */) {
                if (await this.shouldOpenAsText(core_1.nls.localize('theia/filesystem/fileResource/binaryTitle', 'The file is either binary or uses an unsupported text encoding.'))) {
                    this.acceptTextOnly = false;
                    return this.readContents(options);
                }
            }
            else if (e instanceof files_1.FileOperationError && e.fileOperationResult === 7 /* FILE_TOO_LARGE */) {
                const stat = await this.fileService.resolve(this.uri, { resolveMetadata: true });
                const maxFileSize = filesystem_preferences_1.GENERAL_MAX_FILE_SIZE_MB * 1024 * 1024;
                if (((_b = this.limits) === null || _b === void 0 ? void 0 : _b.size) !== maxFileSize && await this.shouldOpenAsText(core_1.nls.localize('theia/filesystem/fileResource/largeFileTitle', 'The file is too large ({0}).', files_1.BinarySize.formatSize(stat.size)))) {
                    this.limits = {
                        size: maxFileSize
                    };
                    return this.readContents(options);
                }
            }
            else if (e instanceof files_1.FileOperationError && e.fileOperationResult === 1 /* FILE_NOT_FOUND */) {
                this._version = undefined;
                const { message, stack } = e;
                throw resource_1.ResourceError.NotFound({
                    message, stack,
                    data: {
                        uri: this.uri
                    }
                });
            }
            throw e;
        }
    }
    async readStream(options) {
        var _a, _b;
        try {
            const encoding = (options === null || options === void 0 ? void 0 : options.encoding) || ((_a = this.version) === null || _a === void 0 ? void 0 : _a.encoding);
            const stat = await this.fileService.readStream(this.uri, {
                encoding,
                etag: files_1.ETAG_DISABLED,
                acceptTextOnly: this.acceptTextOnly,
                limits: this.limits
            });
            this._version = {
                encoding: stat.encoding,
                etag: stat.etag,
                mtime: stat.mtime
            };
            return stat.value;
        }
        catch (e) {
            if (e instanceof file_service_1.TextFileOperationError && e.textFileOperationResult === 0 /* FILE_IS_BINARY */) {
                if (await this.shouldOpenAsText(core_1.nls.localize('theia/filesystem/fileResource/binaryTitle', 'The file is either binary or uses an unsupported text encoding.'))) {
                    this.acceptTextOnly = false;
                    return this.readStream(options);
                }
            }
            else if (e instanceof files_1.FileOperationError && e.fileOperationResult === 7 /* FILE_TOO_LARGE */) {
                const stat = await this.fileService.resolve(this.uri, { resolveMetadata: true });
                const maxFileSize = filesystem_preferences_1.GENERAL_MAX_FILE_SIZE_MB * 1024 * 1024;
                if (((_b = this.limits) === null || _b === void 0 ? void 0 : _b.size) !== maxFileSize && await this.shouldOpenAsText(core_1.nls.localize('theia/filesystem/fileResource/largeFileTitle', 'The file is too large ({0}).', files_1.BinarySize.formatSize(stat.size)))) {
                    this.limits = {
                        size: maxFileSize
                    };
                    return this.readStream(options);
                }
            }
            else if (e instanceof files_1.FileOperationError && e.fileOperationResult === 1 /* FILE_NOT_FOUND */) {
                this._version = undefined;
                const { message, stack } = e;
                throw resource_1.ResourceError.NotFound({
                    message, stack,
                    data: {
                        uri: this.uri
                    }
                });
            }
            throw e;
        }
    }
    updateSavingContentChanges() {
        if (this.isReadonly) {
            delete this.saveContentChanges;
            delete this.saveContents;
            delete this.saveStream;
        }
        else {
            this.saveContents = this.doWrite;
            this.saveStream = this.doWrite;
            if (this.fileService.hasCapability(this.uri, 33554432 /* Update */)) {
                this.saveContentChanges = this.doSaveContentChanges;
            }
        }
    }
    async guessEncoding() {
        // TODO limit size
        const content = await this.fileService.read(this.uri, { autoGuessEncoding: true });
        return content.encoding;
    }
    async sync() {
        if (await this.isInSync()) {
            return;
        }
        this.onDidChangeContentsEmitter.fire(undefined);
    }
    async isInSync() {
        try {
            const stat = await this.fileService.resolve(this.uri, { resolveMetadata: true });
            return !!this.version && this.version.mtime >= stat.mtime;
        }
        catch {
            return !this.version;
        }
    }
    async shouldOverwrite() {
        return this.options.shouldOverwrite();
    }
    async shouldOpenAsText(error) {
        return this.options.shouldOpenAsText(error);
    }
}
exports.FileResource = FileResource;
let FileResourceResolver = class FileResourceResolver {
    async resolve(uri) {
        var _a;
        let stat;
        try {
            stat = await this.fileService.resolve(uri);
        }
        catch (e) {
            if (!(e instanceof files_1.FileOperationError && e.fileOperationResult === 1 /* FILE_NOT_FOUND */)) {
                throw e;
            }
        }
        if (stat && stat.isDirectory) {
            throw new Error('The given uri is a directory: ' + this.labelProvider.getLongName(uri));
        }
        return new FileResource(uri, this.fileService, {
            isReadonly: (_a = stat === null || stat === void 0 ? void 0 : stat.isReadonly) !== null && _a !== void 0 ? _a : false,
            shouldOverwrite: () => this.shouldOverwrite(uri),
            shouldOpenAsText: error => this.shouldOpenAsText(uri, error)
        });
    }
    async shouldOverwrite(uri) {
        const dialog = new dialogs_1.ConfirmDialog({
            title: core_1.nls.localize('theia/filesystem/fileResource/overwriteTitle', "The file '{0}' has been changed on the file system.", this.labelProvider.getName(uri)),
            msg: core_1.nls.localize('theia/fileSystem/fileResource/overWriteBody', "Do you want to overwrite the changes made to '{0}' on the file system?", this.labelProvider.getLongName(uri)),
            ok: dialogs_1.Dialog.YES,
            cancel: dialogs_1.Dialog.NO,
        });
        return !!await dialog.open();
    }
    async shouldOpenAsText(uri, error) {
        switch (this.applicationState.state) {
            case 'init':
            case 'started_contributions':
            case 'attached_shell':
                return true; // We're restoring state - assume that we should open files that were previously open.
            default: {
                const dialog = new dialogs_1.ConfirmDialog({
                    title: error,
                    msg: core_1.nls.localize('theia/filesystem/fileResource/binaryFileQuery', "Opening it might take some time and might make the IDE unresponsive. Do you want to open '{0}' anyway?", this.labelProvider.getLongName(uri)),
                    ok: dialogs_1.Dialog.YES,
                    cancel: dialogs_1.Dialog.NO,
                });
                return !!await dialog.open();
            }
        }
    }
};
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], FileResourceResolver.prototype, "fileService", void 0);
__decorate([
    (0, inversify_1.inject)(label_provider_1.LabelProvider),
    __metadata("design:type", label_provider_1.LabelProvider)
], FileResourceResolver.prototype, "labelProvider", void 0);
__decorate([
    (0, inversify_1.inject)(frontend_application_state_1.FrontendApplicationStateService),
    __metadata("design:type", frontend_application_state_1.FrontendApplicationStateService)
], FileResourceResolver.prototype, "applicationState", void 0);
FileResourceResolver = __decorate([
    (0, inversify_1.injectable)()
], FileResourceResolver);
exports.FileResourceResolver = FileResourceResolver;
//# sourceMappingURL=file-resource.js.map