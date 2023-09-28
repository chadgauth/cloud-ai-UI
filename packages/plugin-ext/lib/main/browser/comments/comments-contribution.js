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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsContribution = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const monaco = require("@theia/monaco-editor-core");
const comments_decorator_1 = require("./comments-decorator");
const browser_1 = require("@theia/editor/lib/browser");
const monaco_diff_editor_1 = require("@theia/monaco/lib/browser/monaco-diff-editor");
const comment_thread_widget_1 = require("./comment-thread-widget");
const comments_service_1 = require("./comments-service");
const common_1 = require("@theia/core/lib/common");
const vscode_uri_1 = require("@theia/core/shared/vscode-uri");
const comments_context_key_service_1 = require("./comments-context-key-service");
const context_key_service_1 = require("@theia/core/lib/browser/context-key-service");
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// some code copied and modified from https://github.com/microsoft/vscode/blob/1.49.3/src/vs/workbench/contrib/comments/browser/comments.contribution.ts
let CommentsContribution = class CommentsContribution {
    constructor(rangeDecorator, commentService, editorManager) {
        this.rangeDecorator = rangeDecorator;
        this.commentService = commentService;
        this.editorManager = editorManager;
        this.emptyThreadsToAddQueue = [];
        this.commentWidgets = [];
        this.commentInfos = [];
        this.commentService.onDidSetResourceCommentInfos(e => {
            const editor = this.getCurrentEditor();
            const editorURI = editor && editor.editor instanceof monaco_diff_editor_1.MonacoDiffEditor && editor.editor.diffEditor.getModifiedEditor().getModel();
            if (editorURI && editorURI.toString() === e.resource.toString()) {
                this.setComments(e.commentInfos.filter(commentInfo => commentInfo !== null));
            }
        });
        this.editorManager.onCreated(async (widget) => {
            const disposables = new common_1.DisposableCollection();
            const editor = widget.editor;
            if (editor instanceof monaco_diff_editor_1.MonacoDiffEditor) {
                const originalEditorModel = editor.diffEditor.getOriginalEditor().getModel();
                if (originalEditorModel) {
                    const originalComments = await this.commentService.getComments(originalEditorModel.uri);
                    if (originalComments) {
                        this.rangeDecorator.update(editor.diffEditor.getOriginalEditor(), originalComments.filter(c => !!c));
                    }
                }
                const modifiedEditorModel = editor.diffEditor.getModifiedEditor().getModel();
                if (modifiedEditorModel) {
                    const modifiedComments = await this.commentService.getComments(modifiedEditorModel.uri);
                    if (modifiedComments) {
                        this.rangeDecorator.update(editor.diffEditor.getModifiedEditor(), modifiedComments.filter(c => !!c));
                    }
                }
                disposables.push(editor.onMouseDown(e => this.onEditorMouseDown(e)));
                disposables.push(this.commentService.onDidUpdateCommentThreads(async (e) => {
                    const editorURI = editor.document.uri;
                    const commentInfo = this.commentInfos.filter(info => info.owner === e.owner);
                    if (!commentInfo || !commentInfo.length) {
                        return;
                    }
                    const added = e.added.filter(thread => thread.resource && thread.resource.toString() === editorURI.toString());
                    const removed = e.removed.filter(thread => thread.resource && thread.resource.toString() === editorURI.toString());
                    const changed = e.changed.filter(thread => thread.resource && thread.resource.toString() === editorURI.toString());
                    removed.forEach(thread => {
                        const matchedZones = this.commentWidgets.filter(zoneWidget => zoneWidget.owner === e.owner
                            && zoneWidget.commentThread.threadId === thread.threadId && zoneWidget.commentThread.threadId !== '');
                        if (matchedZones.length) {
                            const matchedZone = matchedZones[0];
                            const index = this.commentWidgets.indexOf(matchedZone);
                            this.commentWidgets.splice(index, 1);
                            matchedZone.dispose();
                        }
                    });
                    changed.forEach(thread => {
                        const matchedZones = this.commentWidgets.filter(zoneWidget => zoneWidget.owner === e.owner
                            && zoneWidget.commentThread.threadId === thread.threadId);
                        if (matchedZones.length) {
                            const matchedZone = matchedZones[0];
                            matchedZone.update();
                        }
                    });
                    added.forEach(thread => {
                        this.displayCommentThread(e.owner, thread);
                        this.commentInfos.filter(info => info.owner === e.owner)[0].threads.push(thread);
                    });
                }));
                editor.onDispose(() => {
                    disposables.dispose();
                });
                this.beginCompute();
            }
        });
    }
    onEditorMouseDown(e) {
        let mouseDownInfo = null;
        const range = e.target.range;
        if (!range) {
            return;
        }
        if (e.target.type !== monaco.editor.MouseTargetType.GUTTER_LINE_DECORATIONS) {
            return;
        }
        const data = e.target.detail;
        const gutterOffsetX = data.offsetX - data.glyphMarginWidth - data.lineNumbersWidth - data.glyphMarginLeft;
        // don't collide with folding and git decorations
        if (gutterOffsetX > 14) {
            return;
        }
        mouseDownInfo = { lineNumber: range.start };
        const { lineNumber } = mouseDownInfo;
        mouseDownInfo = null;
        if (!range || range.start !== lineNumber) {
            return;
        }
        if (!e.target.element) {
            return;
        }
        if (e.target.element.className.indexOf('comment-diff-added') >= 0) {
            this.addOrToggleCommentAtLine(e.target.position.line + 1, e);
        }
    }
    async beginCompute() {
        const editorModel = this.editor && this.editor.getModel();
        const editorURI = this.editor && editorModel && editorModel.uri;
        if (editorURI) {
            const comments = await this.commentService.getComments(editorURI);
            this.setComments(comments.filter(c => !!c));
        }
    }
    setComments(commentInfos) {
        if (!this.editor) {
            return;
        }
        this.commentInfos = commentInfos;
    }
    get editor() {
        const editor = this.getCurrentEditor();
        if (editor && editor.editor instanceof monaco_diff_editor_1.MonacoDiffEditor) {
            return editor.editor.diffEditor.getModifiedEditor();
        }
    }
    displayCommentThread(owner, thread) {
        const editor = this.editor;
        if (editor) {
            const provider = this.commentService.getCommentController(owner);
            if (provider) {
                this.commentsContextKeyService.commentController.set(provider.id);
            }
            const zoneWidget = new comment_thread_widget_1.CommentThreadWidget(editor, owner, thread, this.commentService, this.menus, this.commentsContextKeyService, this.commands);
            zoneWidget.display({ afterLineNumber: thread.range.startLineNumber, heightInLines: 5 });
            const currentEditor = this.getCurrentEditor();
            if (currentEditor) {
                currentEditor.onDispose(() => zoneWidget.dispose());
            }
            this.commentWidgets.push(zoneWidget);
        }
    }
    async addOrToggleCommentAtLine(lineNumber, e) {
        // If an add is already in progress, queue the next add and process it after the current one finishes to
        // prevent empty comment threads from being added to the same line.
        if (!this.addInProgress) {
            this.addInProgress = true;
            // The widget's position is undefined until the widget has been displayed, so rely on the glyph position instead
            const existingCommentsAtLine = this.commentWidgets.filter(widget => widget.getGlyphPosition() === lineNumber);
            if (existingCommentsAtLine.length) {
                existingCommentsAtLine.forEach(widget => widget.toggleExpand(lineNumber));
                this.processNextThreadToAdd();
                return;
            }
            else {
                this.addCommentAtLine(lineNumber, e);
            }
        }
        else {
            this.emptyThreadsToAddQueue.push([lineNumber, e]);
        }
    }
    processNextThreadToAdd() {
        this.addInProgress = false;
        const info = this.emptyThreadsToAddQueue.shift();
        if (info) {
            this.addOrToggleCommentAtLine(info[0], info[1]);
        }
    }
    getCurrentEditor() {
        return this.editorManager.currentEditor;
    }
    addCommentAtLine(lineNumber, e) {
        const newCommentInfos = this.rangeDecorator.getMatchedCommentAction(lineNumber);
        const editor = this.getCurrentEditor();
        if (!editor) {
            return Promise.resolve();
        }
        if (!newCommentInfos.length) {
            return Promise.resolve();
        }
        const { ownerId } = newCommentInfos[0];
        this.addCommentAtLine2(lineNumber, ownerId);
        return Promise.resolve();
    }
    addCommentAtLine2(lineNumber, ownerId) {
        const editorModel = this.editor && this.editor.getModel();
        const editorURI = this.editor && editorModel && editorModel.uri;
        if (editorURI) {
            this.commentService.createCommentThreadTemplate(ownerId, vscode_uri_1.URI.parse(editorURI.toString()), {
                startLineNumber: lineNumber,
                endLineNumber: lineNumber,
                startColumn: 1,
                endColumn: 1
            });
            this.processNextThreadToAdd();
        }
    }
};
__decorate([
    (0, inversify_1.inject)(common_1.MenuModelRegistry),
    __metadata("design:type", common_1.MenuModelRegistry)
], CommentsContribution.prototype, "menus", void 0);
__decorate([
    (0, inversify_1.inject)(comments_context_key_service_1.CommentsContextKeyService),
    __metadata("design:type", comments_context_key_service_1.CommentsContextKeyService)
], CommentsContribution.prototype, "commentsContextKeyService", void 0);
__decorate([
    (0, inversify_1.inject)(context_key_service_1.ContextKeyService),
    __metadata("design:type", Object)
], CommentsContribution.prototype, "contextKeyService", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.CommandRegistry),
    __metadata("design:type", common_1.CommandRegistry)
], CommentsContribution.prototype, "commands", void 0);
CommentsContribution = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(comments_decorator_1.CommentingRangeDecorator)),
    __param(1, (0, inversify_1.inject)(comments_service_1.CommentsService)),
    __param(2, (0, inversify_1.inject)(browser_1.EditorManager)),
    __metadata("design:paramtypes", [comments_decorator_1.CommentingRangeDecorator, Object, browser_1.EditorManager])
], CommentsContribution);
exports.CommentsContribution = CommentsContribution;
//# sourceMappingURL=comments-contribution.js.map