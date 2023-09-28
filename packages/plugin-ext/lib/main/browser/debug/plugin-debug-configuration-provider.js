"use strict";
// *****************************************************************************
// Copyright (C) 2022 Ericsson and others.
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
exports.PluginDebugConfigurationProvider = void 0;
class PluginDebugConfigurationProvider {
    constructor(description, debugExt) {
        this.debugExt = debugExt;
        this.handle = description.handle;
        this.type = description.type;
        this.triggerKind = description.trigger;
        if (description.provideDebugConfiguration) {
            this.provideDebugConfigurations = async (folder) => this.debugExt.$provideDebugConfigurationsByHandle(this.handle, folder);
        }
        if (description.resolveDebugConfigurations) {
            this.resolveDebugConfiguration =
                async (folder, debugConfiguration) => this.debugExt.$resolveDebugConfigurationByHandle(this.handle, folder, debugConfiguration);
        }
        if (description.resolveDebugConfigurationWithSubstitutedVariables) {
            this.resolveDebugConfigurationWithSubstitutedVariables =
                async (folder, debugConfiguration) => this.debugExt.$resolveDebugConfigurationWithSubstitutedVariablesByHandle(this.handle, folder, debugConfiguration);
        }
    }
}
exports.PluginDebugConfigurationProvider = PluginDebugConfigurationProvider;
//# sourceMappingURL=plugin-debug-configuration-provider.js.map