"use strict";
(self["webpackChunk_theia_example_browser"] = self["webpackChunk_theia_example_browser"] || []).push([["packages_debug_lib_browser_debug-frontend-application-contribution_js-packages_debug_lib_brow-54d658"],{

/***/ "../../packages/console/lib/browser/ansi-console-item.js":
/*!***************************************************************!*\
  !*** ../../packages/console/lib/browser/ansi-console-item.js ***!
  \***************************************************************/
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
exports.AnsiConsoleItem = void 0;
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const DOMPurify = __webpack_require__(/*! @theia/core/shared/dompurify */ "../../packages/core/shared/dompurify/index.js");
const Anser = __webpack_require__(/*! anser */ "../../node_modules/anser/lib/index.js");
class AnsiConsoleItem {
    constructor(content, severity) {
        this.content = content;
        this.severity = severity;
        this.htmlContent = new Anser().ansiToHtml(this.content, {
            use_classes: true,
            remove_empty: true
        });
    }
    get visible() {
        return !!this.htmlContent;
    }
    render() {
        return React.createElement("div", { className: 'theia-console-ansi-console-item', dangerouslySetInnerHTML: { __html: DOMPurify.sanitize(this.htmlContent) } });
    }
}
exports.AnsiConsoleItem = AnsiConsoleItem;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/console/lib/browser/ansi-console-item'] = this;


/***/ }),

/***/ "../../packages/debug/lib/browser/console/debug-console-contribution.js":
/*!******************************************************************************!*\
  !*** ../../packages/debug/lib/browser/console/debug-console-contribution.js ***!
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
var DebugConsoleContribution_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DebugConsoleContribution = exports.DebugConsoleCommands = exports.InDebugReplContextKey = void 0;
const console_session_manager_1 = __webpack_require__(/*! @theia/console/lib/browser/console-session-manager */ "../../packages/console/lib/browser/console-session-manager.js");
const console_widget_1 = __webpack_require__(/*! @theia/console/lib/browser/console-widget */ "../../packages/console/lib/browser/console-widget.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const context_key_service_1 = __webpack_require__(/*! @theia/core/lib/browser/context-key-service */ "../../packages/core/lib/browser/context-key-service.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
const tab_bar_toolbar_1 = __webpack_require__(/*! @theia/core/lib/browser/shell/tab-bar-toolbar */ "../../packages/core/lib/browser/shell/tab-bar-toolbar/index.js");
const command_1 = __webpack_require__(/*! @theia/core/lib/common/command */ "../../packages/core/lib/common/command.js");
const severity_1 = __webpack_require__(/*! @theia/core/lib/common/severity */ "../../packages/core/lib/common/severity.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const select_component_1 = __webpack_require__(/*! @theia/core/lib/browser/widgets/select-component */ "../../packages/core/lib/browser/widgets/select-component.js");
const debug_session_manager_1 = __webpack_require__(/*! ../debug-session-manager */ "../../packages/debug/lib/browser/debug-session-manager.js");
const debug_console_session_1 = __webpack_require__(/*! ./debug-console-session */ "../../packages/debug/lib/browser/console/debug-console-session.js");
exports.InDebugReplContextKey = Symbol('inDebugReplContextKey');
var DebugConsoleCommands;
(function (DebugConsoleCommands) {
    DebugConsoleCommands.DEBUG_CATEGORY = 'Debug';
    DebugConsoleCommands.CLEAR = command_1.Command.toDefaultLocalizedCommand({
        id: 'debug.console.clear',
        category: DebugConsoleCommands.DEBUG_CATEGORY,
        label: 'Clear Console',
        iconClass: (0, browser_1.codicon)('clear-all')
    });
})(DebugConsoleCommands = exports.DebugConsoleCommands || (exports.DebugConsoleCommands = {}));
let DebugConsoleContribution = DebugConsoleContribution_1 = class DebugConsoleContribution extends browser_1.AbstractViewContribution {
    constructor() {
        super({
            widgetId: DebugConsoleContribution_1.options.id,
            widgetName: DebugConsoleContribution_1.options.title.label,
            defaultWidgetOptions: {
                area: 'bottom'
            },
            toggleCommandId: 'debug:console:toggle',
            toggleKeybinding: 'ctrlcmd+shift+y'
        });
        this.changeDebugConsole = (option) => {
            const id = option.value;
            const session = this.consoleSessionManager.get(id);
            this.consoleSessionManager.selectedSession = session;
        };
        this.changeSeverity = (option) => {
            this.consoleSessionManager.severity = severity_1.Severity.fromValue(option.value);
        };
    }
    init() {
        this.debugSessionManager.onDidCreateDebugSession(session => {
            const consoleParent = session.findConsoleParent();
            if (consoleParent) {
                const parentConsoleSession = this.consoleSessionManager.get(consoleParent.id);
                if (parentConsoleSession instanceof debug_console_session_1.DebugConsoleSession) {
                    session.on('output', event => parentConsoleSession.logOutput(parentConsoleSession.debugSession, event));
                }
            }
            else {
                const consoleSession = this.debugConsoleSessionFactory(session);
                this.consoleSessionManager.add(consoleSession);
                session.on('output', event => consoleSession.logOutput(session, event));
            }
        });
        this.debugSessionManager.onDidChangeActiveDebugSession(event => this.handleActiveDebugSessionChanged(event));
        this.debugSessionManager.onDidDestroyDebugSession(session => {
            this.consoleSessionManager.delete(session.id);
        });
    }
    handleActiveDebugSessionChanged(event) {
        if (!event.current) {
            this.consoleSessionManager.selectedSession = undefined;
        }
        else {
            const topSession = event.current.findConsoleParent() || event.current;
            const consoleSession = topSession ? this.consoleSessionManager.get(topSession.id) : undefined;
            this.consoleSessionManager.selectedSession = consoleSession;
            const consoleSelector = document.getElementById('debugConsoleSelector');
            if (consoleSession && consoleSelector instanceof HTMLSelectElement) {
                consoleSelector.value = consoleSession.id;
            }
        }
    }
    registerCommands(commands) {
        super.registerCommands(commands);
        commands.registerCommand(DebugConsoleCommands.CLEAR, {
            isEnabled: widget => this.withWidget(widget, () => true),
            isVisible: widget => this.withWidget(widget, () => true),
            execute: widget => this.withWidget(widget, () => {
                this.clearConsole();
            }),
        });
    }
    async registerToolbarItems(toolbarRegistry) {
        toolbarRegistry.registerItem({
            id: 'debug-console-severity',
            render: widget => this.renderSeveritySelector(widget),
            isVisible: widget => this.withWidget(widget, () => true),
            onDidChange: this.consoleSessionManager.onDidChangeSeverity
        });
        toolbarRegistry.registerItem({
            id: 'debug-console-session-selector',
            render: widget => this.renderDebugConsoleSelector(widget),
            isVisible: widget => this.withWidget(widget, () => this.consoleSessionManager.all.length > 1)
        });
        toolbarRegistry.registerItem({
            id: DebugConsoleCommands.CLEAR.id,
            command: DebugConsoleCommands.CLEAR.id,
            tooltip: DebugConsoleCommands.CLEAR.label,
            priority: 0,
        });
    }
    static create(parent) {
        const inputFocusContextKey = parent.get(exports.InDebugReplContextKey);
        const child = console_widget_1.ConsoleWidget.createContainer(parent, {
            ...DebugConsoleContribution_1.options,
            inputFocusContextKey
        });
        const widget = child.get(console_widget_1.ConsoleWidget);
        return widget;
    }
    static bindContribution(bind) {
        bind(exports.InDebugReplContextKey).toDynamicValue(({ container }) => container.get(context_key_service_1.ContextKeyService).createKey('inDebugRepl', false)).inSingletonScope();
        bind(debug_console_session_1.DebugConsoleSession).toSelf().inRequestScope();
        bind(debug_console_session_1.DebugConsoleSessionFactory).toFactory(context => (session) => {
            const consoleSession = context.container.get(debug_console_session_1.DebugConsoleSession);
            consoleSession.debugSession = session;
            return consoleSession;
        });
        bind(console_session_manager_1.ConsoleSessionManager).toSelf().inSingletonScope();
        (0, browser_1.bindViewContribution)(bind, DebugConsoleContribution_1);
        bind(tab_bar_toolbar_1.TabBarToolbarContribution).toService(DebugConsoleContribution_1);
        bind(browser_1.WidgetFactory).toDynamicValue(({ container }) => ({
            id: DebugConsoleContribution_1.options.id,
            createWidget: () => DebugConsoleContribution_1.create(container)
        }));
    }
    renderSeveritySelector(widget) {
        const severityElements = severity_1.Severity.toArray().map(e => ({
            value: e,
            label: severity_1.Severity.toLocaleString(e)
        }));
        return React.createElement(select_component_1.SelectComponent, { key: "debugConsoleSeverity", options: severityElements, defaultValue: this.consoleSessionManager.severity || severity_1.Severity.Ignore, onChange: this.changeSeverity });
    }
    renderDebugConsoleSelector(widget) {
        const availableConsoles = [];
        this.consoleSessionManager.all.forEach(e => {
            if (e instanceof debug_console_session_1.DebugConsoleSession) {
                availableConsoles.push({
                    value: e.id,
                    label: e.debugSession.label
                });
            }
        });
        return React.createElement(select_component_1.SelectComponent, { key: "debugConsoleSelector", options: availableConsoles, defaultValue: 0, onChange: this.changeDebugConsole });
    }
    withWidget(widget = this.tryGetWidget(), fn) {
        if (widget instanceof console_widget_1.ConsoleWidget && widget.id === DebugConsoleContribution_1.options.id) {
            return fn(widget);
        }
        return false;
    }
    /**
     * Clear the console widget.
     */
    async clearConsole() {
        const widget = await this.widget;
        widget.clear();
    }
};
DebugConsoleContribution.options = {
    id: 'debug-console',
    title: {
        label: nls_1.nls.localizeByDefault('Debug Console'),
        iconClass: (0, browser_1.codicon)('debug-console')
    },
    input: {
        uri: debug_console_session_1.DebugConsoleSession.uri,
        options: {
            autoSizing: true,
            minHeight: 1,
            maxHeight: 10
        }
    }
};
__decorate([
    (0, inversify_1.inject)(console_session_manager_1.ConsoleSessionManager),
    __metadata("design:type", console_session_manager_1.ConsoleSessionManager)
], DebugConsoleContribution.prototype, "consoleSessionManager", void 0);
__decorate([
    (0, inversify_1.inject)(debug_console_session_1.DebugConsoleSessionFactory),
    __metadata("design:type", Function)
], DebugConsoleContribution.prototype, "debugConsoleSessionFactory", void 0);
__decorate([
    (0, inversify_1.inject)(debug_session_manager_1.DebugSessionManager),
    __metadata("design:type", debug_session_manager_1.DebugSessionManager)
], DebugConsoleContribution.prototype, "debugSessionManager", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DebugConsoleContribution.prototype, "init", null);
DebugConsoleContribution = DebugConsoleContribution_1 = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], DebugConsoleContribution);
exports.DebugConsoleContribution = DebugConsoleContribution;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/debug/lib/browser/console/debug-console-contribution'] = this;


/***/ }),

/***/ "../../packages/debug/lib/browser/console/debug-console-session.js":
/*!*************************************************************************!*\
  !*** ../../packages/debug/lib/browser/console/debug-console-session.js ***!
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
var DebugConsoleSession_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DebugConsoleSession = exports.DebugConsoleSessionFactory = void 0;
const throttle = __webpack_require__(/*! @theia/core/shared/lodash.throttle */ "../../packages/core/shared/lodash.throttle/index.js");
const console_session_1 = __webpack_require__(/*! @theia/console/lib/browser/console-session */ "../../packages/console/lib/browser/console-session.js");
const ansi_console_item_1 = __webpack_require__(/*! @theia/console/lib/browser/ansi-console-item */ "../../packages/console/lib/browser/ansi-console-item.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const debug_console_items_1 = __webpack_require__(/*! ./debug-console-items */ "../../packages/debug/lib/browser/console/debug-console-items.js");
const severity_1 = __webpack_require__(/*! @theia/core/lib/common/severity */ "../../packages/core/lib/common/severity.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const debug_session_manager_1 = __webpack_require__(/*! ../debug-session-manager */ "../../packages/debug/lib/browser/debug-session-manager.js");
const monaco = __webpack_require__(/*! @theia/monaco-editor-core */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/editor.main.js");
exports.DebugConsoleSessionFactory = Symbol('DebugConsoleSessionFactory');
let DebugConsoleSession = DebugConsoleSession_1 = class DebugConsoleSession extends console_session_1.ConsoleSession {
    constructor() {
        super(...arguments);
        this.items = [];
        this.completionKinds = new Map();
        this.fireDidChange = throttle(() => super.fireDidChange(), 50);
    }
    get debugSession() {
        return this._debugSession;
    }
    set debugSession(value) {
        this._debugSession = value;
        this.id = value.id;
    }
    init() {
        this.completionKinds.set('method', monaco.languages.CompletionItemKind.Method);
        this.completionKinds.set('function', monaco.languages.CompletionItemKind.Function);
        this.completionKinds.set('constructor', monaco.languages.CompletionItemKind.Constructor);
        this.completionKinds.set('field', monaco.languages.CompletionItemKind.Field);
        this.completionKinds.set('variable', monaco.languages.CompletionItemKind.Variable);
        this.completionKinds.set('class', monaco.languages.CompletionItemKind.Class);
        this.completionKinds.set('interface', monaco.languages.CompletionItemKind.Interface);
        this.completionKinds.set('module', monaco.languages.CompletionItemKind.Module);
        this.completionKinds.set('property', monaco.languages.CompletionItemKind.Property);
        this.completionKinds.set('unit', monaco.languages.CompletionItemKind.Unit);
        this.completionKinds.set('value', monaco.languages.CompletionItemKind.Value);
        this.completionKinds.set('enum', monaco.languages.CompletionItemKind.Enum);
        this.completionKinds.set('keyword', monaco.languages.CompletionItemKind.Keyword);
        this.completionKinds.set('snippet', monaco.languages.CompletionItemKind.Snippet);
        this.completionKinds.set('text', monaco.languages.CompletionItemKind.Text);
        this.completionKinds.set('color', monaco.languages.CompletionItemKind.Color);
        this.completionKinds.set('file', monaco.languages.CompletionItemKind.File);
        this.completionKinds.set('reference', monaco.languages.CompletionItemKind.Reference);
        this.completionKinds.set('customcolor', monaco.languages.CompletionItemKind.Color);
        this.toDispose.push(monaco.languages.registerCompletionItemProvider({
            scheme: DebugConsoleSession_1.uri.scheme,
            hasAccessToAllModels: true
        }, {
            triggerCharacters: ['.'],
            provideCompletionItems: (model, position) => this.completions(model, position),
        }));
    }
    getElements() {
        return this.items.filter(e => !this.severity || e.severity === this.severity)[Symbol.iterator]();
    }
    async completions(model, position) {
        const completionSession = this.findCompletionSession();
        if (completionSession) {
            const column = position.column;
            const lineNumber = position.lineNumber;
            const word = model.getWordAtPosition({ column, lineNumber });
            const overwriteBefore = word ? word.word.length : 0;
            const text = model.getValue();
            const items = await completionSession.completions(text, column, lineNumber);
            const suggestions = items.map(item => this.asCompletionItem(text, position, overwriteBefore, item));
            return { suggestions };
        }
        return undefined;
    }
    findCurrentSession() {
        const currentSession = this.sessionManager.currentSession;
        if (!currentSession) {
            return undefined;
        }
        if (currentSession.id === this.debugSession.id) {
            // perfect match
            return this.debugSession;
        }
        const parentSession = currentSession.findConsoleParent();
        if ((parentSession === null || parentSession === void 0 ? void 0 : parentSession.id) === this.debugSession.id) {
            // child of our session
            return currentSession;
        }
        return undefined;
    }
    findCompletionSession() {
        let completionSession = this.findCurrentSession();
        while (completionSession !== undefined) {
            if (completionSession.capabilities.supportsCompletionsRequest) {
                return completionSession;
            }
            completionSession = completionSession.parentSession;
        }
        return completionSession;
    }
    asCompletionItem(text, position, overwriteBefore, item) {
        return {
            label: item.label,
            insertText: item.text || item.label,
            kind: this.completionKinds.get(item.type) || monaco.languages.CompletionItemKind.Property,
            filterText: (item.start && item.length) ? text.substring(item.start, item.start + item.length).concat(item.label) : undefined,
            range: monaco.Range.fromPositions(position.delta(0, -(item.length || overwriteBefore)), position),
            sortText: item.sortText
        };
    }
    async execute(value) {
        const expression = new debug_console_items_1.ExpressionItem(value, () => this.findCurrentSession());
        this.items.push(expression);
        await expression.evaluate();
        this.fireDidChange();
    }
    clear() {
        this.items = [];
        this.fireDidChange();
    }
    append(value) {
        if (!value) {
            return;
        }
        const lastItem = this.items.slice(-1)[0];
        if (lastItem instanceof ansi_console_item_1.AnsiConsoleItem && lastItem.content === this.uncompletedItemContent) {
            this.items.pop();
            this.uncompletedItemContent += value;
        }
        else {
            this.uncompletedItemContent = value;
        }
        this.items.push(new ansi_console_item_1.AnsiConsoleItem(this.uncompletedItemContent, severity_1.Severity.Info));
        this.fireDidChange();
    }
    appendLine(value) {
        this.items.push(new ansi_console_item_1.AnsiConsoleItem(value, severity_1.Severity.Info));
        this.fireDidChange();
    }
    async logOutput(session, event) {
        const body = event.body;
        const { category, variablesReference } = body;
        if (category === 'telemetry') {
            console.debug(`telemetry/${event.body.output}`, event.body.data);
            return;
        }
        const severity = category === 'stderr' ? severity_1.Severity.Error : event.body.category === 'console' ? severity_1.Severity.Warning : severity_1.Severity.Info;
        if (variablesReference) {
            const items = await new debug_console_items_1.ExpressionContainer({ session: () => session, variablesReference }).getElements();
            for (const item of items) {
                this.items.push(Object.assign(item, { severity }));
            }
        }
        else if (typeof body.output === 'string') {
            for (const line of body.output.split('\n')) {
                this.items.push(new ansi_console_item_1.AnsiConsoleItem(line, severity));
            }
        }
        this.fireDidChange();
    }
};
DebugConsoleSession.uri = new uri_1.default().withScheme('debugconsole');
__decorate([
    (0, inversify_1.inject)(debug_session_manager_1.DebugSessionManager),
    __metadata("design:type", debug_session_manager_1.DebugSessionManager)
], DebugConsoleSession.prototype, "sessionManager", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DebugConsoleSession.prototype, "init", null);
DebugConsoleSession = DebugConsoleSession_1 = __decorate([
    (0, inversify_1.injectable)()
], DebugConsoleSession);
exports.DebugConsoleSession = DebugConsoleSession;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/debug/lib/browser/console/debug-console-session'] = this;


/***/ }),

/***/ "../../packages/debug/lib/browser/debug-frontend-application-contribution.js":
/*!***********************************************************************************!*\
  !*** ../../packages/debug/lib/browser/debug-frontend-application-contribution.js ***!
  \***********************************************************************************/
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
exports.DebugFrontendApplicationContribution = exports.DebugBreakpointWidgetCommands = exports.DebugEditorContextCommands = exports.DebugSessionContextCommands = exports.DebugThreadContextCommands = exports.DebugCommands = exports.DebugMenus = void 0;
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const monaco = __webpack_require__(/*! @theia/monaco-editor-core */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/editor.main.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const browser_2 = __webpack_require__(/*! @theia/editor/lib/browser */ "../../packages/editor/lib/browser/index.js");
const debug_session_manager_1 = __webpack_require__(/*! ./debug-session-manager */ "../../packages/debug/lib/browser/debug-session-manager.js");
const debug_widget_1 = __webpack_require__(/*! ./view/debug-widget */ "../../packages/debug/lib/browser/view/debug-widget.js");
const breakpoint_marker_1 = __webpack_require__(/*! ./breakpoint/breakpoint-marker */ "../../packages/debug/lib/browser/breakpoint/breakpoint-marker.js");
const breakpoint_manager_1 = __webpack_require__(/*! ./breakpoint/breakpoint-manager */ "../../packages/debug/lib/browser/breakpoint/breakpoint-manager.js");
const debug_configuration_manager_1 = __webpack_require__(/*! ./debug-configuration-manager */ "../../packages/debug/lib/browser/debug-configuration-manager.js");
const debug_session_1 = __webpack_require__(/*! ./debug-session */ "../../packages/debug/lib/browser/debug-session.js");
const debug_breakpoints_widget_1 = __webpack_require__(/*! ./view/debug-breakpoints-widget */ "../../packages/debug/lib/browser/view/debug-breakpoints-widget.js");
const debug_source_breakpoint_1 = __webpack_require__(/*! ./model/debug-source-breakpoint */ "../../packages/debug/lib/browser/model/debug-source-breakpoint.js");
const debug_threads_widget_1 = __webpack_require__(/*! ./view/debug-threads-widget */ "../../packages/debug/lib/browser/view/debug-threads-widget.js");
const debug_thread_1 = __webpack_require__(/*! ./model/debug-thread */ "../../packages/debug/lib/browser/model/debug-thread.js");
const debug_stack_frames_widget_1 = __webpack_require__(/*! ./view/debug-stack-frames-widget */ "../../packages/debug/lib/browser/view/debug-stack-frames-widget.js");
const debug_stack_frame_1 = __webpack_require__(/*! ./model/debug-stack-frame */ "../../packages/debug/lib/browser/model/debug-stack-frame.js");
const debug_variables_widget_1 = __webpack_require__(/*! ./view/debug-variables-widget */ "../../packages/debug/lib/browser/view/debug-variables-widget.js");
const debug_console_items_1 = __webpack_require__(/*! ./console/debug-console-items */ "../../packages/debug/lib/browser/console/debug-console-items.js");
const debug_editor_model_1 = __webpack_require__(/*! ./editor/debug-editor-model */ "../../packages/debug/lib/browser/editor/debug-editor-model.js");
const debug_editor_service_1 = __webpack_require__(/*! ./editor/debug-editor-service */ "../../packages/debug/lib/browser/editor/debug-editor-service.js");
const debug_console_contribution_1 = __webpack_require__(/*! ./console/debug-console-contribution */ "../../packages/debug/lib/browser/console/debug-console-contribution.js");
const debug_service_1 = __webpack_require__(/*! ../common/debug-service */ "../../packages/debug/lib/common/debug-service.js");
const debug_schema_updater_1 = __webpack_require__(/*! ./debug-schema-updater */ "../../packages/debug/lib/browser/debug-schema-updater.js");
const debug_preferences_1 = __webpack_require__(/*! ./debug-preferences */ "../../packages/debug/lib/browser/debug-preferences.js");
const debug_watch_widget_1 = __webpack_require__(/*! ./view/debug-watch-widget */ "../../packages/debug/lib/browser/view/debug-watch-widget.js");
const debug_watch_expression_1 = __webpack_require__(/*! ./view/debug-watch-expression */ "../../packages/debug/lib/browser/view/debug-watch-expression.js");
const debug_watch_manager_1 = __webpack_require__(/*! ./debug-watch-manager */ "../../packages/debug/lib/browser/debug-watch-manager.js");
const debug_function_breakpoint_1 = __webpack_require__(/*! ./model/debug-function-breakpoint */ "../../packages/debug/lib/browser/model/debug-function-breakpoint.js");
const debug_breakpoint_1 = __webpack_require__(/*! ./model/debug-breakpoint */ "../../packages/debug/lib/browser/model/debug-breakpoint.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
const debug_instruction_breakpoint_1 = __webpack_require__(/*! ./model/debug-instruction-breakpoint */ "../../packages/debug/lib/browser/model/debug-instruction-breakpoint.js");
const debug_exception_breakpoint_1 = __webpack_require__(/*! ./view/debug-exception-breakpoint */ "../../packages/debug/lib/browser/view/debug-exception-breakpoint.js");
var DebugMenus;
(function (DebugMenus) {
    DebugMenus.DEBUG = [...common_1.MAIN_MENU_BAR, '6_debug'];
    DebugMenus.DEBUG_CONTROLS = [...DebugMenus.DEBUG, 'a_controls'];
    DebugMenus.DEBUG_CONFIGURATION = [...DebugMenus.DEBUG, 'b_configuration'];
    DebugMenus.DEBUG_THREADS = [...DebugMenus.DEBUG, 'c_threads'];
    DebugMenus.DEBUG_SESSIONS = [...DebugMenus.DEBUG, 'd_sessions'];
    DebugMenus.DEBUG_BREAKPOINT = [...DebugMenus.DEBUG, 'e_breakpoint'];
    DebugMenus.DEBUG_NEW_BREAKPOINT = [...DebugMenus.DEBUG_BREAKPOINT, 'a_new_breakpoint'];
    DebugMenus.DEBUG_BREAKPOINTS = [...DebugMenus.DEBUG, 'f_breakpoints'];
})(DebugMenus = exports.DebugMenus || (exports.DebugMenus = {}));
function nlsEditBreakpoint(breakpoint) {
    return nls_1.nls.localizeByDefault('Edit {0}...', nls_1.nls.localizeByDefault(breakpoint));
}
function nlsRemoveBreakpoint(breakpoint) {
    return nls_1.nls.localizeByDefault('Remove {0}', nls_1.nls.localizeByDefault(breakpoint));
}
function nlsEnableBreakpoint(breakpoint) {
    return nls_1.nls.localizeByDefault('Enable {0}', nls_1.nls.localizeByDefault(breakpoint));
}
function nlsDisableBreakpoint(breakpoint) {
    return nls_1.nls.localizeByDefault('Disable {0}', nls_1.nls.localizeByDefault(breakpoint));
}
var DebugCommands;
(function (DebugCommands) {
    DebugCommands.DEBUG_CATEGORY = 'Debug';
    DebugCommands.DEBUG_CATEGORY_KEY = nls_1.nls.getDefaultKey(DebugCommands.DEBUG_CATEGORY);
    DebugCommands.START = common_1.Command.toDefaultLocalizedCommand({
        id: 'workbench.action.debug.start',
        category: DebugCommands.DEBUG_CATEGORY,
        label: 'Start Debugging',
        iconClass: (0, browser_1.codicon)('debug-alt')
    });
    DebugCommands.START_NO_DEBUG = common_1.Command.toDefaultLocalizedCommand({
        id: 'workbench.action.debug.run',
        category: DebugCommands.DEBUG_CATEGORY,
        label: 'Start Without Debugging'
    });
    DebugCommands.STOP = common_1.Command.toDefaultLocalizedCommand({
        id: 'workbench.action.debug.stop',
        category: DebugCommands.DEBUG_CATEGORY,
        label: 'Stop',
        iconClass: (0, browser_1.codicon)('debug-stop')
    });
    DebugCommands.RESTART = common_1.Command.toDefaultLocalizedCommand({
        id: 'workbench.action.debug.restart',
        category: DebugCommands.DEBUG_CATEGORY,
        label: 'Restart',
    });
    DebugCommands.OPEN_CONFIGURATIONS = common_1.Command.toDefaultLocalizedCommand({
        id: 'debug.configurations.open',
        category: DebugCommands.DEBUG_CATEGORY,
        label: 'Open Configurations'
    });
    DebugCommands.ADD_CONFIGURATION = common_1.Command.toDefaultLocalizedCommand({
        id: 'debug.configurations.add',
        category: DebugCommands.DEBUG_CATEGORY,
        label: 'Add Configuration...'
    });
    DebugCommands.STEP_OVER = common_1.Command.toDefaultLocalizedCommand({
        id: 'workbench.action.debug.stepOver',
        category: DebugCommands.DEBUG_CATEGORY,
        label: 'Step Over',
        iconClass: (0, browser_1.codicon)('debug-step-over')
    });
    DebugCommands.STEP_INTO = common_1.Command.toDefaultLocalizedCommand({
        id: 'workbench.action.debug.stepInto',
        category: DebugCommands.DEBUG_CATEGORY,
        label: 'Step Into',
        iconClass: (0, browser_1.codicon)('debug-step-into')
    });
    DebugCommands.STEP_OUT = common_1.Command.toDefaultLocalizedCommand({
        id: 'workbench.action.debug.stepOut',
        category: DebugCommands.DEBUG_CATEGORY,
        label: 'Step Out',
        iconClass: (0, browser_1.codicon)('debug-step-out')
    });
    DebugCommands.CONTINUE = common_1.Command.toDefaultLocalizedCommand({
        id: 'workbench.action.debug.continue',
        category: DebugCommands.DEBUG_CATEGORY,
        label: 'Continue',
        iconClass: (0, browser_1.codicon)('debug-continue')
    });
    DebugCommands.PAUSE = common_1.Command.toDefaultLocalizedCommand({
        id: 'workbench.action.debug.pause',
        category: DebugCommands.DEBUG_CATEGORY,
        label: 'Pause',
        iconClass: (0, browser_1.codicon)('debug-pause')
    });
    DebugCommands.CONTINUE_ALL = common_1.Command.toLocalizedCommand({
        id: 'debug.thread.continue.all',
        category: DebugCommands.DEBUG_CATEGORY,
        label: 'Continue All',
        iconClass: (0, browser_1.codicon)('debug-continue')
    }, 'theia/debug/continueAll', DebugCommands.DEBUG_CATEGORY_KEY);
    DebugCommands.PAUSE_ALL = common_1.Command.toLocalizedCommand({
        id: 'debug.thread.pause.all',
        category: DebugCommands.DEBUG_CATEGORY,
        label: 'Pause All',
        iconClass: (0, browser_1.codicon)('debug-pause')
    }, 'theia/debug/pauseAll', DebugCommands.DEBUG_CATEGORY_KEY);
    DebugCommands.TOGGLE_BREAKPOINT = common_1.Command.toDefaultLocalizedCommand({
        id: 'editor.debug.action.toggleBreakpoint',
        category: DebugCommands.DEBUG_CATEGORY,
        label: 'Toggle Breakpoint',
    });
    DebugCommands.INLINE_BREAKPOINT = common_1.Command.toDefaultLocalizedCommand({
        id: 'editor.debug.action.inlineBreakpoint',
        category: DebugCommands.DEBUG_CATEGORY,
        label: 'Inline Breakpoint',
    });
    DebugCommands.ADD_CONDITIONAL_BREAKPOINT = common_1.Command.toDefaultLocalizedCommand({
        id: 'debug.breakpoint.add.conditional',
        category: DebugCommands.DEBUG_CATEGORY,
        label: 'Add Conditional Breakpoint...',
    });
    DebugCommands.ADD_LOGPOINT = common_1.Command.toDefaultLocalizedCommand({
        id: 'debug.breakpoint.add.logpoint',
        category: DebugCommands.DEBUG_CATEGORY,
        label: 'Add Logpoint...',
    });
    DebugCommands.ADD_FUNCTION_BREAKPOINT = common_1.Command.toDefaultLocalizedCommand({
        id: 'debug.breakpoint.add.function',
        category: DebugCommands.DEBUG_CATEGORY,
        label: 'Add Function Breakpoint',
    });
    DebugCommands.ENABLE_ALL_BREAKPOINTS = common_1.Command.toDefaultLocalizedCommand({
        id: 'debug.breakpoint.enableAll',
        category: DebugCommands.DEBUG_CATEGORY,
        label: 'Enable All Breakpoints',
    });
    DebugCommands.DISABLE_ALL_BREAKPOINTS = common_1.Command.toDefaultLocalizedCommand({
        id: 'debug.breakpoint.disableAll',
        category: DebugCommands.DEBUG_CATEGORY,
        label: 'Disable All Breakpoints',
    });
    DebugCommands.EDIT_BREAKPOINT = common_1.Command.toLocalizedCommand({
        id: 'debug.breakpoint.edit',
        category: DebugCommands.DEBUG_CATEGORY,
        originalLabel: 'Edit Breakpoint...',
        label: nlsEditBreakpoint('Breakpoint')
    }, '', DebugCommands.DEBUG_CATEGORY_KEY);
    DebugCommands.EDIT_LOGPOINT = common_1.Command.toLocalizedCommand({
        id: 'debug.logpoint.edit',
        category: DebugCommands.DEBUG_CATEGORY,
        originalLabel: 'Edit Logpoint...',
        label: nlsEditBreakpoint('Logpoint')
    }, '', DebugCommands.DEBUG_CATEGORY_KEY);
    DebugCommands.EDIT_BREAKPOINT_CONDITION = common_1.Command.toLocalizedCommand({
        id: 'debug.breakpoint.editCondition',
        category: DebugCommands.DEBUG_CATEGORY,
        label: 'Edit Condition...'
    }, '', DebugCommands.DEBUG_CATEGORY_KEY);
    DebugCommands.REMOVE_BREAKPOINT = common_1.Command.toLocalizedCommand({
        id: 'debug.breakpoint.remove',
        category: DebugCommands.DEBUG_CATEGORY,
        originalLabel: 'Remove Breakpoint',
        label: nlsRemoveBreakpoint('Breakpoint')
    }, '', DebugCommands.DEBUG_CATEGORY_KEY);
    DebugCommands.REMOVE_LOGPOINT = common_1.Command.toLocalizedCommand({
        id: 'debug.logpoint.remove',
        category: DebugCommands.DEBUG_CATEGORY,
        originalLabel: 'Remove Logpoint',
        label: nlsRemoveBreakpoint('Logpoint')
    }, '', DebugCommands.DEBUG_CATEGORY_KEY);
    DebugCommands.REMOVE_ALL_BREAKPOINTS = common_1.Command.toDefaultLocalizedCommand({
        id: 'debug.breakpoint.removeAll',
        category: DebugCommands.DEBUG_CATEGORY,
        label: 'Remove All Breakpoints',
    });
    DebugCommands.TOGGLE_BREAKPOINTS_ENABLED = common_1.Command.toLocalizedCommand({
        id: 'debug.breakpoint.toggleEnabled'
    });
    DebugCommands.SHOW_HOVER = common_1.Command.toDefaultLocalizedCommand({
        id: 'editor.debug.action.showDebugHover',
        label: 'Debug: Show Hover'
    });
    DebugCommands.RESTART_FRAME = common_1.Command.toDefaultLocalizedCommand({
        id: 'debug.frame.restart',
        category: DebugCommands.DEBUG_CATEGORY,
        label: 'Restart Frame',
    });
    DebugCommands.COPY_CALL_STACK = common_1.Command.toDefaultLocalizedCommand({
        id: 'debug.callStack.copy',
        category: DebugCommands.DEBUG_CATEGORY,
        label: 'Copy Call Stack',
    });
    DebugCommands.SET_VARIABLE_VALUE = common_1.Command.toDefaultLocalizedCommand({
        id: 'debug.variable.setValue',
        category: DebugCommands.DEBUG_CATEGORY,
        label: 'Set Value',
    });
    DebugCommands.COPY_VARIABLE_VALUE = common_1.Command.toDefaultLocalizedCommand({
        id: 'debug.variable.copyValue',
        category: DebugCommands.DEBUG_CATEGORY,
        label: 'Copy Value',
    });
    DebugCommands.COPY_VARIABLE_AS_EXPRESSION = common_1.Command.toDefaultLocalizedCommand({
        id: 'debug.variable.copyAsExpression',
        category: DebugCommands.DEBUG_CATEGORY,
        label: 'Copy as Expression',
    });
    DebugCommands.WATCH_VARIABLE = common_1.Command.toDefaultLocalizedCommand({
        id: 'debug.variable.watch',
        category: DebugCommands.DEBUG_CATEGORY,
        label: 'Add to Watch',
    });
    DebugCommands.ADD_WATCH_EXPRESSION = common_1.Command.toDefaultLocalizedCommand({
        id: 'debug.watch.addExpression',
        category: DebugCommands.DEBUG_CATEGORY,
        label: 'Add Expression'
    });
    DebugCommands.EDIT_WATCH_EXPRESSION = common_1.Command.toDefaultLocalizedCommand({
        id: 'debug.watch.editExpression',
        category: DebugCommands.DEBUG_CATEGORY,
        label: 'Edit Expression'
    });
    DebugCommands.COPY_WATCH_EXPRESSION_VALUE = common_1.Command.toLocalizedCommand({
        id: 'debug.watch.copyExpressionValue',
        category: DebugCommands.DEBUG_CATEGORY,
        label: 'Copy Expression Value'
    }, 'theia/debug/copyExpressionValue', DebugCommands.DEBUG_CATEGORY_KEY);
    DebugCommands.REMOVE_WATCH_EXPRESSION = common_1.Command.toDefaultLocalizedCommand({
        id: 'debug.watch.removeExpression',
        category: DebugCommands.DEBUG_CATEGORY,
        label: 'Remove Expression'
    });
    DebugCommands.COLLAPSE_ALL_WATCH_EXPRESSIONS = common_1.Command.toDefaultLocalizedCommand({
        id: 'debug.watch.collapseAllExpressions',
        category: DebugCommands.DEBUG_CATEGORY,
        label: 'Collapse All'
    });
    DebugCommands.REMOVE_ALL_WATCH_EXPRESSIONS = common_1.Command.toDefaultLocalizedCommand({
        id: 'debug.watch.removeAllExpressions',
        category: DebugCommands.DEBUG_CATEGORY,
        label: 'Remove All Expressions'
    });
})(DebugCommands = exports.DebugCommands || (exports.DebugCommands = {}));
var DebugThreadContextCommands;
(function (DebugThreadContextCommands) {
    DebugThreadContextCommands.STEP_OVER = {
        id: 'debug.thread.context.context.next'
    };
    DebugThreadContextCommands.STEP_INTO = {
        id: 'debug.thread.context.stepin'
    };
    DebugThreadContextCommands.STEP_OUT = {
        id: 'debug.thread.context.stepout'
    };
    DebugThreadContextCommands.CONTINUE = {
        id: 'debug.thread.context.continue'
    };
    DebugThreadContextCommands.PAUSE = {
        id: 'debug.thread.context.pause'
    };
    DebugThreadContextCommands.TERMINATE = {
        id: 'debug.thread.context.terminate'
    };
})(DebugThreadContextCommands = exports.DebugThreadContextCommands || (exports.DebugThreadContextCommands = {}));
var DebugSessionContextCommands;
(function (DebugSessionContextCommands) {
    DebugSessionContextCommands.STOP = {
        id: 'debug.session.context.stop'
    };
    DebugSessionContextCommands.RESTART = {
        id: 'debug.session.context.restart'
    };
    DebugSessionContextCommands.PAUSE_ALL = {
        id: 'debug.session.context.pauseAll'
    };
    DebugSessionContextCommands.CONTINUE_ALL = {
        id: 'debug.session.context.continueAll'
    };
    DebugSessionContextCommands.REVEAL = {
        id: 'debug.session.context.reveal'
    };
})(DebugSessionContextCommands = exports.DebugSessionContextCommands || (exports.DebugSessionContextCommands = {}));
var DebugEditorContextCommands;
(function (DebugEditorContextCommands) {
    DebugEditorContextCommands.ADD_BREAKPOINT = {
        id: 'debug.editor.context.addBreakpoint'
    };
    DebugEditorContextCommands.ADD_CONDITIONAL_BREAKPOINT = {
        id: 'debug.editor.context.addBreakpoint.conditional'
    };
    DebugEditorContextCommands.ADD_LOGPOINT = {
        id: 'debug.editor.context.add.logpoint'
    };
    DebugEditorContextCommands.REMOVE_BREAKPOINT = {
        id: 'debug.editor.context.removeBreakpoint'
    };
    DebugEditorContextCommands.EDIT_BREAKPOINT = {
        id: 'debug.editor.context.edit.breakpoint'
    };
    DebugEditorContextCommands.ENABLE_BREAKPOINT = {
        id: 'debug.editor.context.enableBreakpoint'
    };
    DebugEditorContextCommands.DISABLE_BREAKPOINT = {
        id: 'debug.editor.context.disableBreakpoint'
    };
    DebugEditorContextCommands.REMOVE_LOGPOINT = {
        id: 'debug.editor.context.logpoint.remove'
    };
    DebugEditorContextCommands.EDIT_LOGPOINT = {
        id: 'debug.editor.context.logpoint.edit'
    };
    DebugEditorContextCommands.ENABLE_LOGPOINT = {
        id: 'debug.editor.context.logpoint.enable'
    };
    DebugEditorContextCommands.DISABLE_LOGPOINT = {
        id: 'debug.editor.context.logpoint.disable'
    };
})(DebugEditorContextCommands = exports.DebugEditorContextCommands || (exports.DebugEditorContextCommands = {}));
var DebugBreakpointWidgetCommands;
(function (DebugBreakpointWidgetCommands) {
    DebugBreakpointWidgetCommands.ACCEPT = {
        id: 'debug.breakpointWidget.accept'
    };
    DebugBreakpointWidgetCommands.CLOSE = {
        id: 'debug.breakpointWidget.close'
    };
})(DebugBreakpointWidgetCommands = exports.DebugBreakpointWidgetCommands || (exports.DebugBreakpointWidgetCommands = {}));
let DebugFrontendApplicationContribution = class DebugFrontendApplicationContribution extends browser_1.AbstractViewContribution {
    constructor() {
        super({
            widgetId: debug_widget_1.DebugWidget.ID,
            widgetName: debug_widget_1.DebugWidget.LABEL,
            defaultWidgetOptions: {
                area: 'left',
                rank: 400
            },
            toggleCommandId: 'debug:toggle',
            toggleKeybinding: 'ctrlcmd+shift+d'
        });
        this.firstSessionStart = true;
    }
    async initializeLayout() {
        await this.openView();
    }
    async onStart() {
        this.manager.onDidCreateDebugSession(session => this.openSession(session, { reveal: false }));
        this.manager.onDidStartDebugSession(session => {
            const { noDebug } = session.configuration;
            const openDebug = session.configuration.openDebug || this.preference['debug.openDebug'];
            const internalConsoleOptions = session.configuration.internalConsoleOptions || this.preference['debug.internalConsoleOptions'];
            if (internalConsoleOptions === 'openOnSessionStart' ||
                (internalConsoleOptions === 'openOnFirstSessionStart' && this.firstSessionStart)) {
                this.console.openView({
                    reveal: true,
                    activate: false,
                });
            }
            const shouldOpenDebug = openDebug === 'openOnSessionStart' || (openDebug === 'openOnFirstSessionStart' && this.firstSessionStart);
            // Do not open debug view when suppressed via configuration
            if (!noDebug && !this.getOption(session, 'suppressDebugView') && shouldOpenDebug) {
                this.openSession(session);
            }
            this.firstSessionStart = false;
        });
        this.manager.onDidStopDebugSession(session => {
            const { openDebug } = session.configuration;
            if (!this.getOption(session, 'suppressDebugView') && openDebug === 'openOnDebugBreak') {
                this.openSession(session);
            }
        });
        this.updateStatusBar();
        this.manager.onDidChange(() => this.updateStatusBar());
        this.schemaUpdater.update();
        this.configurations.load();
        await this.breakpointManager.load();
        await this.watchManager.load();
    }
    onStop() {
        this.configurations.save();
        this.breakpointManager.save();
        this.watchManager.save();
    }
    onWillStop() {
        if (this.preference['debug.confirmOnExit'] === 'always' && this.manager.currentSession) {
            return {
                reason: 'active-debug-sessions',
                action: async () => {
                    if (this.manager.currentSession) {
                        const msg = this.manager.sessions.length === 1
                            ? nls_1.nls.localizeByDefault('There is an active debug session, are you sure you want to stop it?')
                            : nls_1.nls.localizeByDefault('There are active debug sessions, are you sure you want to stop them?');
                        const safeToExit = await new browser_1.ConfirmDialog({
                            title: '',
                            msg,
                            ok: nls_1.nls.localizeByDefault('Stop Debugging'),
                            cancel: browser_1.Dialog.CANCEL,
                        }).open();
                        return safeToExit === true;
                    }
                    return true;
                },
            };
        }
    }
    registerMenus(menus) {
        super.registerMenus(menus);
        const registerMenuActions = (menuPath, ...commands) => {
            for (const [index, command] of commands.entries()) {
                const label = command.label;
                const debug = `${DebugCommands.DEBUG_CATEGORY}:`;
                menus.registerMenuAction(menuPath, {
                    commandId: command.id,
                    label: label && label.startsWith(debug) && label.slice(debug.length).trimStart() || label,
                    icon: command.iconClass,
                    order: String.fromCharCode('a'.charCodeAt(0) + index)
                });
            }
        };
        menus.registerSubmenu(DebugMenus.DEBUG, nls_1.nls.localizeByDefault('Run'));
        registerMenuActions(DebugMenus.DEBUG_CONTROLS, DebugCommands.START, DebugCommands.START_NO_DEBUG, DebugCommands.STOP, DebugCommands.RESTART);
        registerMenuActions(DebugMenus.DEBUG_CONFIGURATION, DebugCommands.OPEN_CONFIGURATIONS, DebugCommands.ADD_CONFIGURATION);
        registerMenuActions(DebugMenus.DEBUG_THREADS, DebugCommands.CONTINUE, DebugCommands.STEP_OVER, DebugCommands.STEP_INTO, DebugCommands.STEP_OUT, DebugCommands.PAUSE);
        registerMenuActions(DebugMenus.DEBUG_SESSIONS, DebugCommands.CONTINUE_ALL, DebugCommands.PAUSE_ALL);
        registerMenuActions(DebugMenus.DEBUG_BREAKPOINT, DebugCommands.TOGGLE_BREAKPOINT);
        menus.registerSubmenu(DebugMenus.DEBUG_NEW_BREAKPOINT, nls_1.nls.localizeByDefault('New Breakpoint'));
        registerMenuActions(DebugMenus.DEBUG_NEW_BREAKPOINT, DebugCommands.ADD_CONDITIONAL_BREAKPOINT, DebugCommands.INLINE_BREAKPOINT, DebugCommands.ADD_FUNCTION_BREAKPOINT, DebugCommands.ADD_LOGPOINT);
        registerMenuActions(DebugMenus.DEBUG_BREAKPOINTS, DebugCommands.ENABLE_ALL_BREAKPOINTS, DebugCommands.DISABLE_ALL_BREAKPOINTS, DebugCommands.REMOVE_ALL_BREAKPOINTS);
        registerMenuActions(debug_threads_widget_1.DebugThreadsWidget.CONTROL_MENU, { ...DebugCommands.PAUSE, ...DebugThreadContextCommands.PAUSE }, { ...DebugCommands.CONTINUE, ...DebugThreadContextCommands.CONTINUE }, { ...DebugCommands.STEP_OVER, ...DebugThreadContextCommands.STEP_OVER }, { ...DebugCommands.STEP_INTO, ...DebugThreadContextCommands.STEP_INTO }, { ...DebugCommands.STEP_OUT, ...DebugThreadContextCommands.STEP_OUT }, { ...DebugCommands.PAUSE_ALL, ...DebugSessionContextCommands.PAUSE_ALL }, { ...DebugCommands.CONTINUE_ALL, ...DebugSessionContextCommands.CONTINUE_ALL });
        registerMenuActions(debug_threads_widget_1.DebugThreadsWidget.TERMINATE_MENU, { ...DebugCommands.RESTART, ...DebugSessionContextCommands.RESTART }, { ...DebugCommands.STOP, ...DebugSessionContextCommands.STOP }, { ...DebugThreadContextCommands.TERMINATE, label: nls_1.nls.localizeByDefault('Terminate Thread') });
        registerMenuActions(debug_threads_widget_1.DebugThreadsWidget.OPEN_MENU, { ...DebugSessionContextCommands.REVEAL, label: nls_1.nls.localize('theia/debug/reveal', 'Reveal') });
        registerMenuActions(debug_stack_frames_widget_1.DebugStackFramesWidget.CONTEXT_MENU, DebugCommands.RESTART_FRAME, DebugCommands.COPY_CALL_STACK);
        registerMenuActions(debug_variables_widget_1.DebugVariablesWidget.EDIT_MENU, DebugCommands.SET_VARIABLE_VALUE, DebugCommands.COPY_VARIABLE_VALUE, DebugCommands.COPY_VARIABLE_AS_EXPRESSION);
        registerMenuActions(debug_variables_widget_1.DebugVariablesWidget.WATCH_MENU, DebugCommands.WATCH_VARIABLE);
        registerMenuActions(debug_watch_widget_1.DebugWatchWidget.EDIT_MENU, DebugCommands.EDIT_WATCH_EXPRESSION, DebugCommands.COPY_WATCH_EXPRESSION_VALUE);
        registerMenuActions(debug_watch_widget_1.DebugWatchWidget.REMOVE_MENU, DebugCommands.REMOVE_WATCH_EXPRESSION, DebugCommands.REMOVE_ALL_WATCH_EXPRESSIONS);
        registerMenuActions(debug_breakpoints_widget_1.DebugBreakpointsWidget.EDIT_MENU, DebugCommands.EDIT_BREAKPOINT, DebugCommands.EDIT_LOGPOINT, DebugCommands.EDIT_BREAKPOINT_CONDITION);
        registerMenuActions(debug_breakpoints_widget_1.DebugBreakpointsWidget.REMOVE_MENU, DebugCommands.REMOVE_BREAKPOINT, DebugCommands.REMOVE_LOGPOINT, DebugCommands.REMOVE_ALL_BREAKPOINTS);
        registerMenuActions(debug_breakpoints_widget_1.DebugBreakpointsWidget.ENABLE_MENU, DebugCommands.ENABLE_ALL_BREAKPOINTS, DebugCommands.DISABLE_ALL_BREAKPOINTS);
        registerMenuActions(debug_editor_model_1.DebugEditorModel.CONTEXT_MENU, { ...DebugEditorContextCommands.ADD_BREAKPOINT, label: nls_1.nls.localizeByDefault('Add Breakpoint') }, { ...DebugEditorContextCommands.ADD_CONDITIONAL_BREAKPOINT, label: DebugCommands.ADD_CONDITIONAL_BREAKPOINT.label }, { ...DebugEditorContextCommands.ADD_LOGPOINT, label: DebugCommands.ADD_LOGPOINT.label }, { ...DebugEditorContextCommands.REMOVE_BREAKPOINT, label: DebugCommands.REMOVE_BREAKPOINT.label }, { ...DebugEditorContextCommands.EDIT_BREAKPOINT, label: DebugCommands.EDIT_BREAKPOINT.label }, { ...DebugEditorContextCommands.ENABLE_BREAKPOINT, label: nlsEnableBreakpoint('Breakpoint') }, { ...DebugEditorContextCommands.DISABLE_BREAKPOINT, label: nlsDisableBreakpoint('Breakpoint') }, { ...DebugEditorContextCommands.REMOVE_LOGPOINT, label: DebugCommands.REMOVE_LOGPOINT.label }, { ...DebugEditorContextCommands.EDIT_LOGPOINT, label: DebugCommands.EDIT_LOGPOINT.label }, { ...DebugEditorContextCommands.ENABLE_LOGPOINT, label: nlsEnableBreakpoint('Logpoint') }, { ...DebugEditorContextCommands.DISABLE_LOGPOINT, label: nlsDisableBreakpoint('Logpoint') });
        menus.linkSubmenu(browser_2.EDITOR_LINENUMBER_CONTEXT_MENU, debug_editor_model_1.DebugEditorModel.CONTEXT_MENU, { role: 1 /* Group */ });
    }
    registerCommands(registry) {
        super.registerCommands(registry);
        registry.registerCommand(DebugCommands.START, {
            execute: (config) => this.start(false, config)
        });
        registry.registerCommand(DebugCommands.START_NO_DEBUG, {
            execute: (config) => this.start(true, config)
        });
        registry.registerCommand(DebugCommands.STOP, {
            execute: () => this.manager.terminateSession(),
            isEnabled: () => this.manager.state !== debug_session_1.DebugState.Inactive
        });
        registry.registerCommand(DebugCommands.RESTART, {
            execute: () => this.manager.restartSession(),
            isEnabled: () => this.manager.state !== debug_session_1.DebugState.Inactive
        });
        registry.registerCommand(DebugCommands.OPEN_CONFIGURATIONS, {
            execute: () => this.configurations.openConfiguration()
        });
        registry.registerCommand(DebugCommands.ADD_CONFIGURATION, {
            execute: () => this.configurations.addConfiguration()
        });
        registry.registerCommand(DebugCommands.STEP_OVER, {
            execute: () => this.manager.currentThread && this.manager.currentThread.stepOver(),
            isEnabled: () => this.manager.state === debug_session_1.DebugState.Stopped
        });
        registry.registerCommand(DebugCommands.STEP_INTO, {
            execute: () => this.manager.currentThread && this.manager.currentThread.stepIn(),
            isEnabled: () => this.manager.state === debug_session_1.DebugState.Stopped
        });
        registry.registerCommand(DebugCommands.STEP_OUT, {
            execute: () => this.manager.currentThread && this.manager.currentThread.stepOut(),
            isEnabled: () => this.manager.state === debug_session_1.DebugState.Stopped
        });
        registry.registerCommand(DebugCommands.CONTINUE, {
            execute: () => this.manager.currentThread && this.manager.currentThread.continue(),
            isEnabled: () => this.manager.state === debug_session_1.DebugState.Stopped
        });
        registry.registerCommand(DebugCommands.PAUSE, {
            execute: () => this.manager.currentThread && this.manager.currentThread.pause(),
            isEnabled: () => this.manager.state === debug_session_1.DebugState.Running
        });
        registry.registerCommand(DebugCommands.PAUSE_ALL, {
            execute: () => this.manager.currentSession && this.manager.currentSession.pauseAll(),
            isEnabled: () => !!this.manager.currentSession && !!this.manager.currentSession.runningThreads.next().value
        });
        registry.registerCommand(DebugCommands.CONTINUE_ALL, {
            execute: () => this.manager.currentSession && this.manager.currentSession.continueAll(),
            isEnabled: () => !!this.manager.currentSession && !!this.manager.currentSession.stoppedThreads.next().value
        });
        registry.registerCommand(DebugThreadContextCommands.STEP_OVER, {
            execute: () => this.selectedThread && this.selectedThread.stepOver(),
            isEnabled: () => !!this.selectedThread && this.selectedThread.stopped,
            isVisible: () => !!this.selectedThread
        });
        registry.registerCommand(DebugThreadContextCommands.STEP_INTO, {
            execute: () => this.selectedThread && this.selectedThread.stepIn(),
            isEnabled: () => !!this.selectedThread && this.selectedThread.stopped,
            isVisible: () => !!this.selectedThread
        });
        registry.registerCommand(DebugThreadContextCommands.STEP_OUT, {
            execute: () => this.selectedThread && this.selectedThread.stepOut(),
            isEnabled: () => !!this.selectedThread && this.selectedThread.stopped,
            isVisible: () => !!this.selectedThread
        });
        registry.registerCommand(DebugThreadContextCommands.CONTINUE, {
            execute: () => this.selectedThread && this.selectedThread.continue(),
            isEnabled: () => !!this.selectedThread && this.selectedThread.stopped,
            isVisible: () => !!this.selectedThread && this.selectedThread.stopped,
        });
        registry.registerCommand(DebugThreadContextCommands.PAUSE, {
            execute: () => this.selectedThread && this.selectedThread.pause(),
            isEnabled: () => !!this.selectedThread && !this.selectedThread.stopped,
            isVisible: () => !!this.selectedThread && !this.selectedThread.stopped,
        });
        registry.registerCommand(DebugThreadContextCommands.TERMINATE, {
            execute: () => this.selectedThread && this.selectedThread.terminate(),
            isEnabled: () => !!this.selectedThread && this.selectedThread.supportsTerminate,
            isVisible: () => !!this.selectedThread && this.selectedThread.supportsTerminate
        });
        registry.registerCommand(DebugSessionContextCommands.STOP, {
            execute: () => this.selectedSession && this.manager.terminateSession(this.selectedSession),
            isEnabled: () => !!this.selectedSession && this.selectedSession.state !== debug_session_1.DebugState.Inactive,
            isVisible: () => !this.selectedThread
        });
        registry.registerCommand(DebugSessionContextCommands.RESTART, {
            execute: () => this.selectedSession && this.manager.restartSession(this.selectedSession),
            isEnabled: () => !!this.selectedSession && this.selectedSession.state !== debug_session_1.DebugState.Inactive,
            isVisible: () => !this.selectedThread
        });
        registry.registerCommand(DebugSessionContextCommands.CONTINUE_ALL, {
            execute: () => this.selectedSession && this.selectedSession.continueAll(),
            isEnabled: () => !!this.selectedSession && !!this.selectedSession.stoppedThreads.next().value,
            isVisible: () => !this.selectedThread
        });
        registry.registerCommand(DebugSessionContextCommands.PAUSE_ALL, {
            execute: () => this.selectedSession && this.selectedSession.pauseAll(),
            isEnabled: () => !!this.selectedSession && !!this.selectedSession.runningThreads.next().value,
            isVisible: () => !this.selectedThread
        });
        registry.registerCommand(DebugSessionContextCommands.REVEAL, {
            execute: () => this.selectedSession && this.revealSession(this.selectedSession),
            isEnabled: () => Boolean(this.selectedSession),
            isVisible: () => !this.selectedThread && Boolean(this.selectedSession)
        });
        registry.registerCommand(DebugCommands.TOGGLE_BREAKPOINT, {
            execute: () => this.editors.toggleBreakpoint(),
            isEnabled: () => !!this.editors.model
        });
        registry.registerCommand(DebugCommands.INLINE_BREAKPOINT, {
            execute: () => this.editors.addInlineBreakpoint(),
            isEnabled: () => !!this.editors.model && !this.editors.getInlineBreakpoint()
        });
        registry.registerCommand(DebugCommands.ADD_CONDITIONAL_BREAKPOINT, {
            execute: () => this.editors.addBreakpoint('condition'),
            isEnabled: () => !!this.editors.model && !this.editors.anyBreakpoint()
        });
        registry.registerCommand(DebugCommands.ADD_LOGPOINT, {
            execute: () => this.editors.addBreakpoint('logMessage'),
            isEnabled: () => !!this.editors.model && !this.editors.anyBreakpoint()
        });
        registry.registerCommand(DebugCommands.ADD_FUNCTION_BREAKPOINT, {
            execute: async () => {
                const { labelProvider, breakpointManager, editorManager } = this;
                const options = { labelProvider, breakpoints: breakpointManager, editorManager };
                await new debug_function_breakpoint_1.DebugFunctionBreakpoint(breakpoint_marker_1.FunctionBreakpoint.create({ name: '' }), options).open();
            },
            isEnabled: widget => !(widget instanceof browser_1.Widget) || widget instanceof debug_breakpoints_widget_1.DebugBreakpointsWidget,
            isVisible: widget => !(widget instanceof browser_1.Widget) || widget instanceof debug_breakpoints_widget_1.DebugBreakpointsWidget
        });
        registry.registerCommand(DebugCommands.ENABLE_ALL_BREAKPOINTS, {
            execute: () => this.breakpointManager.enableAllBreakpoints(true),
            isEnabled: () => this.breakpointManager.hasBreakpoints()
        });
        registry.registerCommand(DebugCommands.DISABLE_ALL_BREAKPOINTS, {
            execute: () => this.breakpointManager.enableAllBreakpoints(false),
            isEnabled: () => this.breakpointManager.hasBreakpoints()
        });
        registry.registerCommand(DebugCommands.EDIT_BREAKPOINT, {
            execute: async () => {
                const { selectedBreakpoint, selectedFunctionBreakpoint } = this;
                if (selectedBreakpoint) {
                    await this.editors.editBreakpoint(selectedBreakpoint);
                }
                else if (selectedFunctionBreakpoint) {
                    await selectedFunctionBreakpoint.open();
                }
            },
            isEnabled: () => !!this.selectedBreakpoint || !!this.selectedFunctionBreakpoint,
            isVisible: () => !!this.selectedBreakpoint || !!this.selectedFunctionBreakpoint
        });
        registry.registerCommand(DebugCommands.EDIT_LOGPOINT, {
            execute: async () => {
                const { selectedLogpoint } = this;
                if (selectedLogpoint) {
                    await this.editors.editBreakpoint(selectedLogpoint);
                }
            },
            isEnabled: () => !!this.selectedLogpoint,
            isVisible: () => !!this.selectedLogpoint
        });
        registry.registerCommand(DebugCommands.EDIT_BREAKPOINT_CONDITION, {
            execute: async () => {
                const { selectedExceptionBreakpoint } = this;
                if (selectedExceptionBreakpoint) {
                    await selectedExceptionBreakpoint.editCondition();
                }
            },
            isEnabled: () => { var _a; return !!((_a = this.selectedExceptionBreakpoint) === null || _a === void 0 ? void 0 : _a.data.raw.supportsCondition); },
            isVisible: () => { var _a; return !!((_a = this.selectedExceptionBreakpoint) === null || _a === void 0 ? void 0 : _a.data.raw.supportsCondition); }
        });
        registry.registerCommand(DebugCommands.REMOVE_BREAKPOINT, {
            execute: () => {
                const selectedBreakpoint = this.selectedSettableBreakpoint;
                if (selectedBreakpoint) {
                    selectedBreakpoint.remove();
                }
            },
            isEnabled: () => Boolean(this.selectedSettableBreakpoint),
            isVisible: () => Boolean(this.selectedSettableBreakpoint),
        });
        registry.registerCommand(DebugCommands.REMOVE_LOGPOINT, {
            execute: () => {
                const { selectedLogpoint } = this;
                if (selectedLogpoint) {
                    selectedLogpoint.remove();
                }
            },
            isEnabled: () => !!this.selectedLogpoint,
            isVisible: () => !!this.selectedLogpoint
        });
        registry.registerCommand(DebugCommands.REMOVE_ALL_BREAKPOINTS, {
            execute: () => this.breakpointManager.removeBreakpoints(),
            isEnabled: () => this.breakpointManager.hasBreakpoints(),
            isVisible: widget => !(widget instanceof browser_1.Widget) || (widget instanceof debug_breakpoints_widget_1.DebugBreakpointsWidget)
        });
        registry.registerCommand(DebugCommands.TOGGLE_BREAKPOINTS_ENABLED, {
            execute: () => this.breakpointManager.breakpointsEnabled = !this.breakpointManager.breakpointsEnabled,
            isVisible: arg => arg instanceof debug_breakpoints_widget_1.DebugBreakpointsWidget
        });
        registry.registerCommand(DebugCommands.SHOW_HOVER, {
            execute: () => this.editors.showHover(),
            isEnabled: () => this.editors.canShowHover()
        });
        registry.registerCommand(DebugCommands.RESTART_FRAME, {
            execute: () => this.selectedFrame && this.selectedFrame.restart(),
            isEnabled: () => !!this.selectedFrame
        });
        registry.registerCommand(DebugCommands.COPY_CALL_STACK, {
            execute: () => {
                const { frames } = this;
                const selection = document.getSelection();
                if (frames && selection) {
                    selection.selectAllChildren(frames.node);
                    document.execCommand('copy');
                }
            },
            isEnabled: () => document.queryCommandSupported('copy'),
            isVisible: () => document.queryCommandSupported('copy')
        });
        registry.registerCommand(DebugCommands.SET_VARIABLE_VALUE, {
            execute: () => this.selectedVariable && this.selectedVariable.open(),
            isEnabled: () => !!this.selectedVariable && this.selectedVariable.supportSetVariable,
            isVisible: () => !!this.selectedVariable && this.selectedVariable.supportSetVariable
        });
        registry.registerCommand(DebugCommands.COPY_VARIABLE_VALUE, {
            execute: () => this.selectedVariable && this.selectedVariable.copyValue(),
            isEnabled: () => !!this.selectedVariable && this.selectedVariable.supportCopyValue,
            isVisible: () => !!this.selectedVariable && this.selectedVariable.supportCopyValue
        });
        registry.registerCommand(DebugCommands.COPY_VARIABLE_AS_EXPRESSION, {
            execute: () => this.selectedVariable && this.selectedVariable.copyAsExpression(),
            isEnabled: () => !!this.selectedVariable && this.selectedVariable.supportCopyAsExpression,
            isVisible: () => !!this.selectedVariable && this.selectedVariable.supportCopyAsExpression
        });
        registry.registerCommand(DebugCommands.WATCH_VARIABLE, {
            execute: () => {
                const { selectedVariable, watch } = this;
                if (selectedVariable && watch) {
                    watch.viewModel.addWatchExpression(selectedVariable.name);
                }
            },
            isEnabled: () => !!this.selectedVariable && !!this.watch,
            isVisible: () => !!this.selectedVariable && !!this.watch,
        });
        // Debug context menu commands
        registry.registerCommand(DebugEditorContextCommands.ADD_BREAKPOINT, {
            execute: position => this.isPosition(position) && this.editors.toggleBreakpoint(this.asPosition(position)),
            isEnabled: position => this.isPosition(position) && !this.editors.anyBreakpoint(this.asPosition(position)),
            isVisible: position => this.isPosition(position) && !this.editors.anyBreakpoint(this.asPosition(position))
        });
        registry.registerCommand(DebugEditorContextCommands.ADD_CONDITIONAL_BREAKPOINT, {
            execute: position => this.isPosition(position) && this.editors.addBreakpoint('condition', this.asPosition(position)),
            isEnabled: position => this.isPosition(position) && !this.editors.anyBreakpoint(this.asPosition(position)),
            isVisible: position => this.isPosition(position) && !this.editors.anyBreakpoint(this.asPosition(position))
        });
        registry.registerCommand(DebugEditorContextCommands.ADD_LOGPOINT, {
            execute: position => this.isPosition(position) && this.editors.addBreakpoint('logMessage', this.asPosition(position)),
            isEnabled: position => this.isPosition(position) && !this.editors.anyBreakpoint(this.asPosition(position)),
            isVisible: position => this.isPosition(position) && !this.editors.anyBreakpoint(this.asPosition(position))
        });
        registry.registerCommand(DebugEditorContextCommands.REMOVE_BREAKPOINT, {
            execute: position => this.isPosition(position) && this.editors.toggleBreakpoint(this.asPosition(position)),
            isEnabled: position => this.isPosition(position) && !!this.editors.getBreakpoint(this.asPosition(position)),
            isVisible: position => this.isPosition(position) && !!this.editors.getBreakpoint(this.asPosition(position))
        });
        registry.registerCommand(DebugEditorContextCommands.EDIT_BREAKPOINT, {
            execute: position => this.isPosition(position) && this.editors.editBreakpoint(this.asPosition(position)),
            isEnabled: position => this.isPosition(position) && !!this.editors.getBreakpoint(this.asPosition(position)),
            isVisible: position => this.isPosition(position) && !!this.editors.getBreakpoint(this.asPosition(position))
        });
        registry.registerCommand(DebugEditorContextCommands.ENABLE_BREAKPOINT, {
            execute: position => this.isPosition(position) && this.editors.setBreakpointEnabled(this.asPosition(position), true),
            isEnabled: position => this.isPosition(position) && this.editors.getBreakpointEnabled(this.asPosition(position)) === false,
            isVisible: position => this.isPosition(position) && this.editors.getBreakpointEnabled(this.asPosition(position)) === false
        });
        registry.registerCommand(DebugEditorContextCommands.DISABLE_BREAKPOINT, {
            execute: position => this.isPosition(position) && this.editors.setBreakpointEnabled(this.asPosition(position), false),
            isEnabled: position => this.isPosition(position) && !!this.editors.getBreakpointEnabled(this.asPosition(position)),
            isVisible: position => this.isPosition(position) && !!this.editors.getBreakpointEnabled(this.asPosition(position))
        });
        registry.registerCommand(DebugEditorContextCommands.REMOVE_LOGPOINT, {
            execute: position => this.isPosition(position) && this.editors.toggleBreakpoint(this.asPosition(position)),
            isEnabled: position => this.isPosition(position) && !!this.editors.getLogpoint(this.asPosition(position)),
            isVisible: position => this.isPosition(position) && !!this.editors.getLogpoint(this.asPosition(position))
        });
        registry.registerCommand(DebugEditorContextCommands.EDIT_LOGPOINT, {
            execute: position => this.isPosition(position) && this.editors.editBreakpoint(this.asPosition(position)),
            isEnabled: position => this.isPosition(position) && !!this.editors.getLogpoint(this.asPosition(position)),
            isVisible: position => this.isPosition(position) && !!this.editors.getLogpoint(this.asPosition(position))
        });
        registry.registerCommand(DebugEditorContextCommands.ENABLE_LOGPOINT, {
            execute: position => this.isPosition(position) && this.editors.setBreakpointEnabled(this.asPosition(position), true),
            isEnabled: position => this.isPosition(position) && this.editors.getLogpointEnabled(this.asPosition(position)) === false,
            isVisible: position => this.isPosition(position) && this.editors.getLogpointEnabled(this.asPosition(position)) === false
        });
        registry.registerCommand(DebugEditorContextCommands.DISABLE_LOGPOINT, {
            execute: position => this.isPosition(position) && this.editors.setBreakpointEnabled(this.asPosition(position), false),
            isEnabled: position => this.isPosition(position) && !!this.editors.getLogpointEnabled(this.asPosition(position)),
            isVisible: position => this.isPosition(position) && !!this.editors.getLogpointEnabled(this.asPosition(position))
        });
        registry.registerCommand(DebugBreakpointWidgetCommands.ACCEPT, {
            execute: () => this.editors.acceptBreakpoint()
        });
        registry.registerCommand(DebugBreakpointWidgetCommands.CLOSE, {
            execute: () => this.editors.closeBreakpoint()
        });
        registry.registerCommand(DebugCommands.ADD_WATCH_EXPRESSION, {
            execute: widget => {
                if (widget instanceof browser_1.Widget) {
                    if (widget instanceof debug_watch_widget_1.DebugWatchWidget) {
                        widget.viewModel.addWatchExpression();
                    }
                }
                else if (this.watch) {
                    this.watch.viewModel.addWatchExpression();
                }
            },
            isEnabled: widget => widget instanceof browser_1.Widget ? widget instanceof debug_watch_widget_1.DebugWatchWidget : !!this.watch,
            isVisible: widget => widget instanceof browser_1.Widget ? widget instanceof debug_watch_widget_1.DebugWatchWidget : !!this.watch
        });
        registry.registerCommand(DebugCommands.EDIT_WATCH_EXPRESSION, {
            execute: () => {
                const { watchExpression } = this;
                if (watchExpression) {
                    watchExpression.open();
                }
            },
            isEnabled: () => !!this.watchExpression,
            isVisible: () => !!this.watchExpression
        });
        registry.registerCommand(DebugCommands.COPY_WATCH_EXPRESSION_VALUE, {
            execute: () => this.watchExpression && this.watchExpression.copyValue(),
            isEnabled: () => !!this.watchExpression && this.watchExpression.supportCopyValue,
            isVisible: () => !!this.watchExpression && this.watchExpression.supportCopyValue
        });
        registry.registerCommand(DebugCommands.COLLAPSE_ALL_WATCH_EXPRESSIONS, {
            execute: widget => {
                if (widget instanceof debug_watch_widget_1.DebugWatchWidget) {
                    const root = widget.model.root;
                    widget.model.collapseAll(browser_1.CompositeTreeNode.is(root) ? root : undefined);
                }
            },
            isEnabled: widget => widget instanceof debug_watch_widget_1.DebugWatchWidget,
            isVisible: widget => widget instanceof debug_watch_widget_1.DebugWatchWidget
        });
        registry.registerCommand(DebugCommands.REMOVE_WATCH_EXPRESSION, {
            execute: () => {
                const { watch, watchExpression } = this;
                if (watch && watchExpression) {
                    watch.viewModel.removeWatchExpression(watchExpression);
                }
            },
            isEnabled: () => !!this.watchExpression,
            isVisible: () => !!this.watchExpression
        });
        registry.registerCommand(DebugCommands.REMOVE_ALL_WATCH_EXPRESSIONS, {
            execute: widget => {
                if (widget instanceof browser_1.Widget) {
                    if (widget instanceof debug_watch_widget_1.DebugWatchWidget) {
                        widget.viewModel.removeWatchExpressions();
                    }
                }
                else if (this.watch) {
                    this.watch.viewModel.removeWatchExpressions();
                }
            },
            isEnabled: widget => widget instanceof browser_1.Widget ? widget instanceof debug_watch_widget_1.DebugWatchWidget : !!this.watch,
            isVisible: widget => widget instanceof browser_1.Widget ? widget instanceof debug_watch_widget_1.DebugWatchWidget : !!this.watch
        });
    }
    registerKeybindings(keybindings) {
        super.registerKeybindings(keybindings);
        keybindings.registerKeybinding({
            command: DebugCommands.START.id,
            keybinding: 'f5'
        });
        keybindings.registerKeybinding({
            command: DebugCommands.START_NO_DEBUG.id,
            keybinding: 'ctrl+f5'
        });
        keybindings.registerKeybinding({
            command: DebugCommands.STOP.id,
            keybinding: 'shift+f5',
            when: 'inDebugMode'
        });
        keybindings.registerKeybinding({
            command: DebugCommands.RESTART.id,
            keybinding: 'shift+ctrlcmd+f5',
            when: 'inDebugMode'
        });
        keybindings.registerKeybinding({
            command: DebugCommands.STEP_OVER.id,
            keybinding: 'f10',
            when: 'inDebugMode'
        });
        keybindings.registerKeybinding({
            command: DebugCommands.STEP_INTO.id,
            keybinding: 'f11',
            when: 'inDebugMode'
        });
        keybindings.registerKeybinding({
            command: DebugCommands.STEP_OUT.id,
            keybinding: 'shift+f11',
            when: 'inDebugMode'
        });
        keybindings.registerKeybinding({
            command: DebugCommands.CONTINUE.id,
            keybinding: 'f5',
            when: 'inDebugMode'
        });
        keybindings.registerKeybinding({
            command: DebugCommands.PAUSE.id,
            keybinding: 'f6',
            when: 'inDebugMode'
        });
        keybindings.registerKeybinding({
            command: DebugCommands.TOGGLE_BREAKPOINT.id,
            keybinding: 'f9',
            when: 'editorTextFocus'
        });
        keybindings.registerKeybinding({
            command: DebugCommands.INLINE_BREAKPOINT.id,
            keybinding: 'shift+f9',
            when: 'editorTextFocus'
        });
        keybindings.registerKeybinding({
            command: DebugBreakpointWidgetCommands.ACCEPT.id,
            keybinding: 'enter',
            when: 'breakpointWidgetFocus'
        });
        keybindings.registerKeybinding({
            command: DebugBreakpointWidgetCommands.CLOSE.id,
            keybinding: 'esc',
            when: 'isBreakpointWidgetVisible || breakpointWidgetFocus'
        });
    }
    registerToolbarItems(toolbar) {
        const onDidChangeToggleBreakpointsEnabled = new common_1.Emitter();
        const toggleBreakpointsEnabled = {
            id: DebugCommands.TOGGLE_BREAKPOINTS_ENABLED.id,
            command: DebugCommands.TOGGLE_BREAKPOINTS_ENABLED.id,
            icon: (0, browser_1.codicon)('activate-breakpoints'),
            onDidChange: onDidChangeToggleBreakpointsEnabled.event,
            priority: 1
        };
        const updateToggleBreakpointsEnabled = () => {
            const activateBreakpoints = nls_1.nls.localizeByDefault('Enable All Breakpoints');
            const deactivateBreakpoints = nls_1.nls.localizeByDefault('Disable All Breakpoints');
            const tooltip = this.breakpointManager.breakpointsEnabled ? deactivateBreakpoints : activateBreakpoints;
            if (toggleBreakpointsEnabled.tooltip !== tooltip) {
                toggleBreakpointsEnabled.tooltip = tooltip;
                onDidChangeToggleBreakpointsEnabled.fire(undefined);
            }
        };
        toolbar.registerItem({
            id: DebugCommands.ADD_FUNCTION_BREAKPOINT.id,
            command: DebugCommands.ADD_FUNCTION_BREAKPOINT.id,
            icon: (0, browser_1.codicon)('add'),
            tooltip: DebugCommands.ADD_FUNCTION_BREAKPOINT.label
        });
        updateToggleBreakpointsEnabled();
        this.breakpointManager.onDidChangeBreakpoints(updateToggleBreakpointsEnabled);
        toolbar.registerItem(toggleBreakpointsEnabled);
        toolbar.registerItem({
            id: DebugCommands.REMOVE_ALL_BREAKPOINTS.id,
            command: DebugCommands.REMOVE_ALL_BREAKPOINTS.id,
            icon: (0, browser_1.codicon)('close-all'),
            priority: 2
        });
        toolbar.registerItem({
            id: DebugCommands.ADD_WATCH_EXPRESSION.id,
            command: DebugCommands.ADD_WATCH_EXPRESSION.id,
            icon: (0, browser_1.codicon)('add'),
            tooltip: DebugCommands.ADD_WATCH_EXPRESSION.label
        });
        toolbar.registerItem({
            id: DebugCommands.COLLAPSE_ALL_WATCH_EXPRESSIONS.id,
            command: DebugCommands.COLLAPSE_ALL_WATCH_EXPRESSIONS.id,
            icon: (0, browser_1.codicon)('collapse-all'),
            tooltip: DebugCommands.COLLAPSE_ALL_WATCH_EXPRESSIONS.label,
            priority: 1
        });
        toolbar.registerItem({
            id: DebugCommands.REMOVE_ALL_WATCH_EXPRESSIONS.id,
            command: DebugCommands.REMOVE_ALL_WATCH_EXPRESSIONS.id,
            icon: (0, browser_1.codicon)('close-all'),
            tooltip: DebugCommands.REMOVE_ALL_WATCH_EXPRESSIONS.label,
            priority: 2
        });
    }
    async openSession(session, options) {
        const { reveal } = {
            reveal: true,
            ...options
        };
        const debugWidget = await this.openView({ reveal });
        debugWidget.sessionManager.currentSession = session;
        return debugWidget['sessionWidget'];
    }
    revealSession(session) {
        var _a;
        const widget = (_a = this.tryGetWidget()) === null || _a === void 0 ? void 0 : _a['sessionWidget'];
        if (widget) {
            this.shell.revealWidget(widget.id);
        }
        return widget;
    }
    async start(noDebug, debugSessionOptions) {
        let current = debugSessionOptions ? debugSessionOptions : this.configurations.current;
        // If no configurations are currently present, create the `launch.json` and prompt users to select the config.
        if (!current) {
            await this.configurations.addConfiguration();
            return;
        }
        if (noDebug !== undefined) {
            if (current.configuration) {
                current = {
                    ...current,
                    configuration: {
                        ...current.configuration,
                        noDebug
                    }
                };
            }
            else {
                current = {
                    ...current,
                    noDebug
                };
            }
        }
        await this.manager.start(current);
    }
    get threads() {
        const { currentWidget } = this.shell;
        return currentWidget instanceof debug_threads_widget_1.DebugThreadsWidget && currentWidget || undefined;
    }
    get selectedSession() {
        const { threads } = this;
        return threads && threads.selectedElement instanceof debug_session_1.DebugSession && threads.selectedElement || undefined;
    }
    get selectedThread() {
        const { threads } = this;
        return threads && threads.selectedElement instanceof debug_thread_1.DebugThread && threads.selectedElement || undefined;
    }
    get frames() {
        const { currentWidget } = this.shell;
        return currentWidget instanceof debug_stack_frames_widget_1.DebugStackFramesWidget && currentWidget || undefined;
    }
    get selectedFrame() {
        const { frames } = this;
        return frames && frames.selectedElement instanceof debug_stack_frame_1.DebugStackFrame && frames.selectedElement || undefined;
    }
    get breakpoints() {
        const { currentWidget } = this.shell;
        return currentWidget instanceof debug_breakpoints_widget_1.DebugBreakpointsWidget && currentWidget || undefined;
    }
    get selectedAnyBreakpoint() {
        const { breakpoints } = this;
        const selectedElement = breakpoints && breakpoints.selectedElement;
        return selectedElement instanceof debug_breakpoint_1.DebugBreakpoint ? selectedElement : undefined;
    }
    get selectedBreakpoint() {
        const breakpoint = this.selectedAnyBreakpoint;
        return breakpoint && breakpoint instanceof debug_source_breakpoint_1.DebugSourceBreakpoint && !breakpoint.logMessage ? breakpoint : undefined;
    }
    get selectedLogpoint() {
        const breakpoint = this.selectedAnyBreakpoint;
        return breakpoint && breakpoint instanceof debug_source_breakpoint_1.DebugSourceBreakpoint && !!breakpoint.logMessage ? breakpoint : undefined;
    }
    get selectedFunctionBreakpoint() {
        const breakpoint = this.selectedAnyBreakpoint;
        return breakpoint && breakpoint instanceof debug_function_breakpoint_1.DebugFunctionBreakpoint ? breakpoint : undefined;
    }
    get selectedInstructionBreakpoint() {
        if (this.selectedAnyBreakpoint instanceof debug_instruction_breakpoint_1.DebugInstructionBreakpoint) {
            return this.selectedAnyBreakpoint;
        }
    }
    get selectedExceptionBreakpoint() {
        const { breakpoints } = this;
        const selectedElement = breakpoints && breakpoints.selectedElement;
        return selectedElement instanceof debug_exception_breakpoint_1.DebugExceptionBreakpoint ? selectedElement : undefined;
    }
    get selectedSettableBreakpoint() {
        const selected = this.selectedAnyBreakpoint;
        if (selected instanceof debug_function_breakpoint_1.DebugFunctionBreakpoint || selected instanceof debug_instruction_breakpoint_1.DebugInstructionBreakpoint || selected instanceof debug_source_breakpoint_1.DebugSourceBreakpoint) {
            return selected;
        }
    }
    get variables() {
        const { currentWidget } = this.shell;
        return currentWidget instanceof debug_variables_widget_1.DebugVariablesWidget && currentWidget || undefined;
    }
    get selectedVariable() {
        const { variables } = this;
        return variables && variables.selectedElement instanceof debug_console_items_1.DebugVariable && variables.selectedElement || undefined;
    }
    get watch() {
        const { currentWidget } = this.shell;
        return currentWidget instanceof debug_watch_widget_1.DebugWatchWidget && currentWidget || undefined;
    }
    get watchExpression() {
        const { watch } = this;
        return watch && watch.selectedElement instanceof debug_watch_expression_1.DebugWatchExpression && watch.selectedElement || undefined;
    }
    isPosition(position) {
        return monaco.Position.isIPosition(position);
    }
    asPosition(position) {
        return monaco.Position.lift(position);
    }
    registerColors(colors) {
        colors.register(
        // Debug colors should be aligned with https://code.visualstudio.com/api/references/theme-color#debug-colors
        {
            id: 'editor.stackFrameHighlightBackground',
            defaults: {
                dark: '#ffff0033',
                light: '#ffff6673',
                hcDark: '#fff600',
                hcLight: '#ffff6673'
            }, description: 'Background color for the highlight of line at the top stack frame position.'
        }, {
            id: 'editor.focusedStackFrameHighlightBackground',
            defaults: {
                dark: '#7abd7a4d',
                light: '#cee7ce73',
                hcDark: '#cee7ce',
                hcLight: '#cee7ce73'
            }, description: 'Background color for the highlight of line at focused stack frame position.'
        }, 
        // Status bar colors should be aligned with debugging colors from https://code.visualstudio.com/api/references/theme-color#status-bar-colors
        {
            id: 'statusBar.debuggingBackground', defaults: {
                dark: '#CC6633',
                light: '#CC6633',
                hcDark: '#CC6633',
                hcLight: '#B5200D'
            }, description: 'Status bar background color when a program is being debugged. The status bar is shown in the bottom of the window'
        }, {
            id: 'statusBar.debuggingForeground', defaults: {
                dark: 'statusBar.foreground',
                light: 'statusBar.foreground',
                hcDark: 'statusBar.foreground',
                hcLight: 'statusBar.foreground'
            }, description: 'Status bar foreground color when a program is being debugged. The status bar is shown in the bottom of the window'
        }, {
            id: 'statusBar.debuggingBorder', defaults: {
                dark: 'statusBar.border',
                light: 'statusBar.border',
                hcDark: 'statusBar.border',
                hcLight: 'statusBar.border'
            }, description: 'Status bar border color separating to the sidebar and editor when a program is being debugged. The status bar is shown in the bottom of the window'
        }, 
        // Debug Exception Widget colors should be aligned with
        // https://github.com/microsoft/vscode/blob/ff5f581425da6230b6f9216ecf19abf6c9d285a6/src/vs/workbench/contrib/debug/browser/exceptionWidget.ts#L23
        {
            id: 'debugExceptionWidget.border', defaults: {
                dark: '#a31515',
                light: '#a31515',
                hcDark: '#a31515',
                hcLight: '#a31515'
            }, description: 'Exception widget border color.',
        }, {
            id: 'debugExceptionWidget.background', defaults: {
                dark: '#420b0d',
                light: '#f1dfde',
                hcDark: '#420b0d',
                hcLight: '#f1dfde'
            }, description: 'Exception widget background color.'
        }, 
        // Debug Icon colors should be aligned with
        // https://code.visualstudio.com/api/references/theme-color#debug-icons-colors
        {
            id: 'debugIcon.breakpointForeground', defaults: {
                dark: '#E51400',
                light: '#E51400',
                hcDark: '#E51400',
                hcLight: '#E51400'
            },
            description: 'Icon color for breakpoints.'
        }, {
            id: 'debugIcon.breakpointDisabledForeground', defaults: {
                dark: '#848484',
                light: '#848484',
                hcDark: '#848484',
                hcLight: '#848484'
            },
            description: 'Icon color for disabled breakpoints.'
        }, {
            id: 'debugIcon.breakpointUnverifiedForeground', defaults: {
                dark: '#848484',
                light: '#848484',
                hcDark: '#848484',
                hcLight: '#848484'
            },
            description: 'Icon color for unverified breakpoints.'
        }, {
            id: 'debugIcon.breakpointCurrentStackframeForeground', defaults: {
                dark: '#FFCC00',
                light: '#BE8700',
                hcDark: '#FFCC00',
                hcLight: '#BE8700'
            },
            description: 'Icon color for the current breakpoint stack frame.'
        }, {
            id: 'debugIcon.breakpointStackframeForeground', defaults: {
                dark: '#89D185',
                light: '#89D185',
                hcDark: '#89D185',
                hcLight: '#89D185'
            },
            description: 'Icon color for all breakpoint stack frames.'
        }, {
            id: 'debugIcon.startForeground', defaults: {
                dark: '#89D185',
                light: '#388A34',
                hcDark: '#89D185',
                hcLight: '#388A34'
            }, description: 'Debug toolbar icon for start debugging.'
        }, {
            id: 'debugIcon.pauseForeground', defaults: {
                dark: '#75BEFF',
                light: '#007ACC',
                hcDark: '#75BEFF',
                hcLight: '#007ACC'
            }, description: 'Debug toolbar icon for pause.'
        }, {
            id: 'debugIcon.stopForeground', defaults: {
                dark: '#F48771',
                light: '#A1260D',
                hcDark: '#F48771',
                hcLight: '#A1260D'
            }, description: 'Debug toolbar icon for stop.'
        }, {
            id: 'debugIcon.disconnectForeground', defaults: {
                dark: '#F48771',
                light: '#A1260D',
                hcDark: '#F48771',
                hcLight: '#A1260D'
            }, description: 'Debug toolbar icon for disconnect.'
        }, {
            id: 'debugIcon.restartForeground', defaults: {
                dark: '#89D185',
                light: '#388A34',
                hcDark: '#89D185',
                hcLight: '#388A34'
            }, description: 'Debug toolbar icon for restart.'
        }, {
            id: 'debugIcon.stepOverForeground', defaults: {
                dark: '#75BEFF',
                light: '#007ACC',
                hcDark: '#75BEFF',
                hcLight: '#007ACC',
            }, description: 'Debug toolbar icon for step over.'
        }, {
            id: 'debugIcon.stepIntoForeground', defaults: {
                dark: '#75BEFF',
                light: '#007ACC',
                hcDark: '#75BEFF',
                hcLight: '#007ACC'
            }, description: 'Debug toolbar icon for step into.'
        }, {
            id: 'debugIcon.stepOutForeground', defaults: {
                dark: '#75BEFF',
                light: '#007ACC',
                hcDark: '#75BEFF',
                hcLight: '#007ACC',
            }, description: 'Debug toolbar icon for step over.'
        }, {
            id: 'debugIcon.continueForeground', defaults: {
                dark: '#75BEFF',
                light: '#007ACC',
                hcDark: '#75BEFF',
                hcLight: '#007ACC'
            }, description: 'Debug toolbar icon for continue.'
        }, {
            id: 'debugIcon.stepBackForeground', defaults: {
                dark: '#75BEFF',
                light: '#007ACC',
                hcDark: '#75BEFF',
                hcLight: '#007ACC'
            }, description: 'Debug toolbar icon for step back.'
        }, {
            id: 'debugConsole.infoForeground', defaults: {
                dark: 'editorInfo.foreground',
                light: 'editorInfo.foreground',
                hcDark: 'foreground',
                hcLight: 'foreground'
            }, description: 'Foreground color for info messages in debug REPL console.'
        }, {
            id: 'debugConsole.warningForeground', defaults: {
                dark: 'editorWarning.foreground',
                light: 'editorWarning.foreground',
                hcDark: '#008000',
                hcLight: 'editorWarning.foreground'
            },
            description: 'Foreground color for warning messages in debug REPL console.'
        }, {
            id: 'debugConsole.errorForeground', defaults: {
                dark: 'errorForeground',
                light: 'errorForeground',
                hcDark: 'errorForeground',
                hcLight: 'errorForeground'
            },
            description: 'Foreground color for error messages in debug REPL console.',
        }, {
            id: 'debugConsole.sourceForeground', defaults: {
                dark: 'foreground',
                light: 'foreground',
                hcDark: 'foreground',
                hcLight: 'foreground'
            },
            description: 'Foreground color for source filenames in debug REPL console.',
        }, {
            id: 'debugConsoleInputIcon.foreground', defaults: {
                dark: 'foreground',
                light: 'foreground',
                hcDark: 'foreground',
                hcLight: 'foreground'
            },
            description: 'Foreground color for debug console input marker icon.'
        });
    }
    updateStatusBar() {
        if (this.debuggingStatusBar === document.body.classList.contains('theia-mod-debugging')) {
            return;
        }
        document.body.classList.toggle('theia-mod-debugging');
    }
    get debuggingStatusBar() {
        if (this.manager.state < debug_session_1.DebugState.Running) {
            return false;
        }
        const session = this.manager.currentSession;
        if (session) {
            if (session.configuration.noDebug) {
                return false;
            }
            if (this.getOption(session, 'suppressDebugStatusbar')) {
                return false;
            }
        }
        return true;
    }
    getOption(session, option) {
        // If session is undefined there will be no option
        if (!session) {
            return false;
        }
        // If undefined take the value of the parent
        if (option in session.configuration && session.configuration[option] !== undefined) {
            return session.configuration[option];
        }
        return this.getOption(session.parentSession, option);
    }
};
__decorate([
    (0, inversify_1.inject)(debug_service_1.DebugService),
    __metadata("design:type", Object)
], DebugFrontendApplicationContribution.prototype, "debug", void 0);
__decorate([
    (0, inversify_1.inject)(debug_session_manager_1.DebugSessionManager),
    __metadata("design:type", debug_session_manager_1.DebugSessionManager)
], DebugFrontendApplicationContribution.prototype, "manager", void 0);
__decorate([
    (0, inversify_1.inject)(debug_configuration_manager_1.DebugConfigurationManager),
    __metadata("design:type", debug_configuration_manager_1.DebugConfigurationManager)
], DebugFrontendApplicationContribution.prototype, "configurations", void 0);
__decorate([
    (0, inversify_1.inject)(breakpoint_manager_1.BreakpointManager),
    __metadata("design:type", breakpoint_manager_1.BreakpointManager)
], DebugFrontendApplicationContribution.prototype, "breakpointManager", void 0);
__decorate([
    (0, inversify_1.inject)(debug_editor_service_1.DebugEditorService),
    __metadata("design:type", debug_editor_service_1.DebugEditorService)
], DebugFrontendApplicationContribution.prototype, "editors", void 0);
__decorate([
    (0, inversify_1.inject)(debug_console_contribution_1.DebugConsoleContribution),
    __metadata("design:type", debug_console_contribution_1.DebugConsoleContribution)
], DebugFrontendApplicationContribution.prototype, "console", void 0);
__decorate([
    (0, inversify_1.inject)(debug_schema_updater_1.DebugSchemaUpdater),
    __metadata("design:type", debug_schema_updater_1.DebugSchemaUpdater)
], DebugFrontendApplicationContribution.prototype, "schemaUpdater", void 0);
__decorate([
    (0, inversify_1.inject)(debug_preferences_1.DebugPreferences),
    __metadata("design:type", Object)
], DebugFrontendApplicationContribution.prototype, "preference", void 0);
__decorate([
    (0, inversify_1.inject)(debug_watch_manager_1.DebugWatchManager),
    __metadata("design:type", debug_watch_manager_1.DebugWatchManager)
], DebugFrontendApplicationContribution.prototype, "watchManager", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.LabelProvider),
    __metadata("design:type", browser_1.LabelProvider)
], DebugFrontendApplicationContribution.prototype, "labelProvider", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.EditorManager),
    __metadata("design:type", browser_2.EditorManager)
], DebugFrontendApplicationContribution.prototype, "editorManager", void 0);
DebugFrontendApplicationContribution = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], DebugFrontendApplicationContribution);
exports.DebugFrontendApplicationContribution = DebugFrontendApplicationContribution;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/debug/lib/browser/debug-frontend-application-contribution'] = this;


/***/ }),

/***/ "../../packages/debug/lib/browser/debug-schema-updater.js":
/*!****************************************************************!*\
  !*** ../../packages/debug/lib/browser/debug-schema-updater.js ***!
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.launchSchemaId = exports.DebugSchemaUpdater = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const debug_service_1 = __webpack_require__(/*! ../common/debug-service */ "../../packages/debug/lib/common/debug-service.js");
const debug_preferences_1 = __webpack_require__(/*! ./debug-preferences */ "../../packages/debug/lib/browser/debug-preferences.js");
const variable_input_schema_1 = __webpack_require__(/*! @theia/variable-resolver/lib/browser/variable-input-schema */ "../../packages/variable-resolver/lib/browser/variable-input-schema.js");
const browser_1 = __webpack_require__(/*! @theia/workspace/lib/browser */ "../../packages/workspace/lib/browser/index.js");
const debug_compound_1 = __webpack_require__(/*! ../common/debug-compound */ "../../packages/debug/lib/common/debug-compound.js");
let DebugSchemaUpdater = class DebugSchemaUpdater {
    constructor() {
        this.uri = new uri_1.default(exports.launchSchemaId);
    }
    init() {
        this.inmemoryResources.add(this.uri, '');
    }
    registerSchemas(context) {
        context.registerSchema({
            fileMatch: ['launch.json'],
            url: this.uri.toString()
        });
        this.workspaceService.updateSchema('launch', { $ref: this.uri.toString() });
    }
    async update() {
        const types = await this.debug.debugTypes();
        const schema = { ...(0, common_1.deepClone)(launchSchema) };
        const items = schema.properties['configurations'].items;
        const attributePromises = types.map(type => this.debug.getSchemaAttributes(type));
        for (const attributes of await Promise.all(attributePromises)) {
            for (const attribute of attributes) {
                const properties = {};
                for (const key of ['debugViewLocation', 'openDebug', 'internalConsoleOptions']) {
                    properties[key] = debug_preferences_1.debugPreferencesSchema.properties[`debug.${key}`];
                }
                attribute.properties = Object.assign(properties, attribute.properties);
                items.oneOf.push(attribute);
            }
        }
        items.defaultSnippets.push(...await this.debug.getConfigurationSnippets());
        const contents = JSON.stringify(schema);
        this.inmemoryResources.update(this.uri, contents);
    }
};
__decorate([
    (0, inversify_1.inject)(common_1.InMemoryResources),
    __metadata("design:type", common_1.InMemoryResources)
], DebugSchemaUpdater.prototype, "inmemoryResources", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.WorkspaceService),
    __metadata("design:type", browser_1.WorkspaceService)
], DebugSchemaUpdater.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(debug_service_1.DebugService),
    __metadata("design:type", Object)
], DebugSchemaUpdater.prototype, "debug", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DebugSchemaUpdater.prototype, "init", null);
DebugSchemaUpdater = __decorate([
    (0, inversify_1.injectable)()
], DebugSchemaUpdater);
exports.DebugSchemaUpdater = DebugSchemaUpdater;
exports.launchSchemaId = 'vscode://schemas/launch';
const launchSchema = {
    $id: exports.launchSchemaId,
    type: 'object',
    title: common_1.nls.localizeByDefault('Launch'),
    required: [],
    default: { version: '0.2.0', configurations: [], compounds: [] },
    properties: {
        version: {
            type: 'string',
            description: common_1.nls.localizeByDefault('Version of this file format.'),
            default: '0.2.0'
        },
        configurations: {
            type: 'array',
            description: common_1.nls.localizeByDefault('List of configurations. Add new configurations or edit existing ones by using IntelliSense.'),
            items: {
                defaultSnippets: [],
                'type': 'object',
                oneOf: []
            }
        },
        compounds: {
            type: 'array',
            description: common_1.nls.localizeByDefault('List of compounds. Each compound references multiple configurations which will get launched together.'),
            items: {
                type: 'object',
                required: ['name', 'configurations'],
                properties: {
                    name: {
                        type: 'string',
                        description: common_1.nls.localizeByDefault('Name of compound. Appears in the launch configuration drop down menu.')
                    },
                    configurations: {
                        type: 'array',
                        default: [],
                        items: {
                            oneOf: [{
                                    type: 'string',
                                    description: common_1.nls.localizeByDefault('Please use unique configuration names.')
                                }, {
                                    type: 'object',
                                    required: ['name'],
                                    properties: {
                                        name: {
                                            enum: [],
                                            description: common_1.nls.localizeByDefault('Name of compound. Appears in the launch configuration drop down menu.')
                                        },
                                        folder: {
                                            enum: [],
                                            description: common_1.nls.localizeByDefault('Name of folder in which the compound is located.')
                                        }
                                    }
                                }]
                        },
                        description: common_1.nls.localizeByDefault('Names of configurations that will be started as part of this compound.')
                    },
                    stopAll: {
                        type: 'boolean',
                        default: false,
                        description: common_1.nls.localizeByDefault('Controls whether manually terminating one session will stop all of the compound sessions.')
                    },
                    preLaunchTask: {
                        type: 'string',
                        default: '',
                        description: common_1.nls.localizeByDefault('Task to run before any of the compound configurations start.')
                    }
                },
                default: debug_compound_1.defaultCompound
            },
            default: [debug_compound_1.defaultCompound]
        },
        inputs: variable_input_schema_1.inputsSchema.definitions.inputs
    },
    allowComments: true,
    allowTrailingCommas: true,
};

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/debug/lib/browser/debug-schema-updater'] = this;


/***/ }),

/***/ "../../packages/debug/lib/browser/editor/debug-breakpoint-widget.js":
/*!**************************************************************************!*\
  !*** ../../packages/debug/lib/browser/editor/debug-breakpoint-widget.js ***!
  \**************************************************************************/
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
var DebugBreakpointWidget_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DebugBreakpointWidget = void 0;
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const client_1 = __webpack_require__(/*! @theia/core/shared/react-dom/client */ "../../packages/core/shared/react-dom/client/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const monaco_editor_provider_1 = __webpack_require__(/*! @theia/monaco/lib/browser/monaco-editor-provider */ "../../packages/monaco/lib/browser/monaco-editor-provider.js");
const monaco_editor_zone_widget_1 = __webpack_require__(/*! @theia/monaco/lib/browser/monaco-editor-zone-widget */ "../../packages/monaco/lib/browser/monaco-editor-zone-widget.js");
const debug_editor_1 = __webpack_require__(/*! ./debug-editor */ "../../packages/debug/lib/browser/editor/debug-editor.js");
const debug_source_breakpoint_1 = __webpack_require__(/*! ../model/debug-source-breakpoint */ "../../packages/debug/lib/browser/model/debug-source-breakpoint.js");
const monaco = __webpack_require__(/*! @theia/monaco-editor-core */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/editor.main.js");
const suggest_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/contrib/suggest/browser/suggest */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/contrib/suggest/browser/suggest.js");
const languageFeatures_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/common/services/languageFeatures */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/common/services/languageFeatures.js");
const standaloneServices_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices.js");
const select_component_1 = __webpack_require__(/*! @theia/core/lib/browser/widgets/select-component */ "../../packages/core/lib/browser/widgets/select-component.js");
let DebugBreakpointWidget = DebugBreakpointWidget_1 = class DebugBreakpointWidget {
    constructor() {
        this.toDispose = new core_1.DisposableCollection();
        this.context = 'condition';
        this._values = {};
        this.selectComponentRef = React.createRef();
        this.updateInput = (option) => {
            if (this._input) {
                this._values[this.context] = this._input.getControl().getValue();
            }
            this.context = option.value;
            this.render();
            if (this._input) {
                this._input.focus();
            }
        };
    }
    get values() {
        if (!this._input) {
            return undefined;
        }
        return {
            ...this._values,
            [this.context]: this._input.getControl().getValue()
        };
    }
    get input() {
        return this._input;
    }
    // eslint-disable-next-line no-null/no-null
    set inputSize(dimension) {
        if (this._input) {
            if (dimension) {
                this._input.setSize(dimension);
            }
            else {
                this._input.resizeToFit();
            }
        }
    }
    init() {
        this.doInit();
    }
    async doInit() {
        this.toDispose.push(this.zone = new monaco_editor_zone_widget_1.MonacoEditorZoneWidget(this.editor.getControl()));
        this.zone.containerNode.classList.add('theia-debug-breakpoint-widget');
        const selectNode = this.selectNode = document.createElement('div');
        selectNode.classList.add('theia-debug-breakpoint-select');
        this.zone.containerNode.appendChild(selectNode);
        this.selectNodeRoot = (0, client_1.createRoot)(this.selectNode);
        this.toDispose.push(core_1.Disposable.create(() => this.selectNodeRoot.unmount()));
        const inputNode = document.createElement('div');
        inputNode.classList.add('theia-debug-breakpoint-input');
        this.zone.containerNode.appendChild(inputNode);
        const input = this._input = await this.createInput(inputNode);
        if (this.toDispose.disposed) {
            input.dispose();
            return;
        }
        this.toDispose.push(input);
        this.toDispose.push(monaco.languages.registerCompletionItemProvider({ scheme: input.uri.scheme }, {
            provideCompletionItems: async (model, position, context, token) => {
                const suggestions = [];
                if ((this.context === 'condition' || this.context === 'logMessage')
                    && input.uri.toString() === model.uri.toString()) {
                    const editor = this.editor.getControl();
                    const completions = await (0, suggest_1.provideSuggestionItems)(standaloneServices_1.StandaloneServices.get(languageFeatures_1.ILanguageFeaturesService).completionProvider, editor.getModel(), new monaco.Position(editor.getPosition().lineNumber, 1), new suggest_1.CompletionOptions(undefined, new Set().add(27 /* Snippet */)), context, token);
                    let overwriteBefore = 0;
                    if (this.context === 'condition') {
                        overwriteBefore = position.column - 1;
                    }
                    else {
                        // Inside the curly brackets, need to count how many useful characters are behind the position so they would all be taken into account
                        const value = editor.getModel().getValue();
                        while ((position.column - 2 - overwriteBefore >= 0)
                            && value[position.column - 2 - overwriteBefore] !== '{' && value[position.column - 2 - overwriteBefore] !== ' ') {
                            overwriteBefore++;
                        }
                    }
                    for (const { completion } of completions.items) {
                        completion.range = monaco.Range.fromPositions(position.delta(0, -overwriteBefore), position);
                        suggestions.push(completion);
                    }
                }
                return { suggestions };
            }
        }));
        this.toDispose.push(this.zone.onDidLayoutChange(dimension => this.layout(dimension)));
        this.toDispose.push(input.getControl().onDidChangeModelContent(() => {
            const heightInLines = input.getControl().getModel().getLineCount() + 1;
            this.zone.layout(heightInLines);
            this.updatePlaceholder();
        }));
        this._input.getControl().createContextKey('breakpointWidgetFocus', true);
    }
    dispose() {
        this.toDispose.dispose();
    }
    get position() {
        const options = this.zone.options;
        return options && new monaco.Position(options.afterLineNumber, options.afterColumn || -1);
    }
    show(options) {
        if (!this._input) {
            return;
        }
        const breakpoint = options instanceof debug_source_breakpoint_1.DebugSourceBreakpoint ? options : 'breakpoint' in options ? options.breakpoint : undefined;
        this._values = breakpoint ? {
            condition: breakpoint.condition,
            hitCondition: breakpoint.hitCondition,
            logMessage: breakpoint.logMessage
        } : {};
        if (options instanceof debug_source_breakpoint_1.DebugSourceBreakpoint) {
            if (options.logMessage) {
                this.context = 'logMessage';
            }
            else if (options.hitCondition && !options.condition) {
                this.context = 'hitCondition';
            }
            else {
                this.context = 'condition';
            }
        }
        else {
            this.context = options.context;
        }
        this.render();
        const position = 'position' in options ? options.position : undefined;
        const afterLineNumber = breakpoint ? breakpoint.line : position.lineNumber;
        const afterColumn = breakpoint ? breakpoint.column : position.column;
        const editor = this._input.getControl();
        const heightInLines = editor.getModel().getLineCount() + 1;
        this.zone.show({ afterLineNumber, afterColumn, heightInLines, frameWidth: 1 });
        editor.setPosition(editor.getModel().getPositionAt(editor.getModel().getValueLength()));
        this._input.focus();
        this.editor.getControl().createContextKey('isBreakpointWidgetVisible', true);
    }
    hide() {
        this.zone.hide();
        this.editor.getControl().createContextKey('isBreakpointWidgetVisible', false);
        this.editor.focus();
    }
    layout(dimension) {
        if (this._input) {
            this._input.getControl().layout(dimension);
        }
    }
    createInput(node) {
        return this.editorProvider.createInline(new uri_1.default().withScheme('breakpointinput').withPath(this.editor.getControl().getId()), node, {
            autoSizing: false
        });
    }
    render() {
        if (this._input) {
            this._input.getControl().setValue(this._values[this.context] || '');
        }
        const selectComponent = this.selectComponentRef.current;
        if (selectComponent && selectComponent.value !== this.context) {
            selectComponent.value = this.context;
        }
        this.selectNodeRoot.render(React.createElement(select_component_1.SelectComponent, { defaultValue: this.context, onChange: this.updateInput, options: [
                { value: 'condition', label: core_1.nls.localizeByDefault('Expression') },
                { value: 'hitCondition', label: core_1.nls.localizeByDefault('Hit Count') },
                { value: 'logMessage', label: core_1.nls.localizeByDefault('Log Message') },
            ], ref: this.selectComponentRef }));
    }
    updatePlaceholder() {
        if (!this._input) {
            return;
        }
        const value = this._input.getControl().getValue();
        const decorations = !!value ? [] : [{
                range: {
                    startLineNumber: 0,
                    endLineNumber: 0,
                    startColumn: 0,
                    endColumn: 1
                },
                renderOptions: {
                    after: {
                        contentText: this.placeholder,
                        opacity: '0.4'
                    }
                }
            }];
        this._input.getControl()
            .setDecorationsByType('Debug breakpoint placeholder', DebugBreakpointWidget_1.PLACEHOLDER_DECORATION, decorations);
    }
    get placeholder() {
        if (this.context === 'logMessage') {
            return core_1.nls.localizeByDefault("Message to log when breakpoint is hit. Expressions within {} are interpolated. 'Enter' to accept, 'esc' to cancel.");
        }
        if (this.context === 'hitCondition') {
            return core_1.nls.localizeByDefault("Break when hit count condition is met. 'Enter' to accept, 'esc' to cancel.");
        }
        return core_1.nls.localizeByDefault("Break when expression evaluates to true. 'Enter' to accept, 'esc' to cancel.");
    }
};
DebugBreakpointWidget.PLACEHOLDER_DECORATION = 'placeholderDecoration';
__decorate([
    (0, inversify_1.inject)(debug_editor_1.DebugEditor),
    __metadata("design:type", Object)
], DebugBreakpointWidget.prototype, "editor", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_editor_provider_1.MonacoEditorProvider),
    __metadata("design:type", monaco_editor_provider_1.MonacoEditorProvider)
], DebugBreakpointWidget.prototype, "editorProvider", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DebugBreakpointWidget.prototype, "init", null);
DebugBreakpointWidget = DebugBreakpointWidget_1 = __decorate([
    (0, inversify_1.injectable)()
], DebugBreakpointWidget);
exports.DebugBreakpointWidget = DebugBreakpointWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/debug/lib/browser/editor/debug-breakpoint-widget'] = this;


/***/ }),

/***/ "../../packages/debug/lib/browser/editor/debug-editor-model.js":
/*!*********************************************************************!*\
  !*** ../../packages/debug/lib/browser/editor/debug-editor-model.js ***!
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var DebugEditorModel_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DebugEditorModel = exports.DebugEditorModelFactory = void 0;
const debounce = __webpack_require__(/*! p-debounce */ "../../node_modules/p-debounce/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const monaco = __webpack_require__(/*! @theia/monaco-editor-core */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/editor.main.js");
const configuration_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/platform/configuration/common/configuration */ "../../node_modules/@theia/monaco-editor-core/esm/vs/platform/configuration/common/configuration.js");
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const monaco_frontend_module_1 = __webpack_require__(/*! @theia/monaco/lib/browser/monaco-frontend-module */ "../../packages/monaco/lib/browser/monaco-frontend-module.js");
const breakpoint_manager_1 = __webpack_require__(/*! ../breakpoint/breakpoint-manager */ "../../packages/debug/lib/browser/breakpoint/breakpoint-manager.js");
const debug_session_manager_1 = __webpack_require__(/*! ../debug-session-manager */ "../../packages/debug/lib/browser/debug-session-manager.js");
const breakpoint_marker_1 = __webpack_require__(/*! ../breakpoint/breakpoint-marker */ "../../packages/debug/lib/browser/breakpoint/breakpoint-marker.js");
const debug_editor_1 = __webpack_require__(/*! ./debug-editor */ "../../packages/debug/lib/browser/editor/debug-editor.js");
const debug_hover_widget_1 = __webpack_require__(/*! ./debug-hover-widget */ "../../packages/debug/lib/browser/editor/debug-hover-widget.js");
const debug_breakpoint_widget_1 = __webpack_require__(/*! ./debug-breakpoint-widget */ "../../packages/debug/lib/browser/editor/debug-breakpoint-widget.js");
const debug_exception_widget_1 = __webpack_require__(/*! ./debug-exception-widget */ "../../packages/debug/lib/browser/editor/debug-exception-widget.js");
const debug_inline_value_decorator_1 = __webpack_require__(/*! ./debug-inline-value-decorator */ "../../packages/debug/lib/browser/editor/debug-inline-value-decorator.js");
exports.DebugEditorModelFactory = Symbol('DebugEditorModelFactory');
let DebugEditorModel = DebugEditorModel_1 = class DebugEditorModel {
    constructor() {
        this.toDispose = new core_1.DisposableCollection();
        this.toDisposeOnUpdate = new core_1.DisposableCollection();
        this.breakpointDecorations = [];
        this.breakpointRanges = new Map();
        this.currentBreakpointDecorations = [];
        this.editorDecorations = [];
        this.updatingDecorations = false;
        this.update = debounce(async () => {
            if (this.toDispose.disposed) {
                return;
            }
            this.toDisposeOnUpdate.dispose();
            this.toggleExceptionWidget();
            await this.updateEditorDecorations();
            this.updateEditorHover();
        }, 100);
        this.hintDecorations = [];
    }
    static createContainer(parent, editor) {
        const child = (0, debug_hover_widget_1.createDebugHoverWidgetContainer)(parent, editor);
        child.bind(DebugEditorModel_1).toSelf();
        child.bind(debug_breakpoint_widget_1.DebugBreakpointWidget).toSelf();
        child.bind(debug_exception_widget_1.DebugExceptionWidget).toSelf();
        return child;
    }
    static createModel(parent, editor) {
        return DebugEditorModel_1.createContainer(parent, editor).get(DebugEditorModel_1);
    }
    init() {
        this.uri = new uri_1.default(this.editor.getControl().getModel().uri.toString());
        this.toDispose.pushAll([
            this.hover,
            this.breakpointWidget,
            this.exceptionWidget,
            this.editor.getControl().onMouseDown(event => this.handleMouseDown(event)),
            this.editor.getControl().onMouseMove(event => this.handleMouseMove(event)),
            this.editor.getControl().onMouseLeave(event => this.handleMouseLeave(event)),
            this.editor.getControl().onKeyDown(() => this.hover.hide({ immediate: false })),
            this.editor.getControl().onDidChangeModelContent(() => this.update()),
            this.editor.getControl().getModel().onDidChangeDecorations(() => this.updateBreakpoints()),
            this.editor.onDidResize(e => this.breakpointWidget.inputSize = e),
            this.sessions.onDidChange(() => this.update()),
            this.toDisposeOnUpdate,
            this.sessionManager.onDidChangeBreakpoints(({ session, uri }) => {
                if ((!session || session === this.sessionManager.currentSession) && uri.isEqual(this.uri)) {
                    this.render();
                }
            }),
            this.breakpoints.onDidChangeBreakpoints(event => this.closeBreakpointIfAffected(event)),
        ]);
        this.update();
        this.render();
    }
    dispose() {
        this.toDispose.dispose();
    }
    /**
     * To disable the default editor-contribution hover from Code when
     * the editor has the `currentFrame`. Otherwise, both `textdocument/hover`
     * and the debug hovers are visible at the same time when hovering over a symbol.
     */
    async updateEditorHover() {
        if (this.sessions.isCurrentEditorFrame(this.uri)) {
            const codeEditor = this.editor.getControl();
            codeEditor.updateOptions({ hover: { enabled: false } });
            this.toDisposeOnUpdate.push(core_1.Disposable.create(() => {
                const model = codeEditor.getModel();
                const overrides = {
                    resource: model.uri,
                    overrideIdentifier: model.getLanguageId(),
                };
                const { enabled, delay, sticky } = this.configurationService.getValue('editor.hover', overrides);
                codeEditor.updateOptions({
                    hover: {
                        enabled,
                        delay,
                        sticky
                    }
                });
            }));
        }
    }
    async updateEditorDecorations() {
        const [newFrameDecorations, inlineValueDecorations] = await Promise.all([
            this.createFrameDecorations(),
            this.createInlineValueDecorations()
        ]);
        const codeEditor = this.editor.getControl();
        codeEditor.removeDecorations([debug_inline_value_decorator_1.INLINE_VALUE_DECORATION_KEY]);
        codeEditor.setDecorationsByType('Inline debug decorations', debug_inline_value_decorator_1.INLINE_VALUE_DECORATION_KEY, inlineValueDecorations);
        this.editorDecorations = this.deltaDecorations(this.editorDecorations, newFrameDecorations);
    }
    async createInlineValueDecorations() {
        if (!this.sessions.isCurrentEditorFrame(this.uri)) {
            return [];
        }
        const { currentFrame } = this.sessions;
        return this.inlineValueDecorator.calculateDecorations(this, currentFrame);
    }
    createFrameDecorations() {
        const { currentFrame, topFrame } = this.sessions;
        if (!currentFrame) {
            return [];
        }
        if (!this.sessions.isCurrentEditorFrame(this.uri)) {
            return [];
        }
        const decorations = [];
        const columnUntilEOLRange = new monaco.Range(currentFrame.raw.line, currentFrame.raw.column, currentFrame.raw.line, 1 << 30);
        const range = new monaco.Range(currentFrame.raw.line, currentFrame.raw.column, currentFrame.raw.line, currentFrame.raw.column + 1);
        if (topFrame === currentFrame) {
            decorations.push({
                options: DebugEditorModel_1.TOP_STACK_FRAME_MARGIN,
                range
            });
            decorations.push({
                options: DebugEditorModel_1.TOP_STACK_FRAME_DECORATION,
                range: columnUntilEOLRange
            });
            const { topFrameRange } = this;
            if (topFrameRange && topFrameRange.startLineNumber === currentFrame.raw.line && topFrameRange.startColumn !== currentFrame.raw.column) {
                decorations.push({
                    options: DebugEditorModel_1.TOP_STACK_FRAME_INLINE_DECORATION,
                    range: columnUntilEOLRange
                });
            }
            this.topFrameRange = columnUntilEOLRange;
        }
        else {
            decorations.push({
                options: DebugEditorModel_1.FOCUSED_STACK_FRAME_MARGIN,
                range
            });
            decorations.push({
                options: DebugEditorModel_1.FOCUSED_STACK_FRAME_DECORATION,
                range: columnUntilEOLRange
            });
        }
        return decorations;
    }
    async toggleExceptionWidget() {
        const { currentFrame } = this.sessions;
        if (!currentFrame) {
            return;
        }
        if (!this.sessions.isCurrentEditorFrame(this.uri)) {
            this.exceptionWidget.hide();
            return;
        }
        const info = await currentFrame.thread.getExceptionInfo();
        if (!info) {
            this.exceptionWidget.hide();
            return;
        }
        this.exceptionWidget.show({
            info,
            lineNumber: currentFrame.raw.line,
            column: currentFrame.raw.column
        });
    }
    render() {
        this.renderBreakpoints();
        this.renderCurrentBreakpoints();
    }
    renderBreakpoints() {
        const breakpoints = this.breakpoints.getBreakpoints(this.uri);
        const decorations = this.createBreakpointDecorations(breakpoints);
        this.breakpointDecorations = this.deltaDecorations(this.breakpointDecorations, decorations);
        this.updateBreakpointRanges(breakpoints);
    }
    createBreakpointDecorations(breakpoints) {
        return breakpoints.map(breakpoint => this.createBreakpointDecoration(breakpoint));
    }
    createBreakpointDecoration(breakpoint) {
        const lineNumber = breakpoint.raw.line;
        const column = breakpoint.raw.column;
        const range = typeof column === 'number' ? new monaco.Range(lineNumber, column, lineNumber, column + 1) : new monaco.Range(lineNumber, 1, lineNumber, 2);
        return {
            range,
            options: {
                stickiness: DebugEditorModel_1.STICKINESS
            }
        };
    }
    updateBreakpointRanges(breakpoints) {
        this.breakpointRanges.clear();
        for (let i = 0; i < this.breakpointDecorations.length; i++) {
            const decoration = this.breakpointDecorations[i];
            const breakpoint = breakpoints[i];
            const range = this.editor.getControl().getModel().getDecorationRange(decoration);
            this.breakpointRanges.set(decoration, [range, breakpoint]);
        }
    }
    renderCurrentBreakpoints() {
        const decorations = this.createCurrentBreakpointDecorations();
        this.currentBreakpointDecorations = this.deltaDecorations(this.currentBreakpointDecorations, decorations);
    }
    createCurrentBreakpointDecorations() {
        const breakpoints = this.sessions.getBreakpoints(this.uri);
        return breakpoints.map(breakpoint => this.createCurrentBreakpointDecoration(breakpoint));
    }
    createCurrentBreakpointDecoration(breakpoint) {
        const lineNumber = breakpoint.line;
        const column = breakpoint.column;
        const range = typeof column === 'number' ? new monaco.Range(lineNumber, column, lineNumber, column + 1) : new monaco.Range(lineNumber, 1, lineNumber, 1);
        const { className, message } = breakpoint.getDecoration();
        const renderInline = typeof column === 'number' && (column > this.editor.getControl().getModel().getLineFirstNonWhitespaceColumn(lineNumber));
        return {
            range,
            options: {
                glyphMarginClassName: className,
                glyphMarginHoverMessage: message.map(value => ({ value })),
                stickiness: DebugEditorModel_1.STICKINESS,
                beforeContentClassName: renderInline ? `theia-debug-breakpoint-column codicon ${className}` : undefined
            }
        };
    }
    updateBreakpoints() {
        if (this.areBreakpointsAffected()) {
            const breakpoints = this.createBreakpoints();
            this.breakpoints.setBreakpoints(this.uri, breakpoints);
        }
    }
    areBreakpointsAffected() {
        if (this.updatingDecorations || !this.editor.getControl().getModel()) {
            return false;
        }
        for (const decoration of this.breakpointDecorations) {
            const range = this.editor.getControl().getModel().getDecorationRange(decoration);
            const oldRange = this.breakpointRanges.get(decoration)[0];
            if (!range || !range.equalsRange(oldRange)) {
                return true;
            }
        }
        return false;
    }
    createBreakpoints() {
        var _a;
        const { uri } = this;
        const lines = new Set();
        const breakpoints = [];
        for (const decoration of this.breakpointDecorations) {
            const range = this.editor.getControl().getModel().getDecorationRange(decoration);
            if (range && !lines.has(range.startLineNumber)) {
                const line = range.startLineNumber;
                const column = range.startColumn;
                const oldBreakpoint = (_a = this.breakpointRanges.get(decoration)) === null || _a === void 0 ? void 0 : _a[1];
                const isLineBreakpoint = (oldBreakpoint === null || oldBreakpoint === void 0 ? void 0 : oldBreakpoint.raw.line) !== undefined && (oldBreakpoint === null || oldBreakpoint === void 0 ? void 0 : oldBreakpoint.raw.column) === undefined;
                const change = isLineBreakpoint ? { line } : { line, column };
                const breakpoint = breakpoint_marker_1.SourceBreakpoint.create(uri, change, oldBreakpoint);
                breakpoints.push(breakpoint);
                lines.add(line);
            }
        }
        return breakpoints;
    }
    get position() {
        return this.editor.getControl().getPosition();
    }
    getBreakpoint(position = this.position) {
        return this.getInlineBreakpoint(position) || this.getLineBreakpoints(position)[0];
    }
    getInlineBreakpoint(position = this.position) {
        return this.sessions.getInlineBreakpoint(this.uri, position.lineNumber, position.column);
    }
    getLineBreakpoints(position = this.position) {
        return this.sessions.getLineBreakpoints(this.uri, position.lineNumber);
    }
    addBreakpoint(raw) {
        this.breakpoints.addBreakpoint(breakpoint_marker_1.SourceBreakpoint.create(this.uri, raw));
    }
    toggleBreakpoint(position = this.position) {
        const { lineNumber } = position;
        const breakpoints = this.getLineBreakpoints(position);
        if (breakpoints.length) {
            for (const breakpoint of breakpoints) {
                breakpoint.remove();
            }
        }
        else {
            this.addBreakpoint({ line: lineNumber });
        }
    }
    addInlineBreakpoint() {
        const { position } = this;
        const { lineNumber, column } = position;
        const breakpoint = this.getInlineBreakpoint(position);
        if (breakpoint) {
            return;
        }
        this.addBreakpoint({ line: lineNumber, column });
    }
    acceptBreakpoint() {
        const { position, values } = this.breakpointWidget;
        if (position && values) {
            const breakpoint = position.column > 0 ? this.getInlineBreakpoint(position) : this.getLineBreakpoints(position)[0];
            if (breakpoint) {
                breakpoint.updateOrigins(values);
            }
            else {
                const { lineNumber } = position;
                const column = position.column > 0 ? position.column : undefined;
                this.addBreakpoint({ line: lineNumber, column, ...values });
            }
            this.breakpointWidget.hide();
        }
    }
    handleMouseDown(event) {
        if (event.target && event.target.type === monaco.editor.MouseTargetType.GUTTER_GLYPH_MARGIN) {
            if (!event.event.rightButton) {
                this.toggleBreakpoint(event.target.position);
            }
        }
        this.hintBreakpoint(event);
    }
    handleMouseMove(event) {
        this.showHover(event);
        this.hintBreakpoint(event);
    }
    handleMouseLeave(event) {
        this.hideHover(event);
        this.deltaHintDecorations([]);
    }
    hintBreakpoint(event) {
        const hintDecorations = this.createHintDecorations(event);
        this.deltaHintDecorations(hintDecorations);
    }
    deltaHintDecorations(hintDecorations) {
        this.hintDecorations = this.deltaDecorations(this.hintDecorations, hintDecorations);
    }
    createHintDecorations(event) {
        if (event.target && event.target.type === monaco.editor.MouseTargetType.GUTTER_GLYPH_MARGIN && event.target.position) {
            const lineNumber = event.target.position.lineNumber;
            if (this.getLineBreakpoints(event.target.position).length) {
                return [];
            }
            return [{
                    range: new monaco.Range(lineNumber, 1, lineNumber, 1),
                    options: DebugEditorModel_1.BREAKPOINT_HINT_DECORATION
                }];
        }
        return [];
    }
    closeBreakpointIfAffected({ uri, removed }) {
        if (!uri.isEqual(this.uri)) {
            return;
        }
        const position = this.breakpointWidget.position;
        if (!position) {
            return;
        }
        for (const breakpoint of removed) {
            if (breakpoint.raw.line === position.lineNumber) {
                this.breakpointWidget.hide();
                break;
            }
        }
    }
    showHover(mouseEvent) {
        const targetType = mouseEvent.target.type;
        const stopKey = core_1.isOSX ? 'metaKey' : 'ctrlKey';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (targetType === monaco.editor.MouseTargetType.CONTENT_WIDGET && mouseEvent.target.detail === this.hover.getId() && !mouseEvent.event[stopKey]) {
            // mouse moved on top of debug hover widget
            return;
        }
        if (targetType === monaco.editor.MouseTargetType.CONTENT_TEXT) {
            this.hover.show({
                selection: mouseEvent.target.range,
                immediate: false
            });
        }
        else {
            this.hover.hide({ immediate: false });
        }
    }
    hideHover({ event }) {
        const rect = this.hover.getDomNode().getBoundingClientRect();
        if (event.posx < rect.left || event.posx > rect.right || event.posy < rect.top || event.posy > rect.bottom) {
            this.hover.hide({ immediate: false });
        }
    }
    deltaDecorations(oldDecorations, newDecorations) {
        this.updatingDecorations = true;
        try {
            return this.editor.getControl().deltaDecorations(oldDecorations, newDecorations);
        }
        finally {
            this.updatingDecorations = false;
        }
    }
};
DebugEditorModel.CONTEXT_MENU = ['debug-editor-context-menu'];
DebugEditorModel.STICKINESS = monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges;
DebugEditorModel.BREAKPOINT_HINT_DECORATION = {
    glyphMarginClassName: 'codicon-debug-hint',
    stickiness: DebugEditorModel_1.STICKINESS
};
DebugEditorModel.TOP_STACK_FRAME_MARGIN = {
    glyphMarginClassName: 'codicon-debug-stackframe',
    stickiness: DebugEditorModel_1.STICKINESS
};
DebugEditorModel.FOCUSED_STACK_FRAME_MARGIN = {
    glyphMarginClassName: 'codicon-debug-stackframe-focused',
    stickiness: DebugEditorModel_1.STICKINESS
};
DebugEditorModel.TOP_STACK_FRAME_DECORATION = {
    isWholeLine: true,
    className: 'theia-debug-top-stack-frame-line',
    stickiness: DebugEditorModel_1.STICKINESS
};
DebugEditorModel.TOP_STACK_FRAME_INLINE_DECORATION = {
    beforeContentClassName: 'theia-debug-top-stack-frame-column'
};
DebugEditorModel.FOCUSED_STACK_FRAME_DECORATION = {
    isWholeLine: true,
    className: 'theia-debug-focused-stack-frame-line',
    stickiness: DebugEditorModel_1.STICKINESS
};
__decorate([
    (0, inversify_1.inject)(debug_hover_widget_1.DebugHoverWidget),
    __metadata("design:type", debug_hover_widget_1.DebugHoverWidget)
], DebugEditorModel.prototype, "hover", void 0);
__decorate([
    (0, inversify_1.inject)(debug_editor_1.DebugEditor),
    __metadata("design:type", Object)
], DebugEditorModel.prototype, "editor", void 0);
__decorate([
    (0, inversify_1.inject)(breakpoint_manager_1.BreakpointManager),
    __metadata("design:type", breakpoint_manager_1.BreakpointManager)
], DebugEditorModel.prototype, "breakpoints", void 0);
__decorate([
    (0, inversify_1.inject)(debug_session_manager_1.DebugSessionManager),
    __metadata("design:type", debug_session_manager_1.DebugSessionManager)
], DebugEditorModel.prototype, "sessions", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.ContextMenuRenderer),
    __metadata("design:type", browser_1.ContextMenuRenderer)
], DebugEditorModel.prototype, "contextMenu", void 0);
__decorate([
    (0, inversify_1.inject)(debug_breakpoint_widget_1.DebugBreakpointWidget),
    __metadata("design:type", debug_breakpoint_widget_1.DebugBreakpointWidget)
], DebugEditorModel.prototype, "breakpointWidget", void 0);
__decorate([
    (0, inversify_1.inject)(debug_exception_widget_1.DebugExceptionWidget),
    __metadata("design:type", debug_exception_widget_1.DebugExceptionWidget)
], DebugEditorModel.prototype, "exceptionWidget", void 0);
__decorate([
    (0, inversify_1.inject)(debug_inline_value_decorator_1.DebugInlineValueDecorator),
    __metadata("design:type", debug_inline_value_decorator_1.DebugInlineValueDecorator)
], DebugEditorModel.prototype, "inlineValueDecorator", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_frontend_module_1.MonacoConfigurationService),
    __metadata("design:type", Object)
], DebugEditorModel.prototype, "configurationService", void 0);
__decorate([
    (0, inversify_1.inject)(debug_session_manager_1.DebugSessionManager),
    __metadata("design:type", debug_session_manager_1.DebugSessionManager)
], DebugEditorModel.prototype, "sessionManager", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DebugEditorModel.prototype, "init", null);
DebugEditorModel = DebugEditorModel_1 = __decorate([
    (0, inversify_1.injectable)()
], DebugEditorModel);
exports.DebugEditorModel = DebugEditorModel;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/debug/lib/browser/editor/debug-editor-model'] = this;


/***/ }),

/***/ "../../packages/debug/lib/browser/editor/debug-editor-service.js":
/*!***********************************************************************!*\
  !*** ../../packages/debug/lib/browser/editor/debug-editor-service.js ***!
  \***********************************************************************/
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
exports.DebugEditorService = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const monaco = __webpack_require__(/*! @theia/monaco-editor-core */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/editor.main.js");
const browser_1 = __webpack_require__(/*! @theia/editor/lib/browser */ "../../packages/editor/lib/browser/index.js");
const browser_2 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const monaco_editor_1 = __webpack_require__(/*! @theia/monaco/lib/browser/monaco-editor */ "../../packages/monaco/lib/browser/monaco-editor.js");
const debug_session_manager_1 = __webpack_require__(/*! ../debug-session-manager */ "../../packages/debug/lib/browser/debug-session-manager.js");
const debug_editor_model_1 = __webpack_require__(/*! ./debug-editor-model */ "../../packages/debug/lib/browser/editor/debug-editor-model.js");
const breakpoint_manager_1 = __webpack_require__(/*! ../breakpoint/breakpoint-manager */ "../../packages/debug/lib/browser/breakpoint/breakpoint-manager.js");
let DebugEditorService = class DebugEditorService {
    constructor() {
        this.models = new Map();
    }
    init() {
        this.editors.all.forEach(widget => this.push(widget));
        this.editors.onCreated(widget => this.push(widget));
    }
    push(widget) {
        const { editor } = widget;
        if (!(editor instanceof monaco_editor_1.MonacoEditor)) {
            return;
        }
        const uri = editor.getControl().getModel().uri.toString();
        const debugModel = this.factory(editor);
        this.models.set(uri, debugModel);
        editor.getControl().onDidDispose(() => {
            debugModel.dispose();
            this.models.delete(uri);
        });
    }
    get model() {
        const { currentEditor } = this.editors;
        const uri = currentEditor && currentEditor.getResourceUri();
        return uri && this.models.get(uri.toString());
    }
    getLogpoint(position) {
        const logpoint = this.anyBreakpoint(position);
        return logpoint && logpoint.logMessage ? logpoint : undefined;
    }
    getLogpointEnabled(position) {
        const logpoint = this.getLogpoint(position);
        return logpoint && logpoint.enabled;
    }
    getBreakpoint(position) {
        const breakpoint = this.anyBreakpoint(position);
        return breakpoint && breakpoint.logMessage ? undefined : breakpoint;
    }
    getBreakpointEnabled(position) {
        const breakpoint = this.getBreakpoint(position);
        return breakpoint && breakpoint.enabled;
    }
    anyBreakpoint(position) {
        return this.model && this.model.getBreakpoint(position);
    }
    getInlineBreakpoint(position) {
        return this.model && this.model.getInlineBreakpoint(position);
    }
    toggleBreakpoint(position) {
        const { model } = this;
        if (model) {
            model.toggleBreakpoint(position);
        }
    }
    setBreakpointEnabled(position, enabled) {
        const breakpoint = this.anyBreakpoint(position);
        if (breakpoint) {
            breakpoint.setEnabled(enabled);
        }
    }
    addInlineBreakpoint() {
        const { model } = this;
        if (model) {
            model.addInlineBreakpoint();
        }
    }
    showHover() {
        const { model } = this;
        if (model) {
            const selection = model.editor.getControl().getSelection();
            model.hover.show({ selection, focus: true });
        }
    }
    canShowHover() {
        const { model } = this;
        if (model) {
            const selection = model.editor.getControl().getSelection();
            return !!model.editor.getControl().getModel().getWordAtPosition(selection.getStartPosition());
        }
        return false;
    }
    addBreakpoint(context, position) {
        const { model } = this;
        if (model) {
            position = position || model.position;
            const breakpoint = model.getBreakpoint(position);
            if (breakpoint) {
                model.breakpointWidget.show({ breakpoint, context });
            }
            else {
                model.breakpointWidget.show({
                    position,
                    context
                });
            }
        }
    }
    async editBreakpoint(breakpointOrPosition) {
        if (breakpointOrPosition instanceof monaco.Position) {
            breakpointOrPosition = this.anyBreakpoint(breakpointOrPosition);
        }
        if (breakpointOrPosition) {
            await breakpointOrPosition.open();
            const model = this.models.get(breakpointOrPosition.uri.toString());
            if (model) {
                model.breakpointWidget.show(breakpointOrPosition);
            }
        }
    }
    closeBreakpoint() {
        const { model } = this;
        if (model) {
            model.breakpointWidget.hide();
        }
    }
    acceptBreakpoint() {
        const { model } = this;
        if (model) {
            model.acceptBreakpoint();
        }
    }
    closeBreakpointIfAffected({ uri, removed }) {
        const model = this.models.get(uri.toString());
        if (!model) {
            return;
        }
        const position = model.breakpointWidget.position;
        if (!position) {
            return;
        }
        for (const breakpoint of removed) {
            if (breakpoint.raw.line === position.lineNumber) {
                model.breakpointWidget.hide();
            }
        }
    }
};
__decorate([
    (0, inversify_1.inject)(browser_1.EditorManager),
    __metadata("design:type", browser_1.EditorManager)
], DebugEditorService.prototype, "editors", void 0);
__decorate([
    (0, inversify_1.inject)(breakpoint_manager_1.BreakpointManager),
    __metadata("design:type", breakpoint_manager_1.BreakpointManager)
], DebugEditorService.prototype, "breakpoints", void 0);
__decorate([
    (0, inversify_1.inject)(debug_session_manager_1.DebugSessionManager),
    __metadata("design:type", debug_session_manager_1.DebugSessionManager)
], DebugEditorService.prototype, "sessionManager", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.ContextMenuRenderer),
    __metadata("design:type", browser_2.ContextMenuRenderer)
], DebugEditorService.prototype, "contextMenu", void 0);
__decorate([
    (0, inversify_1.inject)(debug_editor_model_1.DebugEditorModelFactory),
    __metadata("design:type", Function)
], DebugEditorService.prototype, "factory", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DebugEditorService.prototype, "init", null);
DebugEditorService = __decorate([
    (0, inversify_1.injectable)()
], DebugEditorService);
exports.DebugEditorService = DebugEditorService;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/debug/lib/browser/editor/debug-editor-service'] = this;


/***/ }),

/***/ "../../packages/debug/lib/browser/editor/debug-editor.js":
/*!***************************************************************!*\
  !*** ../../packages/debug/lib/browser/editor/debug-editor.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, exports) {


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
exports.DebugEditor = void 0;
exports.DebugEditor = Symbol('DebugEditor');

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/debug/lib/browser/editor/debug-editor'] = this;


/***/ }),

/***/ "../../packages/debug/lib/browser/editor/debug-exception-widget.js":
/*!*************************************************************************!*\
  !*** ../../packages/debug/lib/browser/editor/debug-exception-widget.js ***!
  \*************************************************************************/
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
exports.DebugExceptionWidget = exports.DebugExceptionMonacoEditorZoneWidget = void 0;
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const client_1 = __webpack_require__(/*! @theia/core/shared/react-dom/client */ "../../packages/core/shared/react-dom/client/index.js");
const monaco = __webpack_require__(/*! @theia/monaco-editor-core */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/editor.main.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
const monaco_editor_zone_widget_1 = __webpack_require__(/*! @theia/monaco/lib/browser/monaco-editor-zone-widget */ "../../packages/monaco/lib/browser/monaco-editor-zone-widget.js");
const debug_editor_1 = __webpack_require__(/*! ./debug-editor */ "../../packages/debug/lib/browser/editor/debug-editor.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
const widgets_1 = __webpack_require__(/*! @theia/core/lib/browser/widgets */ "../../packages/core/lib/browser/widgets/index.js");
class DebugExceptionMonacoEditorZoneWidget extends monaco_editor_zone_widget_1.MonacoEditorZoneWidget {
    computeContainerHeight(zoneHeight) {
        // reset height to match it to the content
        this.containerNode.style.height = 'initial';
        const height = this.containerNode.offsetHeight;
        const result = super.computeContainerHeight(zoneHeight);
        result.height = height;
        return result;
    }
}
exports.DebugExceptionMonacoEditorZoneWidget = DebugExceptionMonacoEditorZoneWidget;
let DebugExceptionWidget = class DebugExceptionWidget {
    constructor() {
        this.toDispose = new disposable_1.DisposableCollection();
    }
    init() {
        this.doInit();
    }
    async doInit() {
        this.toDispose.push(this.zone = new DebugExceptionMonacoEditorZoneWidget(this.editor.getControl()));
        this.zone.containerNode.classList.add('theia-debug-exception-widget');
        this.containerNodeRoot = (0, client_1.createRoot)(this.zone.containerNode);
        this.toDispose.push(disposable_1.Disposable.create(() => this.containerNodeRoot.unmount()));
        this.toDispose.push(this.editor.getControl().onDidLayoutChange(() => this.layout()));
    }
    dispose() {
        this.toDispose.dispose();
    }
    show({ info, lineNumber, column }) {
        this.render(info, () => {
            const fontInfo = this.editor.getControl().getOption(monaco.editor.EditorOption.fontInfo);
            this.zone.containerNode.style.fontSize = `${fontInfo.fontSize}px`;
            this.zone.containerNode.style.lineHeight = `${fontInfo.lineHeight}px`;
            if (lineNumber !== undefined && column !== undefined) {
                const afterLineNumber = lineNumber;
                const afterColumn = column;
                this.zone.show({ showFrame: true, afterLineNumber, afterColumn, heightInLines: 0, frameWidth: 1 });
            }
            this.layout();
        });
    }
    hide() {
        this.zone.hide();
    }
    render(info, cb) {
        const stackTrace = info.details && info.details.stackTrace;
        const exceptionTitle = info.id ?
            nls_1.nls.localizeByDefault('Exception has occurred: {0}', info.id) :
            nls_1.nls.localizeByDefault('Exception has occurred.');
        this.containerNodeRoot.render(React.createElement(React.Fragment, null,
            React.createElement("div", { className: 'title', ref: cb },
                exceptionTitle,
                React.createElement("span", { id: "exception-close", className: (0, widgets_1.codicon)('close', true), onClick: () => this.hide(), title: nls_1.nls.localizeByDefault('Close') })),
            info.description && React.createElement("div", { className: 'description' }, info.description),
            stackTrace && React.createElement("div", { className: 'stack-trace' }, stackTrace)));
    }
    layout() {
        // reset height to match it to the content
        this.zone.containerNode.style.height = 'initial';
        const lineHeight = this.editor.getControl().getOption(monaco.editor.EditorOption.lineHeight);
        const heightInLines = Math.ceil(this.zone.containerNode.offsetHeight / lineHeight);
        this.zone.layout(heightInLines);
    }
};
__decorate([
    (0, inversify_1.inject)(debug_editor_1.DebugEditor),
    __metadata("design:type", Object)
], DebugExceptionWidget.prototype, "editor", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DebugExceptionWidget.prototype, "init", null);
DebugExceptionWidget = __decorate([
    (0, inversify_1.injectable)()
], DebugExceptionWidget);
exports.DebugExceptionWidget = DebugExceptionWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/debug/lib/browser/editor/debug-exception-widget'] = this;


/***/ }),

/***/ "../../packages/debug/lib/browser/editor/debug-expression-provider.js":
/*!****************************************************************************!*\
  !*** ../../packages/debug/lib/browser/editor/debug-expression-provider.js ***!
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
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation and others. All rights reserved.
 *  Licensed under the MIT License. See https://github.com/Microsoft/vscode/blob/master/LICENSE.txt for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DebugExpressionProvider = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
/**
 * TODO: introduce a new request to LSP to look up an expression range: https://github.com/Microsoft/language-server-protocol/issues/462
 */
let DebugExpressionProvider = class DebugExpressionProvider {
    get(model, selection) {
        const lineContent = model.getLineContent(selection.startLineNumber);
        const { start, end } = this.getExactExpressionStartAndEnd(lineContent, selection.startColumn, selection.endColumn);
        return lineContent.substring(start - 1, end);
    }
    getExactExpressionStartAndEnd(lineContent, looseStart, looseEnd) {
        let matchingExpression = undefined;
        let startOffset = 0;
        // Some example supported expressions: myVar.prop, a.b.c.d, myVar?.prop, myVar->prop, MyClass::StaticProp, *myVar
        // Match any character except a set of characters which often break interesting sub-expressions
        const expression = /([^()\[\]{}<>\s+\-/%~#^;=|,`!]|\->)+/g;
        // eslint-disable-next-line no-null/no-null
        let result = null;
        // First find the full expression under the cursor
        while (result = expression.exec(lineContent)) {
            const start = result.index + 1;
            const end = start + result[0].length;
            if (start <= looseStart && end >= looseEnd) {
                matchingExpression = result[0];
                startOffset = start;
                break;
            }
        }
        // If there are non-word characters after the cursor, we want to truncate the expression then.
        // For example in expression 'a.b.c.d', if the focus was under 'b', 'a.b' would be evaluated.
        if (matchingExpression) {
            const subExpression = /\w+/g;
            // eslint-disable-next-line no-null/no-null
            let subExpressionResult = null;
            while (subExpressionResult = subExpression.exec(matchingExpression)) {
                const subEnd = subExpressionResult.index + 1 + startOffset + subExpressionResult[0].length;
                if (subEnd >= looseEnd) {
                    break;
                }
            }
            if (subExpressionResult) {
                matchingExpression = matchingExpression.substring(0, subExpression.lastIndex);
            }
        }
        return matchingExpression ?
            { start: startOffset, end: startOffset + matchingExpression.length - 1 } :
            { start: 0, end: 0 };
    }
};
DebugExpressionProvider = __decorate([
    (0, inversify_1.injectable)()
], DebugExpressionProvider);
exports.DebugExpressionProvider = DebugExpressionProvider;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/debug/lib/browser/editor/debug-expression-provider'] = this;


/***/ }),

/***/ "../../packages/debug/lib/browser/editor/debug-hover-source.js":
/*!*********************************************************************!*\
  !*** ../../packages/debug/lib/browser/editor/debug-hover-source.js ***!
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
exports.DebugHoverSource = void 0;
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const source_tree_1 = __webpack_require__(/*! @theia/core/lib/browser/source-tree */ "../../packages/core/lib/browser/source-tree/index.js");
const debug_console_items_1 = __webpack_require__(/*! ../console/debug-console-items */ "../../packages/debug/lib/browser/console/debug-console-items.js");
const debug_session_manager_1 = __webpack_require__(/*! ../debug-session-manager */ "../../packages/debug/lib/browser/debug-session-manager.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
let DebugHoverSource = class DebugHoverSource extends source_tree_1.TreeSource {
    constructor() {
        super(...arguments);
        this.elements = [];
    }
    get expression() {
        return this._expression;
    }
    getElements() {
        return this.elements[Symbol.iterator]();
    }
    renderTitle(element) {
        return React.createElement("div", { className: 'theia-debug-hover-title', title: element.value }, element.value);
    }
    reset() {
        this._expression = undefined;
        this.elements = [];
        this.fireDidChange();
    }
    async evaluate(expression) {
        const evaluated = await this.doEvaluate(expression);
        const elements = evaluated && await evaluated.getElements();
        this._expression = evaluated;
        this.elements = elements ? [...elements] : [];
        this.fireDidChange();
        return evaluated;
    }
    async doEvaluate(expression) {
        const { currentSession } = this.sessions;
        if (!currentSession) {
            return undefined;
        }
        if (currentSession.capabilities.supportsEvaluateForHovers) {
            const item = new debug_console_items_1.ExpressionItem(expression, () => currentSession);
            await item.evaluate('hover');
            return item.available && item || undefined;
        }
        return this.findVariable(expression.split('.').map(word => word.trim()).filter(word => !!word));
    }
    async findVariable(namesToFind) {
        const { currentFrame } = this.sessions;
        if (!currentFrame) {
            return undefined;
        }
        let variable;
        const scopes = await currentFrame.getScopes();
        for (const scope of scopes) {
            const found = await this.doFindVariable(scope, namesToFind);
            if (!variable) {
                variable = found;
            }
            else if (found && found.value !== variable.value) {
                // only show if all expressions found have the same value
                return undefined;
            }
        }
        return variable;
    }
    async doFindVariable(owner, namesToFind) {
        const elements = await owner.getElements();
        const variables = [];
        for (const element of elements) {
            if (element instanceof debug_console_items_1.DebugVariable && element.name === namesToFind[0]) {
                variables.push(element);
            }
        }
        if (variables.length !== 1) {
            return undefined;
        }
        if (namesToFind.length === 1) {
            return variables[0];
        }
        else {
            return this.doFindVariable(variables[0], namesToFind.slice(1));
        }
    }
};
__decorate([
    (0, inversify_1.inject)(debug_session_manager_1.DebugSessionManager),
    __metadata("design:type", debug_session_manager_1.DebugSessionManager)
], DebugHoverSource.prototype, "sessions", void 0);
DebugHoverSource = __decorate([
    (0, inversify_1.injectable)()
], DebugHoverSource);
exports.DebugHoverSource = DebugHoverSource;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/debug/lib/browser/editor/debug-hover-source'] = this;


/***/ }),

/***/ "../../packages/debug/lib/browser/editor/debug-hover-widget.js":
/*!*********************************************************************!*\
  !*** ../../packages/debug/lib/browser/editor/debug-hover-widget.js ***!
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var DebugHoverWidget_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DebugHoverWidget = exports.createDebugHoverWidgetContainer = void 0;
const debounce = __webpack_require__(/*! @theia/core/shared/lodash.debounce */ "../../packages/core/shared/lodash.debounce/index.js");
const widgets_1 = __webpack_require__(/*! @theia/core/shared/@phosphor/widgets */ "../../packages/core/shared/@phosphor/widgets/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const source_tree_1 = __webpack_require__(/*! @theia/core/lib/browser/source-tree */ "../../packages/core/lib/browser/source-tree/index.js");
const disposable_1 = __webpack_require__(/*! @theia/core/lib/common/disposable */ "../../packages/core/lib/common/disposable.js");
const debug_session_manager_1 = __webpack_require__(/*! ../debug-session-manager */ "../../packages/debug/lib/browser/debug-session-manager.js");
const debug_editor_1 = __webpack_require__(/*! ./debug-editor */ "../../packages/debug/lib/browser/editor/debug-editor.js");
const debug_expression_provider_1 = __webpack_require__(/*! ./debug-expression-provider */ "../../packages/debug/lib/browser/editor/debug-expression-provider.js");
const debug_hover_source_1 = __webpack_require__(/*! ./debug-hover-source */ "../../packages/debug/lib/browser/editor/debug-hover-source.js");
const debug_console_items_1 = __webpack_require__(/*! ../console/debug-console-items */ "../../packages/debug/lib/browser/console/debug-console-items.js");
const monaco = __webpack_require__(/*! @theia/monaco-editor-core */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/editor.main.js");
const standaloneServices_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices.js");
const languageFeatures_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/common/services/languageFeatures */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/common/services/languageFeatures.js");
const cancellation_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/base/common/cancellation */ "../../node_modules/@theia/monaco-editor-core/esm/vs/base/common/cancellation.js");
const position_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/common/core/position */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/common/core/position.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
function createDebugHoverWidgetContainer(parent, editor) {
    const child = source_tree_1.SourceTreeWidget.createContainer(parent, {
        virtualized: false
    });
    child.bind(debug_editor_1.DebugEditor).toConstantValue(editor);
    child.bind(debug_hover_source_1.DebugHoverSource).toSelf();
    child.unbind(source_tree_1.SourceTreeWidget);
    child.bind(debug_expression_provider_1.DebugExpressionProvider).toSelf();
    child.bind(DebugHoverWidget).toSelf();
    return child;
}
exports.createDebugHoverWidgetContainer = createDebugHoverWidgetContainer;
let DebugHoverWidget = DebugHoverWidget_1 = class DebugHoverWidget extends source_tree_1.SourceTreeWidget {
    constructor() {
        super(...arguments);
        this.allowEditorOverflow = true;
        this.domNode = document.createElement('div');
        this.titleNode = document.createElement('div');
        this.contentNode = document.createElement('div');
        this.doSchedule = debounce((fn) => fn(), 300);
    }
    getId() {
        return DebugHoverWidget_1.ID;
    }
    getDomNode() {
        return this.domNode;
    }
    init() {
        super.init();
        this.domNode.className = 'theia-debug-hover';
        this.titleNode.className = 'theia-debug-hover-title';
        this.domNode.appendChild(this.titleNode);
        this.contentNode.className = 'theia-debug-hover-content';
        this.domNode.appendChild(this.contentNode);
        // for stopping scroll events from contentNode going to the editor
        this.contentNode.addEventListener('wheel', e => e.stopPropagation());
        this.editor.getControl().addContentWidget(this);
        this.source = this.hoverSource;
        this.toDispose.pushAll([
            this.hoverSource,
            disposable_1.Disposable.create(() => this.editor.getControl().removeContentWidget(this)),
            disposable_1.Disposable.create(() => this.hide()),
            this.sessions.onDidChange(() => {
                if (!this.isEditorFrame()) {
                    this.hide();
                }
            })
        ]);
    }
    dispose() {
        this.toDispose.dispose();
    }
    show(options) {
        this.schedule(() => this.doShow(options), options && options.immediate);
    }
    hide(options) {
        this.schedule(() => this.doHide(), options && options.immediate);
    }
    schedule(fn, immediate = true) {
        if (immediate) {
            this.doSchedule.cancel();
            fn();
        }
        else {
            this.doSchedule(fn);
        }
    }
    doHide() {
        if (!this.isVisible) {
            return;
        }
        if (this.domNode.contains(document.activeElement)) {
            this.editor.getControl().focus();
        }
        if (this.isAttached) {
            widgets_1.Widget.detach(this);
        }
        this.hoverSource.reset();
        super.hide();
        this.options = undefined;
        this.editor.getControl().layoutContentWidget(this);
    }
    async doShow(options = this.options) {
        const cancellationSource = new cancellation_1.CancellationTokenSource();
        if (!this.isEditorFrame()) {
            this.hide();
            return;
        }
        if (!options) {
            this.hide();
            return;
        }
        if (this.options && this.options.selection.equalsRange(options.selection)) {
            return;
        }
        if (!this.isAttached) {
            widgets_1.Widget.attach(this, this.contentNode);
        }
        this.options = options;
        let matchingExpression;
        const pluginExpressionProvider = standaloneServices_1.StandaloneServices.get(languageFeatures_1.ILanguageFeaturesService).evaluatableExpressionProvider;
        const textEditorModel = this.editor.document.textEditorModel;
        if (pluginExpressionProvider && pluginExpressionProvider.has(textEditorModel)) {
            const registeredProviders = pluginExpressionProvider.ordered(textEditorModel);
            const position = new position_1.Position(this.options.selection.startLineNumber, this.options.selection.startColumn);
            const promises = registeredProviders.map(support => Promise.resolve(support.provideEvaluatableExpression(textEditorModel, position, cancellationSource.token)));
            const results = await Promise.all(promises).then(core_1.ArrayUtils.coalesce);
            if (results.length > 0) {
                matchingExpression = results[0].expression;
                const range = results[0].range;
                if (!matchingExpression) {
                    const lineContent = textEditorModel.getLineContent(position.lineNumber);
                    matchingExpression = lineContent.substring(range.startColumn - 1, range.endColumn - 1);
                }
            }
        }
        else { // use fallback if no provider was registered
            matchingExpression = this.expressionProvider.get(this.editor.getControl().getModel(), options.selection);
        }
        if (!matchingExpression) {
            this.hide();
            return;
        }
        const toFocus = new disposable_1.DisposableCollection();
        if (this.options.focus === true) {
            toFocus.push(this.model.onNodeRefreshed(() => {
                toFocus.dispose();
                this.activate();
            }));
        }
        const expression = await this.hoverSource.evaluate(matchingExpression);
        if (!expression) {
            toFocus.dispose();
            this.hide();
            return;
        }
        this.contentNode.hidden = false;
        ['number', 'boolean', 'string'].forEach(token => this.titleNode.classList.remove(token));
        this.domNode.classList.remove('complex-value');
        if (expression.hasElements) {
            this.domNode.classList.add('complex-value');
        }
        else {
            this.contentNode.hidden = true;
            if (expression.type === 'number' || expression.type === 'boolean' || expression.type === 'string') {
                this.titleNode.classList.add(expression.type);
            }
            else if (!isNaN(+expression.value)) {
                this.titleNode.classList.add('number');
            }
            else if (debug_console_items_1.DebugVariable.booleanRegex.test(expression.value)) {
                this.titleNode.classList.add('boolean');
            }
            else if (debug_console_items_1.DebugVariable.stringRegex.test(expression.value)) {
                this.titleNode.classList.add('string');
            }
        }
        super.show();
        await new Promise(resolve => {
            setTimeout(() => window.requestAnimationFrame(() => {
                this.editor.getControl().layoutContentWidget(this);
                resolve();
            }), 0);
        });
    }
    isEditorFrame() {
        return this.sessions.isCurrentEditorFrame(this.editor.getControl().getModel().uri);
    }
    getPosition() {
        if (!this.isVisible) {
            return undefined;
        }
        const position = this.options && this.options.selection.getStartPosition();
        return position
            ? {
                position: new monaco.Position(position.lineNumber, position.column),
                preference: [
                    monaco.editor.ContentWidgetPositionPreference.ABOVE,
                    monaco.editor.ContentWidgetPositionPreference.BELOW,
                ],
            }
            : undefined;
    }
    onUpdateRequest(msg) {
        super.onUpdateRequest(msg);
        const { expression } = this.hoverSource;
        const value = expression && expression.value || '';
        this.titleNode.textContent = value;
        this.titleNode.title = value;
    }
    onAfterAttach(msg) {
        super.onAfterAttach(msg);
        this.addKeyListener(this.domNode, browser_1.Key.ESCAPE, () => this.hide());
    }
};
DebugHoverWidget.ID = 'debug.editor.hover';
__decorate([
    (0, inversify_1.inject)(debug_editor_1.DebugEditor),
    __metadata("design:type", Object)
], DebugHoverWidget.prototype, "editor", void 0);
__decorate([
    (0, inversify_1.inject)(debug_session_manager_1.DebugSessionManager),
    __metadata("design:type", debug_session_manager_1.DebugSessionManager)
], DebugHoverWidget.prototype, "sessions", void 0);
__decorate([
    (0, inversify_1.inject)(debug_hover_source_1.DebugHoverSource),
    __metadata("design:type", debug_hover_source_1.DebugHoverSource)
], DebugHoverWidget.prototype, "hoverSource", void 0);
__decorate([
    (0, inversify_1.inject)(debug_expression_provider_1.DebugExpressionProvider),
    __metadata("design:type", debug_expression_provider_1.DebugExpressionProvider)
], DebugHoverWidget.prototype, "expressionProvider", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DebugHoverWidget.prototype, "init", null);
DebugHoverWidget = DebugHoverWidget_1 = __decorate([
    (0, inversify_1.injectable)()
], DebugHoverWidget);
exports.DebugHoverWidget = DebugHoverWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/debug/lib/browser/editor/debug-hover-widget'] = this;


/***/ }),

/***/ "../../packages/debug/lib/browser/editor/debug-inline-value-decorator.js":
/*!*******************************************************************************!*\
  !*** ../../packages/debug/lib/browser/editor/debug-inline-value-decorator.js ***!
  \*******************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// *****************************************************************************
// Copyright (C) 2020 TypeFox and others.
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
exports.DebugInlineValueDecorator = exports.INLINE_VALUE_DECORATION_KEY = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const monaco = __webpack_require__(/*! @theia/monaco-editor-core */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/editor.main.js");
const cancellation_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/base/common/cancellation */ "../../node_modules/@theia/monaco-editor-core/esm/vs/base/common/cancellation.js");
const wordHelper_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/common/core/wordHelper */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/common/core/wordHelper.js");
const languageFeatures_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/common/services/languageFeatures */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/common/services/languageFeatures.js");
const standaloneServices_1 = __webpack_require__(/*! @theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices */ "../../node_modules/@theia/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneServices.js");
const monaco_editor_service_1 = __webpack_require__(/*! @theia/monaco/lib/browser/monaco-editor-service */ "../../packages/monaco/lib/browser/monaco-editor-service.js");
const debug_console_items_1 = __webpack_require__(/*! ../console/debug-console-items */ "../../packages/debug/lib/browser/console/debug-console-items.js");
const debug_preferences_1 = __webpack_require__(/*! ../debug-preferences */ "../../packages/debug/lib/browser/debug-preferences.js");
// https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/workbench/contrib/debug/browser/debugEditorContribution.ts#L40-L43
exports.INLINE_VALUE_DECORATION_KEY = 'inlinevaluedecoration';
const MAX_NUM_INLINE_VALUES = 100; // JS Global scope can have 700+ entries. We want to limit ourselves for perf reasons
const MAX_INLINE_DECORATOR_LENGTH = 150; // Max string length of each inline decorator when debugging. If exceeded ... is added
const MAX_TOKENIZATION_LINE_LEN = 500; // If line is too long, then inline values for the line are skipped
/**
 * MAX SMI (SMall Integer) as defined in v8.
 * one bit is lost for boxing/unboxing flag.
 * one bit is lost for sign flag.
 * See https://thibaultlaurens.github.io/javascript/2013/04/29/how-the-v8-engine-works/#tagged-values
 */
// https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/base/common/uint.ts#L7-L13
const MAX_SAFE_SMALL_INTEGER = 1 << 30;
class InlineSegment {
    constructor(column, text) {
        this.column = column;
        this.text = text;
    }
}
let DebugInlineValueDecorator = class DebugInlineValueDecorator {
    constructor() {
        this.enabled = false;
        this.wordToLineNumbersMap = new Map();
    }
    onStart() {
        this.editorService.registerDecorationType('Inline debug decorations', exports.INLINE_VALUE_DECORATION_KEY, {});
        this.enabled = !!this.preferences['debug.inlineValues'];
        this.preferences.onPreferenceChanged(({ preferenceName, newValue }) => {
            if (preferenceName === 'debug.inlineValues' && !!newValue !== this.enabled) {
                this.enabled = !!newValue;
            }
        });
    }
    async calculateDecorations(debugEditorModel, stackFrame) {
        this.wordToLineNumbersMap = undefined;
        const model = debugEditorModel.editor.getControl().getModel() || undefined;
        return this.updateInlineValueDecorations(debugEditorModel, model, stackFrame);
    }
    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/workbench/contrib/debug/browser/debugEditorContribution.ts#L382-L408
    async updateInlineValueDecorations(debugEditorModel, model, stackFrame) {
        if (!this.enabled || !model || !stackFrame || !stackFrame.source || model.uri.toString() !== stackFrame.source.uri.toString()) {
            return [];
        }
        // XXX: Here is a difference between the VS Code's `IStackFrame` and the `DebugProtocol.StackFrame`.
        // In DAP, `source` is optional, hence `range` is optional too.
        const { range: stackFrameRange } = stackFrame;
        if (!stackFrameRange) {
            return [];
        }
        const scopes = await stackFrame.getMostSpecificScopes(stackFrameRange);
        // Get all top level children in the scope chain
        const decorationsPerScope = await Promise.all(scopes.map(async (scope) => {
            const children = Array.from(await scope.getElements());
            let range = new monaco.Range(0, 0, stackFrameRange.startLineNumber, stackFrameRange.startColumn);
            if (scope.range) {
                range = range.setStartPosition(scope.range.startLineNumber, scope.range.startColumn);
            }
            return this.createInlineValueDecorationsInsideRange(children, range, model, debugEditorModel, stackFrame);
        }));
        return decorationsPerScope.reduce((previous, current) => previous.concat(current), []);
    }
    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/workbench/contrib/debug/browser/debugEditorContribution.ts#L410-L452
    async createInlineValueDecorationsInsideRange(expressions, range, model, debugEditorModel, stackFrame) {
        const decorations = [];
        const inlineValuesProvider = standaloneServices_1.StandaloneServices.get(languageFeatures_1.ILanguageFeaturesService).inlineValuesProvider;
        const textEditorModel = debugEditorModel.editor.document.textEditorModel;
        if (inlineValuesProvider && inlineValuesProvider.has(textEditorModel)) {
            const findVariable = async (variableName, caseSensitiveLookup) => {
                const scopes = await stackFrame.getMostSpecificScopes(stackFrame.range);
                const key = caseSensitiveLookup ? variableName : variableName.toLowerCase();
                for (const scope of scopes) {
                    const expressionContainers = await scope.getElements();
                    let container = expressionContainers.next();
                    while (!container.done) {
                        const debugVariable = container.value;
                        if (debugVariable && debugVariable instanceof debug_console_items_1.DebugVariable) {
                            if (caseSensitiveLookup) {
                                if (debugVariable.name === key) {
                                    return debugVariable;
                                }
                            }
                            else {
                                if (debugVariable.name.toLowerCase() === key) {
                                    return debugVariable;
                                }
                            }
                        }
                        container = expressionContainers.next();
                    }
                }
                return undefined;
            };
            const context = {
                frameId: stackFrame.raw.id,
                stoppedLocation: range
            };
            const cancellationToken = new cancellation_1.CancellationTokenSource().token;
            const registeredProviders = inlineValuesProvider.ordered(textEditorModel).reverse();
            const visibleRanges = debugEditorModel.editor.getControl().getVisibleRanges();
            const lineDecorations = new Map();
            for (const provider of registeredProviders) {
                for (const visibleRange of visibleRanges) {
                    const result = await provider.provideInlineValues(textEditorModel, visibleRange, context, cancellationToken);
                    if (result) {
                        for (const inlineValue of result) {
                            let text = undefined;
                            switch (inlineValue.type) {
                                case 'text':
                                    text = inlineValue.text;
                                    break;
                                case 'variable': {
                                    let varName = inlineValue.variableName;
                                    if (!varName) {
                                        const lineContent = model.getLineContent(inlineValue.range.startLineNumber);
                                        varName = lineContent.substring(inlineValue.range.startColumn - 1, inlineValue.range.endColumn - 1);
                                    }
                                    const variable = await findVariable(varName, inlineValue.caseSensitiveLookup);
                                    if (variable) {
                                        text = this.formatInlineValue(varName, variable.value);
                                    }
                                    break;
                                }
                                case 'expression': {
                                    let expr = inlineValue.expression;
                                    if (!expr) {
                                        const lineContent = model.getLineContent(inlineValue.range.startLineNumber);
                                        expr = lineContent.substring(inlineValue.range.startColumn - 1, inlineValue.range.endColumn - 1);
                                    }
                                    if (expr) {
                                        const expression = new debug_console_items_1.ExpressionItem(expr, () => stackFrame.thread.session);
                                        await expression.evaluate('watch');
                                        if (expression.available) {
                                            text = this.formatInlineValue(expr, expression.value);
                                        }
                                    }
                                    break;
                                }
                            }
                            if (text) {
                                const line = inlineValue.range.startLineNumber;
                                let lineSegments = lineDecorations.get(line);
                                if (!lineSegments) {
                                    lineSegments = [];
                                    lineDecorations.set(line, lineSegments);
                                }
                                if (!lineSegments.some(segment => segment.text === text)) {
                                    lineSegments.push(new InlineSegment(inlineValue.range.startColumn, text));
                                }
                            }
                        }
                    }
                }
            }
            ;
            // sort line segments and concatenate them into a decoration
            const separator = ', ';
            lineDecorations.forEach((segments, line) => {
                if (segments.length > 0) {
                    segments = segments.sort((a, b) => a.column - b.column);
                    const text = segments.map(s => s.text).join(separator);
                    decorations.push(this.createInlineValueDecoration(line, text));
                }
            });
        }
        else { // use fallback if no provider was registered
            const lineToNamesMap = new Map();
            const nameValueMap = new Map();
            for (const expr of expressions) {
                if (expr instanceof debug_console_items_1.DebugVariable) { // XXX: VS Code uses `IExpression` that has `name` and `value`.
                    nameValueMap.set(expr.name, expr.value);
                }
                // Limit the size of map. Too large can have a perf impact
                if (nameValueMap.size >= MAX_NUM_INLINE_VALUES) {
                    break;
                }
            }
            const wordToPositionsMap = this.getWordToPositionsMap(model);
            // Compute unique set of names on each line
            nameValueMap.forEach((_, name) => {
                const positions = wordToPositionsMap.get(name);
                if (positions) {
                    for (const position of positions) {
                        if (range.containsPosition(position)) {
                            if (!lineToNamesMap.has(position.lineNumber)) {
                                lineToNamesMap.set(position.lineNumber, []);
                            }
                            if (lineToNamesMap.get(position.lineNumber).indexOf(name) === -1) {
                                lineToNamesMap.get(position.lineNumber).push(name);
                            }
                        }
                    }
                }
            });
            // Compute decorators for each line
            lineToNamesMap.forEach((names, line) => {
                const contentText = names.sort((first, second) => {
                    const content = model.getLineContent(line);
                    return content.indexOf(first) - content.indexOf(second);
                }).map(name => `${name} = ${nameValueMap.get(name)}`).join(', ');
                decorations.push(this.createInlineValueDecoration(line, contentText));
            });
        }
        return decorations;
    }
    formatInlineValue(...args) {
        const valuePattern = '{0} = {1}';
        const formatRegExp = /{(\d+)}/g;
        if (args.length === 0) {
            return valuePattern;
        }
        return valuePattern.replace(formatRegExp, (match, group) => {
            const idx = parseInt(group, 10);
            return isNaN(idx) || idx < 0 || idx >= args.length ?
                match :
                args[idx];
        });
    }
    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/workbench/contrib/debug/browser/debugEditorContribution.ts#L454-L485
    createInlineValueDecoration(lineNumber, contentText) {
        // If decoratorText is too long, trim and add ellipses. This could happen for minified files with everything on a single line
        if (contentText.length > MAX_INLINE_DECORATOR_LENGTH) {
            contentText = contentText.substring(0, MAX_INLINE_DECORATOR_LENGTH) + '...';
        }
        return {
            range: {
                startLineNumber: lineNumber,
                endLineNumber: lineNumber,
                startColumn: MAX_SAFE_SMALL_INTEGER,
                endColumn: MAX_SAFE_SMALL_INTEGER
            },
            renderOptions: {
                after: {
                    contentText,
                    backgroundColor: 'rgba(255, 200, 0, 0.2)',
                    margin: '10px'
                },
                dark: {
                    after: {
                        color: 'rgba(255, 255, 255, 0.5)',
                    }
                },
                light: {
                    after: {
                        color: 'rgba(0, 0, 0, 0.5)',
                    }
                }
            }
        };
    }
    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/workbench/contrib/debug/browser/debugEditorContribution.ts#L487-L531
    getWordToPositionsMap(model) {
        model = model;
        if (!this.wordToLineNumbersMap) {
            this.wordToLineNumbersMap = new Map();
            if (!model) {
                return this.wordToLineNumbersMap;
            }
            // For every word in every line, map its ranges for fast lookup
            for (let lineNumber = 1, len = model.getLineCount(); lineNumber <= len; ++lineNumber) {
                const lineContent = model.getLineContent(lineNumber);
                // If line is too long then skip the line
                if (lineContent.length > MAX_TOKENIZATION_LINE_LEN) {
                    continue;
                }
                model.tokenization.forceTokenization(lineNumber);
                const lineTokens = model.tokenization.getLineTokens(lineNumber);
                for (let tokenIndex = 0, tokenCount = lineTokens.getCount(); tokenIndex < tokenCount; tokenIndex++) {
                    const tokenStartOffset = lineTokens.getStartOffset(tokenIndex);
                    const tokenEndOffset = lineTokens.getEndOffset(tokenIndex);
                    const tokenType = lineTokens.getStandardTokenType(tokenIndex);
                    const tokenStr = lineContent.substring(tokenStartOffset, tokenEndOffset);
                    // Token is a word and not a comment
                    if (tokenType === 0 /* Other */) {
                        wordHelper_1.DEFAULT_WORD_REGEXP.lastIndex = 0; // We assume tokens will usually map 1:1 to words if they match
                        const wordMatch = wordHelper_1.DEFAULT_WORD_REGEXP.exec(tokenStr);
                        if (wordMatch) {
                            const word = wordMatch[0];
                            if (!this.wordToLineNumbersMap.has(word)) {
                                this.wordToLineNumbersMap.set(word, []);
                            }
                            this.wordToLineNumbersMap.get(word).push(new monaco.Position(lineNumber, tokenStartOffset));
                        }
                    }
                }
            }
        }
        return this.wordToLineNumbersMap;
    }
};
__decorate([
    (0, inversify_1.inject)(monaco_editor_service_1.MonacoEditorService),
    __metadata("design:type", monaco_editor_service_1.MonacoEditorService)
], DebugInlineValueDecorator.prototype, "editorService", void 0);
__decorate([
    (0, inversify_1.inject)(debug_preferences_1.DebugPreferences),
    __metadata("design:type", Object)
], DebugInlineValueDecorator.prototype, "preferences", void 0);
DebugInlineValueDecorator = __decorate([
    (0, inversify_1.injectable)()
], DebugInlineValueDecorator);
exports.DebugInlineValueDecorator = DebugInlineValueDecorator;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/debug/lib/browser/editor/debug-inline-value-decorator'] = this;


/***/ }),

/***/ "../../packages/debug/lib/browser/view/debug-breakpoints-source.js":
/*!*************************************************************************!*\
  !*** ../../packages/debug/lib/browser/view/debug-breakpoints-source.js ***!
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
exports.DebugBreakpointsSource = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const source_tree_1 = __webpack_require__(/*! @theia/core/lib/browser/source-tree */ "../../packages/core/lib/browser/source-tree/index.js");
const debug_view_model_1 = __webpack_require__(/*! ./debug-view-model */ "../../packages/debug/lib/browser/view/debug-view-model.js");
const breakpoint_manager_1 = __webpack_require__(/*! ../breakpoint/breakpoint-manager */ "../../packages/debug/lib/browser/breakpoint/breakpoint-manager.js");
const debug_exception_breakpoint_1 = __webpack_require__(/*! ./debug-exception-breakpoint */ "../../packages/debug/lib/browser/view/debug-exception-breakpoint.js");
let DebugBreakpointsSource = class DebugBreakpointsSource extends source_tree_1.TreeSource {
    init() {
        this.fireDidChange();
        this.toDispose.push(this.model.onDidChangeBreakpoints(() => this.fireDidChange()));
    }
    *getElements() {
        for (const exceptionBreakpoint of this.breakpoints.getExceptionBreakpoints()) {
            yield new debug_exception_breakpoint_1.DebugExceptionBreakpoint(exceptionBreakpoint, this.breakpoints);
        }
        for (const functionBreakpoint of this.model.functionBreakpoints) {
            yield functionBreakpoint;
        }
        for (const instructionBreakpoint of this.model.instructionBreakpoints) {
            yield instructionBreakpoint;
        }
        for (const breakpoint of this.model.breakpoints) {
            yield breakpoint;
        }
    }
};
__decorate([
    (0, inversify_1.inject)(debug_view_model_1.DebugViewModel),
    __metadata("design:type", debug_view_model_1.DebugViewModel)
], DebugBreakpointsSource.prototype, "model", void 0);
__decorate([
    (0, inversify_1.inject)(breakpoint_manager_1.BreakpointManager),
    __metadata("design:type", breakpoint_manager_1.BreakpointManager)
], DebugBreakpointsSource.prototype, "breakpoints", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DebugBreakpointsSource.prototype, "init", null);
DebugBreakpointsSource = __decorate([
    (0, inversify_1.injectable)()
], DebugBreakpointsSource);
exports.DebugBreakpointsSource = DebugBreakpointsSource;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/debug/lib/browser/view/debug-breakpoints-source'] = this;


/***/ }),

/***/ "../../packages/debug/lib/browser/view/debug-breakpoints-widget.js":
/*!*************************************************************************!*\
  !*** ../../packages/debug/lib/browser/view/debug-breakpoints-widget.js ***!
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
var DebugBreakpointsWidget_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DebugBreakpointsWidget = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const source_tree_1 = __webpack_require__(/*! @theia/core/lib/browser/source-tree */ "../../packages/core/lib/browser/source-tree/index.js");
const debug_breakpoints_source_1 = __webpack_require__(/*! ./debug-breakpoints-source */ "../../packages/debug/lib/browser/view/debug-breakpoints-source.js");
const breakpoint_manager_1 = __webpack_require__(/*! ../breakpoint/breakpoint-manager */ "../../packages/debug/lib/browser/breakpoint/breakpoint-manager.js");
const debug_view_model_1 = __webpack_require__(/*! ./debug-view-model */ "../../packages/debug/lib/browser/view/debug-view-model.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
let DebugBreakpointsWidget = DebugBreakpointsWidget_1 = class DebugBreakpointsWidget extends source_tree_1.SourceTreeWidget {
    static createContainer(parent) {
        const child = source_tree_1.SourceTreeWidget.createContainer(parent, {
            contextMenuPath: DebugBreakpointsWidget_1.CONTEXT_MENU,
            virtualized: false,
            scrollIfActive: true
        });
        child.bind(debug_breakpoints_source_1.DebugBreakpointsSource).toSelf();
        child.unbind(source_tree_1.SourceTreeWidget);
        child.bind(DebugBreakpointsWidget_1).toSelf();
        return child;
    }
    static createWidget(parent) {
        return DebugBreakpointsWidget_1.createContainer(parent).get(DebugBreakpointsWidget_1);
    }
    init() {
        super.init();
        this.id = DebugBreakpointsWidget_1.FACTORY_ID + ':' + this.viewModel.id;
        this.title.label = nls_1.nls.localizeByDefault('Breakpoints');
        this.toDispose.push(this.breakpointsSource);
        this.source = this.breakpointsSource;
    }
    getDefaultNodeStyle(node, props) {
        return undefined;
    }
};
DebugBreakpointsWidget.CONTEXT_MENU = ['debug-breakpoints-context-menu'];
DebugBreakpointsWidget.EDIT_MENU = [...DebugBreakpointsWidget_1.CONTEXT_MENU, 'a_edit'];
DebugBreakpointsWidget.REMOVE_MENU = [...DebugBreakpointsWidget_1.CONTEXT_MENU, 'b_remove'];
DebugBreakpointsWidget.ENABLE_MENU = [...DebugBreakpointsWidget_1.CONTEXT_MENU, 'c_enable'];
DebugBreakpointsWidget.FACTORY_ID = 'debug:breakpoints';
__decorate([
    (0, inversify_1.inject)(debug_view_model_1.DebugViewModel),
    __metadata("design:type", debug_view_model_1.DebugViewModel)
], DebugBreakpointsWidget.prototype, "viewModel", void 0);
__decorate([
    (0, inversify_1.inject)(breakpoint_manager_1.BreakpointManager),
    __metadata("design:type", breakpoint_manager_1.BreakpointManager)
], DebugBreakpointsWidget.prototype, "breakpoints", void 0);
__decorate([
    (0, inversify_1.inject)(debug_breakpoints_source_1.DebugBreakpointsSource),
    __metadata("design:type", debug_breakpoints_source_1.DebugBreakpointsSource)
], DebugBreakpointsWidget.prototype, "breakpointsSource", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DebugBreakpointsWidget.prototype, "init", null);
DebugBreakpointsWidget = DebugBreakpointsWidget_1 = __decorate([
    (0, inversify_1.injectable)()
], DebugBreakpointsWidget);
exports.DebugBreakpointsWidget = DebugBreakpointsWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/debug/lib/browser/view/debug-breakpoints-widget'] = this;


/***/ }),

/***/ "../../packages/debug/lib/browser/view/debug-configuration-select.js":
/*!***************************************************************************!*\
  !*** ../../packages/debug/lib/browser/view/debug-configuration-select.js ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/********************************************************************************
 * Copyright (C) 2021 Ericsson and others.
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DebugConfigurationSelect = void 0;
const uri_1 = __webpack_require__(/*! @theia/core/lib/common/uri */ "../../packages/core/lib/common/uri.js");
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const debug_session_options_1 = __webpack_require__(/*! ../debug-session-options */ "../../packages/debug/lib/browser/debug-session-options.js");
const select_component_1 = __webpack_require__(/*! @theia/core/lib/browser/widgets/select-component */ "../../packages/core/lib/browser/widgets/select-component.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
class DebugConfigurationSelect extends React.Component {
    constructor(props) {
        super(props);
        this.selectRef = React.createRef();
        this.setCurrentConfiguration = (option) => {
            const value = option.value;
            if (!value) {
                return false;
            }
            else if (value === DebugConfigurationSelect.ADD_CONFIGURATION) {
                setTimeout(() => this.manager.addConfiguration());
            }
            else if (value.startsWith(DebugConfigurationSelect.PICK)) {
                const providerType = this.parsePickValue(value);
                this.selectDynamicConfigFromQuickPick(providerType);
            }
            else {
                const data = JSON.parse(value);
                this.manager.current = data;
                this.refreshDebugConfigurations();
            }
        };
        this.refreshDebugConfigurations = async () => {
            const configsOptionsPerType = await this.manager.provideDynamicDebugConfigurations();
            const providerTypes = [];
            for (const [type, configurationsOptions] of Object.entries(configsOptionsPerType)) {
                if (configurationsOptions.length > 0) {
                    providerTypes.push(type);
                }
            }
            const value = this.currentValue;
            this.selectRef.current.value = value;
            this.setState({ providerTypes, currentValue: value });
        };
        this.manager = props.manager;
        this.quickInputService = props.quickInputService;
        this.state = {
            providerTypes: [],
            currentValue: undefined
        };
        this.manager.onDidChangeConfigurationProviders(() => {
            this.refreshDebugConfigurations();
        });
    }
    componentDidUpdate() {
        var _a;
        // synchronize the currentValue with the selectComponent value
        if (((_a = this.selectRef.current) === null || _a === void 0 ? void 0 : _a.value) !== this.currentValue) {
            this.refreshDebugConfigurations();
        }
    }
    componentDidMount() {
        this.refreshDebugConfigurations();
    }
    render() {
        return React.createElement(select_component_1.SelectComponent, { options: this.renderOptions(), defaultValue: this.state.currentValue, onChange: option => this.setCurrentConfiguration(option), onFocus: () => this.refreshDebugConfigurations(), onBlur: () => this.refreshDebugConfigurations(), ref: this.selectRef });
    }
    get currentValue() {
        const { current } = this.manager;
        const matchingOption = this.getCurrentOption(current);
        return matchingOption ? matchingOption.value : current ? JSON.stringify(current) : DebugConfigurationSelect.NO_CONFIGURATION;
    }
    getCurrentOption(current) {
        if (!current || !this.selectRef.current) {
            return;
        }
        const matchingOption = this.selectRef.current.options.find(option => option.userData === DebugConfigurationSelect.CONFIG_MARKER
            && this.matchesOption(JSON.parse(option.value), current));
        return matchingOption;
    }
    matchesOption(sessionOption, current) {
        const matchesNameAndWorkspace = sessionOption.name === current.name && sessionOption.workspaceFolderUri === current.workspaceFolderUri;
        return debug_session_options_1.DebugSessionOptions.isConfiguration(sessionOption) && debug_session_options_1.DebugSessionOptions.isConfiguration(current)
            ? matchesNameAndWorkspace && sessionOption.providerType === current.providerType
            : matchesNameAndWorkspace;
    }
    toPickValue(providerType) {
        return DebugConfigurationSelect.PICK + providerType;
    }
    parsePickValue(value) {
        return value.slice(DebugConfigurationSelect.PICK.length);
    }
    async resolveDynamicConfigurationPicks(providerType) {
        const configurationsOfProviderType = (await this.manager.provideDynamicDebugConfigurations())[providerType];
        if (!configurationsOfProviderType) {
            return [];
        }
        return configurationsOfProviderType.map(options => ({
            label: options.configuration.name,
            configurationType: options.configuration.type,
            request: options.configuration.request,
            providerType: options.providerType,
            description: this.toBaseName(options.workspaceFolderUri),
            workspaceFolderUri: options.workspaceFolderUri
        }));
    }
    async selectDynamicConfigFromQuickPick(providerType) {
        const picks = await this.resolveDynamicConfigurationPicks(providerType);
        if (picks.length === 0) {
            return;
        }
        const selected = await this.quickInputService.showQuickPick(picks, {
            placeholder: nls_1.nls.localizeByDefault('Select Launch Configuration')
        });
        if (!selected) {
            return;
        }
        const selectedConfiguration = {
            name: selected.label,
            type: selected.configurationType,
            request: selected.request
        };
        this.manager.current = this.manager.find(selectedConfiguration, selected.workspaceFolderUri, selected.providerType);
        this.refreshDebugConfigurations();
    }
    renderOptions() {
        const options = [];
        // Add non dynamic debug configurations
        for (const config of this.manager.all) {
            const value = JSON.stringify(config);
            options.push({
                value,
                label: this.toName(config, this.props.isMultiRoot),
                userData: DebugConfigurationSelect.CONFIG_MARKER
            });
        }
        // Add recently used dynamic debug configurations
        const { recentDynamicOptions } = this.manager;
        if (recentDynamicOptions.length > 0) {
            if (options.length > 0) {
                options.push({
                    separator: true
                });
            }
            for (const dynamicOption of recentDynamicOptions) {
                const value = JSON.stringify(dynamicOption);
                options.push({
                    value,
                    label: this.toName(dynamicOption, this.props.isMultiRoot) + ' (' + dynamicOption.providerType + ')',
                    userData: DebugConfigurationSelect.CONFIG_MARKER
                });
            }
        }
        // Placing a 'No Configuration' entry enables proper functioning of the 'onChange' event, by
        // having an entry to switch from (E.g. a case where only one dynamic configuration type is available)
        if (options.length === 0) {
            const value = DebugConfigurationSelect.NO_CONFIGURATION;
            options.push({
                value,
                label: nls_1.nls.localizeByDefault('No Configurations')
            });
        }
        // Add dynamic configuration types for quick pick selection
        const types = this.state.providerTypes;
        if (types.length > 0) {
            options.push({
                separator: true
            });
            for (const type of types) {
                const value = this.toPickValue(type);
                options.push({
                    value,
                    label: type + '...'
                });
            }
        }
        options.push({
            separator: true
        });
        options.push({
            value: DebugConfigurationSelect.ADD_CONFIGURATION,
            label: nls_1.nls.localizeByDefault('Add Configuration...')
        });
        return options;
    }
    toName(options, multiRoot) {
        var _a, _b;
        const name = (_b = (_a = options.configuration) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : options.name;
        if (!options.workspaceFolderUri || !multiRoot) {
            return name;
        }
        return `${name} (${this.toBaseName(options.workspaceFolderUri)})`;
    }
    toBaseName(uri) {
        return uri ? new uri_1.default(uri).path.base : '';
    }
}
exports.DebugConfigurationSelect = DebugConfigurationSelect;
DebugConfigurationSelect.SEPARATOR = '──────────';
DebugConfigurationSelect.PICK = '__PICK__';
DebugConfigurationSelect.NO_CONFIGURATION = '__NO_CONF__';
DebugConfigurationSelect.ADD_CONFIGURATION = '__ADD_CONF__';
DebugConfigurationSelect.CONFIG_MARKER = '__CONFIG__';

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/debug/lib/browser/view/debug-configuration-select'] = this;


/***/ }),

/***/ "../../packages/debug/lib/browser/view/debug-configuration-widget.js":
/*!***************************************************************************!*\
  !*** ../../packages/debug/lib/browser/view/debug-configuration-widget.js ***!
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DebugConfigurationWidget = void 0;
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const common_1 = __webpack_require__(/*! @theia/core/lib/common */ "../../packages/core/lib/common/index.js");
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const browser_2 = __webpack_require__(/*! @theia/workspace/lib/browser */ "../../packages/workspace/lib/browser/index.js");
const debug_console_contribution_1 = __webpack_require__(/*! ../console/debug-console-contribution */ "../../packages/debug/lib/browser/console/debug-console-contribution.js");
const debug_configuration_manager_1 = __webpack_require__(/*! ../debug-configuration-manager */ "../../packages/debug/lib/browser/debug-configuration-manager.js");
const debug_frontend_application_contribution_1 = __webpack_require__(/*! ../debug-frontend-application-contribution */ "../../packages/debug/lib/browser/debug-frontend-application-contribution.js");
const debug_session_manager_1 = __webpack_require__(/*! ../debug-session-manager */ "../../packages/debug/lib/browser/debug-session-manager.js");
const debug_action_1 = __webpack_require__(/*! ./debug-action */ "../../packages/debug/lib/browser/view/debug-action.js");
const debug_configuration_select_1 = __webpack_require__(/*! ./debug-configuration-select */ "../../packages/debug/lib/browser/view/debug-configuration-select.js");
const debug_view_model_1 = __webpack_require__(/*! ./debug-view-model */ "../../packages/debug/lib/browser/view/debug-view-model.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
let DebugConfigurationWidget = class DebugConfigurationWidget extends browser_1.ReactWidget {
    constructor() {
        super(...arguments);
        this.onRender = new common_1.DisposableCollection();
        this.setStepRef = (stepRef) => {
            this.stepRef = stepRef || undefined;
            this.onRender.dispose();
        };
        this.start = async () => {
            let configuration;
            try {
                configuration = await this.manager.getSelectedConfiguration();
            }
            catch (e) {
                this.messageService.error(e.message);
                return;
            }
            this.commandRegistry.executeCommand(debug_frontend_application_contribution_1.DebugCommands.START.id, configuration);
        };
        this.openConfiguration = () => this.manager.openConfiguration();
        this.openConsole = () => this.debugConsole.openView({
            activate: true
        });
    }
    init() {
        this.addClass('debug-toolbar');
        this.toDispose.push(this.manager.onDidChange(() => this.update()));
        this.toDispose.push(this.workspaceService.onWorkspaceChanged(() => this.update()));
        this.toDispose.push(this.workspaceService.onWorkspaceLocationChanged(() => this.update()));
        this.scrollOptions = undefined;
        this.update();
    }
    focus() {
        if (!this.doFocus()) {
            this.onRender.push(common_1.Disposable.create(() => this.doFocus()));
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
        return React.createElement(React.Fragment, null,
            React.createElement(debug_action_1.DebugAction, { run: this.start, label: nls_1.nls.localizeByDefault('Start Debugging'), iconClass: 'debug-start', ref: this.setStepRef }),
            React.createElement(debug_configuration_select_1.DebugConfigurationSelect, { manager: this.manager, quickInputService: this.quickInputService, isMultiRoot: this.workspaceService.isMultiRootWorkspaceOpened }),
            React.createElement(debug_action_1.DebugAction, { run: this.openConfiguration, label: nls_1.nls.localizeByDefault('Open {0}', '"launch.json"'), iconClass: 'settings-gear' }),
            React.createElement(debug_action_1.DebugAction, { run: this.openConsole, label: nls_1.nls.localizeByDefault('Debug Console'), iconClass: 'terminal' }));
    }
};
__decorate([
    (0, inversify_1.inject)(common_1.CommandRegistry),
    __metadata("design:type", common_1.CommandRegistry)
], DebugConfigurationWidget.prototype, "commandRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(debug_view_model_1.DebugViewModel),
    __metadata("design:type", debug_view_model_1.DebugViewModel)
], DebugConfigurationWidget.prototype, "viewModel", void 0);
__decorate([
    (0, inversify_1.inject)(debug_configuration_manager_1.DebugConfigurationManager),
    __metadata("design:type", debug_configuration_manager_1.DebugConfigurationManager)
], DebugConfigurationWidget.prototype, "manager", void 0);
__decorate([
    (0, inversify_1.inject)(debug_session_manager_1.DebugSessionManager),
    __metadata("design:type", debug_session_manager_1.DebugSessionManager)
], DebugConfigurationWidget.prototype, "sessionManager", void 0);
__decorate([
    (0, inversify_1.inject)(debug_console_contribution_1.DebugConsoleContribution),
    __metadata("design:type", debug_console_contribution_1.DebugConsoleContribution)
], DebugConfigurationWidget.prototype, "debugConsole", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.QuickInputService),
    __metadata("design:type", Object)
], DebugConfigurationWidget.prototype, "quickInputService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.WorkspaceService),
    __metadata("design:type", browser_2.WorkspaceService)
], DebugConfigurationWidget.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.MessageService),
    __metadata("design:type", common_1.MessageService)
], DebugConfigurationWidget.prototype, "messageService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DebugConfigurationWidget.prototype, "init", null);
DebugConfigurationWidget = __decorate([
    (0, inversify_1.injectable)()
], DebugConfigurationWidget);
exports.DebugConfigurationWidget = DebugConfigurationWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/debug/lib/browser/view/debug-configuration-widget'] = this;


/***/ }),

/***/ "../../packages/debug/lib/browser/view/debug-exception-breakpoint.js":
/*!***************************************************************************!*\
  !*** ../../packages/debug/lib/browser/view/debug-exception-breakpoint.js ***!
  \***************************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DebugExceptionBreakpoint = void 0;
const React = __webpack_require__(/*! @theia/core/shared/react */ "../../packages/core/shared/react/index.js");
const dialogs_1 = __webpack_require__(/*! @theia/core/lib/browser/dialogs */ "../../packages/core/lib/browser/dialogs.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const core_1 = __webpack_require__(/*! @theia/core */ "../../packages/core/lib/common/index.js");
class DebugExceptionBreakpoint {
    constructor(data, breakpoints) {
        this.data = data;
        this.breakpoints = breakpoints;
        this.toggle = () => this.breakpoints.toggleExceptionBreakpoint(this.data.raw.filter);
        this.id = data.raw.filter + ':' + data.raw.label;
    }
    render() {
        return React.createElement("div", { title: this.data.raw.description || this.data.raw.label, className: 'theia-source-breakpoint' },
            React.createElement("span", { className: 'theia-debug-breakpoint-icon' }),
            React.createElement("input", { type: 'checkbox', checked: this.data.enabled, onChange: this.toggle }),
            React.createElement("span", { className: 'line-info' },
                React.createElement("span", { className: 'name' },
                    this.data.raw.label,
                    " "),
                this.data.condition &&
                    React.createElement("span", { title: core_1.nls.localizeByDefault('Expression condition: {0}', this.data.condition), className: 'path ' + browser_1.TREE_NODE_INFO_CLASS },
                        this.data.condition,
                        " ")));
    }
    async editCondition() {
        const inputDialog = new dialogs_1.SingleTextInputDialog({
            title: this.data.raw.label,
            placeholder: this.data.raw.conditionDescription,
            initialValue: this.data.condition
        });
        let condition = await inputDialog.open();
        if (condition === undefined) {
            return;
        }
        if (condition === '') {
            condition = undefined;
        }
        if (condition !== this.data.condition) {
            this.breakpoints.updateExceptionBreakpoint(this.data.raw.filter, { condition });
        }
    }
}
exports.DebugExceptionBreakpoint = DebugExceptionBreakpoint;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/debug/lib/browser/view/debug-exception-breakpoint'] = this;


/***/ }),

/***/ "../../packages/debug/lib/browser/view/debug-session-widget.js":
/*!*********************************************************************!*\
  !*** ../../packages/debug/lib/browser/view/debug-session-widget.js ***!
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var DebugSessionWidget_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DebugSessionWidget = exports.DEBUG_VIEW_CONTAINER_TITLE_OPTIONS = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const debug_threads_widget_1 = __webpack_require__(/*! ./debug-threads-widget */ "../../packages/debug/lib/browser/view/debug-threads-widget.js");
const debug_stack_frames_widget_1 = __webpack_require__(/*! ./debug-stack-frames-widget */ "../../packages/debug/lib/browser/view/debug-stack-frames-widget.js");
const debug_breakpoints_widget_1 = __webpack_require__(/*! ./debug-breakpoints-widget */ "../../packages/debug/lib/browser/view/debug-breakpoints-widget.js");
const debug_variables_widget_1 = __webpack_require__(/*! ./debug-variables-widget */ "../../packages/debug/lib/browser/view/debug-variables-widget.js");
const debug_toolbar_widget_1 = __webpack_require__(/*! ./debug-toolbar-widget */ "../../packages/debug/lib/browser/view/debug-toolbar-widget.js");
const debug_view_model_1 = __webpack_require__(/*! ./debug-view-model */ "../../packages/debug/lib/browser/view/debug-view-model.js");
const debug_watch_widget_1 = __webpack_require__(/*! ./debug-watch-widget */ "../../packages/debug/lib/browser/view/debug-watch-widget.js");
const frontend_application_state_1 = __webpack_require__(/*! @theia/core/lib/browser/frontend-application-state */ "../../packages/core/lib/browser/frontend-application-state.js");
exports.DEBUG_VIEW_CONTAINER_TITLE_OPTIONS = {
    label: 'debug',
    iconClass: (0, browser_1.codicon)('debug-alt'),
    closeable: true
};
let DebugSessionWidget = DebugSessionWidget_1 = class DebugSessionWidget extends browser_1.BaseWidget {
    static createContainer(parent) {
        const child = new inversify_1.Container({ defaultScope: 'Singleton' });
        child.parent = parent;
        child.bind(debug_view_model_1.DebugViewModel).toSelf();
        child.bind(debug_toolbar_widget_1.DebugToolBar).toSelf();
        child.bind(DebugSessionWidget_1).toSelf();
        return child;
    }
    static createWidget(parent) {
        return DebugSessionWidget_1.createContainer(parent).get(DebugSessionWidget_1);
    }
    init() {
        this.id = 'debug:session:' + this.model.id;
        this.title.label = this.model.label;
        this.title.caption = this.model.label;
        this.title.closable = true;
        this.title.iconClass = (0, browser_1.codicon)('debug-alt');
        this.addClass('theia-session-container');
        this.viewContainer = this.viewContainerFactory({
            id: 'debug:view-container:' + this.model.id
        });
        this.viewContainer.setTitleOptions(exports.DEBUG_VIEW_CONTAINER_TITLE_OPTIONS);
        this.stateService.reachedState('initialized_layout').then(() => {
            for (const subwidget of DebugSessionWidget_1.subwidgets) {
                const widgetPromises = [];
                const existingWidget = this.widgetManager.tryGetPendingWidget(subwidget.FACTORY_ID);
                // No other view container instantiated this widget during startup.
                if (!existingWidget) {
                    widgetPromises.push(this.widgetManager.getOrCreateWidget(subwidget.FACTORY_ID));
                }
                Promise.all(widgetPromises).then(widgets => widgets.forEach(widget => this.viewContainer.addWidget(widget)));
            }
        });
        this.toDispose.pushAll([
            this.toolbar,
            this.viewContainer
        ]);
        const layout = this.layout = new browser_1.PanelLayout();
        layout.addWidget(this.toolbar);
        layout.addWidget(this.viewContainer);
    }
    onActivateRequest(msg) {
        super.onActivateRequest(msg);
        this.toolbar.focus();
    }
    onAfterShow(msg) {
        super.onAfterShow(msg);
        this.getTrackableWidgets().forEach(w => w.update());
    }
    getTrackableWidgets() {
        return [this.viewContainer];
    }
    storeState() {
        return this.viewContainer.storeState();
    }
    restoreState(oldState) {
        this.viewContainer.restoreState(oldState);
    }
};
DebugSessionWidget.subwidgets = [debug_threads_widget_1.DebugThreadsWidget, debug_stack_frames_widget_1.DebugStackFramesWidget, debug_variables_widget_1.DebugVariablesWidget, debug_watch_widget_1.DebugWatchWidget, debug_breakpoints_widget_1.DebugBreakpointsWidget];
__decorate([
    (0, inversify_1.inject)(browser_1.ViewContainer.Factory),
    __metadata("design:type", Function)
], DebugSessionWidget.prototype, "viewContainerFactory", void 0);
__decorate([
    (0, inversify_1.inject)(debug_view_model_1.DebugViewModel),
    __metadata("design:type", debug_view_model_1.DebugViewModel)
], DebugSessionWidget.prototype, "model", void 0);
__decorate([
    (0, inversify_1.inject)(debug_toolbar_widget_1.DebugToolBar),
    __metadata("design:type", debug_toolbar_widget_1.DebugToolBar)
], DebugSessionWidget.prototype, "toolbar", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.WidgetManager),
    __metadata("design:type", browser_1.WidgetManager)
], DebugSessionWidget.prototype, "widgetManager", void 0);
__decorate([
    (0, inversify_1.inject)(frontend_application_state_1.FrontendApplicationStateService),
    __metadata("design:type", frontend_application_state_1.FrontendApplicationStateService)
], DebugSessionWidget.prototype, "stateService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DebugSessionWidget.prototype, "init", null);
DebugSessionWidget = DebugSessionWidget_1 = __decorate([
    (0, inversify_1.injectable)()
], DebugSessionWidget);
exports.DebugSessionWidget = DebugSessionWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/debug/lib/browser/view/debug-session-widget'] = this;


/***/ }),

/***/ "../../packages/debug/lib/browser/view/debug-watch-source.js":
/*!*******************************************************************!*\
  !*** ../../packages/debug/lib/browser/view/debug-watch-source.js ***!
  \*******************************************************************/
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
exports.DebugWatchSource = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const source_tree_1 = __webpack_require__(/*! @theia/core/lib/browser/source-tree */ "../../packages/core/lib/browser/source-tree/index.js");
const debug_view_model_1 = __webpack_require__(/*! ./debug-view-model */ "../../packages/debug/lib/browser/view/debug-view-model.js");
const debounce = __webpack_require__(/*! p-debounce */ "../../node_modules/p-debounce/index.js");
let DebugWatchSource = class DebugWatchSource extends source_tree_1.TreeSource {
    constructor() {
        super(...arguments);
        this.refresh = debounce(() => this.fireDidChange(), 100);
    }
    init() {
        this.refresh();
        this.toDispose.push(this.model.onDidChangeWatchExpressions(() => this.refresh()));
    }
    async getElements() {
        return this.model.watchExpressions[Symbol.iterator]();
    }
};
__decorate([
    (0, inversify_1.inject)(debug_view_model_1.DebugViewModel),
    __metadata("design:type", debug_view_model_1.DebugViewModel)
], DebugWatchSource.prototype, "model", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DebugWatchSource.prototype, "init", null);
DebugWatchSource = __decorate([
    (0, inversify_1.injectable)()
], DebugWatchSource);
exports.DebugWatchSource = DebugWatchSource;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/debug/lib/browser/view/debug-watch-source'] = this;


/***/ }),

/***/ "../../packages/debug/lib/browser/view/debug-watch-widget.js":
/*!*******************************************************************!*\
  !*** ../../packages/debug/lib/browser/view/debug-watch-widget.js ***!
  \*******************************************************************/
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
var DebugWatchWidget_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DebugWatchWidget = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const source_tree_1 = __webpack_require__(/*! @theia/core/lib/browser/source-tree */ "../../packages/core/lib/browser/source-tree/index.js");
const debug_watch_source_1 = __webpack_require__(/*! ./debug-watch-source */ "../../packages/debug/lib/browser/view/debug-watch-source.js");
const debug_view_model_1 = __webpack_require__(/*! ./debug-view-model */ "../../packages/debug/lib/browser/view/debug-view-model.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
let DebugWatchWidget = DebugWatchWidget_1 = class DebugWatchWidget extends source_tree_1.SourceTreeWidget {
    static createContainer(parent) {
        const child = source_tree_1.SourceTreeWidget.createContainer(parent, {
            contextMenuPath: DebugWatchWidget_1.CONTEXT_MENU,
            virtualized: false,
            scrollIfActive: true
        });
        child.bind(debug_watch_source_1.DebugWatchSource).toSelf();
        child.unbind(source_tree_1.SourceTreeWidget);
        child.bind(DebugWatchWidget_1).toSelf();
        return child;
    }
    static createWidget(parent) {
        return DebugWatchWidget_1.createContainer(parent).get(DebugWatchWidget_1);
    }
    init() {
        super.init();
        this.id = DebugWatchWidget_1.FACTORY_ID + ':' + this.viewModel.id;
        this.title.label = nls_1.nls.localizeByDefault('Watch');
        this.toDispose.push(this.variables);
        this.source = this.variables;
    }
};
DebugWatchWidget.CONTEXT_MENU = ['debug-watch-context-menu'];
DebugWatchWidget.EDIT_MENU = [...DebugWatchWidget_1.CONTEXT_MENU, 'a_edit'];
DebugWatchWidget.REMOVE_MENU = [...DebugWatchWidget_1.CONTEXT_MENU, 'b_remove'];
DebugWatchWidget.FACTORY_ID = 'debug:watch';
__decorate([
    (0, inversify_1.inject)(debug_view_model_1.DebugViewModel),
    __metadata("design:type", debug_view_model_1.DebugViewModel)
], DebugWatchWidget.prototype, "viewModel", void 0);
__decorate([
    (0, inversify_1.inject)(debug_watch_source_1.DebugWatchSource),
    __metadata("design:type", debug_watch_source_1.DebugWatchSource)
], DebugWatchWidget.prototype, "variables", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DebugWatchWidget.prototype, "init", null);
DebugWatchWidget = DebugWatchWidget_1 = __decorate([
    (0, inversify_1.injectable)()
], DebugWatchWidget);
exports.DebugWatchWidget = DebugWatchWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/debug/lib/browser/view/debug-watch-widget'] = this;


/***/ }),

/***/ "../../packages/debug/lib/browser/view/debug-widget.js":
/*!*************************************************************!*\
  !*** ../../packages/debug/lib/browser/view/debug-widget.js ***!
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var DebugWidget_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DebugWidget = void 0;
const inversify_1 = __webpack_require__(/*! @theia/core/shared/inversify */ "../../packages/core/shared/inversify/index.js");
const browser_1 = __webpack_require__(/*! @theia/core/lib/browser */ "../../packages/core/lib/browser/index.js");
const debug_session_widget_1 = __webpack_require__(/*! ./debug-session-widget */ "../../packages/debug/lib/browser/view/debug-session-widget.js");
const debug_configuration_widget_1 = __webpack_require__(/*! ./debug-configuration-widget */ "../../packages/debug/lib/browser/view/debug-configuration-widget.js");
const debug_view_model_1 = __webpack_require__(/*! ./debug-view-model */ "../../packages/debug/lib/browser/view/debug-view-model.js");
const debug_session_manager_1 = __webpack_require__(/*! ../debug-session-manager */ "../../packages/debug/lib/browser/debug-session-manager.js");
const progress_bar_factory_1 = __webpack_require__(/*! @theia/core/lib/browser/progress-bar-factory */ "../../packages/core/lib/browser/progress-bar-factory.js");
const nls_1 = __webpack_require__(/*! @theia/core/lib/common/nls */ "../../packages/core/lib/common/nls.js");
let DebugWidget = DebugWidget_1 = class DebugWidget extends browser_1.BaseWidget {
    static createContainer(parent) {
        const child = debug_session_widget_1.DebugSessionWidget.createContainer(parent);
        child.bind(debug_configuration_widget_1.DebugConfigurationWidget).toSelf();
        child.bind(DebugWidget_1).toSelf();
        return child;
    }
    static createWidget(parent) {
        return DebugWidget_1.createContainer(parent).get(DebugWidget_1);
    }
    init() {
        this.id = DebugWidget_1.ID;
        this.title.label = DebugWidget_1.LABEL;
        this.title.caption = DebugWidget_1.LABEL;
        this.title.closable = true;
        this.title.iconClass = (0, browser_1.codicon)('debug-alt');
        this.addClass('theia-debug-container');
        this.toDispose.pushAll([
            this.toolbar,
            this.sessionWidget,
        ]);
        const layout = this.layout = new browser_1.PanelLayout();
        layout.addWidget(this.toolbar);
        layout.addWidget(this.sessionWidget);
        this.toDispose.push(this.progressBarFactory({ container: this.node, insertMode: 'prepend', locationId: 'debug' }));
    }
    onActivateRequest(msg) {
        super.onActivateRequest(msg);
        this.toolbar.focus();
    }
    getTrackableWidgets() {
        return [this.sessionWidget];
    }
    storeState() {
        return this.sessionWidget.storeState();
    }
    restoreState(oldState) {
        this.sessionWidget.restoreState(oldState);
    }
};
DebugWidget.ID = 'debug';
DebugWidget.LABEL = nls_1.nls.localizeByDefault('Debug');
__decorate([
    (0, inversify_1.inject)(debug_view_model_1.DebugViewModel),
    __metadata("design:type", debug_view_model_1.DebugViewModel)
], DebugWidget.prototype, "model", void 0);
__decorate([
    (0, inversify_1.inject)(debug_session_manager_1.DebugSessionManager),
    __metadata("design:type", debug_session_manager_1.DebugSessionManager)
], DebugWidget.prototype, "sessionManager", void 0);
__decorate([
    (0, inversify_1.inject)(debug_configuration_widget_1.DebugConfigurationWidget),
    __metadata("design:type", debug_configuration_widget_1.DebugConfigurationWidget)
], DebugWidget.prototype, "toolbar", void 0);
__decorate([
    (0, inversify_1.inject)(debug_session_widget_1.DebugSessionWidget),
    __metadata("design:type", debug_session_widget_1.DebugSessionWidget)
], DebugWidget.prototype, "sessionWidget", void 0);
__decorate([
    (0, inversify_1.inject)(progress_bar_factory_1.ProgressBarFactory),
    __metadata("design:type", Function)
], DebugWidget.prototype, "progressBarFactory", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DebugWidget.prototype, "init", null);
DebugWidget = DebugWidget_1 = __decorate([
    (0, inversify_1.injectable)()
], DebugWidget);
exports.DebugWidget = DebugWidget;

;(globalThis['theia'] = globalThis['theia'] || {})['@theia/debug/lib/browser/view/debug-widget'] = this;


/***/ })

}]);
//# sourceMappingURL=packages_debug_lib_browser_debug-frontend-application-contribution_js-packages_debug_lib_brow-54d658.js.map