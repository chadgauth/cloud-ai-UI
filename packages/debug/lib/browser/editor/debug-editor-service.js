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
exports.DebugEditorService = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const monaco = require("@theia/monaco-editor-core");
const browser_1 = require("@theia/editor/lib/browser");
const browser_2 = require("@theia/core/lib/browser");
const monaco_editor_1 = require("@theia/monaco/lib/browser/monaco-editor");
const debug_session_manager_1 = require("../debug-session-manager");
const debug_editor_model_1 = require("./debug-editor-model");
const breakpoint_manager_1 = require("../breakpoint/breakpoint-manager");
let DebugEditorService = class DebugEditorService {
    constructor() {
        this.models = new Map();
    }
    init() {
        this.editors.all.forEach(widget => this.push(widget));
        this.editors.onCreated(widget => this.push(widget));
    }
    push(widget) {
        const { editor } = widget;
        if (!(editor instanceof monaco_editor_1.MonacoEditor)) {
            return;
        }
        const uri = editor.getControl().getModel().uri.toString();
        const debugModel = this.factory(editor);
        this.models.set(uri, debugModel);
        editor.getControl().onDidDispose(() => {
            debugModel.dispose();
            this.models.delete(uri);
        });
    }
    get model() {
        const { currentEditor } = this.editors;
        const uri = currentEditor && currentEditor.getResourceUri();
        return uri && this.models.get(uri.toString());
    }
    getLogpoint(position) {
        const logpoint = this.anyBreakpoint(position);
        return logpoint && logpoint.logMessage ? logpoint : undefined;
    }
    getLogpointEnabled(position) {
        const logpoint = this.getLogpoint(position);
        return logpoint && logpoint.enabled;
    }
    getBreakpoint(position) {
        const breakpoint = this.anyBreakpoint(position);
        return breakpoint && breakpoint.logMessage ? undefined : breakpoint;
    }
    getBreakpointEnabled(position) {
        const breakpoint = this.getBreakpoint(position);
        return breakpoint && breakpoint.enabled;
    }
    anyBreakpoint(position) {
        return this.model && this.model.getBreakpoint(position);
    }
    getInlineBreakpoint(position) {
        return this.model && this.model.getInlineBreakpoint(position);
    }
    toggleBreakpoint(position) {
        const { model } = this;
        if (model) {
            model.toggleBreakpoint(position);
        }
    }
    setBreakpointEnabled(position, enabled) {
        const breakpoint = this.anyBreakpoint(position);
        if (breakpoint) {
            breakpoint.setEnabled(enabled);
        }
    }
    addInlineBreakpoint() {
        const { model } = this;
        if (model) {
            model.addInlineBreakpoint();
        }
    }
    showHover() {
        const { model } = this;
        if (model) {
            const selection = model.editor.getControl().getSelection();
            model.hover.show({ selection, focus: true });
        }
    }
    canShowHover() {
        const { model } = this;
        if (model) {
            const selection = model.editor.getControl().getSelection();
            return !!model.editor.getControl().getModel().getWordAtPosition(selection.getStartPosition());
        }
        return false;
    }
    addBreakpoint(context, position) {
        const { model } = this;
        if (model) {
            position = position || model.position;
            const breakpoint = model.getBreakpoint(position);
            if (breakpoint) {
                model.breakpointWidget.show({ breakpoint, context });
            }
            else {
                model.breakpointWidget.show({
                    position,
                    context
                });
            }
        }
    }
    async editBreakpoint(breakpointOrPosition) {
        if (breakpointOrPosition instanceof monaco.Position) {
            breakpointOrPosition = this.anyBreakpoint(breakpointOrPosition);
        }
        if (breakpointOrPosition) {
            await breakpointOrPosition.open();
            const model = this.models.get(breakpointOrPosition.uri.toString());
            if (model) {
                model.breakpointWidget.show(breakpointOrPosition);
            }
        }
    }
    closeBreakpoint() {
        const { model } = this;
        if (model) {
            model.breakpointWidget.hide();
        }
    }
    acceptBreakpoint() {
        const { model } = this;
        if (model) {
            model.acceptBreakpoint();
        }
    }
    closeBreakpointIfAffected({ uri, removed }) {
        const model = this.models.get(uri.toString());
        if (!model) {
            return;
        }
        const position = model.breakpointWidget.position;
        if (!position) {
            return;
        }
        for (const breakpoint of removed) {
            if (breakpoint.raw.line === position.lineNumber) {
                model.breakpointWidget.hide();
            }
        }
    }
};
__decorate([
    (0, inversify_1.inject)(browser_1.EditorManager),
    __metadata("design:type", browser_1.EditorManager)
], DebugEditorService.prototype, "editors", void 0);
__decorate([
    (0, inversify_1.inject)(breakpoint_manager_1.BreakpointManager),
    __metadata("design:type", breakpoint_manager_1.BreakpointManager)
], DebugEditorService.prototype, "breakpoints", void 0);
__decorate([
    (0, inversify_1.inject)(debug_session_manager_1.DebugSessionManager),
    __metadata("design:type", debug_session_manager_1.DebugSessionManager)
], DebugEditorService.prototype, "sessionManager", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.ContextMenuRenderer),
    __metadata("design:type", browser_2.ContextMenuRenderer)
], DebugEditorService.prototype, "contextMenu", void 0);
__decorate([
    (0, inversify_1.inject)(debug_editor_model_1.DebugEditorModelFactory),
    __metadata("design:type", Function)
], DebugEditorService.prototype, "factory", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DebugEditorService.prototype, "init", null);
DebugEditorService = __decorate([
    (0, inversify_1.injectable)()
], DebugEditorService);
exports.DebugEditorService = DebugEditorService;
//# sourceMappingURL=debug-editor-service.js.map