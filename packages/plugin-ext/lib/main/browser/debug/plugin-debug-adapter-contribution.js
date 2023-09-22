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
exports.PluginDebugAdapterContribution = void 0;
/**
 * Plugin [DebugAdapterContribution](#DebugAdapterContribution).
 */
class PluginDebugAdapterContribution {
    constructor(description, debugExt, pluginService) {
        this.description = description;
        this.debugExt = debugExt;
        this.pluginService = pluginService;
    }
    get type() {
        return this.description.type;
    }
    get label() {
        return this.description.label;
    }
    async createDebugSession(config, workspaceFolder) {
        await this.pluginService.activateByDebug('onDebugAdapterProtocolTracker', config.type);
        return this.debugExt.$createDebugSession(config, workspaceFolder);
    }
    async terminateDebugSession(sessionId) {
        this.debugExt.$terminateDebugSession(sessionId);
    }
}
exports.PluginDebugAdapterContribution = PluginDebugAdapterContribution;
//# sourceMappingURL=plugin-debug-adapter-contribution.js.map