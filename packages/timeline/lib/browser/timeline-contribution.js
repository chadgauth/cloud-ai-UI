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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimelineContribution = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/core/lib/browser");
const browser_2 = require("@theia/navigator/lib/browser");
const timeline_widget_1 = require("./timeline-widget");
const timeline_service_1 = require("./timeline-service");
const common_1 = require("@theia/core/lib/common");
const tab_bar_toolbar_1 = require("@theia/core/lib/browser/shell/tab-bar-toolbar");
const algorithm_1 = require("@theia/core/shared/@phosphor/algorithm");
const timeline_tree_model_1 = require("./timeline-tree-model");
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
//# sourceMappingURL=timeline-contribution.js.map