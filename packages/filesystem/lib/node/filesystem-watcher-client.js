"use strict";
// *****************************************************************************
// Copyright (C) 2017 TypeFox and others.
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
var FileSystemWatcherServerClient_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSystemWatcherServerClient = exports.NSFW_WATCHER = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const filesystem_watcher_protocol_1 = require("../common/filesystem-watcher-protocol");
const filesystem_watcher_dispatcher_1 = require("./filesystem-watcher-dispatcher");
exports.NSFW_WATCHER = 'nsfw-watcher';
/**
 * Wraps the NSFW singleton service for each frontend.
 */
let FileSystemWatcherServerClient = FileSystemWatcherServerClient_1 = class FileSystemWatcherServerClient {
    constructor() {
        /**
         * Track allocated watcherIds to de-allocate on disposal.
         */
        this.watcherIds = new Set();
        /**
         * @todo make this number precisely map to one specific frontend.
         */
        this.clientId = FileSystemWatcherServerClient_1.clientIdSequence++;
    }
    async watchFileChanges(uri, options) {
        const watcherId = await this.watcherService.watchFileChanges(this.clientId, uri, options);
        this.watcherIds.add(watcherId);
        return watcherId;
    }
    async unwatchFileChanges(watcherId) {
        this.watcherIds.delete(watcherId);
        return this.watcherService.unwatchFileChanges(watcherId);
    }
    setClient(client) {
        if (client !== undefined) {
            this.watcherDispatcher.registerClient(this.clientId, client);
        }
        else {
            this.watcherDispatcher.unregisterClient(this.clientId);
        }
    }
    dispose() {
        this.setClient(undefined);
        for (const watcherId of this.watcherIds) {
            this.unwatchFileChanges(watcherId);
        }
    }
};
FileSystemWatcherServerClient.clientIdSequence = 0;
__decorate([
    (0, inversify_1.inject)(filesystem_watcher_dispatcher_1.FileSystemWatcherServiceDispatcher),
    __metadata("design:type", filesystem_watcher_dispatcher_1.FileSystemWatcherServiceDispatcher)
], FileSystemWatcherServerClient.prototype, "watcherDispatcher", void 0);
__decorate([
    (0, inversify_1.inject)(filesystem_watcher_protocol_1.FileSystemWatcherService),
    __metadata("design:type", Object)
], FileSystemWatcherServerClient.prototype, "watcherService", void 0);
FileSystemWatcherServerClient = FileSystemWatcherServerClient_1 = __decorate([
    (0, inversify_1.injectable)()
], FileSystemWatcherServerClient);
exports.FileSystemWatcherServerClient = FileSystemWatcherServerClient;
//# sourceMappingURL=filesystem-watcher-client.js.map