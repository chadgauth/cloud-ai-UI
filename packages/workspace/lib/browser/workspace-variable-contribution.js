"use strict";
// *****************************************************************************
// Copyright (C) 2018 Red Hat, Inc. and others.
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
exports.WorkspaceVariableContribution = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const path_1 = require("@theia/core/lib/common/path");
const browser_1 = require("@theia/core/lib/browser");
const workspace_service_1 = require("./workspace-service");
const file_service_1 = require("@theia/filesystem/lib/browser/file-service");
let WorkspaceVariableContribution = class WorkspaceVariableContribution {
    constructor() {
        this.recentlyVisibleIds = [];
    }
    init() {
        this.shell.onDidChangeCurrentWidget(() => this.updateCurrentWidget());
        this.widgetManager.onDidCreateWidget(({ widget }) => {
            if (browser_1.NavigatableWidget.is(widget)) {
                widget.onDidChangeVisibility(() => {
                    if (widget.isVisible) {
                        this.addRecentlyVisible(widget);
                    }
                    else {
                        this.removeRecentlyVisible(widget);
                    }
                    this.updateCurrentWidget();
                });
                widget.onDidDispose(() => {
                    this.removeRecentlyVisible(widget);
                    this.updateCurrentWidget();
                });
            }
        });
        for (const widget of this.shell.widgets) {
            if (browser_1.NavigatableWidget.is(widget) && widget.isVisible) {
                this.addRecentlyVisible(widget);
            }
        }
        this.updateCurrentWidget();
    }
    get recentlyVisible() {
        const id = this.recentlyVisibleIds[0];
        const widget = id && this.shell.getWidgetById(id) || undefined;
        if (browser_1.NavigatableWidget.is(widget)) {
            return widget;
        }
        return undefined;
    }
    addRecentlyVisible(widget) {
        this.removeRecentlyVisible(widget);
        this.recentlyVisibleIds.unshift(widget.id);
    }
    removeRecentlyVisible(widget) {
        const index = this.recentlyVisibleIds.indexOf(widget.id);
        if (index !== -1) {
            this.recentlyVisibleIds.splice(index, 1);
        }
    }
    updateCurrentWidget() {
        const { currentWidget } = this.shell;
        if (browser_1.NavigatableWidget.is(currentWidget)) {
            this.currentWidget = currentWidget;
        }
        else if (!this.currentWidget || !this.currentWidget.isVisible) {
            this.currentWidget = this.recentlyVisible;
        }
    }
    registerVariables(variables) {
        this.registerWorkspaceRootVariables(variables);
        variables.registerVariable({
            name: 'file',
            description: 'The path of the currently opened file',
            resolve: () => {
                const uri = this.getResourceUri();
                return uri && this.fileService.fsPath(uri);
            }
        });
        variables.registerVariable({
            name: 'fileBasename',
            description: 'The basename of the currently opened file',
            resolve: () => {
                const uri = this.getResourceUri();
                return uri && uri.path.base;
            }
        });
        variables.registerVariable({
            name: 'fileBasenameNoExtension',
            description: "The currently opened file's name without extension",
            resolve: () => {
                const uri = this.getResourceUri();
                return uri && uri.path.name;
            }
        });
        variables.registerVariable({
            name: 'fileDirname',
            description: "The name of the currently opened file's directory",
            resolve: () => {
                const uri = this.getResourceUri();
                return uri && uri.path.dir.toString();
            }
        });
        variables.registerVariable({
            name: 'fileExtname',
            description: 'The extension of the currently opened file',
            resolve: () => {
                const uri = this.getResourceUri();
                return uri && uri.path.ext;
            }
        });
    }
    registerWorkspaceRootVariables(variables) {
        const scoped = (variable) => ({
            name: variable.name,
            description: variable.description,
            resolve: (context, workspaceRootName) => {
                const workspaceRoot = workspaceRootName && this.workspaceService.tryGetRoots().find(r => r.resource.path.name === workspaceRootName);
                return variable.resolve(workspaceRoot ? workspaceRoot.resource : context);
            }
        });
        variables.registerVariable(scoped({
            name: 'workspaceRoot',
            description: 'The path of the workspace root folder',
            resolve: (context) => {
                const uri = this.getWorkspaceRootUri(context);
                return uri && this.fileService.fsPath(uri);
            }
        }));
        variables.registerVariable(scoped({
            name: 'workspaceFolder',
            description: 'The path of the workspace root folder',
            resolve: (context) => {
                const uri = this.getWorkspaceRootUri(context);
                return uri && this.fileService.fsPath(uri);
            }
        }));
        variables.registerVariable(scoped({
            name: 'workspaceRootFolderName',
            description: 'The name of the workspace root folder',
            resolve: (context) => {
                const uri = this.getWorkspaceRootUri(context);
                return uri && uri.displayName;
            }
        }));
        variables.registerVariable(scoped({
            name: 'workspaceFolderBasename',
            description: 'The name of the workspace root folder',
            resolve: (context) => {
                const uri = this.getWorkspaceRootUri(context);
                return uri && uri.displayName;
            }
        }));
        variables.registerVariable(scoped({
            name: 'cwd',
            description: "The task runner's current working directory on startup",
            resolve: (context) => {
                const uri = this.getWorkspaceRootUri(context);
                return (uri && this.fileService.fsPath(uri)) || '';
            }
        }));
        variables.registerVariable(scoped({
            name: 'relativeFile',
            description: "The currently opened file's path relative to the workspace root",
            resolve: (context) => {
                const uri = this.getResourceUri();
                return uri && this.getWorkspaceRelativePath(uri, context);
            }
        }));
        variables.registerVariable(scoped({
            name: 'relativeFileDirname',
            description: "The current opened file's dirname relative to ${workspaceFolder}",
            resolve: (context) => {
                const uri = this.getResourceUri();
                const relativePath = uri && this.getWorkspaceRelativePath(uri, context);
                return relativePath && new path_1.Path(relativePath).dir.toString();
            }
        }));
    }
    getWorkspaceRootUri(uri = this.getResourceUri()) {
        return this.workspaceService.getWorkspaceRootUri(uri);
    }
    getResourceUri() {
        return this.currentWidget && this.currentWidget.getResourceUri();
    }
    getWorkspaceRelativePath(uri, context) {
        const workspaceRootUri = this.getWorkspaceRootUri(context || uri);
        const path = workspaceRootUri && workspaceRootUri.path.relative(uri.path);
        return path && path.toString();
    }
};
__decorate([
    (0, inversify_1.inject)(workspace_service_1.WorkspaceService),
    __metadata("design:type", workspace_service_1.WorkspaceService)
], WorkspaceVariableContribution.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.ApplicationShell),
    __metadata("design:type", browser_1.ApplicationShell)
], WorkspaceVariableContribution.prototype, "shell", void 0);
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], WorkspaceVariableContribution.prototype, "fileService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.WidgetManager),
    __metadata("design:type", browser_1.WidgetManager)
], WorkspaceVariableContribution.prototype, "widgetManager", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WorkspaceVariableContribution.prototype, "init", null);
WorkspaceVariableContribution = __decorate([
    (0, inversify_1.injectable)()
], WorkspaceVariableContribution);
exports.WorkspaceVariableContribution = WorkspaceVariableContribution;
//# sourceMappingURL=workspace-variable-contribution.js.map