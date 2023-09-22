"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerminalCopyOnSelectionHandler = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/core/lib/browser");
let TerminalCopyOnSelectionHandler = class TerminalCopyOnSelectionHandler {
    constructor() {
        this.copyListener = (ev) => {
            if (this.interceptCopy && ev.clipboardData) {
                ev.clipboardData.setData('text/plain', this.textToCopy);
                ev.preventDefault();
            }
        };
    }
    init() {
        document.addEventListener('copy', this.copyListener);
    }
    async clipBoardCopyIsGranted() {
        // Unfortunately Firefox doesn't support permission check `clipboard-write`, so let try to copy anyway,
        if (browser_1.isFirefox) {
            return true;
        }
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const permissions = navigator.permissions;
            const { state } = await permissions.query({ name: 'clipboard-write' });
            if (state === 'granted') {
                return true;
            }
        }
        catch (e) { }
        return false;
    }
    executeCommandCopy() {
        try {
            this.interceptCopy = true;
            document.execCommand('copy');
            this.interceptCopy = false;
        }
        catch (e) {
            // do nothing
        }
    }
    async writeToClipBoard() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const clipboard = navigator.clipboard;
        if (!clipboard) {
            this.executeCommandCopy();
            return;
        }
        try {
            await clipboard.writeText(this.textToCopy);
        }
        catch (e) {
            this.executeCommandCopy();
        }
    }
    async copy(text) {
        this.textToCopy = text;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const permissions = navigator.permissions;
        if (permissions && permissions.query && await this.clipBoardCopyIsGranted()) {
            await this.writeToClipBoard();
        }
        else {
            this.executeCommandCopy();
        }
    }
};
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TerminalCopyOnSelectionHandler.prototype, "init", null);
TerminalCopyOnSelectionHandler = __decorate([
    (0, inversify_1.injectable)()
], TerminalCopyOnSelectionHandler);
exports.TerminalCopyOnSelectionHandler = TerminalCopyOnSelectionHandler;
//# sourceMappingURL=terminal-copy-on-selection-handler.js.map