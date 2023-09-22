/// <reference types="react" />
import { CommandRegistry, DisposableCollection, MenuModelRegistry, MenuNode } from '@theia/core';
import * as React from '@theia/core/shared/react';
import { NotebookModel } from '../view-model/notebook-model';
import { NotebookKernelService } from '../service/notebook-kernel-service';
import { ContextKeyService } from '@theia/core/lib/browser/context-key-service';
export interface NotebookMainToolbarProps {
    notebookModel: NotebookModel;
    menuRegistry: MenuModelRegistry;
    notebookKernelService: NotebookKernelService;
    commandRegistry: CommandRegistry;
    contextKeyService: ContextKeyService;
}
export declare class NotebookMainToolbarRenderer {
    protected readonly notebookKernelService: NotebookKernelService;
    protected readonly commandRegistry: CommandRegistry;
    protected readonly menuRegistry: MenuModelRegistry;
    protected readonly contextKeyService: ContextKeyService;
    render(notebookModel: NotebookModel): React.ReactNode;
}
export declare class NotebookMainToolbar extends React.Component<NotebookMainToolbarProps, {
    selectedKernelLabel?: string;
}> {
    protected toDispose: DisposableCollection;
    constructor(props: NotebookMainToolbarProps);
    componentWillUnmount(): void;
    render(): React.ReactNode;
    protected renderMenuItem(item: MenuNode): React.ReactNode;
    private getMenuItems;
}
//# sourceMappingURL=notebook-main-toolbar.d.ts.map