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
exports.KeyValueStorageProxy = exports.GlobalState = exports.Memento = void 0;
const event_1 = require("@theia/core/lib/common/event");
const plugin_api_rpc_1 = require("../common/plugin-api-rpc");
class Memento {
    constructor(pluginId, isPluginGlobalData, storage) {
        this.pluginId = pluginId;
        this.isPluginGlobalData = isPluginGlobalData;
        this.storage = storage;
        this.cache = storage.getPerPluginData(pluginId, isPluginGlobalData);
        if (!this.isPluginGlobalData) {
            this.storage.storageDataChangedEvent((data) => {
                this.cache = data[this.pluginId] ? data[this.pluginId] : {};
            });
        }
    }
    keys() {
        return Object.entries(this.cache).filter(([, value]) => value !== undefined).map(([key]) => key);
    }
    get(key, defaultValue) {
        if (key && this.cache.hasOwnProperty(key)) {
            return this.cache[key];
        }
        else {
            return defaultValue;
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    update(key, value) {
        if (value === undefined) {
            delete this.cache[key];
        }
        else {
            this.cache[key] = value;
        }
        return this.storage.setPerPluginData(this.pluginId, this.cache, this.isPluginGlobalData).then(_ => undefined);
    }
}
exports.Memento = Memento;
class GlobalState extends Memento {
    /** @todo: API is not yet implemented. */
    setKeysForSync(keys) { }
}
exports.GlobalState = GlobalState;
/**
 * Singleton.
 * Is used to proxy storage requests to main side.
 */
class KeyValueStorageProxy {
    constructor(rpc) {
        this.storageDataChangedEmitter = new event_1.Emitter();
        this.storageDataChangedEvent = this.storageDataChangedEmitter.event;
        this.proxy = rpc.getProxy(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.STORAGE_MAIN);
    }
    init(initGlobalData, initWorkspaceData) {
        this.globalDataCache = initGlobalData;
        this.workspaceDataCache = initWorkspaceData;
    }
    getPerPluginData(key, isGlobal) {
        if (isGlobal) {
            const existed = this.globalDataCache[key];
            return existed ? existed : {};
        }
        else {
            const existed = this.workspaceDataCache[key];
            return existed ? existed : {};
        }
    }
    setPerPluginData(key, value, isGlobal) {
        if (isGlobal) {
            this.globalDataCache[key] = value;
        }
        else {
            this.workspaceDataCache[key] = value;
        }
        return this.proxy.$set(key, value, isGlobal);
    }
    $updatePluginsWorkspaceData(workspaceData) {
        this.workspaceDataCache = workspaceData;
        this.storageDataChangedEmitter.fire(workspaceData);
    }
}
exports.KeyValueStorageProxy = KeyValueStorageProxy;
//# sourceMappingURL=plugin-storage.js.map