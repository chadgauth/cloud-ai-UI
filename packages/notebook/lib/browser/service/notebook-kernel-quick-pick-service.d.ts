import { Command, CommandService, QuickInputService, QuickPickInput, QuickPickItem } from '@theia/core';
import { NotebookKernelService, NotebookKernel, NotebookKernelMatchResult, SourceCommand } from './notebook-kernel-service';
import { NotebookModel } from '../view-model/notebook-model';
import { NotebookEditorWidget } from '../notebook-editor-widget';
import { OpenerService } from '@theia/core/lib/browser';
import { NotebookKernelHistoryService } from './notebook-kernel-history-service';
export declare const JUPYTER_EXTENSION_ID = "ms-toolsai.jupyter";
export declare const NotebookKernelQuickPickService: unique symbol;
declare type KernelPick = QuickPickItem & {
    kernel: NotebookKernel;
};
declare type GroupedKernelsPick = QuickPickItem & {
    kernels: NotebookKernel[];
    source: string;
};
declare type SourcePick = QuickPickItem & {
    action: SourceCommand;
};
declare type InstallExtensionPick = QuickPickItem & {
    extensionIds: string[];
};
declare type KernelSourceQuickPickItem = QuickPickItem & {
    command: Command;
    documentation?: string;
};
declare type KernelQuickPickItem = (QuickPickItem & {
    autoRun?: boolean;
}) | InstallExtensionPick | KernelPick | GroupedKernelsPick | SourcePick | KernelSourceQuickPickItem;
export declare type KernelQuickPickContext = {
    id: string;
    extension: string;
} | {
    notebookEditorId: string;
} | {
    id: string;
    extension: string;
    notebookEditorId: string;
} | {
    ui?: boolean;
    notebookEditor?: NotebookEditorWidget;
};
export declare abstract class NotebookKernelQuickPickServiceImpl {
    protected readonly notebookKernelService: NotebookKernelService;
    protected readonly quickInputService: QuickInputService;
    protected readonly commandService: CommandService;
    showQuickPick(editor: NotebookModel, wantedId?: string, skipAutoRun?: boolean): Promise<boolean>;
    protected getMatchingResult(notebook: NotebookModel): NotebookKernelMatchResult;
    protected abstract getKernelPickerQuickPickItems(matchResult: NotebookKernelMatchResult): QuickPickInput<KernelQuickPickItem>[];
    protected handleQuickPick(editor: NotebookModel, pick: KernelQuickPickItem, quickPickItems: KernelQuickPickItem[]): Promise<boolean>;
    protected selectKernel(notebook: NotebookModel, kernel: NotebookKernel): void;
}
export declare class KernelPickerMRUStrategy extends NotebookKernelQuickPickServiceImpl {
    protected openerService: OpenerService;
    protected notebookKernelHistoryService: NotebookKernelHistoryService;
    protected getKernelPickerQuickPickItems(matchResult: NotebookKernelMatchResult): QuickPickInput<KernelQuickPickItem>[];
    protected selectKernel(notebook: NotebookModel, kernel: NotebookKernel): void;
    protected getMatchingResult(notebook: NotebookModel): NotebookKernelMatchResult;
    protected handleQuickPick(editor: NotebookModel, pick: KernelQuickPickItem, items: KernelQuickPickItem[]): Promise<boolean>;
    private displaySelectAnotherQuickPick;
    private calculateKernelSources;
    private selectOneKernel;
    private executeCommand;
}
export {};
//# sourceMappingURL=notebook-kernel-quick-pick-service.d.ts.map