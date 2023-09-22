import { Disposable, URI } from '@theia/core';
import { Saveable, SaveOptions } from '@theia/core/lib/browser';
import { CellEditOperation, NotebookData, NotebookDocumentMetadata, NotebookModelWillAddRemoveEvent, NotebookTextModelChangedEvent } from '../../common';
import { NotebookSerializer } from '../service/notebook-service';
import { NotebookCellModel, NotebookCellModelProps } from './notebook-cell-model';
import { MonacoTextModelService } from '@theia/monaco/lib/browser/monaco-text-model-service';
import { interfaces } from '@theia/core/shared/inversify';
import { NotebookKernel } from '../service/notebook-kernel-service';
export declare const NotebookModelFactory: unique symbol;
export declare function createNotebookModelContainer(parent: interfaces.Container, props: NotebookModelProps): interfaces.Container;
export interface NotebookModelProps {
    data: NotebookData;
    uri: URI;
    viewType: string;
    serializer: NotebookSerializer;
}
export declare class NotebookModel implements Saveable, Disposable {
    private props;
    private cellModelFactory;
    private readonly onDirtyChangedEmitter;
    readonly onDirtyChanged: import("@theia/core").Event<void>;
    private readonly onDidSaveNotebookEmitter;
    readonly onDidSaveNotebook: import("@theia/core").Event<void>;
    private readonly onDidAddOrRemoveCellEmitter;
    readonly onDidAddOrRemoveCell: import("@theia/core").Event<NotebookModelWillAddRemoveEvent>;
    private readonly onDidChangeContentEmitter;
    readonly onDidChangeContent: import("@theia/core").Event<NotebookTextModelChangedEvent>;
    private readonly fileService;
    private readonly undoRedoService;
    readonly autoSave: 'off' | 'afterDelay' | 'onFocusChange' | 'onWindowChange';
    nextHandle: number;
    kernel?: NotebookKernel;
    dirty: boolean;
    selectedCell?: NotebookCellModel;
    private dirtyCells;
    cells: NotebookCellModel[];
    get uri(): URI;
    get viewType(): string;
    metadata: NotebookDocumentMetadata;
    constructor(props: NotebookModelProps, modelService: MonacoTextModelService, cellModelFactory: (props: NotebookCellModelProps) => NotebookCellModel);
    dispose(): void;
    save(options: SaveOptions): Promise<void>;
    createSnapshot(): Saveable.Snapshot;
    revert(options?: Saveable.RevertOptions): Promise<void>;
    isDirty(): boolean;
    cellDirtyChanged(cell: NotebookCellModel, dirtyState: boolean): void;
    undo(): void;
    redo(): void;
    setSelectedCell(cell: NotebookCellModel): void;
    private addCellOutputListeners;
    applyEdits(rawEdits: CellEditOperation[], computeUndoRedo: boolean): void;
    private replaceCells;
    private changeCellInternalMetadataPartial;
    private updateNotebookMetadata;
    private changeCellLanguage;
    private moveCellToIndex;
    private getCellIndexByHandle;
}
//# sourceMappingURL=notebook-model.d.ts.map