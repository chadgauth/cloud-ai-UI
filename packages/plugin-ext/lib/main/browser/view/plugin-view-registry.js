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
var PluginViewRegistry_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginViewRegistry = exports.PLUGIN_VIEW_DATA_FACTORY_ID = exports.PLUGIN_VIEW_CONTAINER_FACTORY_ID = exports.PLUGIN_VIEW_FACTORY_ID = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/core/lib/browser");
const common_1 = require("../../../common");
const plugin_shared_style_1 = require("../plugin-shared-style");
const debug_widget_1 = require("@theia/debug/lib/browser/view/debug-widget");
const plugin_view_widget_1 = require("./plugin-view-widget");
const scm_contribution_1 = require("@theia/scm/lib/browser/scm-contribution");
const browser_2 = require("@theia/navigator/lib/browser");
const navigator_contribution_1 = require("@theia/navigator/lib/browser/navigator-contribution");
const debug_frontend_application_contribution_1 = require("@theia/debug/lib/browser/debug-frontend-application-contribution");
const disposable_1 = require("@theia/core/lib/common/disposable");
const command_1 = require("@theia/core/lib/common/command");
const menu_1 = require("@theia/core/lib/common/menu");
const event_1 = require("@theia/core/lib/common/event");
const context_key_service_1 = require("@theia/core/lib/browser/context-key-service");
const view_context_key_service_1 = require("./view-context-key-service");
const problem_widget_1 = require("@theia/markers/lib/browser/problem/problem-widget");
const output_widget_1 = require("@theia/output/lib/browser/output-widget");
const debug_console_contribution_1 = require("@theia/debug/lib/browser/console/debug-console-contribution");
const search_in_workspace_factory_1 = require("@theia/search-in-workspace/lib/browser/search-in-workspace-factory");
const themeService_1 = require("@theia/monaco-editor-core/esm/vs/platform/theme/common/themeService");
const webview_1 = require("../webview/webview");
const cancellation_1 = require("@theia/core/lib/common/cancellation");
const uuid_1 = require("uuid");
const core_1 = require("@theia/core");
exports.PLUGIN_VIEW_FACTORY_ID = 'plugin-view';
exports.PLUGIN_VIEW_CONTAINER_FACTORY_ID = 'plugin-view-container';
exports.PLUGIN_VIEW_DATA_FACTORY_ID = 'plugin-view-data';
let PluginViewRegistry = PluginViewRegistry_1 = class PluginViewRegistry {
    constructor() {
        this.onDidExpandViewEmitter = new event_1.Emitter();
        this.onDidExpandView = this.onDidExpandViewEmitter.event;
        this.views = new Map();
        this.viewsWelcome = new Map();
        this.viewContainers = new Map();
        this.containerViews = new Map();
        this.viewClauseContexts = new Map();
        this.viewDataProviders = new Map();
        this.viewDataState = new Map();
        this.webviewViewResolvers = new Map();
    }
    init() {
        // TODO workbench.panel.comments - Theia does not have a proper comments view yet
        this.updateFocusedView();
        this.shell.onDidChangeActiveWidget(() => this.updateFocusedView());
        this.widgetManager.onWillCreateWidget(({ factoryId, widget, waitUntil }) => {
            if (factoryId === browser_2.EXPLORER_VIEW_CONTAINER_ID && widget instanceof browser_1.ViewContainer) {
                waitUntil(this.prepareViewContainer('explorer', widget));
            }
            if (factoryId === scm_contribution_1.SCM_VIEW_CONTAINER_ID && widget instanceof browser_1.ViewContainer) {
                waitUntil(this.prepareViewContainer('scm', widget));
            }
            if (factoryId === search_in_workspace_factory_1.SEARCH_VIEW_CONTAINER_ID && widget instanceof browser_1.ViewContainer) {
                waitUntil(this.prepareViewContainer('search', widget));
            }
            if (factoryId === debug_widget_1.DebugWidget.ID && widget instanceof debug_widget_1.DebugWidget) {
                const viewContainer = widget['sessionWidget']['viewContainer'];
                waitUntil(this.prepareViewContainer('debug', viewContainer));
            }
            if (factoryId === exports.PLUGIN_VIEW_CONTAINER_FACTORY_ID && widget instanceof browser_1.ViewContainer) {
                waitUntil(this.prepareViewContainer(this.toViewContainerId(widget.options), widget));
            }
            if (factoryId === exports.PLUGIN_VIEW_FACTORY_ID && widget instanceof plugin_view_widget_1.PluginViewWidget) {
                waitUntil(this.prepareView(widget));
            }
        });
        this.widgetManager.onDidCreateWidget(event => {
            if (event.widget instanceof browser_2.FileNavigatorWidget) {
                const disposable = new disposable_1.DisposableCollection();
                disposable.push(this.registerViewWelcome({
                    view: 'explorer',
                    content: core_1.nls.localizeByDefault('You have not yet opened a folder.\n{0}', `[${core_1.nls.localizeByDefault('Open Folder')}](command:workbench.action.files.openFolder)`),
                    order: 0
                }));
                disposable.push(event.widget.onDidDispose(() => disposable.dispose()));
            }
        });
        this.doRegisterViewContainer('test', 'left', {
            label: core_1.nls.localizeByDefault('Test'),
            iconClass: (0, browser_1.codicon)('beaker'),
            closeable: true
        });
        this.contextKeyService.onDidChange(e => {
            for (const [, view] of this.views.values()) {
                const clauseContext = this.viewClauseContexts.get(view.id);
                if (clauseContext && e.affects(clauseContext)) {
                    this.updateViewVisibility(view.id);
                }
            }
            for (const [viewId, viewWelcomes] of this.viewsWelcome) {
                for (const [index] of viewWelcomes.entries()) {
                    const viewWelcomeId = this.toViewWelcomeId(index, viewId);
                    const clauseContext = this.viewClauseContexts.get(viewWelcomeId);
                    if (clauseContext && e.affects(clauseContext)) {
                        this.updateViewWelcomeVisibility(viewId);
                    }
                }
            }
        });
        const hookDockPanelKey = (panel, key) => {
            let toDisposeOnActivate = new disposable_1.DisposableCollection();
            panel.onDidChangeCurrent(title => {
                toDisposeOnActivate.dispose();
                toDisposeOnActivate = new disposable_1.DisposableCollection();
                if (title && title.owner instanceof browser_1.BaseWidget) {
                    const widget = title.owner;
                    let value = PluginViewRegistry_1.ID_MAPPINGS.get(widget.id);
                    if (!value) {
                        if (widget.id.startsWith(exports.PLUGIN_VIEW_CONTAINER_FACTORY_ID)) {
                            value = this.toViewContainerId({ id: widget.id });
                        }
                    }
                    const setKey = () => {
                        if (widget.isVisible && value) {
                            key.set(value);
                        }
                        else {
                            key.reset();
                        }
                    };
                    toDisposeOnActivate.push(widget.onDidChangeVisibility(() => {
                        setKey();
                    }));
                    setKey();
                }
            });
        };
        hookDockPanelKey(this.shell.leftPanelHandler.dockPanel, this.viewContextKeys.activeViewlet);
        hookDockPanelKey(this.shell.rightPanelHandler.dockPanel, this.viewContextKeys.activeAuxiliary);
        hookDockPanelKey(this.shell.bottomPanel, this.viewContextKeys.activePanel);
    }
    async updateViewWelcomeVisibility(viewId) {
        const widget = await this.getTreeViewWelcomeWidget(viewId);
        if (widget) {
            widget.handleWelcomeContextChange();
        }
    }
    async updateViewVisibility(viewId) {
        const widget = await this.getView(viewId);
        if (!widget) {
            if (this.isViewVisible(viewId)) {
                await this.openView(viewId);
            }
            return;
        }
        const viewInfo = this.views.get(viewId);
        if (!viewInfo) {
            return;
        }
        const [viewContainerId] = viewInfo;
        const viewContainer = await this.getPluginViewContainer(viewContainerId);
        if (!viewContainer) {
            return;
        }
        const part = viewContainer.getPartFor(widget);
        if (!part) {
            return;
        }
        widget.updateViewVisibility(() => part.setHidden(!this.isViewVisible(viewId)));
    }
    isViewVisible(viewId) {
        const viewInfo = this.views.get(viewId);
        if (!viewInfo) {
            return false;
        }
        const [, view] = viewInfo;
        return view.when === undefined || view.when === 'true' || this.contextKeyService.match(view.when);
    }
    registerViewContainer(location, viewContainer) {
        var _a;
        if (this.viewContainers.has(viewContainer.id)) {
            console.warn('view container such id already registered: ', JSON.stringify(viewContainer));
            return disposable_1.Disposable.NULL;
        }
        const toDispose = new disposable_1.DisposableCollection();
        const containerClass = 'theia-plugin-view-container';
        let themeIconClass = '';
        const iconClass = 'plugin-view-container-icon-' + viewContainer.id;
        if (viewContainer.themeIcon) {
            const icon = themeService_1.ThemeIcon.fromString(viewContainer.themeIcon);
            if (icon) {
                themeIconClass = (_a = themeService_1.ThemeIcon.asClassName(icon)) !== null && _a !== void 0 ? _a : '';
            }
        }
        if (!themeIconClass) {
            const iconUrl = plugin_shared_style_1.PluginSharedStyle.toExternalIconUrl(viewContainer.iconUrl);
            toDispose.push(this.style.insertRule('.' + containerClass + '.' + iconClass, () => `
                mask: url('${iconUrl}') no-repeat 50% 50%;
                -webkit-mask: url('${iconUrl}') no-repeat 50% 50%;
            `));
        }
        toDispose.push(this.doRegisterViewContainer(viewContainer.id, location, {
            label: viewContainer.title,
            // The container class automatically sets a mask; if we're using a theme icon, we don't want one.
            iconClass: (themeIconClass || containerClass) + ' ' + iconClass,
            closeable: true
        }));
        return toDispose;
    }
    async toggleViewContainer(id) {
        let widget = await this.getPluginViewContainer(id);
        if (widget && widget.isAttached) {
            widget.dispose();
        }
        else {
            widget = await this.openViewContainer(id);
            if (widget) {
                this.shell.activateWidget(widget.id);
            }
        }
    }
    doRegisterViewContainer(id, location, options) {
        var _a;
        const toDispose = new disposable_1.DisposableCollection();
        this.viewContainers.set(id, [location, options]);
        toDispose.push(disposable_1.Disposable.create(() => this.viewContainers.delete(id)));
        const toggleCommandId = `plugin.view-container.${id}.toggle`;
        toDispose.push(this.commands.registerCommand({
            id: toggleCommandId,
            label: 'Toggle ' + options.label + ' View'
        }, {
            execute: () => this.toggleViewContainer(id)
        }));
        toDispose.push(this.menus.registerMenuAction(browser_1.CommonMenus.VIEW_VIEWS, {
            commandId: toggleCommandId,
            label: options.label
        }));
        toDispose.push((_a = this.quickView) === null || _a === void 0 ? void 0 : _a.registerItem({
            label: options.label,
            open: async () => {
                const widget = await this.openViewContainer(id);
                if (widget) {
                    this.shell.activateWidget(widget.id);
                }
            }
        }));
        toDispose.push(disposable_1.Disposable.create(async () => {
            const widget = await this.getPluginViewContainer(id);
            if (widget) {
                widget.dispose();
            }
        }));
        return toDispose;
    }
    getContainerViews(viewContainerId) {
        return this.containerViews.get(viewContainerId) || [];
    }
    registerView(viewContainerId, view) {
        var _a, _b;
        if (this.views.has(view.id)) {
            console.warn('view with such id already registered: ', JSON.stringify(view));
            return disposable_1.Disposable.NULL;
        }
        const toDispose = new disposable_1.DisposableCollection();
        view.when = (_a = view.when) === null || _a === void 0 ? void 0 : _a.trim();
        this.views.set(view.id, [viewContainerId, view]);
        toDispose.push(disposable_1.Disposable.create(() => this.views.delete(view.id)));
        const containerViews = this.getContainerViews(viewContainerId);
        containerViews.push(view.id);
        this.containerViews.set(viewContainerId, containerViews);
        toDispose.push(disposable_1.Disposable.create(() => {
            const index = containerViews.indexOf(view.id);
            if (index !== -1) {
                containerViews.splice(index, 1);
            }
        }));
        if (view.when && view.when !== 'false' && view.when !== 'true') {
            const keys = this.contextKeyService.parseKeys(view.when);
            if (keys) {
                this.viewClauseContexts.set(view.id, keys);
                toDispose.push(disposable_1.Disposable.create(() => this.viewClauseContexts.delete(view.id)));
            }
        }
        toDispose.push((_b = this.quickView) === null || _b === void 0 ? void 0 : _b.registerItem({
            label: view.name,
            when: view.when,
            open: () => this.openView(view.id, { activate: true })
        }));
        toDispose.push(this.commands.registerCommand({ id: `${view.id}.focus` }, {
            execute: async () => { await this.openView(view.id, { activate: true }); }
        }));
        return toDispose;
    }
    async registerWebviewView(viewId, resolver) {
        if (this.webviewViewResolvers.has(viewId)) {
            throw new Error(`View resolver already registered for ${viewId}`);
        }
        this.webviewViewResolvers.set(viewId, resolver);
        const webviewView = await this.createNewWebviewView();
        const token = cancellation_1.CancellationToken.None;
        this.getView(viewId).then(async (view) => {
            if (view) {
                if (view.isVisible) {
                    await this.prepareView(view, webviewView.webview.identifier.id);
                }
                else {
                    const toDisposeOnDidExpandView = new disposable_1.DisposableCollection(this.onDidExpandView(async (id) => {
                        if (id === viewId) {
                            dispose();
                            await this.prepareView(view, webviewView.webview.identifier.id);
                        }
                    }));
                    const dispose = () => toDisposeOnDidExpandView.dispose();
                    view.disposed.connect(dispose);
                    toDisposeOnDidExpandView.push(disposable_1.Disposable.create(() => view.disposed.disconnect(dispose)));
                }
            }
        });
        resolver.resolve(webviewView, token);
        return disposable_1.Disposable.create(() => {
            this.webviewViewResolvers.delete(viewId);
        });
    }
    async createNewWebviewView() {
        const webview = await this.widgetManager.getOrCreateWidget(webview_1.WebviewWidget.FACTORY_ID, { id: (0, uuid_1.v4)() });
        webview.setContentOptions({ allowScripts: true });
        let _description;
        return {
            webview,
            get onDidChangeVisibility() { return webview.onDidChangeVisibility; },
            get onDidDispose() { return webview.onDidDispose; },
            get title() { return webview.title.label; },
            set title(value) { webview.title.label = value || ''; },
            get description() { return _description; },
            set description(value) { _description = value; },
            get badge() { return webview.badge; },
            set badge(badge) { webview.badge = badge; },
            get badgeTooltip() { return webview.badgeTooltip; },
            set badgeTooltip(badgeTooltip) { webview.badgeTooltip = badgeTooltip; },
            onDidChangeBadge: webview.onDidChangeBadge,
            onDidChangeBadgeTooltip: webview.onDidChangeBadgeTooltip,
            dispose: webview.dispose,
            show: webview.show
        };
    }
    registerViewWelcome(viewWelcome) {
        const toDispose = new disposable_1.DisposableCollection();
        const viewsWelcome = this.viewsWelcome.get(viewWelcome.view) || [];
        if (viewsWelcome.some(e => e.content === viewWelcome.content)) {
            return toDispose;
        }
        viewsWelcome.push(viewWelcome);
        this.viewsWelcome.set(viewWelcome.view, viewsWelcome);
        this.handleViewWelcomeChange(viewWelcome.view);
        toDispose.push(disposable_1.Disposable.create(() => {
            const index = viewsWelcome.indexOf(viewWelcome);
            if (index !== -1) {
                viewsWelcome.splice(index, 1);
            }
            this.handleViewWelcomeChange(viewWelcome.view);
        }));
        if (viewWelcome.when) {
            const index = viewsWelcome.indexOf(viewWelcome);
            const viewWelcomeId = this.toViewWelcomeId(index, viewWelcome.view);
            this.viewClauseContexts.set(viewWelcomeId, this.contextKeyService.parseKeys(viewWelcome.when));
            toDispose.push(disposable_1.Disposable.create(() => this.viewClauseContexts.delete(viewWelcomeId)));
        }
        return toDispose;
    }
    async handleViewWelcomeChange(viewId) {
        const widget = await this.getTreeViewWelcomeWidget(viewId);
        if (widget) {
            widget.handleViewWelcomeContentChange(this.getViewWelcomes(viewId));
        }
    }
    async getTreeViewWelcomeWidget(viewId) {
        switch (viewId) {
            case 'explorer':
                return this.widgetManager.getWidget(browser_2.FILE_NAVIGATOR_ID);
            default:
                return this.widgetManager.getWidget(exports.PLUGIN_VIEW_DATA_FACTORY_ID, { id: viewId });
        }
    }
    getViewWelcomes(viewId) {
        return this.viewsWelcome.get(viewId) || [];
    }
    async getView(viewId) {
        if (!this.views.has(viewId)) {
            return undefined;
        }
        return this.widgetManager.getWidget(exports.PLUGIN_VIEW_FACTORY_ID, this.toPluginViewWidgetIdentifier(viewId));
    }
    async openView(viewId, options) {
        const view = await this.doOpenView(viewId);
        if (view && options) {
            if (options.activate === true) {
                await this.shell.activateWidget(view.id);
            }
            else if (options.reveal === true) {
                await this.shell.revealWidget(view.id);
            }
        }
        return view;
    }
    async doOpenView(viewId) {
        const widget = await this.getView(viewId);
        if (widget) {
            return widget;
        }
        const data = this.views.get(viewId);
        if (!data) {
            return undefined;
        }
        const [containerId] = data;
        await this.openViewContainer(containerId);
        return this.getView(viewId);
    }
    async prepareView(widget, webviewId) {
        const data = this.views.get(widget.options.viewId);
        if (!data) {
            return;
        }
        const [, view] = data;
        if (!widget.title.label) {
            widget.title.label = view.name;
        }
        const currentDataWidget = widget.widgets[0];
        const viewDataWidget = await this.createViewDataWidget(view.id, webviewId);
        if (widget.isDisposed) {
            viewDataWidget === null || viewDataWidget === void 0 ? void 0 : viewDataWidget.dispose();
            return;
        }
        if (currentDataWidget !== viewDataWidget) {
            if (currentDataWidget) {
                currentDataWidget.dispose();
            }
            if (viewDataWidget) {
                widget.addWidget(viewDataWidget);
            }
        }
    }
    getOrCreateViewContainerWidget(containerId) {
        const identifier = this.toViewContainerIdentifier(containerId);
        return this.widgetManager.getOrCreateWidget(exports.PLUGIN_VIEW_CONTAINER_FACTORY_ID, identifier);
    }
    async openViewContainer(containerId) {
        if (containerId === 'explorer') {
            const widget = await this.explorer.openView();
            if (widget.parent instanceof browser_1.ViewContainer) {
                return widget.parent;
            }
            return undefined;
        }
        if (containerId === 'scm') {
            const widget = await this.scm.openView();
            if (widget.parent instanceof browser_1.ViewContainer) {
                return widget.parent;
            }
            return undefined;
        }
        if (containerId === 'debug') {
            const widget = await this.debug.openView();
            return widget['sessionWidget']['viewContainer'];
        }
        const data = this.viewContainers.get(containerId);
        if (!data) {
            return undefined;
        }
        const [location] = data;
        const containerWidget = await this.getOrCreateViewContainerWidget(containerId);
        if (!containerWidget.isAttached) {
            await this.shell.addWidget(containerWidget, {
                area: browser_1.ApplicationShell.isSideArea(location) ? location : 'left',
                rank: Number.MAX_SAFE_INTEGER
            });
        }
        return containerWidget;
    }
    async prepareViewContainer(viewContainerId, containerWidget) {
        const data = this.viewContainers.get(viewContainerId);
        if (data) {
            const [, options] = data;
            containerWidget.setTitleOptions(options);
        }
        for (const viewId of this.getContainerViews(viewContainerId)) {
            const identifier = this.toPluginViewWidgetIdentifier(viewId);
            // Keep existing widget in its current container and reregister its part to the plugin view widget events.
            const existingWidget = this.widgetManager.tryGetWidget(exports.PLUGIN_VIEW_FACTORY_ID, identifier);
            if (existingWidget && existingWidget.currentViewContainerId) {
                const currentContainer = await this.getPluginViewContainer(existingWidget.currentViewContainerId);
                if (currentContainer && this.registerWidgetPartEvents(existingWidget, currentContainer)) {
                    continue;
                }
            }
            const widget = await this.widgetManager.getOrCreateWidget(exports.PLUGIN_VIEW_FACTORY_ID, identifier);
            if (containerWidget.getTrackableWidgets().indexOf(widget) === -1) {
                containerWidget.addWidget(widget, {
                    initiallyCollapsed: !!containerWidget.getParts().length,
                    initiallyHidden: !this.isViewVisible(viewId)
                });
            }
            this.registerWidgetPartEvents(widget, containerWidget);
        }
    }
    registerWidgetPartEvents(widget, containerWidget) {
        const part = containerWidget.getPartFor(widget);
        if (part) {
            widget.currentViewContainerId = this.getViewContainerId(containerWidget);
            part.onDidMove(event => { widget.currentViewContainerId = this.getViewContainerId(event); });
            // if a view is explicitly hidden then suppress updating visibility based on `when` closure
            part.onDidChangeVisibility(() => widget.suppressUpdateViewVisibility = part.isHidden);
            const tryFireOnDidExpandView = () => {
                if (widget.widgets.length === 0) {
                    if (!part.collapsed && part.isVisible) {
                        const viewId = this.toViewId(widget.options);
                        this.onDidExpandViewEmitter.fire(viewId);
                    }
                }
                else {
                    toFire.dispose();
                }
            };
            const toFire = new disposable_1.DisposableCollection(part.onCollapsed(tryFireOnDidExpandView), part.onDidChangeVisibility(tryFireOnDidExpandView));
            tryFireOnDidExpandView();
            return part;
        }
    }
    ;
    getViewContainerId(container) {
        var _a;
        const description = this.widgetManager.getDescription(container);
        switch (description === null || description === void 0 ? void 0 : description.factoryId) {
            case browser_2.EXPLORER_VIEW_CONTAINER_ID: return 'explorer';
            case scm_contribution_1.SCM_VIEW_CONTAINER_ID: return 'scm';
            case search_in_workspace_factory_1.SEARCH_VIEW_CONTAINER_ID: return 'search';
            case undefined: return ((_a = container.parent) === null || _a === void 0 ? void 0 : _a.parent) instanceof debug_widget_1.DebugWidget ? 'debug' : container.id;
            case exports.PLUGIN_VIEW_CONTAINER_FACTORY_ID: return this.toViewContainerId(description.options);
            default: return container.id;
        }
    }
    async getPluginViewContainer(viewContainerId) {
        if (viewContainerId === 'explorer') {
            return this.widgetManager.getWidget(browser_2.EXPLORER_VIEW_CONTAINER_ID);
        }
        if (viewContainerId === 'scm') {
            return this.widgetManager.getWidget(scm_contribution_1.SCM_VIEW_CONTAINER_ID);
        }
        if (viewContainerId === 'search') {
            return this.widgetManager.getWidget(search_in_workspace_factory_1.SEARCH_VIEW_CONTAINER_ID);
        }
        if (viewContainerId === 'debug') {
            const debug = await this.widgetManager.getWidget(debug_widget_1.DebugWidget.ID);
            if (debug instanceof debug_widget_1.DebugWidget) {
                return debug['sessionWidget']['viewContainer'];
            }
        }
        const identifier = this.toViewContainerIdentifier(viewContainerId);
        return this.widgetManager.getWidget(exports.PLUGIN_VIEW_CONTAINER_FACTORY_ID, identifier);
    }
    async initViewContainer(containerId) {
        let viewContainer = await this.getPluginViewContainer(containerId);
        if (!viewContainer) {
            viewContainer = await this.openViewContainer(containerId);
            if (viewContainer && !viewContainer.getParts().filter(part => !part.isHidden).length) {
                // close view containers without any visible view parts
                viewContainer.dispose();
            }
        }
        else {
            await this.prepareViewContainer(this.toViewContainerId(viewContainer.options), viewContainer);
        }
    }
    async initWidgets() {
        const promises = [];
        for (const id of this.viewContainers.keys()) {
            promises.push((async () => {
                await this.initViewContainer(id);
            })().catch(console.error));
        }
        promises.push((async () => {
            const explorer = await this.widgetManager.getWidget(browser_2.EXPLORER_VIEW_CONTAINER_ID);
            if (explorer instanceof browser_1.ViewContainer) {
                await this.prepareViewContainer('explorer', explorer);
            }
        })().catch(console.error));
        promises.push((async () => {
            const scm = await this.widgetManager.getWidget(scm_contribution_1.SCM_VIEW_CONTAINER_ID);
            if (scm instanceof browser_1.ViewContainer) {
                await this.prepareViewContainer('scm', scm);
            }
        })().catch(console.error));
        promises.push((async () => {
            const search = await this.widgetManager.getWidget(search_in_workspace_factory_1.SEARCH_VIEW_CONTAINER_ID);
            if (search instanceof browser_1.ViewContainer) {
                await this.prepareViewContainer('search', search);
            }
        })().catch(console.error));
        promises.push((async () => {
            const debug = await this.widgetManager.getWidget(debug_widget_1.DebugWidget.ID);
            if (debug instanceof debug_widget_1.DebugWidget) {
                const viewContainer = debug['sessionWidget']['viewContainer'];
                await this.prepareViewContainer('debug', viewContainer);
            }
        })().catch(console.error));
        await Promise.all(promises);
    }
    async removeStaleWidgets() {
        const views = this.widgetManager.getWidgets(exports.PLUGIN_VIEW_FACTORY_ID);
        for (const view of views) {
            if (view instanceof plugin_view_widget_1.PluginViewWidget) {
                const id = this.toViewId(view.options);
                if (!this.views.has(id)) {
                    view.dispose();
                }
            }
        }
        const viewContainers = this.widgetManager.getWidgets(exports.PLUGIN_VIEW_CONTAINER_FACTORY_ID);
        for (const viewContainer of viewContainers) {
            if (viewContainer instanceof browser_1.ViewContainer) {
                const id = this.toViewContainerId(viewContainer.options);
                if (!this.viewContainers.has(id)) {
                    viewContainer.dispose();
                }
            }
        }
    }
    toViewContainerIdentifier(viewContainerId) {
        return { id: exports.PLUGIN_VIEW_CONTAINER_FACTORY_ID + ':' + viewContainerId, progressLocationId: viewContainerId };
    }
    toViewContainerId(identifier) {
        return identifier.id.substring(exports.PLUGIN_VIEW_CONTAINER_FACTORY_ID.length + 1);
    }
    toPluginViewWidgetIdentifier(viewId) {
        return { id: exports.PLUGIN_VIEW_FACTORY_ID + ':' + viewId, viewId };
    }
    toViewId(identifier) {
        return identifier.viewId;
    }
    toViewWelcomeId(index, viewId) {
        return `view-welcome.${viewId}.${index}`;
    }
    /**
     * retrieve restored layout state from previous user session but close widgets
     * widgets should be opened only when view data providers are registered
     */
    onDidInitializeLayout() {
        const widgets = this.widgetManager.getWidgets(exports.PLUGIN_VIEW_DATA_FACTORY_ID);
        for (const widget of widgets) {
            if (browser_1.StatefulWidget.is(widget)) {
                const state = widget.storeState();
                if (state) {
                    this.viewDataState.set(widget.id, state);
                }
            }
            widget.dispose();
        }
    }
    registerViewDataProvider(viewId, provider) {
        if (this.viewDataProviders.has(viewId)) {
            console.error(`data provider for '${viewId}' view is already registered`);
            return disposable_1.Disposable.NULL;
        }
        this.viewDataProviders.set(viewId, provider);
        const toDispose = new disposable_1.DisposableCollection(disposable_1.Disposable.create(() => {
            this.viewDataProviders.delete(viewId);
            this.viewDataState.delete(viewId);
        }));
        this.getView(viewId).then(async (view) => {
            if (toDispose.disposed) {
                return;
            }
            if (view) {
                if (view.isVisible) {
                    await this.prepareView(view);
                }
                else {
                    const toDisposeOnDidExpandView = new disposable_1.DisposableCollection(this.onDidExpandView(async (id) => {
                        if (id === viewId) {
                            unsubscribe();
                            await this.prepareView(view);
                        }
                    }));
                    const unsubscribe = () => toDisposeOnDidExpandView.dispose();
                    view.disposed.connect(unsubscribe);
                    toDisposeOnDidExpandView.push(disposable_1.Disposable.create(() => view.disposed.disconnect(unsubscribe)));
                    toDispose.push(toDisposeOnDidExpandView);
                }
            }
        });
        return toDispose;
    }
    async createViewDataWidget(viewId, webviewId) {
        var _a;
        const view = this.views.get(viewId);
        if (((_a = view === null || view === void 0 ? void 0 : view[1]) === null || _a === void 0 ? void 0 : _a.type) === common_1.PluginViewType.Webview) {
            const webviewWidget = this.widgetManager.getWidget(webview_1.WebviewWidget.FACTORY_ID, { id: webviewId });
            return webviewWidget;
        }
        const provider = this.viewDataProviders.get(viewId);
        if (!view || !provider) {
            return undefined;
        }
        const [, viewInfo] = view;
        const state = this.viewDataState.get(viewId);
        const widget = await provider({ state, viewInfo });
        widget.handleViewWelcomeContentChange(this.getViewWelcomes(viewId));
        if (browser_1.StatefulWidget.is(widget)) {
            this.storeViewDataStateOnDispose(viewId, widget);
        }
        else {
            this.viewDataState.delete(viewId);
        }
        return widget;
    }
    storeViewDataStateOnDispose(viewId, widget) {
        const dispose = widget.dispose.bind(widget);
        widget.dispose = () => {
            const state = widget.storeState();
            if (state) {
                this.viewDataState.set(viewId, state);
            }
            dispose();
        };
    }
    isVisibleWidget(widget) {
        return !widget.isDisposed && widget.isVisible;
    }
    updateFocusedView() {
        const widget = this.shell.activeWidget;
        if (widget instanceof plugin_view_widget_1.PluginViewWidget) {
            this.viewContextKeys.focusedView.set(widget.options.viewId);
        }
        else {
            this.viewContextKeys.focusedView.reset();
        }
    }
};
PluginViewRegistry.ID_MAPPINGS = new Map([
    // VS Code Viewlets
    [browser_2.EXPLORER_VIEW_CONTAINER_ID, 'workbench.view.explorer'],
    [scm_contribution_1.SCM_VIEW_CONTAINER_ID, 'workbench.view.scm'],
    [search_in_workspace_factory_1.SEARCH_VIEW_CONTAINER_ID, 'workbench.view.search'],
    [debug_widget_1.DebugWidget.ID, 'workbench.view.debug'],
    ['vsx-extensions-view-container', 'workbench.view.extensions'],
    [problem_widget_1.PROBLEMS_WIDGET_ID, 'workbench.panel.markers'],
    [output_widget_1.OutputWidget.ID, 'workbench.panel.output'],
    [debug_console_contribution_1.DebugConsoleContribution.options.id, 'workbench.panel.repl'],
    // Theia does not have a single terminal widget, but instead each terminal gets its own widget. Therefore "the terminal widget is active" doesn't make sense in Theia
    // [TERMINAL_WIDGET_FACTORY_ID, 'workbench.panel.terminal'],
    // [?? , 'workbench.panel.comments'] not sure what this mean: we don't show comments in sidebars nor the bottom
]);
__decorate([
    (0, inversify_1.inject)(browser_1.ApplicationShell),
    __metadata("design:type", browser_1.ApplicationShell)
], PluginViewRegistry.prototype, "shell", void 0);
__decorate([
    (0, inversify_1.inject)(plugin_shared_style_1.PluginSharedStyle),
    __metadata("design:type", plugin_shared_style_1.PluginSharedStyle)
], PluginViewRegistry.prototype, "style", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.WidgetManager),
    __metadata("design:type", browser_1.WidgetManager)
], PluginViewRegistry.prototype, "widgetManager", void 0);
__decorate([
    (0, inversify_1.inject)(scm_contribution_1.ScmContribution),
    __metadata("design:type", scm_contribution_1.ScmContribution)
], PluginViewRegistry.prototype, "scm", void 0);
__decorate([
    (0, inversify_1.inject)(navigator_contribution_1.FileNavigatorContribution),
    __metadata("design:type", navigator_contribution_1.FileNavigatorContribution)
], PluginViewRegistry.prototype, "explorer", void 0);
__decorate([
    (0, inversify_1.inject)(debug_frontend_application_contribution_1.DebugFrontendApplicationContribution),
    __metadata("design:type", debug_frontend_application_contribution_1.DebugFrontendApplicationContribution)
], PluginViewRegistry.prototype, "debug", void 0);
__decorate([
    (0, inversify_1.inject)(command_1.CommandRegistry),
    __metadata("design:type", command_1.CommandRegistry)
], PluginViewRegistry.prototype, "commands", void 0);
__decorate([
    (0, inversify_1.inject)(menu_1.MenuModelRegistry),
    __metadata("design:type", menu_1.MenuModelRegistry)
], PluginViewRegistry.prototype, "menus", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.QuickViewService),
    (0, inversify_1.optional)(),
    __metadata("design:type", browser_1.QuickViewService)
], PluginViewRegistry.prototype, "quickView", void 0);
__decorate([
    (0, inversify_1.inject)(context_key_service_1.ContextKeyService),
    __metadata("design:type", Object)
], PluginViewRegistry.prototype, "contextKeyService", void 0);
__decorate([
    (0, inversify_1.inject)(view_context_key_service_1.ViewContextKeyService),
    __metadata("design:type", view_context_key_service_1.ViewContextKeyService)
], PluginViewRegistry.prototype, "viewContextKeys", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PluginViewRegistry.prototype, "init", null);
PluginViewRegistry = PluginViewRegistry_1 = __decorate([
    (0, inversify_1.injectable)()
], PluginViewRegistry);
exports.PluginViewRegistry = PluginViewRegistry;
//# sourceMappingURL=plugin-view-registry.js.map