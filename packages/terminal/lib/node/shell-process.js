"use strict";
// *****************************************************************************
// Copyright (C) 2017 Ericsson and others.
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ShellProcess_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShellProcess = exports.ShellProcessOptions = exports.ShellProcessFactory = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const os = require("os");
const logger_1 = require("@theia/core/lib/common/logger");
const node_1 = require("@theia/process/lib/node");
const common_1 = require("@theia/core/lib/common");
const uri_1 = require("@theia/core/lib/common/uri");
const file_uri_1 = require("@theia/core/lib/node/file-uri");
const environment_utils_1 = require("@theia/core/lib/node/environment-utils");
const utils_1 = require("@theia/process/lib/node/utils");
exports.ShellProcessFactory = Symbol('ShellProcessFactory');
exports.ShellProcessOptions = Symbol('ShellProcessOptions');
function getRootPath(rootURI) {
    if (rootURI) {
        const uri = new uri_1.default(rootURI);
        return file_uri_1.FileUri.fsPath(uri);
    }
    else {
        return os.homedir();
    }
}
let ShellProcess = ShellProcess_1 = class ShellProcess extends node_1.TerminalProcess {
    constructor(// eslint-disable-next-line @typescript-eslint/indent
    options, processManager, ringBuffer, logger, environmentUtils) {
        super({
            command: options.shell || ShellProcess_1.getShellExecutablePath(),
            args: options.args || ShellProcess_1.getShellExecutableArgs(),
            options: {
                name: 'xterm-color',
                cols: options.cols || ShellProcess_1.defaultCols,
                rows: options.rows || ShellProcess_1.defaultRows,
                cwd: getRootPath(options.rootURI),
                env: options.strictEnv !== true ? environmentUtils.mergeProcessEnv(options.env) : options.env,
            },
            isPseudo: options.isPseudo,
        }, processManager, ringBuffer, logger);
    }
    static getShellExecutablePath() {
        const shell = process.env.THEIA_SHELL;
        if (shell) {
            return shell;
        }
        if (common_1.isWindows) {
            return 'cmd.exe';
        }
        else {
            return process.env.SHELL;
        }
    }
    static getShellExecutableArgs() {
        const args = process.env.THEIA_SHELL_ARGS;
        if (args) {
            return (0, utils_1.parseArgs)(args);
        }
        if (common_1.isOSX) {
            return ['-l'];
        }
        else {
            return [];
        }
    }
};
ShellProcess.defaultCols = 80;
ShellProcess.defaultRows = 24;
ShellProcess = ShellProcess_1 = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(exports.ShellProcessOptions)),
    __param(1, (0, inversify_1.inject)(node_1.ProcessManager)),
    __param(2, (0, inversify_1.inject)(node_1.MultiRingBuffer)),
    __param(3, (0, inversify_1.inject)(logger_1.ILogger)),
    __param(3, (0, inversify_1.named)('terminal')),
    __param(4, (0, inversify_1.inject)(environment_utils_1.EnvironmentUtils)),
    __metadata("design:paramtypes", [Object, node_1.ProcessManager,
        node_1.MultiRingBuffer, Object, environment_utils_1.EnvironmentUtils])
], ShellProcess);
exports.ShellProcess = ShellProcess;
//# sourceMappingURL=shell-process.js.map