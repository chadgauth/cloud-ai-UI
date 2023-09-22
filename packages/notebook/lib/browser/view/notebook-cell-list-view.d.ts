/// <reference types="react" />
import * as React from '@theia/core/shared/react';
import { CellKind } from '../../common';
import { NotebookCellModel } from '../view-model/notebook-cell-model';
import { NotebookModel } from '../view-model/notebook-model';
import { NotebookCellToolbarFactory } from './notebook-cell-toolbar-factory';
import { CommandRegistry, DisposableCollection } from '@theia/core';
export interface CellRenderer {
    render(notebookData: NotebookModel, cell: NotebookCellModel, index: number): React.ReactNode;
}
interface CellListProps {
    renderers: Map<CellKind, CellRenderer>;
    notebookModel: NotebookModel;
    toolbarRenderer: NotebookCellToolbarFactory;
    commandRegistry: CommandRegistry;
}
interface NotebookCellListState {
    selectedCell?: NotebookCellModel;
    dragOverIndicator: {
        cell: NotebookCellModel;
        position: 'top' | 'bottom';
    } | undefined;
}
export declare class NotebookCellListView extends React.Component<CellListProps, NotebookCellListState> {
    protected toDispose: DisposableCollection;
    constructor(props: CellListProps);
    componentWillUnmount(): void;
    render(): React.ReactNode;
    renderCellContent(cell: NotebookCellModel, index: number): React.ReactNode;
    protected onDragStart(event: React.DragEvent<HTMLLIElement>, index: number): void;
    protected onDragOver(event: React.DragEvent<HTMLLIElement>, cell: NotebookCellModel, position?: 'top' | 'bottom'): void;
    protected onDrop(event: React.DragEvent<HTMLLIElement>, dropElementIndex: number): void;
    protected onAddNewCell(kind: CellKind, index: number): void;
    protected shouldRenderDragOverIndicator(cell: NotebookCellModel, position: 'top' | 'bottom'): boolean;
}
export interface NotebookCellDividerProps {
    onAddNewCell: (type: CellKind) => void;
    onDrop: (event: React.DragEvent<HTMLLIElement>) => void;
    onDragOver: (event: React.DragEvent<HTMLLIElement>) => void;
}
export declare function NotebookCellDivider({ onAddNewCell, onDrop, onDragOver }: NotebookCellDividerProps): React.JSX.Element;
export {};
//# sourceMappingURL=notebook-cell-list-view.d.ts.map