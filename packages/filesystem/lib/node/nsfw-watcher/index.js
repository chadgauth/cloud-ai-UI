"use strict";
// *****************************************************************************
// Copyright (C) 2017 TypeFox and others.
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
const yargs = require("@theia/core/shared/yargs");
const core_1 = require("@theia/core");
const nsfw_filesystem_service_1 = require("./nsfw-filesystem-service");
/* eslint-disable @typescript-eslint/no-explicit-any */
const options = yargs
    .option('verbose', {
    default: false,
    alias: 'v',
    type: 'boolean'
})
    .option('nsfwOptions', {
    alias: 'o',
    type: 'string',
    coerce: JSON.parse
})
    .argv;
exports.default = (connection => {
    const server = new nsfw_filesystem_service_1.NsfwFileSystemWatcherService(options);
    const factory = new core_1.RpcProxyFactory(server);
    server.setClient(factory.createProxy());
    factory.listen(connection);
});
//# sourceMappingURL=index.js.map