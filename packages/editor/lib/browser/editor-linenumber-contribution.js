"use strict";
// *****************************************************************************
// Copyright (C) 2023 STMicroelectronics and others.
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
exports.EditorLineNumberContribution = exports.EDITOR_LINENUMBER_CONTEXT_MENU = void 0;
const editor_manager_1 = require("./editor-manager");
const editor_1 = require("./editor");
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/core/lib/browser");
const context_key_service_1 = require("@theia/core/lib/browser/context-key-service");
const core_1 = require("@theia/core");
exports.EDITOR_LINENUMBER_CONTEXT_MENU = ['editor_linenumber_context_menu'];
let EditorLineNumberContribution = class EditorLineNumberContribution {
    onStart() {
        this.editorManager.onCreated(editor => this.addLineNumberContextMenu(editor));
    }
    addLineNumberContextMenu(editorWidget) {
        const editor = editorWidget.editor;
        if (editor) {
            const disposables = new core_1.DisposableCollection();
            disposables.push(editor.onMouseDown(event => this.handleContextMenu(editor, event)));
            const dispose = () => disposables.dispose();
            editorWidget.disposed.connect(dispose);
            disposables.push(core_1.Disposable.create(() => editorWidget.disposed.disconnect(dispose)));
        }
    }
    handleContextMenu(editor, event) {
        if (event.target && (event.target.type === editor_1.MouseTargetType.GUTTER_LINE_NUMBERS || event.target.type === editor_1.MouseTargetType.GUTTER_GLYPH_MARGIN)) {
            if (event.event.button === 2) {
                editor.focus();
                const lineNumber = lineNumberFromPosition(event.target.position);
                const contextKeyService = this.contextKeyService.createOverlay([['editorLineNumber', lineNumber]]);
                const uri = editor.getResourceUri();
                const args = [{
                        lineNumber: lineNumber,
                        column: 1,
                        uri: uri['codeUri'],
                    }];
                setTimeout(() => {
                    this.contextMenuRenderer.render({
                        menuPath: exports.EDITOR_LINENUMBER_CONTEXT_MENU,
                        anchor: event.event,
                        args,
                        contextKeyService,
                        onHide: () => contextKeyService.dispose()
                    });
                });
            }
        }
    }
};
__decorate([
    (0, inversify_1.inject)(context_key_service_1.ContextKeyService),
    __metadata("design:type", Object)
], EditorLineNumberContribution.prototype, "contextKeyService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.ContextMenuRenderer),
    __metadata("design:type", browser_1.ContextMenuRenderer)
], EditorLineNumberContribution.prototype, "contextMenuRenderer", void 0);
__decorate([
    (0, inversify_1.inject)(editor_manager_1.EditorManager),
    __metadata("design:type", editor_manager_1.EditorManager)
], EditorLineNumberContribution.prototype, "editorManager", void 0);
EditorLineNumberContribution = __decorate([
    (0, inversify_1.injectable)()
], EditorLineNumberContribution);
exports.EditorLineNumberContribution = EditorLineNumberContribution;
function lineNumberFromPosition(position) {
    // position.line is 0-based line position, where the expected editor line number is 1-based.
    if (position) {
        return position.line + 1;
    }
    return undefined;
}
//# sourceMappingURL=editor-linenumber-contribution.js.map