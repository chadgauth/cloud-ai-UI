/// <reference types="react" />
import * as React from '@theia/core/shared/react';
import { NotebookCellToolbarItem } from './notebook-cell-toolbar-factory';
import { DisposableCollection, Event } from '@theia/core';
export interface NotebookCellToolbarProps {
    getMenuItems: () => NotebookCellToolbarItem[];
    onContextKeysChanged: Event<void>;
}
interface NotebookCellToolbarState {
    inlineItems: NotebookCellToolbarItem[];
}
declare abstract class NotebookCellActionItems extends React.Component<NotebookCellToolbarProps, NotebookCellToolbarState> {
    protected toDispose: DisposableCollection;
    constructor(props: NotebookCellToolbarProps);
    componentWillUnmount(): void;
    protected renderItem(item: NotebookCellToolbarItem): React.ReactNode;
}
export declare class NotebookCellToolbar extends NotebookCellActionItems {
    render(): React.ReactNode;
}
export declare class NotebookCellSidebar extends NotebookCellActionItems {
    render(): React.ReactNode;
}
export {};
//# sourceMappingURL=notebook-cell-toolbar.d.ts.map