"use strict";
/********************************************************************************
 * Copyright (C) 2021 1C-Soft LLC and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0
 ********************************************************************************/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindTreeViewDecoratorUtilities = exports.TreeViewDecoratorService = exports.TreeViewDecoratorAdapter = exports.TreeViewDecorator = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const tree_decorator_1 = require("@theia/core/lib/browser/tree/tree-decorator");
const core_1 = require("@theia/core");
const uri_1 = require("@theia/core/lib/common/uri");
const browser_1 = require("@theia/filesystem/lib/browser");
exports.TreeViewDecorator = Symbol('TreeViewDecorator');
let TreeViewDecoratorAdapter = class TreeViewDecoratorAdapter extends browser_1.FileTreeDecoratorAdapter {
    getUriForNode(node) {
        if (this.isTreeItem(node)) {
            return new uri_1.default(node.resourceUri).toString();
        }
    }
    isTreeItem(node) {
        return (0, core_1.isObject)(node) && !!node.resourceUri;
    }
};
TreeViewDecoratorAdapter = __decorate([
    (0, inversify_1.injectable)()
], TreeViewDecoratorAdapter);
exports.TreeViewDecoratorAdapter = TreeViewDecoratorAdapter;
let TreeViewDecoratorService = class TreeViewDecoratorService extends tree_decorator_1.AbstractTreeDecoratorService {
    constructor(contributions) {
        super(contributions.getContributions());
    }
};
TreeViewDecoratorService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(core_1.ContributionProvider)),
    __param(0, (0, inversify_1.named)(exports.TreeViewDecorator)),
    __metadata("design:paramtypes", [Object])
], TreeViewDecoratorService);
exports.TreeViewDecoratorService = TreeViewDecoratorService;
function bindTreeViewDecoratorUtilities(bind) {
    bind(TreeViewDecoratorAdapter).toSelf().inSingletonScope();
    (0, core_1.bindContributionProvider)(bind, exports.TreeViewDecorator);
    bind(exports.TreeViewDecorator).toService(TreeViewDecoratorAdapter);
}
exports.bindTreeViewDecoratorUtilities = bindTreeViewDecoratorUtilities;
//# sourceMappingURL=tree-view-decorator-service.js.map