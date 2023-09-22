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
var PreferencesEditorWidget_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreferencesEditorWidget = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const inversify_1 = require("@theia/core/shared/inversify");
const throttle = require("@theia/core/shared/lodash.throttle");
const deepEqual = require("fast-deep-equal");
const browser_1 = require("@theia/core/lib/browser");
const common_1 = require("@theia/core/lib/common");
const widget_1 = require("@theia/core/lib/browser/widgets/widget");
const preference_tree_model_1 = require("../preference-tree-model");
const preference_node_renderer_1 = require("./components/preference-node-renderer");
const preference_types_1 = require("../util/preference-types");
const preference_tree_generator_1 = require("../util/preference-tree-generator");
const preference_scope_tabbar_widget_1 = require("./preference-scope-tabbar-widget");
const preference_node_renderer_creator_1 = require("./components/preference-node-renderer-creator");
let PreferencesEditorWidget = PreferencesEditorWidget_1 = class PreferencesEditorWidget extends widget_1.BaseWidget {
    constructor() {
        super(...arguments);
        this.scrollOptions = widget_1.DEFAULT_SCROLL_OPTIONS;
        /**
         * Guards against scroll events and selection events looping into each other. Set before this widget initiates a selection.
         */
        this.currentModelSelectionId = '';
        /**
         * Permits the user to expand multiple nodes without each one being collapsed on a new selection.
         */
        this.lastUserSelection = '';
        this.isAtScrollTop = true;
        this.firstVisibleChildID = '';
        this.renderers = new Map();
        this.preferenceDataKeys = new Map();
        // The commonly used section will duplicate preference ID's, so we'll keep a separate list of them.
        this.commonlyUsedRenderers = new Map();
        this.onScroll = throttle(this.doOnScroll.bind(this), 50);
    }
    init() {
        this.doInit();
    }
    async doInit() {
        this.id = PreferencesEditorWidget_1.ID;
        this.title.label = PreferencesEditorWidget_1.LABEL;
        this.addClass('settings-main');
        this.toDispose.pushAll([
            this.preferenceService.onPreferencesChanged(e => this.handlePreferenceChanges(e)),
            this.model.onFilterChanged(e => this.handleDisplayChange(e)),
            this.model.onSelectionChanged(e => this.handleSelectionChange(e)),
        ]);
        this.createContainers();
        await this.preferenceService.ready;
        this.handleDisplayChange({ source: preference_tree_model_1.PreferenceFilterChangeSource.Schema });
        this.rendererRegistry.onDidChange(() => this.handleRegistryChange());
    }
    createContainers() {
        const innerWrapper = document.createElement('div');
        innerWrapper.classList.add('settings-main-scroll-container');
        this.scrollContainer = innerWrapper;
        innerWrapper.addEventListener('scroll', this.onScroll, { passive: true });
        this.node.appendChild(innerWrapper);
        const noLeavesMessage = document.createElement('div');
        noLeavesMessage.classList.add('settings-no-results-announcement');
        noLeavesMessage.textContent = 'That search query has returned no results.';
        this.node.appendChild(noLeavesMessage);
    }
    handleDisplayChange(e) {
        const { isFiltered } = this.model;
        const currentFirstVisible = this.firstVisibleChildID;
        const leavesAreVisible = this.areLeavesVisible();
        if (e.source === preference_tree_model_1.PreferenceFilterChangeSource.Search) {
            this.handleSearchChange(isFiltered, leavesAreVisible);
        }
        else if (e.source === preference_tree_model_1.PreferenceFilterChangeSource.Scope) {
            this.handleScopeChange(isFiltered);
        }
        else if (e.source === preference_tree_model_1.PreferenceFilterChangeSource.Schema) {
            this.handleSchemaChange(isFiltered);
        }
        else {
            (0, common_1.unreachable)(e.source, 'Not all PreferenceFilterChangeSource enum variants handled.');
        }
        this.resetScroll(currentFirstVisible, e.source === preference_tree_model_1.PreferenceFilterChangeSource.Search && !isFiltered);
    }
    handleRegistryChange() {
        for (const [id, renderer, collection] of this.allRenderers()) {
            renderer.dispose();
            collection.delete(id);
        }
        this.handleDisplayChange({ source: preference_tree_model_1.PreferenceFilterChangeSource.Schema });
    }
    handleSchemaChange(isFiltered) {
        var _a;
        for (const [id, renderer, collection] of this.allRenderers()) {
            const node = this.model.getNode(renderer.nodeId);
            if (!node || (preference_types_1.Preference.LeafNode.is(node) && this.hasSchemaChanged(renderer, node))) {
                renderer.dispose();
                collection.delete(id);
            }
        }
        if (this.model.root) {
            const nodeIterator = Array.from(this.scrollContainer.children)[Symbol.iterator]();
            let nextNode = nodeIterator.next().value;
            for (const node of new browser_1.TopDownTreeIterator(this.model.root)) {
                if (preference_types_1.Preference.TreeNode.is(node)) {
                    const { collection, id } = this.analyzeIDAndGetRendererGroup(node.id);
                    const renderer = (_a = collection.get(id)) !== null && _a !== void 0 ? _a : this.rendererFactory(node);
                    if (!renderer.node.parentElement) { // If it hasn't been attached yet, it hasn't been checked for the current search.
                        this.hideIfFailsFilters(renderer, isFiltered);
                        collection.set(id, renderer);
                    }
                    if (nextNode !== renderer.node) {
                        if (nextNode) {
                            renderer.insertBefore(nextNode);
                        }
                        else {
                            renderer.appendTo(this.scrollContainer);
                        }
                    }
                    else {
                        nextNode = nodeIterator.next().value;
                    }
                }
            }
        }
    }
    handleScopeChange(isFiltered = this.model.isFiltered) {
        var _a;
        for (const [, renderer] of this.allRenderers()) {
            const isHidden = this.hideIfFailsFilters(renderer, isFiltered);
            if (isFiltered || !isHidden) {
                (_a = renderer.handleScopeChange) === null || _a === void 0 ? void 0 : _a.call(renderer, isFiltered);
            }
        }
    }
    hasSchemaChanged(renderer, node) {
        return !deepEqual(renderer.schema, node.preference.data);
    }
    handleSearchChange(isFiltered, leavesAreVisible) {
        var _a;
        if (leavesAreVisible) {
            for (const [, renderer] of this.allRenderers()) {
                const isHidden = this.hideIfFailsFilters(renderer, isFiltered);
                if (!isHidden) {
                    (_a = renderer.handleSearchChange) === null || _a === void 0 ? void 0 : _a.call(renderer, isFiltered);
                }
            }
        }
    }
    areLeavesVisible() {
        const leavesAreVisible = this.model.totalVisibleLeaves > 0;
        this.node.classList.toggle('no-results', !leavesAreVisible);
        this.scrollContainer.classList.toggle('hidden', !leavesAreVisible);
        return leavesAreVisible;
    }
    *allRenderers() {
        for (const [id, renderer] of this.commonlyUsedRenderers.entries()) {
            yield [id, renderer, this.commonlyUsedRenderers];
        }
        for (const [id, renderer] of this.renderers.entries()) {
            yield [id, renderer, this.renderers];
        }
    }
    handlePreferenceChanges(e) {
        var _a, _b, _c, _d;
        for (const id of Object.keys(e)) {
            (_b = (_a = this.commonlyUsedRenderers.get(id)) === null || _a === void 0 ? void 0 : _a.handleValueChange) === null || _b === void 0 ? void 0 : _b.call(_a);
            (_d = (_c = this.renderers.get(id)) === null || _c === void 0 ? void 0 : _c.handleValueChange) === null || _d === void 0 ? void 0 : _d.call(_c);
        }
    }
    /**
     * @returns true if the renderer is hidden, false otherwise.
     */
    hideIfFailsFilters(renderer, isFiltered) {
        const row = this.model.currentRows.get(renderer.nodeId);
        if (!row || (browser_1.CompositeTreeNode.is(row.node) && (isFiltered || row.visibleChildren === 0))) {
            renderer.hide();
            return true;
        }
        else {
            renderer.show();
            return false;
        }
    }
    resetScroll(nodeIDToScrollTo, filterWasCleared = false) {
        if (this.scrollBar) { // Absent on widget creation
            this.doResetScroll(nodeIDToScrollTo, filterWasCleared);
        }
        else {
            const interval = setInterval(() => {
                if (this.scrollBar) {
                    clearInterval(interval);
                    this.doResetScroll(nodeIDToScrollTo, filterWasCleared);
                }
            }, 500);
        }
    }
    doResetScroll(nodeIDToScrollTo, filterWasCleared = false) {
        requestAnimationFrame(() => {
            var _a;
            (_a = this.scrollBar) === null || _a === void 0 ? void 0 : _a.update();
            if (!filterWasCleared && nodeIDToScrollTo) {
                const { id, collection } = this.analyzeIDAndGetRendererGroup(nodeIDToScrollTo);
                const renderer = collection.get(id);
                if (renderer === null || renderer === void 0 ? void 0 : renderer.visible) {
                    renderer.node.scrollIntoView();
                    return;
                }
            }
            this.scrollContainer.scrollTop = 0;
        });
    }
    ;
    doOnScroll() {
        const { scrollContainer } = this;
        const firstVisibleChildID = this.findFirstVisibleChildID();
        this.setFirstVisibleChildID(firstVisibleChildID);
        if (this.isAtScrollTop && scrollContainer.scrollTop !== 0) {
            this.isAtScrollTop = false;
            this.tabbar.toggleShadow(true);
        }
        else if (!this.isAtScrollTop && scrollContainer.scrollTop === 0) {
            this.isAtScrollTop = true;
            this.tabbar.toggleShadow(false);
        }
    }
    ;
    findFirstVisibleChildID() {
        const { scrollTop } = this.scrollContainer;
        for (const [, renderer] of this.allRenderers()) {
            const { offsetTop, offsetHeight } = renderer.node;
            if (Math.abs(offsetTop - scrollTop) <= offsetHeight / 2) {
                return renderer.nodeId;
            }
        }
    }
    setFirstVisibleChildID(id) {
        if (id && id !== this.firstVisibleChildID) {
            this.firstVisibleChildID = id;
            let currentNode = this.model.getNode(id);
            let expansionAncestor;
            let selectionAncestor;
            while (currentNode && (!expansionAncestor || !selectionAncestor)) {
                if (!selectionAncestor && browser_1.SelectableTreeNode.is(currentNode)) {
                    selectionAncestor = currentNode;
                }
                if (!expansionAncestor && browser_1.ExpandableTreeNode.is(currentNode)) {
                    expansionAncestor = currentNode;
                }
                currentNode = currentNode.parent;
            }
            if (selectionAncestor) {
                this.currentModelSelectionId = selectionAncestor.id;
                expansionAncestor = expansionAncestor !== null && expansionAncestor !== void 0 ? expansionAncestor : selectionAncestor;
                this.model.selectIfNotSelected(selectionAncestor);
                if (!this.model.isFiltered && id !== this.lastUserSelection) {
                    this.lastUserSelection = '';
                    this.model.collapseAllExcept(expansionAncestor);
                }
            }
        }
    }
    handleSelectionChange(selectionEvent) {
        const node = selectionEvent[0];
        if (node && node.id !== this.currentModelSelectionId) {
            this.currentModelSelectionId = node.id;
            this.lastUserSelection = node.id;
            if (this.model.isFiltered && browser_1.CompositeTreeNode.is(node)) {
                for (const candidate of new browser_1.TopDownTreeIterator(node, { pruneSiblings: true })) {
                    const { id, collection } = this.analyzeIDAndGetRendererGroup(candidate.id);
                    const renderer = collection.get(id);
                    if (renderer === null || renderer === void 0 ? void 0 : renderer.visible) {
                        // When filtered, treat the first visible child as the selected node, since it will be the one scrolled to.
                        this.lastUserSelection = renderer.nodeId;
                        renderer.node.scrollIntoView();
                        return;
                    }
                }
            }
            else {
                const { id, collection } = this.analyzeIDAndGetRendererGroup(node.id);
                const renderer = collection.get(id);
                renderer === null || renderer === void 0 ? void 0 : renderer.node.scrollIntoView();
            }
        }
    }
    analyzeIDAndGetRendererGroup(nodeID) {
        const { id, group } = preference_types_1.Preference.TreeNode.getGroupAndIdFromNodeId(nodeID);
        const collection = group === preference_tree_generator_1.COMMONLY_USED_SECTION_PREFIX ? this.commonlyUsedRenderers : this.renderers;
        return { id, group, collection };
    }
    getScrollContainer() {
        return this.scrollContainer;
    }
    storeState() {
        return {
            firstVisibleChildID: this.firstVisibleChildID,
        };
    }
    restoreState(oldState) {
        this.firstVisibleChildID = oldState.firstVisibleChildID;
        this.resetScroll(this.firstVisibleChildID);
    }
};
PreferencesEditorWidget.ID = 'settings.editor';
PreferencesEditorWidget.LABEL = 'Settings Editor';
__decorate([
    (0, inversify_1.inject)(browser_1.PreferenceService),
    __metadata("design:type", Object)
], PreferencesEditorWidget.prototype, "preferenceService", void 0);
__decorate([
    (0, inversify_1.inject)(preference_tree_model_1.PreferenceTreeModel),
    __metadata("design:type", preference_tree_model_1.PreferenceTreeModel)
], PreferencesEditorWidget.prototype, "model", void 0);
__decorate([
    (0, inversify_1.inject)(preference_node_renderer_1.PreferenceNodeRendererFactory),
    __metadata("design:type", Function)
], PreferencesEditorWidget.prototype, "rendererFactory", void 0);
__decorate([
    (0, inversify_1.inject)(preference_node_renderer_creator_1.PreferenceNodeRendererCreatorRegistry),
    __metadata("design:type", Object)
], PreferencesEditorWidget.prototype, "rendererRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.PreferenceSchemaProvider),
    __metadata("design:type", browser_1.PreferenceSchemaProvider)
], PreferencesEditorWidget.prototype, "schemaProvider", void 0);
__decorate([
    (0, inversify_1.inject)(preference_scope_tabbar_widget_1.PreferencesScopeTabBar),
    __metadata("design:type", preference_scope_tabbar_widget_1.PreferencesScopeTabBar)
], PreferencesEditorWidget.prototype, "tabbar", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PreferencesEditorWidget.prototype, "init", null);
PreferencesEditorWidget = PreferencesEditorWidget_1 = __decorate([
    (0, inversify_1.injectable)()
], PreferencesEditorWidget);
exports.PreferencesEditorWidget = PreferencesEditorWidget;
//# sourceMappingURL=preference-editor-widget.js.map