"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerminalServiceMainImpl = void 0;
const browser_1 = require("@theia/core/lib/browser");
const terminal_widget_1 = require("@theia/terminal/lib/browser/base/terminal-widget");
const terminal_service_1 = require("@theia/terminal/lib/browser/base/terminal-service");
const plugin_api_rpc_1 = require("../../common/plugin-api-rpc");
const disposable_1 = require("@theia/core/lib/common/disposable");
const shell_terminal_protocol_1 = require("@theia/terminal/lib/common/shell-terminal-protocol");
const terminal_link_provider_1 = require("@theia/terminal/lib/browser/terminal-link-provider");
const uri_1 = require("@theia/core/lib/common/uri");
const terminal_ext_1 = require("../../plugin/terminal-ext");
const plugin_terminal_registry_1 = require("./plugin-terminal-registry");
const core_1 = require("@theia/core");
const hosted_plugin_1 = require("../../hosted/browser/hosted-plugin");
/**
 * Plugin api service allows working with terminal emulator.
 */
class TerminalServiceMainImpl {
    constructor(rpc, container) {
        this.terminalLinkProviders = [];
        this.toDispose = new disposable_1.DisposableCollection();
        this.terminals = container.get(terminal_service_1.TerminalService);
        this.pluginTerminalRegistry = container.get(plugin_terminal_registry_1.PluginTerminalRegistry);
        this.hostedPluginSupport = container.get(hosted_plugin_1.HostedPluginSupport);
        this.shell = container.get(browser_1.ApplicationShell);
        this.shellTerminalServer = container.get(shell_terminal_protocol_1.ShellTerminalServerProxy);
        this.extProxy = rpc.getProxy(plugin_api_rpc_1.MAIN_RPC_CONTEXT.TERMINAL_EXT);
        this.toDispose.push(this.terminals.onDidCreateTerminal(terminal => this.trackTerminal(terminal)));
        for (const terminal of this.terminals.all) {
            this.trackTerminal(terminal);
        }
        this.toDispose.push(this.terminals.onDidChangeCurrentTerminal(() => this.updateCurrentTerminal()));
        this.updateCurrentTerminal();
        if (this.shellTerminalServer.collections.size > 0) {
            const collectionAsArray = [...this.shellTerminalServer.collections.entries()];
            const serializedCollections = collectionAsArray.map(e => [e[0], [...e[1].map.entries()]]);
            this.extProxy.$initEnvironmentVariableCollections(serializedCollections);
        }
        this.pluginTerminalRegistry.startCallback = id => this.startProfile(id);
        container.bind(terminal_link_provider_1.TerminalLinkProvider).toDynamicValue(() => this);
    }
    async startProfile(id) {
        await this.hostedPluginSupport.activateByTerminalProfile(id);
        return this.extProxy.$startProfile(id, core_1.CancellationToken.None);
    }
    $setEnvironmentVariableCollection(persistent, collection) {
        if (collection.collection) {
            this.shellTerminalServer.setCollection(collection.extensionIdentifier, persistent, collection.collection, collection.description);
        }
        else {
            this.shellTerminalServer.deleteCollection(collection.extensionIdentifier);
        }
    }
    dispose() {
        this.toDispose.dispose();
    }
    updateCurrentTerminal() {
        const { currentTerminal } = this.terminals;
        this.extProxy.$currentTerminalChanged(currentTerminal && currentTerminal.id);
    }
    async trackTerminal(terminal) {
        let name = terminal.title.label;
        this.extProxy.$terminalCreated(terminal.id, name);
        const updateTitle = () => {
            if (name !== terminal.title.label) {
                name = terminal.title.label;
                this.extProxy.$terminalNameChanged(terminal.id, name);
            }
        };
        terminal.title.changed.connect(updateTitle);
        this.toDispose.push(disposable_1.Disposable.create(() => terminal.title.changed.disconnect(updateTitle)));
        const updateProcessId = () => terminal.processId.then(processId => this.extProxy.$terminalOpened(terminal.id, processId, terminal.terminalId, terminal.dimensions.cols, terminal.dimensions.rows), () => { });
        updateProcessId();
        this.toDispose.push(terminal.onDidOpen(() => updateProcessId()));
        this.toDispose.push(terminal.onTerminalDidClose(term => this.extProxy.$terminalClosed(term.id, term.exitStatus)));
        this.toDispose.push(terminal.onSizeChanged(({ cols, rows }) => {
            this.extProxy.$terminalSizeChanged(terminal.id, cols, rows);
        }));
        this.toDispose.push(terminal.onData(data => {
            this.extProxy.$terminalOnInput(terminal.id, data);
            this.extProxy.$terminalStateChanged(terminal.id);
        }));
    }
    $write(id, data) {
        const terminal = this.terminals.getById(id);
        if (!terminal) {
            return;
        }
        terminal.write(data);
    }
    $resize(id, cols, rows) {
        const terminal = this.terminals.getById(id);
        if (!terminal) {
            return;
        }
        terminal.resize(cols, rows);
    }
    async $createTerminal(id, options, parentId, isPseudoTerminal) {
        const terminal = await this.terminals.newTerminal({
            id,
            title: options.name,
            iconClass: (0, terminal_ext_1.getIconClass)(options),
            shellPath: options.shellPath,
            shellArgs: options.shellArgs,
            cwd: options.cwd ? new uri_1.URI(options.cwd) : undefined,
            env: options.env,
            strictEnv: options.strictEnv,
            destroyTermOnClose: true,
            useServerTitle: false,
            attributes: options.attributes,
            hideFromUser: options.hideFromUser,
            location: this.getTerminalLocation(options, parentId),
            isPseudoTerminal,
            isTransient: options.isTransient
        });
        if (options.message) {
            terminal.writeLine(options.message);
        }
        terminal.start();
        return terminal.id;
    }
    getTerminalLocation(options, parentId) {
        if (typeof options.location === 'number' && Object.values(terminal_widget_1.TerminalLocation).includes(options.location)) {
            return options.location;
        }
        else if (options.location && typeof options.location === 'object') {
            if ('parentTerminal' in options.location) {
                if (!parentId) {
                    throw new Error('parentTerminal is set but no parentId is provided');
                }
                return { 'parentTerminal': parentId };
            }
            else {
                return options.location;
            }
        }
        return undefined;
    }
    $sendText(id, text, addNewLine) {
        const terminal = this.terminals.getById(id);
        if (terminal) {
            text = text.replace(/\r?\n/g, '\r');
            if (addNewLine && text.charAt(text.length - 1) !== '\r') {
                text += '\r';
            }
            terminal.sendText(text);
        }
    }
    $show(id, preserveFocus) {
        const terminal = this.terminals.getById(id);
        if (terminal) {
            const options = {};
            if (preserveFocus) {
                options.mode = 'reveal';
            }
            this.terminals.open(terminal, options);
        }
    }
    $hide(id) {
        const terminal = this.terminals.getById(id);
        if (terminal && terminal.isVisible) {
            const area = this.shell.getAreaFor(terminal);
            if (area) {
                this.shell.collapsePanel(area);
            }
        }
    }
    $dispose(id) {
        const terminal = this.terminals.getById(id);
        if (terminal) {
            terminal.dispose();
        }
    }
    $setName(id, name) {
        var _a;
        (_a = this.terminals.getById(id)) === null || _a === void 0 ? void 0 : _a.setTitle(name);
    }
    $sendTextByTerminalId(id, text, addNewLine) {
        const terminal = this.terminals.getByTerminalId(id);
        if (terminal) {
            text = text.replace(/\r?\n/g, '\r');
            if (addNewLine && text.charAt(text.length - 1) !== '\r') {
                text += '\r';
            }
            terminal.sendText(text);
        }
    }
    $writeByTerminalId(id, data) {
        const terminal = this.terminals.getByTerminalId(id);
        if (!terminal) {
            return;
        }
        terminal.write(data);
    }
    $resizeByTerminalId(id, cols, rows) {
        const terminal = this.terminals.getByTerminalId(id);
        if (!terminal) {
            return;
        }
        terminal.resize(cols, rows);
    }
    $showByTerminalId(id, preserveFocus) {
        const terminal = this.terminals.getByTerminalId(id);
        if (terminal) {
            const options = {};
            if (preserveFocus) {
                options.mode = 'reveal';
            }
            this.terminals.open(terminal, options);
        }
    }
    $hideByTerminalId(id) {
        const terminal = this.terminals.getByTerminalId(id);
        if (terminal && terminal.isVisible) {
            const area = this.shell.getAreaFor(terminal);
            if (area) {
                this.shell.collapsePanel(area);
            }
        }
    }
    $disposeByTerminalId(id, waitOnExit) {
        const terminal = this.terminals.getByTerminalId(id);
        if (terminal) {
            if (waitOnExit) {
                terminal.waitOnExit(waitOnExit);
                return;
            }
            terminal.dispose();
        }
    }
    $setNameByTerminalId(id, name) {
        var _a;
        (_a = this.terminals.getByTerminalId(id)) === null || _a === void 0 ? void 0 : _a.setTitle(name);
    }
    async $registerTerminalLinkProvider(providerId) {
        this.terminalLinkProviders.push(providerId);
    }
    async $unregisterTerminalLinkProvider(providerId) {
        const index = this.terminalLinkProviders.indexOf(providerId);
        if (index > -1) {
            this.terminalLinkProviders.splice(index, 1);
        }
    }
    async provideLinks(line, terminal, cancellationToken) {
        if (this.terminalLinkProviders.length < 1) {
            return [];
        }
        const links = await this.extProxy.$provideTerminalLinks(line, terminal.id, cancellationToken !== null && cancellationToken !== void 0 ? cancellationToken : core_1.CancellationToken.None);
        return links.map(link => ({ ...link, handle: () => this.extProxy.$handleTerminalLink(link) }));
    }
}
exports.TerminalServiceMainImpl = TerminalServiceMainImpl;
//# sourceMappingURL=terminal-main.js.map