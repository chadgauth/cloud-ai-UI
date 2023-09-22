"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditorModelService = void 0;
// *****************************************************************************
// Copyright (C) 2018 Red Hat, Inc. and others.
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
const core_1 = require("@theia/core");
const inversify_1 = require("@theia/core/shared/inversify");
const monaco_text_model_service_1 = require("@theia/monaco/lib/browser/monaco-text-model-service");
const monaco_workspace_1 = require("@theia/monaco/lib/browser/monaco-workspace");
const uri_components_1 = require("../../common/uri-components");
let EditorModelService = class EditorModelService {
    constructor(monacoModelService, monacoWorkspace) {
        this.modelModeChangedEmitter = new core_1.Emitter();
        this.onModelRemovedEmitter = new core_1.Emitter();
        this.modelDirtyEmitter = new core_1.Emitter();
        this.modelSavedEmitter = new core_1.Emitter();
        this.onModelWillSavedEmitter = new core_1.Emitter();
        this.onModelDirtyChanged = this.modelDirtyEmitter.event;
        this.onModelSaved = this.modelSavedEmitter.event;
        this.onModelModeChanged = this.modelModeChangedEmitter.event;
        this.onModelRemoved = this.onModelRemovedEmitter.event;
        this.onModelWillSave = this.onModelWillSavedEmitter.event;
        this.monacoModelService = monacoModelService;
        monacoModelService.models.forEach(model => this.modelCreated(model));
        monacoModelService.onDidCreate(this.modelCreated, this);
        monacoWorkspace.onDidCloseTextDocument(model => {
            setTimeout(() => {
                this.onModelRemovedEmitter.fire(model);
            }, 1);
        });
    }
    modelCreated(model) {
        model.textEditorModel.onDidChangeLanguage(e => {
            this.modelModeChangedEmitter.fire({ model, oldModeId: e.oldLanguage });
        });
        model.onDidSaveModel(_ => {
            this.modelSavedEmitter.fire(model);
        });
        model.onDirtyChanged(_ => {
            this.modelDirtyEmitter.fire(model);
        });
        model.onWillSaveModel(willSaveModelEvent => {
            this.onModelWillSavedEmitter.fire(willSaveModelEvent);
        });
    }
    get onModelAdded() {
        return this.monacoModelService.onDidCreate;
    }
    getModels() {
        return this.monacoModelService.models;
    }
    async saveAll(includeUntitled) {
        const saves = [];
        for (const model of this.monacoModelService.models) {
            const { uri } = model.textEditorModel;
            if (model.dirty && (includeUntitled || uri.scheme !== uri_components_1.Schemes.untitled)) {
                saves.push((async () => {
                    try {
                        await model.save();
                        return true;
                    }
                    catch (e) {
                        console.error('Failed to save ', uri.toString(), e);
                        return false;
                    }
                })());
            }
        }
        const results = await Promise.all(saves);
        return results.reduce((a, b) => a && b, true);
    }
    async createModelReference(uri) {
        return this.monacoModelService.createModelReference(uri);
    }
};
EditorModelService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(monaco_text_model_service_1.MonacoTextModelService)),
    __param(1, (0, inversify_1.inject)(monaco_workspace_1.MonacoWorkspace)),
    __metadata("design:paramtypes", [monaco_text_model_service_1.MonacoTextModelService,
        monaco_workspace_1.MonacoWorkspace])
], EditorModelService);
exports.EditorModelService = EditorModelService;
//# sourceMappingURL=text-editor-model-service.js.map