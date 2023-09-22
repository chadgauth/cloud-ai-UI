(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_core_shared_phosphor_coreutils_index_js-packages_scm_lib_browser_scm-frontend-module_js"],{

/***/ "../../packages/core/shared/@phosphor/coreutils/index.js":
/*!***************************************************************!*\
  !*** ../../packages/core/shared/@phosphor/coreutils/index.js ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! @phosphor/coreutils */ "../../node_modules/@phosphor/coreutils/lib/index.js");

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/shared/@phosphor/coreutils'] = this;


/***/ }),

/***/ "../../packages/scm/lib/browser/decorations/scm-tab-bar-decorator.js":
/*!***************************************************************************!*\
  !*** ../../packages/scm/lib/browser/decorations/scm-tab-bar-decorator.js ***!
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ScmTabBarDecorator = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const event_1 = __webpack_require__(/*! @theia/core/lib/common/event */ "../../packages/core/lib/common/event.js");
const scm_service_1 = __webpack_require__(/*! ../scm-service */ "../../packages/scm/lib/browser/scm-service.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
const scm_widget_1 = __webpack_require__(/*! ../scm-widget */ "../../packages/scm/lib/browser/scm-widget.js");
let ScmTabBarDecorator = class ScmTabBarDecorator {
    constructor() {
        this.id = 'theia-scm-tabbar-decorator';
        this.emitter = new event_1.Emitter();
        this.toDispose = new disposable_1.DisposableCollection();
        this.toDisposeOnDidChange = new disposable_1.DisposableCollection();
    }
    init() {
        this.toDispose.push(this.scmService.onDidChangeSelectedRepository(repository => {
            this.toDisposeOnDidChange.dispose();
            if (repository) {
                this.toDisposeOnDidChange.push(repository.provider.onDidChange(() => this.fireDidChangeDecorations()));
            }
            this.fireDidChangeDecorations();
        }));
    }
    decorate(title) {
        const { owner } = title;
        if (owner instanceof browser_1.ViewContainer && owner.getParts().find(part => part.wrapped instanceof scm_widget_1.ScmWidget)) {
            const changes = this.collectChangesCount();
            return changes > 0 ? [{ badge: changes }] : [];
        }
        else {
            return [];
        }
    }
    collectChangesCount() {
        const repository = this.scmService.selectedRepository;
        let changes = 0;
        if (!repository) {
            return 0;
        }
        repository.provider.groups.map(group => {
            if (group.id === 'index' || group.id === 'workingTree') {
                changes += group.resources.length;
            }
        });
        return changes;
    }
    get onDidChangeDecorations() {
        return this.emitter.event;
    }
    fireDidChangeDecorations() {
        this.emitter.fire(undefined);
    }
};
__decorate([
    (0, inversify_1.inject)(scm_service_1.ScmService),
    __metadata("design:type", scm_service_1.ScmService)
], ScmTabBarDecorator.prototype, "scmService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ScmTabBarDecorator.prototype, "init", null);
ScmTabBarDecorator = __decorate([
    (0, inversify_1.injectable)()
], ScmTabBarDecorator);
exports.ScmTabBarDecorator = ScmTabBarDecorator;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/scm/lib/browser/decorations/scm-tab-bar-decorator'] = this;


/***/ }),

/***/ "../../packages/scm/lib/browser/dirty-diff/dirty-diff-module.js":
/*!**********************************************************************!*\
  !*** ../../packages/scm/lib/browser/dirty-diff/dirty-diff-module.js ***!
  \**********************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.bindDirtyDiff = void 0;
const dirty_diff_decorator_1 = __webpack_require__(/*! ./dirty-diff-decorator */ "../../packages/scm/lib/browser/dirty-diff/dirty-diff-decorator.js");
__webpack_require__(/*! ../../../src/browser/style/dirty-diff.css */ "../../packages/scm/src/browser/style/dirty-diff.css");
function bindDirtyDiff(bind) {
    bind(dirty_diff_decorator_1.DirtyDiffDecorator).toSelf().inSingletonScope();
}
exports.bindDirtyDiff = bindDirtyDiff;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/scm/lib/browser/dirty-diff/dirty-diff-module'] = this;


/***/ }),

/***/ "../../packages/scm/lib/browser/scm-frontend-module.js":
/*!*************************************************************!*\
  !*** ../../packages/scm/lib/browser/scm-frontend-module.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2019 Red Hat, Inc. and others.
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
exports.createScmWidgetContainer = exports.createScmTreeContainer = void 0;
__webpack_require__(/*! ../../src/browser/style/index.css */ "../../packages/scm/src/browser/style/index.css");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const scm_service_1 = __webpack_require__(/*! ./scm-service */ "../../packages/scm/lib/browser/scm-service.js");
const scm_contribution_1 = __webpack_require__(/*! ./scm-contribution */ "../../packages/scm/lib/browser/scm-contribution.js");
const scm_widget_1 = __webpack_require__(/*! ./scm-widget */ "../../packages/scm/lib/browser/scm-widget.js");
const scm_tree_widget_1 = __webpack_require__(/*! ./scm-tree-widget */ "../../packages/scm/lib/browser/scm-tree-widget.js");
const scm_commit_widget_1 = __webpack_require__(/*! ./scm-commit-widget */ "../../packages/scm/lib/browser/scm-commit-widget.js");
const scm_amend_widget_1 = __webpack_require__(/*! ./scm-amend-widget */ "../../packages/scm/lib/browser/scm-amend-widget.js");
const scm_no_repository_widget_1 = __webpack_require__(/*! ./scm-no-repository-widget */ "../../packages/scm/lib/browser/scm-no-repository-widget.js");
const scm_tree_model_1 = __webpack_require__(/*! ./scm-tree-model */ "../../packages/scm/lib/browser/scm-tree-model.js");
const scm_groups_tree_model_1 = __webpack_require__(/*! ./scm-groups-tree-model */ "../../packages/scm/lib/browser/scm-groups-tree-model.js");
const scm_quick_open_service_1 = __webpack_require__(/*! ./scm-quick-open-service */ "../../packages/scm/lib/browser/scm-quick-open-service.js");
const dirty_diff_module_1 = __webpack_require__(/*! ./dirty-diff/dirty-diff-module */ "../../packages/scm/lib/browser/dirty-diff/dirty-diff-module.js");
const scm_decorations_service_1 = __webpack_require__(/*! ./decorations/scm-decorations-service */ "../../packages/scm/lib/browser/decorations/scm-decorations-service.js");
const scm_avatar_service_1 = __webpack_require__(/*! ./scm-avatar-service */ "../../packages/scm/lib/browser/scm-avatar-service.js");
const scm_context_key_service_1 = __webpack_require__(/*! ./scm-context-key-service */ "../../packages/scm/lib/browser/scm-context-key-service.js");
const scm_layout_migrations_1 = __webpack_require__(/*! ./scm-layout-migrations */ "../../packages/scm/lib/browser/scm-layout-migrations.js");
const scm_tree_label_provider_1 = __webpack_require__(/*! ./scm-tree-label-provider */ "../../packages/scm/lib/browser/scm-tree-label-provider.js");
const tab_bar_toolbar_1 = __webpack_require__(/*! @theia/core/lib/browser/shell/tab-bar-toolbar */ "../../packages/core/lib/browser/shell/tab-bar-toolbar/index.js");
const color_application_contribution_1 = __webpack_require__(/*! @theia/core/lib/browser/color-application-contribution */ "../../packages/core/lib/browser/color-application-contribution.js");
const label_provider_1 = __webpack_require__(/*! @theia/core/lib/browser/label-provider */ "../../packages/core/lib/browser/label-provider.js");
const scm_preferences_1 = __webpack_require__(/*! ./scm-preferences */ "../../packages/scm/lib/browser/scm-preferences.js");
const scm_tab_bar_decorator_1 = __webpack_require__(/*! ./decorations/scm-tab-bar-decorator */ "../../packages/scm/lib/browser/decorations/scm-tab-bar-decorator.js");
const tab_bar_decorator_1 = __webpack_require__(/*! @theia/core/lib/browser/shell/tab-bar-decorator */ "../../packages/core/lib/browser/shell/tab-bar-decorator.js");
exports["default"] = new inversify_1.ContainerModule(bind => {
    bind(scm_context_key_service_1.ScmContextKeyService).toSelf().inSingletonScope();
    bind(scm_service_1.ScmService).toSelf().inSingletonScope();
    bind(scm_widget_1.ScmWidget).toSelf();
    bind(browser_1.WidgetFactory).toDynamicValue(({ container }) => ({
        id: scm_contribution_1.SCM_WIDGET_FACTORY_ID,
        createWidget: () => {
            const child = createScmWidgetContainer(container);
            return child.get(scm_widget_1.ScmWidget);
        }
    })).inSingletonScope();
    bind(scm_commit_widget_1.ScmCommitWidget).toSelf();
    bind(browser_1.WidgetFactory).toDynamicValue(({ container }) => ({
        id: scm_commit_widget_1.ScmCommitWidget.ID,
        createWidget: () => container.get(scm_commit_widget_1.ScmCommitWidget)
    })).inSingletonScope();
    bind(browser_1.WidgetFactory).toDynamicValue(({ container }) => ({
        id: scm_tree_widget_1.ScmTreeWidget.ID,
        createWidget: () => container.get(scm_tree_widget_1.ScmTreeWidget)
    })).inSingletonScope();
    bind(scm_amend_widget_1.ScmAmendWidget).toSelf();
    bind(browser_1.WidgetFactory).toDynamicValue(({ container }) => ({
        id: scm_amend_widget_1.ScmAmendWidget.ID,
        createWidget: () => container.get(scm_amend_widget_1.ScmAmendWidget)
    })).inSingletonScope();
    bind(scm_no_repository_widget_1.ScmNoRepositoryWidget).toSelf();
    bind(browser_1.WidgetFactory).toDynamicValue(({ container }) => ({
        id: scm_no_repository_widget_1.ScmNoRepositoryWidget.ID,
        createWidget: () => container.get(scm_no_repository_widget_1.ScmNoRepositoryWidget)
    })).inSingletonScope();
    bind(browser_1.WidgetFactory).toDynamicValue(({ container }) => ({
        id: scm_contribution_1.SCM_VIEW_CONTAINER_ID,
        createWidget: async () => {
            const viewContainer = container.get(browser_1.ViewContainer.Factory)({
                id: scm_contribution_1.SCM_VIEW_CONTAINER_ID,
                progressLocationId: 'scm'
            });
            viewContainer.setTitleOptions(scm_contribution_1.SCM_VIEW_CONTAINER_TITLE_OPTIONS);
            const widget = await container.get(browser_1.WidgetManager).getOrCreateWidget(scm_contribution_1.SCM_WIDGET_FACTORY_ID);
            viewContainer.addWidget(widget, {
                canHide: false,
                initiallyCollapsed: false
            });
            return viewContainer;
        }
    })).inSingletonScope();
    bind(browser_1.ApplicationShellLayoutMigration).to(scm_layout_migrations_1.ScmLayoutVersion3Migration).inSingletonScope();
    bind(browser_1.ApplicationShellLayoutMigration).to(scm_layout_migrations_1.ScmLayoutVersion5Migration).inSingletonScope();
    bind(scm_quick_open_service_1.ScmQuickOpenService).toSelf().inSingletonScope();
    (0, browser_1.bindViewContribution)(bind, scm_contribution_1.ScmContribution);
    bind(browser_1.FrontendApplicationContribution).toService(scm_contribution_1.ScmContribution);
    bind(tab_bar_toolbar_1.TabBarToolbarContribution).toService(scm_contribution_1.ScmContribution);
    bind(color_application_contribution_1.ColorContribution).toService(scm_contribution_1.ScmContribution);
    bind(browser_1.StylingParticipant).toService(scm_contribution_1.ScmContribution);
    bind(scm_decorations_service_1.ScmDecorationsService).toSelf().inSingletonScope();
    bind(scm_avatar_service_1.ScmAvatarService).toSelf().inSingletonScope();
    (0, dirty_diff_module_1.bindDirtyDiff)(bind);
    bind(scm_tree_label_provider_1.ScmTreeLabelProvider).toSelf().inSingletonScope();
    bind(label_provider_1.LabelProviderContribution).toService(scm_tree_label_provider_1.ScmTreeLabelProvider);
    (0, scm_preferences_1.bindScmPreferences)(bind);
    bind(scm_tab_bar_decorator_1.ScmTabBarDecorator).toSelf().inSingletonScope();
    bind(tab_bar_decorator_1.TabBarDecorator).toService(scm_tab_bar_decorator_1.ScmTabBarDecorator);
});
function createScmTreeContainer(parent) {
    const child = (0, browser_1.createTreeContainer)(parent, {
        props: {
            virtualized: true,
            search: true,
            multiSelect: true,
        },
        widget: scm_tree_widget_1.ScmTreeWidget,
    });
    child.unbind(browser_1.TreeModel);
    child.unbind(browser_1.TreeModelImpl);
    child.bind(scm_tree_model_1.ScmTreeModelProps).toConstantValue({
        defaultExpansion: 'expanded',
    });
    return child;
}
exports.createScmTreeContainer = createScmTreeContainer;
function createScmWidgetContainer(parent) {
    const child = createScmTreeContainer(parent);
    child.bind(scm_groups_tree_model_1.ScmGroupsTreeModel).toSelf();
    child.bind(browser_1.TreeModel).toService(scm_groups_tree_model_1.ScmGroupsTreeModel);
    return child;
}
exports.createScmWidgetContainer = createScmWidgetContainer;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/scm/lib/browser/scm-frontend-module'] = this;


/***/ }),

/***/ "../../packages/scm/lib/browser/scm-groups-tree-model.js":
/*!***************************************************************!*\
  !*** ../../packages/scm/lib/browser/scm-groups-tree-model.js ***!
  \***************************************************************/
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ScmGroupsTreeModel = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
const scm_service_1 = __webpack_require__(/*! ./scm-service */ "../../packages/scm/lib/browser/scm-service.js");
const scm_tree_model_1 = __webpack_require__(/*! ./scm-tree-model */ "../../packages/scm/lib/browser/scm-tree-model.js");
let ScmGroupsTreeModel = class ScmGroupsTreeModel extends scm_tree_model_1.ScmTreeModel {
    constructor() {
        super(...arguments);
        this.toDisposeOnRepositoryChange = new disposable_1.DisposableCollection();
    }
    init() {
        super.init();
        this.refreshOnRepositoryChange();
        this.toDispose.push(this.scmService.onDidChangeSelectedRepository(() => {
            this.refreshOnRepositoryChange();
        }));
    }
    refreshOnRepositoryChange() {
        const repository = this.scmService.selectedRepository;
        if (repository) {
            this.changeRepository(repository.provider);
        }
        else {
            this.changeRepository(undefined);
        }
    }
    changeRepository(provider) {
        this.toDisposeOnRepositoryChange.dispose();
        this.contextKeys.scmProvider.set(provider ? provider.id : undefined);
        this.provider = provider;
        if (provider) {
            this.toDisposeOnRepositoryChange.push(provider.onDidChange(() => this.root = this.createTree()));
            if (provider.onDidChangeResources) {
                this.toDisposeOnRepositoryChange.push(provider.onDidChangeResources(() => this.root = this.createTree()));
            }
            this.root = this.createTree();
        }
    }
    get rootUri() {
        if (this.provider) {
            return this.provider.rootUri;
        }
    }
    ;
    get groups() {
        if (this.provider) {
            return this.provider.groups;
        }
        else {
            return [];
        }
    }
    ;
    canTabToWidget() {
        return !!this.provider;
    }
};
__decorate([
    (0, inversify_1.inject)(scm_service_1.ScmService),
    __metadata("design:type", scm_service_1.ScmService)
], ScmGroupsTreeModel.prototype, "scmService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ScmGroupsTreeModel.prototype, "init", null);
ScmGroupsTreeModel = __decorate([
    (0, inversify_1.injectable)()
], ScmGroupsTreeModel);
exports.ScmGroupsTreeModel = ScmGroupsTreeModel;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/scm/lib/browser/scm-groups-tree-model'] = this;


/***/ }),

/***/ "../../packages/scm/lib/browser/scm-layout-migrations.js":
/*!***************************************************************!*\
  !*** ../../packages/scm/lib/browser/scm-layout-migrations.js ***!
  \***************************************************************/
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
exports.ScmLayoutVersion5Migration = exports.ScmLayoutVersion3Migration = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const scm_contribution_1 = __webpack_require__(/*! ./scm-contribution */ "../../packages/scm/lib/browser/scm-contribution.js");
let ScmLayoutVersion3Migration = class ScmLayoutVersion3Migration {
    constructor() {
        this.layoutVersion = 3.0;
    }
    onWillInflateWidget(desc, { parent }) {
        if (desc.constructionOptions.factoryId === 'scm' && !parent) {
            return {
                constructionOptions: {
                    factoryId: scm_contribution_1.SCM_VIEW_CONTAINER_ID
                },
                innerWidgetState: {
                    parts: [
                        {
                            widget: {
                                constructionOptions: {
                                    factoryId: scm_contribution_1.SCM_WIDGET_FACTORY_ID
                                },
                                innerWidgetState: desc.innerWidgetState
                            },
                            partId: {
                                factoryId: scm_contribution_1.SCM_WIDGET_FACTORY_ID
                            },
                            collapsed: false,
                            hidden: false
                        }
                    ],
                    title: scm_contribution_1.SCM_VIEW_CONTAINER_TITLE_OPTIONS
                }
            };
        }
        return undefined;
    }
};
ScmLayoutVersion3Migration = __decorate([
    (0, inversify_1.injectable)()
], ScmLayoutVersion3Migration);
exports.ScmLayoutVersion3Migration = ScmLayoutVersion3Migration;
let ScmLayoutVersion5Migration = class ScmLayoutVersion5Migration {
    constructor() {
        this.layoutVersion = 5.0;
    }
    onWillInflateWidget(desc) {
        if (desc.constructionOptions.factoryId === scm_contribution_1.SCM_VIEW_CONTAINER_ID && typeof desc.innerWidgetState === 'string') {
            desc.innerWidgetState = desc.innerWidgetState.replace(/scm-tab-icon/g, scm_contribution_1.SCM_VIEW_CONTAINER_TITLE_OPTIONS.iconClass);
            return desc;
        }
        return undefined;
    }
};
ScmLayoutVersion5Migration = __decorate([
    (0, inversify_1.injectable)()
], ScmLayoutVersion5Migration);
exports.ScmLayoutVersion5Migration = ScmLayoutVersion5Migration;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/scm/lib/browser/scm-layout-migrations'] = this;


/***/ }),

/***/ "../../packages/scm/lib/browser/scm-tree-label-provider.js":
/*!*****************************************************************!*\
  !*** ../../packages/scm/lib/browser/scm-tree-label-provider.js ***!
  \*****************************************************************/
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ScmTreeLabelProvider = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const label_provider_1 = __webpack_require__(/*! @theia/core/lib/browser/label-provider */ "../../packages/core/lib/browser/label-provider.js");
const tree_1 = __webpack_require__(/*! @theia/core/lib/browser/tree */ "../../packages/core/lib/browser/tree/index.js");
const scm_tree_model_1 = __webpack_require__(/*! ./scm-tree-model */ "../../packages/scm/lib/browser/scm-tree-model.js");
let ScmTreeLabelProvider = class ScmTreeLabelProvider {
    canHandle(element) {
        return tree_1.TreeNode.is(element) && (scm_tree_model_1.ScmFileChangeGroupNode.is(element) || scm_tree_model_1.ScmFileChangeFolderNode.is(element) || scm_tree_model_1.ScmFileChangeNode.is(element)) ? 60 : 0;
    }
    getName(node) {
        if (scm_tree_model_1.ScmFileChangeGroupNode.is(node)) {
            return node.groupLabel;
        }
        if (scm_tree_model_1.ScmFileChangeFolderNode.is(node)) {
            return node.path;
        }
        if (scm_tree_model_1.ScmFileChangeNode.is(node)) {
            return this.labelProvider.getName(new uri_1.default(node.sourceUri));
        }
        return '';
    }
};
__decorate([
    (0, inversify_1.inject)(label_provider_1.LabelProvider),
    __metadata("design:type", label_provider_1.LabelProvider)
], ScmTreeLabelProvider.prototype, "labelProvider", void 0);
ScmTreeLabelProvider = __decorate([
    (0, inversify_1.injectable)()
], ScmTreeLabelProvider);
exports.ScmTreeLabelProvider = ScmTreeLabelProvider;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/scm/lib/browser/scm-tree-label-provider'] = this;


/***/ }),

/***/ "../../node_modules/css-loader/dist/cjs.js!../../packages/scm/src/browser/style/dirty-diff-decorator.css":
/*!***************************************************************************************************************!*\
  !*** ../../node_modules/css-loader/dist/cjs.js!../../packages/scm/src/browser/style/dirty-diff-decorator.css ***!
  \***************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, `/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.dirty-diff-glyph {
	margin-left: 5px;
	cursor: pointer;
}

.dirty-diff-removed-line:after {
	content: '';
	position: absolute;
	bottom: -4px;
	box-sizing: border-box;
	width: 4px;
	height: 0;
	z-index: 9;
	border-top: 4px solid transparent;
	border-bottom: 4px solid transparent;
	transition: border-top-width 80ms linear, border-bottom-width 80ms linear, bottom 80ms linear;
}

.dirty-diff-glyph:before {
	position: absolute;
	content: '';
	height: 100%;
	width: 0;
	left: -2px;
	transition: width 80ms linear, left 80ms linear;
}

.dirty-diff-removed-line:before {
	margin-left: 3px;
	height: 0;
	bottom: 0;
	transition: height 80ms linear;
}

.margin-view-overlays > div:hover > .dirty-diff-glyph:before {
	position: absolute;
	content: '';
	height: 100%;
	width: 9px;
	left: -6px;
}

.margin-view-overlays > div:hover > .dirty-diff-removed-line:after {
	bottom: 0;
	border-top-width: 0;
	border-bottom-width: 0;
}
`, "",{"version":3,"sources":["webpack://./../../packages/scm/src/browser/style/dirty-diff-decorator.css"],"names":[],"mappings":"AAAA;;;+FAG+F;;AAE/F;CACC,gBAAgB;CAChB,eAAe;AAChB;;AAEA;CACC,WAAW;CACX,kBAAkB;CAClB,YAAY;CACZ,sBAAsB;CACtB,UAAU;CACV,SAAS;CACT,UAAU;CACV,iCAAiC;CACjC,oCAAoC;CACpC,6FAA6F;AAC9F;;AAEA;CACC,kBAAkB;CAClB,WAAW;CACX,YAAY;CACZ,QAAQ;CACR,UAAU;CACV,+CAA+C;AAChD;;AAEA;CACC,gBAAgB;CAChB,SAAS;CACT,SAAS;CACT,8BAA8B;AAC/B;;AAEA;CACC,kBAAkB;CAClB,WAAW;CACX,YAAY;CACZ,UAAU;CACV,UAAU;AACX;;AAEA;CACC,SAAS;CACT,mBAAmB;CACnB,sBAAsB;AACvB","sourcesContent":["/*---------------------------------------------------------------------------------------------\n *  Copyright (c) Microsoft Corporation. All rights reserved.\n *  Licensed under the MIT License. See License.txt in the project root for license information.\n *--------------------------------------------------------------------------------------------*/\n\n.dirty-diff-glyph {\n\tmargin-left: 5px;\n\tcursor: pointer;\n}\n\n.dirty-diff-removed-line:after {\n\tcontent: '';\n\tposition: absolute;\n\tbottom: -4px;\n\tbox-sizing: border-box;\n\twidth: 4px;\n\theight: 0;\n\tz-index: 9;\n\tborder-top: 4px solid transparent;\n\tborder-bottom: 4px solid transparent;\n\ttransition: border-top-width 80ms linear, border-bottom-width 80ms linear, bottom 80ms linear;\n}\n\n.dirty-diff-glyph:before {\n\tposition: absolute;\n\tcontent: '';\n\theight: 100%;\n\twidth: 0;\n\tleft: -2px;\n\ttransition: width 80ms linear, left 80ms linear;\n}\n\n.dirty-diff-removed-line:before {\n\tmargin-left: 3px;\n\theight: 0;\n\tbottom: 0;\n\ttransition: height 80ms linear;\n}\n\n.margin-view-overlays > div:hover > .dirty-diff-glyph:before {\n\tposition: absolute;\n\tcontent: '';\n\theight: 100%;\n\twidth: 9px;\n\tleft: -6px;\n}\n\n.margin-view-overlays > div:hover > .dirty-diff-removed-line:after {\n\tbottom: 0;\n\tborder-top-width: 0;\n\tborder-bottom-width: 0;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../node_modules/css-loader/dist/cjs.js!../../packages/scm/src/browser/style/dirty-diff.css":
/*!*****************************************************************************************************!*\
  !*** ../../node_modules/css-loader/dist/cjs.js!../../packages/scm/src/browser/style/dirty-diff.css ***!
  \*****************************************************************************************************/
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_dirty_diff_decorator_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! -!../../../../../node_modules/css-loader/dist/cjs.js!./dirty-diff-decorator.css */ "../../node_modules/css-loader/dist/cjs.js!../../packages/scm/src/browser/style/dirty-diff-decorator.css");
// Imports



var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_dirty_diff_decorator_css__WEBPACK_IMPORTED_MODULE_2__["default"]);
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

.monaco-editor .dirty-diff-added-line {
  border-left: 3px solid var(--theia-editorGutter-addedBackground);
  transition: opacity 0.5s;
}
.monaco-editor .dirty-diff-added-line:before {
  background: var(--theia-editorGutter-addedBackground);
}
.monaco-editor .margin:hover .dirty-diff-added-line {
  opacity: 1;
}

.monaco-editor .dirty-diff-removed-line:after {
  border-left: 4px solid var(--theia-editorGutter-deletedBackground);
  transition: opacity 0.5s;
}
.monaco-editor .dirty-diff-removed-line:before {
  background: var(--theia-editorGutter-deletedBackground);
}
.monaco-editor .margin:hover .dirty-diff-removed-line {
  opacity: 1;
}

.monaco-editor .dirty-diff-modified-line {
  border-left: 3px solid var(--theia-editorGutter-modifiedBackground);
  transition: opacity 0.5s;
}
.monaco-editor .dirty-diff-modified-line:before {
  background: var(--theia-editorGutter-modifiedBackground);
}
.monaco-editor .margin:hover .dirty-diff-modified-line {
  opacity: 1;
}
`, "",{"version":3,"sources":["webpack://./../../packages/scm/src/browser/style/dirty-diff.css"],"names":[],"mappings":"AAAA;;;;;;;;;;;;;;iFAciF;;AAIjF;EACE,gEAAgE;EAChE,wBAAwB;AAC1B;AACA;EACE,qDAAqD;AACvD;AACA;EACE,UAAU;AACZ;;AAEA;EACE,kEAAkE;EAClE,wBAAwB;AAC1B;AACA;EACE,uDAAuD;AACzD;AACA;EACE,UAAU;AACZ;;AAEA;EACE,mEAAmE;EACnE,wBAAwB;AAC1B;AACA;EACE,wDAAwD;AAC1D;AACA;EACE,UAAU;AACZ","sourcesContent":["/********************************************************************************\n * Copyright (C) 2018 TypeFox and others.\n *\n * This program and the accompanying materials are made available under the\n * terms of the Eclipse Public License v. 2.0 which is available at\n * http://www.eclipse.org/legal/epl-2.0.\n *\n * This Source Code may also be made available under the following Secondary\n * Licenses when the conditions for such availability set forth in the Eclipse\n * Public License v. 2.0 are satisfied: GNU General Public License, version 2\n * with the GNU Classpath Exception which is available at\n * https://www.gnu.org/software/classpath/license.html.\n *\n * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0\n ********************************************************************************/\n\n@import \"dirty-diff-decorator.css\";\n\n.monaco-editor .dirty-diff-added-line {\n  border-left: 3px solid var(--theia-editorGutter-addedBackground);\n  transition: opacity 0.5s;\n}\n.monaco-editor .dirty-diff-added-line:before {\n  background: var(--theia-editorGutter-addedBackground);\n}\n.monaco-editor .margin:hover .dirty-diff-added-line {\n  opacity: 1;\n}\n\n.monaco-editor .dirty-diff-removed-line:after {\n  border-left: 4px solid var(--theia-editorGutter-deletedBackground);\n  transition: opacity 0.5s;\n}\n.monaco-editor .dirty-diff-removed-line:before {\n  background: var(--theia-editorGutter-deletedBackground);\n}\n.monaco-editor .margin:hover .dirty-diff-removed-line {\n  opacity: 1;\n}\n\n.monaco-editor .dirty-diff-modified-line {\n  border-left: 3px solid var(--theia-editorGutter-modifiedBackground);\n  transition: opacity 0.5s;\n}\n.monaco-editor .dirty-diff-modified-line:before {\n  background: var(--theia-editorGutter-modifiedBackground);\n}\n.monaco-editor .margin:hover .dirty-diff-modified-line {\n  opacity: 1;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../node_modules/css-loader/dist/cjs.js!../../packages/scm/src/browser/style/index.css":
/*!************************************************************************************************!*\
  !*** ../../node_modules/css-loader/dist/cjs.js!../../packages/scm/src/browser/style/index.css ***!
  \************************************************************************************************/
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
 * Copyright (C) 2019 Red Hat, Inc. and others.
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

.theia-scm-commit {
  overflow: hidden;
  font-size: var(--theia-ui-font-size1);
  max-height: calc(100% - var(--theia-border-width));
  position: relative;
  padding: 5px 5px 0px 19px;
}

.theia-scm {
  box-sizing: border-box;
  height: 100%;
}

.groups-outer-container:focus {
  outline: 0;
  box-shadow: none;
  border: none;
}

.theia-scm .noWrapInfo {
  width: 100%;
  align-items: center;
}

.theia-scm:focus,
.theia-scm :focus {
  outline: 0;
  box-shadow: none;
  border: none;
}

.theia-scm .space-between {
  justify-content: space-between;
}

.theia-scm .changesHeader {
  font-weight: bold;
}

.theia-scm .theia-scm-amend {
  margin: 5px 0;
}

.theia-scm #messageInputContainer {
  position: relative;
}

.theia-scm #repositoryListContainer {
  display: flex;
  margin-bottom: 5px;
  flex: 1;
}

.theia-scm .groups-outer-container {
  overflow-y: auto;
  width: 100%;
  flex-grow: 1;
}

.theia-scm .warn {
  background-color: var(--theia-inputValidation-warningBackground) !important;
}

.theia-scm-main-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.theia-scm-input-message-container {
  display: flex;
  flex-direction: column;
  margin: 0px 0px 7px 0px;
  max-height: 400px;
}

.theia-scm-input-message-container textarea {
  line-height: var(--theia-content-line-height);
  resize: none;
  box-sizing: border-box;
  min-height: 32px;
  padding: 4px;
  border: none;
}

.theia-scm-input-message-container textarea:placeholder-shown {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.theia-scm-input-message-container textarea:focus {
  outline: var(--theia-border-width) solid var(--theia-focusBorder);
}

.theia-scm-input-message {
  width: 100%;
}

.theia-scm-input-message-idle:not(:focus) {
  border-color: var(--theia-input-border);
}

.theia-scm-input-message-info {
  border-color: var(--theia-inputValidation-infoBorder) !important;
}

.theia-scm-input-message-success {
  border-color: var(--theia-successBackground) !important;
}

.theia-scm-input-message-warning {
  border-color: var(--theia-inputValidation-warningBorder) !important;
}

.theia-scm-input-message-error {
  border-color: var(--theia-inputValidation-errorBorder) !important;
}

.theia-scm-message,
.theia-scm-input-validation-message {
  padding: 4px 4px 4px 4px;
}

.theia-scm-validation-message-info {
  background-color: var(--theia-inputValidation-infoBackground) !important;
  color: var(--theia-inputValidation-infoForeground);
  border: var(--theia-border-width) solid
    var(--theia-inputValidation-infoBorder);
  border-top: none; /* remove top border since the input declares it already */
}

.theia-scm-validation-message-success {
  background-color: var(--theia-successBackground) !important;
  color: var(--theia-inputValidation-warningBackground);
}

.theia-scm-message-warning,
.theia-scm-validation-message-warning {
  background-color: var(--theia-inputValidation-warningBackground) !important;
  color: var(--theia-inputValidation-warningForeground);
  border: var(--theia-border-width) solid
    var(--theia-inputValidation-warningBorder);
  border-top: none; /* remove top border since the input declares it already */
}

.theia-scm-validation-message-error {
  background-color: var(--theia-inputValidation-errorBackground) !important;
  color: var(--theia-inputValidation-errorForeground);
  border: var(--theia-border-width) solid
    var(--theia-inputValidation-errorBorder);
  border-top: none; /* remove top border since the input declares it already */
}

.no-select:focus {
  outline: none;
}

.theia-scm .scmItem {
  font-size: var(--theia-ui-font-size1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--theia-content-line-height);
  line-height: var(--theia-content-line-height);
  padding: 0px calc(var(--theia-ui-padding) / 2);
}

.theia-scm .scmItem:hover {
  cursor: pointer;
}

.theia-scm:focus-within .scmItem:focus {
  background: var(--theia-list-focusBackground);
  color: var(--theia-list-focusForeground);
}

.theia-scm:not(:focus-within) .scmItem:not(:focus) {
  background: var(--theia-list-inactiveFocusBackground);
}

.theia-scm:focus-within .scmItem.theia-mod-selected {
  background: var(--theia-list-activeSelectionBackground);
  color: var(--theia-list-activeSelectionForeground);
}

.theia-scm:not(:focus-within) .scmItem.theia-mod-selected {
  background: var(--theia-list-inactiveSelectionBackground);
  color: var(--theia-list-inactiveSelectionForeground);
}

.theia-scm .scmItem .path {
  font-size: var(--theia-ui-font-size0);
  margin-left: var(--theia-ui-padding);
  opacity: 0.7;
}

.theia-scm .scmItem .status {
  width: 16px;
  text-align: center;
  padding-top: 2px;
  padding-bottom: 2px;
  font-size: var(--theia-ui-font-size0);
}

.theia-scm .decoration-icon {
    margin: 2px 0px;
}

.scm-change-count {
  float: right;
}

.scm-theia-header {
  display: flex;
  align-items: center;
}

.scm-theia-header:hover {
  cursor: pointer;
}

.theia-scm-inline-actions-container {
  display: flex;
  justify-content: flex-end;
  margin-left: 3px;
  min-height: 16px;
}

.theia-scm-inline-actions {
  display: flex;
  margin: 0 3px;
}

.theia-scm-inline-actions a {
  color: var(--theia-icon-foreground);
}

.theia-scm-inline-action {
  font-size: var(--theia-ui-font-size1);
  margin: 0 2px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.theia-scm-inline-action .open-file {
  height: var(--theia-icon-size);
  width: 12px;
  background: var(--theia-icon-open-file) no-repeat center center;
}

.theia-scm-panel {
  overflow: visible;
}
`, "",{"version":3,"sources":["webpack://./../../packages/scm/src/browser/style/index.css"],"names":[],"mappings":"AAAA;;;;;;;;;;;;;;iFAciF;;AAEjF;EACE,gBAAgB;EAChB,qCAAqC;EACrC,kDAAkD;EAClD,kBAAkB;EAClB,yBAAyB;AAC3B;;AAEA;EACE,sBAAsB;EACtB,YAAY;AACd;;AAEA;EACE,UAAU;EACV,gBAAgB;EAChB,YAAY;AACd;;AAEA;EACE,WAAW;EACX,mBAAmB;AACrB;;AAEA;;EAEE,UAAU;EACV,gBAAgB;EAChB,YAAY;AACd;;AAEA;EACE,8BAA8B;AAChC;;AAEA;EACE,iBAAiB;AACnB;;AAEA;EACE,aAAa;AACf;;AAEA;EACE,kBAAkB;AACpB;;AAEA;EACE,aAAa;EACb,kBAAkB;EAClB,OAAO;AACT;;AAEA;EACE,gBAAgB;EAChB,WAAW;EACX,YAAY;AACd;;AAEA;EACE,2EAA2E;AAC7E;;AAEA;EACE,aAAa;EACb,sBAAsB;EACtB,YAAY;AACd;;AAEA;EACE,aAAa;EACb,sBAAsB;EACtB,uBAAuB;EACvB,iBAAiB;AACnB;;AAEA;EACE,6CAA6C;EAC7C,YAAY;EACZ,sBAAsB;EACtB,gBAAgB;EAChB,YAAY;EACZ,YAAY;AACd;;AAEA;EACE,gBAAgB;EAChB,uBAAuB;EACvB,mBAAmB;AACrB;;AAEA;EACE,iEAAiE;AACnE;;AAEA;EACE,WAAW;AACb;;AAEA;EACE,uCAAuC;AACzC;;AAEA;EACE,gEAAgE;AAClE;;AAEA;EACE,uDAAuD;AACzD;;AAEA;EACE,mEAAmE;AACrE;;AAEA;EACE,iEAAiE;AACnE;;AAEA;;EAEE,wBAAwB;AAC1B;;AAEA;EACE,wEAAwE;EACxE,kDAAkD;EAClD;2CACyC;EACzC,gBAAgB,EAAE,0DAA0D;AAC9E;;AAEA;EACE,2DAA2D;EAC3D,qDAAqD;AACvD;;AAEA;;EAEE,2EAA2E;EAC3E,qDAAqD;EACrD;8CAC4C;EAC5C,gBAAgB,EAAE,0DAA0D;AAC9E;;AAEA;EACE,yEAAyE;EACzE,mDAAmD;EACnD;4CAC0C;EAC1C,gBAAgB,EAAE,0DAA0D;AAC9E;;AAEA;EACE,aAAa;AACf;;AAEA;EACE,qCAAqC;EACrC,aAAa;EACb,mBAAmB;EACnB,8BAA8B;EAC9B,wCAAwC;EACxC,6CAA6C;EAC7C,8CAA8C;AAChD;;AAEA;EACE,eAAe;AACjB;;AAEA;EACE,6CAA6C;EAC7C,wCAAwC;AAC1C;;AAEA;EACE,qDAAqD;AACvD;;AAEA;EACE,uDAAuD;EACvD,kDAAkD;AACpD;;AAEA;EACE,yDAAyD;EACzD,oDAAoD;AACtD;;AAEA;EACE,qCAAqC;EACrC,oCAAoC;EACpC,YAAY;AACd;;AAEA;EACE,WAAW;EACX,kBAAkB;EAClB,gBAAgB;EAChB,mBAAmB;EACnB,qCAAqC;AACvC;;AAEA;IACI,eAAe;AACnB;;AAEA;EACE,YAAY;AACd;;AAEA;EACE,aAAa;EACb,mBAAmB;AACrB;;AAEA;EACE,eAAe;AACjB;;AAEA;EACE,aAAa;EACb,yBAAyB;EACzB,gBAAgB;EAChB,gBAAgB;AAClB;;AAEA;EACE,aAAa;EACb,aAAa;AACf;;AAEA;EACE,mCAAmC;AACrC;;AAEA;EACE,qCAAqC;EACrC,aAAa;EACb,eAAe;EACf,aAAa;EACb,mBAAmB;AACrB;;AAEA;EACE,8BAA8B;EAC9B,WAAW;EACX,+DAA+D;AACjE;;AAEA;EACE,iBAAiB;AACnB","sourcesContent":["/********************************************************************************\n * Copyright (C) 2019 Red Hat, Inc. and others.\n *\n * This program and the accompanying materials are made available under the\n * terms of the Eclipse Public License v. 2.0 which is available at\n * http://www.eclipse.org/legal/epl-2.0.\n *\n * This Source Code may also be made available under the following Secondary\n * Licenses when the conditions for such availability set forth in the Eclipse\n * Public License v. 2.0 are satisfied: GNU General Public License, version 2\n * with the GNU Classpath Exception which is available at\n * https://www.gnu.org/software/classpath/license.html.\n *\n * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0\n ********************************************************************************/\n\n.theia-scm-commit {\n  overflow: hidden;\n  font-size: var(--theia-ui-font-size1);\n  max-height: calc(100% - var(--theia-border-width));\n  position: relative;\n  padding: 5px 5px 0px 19px;\n}\n\n.theia-scm {\n  box-sizing: border-box;\n  height: 100%;\n}\n\n.groups-outer-container:focus {\n  outline: 0;\n  box-shadow: none;\n  border: none;\n}\n\n.theia-scm .noWrapInfo {\n  width: 100%;\n  align-items: center;\n}\n\n.theia-scm:focus,\n.theia-scm :focus {\n  outline: 0;\n  box-shadow: none;\n  border: none;\n}\n\n.theia-scm .space-between {\n  justify-content: space-between;\n}\n\n.theia-scm .changesHeader {\n  font-weight: bold;\n}\n\n.theia-scm .theia-scm-amend {\n  margin: 5px 0;\n}\n\n.theia-scm #messageInputContainer {\n  position: relative;\n}\n\n.theia-scm #repositoryListContainer {\n  display: flex;\n  margin-bottom: 5px;\n  flex: 1;\n}\n\n.theia-scm .groups-outer-container {\n  overflow-y: auto;\n  width: 100%;\n  flex-grow: 1;\n}\n\n.theia-scm .warn {\n  background-color: var(--theia-inputValidation-warningBackground) !important;\n}\n\n.theia-scm-main-container {\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n}\n\n.theia-scm-input-message-container {\n  display: flex;\n  flex-direction: column;\n  margin: 0px 0px 7px 0px;\n  max-height: 400px;\n}\n\n.theia-scm-input-message-container textarea {\n  line-height: var(--theia-content-line-height);\n  resize: none;\n  box-sizing: border-box;\n  min-height: 32px;\n  padding: 4px;\n  border: none;\n}\n\n.theia-scm-input-message-container textarea:placeholder-shown {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.theia-scm-input-message-container textarea:focus {\n  outline: var(--theia-border-width) solid var(--theia-focusBorder);\n}\n\n.theia-scm-input-message {\n  width: 100%;\n}\n\n.theia-scm-input-message-idle:not(:focus) {\n  border-color: var(--theia-input-border);\n}\n\n.theia-scm-input-message-info {\n  border-color: var(--theia-inputValidation-infoBorder) !important;\n}\n\n.theia-scm-input-message-success {\n  border-color: var(--theia-successBackground) !important;\n}\n\n.theia-scm-input-message-warning {\n  border-color: var(--theia-inputValidation-warningBorder) !important;\n}\n\n.theia-scm-input-message-error {\n  border-color: var(--theia-inputValidation-errorBorder) !important;\n}\n\n.theia-scm-message,\n.theia-scm-input-validation-message {\n  padding: 4px 4px 4px 4px;\n}\n\n.theia-scm-validation-message-info {\n  background-color: var(--theia-inputValidation-infoBackground) !important;\n  color: var(--theia-inputValidation-infoForeground);\n  border: var(--theia-border-width) solid\n    var(--theia-inputValidation-infoBorder);\n  border-top: none; /* remove top border since the input declares it already */\n}\n\n.theia-scm-validation-message-success {\n  background-color: var(--theia-successBackground) !important;\n  color: var(--theia-inputValidation-warningBackground);\n}\n\n.theia-scm-message-warning,\n.theia-scm-validation-message-warning {\n  background-color: var(--theia-inputValidation-warningBackground) !important;\n  color: var(--theia-inputValidation-warningForeground);\n  border: var(--theia-border-width) solid\n    var(--theia-inputValidation-warningBorder);\n  border-top: none; /* remove top border since the input declares it already */\n}\n\n.theia-scm-validation-message-error {\n  background-color: var(--theia-inputValidation-errorBackground) !important;\n  color: var(--theia-inputValidation-errorForeground);\n  border: var(--theia-border-width) solid\n    var(--theia-inputValidation-errorBorder);\n  border-top: none; /* remove top border since the input declares it already */\n}\n\n.no-select:focus {\n  outline: none;\n}\n\n.theia-scm .scmItem {\n  font-size: var(--theia-ui-font-size1);\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  height: var(--theia-content-line-height);\n  line-height: var(--theia-content-line-height);\n  padding: 0px calc(var(--theia-ui-padding) / 2);\n}\n\n.theia-scm .scmItem:hover {\n  cursor: pointer;\n}\n\n.theia-scm:focus-within .scmItem:focus {\n  background: var(--theia-list-focusBackground);\n  color: var(--theia-list-focusForeground);\n}\n\n.theia-scm:not(:focus-within) .scmItem:not(:focus) {\n  background: var(--theia-list-inactiveFocusBackground);\n}\n\n.theia-scm:focus-within .scmItem.theia-mod-selected {\n  background: var(--theia-list-activeSelectionBackground);\n  color: var(--theia-list-activeSelectionForeground);\n}\n\n.theia-scm:not(:focus-within) .scmItem.theia-mod-selected {\n  background: var(--theia-list-inactiveSelectionBackground);\n  color: var(--theia-list-inactiveSelectionForeground);\n}\n\n.theia-scm .scmItem .path {\n  font-size: var(--theia-ui-font-size0);\n  margin-left: var(--theia-ui-padding);\n  opacity: 0.7;\n}\n\n.theia-scm .scmItem .status {\n  width: 16px;\n  text-align: center;\n  padding-top: 2px;\n  padding-bottom: 2px;\n  font-size: var(--theia-ui-font-size0);\n}\n\n.theia-scm .decoration-icon {\n    margin: 2px 0px;\n}\n\n.scm-change-count {\n  float: right;\n}\n\n.scm-theia-header {\n  display: flex;\n  align-items: center;\n}\n\n.scm-theia-header:hover {\n  cursor: pointer;\n}\n\n.theia-scm-inline-actions-container {\n  display: flex;\n  justify-content: flex-end;\n  margin-left: 3px;\n  min-height: 16px;\n}\n\n.theia-scm-inline-actions {\n  display: flex;\n  margin: 0 3px;\n}\n\n.theia-scm-inline-actions a {\n  color: var(--theia-icon-foreground);\n}\n\n.theia-scm-inline-action {\n  font-size: var(--theia-ui-font-size1);\n  margin: 0 2px;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n}\n\n.theia-scm-inline-action .open-file {\n  height: var(--theia-icon-size);\n  width: 12px;\n  background: var(--theia-icon-open-file) no-repeat center center;\n}\n\n.theia-scm-panel {\n  overflow: visible;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../packages/scm/src/browser/style/dirty-diff.css":
/*!***********************************************************!*\
  !*** ../../packages/scm/src/browser/style/dirty-diff.css ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_dirty_diff_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/css-loader/dist/cjs.js!./dirty-diff.css */ "../../node_modules/css-loader/dist/cjs.js!../../packages/scm/src/browser/style/dirty-diff.css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_dirty_diff_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_dirty_diff_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "../../packages/scm/src/browser/style/index.css":
/*!******************************************************!*\
  !*** ../../packages/scm/src/browser/style/index.css ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/css-loader/dist/cjs.js!./index.css */ "../../node_modules/css-loader/dist/cjs.js!../../packages/scm/src/browser/style/index.css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ })

}]);
//# sourceMappingURL=packages_core_shared_phosphor_coreutils_index_js-packages_scm_lib_browser_scm-frontend-module_js.js.map