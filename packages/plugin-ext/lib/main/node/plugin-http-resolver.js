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
exports.HttpPluginDeployerResolver = void 0;
const request_1 = require("@theia/core/shared/@theia/request");
const inversify_1 = require("@theia/core/shared/inversify");
const promise_util_1 = require("@theia/core/lib/common/promise-util");
const fs_1 = require("fs");
const path = require("path");
const url = require("url");
const temp_dir_util_1 = require("./temp-dir-util");
/**
 * Resolver that handle the http(s): protocol
 * http://path/to/my.plugin
 * https://path/to/my.plugin
 */
let HttpPluginDeployerResolver = class HttpPluginDeployerResolver {
    constructor() {
        this.unpackedFolder = new promise_util_1.Deferred();
        (0, temp_dir_util_1.getTempDirPathAsync)('http-remote').then(async (unpackedFolder) => {
            try {
                await fs_1.promises.mkdir(unpackedFolder, { recursive: true });
                this.unpackedFolder.resolve(unpackedFolder);
            }
            catch (err) {
                this.unpackedFolder.reject(err);
            }
        });
    }
    /**
     * Grab the remote file specified by the given URL
     */
    async resolve(pluginResolverContext) {
        // download the file
        // keep filename of the url
        const urlPath = pluginResolverContext.getOriginId();
        const link = url.parse(urlPath);
        if (!link.pathname) {
            throw new Error('invalid link URI' + urlPath);
        }
        const dirname = path.dirname(link.pathname);
        const basename = path.basename(link.pathname);
        const filename = dirname.replace(/\W/g, '_') + ('-') + basename;
        const unpackedFolder = await this.unpackedFolder.promise;
        const unpackedPath = path.resolve(unpackedFolder, path.basename(filename));
        try {
            await fs_1.promises.access(unpackedPath);
            // use of cache. If file is already there use it directly
            return;
        }
        catch { }
        const response = await this.request.request({ url: pluginResolverContext.getOriginId() });
        if (request_1.RequestContext.isSuccess(response)) {
            await fs_1.promises.writeFile(unpackedPath, response.buffer);
            pluginResolverContext.addPlugin(pluginResolverContext.getOriginId(), unpackedPath);
        }
        else {
            throw new Error(`Could not download the plugin from ${pluginResolverContext.getOriginId()}. HTTP status code: ${response.res.statusCode}`);
        }
    }
    /**
     * Handle only the plugins that starts with http or https:
     */
    accept(pluginId) {
        return /^http[s]?:\/\/.*$/gm.test(pluginId);
    }
};
__decorate([
    (0, inversify_1.inject)(request_1.RequestService),
    __metadata("design:type", Object)
], HttpPluginDeployerResolver.prototype, "request", void 0);
HttpPluginDeployerResolver = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], HttpPluginDeployerResolver);
exports.HttpPluginDeployerResolver = HttpPluginDeployerResolver;
//# sourceMappingURL=plugin-http-resolver.js.map