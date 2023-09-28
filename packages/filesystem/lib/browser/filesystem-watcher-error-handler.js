"use strict";
// *****************************************************************************
// Copyright (C) 2020 Arm and others.
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
exports.FileSystemWatcherErrorHandler = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const environment_1 = require("@theia/core/shared/@theia/application-package/lib/environment");
const core_1 = require("@theia/core");
const window_service_1 = require("@theia/core/lib/browser/window/window-service");
let FileSystemWatcherErrorHandler = class FileSystemWatcherErrorHandler {
    constructor() {
        this.watchHandlesExhausted = false;
    }
    get instructionsLink() {
        return 'https://code.visualstudio.com/docs/setup/linux#_visual-studio-code-is-unable-to-watch-for-file-changes-in-this-large-workspace-error-enospc';
    }
    async handleError() {
        if (!this.watchHandlesExhausted) {
            this.watchHandlesExhausted = true;
            if (this.isElectron()) {
                const instructionsAction = 'Instructions';
                const action = await this.messageService.warn('Unable to watch for file changes in this large workspace.  Please follow the instructions link to resolve this issue.', { timeout: 60000 }, instructionsAction);
                if (action === instructionsAction) {
                    this.windowService.openNewWindow(this.instructionsLink, { external: true });
                }
            }
            else {
                await this.messageService.warn('Unable to watch for file changes in this large workspace.  The information you see may not include recent file changes.', { timeout: 60000 });
            }
        }
    }
    isElectron() {
        return environment_1.environment.electron.is();
    }
};
__decorate([
    (0, inversify_1.inject)(core_1.MessageService),
    __metadata("design:type", core_1.MessageService)
], FileSystemWatcherErrorHandler.prototype, "messageService", void 0);
__decorate([
    (0, inversify_1.inject)(window_service_1.WindowService),
    __metadata("design:type", Object)
], FileSystemWatcherErrorHandler.prototype, "windowService", void 0);
FileSystemWatcherErrorHandler = __decorate([
    (0, inversify_1.injectable)()
], FileSystemWatcherErrorHandler);
exports.FileSystemWatcherErrorHandler = FileSystemWatcherErrorHandler;
//# sourceMappingURL=filesystem-watcher-error-handler.js.map