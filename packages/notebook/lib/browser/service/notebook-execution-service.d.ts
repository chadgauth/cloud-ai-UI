import { CellExecution, NotebookExecutionStateService } from '../service/notebook-execution-state-service';
import { NotebookCellModel } from '../view-model/notebook-cell-model';
import { NotebookModel } from '../view-model/notebook-model';
import { NotebookKernelService, NotebookKernel } from './notebook-kernel-service';
import { CommandService, Disposable } from '@theia/core';
import { NotebookKernelQuickPickServiceImpl } from './notebook-kernel-quick-pick-service';
import { NotebookKernelHistoryService } from './notebook-kernel-history-service';
export interface CellExecutionParticipant {
    onWillExecuteCell(executions: CellExecution[]): Promise<void>;
}
export declare class NotebookExecutionService {
    protected notebookExecutionStateService: NotebookExecutionStateService;
    protected notebookKernelService: NotebookKernelService;
    protected notebookKernelHistoryService: NotebookKernelHistoryService;
    protected commandService: CommandService;
    protected notebookKernelQuickPickService: NotebookKernelQuickPickServiceImpl;
    private readonly cellExecutionParticipants;
    executeNotebookCells(notebook: NotebookModel, cells: Iterable<NotebookCellModel>): Promise<void>;
    registerExecutionParticipant(participant: CellExecutionParticipant): Disposable;
    private runExecutionParticipants;
    cancelNotebookCellHandles(notebook: NotebookModel, cells: Iterable<number>): Promise<void>;
    cancelNotebookCells(notebook: NotebookModel, cells: Iterable<NotebookCellModel>): Promise<void>;
    resolveKernel(notebook: NotebookModel): Promise<NotebookKernel | undefined>;
}
//# sourceMappingURL=notebook-execution-service.d.ts.map