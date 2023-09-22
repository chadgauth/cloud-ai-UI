"use strict";
(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_navigator_lib_browser_navigator-widget-factory_js"],{

/***/ "../../packages/navigator/lib/browser/abstract-navigator-tree-widget.js":
/*!******************************************************************************!*\
  !*** ../../packages/navigator/lib/browser/abstract-navigator-tree-widget.js ***!
  \******************************************************************************/
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
exports.AbstractNavigatorTreeWidget = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const navigator_preferences_1 = __webpack_require__(/*! ./navigator-preferences */ "../../packages/navigator/lib/browser/navigator-preferences.js");
const preference_service_1 = __webpack_require__(/*! @theia/core/lib/browser/preferences/preference-service */ "../../packages/core/lib/browser/preferences/preference-service.js");
const browser_1 = __webpack_require__(/*! @theia/filesystem/lib/browser */ "../../packages/filesystem/lib/browser/index.js");
let AbstractNavigatorTreeWidget = class AbstractNavigatorTreeWidget extends browser_1.FileTreeWidget {
    init() {
        super.init();
        this.toDispose.push(this.preferenceService.onPreferenceChanged(preference => {
            if (preference.preferenceName === 'explorer.decorations.colors') {
                this.update();
            }
        }));
    }
    decorateCaption(node, attrs) {
        const attributes = super.decorateCaption(node, attrs);
        if (this.navigatorPreferences.get('explorer.decorations.colors')) {
            return attributes;
        }
        else {
            return {
                ...attributes,
                style: {
                    ...attributes.style,
                    color: undefined,
                }
            };
        }
    }
};
__decorate([
    (0, inversify_1.inject)(preference_service_1.PreferenceService),
    __metadata("design:type", Object)
], AbstractNavigatorTreeWidget.prototype, "preferenceService", void 0);
__decorate([
    (0, inversify_1.inject)(navigator_preferences_1.FileNavigatorPreferences),
    __metadata("design:type", Object)
], AbstractNavigatorTreeWidget.prototype, "navigatorPreferences", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AbstractNavigatorTreeWidget.prototype, "init", null);
AbstractNavigatorTreeWidget = __decorate([
    (0, inversify_1.injectable)()
], AbstractNavigatorTreeWidget);
exports.AbstractNavigatorTreeWidget = AbstractNavigatorTreeWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/navigator/lib/browser/abstract-navigator-tree-widget'] = this;


/***/ }),

/***/ "../../packages/navigator/lib/browser/navigator-context-key-service.js":
/*!*****************************************************************************!*\
  !*** ../../packages/navigator/lib/browser/navigator-context-key-service.js ***!
  \*****************************************************************************/
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
exports.NavigatorContextKeyService = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const context_key_service_1 = __webpack_require__(/*! @theia/core/lib/browser/context-key-service */ "../../packages/core/lib/browser/context-key-service.js");
let NavigatorContextKeyService = class NavigatorContextKeyService {
    get explorerViewletVisible() {
        return this._explorerViewletVisible;
    }
    /** True if Explorer view has keyboard focus. */
    get explorerViewletFocus() {
        return this._explorerViewletFocus;
    }
    /** True if File Explorer section has keyboard focus. */
    get filesExplorerFocus() {
        return this._filesExplorerFocus;
    }
    get explorerResourceIsFolder() {
        return this._explorerResourceIsFolder;
    }
    init() {
        this._explorerViewletVisible = this.contextKeyService.createKey('explorerViewletVisible', false);
        this._explorerViewletFocus = this.contextKeyService.createKey('explorerViewletFocus', false);
        this._filesExplorerFocus = this.contextKeyService.createKey('filesExplorerFocus', false);
        this._explorerResourceIsFolder = this.contextKeyService.createKey('explorerResourceIsFolder', false);
    }
};
__decorate([
    (0, inversify_1.inject)(context_key_service_1.ContextKeyService),
    __metadata("design:type", Object)
], NavigatorContextKeyService.prototype, "contextKeyService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NavigatorContextKeyService.prototype, "init", null);
NavigatorContextKeyService = __decorate([
    (0, inversify_1.injectable)()
], NavigatorContextKeyService);
exports.NavigatorContextKeyService = NavigatorContextKeyService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/navigator/lib/browser/navigator-context-key-service'] = this;


/***/ }),

/***/ "../../packages/navigator/lib/browser/navigator-filter.js":
/*!****************************************************************!*\
  !*** ../../packages/navigator/lib/browser/navigator-filter.js ***!
  \****************************************************************/
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
exports.FileNavigatorFilterPredicate = exports.FileNavigatorFilter = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const minimatch_1 = __webpack_require__(/*! minimatch */ "../../packages/navigator/node_modules/minimatch/minimatch.js");
const event_1 = __webpack_require__(/*! @theia/core/lib/common/event */ "../../packages/core/lib/common/event.js");
const filesystem_preferences_1 = __webpack_require__(/*! @theia/filesystem/lib/browser/filesystem-preferences */ "../../packages/filesystem/lib/browser/filesystem-preferences.js");
const navigator_preferences_1 = __webpack_require__(/*! ./navigator-preferences */ "../../packages/navigator/lib/browser/navigator-preferences.js");
/**
 * Filter for omitting elements from the navigator. For more details on the exclusion patterns,
 * one should check either the manual with `man 5 gitignore` or just [here](https://git-scm.com/docs/gitignore).
 */
let FileNavigatorFilter = class FileNavigatorFilter {
    constructor(preferences) {
        this.preferences = preferences;
        this.emitter = new event_1.Emitter();
    }
    init() {
        this.doInit();
    }
    async doInit() {
        this.filterPredicate = this.createFilterPredicate(this.filesPreferences['files.exclude']);
        this.filesPreferences.onPreferenceChanged(event => this.onFilesPreferenceChanged(event));
        this.preferences.onPreferenceChanged(event => this.onPreferenceChanged(event));
    }
    async filter(items) {
        return (await items).filter(item => this.filterItem(item));
    }
    get onFilterChanged() {
        return this.emitter.event;
    }
    filterItem(item) {
        return this.filterPredicate.filter(item);
    }
    fireFilterChanged() {
        this.emitter.fire(undefined);
    }
    onFilesPreferenceChanged(event) {
        const { preferenceName, newValue } = event;
        if (preferenceName === 'files.exclude') {
            this.filterPredicate = this.createFilterPredicate(newValue || {});
            this.fireFilterChanged();
        }
    }
    onPreferenceChanged(event) {
    }
    createFilterPredicate(exclusions) {
        return new FileNavigatorFilterPredicate(this.interceptExclusions(exclusions));
    }
    toggleHiddenFiles() {
        this.showHiddenFiles = !this.showHiddenFiles;
        const filesExcludes = this.filesPreferences['files.exclude'];
        this.filterPredicate = this.createFilterPredicate(filesExcludes || {});
        this.fireFilterChanged();
    }
    interceptExclusions(exclusions) {
        return {
            ...exclusions,
            '**/.*': this.showHiddenFiles
        };
    }
};
__decorate([
    (0, inversify_1.inject)(filesystem_preferences_1.FileSystemPreferences),
    __metadata("design:type", Object)
], FileNavigatorFilter.prototype, "filesPreferences", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FileNavigatorFilter.prototype, "init", null);
FileNavigatorFilter = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(navigator_preferences_1.FileNavigatorPreferences)),
    __metadata("design:paramtypes", [Object])
], FileNavigatorFilter);
exports.FileNavigatorFilter = FileNavigatorFilter;
(function (FileNavigatorFilter) {
    let Predicate;
    (function (Predicate) {
        /**
         * Wraps a bunch of predicates and returns with a new one that evaluates to `true` if
         * each of the wrapped predicates evaluates to `true`. Otherwise, `false`.
         */
        function and(...predicates) {
            return {
                filter: id => predicates.every(predicate => predicate.filter(id))
            };
        }
        Predicate.and = and;
    })(Predicate = FileNavigatorFilter.Predicate || (FileNavigatorFilter.Predicate = {}));
})(FileNavigatorFilter = exports.FileNavigatorFilter || (exports.FileNavigatorFilter = {}));
exports.FileNavigatorFilter = FileNavigatorFilter;
/**
 * Concrete filter navigator filter predicate that is decoupled from the preferences.
 */
class FileNavigatorFilterPredicate {
    constructor(exclusions) {
        const patterns = Object.keys(exclusions).map(pattern => ({ pattern, enabled: exclusions[pattern] })).filter(object => object.enabled).map(object => object.pattern);
        this.delegate = FileNavigatorFilter.Predicate.and(...patterns.map(pattern => this.createDelegate(pattern)));
    }
    filter(item) {
        return this.delegate.filter(item);
    }
    createDelegate(pattern) {
        const delegate = new minimatch_1.Minimatch(pattern, { matchBase: true });
        return {
            filter: item => !delegate.match(item.id)
        };
    }
}
exports.FileNavigatorFilterPredicate = FileNavigatorFilterPredicate;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/navigator/lib/browser/navigator-filter'] = this;


/***/ }),

/***/ "../../packages/navigator/lib/browser/navigator-model.js":
/*!***************************************************************!*\
  !*** ../../packages/navigator/lib/browser/navigator-model.js ***!
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
exports.FileNavigatorModel = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/filesystem/lib/browser */ "../../packages/filesystem/lib/browser/index.js");
const browser_2 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const navigator_tree_1 = __webpack_require__(/*! ./navigator-tree */ "../../packages/navigator/lib/browser/navigator-tree.js");
const browser_3 = __webpack_require__(/*! @theia/workspace/lib/browser */ "../../packages/workspace/lib/browser/index.js");
const frontend_application_state_1 = __webpack_require__(/*! @theia/core/lib/browser/frontend-application-state */ "../../packages/core/lib/browser/frontend-application-state.js");
const progress_service_1 = __webpack_require__(/*! @theia/core/lib/common/progress-service */ "../../packages/core/lib/common/progress-service.js");
const promise_util_1 = __webpack_require__(/*! @theia/core/lib/common/promise-util */ "../../packages/core/lib/common/promise-util.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
let FileNavigatorModel = class FileNavigatorModel extends browser_1.FileTreeModel {
    constructor() {
        super(...arguments);
        this.pendingBusyProgress = new Map();
    }
    init() {
        super.init();
        this.reportBusyProgress();
        this.initializeRoot();
    }
    reportBusyProgress() {
        this.toDispose.push(this.onDidChangeBusy(node => {
            const pending = this.pendingBusyProgress.get(node.id);
            if (pending) {
                if (!node.busy) {
                    pending.resolve();
                    this.pendingBusyProgress.delete(node.id);
                }
                return;
            }
            if (node.busy) {
                const progress = new promise_util_1.Deferred();
                this.pendingBusyProgress.set(node.id, progress);
                this.progressService.withProgress('', 'explorer', () => progress.promise);
            }
        }));
        this.toDispose.push(disposable_1.Disposable.create(() => {
            for (const pending of this.pendingBusyProgress.values()) {
                pending.resolve();
            }
            this.pendingBusyProgress.clear();
        }));
    }
    async initializeRoot() {
        await Promise.all([
            this.applicationState.reachedState('initialized_layout'),
            this.workspaceService.roots
        ]);
        await this.updateRoot();
        if (this.toDispose.disposed) {
            return;
        }
        this.toDispose.push(this.workspaceService.onWorkspaceChanged(() => this.updateRoot()));
        this.toDispose.push(this.workspaceService.onWorkspaceLocationChanged(() => this.updateRoot()));
        if (this.selectedNodes.length) {
            return;
        }
        const root = this.root;
        if (browser_2.CompositeTreeNode.is(root) && root.children.length === 1) {
            const child = root.children[0];
            if (browser_2.SelectableTreeNode.is(child) && !child.selected && browser_2.ExpandableTreeNode.is(child)) {
                this.selectNode(child);
                this.expandNode(child);
            }
        }
    }
    previewNode(node) {
        if (browser_1.FileNode.is(node)) {
            (0, browser_2.open)(this.openerService, node.uri, { mode: 'reveal', preview: true });
        }
    }
    doOpenNode(node) {
        if (node.visible === false) {
            return;
        }
        else if (browser_1.FileNode.is(node)) {
            (0, browser_2.open)(this.openerService, node.uri);
        }
        else {
            super.doOpenNode(node);
        }
    }
    *getNodesByUri(uri) {
        const workspace = this.root;
        if (navigator_tree_1.WorkspaceNode.is(workspace)) {
            for (const root of workspace.children) {
                const id = this.tree.createId(root, uri);
                const node = this.getNode(id);
                if (node) {
                    yield node;
                }
            }
        }
    }
    async updateRoot() {
        this.root = await this.createRoot();
    }
    async createRoot() {
        if (this.workspaceService.opened) {
            const stat = this.workspaceService.workspace;
            const isMulti = (stat) ? !stat.isDirectory : false;
            const workspaceNode = isMulti
                ? this.createMultipleRootNode()
                : navigator_tree_1.WorkspaceNode.createRoot();
            const roots = await this.workspaceService.roots;
            for (const root of roots) {
                workspaceNode.children.push(await this.tree.createWorkspaceRoot(root, workspaceNode));
            }
            return workspaceNode;
        }
    }
    /**
     * Create multiple root node used to display
     * the multiple root workspace name.
     *
     * @returns `WorkspaceNode`
     */
    createMultipleRootNode() {
        const workspace = this.workspaceService.workspace;
        let name = workspace
            ? workspace.resource.path.name
            : 'untitled';
        name += ' (Workspace)';
        return navigator_tree_1.WorkspaceNode.createRoot(name);
    }
    /**
     * Move the given source file or directory to the given target directory.
     */
    async move(source, target) {
        if (source.parent && navigator_tree_1.WorkspaceRootNode.is(source)) {
            // do not support moving a root folder
            return undefined;
        }
        return super.move(source, target);
    }
    /**
     * Reveals node in the navigator by given file uri.
     *
     * @param uri uri to file which should be revealed in the navigator
     * @returns file tree node if the file with given uri was revealed, undefined otherwise
     */
    async revealFile(uri) {
        if (!uri.path.isAbsolute) {
            return undefined;
        }
        let node = this.getNodeClosestToRootByUri(uri);
        // success stop condition
        // we have to reach workspace root because expanded node could be inside collapsed one
        if (navigator_tree_1.WorkspaceRootNode.is(node)) {
            if (browser_2.ExpandableTreeNode.is(node)) {
                if (!node.expanded) {
                    node = await this.expandNode(node);
                }
                return node;
            }
            // shouldn't happen, root node is always directory, i.e. expandable
            return undefined;
        }
        // fail stop condition
        if (uri.path.isRoot) {
            // file system root is reached but workspace root wasn't found, it means that
            // given uri is not in workspace root folder or points to not existing file.
            return undefined;
        }
        if (await this.revealFile(uri.parent)) {
            if (node === undefined) {
                // get node if it wasn't mounted into navigator tree before expansion
                node = this.getNodeClosestToRootByUri(uri);
            }
            if (browser_2.ExpandableTreeNode.is(node) && !node.expanded) {
                node = await this.expandNode(node);
            }
            return node;
        }
        return undefined;
    }
    getNodeClosestToRootByUri(uri) {
        const nodes = [...this.getNodesByUri(uri)];
        return nodes.length > 0
            ? nodes.reduce((node1, node2) => // return the node closest to the workspace root
             node1.id.length >= node2.id.length ? node1 : node2) : undefined;
    }
};
__decorate([
    (0, inversify_1.inject)(browser_2.OpenerService),
    __metadata("design:type", Object)
], FileNavigatorModel.prototype, "openerService", void 0);
__decorate([
    (0, inversify_1.inject)(navigator_tree_1.FileNavigatorTree),
    __metadata("design:type", navigator_tree_1.FileNavigatorTree)
], FileNavigatorModel.prototype, "tree", void 0);
__decorate([
    (0, inversify_1.inject)(browser_3.WorkspaceService),
    __metadata("design:type", browser_3.WorkspaceService)
], FileNavigatorModel.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(frontend_application_state_1.FrontendApplicationStateService),
    __metadata("design:type", frontend_application_state_1.FrontendApplicationStateService)
], FileNavigatorModel.prototype, "applicationState", void 0);
__decorate([
    (0, inversify_1.inject)(progress_service_1.ProgressService),
    __metadata("design:type", progress_service_1.ProgressService)
], FileNavigatorModel.prototype, "progressService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FileNavigatorModel.prototype, "init", null);
FileNavigatorModel = __decorate([
    (0, inversify_1.injectable)()
], FileNavigatorModel);
exports.FileNavigatorModel = FileNavigatorModel;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/navigator/lib/browser/navigator-model'] = this;


/***/ }),

/***/ "../../packages/navigator/lib/browser/navigator-preferences.js":
/*!*********************************************************************!*\
  !*** ../../packages/navigator/lib/browser/navigator-preferences.js ***!
  \*********************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.bindFileNavigatorPreferences = exports.createNavigatorPreferences = exports.FileNavigatorPreferences = exports.FileNavigatorPreferenceContribution = exports.FileNavigatorConfigSchema = exports.EXPLORER_COMPACT_FOLDERS = void 0;
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
exports.EXPLORER_COMPACT_FOLDERS = 'explorer.compactFolders';
exports.FileNavigatorConfigSchema = {
    'type': 'object',
    properties: {
        'explorer.autoReveal': {
            type: 'boolean',
            description: nls_1.nls.localizeByDefault('Controls whether the Explorer should automatically reveal and select files when opening them.'),
            default: true
        },
        'explorer.decorations.colors': {
            type: 'boolean',
            description: nls_1.nls.localizeByDefault('Controls whether file decorations should use colors.'),
            default: true
        },
        [exports.EXPLORER_COMPACT_FOLDERS]: {
            type: 'boolean',
            // eslint-disable-next-line max-len
            description: nls_1.nls.localizeByDefault('Controls whether the Explorer should render folders in a compact form. In such a form, single child folders will be compressed in a combined tree element. Useful for Java package structures, for example.'),
            default: true,
        }
    },
};
exports.FileNavigatorPreferenceContribution = Symbol('FileNavigatorPreferenceContribution');
exports.FileNavigatorPreferences = Symbol('NavigatorPreferences');
function createNavigatorPreferences(preferences, schema = exports.FileNavigatorConfigSchema) {
    return (0, browser_1.createPreferenceProxy)(preferences, schema);
}
exports.createNavigatorPreferences = createNavigatorPreferences;
function bindFileNavigatorPreferences(bind) {
    bind(exports.FileNavigatorPreferences).toDynamicValue(ctx => {
        const preferences = ctx.container.get(browser_1.PreferenceService);
        const contribution = ctx.container.get(exports.FileNavigatorPreferenceContribution);
        return createNavigatorPreferences(preferences, contribution.schema);
    }).inSingletonScope();
    bind(exports.FileNavigatorPreferenceContribution).toConstantValue({ schema: exports.FileNavigatorConfigSchema });
    bind(browser_1.PreferenceContribution).toService(exports.FileNavigatorPreferenceContribution);
}
exports.bindFileNavigatorPreferences = bindFileNavigatorPreferences;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/navigator/lib/browser/navigator-preferences'] = this;


/***/ }),

/***/ "../../packages/navigator/lib/browser/navigator-tree.js":
/*!**************************************************************!*\
  !*** ../../packages/navigator/lib/browser/navigator-tree.js ***!
  \**************************************************************/
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
exports.WorkspaceRootNode = exports.WorkspaceNode = exports.FileNavigatorTree = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/filesystem/lib/browser */ "../../packages/filesystem/lib/browser/index.js");
const browser_2 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const navigator_filter_1 = __webpack_require__(/*! ./navigator-filter */ "../../packages/navigator/lib/browser/navigator-filter.js");
const navigator_preferences_1 = __webpack_require__(/*! ./navigator-preferences */ "../../packages/navigator/lib/browser/navigator-preferences.js");
let FileNavigatorTree = class FileNavigatorTree extends browser_1.FileTree {
    init() {
        this.toDispose.push(this.filter.onFilterChanged(() => this.refresh()));
        this.navigatorPreferences.ready.then(() => this.toggleCompression());
        this.toDispose.push(this.navigatorPreferences.onPreferenceChanged(({ preferenceName }) => {
            if (preferenceName === navigator_preferences_1.EXPLORER_COMPACT_FOLDERS) {
                this.toggleCompression();
            }
        }));
    }
    toggleCompression() {
        this.compressionToggle.compress = this.navigatorPreferences.get(navigator_preferences_1.EXPLORER_COMPACT_FOLDERS, true);
        this.refresh();
    }
    async resolveChildren(parent) {
        if (WorkspaceNode.is(parent)) {
            return parent.children;
        }
        return this.filter.filter(super.resolveChildren(parent));
    }
    toNodeId(uri, parent) {
        const workspaceRootNode = WorkspaceRootNode.find(parent);
        if (workspaceRootNode) {
            return this.createId(workspaceRootNode, uri);
        }
        return super.toNodeId(uri, parent);
    }
    createId(root, uri) {
        const id = super.toNodeId(uri, root);
        return id === root.id ? id : `${root.id}:${id}`;
    }
    async createWorkspaceRoot(rootFolder, workspaceNode) {
        const node = this.toNode(rootFolder, workspaceNode);
        Object.assign(node, {
            visible: workspaceNode.name !== WorkspaceNode.name,
        });
        return node;
    }
};
__decorate([
    (0, inversify_1.inject)(navigator_filter_1.FileNavigatorFilter),
    __metadata("design:type", navigator_filter_1.FileNavigatorFilter)
], FileNavigatorTree.prototype, "filter", void 0);
__decorate([
    (0, inversify_1.inject)(navigator_preferences_1.FileNavigatorPreferences),
    __metadata("design:type", Object)
], FileNavigatorTree.prototype, "navigatorPreferences", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.CompressionToggle),
    __metadata("design:type", Object)
], FileNavigatorTree.prototype, "compressionToggle", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FileNavigatorTree.prototype, "init", null);
FileNavigatorTree = __decorate([
    (0, inversify_1.injectable)()
], FileNavigatorTree);
exports.FileNavigatorTree = FileNavigatorTree;
var WorkspaceNode;
(function (WorkspaceNode) {
    WorkspaceNode.id = 'WorkspaceNodeId';
    WorkspaceNode.name = 'WorkspaceNode';
    function is(node) {
        return browser_2.CompositeTreeNode.is(node) && node.id === WorkspaceNode.id;
    }
    WorkspaceNode.is = is;
    /**
     * Create a `WorkspaceNode` that can be used as a `Tree` root.
     */
    function createRoot(multiRootName) {
        return {
            id: WorkspaceNode.id,
            name: multiRootName || WorkspaceNode.name,
            parent: undefined,
            children: [],
            visible: false,
            selected: false
        };
    }
    WorkspaceNode.createRoot = createRoot;
})(WorkspaceNode = exports.WorkspaceNode || (exports.WorkspaceNode = {}));
var WorkspaceRootNode;
(function (WorkspaceRootNode) {
    function is(node) {
        return browser_1.DirNode.is(node) && WorkspaceNode.is(node.parent);
    }
    WorkspaceRootNode.is = is;
    function find(node) {
        if (node) {
            if (is(node)) {
                return node;
            }
            return find(node.parent);
        }
    }
    WorkspaceRootNode.find = find;
})(WorkspaceRootNode = exports.WorkspaceRootNode || (exports.WorkspaceRootNode = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/navigator/lib/browser/navigator-tree'] = this;


/***/ }),

/***/ "../../packages/navigator/lib/browser/navigator-widget-factory.js":
/*!************************************************************************!*\
  !*** ../../packages/navigator/lib/browser/navigator-widget-factory.js ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2021 SAP SE or an SAP affiliate company and others.
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
var NavigatorWidgetFactory_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NavigatorWidgetFactory = exports.EXPLORER_VIEW_CONTAINER_TITLE_OPTIONS = exports.EXPLORER_VIEW_CONTAINER_ID = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const navigator_widget_1 = __webpack_require__(/*! ./navigator-widget */ "../../packages/navigator/lib/browser/navigator-widget.js");
const navigator_open_editors_widget_1 = __webpack_require__(/*! ./open-editors-widget/navigator-open-editors-widget */ "../../packages/navigator/lib/browser/open-editors-widget/navigator-open-editors-widget.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
exports.EXPLORER_VIEW_CONTAINER_ID = 'explorer-view-container';
exports.EXPLORER_VIEW_CONTAINER_TITLE_OPTIONS = {
    label: nls_1.nls.localizeByDefault('Explorer'),
    iconClass: (0, browser_1.codicon)('files'),
    closeable: true
};
let NavigatorWidgetFactory = NavigatorWidgetFactory_1 = class NavigatorWidgetFactory {
    constructor() {
        this.id = NavigatorWidgetFactory_1.ID;
        this.openEditorsWidgetOptions = {
            order: 0,
            canHide: true,
            initiallyCollapsed: true,
            // this property currently has no effect (https://github.com/eclipse-theia/theia/issues/7755)
            weight: 20
        };
        this.fileNavigatorWidgetOptions = {
            order: 1,
            canHide: false,
            initiallyCollapsed: false,
            weight: 80,
            disableDraggingToOtherContainers: true
        };
    }
    async createWidget() {
        const viewContainer = this.viewContainerFactory({
            id: exports.EXPLORER_VIEW_CONTAINER_ID,
            progressLocationId: 'explorer'
        });
        viewContainer.setTitleOptions(exports.EXPLORER_VIEW_CONTAINER_TITLE_OPTIONS);
        const openEditorsWidget = await this.widgetManager.getOrCreateWidget(navigator_open_editors_widget_1.OpenEditorsWidget.ID);
        const navigatorWidget = await this.widgetManager.getOrCreateWidget(navigator_widget_1.FILE_NAVIGATOR_ID);
        viewContainer.addWidget(navigatorWidget, this.fileNavigatorWidgetOptions);
        viewContainer.addWidget(openEditorsWidget, this.openEditorsWidgetOptions);
        return viewContainer;
    }
};
NavigatorWidgetFactory.ID = exports.EXPLORER_VIEW_CONTAINER_ID;
__decorate([
    (0, inversify_1.inject)(browser_1.ViewContainer.Factory),
    __metadata("design:type", Function)
], NavigatorWidgetFactory.prototype, "viewContainerFactory", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.WidgetManager),
    __metadata("design:type", browser_1.WidgetManager)
], NavigatorWidgetFactory.prototype, "widgetManager", void 0);
NavigatorWidgetFactory = NavigatorWidgetFactory_1 = __decorate([
    (0, inversify_1.injectable)()
], NavigatorWidgetFactory);
exports.NavigatorWidgetFactory = NavigatorWidgetFactory;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/navigator/lib/browser/navigator-widget-factory'] = this;


/***/ }),

/***/ "../../packages/navigator/lib/browser/navigator-widget.js":
/*!****************************************************************!*\
  !*** ../../packages/navigator/lib/browser/navigator-widget.js ***!
  \****************************************************************/
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
exports.FileNavigatorWidget = exports.CLASS = exports.LABEL = exports.FILE_NAVIGATOR_ID = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const browser_2 = __webpack_require__(/*! @theia/filesystem/lib/browser */ "../../packages/filesystem/lib/browser/index.js");
const browser_3 = __webpack_require__(/*! @theia/workspace/lib/browser */ "../../packages/workspace/lib/browser/index.js");
const navigator_tree_1 = __webpack_require__(/*! ./navigator-tree */ "../../packages/navigator/lib/browser/navigator-tree.js");
const navigator_model_1 = __webpack_require__(/*! ./navigator-model */ "../../packages/navigator/lib/browser/navigator-model.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const navigator_context_key_service_1 = __webpack_require__(/*! ./navigator-context-key-service */ "../../packages/navigator/lib/browser/navigator-context-key-service.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
const abstract_navigator_tree_widget_1 = __webpack_require__(/*! ./abstract-navigator-tree-widget */ "../../packages/navigator/lib/browser/abstract-navigator-tree-widget.js");
exports.FILE_NAVIGATOR_ID = 'files';
exports.LABEL = nls_1.nls.localizeByDefault('No Folder Opened');
exports.CLASS = 'theia-Files';
let FileNavigatorWidget = class FileNavigatorWidget extends abstract_navigator_tree_widget_1.AbstractNavigatorTreeWidget {
    constructor(props, model, contextMenuRenderer) {
        super(props, model, contextMenuRenderer);
        this.model = model;
        this.canOpenWorkspaceFileAndFolder = core_1.isOSX || !core_1.environment.electron.is();
        this.openWorkspace = () => this.doOpenWorkspace();
        this.openFolder = () => this.doOpenFolder();
        this.addFolder = () => this.doAddFolder();
        this.keyUpHandler = (e) => {
            if (browser_1.Key.ENTER.keyCode === e.keyCode) {
                e.target.click();
            }
        };
        this.id = exports.FILE_NAVIGATOR_ID;
        this.addClass(exports.CLASS);
    }
    init() {
        super.init();
        // This ensures that the context menu command to hide this widget receives the label 'Folders'
        // regardless of the name of workspace. See ViewContainer.updateToolbarItems.
        const dataset = { ...this.title.dataset, visibilityCommandLabel: nls_1.nls.localizeByDefault('Folders') };
        this.title.dataset = dataset;
        this.updateSelectionContextKeys();
        this.toDispose.pushAll([
            this.model.onSelectionChanged(() => this.updateSelectionContextKeys()),
            this.model.onExpansionChanged(node => {
                if (node.expanded && node.children.length === 1) {
                    const child = node.children[0];
                    if (browser_1.ExpandableTreeNode.is(child) && !child.expanded) {
                        this.model.expandNode(child);
                    }
                }
            })
        ]);
    }
    doUpdateRows() {
        super.doUpdateRows();
        this.title.label = exports.LABEL;
        if (navigator_tree_1.WorkspaceNode.is(this.model.root)) {
            if (this.model.root.name === navigator_tree_1.WorkspaceNode.name) {
                const rootNode = this.model.root.children[0];
                if (navigator_tree_1.WorkspaceRootNode.is(rootNode)) {
                    this.title.label = this.toNodeName(rootNode);
                    this.title.caption = this.labelProvider.getLongName(rootNode.uri);
                }
            }
            else {
                this.title.label = this.toNodeName(this.model.root);
                this.title.caption = this.title.label;
            }
        }
        else {
            this.title.caption = this.title.label;
        }
    }
    getContainerTreeNode() {
        const root = this.model.root;
        if (this.workspaceService.isMultiRootWorkspaceOpened) {
            return root;
        }
        if (navigator_tree_1.WorkspaceNode.is(root)) {
            return root.children[0];
        }
        return undefined;
    }
    renderTree(model) {
        if (this.model.root && this.isEmptyMultiRootWorkspace(model)) {
            return this.renderEmptyMultiRootWorkspace();
        }
        return super.renderTree(model);
    }
    shouldShowWelcomeView() {
        return this.model.root === undefined;
    }
    onAfterAttach(msg) {
        super.onAfterAttach(msg);
        this.addClipboardListener(this.node, 'copy', e => this.handleCopy(e));
        this.addClipboardListener(this.node, 'paste', e => this.handlePaste(e));
    }
    handleCopy(event) {
        const uris = this.model.selectedFileStatNodes.map(node => node.uri.toString());
        if (uris.length > 0 && event.clipboardData) {
            event.clipboardData.setData('text/plain', uris.join('\n'));
            event.preventDefault();
        }
    }
    handlePaste(event) {
        if (event.clipboardData) {
            const raw = event.clipboardData.getData('text/plain');
            if (!raw) {
                return;
            }
            const target = this.model.selectedFileStatNodes[0];
            if (!target) {
                return;
            }
            for (const file of raw.split('\n')) {
                event.preventDefault();
                const source = new uri_1.default(file);
                this.model.copy(source, target);
            }
        }
    }
    doOpenWorkspace() {
        this.commandService.executeCommand(browser_3.WorkspaceCommands.OPEN_WORKSPACE.id);
    }
    doOpenFolder() {
        this.commandService.executeCommand(browser_3.WorkspaceCommands.OPEN_FOLDER.id);
    }
    doAddFolder() {
        this.commandService.executeCommand(browser_3.WorkspaceCommands.ADD_FOLDER.id);
    }
    /**
     * When a multi-root workspace is opened, a user can remove all the folders from it.
     * Instead of displaying an empty navigator tree, this will show a button to add more folders.
     */
    renderEmptyMultiRootWorkspace() {
        return React.createElement("div", { className: 'theia-navigator-container' },
            React.createElement("div", { className: 'center' }, nls_1.nls.localizeByDefault('You have not yet added a folder to the workspace.\n{0}', '')),
            React.createElement("div", { className: 'open-workspace-button-container' },
                React.createElement("button", { className: 'theia-button open-workspace-button', title: nls_1.nls.localizeByDefault('Add Folder to Workspace'), onClick: this.addFolder, onKeyUp: this.keyUpHandler }, nls_1.nls.localizeByDefault('Open Folder'))));
    }
    isEmptyMultiRootWorkspace(model) {
        return navigator_tree_1.WorkspaceNode.is(model.root) && model.root.children.length === 0;
    }
    tapNode(node) {
        if (node && this.corePreferences['workbench.list.openMode'] === 'singleClick') {
            this.model.previewNode(node);
        }
        super.tapNode(node);
    }
    onAfterShow(msg) {
        super.onAfterShow(msg);
        this.contextKeyService.explorerViewletVisible.set(true);
    }
    onAfterHide(msg) {
        super.onAfterHide(msg);
        this.contextKeyService.explorerViewletVisible.set(false);
    }
    updateSelectionContextKeys() {
        this.contextKeyService.explorerResourceIsFolder.set(browser_2.DirNode.is(this.model.selectedNodes[0]));
    }
};
__decorate([
    (0, inversify_1.inject)(common_1.CommandService),
    __metadata("design:type", Object)
], FileNavigatorWidget.prototype, "commandService", void 0);
__decorate([
    (0, inversify_1.inject)(navigator_context_key_service_1.NavigatorContextKeyService),
    __metadata("design:type", navigator_context_key_service_1.NavigatorContextKeyService)
], FileNavigatorWidget.prototype, "contextKeyService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_3.WorkspaceService),
    __metadata("design:type", browser_3.WorkspaceService)
], FileNavigatorWidget.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FileNavigatorWidget.prototype, "init", null);
FileNavigatorWidget = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(browser_1.TreeProps)),
    __param(1, (0, inversify_1.inject)(navigator_model_1.FileNavigatorModel)),
    __param(2, (0, inversify_1.inject)(browser_1.ContextMenuRenderer)),
    __metadata("design:paramtypes", [Object, navigator_model_1.FileNavigatorModel,
        browser_1.ContextMenuRenderer])
], FileNavigatorWidget);
exports.FileNavigatorWidget = FileNavigatorWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/navigator/lib/browser/navigator-widget'] = this;


/***/ }),

/***/ "../../packages/navigator/lib/browser/open-editors-widget/navigator-open-editors-commands.js":
/*!***************************************************************************************************!*\
  !*** ../../packages/navigator/lib/browser/open-editors-widget/navigator-open-editors-commands.js ***!
  \***************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2021 Ericsson and others.
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
exports.OpenEditorsCommands = void 0;
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
var OpenEditorsCommands;
(function (OpenEditorsCommands) {
    OpenEditorsCommands.CLOSE_ALL_TABS_FROM_TOOLBAR = common_1.Command.toDefaultLocalizedCommand({
        id: 'navigator.close.all.editors.toolbar',
        category: browser_1.CommonCommands.FILE_CATEGORY,
        label: 'Close All Editors',
        iconClass: 'codicon codicon-close-all'
    });
    OpenEditorsCommands.SAVE_ALL_TABS_FROM_TOOLBAR = common_1.Command.toDefaultLocalizedCommand({
        id: 'navigator.save.all.editors.toolbar',
        category: browser_1.CommonCommands.FILE_CATEGORY,
        label: 'Save All',
        iconClass: 'codicon codicon-save-all'
    });
    OpenEditorsCommands.CLOSE_ALL_EDITORS_IN_GROUP_FROM_ICON = common_1.Command.toDefaultLocalizedCommand({
        id: 'navigator.close.all.in.area.icon',
        category: browser_1.CommonCommands.VIEW_CATEGORY,
        label: 'Close Group',
        iconClass: 'codicon codicon-close-all'
    });
    OpenEditorsCommands.SAVE_ALL_IN_GROUP_FROM_ICON = common_1.Command.toDefaultLocalizedCommand({
        id: 'navigator.save.all.in.area.icon',
        category: browser_1.CommonCommands.FILE_CATEGORY,
        label: 'Save All in Group',
        iconClass: 'codicon codicon-save-all'
    });
})(OpenEditorsCommands = exports.OpenEditorsCommands || (exports.OpenEditorsCommands = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/navigator/lib/browser/open-editors-widget/navigator-open-editors-commands'] = this;


/***/ }),

/***/ "../../packages/navigator/lib/browser/open-editors-widget/navigator-open-editors-menus.js":
/*!************************************************************************************************!*\
  !*** ../../packages/navigator/lib/browser/open-editors-widget/navigator-open-editors-menus.js ***!
  \************************************************************************************************/
/***/ (function(__unused_webpack_module, exports) {


// *****************************************************************************
// Copyright (C) 2021 Ericsson and others.
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
exports.OpenEditorsContextMenu = exports.OPEN_EDITORS_CONTEXT_MENU = void 0;
exports.OPEN_EDITORS_CONTEXT_MENU = ['open-editors-context-menu'];
var OpenEditorsContextMenu;
(function (OpenEditorsContextMenu) {
    OpenEditorsContextMenu.NAVIGATION = [...exports.OPEN_EDITORS_CONTEXT_MENU, '1_navigation'];
    OpenEditorsContextMenu.CLIPBOARD = [...exports.OPEN_EDITORS_CONTEXT_MENU, '2_clipboard'];
    OpenEditorsContextMenu.SAVE = [...exports.OPEN_EDITORS_CONTEXT_MENU, '3_save'];
    OpenEditorsContextMenu.COMPARE = [...exports.OPEN_EDITORS_CONTEXT_MENU, '4_compare'];
    OpenEditorsContextMenu.MODIFICATION = [...exports.OPEN_EDITORS_CONTEXT_MENU, '5_modification'];
})(OpenEditorsContextMenu = exports.OpenEditorsContextMenu || (exports.OpenEditorsContextMenu = {}));

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/navigator/lib/browser/open-editors-widget/navigator-open-editors-menus'] = this;


/***/ }),

/***/ "../../packages/navigator/lib/browser/open-editors-widget/navigator-open-editors-widget.js":
/*!*************************************************************************************************!*\
  !*** ../../packages/navigator/lib/browser/open-editors-widget/navigator-open-editors-widget.js ***!
  \*************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2021 Ericsson and others.
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
var OpenEditorsWidget_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OpenEditorsWidget = exports.OPEN_EDITORS_PROPS = void 0;
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const navigator_open_editors_tree_model_1 = __webpack_require__(/*! ./navigator-open-editors-tree-model */ "../../packages/navigator/lib/browser/open-editors-widget/navigator-open-editors-tree-model.js");
const browser_2 = __webpack_require__(/*! @theia/filesystem/lib/browser */ "../../packages/filesystem/lib/browser/index.js");
const navigator_open_editors_decorator_service_1 = __webpack_require__(/*! ./navigator-open-editors-decorator-service */ "../../packages/navigator/lib/browser/open-editors-widget/navigator-open-editors-decorator-service.js");
const navigator_open_editors_menus_1 = __webpack_require__(/*! ./navigator-open-editors-menus */ "../../packages/navigator/lib/browser/open-editors-widget/navigator-open-editors-menus.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const navigator_open_editors_commands_1 = __webpack_require__(/*! ./navigator-open-editors-commands */ "../../packages/navigator/lib/browser/open-editors-widget/navigator-open-editors-commands.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
const browser_3 = __webpack_require__(/*! @theia/workspace/lib/browser */ "../../packages/workspace/lib/browser/index.js");
const abstract_navigator_tree_widget_1 = __webpack_require__(/*! ../abstract-navigator-tree-widget */ "../../packages/navigator/lib/browser/abstract-navigator-tree-widget.js");
exports.OPEN_EDITORS_PROPS = {
    ...browser_1.defaultTreeProps,
    virtualized: false,
    contextMenuPath: navigator_open_editors_menus_1.OPEN_EDITORS_CONTEXT_MENU,
    leftPadding: 22
};
let OpenEditorsWidget = OpenEditorsWidget_1 = class OpenEditorsWidget extends abstract_navigator_tree_widget_1.AbstractNavigatorTreeWidget {
    constructor(props, model, contextMenuRenderer) {
        super(props, model, contextMenuRenderer);
        this.model = model;
        this.handleGroupActionIconClicked = async (e) => this.doHandleGroupActionIconClicked(e);
        this.closeEditor = async (e) => this.doCloseEditor(e);
    }
    static createContainer(parent) {
        const child = (0, browser_2.createFileTreeContainer)(parent);
        child.unbind(browser_2.FileTreeModel);
        child.bind(navigator_open_editors_tree_model_1.OpenEditorsModel).toSelf();
        child.rebind(browser_1.TreeModel).toService(navigator_open_editors_tree_model_1.OpenEditorsModel);
        child.unbind(browser_2.FileTreeWidget);
        child.bind(OpenEditorsWidget_1).toSelf();
        child.rebind(browser_1.TreeProps).toConstantValue(exports.OPEN_EDITORS_PROPS);
        child.bind(navigator_open_editors_decorator_service_1.OpenEditorsTreeDecoratorService).toSelf().inSingletonScope();
        child.rebind(browser_1.TreeDecoratorService).toService(navigator_open_editors_decorator_service_1.OpenEditorsTreeDecoratorService);
        return child;
    }
    static createWidget(parent) {
        return OpenEditorsWidget_1.createContainer(parent).get(OpenEditorsWidget_1);
    }
    init() {
        super.init();
        this.id = OpenEditorsWidget_1.ID;
        this.title.label = OpenEditorsWidget_1.LABEL;
        this.addClass(OpenEditorsWidget_1.ID);
        this.update();
    }
    get editorWidgets() {
        return this.model.editorWidgets;
    }
    renderNode(node, props) {
        if (!browser_1.TreeNode.isVisible(node)) {
            return undefined;
        }
        const attributes = this.createNodeAttributes(node, props);
        const isEditorNode = !(node.id.startsWith(navigator_open_editors_tree_model_1.OpenEditorsModel.GROUP_NODE_ID_PREFIX) || node.id.startsWith(navigator_open_editors_tree_model_1.OpenEditorsModel.AREA_NODE_ID_PREFIX));
        const content = React.createElement("div", { className: `${browser_1.TREE_NODE_CONTENT_CLASS}` },
            this.renderExpansionToggle(node, props),
            isEditorNode && this.renderPrefixIcon(node),
            this.decorateIcon(node, this.renderIcon(node, props)),
            React.createElement("div", { className: 'noWrapInfo theia-TreeNodeSegmentGrow' },
                this.renderCaptionAffixes(node, props, 'captionPrefixes'),
                this.renderCaption(node, props),
                this.renderCaptionAffixes(node, props, 'captionSuffixes')),
            this.renderTailDecorations(node, props),
            (this.isGroupNode(node) || this.isAreaNode(node)) && this.renderInteractables(node, props));
        return React.createElement('div', attributes, content);
    }
    getDecorationData(node, key) {
        const contributed = super.getDecorationData(node, key);
        if (key === 'captionSuffixes' && navigator_open_editors_tree_model_1.OpenEditorNode.is(node)) {
            contributed.push(this.getWorkspaceDecoration(node));
        }
        return contributed;
    }
    getWorkspaceDecoration(node) {
        var _a;
        const color = (_a = this.getDecorationData(node, 'fontData').find(data => data.color)) === null || _a === void 0 ? void 0 : _a.color;
        return [{
                fontData: { color },
                data: this.labelProvider.getDetails(node.fileStat),
            }];
    }
    isGroupNode(node) {
        return node.id.startsWith(navigator_open_editors_tree_model_1.OpenEditorsModel.GROUP_NODE_ID_PREFIX);
    }
    isAreaNode(node) {
        return node.id.startsWith(navigator_open_editors_tree_model_1.OpenEditorsModel.AREA_NODE_ID_PREFIX);
    }
    doRenderNodeRow({ node, depth }) {
        let groupClass = '';
        if (this.isGroupNode(node)) {
            groupClass = 'group-node';
        }
        else if (this.isAreaNode(node)) {
            groupClass = 'area-node';
        }
        return React.createElement("div", { className: `open-editors-node-row ${this.getPrefixIconClass(node)}${groupClass}` }, this.renderNode(node, { depth }));
    }
    renderInteractables(node, props) {
        return (React.createElement("div", { className: 'open-editors-inline-actions-container' },
            React.createElement("div", { className: 'open-editors-inline-action' },
                React.createElement("a", { className: 'codicon codicon-save-all', title: navigator_open_editors_commands_1.OpenEditorsCommands.SAVE_ALL_IN_GROUP_FROM_ICON.label, onClick: this.handleGroupActionIconClicked, "data-id": node.id, id: navigator_open_editors_commands_1.OpenEditorsCommands.SAVE_ALL_IN_GROUP_FROM_ICON.id })),
            React.createElement("div", { className: 'open-editors-inline-action' },
                React.createElement("a", { className: 'codicon codicon-close-all', title: navigator_open_editors_commands_1.OpenEditorsCommands.CLOSE_ALL_EDITORS_IN_GROUP_FROM_ICON.label, onClick: this.handleGroupActionIconClicked, "data-id": node.id, id: navigator_open_editors_commands_1.OpenEditorsCommands.CLOSE_ALL_EDITORS_IN_GROUP_FROM_ICON.id }))));
    }
    async doHandleGroupActionIconClicked(e) {
        e.stopPropagation();
        const groupName = e.currentTarget.getAttribute('data-id');
        const command = e.currentTarget.id;
        if (groupName && command) {
            const groupFromTarget = groupName.split(':').pop();
            const areaOrTabBar = this.sanitizeInputFromClickHandler(groupFromTarget);
            if (areaOrTabBar) {
                return this.commandService.executeCommand(command, areaOrTabBar);
            }
        }
    }
    sanitizeInputFromClickHandler(groupFromTarget) {
        let areaOrTabBar;
        if (groupFromTarget) {
            if (browser_1.ApplicationShell.isValidArea(groupFromTarget)) {
                areaOrTabBar = groupFromTarget;
            }
            else {
                const groupAsNum = parseInt(groupFromTarget);
                if (!isNaN(groupAsNum)) {
                    areaOrTabBar = this.model.getTabBarForGroup(groupAsNum);
                }
            }
        }
        return areaOrTabBar;
    }
    renderPrefixIcon(node) {
        return (React.createElement("div", { className: 'open-editors-prefix-icon-container' },
            React.createElement("div", { "data-id": node.id, className: `open-editors-prefix-icon dirty ${(0, browser_1.codicon)('circle-filled', true)}` }),
            React.createElement("div", { "data-id": node.id, onClick: this.closeEditor, className: `open-editors-prefix-icon close ${(0, browser_1.codicon)('close', true)}` })));
    }
    getPrefixIconClass(node) {
        const saveable = browser_1.Saveable.get(node.widget);
        if (saveable) {
            return saveable.dirty ? 'dirty' : '';
        }
        return '';
    }
    async doCloseEditor(e) {
        const widgetId = e.currentTarget.getAttribute('data-id');
        if (widgetId) {
            await this.applicationShell.closeWidget(widgetId);
        }
    }
    tapNode(node) {
        if (navigator_open_editors_tree_model_1.OpenEditorNode.is(node)) {
            this.applicationShell.activateWidget(node.widget.id);
        }
        super.tapNode(node);
    }
    handleContextMenuEvent(node, event) {
        super.handleContextMenuEvent(node, event);
        if (node) {
            // Since the CommonCommands used in the context menu act on the shell's activeWidget, this is necessary to ensure
            // that the EditorWidget is activated, not the Navigator itself
            this.applicationShell.activateWidget(node.widget.id);
        }
    }
    getPaddingLeft(node) {
        if (node.id.startsWith(navigator_open_editors_tree_model_1.OpenEditorsModel.AREA_NODE_ID_PREFIX)) {
            return 0;
        }
        return this.props.leftPadding;
    }
    // The state of this widget is derived from external factors. No need to store or restore it.
    storeState() { return {}; }
    restoreState() { }
};
OpenEditorsWidget.ID = 'theia-open-editors-widget';
OpenEditorsWidget.LABEL = nls_1.nls.localizeByDefault('Open Editors');
__decorate([
    (0, inversify_1.inject)(browser_1.ApplicationShell),
    __metadata("design:type", browser_1.ApplicationShell)
], OpenEditorsWidget.prototype, "applicationShell", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.CommandService),
    __metadata("design:type", Object)
], OpenEditorsWidget.prototype, "commandService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_3.WorkspaceService),
    __metadata("design:type", browser_3.WorkspaceService)
], OpenEditorsWidget.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OpenEditorsWidget.prototype, "init", null);
OpenEditorsWidget = OpenEditorsWidget_1 = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(browser_1.TreeProps)),
    __param(1, (0, inversify_1.inject)(navigator_open_editors_tree_model_1.OpenEditorsModel)),
    __param(2, (0, inversify_1.inject)(browser_1.ContextMenuRenderer)),
    __metadata("design:paramtypes", [Object, navigator_open_editors_tree_model_1.OpenEditorsModel,
        browser_1.ContextMenuRenderer])
], OpenEditorsWidget);
exports.OpenEditorsWidget = OpenEditorsWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/navigator/lib/browser/open-editors-widget/navigator-open-editors-widget'] = this;


/***/ })

}]);
//# sourceMappingURL=packages_navigator_lib_browser_navigator-widget-factory_js.js.map