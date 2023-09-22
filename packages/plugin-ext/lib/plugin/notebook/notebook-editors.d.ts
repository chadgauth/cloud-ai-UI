import { NotebookEditorPropertiesChangeData, NotebookEditorsExt, NotebookEditorViewColumnInfo } from '../../common';
import * as theia from '@theia/plugin';
import { NotebooksExtImpl } from './notebooks';
export declare class NotebookEditorsExtImpl implements NotebookEditorsExt {
    private readonly notebooksAndEditors;
    private readonly DidChangeNotebookEditorSelectionEmitter;
    private readonly DidChangeNotebookEditorVisibleRangesEmitter;
    readonly onDidChangeNotebookEditorSelection: import("@theia/core").Event<theia.NotebookEditorSelectionChangeEvent>;
    readonly onDidChangeNotebookEditorVisibleRanges: import("@theia/core").Event<theia.NotebookEditorVisibleRangesChangeEvent>;
    constructor(notebooksAndEditors: NotebooksExtImpl);
    $acceptEditorPropertiesChanged(id: string, data: NotebookEditorPropertiesChangeData): void;
    $acceptEditorViewColumns(data: NotebookEditorViewColumnInfo): void;
}
//# sourceMappingURL=notebook-editors.d.ts.map