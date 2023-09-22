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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProblemTreeModel = exports.ProblemTree = void 0;
const problem_marker_1 = require("../../common/problem-marker");
const problem_manager_1 = require("./problem-manager");
const problem_composite_tree_node_1 = require("./problem-composite-tree-node");
const marker_tree_1 = require("../marker-tree");
const marker_tree_model_1 = require("../marker-tree-model");
const inversify_1 = require("@theia/core/shared/inversify");
const problem_utils_1 = require("./problem-utils");
const debounce = require("@theia/core/shared/lodash.debounce");
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
//# sourceMappingURL=problem-tree-model.js.map