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
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeSemanticTokensDto = exports.encodeSemanticTokensDto = void 0;
// copied and modified from https://github.com/microsoft/vscode/blob/0eb3a02ca2bcfab5faa3dc6e52d7c079efafcab0/src/vs/workbench/api/common/shared/semanticTokensDto.ts
const buffer_1 = require("@theia/core/lib/common/buffer");
let _isLittleEndian = true;
let _isLittleEndianComputed = false;
function isLittleEndian() {
    if (!_isLittleEndianComputed) {
        _isLittleEndianComputed = true;
        const test = new Uint8Array(2);
        test[0] = 1;
        test[1] = 2;
        const view = new Uint16Array(test.buffer);
        _isLittleEndian = (view[0] === (2 << 8) + 1);
    }
    return _isLittleEndian;
}
function reverseEndianness(arr) {
    for (let i = 0, len = arr.length; i < len; i += 4) {
        // flip bytes 0<->3 and 1<->2
        const b0 = arr[i + 0];
        const b1 = arr[i + 1];
        const b2 = arr[i + 2];
        const b3 = arr[i + 3];
        arr[i + 0] = b3;
        arr[i + 1] = b2;
        arr[i + 2] = b1;
        arr[i + 3] = b0;
    }
}
function toLittleEndianBuffer(arr) {
    const uint8Arr = new Uint8Array(arr.buffer, arr.byteOffset, arr.length * 4);
    if (!isLittleEndian()) {
        // the byte order must be changed
        reverseEndianness(uint8Arr);
    }
    return buffer_1.BinaryBuffer.wrap(uint8Arr);
}
function fromLittleEndianBuffer(buff) {
    const uint8Arr = buff.buffer;
    if (!isLittleEndian()) {
        // the byte order must be changed
        reverseEndianness(uint8Arr);
    }
    if (uint8Arr.byteOffset % 4 === 0) {
        return new Uint32Array(uint8Arr.buffer, uint8Arr.byteOffset, uint8Arr.length / 4);
    }
    else {
        // unaligned memory access doesn't work on all platforms
        const data = new Uint8Array(uint8Arr.byteLength);
        data.set(uint8Arr);
        return new Uint32Array(data.buffer, data.byteOffset, data.length / 4);
    }
}
function encodeSemanticTokensDto(semanticTokens) {
    const dest = new Uint32Array(encodeSemanticTokensDtoSize(semanticTokens));
    let offset = 0;
    dest[offset++] = semanticTokens.id;
    if (semanticTokens.type === 'full') {
        dest[offset++] = 1 /* Full */;
        dest[offset++] = semanticTokens.data.length;
        dest.set(semanticTokens.data, offset);
        offset += semanticTokens.data.length;
    }
    else {
        dest[offset++] = 2 /* Delta */;
        dest[offset++] = semanticTokens.deltas.length;
        for (const delta of semanticTokens.deltas) {
            dest[offset++] = delta.start;
            dest[offset++] = delta.deleteCount;
            if (delta.data) {
                dest[offset++] = delta.data.length;
                dest.set(delta.data, offset);
                offset += delta.data.length;
            }
            else {
                dest[offset++] = 0;
            }
        }
    }
    return toLittleEndianBuffer(dest);
}
exports.encodeSemanticTokensDto = encodeSemanticTokensDto;
function encodeSemanticTokensDtoSize(semanticTokens) {
    let result = 0;
    result += (+1 // id
        + 1 // type
    );
    if (semanticTokens.type === 'full') {
        result += (+1 // data length
            + semanticTokens.data.length);
    }
    else {
        result += (+1 // delta count
        );
        result += (+1 // start
            + 1 // deleteCount
            + 1 // data length
        ) * semanticTokens.deltas.length;
        for (const delta of semanticTokens.deltas) {
            if (delta.data) {
                result += delta.data.length;
            }
        }
    }
    return result;
}
function decodeSemanticTokensDto(_buff) {
    const src = fromLittleEndianBuffer(_buff);
    let offset = 0;
    const id = src[offset++];
    const type = src[offset++];
    if (type === 1 /* Full */) {
        const length = src[offset++];
        const data = src.subarray(offset, offset + length);
        offset += length;
        return {
            id: id,
            type: 'full',
            data: data
        };
    }
    const deltaCount = src[offset++];
    const deltas = [];
    for (let i = 0; i < deltaCount; i++) {
        const start = src[offset++];
        const deleteCount = src[offset++];
        const length = src[offset++];
        let data;
        if (length > 0) {
            data = src.subarray(offset, offset + length);
            offset += length;
        }
        deltas[i] = { start, deleteCount, data };
    }
    return {
        id: id,
        type: 'delta',
        deltas: deltas
    };
}
exports.decodeSemanticTokensDto = decodeSemanticTokensDto;
//# sourceMappingURL=semantic-tokens-dto.js.map