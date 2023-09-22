"use strict";
// *****************************************************************************
// Copyright (C) 2017 TypeFox and others.
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
exports.QuickFileOpenFrontendContribution = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const uri_1 = require("@theia/core/lib/common/uri");
const quick_file_open_1 = require("./quick-file-open");
const browser_1 = require("@theia/editor/lib/browser");
const nls_1 = require("@theia/core/lib/common/nls");
let QuickFileOpenFrontendContribution = class QuickFileOpenFrontendContribution {
    registerCommands(commands) {
        commands.registerCommand(quick_file_open_1.quickFileOpen, {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            execute: (...args) => {
                let fileURI;
                if (args) {
                    [fileURI] = args;
                }
                if (fileURI) {
                    this.quickFileOpenService.openFile(new uri_1.default(fileURI));
                }
                else {
                    this.quickFileOpenService.open();
                }
            }
        });
    }
    registerKeybindings(keybindings) {
        keybindings.registerKeybinding({
            command: quick_file_open_1.quickFileOpen.id,
            keybinding: 'ctrlcmd+p'
        });
    }
    registerMenus(menus) {
        menus.registerMenuAction(browser_1.EditorMainMenu.WORKSPACE_GROUP, {
            commandId: quick_file_open_1.quickFileOpen.id,
            label: nls_1.nls.localizeByDefault('Go to File...'),
            order: '1',
        });
    }
    registerQuickAccessProvider() {
        this.quickFileOpenService.registerQuickAccessProvider();
    }
};
__decorate([
    (0, inversify_1.inject)(quick_file_open_1.QuickFileOpenService),
    __metadata("design:type", quick_file_open_1.QuickFileOpenService)
], QuickFileOpenFrontendContribution.prototype, "quickFileOpenService", void 0);
QuickFileOpenFrontendContribution = __decorate([
    (0, inversify_1.injectable)()
], QuickFileOpenFrontendContribution);
exports.QuickFileOpenFrontendContribution = QuickFileOpenFrontendContribution;
//# sourceMappingURL=quick-file-open-contribution.js.map