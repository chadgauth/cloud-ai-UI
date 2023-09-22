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
exports.BlameContribution = exports.BlameCommands = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const common_1 = require("@theia/core/lib/common");
const blame_decorator_1 = require("./blame-decorator");
const browser_1 = require("@theia/editor/lib/browser");
const blame_manager_1 = require("./blame-manager");
const scm_extra_contribution_1 = require("@theia/scm-extra/lib/browser/scm-extra-contribution");
const context_key_service_1 = require("@theia/core/lib/browser/context-key-service");
const debounce = require("@theia/core/shared/lodash.debounce");
var BlameCommands;
(function (BlameCommands) {
    BlameCommands.TOGGLE_GIT_ANNOTATIONS = common_1.Command.toLocalizedCommand({
        id: 'git.editor.toggle.annotations',
        category: 'Git',
        label: 'Toggle Blame Annotations'
    }, 'theia/git/toggleBlameAnnotations', 'vscode.git/package/displayName');
    BlameCommands.CLEAR_GIT_ANNOTATIONS = {
        id: 'git.editor.clear.annotations'
    };
})(BlameCommands = exports.BlameCommands || (exports.BlameCommands = {}));
let BlameContribution = class BlameContribution {
    constructor() {
        this.appliedDecorations = new Map();
    }
    init() {
        this._visibleBlameAnnotations = this.contextKeyService.createKey('showsBlameAnnotations', this.visibleBlameAnnotations());
        this.editorManager.onActiveEditorChanged(() => this.updateContext());
    }
    updateContext() {
        this._visibleBlameAnnotations.set(this.visibleBlameAnnotations());
    }
    registerCommands(commands) {
        commands.registerCommand(BlameCommands.TOGGLE_GIT_ANNOTATIONS, {
            execute: () => {
                const editorWidget = this.currentFileEditorWidget;
                if (editorWidget) {
                    if (this.showsBlameAnnotations(editorWidget.editor.uri)) {
                        this.clearBlame(editorWidget.editor.uri);
                    }
                    else {
                        this.showBlame(editorWidget);
                    }
                }
            },
            isVisible: () => !!this.currentFileEditorWidget,
            isEnabled: () => {
                const editorWidget = this.currentFileEditorWidget;
                return !!editorWidget && this.isBlameable(editorWidget.editor.uri);
            }
        });
        commands.registerCommand(BlameCommands.CLEAR_GIT_ANNOTATIONS, {
            execute: () => {
                const editorWidget = this.currentFileEditorWidget;
                if (editorWidget) {
                    this.clearBlame(editorWidget.editor.uri);
                }
            },
            isVisible: () => !!this.currentFileEditorWidget,
            isEnabled: () => {
                const editorWidget = this.currentFileEditorWidget;
                const enabled = !!editorWidget && this.showsBlameAnnotations(editorWidget.editor.uri);
                return enabled;
            }
        });
    }
    showsBlameAnnotations(uri) {
        var _a;
        return ((_a = this.appliedDecorations.get(uri.toString())) === null || _a === void 0 ? void 0 : _a.disposed) === false;
    }
    get currentFileEditorWidget() {
        const editorWidget = this.editorManager.currentEditor;
        if (editorWidget) {
            if (editorWidget.editor.uri.scheme === 'file') {
                return editorWidget;
            }
        }
        return undefined;
    }
    isBlameable(uri) {
        return this.blameManager.isBlameable(uri.toString());
    }
    visibleBlameAnnotations() {
        const widget = this.editorManager.activeEditor;
        if (widget && widget.editor.isFocused() && this.showsBlameAnnotations(widget.editor.uri)) {
            return true;
        }
        return false;
    }
    async showBlame(editorWidget) {
        const uri = editorWidget.editor.uri.toString();
        if (this.appliedDecorations.get(uri)) {
            return;
        }
        const toDispose = new common_1.DisposableCollection();
        this.appliedDecorations.set(uri, toDispose);
        try {
            const editor = editorWidget.editor;
            const document = editor.document;
            const content = document.dirty ? document.getText() : undefined;
            const blame = await this.blameManager.getBlame(uri, content);
            if (blame) {
                toDispose.push(this.decorator.decorate(blame, editor, editor.cursor.line));
                toDispose.push(editor.onDocumentContentChanged(() => this.clearBlame(uri)));
                toDispose.push(editor.onCursorPositionChanged(debounce(_position => {
                    if (!toDispose.disposed) {
                        this.decorator.decorate(blame, editor, editor.cursor.line);
                    }
                }, 50)));
                editorWidget.disposed.connect(() => this.clearBlame(uri));
            }
        }
        finally {
            if (toDispose.disposed) {
                this.appliedDecorations.delete(uri);
            }
            ;
            this.updateContext();
        }
    }
    clearBlame(uri) {
        const decorations = this.appliedDecorations.get(uri.toString());
        if (decorations) {
            this.appliedDecorations.delete(uri.toString());
            decorations.dispose();
            this.updateContext();
        }
    }
    registerMenus(menus) {
        menus.registerMenuAction(scm_extra_contribution_1.EDITOR_CONTEXT_MENU_SCM, {
            commandId: BlameCommands.TOGGLE_GIT_ANNOTATIONS.id,
        });
    }
    registerKeybindings(keybindings) {
        keybindings.registerKeybinding({
            command: BlameCommands.TOGGLE_GIT_ANNOTATIONS.id,
            when: 'editorTextFocus',
            keybinding: 'alt+b'
        });
        keybindings.registerKeybinding({
            command: BlameCommands.CLEAR_GIT_ANNOTATIONS.id,
            when: 'showsBlameAnnotations',
            keybinding: 'esc'
        });
    }
};
__decorate([
    (0, inversify_1.inject)(browser_1.EditorManager),
    __metadata("design:type", browser_1.EditorManager)
], BlameContribution.prototype, "editorManager", void 0);
__decorate([
    (0, inversify_1.inject)(blame_decorator_1.BlameDecorator),
    __metadata("design:type", blame_decorator_1.BlameDecorator)
], BlameContribution.prototype, "decorator", void 0);
__decorate([
    (0, inversify_1.inject)(blame_manager_1.BlameManager),
    __metadata("design:type", blame_manager_1.BlameManager)
], BlameContribution.prototype, "blameManager", void 0);
__decorate([
    (0, inversify_1.inject)(context_key_service_1.ContextKeyService),
    __metadata("design:type", Object)
], BlameContribution.prototype, "contextKeyService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BlameContribution.prototype, "init", null);
BlameContribution = __decorate([
    (0, inversify_1.injectable)()
], BlameContribution);
exports.BlameContribution = BlameContribution;
//# sourceMappingURL=blame-contribution.js.map