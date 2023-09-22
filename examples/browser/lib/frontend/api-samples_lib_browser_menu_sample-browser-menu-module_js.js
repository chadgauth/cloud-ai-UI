"use strict";
(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["api-samples_lib_browser_menu_sample-browser-menu-module_js"],{

/***/ "../api-samples/lib/browser/menu/sample-browser-menu-module.js":
/*!*********************************************************************!*\
  !*** ../api-samples/lib/browser/menu/sample-browser-menu-module.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2020 TypeFox and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_menu_plugin_1 = __webpack_require__(/*! @theia/core/lib/browser/menu/browser-menu-plugin */ "../../packages/core/lib/browser/menu/browser-menu-plugin.js");
const sample_menu_contribution_1 = __webpack_require__(/*! ./sample-menu-contribution */ "../api-samples/lib/browser/menu/sample-menu-contribution.js");
exports["default"] = new inversify_1.ContainerModule((bind, unbind, isBound, rebind) => {
    rebind(browser_menu_plugin_1.BrowserMainMenuFactory).to(SampleBrowserMainMenuFactory).inSingletonScope();
});
let SampleBrowserMainMenuFactory = class SampleBrowserMainMenuFactory extends browser_menu_plugin_1.BrowserMainMenuFactory {
    registerMenu(menuCommandRegistry, menu, args) {
        if (menu instanceof sample_menu_contribution_1.PlaceholderMenuNode && menuCommandRegistry instanceof SampleMenuCommandRegistry) {
            menuCommandRegistry.registerPlaceholderMenu(menu);
        }
        else {
            super.registerMenu(menuCommandRegistry, menu, args);
        }
    }
    createMenuCommandRegistry(menu, args = []) {
        const menuCommandRegistry = new SampleMenuCommandRegistry(this.services);
        this.registerMenu(menuCommandRegistry, menu, args);
        return menuCommandRegistry;
    }
    createMenuWidget(menu, options) {
        return new SampleDynamicMenuWidget(menu, options, this.services);
    }
};
SampleBrowserMainMenuFactory = __decorate([
    (0, inversify_1.injectable)()
], SampleBrowserMainMenuFactory);
class SampleMenuCommandRegistry extends browser_menu_plugin_1.MenuCommandRegistry {
    constructor() {
        super(...arguments);
        this.placeholders = new Map();
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    registerPlaceholderMenu(menu) {
        const { id } = menu;
        if (this.placeholders.has(id)) {
            return;
        }
        this.placeholders.set(id, menu);
    }
    snapshot(menuPath) {
        super.snapshot(menuPath);
        for (const menu of this.placeholders.values()) {
            this.toDispose.push(this.registerPlaceholder(menu));
        }
        return this;
    }
    registerPlaceholder(menu) {
        const { id } = menu;
        return this.addCommand(id, {
            execute: () => { },
            label: menu.label,
            icon: menu.icon,
            isEnabled: () => false,
            isVisible: () => true
        });
    }
}
class SampleDynamicMenuWidget extends browser_menu_plugin_1.DynamicMenuWidget {
    buildSubMenus(parentItems, menu, commands) {
        if (menu instanceof sample_menu_contribution_1.PlaceholderMenuNode) {
            parentItems.push({
                command: menu.id,
                type: 'command',
            });
        }
        else {
            super.buildSubMenus(parentItems, menu, commands);
        }
        return parentItems;
    }
}

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/api-samples/lib/browser/menu/sample-browser-menu-module'] = this;


/***/ })

}]);
//# sourceMappingURL=api-samples_lib_browser_menu_sample-browser-menu-module_js.js.map