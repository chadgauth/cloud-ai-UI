"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PseudoTerminal = exports.TerminalExtImpl = exports.EnvironmentVariableCollection = exports.TerminalServiceExtImpl = exports.getIconClass = exports.getIconUris = void 0;
// *****************************************************************************
// Copyright (C) 2018 Red Hat, Inc. and others.
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
const coreutils_1 = require("@theia/core/shared/@phosphor/coreutils");
const plugin_api_rpc_1 = require("../common/plugin-api-rpc");
const event_1 = require("@theia/core/lib/common/event");
const promise_util_1 = require("@theia/core/lib/common/promise-util");
const Converter = require("./type-converters");
const types_impl_1 = require("./types-impl");
const themeService_1 = require("@theia/monaco-editor-core/esm/vs/platform/theme/common/themeService");
function getIconUris(iconPath) {
    if (types_impl_1.ThemeIcon.is(iconPath)) {
        return { id: iconPath.id };
    }
    return undefined;
}
exports.getIconUris = getIconUris;
function getIconClass(options) {
    const iconClass = getIconUris(options.iconPath);
    if (iconClass) {
        return themeService_1.ThemeIcon.asClassName(iconClass);
    }
    return undefined;
}
exports.getIconClass = getIconClass;
/**
 * Provides high level terminal plugin api to use in the Theia plugins.
 * This service allow(with help proxy) create and use terminal emulator.
 */
class TerminalServiceExtImpl {
    constructor(rpc) {
        this._terminals = new Map();
        this._pseudoTerminals = new Map();
        this.terminalLinkProviders = new Map();
        this.terminalProfileProviders = new Map();
        this.onDidCloseTerminalEmitter = new event_1.Emitter();
        this.onDidCloseTerminal = this.onDidCloseTerminalEmitter.event;
        this.onDidOpenTerminalEmitter = new event_1.Emitter();
        this.onDidOpenTerminal = this.onDidOpenTerminalEmitter.event;
        this.onDidChangeActiveTerminalEmitter = new event_1.Emitter();
        this.onDidChangeActiveTerminal = this.onDidChangeActiveTerminalEmitter.event;
        this.onDidChangeTerminalStateEmitter = new event_1.Emitter();
        this.onDidChangeTerminalState = this.onDidChangeTerminalStateEmitter.event;
        this.environmentVariableCollections = new Map();
        this.proxy = rpc.getProxy(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.TERMINAL_MAIN);
    }
    get terminals() {
        return [...this._terminals.values()];
    }
    createTerminal(nameOrOptions, shellPath, shellArgs) {
        const id = `plugin-terminal-${coreutils_1.UUID.uuid4()}`;
        let options;
        let pseudoTerminal = undefined;
        if (typeof nameOrOptions === 'object') {
            if ('pty' in nameOrOptions) {
                pseudoTerminal = nameOrOptions.pty;
                options = {
                    name: nameOrOptions.name,
                };
                this._pseudoTerminals.set(id, new PseudoTerminal(id, this.proxy, pseudoTerminal));
            }
            else {
                options = nameOrOptions;
            }
        }
        else {
            options = {
                name: nameOrOptions,
                shellPath: shellPath,
                shellArgs: shellArgs
            };
        }
        let parentId;
        if (options.location && typeof options.location === 'object' && 'parentTerminal' in options.location) {
            const parentTerminal = options.location.parentTerminal;
            if (parentTerminal instanceof TerminalExtImpl) {
                for (const [k, v] of this._terminals) {
                    if (v === parentTerminal) {
                        parentId = k;
                        break;
                    }
                }
            }
        }
        this.proxy.$createTerminal(id, options, parentId, !!pseudoTerminal);
        let creationOptions = options;
        // make sure to pass ExtensionTerminalOptions as creation options
        if (typeof nameOrOptions === 'object' && 'pty' in nameOrOptions) {
            creationOptions = nameOrOptions;
        }
        return this.obtainTerminal(id, options.name || 'Terminal', creationOptions);
    }
    attachPtyToTerminal(terminalId, pty) {
        this._pseudoTerminals.set(terminalId.toString(), new PseudoTerminal(terminalId, this.proxy, pty, true));
    }
    obtainTerminal(id, name, options) {
        let terminal = this._terminals.get(id);
        if (!terminal) {
            terminal = new TerminalExtImpl(this.proxy, options !== null && options !== void 0 ? options : {});
            this._terminals.set(id, terminal);
        }
        terminal.name = name;
        return terminal;
    }
    $terminalOnInput(id, data) {
        const terminal = this._pseudoTerminals.get(id);
        if (!terminal) {
            return;
        }
        terminal.emitOnInput(data);
    }
    $terminalStateChanged(id) {
        const terminal = this._terminals.get(id);
        if (!terminal) {
            return;
        }
        if (!terminal.state.isInteractedWith) {
            terminal.state = { isInteractedWith: true };
            this.onDidChangeTerminalStateEmitter.fire(terminal);
        }
    }
    $terminalSizeChanged(id, clos, rows) {
        const terminal = this._pseudoTerminals.get(id);
        if (!terminal) {
            return;
        }
        terminal.emitOnResize(clos, rows);
    }
    $terminalCreated(id, name) {
        const terminal = this.obtainTerminal(id, name);
        terminal.id.resolve(id);
        this.onDidOpenTerminalEmitter.fire(terminal);
    }
    $terminalNameChanged(id, name) {
        const terminal = this._terminals.get(id);
        if (terminal) {
            terminal.name = name;
        }
    }
    $terminalOpened(id, processId, terminalId, cols, rows) {
        const terminal = this._terminals.get(id);
        if (terminal) {
            // resolve for existing clients
            terminal.deferredProcessId.resolve(processId);
            // install new if terminal is reconnected
            terminal.deferredProcessId = new promise_util_1.Deferred();
            terminal.deferredProcessId.resolve(processId);
        }
        // Switch the pseudoterminal keyed by terminalId to be keyed by terminal ID
        const tId = terminalId.toString();
        if (this._pseudoTerminals.has(tId)) {
            const pseudo = this._pseudoTerminals.get(tId);
            if (pseudo) {
                this._pseudoTerminals.set(id, pseudo);
            }
            this._pseudoTerminals.delete(tId);
        }
        const pseudoTerminal = this._pseudoTerminals.get(id);
        if (pseudoTerminal) {
            pseudoTerminal.emitOnOpen(cols, rows);
        }
    }
    $terminalClosed(id, exitStatus) {
        const terminal = this._terminals.get(id);
        if (terminal) {
            terminal.exitStatus = exitStatus !== null && exitStatus !== void 0 ? exitStatus : { code: undefined, reason: types_impl_1.TerminalExitReason.Unknown };
            this.onDidCloseTerminalEmitter.fire(terminal);
            this._terminals.delete(id);
        }
        const pseudoTerminal = this._pseudoTerminals.get(id);
        if (pseudoTerminal) {
            pseudoTerminal.emitOnClose();
            this._pseudoTerminals.delete(id);
        }
    }
    get activeTerminal() {
        return this.activeTerminalId && this._terminals.get(this.activeTerminalId) || undefined;
    }
    $currentTerminalChanged(id) {
        this.activeTerminalId = id;
        this.onDidChangeActiveTerminalEmitter.fire(this.activeTerminal);
    }
    registerTerminalLinkProvider(provider) {
        const providerId = (TerminalServiceExtImpl.nextProviderId++).toString();
        this.terminalLinkProviders.set(providerId, provider);
        this.proxy.$registerTerminalLinkProvider(providerId);
        return types_impl_1.Disposable.create(() => {
            this.proxy.$unregisterTerminalLinkProvider(providerId);
            this.terminalLinkProviders.delete(providerId);
        });
    }
    registerTerminalProfileProvider(id, provider) {
        this.terminalProfileProviders.set(id, provider);
        return types_impl_1.Disposable.create(() => {
            this.terminalProfileProviders.delete(id);
        });
    }
    /** @stubbed */
    registerTerminalQuickFixProvider(id, provider) {
        return types_impl_1.Disposable.NULL;
    }
    isExtensionTerminalOptions(options) {
        return 'pty' in options;
    }
    async $startProfile(profileId, cancellationToken) {
        const provider = this.terminalProfileProviders.get(profileId);
        if (!provider) {
            throw new Error(`No terminal profile provider with id '${profileId}'`);
        }
        const profile = await provider.provideTerminalProfile(cancellationToken);
        if (!profile) {
            throw new Error(`Profile with id ${profileId} could not be created`);
        }
        const id = `plugin-terminal-${coreutils_1.UUID.uuid4()}`;
        const options = profile.options;
        if (this.isExtensionTerminalOptions(options)) {
            this._pseudoTerminals.set(id, new PseudoTerminal(id, this.proxy, options.pty));
            return this.proxy.$createTerminal(id, { name: options.name }, undefined, true);
        }
        else {
            return this.proxy.$createTerminal(id, profile.options);
        }
    }
    async $provideTerminalLinks(line, terminalId, token) {
        const links = [];
        const terminal = this._terminals.get(terminalId);
        if (terminal) {
            for (const [providerId, provider] of this.terminalLinkProviders) {
                const providedLinks = await provider.provideTerminalLinks({ line, terminal }, token);
                if (providedLinks) {
                    links.push(...providedLinks.map(link => ({ ...link, providerId })));
                }
            }
        }
        return links;
    }
    async $handleTerminalLink(link) {
        const provider = this.terminalLinkProviders.get(link.providerId);
        if (!provider) {
            throw Error('Terminal link provider not found');
        }
        await provider.handleTerminalLink(link);
    }
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    // some code copied and modified from https://github.com/microsoft/vscode/blob/1.49.0/src/vs/workbench/api/common/extHostTerminalService.ts
    getEnvironmentVariableCollection(extensionIdentifier) {
        let collection = this.environmentVariableCollections.get(extensionIdentifier);
        if (!collection) {
            collection = new EnvironmentVariableCollection();
            this.setEnvironmentVariableCollection(extensionIdentifier, collection);
        }
        return collection;
    }
    syncEnvironmentVariableCollection(extensionIdentifier, collection) {
        const serialized = [...collection.map.entries()];
        this.proxy.$setEnvironmentVariableCollection(collection.persistent, {
            extensionIdentifier,
            collection: serialized.length === 0 ? undefined : serialized,
            description: Converter.fromMarkdownOrString(collection.description)
        });
    }
    setEnvironmentVariableCollection(extensionIdentifier, collection) {
        this.environmentVariableCollections.set(extensionIdentifier, collection);
        collection.onDidChangeCollection(() => {
            // When any collection value changes send this immediately, this is done to ensure
            // following calls to createTerminal will be created with the new environment. It will
            // result in more noise by sending multiple updates when called but collections are
            // expected to be small.
            this.syncEnvironmentVariableCollection(extensionIdentifier, collection);
        });
    }
    $initEnvironmentVariableCollections(collections) {
        collections.forEach(entry => {
            const extensionIdentifier = entry[0];
            const collection = new EnvironmentVariableCollection(entry[1]);
            this.setEnvironmentVariableCollection(extensionIdentifier, collection);
        });
    }
}
exports.TerminalServiceExtImpl = TerminalServiceExtImpl;
TerminalServiceExtImpl.nextProviderId = 0;
class EnvironmentVariableCollection {
    constructor(serialized) {
        this.map = new Map();
        this._persistent = true;
        this.onDidChangeCollectionEmitter = new event_1.Emitter();
        this.onDidChangeCollection = this.onDidChangeCollectionEmitter.event;
        this.map = new Map(serialized);
    }
    get description() { return this._description; }
    set description(value) {
        this._description = value;
        this.onDidChangeCollectionEmitter.fire();
    }
    get persistent() { return this._persistent; }
    set persistent(value) {
        this._persistent = value;
        this.onDidChangeCollectionEmitter.fire();
    }
    get size() {
        return this.map.size;
    }
    replace(variable, value) {
        this._setIfDiffers(variable, { value, type: types_impl_1.EnvironmentVariableMutatorType.Replace });
    }
    append(variable, value) {
        this._setIfDiffers(variable, { value, type: types_impl_1.EnvironmentVariableMutatorType.Append });
    }
    prepend(variable, value) {
        this._setIfDiffers(variable, { value, type: types_impl_1.EnvironmentVariableMutatorType.Prepend });
    }
    _setIfDiffers(variable, mutator) {
        const current = this.map.get(variable);
        if (!current || current.value !== mutator.value || current.type !== mutator.type) {
            this.map.set(variable, mutator);
            this.onDidChangeCollectionEmitter.fire();
        }
    }
    get(variable) {
        return this.map.get(variable);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    forEach(callback, thisArg) {
        this.map.forEach((value, key) => callback.call(thisArg, key, value, this));
    }
    delete(variable) {
        this.map.delete(variable);
        this.onDidChangeCollectionEmitter.fire();
    }
    clear() {
        this.map.clear();
        this.onDidChangeCollectionEmitter.fire();
    }
}
exports.EnvironmentVariableCollection = EnvironmentVariableCollection;
class TerminalExtImpl {
    constructor(proxy, options) {
        this.proxy = proxy;
        this.options = options;
        this.id = new promise_util_1.Deferred();
        this.deferredProcessId = new promise_util_1.Deferred();
        this.state = { isInteractedWith: false };
        this.creationOptions = this.options;
    }
    get processId() {
        return this.deferredProcessId.promise;
    }
    sendText(text, addNewLine = true) {
        this.id.promise.then(id => this.proxy.$sendText(id, text, addNewLine));
    }
    show(preserveFocus) {
        this.id.promise.then(id => this.proxy.$show(id, preserveFocus));
    }
    hide() {
        this.id.promise.then(id => this.proxy.$hide(id));
    }
    dispose() {
        this.id.promise.then(id => this.proxy.$dispose(id));
    }
}
exports.TerminalExtImpl = TerminalExtImpl;
class PseudoTerminal {
    constructor(id, proxy, pseudoTerminal, waitOnExit) {
        this.proxy = proxy;
        this.pseudoTerminal = pseudoTerminal;
        pseudoTerminal.onDidWrite(data => {
            if (typeof id === 'string') {
                this.proxy.$write(id, data);
            }
            else {
                this.proxy.$writeByTerminalId(id, data);
            }
        });
        if (pseudoTerminal.onDidClose) {
            pseudoTerminal.onDidClose((e = undefined) => {
                if (typeof id === 'string') {
                    this.proxy.$dispose(id);
                }
                else {
                    this.proxy.$disposeByTerminalId(id, waitOnExit);
                }
            });
        }
        if (pseudoTerminal.onDidOverrideDimensions) {
            pseudoTerminal.onDidOverrideDimensions(e => {
                if (e) {
                    if (typeof id === 'string') {
                        this.proxy.$resize(id, e.columns, e.rows);
                    }
                    else {
                        this.proxy.$resizeByTerminalId(id, e.columns, e.rows);
                    }
                }
            });
        }
        if (pseudoTerminal.onDidChangeName) {
            pseudoTerminal.onDidChangeName(name => {
                if (typeof id === 'string') {
                    this.proxy.$setName(id, name);
                }
                else {
                    this.proxy.$setNameByTerminalId(id, name);
                }
            });
        }
    }
    emitOnClose() {
        this.pseudoTerminal.close();
    }
    emitOnInput(data) {
        if (this.pseudoTerminal.handleInput) {
            this.pseudoTerminal.handleInput(data);
        }
    }
    emitOnOpen(cols, rows) {
        this.pseudoTerminal.open({
            rows,
            columns: cols,
        });
    }
    emitOnResize(cols, rows) {
        if (this.pseudoTerminal.setDimensions) {
            this.pseudoTerminal.setDimensions({ columns: cols, rows });
        }
    }
}
exports.PseudoTerminal = PseudoTerminal;
//# sourceMappingURL=terminal-ext.js.map