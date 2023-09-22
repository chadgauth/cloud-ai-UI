"use strict";
// *****************************************************************************
// Copyright (C) 2018-2021 Red Hat, Inc. and others.
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
exports.bindHostedBackend = exports.bindCommonHostedBackend = void 0;
const path = require("path");
const contribution_provider_1 = require("@theia/core/lib/common/contribution-provider");
const cli_1 = require("@theia/core/lib/node/cli");
const connection_container_module_1 = require("@theia/core/lib/node/messaging/connection-container-module");
const backend_application_1 = require("@theia/core/lib/node/backend-application");
const metadata_scanner_1 = require("./metadata-scanner");
const plugin_service_1 = require("./plugin-service");
const plugin_reader_1 = require("./plugin-reader");
const hosted_plugin_1 = require("./hosted-plugin");
const scanner_theia_1 = require("./scanners/scanner-theia");
const plugin_protocol_1 = require("../../common/plugin-protocol");
const grammars_reader_1 = require("./scanners/grammars-reader");
const hosted_plugin_process_1 = require("./hosted-plugin-process");
const plugin_ext_api_contribution_1 = require("../../common/plugin-ext-api-contribution");
const hosted_plugin_cli_contribution_1 = require("./hosted-plugin-cli-contribution");
const hosted_plugin_deployer_handler_1 = require("./hosted-plugin-deployer-handler");
const plugin_uri_factory_1 = require("./scanners/plugin-uri-factory");
const file_plugin_uri_factory_1 = require("./scanners/file-plugin-uri-factory");
const hosted_plugin_localization_service_1 = require("./hosted-plugin-localization-service");
const language_pack_service_1 = require("../../common/language-pack-service");
const plugin_language_pack_service_1 = require("./plugin-language-pack-service");
const proxy_factory_1 = require("@theia/core/lib/common/messaging/proxy-factory");
const handler_1 = require("@theia/core/lib/common/messaging/handler");
const commonHostedConnectionModule = connection_container_module_1.ConnectionContainerModule.create(({ bind, bindBackendService }) => {
    bind(hosted_plugin_process_1.HostedPluginProcess).toSelf().inSingletonScope();
    bind(hosted_plugin_1.HostedPluginSupport).toSelf().inSingletonScope();
    (0, contribution_provider_1.bindContributionProvider)(bind, Symbol.for(plugin_ext_api_contribution_1.ExtPluginApiProvider));
    (0, contribution_provider_1.bindContributionProvider)(bind, plugin_protocol_1.PluginHostEnvironmentVariable);
    bind(plugin_service_1.HostedPluginServerImpl).toSelf().inSingletonScope();
    bind(plugin_protocol_1.HostedPluginServer).toService(plugin_service_1.HostedPluginServerImpl);
    bindBackendService(plugin_protocol_1.hostedServicePath, plugin_protocol_1.HostedPluginServer, (server, client) => {
        server.setClient(client);
        client.onDidCloseConnection(() => server.dispose());
        return server;
    });
});
function bindCommonHostedBackend(bind) {
    bind(hosted_plugin_cli_contribution_1.HostedPluginCliContribution).toSelf().inSingletonScope();
    bind(cli_1.CliContribution).toService(hosted_plugin_cli_contribution_1.HostedPluginCliContribution);
    bind(metadata_scanner_1.MetadataScanner).toSelf().inSingletonScope();
    bind(plugin_reader_1.HostedPluginReader).toSelf().inSingletonScope();
    bind(backend_application_1.BackendApplicationContribution).toService(plugin_reader_1.HostedPluginReader);
    bind(hosted_plugin_localization_service_1.HostedPluginLocalizationService).toSelf().inSingletonScope();
    bind(backend_application_1.BackendApplicationContribution).toService(hosted_plugin_localization_service_1.HostedPluginLocalizationService);
    bind(hosted_plugin_deployer_handler_1.HostedPluginDeployerHandler).toSelf().inSingletonScope();
    bind(plugin_protocol_1.PluginDeployerHandler).toService(hosted_plugin_deployer_handler_1.HostedPluginDeployerHandler);
    bind(plugin_language_pack_service_1.PluginLanguagePackService).toSelf().inSingletonScope();
    bind(language_pack_service_1.LanguagePackService).toService(plugin_language_pack_service_1.PluginLanguagePackService);
    bind(handler_1.ConnectionHandler).toDynamicValue(ctx => new proxy_factory_1.RpcConnectionHandler(language_pack_service_1.languagePackServicePath, () => ctx.container.get(language_pack_service_1.LanguagePackService))).inSingletonScope();
    bind(grammars_reader_1.GrammarsReader).toSelf().inSingletonScope();
    bind(hosted_plugin_process_1.HostedPluginProcessConfiguration).toConstantValue({
        path: path.join(__dirname, 'plugin-host'),
    });
    bind(connection_container_module_1.ConnectionContainerModule).toConstantValue(commonHostedConnectionModule);
    bind(plugin_uri_factory_1.PluginUriFactory).to(file_plugin_uri_factory_1.FilePluginUriFactory).inSingletonScope();
}
exports.bindCommonHostedBackend = bindCommonHostedBackend;
function bindHostedBackend(bind) {
    bindCommonHostedBackend(bind);
    bind(plugin_protocol_1.PluginScanner).to(scanner_theia_1.TheiaPluginScanner).inSingletonScope();
}
exports.bindHostedBackend = bindHostedBackend;
//# sourceMappingURL=plugin-ext-hosted-backend-module.js.map