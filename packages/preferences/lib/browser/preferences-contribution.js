"use strict";
// *****************************************************************************
// Copyright (C) 2018 Ericsson and others.
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
exports.PreferencesContribution = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const core_1 = require("@theia/core");
const browser_1 = require("@theia/core/lib/browser");
const os_1 = require("@theia/core/lib/common/os");
const browser_2 = require("@theia/editor/lib/browser");
const preference_widget_1 = require("./views/preference-widget");
const workspace_preference_provider_1 = require("./workspace-preference-provider");
const preference_types_1 = require("./util/preference-types");
const clipboard_service_1 = require("@theia/core/lib/browser/clipboard-service");
const file_service_1 = require("@theia/filesystem/lib/browser/file-service");
const browser_3 = require("@theia/workspace/lib/browser");
let PreferencesContribution = class PreferencesContribution extends browser_1.AbstractViewContribution {
    constructor() {
        super({
            widgetId: preference_widget_1.PreferencesWidget.ID,
            widgetName: preference_widget_1.PreferencesWidget.LABEL,
            defaultWidgetOptions: {
                area: 'main',
            },
        });
    }
    registerCommands(commands) {
        commands.registerCommand(browser_1.CommonCommands.OPEN_PREFERENCES, {
            execute: async (query) => {
                const widget = await this.openView({ activate: true });
                if (typeof query === 'string') {
                    widget.setSearchTerm(query);
                }
            },
        });
        commands.registerCommand(preference_types_1.PreferencesCommands.OPEN_PREFERENCES_JSON_TOOLBAR, {
            isEnabled: () => true,
            isVisible: w => this.withWidget(w, () => true),
            execute: (preferenceId) => {
                this.openPreferencesJSON(preferenceId);
            }
        });
        commands.registerCommand(preference_types_1.PreferencesCommands.COPY_JSON_NAME, {
            isEnabled: preference_types_1.Preference.EditorCommandArgs.is,
            isVisible: preference_types_1.Preference.EditorCommandArgs.is,
            execute: ({ id, value }) => {
                this.clipboardService.writeText(id);
            }
        });
        commands.registerCommand(preference_types_1.PreferencesCommands.COPY_JSON_VALUE, {
            isEnabled: preference_types_1.Preference.EditorCommandArgs.is,
            isVisible: preference_types_1.Preference.EditorCommandArgs.is,
            execute: ({ id, value }) => {
                const jsonString = `"${id}": ${JSON.stringify(value)}`;
                this.clipboardService.writeText(jsonString);
            }
        });
        commands.registerCommand(preference_types_1.PreferencesCommands.RESET_PREFERENCE, {
            isEnabled: preference_types_1.Preference.EditorCommandArgs.is,
            isVisible: preference_types_1.Preference.EditorCommandArgs.is,
            execute: ({ id }) => {
                this.preferenceService.set(id, undefined, Number(this.scopeTracker.currentScope.scope), this.scopeTracker.currentScope.uri);
            }
        });
        commands.registerCommand(preference_types_1.PreferencesCommands.OPEN_USER_PREFERENCES, {
            execute: async () => {
                const widget = await this.openView({ activate: true });
                widget.setScope(browser_1.PreferenceScope.User);
            }
        });
        commands.registerCommand(preference_types_1.PreferencesCommands.OPEN_WORKSPACE_PREFERENCES, {
            isEnabled: () => !!this.workspaceService.workspace,
            isVisible: () => !!this.workspaceService.workspace,
            execute: async () => {
                const widget = await this.openView({ activate: true });
                widget.setScope(browser_1.PreferenceScope.Workspace);
            }
        });
        commands.registerCommand(preference_types_1.PreferencesCommands.OPEN_FOLDER_PREFERENCES, {
            isEnabled: () => !!this.workspaceService.isMultiRootWorkspaceOpened && this.workspaceService.tryGetRoots().length > 0,
            isVisible: () => !!this.workspaceService.isMultiRootWorkspaceOpened && this.workspaceService.tryGetRoots().length > 0,
            execute: () => this.openFolderPreferences(root => {
                this.openView({ activate: true });
                this.scopeTracker.setScope(root.resource);
            })
        });
        commands.registerCommand(preference_types_1.PreferencesCommands.OPEN_USER_PREFERENCES_JSON, {
            execute: async () => this.openJson(browser_1.PreferenceScope.User)
        });
        commands.registerCommand(preference_types_1.PreferencesCommands.OPEN_WORKSPACE_PREFERENCES_JSON, {
            isEnabled: () => !!this.workspaceService.workspace,
            isVisible: () => !!this.workspaceService.workspace,
            execute: async () => this.openJson(browser_1.PreferenceScope.Workspace)
        });
        commands.registerCommand(preference_types_1.PreferencesCommands.OPEN_FOLDER_PREFERENCES_JSON, {
            isEnabled: () => !!this.workspaceService.isMultiRootWorkspaceOpened && this.workspaceService.tryGetRoots().length > 0,
            isVisible: () => !!this.workspaceService.isMultiRootWorkspaceOpened && this.workspaceService.tryGetRoots().length > 0,
            execute: () => this.openFolderPreferences(root => this.openJson(browser_1.PreferenceScope.Folder, root.resource.toString()))
        });
    }
    registerMenus(menus) {
        menus.registerMenuAction(browser_1.CommonMenus.FILE_SETTINGS_SUBMENU_OPEN, {
            commandId: browser_1.CommonCommands.OPEN_PREFERENCES.id,
            label: core_1.nls.localizeByDefault('Settings'),
            order: 'a10',
        });
        menus.registerMenuAction(browser_1.CommonMenus.SETTINGS_OPEN, {
            commandId: browser_1.CommonCommands.OPEN_PREFERENCES.id,
            label: core_1.nls.localizeByDefault('Settings'),
            order: 'a10',
        });
        menus.registerMenuAction(preference_types_1.PreferenceMenus.PREFERENCE_EDITOR_CONTEXT_MENU, {
            commandId: preference_types_1.PreferencesCommands.RESET_PREFERENCE.id,
            label: preference_types_1.PreferencesCommands.RESET_PREFERENCE.label,
            order: 'a'
        });
        menus.registerMenuAction(preference_types_1.PreferenceMenus.PREFERENCE_EDITOR_COPY_ACTIONS, {
            commandId: preference_types_1.PreferencesCommands.COPY_JSON_VALUE.id,
            label: preference_types_1.PreferencesCommands.COPY_JSON_VALUE.label,
            order: 'b'
        });
        menus.registerMenuAction(preference_types_1.PreferenceMenus.PREFERENCE_EDITOR_COPY_ACTIONS, {
            commandId: preference_types_1.PreferencesCommands.COPY_JSON_NAME.id,
            label: preference_types_1.PreferencesCommands.COPY_JSON_NAME.label,
            order: 'c'
        });
    }
    registerKeybindings(keybindings) {
        keybindings.registerKeybinding({
            command: browser_1.CommonCommands.OPEN_PREFERENCES.id,
            keybinding: (os_1.isOSX && !browser_1.isFirefox) ? 'cmd+,' : 'ctrl+,'
        });
    }
    registerToolbarItems(toolbar) {
        toolbar.registerItem({
            id: preference_types_1.PreferencesCommands.OPEN_PREFERENCES_JSON_TOOLBAR.id,
            command: preference_types_1.PreferencesCommands.OPEN_PREFERENCES_JSON_TOOLBAR.id,
            tooltip: preference_types_1.PreferencesCommands.OPEN_USER_PREFERENCES_JSON.label,
            priority: 0,
        });
    }
    async openPreferencesJSON(opener) {
        var _a;
        const { scope, activeScopeIsFolder, uri } = this.scopeTracker.currentScope;
        const scopeID = Number(scope);
        let preferenceId = '';
        if (typeof opener === 'string') {
            preferenceId = opener;
            const currentPreferenceValue = this.preferenceService.inspect(preferenceId, uri);
            const valueInCurrentScope = (_a = preference_types_1.Preference.getValueInScope(currentPreferenceValue, scopeID)) !== null && _a !== void 0 ? _a : currentPreferenceValue === null || currentPreferenceValue === void 0 ? void 0 : currentPreferenceValue.defaultValue;
            this.preferenceService.set(preferenceId, valueInCurrentScope, scopeID, uri);
        }
        let jsonEditorWidget;
        const jsonUriToOpen = await this.obtainConfigUri(scopeID, activeScopeIsFolder, uri);
        if (jsonUriToOpen) {
            jsonEditorWidget = await this.editorManager.open(jsonUriToOpen);
            if (preferenceId) {
                const text = jsonEditorWidget.editor.document.getText();
                if (preferenceId) {
                    const { index } = text.match(preferenceId);
                    const numReturns = text.slice(0, index).match(new RegExp('\n', 'g')).length;
                    jsonEditorWidget.editor.cursor = { line: numReturns, character: 4 + preferenceId.length + 4 };
                }
            }
        }
    }
    async openJson(scope, resource) {
        const jsonUriToOpen = await this.obtainConfigUri(scope, false, resource);
        if (jsonUriToOpen) {
            await this.editorManager.open(jsonUriToOpen);
        }
    }
    /**
     * Prompts which workspace root folder to open the JSON settings.
     */
    async openFolderPreferences(callback) {
        var _a;
        const roots = this.workspaceService.tryGetRoots();
        if (roots.length === 1) {
            callback(roots[0]);
        }
        else {
            const items = roots.map(root => ({
                label: root.name,
                description: root.resource.path.fsPath(),
                execute: () => callback(root)
            }));
            (_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.showQuickPick(items, { placeholder: 'Select workspace folder' });
        }
    }
    async obtainConfigUri(serializedScope, activeScopeIsFolder, resource) {
        let scope = serializedScope;
        if (activeScopeIsFolder) {
            scope = browser_1.PreferenceScope.Folder;
        }
        const resourceUri = !!resource ? resource : undefined;
        const configUri = this.preferenceService.getConfigUri(scope, resourceUri);
        if (!configUri) {
            return undefined;
        }
        if (configUri && !await this.fileService.exists(configUri)) {
            await this.fileService.create(configUri);
        }
        return configUri;
    }
    /**
     * Determine if the current widget is the PreferencesWidget.
     */
    withWidget(widget = this.tryGetWidget(), fn) {
        if (widget instanceof preference_widget_1.PreferencesWidget && widget.id === preference_widget_1.PreferencesWidget.ID) {
            return fn(widget);
        }
        return false;
    }
};
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], PreferencesContribution.prototype, "fileService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.PreferenceProvider),
    (0, inversify_1.named)(browser_1.PreferenceScope.Workspace),
    __metadata("design:type", workspace_preference_provider_1.WorkspacePreferenceProvider)
], PreferencesContribution.prototype, "workspacePreferenceProvider", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.EditorManager),
    __metadata("design:type", browser_2.EditorManager)
], PreferencesContribution.prototype, "editorManager", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.PreferenceService),
    __metadata("design:type", Object)
], PreferencesContribution.prototype, "preferenceService", void 0);
__decorate([
    (0, inversify_1.inject)(clipboard_service_1.ClipboardService),
    __metadata("design:type", Object)
], PreferencesContribution.prototype, "clipboardService", void 0);
__decorate([
    (0, inversify_1.inject)(preference_widget_1.PreferencesWidget),
    __metadata("design:type", preference_widget_1.PreferencesWidget)
], PreferencesContribution.prototype, "scopeTracker", void 0);
__decorate([
    (0, inversify_1.inject)(browser_3.WorkspaceService),
    __metadata("design:type", browser_3.WorkspaceService)
], PreferencesContribution.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.QuickInputService),
    (0, inversify_1.optional)(),
    __metadata("design:type", Object)
], PreferencesContribution.prototype, "quickInputService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.PreferenceSchemaProvider),
    __metadata("design:type", browser_1.PreferenceSchemaProvider)
], PreferencesContribution.prototype, "schema", void 0);
PreferencesContribution = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], PreferencesContribution);
exports.PreferencesContribution = PreferencesContribution;
//# sourceMappingURL=preferences-contribution.js.map