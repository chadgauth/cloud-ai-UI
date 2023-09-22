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
// based on https://github.com/microsoft/vscode/blob/04c36be045a94fee58e5f8992d3e3fd980294a84/src/vs/platform/files/common/files.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinarySize = exports.etag = exports.ETAG_DISABLED = exports.toFileOperationResult = exports.toFileSystemProviderErrorCode = exports.markAsFileSystemProviderError = exports.hasFileReadStreamCapability = exports.hasOpenReadWriteCloseCapability = exports.hasFileFolderCopyCapability = exports.hasReadWriteCapability = exports.hasUpdateCapability = exports.hasAccessCapability = exports.FileSystemProvider = exports.ensureFileSystemProviderError = exports.createFileSystemProviderError = exports.FileSystemProviderError = exports.FileSystemProviderErrorCode = exports.FilePermission = exports.FileType = exports.FileOperationError = exports.FileStat = exports.BaseStat = exports.FileChangesEvent = exports.FileOperationEvent = void 0;
const uri_1 = require("@theia/core/lib/common/uri");
const common_1 = require("@theia/core/lib/common");
class FileOperationEvent {
    constructor(resource, operation, target) {
        this.resource = resource;
        this.operation = operation;
        this.target = target;
    }
    isOperation(operation) {
        return this.operation === operation;
    }
}
exports.FileOperationEvent = FileOperationEvent;
class FileChangesEvent {
    constructor(changes) {
        this.changes = changes;
    }
    /**
     * Returns true if this change event contains the provided file with the given change type (if provided). In case of
     * type DELETED, this method will also return true if a folder got deleted that is the parent of the
     * provided file path.
     */
    contains(resource, type) {
        if (!resource) {
            return false;
        }
        const checkForChangeType = typeof type === 'number';
        return this.changes.some(change => {
            if (checkForChangeType && change.type !== type) {
                return false;
            }
            // For deleted also return true when deleted folder is parent of target path
            if (change.type === 2 /* DELETED */) {
                return change.resource.isEqualOrParent(resource);
            }
            return change.resource.toString() === resource.toString();
        });
    }
    /**
     * Returns the changes that describe added files.
     */
    getAdded() {
        return this.getOfType(1 /* ADDED */);
    }
    /**
     * Returns if this event contains added files.
     */
    gotAdded() {
        return this.hasType(1 /* ADDED */);
    }
    /**
     * Returns the changes that describe deleted files.
     */
    getDeleted() {
        return this.getOfType(2 /* DELETED */);
    }
    /**
     * Returns if this event contains deleted files.
     */
    gotDeleted() {
        return this.hasType(2 /* DELETED */);
    }
    /**
     * Returns the changes that describe updated files.
     */
    getUpdated() {
        return this.getOfType(0 /* UPDATED */);
    }
    /**
     * Returns if this event contains updated files.
     */
    gotUpdated() {
        return this.hasType(0 /* UPDATED */);
    }
    getOfType(type) {
        return this.changes.filter(change => change.type === type);
    }
    hasType(type) {
        return this.changes.some(change => change.type === type);
    }
}
exports.FileChangesEvent = FileChangesEvent;
var BaseStat;
(function (BaseStat) {
    function is(arg) {
        return (0, common_1.isObject)(arg)
            && arg.resource instanceof uri_1.default
            && typeof arg.name === 'string';
    }
    BaseStat.is = is;
})(BaseStat = exports.BaseStat || (exports.BaseStat = {}));
var FileStat;
(function (FileStat) {
    function is(arg) {
        const fileStat = arg;
        return BaseStat.is(fileStat) &&
            ('isFile' in fileStat && typeof fileStat.isFile === 'boolean') &&
            ('isDirectory' in fileStat && typeof fileStat.isDirectory === 'boolean') &&
            ('isSymbolicLink' in fileStat && typeof fileStat.isSymbolicLink === 'boolean');
    }
    FileStat.is = is;
    function asFileType(stat) {
        let res = 0;
        if (stat.isFile) {
            res += FileType.File;
        }
        else if (stat.isDirectory) {
            res += FileType.Directory;
        }
        if (stat.isSymbolicLink) {
            res += FileType.SymbolicLink;
        }
        return res;
    }
    FileStat.asFileType = asFileType;
    function toStat(stat) {
        return {
            type: asFileType(stat),
            ctime: stat.ctime,
            mtime: stat.mtime,
            size: stat.size
        };
    }
    FileStat.toStat = toStat;
    function fromStat(resource, stat) {
        return {
            resource,
            name: resource.path.base || resource.path.toString(),
            isFile: (stat.type & FileType.File) !== 0,
            isDirectory: (stat.type & FileType.Directory) !== 0,
            isSymbolicLink: (stat.type & FileType.SymbolicLink) !== 0,
            isReadonly: !!stat.permissions && (stat.permissions & FilePermission.Readonly) !== 0,
            mtime: stat.mtime,
            ctime: stat.ctime,
            size: stat.size,
            etag: etag({ mtime: stat.mtime, size: stat.size })
        };
    }
    FileStat.fromStat = fromStat;
    function dir(resource, stat) {
        return fromStat(resource instanceof uri_1.default ? resource : new uri_1.default(resource), { type: FileType.Directory, ...stat });
    }
    FileStat.dir = dir;
    function file(resource, stat) {
        return fromStat(resource instanceof uri_1.default ? resource : new uri_1.default(resource), { type: FileType.File, ...stat });
    }
    FileStat.file = file;
})(FileStat = exports.FileStat || (exports.FileStat = {}));
class FileOperationError extends Error {
    constructor(message, fileOperationResult, options) {
        super(message);
        this.fileOperationResult = fileOperationResult;
        this.options = options;
        Object.setPrototypeOf(this, FileOperationError.prototype);
    }
}
exports.FileOperationError = FileOperationError;
var FileType;
(function (FileType) {
    FileType[FileType["Unknown"] = 0] = "Unknown";
    FileType[FileType["File"] = 1] = "File";
    FileType[FileType["Directory"] = 2] = "Directory";
    FileType[FileType["SymbolicLink"] = 64] = "SymbolicLink";
})(FileType = exports.FileType || (exports.FileType = {}));
var FilePermission;
(function (FilePermission) {
    /**
     * File is readonly.
     */
    FilePermission[FilePermission["Readonly"] = 1] = "Readonly";
})(FilePermission = exports.FilePermission || (exports.FilePermission = {}));
var FileSystemProviderErrorCode;
(function (FileSystemProviderErrorCode) {
    FileSystemProviderErrorCode["FileExists"] = "EntryExists";
    FileSystemProviderErrorCode["FileNotFound"] = "EntryNotFound";
    FileSystemProviderErrorCode["FileNotADirectory"] = "EntryNotADirectory";
    FileSystemProviderErrorCode["FileIsADirectory"] = "EntryIsADirectory";
    FileSystemProviderErrorCode["FileExceedsMemoryLimit"] = "EntryExceedsMemoryLimit";
    FileSystemProviderErrorCode["FileTooLarge"] = "EntryTooLarge";
    FileSystemProviderErrorCode["NoPermissions"] = "NoPermissions";
    FileSystemProviderErrorCode["Unavailable"] = "Unavailable";
    FileSystemProviderErrorCode["Unknown"] = "Unknown";
})(FileSystemProviderErrorCode = exports.FileSystemProviderErrorCode || (exports.FileSystemProviderErrorCode = {}));
class FileSystemProviderError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
        Object.setPrototypeOf(this, FileSystemProviderError.prototype);
    }
}
exports.FileSystemProviderError = FileSystemProviderError;
function createFileSystemProviderError(error, code) {
    const providerError = new FileSystemProviderError(error.toString(), code);
    markAsFileSystemProviderError(providerError, code);
    return providerError;
}
exports.createFileSystemProviderError = createFileSystemProviderError;
function ensureFileSystemProviderError(error) {
    if (!error) {
        return createFileSystemProviderError('Unknown Error', FileSystemProviderErrorCode.Unknown); // https://github.com/Microsoft/vscode/issues/72798
    }
    return error;
}
exports.ensureFileSystemProviderError = ensureFileSystemProviderError;
exports.FileSystemProvider = Symbol('FileSystemProvider');
function hasAccessCapability(provider) {
    return !!(provider.capabilities & 16777216 /* Access */);
}
exports.hasAccessCapability = hasAccessCapability;
function hasUpdateCapability(provider) {
    return !!(provider.capabilities & 33554432 /* Update */);
}
exports.hasUpdateCapability = hasUpdateCapability;
function hasReadWriteCapability(provider) {
    return !!(provider.capabilities & 2 /* FileReadWrite */);
}
exports.hasReadWriteCapability = hasReadWriteCapability;
function hasFileFolderCopyCapability(provider) {
    return !!(provider.capabilities & 8 /* FileFolderCopy */);
}
exports.hasFileFolderCopyCapability = hasFileFolderCopyCapability;
function hasOpenReadWriteCloseCapability(provider) {
    return !!(provider.capabilities & 4 /* FileOpenReadWriteClose */);
}
exports.hasOpenReadWriteCloseCapability = hasOpenReadWriteCloseCapability;
function hasFileReadStreamCapability(provider) {
    return !!(provider.capabilities & 16 /* FileReadStream */);
}
exports.hasFileReadStreamCapability = hasFileReadStreamCapability;
function markAsFileSystemProviderError(error, code) {
    error.name = code ? `${code} (FileSystemError)` : 'FileSystemError';
    return error;
}
exports.markAsFileSystemProviderError = markAsFileSystemProviderError;
function toFileSystemProviderErrorCode(error) {
    // Guard against abuse
    if (!error) {
        return FileSystemProviderErrorCode.Unknown;
    }
    // FileSystemProviderError comes with the code
    if (error instanceof FileSystemProviderError) {
        return error.code;
    }
    // Any other error, check for name match by assuming that the error
    // went through the markAsFileSystemProviderError() method
    const match = /^(.+) \(FileSystemError\)$/.exec(error.name);
    if (!match) {
        return FileSystemProviderErrorCode.Unknown;
    }
    switch (match[1]) {
        case FileSystemProviderErrorCode.FileExists: return FileSystemProviderErrorCode.FileExists;
        case FileSystemProviderErrorCode.FileIsADirectory: return FileSystemProviderErrorCode.FileIsADirectory;
        case FileSystemProviderErrorCode.FileNotADirectory: return FileSystemProviderErrorCode.FileNotADirectory;
        case FileSystemProviderErrorCode.FileNotFound: return FileSystemProviderErrorCode.FileNotFound;
        case FileSystemProviderErrorCode.FileExceedsMemoryLimit: return FileSystemProviderErrorCode.FileExceedsMemoryLimit;
        case FileSystemProviderErrorCode.FileTooLarge: return FileSystemProviderErrorCode.FileTooLarge;
        case FileSystemProviderErrorCode.NoPermissions: return FileSystemProviderErrorCode.NoPermissions;
        case FileSystemProviderErrorCode.Unavailable: return FileSystemProviderErrorCode.Unavailable;
    }
    return FileSystemProviderErrorCode.Unknown;
}
exports.toFileSystemProviderErrorCode = toFileSystemProviderErrorCode;
function toFileOperationResult(error) {
    // FileSystemProviderError comes with the result already
    if (error instanceof FileOperationError) {
        return error.fileOperationResult;
    }
    // Otherwise try to find from code
    switch (toFileSystemProviderErrorCode(error)) {
        case FileSystemProviderErrorCode.FileNotFound:
            return 1 /* FILE_NOT_FOUND */;
        case FileSystemProviderErrorCode.FileIsADirectory:
            return 0 /* FILE_IS_DIRECTORY */;
        case FileSystemProviderErrorCode.FileNotADirectory:
            return 10 /* FILE_NOT_DIRECTORY */;
        case FileSystemProviderErrorCode.NoPermissions:
            return 6 /* FILE_PERMISSION_DENIED */;
        case FileSystemProviderErrorCode.FileExists:
            return 4 /* FILE_MOVE_CONFLICT */;
        case FileSystemProviderErrorCode.FileExceedsMemoryLimit:
            return 9 /* FILE_EXCEEDS_MEMORY_LIMIT */;
        case FileSystemProviderErrorCode.FileTooLarge:
            return 7 /* FILE_TOO_LARGE */;
        default:
            return 11 /* FILE_OTHER_ERROR */;
    }
}
exports.toFileOperationResult = toFileOperationResult;
/**
 * A hint to disable etag checking for reading/writing.
 */
exports.ETAG_DISABLED = '';
function etag(stat) {
    if (typeof stat.size !== 'number' || typeof stat.mtime !== 'number') {
        return undefined;
    }
    return stat.mtime.toString(29) + stat.size.toString(31);
}
exports.etag = etag;
/**
 * Helper to format a raw byte size into a human readable label.
 */
class BinarySize {
    static formatSize(size) {
        if (size < BinarySize.KB) {
            return size + 'B';
        }
        if (size < BinarySize.MB) {
            return (size / BinarySize.KB).toFixed(2) + 'KB';
        }
        if (size < BinarySize.GB) {
            return (size / BinarySize.MB).toFixed(2) + 'MB';
        }
        if (size < BinarySize.TB) {
            return (size / BinarySize.GB).toFixed(2) + 'GB';
        }
        return (size / BinarySize.TB).toFixed(2) + 'TB';
    }
}
exports.BinarySize = BinarySize;
BinarySize.KB = 1024;
BinarySize.MB = BinarySize.KB * BinarySize.KB;
BinarySize.GB = BinarySize.MB * BinarySize.KB;
BinarySize.TB = BinarySize.GB * BinarySize.KB;
//# sourceMappingURL=files.js.map