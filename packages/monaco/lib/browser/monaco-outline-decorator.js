"use strict";
// *****************************************************************************
// Copyright (C) 2018 RedHat and others.
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
exports.MonacoOutlineDecorator = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const event_1 = require("@theia/core/lib/common/event");
const tree_iterator_1 = require("@theia/core/lib/browser/tree/tree-iterator");
const monaco_outline_contribution_1 = require("./monaco-outline-contribution");
let MonacoOutlineDecorator = class MonacoOutlineDecorator {
    constructor() {
        this.id = 'theia-monaco-outline-decorator';
        this.emitter = new event_1.Emitter();
    }
    async decorations(tree) {
        return this.collectDecorations(tree);
    }
    get onDidChangeDecorations() {
        return this.emitter.event;
    }
    collectDecorations(tree) {
        const result = new Map();
        if (tree.root === undefined) {
            return result;
        }
        for (const treeNode of new tree_iterator_1.DepthFirstTreeIterator(tree.root)) {
            if (monaco_outline_contribution_1.MonacoOutlineSymbolInformationNode.is(treeNode) && treeNode.detail) {
                result.set(treeNode.id, this.toDecoration(treeNode));
            }
        }
        return result;
    }
    toDecoration(node) {
        const captionSuffixes = [{
                data: (node.detail || ''),
                fontData: {
                    color: 'var(--theia-descriptionForeground)',
                }
            }];
        return {
            captionSuffixes
        };
    }
};
MonacoOutlineDecorator = __decorate([
    (0, inversify_1.injectable)()
], MonacoOutlineDecorator);
exports.MonacoOutlineDecorator = MonacoOutlineDecorator;
//# sourceMappingURL=monaco-outline-decorator.js.map