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
// based on https://github.com/microsoft/vscode/blob/04c36be045a94fee58e5f8992d3e3fd980294a84/src/vs/platform/files/common/fileService.ts
// and https://github.com/microsoft/vscode/blob/04c36be045a94fee58e5f8992d3e3fd980294a84/src/vs/workbench/services/textfile/browser/textFileService.ts
// and https://github.com/microsoft/vscode/blob/04c36be045a94fee58e5f8992d3e3fd980294a84/src/vs/workbench/services/textfile/electron-browser/nativeTextFileService.ts
// and https://github.com/microsoft/vscode/blob/04c36be045a94fee58e5f8992d3e3fd980294a84/src/vs/workbench/services/workingCopy/common/workingCopyFileService.ts
// and https://github.com/microsoft/vscode/blob/04c36be045a94fee58e5f8992d3e3fd980294a84/src/vs/workbench/services/workingCopy/common/workingCopyFileOperationParticipant.ts
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
exports.FileService = exports.TextFileOperationError = exports.FileServiceContribution = void 0;
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-null/no-null */
/* eslint-disable @typescript-eslint/tslint/config */
/* eslint-disable @typescript-eslint/no-explicit-any */
const inversify_1 = require("@theia/core/shared/inversify");
const promise_util_1 = require("@theia/core/lib/common/promise-util");
const cancellation_1 = require("@theia/core/lib/common/cancellation");
const disposable_1 = require("@theia/core/lib/common/disposable");
const event_1 = require("@theia/core/lib/common/event");
const contribution_provider_1 = require("@theia/core/lib/common/contribution-provider");
const ternary_search_tree_1 = require("@theia/core/lib/common/ternary-search-tree");
const files_1 = require("../common/files");
const buffer_1 = require("@theia/core/lib/common/buffer");
const stream_1 = require("@theia/core/lib/common/stream");
const label_provider_1 = require("@theia/core/lib/browser/label-provider");
const filesystem_preferences_1 = require("./filesystem-preferences");
const progress_service_1 = require("@theia/core/lib/common/progress-service");
const delegating_file_system_provider_1 = require("../common/delegating-file-system-provider");
const encoding_registry_1 = require("@theia/core/lib/browser/encoding-registry");
const encodings_1 = require("@theia/core/lib/common/encodings");
const encoding_service_1 = require("@theia/core/lib/common/encoding-service");
const io_1 = require("../common/io");
const filesystem_watcher_error_handler_1 = require("./filesystem-watcher-error-handler");
const filesystem_utils_1 = require("../common/filesystem-utils");
const core_1 = require("@theia/core");
exports.FileServiceContribution = Symbol('FileServiceContribution');
class TextFileOperationError extends files_1.FileOperationError {
    constructor(message, textFileOperationResult, options) {
        super(message, 11 /* FILE_OTHER_ERROR */);
        this.textFileOperationResult = textFileOperationResult;
        this.options = options;
        Object.setPrototypeOf(this, TextFileOperationError.prototype);
    }
}
exports.TextFileOperationError = TextFileOperationError;
/**
 * The {@link FileService} is the common facade responsible for all interactions with file systems.
 * It manages all registered {@link FileSystemProvider}s and
 *  forwards calls to the responsible {@link FileSystemProvider}, determined by the scheme.
 * For additional documentation regarding the provided functions see also {@link FileSystemProvider}.
 */
let FileService = class FileService {
    constructor() {
        this.BUFFER_SIZE = 64 * 1024;
        // #region Events
        this.correlationIds = 0;
        this.onWillRunUserOperationEmitter = new event_1.AsyncEmitter();
        /**
         * An event that is emitted when file operation is being performed.
         * This event is triggered by user gestures.
         */
        this.onWillRunUserOperation = this.onWillRunUserOperationEmitter.event;
        this.onDidFailUserOperationEmitter = new event_1.AsyncEmitter();
        /**
         * An event that is emitted when file operation is failed.
         * This event is triggered by user gestures.
         */
        this.onDidFailUserOperation = this.onDidFailUserOperationEmitter.event;
        this.onDidRunUserOperationEmitter = new event_1.AsyncEmitter();
        /**
         * An event that is emitted when file operation is finished.
         * This event is triggered by user gestures.
         */
        this.onDidRunUserOperation = this.onDidRunUserOperationEmitter.event;
        // #endregion
        // #region File System Provider
        this.onDidChangeFileSystemProviderRegistrationsEmitter = new event_1.Emitter();
        this.onDidChangeFileSystemProviderRegistrations = this.onDidChangeFileSystemProviderRegistrationsEmitter.event;
        this.onWillActivateFileSystemProviderEmitter = new event_1.Emitter();
        /**
         * See `FileServiceContribution.registerProviders`.
         */
        this.onWillActivateFileSystemProvider = this.onWillActivateFileSystemProviderEmitter.event;
        this.onDidChangeFileSystemProviderCapabilitiesEmitter = new event_1.Emitter();
        this.onDidChangeFileSystemProviderCapabilities = this.onDidChangeFileSystemProviderCapabilitiesEmitter.event;
        this.providers = new Map();
        this.activations = new Map();
        // #endregion
        this.onDidRunOperationEmitter = new event_1.Emitter();
        /**
         * An event that is emitted when operation is finished.
         * This event is triggered by user gestures and programmatically.
         */
        this.onDidRunOperation = this.onDidRunOperationEmitter.event;
        // #endregion
        // #region File Watching
        this.onDidFilesChangeEmitter = new event_1.Emitter();
        this.activeWatchers = new Map();
        // #endregion
        // #region Helpers
        this.writeQueues = new Map();
        // #endregion
        // #region File operation participants
        this.participants = [];
    }
    init() {
        for (const contribution of this.contributions.getContributions()) {
            contribution.registerFileSystemProviders(this);
        }
    }
    /**
     * Registers a new {@link FileSystemProvider} for the given scheme.
     * @param scheme The (uri) scheme for which the provider should be registered.
     * @param provider The file system provider that should be registered.
     *
     * @returns A `Disposable` that can be invoked to unregister the given provider.
     */
    registerProvider(scheme, provider) {
        if (this.providers.has(scheme)) {
            throw new Error(`A filesystem provider for the scheme '${scheme}' is already registered.`);
        }
        this.providers.set(scheme, provider);
        this.onDidChangeFileSystemProviderRegistrationsEmitter.fire({ added: true, scheme, provider });
        const providerDisposables = new disposable_1.DisposableCollection();
        providerDisposables.push(provider.onDidChangeFile(changes => this.onDidFilesChangeEmitter.fire(new files_1.FileChangesEvent(changes))));
        providerDisposables.push(provider.onFileWatchError(() => this.handleFileWatchError()));
        providerDisposables.push(provider.onDidChangeCapabilities(() => this.onDidChangeFileSystemProviderCapabilitiesEmitter.fire({ provider, scheme })));
        return disposable_1.Disposable.create(() => {
            this.onDidChangeFileSystemProviderRegistrationsEmitter.fire({ added: false, scheme, provider });
            this.providers.delete(scheme);
            providerDisposables.dispose();
        });
    }
    /**
     * Try to activate the registered provider for the given scheme
     * @param scheme  The uri scheme for which the responsible provider should be activated.
     *
     * @returns A promise of the activated file system provider. Only resolves if a provider is available for this scheme, gets rejected otherwise.
     */
    async activateProvider(scheme) {
        let provider = this.providers.get(scheme);
        if (provider) {
            return provider;
        }
        let activation = this.activations.get(scheme);
        if (!activation) {
            const deferredActivation = new promise_util_1.Deferred();
            this.activations.set(scheme, activation = deferredActivation.promise);
            event_1.WaitUntilEvent.fire(this.onWillActivateFileSystemProviderEmitter, { scheme }).then(() => {
                provider = this.providers.get(scheme);
                if (!provider) {
                    const error = new Error();
                    error.name = 'ENOPRO';
                    error.message = `No file system provider found for scheme ${scheme}`;
                    throw error;
                }
                else {
                    deferredActivation.resolve(provider);
                }
            }).catch(e => deferredActivation.reject(e));
        }
        return activation;
    }
    /**
     * Tests if the service (i.e. any of its registered {@link FileSystemProvider}s) can handle the given resource.
     * @param resource `URI` of the resource to test.
     *
     * @returns `true` if the resource can be handled, `false` otherwise.
     */
    canHandleResource(resource) {
        return this.providers.has(resource.scheme);
    }
    /**
     * Tests if the service (i.e the {@link FileSystemProvider} registered for the given uri scheme) provides the given capability.
     * @param resource `URI` of the resource to test.
     * @param capability The required capability.
     *
     * @returns `true` if the resource can be handled and the required capability can be provided.
     */
    hasCapability(resource, capability) {
        const provider = this.providers.get(resource.scheme);
        return !!(provider && (provider.capabilities & capability));
    }
    /**
     * List the schemes and capabilities for registered file system providers
     */
    listCapabilities() {
        return Array.from(this.providers.entries()).map(([scheme, provider]) => ({
            scheme,
            capabilities: provider.capabilities
        }));
    }
    async withProvider(resource) {
        // Assert path is absolute
        if (!resource.path.isAbsolute) {
            throw new files_1.FileOperationError(core_1.nls.localizeByDefault("Unable to resolve filesystem provider with relative file path '{0}'", this.resourceForError(resource)), 8 /* FILE_INVALID_PATH */);
        }
        return this.activateProvider(resource.scheme);
    }
    async withReadProvider(resource) {
        const provider = await this.withProvider(resource);
        if ((0, files_1.hasOpenReadWriteCloseCapability)(provider) || (0, files_1.hasReadWriteCapability)(provider)) {
            return provider;
        }
        throw new Error(`Filesystem provider for scheme '${resource.scheme}' neither has FileReadWrite, FileReadStream nor FileOpenReadWriteClose capability which is needed for the read operation.`);
    }
    async withWriteProvider(resource) {
        const provider = await this.withProvider(resource);
        if ((0, files_1.hasOpenReadWriteCloseCapability)(provider) || (0, files_1.hasReadWriteCapability)(provider)) {
            return provider;
        }
        throw new Error(`Filesystem provider for scheme '${resource.scheme}' neither has FileReadWrite nor FileOpenReadWriteClose capability which is needed for the write operation.`);
    }
    async resolve(resource, options) {
        try {
            return await this.doResolveFile(resource, options);
        }
        catch (error) {
            // Specially handle file not found case as file operation result
            if ((0, files_1.toFileSystemProviderErrorCode)(error) === files_1.FileSystemProviderErrorCode.FileNotFound) {
                throw new files_1.FileOperationError(core_1.nls.localizeByDefault("Unable to resolve nonexistent file '{0}'", this.resourceForError(resource)), 1 /* FILE_NOT_FOUND */);
            }
            // Bubble up any other error as is
            throw (0, files_1.ensureFileSystemProviderError)(error);
        }
    }
    async doResolveFile(resource, options) {
        const provider = await this.withProvider(resource);
        const resolveTo = options === null || options === void 0 ? void 0 : options.resolveTo;
        const resolveSingleChildDescendants = options === null || options === void 0 ? void 0 : options.resolveSingleChildDescendants;
        const resolveMetadata = options === null || options === void 0 ? void 0 : options.resolveMetadata;
        const stat = await provider.stat(resource);
        let trie;
        return this.toFileStat(provider, resource, stat, undefined, !!resolveMetadata, (stat, siblings) => {
            // lazy trie to check for recursive resolving
            if (!trie) {
                trie = ternary_search_tree_1.TernarySearchTree.forUris(!!(provider.capabilities & 1024 /* PathCaseSensitive */));
                trie.set(resource, true);
                if (Array.isArray(resolveTo) && resolveTo.length) {
                    resolveTo.forEach(uri => trie.set(uri, true));
                }
            }
            // check for recursive resolving
            if (Boolean(trie.findSuperstr(stat.resource) || trie.get(stat.resource))) {
                return true;
            }
            // check for resolving single child folders
            if (stat.isDirectory && resolveSingleChildDescendants) {
                return siblings === 1;
            }
            return false;
        });
    }
    async toFileStat(provider, resource, stat, siblings, resolveMetadata, recurse) {
        const fileStat = files_1.FileStat.fromStat(resource, stat);
        // check to recurse for directories
        if (fileStat.isDirectory && recurse(fileStat, siblings)) {
            try {
                const entries = await provider.readdir(resource);
                const resolvedEntries = await Promise.all(entries.map(async ([name, type]) => {
                    try {
                        const childResource = resource.resolve(name);
                        const childStat = resolveMetadata ? await provider.stat(childResource) : { type };
                        return await this.toFileStat(provider, childResource, childStat, entries.length, resolveMetadata, recurse);
                    }
                    catch (error) {
                        console.trace(error);
                        return null; // can happen e.g. due to permission errors
                    }
                }));
                // make sure to get rid of null values that signal a failure to resolve a particular entry
                fileStat.children = resolvedEntries.filter(e => !!e);
            }
            catch (error) {
                console.trace(error);
                fileStat.children = []; // gracefully handle errors, we may not have permissions to read
            }
            return fileStat;
        }
        return fileStat;
    }
    async resolveAll(toResolve) {
        return Promise.all(toResolve.map(async (entry) => {
            try {
                return { stat: await this.doResolveFile(entry.resource, entry.options), success: true };
            }
            catch (error) {
                console.trace(error);
                return { stat: undefined, success: false };
            }
        }));
    }
    /**
     * Tests if the given resource exists in the filesystem.
     * @param resource `URI` of the resource which should be tested.
     * @throws Will throw an error if no {@link FileSystemProvider} is registered for the given resource.
     *
     * @returns A promise that resolves to `true` if the resource exists.
     */
    async exists(resource) {
        const provider = await this.withProvider(resource);
        try {
            const stat = await provider.stat(resource);
            return !!stat;
        }
        catch (error) {
            return false;
        }
    }
    /**
     * Tests a user's permissions for the given resource.
     * @param resource `URI` of the resource which should be tested.
     * @param mode An optional integer that specifies the accessibility checks to be performed.
     *      Check `FileAccess.Constants` for possible values of mode.
     *      It is possible to create a mask consisting of the bitwise `OR` of two or more values (e.g. FileAccess.Constants.W_OK | FileAccess.Constants.R_OK).
     *      If `mode` is not defined, `FileAccess.Constants.F_OK` will be used instead.
     */
    async access(resource, mode) {
        const provider = await this.withProvider(resource);
        if (!(0, files_1.hasAccessCapability)(provider)) {
            return false;
        }
        try {
            await provider.access(resource, mode);
            return true;
        }
        catch (error) {
            return false;
        }
    }
    /**
     * Resolves the fs path of the given URI.
     *
     * USE WITH CAUTION: You should always prefer URIs to paths if possible, as they are
     * portable and platform independent. Paths should only be used in cases you directly
     * interact with the OS, e.g. when running a command on the shell.
     *
     * If you need to display human readable simple or long names then use `LabelProvider` instead.
     * @param resource `URI` of the resource that should be resolved.
     * @throws Will throw an error if no {@link FileSystemProvider} is registered for the given resource.
     *
     * @returns A promise of the resolved fs path.
     */
    async fsPath(resource) {
        const provider = await this.withProvider(resource);
        if (!(0, files_1.hasAccessCapability)(provider)) {
            return resource.path.toString();
        }
        return provider.fsPath(resource);
    }
    // #region Text File Reading/Writing
    async create(resource, value, options) {
        if ((options === null || options === void 0 ? void 0 : options.fromUserGesture) === false) {
            return this.doCreate(resource, value, options);
        }
        await this.runFileOperationParticipants(resource, undefined, 0 /* CREATE */);
        const event = { correlationId: this.correlationIds++, operation: 0 /* CREATE */, target: resource };
        await this.onWillRunUserOperationEmitter.fire(event);
        let stat;
        try {
            stat = await this.doCreate(resource, value, options);
        }
        catch (error) {
            await this.onDidFailUserOperationEmitter.fire(event);
            throw error;
        }
        await this.onDidRunUserOperationEmitter.fire(event);
        return stat;
    }
    async doCreate(resource, value, options) {
        const encoding = await this.getWriteEncoding(resource, options);
        const encoded = await this.encodingService.encodeStream(value, encoding);
        return this.createFile(resource, encoded, options);
    }
    async write(resource, value, options) {
        const encoding = await this.getWriteEncoding(resource, options);
        const encoded = await this.encodingService.encodeStream(value, encoding);
        return Object.assign(await this.writeFile(resource, encoded, options), { encoding: encoding.encoding });
    }
    async read(resource, options) {
        const [bufferStream, decoder] = await this.doRead(resource, {
            ...options,
            // optimization: since we know that the caller does not
            // care about buffering, we indicate this to the reader.
            // this reduces all the overhead the buffered reading
            // has (open, read, close) if the provider supports
            // unbuffered reading.
            preferUnbuffered: true
        });
        return {
            ...bufferStream,
            encoding: decoder.detected.encoding || encodings_1.UTF8,
            value: await (0, stream_1.consumeStream)(decoder.stream, strings => strings.join(''))
        };
    }
    async readStream(resource, options) {
        const [bufferStream, decoder] = await this.doRead(resource, options);
        return {
            ...bufferStream,
            encoding: decoder.detected.encoding || encodings_1.UTF8,
            value: decoder.stream
        };
    }
    async doRead(resource, options) {
        options = this.resolveReadOptions(options);
        // read stream raw (either buffered or unbuffered)
        let bufferStream;
        if (options === null || options === void 0 ? void 0 : options.preferUnbuffered) {
            const content = await this.readFile(resource, options);
            bufferStream = {
                ...content,
                value: buffer_1.BinaryBufferReadableStream.fromBuffer(content.value)
            };
        }
        else {
            bufferStream = await this.readFileStream(resource, options);
        }
        const decoder = await this.encodingService.decodeStream(bufferStream.value, {
            guessEncoding: options.autoGuessEncoding,
            overwriteEncoding: detectedEncoding => this.getReadEncoding(resource, options, detectedEncoding)
        });
        // validate binary
        if ((options === null || options === void 0 ? void 0 : options.acceptTextOnly) && decoder.detected.seemsBinary) {
            throw new TextFileOperationError(core_1.nls.localizeByDefault('File seems to be binary and cannot be opened as text'), 0 /* FILE_IS_BINARY */, options);
        }
        return [bufferStream, decoder];
    }
    resolveReadOptions(options) {
        options = {
            ...options,
            autoGuessEncoding: typeof (options === null || options === void 0 ? void 0 : options.autoGuessEncoding) === 'boolean' ? options.autoGuessEncoding : this.preferences['files.autoGuessEncoding']
        };
        const limits = options.limits = options.limits || {};
        if (typeof limits.size !== 'number') {
            limits.size = this.preferences['files.maxFileSizeMB'] * 1024 * 1024;
        }
        return options;
    }
    async update(resource, changes, options) {
        const provider = this.throwIfFileSystemIsReadonly(await this.withWriteProvider(resource), resource);
        try {
            await this.validateWriteFile(provider, resource, options);
            if ((0, files_1.hasUpdateCapability)(provider)) {
                const encoding = await this.getEncodingForResource(resource, options ? options.encoding : undefined);
                ;
                const stat = await provider.updateFile(resource, changes, {
                    readEncoding: options.readEncoding,
                    writeEncoding: encoding,
                    overwriteEncoding: options.overwriteEncoding || false
                });
                return Object.assign(files_1.FileStat.fromStat(resource, stat), { encoding: stat.encoding });
            }
            else {
                throw new Error('incremental file update is not supported');
            }
        }
        catch (error) {
            this.rethrowAsFileOperationError("Unable to write file '{0}' ({1})", resource, error, options);
        }
    }
    // #endregion
    // #region File Reading/Writing
    async createFile(resource, bufferOrReadableOrStream = buffer_1.BinaryBuffer.fromString(''), options) {
        // validate overwrite
        if (!(options === null || options === void 0 ? void 0 : options.overwrite) && await this.exists(resource)) {
            throw new files_1.FileOperationError(core_1.nls.localizeByDefault("Unable to create file '{0}' that already exists when overwrite flag is not set", this.resourceForError(resource)), 3 /* FILE_MODIFIED_SINCE */, options);
        }
        // do write into file (this will create it too)
        const fileStat = await this.writeFile(resource, bufferOrReadableOrStream);
        // events
        this.onDidRunOperationEmitter.fire(new files_1.FileOperationEvent(resource, 0 /* CREATE */, fileStat));
        return fileStat;
    }
    async writeFile(resource, bufferOrReadableOrStream, options) {
        const provider = this.throwIfFileSystemIsReadonly(await this.withWriteProvider(resource), resource);
        try {
            // validate write
            const stat = await this.validateWriteFile(provider, resource, options);
            // mkdir recursively as needed
            if (!stat) {
                await this.mkdirp(provider, resource.parent);
            }
            // optimization: if the provider has unbuffered write capability and the data
            // to write is a Readable, we consume up to 3 chunks and try to write the data
            // unbuffered to reduce the overhead. If the Readable has more data to provide
            // we continue to write buffered.
            let bufferOrReadableOrStreamOrBufferedStream;
            if ((0, files_1.hasReadWriteCapability)(provider) && !(bufferOrReadableOrStream instanceof buffer_1.BinaryBuffer)) {
                if ((0, stream_1.isReadableStream)(bufferOrReadableOrStream)) {
                    const bufferedStream = await (0, stream_1.peekStream)(bufferOrReadableOrStream, 3);
                    if (bufferedStream.ended) {
                        bufferOrReadableOrStreamOrBufferedStream = buffer_1.BinaryBuffer.concat(bufferedStream.buffer);
                    }
                    else {
                        bufferOrReadableOrStreamOrBufferedStream = bufferedStream;
                    }
                }
                else {
                    bufferOrReadableOrStreamOrBufferedStream = (0, stream_1.peekReadable)(bufferOrReadableOrStream, data => buffer_1.BinaryBuffer.concat(data), 3);
                }
            }
            else {
                bufferOrReadableOrStreamOrBufferedStream = bufferOrReadableOrStream;
            }
            // write file: unbuffered (only if data to write is a buffer, or the provider has no buffered write capability)
            if (!(0, files_1.hasOpenReadWriteCloseCapability)(provider) || ((0, files_1.hasReadWriteCapability)(provider) && bufferOrReadableOrStreamOrBufferedStream instanceof buffer_1.BinaryBuffer)) {
                await this.doWriteUnbuffered(provider, resource, bufferOrReadableOrStreamOrBufferedStream);
            }
            // write file: buffered
            else {
                await this.doWriteBuffered(provider, resource, bufferOrReadableOrStreamOrBufferedStream instanceof buffer_1.BinaryBuffer ? buffer_1.BinaryBufferReadable.fromBuffer(bufferOrReadableOrStreamOrBufferedStream) : bufferOrReadableOrStreamOrBufferedStream);
            }
        }
        catch (error) {
            this.rethrowAsFileOperationError("Unable to write file '{0}' ({1})", resource, error, options);
        }
        return this.resolve(resource, { resolveMetadata: true });
    }
    async validateWriteFile(provider, resource, options) {
        let stat = undefined;
        try {
            stat = await provider.stat(resource);
        }
        catch (error) {
            return undefined; // file might not exist
        }
        // file cannot be directory
        if ((stat.type & files_1.FileType.Directory) !== 0) {
            throw new files_1.FileOperationError(core_1.nls.localizeByDefault("Unable to write file '{0}' that is actually a directory", this.resourceForError(resource)), 0 /* FILE_IS_DIRECTORY */, options);
        }
        if (this.modifiedSince(stat, options)) {
            throw new files_1.FileOperationError(core_1.nls.localizeByDefault('File Modified Since'), 3 /* FILE_MODIFIED_SINCE */, options);
        }
        return stat;
    }
    /**
     * Dirty write prevention: if the file on disk has been changed and does not match our expected
     * mtime and etag, we bail out to prevent dirty writing.
     *
     * First, we check for a mtime that is in the future before we do more checks. The assumption is
     * that only the mtime is an indicator for a file that has changed on disk.
     *
     * Second, if the mtime has advanced, we compare the size of the file on disk with our previous
     * one using the etag() function. Relying only on the mtime check has proven to produce false
     * positives due to file system weirdness (especially around remote file systems). As such, the
     * check for size is a weaker check because it can return a false negative if the file has changed
     * but to the same length. This is a compromise we take to avoid having to produce checksums of
     * the file content for comparison which would be much slower to compute.
     */
    modifiedSince(stat, options) {
        return !!options && typeof options.mtime === 'number' && typeof options.etag === 'string' && options.etag !== files_1.ETAG_DISABLED &&
            typeof stat.mtime === 'number' && typeof stat.size === 'number' &&
            options.mtime < stat.mtime && options.etag !== (0, files_1.etag)({ mtime: options.mtime /* not using stat.mtime for a reason, see above */, size: stat.size });
    }
    async readFile(resource, options) {
        const provider = await this.withReadProvider(resource);
        const stream = await this.doReadAsFileStream(provider, resource, {
            ...options,
            // optimization: since we know that the caller does not
            // care about buffering, we indicate this to the reader.
            // this reduces all the overhead the buffered reading
            // has (open, read, close) if the provider supports
            // unbuffered reading.
            preferUnbuffered: true
        });
        return {
            ...stream,
            value: await buffer_1.BinaryBufferReadableStream.toBuffer(stream.value)
        };
    }
    async readFileStream(resource, options) {
        const provider = await this.withReadProvider(resource);
        return this.doReadAsFileStream(provider, resource, options);
    }
    async doReadAsFileStream(provider, resource, options) {
        // install a cancellation token that gets cancelled
        // when any error occurs. this allows us to resolve
        // the content of the file while resolving metadata
        // but still cancel the operation in certain cases.
        const cancellableSource = new cancellation_1.CancellationTokenSource();
        // validate read operation
        const statPromise = this.validateReadFile(resource, options).then(stat => stat, error => {
            cancellableSource.cancel();
            throw error;
        });
        try {
            // if the etag is provided, we await the result of the validation
            // due to the likelyhood of hitting a NOT_MODIFIED_SINCE result.
            // otherwise, we let it run in parallel to the file reading for
            // optimal startup performance.
            if (options && typeof options.etag === 'string' && options.etag !== files_1.ETAG_DISABLED) {
                await statPromise;
            }
            let fileStreamPromise;
            // read unbuffered (only if either preferred, or the provider has no buffered read capability)
            if (!((0, files_1.hasOpenReadWriteCloseCapability)(provider) || (0, files_1.hasFileReadStreamCapability)(provider)) || ((0, files_1.hasReadWriteCapability)(provider) && (options === null || options === void 0 ? void 0 : options.preferUnbuffered))) {
                fileStreamPromise = this.readFileUnbuffered(provider, resource, options);
            }
            // read streamed (always prefer over primitive buffered read)
            else if ((0, files_1.hasFileReadStreamCapability)(provider)) {
                fileStreamPromise = Promise.resolve(this.readFileStreamed(provider, resource, cancellableSource.token, options));
            }
            // read buffered
            else {
                fileStreamPromise = Promise.resolve(this.readFileBuffered(provider, resource, cancellableSource.token, options));
            }
            const [fileStat, fileStream] = await Promise.all([statPromise, fileStreamPromise]);
            return {
                ...fileStat,
                value: fileStream
            };
        }
        catch (error) {
            this.rethrowAsFileOperationError("Unable to read file '{0}' ({1})", resource, error, options);
        }
    }
    readFileStreamed(provider, resource, token, options = Object.create(null)) {
        const fileStream = provider.readFileStream(resource, options, token);
        return (0, stream_1.transform)(fileStream, {
            data: data => data instanceof buffer_1.BinaryBuffer ? data : buffer_1.BinaryBuffer.wrap(data),
            error: error => this.asFileOperationError("Unable to read file '{0}' ({1})", resource, error, options)
        }, data => buffer_1.BinaryBuffer.concat(data));
    }
    readFileBuffered(provider, resource, token, options = Object.create(null)) {
        const stream = buffer_1.BinaryBufferWriteableStream.create();
        (0, io_1.readFileIntoStream)(provider, resource, stream, data => data, {
            ...options,
            bufferSize: this.BUFFER_SIZE,
            errorTransformer: error => this.asFileOperationError("Unable to read file '{0}' ({1})", resource, error, options)
        }, token);
        return stream;
    }
    rethrowAsFileOperationError(message, resource, error, options) {
        throw this.asFileOperationError(message, resource, error, options);
    }
    asFileOperationError(message, resource, error, options) {
        const fileOperationError = new files_1.FileOperationError(core_1.nls.localizeByDefault(message, this.resourceForError(resource), (0, files_1.ensureFileSystemProviderError)(error).toString()), (0, files_1.toFileOperationResult)(error), options);
        fileOperationError.stack = `${fileOperationError.stack}\nCaused by: ${error.stack}`;
        return fileOperationError;
    }
    async readFileUnbuffered(provider, resource, options) {
        let buffer = await provider.readFile(resource);
        // respect position option
        if (options && typeof options.position === 'number') {
            buffer = buffer.slice(options.position);
        }
        // respect length option
        if (options && typeof options.length === 'number') {
            buffer = buffer.slice(0, options.length);
        }
        // Throw if file is too large to load
        this.validateReadFileLimits(resource, buffer.byteLength, options);
        return buffer_1.BinaryBufferReadableStream.fromBuffer(buffer_1.BinaryBuffer.wrap(buffer));
    }
    async validateReadFile(resource, options) {
        const stat = await this.resolve(resource, { resolveMetadata: true });
        // Throw if resource is a directory
        if (stat.isDirectory) {
            throw new files_1.FileOperationError(core_1.nls.localizeByDefault("Unable to read file '{0}' that is actually a directory", this.resourceForError(resource)), 0 /* FILE_IS_DIRECTORY */, options);
        }
        // Throw if file not modified since (unless disabled)
        if (options && typeof options.etag === 'string' && options.etag !== files_1.ETAG_DISABLED && options.etag === stat.etag) {
            throw new files_1.FileOperationError(core_1.nls.localizeByDefault('File not modified since'), 2 /* FILE_NOT_MODIFIED_SINCE */, options);
        }
        // Throw if file is too large to load
        this.validateReadFileLimits(resource, stat.size, options);
        return stat;
    }
    validateReadFileLimits(resource, size, options) {
        if (options === null || options === void 0 ? void 0 : options.limits) {
            let tooLargeErrorResult = undefined;
            if (typeof options.limits.memory === 'number' && size > options.limits.memory) {
                tooLargeErrorResult = 9 /* FILE_EXCEEDS_MEMORY_LIMIT */;
            }
            if (typeof options.limits.size === 'number' && size > options.limits.size) {
                tooLargeErrorResult = 7 /* FILE_TOO_LARGE */;
            }
            if (typeof tooLargeErrorResult === 'number') {
                throw new files_1.FileOperationError(core_1.nls.localizeByDefault("Unable to read file '{0}' that is too large to open", this.resourceForError(resource)), tooLargeErrorResult);
            }
        }
    }
    // #endregion
    // #region Move/Copy/Delete/Create Folder
    async move(source, target, options) {
        if ((options === null || options === void 0 ? void 0 : options.fromUserGesture) === false) {
            return this.doMove(source, target, options.overwrite);
        }
        await this.runFileOperationParticipants(target, source, 2 /* MOVE */);
        const event = { correlationId: this.correlationIds++, operation: 2 /* MOVE */, target, source };
        await this.onWillRunUserOperationEmitter.fire(event);
        let stat;
        try {
            stat = await this.doMove(source, target, options === null || options === void 0 ? void 0 : options.overwrite);
        }
        catch (error) {
            await this.onDidFailUserOperationEmitter.fire(event);
            throw error;
        }
        await this.onDidRunUserOperationEmitter.fire(event);
        return stat;
    }
    async doMove(source, target, overwrite) {
        const sourceProvider = this.throwIfFileSystemIsReadonly(await this.withWriteProvider(source), source);
        const targetProvider = this.throwIfFileSystemIsReadonly(await this.withWriteProvider(target), target);
        // move
        const mode = await this.doMoveCopy(sourceProvider, source, targetProvider, target, 'move', !!overwrite);
        // resolve and send events
        const fileStat = await this.resolve(target, { resolveMetadata: true });
        this.onDidRunOperationEmitter.fire(new files_1.FileOperationEvent(source, mode === 'move' ? 2 /* MOVE */ : 3 /* COPY */, fileStat));
        return fileStat;
    }
    async copy(source, target, options) {
        if ((options === null || options === void 0 ? void 0 : options.fromUserGesture) === false) {
            return this.doCopy(source, target, options.overwrite);
        }
        await this.runFileOperationParticipants(target, source, 3 /* COPY */);
        const event = { correlationId: this.correlationIds++, operation: 3 /* COPY */, target, source };
        await this.onWillRunUserOperationEmitter.fire(event);
        let stat;
        try {
            stat = await this.doCopy(source, target, options === null || options === void 0 ? void 0 : options.overwrite);
        }
        catch (error) {
            await this.onDidFailUserOperationEmitter.fire(event);
            throw error;
        }
        await this.onDidRunUserOperationEmitter.fire(event);
        return stat;
    }
    async doCopy(source, target, overwrite) {
        const sourceProvider = await this.withReadProvider(source);
        const targetProvider = this.throwIfFileSystemIsReadonly(await this.withWriteProvider(target), target);
        // copy
        const mode = await this.doMoveCopy(sourceProvider, source, targetProvider, target, 'copy', !!overwrite);
        // resolve and send events
        const fileStat = await this.resolve(target, { resolveMetadata: true });
        this.onDidRunOperationEmitter.fire(new files_1.FileOperationEvent(source, mode === 'copy' ? 3 /* COPY */ : 2 /* MOVE */, fileStat));
        return fileStat;
    }
    async doMoveCopy(sourceProvider, source, targetProvider, target, mode, overwrite) {
        if (source.toString() === target.toString()) {
            return mode; // simulate node.js behaviour here and do a no-op if paths match
        }
        // validation
        const { exists, isSameResourceWithDifferentPathCase } = await this.doValidateMoveCopy(sourceProvider, source, targetProvider, target, mode, overwrite);
        // if target exists get valid target
        if (exists && !overwrite) {
            const parent = await this.resolve(target.parent);
            const targetFileStat = await this.resolve(target);
            target = filesystem_utils_1.FileSystemUtils.generateUniqueResourceURI(parent, target, targetFileStat.isDirectory, isSameResourceWithDifferentPathCase ? 'copy' : undefined);
        }
        // delete as needed (unless target is same resource with different path case)
        if (exists && !isSameResourceWithDifferentPathCase && overwrite) {
            await this.delete(target, { recursive: true });
        }
        // create parent folders
        await this.mkdirp(targetProvider, target.parent);
        // copy source => target
        if (mode === 'copy') {
            // same provider with fast copy: leverage copy() functionality
            if (sourceProvider === targetProvider && (0, files_1.hasFileFolderCopyCapability)(sourceProvider)) {
                await sourceProvider.copy(source, target, { overwrite });
            }
            // when copying via buffer/unbuffered, we have to manually
            // traverse the source if it is a folder and not a file
            else {
                const sourceFile = await this.resolve(source);
                if (sourceFile.isDirectory) {
                    await this.doCopyFolder(sourceProvider, sourceFile, targetProvider, target);
                }
                else {
                    await this.doCopyFile(sourceProvider, source, targetProvider, target);
                }
            }
            return mode;
        }
        // move source => target
        else {
            // same provider: leverage rename() functionality
            if (sourceProvider === targetProvider) {
                await sourceProvider.rename(source, target, { overwrite });
                return mode;
            }
            // across providers: copy to target & delete at source
            else {
                await this.doMoveCopy(sourceProvider, source, targetProvider, target, 'copy', overwrite);
                await this.delete(source, { recursive: true });
                return 'copy';
            }
        }
    }
    async doCopyFile(sourceProvider, source, targetProvider, target) {
        // copy: source (buffered) => target (buffered)
        if ((0, files_1.hasOpenReadWriteCloseCapability)(sourceProvider) && (0, files_1.hasOpenReadWriteCloseCapability)(targetProvider)) {
            return this.doPipeBuffered(sourceProvider, source, targetProvider, target);
        }
        // copy: source (buffered) => target (unbuffered)
        if ((0, files_1.hasOpenReadWriteCloseCapability)(sourceProvider) && (0, files_1.hasReadWriteCapability)(targetProvider)) {
            return this.doPipeBufferedToUnbuffered(sourceProvider, source, targetProvider, target);
        }
        // copy: source (unbuffered) => target (buffered)
        if ((0, files_1.hasReadWriteCapability)(sourceProvider) && (0, files_1.hasOpenReadWriteCloseCapability)(targetProvider)) {
            return this.doPipeUnbufferedToBuffered(sourceProvider, source, targetProvider, target);
        }
        // copy: source (unbuffered) => target (unbuffered)
        if ((0, files_1.hasReadWriteCapability)(sourceProvider) && (0, files_1.hasReadWriteCapability)(targetProvider)) {
            return this.doPipeUnbuffered(sourceProvider, source, targetProvider, target);
        }
    }
    async doCopyFolder(sourceProvider, sourceFolder, targetProvider, targetFolder) {
        // create folder in target
        await targetProvider.mkdir(targetFolder);
        // create children in target
        if (Array.isArray(sourceFolder.children)) {
            await Promise.all(sourceFolder.children.map(async (sourceChild) => {
                const targetChild = targetFolder.resolve(sourceChild.name);
                if (sourceChild.isDirectory) {
                    return this.doCopyFolder(sourceProvider, await this.resolve(sourceChild.resource), targetProvider, targetChild);
                }
                else {
                    return this.doCopyFile(sourceProvider, sourceChild.resource, targetProvider, targetChild);
                }
            }));
        }
    }
    async doValidateMoveCopy(sourceProvider, source, targetProvider, target, mode, overwrite) {
        let isSameResourceWithDifferentPathCase = false;
        // Check if source is equal or parent to target (requires providers to be the same)
        if (sourceProvider === targetProvider) {
            const isPathCaseSensitive = !!(sourceProvider.capabilities & 1024 /* PathCaseSensitive */);
            if (!isPathCaseSensitive) {
                isSameResourceWithDifferentPathCase = source.toString().toLowerCase() === target.toString().toLowerCase();
            }
            if (isSameResourceWithDifferentPathCase && mode === 'copy') {
                throw new Error(core_1.nls.localizeByDefault("Unable to move/copy when source '{0}' is parent of target '{1}'.", this.resourceForError(source), this.resourceForError(target)));
            }
            if (!isSameResourceWithDifferentPathCase && target.isEqualOrParent(source, isPathCaseSensitive)) {
                throw new Error(core_1.nls.localizeByDefault("Unable to move/copy when source '{0}' is parent of target '{1}'.", this.resourceForError(source), this.resourceForError(target)));
            }
        }
        // Extra checks if target exists and this is not a rename
        const exists = await this.exists(target);
        if (exists && !isSameResourceWithDifferentPathCase) {
            // Special case: if the target is a parent of the source, we cannot delete
            // it as it would delete the source as well. In this case we have to throw
            if (sourceProvider === targetProvider) {
                const isPathCaseSensitive = !!(sourceProvider.capabilities & 1024 /* PathCaseSensitive */);
                if (source.isEqualOrParent(target, isPathCaseSensitive)) {
                    throw new Error(core_1.nls.localizeByDefault("Unable to move/copy '{0}' into '{1}' since a file would replace the folder it is contained in.", this.resourceForError(source), this.resourceForError(target)));
                }
            }
        }
        return { exists, isSameResourceWithDifferentPathCase };
    }
    async createFolder(resource, options = {}) {
        const { fromUserGesture = true, } = options;
        const provider = this.throwIfFileSystemIsReadonly(await this.withProvider(resource), resource);
        // mkdir recursively
        await this.mkdirp(provider, resource);
        // events
        const fileStat = await this.resolve(resource, { resolveMetadata: true });
        if (fromUserGesture) {
            this.onDidRunUserOperationEmitter.fire({ correlationId: this.correlationIds++, operation: 0 /* CREATE */, target: resource });
        }
        else {
            this.onDidRunOperationEmitter.fire(new files_1.FileOperationEvent(resource, 0 /* CREATE */, fileStat));
        }
        return fileStat;
    }
    async mkdirp(provider, directory) {
        const directoriesToCreate = [];
        // mkdir until we reach root
        while (!directory.path.isRoot) {
            try {
                const stat = await provider.stat(directory);
                if ((stat.type & files_1.FileType.Directory) === 0) {
                    throw new Error(core_1.nls.localizeByDefault("Unable to create folder '{0}' that already exists but is not a directory", this.resourceForError(directory)));
                }
                break; // we have hit a directory that exists -> good
            }
            catch (error) {
                // Bubble up any other error that is not file not found
                if ((0, files_1.toFileSystemProviderErrorCode)(error) !== files_1.FileSystemProviderErrorCode.FileNotFound) {
                    throw error;
                }
                // Upon error, remember directories that need to be created
                directoriesToCreate.push(directory.path.base);
                // Continue up
                directory = directory.parent;
            }
        }
        // Create directories as needed
        for (let i = directoriesToCreate.length - 1; i >= 0; i--) {
            directory = directory.resolve(directoriesToCreate[i]);
            try {
                await provider.mkdir(directory);
            }
            catch (error) {
                if ((0, files_1.toFileSystemProviderErrorCode)(error) !== files_1.FileSystemProviderErrorCode.FileExists) {
                    // For mkdirp() we tolerate that the mkdir() call fails
                    // in case the folder already exists. This follows node.js
                    // own implementation of fs.mkdir({ recursive: true }) and
                    // reduces the chances of race conditions leading to errors
                    // if multiple calls try to create the same folders
                    // As such, we only throw an error here if it is other than
                    // the fact that the file already exists.
                    // (see also https://github.com/microsoft/vscode/issues/89834)
                    throw error;
                }
            }
        }
    }
    async delete(resource, options) {
        if ((options === null || options === void 0 ? void 0 : options.fromUserGesture) === false) {
            return this.doDelete(resource, options);
        }
        await this.runFileOperationParticipants(resource, undefined, 1 /* DELETE */);
        const event = { correlationId: this.correlationIds++, operation: 1 /* DELETE */, target: resource };
        await this.onWillRunUserOperationEmitter.fire(event);
        try {
            await this.doDelete(resource, options);
        }
        catch (error) {
            await this.onDidFailUserOperationEmitter.fire(event);
            throw error;
        }
        await this.onDidRunUserOperationEmitter.fire(event);
    }
    async doDelete(resource, options) {
        const provider = this.throwIfFileSystemIsReadonly(await this.withProvider(resource), resource);
        // Validate trash support
        const useTrash = !!(options === null || options === void 0 ? void 0 : options.useTrash);
        if (useTrash && !(provider.capabilities & 4096 /* Trash */)) {
            throw new Error(core_1.nls.localizeByDefault("Unable to delete file '{0}' via trash because provider does not support it.", this.resourceForError(resource)));
        }
        // Validate delete
        const exists = await this.exists(resource);
        if (!exists) {
            throw new files_1.FileOperationError(core_1.nls.localizeByDefault("Unable to delete nonexistent file '{0}'", this.resourceForError(resource)), 1 /* FILE_NOT_FOUND */);
        }
        // Validate recursive
        const recursive = !!(options === null || options === void 0 ? void 0 : options.recursive);
        if (!recursive && exists) {
            const stat = await this.resolve(resource);
            if (stat.isDirectory && Array.isArray(stat.children) && stat.children.length > 0) {
                throw new Error(core_1.nls.localizeByDefault("Unable to delete non-empty folder '{0}'.", this.resourceForError(resource)));
            }
        }
        // Delete through provider
        await provider.delete(resource, { recursive, useTrash });
        // Events
        this.onDidRunOperationEmitter.fire(new files_1.FileOperationEvent(resource, 1 /* DELETE */));
    }
    /**
     * An event that is emitted when files are changed on the disk.
     */
    get onDidFilesChange() {
        return this.onDidFilesChangeEmitter.event;
    }
    watch(resource, options = { recursive: false, excludes: [] }) {
        const resolvedOptions = {
            ...options,
            // always ignore temporary upload files
            excludes: options.excludes.concat('**/theia_upload_*')
        };
        let watchDisposed = false;
        let watchDisposable = disposable_1.Disposable.create(() => watchDisposed = true);
        // Watch and wire in disposable which is async but
        // check if we got disposed meanwhile and forward
        this.doWatch(resource, resolvedOptions).then(disposable => {
            if (watchDisposed) {
                disposable.dispose();
            }
            else {
                watchDisposable = disposable;
            }
        }, error => console.error(error));
        return disposable_1.Disposable.create(() => watchDisposable.dispose());
    }
    async doWatch(resource, options) {
        const provider = await this.withProvider(resource);
        const key = this.toWatchKey(provider, resource, options);
        // Only start watching if we are the first for the given key
        const watcher = this.activeWatchers.get(key) || { count: 0, disposable: provider.watch(resource, options) };
        if (!this.activeWatchers.has(key)) {
            this.activeWatchers.set(key, watcher);
        }
        // Increment usage counter
        watcher.count += 1;
        return disposable_1.Disposable.create(() => {
            // Unref
            watcher.count--;
            // Dispose only when last user is reached
            if (watcher.count === 0) {
                watcher.disposable.dispose();
                this.activeWatchers.delete(key);
            }
        });
    }
    toWatchKey(provider, resource, options) {
        return [
            this.toMapKey(provider, resource),
            String(options.recursive),
            options.excludes.join() // use excludes as part of the key
        ].join();
    }
    ensureWriteQueue(provider, resource, task) {
        // ensure to never write to the same resource without finishing
        // the one write. this ensures a write finishes consistently
        // (even with error) before another write is done.
        const queueKey = this.toMapKey(provider, resource);
        const writeQueue = (this.writeQueues.get(queueKey) || Promise.resolve()).then(task, task);
        this.writeQueues.set(queueKey, writeQueue);
        return writeQueue;
    }
    toMapKey(provider, resource) {
        const isPathCaseSensitive = !!(provider.capabilities & 1024 /* PathCaseSensitive */);
        return isPathCaseSensitive ? resource.toString() : resource.toString().toLowerCase();
    }
    async doWriteBuffered(provider, resource, readableOrStreamOrBufferedStream) {
        return this.ensureWriteQueue(provider, resource, async () => {
            // open handle
            const handle = await provider.open(resource, { create: true });
            // write into handle until all bytes from buffer have been written
            try {
                if ((0, stream_1.isReadableStream)(readableOrStreamOrBufferedStream) || (0, stream_1.isReadableBufferedStream)(readableOrStreamOrBufferedStream)) {
                    await this.doWriteStreamBufferedQueued(provider, handle, readableOrStreamOrBufferedStream);
                }
                else {
                    await this.doWriteReadableBufferedQueued(provider, handle, readableOrStreamOrBufferedStream);
                }
            }
            catch (error) {
                throw (0, files_1.ensureFileSystemProviderError)(error);
            }
            finally {
                // close handle always
                await provider.close(handle);
            }
        });
    }
    async doWriteStreamBufferedQueued(provider, handle, streamOrBufferedStream) {
        let posInFile = 0;
        let stream;
        // Buffered stream: consume the buffer first by writing
        // it to the target before reading from the stream.
        if ((0, stream_1.isReadableBufferedStream)(streamOrBufferedStream)) {
            if (streamOrBufferedStream.buffer.length > 0) {
                const chunk = buffer_1.BinaryBuffer.concat(streamOrBufferedStream.buffer);
                await this.doWriteBuffer(provider, handle, chunk, chunk.byteLength, posInFile, 0);
                posInFile += chunk.byteLength;
            }
            // If the stream has been consumed, return early
            if (streamOrBufferedStream.ended) {
                return;
            }
            stream = streamOrBufferedStream.stream;
        }
        // Unbuffered stream - just take as is
        else {
            stream = streamOrBufferedStream;
        }
        return new Promise(async (resolve, reject) => {
            stream.on('data', async (chunk) => {
                // pause stream to perform async write operation
                stream.pause();
                try {
                    await this.doWriteBuffer(provider, handle, chunk, chunk.byteLength, posInFile, 0);
                }
                catch (error) {
                    return reject(error);
                }
                posInFile += chunk.byteLength;
                // resume stream now that we have successfully written
                // run this on the next tick to prevent increasing the
                // execution stack because resume() may call the event
                // handler again before finishing.
                setTimeout(() => stream.resume());
            });
            stream.on('error', error => reject(error));
            stream.on('end', () => resolve());
        });
    }
    async doWriteReadableBufferedQueued(provider, handle, readable) {
        let posInFile = 0;
        let chunk;
        while ((chunk = readable.read()) !== null) {
            await this.doWriteBuffer(provider, handle, chunk, chunk.byteLength, posInFile, 0);
            posInFile += chunk.byteLength;
        }
    }
    async doWriteBuffer(provider, handle, buffer, length, posInFile, posInBuffer) {
        let totalBytesWritten = 0;
        while (totalBytesWritten < length) {
            const bytesWritten = await provider.write(handle, posInFile + totalBytesWritten, buffer.buffer, posInBuffer + totalBytesWritten, length - totalBytesWritten);
            totalBytesWritten += bytesWritten;
        }
    }
    async doWriteUnbuffered(provider, resource, bufferOrReadableOrStreamOrBufferedStream) {
        return this.ensureWriteQueue(provider, resource, () => this.doWriteUnbufferedQueued(provider, resource, bufferOrReadableOrStreamOrBufferedStream));
    }
    async doWriteUnbufferedQueued(provider, resource, bufferOrReadableOrStreamOrBufferedStream) {
        let buffer;
        if (bufferOrReadableOrStreamOrBufferedStream instanceof buffer_1.BinaryBuffer) {
            buffer = bufferOrReadableOrStreamOrBufferedStream;
        }
        else if ((0, stream_1.isReadableStream)(bufferOrReadableOrStreamOrBufferedStream)) {
            buffer = await buffer_1.BinaryBufferReadableStream.toBuffer(bufferOrReadableOrStreamOrBufferedStream);
        }
        else if ((0, stream_1.isReadableBufferedStream)(bufferOrReadableOrStreamOrBufferedStream)) {
            buffer = await buffer_1.BinaryBufferReadableBufferedStream.toBuffer(bufferOrReadableOrStreamOrBufferedStream);
        }
        else {
            buffer = buffer_1.BinaryBufferReadable.toBuffer(bufferOrReadableOrStreamOrBufferedStream);
        }
        return provider.writeFile(resource, buffer.buffer, { create: true, overwrite: true });
    }
    async doPipeBuffered(sourceProvider, source, targetProvider, target) {
        return this.ensureWriteQueue(targetProvider, target, () => this.doPipeBufferedQueued(sourceProvider, source, targetProvider, target));
    }
    async doPipeBufferedQueued(sourceProvider, source, targetProvider, target) {
        let sourceHandle = undefined;
        let targetHandle = undefined;
        try {
            // Open handles
            sourceHandle = await sourceProvider.open(source, { create: false });
            targetHandle = await targetProvider.open(target, { create: true });
            const buffer = buffer_1.BinaryBuffer.alloc(this.BUFFER_SIZE);
            let posInFile = 0;
            let posInBuffer = 0;
            let bytesRead = 0;
            do {
                // read from source (sourceHandle) at current position (posInFile) into buffer (buffer) at
                // buffer position (posInBuffer) up to the size of the buffer (buffer.byteLength).
                bytesRead = await sourceProvider.read(sourceHandle, posInFile, buffer.buffer, posInBuffer, buffer.byteLength - posInBuffer);
                // write into target (targetHandle) at current position (posInFile) from buffer (buffer) at
                // buffer position (posInBuffer) all bytes we read (bytesRead).
                await this.doWriteBuffer(targetProvider, targetHandle, buffer, bytesRead, posInFile, posInBuffer);
                posInFile += bytesRead;
                posInBuffer += bytesRead;
                // when buffer full, fill it again from the beginning
                if (posInBuffer === buffer.byteLength) {
                    posInBuffer = 0;
                }
            } while (bytesRead > 0);
        }
        catch (error) {
            throw (0, files_1.ensureFileSystemProviderError)(error);
        }
        finally {
            await Promise.all([
                typeof sourceHandle === 'number' ? sourceProvider.close(sourceHandle) : Promise.resolve(),
                typeof targetHandle === 'number' ? targetProvider.close(targetHandle) : Promise.resolve(),
            ]);
        }
    }
    async doPipeUnbuffered(sourceProvider, source, targetProvider, target) {
        return this.ensureWriteQueue(targetProvider, target, () => this.doPipeUnbufferedQueued(sourceProvider, source, targetProvider, target));
    }
    async doPipeUnbufferedQueued(sourceProvider, source, targetProvider, target) {
        return targetProvider.writeFile(target, await sourceProvider.readFile(source), { create: true, overwrite: true });
    }
    async doPipeUnbufferedToBuffered(sourceProvider, source, targetProvider, target) {
        return this.ensureWriteQueue(targetProvider, target, () => this.doPipeUnbufferedToBufferedQueued(sourceProvider, source, targetProvider, target));
    }
    async doPipeUnbufferedToBufferedQueued(sourceProvider, source, targetProvider, target) {
        // Open handle
        const targetHandle = await targetProvider.open(target, { create: true });
        // Read entire buffer from source and write buffered
        try {
            const buffer = await sourceProvider.readFile(source);
            await this.doWriteBuffer(targetProvider, targetHandle, buffer_1.BinaryBuffer.wrap(buffer), buffer.byteLength, 0, 0);
        }
        catch (error) {
            throw (0, files_1.ensureFileSystemProviderError)(error);
        }
        finally {
            await targetProvider.close(targetHandle);
        }
    }
    async doPipeBufferedToUnbuffered(sourceProvider, source, targetProvider, target) {
        // Read buffer via stream buffered
        const buffer = await buffer_1.BinaryBufferReadableStream.toBuffer(this.readFileBuffered(sourceProvider, source, cancellation_1.CancellationToken.None));
        // Write buffer into target at once
        await this.doWriteUnbuffered(targetProvider, target, buffer);
    }
    throwIfFileSystemIsReadonly(provider, resource) {
        if (provider.capabilities & 2048 /* Readonly */) {
            throw new files_1.FileOperationError(core_1.nls.localizeByDefault("Unable to modify read-only file '{0}'", this.resourceForError(resource)), 6 /* FILE_PERMISSION_DENIED */);
        }
        return provider;
    }
    resourceForError(resource) {
        return this.labelProvider.getLongName(resource);
    }
    addFileOperationParticipant(participant) {
        this.participants.push(participant);
        return disposable_1.Disposable.create(() => {
            const index = this.participants.indexOf(participant);
            if (index > -1) {
                this.participants.splice(index, 1);
            }
        });
    }
    async runFileOperationParticipants(target, source, operation) {
        const participantsTimeout = this.preferences['files.participants.timeout'];
        if (participantsTimeout <= 0 || this.participants.length === 0) {
            return;
        }
        const cancellationTokenSource = new cancellation_1.CancellationTokenSource();
        return this.progressService.withProgress(this.progressLabel(operation), 'notification', async () => {
            for (const participant of this.participants) {
                if (cancellationTokenSource.token.isCancellationRequested) {
                    break;
                }
                try {
                    const promise = participant.participate(target, source, operation, participantsTimeout, cancellationTokenSource.token);
                    await Promise.race([
                        promise,
                        (0, promise_util_1.timeout)(participantsTimeout, cancellationTokenSource.token).then(() => cancellationTokenSource.dispose(), () => { })
                    ]);
                }
                catch (err) {
                    console.warn(err);
                }
            }
        }, () => {
            cancellationTokenSource.cancel();
        });
    }
    progressLabel(operation) {
        switch (operation) {
            case 0 /* CREATE */:
                return core_1.nls.localizeByDefault("Running 'File Create' participants...");
            case 2 /* MOVE */:
                return core_1.nls.localizeByDefault("Running 'File Rename' participants...");
            case 3 /* COPY */:
                return core_1.nls.localizeByDefault("Running 'File Copy' participants...");
            case 1 /* DELETE */:
                return core_1.nls.localizeByDefault("Running 'File Delete' participants...");
        }
    }
    // #endregion
    // #region encoding
    async getWriteEncoding(resource, options) {
        const encoding = await this.getEncodingForResource(resource, options ? options.encoding : undefined);
        return this.encodingService.toResourceEncoding(encoding, {
            overwriteEncoding: options === null || options === void 0 ? void 0 : options.overwriteEncoding,
            read: async (length) => {
                const buffer = await buffer_1.BinaryBufferReadableStream.toBuffer((await this.readFileStream(resource, { length })).value);
                return buffer.buffer;
            }
        });
    }
    getReadEncoding(resource, options, detectedEncoding) {
        let preferredEncoding;
        // Encoding passed in as option
        if (options === null || options === void 0 ? void 0 : options.encoding) {
            if (detectedEncoding === encodings_1.UTF8_with_bom && options.encoding === encodings_1.UTF8) {
                preferredEncoding = encodings_1.UTF8_with_bom; // indicate the file has BOM if we are to resolve with UTF 8
            }
            else {
                preferredEncoding = options.encoding; // give passed in encoding highest priority
            }
        }
        else if (detectedEncoding) {
            preferredEncoding = detectedEncoding;
        }
        return this.getEncodingForResource(resource, preferredEncoding);
    }
    async getEncodingForResource(resource, preferredEncoding) {
        resource = await this.toUnderlyingResource(resource);
        return this.encodingRegistry.getEncodingForResource(resource, preferredEncoding);
    }
    /**
     * Converts to an underlying fs provider resource format.
     *
     * For example converting `user-storage` resources to `file` resources under a user home:
     * user-storage:/user/settings.json => file://home/.theia/settings.json
     */
    async toUnderlyingResource(resource) {
        let provider = await this.withProvider(resource);
        while (provider instanceof delegating_file_system_provider_1.DelegatingFileSystemProvider) {
            resource = provider.toUnderlyingResource(resource);
            provider = await this.withProvider(resource);
        }
        return resource;
    }
    // #endregion
    handleFileWatchError() {
        this.watcherErrorHandler.handleError();
    }
};
__decorate([
    (0, inversify_1.inject)(label_provider_1.LabelProvider),
    __metadata("design:type", label_provider_1.LabelProvider)
], FileService.prototype, "labelProvider", void 0);
__decorate([
    (0, inversify_1.inject)(filesystem_preferences_1.FileSystemPreferences),
    __metadata("design:type", Object)
], FileService.prototype, "preferences", void 0);
__decorate([
    (0, inversify_1.inject)(progress_service_1.ProgressService),
    __metadata("design:type", progress_service_1.ProgressService)
], FileService.prototype, "progressService", void 0);
__decorate([
    (0, inversify_1.inject)(encoding_registry_1.EncodingRegistry),
    __metadata("design:type", encoding_registry_1.EncodingRegistry)
], FileService.prototype, "encodingRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(encoding_service_1.EncodingService),
    __metadata("design:type", encoding_service_1.EncodingService)
], FileService.prototype, "encodingService", void 0);
__decorate([
    (0, inversify_1.inject)(contribution_provider_1.ContributionProvider),
    (0, inversify_1.named)(exports.FileServiceContribution),
    __metadata("design:type", Object)
], FileService.prototype, "contributions", void 0);
__decorate([
    (0, inversify_1.inject)(filesystem_watcher_error_handler_1.FileSystemWatcherErrorHandler),
    __metadata("design:type", filesystem_watcher_error_handler_1.FileSystemWatcherErrorHandler)
], FileService.prototype, "watcherErrorHandler", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FileService.prototype, "init", null);
FileService = __decorate([
    (0, inversify_1.injectable)()
], FileService);
exports.FileService = FileService;
//# sourceMappingURL=file-service.js.map