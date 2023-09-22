"use strict";
// *****************************************************************************
// Copyright (C) 2023 TypeFox and others.
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
exports.NotebookService = exports.NotebookProvider = void 0;
const core_1 = require("@theia/core");
const inversify_1 = require("@theia/core/shared/inversify");
const notebook_model_1 = require("../view-model/notebook-model");
const file_service_1 = require("@theia/filesystem/lib/browser/file-service");
const monaco_text_model_service_1 = require("@theia/monaco/lib/browser/monaco-text-model-service");
const notebook_cell_model_1 = require("../view-model/notebook-cell-model");
const promise_util_1 = require("@theia/core/lib/common/promise-util");
exports.NotebookProvider = Symbol('notebook provider');
let NotebookService = class NotebookService {
    constructor() {
        this.notebookSerializerEmitter = new core_1.Emitter();
        this.onNotebookSerializer = this.notebookSerializerEmitter.event;
        this.disposables = new core_1.DisposableCollection();
        this.notebookProviders = new Map();
        this.notebookModels = new Map();
        this.didAddViewTypeEmitter = new core_1.Emitter();
        this.onDidAddViewType = this.didAddViewTypeEmitter.event;
        this.didRemoveViewTypeEmitter = new core_1.Emitter();
        this.onDidRemoveViewType = this.didRemoveViewTypeEmitter.event;
        this.willOpenNotebookTypeEmitter = new core_1.Emitter();
        this.onWillOpenNotebook = this.willOpenNotebookTypeEmitter.event;
        this.willAddNotebookDocumentEmitter = new core_1.Emitter();
        this.onWillAddNotebookDocument = this.willAddNotebookDocumentEmitter.event;
        this.didAddNotebookDocumentEmitter = new core_1.Emitter();
        this.onDidAddNotebookDocument = this.didAddNotebookDocumentEmitter.event;
        this.willRemoveNotebookDocumentEmitter = new core_1.Emitter();
        this.onWillRemoveNotebookDocument = this.willRemoveNotebookDocumentEmitter.event;
        this.didRemoveNotebookDocumentEmitter = new core_1.Emitter();
        this.onDidRemoveNotebookDocument = this.didRemoveNotebookDocumentEmitter.event;
        this.ready = new promise_util_1.Deferred();
    }
    dispose() {
        this.disposables.dispose();
    }
    /**
     * Marks the notebook service as ready. From this point on, the service will start dispatching the `onNotebookSerializer` event.
     */
    markReady() {
        this.ready.resolve();
    }
    registerNotebookSerializer(notebookType, extensionData, serializer) {
        if (this.notebookProviders.has(notebookType)) {
            throw new Error(`notebook provider for viewtype '${notebookType}' already exists`);
        }
        this.notebookProviders.set(notebookType, { notebookType: notebookType, serializer, extensionData });
        this.didAddViewTypeEmitter.fire(notebookType);
        return core_1.Disposable.create(() => {
            this.notebookProviders.delete(notebookType);
            this.didRemoveViewTypeEmitter.fire(notebookType);
        });
    }
    async createNotebookModel(data, viewType, uri) {
        var _a;
        const serializer = (_a = this.notebookProviders.get(viewType)) === null || _a === void 0 ? void 0 : _a.serializer;
        if (!serializer) {
            throw new Error('no notebook serializer for ' + viewType);
        }
        this.willAddNotebookDocumentEmitter.fire(uri);
        const model = this.notebookModelFactory({ data, uri, viewType, serializer });
        this.notebookModels.set(uri.toString(), model);
        // Resolve cell text models right after creating the notebook model
        // This ensures that all text models are available in the plugin host
        await Promise.all(model.cells.map(e => e.resolveTextModel()));
        this.didAddNotebookDocumentEmitter.fire(model);
        return model;
    }
    async getNotebookDataProvider(viewType) {
        await this.ready.promise;
        await this.notebookSerializerEmitter.sequence(async (listener) => listener(`onNotebookSerializer:${viewType}`));
        const result = await this.waitForNotebookProvider(viewType);
        if (!result) {
            throw new Error(`No provider registered for view type: '${viewType}'`);
        }
        return result;
    }
    /**
     * When the application starts up, notebook providers from plugins are not registered yet.
     * It takes a few seconds for the plugin host to start so that notebook data providers can be registered.
     * This methods waits until the notebook provider is registered.
     */
    async waitForNotebookProvider(type) {
        if (this.notebookProviders.has(type)) {
            return this.notebookProviders.get(type);
        }
        const deferred = new promise_util_1.Deferred();
        // 20 seconds of timeout
        const timeoutDuration = 20000;
        const disposable = this.onDidAddViewType(viewType => {
            if (viewType === type) {
                clearTimeout(timeout);
                disposable.dispose();
                deferred.resolve(this.notebookProviders.get(type));
            }
        });
        const timeout = setTimeout(() => {
            clearTimeout(timeout);
            disposable.dispose();
            deferred.reject();
        }, timeoutDuration);
        return deferred.promise;
    }
    getNotebookEditorModel(uri) {
        return this.notebookModels.get(uri.toString());
    }
    getNotebookModels() {
        return this.notebookModels.values();
    }
    async willOpenNotebook(type) {
        return this.willOpenNotebookTypeEmitter.sequence(async (listener) => listener(type));
    }
    listNotebookDocuments() {
        return [...this.notebookModels.values()];
    }
};
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], NotebookService.prototype, "fileService", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_text_model_service_1.MonacoTextModelService),
    __metadata("design:type", monaco_text_model_service_1.MonacoTextModelService)
], NotebookService.prototype, "modelService", void 0);
__decorate([
    (0, inversify_1.inject)(notebook_model_1.NotebookModelFactory),
    __metadata("design:type", Function)
], NotebookService.prototype, "notebookModelFactory", void 0);
__decorate([
    (0, inversify_1.inject)(notebook_cell_model_1.NotebookCellModelFactory),
    __metadata("design:type", Function)
], NotebookService.prototype, "notebookCellModelFactory", void 0);
NotebookService = __decorate([
    (0, inversify_1.injectable)()
], NotebookService);
exports.NotebookService = NotebookService;
//# sourceMappingURL=notebook-service.js.map