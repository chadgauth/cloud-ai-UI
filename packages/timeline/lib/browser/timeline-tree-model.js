"use strict";
// *****************************************************************************
// Copyright (C) 2020 RedHat and others.
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
exports.TimelineTreeModel = exports.LOAD_MORE_COMMAND = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const tree_1 = require("@theia/core/lib/browser/tree");
exports.LOAD_MORE_COMMAND = {
    id: 'timeline-load-more'
};
let TimelineTreeModel = class TimelineTreeModel extends tree_1.TreeModelImpl {
    updateTree(items, hasMoreItems) {
        const root = {
            id: 'timeline-tree-root',
            parent: undefined,
            visible: false,
            children: []
        };
        const children = items.map(item => ({
            timelineItem: item,
            id: item.id ? item.id : item.timestamp.toString(),
            parent: root,
            detail: item.detail,
            selected: false,
            visible: true
        }));
        let loadMore;
        if (hasMoreItems) {
            const loadMoreNode = { label: 'Load-more', timestamp: 0, handle: '', uri: '', source: '' };
            loadMoreNode.command = exports.LOAD_MORE_COMMAND;
            loadMore = {
                timelineItem: loadMoreNode,
                id: 'load-more',
                parent: root,
                selected: true
            };
            children.push(loadMore);
        }
        root.children = children;
        this.root = root;
        if (loadMore) {
            this.selectionService.addSelection(loadMore);
        }
    }
};
TimelineTreeModel = __decorate([
    (0, inversify_1.injectable)()
], TimelineTreeModel);
exports.TimelineTreeModel = TimelineTreeModel;
//# sourceMappingURL=timeline-tree-model.js.map