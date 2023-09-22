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
exports.PluginDeployerContribution = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const plugin_protocol_1 = require("../../common/plugin-protocol");
const core_1 = require("@theia/core");
let PluginDeployerContribution = class PluginDeployerContribution {
    initialize() {
        this.pluginDeployer.start();
    }
};
__decorate([
    (0, inversify_1.inject)(core_1.ILogger),
    __metadata("design:type", Object)
], PluginDeployerContribution.prototype, "logger", void 0);
__decorate([
    (0, inversify_1.inject)(plugin_protocol_1.PluginDeployer),
    __metadata("design:type", Object)
], PluginDeployerContribution.prototype, "pluginDeployer", void 0);
PluginDeployerContribution = __decorate([
    (0, inversify_1.injectable)()
], PluginDeployerContribution);
exports.PluginDeployerContribution = PluginDeployerContribution;
//# sourceMappingURL=plugin-deployer-contribution.js.map