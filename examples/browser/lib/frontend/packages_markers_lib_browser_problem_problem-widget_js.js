"use strict";
(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_markers_lib_browser_problem_problem-widget_js"],{

/***/ "../../packages/markers/lib/browser/marker-tree-model.js":
/*!***************************************************************!*\
  !*** ../../packages/markers/lib/browser/marker-tree-model.js ***!
  \***************************************************************/
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
exports.MarkerTreeModel = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const marker_tree_1 = __webpack_require__(/*! ./marker-tree */ "../../packages/markers/lib/browser/marker-tree.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
let MarkerTreeModel = class MarkerTreeModel extends browser_1.TreeModelImpl {
    doOpenNode(node) {
        if (marker_tree_1.MarkerNode.is(node)) {
            (0, browser_1.open)(this.openerService, node.uri, this.getOpenerOptionsByMarker(node));
        }
        else {
            super.doOpenNode(node);
        }
    }
    getOpenerOptionsByMarker(node) {
        return undefined;
    }
    /**
     * Reveal the corresponding node at the marker.
     * @param node {TreeNode} the tree node.
     */
    revealNode(node) {
        if (marker_tree_1.MarkerNode.is(node)) {
            (0, browser_1.open)(this.openerService, node.uri, { ...this.getOpenerOptionsByMarker(node), mode: 'reveal' });
        }
    }
};
__decorate([
    (0, inversify_1.inject)(browser_1.OpenerService),
    __metadata("design:type", Object)
], MarkerTreeModel.prototype, "openerService", void 0);
MarkerTreeModel = __decorate([
    (0, inversify_1.injectable)()
], MarkerTreeModel);
exports.MarkerTreeModel = MarkerTreeModel;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/markers/lib/browser/marker-tree-model'] = this;


/***/ }),

/***/ "../../packages/markers/lib/browser/marker-tree.js":
/*!*********************************************************!*\
  !*** ../../packages/markers/lib/browser/marker-tree.js ***!
  \*********************************************************/
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
exports.MarkerRootNode = exports.MarkerInfoNode = exports.MarkerNode = exports.MarkerTree = exports.MarkerOptions = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const marker_manager_1 = __webpack_require__(/*! ./marker-manager */ "../../packages/markers/lib/browser/marker-manager.js");
const selection_1 = __webpack_require__(/*! @theia/core/lib/common/selection */ "../../packages/core/lib/common/selection.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const problem_selection_1 = __webpack_require__(/*! ./problem/problem-selection */ "../../packages/markers/lib/browser/problem/problem-selection.js");
exports.MarkerOptions = Symbol('MarkerOptions');
let MarkerTree = class MarkerTree extends browser_1.TreeImpl {
    constructor(markerManager, markerOptions) {
        super();
        this.markerManager = markerManager;
        this.markerOptions = markerOptions;
        this.toDispose.push(markerManager.onDidChangeMarkers(uri => this.refreshMarkerInfo(uri)));
        this.root = {
            visible: false,
            id: 'theia-' + markerOptions.kind + '-marker-widget',
            name: 'MarkerTree',
            kind: markerOptions.kind,
            children: [],
            parent: undefined
        };
    }
    async refreshMarkerInfo(uri) {
        const id = uri.toString();
        const existing = this.getNode(id);
        const markers = this.markerManager.findMarkers({ uri });
        if (markers.length <= 0) {
            if (MarkerInfoNode.is(existing)) {
                browser_1.CompositeTreeNode.removeChild(existing.parent, existing);
                this.removeNode(existing);
                this.fireChanged();
            }
            return;
        }
        const node = MarkerInfoNode.is(existing) ? existing : this.createMarkerInfo(id, uri);
        this.insertNodeWithMarkers(node, markers);
    }
    insertNodeWithMarkers(node, markers) {
        browser_1.CompositeTreeNode.addChild(node.parent, node);
        const children = this.getMarkerNodes(node, markers);
        node.numberOfMarkers = markers.length;
        this.setChildren(node, children);
    }
    async resolveChildren(parent) {
        if (MarkerRootNode.is(parent)) {
            const nodes = [];
            for (const id of this.markerManager.getUris()) {
                const uri = new uri_1.default(id);
                const existing = this.getNode(id);
                const markers = this.markerManager.findMarkers({ uri });
                const node = MarkerInfoNode.is(existing) ? existing : this.createMarkerInfo(id, uri);
                node.children = this.getMarkerNodes(node, markers);
                node.numberOfMarkers = node.children.length;
                nodes.push(node);
            }
            return nodes;
        }
        return super.resolveChildren(parent);
    }
    createMarkerInfo(id, uri) {
        return {
            children: [],
            expanded: true,
            uri,
            id,
            parent: this.root,
            selected: false,
            numberOfMarkers: 0
        };
    }
    getMarkerNodes(parent, markers) {
        return markers.map((marker, index) => this.createMarkerNode(marker, index, parent));
    }
    createMarkerNode(marker, index, parent) {
        const id = parent.id + '_' + index;
        const existing = this.getNode(id);
        if (MarkerNode.is(existing)) {
            existing.marker = marker;
            return existing;
        }
        return {
            id,
            name: 'marker',
            parent,
            selected: false,
            uri: parent.uri,
            marker
        };
    }
};
MarkerTree = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [marker_manager_1.MarkerManager, Object])
], MarkerTree);
exports.MarkerTree = MarkerTree;
var MarkerNode;
(function (MarkerNode) {
    function is(node) {
        return selection_1.UriSelection.is(node) && browser_1.SelectableTreeNode.is(node) && problem_selection_1.ProblemSelection.is(node);
    }
    MarkerNode.is = is;
})(MarkerNode = exports.MarkerNode || (exports.MarkerNode = {}));
var MarkerInfoNode;
(function (MarkerInfoNode) {
    function is(node) {
        return browser_1.ExpandableTreeNode.is(node) && selection_1.UriSelection.is(node) && 'numberOfMarkers' in node;
    }
    MarkerInfoNode.is = is;
})(MarkerInfoNode = exports.MarkerInfoNode || (exports.MarkerInfoNode = {}));
var MarkerRootNode;
(function (MarkerRootNode) {
    function is(node) {
        return browser_1.CompositeTreeNode.is(node) && 'kind' in node;
    }
    MarkerRootNode.is = is;
})(MarkerRootNode = exports.MarkerRootNode || (exports.MarkerRootNode = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/markers/lib/browser/marker-tree'] = this;


/***/ }),

/***/ "../../packages/markers/lib/browser/problem/problem-composite-tree-node.js":
/*!*********************************************************************************!*\
  !*** ../../packages/markers/lib/browser/problem/problem-composite-tree-node.js ***!
  \*********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2021 EclipseSource and others.
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
exports.ProblemCompositeTreeNode = void 0;
const tree_1 = __webpack_require__(/*! @theia/core/lib/browser/tree/tree */ "../../packages/core/lib/browser/tree/tree.js");
const problem_utils_1 = __webpack_require__(/*! ./problem-utils */ "../../packages/markers/lib/browser/problem/problem-utils.js");
var ProblemCompositeTreeNode;
(function (ProblemCompositeTreeNode) {
    function setSeverity(parent, markers) {
        let maxSeverity;
        markers.forEach(marker => {
            if (problem_utils_1.ProblemUtils.severityCompare(marker.data.severity, maxSeverity) < 0) {
                maxSeverity = marker.data.severity;
            }
        });
        parent.severity = maxSeverity;
    }
    ProblemCompositeTreeNode.setSeverity = setSeverity;
    ;
    function addChildren(parent, insertChildren) {
        for (const { node, markers } of insertChildren) {
            ProblemCompositeTreeNode.setSeverity(node, markers);
        }
        const sortedInsertChildren = insertChildren.sort((a, b) => (problem_utils_1.ProblemUtils.severityCompare(a.node.severity, b.node.severity) || compareURI(a.node.uri, b.node.uri)));
        let startIndex = 0;
        const children = parent.children;
        for (const { node } of sortedInsertChildren) {
            const index = children.findIndex(value => value.id === node.id);
            if (index !== -1) {
                tree_1.CompositeTreeNode.removeChild(parent, node);
            }
            if (children.length === 0) {
                children.push(node);
                startIndex = 1;
                tree_1.CompositeTreeNode.setParent(node, 0, parent);
            }
            else {
                let inserted = false;
                for (let i = startIndex; i < children.length; i++) {
                    // sort by severity, equal severity => sort by URI
                    if (problem_utils_1.ProblemUtils.severityCompare(node.severity, children[i].severity) < 0
                        || (problem_utils_1.ProblemUtils.severityCompare(node.severity, children[i].severity) === 0 && compareURI(node.uri, children[i].uri) < 0)) {
                        children.splice(i, 0, node);
                        inserted = true;
                        startIndex = i + 1;
                        tree_1.CompositeTreeNode.setParent(node, i, parent);
                        break;
                    }
                    ;
                }
                if (inserted === false) {
                    children.push(node);
                    startIndex = children.length;
                    tree_1.CompositeTreeNode.setParent(node, children.length - 1, parent);
                }
            }
        }
    }
    ProblemCompositeTreeNode.addChildren = addChildren;
    const compareURI = (uri1, uri2) => uri1.toString().localeCompare(uri2.toString(), undefined, { sensitivity: 'base' });
    ;
})(ProblemCompositeTreeNode = exports.ProblemCompositeTreeNode || (exports.ProblemCompositeTreeNode = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/markers/lib/browser/problem/problem-composite-tree-node'] = this;


/***/ }),

/***/ "../../packages/markers/lib/browser/problem/problem-preferences.js":
/*!*************************************************************************!*\
  !*** ../../packages/markers/lib/browser/problem/problem-preferences.js ***!
  \*************************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.bindProblemPreferences = exports.createProblemPreferences = exports.ProblemPreferences = exports.ProblemPreferenceContribution = exports.ProblemConfigSchema = void 0;
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
exports.ProblemConfigSchema = {
    'type': 'object',
    'properties': {
        'problems.decorations.enabled': {
            'type': 'boolean',
            'description': nls_1.nls.localizeByDefault('Show Errors & Warnings on files and folder.'),
            'default': true,
        },
        'problems.decorations.tabbar.enabled': {
            'type': 'boolean',
            'description': nls_1.nls.localize('theia/markers/tabbarDecorationsEnabled', 'Show problem decorators (diagnostic markers) in the tab bars.'),
            'default': true
        },
        'problems.autoReveal': {
            'type': 'boolean',
            'description': nls_1.nls.localizeByDefault('Controls whether Problems view should automatically reveal files when opening them.'),
            'default': true
        }
    }
};
exports.ProblemPreferenceContribution = Symbol('ProblemPreferenceContribution');
exports.ProblemPreferences = Symbol('ProblemPreferences');
function createProblemPreferences(preferences, schema = exports.ProblemConfigSchema) {
    return (0, browser_1.createPreferenceProxy)(preferences, schema);
}
exports.createProblemPreferences = createProblemPreferences;
const bindProblemPreferences = (bind) => {
    bind(exports.ProblemPreferences).toDynamicValue(ctx => {
        const preferences = ctx.container.get(browser_1.PreferenceService);
        const contribution = ctx.container.get(exports.ProblemPreferenceContribution);
        return createProblemPreferences(preferences, contribution.schema);
    }).inSingletonScope();
    bind(exports.ProblemPreferenceContribution).toConstantValue({ schema: exports.ProblemConfigSchema });
    bind(browser_1.PreferenceContribution).toService(exports.ProblemPreferenceContribution);
};
exports.bindProblemPreferences = bindProblemPreferences;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/markers/lib/browser/problem/problem-preferences'] = this;


/***/ }),

/***/ "../../packages/markers/lib/browser/problem/problem-selection.js":
/*!***********************************************************************!*\
  !*** ../../packages/markers/lib/browser/problem/problem-selection.js ***!
  \***********************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProblemSelection = void 0;
const selection_command_handler_1 = __webpack_require__(/*! @theia/core/lib/common/selection-command-handler */ "../../packages/core/lib/common/selection-command-handler.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const problem_marker_1 = __webpack_require__(/*! ../../common/problem-marker */ "../../packages/markers/lib/common/problem-marker.js");
var ProblemSelection;
(function (ProblemSelection) {
    function is(arg) {
        return (0, common_1.isObject)(arg) && problem_marker_1.ProblemMarker.is(arg.marker);
    }
    ProblemSelection.is = is;
    class CommandHandler extends selection_command_handler_1.SelectionCommandHandler {
        constructor(selectionService, options) {
            super(selectionService, arg => ProblemSelection.is(arg) ? arg : undefined, options);
        }
    }
    ProblemSelection.CommandHandler = CommandHandler;
})(ProblemSelection = exports.ProblemSelection || (exports.ProblemSelection = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/markers/lib/browser/problem/problem-selection'] = this;


/***/ }),

/***/ "../../packages/markers/lib/browser/problem/problem-tree-model.js":
/*!************************************************************************!*\
  !*** ../../packages/markers/lib/browser/problem/problem-tree-model.js ***!
  \************************************************************************/
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
exports.ProblemTreeModel = exports.ProblemTree = void 0;
const problem_marker_1 = __webpack_require__(/*! ../../common/problem-marker */ "../../packages/markers/lib/common/problem-marker.js");
const problem_manager_1 = __webpack_require__(/*! ./problem-manager */ "../../packages/markers/lib/browser/problem/problem-manager.js");
const problem_composite_tree_node_1 = __webpack_require__(/*! ./problem-composite-tree-node */ "../../packages/markers/lib/browser/problem/problem-composite-tree-node.js");
const marker_tree_1 = __webpack_require__(/*! ../marker-tree */ "../../packages/markers/lib/browser/marker-tree.js");
const marker_tree_model_1 = __webpack_require__(/*! ../marker-tree-model */ "../../packages/markers/lib/browser/marker-tree-model.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const problem_utils_1 = __webpack_require__(/*! ./problem-utils */ "../../packages/markers/lib/browser/problem/problem-utils.js");
const debounce = __webpack_require__(/*! @theia/core/shared/lodash.debounce */ "../../packages/core/shared/lodash.debounce/index.js");
let ProblemTree = class ProblemTree extends marker_tree_1.MarkerTree {
    constructor(markerManager, markerOptions) {
        super(markerManager, markerOptions);
        this.markers = [];
        this.doInsertNodesWithMarkers = debounce(() => {
            problem_composite_tree_node_1.ProblemCompositeTreeNode.addChildren(this.root, this.markers);
            for (const { node, markers } of this.markers) {
                const children = this.getMarkerNodes(node, markers);
                node.numberOfMarkers = markers.length;
                this.setChildren(node, children);
            }
            this.markers.length = 0;
        }, 50);
    }
    getMarkerNodes(parent, markers) {
        const nodes = super.getMarkerNodes(parent, markers);
        return nodes.sort((a, b) => this.sortMarkers(a, b));
    }
    /**
     * Sort markers based on the following rules:
     * - Markers are fist sorted by `severity`.
     * - Markers are sorted by `line number` if applicable.
     * - Markers are sorted by `column number` if applicable.
     * - Markers are then finally sorted by `owner` if applicable.
     * @param a the first marker for comparison.
     * @param b the second marker for comparison.
     */
    sortMarkers(a, b) {
        const markerA = a.marker;
        const markerB = b.marker;
        // Determine the marker with the highest severity.
        const severity = problem_utils_1.ProblemUtils.severityCompareMarker(markerA, markerB);
        if (severity !== 0) {
            return severity;
        }
        // Determine the marker with the lower line number.
        const lineNumber = problem_utils_1.ProblemUtils.lineNumberCompare(markerA, markerB);
        if (lineNumber !== 0) {
            return lineNumber;
        }
        // Determine the marker with the lower column number.
        const columnNumber = problem_utils_1.ProblemUtils.columnNumberCompare(markerA, markerB);
        if (columnNumber !== 0) {
            return columnNumber;
        }
        // Sort by owner in alphabetical order.
        const owner = problem_utils_1.ProblemUtils.ownerCompare(markerA, markerB);
        if (owner !== 0) {
            return owner;
        }
        return 0;
    }
    insertNodeWithMarkers(node, markers) {
        this.markers.push({ node, markers });
        this.doInsertNodesWithMarkers();
    }
};
ProblemTree = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(problem_manager_1.ProblemManager)),
    __param(1, (0, inversify_1.inject)(marker_tree_1.MarkerOptions)),
    __metadata("design:paramtypes", [problem_manager_1.ProblemManager, Object])
], ProblemTree);
exports.ProblemTree = ProblemTree;
let ProblemTreeModel = class ProblemTreeModel extends marker_tree_model_1.MarkerTreeModel {
    getOpenerOptionsByMarker(node) {
        if (problem_marker_1.ProblemMarker.is(node.marker)) {
            return {
                selection: node.marker.data.range
            };
        }
        return undefined;
    }
    removeNode(node) {
        if (marker_tree_1.MarkerInfoNode.is(node)) {
            this.problemManager.cleanAllMarkers(node.uri);
        }
        if (marker_tree_1.MarkerNode.is(node)) {
            const { uri } = node;
            const { owner } = node.marker;
            const diagnostics = this.problemManager.findMarkers({ uri, owner, dataFilter: data => node.marker.data !== data }).map(({ data }) => data);
            this.problemManager.setMarkers(uri, owner, diagnostics);
        }
    }
};
__decorate([
    (0, inversify_1.inject)(problem_manager_1.ProblemManager),
    __metadata("design:type", problem_manager_1.ProblemManager)
], ProblemTreeModel.prototype, "problemManager", void 0);
ProblemTreeModel = __decorate([
    (0, inversify_1.injectable)()
], ProblemTreeModel);
exports.ProblemTreeModel = ProblemTreeModel;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/markers/lib/browser/problem/problem-tree-model'] = this;


/***/ }),

/***/ "../../packages/markers/lib/browser/problem/problem-utils.js":
/*!*******************************************************************!*\
  !*** ../../packages/markers/lib/browser/problem/problem-utils.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProblemUtils = void 0;
const vscode_languageserver_protocol_1 = __webpack_require__(/*! @theia/core/shared/vscode-languageserver-protocol */ "../../packages/core/shared/vscode-languageserver-protocol/index.js");
var ProblemUtils;
(function (ProblemUtils) {
    /**
     * Comparator for severity.
     * - The highest severity (`error`) come first followed by others.
     * - `undefined` severities are treated as the last ones.
     * @param a the first marker for comparison.
     * @param b the second marker for comparison.
     */
    ProblemUtils.severityCompareMarker = (a, b) => (a.data.severity || Number.MAX_SAFE_INTEGER) - (b.data.severity || Number.MAX_SAFE_INTEGER);
    /**
     * Comparator for severity.
     * - The highest severity (`error`) come first followed by others.
     * - `undefined` severities are treated as the last ones.
     * @param a the first severity for comparison.
     * @param b the second severity for comparison.
     */
    ProblemUtils.severityCompare = (a, b) => (a || Number.MAX_SAFE_INTEGER) - (b || Number.MAX_SAFE_INTEGER);
    /**
     * Comparator for line numbers.
     * - The lowest line number comes first.
     * @param a the first marker for comparison.
     * @param b the second marker for comparison.
     */
    ProblemUtils.lineNumberCompare = (a, b) => a.data.range.start.line - b.data.range.start.line;
    /**
     * Comparator for column numbers.
     * - The lowest column number comes first.
     * @param a the first marker for comparison.
     * @param b the second marker for comparison.
     */
    ProblemUtils.columnNumberCompare = (a, b) => a.data.range.start.character - b.data.range.start.character;
    /**
     * Comparator for marker owner (source).
     * - The order is alphabetical.
     * @param a the first marker for comparison.
     * @param b the second marker for comparison.
     */
    ProblemUtils.ownerCompare = (a, b) => a.owner.localeCompare(b.owner);
    function getPriority(marker) {
        const { severity } = marker.data;
        switch (severity) {
            case vscode_languageserver_protocol_1.DiagnosticSeverity.Error: return 30;
            case vscode_languageserver_protocol_1.DiagnosticSeverity.Warning: return 20;
            case vscode_languageserver_protocol_1.DiagnosticSeverity.Information: return 10;
            default: return 0;
        }
    }
    ProblemUtils.getPriority = getPriority;
    function getColor(marker) {
        const { severity } = marker.data;
        switch (severity) {
            case vscode_languageserver_protocol_1.DiagnosticSeverity.Error: return 'list.errorForeground';
            case vscode_languageserver_protocol_1.DiagnosticSeverity.Warning: return 'list.warningForeground';
            default: return ''; // other severities should not be decorated.
        }
    }
    ProblemUtils.getColor = getColor;
    function filterMarker(marker) {
        const { severity } = marker.data;
        return severity === vscode_languageserver_protocol_1.DiagnosticSeverity.Error
            || severity === vscode_languageserver_protocol_1.DiagnosticSeverity.Warning;
    }
    ProblemUtils.filterMarker = filterMarker;
})(ProblemUtils = exports.ProblemUtils || (exports.ProblemUtils = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/markers/lib/browser/problem/problem-utils'] = this;


/***/ }),

/***/ "../../packages/markers/lib/browser/problem/problem-widget.js":
/*!********************************************************************!*\
  !*** ../../packages/markers/lib/browser/problem/problem-widget.js ***!
  \********************************************************************/
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
exports.ProblemMarkerRemoveButton = exports.ProblemWidget = exports.PROBLEMS_WIDGET_ID = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const problem_manager_1 = __webpack_require__(/*! ./problem-manager */ "../../packages/markers/lib/browser/problem/problem-manager.js");
const problem_marker_1 = __webpack_require__(/*! ../../common/problem-marker */ "../../packages/markers/lib/common/problem-marker.js");
const problem_tree_model_1 = __webpack_require__(/*! ./problem-tree-model */ "../../packages/markers/lib/browser/problem/problem-tree-model.js");
const marker_tree_1 = __webpack_require__(/*! ../marker-tree */ "../../packages/markers/lib/browser/marker-tree.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const problem_preferences_1 = __webpack_require__(/*! ./problem-preferences */ "../../packages/markers/lib/browser/problem/problem-preferences.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
exports.PROBLEMS_WIDGET_ID = 'problems';
let ProblemWidget = class ProblemWidget extends browser_1.TreeWidget {
    constructor(treeProps, model, contextMenuRenderer) {
        super(treeProps, model, contextMenuRenderer);
        this.model = model;
        this.toDisposeOnCurrentWidgetChanged = new disposable_1.DisposableCollection();
        this.id = exports.PROBLEMS_WIDGET_ID;
        this.title.label = nls_1.nls.localizeByDefault('Problems');
        this.title.caption = this.title.label;
        this.title.iconClass = (0, browser_1.codicon)('warning');
        this.title.closable = true;
        this.addClass('theia-marker-container');
        this.addClipboardListener(this.node, 'copy', e => this.handleCopy(e));
    }
    init() {
        super.init();
        this.updateFollowActiveEditor();
        this.toDispose.push(this.preferences.onPreferenceChanged(e => {
            if (e.preferenceName === 'problems.autoReveal') {
                this.updateFollowActiveEditor();
            }
        }));
    }
    onActivateRequest(msg) {
        super.onActivateRequest(msg);
        this.update();
    }
    updateFollowActiveEditor() {
        this.toDisposeOnCurrentWidgetChanged.dispose();
        this.toDispose.push(this.toDisposeOnCurrentWidgetChanged);
        if (this.preferences.get('problems.autoReveal')) {
            this.followActiveEditor();
        }
    }
    followActiveEditor() {
        this.autoRevealFromActiveEditor();
        this.toDisposeOnCurrentWidgetChanged.push(this.shell.onDidChangeCurrentWidget(() => this.autoRevealFromActiveEditor()));
    }
    autoRevealFromActiveEditor() {
        const widget = this.shell.currentWidget;
        if (widget && browser_1.Navigatable.is(widget)) {
            const uri = widget.getResourceUri();
            const node = uri && this.model.getNode(uri.toString());
            if (browser_1.ExpandableTreeNode.is(node) && browser_1.SelectableTreeNode.is(node)) {
                this.model.expandNode(node);
                this.model.selectNode(node);
            }
        }
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
    tapNode(node) {
        super.tapNode(node);
        if (marker_tree_1.MarkerNode.is(node)) {
            this.model.revealNode(node);
        }
    }
    handleCopy(event) {
        const uris = this.model.selectedNodes.filter(marker_tree_1.MarkerNode.is).map(node => node.uri.toString());
        if (uris.length > 0 && event.clipboardData) {
            event.clipboardData.setData('text/plain', uris.join('\n'));
            event.preventDefault();
        }
    }
    handleDown(event) {
        const node = this.model.getNextSelectableNode();
        super.handleDown(event);
        if (marker_tree_1.MarkerNode.is(node)) {
            this.model.revealNode(node);
        }
    }
    handleUp(event) {
        const node = this.model.getPrevSelectableNode();
        super.handleUp(event);
        if (marker_tree_1.MarkerNode.is(node)) {
            this.model.revealNode(node);
        }
    }
    renderTree(model) {
        if (marker_tree_1.MarkerRootNode.is(model.root) && model.root.children.length > 0) {
            return super.renderTree(model);
        }
        return React.createElement("div", { className: 'theia-widget-noInfo noMarkers' }, nls_1.nls.localize('theia/markers/noProblems', 'No problems have been detected in the workspace so far.'));
    }
    renderCaption(node, props) {
        if (marker_tree_1.MarkerInfoNode.is(node)) {
            return this.decorateMarkerFileNode(node);
        }
        else if (marker_tree_1.MarkerNode.is(node)) {
            return this.decorateMarkerNode(node);
        }
        return 'caption';
    }
    renderTailDecorations(node, props) {
        return React.createElement("div", { className: 'row-button-container' }, this.renderRemoveButton(node));
    }
    renderRemoveButton(node) {
        return React.createElement(ProblemMarkerRemoveButton, { model: this.model, node: node });
    }
    decorateMarkerNode(node) {
        if (problem_marker_1.ProblemMarker.is(node.marker)) {
            let severityClass = '';
            const problemMarker = node.marker;
            if (problemMarker.data.severity) {
                severityClass = this.getSeverityClass(problemMarker.data.severity);
            }
            const location = nls_1.nls.localizeByDefault('Ln {0}, Col {1}', problemMarker.data.range.start.line + 1, problemMarker.data.range.start.character + 1);
            return React.createElement("div", { className: 'markerNode', title: `${problemMarker.data.message} (${problemMarker.data.range.start.line + 1}, ${problemMarker.data.range.start.character + 1})` },
                React.createElement("div", null,
                    React.createElement("i", { className: `${severityClass} ${browser_1.TREE_NODE_INFO_CLASS}` })),
                React.createElement("div", { className: 'message' },
                    problemMarker.data.message,
                    (!!problemMarker.data.source || !!problemMarker.data.code) &&
                        React.createElement("span", { className: 'owner ' + browser_1.TREE_NODE_INFO_CLASS },
                            problemMarker.data.source || '',
                            problemMarker.data.code ? `(${problemMarker.data.code})` : ''),
                    React.createElement("span", { className: 'position ' + browser_1.TREE_NODE_INFO_CLASS }, `[${location}]`)));
        }
        return '';
    }
    getSeverityClass(severity) {
        switch (severity) {
            case 1: return `${(0, browser_1.codicon)('error')} error`;
            case 2: return `${(0, browser_1.codicon)('warning')} warning`;
            case 3: return `${(0, browser_1.codicon)('info')} information`;
            default: return `${(0, browser_1.codicon)('thumbsup')} hint`;
        }
    }
    decorateMarkerFileNode(node) {
        const icon = this.toNodeIcon(node);
        const name = this.toNodeName(node);
        const description = this.toNodeDescription(node);
        // Use a custom scheme so that we fallback to the `DefaultUriLabelProviderContribution`.
        const path = this.labelProvider.getLongName(node.uri.withScheme('marker'));
        return React.createElement("div", { title: path, className: 'markerFileNode' },
            icon && React.createElement("div", { className: icon + ' file-icon' }),
            React.createElement("div", { className: 'name' }, name),
            React.createElement("div", { className: 'path ' + browser_1.TREE_NODE_INFO_CLASS }, description),
            React.createElement("div", { className: 'notification-count-container' },
                React.createElement("span", { className: 'notification-count' }, node.numberOfMarkers.toString())));
    }
};
__decorate([
    (0, inversify_1.inject)(problem_preferences_1.ProblemPreferences),
    __metadata("design:type", Object)
], ProblemWidget.prototype, "preferences", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.ApplicationShell),
    __metadata("design:type", browser_1.ApplicationShell)
], ProblemWidget.prototype, "shell", void 0);
__decorate([
    (0, inversify_1.inject)(problem_manager_1.ProblemManager),
    __metadata("design:type", problem_manager_1.ProblemManager)
], ProblemWidget.prototype, "problemManager", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProblemWidget.prototype, "init", null);
ProblemWidget = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(browser_1.TreeProps)),
    __param(1, (0, inversify_1.inject)(problem_tree_model_1.ProblemTreeModel)),
    __param(2, (0, inversify_1.inject)(browser_1.ContextMenuRenderer)),
    __metadata("design:paramtypes", [Object, problem_tree_model_1.ProblemTreeModel,
        browser_1.ContextMenuRenderer])
], ProblemWidget);
exports.ProblemWidget = ProblemWidget;
class ProblemMarkerRemoveButton extends React.Component {
    constructor() {
        super(...arguments);
        this.remove = (e) => this.doRemove(e);
    }
    render() {
        return React.createElement("span", { className: (0, browser_1.codicon)('close'), onClick: this.remove });
    }
    doRemove(e) {
        this.props.model.removeNode(this.props.node);
        e.stopPropagation();
    }
}
exports.ProblemMarkerRemoveButton = ProblemMarkerRemoveButton;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/markers/lib/browser/problem/problem-widget'] = this;


/***/ })

}]);
//# sourceMappingURL=packages_markers_lib_browser_problem_problem-widget_js.js.map