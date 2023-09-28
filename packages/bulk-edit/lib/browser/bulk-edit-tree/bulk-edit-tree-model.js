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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkEditTreeModel = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const bulk_edit_tree_1 = require("./bulk-edit-tree");
const browser_1 = require("@theia/core/lib/browser");
let BulkEditTreeModel = class BulkEditTreeModel extends browser_1.TreeModelImpl {
    doOpenNode(node) {
        if (bulk_edit_tree_1.BulkEditNode.is(node)) {
            (0, browser_1.open)(this.openerService, node.uri, undefined);
        }
        else {
            super.doOpenNode(node);
        }
    }
    revealNode(node) {
        this.doOpenNode(node);
    }
    async initModel(edits, fileContents) {
        this.tree.initTree(edits, fileContents);
    }
};
__decorate([
    (0, inversify_1.inject)(bulk_edit_tree_1.BulkEditTree),
    __metadata("design:type", bulk_edit_tree_1.BulkEditTree)
], BulkEditTreeModel.prototype, "tree", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.OpenerService),
    __metadata("design:type", Object)
], BulkEditTreeModel.prototype, "openerService", void 0);
BulkEditTreeModel = __decorate([
    (0, inversify_1.injectable)()
], BulkEditTreeModel);
exports.BulkEditTreeModel = BulkEditTreeModel;
//# sourceMappingURL=bulk-edit-tree-model.js.map