"use strict";
// *****************************************************************************
// Copyright (C) 2018 TypeFox and others.
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
exports.CallHierarchyTreeModel = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/core/lib/browser");
const callhierarchy_tree_1 = require("./callhierarchy-tree");
const callhierarchy_service_1 = require("../callhierarchy-service");
const uri_1 = require("@theia/core/lib/common/uri");
const cancellation_1 = require("@theia/core/lib/common/cancellation");
let CallHierarchyTreeModel = class CallHierarchyTreeModel extends browser_1.TreeModelImpl {
    getTree() {
        return this.tree;
    }
    get languageId() {
        return this._languageId;
    }
    async initializeCallHierarchy(languageId, uri, position) {
        var _a;
        this.tree.root = undefined;
        this.tree.callHierarchyService = undefined;
        this._languageId = languageId;
        if (languageId && uri && position) {
            const callHierarchyService = this.callHierarchyServiceProvider.get(languageId, new uri_1.default(uri));
            if (callHierarchyService) {
                this.tree.callHierarchyService = callHierarchyService;
                const cancellationSource = new cancellation_1.CancellationTokenSource();
                const rootDefinition = await callHierarchyService.getRootDefinition(uri, position, cancellationSource.token);
                if (rootDefinition) {
                    (_a = this.currentSession) === null || _a === void 0 ? void 0 : _a.dispose();
                    this.currentSession = rootDefinition;
                    const root = {
                        id: 'call-hierarchy-tree-root',
                        parent: undefined,
                        children: [],
                        visible: false,
                    };
                    rootDefinition.items.forEach(definition => browser_1.CompositeTreeNode.addChild(root, callhierarchy_tree_1.ItemNode.create(definition, root)));
                    this.tree.root = root;
                }
            }
        }
    }
    doOpenNode(node) {
        // do nothing (in particular do not expand the node)
    }
};
__decorate([
    (0, inversify_1.inject)(callhierarchy_tree_1.CallHierarchyTree),
    __metadata("design:type", callhierarchy_tree_1.CallHierarchyTree)
], CallHierarchyTreeModel.prototype, "tree", void 0);
__decorate([
    (0, inversify_1.inject)(callhierarchy_service_1.CallHierarchyServiceProvider),
    __metadata("design:type", callhierarchy_service_1.CallHierarchyServiceProvider)
], CallHierarchyTreeModel.prototype, "callHierarchyServiceProvider", void 0);
CallHierarchyTreeModel = __decorate([
    (0, inversify_1.injectable)()
], CallHierarchyTreeModel);
exports.CallHierarchyTreeModel = CallHierarchyTreeModel;
//# sourceMappingURL=callhierarchy-tree-model.js.map