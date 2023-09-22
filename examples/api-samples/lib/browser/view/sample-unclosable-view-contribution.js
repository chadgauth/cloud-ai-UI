"use strict";
// *****************************************************************************
// Copyright (C) 2020 TORO Limited and others.
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
var SampleUnclosableViewContribution_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindSampleUnclosableView = exports.SampleUnclosableViewContribution = exports.SampleToolBarCommand = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const view_contribution_1 = require("@theia/core/lib/browser/shell/view-contribution");
const tab_bar_toolbar_1 = require("@theia/core/lib/browser/shell/tab-bar-toolbar");
const common_1 = require("@theia/core/lib/common");
const browser_1 = require("@theia/core/lib/browser");
const sample_unclosable_view_1 = require("./sample-unclosable-view");
exports.SampleToolBarCommand = {
    id: 'sample.toggle.toolbarCommand',
    iconClass: (0, browser_1.codicon)('add')
};
let SampleUnclosableViewContribution = SampleUnclosableViewContribution_1 = class SampleUnclosableViewContribution extends view_contribution_1.AbstractViewContribution {
    constructor() {
        super({
            widgetId: sample_unclosable_view_1.SampleViewUnclosableView.ID,
            widgetName: 'Sample Unclosable View',
            toggleCommandId: SampleUnclosableViewContribution_1.SAMPLE_UNCLOSABLE_VIEW_TOGGLE_COMMAND_ID,
            defaultWidgetOptions: {
                area: 'main'
            }
        });
        this.toolbarItemState = false;
    }
    registerCommands(registry) {
        super.registerCommands(registry);
        registry.registerCommand(exports.SampleToolBarCommand, {
            execute: () => {
                this.toolbarItemState = !this.toolbarItemState;
                this.messageService.info(`Sample Toolbar Command is toggled = ${this.toolbarItemState}`);
            },
            isEnabled: widget => this.withWidget(widget, () => true),
            isVisible: widget => this.withWidget(widget, () => true),
            isToggled: () => this.toolbarItemState
        });
    }
    async registerToolbarItems(toolbarRegistry) {
        toolbarRegistry.registerItem({
            id: exports.SampleToolBarCommand.id,
            command: exports.SampleToolBarCommand.id,
            tooltip: 'Click to Toggle Toolbar Item',
            priority: 0
        });
    }
    withWidget(widget = this.tryGetWidget(), cb) {
        if (widget instanceof sample_unclosable_view_1.SampleViewUnclosableView && widget.id === sample_unclosable_view_1.SampleViewUnclosableView.ID) {
            return cb(widget);
        }
        return false;
    }
};
SampleUnclosableViewContribution.SAMPLE_UNCLOSABLE_VIEW_TOGGLE_COMMAND_ID = 'sampleUnclosableView:toggle';
__decorate([
    (0, inversify_1.inject)(common_1.MessageService),
    __metadata("design:type", common_1.MessageService)
], SampleUnclosableViewContribution.prototype, "messageService", void 0);
SampleUnclosableViewContribution = SampleUnclosableViewContribution_1 = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], SampleUnclosableViewContribution);
exports.SampleUnclosableViewContribution = SampleUnclosableViewContribution;
const bindSampleUnclosableView = (bind) => {
    (0, view_contribution_1.bindViewContribution)(bind, SampleUnclosableViewContribution);
    bind(tab_bar_toolbar_1.TabBarToolbarContribution).to(SampleUnclosableViewContribution).inSingletonScope();
    bind(sample_unclosable_view_1.SampleViewUnclosableView).toSelf();
    bind(browser_1.WidgetFactory).toDynamicValue(ctx => ({
        id: sample_unclosable_view_1.SampleViewUnclosableView.ID,
        createWidget: () => ctx.container.get(sample_unclosable_view_1.SampleViewUnclosableView)
    }));
};
exports.bindSampleUnclosableView = bindSampleUnclosableView;
//# sourceMappingURL=sample-unclosable-view-contribution.js.map