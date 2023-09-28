"use strict";
// *****************************************************************************
// Copyright (C) 2022 Arm and others.
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
exports.NodeDebugAdapterCreator = void 0;
const plugin_debug_adapter_creator_1 = require("../../debug/plugin-debug-adapter-creator");
const path = require("path");
const os_1 = require("@theia/core/lib/common/os");
const net = require("net");
const child_process_1 = require("child_process");
const types_impl_1 = require("../../types-impl");
const stream_debug_adapter_1 = require("@theia/debug/lib/node/stream-debug-adapter");
const isElectron = require('is-electron');
class NodeDebugAdapterCreator extends plugin_debug_adapter_creator_1.PluginDebugAdapterCreator {
    async resolveDebugAdapterExecutable(pluginPath, debuggerContribution) {
        const info = this.toPlatformInfo(debuggerContribution);
        let program = (info && info.program || debuggerContribution.program);
        if (!program) {
            return undefined;
        }
        program = path.join(pluginPath, program);
        const programArgs = info && info.args || debuggerContribution.args || [];
        let runtime = info && info.runtime || debuggerContribution.runtime;
        if (runtime && runtime.indexOf('./') === 0) {
            runtime = path.join(pluginPath, runtime);
        }
        const runtimeArgs = info && info.runtimeArgs || debuggerContribution.runtimeArgs || [];
        const command = runtime ? runtime : program;
        const args = runtime ? [...runtimeArgs, program, ...programArgs] : programArgs;
        return {
            command,
            args
        };
    }
    async createDebugAdapter(session, debugConfiguration, executable, descriptorFactory) {
        if (descriptorFactory) {
            // 'createDebugAdapterDescriptor' is called at the start of a debug session to provide details about the debug adapter to use.
            // These details must be returned as objects of type [DebugAdapterDescriptor](#DebugAdapterDescriptor).
            // Currently two types of debug adapters are supported:
            // - a debug adapter executable is specified as a command path and arguments (see [DebugAdapterExecutable](#DebugAdapterExecutable)),
            // - a debug adapter server reachable via a communication port (see [DebugAdapterServer](#DebugAdapterServer)).
            // If the method is not implemented the default behavior is this:
            //   createDebugAdapter(session: DebugSession, executable: DebugAdapterExecutable) {
            //      if (typeof session.configuration.debugServer === 'number') {
            //         return new DebugAdapterServer(session.configuration.debugServer);
            //      }
            //      return executable;
            //   }
            //  @param session The [debug session](#DebugSession) for which the debug adapter will be used.
            //  @param executable The debug adapter's executable information as specified in the package.json (or undefined if no such information exists).
            const descriptor = await descriptorFactory.createDebugAdapterDescriptor(session, executable);
            if (descriptor) {
                if (types_impl_1.DebugAdapterServer.is(descriptor)) {
                    return this.connectSocketDebugAdapter(descriptor);
                }
                else if (types_impl_1.DebugAdapterExecutable.is(descriptor)) {
                    return this.startDebugAdapter(descriptor);
                }
                else if (types_impl_1.DebugAdapterNamedPipeServer.is(descriptor)) {
                    return this.connectPipeDebugAdapter(descriptor);
                }
                else if (types_impl_1.DebugAdapterInlineImplementation.is(descriptor)) {
                    return this.connectInlineDebugAdapter(descriptor);
                }
            }
        }
        if ('debugServer' in debugConfiguration) {
            return this.connectSocketDebugAdapter({ port: debugConfiguration.debugServer });
        }
        else {
            if (!executable) {
                throw new Error('It is not possible to provide debug adapter executable.');
            }
            return this.startDebugAdapter(executable);
        }
    }
    toPlatformInfo(executable) {
        if (os_1.isWindows && !process.env.hasOwnProperty('PROCESSOR_ARCHITEW6432')) {
            return executable.winx86 || executable.win || executable.windows;
        }
        if (os_1.isWindows) {
            return executable.win || executable.windows;
        }
        if (os_1.isOSX) {
            return executable.osx;
        }
        return executable.linux;
    }
    startDebugAdapter(executable) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const options = { stdio: ['pipe', 'pipe', 2] };
        if (executable.options) {
            options.cwd = executable.options.cwd;
            // The additional environment of the executed program or shell. If omitted
            // the parent process' environment is used. If provided it is merged with
            // the parent process' environment.
            options.env = Object.assign({}, process.env);
            Object.assign(options.env, executable.options.env);
        }
        let childProcess;
        const { command, args } = executable;
        if (command === 'node') {
            if (Array.isArray(args) && args.length > 0) {
                const forkOptions = {
                    env: options.env,
                    // When running in Electron, fork will automatically add ELECTRON_RUN_AS_NODE=1 to the env,
                    // but this will cause issues when debugging Electron apps, so we'll remove it.
                    execArgv: isElectron()
                        ? ['-e', 'delete process.env.ELECTRON_RUN_AS_NODE;require(process.argv[1])']
                        : [],
                    silent: true
                };
                if (options.cwd) {
                    forkOptions.cwd = options.cwd;
                }
                options.stdio.push('ipc');
                forkOptions.stdio = options.stdio;
                childProcess = (0, child_process_1.fork)(args[0], args.slice(1), forkOptions);
            }
            else {
                throw new Error(`It is not possible to launch debug adapter with the command: ${JSON.stringify(executable)}`);
            }
        }
        else {
            childProcess = (0, child_process_1.spawn)(command, args, options);
        }
        return new stream_debug_adapter_1.ProcessDebugAdapter(childProcess);
    }
    /**
     * Connects to a remote debug server.
     */
    connectSocketDebugAdapter(server) {
        const socket = net.createConnection(server.port, server.host);
        return new stream_debug_adapter_1.SocketDebugAdapter(socket);
    }
    connectPipeDebugAdapter(adapter) {
        const socket = net.createConnection(adapter.path);
        return new stream_debug_adapter_1.SocketDebugAdapter(socket);
    }
}
exports.NodeDebugAdapterCreator = NodeDebugAdapterCreator;
//# sourceMappingURL=plugin-node-debug-adapter-creator.js.map