import { Disposable } from '../disposable';
import { Emitter, Event } from '../event';
import { Channel } from '../message-rpc/channel';
import { RequestHandler, RpcProtocol } from '../message-rpc/rpc-protocol';
import { ConnectionHandler } from './handler';
import { Deferred } from '../promise-util';
export declare type RpcServer<Client> = Disposable & {
    /**
     * If this server is a proxy to a remote server then
     * a client is used as a local object
     * to handle RPC messages from the remote server.
     */
    setClient(client: Client | undefined): void;
    getClient?(): Client | undefined;
};
export interface RpcConnectionEventEmitter {
    readonly onDidOpenConnection: Event<void>;
    readonly onDidCloseConnection: Event<void>;
}
export declare type RpcProxy<T> = T & RpcConnectionEventEmitter;
export declare class RpcConnectionHandler<T extends object> implements ConnectionHandler {
    readonly path: string;
    readonly targetFactory: (proxy: RpcProxy<T>) => any;
    readonly factoryConstructor: new () => RpcProxyFactory<T>;
    constructor(path: string, targetFactory: (proxy: RpcProxy<T>) => any, factoryConstructor?: new () => RpcProxyFactory<T>);
    onConnection(connection: Channel): void;
}
/**
 * Factory for creating a new {@link RpcProtocol} for a given chanel and {@link RequestHandler}.
 */
export declare type RpcProtocolFactory = (channel: Channel, requestHandler: RequestHandler) => RpcProtocol;
/**
 * Factory for RPC proxy objects.
 *
 * A RPC proxy exposes the programmatic interface of an object through
 * Theia's RPC protocol. This allows remote programs to call methods of this objects by
 * sending RPC requests. This takes place over a bi-directional stream,
 * where both ends can expose an object and both can call methods on each other'
 * exposed object.
 *
 * For example, assuming we have an object of the following type on one end:
 *
 *     class Foo {
 *         bar(baz: number): number { return baz + 1 }
 *     }
 *
 * which we want to expose through a RPC interface.  We would do:
 *
 *     let target = new Foo()
 *     let factory = new RpcProxyFactory<Foo>('/foo', target)
 *     factory.onConnection(connection)
 *
 * The party at the other end of the `connection`, in order to remotely call
 * methods on this object would do:
 *
 *     let factory = new RpcProxyFactory<Foo>('/foo')
 *     factory.onConnection(connection)
 *     let proxy = factory.createProxy();
 *     let result = proxy.bar(42)
 *     // result is equal to 43
 *
 * One the wire, it would look like this:
 *
 *     --> { "type":"1", "id": 1, "method": "bar", "args": [42]}
 *     <-- { "type":"3", "id": 1, "res": 43}
 *
 * Note that in the code of the caller, we didn't pass a target object to
 * RpcProxyFactory, because we don't want/need to expose an object.
 * If we had passed a target object, the other side could've called methods on
 * it.
 *
 * @param <T> - The type of the object to expose to RPC.
 */
export declare class RpcProxyFactory<T extends object> implements ProxyHandler<T> {
    target?: any;
    protected rpcProtocolFactory: RpcProtocolFactory;
    protected readonly onDidOpenConnectionEmitter: Emitter<void>;
    protected readonly onDidCloseConnectionEmitter: Emitter<void>;
    protected rpcDeferred: Deferred<RpcProtocol>;
    /**
     * Build a new RpcProxyFactory.
     *
     * @param target - The object to expose to RPC methods calls.  If this
     *   is omitted, the proxy won't be able to handle requests, only send them.
     */
    constructor(target?: any, rpcProtocolFactory?: RpcProtocolFactory);
    protected waitForConnection(): void;
    /**
     * Connect a {@link Channel} to the factory by creating an {@link RpcProtocol} on top of it.
     *
     * This protocol will be used to send/receive RPC requests and
     * responses.
     */
    listen(channel: Channel): void;
    /**
     * Process an incoming RPC method call.
     *
     * onRequest is called when the RPC connection received a method call
     * request.  It calls the corresponding method on [[target]].
     *
     * The return value is a Promise object that is resolved with the return
     * value of the method call, if it is successful.  The promise is rejected
     * if the called method does not exist or if it throws.
     *
     * @returns A promise of the method call completion.
     */
    protected onRequest(method: string, ...args: any[]): Promise<any>;
    /**
     * Process an incoming RPC notification.
     *
     * Same as [[onRequest]], but called on incoming notifications rather than
     * methods calls.
     */
    protected onNotification(method: string, ...args: any[]): void;
    /**
     * Create a Proxy exposing the interface of an object of type T.  This Proxy
     * can be used to do RPC method calls on the remote target object as
     * if it was local.
     *
     * If `T` implements `RpcServer` then a client is used as a target object for a remote target object.
     */
    createProxy(): RpcProxy<T>;
    /**
     * Get a callable object that executes a RPC method call.
     *
     * Getting a property on the Proxy object returns a callable that, when
     * called, executes a RPC call.  The name of the property defines the
     * method to be called.  The callable takes a variable number of arguments,
     * which are passed in the RPC method call.
     *
     * For example, if you have a Proxy object:
     *
     *     let fooProxyFactory = RpcProxyFactory<Foo>('/foo')
     *     let fooProxy = fooProxyFactory.createProxy()
     *
     * accessing `fooProxy.bar` will return a callable that, when called,
     * executes a RPC method call to method `bar`.  Therefore, doing
     * `fooProxy.bar()` will call the `bar` method on the remote Foo object.
     *
     * @param target - unused.
     * @param p - The property accessed on the Proxy object.
     * @param receiver - unused.
     * @returns A callable that executes the RPC call.
     */
    get(target: T, p: PropertyKey, receiver: any): any;
    /**
     * Return whether the given property represents a notification.
     *
     * A property leads to a notification rather than a method call if its name
     * begins with `notify` or `on`.
     *
     * @param p - The property being called on the proxy.
     * @return Whether `p` represents a notification.
     */
    protected isNotification(p: PropertyKey): boolean;
    protected serializeError(e: any): any;
    protected deserializeError(capturedError: Error, e: any): any;
}
/**
 * @deprecated since 1.39.0 use `RpcConnectionEventEmitter` instead
 */
export declare type JsonRpcConnectionEventEmitter = RpcConnectionEventEmitter;
/**
 * @deprecated since 1.39.0 use `RpcServer` instead
 */
export declare type JsonRpcServer<Client> = RpcServer<Client>;
/**
 * @deprecated since 1.39.0 use `RpcProxy` instead
 */
export declare type JsonRpcProxy<T> = RpcProxy<T>;
/**
 * @deprecated since 1.39.0 use `RpcConnectionHandler` instead
 */
export declare class JsonRpcConnectionHandler<T extends object> extends RpcConnectionHandler<T> {
}
/**
 * @deprecated since 1.39.0 use `RpcProxyFactory` instead
 */
export declare class JsonRpcProxyFactory<T extends object> extends RpcProxyFactory<T> {
}
//# sourceMappingURL=proxy-factory.d.ts.map