"use strict";
(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_console_lib_browser_console-session_js"],{

/***/ "../../packages/console/lib/browser/console-session.js":
/*!*************************************************************!*\
  !*** ../../packages/console/lib/browser/console-session.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConsoleSession = exports.ConsoleItem = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const source_tree_1 = __webpack_require__(/*! @theia/core/lib/browser/source-tree */ "../../packages/core/lib/browser/source-tree/index.js");
const event_1 = __webpack_require__(/*! @theia/core/lib/common/event */ "../../packages/core/lib/common/event.js");
var ConsoleItem;
(function (ConsoleItem) {
    ConsoleItem.errorClassName = 'theia-console-error';
    ConsoleItem.warningClassName = 'theia-console-warning';
    ConsoleItem.infoClassName = 'theia-console-info';
    ConsoleItem.logClassName = 'theia-console-log';
})(ConsoleItem = exports.ConsoleItem || (exports.ConsoleItem = {}));
let ConsoleSession = class ConsoleSession extends source_tree_1.TreeSource {
    constructor() {
        super(...arguments);
        this.selectionEmitter = new event_1.Emitter();
        this.onSelectionChange = this.selectionEmitter.event;
    }
    get severity() {
        return this.selectedSeverity;
    }
    set severity(severity) {
        if (severity === this.selectedSeverity) {
            return;
        }
        this.selectedSeverity = severity;
        this.selectionEmitter.fire(undefined);
        this.fireDidChange();
    }
};
ConsoleSession = __decorate([
    (0, inversify_1.injectable)()
], ConsoleSession);
exports.ConsoleSession = ConsoleSession;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/console/lib/browser/console-session'] = this;


/***/ }),

/***/ "../../packages/core/lib/browser/source-tree/index.js":
/*!************************************************************!*\
  !*** ../../packages/core/lib/browser/source-tree/index.js ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
__exportStar(__webpack_require__(/*! ./tree-source */ "../../packages/core/lib/browser/source-tree/tree-source.js"), exports);
__exportStar(__webpack_require__(/*! ./source-tree */ "../../packages/core/lib/browser/source-tree/source-tree.js"), exports);
__exportStar(__webpack_require__(/*! ./source-tree-widget */ "../../packages/core/lib/browser/source-tree/source-tree-widget.js"), exports);

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/lib/browser/source-tree'] = this;


/***/ }),

/***/ "../../packages/core/lib/browser/source-tree/source-tree-widget.js":
/*!*************************************************************************!*\
  !*** ../../packages/core/lib/browser/source-tree/source-tree-widget.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var SourceTreeWidget_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SourceTreeWidget = void 0;
const React = __webpack_require__(/*! react */ "../../node_modules/react/index.js");
const inversify_1 = __webpack_require__(/*! inversify */ "../../node_modules/inversify/es/inversify.js");
const disposable_1 = __webpack_require__(/*! ../../common/disposable */ "../../packages/core/lib/common/disposable.js");
const tree_1 = __webpack_require__(/*! ../tree */ "../../packages/core/lib/browser/tree/index.js");
const source_tree_1 = __webpack_require__(/*! ./source-tree */ "../../packages/core/lib/browser/source-tree/source-tree.js");
let SourceTreeWidget = SourceTreeWidget_1 = class SourceTreeWidget extends tree_1.TreeWidget {
    constructor() {
        super(...arguments);
        this.toDisposeOnSource = new disposable_1.DisposableCollection();
    }
    static createContainer(parent, props) {
        const child = (0, tree_1.createTreeContainer)(parent, {
            props,
            tree: source_tree_1.SourceTree,
            widget: SourceTreeWidget_1,
        });
        return child;
    }
    init() {
        super.init();
        this.addClass('theia-source-tree');
        this.toDispose.push(this.model.onOpenNode(node => {
            if (source_tree_1.TreeElementNode.is(node) && node.element.open) {
                node.element.open();
            }
        }));
    }
    get source() {
        const root = this.model.root;
        return source_tree_1.TreeSourceNode.is(root) ? root.source : undefined;
    }
    set source(source) {
        if (this.source === source) {
            return;
        }
        this.toDisposeOnSource.dispose();
        this.toDispose.push(this.toDisposeOnSource);
        this.model.root = source_tree_1.TreeSourceNode.to(source);
        if (source) {
            this.toDisposeOnSource.push(source.onDidChange(() => this.model.refresh()));
        }
    }
    get selectedElement() {
        const node = this.model.selectedNodes[0];
        return source_tree_1.TreeElementNode.is(node) && node.element || undefined;
    }
    renderTree(model) {
        if (source_tree_1.TreeSourceNode.is(model.root) && model.root.children.length === 0) {
            const { placeholder } = model.root.source;
            if (placeholder) {
                return React.createElement("div", { className: 'theia-tree-source-node-placeholder noselect' }, placeholder);
            }
        }
        return super.renderTree(model);
    }
    renderCaption(node) {
        if (source_tree_1.TreeElementNode.is(node)) {
            const classNames = this.createTreeElementNodeClassNames(node);
            return React.createElement("div", { className: classNames.join(' ') }, node.element.render(this));
        }
        return undefined;
    }
    createTreeElementNodeClassNames(node) {
        return [tree_1.TREE_NODE_SEGMENT_GROW_CLASS];
    }
    storeState() {
        // no-op
        return {};
    }
    superStoreState() {
        return super.storeState();
    }
    restoreState(state) {
        // no-op
    }
    superRestoreState(state) {
        super.restoreState(state);
        return;
    }
};
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SourceTreeWidget.prototype, "init", null);
SourceTreeWidget = SourceTreeWidget_1 = __decorate([
    (0, inversify_1.injectable)()
], SourceTreeWidget);
exports.SourceTreeWidget = SourceTreeWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/lib/browser/source-tree/source-tree-widget'] = this;


/***/ }),

/***/ "../../packages/core/lib/browser/source-tree/source-tree.js":
/*!******************************************************************!*\
  !*** ../../packages/core/lib/browser/source-tree/source-tree.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TreeSourceNode = exports.CompositeTreeElementNode = exports.TreeElementNode = exports.SourceTree = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const inversify_1 = __webpack_require__(/*! inversify */ "../../node_modules/inversify/es/inversify.js");
const tree_1 = __webpack_require__(/*! ../tree */ "../../packages/core/lib/browser/tree/index.js");
const tree_source_1 = __webpack_require__(/*! ./tree-source */ "../../packages/core/lib/browser/source-tree/tree-source.js");
let SourceTree = class SourceTree extends tree_1.TreeImpl {
    async resolveChildren(parent) {
        const elements = await this.resolveElements(parent);
        const nodes = [];
        let index = 0;
        for (const element of elements) {
            if (element.visible !== false) {
                nodes.push(this.toNode(element, index++, parent));
            }
        }
        return nodes;
    }
    resolveElements(parent) {
        if (TreeSourceNode.is(parent)) {
            return parent.source.getElements();
        }
        return parent.element.getElements();
    }
    toNode(element, index, parent) {
        const id = element.id ? String(element.id) : (parent.id + ':' + index);
        const name = id;
        const existing = this.getNode(id);
        const updated = existing && Object.assign(existing, { element, parent });
        if (tree_source_1.CompositeTreeElement.hasElements(element)) {
            if (updated) {
                if (!tree_1.ExpandableTreeNode.is(updated)) {
                    Object.assign(updated, { expanded: false });
                }
                if (!tree_1.CompositeTreeNode.is(updated)) {
                    Object.assign(updated, { children: [] });
                }
                return updated;
            }
            return {
                element,
                parent,
                id,
                name,
                selected: false,
                expanded: false,
                children: []
            };
        }
        if (CompositeTreeElementNode.is(updated)) {
            delete updated.expanded;
            delete updated.children;
        }
        if (updated) {
            if (tree_1.ExpandableTreeNode.is(updated)) {
                delete updated.expanded;
            }
            if (tree_1.CompositeTreeNode.is(updated)) {
                delete updated.children;
            }
            return updated;
        }
        return {
            element,
            parent,
            id,
            name,
            selected: false
        };
    }
};
SourceTree = __decorate([
    (0, inversify_1.injectable)()
], SourceTree);
exports.SourceTree = SourceTree;
var TreeElementNode;
(function (TreeElementNode) {
    function is(node) {
        return tree_1.SelectableTreeNode.is(node) && 'element' in node;
    }
    TreeElementNode.is = is;
})(TreeElementNode = exports.TreeElementNode || (exports.TreeElementNode = {}));
var CompositeTreeElementNode;
(function (CompositeTreeElementNode) {
    function is(node) {
        return TreeElementNode.is(node) && tree_1.CompositeTreeNode.is(node) && tree_1.ExpandableTreeNode.is(node) && !!node.visible;
    }
    CompositeTreeElementNode.is = is;
})(CompositeTreeElementNode = exports.CompositeTreeElementNode || (exports.CompositeTreeElementNode = {}));
var TreeSourceNode;
(function (TreeSourceNode) {
    function is(node) {
        return tree_1.CompositeTreeNode.is(node) && !node.visible && 'source' in node;
    }
    TreeSourceNode.is = is;
    function to(source) {
        if (!source) {
            return source;
        }
        const id = source.id || '__source__';
        return {
            id,
            name: id,
            visible: false,
            children: [],
            source,
            parent: undefined,
            selected: false
        };
    }
    TreeSourceNode.to = to;
})(TreeSourceNode = exports.TreeSourceNode || (exports.TreeSourceNode = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/lib/browser/source-tree/source-tree'] = this;


/***/ }),

/***/ "../../packages/core/lib/browser/source-tree/tree-source.js":
/*!******************************************************************!*\
  !*** ../../packages/core/lib/browser/source-tree/tree-source.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
exports.TreeSource = exports.CompositeTreeElement = void 0;
const inversify_1 = __webpack_require__(/*! inversify */ "../../node_modules/inversify/es/inversify.js");
const common_1 = __webpack_require__(/*! ../../common */ "../../packages/core/lib/common/index.js");
var CompositeTreeElement;
(function (CompositeTreeElement) {
    function is(element) {
        return (0, common_1.isObject)(element) && 'getElements' in element;
    }
    CompositeTreeElement.is = is;
    function hasElements(element) {
        return is(element) && element.hasElements !== false;
    }
    CompositeTreeElement.hasElements = hasElements;
})(CompositeTreeElement = exports.CompositeTreeElement || (exports.CompositeTreeElement = {}));
let TreeSource = class TreeSource {
    constructor(options = {}) {
        this.onDidChangeEmitter = new common_1.Emitter();
        this.onDidChange = this.onDidChangeEmitter.event;
        this.toDispose = new common_1.DisposableCollection(this.onDidChangeEmitter);
        this.id = options.id;
        this.placeholder = options.placeholder;
    }
    fireDidChange() {
        this.onDidChangeEmitter.fire(undefined);
    }
    dispose() {
        this.toDispose.dispose();
    }
};
TreeSource = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.unmanaged)()),
    __metadata("design:paramtypes", [Object])
], TreeSource);
exports.TreeSource = TreeSource;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/lib/browser/source-tree/tree-source'] = this;


/***/ })

}]);
//# sourceMappingURL=packages_console_lib_browser_console-session_js.js.map