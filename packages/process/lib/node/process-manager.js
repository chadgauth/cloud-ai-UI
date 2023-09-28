"use strict";
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
exports.ProcessManager = void 0;
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
const inversify_1 = require("@theia/core/shared/inversify");
const common_1 = require("@theia/core/lib/common");
const logger_1 = require("@theia/core/lib/common/logger");
const numbers_1 = require("@theia/core/lib/common/numbers");
let ProcessManager = class ProcessManager {
    constructor(logger) {
        this.logger = logger;
        this.processes = new Map();
        this.deleteEmitter = new common_1.Emitter();
    }
    /**
     * Registers the given process into this manager. Both on process termination and on error,
     * the process will be automatically removed from the manager.
     *
     * @param process the process to register.
     */
    register(process) {
        const id = this.generateId();
        this.processes.set(id, process);
        process.onError(() => this.unregister(process));
        return id;
    }
    /**
     * @returns a random id for a process that is not assigned to a different process yet.
     */
    generateId() {
        let id = undefined;
        while (id === undefined) {
            const candidate = Math.floor(Math.random() * numbers_1.MAX_SAFE_INTEGER);
            if (!this.processes.has(candidate)) {
                id = candidate;
            }
        }
        return id;
    }
    /**
     * Removes the process from this process manager. Invoking this method, will make
     * sure that the process is terminated before eliminating it from the manager's cache.
     *
     * @param process the process to unregister from this process manager.
     */
    unregister(process) {
        const processLabel = this.getProcessLabel(process);
        this.logger.debug(`Unregistering process. ${processLabel}`);
        if (!process.killed) {
            this.logger.debug(`Ensuring process termination. ${processLabel}`);
            process.kill();
        }
        if (this.processes.delete(process.id)) {
            this.deleteEmitter.fire(process.id);
            this.logger.debug(`The process was successfully unregistered. ${processLabel}`);
        }
        else {
            this.logger.warn(`This process was not registered or was already unregistered. ${processLabel}`);
        }
    }
    get(id) {
        return this.processes.get(id);
    }
    get onDelete() {
        return this.deleteEmitter.event;
    }
    onStop() {
        for (const process of this.processes.values()) {
            try {
                this.unregister(process);
            }
            catch (error) {
                this.logger.error(`Error occurred when unregistering process. ${this.getProcessLabel(process)}`, error);
            }
        }
    }
    getProcessLabel(process) {
        return `[ID: ${process.id}]`;
    }
};
ProcessManager = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(logger_1.ILogger)),
    __param(0, (0, inversify_1.named)('process')),
    __metadata("design:paramtypes", [Object])
], ProcessManager);
exports.ProcessManager = ProcessManager;
//# sourceMappingURL=process-manager.js.map