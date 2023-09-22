"use strict";
// *****************************************************************************
// Copyright (C) 2017 Ericsson and others.
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiRingBuffer = exports.MultiRingBufferOptions = exports.MultiRingBufferReadableStream = void 0;
const stream = require("stream");
const inversify_1 = require("@theia/core/shared/inversify");
/**
 * The MultiRingBuffer is a ring buffer implementation that allows
 * multiple independent readers.
 *
 * These readers are created using the getReader or getStream functions
 * to create a reader that can be read using deq() or one that is a readable stream.
 */
class MultiRingBufferReadableStream extends stream.Readable {
    constructor(ringBuffer, reader, encoding = 'utf8') {
        super();
        this.ringBuffer = ringBuffer;
        this.reader = reader;
        this.encoding = encoding;
        this.more = false;
        this.disposed = false;
        this.setEncoding(encoding);
    }
    _read(size) {
        this.more = true;
        this.deq(size);
    }
    _destroy(err, callback) {
        this.ringBuffer.closeStream(this);
        this.ringBuffer.closeReader(this.reader);
        this.disposed = true;
        this.removeAllListeners();
        callback(err);
    }
    onData() {
        if (this.more === true) {
            this.deq(-1);
        }
    }
    deq(size) {
        if (this.disposed === true) {
            return;
        }
        let buffer = undefined;
        do {
            buffer = this.ringBuffer.deq(this.reader, size, this.encoding);
            if (buffer !== undefined) {
                this.more = this.push(buffer, this.encoding);
            }
        } while (buffer !== undefined && this.more === true && this.disposed === false);
    }
    dispose() {
        this.destroy();
    }
}
exports.MultiRingBufferReadableStream = MultiRingBufferReadableStream;
exports.MultiRingBufferOptions = Symbol('MultiRingBufferOptions');
let MultiRingBuffer = class MultiRingBuffer {
    constructor(options) {
        this.options = options;
        this.head = -1;
        this.tail = -1;
        this.readerId = 0;
        this.maxSize = options.size;
        if (options.encoding !== undefined) {
            this.encoding = options.encoding;
        }
        else {
            this.encoding = 'utf8';
        }
        this.buffer = Buffer.alloc(this.maxSize);
        this.readers = new Map();
        this.streams = new Map();
    }
    enq(str, encoding = 'utf8') {
        let buffer = Buffer.from(str, encoding);
        // Take the last elements of string if it's too big, drop the rest
        if (buffer.length > this.maxSize) {
            buffer = buffer.slice(buffer.length - this.maxSize);
        }
        if (buffer.length === 0) {
            return;
        }
        // empty
        if (this.head === -1 && this.tail === -1) {
            this.head = 0;
            this.tail = 0;
            buffer.copy(this.buffer, this.head, 0, buffer.length);
            this.head = buffer.length - 1;
            this.onData(0);
            return;
        }
        const startHead = this.inc(this.head, 1).newPos;
        if (this.inc(startHead, buffer.length).wrap === true) {
            buffer.copy(this.buffer, startHead, 0, this.maxSize - startHead);
            buffer.copy(this.buffer, 0, this.maxSize - startHead);
        }
        else {
            buffer.copy(this.buffer, startHead);
        }
        this.incTails(buffer.length);
        this.head = this.inc(this.head, buffer.length).newPos;
        this.onData(startHead);
    }
    getReader() {
        this.readers.set(this.readerId, this.tail);
        return this.readerId++;
    }
    closeReader(id) {
        this.readers.delete(id);
    }
    getStream(encoding) {
        const reader = this.getReader();
        const readableStream = new MultiRingBufferReadableStream(this, reader, encoding);
        this.streams.set(readableStream, reader);
        return readableStream;
    }
    closeStream(readableStream) {
        this.streams.delete(readableStream);
    }
    onData(start) {
        /*  Any stream that has read everything already
         *  Should go back to the last buffer in start offset */
        for (const [id, pos] of this.readers) {
            if (pos === -1) {
                this.readers.set(id, start);
            }
        }
        /* Notify the streams there's new data. */
        for (const [readableStream] of this.streams) {
            readableStream.onData();
        }
    }
    deq(id, size = -1, encoding = 'utf8') {
        const pos = this.readers.get(id);
        if (pos === undefined || pos === -1) {
            return undefined;
        }
        if (size === 0) {
            return undefined;
        }
        let buffer = '';
        const maxDeqSize = this.sizeForReader(id);
        const wrapped = this.isWrapped(pos, this.head);
        let deqSize;
        if (size === -1) {
            deqSize = maxDeqSize;
        }
        else {
            deqSize = Math.min(size, maxDeqSize);
        }
        if (wrapped === false) { // no wrap
            buffer = this.buffer.toString(encoding, pos, pos + deqSize);
        }
        else { // wrap
            buffer = buffer.concat(this.buffer.toString(encoding, pos, this.maxSize), this.buffer.toString(encoding, 0, deqSize - (this.maxSize - pos)));
        }
        const lastIndex = this.inc(pos, deqSize - 1).newPos;
        // everything is read
        if (lastIndex === this.head) {
            this.readers.set(id, -1);
        }
        else {
            this.readers.set(id, this.inc(pos, deqSize).newPos);
        }
        return buffer;
    }
    sizeForReader(id) {
        const pos = this.readers.get(id);
        if (pos === undefined) {
            return 0;
        }
        return this.sizeFrom(pos, this.head, this.isWrapped(pos, this.head));
    }
    size() {
        return this.sizeFrom(this.tail, this.head, this.isWrapped(this.tail, this.head));
    }
    isWrapped(from, to) {
        if (to < from) {
            return true;
        }
        else {
            return false;
        }
    }
    sizeFrom(from, to, wrap) {
        if (from === -1 || to === -1) {
            return 0;
        }
        else {
            if (wrap === false) {
                return to - from + 1;
            }
            else {
                return to + 1 + this.maxSize - from;
            }
        }
    }
    emptyForReader(id) {
        const pos = this.readers.get(id);
        if (pos === undefined || pos === -1) {
            return true;
        }
        else {
            return false;
        }
    }
    empty() {
        if (this.head === -1 && this.tail === -1) {
            return true;
        }
        else {
            return false;
        }
    }
    streamsSize() {
        return this.streams.size;
    }
    readersSize() {
        return this.readers.size;
    }
    /**
     * Dispose all the attached readers/streams.
     */
    dispose() {
        for (const readableStream of this.streams.keys()) {
            readableStream.dispose();
        }
    }
    /* Position should be incremented if it goes pass end.  */
    shouldIncPos(pos, end, size) {
        const { newPos: newHead, wrap } = this.inc(end, size);
        /* Tail Head */
        if (this.isWrapped(pos, end) === false) {
            // Head needs to wrap to push the tail
            if (wrap === true && newHead >= pos) {
                return true;
            }
        }
        else { /* Head Tail */
            //  If we wrap head is pushing tail, or if it goes over pos
            if (wrap === true || newHead >= pos) {
                return true;
            }
        }
        return false;
    }
    incTailSize(pos, head, size) {
        const { newPos: newHead } = this.inc(head, size);
        /* New tail is 1 past newHead.  */
        return this.inc(newHead, 1);
    }
    incTail(pos, size) {
        if (this.shouldIncPos(pos, this.head, size) === false) {
            return { newPos: pos, wrap: false };
        }
        return this.incTailSize(pos, this.head, size);
    }
    /* Increment the main tail and all the reader positions. */
    incTails(size) {
        this.tail = this.incTail(this.tail, size).newPos;
        for (const [id, pos] of this.readers) {
            if (pos !== -1) {
                if (this.shouldIncPos(pos, this.tail, size) === true) {
                    this.readers.set(id, this.tail);
                }
            }
        }
    }
    inc(pos, size) {
        if (size === 0) {
            return { newPos: pos, wrap: false };
        }
        const newPos = (pos + size) % this.maxSize;
        const wrap = newPos <= pos;
        return { newPos, wrap };
    }
};
MultiRingBuffer = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(exports.MultiRingBufferOptions)),
    __metadata("design:paramtypes", [Object])
], MultiRingBuffer);
exports.MultiRingBuffer = MultiRingBuffer;
//# sourceMappingURL=multi-ring-buffer.js.map