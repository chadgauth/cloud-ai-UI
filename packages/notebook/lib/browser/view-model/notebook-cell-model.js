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
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
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
exports.NotebookCellModel = exports.createNotebookCellModelContainer = exports.NotebookCellModelFactory = void 0;
const core_1 = require("@theia/core");
const inversify_1 = require("@theia/core/shared/inversify");
const monaco_text_model_service_1 = require("@theia/monaco/lib/browser/monaco-text-model-service");
const notebook_cell_output_model_1 = require("./notebook-cell-output-model");
exports.NotebookCellModelFactory = Symbol('NotebookModelFactory');
function createNotebookCellModelContainer(parent, props, notebookCellContextManager) {
    const child = parent.createChild();
    child.bind(NotebookCellModelProps).toConstantValue(props);
    // We need the constructor as property here to avoid circular dependencies for the context manager
    child.bind(NotebookCellContextManager).to(notebookCellContextManager).inSingletonScope();
    child.bind(NotebookCellModel).toSelf();
    return child;
}
exports.createNotebookCellModelContainer = createNotebookCellModelContainer;
const NotebookCellContextManager = Symbol('NotebookCellContextManager');
const NotebookCellModelProps = Symbol('NotebookModelProps');
let NotebookCellModel = class NotebookCellModel {
    constructor() {
        this.onDidChangeOutputsEmitter = new core_1.Emitter();
        this.onDidChangeOutputs = this.onDidChangeOutputsEmitter.event;
        this.onDidChangeOutputItemsEmitter = new core_1.Emitter();
        this.onDidChangeOutputItems = this.onDidChangeOutputItemsEmitter.event;
        this.onDidChangeContentEmitter = new core_1.Emitter();
        this.onDidChangeContent = this.onDidChangeContentEmitter.event;
        this.onDidChangeMetadataEmitter = new core_1.Emitter();
        this.onDidChangeMetadata = this.onDidChangeMetadataEmitter.event;
        this.onDidChangeInternalMetadataEmitter = new core_1.Emitter();
        this.onDidChangeInternalMetadata = this.onDidChangeInternalMetadataEmitter.event;
        this.onDidChangeLanguageEmitter = new core_1.Emitter();
        this.onDidChangeLanguage = this.onDidChangeLanguageEmitter.event;
        this.onDidRequestCellEditChangeEmitter = new core_1.Emitter();
        this.onDidRequestCellEditChange = this.onDidRequestCellEditChangeEmitter.event;
        this.toDispose = new core_1.DisposableCollection();
    }
    get outputs() {
        return this._outputs;
    }
    get metadata() {
        return this._metadata;
    }
    get internalMetadata() {
        return this._internalMetadata;
    }
    set internalMetadata(newInternalMetadata) {
        const lastRunSuccessChanged = this._internalMetadata.lastRunSuccess !== newInternalMetadata.lastRunSuccess;
        newInternalMetadata = {
            ...newInternalMetadata,
            ...{ runStartTimeAdjustment: computeRunStartTimeAdjustment(this._internalMetadata, newInternalMetadata) }
        };
        this._internalMetadata = newInternalMetadata;
        this.onDidChangeInternalMetadataEmitter.fire({ lastRunSuccessChanged });
    }
    get context() {
        return this.htmlContext;
    }
    get textBuffer() {
        return this.textModel ? this.textModel.getText() : this.source;
    }
    get source() {
        return this.props.source;
    }
    set source(source) {
        this.props.source = source;
    }
    get language() {
        return this.props.language;
    }
    set language(newLanguage) {
        if (this.language === newLanguage) {
            return;
        }
        this.props.language = newLanguage;
        if (this.textModel) {
            this.textModel.setLanguageId(newLanguage);
        }
        this.language = newLanguage;
        this.onDidChangeLanguageEmitter.fire(newLanguage);
        this.onDidChangeContentEmitter.fire('language');
    }
    get uri() {
        return this.props.uri;
    }
    get handle() {
        return this.props.handle;
    }
    get cellKind() {
        return this.props.cellKind;
    }
    init() {
        var _a, _b;
        this._outputs = this.props.outputs.map(op => new notebook_cell_output_model_1.NotebookCellOutputModel(op));
        this._metadata = (_a = this.props.metadata) !== null && _a !== void 0 ? _a : {};
        this._internalMetadata = (_b = this.props.internalMetadata) !== null && _b !== void 0 ? _b : {};
    }
    refChanged(node) {
        if (node) {
            this.htmlContext = node;
            this.notebookCellContextManager.updateCellContext(this, node);
        }
    }
    dispose() {
        this.onDidChangeOutputsEmitter.dispose();
        this.onDidChangeOutputItemsEmitter.dispose();
        this.onDidChangeContentEmitter.dispose();
        this.onDidChangeMetadataEmitter.dispose();
        this.onDidChangeInternalMetadataEmitter.dispose();
        this.onDidChangeLanguageEmitter.dispose();
        this.notebookCellContextManager.dispose();
        this.textModel.dispose();
        this.toDispose.dispose();
    }
    requestEdit() {
        this.onDidRequestCellEditChangeEmitter.fire(true);
    }
    requestStopEdit() {
        this.onDidRequestCellEditChangeEmitter.fire(false);
    }
    spliceNotebookCellOutputs(splice) {
        if (splice.deleteCount > 0 && splice.newOutputs.length > 0) {
            const commonLen = Math.min(splice.deleteCount, splice.newOutputs.length);
            // update
            for (let i = 0; i < commonLen; i++) {
                const currentOutput = this.outputs[splice.start + i];
                const newOutput = splice.newOutputs[i];
                this.replaceOutputItems(currentOutput.outputId, newOutput);
            }
            this.outputs.splice(splice.start + commonLen, splice.deleteCount - commonLen, ...splice.newOutputs.slice(commonLen).map(op => new notebook_cell_output_model_1.NotebookCellOutputModel(op)));
            this.onDidChangeOutputsEmitter.fire({ start: splice.start + commonLen, deleteCount: splice.deleteCount - commonLen, newOutputs: splice.newOutputs.slice(commonLen) });
        }
        else {
            this.outputs.splice(splice.start, splice.deleteCount, ...splice.newOutputs.map(op => new notebook_cell_output_model_1.NotebookCellOutputModel(op)));
            this.onDidChangeOutputsEmitter.fire(splice);
        }
    }
    replaceOutputItems(outputId, newOutputItem) {
        const output = this.outputs.find(out => out.outputId === outputId);
        if (!output) {
            return false;
        }
        output.replaceData(newOutputItem);
        this.onDidChangeOutputItemsEmitter.fire();
        return true;
    }
    getData() {
        return {
            cellKind: this.cellKind,
            language: this.language,
            outputs: this.outputs.map(output => output.getData()),
            source: this.textBuffer,
            collapseState: this.props.collapseState,
            internalMetadata: this.internalMetadata,
            metadata: this.metadata
        };
    }
    async resolveTextModel() {
        if (this.textModel) {
            return this.textModel;
        }
        const ref = await this.textModelService.createModelReference(this.uri);
        this.textModel = ref.object;
        return ref.object;
    }
};
__decorate([
    (0, inversify_1.inject)(NotebookCellContextManager),
    __metadata("design:type", Object)
], NotebookCellModel.prototype, "notebookCellContextManager", void 0);
__decorate([
    (0, inversify_1.inject)(NotebookCellModelProps),
    __metadata("design:type", Object)
], NotebookCellModel.prototype, "props", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_text_model_service_1.MonacoTextModelService),
    __metadata("design:type", monaco_text_model_service_1.MonacoTextModelService)
], NotebookCellModel.prototype, "textModelService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NotebookCellModel.prototype, "init", null);
NotebookCellModel = __decorate([
    (0, inversify_1.injectable)()
], NotebookCellModel);
exports.NotebookCellModel = NotebookCellModel;
function computeRunStartTimeAdjustment(oldMetadata, newMetadata) {
    if (oldMetadata.runStartTime !== newMetadata.runStartTime && typeof newMetadata.runStartTime === 'number') {
        const offset = Date.now() - newMetadata.runStartTime;
        return offset < 0 ? Math.abs(offset) : 0;
    }
    else {
        return newMetadata.runStartTimeAdjustment;
    }
}
//# sourceMappingURL=notebook-cell-model.js.map