"use strict";
// *****************************************************************************
// Copyright (C) 2023 TypeFox and others.
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
exports.NotebooksMainImpl = void 0;
const core_1 = require("@theia/core");
const common_1 = require("../../../common");
const notebook_dto_1 = require("./notebook-dto");
class NotebooksMainImpl {
    constructor(rpc, notebookService, plugins) {
        this.notebookService = notebookService;
        this.disposables = new core_1.DisposableCollection();
        this.notebookSerializer = new Map();
        this.notebookCellStatusBarRegistrations = new Map();
        this.proxy = rpc.getProxy(common_1.MAIN_RPC_CONTEXT.NOTEBOOKS_EXT);
        notebookService.onNotebookSerializer(async (event) => plugins.activateByEvent(event));
        notebookService.markReady();
    }
    dispose() {
        this.disposables.dispose();
        for (const disposable of this.notebookSerializer.values()) {
            disposable.dispose();
        }
    }
    $registerNotebookSerializer(handle, extension, viewType, options) {
        const disposables = new core_1.DisposableCollection();
        disposables.push(this.notebookService.registerNotebookSerializer(viewType, extension, {
            options,
            dataToNotebook: async (data) => {
                const dto = await this.proxy.$dataToNotebook(handle, data, core_1.CancellationToken.None);
                return notebook_dto_1.NotebookDto.fromNotebookDataDto(dto);
            },
            notebookToData: (data) => this.proxy.$notebookToData(handle, notebook_dto_1.NotebookDto.toNotebookDataDto(data), core_1.CancellationToken.None)
        }));
        this.notebookSerializer.set(handle, disposables);
    }
    $unregisterNotebookSerializer(handle) {
        var _a;
        (_a = this.notebookSerializer.get(handle)) === null || _a === void 0 ? void 0 : _a.dispose();
        this.notebookSerializer.delete(handle);
    }
    $emitCellStatusBarEvent(eventHandle) {
        const emitter = this.notebookCellStatusBarRegistrations.get(eventHandle);
        if (emitter instanceof core_1.Emitter) {
            emitter.fire(undefined);
        }
    }
    async $registerNotebookCellStatusBarItemProvider(handle, eventHandle, viewType) {
        const that = this;
        const provider = {
            async provideCellStatusBarItems(uri, index, token) {
                var _a;
                const result = await that.proxy.$provideNotebookCellStatusBarItems(handle, uri, index, token);
                return {
                    items: (_a = result === null || result === void 0 ? void 0 : result.items) !== null && _a !== void 0 ? _a : [],
                    dispose() {
                        if (result) {
                            that.proxy.$releaseNotebookCellStatusBarItems(result.cacheId);
                        }
                    }
                };
            },
            viewType
        };
        if (typeof eventHandle === 'number') {
            const emitter = new core_1.Emitter();
            this.notebookCellStatusBarRegistrations.set(eventHandle, emitter);
            provider.onDidChangeStatusBarItems = emitter.event;
        }
        // const disposable = this._cellStatusBarService.registerCellStatusBarItemProvider(provider);
        // this.notebookCellStatusBarRegistrations.set(handle, disposable);
    }
    async $unregisterNotebookCellStatusBarItemProvider(handle, eventHandle) {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const unregisterThing = (statusBarHandle) => {
            var _a;
            const entry = this.notebookCellStatusBarRegistrations.get(statusBarHandle);
            if (entry) {
                (_a = this.notebookCellStatusBarRegistrations.get(statusBarHandle)) === null || _a === void 0 ? void 0 : _a.dispose();
                this.notebookCellStatusBarRegistrations.delete(statusBarHandle);
            }
        };
        unregisterThing(handle);
        if (typeof eventHandle === 'number') {
            unregisterThing(eventHandle);
        }
    }
}
exports.NotebooksMainImpl = NotebooksMainImpl;
//# sourceMappingURL=notebooks-main.js.map