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
exports.EnvExtImpl = void 0;
const plugin_api_rpc_1 = require("../common/plugin-api-rpc");
const uuid_1 = require("uuid");
class EnvExtImpl {
    constructor(rpc) {
        this.proxy = rpc.getProxy(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.ENV_MAIN);
        this.envSessionId = (0, uuid_1.v4)();
        this.envMachineId = (0, uuid_1.v4)();
        this._remoteName = undefined;
    }
    getEnvVariable(envVarName) {
        return this.proxy.$getEnvVariable(envVarName).then(x => {
            if (x === null) {
                return undefined;
            }
            return x;
        });
    }
    getQueryParameter(queryParamName) {
        return this.queryParameters[queryParamName];
    }
    getQueryParameters() {
        return this.queryParameters;
    }
    setQueryParameters(queryParams) {
        this.queryParameters = queryParams;
    }
    setApplicationName(applicationName) {
        this.applicationName = applicationName;
    }
    setLanguage(lang) {
        this.lang = lang;
    }
    setShell(shell) {
        this.defaultShell = shell;
    }
    setUIKind(uiKind) {
        this.ui = uiKind;
    }
    setAppHost(appHost) {
        this.host = appHost;
    }
    getClientOperatingSystem() {
        return this.proxy.$getClientOperatingSystem();
    }
    get appName() {
        return this.applicationName;
    }
    get appHost() {
        return this.host;
    }
    get remoteName() {
        return this._remoteName;
    }
    get language() {
        return this.lang;
    }
    get machineId() {
        return this.envMachineId;
    }
    get sessionId() {
        return this.envSessionId;
    }
    get uriScheme() {
        return 'theia';
    }
    get shell() {
        return this.defaultShell;
    }
    get uiKind() {
        return this.ui;
    }
}
exports.EnvExtImpl = EnvExtImpl;
//# sourceMappingURL=env.js.map