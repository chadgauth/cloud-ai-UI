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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonacoContextMenuService = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/editor/lib/browser");
const browser_2 = require("@theia/core/lib/browser");
const widgets_1 = require("@theia/core/shared/@phosphor/widgets");
const commands_1 = require("@theia/core/shared/@phosphor/commands");
const actions_1 = require("@theia/monaco-editor-core/esm/vs/platform/actions/common/actions");
const event_1 = require("@theia/monaco-editor-core/esm/vs/base/common/event");
let MonacoContextMenuService = class MonacoContextMenuService {
    constructor(contextMenuRenderer) {
        this.contextMenuRenderer = contextMenuRenderer;
        this.onDidShowContextMenuEmitter = new event_1.Emitter();
        this.onDidHideContextMenuEmitter = new event_1.Emitter();
    }
    get onDidShowContextMenu() {
        return this.onDidShowContextMenuEmitter.event;
    }
    ;
    get onDidHideContextMenu() {
        return this.onDidShowContextMenuEmitter.event;
    }
    ;
    showContextMenu(delegate) {
        const anchor = (0, browser_2.toAnchor)(delegate.getAnchor());
        const actions = delegate.getActions();
        const onHide = () => {
            var _a;
            (_a = delegate.onHide) === null || _a === void 0 ? void 0 : _a.call(delegate, false);
            this.onDidHideContextMenuEmitter.fire();
        };
        // Actions for editor context menu come as 'MenuItemAction' items
        // In case of 'Quick Fix' actions come as 'CodeActionAction' items
        if (actions.length > 0 && actions[0] instanceof actions_1.MenuItemAction) {
            this.contextMenuRenderer.render({
                menuPath: this.menuPath(),
                anchor,
                onHide
            });
        }
        else {
            const commands = new commands_1.CommandRegistry();
            const menu = new widgets_1.Menu({
                commands
            });
            for (const action of actions) {
                const commandId = 'quickfix_' + actions.indexOf(action);
                commands.addCommand(commandId, {
                    label: action.label,
                    className: action.class,
                    isToggled: () => Boolean(action.checked),
                    isEnabled: () => action.enabled,
                    execute: () => action.run()
                });
                menu.addItem({
                    type: 'command',
                    command: commandId
                });
            }
            menu.aboutToClose.connect(() => onHide());
            menu.open(anchor.x, anchor.y);
        }
        this.onDidShowContextMenuEmitter.fire();
    }
    menuPath() {
        return browser_1.EDITOR_CONTEXT_MENU;
    }
};
MonacoContextMenuService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(browser_2.ContextMenuRenderer)),
    __metadata("design:paramtypes", [browser_2.ContextMenuRenderer])
], MonacoContextMenuService);
exports.MonacoContextMenuService = MonacoContextMenuService;
//# sourceMappingURL=monaco-context-menu.js.map