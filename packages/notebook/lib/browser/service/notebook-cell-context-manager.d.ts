import { ContextKeyService, ScopedValueStore } from '@theia/core/lib/browser/context-key-service';
import { NotebookCellModel } from '../view-model/notebook-cell-model';
import { Disposable, DisposableCollection, Emitter } from '@theia/core';
import { NotebookExecutionStateService } from '../service/notebook-execution-state-service';
export declare class NotebookCellContextManager implements Disposable {
    protected contextKeyService: ContextKeyService;
    protected readonly executionStateService: NotebookExecutionStateService;
    protected readonly toDispose: DisposableCollection;
    protected currentStore: ScopedValueStore;
    protected currentContext: HTMLLIElement;
    protected readonly onDidChangeContextEmitter: Emitter<void>;
    readonly onDidChangeContext: import("@theia/core").Event<void>;
    updateCellContext(cell: NotebookCellModel, newHtmlContext: HTMLLIElement): void;
    dispose(): void;
}
//# sourceMappingURL=notebook-cell-context-manager.d.ts.map