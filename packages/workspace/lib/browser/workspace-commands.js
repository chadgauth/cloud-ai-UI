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
exports.WorkspaceRootUriAwareCommandHandler = exports.WorkspaceCommandContribution = exports.EditMenuContribution = exports.FileMenuContribution = exports.WorkspaceCommands = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const selection_service_1 = require("@theia/core/lib/common/selection-service");
const command_1 = require("@theia/core/lib/common/command");
const common_frontend_contribution_1 = require("@theia/core/lib/browser/common-frontend-contribution");
const browser_1 = require("@theia/filesystem/lib/browser");
const dialogs_1 = require("@theia/core/lib/browser/dialogs");
const browser_2 = require("@theia/core/lib/browser");
const uri_command_handler_1 = require("@theia/core/lib/common/uri-command-handler");
const workspace_service_1 = require("./workspace-service");
const message_service_1 = require("@theia/core/lib/common/message-service");
const workspace_preferences_1 = require("./workspace-preferences");
const workspace_delete_handler_1 = require("./workspace-delete-handler");
const workspace_duplicate_handler_1 = require("./workspace-duplicate-handler");
const common_1 = require("@theia/filesystem/lib/common");
const workspace_compare_handler_1 = require("./workspace-compare-handler");
const file_download_command_contribution_1 = require("@theia/filesystem/lib/browser/download/file-download-command-contribution");
const filesystem_frontend_contribution_1 = require("@theia/filesystem/lib/browser/filesystem-frontend-contribution");
const workspace_input_dialog_1 = require("./workspace-input-dialog");
const common_2 = require("@theia/core/lib/common");
const file_service_1 = require("@theia/filesystem/lib/browser/file-service");
const nls_1 = require("@theia/core/lib/common/nls");
const clipboard_service_1 = require("@theia/core/lib/browser/clipboard-service");
const validFilename = require('valid-filename');
var WorkspaceCommands;
(function (WorkspaceCommands) {
    const WORKSPACE_CATEGORY = 'Workspaces';
    const FILE_CATEGORY = browser_2.CommonCommands.FILE_CATEGORY;
    // On Linux and Windows, both files and folders cannot be opened at the same time in electron.
    // `OPEN_FILE` and `OPEN_FOLDER` must be available only on Linux and Windows in electron.
    // `OPEN` must *not* be available on Windows and Linux in electron.
    // VS Code does the same. See: https://github.com/eclipse-theia/theia/pull/3202#issuecomment-430585357
    WorkspaceCommands.OPEN = {
        ...command_1.Command.toDefaultLocalizedCommand({
            id: 'workspace:open',
            category: browser_2.CommonCommands.FILE_CATEGORY,
            label: 'Open...'
        }),
        dialogLabel: nls_1.nls.localizeByDefault('Open')
    };
    // No `label`. Otherwise, it shows up in the `Command Palette`.
    WorkspaceCommands.OPEN_FILE = {
        id: 'workspace:openFile',
        originalCategory: FILE_CATEGORY,
        category: nls_1.nls.localizeByDefault(browser_2.CommonCommands.FILE_CATEGORY),
        dialogLabel: nls_1.nls.localizeByDefault('Open File')
    };
    WorkspaceCommands.OPEN_FOLDER = {
        id: 'workspace:openFolder',
        dialogLabel: nls_1.nls.localizeByDefault('Open Folder') // No `label`. Otherwise, it shows up in the `Command Palette`.
    };
    WorkspaceCommands.OPEN_WORKSPACE = {
        ...command_1.Command.toDefaultLocalizedCommand({
            id: 'workspace:openWorkspace',
            category: browser_2.CommonCommands.FILE_CATEGORY,
            label: 'Open Workspace from File...',
        }),
        dialogLabel: nls_1.nls.localizeByDefault('Open Workspace from File')
    };
    WorkspaceCommands.OPEN_RECENT_WORKSPACE = command_1.Command.toLocalizedCommand({
        id: 'workspace:openRecent',
        category: FILE_CATEGORY,
        label: 'Open Recent Workspace...'
    }, 'theia/workspace/openRecentWorkspace', browser_2.CommonCommands.FILE_CATEGORY_KEY);
    WorkspaceCommands.CLOSE = command_1.Command.toDefaultLocalizedCommand({
        id: 'workspace:close',
        category: WORKSPACE_CATEGORY,
        label: 'Close Workspace'
    });
    WorkspaceCommands.NEW_FILE = command_1.Command.toDefaultLocalizedCommand({
        id: 'file.newFile',
        category: FILE_CATEGORY,
        label: 'New File...'
    });
    WorkspaceCommands.NEW_FOLDER = command_1.Command.toDefaultLocalizedCommand({
        id: 'file.newFolder',
        category: FILE_CATEGORY,
        label: 'New Folder...'
    });
    WorkspaceCommands.FILE_OPEN_WITH = (opener) => ({
        id: `file.openWith.${opener.id}`
    });
    WorkspaceCommands.FILE_RENAME = command_1.Command.toDefaultLocalizedCommand({
        id: 'file.rename',
        category: FILE_CATEGORY,
        label: 'Rename'
    });
    WorkspaceCommands.FILE_DELETE = command_1.Command.toDefaultLocalizedCommand({
        id: 'file.delete',
        category: FILE_CATEGORY,
        label: 'Delete'
    });
    WorkspaceCommands.FILE_DUPLICATE = command_1.Command.toLocalizedCommand({
        id: 'file.duplicate',
        category: FILE_CATEGORY,
        label: 'Duplicate'
    }, 'theia/workspace/duplicate', browser_2.CommonCommands.FILE_CATEGORY_KEY);
    WorkspaceCommands.FILE_COMPARE = command_1.Command.toLocalizedCommand({
        id: 'file.compare',
        category: FILE_CATEGORY,
        label: 'Compare with Each Other'
    }, 'theia/workspace/compareWithEachOther', browser_2.CommonCommands.FILE_CATEGORY_KEY);
    WorkspaceCommands.ADD_FOLDER = command_1.Command.toDefaultLocalizedCommand({
        id: 'workspace:addFolder',
        category: WORKSPACE_CATEGORY,
        label: 'Add Folder to Workspace...'
    });
    WorkspaceCommands.REMOVE_FOLDER = command_1.Command.toDefaultLocalizedCommand({
        id: 'workspace:removeFolder',
        category: WORKSPACE_CATEGORY,
        label: 'Remove Folder from Workspace'
    });
    WorkspaceCommands.SAVE_WORKSPACE_AS = command_1.Command.toDefaultLocalizedCommand({
        id: 'workspace:saveAs',
        category: WORKSPACE_CATEGORY,
        label: 'Save Workspace As...'
    });
    WorkspaceCommands.OPEN_WORKSPACE_FILE = command_1.Command.toDefaultLocalizedCommand({
        id: 'workspace:openConfigFile',
        category: WORKSPACE_CATEGORY,
        label: 'Open Workspace Configuration File'
    });
    /** @deprecated @since 1.24.0 Use `CommonCommands.SAVE_AS` instead */
    WorkspaceCommands.SAVE_AS = browser_2.CommonCommands.SAVE_AS;
    WorkspaceCommands.COPY_RELATIVE_FILE_PATH = command_1.Command.toDefaultLocalizedCommand({
        id: 'navigator.copyRelativeFilePath',
        label: 'Copy Relative Path'
    });
})(WorkspaceCommands = exports.WorkspaceCommands || (exports.WorkspaceCommands = {}));
let FileMenuContribution = class FileMenuContribution {
    registerMenus(registry) {
        registry.registerMenuAction(common_frontend_contribution_1.CommonMenus.FILE_NEW_TEXT, {
            commandId: WorkspaceCommands.NEW_FOLDER.id,
            order: 'b'
        });
        const downloadUploadMenu = [...common_frontend_contribution_1.CommonMenus.FILE, '4_downloadupload'];
        registry.registerMenuAction(downloadUploadMenu, {
            commandId: filesystem_frontend_contribution_1.FileSystemCommands.UPLOAD.id,
            order: 'a'
        });
        registry.registerMenuAction(downloadUploadMenu, {
            commandId: file_download_command_contribution_1.FileDownloadCommands.DOWNLOAD.id,
            order: 'b'
        });
    }
};
FileMenuContribution = __decorate([
    (0, inversify_1.injectable)()
], FileMenuContribution);
exports.FileMenuContribution = FileMenuContribution;
let EditMenuContribution = class EditMenuContribution {
    registerMenus(registry) {
        registry.registerMenuAction(common_frontend_contribution_1.CommonMenus.EDIT_CLIPBOARD, {
            commandId: file_download_command_contribution_1.FileDownloadCommands.COPY_DOWNLOAD_LINK.id,
            order: '9999'
        });
    }
};
EditMenuContribution = __decorate([
    (0, inversify_1.injectable)()
], EditMenuContribution);
exports.EditMenuContribution = EditMenuContribution;
let WorkspaceCommandContribution = class WorkspaceCommandContribution {
    constructor() {
        this.onDidCreateNewFileEmitter = new common_2.Emitter();
        this.onDidCreateNewFolderEmitter = new common_2.Emitter();
    }
    get onDidCreateNewFile() {
        return this.onDidCreateNewFileEmitter.event;
    }
    get onDidCreateNewFolder() {
        return this.onDidCreateNewFolderEmitter.event;
    }
    fireCreateNewFile(uri) {
        this.onDidCreateNewFileEmitter.fire(uri);
    }
    fireCreateNewFolder(uri) {
        this.onDidCreateNewFolderEmitter.fire(uri);
    }
    registerCommands(registry) {
        this.registerOpenWith(registry);
        registry.registerCommand(WorkspaceCommands.NEW_FILE, this.newWorkspaceRootUriAwareCommandHandler({
            execute: uri => this.getDirectory(uri).then(parent => {
                if (parent) {
                    const parentUri = parent.resource;
                    const { fileName, fileExtension } = this.getDefaultFileConfig();
                    const targetUri = parentUri.resolve(fileName + fileExtension);
                    const vacantChildUri = common_1.FileSystemUtils.generateUniqueResourceURI(parent, targetUri, false);
                    const dialog = new workspace_input_dialog_1.WorkspaceInputDialog({
                        title: nls_1.nls.localizeByDefault('New File...'),
                        maxWidth: 400,
                        parentUri: parentUri,
                        initialValue: vacantChildUri.path.base,
                        placeholder: nls_1.nls.localize('theia/workspace/newFilePlaceholder', 'File Name'),
                        validate: name => this.validateFileName(name, parent, true)
                    }, this.labelProvider);
                    dialog.open().then(async (name) => {
                        if (name) {
                            const fileUri = parentUri.resolve(name);
                            await this.fileService.create(fileUri);
                            this.fireCreateNewFile({ parent: parentUri, uri: fileUri });
                            (0, browser_2.open)(this.openerService, fileUri);
                        }
                    });
                }
            })
        }));
        registry.registerCommand(WorkspaceCommands.NEW_FOLDER, this.newWorkspaceRootUriAwareCommandHandler({
            execute: uri => this.getDirectory(uri).then(parent => {
                if (parent) {
                    const parentUri = parent.resource;
                    const targetUri = parentUri.resolve('Untitled');
                    const vacantChildUri = common_1.FileSystemUtils.generateUniqueResourceURI(parent, targetUri, true);
                    const dialog = new workspace_input_dialog_1.WorkspaceInputDialog({
                        title: nls_1.nls.localizeByDefault('New Folder...'),
                        maxWidth: 400,
                        parentUri: parentUri,
                        initialValue: vacantChildUri.path.base,
                        placeholder: nls_1.nls.localize('theia/workspace/newFolderPlaceholder', 'Folder Name'),
                        validate: name => this.validateFileName(name, parent, true)
                    }, this.labelProvider);
                    dialog.open().then(async (name) => {
                        if (name) {
                            const folderUri = parentUri.resolve(name);
                            await this.fileService.createFolder(folderUri);
                            this.fireCreateNewFile({ parent: parentUri, uri: folderUri });
                        }
                    });
                }
            })
        }));
        registry.registerCommand(WorkspaceCommands.FILE_RENAME, this.newMultiUriAwareCommandHandler({
            isEnabled: uris => uris.some(uri => !this.isWorkspaceRoot(uri)) && uris.length === 1,
            isVisible: uris => uris.some(uri => !this.isWorkspaceRoot(uri)) && uris.length === 1,
            execute: async (uris) => {
                const uri = uris[0]; /* Since there is only one item in the array. */
                const parent = await this.getParent(uri);
                if (parent) {
                    const oldName = uri.path.base;
                    const dialog = new dialogs_1.SingleTextInputDialog({
                        title: nls_1.nls.localizeByDefault('Rename'),
                        maxWidth: 400,
                        initialValue: oldName,
                        initialSelectionRange: {
                            start: 0,
                            end: uri.path.name.length
                        },
                        validate: async (newName, mode) => {
                            if (oldName === newName && mode === 'preview') {
                                return false;
                            }
                            return this.validateFileRename(oldName, newName, parent);
                        }
                    });
                    const fileName = await dialog.open();
                    if (fileName) {
                        const oldUri = uri;
                        const newUri = uri.parent.resolve(fileName);
                        return this.fileService.move(oldUri, newUri);
                    }
                }
            }
        }));
        registry.registerCommand(WorkspaceCommands.FILE_DUPLICATE, this.newMultiUriAwareCommandHandler(this.duplicateHandler));
        registry.registerCommand(WorkspaceCommands.FILE_DELETE, this.newMultiUriAwareCommandHandler(this.deleteHandler));
        registry.registerCommand(WorkspaceCommands.FILE_COMPARE, this.newMultiUriAwareCommandHandler(this.compareHandler));
        registry.registerCommand(WorkspaceCommands.COPY_RELATIVE_FILE_PATH, uri_command_handler_1.UriAwareCommandHandler.MultiSelect(this.selectionService, {
            isEnabled: uris => !!uris.length,
            isVisible: uris => !!uris.length,
            execute: async (uris) => {
                const lineDelimiter = common_2.EOL;
                const text = uris.map((uri) => {
                    var _a;
                    const workspaceRoot = this.workspaceService.getWorkspaceRootUri(uri);
                    if (workspaceRoot) {
                        return (_a = workspaceRoot.relative(uri)) === null || _a === void 0 ? void 0 : _a.fsPath();
                    }
                    else {
                        return uri.path.fsPath();
                    }
                }).join(lineDelimiter);
                await this.clipboardService.writeText(text);
            }
        }));
        registry.registerCommand(WorkspaceCommands.ADD_FOLDER, {
            isEnabled: () => this.workspaceService.opened,
            isVisible: () => this.workspaceService.opened,
            execute: async () => {
                const selection = await this.fileDialogService.showOpenDialog({
                    title: WorkspaceCommands.ADD_FOLDER.label,
                    canSelectFiles: false,
                    canSelectFolders: true,
                    canSelectMany: true,
                });
                if (!selection) {
                    return;
                }
                const uris = Array.isArray(selection) ? selection : [selection];
                const workspaceSavedBeforeAdding = this.workspaceService.saved;
                await this.addFolderToWorkspace(...uris);
                if (!workspaceSavedBeforeAdding) {
                    this.saveWorkspaceWithPrompt(registry);
                }
            }
        });
        registry.registerCommand(WorkspaceCommands.REMOVE_FOLDER, this.newMultiUriAwareCommandHandler({
            execute: uris => this.removeFolderFromWorkspace(uris),
            isEnabled: () => this.workspaceService.isMultiRootWorkspaceOpened,
            isVisible: uris => this.areWorkspaceRoots(uris) && this.workspaceService.saved
        }));
    }
    async registerOpenWith(registry) {
        if (this.openerService.onDidChangeOpeners) {
            this.openerService.onDidChangeOpeners(async (e) => {
                this.openers = await this.openerService.getOpeners();
            });
        }
        this.openers = await this.openerService.getOpeners();
        for (const opener of this.openers) {
            const openWithCommand = WorkspaceCommands.FILE_OPEN_WITH(opener);
            registry.registerCommand(openWithCommand, this.newUriAwareCommandHandler({
                execute: uri => opener.open(uri),
                isEnabled: uri => opener.canHandle(uri) > 0,
                isVisible: uri => opener.canHandle(uri) > 0 && this.areMultipleOpenHandlersPresent(this.openers, uri)
            }));
        }
    }
    newUriAwareCommandHandler(handler) {
        return uri_command_handler_1.UriAwareCommandHandler.MonoSelect(this.selectionService, handler);
    }
    newMultiUriAwareCommandHandler(handler) {
        return uri_command_handler_1.UriAwareCommandHandler.MultiSelect(this.selectionService, handler);
    }
    newWorkspaceRootUriAwareCommandHandler(handler) {
        return new WorkspaceRootUriAwareCommandHandler(this.workspaceService, this.selectionService, handler);
    }
    async validateFileRename(oldName, newName, parent) {
        if (common_2.OS.backend.isWindows && parent.resource.resolve(newName).isEqual(parent.resource.resolve(oldName), false)) {
            return '';
        }
        return this.validateFileName(newName, parent, false);
    }
    /**
     * Returns an error message if the file name is invalid. Otherwise, an empty string.
     *
     * @param name the simple file name of the file to validate.
     * @param parent the parent directory's file stat.
     * @param allowNested allow file or folder creation using recursive path
     */
    async validateFileName(name, parent, allowNested = false) {
        if (!name) {
            return '';
        }
        // do not allow recursive rename
        if (!allowNested && !validFilename(name)) {
            return nls_1.nls.localizeByDefault('The name **{0}** is not valid as a file or folder name. Please choose a different name.');
        }
        if (name.startsWith('/')) {
            return nls_1.nls.localizeByDefault('A file or folder name cannot start with a slash.');
        }
        else if (name.startsWith(' ') || name.endsWith(' ')) {
            return nls_1.nls.localizeByDefault('Leading or trailing whitespace detected in file or folder name.');
        }
        // check and validate each sub-paths
        if (name.split(/[\\/]/).some(file => !file || !validFilename(file) || /^\s+$/.test(file))) {
            return nls_1.nls.localizeByDefault('\'{0}\' is not a valid file name', this.trimFileName(name));
        }
        const childUri = parent.resource.resolve(name);
        const exists = await this.fileService.exists(childUri);
        if (exists) {
            return nls_1.nls.localizeByDefault('A file or folder **{0}** already exists at this location. Please choose a different name.', this.trimFileName(name));
        }
        return '';
    }
    trimFileName(name) {
        if (name && name.length > 30) {
            return `${name.substring(0, 30)}...`;
        }
        return name;
    }
    async getDirectory(candidate) {
        let stat;
        try {
            stat = await this.fileService.resolve(candidate);
        }
        catch { }
        if (stat && stat.isDirectory) {
            return stat;
        }
        return this.getParent(candidate);
    }
    async getParent(candidate) {
        try {
            return await this.fileService.resolve(candidate.parent);
        }
        catch {
            return undefined;
        }
    }
    async addFolderToWorkspace(...uris) {
        if (uris.length) {
            const foldersToAdd = [];
            try {
                for (const uri of uris) {
                    const stat = await this.fileService.resolve(uri);
                    if (stat.isDirectory) {
                        foldersToAdd.push(uri);
                    }
                }
                await this.workspaceService.addRoot(foldersToAdd);
            }
            catch { }
        }
    }
    areWorkspaceRoots(uris) {
        return this.workspaceService.areWorkspaceRoots(uris);
    }
    isWorkspaceRoot(uri) {
        const rootUris = new Set(this.workspaceService.tryGetRoots().map(root => root.resource.toString()));
        return rootUris.has(uri.toString());
    }
    getDefaultFileConfig() {
        return {
            fileName: 'Untitled',
            fileExtension: '.txt'
        };
    }
    /**
     * Removes the list of folders from the workspace upon confirmation from the user.
     * @param uris the list of folder uris to remove.
     */
    async removeFolderFromWorkspace(uris) {
        const roots = new Set(this.workspaceService.tryGetRoots().map(root => root.resource.toString()));
        const toRemove = uris.filter(uri => roots.has(uri.toString()));
        if (toRemove.length > 0) {
            const messageContainer = document.createElement('div');
            if (toRemove.length > 1) {
                messageContainer.textContent = nls_1.nls.localize('theia/workspace/removeFolders', 'Are you sure you want to remove the following folders from the workspace?');
            }
            else {
                messageContainer.textContent = nls_1.nls.localize('theia/workspace/removeFolder', 'Are you sure you want to remove the following folder from the workspace?');
            }
            messageContainer.title = nls_1.nls.localize('theia/workspace/noErasure', 'Note: Nothing will be erased from disk');
            const list = document.createElement('div');
            list.classList.add('theia-dialog-node');
            toRemove.forEach(uri => {
                const listItem = document.createElement('div');
                listItem.classList.add('theia-dialog-node-content');
                const folderIcon = document.createElement('span');
                folderIcon.classList.add('codicon', 'codicon-root-folder', 'theia-dialog-icon');
                listItem.appendChild(folderIcon);
                listItem.title = this.labelProvider.getLongName(uri);
                const listContent = document.createElement('span');
                listContent.classList.add('theia-dialog-node-segment');
                listContent.appendChild(document.createTextNode(this.labelProvider.getName(uri)));
                listItem.appendChild(listContent);
                list.appendChild(listItem);
            });
            messageContainer.appendChild(list);
            const dialog = new dialogs_1.ConfirmDialog({
                title: nls_1.nls.localizeByDefault('Remove Folder from Workspace'),
                msg: messageContainer
            });
            if (await dialog.open()) {
                await this.workspaceService.removeRoots(toRemove);
            }
        }
    }
    async saveWorkspaceWithPrompt(registry) {
        const saveCommand = registry.getCommand(WorkspaceCommands.SAVE_WORKSPACE_AS.id);
        if (saveCommand && await new dialogs_1.ConfirmDialog({
            title: nls_1.nls.localize('theia/workspace/workspaceFolderAddedTitle', 'Folder added to Workspace'),
            msg: nls_1.nls.localize('theia/workspace/workspaceFolderAdded', 'A workspace with multiple roots was created. Do you want to save your workspace configuration as a file?'),
            ok: dialogs_1.Dialog.YES,
            cancel: dialogs_1.Dialog.NO
        }).open()) {
            return registry.executeCommand(saveCommand.id);
        }
    }
    areMultipleOpenHandlersPresent(openers, uri) {
        let count = 0;
        for (const opener of openers) {
            if (opener.canHandle(uri) > 0) {
                count++;
            }
            if (count > 1) {
                return true;
            }
        }
        return false;
    }
};
__decorate([
    (0, inversify_1.inject)(browser_2.LabelProvider),
    __metadata("design:type", browser_2.LabelProvider)
], WorkspaceCommandContribution.prototype, "labelProvider", void 0);
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], WorkspaceCommandContribution.prototype, "fileService", void 0);
__decorate([
    (0, inversify_1.inject)(workspace_service_1.WorkspaceService),
    __metadata("design:type", workspace_service_1.WorkspaceService)
], WorkspaceCommandContribution.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(selection_service_1.SelectionService),
    __metadata("design:type", selection_service_1.SelectionService)
], WorkspaceCommandContribution.prototype, "selectionService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.OpenerService),
    __metadata("design:type", Object)
], WorkspaceCommandContribution.prototype, "openerService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.FrontendApplication),
    __metadata("design:type", browser_2.FrontendApplication)
], WorkspaceCommandContribution.prototype, "app", void 0);
__decorate([
    (0, inversify_1.inject)(message_service_1.MessageService),
    __metadata("design:type", message_service_1.MessageService)
], WorkspaceCommandContribution.prototype, "messageService", void 0);
__decorate([
    (0, inversify_1.inject)(workspace_preferences_1.WorkspacePreferences),
    __metadata("design:type", Object)
], WorkspaceCommandContribution.prototype, "preferences", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.FileDialogService),
    __metadata("design:type", Object)
], WorkspaceCommandContribution.prototype, "fileDialogService", void 0);
__decorate([
    (0, inversify_1.inject)(workspace_delete_handler_1.WorkspaceDeleteHandler),
    __metadata("design:type", workspace_delete_handler_1.WorkspaceDeleteHandler)
], WorkspaceCommandContribution.prototype, "deleteHandler", void 0);
__decorate([
    (0, inversify_1.inject)(workspace_duplicate_handler_1.WorkspaceDuplicateHandler),
    __metadata("design:type", workspace_duplicate_handler_1.WorkspaceDuplicateHandler)
], WorkspaceCommandContribution.prototype, "duplicateHandler", void 0);
__decorate([
    (0, inversify_1.inject)(workspace_compare_handler_1.WorkspaceCompareHandler),
    __metadata("design:type", workspace_compare_handler_1.WorkspaceCompareHandler)
], WorkspaceCommandContribution.prototype, "compareHandler", void 0);
__decorate([
    (0, inversify_1.inject)(clipboard_service_1.ClipboardService),
    __metadata("design:type", Object)
], WorkspaceCommandContribution.prototype, "clipboardService", void 0);
WorkspaceCommandContribution = __decorate([
    (0, inversify_1.injectable)()
], WorkspaceCommandContribution);
exports.WorkspaceCommandContribution = WorkspaceCommandContribution;
class WorkspaceRootUriAwareCommandHandler extends uri_command_handler_1.UriAwareCommandHandler {
    constructor(workspaceService, selectionService, handler) {
        super(selectionService, handler);
        this.workspaceService = workspaceService;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    isEnabled(...args) {
        return super.isEnabled(...args) && !!this.workspaceService.tryGetRoots().length;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    isVisible(...args) {
        return super.isVisible(...args) && !!this.workspaceService.tryGetRoots().length;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getUri(...args) {
        const uri = super.getUri(...args);
        // Return the `uri` immediately if the resource exists in any of the workspace roots and is of `file` scheme.
        if (uri && uri.scheme === 'file' && this.workspaceService.getWorkspaceRootUri(uri)) {
            return uri;
        }
        // Return the first root if available.
        if (!!this.workspaceService.tryGetRoots().length) {
            return this.workspaceService.tryGetRoots()[0].resource;
        }
    }
}
exports.WorkspaceRootUriAwareCommandHandler = WorkspaceRootUriAwareCommandHandler;
//# sourceMappingURL=workspace-commands.js.map