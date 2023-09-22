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
var HostedPluginInformer_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HostedPluginInformer = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const status_bar_1 = require("@theia/core/lib/browser/status-bar/status-bar");
const browser_1 = require("@theia/core/lib/browser");
const browser_2 = require("@theia/workspace/lib/browser");
const plugin_dev_protocol_1 = require("../common/plugin-dev-protocol");
const connection_status_service_1 = require("@theia/core/lib/browser/connection-status-service");
const frontend_application_state_1 = require("@theia/core/lib/browser/frontend-application-state");
const nls_1 = require("@theia/core/lib/common/nls");
const window_title_service_1 = require("@theia/core/lib/browser/window/window-title-service");
/**
 * Informs the user whether Theia is running with hosted plugin.
 * Adds 'Development Host' status bar element and appends the same prefix to window title.
 */
let HostedPluginInformer = HostedPluginInformer_1 = class HostedPluginInformer {
    initialize() {
        this.hostedPluginServer.getHostedPlugin().then(pluginMetadata => {
            if (pluginMetadata) {
                this.windowTitleService.update({
                    developmentHost: HostedPluginInformer_1.DEVELOPMENT_HOST_TITLE
                });
                this.entry = {
                    text: `$(cube) ${HostedPluginInformer_1.DEVELOPMENT_HOST_TITLE}`,
                    tooltip: `${nls_1.nls.localize('theia/plugin-dev/hostedPlugin', 'Hosted Plugin')} '${pluginMetadata.model.name}'`,
                    alignment: browser_1.StatusBarAlignment.LEFT,
                    priority: 100
                };
                this.frontendApplicationStateService.reachedState('ready').then(() => {
                    this.updateStatusBarElement();
                });
                this.connectionStatusService.onStatusChange(() => this.updateStatusBarElement());
            }
        });
    }
    updateStatusBarElement() {
        if (this.connectionStatusService.currentStatus === connection_status_service_1.ConnectionStatus.OFFLINE) {
            this.entry.className = HostedPluginInformer_1.DEVELOPMENT_HOST_OFFLINE;
        }
        else {
            this.entry.className = HostedPluginInformer_1.DEVELOPMENT_HOST;
        }
        this.statusBar.setElement(HostedPluginInformer_1.DEVELOPMENT_HOST, this.entry);
    }
};
HostedPluginInformer.DEVELOPMENT_HOST_TITLE = nls_1.nls.localize('theia/plugin-dev/devHost', 'Development Host');
HostedPluginInformer.DEVELOPMENT_HOST = 'development-host';
HostedPluginInformer.DEVELOPMENT_HOST_OFFLINE = 'development-host-offline';
__decorate([
    (0, inversify_1.inject)(status_bar_1.StatusBar),
    __metadata("design:type", Object)
], HostedPluginInformer.prototype, "statusBar", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.WorkspaceService),
    __metadata("design:type", browser_2.WorkspaceService)
], HostedPluginInformer.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(plugin_dev_protocol_1.PluginDevServer),
    __metadata("design:type", Object)
], HostedPluginInformer.prototype, "hostedPluginServer", void 0);
__decorate([
    (0, inversify_1.inject)(connection_status_service_1.ConnectionStatusService),
    __metadata("design:type", Object)
], HostedPluginInformer.prototype, "connectionStatusService", void 0);
__decorate([
    (0, inversify_1.inject)(frontend_application_state_1.FrontendApplicationStateService),
    __metadata("design:type", frontend_application_state_1.FrontendApplicationStateService)
], HostedPluginInformer.prototype, "frontendApplicationStateService", void 0);
__decorate([
    (0, inversify_1.inject)(window_title_service_1.WindowTitleService),
    __metadata("design:type", window_title_service_1.WindowTitleService)
], HostedPluginInformer.prototype, "windowTitleService", void 0);
HostedPluginInformer = HostedPluginInformer_1 = __decorate([
    (0, inversify_1.injectable)()
], HostedPluginInformer);
exports.HostedPluginInformer = HostedPluginInformer;
//# sourceMappingURL=hosted-plugin-informer.js.map