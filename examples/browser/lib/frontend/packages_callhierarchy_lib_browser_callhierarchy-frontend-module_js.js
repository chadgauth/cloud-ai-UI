"use strict";
(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_callhierarchy_lib_browser_callhierarchy-frontend-module_js"],{

/***/ "../../packages/callhierarchy/lib/browser/callhierarchy-contribution.js":
/*!******************************************************************************!*\
  !*** ../../packages/callhierarchy/lib/browser/callhierarchy-contribution.js ***!
  \******************************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CallHierarchyContribution = exports.CallHierarchyCommands = exports.CALL_HIERARCHY_TOGGLE_COMMAND_ID = exports.CALL_HIERARCHY_LABEL = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const browser_2 = __webpack_require__(/*! @theia/editor/lib/browser */ "../../packages/editor/lib/browser/index.js");
const callhierarchy_1 = __webpack_require__(/*! ./callhierarchy */ "../../packages/callhierarchy/lib/browser/callhierarchy.js");
Object.defineProperty(exports, "CALL_HIERARCHY_LABEL", ({ enumerable: true, get: function () { return callhierarchy_1.CALL_HIERARCHY_LABEL; } }));
Object.defineProperty(exports, "CALL_HIERARCHY_TOGGLE_COMMAND_ID", ({ enumerable: true, get: function () { return callhierarchy_1.CALL_HIERARCHY_TOGGLE_COMMAND_ID; } }));
const callhierarchy_service_1 = __webpack_require__(/*! ./callhierarchy-service */ "../../packages/callhierarchy/lib/browser/callhierarchy-service.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const context_key_service_1 = __webpack_require__(/*! @theia/core/lib/browser/context-key-service */ "../../packages/core/lib/browser/context-key-service.js");
var CallHierarchyCommands;
(function (CallHierarchyCommands) {
    CallHierarchyCommands.OPEN = common_1.Command.toLocalizedCommand({
        id: 'callhierarchy:open',
        label: 'Open Call Hierarchy'
    }, 'theia/callhierarchy/open');
})(CallHierarchyCommands = exports.CallHierarchyCommands || (exports.CallHierarchyCommands = {}));
let CallHierarchyContribution = class CallHierarchyContribution extends browser_1.AbstractViewContribution {
    constructor() {
        super({
            widgetId: callhierarchy_1.CALLHIERARCHY_ID,
            widgetName: callhierarchy_1.CALL_HIERARCHY_LABEL,
            defaultWidgetOptions: {
                area: 'bottom'
            },
            toggleCommandId: callhierarchy_1.CALL_HIERARCHY_TOGGLE_COMMAND_ID,
            toggleKeybinding: 'ctrlcmd+shift+f1'
        });
    }
    init() {
        this.editorHasCallHierarchyProvider = this.contextKeyService.createKey('editorHasCallHierarchyProvider', false);
        this.editorManager.onCurrentEditorChanged(() => this.editorHasCallHierarchyProvider.set(this.isCallHierarchyAvailable()));
        this.callHierarchyServiceProvider.onDidChange(() => this.editorHasCallHierarchyProvider.set(this.isCallHierarchyAvailable()));
    }
    isCallHierarchyAvailable() {
        const { selection, languageId } = this.editorAccess;
        return !!selection && !!languageId && !!this.callHierarchyServiceProvider.get(languageId, new uri_1.default(selection.uri));
    }
    async openView(args) {
        const widget = await super.openView(args);
        const { selection, languageId } = this.editorAccess;
        widget.initializeModel(selection, languageId);
        return widget;
    }
    registerCommands(commands) {
        commands.registerCommand(CallHierarchyCommands.OPEN, {
            execute: () => this.openView({
                toggle: false,
                activate: true
            }),
            isEnabled: this.isCallHierarchyAvailable.bind(this)
        });
        super.registerCommands(commands);
    }
    registerMenus(menus) {
        const menuPath = [...browser_2.EDITOR_CONTEXT_MENU, 'navigation'];
        menus.registerMenuAction(menuPath, {
            commandId: CallHierarchyCommands.OPEN.id,
            label: callhierarchy_1.CALL_HIERARCHY_LABEL
        });
        super.registerMenus(menus);
    }
    registerKeybindings(keybindings) {
        super.registerKeybindings(keybindings);
        keybindings.registerKeybinding({
            command: CallHierarchyCommands.OPEN.id,
            keybinding: 'ctrlcmd+f1'
        });
    }
};
__decorate([
    (0, inversify_1.inject)(browser_2.CurrentEditorAccess),
    __metadata("design:type", browser_2.CurrentEditorAccess)
], CallHierarchyContribution.prototype, "editorAccess", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.EditorManager),
    __metadata("design:type", browser_2.EditorManager)
], CallHierarchyContribution.prototype, "editorManager", void 0);
__decorate([
    (0, inversify_1.inject)(callhierarchy_service_1.CallHierarchyServiceProvider),
    __metadata("design:type", callhierarchy_service_1.CallHierarchyServiceProvider)
], CallHierarchyContribution.prototype, "callHierarchyServiceProvider", void 0);
__decorate([
    (0, inversify_1.inject)(context_key_service_1.ContextKeyService),
    __metadata("design:type", Object)
], CallHierarchyContribution.prototype, "contextKeyService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CallHierarchyContribution.prototype, "init", null);
CallHierarchyContribution = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], CallHierarchyContribution);
exports.CallHierarchyContribution = CallHierarchyContribution;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/callhierarchy/lib/browser/callhierarchy-contribution'] = this;


/***/ }),

/***/ "../../packages/callhierarchy/lib/browser/callhierarchy-frontend-module.js":
/*!*********************************************************************************!*\
  !*** ../../packages/callhierarchy/lib/browser/callhierarchy-frontend-module.js ***!
  \*********************************************************************************/
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
const callhierarchy_contribution_1 = __webpack_require__(/*! ./callhierarchy-contribution */ "../../packages/callhierarchy/lib/browser/callhierarchy-contribution.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const callhierarchy_service_1 = __webpack_require__(/*! ./callhierarchy-service */ "../../packages/callhierarchy/lib/browser/callhierarchy-service.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const callhierarchy_1 = __webpack_require__(/*! ./callhierarchy */ "../../packages/callhierarchy/lib/browser/callhierarchy.js");
const callhierarchy_tree_1 = __webpack_require__(/*! ./callhierarchy-tree */ "../../packages/callhierarchy/lib/browser/callhierarchy-tree/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
__webpack_require__(/*! ../../src/browser/style/index.css */ "../../packages/callhierarchy/src/browser/style/index.css");
exports["default"] = new inversify_1.ContainerModule(bind => {
    (0, common_1.bindContributionProvider)(bind, callhierarchy_service_1.CallHierarchyService);
    bind(callhierarchy_service_1.CallHierarchyServiceProvider).to(callhierarchy_service_1.CallHierarchyServiceProvider).inSingletonScope();
    (0, browser_1.bindViewContribution)(bind, callhierarchy_contribution_1.CallHierarchyContribution);
    bind(browser_1.WidgetFactory).toDynamicValue(context => ({
        id: callhierarchy_1.CALLHIERARCHY_ID,
        createWidget: () => (0, callhierarchy_tree_1.createHierarchyTreeWidget)(context.container)
    }));
});

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/callhierarchy/lib/browser/callhierarchy-frontend-module'] = this;


/***/ }),

/***/ "../../packages/callhierarchy/lib/browser/callhierarchy-service.js":
/*!*************************************************************************!*\
  !*** ../../packages/callhierarchy/lib/browser/callhierarchy-service.js ***!
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CallHierarchyServiceProvider = exports.CallHierarchyService = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const language_selector_1 = __webpack_require__(/*! @theia/editor/lib/common/language-selector */ "../../packages/editor/lib/common/language-selector.js");
exports.CallHierarchyService = Symbol('CallHierarchyService');
let CallHierarchyServiceProvider = class CallHierarchyServiceProvider {
    constructor() {
        this.onDidChangeEmitter = new common_1.Emitter();
        this.services = [];
    }
    get onDidChange() {
        return this.onDidChangeEmitter.event;
    }
    init() {
        this.services = this.services.concat(this.contributions.getContributions());
    }
    get(languageId, uri) {
        return this.services
            .filter(service => this.score(service, languageId, uri) > 0)
            .sort((left, right) => this.score(right, languageId, uri) - this.score(left, languageId, uri))[0];
    }
    score(service, languageId, uri) {
        return (0, language_selector_1.score)(service.selector, uri.scheme, uri.path.toString(), languageId, true);
    }
    add(service) {
        this.services.push(service);
        const that = this;
        this.onDidChangeEmitter.fire();
        return {
            dispose: () => {
                that.remove(service);
            }
        };
    }
    remove(service) {
        const length = this.services.length;
        this.services = this.services.filter(value => value !== service);
        const serviceWasRemoved = length !== this.services.length;
        if (serviceWasRemoved) {
            this.onDidChangeEmitter.fire();
        }
        return serviceWasRemoved;
    }
};
__decorate([
    (0, inversify_1.inject)(common_1.ContributionProvider),
    (0, inversify_1.named)(exports.CallHierarchyService),
    __metadata("design:type", Object)
], CallHierarchyServiceProvider.prototype, "contributions", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CallHierarchyServiceProvider.prototype, "init", null);
CallHierarchyServiceProvider = __decorate([
    (0, inversify_1.injectable)()
], CallHierarchyServiceProvider);
exports.CallHierarchyServiceProvider = CallHierarchyServiceProvider;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/callhierarchy/lib/browser/callhierarchy-service'] = this;


/***/ }),

/***/ "../../packages/callhierarchy/lib/browser/callhierarchy-tree/callhierarchy-tree-container.js":
/*!***************************************************************************************************!*\
  !*** ../../packages/callhierarchy/lib/browser/callhierarchy-tree/callhierarchy-tree-container.js ***!
  \***************************************************************************************************/
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
exports.createHierarchyTreeWidget = void 0;
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const callhierarchy_tree_1 = __webpack_require__(/*! ./callhierarchy-tree */ "../../packages/callhierarchy/lib/browser/callhierarchy-tree/callhierarchy-tree.js");
const callhierarchy_tree_model_1 = __webpack_require__(/*! ./callhierarchy-tree-model */ "../../packages/callhierarchy/lib/browser/callhierarchy-tree/callhierarchy-tree-model.js");
const callhierarchy_tree_widget_1 = __webpack_require__(/*! ./callhierarchy-tree-widget */ "../../packages/callhierarchy/lib/browser/callhierarchy-tree/callhierarchy-tree-widget.js");
function createHierarchyTreeContainer(parent) {
    const child = (0, browser_1.createTreeContainer)(parent, {
        tree: callhierarchy_tree_1.CallHierarchyTree,
        model: callhierarchy_tree_model_1.CallHierarchyTreeModel,
        widget: callhierarchy_tree_widget_1.CallHierarchyTreeWidget,
    });
    return child;
}
function createHierarchyTreeWidget(parent) {
    return createHierarchyTreeContainer(parent).get(callhierarchy_tree_widget_1.CallHierarchyTreeWidget);
}
exports.createHierarchyTreeWidget = createHierarchyTreeWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/callhierarchy/lib/browser/callhierarchy-tree/callhierarchy-tree-container'] = this;


/***/ }),

/***/ "../../packages/callhierarchy/lib/browser/callhierarchy-tree/callhierarchy-tree-model.js":
/*!***********************************************************************************************!*\
  !*** ../../packages/callhierarchy/lib/browser/callhierarchy-tree/callhierarchy-tree-model.js ***!
  \***********************************************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CallHierarchyTreeModel = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const callhierarchy_tree_1 = __webpack_require__(/*! ./callhierarchy-tree */ "../../packages/callhierarchy/lib/browser/callhierarchy-tree/callhierarchy-tree.js");
const callhierarchy_service_1 = __webpack_require__(/*! ../callhierarchy-service */ "../../packages/callhierarchy/lib/browser/callhierarchy-service.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const cancellation_1 = __webpack_require__(/*! @theia/core/lib/common/cancellation */ "../../packages/core/lib/common/cancellation.js");
let CallHierarchyTreeModel = class CallHierarchyTreeModel extends browser_1.TreeModelImpl {
    getTree() {
        return this.tree;
    }
    get languageId() {
        return this._languageId;
    }
    async initializeCallHierarchy(languageId, uri, position) {
        var _a;
        this.tree.root = undefined;
        this.tree.callHierarchyService = undefined;
        this._languageId = languageId;
        if (languageId && uri && position) {
            const callHierarchyService = this.callHierarchyServiceProvider.get(languageId, new uri_1.default(uri));
            if (callHierarchyService) {
                this.tree.callHierarchyService = callHierarchyService;
                const cancellationSource = new cancellation_1.CancellationTokenSource();
                const rootDefinition = await callHierarchyService.getRootDefinition(uri, position, cancellationSource.token);
                if (rootDefinition) {
                    (_a = this.currentSession) === null || _a === void 0 ? void 0 : _a.dispose();
                    this.currentSession = rootDefinition;
                    const root = {
                        id: 'call-hierarchy-tree-root',
                        parent: undefined,
                        children: [],
                        visible: false,
                    };
                    rootDefinition.items.forEach(definition => browser_1.CompositeTreeNode.addChild(root, callhierarchy_tree_1.ItemNode.create(definition, root)));
                    this.tree.root = root;
                }
            }
        }
    }
    doOpenNode(node) {
        // do nothing (in particular do not expand the node)
    }
};
__decorate([
    (0, inversify_1.inject)(callhierarchy_tree_1.CallHierarchyTree),
    __metadata("design:type", callhierarchy_tree_1.CallHierarchyTree)
], CallHierarchyTreeModel.prototype, "tree", void 0);
__decorate([
    (0, inversify_1.inject)(callhierarchy_service_1.CallHierarchyServiceProvider),
    __metadata("design:type", callhierarchy_service_1.CallHierarchyServiceProvider)
], CallHierarchyTreeModel.prototype, "callHierarchyServiceProvider", void 0);
CallHierarchyTreeModel = __decorate([
    (0, inversify_1.injectable)()
], CallHierarchyTreeModel);
exports.CallHierarchyTreeModel = CallHierarchyTreeModel;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/callhierarchy/lib/browser/callhierarchy-tree/callhierarchy-tree-model'] = this;


/***/ }),

/***/ "../../packages/callhierarchy/lib/browser/callhierarchy-tree/callhierarchy-tree-widget.js":
/*!************************************************************************************************!*\
  !*** ../../packages/callhierarchy/lib/browser/callhierarchy-tree/callhierarchy-tree-widget.js ***!
  \************************************************************************************************/
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
exports.CallHierarchyTreeWidget = exports.DEFINITION_ICON_CLASS = exports.DEFINITION_NODE_CLASS = exports.HIERARCHY_TREE_CLASS = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const label_provider_1 = __webpack_require__(/*! @theia/core/lib/browser/label-provider */ "../../packages/core/lib/browser/label-provider.js");
const callhierarchy_tree_1 = __webpack_require__(/*! ./callhierarchy-tree */ "../../packages/callhierarchy/lib/browser/callhierarchy-tree/callhierarchy-tree.js");
const callhierarchy_tree_model_1 = __webpack_require__(/*! ./callhierarchy-tree-model */ "../../packages/callhierarchy/lib/browser/callhierarchy-tree/callhierarchy-tree-model.js");
const callhierarchy_1 = __webpack_require__(/*! ../callhierarchy */ "../../packages/callhierarchy/lib/browser/callhierarchy.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const vscode_languageserver_protocol_1 = __webpack_require__(/*! @theia/core/shared/vscode-languageserver-protocol */ "../../packages/core/shared/vscode-languageserver-protocol/index.js");
const browser_2 = __webpack_require__(/*! @theia/editor/lib/browser */ "../../packages/editor/lib/browser/index.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
exports.HIERARCHY_TREE_CLASS = 'theia-CallHierarchyTree';
exports.DEFINITION_NODE_CLASS = 'theia-CallHierarchyTreeNode';
exports.DEFINITION_ICON_CLASS = 'theia-CallHierarchyTreeNodeIcon';
let CallHierarchyTreeWidget = class CallHierarchyTreeWidget extends browser_1.TreeWidget {
    constructor(props, model, contextMenuRenderer, labelProvider, editorManager) {
        super(props, model, contextMenuRenderer);
        this.props = props;
        this.model = model;
        this.labelProvider = labelProvider;
        this.editorManager = editorManager;
        this.id = callhierarchy_1.CALLHIERARCHY_ID;
        this.title.label = callhierarchy_1.CALL_HIERARCHY_LABEL;
        this.title.caption = callhierarchy_1.CALL_HIERARCHY_LABEL;
        this.title.iconClass = (0, browser_1.codicon)('references');
        this.title.closable = true;
        this.addClass(exports.HIERARCHY_TREE_CLASS);
        this.toDispose.push(this.model.onSelectionChanged(selection => {
            const node = selection[0];
            if (node) {
                this.openEditor(node, true);
            }
        }));
        this.toDispose.push(this.model.onOpenNode((node) => {
            this.openEditor(node, false);
        }));
        this.toDispose.push(this.labelProvider.onDidChange(() => this.update()));
    }
    initializeModel(selection, languageId) {
        this.model.initializeCallHierarchy(languageId, selection ? selection.uri : undefined, selection ? selection.range.start : undefined);
    }
    createNodeClassNames(node, props) {
        const classNames = super.createNodeClassNames(node, props);
        if (callhierarchy_tree_1.ItemNode.is(node)) {
            classNames.push(exports.DEFINITION_NODE_CLASS);
        }
        return classNames;
    }
    createNodeAttributes(node, props) {
        const elementAttrs = super.createNodeAttributes(node, props);
        return {
            ...elementAttrs,
        };
    }
    renderTree(model) {
        return super.renderTree(model)
            || React.createElement("div", { className: 'theia-widget-noInfo' }, nls_1.nls.localize('theia/callhierarchy/noCallers', 'No callers have been detected.'));
    }
    renderCaption(node, props) {
        if (callhierarchy_tree_1.ItemNode.is(node)) {
            return this.decorateDefinitionCaption(node.definition);
        }
        if (callhierarchy_tree_1.CallerNode.is(node)) {
            return this.decorateCallerCaption(node.caller);
        }
        return 'caption';
    }
    decorateDefinitionCaption(definition) {
        var _a;
        const symbol = definition.name;
        const location = this.labelProvider.getName(uri_1.default.fromComponents(definition.uri));
        const container = location;
        const isDeprecated = (_a = definition.tags) === null || _a === void 0 ? void 0 : _a.includes(vscode_languageserver_protocol_1.SymbolTag.Deprecated);
        const classNames = ['definitionNode'];
        if (isDeprecated) {
            classNames.push('deprecatedDefinition');
        }
        return React.createElement("div", { className: classNames.join(' ') },
            React.createElement("div", { className: 'symbol-icon-center codicon codicon-symbol-' + this.toIconClass(definition.kind) }),
            React.createElement("div", { className: 'definitionNode-content' },
                React.createElement("span", { className: 'symbol' }, symbol),
                React.createElement("span", { className: 'container' }, container)));
    }
    decorateCallerCaption(caller) {
        var _a;
        const definition = caller.from;
        const symbol = definition.name;
        const referenceCount = caller.fromRanges.length;
        const location = this.labelProvider.getName(uri_1.default.fromComponents(definition.uri));
        const container = location;
        const isDeprecated = (_a = definition.tags) === null || _a === void 0 ? void 0 : _a.includes(vscode_languageserver_protocol_1.SymbolTag.Deprecated);
        const classNames = ['definitionNode'];
        if (isDeprecated) {
            classNames.push('deprecatedDefinition');
        }
        return React.createElement("div", { className: classNames.join(' ') },
            React.createElement("div", { className: 'symbol-icon-center codicon codicon-symbol-' + this.toIconClass(definition.kind) }),
            React.createElement("div", { className: 'definitionNode-content' },
                React.createElement("span", { className: 'symbol' }, symbol),
                React.createElement("span", { className: 'referenceCount' }, (referenceCount > 1) ? `[${referenceCount}]` : ''),
                React.createElement("span", { className: 'container' }, container)));
    }
    // tslint:disable-next-line:typedef
    toIconClass(symbolKind) {
        switch (symbolKind) {
            case vscode_languageserver_protocol_1.SymbolKind.File: return 'file';
            case vscode_languageserver_protocol_1.SymbolKind.Module: return 'module';
            case vscode_languageserver_protocol_1.SymbolKind.Namespace: return 'namespace';
            case vscode_languageserver_protocol_1.SymbolKind.Package: return 'package';
            case vscode_languageserver_protocol_1.SymbolKind.Class: return 'class';
            case vscode_languageserver_protocol_1.SymbolKind.Method: return 'method';
            case vscode_languageserver_protocol_1.SymbolKind.Property: return 'property';
            case vscode_languageserver_protocol_1.SymbolKind.Field: return 'field';
            case vscode_languageserver_protocol_1.SymbolKind.Constructor: return 'constructor';
            case vscode_languageserver_protocol_1.SymbolKind.Enum: return 'enum';
            case vscode_languageserver_protocol_1.SymbolKind.Interface: return 'interface';
            case vscode_languageserver_protocol_1.SymbolKind.Function: return 'function';
            case vscode_languageserver_protocol_1.SymbolKind.Variable: return 'variable';
            case vscode_languageserver_protocol_1.SymbolKind.Constant: return 'constant';
            case vscode_languageserver_protocol_1.SymbolKind.String: return 'string';
            case vscode_languageserver_protocol_1.SymbolKind.Number: return 'number';
            case vscode_languageserver_protocol_1.SymbolKind.Boolean: return 'boolean';
            case vscode_languageserver_protocol_1.SymbolKind.Array: return 'array';
            default: return 'unknown';
        }
    }
    openEditor(node, keepFocus) {
        if (callhierarchy_tree_1.ItemNode.is(node)) {
            const def = node.definition;
            this.doOpenEditor(uri_1.default.fromComponents(def.uri).toString(), def.selectionRange ? def.selectionRange : def.range, keepFocus);
        }
        if (callhierarchy_tree_1.CallerNode.is(node)) {
            this.doOpenEditor(uri_1.default.fromComponents(node.caller.from.uri).toString(), node.caller.fromRanges[0], keepFocus);
        }
    }
    doOpenEditor(uri, range, keepFocus) {
        this.editorManager.open(new uri_1.default(uri), {
            mode: keepFocus ? 'reveal' : 'activate',
            selection: range
        }).then(editorWidget => {
            if (editorWidget.parent instanceof browser_1.DockPanel) {
                editorWidget.parent.selectWidget(editorWidget);
            }
        });
    }
    storeState() {
        const callHierarchyService = this.model.getTree().callHierarchyService;
        if (this.model.root && callHierarchyService) {
            return {
                root: this.deflateForStorage(this.model.root),
                languageId: this.model.languageId,
            };
        }
        else {
            return {};
        }
    }
    restoreState(oldState) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (oldState.root && oldState.languageId) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const root = this.inflateFromStorage(oldState.root);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.model.initializeCallHierarchy(oldState.languageId, uri_1.default.fromComponents(root.definition.uri).toString(), root.definition.range.start);
        }
    }
};
CallHierarchyTreeWidget = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(browser_1.TreeProps)),
    __param(1, (0, inversify_1.inject)(callhierarchy_tree_model_1.CallHierarchyTreeModel)),
    __param(2, (0, inversify_1.inject)(browser_1.ContextMenuRenderer)),
    __param(3, (0, inversify_1.inject)(label_provider_1.LabelProvider)),
    __param(4, (0, inversify_1.inject)(browser_2.EditorManager)),
    __metadata("design:paramtypes", [Object, callhierarchy_tree_model_1.CallHierarchyTreeModel,
        browser_1.ContextMenuRenderer,
        label_provider_1.LabelProvider,
        browser_2.EditorManager])
], CallHierarchyTreeWidget);
exports.CallHierarchyTreeWidget = CallHierarchyTreeWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/callhierarchy/lib/browser/callhierarchy-tree/callhierarchy-tree-widget'] = this;


/***/ }),

/***/ "../../packages/callhierarchy/lib/browser/callhierarchy-tree/callhierarchy-tree.js":
/*!*****************************************************************************************!*\
  !*** ../../packages/callhierarchy/lib/browser/callhierarchy-tree/callhierarchy-tree.js ***!
  \*****************************************************************************************/
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
exports.CallerNode = exports.ItemNode = exports.CallHierarchyTree = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const ts_md5_1 = __webpack_require__(/*! ts-md5 */ "../../node_modules/ts-md5/dist/esm/index.js");
const cancellation_1 = __webpack_require__(/*! @theia/core/lib/common/cancellation */ "../../packages/core/lib/common/cancellation.js");
let CallHierarchyTree = class CallHierarchyTree extends browser_1.TreeImpl {
    set callHierarchyService(callHierarchyService) {
        this._callHierarchyService = callHierarchyService;
    }
    get callHierarchyService() {
        return this._callHierarchyService;
    }
    async resolveChildren(parent) {
        if (!this.callHierarchyService) {
            return Promise.resolve([]);
        }
        if (parent.children.length > 0) {
            return Promise.resolve([...parent.children]);
        }
        let definition;
        if (ItemNode.is(parent)) {
            definition = parent.definition;
        }
        else if (CallerNode.is(parent)) {
            definition = parent.caller.from;
        }
        if (definition) {
            const cancellationSource = new cancellation_1.CancellationTokenSource();
            const callers = await this.callHierarchyService.getCallers(definition, cancellationSource.token);
            if (!callers) {
                return Promise.resolve([]);
            }
            return this.toNodes(callers, parent);
        }
        return Promise.resolve([]);
    }
    toNodes(callers, parent) {
        return callers.map(caller => this.toNode(caller, parent));
    }
    toNode(caller, parent) {
        return CallerNode.create(caller, parent);
    }
};
CallHierarchyTree = __decorate([
    (0, inversify_1.injectable)()
], CallHierarchyTree);
exports.CallHierarchyTree = CallHierarchyTree;
var ItemNode;
(function (ItemNode) {
    function is(node) {
        return !!node && 'definition' in node;
    }
    ItemNode.is = is;
    function create(definition, parent) {
        const name = definition.name;
        const id = createId(definition, parent);
        return {
            id, definition, name, parent,
            visible: true,
            children: [],
            expanded: false,
            selected: false,
        };
    }
    ItemNode.create = create;
})(ItemNode = exports.ItemNode || (exports.ItemNode = {}));
var CallerNode;
(function (CallerNode) {
    function is(node) {
        return !!node && 'caller' in node;
    }
    CallerNode.is = is;
    function create(caller, parent) {
        const callerDefinition = caller.from;
        const name = callerDefinition.name;
        const id = createId(callerDefinition, parent);
        return {
            id, caller, name, parent,
            visible: true,
            children: [],
            expanded: false,
            selected: false,
        };
    }
    CallerNode.create = create;
})(CallerNode = exports.CallerNode || (exports.CallerNode = {}));
function createId(definition, parent) {
    const idPrefix = (parent) ? parent.id + '/' : '';
    const id = idPrefix + ts_md5_1.Md5.hashStr(JSON.stringify(definition));
    return id;
}

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/callhierarchy/lib/browser/callhierarchy-tree/callhierarchy-tree'] = this;


/***/ }),

/***/ "../../packages/callhierarchy/lib/browser/callhierarchy-tree/index.js":
/*!****************************************************************************!*\
  !*** ../../packages/callhierarchy/lib/browser/callhierarchy-tree/index.js ***!
  \****************************************************************************/
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
__exportStar(__webpack_require__(/*! ./callhierarchy-tree */ "../../packages/callhierarchy/lib/browser/callhierarchy-tree/callhierarchy-tree.js"), exports);
__exportStar(__webpack_require__(/*! ./callhierarchy-tree-model */ "../../packages/callhierarchy/lib/browser/callhierarchy-tree/callhierarchy-tree-model.js"), exports);
__exportStar(__webpack_require__(/*! ./callhierarchy-tree-widget */ "../../packages/callhierarchy/lib/browser/callhierarchy-tree/callhierarchy-tree-widget.js"), exports);
__exportStar(__webpack_require__(/*! ./callhierarchy-tree-container */ "../../packages/callhierarchy/lib/browser/callhierarchy-tree/callhierarchy-tree-container.js"), exports);

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/callhierarchy/lib/browser/callhierarchy-tree'] = this;


/***/ }),

/***/ "../../packages/callhierarchy/lib/browser/callhierarchy.js":
/*!*****************************************************************!*\
  !*** ../../packages/callhierarchy/lib/browser/callhierarchy.js ***!
  \*****************************************************************/
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
exports.CALL_HIERARCHY_LABEL = exports.CALL_HIERARCHY_TOGGLE_COMMAND_ID = exports.CALLHIERARCHY_ID = void 0;
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
exports.CALLHIERARCHY_ID = 'callhierarchy';
exports.CALL_HIERARCHY_TOGGLE_COMMAND_ID = 'callhierarchy:toggle';
exports.CALL_HIERARCHY_LABEL = core_1.nls.localizeByDefault('Call Hierarchy');

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/callhierarchy/lib/browser/callhierarchy'] = this;


/***/ }),

/***/ "../../node_modules/css-loader/dist/cjs.js!../../packages/callhierarchy/src/browser/style/index.css":
/*!**********************************************************************************************************!*\
  !*** ../../node_modules/css-loader/dist/cjs.js!../../packages/callhierarchy/src/browser/style/index.css ***!
  \**********************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "../../node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/api.js */ "../../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/********************************************************************************
 * Copyright (C) 2018 TypeFox and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0
 ********************************************************************************/

.theia-CallHierarchyTree {
  font-size: var(--theia-ui-font-size1);
}

.theia-CallHierarchyTree .theia-TreeNode {
  width: 100%;
}

.theia-CallHierarchyTree .theia-ExpansionToggle {
  min-width: 9px;
  padding-right: 4px;
}

.theia-CallHierarchyTree .definitionNode {
  display: flex;
}

.theia-CallHierarchyTree .definitionNode {
  width: calc(100% - 32px);
}

.theia-CallHierarchyTree .definitionNode div {
  margin-right: 5px;
}

.theia-CallHierarchyTree .definitionNode .symbol {
  padding-right: 4px;
}

.theia-CallHierarchyTree .definitionNode .referenceCount {
  color: var(--theia-badge-background);
  padding-right: 4px;
}

.theia-CallHierarchyTree .definitionNode .container {
  color: var(--theia-descriptionForeground);
}

.theia-CallHierarchyTree .definitionNode-content {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.theia-CallHierarchyTree
  .definitionNode.deprecatedDefinition
  .definitionNode-content {
  text-decoration: line-through;
}
`, "",{"version":3,"sources":["webpack://./../../packages/callhierarchy/src/browser/style/index.css"],"names":[],"mappings":"AAAA;;;;;;;;;;;;;;iFAciF;;AAEjF;EACE,qCAAqC;AACvC;;AAEA;EACE,WAAW;AACb;;AAEA;EACE,cAAc;EACd,kBAAkB;AACpB;;AAEA;EACE,aAAa;AACf;;AAEA;EACE,wBAAwB;AAC1B;;AAEA;EACE,iBAAiB;AACnB;;AAEA;EACE,kBAAkB;AACpB;;AAEA;EACE,oCAAoC;EACpC,kBAAkB;AACpB;;AAEA;EACE,yCAAyC;AAC3C;;AAEA;EACE,mBAAmB;EACnB,gBAAgB;EAChB,uBAAuB;AACzB;;AAEA;;;EAGE,6BAA6B;AAC/B","sourcesContent":["/********************************************************************************\n * Copyright (C) 2018 TypeFox and others.\n *\n * This program and the accompanying materials are made available under the\n * terms of the Eclipse Public License v. 2.0 which is available at\n * http://www.eclipse.org/legal/epl-2.0.\n *\n * This Source Code may also be made available under the following Secondary\n * Licenses when the conditions for such availability set forth in the Eclipse\n * Public License v. 2.0 are satisfied: GNU General Public License, version 2\n * with the GNU Classpath Exception which is available at\n * https://www.gnu.org/software/classpath/license.html.\n *\n * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0\n ********************************************************************************/\n\n.theia-CallHierarchyTree {\n  font-size: var(--theia-ui-font-size1);\n}\n\n.theia-CallHierarchyTree .theia-TreeNode {\n  width: 100%;\n}\n\n.theia-CallHierarchyTree .theia-ExpansionToggle {\n  min-width: 9px;\n  padding-right: 4px;\n}\n\n.theia-CallHierarchyTree .definitionNode {\n  display: flex;\n}\n\n.theia-CallHierarchyTree .definitionNode {\n  width: calc(100% - 32px);\n}\n\n.theia-CallHierarchyTree .definitionNode div {\n  margin-right: 5px;\n}\n\n.theia-CallHierarchyTree .definitionNode .symbol {\n  padding-right: 4px;\n}\n\n.theia-CallHierarchyTree .definitionNode .referenceCount {\n  color: var(--theia-badge-background);\n  padding-right: 4px;\n}\n\n.theia-CallHierarchyTree .definitionNode .container {\n  color: var(--theia-descriptionForeground);\n}\n\n.theia-CallHierarchyTree .definitionNode-content {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.theia-CallHierarchyTree\n  .definitionNode.deprecatedDefinition\n  .definitionNode-content {\n  text-decoration: line-through;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../packages/callhierarchy/src/browser/style/index.css":
/*!****************************************************************!*\
  !*** ../../packages/callhierarchy/src/browser/style/index.css ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/css-loader/dist/cjs.js!./index.css */ "../../node_modules/css-loader/dist/cjs.js!../../packages/callhierarchy/src/browser/style/index.css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ })

}]);
//# sourceMappingURL=packages_callhierarchy_lib_browser_callhierarchy-frontend-module_js.js.map