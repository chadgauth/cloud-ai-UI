"use strict";
// *****************************************************************************
// Copyright (C) 2017 TypeFox and others.
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
exports.spawnNsfwFileSystemWatcherServiceProcess = exports.createNsfwFileSystemWatcherService = exports.bindFileSystemWatcherServer = exports.NsfwFileSystemWatcherServiceProcessOptions = exports.NSFW_WATCHER_VERBOSE = exports.NSFW_SINGLE_THREADED = void 0;
const path = require("path");
const inversify_1 = require("@theia/core/shared/inversify");
const common_1 = require("@theia/core/lib/common");
const filesystem_watcher_protocol_1 = require("../common/filesystem-watcher-protocol");
const filesystem_watcher_client_1 = require("./filesystem-watcher-client");
const nsfw_filesystem_service_1 = require("./nsfw-watcher/nsfw-filesystem-service");
const node_file_upload_service_1 = require("./node-file-upload-service");
const nsfw_options_1 = require("./nsfw-watcher/nsfw-options");
const disk_file_system_provider_1 = require("./disk-file-system-provider");
const remote_file_system_provider_1 = require("../common/remote-file-system-provider");
const files_1 = require("../common/files");
const encoding_service_1 = require("@theia/core/lib/common/encoding-service");
const node_1 = require("@theia/core/lib/node");
const core_1 = require("@theia/core");
const filesystem_watcher_dispatcher_1 = require("./filesystem-watcher-dispatcher");
exports.NSFW_SINGLE_THREADED = process.argv.includes('--no-cluster');
exports.NSFW_WATCHER_VERBOSE = process.argv.includes('--nsfw-watcher-verbose');
exports.NsfwFileSystemWatcherServiceProcessOptions = Symbol('NsfwFileSystemWatcherServiceProcessOptions');
exports.default = new inversify_1.ContainerModule(bind => {
    bind(encoding_service_1.EncodingService).toSelf().inSingletonScope();
    bindFileSystemWatcherServer(bind);
    bind(disk_file_system_provider_1.DiskFileSystemProvider).toSelf();
    bind(files_1.FileSystemProvider).toService(disk_file_system_provider_1.DiskFileSystemProvider);
    bind(remote_file_system_provider_1.FileSystemProviderServer).toSelf();
    bind(remote_file_system_provider_1.RemoteFileSystemServer).toService(remote_file_system_provider_1.FileSystemProviderServer);
    bind(common_1.ConnectionHandler).toDynamicValue(ctx => new common_1.RpcConnectionHandler(remote_file_system_provider_1.remoteFileSystemPath, client => {
        const server = ctx.container.get(remote_file_system_provider_1.RemoteFileSystemServer);
        server.setClient(client);
        client.onDidCloseConnection(() => server.dispose());
        return server;
    }, remote_file_system_provider_1.RemoteFileSystemProxyFactory)).inSingletonScope();
    bind(node_file_upload_service_1.NodeFileUploadService).toSelf().inSingletonScope();
    bind(node_1.BackendApplicationContribution).toService(node_file_upload_service_1.NodeFileUploadService);
});
function bindFileSystemWatcherServer(bind) {
    bind(nsfw_options_1.NsfwOptions).toConstantValue({});
    bind(filesystem_watcher_dispatcher_1.FileSystemWatcherServiceDispatcher).toSelf().inSingletonScope();
    bind(filesystem_watcher_client_1.FileSystemWatcherServerClient).toSelf();
    bind(filesystem_watcher_protocol_1.FileSystemWatcherServer).toService(filesystem_watcher_client_1.FileSystemWatcherServerClient);
    bind(exports.NsfwFileSystemWatcherServiceProcessOptions).toDynamicValue(ctx => ({
        entryPoint: path.join(__dirname, 'nsfw-watcher'),
    })).inSingletonScope();
    bind(nsfw_filesystem_service_1.NsfwFileSystemWatcherServerOptions).toDynamicValue(ctx => {
        const logger = ctx.container.get(common_1.ILogger);
        const nsfwOptions = ctx.container.get(nsfw_options_1.NsfwOptions);
        return {
            nsfwOptions,
            verbose: exports.NSFW_WATCHER_VERBOSE,
            info: (message, ...args) => logger.info(message, ...args),
            error: (message, ...args) => logger.error(message, ...args),
        };
    }).inSingletonScope();
    bind(filesystem_watcher_protocol_1.FileSystemWatcherService).toDynamicValue(ctx => exports.NSFW_SINGLE_THREADED
        ? createNsfwFileSystemWatcherService(ctx)
        : spawnNsfwFileSystemWatcherServiceProcess(ctx)).inSingletonScope();
}
exports.bindFileSystemWatcherServer = bindFileSystemWatcherServer;
/**
 * Run the watch server in the current process.
 */
function createNsfwFileSystemWatcherService(ctx) {
    const options = ctx.container.get(nsfw_filesystem_service_1.NsfwFileSystemWatcherServerOptions);
    const dispatcher = ctx.container.get(filesystem_watcher_dispatcher_1.FileSystemWatcherServiceDispatcher);
    const server = new nsfw_filesystem_service_1.NsfwFileSystemWatcherService(options);
    server.setClient(dispatcher);
    return server;
}
exports.createNsfwFileSystemWatcherService = createNsfwFileSystemWatcherService;
/**
 * Run the watch server in a child process.
 * Return a proxy forwarding calls to the child process.
 */
function spawnNsfwFileSystemWatcherServiceProcess(ctx) {
    const options = ctx.container.get(exports.NsfwFileSystemWatcherServiceProcessOptions);
    const dispatcher = ctx.container.get(filesystem_watcher_dispatcher_1.FileSystemWatcherServiceDispatcher);
    const serverName = 'nsfw-watcher';
    const logger = ctx.container.get(common_1.ILogger);
    const nsfwOptions = ctx.container.get(nsfw_options_1.NsfwOptions);
    const ipcConnectionProvider = ctx.container.get(node_1.IPCConnectionProvider);
    const proxyFactory = new core_1.RpcProxyFactory();
    const serverProxy = proxyFactory.createProxy();
    // We need to call `.setClient` before listening, else the JSON-RPC calls won't go through.
    serverProxy.setClient(dispatcher);
    const args = [
        `--nsfwOptions=${JSON.stringify(nsfwOptions)}`
    ];
    if (exports.NSFW_WATCHER_VERBOSE) {
        args.push('--verbose');
    }
    ipcConnectionProvider.listen({
        serverName,
        entryPoint: options.entryPoint,
        errorHandler: new core_1.ConnectionErrorHandler({
            serverName,
            logger,
        }),
        env: process.env,
        args,
    }, connection => proxyFactory.listen(connection));
    return serverProxy;
}
exports.spawnNsfwFileSystemWatcherServiceProcess = spawnNsfwFileSystemWatcherServiceProcess;
//# sourceMappingURL=filesystem-backend-module.js.map