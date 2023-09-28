"use strict";
(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_editor_lib_browser_editor-frontend-module_js"],{

/***/ "../../packages/core/lib/common/severity.js":
/*!**************************************************!*\
  !*** ../../packages/core/lib/common/severity.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2019 Ericsson and others.
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
exports.Severity = void 0;
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const vscode_languageserver_protocol_1 = __webpack_require__(/*! vscode-languageserver-protocol */ "../../node_modules/vscode-languageserver-protocol/lib/browser/main.js");
const nls_1 = __webpack_require__(/*! ./nls */ "../../packages/core/lib/common/nls.js");
var Severity;
(function (Severity) {
    Severity[Severity["Ignore"] = 0] = "Ignore";
    Severity[Severity["Error"] = 1] = "Error";
    Severity[Severity["Warning"] = 2] = "Warning";
    Severity[Severity["Info"] = 3] = "Info";
    Severity[Severity["Log"] = 4] = "Log";
})(Severity = exports.Severity || (exports.Severity = {}));
const error = 'Errors';
const warning = 'Warnings';
const info = 'Info';
const log = 'Log';
const ignore = 'All';
(function (Severity) {
    function fromValue(value) {
        value = value && value.toLowerCase();
        if (!value) {
            return Severity.Ignore;
        }
        if (['error', 'errors'].indexOf(value) !== -1) {
            return Severity.Error;
        }
        if (['warn', 'warning', 'warnings'].indexOf(value) !== -1) {
            return Severity.Warning;
        }
        if (value === 'info') {
            return Severity.Info;
        }
        if (value === 'log') {
            return Severity.Log;
        }
        return Severity.Ignore;
    }
    Severity.fromValue = fromValue;
    function toDiagnosticSeverity(value) {
        switch (value) {
            case Severity.Ignore:
                return vscode_languageserver_protocol_1.DiagnosticSeverity.Hint;
            case Severity.Info:
                return vscode_languageserver_protocol_1.DiagnosticSeverity.Information;
            case Severity.Log:
                return vscode_languageserver_protocol_1.DiagnosticSeverity.Information;
            case Severity.Warning:
                return vscode_languageserver_protocol_1.DiagnosticSeverity.Warning;
            case Severity.Error:
                return vscode_languageserver_protocol_1.DiagnosticSeverity.Error;
            default:
                return vscode_languageserver_protocol_1.DiagnosticSeverity.Error;
        }
    }
    Severity.toDiagnosticSeverity = toDiagnosticSeverity;
    function toString(severity) {
        switch (severity) {
            case Severity.Error:
                return error;
            case Severity.Warning:
                return warning;
            case Severity.Info:
                return info;
            case Severity.Log:
                return log;
            default:
                return ignore;
        }
    }
    Severity.toString = toString;
    function toLocaleString(severity) {
        if (severity === Severity.Error || severity === error) {
            return nls_1.nls.localize('theia/core/severity/errors', 'Errors');
        }
        else if (severity === Severity.Warning || severity === warning) {
            return nls_1.nls.localize('theia/core/severity/warnings', 'Warnings');
        }
        else if (severity === Severity.Info || severity === info) {
            return nls_1.nls.localizeByDefault('Info');
        }
        else if (severity === Severity.Log || severity === log) {
            return nls_1.nls.localize('theia/core/severity/log', 'Log');
        }
        else {
            return nls_1.nls.localizeByDefault('All');
        }
    }
    Severity.toLocaleString = toLocaleString;
    function toArray() {
        return [ignore, error, warning, info, log];
    }
    Severity.toArray = toArray;
})(Severity = exports.Severity || (exports.Severity = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/lib/common/severity'] = this;


/***/ }),

/***/ "../../packages/editor/lib/browser/editor-contribution.js":
/*!****************************************************************!*\
  !*** ../../packages/editor/lib/browser/editor-contribution.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
exports.EditorContribution = void 0;
const editor_manager_1 = __webpack_require__(/*! ./editor-manager */ "../../packages/editor/lib/browser/editor-manager.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const status_bar_1 = __webpack_require__(/*! @theia/core/lib/browser/status-bar/status-bar */ "../../packages/core/lib/browser/status-bar/status-bar.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const context_key_service_1 = __webpack_require__(/*! @theia/core/lib/browser/context-key-service */ "../../packages/core/lib/browser/context-key-service.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const editor_command_1 = __webpack_require__(/*! ./editor-command */ "../../packages/editor/lib/browser/editor-command.js");
const supported_encodings_1 = __webpack_require__(/*! @theia/core/lib/browser/supported-encodings */ "../../packages/core/lib/browser/supported-encodings.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
const current_widget_command_adapter_1 = __webpack_require__(/*! @theia/core/lib/browser/shell/current-widget-command-adapter */ "../../packages/core/lib/browser/shell/current-widget-command-adapter.js");
const editor_widget_1 = __webpack_require__(/*! ./editor-widget */ "../../packages/editor/lib/browser/editor-widget.js");
const editor_language_status_service_1 = __webpack_require__(/*! ./language-status/editor-language-status-service */ "../../packages/editor/lib/browser/language-status/editor-language-status-service.js");
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

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/editor/lib/browser/editor-contribution'] = this;


/***/ }),

/***/ "../../packages/editor/lib/browser/editor-frontend-module.js":
/*!*******************************************************************!*\
  !*** ../../packages/editor/lib/browser/editor-frontend-module.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
__webpack_require__(/*! ../../src/browser/style/index.css */ "../../packages/editor/src/browser/style/index.css");
__webpack_require__(/*! ../../src/browser/language-status/editor-language-status.css */ "../../packages/editor/src/browser/language-status/editor-language-status.css");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const browser_2 = __webpack_require__(/*! @theia/variable-resolver/lib/browser */ "../../packages/variable-resolver/lib/browser/index.js");
const editor_manager_1 = __webpack_require__(/*! ./editor-manager */ "../../packages/editor/lib/browser/editor-manager.js");
const editor_contribution_1 = __webpack_require__(/*! ./editor-contribution */ "../../packages/editor/lib/browser/editor-contribution.js");
const editor_menu_1 = __webpack_require__(/*! ./editor-menu */ "../../packages/editor/lib/browser/editor-menu.js");
const editor_command_1 = __webpack_require__(/*! ./editor-command */ "../../packages/editor/lib/browser/editor-command.js");
const editor_keybinding_1 = __webpack_require__(/*! ./editor-keybinding */ "../../packages/editor/lib/browser/editor-keybinding.js");
const editor_preferences_1 = __webpack_require__(/*! ./editor-preferences */ "../../packages/editor/lib/browser/editor-preferences.js");
const editor_widget_factory_1 = __webpack_require__(/*! ./editor-widget-factory */ "../../packages/editor/lib/browser/editor-widget-factory.js");
const editor_navigation_contribution_1 = __webpack_require__(/*! ./editor-navigation-contribution */ "../../packages/editor/lib/browser/editor-navigation-contribution.js");
const navigation_location_updater_1 = __webpack_require__(/*! ./navigation/navigation-location-updater */ "../../packages/editor/lib/browser/navigation/navigation-location-updater.js");
const navigation_location_service_1 = __webpack_require__(/*! ./navigation/navigation-location-service */ "../../packages/editor/lib/browser/navigation/navigation-location-service.js");
const navigation_location_similarity_1 = __webpack_require__(/*! ./navigation/navigation-location-similarity */ "../../packages/editor/lib/browser/navigation/navigation-location-similarity.js");
const editor_variable_contribution_1 = __webpack_require__(/*! ./editor-variable-contribution */ "../../packages/editor/lib/browser/editor-variable-contribution.js");
const quick_access_1 = __webpack_require__(/*! @theia/core/lib/browser/quick-input/quick-access */ "../../packages/core/lib/browser/quick-input/quick-access.js");
const quick_editor_service_1 = __webpack_require__(/*! ./quick-editor-service */ "../../packages/editor/lib/browser/quick-editor-service.js");
const editor_language_status_service_1 = __webpack_require__(/*! ./language-status/editor-language-status-service */ "../../packages/editor/lib/browser/language-status/editor-language-status-service.js");
const editor_linenumber_contribution_1 = __webpack_require__(/*! ./editor-linenumber-contribution */ "../../packages/editor/lib/browser/editor-linenumber-contribution.js");
const undo_redo_service_1 = __webpack_require__(/*! ./undo-redo-service */ "../../packages/editor/lib/browser/undo-redo-service.js");
exports["default"] = new inversify_1.ContainerModule(bind => {
    (0, editor_preferences_1.bindEditorPreferences)(bind);
    bind(editor_widget_factory_1.EditorWidgetFactory).toSelf().inSingletonScope();
    bind(browser_1.WidgetFactory).toService(editor_widget_factory_1.EditorWidgetFactory);
    bind(editor_manager_1.EditorManager).toSelf().inSingletonScope();
    bind(browser_1.OpenHandler).toService(editor_manager_1.EditorManager);
    bind(editor_command_1.EditorCommandContribution).toSelf().inSingletonScope();
    bind(common_1.CommandContribution).toService(editor_command_1.EditorCommandContribution);
    bind(editor_menu_1.EditorMenuContribution).toSelf().inSingletonScope();
    bind(common_1.MenuContribution).toService(editor_menu_1.EditorMenuContribution);
    bind(editor_keybinding_1.EditorKeybindingContribution).toSelf().inSingletonScope();
    bind(browser_1.KeybindingContribution).toService(editor_keybinding_1.EditorKeybindingContribution);
    bind(editor_contribution_1.EditorContribution).toSelf().inSingletonScope();
    bind(browser_1.FrontendApplicationContribution).toService(editor_contribution_1.EditorContribution);
    bind(editor_language_status_service_1.EditorLanguageStatusService).toSelf().inSingletonScope();
    bind(editor_linenumber_contribution_1.EditorLineNumberContribution).toSelf().inSingletonScope();
    bind(browser_1.FrontendApplicationContribution).toService(editor_linenumber_contribution_1.EditorLineNumberContribution);
    bind(editor_navigation_contribution_1.EditorNavigationContribution).toSelf().inSingletonScope();
    bind(browser_1.FrontendApplicationContribution).toService(editor_navigation_contribution_1.EditorNavigationContribution);
    bind(navigation_location_service_1.NavigationLocationService).toSelf().inSingletonScope();
    bind(navigation_location_updater_1.NavigationLocationUpdater).toSelf().inSingletonScope();
    bind(navigation_location_similarity_1.NavigationLocationSimilarity).toSelf().inSingletonScope();
    bind(browser_2.VariableContribution).to(editor_variable_contribution_1.EditorVariableContribution).inSingletonScope();
    [common_1.CommandContribution, browser_1.KeybindingContribution, common_1.MenuContribution].forEach(serviceIdentifier => {
        bind(serviceIdentifier).toService(editor_contribution_1.EditorContribution);
    });
    bind(quick_editor_service_1.QuickEditorService).toSelf().inSingletonScope();
    bind(quick_access_1.QuickAccessContribution).to(quick_editor_service_1.QuickEditorService);
    bind(editor_manager_1.CurrentEditorAccess).toSelf().inSingletonScope();
    bind(editor_manager_1.ActiveEditorAccess).toSelf().inSingletonScope();
    bind(editor_manager_1.EditorAccess).to(editor_manager_1.CurrentEditorAccess).inSingletonScope().whenTargetNamed(editor_manager_1.EditorAccess.CURRENT);
    bind(editor_manager_1.EditorAccess).to(editor_manager_1.ActiveEditorAccess).inSingletonScope().whenTargetNamed(editor_manager_1.EditorAccess.ACTIVE);
    bind(undo_redo_service_1.UndoRedoService).toSelf().inSingletonScope();
});

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/editor/lib/browser/editor-frontend-module'] = this;


/***/ }),

/***/ "../../packages/editor/lib/browser/editor-keybinding.js":
/*!**************************************************************!*\
  !*** ../../packages/editor/lib/browser/editor-keybinding.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EditorKeybindingContribution = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const environment_1 = __webpack_require__(/*! @theia/core/shared/@theia/application-package/lib/environment */ "../../packages/core/shared/@theia/application-package/lib/environment/index.js");
const os_1 = __webpack_require__(/*! @theia/core/lib/common/os */ "../../packages/core/lib/common/os.js");
const editor_command_1 = __webpack_require__(/*! ./editor-command */ "../../packages/editor/lib/browser/editor-command.js");
let EditorKeybindingContribution = class EditorKeybindingContribution {
    registerKeybindings(registry) {
        registry.registerKeybindings({
            command: editor_command_1.EditorCommands.GO_BACK.id,
            keybinding: os_1.isOSX ? 'ctrl+-' : os_1.isWindows ? 'alt+left' : /* isLinux */ 'ctrl+alt+-'
        }, {
            command: editor_command_1.EditorCommands.GO_FORWARD.id,
            keybinding: os_1.isOSX ? 'ctrl+shift+-' : os_1.isWindows ? 'alt+right' : /* isLinux */ 'ctrl+shift+-'
        }, {
            command: editor_command_1.EditorCommands.GO_LAST_EDIT.id,
            keybinding: 'ctrl+alt+q'
        }, {
            command: editor_command_1.EditorCommands.TOGGLE_WORD_WRAP.id,
            keybinding: 'alt+z'
        }, {
            command: editor_command_1.EditorCommands.REOPEN_CLOSED_EDITOR.id,
            keybinding: this.isElectron() ? 'ctrlcmd+shift+t' : 'alt+shift+t'
        });
    }
    isElectron() {
        return environment_1.environment.electron.is();
    }
};
EditorKeybindingContribution = __decorate([
    (0, inversify_1.injectable)()
], EditorKeybindingContribution);
exports.EditorKeybindingContribution = EditorKeybindingContribution;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/editor/lib/browser/editor-keybinding'] = this;


/***/ }),

/***/ "../../packages/editor/lib/browser/editor-linenumber-contribution.js":
/*!***************************************************************************!*\
  !*** ../../packages/editor/lib/browser/editor-linenumber-contribution.js ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EditorLineNumberContribution = exports.EDITOR_LINENUMBER_CONTEXT_MENU = void 0;
const editor_manager_1 = __webpack_require__(/*! ./editor-manager */ "../../packages/editor/lib/browser/editor-manager.js");
const editor_1 = __webpack_require__(/*! ./editor */ "../../packages/editor/lib/browser/editor.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const context_key_service_1 = __webpack_require__(/*! @theia/core/lib/browser/context-key-service */ "../../packages/core/lib/browser/context-key-service.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
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

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/editor/lib/browser/editor-linenumber-contribution'] = this;


/***/ }),

/***/ "../../packages/editor/lib/browser/editor-navigation-contribution.js":
/*!***************************************************************************!*\
  !*** ../../packages/editor/lib/browser/editor-navigation-contribution.js ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var EditorNavigationContribution_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EditorNavigationContribution = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const logger_1 = __webpack_require__(/*! @theia/core/lib/common/logger */ "../../packages/core/lib/common/logger.js");
const storage_service_1 = __webpack_require__(/*! @theia/core/lib/browser/storage-service */ "../../packages/core/lib/browser/storage-service.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
const command_1 = __webpack_require__(/*! @theia/core/lib/common/command */ "../../packages/core/lib/common/command.js");
const editor_command_1 = __webpack_require__(/*! ./editor-command */ "../../packages/editor/lib/browser/editor-command.js");
const editor_manager_1 = __webpack_require__(/*! ./editor-manager */ "../../packages/editor/lib/browser/editor-manager.js");
const navigation_location_1 = __webpack_require__(/*! ./navigation/navigation-location */ "../../packages/editor/lib/browser/navigation/navigation-location.js");
const navigation_location_service_1 = __webpack_require__(/*! ./navigation/navigation-location-service */ "../../packages/editor/lib/browser/navigation/navigation-location-service.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const dialogs_1 = __webpack_require__(/*! @theia/core/lib/browser/dialogs */ "../../packages/core/lib/browser/dialogs.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
let EditorNavigationContribution = EditorNavigationContribution_1 = class EditorNavigationContribution {
    constructor() {
        this.toDispose = new disposable_1.DisposableCollection();
        this.toDisposePerCurrentEditor = new disposable_1.DisposableCollection();
    }
    init() {
        this.toDispose.pushAll([
            // TODO listen on file resource changes, if a file gets deleted, remove the corresponding navigation locations (if any).
            // This would require introducing the FS dependency in the editor extension.
            this.editorManager.onCurrentEditorChanged(this.onCurrentEditorChanged.bind(this)),
            this.editorManager.onCreated(widget => {
                this.locationStack.removeClosedEditor(widget.editor.uri);
                widget.disposed.connect(() => this.locationStack.addClosedEditor({
                    uri: widget.editor.uri,
                    viewState: widget.editor.storeViewState()
                }));
            })
        ]);
        this.commandRegistry.registerHandler(editor_command_1.EditorCommands.GO_BACK.id, {
            execute: () => this.locationStack.back(),
            isEnabled: () => this.locationStack.canGoBack()
        });
        this.commandRegistry.registerHandler(editor_command_1.EditorCommands.GO_FORWARD.id, {
            execute: () => this.locationStack.forward(),
            isEnabled: () => this.locationStack.canGoForward()
        });
        this.commandRegistry.registerHandler(editor_command_1.EditorCommands.GO_LAST_EDIT.id, {
            execute: () => this.locationStack.reveal(this.locationStack.lastEditLocation()),
            isEnabled: () => !!this.locationStack.lastEditLocation()
        });
        this.commandRegistry.registerHandler(editor_command_1.EditorCommands.CLEAR_EDITOR_HISTORY.id, {
            execute: async () => {
                const shouldClear = await new dialogs_1.ConfirmDialog({
                    title: core_1.nls.localizeByDefault('Clear Editor History'),
                    msg: core_1.nls.localizeByDefault('Do you want to clear the history of recently opened editors?'),
                    ok: dialogs_1.Dialog.YES,
                    cancel: dialogs_1.Dialog.NO
                }).open();
                if (shouldClear) {
                    this.locationStack.clearHistory();
                }
            },
            isEnabled: () => this.locationStack.locations().length > 0
        });
        this.commandRegistry.registerHandler(editor_command_1.EditorCommands.TOGGLE_MINIMAP.id, {
            execute: () => this.toggleMinimap(),
            isEnabled: () => true,
            isToggled: () => this.isMinimapEnabled()
        });
        this.commandRegistry.registerHandler(editor_command_1.EditorCommands.TOGGLE_RENDER_WHITESPACE.id, {
            execute: () => this.toggleRenderWhitespace(),
            isEnabled: () => true,
            isToggled: () => this.isRenderWhitespaceEnabled()
        });
        this.commandRegistry.registerHandler(editor_command_1.EditorCommands.TOGGLE_WORD_WRAP.id, {
            execute: () => this.toggleWordWrap(),
            isEnabled: () => true,
        });
        this.commandRegistry.registerHandler(editor_command_1.EditorCommands.TOGGLE_STICKY_SCROLL.id, {
            execute: () => this.toggleStickyScroll(),
            isEnabled: () => true,
            isToggled: () => this.isStickyScrollEnabled()
        });
        this.commandRegistry.registerHandler(editor_command_1.EditorCommands.REOPEN_CLOSED_EDITOR.id, {
            execute: () => this.reopenLastClosedEditor()
        });
        this.installMouseNavigationSupport();
    }
    async installMouseNavigationSupport() {
        const mouseNavigationSupport = new disposable_1.DisposableCollection();
        const updateMouseNavigationListener = () => {
            mouseNavigationSupport.dispose();
            if (this.shouldNavigateWithMouse()) {
                mouseNavigationSupport.push((0, browser_1.addEventListener)(document.body, 'mousedown', event => this.onMouseDown(event), true));
            }
        };
        this.toDispose.push(this.preferenceService.onPreferenceChanged(change => {
            if (change.preferenceName === EditorNavigationContribution_1.MOUSE_NAVIGATION_PREFERENCE) {
                updateMouseNavigationListener();
            }
        }));
        updateMouseNavigationListener();
        this.toDispose.push(mouseNavigationSupport);
    }
    async onMouseDown(event) {
        // Support navigation in history when mouse buttons 4/5 are pressed
        switch (event.button) {
            case 3:
                event.preventDefault();
                this.locationStack.back();
                break;
            case 4:
                event.preventDefault();
                this.locationStack.forward();
                break;
        }
    }
    /**
     * Reopens the last closed editor with its stored view state if possible from history.
     * If the editor cannot be restored, continue to the next editor in history.
     */
    async reopenLastClosedEditor() {
        const lastClosedEditor = this.locationStack.getLastClosedEditor();
        if (lastClosedEditor === undefined) {
            return;
        }
        try {
            const widget = await this.editorManager.open(lastClosedEditor.uri);
            widget.editor.restoreViewState(lastClosedEditor.viewState);
        }
        catch {
            this.locationStack.removeClosedEditor(lastClosedEditor.uri);
            this.reopenLastClosedEditor();
        }
    }
    async onStart() {
        await this.restoreState();
    }
    onStop() {
        this.storeState();
        this.dispose();
    }
    dispose() {
        this.toDispose.dispose();
    }
    /**
     * Toggle the editor word wrap behavior.
     */
    async toggleWordWrap() {
        // Get the current word wrap.
        const wordWrap = this.preferenceService.get('editor.wordWrap');
        if (wordWrap === undefined) {
            return;
        }
        // The list of allowed word wrap values.
        const values = ['off', 'on', 'wordWrapColumn', 'bounded'];
        // Get the index of the current value, and toggle to the next available value.
        const index = values.indexOf(wordWrap) + 1;
        if (index > -1) {
            this.preferenceService.set('editor.wordWrap', values[index % values.length], browser_1.PreferenceScope.User);
        }
    }
    /**
     * Toggle the display of sticky scroll in the editor.
     */
    async toggleStickyScroll() {
        const value = this.preferenceService.get('editor.stickyScroll.enabled');
        this.preferenceService.set('editor.stickyScroll.enabled', !value, browser_1.PreferenceScope.User);
    }
    /**
     * Toggle the display of minimap in the editor.
     */
    async toggleMinimap() {
        const value = this.preferenceService.get('editor.minimap.enabled');
        this.preferenceService.set('editor.minimap.enabled', !value, browser_1.PreferenceScope.User);
    }
    /**
     * Toggle the rendering of whitespace in the editor.
     */
    async toggleRenderWhitespace() {
        const renderWhitespace = this.preferenceService.get('editor.renderWhitespace');
        let updatedRenderWhitespace;
        if (renderWhitespace === 'none') {
            updatedRenderWhitespace = 'all';
        }
        else {
            updatedRenderWhitespace = 'none';
        }
        this.preferenceService.set('editor.renderWhitespace', updatedRenderWhitespace, browser_1.PreferenceScope.User);
    }
    onCurrentEditorChanged(editorWidget) {
        this.toDisposePerCurrentEditor.dispose();
        if (editorWidget) {
            const { editor } = editorWidget;
            this.toDisposePerCurrentEditor.pushAll([
                // Instead of registering an `onCursorPositionChanged` listener, we treat the zero length selection as a cursor position change.
                // Otherwise we would have two events for a single cursor change interaction.
                editor.onSelectionChanged(selection => this.onSelectionChanged(editor, selection)),
                editor.onDocumentContentChanged(event => this.onDocumentContentChanged(editor, event))
            ]);
            this.locationStack.register(navigation_location_1.NavigationLocation.create(editor, editor.selection));
        }
    }
    onCursorPositionChanged(editor, position) {
        this.locationStack.register(navigation_location_1.NavigationLocation.create(editor, position));
    }
    onSelectionChanged(editor, selection) {
        if (this.isZeroLengthRange(selection)) {
            this.onCursorPositionChanged(editor, selection.start);
        }
        else {
            this.locationStack.register(navigation_location_1.NavigationLocation.create(editor, selection));
        }
    }
    onDocumentContentChanged(editor, event) {
        if (event.contentChanges.length > 0) {
            this.locationStack.register(navigation_location_1.NavigationLocation.create(editor, event.contentChanges[0]));
        }
    }
    /**
     * `true` if the `range` argument has zero length. In other words, the `start` and the `end` positions are the same. Otherwise, `false`.
     */
    isZeroLengthRange(range) {
        const { start, end } = range;
        return start.line === end.line && start.character === end.character;
    }
    async storeState() {
        this.storageService.setData(EditorNavigationContribution_1.ID, {
            locations: this.locationStack.locations().map(navigation_location_1.NavigationLocation.toObject)
        });
        this.storageService.setData(EditorNavigationContribution_1.CLOSED_EDITORS_KEY, {
            closedEditors: this.shouldStoreClosedEditors() ? this.locationStack.closedEditorsStack.map(navigation_location_1.RecentlyClosedEditor.toObject) : []
        });
    }
    async restoreState() {
        await this.restoreNavigationLocations();
        await this.restoreClosedEditors();
    }
    async restoreNavigationLocations() {
        const raw = await this.storageService.getData(EditorNavigationContribution_1.ID);
        if (raw && raw.locations) {
            const locations = [];
            for (let i = 0; i < raw.locations.length; i++) {
                const location = navigation_location_1.NavigationLocation.fromObject(raw.locations[i]);
                if (location) {
                    locations.push(location);
                }
                else {
                    this.logger.warn('Could not restore the state of the editor navigation history.');
                    return;
                }
            }
            this.locationStack.register(...locations);
        }
    }
    async restoreClosedEditors() {
        const raw = await this.storageService.getData(EditorNavigationContribution_1.CLOSED_EDITORS_KEY);
        if (raw && raw.closedEditors) {
            for (let i = 0; i < raw.closedEditors.length; i++) {
                const editor = navigation_location_1.RecentlyClosedEditor.fromObject(raw.closedEditors[i]);
                if (editor) {
                    this.locationStack.addClosedEditor(editor);
                }
                else {
                    this.logger.warn('Could not restore the state of the closed editors stack.');
                }
            }
        }
    }
    isMinimapEnabled() {
        return !!this.preferenceService.get('editor.minimap.enabled');
    }
    isRenderWhitespaceEnabled() {
        const renderWhitespace = this.preferenceService.get('editor.renderWhitespace');
        return renderWhitespace === 'none' ? false : true;
    }
    shouldStoreClosedEditors() {
        return !!this.preferenceService.get('editor.history.persistClosedEditors');
    }
    shouldNavigateWithMouse() {
        return !!this.preferenceService.get(EditorNavigationContribution_1.MOUSE_NAVIGATION_PREFERENCE);
    }
    isStickyScrollEnabled() {
        return !!this.preferenceService.get('editor.stickyScroll.enabled');
    }
};
EditorNavigationContribution.ID = 'editor-navigation-contribution';
EditorNavigationContribution.CLOSED_EDITORS_KEY = 'recently-closed-editors';
EditorNavigationContribution.MOUSE_NAVIGATION_PREFERENCE = 'workbench.editor.mouseBackForwardToNavigate';
__decorate([
    (0, inversify_1.inject)(logger_1.ILogger),
    __metadata("design:type", Object)
], EditorNavigationContribution.prototype, "logger", void 0);
__decorate([
    (0, inversify_1.inject)(editor_manager_1.EditorManager),
    __metadata("design:type", editor_manager_1.EditorManager)
], EditorNavigationContribution.prototype, "editorManager", void 0);
__decorate([
    (0, inversify_1.inject)(navigation_location_service_1.NavigationLocationService),
    __metadata("design:type", navigation_location_service_1.NavigationLocationService)
], EditorNavigationContribution.prototype, "locationStack", void 0);
__decorate([
    (0, inversify_1.inject)(storage_service_1.StorageService),
    __metadata("design:type", Object)
], EditorNavigationContribution.prototype, "storageService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.PreferenceService),
    __metadata("design:type", Object)
], EditorNavigationContribution.prototype, "preferenceService", void 0);
__decorate([
    (0, inversify_1.inject)(command_1.CommandRegistry),
    __metadata("design:type", command_1.CommandRegistry)
], EditorNavigationContribution.prototype, "commandRegistry", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EditorNavigationContribution.prototype, "init", null);
EditorNavigationContribution = EditorNavigationContribution_1 = __decorate([
    (0, inversify_1.injectable)()
], EditorNavigationContribution);
exports.EditorNavigationContribution = EditorNavigationContribution;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/editor/lib/browser/editor-navigation-contribution'] = this;


/***/ }),

/***/ "../../packages/editor/lib/browser/editor-variable-contribution.js":
/*!*************************************************************************!*\
  !*** ../../packages/editor/lib/browser/editor-variable-contribution.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2018 Red Hat, Inc. and others.
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
exports.EditorVariableContribution = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const editor_manager_1 = __webpack_require__(/*! ./editor-manager */ "../../packages/editor/lib/browser/editor-manager.js");
let EditorVariableContribution = class EditorVariableContribution {
    registerVariables(variables) {
        variables.registerVariable({
            name: 'lineNumber',
            description: 'The current line number in the currently opened file',
            resolve: () => {
                const editor = this.getCurrentEditor();
                return editor ? `${editor.cursor.line + 1}` : undefined;
            }
        });
        variables.registerVariable({
            name: 'selectedText',
            description: 'The current selected text in the active file',
            resolve: () => {
                const editor = this.getCurrentEditor();
                return editor ? editor.document.getText(editor.selection) : undefined;
            }
        });
    }
    getCurrentEditor() {
        const currentEditor = this.editorManager.currentEditor;
        if (!currentEditor) {
            return undefined;
        }
        return currentEditor.editor;
    }
};
__decorate([
    (0, inversify_1.inject)(editor_manager_1.EditorManager),
    __metadata("design:type", editor_manager_1.EditorManager)
], EditorVariableContribution.prototype, "editorManager", void 0);
EditorVariableContribution = __decorate([
    (0, inversify_1.injectable)()
], EditorVariableContribution);
exports.EditorVariableContribution = EditorVariableContribution;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/editor/lib/browser/editor-variable-contribution'] = this;


/***/ }),

/***/ "../../packages/editor/lib/browser/language-status/editor-language-status-service.js":
/*!*******************************************************************************************!*\
  !*** ../../packages/editor/lib/browser/language-status/editor-language-status-service.js ***!
  \*******************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2022 Ericsson and others.
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
var EditorLanguageStatusService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EditorLanguageStatusService = exports.LanguageStatusSeverity = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const language_service_1 = __webpack_require__(/*! @theia/core/lib/browser/language-service */ "../../packages/core/lib/browser/language-service.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const editor_command_1 = __webpack_require__(/*! ../editor-command */ "../../packages/editor/lib/browser/editor-command.js");
const language_selector_1 = __webpack_require__(/*! ../../common/language-selector */ "../../packages/editor/lib/common/language-selector.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const editor_manager_1 = __webpack_require__(/*! ../editor-manager */ "../../packages/editor/lib/browser/editor-manager.js");
const severity_1 = __webpack_require__(/*! @theia/core/lib/common/severity */ "../../packages/core/lib/common/severity.js");
const label_parser_1 = __webpack_require__(/*! @theia/core/lib/browser/label-parser */ "../../packages/core/lib/browser/label-parser.js");
/**
 * Represents the severity of a language status item.
 */
var LanguageStatusSeverity;
(function (LanguageStatusSeverity) {
    LanguageStatusSeverity[LanguageStatusSeverity["Information"] = 0] = "Information";
    LanguageStatusSeverity[LanguageStatusSeverity["Warning"] = 1] = "Warning";
    LanguageStatusSeverity[LanguageStatusSeverity["Error"] = 2] = "Error";
})(LanguageStatusSeverity = exports.LanguageStatusSeverity || (exports.LanguageStatusSeverity = {}));
let EditorLanguageStatusService = EditorLanguageStatusService_1 = class EditorLanguageStatusService {
    constructor() {
        this.status = new Map();
        this.pinnedCommands = new Set();
    }
    setLanguageStatusItem(handle, item) {
        this.status.set(handle, item);
        this.updateLanguageStatusItems();
    }
    removeLanguageStatusItem(handle) {
        this.status.delete(handle);
        this.updateLanguageStatusItems();
    }
    updateLanguageStatus(editor) {
        if (!editor) {
            this.statusBar.removeElement(EditorLanguageStatusService_1.LANGUAGE_MODE_ID);
            return;
        }
        const language = this.languages.getLanguage(editor.document.languageId);
        const languageName = language ? language.name : '';
        this.statusBar.setElement(EditorLanguageStatusService_1.LANGUAGE_MODE_ID, {
            text: languageName,
            alignment: browser_1.StatusBarAlignment.RIGHT,
            priority: 1,
            command: editor_command_1.EditorCommands.CHANGE_LANGUAGE.id,
            tooltip: core_1.nls.localizeByDefault('Select Language Mode')
        });
        this.updateLanguageStatusItems(editor);
    }
    updateLanguageStatusItems(editor = this.editorAccess.editor) {
        if (!editor) {
            this.statusBar.removeElement(EditorLanguageStatusService_1.LANGUAGE_STATUS_ID);
            this.updatePinnedItems();
            return;
        }
        const uri = new uri_1.default(editor.document.uri);
        const items = Array.from(this.status.values())
            .filter(item => (0, language_selector_1.score)(item.selector, uri.scheme, uri.path.toString(), editor.document.languageId, true))
            .sort((left, right) => right.severity - left.severity);
        if (!items.length) {
            this.statusBar.removeElement(EditorLanguageStatusService_1.LANGUAGE_STATUS_ID);
            return;
        }
        const severityText = items[0].severity === severity_1.Severity.Info
            ? '$(bracket)'
            : items[0].severity === severity_1.Severity.Warning
                ? '$(bracket-dot)'
                : '$(bracket-error)';
        this.statusBar.setElement(EditorLanguageStatusService_1.LANGUAGE_STATUS_ID, {
            text: severityText,
            alignment: browser_1.StatusBarAlignment.RIGHT,
            priority: 2,
            tooltip: this.createTooltip(items),
            affinity: { id: EditorLanguageStatusService_1.LANGUAGE_MODE_ID, alignment: browser_1.StatusBarAlignment.LEFT, compact: true },
        });
        this.updatePinnedItems(items);
    }
    updatePinnedItems(items) {
        const toRemoveFromStatusBar = new Set(this.pinnedCommands);
        items === null || items === void 0 ? void 0 : items.forEach(item => {
            if (toRemoveFromStatusBar.has(item.id)) {
                toRemoveFromStatusBar.delete(item.id);
                this.statusBar.setElement(item.id, this.toPinnedItem(item));
            }
        });
        toRemoveFromStatusBar.forEach(id => this.statusBar.removeElement(id));
    }
    toPinnedItem(item) {
        return {
            text: item.label,
            affinity: { id: EditorLanguageStatusService_1.LANGUAGE_MODE_ID, alignment: browser_1.StatusBarAlignment.RIGHT, compact: false },
            alignment: browser_1.StatusBarAlignment.RIGHT,
            onclick: item.command && (e => { var _a, _b; e.preventDefault(); this.commandRegistry.executeCommand(item.command.id, ...((_b = (_a = item.command) === null || _a === void 0 ? void 0 : _a.arguments) !== null && _b !== void 0 ? _b : [])); }),
        };
    }
    createTooltip(items) {
        var _a, _b;
        const hoverContainer = document.createElement('div');
        hoverContainer.classList.add('hover-row');
        for (const item of items) {
            const itemContainer = document.createElement('div');
            itemContainer.classList.add('hover-language-status');
            {
                const severityContainer = document.createElement('div');
                severityContainer.classList.add('severity', `sev${item.severity}`);
                severityContainer.classList.toggle('show', item.severity === severity_1.Severity.Error || item.severity === severity_1.Severity.Warning);
                {
                    const severityIcon = document.createElement('span');
                    severityIcon.className = this.getSeverityIconClasses(item.severity);
                    severityContainer.appendChild(severityIcon);
                }
                itemContainer.appendChild(severityContainer);
            }
            const textContainer = document.createElement('div');
            textContainer.className = 'element';
            const labelContainer = document.createElement('div');
            labelContainer.className = 'left';
            const label = document.createElement('span');
            label.classList.add('label');
            this.renderWithIcons(label, item.busy ? `$(sync~spin)\u00A0\u00A0${item.label}` : item.label);
            labelContainer.appendChild(label);
            const detail = document.createElement('span');
            detail.classList.add('detail');
            this.renderWithIcons(detail, item.detail);
            labelContainer.appendChild(detail);
            textContainer.appendChild(labelContainer);
            const commandContainer = document.createElement('div');
            commandContainer.classList.add('right');
            if (item.command) {
                const link = document.createElement('a');
                link.classList.add('language-status-link');
                link.href = new uri_1.default()
                    .withScheme('command')
                    .withPath(item.command.id)
                    .withQuery(item.command.arguments ? encodeURIComponent(JSON.stringify(item.command.arguments)) : '')
                    .toString(false);
                link.onclick = e => { var _a, _b; e.preventDefault(); this.commandRegistry.executeCommand(item.command.id, ...((_b = (_a = item.command) === null || _a === void 0 ? void 0 : _a.arguments) !== null && _b !== void 0 ? _b : [])); };
                link.textContent = (_a = item.command.title) !== null && _a !== void 0 ? _a : item.command.id;
                link.title = (_b = item.command.tooltip) !== null && _b !== void 0 ? _b : '';
                link.ariaRoleDescription = 'button';
                link.ariaDisabled = 'false';
                commandContainer.appendChild(link);
                const pinContainer = document.createElement('div');
                pinContainer.classList.add('language-status-action-bar');
                const pin = document.createElement('a');
                this.setPinProperties(pin, item.id);
                pin.onclick = e => { e.preventDefault(); this.togglePinned(item); this.setPinProperties(pin, item.id); };
                pinContainer.appendChild(pin);
                commandContainer.appendChild(pinContainer);
            }
            textContainer.appendChild(commandContainer);
            itemContainer.append(textContainer);
            hoverContainer.appendChild(itemContainer);
        }
        return hoverContainer;
    }
    setPinProperties(pin, id) {
        pin.className = this.pinnedCommands.has(id) ? (0, browser_1.codicon)('pinned', true) : (0, browser_1.codicon)('pin', true);
        pin.ariaRoleDescription = 'button';
        const pinText = this.pinnedCommands.has(id)
            ? core_1.nls.localizeByDefault('Remove from Status Bar')
            : core_1.nls.localizeByDefault('Add to Status Bar');
        pin.ariaLabel = pinText;
        pin.title = pinText;
    }
    togglePinned(item) {
        if (this.pinnedCommands.has(item.id)) {
            this.pinnedCommands.delete(item.id);
            this.statusBar.removeElement(item.id);
        }
        else {
            this.pinnedCommands.add(item.id);
            this.statusBar.setElement(item.id, this.toPinnedItem(item));
        }
    }
    getSeverityIconClasses(severity) {
        switch (severity) {
            case severity_1.Severity.Error: return (0, browser_1.codicon)('error');
            case severity_1.Severity.Warning: return (0, browser_1.codicon)('info');
            default: return (0, browser_1.codicon)('check');
        }
    }
    renderWithIcons(host, text) {
        if (text) {
            for (const chunk of this.labelParser.parse(text)) {
                if (typeof chunk === 'string') {
                    host.append(chunk);
                }
                else {
                    const iconSpan = document.createElement('span');
                    const className = (0, browser_1.codicon)(chunk.name) + (chunk.animation ? ` fa-${chunk.animation}` : '');
                    iconSpan.className = className;
                    host.append(iconSpan);
                }
            }
        }
    }
};
EditorLanguageStatusService.LANGUAGE_MODE_ID = 'editor-status-language';
EditorLanguageStatusService.LANGUAGE_STATUS_ID = 'editor-language-status-items';
__decorate([
    (0, inversify_1.inject)(browser_1.StatusBar),
    __metadata("design:type", Object)
], EditorLanguageStatusService.prototype, "statusBar", void 0);
__decorate([
    (0, inversify_1.inject)(language_service_1.LanguageService),
    __metadata("design:type", language_service_1.LanguageService)
], EditorLanguageStatusService.prototype, "languages", void 0);
__decorate([
    (0, inversify_1.inject)(editor_manager_1.CurrentEditorAccess),
    __metadata("design:type", editor_manager_1.CurrentEditorAccess)
], EditorLanguageStatusService.prototype, "editorAccess", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.CommandRegistry),
    __metadata("design:type", core_1.CommandRegistry)
], EditorLanguageStatusService.prototype, "commandRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(label_parser_1.LabelParser),
    __metadata("design:type", label_parser_1.LabelParser)
], EditorLanguageStatusService.prototype, "labelParser", void 0);
EditorLanguageStatusService = EditorLanguageStatusService_1 = __decorate([
    (0, inversify_1.injectable)()
], EditorLanguageStatusService);
exports.EditorLanguageStatusService = EditorLanguageStatusService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/editor/lib/browser/language-status/editor-language-status-service'] = this;


/***/ }),

/***/ "../../packages/editor/lib/browser/navigation/navigation-location-service.js":
/*!***********************************************************************************!*\
  !*** ../../packages/editor/lib/browser/navigation/navigation-location-service.js ***!
  \***********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var NavigationLocationService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NavigationLocationService = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const logger_1 = __webpack_require__(/*! @theia/core/lib/common/logger */ "../../packages/core/lib/common/logger.js");
const opener_service_1 = __webpack_require__(/*! @theia/core/lib/browser/opener-service */ "../../packages/core/lib/browser/opener-service.js");
const navigation_location_updater_1 = __webpack_require__(/*! ./navigation-location-updater */ "../../packages/editor/lib/browser/navigation/navigation-location-updater.js");
const navigation_location_similarity_1 = __webpack_require__(/*! ./navigation-location-similarity */ "../../packages/editor/lib/browser/navigation/navigation-location-similarity.js");
const navigation_location_1 = __webpack_require__(/*! ./navigation-location */ "../../packages/editor/lib/browser/navigation/navigation-location.js");
/**
 * The navigation location service.
 * It also stores and manages navigation locations and recently closed editors.
 */
let NavigationLocationService = NavigationLocationService_1 = class NavigationLocationService {
    constructor() {
        this.pointer = -1;
        this.stack = [];
        this.canRegister = true;
        this.recentlyClosedEditors = [];
    }
    /**
     * Registers the give locations into the service.
     */
    register(...locations) {
        if (this.canRegister) {
            const max = this.maxStackItems();
            [...locations].forEach(location => {
                if (navigation_location_1.ContentChangeLocation.is(location)) {
                    this._lastEditLocation = location;
                }
                const current = this.currentLocation();
                this.debug(`Registering new location: ${navigation_location_1.NavigationLocation.toString(location)}.`);
                if (!this.isSimilar(current, location)) {
                    this.debug('Before location registration.');
                    this.debug(this.stackDump);
                    // Just like in VSCode; if we are not at the end of stack, we remove anything after.
                    if (this.stack.length > this.pointer + 1) {
                        this.debug(`Discarding all locations after ${this.pointer}.`);
                        this.stack = this.stack.slice(0, this.pointer + 1);
                    }
                    this.stack.push(location);
                    this.pointer = this.stack.length - 1;
                    if (this.stack.length > max) {
                        this.debug('Trimming exceeding locations.');
                        this.stack.shift();
                        this.pointer--;
                    }
                    this.debug('Updating preceding navigation locations.');
                    for (let i = this.stack.length - 1; i >= 0; i--) {
                        const candidate = this.stack[i];
                        const update = this.updater.affects(candidate, location);
                        if (update === undefined) {
                            this.debug(`Erasing obsolete location: ${navigation_location_1.NavigationLocation.toString(candidate)}.`);
                            this.stack.splice(i, 1);
                            this.pointer--;
                        }
                        else if (typeof update !== 'boolean') {
                            this.debug(`Updating location at index: ${i} => ${navigation_location_1.NavigationLocation.toString(candidate)}.`);
                            this.stack[i] = update;
                        }
                    }
                    this.debug('After location registration.');
                    this.debug(this.stackDump);
                }
                else {
                    if (current) {
                        this.debug(`The new location ${navigation_location_1.NavigationLocation.toString(location)} is similar to the current one: ${navigation_location_1.NavigationLocation.toString(current)}. Aborting.`);
                    }
                }
            });
        }
    }
    /**
     * Navigates one back. Returns with the previous location, or `undefined` if it could not navigate back.
     */
    async back() {
        this.debug('Navigating back.');
        if (this.canGoBack()) {
            this.pointer--;
            await this.reveal();
            this.debug(this.stackDump);
            return this.currentLocation();
        }
        this.debug('Cannot navigate back.');
        return undefined;
    }
    /**
     * Navigates one forward. Returns with the next location, or `undefined` if it could not go forward.
     */
    async forward() {
        this.debug('Navigating forward.');
        if (this.canGoForward()) {
            this.pointer++;
            await this.reveal();
            this.debug(this.stackDump);
            return this.currentLocation();
        }
        this.debug('Cannot navigate forward.');
        return undefined;
    }
    /**
     * Checks whether the service can go [`back`](#back).
     */
    canGoBack() {
        return this.pointer >= 1;
    }
    /**
     * Checks whether the service can go [`forward`](#forward).
     */
    canGoForward() {
        return this.pointer >= 0 && this.pointer !== this.stack.length - 1;
    }
    /**
     * Returns with all known navigation locations in chronological order.
     */
    locations() {
        return this.stack;
    }
    /**
     * Returns with the current location.
     */
    currentLocation() {
        return this.stack[this.pointer];
    }
    /**
     * Returns with the location of the most recent edition if any. If there were no modifications,
     * returns `undefined`.
     */
    lastEditLocation() {
        return this._lastEditLocation;
    }
    /**
     * Clears the total history.
     */
    clearHistory() {
        this.stack = [];
        this.pointer = -1;
        this._lastEditLocation = undefined;
        this.recentlyClosedEditors = [];
    }
    /**
     * Reveals the location argument. If not given, reveals the `current location`. Does nothing, if the argument is `undefined`.
     */
    async reveal(location = this.currentLocation()) {
        if (location === undefined) {
            return;
        }
        try {
            this.canRegister = false;
            const { uri } = location;
            const options = this.toOpenerOptions(location);
            await (0, opener_service_1.open)(this.openerService, uri, options);
        }
        catch (e) {
            this.logger.error(`Error occurred while revealing location: ${navigation_location_1.NavigationLocation.toString(location)}.`, e);
        }
        finally {
            this.canRegister = true;
        }
    }
    /**
     * `true` if the two locations are similar.
     */
    isSimilar(left, right) {
        return this.similarity.similar(left, right);
    }
    /**
     * Returns with the number of navigation locations that the application can handle and manage.
     * When the number of locations exceeds this number, old locations will be erased.
     */
    maxStackItems() {
        return NavigationLocationService_1.MAX_STACK_ITEMS;
    }
    /**
     * Returns with the opener option for the location argument.
     */
    toOpenerOptions(location) {
        let { start } = navigation_location_1.NavigationLocation.range(location);
        // Here, the `start` and represents the previous state that has been updated with the `text`.
        // So we calculate the range by appending the `text` length to the `start`.
        if (navigation_location_1.ContentChangeLocation.is(location)) {
            start = { ...start, character: start.character + location.context.text.length };
        }
        return {
            selection: navigation_location_1.Range.create(start, start)
        };
    }
    async debug(message) {
        this.logger.trace(typeof message === 'string' ? message : message());
    }
    get stackDump() {
        return `----- Navigation location stack [${new Date()}] -----
Pointer: ${this.pointer}
${this.stack.map((location, i) => `${i}: ${JSON.stringify(navigation_location_1.NavigationLocation.toObject(location))}`).join('\n')}
----- o -----`;
    }
    /**
     * Get the recently closed editors stack in chronological order.
     *
     * @returns readonly closed editors stack.
     */
    get closedEditorsStack() {
        return this.recentlyClosedEditors;
    }
    /**
     * Get the last recently closed editor.
     *
     * @returns the recently closed editor if it exists.
     */
    getLastClosedEditor() {
        return this.recentlyClosedEditors[this.recentlyClosedEditors.length - 1];
    }
    /**
     * Add the recently closed editor to the history.
     *
     * @param editor the recently closed editor.
     */
    addClosedEditor(editor) {
        this.removeClosedEditor(editor.uri);
        this.recentlyClosedEditors.push(editor);
        // Removes the oldest entry from the history if the maximum size is reached.
        if (this.recentlyClosedEditors.length > NavigationLocationService_1.MAX_RECENTLY_CLOSED_EDITORS) {
            this.recentlyClosedEditors.shift();
        }
    }
    /**
     * Remove all occurrences of the given editor in the history if they exist.
     *
     * @param uri the uri of the editor that should be removed from the history.
     */
    removeClosedEditor(uri) {
        this.recentlyClosedEditors = this.recentlyClosedEditors.filter(e => !uri.isEqual(e.uri));
    }
};
NavigationLocationService.MAX_STACK_ITEMS = 30;
NavigationLocationService.MAX_RECENTLY_CLOSED_EDITORS = 20;
__decorate([
    (0, inversify_1.inject)(logger_1.ILogger),
    __metadata("design:type", Object)
], NavigationLocationService.prototype, "logger", void 0);
__decorate([
    (0, inversify_1.inject)(opener_service_1.OpenerService),
    __metadata("design:type", Object)
], NavigationLocationService.prototype, "openerService", void 0);
__decorate([
    (0, inversify_1.inject)(navigation_location_updater_1.NavigationLocationUpdater),
    __metadata("design:type", navigation_location_updater_1.NavigationLocationUpdater)
], NavigationLocationService.prototype, "updater", void 0);
__decorate([
    (0, inversify_1.inject)(navigation_location_similarity_1.NavigationLocationSimilarity),
    __metadata("design:type", navigation_location_similarity_1.NavigationLocationSimilarity)
], NavigationLocationService.prototype, "similarity", void 0);
NavigationLocationService = NavigationLocationService_1 = __decorate([
    (0, inversify_1.injectable)()
], NavigationLocationService);
exports.NavigationLocationService = NavigationLocationService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/editor/lib/browser/navigation/navigation-location-service'] = this;


/***/ }),

/***/ "../../packages/editor/lib/browser/navigation/navigation-location-similarity.js":
/*!**************************************************************************************!*\
  !*** ../../packages/editor/lib/browser/navigation/navigation-location-similarity.js ***!
  \**************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var NavigationLocationSimilarity_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NavigationLocationSimilarity = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const navigation_location_1 = __webpack_require__(/*! ./navigation-location */ "../../packages/editor/lib/browser/navigation/navigation-location.js");
/**
 * Service for checking whether two navigation locations are similar or not.
 */
let NavigationLocationSimilarity = NavigationLocationSimilarity_1 = class NavigationLocationSimilarity {
    /**
     * `true` if the `left` and `right` locations are withing +- 10 lines in the same editor. Otherwise, `false`.
     */
    similar(left, right) {
        if (left === undefined || right === undefined) {
            return left === right;
        }
        if (left.uri.toString() !== right.uri.toString()) {
            return false;
        }
        const leftRange = navigation_location_1.NavigationLocation.range(left);
        const rightRange = navigation_location_1.NavigationLocation.range(right);
        if (leftRange === undefined || rightRange === undefined) {
            return leftRange === rightRange;
        }
        const leftLineNumber = Math.min(leftRange.start.line, leftRange.end.line);
        const rightLineNumber = Math.min(rightRange.start.line, rightRange.end.line);
        return Math.abs(leftLineNumber - rightLineNumber) < this.getThreshold();
    }
    getThreshold() {
        return NavigationLocationSimilarity_1.EDITOR_SELECTION_THRESHOLD;
    }
};
/**
 * The number of lines to move in the editor to justify for new state.
 */
NavigationLocationSimilarity.EDITOR_SELECTION_THRESHOLD = 10;
NavigationLocationSimilarity = NavigationLocationSimilarity_1 = __decorate([
    (0, inversify_1.injectable)()
], NavigationLocationSimilarity);
exports.NavigationLocationSimilarity = NavigationLocationSimilarity;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/editor/lib/browser/navigation/navigation-location-similarity'] = this;


/***/ }),

/***/ "../../packages/editor/lib/browser/navigation/navigation-location-updater.js":
/*!***********************************************************************************!*\
  !*** ../../packages/editor/lib/browser/navigation/navigation-location-updater.js ***!
  \***********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NavigationLocationUpdater = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const navigation_location_1 = __webpack_require__(/*! ./navigation-location */ "../../packages/editor/lib/browser/navigation/navigation-location.js");
/**
 * A navigation location updater that is responsible for adapting editor navigation locations.
 *
 * 1. Inserting or deleting text before the position shifts the position accordingly.
 * 2. Inserting text at the position offset shifts the position accordingly.
 * 3. Inserting or deleting text strictly contained by the position shrinks or stretches the position.
 * 4. Inserting or deleting text after a position does not affect the position.
 * 5. Deleting text which strictly contains the position deletes the position.
 * Note that the position is not deleted if its only shrunken to length zero. To delete a position, the modification must delete from
 * strictly before to strictly after the position.
 * 6. Replacing text contained by the position shrinks or expands the position (but does not shift it), such that the final position
 * contains the original position and the replacing text.
 * 7. Replacing text overlapping the position in other ways is considered as a sequence of first deleting the replaced text and
 * afterwards inserting the new text. Thus, a position is shrunken and can then be shifted (if the replaced text overlaps the offset of the position).
 */
let NavigationLocationUpdater = class NavigationLocationUpdater {
    /**
     * Checks whether `candidateLocation` has to be updated when applying `other`.
     *  - `false` if the `other` does not affect the `candidateLocation`.
     *  - A `NavigationLocation` object if the `candidateLocation` has to be replaced with the return value.
     *  - `undefined` if the candidate has to be deleted.
     *
     * If the `otherLocation` is not a `ContentChangeLocation` or it does not contain any actual content changes, this method returns with `false`
     */
    affects(candidateLocation, otherLocation) {
        if (!navigation_location_1.ContentChangeLocation.is(otherLocation)) {
            return false;
        }
        if (candidateLocation.uri.toString() !== otherLocation.uri.toString()) {
            return false;
        }
        const candidate = navigation_location_1.NavigationLocation.range(candidateLocation);
        const other = navigation_location_1.NavigationLocation.range(otherLocation);
        if (candidate === undefined || other === undefined) {
            return false;
        }
        const { uri, type } = candidateLocation;
        const modification = otherLocation.context.text;
        const newLineCount = modification.split(/[\n\r]/g).length - 1;
        // Spec (1. and 2.)
        if (other.end.line < candidate.start.line
            || (other.end.line === candidate.start.line && other.end.character <= candidate.start.character)) {
            // Shortcut for the general case. The user is typing above the candidate range. Nothing to do.
            if (other.start.line === other.end.line && newLineCount === 0) {
                return false;
            }
            const lineDiff = other.start.line - other.end.line + newLineCount;
            let startCharacter = candidate.start.character;
            let endCharacter = candidate.end.character;
            if (other.start.line !== other.end.line) {
                startCharacter = other.start.character + (candidate.start.character - other.end.character) + (modification.length - (modification.lastIndexOf('\n') + 1));
                endCharacter = candidate.start.line === candidate.end.line
                    ? candidate.end.character + startCharacter - candidate.start.character
                    : candidate.end.character;
            }
            const context = this.handleBefore(candidateLocation, other, lineDiff, startCharacter, endCharacter);
            return {
                uri,
                type,
                context
            };
        }
        // Spec (3.,  5., and 6.)
        if (this.contained(other, candidate)) {
            const endLine = candidate.end.line - other.end.line + candidate.start.line + newLineCount;
            let endCharacter = candidate.end.character - (other.end.character - other.start.character) + modification.length;
            if (newLineCount > 0) {
                if (candidate.end.line === other.end.line) {
                    endCharacter = modification.length - (modification.lastIndexOf('\n') + 1) + (candidate.end.character - other.end.character);
                }
                else {
                    endCharacter = endCharacter - 1;
                }
            }
            const context = this.handleInside(candidateLocation, endLine, endCharacter);
            return {
                uri,
                type,
                context
            };
        }
        // Spec (5.)
        if (other.start.line === candidate.start.line && other.start.character === candidate.start.character
            && (other.end.line > candidate.end.line || (other.end.line === candidate.end.line && other.end.character > candidate.end.character))) {
            return undefined;
        }
        // Spec (4.)
        if (candidate.end.line < other.start.line
            || (candidate.end.line === other.start.line && candidate.end.character < other.end.character)) {
            return false;
        }
        return false;
    }
    handleInside(candidate, endLine, endCharacter) {
        if (navigation_location_1.CursorLocation.is(candidate)) {
            throw new Error('Modifications are not allowed inside a cursor location.');
        }
        const { start } = navigation_location_1.NavigationLocation.range(candidate);
        const range = {
            start,
            end: {
                line: endLine,
                character: endCharacter
            }
        };
        if (navigation_location_1.SelectionLocation.is(candidate)) {
            return range;
        }
        if (navigation_location_1.ContentChangeLocation.is(candidate)) {
            const { rangeLength, text } = candidate.context;
            return {
                range,
                rangeLength,
                text
            };
        }
        throw new Error(`Unexpected navigation location: ${navigation_location_1.NavigationLocation.toString(candidate)}.`);
    }
    handleBefore(candidate, modification, lineDiff, startCharacter, endCharacter) {
        let range = navigation_location_1.NavigationLocation.range(candidate);
        range = this.shiftLine(range, lineDiff);
        range = {
            start: {
                line: range.start.line,
                character: startCharacter
            },
            end: {
                line: range.end.line,
                character: endCharacter
            }
        };
        if (navigation_location_1.CursorLocation.is(candidate)) {
            return range.start;
        }
        if (navigation_location_1.SelectionLocation.is(candidate)) {
            return range;
        }
        if (navigation_location_1.ContentChangeLocation.is(candidate)) {
            const { rangeLength, text } = candidate.context;
            return {
                range,
                rangeLength,
                text
            };
        }
        throw new Error(`Unexpected navigation location: ${navigation_location_1.NavigationLocation.toString(candidate)}.`);
    }
    shiftLine(input, diff) {
        if (navigation_location_1.Position.is(input)) {
            const { line, character } = input;
            return {
                line: line + diff,
                character
            };
        }
        const { start, end } = input;
        return {
            start: this.shiftLine(start, diff),
            end: this.shiftLine(end, diff)
        };
    }
    /**
     * `true` if `subRange` is strictly contained in the `range`. Otherwise, `false`.
     */
    contained(subRange, range) {
        if (subRange.start.line > range.start.line && subRange.end.line < range.end.line) {
            return true;
        }
        if (subRange.start.line < range.start.line || subRange.end.line > range.end.line) {
            return false;
        }
        if (subRange.start.line === range.start.line && subRange.start.character < range.start.character) {
            return false;
        }
        if (subRange.end.line === range.end.line && subRange.end.character > range.end.character) {
            return false;
        }
        return true;
    }
};
NavigationLocationUpdater = __decorate([
    (0, inversify_1.injectable)()
], NavigationLocationUpdater);
exports.NavigationLocationUpdater = NavigationLocationUpdater;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/editor/lib/browser/navigation/navigation-location-updater'] = this;


/***/ }),

/***/ "../../packages/editor/lib/browser/navigation/navigation-location.js":
/*!***************************************************************************!*\
  !*** ../../packages/editor/lib/browser/navigation/navigation-location.js ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
exports.ContentChangeLocation = exports.SelectionLocation = exports.CursorLocation = exports.RecentlyClosedEditor = exports.NavigationLocation = exports.Range = exports.Position = void 0;
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const editor_1 = __webpack_require__(/*! ../editor */ "../../packages/editor/lib/browser/editor.js");
Object.defineProperty(exports, "Position", ({ enumerable: true, get: function () { return editor_1.Position; } }));
Object.defineProperty(exports, "Range", ({ enumerable: true, get: function () { return editor_1.Range; } }));
var NavigationLocation;
(function (NavigationLocation) {
    /**
     * The navigation location type.
     */
    let Type;
    (function (Type) {
        /**
         * Cursor position change type.
         */
        Type[Type["CURSOR"] = 0] = "CURSOR";
        /**
         * Text selection change type.
         */
        Type[Type["SELECTION"] = 1] = "SELECTION";
        /**
         * Content change type.
         */
        Type[Type["CONTENT_CHANGE"] = 2] = "CONTENT_CHANGE";
    })(Type = NavigationLocation.Type || (NavigationLocation.Type = {}));
    let Context;
    (function (Context) {
        /**
         * Returns with the type for the context.
         */
        function getType(context) {
            if (editor_1.Position.is(context)) {
                return Type.CURSOR;
            }
            if (editor_1.Range.is(context)) {
                return Type.SELECTION;
            }
            if (editor_1.TextDocumentContentChangeDelta.is(context)) {
                return Type.CONTENT_CHANGE;
            }
            throw new Error(`Unexpected context for type: ${context}.`);
        }
        Context.getType = getType;
    })(Context = NavigationLocation.Context || (NavigationLocation.Context = {}));
})(NavigationLocation = exports.NavigationLocation || (exports.NavigationLocation = {}));
(function (NavigationLocation) {
    /**
     * Transforms the location into an object that can be safely serialized.
     */
    function toObject(location) {
        const { uri, type } = location;
        const context = (() => {
            if (CursorLocation.is(location)) {
                return CursorLocation.toObject(location.context);
            }
            if (SelectionLocation.is(location)) {
                return SelectionLocation.toObject(location.context);
            }
            if (ContentChangeLocation.is(location)) {
                return ContentChangeLocation.toObject(location.context);
            }
        })();
        return {
            uri: uri.toString(),
            type,
            context
        };
    }
    NavigationLocation.toObject = toObject;
    /**
     * Returns with the navigation location object from its serialized counterpart.
     */
    function fromObject(object) {
        const { uri, type } = object;
        if (uri !== undefined && type !== undefined && object.context !== undefined) {
            const context = (() => {
                switch (type) {
                    case NavigationLocation.Type.CURSOR: return CursorLocation.fromObject(object.context);
                    case NavigationLocation.Type.SELECTION: return SelectionLocation.fromObject(object.context);
                    case NavigationLocation.Type.CONTENT_CHANGE: return ContentChangeLocation.fromObject(object.context);
                }
            })();
            if (context) {
                return {
                    uri: toUri(uri),
                    context,
                    type
                };
            }
        }
        return undefined;
    }
    NavigationLocation.fromObject = fromObject;
    /**
     * Returns with the context of the location as a `Range`.
     */
    function range(location) {
        if (CursorLocation.is(location)) {
            return editor_1.Range.create(location.context, location.context);
        }
        if (SelectionLocation.is(location)) {
            return location.context;
        }
        if (ContentChangeLocation.is(location)) {
            return location.context.range;
        }
        throw new Error(`Unexpected navigation location: ${location}.`);
    }
    NavigationLocation.range = range;
    /**
     * Creates a new navigation location object.
     */
    function create(uri, context) {
        const type = NavigationLocation.Context.getType(context);
        return {
            uri: toUri(uri),
            type,
            context
        };
    }
    NavigationLocation.create = create;
    /**
     * Returns with the human-consumable (JSON) string representation of the location argument.
     */
    function toString(location) {
        return JSON.stringify(toObject(location));
    }
    NavigationLocation.toString = toString;
})(NavigationLocation = exports.NavigationLocation || (exports.NavigationLocation = {}));
function toUri(arg) {
    if (arg instanceof uri_1.default) {
        return arg;
    }
    if (typeof arg === 'string') {
        return new uri_1.default(arg);
    }
    return arg.uri;
}
var RecentlyClosedEditor;
(function (RecentlyClosedEditor) {
    /**
     * Transform a RecentlyClosedEditor into an object for storing.
     *
     * @param closedEditor the editor needs to be transformed.
     */
    function toObject(closedEditor) {
        const { uri, viewState } = closedEditor;
        return {
            uri: uri.toString(),
            viewState: viewState
        };
    }
    RecentlyClosedEditor.toObject = toObject;
    /**
     * Transform the given object to a RecentlyClosedEditor object if possible.
     */
    function fromObject(object) {
        const { uri, viewState } = object;
        if (uri !== undefined && viewState !== undefined) {
            return {
                uri: toUri(uri),
                viewState: viewState
            };
        }
        return undefined;
    }
    RecentlyClosedEditor.fromObject = fromObject;
})(RecentlyClosedEditor = exports.RecentlyClosedEditor || (exports.RecentlyClosedEditor = {}));
var CursorLocation;
(function (CursorLocation) {
    /**
     * `true` if the argument is a cursor location. Otherwise, `false`.
     */
    function is(location) {
        return location.type === NavigationLocation.Type.CURSOR;
    }
    CursorLocation.is = is;
    /**
     * Returns with the serialized format of the position argument.
     */
    function toObject(context) {
        const { line, character } = context;
        return {
            line,
            character
        };
    }
    CursorLocation.toObject = toObject;
    /**
     * Returns with the position from its serializable counterpart, or `undefined`.
     */
    function fromObject(object) {
        if (object.line !== undefined && object.character !== undefined) {
            const { line, character } = object;
            return {
                line,
                character
            };
        }
        return undefined;
    }
    CursorLocation.fromObject = fromObject;
})(CursorLocation = exports.CursorLocation || (exports.CursorLocation = {}));
var SelectionLocation;
(function (SelectionLocation) {
    /**
     * `true` if the argument is a selection location.
     */
    function is(location) {
        return location.type === NavigationLocation.Type.SELECTION;
    }
    SelectionLocation.is = is;
    /**
     * Converts the range argument into a serializable object.
     */
    function toObject(context) {
        const { start, end } = context;
        return {
            start: CursorLocation.toObject(start),
            end: CursorLocation.toObject(end)
        };
    }
    SelectionLocation.toObject = toObject;
    /**
     * Creates a range object from its serializable counterpart. Returns with `undefined` if the argument cannot be converted into a range.
     */
    function fromObject(object) {
        if (!!object.start && !!object.end) {
            const start = CursorLocation.fromObject(object.start);
            const end = CursorLocation.fromObject(object.end);
            if (start && end) {
                return {
                    start,
                    end
                };
            }
        }
        return undefined;
    }
    SelectionLocation.fromObject = fromObject;
})(SelectionLocation = exports.SelectionLocation || (exports.SelectionLocation = {}));
var ContentChangeLocation;
(function (ContentChangeLocation) {
    /**
     * `true` if the argument is a content change location. Otherwise, `false`.
     */
    function is(location) {
        return location.type === NavigationLocation.Type.CONTENT_CHANGE;
    }
    ContentChangeLocation.is = is;
    /**
     * Returns with a serializable object representing the arguments.
     */
    function toObject(context) {
        return {
            range: SelectionLocation.toObject(context.range),
            rangeLength: context.rangeLength,
            text: context.text
        };
    }
    ContentChangeLocation.toObject = toObject;
    /**
     * Returns with a text document change delta for the argument. `undefined` if the argument cannot be mapped to a content change delta.
     */
    function fromObject(object) {
        if (!!object.range && object.rangeLength !== undefined && object.text !== undefined) {
            const range = SelectionLocation.fromObject(object.range);
            const rangeLength = object.rangeLength;
            const text = object.text;
            if (!!range) {
                return {
                    range,
                    rangeLength: rangeLength,
                    text: text
                };
            }
        }
        else {
            return undefined;
        }
    }
    ContentChangeLocation.fromObject = fromObject;
})(ContentChangeLocation = exports.ContentChangeLocation || (exports.ContentChangeLocation = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/editor/lib/browser/navigation/navigation-location'] = this;


/***/ }),

/***/ "../../packages/editor/lib/browser/quick-editor-service.js":
/*!*****************************************************************!*\
  !*** ../../packages/editor/lib/browser/quick-editor-service.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2021 SAP SE or an SAP affiliate company and others.
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
var QuickEditorService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QuickEditorService = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const label_provider_1 = __webpack_require__(/*! @theia/core/lib/browser/label-provider */ "../../packages/core/lib/browser/label-provider.js");
const quick_access_1 = __webpack_require__(/*! @theia/core/lib/browser/quick-input/quick-access */ "../../packages/core/lib/browser/quick-input/quick-access.js");
const quick_input_service_1 = __webpack_require__(/*! @theia/core/lib/browser/quick-input/quick-input-service */ "../../packages/core/lib/browser/quick-input/quick-input-service.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
let QuickEditorService = QuickEditorService_1 = class QuickEditorService {
    constructor() {
        this.groupLocalizations = [];
    }
    registerQuickAccessProvider() {
        this.quickAccessRegistry.registerQuickAccessProvider({
            getInstance: () => this,
            prefix: QuickEditorService_1.PREFIX,
            placeholder: '',
            helpEntries: [{ description: 'Show All Opened Editors', needsEditor: false }]
        });
    }
    getPicks(filter, token) {
        const editorItems = [];
        const hasUri = (widget) => Boolean(browser_1.NavigatableWidget.getUri(widget));
        const handleWidgets = (widgets, label) => {
            if (widgets.length) {
                editorItems.push({ type: 'separator', label });
            }
            editorItems.push(...widgets.map(widget => this.toItem(widget)));
        };
        const handleSplittableArea = (tabbars, labelPrefix) => {
            tabbars.forEach((tabbar, index) => {
                const editorsOnTabbar = tabbar.titles.reduce((widgets, title) => {
                    if (hasUri(title.owner)) {
                        widgets.push(title.owner);
                    }
                    return widgets;
                }, []);
                const label = tabbars.length > 1 ? `${labelPrefix} ${this.getGroupLocalization(index)}` : labelPrefix;
                handleWidgets(editorsOnTabbar, label);
            });
        };
        handleSplittableArea(this.shell.mainAreaTabBars, browser_1.ApplicationShell.areaLabels.main);
        handleSplittableArea(this.shell.bottomAreaTabBars, browser_1.ApplicationShell.areaLabels.bottom);
        for (const area of ['left', 'right']) {
            const editorsInArea = this.shell.getWidgets(area).filter(hasUri);
            handleWidgets(editorsInArea, browser_1.ApplicationShell.areaLabels[area]);
        }
        return (0, quick_input_service_1.filterItems)(editorItems.slice(), filter);
    }
    getGroupLocalization(index) {
        return this.groupLocalizations[index] || common_1.nls.localizeByDefault('Group {0}', index + 1);
    }
    toItem(widget) {
        const uri = browser_1.NavigatableWidget.getUri(widget);
        const icon = this.labelProvider.getIcon(uri);
        const iconClasses = icon === '' ? undefined : [icon + ' file-icon'];
        return {
            label: this.labelProvider.getName(uri),
            description: this.labelProvider.getDetails(uri),
            iconClasses,
            ariaLabel: uri.path.fsPath(),
            alwaysShow: true,
            execute: () => this.shell.activateWidget(widget.id),
        };
    }
};
QuickEditorService.PREFIX = 'edt ';
__decorate([
    (0, inversify_1.inject)(label_provider_1.LabelProvider),
    __metadata("design:type", label_provider_1.LabelProvider)
], QuickEditorService.prototype, "labelProvider", void 0);
__decorate([
    (0, inversify_1.inject)(quick_access_1.QuickAccessRegistry),
    __metadata("design:type", Object)
], QuickEditorService.prototype, "quickAccessRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.ApplicationShell),
    __metadata("design:type", browser_1.ApplicationShell)
], QuickEditorService.prototype, "shell", void 0);
QuickEditorService = QuickEditorService_1 = __decorate([
    (0, inversify_1.injectable)()
], QuickEditorService);
exports.QuickEditorService = QuickEditorService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/editor/lib/browser/quick-editor-service'] = this;


/***/ }),

/***/ "../../packages/editor/lib/browser/undo-redo-service.js":
/*!**************************************************************!*\
  !*** ../../packages/editor/lib/browser/undo-redo-service.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2021 SAP SE or an SAP affiliate company and others.
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
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// copied and modified from https://github.com/microsoft/vscode/blob/53eac52308c4611000a171cc7bf1214293473c78/src/vs/platform/undoRedo/common/undoRedoService.ts#
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ResourceEditStack = exports.UndoRedoService = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
let UndoRedoService = class UndoRedoService {
    constructor() {
        this.editStacks = new Map();
    }
    pushElement(resource, undo, redo) {
        let editStack;
        if (this.editStacks.has(resource.toString())) {
            editStack = this.editStacks.get(resource.toString());
        }
        else {
            editStack = new ResourceEditStack();
            this.editStacks.set(resource.toString(), editStack);
        }
        editStack.pushElement({ undo, redo });
    }
    removeElements(resource) {
        if (this.editStacks.has(resource.toString())) {
            this.editStacks.delete(resource.toString());
        }
    }
    undo(resource) {
        if (!this.editStacks.has(resource.toString())) {
            return;
        }
        const editStack = this.editStacks.get(resource.toString());
        const element = editStack.getClosestPastElement();
        if (!element) {
            return;
        }
        editStack.moveBackward(element);
        element.undo();
    }
    redo(resource) {
        if (!this.editStacks.has(resource.toString())) {
            return;
        }
        const editStack = this.editStacks.get(resource.toString());
        const element = editStack.getClosestFutureElement();
        if (!element) {
            return;
        }
        editStack.moveForward(element);
        element.redo();
    }
};
UndoRedoService = __decorate([
    (0, inversify_1.injectable)()
], UndoRedoService);
exports.UndoRedoService = UndoRedoService;
class ResourceEditStack {
    constructor() {
        this.past = [];
        this.future = [];
    }
    pushElement(element) {
        this.future = [];
        this.past.push(element);
    }
    getClosestPastElement() {
        if (this.past.length === 0) {
            return undefined;
        }
        return this.past[this.past.length - 1];
    }
    getClosestFutureElement() {
        if (this.future.length === 0) {
            return undefined;
        }
        return this.future[this.future.length - 1];
    }
    moveBackward(element) {
        this.past.pop();
        this.future.push(element);
    }
    moveForward(element) {
        this.future.pop();
        this.past.push(element);
    }
}
exports.ResourceEditStack = ResourceEditStack;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/editor/lib/browser/undo-redo-service'] = this;


/***/ }),

/***/ "../../packages/variable-resolver/lib/browser/index.js":
/*!*************************************************************!*\
  !*** ../../packages/variable-resolver/lib/browser/index.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2018 Red Hat, Inc. and others.
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./variable */ "../../packages/variable-resolver/lib/browser/variable.js"), exports);
__exportStar(__webpack_require__(/*! ./variable-quick-open-service */ "../../packages/variable-resolver/lib/browser/variable-quick-open-service.js"), exports);
__exportStar(__webpack_require__(/*! ./variable-resolver-service */ "../../packages/variable-resolver/lib/browser/variable-resolver-service.js"), exports);

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/variable-resolver/lib/browser'] = this;


/***/ }),

/***/ "../../node_modules/css-loader/dist/cjs.js!../../packages/editor/src/browser/language-status/editor-language-status.css":
/*!******************************************************************************************************************************!*\
  !*** ../../node_modules/css-loader/dist/cjs.js!../../packages/editor/src/browser/language-status/editor-language-status.css ***!
  \******************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "../../node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/api.js */ "../../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/********************************************************************************
 * Copyright (C) 2022 Ericsson and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0
 ********************************************************************************/

/* Copied from https://github.com/microsoft/vscode/blob/7d9b1c37f8e5ae3772782ba3b09d827eb3fdd833/src/vs/workbench/contrib/languageStatus/browser/media/languageStatus.css */

.hover-language-status {
  display: flex;
  padding: 4px 8px;
}

.hover-language-status:not(:last-child) {
  border-bottom: 1px solid var(--theia-notifications-border);
}

.hover-language-status > .severity {
  padding-right: 8px;
  flex: 1;
  margin: auto;
  display: none;
}

.hover-language-status > .severity.sev3 {
  color: var(--theia-notificationsErrorIcon-foreground);
}

.hover-language-status > .severity.sev2 {
  color: var(--theia-notificationsInfoIcon-foreground);
}

.hover-language-status > .severity.show {
  display: inherit;
}

.hover-language-status > .element {
  display: flex;
  justify-content: space-between;
  vertical-align: middle;
  flex-grow: 100;
}

.hover-language-status > .element > .left > .detail:not(:empty)::before {
  /* en-dash */
  content: "–";
  padding: 0 4px;
  opacity: 0.6;
}

.hover-language-status > .element > .left > .label:empty {
  display: none;
}

.hover-language-status > .element .left {
  margin: auto 0;
}

.hover-language-status > .element .right {
  margin: auto 0;
  display: flex;
}

.hover-language-status > .element .right:not(:empty) {
  padding-left: 16px;
}

.hover-language-status > .element .right .language-status-link {
  margin: auto 0;
  white-space: nowrap;

  /* ADDED STYLES - NOT FROM VSCODE */
  text-decoration: none;
}

/* ADDED STYLES - NOT FROM VSCODE */
.hover-language-status > .element .right .language-status-link:hover {
  color: var(--theia-textLink-foreground);
}

.hover-language-status
  > .element
  .right
  .language-status-action-bar:not(:first-child) {
  padding-left: 8px;
}

/* ADDED STYLES - NOT FROM VSCODE */
.hover-language-status > .element .right .language-status-action-bar a {
  color: var(--theia-editorHoverWidget-foreground);
}
`, "",{"version":3,"sources":["webpack://./../../packages/editor/src/browser/language-status/editor-language-status.css"],"names":[],"mappings":"AAAA;;;;;;;;;;;;;;iFAciF;;AAEjF,2KAA2K;;AAE3K;EACE,aAAa;EACb,gBAAgB;AAClB;;AAEA;EACE,0DAA0D;AAC5D;;AAEA;EACE,kBAAkB;EAClB,OAAO;EACP,YAAY;EACZ,aAAa;AACf;;AAEA;EACE,qDAAqD;AACvD;;AAEA;EACE,oDAAoD;AACtD;;AAEA;EACE,gBAAgB;AAClB;;AAEA;EACE,aAAa;EACb,8BAA8B;EAC9B,sBAAsB;EACtB,cAAc;AAChB;;AAEA;EACE,YAAY;EACZ,YAAY;EACZ,cAAc;EACd,YAAY;AACd;;AAEA;EACE,aAAa;AACf;;AAEA;EACE,cAAc;AAChB;;AAEA;EACE,cAAc;EACd,aAAa;AACf;;AAEA;EACE,kBAAkB;AACpB;;AAEA;EACE,cAAc;EACd,mBAAmB;;EAEnB,mCAAmC;EACnC,qBAAqB;AACvB;;AAEA,mCAAmC;AACnC;EACE,uCAAuC;AACzC;;AAEA;;;;EAIE,iBAAiB;AACnB;;AAEA,mCAAmC;AACnC;EACE,gDAAgD;AAClD","sourcesContent":["/********************************************************************************\n * Copyright (C) 2022 Ericsson and others.\n *\n * This program and the accompanying materials are made available under the\n * terms of the Eclipse Public License v. 2.0 which is available at\n * http://www.eclipse.org/legal/epl-2.0.\n *\n * This Source Code may also be made available under the following Secondary\n * Licenses when the conditions for such availability set forth in the Eclipse\n * Public License v. 2.0 are satisfied: GNU General Public License, version 2\n * with the GNU Classpath Exception which is available at\n * https://www.gnu.org/software/classpath/license.html.\n *\n * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0\n ********************************************************************************/\n\n/* Copied from https://github.com/microsoft/vscode/blob/7d9b1c37f8e5ae3772782ba3b09d827eb3fdd833/src/vs/workbench/contrib/languageStatus/browser/media/languageStatus.css */\n\n.hover-language-status {\n  display: flex;\n  padding: 4px 8px;\n}\n\n.hover-language-status:not(:last-child) {\n  border-bottom: 1px solid var(--theia-notifications-border);\n}\n\n.hover-language-status > .severity {\n  padding-right: 8px;\n  flex: 1;\n  margin: auto;\n  display: none;\n}\n\n.hover-language-status > .severity.sev3 {\n  color: var(--theia-notificationsErrorIcon-foreground);\n}\n\n.hover-language-status > .severity.sev2 {\n  color: var(--theia-notificationsInfoIcon-foreground);\n}\n\n.hover-language-status > .severity.show {\n  display: inherit;\n}\n\n.hover-language-status > .element {\n  display: flex;\n  justify-content: space-between;\n  vertical-align: middle;\n  flex-grow: 100;\n}\n\n.hover-language-status > .element > .left > .detail:not(:empty)::before {\n  /* en-dash */\n  content: \"–\";\n  padding: 0 4px;\n  opacity: 0.6;\n}\n\n.hover-language-status > .element > .left > .label:empty {\n  display: none;\n}\n\n.hover-language-status > .element .left {\n  margin: auto 0;\n}\n\n.hover-language-status > .element .right {\n  margin: auto 0;\n  display: flex;\n}\n\n.hover-language-status > .element .right:not(:empty) {\n  padding-left: 16px;\n}\n\n.hover-language-status > .element .right .language-status-link {\n  margin: auto 0;\n  white-space: nowrap;\n\n  /* ADDED STYLES - NOT FROM VSCODE */\n  text-decoration: none;\n}\n\n/* ADDED STYLES - NOT FROM VSCODE */\n.hover-language-status > .element .right .language-status-link:hover {\n  color: var(--theia-textLink-foreground);\n}\n\n.hover-language-status\n  > .element\n  .right\n  .language-status-action-bar:not(:first-child) {\n  padding-left: 8px;\n}\n\n/* ADDED STYLES - NOT FROM VSCODE */\n.hover-language-status > .element .right .language-status-action-bar a {\n  color: var(--theia-editorHoverWidget-foreground);\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../node_modules/css-loader/dist/cjs.js!../../packages/editor/src/browser/style/index.css":
/*!***************************************************************************************************!*\
  !*** ../../node_modules/css-loader/dist/cjs.js!../../packages/editor/src/browser/style/index.css ***!
  \***************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "../../node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/api.js */ "../../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/********************************************************************************
 * Copyright (C) 2020 TypeFox and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0
 ********************************************************************************/

.theia-editor {
  height: 100%;
}
`, "",{"version":3,"sources":["webpack://./../../packages/editor/src/browser/style/index.css"],"names":[],"mappings":"AAAA;;;;;;;;;;;;;;iFAciF;;AAEjF;EACE,YAAY;AACd","sourcesContent":["/********************************************************************************\n * Copyright (C) 2020 TypeFox and others.\n *\n * This program and the accompanying materials are made available under the\n * terms of the Eclipse Public License v. 2.0 which is available at\n * http://www.eclipse.org/legal/epl-2.0.\n *\n * This Source Code may also be made available under the following Secondary\n * Licenses when the conditions for such availability set forth in the Eclipse\n * Public License v. 2.0 are satisfied: GNU General Public License, version 2\n * with the GNU Classpath Exception which is available at\n * https://www.gnu.org/software/classpath/license.html.\n *\n * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0\n ********************************************************************************/\n\n.theia-editor {\n  height: 100%;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../packages/editor/src/browser/language-status/editor-language-status.css":
/*!************************************************************************************!*\
  !*** ../../packages/editor/src/browser/language-status/editor-language-status.css ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_editor_language_status_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/css-loader/dist/cjs.js!./editor-language-status.css */ "../../node_modules/css-loader/dist/cjs.js!../../packages/editor/src/browser/language-status/editor-language-status.css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_editor_language_status_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_editor_language_status_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "../../packages/editor/src/browser/style/index.css":
/*!*********************************************************!*\
  !*** ../../packages/editor/src/browser/style/index.css ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/css-loader/dist/cjs.js!./index.css */ "../../node_modules/css-loader/dist/cjs.js!../../packages/editor/src/browser/style/index.css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ })

}]);
//# sourceMappingURL=packages_editor_lib_browser_editor-frontend-module_js.js.map