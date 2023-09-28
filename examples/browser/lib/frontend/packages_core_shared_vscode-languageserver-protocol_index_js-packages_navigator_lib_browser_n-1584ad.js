(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_core_shared_vscode-languageserver-protocol_index_js-packages_navigator_lib_browser_n-1584ad"],{

/***/ "../../packages/core/shared/vscode-languageserver-protocol/index.js":
/*!**************************************************************************!*\
  !*** ../../packages/core/shared/vscode-languageserver-protocol/index.js ***!
  \**************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! vscode-languageserver-protocol */ "../../node_modules/vscode-languageserver-protocol/lib/browser/main.js");

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/shared/vscode-languageserver-protocol'] = this;


/***/ }),

/***/ "../../packages/navigator/lib/browser/navigator-container.js":
/*!*******************************************************************!*\
  !*** ../../packages/navigator/lib/browser/navigator-container.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createFileNavigatorWidget = exports.createFileNavigatorContainer = exports.FILE_NAVIGATOR_PROPS = void 0;
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const browser_2 = __webpack_require__(/*! @theia/filesystem/lib/browser */ "../../packages/filesystem/lib/browser/index.js");
const navigator_tree_1 = __webpack_require__(/*! ./navigator-tree */ "../../packages/navigator/lib/browser/navigator-tree.js");
const navigator_model_1 = __webpack_require__(/*! ./navigator-model */ "../../packages/navigator/lib/browser/navigator-model.js");
const navigator_widget_1 = __webpack_require__(/*! ./navigator-widget */ "../../packages/navigator/lib/browser/navigator-widget.js");
const navigator_contribution_1 = __webpack_require__(/*! ./navigator-contribution */ "../../packages/navigator/lib/browser/navigator-contribution.js");
const navigator_decorator_service_1 = __webpack_require__(/*! ./navigator-decorator-service */ "../../packages/navigator/lib/browser/navigator-decorator-service.js");
exports.FILE_NAVIGATOR_PROPS = {
    ...browser_1.defaultTreeProps,
    contextMenuPath: navigator_contribution_1.NAVIGATOR_CONTEXT_MENU,
    multiSelect: true,
    search: true,
    globalSelection: true
};
function createFileNavigatorContainer(parent) {
    const child = (0, browser_2.createFileTreeContainer)(parent, {
        tree: navigator_tree_1.FileNavigatorTree,
        model: navigator_model_1.FileNavigatorModel,
        widget: navigator_widget_1.FileNavigatorWidget,
        decoratorService: navigator_decorator_service_1.NavigatorDecoratorService,
        props: exports.FILE_NAVIGATOR_PROPS,
    });
    return child;
}
exports.createFileNavigatorContainer = createFileNavigatorContainer;
function createFileNavigatorWidget(parent) {
    return createFileNavigatorContainer(parent).get(navigator_widget_1.FileNavigatorWidget);
}
exports.createFileNavigatorWidget = createFileNavigatorWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/navigator/lib/browser/navigator-container'] = this;


/***/ }),

/***/ "../../packages/navigator/lib/browser/navigator-decorator-service.js":
/*!***************************************************************************!*\
  !*** ../../packages/navigator/lib/browser/navigator-decorator-service.js ***!
  \***************************************************************************/
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NavigatorDecoratorService = exports.NavigatorTreeDecorator = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const contribution_provider_1 = __webpack_require__(/*! @theia/core/lib/common/contribution-provider */ "../../packages/core/lib/common/contribution-provider.js");
const tree_decorator_1 = __webpack_require__(/*! @theia/core/lib/browser/tree/tree-decorator */ "../../packages/core/lib/browser/tree/tree-decorator.js");
/**
 * Symbol for all decorators that would like to contribute into the navigator.
 */
exports.NavigatorTreeDecorator = Symbol('NavigatorTreeDecorator');
/**
 * Decorator service for the navigator.
 */
let NavigatorDecoratorService = class NavigatorDecoratorService extends tree_decorator_1.AbstractTreeDecoratorService {
    constructor(contributions) {
        super(contributions.getContributions());
        this.contributions = contributions;
    }
};
NavigatorDecoratorService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(contribution_provider_1.ContributionProvider)),
    __param(0, (0, inversify_1.named)(exports.NavigatorTreeDecorator)),
    __metadata("design:paramtypes", [Object])
], NavigatorDecoratorService);
exports.NavigatorDecoratorService = NavigatorDecoratorService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/navigator/lib/browser/navigator-decorator-service'] = this;


/***/ }),

/***/ "../../packages/navigator/lib/browser/navigator-frontend-module.js":
/*!*************************************************************************!*\
  !*** ../../packages/navigator/lib/browser/navigator-frontend-module.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
__webpack_require__(/*! ../../src/browser/style/index.css */ "../../packages/navigator/src/browser/style/index.css");
__webpack_require__(/*! ../../src/browser/open-editors-widget/open-editors.css */ "../../packages/navigator/src/browser/open-editors-widget/open-editors.css");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const navigator_widget_1 = __webpack_require__(/*! ./navigator-widget */ "../../packages/navigator/lib/browser/navigator-widget.js");
const navigator_contribution_1 = __webpack_require__(/*! ./navigator-contribution */ "../../packages/navigator/lib/browser/navigator-contribution.js");
const navigator_container_1 = __webpack_require__(/*! ./navigator-container */ "../../packages/navigator/lib/browser/navigator-container.js");
const widget_manager_1 = __webpack_require__(/*! @theia/core/lib/browser/widget-manager */ "../../packages/core/lib/browser/widget-manager.js");
const navigator_preferences_1 = __webpack_require__(/*! ./navigator-preferences */ "../../packages/navigator/lib/browser/navigator-preferences.js");
const navigator_filter_1 = __webpack_require__(/*! ./navigator-filter */ "../../packages/navigator/lib/browser/navigator-filter.js");
const navigator_context_key_service_1 = __webpack_require__(/*! ./navigator-context-key-service */ "../../packages/navigator/lib/browser/navigator-context-key-service.js");
const tab_bar_toolbar_1 = __webpack_require__(/*! @theia/core/lib/browser/shell/tab-bar-toolbar */ "../../packages/core/lib/browser/shell/tab-bar-toolbar/index.js");
const navigator_diff_1 = __webpack_require__(/*! ./navigator-diff */ "../../packages/navigator/lib/browser/navigator-diff.js");
const navigator_layout_migrations_1 = __webpack_require__(/*! ./navigator-layout-migrations */ "../../packages/navigator/lib/browser/navigator-layout-migrations.js");
const navigator_tab_bar_decorator_1 = __webpack_require__(/*! ./navigator-tab-bar-decorator */ "../../packages/navigator/lib/browser/navigator-tab-bar-decorator.js");
const tab_bar_decorator_1 = __webpack_require__(/*! @theia/core/lib/browser/shell/tab-bar-decorator */ "../../packages/core/lib/browser/shell/tab-bar-decorator.js");
const navigator_widget_factory_1 = __webpack_require__(/*! ./navigator-widget-factory */ "../../packages/navigator/lib/browser/navigator-widget-factory.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const navigator_open_editors_decorator_service_1 = __webpack_require__(/*! ./open-editors-widget/navigator-open-editors-decorator-service */ "../../packages/navigator/lib/browser/open-editors-widget/navigator-open-editors-decorator-service.js");
const navigator_open_editors_widget_1 = __webpack_require__(/*! ./open-editors-widget/navigator-open-editors-widget */ "../../packages/navigator/lib/browser/open-editors-widget/navigator-open-editors-widget.js");
const navigator_decorator_service_1 = __webpack_require__(/*! ./navigator-decorator-service */ "../../packages/navigator/lib/browser/navigator-decorator-service.js");
const navigator_deleted_editor_decorator_1 = __webpack_require__(/*! ./open-editors-widget/navigator-deleted-editor-decorator */ "../../packages/navigator/lib/browser/open-editors-widget/navigator-deleted-editor-decorator.js");
const navigator_symlink_decorator_1 = __webpack_require__(/*! ./navigator-symlink-decorator */ "../../packages/navigator/lib/browser/navigator-symlink-decorator.js");
const browser_2 = __webpack_require__(/*! @theia/filesystem/lib/browser */ "../../packages/filesystem/lib/browser/index.js");
exports["default"] = new inversify_1.ContainerModule(bind => {
    (0, navigator_preferences_1.bindFileNavigatorPreferences)(bind);
    bind(navigator_filter_1.FileNavigatorFilter).toSelf().inSingletonScope();
    bind(navigator_context_key_service_1.NavigatorContextKeyService).toSelf().inSingletonScope();
    (0, browser_1.bindViewContribution)(bind, navigator_contribution_1.FileNavigatorContribution);
    bind(browser_1.FrontendApplicationContribution).toService(navigator_contribution_1.FileNavigatorContribution);
    bind(tab_bar_toolbar_1.TabBarToolbarContribution).toService(navigator_contribution_1.FileNavigatorContribution);
    bind(navigator_widget_1.FileNavigatorWidget).toDynamicValue(ctx => (0, navigator_container_1.createFileNavigatorWidget)(ctx.container));
    bind(widget_manager_1.WidgetFactory).toDynamicValue(({ container }) => ({
        id: navigator_widget_1.FILE_NAVIGATOR_ID,
        createWidget: () => container.get(navigator_widget_1.FileNavigatorWidget)
    })).inSingletonScope();
    (0, common_1.bindContributionProvider)(bind, navigator_decorator_service_1.NavigatorTreeDecorator);
    (0, common_1.bindContributionProvider)(bind, navigator_open_editors_decorator_service_1.OpenEditorsTreeDecorator);
    bind(navigator_decorator_service_1.NavigatorTreeDecorator).toService(browser_2.FileTreeDecoratorAdapter);
    bind(navigator_open_editors_decorator_service_1.OpenEditorsTreeDecorator).toService(browser_2.FileTreeDecoratorAdapter);
    bind(navigator_deleted_editor_decorator_1.NavigatorDeletedEditorDecorator).toSelf().inSingletonScope();
    bind(navigator_open_editors_decorator_service_1.OpenEditorsTreeDecorator).toService(navigator_deleted_editor_decorator_1.NavigatorDeletedEditorDecorator);
    bind(widget_manager_1.WidgetFactory).toDynamicValue(({ container }) => ({
        id: navigator_open_editors_widget_1.OpenEditorsWidget.ID,
        createWidget: () => navigator_open_editors_widget_1.OpenEditorsWidget.createWidget(container)
    })).inSingletonScope();
    bind(navigator_widget_factory_1.NavigatorWidgetFactory).toSelf().inSingletonScope();
    bind(widget_manager_1.WidgetFactory).toService(navigator_widget_factory_1.NavigatorWidgetFactory);
    bind(browser_1.ApplicationShellLayoutMigration).to(navigator_layout_migrations_1.NavigatorLayoutVersion3Migration).inSingletonScope();
    bind(browser_1.ApplicationShellLayoutMigration).to(navigator_layout_migrations_1.NavigatorLayoutVersion5Migration).inSingletonScope();
    bind(navigator_diff_1.NavigatorDiff).toSelf().inSingletonScope();
    bind(navigator_tab_bar_decorator_1.NavigatorTabBarDecorator).toSelf().inSingletonScope();
    bind(browser_1.FrontendApplicationContribution).toService(navigator_tab_bar_decorator_1.NavigatorTabBarDecorator);
    bind(tab_bar_decorator_1.TabBarDecorator).toService(navigator_tab_bar_decorator_1.NavigatorTabBarDecorator);
    bind(navigator_symlink_decorator_1.NavigatorSymlinkDecorator).toSelf().inSingletonScope();
    bind(navigator_decorator_service_1.NavigatorTreeDecorator).toService(navigator_symlink_decorator_1.NavigatorSymlinkDecorator);
    bind(navigator_open_editors_decorator_service_1.OpenEditorsTreeDecorator).toService(navigator_symlink_decorator_1.NavigatorSymlinkDecorator);
});

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/navigator/lib/browser/navigator-frontend-module'] = this;


/***/ }),

/***/ "../../packages/navigator/lib/browser/navigator-layout-migrations.js":
/*!***************************************************************************!*\
  !*** ../../packages/navigator/lib/browser/navigator-layout-migrations.js ***!
  \***************************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NavigatorLayoutVersion5Migration = exports.NavigatorLayoutVersion3Migration = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const navigator_widget_factory_1 = __webpack_require__(/*! ./navigator-widget-factory */ "../../packages/navigator/lib/browser/navigator-widget-factory.js");
const navigator_widget_1 = __webpack_require__(/*! ./navigator-widget */ "../../packages/navigator/lib/browser/navigator-widget.js");
let NavigatorLayoutVersion3Migration = class NavigatorLayoutVersion3Migration {
    constructor() {
        this.layoutVersion = 3.0;
    }
    onWillInflateWidget(desc, { parent }) {
        if (desc.constructionOptions.factoryId === navigator_widget_1.FILE_NAVIGATOR_ID && !parent) {
            return {
                constructionOptions: {
                    factoryId: navigator_widget_factory_1.EXPLORER_VIEW_CONTAINER_ID
                },
                innerWidgetState: {
                    parts: [
                        {
                            widget: {
                                constructionOptions: {
                                    factoryId: navigator_widget_1.FILE_NAVIGATOR_ID
                                },
                                innerWidgetState: desc.innerWidgetState
                            },
                            partId: {
                                factoryId: navigator_widget_1.FILE_NAVIGATOR_ID
                            },
                            collapsed: false,
                            hidden: false
                        }
                    ],
                    title: navigator_widget_factory_1.EXPLORER_VIEW_CONTAINER_TITLE_OPTIONS
                }
            };
        }
        return undefined;
    }
};
NavigatorLayoutVersion3Migration = __decorate([
    (0, inversify_1.injectable)()
], NavigatorLayoutVersion3Migration);
exports.NavigatorLayoutVersion3Migration = NavigatorLayoutVersion3Migration;
let NavigatorLayoutVersion5Migration = class NavigatorLayoutVersion5Migration {
    constructor() {
        this.layoutVersion = 5.0;
    }
    onWillInflateWidget(desc) {
        if (desc.constructionOptions.factoryId === navigator_widget_factory_1.EXPLORER_VIEW_CONTAINER_ID && typeof desc.innerWidgetState === 'string') {
            desc.innerWidgetState = desc.innerWidgetState.replace(/navigator-tab-icon/g, navigator_widget_factory_1.EXPLORER_VIEW_CONTAINER_TITLE_OPTIONS.iconClass);
            return desc;
        }
        return undefined;
    }
};
NavigatorLayoutVersion5Migration = __decorate([
    (0, inversify_1.injectable)()
], NavigatorLayoutVersion5Migration);
exports.NavigatorLayoutVersion5Migration = NavigatorLayoutVersion5Migration;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/navigator/lib/browser/navigator-layout-migrations'] = this;


/***/ }),

/***/ "../../packages/navigator/lib/browser/navigator-symlink-decorator.js":
/*!***************************************************************************!*\
  !*** ../../packages/navigator/lib/browser/navigator-symlink-decorator.js ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2021 Ericsson and others.
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
exports.NavigatorSymlinkDecorator = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const browser_2 = __webpack_require__(/*! @theia/filesystem/lib/browser */ "../../packages/filesystem/lib/browser/index.js");
const decorations_service_1 = __webpack_require__(/*! @theia/core/lib/browser/decorations-service */ "../../packages/core/lib/browser/decorations-service.js");
let NavigatorSymlinkDecorator = class NavigatorSymlinkDecorator {
    constructor() {
        this.id = 'theia-navigator-symlink-decorator';
        this.onDidChangeDecorationsEmitter = new core_1.Emitter();
    }
    init() {
        this.decorationsService.onDidChangeDecorations(() => {
            this.fireDidChangeDecorations((tree) => this.collectDecorator(tree));
        });
    }
    async decorations(tree) {
        return this.collectDecorator(tree);
    }
    collectDecorator(tree) {
        const result = new Map();
        if (tree.root === undefined) {
            return result;
        }
        for (const node of new browser_1.DepthFirstTreeIterator(tree.root)) {
            if (browser_2.FileStatNode.is(node) && node.fileStat.isSymbolicLink) {
                const decorations = {
                    tailDecorations: [{ data: '⤷', tooltip: core_1.nls.localizeByDefault('Symbolic Link') }]
                };
                result.set(node.id, decorations);
            }
        }
        return result;
    }
    get onDidChangeDecorations() {
        return this.onDidChangeDecorationsEmitter.event;
    }
    fireDidChangeDecorations(event) {
        this.onDidChangeDecorationsEmitter.fire(event);
    }
};
__decorate([
    (0, inversify_1.inject)(decorations_service_1.DecorationsService),
    __metadata("design:type", Object)
], NavigatorSymlinkDecorator.prototype, "decorationsService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NavigatorSymlinkDecorator.prototype, "init", null);
NavigatorSymlinkDecorator = __decorate([
    (0, inversify_1.injectable)()
], NavigatorSymlinkDecorator);
exports.NavigatorSymlinkDecorator = NavigatorSymlinkDecorator;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/navigator/lib/browser/navigator-symlink-decorator'] = this;


/***/ }),

/***/ "../../packages/navigator/lib/browser/navigator-tab-bar-decorator.js":
/*!***************************************************************************!*\
  !*** ../../packages/navigator/lib/browser/navigator-tab-bar-decorator.js ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2020 Ericsson and others.
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
exports.NavigatorTabBarDecorator = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const event_1 = __webpack_require__(/*! @theia/core/lib/common/event */ "../../packages/core/lib/common/event.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
const navigator_open_editors_widget_1 = __webpack_require__(/*! ./open-editors-widget/navigator-open-editors-widget */ "../../packages/navigator/lib/browser/open-editors-widget/navigator-open-editors-widget.js");
let NavigatorTabBarDecorator = class NavigatorTabBarDecorator {
    constructor() {
        this.id = 'theia-navigator-tabbar-decorator';
        this.emitter = new event_1.Emitter();
        this.toDispose = new disposable_1.DisposableCollection();
        this.toDisposeOnDirtyChanged = new Map();
    }
    onStart(app) {
        this.applicationShell = app.shell;
        if (!!this.getDirtyEditorsCount()) {
            this.fireDidChangeDecorations();
        }
        this.toDispose.pushAll([
            this.applicationShell.onDidAddWidget(widget => {
                const saveable = browser_1.Saveable.get(widget);
                if (saveable) {
                    this.toDisposeOnDirtyChanged.set(widget.id, saveable.onDirtyChanged(() => this.fireDidChangeDecorations()));
                }
            }),
            this.applicationShell.onDidRemoveWidget(widget => { var _a; return (_a = this.toDisposeOnDirtyChanged.get(widget.id)) === null || _a === void 0 ? void 0 : _a.dispose(); })
        ]);
    }
    decorate(title) {
        const { owner } = title;
        if (owner instanceof browser_1.ViewContainer && owner.getParts().find(part => part.wrapped instanceof navigator_open_editors_widget_1.OpenEditorsWidget)) {
            const changes = this.getDirtyEditorsCount();
            return changes > 0 ? [{ badge: changes }] : [];
        }
        else {
            return [];
        }
    }
    getDirtyEditorsCount() {
        return this.applicationShell.widgets.filter(widget => browser_1.Saveable.isDirty(widget)).length;
    }
    get onDidChangeDecorations() {
        return this.emitter.event;
    }
    fireDidChangeDecorations() {
        this.emitter.fire(undefined);
    }
};
NavigatorTabBarDecorator = __decorate([
    (0, inversify_1.injectable)()
], NavigatorTabBarDecorator);
exports.NavigatorTabBarDecorator = NavigatorTabBarDecorator;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/navigator/lib/browser/navigator-tab-bar-decorator'] = this;


/***/ }),

/***/ "../../packages/navigator/lib/browser/open-editors-widget/navigator-deleted-editor-decorator.js":
/*!******************************************************************************************************!*\
  !*** ../../packages/navigator/lib/browser/open-editors-widget/navigator-deleted-editor-decorator.js ***!
  \******************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2021 Ericsson and others.
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
exports.NavigatorDeletedEditorDecorator = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const filesystem_frontend_contribution_1 = __webpack_require__(/*! @theia/filesystem/lib/browser/filesystem-frontend-contribution */ "../../packages/filesystem/lib/browser/filesystem-frontend-contribution.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const browser_2 = __webpack_require__(/*! @theia/filesystem/lib/browser */ "../../packages/filesystem/lib/browser/index.js");
let NavigatorDeletedEditorDecorator = class NavigatorDeletedEditorDecorator {
    constructor() {
        this.id = 'theia-deleted-editor-decorator';
        this.onDidChangeDecorationsEmitter = new core_1.Emitter();
        this.onDidChangeDecorations = this.onDidChangeDecorationsEmitter.event;
        this.deletedURIs = new Set();
    }
    init() {
        this.fileSystemContribution.onDidChangeEditorFile(({ editor, type }) => {
            var _a;
            const uri = (_a = editor.getResourceUri()) === null || _a === void 0 ? void 0 : _a.toString();
            if (uri) {
                if (type === 2 /* DELETED */) {
                    this.deletedURIs.add(uri);
                }
                else if (type === 1 /* ADDED */) {
                    this.deletedURIs.delete(uri);
                }
                this.fireDidChangeDecorations((tree) => this.collectDecorators(tree));
            }
        });
        this.shell.onDidAddWidget(() => {
            const newDeletedURIs = new Set();
            this.shell.widgets.forEach(widget => {
                var _a;
                if (browser_1.NavigatableWidget.is(widget)) {
                    const uri = (_a = widget.getResourceUri()) === null || _a === void 0 ? void 0 : _a.toString();
                    if (uri && this.deletedURIs.has(uri)) {
                        newDeletedURIs.add(uri);
                    }
                }
            });
            this.deletedURIs = newDeletedURIs;
        });
    }
    decorations(tree) {
        return this.collectDecorators(tree);
    }
    collectDecorators(tree) {
        const result = new Map();
        if (tree.root === undefined) {
            return result;
        }
        for (const node of new browser_1.DepthFirstTreeIterator(tree.root)) {
            if (browser_2.FileStatNode.is(node)) {
                const uri = node.uri.toString();
                if (this.deletedURIs.has(uri)) {
                    const deletedDecoration = {
                        fontData: {
                            style: 'line-through',
                        }
                    };
                    result.set(node.id, deletedDecoration);
                }
            }
        }
        return result;
    }
    fireDidChangeDecorations(event) {
        this.onDidChangeDecorationsEmitter.fire(event);
    }
};
__decorate([
    (0, inversify_1.inject)(filesystem_frontend_contribution_1.FileSystemFrontendContribution),
    __metadata("design:type", filesystem_frontend_contribution_1.FileSystemFrontendContribution)
], NavigatorDeletedEditorDecorator.prototype, "fileSystemContribution", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.ApplicationShell),
    __metadata("design:type", browser_1.ApplicationShell)
], NavigatorDeletedEditorDecorator.prototype, "shell", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NavigatorDeletedEditorDecorator.prototype, "init", null);
NavigatorDeletedEditorDecorator = __decorate([
    (0, inversify_1.injectable)()
], NavigatorDeletedEditorDecorator);
exports.NavigatorDeletedEditorDecorator = NavigatorDeletedEditorDecorator;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/navigator/lib/browser/open-editors-widget/navigator-deleted-editor-decorator'] = this;


/***/ }),

/***/ "../../packages/variable-resolver/lib/browser/index.js":
/*!*************************************************************!*\
  !*** ../../packages/variable-resolver/lib/browser/index.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./variable */ "../../packages/variable-resolver/lib/browser/variable.js"), exports);
__exportStar(__webpack_require__(/*! ./variable-quick-open-service */ "../../packages/variable-resolver/lib/browser/variable-quick-open-service.js"), exports);
__exportStar(__webpack_require__(/*! ./variable-resolver-service */ "../../packages/variable-resolver/lib/browser/variable-resolver-service.js"), exports);

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/variable-resolver/lib/browser'] = this;


/***/ }),

/***/ "../../node_modules/css-loader/dist/cjs.js!../../packages/navigator/src/browser/open-editors-widget/open-editors.css":
/*!***************************************************************************************************************************!*\
  !*** ../../node_modules/css-loader/dist/cjs.js!../../packages/navigator/src/browser/open-editors-widget/open-editors.css ***!
  \***************************************************************************************************************************/
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
 * Copyright (C) 2021 Ericsson and others.
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

:root {
  --theia-open-editors-icon-width: 20px;
}

.theia-open-editors-widget .theia-caption-suffix {
  margin-left: var(--theia-ui-padding);
  font-size: var(--theia-ui-font-size0);
}

.theia-open-editors-widget
  .open-editors-node-row
  .open-editors-prefix-icon-container {
  min-width: var(--theia-open-editors-icon-width);
}

.theia-open-editors-widget
  .open-editors-node-row
  .open-editors-prefix-icon.dirty,
.theia-open-editors-widget
  .open-editors-node-row.dirty:hover
  .open-editors-prefix-icon.dirty {
  display: none;
}

.theia-open-editors-widget
  .open-editors-node-row.dirty
  .open-editors-prefix-icon.dirty {
  display: block;
}

.theia-open-editors-widget
  .open-editors-node-row
  .open-editors-prefix-icon.close {
  display: none;
}

.theia-open-editors-widget
  .open-editors-node-row:not(.dirty)
  .theia-mod-selected
  .open-editors-prefix-icon.close,
.theia-open-editors-widget
  .open-editors-node-row:hover
  .open-editors-prefix-icon.close {
  display: block;
}

.theia-open-editors-widget .open-editors-node-row.group-node,
.theia-open-editors-widget .open-editors-node-row.area-node {
  font-weight: 700;
  text-transform: uppercase;
  font-size: var(--theia-ui-font-size0);
}

.theia-open-editors-widget .open-editors-node-row.area-node {
  font-style: italic;
}

.theia-open-editors-widget .open-editors-inline-actions-container {
  display: flex;
  justify-content: flex-end;
  margin-left: 3px;
  min-height: 16px;
}

.theia-open-editors-widget .open-editors-inline-action a {
  color: var(--theia-icon-foreground);
}

.theia-open-editors-widget .open-editors-inline-action {
  padding: 0px 3px;
  font-size: var(--theia-ui-font-size1);
  margin: 0 2px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.theia-open-editors-widget
  .open-editors-node-row
  .open-editors-inline-actions-container {
  visibility: hidden;
}

.theia-open-editors-widget
  .open-editors-node-row:hover
  .open-editors-inline-actions-container {
  visibility: visible;
}
`, "",{"version":3,"sources":["webpack://./../../packages/navigator/src/browser/open-editors-widget/open-editors.css"],"names":[],"mappings":"AAAA;;;;;;;;;;;;;;iFAciF;;AAEjF;EACE,qCAAqC;AACvC;;AAEA;EACE,oCAAoC;EACpC,qCAAqC;AACvC;;AAEA;;;EAGE,+CAA+C;AACjD;;AAEA;;;;;;EAME,aAAa;AACf;;AAEA;;;EAGE,cAAc;AAChB;;AAEA;;;EAGE,aAAa;AACf;;AAEA;;;;;;;EAOE,cAAc;AAChB;;AAEA;;EAEE,gBAAgB;EAChB,yBAAyB;EACzB,qCAAqC;AACvC;;AAEA;EACE,kBAAkB;AACpB;;AAEA;EACE,aAAa;EACb,yBAAyB;EACzB,gBAAgB;EAChB,gBAAgB;AAClB;;AAEA;EACE,mCAAmC;AACrC;;AAEA;EACE,gBAAgB;EAChB,qCAAqC;EACrC,aAAa;EACb,eAAe;EACf,aAAa;EACb,mBAAmB;AACrB;;AAEA;;;EAGE,kBAAkB;AACpB;;AAEA;;;EAGE,mBAAmB;AACrB","sourcesContent":["/********************************************************************************\n * Copyright (C) 2021 Ericsson and others.\n *\n * This program and the accompanying materials are made available under the\n * terms of the Eclipse Public License v. 2.0 which is available at\n * http://www.eclipse.org/legal/epl-2.0.\n *\n * This Source Code may also be made available under the following Secondary\n * Licenses when the conditions for such availability set forth in the Eclipse\n * Public License v. 2.0 are satisfied: GNU General Public License, version 2\n * with the GNU Classpath Exception which is available at\n * https://www.gnu.org/software/classpath/license.html.\n *\n * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0\n ********************************************************************************/\n\n:root {\n  --theia-open-editors-icon-width: 20px;\n}\n\n.theia-open-editors-widget .theia-caption-suffix {\n  margin-left: var(--theia-ui-padding);\n  font-size: var(--theia-ui-font-size0);\n}\n\n.theia-open-editors-widget\n  .open-editors-node-row\n  .open-editors-prefix-icon-container {\n  min-width: var(--theia-open-editors-icon-width);\n}\n\n.theia-open-editors-widget\n  .open-editors-node-row\n  .open-editors-prefix-icon.dirty,\n.theia-open-editors-widget\n  .open-editors-node-row.dirty:hover\n  .open-editors-prefix-icon.dirty {\n  display: none;\n}\n\n.theia-open-editors-widget\n  .open-editors-node-row.dirty\n  .open-editors-prefix-icon.dirty {\n  display: block;\n}\n\n.theia-open-editors-widget\n  .open-editors-node-row\n  .open-editors-prefix-icon.close {\n  display: none;\n}\n\n.theia-open-editors-widget\n  .open-editors-node-row:not(.dirty)\n  .theia-mod-selected\n  .open-editors-prefix-icon.close,\n.theia-open-editors-widget\n  .open-editors-node-row:hover\n  .open-editors-prefix-icon.close {\n  display: block;\n}\n\n.theia-open-editors-widget .open-editors-node-row.group-node,\n.theia-open-editors-widget .open-editors-node-row.area-node {\n  font-weight: 700;\n  text-transform: uppercase;\n  font-size: var(--theia-ui-font-size0);\n}\n\n.theia-open-editors-widget .open-editors-node-row.area-node {\n  font-style: italic;\n}\n\n.theia-open-editors-widget .open-editors-inline-actions-container {\n  display: flex;\n  justify-content: flex-end;\n  margin-left: 3px;\n  min-height: 16px;\n}\n\n.theia-open-editors-widget .open-editors-inline-action a {\n  color: var(--theia-icon-foreground);\n}\n\n.theia-open-editors-widget .open-editors-inline-action {\n  padding: 0px 3px;\n  font-size: var(--theia-ui-font-size1);\n  margin: 0 2px;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n}\n\n.theia-open-editors-widget\n  .open-editors-node-row\n  .open-editors-inline-actions-container {\n  visibility: hidden;\n}\n\n.theia-open-editors-widget\n  .open-editors-node-row:hover\n  .open-editors-inline-actions-container {\n  visibility: visible;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../node_modules/css-loader/dist/cjs.js!../../packages/navigator/src/browser/style/index.css":
/*!******************************************************************************************************!*\
  !*** ../../node_modules/css-loader/dist/cjs.js!../../packages/navigator/src/browser/style/index.css ***!
  \******************************************************************************************************/
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
 * Copyright (C) 2017 TypeFox and others.
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

.theia-Files {
  height: 100%;
}

.theia-navigator-container {
  font-size: var(--theia-ui-font-size1);
  padding: 5px;
  position: relative;
}

.theia-navigator-container .open-workspace-button-container {
  margin: auto;
  margin-top: 5px;
  display: flex;
  justify-content: center;
  align-self: center;
}

.theia-navigator-container .center {
  text-align: center;
}

.p-Widget .open-workspace-button {
  padding: 4px 12px;
  width: calc(100% - var(--theia-ui-padding) * 4);
  margin-left: 0;
}
`, "",{"version":3,"sources":["webpack://./../../packages/navigator/src/browser/style/index.css"],"names":[],"mappings":"AAAA;;;;;;;;;;;;;;iFAciF;;AAEjF;EACE,YAAY;AACd;;AAEA;EACE,qCAAqC;EACrC,YAAY;EACZ,kBAAkB;AACpB;;AAEA;EACE,YAAY;EACZ,eAAe;EACf,aAAa;EACb,uBAAuB;EACvB,kBAAkB;AACpB;;AAEA;EACE,kBAAkB;AACpB;;AAEA;EACE,iBAAiB;EACjB,+CAA+C;EAC/C,cAAc;AAChB","sourcesContent":["/********************************************************************************\n * Copyright (C) 2017 TypeFox and others.\n *\n * This program and the accompanying materials are made available under the\n * terms of the Eclipse Public License v. 2.0 which is available at\n * http://www.eclipse.org/legal/epl-2.0.\n *\n * This Source Code may also be made available under the following Secondary\n * Licenses when the conditions for such availability set forth in the Eclipse\n * Public License v. 2.0 are satisfied: GNU General Public License, version 2\n * with the GNU Classpath Exception which is available at\n * https://www.gnu.org/software/classpath/license.html.\n *\n * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0\n ********************************************************************************/\n\n.theia-Files {\n  height: 100%;\n}\n\n.theia-navigator-container {\n  font-size: var(--theia-ui-font-size1);\n  padding: 5px;\n  position: relative;\n}\n\n.theia-navigator-container .open-workspace-button-container {\n  margin: auto;\n  margin-top: 5px;\n  display: flex;\n  justify-content: center;\n  align-self: center;\n}\n\n.theia-navigator-container .center {\n  text-align: center;\n}\n\n.p-Widget .open-workspace-button {\n  padding: 4px 12px;\n  width: calc(100% - var(--theia-ui-padding) * 4);\n  margin-left: 0;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../packages/navigator/src/browser/open-editors-widget/open-editors.css":
/*!*********************************************************************************!*\
  !*** ../../packages/navigator/src/browser/open-editors-widget/open-editors.css ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_open_editors_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/css-loader/dist/cjs.js!./open-editors.css */ "../../node_modules/css-loader/dist/cjs.js!../../packages/navigator/src/browser/open-editors-widget/open-editors.css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_open_editors_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_open_editors_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "../../packages/navigator/src/browser/style/index.css":
/*!************************************************************!*\
  !*** ../../packages/navigator/src/browser/style/index.css ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/css-loader/dist/cjs.js!./index.css */ "../../node_modules/css-loader/dist/cjs.js!../../packages/navigator/src/browser/style/index.css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ })

}]);
//# sourceMappingURL=packages_core_shared_vscode-languageserver-protocol_index_js-packages_navigator_lib_browser_n-1584ad.js.map