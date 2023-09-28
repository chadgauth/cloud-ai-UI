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
exports.PluginTheiaFileHandler = void 0;
const plugin_protocol_1 = require("../../../common/plugin-protocol");
const inversify_1 = require("@theia/core/shared/inversify");
const promise_util_1 = require("@theia/core/lib/common/promise-util");
const temp_dir_util_1 = require("../temp-dir-util");
const fs = require("@theia/core/shared/fs-extra");
const filenamify = require("filenamify");
const file_uri_1 = require("@theia/core/lib/node/file-uri");
const plugin_theia_environment_1 = require("../../common/plugin-theia-environment");
let PluginTheiaFileHandler = class PluginTheiaFileHandler {
    constructor() {
        this.systemPluginsDirUri = new promise_util_1.Deferred();
        (0, temp_dir_util_1.getTempDirPathAsync)('theia-unpacked')
            .then(systemPluginsDirPath => this.systemPluginsDirUri.resolve(file_uri_1.FileUri.create(systemPluginsDirPath)));
    }
    async accept(resolvedPlugin) {
        if (resolvedPlugin.path() !== null && resolvedPlugin.path().endsWith('.theia')) {
            return resolvedPlugin.isFile();
        }
        return false;
    }
    async handle(context) {
        const id = context.pluginEntry().id();
        const pluginDir = await this.getPluginDir(context);
        console.log(`[${id}]: trying to decompress into "${pluginDir}"...`);
        if (context.pluginEntry().type === plugin_protocol_1.PluginType.User && await fs.pathExists(pluginDir)) {
            console.log(`[${id}]: already found`);
            context.pluginEntry().updatePath(pluginDir);
            return;
        }
        await context.unzip(context.pluginEntry().path(), pluginDir);
        console.log(`[${id}]: decompressed`);
        context.pluginEntry().updatePath(pluginDir);
    }
    async getPluginDir(context) {
        const systemPluginsDirUri = await this.systemPluginsDirUri.promise;
        return file_uri_1.FileUri.fsPath(systemPluginsDirUri.resolve(filenamify(context.pluginEntry().id(), { replacement: '_' })));
    }
};
__decorate([
    (0, inversify_1.inject)(plugin_theia_environment_1.PluginTheiaEnvironment),
    __metadata("design:type", plugin_theia_environment_1.PluginTheiaEnvironment)
], PluginTheiaFileHandler.prototype, "environment", void 0);
PluginTheiaFileHandler = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], PluginTheiaFileHandler);
exports.PluginTheiaFileHandler = PluginTheiaFileHandler;
//# sourceMappingURL=plugin-theia-file-handler.js.map