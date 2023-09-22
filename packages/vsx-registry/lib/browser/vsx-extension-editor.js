"use strict";
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var VSXExtensionEditor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VSXExtensionEditor = void 0;
const React = require("@theia/core/shared/react");
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/core/lib/browser");
const vsx_extension_1 = require("./vsx-extension");
const vsx_extensions_model_1 = require("./vsx-extensions-model");
const promise_util_1 = require("@theia/core/lib/common/promise-util");
const nls_1 = require("@theia/core/lib/common/nls");
let VSXExtensionEditor = VSXExtensionEditor_1 = class VSXExtensionEditor extends browser_1.ReactWidget {
    constructor() {
        super(...arguments);
        this.deferredScrollContainer = new promise_util_1.Deferred();
        this.resolveScrollContainer = (element) => {
            if (!element) {
                this.deferredScrollContainer.reject(new Error('element is null'));
            }
            else if (!element.scrollContainer) {
                this.deferredScrollContainer.reject(new Error('element.scrollContainer is undefined'));
            }
            else {
                this.deferredScrollContainer.resolve(element.scrollContainer);
            }
        };
    }
    init() {
        this.addClass('theia-vsx-extension-editor');
        this.id = VSXExtensionEditor_1.ID + ':' + this.extension.id;
        this.title.closable = true;
        this.updateTitle();
        this.title.iconClass = (0, browser_1.codicon)('list-selection');
        this.node.tabIndex = -1;
        this.update();
        this.toDispose.push(this.model.onDidChange(() => this.update()));
    }
    getScrollContainer() {
        return this.deferredScrollContainer.promise;
    }
    onActivateRequest(msg) {
        super.onActivateRequest(msg);
        this.node.focus();
    }
    onUpdateRequest(msg) {
        super.onUpdateRequest(msg);
        this.updateTitle();
    }
    onAfterShow(msg) {
        super.onAfterShow(msg);
        this.update();
    }
    updateTitle() {
        const label = nls_1.nls.localizeByDefault('Extension: {0}', (this.extension.displayName || this.extension.name));
        this.title.label = label;
        this.title.caption = label;
    }
    onResize(msg) {
        super.onResize(msg);
        this.update();
    }
    ;
    render() {
        return React.createElement(vsx_extension_1.VSXExtensionEditorComponent, { ref: this.resolveScrollContainer, extension: this.extension });
    }
};
VSXExtensionEditor.ID = 'vsx-extension-editor';
__decorate([
    (0, inversify_1.inject)(vsx_extension_1.VSXExtension),
    __metadata("design:type", vsx_extension_1.VSXExtension)
], VSXExtensionEditor.prototype, "extension", void 0);
__decorate([
    (0, inversify_1.inject)(vsx_extensions_model_1.VSXExtensionsModel),
    __metadata("design:type", vsx_extensions_model_1.VSXExtensionsModel)
], VSXExtensionEditor.prototype, "model", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VSXExtensionEditor.prototype, "init", null);
VSXExtensionEditor = VSXExtensionEditor_1 = __decorate([
    (0, inversify_1.injectable)()
], VSXExtensionEditor);
exports.VSXExtensionEditor = VSXExtensionEditor;
//# sourceMappingURL=vsx-extension-editor.js.map