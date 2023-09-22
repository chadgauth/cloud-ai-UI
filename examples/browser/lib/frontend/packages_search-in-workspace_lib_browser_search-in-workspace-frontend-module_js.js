"use strict";
(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_search-in-workspace_lib_browser_search-in-workspace-frontend-module_js"],{

/***/ "../../packages/search-in-workspace/lib/browser/search-in-workspace-frontend-module.js":
/*!*********************************************************************************************!*\
  !*** ../../packages/search-in-workspace/lib/browser/search-in-workspace-frontend-module.js ***!
  \*********************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2017-2018 Ericsson and others.
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
exports.createSearchTreeWidget = void 0;
__webpack_require__(/*! ../../src/browser/styles/index.css */ "../../packages/search-in-workspace/src/browser/styles/index.css");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const search_in_workspace_service_1 = __webpack_require__(/*! ./search-in-workspace-service */ "../../packages/search-in-workspace/lib/browser/search-in-workspace-service.js");
const search_in_workspace_interface_1 = __webpack_require__(/*! ../common/search-in-workspace-interface */ "../../packages/search-in-workspace/lib/common/search-in-workspace-interface.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const search_in_workspace_widget_1 = __webpack_require__(/*! ./search-in-workspace-widget */ "../../packages/search-in-workspace/lib/browser/search-in-workspace-widget.js");
const search_in_workspace_result_tree_widget_1 = __webpack_require__(/*! ./search-in-workspace-result-tree-widget */ "../../packages/search-in-workspace/lib/browser/search-in-workspace-result-tree-widget.js");
const search_in_workspace_frontend_contribution_1 = __webpack_require__(/*! ./search-in-workspace-frontend-contribution */ "../../packages/search-in-workspace/lib/browser/search-in-workspace-frontend-contribution.js");
const search_in_workspace_context_key_service_1 = __webpack_require__(/*! ./search-in-workspace-context-key-service */ "../../packages/search-in-workspace/lib/browser/search-in-workspace-context-key-service.js");
const tab_bar_toolbar_1 = __webpack_require__(/*! @theia/core/lib/browser/shell/tab-bar-toolbar */ "../../packages/core/lib/browser/shell/tab-bar-toolbar/index.js");
const search_in_workspace_preferences_1 = __webpack_require__(/*! ./search-in-workspace-preferences */ "../../packages/search-in-workspace/lib/browser/search-in-workspace-preferences.js");
const search_in_workspace_label_provider_1 = __webpack_require__(/*! ./search-in-workspace-label-provider */ "../../packages/search-in-workspace/lib/browser/search-in-workspace-label-provider.js");
const search_in_workspace_factory_1 = __webpack_require__(/*! ./search-in-workspace-factory */ "../../packages/search-in-workspace/lib/browser/search-in-workspace-factory.js");
const search_layout_migrations_1 = __webpack_require__(/*! ./search-layout-migrations */ "../../packages/search-in-workspace/lib/browser/search-layout-migrations.js");
exports["default"] = new inversify_1.ContainerModule(bind => {
    bind(search_in_workspace_context_key_service_1.SearchInWorkspaceContextKeyService).toSelf().inSingletonScope();
    bind(search_in_workspace_widget_1.SearchInWorkspaceWidget).toSelf();
    bind(browser_1.WidgetFactory).toDynamicValue(ctx => ({
        id: search_in_workspace_widget_1.SearchInWorkspaceWidget.ID,
        createWidget: () => ctx.container.get(search_in_workspace_widget_1.SearchInWorkspaceWidget)
    }));
    bind(search_in_workspace_result_tree_widget_1.SearchInWorkspaceResultTreeWidget).toDynamicValue(ctx => createSearchTreeWidget(ctx.container));
    bind(search_in_workspace_factory_1.SearchInWorkspaceFactory).toSelf().inSingletonScope();
    bind(browser_1.WidgetFactory).toService(search_in_workspace_factory_1.SearchInWorkspaceFactory);
    bind(browser_1.ApplicationShellLayoutMigration).to(search_layout_migrations_1.SearchLayoutVersion3Migration).inSingletonScope();
    (0, browser_1.bindViewContribution)(bind, search_in_workspace_frontend_contribution_1.SearchInWorkspaceFrontendContribution);
    bind(browser_1.FrontendApplicationContribution).toService(search_in_workspace_frontend_contribution_1.SearchInWorkspaceFrontendContribution);
    bind(tab_bar_toolbar_1.TabBarToolbarContribution).toService(search_in_workspace_frontend_contribution_1.SearchInWorkspaceFrontendContribution);
    bind(browser_1.StylingParticipant).toService(search_in_workspace_frontend_contribution_1.SearchInWorkspaceFrontendContribution);
    // The object that gets notified of search results.
    bind(search_in_workspace_service_1.SearchInWorkspaceClientImpl).toSelf().inSingletonScope();
    bind(search_in_workspace_service_1.SearchInWorkspaceService).toSelf().inSingletonScope();
    // The object to call methods on the backend.
    bind(search_in_workspace_interface_1.SearchInWorkspaceServer).toDynamicValue(ctx => {
        const client = ctx.container.get(search_in_workspace_service_1.SearchInWorkspaceClientImpl);
        return browser_1.WebSocketConnectionProvider.createProxy(ctx.container, search_in_workspace_interface_1.SIW_WS_PATH, client);
    }).inSingletonScope();
    (0, search_in_workspace_preferences_1.bindSearchInWorkspacePreferences)(bind);
    bind(search_in_workspace_label_provider_1.SearchInWorkspaceLabelProvider).toSelf().inSingletonScope();
    bind(browser_1.LabelProviderContribution).toService(search_in_workspace_label_provider_1.SearchInWorkspaceLabelProvider);
});
function createSearchTreeWidget(parent) {
    const child = (0, browser_1.createTreeContainer)(parent, {
        widget: search_in_workspace_result_tree_widget_1.SearchInWorkspaceResultTreeWidget,
        props: {
            contextMenuPath: search_in_workspace_result_tree_widget_1.SearchInWorkspaceResultTreeWidget.Menus.BASE,
            multiSelect: true,
            globalSelection: true
        }
    });
    return child.get(search_in_workspace_result_tree_widget_1.SearchInWorkspaceResultTreeWidget);
}
exports.createSearchTreeWidget = createSearchTreeWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/search-in-workspace/lib/browser/search-in-workspace-frontend-module'] = this;


/***/ }),

/***/ "../../packages/search-in-workspace/lib/browser/search-in-workspace-label-provider.js":
/*!********************************************************************************************!*\
  !*** ../../packages/search-in-workspace/lib/browser/search-in-workspace-label-provider.js ***!
  \********************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
exports.SearchInWorkspaceLabelProvider = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const label_provider_1 = __webpack_require__(/*! @theia/core/lib/browser/label-provider */ "../../packages/core/lib/browser/label-provider.js");
const search_in_workspace_result_tree_widget_1 = __webpack_require__(/*! ./search-in-workspace-result-tree-widget */ "../../packages/search-in-workspace/lib/browser/search-in-workspace-result-tree-widget.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
let SearchInWorkspaceLabelProvider = class SearchInWorkspaceLabelProvider {
    canHandle(element) {
        return search_in_workspace_result_tree_widget_1.SearchInWorkspaceRootFolderNode.is(element) || search_in_workspace_result_tree_widget_1.SearchInWorkspaceFileNode.is(element) ? 100 : 0;
    }
    getIcon(node) {
        if (search_in_workspace_result_tree_widget_1.SearchInWorkspaceFileNode.is(node)) {
            return this.labelProvider.getIcon(new uri_1.default(node.fileUri).withScheme('file'));
        }
        return this.labelProvider.folderIcon;
    }
    getName(node) {
        const uri = search_in_workspace_result_tree_widget_1.SearchInWorkspaceFileNode.is(node) ? node.fileUri : node.folderUri;
        return new uri_1.default(uri).displayName;
    }
    affects(node, event) {
        return search_in_workspace_result_tree_widget_1.SearchInWorkspaceFileNode.is(node) && event.affects(new uri_1.default(node.fileUri).withScheme('file'));
    }
};
__decorate([
    (0, inversify_1.inject)(label_provider_1.LabelProvider),
    __metadata("design:type", label_provider_1.LabelProvider)
], SearchInWorkspaceLabelProvider.prototype, "labelProvider", void 0);
SearchInWorkspaceLabelProvider = __decorate([
    (0, inversify_1.injectable)()
], SearchInWorkspaceLabelProvider);
exports.SearchInWorkspaceLabelProvider = SearchInWorkspaceLabelProvider;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/search-in-workspace/lib/browser/search-in-workspace-label-provider'] = this;


/***/ }),

/***/ "../../packages/search-in-workspace/lib/browser/search-layout-migrations.js":
/*!**********************************************************************************!*\
  !*** ../../packages/search-in-workspace/lib/browser/search-layout-migrations.js ***!
  \**********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2021 SAP SE or an SAP affiliate company and others.
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
exports.SearchLayoutVersion3Migration = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const search_in_workspace_widget_1 = __webpack_require__(/*! ./search-in-workspace-widget */ "../../packages/search-in-workspace/lib/browser/search-in-workspace-widget.js");
const search_in_workspace_factory_1 = __webpack_require__(/*! ./search-in-workspace-factory */ "../../packages/search-in-workspace/lib/browser/search-in-workspace-factory.js");
let SearchLayoutVersion3Migration = class SearchLayoutVersion3Migration {
    constructor() {
        this.layoutVersion = 6.0;
    }
    onWillInflateWidget(desc, { parent }) {
        if (desc.constructionOptions.factoryId === search_in_workspace_widget_1.SearchInWorkspaceWidget.ID && !parent) {
            return {
                constructionOptions: {
                    factoryId: search_in_workspace_factory_1.SEARCH_VIEW_CONTAINER_ID
                },
                innerWidgetState: {
                    parts: [
                        {
                            widget: {
                                constructionOptions: {
                                    factoryId: search_in_workspace_widget_1.SearchInWorkspaceWidget.ID
                                },
                                innerWidgetState: desc.innerWidgetState
                            },
                            partId: {
                                factoryId: search_in_workspace_widget_1.SearchInWorkspaceWidget.ID
                            },
                            collapsed: false,
                            hidden: false
                        }
                    ],
                    title: search_in_workspace_factory_1.SEARCH_VIEW_CONTAINER_TITLE_OPTIONS
                }
            };
        }
        return undefined;
    }
};
SearchLayoutVersion3Migration = __decorate([
    (0, inversify_1.injectable)()
], SearchLayoutVersion3Migration);
exports.SearchLayoutVersion3Migration = SearchLayoutVersion3Migration;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/search-in-workspace/lib/browser/search-layout-migrations'] = this;


/***/ }),

/***/ "../../node_modules/css-loader/dist/cjs.js!../../packages/search-in-workspace/src/browser/styles/index.css":
/*!*****************************************************************************************************************!*\
  !*** ../../node_modules/css-loader/dist/cjs.js!../../packages/search-in-workspace/src/browser/styles/index.css ***!
  \*****************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

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
 * Copyright (C) 2017-2018 Ericsson and others.
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

#search-in-workspace {
  height: 100%;
}

#search-in-workspace .theia-TreeContainer.empty {
  overflow: hidden;
}

.t-siw-search-container {
  padding: 0px 1px;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
}

.t-siw-search-container .theia-ExpansionToggle {
  padding-right: 4px;
  min-width: 6px;
}

.t-siw-search-container .theia-input {
  flex: 1;
  line-height: var(--theia-content-line-height);
  padding: 3px 0 3px 4px;
}

.t-siw-search-container #search-input-field:focus {
  border: none;
  outline: none;
}

.t-siw-search-container #search-input-field {
  background: none;
  border: none;
}

.t-siw-search-container .searchHeader {
  padding: 5px 5px 15px 2px;
}

.t-siw-search-container .searchHeader .controls.button-container {
  height: var(--theia-content-line-height);
  margin-bottom: 5px;
}

.t-siw-search-container .searchHeader .search-field-container {
  background: var(--theia-input-background);
  border-style: solid;
  border-width: var(--theia-border-width);
  border-color: var(--theia-input-background);
  border-radius: 2px;
}

.t-siw-search-container .searchHeader .search-field-container.focused {
  border-color: var(--theia-focusBorder);
}

.t-siw-search-container .searchHeader .search-field {
  display: flex;
  align-items: center;
}

.t-siw-search-container .searchHeader .search-field:focus {
  border: none;
  outline: none;
}

.t-siw-search-container .searchHeader .search-field .option {
  opacity: 0.7;
  cursor: pointer;
}

.t-siw-search-container .searchHeader .search-field .option.enabled {
  color: var(--theia-inputOption-activeForeground);
  border: var(--theia-border-width) var(--theia-inputOption-activeBorder) solid;
  background-color: var(--theia-inputOption-activeBackground);
  opacity: 1;
}

.t-siw-search-container .searchHeader .search-field .option:hover {
  opacity: 1;
}

.t-siw-search-container .searchHeader .search-field .option-buttons {
  height: 23px;
  display: flex;
  align-items: center;
  background-color: none;
}

.t-siw-search-container .searchHeader .search-field-container.tooManyResults {
  border-style: solid;
  border-width: var(--theia-border-width);
  margin: -1px;
  border-color: var(--theia-inputValidation-warningBorder);
}

.t-siw-search-container
  .searchHeader
  .search-field-container
  .search-notification {
  height: 0;
  display: none;
  width: 100%;
  position: relative;
}

.t-siw-search-container
  .searchHeader
  .search-field-container.focused
  .search-notification.show {
  display: block;
}

.t-siw-search-container .searchHeader .search-notification div {
  background-color: var(--theia-inputValidation-warningBackground);
  width: calc(100% + 2px);
  margin-left: -1px;
  color: var(--theia-inputValidation-warningForeground);
  z-index: 1000;
  position: absolute;
  border: 1px solid var(--theia-inputValidation-warningBorder);
  box-sizing: border-box;
  padding: 3px;
}

.t-siw-search-container .searchHeader .button-container {
  text-align: center;
  display: flex;
  justify-content: center;
}

.t-siw-search-container .searchHeader .search-field .option,
.t-siw-search-container .searchHeader .button-container .btn {
  width: 21px;
  height: 21px;
  margin: 0 1px;
  display: inline-block;
  box-sizing: border-box;
  align-items: center;
  user-select: none;
  background-repeat: no-repeat;
  background-position: center;
  border: var(--theia-border-width) solid transparent;
}

.t-siw-search-container .searchHeader .search-field .fa.option {
  display: flex;
  align-items: center;
  justify-content: center;
}

.t-siw-search-container .searchHeader .search-details {
  position: relative;
  padding-top: 5px;
}

.t-siw-search-container .searchHeader .search-details .button-container {
  position: absolute;
  width: 25px;
  top: 0;
  right: 0;
  cursor: pointer;
}

.t-siw-search-container .searchHeader .glob-field-container.hidden {
  display: none;
}

.t-siw-search-container .searchHeader .glob-field-container .glob-field {
  margin-bottom: 8px;
  margin-left: 18px;
  display: flex;
  flex-direction: column;
}

.t-siw-search-container .searchHeader .glob-field-container .glob-field .label {
  margin-bottom: 3px;
  user-select: none;
  font-size: var(--theia-ui-font-size0);
}

.t-siw-search-container
  .searchHeader
  .glob-field-container
  .glob-field
  .theia-input:not(:focus)::placeholder {
  color: transparent;
}

.t-siw-search-container .resultContainer {
  height: 100%;
}

.t-siw-search-container .result {
  overflow: hidden;
  width: 100%;
  flex: 1;
}

.t-siw-search-container .result .result-head {
  display: flex;
}

.t-siw-search-container .result .result-head .fa,
.t-siw-search-container .result .result-head .theia-file-icons-js {
  margin: 0 3px;
}

.t-siw-search-container .result .result-head .file-name {
  margin-right: 5px;
}

.t-siw-search-container .result .result-head .file-path {
  font-size: var(--theia-ui-font-size0);
  margin-left: 3px;
}

.t-siw-search-container .resultLine .match {
  line-height: normal;
  white-space: pre;
  background: var(--theia-editor-findMatchHighlightBackground);
  border: 1px solid var(--theia-editor-findMatchHighlightBorder);
}
.theia-hc .t-siw-search-container .resultLine .match {
  border-style: dashed;
}

.t-siw-search-container .resultLine .match.strike-through {
  text-decoration: line-through;
  background: var(--theia-diffEditor-removedTextBackground);
  border-color: var(--theia-diffEditor-removedTextBorder);
}

.t-siw-search-container .resultLine .replace-term {
  background: var(--theia-diffEditor-insertedTextBackground);
  border: 1px solid var(--theia-diffEditor-insertedTextBorder);
}
.theia-hc .t-siw-search-container .resultLine .replace-term {
  border-style: dashed;
}

.t-siw-search-container .noWrapInfo {
  width: 100%;
}

.t-siw-search-container .result-head-info {
  display: inline-flex;
  align-items: center;
}

.search-in-workspace-editor-match {
  background: var(--theia-editor-findMatchHighlightBackground);
}

.current-search-in-workspace-editor-match {
  background: var(--theia-editor-findMatchBackground);
}

.current-match-range-highlight {
  background: var(--theia-editor-findRangeHighlightBackground);
}

.result-node-buttons {
  display: none;
}

.theia-TreeNode:hover .result-node-buttons {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  align-self: center;
}

.theia-TreeNode:hover .result-head .notification-count-container {
  display: none;
}

.result-node-buttons > span {
  width: 15px;
  height: 15px;
  margin-left: 2.5px;
  margin-right: 0.5px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

.search-and-replace-container {
  display: flex;
}

.replace-toggle {
  display: flex;
  align-items: center;
  width: 16px;
  min-width: 16px;
  justify-content: center;
  margin-right: 2px;
  box-sizing: border-box;
}

.theia-side-panel .replace-toggle {
  width: 16px;
  min-width: 16px;
}

.theia-side-panel .replace-toggle .codicon {
  padding: 0px;
}

.replace-toggle:hover {
  background: rgba(50%, 50%, 50%, 0.2);
}

.search-and-replace-fields {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.replace-field {
  display: flex;
  margin-top: 5px;
}

.replace-field.hidden {
  display: none;
}

.replace-all-button-container {
  width: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.result-node-buttons .replace-result {
  background-image: var(--theia-icon-replace);
}
.result-node-buttons .replace-all-result {
  background-image: var(--theia-icon-replace-all);
}

.replace-all-button-container .action-label.disabled {
  opacity: var(--theia-mod-disabled-opacity);
  background: transparent;
  cursor: default;
}

.highlighted-count-container {
  background-color: var(--theia-list-activeSelectionBackground);
  color: var(--theia-list-activeSelectionForeground);
}

.t-siw-search-container .searchHeader .search-info {
  color: var(--theia-descriptionForeground);
  margin-left: 17px;
}

.theia-siw-lineNumber {
  opacity: 0.7;
  padding-right: 4px;
}
`, "",{"version":3,"sources":["webpack://./../../packages/search-in-workspace/src/browser/styles/index.css"],"names":[],"mappings":"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","sourcesContent":["/********************************************************************************\n * Copyright (C) 2017-2018 Ericsson and others.\n *\n * This program and the accompanying materials are made available under the\n * terms of the Eclipse Public License v. 2.0 which is available at\n * http://www.eclipse.org/legal/epl-2.0.\n *\n * This Source Code may also be made available under the following Secondary\n * Licenses when the conditions for such availability set forth in the Eclipse\n * Public License v. 2.0 are satisfied: GNU General Public License, version 2\n * with the GNU Classpath Exception which is available at\n * https://www.gnu.org/software/classpath/license.html.\n *\n * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0\n ********************************************************************************/\n\n#search-in-workspace {\n  height: 100%;\n}\n\n#search-in-workspace .theia-TreeContainer.empty {\n  overflow: hidden;\n}\n\n.t-siw-search-container {\n  padding: 0px 1px;\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n  box-sizing: border-box;\n}\n\n.t-siw-search-container .theia-ExpansionToggle {\n  padding-right: 4px;\n  min-width: 6px;\n}\n\n.t-siw-search-container .theia-input {\n  flex: 1;\n  line-height: var(--theia-content-line-height);\n  padding: 3px 0 3px 4px;\n}\n\n.t-siw-search-container #search-input-field:focus {\n  border: none;\n  outline: none;\n}\n\n.t-siw-search-container #search-input-field {\n  background: none;\n  border: none;\n}\n\n.t-siw-search-container .searchHeader {\n  padding: 5px 5px 15px 2px;\n}\n\n.t-siw-search-container .searchHeader .controls.button-container {\n  height: var(--theia-content-line-height);\n  margin-bottom: 5px;\n}\n\n.t-siw-search-container .searchHeader .search-field-container {\n  background: var(--theia-input-background);\n  border-style: solid;\n  border-width: var(--theia-border-width);\n  border-color: var(--theia-input-background);\n  border-radius: 2px;\n}\n\n.t-siw-search-container .searchHeader .search-field-container.focused {\n  border-color: var(--theia-focusBorder);\n}\n\n.t-siw-search-container .searchHeader .search-field {\n  display: flex;\n  align-items: center;\n}\n\n.t-siw-search-container .searchHeader .search-field:focus {\n  border: none;\n  outline: none;\n}\n\n.t-siw-search-container .searchHeader .search-field .option {\n  opacity: 0.7;\n  cursor: pointer;\n}\n\n.t-siw-search-container .searchHeader .search-field .option.enabled {\n  color: var(--theia-inputOption-activeForeground);\n  border: var(--theia-border-width) var(--theia-inputOption-activeBorder) solid;\n  background-color: var(--theia-inputOption-activeBackground);\n  opacity: 1;\n}\n\n.t-siw-search-container .searchHeader .search-field .option:hover {\n  opacity: 1;\n}\n\n.t-siw-search-container .searchHeader .search-field .option-buttons {\n  height: 23px;\n  display: flex;\n  align-items: center;\n  background-color: none;\n}\n\n.t-siw-search-container .searchHeader .search-field-container.tooManyResults {\n  border-style: solid;\n  border-width: var(--theia-border-width);\n  margin: -1px;\n  border-color: var(--theia-inputValidation-warningBorder);\n}\n\n.t-siw-search-container\n  .searchHeader\n  .search-field-container\n  .search-notification {\n  height: 0;\n  display: none;\n  width: 100%;\n  position: relative;\n}\n\n.t-siw-search-container\n  .searchHeader\n  .search-field-container.focused\n  .search-notification.show {\n  display: block;\n}\n\n.t-siw-search-container .searchHeader .search-notification div {\n  background-color: var(--theia-inputValidation-warningBackground);\n  width: calc(100% + 2px);\n  margin-left: -1px;\n  color: var(--theia-inputValidation-warningForeground);\n  z-index: 1000;\n  position: absolute;\n  border: 1px solid var(--theia-inputValidation-warningBorder);\n  box-sizing: border-box;\n  padding: 3px;\n}\n\n.t-siw-search-container .searchHeader .button-container {\n  text-align: center;\n  display: flex;\n  justify-content: center;\n}\n\n.t-siw-search-container .searchHeader .search-field .option,\n.t-siw-search-container .searchHeader .button-container .btn {\n  width: 21px;\n  height: 21px;\n  margin: 0 1px;\n  display: inline-block;\n  box-sizing: border-box;\n  align-items: center;\n  user-select: none;\n  background-repeat: no-repeat;\n  background-position: center;\n  border: var(--theia-border-width) solid transparent;\n}\n\n.t-siw-search-container .searchHeader .search-field .fa.option {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.t-siw-search-container .searchHeader .search-details {\n  position: relative;\n  padding-top: 5px;\n}\n\n.t-siw-search-container .searchHeader .search-details .button-container {\n  position: absolute;\n  width: 25px;\n  top: 0;\n  right: 0;\n  cursor: pointer;\n}\n\n.t-siw-search-container .searchHeader .glob-field-container.hidden {\n  display: none;\n}\n\n.t-siw-search-container .searchHeader .glob-field-container .glob-field {\n  margin-bottom: 8px;\n  margin-left: 18px;\n  display: flex;\n  flex-direction: column;\n}\n\n.t-siw-search-container .searchHeader .glob-field-container .glob-field .label {\n  margin-bottom: 3px;\n  user-select: none;\n  font-size: var(--theia-ui-font-size0);\n}\n\n.t-siw-search-container\n  .searchHeader\n  .glob-field-container\n  .glob-field\n  .theia-input:not(:focus)::placeholder {\n  color: transparent;\n}\n\n.t-siw-search-container .resultContainer {\n  height: 100%;\n}\n\n.t-siw-search-container .result {\n  overflow: hidden;\n  width: 100%;\n  flex: 1;\n}\n\n.t-siw-search-container .result .result-head {\n  display: flex;\n}\n\n.t-siw-search-container .result .result-head .fa,\n.t-siw-search-container .result .result-head .theia-file-icons-js {\n  margin: 0 3px;\n}\n\n.t-siw-search-container .result .result-head .file-name {\n  margin-right: 5px;\n}\n\n.t-siw-search-container .result .result-head .file-path {\n  font-size: var(--theia-ui-font-size0);\n  margin-left: 3px;\n}\n\n.t-siw-search-container .resultLine .match {\n  line-height: normal;\n  white-space: pre;\n  background: var(--theia-editor-findMatchHighlightBackground);\n  border: 1px solid var(--theia-editor-findMatchHighlightBorder);\n}\n.theia-hc .t-siw-search-container .resultLine .match {\n  border-style: dashed;\n}\n\n.t-siw-search-container .resultLine .match.strike-through {\n  text-decoration: line-through;\n  background: var(--theia-diffEditor-removedTextBackground);\n  border-color: var(--theia-diffEditor-removedTextBorder);\n}\n\n.t-siw-search-container .resultLine .replace-term {\n  background: var(--theia-diffEditor-insertedTextBackground);\n  border: 1px solid var(--theia-diffEditor-insertedTextBorder);\n}\n.theia-hc .t-siw-search-container .resultLine .replace-term {\n  border-style: dashed;\n}\n\n.t-siw-search-container .noWrapInfo {\n  width: 100%;\n}\n\n.t-siw-search-container .result-head-info {\n  display: inline-flex;\n  align-items: center;\n}\n\n.search-in-workspace-editor-match {\n  background: var(--theia-editor-findMatchHighlightBackground);\n}\n\n.current-search-in-workspace-editor-match {\n  background: var(--theia-editor-findMatchBackground);\n}\n\n.current-match-range-highlight {\n  background: var(--theia-editor-findRangeHighlightBackground);\n}\n\n.result-node-buttons {\n  display: none;\n}\n\n.theia-TreeNode:hover .result-node-buttons {\n  display: flex;\n  justify-content: flex-end;\n  align-items: center;\n  align-self: center;\n}\n\n.theia-TreeNode:hover .result-head .notification-count-container {\n  display: none;\n}\n\n.result-node-buttons > span {\n  width: 15px;\n  height: 15px;\n  margin-left: 2.5px;\n  margin-right: 0.5px;\n  background-repeat: no-repeat;\n  background-position: center;\n  background-size: contain;\n}\n\n.search-and-replace-container {\n  display: flex;\n}\n\n.replace-toggle {\n  display: flex;\n  align-items: center;\n  width: 16px;\n  min-width: 16px;\n  justify-content: center;\n  margin-right: 2px;\n  box-sizing: border-box;\n}\n\n.theia-side-panel .replace-toggle {\n  width: 16px;\n  min-width: 16px;\n}\n\n.theia-side-panel .replace-toggle .codicon {\n  padding: 0px;\n}\n\n.replace-toggle:hover {\n  background: rgba(50%, 50%, 50%, 0.2);\n}\n\n.search-and-replace-fields {\n  display: flex;\n  flex-direction: column;\n  flex: 1;\n}\n\n.replace-field {\n  display: flex;\n  margin-top: 5px;\n}\n\n.replace-field.hidden {\n  display: none;\n}\n\n.replace-all-button-container {\n  width: 25px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.result-node-buttons .replace-result {\n  background-image: var(--theia-icon-replace);\n}\n.result-node-buttons .replace-all-result {\n  background-image: var(--theia-icon-replace-all);\n}\n\n.replace-all-button-container .action-label.disabled {\n  opacity: var(--theia-mod-disabled-opacity);\n  background: transparent;\n  cursor: default;\n}\n\n.highlighted-count-container {\n  background-color: var(--theia-list-activeSelectionBackground);\n  color: var(--theia-list-activeSelectionForeground);\n}\n\n.t-siw-search-container .searchHeader .search-info {\n  color: var(--theia-descriptionForeground);\n  margin-left: 17px;\n}\n\n.theia-siw-lineNumber {\n  opacity: 0.7;\n  padding-right: 4px;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../packages/search-in-workspace/src/browser/styles/index.css":
/*!***********************************************************************!*\
  !*** ../../packages/search-in-workspace/src/browser/styles/index.css ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/css-loader/dist/cjs.js!./index.css */ "../../node_modules/css-loader/dist/cjs.js!../../packages/search-in-workspace/src/browser/styles/index.css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ })

}]);
//# sourceMappingURL=packages_search-in-workspace_lib_browser_search-in-workspace-frontend-module_js.js.map