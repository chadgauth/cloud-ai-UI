"use strict";
// *****************************************************************************
// Copyright (C) 2020 TypeFox and others.
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
exports.VSXExtensionResolver = void 0;
const path = require("path");
const semver = require("semver");
const fs = require("@theia/core/shared/fs-extra");
const inversify_1 = require("@theia/core/shared/inversify");
const uri_1 = require("@theia/core/lib/common/uri");
const plugin_protocol_1 = require("@theia/plugin-ext/lib/common/plugin-protocol");
const plugin_vscode_uri_1 = require("@theia/plugin-ext-vscode/lib/common/plugin-vscode-uri");
const ovsx_client_provider_1 = require("../common/ovsx-client-provider");
const ovsx_client_1 = require("@theia/ovsx-client");
const request_1 = require("@theia/core/shared/@theia/request");
const plugin_vscode_environment_1 = require("@theia/plugin-ext-vscode/lib/common/plugin-vscode-environment");
const plugin_uninstallation_manager_1 = require("@theia/plugin-ext/lib/main/node/plugin-uninstallation-manager");
let VSXExtensionResolver = class VSXExtensionResolver {
    accept(pluginId) {
        return !!plugin_vscode_uri_1.VSCodeExtensionUri.toId(new uri_1.default(pluginId));
    }
    async resolve(context, options) {
        const id = plugin_vscode_uri_1.VSCodeExtensionUri.toId(new uri_1.default(context.getOriginId()));
        if (!id) {
            return;
        }
        let extension;
        const client = await this.clientProvider();
        if (options) {
            console.log(`[${id}]: trying to resolve version ${options.version}...`);
            const { extensions } = await client.query({ extensionId: id, extensionVersion: options.version, includeAllVersions: true });
            extension = extensions[0];
        }
        else {
            console.log(`[${id}]: trying to resolve latest version...`);
            const { extensions } = await client.query({ extensionId: id, includeAllVersions: true });
            extension = this.vsxApiFilter.getLatestCompatibleExtension(extensions);
        }
        if (!extension) {
            return;
        }
        if (extension.error) {
            throw new Error(extension.error);
        }
        const resolvedId = id + '-' + extension.version;
        const downloadUrl = extension.files.download;
        console.log(`[${id}]: resolved to '${resolvedId}'`);
        if (!(options === null || options === void 0 ? void 0 : options.ignoreOtherVersions)) {
            const existingVersion = this.hasSameOrNewerVersion(id, extension);
            if (existingVersion) {
                console.log(`[${id}]: is already installed with the same or newer version '${existingVersion}'`);
                return;
            }
        }
        const downloadPath = (await this.environment.getExtensionsDirUri()).path.fsPath();
        await fs.ensureDir(downloadPath);
        const extensionPath = path.resolve(downloadPath, path.basename(downloadUrl));
        console.log(`[${resolvedId}]: trying to download from "${downloadUrl}"...`, 'to path', downloadPath);
        if (!await this.download(downloadUrl, extensionPath)) {
            console.log(`[${resolvedId}]: not found`);
            return;
        }
        console.log(`[${resolvedId}]: downloaded to ${extensionPath}"`);
        context.addPlugin(resolvedId, extensionPath);
    }
    hasSameOrNewerVersion(id, extension) {
        const existingPlugins = this.pluginDeployerHandler.getDeployedPluginsById(id)
            .filter(plugin => !this.uninstallationManager.isUninstalled(plugin_protocol_1.PluginIdentifiers.componentsToVersionedId(plugin.metadata.model)));
        const sufficientVersion = existingPlugins.find(existingPlugin => {
            const existingVersion = semver.clean(existingPlugin.metadata.model.version);
            const desiredVersion = semver.clean(extension.version);
            if (desiredVersion && existingVersion && semver.gte(existingVersion, desiredVersion)) {
                return existingVersion;
            }
        });
        return sufficientVersion === null || sufficientVersion === void 0 ? void 0 : sufficientVersion.metadata.model.version;
    }
    async download(downloadUrl, downloadPath) {
        if (await fs.pathExists(downloadPath)) {
            return true;
        }
        const context = await this.requestService.request({ url: downloadUrl });
        if (context.res.statusCode === 404) {
            return false;
        }
        else if (context.res.statusCode !== 200) {
            throw new Error('Request returned status code: ' + context.res.statusCode);
        }
        else {
            await fs.writeFile(downloadPath, context.buffer);
            return true;
        }
    }
};
__decorate([
    (0, inversify_1.inject)(ovsx_client_provider_1.OVSXClientProvider),
    __metadata("design:type", Function)
], VSXExtensionResolver.prototype, "clientProvider", void 0);
__decorate([
    (0, inversify_1.inject)(plugin_protocol_1.PluginDeployerHandler),
    __metadata("design:type", Object)
], VSXExtensionResolver.prototype, "pluginDeployerHandler", void 0);
__decorate([
    (0, inversify_1.inject)(request_1.RequestService),
    __metadata("design:type", Object)
], VSXExtensionResolver.prototype, "requestService", void 0);
__decorate([
    (0, inversify_1.inject)(plugin_vscode_environment_1.PluginVSCodeEnvironment),
    __metadata("design:type", plugin_vscode_environment_1.PluginVSCodeEnvironment)
], VSXExtensionResolver.prototype, "environment", void 0);
__decorate([
    (0, inversify_1.inject)(plugin_uninstallation_manager_1.PluginUninstallationManager),
    __metadata("design:type", plugin_uninstallation_manager_1.PluginUninstallationManager)
], VSXExtensionResolver.prototype, "uninstallationManager", void 0);
__decorate([
    (0, inversify_1.inject)(ovsx_client_1.OVSXApiFilter),
    __metadata("design:type", Object)
], VSXExtensionResolver.prototype, "vsxApiFilter", void 0);
VSXExtensionResolver = __decorate([
    (0, inversify_1.injectable)()
], VSXExtensionResolver);
exports.VSXExtensionResolver = VSXExtensionResolver;
//# sourceMappingURL=vsx-extension-resolver.js.map