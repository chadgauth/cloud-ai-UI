"use strict";
// *****************************************************************************
// Copyright (C) 2020 Ericsson and others.
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
exports.bindVSXCommand = exports.VSXCommandContribution = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const vsx_environment_1 = require("@theia/vsx-registry/lib/common/vsx-environment");
const common_1 = require("@theia/core/lib/common");
let VSXCommandContribution = class VSXCommandContribution {
    constructor() {
        this.command = {
            id: 'vsx.echo-api-version',
            label: 'VS Code API Version'
        };
    }
    registerCommands(commands) {
        commands.registerCommand(this.command, {
            execute: async () => {
                const version = await this.environment.getVscodeApiVersion();
                this.messageService.info(`Supported VS Code API Version: ${version}`);
            }
        });
    }
};
__decorate([
    (0, inversify_1.inject)(common_1.MessageService),
    __metadata("design:type", common_1.MessageService)
], VSXCommandContribution.prototype, "messageService", void 0);
__decorate([
    (0, inversify_1.inject)(vsx_environment_1.VSXEnvironment),
    __metadata("design:type", Object)
], VSXCommandContribution.prototype, "environment", void 0);
VSXCommandContribution = __decorate([
    (0, inversify_1.injectable)()
], VSXCommandContribution);
exports.VSXCommandContribution = VSXCommandContribution;
const bindVSXCommand = (bind) => {
    bind(common_1.CommandContribution).to(VSXCommandContribution).inSingletonScope();
};
exports.bindVSXCommand = bindVSXCommand;
//# sourceMappingURL=sample-vsx-command-contribution.js.map