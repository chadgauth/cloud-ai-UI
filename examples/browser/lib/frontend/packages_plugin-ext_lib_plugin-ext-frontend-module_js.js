"use strict";
(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_plugin-ext_lib_plugin-ext-frontend-module_js"],{

/***/ "../../packages/output/lib/browser/output-commands.js":
/*!************************************************************!*\
  !*** ../../packages/output/lib/browser/output-commands.js ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2020 TypeFox and others.
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
exports.OutputCommands = void 0;
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
var OutputCommands;
(function (OutputCommands) {
    const OUTPUT_CATEGORY = 'Output';
    const OUTPUT_CATEGORY_KEY = common_1.nls.getDefaultKey(OUTPUT_CATEGORY);
    /* #region VS Code `OutputChannel` API */
    // Based on: https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/vscode.d.ts#L4692-L4745
    OutputCommands.APPEND = {
        id: 'output:append'
    };
    OutputCommands.APPEND_LINE = {
        id: 'output:appendLine'
    };
    OutputCommands.CLEAR = {
        id: 'output:clear'
    };
    OutputCommands.SHOW = {
        id: 'output:show'
    };
    OutputCommands.HIDE = {
        id: 'output:hide'
    };
    OutputCommands.DISPOSE = {
        id: 'output:dispose'
    };
    /* #endregion VS Code `OutputChannel` API */
    OutputCommands.CLEAR__WIDGET = common_1.Command.toLocalizedCommand({
        id: 'output:widget:clear',
        category: OUTPUT_CATEGORY,
        iconClass: (0, browser_1.codicon)('clear-all')
    }, '', OUTPUT_CATEGORY_KEY);
    OutputCommands.LOCK__WIDGET = common_1.Command.toLocalizedCommand({
        id: 'output:widget:lock',
        category: OUTPUT_CATEGORY,
        iconClass: (0, browser_1.codicon)('unlock')
    }, '', OUTPUT_CATEGORY_KEY);
    OutputCommands.UNLOCK__WIDGET = common_1.Command.toLocalizedCommand({
        id: 'output:widget:unlock',
        category: OUTPUT_CATEGORY,
        iconClass: (0, browser_1.codicon)('lock')
    }, '', OUTPUT_CATEGORY_KEY);
    OutputCommands.CLEAR__QUICK_PICK = common_1.Command.toLocalizedCommand({
        id: 'output:pick-clear',
        label: 'Clear Output Channel...',
        category: OUTPUT_CATEGORY
    }, 'theia/output/clearOutputChannel', OUTPUT_CATEGORY_KEY);
    OutputCommands.SHOW__QUICK_PICK = common_1.Command.toLocalizedCommand({
        id: 'output:pick-show',
        label: 'Show Output Channel...',
        category: OUTPUT_CATEGORY
    }, 'theia/output/showOutputChannel', OUTPUT_CATEGORY_KEY);
    OutputCommands.HIDE__QUICK_PICK = common_1.Command.toLocalizedCommand({
        id: 'output:pick-hide',
        label: 'Hide Output Channel...',
        category: OUTPUT_CATEGORY
    }, 'theia/output/hideOutputChannel', OUTPUT_CATEGORY_KEY);
    OutputCommands.DISPOSE__QUICK_PICK = common_1.Command.toLocalizedCommand({
        id: 'output:pick-dispose',
        label: 'Close Output Channel...',
        category: OUTPUT_CATEGORY
    }, 'theia/output/closeOutputChannel', OUTPUT_CATEGORY_KEY);
    OutputCommands.COPY_ALL = {
        id: 'output:copy-all',
    };
})(OutputCommands = exports.OutputCommands || (exports.OutputCommands = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/output/lib/browser/output-commands'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/commands.js":
/*!**************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/commands.js ***!
  \**************************************************************/
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OpenUriCommandHandler = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const command_1 = __webpack_require__(/*! @theia/core/lib/common/command */ "../../packages/core/lib/common/command.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const window_service_1 = __webpack_require__(/*! @theia/core/lib/browser/window/window-service */ "../../packages/core/lib/browser/window/window-service.js");
const DOMPurify = __webpack_require__(/*! @theia/core/shared/dompurify */ "../../packages/core/shared/dompurify/index.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
let OpenUriCommandHandler = class OpenUriCommandHandler {
    constructor(windowService, commandService) {
        this.windowService = windowService;
        this.commandService = commandService;
        this.openNewTabDialog = new OpenNewTabDialog(windowService);
    }
    execute(resource) {
        if (!resource) {
            return;
        }
        const uriString = resource.toString();
        if (uriString.startsWith('http://') || uriString.startsWith('https://')) {
            this.openWebUri(uriString);
        }
        else {
            this.commandService.executeCommand('editor.action.openLink', uriString);
        }
    }
    openWebUri(uri) {
        try {
            this.windowService.openNewWindow(uri);
        }
        catch (err) {
            // browser has blocked opening of a new tab
            this.openNewTabDialog.showOpenNewTabDialog(uri);
        }
    }
};
OpenUriCommandHandler.COMMAND_METADATA = {
    id: 'theia.open'
};
OpenUriCommandHandler = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(window_service_1.WindowService)),
    __param(1, (0, inversify_1.inject)(command_1.CommandService)),
    __metadata("design:paramtypes", [Object, Object])
], OpenUriCommandHandler);
exports.OpenUriCommandHandler = OpenUriCommandHandler;
class OpenNewTabDialog extends browser_1.AbstractDialog {
    constructor(windowService) {
        super({
            title: nls_1.nls.localize('theia/plugin/blockNewTab', 'Your browser prevented opening of a new tab')
        });
        this.windowService = windowService;
        this.linkNode = document.createElement('a');
        this.linkNode.target = '_blank';
        this.linkNode.setAttribute('style', 'color: var(--theia-editorWidget-foreground);');
        this.contentNode.appendChild(this.linkNode);
        const messageNode = document.createElement('div');
        messageNode.innerText = 'You are going to open: ';
        messageNode.appendChild(this.linkNode);
        this.contentNode.appendChild(messageNode);
        this.appendCloseButton();
        this.openButton = this.appendAcceptButton(nls_1.nls.localizeByDefault('Open'));
    }
    showOpenNewTabDialog(uri) {
        this.value = uri;
        this.linkNode.innerHTML = DOMPurify.sanitize(uri);
        this.linkNode.href = uri;
        this.openButton.onclick = () => {
            this.windowService.openNewWindow(uri);
        };
        // show dialog window to user
        this.open();
    }
}

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/commands'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/custom-editors/custom-editor-contribution.js":
/*!***********************************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/custom-editors/custom-editor-contribution.js ***!
  \***********************************************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CustomEditorContribution = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const custom_editor_widget_1 = __webpack_require__(/*! ./custom-editor-widget */ "../../packages/plugin-ext/lib/main/browser/custom-editors/custom-editor-widget.js");
let CustomEditorContribution = class CustomEditorContribution {
    registerCommands(commands) {
        commands.registerHandler(browser_1.CommonCommands.UNDO.id, {
            isEnabled: () => this.shell.activeWidget instanceof custom_editor_widget_1.CustomEditorWidget,
            execute: () => this.shell.activeWidget.undo()
        });
        commands.registerHandler(browser_1.CommonCommands.REDO.id, {
            isEnabled: () => this.shell.activeWidget instanceof custom_editor_widget_1.CustomEditorWidget,
            execute: () => this.shell.activeWidget.redo()
        });
    }
};
__decorate([
    (0, inversify_1.inject)(browser_1.ApplicationShell),
    __metadata("design:type", browser_1.ApplicationShell)
], CustomEditorContribution.prototype, "shell", void 0);
CustomEditorContribution = __decorate([
    (0, inversify_1.injectable)()
], CustomEditorContribution);
exports.CustomEditorContribution = CustomEditorContribution;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/custom-editors/custom-editor-contribution'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/custom-editors/custom-editor-widget-factory.js":
/*!*************************************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/custom-editors/custom-editor-widget-factory.js ***!
  \*************************************************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CustomEditorWidgetFactory = void 0;
const custom_editor_widget_1 = __webpack_require__(/*! ../custom-editors/custom-editor-widget */ "../../packages/plugin-ext/lib/main/browser/custom-editors/custom-editor-widget.js");
const webview_1 = __webpack_require__(/*! ../webview/webview */ "../../packages/plugin-ext/lib/main/browser/webview/webview.js");
const webview_environment_1 = __webpack_require__(/*! ../webview/webview-environment */ "../../packages/plugin-ext/lib/main/browser/webview/webview-environment.js");
class CustomEditorWidgetFactory {
    constructor(container) {
        this.id = custom_editor_widget_1.CustomEditorWidget.FACTORY_ID;
        this.container = container;
    }
    async createWidget(identifier) {
        const externalEndpoint = await this.container.get(webview_environment_1.WebviewEnvironment).externalEndpoint();
        let endpoint = externalEndpoint.replace('{{uuid}}', identifier.id);
        if (endpoint[endpoint.length - 1] === '/') {
            endpoint = endpoint.slice(0, endpoint.length - 1);
        }
        const child = this.container.createChild();
        child.bind(webview_1.WebviewWidgetIdentifier).toConstantValue(identifier);
        child.bind(webview_1.WebviewWidgetExternalEndpoint).toConstantValue(endpoint);
        return child.get(custom_editor_widget_1.CustomEditorWidget);
    }
}
exports.CustomEditorWidgetFactory = CustomEditorWidgetFactory;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/custom-editors/custom-editor-widget-factory'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/notebooks/renderers/cell-output-webview.js":
/*!*********************************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/notebooks/renderers/cell-output-webview.js ***!
  \*********************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2023 TypeFox and others.
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
exports.CellOutputWebviewImpl = exports.createCellOutputWebviewContainer = void 0;
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/notebook/lib/browser */ "../../packages/notebook/lib/browser/index.js");
const uuid_1 = __webpack_require__(/*! uuid */ "../../node_modules/uuid/dist/esm-browser/index.js");
const notebook_cell_model_1 = __webpack_require__(/*! @theia/notebook/lib/browser/view-model/notebook-cell-model */ "../../packages/notebook/lib/browser/view-model/notebook-cell-model.js");
const webview_1 = __webpack_require__(/*! ../../webview/webview */ "../../packages/plugin-ext/lib/main/browser/webview/webview.js");
const browser_2 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const output_webview_internal_1 = __webpack_require__(/*! ./output-webview-internal */ "../../packages/plugin-ext/lib/main/browser/notebooks/renderers/output-webview-internal.js");
const browser_3 = __webpack_require__(/*! @theia/workspace/lib/browser */ "../../packages/workspace/lib/browser/index.js");
const common_1 = __webpack_require__(/*! @theia/notebook/lib/common */ "../../packages/notebook/lib/common/index.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const CellModel = Symbol('CellModel');
function createCellOutputWebviewContainer(ctx, cell) {
    const child = ctx.createChild();
    child.bind(CellModel).toConstantValue(cell);
    child.bind(CellOutputWebviewImpl).toSelf().inSingletonScope();
    return child;
}
exports.createCellOutputWebviewContainer = createCellOutputWebviewContainer;
let CellOutputWebviewImpl = class CellOutputWebviewImpl {
    constructor() {
        this.id = (0, uuid_1.v4)();
        this.elementRef = React.createRef();
        this.outputPresentationListeners = new core_1.DisposableCollection();
    }
    async init() {
        this.cell.onDidChangeOutputs(outputChange => this.updateOutput(outputChange));
        this.webviewWidget = await this.widgetManager.getOrCreateWidget(webview_1.WebviewWidget.FACTORY_ID, { id: this.id });
        this.webviewWidget.setContentOptions({ allowScripts: true });
        this.webviewWidget.setHTML(await this.createWebviewContent());
        this.webviewWidget.onMessage((message) => {
            this.handleWebviewMessage(message);
        });
    }
    render() {
        return React.createElement("div", { className: 'theia-notebook-cell-output-webview', ref: this.elementRef });
    }
    attachWebview() {
        if (this.elementRef.current) {
            this.webviewWidget.processMessage(new browser_2.Message('before-attach'));
            this.elementRef.current.appendChild(this.webviewWidget.node);
            this.webviewWidget.processMessage(new browser_2.Message('after-attach'));
            this.webviewWidget.setIframeHeight(0);
        }
    }
    isAttached() {
        var _a, _b;
        return (_b = (_a = this.elementRef.current) === null || _a === void 0 ? void 0 : _a.contains(this.webviewWidget.node)) !== null && _b !== void 0 ? _b : false;
    }
    updateOutput(update) {
        if (this.cell.outputs.length > 0) {
            if (this.webviewWidget.isHidden) {
                this.webviewWidget.show();
            }
            this.outputPresentationListeners.dispose();
            this.outputPresentationListeners = new core_1.DisposableCollection();
            for (const output of this.cell.outputs) {
                this.outputPresentationListeners.push(output.onRequestOutputPresentationChange(() => this.requestOutputPresentationUpdate(output)));
            }
            const updateOutputMessage = {
                type: 'outputChanged',
                newOutputs: update.newOutputs.map(output => ({
                    id: output.outputId,
                    items: output.outputs.map(item => ({ mime: item.mime, data: item.data.buffer })),
                    metadata: output.metadata
                })),
                deletedOutputIds: this.cell.outputs.slice(update.start, update.start + update.deleteCount).map(output => output.outputId)
            };
            this.webviewWidget.sendMessage(updateOutputMessage);
        }
    }
    async requestOutputPresentationUpdate(output) {
        const selectedMime = await this.quickPickService.show(output.outputs.map(item => ({ label: item.mime })), { description: core_1.nls.localizeByDefault('Select mimetype to render for current output') });
        if (selectedMime) {
            this.webviewWidget.sendMessage({
                type: 'changePreferredMimetype',
                outputId: output.outputId,
                mimeType: selectedMime.label
            });
        }
    }
    handleWebviewMessage(message) {
        var _a, _b;
        switch (message.type) {
            case 'initialized':
                this.updateOutput({ newOutputs: this.cell.outputs, start: 0, deleteCount: 0 });
                break;
            case 'customRendererMessage':
                this.messagingService.getScoped('').postMessage(message.rendererId, message.message);
                break;
            case 'didRenderOutput':
                this.webviewWidget.setIframeHeight(message.contentHeight + 5);
                break;
            case 'did-scroll-wheel':
                (_b = this.notebookEditorWidgetService.getNotebookEditor(`notebook:${(_a = common_1.CellUri.parse(this.cell.uri)) === null || _a === void 0 ? void 0 : _a.notebook}`)) === null || _b === void 0 ? void 0 : _b.node.scrollBy(message.deltaX, message.deltaY);
                break;
        }
    }
    async createWebviewContent() {
        const isWorkspaceTrusted = await this.workspaceTrustService.getWorkspaceTrust();
        const preloads = this.preloadsScriptString(isWorkspaceTrusted);
        const content = `
            <html>
                <head>
                    <meta charset="UTF-8">
                </head>
                <body>
                    <script type="module">${preloads}</script>
                </body>
            </html>
        `;
        return content;
    }
    preloadsScriptString(isWorkspaceTrusted) {
        const ctx = {
            isWorkspaceTrusted,
            rendererData: this.notebookRendererRegistry.notebookRenderers,
            renderOptions: {
                lineLimit: 30,
                outputScrolling: false,
                outputWordWrap: false,
            }
        };
        // TS will try compiling `import()` in webviewPreloads, so use a helper function instead
        // of using `import(...)` directly
        return `
            const __import = (x) => import(x);
            (${output_webview_internal_1.outputWebviewPreload})(JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(ctx))}")))`;
    }
    dispose() {
        this.outputPresentationListeners.dispose();
        this.webviewWidget.dispose();
    }
};
__decorate([
    (0, inversify_1.inject)(browser_1.NotebookRendererMessagingService),
    __metadata("design:type", browser_1.NotebookRendererMessagingService)
], CellOutputWebviewImpl.prototype, "messagingService", void 0);
__decorate([
    (0, inversify_1.inject)(CellModel),
    __metadata("design:type", notebook_cell_model_1.NotebookCellModel)
], CellOutputWebviewImpl.prototype, "cell", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.WidgetManager),
    __metadata("design:type", browser_2.WidgetManager)
], CellOutputWebviewImpl.prototype, "widgetManager", void 0);
__decorate([
    (0, inversify_1.inject)(browser_3.WorkspaceTrustService),
    __metadata("design:type", browser_3.WorkspaceTrustService)
], CellOutputWebviewImpl.prototype, "workspaceTrustService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.NotebookRendererRegistry),
    __metadata("design:type", browser_1.NotebookRendererRegistry)
], CellOutputWebviewImpl.prototype, "notebookRendererRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.NotebookEditorWidgetService),
    __metadata("design:type", browser_1.NotebookEditorWidgetService)
], CellOutputWebviewImpl.prototype, "notebookEditorWidgetService", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.QuickPickService),
    __metadata("design:type", Object)
], CellOutputWebviewImpl.prototype, "quickPickService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CellOutputWebviewImpl.prototype, "init", null);
CellOutputWebviewImpl = __decorate([
    (0, inversify_1.injectable)()
], CellOutputWebviewImpl);
exports.CellOutputWebviewImpl = CellOutputWebviewImpl;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/notebooks/renderers/cell-output-webview'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/notebooks/renderers/output-webview-internal.js":
/*!*************************************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/notebooks/renderers/output-webview-internal.js ***!
  \*************************************************************************************************/
/***/ (function(__unused_webpack_module, exports) {


// *****************************************************************************
// Copyright (C) 2023 TypeFox and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.outputWebviewPreload = void 0;
;
;
async function outputWebviewPreload(ctx) {
    const theia = acquireVsCodeApi();
    const renderFallbackErrorName = 'vscode.fallbackToNextRenderer';
    function createEmitter(listenerChange = () => undefined) {
        const listeners = new Set();
        return {
            fire(data) {
                for (const listener of [...listeners]) {
                    listener.fn.call(listener.thisArg, data);
                }
            },
            event(fn, thisArg, disposables) {
                const listenerObj = { fn, thisArg };
                const disposable = {
                    dispose: () => {
                        listeners.delete(listenerObj);
                        listenerChange(listeners);
                    },
                };
                listeners.add(listenerObj);
                listenerChange(listeners);
                if (disposables) {
                    if ('push' in disposables) {
                        disposables.push(disposable);
                    }
                    else {
                        disposables.add(disposable);
                    }
                }
                return disposable;
            }
        };
    }
    ;
    const settingChange = createEmitter();
    class Output {
        constructor(output, items) {
            this.element = document.createElement('div');
            // padding for scrollbars
            this.element.style.paddingBottom = '10px';
            this.element.style.paddingRight = '10px';
            this.element.id = output.id;
            document.body.appendChild(this.element);
            this.allItems = items;
        }
        findItemToRender(preferredMimetype) {
            var _a;
            if (preferredMimetype) {
                const itemToRender = this.allItems.find(item => item.mime === preferredMimetype);
                if (itemToRender) {
                    return itemToRender;
                }
            }
            return (_a = this.renderedItem) !== null && _a !== void 0 ? _a : this.allItems[0];
        }
        clear() {
            var _a, _b, _c;
            (_b = (_a = this.renderer) === null || _a === void 0 ? void 0 : _a.disposeOutputItem) === null || _b === void 0 ? void 0 : _b.call(_a, (_c = this.renderedItem) === null || _c === void 0 ? void 0 : _c.id);
            this.element.innerHTML = '';
        }
    }
    const outputs = new Map();
    class Renderer {
        constructor(data) {
            this.data = data;
            this.onMessageEvent = createEmitter();
        }
        receiveMessage(message) {
            this.onMessageEvent.fire(message);
        }
        disposeOutputItem(id) {
            var _a, _b;
            (_b = (_a = this.rendererApi) === null || _a === void 0 ? void 0 : _a.disposeOutputItem) === null || _b === void 0 ? void 0 : _b.call(_a, id);
        }
        async getOrLoad() {
            if (this.rendererApi) {
                return this.rendererApi;
            }
            const rendererModule = await __import(this.data.entrypoint.uri);
            this.rendererApi = await rendererModule.activate(this.createRendererContext());
            return this.rendererApi;
        }
        createRendererContext() {
            const context = {
                setState: newState => theia.setState({ ...theia.getState(), [this.data.id]: newState }),
                getState: () => {
                    const state = theia.getState();
                    return typeof state === 'object' && state ? state[this.data.id] : undefined;
                },
                getRenderer: async (id) => {
                    const renderer = renderers.getRenderer(id);
                    if (!renderer) {
                        return undefined;
                    }
                    if (renderer.rendererApi) {
                        return renderer.rendererApi;
                    }
                    return renderer.getOrLoad();
                },
                workspace: {
                    get isTrusted() { return true; } // TODO use Workspace trust service
                },
                settings: {
                    get lineLimit() { return ctx.renderOptions.lineLimit; },
                    get outputScrolling() { return ctx.renderOptions.outputScrolling; },
                    get outputWordWrap() { return ctx.renderOptions.outputWordWrap; },
                },
                get onDidChangeSettings() { return settingChange.event; },
            };
            if (this.data.requiresMessaging) {
                context.onDidReceiveMessage = this.onMessageEvent.event;
                context.postMessage = message => theia.postMessage({ type: 'customRendererMessage', rendererId: this.data.id, message });
            }
            return Object.freeze(context);
        }
    }
    const renderers = new class {
        constructor() {
            this.renderers = new Map();
            for (const renderer of ctx.rendererData) {
                this.addRenderer(renderer);
            }
        }
        getRenderer(id) {
            return this.renderers.get(id);
        }
        rendererEqual(a, b) {
            if (a.id !== b.id || a.entrypoint.uri !== b.entrypoint.uri || a.entrypoint.extends !== b.entrypoint.extends || a.requiresMessaging !== b.requiresMessaging) {
                return false;
            }
            if (a.mimeTypes.length !== b.mimeTypes.length) {
                return false;
            }
            for (let i = 0; i < a.mimeTypes.length; i++) {
                if (a.mimeTypes[i] !== b.mimeTypes[i]) {
                    return false;
                }
            }
            return true;
        }
        updateRendererData(rendererData) {
            const oldKeys = new Set(this.renderers.keys());
            const newKeys = new Set(rendererData.map(d => d.id));
            for (const renderer of rendererData) {
                const existing = this.renderers.get(renderer.id);
                if (existing && this.rendererEqual(existing.data, renderer)) {
                    continue;
                }
                this.addRenderer(renderer);
            }
            for (const key of oldKeys) {
                if (!newKeys.has(key)) {
                    this.renderers.delete(key);
                }
            }
        }
        addRenderer(renderer) {
            this.renderers.set(renderer.id, new Renderer(renderer));
        }
        clearAll() {
            for (const renderer of this.renderers.values()) {
                renderer.disposeOutputItem();
            }
        }
        clearOutput(rendererId, outputId) {
            var _a;
            // outputRunner.cancelOutput(outputId);
            (_a = this.renderers.get(rendererId)) === null || _a === void 0 ? void 0 : _a.disposeOutputItem(outputId);
        }
        async render(output, preferredMimeType, preferredRendererId, signal) {
            const item = output.findItemToRender(preferredMimeType);
            const primaryRenderer = this.findRenderer(preferredRendererId, item);
            if (!primaryRenderer) {
                this.showRenderError(item, output.element, 'No renderer found for output type.');
                return;
            }
            // Try primary renderer first
            if (!(await this.doRender(item, output.element, primaryRenderer, signal)).continue) {
                output.renderer = primaryRenderer;
                this.onRenderCompleted();
                return;
            }
            // Primary renderer failed in an expected way. Fallback to render the next mime types
            for (const additionalItem of output.allItems) {
                if (additionalItem.mime === item.mime) {
                    continue;
                }
                if (signal.aborted) {
                    return;
                }
                if (additionalItem) {
                    const renderer = this.findRenderer(undefined, additionalItem);
                    if (renderer) {
                        if (!(await this.doRender(additionalItem, output.element, renderer, signal)).continue) {
                            output.renderer = renderer;
                            this.onRenderCompleted();
                            return; // We rendered successfully
                        }
                    }
                }
            }
            // All renderers have failed and there is nothing left to fallback to
            this.showRenderError(item, output.element, 'No fallback renderers found or all fallback renderers failed.');
        }
        onRenderCompleted() {
            // we need to check for all images are loaded. Otherwise we can't determine the correct height of the output
            const images = Array.from(document.images);
            if (images.length > 0) {
                Promise.all(images.filter(img => !img.complete).map(img => new Promise(resolve => { img.onload = img.onerror = resolve; }))).then(() => theia.postMessage({ type: 'didRenderOutput', contentHeight: document.body.clientHeight }));
            }
            else {
                theia.postMessage({ type: 'didRenderOutput', contentHeight: document.body.clientHeight });
            }
        }
        async doRender(item, element, renderer, signal) {
            var _a;
            try {
                (_a = (await renderer.getOrLoad())) === null || _a === void 0 ? void 0 : _a.renderOutputItem(item, element, signal);
                return { continue: false }; // We rendered successfully
            }
            catch (e) {
                if (signal.aborted) {
                    return { continue: false };
                }
                if (e instanceof Error && e.name === renderFallbackErrorName) {
                    return { continue: true };
                }
                else {
                    throw e; // Bail and let callers handle unknown errors
                }
            }
        }
        findRenderer(preferredRendererId, info) {
            let foundRenderer;
            if (typeof preferredRendererId === 'string') {
                foundRenderer = Array.from(this.renderers.values())
                    .find(renderer => renderer.data.id === preferredRendererId);
            }
            else {
                const rendererList = Array.from(this.renderers.values())
                    .filter(renderer => renderer.data.mimeTypes.includes(info.mime) && !renderer.data.entrypoint.extends);
                if (rendererList.length) {
                    // De-prioritize built-in renderers
                    // rendererList.sort((a, b) => +a.data.isBuiltin - +b.data.isBuiltin);
                    // Use first renderer we find in sorted list
                    foundRenderer = rendererList[0];
                }
            }
            return foundRenderer;
        }
        showRenderError(info, element, errorMessage) {
            const errorContainer = document.createElement('div');
            const error = document.createElement('div');
            error.className = 'no-renderer-error';
            error.innerText = errorMessage;
            const cellText = document.createElement('div');
            cellText.innerText = info.text();
            errorContainer.appendChild(error);
            errorContainer.appendChild(cellText);
            element.innerText = '';
            element.appendChild(errorContainer);
        }
    }();
    function clearOutput(outputId) {
        var _a;
        (_a = outputs.get(outputId)) === null || _a === void 0 ? void 0 : _a.clear();
        outputs.delete(outputId);
    }
    function outputsChanged(changedEvent) {
        var _a, _b;
        for (const outputId of (_a = changedEvent.deletedOutputIds) !== null && _a !== void 0 ? _a : []) {
            clearOutput(outputId);
        }
        for (const outputData of (_b = changedEvent.newOutputs) !== null && _b !== void 0 ? _b : []) {
            const apiItems = outputData.items.map((item, index) => ({
                id: `${outputData.id}-${index}`,
                mime: item.mime,
                metadata: outputData.metadata,
                data() {
                    return item.data;
                },
                text() {
                    return new TextDecoder().decode(this.data());
                },
                json() {
                    return JSON.parse(this.text());
                },
                blob() {
                    return new Blob([this.data()], { type: this.mime });
                },
            }));
            const output = new Output(outputData, apiItems);
            outputs.set(outputData.id, output);
            renderers.render(output, undefined, undefined, new AbortController().signal);
        }
    }
    function scrollParent(event) {
        for (let node = event.target; node; node = node.parentNode) {
            if (!(node instanceof Element)) {
                continue;
            }
            // scroll up
            if (event.deltaY < 0 && node.scrollTop > 0) {
                // there is still some content to scroll
                return false;
            }
            // scroll down
            if (event.deltaY > 0 && node.scrollTop + node.clientHeight < node.scrollHeight) {
                // per https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight
                // scrollTop is not rounded but scrollHeight and clientHeight are
                // so we need to check if the difference is less than some threshold
                if (node.scrollHeight - node.scrollTop - node.clientHeight > 2) {
                    return false;
                }
            }
        }
        return true;
    }
    const handleWheel = (event) => {
        if (scrollParent(event)) {
            theia.postMessage({
                type: 'did-scroll-wheel',
                deltaY: event.deltaY,
                deltaX: event.deltaX,
            });
        }
    };
    window.addEventListener('message', async (rawEvent) => {
        var _a;
        const event = rawEvent;
        switch (event.data.type) {
            case 'updateRenderers':
                renderers.updateRendererData(event.data.rendererData);
                break;
            case 'outputChanged':
                outputsChanged(event.data);
                break;
            case 'customRendererMessage':
                (_a = renderers.getRenderer(event.data.rendererId)) === null || _a === void 0 ? void 0 : _a.receiveMessage(event.data.message);
                break;
            case 'changePreferredMimetype':
                clearOutput(event.data.outputId);
                renderers.render(outputs.get(event.data.outputId), event.data.mimeType, undefined, new AbortController().signal);
                break;
        }
    });
    window.addEventListener('wheel', handleWheel);
    theia.postMessage({ type: 'initialized' });
}
exports.outputWebviewPreload = outputWebviewPreload;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/notebooks/renderers/output-webview-internal'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/output-channel-registry-main.js":
/*!**********************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/output-channel-registry-main.js ***!
  \**********************************************************************************/
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
exports.OutputChannelRegistryMainImpl = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const command_1 = __webpack_require__(/*! @theia/core/lib/common/command */ "../../packages/core/lib/common/command.js");
const output_commands_1 = __webpack_require__(/*! @theia/output/lib/browser/output-commands */ "../../packages/output/lib/browser/output-commands.js");
let OutputChannelRegistryMainImpl = class OutputChannelRegistryMainImpl {
    $append(name, text, pluginInfo) {
        this.commandService.executeCommand(output_commands_1.OutputCommands.APPEND.id, { name, text });
        return Promise.resolve();
    }
    $clear(name) {
        this.commandService.executeCommand(output_commands_1.OutputCommands.CLEAR.id, { name });
        return Promise.resolve();
    }
    $dispose(name) {
        this.commandService.executeCommand(output_commands_1.OutputCommands.DISPOSE.id, { name });
        return Promise.resolve();
    }
    async $reveal(name, preserveFocus) {
        const options = { preserveFocus };
        this.commandService.executeCommand(output_commands_1.OutputCommands.SHOW.id, { name, options });
    }
    $close(name) {
        this.commandService.executeCommand(output_commands_1.OutputCommands.HIDE.id, { name });
        return Promise.resolve();
    }
};
__decorate([
    (0, inversify_1.inject)(command_1.CommandService),
    __metadata("design:type", Object)
], OutputChannelRegistryMainImpl.prototype, "commandService", void 0);
OutputChannelRegistryMainImpl = __decorate([
    (0, inversify_1.injectable)()
], OutputChannelRegistryMainImpl);
exports.OutputChannelRegistryMainImpl = OutputChannelRegistryMainImpl;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/output-channel-registry-main'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/plugin-authentication-service.js":
/*!***********************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/plugin-authentication-service.js ***!
  \***********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2022 EclipseSource and others.
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
exports.PluginAuthenticationServiceImpl = exports.getAuthenticationProviderActivationEvent = void 0;
const authentication_service_1 = __webpack_require__(/*! @theia/core/lib/browser/authentication-service */ "../../packages/core/lib/browser/authentication-service.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const promise_util_1 = __webpack_require__(/*! @theia/core/lib/common/promise-util */ "../../packages/core/lib/common/promise-util.js");
const hosted_plugin_1 = __webpack_require__(/*! ../../hosted/browser/hosted-plugin */ "../../packages/plugin-ext/lib/hosted/browser/hosted-plugin.js");
function getAuthenticationProviderActivationEvent(id) { return `onAuthenticationRequest:${id}`; }
exports.getAuthenticationProviderActivationEvent = getAuthenticationProviderActivationEvent;
/**
 * Plugin authentication service that aims to activate additional plugins if sessions are created or queried.
 */
class PluginAuthenticationServiceImpl extends authentication_service_1.AuthenticationServiceImpl {
    async getSessions(id, scopes) {
        await this.tryActivateProvider(id);
        return super.getSessions(id, scopes);
    }
    async login(id, scopes) {
        await this.tryActivateProvider(id);
        return super.login(id, scopes);
    }
    async tryActivateProvider(providerId) {
        this.pluginService.activateByEvent(getAuthenticationProviderActivationEvent(providerId));
        const provider = this.authenticationProviders.get(providerId);
        if (provider) {
            return provider;
        }
        // When activate has completed, the extension has made the call to `registerAuthenticationProvider`.
        // However, activate cannot block on this, so the renderer may not have gotten the event yet.
        return Promise.race([
            this.waitForProviderRegistration(providerId),
            (0, promise_util_1.timeoutReject)(5000, 'Timed out waiting for authentication provider to register')
        ]);
    }
    async waitForProviderRegistration(providerId) {
        const waitForRegistration = new promise_util_1.Deferred();
        const registration = this.onDidRegisterAuthenticationProvider(info => {
            if (info.id === providerId) {
                registration.dispose();
                const provider = this.authenticationProviders.get(providerId);
                if (provider) {
                    waitForRegistration.resolve(provider);
                }
                else {
                    waitForRegistration.reject(new Error(`No authentication provider '${providerId}' is currently registered.`));
                }
            }
        });
        return waitForRegistration.promise;
    }
}
__decorate([
    (0, inversify_1.inject)(hosted_plugin_1.HostedPluginSupport),
    __metadata("design:type", hosted_plugin_1.HostedPluginSupport)
], PluginAuthenticationServiceImpl.prototype, "pluginService", void 0);
exports.PluginAuthenticationServiceImpl = PluginAuthenticationServiceImpl;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/plugin-authentication-service'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/plugin-ext-frontend-module.js":
/*!********************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/plugin-ext-frontend-module.js ***!
  \********************************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
__webpack_require__(/*! ../../../src/main/style/status-bar.css */ "../../packages/plugin-ext/src/main/style/status-bar.css");
__webpack_require__(/*! ../../../src/main/browser/style/index.css */ "../../packages/plugin-ext/src/main/browser/style/index.css");
__webpack_require__(/*! ../../../src/main/browser/style/comments.css */ "../../packages/plugin-ext/src/main/browser/style/comments.css");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const messaging_1 = __webpack_require__(/*! @theia/core/lib/browser/messaging */ "../../packages/core/lib/browser/messaging/index.js");
const hosted_plugin_1 = __webpack_require__(/*! ../../hosted/browser/hosted-plugin */ "../../packages/plugin-ext/lib/hosted/browser/hosted-plugin.js");
const hosted_plugin_watcher_1 = __webpack_require__(/*! ../../hosted/browser/hosted-plugin-watcher */ "../../packages/plugin-ext/lib/hosted/browser/hosted-plugin-watcher.js");
const commands_1 = __webpack_require__(/*! ./commands */ "../../packages/plugin-ext/lib/main/browser/commands.js");
const plugin_frontend_contribution_1 = __webpack_require__(/*! ./plugin-frontend-contribution */ "../../packages/plugin-ext/lib/main/browser/plugin-frontend-contribution.js");
const plugin_protocol_1 = __webpack_require__(/*! ../../common/plugin-protocol */ "../../packages/plugin-ext/lib/common/plugin-protocol.js");
const modal_notification_1 = __webpack_require__(/*! ./dialogs/modal-notification */ "../../packages/plugin-ext/lib/main/browser/dialogs/modal-notification.js");
const plugin_ext_widget_1 = __webpack_require__(/*! ./plugin-ext-widget */ "../../packages/plugin-ext/lib/main/browser/plugin-ext-widget.js");
const plugin_frontend_view_contribution_1 = __webpack_require__(/*! ./plugin-frontend-view-contribution */ "../../packages/plugin-ext/lib/main/browser/plugin-frontend-view-contribution.js");
const text_editor_model_service_1 = __webpack_require__(/*! ./text-editor-model-service */ "../../packages/plugin-ext/lib/main/browser/text-editor-model-service.js");
const menus_contribution_handler_1 = __webpack_require__(/*! ./menus/menus-contribution-handler */ "../../packages/plugin-ext/lib/main/browser/menus/menus-contribution-handler.js");
const plugin_contribution_handler_1 = __webpack_require__(/*! ./plugin-contribution-handler */ "../../packages/plugin-ext/lib/main/browser/plugin-contribution-handler.js");
const plugin_view_registry_1 = __webpack_require__(/*! ./view/plugin-view-registry */ "../../packages/plugin-ext/lib/main/browser/view/plugin-view-registry.js");
const workspace_main_1 = __webpack_require__(/*! ./workspace-main */ "../../packages/plugin-ext/lib/main/browser/workspace-main.js");
const plugin_ext_api_contribution_1 = __webpack_require__(/*! ../../common/plugin-ext-api-contribution */ "../../packages/plugin-ext/lib/common/plugin-ext-api-contribution.js");
const plugin_paths_protocol_1 = __webpack_require__(/*! ../common/plugin-paths-protocol */ "../../packages/plugin-ext/lib/main/common/plugin-paths-protocol.js");
const keybindings_contribution_handler_1 = __webpack_require__(/*! ./keybindings/keybindings-contribution-handler */ "../../packages/plugin-ext/lib/main/browser/keybindings/keybindings-contribution-handler.js");
const debug_session_contribution_1 = __webpack_require__(/*! @theia/debug/lib/browser/debug-session-contribution */ "../../packages/debug/lib/browser/debug-session-contribution.js");
const plugin_debug_session_contribution_registry_1 = __webpack_require__(/*! ./debug/plugin-debug-session-contribution-registry */ "../../packages/plugin-ext/lib/main/browser/debug/plugin-debug-session-contribution-registry.js");
const plugin_debug_service_1 = __webpack_require__(/*! ./debug/plugin-debug-service */ "../../packages/plugin-ext/lib/main/browser/debug/plugin-debug-service.js");
const debug_service_1 = __webpack_require__(/*! @theia/debug/lib/common/debug-service */ "../../packages/debug/lib/common/debug-service.js");
const plugin_shared_style_1 = __webpack_require__(/*! ./plugin-shared-style */ "../../packages/plugin-ext/lib/main/browser/plugin-shared-style.js");
const selection_provider_command_1 = __webpack_require__(/*! ./selection-provider-command */ "../../packages/plugin-ext/lib/main/browser/selection-provider-command.js");
const view_column_service_1 = __webpack_require__(/*! ./view-column-service */ "../../packages/plugin-ext/lib/main/browser/view-column-service.js");
const view_context_key_service_1 = __webpack_require__(/*! ./view/view-context-key-service */ "../../packages/plugin-ext/lib/main/browser/view/view-context-key-service.js");
const plugin_view_widget_1 = __webpack_require__(/*! ./view/plugin-view-widget */ "../../packages/plugin-ext/lib/main/browser/view/plugin-view-widget.js");
const tree_view_widget_1 = __webpack_require__(/*! ./view/tree-view-widget */ "../../packages/plugin-ext/lib/main/browser/view/tree-view-widget.js");
const rpc_protocol_1 = __webpack_require__(/*! ../../common/rpc-protocol */ "../../packages/plugin-ext/lib/common/rpc-protocol.js");
const common_2 = __webpack_require__(/*! ../../common */ "../../packages/plugin-ext/lib/common/index.js");
const languages_main_1 = __webpack_require__(/*! ./languages-main */ "../../packages/plugin-ext/lib/main/browser/languages-main.js");
const output_channel_registry_main_1 = __webpack_require__(/*! ./output-channel-registry-main */ "../../packages/plugin-ext/lib/main/browser/output-channel-registry-main.js");
const webview_1 = __webpack_require__(/*! ./webview/webview */ "../../packages/plugin-ext/lib/main/browser/webview/webview.js");
const webview_environment_1 = __webpack_require__(/*! ./webview/webview-environment */ "../../packages/plugin-ext/lib/main/browser/webview/webview-environment.js");
const webview_theme_data_provider_1 = __webpack_require__(/*! ./webview/webview-theme-data-provider */ "../../packages/plugin-ext/lib/main/browser/webview/webview-theme-data-provider.js");
const webview_preferences_1 = __webpack_require__(/*! ./webview/webview-preferences */ "../../packages/plugin-ext/lib/main/browser/webview/webview-preferences.js");
const webview_resource_cache_1 = __webpack_require__(/*! ./webview/webview-resource-cache */ "../../packages/plugin-ext/lib/main/browser/webview/webview-resource-cache.js");
const plugin_icon_theme_service_1 = __webpack_require__(/*! ./plugin-icon-theme-service */ "../../packages/plugin-ext/lib/main/browser/plugin-icon-theme-service.js");
const plugin_tree_view_node_label_provider_1 = __webpack_require__(/*! ./view/plugin-tree-view-node-label-provider */ "../../packages/plugin-ext/lib/main/browser/view/plugin-tree-view-node-label-provider.js");
const webview_widget_factory_1 = __webpack_require__(/*! ./webview/webview-widget-factory */ "../../packages/plugin-ext/lib/main/browser/webview/webview-widget-factory.js");
const comments_service_1 = __webpack_require__(/*! ./comments/comments-service */ "../../packages/plugin-ext/lib/main/browser/comments/comments-service.js");
const comments_decorator_1 = __webpack_require__(/*! ./comments/comments-decorator */ "../../packages/plugin-ext/lib/main/browser/comments/comments-decorator.js");
const comments_contribution_1 = __webpack_require__(/*! ./comments/comments-contribution */ "../../packages/plugin-ext/lib/main/browser/comments/comments-contribution.js");
const comments_context_key_service_1 = __webpack_require__(/*! ./comments/comments-context-key-service */ "../../packages/plugin-ext/lib/main/browser/comments/comments-context-key-service.js");
const custom_editor_contribution_1 = __webpack_require__(/*! ./custom-editors/custom-editor-contribution */ "../../packages/plugin-ext/lib/main/browser/custom-editors/custom-editor-contribution.js");
const plugin_custom_editor_registry_1 = __webpack_require__(/*! ./custom-editors/plugin-custom-editor-registry */ "../../packages/plugin-ext/lib/main/browser/custom-editors/plugin-custom-editor-registry.js");
const custom_editor_widget_factory_1 = __webpack_require__(/*! ../browser/custom-editors/custom-editor-widget-factory */ "../../packages/plugin-ext/lib/main/browser/custom-editors/custom-editor-widget-factory.js");
const custom_editor_widget_1 = __webpack_require__(/*! ./custom-editors/custom-editor-widget */ "../../packages/plugin-ext/lib/main/browser/custom-editors/custom-editor-widget.js");
const custom_editor_service_1 = __webpack_require__(/*! ./custom-editors/custom-editor-service */ "../../packages/plugin-ext/lib/main/browser/custom-editors/custom-editor-service.js");
const webview_frontend_security_warnings_1 = __webpack_require__(/*! ./webview/webview-frontend-security-warnings */ "../../packages/plugin-ext/lib/main/browser/webview/webview-frontend-security-warnings.js");
const plugin_authentication_service_1 = __webpack_require__(/*! ./plugin-authentication-service */ "../../packages/plugin-ext/lib/main/browser/plugin-authentication-service.js");
const authentication_service_1 = __webpack_require__(/*! @theia/core/lib/browser/authentication-service */ "../../packages/core/lib/browser/authentication-service.js");
const tree_view_decorator_service_1 = __webpack_require__(/*! ./view/tree-view-decorator-service */ "../../packages/plugin-ext/lib/main/browser/view/tree-view-decorator-service.js");
const vscode_theia_menu_mappings_1 = __webpack_require__(/*! ./menus/vscode-theia-menu-mappings */ "../../packages/plugin-ext/lib/main/browser/menus/vscode-theia-menu-mappings.js");
const plugin_menu_command_adapter_1 = __webpack_require__(/*! ./menus/plugin-menu-command-adapter */ "../../packages/plugin-ext/lib/main/browser/menus/plugin-menu-command-adapter.js");
__webpack_require__(/*! ./theme-icon-override */ "../../packages/plugin-ext/lib/main/browser/theme-icon-override.js");
const plugin_terminal_registry_1 = __webpack_require__(/*! ./plugin-terminal-registry */ "../../packages/plugin-ext/lib/main/browser/plugin-terminal-registry.js");
const dnd_file_content_store_1 = __webpack_require__(/*! ./view/dnd-file-content-store */ "../../packages/plugin-ext/lib/main/browser/view/dnd-file-content-store.js");
const webview_context_keys_1 = __webpack_require__(/*! ./webview/webview-context-keys */ "../../packages/plugin-ext/lib/main/browser/webview/webview-context-keys.js");
const language_pack_service_1 = __webpack_require__(/*! ../../common/language-pack-service */ "../../packages/plugin-ext/lib/common/language-pack-service.js");
const tab_bar_toolbar_1 = __webpack_require__(/*! @theia/core/lib/browser/shell/tab-bar-toolbar */ "../../packages/core/lib/browser/shell/tab-bar-toolbar/index.js");
const browser_2 = __webpack_require__(/*! @theia/notebook/lib/browser */ "../../packages/notebook/lib/browser/index.js");
const cell_output_webview_1 = __webpack_require__(/*! ./notebooks/renderers/cell-output-webview */ "../../packages/plugin-ext/lib/main/browser/notebooks/renderers/cell-output-webview.js");
exports["default"] = new inversify_1.ContainerModule((bind, unbind, isBound, rebind) => {
    bind(languages_main_1.LanguagesMainImpl).toSelf().inTransientScope();
    bind(common_2.LanguagesMainFactory).toFactory(context => (rpc) => {
        const child = context.container.createChild();
        child.bind(rpc_protocol_1.RPCProtocol).toConstantValue(rpc);
        return child.get(languages_main_1.LanguagesMainImpl);
    });
    bind(output_channel_registry_main_1.OutputChannelRegistryMainImpl).toSelf().inTransientScope();
    bind(common_2.OutputChannelRegistryFactory).toFactory(context => () => {
        const child = context.container.createChild();
        return child.get(output_channel_registry_main_1.OutputChannelRegistryMainImpl);
    });
    bind(modal_notification_1.ModalNotification).toSelf().inSingletonScope();
    bind(hosted_plugin_1.HostedPluginSupport).toSelf().inSingletonScope();
    bind(hosted_plugin_watcher_1.HostedPluginWatcher).toSelf().inSingletonScope();
    bind(selection_provider_command_1.SelectionProviderCommandContribution).toSelf().inSingletonScope();
    bind(common_1.CommandContribution).toService(selection_provider_command_1.SelectionProviderCommandContribution);
    bind(commands_1.OpenUriCommandHandler).toSelf().inSingletonScope();
    bind(plugin_frontend_contribution_1.PluginApiFrontendContribution).toSelf().inSingletonScope();
    bind(common_1.CommandContribution).toService(plugin_frontend_contribution_1.PluginApiFrontendContribution);
    bind(tab_bar_toolbar_1.TabBarToolbarContribution).toService(plugin_frontend_contribution_1.PluginApiFrontendContribution);
    bind(text_editor_model_service_1.EditorModelService).toSelf().inSingletonScope();
    bind(browser_1.FrontendApplicationContribution).toDynamicValue(ctx => ({
        onStart() {
            ctx.container.get(hosted_plugin_1.HostedPluginSupport).onStart(ctx.container);
        }
    }));
    bind(plugin_protocol_1.HostedPluginServer).toDynamicValue(ctx => {
        const connection = ctx.container.get(messaging_1.WebSocketConnectionProvider);
        const hostedWatcher = ctx.container.get(hosted_plugin_watcher_1.HostedPluginWatcher);
        return connection.createProxy(plugin_protocol_1.hostedServicePath, hostedWatcher.getHostedPluginClient());
    }).inSingletonScope();
    bind(plugin_paths_protocol_1.PluginPathsService).toDynamicValue(ctx => {
        const connection = ctx.container.get(messaging_1.WebSocketConnectionProvider);
        return connection.createProxy(plugin_paths_protocol_1.pluginPathsServicePath);
    }).inSingletonScope();
    (0, browser_1.bindViewContribution)(bind, plugin_frontend_view_contribution_1.PluginFrontendViewContribution);
    bind(plugin_ext_widget_1.PluginWidget).toSelf();
    bind(browser_1.WidgetFactory).toDynamicValue(ctx => ({
        id: plugin_frontend_view_contribution_1.PluginFrontendViewContribution.PLUGINS_WIDGET_FACTORY_ID,
        createWidget: () => ctx.container.get(plugin_ext_widget_1.PluginWidget)
    }));
    bind(plugin_protocol_1.PluginServer).toDynamicValue(ctx => {
        const provider = ctx.container.get(messaging_1.WebSocketConnectionProvider);
        return provider.createProxy(plugin_protocol_1.pluginServerJsonRpcPath);
    }).inSingletonScope();
    bind(view_context_key_service_1.ViewContextKeyService).toSelf().inSingletonScope();
    (0, tree_view_decorator_service_1.bindTreeViewDecoratorUtilities)(bind);
    bind(plugin_tree_view_node_label_provider_1.PluginTreeViewNodeLabelProvider).toSelf().inSingletonScope();
    bind(browser_1.LabelProviderContribution).toService(plugin_tree_view_node_label_provider_1.PluginTreeViewNodeLabelProvider);
    bind(dnd_file_content_store_1.DnDFileContentStore).toSelf().inSingletonScope();
    bind(browser_1.WidgetFactory).toDynamicValue(({ container }) => ({
        id: plugin_view_registry_1.PLUGIN_VIEW_DATA_FACTORY_ID,
        createWidget: (options) => {
            const props = {
                contextMenuPath: tree_view_widget_1.VIEW_ITEM_CONTEXT_MENU,
                expandOnlyOnExpansionToggleClick: true,
                expansionTogglePadding: 22,
                globalSelection: true,
                leftPadding: 8,
                search: true,
                multiSelect: options.multiSelect
            };
            const child = (0, browser_1.createTreeContainer)(container, {
                props,
                tree: tree_view_widget_1.PluginTree,
                model: tree_view_widget_1.PluginTreeModel,
                widget: tree_view_widget_1.TreeViewWidget,
                decoratorService: tree_view_decorator_service_1.TreeViewDecoratorService
            });
            child.bind(tree_view_widget_1.TreeViewWidgetOptions).toConstantValue(options);
            return child.get(browser_1.TreeWidget);
        }
    })).inSingletonScope();
    (0, webview_preferences_1.bindWebviewPreferences)(bind);
    bind(webview_environment_1.WebviewEnvironment).toSelf().inSingletonScope();
    bind(webview_theme_data_provider_1.WebviewThemeDataProvider).toSelf().inSingletonScope();
    bind(webview_resource_cache_1.WebviewResourceCache).toSelf().inSingletonScope();
    bind(webview_1.WebviewWidget).toSelf();
    bind(webview_widget_factory_1.WebviewWidgetFactory).toDynamicValue(ctx => new webview_widget_factory_1.WebviewWidgetFactory(ctx.container)).inSingletonScope();
    bind(browser_1.WidgetFactory).toService(webview_widget_factory_1.WebviewWidgetFactory);
    bind(webview_context_keys_1.WebviewContextKeys).toSelf().inSingletonScope();
    bind(browser_1.FrontendApplicationContribution).toService(webview_context_keys_1.WebviewContextKeys);
    bind(custom_editor_contribution_1.CustomEditorContribution).toSelf().inSingletonScope();
    bind(common_1.CommandContribution).toService(custom_editor_contribution_1.CustomEditorContribution);
    bind(plugin_custom_editor_registry_1.PluginCustomEditorRegistry).toSelf().inSingletonScope();
    bind(custom_editor_service_1.CustomEditorService).toSelf().inSingletonScope();
    bind(custom_editor_widget_1.CustomEditorWidget).toSelf();
    bind(custom_editor_widget_factory_1.CustomEditorWidgetFactory).toDynamicValue(ctx => new custom_editor_widget_factory_1.CustomEditorWidgetFactory(ctx.container)).inSingletonScope();
    bind(browser_1.WidgetFactory).toService(custom_editor_widget_factory_1.CustomEditorWidgetFactory);
    bind(plugin_view_widget_1.PluginViewWidget).toSelf();
    bind(browser_1.WidgetFactory).toDynamicValue(({ container }) => ({
        id: plugin_view_registry_1.PLUGIN_VIEW_FACTORY_ID,
        createWidget: (identifier) => {
            const child = container.createChild();
            child.bind(plugin_view_widget_1.PluginViewWidgetIdentifier).toConstantValue(identifier);
            return child.get(plugin_view_widget_1.PluginViewWidget);
        }
    })).inSingletonScope();
    bind(browser_1.WidgetFactory).toDynamicValue(({ container }) => ({
        id: plugin_view_registry_1.PLUGIN_VIEW_CONTAINER_FACTORY_ID,
        createWidget: (identifier) => container.get(browser_1.ViewContainer.Factory)(identifier)
    })).inSingletonScope();
    bind(plugin_shared_style_1.PluginSharedStyle).toSelf().inSingletonScope();
    bind(plugin_view_registry_1.PluginViewRegistry).toSelf().inSingletonScope();
    bind(browser_1.FrontendApplicationContribution).toService(plugin_view_registry_1.PluginViewRegistry);
    bind(plugin_icon_theme_service_1.PluginIconThemeFactory).toFactory(({ container }) => (definition) => {
        const child = container.createChild();
        child.bind(plugin_icon_theme_service_1.PluginIconThemeDefinition).toConstantValue(definition);
        child.bind(plugin_icon_theme_service_1.PluginIconTheme).toSelf().inSingletonScope();
        return child.get(plugin_icon_theme_service_1.PluginIconTheme);
    });
    bind(plugin_icon_theme_service_1.PluginIconThemeService).toSelf().inSingletonScope();
    bind(browser_1.LabelProviderContribution).toService(plugin_icon_theme_service_1.PluginIconThemeService);
    bind(menus_contribution_handler_1.MenusContributionPointHandler).toSelf().inSingletonScope();
    bind(plugin_menu_command_adapter_1.PluginMenuCommandAdapter).toSelf().inSingletonScope();
    bind(vscode_theia_menu_mappings_1.CodeEditorWidgetUtil).toSelf().inSingletonScope();
    bind(keybindings_contribution_handler_1.KeybindingsContributionPointHandler).toSelf().inSingletonScope();
    bind(plugin_contribution_handler_1.PluginContributionHandler).toSelf().inSingletonScope();
    bind(workspace_main_1.TextContentResourceResolver).toSelf().inSingletonScope();
    bind(common_1.ResourceResolver).toService(workspace_main_1.TextContentResourceResolver);
    (0, common_1.bindContributionProvider)(bind, plugin_ext_api_contribution_1.MainPluginApiProvider);
    bind(plugin_debug_service_1.PluginDebugService).toSelf().inSingletonScope();
    rebind(debug_service_1.DebugService).toService(plugin_debug_service_1.PluginDebugService);
    bind(plugin_debug_session_contribution_registry_1.PluginDebugSessionContributionRegistry).toSelf().inSingletonScope();
    rebind(debug_session_contribution_1.DebugSessionContributionRegistry).toService(plugin_debug_session_contribution_registry_1.PluginDebugSessionContributionRegistry);
    bind(view_column_service_1.ViewColumnService).toSelf().inSingletonScope();
    bind(comments_service_1.CommentsService).to(comments_service_1.PluginCommentService).inSingletonScope();
    bind(comments_decorator_1.CommentingRangeDecorator).toSelf().inSingletonScope();
    bind(comments_contribution_1.CommentsContribution).toSelf().inSingletonScope();
    bind(comments_context_key_service_1.CommentsContextKeyService).toSelf().inSingletonScope();
    bind(webview_frontend_security_warnings_1.WebviewFrontendSecurityWarnings).toSelf().inSingletonScope();
    bind(browser_1.FrontendApplicationContribution).toService(webview_frontend_security_warnings_1.WebviewFrontendSecurityWarnings);
    bind(plugin_authentication_service_1.PluginAuthenticationServiceImpl).toSelf().inSingletonScope();
    rebind(authentication_service_1.AuthenticationService).toService(plugin_authentication_service_1.PluginAuthenticationServiceImpl);
    bind(plugin_terminal_registry_1.PluginTerminalRegistry).toSelf().inSingletonScope();
    bind(language_pack_service_1.LanguagePackService).toDynamicValue(ctx => {
        const provider = ctx.container.get(messaging_1.WebSocketConnectionProvider);
        return provider.createProxy(language_pack_service_1.languagePackServicePath);
    }).inSingletonScope();
    bind(browser_2.CellOutputWebviewFactory).toFactory(ctx => async (cell) => (0, cell_output_webview_1.createCellOutputWebviewContainer)(ctx.container, cell).getAsync(cell_output_webview_1.CellOutputWebviewImpl));
});

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/plugin-ext-frontend-module'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/plugin-ext-widget.js":
/*!***********************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/plugin-ext-widget.js ***!
  \***********************************************************************/
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
exports.PluginWidget = exports.PLUGINS_LABEL = void 0;
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const react_widget_1 = __webpack_require__(/*! @theia/core/lib/browser/widgets/react-widget */ "../../packages/core/lib/browser/widgets/react-widget.js");
const alert_message_1 = __webpack_require__(/*! @theia/core/lib/browser/widgets/alert-message */ "../../packages/core/lib/browser/widgets/alert-message.js");
const hosted_plugin_1 = __webpack_require__(/*! ../../hosted/browser/hosted-plugin */ "../../packages/plugin-ext/lib/hosted/browser/hosted-plugin.js");
const progress_bar_factory_1 = __webpack_require__(/*! @theia/core/lib/browser/progress-bar-factory */ "../../packages/core/lib/browser/progress-bar-factory.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
exports.PLUGINS_LABEL = common_1.nls.localize('theia/plugin-ext/plugins', 'Plugins');
let PluginWidget = class PluginWidget extends react_widget_1.ReactWidget {
    constructor() {
        super();
        this.toDisposeProgress = new disposable_1.DisposableCollection();
        this.id = 'plugins';
        this.title.label = exports.PLUGINS_LABEL;
        this.title.caption = exports.PLUGINS_LABEL;
        this.title.iconClass = (0, browser_1.codicon)('diff-added');
        this.title.closable = true;
        this.node.tabIndex = 0;
        this.addClass('theia-plugins');
        this.update();
    }
    init() {
        this.toDispose.push(this.pluginService.onDidChangePlugins(() => this.update()));
    }
    onActivateRequest(msg) {
        super.onActivateRequest(msg);
        this.node.focus();
    }
    render() {
        return React.createElement("div", { ref: ref => {
                this.toDisposeProgress.dispose();
                this.toDispose.push(this.toDisposeProgress);
                if (ref) {
                    this.toDispose.push(this.progressBarFactory({ container: this.node, insertMode: 'prepend', locationId: hosted_plugin_1.PluginProgressLocation }));
                }
            } }, this.doRender());
    }
    doRender() {
        const plugins = this.pluginService.plugins;
        if (!plugins.length) {
            return React.createElement(alert_message_1.AlertMessage, { type: 'INFO', header: 'No plugins currently available.' });
        }
        return React.createElement(React.Fragment, null, this.renderPlugins(plugins));
    }
    renderPlugins(plugins) {
        return React.createElement("div", { id: 'pluginListContainer' }, plugins.sort((a, b) => this.compareMetadata(a, b)).map(plugin => this.renderPlugin(plugin)));
    }
    renderPlugin(plugin) {
        return React.createElement("div", { key: plugin.model.name, className: this.createPluginClassName(plugin) },
            React.createElement("div", { className: 'column flexcontainer pluginInformationContainer' },
                React.createElement("div", { className: 'row flexcontainer' },
                    React.createElement("div", { className: (0, browser_1.codicon)('list-selection') }),
                    React.createElement("div", { title: plugin.model.name, className: 'pluginName noWrapInfo' }, plugin.model.name)),
                React.createElement("div", { className: 'row flexcontainer' },
                    React.createElement("div", { className: 'pluginVersion' }, plugin.model.version)),
                React.createElement("div", { className: 'row flexcontainer' },
                    React.createElement("div", { className: 'pluginDescription noWrapInfo' }, plugin.model.description)),
                React.createElement("div", { className: 'row flexcontainer' },
                    React.createElement("div", { className: 'pluginPublisher noWrapInfo flexcontainer' }, plugin.model.publisher))));
    }
    createPluginClassName(plugin) {
        const classNames = ['pluginHeaderContainer'];
        return classNames.join(' ');
    }
    /**
     * Compare two plugins based on their names, and publishers.
     * @param a the first plugin metadata.
     * @param b the second plugin metadata.
     */
    compareMetadata(a, b) {
        // Determine the name of the plugins.
        const nameA = a.model.name.toLowerCase();
        const nameB = b.model.name.toLowerCase();
        // Determine the publisher of the plugin (when names are equal).
        const publisherA = a.model.publisher.toLowerCase();
        const publisherB = b.model.publisher.toLowerCase();
        return (nameA === nameA)
            ? nameA.localeCompare(nameB)
            : publisherA.localeCompare(publisherB);
    }
};
__decorate([
    (0, inversify_1.inject)(hosted_plugin_1.HostedPluginSupport),
    __metadata("design:type", hosted_plugin_1.HostedPluginSupport)
], PluginWidget.prototype, "pluginService", void 0);
__decorate([
    (0, inversify_1.inject)(progress_bar_factory_1.ProgressBarFactory),
    __metadata("design:type", Function)
], PluginWidget.prototype, "progressBarFactory", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PluginWidget.prototype, "init", null);
PluginWidget = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], PluginWidget);
exports.PluginWidget = PluginWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/plugin-ext-widget'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/plugin-frontend-contribution.js":
/*!**********************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/plugin-frontend-contribution.js ***!
  \**********************************************************************************/
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
var PluginApiFrontendContribution_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PluginApiFrontendContribution = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const commands_1 = __webpack_require__(/*! ./commands */ "../../packages/plugin-ext/lib/main/browser/commands.js");
const tree_view_widget_1 = __webpack_require__(/*! ./view/tree-view-widget */ "../../packages/plugin-ext/lib/main/browser/view/tree-view-widget.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const plugin_view_widget_1 = __webpack_require__(/*! ./view/plugin-view-widget */ "../../packages/plugin-ext/lib/main/browser/view/plugin-view-widget.js");
let PluginApiFrontendContribution = PluginApiFrontendContribution_1 = class PluginApiFrontendContribution {
    registerCommands(commands) {
        commands.registerCommand(commands_1.OpenUriCommandHandler.COMMAND_METADATA, {
            execute: (arg) => this.openUriCommandHandler.execute(arg),
            isVisible: () => false
        });
        commands.registerCommand(PluginApiFrontendContribution_1.COLLAPSE_ALL_COMMAND, {
            execute: (widget) => {
                if (widget instanceof plugin_view_widget_1.PluginViewWidget && widget.widgets[0] instanceof tree_view_widget_1.TreeViewWidget) {
                    const model = widget.widgets[0].model;
                    if (browser_1.CompositeTreeNode.is(model.root)) {
                        for (const child of model.root.children) {
                            if (browser_1.CompositeTreeNode.is(child)) {
                                model.collapseAll(child);
                            }
                        }
                    }
                }
            },
            isVisible: (widget) => widget instanceof plugin_view_widget_1.PluginViewWidget && widget.widgets[0] instanceof tree_view_widget_1.TreeViewWidget && widget.widgets[0].showCollapseAll
        });
    }
    registerToolbarItems(registry) {
        registry.registerItem({
            id: PluginApiFrontendContribution_1.COLLAPSE_ALL_COMMAND.id,
            command: PluginApiFrontendContribution_1.COLLAPSE_ALL_COMMAND.id,
            tooltip: PluginApiFrontendContribution_1.COLLAPSE_ALL_COMMAND.label,
            icon: PluginApiFrontendContribution_1.COLLAPSE_ALL_COMMAND.iconClass,
            priority: 1000
        });
    }
};
PluginApiFrontendContribution.COLLAPSE_ALL_COMMAND = common_1.Command.toDefaultLocalizedCommand({
    id: 'treeviews.collapseAll',
    iconClass: (0, browser_1.codicon)('collapse-all'),
    label: 'Collapse All'
});
__decorate([
    (0, inversify_1.inject)(commands_1.OpenUriCommandHandler),
    __metadata("design:type", commands_1.OpenUriCommandHandler)
], PluginApiFrontendContribution.prototype, "openUriCommandHandler", void 0);
PluginApiFrontendContribution = PluginApiFrontendContribution_1 = __decorate([
    (0, inversify_1.injectable)()
], PluginApiFrontendContribution);
exports.PluginApiFrontendContribution = PluginApiFrontendContribution;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/plugin-frontend-contribution'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/plugin-frontend-view-contribution.js":
/*!***************************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/plugin-frontend-view-contribution.js ***!
  \***************************************************************************************/
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
var PluginFrontendViewContribution_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PluginFrontendViewContribution = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const view_contribution_1 = __webpack_require__(/*! @theia/core/lib/browser/shell/view-contribution */ "../../packages/core/lib/browser/shell/view-contribution.js");
const plugin_ext_widget_1 = __webpack_require__(/*! ./plugin-ext-widget */ "../../packages/plugin-ext/lib/main/browser/plugin-ext-widget.js");
let PluginFrontendViewContribution = PluginFrontendViewContribution_1 = class PluginFrontendViewContribution extends view_contribution_1.AbstractViewContribution {
    constructor() {
        super({
            widgetId: PluginFrontendViewContribution_1.PLUGINS_WIDGET_FACTORY_ID,
            widgetName: plugin_ext_widget_1.PLUGINS_LABEL,
            defaultWidgetOptions: {
                area: 'left',
                rank: 400
            },
            toggleCommandId: 'pluginsView:toggle'
        });
    }
};
PluginFrontendViewContribution.PLUGINS_WIDGET_FACTORY_ID = 'plugins';
PluginFrontendViewContribution = PluginFrontendViewContribution_1 = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], PluginFrontendViewContribution);
exports.PluginFrontendViewContribution = PluginFrontendViewContribution;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/plugin-frontend-view-contribution'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/selection-provider-command.js":
/*!********************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/selection-provider-command.js ***!
  \********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2019 Red Hat, Inc. and others.
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
exports.SelectionProviderCommandContribution = exports.SelectionProviderCommands = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const uri_command_handler_1 = __webpack_require__(/*! @theia/core/lib/common/uri-command-handler */ "../../packages/core/lib/common/uri-command-handler.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const uri_components_1 = __webpack_require__(/*! ../../common/uri-components */ "../../packages/plugin-ext/lib/common/uri-components.js");
var SelectionProviderCommands;
(function (SelectionProviderCommands) {
    SelectionProviderCommands.GET_SELECTED_CONTEXT = {
        id: 'theia.plugin.workspace.selectedContext'
    };
})(SelectionProviderCommands = exports.SelectionProviderCommands || (exports.SelectionProviderCommands = {}));
let SelectionProviderCommandContribution = class SelectionProviderCommandContribution {
    registerCommands(commands) {
        commands.registerCommand(SelectionProviderCommands.GET_SELECTED_CONTEXT, this.newMultiUriAwareCommandHandler({
            isEnabled: () => true,
            isVisible: () => false,
            execute: (selectedUris) => selectedUris.map(uri => (0, uri_components_1.theiaUritoUriComponents)(uri))
        }));
    }
    newMultiUriAwareCommandHandler(handler) {
        return uri_command_handler_1.UriAwareCommandHandler.MultiSelect(this.selectionService, handler);
    }
};
__decorate([
    (0, inversify_1.inject)(core_1.SelectionService),
    __metadata("design:type", core_1.SelectionService)
], SelectionProviderCommandContribution.prototype, "selectionService", void 0);
SelectionProviderCommandContribution = __decorate([
    (0, inversify_1.injectable)()
], SelectionProviderCommandContribution);
exports.SelectionProviderCommandContribution = SelectionProviderCommandContribution;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/selection-provider-command'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/theme-icon-override.js":
/*!*************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/theme-icon-override.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2022 TypeFox and others.
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
const themeService_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/platform/theme/common/themeService */ "../../node_modules/@theia/monaco-editor-core/esm/vs/platform/theme/common/themeService.js");
// @monaco-uplift
// Keep this up-to-date with the table at https://code.visualstudio.com/api/references/icons-in-labels#icon-listing
const codeIconMap = {
    'accounts-view-bar-icon': 'account',
    'breakpoints-activate': 'activate-breakpoints',
    'breakpoints-remove-all': 'close-all',
    'breakpoints-view-icon': 'debug-alt',
    'callhierarchy-incoming': 'call-incoming',
    'callhierarchy-outgoing': 'call-outgoing',
    'callstack-view-icon': 'debug-alt',
    'callstack-view-session': 'bug',
    'comments-view-icon': 'comment-discussion',
    'debug-breakpoint': 'debug-breakpoint',
    'debug-breakpoint-conditional': 'debug-breakpoint-conditional',
    'debug-breakpoint-conditional-disabled': 'debug-breakpoint-conditional-disabled',
    'debug-breakpoint-conditional-verified': 'debug-breakpoint-conditional-unverified',
    'debug-breakpoint-data': 'debug-breakpoint-data',
    'debug-breakpoint-data-disabled': 'debug-breakpoint-data-disabled',
    'debug-breakpoint-data-unverified': 'debug-breakpoint-data-unverified',
    'debug-breakpoint-disabled': 'debug-breakpoint-disabled',
    'debug-breakpoint-function': 'debug-breakpoint-function',
    'debug-breakpoint-function-disabled': 'debug-breakpoint-function-disabled',
    'debug-breakpoint-function-unverified': 'debug-breakpoint-function-unverified',
    'debug-breakpoint-log': 'debug-breakpoint-log',
    'debug-breakpoint-log-disabled': 'debug-breakpoint-log-disabled',
    'debug-breakpoint-log-unverified': 'debug-breakpoint-log-unverified',
    'debug-breakpoint-unsupported': 'debug-breakpoint-unsupported',
    'debug-breakpoint-unverified': 'debug-breakpoint-unverified',
    'debug-collapse-all': 'collapse-all',
    'debug-configure': 'gear',
    'debug-console-clear-all': 'clear-all',
    'debug-console-evaluation-input': 'arrow-small-right',
    'debug-console-evaluation-prompt': 'chevron-right',
    'debug-console-view-icon': 'debug-console',
    'debug-continue': 'debug-continue',
    'debug-disconnect': 'debug-disconnect',
    'debug-gripper': 'gripper',
    'debug-hint': 'debug-hint',
    'debug-pause': 'debug-pause',
    'debug-restart': 'debug-restart',
    'debug-restart-frame': 'debug-restart-frame',
    'debug-reverse-continue': 'debug-reverse-continue',
    'debug-stackframe': 'debug-stackframe',
    'debug-stackframe-focused': 'debug-stackframe-focused',
    'debug-start': 'debug-start',
    'debug-step-back': 'debug-step-back',
    'debug-step-into': 'debug-step-into',
    'debug-step-out': 'debug-step-out',
    'debug-step-over': 'debug-step-over',
    'debug-stop': 'debug-stop',
    'default-view-icon': 'window',
    'diff-editor-next-change': 'arrow-down',
    'diff-editor-previous-change': 'arrow-up',
    'diff-editor-toggle-whitespace': 'whitespace',
    'diff-insert': 'add',
    'diff-remove': 'remove',
    'diff-review-close': 'close',
    'diff-review-insert': 'add',
    'diff-review-remove': 'remove',
    'explorer-view-icon': 'files',
    'extensions-clear-search-results': 'clear-all',
    'extensions-configure-recommended': 'pencil',
    'extensions-filter': 'filter',
    'extensions-info-message': 'info',
    'extensions-install-count': 'cloud-download',
    'extensions-install-local-in-remote': 'cloud-download',
    'extensions-install-workspace-recommended': 'cloud-download',
    'extensions-manage': 'gear',
    'extensions-rating': 'star',
    'extensions-refresh': 'refresh',
    'extensions-remote': 'remote',
    'extensions-star-empty': 'star-empty',
    'extensions-star-full': 'star-full',
    'extensions-star-half': 'star-half',
    'extensions-sync-enabled': 'sync',
    'extensions-sync-ignored': 'sync-ignored',
    'extensions-view-icon': 'extensions',
    'extensions-warning-message': 'warning',
    'find-collapsed': 'chevron-right',
    'find-expanded': 'chevron-down',
    'find-next-match': 'arrow-down',
    'find-previous-match': 'arrow-up',
    'find-replace': 'replace',
    'find-replace-all': 'replace-all',
    'find-selection': 'selection',
    'folding-collapsed': 'chevron-right',
    'folding-expanded': 'chevron-down',
    'getting-started-beginner': 'lightbulb',
    'getting-started-codespaces': 'github',
    'getting-started-item-checked': 'pass-filled',
    'getting-started-item-unchecked': 'circle-large-outline',
    'getting-started-setup': 'heart',
    'goto-next-location': 'arrow-down',
    'goto-previous-location': 'arrow-up',
    'keybindings-add': 'add',
    'keybindings-edit': 'edit',
    'keybindings-record-keys': 'record-keys',
    'keybindings-sort': 'sort-precedence',
    'loaded-scripts-view-icon': 'debug-alt',
    'marker-navigation-next': 'chevron-down',
    'marker-navigation-previous': 'chevron-up',
    'markers-view-filter': 'filter',
    'markers-view-icon': 'warning',
    'markers-view-multi-line-collapsed': 'chevron-down',
    'markers-view-multi-line-expanded': 'chevron-up',
    'notebook-clear': 'clear-all',
    'notebook-collapsed': 'chevron-right',
    'notebook-delete-cell': 'trash',
    'notebook-edit': 'pencil',
    'notebook-execute': 'play',
    'notebook-execute-all': 'run-all',
    'notebook-expanded': 'chevron-down',
    'notebook-kernel-configure': 'settings-gear',
    'notebook-kernel-select': 'server-environment',
    'notebook-mimetype': 'code',
    'notebook-move-down': 'arrow-down',
    'notebook-move-up': 'arrow-up',
    'notebook-open-as-text': 'file-code',
    'notebook-render-output': 'preview',
    'notebook-revert': 'discard',
    'notebook-split-cell': 'split-vertical',
    'notebook-state-error': 'error',
    'notebook-state-success': 'check',
    'notebook-stop': 'primitive-square',
    'notebook-stop-edit': 'check',
    'notebook-unfold': 'unfold',
    'notifications-clear': 'close',
    'notifications-clear-all': 'clear-all',
    'notifications-collapse': 'chevron-down',
    'notifications-configure': 'gear',
    'notifications-expand': 'chevron-up',
    'notifications-hide': 'chevron-down',
    'open-editors-view-icon': 'book',
    'outline-view-icon': 'symbol-class',
    'output-view-icon': 'output',
    'panel-close': 'close',
    'panel-maximize': 'chevron-up',
    'panel-restore': 'chevron-down',
    'parameter-hints-next': 'chevron-down',
    'parameter-hints-previous': 'chevron-up',
    'ports-forward-icon': 'plus',
    'ports-open-browser-icon': 'globe',
    'ports-stop-forward-icon': 'x',
    'ports-view-icon': 'plug',
    'preferences-clear-input': 'clear-all',
    'preferences-open-settings': 'go-to-file',
    'private-ports-view-icon': 'lock',
    'public-ports-view-icon': 'eye',
    'refactor-preview-view-icon': 'lightbulb',
    'remote-explorer-documentation': 'book',
    'remote-explorer-feedback': 'twitter',
    'remote-explorer-get-started': 'star',
    'remote-explorer-report-issues': 'comment',
    'remote-explorer-review-issues': 'issues',
    'remote-explorer-view-icon': 'remote-explorer',
    'review-comment-collapse': 'chevron-up',
    'run-view-icon': 'debug-alt',
    'search-clear-results': 'clear-all',
    'search-collapse-results': 'collapse-all',
    'search-details': 'ellipsis',
    'search-expand-results': 'expand-all',
    'search-hide-replace': 'chevron-right',
    'search-new-editor': 'new-file',
    'search-refresh': 'refresh',
    'search-remove': 'close',
    'search-replace': 'replace',
    'search-replace-all': 'replace-all',
    'search-show-context': 'list-selection',
    'search-show-replace': 'chevron-down',
    'search-stop': 'search-stop',
    'search-view-icon': 'search',
    'settings-add': 'add',
    'settings-discard': 'discard',
    'settings-edit': 'edit',
    'settings-folder-dropdown': 'triangle-down',
    'settings-group-collapsed': 'chevron-right',
    'settings-group-expanded': 'chevron-down',
    'settings-more-action': 'gear',
    'settings-remove': 'close',
    'settings-sync-view-icon': 'sync',
    'settings-view-bar-icon': 'settings-gear',
    'source-control-view-icon': 'source-control',
    'suggest-more-info': 'chevron-right',
    'tasks-list-configure': 'gear',
    'tasks-remove': 'close',
    'terminal-kill': 'trash',
    'terminal-new': 'add',
    'terminal-rename': 'gear',
    'terminal-view-icon': 'terminal',
    'test-view-icon': 'beaker',
    'testing-cancel-icon': 'close',
    'testing-debug-icon': 'debug-alt',
    'testing-error-icon': 'warning',
    'testing-failed-icon': 'close',
    'testing-passed-icon': 'pass',
    'testing-queued-icon': 'watch',
    'testing-run-all-icon': 'run-all',
    'testing-run-icon': 'run',
    'testing-show-as-list-icon': 'list-tree',
    'testing-skipped-icon': 'debug-step-over',
    'testing-unset-icon': 'circle-outline',
    'timeline-open': 'history',
    'timeline-pin': 'pin',
    'timeline-refresh': 'refresh',
    'timeline-unpin': 'pinned',
    'timeline-view-icon': 'history',
    'variables-view-icon': 'debug-alt',
    'view-pane-container-collapsed': 'chevron-right',
    'view-pane-container-expanded': 'chevron-down',
    'watch-expressions-add': 'add',
    'watch-expressions-add-function-breakpoint': 'add',
    'watch-expressions-remove-all': 'close-all',
    'watch-view-icon': 'debug-alt',
    'widget-close': 'close'
};
const originalAsCSSSelector = themeService_1.ThemeIcon.asCSSSelector;
const originalAsClassName = themeService_1.ThemeIcon.asClassName;
const originalAsClassNameArray = themeService_1.ThemeIcon.asClassNameArray;
function buildMappedIcon(icon) {
    var _a;
    const id = (_a = codeIconMap[icon.id]) !== null && _a !== void 0 ? _a : icon.id;
    const newIcon = {
        ...icon,
        id
    };
    return newIcon;
}
Object.assign(themeService_1.ThemeIcon, {
    asCSSSelector: (icon) => originalAsCSSSelector(buildMappedIcon(icon)),
    asClassName: (icon) => originalAsClassName(buildMappedIcon(icon)),
    asClassNameArray: (icon) => originalAsClassNameArray(buildMappedIcon(icon))
});

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/theme-icon-override'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/view/plugin-tree-view-node-label-provider.js":
/*!***********************************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/view/plugin-tree-view-node-label-provider.js ***!
  \***********************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2019 TypeFox and others.
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
exports.PluginTreeViewNodeLabelProvider = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const label_provider_1 = __webpack_require__(/*! @theia/core/lib/browser/label-provider */ "../../packages/core/lib/browser/label-provider.js");
const tree_label_provider_1 = __webpack_require__(/*! @theia/core/lib/browser/tree/tree-label-provider */ "../../packages/core/lib/browser/tree/tree-label-provider.js");
const tree_1 = __webpack_require__(/*! @theia/core/lib/browser/tree/tree */ "../../packages/core/lib/browser/tree/tree.js");
const themeService_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/platform/theme/common/themeService */ "../../node_modules/@theia/monaco-editor-core/esm/vs/platform/theme/common/themeService.js");
let PluginTreeViewNodeLabelProvider = class PluginTreeViewNodeLabelProvider {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    canHandle(element) {
        if (tree_1.TreeNode.is(element) && ('resourceUri' in element || 'themeIcon' in element)) {
            return Number.MAX_SAFE_INTEGER - 512;
        }
        return 0;
    }
    getIcon(node) {
        if (node.icon) {
            return node.icon;
        }
        if (node.themeIcon) {
            if (node.themeIcon.id === 'file' || node.themeIcon.id === 'folder') {
                const uri = node.resourceUri && new uri_1.default(node.resourceUri) || undefined;
                if (uri) {
                    return this.labelProvider.getIcon(label_provider_1.URIIconReference.create(node.themeIcon.id, uri));
                }
            }
            return themeService_1.ThemeIcon.asClassName(node.themeIcon);
        }
        if (node.resourceUri) {
            return this.labelProvider.getIcon(new uri_1.default(node.resourceUri));
        }
        return undefined;
    }
    getName(node) {
        if (node.name) {
            return node.name;
        }
        if (node.resourceUri) {
            return this.labelProvider.getName(new uri_1.default(node.resourceUri));
        }
        return undefined;
    }
    getLongName(node) {
        if (typeof node.description === 'string') {
            return node.description;
        }
        if (node.description === true && node.resourceUri) {
            return this.labelProvider.getLongName(new uri_1.default(node.resourceUri));
        }
        return undefined;
    }
};
__decorate([
    (0, inversify_1.inject)(label_provider_1.LabelProvider),
    __metadata("design:type", label_provider_1.LabelProvider)
], PluginTreeViewNodeLabelProvider.prototype, "labelProvider", void 0);
__decorate([
    (0, inversify_1.inject)(tree_label_provider_1.TreeLabelProvider),
    __metadata("design:type", tree_label_provider_1.TreeLabelProvider)
], PluginTreeViewNodeLabelProvider.prototype, "treeLabelProvider", void 0);
PluginTreeViewNodeLabelProvider = __decorate([
    (0, inversify_1.injectable)()
], PluginTreeViewNodeLabelProvider);
exports.PluginTreeViewNodeLabelProvider = PluginTreeViewNodeLabelProvider;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/view/plugin-tree-view-node-label-provider'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/view/tree-view-decorator-service.js":
/*!**************************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/view/tree-view-decorator-service.js ***!
  \**************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/********************************************************************************
 * Copyright (C) 2021 1C-Soft LLC and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.bindTreeViewDecoratorUtilities = exports.TreeViewDecoratorService = exports.TreeViewDecoratorAdapter = exports.TreeViewDecorator = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const tree_decorator_1 = __webpack_require__(/*! @theia/core/lib/browser/tree/tree-decorator */ "../../packages/core/lib/browser/tree/tree-decorator.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const browser_1 = __webpack_require__(/*! @theia/filesystem/lib/browser */ "../../packages/filesystem/lib/browser/index.js");
exports.TreeViewDecorator = Symbol('TreeViewDecorator');
let TreeViewDecoratorAdapter = class TreeViewDecoratorAdapter extends browser_1.FileTreeDecoratorAdapter {
    getUriForNode(node) {
        if (this.isTreeItem(node)) {
            return new uri_1.default(node.resourceUri).toString();
        }
    }
    isTreeItem(node) {
        return (0, core_1.isObject)(node) && !!node.resourceUri;
    }
};
TreeViewDecoratorAdapter = __decorate([
    (0, inversify_1.injectable)()
], TreeViewDecoratorAdapter);
exports.TreeViewDecoratorAdapter = TreeViewDecoratorAdapter;
let TreeViewDecoratorService = class TreeViewDecoratorService extends tree_decorator_1.AbstractTreeDecoratorService {
    constructor(contributions) {
        super(contributions.getContributions());
    }
};
TreeViewDecoratorService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(core_1.ContributionProvider)),
    __param(0, (0, inversify_1.named)(exports.TreeViewDecorator)),
    __metadata("design:paramtypes", [Object])
], TreeViewDecoratorService);
exports.TreeViewDecoratorService = TreeViewDecoratorService;
function bindTreeViewDecoratorUtilities(bind) {
    bind(TreeViewDecoratorAdapter).toSelf().inSingletonScope();
    (0, core_1.bindContributionProvider)(bind, exports.TreeViewDecorator);
    bind(exports.TreeViewDecorator).toService(TreeViewDecoratorAdapter);
}
exports.bindTreeViewDecoratorUtilities = bindTreeViewDecoratorUtilities;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/view/tree-view-decorator-service'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/webview/webview-context-keys.js":
/*!**********************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/webview/webview-context-keys.js ***!
  \**********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2023 Ericsson and others.
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
exports.WebviewContextKeys = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const context_key_service_1 = __webpack_require__(/*! @theia/core/lib/browser/context-key-service */ "../../packages/core/lib/browser/context-key-service.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const webview_1 = __webpack_require__(/*! ./webview */ "../../packages/plugin-ext/lib/main/browser/webview/webview.js");
let WebviewContextKeys = class WebviewContextKeys {
    init() {
        this.activeWebviewPanelId = this.contextKeyService.createKey('activeWebviewPanelId', '');
        this.applicationShell.onDidChangeCurrentWidget(this.handleDidChangeCurrentWidget, this);
    }
    handleDidChangeCurrentWidget(change) {
        if (change.newValue instanceof webview_1.WebviewWidget) {
            this.activeWebviewPanelId.set(change.newValue.viewType);
        }
        else {
            this.activeWebviewPanelId.set('');
        }
    }
};
__decorate([
    (0, inversify_1.inject)(browser_1.ApplicationShell),
    __metadata("design:type", browser_1.ApplicationShell)
], WebviewContextKeys.prototype, "applicationShell", void 0);
__decorate([
    (0, inversify_1.inject)(context_key_service_1.ContextKeyService),
    __metadata("design:type", Object)
], WebviewContextKeys.prototype, "contextKeyService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WebviewContextKeys.prototype, "init", null);
WebviewContextKeys = __decorate([
    (0, inversify_1.injectable)()
], WebviewContextKeys);
exports.WebviewContextKeys = WebviewContextKeys;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/webview/webview-context-keys'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/webview/webview-frontend-security-warnings.js":
/*!************************************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/webview/webview-frontend-security-warnings.js ***!
  \************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2021 Ericsson and others.
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
exports.WebviewFrontendSecurityWarnings = void 0;
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const frontend_application_config_provider_1 = __webpack_require__(/*! @theia/core/lib/browser/frontend-application-config-provider */ "../../packages/core/lib/browser/frontend-application-config-provider.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
const window_service_1 = __webpack_require__(/*! @theia/core/lib/browser/window/window-service */ "../../packages/core/lib/browser/window/window-service.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const webview_protocol_1 = __webpack_require__(/*! ../../common/webview-protocol */ "../../packages/plugin-ext/lib/main/common/webview-protocol.js");
const webview_environment_1 = __webpack_require__(/*! ./webview-environment */ "../../packages/plugin-ext/lib/main/browser/webview/webview-environment.js");
let WebviewFrontendSecurityWarnings = class WebviewFrontendSecurityWarnings {
    initialize() {
        this.checkHostPattern();
    }
    async checkHostPattern() {
        if (frontend_application_config_provider_1.FrontendApplicationConfigProvider.get()['warnOnPotentiallyInsecureHostPattern'] === false) {
            return;
        }
        const hostPattern = await this.webviewEnvironment.hostPatternPromise;
        if (hostPattern !== webview_protocol_1.WebviewExternalEndpoint.defaultPattern) {
            const goToReadme = nls_1.nls.localize('theia/webview/goToReadme', 'Go To README');
            const message = nls_1.nls.localize('theia/webview/messageWarning', '\
            The {0} endpoint\'s host pattern has been changed to `{1}`; changing the pattern can lead to security vulnerabilities. \
            See `{2}` for more information.', 'webview', hostPattern, '@theia/plugin-ext/README.md');
            this.messageService.warn(message, browser_1.Dialog.OK, goToReadme).then(action => {
                if (action === goToReadme) {
                    this.windowService.openNewWindow('https://www.npmjs.com/package/@theia/plugin-ext', { external: true });
                }
            });
        }
    }
};
__decorate([
    (0, inversify_1.inject)(window_service_1.WindowService),
    __metadata("design:type", Object)
], WebviewFrontendSecurityWarnings.prototype, "windowService", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.MessageService),
    __metadata("design:type", core_1.MessageService)
], WebviewFrontendSecurityWarnings.prototype, "messageService", void 0);
__decorate([
    (0, inversify_1.inject)(webview_environment_1.WebviewEnvironment),
    __metadata("design:type", webview_environment_1.WebviewEnvironment)
], WebviewFrontendSecurityWarnings.prototype, "webviewEnvironment", void 0);
WebviewFrontendSecurityWarnings = __decorate([
    (0, inversify_1.injectable)()
], WebviewFrontendSecurityWarnings);
exports.WebviewFrontendSecurityWarnings = WebviewFrontendSecurityWarnings;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/webview/webview-frontend-security-warnings'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/main/browser/webview/webview-widget-factory.js":
/*!************************************************************************************!*\
  !*** ../../packages/plugin-ext/lib/main/browser/webview/webview-widget-factory.js ***!
  \************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2020 Ericsson and others.
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
exports.WebviewWidgetFactory = void 0;
const webview_1 = __webpack_require__(/*! ./webview */ "../../packages/plugin-ext/lib/main/browser/webview/webview.js");
const webview_environment_1 = __webpack_require__(/*! ./webview-environment */ "../../packages/plugin-ext/lib/main/browser/webview/webview-environment.js");
class WebviewWidgetFactory {
    constructor(container) {
        this.id = webview_1.WebviewWidget.FACTORY_ID;
        this.container = container;
    }
    async createWidget(identifier) {
        const externalEndpoint = await this.container.get(webview_environment_1.WebviewEnvironment).externalEndpoint();
        let endpoint = externalEndpoint.replace('{{uuid}}', identifier.id);
        if (endpoint[endpoint.length - 1] === '/') {
            endpoint = endpoint.slice(0, endpoint.length - 1);
        }
        const child = this.container.createChild();
        child.bind(webview_1.WebviewWidgetIdentifier).toConstantValue(identifier);
        child.bind(webview_1.WebviewWidgetExternalEndpoint).toConstantValue(endpoint);
        return child.get(webview_1.WebviewWidget);
    }
}
exports.WebviewWidgetFactory = WebviewWidgetFactory;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/main/browser/webview/webview-widget-factory'] = this;


/***/ }),

/***/ "../../packages/plugin-ext/lib/plugin-ext-frontend-module.js":
/*!*******************************************************************!*\
  !*** ../../packages/plugin-ext/lib/plugin-ext-frontend-module.js ***!
  \*******************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
const plugin_ext_frontend_module_1 = __webpack_require__(/*! ./main/browser/plugin-ext-frontend-module */ "../../packages/plugin-ext/lib/main/browser/plugin-ext-frontend-module.js");
exports["default"] = plugin_ext_frontend_module_1.default;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/plugin-ext/lib/plugin-ext-frontend-module'] = this;


/***/ }),

/***/ "../../node_modules/css-loader/dist/cjs.js!../../packages/plugin-ext/src/main/browser/style/comments.css":
/*!***************************************************************************************************************!*\
  !*** ../../node_modules/css-loader/dist/cjs.js!../../packages/plugin-ext/src/main/browser/style/comments.css ***!
  \***************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "../../node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../../node_modules/css-loader/dist/runtime/api.js */ "../../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/* some code copied and modified from https://github.com/microsoft/vscode/blob/1.49.3/src/vs/workbench/contrib/comments/browser/media/review.css */

.comment-range-glyph {
    margin-left: 5px;
    cursor: pointer;
}
.comment-range-glyph:before {
    position: absolute;
    content: '';
    height: 100%;
    width: 0;
    left: -2px;
    transition: width 80ms linear, left 80ms linear;
}

.monaco-editor .margin-view-overlays > div:hover > .comment-range-glyph.comment-diff-added:before,
.monaco-editor .comment-range-glyph.comment-thread:before {
    position: absolute;
    height: 100%;
    width: 9px;
    left: -6px;
    z-index: 10;
    color: black;
    text-align: center;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}

.monaco-editor .comment-diff-added {
    border-left: 3px solid var(--theia-editorGutter-commentRangeForeground);
    transition: opacity 0.5s;
}
.monaco-editor .comment-diff-added:before {
    background: var(--theia-editorGutter-commentRangeForeground);
}

.monaco-editor .margin-view-overlays > div:hover > .comment-range-glyph.comment-diff-added:before {
    content: "+";
}

.monaco-editor .comment-range-glyph.comment-thread {
    z-index: 20;
    border-left: 3px solid #000;
}

.monaco-editor .comment-thread:before {
    background: var(--theia-editorGutter-commentRangeForeground);
}

.monaco-editor .comment-range-glyph.comment-thread:before {
    content: "◆";
    font-size: 10px;
    line-height: 100%;
    z-index: 20;
}

.monaco-editor .review-widget .body {
    overflow: hidden;
}

.monaco-editor .review-widget .head {
    box-sizing: border-box;
    display: flex;
    height: 100%;
}

.monaco-editor .review-widget .head .review-title {
    display: inline-block;
    font-size: 13px;
    margin-left: 20px;
    cursor: default;
}

.monaco-editor .review-widget .head .review-actions {
    flex: 1;
    text-align: right;
    padding-right: 2px;
}

.monaco-editor .review-widget .head .review-actions > .monaco-action-bar {
    display: inline-block;
}

.monaco-editor .review-widget .head .review-actions > .monaco-action-bar,
.monaco-editor .review-widget .head .review-actions > .monaco-action-bar > .actions-container {
    height: 100%;
}

.monaco-editor .review-widget .action-item {
    min-width: 18px;
    min-height: 20px;
    margin-left: 4px;
}

.monaco-editor .review-widget .head .review-actions > .monaco-action-bar .action-label {
    width: 16px;
    height: 100%;
    margin: 0;
    color: var(--theia-editorWidget-foreground);
    line-height: inherit;
    background-repeat: no-repeat;
    background-position: center center;
}

.monaco-editor .review-widget>.body {
    border-top: 1px solid;
    position: relative;
}

.monaco-editor .review-widget .body .comment-form {
    margin: 8px 20px;
}

.monaco-editor .review-widget .body .review-comment {
    padding: 8px 16px 8px 20px;
    display: flex;
}

.monaco-editor .review-widget .body .review-comment .avatar-container {
    margin-top: 4px !important;
}

.monaco-editor .review-widget .body .review-comment .avatar-container img.avatar {
    height: 28px;
    width: 28px;
    display: inline-block;
    overflow: hidden;
    line-height: 1;
    vertical-align: middle;
    border-radius: 3px;
    border-style: none;
}

.monaco-editor .review-widget .body .review-comment .review-comment-contents {
    padding-left: 20px;
    user-select: text;
    -webkit-user-select: text;
    width: 100%;
    overflow: hidden;
}

.monaco-editor .review-widget .body .review-comment .review-comment-contents .author {
    line-height: var(--theia-content-line-height);
}

.monaco-editor .review-widget .body .review-comment .review-comment-contents .timestamp {
    line-height: var(--theia-content-line-height);
    margin: 0 5px 0 5px;
    padding: 0 2px 0 2px;
}

.monaco-editor .review-widget .body .review-comment .review-comment-contents .isPending {
    margin: 0 5px 0 5px;
    padding: 0 2px 0 2px;
    font-style: italic;
}

.monaco-editor .review-widget .body .review-comment .review-comment-contents .comment-body {
    padding-top: 4px;
}

.monaco-editor .review-widget .body .review-comment .comment-title {
    display: flex;
    width: 100%;
}

.monaco-editor .review-widget .body .comment-form .theia-comments-input-message-container {
    display: none;
}

.monaco-editor .review-widget .body .comment-form.expand .theia-comments-input-message-container,
.edit-textarea .theia-comments-input-message-container {
    display: flex;
    flex-direction: column;
    margin: 0px 0px 7px 0px;
    max-height: 400px;
}

.monaco-editor .review-widget .body .comment-form.expand .theia-comments-input-message-container textarea,
.edit-textarea .theia-comments-input-message-container textarea {
    line-height: var(--theia-content-line-height);
    background: var(--theia-editor-background);
    resize: none;
    height: 90px;
    box-sizing: border-box;
    min-height: 32px;
    padding: 4px;
    border: none;
}

.monaco-editor .review-widget .body .comment-form.expand .theia-comments-input-message-container textarea:placeholder-shown,
.edit-textarea .theia-comments-input-message-container textarea:placeholder-shown {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.monaco-editor .review-widget .body .comment-form.expand .theia-comments-input-message-container textarea:not(:focus),
.edit-textarea .theia-comments-input-message-container textarea:not(:focus) {
    border: var(--theia-border-width) solid var(--theia-editor-background);
}

.monaco-editor .review-widget .body .comment-form.expand .theia-comments-input-message-container textarea:focus,
.edit-textarea .theia-comments-input-message-container textarea:focus {
    border: var(--theia-border-width) solid var(--theia-focusBorder);
}

.theia-comments-input-message {
    width: 100%;
}

.monaco-editor .review-widget .body .comment-body p,
.monaco-editor .review-widget .body .comment-body ul {
    margin: 8px 0;
}

.monaco-editor .review-widget .body .comment-body p:first-child,
.monaco-editor .review-widget .body .comment-body ul:first-child {
    margin-top: 0;
}

.monaco-editor .review-widget .body .comment-body p:last-child,
.monaco-editor .review-widget .body.comment-body ul:last-child {
    margin-bottom: 0;
}

.monaco-editor .review-widget .body .comment-body ul {
    padding-left: 20px;
}

.monaco-editor .review-widget .body .comment-body li > p {
    margin-bottom: 0;
}

.monaco-editor .review-widget .body .comment-body li > ul {
    margin-top: 0;
}

.monaco-editor .review-widget .body .comment-body code {
    border-radius: 3px;
    padding: 0 0.4em;
}

.monaco-editor .review-widget .body .comment-body span {
    white-space: pre;
}

.monaco-editor .review-widget .body .comment-body img {
    max-width: 100%;
}

.monaco-editor .review-widget .body .comment-form .form-actions {
    display: none;
}

.monaco-editor .review-widget .body .comment-form.expand .form-actions {
    display: block;
    box-sizing: content-box;
}

.monaco-editor .review-widget .body .comment-form.expand .review-thread-reply-button {
    display: none;
}

.monaco-editor .review-widget .body .comment-form .review-thread-reply-button {
    text-align: left;
    display: block;
    width: 100%;
    resize: vertical;
    background: var(--theia-editor-background);
    color: var(--theia-input-foreground);
    cursor: text;
    font-size: var(--theia-ui-font-size1);
    border-radius: 0;
    box-sizing: border-box;
    padding: 6px 12px;
    font-weight: 600;
    line-height: 20px;
    white-space: nowrap;
    border: 0px;
    outline: 1px solid transparent;
}

.monaco-editor .review-widget .body .comment-form .review-thread-reply-button:focus {
    outline-style: solid;
    outline-width: 1px;
}

.monaco-editor .review-widget .body .comment-form.expand .form-actions,
.monaco-editor .review-widget .body .edit-container .form-actions {
    overflow: auto;
    padding: 10px 0;
}

.monaco-editor .review-widget .body .edit-container .form-actions {
    display: flex;
    justify-content: flex-end;
}

.monaco-editor .review-widget .body .edit-textarea {
    margin: 5px 0 10px 0;
}

.monaco-editor .review-widget .body .comment-form.expand .comments-text-button,
.monaco-editor .review-widget .body .edit-container .comments-text-button {
    width: auto;
    padding: 4px 10px;
    margin-left: 5px;
    margin-bottom: 5px;
}

.monaco-editor .review-widget .body .comment-form.expand .comments-text-button {
    float: right;
}

.theia-comments-inline-actions-container {
    display: flex;
    justify-content: flex-end;
    margin-left: auto;
    min-height: 16px;
}

.theia-comments-inline-actions {
    display: flex;
    margin: 0 3px;
}

.theia-comments-inline-actions a {
    color: var(--theia-icon-foreground);
}

.theia-comments-inline-action {
    padding: 0px 3px;
    font-size: var(--theia-ui-font-size1);
    margin: 0 2px;
    cursor: pointer;
    display: flex;
    align-items: center;
}
`, "",{"version":3,"sources":["webpack://./../../packages/plugin-ext/src/main/browser/style/comments.css"],"names":[],"mappings":"AAAA;;;+FAG+F;AAC/F,kJAAkJ;;AAElJ;IACI,gBAAgB;IAChB,eAAe;AACnB;AACA;IACI,kBAAkB;IAClB,WAAW;IACX,YAAY;IACZ,QAAQ;IACR,UAAU;IACV,+CAA+C;AACnD;;AAEA;;IAEI,kBAAkB;IAClB,YAAY;IACZ,UAAU;IACV,UAAU;IACV,WAAW;IACX,YAAY;IACZ,kBAAkB;IAClB,aAAa;IACb,mBAAmB;IACnB,mBAAmB;IACnB,uBAAuB;AAC3B;;AAEA;IACI,uEAAuE;IACvE,wBAAwB;AAC5B;AACA;IACI,4DAA4D;AAChE;;AAEA;IACI,YAAY;AAChB;;AAEA;IACI,WAAW;IACX,2BAA2B;AAC/B;;AAEA;IACI,4DAA4D;AAChE;;AAEA;IACI,YAAY;IACZ,eAAe;IACf,iBAAiB;IACjB,WAAW;AACf;;AAEA;IACI,gBAAgB;AACpB;;AAEA;IACI,sBAAsB;IACtB,aAAa;IACb,YAAY;AAChB;;AAEA;IACI,qBAAqB;IACrB,eAAe;IACf,iBAAiB;IACjB,eAAe;AACnB;;AAEA;IACI,OAAO;IACP,iBAAiB;IACjB,kBAAkB;AACtB;;AAEA;IACI,qBAAqB;AACzB;;AAEA;;IAEI,YAAY;AAChB;;AAEA;IACI,eAAe;IACf,gBAAgB;IAChB,gBAAgB;AACpB;;AAEA;IACI,WAAW;IACX,YAAY;IACZ,SAAS;IACT,2CAA2C;IAC3C,oBAAoB;IACpB,4BAA4B;IAC5B,kCAAkC;AACtC;;AAEA;IACI,qBAAqB;IACrB,kBAAkB;AACtB;;AAEA;IACI,gBAAgB;AACpB;;AAEA;IACI,0BAA0B;IAC1B,aAAa;AACjB;;AAEA;IACI,0BAA0B;AAC9B;;AAEA;IACI,YAAY;IACZ,WAAW;IACX,qBAAqB;IACrB,gBAAgB;IAChB,cAAc;IACd,sBAAsB;IACtB,kBAAkB;IAClB,kBAAkB;AACtB;;AAEA;IACI,kBAAkB;IAClB,iBAAiB;IACjB,yBAAyB;IACzB,WAAW;IACX,gBAAgB;AACpB;;AAEA;IACI,6CAA6C;AACjD;;AAEA;IACI,6CAA6C;IAC7C,mBAAmB;IACnB,oBAAoB;AACxB;;AAEA;IACI,mBAAmB;IACnB,oBAAoB;IACpB,kBAAkB;AACtB;;AAEA;IACI,gBAAgB;AACpB;;AAEA;IACI,aAAa;IACb,WAAW;AACf;;AAEA;IACI,aAAa;AACjB;;AAEA;;IAEI,aAAa;IACb,sBAAsB;IACtB,uBAAuB;IACvB,iBAAiB;AACrB;;AAEA;;IAEI,6CAA6C;IAC7C,0CAA0C;IAC1C,YAAY;IACZ,YAAY;IACZ,sBAAsB;IACtB,gBAAgB;IAChB,YAAY;IACZ,YAAY;AAChB;;AAEA;;IAEI,gBAAgB;IAChB,uBAAuB;IACvB,mBAAmB;AACvB;;AAEA;;IAEI,sEAAsE;AAC1E;;AAEA;;IAEI,gEAAgE;AACpE;;AAEA;IACI,WAAW;AACf;;AAEA;;IAEI,aAAa;AACjB;;AAEA;;IAEI,aAAa;AACjB;;AAEA;;IAEI,gBAAgB;AACpB;;AAEA;IACI,kBAAkB;AACtB;;AAEA;IACI,gBAAgB;AACpB;;AAEA;IACI,aAAa;AACjB;;AAEA;IACI,kBAAkB;IAClB,gBAAgB;AACpB;;AAEA;IACI,gBAAgB;AACpB;;AAEA;IACI,eAAe;AACnB;;AAEA;IACI,aAAa;AACjB;;AAEA;IACI,cAAc;IACd,uBAAuB;AAC3B;;AAEA;IACI,aAAa;AACjB;;AAEA;IACI,gBAAgB;IAChB,cAAc;IACd,WAAW;IACX,gBAAgB;IAChB,0CAA0C;IAC1C,oCAAoC;IACpC,YAAY;IACZ,qCAAqC;IACrC,gBAAgB;IAChB,sBAAsB;IACtB,iBAAiB;IACjB,gBAAgB;IAChB,iBAAiB;IACjB,mBAAmB;IACnB,WAAW;IACX,8BAA8B;AAClC;;AAEA;IACI,oBAAoB;IACpB,kBAAkB;AACtB;;AAEA;;IAEI,cAAc;IACd,eAAe;AACnB;;AAEA;IACI,aAAa;IACb,yBAAyB;AAC7B;;AAEA;IACI,oBAAoB;AACxB;;AAEA;;IAEI,WAAW;IACX,iBAAiB;IACjB,gBAAgB;IAChB,kBAAkB;AACtB;;AAEA;IACI,YAAY;AAChB;;AAEA;IACI,aAAa;IACb,yBAAyB;IACzB,iBAAiB;IACjB,gBAAgB;AACpB;;AAEA;IACI,aAAa;IACb,aAAa;AACjB;;AAEA;IACI,mCAAmC;AACvC;;AAEA;IACI,gBAAgB;IAChB,qCAAqC;IACrC,aAAa;IACb,eAAe;IACf,aAAa;IACb,mBAAmB;AACvB","sourcesContent":["/*---------------------------------------------------------------------------------------------\n *  Copyright (c) Microsoft Corporation. All rights reserved.\n *  Licensed under the MIT License. See License.txt in the project root for license information.\n *--------------------------------------------------------------------------------------------*/\n/* some code copied and modified from https://github.com/microsoft/vscode/blob/1.49.3/src/vs/workbench/contrib/comments/browser/media/review.css */\n\n.comment-range-glyph {\n    margin-left: 5px;\n    cursor: pointer;\n}\n.comment-range-glyph:before {\n    position: absolute;\n    content: '';\n    height: 100%;\n    width: 0;\n    left: -2px;\n    transition: width 80ms linear, left 80ms linear;\n}\n\n.monaco-editor .margin-view-overlays > div:hover > .comment-range-glyph.comment-diff-added:before,\n.monaco-editor .comment-range-glyph.comment-thread:before {\n    position: absolute;\n    height: 100%;\n    width: 9px;\n    left: -6px;\n    z-index: 10;\n    color: black;\n    text-align: center;\n    display: flex;\n    flex-direction: row;\n    align-items: center;\n    justify-content: center;\n}\n\n.monaco-editor .comment-diff-added {\n    border-left: 3px solid var(--theia-editorGutter-commentRangeForeground);\n    transition: opacity 0.5s;\n}\n.monaco-editor .comment-diff-added:before {\n    background: var(--theia-editorGutter-commentRangeForeground);\n}\n\n.monaco-editor .margin-view-overlays > div:hover > .comment-range-glyph.comment-diff-added:before {\n    content: \"+\";\n}\n\n.monaco-editor .comment-range-glyph.comment-thread {\n    z-index: 20;\n    border-left: 3px solid #000;\n}\n\n.monaco-editor .comment-thread:before {\n    background: var(--theia-editorGutter-commentRangeForeground);\n}\n\n.monaco-editor .comment-range-glyph.comment-thread:before {\n    content: \"◆\";\n    font-size: 10px;\n    line-height: 100%;\n    z-index: 20;\n}\n\n.monaco-editor .review-widget .body {\n    overflow: hidden;\n}\n\n.monaco-editor .review-widget .head {\n    box-sizing: border-box;\n    display: flex;\n    height: 100%;\n}\n\n.monaco-editor .review-widget .head .review-title {\n    display: inline-block;\n    font-size: 13px;\n    margin-left: 20px;\n    cursor: default;\n}\n\n.monaco-editor .review-widget .head .review-actions {\n    flex: 1;\n    text-align: right;\n    padding-right: 2px;\n}\n\n.monaco-editor .review-widget .head .review-actions > .monaco-action-bar {\n    display: inline-block;\n}\n\n.monaco-editor .review-widget .head .review-actions > .monaco-action-bar,\n.monaco-editor .review-widget .head .review-actions > .monaco-action-bar > .actions-container {\n    height: 100%;\n}\n\n.monaco-editor .review-widget .action-item {\n    min-width: 18px;\n    min-height: 20px;\n    margin-left: 4px;\n}\n\n.monaco-editor .review-widget .head .review-actions > .monaco-action-bar .action-label {\n    width: 16px;\n    height: 100%;\n    margin: 0;\n    color: var(--theia-editorWidget-foreground);\n    line-height: inherit;\n    background-repeat: no-repeat;\n    background-position: center center;\n}\n\n.monaco-editor .review-widget>.body {\n    border-top: 1px solid;\n    position: relative;\n}\n\n.monaco-editor .review-widget .body .comment-form {\n    margin: 8px 20px;\n}\n\n.monaco-editor .review-widget .body .review-comment {\n    padding: 8px 16px 8px 20px;\n    display: flex;\n}\n\n.monaco-editor .review-widget .body .review-comment .avatar-container {\n    margin-top: 4px !important;\n}\n\n.monaco-editor .review-widget .body .review-comment .avatar-container img.avatar {\n    height: 28px;\n    width: 28px;\n    display: inline-block;\n    overflow: hidden;\n    line-height: 1;\n    vertical-align: middle;\n    border-radius: 3px;\n    border-style: none;\n}\n\n.monaco-editor .review-widget .body .review-comment .review-comment-contents {\n    padding-left: 20px;\n    user-select: text;\n    -webkit-user-select: text;\n    width: 100%;\n    overflow: hidden;\n}\n\n.monaco-editor .review-widget .body .review-comment .review-comment-contents .author {\n    line-height: var(--theia-content-line-height);\n}\n\n.monaco-editor .review-widget .body .review-comment .review-comment-contents .timestamp {\n    line-height: var(--theia-content-line-height);\n    margin: 0 5px 0 5px;\n    padding: 0 2px 0 2px;\n}\n\n.monaco-editor .review-widget .body .review-comment .review-comment-contents .isPending {\n    margin: 0 5px 0 5px;\n    padding: 0 2px 0 2px;\n    font-style: italic;\n}\n\n.monaco-editor .review-widget .body .review-comment .review-comment-contents .comment-body {\n    padding-top: 4px;\n}\n\n.monaco-editor .review-widget .body .review-comment .comment-title {\n    display: flex;\n    width: 100%;\n}\n\n.monaco-editor .review-widget .body .comment-form .theia-comments-input-message-container {\n    display: none;\n}\n\n.monaco-editor .review-widget .body .comment-form.expand .theia-comments-input-message-container,\n.edit-textarea .theia-comments-input-message-container {\n    display: flex;\n    flex-direction: column;\n    margin: 0px 0px 7px 0px;\n    max-height: 400px;\n}\n\n.monaco-editor .review-widget .body .comment-form.expand .theia-comments-input-message-container textarea,\n.edit-textarea .theia-comments-input-message-container textarea {\n    line-height: var(--theia-content-line-height);\n    background: var(--theia-editor-background);\n    resize: none;\n    height: 90px;\n    box-sizing: border-box;\n    min-height: 32px;\n    padding: 4px;\n    border: none;\n}\n\n.monaco-editor .review-widget .body .comment-form.expand .theia-comments-input-message-container textarea:placeholder-shown,\n.edit-textarea .theia-comments-input-message-container textarea:placeholder-shown {\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n}\n\n.monaco-editor .review-widget .body .comment-form.expand .theia-comments-input-message-container textarea:not(:focus),\n.edit-textarea .theia-comments-input-message-container textarea:not(:focus) {\n    border: var(--theia-border-width) solid var(--theia-editor-background);\n}\n\n.monaco-editor .review-widget .body .comment-form.expand .theia-comments-input-message-container textarea:focus,\n.edit-textarea .theia-comments-input-message-container textarea:focus {\n    border: var(--theia-border-width) solid var(--theia-focusBorder);\n}\n\n.theia-comments-input-message {\n    width: 100%;\n}\n\n.monaco-editor .review-widget .body .comment-body p,\n.monaco-editor .review-widget .body .comment-body ul {\n    margin: 8px 0;\n}\n\n.monaco-editor .review-widget .body .comment-body p:first-child,\n.monaco-editor .review-widget .body .comment-body ul:first-child {\n    margin-top: 0;\n}\n\n.monaco-editor .review-widget .body .comment-body p:last-child,\n.monaco-editor .review-widget .body.comment-body ul:last-child {\n    margin-bottom: 0;\n}\n\n.monaco-editor .review-widget .body .comment-body ul {\n    padding-left: 20px;\n}\n\n.monaco-editor .review-widget .body .comment-body li > p {\n    margin-bottom: 0;\n}\n\n.monaco-editor .review-widget .body .comment-body li > ul {\n    margin-top: 0;\n}\n\n.monaco-editor .review-widget .body .comment-body code {\n    border-radius: 3px;\n    padding: 0 0.4em;\n}\n\n.monaco-editor .review-widget .body .comment-body span {\n    white-space: pre;\n}\n\n.monaco-editor .review-widget .body .comment-body img {\n    max-width: 100%;\n}\n\n.monaco-editor .review-widget .body .comment-form .form-actions {\n    display: none;\n}\n\n.monaco-editor .review-widget .body .comment-form.expand .form-actions {\n    display: block;\n    box-sizing: content-box;\n}\n\n.monaco-editor .review-widget .body .comment-form.expand .review-thread-reply-button {\n    display: none;\n}\n\n.monaco-editor .review-widget .body .comment-form .review-thread-reply-button {\n    text-align: left;\n    display: block;\n    width: 100%;\n    resize: vertical;\n    background: var(--theia-editor-background);\n    color: var(--theia-input-foreground);\n    cursor: text;\n    font-size: var(--theia-ui-font-size1);\n    border-radius: 0;\n    box-sizing: border-box;\n    padding: 6px 12px;\n    font-weight: 600;\n    line-height: 20px;\n    white-space: nowrap;\n    border: 0px;\n    outline: 1px solid transparent;\n}\n\n.monaco-editor .review-widget .body .comment-form .review-thread-reply-button:focus {\n    outline-style: solid;\n    outline-width: 1px;\n}\n\n.monaco-editor .review-widget .body .comment-form.expand .form-actions,\n.monaco-editor .review-widget .body .edit-container .form-actions {\n    overflow: auto;\n    padding: 10px 0;\n}\n\n.monaco-editor .review-widget .body .edit-container .form-actions {\n    display: flex;\n    justify-content: flex-end;\n}\n\n.monaco-editor .review-widget .body .edit-textarea {\n    margin: 5px 0 10px 0;\n}\n\n.monaco-editor .review-widget .body .comment-form.expand .comments-text-button,\n.monaco-editor .review-widget .body .edit-container .comments-text-button {\n    width: auto;\n    padding: 4px 10px;\n    margin-left: 5px;\n    margin-bottom: 5px;\n}\n\n.monaco-editor .review-widget .body .comment-form.expand .comments-text-button {\n    float: right;\n}\n\n.theia-comments-inline-actions-container {\n    display: flex;\n    justify-content: flex-end;\n    margin-left: auto;\n    min-height: 16px;\n}\n\n.theia-comments-inline-actions {\n    display: flex;\n    margin: 0 3px;\n}\n\n.theia-comments-inline-actions a {\n    color: var(--theia-icon-foreground);\n}\n\n.theia-comments-inline-action {\n    padding: 0px 3px;\n    font-size: var(--theia-ui-font-size1);\n    margin: 0 2px;\n    cursor: pointer;\n    display: flex;\n    align-items: center;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../node_modules/css-loader/dist/cjs.js!../../packages/plugin-ext/src/main/browser/style/index.css":
/*!************************************************************************************************************!*\
  !*** ../../node_modules/css-loader/dist/cjs.js!../../packages/plugin-ext/src/main/browser/style/index.css ***!
  \************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "../../node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../../node_modules/css-loader/dist/runtime/api.js */ "../../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_plugin_sidebar_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! -!../../../../../../node_modules/css-loader/dist/cjs.js!./plugin-sidebar.css */ "../../node_modules/css-loader/dist/cjs.js!../../packages/plugin-ext/src/main/browser/style/plugin-sidebar.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_webview_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! -!../../../../../../node_modules/css-loader/dist/cjs.js!./webview.css */ "../../node_modules/css-loader/dist/cjs.js!../../packages/plugin-ext/src/main/browser/style/webview.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_tree_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! -!../../../../../../node_modules/css-loader/dist/cjs.js!./tree.css */ "../../node_modules/css-loader/dist/cjs.js!../../packages/plugin-ext/src/main/browser/style/tree.css");
// Imports





var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_plugin_sidebar_css__WEBPACK_IMPORTED_MODULE_2__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_webview_css__WEBPACK_IMPORTED_MODULE_3__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_tree_css__WEBPACK_IMPORTED_MODULE_4__["default"]);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/********************************************************************************
 * Copyright (C) 2018 Red Hat, Inc. and others.
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

.spinnerContainer {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.flexcontainer {
  display: flex;
}

.row {
  width: 100%;
}

.column {
  flex-direction: column;
}

.theia-plugin-view-container {
  /*
        It might take a second or two until the real plugin mask is loaded
        To prevent flickering on the icon, we set a transparent mask instead
        Since masks only support images, svg or gradients, we create a transparent gradient here
    */
  -webkit-mask: linear-gradient(transparent, transparent);
  mask: linear-gradient(transparent, transparent);
  background-color: var(--theia-activityBar-inactiveForeground);
}

.theia-plugin-file-icon,
.theia-plugin-file-icon::before,
.theia-plugin-folder-icon,
.theia-plugin-folder-icon::before,
.theia-plugin-folder-expanded-icon,
.theia-plugin-folder-expanded-icon::before,
.theia-plugin-root-folder-icon,
.theia-plugin-root-folder-icon::before,
.theia-plugin-root-folder-expanded-icon,
.theia-plugin-root-folder-expanded-icon::before {
  padding-right: var(--theia-ui-padding);
  width: var(--theia-icon-size);
  height: var(--theia-content-line-height);
  line-height: inherit !important;
  display: inline-block;
}

.p-TabBar.theia-app-sides .theia-plugin-file-icon,
.p-TabBar.theia-app-sides .theia-plugin-file-icon::before,
.p-TabBar.theia-app-sides .theia-plugin-folder-icon,
.p-TabBar.theia-app-sides .theia-plugin-folder-icon::before,
.p-TabBar.theia-app-sides .theia-plugin-folder-expanded-icon,
.p-TabBar.theia-app-sides .theia-plugin-folder-expanded-icon::before,
.p-TabBar.theia-app-sides .theia-plugin-root-folder-icon,
.p-TabBar.theia-app-sides .theia-plugin-root-folder-icon::before,
.p-TabBar.theia-app-sides .theia-plugin-root-folder-expanded-icon,
.p-TabBar.theia-app-sides .theia-plugin-root-folder-expanded-icon::before {
  padding: 0px !important;
  width: var(--theia-private-sidebar-icon-size) !important;
  height: var(--theia-private-sidebar-icon-size) !important;
  background-size: var(--theia-private-sidebar-icon-size) !important;
  font-size: var(--theia-private-sidebar-icon-size) !important;
}
`, "",{"version":3,"sources":["webpack://./../../packages/plugin-ext/src/main/browser/style/index.css"],"names":[],"mappings":"AAAA;;;;;;;;;;;;;;iFAciF;;AAEjF;EACE,WAAW;EACX,YAAY;EACZ,aAAa;EACb,mBAAmB;EACnB,uBAAuB;AACzB;;AAEA;EACE,aAAa;AACf;;AAEA;EACE,WAAW;AACb;;AAEA;EACE,sBAAsB;AACxB;;AAEA;EACE;;;;KAIG;EACH,uDAAuD;EACvD,+CAA+C;EAC/C,6DAA6D;AAC/D;;AAEA;;;;;;;;;;EAUE,sCAAsC;EACtC,6BAA6B;EAC7B,wCAAwC;EACxC,+BAA+B;EAC/B,qBAAqB;AACvB;;AAEA;;;;;;;;;;EAUE,uBAAuB;EACvB,wDAAwD;EACxD,yDAAyD;EACzD,kEAAkE;EAClE,4DAA4D;AAC9D","sourcesContent":["/********************************************************************************\n * Copyright (C) 2018 Red Hat, Inc. and others.\n *\n * This program and the accompanying materials are made available under the\n * terms of the Eclipse Public License v. 2.0 which is available at\n * http://www.eclipse.org/legal/epl-2.0.\n *\n * This Source Code may also be made available under the following Secondary\n * Licenses when the conditions for such availability set forth in the Eclipse\n * Public License v. 2.0 are satisfied: GNU General Public License, version 2\n * with the GNU Classpath Exception which is available at\n * https://www.gnu.org/software/classpath/license.html.\n *\n * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0\n ********************************************************************************/\n\n.spinnerContainer {\n  width: 100%;\n  height: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.flexcontainer {\n  display: flex;\n}\n\n.row {\n  width: 100%;\n}\n\n.column {\n  flex-direction: column;\n}\n\n.theia-plugin-view-container {\n  /*\n        It might take a second or two until the real plugin mask is loaded\n        To prevent flickering on the icon, we set a transparent mask instead\n        Since masks only support images, svg or gradients, we create a transparent gradient here\n    */\n  -webkit-mask: linear-gradient(transparent, transparent);\n  mask: linear-gradient(transparent, transparent);\n  background-color: var(--theia-activityBar-inactiveForeground);\n}\n\n.theia-plugin-file-icon,\n.theia-plugin-file-icon::before,\n.theia-plugin-folder-icon,\n.theia-plugin-folder-icon::before,\n.theia-plugin-folder-expanded-icon,\n.theia-plugin-folder-expanded-icon::before,\n.theia-plugin-root-folder-icon,\n.theia-plugin-root-folder-icon::before,\n.theia-plugin-root-folder-expanded-icon,\n.theia-plugin-root-folder-expanded-icon::before {\n  padding-right: var(--theia-ui-padding);\n  width: var(--theia-icon-size);\n  height: var(--theia-content-line-height);\n  line-height: inherit !important;\n  display: inline-block;\n}\n\n.p-TabBar.theia-app-sides .theia-plugin-file-icon,\n.p-TabBar.theia-app-sides .theia-plugin-file-icon::before,\n.p-TabBar.theia-app-sides .theia-plugin-folder-icon,\n.p-TabBar.theia-app-sides .theia-plugin-folder-icon::before,\n.p-TabBar.theia-app-sides .theia-plugin-folder-expanded-icon,\n.p-TabBar.theia-app-sides .theia-plugin-folder-expanded-icon::before,\n.p-TabBar.theia-app-sides .theia-plugin-root-folder-icon,\n.p-TabBar.theia-app-sides .theia-plugin-root-folder-icon::before,\n.p-TabBar.theia-app-sides .theia-plugin-root-folder-expanded-icon,\n.p-TabBar.theia-app-sides .theia-plugin-root-folder-expanded-icon::before {\n  padding: 0px !important;\n  width: var(--theia-private-sidebar-icon-size) !important;\n  height: var(--theia-private-sidebar-icon-size) !important;\n  background-size: var(--theia-private-sidebar-icon-size) !important;\n  font-size: var(--theia-private-sidebar-icon-size) !important;\n}\n\n@import \"./plugin-sidebar.css\";\n@import \"./webview.css\";\n@import \"./tree.css\";\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../node_modules/css-loader/dist/cjs.js!../../packages/plugin-ext/src/main/browser/style/plugin-sidebar.css":
/*!*********************************************************************************************************************!*\
  !*** ../../node_modules/css-loader/dist/cjs.js!../../packages/plugin-ext/src/main/browser/style/plugin-sidebar.css ***!
  \*********************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "../../node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../../node_modules/css-loader/dist/runtime/api.js */ "../../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/********************************************************************************
 * Copyright (C) 2018 Red Hat, Inc. and others.
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

.theia-plugins {
  min-width: 250px !important;
  display: flex;
  flex-direction: column;
}

#pluginListContainer {
  width: 100%;
  box-sizing: border-box;
  overflow-y: auto;
  flex-grow: 1;
}

.theia-plugins .pluginHeaderContainer {
  padding: 5px 15px;
  font-size: var(--theia-ui-font-size0);
}

.theia-side-panel .theia-plugins .pluginHeaderContainer {
  padding-left: 20px;
}

.theia-plugins .pluginHeaderContainer:hover {
  background: var(--theia-list-hoverBackground);
}

.theia-plugins .pluginHeaderContainer .row {
  margin: 3px 0;
}

.theia-plugins .pluginName {
  flex: 1;
  margin-right: 5px;
  margin-left: 4px;
  font-size: var(--theia-ui-font-size1);
  font-weight: 400;
}

.theia-plugins .pluginVersion {
  flex: 1;
  text-align: left;
  font-size: var(--theia-ui-font-size0);
}

.theia-plugins .pluginDescription {
  flex: 1;
}

.theia-plugins .pluginPublisher {
  font-size: var(--theia-ui-font-size0);
  flex: 5;
  align-items: center;
}

.plugins-tab-icon::before {
  content: "\\f0fe";
}
`, "",{"version":3,"sources":["webpack://./../../packages/plugin-ext/src/main/browser/style/plugin-sidebar.css"],"names":[],"mappings":"AAAA;;;;;;;;;;;;;;iFAciF;;AAEjF;EACE,2BAA2B;EAC3B,aAAa;EACb,sBAAsB;AACxB;;AAEA;EACE,WAAW;EACX,sBAAsB;EACtB,gBAAgB;EAChB,YAAY;AACd;;AAEA;EACE,iBAAiB;EACjB,qCAAqC;AACvC;;AAEA;EACE,kBAAkB;AACpB;;AAEA;EACE,6CAA6C;AAC/C;;AAEA;EACE,aAAa;AACf;;AAEA;EACE,OAAO;EACP,iBAAiB;EACjB,gBAAgB;EAChB,qCAAqC;EACrC,gBAAgB;AAClB;;AAEA;EACE,OAAO;EACP,gBAAgB;EAChB,qCAAqC;AACvC;;AAEA;EACE,OAAO;AACT;;AAEA;EACE,qCAAqC;EACrC,OAAO;EACP,mBAAmB;AACrB;;AAEA;EACE,gBAAgB;AAClB","sourcesContent":["/********************************************************************************\n * Copyright (C) 2018 Red Hat, Inc. and others.\n *\n * This program and the accompanying materials are made available under the\n * terms of the Eclipse Public License v. 2.0 which is available at\n * http://www.eclipse.org/legal/epl-2.0.\n *\n * This Source Code may also be made available under the following Secondary\n * Licenses when the conditions for such availability set forth in the Eclipse\n * Public License v. 2.0 are satisfied: GNU General Public License, version 2\n * with the GNU Classpath Exception which is available at\n * https://www.gnu.org/software/classpath/license.html.\n *\n * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0\n ********************************************************************************/\n\n.theia-plugins {\n  min-width: 250px !important;\n  display: flex;\n  flex-direction: column;\n}\n\n#pluginListContainer {\n  width: 100%;\n  box-sizing: border-box;\n  overflow-y: auto;\n  flex-grow: 1;\n}\n\n.theia-plugins .pluginHeaderContainer {\n  padding: 5px 15px;\n  font-size: var(--theia-ui-font-size0);\n}\n\n.theia-side-panel .theia-plugins .pluginHeaderContainer {\n  padding-left: 20px;\n}\n\n.theia-plugins .pluginHeaderContainer:hover {\n  background: var(--theia-list-hoverBackground);\n}\n\n.theia-plugins .pluginHeaderContainer .row {\n  margin: 3px 0;\n}\n\n.theia-plugins .pluginName {\n  flex: 1;\n  margin-right: 5px;\n  margin-left: 4px;\n  font-size: var(--theia-ui-font-size1);\n  font-weight: 400;\n}\n\n.theia-plugins .pluginVersion {\n  flex: 1;\n  text-align: left;\n  font-size: var(--theia-ui-font-size0);\n}\n\n.theia-plugins .pluginDescription {\n  flex: 1;\n}\n\n.theia-plugins .pluginPublisher {\n  font-size: var(--theia-ui-font-size0);\n  flex: 5;\n  align-items: center;\n}\n\n.plugins-tab-icon::before {\n  content: \"\\f0fe\";\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../node_modules/css-loader/dist/cjs.js!../../packages/plugin-ext/src/main/browser/style/tree.css":
/*!***********************************************************************************************************!*\
  !*** ../../node_modules/css-loader/dist/cjs.js!../../packages/plugin-ext/src/main/browser/style/tree.css ***!
  \***********************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "../../node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../../node_modules/css-loader/dist/runtime/api.js */ "../../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/********************************************************************************
 * Copyright (C) 2018 Red Hat, Inc. and others.
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

.theia-tree-view-icon {
  padding-right: var(--theia-ui-padding);
  -webkit-font-smoothing: antialiased;
  flex-shrink: 0;
  padding-left: 6px;
  margin-left: -6px;
}

.theia-tree-view-inline-action {
  padding: 2px;
}

.theia-tree-view-description {
  color: var(--theia-descriptionForeground);
  font-size: var(--theia-ui-font-size0);
  margin-left: var(--theia-ui-padding);
}

.theia-tree-view .theia-TreeNodeContent {
  align-items: center;
  height: 100%;
}

.theia-tree-view .theia-TreeContainer .theia-TreeViewInfo {
  margin-top: 7px;
  margin-bottom: 10px;
  margin-left: 17px;
}

.theia-tree-view
  .theia-TreeNode:not(:hover):not(.theia-mod-selected)
  .theia-tree-view-inline-action {
  display: none;
}

.codicon.icon-inline {
  font-size: var(--theia-ui-font-size1);
}
`, "",{"version":3,"sources":["webpack://./../../packages/plugin-ext/src/main/browser/style/tree.css"],"names":[],"mappings":"AAAA;;;;;;;;;;;;;;iFAciF;;AAEjF;EACE,sCAAsC;EACtC,mCAAmC;EACnC,cAAc;EACd,iBAAiB;EACjB,iBAAiB;AACnB;;AAEA;EACE,YAAY;AACd;;AAEA;EACE,yCAAyC;EACzC,qCAAqC;EACrC,oCAAoC;AACtC;;AAEA;EACE,mBAAmB;EACnB,YAAY;AACd;;AAEA;EACE,eAAe;EACf,mBAAmB;EACnB,iBAAiB;AACnB;;AAEA;;;EAGE,aAAa;AACf;;AAEA;EACE,qCAAqC;AACvC","sourcesContent":["/********************************************************************************\n * Copyright (C) 2018 Red Hat, Inc. and others.\n *\n * This program and the accompanying materials are made available under the\n * terms of the Eclipse Public License v. 2.0 which is available at\n * http://www.eclipse.org/legal/epl-2.0.\n *\n * This Source Code may also be made available under the following Secondary\n * Licenses when the conditions for such availability set forth in the Eclipse\n * Public License v. 2.0 are satisfied: GNU General Public License, version 2\n * with the GNU Classpath Exception which is available at\n * https://www.gnu.org/software/classpath/license.html.\n *\n * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0\n ********************************************************************************/\n\n.theia-tree-view-icon {\n  padding-right: var(--theia-ui-padding);\n  -webkit-font-smoothing: antialiased;\n  flex-shrink: 0;\n  padding-left: 6px;\n  margin-left: -6px;\n}\n\n.theia-tree-view-inline-action {\n  padding: 2px;\n}\n\n.theia-tree-view-description {\n  color: var(--theia-descriptionForeground);\n  font-size: var(--theia-ui-font-size0);\n  margin-left: var(--theia-ui-padding);\n}\n\n.theia-tree-view .theia-TreeNodeContent {\n  align-items: center;\n  height: 100%;\n}\n\n.theia-tree-view .theia-TreeContainer .theia-TreeViewInfo {\n  margin-top: 7px;\n  margin-bottom: 10px;\n  margin-left: 17px;\n}\n\n.theia-tree-view\n  .theia-TreeNode:not(:hover):not(.theia-mod-selected)\n  .theia-tree-view-inline-action {\n  display: none;\n}\n\n.codicon.icon-inline {\n  font-size: var(--theia-ui-font-size1);\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../node_modules/css-loader/dist/cjs.js!../../packages/plugin-ext/src/main/browser/style/webview.css":
/*!**************************************************************************************************************!*\
  !*** ../../node_modules/css-loader/dist/cjs.js!../../packages/plugin-ext/src/main/browser/style/webview.css ***!
  \**************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "../../node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../../node_modules/css-loader/dist/runtime/api.js */ "../../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/********************************************************************************
 * Copyright (C) 2018 Red Hat, Inc. and others.
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

.theia-webview.p-mod-hidden {
  visibility: hidden;
  display: flex !important;
}

.theia-webview {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.theia-webview iframe {
  flex-grow: 1;
  border: none;
  margin: 0;
  padding: 0;
}

.theia-webview-icon {
  background: none !important;
  min-height: 20px;
}

.theia-webview-icon::before {
  background-size: 13px;
  background-repeat: no-repeat;
  vertical-align: middle;
  display: inline-block;
  text-align: center;
  height: 15px;
  width: 15px;
  content: "";
}

.p-TabBar.theia-app-sides .theia-webview-icon::before {
  width: var(--theia-private-sidebar-icon-size);
  height: var(--theia-private-sidebar-icon-size);
  background-size: contain;
}
`, "",{"version":3,"sources":["webpack://./../../packages/plugin-ext/src/main/browser/style/webview.css"],"names":[],"mappings":"AAAA;;;;;;;;;;;;;;iFAciF;;AAEjF;EACE,kBAAkB;EAClB,wBAAwB;AAC1B;;AAEA;EACE,aAAa;EACb,sBAAsB;EACtB,YAAY;AACd;;AAEA;EACE,YAAY;EACZ,YAAY;EACZ,SAAS;EACT,UAAU;AACZ;;AAEA;EACE,2BAA2B;EAC3B,gBAAgB;AAClB;;AAEA;EACE,qBAAqB;EACrB,4BAA4B;EAC5B,sBAAsB;EACtB,qBAAqB;EACrB,kBAAkB;EAClB,YAAY;EACZ,WAAW;EACX,WAAW;AACb;;AAEA;EACE,6CAA6C;EAC7C,8CAA8C;EAC9C,wBAAwB;AAC1B","sourcesContent":["/********************************************************************************\n * Copyright (C) 2018 Red Hat, Inc. and others.\n *\n * This program and the accompanying materials are made available under the\n * terms of the Eclipse Public License v. 2.0 which is available at\n * http://www.eclipse.org/legal/epl-2.0.\n *\n * This Source Code may also be made available under the following Secondary\n * Licenses when the conditions for such availability set forth in the Eclipse\n * Public License v. 2.0 are satisfied: GNU General Public License, version 2\n * with the GNU Classpath Exception which is available at\n * https://www.gnu.org/software/classpath/license.html.\n *\n * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0\n ********************************************************************************/\n\n.theia-webview.p-mod-hidden {\n  visibility: hidden;\n  display: flex !important;\n}\n\n.theia-webview {\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n}\n\n.theia-webview iframe {\n  flex-grow: 1;\n  border: none;\n  margin: 0;\n  padding: 0;\n}\n\n.theia-webview-icon {\n  background: none !important;\n  min-height: 20px;\n}\n\n.theia-webview-icon::before {\n  background-size: 13px;\n  background-repeat: no-repeat;\n  vertical-align: middle;\n  display: inline-block;\n  text-align: center;\n  height: 15px;\n  width: 15px;\n  content: \"\";\n}\n\n.p-TabBar.theia-app-sides .theia-webview-icon::before {\n  width: var(--theia-private-sidebar-icon-size);\n  height: var(--theia-private-sidebar-icon-size);\n  background-size: contain;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../node_modules/css-loader/dist/cjs.js!../../packages/plugin-ext/src/main/style/status-bar.css":
/*!*********************************************************************************************************!*\
  !*** ../../node_modules/css-loader/dist/cjs.js!../../packages/plugin-ext/src/main/style/status-bar.css ***!
  \*********************************************************************************************************/
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
 * Copyright (C) 2018 Red Hat, Inc. and others.
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

#theia-statusBar .development-host {
  background-color: var(--theia-successBackground);
}

#theia-statusBar .development-host-offline {
  background-color: var(--theia-errorBackground);
}

#theia-statusBar .hosted-plugin {
  background-color: var(--theia-inputValidation-infoBackground);
}

#theia-statusBar .hosted-plugin:hover {
  background-color: var(--theia-editorInfo-foreground);
}

#theia-statusBar .hosted-plugin-failed {
  background-color: var(--theia-errorBackground);
}
`, "",{"version":3,"sources":["webpack://./../../packages/plugin-ext/src/main/style/status-bar.css"],"names":[],"mappings":"AAAA;;;;;;;;;;;;;;iFAciF;;AAEjF;EACE,gDAAgD;AAClD;;AAEA;EACE,8CAA8C;AAChD;;AAEA;EACE,6DAA6D;AAC/D;;AAEA;EACE,oDAAoD;AACtD;;AAEA;EACE,8CAA8C;AAChD","sourcesContent":["/********************************************************************************\n * Copyright (C) 2018 Red Hat, Inc. and others.\n *\n * This program and the accompanying materials are made available under the\n * terms of the Eclipse Public License v. 2.0 which is available at\n * http://www.eclipse.org/legal/epl-2.0.\n *\n * This Source Code may also be made available under the following Secondary\n * Licenses when the conditions for such availability set forth in the Eclipse\n * Public License v. 2.0 are satisfied: GNU General Public License, version 2\n * with the GNU Classpath Exception which is available at\n * https://www.gnu.org/software/classpath/license.html.\n *\n * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0\n ********************************************************************************/\n\n#theia-statusBar .development-host {\n  background-color: var(--theia-successBackground);\n}\n\n#theia-statusBar .development-host-offline {\n  background-color: var(--theia-errorBackground);\n}\n\n#theia-statusBar .hosted-plugin {\n  background-color: var(--theia-inputValidation-infoBackground);\n}\n\n#theia-statusBar .hosted-plugin:hover {\n  background-color: var(--theia-editorInfo-foreground);\n}\n\n#theia-statusBar .hosted-plugin-failed {\n  background-color: var(--theia-errorBackground);\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../packages/plugin-ext/src/main/browser/style/comments.css":
/*!*********************************************************************!*\
  !*** ../../packages/plugin-ext/src/main/browser/style/comments.css ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_comments_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../../node_modules/css-loader/dist/cjs.js!./comments.css */ "../../node_modules/css-loader/dist/cjs.js!../../packages/plugin-ext/src/main/browser/style/comments.css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_comments_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_comments_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "../../packages/plugin-ext/src/main/browser/style/index.css":
/*!******************************************************************!*\
  !*** ../../packages/plugin-ext/src/main/browser/style/index.css ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../../node_modules/css-loader/dist/cjs.js!./index.css */ "../../node_modules/css-loader/dist/cjs.js!../../packages/plugin-ext/src/main/browser/style/index.css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "../../packages/plugin-ext/src/main/style/status-bar.css":
/*!***************************************************************!*\
  !*** ../../packages/plugin-ext/src/main/style/status-bar.css ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_status_bar_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/css-loader/dist/cjs.js!./status-bar.css */ "../../node_modules/css-loader/dist/cjs.js!../../packages/plugin-ext/src/main/style/status-bar.css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_status_bar_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_status_bar_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ })

}]);
//# sourceMappingURL=packages_plugin-ext_lib_plugin-ext-frontend-module_js.js.map