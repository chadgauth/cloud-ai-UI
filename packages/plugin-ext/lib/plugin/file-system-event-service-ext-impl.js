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
/**
 * **IMPORTANT** this code is running in the plugin host process and should be closed as possible to VS Code counterpart:
 * https://github.com/microsoft/vscode/blob/04c36be045a94fee58e5f8992d3e3fd980294a84/src/vs/workbench/api/common/extHostFileSystemEventService.ts
 * One should be able to diff them to see differences.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtHostFileSystemEventService = void 0;
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/tslint/config */
const event_1 = require("@theia/core/lib/common/event");
const glob_1 = require("@theia/core/lib/common/glob");
const types_impl_1 = require("./types-impl");
const typeConverter = require("./type-converters");
const arrays_1 = require("../common/arrays");
const plugin_api_rpc_1 = require("../common/plugin-api-rpc");
class FileSystemWatcher {
    constructor(dispatcher, globPattern, ignoreCreateEvents, ignoreChangeEvents, ignoreDeleteEvents) {
        this._onDidCreate = new event_1.Emitter();
        this._onDidChange = new event_1.Emitter();
        this._onDidDelete = new event_1.Emitter();
        this._config = 0;
        if (ignoreCreateEvents) {
            this._config += 0b001;
        }
        if (ignoreChangeEvents) {
            this._config += 0b010;
        }
        if (ignoreDeleteEvents) {
            this._config += 0b100;
        }
        const parsedPattern = (0, glob_1.parse)(globPattern);
        const subscription = dispatcher(events => {
            if (!ignoreCreateEvents) {
                for (const created of events.created) {
                    const uri = types_impl_1.URI.revive(created);
                    if (parsedPattern(uri.fsPath)) {
                        this._onDidCreate.fire(uri);
                    }
                }
            }
            if (!ignoreChangeEvents) {
                for (const changed of events.changed) {
                    const uri = types_impl_1.URI.revive(changed);
                    if (parsedPattern(uri.fsPath)) {
                        this._onDidChange.fire(uri);
                    }
                }
            }
            if (!ignoreDeleteEvents) {
                for (const deleted of events.deleted) {
                    const uri = types_impl_1.URI.revive(deleted);
                    if (parsedPattern(uri.fsPath)) {
                        this._onDidDelete.fire(uri);
                    }
                }
            }
        });
        this._disposable = types_impl_1.Disposable.from(this._onDidCreate, this._onDidChange, this._onDidDelete, subscription);
    }
    get ignoreCreateEvents() {
        return Boolean(this._config & 0b001);
    }
    get ignoreChangeEvents() {
        return Boolean(this._config & 0b010);
    }
    get ignoreDeleteEvents() {
        return Boolean(this._config & 0b100);
    }
    dispose() {
        this._disposable.dispose();
    }
    get onDidCreate() {
        return this._onDidCreate.event;
    }
    get onDidChange() {
        return this._onDidChange.event;
    }
    get onDidDelete() {
        return this._onDidDelete.event;
    }
}
class ExtHostFileSystemEventService {
    constructor(rpc, _extHostDocumentsAndEditors, _mainThreadTextEditors = rpc.getProxy(plugin_api_rpc_1.PLUGIN_RPC_CONTEXT.TEXT_EDITORS_MAIN)) {
        this._extHostDocumentsAndEditors = _extHostDocumentsAndEditors;
        this._mainThreadTextEditors = _mainThreadTextEditors;
        this._onFileSystemEvent = new event_1.Emitter();
        this._onDidRenameFile = new event_1.Emitter();
        this._onDidCreateFile = new event_1.Emitter();
        this._onDidDeleteFile = new event_1.Emitter();
        this._onWillRenameFile = new event_1.AsyncEmitter();
        this._onWillCreateFile = new event_1.AsyncEmitter();
        this._onWillDeleteFile = new event_1.AsyncEmitter();
        this.onDidRenameFile = this._onDidRenameFile.event;
        this.onDidCreateFile = this._onDidCreateFile.event;
        this.onDidDeleteFile = this._onDidDeleteFile.event;
        //
    }
    // --- file events
    createFileSystemWatcher(globPattern, ignoreCreateEvents, ignoreChangeEvents, ignoreDeleteEvents) {
        return new FileSystemWatcher(this._onFileSystemEvent.event, globPattern, ignoreCreateEvents, ignoreChangeEvents, ignoreDeleteEvents);
    }
    $onFileEvent(events) {
        this._onFileSystemEvent.fire(events);
    }
    // --- file operations
    $onDidRunFileOperation(operation, target, source) {
        switch (operation) {
            case 2 /* MOVE */:
                this._onDidRenameFile.fire(Object.freeze({ files: [{ oldUri: types_impl_1.URI.revive(source), newUri: types_impl_1.URI.revive(target) }] }));
                break;
            case 1 /* DELETE */:
                this._onDidDeleteFile.fire(Object.freeze({ files: [types_impl_1.URI.revive(target)] }));
                break;
            case 0 /* CREATE */:
                this._onDidCreateFile.fire(Object.freeze({ files: [types_impl_1.URI.revive(target)] }));
                break;
            default:
            // ignore, dont send
        }
    }
    getOnWillRenameFileEvent(extension) {
        return this._createWillExecuteEvent(extension, this._onWillRenameFile);
    }
    getOnWillCreateFileEvent(extension) {
        return this._createWillExecuteEvent(extension, this._onWillCreateFile);
    }
    getOnWillDeleteFileEvent(extension) {
        return this._createWillExecuteEvent(extension, this._onWillDeleteFile);
    }
    _createWillExecuteEvent(extension, emitter) {
        return (listener, thisArg, disposables) => {
            const wrappedListener = function wrapped(e) { listener.call(thisArg, e); };
            wrappedListener.extension = extension;
            return emitter.event(wrappedListener, undefined, disposables);
        };
    }
    async $onWillRunFileOperation(operation, target, source, timeout, token) {
        switch (operation) {
            case 2 /* MOVE */:
                await this._fireWillEvent(this._onWillRenameFile, { files: [{ oldUri: types_impl_1.URI.revive(source), newUri: types_impl_1.URI.revive(target) }] }, timeout, token);
                break;
            case 1 /* DELETE */:
                await this._fireWillEvent(this._onWillDeleteFile, { files: [types_impl_1.URI.revive(target)] }, timeout, token);
                break;
            case 0 /* CREATE */:
                await this._fireWillEvent(this._onWillCreateFile, { files: [types_impl_1.URI.revive(target)] }, timeout, token);
                break;
            default:
            // ignore, dont send
        }
    }
    async _fireWillEvent(emitter, data, timeout, token) {
        const edits = [];
        await emitter.fire(data, token, async (thenable, listener) => {
            var _a;
            // ignore all results except for WorkspaceEdits. Those are stored in an array.
            const now = Date.now();
            const result = await Promise.resolve(thenable);
            if (result instanceof types_impl_1.WorkspaceEdit) {
                edits.push(result);
            }
            if (Date.now() - now > timeout) {
                console.warn('SLOW file-participant', (_a = listener.extension) === null || _a === void 0 ? void 0 : _a.model.id);
            }
        });
        if (token.isCancellationRequested) {
            return;
        }
        if (edits.length > 0) {
            // flatten all WorkspaceEdits collected via waitUntil-call
            // and apply them in one go.
            const allEdits = new Array();
            for (const edit of edits) {
                const { edits } = typeConverter.fromWorkspaceEdit(edit, this._extHostDocumentsAndEditors);
                allEdits.push(edits);
            }
            return this._mainThreadTextEditors.$tryApplyWorkspaceEdit({ edits: (0, arrays_1.flatten)(allEdits) });
        }
    }
}
exports.ExtHostFileSystemEventService = ExtHostFileSystemEventService;
//# sourceMappingURL=file-system-event-service-ext-impl.js.map