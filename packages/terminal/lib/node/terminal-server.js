"use strict";
// *****************************************************************************
// Copyright (C) 2017 Ericsson and others.
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerminalServer = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const logger_1 = require("@theia/core/lib/common/logger");
const base_terminal_server_1 = require("./base-terminal-server");
const node_1 = require("@theia/process/lib/node");
let TerminalServer = class TerminalServer extends base_terminal_server_1.BaseTerminalServer {
    constructor(processManager, logger) {
        super(processManager, logger);
    }
    create(options) {
        return new Promise((resolve, reject) => {
            const term = this.terminalFactory(options);
            term.onStart(_ => {
                this.postCreate(term);
                resolve(term.id);
            });
            term.onError(error => {
                this.logger.error('Error while creating terminal', error);
                resolve(-1);
            });
        });
    }
};
__decorate([
    (0, inversify_1.inject)(node_1.TerminalProcessFactory),
    __metadata("design:type", Function)
], TerminalServer.prototype, "terminalFactory", void 0);
TerminalServer = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(node_1.ProcessManager)),
    __param(1, (0, inversify_1.inject)(logger_1.ILogger)),
    __param(1, (0, inversify_1.named)('terminal')),
    __metadata("design:paramtypes", [node_1.ProcessManager, Object])
], TerminalServer);
exports.TerminalServer = TerminalServer;
//# sourceMappingURL=terminal-server.js.map