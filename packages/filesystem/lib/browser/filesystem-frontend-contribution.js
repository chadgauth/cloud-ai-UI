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
exports.FileSystemFrontendContribution = exports.FileSystemCommands = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const environment_1 = require("@theia/core/shared/@theia/application-package/lib/environment");
const common_1 = require("@theia/core/lib/common");
const command_1 = require("@theia/core/lib/common/command");
const browser_1 = require("@theia/core/lib/browser");
const mime_service_1 = require("@theia/core/lib/browser/mime-service");
const tree_widget_selection_1 = require("@theia/core/lib/browser/tree/tree-widget-selection");
const filesystem_preferences_1 = require("./filesystem-preferences");
const file_selection_1 = require("./file-selection");
const file_upload_service_1 = require("./file-upload-service");
const file_service_1 = require("./file-service");
const promise_util_1 = require("@theia/core/lib/common/promise-util");
const core_1 = require("@theia/core");
var FileSystemCommands;
(function (FileSystemCommands) {
    FileSystemCommands.UPLOAD = command_1.Command.toLocalizedCommand({
        id: 'file.upload',
        category: browser_1.CommonCommands.FILE_CATEGORY,
        label: 'Upload Files...'
    }, 'theia/filesystem/uploadFiles', browser_1.CommonCommands.FILE_CATEGORY_KEY);
})(FileSystemCommands = exports.FileSystemCommands || (exports.FileSystemCommands = {}));
let FileSystemFrontendContribution = class FileSystemFrontendContribution {
    constructor() {
        this.onDidChangeEditorFileEmitter = new common_1.Emitter();
        this.onDidChangeEditorFile = this.onDidChangeEditorFileEmitter.event;
        this.userOperations = new Map();
        this.pendingOperation = Promise.resolve();
        this.moveSnapshots = new Map();
        this.deletedSuffix = `(${core_1.nls.localizeByDefault('Deleted')})`;
    }
    queueUserOperation(event) {
        const moveOperation = new promise_util_1.Deferred();
        this.userOperations.set(event.correlationId, moveOperation);
        this.run(() => moveOperation.promise);
    }
    resolveUserOperation(event) {
        const operation = this.userOperations.get(event.correlationId);
        if (operation) {
            this.userOperations.delete(event.correlationId);
            operation.resolve();
        }
    }
    initialize() {
        this.fileService.onDidFilesChange(event => this.run(() => this.updateWidgets(event)));
        this.fileService.onWillRunUserOperation(event => {
            this.queueUserOperation(event);
            event.waitUntil(this.runEach((uri, widget) => this.pushMove(uri, widget, event)));
        });
        this.fileService.onDidFailUserOperation(event => event.waitUntil((async () => {
            await this.runEach((uri, widget) => this.revertMove(uri, widget, event));
            this.resolveUserOperation(event);
        })()));
        this.fileService.onDidRunUserOperation(event => event.waitUntil((async () => {
            await this.runEach((uri, widget) => this.applyMove(uri, widget, event));
            this.resolveUserOperation(event);
        })()));
    }
    onStart(app) {
        this.updateAssociations();
        this.preferences.onPreferenceChanged(e => {
            if (e.preferenceName === 'files.associations') {
                this.updateAssociations();
            }
        });
    }
    registerCommands(commands) {
        commands.registerCommand(FileSystemCommands.UPLOAD, {
            isEnabled: (...args) => {
                const selection = this.getSelection(...args);
                return !!selection && this.canUpload(selection);
            },
            isVisible: () => !environment_1.environment.electron.is(),
            execute: (...args) => {
                const selection = this.getSelection(...args);
                if (selection) {
                    return this.upload(selection);
                }
            }
        });
    }
    canUpload({ fileStat }) {
        return !environment_1.environment.electron.is() && fileStat.isDirectory;
    }
    async upload(selection) {
        try {
            const source = tree_widget_selection_1.TreeWidgetSelection.getSource(this.selectionService.selection);
            const fileUploadResult = await this.uploadService.upload(selection.fileStat.resource);
            if (browser_1.ExpandableTreeNode.is(selection) && source) {
                await source.model.expandNode(selection);
            }
            return fileUploadResult;
        }
        catch (e) {
            if (!(0, common_1.isCancelled)(e)) {
                console.error(e);
            }
        }
    }
    getSelection(...args) {
        var _a;
        const { selection } = this.selectionService;
        return (_a = this.toSelection(args[0])) !== null && _a !== void 0 ? _a : (Array.isArray(selection) ? selection.find(file_selection_1.FileSelection.is) : this.toSelection(selection));
    }
    ;
    toSelection(arg) {
        return file_selection_1.FileSelection.is(arg) ? arg : undefined;
    }
    run(operation) {
        return this.pendingOperation = this.pendingOperation.then(async () => {
            try {
                await operation();
            }
            catch (e) {
                console.error(e);
            }
        });
    }
    async runEach(participant) {
        const promises = [];
        for (const [resourceUri, widget] of browser_1.NavigatableWidget.get(this.shell.widgets)) {
            promises.push(participant(resourceUri, widget));
        }
        await Promise.all(promises);
    }
    popMoveSnapshot(resourceUri) {
        const snapshotKey = resourceUri.toString();
        const snapshot = this.moveSnapshots.get(snapshotKey);
        if (snapshot) {
            this.moveSnapshots.delete(snapshotKey);
        }
        return snapshot;
    }
    applyMoveSnapshot(widget, snapshot) {
        if (!snapshot) {
            return undefined;
        }
        if (snapshot.dirty) {
            const saveable = browser_1.Saveable.get(widget);
            if (saveable && saveable.applySnapshot) {
                saveable.applySnapshot(snapshot.dirty);
            }
        }
        if (snapshot.view && browser_1.StatefulWidget.is(widget)) {
            widget.restoreState(snapshot.view);
        }
    }
    async pushMove(resourceUri, widget, event) {
        const newResourceUri = this.createMoveToUri(resourceUri, widget, event);
        if (!newResourceUri) {
            return;
        }
        const snapshot = {};
        const saveable = browser_1.Saveable.get(widget);
        if (browser_1.StatefulWidget.is(widget)) {
            snapshot.view = widget.storeState();
        }
        if (saveable && saveable.dirty) {
            if (saveable.createSnapshot) {
                snapshot.dirty = saveable.createSnapshot();
            }
            if (saveable.revert) {
                await saveable.revert({ soft: true });
            }
        }
        this.moveSnapshots.set(newResourceUri.toString(), snapshot);
    }
    async revertMove(resourceUri, widget, event) {
        const newResourceUri = this.createMoveToUri(resourceUri, widget, event);
        if (!newResourceUri) {
            return;
        }
        const snapshot = this.popMoveSnapshot(newResourceUri);
        this.applyMoveSnapshot(widget, snapshot);
    }
    async applyMove(resourceUri, widget, event) {
        const newResourceUri = this.createMoveToUri(resourceUri, widget, event);
        if (!newResourceUri) {
            return;
        }
        const snapshot = this.popMoveSnapshot(newResourceUri);
        const description = this.widgetManager.getDescription(widget);
        if (!description) {
            return;
        }
        const { factoryId, options } = description;
        if (!browser_1.NavigatableWidgetOptions.is(options)) {
            return;
        }
        const newWidget = await this.widgetManager.getOrCreateWidget(factoryId, {
            ...options,
            uri: newResourceUri.toString()
        });
        this.applyMoveSnapshot(newWidget, snapshot);
        const area = this.shell.getAreaFor(widget) || 'main';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pending = [this.shell.addWidget(newWidget, {
                area, ref: widget
            })];
        if (this.shell.activeWidget === widget) {
            pending.push(this.shell.activateWidget(newWidget.id));
        }
        else if (widget.isVisible) {
            pending.push(this.shell.revealWidget(newWidget.id));
        }
        pending.push(this.shell.closeWidget(widget.id, { save: false }));
        await Promise.all(pending);
    }
    createMoveToUri(resourceUri, widget, event) {
        var _a;
        if (event.operation !== 2 /* MOVE */) {
            return undefined;
        }
        const path = (_a = event.source) === null || _a === void 0 ? void 0 : _a.relative(resourceUri);
        const targetUri = path && event.target.resolve(path);
        return targetUri && widget.createMoveToUri(targetUri);
    }
    async updateWidgets(event) {
        if (!event.gotDeleted() && !event.gotAdded()) {
            return;
        }
        const dirty = new Set();
        const toClose = new Map();
        for (const [uri, widget] of browser_1.NavigatableWidget.get(this.shell.widgets)) {
            this.updateWidget(uri, widget, event, { dirty, toClose: toClose });
        }
        if (this.corePreferences['workbench.editor.closeOnFileDelete']) {
            const doClose = [];
            for (const [uri, widgets] of toClose.entries()) {
                if (!dirty.has(uri)) {
                    doClose.push(...widgets);
                }
            }
            await this.shell.closeMany(doClose);
        }
    }
    updateWidget(uri, widget, event, { dirty, toClose }) {
        const label = widget.title.label;
        const deleted = label.endsWith(this.deletedSuffix);
        if (event.contains(uri, 2 /* DELETED */)) {
            const uriString = uri.toString();
            if (browser_1.Saveable.isDirty(widget)) {
                dirty.add(uriString);
            }
            if (!deleted) {
                widget.title.label += this.deletedSuffix;
                this.onDidChangeEditorFileEmitter.fire({ editor: widget, type: 2 /* DELETED */ });
            }
            const widgets = toClose.get(uriString) || [];
            widgets.push(widget);
            toClose.set(uriString, widgets);
        }
        else if (event.contains(uri, 1 /* ADDED */)) {
            if (deleted) {
                widget.title.label = widget.title.label.substring(0, label.length - this.deletedSuffix.length);
                this.onDidChangeEditorFileEmitter.fire({ editor: widget, type: 1 /* ADDED */ });
            }
        }
    }
    updateAssociations() {
        const fileAssociations = this.preferences['files.associations'];
        const mimeAssociations = Object.keys(fileAssociations).map(filepattern => ({ id: fileAssociations[filepattern], filepattern }));
        this.mimeService.setAssociations(mimeAssociations);
    }
};
__decorate([
    (0, inversify_1.inject)(browser_1.ApplicationShell),
    __metadata("design:type", browser_1.ApplicationShell)
], FileSystemFrontendContribution.prototype, "shell", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.WidgetManager),
    __metadata("design:type", browser_1.WidgetManager)
], FileSystemFrontendContribution.prototype, "widgetManager", void 0);
__decorate([
    (0, inversify_1.inject)(mime_service_1.MimeService),
    __metadata("design:type", mime_service_1.MimeService)
], FileSystemFrontendContribution.prototype, "mimeService", void 0);
__decorate([
    (0, inversify_1.inject)(filesystem_preferences_1.FileSystemPreferences),
    __metadata("design:type", Object)
], FileSystemFrontendContribution.prototype, "preferences", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.CorePreferences),
    __metadata("design:type", Object)
], FileSystemFrontendContribution.prototype, "corePreferences", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.SelectionService),
    __metadata("design:type", common_1.SelectionService)
], FileSystemFrontendContribution.prototype, "selectionService", void 0);
__decorate([
    (0, inversify_1.inject)(file_upload_service_1.FileUploadService),
    __metadata("design:type", file_upload_service_1.FileUploadService)
], FileSystemFrontendContribution.prototype, "uploadService", void 0);
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], FileSystemFrontendContribution.prototype, "fileService", void 0);
FileSystemFrontendContribution = __decorate([
    (0, inversify_1.injectable)()
], FileSystemFrontendContribution);
exports.FileSystemFrontendContribution = FileSystemFrontendContribution;
//# sourceMappingURL=filesystem-frontend-contribution.js.map