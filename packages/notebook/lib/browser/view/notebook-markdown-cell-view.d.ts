/// <reference types="react" />
import * as React from '@theia/core/shared/react';
import { NotebookModel } from '../view-model/notebook-model';
import { CellRenderer } from './notebook-cell-list-view';
import { NotebookCellModel } from '../view-model/notebook-cell-model';
import { MonacoEditorServices } from '@theia/monaco/lib/browser/monaco-editor';
export declare class NotebookMarkdownCellRenderer implements CellRenderer {
    private readonly markdownRenderer;
    protected readonly monacoServices: MonacoEditorServices;
    render(notebookModel: NotebookModel, cell: NotebookCellModel): React.ReactNode;
}
//# sourceMappingURL=notebook-markdown-cell-view.d.ts.map