"use strict";
// *****************************************************************************
// Copyright (C) 2020 Arm and others.
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
exports.ScmTreeModel = exports.ScmFileChangeNode = exports.ScmFileChangeFolderNode = exports.ScmFileChangeGroupNode = exports.ScmTreeModelProps = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const tree_1 = require("@theia/core/lib/browser/tree");
const uri_1 = require("@theia/core/lib/common/uri");
const scm_context_key_service_1 = require("./scm-context-key-service");
exports.ScmTreeModelProps = Symbol('ScmTreeModelProps');
var ScmFileChangeGroupNode;
(function (ScmFileChangeGroupNode) {
    function is(node) {
        return 'groupId' in node && 'children' in node
            && !ScmFileChangeFolderNode.is(node);
    }
    ScmFileChangeGroupNode.is = is;
})(ScmFileChangeGroupNode = exports.ScmFileChangeGroupNode || (exports.ScmFileChangeGroupNode = {}));
var ScmFileChangeFolderNode;
(function (ScmFileChangeFolderNode) {
    function is(node) {
        return 'groupId' in node && 'sourceUri' in node && 'path' in node && 'children' in node;
    }
    ScmFileChangeFolderNode.is = is;
})(ScmFileChangeFolderNode = exports.ScmFileChangeFolderNode || (exports.ScmFileChangeFolderNode = {}));
var ScmFileChangeNode;
(function (ScmFileChangeNode) {
    function is(node) {
        return 'sourceUri' in node
            && !ScmFileChangeFolderNode.is(node);
    }
    ScmFileChangeNode.is = is;
    function getGroupId(node) {
        const parentNode = node.parent;
        if (!(parentNode && (ScmFileChangeFolderNode.is(parentNode) || ScmFileChangeGroupNode.is(parentNode)))) {
            throw new Error('bad node');
        }
        return parentNode.groupId;
    }
    ScmFileChangeNode.getGroupId = getGroupId;
})(ScmFileChangeNode = exports.ScmFileChangeNode || (exports.ScmFileChangeNode = {}));
let ScmTreeModel = class ScmTreeModel extends tree_1.TreeModelImpl {
    constructor() {
        super(...arguments);
        this._viewMode = 'list';
        this.compareNodes = (a, b) => this.doCompareNodes(a, b);
    }
    get languageId() {
        return this._languageId;
    }
    set viewMode(id) {
        const oldSelection = this.selectedNodes;
        this._viewMode = id;
        if (this.root) {
            this.root = this.createTree();
            for (const oldSelectedNode of oldSelection) {
                const newNode = this.getNode(oldSelectedNode.id);
                if (tree_1.SelectableTreeNode.is(newNode)) {
                    this.revealNode(newNode); // this call can run asynchronously
                }
            }
        }
    }
    get viewMode() {
        return this._viewMode;
    }
    createTree() {
        const root = {
            id: 'file-change-tree-root',
            parent: undefined,
            visible: false,
            rootUri: this.rootUri,
            children: []
        };
        const groupNodes = this.groups
            .filter(group => !!group.resources.length || !group.hideWhenEmpty)
            .map(group => this.toGroupNode(group, root));
        root.children = groupNodes;
        return root;
    }
    toGroupNode(group, parent) {
        const groupNode = {
            id: `${group.id}`,
            groupId: group.id,
            groupLabel: group.label,
            parent,
            children: [],
            expanded: true,
        };
        const sortedResources = group.resources.sort((r1, r2) => r1.sourceUri.toString().localeCompare(r2.sourceUri.toString()));
        switch (this._viewMode) {
            case 'list':
                groupNode.children = sortedResources.map(resource => this.toFileChangeNode(resource, groupNode));
                break;
            case 'tree':
                const rootUri = group.provider.rootUri;
                if (rootUri) {
                    const resourcePaths = sortedResources.map(resource => {
                        const relativePath = new uri_1.default(rootUri).relative(resource.sourceUri);
                        const pathParts = relativePath ? relativePath.toString().split('/') : [];
                        return { resource, pathParts };
                    });
                    groupNode.children = this.buildFileChangeTree(resourcePaths, 0, sortedResources.length, 0, groupNode);
                }
                break;
        }
        return groupNode;
    }
    buildFileChangeTree(sortedResources, start, end, level, parent) {
        const result = [];
        let folderStart = start;
        while (folderStart < end) {
            const firstFileChange = sortedResources[folderStart];
            if (level === firstFileChange.pathParts.length - 1) {
                result.push(this.toFileChangeNode(firstFileChange.resource, parent));
                folderStart++;
            }
            else {
                let index = folderStart + 1;
                while (index < end) {
                    if (sortedResources[index].pathParts[level] !== firstFileChange.pathParts[level]) {
                        break;
                    }
                    index++;
                }
                const folderEnd = index;
                const nestingThreshold = this.props.nestingThreshold || 1;
                if (folderEnd - folderStart < nestingThreshold) {
                    // Inline these (i.e. do not create another level in the tree)
                    for (let i = folderStart; i < folderEnd; i++) {
                        result.push(this.toFileChangeNode(sortedResources[i].resource, parent));
                    }
                }
                else {
                    const firstFileParts = firstFileChange.pathParts;
                    const lastFileParts = sortedResources[folderEnd - 1].pathParts;
                    // Multiple files with first folder.
                    // See if more folder levels match and include those if so.
                    let thisLevel = level + 1;
                    while (thisLevel < firstFileParts.length - 1 && thisLevel < lastFileParts.length - 1 && firstFileParts[thisLevel] === lastFileParts[thisLevel]) {
                        thisLevel++;
                    }
                    const nodeRelativePath = firstFileParts.slice(level, thisLevel).join('/');
                    result.push(this.toFileChangeFolderNode(sortedResources, folderStart, folderEnd, thisLevel, nodeRelativePath, parent));
                }
                folderStart = folderEnd;
            }
        }
        ;
        return result.sort(this.compareNodes);
    }
    doCompareNodes(a, b) {
        const isFolderA = ScmFileChangeFolderNode.is(a);
        const isFolderB = ScmFileChangeFolderNode.is(b);
        if (isFolderA && !isFolderB) {
            return -1;
        }
        if (isFolderB && !isFolderA) {
            return 1;
        }
        return a.sourceUri.localeCompare(b.sourceUri);
    }
    toFileChangeFolderNode(resources, start, end, level, nodeRelativePath, parent) {
        const rootUri = this.getRoot(parent).rootUri;
        let parentPath = rootUri;
        if (ScmFileChangeFolderNode.is(parent)) {
            parentPath = parent.sourceUri;
        }
        const sourceUri = new uri_1.default(parentPath).resolve(nodeRelativePath);
        const defaultExpansion = this.props.defaultExpansion ? (this.props.defaultExpansion === 'expanded') : true;
        const id = `${parent.groupId}:${String(sourceUri)}`;
        const oldNode = this.getNode(id);
        const folderNode = {
            id,
            groupId: parent.groupId,
            path: nodeRelativePath,
            sourceUri: String(sourceUri),
            children: [],
            parent,
            expanded: tree_1.ExpandableTreeNode.is(oldNode) ? oldNode.expanded : defaultExpansion,
            selected: tree_1.SelectableTreeNode.is(oldNode) && oldNode.selected,
        };
        folderNode.children = this.buildFileChangeTree(resources, start, end, level, folderNode);
        return folderNode;
    }
    getRoot(node) {
        let parent = node.parent;
        while (ScmFileChangeGroupNode.is(parent) && ScmFileChangeFolderNode.is(parent)) {
            parent = parent.parent;
        }
        return parent;
    }
    toFileChangeNode(resource, parent) {
        const id = `${resource.group.id}:${String(resource.sourceUri)}`;
        const oldNode = this.getNode(id);
        const node = {
            id,
            sourceUri: String(resource.sourceUri),
            decorations: resource.decorations,
            parent,
            selected: tree_1.SelectableTreeNode.is(oldNode) && oldNode.selected,
        };
        if (node.selected) {
            this.selectionService.addSelection(node);
        }
        return node;
    }
    async revealNode(node) {
        if (ScmFileChangeFolderNode.is(node) || ScmFileChangeNode.is(node)) {
            const parentNode = node.parent;
            if (tree_1.ExpandableTreeNode.is(parentNode)) {
                await this.revealNode(parentNode);
                if (!parentNode.expanded) {
                    await this.expandNode(parentNode);
                }
            }
        }
    }
    getResourceFromNode(node) {
        const groupId = ScmFileChangeNode.getGroupId(node);
        const group = this.findGroup(groupId);
        if (group) {
            return group.resources.find(r => String(r.sourceUri) === node.sourceUri);
        }
    }
    getResourceGroupFromNode(node) {
        return this.findGroup(node.groupId);
    }
    getResourcesFromFolderNode(node) {
        const resources = [];
        const group = this.findGroup(node.groupId);
        if (group) {
            this.collectResources(resources, node, group);
        }
        return resources;
    }
    getSelectionArgs(selectedNodes) {
        const resources = [];
        for (const node of selectedNodes) {
            if (ScmFileChangeNode.is(node)) {
                const groupId = ScmFileChangeNode.getGroupId(node);
                const group = this.findGroup(groupId);
                if (group) {
                    const selectedResource = group.resources.find(r => String(r.sourceUri) === node.sourceUri);
                    if (selectedResource) {
                        resources.push(selectedResource);
                    }
                }
            }
            if (ScmFileChangeFolderNode.is(node)) {
                const group = this.findGroup(node.groupId);
                if (group) {
                    this.collectResources(resources, node, group);
                }
            }
        }
        // Remove duplicates which may occur if user selected folder and nested folder
        return resources.filter((item1, index) => resources.findIndex(item2 => item1.sourceUri === item2.sourceUri) === index);
    }
    collectResources(resources, node, group) {
        if (ScmFileChangeFolderNode.is(node)) {
            for (const child of node.children) {
                this.collectResources(resources, child, group);
            }
        }
        else if (ScmFileChangeNode.is(node)) {
            const resource = group.resources.find(r => String(r.sourceUri) === node.sourceUri);
            resources.push(resource);
        }
    }
    execInNodeContext(node, callback) {
        if (!this.provider) {
            return;
        }
        let groupId;
        if (ScmFileChangeGroupNode.is(node) || ScmFileChangeFolderNode.is(node)) {
            groupId = node.groupId;
        }
        else if (ScmFileChangeNode.is(node)) {
            groupId = ScmFileChangeNode.getGroupId(node);
        }
        else {
            return;
        }
        this.contextKeys.scmProvider.set(this.provider.id);
        this.contextKeys.scmResourceGroup.set(groupId);
        try {
            callback();
        }
        finally {
        }
    }
    /*
     * Normally the group would always be expected to be found.  However if the tree is restored
     * in restoreState then the tree may be rendered before the groups have been created
     * in the provider.  The provider's groups property will be empty in such a situation.
     * We want to render the tree (as that is the point of restoreState, we can render
     * the tree in the saved state before the provider has provided status).  We therefore must
     * be prepared to render the tree without having the ScmResourceGroup or ScmResource
     * objects.
     */
    findGroup(groupId) {
        return this.groups.find(g => g.id === groupId);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    storeState() {
        return {
            ...super.storeState(),
            mode: this.viewMode,
        };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    restoreState(oldState) {
        super.restoreState(oldState);
        this.viewMode = oldState.mode === 'tree' ? 'tree' : 'list';
    }
};
__decorate([
    (0, inversify_1.inject)(tree_1.TreeProps),
    __metadata("design:type", Object)
], ScmTreeModel.prototype, "props", void 0);
__decorate([
    (0, inversify_1.inject)(scm_context_key_service_1.ScmContextKeyService),
    __metadata("design:type", scm_context_key_service_1.ScmContextKeyService)
], ScmTreeModel.prototype, "contextKeys", void 0);
ScmTreeModel = __decorate([
    (0, inversify_1.injectable)()
], ScmTreeModel);
exports.ScmTreeModel = ScmTreeModel;
//# sourceMappingURL=scm-tree-model.js.map