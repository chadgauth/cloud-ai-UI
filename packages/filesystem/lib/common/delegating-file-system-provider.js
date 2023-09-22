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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DelegatingFileSystemProvider = void 0;
const common_1 = require("@theia/core/lib/common");
const disposable_1 = require("@theia/core/lib/common/disposable");
const files_1 = require("./files");
class DelegatingFileSystemProvider {
    constructor(delegate, options, toDispose = new disposable_1.DisposableCollection()) {
        this.delegate = delegate;
        this.options = options;
        this.toDispose = toDispose;
        this.onDidChangeFileEmitter = new common_1.Emitter();
        this.onDidChangeFile = this.onDidChangeFileEmitter.event;
        this.onFileWatchErrorEmitter = new common_1.Emitter();
        this.onFileWatchError = this.onFileWatchErrorEmitter.event;
        this.toDispose.push(this.onDidChangeFileEmitter);
        this.toDispose.push(delegate.onDidChangeFile(changes => this.handleFileChanges(changes)));
        this.toDispose.push(this.onFileWatchErrorEmitter);
        this.toDispose.push(delegate.onFileWatchError(changes => this.onFileWatchErrorEmitter.fire()));
    }
    dispose() {
        this.toDispose.dispose();
    }
    get capabilities() {
        return this.delegate.capabilities;
    }
    get onDidChangeCapabilities() {
        return this.delegate.onDidChangeCapabilities;
    }
    watch(resource, opts) {
        return this.delegate.watch(this.toUnderlyingResource(resource), opts);
    }
    stat(resource) {
        return this.delegate.stat(this.toUnderlyingResource(resource));
    }
    access(resource, mode) {
        if ((0, files_1.hasAccessCapability)(this.delegate)) {
            return this.delegate.access(this.toUnderlyingResource(resource), mode);
        }
        throw new Error('not supported');
    }
    fsPath(resource) {
        if ((0, files_1.hasAccessCapability)(this.delegate)) {
            return this.delegate.fsPath(this.toUnderlyingResource(resource));
        }
        throw new Error('not supported');
    }
    mkdir(resource) {
        return this.delegate.mkdir(this.toUnderlyingResource(resource));
    }
    rename(from, to, opts) {
        return this.delegate.rename(this.toUnderlyingResource(from), this.toUnderlyingResource(to), opts);
    }
    copy(from, to, opts) {
        if ((0, files_1.hasFileFolderCopyCapability)(this.delegate)) {
            return this.delegate.copy(this.toUnderlyingResource(from), this.toUnderlyingResource(to), opts);
        }
        throw new Error('not supported');
    }
    readFile(resource) {
        if ((0, files_1.hasReadWriteCapability)(this.delegate)) {
            return this.delegate.readFile(this.toUnderlyingResource(resource));
        }
        throw new Error('not supported');
    }
    readFileStream(resource, opts, token) {
        if ((0, files_1.hasFileReadStreamCapability)(this.delegate)) {
            return this.delegate.readFileStream(this.toUnderlyingResource(resource), opts, token);
        }
        throw new Error('not supported');
    }
    readdir(resource) {
        return this.delegate.readdir(this.toUnderlyingResource(resource));
    }
    writeFile(resource, content, opts) {
        if ((0, files_1.hasReadWriteCapability)(this.delegate)) {
            return this.delegate.writeFile(this.toUnderlyingResource(resource), content, opts);
        }
        throw new Error('not supported');
    }
    open(resource, opts) {
        if ((0, files_1.hasOpenReadWriteCloseCapability)(this.delegate)) {
            return this.delegate.open(this.toUnderlyingResource(resource), opts);
        }
        throw new Error('not supported');
    }
    close(fd) {
        if ((0, files_1.hasOpenReadWriteCloseCapability)(this.delegate)) {
            return this.delegate.close(fd);
        }
        throw new Error('not supported');
    }
    read(fd, pos, data, offset, length) {
        if ((0, files_1.hasOpenReadWriteCloseCapability)(this.delegate)) {
            return this.delegate.read(fd, pos, data, offset, length);
        }
        throw new Error('not supported');
    }
    write(fd, pos, data, offset, length) {
        if ((0, files_1.hasOpenReadWriteCloseCapability)(this.delegate)) {
            return this.delegate.write(fd, pos, data, offset, length);
        }
        throw new Error('not supported');
    }
    delete(resource, opts) {
        return this.delegate.delete(this.toUnderlyingResource(resource), opts);
    }
    updateFile(resource, changes, opts) {
        if ((0, files_1.hasUpdateCapability)(this.delegate)) {
            return this.delegate.updateFile(resource, changes, opts);
        }
        throw new Error('not supported');
    }
    handleFileChanges(changes) {
        const delegatingChanges = [];
        for (const change of changes) {
            const delegatingResource = this.fromUnderlyingResource(change.resource);
            if (delegatingResource) {
                delegatingChanges.push({
                    resource: delegatingResource,
                    type: change.type
                });
            }
        }
        if (delegatingChanges.length) {
            this.onDidChangeFileEmitter.fire(delegatingChanges);
        }
    }
    /**
     * Converts to an underlying fs provider resource format.
     *
     * For example converting `user-storage` resources to `file` resources under a user home:
     * user-storage:/user/settings.json => file://home/.theia/settings.json
     */
    toUnderlyingResource(resource) {
        const underlying = this.options.uriConverter.to(resource);
        if (!underlying) {
            throw new Error('invalid resource: ' + resource.toString());
        }
        return underlying;
    }
    /**
     * Converts from an underlying fs provider resource format.
     *
     * For example converting `file` resources under a user home to `user-storage` resource:
     * - file://home/.theia/settings.json => user-storage:/user/settings.json
     * - file://documents/some-document.txt => undefined
     */
    fromUnderlyingResource(resource) {
        return this.options.uriConverter.from(resource);
    }
}
exports.DelegatingFileSystemProvider = DelegatingFileSystemProvider;
//# sourceMappingURL=delegating-file-system-provider.js.map