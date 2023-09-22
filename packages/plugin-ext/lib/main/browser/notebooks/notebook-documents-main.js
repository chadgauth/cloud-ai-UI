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
exports.NotebookDocumentsMainImpl = void 0;
const core_1 = require("@theia/core");
const uri_1 = require("@theia/core/lib/common/uri");
const browser_1 = require("@theia/notebook/lib/browser");
const common_1 = require("@theia/notebook/lib/common");
const common_2 = require("../../../common");
const notebook_dto_1 = require("./notebook-dto");
class NotebookDocumentsMainImpl {
    constructor(rpc, container) {
        this.disposables = new core_1.DisposableCollection();
        this.documentEventListenersMapping = new Map();
        this.proxy = rpc.getProxy(common_2.MAIN_RPC_CONTEXT.NOTEBOOK_DOCUMENTS_EXT);
        this.notebookModelResolverService = container.get(browser_1.NotebookModelResolverService);
        // forward dirty and save events
        this.disposables.push(this.notebookModelResolverService.onDidChangeDirty(model => this.proxy.$acceptDirtyStateChanged(model.uri.toComponents(), model.isDirty())));
        this.disposables.push(this.notebookModelResolverService.onDidSaveNotebook(e => this.proxy.$acceptModelSaved(e)));
    }
    dispose() {
        this.disposables.dispose();
        // this.modelReferenceCollection.dispose();
        this.documentEventListenersMapping.forEach(value => value.dispose());
    }
    handleNotebooksAdded(notebooks) {
        for (const textModel of notebooks) {
            const disposableStore = new core_1.DisposableCollection();
            disposableStore.push(textModel.onDidChangeContent(event => {
                const eventDto = {
                    versionId: 1,
                    rawEvents: []
                };
                for (const e of event.rawEvents) {
                    switch (e.kind) {
                        case common_1.NotebookCellsChangeType.ModelChange:
                            eventDto.rawEvents.push({
                                kind: e.kind,
                                changes: e.changes.map(diff => [diff[0], diff[1], diff[2].map(notebook_dto_1.NotebookDto.toNotebookCellDto)])
                            });
                            break;
                        case common_1.NotebookCellsChangeType.Move:
                            eventDto.rawEvents.push({
                                kind: e.kind,
                                index: e.index,
                                length: e.length,
                                newIdx: e.newIdx,
                            });
                            break;
                        case common_1.NotebookCellsChangeType.Output:
                            eventDto.rawEvents.push({
                                kind: e.kind,
                                index: e.index,
                                outputs: e.outputs.map(notebook_dto_1.NotebookDto.toNotebookOutputDto)
                            });
                            break;
                        case common_1.NotebookCellsChangeType.OutputItem:
                            eventDto.rawEvents.push({
                                kind: e.kind,
                                index: e.index,
                                outputId: e.outputId,
                                outputItems: e.outputItems.map(notebook_dto_1.NotebookDto.toNotebookOutputItemDto),
                                append: e.append
                            });
                            break;
                        case common_1.NotebookCellsChangeType.ChangeCellLanguage:
                        case common_1.NotebookCellsChangeType.ChangeCellContent:
                        case common_1.NotebookCellsChangeType.ChangeCellMetadata:
                        case common_1.NotebookCellsChangeType.ChangeCellInternalMetadata:
                            eventDto.rawEvents.push(e);
                            break;
                    }
                }
                const hasDocumentMetadataChangeEvent = event.rawEvents.find(e => e.kind === common_1.NotebookCellsChangeType.ChangeDocumentMetadata);
                // using the model resolver service to know if the model is dirty or not.
                // assuming this is the first listener it can mean that at first the model
                // is marked as dirty and that another event is fired
                this.proxy.$acceptModelChanged(textModel.uri.toComponents(), eventDto, textModel.isDirty(), hasDocumentMetadataChangeEvent ? textModel.metadata : undefined);
            }));
            this.documentEventListenersMapping.set(textModel.uri.toString(), disposableStore);
        }
    }
    handleNotebooksRemoved(uris) {
        var _a;
        for (const uri of uris) {
            (_a = this.documentEventListenersMapping.get(uri.toString())) === null || _a === void 0 ? void 0 : _a.dispose();
            this.documentEventListenersMapping.delete(uri.toString());
        }
    }
    async $tryCreateNotebook(options) {
        const ref = await this.notebookModelResolverService.resolve({ untitledResource: undefined }, options.viewType);
        // untitled notebooks are disposed when they get saved. we should not hold a reference
        // to such a disposed notebook and therefore dispose the reference as well
        // ref.onWillDispose(() => {
        //     ref.dispose();
        // });
        // untitled notebooks are dirty by default
        this.proxy.$acceptDirtyStateChanged(ref.uri.toComponents(), true);
        // apply content changes... slightly HACKY -> this triggers a change event
        // if (options.content) {
        //     const data = NotebookDto.fromNotebookDataDto(options.content);
        //     ref.notebook.reset(data.cells, data.metadata, ref.object.notebook.transientOptions);
        // }
        return ref.uri.toComponents();
    }
    async $tryOpenNotebook(uriComponents) {
        const uri = uri_1.URI.fromComponents(uriComponents);
        return uri.toComponents();
    }
    async $trySaveNotebook(uriComponents) {
        const uri = uri_1.URI.fromComponents(uriComponents);
        const ref = await this.notebookModelResolverService.resolve(uri);
        await ref.save({});
        ref.dispose();
        return true;
    }
}
exports.NotebookDocumentsMainImpl = NotebookDocumentsMainImpl;
//# sourceMappingURL=notebook-documents-main.js.map