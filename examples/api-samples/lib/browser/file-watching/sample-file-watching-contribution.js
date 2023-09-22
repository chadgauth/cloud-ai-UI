"use strict";
// *****************************************************************************
// Copyright (C) 2020 Ericsson and others.
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
exports.bindSampleFileWatching = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const browser_1 = require("@theia/core/lib/browser");
const file_service_1 = require("@theia/filesystem/lib/browser/file-service");
const browser_2 = require("@theia/workspace/lib/browser");
function bindSampleFileWatching(bind) {
    bind(browser_1.FrontendApplicationContribution).to(SampleFileWatchingContribution).inSingletonScope();
    bind(browser_1.PreferenceContribution).toConstantValue({ schema: FileWatchingPreferencesSchema });
    bind(FileWatchingPreferences).toDynamicValue(ctx => (0, browser_1.createPreferenceProxy)(ctx.container.get(browser_1.PreferenceService), FileWatchingPreferencesSchema));
}
exports.bindSampleFileWatching = bindSampleFileWatching;
const FileWatchingPreferences = Symbol('FileWatchingPreferences');
const FileWatchingPreferencesSchema = {
    type: 'object',
    properties: {
        'sample.file-watching.verbose': {
            type: 'boolean',
            default: false,
            description: 'Enable verbose file watching logs.'
        }
    }
};
let SampleFileWatchingContribution = class SampleFileWatchingContribution {
    init() {
        this.verbose = this.fileWatchingPreferences['sample.file-watching.verbose'];
        this.fileWatchingPreferences.onPreferenceChanged(e => {
            if (e.preferenceName === 'sample.file-watching.verbose') {
                this.verbose = e.newValue;
            }
        });
    }
    onStart() {
        this.fileService.onDidFilesChange(event => {
            // Only log if the verbose preference is set.
            if (this.verbose) {
                // Get the workspace roots for the current frontend:
                const roots = this.workspaceService.tryGetRoots();
                // Create some name to help find out which frontend logged the message:
                const workspace = roots.length > 0
                    ? roots.map(root => this.labelProvider.getLongName(root.resource)).join('+')
                    : '<no workspace>';
                console.log(`Sample File Watching: ${event.changes.length} file(s) changed! ${workspace}`);
            }
        });
    }
};
__decorate([
    (0, inversify_1.inject)(file_service_1.FileService),
    __metadata("design:type", file_service_1.FileService)
], SampleFileWatchingContribution.prototype, "fileService", void 0);
__decorate([
    (0, inversify_1.inject)(browser_1.LabelProvider),
    __metadata("design:type", browser_1.LabelProvider)
], SampleFileWatchingContribution.prototype, "labelProvider", void 0);
__decorate([
    (0, inversify_1.inject)(browser_2.WorkspaceService),
    __metadata("design:type", browser_2.WorkspaceService)
], SampleFileWatchingContribution.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(FileWatchingPreferences),
    __metadata("design:type", Object)
], SampleFileWatchingContribution.prototype, "fileWatchingPreferences", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SampleFileWatchingContribution.prototype, "init", null);
SampleFileWatchingContribution = __decorate([
    (0, inversify_1.injectable)()
], SampleFileWatchingContribution);
//# sourceMappingURL=sample-file-watching-contribution.js.map