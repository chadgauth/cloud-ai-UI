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
exports.WorkspaceFrontendContribution = exports.FILE_WORKSPACE = exports.WorkspaceStates = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const common_1 = require("@theia/core/lib/common");
const core_1 = require("@theia/core");
const browser_1 = require("@theia/core/lib/browser");
const browser_2 = require("@theia/filesystem/lib/browser");
const context_key_service_1 = require("@theia/core/lib/browser/context-key-service");
const workspace_service_1 = require("./workspace-service");
const common_2 = require("../common");
const workspace_commands_1 = require("./workspace-commands");
const quick_open_workspace_1 = require("./quick-open-workspace");
const file_service_1 = require("@theia/filesystem/lib/browser/file-service");
const encoding_registry_1 = require("@theia/core/lib/browser/encoding-registry");
const encodings_1 = require("@theia/core/lib/common/encodings");
const disposable_1 = require("@theia/core/lib/common/disposable");
const preference_configurations_1 = require("@theia/core/lib/browser/preferences/preference-configurations");
const nls_1 = require("@theia/core/lib/common/nls");
const buffer_1 = require("@theia/core/lib/common/buffer");
const untitled_workspace_exit_dialog_1 = require("./untitled-workspace-exit-dialog");
const filesystem_save_resource_service_1 = require("@theia/filesystem/lib/browser/filesystem-save-resource-service");
const frontend_application_state_1 = require("@theia/core/lib/common/frontend-application-state");
const monaco = require("@theia/monaco-editor-core");
var WorkspaceStates;
(function (WorkspaceStates) {
    /**
     * The state is `empty` when no workspace is opened.
     */
    WorkspaceStates["empty"] = "empty";
    /**
     * The state is `workspace` when a workspace is opened.
     */
    WorkspaceStates["workspace"] = "workspace";
    /**
     * The state is `folder` when a folder is opened. (1 folder)
     */
    WorkspaceStates["folder"] = "folder";
})(WorkspaceStates = exports.WorkspaceStates || (exports.WorkspaceStates = {}));
;
/** Create the workspace section after open {@link CommonMenus.FILE_OPEN}. */
exports.FILE_WORKSPACE = [...browser_1.CommonMenus.FILE, '2_workspace'];
let WorkspaceFrontendContribution = class WorkspaceFrontendContribution {
    constructor() {
        this.toDisposeOnUpdateEncodingOverrides = new disposable_1.DisposableCollection();
    }
    configure() {
        const workspaceExtensions = this.workspaceFileService.getWorkspaceFileExtensions();
        monaco.languages.register({
            id: 'jsonc',
            'aliases': [
                'JSON with Comments'
            ],
            'extensions': workspaceExtensions.map(ext => `.${ext}`)
        });
        for (const extension of workspaceExtensions) {
            this.encodingRegistry.registerOverride({ encoding: encodings_1.UTF8, extension });
        }
        this.updateEncodingOverrides();
        const workspaceFolderCountKey = this.contextKeyService.createKey('workspaceFolderCount', 0);
        const updateWorkspaceFolderCountKey = () => workspaceFolderCountKey.set(this.workspaceService.tryGetRoots().length);
        updateWorkspaceFolderCountKey();
        const workspaceStateKey = this.contextKeyService.createKey('workspaceState', 'empty');
        const updateWorkspaceStateKey = () => workspaceStateKey.set(this.updateWorkspaceStateKey());
        updateWorkspaceStateKey();
        const workbenchStateKey = this.contextKeyService.createKey('workbenchState', 'empty');
        const updateWorkbenchStateKey = () => workbenchStateKey.set(this.updateWorkbenchStateKey());
        updateWorkbenchStateKey();
        this.updateStyles();
        this.workspaceService.onWorkspaceChanged(() => {
            this.updateEncodingOverrides();
            updateWorkspaceFolderCountKey();
            updateWorkspaceStateKey();
            updateWorkbenchStateKey();
            this.updateStyles();
        });
    }
    updateEncodingOverrides() {
        this.toDisposeOnUpdateEncodingOverrides.dispose();
        for (const root of this.workspaceService.tryGetRoots()) {
            for (const configPath of this.preferenceConfigurations.getPaths()) {
                const parent = root.resource.resolve(configPath);
                this.toDisposeOnUpdateEncodingOverrides.push(this.encodingRegistry.registerOverride({ encoding: encodings_1.UTF8, parent }));
            }
        }
    }
    updateStyles() {
        document.body.classList.remove('theia-no-open-workspace');
        // Display the 'no workspace opened' theme color when no folders are opened (single-root).
        if (!this.workspaceService.isMultiRootWorkspaceOpened &&
            !this.workspaceService.tryGetRoots().length) {
            document.body.classList.add('theia-no-open-workspace');
        }
    }
    registerCommands(commands) {
        // Not visible/enabled on Windows/Linux in electron.
        commands.registerCommand(workspace_commands_1.WorkspaceCommands.OPEN, {
            isEnabled: () => core_1.isOSX || !this.isElectron(),
            isVisible: () => core_1.isOSX || !this.isElectron(),
            execute: () => this.doOpen()
        });
        // Visible/enabled only on Windows/Linux in electron.
        commands.registerCommand(workspace_commands_1.WorkspaceCommands.OPEN_FILE, {
            isEnabled: () => true,
            execute: () => this.doOpenFile()
        });
        // Visible/enabled only on Windows/Linux in electron.
        commands.registerCommand(workspace_commands_1.WorkspaceCommands.OPEN_FOLDER, {
            isEnabled: () => true,
            execute: () => this.doOpenFolder()
        });
        commands.registerCommand(workspace_commands_1.WorkspaceCommands.OPEN_WORKSPACE, {
            isEnabled: () => true,
            execute: () => this.doOpenWorkspace()
        });
        commands.registerCommand(workspace_commands_1.WorkspaceCommands.CLOSE, {
            isEnabled: () => this.workspaceService.opened,
            execute: () => this.closeWorkspace()
        });
        commands.registerCommand(workspace_commands_1.WorkspaceCommands.OPEN_RECENT_WORKSPACE, {
            execute: () => this.quickOpenWorkspace.select()
        });
        commands.registerCommand(workspace_commands_1.WorkspaceCommands.SAVE_WORKSPACE_AS, {
            isVisible: () => this.workspaceService.opened,
            isEnabled: () => this.workspaceService.opened,
            execute: () => this.saveWorkspaceAs()
        });
        commands.registerCommand(workspace_commands_1.WorkspaceCommands.OPEN_WORKSPACE_FILE, {
            isEnabled: () => this.workspaceService.saved,
            execute: () => {
                if (this.workspaceService.saved && this.workspaceService.workspace) {
                    (0, browser_1.open)(this.openerService, this.workspaceService.workspace.resource);
                }
            }
        });
    }
    registerMenus(menus) {
        if (core_1.isOSX || !this.isElectron()) {
            menus.registerMenuAction(browser_1.CommonMenus.FILE_OPEN, {
                commandId: workspace_commands_1.WorkspaceCommands.OPEN.id,
                order: 'a00'
            });
        }
        if (!core_1.isOSX && this.isElectron()) {
            menus.registerMenuAction(browser_1.CommonMenus.FILE_OPEN, {
                commandId: workspace_commands_1.WorkspaceCommands.OPEN_FILE.id,
                label: `${workspace_commands_1.WorkspaceCommands.OPEN_FILE.dialogLabel}...`,
                order: 'a01'
            });
            menus.registerMenuAction(browser_1.CommonMenus.FILE_OPEN, {
                commandId: workspace_commands_1.WorkspaceCommands.OPEN_FOLDER.id,
                label: `${workspace_commands_1.WorkspaceCommands.OPEN_FOLDER.dialogLabel}...`,
                order: 'a02'
            });
        }
        menus.registerMenuAction(browser_1.CommonMenus.FILE_OPEN, {
            commandId: workspace_commands_1.WorkspaceCommands.OPEN_WORKSPACE.id,
            order: 'a10'
        });
        menus.registerMenuAction(browser_1.CommonMenus.FILE_OPEN, {
            commandId: workspace_commands_1.WorkspaceCommands.OPEN_RECENT_WORKSPACE.id,
            order: 'a20'
        });
        menus.registerMenuAction(exports.FILE_WORKSPACE, {
            commandId: workspace_commands_1.WorkspaceCommands.ADD_FOLDER.id,
            order: 'a10'
        });
        menus.registerMenuAction(exports.FILE_WORKSPACE, {
            commandId: workspace_commands_1.WorkspaceCommands.SAVE_WORKSPACE_AS.id,
            order: 'a20'
        });
        menus.registerMenuAction(browser_1.CommonMenus.FILE_CLOSE, {
            commandId: workspace_commands_1.WorkspaceCommands.CLOSE.id
        });
        menus.registerMenuAction(browser_1.CommonMenus.FILE_SAVE, {
            commandId: workspace_commands_1.WorkspaceCommands.SAVE_AS.id,
        });
        menus.registerMenuAction(browser_1.SHELL_TABBAR_CONTEXT_COPY, {
            commandId: workspace_commands_1.WorkspaceCommands.COPY_RELATIVE_FILE_PATH.id,
            label: workspace_commands_1.WorkspaceCommands.COPY_RELATIVE_FILE_PATH.label,
        });
    }
    registerKeybindings(keybindings) {
        keybindings.registerKeybinding({
            command: core_1.isOSX || !this.isElectron() ? workspace_commands_1.WorkspaceCommands.OPEN.id : workspace_commands_1.WorkspaceCommands.OPEN_FILE.id,
            keybinding: this.isElectron() ? 'ctrlcmd+o' : 'ctrlcmd+alt+o',
        });
        if (!core_1.isOSX && this.isElectron()) {
            keybindings.registerKeybinding({
                command: workspace_commands_1.WorkspaceCommands.OPEN_FOLDER.id,
                keybinding: 'ctrl+k ctrl+o',
            });
        }
        keybindings.registerKeybinding({
            command: workspace_commands_1.WorkspaceCommands.OPEN_WORKSPACE.id,
            keybinding: 'ctrlcmd+alt+w',
        });
        keybindings.registerKeybinding({
            command: workspace_commands_1.WorkspaceCommands.OPEN_RECENT_WORKSPACE.id,
            keybinding: 'ctrlcmd+alt+r',
        });
        keybindings.registerKeybinding({
            command: workspace_commands_1.WorkspaceCommands.SAVE_AS.id,
            keybinding: 'ctrlcmd+shift+s',
        });
        keybindings.registerKeybinding({
            command: workspace_commands_1.WorkspaceCommands.COPY_RELATIVE_FILE_PATH.id,
            keybinding: common_1.isWindows ? 'ctrl+k ctrl+shift+c' : 'ctrlcmd+shift+alt+c',
            when: '!editorFocus'
        });
    }
    /**
     * This is the generic `Open` method. Opens files and directories too. Resolves to the opened URI.
     * Except when you are on either Windows or Linux `AND` running in electron. If so, it opens a file.
     */
    async doOpen() {
        var _a;
        if (!core_1.isOSX && this.isElectron()) {
            return this.doOpenFile();
        }
        const [rootStat] = await this.workspaceService.roots;
        const destinationUri = await this.fileDialogService.showOpenDialog({
            title: workspace_commands_1.WorkspaceCommands.OPEN.dialogLabel,
            canSelectFolders: true,
            canSelectFiles: true
        }, rootStat);
        if (destinationUri && ((_a = this.getCurrentWorkspaceUri()) === null || _a === void 0 ? void 0 : _a.toString()) !== destinationUri.toString()) {
            const destination = await this.fileService.resolve(destinationUri);
            if (destination.isDirectory) {
                this.workspaceService.open(destinationUri);
            }
            else {
                await (0, browser_1.open)(this.openerService, destinationUri);
            }
            return destinationUri;
        }
        return undefined;
    }
    /**
     * Opens a file after prompting the `Open File` dialog. Resolves to `undefined`, if
     *  - the workspace root is not set,
     *  - the file to open does not exist, or
     *  - it was not a file, but a directory.
     *
     * Otherwise, resolves to the URI of the file.
     */
    async doOpenFile() {
        const props = {
            title: workspace_commands_1.WorkspaceCommands.OPEN_FILE.dialogLabel,
            canSelectFolders: false,
            canSelectFiles: true
        };
        const [rootStat] = await this.workspaceService.roots;
        const destinationFileUri = await this.fileDialogService.showOpenDialog(props, rootStat);
        if (destinationFileUri) {
            const destinationFile = await this.fileService.resolve(destinationFileUri);
            if (!destinationFile.isDirectory) {
                await (0, browser_1.open)(this.openerService, destinationFileUri);
                return destinationFileUri;
            }
        }
        return undefined;
    }
    /**
     * Opens one or more folders after prompting the `Open Folder` dialog. Resolves to `undefined`, if
     *  - the user's selection is empty or contains only files.
     *  - the new workspace is equal to the old workspace.
     *
     * Otherwise, resolves to the URI of the new workspace:
     *  - a single folder if a single folder was selected.
     *  - a new, untitled workspace file if multiple folders were selected.
     */
    async doOpenFolder() {
        const props = {
            title: workspace_commands_1.WorkspaceCommands.OPEN_FOLDER.dialogLabel,
            canSelectFolders: true,
            canSelectFiles: false,
            canSelectMany: true,
        };
        const [rootStat] = await this.workspaceService.roots;
        const targetFolders = await this.fileDialogService.showOpenDialog(props, rootStat);
        if (targetFolders) {
            const openableURI = await this.getOpenableWorkspaceUri(targetFolders);
            if (openableURI) {
                if (!this.workspaceService.workspace || !openableURI.isEqual(this.workspaceService.workspace.resource)) {
                    this.workspaceService.open(openableURI);
                    return openableURI;
                }
            }
            ;
        }
        return undefined;
    }
    async getOpenableWorkspaceUri(uris) {
        if (Array.isArray(uris)) {
            if (uris.length < 2) {
                return uris[0];
            }
            else {
                const foldersToOpen = (await Promise.all(uris.map(uri => this.fileService.resolve(uri))))
                    .filter(fileStat => !!(fileStat === null || fileStat === void 0 ? void 0 : fileStat.isDirectory));
                if (foldersToOpen.length === 1) {
                    return foldersToOpen[0].resource;
                }
                else {
                    return this.createMultiRootWorkspace(foldersToOpen);
                }
            }
        }
        else {
            return uris;
        }
    }
    async createMultiRootWorkspace(roots) {
        const untitledWorkspace = await this.workspaceService.getUntitledWorkspace();
        const folders = Array.from(new Set(roots.map(stat => stat.resource.path.toString())), path => ({ path }));
        const workspaceStat = await this.fileService.createFile(untitledWorkspace, buffer_1.BinaryBuffer.fromString(JSON.stringify({ folders }, null, 4)), // eslint-disable-line no-null/no-null
        { overwrite: true });
        return workspaceStat.resource;
    }
    /**
     * Opens a workspace after raising the `Open Workspace` dialog. Resolves to the URI of the recently opened workspace,
     * if it was successful. Otherwise, resolves to `undefined`.
     */
    async doOpenWorkspace() {
        var _a;
        const props = {
            title: workspace_commands_1.WorkspaceCommands.OPEN_WORKSPACE.dialogLabel,
            canSelectFiles: true,
            canSelectFolders: false,
            filters: this.getWorkspaceDialogFileFilters()
        };
        const [rootStat] = await this.workspaceService.roots;
        const workspaceFileUri = await this.fileDialogService.showOpenDialog(props, rootStat);
        if (workspaceFileUri &&
            ((_a = this.getCurrentWorkspaceUri()) === null || _a === void 0 ? void 0 : _a.toString()) !== workspaceFileUri.toString()) {
            if (await this.fileService.exists(workspaceFileUri)) {
                this.workspaceService.open(workspaceFileUri);
                return workspaceFileUri;
            }
        }
        return undefined;
    }
    async closeWorkspace() {
        await this.workspaceService.close();
    }
    /**
     * @returns whether the file was successfully saved.
     */
    async saveWorkspaceAs() {
        let exist = false;
        let overwrite = false;
        let selected;
        do {
            selected = await this.fileDialogService.showSaveDialog({
                title: workspace_commands_1.WorkspaceCommands.SAVE_WORKSPACE_AS.label,
                filters: this.getWorkspaceDialogFileFilters()
            });
            if (selected) {
                const displayName = selected.displayName;
                const extensions = this.workspaceFileService.getWorkspaceFileExtensions(true);
                if (!extensions.some(ext => displayName.endsWith(ext))) {
                    const defaultExtension = extensions[this.workspaceFileService.defaultFileTypeIndex];
                    selected = selected.parent.resolve(`${displayName}${defaultExtension}`);
                }
                exist = await this.fileService.exists(selected);
                if (exist) {
                    overwrite = await this.saveService.confirmOverwrite(selected);
                }
            }
        } while (selected && exist && !overwrite);
        if (selected) {
            try {
                await this.workspaceService.save(selected);
                return true;
            }
            catch {
                this.messageService.error(nls_1.nls.localizeByDefault("Unable to save workspace '{0}'", selected.path.fsPath()));
            }
        }
        return false;
    }
    canBeSavedAs(widget) {
        return this.saveService.canSaveAs(widget);
    }
    async saveAs(widget) {
        return this.saveService.saveAs(widget);
    }
    updateWorkspaceStateKey() {
        return this.doUpdateState();
    }
    updateWorkbenchStateKey() {
        return this.doUpdateState();
    }
    doUpdateState() {
        if (this.workspaceService.opened) {
            return this.workspaceService.isMultiRootWorkspaceOpened ? 'workspace' : 'folder';
        }
        return 'empty';
    }
    getWorkspaceDialogFileFilters() {
        const filters = {};
        for (const fileType of this.workspaceFileService.getWorkspaceFileTypes()) {
            filters[`${nls_1.nls.localizeByDefault('{0} workspace', fileType.name)} (*.${fileType.extension})`] = [fileType.extension];
        }
        return filters;
    }
    isElectron() {
        return core_1.environment.electron.is();
    }
    /**
     * Get the current workspace URI.
     *
     * @returns the current workspace URI.
     */
    getCurrentWorkspaceUri() {
        var _a;
        return (_a = this.workspaceService.workspace) === null || _a === void 0 ? void 0 : _a.resource;
    }
    onWillStop() {
        const { workspace } = this.workspaceService;
        if (workspace && this.workspaceService.isUntitledWorkspace(workspace.resource)) {
            return {
                prepare: async (reason) => reason === frontend_application_state_1.StopReason.Reload && this.workspaceService.isSafeToReload(workspace.resource),
                action: async (alreadyConfirmedSafe) => {
                    if (alreadyConfirmedSafe) {
                        return true;
                    }
                    const shouldSaveFile = await new untitled_workspace_exit_dialog_1.UntitledWorkspaceExitDialog({
                        title: nls_1.nls.localizeByDefault('Do you want to save your workspace configuration as a file?')
                    }).open();
                    if (shouldSaveFile === "Don't Save") {
                        return true;
                    }
                    else if (shouldSaveFile === 'Save') {
                        return this.saveWorkspaceAs();
                    }
                    return false; // If cancel, prevent exit.
                },
                reason: 'Untitled workspace.',
                // Since deleting the workspace would hobble any future functionality, run this late.
                priority: 100,
            };
        }
    }
};
__decorate([
    (0, inversify_1.inject)(common_1.MessageService),
    __metadata("design:type", common_1.MessageService)
], WorkspaceFrontendContribution.prototype, "messageService", void 0);
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], WorkspaceFrontendContribution.prototype, "fileService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.OpenerService),
    __metadata("design:type", Object)
], WorkspaceFrontendContribution.prototype, "openerService", void 0);
__decorate([
    (0, inversify_1.inject)(workspace_service_1.WorkspaceService),
    __metadata("design:type", workspace_service_1.WorkspaceService)
], WorkspaceFrontendContribution.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(quick_open_workspace_1.QuickOpenWorkspace),
    __metadata("design:type", quick_open_workspace_1.QuickOpenWorkspace)
], WorkspaceFrontendContribution.prototype, "quickOpenWorkspace", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.FileDialogService),
    __metadata("design:type", Object)
], WorkspaceFrontendContribution.prototype, "fileDialogService", void 0);
__decorate([
    (0, inversify_1.inject)(context_key_service_1.ContextKeyService),
    __metadata("design:type", Object)
], WorkspaceFrontendContribution.prototype, "contextKeyService", void 0);
__decorate([
    (0, inversify_1.inject)(encoding_registry_1.EncodingRegistry),
    __metadata("design:type", encoding_registry_1.EncodingRegistry)
], WorkspaceFrontendContribution.prototype, "encodingRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(preference_configurations_1.PreferenceConfigurations),
    __metadata("design:type", preference_configurations_1.PreferenceConfigurations)
], WorkspaceFrontendContribution.prototype, "preferenceConfigurations", void 0);
__decorate([
    (0, inversify_1.inject)(filesystem_save_resource_service_1.FilesystemSaveResourceService),
    __metadata("design:type", filesystem_save_resource_service_1.FilesystemSaveResourceService)
], WorkspaceFrontendContribution.prototype, "saveService", void 0);
__decorate([
    (0, inversify_1.inject)(common_2.WorkspaceFileService),
    __metadata("design:type", common_2.WorkspaceFileService)
], WorkspaceFrontendContribution.prototype, "workspaceFileService", void 0);
WorkspaceFrontendContribution = __decorate([
    (0, inversify_1.injectable)()
], WorkspaceFrontendContribution);
exports.WorkspaceFrontendContribution = WorkspaceFrontendContribution;
(function (WorkspaceFrontendContribution) {
    /**
     * File filter for all Theia and VS Code workspace file types.
     *
     * @deprecated Since 1.39.0 Use `WorkspaceFrontendContribution#getWorkspaceDialogFileFilters` instead.
     */
    WorkspaceFrontendContribution.DEFAULT_FILE_FILTER = {
        'Theia Workspace (*.theia-workspace)': [common_2.THEIA_EXT],
        'VS Code Workspace (*.code-workspace)': [common_2.VSCODE_EXT]
    };
})(WorkspaceFrontendContribution = exports.WorkspaceFrontendContribution || (exports.WorkspaceFrontendContribution = {}));
exports.WorkspaceFrontendContribution = WorkspaceFrontendContribution;
//# sourceMappingURL=workspace-frontend-contribution.js.map