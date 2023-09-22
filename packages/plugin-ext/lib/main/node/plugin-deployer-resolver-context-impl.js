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
exports.PluginDeployerResolverInitImpl = exports.PluginDeployerResolverContextImpl = void 0;
const plugin_deployer_entry_impl_1 = require("./plugin-deployer-entry-impl");
class PluginDeployerResolverContextImpl {
    constructor(resolver, sourceId) {
        this.sourceId = sourceId;
        this.pluginEntries = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.resolverName = resolver.constructor.name;
    }
    addPlugin(pluginId, path) {
        const pluginEntry = new plugin_deployer_entry_impl_1.PluginDeployerEntryImpl(this.sourceId, pluginId, path);
        pluginEntry.setResolvedBy(this.resolverName);
        this.pluginEntries.push(pluginEntry);
    }
    getPlugins() {
        return this.pluginEntries;
    }
    getOriginId() {
        return this.sourceId;
    }
}
exports.PluginDeployerResolverContextImpl = PluginDeployerResolverContextImpl;
class PluginDeployerResolverInitImpl {
}
exports.PluginDeployerResolverInitImpl = PluginDeployerResolverInitImpl;
//# sourceMappingURL=plugin-deployer-resolver-context-impl.js.map