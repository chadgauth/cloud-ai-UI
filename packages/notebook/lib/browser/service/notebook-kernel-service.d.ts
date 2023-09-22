import { Command, CommandRegistry, Disposable, Emitter, Event, URI } from '@theia/core';
import { StorageService } from '@theia/core/lib/browser';
import { NotebookKernelSourceAction } from '../../common';
import { NotebookModel } from '../view-model/notebook-model';
import { NotebookService } from './notebook-service';
export interface SelectedNotebookKernelChangeEvent {
    notebook: URI;
    oldKernel: string | undefined;
    newKernel: string | undefined;
}
export interface NotebookKernelMatchResult {
    readonly selected: NotebookKernel | undefined;
    readonly suggestions: NotebookKernel[];
    readonly all: NotebookKernel[];
    readonly hidden: NotebookKernel[];
}
export interface NotebookKernelChangeEvent {
    label?: true;
    description?: true;
    detail?: true;
    supportedLanguages?: true;
    hasExecutionOrder?: true;
    hasInterruptHandler?: true;
}
export interface NotebookKernel {
    readonly id: string;
    readonly viewType: string;
    readonly onDidChange: Event<Readonly<NotebookKernelChangeEvent>>;
    readonly extension: string;
    readonly localResourceRoot: URI;
    readonly preloadUris: URI[];
    readonly preloadProvides: string[];
    label: string;
    description?: string;
    detail?: string;
    supportedLanguages: string[];
    implementsInterrupt?: boolean;
    implementsExecutionOrder?: boolean;
    executeNotebookCellsRequest(uri: URI, cellHandles: number[]): Promise<void>;
    cancelNotebookCellExecution(uri: URI, cellHandles: number[]): Promise<void>;
}
export declare const enum ProxyKernelState {
    Disconnected = 1,
    Connected = 2,
    Initializing = 3
}
export interface INotebookProxyKernelChangeEvent extends NotebookKernelChangeEvent {
    connectionState?: true;
}
export interface NotebookKernelDetectionTask {
    readonly notebookType: string;
}
export interface NotebookTextModelLike {
    uri: URI;
    viewType: string;
}
export interface NotebookSourceActionChangeEvent {
    notebook?: URI;
    viewType: string;
}
export interface KernelSourceActionProvider {
    readonly viewType: string;
    onDidChangeSourceActions?: Event<void>;
    provideKernelSourceActions(): Promise<NotebookKernelSourceAction[]>;
}
export declare class SourceCommand implements Disposable {
    readonly commandRegistry: CommandRegistry;
    readonly command: Command;
    readonly model: NotebookTextModelLike;
    readonly isPrimary: boolean;
    execution: Promise<void> | undefined;
    protected readonly onDidChangeStateEmitter: Emitter<void>;
    readonly onDidChangeState: Event<void>;
    constructor(commandRegistry: CommandRegistry, command: Command, model: NotebookTextModelLike, isPrimary: boolean);
    run(): Promise<void>;
    private runCommand;
    dispose(): void;
}
export declare class NotebookKernelService implements Disposable {
    protected notebookService: NotebookService;
    protected storageService: StorageService;
    private readonly kernels;
    private notebookBindings;
    private readonly kernelDetectionTasks;
    private readonly onDidChangeKernelDetectionTasksEmitter;
    readonly onDidChangeKernelDetectionTasks: Event<string>;
    private readonly onDidChangeSourceActionsEmitter;
    private readonly kernelSourceActionProviders;
    readonly onDidChangeSourceActions: Event<NotebookSourceActionChangeEvent>;
    private readonly onDidAddKernelEmitter;
    readonly onDidAddKernel: Event<NotebookKernel>;
    private readonly onDidRemoveKernelEmitter;
    readonly onDidRemoveKernel: Event<NotebookKernel>;
    private readonly onDidChangeSelectedNotebookKernelBindingEmitter;
    readonly onDidChangeSelectedKernel: Event<SelectedNotebookKernelChangeEvent>;
    private readonly onDidChangeNotebookAffinityEmitter;
    readonly onDidChangeNotebookAffinity: Event<void>;
    init(): void;
    registerKernel(kernel: NotebookKernel): Disposable;
    getMatchingKernel(notebook: NotebookTextModelLike): NotebookKernelMatchResult;
    selectKernelForNotebook(kernel: NotebookKernel | undefined, notebook: NotebookTextModelLike): void;
    getSelectedOrSuggestedKernel(notebook: NotebookModel): NotebookKernel | undefined;
    getKernel(id: string): NotebookKernel | undefined;
    private static score;
    private tryAutoBindNotebook;
    registerNotebookKernelDetectionTask(task: NotebookKernelDetectionTask): Disposable;
    getKernelDetectionTasks(notebook: NotebookTextModelLike): NotebookKernelDetectionTask[];
    registerKernelSourceActionProvider(viewType: string, provider: KernelSourceActionProvider): Disposable;
    getKernelSourceActionsFromProviders(notebook: NotebookTextModelLike): Promise<NotebookKernelSourceAction[]>;
    dispose(): void;
}
//# sourceMappingURL=notebook-kernel-service.d.ts.map