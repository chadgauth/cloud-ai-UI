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
exports.PluginMetricsOutputChannelRegistry = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const output_channel_registry_main_1 = require("@theia/plugin-ext/lib/main/browser/output-channel-registry-main");
const plugin_metrics_creator_1 = require("./plugin-metrics-creator");
const plugin_metrics_types_1 = require("../common/plugin-metrics-types");
let PluginMetricsOutputChannelRegistry = class PluginMetricsOutputChannelRegistry extends output_channel_registry_main_1.OutputChannelRegistryMainImpl {
    $append(channelName, errorOrValue, pluginInfo) {
        if (errorOrValue.startsWith('[Error')) {
            const createdMetric = (0, plugin_metrics_types_1.createDefaultRequestData)(pluginInfo.id, errorOrValue);
            this.pluginMetricsCreator.createErrorMetric(createdMetric);
        }
        return super.$append(channelName, errorOrValue, pluginInfo);
    }
};
__decorate([
    (0, inversify_1.inject)(plugin_metrics_creator_1.PluginMetricsCreator),
    __metadata("design:type", plugin_metrics_creator_1.PluginMetricsCreator)
], PluginMetricsOutputChannelRegistry.prototype, "pluginMetricsCreator", void 0);
PluginMetricsOutputChannelRegistry = __decorate([
    (0, inversify_1.injectable)()
], PluginMetricsOutputChannelRegistry);
exports.PluginMetricsOutputChannelRegistry = PluginMetricsOutputChannelRegistry;
//# sourceMappingURL=plugin-metrics-output-registry.js.map