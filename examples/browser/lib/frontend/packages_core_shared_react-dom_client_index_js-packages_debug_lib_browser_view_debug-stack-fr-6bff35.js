(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_core_shared_react-dom_client_index_js-packages_debug_lib_browser_view_debug-stack-fr-6bff35"],{

/***/ "../../packages/core/shared/react-dom/client/index.js":
/*!************************************************************!*\
  !*** ../../packages/core/shared/react-dom/client/index.js ***!
  \************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! react-dom/client */ "../../node_modules/react-dom/client.js");

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/core/shared/react-dom/client'] = this;


/***/ }),

/***/ "../../packages/debug/lib/browser/debug-call-stack-item-type-key.js":
/*!**************************************************************************!*\
  !*** ../../packages/debug/lib/browser/debug-call-stack-item-type-key.js ***!
  \**************************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DebugCallStackItemTypeKey = void 0;
exports.DebugCallStackItemTypeKey = Symbol('DebugCallStackItemTypeKey');

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/debug/lib/browser/debug-call-stack-item-type-key'] = this;


/***/ }),

/***/ "../../packages/debug/lib/browser/debug-watch-manager.js":
/*!***************************************************************!*\
  !*** ../../packages/debug/lib/browser/debug-watch-manager.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
exports.DebugWatchManager = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const event_1 = __webpack_require__(/*! @theia/core/lib/common/event */ "../../packages/core/lib/common/event.js");
const storage_service_1 = __webpack_require__(/*! @theia/core/lib/browser/storage-service */ "../../packages/core/lib/browser/storage-service.js");
let DebugWatchManager = class DebugWatchManager {
    constructor() {
        this.onDidChangeEmitter = new event_1.Emitter();
        this.onDidChange = this.onDidChangeEmitter.event;
        this.idSequence = 0;
        this._watchExpressions = new Map();
    }
    get watchExpressions() {
        return this._watchExpressions.entries();
    }
    addWatchExpression(expression) {
        const id = this.idSequence++;
        this._watchExpressions.set(id, expression);
        this.onDidChangeEmitter.fire(undefined);
        return id;
    }
    removeWatchExpression(id) {
        if (!this._watchExpressions.has(id)) {
            return false;
        }
        this._watchExpressions.delete(id);
        this.onDidChangeEmitter.fire(undefined);
        return true;
    }
    removeWatchExpressions() {
        if (this._watchExpressions.size) {
            this.idSequence = 0;
            this._watchExpressions.clear();
            this.onDidChangeEmitter.fire(undefined);
        }
    }
    async load() {
        const data = await this.storage.getData(this.storageKey, {
            expressions: []
        });
        this.restoreState(data);
    }
    save() {
        const data = this.storeState();
        this.storage.setData(this.storageKey, data);
    }
    get storageKey() {
        return 'debug:watch';
    }
    storeState() {
        return {
            expressions: [...this._watchExpressions.values()]
        };
    }
    restoreState(state) {
        for (const expression of state.expressions) {
            this.addWatchExpression(expression);
        }
    }
};
__decorate([
    (0, inversify_1.inject)(storage_service_1.StorageService),
    __metadata("design:type", Object)
], DebugWatchManager.prototype, "storage", void 0);
DebugWatchManager = __decorate([
    (0, inversify_1.injectable)()
], DebugWatchManager);
exports.DebugWatchManager = DebugWatchManager;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/debug/lib/browser/debug-watch-manager'] = this;


/***/ }),

/***/ "../../packages/debug/lib/browser/view/debug-action.js":
/*!*************************************************************!*\
  !*** ../../packages/debug/lib/browser/view/debug-action.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DebugAction = void 0;
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
class DebugAction extends React.Component {
    constructor() {
        super(...arguments);
        this.setRef = (ref) => this.ref = ref || undefined;
    }
    render() {
        const { enabled, label, iconClass } = this.props;
        const classNames = ['debug-action'];
        if (iconClass) {
            classNames.push(...(0, browser_1.codiconArray)(iconClass, true));
        }
        if (enabled === false) {
            classNames.push(browser_1.DISABLED_CLASS);
        }
        return React.createElement("span", { tabIndex: 0, className: classNames.join(' '), title: label, onClick: this.props.run, ref: this.setRef }, !iconClass && React.createElement("div", null, label));
    }
    focus() {
        if (this.ref) {
            this.ref.focus();
        }
    }
}
exports.DebugAction = DebugAction;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/debug/lib/browser/view/debug-action'] = this;


/***/ }),

/***/ "../../packages/debug/lib/browser/view/debug-stack-frames-source.js":
/*!**************************************************************************!*\
  !*** ../../packages/debug/lib/browser/view/debug-stack-frames-source.js ***!
  \**************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoadMoreStackFrames = exports.DebugStackFramesSource = void 0;
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const source_tree_1 = __webpack_require__(/*! @theia/core/lib/browser/source-tree */ "../../packages/core/lib/browser/source-tree/index.js");
const debug_view_model_1 = __webpack_require__(/*! ./debug-view-model */ "../../packages/debug/lib/browser/view/debug-view-model.js");
const debounce = __webpack_require__(/*! p-debounce */ "../../node_modules/p-debounce/index.js");
let DebugStackFramesSource = class DebugStackFramesSource extends source_tree_1.TreeSource {
    constructor() {
        super(...arguments);
        this.refresh = debounce(() => this.fireDidChange(), 100);
    }
    init() {
        this.refresh();
        this.toDispose.push(this.model.onDidChange(() => this.refresh()));
    }
    *getElements() {
        const thread = this.model.currentThread;
        if (!thread) {
            return;
        }
        yield* thread.frames;
        if (thread.stoppedDetails) {
            const { framesErrorMessage, totalFrames } = thread.stoppedDetails;
            if (framesErrorMessage) {
                yield {
                    render: () => React.createElement("span", { title: framesErrorMessage }, framesErrorMessage)
                };
            }
            if (totalFrames && totalFrames > thread.frameCount) {
                yield new LoadMoreStackFrames(thread);
            }
        }
    }
};
__decorate([
    (0, inversify_1.inject)(debug_view_model_1.DebugViewModel),
    __metadata("design:type", debug_view_model_1.DebugViewModel)
], DebugStackFramesSource.prototype, "model", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DebugStackFramesSource.prototype, "init", null);
DebugStackFramesSource = __decorate([
    (0, inversify_1.injectable)()
], DebugStackFramesSource);
exports.DebugStackFramesSource = DebugStackFramesSource;
class LoadMoreStackFrames {
    constructor(thread) {
        this.thread = thread;
    }
    render() {
        return React.createElement("span", { className: 'theia-load-more-frames' }, "Load More Stack Frames");
    }
    async open() {
        const frames = await this.thread.fetchFrames();
        if (frames[0]) {
            this.thread.currentFrame = frames[0];
        }
    }
}
exports.LoadMoreStackFrames = LoadMoreStackFrames;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/debug/lib/browser/view/debug-stack-frames-source'] = this;


/***/ }),

/***/ "../../packages/debug/lib/browser/view/debug-stack-frames-widget.js":
/*!**************************************************************************!*\
  !*** ../../packages/debug/lib/browser/view/debug-stack-frames-widget.js ***!
  \**************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2018 Red Hat, Inc. and others.
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
var DebugStackFramesWidget_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DebugStackFramesWidget = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const source_tree_1 = __webpack_require__(/*! @theia/core/lib/browser/source-tree */ "../../packages/core/lib/browser/source-tree/index.js");
const debug_stack_frames_source_1 = __webpack_require__(/*! ./debug-stack-frames-source */ "../../packages/debug/lib/browser/view/debug-stack-frames-source.js");
const debug_stack_frame_1 = __webpack_require__(/*! ../model/debug-stack-frame */ "../../packages/debug/lib/browser/model/debug-stack-frame.js");
const debug_view_model_1 = __webpack_require__(/*! ./debug-view-model */ "../../packages/debug/lib/browser/view/debug-view-model.js");
const debug_call_stack_item_type_key_1 = __webpack_require__(/*! ../debug-call-stack-item-type-key */ "../../packages/debug/lib/browser/debug-call-stack-item-type-key.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
let DebugStackFramesWidget = DebugStackFramesWidget_1 = class DebugStackFramesWidget extends source_tree_1.SourceTreeWidget {
    constructor() {
        super(...arguments);
        this.updatingSelection = false;
    }
    static createContainer(parent) {
        const child = source_tree_1.SourceTreeWidget.createContainer(parent, {
            contextMenuPath: DebugStackFramesWidget_1.CONTEXT_MENU,
            virtualized: false,
            scrollIfActive: true
        });
        child.bind(debug_stack_frames_source_1.DebugStackFramesSource).toSelf();
        child.unbind(source_tree_1.SourceTreeWidget);
        child.bind(DebugStackFramesWidget_1).toSelf();
        return child;
    }
    static createWidget(parent) {
        return DebugStackFramesWidget_1.createContainer(parent).get(DebugStackFramesWidget_1);
    }
    init() {
        super.init();
        this.id = DebugStackFramesWidget_1.FACTORY_ID + ':' + this.viewModel.id;
        this.title.label = nls_1.nls.localizeByDefault('Call Stack');
        this.toDispose.push(this.frames);
        this.source = this.frames;
        this.toDispose.push(this.viewModel.onDidChange(() => this.updateWidgetSelection()));
        this.toDispose.push(this.model.onNodeRefreshed(() => this.updateWidgetSelection()));
        this.toDispose.push(this.model.onSelectionChanged(() => this.updateModelSelection()));
    }
    async updateWidgetSelection() {
        if (this.updatingSelection) {
            return;
        }
        this.updatingSelection = true;
        try {
            const { currentFrame } = this.viewModel;
            if (currentFrame) {
                const node = this.model.getNode(currentFrame.id);
                if (browser_1.SelectableTreeNode.is(node)) {
                    this.model.selectNode(node);
                }
            }
        }
        finally {
            this.updatingSelection = false;
        }
    }
    async updateModelSelection() {
        if (this.updatingSelection) {
            return;
        }
        this.updatingSelection = true;
        try {
            const node = this.model.selectedNodes[0];
            if (source_tree_1.TreeElementNode.is(node)) {
                if (node.element instanceof debug_stack_frame_1.DebugStackFrame) {
                    node.element.thread.currentFrame = node.element;
                    this.debugCallStackItemTypeKey.set('stackFrame');
                }
            }
        }
        finally {
            this.updatingSelection = false;
        }
    }
    toContextMenuArgs(node) {
        if (source_tree_1.TreeElementNode.is(node)) {
            if (node.element instanceof debug_stack_frame_1.DebugStackFrame) {
                const source = node.element.source;
                if (source) {
                    if (source.inMemory) {
                        const path = source.raw.path || source.raw.sourceReference;
                        if (path !== undefined) {
                            return [path];
                        }
                    }
                    else {
                        return [source.uri.toString()];
                    }
                }
            }
        }
        return undefined;
    }
    tapNode(node) {
        if (source_tree_1.TreeElementNode.is(node) && node.element instanceof debug_stack_frames_source_1.LoadMoreStackFrames) {
            node.element.open();
        }
        super.tapNode(node);
    }
    getDefaultNodeStyle(node, props) {
        return undefined;
    }
};
DebugStackFramesWidget.CONTEXT_MENU = ['debug-frames-context-menu'];
DebugStackFramesWidget.FACTORY_ID = 'debug:frames';
__decorate([
    (0, inversify_1.inject)(debug_stack_frames_source_1.DebugStackFramesSource),
    __metadata("design:type", debug_stack_frames_source_1.DebugStackFramesSource)
], DebugStackFramesWidget.prototype, "frames", void 0);
__decorate([
    (0, inversify_1.inject)(debug_view_model_1.DebugViewModel),
    __metadata("design:type", debug_view_model_1.DebugViewModel)
], DebugStackFramesWidget.prototype, "viewModel", void 0);
__decorate([
    (0, inversify_1.inject)(debug_call_stack_item_type_key_1.DebugCallStackItemTypeKey),
    __metadata("design:type", Object)
], DebugStackFramesWidget.prototype, "debugCallStackItemTypeKey", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DebugStackFramesWidget.prototype, "init", null);
DebugStackFramesWidget = DebugStackFramesWidget_1 = __decorate([
    (0, inversify_1.injectable)()
], DebugStackFramesWidget);
exports.DebugStackFramesWidget = DebugStackFramesWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/debug/lib/browser/view/debug-stack-frames-widget'] = this;


/***/ }),

/***/ "../../packages/debug/lib/browser/view/debug-threads-source.js":
/*!*********************************************************************!*\
  !*** ../../packages/debug/lib/browser/view/debug-threads-source.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DebugThreadsSource = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const source_tree_1 = __webpack_require__(/*! @theia/core/lib/browser/source-tree */ "../../packages/core/lib/browser/source-tree/index.js");
const debug_view_model_1 = __webpack_require__(/*! ./debug-view-model */ "../../packages/debug/lib/browser/view/debug-view-model.js");
let DebugThreadsSource = class DebugThreadsSource extends source_tree_1.TreeSource {
    init() {
        this.fireDidChange();
        this.toDispose.push(this.model.onDidChange(() => this.fireDidChange()));
    }
    get multiSession() {
        return this.model.sessionCount > 1;
    }
    *getElements() {
        if (this.model.sessionCount === 1 && this.model.session && this.model.session.threadCount) {
            return yield* this.model.session.threads;
        }
        for (const session of this.model.sessions) {
            if (!session.parentSession) {
                yield session;
            }
        }
    }
};
__decorate([
    (0, inversify_1.inject)(debug_view_model_1.DebugViewModel),
    __metadata("design:type", debug_view_model_1.DebugViewModel)
], DebugThreadsSource.prototype, "model", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DebugThreadsSource.prototype, "init", null);
DebugThreadsSource = __decorate([
    (0, inversify_1.injectable)()
], DebugThreadsSource);
exports.DebugThreadsSource = DebugThreadsSource;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/debug/lib/browser/view/debug-threads-source'] = this;


/***/ }),

/***/ "../../packages/debug/lib/browser/view/debug-threads-widget.js":
/*!*********************************************************************!*\
  !*** ../../packages/debug/lib/browser/view/debug-threads-widget.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var DebugThreadsWidget_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DebugThreadsWidget = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const source_tree_1 = __webpack_require__(/*! @theia/core/lib/browser/source-tree */ "../../packages/core/lib/browser/source-tree/index.js");
const debug_threads_source_1 = __webpack_require__(/*! ./debug-threads-source */ "../../packages/debug/lib/browser/view/debug-threads-source.js");
const debug_session_1 = __webpack_require__(/*! ../debug-session */ "../../packages/debug/lib/browser/debug-session.js");
const debug_thread_1 = __webpack_require__(/*! ../model/debug-thread */ "../../packages/debug/lib/browser/model/debug-thread.js");
const debug_view_model_1 = __webpack_require__(/*! ../view/debug-view-model */ "../../packages/debug/lib/browser/view/debug-view-model.js");
const debug_call_stack_item_type_key_1 = __webpack_require__(/*! ../debug-call-stack-item-type-key */ "../../packages/debug/lib/browser/debug-call-stack-item-type-key.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
let DebugThreadsWidget = DebugThreadsWidget_1 = class DebugThreadsWidget extends source_tree_1.SourceTreeWidget {
    constructor() {
        super(...arguments);
        this.updatingSelection = false;
    }
    static createContainer(parent) {
        const child = source_tree_1.SourceTreeWidget.createContainer(parent, {
            contextMenuPath: DebugThreadsWidget_1.CONTEXT_MENU,
            virtualized: false,
            scrollIfActive: true
        });
        child.bind(debug_threads_source_1.DebugThreadsSource).toSelf();
        child.unbind(source_tree_1.SourceTreeWidget);
        child.bind(DebugThreadsWidget_1).toSelf();
        return child;
    }
    static createWidget(parent) {
        return DebugThreadsWidget_1.createContainer(parent).get(DebugThreadsWidget_1);
    }
    init() {
        super.init();
        this.id = DebugThreadsWidget_1.FACTORY_ID + ':' + this.viewModel.id;
        this.title.label = nls_1.nls.localize('theia/debug/threads', 'Threads');
        this.toDispose.push(this.threads);
        this.source = this.threads;
        this.toDispose.push(this.viewModel.onDidChange(() => this.updateWidgetSelection()));
        this.toDispose.push(this.model.onSelectionChanged(() => this.updateModelSelection()));
    }
    updateWidgetSelection() {
        if (this.updatingSelection) {
            return;
        }
        this.updatingSelection = true;
        try {
            const { currentThread } = this.viewModel;
            if (currentThread) {
                const node = this.model.getNode(currentThread.id);
                if (browser_1.SelectableTreeNode.is(node)) {
                    this.model.selectNode(node);
                }
            }
        }
        finally {
            this.updatingSelection = false;
        }
    }
    updateModelSelection() {
        if (this.updatingSelection) {
            return;
        }
        this.updatingSelection = true;
        try {
            const node = this.model.selectedNodes[0];
            if (source_tree_1.TreeElementNode.is(node)) {
                if (node.element instanceof debug_session_1.DebugSession) {
                    this.viewModel.currentSession = node.element;
                    this.debugCallStackItemTypeKey.set('session');
                }
                else if (node.element instanceof debug_thread_1.DebugThread) {
                    node.element.session.currentThread = node.element;
                    this.debugCallStackItemTypeKey.set('thread');
                }
            }
        }
        finally {
            this.updatingSelection = false;
        }
    }
    toContextMenuArgs(node) {
        if (source_tree_1.TreeElementNode.is(node) && node.element instanceof debug_thread_1.DebugThread) {
            return [node.element.raw.id];
        }
        return undefined;
    }
    getDefaultNodeStyle(node, props) {
        if (this.threads.multiSession) {
            return super.getDefaultNodeStyle(node, props);
        }
        return undefined;
    }
};
DebugThreadsWidget.CONTEXT_MENU = ['debug-threads-context-menu'];
DebugThreadsWidget.CONTROL_MENU = [...DebugThreadsWidget_1.CONTEXT_MENU, 'a_control'];
DebugThreadsWidget.TERMINATE_MENU = [...DebugThreadsWidget_1.CONTEXT_MENU, 'b_terminate'];
DebugThreadsWidget.OPEN_MENU = [...DebugThreadsWidget_1.CONTEXT_MENU, 'c_open'];
DebugThreadsWidget.FACTORY_ID = 'debug:threads';
__decorate([
    (0, inversify_1.inject)(debug_threads_source_1.DebugThreadsSource),
    __metadata("design:type", debug_threads_source_1.DebugThreadsSource)
], DebugThreadsWidget.prototype, "threads", void 0);
__decorate([
    (0, inversify_1.inject)(debug_view_model_1.DebugViewModel),
    __metadata("design:type", debug_view_model_1.DebugViewModel)
], DebugThreadsWidget.prototype, "viewModel", void 0);
__decorate([
    (0, inversify_1.inject)(debug_call_stack_item_type_key_1.DebugCallStackItemTypeKey),
    __metadata("design:type", Object)
], DebugThreadsWidget.prototype, "debugCallStackItemTypeKey", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DebugThreadsWidget.prototype, "init", null);
DebugThreadsWidget = DebugThreadsWidget_1 = __decorate([
    (0, inversify_1.injectable)()
], DebugThreadsWidget);
exports.DebugThreadsWidget = DebugThreadsWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/debug/lib/browser/view/debug-threads-widget'] = this;


/***/ }),

/***/ "../../packages/debug/lib/browser/view/debug-toolbar-widget.js":
/*!*********************************************************************!*\
  !*** ../../packages/debug/lib/browser/view/debug-toolbar-widget.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// *****************************************************************************
// Copyright (C) 2018 Red Hat, Inc. and others.
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
var DebugToolBar_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DebugToolBar = void 0;
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const context_key_service_1 = __webpack_require__(/*! @theia/core/lib/browser/context-key-service */ "../../packages/core/lib/browser/context-key-service.js");
const widgets_1 = __webpack_require__(/*! @theia/core/lib/browser/widgets */ "../../packages/core/lib/browser/widgets/index.js");
const debug_view_model_1 = __webpack_require__(/*! ./debug-view-model */ "../../packages/debug/lib/browser/view/debug-view-model.js");
const debug_session_1 = __webpack_require__(/*! ../debug-session */ "../../packages/debug/lib/browser/debug-session.js");
const debug_action_1 = __webpack_require__(/*! ./debug-action */ "../../packages/debug/lib/browser/view/debug-action.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
let DebugToolBar = DebugToolBar_1 = class DebugToolBar extends widgets_1.ReactWidget {
    constructor() {
        super(...arguments);
        this.onRender = new core_1.DisposableCollection();
        this.setStepRef = (stepRef) => {
            this.stepRef = stepRef || undefined;
            this.onRender.dispose();
        };
        this.start = () => this.model.start();
        this.restart = () => this.model.restart();
        this.stop = () => this.model.terminate();
        this.continue = () => this.model.currentThread && this.model.currentThread.continue();
        this.pause = () => this.model.currentThread && this.model.currentThread.pause();
        this.stepOver = () => this.model.currentThread && this.model.currentThread.stepOver();
        this.stepIn = () => this.model.currentThread && this.model.currentThread.stepIn();
        this.stepOut = () => this.model.currentThread && this.model.currentThread.stepOut();
    }
    init() {
        this.id = 'debug:toolbar:' + this.model.id;
        this.addClass('debug-toolbar');
        this.toDispose.push(this.model);
        this.toDispose.push(this.model.onDidChange(() => this.update()));
        this.scrollOptions = undefined;
        this.update();
    }
    focus() {
        if (!this.doFocus()) {
            this.onRender.push(core_1.Disposable.create(() => this.doFocus()));
            this.update();
        }
    }
    doFocus() {
        if (!this.stepRef) {
            return false;
        }
        this.stepRef.focus();
        return true;
    }
    render() {
        const { state } = this.model;
        return React.createElement(React.Fragment, null,
            this.renderContributedCommands(),
            this.renderContinue(),
            React.createElement(debug_action_1.DebugAction, { enabled: state === debug_session_1.DebugState.Stopped, run: this.stepOver, label: nls_1.nls.localizeByDefault('Step Over'), iconClass: 'debug-step-over', ref: this.setStepRef }),
            React.createElement(debug_action_1.DebugAction, { enabled: state === debug_session_1.DebugState.Stopped, run: this.stepIn, label: nls_1.nls.localizeByDefault('Step Into'), iconClass: 'debug-step-into' }),
            React.createElement(debug_action_1.DebugAction, { enabled: state === debug_session_1.DebugState.Stopped, run: this.stepOut, label: nls_1.nls.localizeByDefault('Step Out'), iconClass: 'debug-step-out' }),
            React.createElement(debug_action_1.DebugAction, { enabled: state !== debug_session_1.DebugState.Inactive, run: this.restart, label: nls_1.nls.localizeByDefault('Restart'), iconClass: 'debug-restart' }),
            this.renderStart());
    }
    renderContributedCommands() {
        const debugActions = [];
        // first, search for CompoundMenuNodes:
        this.menuModelRegistry.getMenu(DebugToolBar_1.MENU).children.forEach(compoundMenuNode => {
            if (core_1.CompoundMenuNode.is(compoundMenuNode) && this.matchContext(compoundMenuNode.when)) {
                // second, search for nested CommandMenuNodes:
                compoundMenuNode.children.forEach(commandMenuNode => {
                    if (core_1.CommandMenuNode.is(commandMenuNode) && this.matchContext(commandMenuNode.when)) {
                        debugActions.push(this.debugAction(commandMenuNode));
                    }
                });
            }
        });
        return debugActions;
    }
    matchContext(when) {
        return !when || this.contextKeyService.match(when);
    }
    debugAction(commandMenuNode) {
        const { command, icon = '', label = '' } = commandMenuNode;
        if (!label && !icon) {
            const { when } = commandMenuNode;
            console.warn(`Neither 'label' nor 'icon' properties were defined for the command menu node. (${JSON.stringify({ command, when })}}. Skipping.`);
            return;
        }
        const run = () => this.commandRegistry.executeCommand(command);
        return React.createElement(debug_action_1.DebugAction, { key: command, enabled: true, label: label, iconClass: icon, run: run });
    }
    renderStart() {
        const { state } = this.model;
        if (state === debug_session_1.DebugState.Inactive && this.model.sessionCount === 1) {
            return React.createElement(debug_action_1.DebugAction, { run: this.start, label: nls_1.nls.localizeByDefault('Start'), iconClass: 'debug-start' });
        }
        return React.createElement(debug_action_1.DebugAction, { enabled: state !== debug_session_1.DebugState.Inactive, run: this.stop, label: nls_1.nls.localizeByDefault('Stop'), iconClass: 'debug-stop' });
    }
    renderContinue() {
        const { state } = this.model;
        if (state === debug_session_1.DebugState.Stopped) {
            return React.createElement(debug_action_1.DebugAction, { run: this.continue, label: nls_1.nls.localizeByDefault('Continue'), iconClass: 'debug-continue' });
        }
        return React.createElement(debug_action_1.DebugAction, { enabled: state === debug_session_1.DebugState.Running, run: this.pause, label: nls_1.nls.localizeByDefault('Pause'), iconClass: 'debug-pause' });
    }
};
DebugToolBar.MENU = ['debug-toolbar-menu'];
__decorate([
    (0, inversify_1.inject)(core_1.CommandRegistry),
    __metadata("design:type", core_1.CommandRegistry)
], DebugToolBar.prototype, "commandRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.MenuModelRegistry),
    __metadata("design:type", core_1.MenuModelRegistry)
], DebugToolBar.prototype, "menuModelRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(context_key_service_1.ContextKeyService),
    __metadata("design:type", Object)
], DebugToolBar.prototype, "contextKeyService", void 0);
__decorate([
    (0, inversify_1.inject)(debug_view_model_1.DebugViewModel),
    __metadata("design:type", debug_view_model_1.DebugViewModel)
], DebugToolBar.prototype, "model", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DebugToolBar.prototype, "init", null);
DebugToolBar = DebugToolBar_1 = __decorate([
    (0, inversify_1.injectable)()
], DebugToolBar);
exports.DebugToolBar = DebugToolBar;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/debug/lib/browser/view/debug-toolbar-widget'] = this;


/***/ }),

/***/ "../../packages/debug/lib/browser/view/debug-variables-source.js":
/*!***********************************************************************!*\
  !*** ../../packages/debug/lib/browser/view/debug-variables-source.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DebugVariablesSource = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const source_tree_1 = __webpack_require__(/*! @theia/core/lib/browser/source-tree */ "../../packages/core/lib/browser/source-tree/index.js");
const debug_view_model_1 = __webpack_require__(/*! ./debug-view-model */ "../../packages/debug/lib/browser/view/debug-view-model.js");
const debounce = __webpack_require__(/*! p-debounce */ "../../node_modules/p-debounce/index.js");
let DebugVariablesSource = class DebugVariablesSource extends source_tree_1.TreeSource {
    constructor() {
        super(...arguments);
        this.refresh = debounce(() => this.fireDidChange(), 400);
    }
    init() {
        this.refresh();
        this.toDispose.push(this.model.onDidChange(() => this.refresh()));
    }
    async getElements() {
        const { currentSession } = this.model;
        const scopes = currentSession ? await currentSession.getScopes() : [];
        return scopes[Symbol.iterator]();
    }
};
__decorate([
    (0, inversify_1.inject)(debug_view_model_1.DebugViewModel),
    __metadata("design:type", debug_view_model_1.DebugViewModel)
], DebugVariablesSource.prototype, "model", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DebugVariablesSource.prototype, "init", null);
DebugVariablesSource = __decorate([
    (0, inversify_1.injectable)()
], DebugVariablesSource);
exports.DebugVariablesSource = DebugVariablesSource;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/debug/lib/browser/view/debug-variables-source'] = this;


/***/ }),

/***/ "../../packages/debug/lib/browser/view/debug-variables-widget.js":
/*!***********************************************************************!*\
  !*** ../../packages/debug/lib/browser/view/debug-variables-widget.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var DebugVariablesWidget_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DebugVariablesWidget = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const source_tree_1 = __webpack_require__(/*! @theia/core/lib/browser/source-tree */ "../../packages/core/lib/browser/source-tree/index.js");
const debug_variables_source_1 = __webpack_require__(/*! ./debug-variables-source */ "../../packages/debug/lib/browser/view/debug-variables-source.js");
const debug_view_model_1 = __webpack_require__(/*! ./debug-view-model */ "../../packages/debug/lib/browser/view/debug-view-model.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
let DebugVariablesWidget = DebugVariablesWidget_1 = class DebugVariablesWidget extends source_tree_1.SourceTreeWidget {
    static createContainer(parent) {
        const child = source_tree_1.SourceTreeWidget.createContainer(parent, {
            contextMenuPath: DebugVariablesWidget_1.CONTEXT_MENU,
            virtualized: false,
            scrollIfActive: true
        });
        child.bind(debug_variables_source_1.DebugVariablesSource).toSelf();
        child.unbind(source_tree_1.SourceTreeWidget);
        child.bind(DebugVariablesWidget_1).toSelf();
        return child;
    }
    static createWidget(parent) {
        return DebugVariablesWidget_1.createContainer(parent).get(DebugVariablesWidget_1);
    }
    init() {
        super.init();
        this.id = DebugVariablesWidget_1.FACTORY_ID + ':' + this.viewModel.id;
        this.title.label = nls_1.nls.localizeByDefault('Variables');
        this.toDispose.push(this.variables);
        this.source = this.variables;
    }
};
DebugVariablesWidget.CONTEXT_MENU = ['debug-variables-context-menu'];
DebugVariablesWidget.EDIT_MENU = [...DebugVariablesWidget_1.CONTEXT_MENU, 'a_edit'];
DebugVariablesWidget.WATCH_MENU = [...DebugVariablesWidget_1.CONTEXT_MENU, 'b_watch'];
DebugVariablesWidget.FACTORY_ID = 'debug:variables';
__decorate([
    (0, inversify_1.inject)(debug_view_model_1.DebugViewModel),
    __metadata("design:type", debug_view_model_1.DebugViewModel)
], DebugVariablesWidget.prototype, "viewModel", void 0);
__decorate([
    (0, inversify_1.inject)(debug_variables_source_1.DebugVariablesSource),
    __metadata("design:type", debug_variables_source_1.DebugVariablesSource)
], DebugVariablesWidget.prototype, "variables", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DebugVariablesWidget.prototype, "init", null);
DebugVariablesWidget = DebugVariablesWidget_1 = __decorate([
    (0, inversify_1.injectable)()
], DebugVariablesWidget);
exports.DebugVariablesWidget = DebugVariablesWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/debug/lib/browser/view/debug-variables-widget'] = this;


/***/ }),

/***/ "../../packages/debug/lib/browser/view/debug-view-model.js":
/*!*****************************************************************!*\
  !*** ../../packages/debug/lib/browser/view/debug-view-model.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DebugViewModel = void 0;
const p_debounce_1 = __webpack_require__(/*! p-debounce */ "../../node_modules/p-debounce/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const debug_session_1 = __webpack_require__(/*! ../debug-session */ "../../packages/debug/lib/browser/debug-session.js");
const debug_session_manager_1 = __webpack_require__(/*! ../debug-session-manager */ "../../packages/debug/lib/browser/debug-session-manager.js");
const debug_watch_expression_1 = __webpack_require__(/*! ./debug-watch-expression */ "../../packages/debug/lib/browser/view/debug-watch-expression.js");
const debug_watch_manager_1 = __webpack_require__(/*! ../debug-watch-manager */ "../../packages/debug/lib/browser/debug-watch-manager.js");
let DebugViewModel = class DebugViewModel {
    constructor() {
        this.onDidChangeEmitter = new common_1.Emitter();
        this.onDidChange = this.onDidChangeEmitter.event;
        this.onDidChangeBreakpointsEmitter = new common_1.Emitter();
        this.onDidChangeBreakpoints = this.onDidChangeBreakpointsEmitter.event;
        this._watchExpressions = new Map();
        this.onDidChangeWatchExpressionsEmitter = new common_1.Emitter();
        this.onDidChangeWatchExpressions = this.onDidChangeWatchExpressionsEmitter.event;
        this.toDispose = new common_1.DisposableCollection(this.onDidChangeEmitter, this.onDidChangeBreakpointsEmitter, this.onDidChangeWatchExpressionsEmitter);
        this.refreshWatchExpressionsQueue = Promise.resolve();
        this.refreshWatchExpressions = (0, p_debounce_1.default)(() => {
            this.refreshWatchExpressionsQueue = this.refreshWatchExpressionsQueue.then(async () => {
                try {
                    for (const watchExpression of this.watchExpressions) {
                        await watchExpression.evaluate();
                    }
                }
                catch (e) {
                    console.error('Failed to refresh watch expressions: ', e);
                }
            });
        }, 50);
    }
    fireDidChange() {
        this.refreshWatchExpressions();
        this.onDidChangeEmitter.fire(undefined);
    }
    fireDidChangeBreakpoints(uri) {
        this.onDidChangeBreakpointsEmitter.fire(uri);
    }
    fireDidChangeWatchExpressions() {
        this.onDidChangeWatchExpressionsEmitter.fire(undefined);
    }
    get sessions() {
        return this.manager.sessions[Symbol.iterator]();
    }
    get sessionCount() {
        return this.manager.sessions.length;
    }
    get session() {
        return this.currentSession;
    }
    get id() {
        return this.session && this.session.id || '-1';
    }
    get label() {
        return this.session && this.session.label || 'Unknown Session';
    }
    init() {
        this.toDispose.push(this.manager.onDidChangeActiveDebugSession(() => {
            this.fireDidChange();
        }));
        this.toDispose.push(this.manager.onDidChange(current => {
            if (current === this.currentSession) {
                this.fireDidChange();
            }
        }));
        this.toDispose.push(this.manager.onDidChangeBreakpoints(({ session, uri }) => {
            if (!session || session === this.currentSession) {
                this.fireDidChangeBreakpoints(uri);
            }
        }));
        this.updateWatchExpressions();
        this.toDispose.push(this.watch.onDidChange(() => this.updateWatchExpressions()));
    }
    dispose() {
        this.toDispose.dispose();
    }
    get currentSession() {
        const { currentSession } = this.manager;
        return currentSession;
    }
    set currentSession(currentSession) {
        this.manager.currentSession = currentSession;
    }
    get state() {
        const { currentSession } = this;
        return currentSession && currentSession.state || debug_session_1.DebugState.Inactive;
    }
    get currentThread() {
        const { currentSession } = this;
        return currentSession && currentSession.currentThread;
    }
    get currentFrame() {
        const { currentThread } = this;
        return currentThread && currentThread.currentFrame;
    }
    get breakpoints() {
        return this.manager.getBreakpoints(this.currentSession);
    }
    get functionBreakpoints() {
        return this.manager.getFunctionBreakpoints(this.currentSession);
    }
    get instructionBreakpoints() {
        return this.manager.getInstructionBreakpoints(this.currentSession);
    }
    async start() {
        const { session } = this;
        if (!session) {
            return;
        }
        const newSession = await this.manager.start(session.options);
        if (newSession) {
            this.fireDidChange();
        }
    }
    async restart() {
        const { session } = this;
        if (!session) {
            return;
        }
        await this.manager.restartSession(session);
        this.fireDidChange();
    }
    async terminate() {
        this.manager.terminateSession();
    }
    get watchExpressions() {
        return this._watchExpressions.values();
    }
    async addWatchExpression(expression = '') {
        const watchExpression = new debug_watch_expression_1.DebugWatchExpression({
            id: Number.MAX_SAFE_INTEGER,
            expression,
            session: () => this.currentSession,
            remove: () => this.removeWatchExpression(watchExpression),
            onDidChange: () => { },
        });
        await watchExpression.open();
        if (!watchExpression.expression) {
            return undefined;
        }
        const id = this.watch.addWatchExpression(watchExpression.expression);
        return this._watchExpressions.get(id);
    }
    removeWatchExpressions() {
        this.watch.removeWatchExpressions();
    }
    removeWatchExpression(expression) {
        this.watch.removeWatchExpression(expression.id);
    }
    updateWatchExpressions() {
        let added = false;
        const toRemove = new Set(this._watchExpressions.keys());
        for (const [id, expression] of this.watch.watchExpressions) {
            toRemove.delete(id);
            if (!this._watchExpressions.has(id)) {
                added = true;
                const watchExpression = new debug_watch_expression_1.DebugWatchExpression({
                    id,
                    expression,
                    session: () => this.currentSession,
                    remove: () => this.removeWatchExpression(watchExpression),
                    onDidChange: () => this.fireDidChangeWatchExpressions()
                });
                this._watchExpressions.set(id, watchExpression);
                watchExpression.evaluate();
            }
        }
        for (const id of toRemove) {
            this._watchExpressions.delete(id);
        }
        if (added || toRemove.size) {
            this.fireDidChangeWatchExpressions();
        }
    }
};
__decorate([
    (0, inversify_1.inject)(debug_session_manager_1.DebugSessionManager),
    __metadata("design:type", debug_session_manager_1.DebugSessionManager)
], DebugViewModel.prototype, "manager", void 0);
__decorate([
    (0, inversify_1.inject)(debug_watch_manager_1.DebugWatchManager),
    __metadata("design:type", debug_watch_manager_1.DebugWatchManager)
], DebugViewModel.prototype, "watch", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DebugViewModel.prototype, "init", null);
DebugViewModel = __decorate([
    (0, inversify_1.injectable)()
], DebugViewModel);
exports.DebugViewModel = DebugViewModel;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/debug/lib/browser/view/debug-view-model'] = this;


/***/ }),

/***/ "../../packages/debug/lib/browser/view/debug-watch-expression.js":
/*!***********************************************************************!*\
  !*** ../../packages/debug/lib/browser/view/debug-watch-expression.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DebugWatchExpression = void 0;
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const dialogs_1 = __webpack_require__(/*! @theia/core/lib/browser/dialogs */ "../../packages/core/lib/browser/dialogs.js");
const debug_console_items_1 = __webpack_require__(/*! ../console/debug-console-items */ "../../packages/debug/lib/browser/console/debug-console-items.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
class DebugWatchExpression extends debug_console_items_1.ExpressionItem {
    constructor(options) {
        super(options.expression, options.session);
        this.options = options;
        this.setValueRef = (valueRef) => this.valueRef = valueRef || undefined;
        this.id = options.id;
    }
    async evaluate() {
        await super.evaluate('watch');
    }
    setResult(body, error) {
        if (this.options.session()) {
            super.setResult(body, error);
            this.isError = !!error;
        }
        this.options.onDidChange();
    }
    render() {
        return React.createElement("div", { className: 'theia-debug-console-variable theia-debug-watch-expression' },
            React.createElement("div", { className: browser_1.TREE_NODE_SEGMENT_GROW_CLASS },
                React.createElement("span", { title: this.type || this._expression, className: 'name' },
                    this._expression,
                    ": "),
                React.createElement("span", { title: this._value, ref: this.setValueRef, className: this.isError ? 'watch-error' : '' }, this._value)),
            React.createElement("div", { className: (0, browser_1.codicon)('close', true), title: core_1.nls.localizeByDefault('Remove Expression'), onClick: this.options.remove }));
    }
    async open() {
        const input = new dialogs_1.SingleTextInputDialog({
            title: core_1.nls.localizeByDefault('Edit Expression'),
            initialValue: this.expression,
            placeholder: core_1.nls.localizeByDefault('Expression to watch')
        });
        const newValue = await input.open();
        if (newValue !== undefined) {
            this._expression = newValue;
            await this.evaluate();
        }
    }
    get supportCopyValue() {
        return !!this.valueRef && document.queryCommandSupported('copy');
    }
    copyValue() {
        const selection = document.getSelection();
        if (this.valueRef && selection) {
            selection.selectAllChildren(this.valueRef);
            document.execCommand('copy');
        }
    }
}
exports.DebugWatchExpression = DebugWatchExpression;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/debug/lib/browser/view/debug-watch-expression'] = this;


/***/ }),

/***/ "../../packages/monaco/lib/browser/monaco-editor-zone-widget.js":
/*!**********************************************************************!*\
  !*** ../../packages/monaco/lib/browser/monaco-editor-zone-widget.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation and others. All rights reserved.
 *  Licensed under the MIT License. See https://github.com/Microsoft/vscode/blob/master/LICENSE.txt for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MonacoEditorZoneWidget = void 0;
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/editor/lib/browser */ "../../packages/editor/lib/browser/index.js");
const monaco = __webpack_require__(/*! @theia/monaco-editor-core */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/editor.main.js");
class MonacoEditorZoneWidget {
    constructor(editorInstance, showArrow = true) {
        this.showArrow = showArrow;
        this.zoneNode = document.createElement('div');
        this.containerNode = document.createElement('div');
        this.onDidLayoutChangeEmitter = new core_1.Emitter();
        this.onDidLayoutChange = this.onDidLayoutChangeEmitter.event;
        this.toHide = new core_1.DisposableCollection();
        this.toDispose = new core_1.DisposableCollection(this.onDidLayoutChangeEmitter, this.toHide);
        this.editor = editorInstance;
        this.zoneNode.classList.add('zone-widget');
        this.containerNode.classList.add('zone-widget-container');
        this.zoneNode.appendChild(this.containerNode);
        this.updateWidth();
        this.toDispose.push(this.editor.onDidLayoutChange(info => this.updateWidth(info)));
    }
    dispose() {
        this.toDispose.dispose();
        this.hide();
    }
    get options() {
        return this.viewZone ? this._options : undefined;
    }
    hide() {
        this.toHide.dispose();
    }
    show(options) {
        let { afterLineNumber, afterColumn, heightInLines } = this._options = { showFrame: true, ...options };
        const lineHeight = this.editor.getOption(monaco.editor.EditorOption.lineHeight);
        // adjust heightInLines to viewport
        const maxHeightInLines = Math.max(12, (this.editor.getLayoutInfo().height / lineHeight) * 0.8);
        heightInLines = Math.min(heightInLines, maxHeightInLines);
        let arrowHeight = 0;
        this.toHide.dispose();
        this.editor.changeViewZones(accessor => {
            this.zoneNode.style.top = '-1000px';
            const domNode = document.createElement('div');
            domNode.style.overflow = 'hidden';
            const zone = {
                domNode,
                afterLineNumber,
                afterColumn,
                heightInLines,
                onDomNodeTop: zoneTop => this.updateTop(zoneTop),
                onComputedHeight: zoneHeight => this.updateHeight(zoneHeight)
            };
            this.viewZone = Object.assign(zone, {
                id: accessor.addZone(zone)
            });
            const id = this.viewZone.id;
            this.toHide.push(core_1.Disposable.create(() => {
                this.editor.changeViewZones(a => a.removeZone(id));
                this.viewZone = undefined;
            }));
            if (this.showArrow) {
                this.arrow = new Arrow(this.editor);
                arrowHeight = Math.round(lineHeight / 3);
                this.arrow.height = arrowHeight;
                this.arrow.show({ lineNumber: options.afterLineNumber, column: 0 });
                this.toHide.push(this.arrow);
            }
            const widget = {
                getId: () => 'editor-zone-widget-' + id,
                getDomNode: () => this.zoneNode,
                // eslint-disable-next-line no-null/no-null
                getPosition: () => null
            };
            this.editor.addOverlayWidget(widget);
            this.toHide.push(core_1.Disposable.create(() => this.editor.removeOverlayWidget(widget)));
        });
        this.containerNode.style.overflow = 'hidden';
        this.updateContainerHeight(heightInLines * lineHeight);
        const model = this.editor.getModel();
        if (model) {
            const revealLineNumber = Math.min(model.getLineCount(), Math.max(1, afterLineNumber + 1));
            this.editor.revealLine(revealLineNumber, monaco.editor.ScrollType.Smooth);
        }
    }
    layout(heightInLines) {
        if (this.viewZone && this.viewZone.heightInLines !== heightInLines) {
            this.viewZone.heightInLines = heightInLines;
            const id = this.viewZone.id;
            this.editor.changeViewZones(accessor => accessor.layoutZone(id));
        }
    }
    updateTop(top) {
        this.zoneNode.style.top = top + (this.showArrow ? 6 : 0) + 'px';
    }
    updateHeight(zoneHeight) {
        this.zoneNode.style.height = zoneHeight + 'px';
        this.updateContainerHeight(zoneHeight);
    }
    updateContainerHeight(zoneHeight) {
        const { frameWidth, height } = this.computeContainerHeight(zoneHeight);
        this.containerNode.style.height = height + 'px';
        this.containerNode.style.borderTopWidth = frameWidth + 'px';
        this.containerNode.style.borderBottomWidth = frameWidth + 'px';
        const width = this.computeWidth();
        this.onDidLayoutChangeEmitter.fire({ height, width });
    }
    computeContainerHeight(zoneHeight) {
        const lineHeight = this.editor.getOption(monaco.editor.EditorOption.lineHeight);
        const frameWidth = this._options && this._options.frameWidth;
        const frameThickness = this._options && this._options.showFrame ? Math.round(lineHeight / 9) : 0;
        return {
            frameWidth: frameWidth !== undefined ? frameWidth : frameThickness,
            height: zoneHeight - 2 * frameThickness
        };
    }
    updateWidth(info = this.editor.getLayoutInfo()) {
        const width = this.computeWidth(info);
        this.zoneNode.style.width = width + 'px';
        this.zoneNode.style.left = this.computeLeft(info) + 'px';
    }
    computeWidth(info = this.editor.getLayoutInfo()) {
        return info.width - info.minimap.minimapWidth - info.verticalScrollbarWidth;
    }
    computeLeft(info = this.editor.getLayoutInfo()) {
        // If minimap is to the left, we move beyond it
        if (info.minimap.minimapWidth > 0 && info.minimap.minimapLeft === 0) {
            return info.minimap.minimapWidth;
        }
        return 0;
    }
}
exports.MonacoEditorZoneWidget = MonacoEditorZoneWidget;
class IdGenerator {
    constructor(prefix) {
        this.prefix = prefix;
        this.lastId = 0;
    }
    nextId() {
        return this.prefix + (++this.lastId);
    }
}
class Arrow {
    constructor(_editor) {
        this._editor = _editor;
        this.idGenerator = new IdGenerator('.arrow-decoration-');
        this.ruleName = this.idGenerator.nextId();
        this.decorations = [];
        this._height = -1;
    }
    dispose() {
        this.hide();
    }
    set height(value) {
        if (this._height !== value) {
            this._height = value;
            this._updateStyle();
        }
    }
    _updateStyle() {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.media = 'screen';
        document.getElementsByTagName('head')[0].appendChild(style);
        const selector = `.monaco-editor ${this.ruleName}`;
        const cssText = `border-style: solid; border-color: transparent transparent var(--theia-peekView-border); border-width:
            ${this._height}px; bottom: -${this._height}px; margin-left: -${this._height}px; `;
        style.sheet.insertRule(selector + '{' + cssText + '}', 0);
    }
    show(where) {
        this.decorations = this._editor.deltaDecorations(this.decorations, [{ range: monaco.Range.fromPositions(where), options: { className: this.ruleName, stickiness: browser_1.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges } }]);
    }
    hide() {
        this._editor.deltaDecorations(this.decorations, []);
    }
}

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/monaco/lib/browser/monaco-editor-zone-widget'] = this;


/***/ })

}]);
//# sourceMappingURL=packages_core_shared_react-dom_client_index_js-packages_debug_lib_browser_view_debug-stack-fr-6bff35.js.map