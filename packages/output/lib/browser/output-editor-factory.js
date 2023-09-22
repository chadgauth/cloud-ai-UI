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
exports.OutputEditorFactory = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const uri_1 = require("@theia/core/lib/common/uri");
const monaco_context_menu_1 = require("@theia/monaco/lib/browser/monaco-context-menu");
const monaco_editor_1 = require("@theia/monaco/lib/browser/monaco-editor");
const output_uri_1 = require("../common/output-uri");
const output_context_menu_1 = require("./output-context-menu");
const contextView_1 = require("@theia/monaco-editor-core/esm/vs/platform/contextview/browser/contextView");
let OutputEditorFactory = class OutputEditorFactory {
    constructor() {
        this.scheme = output_uri_1.OutputUri.SCHEME;
    }
    create(model, defaultsOptions, defaultOverrides) {
        const uri = new uri_1.default(model.uri);
        const options = this.createOptions(model, defaultsOptions);
        const overrides = this.createOverrides(model, defaultOverrides);
        return new monaco_editor_1.MonacoEditor(uri, model, document.createElement('div'), this.services, options, overrides);
    }
    createOptions(model, defaultOptions) {
        return {
            ...defaultOptions,
            overviewRulerLanes: 3,
            lineNumbersMinChars: 3,
            fixedOverflowWidgets: true,
            wordWrap: 'off',
            lineNumbers: 'off',
            glyphMargin: false,
            lineDecorationsWidth: 20,
            rulers: [],
            folding: false,
            scrollBeyondLastLine: false,
            readOnly: true,
            renderLineHighlight: 'none',
            minimap: { enabled: false },
            matchBrackets: 'never'
        };
    }
    *createOverrides(model, defaultOverrides) {
        yield [contextView_1.IContextMenuService, this.contextMenuService];
        for (const [identifier, provider] of defaultOverrides) {
            if (identifier !== contextView_1.IContextMenuService) {
                yield [identifier, provider];
            }
        }
    }
};
__decorate([
    (0, inversify_1.inject)(monaco_editor_1.MonacoEditorServices),
    __metadata("design:type", monaco_editor_1.MonacoEditorServices)
], OutputEditorFactory.prototype, "services", void 0);
__decorate([
    (0, inversify_1.inject)(output_context_menu_1.OutputContextMenuService),
    __metadata("design:type", monaco_context_menu_1.MonacoContextMenuService)
], OutputEditorFactory.prototype, "contextMenuService", void 0);
OutputEditorFactory = __decorate([
    (0, inversify_1.injectable)()
], OutputEditorFactory);
exports.OutputEditorFactory = OutputEditorFactory;
//# sourceMappingURL=output-editor-factory.js.map