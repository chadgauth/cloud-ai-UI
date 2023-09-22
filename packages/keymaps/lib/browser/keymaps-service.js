"use strict";
// *****************************************************************************
// Copyright (C) 2017 Ericsson and others.
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
exports.KeymapsService = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/core/lib/browser");
const keybinding_1 = require("@theia/core/lib/browser/keybinding");
const keybinding_2 = require("@theia/core/lib/common/keybinding");
const browser_2 = require("@theia/userstorage/lib/browser");
const jsoncparser = require("jsonc-parser");
const event_1 = require("@theia/core/lib/common/event");
const monaco_text_model_service_1 = require("@theia/monaco/lib/browser/monaco-text-model-service");
const promise_util_1 = require("@theia/core/lib/common/promise-util");
const uri_1 = require("@theia/core/lib/common/uri");
const monaco_workspace_1 = require("@theia/monaco/lib/browser/monaco-workspace");
const message_service_1 = require("@theia/core/lib/common/message-service");
const monaco_jsonc_editor_1 = require("@theia/preferences/lib/browser/monaco-jsonc-editor");
let KeymapsService = class KeymapsService {
    constructor() {
        this.changeKeymapEmitter = new event_1.Emitter();
        this.onDidChangeKeymaps = this.changeKeymapEmitter.event;
        this.deferredModel = new promise_util_1.Deferred();
    }
    /**
     * Initialize the keybinding service.
     */
    init() {
        this.doInit();
    }
    async doInit() {
        const reference = await this.textModelService.createModelReference(browser_2.UserStorageUri.resolve('keymaps.json'));
        this.model = reference.object;
        this.deferredModel.resolve(this.model);
        this.reconcile();
        this.model.onDidChangeContent(() => this.reconcile());
        this.model.onDirtyChanged(() => this.reconcile());
        this.model.onDidChangeValid(() => this.reconcile());
        this.keybindingRegistry.onKeybindingsChanged(() => this.changeKeymapEmitter.fire(undefined));
    }
    /**
     * Reconcile all the keybindings, registering them to the registry.
     */
    reconcile() {
        const model = this.model;
        if (!model || model.dirty) {
            return;
        }
        try {
            const keybindings = [];
            if (model.valid) {
                const content = model.getText();
                const json = jsoncparser.parse(content, undefined, { disallowComments: false });
                if (Array.isArray(json)) {
                    for (const value of json) {
                        if (keybinding_2.Keybinding.is(value)) {
                            keybindings.push(value);
                        }
                        else if (keybinding_2.RawKeybinding.is(value)) {
                            keybindings.push(keybinding_2.Keybinding.apiObjectify(value));
                        }
                    }
                }
            }
            this.keybindingRegistry.setKeymap(keybinding_1.KeybindingScope.USER, keybindings);
        }
        catch (e) {
            console.error(`Failed to load keymaps from '${model.uri}'.`, e);
        }
    }
    /**
     * Open the keybindings widget.
     * @param ref the optional reference for opening the widget.
     */
    async open(ref) {
        const model = await this.deferredModel.promise;
        const options = {
            widgetOptions: ref ? { area: 'main', mode: 'split-right', ref } : { area: 'main' },
            mode: 'activate'
        };
        if (!model.valid) {
            await model.save();
        }
        await (0, browser_1.open)(this.opener, new uri_1.default(model.uri), options);
    }
    /**
     * Set the keybinding in the JSON.
     * @param newKeybinding the new JSON keybinding
     * @param oldKeybinding the old JSON keybinding
     */
    async setKeybinding(newKeybinding, oldKeybinding) {
        return this.updateKeymap(() => {
            let newAdded = false;
            let isOldKeybindingDisabled = false;
            let addedDisabledEntry = false;
            const keybindings = [];
            for (let keybinding of this.keybindingRegistry.getKeybindingsByScope(keybinding_1.KeybindingScope.USER)) {
                // search for the old keybinding and modify it
                if (oldKeybinding && keybinding_2.Keybinding.equals(keybinding, oldKeybinding, false, true)) {
                    newAdded = true;
                    keybinding = {
                        ...keybinding,
                        keybinding: newKeybinding.keybinding
                    };
                }
                // we have an disabled entry for the same command and the oldKeybinding
                if ((oldKeybinding === null || oldKeybinding === void 0 ? void 0 : oldKeybinding.keybinding) &&
                    keybinding_2.Keybinding.equals(keybinding, { ...newKeybinding, keybinding: oldKeybinding.keybinding, command: '-' + newKeybinding.command }, false, true)) {
                    isOldKeybindingDisabled = true;
                }
                keybindings.push(keybinding);
            }
            if (!newAdded) {
                keybindings.push({
                    command: newKeybinding.command,
                    keybinding: newKeybinding.keybinding,
                    context: newKeybinding.context,
                    when: newKeybinding.when,
                    args: newKeybinding.args
                });
                newAdded = true;
            }
            // we want to add a disabled entry for the old keybinding only when we are modifying the default value
            if (!isOldKeybindingDisabled && (oldKeybinding === null || oldKeybinding === void 0 ? void 0 : oldKeybinding.scope) === keybinding_1.KeybindingScope.DEFAULT) {
                const disabledBinding = {
                    command: '-' + newKeybinding.command,
                    // TODO key: oldKeybinding, see https://github.com/eclipse-theia/theia/issues/6879
                    keybinding: oldKeybinding.keybinding,
                    context: newKeybinding.context,
                    when: newKeybinding.when,
                    args: newKeybinding.args
                };
                // Add disablement of the old keybinding if it isn't already disabled in the list to avoid duplicate disabled entries
                if (!keybindings.some(binding => keybinding_2.Keybinding.equals(binding, disabledBinding, false, true))) {
                    keybindings.push(disabledBinding);
                }
                isOldKeybindingDisabled = true;
                addedDisabledEntry = true;
            }
            if (newAdded || addedDisabledEntry) {
                return keybindings;
            }
        });
    }
    /**
     * Remove the given keybinding with the given command id from the JSON.
     * @param commandId the keybinding command id.
     */
    removeKeybinding(commandId) {
        return this.updateKeymap(() => {
            const keybindings = this.keybindingRegistry.getKeybindingsByScope(keybinding_1.KeybindingScope.USER);
            const removedCommand = '-' + commandId;
            const filtered = keybindings.filter(a => a.command !== commandId && a.command !== removedCommand);
            if (filtered.length !== keybindings.length) {
                return filtered;
            }
        });
    }
    async updateKeymap(op) {
        const model = await this.deferredModel.promise;
        try {
            const keybindings = op();
            if (keybindings && this.model) {
                await this.jsoncEditor.setValue(this.model, [], keybindings.map(binding => keybinding_2.Keybinding.apiObjectify(binding)));
            }
        }
        catch (e) {
            const message = `Failed to update a keymap in '${model.uri}'.`;
            this.messageService.error(`${message} Please check if it is corrupted.`);
            console.error(`${message}`, e);
        }
    }
};
__decorate([
    (0, inversify_1.inject)(monaco_workspace_1.MonacoWorkspace),
    __metadata("design:type", monaco_workspace_1.MonacoWorkspace)
], KeymapsService.prototype, "workspace", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_text_model_service_1.MonacoTextModelService),
    __metadata("design:type", monaco_text_model_service_1.MonacoTextModelService)
], KeymapsService.prototype, "textModelService", void 0);
__decorate([
    (0, inversify_1.inject)(keybinding_1.KeybindingRegistry),
    __metadata("design:type", keybinding_1.KeybindingRegistry)
], KeymapsService.prototype, "keybindingRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.OpenerService),
    __metadata("design:type", Object)
], KeymapsService.prototype, "opener", void 0);
__decorate([
    (0, inversify_1.inject)(message_service_1.MessageService),
    __metadata("design:type", message_service_1.MessageService)
], KeymapsService.prototype, "messageService", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_jsonc_editor_1.MonacoJSONCEditor),
    __metadata("design:type", monaco_jsonc_editor_1.MonacoJSONCEditor)
], KeymapsService.prototype, "jsoncEditor", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], KeymapsService.prototype, "init", null);
KeymapsService = __decorate([
    (0, inversify_1.injectable)()
], KeymapsService);
exports.KeymapsService = KeymapsService;
//# sourceMappingURL=keymaps-service.js.map