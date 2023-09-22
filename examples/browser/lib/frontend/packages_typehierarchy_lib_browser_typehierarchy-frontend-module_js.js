"use strict";
(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_typehierarchy_lib_browser_typehierarchy-frontend-module_js"],{

/***/ "../../packages/typehierarchy/lib/browser/tree/typehierarchy-tree-container.js":
/*!*************************************************************************************!*\
  !*** ../../packages/typehierarchy/lib/browser/tree/typehierarchy-tree-container.js ***!
  \*************************************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createHierarchyTreeWidget = void 0;
const tree_1 = __webpack_require__(/*! @theia/core/lib/browser/tree */ "../../packages/core/lib/browser/tree/index.js");
const typehierarchy_tree_1 = __webpack_require__(/*! ./typehierarchy-tree */ "../../packages/typehierarchy/lib/browser/tree/typehierarchy-tree.js");
const typehierarchy_tree_model_1 = __webpack_require__(/*! ./typehierarchy-tree-model */ "../../packages/typehierarchy/lib/browser/tree/typehierarchy-tree-model.js");
const typehierarchy_tree_widget_1 = __webpack_require__(/*! ./typehierarchy-tree-widget */ "../../packages/typehierarchy/lib/browser/tree/typehierarchy-tree-widget.js");
function createHierarchyTreeContainer(parent) {
    const child = (0, tree_1.createTreeContainer)(parent, {
        tree: typehierarchy_tree_1.TypeHierarchyTree,
        model: typehierarchy_tree_model_1.TypeHierarchyTreeModel,
        widget: typehierarchy_tree_widget_1.TypeHierarchyTreeWidget
    });
    return child;
}
function createHierarchyTreeWidget(parent) {
    return createHierarchyTreeContainer(parent).get(typehierarchy_tree_widget_1.TypeHierarchyTreeWidget);
}
exports.createHierarchyTreeWidget = createHierarchyTreeWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/typehierarchy/lib/browser/tree/typehierarchy-tree-container'] = this;


/***/ }),

/***/ "../../packages/typehierarchy/lib/browser/tree/typehierarchy-tree-model.js":
/*!*********************************************************************************!*\
  !*** ../../packages/typehierarchy/lib/browser/tree/typehierarchy-tree-model.js ***!
  \*********************************************************************************/
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
exports.TypeHierarchyTreeModel = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const tree_model_1 = __webpack_require__(/*! @theia/core/lib/browser/tree/tree-model */ "../../packages/core/lib/browser/tree/tree-model.js");
const typehierarchy_provider_1 = __webpack_require__(/*! ../typehierarchy-provider */ "../../packages/typehierarchy/lib/browser/typehierarchy-provider.js");
const typehierarchy_tree_1 = __webpack_require__(/*! ./typehierarchy-tree */ "../../packages/typehierarchy/lib/browser/tree/typehierarchy-tree.js");
let TypeHierarchyTreeModel = class TypeHierarchyTreeModel extends tree_model_1.TreeModelImpl {
    doOpenNode(node) {
        // do nothing (in particular do not expand the node)
    }
    /**
     * Initializes the tree by calculating and setting a new tree root node.
     */
    async initialize(options) {
        this.tree.root = undefined;
        this.tree.provider = undefined;
        const { location, languageId, direction } = options;
        if (languageId && location) {
            const provider = await this.registry.get(languageId);
            if (provider) {
                const params = {
                    textDocument: {
                        uri: location.uri
                    },
                    position: location.range.start,
                    direction,
                    resolve: 1
                };
                const symbol = await provider.get(params);
                if (symbol) {
                    const root = typehierarchy_tree_1.TypeHierarchyTree.RootNode.create(symbol, direction);
                    root.expanded = true;
                    this.tree.root = root;
                    this.tree.provider = provider;
                }
            }
        }
    }
    /**
     * If the tree root is set, it resets it with the inverse type hierarchy direction.
     */
    async flipDirection() {
        const { root } = this.tree;
        const service = this.tree.provider;
        if (typehierarchy_tree_1.TypeHierarchyTree.RootNode.is(root) && !!service) {
            const { direction, item } = root;
            const { uri, selectionRange } = item;
            const location = {
                uri,
                range: selectionRange
            };
            this.initialize({
                direction: direction === 0 /* Children */ ? 1 /* Parents */ : 0 /* Children */,
                location,
                languageId: service.languageId
            });
        }
    }
};
__decorate([
    (0, inversify_1.inject)(typehierarchy_provider_1.TypeHierarchyRegistry),
    __metadata("design:type", typehierarchy_provider_1.TypeHierarchyRegistry)
], TypeHierarchyTreeModel.prototype, "registry", void 0);
TypeHierarchyTreeModel = __decorate([
    (0, inversify_1.injectable)()
], TypeHierarchyTreeModel);
exports.TypeHierarchyTreeModel = TypeHierarchyTreeModel;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/typehierarchy/lib/browser/tree/typehierarchy-tree-model'] = this;


/***/ }),

/***/ "../../packages/typehierarchy/lib/browser/tree/typehierarchy-tree-widget.js":
/*!**********************************************************************************!*\
  !*** ../../packages/typehierarchy/lib/browser/tree/typehierarchy-tree-widget.js ***!
  \**********************************************************************************/
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var TypeHierarchyTreeWidget_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TypeHierarchyTreeWidget = void 0;
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const widgets_1 = __webpack_require__(/*! @theia/core/shared/@phosphor/widgets */ "../../packages/core/shared/@phosphor/widgets/index.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const vscode_languageserver_protocol_1 = __webpack_require__(/*! @theia/core/shared/vscode-languageserver-protocol */ "../../packages/core/shared/vscode-languageserver-protocol/index.js");
const editor_manager_1 = __webpack_require__(/*! @theia/editor/lib/browser/editor-manager */ "../../packages/editor/lib/browser/editor-manager.js");
const context_menu_renderer_1 = __webpack_require__(/*! @theia/core/lib/browser/context-menu-renderer */ "../../packages/core/lib/browser/context-menu-renderer.js");
const tree_widget_1 = __webpack_require__(/*! @theia/core/lib/browser/tree/tree-widget */ "../../packages/core/lib/browser/tree/tree-widget.js");
const typehierarchy_tree_model_1 = __webpack_require__(/*! ./typehierarchy-tree-model */ "../../packages/typehierarchy/lib/browser/tree/typehierarchy-tree-model.js");
const typehierarchy_tree_1 = __webpack_require__(/*! ./typehierarchy-tree */ "../../packages/typehierarchy/lib/browser/tree/typehierarchy-tree.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
let TypeHierarchyTreeWidget = TypeHierarchyTreeWidget_1 = class TypeHierarchyTreeWidget extends tree_widget_1.TreeWidget {
    constructor(props, model, contextMenuRenderer) {
        super(props, model, contextMenuRenderer);
        this.model = model;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.icons = new Map(Array.from(Object.keys(vscode_languageserver_protocol_1.SymbolKind)).map(key => [vscode_languageserver_protocol_1.SymbolKind[key], key.toLocaleLowerCase()]));
        this.id = TypeHierarchyTreeWidget_1.WIDGET_ID;
        this.title.label = TypeHierarchyTreeWidget_1.WIDGET_LABEL;
        this.title.caption = TypeHierarchyTreeWidget_1.WIDGET_LABEL;
        this.addClass(TypeHierarchyTreeWidget_1.Styles.TYPE_HIERARCHY_TREE_CLASS);
        this.title.closable = true;
        this.title.iconClass = (0, browser_1.codicon)('type-hierarchy');
        this.toDispose.push(this.model.onSelectionChanged(selection => {
            const node = selection[0];
            if (node) {
                this.openEditor(node, true);
            }
        }));
        this.toDispose.push(this.model.onOpenNode(node => this.openEditor(node)));
    }
    /**
     * Initializes the widget with the new input.
     */
    async initialize(options) {
        await this.model.initialize(options);
    }
    /**
     * See: `TreeWidget#renderIcon`.
     */
    renderIcon(node) {
        if (typehierarchy_tree_1.TypeHierarchyTree.Node.is(node)) {
            return React.createElement("div", { className: 'symbol-icon-center codicon codicon-symbol-' + this.icons.get(node.item.kind) || 0 });
        }
        return undefined;
    }
    /**
     * Opens up the node in the editor. On demand (`keepFocus`) it reveals the location in the editor.
     */
    async openEditor(node, keepFocus = false) {
        if (typehierarchy_tree_1.TypeHierarchyTree.Node.is(node)) {
            const { selectionRange, uri } = node.item;
            const editorWidget = await this.editorManager.open(new uri_1.default(uri), {
                mode: keepFocus ? 'reveal' : 'activate',
                selection: vscode_languageserver_protocol_1.Range.create(selectionRange.start, selectionRange.end)
            });
            if (editorWidget.parent instanceof widgets_1.DockPanel) {
                editorWidget.parent.selectWidget(editorWidget);
            }
        }
    }
};
__decorate([
    (0, inversify_1.inject)(editor_manager_1.EditorManager),
    __metadata("design:type", editor_manager_1.EditorManager)
], TypeHierarchyTreeWidget.prototype, "editorManager", void 0);
TypeHierarchyTreeWidget = TypeHierarchyTreeWidget_1 = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(tree_widget_1.TreeProps)),
    __param(1, (0, inversify_1.inject)(typehierarchy_tree_model_1.TypeHierarchyTreeModel)),
    __param(2, (0, inversify_1.inject)(context_menu_renderer_1.ContextMenuRenderer)),
    __metadata("design:paramtypes", [Object, typehierarchy_tree_model_1.TypeHierarchyTreeModel,
        context_menu_renderer_1.ContextMenuRenderer])
], TypeHierarchyTreeWidget);
exports.TypeHierarchyTreeWidget = TypeHierarchyTreeWidget;
(function (TypeHierarchyTreeWidget) {
    TypeHierarchyTreeWidget.WIDGET_ID = 'theia-typehierarchy';
    TypeHierarchyTreeWidget.WIDGET_LABEL = nls_1.nls.localizeByDefault('Type Hierarchy');
    /**
     * CSS styles for the `Type Hierarchy` widget.
     */
    let Styles;
    (function (Styles) {
        Styles.TYPE_HIERARCHY_TREE_CLASS = 'theia-type-hierarchy-tree';
    })(Styles = TypeHierarchyTreeWidget.Styles || (TypeHierarchyTreeWidget.Styles = {}));
})(TypeHierarchyTreeWidget = exports.TypeHierarchyTreeWidget || (exports.TypeHierarchyTreeWidget = {}));
exports.TypeHierarchyTreeWidget = TypeHierarchyTreeWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/typehierarchy/lib/browser/tree/typehierarchy-tree-widget'] = this;


/***/ }),

/***/ "../../packages/typehierarchy/lib/browser/tree/typehierarchy-tree.js":
/*!***************************************************************************!*\
  !*** ../../packages/typehierarchy/lib/browser/tree/typehierarchy-tree.js ***!
  \***************************************************************************/
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
var TypeHierarchyTree_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TypeHierarchyTree = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const uuid_1 = __webpack_require__(/*! uuid */ "../../node_modules/uuid/dist/esm-browser/index.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const editor_1 = __webpack_require__(/*! @theia/editor/lib/browser/editor */ "../../packages/editor/lib/browser/editor.js");
const tree_1 = __webpack_require__(/*! @theia/core/lib/browser/tree */ "../../packages/core/lib/browser/tree/index.js");
let TypeHierarchyTree = TypeHierarchyTree_1 = class TypeHierarchyTree extends tree_1.TreeImpl {
    async resolveChildren(parent) {
        if (TypeHierarchyTree_1.Node.is(parent)) {
            await this.ensureResolved(parent);
            if (parent.children.length === 0) {
                delete parent.children;
                delete parent.expanded;
                return [];
            }
            return parent.children.slice();
        }
        return [];
    }
    /**
     * Returns with the direction of the type hierarchy attached to the root node. `undefined` if the root is not set.
     */
    get direction() {
        if (TypeHierarchyTree_1.RootNode.is(this.root)) {
            return this.root.direction;
        }
        return undefined;
    }
    /**
     * Makes sure, the node and its children are resolved. Resolves it on demand.
     */
    async ensureResolved(node) {
        if (!node.resolved) {
            const { provider, direction } = this;
            if (provider && direction !== undefined) {
                const { item } = node;
                const param = {
                    item,
                    direction,
                    resolve: 1
                };
                const resolvedItem = await provider.resolve(param);
                if (resolvedItem) {
                    node.resolved = true;
                    const items = 0 /* Children */ === direction ? resolvedItem.children : resolvedItem.parents;
                    if (items) {
                        node.children = items.map(child => TypeHierarchyTree_1.Node.create(child, direction, false));
                    }
                    else {
                        node.children = [];
                    }
                }
            }
        }
    }
};
TypeHierarchyTree = TypeHierarchyTree_1 = __decorate([
    (0, inversify_1.injectable)()
], TypeHierarchyTree);
exports.TypeHierarchyTree = TypeHierarchyTree;
(function (TypeHierarchyTree) {
    let RootNode;
    (function (RootNode) {
        function is(node) {
            if (Node.is(node) && 'direction' in node) {
                const { direction } = node;
                return direction === 0 /* Children */ || direction === 1 /* Parents */;
            }
            return false;
        }
        RootNode.is = is;
        function create(item, direction) {
            return {
                ...Node.create(item, direction, true),
                direction
            };
        }
        RootNode.create = create;
    })(RootNode = TypeHierarchyTree.RootNode || (TypeHierarchyTree.RootNode = {}));
    let Node;
    (function (Node) {
        function is(node) {
            if (!!node && 'resolved' in node && 'item' in node) {
                const { resolved, item } = node;
                return typeof resolved === 'boolean' && !!item;
            }
            return false;
        }
        Node.is = is;
        function create(item, direction, resolved = true) {
            const items = 0 /* Children */ === direction ? item.children : item.parents;
            if (items && items.length > 0) {
                // If the server sent more levels than requested, use them.
                resolved = true;
            }
            const node = {
                id: (0, uuid_1.v4)(),
                name: item.name,
                description: item.detail,
                parent: undefined,
                location: editor_1.Location.create(item.uri, item.selectionRange),
                resolved,
                children: items ? items.map(child => create(child, direction, false)) : [],
                expanded: false,
                visible: true,
                selected: false,
                kind: item.kind,
                decorationData: decorationData(item, direction),
                item
            };
            // Trick: if the node is `resolved` and have zero `children`, make the node non-expandable.
            if (resolved && node.children.length === 0) {
                delete node.expanded;
            }
            return node;
        }
        Node.create = create;
        function decorationData(item, direction) {
            const captionSuffixes = [{
                    data: new uri_1.default(item.uri).displayName,
                    fontData: {
                        color: 'var(--theia-descriptionForeground)',
                    }
                }];
            if (item.detail) {
                captionSuffixes.unshift({
                    data: item.detail,
                    fontData: {
                        color: 'var(--theia-list-highlightForeground)',
                        style: 'italic'
                    }
                });
            }
            const data = `${0 /* Children */ === direction ? '▼' : '▲'}`;
            const color = `var(${0 /* Children */ === direction ? '--theia-errorForeground' : '--theia-successBackground'})`;
            return {
                captionSuffixes,
                captionPrefixes: [{
                        data,
                        fontData: {
                            color,
                            style: 'bold'
                        }
                    }]
            };
        }
    })(Node = TypeHierarchyTree.Node || (TypeHierarchyTree.Node = {}));
})(TypeHierarchyTree = exports.TypeHierarchyTree || (exports.TypeHierarchyTree = {}));
exports.TypeHierarchyTree = TypeHierarchyTree;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/typehierarchy/lib/browser/tree/typehierarchy-tree'] = this;


/***/ }),

/***/ "../../packages/typehierarchy/lib/browser/typehierarchy-contribution.js":
/*!******************************************************************************!*\
  !*** ../../packages/typehierarchy/lib/browser/typehierarchy-contribution.js ***!
  \******************************************************************************/
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
exports.TypeHierarchyCommands = exports.TypeHierarchyContribution = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const shell_1 = __webpack_require__(/*! @theia/core/lib/browser/shell */ "../../packages/core/lib/browser/shell/index.js");
const command_1 = __webpack_require__(/*! @theia/core/lib/common/command */ "../../packages/core/lib/common/command.js");
const editor_menu_1 = __webpack_require__(/*! @theia/editor/lib/browser/editor-menu */ "../../packages/editor/lib/browser/editor-menu.js");
const editor_manager_1 = __webpack_require__(/*! @theia/editor/lib/browser/editor-manager */ "../../packages/editor/lib/browser/editor-manager.js");
const view_contribution_1 = __webpack_require__(/*! @theia/core/lib/browser/shell/view-contribution */ "../../packages/core/lib/browser/shell/view-contribution.js");
const typehierarchy_tree_1 = __webpack_require__(/*! ./tree/typehierarchy-tree */ "../../packages/typehierarchy/lib/browser/tree/typehierarchy-tree.js");
const typehierarchy_tree_widget_1 = __webpack_require__(/*! ./tree/typehierarchy-tree-widget */ "../../packages/typehierarchy/lib/browser/tree/typehierarchy-tree-widget.js");
const typehierarchy_service_1 = __webpack_require__(/*! ./typehierarchy-service */ "../../packages/typehierarchy/lib/browser/typehierarchy-service.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const context_key_service_1 = __webpack_require__(/*! @theia/core/lib/browser/context-key-service */ "../../packages/core/lib/browser/context-key-service.js");
let TypeHierarchyContribution = class TypeHierarchyContribution extends view_contribution_1.AbstractViewContribution {
    constructor() {
        super({
            widgetId: typehierarchy_tree_widget_1.TypeHierarchyTreeWidget.WIDGET_ID,
            widgetName: typehierarchy_tree_widget_1.TypeHierarchyTreeWidget.WIDGET_LABEL,
            defaultWidgetOptions: {
                area: 'bottom'
            },
            toggleCommandId: TypeHierarchyCommands.TOGGLE_VIEW.id,
            toggleKeybinding: 'ctrlcmd+shift+h'
        });
    }
    init() {
        this.editorHasTypeHierarchyProvider = this.contextKeyService.createKey('editorHasTypeHierarchyProvider', false);
        this.editorManager.onCurrentEditorChanged(() => this.editorHasTypeHierarchyProvider.set(this.isTypeHierarchyAvailable()));
        this.typeHierarchyServiceProvider.onDidChange(() => this.editorHasTypeHierarchyProvider.set(this.isTypeHierarchyAvailable()));
    }
    isTypeHierarchyAvailable() {
        const { selection, languageId } = this.editorAccess;
        return !!selection && !!languageId && !!this.typeHierarchyServiceProvider.get(languageId, new uri_1.default(selection.uri));
    }
    async openView(args) {
        const widget = await super.openView(args);
        const { selection, languageId } = this.editorAccess;
        const direction = this.getDirection(args);
        await widget.initialize({ location: selection, languageId, direction });
        return widget;
    }
    registerCommands(commands) {
        super.registerCommands(commands);
        commands.registerCommand(TypeHierarchyCommands.OPEN_SUBTYPE, {
            execute: () => this.openViewOrFlipHierarchyDirection(0 /* Children */),
            isEnabled: this.isEnabled.bind(this)
        });
        commands.registerCommand(TypeHierarchyCommands.OPEN_SUPERTYPE, {
            execute: () => this.openViewOrFlipHierarchyDirection(1 /* Parents */),
            isEnabled: this.isEnabled.bind(this)
        });
    }
    registerMenus(menus) {
        super.registerMenus(menus);
        const menuPath = [...editor_menu_1.EDITOR_CONTEXT_MENU, 'type-hierarchy'];
        menus.registerMenuAction(menuPath, {
            commandId: TypeHierarchyCommands.OPEN_SUBTYPE.id
        });
        menus.registerMenuAction(menuPath, {
            commandId: TypeHierarchyCommands.OPEN_SUPERTYPE.id
        });
    }
    registerKeybindings(keybindings) {
        super.registerKeybindings(keybindings);
        keybindings.registerKeybinding({
            command: TypeHierarchyCommands.OPEN_SUBTYPE.id,
            keybinding: 'ctrlcmd+alt+h'
        });
    }
    /**
     * Flips the hierarchy direction in the `Type Hierarchy` view, if it is active and has a valid root.
     * Otherwise, calculates the type hierarchy based on the selection of the current editor.
     */
    async openViewOrFlipHierarchyDirection(direction) {
        if (this.isEnabled()) {
            const { activeWidget } = this.shell;
            if (activeWidget instanceof typehierarchy_tree_widget_1.TypeHierarchyTreeWidget && typehierarchy_tree_1.TypeHierarchyTree.RootNode.is(activeWidget.model.root)) {
                await activeWidget.model.flipDirection();
            }
            else {
                await this.openView({
                    toggle: false,
                    activate: true,
                    direction
                });
            }
        }
    }
    /**
     * Enabled if the `current` editor has the `languageId` or the `Type Hierarchy` widget is the active one.
     */
    isEnabled(languageId = this.editorAccess.languageId) {
        return !!languageId || this.shell.activeWidget instanceof typehierarchy_tree_widget_1.TypeHierarchyTreeWidget;
    }
    /**
     * Extracts the type hierarchy direction from the argument. If the direction cannot be extracted, returns with the `Children` as the default type.
     */
    getDirection(args) {
        return !!args && !!args.direction ? args.direction : 0 /* Children */;
    }
};
__decorate([
    (0, inversify_1.inject)(shell_1.ApplicationShell),
    __metadata("design:type", shell_1.ApplicationShell)
], TypeHierarchyContribution.prototype, "shell", void 0);
__decorate([
    (0, inversify_1.inject)(editor_manager_1.EditorAccess),
    (0, inversify_1.named)(editor_manager_1.EditorAccess.CURRENT),
    __metadata("design:type", editor_manager_1.EditorAccess)
], TypeHierarchyContribution.prototype, "editorAccess", void 0);
__decorate([
    (0, inversify_1.inject)(editor_manager_1.EditorManager),
    __metadata("design:type", editor_manager_1.EditorManager)
], TypeHierarchyContribution.prototype, "editorManager", void 0);
__decorate([
    (0, inversify_1.inject)(context_key_service_1.ContextKeyService),
    __metadata("design:type", Object)
], TypeHierarchyContribution.prototype, "contextKeyService", void 0);
__decorate([
    (0, inversify_1.inject)(typehierarchy_service_1.TypeHierarchyServiceProvider),
    __metadata("design:type", typehierarchy_service_1.TypeHierarchyServiceProvider)
], TypeHierarchyContribution.prototype, "typeHierarchyServiceProvider", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TypeHierarchyContribution.prototype, "init", null);
TypeHierarchyContribution = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], TypeHierarchyContribution);
exports.TypeHierarchyContribution = TypeHierarchyContribution;
var TypeHierarchyCommands;
(function (TypeHierarchyCommands) {
    TypeHierarchyCommands.TOGGLE_VIEW = {
        id: 'typehierarchy:toggle'
    };
    TypeHierarchyCommands.OPEN_SUBTYPE = command_1.Command.toLocalizedCommand({
        id: 'typehierarchy:open-subtype',
        label: 'Subtype Hierarchy'
    }, 'theia/typehierarchy/subtypeHierarchy');
    TypeHierarchyCommands.OPEN_SUPERTYPE = command_1.Command.toLocalizedCommand({
        id: 'typehierarchy:open-supertype',
        label: 'Supertype Hierarchy'
    }, 'theia/typehierarchy/supertypeHierarchy');
})(TypeHierarchyCommands = exports.TypeHierarchyCommands || (exports.TypeHierarchyCommands = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/typehierarchy/lib/browser/typehierarchy-contribution'] = this;


/***/ }),

/***/ "../../packages/typehierarchy/lib/browser/typehierarchy-frontend-module.js":
/*!*********************************************************************************!*\
  !*** ../../packages/typehierarchy/lib/browser/typehierarchy-frontend-module.js ***!
  \*********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
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
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const widget_manager_1 = __webpack_require__(/*! @theia/core/lib/browser/widget-manager */ "../../packages/core/lib/browser/widget-manager.js");
const view_contribution_1 = __webpack_require__(/*! @theia/core/lib/browser/shell/view-contribution */ "../../packages/core/lib/browser/shell/view-contribution.js");
const typehierarchy_provider_1 = __webpack_require__(/*! ./typehierarchy-provider */ "../../packages/typehierarchy/lib/browser/typehierarchy-provider.js");
const typehierarchy_contribution_1 = __webpack_require__(/*! ./typehierarchy-contribution */ "../../packages/typehierarchy/lib/browser/typehierarchy-contribution.js");
const typehierarchy_tree_widget_1 = __webpack_require__(/*! ./tree/typehierarchy-tree-widget */ "../../packages/typehierarchy/lib/browser/tree/typehierarchy-tree-widget.js");
const typehierarchy_service_1 = __webpack_require__(/*! ./typehierarchy-service */ "../../packages/typehierarchy/lib/browser/typehierarchy-service.js");
const typehierarchy_tree_container_1 = __webpack_require__(/*! ./tree/typehierarchy-tree-container */ "../../packages/typehierarchy/lib/browser/tree/typehierarchy-tree-container.js");
__webpack_require__(/*! ../../src/browser/style/index.css */ "../../packages/typehierarchy/src/browser/style/index.css");
exports["default"] = new inversify_1.ContainerModule(bind => {
    (0, common_1.bindContributionProvider)(bind, typehierarchy_service_1.TypeHierarchyService);
    bind(typehierarchy_service_1.TypeHierarchyServiceProvider).to(typehierarchy_service_1.TypeHierarchyServiceProvider).inSingletonScope();
    bind(typehierarchy_provider_1.TypeHierarchyRegistry).toSelf().inSingletonScope();
    (0, view_contribution_1.bindViewContribution)(bind, typehierarchy_contribution_1.TypeHierarchyContribution);
    bind(widget_manager_1.WidgetFactory).toDynamicValue(context => ({
        id: typehierarchy_tree_widget_1.TypeHierarchyTreeWidget.WIDGET_ID,
        createWidget: () => (0, typehierarchy_tree_container_1.createHierarchyTreeWidget)(context.container)
    }));
});

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/typehierarchy/lib/browser/typehierarchy-frontend-module'] = this;


/***/ }),

/***/ "../../packages/typehierarchy/lib/browser/typehierarchy-provider.js":
/*!**************************************************************************!*\
  !*** ../../packages/typehierarchy/lib/browser/typehierarchy-provider.js ***!
  \**************************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TypeHierarchyRegistry = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
let TypeHierarchyRegistry = class TypeHierarchyRegistry {
    constructor() {
        this.providers = new Map();
    }
    async get(languageId) {
        return languageId ? this.providers.get(languageId) : undefined;
    }
    register(provider) {
        const { languageId } = provider;
        if (this.providers.has(languageId)) {
            throw new Error(`type hierarchy provider for '${languageId}' language is already registered`);
        }
        this.providers.set(languageId, provider);
        return disposable_1.Disposable.create(() => this.providers.delete(languageId));
    }
};
TypeHierarchyRegistry = __decorate([
    (0, inversify_1.injectable)()
], TypeHierarchyRegistry);
exports.TypeHierarchyRegistry = TypeHierarchyRegistry;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/typehierarchy/lib/browser/typehierarchy-provider'] = this;


/***/ }),

/***/ "../../packages/typehierarchy/lib/browser/typehierarchy-service.js":
/*!*************************************************************************!*\
  !*** ../../packages/typehierarchy/lib/browser/typehierarchy-service.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2022 Ericsson and others.
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
exports.TypeHierarchyServiceProvider = exports.TypeHierarchyService = void 0;
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const language_selector_1 = __webpack_require__(/*! @theia/editor/lib/common/language-selector */ "../../packages/editor/lib/common/language-selector.js");
exports.TypeHierarchyService = Symbol('TypeHierarchyService');
let TypeHierarchyServiceProvider = class TypeHierarchyServiceProvider {
    constructor() {
        this.onDidChangeEmitter = new common_1.Emitter();
        this.services = [];
    }
    get onDidChange() {
        return this.onDidChangeEmitter.event;
    }
    init() {
        this.services = this.services.concat(this.contributions.getContributions());
    }
    get(languageId, uri) {
        return this.services
            .filter(service => this.score(service, languageId, uri) > 0)
            .sort((left, right) => this.score(right, languageId, uri) - this.score(left, languageId, uri))[0];
    }
    score(service, languageId, uri) {
        return (0, language_selector_1.score)(service.selector, uri.scheme, uri.path.toString(), languageId, true);
    }
    add(service) {
        this.services.push(service);
        const that = this;
        this.onDidChangeEmitter.fire();
        return {
            dispose: () => {
                that.remove(service);
            }
        };
    }
    remove(service) {
        const length = this.services.length;
        this.services = this.services.filter(value => value !== service);
        const serviceWasRemoved = length !== this.services.length;
        if (serviceWasRemoved) {
            this.onDidChangeEmitter.fire();
        }
        return serviceWasRemoved;
    }
};
__decorate([
    (0, inversify_1.inject)(common_1.ContributionProvider),
    (0, inversify_1.named)(exports.TypeHierarchyService),
    __metadata("design:type", Object)
], TypeHierarchyServiceProvider.prototype, "contributions", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TypeHierarchyServiceProvider.prototype, "init", null);
TypeHierarchyServiceProvider = __decorate([
    (0, inversify_1.injectable)()
], TypeHierarchyServiceProvider);
exports.TypeHierarchyServiceProvider = TypeHierarchyServiceProvider;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/typehierarchy/lib/browser/typehierarchy-service'] = this;


/***/ }),

/***/ "../../node_modules/css-loader/dist/cjs.js!../../packages/typehierarchy/src/browser/style/index.css":
/*!**********************************************************************************************************!*\
  !*** ../../node_modules/css-loader/dist/cjs.js!../../packages/typehierarchy/src/browser/style/index.css ***!
  \**********************************************************************************************************/
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
 * Copyright (C) 2019 TypeFox and others.
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

.theia-type-hierarchy-tree {
  font-size: var(--theia-ui-font-size0);
}

.theia-type-hierarchy-tree .theia-caption-suffix {
  padding-left: 10px !important;
}

.theia-type-hierarchy-tree .theia-caption-prefix {
  padding-right: 5px !important;
  padding-left: 1px !important;
}
`, "",{"version":3,"sources":["webpack://./../../packages/typehierarchy/src/browser/style/index.css"],"names":[],"mappings":"AAAA;;;;;;;;;;;;;;iFAciF;;AAEjF;EACE,qCAAqC;AACvC;;AAEA;EACE,6BAA6B;AAC/B;;AAEA;EACE,6BAA6B;EAC7B,4BAA4B;AAC9B","sourcesContent":["/********************************************************************************\n * Copyright (C) 2019 TypeFox and others.\n *\n * This program and the accompanying materials are made available under the\n * terms of the Eclipse Public License v. 2.0 which is available at\n * http://www.eclipse.org/legal/epl-2.0.\n *\n * This Source Code may also be made available under the following Secondary\n * Licenses when the conditions for such availability set forth in the Eclipse\n * Public License v. 2.0 are satisfied: GNU General Public License, version 2\n * with the GNU Classpath Exception which is available at\n * https://www.gnu.org/software/classpath/license.html.\n *\n * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0\n ********************************************************************************/\n\n.theia-type-hierarchy-tree {\n  font-size: var(--theia-ui-font-size0);\n}\n\n.theia-type-hierarchy-tree .theia-caption-suffix {\n  padding-left: 10px !important;\n}\n\n.theia-type-hierarchy-tree .theia-caption-prefix {\n  padding-right: 5px !important;\n  padding-left: 1px !important;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../packages/typehierarchy/src/browser/style/index.css":
/*!****************************************************************!*\
  !*** ../../packages/typehierarchy/src/browser/style/index.css ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/css-loader/dist/cjs.js!./index.css */ "../../node_modules/css-loader/dist/cjs.js!../../packages/typehierarchy/src/browser/style/index.css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ })

}]);
//# sourceMappingURL=packages_typehierarchy_lib_browser_typehierarchy-frontend-module_js.js.map