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
exports.PluginVsCodeFileHandler = exports.isVSCodePluginFile = void 0;
const plugin_ext_1 = require("@theia/plugin-ext");
const fs = require("@theia/core/shared/fs-extra");
const path = require("path");
const filenamify = require("filenamify");
const inversify_1 = require("@theia/core/shared/inversify");
const promise_util_1 = require("@theia/core/lib/common/promise-util");
const temp_dir_util_1 = require("@theia/plugin-ext/lib/main/node/temp-dir-util");
const plugin_vscode_environment_1 = require("../common/plugin-vscode-environment");
const file_uri_1 = require("@theia/core/lib/node/file-uri");
const isVSCodePluginFile = (pluginPath) => Boolean(pluginPath && (pluginPath.endsWith('.vsix') || pluginPath.endsWith('.tgz')));
exports.isVSCodePluginFile = isVSCodePluginFile;
let PluginVsCodeFileHandler = class PluginVsCodeFileHandler {
    constructor() {
        this.systemExtensionsDirUri = new promise_util_1.Deferred();
        (0, temp_dir_util_1.getTempDirPathAsync)('vscode-unpacked')
            .then(systemExtensionsDirPath => this.systemExtensionsDirUri.resolve(file_uri_1.FileUri.create(systemExtensionsDirPath)));
    }
    async accept(resolvedPlugin) {
        return resolvedPlugin.isFile().then(file => {
            if (!file) {
                return false;
            }
            return (0, exports.isVSCodePluginFile)(resolvedPlugin.path());
        });
    }
    async handle(context) {
        const id = context.pluginEntry().id();
        const extensionDir = await this.getExtensionDir(context);
        console.log(`[${id}]: trying to decompress into "${extensionDir}"...`);
        if (context.pluginEntry().type === plugin_ext_1.PluginType.User && await fs.pathExists(extensionDir)) {
            console.log(`[${id}]: already found`);
            context.pluginEntry().updatePath(extensionDir);
            return;
        }
        await this.decompress(extensionDir, context);
        console.log(`[${id}]: decompressed`);
        context.pluginEntry().updatePath(extensionDir);
    }
    async getExtensionDir(context) {
        const systemExtensionsDirUri = await this.systemExtensionsDirUri.promise;
        return file_uri_1.FileUri.fsPath(systemExtensionsDirUri.resolve(filenamify(context.pluginEntry().id(), { replacement: '_' })));
    }
    async decompress(extensionDir, context) {
        await context.unzip(context.pluginEntry().path(), extensionDir);
        if (context.pluginEntry().path().endsWith('.tgz')) {
            const extensionPath = path.join(extensionDir, 'package');
            const vscodeNodeModulesPath = path.join(extensionPath, 'vscode_node_modules.zip');
            if (await fs.pathExists(vscodeNodeModulesPath)) {
                await context.unzip(vscodeNodeModulesPath, path.join(extensionPath, 'node_modules'));
            }
        }
    }
};
__decorate([
    (0, inversify_1.inject)(plugin_vscode_environment_1.PluginVSCodeEnvironment),
    __metadata("design:type", plugin_vscode_environment_1.PluginVSCodeEnvironment)
], PluginVsCodeFileHandler.prototype, "environment", void 0);
PluginVsCodeFileHandler = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], PluginVsCodeFileHandler);
exports.PluginVsCodeFileHandler = PluginVsCodeFileHandler;
//# sourceMappingURL=plugin-vscode-file-handler.js.map