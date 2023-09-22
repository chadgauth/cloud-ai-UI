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
var LocalVSIXFilePluginDeployerResolver_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalVSIXFilePluginDeployerResolver = void 0;
const fs = require("@theia/core/shared/fs-extra");
const path = require("path");
const inversify_1 = require("@theia/core/shared/inversify");
const node_1 = require("@theia/core/lib/node");
const local_plugin_deployer_resolver_1 = require("@theia/plugin-ext/lib/main/node/resolvers/local-plugin-deployer-resolver");
const plugin_vscode_environment_1 = require("../common/plugin-vscode-environment");
const plugin_vscode_file_handler_1 = require("./plugin-vscode-file-handler");
let LocalVSIXFilePluginDeployerResolver = LocalVSIXFilePluginDeployerResolver_1 = class LocalVSIXFilePluginDeployerResolver extends local_plugin_deployer_resolver_1.LocalPluginDeployerResolver {
    get supportedScheme() {
        return LocalVSIXFilePluginDeployerResolver_1.LOCAL_FILE;
    }
    accept(pluginId) {
        return super.accept(pluginId) && (0, plugin_vscode_file_handler_1.isVSCodePluginFile)(pluginId);
    }
    async resolveFromLocalPath(pluginResolverContext, localPath) {
        const fileName = path.basename(localPath);
        const pathInUserExtensionsDirectory = await this.ensureDiscoverability(localPath);
        pluginResolverContext.addPlugin(fileName, pathInUserExtensionsDirectory);
    }
    /**
     * Ensures that a user-installed plugin file is transferred to the user extension folder.
     */
    async ensureDiscoverability(localPath) {
        const userExtensionsDir = await this.environment.getExtensionsDirUri();
        if (!userExtensionsDir.isEqualOrParent(node_1.FileUri.create(localPath))) {
            try {
                const newPath = node_1.FileUri.fsPath(userExtensionsDir.resolve(path.basename(localPath)));
                await fs.mkdirp(node_1.FileUri.fsPath(userExtensionsDir));
                await new Promise((resolve, reject) => {
                    fs.copyFile(localPath, newPath, error => error ? reject(error) : resolve());
                });
                return newPath;
            }
            catch (e) {
                console.warn(`Problem copying plugin at ${localPath}:`, e);
            }
        }
        return localPath;
    }
};
LocalVSIXFilePluginDeployerResolver.LOCAL_FILE = 'local-file';
__decorate([
    (0, inversify_1.inject)(plugin_vscode_environment_1.PluginVSCodeEnvironment),
    __metadata("design:type", plugin_vscode_environment_1.PluginVSCodeEnvironment)
], LocalVSIXFilePluginDeployerResolver.prototype, "environment", void 0);
LocalVSIXFilePluginDeployerResolver = LocalVSIXFilePluginDeployerResolver_1 = __decorate([
    (0, inversify_1.injectable)()
], LocalVSIXFilePluginDeployerResolver);
exports.LocalVSIXFilePluginDeployerResolver = LocalVSIXFilePluginDeployerResolver;
//# sourceMappingURL=local-vsix-file-plugin-deployer-resolver.js.map