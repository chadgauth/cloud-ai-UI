/// <reference types="react" />
import { CommandRegistry, MenuModelRegistry, URI } from '@theia/core';
import { ReactWidget, Navigatable, SaveableSource, Message, SaveableDelegate } from '@theia/core/lib/browser';
import { ReactNode } from '@theia/core/shared/react';
import { CellKind } from '../common';
import { CellRenderer as CellRenderer } from './view/notebook-cell-list-view';
import { NotebookCodeCellRenderer } from './view/notebook-code-cell-view';
import { NotebookMarkdownCellRenderer } from './view/notebook-markdown-cell-view';
import { NotebookModel } from './view-model/notebook-model';
import { NotebookCellToolbarFactory } from './view/notebook-cell-toolbar-factory';
import { interfaces } from '@theia/core/shared/inversify';
import { Emitter } from '@theia/core/shared/vscode-languageserver-protocol';
import { NotebookEditorWidgetService } from './service/notebook-editor-service';
import { NotebookMainToolbarRenderer } from './view/notebook-main-toolbar';
export declare const NotebookEditorContainerFactory: unique symbol;
export declare function createNotebookEditorWidgetContainer(parent: interfaces.Container, props: NotebookEditorProps): interfaces.Container;
export interface NotebookEditorProps {
    uri: URI;
    readonly notebookType: string;
    notebookData: Promise<NotebookModel>;
}
export declare const NOTEBOOK_EDITOR_ID_PREFIX = "notebook:";
export declare class NotebookEditorWidget extends ReactWidget implements Navigatable, SaveableSource {
    private readonly props;
    static readonly ID = "notebook";
    readonly saveable: SaveableDelegate;
    protected readonly cellToolbarFactory: NotebookCellToolbarFactory;
    protected commandRegistry: CommandRegistry;
    protected menuRegistry: MenuModelRegistry;
    protected notebookEditorService: NotebookEditorWidgetService;
    protected notebookMainToolbarRenderer: NotebookMainToolbarRenderer;
    protected readonly onDidChangeModelEmitter: Emitter<void>;
    readonly onDidChangeModel: import("vscode-jsonrpc/lib/common/events").Event<void>;
    protected readonly renderers: Map<CellKind, CellRenderer>;
    protected _model?: NotebookModel;
    get notebookType(): string;
    get model(): NotebookModel | undefined;
    constructor(codeCellRenderer: NotebookCodeCellRenderer, markdownCellRenderer: NotebookMarkdownCellRenderer, props: NotebookEditorProps);
    protected waitForData(): Promise<void>;
    protected onActivateRequest(msg: Message): void;
    getResourceUri(): URI | undefined;
    createMoveToUri(resourceUri: URI): URI | undefined;
    undo(): void;
    redo(): void;
    protected render(): ReactNode;
    protected onAfterAttach(msg: Message): void;
    protected onAfterDetach(msg: Message): void;
}
//# sourceMappingURL=notebook-editor-widget.d.ts.map