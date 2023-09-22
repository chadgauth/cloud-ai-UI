import * as theia from '@theia/plugin';
import { UriComponents } from '../../common/uri-components';
import { NotebookCellsChangedEventDto, NotebookDocumentsExt } from '../../common';
import { NotebooksExtImpl } from './notebooks';
export declare type NotebookDocumentMetadata = Record<string, unknown>;
export declare class NotebookDocumentsExtImpl implements NotebookDocumentsExt {
    private readonly notebooksAndEditors;
    private readonly didSaveNotebookDocumentEmitter;
    readonly onDidSaveNotebookDocument: import("@theia/core").Event<theia.NotebookDocument>;
    private readonly didChangeNotebookDocumentEmitter;
    readonly onDidChangeNotebookDocument: import("@theia/core").Event<theia.NotebookDocumentChangeEvent>;
    constructor(notebooksAndEditors: NotebooksExtImpl);
    $acceptModelChanged(uri: UriComponents, event: NotebookCellsChangedEventDto, isDirty: boolean, newMetadata?: NotebookDocumentMetadata): void;
    $acceptDirtyStateChanged(uri: UriComponents, isDirty: boolean): void;
    $acceptModelSaved(uri: UriComponents): void;
}
//# sourceMappingURL=notebook-documents.d.ts.map