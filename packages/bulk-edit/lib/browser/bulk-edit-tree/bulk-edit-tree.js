"use strict";
// *****************************************************************************
// Copyright (C) 2021 SAP SE or an SAP affiliate company and others.
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
exports.BulkEditInfoNode = exports.BulkEditNode = exports.BulkEditTree = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/core/lib/browser");
const selection_1 = require("@theia/core/lib/common/selection");
const bulk_edit_node_selection_1 = require("./bulk-edit-node-selection");
const uri_1 = require("@theia/core/lib/common/uri");
const monaco_workspace_1 = require("@theia/monaco/lib/browser/monaco-workspace");
let BulkEditTree = class BulkEditTree extends browser_1.TreeImpl {
    async initTree(edits, fileContents) {
        this.root = {
            visible: false,
            id: 'theia-bulk-edit-tree-widget',
            name: 'BulkEditTree',
            children: this.getChildren(edits, fileContents),
            parent: undefined
        };
    }
    getChildren(edits, fileContentsMap) {
        let bulkEditInfos = [];
        if (edits) {
            bulkEditInfos = edits
                .map(edit => this.getResourcePath(edit))
                .filter((path, index, arr) => path && arr.indexOf(path) === index)
                .map((path) => this.createBulkEditInfo(path, new uri_1.default(path), fileContentsMap.get(path)))
                .filter(Boolean);
            if (bulkEditInfos.length > 0) {
                bulkEditInfos.forEach(editInfo => {
                    editInfo.children = edits.filter(edit => {
                        var _a, _b, _c, _d;
                        return ((('resource' in edit) && ((_b = (_a = edit) === null || _a === void 0 ? void 0 : _a.resource) === null || _b === void 0 ? void 0 : _b.path) === editInfo.id)) ||
                            (('newResource' in edit) && ((_d = (_c = edit) === null || _c === void 0 ? void 0 : _c.newResource) === null || _d === void 0 ? void 0 : _d.path) === editInfo.id);
                    })
                        .map((edit, index) => this.createBulkEditNode(('resource' in edit ? edit :
                        edit), index, editInfo));
                });
            }
        }
        return bulkEditInfos;
    }
    createBulkEditNode(bulkEdit, index, parent) {
        const id = parent.id + '_' + index;
        const existing = this.getNode(id);
        if (BulkEditNode.is(existing)) {
            existing.bulkEdit = bulkEdit;
            return existing;
        }
        return {
            id,
            name: 'bulkEdit',
            parent,
            selected: false,
            uri: parent.uri,
            bulkEdit
        };
    }
    createBulkEditInfo(id, uri, fileContents) {
        return {
            id,
            uri,
            expanded: true,
            selected: false,
            parent: this.root,
            fileContents,
            children: []
        };
    }
    getResourcePath(edit) {
        return monaco_workspace_1.ResourceTextEdit.is(edit) ? edit.resource.path :
            monaco_workspace_1.ResourceFileEdit.is(edit) && edit.newResource ? edit.newResource.path : undefined;
    }
};
BulkEditTree = __decorate([
    (0, inversify_1.injectable)()
], BulkEditTree);
exports.BulkEditTree = BulkEditTree;
var BulkEditNode;
(function (BulkEditNode) {
    function is(node) {
        return selection_1.UriSelection.is(node) && browser_1.SelectableTreeNode.is(node) && bulk_edit_node_selection_1.BulkEditNodeSelection.is(node);
    }
    BulkEditNode.is = is;
})(BulkEditNode = exports.BulkEditNode || (exports.BulkEditNode = {}));
var BulkEditInfoNode;
(function (BulkEditInfoNode) {
    function is(node) {
        return browser_1.ExpandableTreeNode.is(node) && selection_1.UriSelection.is(node) && 'fileContents' in node;
    }
    BulkEditInfoNode.is = is;
})(BulkEditInfoNode = exports.BulkEditInfoNode || (exports.BulkEditInfoNode = {}));
//# sourceMappingURL=bulk-edit-tree.js.map