/// <reference types="react" />
import * as React from '@theia/core/shared/react';
import { MonacoEditorServices } from '@theia/monaco/lib/browser/monaco-editor';
import { CellOutputWebviewFactory, CellOutputWebview } from '../renderers/cell-output-webview';
import { NotebookRendererRegistry } from '../notebook-renderer-registry';
import { NotebookCellModel } from '../view-model/notebook-cell-model';
import { NotebookModel } from '../view-model/notebook-model';
import { CellRenderer } from './notebook-cell-list-view';
import { NotebookCellToolbarFactory } from './notebook-cell-toolbar-factory';
import { CellExecution, NotebookExecutionStateService } from '../service/notebook-execution-state-service';
import { DisposableCollection } from '@theia/core';
export declare class NotebookCodeCellRenderer implements CellRenderer {
    protected readonly monacoServices: MonacoEditorServices;
    protected readonly notebookRendererRegistry: NotebookRendererRegistry;
    protected readonly cellOutputWebviewFactory: CellOutputWebviewFactory;
    protected readonly notebookCellToolbarFactory: NotebookCellToolbarFactory;
    protected readonly executionStateService: NotebookExecutionStateService;
    render(notebookModel: NotebookModel, cell: NotebookCellModel, handle: number): React.ReactNode;
}
export interface NotebookCodeCellStatusProps {
    cell: NotebookCellModel;
    executionStateService: NotebookExecutionStateService;
}
export declare class NotebookCodeCellStatus extends React.Component<NotebookCodeCellStatusProps, {
    currentExecution?: CellExecution;
}> {
    protected toDispose: DisposableCollection;
    constructor(props: NotebookCodeCellStatusProps);
    componentWillUnmount(): void;
    render(): React.ReactNode;
    private renderExecutionState;
    private getExecutionTime;
}
interface NotebookCellOutputProps {
    cell: NotebookCellModel;
    outputWebviewFactory: CellOutputWebviewFactory;
    renderSidebar: () => React.ReactNode;
}
export declare class NotebookCodeCellOutputs extends React.Component<NotebookCellOutputProps> {
    protected outputsWebview: CellOutputWebview | undefined;
    constructor(props: NotebookCellOutputProps);
    componentDidMount(): Promise<void>;
    componentDidUpdate(): void;
    render(): React.ReactNode;
}
export {};
//# sourceMappingURL=notebook-code-cell-view.d.ts.map