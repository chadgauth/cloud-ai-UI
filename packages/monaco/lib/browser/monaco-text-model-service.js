"use strict";
// *****************************************************************************
// Copyright (C) 2018 TypeFox and others.
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
exports.MonacoTextModelService = exports.MonacoEditorModelFactory = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const uri_1 = require("@theia/core/lib/common/uri");
const core_1 = require("@theia/core");
const browser_1 = require("@theia/editor/lib/browser");
const monaco_editor_model_1 = require("./monaco-editor-model");
const monaco_to_protocol_converter_1 = require("./monaco-to-protocol-converter");
const protocol_to_monaco_converter_1 = require("./protocol-to-monaco-converter");
const logger_1 = require("@theia/core/lib/common/logger");
const file_service_1 = require("@theia/filesystem/lib/browser/file-service");
const standaloneServices_1 = require("@theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices");
const textResourceConfiguration_1 = require("@theia/monaco-editor-core/esm/vs/editor/common/services/textResourceConfiguration");
exports.MonacoEditorModelFactory = Symbol('MonacoEditorModelFactory');
let MonacoTextModelService = class MonacoTextModelService {
    constructor() {
        /**
         * This component does some asynchronous work before being fully initialized.
         *
         * @deprecated since 1.25.0. Is instantly resolved.
         */
        this.ready = Promise.resolve();
        this._models = new core_1.ReferenceCollection(uri => this.loadModel(new uri_1.default(uri)));
        this.modelOptions = {
            'editor.tabSize': 'tabSize',
            'editor.insertSpaces': 'insertSpaces'
        };
    }
    init() {
        const resourcePropertiesService = standaloneServices_1.StandaloneServices.get(textResourceConfiguration_1.ITextResourcePropertiesService);
        if (resourcePropertiesService) {
            resourcePropertiesService.getEOL = () => {
                const eol = this.editorPreferences['files.eol'];
                if (eol && eol !== 'auto') {
                    return eol;
                }
                return core_1.OS.backend.EOL;
            };
        }
    }
    get models() {
        return this._models.values();
    }
    get(uri) {
        return this._models.get(uri);
    }
    get onDidCreate() {
        return this._models.onDidCreate;
    }
    createModelReference(raw) {
        return this._models.acquire(raw.toString());
    }
    async loadModel(uri) {
        await this.editorPreferences.ready;
        const resource = await this.resourceProvider(uri);
        const model = await (await this.createModel(resource)).load();
        this.updateModel(model);
        model.textEditorModel.onDidChangeLanguage(() => this.updateModel(model));
        const disposable = this.editorPreferences.onPreferenceChanged(change => this.updateModel(model, change));
        model.onDispose(() => disposable.dispose());
        return model;
    }
    createModel(resource) {
        const factory = this.factories.getContributions().find(({ scheme }) => resource.uri.scheme === scheme);
        return factory ? factory.createModel(resource) : new monaco_editor_model_1.MonacoEditorModel(resource, this.m2p, this.p2m, this.logger, this.editorPreferences);
    }
    toModelOption(editorPreference) {
        switch (editorPreference) {
            case 'editor.tabSize': return 'tabSize';
            case 'editor.insertSpaces': return 'insertSpaces';
            case 'editor.bracketPairColorization.enabled':
            case 'editor.bracketPairColorization.independentColorPoolPerBracketType':
                return 'bracketColorizationOptions';
            case 'editor.trimAutoWhitespace': return 'trimAutoWhitespace';
        }
        return undefined;
    }
    updateModel(model, change) {
        if (!change) {
            model.autoSave = this.editorPreferences.get('files.autoSave', undefined, model.uri);
            model.autoSaveDelay = this.editorPreferences.get('files.autoSaveDelay', undefined, model.uri);
            model.textEditorModel.updateOptions(this.getModelOptions(model));
        }
        else if (change.affects(model.uri, model.languageId)) {
            if (change.preferenceName === 'files.autoSave') {
                model.autoSave = this.editorPreferences.get('files.autoSave', undefined, model.uri);
            }
            if (change.preferenceName === 'files.autoSaveDelay') {
                model.autoSaveDelay = this.editorPreferences.get('files.autoSaveDelay', undefined, model.uri);
            }
            const modelOption = this.toModelOption(change.preferenceName);
            if (modelOption) {
                model.textEditorModel.updateOptions(this.getModelOptions(model));
            }
        }
    }
    getModelOptions(arg) {
        const uri = typeof arg === 'string' ? arg : arg.uri;
        const overrideIdentifier = typeof arg === 'string' ? undefined : arg.languageId;
        return {
            tabSize: this.editorPreferences.get({ preferenceName: 'editor.tabSize', overrideIdentifier }, undefined, uri),
            insertSpaces: this.editorPreferences.get({ preferenceName: 'editor.insertSpaces', overrideIdentifier }, undefined, uri),
            bracketColorizationOptions: {
                enabled: this.editorPreferences.get({ preferenceName: 'editor.bracketPairColorization.enabled', overrideIdentifier }, undefined, uri),
                independentColorPoolPerBracketType: this.editorPreferences.get({ preferenceName: 'editor.bracketPairColorization.independentColorPoolPerBracketType', overrideIdentifier }, undefined, uri),
            },
            trimAutoWhitespace: this.editorPreferences.get({ preferenceName: 'editor.trimAutoWhitespace', overrideIdentifier }, undefined, uri),
        };
    }
    registerTextModelContentProvider(scheme, provider) {
        return {
            dispose() {
                // no-op
            }
        };
    }
    canHandleResource(resource) {
        return this.fileService.canHandleResource(new uri_1.default(resource));
    }
};
__decorate([
    (0, inversify_1.inject)(core_1.ResourceProvider),
    __metadata("design:type", Function)
], MonacoTextModelService.prototype, "resourceProvider", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.EditorPreferences),
    __metadata("design:type", Object)
], MonacoTextModelService.prototype, "editorPreferences", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_to_protocol_converter_1.MonacoToProtocolConverter),
    __metadata("design:type", monaco_to_protocol_converter_1.MonacoToProtocolConverter)
], MonacoTextModelService.prototype, "m2p", void 0);
__decorate([
    (0, inversify_1.inject)(protocol_to_monaco_converter_1.ProtocolToMonacoConverter),
    __metadata("design:type", protocol_to_monaco_converter_1.ProtocolToMonacoConverter)
], MonacoTextModelService.prototype, "p2m", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.ContributionProvider),
    (0, inversify_1.named)(exports.MonacoEditorModelFactory),
    __metadata("design:type", Object)
], MonacoTextModelService.prototype, "factories", void 0);
__decorate([
    (0, inversify_1.inject)(logger_1.ILogger),
    __metadata("design:type", Object)
], MonacoTextModelService.prototype, "logger", void 0);
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], MonacoTextModelService.prototype, "fileService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MonacoTextModelService.prototype, "init", null);
MonacoTextModelService = __decorate([
    (0, inversify_1.injectable)()
], MonacoTextModelService);
exports.MonacoTextModelService = MonacoTextModelService;
//# sourceMappingURL=monaco-text-model-service.js.map