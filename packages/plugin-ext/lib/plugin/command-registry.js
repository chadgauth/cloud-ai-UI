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
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandsConverter = exports.CommandRegistryImpl = void 0;
const plugin_api_rpc_1 = require("../common/plugin-api-rpc");
const types_impl_1 = require("./types-impl");
const known_commands_1 = require("./known-commands");
class CommandRegistryImpl {
    constructor(rpc) {
        this.commands = new Set();
        this.handlers = new Map();
        this.proxy = rpc.getProxy(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.COMMAND_REGISTRY_MAIN);
        this.argumentProcessors = [];
        this.commandsConverter = new CommandsConverter(this);
    }
    get converter() {
        return this.commandsConverter;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    registerCommand(command, handler, thisArg) {
        if (this.commands.has(command.id)) {
            throw new Error(`Command ${command.id} already exist`);
        }
        this.commands.add(command.id);
        this.proxy.$registerCommand(command);
        const toDispose = [];
        if (handler) {
            toDispose.push(this.registerHandler(command.id, handler, thisArg));
        }
        toDispose.push(types_impl_1.Disposable.create(() => {
            this.commands.delete(command.id);
            this.proxy.$unregisterCommand(command.id);
        }));
        return types_impl_1.Disposable.from(...toDispose);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    registerHandler(commandId, handler, thisArg) {
        if (this.handlers.has(commandId)) {
            throw new Error(`Command "${commandId}" already has handler`);
        }
        this.proxy.$registerHandler(commandId);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.handlers.set(commandId, (...args) => handler.apply(thisArg, args));
        return types_impl_1.Disposable.create(() => {
            this.handlers.delete(commandId);
            this.proxy.$unregisterHandler(commandId);
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $executeCommand(id, ...args) {
        if (this.handlers.has(id)) {
            return this.executeLocalCommand(id, ...args);
        }
        else {
            return Promise.reject(new Error(`Command: ${id} does not exist.`));
        }
    }
    /* eslint-disable @typescript-eslint/no-explicit-any */
    executeCommand(id, ...args) {
        if (this.handlers.has(id)) {
            return this.executeLocalCommand(id, ...args);
        }
        else if (known_commands_1.KnownCommands.mapped(id)) {
            // Using the KnownCommand exclusions, convert the commands manually
            return known_commands_1.KnownCommands.map(id, args, (mappedId, mappedArgs, mappedResult) => {
                const mr = mappedResult;
                return this.proxy.$executeCommand(mappedId, ...mappedArgs || []).then((result) => {
                    if (!result) {
                        return undefined;
                    }
                    if (!mr) {
                        return result;
                    }
                    return mr(result);
                });
            });
        }
        else {
            return this.proxy.$executeCommand(id, ...args);
        }
    }
    /* eslint-enable @typescript-eslint/no-explicit-any */
    getKeyBinding(commandId) {
        return this.proxy.$getKeyBinding(commandId);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async executeLocalCommand(id, ...args) {
        const handler = this.handlers.get(id);
        if (handler) {
            return handler(...args.map(arg => this.argumentProcessors.reduce((r, p) => p.processArgument(r), arg)));
        }
        else {
            throw new Error(`No handler exists for command '${id}'`);
        }
    }
    async getCommands(filterUnderscoreCommands = false) {
        const result = await this.proxy.$getCommands();
        if (filterUnderscoreCommands) {
            return result.filter(command => command[0] !== '_');
        }
        return result;
    }
    registerArgumentProcessor(processor) {
        this.argumentProcessors.push(processor);
    }
}
exports.CommandRegistryImpl = CommandRegistryImpl;
// copied and modified from https://github.com/microsoft/vscode/blob/1.37.1/src/vs/workbench/api/common/extHostCommands.ts#L217-L259
class CommandsConverter {
    constructor(commands) {
        this.commandsMap = new Map();
        this.handle = 0;
        this.safeCommandId = `theia_safe_cmd_${Date.now().toString()}`;
        this.commands = commands;
        this.isSafeCommandRegistered = false;
    }
    toSafeCommand(command, disposables) {
        if (!command) {
            return undefined;
        }
        const result = this.toInternalCommand(command);
        if (known_commands_1.KnownCommands.mapped(result.id)) {
            return result;
        }
        if (!this.isSafeCommandRegistered) {
            this.commands.registerCommand({ id: this.safeCommandId }, this.executeSafeCommand, this);
            this.isSafeCommandRegistered = true;
        }
        if (command.arguments && command.arguments.length > 0) {
            const id = this.handle++;
            this.commandsMap.set(id, command);
            disposables.push(new types_impl_1.Disposable(() => this.commandsMap.delete(id)));
            result.id = this.safeCommandId;
            result.arguments = [id];
        }
        return result;
    }
    toInternalCommand(external) {
        // we're deprecating Command.id, so it has to be optional.
        // Existing code will have compiled against a non - optional version of the field, so asserting it to exist is ok
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return known_commands_1.KnownCommands.map(external.command, external.arguments, (mappedId, mappedArgs) => ({
            id: mappedId,
            title: external.title || ' ',
            tooltip: external.tooltip,
            arguments: mappedArgs
        }));
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    executeSafeCommand(...args) {
        const command = this.commandsMap.get(args[0]);
        if (!command || !command.command) {
            return Promise.reject(`command ${args[0]} not found`);
        }
        return this.commands.executeCommand(command.command, ...(command.arguments || []));
    }
}
exports.CommandsConverter = CommandsConverter;
//# sourceMappingURL=command-registry.js.map