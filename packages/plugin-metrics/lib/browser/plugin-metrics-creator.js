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
exports.PluginMetricsCreator = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const metrics_protocol_1 = require("../common/metrics-protocol");
const plugin_metrics_types_1 = require("../common/plugin-metrics-types");
let PluginMetricsCreator = class PluginMetricsCreator {
    constructor() {
        this.NODE_BASED_REGEX = /Request(.*?)failed/;
        this.setPluginMetrics();
        this._extensionIDAnalytics = {};
    }
    /**
     * Create an error metric for requestData.pluginID by attempting to extract the erroring
     * language server method from the requestData.errorContentsOrMethod. If it cannot extract the
     * error language server method from requestData.errorContentsOrMethod then it will not
     * create a metric.
     *
     * @param pluginID The id of the plugin
     * @param errorContents The contents that the language server error has produced
     */
    async createErrorMetric(requestData) {
        if (!requestData.pluginID) {
            return;
        }
        const method = this.extractMethodFromValue(requestData.errorContentsOrMethod);
        // only log the metric if we can find the method that it occurred in
        if (method) {
            const createdMetric = (0, plugin_metrics_types_1.createRequestData)(requestData.pluginID, method, requestData.timeTaken);
            this.createMetric(createdMetric, false);
            this.decreaseExtensionRequests(requestData.pluginID, method);
        }
    }
    /**
     * Decreases the total requests and the successful responses for pluginID with method by 1.
     *
     * This is needed because an error and a successful language server request aren't currently
     * associated together because of https://github.com/microsoft/vscode-languageserver-node/issues/517.
     * That means that every language server request that resolves counts as a successful language server request.
     * Therefore, we need to decrease the extension requests for pluginID when we know there is an error.
     * Otherwise, for every language server request that errors we would count it as both a success and a failure.
     *
     * @param pluginID The id of the plugin that should have the decreased requests
     */
    decreaseExtensionRequests(pluginID, method) {
        const thisExtension = this._extensionIDAnalytics[pluginID];
        if (thisExtension) {
            const currentAnalytics = thisExtension[method];
            if (currentAnalytics) {
                currentAnalytics.totalRequests -= 1;
                currentAnalytics.successfulResponses -= 1;
            }
        }
    }
    /**
     * Update the internal metrics structure for pluginID with method when a request is made
     *
     * @param requestData The data from the request that was made
     * @param isRequestSuccessful If the language server request was successful or not
     */
    async createMetric(requestData, isRequestSuccessful) {
        if (!requestData.pluginID) {
            return;
        }
        // When we are in this function we know its a method so we can make it clearer
        const method = requestData.errorContentsOrMethod;
        const defaultAnalytic = (0, plugin_metrics_types_1.createDefaultAnalytics)(requestData.timeTaken, isRequestSuccessful);
        this.createExtensionIDAnalyticIfNotFound(requestData, defaultAnalytic);
        this.createExtensionIDMethodIfNotFound(requestData, defaultAnalytic);
        const thisExtension = this._extensionIDAnalytics[requestData.pluginID];
        if (thisExtension) {
            const currentAnalytic = thisExtension[method];
            if (currentAnalytic) {
                currentAnalytic.totalRequests += 1;
                if (isRequestSuccessful) {
                    currentAnalytic.successfulResponses += 1;
                }
                if (isRequestSuccessful) {
                    currentAnalytic.sumOfTimeForSuccess = currentAnalytic.sumOfTimeForSuccess + requestData.timeTaken;
                }
                else {
                    currentAnalytic.sumOfTimeForFailure = currentAnalytic.sumOfTimeForFailure + requestData.timeTaken;
                }
            }
        }
    }
    /**
     * Create an entry in _extensionIDAnalytics with createdAnalytic if there does not exist one
     *
     * @param requestData data that we will turn into metrics
     * @param createdAnalytic the analytic being created
     */
    createExtensionIDAnalyticIfNotFound(requestData, createdAnalytic) {
        const method = requestData.errorContentsOrMethod; // We know its a metric if this is being called
        if (!this._extensionIDAnalytics[requestData.pluginID]) {
            this._extensionIDAnalytics[requestData.pluginID] = {
                [method]: createdAnalytic
            };
        }
    }
    /**
     * Create an entry in _extensionIDAnalytics for requestData.pluginID with requestData.errorContentsOrMethod as the method
     * if there does not exist one
     *
     * @param requestData data that we will turn into metrics
     * @param createdAnalytic the analytic being created
     */
    createExtensionIDMethodIfNotFound(requestData, createdAnalytic) {
        const method = requestData.errorContentsOrMethod; // We know its a metric if this is being called
        if (this._extensionIDAnalytics[requestData.pluginID]) {
            const methodToAnalyticMap = this._extensionIDAnalytics[requestData.pluginID];
            if (!methodToAnalyticMap[method]) {
                methodToAnalyticMap[method] = createdAnalytic;
            }
        }
    }
    /**
     * setPluginMetrics is a constant running function that sets
     * pluginMetrics every {$METRICS_TIMEOUT} seconds so that it doesn't
     * update /metrics on every request
     */
    setPluginMetrics() {
        const self = this;
        setInterval(() => {
            if (Object.keys(self._extensionIDAnalytics).length !== 0) {
                self.pluginMetrics.setMetrics(JSON.stringify(self._extensionIDAnalytics));
            }
        }, metrics_protocol_1.METRICS_TIMEOUT);
    }
    // Map of plugin extension id to method to analytic
    get extensionIDAnalytics() {
        return this._extensionIDAnalytics;
    }
    /**
     * Attempts to extract the method name from the current errorContents using the
     * vscode-languageclient matching regex.
     *
     * If it cannot find a match in the errorContents it returns undefined
     *
     * @param errorContents The contents of the current error or undefined
     */
    extractMethodFromValue(errorContents) {
        if (!errorContents) {
            return undefined;
        }
        const matches = errorContents.match(this.NODE_BASED_REGEX);
        if (matches) {
            return matches[1].trim();
        }
        return undefined;
    }
};
__decorate([
    (0, inversify_1.inject)(metrics_protocol_1.PluginMetrics),
    __metadata("design:type", Object)
], PluginMetricsCreator.prototype, "pluginMetrics", void 0);
PluginMetricsCreator = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], PluginMetricsCreator);
exports.PluginMetricsCreator = PluginMetricsCreator;
//# sourceMappingURL=plugin-metrics-creator.js.map