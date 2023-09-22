import * as theia from '@theia/plugin';
import { NotebookDocument } from './notebook-document';
export declare class NotebookEditor {
    readonly id: string;
    readonly notebookData: NotebookDocument;
    static readonly apiEditorsToExtHost: WeakMap<theia.NotebookEditor, NotebookEditor>;
    private selections;
    private visibleRanges;
    private viewColumn?;
    private internalVisible;
    private editor?;
    constructor(id: string, notebookData: NotebookDocument, visibleRanges: theia.NotebookRange[], selections: theia.NotebookRange[], viewColumn: theia.ViewColumn | undefined);
    get apiEditor(): theia.NotebookEditor;
    get visible(): boolean;
    acceptVisibility(value: boolean): void;
    acceptVisibleRanges(value: theia.NotebookRange[]): void;
    acceptSelections(selections: theia.NotebookRange[]): void;
    private trySetSelections;
    acceptViewColumn(value: theia.ViewColumn | undefined): void;
}
//# sourceMappingURL=notebook-editor.d.ts.map