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
var OutputWidget_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutputWidget = void 0;
require("../../src/browser/style/output.css");
const inversify_1 = require("@theia/core/shared/inversify");
const algorithm_1 = require("@theia/core/shared/@phosphor/algorithm");
const browser_1 = require("@theia/editor/lib/browser");
const monaco_editor_1 = require("@theia/monaco/lib/browser/monaco-editor");
const selection_service_1 = require("@theia/core/lib/common/selection-service");
const monaco_editor_provider_1 = require("@theia/monaco/lib/browser/monaco-editor-provider");
const disposable_1 = require("@theia/core/lib/common/disposable");
const browser_2 = require("@theia/core/lib/browser");
const output_uri_1 = require("../common/output-uri");
const output_channel_1 = require("./output-channel");
const core_1 = require("@theia/core");
const nls_1 = require("@theia/core/lib/common/nls");
const monaco = require("@theia/monaco-editor-core");
let OutputWidget = OutputWidget_1 = class OutputWidget extends browser_2.BaseWidget {
    constructor() {
        super();
        this._state = { locked: false };
        this.toDisposeOnSelectedChannelChanged = new disposable_1.DisposableCollection();
        this.onStateChangedEmitter = new core_1.Emitter();
        this.id = OutputWidget_1.ID;
        this.title.label = OutputWidget_1.LABEL;
        this.title.caption = OutputWidget_1.LABEL;
        this.title.iconClass = (0, browser_2.codicon)('output');
        this.title.closable = true;
        this.addClass('theia-output');
        this.node.tabIndex = 0;
        this.editorContainer = new NoopDragOverDockPanel({ spacing: 0, mode: 'single-document' });
        this.editorContainer.addClass('editor-container');
        this.editorContainer.node.tabIndex = -1;
    }
    init() {
        this.toDispose.pushAll([
            this.outputChannelManager.onChannelWasHidden(() => this.refreshEditorWidget()),
            this.outputChannelManager.onChannelWasShown(({ preserveFocus }) => this.refreshEditorWidget({ preserveFocus: !!preserveFocus })),
            this.toDisposeOnSelectedChannelChanged,
            this.onStateChangedEmitter,
            this.onStateChanged(() => this.update())
        ]);
        this.refreshEditorWidget();
    }
    storeState() {
        return this.state;
    }
    restoreState(oldState) {
        const copy = (0, core_1.deepClone)(this.state);
        if (oldState.locked) {
            copy.locked = oldState.locked;
        }
        this.state = copy;
    }
    get state() {
        return this._state;
    }
    set state(state) {
        this._state = state;
        this.onStateChangedEmitter.fire(this._state);
    }
    async refreshEditorWidget({ preserveFocus } = { preserveFocus: false }) {
        const { selectedChannel } = this;
        const editorWidget = this.editorWidget;
        if (selectedChannel && editorWidget) {
            // If the input is the current one, do nothing.
            const model = editorWidget.editor.getControl().getModel();
            if (model && model.uri.toString() === selectedChannel.uri.toString()) {
                if (!preserveFocus) {
                    this.activate();
                }
                return;
            }
        }
        this.toDisposeOnSelectedChannelChanged.dispose();
        if (selectedChannel) {
            const widget = await this.createEditorWidget();
            if (widget) {
                this.editorContainer.addWidget(widget);
                this.toDisposeOnSelectedChannelChanged.pushAll([
                    disposable_1.Disposable.create(() => widget.close()),
                    selectedChannel.onContentChange(() => this.revealLastLine())
                ]);
                if (!preserveFocus) {
                    this.activate();
                }
                this.revealLastLine();
            }
        }
    }
    onAfterAttach(message) {
        super.onAfterAttach(message);
        browser_2.Widget.attach(this.editorContainer, this.node);
        this.toDisposeOnDetach.push(disposable_1.Disposable.create(() => browser_2.Widget.detach(this.editorContainer)));
    }
    onActivateRequest(message) {
        super.onActivateRequest(message);
        if (this.editor) {
            this.editor.focus();
        }
        else {
            this.node.focus();
        }
    }
    onResize(message) {
        super.onResize(message);
        browser_2.MessageLoop.sendMessage(this.editorContainer, browser_2.Widget.ResizeMessage.UnknownSize);
        for (const widget of (0, algorithm_1.toArray)(this.editorContainer.widgets())) {
            browser_2.MessageLoop.sendMessage(widget, browser_2.Widget.ResizeMessage.UnknownSize);
        }
    }
    onAfterShow(msg) {
        super.onAfterShow(msg);
        this.onResize(browser_2.Widget.ResizeMessage.UnknownSize); // Triggers an editor widget resize. (#8361)
    }
    get onStateChanged() {
        return this.onStateChangedEmitter.event;
    }
    clear() {
        if (this.selectedChannel) {
            this.selectedChannel.clear();
        }
    }
    selectAll() {
        const editor = this.editor;
        if (editor) {
            const model = editor.getControl().getModel();
            if (model) {
                const endLine = model.getLineCount();
                const endCharacter = model.getLineMaxColumn(endLine);
                editor.getControl().setSelection(new monaco.Range(1, 1, endLine, endCharacter));
            }
        }
    }
    lock() {
        this.state = { ...(0, core_1.deepClone)(this.state), locked: true };
    }
    unlock() {
        this.state = { ...(0, core_1.deepClone)(this.state), locked: false };
    }
    get isLocked() {
        return !!this.state.locked;
    }
    revealLastLine() {
        if (this.isLocked) {
            return;
        }
        const editor = this.editor;
        if (editor) {
            const model = editor.getControl().getModel();
            if (model) {
                const lineNumber = model.getLineCount();
                const column = model.getLineMaxColumn(lineNumber);
                editor.getControl().revealPosition({ lineNumber, column }, monaco.editor.ScrollType.Smooth);
            }
        }
    }
    get selectedChannel() {
        return this.outputChannelManager.selectedChannel;
    }
    async createEditorWidget() {
        if (!this.selectedChannel) {
            return undefined;
        }
        const { name } = this.selectedChannel;
        const editor = await this.editorProvider.get(output_uri_1.OutputUri.create(name));
        return new browser_1.EditorWidget(editor, this.selectionService);
    }
    get editorWidget() {
        for (const widget of (0, algorithm_1.toArray)(this.editorContainer.children())) {
            if (widget instanceof browser_1.EditorWidget) {
                return widget;
            }
        }
        return undefined;
    }
    get editor() {
        const widget = this.editorWidget;
        if (widget instanceof browser_1.EditorWidget) {
            if (widget.editor instanceof monaco_editor_1.MonacoEditor) {
                return widget.editor;
            }
        }
        return undefined;
    }
    getText() {
        var _a, _b;
        return (_b = (_a = this.editor) === null || _a === void 0 ? void 0 : _a.getControl().getModel()) === null || _b === void 0 ? void 0 : _b.getValue();
    }
};
OutputWidget.ID = 'outputView';
OutputWidget.LABEL = nls_1.nls.localizeByDefault('Output');
__decorate([
    (0, inversify_1.inject)(selection_service_1.SelectionService),
    __metadata("design:type", selection_service_1.SelectionService)
], OutputWidget.prototype, "selectionService", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_editor_provider_1.MonacoEditorProvider),
    __metadata("design:type", monaco_editor_provider_1.MonacoEditorProvider)
], OutputWidget.prototype, "editorProvider", void 0);
__decorate([
    (0, inversify_1.inject)(output_channel_1.OutputChannelManager),
    __metadata("design:type", output_channel_1.OutputChannelManager)
], OutputWidget.prototype, "outputChannelManager", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OutputWidget.prototype, "init", null);
OutputWidget = OutputWidget_1 = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], OutputWidget);
exports.OutputWidget = OutputWidget;
/**
 * Customized `DockPanel` that does not allow dropping widgets into it.
 */
class NoopDragOverDockPanel extends browser_2.DockPanel {
}
NoopDragOverDockPanel.prototype['_evtDragOver'] = () => { };
NoopDragOverDockPanel.prototype['_evtDrop'] = () => { };
NoopDragOverDockPanel.prototype['_evtDragLeave'] = () => { };
//# sourceMappingURL=output-widget.js.map