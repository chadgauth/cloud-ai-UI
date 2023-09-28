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
export interface Headers {
    [header: string]: string;
}
export interface RequestOptions {
    type?: string;
    url: string;
    user?: string;
    password?: string;
    headers?: Headers;
    timeout?: number;
    data?: string;
    followRedirects?: number;
    proxyAuthorization?: string;
}
export interface RequestContext {
    url: string;
    res: {
        headers: Headers;
        statusCode?: number;
    };
    /**
     * Contains the data returned by the request.
     *
     * If the request was transferred from the backend to the frontend, the buffer has been compressed into a string. In every case the buffer is an {@link Uint8Array}.
     */
    buffer: Uint8Array | string;
}
export declare namespace RequestContext {
    function isSuccess(context: RequestContext): boolean;
    function asText(context: RequestContext): string;
    function asJson<T = {}>(context: RequestContext): T;
    /**
     * Convert the buffer to base64 before sending it to the frontend.
     * This reduces the amount of JSON data transferred massively.
     * Does nothing if the buffer is already compressed.
     */
    function compress(context: RequestContext): RequestContext;
    /**
     * Decompresses a base64 buffer into a normal array buffer
     * Does nothing if the buffer is not compressed.
     */
    function decompress(context: RequestContext): RequestContext;
}
export interface RequestConfiguration {
    proxyUrl?: string;
    proxyAuthorization?: string;
    strictSSL?: boolean;
}
export interface RequestService {
    configure(config: RequestConfiguration): Promise<void>;
    request(options: RequestOptions, token?: CancellationToken): Promise<RequestContext>;
    resolveProxy(url: string): Promise<string | undefined>;
}
export declare const RequestService: unique symbol;
export declare const BackendRequestService: unique symbol;
export declare const REQUEST_SERVICE_PATH = "/services/request-service";
export interface CancellationToken {
    readonly isCancellationRequested: boolean;
    readonly onCancellationRequested: (listener: () => void) => void;
}
//# sourceMappingURL=common-request-service.d.ts.map