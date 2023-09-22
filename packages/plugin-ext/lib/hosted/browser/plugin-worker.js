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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginWorker = void 0;
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
const channel_1 = require("@theia/core/lib/common/message-rpc/channel");
const uint8_array_message_buffer_1 = require("@theia/core/lib/common/message-rpc/uint8-array-message-buffer");
const inversify_1 = require("@theia/core/shared/inversify");
const rpc_protocol_1 = require("../../common/rpc-protocol");
let PluginWorker = class PluginWorker {
    constructor() {
        this.worker = new Worker(new URL('./worker/worker-main', 
        // @ts-expect-error (TS1343)
        // We compile to CommonJS but `import.meta` is still available in the browser
        import.meta.url));
        const channel = new channel_1.BasicChannel(() => {
            const writer = new uint8_array_message_buffer_1.Uint8ArrayWriteBuffer();
            writer.onCommit(buffer => {
                this.worker.postMessage(buffer);
            });
            return writer;
        });
        this.rpc = new rpc_protocol_1.RPCProtocolImpl(channel);
        // eslint-disable-next-line arrow-body-style
        this.worker.onmessage = buffer => channel.onMessageEmitter.fire(() => {
            return new uint8_array_message_buffer_1.Uint8ArrayReadBuffer(buffer.data);
        });
        this.worker.onerror = e => channel.onErrorEmitter.fire(e);
    }
};
PluginWorker = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], PluginWorker);
exports.PluginWorker = PluginWorker;
//# sourceMappingURL=plugin-worker.js.map