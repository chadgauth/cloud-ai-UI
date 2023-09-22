import { StorageService } from '@theia/core/lib/browser';
import { NotebookKernel, NotebookTextModelLike, NotebookKernelService } from './notebook-kernel-service';
import { Disposable } from '@theia/core';
interface MostRecentKernelsResult {
    selected?: NotebookKernel;
    all: NotebookKernel[];
}
export declare class NotebookKernelHistoryService implements Disposable {
    protected storageService: StorageService;
    protected notebookKernelService: NotebookKernelService;
    serviceBrand: undefined;
    private static STORAGE_KEY;
    private mostRecentKernelsMap;
    protected init(): void;
    getKernels(notebook: NotebookTextModelLike): MostRecentKernelsResult;
    addMostRecentKernel(kernel: NotebookKernel): void;
    private saveState;
    private loadState;
    clear(): void;
    dispose(): void;
}
export {};
//# sourceMappingURL=notebook-kernel-history-service.d.ts.map