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
exports.PluginMetricsContribution = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const metrics_protocol_1 = require("../common/metrics-protocol");
const metrics_contributor_1 = require("./metrics-contributor");
const metric_string_generator_1 = require("./metric-string-generator");
let PluginMetricsContribution = class PluginMetricsContribution {
    getMetrics() {
        return this.metrics;
    }
    startCollecting() {
        setInterval(() => {
            const reconciledMetrics = this.metricsContributor.reconcile();
            this.metrics = this.stringGenerator.getMetricsString(reconciledMetrics);
        }, metrics_protocol_1.METRICS_TIMEOUT);
    }
};
__decorate([
    (0, inversify_1.inject)(metrics_contributor_1.PluginMetricsContributor),
    __metadata("design:type", metrics_contributor_1.PluginMetricsContributor)
], PluginMetricsContribution.prototype, "metricsContributor", void 0);
__decorate([
    (0, inversify_1.inject)(metric_string_generator_1.PluginMetricStringGenerator),
    __metadata("design:type", metric_string_generator_1.PluginMetricStringGenerator)
], PluginMetricsContribution.prototype, "stringGenerator", void 0);
PluginMetricsContribution = __decorate([
    (0, inversify_1.injectable)()
], PluginMetricsContribution);
exports.PluginMetricsContribution = PluginMetricsContribution;
//# sourceMappingURL=plugin-metrics.js.map