import { interfaces } from '@theia/core/shared/inversify';
import { AuthenticationExt, AuthenticationMain } from '../../common/plugin-api-rpc';
import { RPCProtocol } from '../../common/rpc-protocol';
import { MessageService } from '@theia/core/lib/common/message-service';
import { StorageService } from '@theia/core/lib/browser';
import { AuthenticationProvider } from '@theia/core/lib/browser/authentication-service';
import * as theia from '@theia/plugin';
export declare function getAuthenticationProviderActivationEvent(id: string): string;
export declare class AuthenticationMainImpl implements AuthenticationMain {
    private readonly proxy;
    private readonly messageService;
    private readonly storageService;
    private readonly authenticationService;
    private readonly quickPickService;
    constructor(rpc: RPCProtocol, container: interfaces.Container);
    $registerAuthenticationProvider(id: string, label: string, supportsMultipleAccounts: boolean): Promise<void>;
    $unregisterAuthenticationProvider(id: string): Promise<void>;
    $updateSessions(id: string, event: theia.AuthenticationProviderAuthenticationSessionsChangeEvent): Promise<void>;
    $logout(providerId: string, sessionId: string): Promise<void>;
    protected requestNewSession(providerId: string, scopes: string[], extensionId: string, extensionName: string): Promise<void>;
    $getSession(providerId: string, scopes: string[], extensionId: string, extensionName: string, options: theia.AuthenticationGetSessionOptions): Promise<theia.AuthenticationSession | undefined>;
    protected selectSession(providerId: string, providerName: string, extensionId: string, extensionName: string, potentialSessions: Readonly<theia.AuthenticationSession[]>, scopes: string[], clearSessionPreference: boolean): Promise<theia.AuthenticationSession>;
    protected getSessionsPrompt(providerId: string, accountName: string, providerName: string, extensionId: string, extensionName: string): Promise<boolean>;
    protected loginPrompt(providerName: string, extensionName: string, recreatingSession: boolean, detail?: string): Promise<boolean>;
    protected isAccessAllowed(providerId: string, accountName: string, extensionId: string): Promise<boolean>;
    protected setTrustedExtensionAndAccountPreference(providerId: string, accountName: string, extensionId: string, extensionName: string, sessionId: string): Promise<void>;
    $onDidChangeSessions(providerId: string, event: theia.AuthenticationProviderAuthenticationSessionsChangeEvent): void;
}
export declare class AuthenticationProviderImpl implements AuthenticationProvider {
    private readonly proxy;
    readonly id: string;
    readonly label: string;
    readonly supportsMultipleAccounts: boolean;
    private readonly storageService;
    private readonly messageService;
    /** map from account name to session ids */
    private accounts;
    /** map from session id to account name */
    private sessions;
    readonly onDidChangeSessions: theia.Event<theia.AuthenticationProviderAuthenticationSessionsChangeEvent>;
    constructor(proxy: AuthenticationExt, id: string, label: string, supportsMultipleAccounts: boolean, storageService: StorageService, messageService: MessageService);
    hasSessions(): boolean;
    private registerSession;
    signOut(accountName: string): Promise<void>;
    getSessions(scopes?: string[]): Promise<ReadonlyArray<theia.AuthenticationSession>>;
    updateSessionItems(event: theia.AuthenticationProviderAuthenticationSessionsChangeEvent): Promise<void>;
    login(scopes: string[]): Promise<theia.AuthenticationSession>;
    logout(sessionId: string): Promise<void>;
    createSession(scopes: string[]): Thenable<theia.AuthenticationSession>;
    removeSession(sessionId: string): Thenable<void>;
}
//# sourceMappingURL=authentication-main.d.ts.map