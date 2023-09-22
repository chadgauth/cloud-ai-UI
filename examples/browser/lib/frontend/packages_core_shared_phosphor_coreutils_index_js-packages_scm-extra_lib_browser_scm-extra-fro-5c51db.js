(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_core_shared_phosphor_coreutils_index_js-packages_scm-extra_lib_browser_scm-extra-fro-5c51db"],{

/***/ "../../packages/core/shared/@phosphor/coreutils/index.js":
/*!***************************************************************!*\
  !*** ../../packages/core/shared/@phosphor/coreutils/index.js ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! @phosphor/coreutils */ "../../node_modules/@phosphor/coreutils/lib/index.js");

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/shared/@phosphor/coreutils'] = this;


/***/ }),

/***/ "../../packages/scm-extra/lib/browser/history/scm-history-contribution.js":
/*!********************************************************************************!*\
  !*** ../../packages/scm-extra/lib/browser/history/scm-history-contribution.js ***!
  \********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ScmHistoryContribution = exports.SCM_HISTORY_TOGGLE_KEYBINDING = exports.ScmHistoryCommands = exports.SCM_HISTORY_LABEL = exports.SCM_HISTORY_ID = void 0;
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const navigator_contribution_1 = __webpack_require__(/*! @theia/navigator/lib/browser/navigator-contribution */ "../../packages/navigator/lib/browser/navigator-contribution.js");
const uri_command_handler_1 = __webpack_require__(/*! @theia/core/lib/common/uri-command-handler */ "../../packages/core/lib/common/uri-command-handler.js");
const scm_service_1 = __webpack_require__(/*! @theia/scm/lib/browser/scm-service */ "../../packages/scm/lib/browser/scm-service.js");
const scm_extra_contribution_1 = __webpack_require__(/*! ../scm-extra-contribution */ "../../packages/scm-extra/lib/browser/scm-extra-contribution.js");
const scm_history_constants_1 = __webpack_require__(/*! ./scm-history-constants */ "../../packages/scm-extra/lib/browser/history/scm-history-constants.js");
Object.defineProperty(exports, "SCM_HISTORY_ID", ({ enumerable: true, get: function () { return scm_history_constants_1.SCM_HISTORY_ID; } }));
Object.defineProperty(exports, "SCM_HISTORY_LABEL", ({ enumerable: true, get: function () { return scm_history_constants_1.SCM_HISTORY_LABEL; } }));
Object.defineProperty(exports, "ScmHistoryCommands", ({ enumerable: true, get: function () { return scm_history_constants_1.ScmHistoryCommands; } }));
Object.defineProperty(exports, "SCM_HISTORY_TOGGLE_KEYBINDING", ({ enumerable: true, get: function () { return scm_history_constants_1.SCM_HISTORY_TOGGLE_KEYBINDING; } }));
let ScmHistoryContribution = class ScmHistoryContribution extends browser_1.AbstractViewContribution {
    constructor() {
        super({
            widgetId: scm_history_constants_1.SCM_HISTORY_ID,
            widgetName: scm_history_constants_1.SCM_HISTORY_LABEL,
            defaultWidgetOptions: {
                area: 'left',
                rank: 500
            },
            toggleCommandId: scm_history_constants_1.ScmHistoryCommands.OPEN_BRANCH_HISTORY.id,
            toggleKeybinding: scm_history_constants_1.SCM_HISTORY_TOGGLE_KEYBINDING
        });
    }
    async openView(args) {
        const widget = await super.openView(args);
        this.refreshWidget(args.uri);
        return widget;
    }
    registerMenus(menus) {
        menus.registerMenuAction(navigator_contribution_1.NavigatorContextMenu.SEARCH, {
            commandId: scm_history_constants_1.ScmHistoryCommands.OPEN_FILE_HISTORY.id,
            label: scm_history_constants_1.SCM_HISTORY_LABEL
        });
        menus.registerMenuAction(scm_extra_contribution_1.EDITOR_CONTEXT_MENU_SCM, {
            commandId: scm_history_constants_1.ScmHistoryCommands.OPEN_FILE_HISTORY.id,
            label: scm_history_constants_1.SCM_HISTORY_LABEL
        });
        super.registerMenus(menus);
    }
    registerCommands(commands) {
        commands.registerCommand(scm_history_constants_1.ScmHistoryCommands.OPEN_FILE_HISTORY, this.newUriAwareCommandHandler({
            isEnabled: (uri) => !!this.scmService.findRepository(uri),
            isVisible: (uri) => !!this.scmService.findRepository(uri),
            execute: async (uri) => this.openView({ activate: true, uri: uri.toString() }),
        }));
        super.registerCommands(commands);
    }
    async refreshWidget(uri) {
        const widget = this.tryGetWidget();
        if (!widget) {
            // the widget doesn't exist, so don't wake it up
            return;
        }
        await widget.setContent({ uri });
    }
    newUriAwareCommandHandler(handler) {
        return uri_command_handler_1.UriAwareCommandHandler.MonoSelect(this.selectionService, handler);
    }
};
__decorate([
    (0, inversify_1.inject)(core_1.SelectionService),
    __metadata("design:type", core_1.SelectionService)
], ScmHistoryContribution.prototype, "selectionService", void 0);
__decorate([
    (0, inversify_1.inject)(scm_service_1.ScmService),
    __metadata("design:type", scm_service_1.ScmService)
], ScmHistoryContribution.prototype, "scmService", void 0);
ScmHistoryContribution = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], ScmHistoryContribution);
exports.ScmHistoryContribution = ScmHistoryContribution;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/scm-extra/lib/browser/history/scm-history-contribution'] = this;


/***/ }),

/***/ "../../packages/scm-extra/lib/browser/history/scm-history-frontend-module.js":
/*!***********************************************************************************!*\
  !*** ../../packages/scm-extra/lib/browser/history/scm-history-frontend-module.js ***!
  \***********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2019 Arm and others.
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
exports.bindScmHistoryModule = void 0;
const scm_history_contribution_1 = __webpack_require__(/*! ./scm-history-contribution */ "../../packages/scm-extra/lib/browser/history/scm-history-contribution.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const scm_history_widget_1 = __webpack_require__(/*! ./scm-history-widget */ "../../packages/scm-extra/lib/browser/history/scm-history-widget.js");
const scm_extra_layout_migrations_1 = __webpack_require__(/*! ../scm-extra-layout-migrations */ "../../packages/scm-extra/lib/browser/scm-extra-layout-migrations.js");
__webpack_require__(/*! ../../../src/browser/style/history.css */ "../../packages/scm-extra/src/browser/style/history.css");
function bindScmHistoryModule(bind) {
    bind(scm_history_widget_1.ScmHistoryWidget).toSelf();
    bind(browser_1.WidgetFactory).toDynamicValue(ctx => ({
        id: scm_history_contribution_1.SCM_HISTORY_ID,
        createWidget: () => ctx.container.get(scm_history_widget_1.ScmHistoryWidget)
    }));
    (0, browser_1.bindViewContribution)(bind, scm_history_contribution_1.ScmHistoryContribution);
    bind(browser_1.ApplicationShellLayoutMigration).to(scm_extra_layout_migrations_1.ScmExtraLayoutVersion4Migration).inSingletonScope();
}
exports.bindScmHistoryModule = bindScmHistoryModule;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/scm-extra/lib/browser/history/scm-history-frontend-module'] = this;


/***/ }),

/***/ "../../packages/scm-extra/lib/browser/scm-extra-frontend-module.js":
/*!*************************************************************************!*\
  !*** ../../packages/scm-extra/lib/browser/scm-extra-frontend-module.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2019 Arm and others.
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
const scm_history_frontend_module_1 = __webpack_require__(/*! ./history/scm-history-frontend-module */ "../../packages/scm-extra/lib/browser/history/scm-history-frontend-module.js");
const scm_file_change_label_provider_1 = __webpack_require__(/*! ./scm-file-change-label-provider */ "../../packages/scm-extra/lib/browser/scm-file-change-label-provider.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
exports["default"] = new inversify_1.ContainerModule(bind => {
    (0, scm_history_frontend_module_1.bindScmHistoryModule)(bind);
    bind(scm_file_change_label_provider_1.ScmFileChangeLabelProvider).toSelf().inSingletonScope();
    bind(browser_1.LabelProviderContribution).toService(scm_file_change_label_provider_1.ScmFileChangeLabelProvider);
});

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/scm-extra/lib/browser/scm-extra-frontend-module'] = this;


/***/ }),

/***/ "../../packages/scm-extra/lib/browser/scm-extra-layout-migrations.js":
/*!***************************************************************************!*\
  !*** ../../packages/scm-extra/lib/browser/scm-extra-layout-migrations.js ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2020 Arm and others.
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
exports.ScmExtraLayoutVersion4Migration = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const scm_history_contribution_1 = __webpack_require__(/*! ./history/scm-history-contribution */ "../../packages/scm-extra/lib/browser/history/scm-history-contribution.js");
let ScmExtraLayoutVersion4Migration = class ScmExtraLayoutVersion4Migration {
    constructor() {
        this.layoutVersion = 4.0;
    }
    onWillInflateWidget(desc, { parent }) {
        if (desc.constructionOptions.factoryId === 'git-history') {
            desc.constructionOptions.factoryId = scm_history_contribution_1.SCM_HISTORY_ID;
            return desc;
        }
        return undefined;
    }
};
ScmExtraLayoutVersion4Migration = __decorate([
    (0, inversify_1.injectable)()
], ScmExtraLayoutVersion4Migration);
exports.ScmExtraLayoutVersion4Migration = ScmExtraLayoutVersion4Migration;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/scm-extra/lib/browser/scm-extra-layout-migrations'] = this;


/***/ }),

/***/ "../../packages/scm/lib/browser/scm-context-key-service.js":
/*!*****************************************************************!*\
  !*** ../../packages/scm/lib/browser/scm-context-key-service.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2019 TypeFox and others.
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
exports.ScmContextKeyService = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const context_key_service_1 = __webpack_require__(/*! @theia/core/lib/browser/context-key-service */ "../../packages/core/lib/browser/context-key-service.js");
let ScmContextKeyService = class ScmContextKeyService {
    get scmProvider() {
        return this._scmProvider;
    }
    get scmResourceGroup() {
        return this._scmResourceGroup;
    }
    init() {
        this._scmProvider = this.contextKeyService.createKey('scmProvider', undefined);
        this._scmResourceGroup = this.contextKeyService.createKey('scmResourceGroup', undefined);
    }
    match(expression) {
        return !expression || this.contextKeyService.match(expression);
    }
};
__decorate([
    (0, inversify_1.inject)(context_key_service_1.ContextKeyService),
    __metadata("design:type", Object)
], ScmContextKeyService.prototype, "contextKeyService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ScmContextKeyService.prototype, "init", null);
ScmContextKeyService = __decorate([
    (0, inversify_1.injectable)()
], ScmContextKeyService);
exports.ScmContextKeyService = ScmContextKeyService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/scm/lib/browser/scm-context-key-service'] = this;


/***/ }),

/***/ "../../node_modules/css-loader/dist/cjs.js!../../packages/scm-extra/src/browser/style/history.css":
/*!********************************************************************************************************!*\
  !*** ../../node_modules/css-loader/dist/cjs.js!../../packages/scm-extra/src/browser/style/history.css ***!
  \********************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "../../node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/api.js */ "../../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/********************************************************************************
 * Copyright (C) 2018 TypeFox and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0
 ********************************************************************************/

.theia-scm-history .history-container {
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
}

.theia-scm-history .listContainer {
  flex: 1;
  position: relative;
}

.theia-scm-history .commitList {
  height: 100%;
}

.theia-scm-history .history-container .noWrapInfo {
  width: 100%;
}

.theia-scm-history .commitList .commitListElement {
  margin: 3px 0;
}

.theia-scm-history .commitListElement.first .containerHead {
  border: none;
}

.theia-scm-history .commitListElement .containerHead {
  width: calc(100% - 5px);
  height: 50px;
  display: flex;
  align-items: center;
  border-top: 1px solid var(--theia-contrastBorder);
}

.theia-scm-history .commitListElement .containerHead:hover {
  background-color: var(--theia-list-hoverBackground);
  color: var(--theia-list-hoverForeground);
  cursor: pointer;
}

.theia-scm-history:focus-within
  .commitListElement
  .containerHead.theia-mod-selected {
  background: var(--theia-list-focusBackground);
  color: var(--theia-list-focusForeground);
}

.theia-scm-history:not(:focus-within)
  .commitListElement
  .containerHead.theia-mod-selected {
  background: var(--theia-list-inactiveFocusBackground);
}

.theia-scm-history .commitListElement .containerHead .headContent {
  display: flex;
  width: 100%;
  box-sizing: border-box;
  padding: 0 8px 0 2px;
}

.theia-scm-history
  .commitListElement
  .containerHead
  .headContent
  .image-container {
  margin-right: 5px;
}

.theia-scm-history
  .commitListElement
  .containerHead
  .headContent
  .image-container
  img {
  width: 27px;
}

.theia-scm-history
  .commitListElement
  .containerHead
  .headContent
  .headLabelContainer {
  min-width: calc(100% - 93px);
}

.theia-scm-history
  .commitListElement
  .containerHead
  .headContent
  .headLabelContainer.singleFileMode {
  width: 100%;
}

.theia-scm-history
  .commitListElement
  .containerHead
  .headContent
  .expansionToggle {
  display: flex;
  align-items: center;
}

.theia-scm-history
  .commitListElement
  .containerHead
  .headContent
  .detailButton {
  display: flex;
  align-items: center;
  visibility: hidden;
  margin: 0 5px;
}

.theia-scm-history
  .commitListElement
  .containerHead:hover
  .headContent
  .detailButton {
  visibility: visible;
}

.theia-scm-history
  .commitListElement
  .containerHead
  .headContent
  .expansionToggle
  > .toggle {
  display: flex;
  background: var(--theia-list-focusBackground);
  padding: 5px;
  border-radius: 7px;
  margin-left: 5px;
  align-items: center;
  justify-content: flex-end;
  min-width: 30px;
  color: var(--theia-theia-list-focusForeground);
}

.theia-scm-history .commitTime {
  color: var(--theia-descriptionForeground);
  font-size: smaller;
}

.theia-scm-history .large-spinner {
  font-size: 48px;
}
`, "",{"version":3,"sources":["webpack://./../../packages/scm-extra/src/browser/style/history.css"],"names":[],"mappings":"AAAA;;;;;;;;;;;;;;iFAciF;;AAEjF;EACE,aAAa;EACb,sBAAsB;EACtB,kBAAkB;EAClB,YAAY;AACd;;AAEA;EACE,OAAO;EACP,kBAAkB;AACpB;;AAEA;EACE,YAAY;AACd;;AAEA;EACE,WAAW;AACb;;AAEA;EACE,aAAa;AACf;;AAEA;EACE,YAAY;AACd;;AAEA;EACE,uBAAuB;EACvB,YAAY;EACZ,aAAa;EACb,mBAAmB;EACnB,iDAAiD;AACnD;;AAEA;EACE,mDAAmD;EACnD,wCAAwC;EACxC,eAAe;AACjB;;AAEA;;;EAGE,6CAA6C;EAC7C,wCAAwC;AAC1C;;AAEA;;;EAGE,qDAAqD;AACvD;;AAEA;EACE,aAAa;EACb,WAAW;EACX,sBAAsB;EACtB,oBAAoB;AACtB;;AAEA;;;;;EAKE,iBAAiB;AACnB;;AAEA;;;;;;EAME,WAAW;AACb;;AAEA;;;;;EAKE,4BAA4B;AAC9B;;AAEA;;;;;EAKE,WAAW;AACb;;AAEA;;;;;EAKE,aAAa;EACb,mBAAmB;AACrB;;AAEA;;;;;EAKE,aAAa;EACb,mBAAmB;EACnB,kBAAkB;EAClB,aAAa;AACf;;AAEA;;;;;EAKE,mBAAmB;AACrB;;AAEA;;;;;;EAME,aAAa;EACb,6CAA6C;EAC7C,YAAY;EACZ,kBAAkB;EAClB,gBAAgB;EAChB,mBAAmB;EACnB,yBAAyB;EACzB,eAAe;EACf,8CAA8C;AAChD;;AAEA;EACE,yCAAyC;EACzC,kBAAkB;AACpB;;AAEA;EACE,eAAe;AACjB","sourcesContent":["/********************************************************************************\n * Copyright (C) 2018 TypeFox and others.\n *\n * This program and the accompanying materials are made available under the\n * terms of the Eclipse Public License v. 2.0 which is available at\n * http://www.eclipse.org/legal/epl-2.0.\n *\n * This Source Code may also be made available under the following Secondary\n * Licenses when the conditions for such availability set forth in the Eclipse\n * Public License v. 2.0 are satisfied: GNU General Public License, version 2\n * with the GNU Classpath Exception which is available at\n * https://www.gnu.org/software/classpath/license.html.\n *\n * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0\n ********************************************************************************/\n\n.theia-scm-history .history-container {\n  display: flex;\n  flex-direction: column;\n  position: relative;\n  height: 100%;\n}\n\n.theia-scm-history .listContainer {\n  flex: 1;\n  position: relative;\n}\n\n.theia-scm-history .commitList {\n  height: 100%;\n}\n\n.theia-scm-history .history-container .noWrapInfo {\n  width: 100%;\n}\n\n.theia-scm-history .commitList .commitListElement {\n  margin: 3px 0;\n}\n\n.theia-scm-history .commitListElement.first .containerHead {\n  border: none;\n}\n\n.theia-scm-history .commitListElement .containerHead {\n  width: calc(100% - 5px);\n  height: 50px;\n  display: flex;\n  align-items: center;\n  border-top: 1px solid var(--theia-contrastBorder);\n}\n\n.theia-scm-history .commitListElement .containerHead:hover {\n  background-color: var(--theia-list-hoverBackground);\n  color: var(--theia-list-hoverForeground);\n  cursor: pointer;\n}\n\n.theia-scm-history:focus-within\n  .commitListElement\n  .containerHead.theia-mod-selected {\n  background: var(--theia-list-focusBackground);\n  color: var(--theia-list-focusForeground);\n}\n\n.theia-scm-history:not(:focus-within)\n  .commitListElement\n  .containerHead.theia-mod-selected {\n  background: var(--theia-list-inactiveFocusBackground);\n}\n\n.theia-scm-history .commitListElement .containerHead .headContent {\n  display: flex;\n  width: 100%;\n  box-sizing: border-box;\n  padding: 0 8px 0 2px;\n}\n\n.theia-scm-history\n  .commitListElement\n  .containerHead\n  .headContent\n  .image-container {\n  margin-right: 5px;\n}\n\n.theia-scm-history\n  .commitListElement\n  .containerHead\n  .headContent\n  .image-container\n  img {\n  width: 27px;\n}\n\n.theia-scm-history\n  .commitListElement\n  .containerHead\n  .headContent\n  .headLabelContainer {\n  min-width: calc(100% - 93px);\n}\n\n.theia-scm-history\n  .commitListElement\n  .containerHead\n  .headContent\n  .headLabelContainer.singleFileMode {\n  width: 100%;\n}\n\n.theia-scm-history\n  .commitListElement\n  .containerHead\n  .headContent\n  .expansionToggle {\n  display: flex;\n  align-items: center;\n}\n\n.theia-scm-history\n  .commitListElement\n  .containerHead\n  .headContent\n  .detailButton {\n  display: flex;\n  align-items: center;\n  visibility: hidden;\n  margin: 0 5px;\n}\n\n.theia-scm-history\n  .commitListElement\n  .containerHead:hover\n  .headContent\n  .detailButton {\n  visibility: visible;\n}\n\n.theia-scm-history\n  .commitListElement\n  .containerHead\n  .headContent\n  .expansionToggle\n  > .toggle {\n  display: flex;\n  background: var(--theia-list-focusBackground);\n  padding: 5px;\n  border-radius: 7px;\n  margin-left: 5px;\n  align-items: center;\n  justify-content: flex-end;\n  min-width: 30px;\n  color: var(--theia-theia-list-focusForeground);\n}\n\n.theia-scm-history .commitTime {\n  color: var(--theia-descriptionForeground);\n  font-size: smaller;\n}\n\n.theia-scm-history .large-spinner {\n  font-size: 48px;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../packages/scm-extra/src/browser/style/history.css":
/*!**************************************************************!*\
  !*** ../../packages/scm-extra/src/browser/style/history.css ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_history_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/css-loader/dist/cjs.js!./history.css */ "../../node_modules/css-loader/dist/cjs.js!../../packages/scm-extra/src/browser/style/history.css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_history_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_history_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ })

}]);
//# sourceMappingURL=packages_core_shared_phosphor_coreutils_index_js-packages_scm-extra_lib_browser_scm-extra-fro-5c51db.js.map