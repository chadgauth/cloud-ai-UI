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
// some of the code is copied and modified from https://github.com/microsoft/vscode/blob/e1f0f8f51390dea5df9096718fb6b647ed5a9534/src/vs/workbench/api/common/extHostWebviewView.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebviewViewExtImpl = exports.WebviewViewsExtImpl = void 0;
const types_impl_1 = require("./types-impl");
const plugin_api_rpc_1 = require("../common/plugin-api-rpc");
const event_1 = require("@theia/core/lib/common/event");
class WebviewViewsExtImpl {
    constructor(rpc, webviewsExt) {
        this.webviewsExt = webviewsExt;
        this.viewProviders = new Map();
        this.webviewViews = new Map();
        this.proxy = rpc.getProxy(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.WEBVIEW_VIEWS_MAIN);
    }
    registerWebviewViewProvider(viewType, provider, plugin, webviewOptions) {
        if (this.viewProviders.has(viewType)) {
            throw new Error(`View provider for '${viewType}' already registered`);
        }
        this.viewProviders.set(viewType, { provider: provider, plugin: plugin });
        this.proxy.$registerWebviewViewProvider(viewType, {
            retainContextWhenHidden: webviewOptions === null || webviewOptions === void 0 ? void 0 : webviewOptions.retainContextWhenHidden,
            serializeBuffersForPostMessage: false,
        });
        return new types_impl_1.Disposable(() => {
            this.viewProviders.delete(viewType);
            this.proxy.$unregisterWebviewViewProvider(viewType);
        });
    }
    async $resolveWebviewView(handle, viewType, title, 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    state, cancellation) {
        const entry = this.viewProviders.get(viewType);
        if (!entry) {
            throw new Error(`No view provider found for '${viewType}'`);
        }
        const { provider, plugin } = entry;
        const webviewNoPanel = this.webviewsExt.createNewWebview({}, plugin, handle);
        const revivedView = new WebviewViewExtImpl(handle, this.proxy, viewType, title, webviewNoPanel, true);
        this.webviewViews.set(handle, revivedView);
        await provider.resolveWebviewView(revivedView, { state }, cancellation);
    }
    async $onDidChangeWebviewViewVisibility(handle, visible) {
        const webviewView = this.getWebviewView(handle);
        webviewView.setVisible(visible);
        webviewView.onDidChangeVisibilityEmitter.fire();
    }
    async $disposeWebviewView(handle) {
        const webviewView = this.getWebviewView(handle);
        this.webviewViews.delete(handle);
        webviewView.dispose();
        this.webviewsExt.deleteWebview(handle);
    }
    getWebviewView(handle) {
        const entry = this.webviewViews.get(handle);
        if (!entry) {
            throw new Error('No webview found');
        }
        return entry;
    }
}
exports.WebviewViewsExtImpl = WebviewViewsExtImpl;
class WebviewViewExtImpl {
    constructor(handle, proxy, viewType, title, webview, isVisible) {
        this.onDidChangeVisibilityEmitter = new event_1.Emitter();
        this.onDidChangeVisibility = this.onDidChangeVisibilityEmitter.event;
        this.onDidDisposeEmitter = new event_1.Emitter();
        this.onDidDispose = this.onDidDisposeEmitter.event;
        this._isDisposed = false;
        this._viewType = viewType;
        this._title = title;
        this.handle = handle;
        this.proxy = proxy;
        this._webview = webview;
        this._isVisible = isVisible;
    }
    dispose() {
        if (this._isDisposed) {
            return;
        }
        this._isDisposed = true;
        this.onDidDisposeEmitter.fire();
    }
    get title() {
        this.assertNotDisposed();
        return this._title;
    }
    set title(value) {
        this.assertNotDisposed();
        if (this._title !== value) {
            this._title = value;
            this.proxy.$setWebviewViewTitle(this.handle, value);
        }
    }
    get description() {
        this.assertNotDisposed();
        return this._description;
    }
    set description(value) {
        this.assertNotDisposed();
        if (this._description !== value) {
            this._description = value;
            this.proxy.$setWebviewViewDescription(this.handle, value);
        }
    }
    get badge() {
        this.assertNotDisposed();
        return this._badge;
    }
    set badge(badge) {
        this.assertNotDisposed();
        if (this._badge !== badge) {
            this._badge = badge;
            this.proxy.$setBadge(this.handle, badge ? { value: badge.value, tooltip: badge.tooltip } : undefined);
        }
    }
    get visible() { return this._isVisible; }
    get webview() { return this._webview; }
    get viewType() { return this._viewType; }
    setVisible(visible) {
        if (visible === this._isVisible || this._isDisposed) {
            return;
        }
        this._isVisible = visible;
        this.onDidChangeVisibilityEmitter.fire();
    }
    show(preserveFocus) {
        this.assertNotDisposed();
        this.proxy.$show(this.handle, !!preserveFocus);
    }
    assertNotDisposed() {
        if (this._isDisposed) {
            throw new Error('Webview is disposed');
        }
    }
}
exports.WebviewViewExtImpl = WebviewViewExtImpl;
//# sourceMappingURL=webview-views.js.map