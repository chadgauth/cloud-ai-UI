import { Disposable, DisposableCollection, Emitter, Event, URI } from '@theia/core';
import { interfaces } from '@theia/core/shared/inversify';
import { MonacoEditorModel } from '@theia/monaco/lib/browser/monaco-editor-model';
import { MonacoTextModelService } from '@theia/monaco/lib/browser/monaco-text-model-service';
import { CellInternalMetadataChangedEvent, CellKind, NotebookCellCollapseState, NotebookCellInternalMetadata, NotebookCellMetadata, NotebookCellOutputsSplice, CellOutput, CellData, NotebookCell } from '../../common';
import { NotebookCellOutputModel } from './notebook-cell-output-model';
export declare const NotebookCellModelFactory: unique symbol;
export declare function createNotebookCellModelContainer(parent: interfaces.Container, props: NotebookCellModelProps, notebookCellContextManager: new (...args: never[]) => unknown): interfaces.Container;
declare const NotebookCellContextManager: unique symbol;
interface NotebookCellContextManager {
    updateCellContext(cell: NotebookCellModel, context: HTMLElement): void;
    dispose(): void;
    onDidChangeContext: Event<void>;
}
export interface NotebookCellModelProps {
    readonly uri: URI;
    readonly handle: number;
    source: string;
    language: string;
    readonly cellKind: CellKind;
    outputs: CellOutput[];
    metadata?: NotebookCellMetadata | undefined;
    internalMetadata?: NotebookCellInternalMetadata | undefined;
    readonly collapseState?: NotebookCellCollapseState | undefined;
}
export declare class NotebookCellModel implements NotebookCell, Disposable {
    protected readonly onDidChangeOutputsEmitter: Emitter<NotebookCellOutputsSplice>;
    readonly onDidChangeOutputs: Event<NotebookCellOutputsSplice>;
    protected readonly onDidChangeOutputItemsEmitter: Emitter<void>;
    readonly onDidChangeOutputItems: Event<void>;
    protected readonly onDidChangeContentEmitter: Emitter<"content" | "language" | "mime">;
    readonly onDidChangeContent: Event<'content' | 'language' | 'mime'>;
    protected readonly onDidChangeMetadataEmitter: Emitter<void>;
    readonly onDidChangeMetadata: Event<void>;
    protected readonly onDidChangeInternalMetadataEmitter: Emitter<CellInternalMetadataChangedEvent>;
    readonly onDidChangeInternalMetadata: Event<CellInternalMetadataChangedEvent>;
    protected readonly onDidChangeLanguageEmitter: Emitter<string>;
    readonly onDidChangeLanguage: Event<string>;
    protected readonly onDidRequestCellEditChangeEmitter: Emitter<boolean>;
    readonly onDidRequestCellEditChange: Event<boolean>;
    readonly notebookCellContextManager: NotebookCellContextManager;
    protected readonly props: NotebookCellModelProps;
    protected readonly textModelService: MonacoTextModelService;
    get outputs(): NotebookCellOutputModel[];
    protected _outputs: NotebookCellOutputModel[];
    get metadata(): NotebookCellMetadata;
    protected _metadata: NotebookCellMetadata;
    protected toDispose: DisposableCollection;
    protected _internalMetadata: NotebookCellInternalMetadata;
    get internalMetadata(): NotebookCellInternalMetadata;
    set internalMetadata(newInternalMetadata: NotebookCellInternalMetadata);
    textModel: MonacoEditorModel;
    protected htmlContext: HTMLLIElement;
    get context(): HTMLLIElement;
    get textBuffer(): string;
    get source(): string;
    set source(source: string);
    get language(): string;
    set language(newLanguage: string);
    get uri(): URI;
    get handle(): number;
    get cellKind(): CellKind;
    protected init(): void;
    refChanged(node: HTMLLIElement): void;
    dispose(): void;
    requestEdit(): void;
    requestStopEdit(): void;
    spliceNotebookCellOutputs(splice: NotebookCellOutputsSplice): void;
    replaceOutputItems(outputId: string, newOutputItem: CellOutput): boolean;
    getData(): CellData;
    resolveTextModel(): Promise<MonacoEditorModel>;
}
export {};
//# sourceMappingURL=notebook-cell-model.d.ts.map