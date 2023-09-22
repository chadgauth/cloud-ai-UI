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
exports.SampleBackendAppInfo = void 0;
const common_1 = require("@theia/core/lib/common");
const promise_util_1 = require("@theia/core/lib/common/promise-util");
const node_1 = require("@theia/core/lib/node");
const inversify_1 = require("@theia/core/shared/inversify");
let SampleBackendAppInfo = class SampleBackendAppInfo {
    constructor() {
        this.addressDeferred = new promise_util_1.Deferred();
    }
    onStart(server) {
        const address = server.address();
        // eslint-disable-next-line no-null/no-null
        if (typeof address === 'object' && address !== null) {
            this.addressDeferred.resolve(address);
        }
        else {
            this.addressDeferred.resolve({
                address: '127.0.0.1',
                port: 3000,
                family: '4'
            });
        }
    }
    async getSelfOrigin() {
        const { ssl } = this.backendCli;
        const protocol = ssl ? 'https' : 'http';
        const { address, port } = await this.addressDeferred.promise;
        const hostname = common_1.environment.electron.is() ? 'localhost' : address;
        return `${protocol}://${hostname}:${port}`;
    }
};
__decorate([
    (0, inversify_1.inject)(node_1.BackendApplicationCliContribution),
    __metadata("design:type", node_1.BackendApplicationCliContribution)
], SampleBackendAppInfo.prototype, "backendCli", void 0);
SampleBackendAppInfo = __decorate([
    (0, inversify_1.injectable)()
], SampleBackendAppInfo);
exports.SampleBackendAppInfo = SampleBackendAppInfo;
//# sourceMappingURL=sample-backend-app-info.js.map