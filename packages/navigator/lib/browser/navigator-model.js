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
exports.FileNavigatorModel = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/filesystem/lib/browser");
const browser_2 = require("@theia/core/lib/browser");
const navigator_tree_1 = require("./navigator-tree");
const browser_3 = require("@theia/workspace/lib/browser");
const frontend_application_state_1 = require("@theia/core/lib/browser/frontend-application-state");
const progress_service_1 = require("@theia/core/lib/common/progress-service");
const promise_util_1 = require("@theia/core/lib/common/promise-util");
const disposable_1 = require("@theia/core/lib/common/disposable");
let FileNavigatorModel = class FileNavigatorModel extends browser_1.FileTreeModel {
    constructor() {
        super(...arguments);
        this.pendingBusyProgress = new Map();
    }
    init() {
        super.init();
        this.reportBusyProgress();
        this.initializeRoot();
    }
    reportBusyProgress() {
        this.toDispose.push(this.onDidChangeBusy(node => {
            const pending = this.pendingBusyProgress.get(node.id);
            if (pending) {
                if (!node.busy) {
                    pending.resolve();
                    this.pendingBusyProgress.delete(node.id);
                }
                return;
            }
            if (node.busy) {
                const progress = new promise_util_1.Deferred();
                this.pendingBusyProgress.set(node.id, progress);
                this.progressService.withProgress('', 'explorer', () => progress.promise);
            }
        }));
        this.toDispose.push(disposable_1.Disposable.create(() => {
            for (const pending of this.pendingBusyProgress.values()) {
                pending.resolve();
            }
            this.pendingBusyProgress.clear();
        }));
    }
    async initializeRoot() {
        await Promise.all([
            this.applicationState.reachedState('initialized_layout'),
            this.workspaceService.roots
        ]);
        await this.updateRoot();
        if (this.toDispose.disposed) {
            return;
        }
        this.toDispose.push(this.workspaceService.onWorkspaceChanged(() => this.updateRoot()));
        this.toDispose.push(this.workspaceService.onWorkspaceLocationChanged(() => this.updateRoot()));
        if (this.selectedNodes.length) {
            return;
        }
        const root = this.root;
        if (browser_2.CompositeTreeNode.is(root) && root.children.length === 1) {
            const child = root.children[0];
            if (browser_2.SelectableTreeNode.is(child) && !child.selected && browser_2.ExpandableTreeNode.is(child)) {
                this.selectNode(child);
                this.expandNode(child);
            }
        }
    }
    previewNode(node) {
        if (browser_1.FileNode.is(node)) {
            (0, browser_2.open)(this.openerService, node.uri, { mode: 'reveal', preview: true });
        }
    }
    doOpenNode(node) {
        if (node.visible === false) {
            return;
        }
        else if (browser_1.FileNode.is(node)) {
            (0, browser_2.open)(this.openerService, node.uri);
        }
        else {
            super.doOpenNode(node);
        }
    }
    *getNodesByUri(uri) {
        const workspace = this.root;
        if (navigator_tree_1.WorkspaceNode.is(workspace)) {
            for (const root of workspace.children) {
                const id = this.tree.createId(root, uri);
                const node = this.getNode(id);
                if (node) {
                    yield node;
                }
            }
        }
    }
    async updateRoot() {
        this.root = await this.createRoot();
    }
    async createRoot() {
        if (this.workspaceService.opened) {
            const stat = this.workspaceService.workspace;
            const isMulti = (stat) ? !stat.isDirectory : false;
            const workspaceNode = isMulti
                ? this.createMultipleRootNode()
                : navigator_tree_1.WorkspaceNode.createRoot();
            const roots = await this.workspaceService.roots;
            for (const root of roots) {
                workspaceNode.children.push(await this.tree.createWorkspaceRoot(root, workspaceNode));
            }
            return workspaceNode;
        }
    }
    /**
     * Create multiple root node used to display
     * the multiple root workspace name.
     *
     * @returns `WorkspaceNode`
     */
    createMultipleRootNode() {
        const workspace = this.workspaceService.workspace;
        let name = workspace
            ? workspace.resource.path.name
            : 'untitled';
        name += ' (Workspace)';
        return navigator_tree_1.WorkspaceNode.createRoot(name);
    }
    /**
     * Move the given source file or directory to the given target directory.
     */
    async move(source, target) {
        if (source.parent && navigator_tree_1.WorkspaceRootNode.is(source)) {
            // do not support moving a root folder
            return undefined;
        }
        return super.move(source, target);
    }
    /**
     * Reveals node in the navigator by given file uri.
     *
     * @param uri uri to file which should be revealed in the navigator
     * @returns file tree node if the file with given uri was revealed, undefined otherwise
     */
    async revealFile(uri) {
        if (!uri.path.isAbsolute) {
            return undefined;
        }
        let node = this.getNodeClosestToRootByUri(uri);
        // success stop condition
        // we have to reach workspace root because expanded node could be inside collapsed one
        if (navigator_tree_1.WorkspaceRootNode.is(node)) {
            if (browser_2.ExpandableTreeNode.is(node)) {
                if (!node.expanded) {
                    node = await this.expandNode(node);
                }
                return node;
            }
            // shouldn't happen, root node is always directory, i.e. expandable
            return undefined;
        }
        // fail stop condition
        if (uri.path.isRoot) {
            // file system root is reached but workspace root wasn't found, it means that
            // given uri is not in workspace root folder or points to not existing file.
            return undefined;
        }
        if (await this.revealFile(uri.parent)) {
            if (node === undefined) {
                // get node if it wasn't mounted into navigator tree before expansion
                node = this.getNodeClosestToRootByUri(uri);
            }
            if (browser_2.ExpandableTreeNode.is(node) && !node.expanded) {
                node = await this.expandNode(node);
            }
            return node;
        }
        return undefined;
    }
    getNodeClosestToRootByUri(uri) {
        const nodes = [...this.getNodesByUri(uri)];
        return nodes.length > 0
            ? nodes.reduce((node1, node2) => // return the node closest to the workspace root
             node1.id.length >= node2.id.length ? node1 : node2) : undefined;
    }
};
__decorate([
    (0, inversify_1.inject)(browser_2.OpenerService),
    __metadata("design:type", Object)
], FileNavigatorModel.prototype, "openerService", void 0);
__decorate([
    (0, inversify_1.inject)(navigator_tree_1.FileNavigatorTree),
    __metadata("design:type", navigator_tree_1.FileNavigatorTree)
], FileNavigatorModel.prototype, "tree", void 0);
__decorate([
    (0, inversify_1.inject)(browser_3.WorkspaceService),
    __metadata("design:type", browser_3.WorkspaceService)
], FileNavigatorModel.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(frontend_application_state_1.FrontendApplicationStateService),
    __metadata("design:type", frontend_application_state_1.FrontendApplicationStateService)
], FileNavigatorModel.prototype, "applicationState", void 0);
__decorate([
    (0, inversify_1.inject)(progress_service_1.ProgressService),
    __metadata("design:type", progress_service_1.ProgressService)
], FileNavigatorModel.prototype, "progressService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FileNavigatorModel.prototype, "init", null);
FileNavigatorModel = __decorate([
    (0, inversify_1.injectable)()
], FileNavigatorModel);
exports.FileNavigatorModel = FileNavigatorModel;
//# sourceMappingURL=navigator-model.js.map