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
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// based on https://github.com/microsoft/vscode/blob/04c36be045a94fee58e5f8992d3e3fd980294a84/src/vs/workbench/api/browser/mainThreadFileSystem.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSystemMainImpl = void 0;
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/tslint/config */
/* eslint-disable @typescript-eslint/no-explicit-any */
const vscode_uri_1 = require("@theia/core/shared/vscode-uri");
const uri_1 = require("@theia/core/lib/common/uri");
const buffer_1 = require("@theia/core/lib/common/buffer");
const disposable_1 = require("@theia/core/lib/common/disposable");
const event_1 = require("@theia/core/lib/common/event");
const plugin_api_rpc_1 = require("../../common/plugin-api-rpc");
const files_1 = require("@theia/filesystem/lib/common/files");
const file_service_1 = require("@theia/filesystem/lib/browser/file-service");
class FileSystemMainImpl {
    constructor(rpc, container) {
        this._fileProvider = new Map();
        this._disposables = new disposable_1.DisposableCollection();
        this._proxy = rpc.getProxy(plugin_api_rpc_1.MAIN_RPC_CONTEXT.FILE_SYSTEM_EXT);
        this._fileService = container.get(file_service_1.FileService);
        for (const { scheme, capabilities } of this._fileService.listCapabilities()) {
            this._proxy.$acceptProviderInfos(scheme, capabilities);
        }
        this._disposables.push(this._fileService.onDidChangeFileSystemProviderRegistrations(e => { var _a; return this._proxy.$acceptProviderInfos(e.scheme, (_a = e.provider) === null || _a === void 0 ? void 0 : _a.capabilities); }));
        this._disposables.push(this._fileService.onDidChangeFileSystemProviderCapabilities(e => this._proxy.$acceptProviderInfos(e.scheme, e.provider.capabilities)));
        this._disposables.push(disposable_1.Disposable.create(() => this._fileProvider.forEach(value => value.dispose())));
        this._disposables.push(disposable_1.Disposable.create(() => this._fileProvider.clear()));
    }
    dispose() {
        this._disposables.dispose();
    }
    $registerFileSystemProvider(handle, scheme, capabilities) {
        this._fileProvider.set(handle, new RemoteFileSystemProvider(this._fileService, scheme, capabilities, handle, this._proxy));
    }
    $unregisterProvider(handle) {
        const provider = this._fileProvider.get(handle);
        if (provider) {
            provider.dispose();
            this._fileProvider.delete(handle);
        }
    }
    $onFileSystemChange(handle, changes) {
        const fileProvider = this._fileProvider.get(handle);
        if (!fileProvider) {
            throw new Error('Unknown file provider');
        }
        fileProvider.$onFileSystemChange(changes);
    }
    // --- consumer fs, vscode.workspace.fs
    $stat(uri) {
        return this._fileService.resolve(new uri_1.default(vscode_uri_1.URI.revive(uri)), { resolveMetadata: true }).then(stat => ({
            ctime: stat.ctime,
            mtime: stat.mtime,
            size: stat.size,
            type: files_1.FileStat.asFileType(stat)
        })).catch(FileSystemMainImpl._handleError);
    }
    $readdir(uri) {
        return this._fileService.resolve(new uri_1.default(vscode_uri_1.URI.revive(uri)), { resolveMetadata: false }).then(stat => {
            if (!stat.isDirectory) {
                const err = new Error(stat.name);
                err.name = files_1.FileSystemProviderErrorCode.FileNotADirectory;
                throw err;
            }
            return !stat.children ? [] : stat.children.map(child => [child.name, files_1.FileStat.asFileType(child)]);
        }).catch(FileSystemMainImpl._handleError);
    }
    $readFile(uri) {
        return this._fileService.readFile(new uri_1.default(vscode_uri_1.URI.revive(uri))).then(file => file.value).catch(FileSystemMainImpl._handleError);
    }
    $writeFile(uri, content) {
        return this._fileService.writeFile(new uri_1.default(vscode_uri_1.URI.revive(uri)), content)
            .then(() => undefined).catch(FileSystemMainImpl._handleError);
    }
    $rename(source, target, opts) {
        return this._fileService.move(new uri_1.default(vscode_uri_1.URI.revive(source)), new uri_1.default(vscode_uri_1.URI.revive(target)), {
            ...opts,
            fromUserGesture: false
        }).then(() => undefined).catch(FileSystemMainImpl._handleError);
    }
    $copy(source, target, opts) {
        return this._fileService.copy(new uri_1.default(vscode_uri_1.URI.revive(source)), new uri_1.default(vscode_uri_1.URI.revive(target)), {
            ...opts,
            fromUserGesture: false
        }).then(() => undefined).catch(FileSystemMainImpl._handleError);
    }
    $mkdir(uri) {
        return this._fileService.createFolder(new uri_1.default(vscode_uri_1.URI.revive(uri)), { fromUserGesture: false })
            .then(() => undefined).catch(FileSystemMainImpl._handleError);
    }
    $delete(uri, opts) {
        return this._fileService.delete(new uri_1.default(vscode_uri_1.URI.revive(uri)), opts).catch(FileSystemMainImpl._handleError);
    }
    static _handleError(err) {
        if (err instanceof files_1.FileOperationError) {
            switch (err.fileOperationResult) {
                case 1 /* FILE_NOT_FOUND */:
                    err.name = files_1.FileSystemProviderErrorCode.FileNotFound;
                    break;
                case 0 /* FILE_IS_DIRECTORY */:
                    err.name = files_1.FileSystemProviderErrorCode.FileIsADirectory;
                    break;
                case 6 /* FILE_PERMISSION_DENIED */:
                    err.name = files_1.FileSystemProviderErrorCode.NoPermissions;
                    break;
                case 4 /* FILE_MOVE_CONFLICT */:
                    err.name = files_1.FileSystemProviderErrorCode.FileExists;
                    break;
            }
        }
        throw err;
    }
}
exports.FileSystemMainImpl = FileSystemMainImpl;
class RemoteFileSystemProvider {
    constructor(fileService, scheme, capabilities, _handle, _proxy) {
        this._handle = _handle;
        this._proxy = _proxy;
        this._onDidChange = new event_1.Emitter();
        this.onDidChangeFile = this._onDidChange.event;
        this.onFileWatchError = new event_1.Emitter().event; // dummy, never fired
        this.onDidChangeCapabilities = event_1.Event.None;
        this.capabilities = capabilities;
        this._registration = fileService.registerProvider(scheme, this);
    }
    dispose() {
        this._registration.dispose();
        this._onDidChange.dispose();
    }
    watch(resource, opts) {
        const session = Math.random();
        this._proxy.$watch(this._handle, session, resource['codeUri'], opts);
        return disposable_1.Disposable.create(() => {
            this._proxy.$unwatch(this._handle, session);
        });
    }
    $onFileSystemChange(changes) {
        this._onDidChange.fire(changes.map(RemoteFileSystemProvider._createFileChange));
    }
    static _createFileChange(dto) {
        return { resource: new uri_1.default(vscode_uri_1.URI.revive(dto.resource)), type: dto.type };
    }
    // --- forwarding calls
    stat(resource) {
        return this._proxy.$stat(this._handle, resource['codeUri']).then(undefined, err => {
            throw err;
        });
    }
    readFile(resource) {
        return this._proxy.$readFile(this._handle, resource['codeUri']).then(buffer => buffer.buffer);
    }
    writeFile(resource, content, opts) {
        return this._proxy.$writeFile(this._handle, resource['codeUri'], buffer_1.BinaryBuffer.wrap(content), opts);
    }
    delete(resource, opts) {
        return this._proxy.$delete(this._handle, resource['codeUri'], opts);
    }
    mkdir(resource) {
        return this._proxy.$mkdir(this._handle, resource['codeUri']);
    }
    readdir(resource) {
        return this._proxy.$readdir(this._handle, resource['codeUri']);
    }
    rename(resource, target, opts) {
        return this._proxy.$rename(this._handle, resource['codeUri'], target['codeUri'], opts);
    }
    copy(resource, target, opts) {
        return this._proxy.$copy(this._handle, resource['codeUri'], target['codeUri'], opts);
    }
    open(resource, opts) {
        return this._proxy.$open(this._handle, resource['codeUri'], opts);
    }
    close(fd) {
        return this._proxy.$close(this._handle, fd);
    }
    read(fd, pos, data, offset, length) {
        return this._proxy.$read(this._handle, fd, pos, length).then(readData => {
            data.set(readData.buffer, offset);
            return readData.byteLength;
        });
    }
    write(fd, pos, data, offset, length) {
        return this._proxy.$write(this._handle, fd, pos, buffer_1.BinaryBuffer.wrap(data).slice(offset, offset + length));
    }
}
//# sourceMappingURL=file-system-main-impl.js.map