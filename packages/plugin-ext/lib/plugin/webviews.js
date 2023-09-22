"use strict";
// *****************************************************************************
// Copyright (C) 2018 Red Hat, Inc.
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebviewPanelImpl = exports.WebviewImpl = exports.WebviewsExtImpl = void 0;
const uuid_1 = require("uuid");
const plugin_api_rpc_1 = require("../common/plugin-api-rpc");
const event_1 = require("@theia/core/lib/common/event");
const type_converters_1 = require("./type-converters");
const types_impl_1 = require("./types-impl");
const plugin_icon_path_1 = require("./plugin-icon-path");
class WebviewsExtImpl {
    constructor(rpc, workspace) {
        this.workspace = workspace;
        this.webviewPanels = new Map();
        this.webviews = new Map();
        this.serializers = new Map();
        this.onDidDisposeEmitter = new event_1.Emitter();
        this.onDidDispose = this.onDidDisposeEmitter.event;
        this.proxy = rpc.getProxy(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.WEBVIEWS_MAIN);
    }
    init(initData) {
        this.initData = initData;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $onMessage(handle, message) {
        const panel = this.getWebviewPanel(handle);
        if (panel) {
            panel.webview.onMessageEmitter.fire(message);
        }
        else {
            const webview = this.getWebview(handle);
            if (webview) {
                webview.onMessageEmitter.fire(message);
            }
        }
    }
    $onDidChangeWebviewPanelViewState(handle, newState) {
        const panel = this.getWebviewPanel(handle);
        if (panel) {
            const viewColumn = (0, type_converters_1.toViewColumn)(newState.position);
            if (panel.active !== newState.active || panel.visible !== newState.visible || panel.viewColumn !== viewColumn) {
                panel.setActive(newState.active);
                panel.setVisible(newState.visible);
                panel.setViewColumn(viewColumn);
                panel.onDidChangeViewStateEmitter.fire({ webviewPanel: panel });
            }
        }
    }
    $onDidDisposeWebviewPanel(handle) {
        const panel = this.getWebviewPanel(handle);
        if (panel) {
            panel.dispose();
            this.webviewPanels.delete(handle);
        }
        return Promise.resolve();
    }
    $deserializeWebviewPanel(viewId, viewType, title, 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    state, viewState, options) {
        if (!this.initData) {
            return Promise.reject(new Error('Webviews are not initialized'));
        }
        const entry = this.serializers.get(viewType);
        if (!entry) {
            return Promise.reject(new Error(`No serializer found for '${viewType}'`));
        }
        const { serializer, plugin } = entry;
        const webview = new WebviewImpl(viewId, this.proxy, options, this.initData, this.workspace, plugin);
        const revivedPanel = new WebviewPanelImpl(viewId, this.proxy, viewType, title, (0, type_converters_1.toViewColumn)(viewState.position), options, webview);
        revivedPanel.setActive(viewState.active);
        revivedPanel.setVisible(viewState.visible);
        this.webviewPanels.set(viewId, revivedPanel);
        return serializer.deserializeWebviewPanel(revivedPanel, state);
    }
    createWebview(viewType, title, showOptions, options, plugin) {
        const viewId = (0, uuid_1.v4)();
        const webviewShowOptions = (0, type_converters_1.toWebviewPanelShowOptions)(showOptions);
        const webviewOptions = WebviewImpl.toWebviewOptions(options, this.workspace, plugin);
        this.proxy.$createWebviewPanel(viewId, viewType, title, webviewShowOptions, webviewOptions);
        const panel = this.createWebviewPanel(viewType, title, showOptions, options, plugin, viewId);
        return panel;
    }
    createWebviewPanel(viewType, title, showOptions, options, plugin, viewId) {
        if (!this.initData) {
            throw new Error('Webviews are not initialized');
        }
        const webviewShowOptions = (0, type_converters_1.toWebviewPanelShowOptions)(showOptions);
        const webview = new WebviewImpl(viewId, this.proxy, options, this.initData, this.workspace, plugin);
        const panel = new WebviewPanelImpl(viewId, this.proxy, viewType, title, webviewShowOptions, options, webview);
        this.webviewPanels.set(viewId, panel);
        return panel;
    }
    createNewWebview(options, plugin, viewId) {
        if (!this.initData) {
            throw new Error('Webviews are not initialized');
        }
        const webview = new WebviewImpl(viewId, this.proxy, options, this.initData, this.workspace, plugin);
        this.webviews.set(viewId, webview);
        return webview;
    }
    registerWebviewPanelSerializer(viewType, serializer, plugin) {
        if (this.serializers.has(viewType)) {
            throw new Error(`Serializer for '${viewType}' already registered`);
        }
        this.serializers.set(viewType, { serializer, plugin });
        this.proxy.$registerSerializer(viewType);
        return new types_impl_1.Disposable(() => {
            this.serializers.delete(viewType);
            this.proxy.$unregisterSerializer(viewType);
        });
    }
    getWebviewPanel(viewId) {
        if (this.webviewPanels.has(viewId)) {
            return this.webviewPanels.get(viewId);
        }
        return undefined;
    }
    deleteWebview(handle) {
        this.webviews.delete(handle);
    }
    getWebview(handle) {
        return this.webviews.get(handle);
    }
}
exports.WebviewsExtImpl = WebviewsExtImpl;
class WebviewImpl {
    constructor(viewId, proxy, options, initData, workspace, plugin) {
        this.viewId = viewId;
        this.proxy = proxy;
        this.initData = initData;
        this.workspace = workspace;
        this.plugin = plugin;
        this.isDisposed = false;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.onMessageEmitter = new event_1.Emitter();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.onDidReceiveMessage = this.onMessageEmitter.event;
        this._options = options;
    }
    dispose() {
        if (this.isDisposed) {
            return;
        }
        this.isDisposed = true;
        this.onMessageEmitter.dispose();
    }
    asWebviewUri(resource) {
        const uri = this.initData.webviewResourceRoot
            .replace('{{scheme}}', resource.scheme)
            .replace('{{authority}}', resource.authority)
            .replace('{{path}}', resource.path.replace(/^\//, ''))
            .replace('{{uuid}}', this.viewId);
        return types_impl_1.URI.parse(uri);
    }
    get cspSource() {
        return this.initData.webviewCspSource.replace('{{uuid}}', this.viewId);
    }
    get html() {
        this.checkIsDisposed();
        return this._html;
    }
    set html(value) {
        this.checkIsDisposed();
        if (this._html !== value) {
            this._html = value;
            this.proxy.$setHtml(this.viewId, this._html);
        }
    }
    get options() {
        this.checkIsDisposed();
        return this._options;
    }
    set options(newOptions) {
        this.checkIsDisposed();
        this.proxy.$setOptions(this.viewId, WebviewImpl.toWebviewOptions(newOptions, this.workspace, this.plugin));
        this._options = newOptions;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    postMessage(message) {
        this.checkIsDisposed();
        return this.proxy.$postMessage(this.viewId, message);
    }
    checkIsDisposed() {
        if (this.isDisposed) {
            throw new Error('This Webview is disposed!');
        }
    }
    static toWebviewOptions(options, workspace, plugin) {
        return {
            ...options,
            localResourceRoots: options.localResourceRoots || [
                ...(workspace.workspaceFolders || []).map(x => x.uri),
                types_impl_1.URI.file(plugin.pluginFolder)
            ]
        };
    }
}
exports.WebviewImpl = WebviewImpl;
class WebviewPanelImpl {
    constructor(viewId, proxy, _viewType, _title, showOptions, _options, _webview) {
        this.viewId = viewId;
        this.proxy = proxy;
        this._viewType = _viewType;
        this._title = _title;
        this._options = _options;
        this._webview = _webview;
        this.isDisposed = false;
        this._active = true;
        this._visible = true;
        this.onDisposeEmitter = new event_1.Emitter();
        this.onDidDispose = this.onDisposeEmitter.event;
        this.onDidChangeViewStateEmitter = new event_1.Emitter();
        this.onDidChangeViewState = this.onDidChangeViewStateEmitter.event;
        this._showOptions = typeof showOptions === 'object' ? showOptions : { viewColumn: showOptions };
    }
    dispose() {
        if (this.isDisposed) {
            return;
        }
        this.isDisposed = true;
        this.onDisposeEmitter.fire(undefined);
        this.proxy.$disposeWebview(this.viewId);
        this._webview.dispose();
        this.onDisposeEmitter.dispose();
        this.onDidChangeViewStateEmitter.dispose();
    }
    get viewType() {
        this.checkIsDisposed();
        return this._viewType;
    }
    get title() {
        this.checkIsDisposed();
        return this._title;
    }
    set title(newTitle) {
        this.checkIsDisposed();
        if (this._title !== newTitle) {
            this._title = newTitle;
            this.proxy.$setTitle(this.viewId, newTitle);
        }
    }
    get iconPath() {
        return this._iconPath;
    }
    set iconPath(iconPath) {
        this.checkIsDisposed();
        if (this._iconPath !== iconPath) {
            this._iconPath = iconPath;
            this.proxy.$setIconPath(this.viewId, plugin_icon_path_1.PluginIconPath.toUrl(iconPath, this._webview.plugin));
        }
    }
    get webview() {
        this.checkIsDisposed();
        return this._webview;
    }
    get options() {
        this.checkIsDisposed();
        return this._options;
    }
    get viewColumn() {
        this.checkIsDisposed();
        return this._showOptions.viewColumn;
    }
    setViewColumn(value) {
        this.checkIsDisposed();
        this._showOptions.viewColumn = value;
    }
    get showOptions() {
        this.checkIsDisposed();
        return this._showOptions;
    }
    setShowOptions(value) {
        this.checkIsDisposed();
        this._showOptions = value;
    }
    get active() {
        this.checkIsDisposed();
        return this._active;
    }
    setActive(value) {
        this.checkIsDisposed();
        this._active = value;
    }
    get visible() {
        this.checkIsDisposed();
        return this._visible;
    }
    setVisible(value) {
        this.checkIsDisposed();
        this._visible = value;
    }
    reveal(arg0, arg1, arg2) {
        let area = undefined;
        let viewColumn = undefined;
        let preserveFocus = undefined;
        if (typeof arg0 === 'number') {
            viewColumn = arg0;
        }
        else {
            area = arg0;
        }
        if (typeof arg1 === 'number') {
            viewColumn = arg1;
        }
        else {
            preserveFocus = arg1;
        }
        if (typeof arg2 === 'boolean') {
            preserveFocus = arg2;
        }
        this.checkIsDisposed();
        this.proxy.$reveal(this.viewId, {
            area,
            viewColumn: viewColumn ? (0, type_converters_1.fromViewColumn)(viewColumn) : undefined,
            preserveFocus
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    postMessage(message) {
        this.checkIsDisposed();
        return this.proxy.$postMessage(this.viewId, message);
    }
    checkIsDisposed() {
        if (this.isDisposed) {
            throw new Error('This WebviewPanel is disposed!');
        }
    }
}
exports.WebviewPanelImpl = WebviewPanelImpl;
//# sourceMappingURL=webviews.js.map