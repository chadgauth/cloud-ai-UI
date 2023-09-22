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
// based on https://github.com/microsoft/vscode/blob/04c36be045a94fee58e5f8992d3e3fd980294a84/src/vs/platform/files/node/diskFileSystemProvider.ts
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
exports.DiskFileSystemProvider = void 0;
/* eslint-disable no-null/no-null */
/* eslint-disable @typescript-eslint/no-shadow */
const inversify_1 = require("@theia/core/shared/inversify");
const path_1 = require("path");
const uuid_1 = require("uuid");
const os = require("os");
const fs = require("fs");
const fs_1 = require("fs");
const util_1 = require("util");
const uri_1 = require("@theia/core/lib/common/uri");
const path_2 = require("@theia/core/lib/common/path");
const file_uri_1 = require("@theia/core/lib/node/file-uri");
const event_1 = require("@theia/core/lib/common/event");
const disposable_1 = require("@theia/core/lib/common/disposable");
const os_1 = require("@theia/core/lib/common/os");
const promise_util_1 = require("@theia/core/lib/common/promise-util");
const files_1 = require("../common/files");
const filesystem_watcher_protocol_1 = require("../common/filesystem-watcher-protocol");
const trash = require("trash");
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
const encoding_service_1 = require("@theia/core/lib/common/encoding-service");
const buffer_1 = require("@theia/core/lib/common/buffer");
const stream_1 = require("@theia/core/lib/common/stream");
const io_1 = require("../common/io");
const stat_mode_1 = require("stat-mode");
let DiskFileSystemProvider = class DiskFileSystemProvider {
    constructor() {
        this.BUFFER_SIZE = 64 * 1024;
        this.onDidChangeFileEmitter = new event_1.Emitter();
        this.onDidChangeFile = this.onDidChangeFileEmitter.event;
        this.onFileWatchErrorEmitter = new event_1.Emitter();
        this.onFileWatchError = this.onFileWatchErrorEmitter.event;
        this.toDispose = new disposable_1.DisposableCollection(this.onDidChangeFileEmitter);
        // #region File Capabilities
        this.onDidChangeCapabilities = event_1.Event.None;
        this.mapHandleToPos = new Map();
        this.writeHandles = new Set();
        this.canFlush = true;
    }
    init() {
        this.toDispose.push(this.watcher);
        this.watcher.setClient({
            onDidFilesChanged: params => this.onDidChangeFileEmitter.fire(params.changes.map(({ uri, type }) => ({
                resource: new uri_1.default(uri),
                type
            }))),
            onError: () => this.onFileWatchErrorEmitter.fire()
        });
    }
    get capabilities() {
        if (!this._capabilities) {
            this._capabilities =
                2 /* FileReadWrite */ |
                    4 /* FileOpenReadWriteClose */ |
                    16 /* FileReadStream */ |
                    8 /* FileFolderCopy */ |
                    16777216 /* Access */ |
                    4096 /* Trash */ |
                    33554432 /* Update */;
            if (os_1.OS.type() === os_1.OS.Type.Linux) {
                this._capabilities |= 1024 /* PathCaseSensitive */;
            }
        }
        return this._capabilities;
    }
    // #endregion
    // #region File Metadata Resolving
    async stat(resource) {
        try {
            const { stat, symbolicLink } = await this.statLink(this.toFilePath(resource)); // cannot use fs.stat() here to support links properly
            const mode = new stat_mode_1.Mode(stat);
            return {
                type: this.toType(stat, symbolicLink),
                ctime: stat.birthtime.getTime(),
                mtime: stat.mtime.getTime(),
                size: stat.size,
                permissions: !mode.owner.write ? files_1.FilePermission.Readonly : undefined,
            };
        }
        catch (error) {
            throw this.toFileSystemProviderError(error);
        }
    }
    async access(resource, mode) {
        try {
            await (0, util_1.promisify)(fs.access)(this.toFilePath(resource), mode);
        }
        catch (error) {
            throw this.toFileSystemProviderError(error);
        }
    }
    async fsPath(resource) {
        return file_uri_1.FileUri.fsPath(resource);
    }
    async statLink(path) {
        // First stat the link
        let lstats;
        try {
            lstats = await (0, util_1.promisify)(fs_1.lstat)(path);
            // Return early if the stat is not a symbolic link at all
            if (!lstats.isSymbolicLink()) {
                return { stat: lstats };
            }
        }
        catch (error) {
            /* ignore - use stat() instead */
        }
        // If the stat is a symbolic link or failed to stat, use fs.stat()
        // which for symbolic links will stat the target they point to
        try {
            const stats = await (0, util_1.promisify)(fs_1.stat)(path);
            return { stat: stats, symbolicLink: (lstats === null || lstats === void 0 ? void 0 : lstats.isSymbolicLink()) ? { dangling: false } : undefined };
        }
        catch (error) {
            // If the link points to a non-existing file we still want
            // to return it as result while setting dangling: true flag
            if (error.code === 'ENOENT' && lstats) {
                return { stat: lstats, symbolicLink: { dangling: true } };
            }
            throw error;
        }
    }
    async readdir(resource) {
        try {
            const children = await (0, util_1.promisify)(fs.readdir)(this.toFilePath(resource));
            const result = [];
            await Promise.all(children.map(async (child) => {
                try {
                    const stat = await this.stat(resource.resolve(child));
                    result.push([child, stat.type]);
                }
                catch (error) {
                    console.trace(error); // ignore errors for individual entries that can arise from permission denied
                }
            }));
            return result;
        }
        catch (error) {
            throw this.toFileSystemProviderError(error);
        }
    }
    toType(entry, symbolicLink) {
        // Signal file type by checking for file / directory, except:
        // - symbolic links pointing to non-existing files are FileType.Unknown
        // - files that are neither file nor directory are FileType.Unknown
        let type;
        if (symbolicLink === null || symbolicLink === void 0 ? void 0 : symbolicLink.dangling) {
            type = files_1.FileType.Unknown;
        }
        else if (entry.isFile()) {
            type = files_1.FileType.File;
        }
        else if (entry.isDirectory()) {
            type = files_1.FileType.Directory;
        }
        else {
            type = files_1.FileType.Unknown;
        }
        // Always signal symbolic link as file type additionally
        if (symbolicLink) {
            type |= files_1.FileType.SymbolicLink;
        }
        return type;
    }
    // #endregion
    // #region File Reading/Writing
    async readFile(resource) {
        try {
            const filePath = this.toFilePath(resource);
            return await (0, util_1.promisify)(fs_1.readFile)(filePath);
        }
        catch (error) {
            throw this.toFileSystemProviderError(error);
        }
    }
    readFileStream(resource, opts, token) {
        const stream = (0, stream_1.newWriteableStream)(data => buffer_1.BinaryBuffer.concat(data.map(data => buffer_1.BinaryBuffer.wrap(data))).buffer);
        (0, io_1.readFileIntoStream)(this, resource, stream, data => data.buffer, {
            ...opts,
            bufferSize: this.BUFFER_SIZE
        }, token);
        return stream;
    }
    async writeFile(resource, content, opts) {
        let handle = undefined;
        try {
            const filePath = this.toFilePath(resource);
            // Validate target unless { create: true, overwrite: true }
            if (!opts.create || !opts.overwrite) {
                const fileExists = await (0, util_1.promisify)(fs_1.exists)(filePath);
                if (fileExists) {
                    if (!opts.overwrite) {
                        throw (0, files_1.createFileSystemProviderError)('File already exists', files_1.FileSystemProviderErrorCode.FileExists);
                    }
                }
                else {
                    if (!opts.create) {
                        throw (0, files_1.createFileSystemProviderError)('File does not exist', files_1.FileSystemProviderErrorCode.FileNotFound);
                    }
                }
            }
            // Open
            handle = await this.open(resource, { create: true });
            // Write content at once
            await this.write(handle, 0, content, 0, content.byteLength);
        }
        catch (error) {
            throw this.toFileSystemProviderError(error);
        }
        finally {
            if (typeof handle === 'number') {
                await this.close(handle);
            }
        }
    }
    async open(resource, opts) {
        try {
            const filePath = this.toFilePath(resource);
            let flags = undefined;
            if (opts.create) {
                if (os_1.isWindows && await (0, util_1.promisify)(fs_1.exists)(filePath)) {
                    try {
                        // On Windows and if the file exists, we use a different strategy of saving the file
                        // by first truncating the file and then writing with r+ flag. This helps to save hidden files on Windows
                        // (see https://github.com/Microsoft/vscode/issues/931) and prevent removing alternate data streams
                        // (see https://github.com/Microsoft/vscode/issues/6363)
                        await (0, util_1.promisify)(fs_1.truncate)(filePath, 0);
                        // After a successful truncate() the flag can be set to 'r+' which will not truncate.
                        flags = 'r+';
                    }
                    catch (error) {
                        console.trace(error);
                    }
                }
                // we take opts.create as a hint that the file is opened for writing
                // as such we use 'w' to truncate an existing or create the
                // file otherwise. we do not allow reading.
                if (!flags) {
                    flags = 'w';
                }
            }
            else {
                // otherwise we assume the file is opened for reading
                // as such we use 'r' to neither truncate, nor create
                // the file.
                flags = 'r';
            }
            const handle = await (0, util_1.promisify)(fs_1.open)(filePath, flags);
            // remember this handle to track file position of the handle
            // we init the position to 0 since the file descriptor was
            // just created and the position was not moved so far (see
            // also http://man7.org/linux/man-pages/man2/open.2.html -
            // "The file offset is set to the beginning of the file.")
            this.mapHandleToPos.set(handle, 0);
            // remember that this handle was used for writing
            if (opts.create) {
                this.writeHandles.add(handle);
            }
            return handle;
        }
        catch (error) {
            throw this.toFileSystemProviderError(error);
        }
    }
    async close(fd) {
        try {
            // remove this handle from map of positions
            this.mapHandleToPos.delete(fd);
            // if a handle is closed that was used for writing, ensure
            // to flush the contents to disk if possible.
            if (this.writeHandles.delete(fd) && this.canFlush) {
                try {
                    await (0, util_1.promisify)(fs_1.fdatasync)(fd);
                }
                catch (error) {
                    // In some exotic setups it is well possible that node fails to sync
                    // In that case we disable flushing and log the error to our logger
                    this.canFlush = false;
                    console.error(error);
                }
            }
            return await (0, util_1.promisify)(fs_1.close)(fd);
        }
        catch (error) {
            throw this.toFileSystemProviderError(error);
        }
    }
    async read(fd, pos, data, offset, length) {
        const normalizedPos = this.normalizePos(fd, pos);
        let bytesRead = null;
        try {
            const result = await (0, util_1.promisify)(fs_1.read)(fd, data, offset, length, normalizedPos);
            if (typeof result === 'number') {
                bytesRead = result; // node.d.ts fail
            }
            else {
                bytesRead = result.bytesRead;
            }
            return bytesRead;
        }
        catch (error) {
            throw this.toFileSystemProviderError(error);
        }
        finally {
            this.updatePos(fd, normalizedPos, bytesRead);
        }
    }
    normalizePos(fd, pos) {
        // when calling fs.read/write we try to avoid passing in the "pos" argument and
        // rather prefer to pass in "null" because this avoids an extra seek(pos)
        // call that in some cases can even fail (e.g. when opening a file over FTP -
        // see https://github.com/microsoft/vscode/issues/73884).
        //
        // as such, we compare the passed in position argument with our last known
        // position for the file descriptor and use "null" if they match.
        if (pos === this.mapHandleToPos.get(fd)) {
            return null;
        }
        return pos;
    }
    updatePos(fd, pos, bytesLength) {
        const lastKnownPos = this.mapHandleToPos.get(fd);
        if (typeof lastKnownPos === 'number') {
            // pos !== null signals that previously a position was used that is
            // not null. node.js documentation explains, that in this case
            // the internal file pointer is not moving and as such we do not move
            // our position pointer.
            //
            // Docs: "If position is null, data will be read from the current file position,
            // and the file position will be updated. If position is an integer, the file position
            // will remain unchanged."
            if (typeof pos === 'number') {
                // do not modify the position
            }
            else if (typeof bytesLength === 'number') {
                this.mapHandleToPos.set(fd, lastKnownPos + bytesLength);
            }
            else {
                this.mapHandleToPos.delete(fd);
            }
        }
    }
    async write(fd, pos, data, offset, length) {
        // we know at this point that the file to write to is truncated and thus empty
        // if the write now fails, the file remains empty. as such we really try hard
        // to ensure the write succeeds by retrying up to three times.
        return (0, promise_util_1.retry)(() => this.doWrite(fd, pos, data, offset, length), 100 /* ms delay */, 3 /* retries */);
    }
    async doWrite(fd, pos, data, offset, length) {
        const normalizedPos = this.normalizePos(fd, pos);
        let bytesWritten = null;
        try {
            const result = await (0, util_1.promisify)(fs_1.write)(fd, data, offset, length, normalizedPos);
            if (typeof result === 'number') {
                bytesWritten = result; // node.d.ts fail
            }
            else {
                bytesWritten = result.bytesWritten;
            }
            return bytesWritten;
        }
        catch (error) {
            throw this.toFileSystemProviderError(error);
        }
        finally {
            this.updatePos(fd, normalizedPos, bytesWritten);
        }
    }
    // #endregion
    // #region Move/Copy/Delete/Create Folder
    async mkdir(resource) {
        try {
            await (0, util_1.promisify)(fs_1.mkdir)(this.toFilePath(resource));
        }
        catch (error) {
            throw this.toFileSystemProviderError(error);
        }
    }
    async delete(resource, opts) {
        try {
            const filePath = this.toFilePath(resource);
            await this.doDelete(filePath, opts);
        }
        catch (error) {
            throw this.toFileSystemProviderError(error);
        }
    }
    async doDelete(filePath, opts) {
        if (!opts.useTrash) {
            if (opts.recursive) {
                await this.rimraf(filePath);
            }
            else {
                await (0, util_1.promisify)(fs_1.unlink)(filePath);
            }
        }
        else {
            await trash(filePath);
        }
    }
    rimraf(path) {
        if (new path_2.Path(path).isRoot) {
            throw new Error('rimraf - will refuse to recursively delete root');
        }
        return this.rimrafMove(path);
    }
    async rimrafMove(path) {
        try {
            const pathInTemp = (0, path_1.join)(os.tmpdir(), (0, uuid_1.v4)());
            try {
                await (0, util_1.promisify)(fs_1.rename)(path, pathInTemp);
            }
            catch (error) {
                return this.rimrafUnlink(path); // if rename fails, delete without tmp dir
            }
            // Delete but do not return as promise
            this.rimrafUnlink(pathInTemp);
        }
        catch (error) {
            if (error.code !== 'ENOENT') {
                throw error;
            }
        }
    }
    async rimrafUnlink(path) {
        try {
            const stat = await (0, util_1.promisify)(fs_1.lstat)(path);
            // Folder delete (recursive) - NOT for symbolic links though!
            if (stat.isDirectory() && !stat.isSymbolicLink()) {
                // Children
                const children = await (0, util_1.promisify)(fs_1.readdir)(path);
                await Promise.all(children.map(child => this.rimrafUnlink((0, path_1.join)(path, child))));
                // Folder
                await (0, util_1.promisify)(fs_1.rmdir)(path);
            }
            else {
                // chmod as needed to allow for unlink
                const mode = stat.mode;
                if (!(mode & 128)) { // 128 === 0200
                    await (0, util_1.promisify)(fs_1.chmod)(path, mode | 128);
                }
                return (0, util_1.promisify)(fs_1.unlink)(path);
            }
        }
        catch (error) {
            if (error.code !== 'ENOENT') {
                throw error;
            }
        }
    }
    async rename(from, to, opts) {
        const fromFilePath = this.toFilePath(from);
        const toFilePath = this.toFilePath(to);
        if (fromFilePath === toFilePath) {
            return; // simulate node.js behaviour here and do a no-op if paths match
        }
        try {
            // Ensure target does not exist
            await this.validateTargetDeleted(from, to, 'move', opts.overwrite);
            // Move
            await this.move(fromFilePath, toFilePath);
        }
        catch (error) {
            // rewrite some typical errors that can happen especially around symlinks
            // to something the user can better understand
            if (error.code === 'EINVAL' || error.code === 'EBUSY' || error.code === 'ENAMETOOLONG') {
                error = new Error(`Unable to move '${(0, path_1.basename)(fromFilePath)}' into '${(0, path_1.basename)((0, path_1.dirname)(toFilePath))}' (${error.toString()}).`);
            }
            throw this.toFileSystemProviderError(error);
        }
    }
    async move(source, target) {
        if (source === target) {
            return Promise.resolve();
        }
        async function updateMtime(path) {
            const stat = await (0, util_1.promisify)(fs_1.lstat)(path);
            if (stat.isDirectory() || stat.isSymbolicLink()) {
                return Promise.resolve(); // only for files
            }
            const fd = await (0, util_1.promisify)(fs_1.open)(path, 'a');
            try {
                await (0, util_1.promisify)(fs_1.futimes)(fd, stat.atime, new Date());
            }
            catch (error) {
                // ignore
            }
            return (0, util_1.promisify)(fs_1.close)(fd);
        }
        try {
            await (0, util_1.promisify)(fs_1.rename)(source, target);
            await updateMtime(target);
        }
        catch (error) {
            // In two cases we fallback to classic copy and delete:
            //
            // 1.) The EXDEV error indicates that source and target are on different devices
            // In this case, fallback to using a copy() operation as there is no way to
            // rename() between different devices.
            //
            // 2.) The user tries to rename a file/folder that ends with a dot. This is not
            // really possible to move then, at least on UNC devices.
            if (source.toLowerCase() !== target.toLowerCase() && error.code === 'EXDEV' || source.endsWith('.')) {
                await this.doCopy(source, target);
                await this.rimraf(source);
                await updateMtime(target);
            }
            else {
                throw error;
            }
        }
    }
    async copy(from, to, opts) {
        const fromFilePath = this.toFilePath(from);
        const toFilePath = this.toFilePath(to);
        if (fromFilePath === toFilePath) {
            return; // simulate node.js behaviour here and do a no-op if paths match
        }
        try {
            // Ensure target does not exist
            await this.validateTargetDeleted(from, to, 'copy', opts.overwrite);
            // Copy
            await this.doCopy(fromFilePath, toFilePath);
        }
        catch (error) {
            // rewrite some typical errors that can happen especially around symlinks
            // to something the user can better understand
            if (error.code === 'EINVAL' || error.code === 'EBUSY' || error.code === 'ENAMETOOLONG') {
                error = new Error(`Unable to copy '${(0, path_1.basename)(fromFilePath)}' into '${(0, path_1.basename)((0, path_1.dirname)(toFilePath))}' (${error.toString()}).`);
            }
            throw this.toFileSystemProviderError(error);
        }
    }
    async validateTargetDeleted(from, to, mode, overwrite) {
        const isPathCaseSensitive = !!(this.capabilities & 1024 /* PathCaseSensitive */);
        const fromFilePath = this.toFilePath(from);
        const toFilePath = this.toFilePath(to);
        let isSameResourceWithDifferentPathCase = false;
        if (!isPathCaseSensitive) {
            isSameResourceWithDifferentPathCase = fromFilePath.toLowerCase() === toFilePath.toLowerCase();
        }
        if (isSameResourceWithDifferentPathCase && mode === 'copy') {
            throw (0, files_1.createFileSystemProviderError)("'File cannot be copied to same path with different path case", files_1.FileSystemProviderErrorCode.FileExists);
        }
        // handle existing target (unless this is a case change)
        if (!isSameResourceWithDifferentPathCase && await (0, util_1.promisify)(fs_1.exists)(toFilePath)) {
            if (!overwrite) {
                throw (0, files_1.createFileSystemProviderError)('File at target already exists', files_1.FileSystemProviderErrorCode.FileExists);
            }
            // Delete target
            await this.delete(to, { recursive: true, useTrash: false });
        }
    }
    async doCopy(source, target, copiedSourcesIn) {
        const copiedSources = copiedSourcesIn ? copiedSourcesIn : Object.create(null);
        const fileStat = await (0, util_1.promisify)(fs_1.stat)(source);
        if (!fileStat.isDirectory()) {
            return this.doCopyFile(source, target, fileStat.mode & 511);
        }
        if (copiedSources[source]) {
            return Promise.resolve(); // escape when there are cycles (can happen with symlinks)
        }
        copiedSources[source] = true; // remember as copied
        // Create folder
        await this.mkdirp(target, fileStat.mode & 511);
        // Copy each file recursively
        const files = await (0, util_1.promisify)(fs_1.readdir)(source);
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            await this.doCopy((0, path_1.join)(source, file), (0, path_1.join)(target, file), copiedSources);
        }
    }
    async mkdirp(path, mode) {
        const mkdir = async () => {
            try {
                await (0, util_1.promisify)(fs.mkdir)(path, mode);
            }
            catch (error) {
                // ENOENT: a parent folder does not exist yet
                if (error.code === 'ENOENT') {
                    throw error;
                }
                // Any other error: check if folder exists and
                // return normally in that case if its a folder
                let targetIsFile = false;
                try {
                    const fileStat = await (0, util_1.promisify)(fs.stat)(path);
                    targetIsFile = !fileStat.isDirectory();
                }
                catch (statError) {
                    throw error; // rethrow original error if stat fails
                }
                if (targetIsFile) {
                    throw new Error(`'${path}' exists and is not a directory.`);
                }
            }
        };
        // stop at root
        if (path === (0, path_1.dirname)(path)) {
            return;
        }
        try {
            await mkdir();
        }
        catch (error) {
            // ENOENT: a parent folder does not exist yet, continue
            // to create the parent folder and then try again.
            if (error.code === 'ENOENT') {
                await this.mkdirp((0, path_1.dirname)(path), mode);
                return mkdir();
            }
            // Any other error
            throw error;
        }
    }
    doCopyFile(source, target, mode) {
        return new Promise((resolve, reject) => {
            const reader = fs.createReadStream(source);
            const writer = fs.createWriteStream(target, { mode });
            let finished = false;
            const finish = (error) => {
                if (!finished) {
                    finished = true;
                    // in error cases, pass to callback
                    if (error) {
                        return reject(error);
                    }
                    // we need to explicitly chmod because of https://github.com/nodejs/node/issues/1104
                    fs.chmod(target, mode, error => error ? reject(error) : resolve());
                }
            };
            // handle errors properly
            reader.once('error', error => finish(error));
            writer.once('error', error => finish(error));
            // we are done (underlying fd has been closed)
            writer.once('close', () => finish());
            // start piping
            reader.pipe(writer);
        });
    }
    // #endregion
    // #region File Watching
    watch(resource, opts) {
        const watcherService = this.watcher;
        /**
         * Disposable handle. Can be disposed early (before the watcher is allocated.)
         */
        const handle = {
            disposed: false,
            watcherId: undefined,
            dispose() {
                if (this.disposed) {
                    return;
                }
                if (this.watcherId !== undefined) {
                    watcherService.unwatchFileChanges(this.watcherId);
                }
                this.disposed = true;
            },
        };
        watcherService.watchFileChanges(resource.toString(), {
            // Convert from `files.WatchOptions` to internal `watcher-protocol.WatchOptions`:
            ignored: opts.excludes
        }).then(watcherId => {
            if (handle.disposed) {
                watcherService.unwatchFileChanges(watcherId);
            }
            else {
                handle.watcherId = watcherId;
            }
        });
        this.toDispose.push(handle);
        return handle;
    }
    // #endregion
    async updateFile(resource, changes, opts) {
        try {
            const content = await this.readFile(resource);
            const decoded = this.encodingService.decode(buffer_1.BinaryBuffer.wrap(content), opts.readEncoding);
            const newContent = vscode_languageserver_textdocument_1.TextDocument.update(vscode_languageserver_textdocument_1.TextDocument.create('', '', 1, decoded), changes, 2).getText();
            const encoding = await this.encodingService.toResourceEncoding(opts.writeEncoding, {
                overwriteEncoding: opts.overwriteEncoding,
                read: async (length) => {
                    const fd = await this.open(resource, { create: false });
                    try {
                        const data = new Uint8Array(length);
                        await this.read(fd, 0, data, 0, length);
                        return data;
                    }
                    finally {
                        await this.close(fd);
                    }
                }
            });
            const encoded = this.encodingService.encode(newContent, encoding);
            await this.writeFile(resource, encoded.buffer, { create: false, overwrite: true });
            const stat = await this.stat(resource);
            return Object.assign(stat, { encoding: encoding.encoding });
        }
        catch (error) {
            throw this.toFileSystemProviderError(error);
        }
    }
    // #region Helpers
    toFilePath(resource) {
        return (0, path_1.normalize)(file_uri_1.FileUri.fsPath(resource));
    }
    toFileSystemProviderError(error) {
        if (error instanceof files_1.FileSystemProviderError) {
            return error; // avoid double conversion
        }
        let code;
        switch (error.code) {
            case 'ENOENT':
                code = files_1.FileSystemProviderErrorCode.FileNotFound;
                break;
            case 'EISDIR':
                code = files_1.FileSystemProviderErrorCode.FileIsADirectory;
                break;
            case 'ENOTDIR':
                code = files_1.FileSystemProviderErrorCode.FileNotADirectory;
                break;
            case 'EEXIST':
                code = files_1.FileSystemProviderErrorCode.FileExists;
                break;
            case 'EPERM':
            case 'EACCES':
                code = files_1.FileSystemProviderErrorCode.NoPermissions;
                break;
            default:
                code = files_1.FileSystemProviderErrorCode.Unknown;
        }
        return (0, files_1.createFileSystemProviderError)(error, code);
    }
    // #endregion
    dispose() {
        this.toDispose.dispose();
    }
};
__decorate([
    (0, inversify_1.inject)(filesystem_watcher_protocol_1.FileSystemWatcherServer),
    __metadata("design:type", Object)
], DiskFileSystemProvider.prototype, "watcher", void 0);
__decorate([
    (0, inversify_1.inject)(encoding_service_1.EncodingService),
    __metadata("design:type", encoding_service_1.EncodingService)
], DiskFileSystemProvider.prototype, "encodingService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DiskFileSystemProvider.prototype, "init", null);
DiskFileSystemProvider = __decorate([
    (0, inversify_1.injectable)()
], DiskFileSystemProvider);
exports.DiskFileSystemProvider = DiskFileSystemProvider;
//# sourceMappingURL=disk-file-system-provider.js.map