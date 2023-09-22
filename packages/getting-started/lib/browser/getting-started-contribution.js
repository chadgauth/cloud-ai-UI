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
exports.GettingStartedContribution = exports.GettingStartedCommand = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const common_1 = require("@theia/core/lib/common");
const browser_1 = require("@theia/core/lib/browser");
const editor_manager_1 = require("@theia/editor/lib/browser/editor-manager");
const getting_started_widget_1 = require("./getting-started-widget");
const file_service_1 = require("@theia/filesystem/lib/browser/file-service");
const frontend_application_state_1 = require("@theia/core/lib/browser/frontend-application-state");
const preview_contribution_1 = require("@theia/preview/lib/browser/preview-contribution");
const browser_2 = require("@theia/workspace/lib/browser");
/**
 * Triggers opening the `GettingStartedWidget`.
 */
exports.GettingStartedCommand = {
    id: getting_started_widget_1.GettingStartedWidget.ID,
    label: getting_started_widget_1.GettingStartedWidget.LABEL
};
let GettingStartedContribution = class GettingStartedContribution extends browser_1.AbstractViewContribution {
    constructor() {
        super({
            widgetId: getting_started_widget_1.GettingStartedWidget.ID,
            widgetName: getting_started_widget_1.GettingStartedWidget.LABEL,
            defaultWidgetOptions: {
                area: 'main',
            }
        });
    }
    async onStart(app) {
        this.stateService.reachedState('ready').then(async () => {
            if (this.editorManager.all.length === 0) {
                await this.preferenceService.ready;
                const startupEditor = this.preferenceService.get('workbench.startupEditor');
                switch (startupEditor) {
                    case 'welcomePage':
                        this.openView({ reveal: true, activate: true });
                        break;
                    case 'welcomePageInEmptyWorkbench':
                        if (!this.workspaceService.opened) {
                            this.openView({ reveal: true, activate: true });
                        }
                        break;
                    case 'newUntitledFile':
                        this.commandRegistry.executeCommand(browser_1.CommonCommands.NEW_UNTITLED_TEXT_FILE.id);
                        break;
                    case 'readme':
                        await this.openReadme();
                        break;
                }
            }
        });
    }
    async openReadme() {
        const roots = await this.workspaceService.roots;
        const readmes = await Promise.all(roots.map(async (folder) => {
            var _a;
            const folderStat = await this.fileService.resolve(folder.resource);
            const fileArr = ((_a = folderStat === null || folderStat === void 0 ? void 0 : folderStat.children) === null || _a === void 0 ? void 0 : _a.sort((a, b) => a.name.localeCompare(b.name))) || [];
            const filePath = fileArr.find(file => file.name.toLowerCase() === 'readme.md') || fileArr.find(file => file.name.toLowerCase().startsWith('readme'));
            return filePath === null || filePath === void 0 ? void 0 : filePath.resource;
        }));
        const validReadmes = common_1.ArrayUtils.coalesce(readmes);
        if (validReadmes.length) {
            for (const readme of validReadmes) {
                await this.previewContribution.open(readme);
            }
        }
        else {
            // If no readme is found, show the welcome page.
            this.openView({ reveal: true, activate: true });
        }
    }
    registerCommands(registry) {
        registry.registerCommand(exports.GettingStartedCommand, {
            execute: () => this.openView({ reveal: true, activate: true }),
        });
    }
    registerMenus(menus) {
        menus.registerMenuAction(browser_1.CommonMenus.HELP, {
            commandId: exports.GettingStartedCommand.id,
            label: exports.GettingStartedCommand.label,
            order: 'a10'
        });
    }
};
__decorate([
    (0, inversify_1.inject)(common_1.CommandRegistry),
    __metadata("design:type", common_1.CommandRegistry)
], GettingStartedContribution.prototype, "commandRegistry", void 0);
__decorate([
    (0, inversify_1.inject)(editor_manager_1.EditorManager),
    __metadata("design:type", editor_manager_1.EditorManager)
], GettingStartedContribution.prototype, "editorManager", void 0);
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], GettingStartedContribution.prototype, "fileService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.PreferenceService),
    __metadata("design:type", Object)
], GettingStartedContribution.prototype, "preferenceService", void 0);
__decorate([
    (0, inversify_1.inject)(preview_contribution_1.PreviewContribution),
    __metadata("design:type", preview_contribution_1.PreviewContribution)
], GettingStartedContribution.prototype, "previewContribution", void 0);
__decorate([
    (0, inversify_1.inject)(frontend_application_state_1.FrontendApplicationStateService),
    __metadata("design:type", frontend_application_state_1.FrontendApplicationStateService)
], GettingStartedContribution.prototype, "stateService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.WorkspaceService),
    __metadata("design:type", browser_2.WorkspaceService)
], GettingStartedContribution.prototype, "workspaceService", void 0);
GettingStartedContribution = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], GettingStartedContribution);
exports.GettingStartedContribution = GettingStartedContribution;
//# sourceMappingURL=getting-started-contribution.js.map