import { Command, CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry } from '@theia/core';
import { ApplicationShell } from '@theia/core/lib/browser';
import { NotebookService } from '../service/notebook-service';
import { KernelPickerMRUStrategy } from '../service/notebook-kernel-quick-pick-service';
import { NotebookExecutionService } from '../service/notebook-execution-service';
export declare namespace NotebookCommands {
    const ADD_NEW_CELL_COMMAND: Command;
    const ADD_NEW_MARKDOWN_CELL_COMMAND: Command;
    const ADD_NEW_CODE_CELL_COMMAND: Command;
    const SELECT_KERNEL_COMMAND: Command;
    const EXECUTE_NOTEBOOK_COMMAND: Command;
    const CLEAR_ALL_OUTPUTS_COMMAND: Command;
}
export declare class NotebookActionsContribution implements CommandContribution, MenuContribution {
    protected notebookService: NotebookService;
    protected notebookKernelQuickPickService: KernelPickerMRUStrategy;
    protected notebookExecutionService: NotebookExecutionService;
    protected shell: ApplicationShell;
    registerCommands(commands: CommandRegistry): void;
    registerMenus(menus: MenuModelRegistry): void;
}
export declare namespace NotebookMenus {
    const NOTEBOOK_MAIN_TOOLBAR = "notebook/toolbar";
    const NOTEBOOK_MAIN_TOOLBAR_CELL_ADD_GROUP: string[];
    const NOTEBOOK_MAIN_TOOLBAR_EXECUTION_GROUP: string[];
}
//# sourceMappingURL=notebook-actions-contribution.d.ts.map