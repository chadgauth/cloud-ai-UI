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
var EditorCommandContribution_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditorCommandContribution = exports.EditorCommands = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const common_1 = require("@theia/core/lib/common");
const uri_1 = require("@theia/core/lib/common/uri");
const browser_1 = require("@theia/core/lib/browser");
const editor_manager_1 = require("./editor-manager");
const editor_preferences_1 = require("./editor-preferences");
const core_1 = require("@theia/core");
const language_service_1 = require("@theia/core/lib/browser/language-service");
const supported_encodings_1 = require("@theia/core/lib/browser/supported-encodings");
const nls_1 = require("@theia/core/lib/common/nls");
var EditorCommands;
(function (EditorCommands) {
    const EDITOR_CATEGORY = 'Editor';
    const EDITOR_CATEGORY_KEY = nls_1.nls.getDefaultKey(EDITOR_CATEGORY);
    EditorCommands.GOTO_LINE_COLUMN = common_1.Command.toDefaultLocalizedCommand({
        id: 'editor.action.gotoLine',
        label: 'Go to Line/Column'
    });
    /**
     * Show editor references
     */
    EditorCommands.SHOW_REFERENCES = {
        id: 'textEditor.commands.showReferences'
    };
    /**
     * Change indentation configuration (i.e., indent using tabs / spaces, and how many spaces per tab)
     */
    EditorCommands.CONFIG_INDENTATION = {
        id: 'textEditor.commands.configIndentation'
    };
    EditorCommands.CONFIG_EOL = common_1.Command.toDefaultLocalizedCommand({
        id: 'textEditor.commands.configEol',
        category: EDITOR_CATEGORY,
        label: 'Change End of Line Sequence'
    });
    EditorCommands.INDENT_USING_SPACES = common_1.Command.toDefaultLocalizedCommand({
        id: 'textEditor.commands.indentUsingSpaces',
        category: EDITOR_CATEGORY,
        label: 'Indent Using Spaces'
    });
    EditorCommands.INDENT_USING_TABS = common_1.Command.toDefaultLocalizedCommand({
        id: 'textEditor.commands.indentUsingTabs',
        category: EDITOR_CATEGORY,
        label: 'Indent Using Tabs'
    });
    EditorCommands.CHANGE_LANGUAGE = common_1.Command.toDefaultLocalizedCommand({
        id: 'textEditor.change.language',
        category: EDITOR_CATEGORY,
        label: 'Change Language Mode'
    });
    EditorCommands.CHANGE_ENCODING = common_1.Command.toDefaultLocalizedCommand({
        id: 'textEditor.change.encoding',
        category: EDITOR_CATEGORY,
        label: 'Change File Encoding'
    });
    EditorCommands.REVERT_EDITOR = common_1.Command.toDefaultLocalizedCommand({
        id: 'workbench.action.files.revert',
        category: browser_1.CommonCommands.FILE_CATEGORY,
        label: 'Revert File',
    });
    EditorCommands.REVERT_AND_CLOSE = common_1.Command.toDefaultLocalizedCommand({
        id: 'workbench.action.revertAndCloseActiveEditor',
        category: browser_1.CommonCommands.VIEW_CATEGORY,
        label: 'Revert and Close Editor'
    });
    /**
     * Command for going back to the last editor navigation location.
     */
    EditorCommands.GO_BACK = common_1.Command.toDefaultLocalizedCommand({
        id: 'textEditor.commands.go.back',
        category: EDITOR_CATEGORY,
        label: 'Go Back'
    });
    /**
     * Command for going to the forthcoming editor navigation location.
     */
    EditorCommands.GO_FORWARD = common_1.Command.toDefaultLocalizedCommand({
        id: 'textEditor.commands.go.forward',
        category: EDITOR_CATEGORY,
        label: 'Go Forward'
    });
    /**
     * Command that reveals the last text edit location, if any.
     */
    EditorCommands.GO_LAST_EDIT = common_1.Command.toDefaultLocalizedCommand({
        id: 'textEditor.commands.go.lastEdit',
        category: EDITOR_CATEGORY,
        label: 'Go to Last Edit Location'
    });
    /**
     * Command that clears the editor navigation history.
     */
    EditorCommands.CLEAR_EDITOR_HISTORY = common_1.Command.toDefaultLocalizedCommand({
        id: 'textEditor.commands.clear.history',
        category: EDITOR_CATEGORY,
        label: 'Clear Editor History'
    });
    /**
     * Command that displays all editors that are currently opened.
     */
    EditorCommands.SHOW_ALL_OPENED_EDITORS = common_1.Command.toLocalizedCommand({
        id: 'workbench.action.showAllEditors',
        category: browser_1.CommonCommands.VIEW_CATEGORY,
        label: 'Show All Opened Editors'
    }, 'theia/editor/showAllEditors', EDITOR_CATEGORY_KEY);
    /**
     * Command that toggles the minimap.
     */
    EditorCommands.TOGGLE_MINIMAP = common_1.Command.toDefaultLocalizedCommand({
        id: 'editor.action.toggleMinimap',
        category: browser_1.CommonCommands.VIEW_CATEGORY,
        label: 'Toggle Minimap'
    });
    /**
     * Command that toggles the rendering of whitespace characters in the editor.
     */
    EditorCommands.TOGGLE_RENDER_WHITESPACE = common_1.Command.toDefaultLocalizedCommand({
        id: 'editor.action.toggleRenderWhitespace',
        category: browser_1.CommonCommands.VIEW_CATEGORY,
        label: 'Toggle Render Whitespace'
    });
    /**
     * Command that toggles the word wrap.
     */
    EditorCommands.TOGGLE_WORD_WRAP = common_1.Command.toDefaultLocalizedCommand({
        id: 'editor.action.toggleWordWrap',
        label: 'View: Toggle Word Wrap'
    });
    /**
     * Command that toggles sticky scroll.
     */
    EditorCommands.TOGGLE_STICKY_SCROLL = common_1.Command.toLocalizedCommand({
        id: 'editor.action.toggleStickyScroll',
        category: browser_1.CommonCommands.VIEW_CATEGORY,
        label: 'Toggle Sticky Scroll',
    }, 'theia/editor/toggleStickyScroll', EDITOR_CATEGORY_KEY);
    /**
     * Command that re-opens the last closed editor.
     */
    EditorCommands.REOPEN_CLOSED_EDITOR = common_1.Command.toDefaultLocalizedCommand({
        id: 'workbench.action.reopenClosedEditor',
        category: browser_1.CommonCommands.VIEW_CATEGORY,
        label: 'Reopen Closed Editor'
    });
    /**
     * Opens a second instance of the current editor, splitting the view in the direction specified.
     */
    EditorCommands.SPLIT_EDITOR_RIGHT = common_1.Command.toDefaultLocalizedCommand({
        id: 'workbench.action.splitEditorRight',
        category: browser_1.CommonCommands.VIEW_CATEGORY,
        label: 'Split Editor Right'
    });
    EditorCommands.SPLIT_EDITOR_DOWN = common_1.Command.toDefaultLocalizedCommand({
        id: 'workbench.action.splitEditorDown',
        category: browser_1.CommonCommands.VIEW_CATEGORY,
        label: 'Split Editor Down'
    });
    EditorCommands.SPLIT_EDITOR_UP = common_1.Command.toDefaultLocalizedCommand({
        id: 'workbench.action.splitEditorUp',
        category: browser_1.CommonCommands.VIEW_CATEGORY,
        label: 'Split Editor Up'
    });
    EditorCommands.SPLIT_EDITOR_LEFT = common_1.Command.toDefaultLocalizedCommand({
        id: 'workbench.action.splitEditorLeft',
        category: browser_1.CommonCommands.VIEW_CATEGORY,
        label: 'Split Editor Left'
    });
    /**
     * Default horizontal split: right.
     */
    EditorCommands.SPLIT_EDITOR_HORIZONTAL = common_1.Command.toDefaultLocalizedCommand({
        id: 'workbench.action.splitEditor',
        category: browser_1.CommonCommands.VIEW_CATEGORY,
        label: 'Split Editor'
    });
    /**
     * Default vertical split: down.
     */
    EditorCommands.SPLIT_EDITOR_VERTICAL = common_1.Command.toDefaultLocalizedCommand({
        id: 'workbench.action.splitEditorOrthogonal',
        category: browser_1.CommonCommands.VIEW_CATEGORY,
        label: 'Split Editor Orthogonal'
    });
})(EditorCommands = exports.EditorCommands || (exports.EditorCommands = {}));
let EditorCommandContribution = EditorCommandContribution_1 = class EditorCommandContribution {
    init() {
        this.editorPreferences.onPreferenceChanged(e => {
            if (e.preferenceName === 'files.autoSave' && e.newValue !== 'off') {
                this.shell.saveAll();
            }
        });
    }
    registerCommands(registry) {
        registry.registerCommand(EditorCommands.SHOW_REFERENCES);
        registry.registerCommand(EditorCommands.CONFIG_INDENTATION);
        registry.registerCommand(EditorCommands.CONFIG_EOL);
        registry.registerCommand(EditorCommands.INDENT_USING_SPACES);
        registry.registerCommand(EditorCommands.INDENT_USING_TABS);
        registry.registerCommand(EditorCommands.REVERT_EDITOR);
        registry.registerCommand(EditorCommands.REVERT_AND_CLOSE);
        registry.registerCommand(EditorCommands.CHANGE_LANGUAGE, {
            isEnabled: () => this.canConfigureLanguage(),
            isVisible: () => this.canConfigureLanguage(),
            execute: () => this.configureLanguage()
        });
        registry.registerCommand(EditorCommands.CHANGE_ENCODING, {
            isEnabled: () => this.canConfigureEncoding(),
            isVisible: () => this.canConfigureEncoding(),
            execute: () => this.configureEncoding()
        });
        registry.registerCommand(EditorCommands.GO_BACK);
        registry.registerCommand(EditorCommands.GO_FORWARD);
        registry.registerCommand(EditorCommands.GO_LAST_EDIT);
        registry.registerCommand(EditorCommands.CLEAR_EDITOR_HISTORY);
        registry.registerCommand(EditorCommands.TOGGLE_MINIMAP);
        registry.registerCommand(EditorCommands.TOGGLE_RENDER_WHITESPACE);
        registry.registerCommand(EditorCommands.TOGGLE_WORD_WRAP);
        registry.registerCommand(EditorCommands.TOGGLE_STICKY_SCROLL);
        registry.registerCommand(EditorCommands.REOPEN_CLOSED_EDITOR);
        registry.registerCommand(browser_1.CommonCommands.AUTO_SAVE, {
            isToggled: () => this.isAutoSaveOn(),
            execute: () => this.toggleAutoSave()
        });
    }
    canConfigureLanguage() {
        const widget = this.editorManager.currentEditor;
        const editor = widget && widget.editor;
        return !!editor && !!this.languages.languages;
    }
    async configureLanguage() {
        var _a;
        const widget = this.editorManager.currentEditor;
        const editor = widget && widget.editor;
        if (!editor || !this.languages.languages) {
            return;
        }
        const current = editor.document.languageId;
        const items = [
            { label: nls_1.nls.localizeByDefault('Auto Detect'), value: 'autoDetect' },
            { type: 'separator', label: nls_1.nls.localizeByDefault('languages (identifier)') },
            ...(this.languages.languages.map(language => this.toQuickPickLanguage(language, current))).sort((e, e2) => e.label.localeCompare(e2.label))
        ];
        const selectedMode = await ((_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.showQuickPick(items, { placeholder: nls_1.nls.localizeByDefault('Select Language Mode') }));
        if (selectedMode && ('value' in selectedMode)) {
            if (selectedMode.value === 'autoDetect') {
                editor.detectLanguage();
            }
            else if (selectedMode.value) {
                editor.setLanguage(selectedMode.value.id);
            }
        }
    }
    canConfigureEncoding() {
        const widget = this.editorManager.currentEditor;
        const editor = widget && widget.editor;
        return !!editor;
    }
    async configureEncoding() {
        var _a, _b;
        const widget = this.editorManager.currentEditor;
        const editor = widget && widget.editor;
        if (!editor) {
            return;
        }
        const reopenWithEncodingPick = { label: nls_1.nls.localizeByDefault('Reopen with Encoding'), value: 'reopen' };
        const saveWithEncodingPick = { label: nls_1.nls.localizeByDefault('Save with Encoding'), value: 'save' };
        const actionItems = [
            reopenWithEncodingPick,
            saveWithEncodingPick
        ];
        const selectedEncoding = await ((_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.showQuickPick(actionItems, { placeholder: nls_1.nls.localizeByDefault('Select Action') }));
        if (!selectedEncoding) {
            return;
        }
        const isReopenWithEncoding = (selectedEncoding.value === reopenWithEncodingPick.value);
        const configuredEncoding = this.preferencesService.get('files.encoding', 'utf8', editor.uri.toString());
        const resource = await this.resourceProvider(editor.uri);
        const guessedEncoding = resource.guessEncoding ? await resource.guessEncoding() : undefined;
        resource.dispose();
        const encodingItems = Object.keys(supported_encodings_1.SUPPORTED_ENCODINGS)
            .sort((k1, k2) => {
            if (k1 === configuredEncoding) {
                return -1;
            }
            else if (k2 === configuredEncoding) {
                return 1;
            }
            return supported_encodings_1.SUPPORTED_ENCODINGS[k1].order - supported_encodings_1.SUPPORTED_ENCODINGS[k2].order;
        })
            .filter(k => {
            if (k === guessedEncoding && guessedEncoding !== configuredEncoding) {
                return false; // do not show encoding if it is the guessed encoding that does not match the configured
            }
            return !isReopenWithEncoding || !supported_encodings_1.SUPPORTED_ENCODINGS[k].encodeOnly; // hide those that can only be used for encoding if we are about to decode
        })
            .map(key => ({ label: supported_encodings_1.SUPPORTED_ENCODINGS[key].labelLong, value: { id: key, description: key } }));
        // Insert guessed encoding
        if (guessedEncoding && configuredEncoding !== guessedEncoding && supported_encodings_1.SUPPORTED_ENCODINGS[guessedEncoding]) {
            encodingItems.unshift({
                label: `${nls_1.nls.localizeByDefault('Guessed from content')}: ${supported_encodings_1.SUPPORTED_ENCODINGS[guessedEncoding].labelLong}`,
                value: { id: guessedEncoding, description: guessedEncoding }
            });
        }
        const selectedFileEncoding = await ((_b = this.quickInputService) === null || _b === void 0 ? void 0 : _b.showQuickPick(encodingItems, {
            placeholder: isReopenWithEncoding ?
                nls_1.nls.localizeByDefault('Select File Encoding to Reopen File') :
                nls_1.nls.localizeByDefault('Select File Encoding to Save with')
        }));
        if (!selectedFileEncoding) {
            return;
        }
        if (editor.document.dirty && isReopenWithEncoding) {
            this.messageService.info(nls_1.nls.localize('theia/editor/dirtyEncoding', 'The file is dirty. Please save it first before reopening it with another encoding.'));
            return;
        }
        else if (selectedFileEncoding.value) {
            editor.setEncoding(selectedFileEncoding.value.id, isReopenWithEncoding ? 1 /* Decode */ : 0 /* Encode */);
        }
    }
    toQuickPickLanguage(value, current) {
        const languageUri = this.toLanguageUri(value);
        const icon = this.labelProvider.getIcon(languageUri);
        const iconClasses = icon !== '' ? [icon + ' file-icon'] : undefined;
        const configured = current === value.id;
        return {
            value,
            label: value.name,
            description: nls_1.nls.localizeByDefault(`({0})${configured ? ' - Configured Language' : ''}`, value.id),
            iconClasses
        };
    }
    toLanguageUri(language) {
        const extension = language.extensions.values().next();
        if (extension.value) {
            return new uri_1.default('file:///' + extension.value);
        }
        const filename = language.filenames.values().next();
        if (filename.value) {
            return new uri_1.default('file:///' + filename.value);
        }
        return new uri_1.default('file:///.txt');
    }
    isAutoSaveOn() {
        const autoSave = this.preferencesService.get(EditorCommandContribution_1.AUTOSAVE_PREFERENCE);
        return autoSave !== 'off';
    }
    async toggleAutoSave() {
        this.preferencesService.updateValue(EditorCommandContribution_1.AUTOSAVE_PREFERENCE, this.isAutoSaveOn() ? 'off' : 'afterDelay');
    }
};
EditorCommandContribution.AUTOSAVE_PREFERENCE = 'files.autoSave';
__decorate([
    (0, inversify_1.inject)(browser_1.ApplicationShell),
    __metadata("design:type", browser_1.ApplicationShell)
], EditorCommandContribution.prototype, "shell", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.PreferenceService),
    __metadata("design:type", Object)
], EditorCommandContribution.prototype, "preferencesService", void 0);
__decorate([
    (0, inversify_1.inject)(editor_preferences_1.EditorPreferences),
    __metadata("design:type", Object)
], EditorCommandContribution.prototype, "editorPreferences", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.QuickInputService),
    (0, inversify_1.optional)(),
    __metadata("design:type", Object)
], EditorCommandContribution.prototype, "quickInputService", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.MessageService),
    __metadata("design:type", core_1.MessageService)
], EditorCommandContribution.prototype, "messageService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.LabelProvider),
    __metadata("design:type", browser_1.LabelProvider)
], EditorCommandContribution.prototype, "labelProvider", void 0);
__decorate([
    (0, inversify_1.inject)(language_service_1.LanguageService),
    __metadata("design:type", language_service_1.LanguageService)
], EditorCommandContribution.prototype, "languages", void 0);
__decorate([
    (0, inversify_1.inject)(editor_manager_1.EditorManager),
    __metadata("design:type", editor_manager_1.EditorManager)
], EditorCommandContribution.prototype, "editorManager", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.ResourceProvider),
    __metadata("design:type", Function)
], EditorCommandContribution.prototype, "resourceProvider", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EditorCommandContribution.prototype, "init", null);
EditorCommandContribution = EditorCommandContribution_1 = __decorate([
    (0, inversify_1.injectable)()
], EditorCommandContribution);
exports.EditorCommandContribution = EditorCommandContribution;
//# sourceMappingURL=editor-command.js.map