"use strict";
// *****************************************************************************
// Copyright (C) 2019 TypeFox and others.
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
exports.PluginViewWidget = exports.PluginViewWidgetIdentifier = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const widgets_1 = require("@theia/core/shared/@phosphor/widgets");
const menu_1 = require("@theia/core/lib/common/menu");
const command_1 = require("@theia/core/lib/common/command");
const tree_view_widget_1 = require("./tree-view-widget");
const view_container_1 = require("@theia/core/lib/browser/view-container");
const common_1 = require("@theia/core/lib/common");
const context_key_service_1 = require("@theia/core/lib/browser/context-key-service");
let PluginViewWidgetIdentifier = class PluginViewWidgetIdentifier {
};
PluginViewWidgetIdentifier = __decorate([
    (0, inversify_1.injectable)()
], PluginViewWidgetIdentifier);
exports.PluginViewWidgetIdentifier = PluginViewWidgetIdentifier;
let PluginViewWidget = class PluginViewWidget extends widgets_1.Panel {
    constructor() {
        super();
        this._description = '';
        this._suppressUpdateViewVisibility = false;
        this.updatingViewVisibility = false;
        this.onDidChangeDescriptionEmitter = new common_1.Emitter();
        this.onDidChangeBadgeEmitter = new common_1.Emitter();
        this.onDidChangeBadgeTooltipEmitter = new common_1.Emitter();
        this.toDispose = new common_1.DisposableCollection(this.onDidChangeDescriptionEmitter, this.onDidChangeBadgeEmitter, this.onDidChangeBadgeTooltipEmitter);
        this.onDidChangeToolbarItemsEmitter = new common_1.Emitter();
        this.node.tabIndex = -1;
        this.node.style.height = '100%';
    }
    get onDidChangeToolbarItems() {
        return this.onDidChangeToolbarItemsEmitter.event;
    }
    init() {
        this.id = this.options.id;
        const localContext = this.contextKeyService.createScoped(this.node);
        localContext.setContext('view', this.options.viewId);
        this.toDispose.push(localContext);
    }
    get onDidChangeDescription() {
        return this.onDidChangeDescriptionEmitter.event;
    }
    get onDidChangeBadge() {
        return this.onDidChangeBadgeEmitter.event;
    }
    get onDidChangeBadgeTooltip() {
        return this.onDidChangeBadgeTooltipEmitter.event;
    }
    onActivateRequest(msg) {
        super.onActivateRequest(msg);
        const widget = this.widgets[0];
        if (widget) {
            widget.activate();
            this.updateWidgetMessage();
        }
        else {
            this.node.focus();
        }
    }
    storeState() {
        return {
            label: this.title.label,
            message: this.message,
            widgets: this.widgets,
            suppressUpdateViewVisibility: this._suppressUpdateViewVisibility,
            currentViewContainerId: this.currentViewContainerId
        };
    }
    restoreState(state) {
        this.title.label = state.label;
        this.message = state.message;
        this.suppressUpdateViewVisibility = state.suppressUpdateViewVisibility;
        this.currentViewContainerId = state.currentViewContainerId;
        for (const widget of state.widgets) {
            this.addWidget(widget);
        }
    }
    set suppressUpdateViewVisibility(suppressUpdateViewVisibility) {
        this._suppressUpdateViewVisibility = !this.updatingViewVisibility && suppressUpdateViewVisibility;
    }
    updateViewVisibility(cb) {
        if (this._suppressUpdateViewVisibility) {
            return;
        }
        try {
            this.updatingViewVisibility = true;
            cb();
        }
        finally {
            this.updatingViewVisibility = false;
        }
    }
    get message() {
        return this._message;
    }
    set message(message) {
        this._message = message;
        this.updateWidgetMessage();
    }
    get description() {
        return this._description;
    }
    set description(description) {
        this._description = description;
        this.onDidChangeDescriptionEmitter.fire();
    }
    get badge() {
        const widget = this.widgets[0];
        if (view_container_1.BadgeWidget.is(widget)) {
            return widget.badge;
        }
        return this._badge;
    }
    set badge(badge) {
        this._badge = badge;
        this.onDidChangeBadgeEmitter.fire();
    }
    get badgeTooltip() {
        const widget = this.widgets[0];
        if (view_container_1.BadgeWidget.is(widget)) {
            return widget.badgeTooltip;
        }
        return this._badgeTooltip;
    }
    set badgeTooltip(badgeTooltip) {
        this._badgeTooltip = badgeTooltip;
        this.onDidChangeBadgeTooltipEmitter.fire();
    }
    updateWidgetMessage() {
        const widget = this.widgets[0];
        if (widget) {
            if (widget instanceof tree_view_widget_1.TreeViewWidget) {
                widget.message = this._message;
            }
        }
    }
    addWidget(widget) {
        super.addWidget(widget);
        if (view_container_1.BadgeWidget.is(widget)) {
            widget.onDidChangeBadge(() => this.onDidChangeBadgeEmitter.fire());
            widget.onDidChangeBadgeTooltip(() => this.onDidChangeBadgeTooltipEmitter.fire());
        }
        this.updateWidgetMessage();
        this.onDidChangeToolbarItemsEmitter.fire();
    }
    insertWidget(index, widget) {
        super.insertWidget(index, widget);
        this.updateWidgetMessage();
        this.onDidChangeToolbarItemsEmitter.fire();
    }
    dispose() {
        this.toDispose.dispose();
        super.dispose();
    }
};
__decorate([
    (0, inversify_1.inject)(menu_1.MenuModelRegistry),
    __metadata("design:type", menu_1.MenuModelRegistry)
], PluginViewWidget.prototype, "menus", void 0);
__decorate([
    (0, inversify_1.inject)(command_1.CommandRegistry),
    __metadata("design:type", command_1.CommandRegistry)
], PluginViewWidget.prototype, "commands", void 0);
__decorate([
    (0, inversify_1.inject)(context_key_service_1.ContextKeyService),
    __metadata("design:type", Object)
], PluginViewWidget.prototype, "contextKeyService", void 0);
__decorate([
    (0, inversify_1.inject)(PluginViewWidgetIdentifier),
    __metadata("design:type", PluginViewWidgetIdentifier)
], PluginViewWidget.prototype, "options", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PluginViewWidget.prototype, "init", null);
PluginViewWidget = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], PluginViewWidget);
exports.PluginViewWidget = PluginViewWidget;
//# sourceMappingURL=plugin-view-widget.js.map