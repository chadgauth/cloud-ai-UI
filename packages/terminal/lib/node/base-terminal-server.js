"use strict";
// *****************************************************************************
// Copyright (C) 2017 Ericsson and others.
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MergedEnvironmentVariableCollectionImpl = exports.BaseTerminalServer = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const common_1 = require("@theia/core/lib/common");
const base_terminal_protocol_1 = require("../common/base-terminal-protocol");
const node_1 = require("@theia/process/lib/node");
const shell_process_1 = require("./shell-process");
let BaseTerminalServer = class BaseTerminalServer {
    constructor(processManager, logger) {
        this.processManager = processManager;
        this.logger = logger;
        this.client = undefined;
        this.terminalToDispose = new Map();
        this.collections = new Map();
        processManager.onDelete(id => {
            const toDispose = this.terminalToDispose.get(id);
            if (toDispose !== undefined) {
                toDispose.dispose();
                this.terminalToDispose.delete(id);
            }
        });
        this.mergedCollection = this.resolveMergedCollection();
    }
    async attach(id) {
        const term = this.processManager.get(id);
        if (term && term instanceof node_1.TerminalProcess) {
            return term.id;
        }
        else {
            this.logger.warn(`Couldn't attach - can't find terminal with id: ${id} `);
            return -1;
        }
    }
    async onAttachAttempted(id) {
        const terminal = this.processManager.get(id);
        if (terminal instanceof node_1.TaskTerminalProcess) {
            terminal.attachmentAttempted = true;
            if (terminal.exited) {
                // Didn't execute `unregisterProcess` on terminal `exit` event to enable attaching task output to terminal,
                // Fixes https://github.com/eclipse-theia/theia/issues/2961
                terminal.unregisterProcess();
            }
            else {
                this.postAttachAttempted(terminal);
            }
        }
    }
    async getProcessId(id) {
        const terminal = this.processManager.get(id);
        if (!(terminal instanceof node_1.TerminalProcess)) {
            throw new Error(`terminal "${id}" does not exist`);
        }
        return terminal.pid;
    }
    async getProcessInfo(id) {
        const terminal = this.processManager.get(id);
        if (!(terminal instanceof node_1.TerminalProcess)) {
            throw new Error(`terminal "${id}" does not exist`);
        }
        return {
            executable: terminal.executable,
            arguments: terminal.arguments,
        };
    }
    async getEnvVarCollectionDescriptionsByExtension(id) {
        const terminal = this.processManager.get(id);
        if (!(terminal instanceof node_1.TerminalProcess)) {
            throw new Error(`terminal "${id}" does not exist`);
        }
        const result = new Map();
        this.collections.forEach((value, key) => {
            result.set(key, value.description);
        });
        return result;
    }
    async getCwdURI(id) {
        const terminal = this.processManager.get(id);
        if (!(terminal instanceof node_1.TerminalProcess)) {
            throw new Error(`terminal "${id}" does not exist`);
        }
        return terminal.getCwdURI();
    }
    async close(id) {
        const term = this.processManager.get(id);
        if (term instanceof node_1.TerminalProcess) {
            term.kill();
        }
    }
    async getDefaultShell() {
        return shell_process_1.ShellProcess.getShellExecutablePath();
    }
    dispose() {
        // noop
    }
    async resize(id, cols, rows) {
        const term = this.processManager.get(id);
        if (term && term instanceof node_1.TerminalProcess) {
            term.resize(cols, rows);
        }
        else {
            console.warn("Couldn't resize terminal " + id + ", because it doesn't exist.");
        }
    }
    /* Set the client to receive notifications on.  */
    setClient(client) {
        this.client = client;
        if (!this.client) {
            return;
        }
        this.client.updateTerminalEnvVariables();
    }
    notifyClientOnExit(term) {
        const toDispose = new common_1.DisposableCollection();
        toDispose.push(term.onError(error => {
            this.logger.error(`Terminal pid: ${term.pid} error: ${error}, closing it.`);
            if (this.client !== undefined) {
                this.client.onTerminalError({
                    terminalId: term.id,
                    error: new Error(`Failed to execute terminal process (${error.code})`),
                    attached: term instanceof node_1.TaskTerminalProcess && term.attachmentAttempted
                });
            }
        }));
        toDispose.push(term.onExit(event => {
            if (this.client !== undefined) {
                this.client.onTerminalExitChanged({
                    terminalId: term.id,
                    code: event.code,
                    reason: base_terminal_protocol_1.TerminalExitReason.Process,
                    signal: event.signal,
                    attached: term instanceof node_1.TaskTerminalProcess && term.attachmentAttempted
                });
            }
        }));
        return toDispose;
    }
    postCreate(term) {
        const toDispose = this.notifyClientOnExit(term);
        this.terminalToDispose.set(term.id, toDispose);
    }
    postAttachAttempted(term) {
        const toDispose = this.notifyClientOnExit(term);
        this.terminalToDispose.set(term.id, toDispose);
    }
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    // some code copied and modified from https://github.com/microsoft/vscode/blob/1.49.0/src/vs/workbench/contrib/terminal/common/environmentVariableService.ts
    setCollection(extensionIdentifier, persistent, collection, description) {
        const translatedCollection = { persistent, description, map: new Map(collection) };
        this.collections.set(extensionIdentifier, translatedCollection);
        this.updateCollections();
    }
    deleteCollection(extensionIdentifier) {
        this.collections.delete(extensionIdentifier);
        this.updateCollections();
    }
    updateCollections() {
        this.persistCollections();
        this.mergedCollection = this.resolveMergedCollection();
    }
    persistCollections() {
        const collectionsJson = [];
        this.collections.forEach((collection, extensionIdentifier) => {
            if (collection.persistent) {
                collectionsJson.push({
                    extensionIdentifier,
                    collection: [...this.collections.get(extensionIdentifier).map.entries()],
                    description: collection.description
                });
            }
        });
        if (this.client) {
            const stringifiedJson = JSON.stringify(collectionsJson);
            this.client.storeTerminalEnvVariables(stringifiedJson);
        }
    }
    resolveMergedCollection() {
        return new MergedEnvironmentVariableCollectionImpl(this.collections);
    }
};
BaseTerminalServer = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(node_1.ProcessManager)),
    __param(1, (0, inversify_1.inject)(common_1.ILogger)),
    __param(1, (0, inversify_1.named)('terminal')),
    __metadata("design:paramtypes", [node_1.ProcessManager, Object])
], BaseTerminalServer);
exports.BaseTerminalServer = BaseTerminalServer;
/*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
// some code copied and modified from https://github.com/microsoft/vscode/blob/1.49.0/src/vs/workbench/contrib/terminal/common/environmentVariableCollection.ts
class MergedEnvironmentVariableCollectionImpl {
    constructor(collections) {
        this.map = new Map();
        collections.forEach((collection, extensionIdentifier) => {
            const it = collection.map.entries();
            let next = it.next();
            while (!next.done) {
                const variable = next.value[0];
                let entry = this.map.get(variable);
                if (!entry) {
                    entry = [];
                    this.map.set(variable, entry);
                }
                // If the first item in the entry is replace ignore any other entries as they would
                // just get replaced by this one.
                if (entry.length > 0 && entry[0].type === base_terminal_protocol_1.EnvironmentVariableMutatorType.Replace) {
                    next = it.next();
                    continue;
                }
                // Mutators get applied in the reverse order than they are created
                const mutator = next.value[1];
                entry.unshift({
                    extensionIdentifier,
                    value: mutator.value,
                    type: mutator.type
                });
                next = it.next();
            }
        });
    }
    applyToProcessEnvironment(env) {
        let lowerToActualVariableNames;
        if (common_1.isWindows) {
            lowerToActualVariableNames = {};
            Object.keys(env).forEach(e => lowerToActualVariableNames[e.toLowerCase()] = e);
        }
        this.map.forEach((mutators, variable) => {
            const actualVariable = common_1.isWindows ? lowerToActualVariableNames[variable.toLowerCase()] || variable : variable;
            mutators.forEach(mutator => {
                switch (mutator.type) {
                    case base_terminal_protocol_1.EnvironmentVariableMutatorType.Append:
                        env[actualVariable] = (env[actualVariable] || '') + mutator.value;
                        break;
                    case base_terminal_protocol_1.EnvironmentVariableMutatorType.Prepend:
                        env[actualVariable] = mutator.value + (env[actualVariable] || '');
                        break;
                    case base_terminal_protocol_1.EnvironmentVariableMutatorType.Replace:
                        env[actualVariable] = mutator.value;
                        break;
                }
            });
        });
    }
}
exports.MergedEnvironmentVariableCollectionImpl = MergedEnvironmentVariableCollectionImpl;
//# sourceMappingURL=base-terminal-server.js.map