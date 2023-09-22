"use strict";
(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_outline-view_lib_browser_outline-decorator-service_js-packages_outline-view_lib_brow-c1335f"],{

/***/ "../../packages/outline-view/lib/browser/outline-decorator-service.js":
/*!****************************************************************************!*\
  !*** ../../packages/outline-view/lib/browser/outline-decorator-service.js ***!
  \****************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2018 Redhat, Ericsson and others.
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
exports.OutlineDecoratorService = exports.OutlineTreeDecorator = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const contribution_provider_1 = __webpack_require__(/*! @theia/core/lib/common/contribution-provider */ "../../packages/core/lib/common/contribution-provider.js");
const tree_decorator_1 = __webpack_require__(/*! @theia/core/lib/browser/tree/tree-decorator */ "../../packages/core/lib/browser/tree/tree-decorator.js");
/**
 * Symbol for all decorators that would like to contribute into the outline.
 */
exports.OutlineTreeDecorator = Symbol('OutlineTreeDecorator');
/**
 * Decorator service for the outline.
 */
let OutlineDecoratorService = class OutlineDecoratorService extends tree_decorator_1.AbstractTreeDecoratorService {
    constructor(contributions) {
        super(contributions.getContributions());
        this.contributions = contributions;
    }
};
OutlineDecoratorService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(contribution_provider_1.ContributionProvider)),
    __param(0, (0, inversify_1.named)(exports.OutlineTreeDecorator)),
    __metadata("design:paramtypes", [Object])
], OutlineDecoratorService);
exports.OutlineDecoratorService = OutlineDecoratorService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/outline-view/lib/browser/outline-decorator-service'] = this;


/***/ }),

/***/ "../../packages/outline-view/lib/browser/outline-view-service.js":
/*!***********************************************************************!*\
  !*** ../../packages/outline-view/lib/browser/outline-view-service.js ***!
  \***********************************************************************/
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
exports.OutlineViewService = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const outline_view_widget_1 = __webpack_require__(/*! ./outline-view-widget */ "../../packages/outline-view/lib/browser/outline-view-widget.js");
let OutlineViewService = class OutlineViewService {
    constructor(factory) {
        this.factory = factory;
        this.id = 'outline-view';
        this.onDidChangeOutlineEmitter = new core_1.Emitter();
        this.onDidChangeOpenStateEmitter = new core_1.Emitter();
        this.onDidSelectEmitter = new core_1.Emitter();
        this.onDidOpenEmitter = new core_1.Emitter();
    }
    get onDidSelect() {
        return this.onDidSelectEmitter.event;
    }
    get onDidOpen() {
        return this.onDidOpenEmitter.event;
    }
    get onDidChangeOutline() {
        return this.onDidChangeOutlineEmitter.event;
    }
    get onDidChangeOpenState() {
        return this.onDidChangeOpenStateEmitter.event;
    }
    get open() {
        return this.widget !== undefined && this.widget.isVisible;
    }
    /**
     * Publish the collection of outline view symbols.
     * - Publishing includes setting the `OutlineViewWidget` tree with symbol information.
     * @param roots the list of outline symbol information nodes.
     */
    publish(roots) {
        if (this.widget) {
            this.widget.setOutlineTree(roots);
        }
        // onDidChangeOutline needs to be fired even when the outline view widget is closed
        // in order to update breadcrumbs.
        this.onDidChangeOutlineEmitter.fire(roots);
    }
    createWidget() {
        this.widget = this.factory();
        const disposables = new core_1.DisposableCollection();
        disposables.push(this.widget.onDidChangeOpenStateEmitter.event(open => this.onDidChangeOpenStateEmitter.fire(open)));
        disposables.push(this.widget.model.onOpenNode(node => this.onDidOpenEmitter.fire(node)));
        disposables.push(this.widget.model.onSelectionChanged(selection => this.onDidSelectEmitter.fire(selection[0])));
        this.widget.disposed.connect(() => {
            this.widget = undefined;
            disposables.dispose();
        });
        return Promise.resolve(this.widget);
    }
};
OutlineViewService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(outline_view_widget_1.OutlineViewWidgetFactory)),
    __metadata("design:paramtypes", [Function])
], OutlineViewService);
exports.OutlineViewService = OutlineViewService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/outline-view/lib/browser/outline-view-service'] = this;


/***/ }),

/***/ "../../packages/outline-view/lib/browser/outline-view-tree-model.js":
/*!**************************************************************************!*\
  !*** ../../packages/outline-view/lib/browser/outline-view-tree-model.js ***!
  \**************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2019 Ericsson and others.
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
exports.OutlineViewTreeModel = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
let OutlineViewTreeModel = class OutlineViewTreeModel extends browser_1.TreeModelImpl {
    /**
     * Handle the expansion of the tree node.
     * - The method is a no-op in order to preserve focus on the editor
     * after attempting to perform a `collapse-all`.
     * @param node the expandable tree node.
     */
    handleExpansion(node) {
        // no-op
    }
    async collapseAll(raw) {
        const node = raw || this.getFocusedNode();
        if (browser_1.CompositeTreeNode.is(node)) {
            return this.expansionService.collapseAll(node);
        }
        return false;
    }
    /**
     * The default behavior of `openNode` calls `doOpenNode` which by default
     * toggles the expansion of the node. Overriding to prevent expansion, but
     * allow for the `onOpenNode` event to still fire on a double-click event.
     */
    openNode(raw) {
        const node = raw || this.getFocusedNode();
        if (node) {
            this.onOpenNodeEmitter.fire(node);
        }
    }
    expandAll(raw) {
        if (browser_1.CompositeTreeNode.is(raw)) {
            for (const child of raw.children) {
                if (browser_1.ExpandableTreeNode.is(child)) {
                    this.expandAll(child);
                }
            }
        }
        if (browser_1.ExpandableTreeNode.is(raw)) {
            this.expandNode(raw);
        }
    }
    areNodesCollapsed() {
        if (browser_1.CompositeTreeNode.is(this.root)) {
            for (const child of this.root.children) {
                if (!browser_1.ExpandableTreeNode.isCollapsed(child)) {
                    return false;
                }
            }
        }
        return true;
    }
};
OutlineViewTreeModel = __decorate([
    (0, inversify_1.injectable)()
], OutlineViewTreeModel);
exports.OutlineViewTreeModel = OutlineViewTreeModel;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/outline-view/lib/browser/outline-view-tree-model'] = this;


/***/ }),

/***/ "../../packages/outline-view/lib/browser/outline-view-widget.js":
/*!**********************************************************************!*\
  !*** ../../packages/outline-view/lib/browser/outline-view-widget.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2017-2018 TypeFox and others.
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
var OutlineViewWidget_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OutlineViewWidget = exports.OutlineViewWidgetFactory = exports.OutlineSymbolInformationNode = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const outline_view_tree_model_1 = __webpack_require__(/*! ./outline-view-tree-model */ "../../packages/outline-view/lib/browser/outline-view-tree-model.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const vscode_languageserver_protocol_1 = __webpack_require__(/*! @theia/core/shared/vscode-languageserver-protocol */ "../../packages/core/shared/vscode-languageserver-protocol/index.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
/**
 * Collection of outline symbol information node functions.
 */
var OutlineSymbolInformationNode;
(function (OutlineSymbolInformationNode) {
    /**
     * Determine if the given tree node is an `OutlineSymbolInformationNode`.
     * - The tree node is an `OutlineSymbolInformationNode` if:
     *  - The node exists.
     *  - The node is selectable.
     *  - The node contains a defined `iconClass` property.
     * @param node the tree node.
     *
     * @returns `true` if the given node is an `OutlineSymbolInformationNode`.
     */
    function is(node) {
        return !!node && browser_1.SelectableTreeNode.is(node) && 'iconClass' in node;
    }
    OutlineSymbolInformationNode.is = is;
    function hasRange(node) {
        return (0, core_1.isObject)(node) && vscode_languageserver_protocol_1.Range.is(node.range);
    }
    OutlineSymbolInformationNode.hasRange = hasRange;
})(OutlineSymbolInformationNode = exports.OutlineSymbolInformationNode || (exports.OutlineSymbolInformationNode = {}));
exports.OutlineViewWidgetFactory = Symbol('OutlineViewWidgetFactory');
let OutlineViewWidget = OutlineViewWidget_1 = class OutlineViewWidget extends browser_1.TreeWidget {
    constructor(treeProps, model, contextMenuRenderer) {
        super(treeProps, model, contextMenuRenderer);
        this.model = model;
        this.onDidChangeOpenStateEmitter = new core_1.Emitter();
        this.onDidUpdateEmitter = new core_1.Emitter();
        this.onDidUpdate = this.onDidUpdateEmitter.event;
        this.id = 'outline-view';
        this.title.label = OutlineViewWidget_1.LABEL;
        this.title.caption = OutlineViewWidget_1.LABEL;
        this.title.closable = true;
        this.title.iconClass = (0, browser_1.codicon)('symbol-class');
        this.addClass('theia-outline-view');
    }
    init() {
        super.init();
        this.toDispose.push(this.model.onExpansionChanged(() => this.onDidUpdateEmitter.fire()));
    }
    /**
     * Set the outline tree with the list of `OutlineSymbolInformationNode`.
     * @param roots the list of `OutlineSymbolInformationNode`.
     */
    setOutlineTree(roots) {
        // Gather the list of available nodes.
        const nodes = this.reconcileTreeState(roots);
        // Update the model root node, appending the outline symbol information nodes as children.
        this.model.root = this.getRoot(nodes);
    }
    getRoot(children) {
        return {
            id: 'outline-view-root',
            name: OutlineViewWidget_1.LABEL,
            visible: false,
            children,
            parent: undefined
        };
    }
    /**
     * Reconcile the outline tree state, gathering all available nodes.
     * @param nodes the list of `TreeNode`.
     *
     * @returns the list of tree nodes.
     */
    reconcileTreeState(nodes) {
        nodes.forEach(node => {
            if (OutlineSymbolInformationNode.is(node)) {
                const treeNode = this.model.getNode(node.id);
                if (treeNode && OutlineSymbolInformationNode.is(treeNode)) {
                    treeNode.expanded = node.expanded;
                    treeNode.selected = node.selected;
                }
                this.reconcileTreeState(Array.from(node.children));
            }
        });
        return nodes;
    }
    onAfterHide(msg) {
        super.onAfterHide(msg);
        this.onDidChangeOpenStateEmitter.fire(false);
    }
    onAfterShow(msg) {
        super.onAfterShow(msg);
        this.onDidChangeOpenStateEmitter.fire(true);
    }
    renderIcon(node, props) {
        if (OutlineSymbolInformationNode.is(node)) {
            return React.createElement("div", { className: 'symbol-icon-center codicon codicon-symbol-' + node.iconClass });
        }
        return undefined;
    }
    createNodeAttributes(node, props) {
        const elementAttrs = super.createNodeAttributes(node, props);
        return {
            ...elementAttrs,
            title: this.getNodeTooltip(node)
        };
    }
    /**
     * Get the tooltip for the given tree node.
     * - The tooltip is discovered when hovering over a tree node.
     * - If available, the tooltip is the concatenation of the node name, and it's type.
     * @param node the tree node.
     *
     * @returns the tooltip for the tree node if available, else `undefined`.
     */
    getNodeTooltip(node) {
        if (OutlineSymbolInformationNode.is(node)) {
            return node.name + ` (${node.iconClass})`;
        }
        return undefined;
    }
    isExpandable(node) {
        return OutlineSymbolInformationNode.is(node) && node.children.length > 0;
    }
    renderTree(model) {
        if (browser_1.CompositeTreeNode.is(this.model.root) && !this.model.root.children.length) {
            return React.createElement("div", { className: 'theia-widget-noInfo no-outline' }, nls_1.nls.localizeByDefault('The active editor cannot provide outline information.'));
        }
        return super.renderTree(model);
    }
    deflateForStorage(node) {
        const deflated = super.deflateForStorage(node);
        if (core_1.UriSelection.is(node)) {
            deflated.uri = node.uri.toString();
        }
        return deflated;
    }
    inflateFromStorage(node, parent) {
        const inflated = super.inflateFromStorage(node, parent);
        if (node && 'uri' in node && typeof node.uri === 'string') {
            inflated.uri = new uri_1.default(node.uri);
        }
        return inflated;
    }
};
OutlineViewWidget.LABEL = nls_1.nls.localizeByDefault('Outline');
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OutlineViewWidget.prototype, "init", null);
OutlineViewWidget = OutlineViewWidget_1 = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(browser_1.TreeProps)),
    __param(1, (0, inversify_1.inject)(outline_view_tree_model_1.OutlineViewTreeModel)),
    __param(2, (0, inversify_1.inject)(browser_1.ContextMenuRenderer)),
    __metadata("design:paramtypes", [Object, outline_view_tree_model_1.OutlineViewTreeModel,
        browser_1.ContextMenuRenderer])
], OutlineViewWidget);
exports.OutlineViewWidget = OutlineViewWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/outline-view/lib/browser/outline-view-widget'] = this;


/***/ })

}]);
//# sourceMappingURL=packages_outline-view_lib_browser_outline-decorator-service_js-packages_outline-view_lib_brow-c1335f.js.map