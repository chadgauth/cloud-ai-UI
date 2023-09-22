"use strict";
// *****************************************************************************
// Copyright (C) 2018 Red Hat, Inc. and others.
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
exports.HostedPluginSupport = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const common_1 = require("@theia/core/lib/common");
const plugin_protocol_1 = require("../../common/plugin-protocol");
const hosted_plugin_process_1 = require("./hosted-plugin-process");
let HostedPluginSupport = class HostedPluginSupport {
    constructor() {
        this.isPluginProcessRunning = false;
    }
    init() {
        this.pluginRunners.forEach(runner => {
            runner.setDefault(this.hostedPluginProcess);
        });
    }
    setClient(client) {
        this.client = client;
        this.hostedPluginProcess.setClient(client);
        this.pluginRunners.forEach(runner => runner.setClient(client));
    }
    clientClosed() {
        this.isPluginProcessRunning = false;
        this.terminatePluginServer();
        this.isPluginProcessRunning = false;
        this.pluginRunners.forEach(runner => runner.clientClosed());
    }
    runPlugin(plugin) {
        if (!plugin.entryPoint.frontend) {
            this.runPluginServer();
        }
    }
    onMessage(pluginHostId, message) {
        // need to perform routing
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (this.pluginRunners.length > 0) {
            this.pluginRunners.forEach(runner => {
                if (runner.acceptMessage(pluginHostId, message)) {
                    runner.onMessage(pluginHostId, message);
                }
            });
        }
        else {
            this.hostedPluginProcess.onMessage(pluginHostId, message);
        }
    }
    runPluginServer() {
        if (!this.isPluginProcessRunning) {
            this.hostedPluginProcess.runPluginServer();
            this.isPluginProcessRunning = true;
        }
    }
    /**
     * Provides additional plugin ids.
     */
    async getExtraDeployedPluginIds() {
        return [].concat.apply([], await Promise.all(this.pluginRunners.map(runner => runner.getExtraDeployedPluginIds())));
    }
    /**
     * Provides additional deployed plugins.
     */
    async getExtraDeployedPlugins() {
        return [].concat.apply([], await Promise.all(this.pluginRunners.map(runner => runner.getExtraDeployedPlugins())));
    }
    sendLog(logPart) {
        this.client.log(logPart);
    }
    terminatePluginServer() {
        this.hostedPluginProcess.terminatePluginServer();
    }
};
__decorate([
    (0, inversify_1.inject)(common_1.ILogger),
    __metadata("design:type", Object)
], HostedPluginSupport.prototype, "logger", void 0);
__decorate([
    (0, inversify_1.inject)(hosted_plugin_process_1.HostedPluginProcess),
    __metadata("design:type", hosted_plugin_process_1.HostedPluginProcess)
], HostedPluginSupport.prototype, "hostedPluginProcess", void 0);
__decorate([
    (0, inversify_1.optional)(),
    (0, inversify_1.multiInject)(plugin_protocol_1.ServerPluginRunner),
    __metadata("design:type", Array)
], HostedPluginSupport.prototype, "pluginRunners", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HostedPluginSupport.prototype, "init", null);
HostedPluginSupport = __decorate([
    (0, inversify_1.injectable)()
], HostedPluginSupport);
exports.HostedPluginSupport = HostedPluginSupport;
//# sourceMappingURL=hosted-plugin.js.map