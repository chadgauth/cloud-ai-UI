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
exports.PluginDeployerEntryImpl = void 0;
const plugin_protocol_1 = require("../../common/plugin-protocol");
const fs_1 = require("fs");
class PluginDeployerEntryImpl {
    constructor(originId, pluginId, initPath) {
        this.originId = originId;
        this.pluginId = pluginId;
        this._type = plugin_protocol_1.PluginType.System;
        this.map = new Map();
        this.changes = [];
        this.acceptedTypes = [];
        if (initPath) {
            this.currentPath = initPath;
            this.initPath = initPath;
            this.resolved = true;
        }
        else {
            this.resolved = false;
        }
    }
    id() {
        return this.pluginId;
    }
    originalPath() {
        return this.initPath;
    }
    path() {
        return this.currentPath;
    }
    getValue(key) {
        return this.map.get(key);
    }
    storeValue(key, value) {
        this.map.set(key, value);
    }
    updatePath(newPath, transformerName) {
        if (transformerName) {
            this.changes.push(transformerName);
        }
        this.currentPath = newPath;
    }
    getChanges() {
        return this.changes;
    }
    async isFile() {
        try {
            const stat = await fs_1.promises.stat(this.currentPath);
            return stat.isFile();
        }
        catch {
            return false;
        }
    }
    async isDirectory() {
        try {
            const stat = await fs_1.promises.stat(this.currentPath);
            return stat.isDirectory();
        }
        catch {
            return false;
        }
    }
    hasError() {
        throw new Error('Method not implemented.');
    }
    isResolved() {
        return this.resolved;
    }
    accept(...types) {
        this.acceptedTypes = types;
    }
    isAccepted(...types) {
        return types.some(type => this.acceptedTypes.indexOf(type) >= 0);
    }
    setResolvedBy(name) {
        this.resolvedByName = name;
    }
    resolvedBy() {
        return this.resolvedByName;
    }
    get type() {
        return this._type;
    }
    set type(type) {
        this._type = type;
    }
    get rootPath() {
        return !!this._rootPath ? this._rootPath : this.path();
    }
    set rootPath(rootPath) {
        this._rootPath = rootPath;
    }
}
exports.PluginDeployerEntryImpl = PluginDeployerEntryImpl;
//# sourceMappingURL=plugin-deployer-entry-impl.js.map