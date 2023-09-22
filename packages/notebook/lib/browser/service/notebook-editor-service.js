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
exports.NotebookEditorWidgetService = void 0;
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const core_1 = require("@theia/core");
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/core/lib/browser");
const notebook_editor_widget_1 = require("../notebook-editor-widget");
let NotebookEditorWidgetService = class NotebookEditorWidgetService {
    constructor() {
        this.notebookEditors = new Map();
        this.onNotebookEditorAddEmitter = new core_1.Emitter();
        this.onNotebookEditorsRemoveEmitter = new core_1.Emitter();
        this.onDidAddNotebookEditor = this.onNotebookEditorAddEmitter.event;
        this.onDidRemoveNotebookEditor = this.onNotebookEditorsRemoveEmitter.event;
        this.onFocusedEditorChangedEmitter = new core_1.Emitter();
        this.onFocusedEditorChanged = this.onFocusedEditorChangedEmitter.event;
        this.toDispose = new core_1.DisposableCollection();
        this.currentFocusedEditor = undefined;
    }
    init() {
        this.toDispose.push(this.applicationShell.onDidChangeActiveWidget(event => {
            var _a;
            if (((_a = event.newValue) === null || _a === void 0 ? void 0 : _a.id.startsWith(notebook_editor_widget_1.NOTEBOOK_EDITOR_ID_PREFIX)) && event.newValue !== this.currentFocusedEditor) {
                this.currentFocusedEditor = event.newValue;
                this.onFocusedEditorChangedEmitter.fire(this.currentFocusedEditor);
            }
        }));
    }
    dispose() {
        this.onNotebookEditorAddEmitter.dispose();
        this.onNotebookEditorsRemoveEmitter.dispose();
        this.onFocusedEditorChangedEmitter.dispose();
        this.toDispose.dispose();
    }
    // --- editor management
    addNotebookEditor(editor) {
        this.notebookEditors.set(editor.id, editor);
        this.onNotebookEditorAddEmitter.fire(editor);
    }
    removeNotebookEditor(editor) {
        if (this.notebookEditors.has(editor.id)) {
            this.notebookEditors.delete(editor.id);
            this.onNotebookEditorsRemoveEmitter.fire(editor);
        }
    }
    getNotebookEditor(editorId) {
        return this.notebookEditors.get(editorId);
    }
    listNotebookEditors() {
        return [...this.notebookEditors].map(e => e[1]);
    }
};
__decorate([
    (0, inversify_1.inject)(browser_1.ApplicationShell),
    __metadata("design:type", browser_1.ApplicationShell)
], NotebookEditorWidgetService.prototype, "applicationShell", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NotebookEditorWidgetService.prototype, "init", null);
NotebookEditorWidgetService = __decorate([
    (0, inversify_1.injectable)()
], NotebookEditorWidgetService);
exports.NotebookEditorWidgetService = NotebookEditorWidgetService;
//# sourceMappingURL=notebook-editor-service.js.map