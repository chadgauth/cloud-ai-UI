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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsMainImp = exports.CommentController = exports.CommentThreadImpl = void 0;
const event_1 = require("@theia/core/lib/common/event");
const plugin_api_rpc_1 = require("../../../common/plugin-api-rpc");
const comments_service_1 = require("./comments-service");
const vscode_uri_1 = require("@theia/core/shared/vscode-uri");
const uuid_1 = require("uuid");
const comments_contribution_1 = require("./comments-contribution");
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// some code copied and modified from https://github.com/microsoft/vscode/blob/1.49.3/src/vs/workbench/api/browser/mainThreadComments.ts
class CommentThreadImpl {
    constructor(commentThreadHandle, controllerHandle, extensionId, threadId, resource, _range) {
        this.commentThreadHandle = commentThreadHandle;
        this.controllerHandle = controllerHandle;
        this.extensionId = extensionId;
        this.threadId = threadId;
        this.resource = resource;
        this._range = _range;
        this.onDidChangeInputEmitter = new event_1.Emitter();
        this.onDidChangeLabelEmitter = new event_1.Emitter();
        this.onDidChangeLabel = this.onDidChangeLabelEmitter.event;
        this.onDidChangeCommentsEmitter = new event_1.Emitter();
        this.onDidChangeRangeEmitter = new event_1.Emitter();
        this.onDidChangeRange = this.onDidChangeRangeEmitter.event;
        this.onDidChangeCollapsibleStateEmitter = new event_1.Emitter();
        this.onDidChangeCollapsibleState = this.onDidChangeCollapsibleStateEmitter.event;
        this.onDidChangeStateEmitter = new event_1.Emitter();
        this.onDidChangeState = this.onDidChangeStateEmitter.event;
        this.onDidChangeCanReplyEmitter = new event_1.Emitter();
        this.onDidChangeCanReply = this.onDidChangeCanReplyEmitter.event;
        this._canReply = true;
        this._isDisposed = false;
    }
    get input() {
        return this._input;
    }
    set input(value) {
        this._input = value;
        this.onDidChangeInputEmitter.fire(value);
    }
    get onDidChangeInput() { return this.onDidChangeInputEmitter.event; }
    get label() {
        return this._label;
    }
    set label(label) {
        this._label = label;
        this.onDidChangeLabelEmitter.fire(this._label);
    }
    get contextValue() {
        return this._contextValue;
    }
    set contextValue(context) {
        this._contextValue = context;
    }
    get comments() {
        return this._comments;
    }
    set comments(newComments) {
        this._comments = newComments;
        this.onDidChangeCommentsEmitter.fire(this._comments);
    }
    get onDidChangeComments() { return this.onDidChangeCommentsEmitter.event; }
    set range(range) {
        this._range = range;
        this.onDidChangeRangeEmitter.fire(this._range);
    }
    get range() {
        return this._range;
    }
    get collapsibleState() {
        return this._collapsibleState;
    }
    set collapsibleState(newState) {
        this._collapsibleState = newState;
        this.onDidChangeCollapsibleStateEmitter.fire(this._collapsibleState);
    }
    get state() {
        return this._state;
    }
    set state(newState) {
        if (this._state !== newState) {
            this._state = newState;
            this.onDidChangeStateEmitter.fire(this._state);
        }
    }
    get isDisposed() {
        return this._isDisposed;
    }
    get canReply() {
        return this._canReply;
    }
    set canReply(canReply) {
        this._canReply = canReply;
        this.onDidChangeCanReplyEmitter.fire(this._canReply);
    }
    batchUpdate(changes) {
        const modified = (value) => Object.prototype.hasOwnProperty.call(changes, value);
        if (modified('range')) {
            this._range = changes.range;
        }
        if (modified('label')) {
            this._label = changes.label;
        }
        if (modified('contextValue')) {
            this._contextValue = changes.contextValue;
        }
        if (modified('comments')) {
            this._comments = changes.comments;
        }
        if (modified('collapseState')) {
            this._collapsibleState = changes.collapseState;
        }
        if (modified('state')) {
            this._state = changes.state;
        }
        if (modified('canReply')) {
            this._canReply = changes.canReply;
        }
    }
    dispose() {
        this._isDisposed = true;
        this.onDidChangeCollapsibleStateEmitter.dispose();
        this.onDidChangeStateEmitter.dispose();
        this.onDidChangeCommentsEmitter.dispose();
        this.onDidChangeInputEmitter.dispose();
        this.onDidChangeLabelEmitter.dispose();
        this.onDidChangeRangeEmitter.dispose();
        this.onDidChangeCanReplyEmitter.dispose();
    }
}
exports.CommentThreadImpl = CommentThreadImpl;
class CommentController {
    constructor(_proxy, _commentService, _handle, _uniqueId, _id, _label, _features) {
        this._proxy = _proxy;
        this._commentService = _commentService;
        this._handle = _handle;
        this._uniqueId = _uniqueId;
        this._id = _id;
        this._label = _label;
        this._features = _features;
        this.threads = new Map();
    }
    get handle() {
        return this._handle;
    }
    get id() {
        return this._id;
    }
    get contextValue() {
        return this._id;
    }
    get proxy() {
        return this._proxy;
    }
    get label() {
        return this._label;
    }
    get options() {
        return this._features.options;
    }
    get features() {
        return this._features;
    }
    updateFeatures(features) {
        this._features = features;
    }
    createCommentThread(extensionId, commentThreadHandle, threadId, resource, range) {
        const thread = new CommentThreadImpl(commentThreadHandle, this.handle, extensionId, threadId, vscode_uri_1.URI.revive(resource).toString(), range);
        this.threads.set(commentThreadHandle, thread);
        this._commentService.updateComments(this._uniqueId, {
            added: [thread],
            removed: [],
            changed: []
        });
        return thread;
    }
    updateCommentThread(commentThreadHandle, threadId, resource, changes) {
        const thread = this.getKnownThread(commentThreadHandle);
        thread.batchUpdate(changes);
        this._commentService.updateComments(this._uniqueId, {
            added: [],
            removed: [],
            changed: [thread]
        });
    }
    deleteCommentThread(commentThreadHandle) {
        const thread = this.getKnownThread(commentThreadHandle);
        this.threads.delete(commentThreadHandle);
        this._commentService.updateComments(this._uniqueId, {
            added: [],
            removed: [thread],
            changed: []
        });
        thread.dispose();
    }
    deleteCommentThreadMain(commentThreadId) {
        this.threads.forEach(thread => {
            if (thread.threadId === commentThreadId) {
                this._proxy.$deleteCommentThread(this._handle, thread.commentThreadHandle);
            }
        });
    }
    updateInput(input) {
        const thread = this.activeCommentThread;
        if (thread && thread.input) {
            const commentInput = thread.input;
            commentInput.value = input;
            thread.input = commentInput;
        }
    }
    getKnownThread(commentThreadHandle) {
        const thread = this.threads.get(commentThreadHandle);
        if (!thread) {
            throw new Error('unknown thread');
        }
        return thread;
    }
    async getDocumentComments(resource, token) {
        const ret = [];
        for (const thread of [...this.threads.keys()]) {
            const commentThread = this.threads.get(thread);
            if (commentThread.resource === resource.toString()) {
                ret.push(commentThread);
            }
        }
        const commentingRanges = await this._proxy.$provideCommentingRanges(this.handle, resource, token);
        return {
            owner: this._uniqueId,
            label: this.label,
            threads: ret,
            commentingRanges: {
                resource: resource,
                ranges: commentingRanges || []
            }
        };
    }
    async getCommentingRanges(resource, token) {
        const commentingRanges = await this._proxy.$provideCommentingRanges(this.handle, resource, token);
        return commentingRanges || [];
    }
    getAllComments() {
        const ret = [];
        for (const thread of [...this.threads.keys()]) {
            ret.push(this.threads.get(thread));
        }
        return ret;
    }
    createCommentThreadTemplate(resource, range) {
        this._proxy.$createCommentThreadTemplate(this.handle, resource, range);
    }
    async updateCommentThreadTemplate(threadHandle, range) {
        await this._proxy.$updateCommentThreadTemplate(this.handle, threadHandle, range);
    }
}
exports.CommentController = CommentController;
class CommentsMainImp {
    constructor(rpc, container) {
        this.documentProviders = new Map();
        this.workspaceProviders = new Map();
        this.handlers = new Map();
        this.commentControllers = new Map();
        this.proxy = rpc.getProxy(plugin_api_rpc_1.MAIN_RPC_CONTEXT.COMMENTS_EXT);
        container.get(comments_contribution_1.CommentsContribution);
        this.commentService = container.get(comments_service_1.CommentsService);
        this.commentService.onDidChangeActiveCommentThread(async (thread) => {
            const handle = thread.controllerHandle;
            const controller = this.commentControllers.get(handle);
            if (!controller) {
                return;
            }
            this.activeCommentThread = thread;
            controller.activeCommentThread = this.activeCommentThread;
        });
    }
    $registerCommentController(handle, id, label) {
        const providerId = (0, uuid_1.v4)();
        this.handlers.set(handle, providerId);
        const provider = new CommentController(this.proxy, this.commentService, handle, providerId, id, label, {});
        this.commentService.registerCommentController(providerId, provider);
        this.commentControllers.set(handle, provider);
        this.commentService.setWorkspaceComments(String(handle), []);
    }
    $unregisterCommentController(handle) {
        const providerId = this.handlers.get(handle);
        if (typeof providerId !== 'string') {
            throw new Error('unknown handler');
        }
        this.commentService.unregisterCommentController(providerId);
        this.handlers.delete(handle);
        this.commentControllers.delete(handle);
    }
    $updateCommentControllerFeatures(handle, features) {
        const provider = this.commentControllers.get(handle);
        if (!provider) {
            return undefined;
        }
        provider.updateFeatures(features);
    }
    $createCommentThread(handle, commentThreadHandle, threadId, resource, range, extensionId) {
        const provider = this.commentControllers.get(handle);
        if (!provider) {
            return undefined;
        }
        return provider.createCommentThread(extensionId, commentThreadHandle, threadId, resource, range);
    }
    $updateCommentThread(handle, commentThreadHandle, threadId, resource, changes) {
        const provider = this.commentControllers.get(handle);
        if (!provider) {
            return undefined;
        }
        return provider.updateCommentThread(commentThreadHandle, threadId, resource, changes);
    }
    $deleteCommentThread(handle, commentThreadHandle) {
        const provider = this.commentControllers.get(handle);
        if (!provider) {
            return;
        }
        return provider.deleteCommentThread(commentThreadHandle);
    }
    getHandler(handle) {
        if (!this.handlers.has(handle)) {
            throw new Error('Unknown handler');
        }
        return this.handlers.get(handle);
    }
    $onDidCommentThreadsChange(handle, event) {
        const providerId = this.getHandler(handle);
        this.commentService.updateComments(providerId, event);
    }
    dispose() {
        this.workspaceProviders.forEach(value => value.dispose());
        this.workspaceProviders.clear();
        this.documentProviders.forEach(value => value.dispose());
        this.documentProviders.clear();
    }
}
exports.CommentsMainImp = CommentsMainImp;
//# sourceMappingURL=comments-main.js.map