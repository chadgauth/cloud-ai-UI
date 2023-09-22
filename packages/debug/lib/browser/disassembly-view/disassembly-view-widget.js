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
var DisassemblyViewWidget_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisassemblyViewWidget = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/core/lib/browser");
const types_1 = require("@theia/core/lib/common/types");
const breakpoint_marker_1 = require("../breakpoint/breakpoint-marker");
const breakpoint_manager_1 = require("../breakpoint/breakpoint-manager");
const debug_session_manager_1 = require("../debug-session-manager");
const monaco_editor_core_1 = require("@theia/monaco-editor-core");
const core_1 = require("@theia/core");
const fontInfo_1 = require("@theia/monaco-editor-core/esm/vs/editor/common/config/fontInfo");
const listService_1 = require("@theia/monaco-editor-core/esm/vs/platform/list/browser/listService");
const debug_session_1 = require("../debug-session");
const browser_2 = require("@theia/editor/lib/browser");
const browser_3 = require("@theia/monaco-editor-core/esm/vs/base/browser/browser");
const debug_preferences_1 = require("../debug-preferences");
const disassembly_view_table_delegate_1 = require("./disassembly-view-table-delegate");
const standaloneServices_1 = require("@theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices");
const disassembly_view_instruction_renderer_1 = require("./disassembly-view-instruction-renderer");
const disassembly_view_breakpoint_renderer_1 = require("./disassembly-view-breakpoint-renderer");
const disassembly_view_accessibility_provider_1 = require("./disassembly-view-accessibility-provider");
const colorRegistry_1 = require("@theia/monaco-editor-core/esm/vs/platform/theme/common/colorRegistry");
const dom_1 = require("@theia/monaco-editor-core/esm/vs/base/browser/dom");
const uri_1 = require("@theia/core/lib/common/uri");
// This file is adapted from https://github.com/microsoft/vscode/blob/c061ce5c24fc480342fbc5f23244289d633c56eb/src/vs/workbench/contrib/debug/browser/disassemblyView.ts
// Special entry as a placeholder when disassembly is not available
const disassemblyNotAvailable = {
    allowBreakpoint: false,
    isBreakpointSet: false,
    isBreakpointEnabled: false,
    instruction: {
        address: '-1',
        instruction: core_1.nls.localizeByDefault('Disassembly not available.')
    },
    instructionAddress: BigInt(-1)
};
let DisassemblyViewWidget = DisassemblyViewWidget_1 = class DisassemblyViewWidget extends browser_1.BaseWidget {
    constructor() {
        super(...arguments);
        this.iconReferenceUri = new uri_1.URI().withScheme('file').withPath('disassembly-view.disassembly-view');
        this._disassembledInstructions = undefined;
        this._onDidChangeStackFrame = new monaco_editor_core_1.Emitter();
        this._instructionBpList = [];
        this._enableSourceCodeRender = true;
        this._loadingLock = false;
    }
    init() {
        var _a, _b;
        this.id = DisassemblyViewWidget_1.ID;
        this.addClass(DisassemblyViewWidget_1.ID);
        this.title.closable = true;
        this.title.label = core_1.nls.localizeByDefault('Disassembly');
        const updateIcon = () => this.title.iconClass = this.labelProvider.getIcon(this.iconReferenceUri) + ' file-icon';
        updateIcon();
        this.toDispose.push(this.labelProvider.onDidChange(updateIcon));
        this.node.tabIndex = -1;
        this.node.style.outline = 'none';
        this._previousDebuggingState = (_b = (_a = this.debugSessionManager.currentSession) === null || _a === void 0 ? void 0 : _a.state) !== null && _b !== void 0 ? _b : debug_session_1.DebugState.Inactive;
        this._fontInfo = fontInfo_1.BareFontInfo.createFromRawSettings(this.toFontInfo(), browser_3.PixelRatio.value);
        this.editorPreferences.onPreferenceChanged(() => this._fontInfo = fontInfo_1.BareFontInfo.createFromRawSettings(this.toFontInfo(), browser_3.PixelRatio.value));
        this.debugPreferences.onPreferenceChanged(e => {
            var _a;
            if (e.preferenceName === 'debug.disassemblyView.showSourceCode' && e.newValue !== this._enableSourceCodeRender) {
                this._enableSourceCodeRender = e.newValue;
                this.reloadDisassembly(undefined);
            }
            else {
                (_a = this._disassembledInstructions) === null || _a === void 0 ? void 0 : _a.rerender();
            }
        });
        this.createPane();
    }
    get fontInfo() { return this._fontInfo; }
    get currentInstructionAddresses() {
        return this.debugSessionManager.sessions
            .map(session => session.getThreads(() => true))
            .reduce((prev, curr) => prev.concat(Array.from(curr)), [])
            .map(thread => thread.topFrame)
            .map(frame => frame === null || frame === void 0 ? void 0 : frame.raw.instructionPointerReference);
    }
    get focusedCurrentInstructionAddress() {
        var _a, _b;
        return (_b = (_a = this.debugSessionManager.currentFrame) === null || _a === void 0 ? void 0 : _a.thread.topFrame) === null || _b === void 0 ? void 0 : _b.raw.instructionPointerReference;
    }
    get isSourceCodeRender() { return this._enableSourceCodeRender; }
    get debugSession() { return this.debugSessionManager.currentSession; }
    get focusedInstructionAddress() {
        var _a;
        return (_a = this.debugSessionManager.currentFrame) === null || _a === void 0 ? void 0 : _a.raw.instructionPointerReference;
    }
    get onDidChangeStackFrame() { return this._onDidChangeStackFrame.event; }
    createPane() {
        this._enableSourceCodeRender = this.debugPreferences['debug.disassemblyView.showSourceCode'];
        const monacoInstantiationService = standaloneServices_1.StandaloneServices.initialize({});
        const tableDelegate = new disassembly_view_table_delegate_1.DisassemblyViewTableDelegate(this);
        const instructionRenderer = monacoInstantiationService.createInstance(disassembly_view_instruction_renderer_1.InstructionRenderer, this, this.openerService, { asCanonicalUri(thing) { return thing; } });
        this.toDispose.push(instructionRenderer);
        this.getTable(monacoInstantiationService, tableDelegate, instructionRenderer);
        this.reloadDisassembly();
        this._register(this._disassembledInstructions.onDidScroll(e => {
            if (this._loadingLock) {
                return;
            }
            if (e.oldScrollTop > e.scrollTop && e.scrollTop < e.height) {
                this._loadingLock = true;
                const topElement = Math.floor(e.scrollTop / this.fontInfo.lineHeight) + DisassemblyViewWidget_1.NUM_INSTRUCTIONS_TO_LOAD;
                this.scrollUp_LoadDisassembledInstructions(DisassemblyViewWidget_1.NUM_INSTRUCTIONS_TO_LOAD).then(success => {
                    if (success) {
                        this._disassembledInstructions.reveal(topElement, 0);
                    }
                    this._loadingLock = false;
                });
            }
            else if (e.oldScrollTop < e.scrollTop && e.scrollTop + e.height > e.scrollHeight - e.height) {
                this._loadingLock = true;
                this.scrollDown_LoadDisassembledInstructions(DisassemblyViewWidget_1.NUM_INSTRUCTIONS_TO_LOAD).then(() => { this._loadingLock = false; });
            }
        }));
        this._register(this.debugSessionManager.onDidFocusStackFrame(() => {
            if (this._disassembledInstructions) {
                this.goToAddress();
                this._onDidChangeStackFrame.fire();
            }
        }));
        this._register(this.breakpointManager.onDidChangeInstructionBreakpoints(bpEvent => {
            var _a, _b, _c;
            if (bpEvent && this._disassembledInstructions) {
                // draw viewable BP
                let changed = false;
                (_a = bpEvent.added) === null || _a === void 0 ? void 0 : _a.forEach(bp => {
                    if (breakpoint_marker_1.InstructionBreakpoint.is(bp)) {
                        const index = this.getIndexFromAddress(bp.instructionReference);
                        if (index >= 0) {
                            this._disassembledInstructions.row(index).isBreakpointSet = true;
                            this._disassembledInstructions.row(index).isBreakpointEnabled = bp.enabled;
                            changed = true;
                        }
                    }
                });
                (_b = bpEvent.removed) === null || _b === void 0 ? void 0 : _b.forEach(bp => {
                    if (breakpoint_marker_1.InstructionBreakpoint.is(bp)) {
                        const index = this.getIndexFromAddress(bp.instructionReference);
                        if (index >= 0) {
                            this._disassembledInstructions.row(index).isBreakpointSet = false;
                            changed = true;
                        }
                    }
                });
                (_c = bpEvent.changed) === null || _c === void 0 ? void 0 : _c.forEach(bp => {
                    if (breakpoint_marker_1.InstructionBreakpoint.is(bp)) {
                        const index = this.getIndexFromAddress(bp.instructionReference);
                        if (index >= 0) {
                            if (this._disassembledInstructions.row(index).isBreakpointEnabled !== bp.enabled) {
                                this._disassembledInstructions.row(index).isBreakpointEnabled = bp.enabled;
                                changed = true;
                            }
                        }
                    }
                });
                // get an updated list so that items beyond the current range would render when reached.
                this._instructionBpList = this.breakpointManager.getInstructionBreakpoints();
                if (changed) {
                    this._onDidChangeStackFrame.fire();
                }
            }
        }));
        // This would like to be more specific: onDidChangeState
        this._register(this.debugSessionManager.onDidChange(() => {
            var _a, _b;
            const state = (_a = this.debugSession) === null || _a === void 0 ? void 0 : _a.state;
            if ((state === debug_session_1.DebugState.Running || state === debug_session_1.DebugState.Stopped) &&
                (this._previousDebuggingState !== debug_session_1.DebugState.Running && this._previousDebuggingState !== debug_session_1.DebugState.Stopped)) {
                // Just started debugging, clear the view
                (_b = this._disassembledInstructions) === null || _b === void 0 ? void 0 : _b.splice(0, this._disassembledInstructions.length, [disassemblyNotAvailable]);
                this._enableSourceCodeRender = this.debugPreferences['debug.disassemblyView.showSourceCode'];
            }
            if (state !== undefined && state !== this._previousDebuggingState) {
                this._previousDebuggingState = state;
            }
        }));
    }
    getTable(monacoInstantiationService, tableDelegate, instructionRenderer) {
        return this._disassembledInstructions = this._register(monacoInstantiationService.createInstance(listService_1.WorkbenchTable, 'DisassemblyView', this.node, tableDelegate, [
            {
                label: '',
                tooltip: '',
                weight: 0,
                minimumWidth: this.fontInfo.lineHeight,
                maximumWidth: this.fontInfo.lineHeight,
                templateId: disassembly_view_breakpoint_renderer_1.BreakpointRenderer.TEMPLATE_ID,
                project(row) { return row; }
            },
            {
                label: core_1.nls.localizeByDefault('instructions'),
                tooltip: '',
                weight: 0.3,
                templateId: disassembly_view_instruction_renderer_1.InstructionRenderer.TEMPLATE_ID,
                project(row) { return row; }
            },
        ], [
            new disassembly_view_breakpoint_renderer_1.BreakpointRenderer(this, this.breakpointManager),
            instructionRenderer,
        ], {
            identityProvider: { getId: (e) => e.instruction.address },
            horizontalScrolling: false,
            overrideStyles: {
                listBackground: colorRegistry_1.editorBackground
            },
            multipleSelectionSupport: false,
            setRowLineHeight: false,
            openOnSingleClick: false,
            accessibilityProvider: new disassembly_view_accessibility_provider_1.AccessibilityProvider(),
            mouseSupport: false
        }));
    }
    adjustLayout(dimension) {
        if (this._disassembledInstructions) {
            this._disassembledInstructions.layout(dimension.height);
        }
    }
    goToAddress(address, focus) {
        if (!this._disassembledInstructions) {
            return;
        }
        if (!address) {
            address = this.focusedInstructionAddress;
        }
        if (!address) {
            return;
        }
        const index = this.getIndexFromAddress(address);
        if (index >= 0) {
            this._disassembledInstructions.reveal(index);
            if (focus) {
                this._disassembledInstructions.domFocus();
                this._disassembledInstructions.setFocus([index]);
            }
        }
        else if (this.debugSessionManager.state === debug_session_1.DebugState.Stopped) {
            // Address is not provided or not in the table currently, clear the table
            // and reload if we are in the state where we can load disassembly.
            this.reloadDisassembly(address);
        }
    }
    async scrollUp_LoadDisassembledInstructions(instructionCount) {
        var _a;
        if (this._disassembledInstructions && this._disassembledInstructions.length > 0) {
            const address = (_a = this._disassembledInstructions) === null || _a === void 0 ? void 0 : _a.row(0).instruction.address;
            return this.loadDisassembledInstructions(address, -instructionCount, instructionCount);
        }
        return false;
    }
    async scrollDown_LoadDisassembledInstructions(instructionCount) {
        var _a, _b;
        if (this._disassembledInstructions && this._disassembledInstructions.length > 0) {
            const address = (_a = this._disassembledInstructions) === null || _a === void 0 ? void 0 : _a.row(((_b = this._disassembledInstructions) === null || _b === void 0 ? void 0 : _b.length) - 1).instruction.address;
            return this.loadDisassembledInstructions(address, 1, instructionCount);
        }
        return false;
    }
    async loadDisassembledInstructions(memoryReference, instructionOffset, instructionCount) {
        var _a, _b, _c, _d, _e;
        // if address is null, then use current stack frame.
        if (!memoryReference || memoryReference === '-1') {
            memoryReference = this.focusedInstructionAddress;
        }
        if (!memoryReference) {
            return false;
        }
        const session = this.debugSession;
        const resultEntries = (_b = (_a = (await (session === null || session === void 0 ? void 0 : session.sendRequest('disassemble', {
            instructionCount,
            memoryReference,
            instructionOffset,
            offset: 0,
            resolveSymbols: true,
        })))) === null || _a === void 0 ? void 0 : _a.body) === null || _b === void 0 ? void 0 : _b.instructions;
        if (session && resultEntries && this._disassembledInstructions) {
            const newEntries = [];
            const allowBreakpoint = Boolean(session.capabilities.supportsInstructionBreakpoints);
            let lastLocation;
            let lastLine;
            for (let i = 0; i < resultEntries.length; i++) {
                const found = this._instructionBpList.find(p => p.instructionReference === resultEntries[i].address);
                const instruction = resultEntries[i];
                // Forward fill the missing location as detailed in the DAP spec.
                if (instruction.location) {
                    lastLocation = instruction.location;
                    lastLine = undefined;
                }
                if (instruction.line) {
                    const currentLine = {
                        startLineNumber: instruction.line,
                        startColumn: (_c = instruction.column) !== null && _c !== void 0 ? _c : 0,
                        endLineNumber: (_d = instruction.endLine) !== null && _d !== void 0 ? _d : instruction.line,
                        endColumn: (_e = instruction.endColumn) !== null && _e !== void 0 ? _e : 0,
                    };
                    // Add location only to the first unique range. This will give the appearance of grouping of instructions.
                    if (!monaco_editor_core_1.Range.equalsRange(currentLine, lastLine !== null && lastLine !== void 0 ? lastLine : null)) { // eslint-disable-line no-null/no-null
                        lastLine = currentLine;
                        instruction.location = lastLocation;
                    }
                }
                newEntries.push({ allowBreakpoint, isBreakpointSet: found !== undefined, isBreakpointEnabled: !!(found === null || found === void 0 ? void 0 : found.enabled), instruction: instruction });
            }
            const specialEntriesToRemove = this._disassembledInstructions.length === 1 ? 1 : 0;
            // request is either at the start or end
            if (instructionOffset >= 0) {
                this._disassembledInstructions.splice(this._disassembledInstructions.length, specialEntriesToRemove, newEntries);
            }
            else {
                this._disassembledInstructions.splice(0, specialEntriesToRemove, newEntries);
            }
            return true;
        }
        return false;
    }
    getIndexFromAddress(instructionAddress) {
        const disassembledInstructions = this._disassembledInstructions;
        if (disassembledInstructions && disassembledInstructions.length > 0) {
            const address = BigInt(instructionAddress);
            if (address) {
                return types_1.ArrayUtils.binarySearch2(disassembledInstructions.length, index => {
                    const row = disassembledInstructions.row(index);
                    this.ensureAddressParsed(row);
                    if (row.instructionAddress > address) {
                        return 1;
                    }
                    else if (row.instructionAddress < address) {
                        return -1;
                    }
                    else {
                        return 0;
                    }
                });
            }
        }
        return -1;
    }
    ensureAddressParsed(entry) {
        if (entry.instructionAddress !== undefined) {
            return;
        }
        else {
            entry.instructionAddress = BigInt(entry.instruction.address);
        }
    }
    /**
     * Clears the table and reload instructions near the target address
     */
    reloadDisassembly(targetAddress) {
        if (this._disassembledInstructions) {
            this._loadingLock = true; // stop scrolling during the load.
            this._disassembledInstructions.splice(0, this._disassembledInstructions.length, [disassemblyNotAvailable]);
            this._instructionBpList = this.breakpointManager.getInstructionBreakpoints();
            this.loadDisassembledInstructions(targetAddress, -DisassemblyViewWidget_1.NUM_INSTRUCTIONS_TO_LOAD * 4, DisassemblyViewWidget_1.NUM_INSTRUCTIONS_TO_LOAD * 8).then(() => {
                // on load, set the target instruction in the middle of the page.
                if (this._disassembledInstructions.length > 0) {
                    const targetIndex = Math.floor(this._disassembledInstructions.length / 2);
                    this._disassembledInstructions.reveal(targetIndex, 0.5);
                    // Always focus the target address on reload, or arrow key navigation would look terrible
                    this._disassembledInstructions.domFocus();
                    this._disassembledInstructions.setFocus([targetIndex]);
                }
                this._loadingLock = false;
            });
        }
    }
    onResize(msg) {
        this.adjustLayout(new dom_1.Dimension(msg.width, msg.height));
    }
    onActivateRequest(msg) {
        this.node.focus();
        super.onActivateRequest(msg);
    }
    toFontInfo() {
        return {
            fontFamily: this.editorPreferences['editor.fontFamily'],
            fontWeight: String(this.editorPreferences['editor.fontWeight']),
            fontSize: this.editorPreferences['editor.fontSize'],
            fontLigatures: this.editorPreferences['editor.fontLigatures'],
            lineHeight: this.editorPreferences['editor.lineHeight'],
            letterSpacing: this.editorPreferences['editor.letterSpacing'],
        };
    }
    _register(disposable) {
        this.toDispose.push(disposable);
        return disposable;
    }
};
DisassemblyViewWidget.ID = 'disassembly-view-widget';
DisassemblyViewWidget.NUM_INSTRUCTIONS_TO_LOAD = 50;
__decorate([
    (0, inversify_1.inject)(breakpoint_manager_1.BreakpointManager),
    __metadata("design:type", breakpoint_manager_1.BreakpointManager)
], DisassemblyViewWidget.prototype, "breakpointManager", void 0);
__decorate([
    (0, inversify_1.inject)(debug_session_manager_1.DebugSessionManager),
    __metadata("design:type", debug_session_manager_1.DebugSessionManager)
], DisassemblyViewWidget.prototype, "debugSessionManager", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.EditorPreferences),
    __metadata("design:type", Object)
], DisassemblyViewWidget.prototype, "editorPreferences", void 0);
__decorate([
    (0, inversify_1.inject)(debug_preferences_1.DebugPreferences),
    __metadata("design:type", Object)
], DisassemblyViewWidget.prototype, "debugPreferences", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.OpenerService),
    __metadata("design:type", Object)
], DisassemblyViewWidget.prototype, "openerService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.LabelProvider),
    __metadata("design:type", browser_1.LabelProvider)
], DisassemblyViewWidget.prototype, "labelProvider", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DisassemblyViewWidget.prototype, "init", null);
DisassemblyViewWidget = DisassemblyViewWidget_1 = __decorate([
    (0, inversify_1.injectable)()
], DisassemblyViewWidget);
exports.DisassemblyViewWidget = DisassemblyViewWidget;
//# sourceMappingURL=disassembly-view-widget.js.map