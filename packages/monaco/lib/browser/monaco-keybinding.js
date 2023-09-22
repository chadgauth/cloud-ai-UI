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
exports.MonacoKeybindingContribution = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/core/lib/browser");
const monaco_command_1 = require("./monaco-command");
const monaco_command_registry_1 = require("./monaco-command-registry");
const core_1 = require("@theia/core");
const monaco_resolved_keybinding_1 = require("./monaco-resolved-keybinding");
const keybindingsRegistry_1 = require("@theia/monaco-editor-core/esm/vs/platform/keybinding/common/keybindingsRegistry");
const standaloneServices_1 = require("@theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices");
const keybinding_1 = require("@theia/monaco-editor-core/esm/vs/platform/keybinding/common/keybinding");
const monaco_context_key_service_1 = require("./monaco-context-key-service");
const monaco_keycode_map_1 = require("./monaco-keycode-map");
const monaco = require("@theia/monaco-editor-core");
let MonacoKeybindingContribution = class MonacoKeybindingContribution {
    constructor() {
        this.toDisposeOnKeybindingChange = new core_1.DisposableCollection();
    }
    init() {
        this.keybindings.onKeybindingsChanged(() => this.updateMonacoKeybindings());
    }
    registerKeybindings(registry) {
        var _a;
        const defaultKeybindings = keybindingsRegistry_1.KeybindingsRegistry.getDefaultKeybindings();
        for (const item of defaultKeybindings) {
            const command = this.commands.validate(item.command);
            if (command) {
                const when = (_a = (item.when && item.when.serialize())) !== null && _a !== void 0 ? _a : undefined;
                let keybinding;
                if (item.command === monaco_command_1.MonacoCommands.GO_TO_DEFINITION && !core_1.environment.electron.is()) {
                    keybinding = 'ctrlcmd+f11';
                }
                else {
                    keybinding = monaco_resolved_keybinding_1.MonacoResolvedKeybinding.toKeybinding(item.keybinding);
                }
                registry.registerKeybinding({ command, keybinding, when });
            }
        }
    }
    updateMonacoKeybindings() {
        const monacoKeybindingRegistry = standaloneServices_1.StandaloneServices.get(keybinding_1.IKeybindingService);
        if (monacoKeybindingRegistry instanceof standaloneServices_1.StandaloneKeybindingService) {
            this.toDisposeOnKeybindingChange.dispose();
            for (const binding of this.keybindings.getKeybindingsByScope(browser_1.KeybindingScope.USER).concat(this.keybindings.getKeybindingsByScope(browser_1.KeybindingScope.WORKSPACE))) {
                const resolved = this.keybindings.resolveKeybinding(binding);
                const command = binding.command;
                const when = binding.when
                    ? this.contextKeyService.parse(binding.when)
                    : binding.context
                        ? this.contextKeyService.parse(binding.context)
                        : undefined;
                this.toDisposeOnKeybindingChange.push(monacoKeybindingRegistry.addDynamicKeybinding(binding.command, this.toMonacoKeybindingNumber(resolved), (_, ...args) => this.theiaCommandRegistry.executeCommand(command, ...args), when));
            }
        }
    }
    toMonacoKeybindingNumber(codes) {
        const [firstPart, secondPart] = codes;
        if (codes.length > 2) {
            console.warn('Key chords should not consist of more than two parts; got ', codes);
        }
        const encodedFirstPart = this.toSingleMonacoKeybindingNumber(firstPart);
        const encodedSecondPart = secondPart ? this.toSingleMonacoKeybindingNumber(secondPart) << 16 : 0;
        return monaco.KeyMod.chord(encodedFirstPart, encodedSecondPart);
    }
    toSingleMonacoKeybindingNumber(code) {
        var _a;
        const keyCode = ((_a = code.key) === null || _a === void 0 ? void 0 : _a.keyCode) !== undefined ? monaco_keycode_map_1.KEY_CODE_MAP[code.key.keyCode] : 0;
        let encoded = (keyCode >>> 0) & 0x000000FF;
        if (code.alt) {
            encoded |= monaco.KeyMod.Alt;
        }
        if (code.shift) {
            encoded |= monaco.KeyMod.Shift;
        }
        if (code.ctrl) {
            encoded |= monaco.KeyMod.WinCtrl;
        }
        if (code.meta && core_1.isOSX) {
            encoded |= monaco.KeyMod.CtrlCmd;
        }
        return encoded;
    }
};
__decorate([
    (0, inversify_1.inject)(monaco_command_registry_1.MonacoCommandRegistry),
    __metadata("design:type", monaco_command_registry_1.MonacoCommandRegistry)
], MonacoKeybindingContribution.prototype, "commands", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.KeybindingRegistry),
    __metadata("design:type", browser_1.KeybindingRegistry)
], MonacoKeybindingContribution.prototype, "keybindings", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.CommandRegistry),
    __metadata("design:type", core_1.CommandRegistry)
], MonacoKeybindingContribution.prototype, "theiaCommandRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_context_key_service_1.MonacoContextKeyService),
    __metadata("design:type", monaco_context_key_service_1.MonacoContextKeyService)
], MonacoKeybindingContribution.prototype, "contextKeyService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MonacoKeybindingContribution.prototype, "init", null);
MonacoKeybindingContribution = __decorate([
    (0, inversify_1.injectable)()
], MonacoKeybindingContribution);
exports.MonacoKeybindingContribution = MonacoKeybindingContribution;
//# sourceMappingURL=monaco-keybinding.js.map