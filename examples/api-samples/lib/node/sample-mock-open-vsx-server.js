"use strict";
// *****************************************************************************
// Copyright (C) 2023 Ericsson and others.
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
exports.SampleMockOpenVsxServer = void 0;
const express = require("@theia/core/shared/express");
const fs = require("fs");
const inversify_1 = require("@theia/core/shared/inversify");
const ovsx_client_1 = require("@theia/ovsx-client");
const path = require("path");
const sample_app_info_1 = require("../common/vsx/sample-app-info");
/**
 * This class implements a very crude OpenVSX mock server for testing.
 *
 * See {@link configure}'s implementation for supported REST APIs.
 */
let SampleMockOpenVsxServer = class SampleMockOpenVsxServer {
    get mockServerPath() {
        return '/mock-open-vsx';
    }
    get pluginsDbPath() {
        return '../../sample-plugins';
    }
    async configure(app) {
        const selfOrigin = await this.appInfo.getSelfOrigin();
        const baseUrl = `${selfOrigin}${this.mockServerPath}`;
        const pluginsDb = await this.findMockPlugins(this.pluginsDbPath, baseUrl);
        const staticFileHandlers = new Map(Array.from(pluginsDb.entries(), ([key, value]) => [key, express.static(value.path)]));
        const mockClient = new ovsx_client_1.OVSXMockClient(Array.from(pluginsDb.values(), value => value.data));
        app.use(this.mockServerPath + '/api', express.Router()
            .get('/-/query', async (req, res) => {
            res.json(await mockClient.query(this.sanitizeQuery(req.query)));
        })
            .get('/-/search', async (req, res) => {
            res.json(await mockClient.search(this.sanitizeQuery(req.query)));
        })
            .get('/:namespace', async (req, res) => {
            const extensions = mockClient.extensions
                .filter(ext => req.params.namespace === ext.namespace)
                .map(ext => `${ext.namespaceUrl}/${ext.name}`);
            if (extensions.length === 0) {
                res.status(404).json({ error: `Namespace not found: ${req.params.namespace}` });
            }
            else {
                res.json({
                    name: req.params.namespace,
                    extensions
                });
            }
        })
            .get('/:namespace/:name', async (req, res) => {
            res.json(mockClient.extensions.find(ext => req.params.namespace === ext.namespace && req.params.name === ext.name));
        })
            .get('/:namespace/:name/reviews', async (req, res) => {
            res.json([]);
        })
            // implicitly GET/HEAD because of the express.static handlers
            .use('/:namespace/:name/:version/file', async (req, res, next) => {
            const versionedId = this.getVersionedId(req.params.namespace, req.params.name, req.params.version);
            const staticFileHandler = staticFileHandlers.get(versionedId);
            if (!staticFileHandler) {
                return next();
            }
            staticFileHandler(req, res, next);
        }));
    }
    getVersionedId(namespace, name, version) {
        return `${namespace}.${name}@${version}`;
    }
    sanitizeQuery(query) {
        return typeof query === 'object'
            ? Object.fromEntries(Object.entries(query).filter(([key, value]) => typeof value === 'string'))
            : {};
    }
    /**
     * This method expects the following folder hierarchy: `pluginsDbPath/namespace/pluginName/pluginFiles...`
     * @param pluginsDbPath where to look for plugins on the disk.
     * @param baseUrl used when generating the URLs for {@link VSXExtensionRaw} properties.
     */
    async findMockPlugins(pluginsDbPath, baseUrl) {
        const url = new ovsx_client_1.OVSXMockClient.UrlBuilder(baseUrl);
        const result = new Map();
        if (!await this.isDirectory(pluginsDbPath)) {
            console.error(`ERROR: ${pluginsDbPath} is not a directory!`);
            return result;
        }
        const namespaces = await fs.promises.readdir(pluginsDbPath);
        await Promise.all(namespaces.map(async (namespace) => {
            const namespacePath = path.join(pluginsDbPath, namespace);
            if (!await this.isDirectory(namespacePath)) {
                return;
            }
            const names = await fs.promises.readdir(namespacePath);
            await Promise.all(names.map(async (pluginName) => {
                const pluginPath = path.join(namespacePath, pluginName);
                if (!await this.isDirectory(pluginPath)) {
                    return;
                }
                const packageJsonPath = path.join(pluginPath, 'package.json');
                const { name, version } = JSON.parse(await fs.promises.readFile(packageJsonPath, 'utf8'));
                const versionedId = this.getVersionedId(namespace, name, version);
                result.set(versionedId, {
                    path: pluginPath,
                    data: {
                        allVersions: {},
                        downloadCount: 0,
                        files: {
                            // the default generated name from vsce is NAME-VERSION.vsix
                            download: url.extensionFileUrl(namespace, name, version, `/${name}-${version}.vsix`),
                            icon: url.extensionFileUrl(namespace, name, version, '/icon128.png'),
                            readme: url.extensionFileUrl(namespace, name, version, '/README.md')
                        },
                        name,
                        namespace,
                        namespaceAccess: 'public',
                        namespaceUrl: url.namespaceUrl(namespace),
                        publishedBy: {
                            loginName: 'mock-open-vsx'
                        },
                        reviewCount: 0,
                        reviewsUrl: url.extensionReviewsUrl(namespace, name),
                        timestamp: new Date().toISOString(),
                        version,
                    }
                });
            }));
        }));
        return result;
    }
    async isDirectory(fsPath) {
        return (await fs.promises.stat(fsPath)).isDirectory();
    }
};
__decorate([
    (0, inversify_1.inject)(sample_app_info_1.SampleAppInfo),
    __metadata("design:type", Object)
], SampleMockOpenVsxServer.prototype, "appInfo", void 0);
SampleMockOpenVsxServer = __decorate([
    (0, inversify_1.injectable)()
], SampleMockOpenVsxServer);
exports.SampleMockOpenVsxServer = SampleMockOpenVsxServer;
//# sourceMappingURL=sample-mock-open-vsx-server.js.map