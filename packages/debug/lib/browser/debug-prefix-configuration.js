"use strict";
// *****************************************************************************
// Copyright (C) 2019 Ericsson and others.
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
var DebugPrefixConfiguration_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebugPrefixConfiguration = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const command_1 = require("@theia/core/lib/common/command");
const debug_session_manager_1 = require("./debug-session-manager");
const debug_configuration_manager_1 = require("./debug-configuration-manager");
const debug_frontend_application_contribution_1 = require("./debug-frontend-application-contribution");
const browser_1 = require("@theia/workspace/lib/browser");
const label_provider_1 = require("@theia/core/lib/browser/label-provider");
const uri_1 = require("@theia/core/lib/common/uri");
const browser_2 = require("@theia/core/lib/browser");
const debug_preferences_1 = require("./debug-preferences");
const quick_input_service_1 = require("@theia/core/lib/browser/quick-input/quick-input-service");
let DebugPrefixConfiguration = DebugPrefixConfiguration_1 = class DebugPrefixConfiguration {
    constructor() {
        this.statusBarId = 'select-run-debug-statusbar-item';
        this.command = command_1.Command.toDefaultLocalizedCommand({
            id: 'select.debug.configuration',
            category: debug_frontend_application_contribution_1.DebugCommands.DEBUG_CATEGORY,
            label: 'Select and Start Debugging'
        });
    }
    init() {
        this.handleDebugStatusBarVisibility();
        this.preference.onPreferenceChanged(e => {
            if (e.preferenceName === 'debug.showInStatusBar') {
                this.handleDebugStatusBarVisibility();
            }
        });
        const toDisposeOnStart = this.debugSessionManager.onDidStartDebugSession(() => {
            toDisposeOnStart.dispose();
            this.handleDebugStatusBarVisibility(true);
            this.debugConfigurationManager.onDidChange(() => this.handleDebugStatusBarVisibility(true));
        });
    }
    execute() {
        var _a;
        (_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.open(DebugPrefixConfiguration_1.PREFIX);
    }
    isEnabled() {
        return true;
    }
    isVisible() {
        return true;
    }
    registerCommands(commands) {
        commands.registerCommand(this.command, this);
    }
    registerQuickAccessProvider() {
        this.quickAccessRegistry.registerQuickAccessProvider({
            getInstance: () => this,
            prefix: DebugPrefixConfiguration_1.PREFIX,
            placeholder: '',
            helpEntries: [{ description: 'Debug Configuration', needsEditor: false }]
        });
    }
    resolveRootFolderName(uri) {
        return uri && this.workspaceService.isMultiRootWorkspaceOpened
            ? this.labelProvider.getName(new uri_1.default(uri))
            : '';
    }
    async getPicks(filter, token) {
        const items = [];
        const configurations = this.debugConfigurationManager.all;
        for (const config of configurations) {
            items.push({
                label: config.name,
                description: this.resolveRootFolderName(config.workspaceFolderUri),
                execute: () => this.runConfiguration(config)
            });
        }
        // Resolve dynamic configurations from providers
        const record = await this.debugConfigurationManager.provideDynamicDebugConfigurations();
        for (const [providerType, configurationOptions] of Object.entries(record)) {
            if (configurationOptions.length > 0) {
                items.push({
                    label: providerType,
                    type: 'separator'
                });
            }
            for (const options of configurationOptions) {
                items.push({
                    label: options.name,
                    description: this.resolveRootFolderName(options.workspaceFolderUri),
                    execute: () => this.runConfiguration({ name: options.name, configuration: options.configuration, providerType, workspaceFolderUri: options.workspaceFolderUri })
                });
            }
        }
        return (0, quick_input_service_1.filterItems)(items, filter);
    }
    /**
     * Set the current debug configuration, and execute debug start command.
     *
     * @param configurationOptions the `DebugSessionOptions`.
     */
    runConfiguration(configurationOptions) {
        this.debugConfigurationManager.current = configurationOptions;
        this.commandRegistry.executeCommand(debug_frontend_application_contribution_1.DebugCommands.START.id);
    }
    /**
     * Handle the visibility of the debug status bar.
     * @param event the preference change event.
     */
    handleDebugStatusBarVisibility(started) {
        const showInStatusBar = this.preference['debug.showInStatusBar'];
        if (showInStatusBar === 'never') {
            return this.removeDebugStatusBar();
        }
        else if (showInStatusBar === 'always' || started) {
            return this.updateStatusBar();
        }
    }
    /**
     * Update the debug status bar element based on the current configuration.
     */
    updateStatusBar() {
        const text = this.debugConfigurationManager.current
            ? this.debugConfigurationManager.current.name
            : '';
        const icon = '$(codicon-debug-alt-small)';
        this.statusBar.setElement(this.statusBarId, {
            alignment: browser_2.StatusBarAlignment.LEFT,
            text: text.length ? `${icon} ${text}` : icon,
            tooltip: this.command.label,
            command: this.command.id,
        });
    }
    /**
     * Remove the debug status bar element.
     */
    removeDebugStatusBar() {
        this.statusBar.removeElement(this.statusBarId);
    }
};
DebugPrefixConfiguration.PREFIX = 'debug ';
__decorate([
    (0, inversify_1.inject)(command_1.CommandRegistry),
    __metadata("design:type", command_1.CommandRegistry)
], DebugPrefixConfiguration.prototype, "commandRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(debug_session_manager_1.DebugSessionManager),
    __metadata("design:type", debug_session_manager_1.DebugSessionManager)
], DebugPrefixConfiguration.prototype, "debugSessionManager", void 0);
__decorate([
    (0, inversify_1.inject)(debug_preferences_1.DebugPreferences),
    __metadata("design:type", Object)
], DebugPrefixConfiguration.prototype, "preference", void 0);
__decorate([
    (0, inversify_1.inject)(debug_configuration_manager_1.DebugConfigurationManager),
    __metadata("design:type", debug_configuration_manager_1.DebugConfigurationManager)
], DebugPrefixConfiguration.prototype, "debugConfigurationManager", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.QuickInputService),
    (0, inversify_1.optional)(),
    __metadata("design:type", Object)
], DebugPrefixConfiguration.prototype, "quickInputService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.QuickAccessRegistry),
    __metadata("design:type", Object)
], DebugPrefixConfiguration.prototype, "quickAccessRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.WorkspaceService),
    __metadata("design:type", browser_1.WorkspaceService)
], DebugPrefixConfiguration.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(label_provider_1.LabelProvider),
    __metadata("design:type", label_provider_1.LabelProvider)
], DebugPrefixConfiguration.prototype, "labelProvider", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.StatusBar),
    __metadata("design:type", Object)
], DebugPrefixConfiguration.prototype, "statusBar", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DebugPrefixConfiguration.prototype, "init", null);
DebugPrefixConfiguration = DebugPrefixConfiguration_1 = __decorate([
    (0, inversify_1.injectable)()
], DebugPrefixConfiguration);
exports.DebugPrefixConfiguration = DebugPrefixConfiguration;
//# sourceMappingURL=debug-prefix-configuration.js.map