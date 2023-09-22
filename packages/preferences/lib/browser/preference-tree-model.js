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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreferenceTreeModel = exports.PreferenceFilterChangeSource = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/core/lib/browser");
const core_1 = require("@theia/core");
const preference_searchbar_widget_1 = require("./views/preference-searchbar-widget");
const preference_tree_generator_1 = require("./util/preference-tree-generator");
const fuzzy = require("@theia/core/shared/fuzzy");
const preference_scope_tabbar_widget_1 = require("./views/preference-scope-tabbar-widget");
const preference_types_1 = require("./util/preference-types");
var PreferenceFilterChangeSource;
(function (PreferenceFilterChangeSource) {
    PreferenceFilterChangeSource[PreferenceFilterChangeSource["Schema"] = 0] = "Schema";
    PreferenceFilterChangeSource[PreferenceFilterChangeSource["Search"] = 1] = "Search";
    PreferenceFilterChangeSource[PreferenceFilterChangeSource["Scope"] = 2] = "Scope";
})(PreferenceFilterChangeSource = exports.PreferenceFilterChangeSource || (exports.PreferenceFilterChangeSource = {}));
let PreferenceTreeModel = class PreferenceTreeModel extends browser_1.TreeModelImpl {
    constructor() {
        super(...arguments);
        this.onTreeFilterChangedEmitter = new core_1.Emitter();
        this.onFilterChanged = this.onTreeFilterChangedEmitter.event;
        this.lastSearchedFuzzy = '';
        this.lastSearchedLiteral = '';
        this._currentScope = Number(preference_types_1.Preference.DEFAULT_SCOPE.scope);
        this._isFiltered = false;
        this._currentRows = new Map();
        this._totalVisibleLeaves = 0;
    }
    get currentRows() {
        return this._currentRows;
    }
    get totalVisibleLeaves() {
        return this._totalVisibleLeaves;
    }
    get isFiltered() {
        return this._isFiltered;
    }
    get propertyList() {
        return this.schemaProvider.getCombinedSchema().properties;
    }
    get currentScope() {
        return this.scopeTracker.currentScope;
    }
    get onSchemaChanged() {
        return this.treeGenerator.onSchemaChanged;
    }
    init() {
        this.doInit();
    }
    async doInit() {
        super.init();
        this.toDispose.pushAll([
            this.treeGenerator.onSchemaChanged(newTree => this.handleNewSchema(newTree)),
            this.scopeTracker.onScopeChanged(scopeDetails => {
                this._currentScope = scopeDetails.scope;
                this.updateFilteredRows(PreferenceFilterChangeSource.Scope);
            }),
            this.filterInput.onFilterChanged(newSearchTerm => {
                this.lastSearchedLiteral = newSearchTerm;
                this.lastSearchedFuzzy = newSearchTerm.replace(/\s/g, '');
                this._isFiltered = newSearchTerm.length > 2;
                if (this.isFiltered) {
                    this.expandAll();
                }
                else if (browser_1.CompositeTreeNode.is(this.root)) {
                    this.collapseAll(this.root);
                }
                this.updateFilteredRows(PreferenceFilterChangeSource.Search);
            }),
            this.onFilterChanged(() => {
                this.filterInput.updateResultsCount(this._totalVisibleLeaves);
            }),
            this.onTreeFilterChangedEmitter,
        ]);
        await this.preferenceService.ready;
        this.handleNewSchema(this.treeGenerator.root);
    }
    handleNewSchema(newRoot) {
        this.root = newRoot;
        if (this.isFiltered) {
            this.expandAll();
        }
        this.updateFilteredRows(PreferenceFilterChangeSource.Schema);
    }
    updateRows() {
        const root = this.root;
        this._currentRows = new Map();
        if (root) {
            this._totalVisibleLeaves = 0;
            let index = 0;
            for (const node of new browser_1.TopDownTreeIterator(root, {
                pruneCollapsed: false,
                pruneSiblings: true
            })) {
                if (browser_1.TreeNode.isVisible(node) && preference_types_1.Preference.TreeNode.is(node)) {
                    const { id } = preference_types_1.Preference.TreeNode.getGroupAndIdFromNodeId(node.id);
                    if (browser_1.CompositeTreeNode.is(node) || this.passesCurrentFilters(node, id)) {
                        this.updateVisibleChildren(node);
                        this._currentRows.set(node.id, {
                            index: index++,
                            node,
                            depth: node.depth,
                            visibleChildren: 0,
                        });
                    }
                }
            }
        }
    }
    updateFilteredRows(source) {
        this.updateRows();
        this.onTreeFilterChangedEmitter.fire({ source });
    }
    passesCurrentFilters(node, prefID) {
        var _a;
        if (!this.schemaProvider.isValidInScope(prefID, this._currentScope)) {
            return false;
        }
        if (!this._isFiltered) {
            return true;
        }
        // When filtering, VSCode will render an item that is present in the commonly used section only once but render both its possible parents in the left-hand tree.
        // E.g. searching for editor.renderWhitespace will show one item in the main panel, but both 'Commonly Used' and 'Text Editor' in the left tree.
        // That seems counterintuitive and introduces a number of special cases, so I prefer to remove the commonly used section entirely when the user searches.
        if (node.id.startsWith(preference_tree_generator_1.COMMONLY_USED_SECTION_PREFIX)) {
            return false;
        }
        return fuzzy.test(this.lastSearchedFuzzy, prefID) // search matches preference name.
            // search matches description. Fuzzy isn't ideal here because the score depends on the order of discovery.
            || ((_a = node.preference.data.description) !== null && _a !== void 0 ? _a : '').includes(this.lastSearchedLiteral);
    }
    isVisibleSelectableNode(node) {
        var _a;
        return browser_1.CompositeTreeNode.is(node) && !!((_a = this._currentRows.get(node.id)) === null || _a === void 0 ? void 0 : _a.visibleChildren);
    }
    updateVisibleChildren(node) {
        var _a, _b, _c, _d;
        if (!browser_1.CompositeTreeNode.is(node)) {
            this._totalVisibleLeaves++;
            let nextParent = ((_a = node.parent) === null || _a === void 0 ? void 0 : _a.id) && this._currentRows.get((_b = node.parent) === null || _b === void 0 ? void 0 : _b.id);
            while (nextParent && nextParent.node !== this.root) {
                if (nextParent) {
                    nextParent.visibleChildren += 1;
                }
                nextParent = ((_c = nextParent.node.parent) === null || _c === void 0 ? void 0 : _c.id) && this._currentRows.get((_d = nextParent.node.parent) === null || _d === void 0 ? void 0 : _d.id);
                if (nextParent) {
                    nextParent.isExpansible = true;
                }
            }
        }
    }
    collapseAllExcept(openNode) {
        if (browser_1.ExpandableTreeNode.is(openNode)) {
            this.expandNode(openNode);
        }
        if (browser_1.CompositeTreeNode.is(this.root)) {
            this.root.children.forEach(child => {
                if (child !== openNode && browser_1.ExpandableTreeNode.is(child)) {
                    this.collapseNode(child);
                }
            });
        }
    }
    expandAll() {
        if (browser_1.CompositeTreeNode.is(this.root)) {
            this.root.children.forEach(child => {
                if (browser_1.ExpandableTreeNode.is(child)) {
                    this.expandNode(child);
                }
            });
        }
    }
    getNodeFromPreferenceId(id) {
        const node = this.getNode(this.treeGenerator.getNodeId(id));
        return node && preference_types_1.Preference.TreeNode.is(node) ? node : undefined;
    }
    /**
     * @returns true if selection changed, false otherwise
     */
    selectIfNotSelected(node) {
        const currentlySelected = this.selectedNodes[0];
        if (node !== currentlySelected) {
            this.selectNode(node);
            return true;
        }
        return false;
    }
};
__decorate([
    (0, inversify_1.inject)(browser_1.PreferenceSchemaProvider),
    __metadata("design:type", browser_1.PreferenceSchemaProvider)
], PreferenceTreeModel.prototype, "schemaProvider", void 0);
__decorate([
    (0, inversify_1.inject)(preference_searchbar_widget_1.PreferencesSearchbarWidget),
    __metadata("design:type", preference_searchbar_widget_1.PreferencesSearchbarWidget)
], PreferenceTreeModel.prototype, "filterInput", void 0);
__decorate([
    (0, inversify_1.inject)(preference_tree_generator_1.PreferenceTreeGenerator),
    __metadata("design:type", preference_tree_generator_1.PreferenceTreeGenerator)
], PreferenceTreeModel.prototype, "treeGenerator", void 0);
__decorate([
    (0, inversify_1.inject)(preference_scope_tabbar_widget_1.PreferencesScopeTabBar),
    __metadata("design:type", preference_scope_tabbar_widget_1.PreferencesScopeTabBar)
], PreferenceTreeModel.prototype, "scopeTracker", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.PreferenceService),
    __metadata("design:type", Object)
], PreferenceTreeModel.prototype, "preferenceService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PreferenceTreeModel.prototype, "init", null);
PreferenceTreeModel = __decorate([
    (0, inversify_1.injectable)()
], PreferenceTreeModel);
exports.PreferenceTreeModel = PreferenceTreeModel;
//# sourceMappingURL=preference-tree-model.js.map