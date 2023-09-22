"use strict";
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
exports.PluginMetricStringGenerator = void 0;
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
const plugin_metrics_time_count_1 = require("./metric-output/plugin-metrics-time-count");
const plugin_metrics_time_sum_1 = require("./metric-output/plugin-metrics-time-sum");
const inversify_1 = require("@theia/core/shared/inversify");
let PluginMetricStringGenerator = class PluginMetricStringGenerator {
    getMetricsString(extensionIDAnalytics) {
        if (Object.keys(extensionIDAnalytics).length === 0) {
            return '';
        }
        let metricString = this.pluginMetricsTimeCount.header;
        for (const extensionID in extensionIDAnalytics) {
            if (!extensionIDAnalytics.hasOwnProperty(extensionID)) {
                continue;
            }
            const methodToAnalytic = extensionIDAnalytics[extensionID];
            for (const method in methodToAnalytic) {
                if (!methodToAnalytic.hasOwnProperty(method)) {
                    continue;
                }
                const analytic = methodToAnalytic[method];
                metricString += this.pluginMetricsTimeCount.createMetricOutput(extensionID, method, analytic);
            }
        }
        metricString += this.pluginMetricsTimeSum.header;
        for (const extensionID in extensionIDAnalytics) {
            if (!extensionIDAnalytics.hasOwnProperty(extensionID)) {
                continue;
            }
            const methodToAnalytic = extensionIDAnalytics[extensionID];
            for (const method in methodToAnalytic) {
                if (!methodToAnalytic.hasOwnProperty(method)) {
                    continue;
                }
                const analytic = methodToAnalytic[method];
                metricString += this.pluginMetricsTimeSum.createMetricOutput(extensionID, method, analytic);
            }
        }
        return metricString;
    }
};
__decorate([
    (0, inversify_1.inject)(plugin_metrics_time_count_1.PluginMetricTimeCount),
    __metadata("design:type", plugin_metrics_time_count_1.PluginMetricTimeCount)
], PluginMetricStringGenerator.prototype, "pluginMetricsTimeCount", void 0);
__decorate([
    (0, inversify_1.inject)(plugin_metrics_time_sum_1.PluginMetricTimeSum),
    __metadata("design:type", plugin_metrics_time_sum_1.PluginMetricTimeSum)
], PluginMetricStringGenerator.prototype, "pluginMetricsTimeSum", void 0);
PluginMetricStringGenerator = __decorate([
    (0, inversify_1.injectable)()
], PluginMetricStringGenerator);
exports.PluginMetricStringGenerator = PluginMetricStringGenerator;
//# sourceMappingURL=metric-string-generator.js.map