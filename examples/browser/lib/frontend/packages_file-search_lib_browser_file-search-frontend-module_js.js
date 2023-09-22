"use strict";
(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_file-search_lib_browser_file-search-frontend-module_js"],{

/***/ "../../packages/file-search/lib/browser/file-search-frontend-module.js":
/*!*****************************************************************************!*\
  !*** ../../packages/file-search/lib/browser/file-search-frontend-module.js ***!
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const quick_file_open_contribution_1 = __webpack_require__(/*! ./quick-file-open-contribution */ "../../packages/file-search/lib/browser/quick-file-open-contribution.js");
const quick_file_open_1 = __webpack_require__(/*! ./quick-file-open */ "../../packages/file-search/lib/browser/quick-file-open.js");
const file_search_service_1 = __webpack_require__(/*! ../common/file-search-service */ "../../packages/file-search/lib/common/file-search-service.js");
const quick_access_1 = __webpack_require__(/*! @theia/core/lib/browser/quick-input/quick-access */ "../../packages/core/lib/browser/quick-input/quick-access.js");
exports["default"] = new inversify_1.ContainerModule((bind) => {
    bind(file_search_service_1.FileSearchService).toDynamicValue(ctx => {
        const provider = ctx.container.get(browser_1.WebSocketConnectionProvider);
        return provider.createProxy(file_search_service_1.fileSearchServicePath);
    }).inSingletonScope();
    bind(quick_file_open_contribution_1.QuickFileOpenFrontendContribution).toSelf().inSingletonScope();
    [common_1.CommandContribution, browser_1.KeybindingContribution, common_1.MenuContribution, quick_access_1.QuickAccessContribution].forEach(serviceIdentifier => bind(serviceIdentifier).toService(quick_file_open_contribution_1.QuickFileOpenFrontendContribution));
    bind(quick_file_open_1.QuickFileOpenService).toSelf().inSingletonScope();
});

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/file-search/lib/browser/file-search-frontend-module'] = this;


/***/ }),

/***/ "../../packages/file-search/lib/browser/quick-file-open-contribution.js":
/*!******************************************************************************!*\
  !*** ../../packages/file-search/lib/browser/quick-file-open-contribution.js ***!
  \******************************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QuickFileOpenFrontendContribution = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const quick_file_open_1 = __webpack_require__(/*! ./quick-file-open */ "../../packages/file-search/lib/browser/quick-file-open.js");
const browser_1 = __webpack_require__(/*! @theia/editor/lib/browser */ "../../packages/editor/lib/browser/index.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
let QuickFileOpenFrontendContribution = class QuickFileOpenFrontendContribution {
    registerCommands(commands) {
        commands.registerCommand(quick_file_open_1.quickFileOpen, {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            execute: (...args) => {
                let fileURI;
                if (args) {
                    [fileURI] = args;
                }
                if (fileURI) {
                    this.quickFileOpenService.openFile(new uri_1.default(fileURI));
                }
                else {
                    this.quickFileOpenService.open();
                }
            }
        });
    }
    registerKeybindings(keybindings) {
        keybindings.registerKeybinding({
            command: quick_file_open_1.quickFileOpen.id,
            keybinding: 'ctrlcmd+p'
        });
    }
    registerMenus(menus) {
        menus.registerMenuAction(browser_1.EditorMainMenu.WORKSPACE_GROUP, {
            commandId: quick_file_open_1.quickFileOpen.id,
            label: nls_1.nls.localizeByDefault('Go to File...'),
            order: '1',
        });
    }
    registerQuickAccessProvider() {
        this.quickFileOpenService.registerQuickAccessProvider();
    }
};
__decorate([
    (0, inversify_1.inject)(quick_file_open_1.QuickFileOpenService),
    __metadata("design:type", quick_file_open_1.QuickFileOpenService)
], QuickFileOpenFrontendContribution.prototype, "quickFileOpenService", void 0);
QuickFileOpenFrontendContribution = __decorate([
    (0, inversify_1.injectable)()
], QuickFileOpenFrontendContribution);
exports.QuickFileOpenFrontendContribution = QuickFileOpenFrontendContribution;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/file-search/lib/browser/quick-file-open-contribution'] = this;


/***/ })

}]);
//# sourceMappingURL=packages_file-search_lib_browser_file-search-frontend-module_js.js.map