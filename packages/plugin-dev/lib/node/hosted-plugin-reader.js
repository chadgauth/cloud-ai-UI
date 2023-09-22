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
exports.HostedPluginReader = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const plugin_reader_1 = require("@theia/plugin-ext/lib/hosted/node/plugin-reader");
const promise_util_1 = require("@theia/core/lib/common/promise-util");
const plugin_deployer_entry_impl_1 = require("@theia/plugin-ext/lib/main/node/plugin-deployer-entry-impl");
const hosted_plugin_deployer_handler_1 = require("@theia/plugin-ext/lib/hosted/node/hosted-plugin-deployer-handler");
let HostedPluginReader = class HostedPluginReader {
    constructor() {
        this.hostedPlugin = new promise_util_1.Deferred();
    }
    async initialize() {
        this.pluginReader.getPluginMetadata(process.env.HOSTED_PLUGIN)
            .then(this.hostedPlugin.resolve.bind(this.hostedPlugin));
        const pluginPath = process.env.HOSTED_PLUGIN;
        if (pluginPath) {
            const hostedPlugin = new plugin_deployer_entry_impl_1.PluginDeployerEntryImpl('Hosted Plugin', pluginPath, pluginPath);
            hostedPlugin.storeValue('isUnderDevelopment', true);
            const hostedMetadata = await this.hostedPlugin.promise;
            if (hostedMetadata.model.entryPoint && hostedMetadata.model.entryPoint.backend) {
                this.deployerHandler.deployBackendPlugins([hostedPlugin]);
            }
            if (hostedMetadata.model.entryPoint && hostedMetadata.model.entryPoint.frontend) {
                this.deployerHandler.deployFrontendPlugins([hostedPlugin]);
            }
        }
    }
    async getPlugin() {
        return this.hostedPlugin.promise;
    }
};
__decorate([
    (0, inversify_1.inject)(plugin_reader_1.HostedPluginReader),
    __metadata("design:type", plugin_reader_1.HostedPluginReader)
], HostedPluginReader.prototype, "pluginReader", void 0);
__decorate([
    (0, inversify_1.inject)(hosted_plugin_deployer_handler_1.HostedPluginDeployerHandler),
    __metadata("design:type", hosted_plugin_deployer_handler_1.HostedPluginDeployerHandler)
], HostedPluginReader.prototype, "deployerHandler", void 0);
HostedPluginReader = __decorate([
    (0, inversify_1.injectable)()
], HostedPluginReader);
exports.HostedPluginReader = HostedPluginReader;
//# sourceMappingURL=hosted-plugin-reader.js.map