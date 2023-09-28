"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentsMainImpl = exports.ModelReferenceCollection = void 0;
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
const plugin_api_rpc_1 = require("../../common/plugin-api-rpc");
const core_1 = require("@theia/core");
const uri_1 = require("@theia/core/lib/common/uri");
const vscode_uri_1 = require("@theia/core/shared/vscode-uri");
const browser_1 = require("@theia/core/lib/browser");
const disposable_util_1 = require("../../common/disposable-util");
const monaco = require("@theia/monaco-editor-core");
const types_impl_1 = require("../../plugin/types-impl");
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
class ModelReferenceCollection {
    constructor(maxAge = 1000 * 60 * 3, maxLength = 1024 * 1024 * 80) {
        this.maxAge = maxAge;
        this.maxLength = maxLength;
        this.data = new Array();
        this.length = 0;
    }
    dispose() {
        this.data = (0, disposable_util_1.dispose)(this.data) || [];
    }
    add(ref) {
        const length = ref.object.textEditorModel.getValueLength();
        const handle = setTimeout(_dispose, this.maxAge);
        const entry = { length, dispose: _dispose };
        const self = this;
        function _dispose() {
            const idx = self.data.indexOf(entry);
            if (idx >= 0) {
                self.length -= length;
                ref.dispose();
                clearTimeout(handle);
                self.data.splice(idx, 1);
            }
        }
        ;
        this.data.push(entry);
        this.length += length;
        this.cleanup();
    }
    cleanup() {
        while (this.length > this.maxLength) {
            this.data[0].dispose();
        }
    }
}
exports.ModelReferenceCollection = ModelReferenceCollection;
class DocumentsMainImpl {
    constructor(editorsAndDocuments, modelService, rpc, editorManager, openerService, shell, untitledResourceResolver, languageService) {
        this.modelService = modelService;
        this.editorManager = editorManager;
        this.openerService = openerService;
        this.shell = shell;
        this.untitledResourceResolver = untitledResourceResolver;
        this.languageService = languageService;
        this.syncedModels = new Map();
        this.modelReferenceCache = new ModelReferenceCollection();
        this.saveTimeout = 1750;
        this.toDispose = new core_1.DisposableCollection(this.modelReferenceCache);
        this.proxy = rpc.getProxy(plugin_api_rpc_1.MAIN_RPC_CONTEXT.DOCUMENTS_EXT);
        this.toDispose.push(editorsAndDocuments);
        this.toDispose.push(editorsAndDocuments.onDocumentAdd(documents => documents.forEach(this.onModelAdded, this)));
        this.toDispose.push(editorsAndDocuments.onDocumentRemove(documents => documents.forEach(this.onModelRemoved, this)));
        this.toDispose.push(modelService.onModelModeChanged(this.onModelChanged, this));
        this.toDispose.push(modelService.onModelSaved(m => {
            this.proxy.$acceptModelSaved(m.textEditorModel.uri);
        }));
        this.toDispose.push(modelService.onModelWillSave(onWillSaveModelEvent => {
            onWillSaveModelEvent.waitUntil(new Promise(async (resolve, reject) => {
                setTimeout(() => reject(new Error(`Aborted onWillSaveTextDocument-event after ${this.saveTimeout}ms`)), this.saveTimeout);
                const edits = await this.proxy.$acceptModelWillSave(onWillSaveModelEvent.model.textEditorModel.uri, onWillSaveModelEvent.reason, this.saveTimeout);
                const editOperations = [];
                for (const edit of edits) {
                    const { range, text } = edit;
                    if (!range && !text) {
                        continue;
                    }
                    if (range && range.startLineNumber === range.endLineNumber && range.startColumn === range.endColumn && !edit.text) {
                        continue;
                    }
                    editOperations.push({
                        range: range ? monaco.Range.lift(range) : onWillSaveModelEvent.model.textEditorModel.getFullModelRange(),
                        /* eslint-disable-next-line no-null/no-null */
                        text: text || null,
                        forceMoveMarkers: edit.forceMoveMarkers
                    });
                }
                resolve(editOperations);
            }));
        }));
        this.toDispose.push(modelService.onModelDirtyChanged(m => {
            this.proxy.$acceptDirtyStateChanged(m.textEditorModel.uri, m.dirty);
        }));
    }
    dispose() {
        this.toDispose.dispose();
    }
    onModelChanged(event) {
        const modelUrl = event.model.textEditorModel.uri;
        if (this.syncedModels.has(modelUrl.toString())) {
            this.proxy.$acceptModelModeChanged(modelUrl, event.oldModeId, event.model.languageId);
        }
    }
    onModelAdded(model) {
        const modelUri = model.textEditorModel.uri;
        const key = modelUri.toString();
        const toDispose = new core_1.DisposableCollection(model.textEditorModel.onDidChangeContent(e => this.proxy.$acceptModelChanged(modelUri, {
            eol: e.eol,
            versionId: e.versionId,
            reason: e.isRedoing ? types_impl_1.TextDocumentChangeReason.Redo : e.isUndoing ? types_impl_1.TextDocumentChangeReason.Undo : undefined,
            changes: e.changes.map(c => ({
                text: c.text,
                range: c.range,
                rangeLength: c.rangeLength,
                rangeOffset: c.rangeOffset
            }))
        }, model.dirty)), core_1.Disposable.create(() => this.syncedModels.delete(key)));
        this.syncedModels.set(key, toDispose);
        this.toDispose.push(toDispose);
    }
    onModelRemoved(url) {
        const model = this.syncedModels.get(url.toString());
        if (model) {
            model.dispose();
        }
    }
    async $tryCreateDocument(options) {
        const language = (options === null || options === void 0 ? void 0 : options.language) && this.languageService.getExtension(options.language);
        const content = options === null || options === void 0 ? void 0 : options.content;
        const resource = await this.untitledResourceResolver.createUntitledResource(content, language);
        return monaco.Uri.parse(resource.uri.toString());
    }
    async $tryShowDocument(uri, options) {
        // Removing try-catch block here makes it not possible to handle errors.
        // Following message is appeared in browser console
        //   - Uncaught (in promise) Error: Cannot read property 'message' of undefined.
        try {
            const editorOptions = DocumentsMainImpl.toEditorOpenerOptions(this.shell, options);
            const uriArg = new uri_1.default(vscode_uri_1.URI.revive(uri));
            const opener = await this.openerService.getOpener(uriArg, editorOptions);
            await opener.open(uriArg, editorOptions);
        }
        catch (err) {
            throw new Error(err);
        }
    }
    async $trySaveDocument(uri) {
        const widget = await this.editorManager.getByUri(new uri_1.default(vscode_uri_1.URI.revive(uri)));
        if (widget) {
            await browser_1.Saveable.save(widget);
            return true;
        }
        return false;
    }
    async $tryOpenDocument(uri) {
        const ref = await this.modelService.createModelReference(new uri_1.default(vscode_uri_1.URI.revive(uri)));
        if (ref.object) {
            this.modelReferenceCache.add(ref);
            return true;
        }
        else {
            ref.dispose();
            return false;
        }
    }
    async $tryCloseDocument(uri) {
        const widget = await this.editorManager.getByUri(new uri_1.default(vscode_uri_1.URI.revive(uri)));
        if (widget) {
            await browser_1.Saveable.save(widget);
            widget.close();
            return true;
        }
        return false;
    }
    static toEditorOpenerOptions(shell, options) {
        if (!options) {
            return undefined;
        }
        let range;
        if (options.selection) {
            const selection = options.selection;
            range = {
                start: { line: selection.startLineNumber - 1, character: selection.startColumn - 1 },
                end: { line: selection.endLineNumber - 1, character: selection.endColumn - 1 }
            };
        }
        /* fall back to side group -> split relative to the active widget */
        let widgetOptions = { mode: 'split-right' };
        let viewColumn = options.viewColumn;
        if (viewColumn === -2) {
            /* show besides -> compute current column and adjust viewColumn accordingly */
            const tabBars = shell.mainAreaTabBars;
            const currentTabBar = shell.currentTabBar;
            if (currentTabBar) {
                const currentColumn = tabBars.indexOf(currentTabBar);
                if (currentColumn > -1) {
                    // +2 because conversion from 0-based to 1-based index and increase of 1
                    viewColumn = currentColumn + 2;
                }
            }
        }
        if (viewColumn === undefined || viewColumn === -1) {
            /* active group -> skip (default behaviour) */
            widgetOptions = undefined;
        }
        else if (viewColumn > 0 && shell.mainAreaTabBars.length > 0) {
            const tabBars = shell.mainAreaTabBars;
            if (viewColumn <= tabBars.length) {
                // convert to zero-based index
                const tabBar = tabBars[viewColumn - 1];
                if (tabBar === null || tabBar === void 0 ? void 0 : tabBar.currentTitle) {
                    widgetOptions = { ref: tabBar.currentTitle.owner };
                }
            }
            else {
                const tabBar = tabBars[tabBars.length - 1];
                if (tabBar === null || tabBar === void 0 ? void 0 : tabBar.currentTitle) {
                    widgetOptions.ref = tabBar.currentTitle.owner;
                }
            }
        }
        return {
            selection: range,
            mode: options.preserveFocus ? 'reveal' : 'activate',
            preview: options.preview,
            widgetOptions
        };
    }
}
exports.DocumentsMainImpl = DocumentsMainImpl;
//# sourceMappingURL=documents-main.js.map