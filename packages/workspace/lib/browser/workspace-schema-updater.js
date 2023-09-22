"use strict";
// *****************************************************************************
// Copyright (C) 2021 Ericsson and others.
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
exports.workspaceSchema = exports.workspaceSchemaId = exports.WorkspaceSchema = exports.WorkspaceSchemaUpdater = exports.AddKeyMessage = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const common_1 = require("@theia/core/lib/common");
const uri_1 = require("@theia/core/lib/common/uri");
const promise_util_1 = require("@theia/core/lib/common/promise-util");
const common_2 = require("../common");
var AddKeyMessage;
(function (AddKeyMessage) {
    AddKeyMessage.is = (message) => !!message && message.schema !== undefined;
})(AddKeyMessage = exports.AddKeyMessage || (exports.AddKeyMessage = {}));
let WorkspaceSchemaUpdater = class WorkspaceSchemaUpdater {
    constructor() {
        this.uri = new uri_1.default(exports.workspaceSchemaId);
        this.editQueue = [];
        this.safeToHandleQueue = new promise_util_1.Deferred();
    }
    init() {
        this.inmemoryResources.add(this.uri, JSON.stringify(exports.workspaceSchema));
        this.safeToHandleQueue.resolve();
    }
    registerSchemas(context) {
        context.registerSchema({
            fileMatch: this.workspaceFileService.getWorkspaceFileExtensions(true),
            url: this.uri.toString()
        });
    }
    async retrieveCurrent() {
        const current = await this.inmemoryResources.resolve(this.uri).readContents();
        const content = JSON.parse(current);
        if (!WorkspaceSchema.is(content)) {
            throw new Error('Failed to retrieve current workspace schema.');
        }
        return content;
    }
    async updateSchema(message) {
        const doHandle = this.editQueue.length === 0;
        const deferred = new promise_util_1.Deferred();
        this.editQueue.push({ ...message, deferred });
        if (doHandle) {
            this.handleQueue();
        }
        return deferred.promise;
    }
    async handleQueue() {
        await this.safeToHandleQueue.promise;
        this.safeToHandleQueue = new promise_util_1.Deferred();
        const cache = await this.retrieveCurrent();
        while (this.editQueue.length) {
            const nextMessage = this.editQueue.shift();
            if (AddKeyMessage.is(nextMessage)) {
                this.addKey(nextMessage, cache);
            }
            else if (nextMessage) {
                this.removeKey(nextMessage, cache);
            }
        }
        this.inmemoryResources.update(this.uri, JSON.stringify(cache));
        this.safeToHandleQueue.resolve();
    }
    addKey({ key, schema, deferred }, cache) {
        if (key in cache.properties) {
            return deferred.resolve(false);
        }
        cache.properties[key] = schema;
        deferred.resolve(true);
    }
    removeKey({ key, deferred }, cache) {
        const canDelete = !cache.required.includes(key);
        if (!canDelete) {
            return deferred.resolve(false);
        }
        const keyPresent = delete cache.properties[key];
        deferred.resolve(keyPresent);
    }
};
__decorate([
    (0, inversify_1.inject)(common_1.InMemoryResources),
    __metadata("design:type", common_1.InMemoryResources)
], WorkspaceSchemaUpdater.prototype, "inmemoryResources", void 0);
__decorate([
    (0, inversify_1.inject)(common_2.WorkspaceFileService),
    __metadata("design:type", common_2.WorkspaceFileService)
], WorkspaceSchemaUpdater.prototype, "workspaceFileService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WorkspaceSchemaUpdater.prototype, "init", null);
WorkspaceSchemaUpdater = __decorate([
    (0, inversify_1.injectable)()
], WorkspaceSchemaUpdater);
exports.WorkspaceSchemaUpdater = WorkspaceSchemaUpdater;
var WorkspaceSchema;
(function (WorkspaceSchema) {
    function is(candidate) {
        return (0, common_1.isObject)(candidate)
            && typeof candidate.properties === 'object'
            && (0, common_1.isArray)(candidate.required);
    }
    WorkspaceSchema.is = is;
})(WorkspaceSchema = exports.WorkspaceSchema || (exports.WorkspaceSchema = {}));
exports.workspaceSchemaId = 'vscode://schemas/workspace';
exports.workspaceSchema = {
    $id: exports.workspaceSchemaId,
    type: 'object',
    title: 'Workspace File',
    required: ['folders'],
    default: { folders: [{ path: '' }], settings: {} },
    properties: {
        folders: {
            description: 'Root folders in the workspace',
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    path: {
                        type: 'string',
                    }
                },
                required: ['path']
            }
        }
    },
    allowComments: true,
    allowTrailingCommas: true,
};
//# sourceMappingURL=workspace-schema-updater.js.map