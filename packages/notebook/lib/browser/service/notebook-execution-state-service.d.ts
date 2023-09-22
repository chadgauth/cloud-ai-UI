import { Disposable, URI } from '@theia/core';
import { NotebookService } from './notebook-service';
import { CellExecuteOutputEdit, CellExecuteOutputItemEdit, CellExecutionUpdateType, NotebookCellExecutionState, CellEditOperation } from '../../common';
import { NotebookModel } from '../view-model/notebook-model';
export declare type CellExecuteUpdate = CellExecuteOutputEdit | CellExecuteOutputItemEdit | CellExecutionStateUpdate;
export interface CellExecutionComplete {
    runEndTime?: number;
    lastRunSuccess?: boolean;
}
export interface CellExecutionStateUpdate {
    editType: CellExecutionUpdateType.ExecutionState;
    executionOrder?: number;
    runStartTime?: number;
    didPause?: boolean;
    isPaused?: boolean;
}
export interface ICellExecutionStateUpdate {
    editType: CellExecutionUpdateType.ExecutionState;
    executionOrder?: number;
    runStartTime?: number;
    didPause?: boolean;
    isPaused?: boolean;
}
export interface ICellExecutionStateUpdate {
    editType: CellExecutionUpdateType.ExecutionState;
    executionOrder?: number;
    runStartTime?: number;
    didPause?: boolean;
    isPaused?: boolean;
}
export interface ICellExecutionComplete {
    runEndTime?: number;
    lastRunSuccess?: boolean;
}
export declare enum NotebookExecutionType {
    cell = 0,
    notebook = 1
}
export interface NotebookFailStateChangedEvent {
    visible: boolean;
    notebook: URI;
}
export interface FailedCellInfo {
    cellHandle: number;
    disposable: Disposable;
    visible: boolean;
}
export declare class NotebookExecutionStateService implements Disposable {
    protected notebookService: NotebookService;
    protected readonly executions: Map<string, CellExecution>;
    private readonly onDidChangeExecutionEmitter;
    onDidChangeExecution: import("@theia/core").Event<CellExecutionStateChangedEvent>;
    private readonly onDidChangeLastRunFailStateEmitter;
    onDidChangeLastRunFailState: import("@theia/core").Event<NotebookFailStateChangedEvent>;
    createCellExecution(notebookUri: URI, cellHandle: number): CellExecution;
    private createNotebookCellExecution;
    private onCellExecutionDidComplete;
    getCellExecution(cellUri: URI): CellExecution | undefined;
    dispose(): void;
}
export declare class CellExecution implements Disposable {
    readonly cellHandle: number;
    private readonly notebook;
    private readonly onDidUpdateEmitter;
    readonly onDidUpdate: import("@theia/core").Event<void>;
    private readonly onDidCompleteEmitter;
    readonly onDidComplete: import("@theia/core").Event<boolean | undefined>;
    private _state;
    get state(): NotebookCellExecutionState;
    get notebookURI(): URI;
    private _didPause;
    get didPause(): boolean;
    private _isPaused;
    get isPaused(): boolean;
    constructor(cellHandle: number, notebook: NotebookModel);
    initialize(): void;
    private getCellLog;
    confirm(): void;
    update(updates: CellExecuteUpdate[]): void;
    complete(completionData: CellExecutionComplete): void;
    dispose(): void;
    private applyExecutionEdits;
}
export declare class CellExecutionStateChangedEvent {
    readonly notebook: URI;
    readonly cellHandle: number;
    readonly changed?: CellExecution | undefined;
    readonly type = NotebookExecutionType.cell;
    constructor(notebook: URI, cellHandle: number, changed?: CellExecution | undefined);
    affectsCell(cell: URI): boolean;
    affectsNotebook(notebook: URI): boolean;
}
export declare function updateToEdit(update: CellExecuteUpdate, cellHandle: number): CellEditOperation;
//# sourceMappingURL=notebook-execution-state-service.d.ts.map