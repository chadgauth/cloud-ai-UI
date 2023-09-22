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
exports.PluginVsCodeDirectoryHandler = void 0;
const path = require("path");
const filenamify = require("filenamify");
const fs = require("@theia/core/shared/fs-extra");
const inversify_1 = require("@theia/core/shared/inversify");
const promise_util_1 = require("@theia/core/lib/common/promise-util");
const temp_dir_util_1 = require("@theia/plugin-ext/lib/main/node/temp-dir-util");
const plugin_ext_1 = require("@theia/plugin-ext");
const node_1 = require("@theia/core/lib/node");
const plugin_cli_contribution_1 = require("@theia/plugin-ext/lib/main/node/plugin-cli-contribution");
let PluginVsCodeDirectoryHandler = class PluginVsCodeDirectoryHandler {
    constructor() {
        this.deploymentDirectory = new promise_util_1.Deferred();
        (0, temp_dir_util_1.getTempDirPathAsync)('vscode-copied')
            .then(deploymentDirectoryPath => this.deploymentDirectory.resolve(node_1.FileUri.create(deploymentDirectoryPath)));
    }
    async accept(plugin) {
        console.debug(`Resolving "${plugin.id()}" as a VS Code extension...`);
        return this.attemptResolution(plugin);
    }
    async attemptResolution(plugin) {
        if (this.resolvePackage(plugin)) {
            return true;
        }
        return this.deriveMetadata(plugin);
    }
    async deriveMetadata(plugin) {
        return (0, promise_util_1.firstTrue)(this.resolveFromSources(plugin), this.resolveFromVSIX(plugin), this.resolveFromNpmTarball(plugin));
    }
    async handle(context) {
        await this.copyDirectory(context);
        const types = [];
        const packageJson = context.pluginEntry().getValue('package.json');
        if (packageJson.browser) {
            types.push(plugin_ext_1.PluginDeployerEntryType.FRONTEND);
        }
        if (packageJson.main || !packageJson.browser) {
            types.push(plugin_ext_1.PluginDeployerEntryType.BACKEND);
        }
        context.pluginEntry().accept(...types);
    }
    async copyDirectory(context) {
        if (this.pluginCli.copyUncompressedPlugins() && context.pluginEntry().type === plugin_ext_1.PluginType.User) {
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
                    if (!this.deriveMetadata(entry)) {
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
    async resolveFromSources(plugin) {
        const pluginPath = plugin.path();
        const pck = await this.requirePackage(pluginPath);
        return this.resolvePackage(plugin, { pluginPath, pck });
    }
    async resolveFromVSIX(plugin) {
        if (!(await fs.pathExists(path.join(plugin.path(), 'extension.vsixmanifest')))) {
            return false;
        }
        const pluginPath = path.join(plugin.path(), 'extension');
        const pck = await this.requirePackage(pluginPath);
        return this.resolvePackage(plugin, { pluginPath, pck });
    }
    async resolveFromNpmTarball(plugin) {
        const pluginPath = path.join(plugin.path(), 'package');
        const pck = await this.requirePackage(pluginPath);
        return this.resolvePackage(plugin, { pluginPath, pck });
    }
    resolvePackage(plugin, options) {
        var _a;
        const { pluginPath, pck } = options || {
            pluginPath: plugin.path(),
            pck: plugin.getValue('package.json')
        };
        if (!pck || !pck.name || !pck.version || !pck.engines || !pck.engines.vscode) {
            return false;
        }
        (_a = pck.publisher) !== null && _a !== void 0 ? _a : (pck.publisher = plugin_ext_1.PluginIdentifiers.UNPUBLISHED);
        if (options) {
            plugin.storeValue('package.json', pck);
            plugin.rootPath = plugin.path();
            plugin.updatePath(pluginPath);
        }
        console.debug(`Resolved "${plugin.id()}" to a VS Code extension "${pck.name}@${pck.version}" with engines:`, pck.engines);
        return true;
    }
    async requirePackage(pluginPath) {
        var _a;
        try {
            const plugin = await fs.readJSON(path.join(pluginPath, 'package.json'));
            (_a = plugin.publisher) !== null && _a !== void 0 ? _a : (plugin.publisher = plugin_ext_1.PluginIdentifiers.UNPUBLISHED);
            return plugin;
        }
        catch {
            return undefined;
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
], PluginVsCodeDirectoryHandler.prototype, "pluginCli", void 0);
PluginVsCodeDirectoryHandler = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], PluginVsCodeDirectoryHandler);
exports.PluginVsCodeDirectoryHandler = PluginVsCodeDirectoryHandler;
//# sourceMappingURL=plugin-vscode-directory-handler.js.map