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
exports.PluginMetricsResolver = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const inversify_1 = require("@theia/core/shared/inversify");
const plugin_metrics_creator_1 = require("./plugin-metrics-creator");
const plugin_metrics_types_1 = require("../common/plugin-metrics-types");
/**
 * This class helps resolve language server requests into successes or failures
 * and sends the data to the metricsExtractor
 */
let PluginMetricsResolver = class PluginMetricsResolver {
    /**
     * Resolve a request for pluginID and create a metric based on whether or not
     * the language server errored.
     *
     * @param pluginID the ID of the plugin that made the request
     * @param method  the method that was request
     * @param request the result of the language server request
     */
    async resolveRequest(pluginID, method, request) {
        const currentTime = performance.now();
        try {
            const value = await request;
            this.createAndSetMetric(pluginID, method, performance.now() - currentTime, true);
            return value;
        }
        catch (error) {
            this.createAndSetMetric(pluginID, method, performance.now() - currentTime, false);
            return Promise.reject(error);
        }
    }
    createAndSetMetric(pluginID, method, time, successful) {
        const createdSuccessMetric = (0, plugin_metrics_types_1.createRequestData)(pluginID, method, time);
        this.metricsCreator.createMetric(createdSuccessMetric, successful);
    }
};
__decorate([
    (0, inversify_1.inject)(plugin_metrics_creator_1.PluginMetricsCreator),
    __metadata("design:type", plugin_metrics_creator_1.PluginMetricsCreator)
], PluginMetricsResolver.prototype, "metricsCreator", void 0);
PluginMetricsResolver = __decorate([
    (0, inversify_1.injectable)()
], PluginMetricsResolver);
exports.PluginMetricsResolver = PluginMetricsResolver;
//# sourceMappingURL=plugin-metrics-resolver.js.map