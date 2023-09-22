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
exports.PluginTheiaDirectoryHandler = void 0;
const path = require("path");
const filenamify = require("filenamify");
const fs = require("@theia/core/shared/fs-extra");
const inversify_1 = require("@theia/core/shared/inversify");
const promise_util_1 = require("@theia/core/lib/common/promise-util");
const node_1 = require("@theia/core/lib/node");
const plugin_protocol_1 = require("../../../common/plugin-protocol");
const plugin_cli_contribution_1 = require("../plugin-cli-contribution");
const temp_dir_util_1 = require("../temp-dir-util");
let PluginTheiaDirectoryHandler = class PluginTheiaDirectoryHandler {
    constructor() {
        this.deploymentDirectory = new promise_util_1.Deferred();
        (0, temp_dir_util_1.getTempDirPathAsync)('theia-copied')
            .then(deploymentDirectory => this.deploymentDirectory.resolve(node_1.FileUri.create(deploymentDirectory)));
    }
    async accept(resolvedPlugin) {
        var _a, _b;
        console.debug('PluginTheiaDirectoryHandler: accepting plugin with path', resolvedPlugin.path());
        // handle only directories
        if (await resolvedPlugin.isFile()) {
            return false;
        }
        // is there a package.json ?
        const packageJsonPath = path.resolve(resolvedPlugin.path(), 'package.json');
        try {
            let packageJson = resolvedPlugin.getValue('package.json');
            if (!packageJson) {
                packageJson = await fs.readJSON(packageJsonPath);
                (_a = packageJson.publisher) !== null && _a !== void 0 ? _a : (packageJson.publisher = plugin_protocol_1.PluginIdentifiers.UNPUBLISHED);
                resolvedPlugin.storeValue('package.json', packageJson);
            }
            if ((_b = packageJson === null || packageJson === void 0 ? void 0 : packageJson.engines) === null || _b === void 0 ? void 0 : _b.theiaPlugin) {
                return true;
            }
        }
        catch { /* Failed to read file. Fall through. */ }
        return false;
    }
    async handle(context) {
        await this.copyDirectory(context);
        const types = [];
        const packageJson = context.pluginEntry().getValue('package.json');
        if (packageJson.theiaPlugin && packageJson.theiaPlugin.backend) {
            types.push(plugin_protocol_1.PluginDeployerEntryType.BACKEND);
        }
        if (packageJson.theiaPlugin && packageJson.theiaPlugin.frontend) {
            types.push(plugin_protocol_1.PluginDeployerEntryType.FRONTEND);
        }
        context.pluginEntry().accept(...types);
    }
    async copyDirectory(context) {
        if (this.pluginCli.copyUncompressedPlugins() && context.pluginEntry().type === plugin_protocol_1.PluginType.User) {
            const entry = context.pluginEntry();
            const id = entry.id();
            const pathToRestore = entry.path();
            const origin = entry.originalPath();
            const targetDir = await this.getExtensionDir(context);
            try {
                if (await fs.pathExists(targetDir) || !entry.path().startsWith(origin)) {
                    console.log(`[${id}]: already copied.`);
                }
                else {
                    console.log(`[${id}]: copying to "${targetDir}"`);
                    const deploymentDirectory = await this.deploymentDirectory.promise;
                    await fs.mkdirp(node_1.FileUri.fsPath(deploymentDirectory));
                    await context.copy(origin, targetDir);
                    entry.updatePath(targetDir);
                    if (!this.accept(entry)) {
                        throw new Error('Unable to resolve plugin metadata after copying');
                    }
                }
            }
            catch (e) {
                console.warn(`[${id}]: Error when copying.`, e);
                entry.updatePath(pathToRestore);
            }
        }
    }
    async getExtensionDir(context) {
        const deploymentDirectory = await this.deploymentDirectory.promise;
        return node_1.FileUri.fsPath(deploymentDirectory.resolve(filenamify(context.pluginEntry().id(), { replacement: '_' })));
    }
};
__decorate([
    (0, inversify_1.inject)(plugin_cli_contribution_1.PluginCliContribution),
    __metadata("design:type", plugin_cli_contribution_1.PluginCliContribution)
], PluginTheiaDirectoryHandler.prototype, "pluginCli", void 0);
PluginTheiaDirectoryHandler = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], PluginTheiaDirectoryHandler);
exports.PluginTheiaDirectoryHandler = PluginTheiaDirectoryHandler;
//# sourceMappingURL=plugin-theia-directory-handler.js.map