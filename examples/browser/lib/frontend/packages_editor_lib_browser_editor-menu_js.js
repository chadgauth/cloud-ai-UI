(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_editor_lib_browser_editor-menu_js"],{

/***/ "../../packages/core/shared/@phosphor/algorithm/index.js":
/*!***************************************************************!*\
  !*** ../../packages/core/shared/@phosphor/algorithm/index.js ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! @phosphor/algorithm */ "../../node_modules/@phosphor/algorithm/lib/index.js");

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/shared/@phosphor/algorithm'] = this;


/***/ }),

/***/ "../../packages/editor/lib/browser/editor-command.js":
/*!***********************************************************!*\
  !*** ../../packages/editor/lib/browser/editor-command.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EditorCommandContribution = exports.EditorCommands = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const editor_manager_1 = __webpack_require__(/*! ./editor-manager */ "../../packages/editor/lib/browser/editor-manager.js");
const editor_preferences_1 = __webpack_require__(/*! ./editor-preferences */ "../../packages/editor/lib/browser/editor-preferences.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const language_service_1 = __webpack_require__(/*! @theia/core/lib/browser/language-service */ "../../packages/core/lib/browser/language-service.js");
const supported_encodings_1 = __webpack_require__(/*! @theia/core/lib/browser/supported-encodings */ "../../packages/core/lib/browser/supported-encodings.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
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

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/editor/lib/browser/editor-command'] = this;


/***/ }),

/***/ "../../packages/editor/lib/browser/editor-manager.js":
/*!***********************************************************!*\
  !*** ../../packages/editor/lib/browser/editor-manager.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ActiveEditorAccess = exports.CurrentEditorAccess = exports.EditorAccess = exports.EditorManager = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const editor_widget_1 = __webpack_require__(/*! ./editor-widget */ "../../packages/editor/lib/browser/editor-widget.js");
const editor_1 = __webpack_require__(/*! ./editor */ "../../packages/editor/lib/browser/editor.js");
const editor_widget_factory_1 = __webpack_require__(/*! ./editor-widget-factory */ "../../packages/editor/lib/browser/editor-widget-factory.js");
let EditorManager = class EditorManager extends browser_1.NavigatableWidgetOpenHandler {
    constructor() {
        super(...arguments);
        this.id = editor_widget_factory_1.EditorWidgetFactory.ID;
        this.label = 'Code Editor';
        this.editorCounters = new Map();
        this.onActiveEditorChangedEmitter = new common_1.Emitter();
        /**
         * Emit when the active editor is changed.
         */
        this.onActiveEditorChanged = this.onActiveEditorChangedEmitter.event;
        this.onCurrentEditorChangedEmitter = new common_1.Emitter();
        /**
         * Emit when the current editor is changed.
         */
        this.onCurrentEditorChanged = this.onCurrentEditorChangedEmitter.event;
        this.recentlyVisibleIds = [];
    }
    init() {
        super.init();
        this.shell.onDidChangeActiveWidget(() => this.updateActiveEditor());
        this.shell.onDidChangeCurrentWidget(() => this.updateCurrentEditor());
        this.shell.onDidDoubleClickMainArea(() => this.commands.executeCommand(browser_1.CommonCommands.NEW_UNTITLED_TEXT_FILE.id));
        this.onCreated(widget => {
            widget.onDidChangeVisibility(() => {
                if (widget.isVisible) {
                    this.addRecentlyVisible(widget);
                }
                this.updateCurrentEditor();
            });
            this.checkCounterForWidget(widget);
            widget.disposed.connect(() => {
                this.removeFromCounter(widget);
                this.removeRecentlyVisible(widget);
                this.updateCurrentEditor();
            });
        });
        for (const widget of this.all) {
            if (widget.isVisible) {
                this.addRecentlyVisible(widget);
            }
        }
        this.updateCurrentEditor();
    }
    getByUri(uri, options) {
        return this.getWidget(uri, options);
    }
    getOrCreateByUri(uri, options) {
        return this.getOrCreateWidget(uri, options);
    }
    tryGetPendingWidget(uri, options) {
        const editorPromise = super.tryGetPendingWidget(uri, options);
        if (editorPromise) {
            // Reveal selection before attachment to manage nav stack. (https://github.com/eclipse-theia/theia/issues/8955)
            if (!(editorPromise instanceof browser_1.Widget)) {
                editorPromise.then(editor => this.revealSelection(editor, options, uri));
            }
            else {
                this.revealSelection(editorPromise, options);
            }
        }
        return editorPromise;
    }
    async getWidget(uri, options) {
        const editor = await super.getWidget(uri, options);
        if (editor) {
            // Reveal selection before attachment to manage nav stack. (https://github.com/eclipse-theia/theia/issues/8955)
            this.revealSelection(editor, options, uri);
        }
        return editor;
    }
    async getOrCreateWidget(uri, options) {
        const editor = await super.getOrCreateWidget(uri, options);
        // Reveal selection before attachment to manage nav stack. (https://github.com/eclipse-theia/theia/issues/8955)
        this.revealSelection(editor, options, uri);
        return editor;
    }
    get recentlyVisible() {
        const id = this.recentlyVisibleIds[0];
        return id && this.all.find(w => w.id === id) || undefined;
    }
    addRecentlyVisible(widget) {
        this.removeRecentlyVisible(widget);
        this.recentlyVisibleIds.unshift(widget.id);
    }
    removeRecentlyVisible(widget) {
        const index = this.recentlyVisibleIds.indexOf(widget.id);
        if (index !== -1) {
            this.recentlyVisibleIds.splice(index, 1);
        }
    }
    /**
     * The active editor.
     * If there is an active editor (one that has focus), active and current are the same.
     */
    get activeEditor() {
        return this._activeEditor;
    }
    setActiveEditor(active) {
        if (this._activeEditor !== active) {
            this._activeEditor = active;
            this.onActiveEditorChangedEmitter.fire(this._activeEditor);
        }
    }
    updateActiveEditor() {
        const widget = this.shell.activeWidget;
        if (widget instanceof editor_widget_1.EditorWidget) {
            this.addRecentlyVisible(widget);
            this.setActiveEditor(widget);
        }
        else {
            this.setActiveEditor(undefined);
        }
    }
    /**
     * The most recently activated editor (which might not have the focus anymore, hence it is not active).
     * If no editor has focus, e.g. when a context menu is shown, the active editor is `undefined`, but current might be the editor that was active before the menu popped up.
     */
    get currentEditor() {
        return this._currentEditor;
    }
    setCurrentEditor(current) {
        if (this._currentEditor !== current) {
            this._currentEditor = current;
            this.onCurrentEditorChangedEmitter.fire(this._currentEditor);
        }
    }
    updateCurrentEditor() {
        const widget = this.shell.currentWidget;
        if (widget instanceof editor_widget_1.EditorWidget) {
            this.setCurrentEditor(widget);
        }
        else if (!this._currentEditor || !this._currentEditor.isVisible || this.currentEditor !== this.recentlyVisible) {
            this.setCurrentEditor(this.recentlyVisible);
        }
    }
    canHandle(uri, options) {
        return 100;
    }
    open(uri, options) {
        var _a;
        if ((options === null || options === void 0 ? void 0 : options.counter) === undefined) {
            const insertionOptions = this.shell.getInsertionOptions(options === null || options === void 0 ? void 0 : options.widgetOptions);
            // Definitely creating a new tabbar - no widget can match.
            if ((_a = insertionOptions.addOptions.mode) === null || _a === void 0 ? void 0 : _a.startsWith('split')) {
                return super.open(uri, { counter: this.createCounterForUri(uri), ...options });
            }
            // Check the target tabbar for an existing widget.
            const tabbar = insertionOptions.addOptions.ref && this.shell.getTabBarFor(insertionOptions.addOptions.ref);
            if (tabbar) {
                const currentUri = uri.toString();
                for (const title of tabbar.titles) {
                    if (title.owner instanceof editor_widget_1.EditorWidget) {
                        const { uri: otherWidgetUri, id } = this.extractIdFromWidget(title.owner);
                        if (otherWidgetUri === currentUri) {
                            return super.open(uri, { counter: id, ...options });
                        }
                    }
                }
            }
            // If the user has opted to prefer to open an existing editor even if it's on a different tab, check if we have anything about the URI.
            if (this.preferenceService.get('workbench.editor.revealIfOpen', false)) {
                const counter = this.getCounterForUri(uri);
                if (counter !== undefined) {
                    return super.open(uri, { counter, ...options });
                }
            }
            // Open a new widget.
            return super.open(uri, { counter: this.createCounterForUri(uri), ...options });
        }
        return super.open(uri, options);
    }
    /**
     * Opens an editor to the side of the current editor. Defaults to opening to the right.
     * To modify direction, pass options with `{widgetOptions: {mode: ...}}`
     */
    openToSide(uri, options) {
        const counter = this.createCounterForUri(uri);
        const splitOptions = { widgetOptions: { mode: 'split-right' }, ...options, counter };
        return this.open(uri, splitOptions);
    }
    revealSelection(widget, input, uri) {
        let inputSelection = input === null || input === void 0 ? void 0 : input.selection;
        if (!inputSelection && uri) {
            const match = /^L?(\d+)(?:,(\d+))?/.exec(uri.fragment);
            if (match) {
                // support file:///some/file.js#73,84
                // support file:///some/file.js#L73
                inputSelection = {
                    start: {
                        line: parseInt(match[1]) - 1,
                        character: match[2] ? parseInt(match[2]) - 1 : 0
                    }
                };
            }
        }
        if (inputSelection) {
            const editor = widget.editor;
            const selection = this.getSelection(widget, inputSelection);
            if (editor_1.Position.is(selection)) {
                editor.cursor = selection;
                editor.revealPosition(selection);
            }
            else if (editor_1.Range.is(selection)) {
                editor.cursor = selection.end;
                editor.selection = selection;
                editor.revealRange(selection);
            }
        }
    }
    getSelection(widget, selection) {
        const { start, end } = selection;
        if (editor_1.Position.is(start)) {
            if (editor_1.Position.is(end)) {
                return widget.editor.document.toValidRange({ start, end });
            }
            return widget.editor.document.toValidPosition(start);
        }
        const line = start && start.line !== undefined && start.line >= 0 ? start.line : undefined;
        if (line === undefined) {
            return undefined;
        }
        const character = start && start.character !== undefined && start.character >= 0 ? start.character : widget.editor.document.getLineMaxColumn(line);
        const endLine = end && end.line !== undefined && end.line >= 0 ? end.line : undefined;
        if (endLine === undefined) {
            return { line, character };
        }
        const endCharacter = end && end.character !== undefined && end.character >= 0 ? end.character : widget.editor.document.getLineMaxColumn(endLine);
        return {
            start: { line, character },
            end: { line: endLine, character: endCharacter }
        };
    }
    removeFromCounter(widget) {
        const { id, uri } = this.extractIdFromWidget(widget);
        if (uri && !Number.isNaN(id)) {
            let max = -Infinity;
            this.all.forEach(editor => {
                const candidateID = this.extractIdFromWidget(editor);
                if ((candidateID.uri === uri) && (candidateID.id > max)) {
                    max = candidateID.id;
                }
            });
            if (max > -Infinity) {
                this.editorCounters.set(uri, max);
            }
            else {
                this.editorCounters.delete(uri);
            }
        }
    }
    extractIdFromWidget(widget) {
        const uri = widget.editor.uri.toString();
        const id = Number(widget.id.slice(widget.id.lastIndexOf(':') + 1));
        return { id, uri };
    }
    checkCounterForWidget(widget) {
        var _a;
        const { id, uri } = this.extractIdFromWidget(widget);
        const numericalId = Number(id);
        if (uri && !Number.isNaN(numericalId)) {
            const highestKnownId = (_a = this.editorCounters.get(uri)) !== null && _a !== void 0 ? _a : -Infinity;
            if (numericalId > highestKnownId) {
                this.editorCounters.set(uri, numericalId);
            }
        }
    }
    createCounterForUri(uri) {
        var _a;
        const identifier = uri.toString();
        const next = ((_a = this.editorCounters.get(identifier)) !== null && _a !== void 0 ? _a : 0) + 1;
        return next;
    }
    getCounterForUri(uri) {
        var _a;
        const idWithoutCounter = editor_widget_factory_1.EditorWidgetFactory.createID(uri);
        const counterOfMostRecentlyVisibleEditor = (_a = this.recentlyVisibleIds.find(id => id.startsWith(idWithoutCounter))) === null || _a === void 0 ? void 0 : _a.slice(idWithoutCounter.length + 1);
        return counterOfMostRecentlyVisibleEditor === undefined ? undefined : parseInt(counterOfMostRecentlyVisibleEditor);
    }
    getOrCreateCounterForUri(uri) {
        var _a;
        return (_a = this.getCounterForUri(uri)) !== null && _a !== void 0 ? _a : this.createCounterForUri(uri);
    }
    createWidgetOptions(uri, options) {
        var _a;
        const navigatableOptions = super.createWidgetOptions(uri, options);
        navigatableOptions.counter = (_a = options === null || options === void 0 ? void 0 : options.counter) !== null && _a !== void 0 ? _a : this.getOrCreateCounterForUri(uri);
        return navigatableOptions;
    }
};
__decorate([
    (0, inversify_1.inject)(common_1.CommandService),
    __metadata("design:type", Object)
], EditorManager.prototype, "commands", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.PreferenceService),
    __metadata("design:type", Object)
], EditorManager.prototype, "preferenceService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EditorManager.prototype, "init", null);
EditorManager = __decorate([
    (0, inversify_1.injectable)()
], EditorManager);
exports.EditorManager = EditorManager;
/**
 * Provides direct access to the underlying text editor.
 */
let EditorAccess = class EditorAccess {
    /**
     * The URI of the underlying document from the editor.
     */
    get uri() {
        const editor = this.editor;
        if (editor) {
            return editor.uri.toString();
        }
        return undefined;
    }
    /**
     * The selection location from the text editor.
     */
    get selection() {
        const editor = this.editor;
        if (editor) {
            const uri = editor.uri.toString();
            const range = editor.selection;
            return {
                range,
                uri
            };
        }
        return undefined;
    }
    /**
     * The unique identifier of the language the current editor belongs to.
     */
    get languageId() {
        const editor = this.editor;
        if (editor) {
            return editor.document.languageId;
        }
        return undefined;
    }
    /**
     * The text editor.
     */
    get editor() {
        const editorWidget = this.editorWidget();
        if (editorWidget) {
            return editorWidget.editor;
        }
        return undefined;
    }
};
__decorate([
    (0, inversify_1.inject)(EditorManager),
    __metadata("design:type", EditorManager)
], EditorAccess.prototype, "editorManager", void 0);
EditorAccess = __decorate([
    (0, inversify_1.injectable)()
], EditorAccess);
exports.EditorAccess = EditorAccess;
/**
 * Provides direct access to the currently active text editor.
 */
let CurrentEditorAccess = class CurrentEditorAccess extends EditorAccess {
    editorWidget() {
        return this.editorManager.currentEditor;
    }
};
CurrentEditorAccess = __decorate([
    (0, inversify_1.injectable)()
], CurrentEditorAccess);
exports.CurrentEditorAccess = CurrentEditorAccess;
/**
 * Provides access to the active text editor.
 */
let ActiveEditorAccess = class ActiveEditorAccess extends EditorAccess {
    editorWidget() {
        return this.editorManager.activeEditor;
    }
};
ActiveEditorAccess = __decorate([
    (0, inversify_1.injectable)()
], ActiveEditorAccess);
exports.ActiveEditorAccess = ActiveEditorAccess;
(function (EditorAccess) {
    EditorAccess.CURRENT = 'current-editor-access';
    EditorAccess.ACTIVE = 'active-editor-access';
})(EditorAccess = exports.EditorAccess || (exports.EditorAccess = {}));
exports.EditorAccess = EditorAccess;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/editor/lib/browser/editor-manager'] = this;


/***/ }),

/***/ "../../packages/editor/lib/browser/editor-menu.js":
/*!********************************************************!*\
  !*** ../../packages/editor/lib/browser/editor-menu.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EditorMenuContribution = exports.EditorMainMenu = exports.EditorContextMenu = exports.EDITOR_CONTEXT_MENU = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const editor_command_1 = __webpack_require__(/*! ./editor-command */ "../../packages/editor/lib/browser/editor-command.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
exports.EDITOR_CONTEXT_MENU = ['editor_context_menu'];
/**
 * Editor context menu default groups should be aligned
 * with VS Code default groups: https://code.visualstudio.com/api/references/contribution-points#contributes.menus
 */
var EditorContextMenu;
(function (EditorContextMenu) {
    EditorContextMenu.NAVIGATION = [...exports.EDITOR_CONTEXT_MENU, 'navigation'];
    EditorContextMenu.MODIFICATION = [...exports.EDITOR_CONTEXT_MENU, '1_modification'];
    EditorContextMenu.CUT_COPY_PASTE = [...exports.EDITOR_CONTEXT_MENU, '9_cutcopypaste'];
    EditorContextMenu.COMMANDS = [...exports.EDITOR_CONTEXT_MENU, 'z_commands'];
    EditorContextMenu.UNDO_REDO = [...exports.EDITOR_CONTEXT_MENU, '1_undo'];
})(EditorContextMenu = exports.EditorContextMenu || (exports.EditorContextMenu = {}));
var EditorMainMenu;
(function (EditorMainMenu) {
    /**
     * The main `Go` menu item.
     */
    EditorMainMenu.GO = [...core_1.MAIN_MENU_BAR, '5_go'];
    /**
     * Navigation menu group in the `Go` main-menu.
     */
    EditorMainMenu.NAVIGATION_GROUP = [...EditorMainMenu.GO, '1_navigation_group'];
    /**
     * Context management group in the `Go` main menu: Pane and editor switching commands.
     */
    EditorMainMenu.CONTEXT_GROUP = [...EditorMainMenu.GO, '1.1_context_group'];
    /**
     * Submenu for switching panes in the main area.
     */
    EditorMainMenu.PANE_GROUP = [...EditorMainMenu.CONTEXT_GROUP, '2_pane_group'];
    EditorMainMenu.BY_NUMBER = [...EditorMainMenu.PANE_GROUP, '1_by_number'];
    EditorMainMenu.NEXT_PREVIOUS = [...EditorMainMenu.PANE_GROUP, '2_by_location'];
    /**
     * Workspace menu group in the `Go` main-menu.
     */
    EditorMainMenu.WORKSPACE_GROUP = [...EditorMainMenu.GO, '2_workspace_group'];
    /**
     * Language features menu group in the `Go` main-menu.
     */
    EditorMainMenu.LANGUAGE_FEATURES_GROUP = [...EditorMainMenu.GO, '3_language_features_group'];
    /**
     * Location menu group in the `Go` main-menu.
     */
    EditorMainMenu.LOCATION_GROUP = [...EditorMainMenu.GO, '4_locations'];
})(EditorMainMenu = exports.EditorMainMenu || (exports.EditorMainMenu = {}));
let EditorMenuContribution = class EditorMenuContribution {
    registerMenus(registry) {
        registry.registerMenuAction(EditorContextMenu.UNDO_REDO, {
            commandId: browser_1.CommonCommands.UNDO.id
        });
        registry.registerMenuAction(EditorContextMenu.UNDO_REDO, {
            commandId: browser_1.CommonCommands.REDO.id
        });
        registry.registerMenuAction(EditorContextMenu.CUT_COPY_PASTE, {
            commandId: browser_1.CommonCommands.CUT.id,
            order: '0'
        });
        registry.registerMenuAction(EditorContextMenu.CUT_COPY_PASTE, {
            commandId: browser_1.CommonCommands.COPY.id,
            order: '1'
        });
        registry.registerMenuAction(EditorContextMenu.CUT_COPY_PASTE, {
            commandId: browser_1.CommonCommands.PASTE.id,
            order: '2'
        });
        // Editor navigation. Go > Back and Go > Forward.
        registry.registerSubmenu(EditorMainMenu.GO, nls_1.nls.localizeByDefault('Go'));
        registry.registerMenuAction(EditorMainMenu.NAVIGATION_GROUP, {
            commandId: editor_command_1.EditorCommands.GO_BACK.id,
            label: editor_command_1.EditorCommands.GO_BACK.label,
            order: '1'
        });
        registry.registerMenuAction(EditorMainMenu.NAVIGATION_GROUP, {
            commandId: editor_command_1.EditorCommands.GO_FORWARD.id,
            label: editor_command_1.EditorCommands.GO_FORWARD.label,
            order: '2'
        });
        registry.registerMenuAction(EditorMainMenu.NAVIGATION_GROUP, {
            commandId: editor_command_1.EditorCommands.GO_LAST_EDIT.id,
            label: nls_1.nls.localizeByDefault('Last Edit Location'),
            order: '3'
        });
        registry.registerSubmenu(EditorMainMenu.PANE_GROUP, nls_1.nls.localizeByDefault('Switch Group'));
        registry.registerMenuAction(EditorMainMenu.BY_NUMBER, {
            commandId: 'workbench.action.focusFirstEditorGroup',
            label: nls_1.nls.localizeByDefault('Group 1'),
        });
        registry.registerMenuAction(EditorMainMenu.BY_NUMBER, {
            commandId: 'workbench.action.focusSecondEditorGroup',
            label: nls_1.nls.localizeByDefault('Group 2'),
        });
        registry.registerMenuAction(EditorMainMenu.BY_NUMBER, {
            commandId: 'workbench.action.focusThirdEditorGroup',
            label: nls_1.nls.localizeByDefault('Group 3'),
        });
        registry.registerMenuAction(EditorMainMenu.BY_NUMBER, {
            commandId: 'workbench.action.focusFourthEditorGroup',
            label: nls_1.nls.localizeByDefault('Group 4'),
        });
        registry.registerMenuAction(EditorMainMenu.BY_NUMBER, {
            commandId: 'workbench.action.focusFifthEditorGroup',
            label: nls_1.nls.localizeByDefault('Group 5'),
        });
        registry.registerMenuAction(EditorMainMenu.NEXT_PREVIOUS, {
            commandId: browser_1.CommonCommands.NEXT_TAB_GROUP.id,
            label: nls_1.nls.localizeByDefault('Next Group'),
            order: '1'
        });
        registry.registerMenuAction(EditorMainMenu.NEXT_PREVIOUS, {
            commandId: browser_1.CommonCommands.PREVIOUS_TAB_GROUP.id,
            label: nls_1.nls.localizeByDefault('Previous Group'),
            order: '2'
        });
        registry.registerMenuAction(EditorMainMenu.LOCATION_GROUP, {
            commandId: editor_command_1.EditorCommands.GOTO_LINE_COLUMN.id,
            order: '1'
        });
        // Toggle Commands.
        registry.registerMenuAction(browser_1.CommonMenus.VIEW_TOGGLE, {
            commandId: editor_command_1.EditorCommands.TOGGLE_WORD_WRAP.id,
            order: '0'
        });
        registry.registerMenuAction(browser_1.CommonMenus.VIEW_TOGGLE, {
            commandId: editor_command_1.EditorCommands.TOGGLE_MINIMAP.id,
            order: '1',
        });
        registry.registerMenuAction(browser_1.CommonMenus.VIEW_TOGGLE, {
            commandId: browser_1.CommonCommands.TOGGLE_BREADCRUMBS.id,
            order: '2',
        });
        registry.registerMenuAction(browser_1.CommonMenus.VIEW_TOGGLE, {
            commandId: editor_command_1.EditorCommands.TOGGLE_RENDER_WHITESPACE.id,
            order: '3'
        });
        registry.registerMenuAction(browser_1.CommonMenus.VIEW_TOGGLE, {
            commandId: editor_command_1.EditorCommands.TOGGLE_STICKY_SCROLL.id,
            order: '4'
        });
        registry.registerMenuAction(browser_1.CommonMenus.FILE_CLOSE, {
            commandId: browser_1.CommonCommands.CLOSE_MAIN_TAB.id,
            label: nls_1.nls.localizeByDefault('Close Editor'),
            order: '1'
        });
        registry.registerMenuAction(browser_1.CommonMenus.VIEW_EDITOR_SUBMENU_SPLIT, {
            commandId: editor_command_1.EditorCommands.SPLIT_EDITOR_RIGHT.id,
            label: nls_1.nls.localizeByDefault('Split Editor Right'),
            order: '0'
        });
        registry.registerMenuAction(browser_1.CommonMenus.VIEW_EDITOR_SUBMENU_SPLIT, {
            commandId: editor_command_1.EditorCommands.SPLIT_EDITOR_LEFT.id,
            label: nls_1.nls.localizeByDefault('Split Editor Left'),
            order: '1'
        });
        registry.registerMenuAction(browser_1.CommonMenus.VIEW_EDITOR_SUBMENU_SPLIT, {
            commandId: editor_command_1.EditorCommands.SPLIT_EDITOR_UP.id,
            label: nls_1.nls.localizeByDefault('Split Editor Up'),
            order: '2'
        });
        registry.registerMenuAction(browser_1.CommonMenus.VIEW_EDITOR_SUBMENU_SPLIT, {
            commandId: editor_command_1.EditorCommands.SPLIT_EDITOR_DOWN.id,
            label: nls_1.nls.localizeByDefault('Split Editor Down'),
            order: '3'
        });
        registry.registerMenuAction(browser_1.CommonMenus.VIEW_EDITOR_SUBMENU_ORTHO, {
            commandId: editor_command_1.EditorCommands.SPLIT_EDITOR_HORIZONTAL.id,
            label: nls_1.nls.localize('theia/editor/splitHorizontal', 'Split Editor Horizontal'),
            order: '1'
        });
        registry.registerMenuAction(browser_1.CommonMenus.VIEW_EDITOR_SUBMENU_ORTHO, {
            commandId: editor_command_1.EditorCommands.SPLIT_EDITOR_VERTICAL.id,
            label: nls_1.nls.localize('theia/editor/splitVertical', 'Split Editor Vertical'),
            order: '2'
        });
        registry.registerSubmenu(browser_1.CommonMenus.VIEW_EDITOR_SUBMENU, nls_1.nls.localizeByDefault('Editor Layout'));
    }
};
EditorMenuContribution = __decorate([
    (0, inversify_1.injectable)()
], EditorMenuContribution);
exports.EditorMenuContribution = EditorMenuContribution;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/editor/lib/browser/editor-menu'] = this;


/***/ }),

/***/ "../../packages/editor/lib/browser/editor-preferences.js":
/*!***************************************************************!*\
  !*** ../../packages/editor/lib/browser/editor-preferences.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2018 Ericsson and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.bindEditorPreferences = exports.createEditorPreferences = exports.EditorPreferences = exports.EditorPreferenceContribution = exports.editorPreferenceSchema = void 0;
const preferences_1 = __webpack_require__(/*! @theia/core/lib/browser/preferences */ "../../packages/core/lib/browser/preferences/index.js");
const injectable_preference_proxy_1 = __webpack_require__(/*! @theia/core/lib/browser/preferences/injectable-preference-proxy */ "../../packages/core/lib/browser/preferences/injectable-preference-proxy.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const editor_generated_preference_schema_1 = __webpack_require__(/*! ./editor-generated-preference-schema */ "../../packages/editor/lib/browser/editor-generated-preference-schema.js");
/* eslint-disable @theia/localization-check,max-len,no-null/no-null */
// #region src/vs/workbench/contrib/codeActions/browser/codeActionsContribution.ts
const codeActionsContributionSchema = {
    'editor.codeActionsOnSave': {
        oneOf: [
            {
                type: 'object',
                properties: {
                    'source.fixAll': {
                        type: 'boolean',
                        description: nls_1.nls.localizeByDefault('Controls whether auto fix action should be run on file save.')
                    }
                },
                additionalProperties: {
                    type: 'boolean'
                },
            },
            {
                type: 'array',
                items: { type: 'string' }
            }
        ],
        default: {},
        description: nls_1.nls.localizeByDefault('Code action kinds to be run on save.'),
        scope: 'language-overridable',
    }
};
// #endregion
// #region src/vs/workbench/contrib/files/browser/files.contribution.ts
const fileContributionSchema = {
    'editor.formatOnSave': {
        'type': 'boolean',
        'description': nls_1.nls.localizeByDefault('Format a file on save. A formatter must be available, the file must not be saved after delay, and the editor must not be shutting down.'),
        'scope': preferences_1.PreferenceScope.fromString('language-overridable'),
    },
    'editor.formatOnSaveMode': {
        'type': 'string',
        'default': 'file',
        'enum': [
            'file',
            'modifications',
            'modificationsIfAvailable'
        ],
        'enumDescriptions': [
            nls_1.nls.localizeByDefault('Format the whole file.'),
            nls_1.nls.localizeByDefault('Format modifications (requires source control).'),
            nls_1.nls.localize('theia/editor/editor.formatOnSaveMode.modificationsIfAvailable', "Will attempt to format modifications only (requires source control). If source control can't be used, then the whole file will be formatted."),
        ],
        'markdownDescription': nls_1.nls.localizeByDefault('Controls if format on save formats the whole file or only modifications. Only applies when `#editor.formatOnSave#` is enabled.'),
        'scope': preferences_1.PreferenceScope.fromString('language-overridable'),
    },
    // Include this, even though it is not strictly an `editor`preference.
    'files.eol': {
        'type': 'string',
        'enum': [
            '\n',
            '\r\n',
            'auto'
        ],
        'enumDescriptions': [
            nls_1.nls.localizeByDefault('LF'),
            nls_1.nls.localizeByDefault('CRLF'),
            nls_1.nls.localizeByDefault('Uses operating system specific end of line character.')
        ],
        'default': 'auto',
        'description': nls_1.nls.localizeByDefault('The default end of line character.'),
        'scope': preferences_1.PreferenceScope.fromString('language-overridable')
    },
    // We used to call these `editor.autoSave` and `editor.autoSaveDelay`.
    'files.autoSave': {
        'type': 'string',
        'enum': ['off', 'afterDelay', 'onFocusChange', 'onWindowChange'],
        'markdownEnumDescriptions': [
            nls_1.nls.localize('theia/editor/files.autoSave.off', 'An editor with changes is never automatically saved.'),
            nls_1.nls.localize('theia/editor/files.autoSave.afterDelay', 'An editor with changes is automatically saved after the configured `#files.autoSaveDelay#`.'),
            nls_1.nls.localize('theia/editor/files.autoSave.onFocusChange', 'An editor with changes is automatically saved when the editor loses focus.'),
            nls_1.nls.localize('theia/editor/files.autoSave.onWindowChange', 'An editor with changes is automatically saved when the window loses focus.')
        ],
        'default': core_1.environment.electron.is() ? 'off' : 'afterDelay',
        'markdownDescription': nls_1.nls.localize('theia/editor/files.autoSave', 'Controls [auto save](https://code.visualstudio.com/docs/editor/codebasics#_save-auto-save) of editors that have unsaved changes.', 'off', 'afterDelay', 'onFocusChange', 'onWindowChange', 'afterDelay')
    },
    'files.autoSaveDelay': {
        'type': 'number',
        'default': 1000,
        'minimum': 0,
        'markdownDescription': nls_1.nls.localizeByDefault('Controls the delay in milliseconds after which an editor with unsaved changes is saved automatically. Only applies when `#files.autoSave#` is set to `{0}`.', 'afterDelay')
    },
    'files.refactoring.autoSave': {
        'type': 'boolean',
        'default': true,
        'description': nls_1.nls.localizeByDefault('Controls if files that were part of a refactoring are saved automatically')
    }
};
// #endregion
// #region src/vs/workbench/contrib/format/browser/formatActionsMultiple.ts
// This schema depends on a lot of private stuff in the file, so this is a stripped down version.
const formatActionsMultipleSchema = {
    'editor.defaultFormatter': {
        description: nls_1.nls.localizeByDefault('Defines a default formatter which takes precedence over all other formatter settings. Must be the identifier of an extension contributing a formatter.'),
        type: ['string', 'null'],
        default: null,
    }
};
// #endregion
// #region Custom Theia extensions to editor preferences
const theiaEditorSchema = {
    'editor.formatOnSaveTimeout': {
        'type': 'number',
        'default': 750,
        'description': nls_1.nls.localize('theia/editor/formatOnSaveTimeout', 'Timeout in milliseconds after which the formatting that is run on file save is cancelled.')
    },
    'editor.history.persistClosedEditors': {
        'type': 'boolean',
        'default': false,
        'description': nls_1.nls.localize('theia/editor/persistClosedEditors', 'Controls whether to persist closed editor history for the workspace across window reloads.')
    },
};
// #endregion
const combinedProperties = {
    ...editor_generated_preference_schema_1.editorGeneratedPreferenceProperties,
    ...codeActionsContributionSchema,
    ...fileContributionSchema,
    ...formatActionsMultipleSchema,
    ...theiaEditorSchema
};
exports.editorPreferenceSchema = {
    'type': 'object',
    'scope': 'resource',
    'overridable': true,
    'properties': combinedProperties,
};
exports.EditorPreferenceContribution = Symbol('EditorPreferenceContribution');
exports.EditorPreferences = Symbol('EditorPreferences');
/**
 * @deprecated @since 1.23.0
 *
 * By default, editor preferences now use a validated preference proxy created by the PreferenceProxyFactory binding.
 * This function will create an unvalidated preference proxy.
 * See {@link bindEditorPreferences}
 */
function createEditorPreferences(preferences, schema = exports.editorPreferenceSchema) {
    return (0, preferences_1.createPreferenceProxy)(preferences, schema);
}
exports.createEditorPreferences = createEditorPreferences;
function bindEditorPreferences(bind) {
    bind(exports.EditorPreferences).toDynamicValue(ctx => {
        const factory = ctx.container.get(injectable_preference_proxy_1.PreferenceProxyFactory);
        return factory(exports.editorPreferenceSchema);
    }).inSingletonScope();
    bind(exports.EditorPreferenceContribution).toConstantValue({ schema: exports.editorPreferenceSchema });
    bind(preferences_1.PreferenceContribution).toService(exports.EditorPreferenceContribution);
}
exports.bindEditorPreferences = bindEditorPreferences;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/editor/lib/browser/editor-preferences'] = this;


/***/ }),

/***/ "../../packages/editor/lib/browser/editor-widget-factory.js":
/*!******************************************************************!*\
  !*** ../../packages/editor/lib/browser/editor-widget-factory.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var EditorWidgetFactory_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EditorWidgetFactory = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const editor_widget_1 = __webpack_require__(/*! ./editor-widget */ "../../packages/editor/lib/browser/editor-widget.js");
const editor_1 = __webpack_require__(/*! ./editor */ "../../packages/editor/lib/browser/editor.js");
let EditorWidgetFactory = EditorWidgetFactory_1 = class EditorWidgetFactory {
    constructor() {
        this.id = EditorWidgetFactory_1.ID;
    }
    static createID(uri, counter) {
        return EditorWidgetFactory_1.ID
            + `:${uri.toString()}`
            + (counter !== undefined ? `:${counter}` : '');
    }
    createWidget(options) {
        const uri = new uri_1.default(options.uri);
        return this.createEditor(uri, options);
    }
    async createEditor(uri, options) {
        const newEditor = await this.constructEditor(uri);
        this.setLabels(newEditor, uri);
        const labelListener = this.labelProvider.onDidChange(event => {
            if (event.affects(uri)) {
                this.setLabels(newEditor, uri);
            }
        });
        newEditor.onDispose(() => labelListener.dispose());
        newEditor.id = EditorWidgetFactory_1.createID(uri, options === null || options === void 0 ? void 0 : options.counter);
        newEditor.title.closable = true;
        return newEditor;
    }
    async constructEditor(uri) {
        const textEditor = await this.editorProvider(uri);
        return new editor_widget_1.EditorWidget(textEditor, this.selectionService);
    }
    setLabels(editor, uri) {
        editor.title.caption = uri.path.fsPath();
        if (editor.editor.isReadonly) {
            editor.title.caption += ` • ${common_1.nls.localizeByDefault('Read-only')}`;
        }
        const icon = this.labelProvider.getIcon(uri);
        editor.title.label = this.labelProvider.getName(uri);
        editor.title.iconClass = icon + ' file-icon';
    }
};
EditorWidgetFactory.ID = 'code-editor-opener';
__decorate([
    (0, inversify_1.inject)(browser_1.LabelProvider),
    __metadata("design:type", browser_1.LabelProvider)
], EditorWidgetFactory.prototype, "labelProvider", void 0);
__decorate([
    (0, inversify_1.inject)(editor_1.TextEditorProvider),
    __metadata("design:type", Function)
], EditorWidgetFactory.prototype, "editorProvider", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.SelectionService),
    __metadata("design:type", common_1.SelectionService)
], EditorWidgetFactory.prototype, "selectionService", void 0);
EditorWidgetFactory = EditorWidgetFactory_1 = __decorate([
    (0, inversify_1.injectable)()
], EditorWidgetFactory);
exports.EditorWidgetFactory = EditorWidgetFactory;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/editor/lib/browser/editor-widget-factory'] = this;


/***/ }),

/***/ "../../packages/editor/lib/browser/editor-widget.js":
/*!**********************************************************!*\
  !*** ../../packages/editor/lib/browser/editor-widget.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EditorWidget = void 0;
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const algorithm_1 = __webpack_require__(/*! @theia/core/shared/@phosphor/algorithm */ "../../packages/core/shared/@phosphor/algorithm/index.js");
class EditorWidget extends browser_1.BaseWidget {
    constructor(editor, selectionService) {
        super(editor);
        this.editor = editor;
        this.selectionService = selectionService;
        this.toDisposeOnTabbarChange = new common_1.DisposableCollection();
        this.addClass('theia-editor');
        if (editor.isReadonly) {
            (0, browser_1.lock)(this.title);
        }
        this.toDispose.push(this.editor);
        this.toDispose.push(this.toDisposeOnTabbarChange);
        this.toDispose.push(this.editor.onSelectionChanged(() => this.setSelection()));
        this.toDispose.push(this.editor.onFocusChanged(() => this.setSelection()));
        this.toDispose.push(common_1.Disposable.create(() => {
            if (this.selectionService.selection === this.editor) {
                this.selectionService.selection = undefined;
            }
        }));
    }
    setSelection() {
        if (this.editor.isFocused() && this.selectionService.selection !== this.editor) {
            this.selectionService.selection = this.editor;
        }
    }
    get saveable() {
        return this.editor.document;
    }
    getResourceUri() {
        return this.editor.getResourceUri();
    }
    createMoveToUri(resourceUri) {
        return this.editor.createMoveToUri(resourceUri);
    }
    onActivateRequest(msg) {
        super.onActivateRequest(msg);
        this.editor.focus();
        this.selectionService.selection = this.editor;
    }
    onAfterAttach(msg) {
        super.onAfterAttach(msg);
        if (this.isVisible) {
            this.editor.refresh();
        }
        this.checkForTabbarChange();
    }
    checkForTabbarChange() {
        const { parent } = this;
        if (parent instanceof browser_1.DockPanel) {
            const newTabbar = (0, algorithm_1.find)(parent.tabBars(), tabbar => !!tabbar.titles.find(title => title === this.title));
            if (this.currentTabbar !== newTabbar) {
                this.toDisposeOnTabbarChange.dispose();
                const listener = () => this.checkForTabbarChange();
                parent.layoutModified.connect(listener);
                this.toDisposeOnTabbarChange.push(common_1.Disposable.create(() => parent.layoutModified.disconnect(listener)));
                const last = this.currentTabbar;
                this.currentTabbar = newTabbar;
                this.handleTabBarChange(last, newTabbar);
            }
        }
    }
    handleTabBarChange(oldTabBar, newTabBar) {
        const ownSaveable = browser_1.Saveable.get(this);
        const competingEditors = ownSaveable && (newTabBar === null || newTabBar === void 0 ? void 0 : newTabBar.titles.filter(title => title !== this.title
            && (title.owner instanceof EditorWidget)
            && title.owner.editor.uri.isEqual(this.editor.uri)
            && browser_1.Saveable.get(title.owner) === ownSaveable));
        competingEditors === null || competingEditors === void 0 ? void 0 : competingEditors.forEach(title => title.owner.close());
    }
    onAfterShow(msg) {
        super.onAfterShow(msg);
        this.editor.refresh();
    }
    onResize(msg) {
        if (msg.width < 0 || msg.height < 0) {
            this.editor.resizeToFit();
        }
        else {
            this.editor.setSize(msg);
        }
    }
    storeState() {
        var _a;
        return ((_a = this.getResourceUri()) === null || _a === void 0 ? void 0 : _a.scheme) === common_1.UNTITLED_SCHEME ? undefined : this.editor.storeViewState();
    }
    restoreState(oldState) {
        this.editor.restoreViewState(oldState);
    }
    get onDispose() {
        return this.toDispose.onDispose;
    }
}
exports.EditorWidget = EditorWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/editor/lib/browser/editor-widget'] = this;


/***/ }),

/***/ "../../packages/editor/lib/browser/editor.js":
/*!***************************************************!*\
  !*** ../../packages/editor/lib/browser/editor.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CustomEditorWidget = exports.TextEditorSelection = exports.MouseTargetType = exports.TextDocumentContentChangeDelta = exports.TextEditorProvider = exports.Location = exports.Range = exports.Position = void 0;
const vscode_languageserver_protocol_1 = __webpack_require__(/*! @theia/core/shared/vscode-languageserver-protocol */ "../../packages/core/shared/vscode-languageserver-protocol/index.js");
Object.defineProperty(exports, "Position", ({ enumerable: true, get: function () { return vscode_languageserver_protocol_1.Position; } }));
Object.defineProperty(exports, "Range", ({ enumerable: true, get: function () { return vscode_languageserver_protocol_1.Range; } }));
Object.defineProperty(exports, "Location", ({ enumerable: true, get: function () { return vscode_languageserver_protocol_1.Location; } }));
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
Object.defineProperty(exports, "TextDocumentContentChangeDelta", ({ enumerable: true, get: function () { return common_1.TextDocumentContentChangeDelta; } }));
exports.TextEditorProvider = Symbol('TextEditorProvider');
/**
 * Type of hit element with the mouse in the editor.
 * Copied from monaco editor.
 */
var MouseTargetType;
(function (MouseTargetType) {
    /**
     * Mouse is on top of an unknown element.
     */
    MouseTargetType[MouseTargetType["UNKNOWN"] = 0] = "UNKNOWN";
    /**
     * Mouse is on top of the textarea used for input.
     */
    MouseTargetType[MouseTargetType["TEXTAREA"] = 1] = "TEXTAREA";
    /**
     * Mouse is on top of the glyph margin
     */
    MouseTargetType[MouseTargetType["GUTTER_GLYPH_MARGIN"] = 2] = "GUTTER_GLYPH_MARGIN";
    /**
     * Mouse is on top of the line numbers
     */
    MouseTargetType[MouseTargetType["GUTTER_LINE_NUMBERS"] = 3] = "GUTTER_LINE_NUMBERS";
    /**
     * Mouse is on top of the line decorations
     */
    MouseTargetType[MouseTargetType["GUTTER_LINE_DECORATIONS"] = 4] = "GUTTER_LINE_DECORATIONS";
    /**
     * Mouse is on top of the whitespace left in the gutter by a view zone.
     */
    MouseTargetType[MouseTargetType["GUTTER_VIEW_ZONE"] = 5] = "GUTTER_VIEW_ZONE";
    /**
     * Mouse is on top of text in the content.
     */
    MouseTargetType[MouseTargetType["CONTENT_TEXT"] = 6] = "CONTENT_TEXT";
    /**
     * Mouse is on top of empty space in the content (e.g. after line text or below last line)
     */
    MouseTargetType[MouseTargetType["CONTENT_EMPTY"] = 7] = "CONTENT_EMPTY";
    /**
     * Mouse is on top of a view zone in the content.
     */
    MouseTargetType[MouseTargetType["CONTENT_VIEW_ZONE"] = 8] = "CONTENT_VIEW_ZONE";
    /**
     * Mouse is on top of a content widget.
     */
    MouseTargetType[MouseTargetType["CONTENT_WIDGET"] = 9] = "CONTENT_WIDGET";
    /**
     * Mouse is on top of the decorations overview ruler.
     */
    MouseTargetType[MouseTargetType["OVERVIEW_RULER"] = 10] = "OVERVIEW_RULER";
    /**
     * Mouse is on top of a scrollbar.
     */
    MouseTargetType[MouseTargetType["SCROLLBAR"] = 11] = "SCROLLBAR";
    /**
     * Mouse is on top of an overlay widget.
     */
    MouseTargetType[MouseTargetType["OVERLAY_WIDGET"] = 12] = "OVERLAY_WIDGET";
    /**
     * Mouse is outside of the editor.
     */
    MouseTargetType[MouseTargetType["OUTSIDE_EDITOR"] = 13] = "OUTSIDE_EDITOR";
})(MouseTargetType = exports.MouseTargetType || (exports.MouseTargetType = {}));
var TextEditorSelection;
(function (TextEditorSelection) {
    function is(arg) {
        return (0, common_1.isObject)(arg) && arg.uri instanceof uri_1.default;
    }
    TextEditorSelection.is = is;
})(TextEditorSelection = exports.TextEditorSelection || (exports.TextEditorSelection = {}));
var CustomEditorWidget;
(function (CustomEditorWidget) {
    function is(arg) {
        return !!arg && 'modelRef' in arg;
    }
    CustomEditorWidget.is = is;
})(CustomEditorWidget = exports.CustomEditorWidget || (exports.CustomEditorWidget = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/editor/lib/browser/editor'] = this;


/***/ })

}]);
//# sourceMappingURL=packages_editor_lib_browser_editor-menu_js.js.map