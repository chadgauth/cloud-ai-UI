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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var MonacoEditorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonacoEditorService = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const uri_1 = require("@theia/core/lib/common/uri");
const browser_1 = require("@theia/core/lib/browser");
const browser_2 = require("@theia/editor/lib/browser");
const monaco_editor_1 = require("./monaco-editor");
const monaco_to_protocol_converter_1 = require("./monaco-to-protocol-converter");
const monaco_editor_model_1 = require("./monaco-editor-model");
const standaloneServices_1 = require("@theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices");
const standaloneTheme_1 = require("@theia/monaco-editor-core/esm/vs/editor/standalone/common/standaloneTheme");
const standaloneCodeEditorService_1 = require("@theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneCodeEditorService");
const standaloneCodeEditor_1 = require("@theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneCodeEditor");
const contextKeyService_1 = require("@theia/monaco-editor-core/esm/vs/platform/contextkey/browser/contextKeyService");
(0, inversify_1.decorate)((0, inversify_1.injectable)(), standaloneCodeEditorService_1.StandaloneCodeEditorService);
let MonacoEditorService = MonacoEditorService_1 = class MonacoEditorService extends standaloneCodeEditorService_1.StandaloneCodeEditorService {
    constructor(contextKeyService) {
        super(contextKeyService, standaloneServices_1.StandaloneServices.get(standaloneTheme_1.IStandaloneThemeService));
    }
    /**
     * Monaco active editor is either focused or last focused editor.
     */
    getActiveCodeEditor() {
        let editor = monaco_editor_1.MonacoEditor.getCurrent(this.editors);
        if (!editor && browser_2.CustomEditorWidget.is(this.shell.activeWidget)) {
            const model = this.shell.activeWidget.modelRef.object;
            if (model.editorTextModel instanceof monaco_editor_model_1.MonacoEditorModel) {
                editor = monaco_editor_1.MonacoEditor.findByDocument(this.editors, model.editorTextModel)[0];
            }
        }
        const candidate = editor === null || editor === void 0 ? void 0 : editor.getControl();
        // Since we extend a private super class, we have to check that the thing that matches the public interface also matches the private expectations the superclass.
        /* eslint-disable-next-line no-null/no-null */
        return candidate instanceof standaloneCodeEditor_1.StandaloneCodeEditor ? candidate : null;
    }
    async openCodeEditor(input, source, sideBySide) {
        const uri = new uri_1.default(input.resource.toString());
        const openerOptions = this.createEditorOpenerOptions(input, source, sideBySide);
        const widget = await (0, browser_1.open)(this.openerService, uri, openerOptions);
        const editorWidget = await this.findEditorWidgetByUri(widget, uri.toString());
        if (editorWidget && editorWidget.editor instanceof monaco_editor_1.MonacoEditor) {
            const candidate = editorWidget.editor.getControl();
            // Since we extend a private super class, we have to check that the thing that matches the public interface also matches the private expectations the superclass.
            // eslint-disable-next-line no-null/no-null
            return candidate instanceof standaloneCodeEditor_1.StandaloneCodeEditor ? candidate : null;
        }
        // eslint-disable-next-line no-null/no-null
        return null;
    }
    async findEditorWidgetByUri(widget, uriAsString) {
        if (widget instanceof browser_2.EditorWidget) {
            if (widget.editor.uri.toString() === uriAsString) {
                return widget;
            }
            return undefined;
        }
        if (browser_1.ApplicationShell.TrackableWidgetProvider.is(widget)) {
            for (const childWidget of widget.getTrackableWidgets()) {
                const editorWidget = await this.findEditorWidgetByUri(childWidget, uriAsString);
                if (editorWidget) {
                    return editorWidget;
                }
            }
        }
        return undefined;
    }
    createEditorOpenerOptions(input, source, sideBySide) {
        const mode = this.getEditorOpenMode(input);
        const widgetOptions = this.getWidgetOptions(source, sideBySide);
        const selection = this.getSelection(input);
        const preview = !!this.preferencesService.get(MonacoEditorService_1.ENABLE_PREVIEW_PREFERENCE, false);
        return { mode, widgetOptions, preview, selection };
    }
    getSelection(input) {
        if ('options' in input && input.options && 'selection' in input.options) {
            return this.m2p.asRange(input.options.selection);
        }
    }
    getEditorOpenMode(input) {
        const options = {
            preserveFocus: false,
            revealIfVisible: true,
            ...input.options
        };
        if (options.preserveFocus) {
            return 'reveal';
        }
        return options.revealIfVisible ? 'activate' : 'open';
    }
    getWidgetOptions(source, sideBySide) {
        const ref = monaco_editor_1.MonacoEditor.getWidgetFor(this.editors, source);
        if (!ref) {
            return undefined;
        }
        const area = (ref && this.shell.getAreaFor(ref)) || 'main';
        const mode = ref && sideBySide ? 'split-right' : undefined;
        return { area, mode, ref };
    }
};
MonacoEditorService.ENABLE_PREVIEW_PREFERENCE = 'editor.enablePreview';
__decorate([
    (0, inversify_1.inject)(browser_1.OpenerService),
    __metadata("design:type", Object)
], MonacoEditorService.prototype, "openerService", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_to_protocol_converter_1.MonacoToProtocolConverter),
    __metadata("design:type", monaco_to_protocol_converter_1.MonacoToProtocolConverter)
], MonacoEditorService.prototype, "m2p", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.ApplicationShell),
    __metadata("design:type", browser_1.ApplicationShell)
], MonacoEditorService.prototype, "shell", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.EditorManager),
    __metadata("design:type", browser_2.EditorManager)
], MonacoEditorService.prototype, "editors", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.PreferenceService),
    __metadata("design:type", Object)
], MonacoEditorService.prototype, "preferencesService", void 0);
MonacoEditorService = MonacoEditorService_1 = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(contextKeyService_1.ContextKeyService)),
    __metadata("design:paramtypes", [contextKeyService_1.ContextKeyService])
], MonacoEditorService);
exports.MonacoEditorService = MonacoEditorService;
//# sourceMappingURL=monaco-editor-service.js.map