"use strict";
(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_console_lib_browser_console-widget_js"],{

/***/ "../../packages/console/lib/browser/console-content-widget.js":
/*!********************************************************************!*\
  !*** ../../packages/console/lib/browser/console-content-widget.js ***!
  \********************************************************************/
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
var ConsoleContentWidget_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConsoleContentWidget = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const source_tree_1 = __webpack_require__(/*! @theia/core/lib/browser/source-tree */ "../../packages/core/lib/browser/source-tree/index.js");
const console_session_1 = __webpack_require__(/*! ./console-session */ "../../packages/console/lib/browser/console-session.js");
const severity_1 = __webpack_require__(/*! @theia/core/lib/common/severity */ "../../packages/core/lib/common/severity.js");
let ConsoleContentWidget = ConsoleContentWidget_1 = class ConsoleContentWidget extends source_tree_1.SourceTreeWidget {
    constructor() {
        super(...arguments);
        this._shouldScrollToEnd = true;
    }
    set shouldScrollToEnd(shouldScrollToEnd) {
        this._shouldScrollToEnd = shouldScrollToEnd;
        this.shouldScrollToRow = this._shouldScrollToEnd;
    }
    get shouldScrollToEnd() {
        return this._shouldScrollToEnd;
    }
    static createContainer(parent, props) {
        const child = source_tree_1.SourceTreeWidget.createContainer(parent, {
            contextMenuPath: ConsoleContentWidget_1.CONTEXT_MENU,
            ...props
        });
        child.unbind(source_tree_1.SourceTreeWidget);
        child.bind(ConsoleContentWidget_1).toSelf();
        return child;
    }
    onAfterAttach(msg) {
        super.onAfterAttach(msg);
        this.toDisposeOnDetach.push(this.onScrollUp(() => this.shouldScrollToEnd = false));
        this.toDisposeOnDetach.push(this.onScrollYReachEnd(() => this.shouldScrollToEnd = true));
        this.toDisposeOnDetach.push(this.model.onChanged(() => this.revealLastOutputIfNeeded()));
    }
    revealLastOutputIfNeeded() {
        const { root } = this.model;
        if (this.shouldScrollToEnd && source_tree_1.TreeSourceNode.is(root)) {
            this.model.selectNode(root.children[root.children.length - 1]);
        }
    }
    createTreeElementNodeClassNames(node) {
        const classNames = super.createTreeElementNodeClassNames(node);
        if (node.element) {
            const className = this.toClassName(node.element);
            if (className) {
                classNames.push(className);
            }
        }
        return classNames;
    }
    toClassName(item) {
        if (item.severity === severity_1.Severity.Error) {
            return console_session_1.ConsoleItem.errorClassName;
        }
        if (item.severity === severity_1.Severity.Warning) {
            return console_session_1.ConsoleItem.warningClassName;
        }
        if (item.severity === severity_1.Severity.Info) {
            return console_session_1.ConsoleItem.infoClassName;
        }
        if (item.severity === severity_1.Severity.Log) {
            return console_session_1.ConsoleItem.logClassName;
        }
        return undefined;
    }
};
ConsoleContentWidget.CONTEXT_MENU = ['console-context-menu'];
ConsoleContentWidget = ConsoleContentWidget_1 = __decorate([
    (0, inversify_1.injectable)()
], ConsoleContentWidget);
exports.ConsoleContentWidget = ConsoleContentWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/console/lib/browser/console-content-widget'] = this;


/***/ }),

/***/ "../../packages/console/lib/browser/console-history.js":
/*!*************************************************************!*\
  !*** ../../packages/console/lib/browser/console-history.js ***!
  \*************************************************************/
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
var ConsoleHistory_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConsoleHistory = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
let ConsoleHistory = ConsoleHistory_1 = class ConsoleHistory {
    constructor() {
        this.values = [];
        this.index = -1;
    }
    push(value) {
        this.delete(value);
        this.values.push(value);
        this.trim();
        this.index = this.values.length;
    }
    delete(value) {
        const index = this.values.indexOf(value);
        if (index !== -1) {
            this.values.splice(index, 1);
        }
    }
    trim() {
        const index = this.values.length - ConsoleHistory_1.limit;
        if (index > 0) {
            this.values = this.values.slice(index);
        }
    }
    get current() {
        return this.values[this.index];
    }
    get previous() {
        this.index = Math.max(this.index - 1, -1);
        return this.current;
    }
    get next() {
        this.index = Math.min(this.index + 1, this.values.length);
        return this.current;
    }
    store() {
        const { values, index } = this;
        return { values, index };
    }
    restore(object) {
        this.values = object.values;
        this.index = object.index;
    }
};
ConsoleHistory.limit = 50;
ConsoleHistory = ConsoleHistory_1 = __decorate([
    (0, inversify_1.injectable)()
], ConsoleHistory);
exports.ConsoleHistory = ConsoleHistory;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/console/lib/browser/console-history'] = this;


/***/ }),

/***/ "../../packages/console/lib/browser/console-session-manager.js":
/*!*********************************************************************!*\
  !*** ../../packages/console/lib/browser/console-session-manager.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2021 TypeFox and others.
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
exports.ConsoleSessionManager = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const severity_1 = __webpack_require__(/*! @theia/core/lib/common/severity */ "../../packages/core/lib/common/severity.js");
let ConsoleSessionManager = class ConsoleSessionManager {
    constructor() {
        this.sessions = new Map();
        this.sessionAddedEmitter = new core_1.Emitter();
        this.sessionDeletedEmitter = new core_1.Emitter();
        this.sessionWasShownEmitter = new core_1.Emitter();
        this.sessionWasHiddenEmitter = new core_1.Emitter();
        this.selectedSessionChangedEmitter = new core_1.Emitter();
        this.severityChangedEmitter = new core_1.Emitter();
        this.toDispose = new core_1.DisposableCollection();
        this.toDisposeOnSessionDeletion = new Map();
    }
    get onDidAddSession() {
        return this.sessionAddedEmitter.event;
    }
    get onDidDeleteSession() {
        return this.sessionDeletedEmitter.event;
    }
    get onDidShowSession() {
        return this.sessionWasShownEmitter.event;
    }
    get onDidHideSession() {
        return this.sessionWasHiddenEmitter.event;
    }
    get onDidChangeSelectedSession() {
        return this.selectedSessionChangedEmitter.event;
    }
    get onDidChangeSeverity() {
        return this.severityChangedEmitter.event;
    }
    dispose() {
        this.toDispose.dispose();
    }
    get severity() {
        return this._severity;
    }
    set severity(value) {
        value = value || severity_1.Severity.Ignore;
        this._severity = value;
        for (const session of this.sessions.values()) {
            session.severity = value;
        }
        this.severityChangedEmitter.fire(undefined);
    }
    get all() {
        return Array.from(this.sessions.values());
    }
    get selectedSession() {
        return this._selectedSession;
    }
    set selectedSession(session) {
        const oldSession = this.selectedSession;
        this._selectedSession = session;
        this.selectedSessionChangedEmitter.fire(session);
        if (oldSession !== session) {
            if (oldSession) {
                this.sessionWasHiddenEmitter.fire(oldSession);
            }
            if (session) {
                this.sessionWasShownEmitter.fire(session);
            }
        }
    }
    get(id) {
        return this.sessions.get(id);
    }
    add(session) {
        this.sessions.set(session.id, session);
        this.sessionAddedEmitter.fire(session);
        if (this.sessions.size === 1) {
            this.selectedSession = session;
        }
    }
    delete(id) {
        const session = this.sessions.get(id);
        if (this.sessions.delete(id) && session) {
            if (this.selectedSession === session) {
                // select a new sessions or undefined if none are left
                this.selectedSession = this.sessions.values().next().value;
            }
            session.dispose();
            this.sessionDeletedEmitter.fire(session);
        }
    }
};
ConsoleSessionManager = __decorate([
    (0, inversify_1.injectable)()
], ConsoleSessionManager);
exports.ConsoleSessionManager = ConsoleSessionManager;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/console/lib/browser/console-session-manager'] = this;


/***/ }),

/***/ "../../packages/console/lib/browser/console-widget.js":
/*!************************************************************!*\
  !*** ../../packages/console/lib/browser/console-widget.js ***!
  \************************************************************/
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
var ConsoleWidget_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConsoleWidget = exports.ConsoleOptions = void 0;
const domutils_1 = __webpack_require__(/*! @theia/core/shared/@phosphor/domutils */ "../../packages/core/shared/@phosphor/domutils/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const source_tree_1 = __webpack_require__(/*! @theia/core/lib/browser/source-tree */ "../../packages/core/lib/browser/source-tree/index.js");
const context_key_service_1 = __webpack_require__(/*! @theia/core/lib/browser/context-key-service */ "../../packages/core/lib/browser/context-key-service.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const monaco_editor_provider_1 = __webpack_require__(/*! @theia/monaco/lib/browser/monaco-editor-provider */ "../../packages/monaco/lib/browser/monaco-editor-provider.js");
const console_history_1 = __webpack_require__(/*! ./console-history */ "../../packages/console/lib/browser/console-history.js");
const console_content_widget_1 = __webpack_require__(/*! ./console-content-widget */ "../../packages/console/lib/browser/console-content-widget.js");
const console_session_manager_1 = __webpack_require__(/*! ./console-session-manager */ "../../packages/console/lib/browser/console-session-manager.js");
const monaco = __webpack_require__(/*! @theia/monaco-editor-core */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/editor.main.js");
exports.ConsoleOptions = Symbol('ConsoleWidgetOptions');
let ConsoleWidget = ConsoleWidget_1 = class ConsoleWidget extends browser_1.BaseWidget {
    constructor() {
        super();
        this.totalHeight = -1;
        this.totalWidth = -1;
        this.node.classList.add(ConsoleWidget_1.styles.node);
    }
    static createContainer(parent, options) {
        const child = console_content_widget_1.ConsoleContentWidget.createContainer(parent);
        child.bind(console_history_1.ConsoleHistory).toSelf();
        child.bind(exports.ConsoleOptions).toConstantValue(options);
        child.bind(ConsoleWidget_1).toSelf();
        return child;
    }
    init() {
        this.doInit();
    }
    async doInit() {
        const { id, title, inputFocusContextKey } = this.options;
        const { label, iconClass, caption } = Object.assign({}, title);
        this.id = id;
        this.title.closable = true;
        this.title.label = label || id;
        if (iconClass) {
            this.title.iconClass = iconClass;
        }
        this.title.caption = caption || label || id;
        const layout = this.layout = new browser_1.PanelLayout();
        this.content.node.classList.add(ConsoleWidget_1.styles.content);
        this.toDispose.push(this.content);
        layout.addWidget(this.content);
        const inputWidget = new browser_1.Widget();
        inputWidget.node.classList.add(ConsoleWidget_1.styles.input);
        layout.addWidget(inputWidget);
        const input = this._input = await this.createInput(inputWidget.node);
        this.toDispose.push(input);
        this.toDispose.push(input.getControl().onDidLayoutChange(() => this.resizeContent()));
        this.toDispose.push(input.getControl().onDidChangeConfiguration(event => {
            if (event.hasChanged(monaco.editor.EditorOption.fontInfo)) {
                this.updateFont();
            }
        }));
        this.session = this.sessionManager.selectedSession;
        this.toDispose.push(this.sessionManager.onDidChangeSelectedSession(session => {
            // Do not clear the session output when `undefined`.
            if (session) {
                this.session = session;
            }
        }));
        this.updateFont();
        if (inputFocusContextKey) {
            this.toDispose.push(input.onFocusChanged(() => inputFocusContextKey.set(this.hasInputFocus())));
            this.toDispose.push(input.onCursorPositionChanged(() => input.getControl().createContextKey('consoleNavigationBackEnabled', this.consoleNavigationBackEnabled)));
            this.toDispose.push(input.onCursorPositionChanged(() => input.getControl().createContextKey('consoleNavigationForwardEnabled', this.consoleNavigationForwardEnabled)));
        }
        input.getControl().createContextKey('consoleInputFocus', true);
        const contentContext = this.contextKeyService.createScoped(this.content.node);
        contentContext.setContext('consoleContentFocus', true);
        this.toDispose.push(contentContext);
    }
    createInput(node) {
        return this.editorProvider.createInline(this.options.input.uri, node, this.options.input.options);
    }
    updateFont() {
        const { fontFamily, fontSize, lineHeight } = this._input.getControl().getOption(monaco.editor.EditorOption.fontInfo);
        this.content.node.style.fontFamily = fontFamily;
        this.content.node.style.fontSize = fontSize + 'px';
        this.content.node.style.lineHeight = lineHeight + 'px';
    }
    set session(session) {
        if (this._session === session) {
            return;
        }
        this._session = session;
        this.content.source = session;
    }
    get session() {
        return this._session;
    }
    get input() {
        return this._input;
    }
    get consoleNavigationBackEnabled() {
        const editor = this.input.getControl();
        return !!editor.getPosition().equals({ lineNumber: 1, column: 1 });
    }
    get consoleNavigationForwardEnabled() {
        const editor = this.input.getControl();
        const lineNumber = editor.getModel().getLineCount();
        const column = editor.getModel().getLineMaxColumn(lineNumber);
        return !!editor.getPosition().equals({ lineNumber, column });
    }
    selectAll() {
        const selection = document.getSelection();
        if (selection) {
            selection.selectAllChildren(this.content.node);
        }
    }
    collapseAll() {
        const { root } = this.content.model;
        if (browser_1.CompositeTreeNode.is(root)) {
            this.content.model.collapseAll(root);
        }
    }
    clear() {
        if (this.session) {
            this.session.clear();
        }
    }
    async execute() {
        const value = this._input.getControl().getValue();
        this._input.getControl().setValue('');
        this.history.push(value);
        if (this.session) {
            const listener = this.content.model.onNodeRefreshed(() => {
                listener.dispose();
                this.revealLastOutput();
            });
            await this.session.execute(value);
        }
    }
    navigateBack() {
        const value = this.history.previous;
        if (value === undefined) {
            return;
        }
        const editor = this.input.getControl();
        editor.setValue(value);
        editor.setPosition({
            lineNumber: 1,
            column: 1
        });
    }
    navigateForward() {
        const value = this.history.next || '';
        const editor = this.input.getControl();
        editor.setValue(value);
        const lineNumber = editor.getModel().getLineCount();
        const column = editor.getModel().getLineMaxColumn(lineNumber);
        editor.setPosition({ lineNumber, column });
    }
    revealLastOutput() {
        const { root } = this.content.model;
        if (source_tree_1.TreeSourceNode.is(root)) {
            this.content.model.selectNode(root.children[root.children.length - 1]);
        }
    }
    onActivateRequest(msg) {
        super.onActivateRequest(msg);
        this._input.focus();
    }
    onResize(msg) {
        super.onResize(msg);
        this.totalWidth = msg.width;
        this.totalHeight = msg.height;
        this._input.resizeToFit();
        this.resizeContent();
    }
    resizeContent() {
        this.totalHeight = this.totalHeight < 0 ? this.computeHeight() : this.totalHeight;
        const inputHeight = this._input.getControl().getLayoutInfo().height;
        const contentHeight = this.totalHeight - inputHeight;
        this.content.node.style.height = `${contentHeight}px`;
        browser_1.MessageLoop.sendMessage(this.content, new browser_1.Widget.ResizeMessage(this.totalWidth, contentHeight));
    }
    computeHeight() {
        const { verticalSum } = domutils_1.ElementExt.boxSizing(this.node);
        return this.node.offsetHeight - verticalSum;
    }
    storeState() {
        const history = this.history.store();
        const input = this.input.storeViewState();
        return {
            history,
            input
        };
    }
    restoreState(oldState) {
        if ('history' in oldState) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.history.restore(oldState['history']);
        }
        this.input.getControl().setValue(this.history.current || '');
        if ('input' in oldState) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.input.restoreViewState(oldState['input']);
        }
    }
    hasInputFocus() {
        return this._input && this._input.isFocused({ strict: true });
    }
};
ConsoleWidget.styles = {
    node: 'theia-console-widget',
    content: 'theia-console-content',
    input: 'theia-console-input',
};
__decorate([
    (0, inversify_1.inject)(exports.ConsoleOptions),
    __metadata("design:type", Object)
], ConsoleWidget.prototype, "options", void 0);
__decorate([
    (0, inversify_1.inject)(console_content_widget_1.ConsoleContentWidget),
    __metadata("design:type", console_content_widget_1.ConsoleContentWidget)
], ConsoleWidget.prototype, "content", void 0);
__decorate([
    (0, inversify_1.inject)(console_history_1.ConsoleHistory),
    __metadata("design:type", console_history_1.ConsoleHistory)
], ConsoleWidget.prototype, "history", void 0);
__decorate([
    (0, inversify_1.inject)(console_session_manager_1.ConsoleSessionManager),
    __metadata("design:type", console_session_manager_1.ConsoleSessionManager)
], ConsoleWidget.prototype, "sessionManager", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_editor_provider_1.MonacoEditorProvider),
    __metadata("design:type", monaco_editor_provider_1.MonacoEditorProvider)
], ConsoleWidget.prototype, "editorProvider", void 0);
__decorate([
    (0, inversify_1.inject)(context_key_service_1.ContextKeyService),
    __metadata("design:type", Object)
], ConsoleWidget.prototype, "contextKeyService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ConsoleWidget.prototype, "init", null);
ConsoleWidget = ConsoleWidget_1 = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], ConsoleWidget);
exports.ConsoleWidget = ConsoleWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/console/lib/browser/console-widget'] = this;


/***/ })

}]);
//# sourceMappingURL=packages_console_lib_browser_console-widget_js.js.map