"use strict";
// *****************************************************************************
// Copyright (C) 2020 Red Hat, Inc. and others.
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
exports.CommentingRangeDecorator = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
let CommentingRangeDecorator = class CommentingRangeDecorator {
    constructor() {
        this.commentingRangeDecorations = [];
        this.decorationOptions = {
            isWholeLine: true,
            linesDecorationsClassName: 'comment-range-glyph comment-diff-added'
        };
    }
    update(editor, commentInfos) {
        const model = editor.getModel();
        if (!model) {
            return;
        }
        const commentingRangeDecorations = [];
        for (const info of commentInfos) {
            info.commentingRanges.ranges.forEach(range => {
                commentingRangeDecorations.push(new CommentingRangeDecoration(editor, info.owner, info.extensionId, info.label, range, this.decorationOptions, info.commentingRanges));
            });
        }
        const oldDecorations = this.commentingRangeDecorations.map(decoration => decoration.id);
        editor.deltaDecorations(oldDecorations, []);
        this.commentingRangeDecorations = commentingRangeDecorations;
    }
    getMatchedCommentAction(line) {
        const result = [];
        for (const decoration of this.commentingRangeDecorations) {
            const range = decoration.getActiveRange();
            if (range && range.startLineNumber <= line && line <= range.endLineNumber) {
                result.push(decoration.getCommentAction());
            }
        }
        return result;
    }
};
CommentingRangeDecorator = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], CommentingRangeDecorator);
exports.CommentingRangeDecorator = CommentingRangeDecorator;
class CommentingRangeDecoration {
    constructor(_editor, _ownerId, _extensionId, _label, _range, commentingOptions, commentingRangesInfo) {
        this._editor = _editor;
        this._ownerId = _ownerId;
        this._extensionId = _extensionId;
        this._label = _label;
        this._range = _range;
        this.commentingRangesInfo = commentingRangesInfo;
        const startLineNumber = _range.startLineNumber;
        const endLineNumber = _range.endLineNumber;
        const commentingRangeDecorations = [{
                range: {
                    startLineNumber: startLineNumber, startColumn: 1,
                    endLineNumber: endLineNumber, endColumn: 1
                },
                options: commentingOptions
            }];
        this.decorationId = this._editor.deltaDecorations([], commentingRangeDecorations)[0];
    }
    get id() {
        return this.decorationId;
    }
    getCommentAction() {
        return {
            extensionId: this._extensionId,
            label: this._label,
            ownerId: this._ownerId,
            commentingRangesInfo: this.commentingRangesInfo
        };
    }
    getOriginalRange() {
        return this._range;
    }
    getActiveRange() {
        const range = this._editor.getModel().getDecorationRange(this.decorationId);
        if (range) {
            return range;
        }
    }
}
//# sourceMappingURL=comments-decorator.js.map