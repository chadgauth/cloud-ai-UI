/// <reference types="react" />
import * as React from '@theia/core/shared/react';
import { interfaces } from '@theia/core/shared/inversify';
import { NotebookRendererMessagingService, CellOutputWebview, NotebookRendererRegistry, NotebookEditorWidgetService } from '@theia/notebook/lib/browser';
import { NotebookCellModel } from '@theia/notebook/lib/browser/view-model/notebook-cell-model';
import { WebviewWidget } from '../../webview/webview';
import { WidgetManager } from '@theia/core/lib/browser';
import { WorkspaceTrustService } from '@theia/workspace/lib/browser';
import { NotebookCellOutputsSplice } from '@theia/notebook/lib/common';
import { Disposable, DisposableCollection, QuickPickService } from '@theia/core';
export declare function createCellOutputWebviewContainer(ctx: interfaces.Container, cell: NotebookCellModel): interfaces.Container;
export declare class CellOutputWebviewImpl implements CellOutputWebview, Disposable {
    protected readonly messagingService: NotebookRendererMessagingService;
    protected readonly cell: NotebookCellModel;
    protected readonly widgetManager: WidgetManager;
    protected readonly workspaceTrustService: WorkspaceTrustService;
    protected readonly notebookRendererRegistry: NotebookRendererRegistry;
    protected readonly notebookEditorWidgetService: NotebookEditorWidgetService;
    protected readonly quickPickService: QuickPickService;
    readonly id: string;
    protected readonly elementRef: React.RefObject<HTMLDivElement>;
    protected outputPresentationListeners: DisposableCollection;
    protected webviewWidget: WebviewWidget;
    protected init(): Promise<void>;
    render(): React.JSX.Element;
    attachWebview(): void;
    isAttached(): boolean;
    updateOutput(update: NotebookCellOutputsSplice): void;
    private requestOutputPresentationUpdate;
    private handleWebviewMessage;
    private createWebviewContent;
    private preloadsScriptString;
    dispose(): void;
}
//# sourceMappingURL=cell-output-webview.d.ts.map