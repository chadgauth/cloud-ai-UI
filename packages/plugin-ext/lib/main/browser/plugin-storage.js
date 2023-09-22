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
exports.StorageMainImpl = void 0;
const plugin_protocol_1 = require("../../common/plugin-protocol");
const workspace_service_1 = require("@theia/workspace/lib/browser/workspace-service");
class StorageMainImpl {
    constructor(container) {
        this.pluginServer = container.get(plugin_protocol_1.PluginServer);
        this.workspaceService = container.get(workspace_service_1.WorkspaceService);
    }
    $set(key, value, isGlobal) {
        return this.pluginServer.setStorageValue(key, value, this.toKind(isGlobal));
    }
    $get(key, isGlobal) {
        return this.pluginServer.getStorageValue(key, this.toKind(isGlobal));
    }
    $getAll(isGlobal) {
        return this.pluginServer.getAllStorageValues(this.toKind(isGlobal));
    }
    toKind(isGlobal) {
        var _a;
        if (isGlobal) {
            return undefined;
        }
        return {
            workspace: (_a = this.workspaceService.workspace) === null || _a === void 0 ? void 0 : _a.resource.toString(),
            roots: this.workspaceService.tryGetRoots().map(root => root.resource.toString())
        };
    }
}
exports.StorageMainImpl = StorageMainImpl;
//# sourceMappingURL=plugin-storage.js.map