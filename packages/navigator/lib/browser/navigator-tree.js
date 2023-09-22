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
exports.WorkspaceRootNode = exports.WorkspaceNode = exports.FileNavigatorTree = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/filesystem/lib/browser");
const browser_2 = require("@theia/core/lib/browser");
const navigator_filter_1 = require("./navigator-filter");
const navigator_preferences_1 = require("./navigator-preferences");
let FileNavigatorTree = class FileNavigatorTree extends browser_1.FileTree {
    init() {
        this.toDispose.push(this.filter.onFilterChanged(() => this.refresh()));
        this.navigatorPreferences.ready.then(() => this.toggleCompression());
        this.toDispose.push(this.navigatorPreferences.onPreferenceChanged(({ preferenceName }) => {
            if (preferenceName === navigator_preferences_1.EXPLORER_COMPACT_FOLDERS) {
                this.toggleCompression();
            }
        }));
    }
    toggleCompression() {
        this.compressionToggle.compress = this.navigatorPreferences.get(navigator_preferences_1.EXPLORER_COMPACT_FOLDERS, true);
        this.refresh();
    }
    async resolveChildren(parent) {
        if (WorkspaceNode.is(parent)) {
            return parent.children;
        }
        return this.filter.filter(super.resolveChildren(parent));
    }
    toNodeId(uri, parent) {
        const workspaceRootNode = WorkspaceRootNode.find(parent);
        if (workspaceRootNode) {
            return this.createId(workspaceRootNode, uri);
        }
        return super.toNodeId(uri, parent);
    }
    createId(root, uri) {
        const id = super.toNodeId(uri, root);
        return id === root.id ? id : `${root.id}:${id}`;
    }
    async createWorkspaceRoot(rootFolder, workspaceNode) {
        const node = this.toNode(rootFolder, workspaceNode);
        Object.assign(node, {
            visible: workspaceNode.name !== WorkspaceNode.name,
        });
        return node;
    }
};
__decorate([
    (0, inversify_1.inject)(navigator_filter_1.FileNavigatorFilter),
    __metadata("design:type", navigator_filter_1.FileNavigatorFilter)
], FileNavigatorTree.prototype, "filter", void 0);
__decorate([
    (0, inversify_1.inject)(navigator_preferences_1.FileNavigatorPreferences),
    __metadata("design:type", Object)
], FileNavigatorTree.prototype, "navigatorPreferences", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.CompressionToggle),
    __metadata("design:type", Object)
], FileNavigatorTree.prototype, "compressionToggle", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FileNavigatorTree.prototype, "init", null);
FileNavigatorTree = __decorate([
    (0, inversify_1.injectable)()
], FileNavigatorTree);
exports.FileNavigatorTree = FileNavigatorTree;
var WorkspaceNode;
(function (WorkspaceNode) {
    WorkspaceNode.id = 'WorkspaceNodeId';
    WorkspaceNode.name = 'WorkspaceNode';
    function is(node) {
        return browser_2.CompositeTreeNode.is(node) && node.id === WorkspaceNode.id;
    }
    WorkspaceNode.is = is;
    /**
     * Create a `WorkspaceNode` that can be used as a `Tree` root.
     */
    function createRoot(multiRootName) {
        return {
            id: WorkspaceNode.id,
            name: multiRootName || WorkspaceNode.name,
            parent: undefined,
            children: [],
            visible: false,
            selected: false
        };
    }
    WorkspaceNode.createRoot = createRoot;
})(WorkspaceNode = exports.WorkspaceNode || (exports.WorkspaceNode = {}));
var WorkspaceRootNode;
(function (WorkspaceRootNode) {
    function is(node) {
        return browser_1.DirNode.is(node) && WorkspaceNode.is(node.parent);
    }
    WorkspaceRootNode.is = is;
    function find(node) {
        if (node) {
            if (is(node)) {
                return node;
            }
            return find(node.parent);
        }
    }
    WorkspaceRootNode.find = find;
})(WorkspaceRootNode = exports.WorkspaceRootNode || (exports.WorkspaceRootNode = {}));
//# sourceMappingURL=navigator-tree.js.map