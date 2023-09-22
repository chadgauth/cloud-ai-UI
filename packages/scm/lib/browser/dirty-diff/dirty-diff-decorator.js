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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirtyDiffDecorator = exports.DirtyDiffDecorationType = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/editor/lib/browser");
var DirtyDiffDecorationType;
(function (DirtyDiffDecorationType) {
    DirtyDiffDecorationType["AddedLine"] = "dirty-diff-added-line";
    DirtyDiffDecorationType["RemovedLine"] = "dirty-diff-removed-line";
    DirtyDiffDecorationType["ModifiedLine"] = "dirty-diff-modified-line";
})(DirtyDiffDecorationType = exports.DirtyDiffDecorationType || (exports.DirtyDiffDecorationType = {}));
const AddedLineDecoration = {
    linesDecorationsClassName: 'dirty-diff-glyph dirty-diff-added-line',
    overviewRuler: {
        color: {
            id: 'editorOverviewRuler.addedForeground'
        },
        position: browser_1.OverviewRulerLane.Left,
    },
    minimap: {
        color: {
            id: 'minimapGutter.addedBackground'
        },
        position: browser_1.MinimapPosition.Gutter
    },
    isWholeLine: true
};
const RemovedLineDecoration = {
    linesDecorationsClassName: 'dirty-diff-glyph dirty-diff-removed-line',
    overviewRuler: {
        color: {
            id: 'editorOverviewRuler.deletedForeground'
        },
        position: browser_1.OverviewRulerLane.Left,
    },
    minimap: {
        color: {
            id: 'minimapGutter.deletedBackground'
        },
        position: browser_1.MinimapPosition.Gutter
    },
    isWholeLine: false
};
const ModifiedLineDecoration = {
    linesDecorationsClassName: 'dirty-diff-glyph dirty-diff-modified-line',
    overviewRuler: {
        color: {
            id: 'editorOverviewRuler.modifiedForeground'
        },
        position: browser_1.OverviewRulerLane.Left,
    },
    minimap: {
        color: {
            id: 'minimapGutter.modifiedBackground'
        },
        position: browser_1.MinimapPosition.Gutter
    },
    isWholeLine: true
};
let DirtyDiffDecorator = class DirtyDiffDecorator extends browser_1.EditorDecorator {
    applyDecorations(update) {
        const modifications = update.modified.map(range => this.toDeltaDecoration(range, ModifiedLineDecoration));
        const additions = update.added.map(range => this.toDeltaDecoration(range, AddedLineDecoration));
        const removals = update.removed.map(line => this.toDeltaDecoration(line, RemovedLineDecoration));
        const decorations = [...modifications, ...additions, ...removals];
        this.setDecorations(update.editor, decorations);
    }
    toDeltaDecoration(from, options) {
        const [start, end] = (typeof from === 'number') ? [from, from] : [from.start, from.end];
        const range = browser_1.Range.create(browser_1.Position.create(start, 0), browser_1.Position.create(end, 0));
        return { range, options };
    }
};
DirtyDiffDecorator = __decorate([
    (0, inversify_1.injectable)()
], DirtyDiffDecorator);
exports.DirtyDiffDecorator = DirtyDiffDecorator;
//# sourceMappingURL=dirty-diff-decorator.js.map