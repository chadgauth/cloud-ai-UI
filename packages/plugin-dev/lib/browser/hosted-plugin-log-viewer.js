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
var HostedPluginLogViewer_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HostedPluginLogViewer = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const output_channel_1 = require("@theia/output/lib/browser/output-channel");
const output_contribution_1 = require("@theia/output/lib/browser/output-contribution");
const hosted_plugin_watcher_1 = require("@theia/plugin-ext/lib/hosted/browser/hosted-plugin-watcher");
let HostedPluginLogViewer = HostedPluginLogViewer_1 = class HostedPluginLogViewer {
    showLogConsole() {
        this.outputContribution.openView({ reveal: true }).then(view => {
            view.activate();
        });
    }
    init() {
        this.channel = this.outputChannelManager.getChannel(HostedPluginLogViewer_1.OUTPUT_CHANNEL_NAME);
        this.watcher.onLogMessageEvent(event => this.logMessageEventHandler(event));
    }
    logMessageEventHandler(event) {
        this.channel.appendLine(event.data);
    }
};
HostedPluginLogViewer.OUTPUT_CHANNEL_NAME = 'hosted-instance-log';
__decorate([
    (0, inversify_1.inject)(hosted_plugin_watcher_1.HostedPluginWatcher),
    __metadata("design:type", hosted_plugin_watcher_1.HostedPluginWatcher)
], HostedPluginLogViewer.prototype, "watcher", void 0);
__decorate([
    (0, inversify_1.inject)(output_channel_1.OutputChannelManager),
    __metadata("design:type", output_channel_1.OutputChannelManager)
], HostedPluginLogViewer.prototype, "outputChannelManager", void 0);
__decorate([
    (0, inversify_1.inject)(output_contribution_1.OutputContribution),
    __metadata("design:type", output_contribution_1.OutputContribution)
], HostedPluginLogViewer.prototype, "outputContribution", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HostedPluginLogViewer.prototype, "init", null);
HostedPluginLogViewer = HostedPluginLogViewer_1 = __decorate([
    (0, inversify_1.injectable)()
], HostedPluginLogViewer);
exports.HostedPluginLogViewer = HostedPluginLogViewer;
//# sourceMappingURL=hosted-plugin-log-viewer.js.map