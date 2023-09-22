"use strict";
// *****************************************************************************
// Copyright (C) 2017 TypeFox and others.
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
exports.OutlineViewContribution = exports.OutlineViewCommands = exports.OUTLINE_WIDGET_FACTORY_ID = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const view_contribution_1 = require("@theia/core/lib/browser/shell/view-contribution");
const widgets_1 = require("@theia/core/lib/browser/widgets");
const outline_view_widget_1 = require("./outline-view-widget");
const tree_1 = require("@theia/core/lib/browser/tree");
const os_1 = require("@theia/core/lib/common/os");
const nls_1 = require("@theia/core/lib/common/nls");
exports.OUTLINE_WIDGET_FACTORY_ID = 'outline-view';
/**
 * Collection of `outline-view` commands.
 */
var OutlineViewCommands;
(function (OutlineViewCommands) {
    /**
     * Command which collapses all nodes from the `outline-view` tree.
     */
    OutlineViewCommands.COLLAPSE_ALL = {
        id: 'outlineView.collapse.all',
        iconClass: (0, widgets_1.codicon)('collapse-all')
    };
    /**
     * Command which expands all nodes from the `outline-view` tree.
     */
    OutlineViewCommands.EXPAND_ALL = {
        id: 'outlineView.expand.all',
        iconClass: (0, widgets_1.codicon)('expand-all')
    };
})(OutlineViewCommands = exports.OutlineViewCommands || (exports.OutlineViewCommands = {}));
let OutlineViewContribution = class OutlineViewContribution extends view_contribution_1.AbstractViewContribution {
    constructor() {
        super({
            widgetId: exports.OUTLINE_WIDGET_FACTORY_ID,
            widgetName: outline_view_widget_1.OutlineViewWidget.LABEL,
            defaultWidgetOptions: {
                area: 'right',
                rank: 500
            },
            toggleCommandId: 'outlineView:toggle',
            toggleKeybinding: os_1.OS.type() !== os_1.OS.Type.Linux
                ? 'ctrlcmd+shift+i'
                : undefined
        });
    }
    async initializeLayout(app) {
        await this.openView();
    }
    registerCommands(commands) {
        super.registerCommands(commands);
        commands.registerCommand(OutlineViewCommands.COLLAPSE_ALL, {
            isEnabled: w => this.withWidget(w, () => true),
            isVisible: w => this.withWidget(w, widget => !widget.model.areNodesCollapsed()),
            execute: () => this.collapseAllItems()
        });
        commands.registerCommand(OutlineViewCommands.EXPAND_ALL, {
            isEnabled: w => this.withWidget(w, () => true),
            isVisible: w => this.withWidget(w, widget => widget.model.areNodesCollapsed()),
            execute: () => this.expandAllItems()
        });
    }
    async registerToolbarItems(toolbar) {
        const widget = await this.widget;
        const onDidChange = widget.onDidUpdate;
        toolbar.registerItem({
            id: OutlineViewCommands.COLLAPSE_ALL.id,
            command: OutlineViewCommands.COLLAPSE_ALL.id,
            tooltip: nls_1.nls.localizeByDefault('Collapse All'),
            priority: 0,
            onDidChange
        });
        toolbar.registerItem({
            id: OutlineViewCommands.EXPAND_ALL.id,
            command: OutlineViewCommands.EXPAND_ALL.id,
            tooltip: nls_1.nls.localizeByDefault('Expand All'),
            priority: 0,
            onDidChange
        });
    }
    /**
     * Collapse all nodes in the outline view tree.
     */
    async collapseAllItems() {
        const { model } = await this.widget;
        const root = model.root;
        if (tree_1.CompositeTreeNode.is(root)) {
            model.collapseAll(root);
        }
    }
    async expandAllItems() {
        const { model } = await this.widget;
        model.expandAll(model.root);
    }
    /**
     * Determine if the current widget is the `outline-view`.
     */
    withWidget(widget = this.tryGetWidget(), cb) {
        if (widget instanceof outline_view_widget_1.OutlineViewWidget && widget.id === exports.OUTLINE_WIDGET_FACTORY_ID) {
            return cb(widget);
        }
        return false;
    }
};
OutlineViewContribution = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], OutlineViewContribution);
exports.OutlineViewContribution = OutlineViewContribution;
//# sourceMappingURL=outline-view-contribution.js.map