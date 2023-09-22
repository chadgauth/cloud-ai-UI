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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginCommentService = exports.CommentsService = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const event_1 = require("@theia/core/lib/common/event");
const cancellation_1 = require("@theia/core/lib/common/cancellation");
exports.CommentsService = Symbol('CommentsService');
let PluginCommentService = class PluginCommentService {
    constructor() {
        this.onDidSetDataProviderEmitter = new event_1.Emitter();
        this.onDidSetDataProvider = this.onDidSetDataProviderEmitter.event;
        this.onDidDeleteDataProviderEmitter = new event_1.Emitter();
        this.onDidDeleteDataProvider = this.onDidDeleteDataProviderEmitter.event;
        this.onDidSetResourceCommentInfosEmitter = new event_1.Emitter();
        this.onDidSetResourceCommentInfos = this.onDidSetResourceCommentInfosEmitter.event;
        this.onDidSetAllCommentThreadsEmitter = new event_1.Emitter();
        this.onDidSetAllCommentThreads = this.onDidSetAllCommentThreadsEmitter.event;
        this.onDidUpdateCommentThreadsEmitter = new event_1.Emitter();
        this.onDidUpdateCommentThreads = this.onDidUpdateCommentThreadsEmitter.event;
        this.onDidChangeActiveCommentThreadEmitter = new event_1.Emitter();
        this.onDidChangeActiveCommentThread = this.onDidChangeActiveCommentThreadEmitter.event;
        this.onDidChangeActiveCommentingRangeEmitter = new event_1.Emitter();
        this.onDidChangeActiveCommentingRange = this.onDidChangeActiveCommentingRangeEmitter.event;
        this.commentControls = new Map();
    }
    setActiveCommentThread(commentThread) {
        this.onDidChangeActiveCommentThreadEmitter.fire(commentThread);
    }
    setDocumentComments(resource, commentInfos) {
        this.onDidSetResourceCommentInfosEmitter.fire({ resource, commentInfos });
    }
    setWorkspaceComments(owner, commentsByResource) {
        this.onDidSetAllCommentThreadsEmitter.fire({ ownerId: owner, commentThreads: commentsByResource });
    }
    removeWorkspaceComments(owner) {
        this.onDidSetAllCommentThreadsEmitter.fire({ ownerId: owner, commentThreads: [] });
    }
    registerCommentController(owner, commentControl) {
        this.commentControls.set(owner, commentControl);
        this.onDidSetDataProviderEmitter.fire();
    }
    unregisterCommentController(owner) {
        this.commentControls.delete(owner);
        this.onDidDeleteDataProviderEmitter.fire(owner);
    }
    getCommentController(owner) {
        return this.commentControls.get(owner);
    }
    createCommentThreadTemplate(owner, resource, range) {
        const commentController = this.commentControls.get(owner);
        if (!commentController) {
            return;
        }
        commentController.createCommentThreadTemplate(resource, range);
    }
    async updateCommentThreadTemplate(owner, threadHandle, range) {
        const commentController = this.commentControls.get(owner);
        if (!commentController) {
            return;
        }
        await commentController.updateCommentThreadTemplate(threadHandle, range);
    }
    disposeCommentThread(owner, threadId) {
        const controller = this.getCommentController(owner);
        if (controller) {
            controller.deleteCommentThreadMain(threadId);
        }
    }
    updateComments(ownerId, event) {
        const evt = Object.assign({}, event, { owner: ownerId });
        this.onDidUpdateCommentThreadsEmitter.fire(evt);
    }
    async getComments(resource) {
        const commentControlResult = [];
        this.commentControls.forEach(control => {
            commentControlResult.push(control.getDocumentComments(resource, cancellation_1.CancellationToken.None)
                .catch(e => {
                console.log(e);
                return null;
            }));
        });
        return Promise.all(commentControlResult);
    }
    async getCommentingRanges(resource) {
        const commentControlResult = [];
        this.commentControls.forEach(control => {
            commentControlResult.push(control.getCommentingRanges(resource, cancellation_1.CancellationToken.None));
        });
        const ret = await Promise.all(commentControlResult);
        return ret.reduce((prev, curr) => {
            prev.push(...curr);
            return prev;
        }, []);
    }
};
PluginCommentService = __decorate([
    (0, inversify_1.injectable)()
], PluginCommentService);
exports.PluginCommentService = PluginCommentService;
//# sourceMappingURL=comments-service.js.map