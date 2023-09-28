"use strict";
// *****************************************************************************
// Copyright (C) 2018 Red Hat, Inc. and others.
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
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuickOpenMainImpl = void 0;
const plugin_api_rpc_1 = require("../../common/plugin-api-rpc");
const browser_1 = require("@theia/core/lib/browser");
const disposable_1 = require("@theia/core/lib/common/disposable");
const monaco_quick_input_service_1 = require("@theia/monaco/lib/browser/monaco-quick-input-service");
const types_impl_1 = require("../../plugin/types-impl");
const quick_open_1 = require("../../plugin/quick-open");
const monaco = require("@theia/monaco-editor-core");
const themeService_1 = require("@theia/monaco-editor-core/esm/vs/platform/theme/common/themeService");
class QuickOpenMainImpl {
    constructor(rpc, container) {
        this.items = {};
        this.toDispose = new disposable_1.DisposableCollection();
        this.sessions = new Map();
        this.proxy = rpc.getProxy(plugin_api_rpc_1.MAIN_RPC_CONTEXT.QUICK_OPEN_EXT);
        this.delegate = container.get(monaco_quick_input_service_1.MonacoQuickInputService);
        this.quickInputService = container.get(browser_1.QuickInputService);
    }
    dispose() {
        this.toDispose.dispose();
    }
    async $show(instance, options, token) {
        const contents = new Promise((resolve, reject) => {
            this.items[instance] = { resolve, reject };
        });
        options = {
            ...options,
            onDidFocus: (el) => {
                if (el) {
                    this.proxy.$onItemSelected(el.handle);
                }
            }
        };
        const result = await this.delegate.pick(contents, options, token);
        if (Array.isArray(result)) {
            return result.map(({ handle }) => handle);
        }
        else if (result) {
            return result.handle;
        }
        return undefined;
    }
    $setItems(instance, items) {
        if (this.items[instance]) {
            this.items[instance].resolve(items);
            delete this.items[instance];
        }
        return Promise.resolve();
    }
    $setError(instance, error) {
        if (this.items[instance]) {
            this.items[instance].reject(error);
            delete this.items[instance];
        }
        return Promise.resolve();
    }
    $input(options, validateInput, token) {
        var _a;
        const inputOptions = Object.create(null);
        if (options) {
            inputOptions.title = options.title;
            inputOptions.password = options.password;
            inputOptions.placeHolder = options.placeHolder;
            inputOptions.valueSelection = options.valueSelection;
            inputOptions.prompt = options.prompt;
            inputOptions.value = options.value;
            inputOptions.ignoreFocusLost = options.ignoreFocusOut;
        }
        if (validateInput) {
            inputOptions.validateInput = (val) => this.proxy.$validateInput(val);
        }
        return (_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.input(inputOptions, token);
    }
    async $showInputBox(options, validateInput) {
        return new Promise((resolve, reject) => {
            var _a;
            const sessionId = options.id;
            const toDispose = new disposable_1.DisposableCollection();
            const inputBox = (_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.createInputBox();
            inputBox.prompt = options.prompt;
            inputBox.placeholder = options.placeHolder;
            inputBox.value = options.value;
            if (options.busy) {
                inputBox.busy = options.busy;
            }
            if (options.enabled) {
                inputBox.enabled = options.enabled;
            }
            inputBox.ignoreFocusOut = options.ignoreFocusOut;
            inputBox.contextKey = options.contextKey;
            if (options.password) {
                inputBox.password = options.password;
            }
            inputBox.step = options.step;
            inputBox.title = options.title;
            inputBox.description = options.description;
            inputBox.totalSteps = options.totalSteps;
            inputBox.buttons = options.buttons ? this.convertToQuickInputButtons(options.buttons) : [];
            inputBox.validationMessage = options.validationMessage;
            if (validateInput) {
                options.validateInput = (val) => {
                    this.proxy.$validateInput(val);
                };
            }
            toDispose.push(inputBox.onDidAccept(() => {
                this.proxy.$acceptOnDidAccept(sessionId);
                resolve(inputBox.value);
            }));
            toDispose.push(inputBox.onDidChangeValue((value) => {
                this.proxy.$acceptDidChangeValue(sessionId, value);
                inputBox.validationMessage = options.validateInput(value);
            }));
            toDispose.push(inputBox.onDidTriggerButton((button) => {
                this.proxy.$acceptOnDidTriggerButton(sessionId, button);
            }));
            toDispose.push(inputBox.onDidHide(() => {
                if (toDispose.disposed) {
                    return;
                }
                this.proxy.$acceptOnDidHide(sessionId);
                toDispose.dispose();
                resolve(undefined);
            }));
            this.toDispose.push(toDispose);
            inputBox.show();
        });
    }
    $createOrUpdate(params) {
        const sessionId = params.id;
        let session;
        const candidate = this.sessions.get(sessionId);
        if (!candidate) {
            if (params.type === 'quickPick') {
                const quickPick = this.quickInputService.createQuickPick();
                quickPick.onDidAccept(() => {
                    this.proxy.$acceptOnDidAccept(sessionId);
                });
                quickPick.onDidChangeActive((items) => {
                    this.proxy.$onDidChangeActive(sessionId, items.map(item => item.handle));
                });
                quickPick.onDidChangeSelection((items) => {
                    this.proxy.$onDidChangeSelection(sessionId, items.map(item => item.handle));
                });
                quickPick.onDidTriggerButton((button) => {
                    this.proxy.$acceptOnDidTriggerButton(sessionId, button);
                });
                quickPick.onDidTriggerItemButton(e => {
                    this.proxy.$onDidTriggerItemButton(sessionId, e.item.handle, e.button.handle);
                });
                quickPick.onDidChangeValue((value) => {
                    this.proxy.$acceptDidChangeValue(sessionId, value);
                });
                quickPick.onDidHide(() => {
                    this.proxy.$acceptOnDidHide(sessionId);
                });
                session = {
                    input: quickPick,
                    handlesToItems: new Map()
                };
            }
            else {
                const inputBox = this.quickInputService.createInputBox();
                inputBox.onDidAccept(() => {
                    this.proxy.$acceptOnDidAccept(sessionId);
                });
                inputBox.onDidTriggerButton((button) => {
                    this.proxy.$acceptOnDidTriggerButton(sessionId, button);
                });
                inputBox.onDidChangeValue((value) => {
                    this.proxy.$acceptDidChangeValue(sessionId, value);
                });
                inputBox.onDidHide(() => {
                    this.proxy.$acceptOnDidHide(sessionId);
                });
                session = {
                    input: inputBox,
                    handlesToItems: new Map()
                };
            }
            this.sessions.set(sessionId, session);
        }
        else {
            session = candidate;
        }
        if (session) {
            const { input, handlesToItems } = session;
            for (const param in params) {
                if (param === 'id' || param === 'type') {
                    continue;
                }
                if (param === 'visible') {
                    if (params.visible) {
                        input.show();
                    }
                    else {
                        input.hide();
                    }
                }
                else if (param === 'items') {
                    handlesToItems.clear();
                    params[param].forEach((item) => {
                        handlesToItems.set(item.handle, item);
                    });
                    input[param] = params[param];
                }
                else if (param === 'activeItems' || param === 'selectedItems') {
                    input[param] = params[param]
                        .filter((handle) => handlesToItems.has(handle))
                        .map((handle) => handlesToItems.get(handle));
                }
                else if (param === 'buttons') {
                    input[param] = params.buttons.map(button => {
                        if (button.handle === -1) {
                            return this.quickInputService.backButton;
                        }
                        const { iconPath, tooltip, handle } = button;
                        if ('id' in iconPath) {
                            return {
                                iconClass: themeService_1.ThemeIcon.asClassName(iconPath),
                                tooltip,
                                handle
                            };
                        }
                        else {
                            const monacoIconPath = iconPath;
                            return {
                                iconPath: {
                                    dark: monaco.Uri.revive(monacoIconPath.dark),
                                    light: monacoIconPath.light && monaco.Uri.revive(monacoIconPath.light)
                                },
                                tooltip,
                                handle
                            };
                        }
                    });
                }
                else {
                    input[param] = params[param];
                }
            }
        }
        return Promise.resolve(undefined);
    }
    $hide() {
        this.delegate.hide();
    }
    $dispose(sessionId) {
        const session = this.sessions.get(sessionId);
        if (session) {
            session.input.dispose();
            this.sessions.delete(sessionId);
        }
        return Promise.resolve(undefined);
    }
    convertToQuickInputButtons(buttons) {
        return buttons.map((button, i) => ({
            ...(0, quick_open_1.getIconPathOrClass)(button),
            tooltip: button.tooltip,
            handle: button === types_impl_1.QuickInputButtons.Back ? -1 : i,
        }));
    }
}
exports.QuickOpenMainImpl = QuickOpenMainImpl;
//# sourceMappingURL=quick-open-main.js.map