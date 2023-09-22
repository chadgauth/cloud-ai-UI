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
exports.MetricsFrontendApplicationContribution = void 0;
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
const coreutils_1 = require("@theia/core/shared/@phosphor/coreutils");
const common_1 = require("../common");
let MetricsFrontendApplicationContribution = class MetricsFrontendApplicationContribution {
    constructor() {
        this.id = coreutils_1.UUID.uuid4();
    }
    initialize() {
        this.doInitialize();
    }
    async doInitialize() {
        const logLevel = await this.logger.getLogLevel();
        if (logLevel !== core_1.LogLevel.DEBUG) {
            return;
        }
        this.stopwatch.storedMeasurements.forEach(result => this.notify(result));
        this.stopwatch.onDidAddMeasurementResult(result => this.notify(result));
    }
    notify(result) {
        this.notificationService.onFrontendMeasurement(this.id, result);
    }
};
__decorate([
    (0, inversify_1.inject)(core_1.Stopwatch),
    __metadata("design:type", core_1.Stopwatch)
], MetricsFrontendApplicationContribution.prototype, "stopwatch", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.MeasurementNotificationService),
    __metadata("design:type", Object)
], MetricsFrontendApplicationContribution.prototype, "notificationService", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.ILogger),
    __metadata("design:type", Object)
], MetricsFrontendApplicationContribution.prototype, "logger", void 0);
MetricsFrontendApplicationContribution = __decorate([
    (0, inversify_1.injectable)()
], MetricsFrontendApplicationContribution);
exports.MetricsFrontendApplicationContribution = MetricsFrontendApplicationContribution;
//# sourceMappingURL=metrics-frontend-application-contribution.js.map