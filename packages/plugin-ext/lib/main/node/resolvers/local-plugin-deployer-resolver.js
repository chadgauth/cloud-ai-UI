"use strict";
// *****************************************************************************
// Copyright (C) 2020 Red Hat, Inc. and others.
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalPluginDeployerResolver = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const fs = require("@theia/core/shared/fs-extra");
const path = require("path");
const node_1 = require("@theia/core/lib/node");
const uri_1 = require("@theia/core/lib/common/uri");
let LocalPluginDeployerResolver = class LocalPluginDeployerResolver {
    async resolve(pluginResolverContext) {
        const localPath = await this.resolveLocalPluginPath(pluginResolverContext, this.supportedScheme);
        if (localPath) {
            await this.resolveFromLocalPath(pluginResolverContext, localPath);
        }
    }
    accept(pluginId) {
        return pluginId.startsWith(this.supportedScheme);
    }
    async resolveLocalPluginPath(pluginResolverContext, expectedScheme) {
        const localUri = new uri_1.default(pluginResolverContext.getOriginId());
        if (localUri.scheme !== expectedScheme) {
            return null;
        }
        let fsPath = node_1.FileUri.fsPath(localUri);
        if (!path.isAbsolute(fsPath)) {
            fsPath = path.resolve(process.cwd(), fsPath);
        }
        if (!await fs.pathExists(fsPath)) {
            console.warn(`The local plugin referenced by ${pluginResolverContext.getOriginId()} does not exist.`);
            return null;
        }
        return fsPath;
    }
};
LocalPluginDeployerResolver = __decorate([
    (0, inversify_1.injectable)()
], LocalPluginDeployerResolver);
exports.LocalPluginDeployerResolver = LocalPluginDeployerResolver;
//# sourceMappingURL=local-plugin-deployer-resolver.js.map