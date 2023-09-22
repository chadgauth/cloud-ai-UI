"use strict";
// *****************************************************************************
// Copyright (C) 2020 TypeFox and others.
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SampleUpdaterImpl = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const sample_updater_1 = require("../../common/updater/sample-updater");
let SampleUpdaterImpl = class SampleUpdaterImpl {
    constructor() {
        this.clients = [];
        this.available = false;
    }
    async checkForUpdates() {
        if (this.inProgressTimer) {
            return { status: sample_updater_1.UpdateStatus.InProgress };
        }
        return { status: this.available ? sample_updater_1.UpdateStatus.Available : sample_updater_1.UpdateStatus.NotAvailable };
    }
    onRestartToUpdateRequested() {
        console.info("'Update to Restart' was requested by the frontend.");
        // Here comes your install and restart implementation. For example: `autoUpdater.quitAndInstall();`
    }
    async setUpdateAvailable(available) {
        if (this.inProgressTimer) {
            clearTimeout(this.inProgressTimer);
        }
        if (!available) {
            this.inProgressTimer = undefined;
            this.available = false;
        }
        else {
            this.inProgressTimer = setTimeout(() => {
                this.inProgressTimer = undefined;
                this.available = true;
                for (const client of this.clients) {
                    client.notifyReadyToInstall();
                }
            }, 5000);
        }
    }
    onStart(application) {
        // Called when the contribution is starting. You can use both async and sync code from here.
    }
    onStop(application) {
        // Invoked when the contribution is stopping. You can clean up things here. You are not allowed call async code from here.
    }
    setClient(client) {
        if (client) {
            this.clients.push(client);
            console.info('Registered a new sample updater client.');
        }
        else {
            console.warn("Couldn't register undefined client.");
        }
    }
    disconnectClient(client) {
        const index = this.clients.indexOf(client);
        if (index !== -1) {
            this.clients.splice(index, 1);
            console.info('Disposed a sample updater client.');
        }
        else {
            console.warn("Couldn't dispose client; it was not registered.");
        }
    }
    dispose() {
        console.info('>>> Disposing sample updater service...');
        this.clients.forEach(this.disconnectClient.bind(this));
        console.info('>>> Disposed sample updater service.');
    }
};
SampleUpdaterImpl = __decorate([
    (0, inversify_1.injectable)()
], SampleUpdaterImpl);
exports.SampleUpdaterImpl = SampleUpdaterImpl;
//# sourceMappingURL=sample-updater-impl.js.map