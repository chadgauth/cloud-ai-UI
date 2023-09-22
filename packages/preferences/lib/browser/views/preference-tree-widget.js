"use strict";
// *****************************************************************************
// Copyright (C) 2020 Ericsson and others.
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
var PreferencesTreeWidget_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreferencesTreeWidget = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/core/lib/browser");
const React = require("@theia/core/shared/react");
const preference_tree_model_1 = require("../preference-tree-model");
let PreferencesTreeWidget = PreferencesTreeWidget_1 = class PreferencesTreeWidget extends browser_1.TreeWidget {
    constructor() {
        super(...arguments);
        this.shouldFireSelectionEvents = true;
    }
    init() {
        super.init();
        this.id = PreferencesTreeWidget_1.ID;
        this.toDispose.pushAll([
            this.model.onFilterChanged(() => {
                this.updateRows();
            }),
        ]);
    }
    doUpdateRows() {
        this.rows = new Map();
        let index = 0;
        for (const [id, nodeRow] of this.model.currentRows.entries()) {
            if (nodeRow.visibleChildren > 0 && (browser_1.ExpandableTreeNode.is(nodeRow.node) || browser_1.ExpandableTreeNode.isExpanded(nodeRow.node.parent))) {
                this.rows.set(id, { ...nodeRow, index: index++ });
            }
        }
        this.updateScrollToRow();
    }
    doRenderNodeRow({ depth, visibleChildren, node, isExpansible }) {
        return this.renderNode(node, { depth, visibleChildren, isExpansible });
    }
    renderNode(node, props) {
        if (!browser_1.TreeNode.isVisible(node)) {
            return undefined;
        }
        const attributes = this.createNodeAttributes(node, props);
        const content = React.createElement("div", { className: browser_1.TREE_NODE_CONTENT_CLASS },
            this.renderExpansionToggle(node, props),
            this.renderCaption(node, props));
        return React.createElement('div', attributes, content);
    }
    renderExpansionToggle(node, props) {
        if (browser_1.ExpandableTreeNode.is(node) && !props.isExpansible) {
            return React.createElement("div", { className: 'preferences-tree-spacer' });
        }
        return super.renderExpansionToggle(node, props);
    }
    toNodeName(node) {
        var _a;
        const visibleChildren = (_a = this.model.currentRows.get(node.id)) === null || _a === void 0 ? void 0 : _a.visibleChildren;
        const baseName = this.labelProvider.getName(node);
        const printedNameWithVisibleChildren = this.model.isFiltered && visibleChildren !== undefined
            ? `${baseName} (${visibleChildren})`
            : baseName;
        return printedNameWithVisibleChildren;
    }
};
PreferencesTreeWidget.ID = 'preferences.tree';
__decorate([
    (0, inversify_1.inject)(preference_tree_model_1.PreferenceTreeModel),
    __metadata("design:type", preference_tree_model_1.PreferenceTreeModel)
], PreferencesTreeWidget.prototype, "model", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.TreeProps),
    __metadata("design:type", Object)
], PreferencesTreeWidget.prototype, "treeProps", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PreferencesTreeWidget.prototype, "init", null);
PreferencesTreeWidget = PreferencesTreeWidget_1 = __decorate([
    (0, inversify_1.injectable)()
], PreferencesTreeWidget);
exports.PreferencesTreeWidget = PreferencesTreeWidget;
//# sourceMappingURL=preference-tree-widget.js.map