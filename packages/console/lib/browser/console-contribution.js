"use strict";
// *****************************************************************************
// Copyright (C) 2018 TypeFox and others.
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
exports.ConsoleCommandHandler = exports.ConsoleContribution = exports.ConsoleContextMenu = exports.ConsoleCommands = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/core/lib/browser");
const console_manager_1 = require("./console-manager");
const console_content_widget_1 = require("./console-content-widget");
const nls_1 = require("@theia/core/lib/common/nls");
var ConsoleCommands;
(function (ConsoleCommands) {
    ConsoleCommands.SELECT_ALL = {
        id: 'console.selectAll'
    };
    ConsoleCommands.COLLAPSE_ALL = {
        id: 'console.collapseAll'
    };
    ConsoleCommands.CLEAR = {
        id: 'console.clear'
    };
    ConsoleCommands.EXECUTE = {
        id: 'console.execute'
    };
    ConsoleCommands.NAVIGATE_BACK = {
        id: 'console.navigatePrevious'
    };
    ConsoleCommands.NAVIGATE_FORWARD = {
        id: 'console.navigateNext'
    };
})(ConsoleCommands = exports.ConsoleCommands || (exports.ConsoleCommands = {}));
var ConsoleContextMenu;
(function (ConsoleContextMenu) {
    ConsoleContextMenu.CLIPBOARD = [...console_content_widget_1.ConsoleContentWidget.CONTEXT_MENU, '1_clipboard'];
    ConsoleContextMenu.CLEAR = [...console_content_widget_1.ConsoleContentWidget.CONTEXT_MENU, '2_clear'];
})(ConsoleContextMenu = exports.ConsoleContextMenu || (exports.ConsoleContextMenu = {}));
let ConsoleContribution = class ConsoleContribution {
    initialize() { }
    registerCommands(commands) {
        commands.registerCommand(ConsoleCommands.SELECT_ALL, this.newCommandHandler(console => console.selectAll()));
        commands.registerCommand(ConsoleCommands.COLLAPSE_ALL, this.newCommandHandler(console => console.collapseAll()));
        commands.registerCommand(ConsoleCommands.CLEAR, this.newCommandHandler(console => console.clear()));
        commands.registerCommand(ConsoleCommands.EXECUTE, this.newCommandHandler(console => console.execute()));
        commands.registerCommand(ConsoleCommands.NAVIGATE_BACK, this.newCommandHandler(console => console.navigateBack()));
        commands.registerCommand(ConsoleCommands.NAVIGATE_FORWARD, this.newCommandHandler(console => console.navigateForward()));
    }
    registerKeybindings(keybindings) {
        keybindings.registerKeybinding({
            command: ConsoleCommands.SELECT_ALL.id,
            keybinding: 'ctrlcmd+a',
            when: 'consoleContentFocus'
        });
        keybindings.registerKeybinding({
            command: ConsoleCommands.EXECUTE.id,
            keybinding: 'enter',
            when: 'consoleInputFocus'
        });
        keybindings.registerKeybinding({
            command: ConsoleCommands.NAVIGATE_BACK.id,
            keybinding: 'up',
            when: 'consoleInputFocus && consoleNavigationBackEnabled'
        });
        keybindings.registerKeybinding({
            command: ConsoleCommands.NAVIGATE_FORWARD.id,
            keybinding: 'down',
            when: 'consoleInputFocus && consoleNavigationForwardEnabled'
        });
    }
    registerMenus(menus) {
        menus.registerMenuAction(ConsoleContextMenu.CLIPBOARD, {
            commandId: browser_1.CommonCommands.COPY.id,
            label: browser_1.CommonCommands.COPY.label,
            order: 'a1',
        });
        menus.registerMenuAction(ConsoleContextMenu.CLIPBOARD, {
            commandId: ConsoleCommands.SELECT_ALL.id,
            label: browser_1.CommonCommands.SELECT_ALL.label,
            order: 'a2'
        });
        menus.registerMenuAction(ConsoleContextMenu.CLIPBOARD, {
            commandId: ConsoleCommands.COLLAPSE_ALL.id,
            label: nls_1.nls.localizeByDefault('Collapse All'),
            order: 'a3'
        });
        menus.registerMenuAction(ConsoleContextMenu.CLEAR, {
            commandId: ConsoleCommands.CLEAR.id,
            label: nls_1.nls.localizeByDefault('Clear Console')
        });
    }
    newCommandHandler(execute) {
        return new ConsoleCommandHandler(this.manager, execute);
    }
};
__decorate([
    (0, inversify_1.inject)(console_manager_1.ConsoleManager),
    __metadata("design:type", console_manager_1.ConsoleManager)
], ConsoleContribution.prototype, "manager", void 0);
ConsoleContribution = __decorate([
    (0, inversify_1.injectable)()
], ConsoleContribution);
exports.ConsoleContribution = ConsoleContribution;
class ConsoleCommandHandler {
    constructor(manager, doExecute) {
        this.manager = manager;
        this.doExecute = doExecute;
    }
    isEnabled() {
        return !!this.manager.currentConsole;
    }
    isVisible() {
        return !!this.manager.currentConsole;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    execute(...args) {
        const { currentConsole } = this.manager;
        if (currentConsole) {
            return this.doExecute(currentConsole, ...args);
        }
    }
}
exports.ConsoleCommandHandler = ConsoleCommandHandler;
//# sourceMappingURL=console-contribution.js.map