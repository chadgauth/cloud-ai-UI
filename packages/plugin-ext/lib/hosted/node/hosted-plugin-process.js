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
exports.HostedPluginProcess = exports.HostedPluginProcessConfiguration = void 0;
const common_1 = require("@theia/core/lib/common");
const promise_util_1 = require("@theia/core/lib/common/promise-util");
const ipc_protocol_1 = require("@theia/core/lib/node/messaging/ipc-protocol");
const inversify_1 = require("@theia/core/shared/inversify");
const cp = require("child_process");
const hosted_plugin_cli_contribution_1 = require("./hosted-plugin-cli-contribution");
const hosted_plugin_localization_service_1 = require("./hosted-plugin-localization-service");
const hosted_plugin_protocol_1 = require("./hosted-plugin-protocol");
const binary_message_pipe_1 = require("@theia/core/lib/node/messaging/binary-message-pipe");
const plugin_protocol_1 = require("../../common/plugin-protocol");
const psTree = require("ps-tree");
exports.HostedPluginProcessConfiguration = Symbol('HostedPluginProcessConfiguration');
let HostedPluginProcess = class HostedPluginProcess {
    constructor() {
        this.terminatingPluginServer = false;
        this.HOSTED_PLUGIN_ENV_REGEXP_EXCLUSION = new RegExp('HOSTED_PLUGIN*');
    }
    setClient(client) {
        if (this.client) {
            if (this.childProcess) {
                this.runPluginServer();
            }
        }
        this.client = client;
    }
    clientClosed() {
    }
    setDefault(defaultRunner) {
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    acceptMessage(pluginHostId, message) {
        return pluginHostId === 'main';
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onMessage(pluginHostId, message) {
        if (this.messagePipe) {
            this.messagePipe.send(message);
        }
    }
    async terminatePluginServer() {
        if (this.childProcess === undefined) {
            return;
        }
        this.terminatingPluginServer = true;
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const cp = this.childProcess;
        this.childProcess = undefined;
        const waitForTerminated = new promise_util_1.Deferred();
        cp.on('message', message => {
            const msg = JSON.parse(message);
            if (hosted_plugin_protocol_1.ProcessTerminatedMessage.is(msg)) {
                waitForTerminated.resolve();
            }
        });
        const stopTimeout = this.cli.pluginHostStopTimeout;
        cp.send(JSON.stringify({ type: hosted_plugin_protocol_1.ProcessTerminateMessage.TYPE, stopTimeout }));
        const terminateTimeout = this.cli.pluginHostTerminateTimeout;
        if (terminateTimeout) {
            await Promise.race([
                waitForTerminated.promise,
                new Promise(resolve => setTimeout(resolve, terminateTimeout))
            ]);
        }
        else {
            await waitForTerminated.promise;
        }
        this.killProcessTree(cp.pid);
    }
    killProcessTree(parentPid) {
        psTree(parentPid, (_, childProcesses) => {
            childProcesses.forEach(childProcess => this.killProcess(parseInt(childProcess.PID)));
            this.killProcess(parentPid);
        });
    }
    killProcess(pid) {
        try {
            process.kill(pid);
        }
        catch (e) {
            if (e && 'code' in e && e.code === 'ESRCH') {
                return;
            }
            this.logger.error(`[${pid}] failed to kill`, e);
        }
    }
    runPluginServer() {
        if (this.childProcess) {
            this.terminatePluginServer();
        }
        this.terminatingPluginServer = false;
        this.childProcess = this.fork({
            serverName: 'hosted-plugin',
            logger: this.logger,
            args: []
        });
        this.messagePipe = new binary_message_pipe_1.BinaryMessagePipe(this.childProcess.stdio[4]);
        this.messagePipe.onMessage(buffer => {
            if (this.client) {
                this.client.postMessage(plugin_protocol_1.PLUGIN_HOST_BACKEND, buffer);
            }
        });
    }
    fork(options) {
        // create env and add PATH to it so any executable from root process is available
        const env = (0, ipc_protocol_1.createIpcEnv)({ env: process.env });
        for (const key of Object.keys(env)) {
            if (this.HOSTED_PLUGIN_ENV_REGEXP_EXCLUSION.test(key)) {
                delete env[key];
            }
        }
        env['VSCODE_NLS_CONFIG'] = JSON.stringify(this.localizationService.getNlsConfig());
        // apply external env variables
        this.pluginHostEnvironmentVariables.getContributions().forEach(envVar => envVar.process(env));
        if (this.cli.extensionTestsPath) {
            env.extensionTestsPath = this.cli.extensionTestsPath;
        }
        const forkOptions = {
            silent: true,
            env: env,
            execArgv: [],
            // 5th element MUST be 'overlapped' for it to work properly on Windows.
            // 'overlapped' works just like 'pipe' on non-Windows platforms.
            // See: https://nodejs.org/docs/latest-v14.x/api/child_process.html#child_process_options_stdio
            // Note: For some reason `@types/node` does not know about 'overlapped'.
            stdio: ['pipe', 'pipe', 'pipe', 'ipc', 'overlapped']
        };
        const inspectArgPrefix = `--${options.serverName}-inspect`;
        const inspectArg = process.argv.find(v => v.startsWith(inspectArgPrefix));
        if (inspectArg !== undefined) {
            forkOptions.execArgv = ['--nolazy', `--inspect${inspectArg.substring(inspectArgPrefix.length)}`];
        }
        const childProcess = cp.fork(this.configuration.path, options.args, forkOptions);
        childProcess.stdout.on('data', data => this.logger.info(`[${options.serverName}: ${childProcess.pid}] ${data.toString().trim()}`));
        childProcess.stderr.on('data', data => this.logger.error(`[${options.serverName}: ${childProcess.pid}] ${data.toString().trim()}`));
        this.logger.debug(`[${options.serverName}: ${childProcess.pid}] IPC started`);
        childProcess.once('exit', (code, signal) => this.onChildProcessExit(options.serverName, childProcess.pid, code, signal));
        childProcess.on('error', err => this.onChildProcessError(err));
        return childProcess;
    }
    onChildProcessExit(serverName, pid, code, signal) {
        if (this.terminatingPluginServer) {
            return;
        }
        this.logger.error(`[${serverName}: ${pid}] IPC exited, with signal: ${signal}, and exit code: ${code}`);
        const message = 'Plugin runtime crashed unexpectedly, all plugins are not working, please reload the page.';
        let hintMessage = 'If it doesn\'t help, please check Theia server logs.';
        if (signal && signal.toUpperCase() === 'SIGKILL') {
            // May happen in case of OOM or manual force stop.
            hintMessage = 'Probably there is not enough memory for the plugins. ' + hintMessage;
        }
        this.messageService.error(message + ' ' + hintMessage, { timeout: 15 * 60 * 1000 });
    }
    onChildProcessError(err) {
        this.logger.error(`Error from plugin host: ${err.message}`);
    }
    /**
     * Provides additional plugin ids.
     */
    async getExtraDeployedPluginIds() {
        return [];
    }
    /**
     * Provides additional deployed plugins.
     */
    async getExtraDeployedPlugins() {
        return [];
    }
};
__decorate([
    (0, inversify_1.inject)(exports.HostedPluginProcessConfiguration),
    __metadata("design:type", Object)
], HostedPluginProcess.prototype, "configuration", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.ILogger),
    __metadata("design:type", Object)
], HostedPluginProcess.prototype, "logger", void 0);
__decorate([
    (0, inversify_1.inject)(hosted_plugin_cli_contribution_1.HostedPluginCliContribution),
    __metadata("design:type", hosted_plugin_cli_contribution_1.HostedPluginCliContribution)
], HostedPluginProcess.prototype, "cli", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.ContributionProvider),
    (0, inversify_1.named)(plugin_protocol_1.PluginHostEnvironmentVariable),
    __metadata("design:type", Object)
], HostedPluginProcess.prototype, "pluginHostEnvironmentVariables", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.MessageService),
    __metadata("design:type", common_1.MessageService)
], HostedPluginProcess.prototype, "messageService", void 0);
__decorate([
    (0, inversify_1.inject)(hosted_plugin_localization_service_1.HostedPluginLocalizationService),
    __metadata("design:type", hosted_plugin_localization_service_1.HostedPluginLocalizationService)
], HostedPluginProcess.prototype, "localizationService", void 0);
HostedPluginProcess = __decorate([
    (0, inversify_1.injectable)()
], HostedPluginProcess);
exports.HostedPluginProcess = HostedPluginProcess;
//# sourceMappingURL=hosted-plugin-process.js.map