"use strict";
// *****************************************************************************
// Copyright (C) 2018-2021 Google and others.
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
var EditorPreviewWidgetFactory_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditorPreviewWidgetFactory = void 0;
const uri_1 = require("@theia/core/lib/common/uri");
const editor_widget_factory_1 = require("@theia/editor/lib/browser/editor-widget-factory");
const inversify_1 = require("@theia/core/shared/inversify");
const editor_preview_widget_1 = require("./editor-preview-widget");
let EditorPreviewWidgetFactory = EditorPreviewWidgetFactory_1 = class EditorPreviewWidgetFactory extends editor_widget_factory_1.EditorWidgetFactory {
    constructor() {
        super(...arguments);
        this.id = EditorPreviewWidgetFactory_1.ID;
    }
    async createWidget(options) {
        const uri = new uri_1.default(options.uri);
        const editor = await this.createEditor(uri, options);
        if (options.preview) {
            editor.initializePreview();
        }
        return editor;
    }
    async constructEditor(uri) {
        const textEditor = await this.editorProvider(uri);
        return new editor_preview_widget_1.EditorPreviewWidget(textEditor, this.selectionService);
    }
};
EditorPreviewWidgetFactory.ID = 'editor-preview-widget';
EditorPreviewWidgetFactory = EditorPreviewWidgetFactory_1 = __decorate([
    (0, inversify_1.injectable)()
], EditorPreviewWidgetFactory);
exports.EditorPreviewWidgetFactory = EditorPreviewWidgetFactory;
//# sourceMappingURL=editor-preview-widget-factory.js.map