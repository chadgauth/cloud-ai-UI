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
exports.ProxyPluginDeployerEntry = void 0;
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
const inversify_1 = require("@theia/core/shared/inversify");
const plugin_deployer_entry_impl_1 = require("./plugin-deployer-entry-impl");
/**
 * Proxify call to plugin deployer entry by adding the deployer name as part of the updating path
 */
let ProxyPluginDeployerEntry = class ProxyPluginDeployerEntry {
    constructor(deployer, delegate) {
        this.deployer = deployer;
        this.delegate = delegate;
        this.deployerName = this.deployer.constructor.name;
    }
    id() {
        return this.delegate.id();
    }
    originalPath() {
        return this.delegate.originalPath();
    }
    path() {
        return this.delegate.path();
    }
    getValue(key) {
        return this.delegate.getValue(key);
    }
    storeValue(key, value) {
        this.delegate.storeValue(key, value);
    }
    updatePath(newPath) {
        this.delegate.updatePath(newPath, this.deployerName);
    }
    getChanges() {
        return this.delegate.getChanges();
    }
    isFile() {
        return this.delegate.isFile();
    }
    isDirectory() {
        return this.delegate.isDirectory();
    }
    isResolved() {
        return this.delegate.isResolved();
    }
    isAccepted(...types) {
        return this.delegate.isAccepted(...types);
    }
    accept(...types) {
        this.delegate.accept(...types);
    }
    hasError() {
        return this.delegate.hasError();
    }
    resolvedBy() {
        return this.delegate.resolvedBy();
    }
    get type() {
        return this.delegate.type;
    }
    set type(type) {
        this.delegate.type = type;
    }
    get rootPath() {
        return this.delegate.rootPath;
    }
    set rootPath(rootPath) {
        this.delegate.rootPath = rootPath;
    }
};
ProxyPluginDeployerEntry = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [Object, plugin_deployer_entry_impl_1.PluginDeployerEntryImpl])
], ProxyPluginDeployerEntry);
exports.ProxyPluginDeployerEntry = ProxyPluginDeployerEntry;
//# sourceMappingURL=plugin-deployer-proxy-entry-impl.js.map