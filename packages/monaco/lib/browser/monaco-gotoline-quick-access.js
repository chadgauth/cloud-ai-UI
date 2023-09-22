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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GotoLineQuickAccessContribution = exports.GotoLineQuickAccess = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const codeEditorService_1 = require("@theia/monaco-editor-core/esm/vs/editor/browser/services/codeEditorService");
const standaloneGotoLineQuickAccess_1 = require("@theia/monaco-editor-core/esm/vs/editor/standalone/browser/quickAccess/standaloneGotoLineQuickAccess");
const quickAccess_1 = require("@theia/monaco-editor-core/esm/vs/platform/quickinput/common/quickAccess");
const platform_1 = require("@theia/monaco-editor-core/esm/vs/platform/registry/common/platform");
let GotoLineQuickAccess = class GotoLineQuickAccess extends standaloneGotoLineQuickAccess_1.StandaloneGotoLineQuickAccessProvider {
    constructor(service) {
        super(service);
        this.service = service;
    }
    get activeTextEditorControl() {
        var _a;
        return (_a = (this.service.getFocusedCodeEditor() || this.service.getActiveCodeEditor())) !== null && _a !== void 0 ? _a : undefined;
    }
};
GotoLineQuickAccess = __decorate([
    __param(0, codeEditorService_1.ICodeEditorService),
    __metadata("design:paramtypes", [Object])
], GotoLineQuickAccess);
exports.GotoLineQuickAccess = GotoLineQuickAccess;
let GotoLineQuickAccessContribution = class GotoLineQuickAccessContribution {
    registerQuickAccessProvider() {
        platform_1.Registry.as(quickAccess_1.Extensions.Quickaccess).registerQuickAccessProvider({
            ctor: GotoLineQuickAccess,
            prefix: ':',
            placeholder: '',
            helpEntries: [{ description: 'Go to line' }]
        });
    }
};
GotoLineQuickAccessContribution = __decorate([
    (0, inversify_1.injectable)()
], GotoLineQuickAccessContribution);
exports.GotoLineQuickAccessContribution = GotoLineQuickAccessContribution;
//# sourceMappingURL=monaco-gotoline-quick-access.js.map