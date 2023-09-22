"use strict";
// *****************************************************************************
// Copyright (C) 2019 Red Hat, Inc. and others.
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvNodeExtImpl = void 0;
const mac = require("macaddress");
const env_1 = require("../env");
const crypto_1 = require("crypto");
const uuid_1 = require("uuid");
const fs = require("fs");
/**
 * Provides machineId using mac address. It's only possible on node side
 * Extending the common class
 */
class EnvNodeExtImpl extends env_1.EnvExtImpl {
    constructor(rpc) {
        super(rpc);
        mac.one((err, macAddress) => {
            if (err) {
                this.macMachineId = (0, uuid_1.v4)();
            }
            else {
                this.macMachineId = (0, crypto_1.createHash)('sha256').update(macAddress, 'utf8').digest('hex');
            }
        });
        this._isNewAppInstall = this.computeIsNewAppInstall();
    }
    /**
     * override machineID
     */
    get machineId() {
        return this.macMachineId;
    }
    /**
     * Provides application root.
     */
    get appRoot() {
        return __dirname;
    }
    get isNewAppInstall() {
        return this._isNewAppInstall;
    }
    computeIsNewAppInstall() {
        const creation = fs.statSync(__filename).birthtimeMs;
        const current = Date.now();
        const dayMs = 24 * 3600 * 1000;
        return (current - creation) < dayMs;
    }
}
exports.EnvNodeExtImpl = EnvNodeExtImpl;
//# sourceMappingURL=env-node-ext.js.map