(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_core_shared_vscode-languageserver-protocol_index_js-packages_timeline_lib_browser_ti-3a0a5b"],{

/***/ "../../packages/core/lib/browser/widgets/alert-message.js":
/*!****************************************************************!*\
  !*** ../../packages/core/lib/browser/widgets/alert-message.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2018 Ericsson and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AlertMessage = void 0;
const React = __webpack_require__(/*! react */ "../../node_modules/react/index.js");
const widget_1 = __webpack_require__(/*! ./widget */ "../../packages/core/lib/browser/widgets/widget.js");
const AlertMessageIcon = {
    INFO: (0, widget_1.codicon)('info'),
    SUCCESS: (0, widget_1.codicon)('pass'),
    WARNING: (0, widget_1.codicon)('warning'),
    ERROR: (0, widget_1.codicon)('error')
};
class AlertMessage extends React.Component {
    render() {
        return React.createElement("div", { className: 'theia-alert-message-container' },
            React.createElement("div", { className: `theia-${this.props.type.toLowerCase()}-alert` },
                React.createElement("div", { className: 'theia-message-header' },
                    React.createElement("i", { className: AlertMessageIcon[this.props.type] }),
                    "\u00A0",
                    this.props.header),
                React.createElement("div", { className: 'theia-message-content' }, this.props.children)));
    }
}
exports.AlertMessage = AlertMessage;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/lib/browser/widgets/alert-message'] = this;


/***/ }),

/***/ "../../packages/core/shared/@phosphor/algorithm/index.js":
/*!***************************************************************!*\
  !*** ../../packages/core/shared/@phosphor/algorithm/index.js ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! @phosphor/algorithm */ "../../node_modules/@phosphor/algorithm/lib/index.js");

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/shared/@phosphor/algorithm'] = this;


/***/ }),

/***/ "../../packages/core/shared/vscode-languageserver-protocol/index.js":
/*!**************************************************************************!*\
  !*** ../../packages/core/shared/vscode-languageserver-protocol/index.js ***!
  \**************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! vscode-languageserver-protocol */ "../../node_modules/vscode-languageserver-protocol/lib/browser/main.js");

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/shared/vscode-languageserver-protocol'] = this;


/***/ }),

/***/ "../../packages/core/shared/vscode-uri/index.js":
/*!******************************************************!*\
  !*** ../../packages/core/shared/vscode-uri/index.js ***!
  \******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! vscode-uri */ "../../node_modules/vscode-uri/lib/esm/index.js");

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/shared/vscode-uri'] = this;


/***/ }),

/***/ "../../packages/timeline/lib/browser/timeline-contribution.js":
/*!********************************************************************!*\
  !*** ../../packages/timeline/lib/browser/timeline-contribution.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2020 RedHat and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TimelineContribution = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const browser_2 = __webpack_require__(/*! @theia/navigator/lib/browser */ "../../packages/navigator/lib/browser/index.js");
const timeline_widget_1 = __webpack_require__(/*! ./timeline-widget */ "../../packages/timeline/lib/browser/timeline-widget.js");
const timeline_service_1 = __webpack_require__(/*! ./timeline-service */ "../../packages/timeline/lib/browser/timeline-service.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const tab_bar_toolbar_1 = __webpack_require__(/*! @theia/core/lib/browser/shell/tab-bar-toolbar */ "../../packages/core/lib/browser/shell/tab-bar-toolbar/index.js");
const algorithm_1 = __webpack_require__(/*! @theia/core/shared/@phosphor/algorithm */ "../../packages/core/shared/@phosphor/algorithm/index.js");
const timeline_tree_model_1 = __webpack_require__(/*! ./timeline-tree-model */ "../../packages/timeline/lib/browser/timeline-tree-model.js");
let TimelineContribution = class TimelineContribution {
    constructor() {
        this.toolbarItem = {
            id: 'timeline-refresh-toolbar-item',
            command: 'timeline-refresh',
            tooltip: 'Refresh',
            icon: (0, browser_1.codicon)('refresh')
        };
    }
    registerToolbarItems(registry) {
        registry.registerItem(this.toolbarItem);
    }
    registerCommands(commands) {
        const attachTimeline = async (explorer) => {
            const timeline = await this.widgetManager.getOrCreateWidget(timeline_widget_1.TimelineWidget.ID);
            if (explorer instanceof browser_1.ViewContainer && explorer.getTrackableWidgets().indexOf(timeline) === -1) {
                explorer.addWidget(timeline, { initiallyCollapsed: true });
            }
        };
        this.widgetManager.onWillCreateWidget(async (event) => {
            if (event.widget.id === browser_2.EXPLORER_VIEW_CONTAINER_ID && this.timelineService.getSources().length > 0) {
                event.waitUntil(attachTimeline(event.widget));
            }
        });
        this.timelineService.onDidChangeProviders(async (event) => {
            const explorer = await this.widgetManager.getWidget(browser_2.EXPLORER_VIEW_CONTAINER_ID);
            if (explorer && event.added && event.added.length > 0) {
                attachTimeline(explorer);
            }
            else if (event.removed && this.timelineService.getSources().length === 0) {
                const timeline = await this.widgetManager.getWidget(timeline_widget_1.TimelineWidget.ID);
                if (timeline) {
                    timeline.close();
                }
            }
        });
        commands.registerCommand(timeline_tree_model_1.LOAD_MORE_COMMAND, {
            execute: async () => {
                const widget = (0, algorithm_1.toArray)(this.shell.mainPanel.widgets()).find(w => browser_1.Navigatable.is(w) && w.isVisible && !w.isHidden);
                if (browser_1.Navigatable.is(widget)) {
                    const uri = widget.getResourceUri();
                    const timeline = await this.widgetManager.getWidget(timeline_widget_1.TimelineWidget.ID);
                    if (uri && timeline) {
                        timeline.loadTimeline(uri, false);
                    }
                }
            }
        });
        commands.registerCommand({ id: this.toolbarItem.command }, {
            execute: widget => this.checkWidget(widget, async () => {
                const timeline = await this.widgetManager.getWidget(timeline_widget_1.TimelineWidget.ID);
                if (timeline) {
                    timeline.update();
                }
            }),
            isEnabled: widget => this.checkWidget(widget, () => true),
            isVisible: widget => this.checkWidget(widget, () => true)
        });
    }
    checkWidget(widget, cb) {
        if (widget instanceof timeline_widget_1.TimelineWidget && widget.id === timeline_widget_1.TimelineWidget.ID) {
            return cb();
        }
        return false;
    }
};
/** @deprecated @since 1.28.0. Import from timeline-tree-model instead */
TimelineContribution.LOAD_MORE_COMMAND = timeline_tree_model_1.LOAD_MORE_COMMAND;
__decorate([
    (0, inversify_1.inject)(browser_1.WidgetManager),
    __metadata("design:type", browser_1.WidgetManager)
], TimelineContribution.prototype, "widgetManager", void 0);
__decorate([
    (0, inversify_1.inject)(timeline_service_1.TimelineService),
    __metadata("design:type", timeline_service_1.TimelineService)
], TimelineContribution.prototype, "timelineService", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.CommandRegistry),
    __metadata("design:type", common_1.CommandRegistry)
], TimelineContribution.prototype, "commandRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(tab_bar_toolbar_1.TabBarToolbarRegistry),
    __metadata("design:type", tab_bar_toolbar_1.TabBarToolbarRegistry)
], TimelineContribution.prototype, "tabBarToolbar", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.ApplicationShell),
    __metadata("design:type", browser_1.ApplicationShell)
], TimelineContribution.prototype, "shell", void 0);
TimelineContribution = __decorate([
    (0, inversify_1.injectable)()
], TimelineContribution);
exports.TimelineContribution = TimelineContribution;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/timeline/lib/browser/timeline-contribution'] = this;


/***/ }),

/***/ "../../packages/timeline/lib/browser/timeline-empty-widget.js":
/*!********************************************************************!*\
  !*** ../../packages/timeline/lib/browser/timeline-empty-widget.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2020 RedHat and others.
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
var TimelineEmptyWidget_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TimelineEmptyWidget = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const alert_message_1 = __webpack_require__(/*! @theia/core/lib/browser/widgets/alert-message */ "../../packages/core/lib/browser/widgets/alert-message.js");
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
let TimelineEmptyWidget = TimelineEmptyWidget_1 = class TimelineEmptyWidget extends browser_1.ReactWidget {
    constructor() {
        super();
        this.addClass('theia-timeline-empty');
        this.id = TimelineEmptyWidget_1.ID;
    }
    render() {
        return React.createElement(alert_message_1.AlertMessage, { type: 'WARNING', header: 'The active editor cannot provide timeline information.' });
    }
};
TimelineEmptyWidget.ID = 'timeline-empty-widget';
TimelineEmptyWidget = TimelineEmptyWidget_1 = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], TimelineEmptyWidget);
exports.TimelineEmptyWidget = TimelineEmptyWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/timeline/lib/browser/timeline-empty-widget'] = this;


/***/ }),

/***/ "../../packages/timeline/lib/browser/timeline-frontend-module.js":
/*!***********************************************************************!*\
  !*** ../../packages/timeline/lib/browser/timeline-frontend-module.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2020 RedHat and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createTimelineTreeContainer = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const widget_manager_1 = __webpack_require__(/*! @theia/core/lib/browser/widget-manager */ "../../packages/core/lib/browser/widget-manager.js");
const timeline_service_1 = __webpack_require__(/*! ./timeline-service */ "../../packages/timeline/lib/browser/timeline-service.js");
const timeline_widget_1 = __webpack_require__(/*! ./timeline-widget */ "../../packages/timeline/lib/browser/timeline-widget.js");
const timeline_tree_widget_1 = __webpack_require__(/*! ./timeline-tree-widget */ "../../packages/timeline/lib/browser/timeline-tree-widget.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const timeline_tree_model_1 = __webpack_require__(/*! ./timeline-tree-model */ "../../packages/timeline/lib/browser/timeline-tree-model.js");
const timeline_empty_widget_1 = __webpack_require__(/*! ./timeline-empty-widget */ "../../packages/timeline/lib/browser/timeline-empty-widget.js");
const timeline_context_key_service_1 = __webpack_require__(/*! ./timeline-context-key-service */ "../../packages/timeline/lib/browser/timeline-context-key-service.js");
const timeline_contribution_1 = __webpack_require__(/*! ./timeline-contribution */ "../../packages/timeline/lib/browser/timeline-contribution.js");
__webpack_require__(/*! ../../src/browser/style/index.css */ "../../packages/timeline/src/browser/style/index.css");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const tab_bar_toolbar_1 = __webpack_require__(/*! @theia/core/lib/browser/shell/tab-bar-toolbar */ "../../packages/core/lib/browser/shell/tab-bar-toolbar/index.js");
exports["default"] = new inversify_1.ContainerModule(bind => {
    bind(timeline_contribution_1.TimelineContribution).toSelf().inSingletonScope();
    bind(common_1.CommandContribution).toService(timeline_contribution_1.TimelineContribution);
    bind(tab_bar_toolbar_1.TabBarToolbarContribution).toService(timeline_contribution_1.TimelineContribution);
    bind(timeline_context_key_service_1.TimelineContextKeyService).toSelf().inSingletonScope();
    bind(timeline_service_1.TimelineService).toSelf().inSingletonScope();
    bind(timeline_widget_1.TimelineWidget).toSelf();
    bind(widget_manager_1.WidgetFactory).toDynamicValue(({ container }) => ({
        id: timeline_widget_1.TimelineWidget.ID,
        createWidget: () => container.get(timeline_widget_1.TimelineWidget)
    })).inSingletonScope();
    bind(timeline_tree_widget_1.TimelineTreeWidget).toDynamicValue(ctx => {
        const child = createTimelineTreeContainer(ctx.container);
        return child.get(timeline_tree_widget_1.TimelineTreeWidget);
    });
    bind(widget_manager_1.WidgetFactory).toDynamicValue(({ container }) => ({
        id: timeline_tree_widget_1.TimelineTreeWidget.ID,
        createWidget: () => container.get(timeline_tree_widget_1.TimelineTreeWidget)
    })).inSingletonScope();
    bind(timeline_empty_widget_1.TimelineEmptyWidget).toSelf();
    bind(widget_manager_1.WidgetFactory).toDynamicValue(({ container }) => ({
        id: timeline_empty_widget_1.TimelineEmptyWidget.ID,
        createWidget: () => container.get(timeline_empty_widget_1.TimelineEmptyWidget)
    })).inSingletonScope();
});
function createTimelineTreeContainer(parent) {
    const child = (0, browser_1.createTreeContainer)(parent, {
        props: {
            virtualized: true,
            search: true
        },
        widget: timeline_tree_widget_1.TimelineTreeWidget,
        model: timeline_tree_model_1.TimelineTreeModel
    });
    return child;
}
exports.createTimelineTreeContainer = createTimelineTreeContainer;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/timeline/lib/browser/timeline-frontend-module'] = this;


/***/ }),

/***/ "../../packages/timeline/lib/browser/timeline-widget.js":
/*!**************************************************************!*\
  !*** ../../packages/timeline/lib/browser/timeline-widget.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2020 RedHat and others.
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
var TimelineWidget_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TimelineWidget = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const timeline_tree_widget_1 = __webpack_require__(/*! ./timeline-tree-widget */ "../../packages/timeline/lib/browser/timeline-tree-widget.js");
const timeline_service_1 = __webpack_require__(/*! ./timeline-service */ "../../packages/timeline/lib/browser/timeline-service.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const timeline_empty_widget_1 = __webpack_require__(/*! ./timeline-empty-widget */ "../../packages/timeline/lib/browser/timeline-empty-widget.js");
const algorithm_1 = __webpack_require__(/*! @theia/core/shared/@phosphor/algorithm */ "../../packages/core/shared/@phosphor/algorithm/index.js");
const vscode_uri_1 = __webpack_require__(/*! @theia/core/shared/vscode-uri */ "../../packages/core/shared/vscode-uri/index.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
let TimelineWidget = TimelineWidget_1 = class TimelineWidget extends browser_1.BaseWidget {
    constructor() {
        super();
        this.timelinesBySource = new Map();
        this.id = TimelineWidget_1.ID;
        this.title.label = nls_1.nls.localizeByDefault('Timeline');
        this.title.caption = this.title.label;
        this.addClass('theia-timeline');
    }
    init() {
        const layout = new browser_1.PanelLayout();
        this.layout = layout;
        this.panel = new browser_1.Panel({ layout: new browser_1.PanelLayout({}) });
        this.panel.node.tabIndex = -1;
        layout.addWidget(this.panel);
        this.containerLayout.addWidget(this.resourceWidget);
        this.containerLayout.addWidget(this.timelineEmptyWidget);
        this.refresh();
        this.toDispose.push(this.timelineService.onDidChangeTimeline(event => {
            const currentWidgetUri = this.getCurrentWidgetUri();
            if (currentWidgetUri) {
                this.loadTimeline(currentWidgetUri, event.reset);
            }
        }));
        this.toDispose.push(this.selectionService.onSelectionChanged(selection => {
            if (Array.isArray(selection) && !!selection[0] && 'uri' in selection[0]) {
                this.refresh(selection[0].uri);
            }
        }));
        this.toDispose.push(this.applicationShell.onDidChangeCurrentWidget(async (e) => {
            if ((e.newValue && browser_1.Navigatable.is(e.newValue)) || !this.suitableWidgetsOpened()) {
                this.refresh();
            }
        }));
        this.toDispose.push(this.applicationShell.onDidRemoveWidget(widget => {
            if (browser_1.NavigatableWidget.is(widget)) {
                this.refresh();
            }
        }));
        this.toDispose.push(this.timelineService.onDidChangeProviders(() => this.refresh()));
    }
    async loadTimelineForSource(source, uri, reset) {
        var _a;
        if (reset) {
            this.timelinesBySource.delete(source);
        }
        let timeline = this.timelinesBySource.get(source);
        const cursor = timeline === null || timeline === void 0 ? void 0 : timeline.cursor;
        const options = { cursor: reset ? undefined : cursor, limit: timeline_tree_widget_1.TimelineTreeWidget.PAGE_SIZE };
        const timelineResult = await this.timelineService.getTimeline(source, uri, options, { cacheResults: true, resetCache: reset });
        if (timelineResult) {
            const items = timelineResult.items;
            if (items) {
                if (timeline) {
                    timeline.add(items);
                    timeline.cursor = (_a = timelineResult.paging) === null || _a === void 0 ? void 0 : _a.cursor;
                }
                else {
                    timeline = new timeline_service_1.TimelineAggregate(timelineResult);
                }
                this.timelinesBySource.set(source, timeline);
                this.resourceWidget.model.updateTree(timeline.items, !!timeline.cursor);
            }
        }
    }
    async loadTimeline(uri, reset) {
        for (const source of this.timelineService.getSources().map(s => s.id)) {
            this.loadTimelineForSource(source, vscode_uri_1.URI.parse(uri.toString()), reset);
        }
    }
    refresh(uri) {
        if (!uri) {
            uri = this.getCurrentWidgetUri();
        }
        if (uri) {
            this.timelineEmptyWidget.hide();
            this.resourceWidget.show();
            this.loadTimeline(uri, true);
        }
        else if (!this.suitableWidgetsOpened()) {
            this.timelineEmptyWidget.show();
            this.resourceWidget.hide();
        }
    }
    suitableWidgetsOpened() {
        return !!(0, algorithm_1.toArray)(this.applicationShell.mainPanel.widgets()).find(widget => {
            if (browser_1.NavigatableWidget.is(widget)) {
                const uri = widget.getResourceUri();
                if ((uri === null || uri === void 0 ? void 0 : uri.scheme) && this.timelineService.getSchemas().indexOf(uri === null || uri === void 0 ? void 0 : uri.scheme) > -1) {
                    return true;
                }
            }
        });
    }
    getCurrentWidgetUri() {
        let current = this.applicationShell.currentWidget;
        if (!browser_1.NavigatableWidget.is(current)) {
            current = (0, algorithm_1.toArray)(this.applicationShell.mainPanel.widgets()).find(widget => {
                if (widget.isVisible && !widget.isHidden) {
                    return widget;
                }
            });
        }
        return browser_1.NavigatableWidget.is(current) ? current.getResourceUri() : undefined;
    }
    get containerLayout() {
        return this.panel.layout;
    }
    onUpdateRequest(msg) {
        browser_1.MessageLoop.sendMessage(this.resourceWidget, msg);
        browser_1.MessageLoop.sendMessage(this.timelineEmptyWidget, msg);
        this.refresh();
        super.onUpdateRequest(msg);
    }
    onAfterAttach(msg) {
        this.node.appendChild(this.resourceWidget.node);
        this.node.appendChild(this.timelineEmptyWidget.node);
        super.onAfterAttach(msg);
        this.update();
    }
};
TimelineWidget.ID = 'timeline-view';
__decorate([
    (0, inversify_1.inject)(timeline_tree_widget_1.TimelineTreeWidget),
    __metadata("design:type", timeline_tree_widget_1.TimelineTreeWidget)
], TimelineWidget.prototype, "resourceWidget", void 0);
__decorate([
    (0, inversify_1.inject)(timeline_service_1.TimelineService),
    __metadata("design:type", timeline_service_1.TimelineService)
], TimelineWidget.prototype, "timelineService", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.CommandRegistry),
    __metadata("design:type", common_1.CommandRegistry)
], TimelineWidget.prototype, "commandRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.ApplicationShell),
    __metadata("design:type", browser_1.ApplicationShell)
], TimelineWidget.prototype, "applicationShell", void 0);
__decorate([
    (0, inversify_1.inject)(timeline_empty_widget_1.TimelineEmptyWidget),
    __metadata("design:type", timeline_empty_widget_1.TimelineEmptyWidget)
], TimelineWidget.prototype, "timelineEmptyWidget", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.SelectionService),
    __metadata("design:type", common_1.SelectionService)
], TimelineWidget.prototype, "selectionService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TimelineWidget.prototype, "init", null);
TimelineWidget = TimelineWidget_1 = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], TimelineWidget);
exports.TimelineWidget = TimelineWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/timeline/lib/browser/timeline-widget'] = this;


/***/ }),

/***/ "../../packages/variable-resolver/lib/browser/index.js":
/*!*************************************************************!*\
  !*** ../../packages/variable-resolver/lib/browser/index.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./variable */ "../../packages/variable-resolver/lib/browser/variable.js"), exports);
__exportStar(__webpack_require__(/*! ./variable-quick-open-service */ "../../packages/variable-resolver/lib/browser/variable-quick-open-service.js"), exports);
__exportStar(__webpack_require__(/*! ./variable-resolver-service */ "../../packages/variable-resolver/lib/browser/variable-resolver-service.js"), exports);

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/variable-resolver/lib/browser'] = this;


/***/ }),

/***/ "../../node_modules/css-loader/dist/cjs.js!../../packages/timeline/src/browser/style/index.css":
/*!*****************************************************************************************************!*\
  !*** ../../node_modules/css-loader/dist/cjs.js!../../packages/timeline/src/browser/style/index.css ***!
  \*****************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "../../node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/api.js */ "../../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/********************************************************************************
 * Copyright (C) 2020 RedHat and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0
 ********************************************************************************/

.theia-timeline {
  box-sizing: border-box;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.theia-timeline .timeline-outer-container {
  overflow-y: auto;
  width: 100%;
  flex-grow: 1;
}

.theia-timeline .timeline-item {
  font-size: var(--theia-ui-font-size1);
  display: flex;
  overflow: hidden;
  align-items: center;
  justify-content: space-between;
  height: var(--theia-content-line-height);
  line-height: var(--theia-content-line-height);
  padding: 0px calc(var(--theia-ui-padding) / 2);
}

.theia-timeline .timeline-item:hover {
  cursor: pointer;
}

.theia-timeline .timeline-item .label {
  font-size: var(--theia-ui-font-size0);
  margin-left: var(--theia-ui-padding);
  opacity: 0.7;
}
`, "",{"version":3,"sources":["webpack://./../../packages/timeline/src/browser/style/index.css"],"names":[],"mappings":"AAAA;;;;;;;;;;;;;;iFAciF;;AAEjF;EACE,sBAAsB;EACtB,YAAY;EACZ,aAAa;EACb,sBAAsB;AACxB;;AAEA;EACE,gBAAgB;EAChB,WAAW;EACX,YAAY;AACd;;AAEA;EACE,qCAAqC;EACrC,aAAa;EACb,gBAAgB;EAChB,mBAAmB;EACnB,8BAA8B;EAC9B,wCAAwC;EACxC,6CAA6C;EAC7C,8CAA8C;AAChD;;AAEA;EACE,eAAe;AACjB;;AAEA;EACE,qCAAqC;EACrC,oCAAoC;EACpC,YAAY;AACd","sourcesContent":["/********************************************************************************\n * Copyright (C) 2020 RedHat and others.\n *\n * This program and the accompanying materials are made available under the\n * terms of the Eclipse Public License v. 2.0 which is available at\n * http://www.eclipse.org/legal/epl-2.0.\n *\n * This Source Code may also be made available under the following Secondary\n * Licenses when the conditions for such availability set forth in the Eclipse\n * Public License v. 2.0 are satisfied: GNU General Public License, version 2\n * with the GNU Classpath Exception which is available at\n * https://www.gnu.org/software/classpath/license.html.\n *\n * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0\n ********************************************************************************/\n\n.theia-timeline {\n  box-sizing: border-box;\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n}\n\n.theia-timeline .timeline-outer-container {\n  overflow-y: auto;\n  width: 100%;\n  flex-grow: 1;\n}\n\n.theia-timeline .timeline-item {\n  font-size: var(--theia-ui-font-size1);\n  display: flex;\n  overflow: hidden;\n  align-items: center;\n  justify-content: space-between;\n  height: var(--theia-content-line-height);\n  line-height: var(--theia-content-line-height);\n  padding: 0px calc(var(--theia-ui-padding) / 2);\n}\n\n.theia-timeline .timeline-item:hover {\n  cursor: pointer;\n}\n\n.theia-timeline .timeline-item .label {\n  font-size: var(--theia-ui-font-size0);\n  margin-left: var(--theia-ui-padding);\n  opacity: 0.7;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../packages/timeline/src/browser/style/index.css":
/*!***********************************************************!*\
  !*** ../../packages/timeline/src/browser/style/index.css ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/css-loader/dist/cjs.js!./index.css */ "../../node_modules/css-loader/dist/cjs.js!../../packages/timeline/src/browser/style/index.css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ })

}]);
//# sourceMappingURL=packages_core_shared_vscode-languageserver-protocol_index_js-packages_timeline_lib_browser_ti-3a0a5b.js.map