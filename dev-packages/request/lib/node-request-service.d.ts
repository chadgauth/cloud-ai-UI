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
/// <reference types="node" />
import * as http from 'http';
import { ProxyAgent } from './proxy';
import { RequestConfiguration, RequestContext, RequestOptions, RequestService, CancellationToken } from './common-request-service';
export interface RawRequestFunction {
    (options: http.RequestOptions, callback?: (res: http.IncomingMessage) => void): http.ClientRequest;
}
export interface NodeRequestOptions extends RequestOptions {
    agent?: ProxyAgent;
    strictSSL?: boolean;
    getRawRequest?(options: NodeRequestOptions): RawRequestFunction;
}
export declare class NodeRequestService implements RequestService {
    protected proxyUrl?: string;
    protected strictSSL?: boolean;
    protected authorization?: string;
    protected getNodeRequest(options: RequestOptions): RawRequestFunction;
    protected getProxyUrl(url: string): Promise<string | undefined>;
    configure(config: RequestConfiguration): Promise<void>;
    protected processOptions(options: NodeRequestOptions): Promise<NodeRequestOptions>;
    request(options: NodeRequestOptions, token?: CancellationToken): Promise<RequestContext>;
    resolveProxy(url: string): Promise<string | undefined>;
}
//# sourceMappingURL=node-request-service.d.ts.map