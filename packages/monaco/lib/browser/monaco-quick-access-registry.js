"use strict";
// *****************************************************************************
// Copyright (C) 2021 Red Hat and others.
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
exports.MonacoQuickAccessRegistry = void 0;
const browser_1 = require("@theia/core/lib/browser");
const inversify_1 = require("@theia/core/shared/inversify");
const monaco_quick_input_service_1 = require("./monaco-quick-input-service");
const pickerQuickAccess_1 = require("@theia/monaco-editor-core/esm/vs/platform/quickinput/browser/pickerQuickAccess");
const quickAccess_1 = require("@theia/monaco-editor-core/esm/vs/platform/quickinput/common/quickAccess");
const platform_1 = require("@theia/monaco-editor-core/esm/vs/platform/registry/common/platform");
class MonacoPickerAccessProvider extends pickerQuickAccess_1.PickerQuickAccessProvider {
    constructor(prefix, options) {
        super(prefix, options);
    }
}
class TheiaQuickAccessDescriptor {
    constructor(theiaDescriptor, 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ctor, prefix, helpEntries, placeholder) {
        this.theiaDescriptor = theiaDescriptor;
        this.ctor = ctor;
        this.prefix = prefix;
        this.helpEntries = helpEntries;
        this.placeholder = placeholder;
    }
}
let MonacoQuickAccessRegistry = class MonacoQuickAccessRegistry {
    get monacoRegistry() {
        return platform_1.Registry.as(quickAccess_1.Extensions.Quickaccess);
    }
    registerQuickAccessProvider(descriptor) {
        const toMonacoPick = (item) => {
            if (browser_1.QuickPickSeparator.is(item)) {
                return item;
            }
            else {
                return new monaco_quick_input_service_1.MonacoQuickPickItem(item, this.keybindingRegistry);
            }
        };
        const inner = class extends MonacoPickerAccessProvider {
            getDescriptor() {
                return descriptor;
            }
            constructor() {
                super(descriptor.prefix);
            }
            async _getPicks(filter, disposables, token) {
                const result = await Promise.resolve(descriptor.getInstance().getPicks(filter, token));
                return result.map(toMonacoPick);
            }
        };
        return this.monacoRegistry.registerQuickAccessProvider(new TheiaQuickAccessDescriptor(descriptor, inner, descriptor.prefix, descriptor.helpEntries, descriptor.placeholder));
    }
    getQuickAccessProviders() {
        return this.monacoRegistry.getQuickAccessProviders()
            .filter(provider => provider instanceof TheiaQuickAccessDescriptor)
            .map(provider => provider.theiaDescriptor);
    }
    getQuickAccessProvider(prefix) {
        const monacoDescriptor = this.monacoRegistry.getQuickAccessProvider(prefix);
        return monacoDescriptor ? monacoDescriptor.theiaDescriptor : undefined;
    }
    clear() {
        if (this.monacoRegistry instanceof quickAccess_1.QuickAccessRegistry) {
            this.monacoRegistry.clear();
        }
    }
};
__decorate([
    (0, inversify_1.inject)(browser_1.KeybindingRegistry),
    __metadata("design:type", browser_1.KeybindingRegistry)
], MonacoQuickAccessRegistry.prototype, "keybindingRegistry", void 0);
MonacoQuickAccessRegistry = __decorate([
    (0, inversify_1.injectable)()
], MonacoQuickAccessRegistry);
exports.MonacoQuickAccessRegistry = MonacoQuickAccessRegistry;
//# sourceMappingURL=monaco-quick-access-registry.js.map