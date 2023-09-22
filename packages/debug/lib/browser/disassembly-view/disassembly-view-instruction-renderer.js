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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUriFromSource = exports.InstructionRenderer = void 0;
const browser_1 = require("@theia/core/lib/browser");
const uri_1 = require("@theia/core/lib/common/uri");
const monaco_editor_core_1 = require("@theia/monaco-editor-core");
const dom_1 = require("@theia/monaco-editor-core/esm/vs/base/browser/dom");
const lifecycle_1 = require("@theia/monaco-editor-core/esm/vs/base/common/lifecycle");
const path_1 = require("@theia/monaco-editor-core/esm/vs/base/common/path");
const domFontInfo_1 = require("@theia/monaco-editor-core/esm/vs/editor/browser/config/domFontInfo");
const stringBuilder_1 = require("@theia/monaco-editor-core/esm/vs/editor/common/core/stringBuilder");
const resolverService_1 = require("@theia/monaco-editor-core/esm/vs/editor/common/services/resolverService");
const themeService_1 = require("@theia/monaco-editor-core/esm/vs/platform/theme/common/themeService");
const debug_source_1 = require("../model/debug-source");
// This file is adapted from https://github.com/microsoft/vscode/blob/c061ce5c24fc480342fbc5f23244289d633c56eb/src/vs/workbench/contrib/debug/browser/disassemblyView.ts
const topStackFrameColor = 'editor.stackFrameHighlightBackground';
const focusedStackFrameColor = 'editor.focusedStackFrameHighlightBackground';
let InstructionRenderer = class InstructionRenderer extends lifecycle_1.Disposable {
    constructor(_disassemblyView, openerService, uriService, themeService, textModelService) {
        super();
        this._disassemblyView = _disassemblyView;
        this.openerService = openerService;
        this.uriService = uriService;
        this.textModelService = textModelService;
        this.templateId = InstructionRenderer.TEMPLATE_ID;
        this._topStackFrameColor = themeService.getColorTheme().getColor(topStackFrameColor);
        this._focusedStackFrameColor = themeService.getColorTheme().getColor(focusedStackFrameColor);
        this._register(themeService.onDidColorThemeChange(e => {
            this._topStackFrameColor = e.getColor(topStackFrameColor);
            this._focusedStackFrameColor = e.getColor(focusedStackFrameColor);
        }));
    }
    renderTemplate(container) {
        const sourcecode = (0, dom_1.append)(container, (0, dom_1.$)('.sourcecode'));
        const instruction = (0, dom_1.append)(container, (0, dom_1.$)('.instruction'));
        this.applyFontInfo(sourcecode);
        this.applyFontInfo(instruction);
        const currentElement = { element: undefined };
        const cellDisposable = [];
        const disposables = [
            this._disassemblyView.onDidChangeStackFrame(() => this.rerenderBackground(instruction, sourcecode, currentElement.element)),
            (0, dom_1.addStandardDisposableListener)(sourcecode, 'dblclick', () => { var _a; return this.openSourceCode((_a = currentElement.element) === null || _a === void 0 ? void 0 : _a.instruction); }),
        ];
        return { currentElement, instruction, sourcecode, cellDisposable, disposables };
    }
    renderElement(element, index, templateData, height) {
        this.renderElementInner(element, index, templateData, height);
    }
    async renderElementInner(element, index, column, height) {
        var _a;
        column.currentElement.element = element;
        const instruction = element.instruction;
        column.sourcecode.innerText = '';
        const sb = new stringBuilder_1.StringBuilder(1000);
        if (this._disassemblyView.isSourceCodeRender && ((_a = instruction.location) === null || _a === void 0 ? void 0 : _a.path) && instruction.line) {
            const sourceURI = this.getUriFromSource(instruction);
            if (sourceURI) {
                let textModel = undefined;
                const sourceSB = new stringBuilder_1.StringBuilder(10000);
                const ref = await this.textModelService.createModelReference(sourceURI);
                textModel = ref.object.textEditorModel;
                column.cellDisposable.push(ref);
                // templateData could have moved on during async.  Double check if it is still the same source.
                if (textModel && column.currentElement.element === element) {
                    let lineNumber = instruction.line;
                    while (lineNumber && lineNumber >= 1 && lineNumber <= textModel.getLineCount()) {
                        const lineContent = textModel.getLineContent(lineNumber);
                        sourceSB.appendASCIIString(`  ${lineNumber}: `);
                        sourceSB.appendASCIIString(lineContent + '\n');
                        if (instruction.endLine && lineNumber < instruction.endLine) {
                            lineNumber++;
                            continue;
                        }
                        break;
                    }
                    column.sourcecode.innerText = sourceSB.build();
                }
            }
        }
        let spacesToAppend = 10;
        if (instruction.address !== '-1') {
            sb.appendASCIIString(instruction.address);
            if (instruction.address.length < InstructionRenderer.INSTRUCTION_ADDR_MIN_LENGTH) {
                spacesToAppend = InstructionRenderer.INSTRUCTION_ADDR_MIN_LENGTH - instruction.address.length;
            }
            for (let i = 0; i < spacesToAppend; i++) {
                sb.appendASCIIString(' ');
            }
        }
        if (instruction.instructionBytes) {
            sb.appendASCIIString(instruction.instructionBytes);
            spacesToAppend = 10;
            if (instruction.instructionBytes.length < InstructionRenderer.INSTRUCTION_BYTES_MIN_LENGTH) {
                spacesToAppend = InstructionRenderer.INSTRUCTION_BYTES_MIN_LENGTH - instruction.instructionBytes.length;
            }
            for (let i = 0; i < spacesToAppend; i++) {
                sb.appendASCIIString(' ');
            }
        }
        sb.appendASCIIString(instruction.instruction);
        column.instruction.innerText = sb.build();
        this.rerenderBackground(column.instruction, column.sourcecode, element);
    }
    disposeElement(element, index, templateData, height) {
        (0, lifecycle_1.dispose)(templateData.cellDisposable);
        templateData.cellDisposable = [];
    }
    disposeTemplate(templateData) {
        (0, lifecycle_1.dispose)(templateData.disposables);
        templateData.disposables = [];
    }
    rerenderBackground(instruction, sourceCode, element) {
        var _a, _b;
        if (element && this._disassemblyView.currentInstructionAddresses.includes(element.instruction.address)) {
            instruction.style.background = ((_a = this._topStackFrameColor) === null || _a === void 0 ? void 0 : _a.toString()) || 'transparent';
        }
        else if ((element === null || element === void 0 ? void 0 : element.instruction.address) === this._disassemblyView.focusedInstructionAddress) {
            instruction.style.background = ((_b = this._focusedStackFrameColor) === null || _b === void 0 ? void 0 : _b.toString()) || 'transparent';
        }
        else {
            instruction.style.background = 'transparent';
        }
    }
    openSourceCode(instruction) {
        var _a, _b, _c, _d;
        if (instruction) {
            const sourceURI = this.getUriFromSource(instruction);
            const selection = instruction.endLine ? {
                start: { line: instruction.line, character: (_a = instruction.column) !== null && _a !== void 0 ? _a : 0 },
                end: { line: instruction.endLine, character: (_b = instruction.endColumn) !== null && _b !== void 0 ? _b : 1073741824 /* MAX_SAFE_SMALL_INTEGER */ }
            } : {
                start: { line: instruction.line, character: (_c = instruction.column) !== null && _c !== void 0 ? _c : 0 },
                end: { line: instruction.line, character: (_d = instruction.endColumn) !== null && _d !== void 0 ? _d : 1073741824 /* MAX_SAFE_SMALL_INTEGER */ }
            };
            const openerOptions = {
                selection,
                mode: 'activate',
                widgetOptions: { area: 'main' }
            };
            (0, browser_1.open)(this.openerService, new uri_1.URI(sourceURI), openerOptions);
        }
    }
    getUriFromSource(instruction) {
        // Try to resolve path before consulting the debugSession.
        const path = instruction.location.path;
        if (path && isUri(path)) { // path looks like a uri
            return this.uriService.asCanonicalUri(monaco_editor_core_1.Uri.parse(path));
        }
        // assume a filesystem path
        if (path && (0, path_1.isAbsolute)(path)) {
            return this.uriService.asCanonicalUri(monaco_editor_core_1.Uri.file(path));
        }
        return getUriFromSource(instruction.location, instruction.location.path, this._disassemblyView.debugSession.id, this.uriService);
    }
    applyFontInfo(element) {
        (0, domFontInfo_1.applyFontInfo)(element, this._disassemblyView.fontInfo);
        element.style.whiteSpace = 'pre';
    }
};
InstructionRenderer.TEMPLATE_ID = 'instruction';
InstructionRenderer.INSTRUCTION_ADDR_MIN_LENGTH = 25;
InstructionRenderer.INSTRUCTION_BYTES_MIN_LENGTH = 30;
InstructionRenderer = __decorate([
    __param(3, themeService_1.IThemeService),
    __param(4, resolverService_1.ITextModelService),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], InstructionRenderer);
exports.InstructionRenderer = InstructionRenderer;
function getUriFromSource(raw, path, sessionId, uriIdentityService) {
    if (typeof raw.sourceReference === 'number' && raw.sourceReference > 0) {
        return monaco_editor_core_1.Uri.from({
            scheme: debug_source_1.DebugSource.SCHEME,
            path,
            query: `session=${sessionId}&ref=${raw.sourceReference}`
        });
    }
    if (path && isUri(path)) { // path looks like a uri
        return uriIdentityService.asCanonicalUri(monaco_editor_core_1.Uri.parse(path));
    }
    // assume a filesystem path
    if (path && (0, path_1.isAbsolute)(path)) {
        return uriIdentityService.asCanonicalUri(monaco_editor_core_1.Uri.file(path));
    }
    // path is relative: since VS Code cannot deal with this by itself
    // create a debug url that will result in a DAP 'source' request when the url is resolved.
    return uriIdentityService.asCanonicalUri(monaco_editor_core_1.Uri.from({
        scheme: debug_source_1.DebugSource.SCHEME,
        path,
        query: `session=${sessionId}`
    }));
}
exports.getUriFromSource = getUriFromSource;
function isUri(candidate) {
    return Boolean(candidate && candidate.match(debug_source_1.DebugSource.SCHEME_PATTERN));
}
//# sourceMappingURL=disassembly-view-instruction-renderer.js.map