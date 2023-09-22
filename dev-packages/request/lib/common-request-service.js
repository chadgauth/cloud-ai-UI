"use strict";
/********************************************************************************
 * Copyright (C) 2022 TypeFox and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0
 ********************************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.REQUEST_SERVICE_PATH = exports.BackendRequestService = exports.RequestService = exports.RequestContext = void 0;
const textDecoder = typeof TextDecoder !== 'undefined' ? new TextDecoder() : undefined;
var RequestContext;
(function (RequestContext) {
    function isSuccess(context) {
        return (context.res.statusCode && context.res.statusCode >= 200 && context.res.statusCode < 300) || context.res.statusCode === 1223;
    }
    RequestContext.isSuccess = isSuccess;
    function hasNoContent(context) {
        return context.res.statusCode === 204;
    }
    function asText(context) {
        if (!isSuccess(context)) {
            throw new Error(`Server returned code ${context.res.statusCode}.`);
        }
        if (hasNoContent(context)) {
            return '';
        }
        // Ensures that the buffer is an Uint8Array
        context = decompress(context);
        if (textDecoder) {
            return textDecoder.decode(context.buffer);
        }
        else {
            return context.buffer.toString();
        }
    }
    RequestContext.asText = asText;
    function asJson(context) {
        const str = asText(context);
        try {
            return JSON.parse(str);
        }
        catch (err) {
            err.message += ':\n' + str;
            throw err;
        }
    }
    RequestContext.asJson = asJson;
    /**
     * Convert the buffer to base64 before sending it to the frontend.
     * This reduces the amount of JSON data transferred massively.
     * Does nothing if the buffer is already compressed.
     */
    function compress(context) {
        if (context.buffer instanceof Uint8Array && Buffer !== undefined) {
            context.buffer = Buffer.from(context.buffer).toString('base64');
        }
        return context;
    }
    RequestContext.compress = compress;
    /**
     * Decompresses a base64 buffer into a normal array buffer
     * Does nothing if the buffer is not compressed.
     */
    function decompress(context) {
        const buffer = context.buffer;
        if (typeof buffer === 'string' && typeof atob === 'function') {
            context.buffer = Uint8Array.from(atob(buffer), c => c.charCodeAt(0));
        }
        return context;
    }
    RequestContext.decompress = decompress;
})(RequestContext = exports.RequestContext || (exports.RequestContext = {}));
exports.RequestService = Symbol('RequestService');
exports.BackendRequestService = Symbol('BackendRequestService');
exports.REQUEST_SERVICE_PATH = '/services/request-service';
//# sourceMappingURL=common-request-service.js.map