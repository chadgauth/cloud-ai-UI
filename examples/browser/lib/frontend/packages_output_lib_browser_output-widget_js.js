"use strict";
(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_output_lib_browser_output-widget_js"],{

/***/ "../../packages/output/lib/browser/output-widget.js":
/*!**********************************************************!*\
  !*** ../../packages/output/lib/browser/output-widget.js ***!
  \**********************************************************/
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
var OutputWidget_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OutputWidget = void 0;
__webpack_require__(/*! ../../src/browser/style/output.css */ "../../packages/output/src/browser/style/output.css");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const algorithm_1 = __webpack_require__(/*! @theia/core/shared/@phosphor/algorithm */ "../../packages/core/shared/@phosphor/algorithm/index.js");
const browser_1 = __webpack_require__(/*! @theia/editor/lib/browser */ "../../packages/editor/lib/browser/index.js");
const monaco_editor_1 = __webpack_require__(/*! @theia/monaco/lib/browser/monaco-editor */ "../../packages/monaco/lib/browser/monaco-editor.js");
const selection_service_1 = __webpack_require__(/*! @theia/core/lib/common/selection-service */ "../../packages/core/lib/common/selection-service.js");
const monaco_editor_provider_1 = __webpack_require__(/*! @theia/monaco/lib/browser/monaco-editor-provider */ "../../packages/monaco/lib/browser/monaco-editor-provider.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
const browser_2 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const output_uri_1 = __webpack_require__(/*! ../common/output-uri */ "../../packages/output/lib/common/output-uri.js");
const output_channel_1 = __webpack_require__(/*! ./output-channel */ "../../packages/output/lib/browser/output-channel.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
const monaco = __webpack_require__(/*! @theia/monaco-editor-core */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/editor.main.js");
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

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/output/lib/browser/output-widget'] = this;


/***/ }),

/***/ "../../node_modules/css-loader/dist/cjs.js!../../packages/output/src/browser/style/output.css":
/*!****************************************************************************************************!*\
  !*** ../../node_modules/css-loader/dist/cjs.js!../../packages/output/src/browser/style/output.css ***!
  \****************************************************************************************************/
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
 * Copyright (C) 2018 TypeFox and others.
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

.theia-output .editor-container {
  height: 100%;
}

.theia-output .theia-output-error {
  color: var(--theia-errorForeground);
}

.theia-output .theia-output-warning {
  color: var(--theia-editorWarning-foreground);
}

#outputChannelList .theia-select-component {
  width: 170px;
}
`, "",{"version":3,"sources":["webpack://./../../packages/output/src/browser/style/output.css"],"names":[],"mappings":"AAAA;;;;;;;;;;;;;;iFAciF;;AAEjF;EACE,YAAY;AACd;;AAEA;EACE,mCAAmC;AACrC;;AAEA;EACE,4CAA4C;AAC9C;;AAEA;EACE,YAAY;AACd","sourcesContent":["/********************************************************************************\n * Copyright (C) 2018 TypeFox and others.\n *\n * This program and the accompanying materials are made available under the\n * terms of the Eclipse Public License v. 2.0 which is available at\n * http://www.eclipse.org/legal/epl-2.0.\n *\n * This Source Code may also be made available under the following Secondary\n * Licenses when the conditions for such availability set forth in the Eclipse\n * Public License v. 2.0 are satisfied: GNU General Public License, version 2\n * with the GNU Classpath Exception which is available at\n * https://www.gnu.org/software/classpath/license.html.\n *\n * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0\n ********************************************************************************/\n\n.theia-output .editor-container {\n  height: 100%;\n}\n\n.theia-output .theia-output-error {\n  color: var(--theia-errorForeground);\n}\n\n.theia-output .theia-output-warning {\n  color: var(--theia-editorWarning-foreground);\n}\n\n#outputChannelList .theia-select-component {\n  width: 170px;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../packages/output/src/browser/style/output.css":
/*!**********************************************************!*\
  !*** ../../packages/output/src/browser/style/output.css ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_output_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/css-loader/dist/cjs.js!./output.css */ "../../node_modules/css-loader/dist/cjs.js!../../packages/output/src/browser/style/output.css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_output_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_output_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ })

}]);
//# sourceMappingURL=packages_output_lib_browser_output-widget_js.js.map