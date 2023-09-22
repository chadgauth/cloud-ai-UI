"use strict";
// *****************************************************************************
// Copyright (C) 2021 SAP SE or an SAP affiliate company and others.
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
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// some code copied and modified from https://github.com/microsoft/vscode/blob/e1f0f8f51390dea5df9096718fb6b647ed5a9534/src/vs/workbench/api/browser/mainThreadWebviewViews.ts
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
exports.WebviewViewsMainImpl = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const plugin_api_rpc_1 = require("../../../common/plugin-api-rpc");
const core_1 = require("@theia/core");
const browser_1 = require("@theia/core/lib/browser");
const plugin_view_registry_1 = require("../view/plugin-view-registry");
class WebviewViewsMainImpl {
    constructor(rpc, container, webviewsMain) {
        this.webviewsMain = webviewsMain;
        this.toDispose = new core_1.DisposableCollection(core_1.Disposable.create(() => { }));
        this.webviewViews = new Map();
        this.webviewViewProviders = new Map();
        this.proxy = rpc.getProxy(plugin_api_rpc_1.MAIN_RPC_CONTEXT.WEBVIEW_VIEWS_EXT);
        this.widgetManager = container.get(browser_1.WidgetManager);
        this.pluginViewRegistry = container.get(plugin_view_registry_1.PluginViewRegistry);
    }
    dispose() {
        this.toDispose.dispose();
    }
    async $registerWebviewViewProvider(viewType, options) {
        if (this.webviewViewProviders.has(viewType)) {
            throw new Error(`View provider for ${viewType} already registered`);
        }
        const registration = await this.pluginViewRegistry.registerWebviewView(viewType, {
            resolve: async (webviewView, cancellation) => {
                const handle = webviewView.webview.identifier.id;
                this.webviewViews.set(handle, webviewView);
                this.webviewsMain.hookWebview(webviewView.webview);
                let state;
                if (webviewView.webview.state) {
                    try {
                        state = JSON.parse(webviewView.webview.state);
                        console.log(state);
                    }
                    catch (e) {
                        console.error('Could not load webview state', e, webviewView.webview.state);
                    }
                }
                if (options) {
                    webviewView.webview.options = options;
                }
                webviewView.onDidChangeVisibility(visible => {
                    this.proxy.$onDidChangeWebviewViewVisibility(handle, visible);
                });
                webviewView.onDidDispose(() => {
                    this.proxy.$disposeWebviewView(handle);
                    this.webviewViews.delete(handle);
                });
                try {
                    this.proxy.$resolveWebviewView(handle, viewType, webviewView.title, state, cancellation);
                }
                catch (error) {
                    this.logger.error(`Error resolving webview view '${viewType}': ${error}`);
                    webviewView.webview.setHTML('failed to load plugin webview view');
                }
            }
        });
        this.webviewViewProviders.set(viewType, registration);
    }
    getWebview(handle) {
        return this.widgetManager.tryGetWidget(handle);
    }
    $unregisterWebviewViewProvider(viewType) {
        const provider = this.webviewViewProviders.get(viewType);
        if (!provider) {
            throw new Error(`No view provider for ${viewType} registered`);
        }
        provider.dispose();
        this.webviewViewProviders.delete(viewType);
    }
    $setWebviewViewTitle(handle, value) {
        const webviewView = this.getWebviewView(handle);
        webviewView.title = value;
    }
    $setWebviewViewDescription(handle, value) {
        const webviewView = this.getWebviewView(handle);
        webviewView.description = value;
    }
    async $setBadge(handle, badge) {
        const webviewView = this.getWebviewView(handle);
        if (webviewView) {
            webviewView.badge = badge === null || badge === void 0 ? void 0 : badge.value;
            webviewView.badgeTooltip = badge === null || badge === void 0 ? void 0 : badge.tooltip;
        }
    }
    $show(handle, preserveFocus) {
        const webviewView = this.getWebviewView(handle);
        webviewView.show(preserveFocus);
    }
    getWebviewView(handle) {
        const webviewView = this.webviewViews.get(handle);
        if (!webviewView) {
            throw new Error(`No webview view registered for handle '${handle}'`);
        }
        return webviewView;
    }
}
__decorate([
    (0, inversify_1.inject)(core_1.ILogger),
    __metadata("design:type", Object)
], WebviewViewsMainImpl.prototype, "logger", void 0);
exports.WebviewViewsMainImpl = WebviewViewsMainImpl;
//# sourceMappingURL=webview-views-main.js.map