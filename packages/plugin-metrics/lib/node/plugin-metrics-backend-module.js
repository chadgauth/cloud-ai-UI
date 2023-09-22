"use strict";
// *****************************************************************************
// Copyright (C) 2019 Red Hat, Inc. and others.
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
const metrics_contribution_1 = require("@theia/metrics/lib/node/metrics-contribution");
const plugin_metrics_1 = require("./plugin-metrics");
const metrics_protocol_1 = require("../common/metrics-protocol");
const plugin_metrics_impl_1 = require("./plugin-metrics-impl");
const handler_1 = require("@theia/core/lib/common/messaging/handler");
const core_1 = require("@theia/core");
const inversify_1 = require("@theia/core/shared/inversify");
const metrics_contributor_1 = require("./metrics-contributor");
const plugin_metrics_time_sum_1 = require("./metric-output/plugin-metrics-time-sum");
const plugin_metrics_time_count_1 = require("./metric-output/plugin-metrics-time-count");
const metric_string_generator_1 = require("./metric-string-generator");
exports.default = new inversify_1.ContainerModule((bind, unbind, isBound, rebind) => {
    bind(plugin_metrics_time_sum_1.PluginMetricTimeSum).toSelf().inSingletonScope();
    bind(plugin_metrics_time_count_1.PluginMetricTimeCount).toSelf().inSingletonScope();
    bind(metrics_protocol_1.PluginMetrics).to(plugin_metrics_impl_1.PluginMetricsImpl).inTransientScope();
    bind(metric_string_generator_1.PluginMetricStringGenerator).toSelf().inSingletonScope();
    bind(metrics_contributor_1.PluginMetricsContributor).toSelf().inSingletonScope();
    bind(handler_1.ConnectionHandler).toDynamicValue(ctx => {
        const clients = ctx.container.get(metrics_contributor_1.PluginMetricsContributor);
        return new core_1.RpcConnectionHandler(metrics_protocol_1.metricsJsonRpcPath, client => {
            const pluginMetricsHandler = ctx.container.get(metrics_protocol_1.PluginMetrics);
            clients.clients.add(pluginMetricsHandler);
            client.onDidCloseConnection(() => {
                clients.clients.delete(pluginMetricsHandler);
            });
            return pluginMetricsHandler;
        });
    }).inSingletonScope();
    bind(metrics_contribution_1.MetricsContribution).to(plugin_metrics_1.PluginMetricsContribution).inSingletonScope();
});
//# sourceMappingURL=plugin-metrics-backend-module.js.map