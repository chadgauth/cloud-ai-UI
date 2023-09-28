"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NsfwFileSystemWatcherService = exports.NsfwWatcher = exports.WatcherDisposal = exports.NsfwFileSystemWatcherServerOptions = void 0;
const nsfw = require("@theia/core/shared/nsfw");
const path = require("path");
const fs_1 = require("fs");
const minimatch_1 = require("minimatch");
const file_uri_1 = require("@theia/core/lib/node/file-uri");
const file_change_collection_1 = require("../file-change-collection");
const promise_util_1 = require("@theia/core/lib/common/promise-util");
exports.NsfwFileSystemWatcherServerOptions = Symbol('NsfwFileSystemWatcherServerOptions');
/**
 * This is a flag value passed around upon disposal.
 */
exports.WatcherDisposal = Symbol('WatcherDisposal');
/**
 * Because URIs can be watched by different clients, we'll track
 * how many are listening for a given URI.
 *
 * This component wraps the whole start/stop process given some
 * reference count.
 *
 * Once there are no more references the handle
 * will wait for some time before destroying its resources.
 */
class NsfwWatcher {
    constructor(
    /** Initial reference to this handle. */
    initialClientId, 
    /** Filesystem path to be watched. */
    fsPath, 
    /** Watcher-specific options */
    watcherOptions, 
    /** Logging and Nsfw options */
    nsfwFileSystemWatchServerOptions, 
    /** The client to forward events to. */
    fileSystemWatcherClient, 
    /** Amount of time in ms to wait once this handle is not referenced anymore. */
    deferredDisposalTimeout = 10000) {
        this.fsPath = fsPath;
        this.watcherOptions = watcherOptions;
        this.nsfwFileSystemWatchServerOptions = nsfwFileSystemWatchServerOptions;
        this.fileSystemWatcherClient = fileSystemWatcherClient;
        this.deferredDisposalTimeout = deferredDisposalTimeout;
        this.disposed = false;
        /**
         * Used for debugging to keep track of the watchers.
         */
        this.debugId = NsfwWatcher.debugIdSequence++;
        /**
         * This deferred only rejects with `WatcherDisposal` and never resolves.
         */
        this.deferredDisposalDeferred = new promise_util_1.Deferred();
        /**
         * We count each reference made to this watcher, per client.
         *
         * We do this to know where to send events via the network.
         *
         * An entry should be removed when its value hits zero.
         */
        this.refsPerClient = new Map();
        /**
         * Ensures that events are processed in the order they are emitted,
         * despite being processed async.
         */
        this.nsfwEventProcessingQueue = Promise.resolve();
        /**
         * Resolves once this handle disposed itself and its resources. Never throws.
         */
        this.whenDisposed = this.deferredDisposalDeferred.promise.catch(() => undefined);
        this.refsPerClient.set(initialClientId, { value: 1 });
        this.whenStarted = this.start().then(() => true, error => {
            if (error === exports.WatcherDisposal) {
                return false;
            }
            this._dispose();
            this.fireError();
            throw error;
        });
        this.debug('NEW', `initialClientId=${initialClientId}`);
    }
    addRef(clientId) {
        let refs = this.refsPerClient.get(clientId);
        if (typeof refs === 'undefined') {
            this.refsPerClient.set(clientId, refs = { value: 1 });
        }
        else {
            refs.value += 1;
        }
        const totalRefs = this.getTotalReferences();
        // If it was zero before, 1 means we were revived:
        const revived = totalRefs === 1;
        if (revived) {
            this.onRefsRevive();
        }
        this.debug('REF++', `clientId=${clientId}, clientRefs=${refs.value}, totalRefs=${totalRefs}. revived=${revived}`);
    }
    removeRef(clientId) {
        const refs = this.refsPerClient.get(clientId);
        if (typeof refs === 'undefined') {
            this.info('WARN REF--', `removed one too many reference: clientId=${clientId}`);
            return;
        }
        refs.value -= 1;
        // We must remove the key from `this.clientReferences` because
        // we list active clients by reading the keys of this map.
        if (refs.value === 0) {
            this.refsPerClient.delete(clientId);
        }
        const totalRefs = this.getTotalReferences();
        const dead = totalRefs === 0;
        if (dead) {
            this.onRefsReachZero();
        }
        this.debug('REF--', `clientId=${clientId}, clientRefs=${refs.value}, totalRefs=${totalRefs}, dead=${dead}`);
    }
    /**
     * All clients with at least one active reference.
     */
    getClientIds() {
        return Array.from(this.refsPerClient.keys());
    }
    /**
     * Add the references for each client together.
     */
    getTotalReferences() {
        let total = 0;
        for (const refs of this.refsPerClient.values()) {
            total += refs.value;
        }
        return total;
    }
    /**
     * Returns true if at least one client listens to this handle.
     */
    isInUse() {
        return this.refsPerClient.size > 0;
    }
    /**
     * @throws with {@link WatcherDisposal} if this instance is disposed.
     */
    assertNotDisposed() {
        if (this.disposed) {
            throw exports.WatcherDisposal;
        }
    }
    /**
     * When starting a watcher, we'll first check and wait for the path to exists
     * before running an NSFW watcher.
     */
    async start() {
        while (await fs_1.promises.stat(this.fsPath).then(() => false, () => true)) {
            await (0, promise_util_1.timeout)(500);
            this.assertNotDisposed();
        }
        this.assertNotDisposed();
        const watcher = await this.createNsfw();
        this.assertNotDisposed();
        await watcher.start();
        this.debug('STARTED', `disposed=${this.disposed}`);
        // The watcher could be disposed while it was starting, make sure to check for this:
        if (this.disposed) {
            await this.stopNsfw(watcher);
            throw exports.WatcherDisposal;
        }
        this.nsfw = watcher;
    }
    /**
     * Given a started nsfw instance, gracefully shut it down.
     */
    async stopNsfw(watcher) {
        await watcher.stop()
            .then(() => 'success=true', error => error)
            .then(status => this.debug('STOPPED', status));
    }
    async createNsfw() {
        const fsPath = await fs_1.promises.realpath(this.fsPath);
        return nsfw(fsPath, events => this.handleNsfwEvents(events), {
            ...this.nsfwFileSystemWatchServerOptions.nsfwOptions,
            // The errorCallback is called whenever NSFW crashes *while* watching.
            // See https://github.com/atom/github/issues/342
            errorCallback: error => {
                console.error(`NSFW service error on "${fsPath}":`, error);
                this._dispose();
                this.fireError();
                // Make sure to call user's error handling code:
                if (this.nsfwFileSystemWatchServerOptions.nsfwOptions.errorCallback) {
                    this.nsfwFileSystemWatchServerOptions.nsfwOptions.errorCallback(error);
                }
            },
        });
    }
    handleNsfwEvents(events) {
        // Only process events if someone is listening.
        if (this.isInUse()) {
            // This callback is async, but nsfw won't wait for it to finish before firing the next one.
            // We will use a lock/queue to make sure everything is processed in the order it arrives.
            this.nsfwEventProcessingQueue = this.nsfwEventProcessingQueue.then(async () => {
                const fileChangeCollection = new file_change_collection_1.FileChangeCollection();
                await Promise.all(events.map(async (event) => {
                    if (event.action === 3 /* RENAMED */) {
                        const [oldPath, newPath] = await Promise.all([
                            this.resolveEventPath(event.directory, event.oldFile),
                            this.resolveEventPath(event.newDirectory, event.newFile),
                        ]);
                        this.pushFileChange(fileChangeCollection, 2 /* DELETED */, oldPath);
                        this.pushFileChange(fileChangeCollection, 1 /* ADDED */, newPath);
                    }
                    else {
                        const filePath = await this.resolveEventPath(event.directory, event.file);
                        if (event.action === 0 /* CREATED */) {
                            this.pushFileChange(fileChangeCollection, 1 /* ADDED */, filePath);
                        }
                        else if (event.action === 1 /* DELETED */) {
                            this.pushFileChange(fileChangeCollection, 2 /* DELETED */, filePath);
                        }
                        else if (event.action === 2 /* MODIFIED */) {
                            this.pushFileChange(fileChangeCollection, 0 /* UPDATED */, filePath);
                        }
                    }
                }));
                const changes = fileChangeCollection.values();
                // If all changes are part of the ignored files, the collection will be empty.
                if (changes.length > 0) {
                    this.fileSystemWatcherClient.onDidFilesChanged({
                        clients: this.getClientIds(),
                        changes,
                    });
                }
            }, console.error);
        }
    }
    async resolveEventPath(directory, file) {
        // nsfw already resolves symlinks, the paths should be clean already:
        return path.resolve(directory, file);
    }
    pushFileChange(changes, type, filePath) {
        if (!this.isIgnored(filePath)) {
            const uri = file_uri_1.FileUri.create(filePath).toString();
            changes.push({ type, uri });
        }
    }
    fireError() {
        this.fileSystemWatcherClient.onError({
            clients: this.getClientIds(),
            uri: this.fsPath,
        });
    }
    /**
     * When references hit zero, we'll schedule disposal for a bit later.
     *
     * This allows new references to reuse this watcher instead of creating a new one.
     *
     * e.g. A frontend disconnects for a few milliseconds before reconnecting again.
     */
    onRefsReachZero() {
        this.deferredDisposalTimer = setTimeout(() => this._dispose(), this.deferredDisposalTimeout);
    }
    /**
     * If we get new references after hitting zero, let's unschedule our disposal and keep watching.
     */
    onRefsRevive() {
        if (this.deferredDisposalTimer) {
            clearTimeout(this.deferredDisposalTimer);
            this.deferredDisposalTimer = undefined;
        }
    }
    isIgnored(filePath) {
        return this.watcherOptions.ignored.length > 0
            && this.watcherOptions.ignored.some(m => m.match(filePath));
    }
    /**
     * Internal disposal mechanism.
     */
    async _dispose() {
        if (!this.disposed) {
            this.disposed = true;
            this.deferredDisposalDeferred.reject(exports.WatcherDisposal);
            if (this.nsfw) {
                this.stopNsfw(this.nsfw);
                this.nsfw = undefined;
            }
            this.debug('DISPOSED');
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    info(prefix, ...params) {
        this.nsfwFileSystemWatchServerOptions.info(`${prefix} NsfwWatcher(${this.debugId} at "${this.fsPath}"):`, ...params);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    debug(prefix, ...params) {
        if (this.nsfwFileSystemWatchServerOptions.verbose) {
            this.info(prefix, ...params);
        }
    }
}
exports.NsfwWatcher = NsfwWatcher;
NsfwWatcher.debugIdSequence = 0;
class NsfwFileSystemWatcherService {
    constructor(options) {
        this.watcherId = 0;
        this.watchers = new Map();
        this.watcherHandles = new Map();
        /**
         * `this.client` is undefined until someone sets it.
         */
        this.maybeClient = {
            onDidFilesChanged: event => { var _a; return (_a = this.client) === null || _a === void 0 ? void 0 : _a.onDidFilesChanged(event); },
            onError: event => { var _a; return (_a = this.client) === null || _a === void 0 ? void 0 : _a.onError(event); },
        };
        this.options = {
            nsfwOptions: {},
            verbose: false,
            info: (message, ...args) => console.info(message, ...args),
            error: (message, ...args) => console.error(message, ...args),
            ...options
        };
    }
    setClient(client) {
        this.client = client;
    }
    /**
     * A specific client requests us to watch a given `uri` according to some `options`.
     *
     * We internally re-use all the same `(uri, options)` pairs.
     */
    async watchFileChanges(clientId, uri, options) {
        const resolvedOptions = this.resolveWatchOptions(options);
        const watcherKey = this.getWatcherKey(uri, resolvedOptions);
        let watcher = this.watchers.get(watcherKey);
        if (watcher === undefined) {
            const fsPath = file_uri_1.FileUri.fsPath(uri);
            watcher = this.createWatcher(clientId, fsPath, resolvedOptions);
            watcher.whenDisposed.then(() => this.watchers.delete(watcherKey));
            this.watchers.set(watcherKey, watcher);
        }
        else {
            watcher.addRef(clientId);
        }
        const watcherId = this.watcherId++;
        this.watcherHandles.set(watcherId, { clientId, watcher });
        watcher.whenDisposed.then(() => this.watcherHandles.delete(watcherId));
        return watcherId;
    }
    createWatcher(clientId, fsPath, options) {
        const watcherOptions = {
            ignored: options.ignored
                .map(pattern => new minimatch_1.Minimatch(pattern, { dot: true })),
        };
        return new NsfwWatcher(clientId, fsPath, watcherOptions, this.options, this.maybeClient);
    }
    async unwatchFileChanges(watcherId) {
        const handle = this.watcherHandles.get(watcherId);
        if (handle === undefined) {
            console.warn(`tried to de-allocate a disposed watcher: watcherId=${watcherId}`);
        }
        else {
            this.watcherHandles.delete(watcherId);
            handle.watcher.removeRef(handle.clientId);
        }
    }
    /**
     * Given some `URI` and some `WatchOptions`, generate a unique key.
     */
    getWatcherKey(uri, options) {
        return [
            uri,
            options.ignored.slice(0).sort().join() // use a **sorted copy** of `ignored` as part of the key
        ].join();
    }
    /**
     * Return fully qualified options.
     */
    resolveWatchOptions(options) {
        return {
            ignored: [],
            ...options,
        };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    debug(message, ...params) {
        if (this.options.verbose) {
            this.options.info(message, ...params);
        }
    }
    dispose() {
        // Singletons shouldn't be disposed...
    }
}
exports.NsfwFileSystemWatcherService = NsfwFileSystemWatcherService;
//# sourceMappingURL=nsfw-filesystem-service.js.map