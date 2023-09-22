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
exports.MonacoCommandRegistry = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const core_1 = require("@theia/core");
const browser_1 = require("@theia/editor/lib/browser");
const monaco_editor_provider_1 = require("./monaco-editor-provider");
let MonacoCommandRegistry = class MonacoCommandRegistry {
    validate(command) {
        return this.commands.commandIds.indexOf(command) !== -1 ? command : undefined;
    }
    registerCommand(command, handler) {
        this.commands.registerCommand({
            ...command,
            id: command.id
        }, this.newHandler(handler));
    }
    registerHandler(command, handler) {
        this.commands.registerHandler(command, this.newHandler(handler));
    }
    newHandler(monacoHandler) {
        return {
            execute: (...args) => this.execute(monacoHandler, ...args),
            isEnabled: (...args) => this.isEnabled(monacoHandler, ...args),
            isVisible: (...args) => this.isVisible(monacoHandler, ...args)
        };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    execute(monacoHandler, ...args) {
        const editor = this.monacoEditors.current;
        if (editor) {
            return Promise.resolve(monacoHandler.execute(editor, ...args));
        }
        return Promise.resolve();
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    isEnabled(monacoHandler, ...args) {
        const editor = this.monacoEditors.current;
        return !!editor && (!monacoHandler.isEnabled || monacoHandler.isEnabled(editor, ...args));
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    isVisible(monacoHandler, ...args) {
        return browser_1.TextEditorSelection.is(this.selectionService.selection);
    }
};
__decorate([
    (0, inversify_1.inject)(monaco_editor_provider_1.MonacoEditorProvider),
    __metadata("design:type", monaco_editor_provider_1.MonacoEditorProvider)
], MonacoCommandRegistry.prototype, "monacoEditors", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.CommandRegistry),
    __metadata("design:type", core_1.CommandRegistry)
], MonacoCommandRegistry.prototype, "commands", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.SelectionService),
    __metadata("design:type", core_1.SelectionService)
], MonacoCommandRegistry.prototype, "selectionService", void 0);
MonacoCommandRegistry = __decorate([
    (0, inversify_1.injectable)()
], MonacoCommandRegistry);
exports.MonacoCommandRegistry = MonacoCommandRegistry;
//# sourceMappingURL=monaco-command-registry.js.map