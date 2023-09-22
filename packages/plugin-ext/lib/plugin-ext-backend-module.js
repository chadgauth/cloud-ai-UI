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
const inversify_1 = require("@theia/core/shared/inversify");
const plugin_ext_hosted_backend_module_1 = require("./hosted/node/plugin-ext-hosted-backend-module");
const plugin_ext_backend_module_1 = require("./main/node/plugin-ext-backend-module");
exports.default = new inversify_1.ContainerModule((bind, unbind, isBound, rebind) => {
    (0, plugin_ext_backend_module_1.bindMainBackend)(bind, unbind, isBound, rebind);
    (0, plugin_ext_hosted_backend_module_1.bindHostedBackend)(bind);
});
//# sourceMappingURL=plugin-ext-backend-module.js.map