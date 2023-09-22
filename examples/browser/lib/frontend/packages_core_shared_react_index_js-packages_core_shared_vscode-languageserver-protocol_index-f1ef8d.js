(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_core_shared_react_index_js-packages_core_shared_vscode-languageserver-protocol_index-f1ef8d"],{

/***/ "../../packages/core/shared/react/index.js":
/*!*************************************************!*\
  !*** ../../packages/core/shared/react/index.js ***!
  \*************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! react */ "../../node_modules/react/index.js");

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/shared/react'] = this;


/***/ }),

/***/ "../../packages/core/shared/vscode-languageserver-protocol/index.js":
/*!**************************************************************************!*\
  !*** ../../packages/core/shared/vscode-languageserver-protocol/index.js ***!
  \**************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! vscode-languageserver-protocol */ "../../node_modules/vscode-languageserver-protocol/lib/browser/main.js");

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/shared/vscode-languageserver-protocol'] = this;


/***/ }),

/***/ "../../packages/outline-view/lib/browser/outline-breadcrumbs-contribution.js":
/*!***********************************************************************************!*\
  !*** ../../packages/outline-view/lib/browser/outline-breadcrumbs-contribution.js ***!
  \***********************************************************************************/
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
exports.OutlineBreadcrumb = exports.OutlineBreadcrumbsContribution = exports.BreadcrumbPopupOutlineView = exports.OUTLINE_BREADCRUMB_CONTAINER_CLASS = exports.BreadcrumbPopupOutlineViewFactory = exports.OutlineBreadcrumbType = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const outline_view_service_1 = __webpack_require__(/*! ./outline-view-service */ "../../packages/outline-view/lib/browser/outline-view-service.js");
const outline_view_widget_1 = __webpack_require__(/*! ./outline-view-widget */ "../../packages/outline-view/lib/browser/outline-view-widget.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
exports.OutlineBreadcrumbType = Symbol('OutlineBreadcrumb');
exports.BreadcrumbPopupOutlineViewFactory = Symbol('BreadcrumbPopupOutlineViewFactory');
exports.OUTLINE_BREADCRUMB_CONTAINER_CLASS = 'outline-element';
class BreadcrumbPopupOutlineView extends outline_view_widget_1.OutlineViewWidget {
    tapNode(node) {
        if (common_1.UriSelection.is(node) && outline_view_widget_1.OutlineSymbolInformationNode.hasRange(node)) {
            (0, browser_1.open)(this.openerService, node.uri, { selection: node.range });
        }
        else {
            super.tapNode(node);
        }
    }
    cloneState(roots) {
        const nodes = this.reconcileTreeState(roots);
        const root = this.getRoot(nodes);
        this.model.root = this.inflateFromStorage(this.deflateForStorage(root));
    }
}
__decorate([
    (0, inversify_1.inject)(browser_1.OpenerService),
    __metadata("design:type", Object)
], BreadcrumbPopupOutlineView.prototype, "openerService", void 0);
exports.BreadcrumbPopupOutlineView = BreadcrumbPopupOutlineView;
let OutlineBreadcrumbsContribution = class OutlineBreadcrumbsContribution {
    constructor() {
        this.type = exports.OutlineBreadcrumbType;
        this.priority = 200;
        this.currentUri = undefined;
        this.currentBreadcrumbs = [];
        this.roots = [];
        this.onDidChangeBreadcrumbsEmitter = new common_1.Emitter();
    }
    get onDidChangeBreadcrumbs() {
        return this.onDidChangeBreadcrumbsEmitter.event;
    }
    init() {
        this.outlineView = this.outlineFactory();
        this.outlineView.node.style.height = 'auto';
        this.outlineView.node.style.maxHeight = '200px';
        this.outlineViewService.onDidChangeOutline(roots => {
            if (roots.length > 0) {
                this.roots = roots;
                const first = roots[0];
                if (common_1.UriSelection.is(first)) {
                    this.updateOutlineItems(first.uri, this.findSelectedNode(roots));
                }
            }
            else {
                this.currentBreadcrumbs = [];
                this.roots = [];
            }
        });
        this.outlineViewService.onDidSelect(node => {
            if (common_1.UriSelection.is(node)) {
                this.updateOutlineItems(node.uri, node);
            }
        });
    }
    async updateOutlineItems(uri, selectedNode) {
        this.currentUri = uri;
        const outlinePath = this.toOutlinePath(selectedNode);
        if (outlinePath && selectedNode) {
            this.currentBreadcrumbs = outlinePath.map((node, index) => new OutlineBreadcrumb(node, uri, index.toString(), this.labelProvider.getName(node), 'symbol-icon-center codicon codicon-symbol-' + node.iconClass, exports.OUTLINE_BREADCRUMB_CONTAINER_CLASS));
            if (selectedNode.children && selectedNode.children.length > 0) {
                this.currentBreadcrumbs.push(new OutlineBreadcrumb(selectedNode.children, uri, this.currentBreadcrumbs.length.toString(), '…', '', exports.OUTLINE_BREADCRUMB_CONTAINER_CLASS));
            }
        }
        else {
            this.currentBreadcrumbs = [];
            if (this.roots) {
                this.currentBreadcrumbs.push(new OutlineBreadcrumb(this.roots, uri, this.currentBreadcrumbs.length.toString(), '…', '', exports.OUTLINE_BREADCRUMB_CONTAINER_CLASS));
            }
        }
        this.onDidChangeBreadcrumbsEmitter.fire(uri);
    }
    async computeBreadcrumbs(uri) {
        if (this.currentUri && uri.toString() === this.currentUri.toString()) {
            return this.currentBreadcrumbs;
        }
        return [];
    }
    async attachPopupContent(breadcrumb, parent) {
        if (!OutlineBreadcrumb.is(breadcrumb)) {
            return undefined;
        }
        const node = Array.isArray(breadcrumb.node) ? breadcrumb.node[0] : breadcrumb.node;
        if (!node.parent) {
            return undefined;
        }
        const siblings = node.parent.children.filter((child) => outline_view_widget_1.OutlineSymbolInformationNode.is(child));
        const toDisposeOnHide = new common_1.DisposableCollection();
        this.outlineView.cloneState(siblings);
        this.outlineView.model.selectNode(node);
        this.outlineView.model.collapseAll();
        browser_1.Widget.attach(this.outlineView, parent);
        this.outlineView.activate();
        toDisposeOnHide.pushAll([
            this.outlineView.model.onExpansionChanged(expandedNode => browser_1.SelectableTreeNode.is(expandedNode) && this.outlineView.model.selectNode(expandedNode)),
            common_1.Disposable.create(() => {
                this.outlineView.model.root = undefined;
                browser_1.Widget.detach(this.outlineView);
            }),
        ]);
        return toDisposeOnHide;
    }
    /**
     * Returns the path of the given outline node.
     */
    toOutlinePath(node, path = []) {
        if (!node) {
            return undefined;
        }
        if (node.id === 'outline-view-root') {
            return path;
        }
        if (node.parent) {
            return this.toOutlinePath(node.parent, [node, ...path]);
        }
        else {
            return [node, ...path];
        }
    }
    /**
     * Find the node that is selected. Returns after the first match.
     */
    findSelectedNode(roots) {
        const result = roots.find(node => node.selected);
        if (result) {
            return result;
        }
        for (const node of roots) {
            const result2 = this.findSelectedNode(node.children.map(child => child));
            if (result2) {
                return result2;
            }
        }
    }
};
__decorate([
    (0, inversify_1.inject)(browser_1.LabelProvider),
    __metadata("design:type", browser_1.LabelProvider)
], OutlineBreadcrumbsContribution.prototype, "labelProvider", void 0);
__decorate([
    (0, inversify_1.inject)(outline_view_service_1.OutlineViewService),
    __metadata("design:type", outline_view_service_1.OutlineViewService)
], OutlineBreadcrumbsContribution.prototype, "outlineViewService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.BreadcrumbsService),
    __metadata("design:type", browser_1.BreadcrumbsService)
], OutlineBreadcrumbsContribution.prototype, "breadcrumbsService", void 0);
__decorate([
    (0, inversify_1.inject)(exports.BreadcrumbPopupOutlineViewFactory),
    __metadata("design:type", Function)
], OutlineBreadcrumbsContribution.prototype, "outlineFactory", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OutlineBreadcrumbsContribution.prototype, "init", null);
OutlineBreadcrumbsContribution = __decorate([
    (0, inversify_1.injectable)()
], OutlineBreadcrumbsContribution);
exports.OutlineBreadcrumbsContribution = OutlineBreadcrumbsContribution;
class OutlineBreadcrumb {
    constructor(node, uri, index, label, iconClass, containerClass) {
        this.node = node;
        this.uri = uri;
        this.index = index;
        this.label = label;
        this.iconClass = iconClass;
        this.containerClass = containerClass;
    }
    get id() {
        return this.type.toString() + '_' + this.uri.toString() + '_' + this.index;
    }
    get type() {
        return exports.OutlineBreadcrumbType;
    }
    get longLabel() {
        return this.label;
    }
}
exports.OutlineBreadcrumb = OutlineBreadcrumb;
(function (OutlineBreadcrumb) {
    function is(breadcrumb) {
        return 'node' in breadcrumb && 'uri' in breadcrumb;
    }
    OutlineBreadcrumb.is = is;
})(OutlineBreadcrumb = exports.OutlineBreadcrumb || (exports.OutlineBreadcrumb = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/outline-view/lib/browser/outline-breadcrumbs-contribution'] = this;


/***/ }),

/***/ "../../packages/outline-view/lib/browser/outline-view-contribution.js":
/*!****************************************************************************!*\
  !*** ../../packages/outline-view/lib/browser/outline-view-contribution.js ***!
  \****************************************************************************/
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
exports.OutlineViewContribution = exports.OutlineViewCommands = exports.OUTLINE_WIDGET_FACTORY_ID = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const view_contribution_1 = __webpack_require__(/*! @theia/core/lib/browser/shell/view-contribution */ "../../packages/core/lib/browser/shell/view-contribution.js");
const widgets_1 = __webpack_require__(/*! @theia/core/lib/browser/widgets */ "../../packages/core/lib/browser/widgets/index.js");
const outline_view_widget_1 = __webpack_require__(/*! ./outline-view-widget */ "../../packages/outline-view/lib/browser/outline-view-widget.js");
const tree_1 = __webpack_require__(/*! @theia/core/lib/browser/tree */ "../../packages/core/lib/browser/tree/index.js");
const os_1 = __webpack_require__(/*! @theia/core/lib/common/os */ "../../packages/core/lib/common/os.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
exports.OUTLINE_WIDGET_FACTORY_ID = 'outline-view';
/**
 * Collection of `outline-view` commands.
 */
var OutlineViewCommands;
(function (OutlineViewCommands) {
    /**
     * Command which collapses all nodes from the `outline-view` tree.
     */
    OutlineViewCommands.COLLAPSE_ALL = {
        id: 'outlineView.collapse.all',
        iconClass: (0, widgets_1.codicon)('collapse-all')
    };
    /**
     * Command which expands all nodes from the `outline-view` tree.
     */
    OutlineViewCommands.EXPAND_ALL = {
        id: 'outlineView.expand.all',
        iconClass: (0, widgets_1.codicon)('expand-all')
    };
})(OutlineViewCommands = exports.OutlineViewCommands || (exports.OutlineViewCommands = {}));
let OutlineViewContribution = class OutlineViewContribution extends view_contribution_1.AbstractViewContribution {
    constructor() {
        super({
            widgetId: exports.OUTLINE_WIDGET_FACTORY_ID,
            widgetName: outline_view_widget_1.OutlineViewWidget.LABEL,
            defaultWidgetOptions: {
                area: 'right',
                rank: 500
            },
            toggleCommandId: 'outlineView:toggle',
            toggleKeybinding: os_1.OS.type() !== os_1.OS.Type.Linux
                ? 'ctrlcmd+shift+i'
                : undefined
        });
    }
    async initializeLayout(app) {
        await this.openView();
    }
    registerCommands(commands) {
        super.registerCommands(commands);
        commands.registerCommand(OutlineViewCommands.COLLAPSE_ALL, {
            isEnabled: w => this.withWidget(w, () => true),
            isVisible: w => this.withWidget(w, widget => !widget.model.areNodesCollapsed()),
            execute: () => this.collapseAllItems()
        });
        commands.registerCommand(OutlineViewCommands.EXPAND_ALL, {
            isEnabled: w => this.withWidget(w, () => true),
            isVisible: w => this.withWidget(w, widget => widget.model.areNodesCollapsed()),
            execute: () => this.expandAllItems()
        });
    }
    async registerToolbarItems(toolbar) {
        const widget = await this.widget;
        const onDidChange = widget.onDidUpdate;
        toolbar.registerItem({
            id: OutlineViewCommands.COLLAPSE_ALL.id,
            command: OutlineViewCommands.COLLAPSE_ALL.id,
            tooltip: nls_1.nls.localizeByDefault('Collapse All'),
            priority: 0,
            onDidChange
        });
        toolbar.registerItem({
            id: OutlineViewCommands.EXPAND_ALL.id,
            command: OutlineViewCommands.EXPAND_ALL.id,
            tooltip: nls_1.nls.localizeByDefault('Expand All'),
            priority: 0,
            onDidChange
        });
    }
    /**
     * Collapse all nodes in the outline view tree.
     */
    async collapseAllItems() {
        const { model } = await this.widget;
        const root = model.root;
        if (tree_1.CompositeTreeNode.is(root)) {
            model.collapseAll(root);
        }
    }
    async expandAllItems() {
        const { model } = await this.widget;
        model.expandAll(model.root);
    }
    /**
     * Determine if the current widget is the `outline-view`.
     */
    withWidget(widget = this.tryGetWidget(), cb) {
        if (widget instanceof outline_view_widget_1.OutlineViewWidget && widget.id === exports.OUTLINE_WIDGET_FACTORY_ID) {
            return cb(widget);
        }
        return false;
    }
};
OutlineViewContribution = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], OutlineViewContribution);
exports.OutlineViewContribution = OutlineViewContribution;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/outline-view/lib/browser/outline-view-contribution'] = this;


/***/ }),

/***/ "../../packages/outline-view/lib/browser/outline-view-frontend-module.js":
/*!*******************************************************************************!*\
  !*** ../../packages/outline-view/lib/browser/outline-view-frontend-module.js ***!
  \*******************************************************************************/
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
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const outline_view_service_1 = __webpack_require__(/*! ./outline-view-service */ "../../packages/outline-view/lib/browser/outline-view-service.js");
const outline_view_contribution_1 = __webpack_require__(/*! ./outline-view-contribution */ "../../packages/outline-view/lib/browser/outline-view-contribution.js");
const widget_manager_1 = __webpack_require__(/*! @theia/core/lib/browser/widget-manager */ "../../packages/core/lib/browser/widget-manager.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const tab_bar_toolbar_1 = __webpack_require__(/*! @theia/core/lib/browser/shell/tab-bar-toolbar */ "../../packages/core/lib/browser/shell/tab-bar-toolbar/index.js");
const outline_view_widget_1 = __webpack_require__(/*! ./outline-view-widget */ "../../packages/outline-view/lib/browser/outline-view-widget.js");
__webpack_require__(/*! ../../src/browser/styles/index.css */ "../../packages/outline-view/src/browser/styles/index.css");
const contribution_provider_1 = __webpack_require__(/*! @theia/core/lib/common/contribution-provider */ "../../packages/core/lib/common/contribution-provider.js");
const outline_decorator_service_1 = __webpack_require__(/*! ./outline-decorator-service */ "../../packages/outline-view/lib/browser/outline-decorator-service.js");
const outline_view_tree_model_1 = __webpack_require__(/*! ./outline-view-tree-model */ "../../packages/outline-view/lib/browser/outline-view-tree-model.js");
const outline_breadcrumbs_contribution_1 = __webpack_require__(/*! ./outline-breadcrumbs-contribution */ "../../packages/outline-view/lib/browser/outline-breadcrumbs-contribution.js");
exports["default"] = new inversify_1.ContainerModule(bind => {
    bind(outline_view_widget_1.OutlineViewWidgetFactory).toFactory(ctx => () => createOutlineViewWidget(ctx.container));
    bind(outline_breadcrumbs_contribution_1.BreadcrumbPopupOutlineViewFactory).toFactory(({ container }) => () => {
        const child = createOutlineViewWidgetContainer(container);
        child.rebind(outline_view_widget_1.OutlineViewWidget).to(outline_breadcrumbs_contribution_1.BreadcrumbPopupOutlineView);
        child.rebind(browser_1.TreeProps).toConstantValue({ ...browser_1.defaultTreeProps, expandOnlyOnExpansionToggleClick: true, search: false, virtualized: false });
        return child.get(outline_view_widget_1.OutlineViewWidget);
    });
    bind(outline_view_service_1.OutlineViewService).toSelf().inSingletonScope();
    bind(widget_manager_1.WidgetFactory).toService(outline_view_service_1.OutlineViewService);
    (0, browser_1.bindViewContribution)(bind, outline_view_contribution_1.OutlineViewContribution);
    bind(browser_1.FrontendApplicationContribution).toService(outline_view_contribution_1.OutlineViewContribution);
    bind(tab_bar_toolbar_1.TabBarToolbarContribution).toService(outline_view_contribution_1.OutlineViewContribution);
    bind(outline_breadcrumbs_contribution_1.OutlineBreadcrumbsContribution).toSelf().inSingletonScope();
    bind(browser_1.BreadcrumbsContribution).toService(outline_breadcrumbs_contribution_1.OutlineBreadcrumbsContribution);
});
function createOutlineViewWidgetContainer(parent) {
    const child = (0, browser_1.createTreeContainer)(parent, {
        props: { expandOnlyOnExpansionToggleClick: true, search: true },
        widget: outline_view_widget_1.OutlineViewWidget,
        model: outline_view_tree_model_1.OutlineViewTreeModel,
        decoratorService: outline_decorator_service_1.OutlineDecoratorService,
    });
    (0, contribution_provider_1.bindContributionProvider)(child, outline_decorator_service_1.OutlineTreeDecorator);
    return child;
}
/**
 * Create an `OutlineViewWidget`.
 * - The creation of the `OutlineViewWidget` includes:
 *  - The creation of the tree widget itself with it's own customized props.
 *  - The binding of necessary components into the container.
 * @param parent the Inversify container.
 *
 * @returns the `OutlineViewWidget`.
 */
function createOutlineViewWidget(parent) {
    const child = createOutlineViewWidgetContainer(parent);
    return child.get(outline_view_widget_1.OutlineViewWidget);
}

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/outline-view/lib/browser/outline-view-frontend-module'] = this;


/***/ }),

/***/ "../../node_modules/css-loader/dist/cjs.js!../../packages/outline-view/src/browser/styles/index.css":
/*!**********************************************************************************************************!*\
  !*** ../../node_modules/css-loader/dist/cjs.js!../../packages/outline-view/src/browser/styles/index.css ***!
  \**********************************************************************************************************/
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
 * Copyright (C) 2017-2018 TypeFox and others.
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

.no-outline {
  color: var(--theia-foreground);
  text-align: left;
}

.theia-side-panel .no-outline {
  margin-left: 9px;
}
`, "",{"version":3,"sources":["webpack://./../../packages/outline-view/src/browser/styles/index.css"],"names":[],"mappings":"AAAA;;;;;;;;;;;;;;iFAciF;;AAEjF;EACE,8BAA8B;EAC9B,gBAAgB;AAClB;;AAEA;EACE,gBAAgB;AAClB","sourcesContent":["/********************************************************************************\n * Copyright (C) 2017-2018 TypeFox and others.\n *\n * This program and the accompanying materials are made available under the\n * terms of the Eclipse Public License v. 2.0 which is available at\n * http://www.eclipse.org/legal/epl-2.0.\n *\n * This Source Code may also be made available under the following Secondary\n * Licenses when the conditions for such availability set forth in the Eclipse\n * Public License v. 2.0 are satisfied: GNU General Public License, version 2\n * with the GNU Classpath Exception which is available at\n * https://www.gnu.org/software/classpath/license.html.\n *\n * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0\n ********************************************************************************/\n\n.no-outline {\n  color: var(--theia-foreground);\n  text-align: left;\n}\n\n.theia-side-panel .no-outline {\n  margin-left: 9px;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../packages/outline-view/src/browser/styles/index.css":
/*!****************************************************************!*\
  !*** ../../packages/outline-view/src/browser/styles/index.css ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/css-loader/dist/cjs.js!./index.css */ "../../node_modules/css-loader/dist/cjs.js!../../packages/outline-view/src/browser/styles/index.css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ })

}]);
//# sourceMappingURL=packages_core_shared_react_index_js-packages_core_shared_vscode-languageserver-protocol_index-f1ef8d.js.map