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
const inversify_1 = require("@theia/core/shared/inversify");
const common_1 = require("@theia/core/lib/common");
const file_search_service_impl_1 = require("./file-search-service-impl");
const file_search_service_1 = require("../common/file-search-service");
exports.default = new inversify_1.ContainerModule(bind => {
    bind(file_search_service_1.FileSearchService).to(file_search_service_impl_1.FileSearchServiceImpl).inSingletonScope();
    bind(common_1.ConnectionHandler).toDynamicValue(ctx => new common_1.RpcConnectionHandler(file_search_service_1.fileSearchServicePath, () => ctx.container.get(file_search_service_1.FileSearchService))).inSingletonScope();
});
//# sourceMappingURL=file-search-backend-module.js.map