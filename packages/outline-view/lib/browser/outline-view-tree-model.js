"use strict";
// *****************************************************************************
// Copyright (C) 2019 Ericsson and others.
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutlineViewTreeModel = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/core/lib/browser");
let OutlineViewTreeModel = class OutlineViewTreeModel extends browser_1.TreeModelImpl {
    /**
     * Handle the expansion of the tree node.
     * - The method is a no-op in order to preserve focus on the editor
     * after attempting to perform a `collapse-all`.
     * @param node the expandable tree node.
     */
    handleExpansion(node) {
        // no-op
    }
    async collapseAll(raw) {
        const node = raw || this.getFocusedNode();
        if (browser_1.CompositeTreeNode.is(node)) {
            return this.expansionService.collapseAll(node);
        }
        return false;
    }
    /**
     * The default behavior of `openNode` calls `doOpenNode` which by default
     * toggles the expansion of the node. Overriding to prevent expansion, but
     * allow for the `onOpenNode` event to still fire on a double-click event.
     */
    openNode(raw) {
        const node = raw || this.getFocusedNode();
        if (node) {
            this.onOpenNodeEmitter.fire(node);
        }
    }
    expandAll(raw) {
        if (browser_1.CompositeTreeNode.is(raw)) {
            for (const child of raw.children) {
                if (browser_1.ExpandableTreeNode.is(child)) {
                    this.expandAll(child);
                }
            }
        }
        if (browser_1.ExpandableTreeNode.is(raw)) {
            this.expandNode(raw);
        }
    }
    areNodesCollapsed() {
        if (browser_1.CompositeTreeNode.is(this.root)) {
            for (const child of this.root.children) {
                if (!browser_1.ExpandableTreeNode.isCollapsed(child)) {
                    return false;
                }
            }
        }
        return true;
    }
};
OutlineViewTreeModel = __decorate([
    (0, inversify_1.injectable)()
], OutlineViewTreeModel);
exports.OutlineViewTreeModel = OutlineViewTreeModel;
//# sourceMappingURL=outline-view-tree-model.js.map