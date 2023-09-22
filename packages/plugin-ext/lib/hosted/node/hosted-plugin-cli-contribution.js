"use strict";
// *****************************************************************************
// Copyright (C) 2019 TypeFox and others.
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
var HostedPluginCliContribution_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HostedPluginCliContribution = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
let pluginHostTerminateTimeout = 10 * 1000;
if (process.env.PLUGIN_HOST_TERMINATE_TIMEOUT) {
    pluginHostTerminateTimeout = Number.parseInt(process.env.PLUGIN_HOST_TERMINATE_TIMEOUT);
}
let pluginHostStopTimeout = 4 * 1000;
if (process.env.PLUGIN_HOST_STOP_TIMEOUT) {
    pluginHostStopTimeout = Number.parseInt(process.env.PLUGIN_HOST_STOP_TIMEOUT);
}
let HostedPluginCliContribution = HostedPluginCliContribution_1 = class HostedPluginCliContribution {
    constructor() {
        this._pluginHostTerminateTimeout = pluginHostTerminateTimeout;
        this._pluginHostStopTimeout = pluginHostStopTimeout;
    }
    get extensionTestsPath() {
        return this._extensionTestsPath;
    }
    get pluginHostTerminateTimeout() {
        return this._pluginHostTerminateTimeout;
    }
    get pluginHostStopTimeout() {
        return this._pluginHostStopTimeout;
    }
    configure(conf) {
        conf.option(HostedPluginCliContribution_1.EXTENSION_TESTS_PATH, {
            type: 'string'
        });
        conf.option(HostedPluginCliContribution_1.PLUGIN_HOST_TERMINATE_TIMEOUT, {
            type: 'number',
            default: pluginHostTerminateTimeout,
            description: 'Timeout in milliseconds to wait for the plugin host process to terminate before killing it. Use 0 for no timeout.'
        });
        conf.option(HostedPluginCliContribution_1.PLUGIN_HOST_STOP_TIMEOUT, {
            type: 'number',
            default: pluginHostStopTimeout,
            description: 'Timeout in milliseconds to wait for the plugin host process to stop internal services. Use 0 for no timeout.'
        });
    }
    setArguments(args) {
        this._extensionTestsPath = args[HostedPluginCliContribution_1.EXTENSION_TESTS_PATH];
        this._pluginHostTerminateTimeout = args[HostedPluginCliContribution_1.PLUGIN_HOST_TERMINATE_TIMEOUT];
        this._pluginHostStopTimeout = args[HostedPluginCliContribution_1.PLUGIN_HOST_STOP_TIMEOUT];
    }
};
HostedPluginCliContribution.EXTENSION_TESTS_PATH = 'extensionTestsPath';
HostedPluginCliContribution.PLUGIN_HOST_TERMINATE_TIMEOUT = 'pluginHostTerminateTimeout';
HostedPluginCliContribution.PLUGIN_HOST_STOP_TIMEOUT = 'pluginHostStopTimeout';
HostedPluginCliContribution = HostedPluginCliContribution_1 = __decorate([
    (0, inversify_1.injectable)()
], HostedPluginCliContribution);
exports.HostedPluginCliContribution = HostedPluginCliContribution;
//# sourceMappingURL=hosted-plugin-cli-contribution.js.map