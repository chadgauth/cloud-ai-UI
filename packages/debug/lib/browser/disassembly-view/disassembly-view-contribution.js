"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindDisassemblyView = exports.DisassemblyViewContribution = exports.DISASSEMBLY_VIEW_FOCUS = exports.DISASSEMBLE_REQUEST_SUPPORTED = exports.FOCUSED_STACK_FRAME_HAS_INSTRUCTION_REFERENCE = exports.LANGUAGE_SUPPORTS_DISASSEMBLE_REQUEST = exports.OPEN_DISASSEMBLY_VIEW_COMMAND = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/core/lib/browser");
const disassembly_view_widget_1 = require("./disassembly-view-widget");
const core_1 = require("@theia/core");
const debug_service_1 = require("../../common/debug-service");
const browser_2 = require("@theia/editor/lib/browser");
const context_key_service_1 = require("@theia/core/lib/browser/context-key-service");
const debug_session_manager_1 = require("../debug-session-manager");
const debug_session_1 = require("../debug-session");
const debug_stack_frames_widget_1 = require("../view/debug-stack-frames-widget");
exports.OPEN_DISASSEMBLY_VIEW_COMMAND = {
    id: 'open-disassembly-view',
    label: core_1.nls.localizeByDefault('Open Disassembly View')
};
exports.LANGUAGE_SUPPORTS_DISASSEMBLE_REQUEST = 'languageSupportsDisassembleRequest';
exports.FOCUSED_STACK_FRAME_HAS_INSTRUCTION_REFERENCE = 'focusedStackFrameHasInstructionReference';
exports.DISASSEMBLE_REQUEST_SUPPORTED = 'disassembleRequestSupported';
exports.DISASSEMBLY_VIEW_FOCUS = 'disassemblyViewFocus';
let DisassemblyViewContribution = class DisassemblyViewContribution extends browser_1.AbstractViewContribution {
    constructor() {
        super({
            widgetId: disassembly_view_widget_1.DisassemblyViewWidget.ID,
            widgetName: 'Disassembly View',
            defaultWidgetOptions: { area: 'main' }
        });
    }
    init() {
        var _a, _b;
        let activeEditorChangeCancellation = { cancelled: false };
        const updateLanguageSupportsDisassemblyKey = async () => {
            const editor = this.editorManager.currentEditor;
            activeEditorChangeCancellation.cancelled = true;
            const localCancellation = activeEditorChangeCancellation = { cancelled: false };
            const language = editor === null || editor === void 0 ? void 0 : editor.editor.document.languageId;
            const debuggersForLanguage = language && await this.debugService.getDebuggersForLanguage(language);
            if (!localCancellation.cancelled) {
                this.contextKeyService.setContext(exports.LANGUAGE_SUPPORTS_DISASSEMBLE_REQUEST, Boolean(debuggersForLanguage === null || debuggersForLanguage === void 0 ? void 0 : debuggersForLanguage.length));
            }
        };
        this.editorManager.onCurrentEditorChanged(updateLanguageSupportsDisassemblyKey);
        (_b = (_a = this.debugService).onDidChangeDebuggers) === null || _b === void 0 ? void 0 : _b.call(_a, updateLanguageSupportsDisassemblyKey);
        let lastSession;
        let lastFrame;
        this.debugSessionManager.onDidChange(() => {
            const { currentFrame, currentSession } = this.debugSessionManager;
            if (currentFrame !== lastFrame) {
                lastFrame = currentFrame;
                this.contextKeyService.setContext(exports.FOCUSED_STACK_FRAME_HAS_INSTRUCTION_REFERENCE, Boolean(currentFrame === null || currentFrame === void 0 ? void 0 : currentFrame.raw.instructionPointerReference));
            }
            if (currentSession !== lastSession) {
                lastSession = currentSession;
                this.contextKeyService.setContext(exports.DISASSEMBLE_REQUEST_SUPPORTED, Boolean(currentSession === null || currentSession === void 0 ? void 0 : currentSession.capabilities.supportsDisassembleRequest));
            }
        });
        this.shell.onDidChangeCurrentWidget(widget => {
            this.contextKeyService.setContext(exports.DISASSEMBLY_VIEW_FOCUS, widget instanceof disassembly_view_widget_1.DisassemblyViewWidget);
        });
    }
    registerCommands(commands) {
        commands.registerCommand(exports.OPEN_DISASSEMBLY_VIEW_COMMAND, {
            isEnabled: () => this.debugSessionManager.inDebugMode
                && this.debugSessionManager.state === debug_session_1.DebugState.Stopped
                && this.contextKeyService.match('focusedStackFrameHasInstructionReference'),
            execute: () => this.openView({ activate: true }),
        });
    }
    registerMenus(menus) {
        menus.registerMenuAction(debug_stack_frames_widget_1.DebugStackFramesWidget.CONTEXT_MENU, { commandId: exports.OPEN_DISASSEMBLY_VIEW_COMMAND.id, label: exports.OPEN_DISASSEMBLY_VIEW_COMMAND.label });
        menus.registerMenuAction([...browser_2.EDITOR_CONTEXT_MENU, 'a_debug'], { commandId: exports.OPEN_DISASSEMBLY_VIEW_COMMAND.id, label: exports.OPEN_DISASSEMBLY_VIEW_COMMAND.label, when: exports.LANGUAGE_SUPPORTS_DISASSEMBLE_REQUEST });
    }
};
__decorate([
    (0, inversify_1.inject)(debug_service_1.DebugService),
    __metadata("design:type", Object)
], DisassemblyViewContribution.prototype, "debugService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.EditorManager),
    __metadata("design:type", browser_2.EditorManager)
], DisassemblyViewContribution.prototype, "editorManager", void 0);
__decorate([
    (0, inversify_1.inject)(context_key_service_1.ContextKeyService),
    __metadata("design:type", Object)
], DisassemblyViewContribution.prototype, "contextKeyService", void 0);
__decorate([
    (0, inversify_1.inject)(debug_session_manager_1.DebugSessionManager),
    __metadata("design:type", debug_session_manager_1.DebugSessionManager)
], DisassemblyViewContribution.prototype, "debugSessionManager", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DisassemblyViewContribution.prototype, "init", null);
DisassemblyViewContribution = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], DisassemblyViewContribution);
exports.DisassemblyViewContribution = DisassemblyViewContribution;
function bindDisassemblyView(bind) {
    bind(disassembly_view_widget_1.DisassemblyViewWidget).toSelf();
    bind(browser_1.WidgetFactory).toDynamicValue(({ container }) => ({ id: disassembly_view_widget_1.DisassemblyViewWidget.ID, createWidget: () => container.get(disassembly_view_widget_1.DisassemblyViewWidget) }));
    (0, browser_1.bindViewContribution)(bind, DisassemblyViewContribution);
}
exports.bindDisassemblyView = bindDisassemblyView;
//# sourceMappingURL=disassembly-view-contribution.js.map