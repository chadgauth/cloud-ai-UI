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
exports.QuickOpenWorkspace = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/core/lib/browser");
const env_variables_1 = require("@theia/core/lib/common/env-variables");
const workspace_service_1 = require("./workspace-service");
const workspace_preferences_1 = require("./workspace-preferences");
const uri_1 = require("@theia/core/lib/common/uri");
const file_service_1 = require("@theia/filesystem/lib/browser/file-service");
const common_1 = require("@theia/core/lib/common");
const untitled_workspace_service_1 = require("../common/untitled-workspace-service");
let QuickOpenWorkspace = class QuickOpenWorkspace {
    constructor() {
        this.removeRecentWorkspaceButton = {
            iconClass: 'codicon-remove-close',
            tooltip: common_1.nls.localizeByDefault('Remove from Recently Opened')
        };
    }
    async open(workspaces) {
        var _a;
        this.items = [];
        const [homeDirUri] = await Promise.all([
            this.envServer.getHomeDirUri(),
            this.workspaceService.getUntitledWorkspace()
        ]);
        const home = new uri_1.default(homeDirUri).path.toString();
        await this.preferences.ready;
        this.items.push({
            type: 'separator',
            label: common_1.nls.localizeByDefault('folders & workspaces')
        });
        for (const workspace of workspaces) {
            const uri = new uri_1.default(workspace);
            let stat;
            try {
                stat = await this.fileService.resolve(uri);
            }
            catch { }
            if (this.untitledWorkspaceService.isUntitledWorkspace(uri) || !stat) {
                continue; // skip the temporary workspace files or an undefined stat.
            }
            const icon = this.labelProvider.getIcon(stat);
            const iconClasses = icon === '' ? undefined : [icon + ' file-icon'];
            this.items.push({
                label: uri.path.base,
                description: common_1.Path.tildify(uri.path.toString(), home),
                iconClasses,
                buttons: [this.removeRecentWorkspaceButton],
                resource: uri,
                execute: () => {
                    const current = this.workspaceService.workspace;
                    const uriToOpen = new uri_1.default(workspace);
                    if ((current && current.resource.toString() !== workspace) || !current) {
                        this.workspaceService.open(uriToOpen);
                    }
                },
            });
        }
        (_a = this.quickInputService) === null || _a === void 0 ? void 0 : _a.showQuickPick(this.items, {
            placeholder: common_1.nls.localize('theia/workspace/openRecentPlaceholder', 'Type the name of the workspace you want to open'),
            onDidTriggerItemButton: async (context) => {
                const resource = context.item.resource;
                if (resource) {
                    await this.workspaceService.removeRecentWorkspace(resource.toString());
                    context.removeItem();
                }
            }
        });
    }
    select() {
        this.items = [];
        this.opened = this.workspaceService.opened;
        this.workspaceService.recentWorkspaces().then(workspaceRoots => {
            if (workspaceRoots) {
                this.open(workspaceRoots);
            }
        });
    }
};
__decorate([
    (0, inversify_1.inject)(browser_1.QuickInputService),
    (0, inversify_1.optional)(),
    __metadata("design:type", Object)
], QuickOpenWorkspace.prototype, "quickInputService", void 0);
__decorate([
    (0, inversify_1.inject)(workspace_service_1.WorkspaceService),
    __metadata("design:type", workspace_service_1.WorkspaceService)
], QuickOpenWorkspace.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], QuickOpenWorkspace.prototype, "fileService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.LabelProvider),
    __metadata("design:type", browser_1.LabelProvider)
], QuickOpenWorkspace.prototype, "labelProvider", void 0);
__decorate([
    (0, inversify_1.inject)(workspace_preferences_1.WorkspacePreferences),
    __metadata("design:type", Object)
], QuickOpenWorkspace.prototype, "preferences", void 0);
__decorate([
    (0, inversify_1.inject)(env_variables_1.EnvVariablesServer),
    __metadata("design:type", Object)
], QuickOpenWorkspace.prototype, "envServer", void 0);
__decorate([
    (0, inversify_1.inject)(untitled_workspace_service_1.UntitledWorkspaceService),
    __metadata("design:type", untitled_workspace_service_1.UntitledWorkspaceService)
], QuickOpenWorkspace.prototype, "untitledWorkspaceService", void 0);
QuickOpenWorkspace = __decorate([
    (0, inversify_1.injectable)()
], QuickOpenWorkspace);
exports.QuickOpenWorkspace = QuickOpenWorkspace;
//# sourceMappingURL=quick-open-workspace.js.map