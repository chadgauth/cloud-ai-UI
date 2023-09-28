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
var DebugConsoleContribution_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebugConsoleContribution = exports.DebugConsoleCommands = exports.InDebugReplContextKey = void 0;
const console_session_manager_1 = require("@theia/console/lib/browser/console-session-manager");
const console_widget_1 = require("@theia/console/lib/browser/console-widget");
const browser_1 = require("@theia/core/lib/browser");
const context_key_service_1 = require("@theia/core/lib/browser/context-key-service");
const nls_1 = require("@theia/core/lib/common/nls");
const tab_bar_toolbar_1 = require("@theia/core/lib/browser/shell/tab-bar-toolbar");
const command_1 = require("@theia/core/lib/common/command");
const severity_1 = require("@theia/core/lib/common/severity");
const inversify_1 = require("@theia/core/shared/inversify");
const React = require("@theia/core/shared/react");
const select_component_1 = require("@theia/core/lib/browser/widgets/select-component");
const debug_session_manager_1 = require("../debug-session-manager");
const debug_console_session_1 = require("./debug-console-session");
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
//# sourceMappingURL=debug-console-contribution.js.map