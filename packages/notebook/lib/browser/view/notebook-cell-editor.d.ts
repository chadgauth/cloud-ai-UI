/// <reference types="react" />
import * as React from '@theia/core/shared/react';
import { NotebookModel } from '../view-model/notebook-model';
import { NotebookCellModel } from '../view-model/notebook-cell-model';
import { MonacoCodeEditor } from '@theia/monaco/lib/browser/monaco-code-editor';
import { MonacoEditorServices } from '@theia/monaco/lib/browser/monaco-editor';
import { DisposableCollection } from '@theia/core';
interface CellEditorProps {
    notebookModel: NotebookModel;
    cell: NotebookCellModel;
    monacoServices: MonacoEditorServices;
}
export declare class CellEditor extends React.Component<CellEditorProps, {}> {
    protected editor?: MonacoCodeEditor;
    protected toDispose: DisposableCollection;
    protected container?: HTMLDivElement;
    componentDidMount(): void;
    componentWillUnmount(): void;
    protected disposeEditor(): void;
    protected initEditor(): Promise<void>;
    protected assignRef: (component: HTMLDivElement) => void;
    protected handleResize: () => void;
    render(): React.ReactNode;
}
export {};
//# sourceMappingURL=notebook-cell-editor.d.ts.map