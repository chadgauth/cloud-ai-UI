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
exports.CallHierarchyContribution = exports.CallHierarchyCommands = exports.CALL_HIERARCHY_TOGGLE_COMMAND_ID = exports.CALL_HIERARCHY_LABEL = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const common_1 = require("@theia/core/lib/common");
const browser_1 = require("@theia/core/lib/browser");
const browser_2 = require("@theia/editor/lib/browser");
const callhierarchy_1 = require("./callhierarchy");
Object.defineProperty(exports, "CALL_HIERARCHY_LABEL", { enumerable: true, get: function () { return callhierarchy_1.CALL_HIERARCHY_LABEL; } });
Object.defineProperty(exports, "CALL_HIERARCHY_TOGGLE_COMMAND_ID", { enumerable: true, get: function () { return callhierarchy_1.CALL_HIERARCHY_TOGGLE_COMMAND_ID; } });
const callhierarchy_service_1 = require("./callhierarchy-service");
const uri_1 = require("@theia/core/lib/common/uri");
const context_key_service_1 = require("@theia/core/lib/browser/context-key-service");
var CallHierarchyCommands;
(function (CallHierarchyCommands) {
    CallHierarchyCommands.OPEN = common_1.Command.toLocalizedCommand({
        id: 'callhierarchy:open',
        label: 'Open Call Hierarchy'
    }, 'theia/callhierarchy/open');
})(CallHierarchyCommands = exports.CallHierarchyCommands || (exports.CallHierarchyCommands = {}));
let CallHierarchyContribution = class CallHierarchyContribution extends browser_1.AbstractViewContribution {
    constructor() {
        super({
            widgetId: callhierarchy_1.CALLHIERARCHY_ID,
            widgetName: callhierarchy_1.CALL_HIERARCHY_LABEL,
            defaultWidgetOptions: {
                area: 'bottom'
            },
            toggleCommandId: callhierarchy_1.CALL_HIERARCHY_TOGGLE_COMMAND_ID,
            toggleKeybinding: 'ctrlcmd+shift+f1'
        });
    }
    init() {
        this.editorHasCallHierarchyProvider = this.contextKeyService.createKey('editorHasCallHierarchyProvider', false);
        this.editorManager.onCurrentEditorChanged(() => this.editorHasCallHierarchyProvider.set(this.isCallHierarchyAvailable()));
        this.callHierarchyServiceProvider.onDidChange(() => this.editorHasCallHierarchyProvider.set(this.isCallHierarchyAvailable()));
    }
    isCallHierarchyAvailable() {
        const { selection, languageId } = this.editorAccess;
        return !!selection && !!languageId && !!this.callHierarchyServiceProvider.get(languageId, new uri_1.default(selection.uri));
    }
    async openView(args) {
        const widget = await super.openView(args);
        const { selection, languageId } = this.editorAccess;
        widget.initializeModel(selection, languageId);
        return widget;
    }
    registerCommands(commands) {
        commands.registerCommand(CallHierarchyCommands.OPEN, {
            execute: () => this.openView({
                toggle: false,
                activate: true
            }),
            isEnabled: this.isCallHierarchyAvailable.bind(this)
        });
        super.registerCommands(commands);
    }
    registerMenus(menus) {
        const menuPath = [...browser_2.EDITOR_CONTEXT_MENU, 'navigation'];
        menus.registerMenuAction(menuPath, {
            commandId: CallHierarchyCommands.OPEN.id,
            label: callhierarchy_1.CALL_HIERARCHY_LABEL
        });
        super.registerMenus(menus);
    }
    registerKeybindings(keybindings) {
        super.registerKeybindings(keybindings);
        keybindings.registerKeybinding({
            command: CallHierarchyCommands.OPEN.id,
            keybinding: 'ctrlcmd+f1'
        });
    }
};
__decorate([
    (0, inversify_1.inject)(browser_2.CurrentEditorAccess),
    __metadata("design:type", browser_2.CurrentEditorAccess)
], CallHierarchyContribution.prototype, "editorAccess", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.EditorManager),
    __metadata("design:type", browser_2.EditorManager)
], CallHierarchyContribution.prototype, "editorManager", void 0);
__decorate([
    (0, inversify_1.inject)(callhierarchy_service_1.CallHierarchyServiceProvider),
    __metadata("design:type", callhierarchy_service_1.CallHierarchyServiceProvider)
], CallHierarchyContribution.prototype, "callHierarchyServiceProvider", void 0);
__decorate([
    (0, inversify_1.inject)(context_key_service_1.ContextKeyService),
    __metadata("design:type", Object)
], CallHierarchyContribution.prototype, "contextKeyService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CallHierarchyContribution.prototype, "init", null);
CallHierarchyContribution = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], CallHierarchyContribution);
exports.CallHierarchyContribution = CallHierarchyContribution;
//# sourceMappingURL=callhierarchy-contribution.js.map