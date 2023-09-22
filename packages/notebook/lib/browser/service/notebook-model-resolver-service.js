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
exports.NotebookModelResolverService = void 0;
const core_1 = require("@theia/core");
const inversify_1 = require("@theia/core/shared/inversify");
const file_service_1 = require("@theia/filesystem/lib/browser/file-service");
const common_1 = require("../../common");
const notebook_service_1 = require("./notebook-service");
const notebook_type_registry_1 = require("../notebook-type-registry");
let NotebookModelResolverService = class NotebookModelResolverService {
    constructor() {
        this.onDidChangeDirtyEmitter = new core_1.Emitter();
        this.onDidChangeDirty = this.onDidChangeDirtyEmitter.event;
        this.onDidSaveNotebookEmitter = new core_1.Emitter();
        this.onDidSaveNotebook = this.onDidSaveNotebookEmitter.event;
    }
    async resolve(arg, viewType) {
        var _a, _b;
        let resource;
        // let hasAssociatedFilePath = false;
        if (arg instanceof core_1.URI) {
            resource = arg;
        }
        else {
            arg = arg;
            if (!arg.untitledResource) {
                const notebookTypeInfo = this.notebookTypeRegistry.notebookTypes.find(info => info.type === viewType);
                if (!notebookTypeInfo) {
                    throw new Error('UNKNOWN view type: ' + viewType);
                }
                const suffix = (_b = this.getPossibleFileEndings((_a = notebookTypeInfo.selector) !== null && _a !== void 0 ? _a : [])) !== null && _b !== void 0 ? _b : '';
                for (let counter = 1;; counter++) {
                    const candidate = new core_1.URI()
                        .withScheme('untitled')
                        .withPath(`Untitled-notebook-${counter}${suffix}`)
                        .withQuery(viewType);
                    if (!this.notebookService.getNotebookEditorModel(candidate)) {
                        resource = candidate;
                        break;
                    }
                }
            }
            else if (arg.untitledResource.scheme === 'untitled') {
                resource = arg.untitledResource;
            }
            else {
                resource = arg.untitledResource.withScheme('untitled');
                // hasAssociatedFilePath = true;
            }
        }
        const notebookData = await this.resolveExistingNotebookData(resource, viewType);
        const notebookModel = await this.notebookService.createNotebookModel(notebookData, viewType, resource);
        notebookModel.onDirtyChanged(() => this.onDidChangeDirtyEmitter.fire(notebookModel));
        notebookModel.onDidSaveNotebook(() => this.onDidSaveNotebookEmitter.fire(notebookModel.uri.toComponents()));
        return notebookModel;
    }
    async resolveExistingNotebookData(resource, viewType) {
        if (resource.scheme === 'untitled') {
            return {
                cells: [
                    {
                        cellKind: common_1.CellKind.Markup,
                        language: 'markdown',
                        outputs: [],
                        source: ''
                    }
                ],
                metadata: {}
            };
        }
        else {
            const file = await this.fileService.readFile(resource);
            const dataProvider = await this.notebookService.getNotebookDataProvider(viewType);
            const notebook = await dataProvider.serializer.dataToNotebook(file.value);
            return notebook;
        }
    }
    getPossibleFileEndings(selectors) {
        for (const selector of selectors) {
            const ending = this.possibleFileEnding(selector);
            if (ending) {
                return ending;
            }
        }
        return undefined;
    }
    possibleFileEnding(selector) {
        const pattern = /^.*(\.[a-zA-Z0-9_-]+)$/;
        const candidate = typeof selector === 'string' ? selector : selector.filenamePattern;
        if (candidate) {
            const match = pattern.exec(candidate);
            if (match) {
                return match[1];
            }
        }
        return undefined;
    }
};
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], NotebookModelResolverService.prototype, "fileService", void 0);
__decorate([
    (0, inversify_1.inject)(notebook_service_1.NotebookService),
    __metadata("design:type", notebook_service_1.NotebookService)
], NotebookModelResolverService.prototype, "notebookService", void 0);
__decorate([
    (0, inversify_1.inject)(notebook_type_registry_1.NotebookTypeRegistry),
    __metadata("design:type", notebook_type_registry_1.NotebookTypeRegistry)
], NotebookModelResolverService.prototype, "notebookTypeRegistry", void 0);
NotebookModelResolverService = __decorate([
    (0, inversify_1.injectable)()
], NotebookModelResolverService);
exports.NotebookModelResolverService = NotebookModelResolverService;
//# sourceMappingURL=notebook-model-resolver-service.js.map