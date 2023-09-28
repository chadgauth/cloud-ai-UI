"use strict";
// *****************************************************************************
// Copyright (C) 2019 Ericsson and others.
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
exports.WorkspaceInputDialog = exports.WorkspaceInputDialogProps = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/core/lib/browser");
let WorkspaceInputDialogProps = class WorkspaceInputDialogProps extends browser_1.SingleTextInputDialogProps {
};
WorkspaceInputDialogProps = __decorate([
    (0, inversify_1.injectable)()
], WorkspaceInputDialogProps);
exports.WorkspaceInputDialogProps = WorkspaceInputDialogProps;
let WorkspaceInputDialog = class WorkspaceInputDialog extends browser_1.SingleTextInputDialog {
    constructor(props, labelProvider) {
        super(props);
        this.props = props;
        this.labelProvider = labelProvider;
        this.appendParentPath();
    }
    /**
     * Append the human-readable parent `path` to the dialog.
     * When possible, display the relative path, else display the full path (ex: workspace root).
     */
    appendParentPath() {
        // Compute the label for the parent URI.
        const label = this.labelProvider.getLongName(this.props.parentUri);
        const element = document.createElement('div');
        // Create the `folder` icon.
        const icon = document.createElement('i');
        icon.classList.add(...(0, browser_1.codiconArray)('folder'));
        icon.style.marginRight = '0.5em';
        icon.style.verticalAlign = 'middle';
        element.style.verticalAlign = 'middle';
        element.style.paddingBottom = '1em';
        element.title = this.props.parentUri.path.fsPath();
        element.appendChild(icon);
        element.appendChild(document.createTextNode(label));
        // Add the path and icon div before the `inputField`.
        this.contentNode.insertBefore(element, this.inputField);
    }
};
WorkspaceInputDialog = __decorate([
    __param(0, (0, inversify_1.inject)(WorkspaceInputDialogProps)),
    __param(1, (0, inversify_1.inject)(browser_1.LabelProvider)),
    __metadata("design:paramtypes", [WorkspaceInputDialogProps,
        browser_1.LabelProvider])
], WorkspaceInputDialog);
exports.WorkspaceInputDialog = WorkspaceInputDialog;
//# sourceMappingURL=workspace-input-dialog.js.map