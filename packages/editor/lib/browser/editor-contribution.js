"use strict";
// *****************************************************************************
// Copyright (C) 2017 TypeFox and others.
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
exports.EditorContribution = void 0;
const editor_manager_1 = require("./editor-manager");
const inversify_1 = require("@theia/core/shared/inversify");
const status_bar_1 = require("@theia/core/lib/browser/status-bar/status-bar");
const browser_1 = require("@theia/core/lib/browser");
const context_key_service_1 = require("@theia/core/lib/browser/context-key-service");
const core_1 = require("@theia/core");
const editor_command_1 = require("./editor-command");
const supported_encodings_1 = require("@theia/core/lib/browser/supported-encodings");
const nls_1 = require("@theia/core/lib/common/nls");
const current_widget_command_adapter_1 = require("@theia/core/lib/browser/shell/current-widget-command-adapter");
const editor_widget_1 = require("./editor-widget");
const editor_language_status_service_1 = require("./language-status/editor-language-status-service");
let EditorContribution = class EditorContribution {
    constructor() {
        this.toDisposeOnCurrentEditorChanged = new core_1.DisposableCollection();
    }
    onStart() {
        this.initEditorContextKeys();
        this.updateStatusBar();
        this.editorManager.onCurrentEditorChanged(() => this.updateStatusBar());
    }
    initEditorContextKeys() {
        const editorIsOpen = this.contextKeyService.createKey('editorIsOpen', false);
        const textCompareEditorVisible = this.contextKeyService.createKey('textCompareEditorVisible', false);
        const updateContextKeys = () => {
            const widgets = this.editorManager.all;
            editorIsOpen.set(!!widgets.length);
            textCompareEditorVisible.set(widgets.some(widget => browser_1.DiffUris.isDiffUri(widget.editor.uri)));
        };
        updateContextKeys();
        for (const widget of this.editorManager.all) {
            widget.disposed.connect(updateContextKeys);
        }
        this.editorManager.onCreated(widget => {
            updateContextKeys();
            widget.disposed.connect(updateContextKeys);
        });
    }
    updateStatusBar() {
        this.toDisposeOnCurrentEditorChanged.dispose();
        const widget = this.editorManager.currentEditor;
        const editor = widget && widget.editor;
        this.updateLanguageStatus(editor);
        this.updateEncodingStatus(editor);
        this.setCursorPositionStatus(editor);
        if (editor) {
            this.toDisposeOnCurrentEditorChanged.pushAll([
                editor.onLanguageChanged(() => this.updateLanguageStatus(editor)),
                editor.onEncodingChanged(() => this.updateEncodingStatus(editor)),
                editor.onCursorPositionChanged(() => this.setCursorPositionStatus(editor))
            ]);
        }
    }
    updateLanguageStatus(editor) {
        this.languageStatusService.updateLanguageStatus(editor);
    }
    updateEncodingStatus(editor) {
        if (!editor) {
            this.statusBar.removeElement('editor-status-encoding');
            return;
        }
        this.statusBar.setElement('editor-status-encoding', {
            text: supported_encodings_1.SUPPORTED_ENCODINGS[editor.getEncoding()].labelShort,
            alignment: status_bar_1.StatusBarAlignment.RIGHT,
            priority: 10,
            command: editor_command_1.EditorCommands.CHANGE_ENCODING.id,
            tooltip: nls_1.nls.localizeByDefault('Select Encoding')
        });
    }
    setCursorPositionStatus(editor) {
        if (!editor) {
            this.statusBar.removeElement('editor-status-cursor-position');
            return;
        }
        const { cursor } = editor;
        this.statusBar.setElement('editor-status-cursor-position', {
            text: nls_1.nls.localizeByDefault('Ln {0}, Col {1}', cursor.line + 1, editor.getVisibleColumn(cursor)),
            alignment: status_bar_1.StatusBarAlignment.RIGHT,
            priority: 100,
            tooltip: editor_command_1.EditorCommands.GOTO_LINE_COLUMN.label,
            command: editor_command_1.EditorCommands.GOTO_LINE_COLUMN.id
        });
    }
    registerCommands(commands) {
        commands.registerCommand(editor_command_1.EditorCommands.SHOW_ALL_OPENED_EDITORS, {
            execute: () => { var _a; return (_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.open('edt '); }
        });
        const splitHandlerFactory = (splitMode) => new current_widget_command_adapter_1.CurrentWidgetCommandAdapter(this.shell, {
            isEnabled: title => (title === null || title === void 0 ? void 0 : title.owner) instanceof editor_widget_1.EditorWidget,
            execute: async (title) => {
                if ((title === null || title === void 0 ? void 0 : title.owner) instanceof editor_widget_1.EditorWidget) {
                    const selection = title.owner.editor.selection;
                    const newEditor = await this.editorManager.openToSide(title.owner.editor.uri, { selection, widgetOptions: { mode: splitMode, ref: title.owner } });
                    const oldEditorState = title.owner.editor.storeViewState();
                    newEditor.editor.restoreViewState(oldEditorState);
                }
            }
        });
        commands.registerCommand(editor_command_1.EditorCommands.SPLIT_EDITOR_HORIZONTAL, splitHandlerFactory('split-right'));
        commands.registerCommand(editor_command_1.EditorCommands.SPLIT_EDITOR_VERTICAL, splitHandlerFactory('split-bottom'));
        commands.registerCommand(editor_command_1.EditorCommands.SPLIT_EDITOR_RIGHT, splitHandlerFactory('split-right'));
        commands.registerCommand(editor_command_1.EditorCommands.SPLIT_EDITOR_DOWN, splitHandlerFactory('split-bottom'));
        commands.registerCommand(editor_command_1.EditorCommands.SPLIT_EDITOR_UP, splitHandlerFactory('split-top'));
        commands.registerCommand(editor_command_1.EditorCommands.SPLIT_EDITOR_LEFT, splitHandlerFactory('split-left'));
    }
    registerKeybindings(keybindings) {
        keybindings.registerKeybinding({
            command: editor_command_1.EditorCommands.SHOW_ALL_OPENED_EDITORS.id,
            keybinding: 'ctrlcmd+k ctrlcmd+p'
        });
        keybindings.registerKeybinding({
            command: editor_command_1.EditorCommands.SPLIT_EDITOR_HORIZONTAL.id,
            keybinding: 'ctrlcmd+\\',
        });
        keybindings.registerKeybinding({
            command: editor_command_1.EditorCommands.SPLIT_EDITOR_VERTICAL.id,
            keybinding: 'ctrlcmd+k ctrlcmd+\\',
        });
    }
    registerMenus(registry) {
        registry.registerMenuAction(browser_1.SHELL_TABBAR_CONTEXT_SPLIT, {
            commandId: editor_command_1.EditorCommands.SPLIT_EDITOR_UP.id,
            label: nls_1.nls.localizeByDefault('Split Up'),
            order: '1',
        });
        registry.registerMenuAction(browser_1.SHELL_TABBAR_CONTEXT_SPLIT, {
            commandId: editor_command_1.EditorCommands.SPLIT_EDITOR_DOWN.id,
            label: nls_1.nls.localizeByDefault('Split Down'),
            order: '2',
        });
        registry.registerMenuAction(browser_1.SHELL_TABBAR_CONTEXT_SPLIT, {
            commandId: editor_command_1.EditorCommands.SPLIT_EDITOR_LEFT.id,
            label: nls_1.nls.localizeByDefault('Split Left'),
            order: '3',
        });
        registry.registerMenuAction(browser_1.SHELL_TABBAR_CONTEXT_SPLIT, {
            commandId: editor_command_1.EditorCommands.SPLIT_EDITOR_RIGHT.id,
            label: nls_1.nls.localizeByDefault('Split Right'),
            order: '4',
        });
    }
};
__decorate([
    (0, inversify_1.inject)(status_bar_1.StatusBar),
    __metadata("design:type", Object)
], EditorContribution.prototype, "statusBar", void 0);
__decorate([
    (0, inversify_1.inject)(editor_manager_1.EditorManager),
    __metadata("design:type", editor_manager_1.EditorManager)
], EditorContribution.prototype, "editorManager", void 0);
__decorate([
    (0, inversify_1.inject)(editor_language_status_service_1.EditorLanguageStatusService),
    __metadata("design:type", editor_language_status_service_1.EditorLanguageStatusService)
], EditorContribution.prototype, "languageStatusService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.ApplicationShell),
    __metadata("design:type", browser_1.ApplicationShell)
], EditorContribution.prototype, "shell", void 0);
__decorate([
    (0, inversify_1.inject)(context_key_service_1.ContextKeyService),
    __metadata("design:type", Object)
], EditorContribution.prototype, "contextKeyService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.QuickInputService),
    (0, inversify_1.optional)(),
    __metadata("design:type", Object)
], EditorContribution.prototype, "quickInputService", void 0);
EditorContribution = __decorate([
    (0, inversify_1.injectable)()
], EditorContribution);
exports.EditorContribution = EditorContribution;
//# sourceMappingURL=editor-contribution.js.map