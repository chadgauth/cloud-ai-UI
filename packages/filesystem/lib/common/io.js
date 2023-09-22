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
// based on https://github.com/microsoft/vscode/blob/04c36be045a94fee58e5f8992d3e3fd980294a84/src/vs/platform/files/common/io.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.readFileIntoStream = void 0;
const buffer_1 = require("@theia/core/lib/common//buffer");
const cancellation_1 = require("@theia/core/lib/common/cancellation");
const files_1 = require("./files");
/**
 * A helper to read a file from a provider with open/read/close capability into a stream.
 */
async function readFileIntoStream(provider, resource, target, transformer, options, token) {
    let error = undefined;
    try {
        await doReadFileIntoStream(provider, resource, target, transformer, options, token);
    }
    catch (err) {
        error = err;
    }
    finally {
        if (error && options.errorTransformer) {
            error = options.errorTransformer(error);
        }
        target.end(error);
    }
}
exports.readFileIntoStream = readFileIntoStream;
async function doReadFileIntoStream(provider, resource, target, transformer, options, token) {
    // Check for cancellation
    throwIfCancelled(token);
    // open handle through provider
    const handle = await provider.open(resource, { create: false });
    // Check for cancellation
    throwIfCancelled(token);
    try {
        let totalBytesRead = 0;
        let bytesRead = 0;
        let allowedRemainingBytes = (options && typeof options.length === 'number') ? options.length : undefined;
        let buffer = buffer_1.BinaryBuffer.alloc(Math.min(options.bufferSize, typeof allowedRemainingBytes === 'number' ? allowedRemainingBytes : options.bufferSize));
        let posInFile = options && typeof options.position === 'number' ? options.position : 0;
        let posInBuffer = 0;
        do {
            // read from source (handle) at current position (pos) into buffer (buffer) at
            // buffer position (posInBuffer) up to the size of the buffer (buffer.byteLength).
            bytesRead = await provider.read(handle, posInFile, buffer.buffer, posInBuffer, buffer.byteLength - posInBuffer);
            posInFile += bytesRead;
            posInBuffer += bytesRead;
            totalBytesRead += bytesRead;
            if (typeof allowedRemainingBytes === 'number') {
                allowedRemainingBytes -= bytesRead;
            }
            // when buffer full, create a new one and emit it through stream
            if (posInBuffer === buffer.byteLength) {
                await target.write(transformer(buffer));
                buffer = buffer_1.BinaryBuffer.alloc(Math.min(options.bufferSize, typeof allowedRemainingBytes === 'number' ? allowedRemainingBytes : options.bufferSize));
                posInBuffer = 0;
            }
        } while (bytesRead > 0 && (typeof allowedRemainingBytes !== 'number' || allowedRemainingBytes > 0) && throwIfCancelled(token) && throwIfTooLarge(totalBytesRead, options));
        // wrap up with last buffer (also respect maxBytes if provided)
        if (posInBuffer > 0) {
            let lastChunkLength = posInBuffer;
            if (typeof allowedRemainingBytes === 'number') {
                lastChunkLength = Math.min(posInBuffer, allowedRemainingBytes);
            }
            target.write(transformer(buffer.slice(0, lastChunkLength)));
        }
    }
    catch (error) {
        throw (0, files_1.ensureFileSystemProviderError)(error);
    }
    finally {
        await provider.close(handle);
    }
}
function throwIfCancelled(token) {
    if (token.isCancellationRequested) {
        throw (0, cancellation_1.cancelled)();
    }
    return true;
}
function throwIfTooLarge(totalBytesRead, options) {
    // Return early if file is too large to load and we have configured limits
    if (options === null || options === void 0 ? void 0 : options.limits) {
        if (typeof options.limits.memory === 'number' && totalBytesRead > options.limits.memory) {
            throw (0, files_1.createFileSystemProviderError)('To open a file of this size, you need to restart and allow it to use more memory', files_1.FileSystemProviderErrorCode.FileExceedsMemoryLimit);
        }
        if (typeof options.limits.size === 'number' && totalBytesRead > options.limits.size) {
            throw (0, files_1.createFileSystemProviderError)('File is too large to open', files_1.FileSystemProviderErrorCode.FileTooLarge);
        }
    }
    return true;
}
//# sourceMappingURL=io.js.map