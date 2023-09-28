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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebviewsMainImpl = void 0;
const debounce = require("@theia/core/shared/lodash.debounce");
const vscode_uri_1 = require("@theia/core/shared/vscode-uri");
const plugin_api_rpc_1 = require("../../common/plugin-api-rpc");
const application_shell_1 = require("@theia/core/lib/browser/shell/application-shell");
const webview_1 = require("./webview/webview");
const disposable_1 = require("@theia/core/lib/common/disposable");
const view_column_service_1 = require("./view-column-service");
const widget_manager_1 = require("@theia/core/lib/browser/widget-manager");
const coreutils_1 = require("@theia/core/shared/@phosphor/coreutils");
const hosted_plugin_1 = require("../../hosted/browser/hosted-plugin");
const custom_editor_widget_1 = require("./custom-editors/custom-editor-widget");
const types_impl_1 = require("../../plugin/types-impl");
class WebviewsMainImpl {
    constructor(rpc, container) {
        this.toDispose = new disposable_1.DisposableCollection();
        this.updateViewStates = debounce(() => {
            const widgets = this.widgetManager.getWidgets(webview_1.WebviewWidget.FACTORY_ID);
            const customEditors = this.widgetManager.getWidgets(custom_editor_widget_1.CustomEditorWidget.FACTORY_ID);
            for (const widget of widgets.concat(customEditors)) {
                if (widget instanceof webview_1.WebviewWidget) {
                    this.updateViewState(widget);
                }
            }
        }, 100);
        this.proxy = rpc.getProxy(plugin_api_rpc_1.MAIN_RPC_CONTEXT.WEBVIEWS_EXT);
        this.shell = container.get(application_shell_1.ApplicationShell);
        this.viewColumnService = container.get(view_column_service_1.ViewColumnService);
        this.widgetManager = container.get(widget_manager_1.WidgetManager);
        this.pluginService = container.get(hosted_plugin_1.HostedPluginSupport);
        this.toDispose.push(this.shell.onDidChangeActiveWidget(() => this.updateViewStates()));
        this.toDispose.push(this.shell.onDidChangeCurrentWidget(() => this.updateViewStates()));
        this.toDispose.push(this.viewColumnService.onViewColumnChanged(() => this.updateViewStates()));
    }
    dispose() {
        this.toDispose.dispose();
    }
    async $createWebviewPanel(panelId, viewType, title, showOptions, options) {
        const view = await this.widgetManager.getOrCreateWidget(webview_1.WebviewWidget.FACTORY_ID, { id: panelId });
        this.hookWebview(view);
        view.viewType = viewType;
        view.title.label = title;
        const { enableFindWidget, retainContextWhenHidden, enableScripts, enableForms, localResourceRoots, ...contentOptions } = options;
        view.options = { enableFindWidget, retainContextWhenHidden };
        view.setContentOptions({
            allowScripts: enableScripts,
            allowForms: enableForms,
            localResourceRoots: localResourceRoots && localResourceRoots.map(root => root.toString()),
            ...contentOptions
        });
        this.addOrReattachWidget(view, showOptions);
    }
    hookWebview(view) {
        const handle = view.identifier.id;
        this.toDispose.push(view.onDidChangeVisibility(() => this.updateViewState(view)));
        this.toDispose.push(view.onMessage(data => this.proxy.$onMessage(handle, data)));
        view.disposed.connect(() => {
            if (this.toDispose.disposed) {
                return;
            }
            this.proxy.$onDidDisposeWebviewPanel(handle);
        });
    }
    addOrReattachWidget(widget, showOptions) {
        var _a;
        const area = showOptions.area ? showOptions.area : types_impl_1.WebviewPanelTargetArea.Main;
        const widgetOptions = { area };
        let mode = 'open-to-right';
        const canOpenBeside = showOptions.viewColumn === types_impl_1.ViewColumn.Beside && (area === types_impl_1.WebviewPanelTargetArea.Main || area === types_impl_1.WebviewPanelTargetArea.Bottom);
        if (canOpenBeside) {
            const activeOrRightmostTabbar = this.shell.getTabBarFor(area);
            const ref = (_a = activeOrRightmostTabbar === null || activeOrRightmostTabbar === void 0 ? void 0 : activeOrRightmostTabbar.currentTitle) === null || _a === void 0 ? void 0 : _a.owner;
            if (ref) {
                Object.assign(widgetOptions, { ref, mode });
            }
        }
        else if (widgetOptions.area === 'main' && showOptions.viewColumn !== undefined) {
            this.viewColumnService.updateViewColumns();
            let widgetIds = this.viewColumnService.getViewColumnIds(showOptions.viewColumn);
            if (widgetIds.length > 0) {
                mode = 'tab-after';
            }
            else if (showOptions.viewColumn >= 0) {
                const columnsSize = this.viewColumnService.viewColumnsSize();
                if (columnsSize) {
                    showOptions.viewColumn = columnsSize - 1;
                    widgetIds = this.viewColumnService.getViewColumnIds(showOptions.viewColumn);
                }
            }
            const ref = this.shell.getWidgets(widgetOptions.area).find(w => !w.isHidden && widgetIds.indexOf(w.id) !== -1);
            if (ref) {
                Object.assign(widgetOptions, { ref, mode });
            }
        }
        this.shell.addWidget(widget, widgetOptions);
        if (showOptions.preserveFocus) {
            this.shell.revealWidget(widget.id);
        }
        else {
            this.shell.activateWidget(widget.id);
        }
    }
    async $disposeWebview(handle) {
        const view = await this.tryGetWebview(handle);
        if (view) {
            view.dispose();
        }
    }
    async $reveal(handle, showOptions) {
        const widget = await this.getWebview(handle);
        if (widget.isDisposed) {
            return;
        }
        if ((showOptions.viewColumn !== undefined && showOptions.viewColumn !== widget.viewState.position) || showOptions.area !== undefined) {
            this.viewColumnService.updateViewColumns();
            const columnIds = showOptions.viewColumn ? this.viewColumnService.getViewColumnIds(showOptions.viewColumn) : [];
            const area = this.shell.getAreaFor(widget);
            if (columnIds.indexOf(widget.id) === -1 || area !== showOptions.area) {
                this.addOrReattachWidget(widget, showOptions);
                return;
            }
        }
        if (showOptions.preserveFocus) {
            this.shell.revealWidget(widget.id);
        }
        else {
            this.shell.activateWidget(widget.id);
        }
    }
    async $setTitle(handle, value) {
        const webview = await this.getWebview(handle);
        webview.title.label = value;
    }
    async $setBadge(handle, badge) {
        const webview = await this.getWebview(handle);
        if (webview) {
            webview.badge = badge === null || badge === void 0 ? void 0 : badge.value;
            webview.badgeTooltip = badge === null || badge === void 0 ? void 0 : badge.tooltip;
        }
    }
    async $setIconPath(handle, iconUrl) {
        const webview = await this.getWebview(handle);
        webview.setIconUrl(iconUrl);
    }
    async $setHtml(handle, value) {
        const webview = await this.getWebview(handle);
        webview.setHTML(value);
    }
    async $setOptions(handle, options) {
        const webview = await this.getWebview(handle);
        const { enableScripts, enableForms, localResourceRoots, ...contentOptions } = options;
        webview.setContentOptions({
            allowScripts: enableScripts,
            allowForms: enableForms,
            localResourceRoots: localResourceRoots && localResourceRoots.map(root => root.toString()),
            ...contentOptions
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async $postMessage(handle, value) {
        const webview = await this.getWebview(handle);
        webview.sendMessage(value);
        return true;
    }
    $registerSerializer(viewType) {
        this.pluginService.registerWebviewReviver(viewType, widget => this.restoreWidget(widget));
        this.toDispose.push(disposable_1.Disposable.create(() => this.$unregisterSerializer(viewType)));
    }
    $unregisterSerializer(viewType) {
        this.pluginService.unregisterWebviewReviver(viewType);
    }
    async restoreWidget(widget) {
        this.hookWebview(widget);
        const handle = widget.identifier.id;
        const title = widget.title.label;
        let state = undefined;
        if (widget.state) {
            try {
                state = JSON.parse(widget.state);
            }
            catch {
                // noop
            }
        }
        const options = widget.options;
        const { allowScripts, allowForms, localResourceRoots, ...contentOptions } = widget.contentOptions;
        this.updateViewState(widget);
        await this.proxy.$deserializeWebviewPanel(handle, widget.viewType, title, state, widget.viewState, {
            enableScripts: allowScripts,
            enableForms: allowForms,
            localResourceRoots: localResourceRoots && localResourceRoots.map(root => vscode_uri_1.URI.parse(root)),
            ...contentOptions,
            ...options
        });
    }
    updateViewState(widget, viewColumn) {
        const viewState = {
            active: this.shell.activeWidget === widget,
            visible: !widget.isHidden,
            position: viewColumn || 0
        };
        if (typeof viewColumn !== 'number') {
            this.viewColumnService.updateViewColumns();
            viewState.position = this.viewColumnService.getViewColumn(widget.id) || 0;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (coreutils_1.JSONExt.deepEqual(viewState, widget.viewState)) {
            return;
        }
        widget.viewState = viewState;
        this.proxy.$onDidChangeWebviewPanelViewState(widget.identifier.id, widget.viewState);
    }
    async getWebview(viewId) {
        const webview = await this.tryGetWebview(viewId);
        if (!webview) {
            throw new Error(`Unknown Webview: ${viewId}`);
        }
        return webview;
    }
    async tryGetWebview(id) {
        const webview = await this.widgetManager.getWidget(webview_1.WebviewWidget.FACTORY_ID, { id })
            || await this.widgetManager.getWidget(custom_editor_widget_1.CustomEditorWidget.FACTORY_ID, { id });
        return webview;
    }
}
exports.WebviewsMainImpl = WebviewsMainImpl;
//# sourceMappingURL=webviews-main.js.map