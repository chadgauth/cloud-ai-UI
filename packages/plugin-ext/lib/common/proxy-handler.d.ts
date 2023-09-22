/********************************************************************************
 * Copyright (C) 2022 STMicroelectronics and others.
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
import { Channel } from '@theia/core/';
import { RpcMessageDecoder, RpcMessageEncoder } from '@theia/core/lib/common/message-rpc/rpc-message-encoder';
export interface RpcHandlerOptions {
    id: string;
    encoder: RpcMessageEncoder;
    decoder: RpcMessageDecoder;
}
export interface ProxyHandlerOptions extends RpcHandlerOptions {
    channelProvider: () => Promise<Channel>;
}
export interface InvocationHandlerOptions extends RpcHandlerOptions {
    target: any;
}
/**
 * A proxy handler that will send any method invocation on the proxied object
 * as a rcp protocol message over a channel.
 */
export declare class ClientProxyHandler<T extends object> implements ProxyHandler<T> {
    private rpcDeferred;
    private isRpcInitialized;
    readonly id: string;
    private readonly channelProvider;
    private readonly encoder;
    private readonly decoder;
    constructor(options: ProxyHandlerOptions);
    private initializeRpc;
    get(target: any, name: string, receiver: any): any;
    /**
     * Return whether the given property represents a notification. If true,
     * the promise returned from the invocation will resolve immediately to `undefined`
     *
     * A property leads to a notification rather than a method call if its name
     * begins with `notify` or `on`.
     *
     * @param p - The property being called on the proxy.
     * @return Whether `p` represents a notification.
     */
    protected isNotification(p: PropertyKey): boolean;
}
export declare class RpcInvocationHandler {
    readonly id: string;
    readonly target: any;
    private rpcDeferred;
    private readonly encoder;
    private readonly decoder;
    constructor(options: InvocationHandlerOptions);
    listen(channel: Channel): void;
    protected handleRequest(method: string, args: any[]): Promise<any>;
    protected onNotification(method: string, args: any[]): void;
}
//# sourceMappingURL=proxy-handler.d.ts.map