"use strict";
// *****************************************************************************
// Copyright (C) 2020 TypeFox and others.
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
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// based on https://github.com/microsoft/vscode/blob/04c36be045a94fee58e5f8992d3e3fd980294a84/src/vs/workbench/api/browser/mainThreadFileSystemEventService.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainFileSystemEventService = void 0;
const plugin_api_rpc_1 = require("../../common/plugin-api-rpc");
const disposable_1 = require("@theia/core/lib/common/disposable");
const file_service_1 = require("@theia/filesystem/lib/browser/file-service");
class MainFileSystemEventService {
    constructor(rpc, container) {
        this.toDispose = new disposable_1.DisposableCollection();
        const proxy = rpc.getProxy(plugin_api_rpc_1.MAIN_RPC_CONTEXT.ExtHostFileSystemEventService);
        const fileService = container.get(file_service_1.FileService);
        this.toDispose.push(fileService.onDidFilesChange(event => {
            // file system events - (changes the editor and others make)
            const events = {
                created: [],
                changed: [],
                deleted: []
            };
            for (const change of event.changes) {
                switch (change.type) {
                    case 1 /* ADDED */:
                        events.created.push(change.resource['codeUri']);
                        break;
                    case 0 /* UPDATED */:
                        events.changed.push(change.resource['codeUri']);
                        break;
                    case 2 /* DELETED */:
                        events.deleted.push(change.resource['codeUri']);
                        break;
                }
            }
            proxy.$onFileEvent(events);
        }));
        // BEFORE file operation
        fileService.addFileOperationParticipant({
            participate: (target, source, operation, timeout, token) => proxy.$onWillRunFileOperation(operation, target['codeUri'], source === null || source === void 0 ? void 0 : source['codeUri'], timeout, token)
        });
        // AFTER file operation
        this.toDispose.push(fileService.onDidRunUserOperation(e => { var _a; return proxy.$onDidRunFileOperation(e.operation, e.target['codeUri'], (_a = e.source) === null || _a === void 0 ? void 0 : _a['codeUri']); }));
    }
    dispose() {
        this.toDispose.dispose();
    }
}
exports.MainFileSystemEventService = MainFileSystemEventService;
//# sourceMappingURL=main-file-system-event-service.js.map