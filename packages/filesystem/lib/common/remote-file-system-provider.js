"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSystemProviderServer = exports.RemoteFileSystemProvider = exports.RemoteFileSystemProxyFactory = exports.RemoteFileSystemProviderError = exports.RemoteFileSystemServer = exports.remoteFileSystemPath = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const uri_1 = require("@theia/core/lib/common/uri");
const event_1 = require("@theia/core/lib/common/event");
const disposable_1 = require("@theia/core/lib/common/disposable");
const buffer_1 = require("@theia/core/lib/common/buffer");
const files_1 = require("./files");
const proxy_factory_1 = require("@theia/core/lib/common/messaging/proxy-factory");
const application_error_1 = require("@theia/core/lib/common/application-error");
const promise_util_1 = require("@theia/core/lib/common/promise-util");
const stream_1 = require("@theia/core/lib/common/stream");
const cancellation_1 = require("@theia/core/lib/common/cancellation");
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
//# sourceMappingURL=remote-file-system-provider.js.map