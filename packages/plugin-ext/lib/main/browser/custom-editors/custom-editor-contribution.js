"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomEditorContribution = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/core/lib/browser");
const custom_editor_widget_1 = require("./custom-editor-widget");
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
//# sourceMappingURL=custom-editor-contribution.js.map