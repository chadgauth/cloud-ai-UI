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
exports.HostedPluginReader = void 0;
const path = require("path");
const escape_html = require("escape-html");
const core_1 = require("@theia/core");
const inversify_1 = require("@theia/core/shared/inversify");
const plugin_protocol_1 = require("../../common/plugin-protocol");
const metadata_scanner_1 = require("./metadata-scanner");
const plugin_manifest_loader_1 = require("./plugin-manifest-loader");
let HostedPluginReader = class HostedPluginReader {
    constructor() {
        /**
         * Map between a plugin id and its local storage
         */
        this.pluginsIdsFiles = new Map();
    }
    configure(app) {
        app.get('/hostedPlugin/:pluginId/:path(*)', async (req, res) => {
            const pluginId = req.params.pluginId;
            const filePath = req.params.path;
            const localPath = this.pluginsIdsFiles.get(pluginId);
            if (localPath) {
                res.sendFile(filePath, { root: localPath }, e => {
                    if (!e) {
                        // the file was found and successfully transferred
                        return;
                    }
                    console.error(`Could not transfer '${filePath}' file from '${pluginId}'`, e);
                    if (res.headersSent) {
                        // the request was already closed
                        return;
                    }
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    if (e['code'] === 'ENOENT') {
                        res.status(404).send(`No such file found in '${escape_html(pluginId)}' plugin.`);
                    }
                    else {
                        res.status(500).send(`Failed to transfer a file from '${escape_html(pluginId)}' plugin.`);
                    }
                });
            }
            else {
                await this.handleMissingResource(req, res);
            }
        });
    }
    async handleMissingResource(req, res) {
        const pluginId = req.params.pluginId;
        res.status(404).send(`The plugin with id '${escape_html(pluginId)}' does not exist.`);
    }
    /**
     * @throws never
     */
    async getPluginMetadata(pluginPath) {
        try {
            const manifest = await this.readPackage(pluginPath);
            return manifest && this.readMetadata(manifest);
        }
        catch (e) {
            this.logger.error(`Failed to load plugin metadata from "${pluginPath}"`, e);
            return undefined;
        }
    }
    async readPackage(pluginPath) {
        if (!pluginPath) {
            return undefined;
        }
        const manifest = await (0, plugin_manifest_loader_1.loadManifest)(pluginPath);
        if (!manifest) {
            return undefined;
        }
        manifest.packagePath = pluginPath;
        return manifest;
    }
    readMetadata(plugin) {
        const pluginMetadata = this.scanner.getPluginMetadata(plugin);
        if (pluginMetadata.model.entryPoint.backend) {
            pluginMetadata.model.entryPoint.backend = path.resolve(plugin.packagePath, pluginMetadata.model.entryPoint.backend);
        }
        if (pluginMetadata) {
            // Add post processor
            if (this.metadataProcessors) {
                this.metadataProcessors.forEach(metadataProcessor => {
                    metadataProcessor.process(pluginMetadata);
                });
            }
            this.pluginsIdsFiles.set((0, plugin_protocol_1.getPluginId)(pluginMetadata.model), plugin.packagePath);
        }
        return pluginMetadata;
    }
    async readContribution(plugin) {
        const scanner = this.scanner.getScanner(plugin);
        return scanner.getContribution(plugin);
    }
    readDependencies(plugin) {
        const scanner = this.scanner.getScanner(plugin);
        return scanner.getDependencies(plugin);
    }
};
__decorate([
    (0, inversify_1.inject)(core_1.ILogger),
    __metadata("design:type", Object)
], HostedPluginReader.prototype, "logger", void 0);
__decorate([
    (0, inversify_1.inject)(metadata_scanner_1.MetadataScanner),
    __metadata("design:type", metadata_scanner_1.MetadataScanner)
], HostedPluginReader.prototype, "scanner", void 0);
__decorate([
    (0, inversify_1.optional)(),
    (0, inversify_1.multiInject)(plugin_protocol_1.MetadataProcessor),
    __metadata("design:type", Array)
], HostedPluginReader.prototype, "metadataProcessors", void 0);
HostedPluginReader = __decorate([
    (0, inversify_1.injectable)()
], HostedPluginReader);
exports.HostedPluginReader = HostedPluginReader;
//# sourceMappingURL=plugin-reader.js.map