"use strict";
// *****************************************************************************
// Copyright (C) 2020 Red Hat, Inc. and others.
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationProviderImpl = exports.AuthenticationMainImpl = exports.getAuthenticationProviderActivationEvent = void 0;
const plugin_api_rpc_1 = require("../../common/plugin-api-rpc");
const message_service_1 = require("@theia/core/lib/common/message-service");
const browser_1 = require("@theia/core/lib/browser");
const authentication_service_1 = require("@theia/core/lib/browser/authentication-service");
const quick_pick_service_1 = require("@theia/core/lib/common/quick-pick-service");
const nls_1 = require("@theia/core/lib/common/nls");
const core_1 = require("@theia/core");
function getAuthenticationProviderActivationEvent(id) { return `onAuthenticationRequest:${id}`; }
exports.getAuthenticationProviderActivationEvent = getAuthenticationProviderActivationEvent;
class AuthenticationMainImpl {
    constructor(rpc, container) {
        this.proxy = rpc.getProxy(plugin_api_rpc_1.MAIN_RPC_CONTEXT.AUTHENTICATION_EXT);
        this.messageService = container.get(message_service_1.MessageService);
        this.storageService = container.get(browser_1.StorageService);
        this.authenticationService = container.get(authentication_service_1.AuthenticationService);
        this.quickPickService = container.get(quick_pick_service_1.QuickPickService);
        this.authenticationService.onDidChangeSessions(e => {
            this.proxy.$onDidChangeAuthenticationSessions({ id: e.providerId, label: e.label });
        });
    }
    async $registerAuthenticationProvider(id, label, supportsMultipleAccounts) {
        const provider = new AuthenticationProviderImpl(this.proxy, id, label, supportsMultipleAccounts, this.storageService, this.messageService);
        this.authenticationService.registerAuthenticationProvider(id, provider);
    }
    async $unregisterAuthenticationProvider(id) {
        this.authenticationService.unregisterAuthenticationProvider(id);
    }
    async $updateSessions(id, event) {
        this.authenticationService.updateSessions(id, event);
    }
    $logout(providerId, sessionId) {
        return this.authenticationService.logout(providerId, sessionId);
    }
    async requestNewSession(providerId, scopes, extensionId, extensionName) {
        return this.authenticationService.requestNewSession(providerId, scopes, extensionId, extensionName);
    }
    async $getSession(providerId, scopes, extensionId, extensionName, options) {
        const sessions = await this.authenticationService.getSessions(providerId, scopes);
        // Error cases
        if (options.forceNewSession && !sessions.length) {
            throw new Error('No existing sessions found.');
        }
        if (options.forceNewSession && options.createIfNone) {
            throw new Error('Invalid combination of options. Please remove one of the following: forceNewSession, createIfNone');
        }
        if (options.forceNewSession && options.silent) {
            throw new Error('Invalid combination of options. Please remove one of the following: forceNewSession, silent');
        }
        if (options.createIfNone && options.silent) {
            throw new Error('Invalid combination of options. Please remove one of the following: createIfNone, silent');
        }
        const supportsMultipleAccounts = this.authenticationService.supportsMultipleAccounts(providerId);
        // Check if the sessions we have are valid
        if (!options.forceNewSession && sessions.length) {
            if (supportsMultipleAccounts) {
                if (options.clearSessionPreference) {
                    await this.storageService.setData(`authentication-session-${extensionName}-${providerId}`, undefined);
                }
                else {
                    const existingSessionPreference = await this.storageService.getData(`authentication-session-${extensionName}-${providerId}`);
                    if (existingSessionPreference) {
                        const matchingSession = sessions.find(session => session.id === existingSessionPreference);
                        if (matchingSession && await this.isAccessAllowed(providerId, matchingSession.account.label, extensionId)) {
                            return matchingSession;
                        }
                    }
                }
            }
            else if (await this.isAccessAllowed(providerId, sessions[0].account.label, extensionId)) {
                return sessions[0];
            }
        }
        // We may need to prompt because we don't have a valid session modal flows
        if (options.createIfNone || options.forceNewSession) {
            const providerName = this.authenticationService.getLabel(providerId);
            const detail = isAuthenticationForceNewSessionOptions(options.forceNewSession) ? options.forceNewSession.detail : undefined;
            const isAllowed = await this.loginPrompt(providerName, extensionName, !!options.forceNewSession, detail);
            if (!isAllowed) {
                throw new Error('User did not consent to login.');
            }
            const session = (sessions === null || sessions === void 0 ? void 0 : sessions.length) && !options.forceNewSession && supportsMultipleAccounts
                ? await this.selectSession(providerId, providerName, extensionId, extensionName, sessions, scopes, !!options.clearSessionPreference)
                : await this.authenticationService.login(providerId, scopes);
            await this.setTrustedExtensionAndAccountPreference(providerId, session.account.label, extensionId, extensionName, session.id);
            return session;
        }
        // passive flows (silent or default)
        const validSession = sessions.find(s => this.isAccessAllowed(providerId, s.account.label, extensionId));
        if (!options.silent && !validSession) {
            this.authenticationService.requestNewSession(providerId, scopes, extensionId, extensionName);
        }
        return validSession;
    }
    async selectSession(providerId, providerName, extensionId, extensionName, potentialSessions, scopes, clearSessionPreference) {
        if (!potentialSessions.length) {
            throw new Error('No potential sessions found');
        }
        return new Promise(async (resolve, reject) => {
            var _a, _b;
            const items = potentialSessions.map(session => ({
                label: session.account.label,
                value: { session }
            }));
            items.push({
                label: nls_1.nls.localizeByDefault('Sign in to another account'),
                value: { session: undefined }
            });
            const selected = await this.quickPickService.show(items, {
                title: nls_1.nls.localizeByDefault("The extension '{0}' wants to access a {1} account", extensionName, providerName),
                ignoreFocusOut: true
            });
            if (selected) {
                const session = (_b = (_a = selected.value) === null || _a === void 0 ? void 0 : _a.session) !== null && _b !== void 0 ? _b : await this.authenticationService.login(providerId, scopes);
                const accountName = session.account.label;
                const allowList = await (0, authentication_service_1.readAllowedExtensions)(this.storageService, providerId, accountName);
                if (!allowList.find(allowed => allowed.id === extensionId)) {
                    allowList.push({ id: extensionId, name: extensionName });
                    this.storageService.setData(`authentication-trusted-extensions-${providerId}-${accountName}`, JSON.stringify(allowList));
                }
                this.storageService.setData(`authentication-session-${extensionName}-${providerId}`, session.id);
                resolve(session);
            }
            else {
                reject('User did not consent to account access');
            }
        });
    }
    async getSessionsPrompt(providerId, accountName, providerName, extensionId, extensionName) {
        const allowList = await (0, authentication_service_1.readAllowedExtensions)(this.storageService, providerId, accountName);
        const extensionData = allowList.find(extension => extension.id === extensionId);
        if (extensionData) {
            addAccountUsage(this.storageService, providerId, accountName, extensionId, extensionName);
            return true;
        }
        const choice = await this.messageService.info(`The extension '${extensionName}' wants to access the ${providerName} account '${accountName}'.`, 'Allow', 'Cancel');
        const allow = choice === 'Allow';
        if (allow) {
            await addAccountUsage(this.storageService, providerId, accountName, extensionId, extensionName);
            allowList.push({ id: extensionId, name: extensionName });
            this.storageService.setData(`authentication-trusted-extensions-${providerId}-${accountName}`, JSON.stringify(allowList));
        }
        return allow;
    }
    async loginPrompt(providerName, extensionName, recreatingSession, detail) {
        const msg = document.createElement('span');
        msg.textContent = recreatingSession
            ? nls_1.nls.localizeByDefault("The extension '{0}' wants you to sign in again using {1}.", extensionName, providerName)
            : nls_1.nls.localizeByDefault("The extension '{0}' wants to sign in using {1}.", extensionName, providerName);
        if (detail) {
            const detailElement = document.createElement('p');
            detailElement.textContent = detail;
            msg.appendChild(detailElement);
        }
        return !!await new browser_1.ConfirmDialog({
            title: nls_1.nls.localize('theia/plugin-ext/authentication-main/loginTitle', 'Login'),
            msg,
            ok: nls_1.nls.localizeByDefault('Allow'),
            cancel: browser_1.Dialog.CANCEL
        }).open();
    }
    async isAccessAllowed(providerId, accountName, extensionId) {
        const allowList = await (0, authentication_service_1.readAllowedExtensions)(this.storageService, providerId, accountName);
        return !!allowList.find(allowed => allowed.id === extensionId);
    }
    async setTrustedExtensionAndAccountPreference(providerId, accountName, extensionId, extensionName, sessionId) {
        const allowList = await (0, authentication_service_1.readAllowedExtensions)(this.storageService, providerId, accountName);
        if (!allowList.find(allowed => allowed.id === extensionId)) {
            allowList.push({ id: extensionId, name: extensionName });
            this.storageService.setData(`authentication-trusted-extensions-${providerId}-${accountName}`, JSON.stringify(allowList));
        }
        this.storageService.setData(`authentication-session-${extensionName}-${providerId}`, sessionId);
    }
    $onDidChangeSessions(providerId, event) {
        this.authenticationService.updateSessions(providerId, event);
    }
}
exports.AuthenticationMainImpl = AuthenticationMainImpl;
function isAuthenticationForceNewSessionOptions(arg) {
    return (0, core_1.isObject)(arg) && typeof arg.detail === 'string';
}
async function addAccountUsage(storageService, providerId, accountName, extensionId, extensionName) {
    const accountKey = `authentication-${providerId}-${accountName}-usages`;
    const usages = await readAccountUsages(storageService, providerId, accountName);
    const existingUsageIndex = usages.findIndex(usage => usage.extensionId === extensionId);
    if (existingUsageIndex > -1) {
        usages.splice(existingUsageIndex, 1, {
            extensionId,
            extensionName,
            lastUsed: Date.now()
        });
    }
    else {
        usages.push({
            extensionId,
            extensionName,
            lastUsed: Date.now()
        });
    }
    await storageService.setData(accountKey, JSON.stringify(usages));
}
class AuthenticationProviderImpl {
    constructor(proxy, id, label, supportsMultipleAccounts, storageService, messageService) {
        this.proxy = proxy;
        this.id = id;
        this.label = label;
        this.supportsMultipleAccounts = supportsMultipleAccounts;
        this.storageService = storageService;
        this.messageService = messageService;
        /** map from account name to session ids */
        this.accounts = new Map();
        /** map from session id to account name */
        this.sessions = new Map();
    }
    hasSessions() {
        return !!this.sessions.size;
    }
    registerSession(session) {
        this.sessions.set(session.id, session.account.label);
        const existingSessionsForAccount = this.accounts.get(session.account.label);
        if (existingSessionsForAccount) {
            this.accounts.set(session.account.label, existingSessionsForAccount.concat(session.id));
            return;
        }
        else {
            this.accounts.set(session.account.label, [session.id]);
        }
    }
    async signOut(accountName) {
        const accountUsages = await readAccountUsages(this.storageService, this.id, accountName);
        const sessionsForAccount = this.accounts.get(accountName);
        const result = await this.messageService.info(accountUsages.length
            ? nls_1.nls.localizeByDefault("The account '{0}' has been used by: \n\n{1}\n\n Sign out from these extensions?", accountName, accountUsages.map(usage => usage.extensionName).join(', '))
            : nls_1.nls.localizeByDefault("Sign out of '{0}'?", accountName), nls_1.nls.localizeByDefault('Sign Out'), browser_1.Dialog.CANCEL);
        if (result && result === nls_1.nls.localizeByDefault('Sign Out') && sessionsForAccount) {
            sessionsForAccount.forEach(sessionId => this.removeSession(sessionId));
            removeAccountUsage(this.storageService, this.id, accountName);
        }
    }
    async getSessions(scopes) {
        return this.proxy.$getSessions(this.id, scopes);
    }
    async updateSessionItems(event) {
        const { added, removed } = event;
        const session = await this.proxy.$getSessions(this.id);
        const addedSessions = added ? session.filter(s => added.some(addedSession => addedSession.id === s.id)) : [];
        removed === null || removed === void 0 ? void 0 : removed.forEach(removedSession => {
            const sessionId = removedSession.id;
            if (sessionId) {
                const accountName = this.sessions.get(sessionId);
                if (accountName) {
                    this.sessions.delete(sessionId);
                    const sessionsForAccount = this.accounts.get(accountName) || [];
                    const sessionIndex = sessionsForAccount.indexOf(sessionId);
                    sessionsForAccount.splice(sessionIndex);
                    if (!sessionsForAccount.length) {
                        this.accounts.delete(accountName);
                    }
                }
            }
        });
        addedSessions.forEach(s => this.registerSession(s));
    }
    async login(scopes) {
        return this.createSession(scopes);
    }
    async logout(sessionId) {
        return this.removeSession(sessionId);
    }
    createSession(scopes) {
        return this.proxy.$createSession(this.id, scopes);
    }
    removeSession(sessionId) {
        return this.proxy.$removeSession(this.id, sessionId)
            .then(() => { this.messageService.info('Successfully signed out.'); });
    }
}
exports.AuthenticationProviderImpl = AuthenticationProviderImpl;
async function readAccountUsages(storageService, providerId, accountName) {
    const accountKey = `authentication-${providerId}-${accountName}-usages`;
    const storedUsages = await storageService.getData(accountKey);
    let usages = [];
    if (storedUsages) {
        try {
            usages = JSON.parse(storedUsages);
        }
        catch (e) {
            console.log(e);
        }
    }
    return usages;
}
function removeAccountUsage(storageService, providerId, accountName) {
    const accountKey = `authentication-${providerId}-${accountName}-usages`;
    storageService.setData(accountKey, undefined);
}
//# sourceMappingURL=authentication-main.js.map