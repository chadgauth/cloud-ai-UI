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
exports.TypeHierarchyTreeModel = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const tree_model_1 = require("@theia/core/lib/browser/tree/tree-model");
const typehierarchy_provider_1 = require("../typehierarchy-provider");
const typehierarchy_tree_1 = require("./typehierarchy-tree");
let TypeHierarchyTreeModel = class TypeHierarchyTreeModel extends tree_model_1.TreeModelImpl {
    doOpenNode(node) {
        // do nothing (in particular do not expand the node)
    }
    /**
     * Initializes the tree by calculating and setting a new tree root node.
     */
    async initialize(options) {
        this.tree.root = undefined;
        this.tree.provider = undefined;
        const { location, languageId, direction } = options;
        if (languageId && location) {
            const provider = await this.registry.get(languageId);
            if (provider) {
                const params = {
                    textDocument: {
                        uri: location.uri
                    },
                    position: location.range.start,
                    direction,
                    resolve: 1
                };
                const symbol = await provider.get(params);
                if (symbol) {
                    const root = typehierarchy_tree_1.TypeHierarchyTree.RootNode.create(symbol, direction);
                    root.expanded = true;
                    this.tree.root = root;
                    this.tree.provider = provider;
                }
            }
        }
    }
    /**
     * If the tree root is set, it resets it with the inverse type hierarchy direction.
     */
    async flipDirection() {
        const { root } = this.tree;
        const service = this.tree.provider;
        if (typehierarchy_tree_1.TypeHierarchyTree.RootNode.is(root) && !!service) {
            const { direction, item } = root;
            const { uri, selectionRange } = item;
            const location = {
                uri,
                range: selectionRange
            };
            this.initialize({
                direction: direction === 0 /* Children */ ? 1 /* Parents */ : 0 /* Children */,
                location,
                languageId: service.languageId
            });
        }
    }
};
__decorate([
    (0, inversify_1.inject)(typehierarchy_provider_1.TypeHierarchyRegistry),
    __metadata("design:type", typehierarchy_provider_1.TypeHierarchyRegistry)
], TypeHierarchyTreeModel.prototype, "registry", void 0);
TypeHierarchyTreeModel = __decorate([
    (0, inversify_1.injectable)()
], TypeHierarchyTreeModel);
exports.TypeHierarchyTreeModel = TypeHierarchyTreeModel;
//# sourceMappingURL=typehierarchy-tree-model.js.map