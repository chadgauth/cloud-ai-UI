"use strict";
// *****************************************************************************
// Copyright (C) 2017 TypeFox and others.
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
exports.GitLocatorClient = void 0;
const paths = require("path");
const inversify_1 = require("@theia/core/shared/inversify");
const core_1 = require("@theia/core");
const node_1 = require("@theia/core/lib/node");
let GitLocatorClient = class GitLocatorClient {
    constructor() {
        this.toDispose = new core_1.DisposableCollection();
    }
    dispose() {
        this.toDispose.dispose();
    }
    locate(path, options) {
        return new Promise((resolve, reject) => {
            const toStop = this.ipcConnectionProvider.listen({
                serverName: 'git-locator',
                entryPoint: paths.join(__dirname, 'git-locator-host'),
            }, async (connection) => {
                const proxyFactory = new core_1.RpcProxyFactory();
                const remote = proxyFactory.createProxy();
                proxyFactory.listen(connection);
                try {
                    resolve(await remote.locate(path, options));
                }
                catch (e) {
                    reject(e);
                }
                finally {
                    toStop.dispose();
                }
            });
            this.toDispose.push(toStop);
        });
    }
};
__decorate([
    (0, inversify_1.inject)(node_1.IPCConnectionProvider),
    __metadata("design:type", node_1.IPCConnectionProvider)
], GitLocatorClient.prototype, "ipcConnectionProvider", void 0);
GitLocatorClient = __decorate([
    (0, inversify_1.injectable)()
], GitLocatorClient);
exports.GitLocatorClient = GitLocatorClient;
//# sourceMappingURL=git-locator-client.js.map