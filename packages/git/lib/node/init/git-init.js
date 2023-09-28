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
exports.DefaultGitInit = exports.GitInit = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const find_git_exec_1 = require("find-git-exec");
const path_1 = require("path");
const fs_extra_1 = require("@theia/core/shared/fs-extra");
const logger_1 = require("@theia/core/lib/common/logger");
const disposable_1 = require("@theia/core/lib/common/disposable");
const core_1 = require("@theia/core");
/**
 * Initializer hook for Git.
 */
exports.GitInit = Symbol('GitInit');
/**
 * The default initializer. It is used in the browser.
 *
 * Configures the Git extension to use the Git executable from the `PATH`.
 */
let DefaultGitInit = class DefaultGitInit {
    constructor() {
        this.toDispose = new disposable_1.DisposableCollection();
    }
    async init() {
        const { env } = process;
        try {
            const { execPath, path, version } = await (0, find_git_exec_1.default)();
            if (!!execPath && !!path && !!version) {
                // https://github.com/desktop/dugite/issues/111#issuecomment-323222834
                // Instead of the executable path, we need the root directory of Git.
                const dir = (0, path_1.dirname)((0, path_1.dirname)(path));
                const [execPathOk, pathOk, dirOk] = await Promise.all([(0, fs_extra_1.pathExists)(execPath), (0, fs_extra_1.pathExists)(path), (0, fs_extra_1.pathExists)(dir)]);
                if (execPathOk && pathOk && dirOk) {
                    if (typeof env.LOCAL_GIT_DIRECTORY !== 'undefined' && env.LOCAL_GIT_DIRECTORY !== dir) {
                        this.logger.error(`Misconfigured env.LOCAL_GIT_DIRECTORY: ${env.LOCAL_GIT_DIRECTORY}. dir was: ${dir}`);
                        this.messages.error('The LOCAL_GIT_DIRECTORY env variable was already set to a different value.', { timeout: 0 });
                        return;
                    }
                    if (typeof env.GIT_EXEC_PATH !== 'undefined' && env.GIT_EXEC_PATH !== execPath) {
                        this.logger.error(`Misconfigured env.GIT_EXEC_PATH: ${env.GIT_EXEC_PATH}. execPath was: ${execPath}`);
                        this.messages.error('The GIT_EXEC_PATH env variable was already set to a different value.', { timeout: 0 });
                        return;
                    }
                    process.env.LOCAL_GIT_DIRECTORY = dir;
                    process.env.GIT_EXEC_PATH = execPath;
                    this.logger.info(`Using Git [${version}] from the PATH. (${path})`);
                    return;
                }
            }
            this.messages.error('Could not find Git on the PATH.', { timeout: 0 });
        }
        catch (err) {
            this.logger.error(err);
            this.messages.error('An unexpected error occurred when locating the Git executable.', { timeout: 0 });
        }
    }
    dispose() {
        this.toDispose.dispose();
    }
};
__decorate([
    (0, inversify_1.inject)(logger_1.ILogger),
    __metadata("design:type", Object)
], DefaultGitInit.prototype, "logger", void 0);
__decorate([
    (0, inversify_1.inject)(core_1.MessageService),
    __metadata("design:type", core_1.MessageService)
], DefaultGitInit.prototype, "messages", void 0);
DefaultGitInit = __decorate([
    (0, inversify_1.injectable)()
], DefaultGitInit);
exports.DefaultGitInit = DefaultGitInit;
//# sourceMappingURL=git-init.js.map