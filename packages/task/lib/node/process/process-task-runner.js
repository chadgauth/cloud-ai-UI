"use strict";
// *****************************************************************************
// Copyright (C) 2017-2019 Ericsson and others.
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessTaskRunner = void 0;
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const inversify_1 = require("@theia/core/shared/inversify");
const core_1 = require("@theia/core");
const node_1 = require("@theia/core/lib/node");
const node_2 = require("@theia/process/lib/node");
const shell_quoting_1 = require("@theia/process/lib/common/shell-quoting");
const process_task_1 = require("./process-task");
const task_protocol_1 = require("../../common/process/task-protocol");
const fs = require("fs");
const shell_process_1 = require("@theia/terminal/lib/node/shell-process");
/**
 * Task runner that runs a task as a process or a command inside a shell.
 */
let ProcessTaskRunner = class ProcessTaskRunner {
    /**
     * Runs a task from the given task configuration.
     * @param taskConfig task configuration to run a task from. The provided task configuration must have a shape of `CommandProperties`.
     */
    async run(taskConfig, ctx) {
        if (!taskConfig.command) {
            throw new Error("Process task config must have 'command' property specified");
        }
        try {
            // Always spawn a task in a pty, the only difference between shell/process tasks is the
            // way the command is passed:
            // - process: directly look for an executable and pass a specific set of arguments/options.
            // - shell: defer the spawning to a shell that will evaluate a command line with our executable.
            const terminalProcessOptions = this.getResolvedCommand(taskConfig);
            const terminal = this.taskTerminalProcessFactory(terminalProcessOptions);
            // Wait for the confirmation that the process is successfully started, or has failed to start.
            await new Promise((resolve, reject) => {
                terminal.onStart(resolve);
                terminal.onError((error) => {
                    reject(task_protocol_1.ProcessTaskError.CouldNotRun(error.code));
                });
            });
            const processType = (taskConfig.taskType || taskConfig.type);
            return this.taskFactory({
                label: taskConfig.label,
                process: terminal,
                processType,
                context: ctx,
                config: taskConfig,
                command: this.getCommand(processType, terminalProcessOptions)
            });
        }
        catch (error) {
            this.logger.error(`Error occurred while creating task: ${error}`);
            throw error;
        }
    }
    getResolvedCommand(taskConfig) {
        const osSpecificCommand = this.getOsSpecificCommand(taskConfig);
        const options = osSpecificCommand.options;
        // Use task's cwd with spawned process and pass node env object to
        // new process, so e.g. we can re-use the system path
        if (options) {
            options.env = {
                ...process.env,
                ...(options.env || {})
            };
        }
        /** Executable to actually spawn. */
        let command;
        /** List of arguments passed to `command`. */
        let args;
        /**
         * Only useful on Windows, has to do with how node-pty handles complex commands.
         * This string should not include the executable, only what comes after it (arguments).
         */
        let commandLine;
        if ((taskConfig.taskType || taskConfig.type) === 'shell') {
            // When running a shell task, we have to spawn a shell process somehow,
            // and tell it to run the command the user wants to run inside of it.
            //
            // E.g:
            // - Spawning a process:
            //     spawn(process_exe, [...args])
            // - Spawning a shell and run a command:
            //     spawn(shell_exe, [shell_exec_cmd_flag, command])
            //
            // The fun part is, the `command` to pass as an argument usually has to be
            // what you would type verbatim inside the shell, so escaping rules apply.
            //
            // What's even more funny is that on Windows, node-pty uses a special
            // mechanism to pass complex escaped arguments, via a string.
            //
            // We need to accommodate most shells, so we need to get specific.
            const { shell } = osSpecificCommand.options;
            command = (shell === null || shell === void 0 ? void 0 : shell.executable) || shell_process_1.ShellProcess.getShellExecutablePath();
            const { execArgs, quotingFunctions } = this.getShellSpecificOptions(command);
            // Allow overriding shell options from task configuration.
            args = (shell === null || shell === void 0 ? void 0 : shell.args) ? [...shell.args] : [...execArgs];
            // Check if an argument list is defined or not. Empty is ok.
            /** Shell command to run: */
            const shellCommand = this.buildShellCommand(osSpecificCommand, quotingFunctions);
            if (core_1.isWindows && /cmd(.exe)?$/.test(command)) {
                // Let's take the following command, including an argument containing whitespace:
                //     cmd> node -p process.argv 1 2 "  3"
                //
                // We would expect the following output:
                //     json> [ '...\\node.exe', '1', '2', '  3' ]
                //
                // Let's run this command through `cmd.exe` using `child_process`:
                //     js> void childprocess.spawn('cmd.exe', ['/s', '/c', 'node -p process.argv 1 2 "  3"']).stderr.on('data', console.log)
                //
                // We get the correct output, but when using node-pty:
                //     js> void nodepty.spawn('cmd.exe', ['/s', '/c', 'node -p process.argv 1 2 "  3"']).on('data', console.log)
                //
                // Then the output looks like:
                //     json> [ '...\\node.exe', '1', '2', '"', '3"' ]
                //
                // To fix that, we need to use a special node-pty feature and pass arguments as one string:
                //     js> nodepty.spawn('cmd.exe', '/s /c "node -p process.argv 1 2 "  3""')
                //
                // Note the extra quotes that need to be added around the whole command.
                commandLine = [...args, `"${shellCommand}"`].join(' ');
            }
            args.push(shellCommand);
        }
        else {
            // When running process tasks, `command` is the executable to run,
            // and `args` are the arguments we want to pass to it.
            command = osSpecificCommand.command;
            if (Array.isArray(osSpecificCommand.args)) {
                // Process task doesn't handle quotation: Normalize arguments from `ShellQuotedString` to raw `string`.
                args = osSpecificCommand.args.map(arg => typeof arg === 'string' ? arg : arg.value);
            }
            else {
                args = [];
            }
        }
        return { command, args, commandLine, options };
    }
    buildShellCommand(systemSpecificCommand, quotingFunctions) {
        var _a;
        if (Array.isArray(systemSpecificCommand.args)) {
            const commandLineElements = [systemSpecificCommand.command, ...systemSpecificCommand.args].map(arg => {
                // We want to quote arguments only if needed.
                if (quotingFunctions && typeof arg === 'string' && this.argumentNeedsQuotes(arg, quotingFunctions)) {
                    return {
                        quoting: "strong" /* Strong */,
                        value: arg,
                    };
                }
                else {
                    return arg;
                }
            });
            return (0, shell_quoting_1.createShellCommandLine)(commandLineElements, quotingFunctions);
        }
        else {
            // No arguments are provided, so `command` is actually the full command line to execute.
            return (_a = systemSpecificCommand.command) !== null && _a !== void 0 ? _a : '';
        }
    }
    getShellSpecificOptions(command) {
        if (/bash(.exe)?$/.test(command)) {
            return {
                quotingFunctions: shell_quoting_1.BashQuotingFunctions,
                execArgs: ['-c']
            };
        }
        else if (/wsl(.exe)?$/.test(command)) {
            return {
                quotingFunctions: shell_quoting_1.BashQuotingFunctions,
                execArgs: ['-e']
            };
        }
        else if (/cmd(.exe)?$/.test(command)) {
            return {
                quotingFunctions: shell_quoting_1.CmdQuotingFunctions,
                execArgs: ['/S', '/C']
            };
        }
        else if (/(ps|pwsh|powershell)(.exe)?/.test(command)) {
            return {
                quotingFunctions: shell_quoting_1.PowershellQuotingFunctions,
                execArgs: ['-c']
            };
        }
        else {
            return {
                quotingFunctions: shell_quoting_1.BashQuotingFunctions,
                execArgs: ['-l', '-c']
            };
        }
    }
    getOsSpecificCommand(taskConfig) {
        // on windows, windows-specific options, if available, take precedence
        if (core_1.isWindows && taskConfig.windows !== undefined) {
            return this.getSystemSpecificCommand(taskConfig, 'windows');
        }
        else if (core_1.isOSX && taskConfig.osx !== undefined) { // on macOS, mac-specific options, if available, take precedence
            return this.getSystemSpecificCommand(taskConfig, 'osx');
        }
        else if (!core_1.isWindows && !core_1.isOSX && taskConfig.linux !== undefined) { // on linux, linux-specific options, if available, take precedence
            return this.getSystemSpecificCommand(taskConfig, 'linux');
        }
        else { // system-specific options are unavailable, use the default
            return this.getSystemSpecificCommand(taskConfig, undefined);
        }
    }
    getCommand(processType, terminalProcessOptions) {
        if (terminalProcessOptions.args) {
            if (processType === 'shell') {
                return terminalProcessOptions.args[terminalProcessOptions.args.length - 1];
            }
            else if (processType === 'process') {
                return `${terminalProcessOptions.command} ${terminalProcessOptions.args.join(' ')}`;
            }
        }
    }
    /**
     * This is task specific, to align with VS Code's behavior.
     *
     * When parsing arguments, VS Code will try to detect if the user already
     * tried to quote things.
     *
     * See: https://github.com/microsoft/vscode/blob/d363b988e1e58cf49963841c498681cdc6cb55a3/src/vs/workbench/contrib/tasks/browser/terminalTaskSystem.ts#L1101-L1127
     *
     * @param value
     * @param shellQuotingOptions
     */
    argumentNeedsQuotes(value, shellQuotingOptions) {
        const { characters } = shellQuotingOptions;
        const needQuotes = new Set([' ', ...characters.needQuotes || []]);
        if (!characters) {
            return false;
        }
        if (value.length >= 2) {
            const first = value[0] === characters.strong ? characters.strong : value[0] === characters.weak ? characters.weak : undefined;
            if (first === value[value.length - 1]) {
                return false;
            }
        }
        let quote;
        for (let i = 0; i < value.length; i++) {
            // We found the end quote.
            const ch = value[i];
            if (ch === quote) {
                quote = undefined;
            }
            else if (quote !== undefined) {
                // skip the character. We are quoted.
                continue;
            }
            else if (ch === characters.escape) {
                // Skip the next character
                i++;
            }
            else if (ch === characters.strong || ch === characters.weak) {
                quote = ch;
            }
            else if (needQuotes.has(ch)) {
                return true;
            }
        }
        return false;
    }
    getSystemSpecificCommand(taskConfig, system) {
        // initialize with default values from the `taskConfig`
        let command = taskConfig.command;
        let args = taskConfig.args;
        let options = (0, core_1.deepClone)(taskConfig.options) || {};
        if (system) {
            if (taskConfig[system].command) {
                command = taskConfig[system].command;
            }
            if (taskConfig[system].args) {
                args = taskConfig[system].args;
            }
            if (taskConfig[system].options) {
                options = taskConfig[system].options;
            }
        }
        if (options.cwd) {
            options.cwd = this.asFsPath(options.cwd);
        }
        if (command === undefined) {
            throw new Error('The `command` field of a task cannot be undefined.');
        }
        return { command, args, options };
    }
    asFsPath(uriOrPath) {
        return (uriOrPath.startsWith('file:'))
            ? node_1.FileUri.fsPath(uriOrPath)
            : uriOrPath;
    }
    /**
     * @deprecated
     *
     * Remove ProcessTaskRunner.findCommand, introduce process "started" event
     * Checks for the existence of a file, at the provided path, and make sure that
     * it's readable and executable.
     */
    async executableFileExists(filePath) {
        return new Promise(async (resolve, reject) => {
            fs.access(filePath, fs.constants.F_OK | fs.constants.X_OK, err => {
                resolve(err ? false : true);
            });
        });
    }
};
__decorate([
    (0, inversify_1.inject)(core_1.ILogger),
    (0, inversify_1.named)('task'),
    __metadata("design:type", Object)
], ProcessTaskRunner.prototype, "logger", void 0);
__decorate([
    (0, inversify_1.inject)(node_2.RawProcessFactory),
    __metadata("design:type", Function)
], ProcessTaskRunner.prototype, "rawProcessFactory", void 0);
__decorate([
    (0, inversify_1.inject)(node_2.TaskTerminalProcessFactory),
    __metadata("design:type", Function)
], ProcessTaskRunner.prototype, "taskTerminalProcessFactory", void 0);
__decorate([
    (0, inversify_1.inject)(process_task_1.TaskFactory),
    __metadata("design:type", Function)
], ProcessTaskRunner.prototype, "taskFactory", void 0);
ProcessTaskRunner = __decorate([
    (0, inversify_1.injectable)()
], ProcessTaskRunner);
exports.ProcessTaskRunner = ProcessTaskRunner;
//# sourceMappingURL=process-task-runner.js.map