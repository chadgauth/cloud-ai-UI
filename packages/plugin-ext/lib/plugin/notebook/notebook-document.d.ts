import * as theia from '@theia/plugin';
import * as rpc from '../../common';
import { EditorsAndDocumentsExtImpl } from '../editors-and-documents';
import * as notebookCommon from '@theia/notebook/lib/common';
import { Disposable, URI } from '@theia/core';
import { ModelAddedData, NotebookCellDto, NotebookCellsChangedEventDto, NotebookModelAddedData, NotebookOutputDto } from '../../common';
import { DocumentsExtImpl } from '../documents';
export declare class Cell {
    readonly notebookDocument: NotebookDocument;
    private readonly editorsAndDocuments;
    private readonly cellData;
    static asModelAddData(notebook: theia.NotebookDocument, cell: NotebookCellDto): ModelAddedData & {
        notebook: theia.NotebookDocument;
    };
    private cell;
    readonly handle: number;
    readonly uri: URI;
    readonly cellKind: notebookCommon.CellKind;
    private outputs;
    private metadata;
    private previousResult;
    internalMetadata: notebookCommon.NotebookCellInternalMetadata;
    get language(): string;
    constructor(notebookDocument: NotebookDocument, editorsAndDocuments: EditorsAndDocumentsExtImpl, cellData: rpc.NotebookCellDto);
    get apiCell(): theia.NotebookCell;
    setOutputs(newOutputs: NotebookOutputDto[]): void;
    setMetadata(newMetadata: notebookCommon.NotebookCellMetadata): void;
    setInternalMetadata(newInternalMetadata: notebookCommon.NotebookCellInternalMetadata): void;
}
export declare class NotebookDocument implements Disposable {
    private readonly proxy;
    private readonly editorsAndDocuments;
    private readonly textDocuments;
    readonly uri: theia.Uri;
    private readonly cells;
    private readonly notebookType;
    private notebook?;
    private metadata;
    private versionId;
    private isDirty;
    private disposed;
    constructor(proxy: rpc.NotebookDocumentsMain, editorsAndDocuments: EditorsAndDocumentsExtImpl, textDocuments: DocumentsExtImpl, uri: theia.Uri, notebookData: NotebookModelAddedData);
    get apiNotebook(): theia.NotebookDocument;
    private validateIndex;
    private validateRange;
    private getCells;
    private save;
    acceptDirty(isDirty: boolean): void;
    acceptModelChanged(event: NotebookCellsChangedEventDto, isDirty: boolean, newMetadata: notebookCommon.NotebookDocumentMetadata | undefined): theia.NotebookDocumentChangeEvent;
    private spliceNotebookCells;
    private moveCells;
    private setCellOutputs;
    private changeCellLanguage;
    private changeCellMetadata;
    private changeCellInternalMetadata;
    getCellFromApiCell(apiCell: theia.NotebookCell): Cell | undefined;
    getCell(cellHandle: number): Cell | undefined;
    getCellFromIndex(index: number): Cell | undefined;
    getCellIndex(cell: Cell): number;
    dispose(): void;
}
//# sourceMappingURL=notebook-document.d.ts.map