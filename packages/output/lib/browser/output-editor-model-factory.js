"use strict";
// *****************************************************************************
// Copyright (C) 2020 TypeFox and others.
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
exports.OutputEditorModel = exports.OutputEditorModelFactory = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const monaco_editor_model_1 = require("@theia/monaco/lib/browser/monaco-editor-model");
const output_uri_1 = require("../common/output-uri");
const monaco_to_protocol_converter_1 = require("@theia/monaco/lib/browser/monaco-to-protocol-converter");
const protocol_to_monaco_converter_1 = require("@theia/monaco/lib/browser/protocol-to-monaco-converter");
let OutputEditorModelFactory = class OutputEditorModelFactory {
    constructor() {
        this.scheme = output_uri_1.OutputUri.SCHEME;
    }
    createModel(resource) {
        return new OutputEditorModel(resource, this.m2p, this.p2m);
    }
};
__decorate([
    (0, inversify_1.inject)(monaco_to_protocol_converter_1.MonacoToProtocolConverter),
    __metadata("design:type", monaco_to_protocol_converter_1.MonacoToProtocolConverter)
], OutputEditorModelFactory.prototype, "m2p", void 0);
__decorate([
    (0, inversify_1.inject)(protocol_to_monaco_converter_1.ProtocolToMonacoConverter),
    __metadata("design:type", protocol_to_monaco_converter_1.ProtocolToMonacoConverter)
], OutputEditorModelFactory.prototype, "p2m", void 0);
OutputEditorModelFactory = __decorate([
    (0, inversify_1.injectable)()
], OutputEditorModelFactory);
exports.OutputEditorModelFactory = OutputEditorModelFactory;
class OutputEditorModel extends monaco_editor_model_1.MonacoEditorModel {
    get readOnly() {
        return true;
    }
    setDirty(dirty) {
        // NOOP
    }
}
exports.OutputEditorModel = OutputEditorModel;
//# sourceMappingURL=output-editor-model-factory.js.map