"use strict";
/********************************************************************************
 * Copyright (C) 2019 Ericsson and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0
 ********************************************************************************/
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
exports.AbstractMemoryProvider = exports.DefaultMemoryProvider = exports.base64ToBytes = exports.MemoryProvider = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const Long = require("long");
exports.MemoryProvider = Symbol('MemoryProvider');
/**
 * Convert a base64-encoded string of bytes to the Uint8Array equivalent.
 */
function base64ToBytes(base64) {
    return Buffer.from(base64, 'base64');
}
exports.base64ToBytes = base64ToBytes;
let DefaultMemoryProvider = class DefaultMemoryProvider {
    // This provider should only be used a fallback - it shouldn't volunteer to handle any session.
    canHandle() {
        return false;
    }
    async readMemory(session, readMemoryArguments) {
        var _a;
        console.log('Requesting memory with the following arguments:', readMemoryArguments);
        const result = await session.sendRequest('readMemory', readMemoryArguments);
        if ((_a = result.body) === null || _a === void 0 ? void 0 : _a.data) {
            const { body: { data, address } } = result;
            const bytes = base64ToBytes(data);
            const longAddress = result.body.address.startsWith('0x') ? Long.fromString(address, true, 16) : Long.fromString(address, true, 10);
            return { bytes, address: longAddress };
        }
        throw new Error('Received no data from debug adapter.');
    }
    async writeMemory(session, writeMemoryArguments) {
        return session.sendRequest('writeMemory', writeMemoryArguments);
    }
    async getLocals(session) {
        return [];
    }
    supportsVariableReferenceSyntax(session, variable) {
        return false;
    }
    formatVariableReference(session, variable) {
        return '';
    }
};
DefaultMemoryProvider = __decorate([
    (0, inversify_1.injectable)()
], DefaultMemoryProvider);
exports.DefaultMemoryProvider = DefaultMemoryProvider;
let AbstractMemoryProvider = class AbstractMemoryProvider {
    readMemory(session, readMemoryArguments) {
        return this.defaultProvider.readMemory(session, readMemoryArguments);
    }
    writeMemory(session, writeMemoryArguments) {
        return this.defaultProvider.writeMemory(session, writeMemoryArguments);
    }
    getLocals(session) {
        return this.defaultProvider.getLocals(session);
    }
    supportsVariableReferenceSyntax(session, variable) {
        return this.defaultProvider.supportsVariableReferenceSyntax(session, variable);
    }
    formatVariableReference(session, variable) {
        return this.defaultProvider.formatVariableReference(session, variable);
    }
};
__decorate([
    (0, inversify_1.inject)(DefaultMemoryProvider),
    __metadata("design:type", DefaultMemoryProvider)
], AbstractMemoryProvider.prototype, "defaultProvider", void 0);
AbstractMemoryProvider = __decorate([
    (0, inversify_1.injectable)()
], AbstractMemoryProvider);
exports.AbstractMemoryProvider = AbstractMemoryProvider;
//# sourceMappingURL=memory-provider.js.map