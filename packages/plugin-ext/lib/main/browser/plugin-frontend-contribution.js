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
var PluginApiFrontendContribution_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginApiFrontendContribution = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const common_1 = require("@theia/core/lib/common");
const commands_1 = require("./commands");
const tree_view_widget_1 = require("./view/tree-view-widget");
const browser_1 = require("@theia/core/lib/browser");
const plugin_view_widget_1 = require("./view/plugin-view-widget");
let PluginApiFrontendContribution = PluginApiFrontendContribution_1 = class PluginApiFrontendContribution {
    registerCommands(commands) {
        commands.registerCommand(commands_1.OpenUriCommandHandler.COMMAND_METADATA, {
            execute: (arg) => this.openUriCommandHandler.execute(arg),
            isVisible: () => false
        });
        commands.registerCommand(PluginApiFrontendContribution_1.COLLAPSE_ALL_COMMAND, {
            execute: (widget) => {
                if (widget instanceof plugin_view_widget_1.PluginViewWidget && widget.widgets[0] instanceof tree_view_widget_1.TreeViewWidget) {
                    const model = widget.widgets[0].model;
                    if (browser_1.CompositeTreeNode.is(model.root)) {
                        for (const child of model.root.children) {
                            if (browser_1.CompositeTreeNode.is(child)) {
                                model.collapseAll(child);
                            }
                        }
                    }
                }
            },
            isVisible: (widget) => widget instanceof plugin_view_widget_1.PluginViewWidget && widget.widgets[0] instanceof tree_view_widget_1.TreeViewWidget && widget.widgets[0].showCollapseAll
        });
    }
    registerToolbarItems(registry) {
        registry.registerItem({
            id: PluginApiFrontendContribution_1.COLLAPSE_ALL_COMMAND.id,
            command: PluginApiFrontendContribution_1.COLLAPSE_ALL_COMMAND.id,
            tooltip: PluginApiFrontendContribution_1.COLLAPSE_ALL_COMMAND.label,
            icon: PluginApiFrontendContribution_1.COLLAPSE_ALL_COMMAND.iconClass,
            priority: 1000
        });
    }
};
PluginApiFrontendContribution.COLLAPSE_ALL_COMMAND = common_1.Command.toDefaultLocalizedCommand({
    id: 'treeviews.collapseAll',
    iconClass: (0, browser_1.codicon)('collapse-all'),
    label: 'Collapse All'
});
__decorate([
    (0, inversify_1.inject)(commands_1.OpenUriCommandHandler),
    __metadata("design:type", commands_1.OpenUriCommandHandler)
], PluginApiFrontendContribution.prototype, "openUriCommandHandler", void 0);
PluginApiFrontendContribution = PluginApiFrontendContribution_1 = __decorate([
    (0, inversify_1.injectable)()
], PluginApiFrontendContribution);
exports.PluginApiFrontendContribution = PluginApiFrontendContribution;
//# sourceMappingURL=plugin-frontend-contribution.js.map