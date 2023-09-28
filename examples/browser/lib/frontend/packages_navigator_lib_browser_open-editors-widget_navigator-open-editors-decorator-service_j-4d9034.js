(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_navigator_lib_browser_open-editors-widget_navigator-open-editors-decorator-service_j-4d9034"],{

/***/ "../../packages/core/shared/lodash.debounce/index.js":
/*!***********************************************************!*\
  !*** ../../packages/core/shared/lodash.debounce/index.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! lodash.debounce */ "../../node_modules/lodash.debounce/index.js");

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/shared/lodash.debounce'] = this;


/***/ }),

/***/ "../../packages/navigator/lib/browser/open-editors-widget/navigator-open-editors-decorator-service.js":
/*!************************************************************************************************************!*\
  !*** ../../packages/navigator/lib/browser/open-editors-widget/navigator-open-editors-decorator-service.js ***!
  \************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OpenEditorsTreeDecoratorService = exports.OpenEditorsTreeDecorator = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const tree_decorator_1 = __webpack_require__(/*! @theia/core/lib/browser/tree/tree-decorator */ "../../packages/core/lib/browser/tree/tree-decorator.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
exports.OpenEditorsTreeDecorator = Symbol('OpenEditorsTreeDecorator');
let OpenEditorsTreeDecoratorService = class OpenEditorsTreeDecoratorService extends tree_decorator_1.AbstractTreeDecoratorService {
    constructor(contributions) {
        super(contributions.getContributions());
        this.contributions = contributions;
    }
};
OpenEditorsTreeDecoratorService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(common_1.ContributionProvider)),
    __param(0, (0, inversify_1.named)(exports.OpenEditorsTreeDecorator)),
    __metadata("design:paramtypes", [Object])
], OpenEditorsTreeDecoratorService);
exports.OpenEditorsTreeDecoratorService = OpenEditorsTreeDecoratorService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/navigator/lib/browser/open-editors-widget/navigator-open-editors-decorator-service'] = this;


/***/ }),

/***/ "../../packages/navigator/lib/browser/open-editors-widget/navigator-open-editors-tree-model.js":
/*!*****************************************************************************************************!*\
  !*** ../../packages/navigator/lib/browser/open-editors-widget/navigator-open-editors-tree-model.js ***!
  \*****************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
var OpenEditorsModel_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OpenEditorsModel = exports.OpenEditorNode = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/filesystem/lib/browser */ "../../packages/filesystem/lib/browser/index.js");
const browser_2 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const browser_3 = __webpack_require__(/*! @theia/workspace/lib/browser */ "../../packages/workspace/lib/browser/index.js");
const debounce = __webpack_require__(/*! @theia/core/shared/lodash.debounce */ "../../packages/core/shared/lodash.debounce/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
;
var OpenEditorNode;
(function (OpenEditorNode) {
    function is(node) {
        return browser_1.FileStatNode.is(node) && 'widget' in node;
    }
    OpenEditorNode.is = is;
})(OpenEditorNode = exports.OpenEditorNode || (exports.OpenEditorNode = {}));
let OpenEditorsModel = OpenEditorsModel_1 = class OpenEditorsModel extends browser_1.FileTreeModel {
    constructor() {
        super(...arguments);
        this.toDisposeOnPreviewWidgetReplaced = new common_1.DisposableCollection();
        // Returns the collection of editors belonging to a tabbar group in the main area
        this._editorWidgetsByGroup = new Map();
        // Returns the collection of editors belonging to an area grouping (main, left, right bottom)
        this._editorWidgetsByArea = new Map();
        // Last collection of editors before a layout modification, used to detect changes in widget ordering
        this._lastEditorWidgetsByArea = new Map();
        this.cachedFileStats = new Map();
        this.updateOpenWidgets = debounce(this.doUpdateOpenWidgets, 250);
    }
    get editorWidgets() {
        const editorWidgets = [];
        this._editorWidgetsByArea.forEach(widgets => editorWidgets.push(...widgets));
        return editorWidgets;
    }
    getTabBarForGroup(id) {
        var _a;
        return (_a = this._editorWidgetsByGroup.get(id)) === null || _a === void 0 ? void 0 : _a.tabbar;
    }
    init() {
        super.init();
        this.setupHandlers();
        this.initializeRoot();
    }
    setupHandlers() {
        this.toDispose.push(this.applicationShell.onDidChangeCurrentWidget(({ newValue }) => {
            const nodeToSelect = this.tree.getNode(newValue === null || newValue === void 0 ? void 0 : newValue.id);
            if (nodeToSelect && browser_2.SelectableTreeNode.is(nodeToSelect)) {
                this.selectNode(nodeToSelect);
            }
        }));
        this.toDispose.push(this.applicationShell.onDidAddWidget(async () => {
            await this.updateOpenWidgets();
            const existingWidgetIds = new Set(this.editorWidgets.map(widget => widget.id));
            this.cachedFileStats.forEach((_fileStat, id) => {
                if (!existingWidgetIds.has(id)) {
                    this.cachedFileStats.delete(id);
                }
            });
        }));
        this.toDispose.push(this.applicationShell.onDidRemoveWidget(() => this.updateOpenWidgets()));
        // Check for tabs rearranged in main and bottom
        this.applicationShell.mainPanel.layoutModified.connect(() => this.doUpdateOpenWidgets('main'));
        this.applicationShell.bottomPanel.layoutModified.connect(() => this.doUpdateOpenWidgets('bottom'));
    }
    async initializeRoot() {
        await this.updateOpenWidgets();
        this.fireChanged();
    }
    async doUpdateOpenWidgets(layoutModifiedArea) {
        this._lastEditorWidgetsByArea = this._editorWidgetsByArea;
        this._editorWidgetsByArea = new Map();
        let doRebuild = true;
        const areas = ['main', 'bottom', 'left', 'right', 'top', 'secondaryWindow'];
        areas.forEach(area => {
            const editorWidgetsForArea = this.applicationShell.getWidgets(area).filter((widget) => browser_2.NavigatableWidget.is(widget));
            if (editorWidgetsForArea.length) {
                this._editorWidgetsByArea.set(area, editorWidgetsForArea);
            }
        });
        if (this._lastEditorWidgetsByArea.size === 0) {
            this._lastEditorWidgetsByArea = this._editorWidgetsByArea;
        }
        // `layoutModified` can be triggered when tabs are clicked, even if they are not rearranged.
        // This will check for those instances and prevent a rebuild if it is unnecessary. Rebuilding
        // the tree if there is no change can cause the tree's selection to flicker.
        if (layoutModifiedArea) {
            doRebuild = this.shouldRebuildTreeOnLayoutModified(layoutModifiedArea);
        }
        if (doRebuild) {
            this.root = await this.buildRootFromOpenedWidgets(this._editorWidgetsByArea);
        }
    }
    shouldRebuildTreeOnLayoutModified(area) {
        const currentOrdering = this._editorWidgetsByArea.get(area);
        const previousOrdering = this._lastEditorWidgetsByArea.get(area);
        if ((currentOrdering === null || currentOrdering === void 0 ? void 0 : currentOrdering.length) === 1) {
            return true;
        }
        if ((currentOrdering === null || currentOrdering === void 0 ? void 0 : currentOrdering.length) !== (previousOrdering === null || previousOrdering === void 0 ? void 0 : previousOrdering.length)) {
            return true;
        }
        if (!!currentOrdering && !!previousOrdering) {
            return !currentOrdering.every((widget, index) => widget === previousOrdering[index]);
        }
        return true;
    }
    tryCreateWidgetGroupMap() {
        const mainTabBars = this.applicationShell.mainAreaTabBars;
        this._editorWidgetsByGroup = new Map();
        const widgetGroupMap = new Map();
        if (mainTabBars.length > 1) {
            mainTabBars.forEach((tabbar, index) => {
                const groupNumber = index + 1;
                const newCaption = common_1.nls.localizeByDefault('Group {0}', groupNumber);
                const groupNode = {
                    parent: undefined,
                    id: `${OpenEditorsModel_1.GROUP_NODE_ID_PREFIX}:${groupNumber}`,
                    name: newCaption,
                    children: []
                };
                const widgets = [];
                tabbar.titles.map(title => {
                    const { owner } = title;
                    widgetGroupMap.set(owner, groupNode);
                    if (browser_2.NavigatableWidget.is(owner)) {
                        widgets.push(owner);
                    }
                });
                this._editorWidgetsByGroup.set(groupNumber, { widgets, tabbar });
            });
        }
        return widgetGroupMap;
    }
    async buildRootFromOpenedWidgets(widgetsByArea) {
        const rootNode = {
            id: 'open-editors:root',
            parent: undefined,
            visible: false,
            children: [],
        };
        const mainAreaWidgetGroups = this.tryCreateWidgetGroupMap();
        for (const [area, widgetsInArea] of widgetsByArea.entries()) {
            const areaNode = {
                id: `${OpenEditorsModel_1.AREA_NODE_ID_PREFIX}:${area}`,
                parent: rootNode,
                name: browser_2.ApplicationShell.areaLabels[area],
                expanded: true,
                children: []
            };
            for (const widget of widgetsInArea) {
                const uri = widget.getResourceUri();
                if (uri) {
                    let fileStat;
                    try {
                        fileStat = await this.fileService.resolve(uri);
                        this.cachedFileStats.set(widget.id, fileStat);
                    }
                    catch {
                        const cachedStat = this.cachedFileStats.get(widget.id);
                        if (cachedStat) {
                            fileStat = cachedStat;
                        }
                        else {
                            continue;
                        }
                    }
                    const openEditorNode = {
                        id: widget.id,
                        fileStat,
                        uri,
                        selected: false,
                        parent: undefined,
                        name: widget.title.label,
                        icon: widget.title.iconClass,
                        widget
                    };
                    // only show groupings for main area widgets if more than one tabbar
                    if ((area === 'main') && (mainAreaWidgetGroups.size > 1)) {
                        const groupNode = mainAreaWidgetGroups.get(widget);
                        if (groupNode) {
                            browser_2.CompositeTreeNode.addChild(groupNode, openEditorNode);
                            browser_2.CompositeTreeNode.addChild(areaNode, groupNode);
                        }
                    }
                    else {
                        browser_2.CompositeTreeNode.addChild(areaNode, openEditorNode);
                    }
                }
            }
            // If widgets are only in the main area and in a single tabbar, then don't show area node
            if (widgetsByArea.size === 1 && widgetsByArea.has('main') && area === 'main') {
                areaNode.children.forEach(child => browser_2.CompositeTreeNode.addChild(rootNode, child));
            }
            else {
                browser_2.CompositeTreeNode.addChild(rootNode, areaNode);
            }
        }
        return rootNode;
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
};
OpenEditorsModel.GROUP_NODE_ID_PREFIX = 'group-node';
OpenEditorsModel.AREA_NODE_ID_PREFIX = 'area-node';
__decorate([
    (0, inversify_1.inject)(browser_2.ApplicationShell),
    __metadata("design:type", browser_2.ApplicationShell)
], OpenEditorsModel.prototype, "applicationShell", void 0);
__decorate([
    (0, inversify_1.inject)(browser_3.WorkspaceService),
    __metadata("design:type", browser_3.WorkspaceService)
], OpenEditorsModel.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.OpenerService),
    __metadata("design:type", Object)
], OpenEditorsModel.prototype, "openerService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OpenEditorsModel.prototype, "init", null);
OpenEditorsModel = OpenEditorsModel_1 = __decorate([
    (0, inversify_1.injectable)()
], OpenEditorsModel);
exports.OpenEditorsModel = OpenEditorsModel;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/navigator/lib/browser/open-editors-widget/navigator-open-editors-tree-model'] = this;


/***/ }),

/***/ "../../packages/workspace/lib/browser/index.js":
/*!*****************************************************!*\
  !*** ../../packages/workspace/lib/browser/index.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
__exportStar(__webpack_require__(/*! ./workspace-commands */ "../../packages/workspace/lib/browser/workspace-commands.js"), exports);
__exportStar(__webpack_require__(/*! ./workspace-service */ "../../packages/workspace/lib/browser/workspace-service.js"), exports);
__exportStar(__webpack_require__(/*! ./canonical-uri-service */ "../../packages/workspace/lib/browser/canonical-uri-service.js"), exports);
__exportStar(__webpack_require__(/*! ./workspace-frontend-contribution */ "../../packages/workspace/lib/browser/workspace-frontend-contribution.js"), exports);
__exportStar(__webpack_require__(/*! ./workspace-frontend-module */ "../../packages/workspace/lib/browser/workspace-frontend-module.js"), exports);
__exportStar(__webpack_require__(/*! ./workspace-preferences */ "../../packages/workspace/lib/browser/workspace-preferences.js"), exports);
__exportStar(__webpack_require__(/*! ./workspace-trust-service */ "../../packages/workspace/lib/browser/workspace-trust-service.js"), exports);

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/workspace/lib/browser'] = this;


/***/ })

}]);
//# sourceMappingURL=packages_navigator_lib_browser_open-editors-widget_navigator-open-editors-decorator-service_j-4d9034.js.map