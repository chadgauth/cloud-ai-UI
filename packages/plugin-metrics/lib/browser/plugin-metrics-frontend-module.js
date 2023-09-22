"use strict";
// *****************************************************************************
// Copyright (C) 2019 Red Hat and others.
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
const inversify_1 = require("@theia/core/shared/inversify");
const plugin_metrics_languages_main_1 = require("./plugin-metrics-languages-main");
const metrics_protocol_1 = require("../common/metrics-protocol");
const ws_connection_provider_1 = require("@theia/core/lib/browser/messaging/ws-connection-provider");
const plugin_metrics_creator_1 = require("./plugin-metrics-creator");
const plugin_metrics_resolver_1 = require("./plugin-metrics-resolver");
const plugin_metrics_output_registry_1 = require("./plugin-metrics-output-registry");
const languages_main_1 = require("@theia/plugin-ext/lib/main/browser/languages-main");
const output_channel_registry_main_1 = require("@theia/plugin-ext/lib/main/browser/output-channel-registry-main");
exports.default = new inversify_1.ContainerModule((bind, unbind, isBound, rebind) => {
    bind(plugin_metrics_resolver_1.PluginMetricsResolver).toSelf().inSingletonScope();
    bind(plugin_metrics_creator_1.PluginMetricsCreator).toSelf().inSingletonScope();
    rebind(languages_main_1.LanguagesMainImpl).to(plugin_metrics_languages_main_1.LanguagesMainPluginMetrics).inTransientScope();
    rebind(output_channel_registry_main_1.OutputChannelRegistryMainImpl).to(plugin_metrics_output_registry_1.PluginMetricsOutputChannelRegistry).inTransientScope();
    bind(metrics_protocol_1.PluginMetrics).toDynamicValue(ctx => {
        const connection = ctx.container.get(ws_connection_provider_1.WebSocketConnectionProvider);
        return connection.createProxy(metrics_protocol_1.metricsJsonRpcPath);
    }).inSingletonScope();
});
//# sourceMappingURL=plugin-metrics-frontend-module.js.map