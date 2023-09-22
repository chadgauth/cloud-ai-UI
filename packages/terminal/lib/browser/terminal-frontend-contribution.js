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
exports.TerminalFrontendContribution = exports.TerminalCommands = exports.TerminalMenus = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const common_1 = require("@theia/core/lib/common");
const browser_1 = require("@theia/core/lib/browser");
const terminal_widget_impl_1 = require("./terminal-widget-impl");
const terminal_widget_1 = require("./base/terminal-widget");
const terminal_profile_service_1 = require("./terminal-profile-service");
const uri_command_handler_1 = require("@theia/core/lib/common/uri-command-handler");
const shell_terminal_protocol_1 = require("../common/shell-terminal-protocol");
const uri_1 = require("@theia/core/lib/common/uri");
const core_1 = require("@theia/core");
const browser_2 = require("@theia/workspace/lib/browser");
const context_key_service_1 = require("@theia/core/lib/browser/context-key-service");
const terminal_theme_service_1 = require("./terminal-theme-service");
const file_service_1 = require("@theia/filesystem/lib/browser/file-service");
const terminal_watcher_1 = require("../common/terminal-watcher");
const base_terminal_protocol_1 = require("../common/base-terminal-protocol");
const nls_1 = require("@theia/core/lib/common/nls");
const terminal_preferences_1 = require("./terminal-preferences");
const shell_terminal_profile_1 = require("./shell-terminal-profile");
const browser_3 = require("@theia/variable-resolver/lib/browser");
var TerminalMenus;
(function (TerminalMenus) {
    TerminalMenus.TERMINAL = [...core_1.MAIN_MENU_BAR, '7_terminal'];
    TerminalMenus.TERMINAL_NEW = [...TerminalMenus.TERMINAL, '1_terminal'];
    TerminalMenus.TERMINAL_TASKS = [...TerminalMenus.TERMINAL, '2_terminal'];
    TerminalMenus.TERMINAL_TASKS_INFO = [...TerminalMenus.TERMINAL_TASKS, '3_terminal'];
    TerminalMenus.TERMINAL_TASKS_CONFIG = [...TerminalMenus.TERMINAL_TASKS, '4_terminal'];
    TerminalMenus.TERMINAL_NAVIGATOR_CONTEXT_MENU = ['navigator-context-menu', 'navigation'];
    TerminalMenus.TERMINAL_OPEN_EDITORS_CONTEXT_MENU = ['open-editors-context-menu', 'navigation'];
    TerminalMenus.TERMINAL_CONTEXT_MENU = ['terminal-context-menu'];
})(TerminalMenus = exports.TerminalMenus || (exports.TerminalMenus = {}));
var TerminalCommands;
(function (TerminalCommands) {
    const TERMINAL_CATEGORY = 'Terminal';
    TerminalCommands.NEW = common_1.Command.toDefaultLocalizedCommand({
        id: 'terminal:new',
        category: TERMINAL_CATEGORY,
        label: 'Create New Terminal'
    });
    TerminalCommands.PROFILE_NEW = common_1.Command.toLocalizedCommand({
        id: 'terminal:new:profile',
        category: TERMINAL_CATEGORY,
        label: 'Create New Integrated Terminal from a Profile'
    });
    TerminalCommands.PROFILE_DEFAULT = common_1.Command.toLocalizedCommand({
        id: 'terminal:profile:default',
        category: TERMINAL_CATEGORY,
        label: 'Choose the default Terminal Profile'
    });
    TerminalCommands.NEW_ACTIVE_WORKSPACE = common_1.Command.toDefaultLocalizedCommand({
        id: 'terminal:new:active:workspace',
        category: TERMINAL_CATEGORY,
        label: 'Create New Terminal (In Active Workspace)'
    });
    TerminalCommands.TERMINAL_CLEAR = common_1.Command.toDefaultLocalizedCommand({
        id: 'terminal:clear',
        category: TERMINAL_CATEGORY,
        label: 'Clear'
    });
    TerminalCommands.TERMINAL_CONTEXT = common_1.Command.toDefaultLocalizedCommand({
        id: 'terminal:context',
        category: TERMINAL_CATEGORY,
        label: 'Open in Terminal'
    });
    TerminalCommands.SPLIT = common_1.Command.toDefaultLocalizedCommand({
        id: 'terminal:split',
        category: TERMINAL_CATEGORY,
        label: 'Split Terminal'
    });
    TerminalCommands.TERMINAL_FIND_TEXT = common_1.Command.toDefaultLocalizedCommand({
        id: 'terminal:find',
        category: TERMINAL_CATEGORY,
        label: 'Find'
    });
    TerminalCommands.TERMINAL_FIND_TEXT_CANCEL = common_1.Command.toDefaultLocalizedCommand({
        id: 'terminal:find:cancel',
        category: TERMINAL_CATEGORY,
        label: 'Hide Find'
    });
    TerminalCommands.SCROLL_LINE_UP = common_1.Command.toDefaultLocalizedCommand({
        id: 'terminal:scroll:line:up',
        category: TERMINAL_CATEGORY,
        label: 'Scroll Up (Line)'
    });
    TerminalCommands.SCROLL_LINE_DOWN = common_1.Command.toDefaultLocalizedCommand({
        id: 'terminal:scroll:line:down',
        category: TERMINAL_CATEGORY,
        label: 'Scroll Down (Line)'
    });
    TerminalCommands.SCROLL_TO_TOP = common_1.Command.toDefaultLocalizedCommand({
        id: 'terminal:scroll:top',
        category: TERMINAL_CATEGORY,
        label: 'Scroll to Top'
    });
    TerminalCommands.SCROLL_PAGE_UP = common_1.Command.toDefaultLocalizedCommand({
        id: 'terminal:scroll:page:up',
        category: TERMINAL_CATEGORY,
        label: 'Scroll Up (Page)'
    });
    TerminalCommands.SCROLL_PAGE_DOWN = common_1.Command.toDefaultLocalizedCommand({
        id: 'terminal:scroll:page:down',
        category: TERMINAL_CATEGORY,
        label: 'Scroll Down (Page)'
    });
    TerminalCommands.TOGGLE_TERMINAL = common_1.Command.toDefaultLocalizedCommand({
        id: 'workbench.action.terminal.toggleTerminal',
        category: TERMINAL_CATEGORY,
        label: 'Toggle Terminal'
    });
    TerminalCommands.KILL_TERMINAL = common_1.Command.toDefaultLocalizedCommand({
        id: 'terminal:kill',
        category: TERMINAL_CATEGORY,
        label: 'Kill Terminal'
    });
    TerminalCommands.SELECT_ALL = {
        id: 'terminal:select:all',
        label: browser_1.CommonCommands.SELECT_ALL.label,
        category: TERMINAL_CATEGORY,
    };
    /**
     * Command that displays all terminals that are currently opened
     */
    TerminalCommands.SHOW_ALL_OPENED_TERMINALS = common_1.Command.toDefaultLocalizedCommand({
        id: 'workbench.action.showAllTerminals',
        category: browser_1.CommonCommands.VIEW_CATEGORY,
        label: 'Show All Opened Terminals'
    });
})(TerminalCommands = exports.TerminalCommands || (exports.TerminalCommands = {}));
let TerminalFrontendContribution = class TerminalFrontendContribution {
    constructor() {
        this.mergePreferencesPromise = Promise.resolve();
        this.onDidCreateTerminalEmitter = new common_1.Emitter();
        this.onDidCreateTerminal = this.onDidCreateTerminalEmitter.event;
        this.onDidChangeCurrentTerminalEmitter = new common_1.Emitter();
        this.onDidChangeCurrentTerminal = this.onDidChangeCurrentTerminalEmitter.event;
        // IDs of the most recently used terminals
        this.mostRecentlyUsedTerminalEntries = [];
    }
    init() {
        this.shell.onDidChangeCurrentWidget(() => this.updateCurrentTerminal());
        this.widgetManager.onDidCreateWidget(({ widget }) => {
            if (widget instanceof terminal_widget_1.TerminalWidget) {
                this.updateCurrentTerminal();
                this.onDidCreateTerminalEmitter.fire(widget);
                this.setLastUsedTerminal(widget);
            }
        });
        const terminalFocusKey = this.contextKeyService.createKey('terminalFocus', false);
        const terminalSearchToggle = this.contextKeyService.createKey('terminalHideSearch', false);
        const updateFocusKey = () => {
            terminalFocusKey.set(this.shell.activeWidget instanceof terminal_widget_1.TerminalWidget);
            terminalSearchToggle.set(this.terminalHideSearch);
        };
        updateFocusKey();
        this.shell.onDidChangeActiveWidget(updateFocusKey);
        this.terminalWatcher.onStoreTerminalEnvVariablesRequested(data => {
            this.storageService.setData(base_terminal_protocol_1.ENVIRONMENT_VARIABLE_COLLECTIONS_KEY, data);
        });
        this.terminalWatcher.onUpdateTerminalEnvVariablesRequested(() => {
            this.storageService.getData(base_terminal_protocol_1.ENVIRONMENT_VARIABLE_COLLECTIONS_KEY).then(data => {
                if (data) {
                    const collectionsJson = JSON.parse(data);
                    collectionsJson.forEach(c => this.shellTerminalServer.setCollection(c.extensionIdentifier, true, c.collection ? c.collection : [], c.description));
                }
            });
        });
    }
    get terminalHideSearch() {
        if (!(this.shell.activeWidget instanceof terminal_widget_1.TerminalWidget)) {
            return false;
        }
        const searchWidget = this.shell.activeWidget.getSearchBox();
        return searchWidget.isVisible;
    }
    async onStart(app) {
        await this.contributeDefaultProfiles();
        this.terminalPreferences.onPreferenceChanged(e => {
            if (e.preferenceName.startsWith('terminal.integrated.')) {
                this.mergePreferencesPromise = this.mergePreferencesPromise.finally(() => this.mergePreferences());
            }
        });
        this.mergePreferencesPromise = this.mergePreferencesPromise.finally(() => this.mergePreferences());
        // extension contributions get read after this point: need to set the default profile if necessary
        this.profileService.onAdded(id => {
            let defaultProfileId;
            switch (common_1.OS.backend.type()) {
                case common_1.OS.Type.Windows: {
                    defaultProfileId = this.terminalPreferences['terminal.integrated.defaultProfile.windows'];
                    break;
                }
                case common_1.OS.Type.Linux: {
                    defaultProfileId = this.terminalPreferences['terminal.integrated.defaultProfile.linux'];
                    break;
                }
                case common_1.OS.Type.OSX: {
                    defaultProfileId = this.terminalPreferences['terminal.integrated.defaultProfile.osx'];
                    break;
                }
            }
            if (defaultProfileId) {
                this.profileService.setDefaultProfile(defaultProfileId);
            }
        });
    }
    async contributeDefaultProfiles() {
        if (common_1.OS.backend.isWindows) {
            this.contributedProfileStore.registerTerminalProfile('cmd', new shell_terminal_profile_1.ShellTerminalProfile(this, {
                shellPath: await this.resolveShellPath([
                    '${env:windir}\\Sysnative\\cmd.exe',
                    '${env:windir}\\System32\\cmd.exe'
                ])
            }));
        }
        else {
            this.contributedProfileStore.registerTerminalProfile('SHELL', new shell_terminal_profile_1.ShellTerminalProfile(this, {
                shellPath: await this.resolveShellPath('${SHELL}'),
                shellArgs: ['-l']
            }));
        }
        // contribute default profiles based on legacy preferences
    }
    async mergePreferences() {
        var _a, _b, _c;
        let profiles;
        let defaultProfile;
        let legacyShellPath;
        let legacyShellArgs;
        const removed = new Set(this.userProfileStore.all.map(([id, profile]) => id));
        switch (common_1.OS.backend.type()) {
            case common_1.OS.Type.Windows: {
                profiles = this.terminalPreferences['terminal.integrated.profiles.windows'];
                defaultProfile = this.terminalPreferences['terminal.integrated.defaultProfile.windows'];
                legacyShellPath = (_a = this.terminalPreferences['terminal.integrated.shell.windows']) !== null && _a !== void 0 ? _a : undefined;
                legacyShellArgs = this.terminalPreferences['terminal.integrated.shellArgs.windows'];
                break;
            }
            case common_1.OS.Type.Linux: {
                profiles = this.terminalPreferences['terminal.integrated.profiles.linux'];
                defaultProfile = this.terminalPreferences['terminal.integrated.defaultProfile.linux'];
                legacyShellPath = (_b = this.terminalPreferences['terminal.integrated.shell.linux']) !== null && _b !== void 0 ? _b : undefined;
                legacyShellArgs = this.terminalPreferences['terminal.integrated.shellArgs.linux'];
                break;
            }
            case common_1.OS.Type.OSX: {
                profiles = this.terminalPreferences['terminal.integrated.profiles.osx'];
                defaultProfile = this.terminalPreferences['terminal.integrated.defaultProfile.osx'];
                legacyShellPath = (_c = this.terminalPreferences['terminal.integrated.shell.osx']) !== null && _c !== void 0 ? _c : undefined;
                legacyShellArgs = this.terminalPreferences['terminal.integrated.shellArgs.osx'];
                break;
            }
        }
        if (profiles) {
            for (const id of Object.getOwnPropertyNames(profiles)) {
                const profile = profiles[id];
                removed.delete(id);
                if (profile) {
                    const shellPath = await this.resolveShellPath(profile.path);
                    if (shellPath) {
                        const options = {
                            shellPath: shellPath,
                            shellArgs: profile.args ? await this.variableResolver.resolve(profile.args) : undefined,
                            useServerTitle: profile.overrideName ? false : undefined,
                            env: profile.env ? await this.variableResolver.resolve(profile.env) : undefined,
                            title: profile.overrideName ? id : undefined
                        };
                        this.userProfileStore.registerTerminalProfile(id, new shell_terminal_profile_1.ShellTerminalProfile(this, options));
                    }
                }
                else {
                    this.userProfileStore.registerTerminalProfile(id, terminal_profile_service_1.NULL_PROFILE);
                }
            }
        }
        if (legacyShellPath) {
            this.userProfileStore.registerTerminalProfile('Legacy Shell Preferences', new shell_terminal_profile_1.ShellTerminalProfile(this, {
                shellPath: legacyShellPath,
                shellArgs: legacyShellArgs
            }));
            // if no other default is set, use the legacy preferences as default if they exist
            this.profileService.setDefaultProfile('Legacy Shell Preferences');
        }
        if (defaultProfile && this.profileService.getProfile(defaultProfile)) {
            this.profileService.setDefaultProfile(defaultProfile);
        }
        for (const id of removed) {
            this.userProfileStore.unregisterTerminalProfile(id);
        }
    }
    async resolveShellPath(path) {
        if (!path) {
            return undefined;
        }
        if (typeof path === 'string') {
            path = [path];
        }
        for (const p of path) {
            const resolved = await this.variableResolver.resolve(p);
            if (resolved) {
                const resolvedURI = uri_1.default.fromFilePath(resolved);
                if (await this.fileService.exists(resolvedURI)) {
                    return resolved;
                }
            }
        }
        return undefined;
    }
    onWillStop() {
        const preferenceValue = this.terminalPreferences['terminal.integrated.confirmOnExit'];
        if (preferenceValue !== 'never') {
            const allTerminals = this.widgetManager.getWidgets(terminal_widget_impl_1.TERMINAL_WIDGET_FACTORY_ID);
            if (allTerminals.length) {
                return {
                    prepare: async () => {
                        if (preferenceValue === 'always') {
                            return allTerminals.length;
                        }
                        else {
                            const activeTerminals = await Promise.all(allTerminals.map(widget => widget.hasChildProcesses()))
                                .then(hasChildProcesses => hasChildProcesses.filter(hasChild => hasChild));
                            return activeTerminals.length;
                        }
                    },
                    action: async (activeTerminalCount) => activeTerminalCount === 0 || this.confirmExitWithActiveTerminals(activeTerminalCount),
                    reason: 'Active integrated terminal',
                };
            }
        }
    }
    async confirmExitWithActiveTerminals(activeTerminalCount) {
        const msg = activeTerminalCount === 1
            ? nls_1.nls.localizeByDefault('Do you want to terminate the active terminal session?')
            : nls_1.nls.localizeByDefault('Do you want to terminate the {0} active terminal sessions?', activeTerminalCount);
        const safeToExit = await new browser_1.ConfirmDialog({
            title: '',
            msg,
            ok: nls_1.nls.localizeByDefault('Terminate'),
            cancel: browser_1.Dialog.CANCEL,
        }).open();
        return safeToExit === true;
    }
    get currentTerminal() {
        return this._currentTerminal;
    }
    setCurrentTerminal(current) {
        if (this._currentTerminal !== current) {
            this._currentTerminal = current;
            this.onDidChangeCurrentTerminalEmitter.fire(this._currentTerminal);
        }
    }
    updateCurrentTerminal() {
        const widget = this.shell.currentWidget;
        if (widget instanceof terminal_widget_1.TerminalWidget) {
            this.setCurrentTerminal(widget);
        }
        else if (!this._currentTerminal || !this._currentTerminal.isVisible) {
            this.setCurrentTerminal(undefined);
        }
    }
    getLastUsedTerminalId() {
        const mostRecent = this.mostRecentlyUsedTerminalEntries[this.mostRecentlyUsedTerminalEntries.length - 1];
        if (mostRecent) {
            return mostRecent.id;
        }
    }
    get lastUsedTerminal() {
        const id = this.getLastUsedTerminalId();
        if (id) {
            return this.getById(id);
        }
    }
    setLastUsedTerminal(lastUsedTerminal) {
        const lastUsedTerminalId = lastUsedTerminal.id;
        const entryIndex = this.mostRecentlyUsedTerminalEntries.findIndex(entry => entry.id === lastUsedTerminalId);
        let toDispose;
        if (entryIndex >= 0) {
            toDispose = this.mostRecentlyUsedTerminalEntries[entryIndex].disposables;
            this.mostRecentlyUsedTerminalEntries.splice(entryIndex, 1);
        }
        else {
            toDispose = new common_1.DisposableCollection();
            toDispose.push(lastUsedTerminal.onDidChangeVisibility((isVisible) => {
                if (isVisible) {
                    this.setLastUsedTerminal(lastUsedTerminal);
                }
            }));
            toDispose.push(lastUsedTerminal.onDidDispose(() => {
                const index = this.mostRecentlyUsedTerminalEntries.findIndex(entry => entry.id === lastUsedTerminalId);
                if (index >= 0) {
                    this.mostRecentlyUsedTerminalEntries[index].disposables.dispose();
                    this.mostRecentlyUsedTerminalEntries.splice(index, 1);
                }
            }));
        }
        const newEntry = { id: lastUsedTerminalId, disposables: toDispose };
        if (lastUsedTerminal.isVisible) {
            this.mostRecentlyUsedTerminalEntries.push(newEntry);
        }
        else {
            this.mostRecentlyUsedTerminalEntries = [newEntry, ...this.mostRecentlyUsedTerminalEntries];
        }
    }
    get all() {
        return this.widgetManager.getWidgets(terminal_widget_impl_1.TERMINAL_WIDGET_FACTORY_ID);
    }
    getById(id) {
        return this.all.find(terminal => terminal.id === id);
    }
    getByTerminalId(terminalId) {
        return this.all.find(terminal => terminal.terminalId === terminalId);
    }
    getDefaultShell() {
        return this.shellTerminalServer.getDefaultShell();
    }
    registerCommands(commands) {
        commands.registerCommand(TerminalCommands.NEW, {
            execute: () => this.openTerminal()
        });
        commands.registerCommand(TerminalCommands.PROFILE_NEW, {
            execute: async () => {
                const profile = await this.selectTerminalProfile(nls_1.nls.localize('theia/terminal/selectProfile', 'Select a profile for the new terminal'));
                if (!profile) {
                    return;
                }
                this.openTerminal(undefined, profile[1]);
            }
        });
        commands.registerCommand(TerminalCommands.PROFILE_DEFAULT, {
            execute: () => this.chooseDefaultProfile()
        });
        commands.registerCommand(TerminalCommands.NEW_ACTIVE_WORKSPACE, {
            execute: () => this.openActiveWorkspaceTerminal()
        });
        commands.registerCommand(TerminalCommands.SPLIT, {
            execute: () => this.splitTerminal(),
            isEnabled: w => this.withWidget(w, () => true),
            isVisible: w => this.withWidget(w, () => true),
        });
        commands.registerCommand(TerminalCommands.TERMINAL_CLEAR);
        commands.registerHandler(TerminalCommands.TERMINAL_CLEAR.id, {
            execute: () => { var _a; return (_a = this.currentTerminal) === null || _a === void 0 ? void 0 : _a.clearOutput(); }
        });
        commands.registerCommand(TerminalCommands.TERMINAL_CONTEXT, uri_command_handler_1.UriAwareCommandHandler.MonoSelect(this.selectionService, {
            execute: uri => this.openInTerminal(uri)
        }));
        commands.registerCommand(TerminalCommands.TERMINAL_FIND_TEXT);
        commands.registerHandler(TerminalCommands.TERMINAL_FIND_TEXT.id, {
            isEnabled: () => {
                if (this.shell.activeWidget instanceof terminal_widget_1.TerminalWidget) {
                    return !this.shell.activeWidget.getSearchBox().isVisible;
                }
                return false;
            },
            execute: () => {
                const termWidget = this.shell.activeWidget;
                const terminalSearchBox = termWidget.getSearchBox();
                terminalSearchBox.show();
            }
        });
        commands.registerCommand(TerminalCommands.TERMINAL_FIND_TEXT_CANCEL);
        commands.registerHandler(TerminalCommands.TERMINAL_FIND_TEXT_CANCEL.id, {
            isEnabled: () => {
                if (this.shell.activeWidget instanceof terminal_widget_1.TerminalWidget) {
                    return this.shell.activeWidget.getSearchBox().isVisible;
                }
                return false;
            },
            execute: () => {
                const termWidget = this.shell.activeWidget;
                const terminalSearchBox = termWidget.getSearchBox();
                terminalSearchBox.hide();
            }
        });
        commands.registerCommand(TerminalCommands.SCROLL_LINE_UP, {
            isEnabled: () => this.shell.activeWidget instanceof terminal_widget_1.TerminalWidget,
            isVisible: () => false,
            execute: () => {
                this.shell.activeWidget.scrollLineUp();
            }
        });
        commands.registerCommand(TerminalCommands.SCROLL_LINE_DOWN, {
            isEnabled: () => this.shell.activeWidget instanceof terminal_widget_1.TerminalWidget,
            isVisible: () => false,
            execute: () => {
                this.shell.activeWidget.scrollLineDown();
            }
        });
        commands.registerCommand(TerminalCommands.SCROLL_TO_TOP, {
            isEnabled: () => this.shell.activeWidget instanceof terminal_widget_1.TerminalWidget,
            isVisible: () => false,
            execute: () => {
                this.shell.activeWidget.scrollToTop();
            }
        });
        commands.registerCommand(TerminalCommands.SCROLL_PAGE_UP, {
            isEnabled: () => this.shell.activeWidget instanceof terminal_widget_1.TerminalWidget,
            isVisible: () => false,
            execute: () => {
                this.shell.activeWidget.scrollPageUp();
            }
        });
        commands.registerCommand(TerminalCommands.SCROLL_PAGE_DOWN, {
            isEnabled: () => this.shell.activeWidget instanceof terminal_widget_1.TerminalWidget,
            isVisible: () => false,
            execute: () => {
                this.shell.activeWidget.scrollPageDown();
            }
        });
        commands.registerCommand(TerminalCommands.TOGGLE_TERMINAL, {
            execute: () => this.toggleTerminal()
        });
        commands.registerCommand(TerminalCommands.KILL_TERMINAL, {
            isEnabled: () => !!this.currentTerminal,
            execute: () => { var _a; return (_a = this.currentTerminal) === null || _a === void 0 ? void 0 : _a.close(); }
        });
        commands.registerCommand(TerminalCommands.SELECT_ALL, {
            isEnabled: () => !!this.currentTerminal,
            execute: () => { var _a; return (_a = this.currentTerminal) === null || _a === void 0 ? void 0 : _a.selectAll(); }
        });
    }
    toggleTerminal() {
        const terminals = this.shell.getWidgets('bottom').filter(w => w instanceof terminal_widget_1.TerminalWidget);
        if (terminals.length === 0) {
            this.openTerminal();
            return;
        }
        if (this.shell.bottomPanel.isHidden) {
            this.shell.bottomPanel.setHidden(false);
            terminals[0].activate();
            return;
        }
        if (this.shell.bottomPanel.isVisible) {
            const visibleTerminal = terminals.find(t => t.isVisible);
            if (!visibleTerminal) {
                this.shell.bottomPanel.activateWidget(terminals[0]);
            }
            else if (this.shell.activeWidget !== visibleTerminal) {
                this.shell.bottomPanel.activateWidget(visibleTerminal);
            }
            else {
                this.shell.bottomPanel.setHidden(true);
            }
        }
    }
    async openInTerminal(uri) {
        // Determine folder path of URI
        let stat;
        try {
            stat = await this.fileService.resolve(uri);
        }
        catch {
            return;
        }
        // Use folder if a file was selected
        const cwd = (stat.isDirectory) ? uri.toString() : uri.parent.toString();
        // Open terminal
        const termWidget = await this.newTerminal({ cwd });
        termWidget.start();
        this.open(termWidget);
    }
    registerMenus(menus) {
        menus.registerSubmenu(TerminalMenus.TERMINAL, terminal_widget_impl_1.TerminalWidgetImpl.LABEL);
        menus.registerMenuAction(TerminalMenus.TERMINAL_NEW, {
            commandId: TerminalCommands.NEW.id,
            label: nls_1.nls.localizeByDefault('New Terminal'),
            order: '0'
        });
        menus.registerMenuAction(TerminalMenus.TERMINAL_NEW, {
            commandId: TerminalCommands.PROFILE_NEW.id,
            label: nls_1.nls.localize('theia/terminal/profileNew', 'New Terminal (With Profile)...'),
            order: '1'
        });
        menus.registerMenuAction(TerminalMenus.TERMINAL_NEW, {
            commandId: TerminalCommands.PROFILE_DEFAULT.id,
            label: nls_1.nls.localize('theia/terminal/profileDefault', 'Choose Default Profile...'),
            order: '3'
        });
        menus.registerMenuAction(TerminalMenus.TERMINAL_NEW, {
            commandId: TerminalCommands.SPLIT.id,
            order: '3'
        });
        menus.registerMenuAction(TerminalMenus.TERMINAL_NAVIGATOR_CONTEXT_MENU, {
            commandId: TerminalCommands.TERMINAL_CONTEXT.id,
            order: 'z'
        });
        menus.registerMenuAction(TerminalMenus.TERMINAL_OPEN_EDITORS_CONTEXT_MENU, {
            commandId: TerminalCommands.TERMINAL_CONTEXT.id,
            order: 'z'
        });
        menus.registerMenuAction([...TerminalMenus.TERMINAL_CONTEXT_MENU, '_1'], {
            commandId: TerminalCommands.NEW_ACTIVE_WORKSPACE.id,
            label: nls_1.nls.localizeByDefault('New Terminal')
        });
        menus.registerMenuAction([...TerminalMenus.TERMINAL_CONTEXT_MENU, '_1'], {
            commandId: TerminalCommands.SPLIT.id
        });
        menus.registerMenuAction([...TerminalMenus.TERMINAL_CONTEXT_MENU, '_2'], {
            commandId: browser_1.CommonCommands.COPY.id
        });
        menus.registerMenuAction([...TerminalMenus.TERMINAL_CONTEXT_MENU, '_2'], {
            commandId: browser_1.CommonCommands.PASTE.id
        });
        menus.registerMenuAction([...TerminalMenus.TERMINAL_CONTEXT_MENU, '_2'], {
            commandId: TerminalCommands.SELECT_ALL.id
        });
        menus.registerMenuAction([...TerminalMenus.TERMINAL_CONTEXT_MENU, '_3'], {
            commandId: TerminalCommands.TERMINAL_CLEAR.id
        });
        menus.registerMenuAction([...TerminalMenus.TERMINAL_CONTEXT_MENU, '_4'], {
            commandId: TerminalCommands.KILL_TERMINAL.id
        });
    }
    registerToolbarItems(toolbar) {
        toolbar.registerItem({
            id: TerminalCommands.SPLIT.id,
            command: TerminalCommands.SPLIT.id,
            icon: (0, browser_1.codicon)('split-horizontal'),
            tooltip: TerminalCommands.SPLIT.label
        });
    }
    registerKeybindings(keybindings) {
        /* Register passthrough keybindings for combinations recognized by
           xterm.js and converted to control characters.
             See: https://github.com/xtermjs/xterm.js/blob/v3/src/Terminal.ts#L1684 */
        /* Register ctrl + k (the passed Key) as a passthrough command in the
           context of the terminal.  */
        const regCtrl = (k) => {
            keybindings.registerKeybinding({
                command: browser_1.KeybindingRegistry.PASSTHROUGH_PSEUDO_COMMAND,
                keybinding: browser_1.KeyCode.createKeyCode({ key: k, ctrl: true }).toString(),
                when: 'terminalFocus',
            });
        };
        /* Register alt + k (the passed Key) as a passthrough command in the
           context of the terminal.  */
        const regAlt = (k) => {
            keybindings.registerKeybinding({
                command: browser_1.KeybindingRegistry.PASSTHROUGH_PSEUDO_COMMAND,
                keybinding: browser_1.KeyCode.createKeyCode({ key: k, alt: true }).toString(),
                when: 'terminalFocus'
            });
        };
        /* ctrl-space (000 - NUL).  */
        regCtrl(browser_1.Key.SPACE);
        /* ctrl-A (001/1/0x1) through ctrl-Z (032/26/0x1A).  */
        for (let i = 0; i < 26; i++) {
            regCtrl({
                keyCode: browser_1.Key.KEY_A.keyCode + i,
                code: 'Key' + String.fromCharCode('A'.charCodeAt(0) + i)
            });
        }
        /* ctrl-[ or ctrl-3 (033/27/0x1B - ESC).  */
        regCtrl(browser_1.Key.BRACKET_LEFT);
        regCtrl(browser_1.Key.DIGIT3);
        /* ctrl-\ or ctrl-4 (034/28/0x1C - FS).  */
        regCtrl(browser_1.Key.BACKSLASH);
        regCtrl(browser_1.Key.DIGIT4);
        /* ctrl-] or ctrl-5 (035/29/0x1D - GS).  */
        regCtrl(browser_1.Key.BRACKET_RIGHT);
        regCtrl(browser_1.Key.DIGIT5);
        /* ctrl-6 (036/30/0x1E - RS).  */
        regCtrl(browser_1.Key.DIGIT6);
        /* ctrl-7 (037/31/0x1F - US).  */
        regCtrl(browser_1.Key.DIGIT7);
        /* ctrl-8 (177/127/0x7F - DEL).  */
        regCtrl(browser_1.Key.DIGIT8);
        /* alt-A (0x1B 0x62) through alt-Z (0x1B 0x7A).  */
        for (let i = 0; i < 26; i++) {
            regAlt({
                keyCode: browser_1.Key.KEY_A.keyCode + i,
                code: 'Key' + String.fromCharCode('A'.charCodeAt(0) + i)
            });
        }
        /* alt-` (0x1B 0x60).  */
        regAlt(browser_1.Key.BACKQUOTE);
        /* alt-0 (0x1B 0x30) through alt-9 (0x1B 0x39).  */
        for (let i = 0; i < 10; i++) {
            regAlt({
                keyCode: browser_1.Key.DIGIT0.keyCode + i,
                code: 'Digit' + String.fromCharCode('0'.charCodeAt(0) + i)
            });
        }
        if (common_1.isOSX) {
            // selectAll on OSX
            keybindings.registerKeybinding({
                command: browser_1.KeybindingRegistry.PASSTHROUGH_PSEUDO_COMMAND,
                keybinding: 'ctrlcmd+a',
                when: 'terminalFocus'
            });
        }
        keybindings.registerKeybinding({
            command: TerminalCommands.NEW.id,
            keybinding: 'ctrl+shift+`'
        });
        keybindings.registerKeybinding({
            command: TerminalCommands.NEW_ACTIVE_WORKSPACE.id,
            keybinding: 'ctrl+`'
        });
        keybindings.registerKeybinding({
            command: TerminalCommands.TERMINAL_CLEAR.id,
            keybinding: 'ctrlcmd+k',
            when: 'terminalFocus'
        });
        keybindings.registerKeybinding({
            command: TerminalCommands.TERMINAL_FIND_TEXT.id,
            keybinding: 'ctrlcmd+f',
            when: 'terminalFocus'
        });
        keybindings.registerKeybinding({
            command: TerminalCommands.TERMINAL_FIND_TEXT_CANCEL.id,
            keybinding: 'esc',
            when: 'terminalHideSearch'
        });
        keybindings.registerKeybinding({
            command: TerminalCommands.SCROLL_LINE_UP.id,
            keybinding: 'ctrl+shift+up',
            when: 'terminalFocus'
        });
        keybindings.registerKeybinding({
            command: TerminalCommands.SCROLL_LINE_DOWN.id,
            keybinding: 'ctrl+shift+down',
            when: 'terminalFocus'
        });
        keybindings.registerKeybinding({
            command: TerminalCommands.SCROLL_TO_TOP.id,
            keybinding: 'shift-home',
            when: 'terminalFocus'
        });
        keybindings.registerKeybinding({
            command: TerminalCommands.SCROLL_PAGE_UP.id,
            keybinding: 'shift-pageUp',
            when: 'terminalFocus'
        });
        keybindings.registerKeybinding({
            command: TerminalCommands.SCROLL_PAGE_DOWN.id,
            keybinding: 'shift-pageDown',
            when: 'terminalFocus'
        });
        keybindings.registerKeybinding({
            command: TerminalCommands.TOGGLE_TERMINAL.id,
            keybinding: 'ctrl+`',
        });
        keybindings.registerKeybinding({
            command: TerminalCommands.SELECT_ALL.id,
            keybinding: 'ctrlcmd+a',
            when: 'terminalFocus'
        });
    }
    async newTerminal(options) {
        const widget = await this.widgetManager.getOrCreateWidget(terminal_widget_impl_1.TERMINAL_WIDGET_FACTORY_ID, {
            created: new Date().toISOString(),
            ...options
        });
        return widget;
    }
    // TODO: reuse WidgetOpenHandler.open
    open(widget, options) {
        var _a;
        const area = widget.location === terminal_widget_1.TerminalLocation.Editor ? 'main' : 'bottom';
        const widgetOptions = { area: area, ...options === null || options === void 0 ? void 0 : options.widgetOptions };
        let preserveFocus = false;
        if (typeof widget.location === 'object') {
            if ('parentTerminal' in widget.location) {
                widgetOptions.ref = this.getById(widget.location.parentTerminal);
                widgetOptions.mode = 'split-right';
            }
            else if ('viewColumn' in widget.location) {
                preserveFocus = (_a = widget.location.preserveFocus) !== null && _a !== void 0 ? _a : false;
                switch (widget.location.viewColumn) {
                    case common_1.ViewColumn.Active:
                        widgetOptions.ref = this.shell.currentWidget;
                        widgetOptions.mode = 'tab-after';
                        break;
                    case common_1.ViewColumn.Beside:
                        widgetOptions.ref = this.shell.currentWidget;
                        widgetOptions.mode = 'split-right';
                        break;
                    default:
                        widgetOptions.area = 'main';
                        const mainAreaTerminals = this.shell.getWidgets('main').filter(w => w instanceof terminal_widget_1.TerminalWidget && w.isVisible);
                        const column = Math.min(widget.location.viewColumn, mainAreaTerminals.length);
                        widgetOptions.mode = widget.location.viewColumn <= mainAreaTerminals.length ? 'split-left' : 'split-right';
                        widgetOptions.ref = mainAreaTerminals[column - 1];
                }
            }
        }
        const op = {
            mode: 'activate',
            ...options,
            widgetOptions: widgetOptions
        };
        if (!widget.isAttached) {
            this.shell.addWidget(widget, op.widgetOptions);
        }
        if (op.mode === 'activate' && !preserveFocus) {
            this.shell.activateWidget(widget.id);
        }
        else if (op.mode === 'reveal' || preserveFocus) {
            this.shell.revealWidget(widget.id);
        }
    }
    async selectTerminalCwd() {
        return new Promise(async (resolve) => {
            var _a, _b;
            const roots = this.workspaceService.tryGetRoots();
            if (roots.length === 0) {
                resolve(undefined);
            }
            else if (roots.length === 1) {
                resolve(roots[0].resource.toString());
            }
            else {
                const items = roots.map(({ resource }) => ({
                    label: this.labelProvider.getName(resource),
                    description: this.labelProvider.getLongName(resource),
                    resource
                }));
                const selectedItem = await ((_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.showQuickPick(items, {
                    placeholder: nls_1.nls.localizeByDefault('Select current working directory for new terminal')
                }));
                resolve((_b = selectedItem === null || selectedItem === void 0 ? void 0 : selectedItem.resource) === null || _b === void 0 ? void 0 : _b.toString());
            }
        });
    }
    async selectTerminalProfile(placeholder) {
        return new Promise(async (resolve) => {
            var _a;
            const profiles = this.profileService.all;
            if (profiles.length === 0) {
                resolve(undefined);
            }
            else {
                const items = profiles.map(([id, profile]) => ({
                    label: id,
                    profile
                }));
                const selectedItem = await ((_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.showQuickPick(items, {
                    placeholder
                }));
                resolve(selectedItem ? [selectedItem.label, selectedItem.profile] : undefined);
            }
        });
    }
    async splitTerminal(referenceTerminal) {
        if (referenceTerminal || this.currentTerminal) {
            const ref = referenceTerminal !== null && referenceTerminal !== void 0 ? referenceTerminal : this.currentTerminal;
            await this.openTerminal({ ref, mode: 'split-right' });
        }
    }
    async openTerminal(options, terminalProfile) {
        let profile = terminalProfile;
        if (!terminalProfile) {
            profile = this.profileService.defaultProfile;
            if (!profile) {
                throw new Error('There are not profiles registered');
            }
        }
        if (profile instanceof shell_terminal_profile_1.ShellTerminalProfile) {
            if (this.workspaceService.workspace) {
                const cwd = await this.selectTerminalCwd();
                if (!cwd) {
                    return;
                }
                profile = profile.modify({ cwd });
            }
        }
        const termWidget = await (profile === null || profile === void 0 ? void 0 : profile.start());
        if (!!termWidget) {
            this.open(termWidget, { widgetOptions: options });
        }
    }
    async chooseDefaultProfile() {
        const result = await this.selectTerminalProfile(nls_1.nls.localizeByDefault('Select your default terminal profile'));
        if (!result) {
            return;
        }
        this.preferenceService.set(`terminal.integrated.defaultProfile.${common_1.OS.backend.type().toLowerCase()}`, result[0], browser_1.PreferenceScope.User);
    }
    async openActiveWorkspaceTerminal(options) {
        const termWidget = await this.newTerminal({});
        termWidget.start();
        this.open(termWidget, { widgetOptions: options });
    }
    withWidget(widget, fn) {
        if (widget instanceof terminal_widget_1.TerminalWidget) {
            return fn(widget);
        }
        return false;
    }
    /**
     * It should be aligned with https://code.visualstudio.com/api/references/theme-color#integrated-terminal-colors
     */
    registerColors(colors) {
        colors.register({
            id: 'terminal.background',
            defaults: {
                dark: 'panel.background',
                light: 'panel.background',
                hcDark: 'panel.background',
                hcLight: 'panel.background'
            },
            description: 'The background color of the terminal, this allows coloring the terminal differently to the panel.'
        });
        colors.register({
            id: 'terminal.foreground',
            defaults: {
                light: '#333333',
                dark: '#CCCCCC',
                hcDark: '#FFFFFF',
                hcLight: '#292929'
            },
            description: 'The foreground color of the terminal.'
        });
        colors.register({
            id: 'terminalCursor.foreground',
            description: 'The foreground color of the terminal cursor.'
        });
        colors.register({
            id: 'terminalCursor.background',
            description: 'The background color of the terminal cursor. Allows customizing the color of a character overlapped by a block cursor.'
        });
        colors.register({
            id: 'terminal.selectionBackground',
            defaults: {
                light: 'editor.selectionBackground',
                dark: 'editor.selectionBackground',
                hcDark: 'editor.selectionBackground',
                hcLight: 'editor.selectionBackground'
            },
            description: 'The selection background color of the terminal.'
        });
        colors.register({
            id: 'terminal.border',
            defaults: {
                light: 'panel.border',
                dark: 'panel.border',
                hcDark: 'panel.border',
                hcLight: 'panel.border'
            },
            description: 'The color of the border that separates split panes within the terminal. This defaults to panel.border.'
        });
        // eslint-disable-next-line guard-for-in
        for (const id in terminal_theme_service_1.terminalAnsiColorMap) {
            const entry = terminal_theme_service_1.terminalAnsiColorMap[id];
            const colorName = id.substring(13);
            colors.register({
                id,
                defaults: entry.defaults,
                description: `'${colorName}'  ANSI color in the terminal.`
            });
        }
    }
};
__decorate([
    (0, inversify_1.inject)(browser_1.ApplicationShell),
    __metadata("design:type", browser_1.ApplicationShell)
], TerminalFrontendContribution.prototype, "shell", void 0);
__decorate([
    (0, inversify_1.inject)(shell_terminal_protocol_1.ShellTerminalServerProxy),
    __metadata("design:type", Object)
], TerminalFrontendContribution.prototype, "shellTerminalServer", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.WidgetManager),
    __metadata("design:type", browser_1.WidgetManager)
], TerminalFrontendContribution.prototype, "widgetManager", void 0);
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], TerminalFrontendContribution.prototype, "fileService", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.SelectionService),
    __metadata("design:type", common_1.SelectionService)
], TerminalFrontendContribution.prototype, "selectionService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.LabelProvider),
    __metadata("design:type", browser_1.LabelProvider)
], TerminalFrontendContribution.prototype, "labelProvider", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.QuickInputService),
    (0, inversify_1.optional)(),
    __metadata("design:type", Object)
], TerminalFrontendContribution.prototype, "quickInputService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.WorkspaceService),
    __metadata("design:type", browser_2.WorkspaceService)
], TerminalFrontendContribution.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(terminal_profile_service_1.TerminalProfileService),
    __metadata("design:type", Object)
], TerminalFrontendContribution.prototype, "profileService", void 0);
__decorate([
    (0, inversify_1.inject)(terminal_profile_service_1.UserTerminalProfileStore),
    __metadata("design:type", Object)
], TerminalFrontendContribution.prototype, "userProfileStore", void 0);
__decorate([
    (0, inversify_1.inject)(terminal_profile_service_1.ContributedTerminalProfileStore),
    __metadata("design:type", Object)
], TerminalFrontendContribution.prototype, "contributedProfileStore", void 0);
__decorate([
    (0, inversify_1.inject)(terminal_watcher_1.TerminalWatcher),
    __metadata("design:type", terminal_watcher_1.TerminalWatcher)
], TerminalFrontendContribution.prototype, "terminalWatcher", void 0);
__decorate([
    (0, inversify_1.inject)(browser_3.VariableResolverService),
    __metadata("design:type", browser_3.VariableResolverService)
], TerminalFrontendContribution.prototype, "variableResolver", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.StorageService),
    __metadata("design:type", Object)
], TerminalFrontendContribution.prototype, "storageService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.PreferenceService),
    __metadata("design:type", Object)
], TerminalFrontendContribution.prototype, "preferenceService", void 0);
__decorate([
    (0, inversify_1.inject)(terminal_preferences_1.TerminalPreferences),
    __metadata("design:type", Object)
], TerminalFrontendContribution.prototype, "terminalPreferences", void 0);
__decorate([
    (0, inversify_1.inject)(context_key_service_1.ContextKeyService),
    __metadata("design:type", Object)
], TerminalFrontendContribution.prototype, "contextKeyService", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TerminalFrontendContribution.prototype, "init", null);
TerminalFrontendContribution = __decorate([
    (0, inversify_1.injectable)()
], TerminalFrontendContribution);
exports.TerminalFrontendContribution = TerminalFrontendContribution;
//# sourceMappingURL=terminal-frontend-contribution.js.map