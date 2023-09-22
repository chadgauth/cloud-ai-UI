"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VSXExtensionsContribution = void 0;
const luxon_1 = require("luxon");
const inversify_1 = require("@theia/core/shared/inversify");
const debounce = require("@theia/core/shared/lodash.debounce");
const command_1 = require("@theia/core/lib/common/command");
const view_contribution_1 = require("@theia/core/lib/browser/shell/view-contribution");
const vsx_extensions_view_container_1 = require("./vsx-extensions-view-container");
const vsx_extensions_model_1 = require("./vsx-extensions-model");
const color_1 = require("@theia/core/lib/common/color");
const common_1 = require("@theia/core/lib/common");
const browser_1 = require("@theia/filesystem/lib/browser");
const browser_2 = require("@theia/core/lib/browser");
const plugin_vscode_commands_contribution_1 = require("@theia/plugin-ext-vscode/lib/browser/plugin-vscode-commands-contribution");
const vsx_extension_1 = require("./vsx-extension");
const clipboard_service_1 = require("@theia/core/lib/browser/clipboard-service");
const vsx_extensions_search_model_1 = require("./vsx-extensions-search-model");
const recommended_extensions_preference_contribution_1 = require("./recommended-extensions/recommended-extensions-preference-contribution");
const vsx_extension_commands_1 = require("./vsx-extension-commands");
const ovsx_client_1 = require("@theia/ovsx-client");
const ovsx_client_provider_1 = require("../common/ovsx-client-provider");
let VSXExtensionsContribution = class VSXExtensionsContribution extends view_contribution_1.AbstractViewContribution {
    constructor() {
        super({
            widgetId: vsx_extensions_view_container_1.VSXExtensionsViewContainer.ID,
            widgetName: vsx_extensions_view_container_1.VSXExtensionsViewContainer.LABEL,
            defaultWidgetOptions: {
                area: 'left',
                rank: 500
            },
            toggleCommandId: 'vsxExtensions.toggle',
            toggleKeybinding: 'ctrlcmd+shift+x'
        });
    }
    init() {
        const oneShotDisposable = this.model.onDidChange(debounce(() => {
            this.showRecommendedToast();
            oneShotDisposable.dispose();
        }, 5000, { trailing: true }));
    }
    async initializeLayout(app) {
        await this.openView({ activate: false });
    }
    registerCommands(commands) {
        super.registerCommands(commands);
        commands.registerCommand(vsx_extension_commands_1.VSXExtensionsCommands.CLEAR_ALL, {
            execute: () => this.model.search.query = '',
            isEnabled: () => !!this.model.search.query,
            isVisible: () => true,
        });
        commands.registerCommand(vsx_extension_commands_1.VSXExtensionsCommands.INSTALL_FROM_VSIX, {
            execute: () => this.installFromVSIX()
        });
        commands.registerCommand(vsx_extension_commands_1.VSXExtensionsCommands.INSTALL_ANOTHER_VERSION, {
            // Check downloadUrl to ensure we have an idea of where to look for other versions.
            isEnabled: (extension) => !extension.builtin && !!extension.downloadUrl,
            execute: async (extension) => this.installAnotherVersion(extension),
        });
        commands.registerCommand(vsx_extension_commands_1.VSXExtensionsCommands.COPY, {
            execute: (extension) => this.copy(extension)
        });
        commands.registerCommand(vsx_extension_commands_1.VSXExtensionsCommands.COPY_EXTENSION_ID, {
            execute: (extension) => this.copyExtensionId(extension)
        });
        commands.registerCommand(vsx_extension_commands_1.VSXExtensionsCommands.SHOW_BUILTINS, {
            execute: () => this.showBuiltinExtensions()
        });
        commands.registerCommand(vsx_extension_commands_1.VSXExtensionsCommands.SHOW_INSTALLED, {
            execute: () => this.showInstalledExtensions()
        });
        commands.registerCommand(vsx_extension_commands_1.VSXExtensionsCommands.SHOW_RECOMMENDATIONS, {
            execute: () => this.showRecommendedExtensions()
        });
    }
    registerMenus(menus) {
        super.registerMenus(menus);
        menus.registerMenuAction(vsx_extension_1.VSXExtensionsContextMenu.COPY, {
            commandId: vsx_extension_commands_1.VSXExtensionsCommands.COPY.id,
            label: common_1.nls.localizeByDefault('Copy'),
            order: '0'
        });
        menus.registerMenuAction(vsx_extension_1.VSXExtensionsContextMenu.COPY, {
            commandId: vsx_extension_commands_1.VSXExtensionsCommands.COPY_EXTENSION_ID.id,
            label: common_1.nls.localizeByDefault('Copy Extension ID'),
            order: '1'
        });
        menus.registerMenuAction(vsx_extension_1.VSXExtensionsContextMenu.INSTALL, {
            commandId: vsx_extension_commands_1.VSXExtensionsCommands.INSTALL_ANOTHER_VERSION.id,
            label: common_1.nls.localizeByDefault('Install Another Version...'),
        });
    }
    registerColors(colors) {
        // VS Code colors should be aligned with https://code.visualstudio.com/api/references/theme-color#extensions
        colors.register({
            id: 'extensionButton.prominentBackground', defaults: {
                dark: '#327e36',
                light: '#327e36'
            }, description: 'Button background color for actions extension that stand out (e.g. install button).'
        }, {
            id: 'extensionButton.prominentForeground', defaults: {
                dark: color_1.Color.white,
                light: color_1.Color.white
            }, description: 'Button foreground color for actions extension that stand out (e.g. install button).'
        }, {
            id: 'extensionButton.prominentHoverBackground', defaults: {
                dark: '#28632b',
                light: '#28632b'
            }, description: 'Button background hover color for actions extension that stand out (e.g. install button).'
        }, {
            id: 'extensionEditor.tableHeadBorder', defaults: {
                dark: color_1.Color.transparent('#ffffff', 0.7),
                light: color_1.Color.transparent('#000000', 0.7),
                hcDark: color_1.Color.white,
                hcLight: color_1.Color.black
            }, description: 'Border color for the table head row of the extension editor view'
        }, {
            id: 'extensionEditor.tableCellBorder', defaults: {
                dark: color_1.Color.transparent('#ffffff', 0.2),
                light: color_1.Color.transparent('#000000', 0.2),
                hcDark: color_1.Color.white,
                hcLight: color_1.Color.black
            }, description: 'Border color for a table row of the extension editor view'
        });
    }
    /**
     * Installs a local .vsix file after prompting the `Open File` dialog. Resolves to the URI of the file.
     */
    async installFromVSIX() {
        const props = {
            title: vsx_extension_commands_1.VSXExtensionsCommands.INSTALL_FROM_VSIX.dialogLabel,
            openLabel: common_1.nls.localizeByDefault('Install from VSIX'),
            filters: { 'VSIX Extensions (*.vsix)': ['vsix'] },
            canSelectMany: false
        };
        const extensionUri = await this.fileDialogService.showOpenDialog(props);
        if (extensionUri) {
            if (extensionUri.path.ext === '.vsix') {
                const extensionName = this.labelProvider.getName(extensionUri);
                try {
                    await this.commandRegistry.executeCommand(plugin_vscode_commands_contribution_1.VscodeCommands.INSTALL_FROM_VSIX.id, extensionUri);
                    this.messageService.info(common_1.nls.localizeByDefault('Completed installing {0} extension from VSIX.', extensionName));
                }
                catch (e) {
                    this.messageService.error(common_1.nls.localize('theia/vsx-registry/failedInstallingVSIX', 'Failed to install {0} from VSIX.', extensionName));
                    console.warn(e);
                }
            }
            else {
                this.messageService.error(common_1.nls.localize('theia/vsx-registry/invalidVSIX', 'The selected file is not a valid "*.vsix" plugin.'));
            }
        }
    }
    /**
     * Given an extension, displays a quick pick of other compatible versions and installs the selected version.
     *
     * @param extension a VSX extension.
     */
    async installAnotherVersion(extension) {
        const extensionId = extension.id;
        const currentVersion = extension.version;
        const client = await this.clientProvider();
        const { extensions } = await client.query({ extensionId, includeAllVersions: true });
        const latestCompatible = this.vsxApiFilter.getLatestCompatibleExtension(extensions);
        let compatibleExtensions = [];
        let activeItem = undefined;
        if (latestCompatible) {
            compatibleExtensions = extensions.slice(extensions.findIndex(ext => ext.version === latestCompatible.version));
        }
        const items = compatibleExtensions.map(ext => {
            var _a;
            const item = {
                label: ext.version,
                description: (_a = luxon_1.DateTime.fromISO(ext.timestamp).toRelative({ locale: common_1.nls.locale })) !== null && _a !== void 0 ? _a : ''
            };
            if (currentVersion === ext.version) {
                item.description += ` (${common_1.nls.localizeByDefault('Current')})`;
                activeItem = item;
            }
            return item;
        });
        const selectedItem = await this.quickInput.showQuickPick(items, {
            placeholder: common_1.nls.localizeByDefault('Select Version to Install'),
            runIfSingle: false,
            activeItem
        });
        if (selectedItem) {
            const selectedExtension = this.model.getExtension(extensionId);
            if (selectedExtension) {
                await this.updateVersion(selectedExtension, selectedItem.label);
            }
        }
    }
    async copy(extension) {
        this.clipboardService.writeText(await extension.serialize());
    }
    copyExtensionId(extension) {
        this.clipboardService.writeText(extension.id);
    }
    /**
     * Updates an extension to a specific version.
     *
     * @param extension the extension to update.
     * @param updateToVersion the version to update to.
     * @param revertToVersion the version to revert to (in case of failure).
     */
    async updateVersion(extension, updateToVersion) {
        try {
            await extension.install({ version: updateToVersion, ignoreOtherVersions: true });
        }
        catch {
            this.messageService.warn(common_1.nls.localize('theia/vsx-registry/vsx-extensions-contribution/update-version-version-error', 'Failed to install version {0} of {1}.', updateToVersion, extension.displayName));
            return;
        }
        try {
            if (extension.version !== updateToVersion) {
                await extension.uninstall();
            }
        }
        catch {
            this.messageService.warn(common_1.nls.localize('theia/vsx-registry/vsx-extensions-contribution/update-version-uninstall-error', 'Error while removing the extension: {0}.', extension.displayName));
        }
    }
    async showRecommendedToast() {
        var _a;
        if (!this.preferenceService.get(recommended_extensions_preference_contribution_1.IGNORE_RECOMMENDATIONS_ID, false)) {
            const recommended = new Set([...this.model.recommended]);
            for (const installed of this.model.installed) {
                recommended.delete(installed);
            }
            if (recommended.size) {
                const install = common_1.nls.localizeByDefault('Install');
                const showRecommendations = common_1.nls.localizeByDefault('Show Recommendations');
                const userResponse = await this.messageService.info(common_1.nls.localize('theia/vsx-registry/recommendedExtensions', 'Do you want to install the recommended extensions for this repository?'), install, showRecommendations);
                if (userResponse === install) {
                    for (const recommendation of recommended) {
                        (_a = this.model.getExtension(recommendation)) === null || _a === void 0 ? void 0 : _a.install();
                    }
                }
                else if (userResponse === showRecommendations) {
                    await this.showRecommendedExtensions();
                }
            }
        }
    }
    async showBuiltinExtensions() {
        await this.openView({ activate: true });
        this.model.search.query = vsx_extensions_search_model_1.BUILTIN_QUERY;
    }
    async showInstalledExtensions() {
        await this.openView({ activate: true });
        this.model.search.query = vsx_extensions_search_model_1.INSTALLED_QUERY;
    }
    async showRecommendedExtensions() {
        await this.openView({ activate: true });
        this.model.search.query = vsx_extensions_search_model_1.RECOMMENDED_QUERY;
    }
};
__decorate([
    (0, inversify_1.inject)(vsx_extensions_model_1.VSXExtensionsModel),
    __metadata("design:type", vsx_extensions_model_1.VSXExtensionsModel)
], VSXExtensionsContribution.prototype, "model", void 0);
__decorate([
    (0, inversify_1.inject)(command_1.CommandRegistry),
    __metadata("design:type", command_1.CommandRegistry)
], VSXExtensionsContribution.prototype, "commandRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.FileDialogService),
    __metadata("design:type", Object)
], VSXExtensionsContribution.prototype, "fileDialogService", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.MessageService),
    __metadata("design:type", common_1.MessageService)
], VSXExtensionsContribution.prototype, "messageService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.LabelProvider),
    __metadata("design:type", browser_2.LabelProvider)
], VSXExtensionsContribution.prototype, "labelProvider", void 0);
__decorate([
    (0, inversify_1.inject)(clipboard_service_1.ClipboardService),
    __metadata("design:type", Object)
], VSXExtensionsContribution.prototype, "clipboardService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.PreferenceService),
    __metadata("design:type", Object)
], VSXExtensionsContribution.prototype, "preferenceService", void 0);
__decorate([
    (0, inversify_1.inject)(ovsx_client_provider_1.OVSXClientProvider),
    __metadata("design:type", Function)
], VSXExtensionsContribution.prototype, "clientProvider", void 0);
__decorate([
    (0, inversify_1.inject)(ovsx_client_1.OVSXApiFilter),
    __metadata("design:type", Object)
], VSXExtensionsContribution.prototype, "vsxApiFilter", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.QuickInputService),
    __metadata("design:type", Object)
], VSXExtensionsContribution.prototype, "quickInput", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VSXExtensionsContribution.prototype, "init", null);
VSXExtensionsContribution = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], VSXExtensionsContribution);
exports.VSXExtensionsContribution = VSXExtensionsContribution;
//# sourceMappingURL=vsx-extensions-contribution.js.map