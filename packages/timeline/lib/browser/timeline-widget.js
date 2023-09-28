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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimelineWidget = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/core/lib/browser");
const timeline_tree_widget_1 = require("./timeline-tree-widget");
const timeline_service_1 = require("./timeline-service");
const common_1 = require("@theia/core/lib/common");
const timeline_empty_widget_1 = require("./timeline-empty-widget");
const algorithm_1 = require("@theia/core/shared/@phosphor/algorithm");
const vscode_uri_1 = require("@theia/core/shared/vscode-uri");
const nls_1 = require("@theia/core/lib/common/nls");
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
//# sourceMappingURL=timeline-widget.js.map