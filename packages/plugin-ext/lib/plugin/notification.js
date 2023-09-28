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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationExtImpl = void 0;
const plugin_api_rpc_1 = require("../common/plugin-api-rpc");
const cancellation_1 = require("@theia/core/lib/common/cancellation");
const types_impl_1 = require("./types-impl");
const promise_util_1 = require("@theia/core/lib/common/promise-util");
class NotificationExtImpl {
    constructor(rpc) {
        this.mapProgressIdToCancellationSource = new Map();
        this.proxy = rpc.getProxy(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.NOTIFICATION_MAIN);
    }
    async withProgress(options, task) {
        const source = new cancellation_1.CancellationTokenSource();
        const id = new promise_util_1.Deferred();
        const progress = task({ report: async (item) => this.proxy.$updateProgress(await id.promise, item) }, source.token);
        const title = options.title ? options.title : '';
        const location = this.mapLocation(options.location);
        const cancellable = options.cancellable;
        id.resolve(await this.proxy.$startProgress({ title, location, cancellable }));
        if (cancellable) {
            const progressId = await id.promise;
            this.mapProgressIdToCancellationSource.set(progressId, source);
        }
        const stop = async () => this.proxy.$stopProgress(await id.promise);
        const promise = Promise.all([
            progress,
            new Promise(resolve => setTimeout(resolve, 250)) // try to show even if it's done immediately
        ]);
        promise.then(stop, stop);
        return progress;
    }
    $acceptProgressCanceled(id) {
        const source = this.mapProgressIdToCancellationSource.get(id);
        if (source) {
            source.cancel();
            this.mapProgressIdToCancellationSource.delete(id);
        }
    }
    mapLocation(location) {
        if (typeof location === 'object') {
            return location.viewId;
        }
        switch (location) {
            case types_impl_1.ProgressLocation.Notification: return 'notification';
            case types_impl_1.ProgressLocation.SourceControl: return 'scm';
            case types_impl_1.ProgressLocation.Window: return 'window';
            default: return undefined;
        }
    }
}
exports.NotificationExtImpl = NotificationExtImpl;
//# sourceMappingURL=notification.js.map