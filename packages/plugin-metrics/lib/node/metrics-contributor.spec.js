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
const metrics_contributor_1 = require("./metrics-contributor");
const inversify_1 = require("@theia/core/shared/inversify");
const plugin_metrics_impl_1 = require("./plugin-metrics-impl");
const metrics_protocol_1 = require("../common/metrics-protocol");
const assert = require("assert");
describe('Metrics contributor:', () => {
    let testContainer;
    before(() => {
        testContainer = new inversify_1.Container();
        const module = new inversify_1.ContainerModule(bind => {
            bind(metrics_protocol_1.PluginMetrics).to(plugin_metrics_impl_1.PluginMetricsImpl).inTransientScope();
            bind(metrics_contributor_1.PluginMetricsContributor).toSelf().inTransientScope();
        });
        testContainer.load(module);
    });
    describe('reconcile:', () => {
        it('Reconcile with one client connected', async () => {
            // given
            const analytics = {
                sumOfTimeForFailure: 0,
                sumOfTimeForSuccess: 5,
                successfulResponses: 10,
                totalRequests: 15
            };
            const metricExtensionID = 'my_test_metric.test_metric';
            const metricMethod = 'textDocument/testMethod';
            const metricsMap = {
                [metricExtensionID]: {
                    [metricMethod]: analytics
                }
            };
            const metricsContributor = testContainer.get(metrics_contributor_1.PluginMetricsContributor);
            const pluginMetrics = testContainer.get(metrics_protocol_1.PluginMetrics);
            pluginMetrics.setMetrics(JSON.stringify(metricsMap));
            metricsContributor.clients.add(pluginMetrics);
            // when
            const reconciledMap = metricsContributor.reconcile();
            // then
            assert.deepStrictEqual(reconciledMap, metricsMap);
        });
        it('Reconcile same extension id and method with two clients connected', async () => {
            // given
            // first client
            const firstClientAnalytics = {
                sumOfTimeForFailure: 0,
                sumOfTimeForSuccess: 5,
                successfulResponses: 10,
                totalRequests: 15
            };
            const firstClientMetricExtensionID = 'my_test_metric.test_metric';
            const firstClientMetricMethod = 'textDocument/testMethod';
            const firstClientMetricsMap = {
                [firstClientMetricExtensionID]: {
                    [firstClientMetricMethod]: firstClientAnalytics
                }
            };
            const secondClientAnalytics = {
                sumOfTimeForFailure: 0,
                sumOfTimeForSuccess: 15,
                successfulResponses: 20,
                totalRequests: 18
            };
            const secondClientMetricsMap = {
                [firstClientMetricExtensionID]: {
                    [firstClientMetricMethod]: secondClientAnalytics
                }
            };
            const metricsContributor = testContainer.get(metrics_contributor_1.PluginMetricsContributor);
            const firstClientPluginMetric = testContainer.get(metrics_protocol_1.PluginMetrics);
            firstClientPluginMetric.setMetrics(JSON.stringify(firstClientMetricsMap));
            metricsContributor.clients.add(firstClientPluginMetric);
            const secondClientPluginMetric = testContainer.get(metrics_protocol_1.PluginMetrics);
            secondClientPluginMetric.setMetrics(JSON.stringify(secondClientMetricsMap));
            metricsContributor.clients.add(secondClientPluginMetric);
            // when
            const reconciledMap = metricsContributor.reconcile();
            // then
            const expectedAnalytics = {
                sumOfTimeForFailure: 0,
                sumOfTimeForSuccess: 20,
                successfulResponses: 30,
                totalRequests: 33
            };
            const expectedMap = {
                [firstClientMetricExtensionID]: {
                    [firstClientMetricMethod]: expectedAnalytics
                }
            };
            assert.deepStrictEqual(reconciledMap, expectedMap);
        });
        it('Reconcile different extension id and method with two clients connected', async () => {
            // given
            // first client
            const firstClientAnalytics = {
                sumOfTimeForFailure: 0,
                sumOfTimeForSuccess: 5,
                successfulResponses: 10,
                totalRequests: 15
            };
            const firstClientMetricExtensionID = 'my_test_metric.test_metric';
            const firstClientMetricMethod = 'textDocument/testMethod';
            const firstClientMetricsMap = {
                [firstClientMetricExtensionID]: {
                    [firstClientMetricMethod]: firstClientAnalytics
                }
            };
            const secondClientAnalytics = {
                sumOfTimeForFailure: 0,
                sumOfTimeForSuccess: 15,
                successfulResponses: 20,
                totalRequests: 18
            };
            const secondClientMetricExtensionID = 'my_other_test_metric.test_metric';
            const secondClientMetricsMap = {
                [secondClientMetricExtensionID]: {
                    [firstClientMetricMethod]: secondClientAnalytics
                }
            };
            const metricsContributor = testContainer.get(metrics_contributor_1.PluginMetricsContributor);
            const firstClientPluginMetric = testContainer.get(metrics_protocol_1.PluginMetrics);
            firstClientPluginMetric.setMetrics(JSON.stringify(firstClientMetricsMap));
            metricsContributor.clients.add(firstClientPluginMetric);
            const secondClientPluginMetric = testContainer.get(metrics_protocol_1.PluginMetrics);
            secondClientPluginMetric.setMetrics(JSON.stringify(secondClientMetricsMap));
            metricsContributor.clients.add(secondClientPluginMetric);
            // when
            const reconciledMap = metricsContributor.reconcile();
            // then
            const expectedMap = {
                [firstClientMetricExtensionID]: {
                    [firstClientMetricMethod]: firstClientAnalytics
                },
                [secondClientMetricExtensionID]: {
                    [firstClientMetricMethod]: secondClientAnalytics
                }
            };
            assert.deepStrictEqual(reconciledMap, expectedMap);
        });
        it('Reconcile same extension id and different method with two clients connected', async () => {
            // given
            // first client
            const firstClientAnalytics = {
                sumOfTimeForFailure: 0,
                sumOfTimeForSuccess: 5,
                successfulResponses: 10,
                totalRequests: 15
            };
            const firstClientMetricExtensionID = 'my_test_metric.test_metric';
            const firstClientMetricMethod = 'textDocument/testMethod';
            const firstClientMetricsMap = {
                [firstClientMetricExtensionID]: {
                    [firstClientMetricMethod]: firstClientAnalytics
                }
            };
            const secondClientAnalytics = {
                sumOfTimeForFailure: 0,
                sumOfTimeForSuccess: 15,
                successfulResponses: 20,
                totalRequests: 18
            };
            const secondClientMetricMethod = 'textDocument/myOthertestMethod';
            const secondClientMetricsMap = {
                [firstClientMetricExtensionID]: {
                    [secondClientMetricMethod]: secondClientAnalytics
                }
            };
            const metricsContributor = testContainer.get(metrics_contributor_1.PluginMetricsContributor);
            const firstClientPluginMetric = testContainer.get(metrics_protocol_1.PluginMetrics);
            firstClientPluginMetric.setMetrics(JSON.stringify(firstClientMetricsMap));
            metricsContributor.clients.add(firstClientPluginMetric);
            const secondClientPluginMetric = testContainer.get(metrics_protocol_1.PluginMetrics);
            secondClientPluginMetric.setMetrics(JSON.stringify(secondClientMetricsMap));
            metricsContributor.clients.add(secondClientPluginMetric);
            // when
            const reconciledMap = metricsContributor.reconcile();
            // then
            const expectedMap = {
                [firstClientMetricExtensionID]: {
                    [firstClientMetricMethod]: firstClientAnalytics,
                    [secondClientMetricMethod]: secondClientAnalytics
                }
            };
            assert.deepStrictEqual(reconciledMap, expectedMap);
        });
    });
});
//# sourceMappingURL=metrics-contributor.spec.js.map