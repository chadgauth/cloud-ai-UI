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
exports.NotebookEditorWidgetFactory = void 0;
const core_1 = require("@theia/core");
const browser_1 = require("@theia/core/lib/browser");
const inversify_1 = require("@theia/core/shared/inversify");
const notebook_editor_widget_1 = require("./notebook-editor-widget");
const notebook_service_1 = require("./service/notebook-service");
const notebook_model_resolver_service_1 = require("./service/notebook-model-resolver-service");
let NotebookEditorWidgetFactory = class NotebookEditorWidgetFactory {
    constructor() {
        this.id = notebook_editor_widget_1.NotebookEditorWidget.ID;
    }
    async createWidget(options) {
        if (!options) {
            throw new Error('no options found for widget. Need at least uri and notebookType');
        }
        const uri = new core_1.URI(options.uri);
        await this.notebookService.willOpenNotebook(options.notebookType);
        const editor = await this.createEditor(uri, options.notebookType);
        const icon = this.labelProvider.getIcon(uri);
        editor.title.label = this.labelProvider.getName(uri);
        editor.title.iconClass = icon + ' file-icon';
        return editor;
    }
    async createEditor(uri, notebookType) {
        return this.createNotebookEditorWidget({
            uri,
            notebookType,
            notebookData: this.notebookModelResolver.resolve(uri, notebookType),
        });
    }
};
__decorate([
    (0, inversify_1.inject)(notebook_service_1.NotebookService),
    __metadata("design:type", notebook_service_1.NotebookService)
], NotebookEditorWidgetFactory.prototype, "notebookService", void 0);
__decorate([
    (0, inversify_1.inject)(notebook_model_resolver_service_1.NotebookModelResolverService),
    __metadata("design:type", notebook_model_resolver_service_1.NotebookModelResolverService)
], NotebookEditorWidgetFactory.prototype, "notebookModelResolver", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.LabelProvider),
    __metadata("design:type", browser_1.LabelProvider)
], NotebookEditorWidgetFactory.prototype, "labelProvider", void 0);
__decorate([
    (0, inversify_1.inject)(notebook_editor_widget_1.NotebookEditorContainerFactory),
    __metadata("design:type", Function)
], NotebookEditorWidgetFactory.prototype, "createNotebookEditorWidget", void 0);
NotebookEditorWidgetFactory = __decorate([
    (0, inversify_1.injectable)()
], NotebookEditorWidgetFactory);
exports.NotebookEditorWidgetFactory = NotebookEditorWidgetFactory;
//# sourceMappingURL=notebook-editor-widget-factory.js.map