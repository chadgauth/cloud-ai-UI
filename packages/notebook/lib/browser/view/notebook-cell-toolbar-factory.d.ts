/// <reference types="react" />
import * as React from '@theia/core/shared/react';
import { CommandRegistry, MenuModelRegistry } from '@theia/core';
import { ContextKeyService } from '@theia/core/lib/browser/context-key-service';
import { ContextMenuRenderer } from '@theia/core/lib/browser';
import { NotebookModel } from '../view-model/notebook-model';
import { NotebookCellModel } from '../view-model/notebook-cell-model';
import { NotebookCellOutputModel } from '../view-model/notebook-cell-output-model';
export interface NotebookCellToolbarItem {
    id: string;
    icon?: string;
    label?: string;
    onClick: (e: React.MouseEvent) => void;
}
export declare class NotebookCellToolbarFactory {
    protected menuRegistry: MenuModelRegistry;
    protected contextKeyService: ContextKeyService;
    protected readonly contextMenuRenderer: ContextMenuRenderer;
    protected readonly commandRegistry: CommandRegistry;
    renderCellToolbar(menuPath: string[], notebookModel: NotebookModel, cell: NotebookCellModel): React.ReactNode;
    renderSidebar(menuPath: string[], notebookModel: NotebookModel, cell: NotebookCellModel, output?: NotebookCellOutputModel): React.ReactNode;
    private getMenuItems;
    private createToolbarItem;
}
//# sourceMappingURL=notebook-cell-toolbar-factory.d.ts.map