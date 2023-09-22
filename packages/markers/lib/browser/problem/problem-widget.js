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
exports.ProblemMarkerRemoveButton = exports.ProblemWidget = exports.PROBLEMS_WIDGET_ID = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const problem_manager_1 = require("./problem-manager");
const problem_marker_1 = require("../../common/problem-marker");
const problem_tree_model_1 = require("./problem-tree-model");
const marker_tree_1 = require("../marker-tree");
const browser_1 = require("@theia/core/lib/browser");
const React = require("@theia/core/shared/react");
const problem_preferences_1 = require("./problem-preferences");
const disposable_1 = require("@theia/core/lib/common/disposable");
const nls_1 = require("@theia/core/lib/common/nls");
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
//# sourceMappingURL=problem-widget.js.map