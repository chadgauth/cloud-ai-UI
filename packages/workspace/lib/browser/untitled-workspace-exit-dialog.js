"use strict";
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UntitledWorkspaceExitDialog = void 0;
const core_1 = require("@theia/core");
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/core/lib/browser");
let UntitledWorkspaceExitDialog = class UntitledWorkspaceExitDialog extends browser_1.AbstractDialog {
    constructor(props) {
        super(props);
        this._value = 'Cancel';
        const messageNode = document.createElement('div');
        messageNode.textContent = core_1.nls.localizeByDefault('Save your workspace if you plan to open it again.');
        this.contentNode.appendChild(messageNode);
        this.dontSaveButton = this.createButton(core_1.nls.localizeByDefault("Don't Save" /* "Don't Save" */));
        this.dontSaveButton.classList.add('secondary');
        this.controlPanel.appendChild(this.dontSaveButton);
        this.appendCloseButton(browser_1.Dialog.CANCEL);
        this.appendAcceptButton(core_1.nls.localizeByDefault("Save" /* Save */));
    }
    get value() {
        return this._value;
    }
    onAfterAttach(msg) {
        super.onAfterAttach(msg);
        this.addAction(this.dontSaveButton, () => this.dontSave(), 'click');
    }
    addAcceptAction(element, ...additionalEventTypes) {
        this.addAction(element, () => this.doSave(), 'click');
    }
    dontSave() {
        this._value = "Don't Save" /* "Don't Save" */;
        this.accept();
    }
    doSave() {
        this._value = "Save" /* Save */;
        this.accept();
    }
};
UntitledWorkspaceExitDialog = __decorate([
    __param(0, (0, inversify_1.inject)(browser_1.DialogProps)),
    __metadata("design:paramtypes", [browser_1.DialogProps])
], UntitledWorkspaceExitDialog);
exports.UntitledWorkspaceExitDialog = UntitledWorkspaceExitDialog;
(function (UntitledWorkspaceExitDialog) {
    ;
})(UntitledWorkspaceExitDialog = exports.UntitledWorkspaceExitDialog || (exports.UntitledWorkspaceExitDialog = {}));
exports.UntitledWorkspaceExitDialog = UntitledWorkspaceExitDialog;
//# sourceMappingURL=untitled-workspace-exit-dialog.js.map