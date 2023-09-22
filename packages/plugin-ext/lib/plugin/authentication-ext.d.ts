import { AuthenticationExt, Plugin as InternalPlugin } from '../common/plugin-api-rpc';
import { RPCProtocol } from '../common/rpc-protocol';
import { Event } from '@theia/core/lib/common/event';
import * as theia from '@theia/plugin';
export declare class AuthenticationExtImpl implements AuthenticationExt {
    private proxy;
    private authenticationProviders;
    private onDidChangeSessionsEmitter;
    readonly onDidChangeSessions: Event<theia.AuthenticationSessionsChangeEvent>;
    constructor(rpc: RPCProtocol);
    getSession(requestingExtension: InternalPlugin, providerId: string, scopes: readonly string[], options: theia.AuthenticationGetSessionOptions & ({
        createIfNone: true;
    } | {
        forceNewSession: true;
    } | {
        forceNewSession: theia.AuthenticationForceNewSessionOptions;
    })): Promise<theia.AuthenticationSession>;
    getSession(requestingExtension: InternalPlugin, providerId: string, scopes: readonly string[], options: theia.AuthenticationGetSessionOptions & {
        forceNewSession: true;
    }): Promise<theia.AuthenticationSession>;
    getSession(requestingExtension: InternalPlugin, providerId: string, scopes: readonly string[], options: theia.AuthenticationGetSessionOptions & {
        forceNewSession: theia.AuthenticationForceNewSessionOptions;
    }): Promise<theia.AuthenticationSession>;
    getSession(requestingExtension: InternalPlugin, providerId: string, scopes: readonly string[], options: theia.AuthenticationGetSessionOptions): Promise<theia.AuthenticationSession | undefined>;
    registerAuthenticationProvider(id: string, label: string, provider: theia.AuthenticationProvider, options?: theia.AuthenticationProviderOptions): theia.Disposable;
    $createSession(providerId: string, scopes: string[]): Promise<theia.AuthenticationSession>;
    $removeSession(providerId: string, sessionId: string): Promise<void>;
    $getSessions(providerId: string, scopes?: string[]): Promise<ReadonlyArray<theia.AuthenticationSession>>;
    $onDidChangeAuthenticationSessions(provider: theia.AuthenticationProviderInformation): Promise<void>;
}
//# sourceMappingURL=authentication-ext.d.ts.map