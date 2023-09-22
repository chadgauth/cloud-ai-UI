import { CancellationToken } from '@theia/plugin';
import { NotebookKernelsExt, NotebookKernelSourceActionDto } from '../../common';
import { RPCProtocol } from '../../common/rpc-protocol';
import { UriComponents } from '../../common/uri-components';
import * as theia from '@theia/plugin';
import { Disposable } from '@theia/core';
import { NotebooksExtImpl } from './notebooks';
import { NotebookCellExecutionState } from '@theia/notebook/lib/common';
import { CommandRegistryImpl } from '../command-registry';
import { NotebookRendererScript } from '../types-impl';
export declare class NotebookKernelsExtImpl implements NotebookKernelsExt {
    private readonly notebooks;
    private readonly commands;
    private readonly activeExecutions;
    private readonly kernelData;
    private readonly proxy;
    private kernelDetectionTasks;
    private currentKernelDetectionTaskHandle;
    private kernelSourceActionProviders;
    private currentSourceActionProviderHandle;
    private readonly onDidChangeCellExecutionStateEmitter;
    readonly onDidChangeNotebookCellExecutionState: import("@theia/core").Event<theia.NotebookCellExecutionStateChangeEvent>;
    constructor(rpc: RPCProtocol, notebooks: NotebooksExtImpl, commands: CommandRegistryImpl);
    private currentHandle;
    createNotebookController(extensionId: string, id: string, viewType: string, label: string, handler?: (cells: theia.NotebookCell[], notebook: theia.NotebookDocument, controller: theia.NotebookController) => void | Thenable<void>, rendererScripts?: NotebookRendererScript[]): theia.NotebookController;
    createNotebookCellExecution(cell: theia.NotebookCell, controllerId: string): theia.NotebookCellExecution;
    createNotebookControllerDetectionTask(viewType: string): theia.NotebookControllerDetectionTask;
    registerKernelSourceActionProvider(viewType: string, provider: theia.NotebookKernelSourceActionProvider): Disposable;
    $acceptNotebookAssociation(handle: number, uri: UriComponents, value: boolean): void;
    $executeCells(handle: number, uri: UriComponents, handles: number[]): Promise<void>;
    $cancelCells(handle: number, uri: UriComponents, handles: number[]): Promise<void>;
    $acceptKernelMessageFromRenderer(handle: number, editorId: string, message: unknown): void;
    $cellExecutionChanged(uri: UriComponents, cellHandle: number, state: NotebookCellExecutionState | undefined): void;
    $provideKernelSourceActions(handle: number, token: CancellationToken): Promise<NotebookKernelSourceActionDto[]>;
}
export declare function createKernelId(extensionIdentifier: string, id: string): string;
//# sourceMappingURL=notebook-kernels.d.ts.map