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
exports.NotebookCellResourceResolver = exports.NotebookCellResource = void 0;
const core_1 = require("@theia/core");
const inversify_1 = require("@theia/core/shared/inversify");
const common_1 = require("../common");
const notebook_service_1 = require("./service/notebook-service");
class NotebookCellResource {
    constructor(uri, cell) {
        this.uri = uri;
        this.didChangeContentsEmitter = new core_1.Emitter();
        this.onDidChangeContents = this.didChangeContentsEmitter.event;
        this.cell = cell;
    }
    readContents(options) {
        return Promise.resolve(this.cell.source);
    }
    dispose() {
        this.didChangeContentsEmitter.dispose();
    }
}
exports.NotebookCellResource = NotebookCellResource;
let NotebookCellResourceResolver = class NotebookCellResourceResolver {
    async resolve(uri) {
        if (uri.scheme !== common_1.CellUri.scheme) {
            throw new Error(`Cannot resolve cell uri with scheme '${uri.scheme}'`);
        }
        const parsedUri = common_1.CellUri.parse(uri);
        if (!parsedUri) {
            throw new Error(`Cannot parse uri '${uri.toString()}'`);
        }
        const notebookModel = this.notebookService.getNotebookEditorModel(parsedUri.notebook);
        if (!notebookModel) {
            throw new Error(`No notebook found for uri '${parsedUri.notebook}'`);
        }
        const notebookCellModel = notebookModel.cells.find(cell => cell.handle === parsedUri.handle);
        if (!notebookCellModel) {
            throw new Error(`No cell found with handle '${parsedUri.handle}' in '${parsedUri.notebook}'`);
        }
        return new NotebookCellResource(uri, notebookCellModel);
    }
};
__decorate([
    (0, inversify_1.inject)(notebook_service_1.NotebookService),
    __metadata("design:type", notebook_service_1.NotebookService)
], NotebookCellResourceResolver.prototype, "notebookService", void 0);
NotebookCellResourceResolver = __decorate([
    (0, inversify_1.injectable)()
], NotebookCellResourceResolver);
exports.NotebookCellResourceResolver = NotebookCellResourceResolver;
//# sourceMappingURL=notebook-cell-resource-resolver.js.map