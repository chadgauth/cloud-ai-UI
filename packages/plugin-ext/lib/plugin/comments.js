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
exports.ExtHostCommentThread = exports.CommentsExtImpl = void 0;
const types_impl_1 = require("./types-impl");
const plugin_api_rpc_model_1 = require("../common/plugin-api-rpc-model");
const event_1 = require("@theia/core/lib/common/event");
const disposable_1 = require("@theia/core/lib/common/disposable");
const type_converters_1 = require("./type-converters");
const plugin_api_rpc_1 = require("../common/plugin-api-rpc");
class CommentsExtImpl {
    constructor(rpc, commands, _documents) {
        this.rpc = rpc;
        this.commands = commands;
        this._documents = _documents;
        this.handle = 0;
        this.commentControllers = new Map();
        this.commentControllersByExtension = new Map();
        this.proxy = rpc.getProxy(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.COMMENTS_MAIN);
        commands.registerArgumentProcessor({
            processArgument: arg => {
                if (plugin_api_rpc_1.CommentsCommandArg.is(arg)) {
                    const commentController = this.commentControllers.get(arg.commentControlHandle);
                    if (!commentController) {
                        return arg;
                    }
                    const commentThread = commentController.getCommentThread(arg.commentThreadHandle);
                    if (!commentThread) {
                        return arg;
                    }
                    return {
                        thread: commentThread,
                        text: arg.text
                    };
                }
                else if (plugin_api_rpc_1.CommentsContextCommandArg.is(arg)) {
                    const commentController = this.commentControllers.get(arg.commentControlHandle);
                    if (!commentController) {
                        return arg;
                    }
                    const commentThread = commentController.getCommentThread(arg.commentThreadHandle);
                    if (!commentThread) {
                        return arg;
                    }
                    const comment = commentThread.getCommentByUniqueId(arg.commentUniqueId);
                    if (!comment) {
                        return arg;
                    }
                    return comment;
                }
                else if (plugin_api_rpc_1.CommentsEditCommandArg.is(arg)) {
                    const commentController = this.commentControllers.get(arg.commentControlHandle);
                    if (!commentController) {
                        return arg;
                    }
                    const commentThread = commentController.getCommentThread(arg.commentThreadHandle);
                    if (!commentThread) {
                        return arg;
                    }
                    const comment = commentThread.getCommentByUniqueId(arg.commentUniqueId);
                    if (!comment) {
                        return arg;
                    }
                    comment.body = arg.text;
                    return comment;
                }
                return arg;
            }
        });
    }
    createCommentController(plugin, id, label) {
        const handle = this.handle++;
        const commentController = new CommentController(plugin.model.id, this.proxy, handle, id, label);
        this.commentControllers.set(commentController.handle, commentController);
        const commentControllers = this.commentControllersByExtension.get(plugin.model.id.toLowerCase()) || [];
        commentControllers.push(commentController);
        this.commentControllersByExtension.set(plugin.model.id.toLowerCase(), commentControllers);
        return commentController;
    }
    $createCommentThreadTemplate(commentControllerHandle, uriComponents, range) {
        const commentController = this.commentControllers.get(commentControllerHandle);
        if (!commentController) {
            return;
        }
        commentController.$createCommentThreadTemplate(uriComponents, range);
    }
    async $updateCommentThreadTemplate(commentControllerHandle, threadHandle, range) {
        const commentController = this.commentControllers.get(commentControllerHandle);
        if (!commentController) {
            return;
        }
        commentController.$updateCommentThreadTemplate(threadHandle, range);
    }
    async $deleteCommentThread(commentControllerHandle, commentThreadHandle) {
        const commentController = this.commentControllers.get(commentControllerHandle);
        if (commentController) {
            commentController.$deleteCommentThread(commentThreadHandle);
        }
    }
    async $provideCommentingRanges(commentControllerHandle, uriComponents, token) {
        const commentController = this.commentControllers.get(commentControllerHandle);
        if (!commentController || !commentController.commentingRangeProvider) {
            return Promise.resolve(undefined);
        }
        const documentData = this._documents.getDocumentData(types_impl_1.URI.revive(uriComponents));
        if (documentData) {
            const ranges = await commentController.commentingRangeProvider.provideCommentingRanges(documentData.document, token);
            if (ranges) {
                return ranges.map(x => (0, type_converters_1.fromRange)(x));
            }
        }
    }
}
exports.CommentsExtImpl = CommentsExtImpl;
class ExtHostCommentThread {
    constructor(proxy, commentController, _id, _uri, _range, _comments, extensionId) {
        this.proxy = proxy;
        this.commentController = commentController;
        this._id = _id;
        this._uri = _uri;
        this._range = _range;
        this._comments = _comments;
        this.handle = ExtHostCommentThread._handlePool++;
        this.commentHandle = 0;
        this.modifications = Object.create(null);
        this._onDidUpdateCommentThread = new event_1.Emitter();
        this.onDidUpdateCommentThread = this._onDidUpdateCommentThread.event;
        this._canReply = true;
        this.commentsMap = new Map();
        this.acceptInputDisposables = new disposable_1.DisposableCollection();
        if (this._id === undefined) {
            this._id = `${commentController.id}.${this.handle}`;
        }
        this.proxy.$createCommentThread(this.commentController.handle, this.handle, this._id, this._uri, (0, type_converters_1.fromRange)(this._range), extensionId);
        this.localDisposables = [];
        this._isDisposed = false;
        this.localDisposables.push(this.onDidUpdateCommentThread(() => {
            this.eventuallyUpdateCommentThread();
        }));
        // set up comments after ctor to batch update events.
        this.comments = _comments;
    }
    set threadId(id) {
        this._id = id;
    }
    get threadId() {
        return this._id;
    }
    get id() {
        return this._id;
    }
    get resource() {
        return this._uri;
    }
    get uri() {
        return this._uri;
    }
    set range(range) {
        if (!range.isEqual(this._range)) {
            this._range = range;
            this.modifications.range = range;
            this._onDidUpdateCommentThread.fire();
        }
    }
    get range() {
        return this._range;
    }
    get label() {
        return this._label;
    }
    set label(label) {
        this._label = label;
        this.modifications.label = label;
        this._onDidUpdateCommentThread.fire();
    }
    get contextValue() {
        return this._contextValue;
    }
    set contextValue(context) {
        this._contextValue = context;
        this.modifications.contextValue = context;
        this._onDidUpdateCommentThread.fire();
    }
    get comments() {
        return this._comments;
    }
    set comments(newComments) {
        this._comments = newComments;
        this.modifications.comments = newComments;
        this._onDidUpdateCommentThread.fire();
    }
    get collapsibleState() {
        return this.collapseState;
    }
    set collapsibleState(newState) {
        this.collapseState = newState;
        this.modifications.collapsibleState = newState;
        this._onDidUpdateCommentThread.fire();
    }
    get state() {
        return this._state;
    }
    set state(newState) {
        if (this._state !== newState) {
            this._state = newState;
            this.modifications.state = newState;
            this._onDidUpdateCommentThread.fire();
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
        this.modifications.canReply = canReply;
        this._onDidUpdateCommentThread.fire();
    }
    eventuallyUpdateCommentThread() {
        if (this._isDisposed) {
            return;
        }
        const modified = (value) => Object.prototype.hasOwnProperty.call(this.modifications, value);
        const formattedModifications = {};
        if (modified('range')) {
            formattedModifications.range = (0, type_converters_1.fromRange)(this._range);
        }
        if (modified('label')) {
            formattedModifications.label = this.label;
        }
        if (modified('contextValue')) {
            formattedModifications.contextValue = this.contextValue;
        }
        if (modified('comments')) {
            formattedModifications.comments =
                this._comments.map(comment => convertToModeComment(this, this.commentController, comment, this.commentsMap));
        }
        if (modified('collapsibleState')) {
            formattedModifications.collapseState = convertToCollapsibleState(this.collapseState);
        }
        if (modified('state')) {
            formattedModifications.state = convertToState(this._state);
        }
        if (modified('canReply')) {
            formattedModifications.canReply = this.canReply;
        }
        this.modifications = {};
        this.proxy.$updateCommentThread(this.commentController.handle, this.handle, this._id, this._uri, formattedModifications);
    }
    getCommentByUniqueId(uniqueId) {
        for (const key of this.commentsMap) {
            const comment = key[0];
            const id = key[1];
            if (uniqueId === id) {
                return comment;
            }
        }
        return;
    }
    dispose() {
        this._isDisposed = true;
        this.acceptInputDisposables.dispose();
        this.localDisposables.forEach(disposable => disposable.dispose());
        this.proxy.$deleteCommentThread(this.commentController.handle, this.handle);
    }
}
exports.ExtHostCommentThread = ExtHostCommentThread;
ExtHostCommentThread._handlePool = 0;
class CommentController {
    constructor(extension, proxy, _handle, _id, _label) {
        this.extension = extension;
        this.proxy = proxy;
        this._handle = _handle;
        this._id = _id;
        this._label = _label;
        this.threads = new Map();
        this.proxy.$registerCommentController(this.handle, _id, _label);
    }
    get id() {
        return this._id;
    }
    get label() {
        return this._label;
    }
    get handle() {
        return this._handle;
    }
    get options() {
        return this._options;
    }
    set options(options) {
        this._options = options;
        this.proxy.$updateCommentControllerFeatures(this.handle, { options: this._options });
    }
    createCommentThread(arg0, arg1, arg2, arg3) {
        if (typeof arg0 === 'string') {
            const commentThread = new ExtHostCommentThread(this.proxy, this, arg0, arg1, arg2, arg3, this.extension);
            this.threads.set(commentThread.handle, commentThread);
            return commentThread;
        }
        else {
            const commentThread = new ExtHostCommentThread(this.proxy, this, undefined, arg0, arg1, arg2, this.extension);
            this.threads.set(commentThread.handle, commentThread);
            return commentThread;
        }
    }
    $createCommentThreadTemplate(uriComponents, range) {
        const commentThread = new ExtHostCommentThread(this.proxy, this, undefined, types_impl_1.URI.revive(uriComponents), (0, type_converters_1.toRange)(range), [], this.extension);
        commentThread.collapsibleState = plugin_api_rpc_model_1.CommentThreadCollapsibleState.Expanded;
        this.threads.set(commentThread.handle, commentThread);
        return commentThread;
    }
    $updateCommentThreadTemplate(threadHandle, range) {
        const thread = this.threads.get(threadHandle);
        if (thread) {
            thread.range = (0, type_converters_1.toRange)(range);
        }
    }
    $deleteCommentThread(threadHandle) {
        const thread = this.threads.get(threadHandle);
        if (thread) {
            thread.dispose();
        }
        this.threads.delete(threadHandle);
    }
    getCommentThread(handle) {
        return this.threads.get(handle);
    }
    dispose() {
        this.threads.forEach(value => {
            value.dispose();
        });
        this.proxy.$unregisterCommentController(this.handle);
    }
}
function convertToModeComment(thread, commentController, theiaComment, commentsMap) {
    let commentUniqueId = commentsMap.get(theiaComment);
    if (!commentUniqueId) {
        commentUniqueId = ++thread.commentHandle;
        commentsMap.set(theiaComment, commentUniqueId);
    }
    const iconPath = theiaComment.author && theiaComment.author.iconPath ? theiaComment.author.iconPath.toString() : undefined;
    const date = theiaComment.timestamp ? theiaComment.timestamp.toISOString() : undefined;
    return {
        mode: theiaComment.mode,
        contextValue: theiaComment.contextValue,
        uniqueIdInThread: commentUniqueId,
        body: (0, type_converters_1.fromMarkdown)(theiaComment.body),
        userName: theiaComment.author.name,
        userIconPath: iconPath,
        label: theiaComment.label,
        timestamp: date,
    };
}
function convertToCollapsibleState(kind) {
    if (kind !== undefined) {
        switch (kind) {
            case types_impl_1.CommentThreadCollapsibleState.Expanded:
                return plugin_api_rpc_model_1.CommentThreadCollapsibleState.Expanded;
            case types_impl_1.CommentThreadCollapsibleState.Collapsed:
                return plugin_api_rpc_model_1.CommentThreadCollapsibleState.Collapsed;
        }
    }
    return plugin_api_rpc_model_1.CommentThreadCollapsibleState.Collapsed;
}
function convertToState(kind) {
    if (kind !== undefined) {
        switch (kind) {
            case types_impl_1.CommentThreadState.Resolved:
                return plugin_api_rpc_model_1.CommentThreadState.Resolved;
            case types_impl_1.CommentThreadState.Unresolved:
                return plugin_api_rpc_model_1.CommentThreadState.Unresolved;
        }
    }
    return plugin_api_rpc_model_1.CommentThreadState.Unresolved;
}
//# sourceMappingURL=comments.js.map