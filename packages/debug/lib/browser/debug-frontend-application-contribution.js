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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebugFrontendApplicationContribution = exports.DebugBreakpointWidgetCommands = exports.DebugEditorContextCommands = exports.DebugSessionContextCommands = exports.DebugThreadContextCommands = exports.DebugCommands = exports.DebugMenus = void 0;
const browser_1 = require("@theia/core/lib/browser");
const inversify_1 = require("@theia/core/shared/inversify");
const monaco = require("@theia/monaco-editor-core");
const common_1 = require("@theia/core/lib/common");
const browser_2 = require("@theia/editor/lib/browser");
const debug_session_manager_1 = require("./debug-session-manager");
const debug_widget_1 = require("./view/debug-widget");
const breakpoint_marker_1 = require("./breakpoint/breakpoint-marker");
const breakpoint_manager_1 = require("./breakpoint/breakpoint-manager");
const debug_configuration_manager_1 = require("./debug-configuration-manager");
const debug_session_1 = require("./debug-session");
const debug_breakpoints_widget_1 = require("./view/debug-breakpoints-widget");
const debug_source_breakpoint_1 = require("./model/debug-source-breakpoint");
const debug_threads_widget_1 = require("./view/debug-threads-widget");
const debug_thread_1 = require("./model/debug-thread");
const debug_stack_frames_widget_1 = require("./view/debug-stack-frames-widget");
const debug_stack_frame_1 = require("./model/debug-stack-frame");
const debug_variables_widget_1 = require("./view/debug-variables-widget");
const debug_console_items_1 = require("./console/debug-console-items");
const debug_editor_model_1 = require("./editor/debug-editor-model");
const debug_editor_service_1 = require("./editor/debug-editor-service");
const debug_console_contribution_1 = require("./console/debug-console-contribution");
const debug_service_1 = require("../common/debug-service");
const debug_schema_updater_1 = require("./debug-schema-updater");
const debug_preferences_1 = require("./debug-preferences");
const debug_watch_widget_1 = require("./view/debug-watch-widget");
const debug_watch_expression_1 = require("./view/debug-watch-expression");
const debug_watch_manager_1 = require("./debug-watch-manager");
const debug_function_breakpoint_1 = require("./model/debug-function-breakpoint");
const debug_breakpoint_1 = require("./model/debug-breakpoint");
const nls_1 = require("@theia/core/lib/common/nls");
const debug_instruction_breakpoint_1 = require("./model/debug-instruction-breakpoint");
const debug_exception_breakpoint_1 = require("./view/debug-exception-breakpoint");
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
//# sourceMappingURL=debug-frontend-application-contribution.js.map