"use strict";
// *****************************************************************************
// Copyright (C) 2020 Red Hat, Inc. and others.
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
exports.LabelServiceExtImpl = void 0;
const disposable_1 = require("@theia/core/lib/common/disposable");
const plugin_api_rpc_1 = require("../common/plugin-api-rpc");
class LabelServiceExtImpl {
    constructor(rpc) {
        this.rpc = rpc;
        this.handle = 0;
        this.proxy = rpc.getProxy(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.LABEL_SERVICE_MAIN);
    }
    $registerResourceLabelFormatter(formatter) {
        const handle = this.handle++;
        this.proxy.$registerResourceLabelFormatter(handle, formatter);
        return disposable_1.Disposable.create(() => {
            this.proxy.$unregisterResourceLabelFormatter(handle);
        });
    }
}
exports.LabelServiceExtImpl = LabelServiceExtImpl;
//# sourceMappingURL=label-service.js.map