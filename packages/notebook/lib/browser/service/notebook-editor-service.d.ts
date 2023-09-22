import { Disposable } from '@theia/core';
import { ApplicationShell } from '@theia/core/lib/browser';
import { NotebookEditorWidget } from '../notebook-editor-widget';
export declare class NotebookEditorWidgetService implements Disposable {
    protected applicationShell: ApplicationShell;
    private readonly notebookEditors;
    private readonly onNotebookEditorAddEmitter;
    private readonly onNotebookEditorsRemoveEmitter;
    readonly onDidAddNotebookEditor: import("@theia/core").Event<NotebookEditorWidget>;
    readonly onDidRemoveNotebookEditor: import("@theia/core").Event<NotebookEditorWidget>;
    private readonly onFocusedEditorChangedEmitter;
    readonly onFocusedEditorChanged: import("@theia/core").Event<NotebookEditorWidget>;
    private readonly toDispose;
    currentFocusedEditor?: NotebookEditorWidget;
    protected init(): void;
    dispose(): void;
    addNotebookEditor(editor: NotebookEditorWidget): void;
    removeNotebookEditor(editor: NotebookEditorWidget): void;
    getNotebookEditor(editorId: string): NotebookEditorWidget | undefined;
    listNotebookEditors(): readonly NotebookEditorWidget[];
}
//# sourceMappingURL=notebook-editor-service.d.ts.map