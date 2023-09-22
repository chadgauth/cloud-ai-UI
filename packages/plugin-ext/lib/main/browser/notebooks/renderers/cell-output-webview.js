"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CellOutputWebviewImpl = exports.createCellOutputWebviewContainer = void 0;
const React = require("@theia/core/shared/react");
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/notebook/lib/browser");
const uuid_1 = require("uuid");
const notebook_cell_model_1 = require("@theia/notebook/lib/browser/view-model/notebook-cell-model");
const webview_1 = require("../../webview/webview");
const browser_2 = require("@theia/core/lib/browser");
const output_webview_internal_1 = require("./output-webview-internal");
const browser_3 = require("@theia/workspace/lib/browser");
const common_1 = require("@theia/notebook/lib/common");
const core_1 = require("@theia/core");
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
//# sourceMappingURL=cell-output-webview.js.map