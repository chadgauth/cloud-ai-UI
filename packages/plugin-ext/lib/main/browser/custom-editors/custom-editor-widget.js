"use strict";
// *****************************************************************************
// Copyright (C) 2021 SAP SE or an SAP affiliate company and others.
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
var CustomEditorWidget_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomEditorWidget = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const uri_1 = require("@theia/core/lib/common/uri");
const browser_1 = require("@theia/core/lib/browser");
const save_resource_service_1 = require("@theia/core/lib/browser/save-resource-service");
const webview_1 = require("../webview/webview");
const undo_redo_service_1 = require("@theia/editor/lib/browser/undo-redo-service");
let CustomEditorWidget = CustomEditorWidget_1 = class CustomEditorWidget extends webview_1.WebviewWidget {
    get modelRef() {
        return this._modelRef;
    }
    set modelRef(modelRef) {
        this._modelRef = modelRef;
        this.doUpdateContent();
        browser_1.Saveable.apply(this, () => this.shell.widgets.filter(widget => !!browser_1.Saveable.get(widget)), (widget, options) => this.saveService.save(widget, options));
    }
    get saveable() {
        return this._modelRef.object;
    }
    init() {
        super.init();
        this.id = CustomEditorWidget_1.FACTORY_ID + ':' + this.identifier.id;
        this.toDispose.push(this.fileService.onDidRunOperation(e => {
            if (e.isOperation(2 /* MOVE */)) {
                this.doMove(e.target.resource);
            }
        }));
    }
    undo() {
        this.undoRedoService.undo(this.resource);
    }
    redo() {
        this.undoRedoService.redo(this.resource);
    }
    async save(options) {
        await this._modelRef.object.saveCustomEditor(options);
    }
    async saveAs(source, target, options) {
        const result = await this._modelRef.object.saveCustomEditorAs(source, target, options);
        this.doMove(target);
        return result;
    }
    getResourceUri() {
        return this.resource;
    }
    createMoveToUri(resourceUri) {
        return this.resource.withPath(resourceUri.path);
    }
    storeState() {
        return {
            ...super.storeState(),
            strResource: this.resource.toString(),
        };
    }
    restoreState(oldState) {
        const { strResource } = oldState;
        this.resource = new uri_1.default(strResource);
        super.restoreState(oldState);
    }
    onMove(handler) {
        this._moveHandler = handler;
    }
    doMove(target) {
        if (this._moveHandler) {
            this._moveHandler(target);
        }
    }
};
CustomEditorWidget.FACTORY_ID = 'plugin-custom-editor';
__decorate([
    (0, inversify_1.inject)(undo_redo_service_1.UndoRedoService),
    __metadata("design:type", undo_redo_service_1.UndoRedoService)
], CustomEditorWidget.prototype, "undoRedoService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.ApplicationShell),
    __metadata("design:type", browser_1.ApplicationShell)
], CustomEditorWidget.prototype, "shell", void 0);
__decorate([
    (0, inversify_1.inject)(save_resource_service_1.SaveResourceService),
    __metadata("design:type", save_resource_service_1.SaveResourceService)
], CustomEditorWidget.prototype, "saveService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CustomEditorWidget.prototype, "init", null);
CustomEditorWidget = CustomEditorWidget_1 = __decorate([
    (0, inversify_1.injectable)()
], CustomEditorWidget);
exports.CustomEditorWidget = CustomEditorWidget;
//# sourceMappingURL=custom-editor-widget.js.map