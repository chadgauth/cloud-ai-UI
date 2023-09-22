"use strict";
(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_navigator_lib_browser_index_js-packages_timeline_lib_browser_timeline-tree-widget_js"],{

/***/ "../../packages/navigator/lib/browser/index.js":
/*!*****************************************************!*\
  !*** ../../packages/navigator/lib/browser/index.js ***!
  \*****************************************************/
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
__exportStar(__webpack_require__(/*! ./navigator-model */ "../../packages/navigator/lib/browser/navigator-model.js"), exports);
__exportStar(__webpack_require__(/*! ./navigator-widget */ "../../packages/navigator/lib/browser/navigator-widget.js"), exports);
__exportStar(__webpack_require__(/*! ./navigator-widget-factory */ "../../packages/navigator/lib/browser/navigator-widget-factory.js"), exports);
__exportStar(__webpack_require__(/*! ./navigator-decorator-service */ "../../packages/navigator/lib/browser/navigator-decorator-service.js"), exports);

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/navigator/lib/browser'] = this;


/***/ }),

/***/ "../../packages/navigator/lib/browser/navigator-decorator-service.js":
/*!***************************************************************************!*\
  !*** ../../packages/navigator/lib/browser/navigator-decorator-service.js ***!
  \***************************************************************************/
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
exports.NavigatorDecoratorService = exports.NavigatorTreeDecorator = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const contribution_provider_1 = __webpack_require__(/*! @theia/core/lib/common/contribution-provider */ "../../packages/core/lib/common/contribution-provider.js");
const tree_decorator_1 = __webpack_require__(/*! @theia/core/lib/browser/tree/tree-decorator */ "../../packages/core/lib/browser/tree/tree-decorator.js");
/**
 * Symbol for all decorators that would like to contribute into the navigator.
 */
exports.NavigatorTreeDecorator = Symbol('NavigatorTreeDecorator');
/**
 * Decorator service for the navigator.
 */
let NavigatorDecoratorService = class NavigatorDecoratorService extends tree_decorator_1.AbstractTreeDecoratorService {
    constructor(contributions) {
        super(contributions.getContributions());
        this.contributions = contributions;
    }
};
NavigatorDecoratorService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(contribution_provider_1.ContributionProvider)),
    __param(0, (0, inversify_1.named)(exports.NavigatorTreeDecorator)),
    __metadata("design:paramtypes", [Object])
], NavigatorDecoratorService);
exports.NavigatorDecoratorService = NavigatorDecoratorService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/navigator/lib/browser/navigator-decorator-service'] = this;


/***/ }),

/***/ "../../packages/timeline/lib/browser/timeline-context-key-service.js":
/*!***************************************************************************!*\
  !*** ../../packages/timeline/lib/browser/timeline-context-key-service.js ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2020 RedHat and others.
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
exports.TimelineContextKeyService = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const context_key_service_1 = __webpack_require__(/*! @theia/core/lib/browser/context-key-service */ "../../packages/core/lib/browser/context-key-service.js");
let TimelineContextKeyService = class TimelineContextKeyService {
    get timelineItem() {
        return this._timelineItem;
    }
    init() {
        this._timelineItem = this.contextKeyService.createKey('timelineItem', undefined);
    }
};
__decorate([
    (0, inversify_1.inject)(context_key_service_1.ContextKeyService),
    __metadata("design:type", Object)
], TimelineContextKeyService.prototype, "contextKeyService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TimelineContextKeyService.prototype, "init", null);
TimelineContextKeyService = __decorate([
    (0, inversify_1.injectable)()
], TimelineContextKeyService);
exports.TimelineContextKeyService = TimelineContextKeyService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/timeline/lib/browser/timeline-context-key-service'] = this;


/***/ }),

/***/ "../../packages/timeline/lib/browser/timeline-service.js":
/*!***************************************************************!*\
  !*** ../../packages/timeline/lib/browser/timeline-service.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2020 RedHat and others.
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
exports.TimelineAggregate = exports.TimelineService = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
let TimelineService = class TimelineService {
    constructor() {
        this.providers = new Map();
        this.onDidChangeProvidersEmitter = new common_1.Emitter();
        this.onDidChangeProviders = this.onDidChangeProvidersEmitter.event;
        this.onDidChangeTimelineEmitter = new common_1.Emitter();
        this.onDidChangeTimeline = this.onDidChangeTimelineEmitter.event;
    }
    registerTimelineProvider(provider) {
        const id = provider.id;
        this.providers.set(id, provider);
        if (provider.onDidChange) {
            provider.onDidChange(e => this.onDidChangeTimelineEmitter.fire(e));
        }
        this.onDidChangeProvidersEmitter.fire({ added: [id] });
        return common_1.Disposable.create(() => this.unregisterTimelineProvider(id));
    }
    unregisterTimelineProvider(id) {
        const provider = this.providers.get(id);
        if (provider) {
            provider.dispose();
            this.providers.delete(id);
            this.onDidChangeProvidersEmitter.fire({ removed: [id] });
        }
    }
    getSources() {
        return [...this.providers.values()].map(p => ({ id: p.id, label: p.label }));
    }
    getSchemas() {
        const result = [];
        Array.from(this.providers.values()).forEach(provider => {
            const scheme = provider.scheme;
            if (typeof scheme === 'string') {
                result.push(scheme);
            }
            else {
                scheme.forEach(s => result.push(s));
            }
        });
        return result;
    }
    getTimeline(id, uri, options, internalOptions) {
        const provider = this.providers.get(id);
        if (!provider) {
            return Promise.resolve(undefined);
        }
        if (typeof provider.scheme === 'string') {
            if (provider.scheme !== '*' && provider.scheme !== uri.scheme) {
                return Promise.resolve(undefined);
            }
        }
        return provider.provideTimeline(uri, options, internalOptions)
            .then(result => {
            if (!result) {
                return undefined;
            }
            result.items = result.items.map(item => ({ ...item, source: provider.id }));
            return result;
        });
    }
};
TimelineService = __decorate([
    (0, inversify_1.injectable)()
], TimelineService);
exports.TimelineService = TimelineService;
class TimelineAggregate {
    constructor(timeline) {
        var _a;
        this.source = timeline.source;
        this.items = timeline.items;
        this._cursor = (_a = timeline.paging) === null || _a === void 0 ? void 0 : _a.cursor;
    }
    get cursor() {
        return this._cursor;
    }
    set cursor(cursor) {
        this._cursor = cursor;
    }
    add(items) {
        this.items.push(...items);
        this.items.sort((a, b) => b.timestamp - a.timestamp);
    }
}
exports.TimelineAggregate = TimelineAggregate;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/timeline/lib/browser/timeline-service'] = this;


/***/ }),

/***/ "../../packages/timeline/lib/browser/timeline-tree-model.js":
/*!******************************************************************!*\
  !*** ../../packages/timeline/lib/browser/timeline-tree-model.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2020 RedHat and others.
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
exports.TimelineTreeModel = exports.LOAD_MORE_COMMAND = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const tree_1 = __webpack_require__(/*! @theia/core/lib/browser/tree */ "../../packages/core/lib/browser/tree/index.js");
exports.LOAD_MORE_COMMAND = {
    id: 'timeline-load-more'
};
let TimelineTreeModel = class TimelineTreeModel extends tree_1.TreeModelImpl {
    updateTree(items, hasMoreItems) {
        const root = {
            id: 'timeline-tree-root',
            parent: undefined,
            visible: false,
            children: []
        };
        const children = items.map(item => ({
            timelineItem: item,
            id: item.id ? item.id : item.timestamp.toString(),
            parent: root,
            detail: item.detail,
            selected: false,
            visible: true
        }));
        let loadMore;
        if (hasMoreItems) {
            const loadMoreNode = { label: 'Load-more', timestamp: 0, handle: '', uri: '', source: '' };
            loadMoreNode.command = exports.LOAD_MORE_COMMAND;
            loadMore = {
                timelineItem: loadMoreNode,
                id: 'load-more',
                parent: root,
                selected: true
            };
            children.push(loadMore);
        }
        root.children = children;
        this.root = root;
        if (loadMore) {
            this.selectionService.addSelection(loadMore);
        }
    }
};
TimelineTreeModel = __decorate([
    (0, inversify_1.injectable)()
], TimelineTreeModel);
exports.TimelineTreeModel = TimelineTreeModel;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/timeline/lib/browser/timeline-tree-model'] = this;


/***/ }),

/***/ "../../packages/timeline/lib/browser/timeline-tree-widget.js":
/*!*******************************************************************!*\
  !*** ../../packages/timeline/lib/browser/timeline-tree-widget.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2020 RedHat and others.
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
var TimelineTreeWidget_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TimelineItemNode = exports.TimelineTreeWidget = exports.TIMELINE_ITEM_CONTEXT_MENU = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const tree_1 = __webpack_require__(/*! @theia/core/lib/browser/tree */ "../../packages/core/lib/browser/tree/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const timeline_tree_model_1 = __webpack_require__(/*! ./timeline-tree-model */ "../../packages/timeline/lib/browser/timeline-tree-model.js");
const timeline_service_1 = __webpack_require__(/*! ./timeline-service */ "../../packages/timeline/lib/browser/timeline-service.js");
const timeline_context_key_service_1 = __webpack_require__(/*! ./timeline-context-key-service */ "../../packages/timeline/lib/browser/timeline-context-key-service.js");
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
exports.TIMELINE_ITEM_CONTEXT_MENU = ['timeline-item-context-menu'];
let TimelineTreeWidget = TimelineTreeWidget_1 = class TimelineTreeWidget extends tree_1.TreeWidget {
    constructor(props, model, contextMenuRenderer) {
        super(props, model, contextMenuRenderer);
        this.model = model;
        this.id = TimelineTreeWidget_1.ID;
        this.addClass('timeline-outer-container');
    }
    renderNode(node, props) {
        const attributes = this.createNodeAttributes(node, props);
        const content = React.createElement(TimelineItemNode, { timelineItem: node.timelineItem, commandRegistry: this.commandRegistry, contextKeys: this.contextKeys, contextMenuRenderer: this.contextMenuRenderer });
        return React.createElement('div', attributes, content);
    }
    handleEnter(event) {
        var _a;
        const node = this.model.getFocusedNode();
        const command = (_a = node === null || node === void 0 ? void 0 : node.timelineItem) === null || _a === void 0 ? void 0 : _a.command;
        if (command) {
            this.commandRegistry.executeCommand(command.id, ...(command.arguments ? command.arguments : []));
        }
    }
    async handleLeft(event) {
        this.model.selectPrevNode();
    }
};
TimelineTreeWidget.ID = 'timeline-tree-widget';
TimelineTreeWidget.PAGE_SIZE = 20;
__decorate([
    (0, inversify_1.inject)(common_1.MenuModelRegistry),
    __metadata("design:type", common_1.MenuModelRegistry)
], TimelineTreeWidget.prototype, "menus", void 0);
__decorate([
    (0, inversify_1.inject)(timeline_context_key_service_1.TimelineContextKeyService),
    __metadata("design:type", timeline_context_key_service_1.TimelineContextKeyService)
], TimelineTreeWidget.prototype, "contextKeys", void 0);
__decorate([
    (0, inversify_1.inject)(timeline_service_1.TimelineService),
    __metadata("design:type", timeline_service_1.TimelineService)
], TimelineTreeWidget.prototype, "timelineService", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.CommandRegistry),
    __metadata("design:type", common_1.CommandRegistry)
], TimelineTreeWidget.prototype, "commandRegistry", void 0);
TimelineTreeWidget = TimelineTreeWidget_1 = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(tree_1.TreeProps)),
    __param(1, (0, inversify_1.inject)(timeline_tree_model_1.TimelineTreeModel)),
    __param(2, (0, inversify_1.inject)(browser_1.ContextMenuRenderer)),
    __metadata("design:paramtypes", [Object, timeline_tree_model_1.TimelineTreeModel,
        browser_1.ContextMenuRenderer])
], TimelineTreeWidget);
exports.TimelineTreeWidget = TimelineTreeWidget;
class TimelineItemNode extends React.Component {
    constructor() {
        super(...arguments);
        this.open = () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const command = this.props.timelineItem.command;
            if (command) {
                this.props.commandRegistry.executeCommand(command.id, ...command.arguments ? command.arguments : []);
            }
        };
        this.renderContextMenu = (event) => {
            event.preventDefault();
            event.stopPropagation();
            const { timelineItem, contextKeys, contextMenuRenderer } = this.props;
            const currentTimelineItem = contextKeys.timelineItem.get();
            contextKeys.timelineItem.set(timelineItem.contextValue);
            try {
                contextMenuRenderer.render({
                    menuPath: exports.TIMELINE_ITEM_CONTEXT_MENU,
                    anchor: event.nativeEvent,
                    args: [timelineItem]
                });
            }
            finally {
                contextKeys.timelineItem.set(currentTimelineItem);
            }
        };
    }
    render() {
        const { label, description, detail } = this.props.timelineItem;
        return React.createElement("div", { className: 'timeline-item', title: detail, onContextMenu: this.renderContextMenu, onClick: this.open },
            React.createElement("div", { className: `noWrapInfo ${tree_1.TREE_NODE_SEGMENT_GROW_CLASS}` },
                React.createElement("span", { className: 'name' }, label),
                React.createElement("span", { className: 'label' }, description)));
    }
}
exports.TimelineItemNode = TimelineItemNode;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/timeline/lib/browser/timeline-tree-widget'] = this;


/***/ })

}]);
//# sourceMappingURL=packages_navigator_lib_browser_index_js-packages_timeline_lib_browser_timeline-tree-widget_js.js.map