"use strict";
// *****************************************************************************
// Copyright (C) 2018 Ericsson
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonacoStatusBarContribution = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const core_1 = require("@theia/core");
const browser_1 = require("@theia/core/lib/browser");
const browser_2 = require("@theia/editor/lib/browser");
const monaco_editor_1 = require("./monaco-editor");
let MonacoStatusBarContribution = class MonacoStatusBarContribution {
    constructor(editorManager, statusBar) {
        this.editorManager = editorManager;
        this.statusBar = statusBar;
        this.toDispose = new core_1.DisposableCollection();
    }
    onStart(app) {
        this.updateStatusBar();
        this.editorManager.onCurrentEditorChanged(() => this.updateStatusBar());
    }
    updateStatusBar() {
        const editor = this.editorManager.currentEditor;
        const editorModel = this.getModel(editor);
        if (editor && editorModel) {
            this.setConfigTabSizeWidget();
            this.setLineEndingWidget();
            this.toDispose.dispose();
            this.toDispose.push(editorModel.onDidChangeOptions(() => {
                this.setConfigTabSizeWidget();
                this.setLineEndingWidget();
            }));
            let previous = editorModel.getEOL();
            this.toDispose.push(editorModel.onDidChangeContent(e => {
                if (previous !== e.eol) {
                    previous = e.eol;
                    this.setLineEndingWidget();
                }
            }));
        }
        else {
            this.removeConfigTabSizeWidget();
            this.removeLineEndingWidget();
        }
    }
    setConfigTabSizeWidget() {
        const editor = this.editorManager.currentEditor;
        const editorModel = this.getModel(editor);
        if (editor && editorModel) {
            const modelOptions = editorModel.getOptions();
            const tabSize = modelOptions.tabSize;
            const spaceOrTabSizeMessage = modelOptions.insertSpaces
                ? core_1.nls.localizeByDefault('Spaces: {0}', tabSize)
                : core_1.nls.localizeByDefault('Tab Size: {0}', tabSize);
            this.statusBar.setElement('editor-status-tabbing-config', {
                text: spaceOrTabSizeMessage,
                alignment: browser_1.StatusBarAlignment.RIGHT,
                priority: 10,
                command: browser_2.EditorCommands.CONFIG_INDENTATION.id,
                tooltip: core_1.nls.localizeByDefault('Select Indentation')
            });
        }
    }
    removeConfigTabSizeWidget() {
        this.statusBar.removeElement('editor-status-tabbing-config');
    }
    setLineEndingWidget() {
        const editor = this.editorManager.currentEditor;
        const editorModel = this.getModel(editor);
        if (editor && editorModel) {
            const eol = editorModel.getEOL();
            const text = eol === '\n' ? 'LF' : 'CRLF';
            this.statusBar.setElement('editor-status-eol', {
                text: `${text}`,
                alignment: browser_1.StatusBarAlignment.RIGHT,
                priority: 11,
                command: browser_2.EditorCommands.CONFIG_EOL.id,
                tooltip: core_1.nls.localizeByDefault('Select End of Line Sequence')
            });
        }
    }
    removeLineEndingWidget() {
        this.statusBar.removeElement('editor-status-eol');
    }
    getModel(editor) {
        const monacoEditor = monaco_editor_1.MonacoEditor.get(editor);
        return monacoEditor && monacoEditor.getControl().getModel() || undefined;
    }
};
MonacoStatusBarContribution = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(browser_2.EditorManager)),
    __param(1, (0, inversify_1.inject)(browser_1.StatusBar)),
    __metadata("design:paramtypes", [browser_2.EditorManager, Object])
], MonacoStatusBarContribution);
exports.MonacoStatusBarContribution = MonacoStatusBarContribution;
//# sourceMappingURL=monaco-status-bar-contribution.js.map