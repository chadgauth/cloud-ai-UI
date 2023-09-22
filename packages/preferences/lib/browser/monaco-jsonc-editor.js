"use strict";
// *****************************************************************************
// Copyright (C) 2021 Ericsson and others.
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
exports.MonacoJSONCEditor = void 0;
const jsoncparser = require("jsonc-parser");
const monaco_workspace_1 = require("@theia/monaco/lib/browser/monaco-workspace");
const inversify_1 = require("@theia/core/shared/inversify");
const monaco = require("@theia/monaco-editor-core");
let MonacoJSONCEditor = class MonacoJSONCEditor {
    async setValue(model, path, value, shouldSave = true) {
        const edits = this.getEditOperations(model, path, value);
        if (edits.length > 0) {
            await this.workspace.applyBackgroundEdit(model, edits, shouldSave);
        }
    }
    getEditOperations(model, path, value) {
        const textModel = model.textEditorModel;
        const content = model.getText().trim();
        // Everything is already undefined - no need for changes.
        if (!content && value === undefined) {
            return [];
        }
        // Delete the entire document.
        if (!path.length && value === undefined) {
            return [{
                    range: textModel.getFullModelRange(),
                    text: null,
                    forceMoveMarkers: false
                }];
        }
        const { insertSpaces, tabSize, defaultEOL } = textModel.getOptions();
        const jsonCOptions = {
            formattingOptions: {
                insertSpaces,
                tabSize,
                eol: defaultEOL === monaco.editor.DefaultEndOfLine.LF ? '\n' : '\r\n'
            }
        };
        return jsoncparser.modify(content, path, value, jsonCOptions).map(edit => {
            const start = textModel.getPositionAt(edit.offset);
            const end = textModel.getPositionAt(edit.offset + edit.length);
            return {
                range: monaco.Range.fromPositions(start, end),
                text: edit.content || null,
                forceMoveMarkers: false
            };
        });
    }
};
__decorate([
    (0, inversify_1.inject)(monaco_workspace_1.MonacoWorkspace),
    __metadata("design:type", monaco_workspace_1.MonacoWorkspace)
], MonacoJSONCEditor.prototype, "workspace", void 0);
MonacoJSONCEditor = __decorate([
    (0, inversify_1.injectable)()
], MonacoJSONCEditor);
exports.MonacoJSONCEditor = MonacoJSONCEditor;
//# sourceMappingURL=monaco-jsonc-editor.js.map