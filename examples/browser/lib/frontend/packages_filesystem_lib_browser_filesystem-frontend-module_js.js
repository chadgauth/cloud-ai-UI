"use strict";
(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_filesystem_lib_browser_filesystem-frontend-module_js"],{

/***/ "../../packages/filesystem/lib/browser/filesystem-frontend-module.js":
/*!***************************************************************************!*\
  !*** ../../packages/filesystem/lib/browser/filesystem-frontend-module.js ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2017-2018 TypeFox and others.
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
exports.bindFileResource = void 0;
__webpack_require__(/*! ../../src/browser/style/index.css */ "../../packages/filesystem/src/browser/style/index.css");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const file_resource_1 = __webpack_require__(/*! ./file-resource */ "../../packages/filesystem/lib/browser/file-resource.js");
const filesystem_preferences_1 = __webpack_require__(/*! ./filesystem-preferences */ "../../packages/filesystem/lib/browser/filesystem-preferences.js");
const filesystem_frontend_contribution_1 = __webpack_require__(/*! ./filesystem-frontend-contribution */ "../../packages/filesystem/lib/browser/filesystem-frontend-contribution.js");
const file_upload_service_1 = __webpack_require__(/*! ./file-upload-service */ "../../packages/filesystem/lib/browser/file-upload-service.js");
const file_tree_1 = __webpack_require__(/*! ./file-tree */ "../../packages/filesystem/lib/browser/file-tree/index.js");
const file_service_1 = __webpack_require__(/*! ./file-service */ "../../packages/filesystem/lib/browser/file-service.js");
const remote_file_system_provider_1 = __webpack_require__(/*! ../common/remote-file-system-provider */ "../../packages/filesystem/lib/common/remote-file-system-provider.js");
const contribution_provider_1 = __webpack_require__(/*! @theia/core/lib/common/contribution-provider */ "../../packages/core/lib/common/contribution-provider.js");
const remote_file_service_contribution_1 = __webpack_require__(/*! ./remote-file-service-contribution */ "../../packages/filesystem/lib/browser/remote-file-service-contribution.js");
const filesystem_watcher_error_handler_1 = __webpack_require__(/*! ./filesystem-watcher-error-handler */ "../../packages/filesystem/lib/browser/filesystem-watcher-error-handler.js");
const filepath_breadcrumbs_contribution_1 = __webpack_require__(/*! ./breadcrumbs/filepath-breadcrumbs-contribution */ "../../packages/filesystem/lib/browser/breadcrumbs/filepath-breadcrumbs-contribution.js");
const filepath_breadcrumbs_container_1 = __webpack_require__(/*! ./breadcrumbs/filepath-breadcrumbs-container */ "../../packages/filesystem/lib/browser/breadcrumbs/filepath-breadcrumbs-container.js");
const filesystem_save_resource_service_1 = __webpack_require__(/*! ./filesystem-save-resource-service */ "../../packages/filesystem/lib/browser/filesystem-save-resource-service.js");
const save_resource_service_1 = __webpack_require__(/*! @theia/core/lib/browser/save-resource-service */ "../../packages/core/lib/browser/save-resource-service.js");
exports["default"] = new inversify_1.ContainerModule((bind, unbind, isBound, rebind) => {
    (0, filesystem_preferences_1.bindFileSystemPreferences)(bind);
    (0, contribution_provider_1.bindContributionProvider)(bind, file_service_1.FileServiceContribution);
    bind(file_service_1.FileService).toSelf().inSingletonScope();
    bind(remote_file_system_provider_1.RemoteFileSystemServer).toDynamicValue(ctx => browser_1.WebSocketConnectionProvider.createProxy(ctx.container, remote_file_system_provider_1.remoteFileSystemPath, new remote_file_system_provider_1.RemoteFileSystemProxyFactory()));
    bind(remote_file_system_provider_1.RemoteFileSystemProvider).toSelf().inSingletonScope();
    bind(remote_file_service_contribution_1.RemoteFileServiceContribution).toSelf().inSingletonScope();
    bind(file_service_1.FileServiceContribution).toService(remote_file_service_contribution_1.RemoteFileServiceContribution);
    bind(filesystem_watcher_error_handler_1.FileSystemWatcherErrorHandler).toSelf().inSingletonScope();
    bindFileResource(bind);
    bind(file_upload_service_1.FileUploadService).toSelf().inSingletonScope();
    bind(filesystem_frontend_contribution_1.FileSystemFrontendContribution).toSelf().inSingletonScope();
    bind(common_1.CommandContribution).toService(filesystem_frontend_contribution_1.FileSystemFrontendContribution);
    bind(browser_1.FrontendApplicationContribution).toService(filesystem_frontend_contribution_1.FileSystemFrontendContribution);
    bind(file_tree_1.FileTreeLabelProvider).toSelf().inSingletonScope();
    bind(browser_1.LabelProviderContribution).toService(file_tree_1.FileTreeLabelProvider);
    bind(filepath_breadcrumbs_container_1.BreadcrumbsFileTreeWidget).toDynamicValue(ctx => (0, filepath_breadcrumbs_container_1.createFileTreeBreadcrumbsWidget)(ctx.container));
    bind(filepath_breadcrumbs_contribution_1.FilepathBreadcrumbsContribution).toSelf().inSingletonScope();
    bind(browser_1.BreadcrumbsContribution).toService(filepath_breadcrumbs_contribution_1.FilepathBreadcrumbsContribution);
    bind(filesystem_save_resource_service_1.FilesystemSaveResourceService).toSelf().inSingletonScope();
    rebind(save_resource_service_1.SaveResourceService).toService(filesystem_save_resource_service_1.FilesystemSaveResourceService);
    bind(file_tree_1.FileTreeDecoratorAdapter).toSelf().inSingletonScope();
});
function bindFileResource(bind) {
    bind(file_resource_1.FileResourceResolver).toSelf().inSingletonScope();
    bind(common_1.ResourceResolver).toService(file_resource_1.FileResourceResolver);
}
exports.bindFileResource = bindFileResource;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/filesystem/lib/browser/filesystem-frontend-module'] = this;


/***/ }),

/***/ "../../packages/filesystem/lib/browser/remote-file-service-contribution.js":
/*!*********************************************************************************!*\
  !*** ../../packages/filesystem/lib/browser/remote-file-service-contribution.js ***!
  \*********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2020 TypeFox and others.
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
exports.RemoteFileServiceContribution = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const remote_file_system_provider_1 = __webpack_require__(/*! ../common/remote-file-system-provider */ "../../packages/filesystem/lib/common/remote-file-system-provider.js");
let RemoteFileServiceContribution = class RemoteFileServiceContribution {
    registerFileSystemProviders(service) {
        const registering = this.provider.ready.then(() => service.registerProvider('file', this.provider));
        service.onWillActivateFileSystemProvider(event => {
            if (event.scheme === 'file') {
                event.waitUntil(registering);
            }
        });
    }
};
__decorate([
    (0, inversify_1.inject)(remote_file_system_provider_1.RemoteFileSystemProvider),
    __metadata("design:type", remote_file_system_provider_1.RemoteFileSystemProvider)
], RemoteFileServiceContribution.prototype, "provider", void 0);
RemoteFileServiceContribution = __decorate([
    (0, inversify_1.injectable)()
], RemoteFileServiceContribution);
exports.RemoteFileServiceContribution = RemoteFileServiceContribution;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/filesystem/lib/browser/remote-file-service-contribution'] = this;


/***/ }),

/***/ "../../packages/filesystem/lib/common/remote-file-system-provider.js":
/*!***************************************************************************!*\
  !*** ../../packages/filesystem/lib/common/remote-file-system-provider.js ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2020 TypeFox and others.
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
exports.FileSystemProviderServer = exports.RemoteFileSystemProvider = exports.RemoteFileSystemProxyFactory = exports.RemoteFileSystemProviderError = exports.RemoteFileSystemServer = exports.remoteFileSystemPath = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const event_1 = __webpack_require__(/*! @theia/core/lib/common/event */ "../../packages/core/lib/common/event.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
const buffer_1 = __webpack_require__(/*! @theia/core/lib/common/buffer */ "../../packages/core/lib/common/buffer.js");
const files_1 = __webpack_require__(/*! ./files */ "../../packages/filesystem/lib/common/files.js");
const proxy_factory_1 = __webpack_require__(/*! @theia/core/lib/common/messaging/proxy-factory */ "../../packages/core/lib/common/messaging/proxy-factory.js");
const application_error_1 = __webpack_require__(/*! @theia/core/lib/common/application-error */ "../../packages/core/lib/common/application-error.js");
const promise_util_1 = __webpack_require__(/*! @theia/core/lib/common/promise-util */ "../../packages/core/lib/common/promise-util.js");
const stream_1 = __webpack_require__(/*! @theia/core/lib/common/stream */ "../../packages/core/lib/common/stream.js");
const cancellation_1 = __webpack_require__(/*! @theia/core/lib/common/cancellation */ "../../packages/core/lib/common/cancellation.js");
exports.remoteFileSystemPath = '/services/remote-filesystem';
exports.RemoteFileSystemServer = Symbol('RemoteFileSystemServer');
exports.RemoteFileSystemProviderError = application_error_1.ApplicationError.declare(-33005, (message, data, stack) => ({ message, data, stack }));
class RemoteFileSystemProxyFactory extends proxy_factory_1.RpcProxyFactory {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    serializeError(e) {
        if (e instanceof files_1.FileSystemProviderError) {
            const { code, name } = e;
            return super.serializeError((0, exports.RemoteFileSystemProviderError)(e.message, { code, name }, e.stack));
        }
        return super.serializeError(e);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    deserializeError(capturedError, e) {
        const error = super.deserializeError(capturedError, e);
        if (exports.RemoteFileSystemProviderError.is(error)) {
            const fileOperationError = new files_1.FileSystemProviderError(error.message, error.data.code);
            fileOperationError.name = error.data.name;
            fileOperationError.stack = error.stack;
            return fileOperationError;
        }
        return e;
    }
}
exports.RemoteFileSystemProxyFactory = RemoteFileSystemProxyFactory;
/**
 * Frontend component.
 *
 * Wraps the remote filesystem provider living on the backend.
 */
let RemoteFileSystemProvider = class RemoteFileSystemProvider {
    constructor() {
        this.onDidChangeFileEmitter = new event_1.Emitter();
        this.onDidChangeFile = this.onDidChangeFileEmitter.event;
        this.onFileWatchErrorEmitter = new event_1.Emitter();
        this.onFileWatchError = this.onFileWatchErrorEmitter.event;
        this.onDidChangeCapabilitiesEmitter = new event_1.Emitter();
        this.onDidChangeCapabilities = this.onDidChangeCapabilitiesEmitter.event;
        this.onFileStreamDataEmitter = new event_1.Emitter();
        this.onFileStreamData = this.onFileStreamDataEmitter.event;
        this.onFileStreamEndEmitter = new event_1.Emitter();
        this.onFileStreamEnd = this.onFileStreamEndEmitter.event;
        this.toDispose = new disposable_1.DisposableCollection(this.onDidChangeFileEmitter, this.onDidChangeCapabilitiesEmitter, this.onFileStreamDataEmitter, this.onFileStreamEndEmitter);
        this.watcherSequence = 0;
        /**
         * We'll track the currently allocated watchers, in order to re-allocate them
         * with the same options once we reconnect to the backend after a disconnection.
         */
        this.watchOptions = new Map();
        this._capabilities = 0;
        this.readyDeferred = new promise_util_1.Deferred();
        this.ready = this.readyDeferred.promise;
    }
    get capabilities() { return this._capabilities; }
    init() {
        this.server.getCapabilities().then(capabilities => {
            this._capabilities = capabilities;
            this.readyDeferred.resolve();
        }, this.readyDeferred.reject);
        this.server.setClient({
            notifyDidChangeFile: ({ changes }) => {
                this.onDidChangeFileEmitter.fire(changes.map(event => ({ resource: new uri_1.default(event.resource), type: event.type })));
            },
            notifyFileWatchError: () => {
                this.onFileWatchErrorEmitter.fire();
            },
            notifyDidChangeCapabilities: capabilities => this.setCapabilities(capabilities),
            onFileStreamData: (handle, data) => this.onFileStreamDataEmitter.fire([handle, data]),
            onFileStreamEnd: (handle, error) => this.onFileStreamEndEmitter.fire([handle, error])
        });
        const onInitialized = this.server.onDidOpenConnection(() => {
            // skip reconnection on the first connection
            onInitialized.dispose();
            this.toDispose.push(this.server.onDidOpenConnection(() => this.reconnect()));
        });
    }
    dispose() {
        this.toDispose.dispose();
    }
    setCapabilities(capabilities) {
        this._capabilities = capabilities;
        this.onDidChangeCapabilitiesEmitter.fire(undefined);
    }
    // --- forwarding calls
    stat(resource) {
        return this.server.stat(resource.toString());
    }
    access(resource, mode) {
        return this.server.access(resource.toString(), mode);
    }
    fsPath(resource) {
        return this.server.fsPath(resource.toString());
    }
    open(resource, opts) {
        return this.server.open(resource.toString(), opts);
    }
    close(fd) {
        return this.server.close(fd);
    }
    async read(fd, pos, data, offset, length) {
        const { bytes, bytesRead } = await this.server.read(fd, pos, length);
        // copy back the data that was written into the buffer on the remote
        // side. we need to do this because buffers are not referenced by
        // pointer, but only by value and as such cannot be directly written
        // to from the other process.
        data.set(bytes.slice(0, bytesRead), offset);
        return bytesRead;
    }
    async readFile(resource) {
        const bytes = await this.server.readFile(resource.toString());
        return bytes;
    }
    readFileStream(resource, opts, token) {
        const capturedError = new Error();
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const stream = (0, stream_1.newWriteableStream)(data => buffer_1.BinaryBuffer.concat(data.map(data => buffer_1.BinaryBuffer.wrap(data))).buffer);
        this.server.readFileStream(resource.toString(), opts, token).then(streamHandle => {
            if (token.isCancellationRequested) {
                stream.end((0, cancellation_1.cancelled)());
                return;
            }
            const toDispose = new disposable_1.DisposableCollection(token.onCancellationRequested(() => stream.end((0, cancellation_1.cancelled)())), this.onFileStreamData(([handle, data]) => {
                if (streamHandle === handle) {
                    stream.write(data);
                }
            }), this.onFileStreamEnd(([handle, error]) => {
                if (streamHandle === handle) {
                    if (error) {
                        const code = ('code' in error && error.code) || files_1.FileSystemProviderErrorCode.Unknown;
                        const fileOperationError = new files_1.FileSystemProviderError(error.message, code);
                        fileOperationError.name = error.name;
                        const capturedStack = capturedError.stack || '';
                        fileOperationError.stack = `${capturedStack}\nCaused by: ${error.stack}`;
                        stream.end(fileOperationError);
                    }
                    else {
                        stream.end();
                    }
                }
            }));
            stream.on('end', () => toDispose.dispose());
        }, error => stream.end(error));
        return stream;
    }
    write(fd, pos, data, offset, length) {
        return this.server.write(fd, pos, data, offset, length);
    }
    writeFile(resource, content, opts) {
        return this.server.writeFile(resource.toString(), content, opts);
    }
    delete(resource, opts) {
        return this.server.delete(resource.toString(), opts);
    }
    mkdir(resource) {
        return this.server.mkdir(resource.toString());
    }
    readdir(resource) {
        return this.server.readdir(resource.toString());
    }
    rename(resource, target, opts) {
        return this.server.rename(resource.toString(), target.toString(), opts);
    }
    copy(resource, target, opts) {
        return this.server.copy(resource.toString(), target.toString(), opts);
    }
    updateFile(resource, changes, opts) {
        return this.server.updateFile(resource.toString(), changes, opts);
    }
    watch(resource, options) {
        const watcherId = this.watcherSequence++;
        const uri = resource.toString();
        this.watchOptions.set(watcherId, { uri, options });
        this.server.watch(watcherId, uri, options);
        const toUnwatch = disposable_1.Disposable.create(() => {
            this.watchOptions.delete(watcherId);
            this.server.unwatch(watcherId);
        });
        this.toDispose.push(toUnwatch);
        return toUnwatch;
    }
    /**
     * When a frontend disconnects (e.g. bad connection) the backend resources will be cleared.
     *
     * This means that we need to re-allocate the watchers when a frontend reconnects.
     */
    reconnect() {
        for (const [watcher, { uri, options }] of this.watchOptions.entries()) {
            this.server.watch(watcher, uri, options);
        }
    }
};
__decorate([
    (0, inversify_1.inject)(exports.RemoteFileSystemServer),
    __metadata("design:type", Object)
], RemoteFileSystemProvider.prototype, "server", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RemoteFileSystemProvider.prototype, "init", null);
RemoteFileSystemProvider = __decorate([
    (0, inversify_1.injectable)()
], RemoteFileSystemProvider);
exports.RemoteFileSystemProvider = RemoteFileSystemProvider;
/**
 * Backend component.
 *
 * JSON-RPC server exposing a wrapped file system provider remotely.
 */
let FileSystemProviderServer = class FileSystemProviderServer {
    constructor() {
        this.BUFFER_SIZE = 64 * 1024;
        /**
         * Mapping of `watcherId` to a disposable watcher handle.
         */
        this.watchers = new Map();
        this.toDispose = new disposable_1.DisposableCollection();
        this.readFileStreamSeq = 0;
    }
    dispose() {
        this.toDispose.dispose();
    }
    setClient(client) {
        this.client = client;
    }
    init() {
        if (this.provider.dispose) {
            this.toDispose.push(disposable_1.Disposable.create(() => this.provider.dispose()));
        }
        this.toDispose.push(this.provider.onDidChangeCapabilities(() => {
            if (this.client) {
                this.client.notifyDidChangeCapabilities(this.provider.capabilities);
            }
        }));
        this.toDispose.push(this.provider.onDidChangeFile(changes => {
            if (this.client) {
                this.client.notifyDidChangeFile({
                    changes: changes.map(({ resource, type }) => ({ resource: resource.toString(), type }))
                });
            }
        }));
        this.toDispose.push(this.provider.onFileWatchError(() => {
            if (this.client) {
                this.client.notifyFileWatchError();
            }
        }));
    }
    async getCapabilities() {
        return this.provider.capabilities;
    }
    stat(resource) {
        return this.provider.stat(new uri_1.default(resource));
    }
    access(resource, mode) {
        if ((0, files_1.hasAccessCapability)(this.provider)) {
            return this.provider.access(new uri_1.default(resource), mode);
        }
        throw new Error('not supported');
    }
    async fsPath(resource) {
        if ((0, files_1.hasAccessCapability)(this.provider)) {
            return this.provider.fsPath(new uri_1.default(resource));
        }
        throw new Error('not supported');
    }
    open(resource, opts) {
        if ((0, files_1.hasOpenReadWriteCloseCapability)(this.provider)) {
            return this.provider.open(new uri_1.default(resource), opts);
        }
        throw new Error('not supported');
    }
    close(fd) {
        if ((0, files_1.hasOpenReadWriteCloseCapability)(this.provider)) {
            return this.provider.close(fd);
        }
        throw new Error('not supported');
    }
    async read(fd, pos, length) {
        if ((0, files_1.hasOpenReadWriteCloseCapability)(this.provider)) {
            const buffer = buffer_1.BinaryBuffer.alloc(this.BUFFER_SIZE);
            const bytes = buffer.buffer;
            const bytesRead = await this.provider.read(fd, pos, bytes, 0, length);
            return { bytes, bytesRead };
        }
        throw new Error('not supported');
    }
    write(fd, pos, data, offset, length) {
        if ((0, files_1.hasOpenReadWriteCloseCapability)(this.provider)) {
            return this.provider.write(fd, pos, data, offset, length);
        }
        throw new Error('not supported');
    }
    async readFile(resource) {
        if ((0, files_1.hasReadWriteCapability)(this.provider)) {
            return this.provider.readFile(new uri_1.default(resource));
        }
        throw new Error('not supported');
    }
    writeFile(resource, content, opts) {
        if ((0, files_1.hasReadWriteCapability)(this.provider)) {
            return this.provider.writeFile(new uri_1.default(resource), content, opts);
        }
        throw new Error('not supported');
    }
    delete(resource, opts) {
        return this.provider.delete(new uri_1.default(resource), opts);
    }
    mkdir(resource) {
        return this.provider.mkdir(new uri_1.default(resource));
    }
    readdir(resource) {
        return this.provider.readdir(new uri_1.default(resource));
    }
    rename(source, target, opts) {
        return this.provider.rename(new uri_1.default(source), new uri_1.default(target), opts);
    }
    copy(source, target, opts) {
        if ((0, files_1.hasFileFolderCopyCapability)(this.provider)) {
            return this.provider.copy(new uri_1.default(source), new uri_1.default(target), opts);
        }
        throw new Error('not supported');
    }
    updateFile(resource, changes, opts) {
        if ((0, files_1.hasUpdateCapability)(this.provider)) {
            return this.provider.updateFile(new uri_1.default(resource), changes, opts);
        }
        throw new Error('not supported');
    }
    async watch(requestedWatcherId, resource, opts) {
        if (this.watchers.has(requestedWatcherId)) {
            throw new Error('watcher id is already allocated!');
        }
        const watcher = this.provider.watch(new uri_1.default(resource), opts);
        this.watchers.set(requestedWatcherId, watcher);
        this.toDispose.push(disposable_1.Disposable.create(() => this.unwatch(requestedWatcherId)));
    }
    async unwatch(watcherId) {
        const watcher = this.watchers.get(watcherId);
        if (watcher) {
            this.watchers.delete(watcherId);
            watcher.dispose();
        }
    }
    async readFileStream(resource, opts, token) {
        if ((0, files_1.hasFileReadStreamCapability)(this.provider)) {
            const handle = this.readFileStreamSeq++;
            const stream = this.provider.readFileStream(new uri_1.default(resource), opts, token);
            stream.on('data', data => { var _a; return (_a = this.client) === null || _a === void 0 ? void 0 : _a.onFileStreamData(handle, data); });
            stream.on('error', error => {
                var _a;
                const code = error instanceof files_1.FileSystemProviderError ? error.code : undefined;
                const { name, message, stack } = error;
                (_a = this.client) === null || _a === void 0 ? void 0 : _a.onFileStreamEnd(handle, { code, name, message, stack });
            });
            stream.on('end', () => { var _a; return (_a = this.client) === null || _a === void 0 ? void 0 : _a.onFileStreamEnd(handle, undefined); });
            return handle;
        }
        throw new Error('not supported');
    }
};
__decorate([
    (0, inversify_1.inject)(files_1.FileSystemProvider),
    __metadata("design:type", Object)
], FileSystemProviderServer.prototype, "provider", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FileSystemProviderServer.prototype, "init", null);
FileSystemProviderServer = __decorate([
    (0, inversify_1.injectable)()
], FileSystemProviderServer);
exports.FileSystemProviderServer = FileSystemProviderServer;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/filesystem/lib/common/remote-file-system-provider'] = this;


/***/ }),

/***/ "../../node_modules/css-loader/dist/cjs.js!../../packages/filesystem/src/browser/style/file-dialog.css":
/*!*************************************************************************************************************!*\
  !*** ../../node_modules/css-loader/dist/cjs.js!../../packages/filesystem/src/browser/style/file-dialog.css ***!
  \*************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "../../node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/api.js */ "../../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/********************************************************************************
 * Copyright (C) 2017 TypeFox and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0
 ********************************************************************************/

:root {
  --theia-private-file-dialog-input-height: 21px;
  --theia-private-location-list-panel-left: 92px;
  --theia-private-location-list-panel-width: 407px;
  --theia-private-navigation-panel-icon-size: 21px;
  --theia-private-navigation-panel-line-height: 23px;
}

/*
  * Open and Save file dialogs
  */

.dialogContent .theia-FileDialog,
.dialogContent .theia-SaveFileDialog,
.dialogContent .theia-ResponsiveFileDialog {
  height: 500px;
  width: 500px;
  border: 1px solid var(--theia-editorWidget-border);
  background: var(--theia-dropdown-background);
}

@media only screen and (max-height: 700px) {
  .dialogContent .theia-FileDialog,
  .dialogContent .theia-SaveFileDialog,
  .dialogContent .theia-ResponsiveFileDialog {
    height: 300px;
  }
}

.dialogContent .theia-NavigationPanel,
.dialogContent .theia-FiltersPanel,
.dialogContent .theia-FileNamePanel {
  display: block;
  position: relative;
  overflow: hidden;
}

.dialogContent .theia-NavigationPanel,
.dialogContent .theia-FiltersPanel {
  min-height: 27px;
}

.dialogContent .theia-FileNamePanel {
  height: 31px;
}

/*
 * Navigation panel items
 */

.dialogContent .theia-NavigationPanel span {
  position: absolute;
  top: 2px;
  line-height: var(--theia-private-navigation-panel-line-height);
  cursor: pointer;
  width: var(--theia-private-navigation-panel-icon-size);
  text-align: center;
}

.dialogContent .theia-NavigationPanel span:focus {
  outline: none;
  box-shadow: none;
}

.dialogContent .theia-NavigationPanel span:focus-visible {
  outline-width: 1px;
  outline-style: solid;
  outline-offset: -1px;
  opacity: 1 !important;
  outline-color: var(--theia-focusBorder);
}

.dialogContent span.theia-mod-disabled {
  pointer-events: none;
  cursor: default;
}

.dialogContent span.theia-mod-disabled .action-label {
  background: none;
}

.dialogContent .theia-NavigationBack {
  left: auto;
}

.dialogContent .theia-NavigationForward {
  left: 23px;
}

.dialogContent .theia-NavigationHome {
  left: 45px;
}

.dialogContent .theia-NavigationUp {
  left: 67px;
}

.dialogContent .theia-LocationListPanel {
  position: absolute;
  display: flex;
  top: 1px;
  left: var(--theia-private-location-list-panel-left);
  width: var(--theia-private-location-list-panel-width);
  height: var(--theia-private-file-dialog-input-height);
}

.dialogContent .theia-LocationInputToggle {
  text-align: center;
  left: 0;
  width: var(--theia-private-navigation-panel-icon-size);
  height: var(--theia-private-navigation-panel-icon-size);
  z-index: 1;
}

.dialogContent .theia-LocationList,
.dialogContent .theia-LocationTextInput {
  box-sizing: content-box;
  padding: unset;
  position: absolute;
  top: 0;
  left: 0;
  height: var(--theia-private-file-dialog-input-height);
  border: var(--theia-border-width) solid var(--theia-input-border);
}

.dialogContent .theia-LocationList,
.dialogContent .theia-LocationTextInput {
  padding-left: var(--theia-private-navigation-panel-icon-size);
  width: calc(100% - var(--theia-private-navigation-panel-icon-size));
}

/*
 * Filters panel items
 */

.dialogContent .theia-FiltersLabel {
  position: absolute;
  left: 1px;
  top: 0px;
  line-height: 27px;
}

.dialogContent .theia-FiltersListPanel {
  position: absolute;
  left: 72px;
  top: 3px;
}

.dialogContent .theia-FileTreeFiltersList {
  width: 427px;
  height: var(--theia-private-file-dialog-input-height);
}

/*
 * File name panel items
 */

.dialogContent .theia-FileNameLabel {
  position: absolute;
  left: 1px;
  top: 0px;
  line-height: 23px;
}

.dialogContent .theia-FileNameTextField {
  position: absolute;
  left: 72px;
  top: 0px;
  width: 420px;
}

/*
 * Control panel items
 */

.dialogContent .theia-ControlPanel {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-bottom: 0px;
}

.dialogContent .theia-ControlPanel > * {
  margin-left: 4px;
}

.dialogContent .theia-ToggleHiddenInputContainer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-top: var(--theia-ui-padding);
}
`, "",{"version":3,"sources":["webpack://./../../packages/filesystem/src/browser/style/file-dialog.css"],"names":[],"mappings":"AAAA;;;;;;;;;;;;;;iFAciF;;AAEjF;EACE,8CAA8C;EAC9C,8CAA8C;EAC9C,gDAAgD;EAChD,gDAAgD;EAChD,kDAAkD;AACpD;;AAEA;;GAEG;;AAEH;;;EAGE,aAAa;EACb,YAAY;EACZ,kDAAkD;EAClD,4CAA4C;AAC9C;;AAEA;EACE;;;IAGE,aAAa;EACf;AACF;;AAEA;;;EAGE,cAAc;EACd,kBAAkB;EAClB,gBAAgB;AAClB;;AAEA;;EAEE,gBAAgB;AAClB;;AAEA;EACE,YAAY;AACd;;AAEA;;EAEE;;AAEF;EACE,kBAAkB;EAClB,QAAQ;EACR,8DAA8D;EAC9D,eAAe;EACf,sDAAsD;EACtD,kBAAkB;AACpB;;AAEA;EACE,aAAa;EACb,gBAAgB;AAClB;;AAEA;EACE,kBAAkB;EAClB,oBAAoB;EACpB,oBAAoB;EACpB,qBAAqB;EACrB,uCAAuC;AACzC;;AAEA;EACE,oBAAoB;EACpB,eAAe;AACjB;;AAEA;EACE,gBAAgB;AAClB;;AAEA;EACE,UAAU;AACZ;;AAEA;EACE,UAAU;AACZ;;AAEA;EACE,UAAU;AACZ;;AAEA;EACE,UAAU;AACZ;;AAEA;EACE,kBAAkB;EAClB,aAAa;EACb,QAAQ;EACR,mDAAmD;EACnD,qDAAqD;EACrD,qDAAqD;AACvD;;AAEA;EACE,kBAAkB;EAClB,OAAO;EACP,sDAAsD;EACtD,uDAAuD;EACvD,UAAU;AACZ;;AAEA;;EAEE,uBAAuB;EACvB,cAAc;EACd,kBAAkB;EAClB,MAAM;EACN,OAAO;EACP,qDAAqD;EACrD,iEAAiE;AACnE;;AAEA;;EAEE,6DAA6D;EAC7D,mEAAmE;AACrE;;AAEA;;EAEE;;AAEF;EACE,kBAAkB;EAClB,SAAS;EACT,QAAQ;EACR,iBAAiB;AACnB;;AAEA;EACE,kBAAkB;EAClB,UAAU;EACV,QAAQ;AACV;;AAEA;EACE,YAAY;EACZ,qDAAqD;AACvD;;AAEA;;EAEE;;AAEF;EACE,kBAAkB;EAClB,SAAS;EACT,QAAQ;EACR,iBAAiB;AACnB;;AAEA;EACE,kBAAkB;EAClB,UAAU;EACV,QAAQ;EACR,YAAY;AACd;;AAEA;;EAEE;;AAEF;EACE,aAAa;EACb,mBAAmB;EACnB,yBAAyB;EACzB,kBAAkB;AACpB;;AAEA;EACE,gBAAgB;AAClB;;AAEA;EACE,aAAa;EACb,yBAAyB;EACzB,mBAAmB;EACnB,oCAAoC;AACtC","sourcesContent":["/********************************************************************************\n * Copyright (C) 2017 TypeFox and others.\n *\n * This program and the accompanying materials are made available under the\n * terms of the Eclipse Public License v. 2.0 which is available at\n * http://www.eclipse.org/legal/epl-2.0.\n *\n * This Source Code may also be made available under the following Secondary\n * Licenses when the conditions for such availability set forth in the Eclipse\n * Public License v. 2.0 are satisfied: GNU General Public License, version 2\n * with the GNU Classpath Exception which is available at\n * https://www.gnu.org/software/classpath/license.html.\n *\n * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0\n ********************************************************************************/\n\n:root {\n  --theia-private-file-dialog-input-height: 21px;\n  --theia-private-location-list-panel-left: 92px;\n  --theia-private-location-list-panel-width: 407px;\n  --theia-private-navigation-panel-icon-size: 21px;\n  --theia-private-navigation-panel-line-height: 23px;\n}\n\n/*\n  * Open and Save file dialogs\n  */\n\n.dialogContent .theia-FileDialog,\n.dialogContent .theia-SaveFileDialog,\n.dialogContent .theia-ResponsiveFileDialog {\n  height: 500px;\n  width: 500px;\n  border: 1px solid var(--theia-editorWidget-border);\n  background: var(--theia-dropdown-background);\n}\n\n@media only screen and (max-height: 700px) {\n  .dialogContent .theia-FileDialog,\n  .dialogContent .theia-SaveFileDialog,\n  .dialogContent .theia-ResponsiveFileDialog {\n    height: 300px;\n  }\n}\n\n.dialogContent .theia-NavigationPanel,\n.dialogContent .theia-FiltersPanel,\n.dialogContent .theia-FileNamePanel {\n  display: block;\n  position: relative;\n  overflow: hidden;\n}\n\n.dialogContent .theia-NavigationPanel,\n.dialogContent .theia-FiltersPanel {\n  min-height: 27px;\n}\n\n.dialogContent .theia-FileNamePanel {\n  height: 31px;\n}\n\n/*\n * Navigation panel items\n */\n\n.dialogContent .theia-NavigationPanel span {\n  position: absolute;\n  top: 2px;\n  line-height: var(--theia-private-navigation-panel-line-height);\n  cursor: pointer;\n  width: var(--theia-private-navigation-panel-icon-size);\n  text-align: center;\n}\n\n.dialogContent .theia-NavigationPanel span:focus {\n  outline: none;\n  box-shadow: none;\n}\n\n.dialogContent .theia-NavigationPanel span:focus-visible {\n  outline-width: 1px;\n  outline-style: solid;\n  outline-offset: -1px;\n  opacity: 1 !important;\n  outline-color: var(--theia-focusBorder);\n}\n\n.dialogContent span.theia-mod-disabled {\n  pointer-events: none;\n  cursor: default;\n}\n\n.dialogContent span.theia-mod-disabled .action-label {\n  background: none;\n}\n\n.dialogContent .theia-NavigationBack {\n  left: auto;\n}\n\n.dialogContent .theia-NavigationForward {\n  left: 23px;\n}\n\n.dialogContent .theia-NavigationHome {\n  left: 45px;\n}\n\n.dialogContent .theia-NavigationUp {\n  left: 67px;\n}\n\n.dialogContent .theia-LocationListPanel {\n  position: absolute;\n  display: flex;\n  top: 1px;\n  left: var(--theia-private-location-list-panel-left);\n  width: var(--theia-private-location-list-panel-width);\n  height: var(--theia-private-file-dialog-input-height);\n}\n\n.dialogContent .theia-LocationInputToggle {\n  text-align: center;\n  left: 0;\n  width: var(--theia-private-navigation-panel-icon-size);\n  height: var(--theia-private-navigation-panel-icon-size);\n  z-index: 1;\n}\n\n.dialogContent .theia-LocationList,\n.dialogContent .theia-LocationTextInput {\n  box-sizing: content-box;\n  padding: unset;\n  position: absolute;\n  top: 0;\n  left: 0;\n  height: var(--theia-private-file-dialog-input-height);\n  border: var(--theia-border-width) solid var(--theia-input-border);\n}\n\n.dialogContent .theia-LocationList,\n.dialogContent .theia-LocationTextInput {\n  padding-left: var(--theia-private-navigation-panel-icon-size);\n  width: calc(100% - var(--theia-private-navigation-panel-icon-size));\n}\n\n/*\n * Filters panel items\n */\n\n.dialogContent .theia-FiltersLabel {\n  position: absolute;\n  left: 1px;\n  top: 0px;\n  line-height: 27px;\n}\n\n.dialogContent .theia-FiltersListPanel {\n  position: absolute;\n  left: 72px;\n  top: 3px;\n}\n\n.dialogContent .theia-FileTreeFiltersList {\n  width: 427px;\n  height: var(--theia-private-file-dialog-input-height);\n}\n\n/*\n * File name panel items\n */\n\n.dialogContent .theia-FileNameLabel {\n  position: absolute;\n  left: 1px;\n  top: 0px;\n  line-height: 23px;\n}\n\n.dialogContent .theia-FileNameTextField {\n  position: absolute;\n  left: 72px;\n  top: 0px;\n  width: 420px;\n}\n\n/*\n * Control panel items\n */\n\n.dialogContent .theia-ControlPanel {\n  display: flex;\n  flex-direction: row;\n  justify-content: flex-end;\n  margin-bottom: 0px;\n}\n\n.dialogContent .theia-ControlPanel > * {\n  margin-left: 4px;\n}\n\n.dialogContent .theia-ToggleHiddenInputContainer {\n  display: flex;\n  justify-content: flex-end;\n  align-items: center;\n  padding-top: var(--theia-ui-padding);\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../node_modules/css-loader/dist/cjs.js!../../packages/filesystem/src/browser/style/file-icons.css":
/*!************************************************************************************************************!*\
  !*** ../../node_modules/css-loader/dist/cjs.js!../../packages/filesystem/src/browser/style/file-icons.css ***!
  \************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "../../node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/api.js */ "../../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/********************************************************************************
 * Copyright (C) 2017 TypeFox and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0
 ********************************************************************************/

.theia-file-icons-js {
  /*
    Here, the \`line-height\` ensures that FontAwesome and \`file-icons-js\` container has the same height.
    Ideally, it would be 1 em, but since we set the max height above (and other places too) with 0.8
    multiplier, we use 0.8 em here too.
     */
  line-height: 0.8em;
}

.theia-file-icons-js:before {
  font-size: calc(var(--theia-content-font-size) * 0.8);
}

.p-TabBar-tabIcon.theia-file-icons-js.file-icon {
  padding-left: 1px !important;
  padding-right: 3px !important;
}

.theia-file-icons-js.file-icon {
  min-width: var(--theia-icon-size);
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 2px;
  padding-right: 4px;
}

.default-folder-icon,
.default-file-icon {
  padding-right: 6px;
}

.fa-file:before,
.fa-folder:before,
.theia-file-icons-js:before {
  text-align: center;
  margin-right: 4px;
}

.theia-app-sides .theia-file-icons-js {
  max-height: none;
  line-height: inherit;
}

.theia-app-sides .theia-file-icons-js:before {
  font-size: var(--theia-private-sidebar-icon-size);
  margin-right: 0px;
}
`, "",{"version":3,"sources":["webpack://./../../packages/filesystem/src/browser/style/file-icons.css"],"names":[],"mappings":"AAAA;;;;;;;;;;;;;;iFAciF;;AAEjF;EACE;;;;MAII;EACJ,kBAAkB;AACpB;;AAEA;EACE,qDAAqD;AACvD;;AAEA;EACE,4BAA4B;EAC5B,6BAA6B;AAC/B;;AAEA;EACE,iCAAiC;EACjC,aAAa;EACb,uBAAuB;EACvB,mBAAmB;EACnB,iBAAiB;EACjB,kBAAkB;AACpB;;AAEA;;EAEE,kBAAkB;AACpB;;AAEA;;;EAGE,kBAAkB;EAClB,iBAAiB;AACnB;;AAEA;EACE,gBAAgB;EAChB,oBAAoB;AACtB;;AAEA;EACE,iDAAiD;EACjD,iBAAiB;AACnB","sourcesContent":["/********************************************************************************\n * Copyright (C) 2017 TypeFox and others.\n *\n * This program and the accompanying materials are made available under the\n * terms of the Eclipse Public License v. 2.0 which is available at\n * http://www.eclipse.org/legal/epl-2.0.\n *\n * This Source Code may also be made available under the following Secondary\n * Licenses when the conditions for such availability set forth in the Eclipse\n * Public License v. 2.0 are satisfied: GNU General Public License, version 2\n * with the GNU Classpath Exception which is available at\n * https://www.gnu.org/software/classpath/license.html.\n *\n * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0\n ********************************************************************************/\n\n.theia-file-icons-js {\n  /*\n    Here, the `line-height` ensures that FontAwesome and `file-icons-js` container has the same height.\n    Ideally, it would be 1 em, but since we set the max height above (and other places too) with 0.8\n    multiplier, we use 0.8 em here too.\n     */\n  line-height: 0.8em;\n}\n\n.theia-file-icons-js:before {\n  font-size: calc(var(--theia-content-font-size) * 0.8);\n}\n\n.p-TabBar-tabIcon.theia-file-icons-js.file-icon {\n  padding-left: 1px !important;\n  padding-right: 3px !important;\n}\n\n.theia-file-icons-js.file-icon {\n  min-width: var(--theia-icon-size);\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  padding-left: 2px;\n  padding-right: 4px;\n}\n\n.default-folder-icon,\n.default-file-icon {\n  padding-right: 6px;\n}\n\n.fa-file:before,\n.fa-folder:before,\n.theia-file-icons-js:before {\n  text-align: center;\n  margin-right: 4px;\n}\n\n.theia-app-sides .theia-file-icons-js {\n  max-height: none;\n  line-height: inherit;\n}\n\n.theia-app-sides .theia-file-icons-js:before {\n  font-size: var(--theia-private-sidebar-icon-size);\n  margin-right: 0px;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../node_modules/css-loader/dist/cjs.js!../../packages/filesystem/src/browser/style/filepath-breadcrumbs.css":
/*!**********************************************************************************************************************!*\
  !*** ../../node_modules/css-loader/dist/cjs.js!../../packages/filesystem/src/browser/style/filepath-breadcrumbs.css ***!
  \**********************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "../../node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/api.js */ "../../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/********************************************************************************
 * Copyright (C) 2019 TypeFox and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0
 ********************************************************************************/

.theia-FilepathBreadcrumbFileTree {
  height: auto;
  max-height: 200px;
}
`, "",{"version":3,"sources":["webpack://./../../packages/filesystem/src/browser/style/filepath-breadcrumbs.css"],"names":[],"mappings":"AAAA;;;;;;;;;;;;;;iFAciF;;AAEjF;EACE,YAAY;EACZ,iBAAiB;AACnB","sourcesContent":["/********************************************************************************\n * Copyright (C) 2019 TypeFox and others.\n *\n * This program and the accompanying materials are made available under the\n * terms of the Eclipse Public License v. 2.0 which is available at\n * http://www.eclipse.org/legal/epl-2.0.\n *\n * This Source Code may also be made available under the following Secondary\n * Licenses when the conditions for such availability set forth in the Eclipse\n * Public License v. 2.0 are satisfied: GNU General Public License, version 2\n * with the GNU Classpath Exception which is available at\n * https://www.gnu.org/software/classpath/license.html.\n *\n * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0\n ********************************************************************************/\n\n.theia-FilepathBreadcrumbFileTree {\n  height: auto;\n  max-height: 200px;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../node_modules/css-loader/dist/cjs.js!../../packages/filesystem/src/browser/style/index.css":
/*!*******************************************************************************************************!*\
  !*** ../../node_modules/css-loader/dist/cjs.js!../../packages/filesystem/src/browser/style/index.css ***!
  \*******************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "../../node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/api.js */ "../../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_file_dialog_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! -!../../../../../node_modules/css-loader/dist/cjs.js!./file-dialog.css */ "../../node_modules/css-loader/dist/cjs.js!../../packages/filesystem/src/browser/style/file-dialog.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_file_icons_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! -!../../../../../node_modules/css-loader/dist/cjs.js!./file-icons.css */ "../../node_modules/css-loader/dist/cjs.js!../../packages/filesystem/src/browser/style/file-icons.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_filepath_breadcrumbs_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! -!../../../../../node_modules/css-loader/dist/cjs.js!./filepath-breadcrumbs.css */ "../../node_modules/css-loader/dist/cjs.js!../../packages/filesystem/src/browser/style/filepath-breadcrumbs.css");
// Imports





var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_file_dialog_css__WEBPACK_IMPORTED_MODULE_2__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_file_icons_css__WEBPACK_IMPORTED_MODULE_3__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_filepath_breadcrumbs_css__WEBPACK_IMPORTED_MODULE_4__["default"]);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/********************************************************************************
 * Copyright (C) 2017 TypeFox and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0
 ********************************************************************************/

.theia-file-tree-drag-image {
  position: absolute;
  /*
    make sure you don't see it flashing
     */
  top: -1000px;
  font-size: var(--theia-ui-font-size1);
  display: inline-block;
  padding: 1px calc(var(--theia-ui-padding) * 2);
  border-radius: 10px;

  background: var(--theia-list-activeSelectionBackground);
  color: var(--theia-list-activeSelectionForeground);
  outline: 1px solid var(--theia-contrastActiveBorder);
  outline-offset: -1px;
}
`, "",{"version":3,"sources":["webpack://./../../packages/filesystem/src/browser/style/index.css"],"names":[],"mappings":"AAAA;;;;;;;;;;;;;;iFAciF;;AAMjF;EACE,kBAAkB;EAClB;;MAEI;EACJ,YAAY;EACZ,qCAAqC;EACrC,qBAAqB;EACrB,8CAA8C;EAC9C,mBAAmB;;EAEnB,uDAAuD;EACvD,kDAAkD;EAClD,oDAAoD;EACpD,oBAAoB;AACtB","sourcesContent":["/********************************************************************************\n * Copyright (C) 2017 TypeFox and others.\n *\n * This program and the accompanying materials are made available under the\n * terms of the Eclipse Public License v. 2.0 which is available at\n * http://www.eclipse.org/legal/epl-2.0.\n *\n * This Source Code may also be made available under the following Secondary\n * Licenses when the conditions for such availability set forth in the Eclipse\n * Public License v. 2.0 are satisfied: GNU General Public License, version 2\n * with the GNU Classpath Exception which is available at\n * https://www.gnu.org/software/classpath/license.html.\n *\n * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0\n ********************************************************************************/\n\n@import \"./file-dialog.css\";\n@import \"./file-icons.css\";\n@import \"./filepath-breadcrumbs.css\";\n\n.theia-file-tree-drag-image {\n  position: absolute;\n  /*\n    make sure you don't see it flashing\n     */\n  top: -1000px;\n  font-size: var(--theia-ui-font-size1);\n  display: inline-block;\n  padding: 1px calc(var(--theia-ui-padding) * 2);\n  border-radius: 10px;\n\n  background: var(--theia-list-activeSelectionBackground);\n  color: var(--theia-list-activeSelectionForeground);\n  outline: 1px solid var(--theia-contrastActiveBorder);\n  outline-offset: -1px;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../packages/filesystem/src/browser/style/index.css":
/*!*************************************************************!*\
  !*** ../../packages/filesystem/src/browser/style/index.css ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/css-loader/dist/cjs.js!./index.css */ "../../node_modules/css-loader/dist/cjs.js!../../packages/filesystem/src/browser/style/index.css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ })

}]);
//# sourceMappingURL=packages_filesystem_lib_browser_filesystem-frontend-module_js.js.map