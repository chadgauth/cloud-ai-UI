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
exports.MeasurementMetricsBackendContribution = void 0;
// *****************************************************************************
// Copyright (C) 2023 STMicroelectronics and others.
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
const inversify_1 = require("@theia/core/shared/inversify");
const core_1 = require("@theia/core");
const logger_cli_contribution_1 = require("@theia/core/lib/node/logger-cli-contribution");
const backendId = 'backend';
const metricsName = 'theia_measurements';
let MeasurementMetricsBackendContribution = class MeasurementMetricsBackendContribution {
    constructor() {
        this.metrics = '';
        this.frontendCounters = new Map();
    }
    startCollecting() {
        if (this.logLevelCli.defaultLogLevel !== core_1.LogLevel.DEBUG) {
            return;
        }
        this.metrics += `# HELP ${metricsName} Theia stopwatch measurement results.\n`;
        this.metrics += `# TYPE ${metricsName} gauge\n`;
        this.backendStopwatch.storedMeasurements.forEach(result => this.onBackendMeasurement(result));
        this.backendStopwatch.onDidAddMeasurementResult(result => this.onBackendMeasurement(result));
    }
    getMetrics() {
        return this.metrics;
    }
    appendMetricsValue(id, result) {
        const { name, elapsed, startTime, owner } = result;
        const labels = `id="${id}", name="${name}", startTime="${startTime}", owner="${owner}"`;
        const metricsValue = `${metricsName}{${labels}} ${elapsed}`;
        this.metrics += (metricsValue + '\n');
    }
    onBackendMeasurement(result) {
        this.appendMetricsValue(backendId, result);
    }
    createFrontendCounterId(frontendId) {
        const counterId = `frontend-${this.frontendCounters.size + 1}`;
        this.frontendCounters.set(frontendId, counterId);
        return counterId;
    }
    toCounterId(frontendId) {
        var _a;
        return (_a = this.frontendCounters.get(frontendId)) !== null && _a !== void 0 ? _a : this.createFrontendCounterId(frontendId);
    }
    onFrontendMeasurement(frontendId, result) {
        this.appendMetricsValue(this.toCounterId(frontendId), result);
    }
};
__decorate([
    (0, inversify_1.inject)(core_1.Stopwatch),
    __metadata("design:type", core_1.Stopwatch)
], MeasurementMetricsBackendContribution.prototype, "backendStopwatch", void 0);
__decorate([
    (0, inversify_1.inject)(logger_cli_contribution_1.LogLevelCliContribution),
    __metadata("design:type", logger_cli_contribution_1.LogLevelCliContribution)
], MeasurementMetricsBackendContribution.prototype, "logLevelCli", void 0);
MeasurementMetricsBackendContribution = __decorate([
    (0, inversify_1.injectable)()
], MeasurementMetricsBackendContribution);
exports.MeasurementMetricsBackendContribution = MeasurementMetricsBackendContribution;
//# sourceMappingURL=measurement-metrics-contribution.js.map