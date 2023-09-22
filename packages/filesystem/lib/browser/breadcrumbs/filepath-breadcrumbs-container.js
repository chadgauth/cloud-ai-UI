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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BreadcrumbsFileTreeWidget = exports.createFileTreeBreadcrumbsWidget = exports.createFileTreeBreadcrumbsContainer = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/core/lib/browser");
const file_tree_1 = require("../file-tree");
const BREADCRUMBS_FILETREE_CLASS = 'theia-FilepathBreadcrumbFileTree';
function createFileTreeBreadcrumbsContainer(parent) {
    const child = (0, file_tree_1.createFileTreeContainer)(parent);
    child.unbind(file_tree_1.FileTreeWidget);
    child.rebind(browser_1.TreeProps).toConstantValue({ ...browser_1.defaultTreeProps, virtualized: false });
    child.bind(BreadcrumbsFileTreeWidget).toSelf();
    return child;
}
exports.createFileTreeBreadcrumbsContainer = createFileTreeBreadcrumbsContainer;
function createFileTreeBreadcrumbsWidget(parent) {
    return createFileTreeBreadcrumbsContainer(parent).get(BreadcrumbsFileTreeWidget);
}
exports.createFileTreeBreadcrumbsWidget = createFileTreeBreadcrumbsWidget;
let BreadcrumbsFileTreeWidget = class BreadcrumbsFileTreeWidget extends file_tree_1.FileTreeWidget {
    constructor(props, model, contextMenuRenderer) {
        super(props, model, contextMenuRenderer);
        this.model = model;
        this.addClass(BREADCRUMBS_FILETREE_CLASS);
    }
    createNodeAttributes(node, props) {
        const elementAttrs = super.createNodeAttributes(node, props);
        return {
            ...elementAttrs,
            draggable: false
        };
    }
    tapNode(node) {
        if (file_tree_1.FileStatNode.is(node) && !node.fileStat.isDirectory) {
            (0, browser_1.open)(this.openerService, node.uri, { preview: true });
        }
        else {
            super.tapNode(node);
        }
    }
};
__decorate([
    (0, inversify_1.inject)(browser_1.OpenerService),
    __metadata("design:type", Object)
], BreadcrumbsFileTreeWidget.prototype, "openerService", void 0);
BreadcrumbsFileTreeWidget = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(browser_1.TreeProps)),
    __param(1, (0, inversify_1.inject)(file_tree_1.FileTreeModel)),
    __param(2, (0, inversify_1.inject)(browser_1.ContextMenuRenderer)),
    __metadata("design:paramtypes", [Object, file_tree_1.FileTreeModel,
        browser_1.ContextMenuRenderer])
], BreadcrumbsFileTreeWidget);
exports.BreadcrumbsFileTreeWidget = BreadcrumbsFileTreeWidget;
//# sourceMappingURL=filepath-breadcrumbs-container.js.map