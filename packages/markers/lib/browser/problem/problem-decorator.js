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
var ProblemDecorator_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProblemDecorator = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const vscode_languageserver_protocol_1 = require("@theia/core/shared/vscode-languageserver-protocol");
const event_1 = require("@theia/core/lib/common/event");
const tree_iterator_1 = require("@theia/core/lib/browser/tree/tree-iterator");
const tree_decorator_1 = require("@theia/core/lib/browser/tree/tree-decorator");
const browser_1 = require("@theia/filesystem/lib/browser");
const problem_manager_1 = require("./problem-manager");
const problem_preferences_1 = require("./problem-preferences");
const problem_utils_1 = require("./problem-utils");
const browser_2 = require("@theia/core/lib/browser");
const browser_3 = require("@theia/workspace/lib/browser");
/**
 * @deprecated since 1.25.0
 * URI-based decorators should implement `DecorationsProvider` and contribute decorations via the `DecorationsService`.
 */
let ProblemDecorator = ProblemDecorator_1 = class ProblemDecorator {
    constructor(problemManager) {
        this.problemManager = problemManager;
        this.id = 'theia-problem-decorator';
        this.emitter = new event_1.Emitter();
        this.problemManager.onDidChangeMarkers(() => this.fireDidChangeDecorations((tree) => this.collectDecorators(tree)));
    }
    init() {
        this.problemPreferences.onPreferenceChanged(event => {
            if (event.preferenceName === 'problems.decorations.enabled') {
                this.fireDidChangeDecorations(tree => this.collectDecorators(tree));
            }
        });
        this.workspaceService.onWorkspaceChanged(() => {
            this.fireDidChangeDecorations((tree) => this.collectDecorators(tree));
        });
        this.workspaceService.onWorkspaceLocationChanged(() => {
            this.fireDidChangeDecorations((tree) => this.collectDecorators(tree));
        });
    }
    async decorations(tree) {
        return this.collectDecorators(tree);
    }
    get onDidChangeDecorations() {
        return this.emitter.event;
    }
    fireDidChangeDecorations(event) {
        this.emitter.fire(event);
    }
    collectDecorators(tree) {
        const decorations = new Map();
        // If the tree root is undefined or the preference for the decorations is disabled, return an empty result map.
        if (!tree.root || !this.problemPreferences['problems.decorations.enabled']) {
            return decorations;
        }
        const baseDecorations = this.collectMarkers(tree);
        for (const node of new tree_iterator_1.DepthFirstTreeIterator(tree.root)) {
            const nodeUri = this.getUriFromNode(node);
            if (nodeUri) {
                const decorator = baseDecorations.get(nodeUri);
                if (decorator) {
                    this.appendContainerMarkers(node, decorator, decorations);
                }
                if (decorator) {
                    decorations.set(node.id, decorator);
                }
            }
        }
        return decorations;
    }
    generateCaptionSuffix(nodeURI) {
        var _a;
        const workspaceRoots = this.workspaceService.tryGetRoots();
        const parentWorkspace = this.workspaceService.getWorkspaceRootUri(nodeURI);
        let workspacePrefixString = '';
        let separator = '';
        let filePathString = '';
        const nodeURIDir = nodeURI.parent;
        if (parentWorkspace) {
            const relativeDirFromWorkspace = parentWorkspace.relative(nodeURIDir);
            workspacePrefixString = workspaceRoots.length > 1 ? this.labelProvider.getName(parentWorkspace) : '';
            filePathString = (_a = relativeDirFromWorkspace === null || relativeDirFromWorkspace === void 0 ? void 0 : relativeDirFromWorkspace.fsPath()) !== null && _a !== void 0 ? _a : '';
            separator = filePathString && workspacePrefixString ? ' \u2022 ' : ''; // add a bullet point between workspace and path
        }
        else {
            workspacePrefixString = nodeURIDir.path.fsPath();
        }
        return `${workspacePrefixString}${separator}${filePathString}`;
    }
    /**
     * Traverses up the tree from the given node and attaches decorations to any parents.
     */
    appendContainerMarkers(node, decoration, decorations) {
        let parent = node === null || node === void 0 ? void 0 : node.parent;
        while (parent) {
            const existing = decorations.get(parent.id);
            // Make sure the highest diagnostic severity (smaller number) will be propagated to the container directory.
            if (existing === undefined || this.compareDecorators(existing, decoration) < 0) {
                decorations.set(parent.id, decoration);
                parent = parent.parent;
            }
            else {
                break;
            }
        }
    }
    /**
     * @returns a map matching stringified URI's to a decoration whose features reflect the highest-severity problem found
     * and the number of problems found (based on {@link ProblemDecorator.toDecorator })
     */
    collectMarkers(tree) {
        const decorationsForUri = new Map();
        const compare = this.compare.bind(this);
        const filter = this.filterMarker.bind(this);
        for (const [, markers] of this.problemManager.getMarkersByUri()) {
            const relevant = markers.findMarkers({}).filter(filter).sort(compare);
            if (relevant.length) {
                decorationsForUri.set(relevant[0].uri, this.toDecorator(relevant));
            }
        }
        return decorationsForUri;
    }
    toDecorator(markers) {
        const color = this.getColor(markers[0]);
        const priority = this.getPriority(markers[0]);
        return {
            priority,
            fontData: {
                color,
            },
            tailDecorations: [{
                    color,
                    data: markers.length.toString(),
                }],
        };
    }
    getColor(marker) {
        const { severity } = marker.data;
        switch (severity) {
            case 1: return 'var(--theia-list-errorForeground)';
            case 2: return 'var(--theia-list-warningForeground)';
            default: return 'var(--theia-successBackground)';
        }
    }
    /**
     * Get the decoration for a given marker diagnostic.
     * Markers with higher severity have a higher priority and should be displayed.
     * @param marker the diagnostic marker.
     */
    getPriority(marker) {
        const { severity } = marker.data;
        switch (severity) {
            case 1: return 30; // Errors.
            case 2: return 20; // Warnings.
            case 3: return 10; // Infos.
            default: return 0;
        }
    }
    /**
     * Returns `true` if the diagnostic (`data`) of the marker argument has `Error`, `Warning`, or `Information` severity.
     * Otherwise, returns `false`.
     */
    filterMarker(marker) {
        const { severity } = marker.data;
        return severity === vscode_languageserver_protocol_1.DiagnosticSeverity.Error
            || severity === vscode_languageserver_protocol_1.DiagnosticSeverity.Warning
            || severity === vscode_languageserver_protocol_1.DiagnosticSeverity.Information;
    }
    getUriFromNode(node) {
        return browser_1.FileStatNode.getUri(node);
    }
    compare(left, right) {
        return ProblemDecorator_1.severityCompare(left, right);
    }
    compareDecorators(left, right) {
        return tree_decorator_1.TreeDecoration.Data.comparePriority(left, right);
    }
};
__decorate([
    (0, inversify_1.inject)(problem_preferences_1.ProblemPreferences),
    __metadata("design:type", Object)
], ProblemDecorator.prototype, "problemPreferences", void 0);
__decorate([
    (0, inversify_1.inject)(browser_3.WorkspaceService),
    __metadata("design:type", browser_3.WorkspaceService)
], ProblemDecorator.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.LabelProvider),
    __metadata("design:type", browser_2.LabelProvider)
], ProblemDecorator.prototype, "labelProvider", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProblemDecorator.prototype, "init", null);
ProblemDecorator = ProblemDecorator_1 = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(problem_manager_1.ProblemManager)),
    __metadata("design:paramtypes", [problem_manager_1.ProblemManager])
], ProblemDecorator);
exports.ProblemDecorator = ProblemDecorator;
(function (ProblemDecorator) {
    // Highest severities (errors) come first, then the others. Undefined severities treated as the last ones.
    ProblemDecorator.severityCompare = problem_utils_1.ProblemUtils.severityCompareMarker;
})(ProblemDecorator = exports.ProblemDecorator || (exports.ProblemDecorator = {}));
exports.ProblemDecorator = ProblemDecorator;
//# sourceMappingURL=problem-decorator.js.map