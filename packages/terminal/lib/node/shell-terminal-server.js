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
exports.ShellTerminalServer = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const logger_1 = require("@theia/core/lib/common/logger");
const environment_utils_1 = require("@theia/core/lib/node/environment-utils");
const base_terminal_server_1 = require("./base-terminal-server");
const shell_process_1 = require("./shell-process");
const node_1 = require("@theia/process/lib/node");
const os_1 = require("@theia/core/lib/common/os");
const cp = require("child_process");
let ShellTerminalServer = class ShellTerminalServer extends base_terminal_server_1.BaseTerminalServer {
    constructor(shellFactory, processManager, logger) {
        super(processManager, logger);
        this.shellFactory = shellFactory;
    }
    async create(options) {
        try {
            if (options.strictEnv !== true) {
                options.env = this.environmentUtils.mergeProcessEnv(options.env);
                this.mergedCollection.applyToProcessEnvironment(options.env);
            }
            const term = this.shellFactory(options);
            this.postCreate(term);
            return term.id;
        }
        catch (error) {
            this.logger.error('Error while creating terminal', error);
            return -1;
        }
    }
    // copied and modified from https://github.com/microsoft/vscode/blob/4636be2b71c87bfb0bfe3c94278b447a5efcc1f1/src/vs/workbench/contrib/debug/node/terminals.ts#L32-L75
    spawnAsPromised(command, args) {
        return new Promise((resolve, reject) => {
            let stdout = '';
            const child = cp.spawn(command, args);
            if (child.pid) {
                child.stdout.on('data', (data) => {
                    stdout += data.toString();
                });
            }
            child.on('error', err => {
                reject(err);
            });
            child.on('close', code => {
                resolve(stdout);
            });
        });
    }
    hasChildProcesses(processId) {
        if (processId) {
            // if shell has at least one child process, assume that shell is busy
            if (os_1.isWindows) {
                return this.spawnAsPromised('wmic', ['process', 'get', 'ParentProcessId']).then(stdout => {
                    const pids = stdout.split('\r\n');
                    return pids.some(p => parseInt(p) === processId);
                }, error => true);
            }
            else {
                return this.spawnAsPromised('/usr/bin/pgrep', ['-lP', String(processId)]).then(stdout => {
                    const r = stdout.trim();
                    if (r.length === 0 || r.indexOf(' tmux') >= 0) { // ignore 'tmux';
                        return false;
                    }
                    else {
                        return true;
                    }
                }, error => true);
            }
        }
        // fall back to safe side
        return Promise.resolve(true);
    }
};
__decorate([
    (0, inversify_1.inject)(environment_utils_1.EnvironmentUtils),
    __metadata("design:type", environment_utils_1.EnvironmentUtils)
], ShellTerminalServer.prototype, "environmentUtils", void 0);
ShellTerminalServer = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(shell_process_1.ShellProcessFactory)),
    __param(1, (0, inversify_1.inject)(node_1.ProcessManager)),
    __param(2, (0, inversify_1.inject)(logger_1.ILogger)),
    __param(2, (0, inversify_1.named)('terminal')),
    __metadata("design:paramtypes", [Function, node_1.ProcessManager, Object])
], ShellTerminalServer);
exports.ShellTerminalServer = ShellTerminalServer;
//# sourceMappingURL=shell-terminal-server.js.map