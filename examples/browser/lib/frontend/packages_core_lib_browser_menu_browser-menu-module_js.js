"use strict";
(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_core_lib_browser_menu_browser-menu-module_js"],{

/***/ "../../packages/core/lib/browser/menu/browser-context-menu-renderer.js":
/*!*****************************************************************************!*\
  !*** ../../packages/core/lib/browser/menu/browser-context-menu-renderer.js ***!
  \*****************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BrowserContextMenuRenderer = exports.BrowserContextMenuAccess = void 0;
const inversify_1 = __webpack_require__(/*! inversify */ "../../node_modules/inversify/es/inversify.js");
const context_menu_renderer_1 = __webpack_require__(/*! ../context-menu-renderer */ "../../packages/core/lib/browser/context-menu-renderer.js");
const browser_menu_plugin_1 = __webpack_require__(/*! ./browser-menu-plugin */ "../../packages/core/lib/browser/menu/browser-menu-plugin.js");
class BrowserContextMenuAccess extends context_menu_renderer_1.ContextMenuAccess {
    constructor(menu) {
        super(menu);
        this.menu = menu;
    }
}
exports.BrowserContextMenuAccess = BrowserContextMenuAccess;
let BrowserContextMenuRenderer = class BrowserContextMenuRenderer extends context_menu_renderer_1.ContextMenuRenderer {
    constructor(menuFactory) {
        super();
        this.menuFactory = menuFactory;
    }
    doRender({ menuPath, anchor, args, onHide, context, contextKeyService, skipSingleRootNode }) {
        const contextMenu = this.menuFactory.createContextMenu(menuPath, args, context, contextKeyService, skipSingleRootNode);
        const { x, y } = (0, context_menu_renderer_1.coordinateFromAnchor)(anchor);
        if (onHide) {
            contextMenu.aboutToClose.connect(() => onHide());
        }
        contextMenu.open(x, y);
        return new BrowserContextMenuAccess(contextMenu);
    }
};
BrowserContextMenuRenderer = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(browser_menu_plugin_1.BrowserMainMenuFactory)),
    __metadata("design:paramtypes", [browser_menu_plugin_1.BrowserMainMenuFactory])
], BrowserContextMenuRenderer);
exports.BrowserContextMenuRenderer = BrowserContextMenuRenderer;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/lib/browser/menu/browser-context-menu-renderer'] = this;


/***/ }),

/***/ "../../packages/core/lib/browser/menu/browser-menu-module.js":
/*!*******************************************************************!*\
  !*** ../../packages/core/lib/browser/menu/browser-menu-module.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
const inversify_1 = __webpack_require__(/*! inversify */ "../../node_modules/inversify/es/inversify.js");
const frontend_application_1 = __webpack_require__(/*! ../frontend-application */ "../../packages/core/lib/browser/frontend-application.js");
const context_menu_renderer_1 = __webpack_require__(/*! ../context-menu-renderer */ "../../packages/core/lib/browser/context-menu-renderer.js");
const browser_menu_plugin_1 = __webpack_require__(/*! ./browser-menu-plugin */ "../../packages/core/lib/browser/menu/browser-menu-plugin.js");
const browser_context_menu_renderer_1 = __webpack_require__(/*! ./browser-context-menu-renderer */ "../../packages/core/lib/browser/menu/browser-context-menu-renderer.js");
exports["default"] = new inversify_1.ContainerModule(bind => {
    bind(browser_menu_plugin_1.BrowserMainMenuFactory).toSelf().inSingletonScope();
    bind(context_menu_renderer_1.ContextMenuRenderer).to(browser_context_menu_renderer_1.BrowserContextMenuRenderer).inSingletonScope();
    bind(browser_menu_plugin_1.BrowserMenuBarContribution).toSelf().inSingletonScope();
    bind(frontend_application_1.FrontendApplicationContribution).toService(browser_menu_plugin_1.BrowserMenuBarContribution);
});

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/lib/browser/menu/browser-menu-module'] = this;


/***/ })

}]);
//# sourceMappingURL=packages_core_lib_browser_menu_browser-menu-module_js.js.map